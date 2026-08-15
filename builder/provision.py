import json
import os
import subprocess
import time

import frappe
import jwt

from builder.auth import CREATORBASE_JWT_SECRET

EXPECTED_PID = "provision"

SITES_ROOT = "/home/frappe/frappe-bench/sites"
PROVISION_MARKER = ".provisioned"
LOCK_SUFFIX = ".provision.lock"
LOG_DIR = "/tmp/provision-logs"

# A provision lock older than this is considered stale even if its recorded pid
# happens to be alive (pid reuse, or a lock left behind by a pre-`echo $$` run
# that recorded the long-lived RPC worker pid). Fresh provisioning takes minutes,
# never hours, so this only fires for genuinely orphaned locks.
LOCK_MAX_AGE = 3600


def site_config(subdomain: str, prod: int) -> dict:
    """The site's site_config.json ({} when missing/unreadable)."""
    path = os.path.join(site_dir(subdomain, prod), "site_config.json")
    try:
        with open(path) as f:
            return json.load(f)
    except (OSError, ValueError, json.JSONDecodeError):
        return {}


def site_db_name(subdomain: str, prod: int) -> str | None:
    return site_config(subdomain, prod).get("db_name")


def site_creator_id(subdomain: str, prod: int) -> int | None:
    try:
        return int(site_config(subdomain, prod).get("creatorbase_creator_id", 0) or 0) or None
    except (TypeError, ValueError):
        return None


def creator_id_from_db_name(db_name: str | None) -> int | None:
    """Derive the creator id from the standard DB name `creatorbase_frappe_<id>`.

    Serves as a fallback when an interrupted provision never wrote
    `creatorbase_creator_id` into site_config but the per-creator DB already
    exists (the DB is always named by creator id)."""
    if not db_name or not db_name.startswith("creatorbase_frappe_"):
        return None
    try:
        return int(db_name[len("creatorbase_frappe_"):]) or None
    except ValueError:
        return None


def db_exists(db_name: str | None) -> bool:
    """Whether the site's Postgres database actually exists on the shared server.

    A site_directory can outlive its database: a Postgres volume reset, a manual
    DROP DATABASE, or a restore from an older snapshot all leave the site dir +
    `.provisioned` marker behind while the DB (and all its data) is gone. This is
    the check that lets provision/status detect that state and re-provision."""
    if not db_name:
        return False
    try:
        import psycopg2

        conn = psycopg2.connect(
            host=os.environ.get("POSTGRES_HOST", "postgres"),
            port=int(os.environ.get("POSTGRES_PORT", "5432")),
            user=os.environ.get("POSTGRES_USER", "postgres"),
            password=os.environ.get("POSTGRES_PASSWORD", ""),
            dbname="postgres",
        )
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
                return cur.fetchone() is not None
        finally:
            conn.close()
    except Exception:
        return False

# The site root "/" is stored as an empty route (identical to what the builder
# frontend persists for a home page) so the web resolvers match it when the
# request path is stripped to "".
HOMEPAGE_ROUTE = ""

# Shipped template groups (builder/builder_templates/). The first group whose
# template page synced into this site is used to seed the home page.
DEFAULT_TEMPLATE_GROUPS = ("creatorbase", "masterclass", "executive", "fitness", "personal_help", "elevate")


def provision_token() -> str | None:
    raw = frappe.get_request_header("X-Provision-Token", "")
    if not raw:
        return None
    try:
        payload = jwt.decode(
            raw,
            CREATORBASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_exp": True},
        )
    except Exception:
        return None
    return payload.get("pid")


def authorized() -> bool:
    return provision_token() == EXPECTED_PID


def provision_script() -> str:
    return os.environ.get("PROVISION_SCRIPT", "/workspace/provision_site.sh")


def site_name(subdomain: str, prod: int) -> str:
    suffix = "creatorbase.live" if prod else "localhost"
    return f"{subdomain}.{suffix}"


def site_dir(subdomain: str, prod: int) -> str:
    return os.path.join(SITES_ROOT, site_name(subdomain, prod))


def site_marker(subdomain: str, prod: int) -> str:
    return os.path.join(site_dir(subdomain, prod), PROVISION_MARKER)


def lock_path(subdomain: str, prod: int) -> str:
    return f"{site_dir(subdomain, prod)}{LOCK_SUFFIX}"


def pid_alive(pid: int) -> bool:
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return False
    except PermissionError:
        return True
    return True


def lock_held(path: str) -> bool:
    """Whether a provision lock is still held by a live process.

    The lock file is stamped by provision_site.sh with the *script's* own pid
    (echo $$), so a lock whose recorded pid is dead means the script was killed
    mid-run (container restart, OOM, SIGKILL) and the lock is stale — the site
    must not be reported as "provisioning" forever and should self-heal. An
    older-than-LOCK_MAX_AGE lock is stale even if the pid looks alive (pid reuse,
    or a pre-`echo $$` lock holding the RPC worker's pid)."""
    if not os.path.exists(path):
        return False
    try:
        age = time.time() - os.path.getmtime(path)
        with open(path) as f:
            pid = int(f.read().strip() or 0)
    except (OSError, ValueError):
        return False
    return pid > 0 and pid_alive(pid) and age < LOCK_MAX_AGE


def acquire_lock(path: str) -> bool:
    """Atomically claim the provisioning lock. Returns False when another
    provision is already running (a stale lock from a dead pid is reclaimed)."""
    for attempt in range(2):
        try:
            fd = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            with os.fdopen(fd, "w") as f:
                f.write(str(os.getpid()))
            return True
        except FileExistsError:
            if attempt:
                return False
            if lock_held(path):
                return False
            # stale lock from a killed provision — reclaim it
            try:
                os.remove(path)
            except OSError:
                return False
    return False


def release_lock(path: str) -> None:
    try:
        os.remove(path)
    except OSError:
        pass


def is_provisioned(subdomain: str, prod: int) -> bool:
    return os.path.isfile(site_marker(subdomain, prod)) and db_exists(
        site_db_name(subdomain, prod)
    )


def spawn_provision(subdomain: str, creator_id: int, prod: int, lock: str) -> None:
    """Run provision_site.sh detached so the RPC returns immediately. The script
    removes the lock (via trap) and writes the `.provisioned` marker on success."""
    os.makedirs(LOG_DIR, exist_ok=True)
    log = os.path.join(LOG_DIR, f"{site_name(subdomain, prod)}.log")
    flag = "--prod" if prod else "--dev"
    env = dict(os.environ)
    env["PROVISION_LOCK_FILE"] = lock
    with open(log, "ab") as log_fh:
        subprocess.Popen(
            [provision_script(), subdomain, str(creator_id), flag],
            stdin=subprocess.DEVNULL,
            stdout=log_fh,
            stderr=subprocess.STDOUT,
            start_new_session=True,
            env=env,
        )


@frappe.whitelist(allow_guest=True)
def status(subdomain: str = "", prod: int = 0) -> dict:
    """Whether a site directory exists for the given subdomain and, once the
    builder app is installed and fixtures synced (`.provisioned` marker), whether
    it is ready to serve. Also exposes whether provisioning is in-flight.

    `ready` also requires the site's Postgres database to still exist — a site dir
    can survive a dropped/reset DB, and in that state the site is broken (every
    request 500s on connect), so it must not be reported as ready.

    When the site dir exists but is not fully provisioned (DB dropped while the
    `.provisioned` marker remains, or provisioning was interrupted before the
    marker was written), a re-provision is launched in the background so the site
    heals itself on the caller's next poll."""
    if not authorized():
        frappe.throw("Unauthorized", frappe.PermissionError)
    exists = os.path.isdir(site_dir(subdomain, prod))
    db = site_db_name(subdomain, prod)
    marker = exists and os.path.isfile(site_marker(subdomain, prod))
    db_ok = db_exists(db) if db else False
    lock = lock_path(subdomain, prod)

    # Self-heal whenever the site dir exists but isn't fully provisioned (marker
    # or DB missing) and no provision is actually running. A stale lock left by a
    # killed provision script (dead pid) is reclaimed rather than treated as
    # in-flight, so the site can't sit in "provisioning" forever.
    if exists and not (marker and db_ok) and not lock_held(lock):
        creator_id = site_creator_id(subdomain, prod) or creator_id_from_db_name(db)
        if creator_id:
            if acquire_lock(lock):
                try:
                    spawn_provision(subdomain, creator_id, prod, lock)
                except Exception:
                    release_lock(lock)
                    frappe.log_error(
                        f"Failed to start repair provision for {subdomain}", "builder.provision_status"
                    )

    return {
        "exists": exists,
        "ready": exists and marker and db_ok,
        "ready_marker": marker,
        "provisioning": lock_held(lock),
        "site": site_name(subdomain, prod),
        "db_name": db,
        "db_exists": db_ok,
    }


@frappe.whitelist(allow_guest=True)
def provision_site(subdomain: str = "", creator_id: int | None = None, prod: int = 0) -> dict:
    """Provision/repair a creator's site. Runs provision_site.sh locally inside
    this container, so it can be called cross-container without docker exec.

    Provisioning runs in the BACKGROUND (a fresh site takes minutes): the RPC
    returns immediately with ``provisioning: True``, and callers poll
    ``status()`` until ``ready``. Already-provisioned sites short-circuit."""
    if not authorized():
        frappe.throw("Unauthorized", frappe.PermissionError)
    if not subdomain or creator_id is None:
        frappe.throw("subdomain and creator_id are required", frappe.ValidationError)
    if is_provisioned(subdomain, prod):
        return {"ok": True, "ready": True, "provisioning": False, "site": site_name(subdomain, prod)}

    lock = lock_path(subdomain, prod)
    if not acquire_lock(lock):
        # another provision is already running; let the caller poll status()
        return {"ok": True, "ready": False, "provisioning": True, "site": site_name(subdomain, prod)}

    try:
        spawn_provision(subdomain, creator_id, prod, lock)
    except Exception:
        release_lock(lock)
        frappe.log_error(f"Failed to start provision for {subdomain}", "builder.provision_site")
        frappe.throw("Provisioning failed", frappe.ValidationError)

    return {"ok": True, "ready": False, "provisioning": True, "site": site_name(subdomain, prod)}


def default_template_page() -> str | None:
    """Pick a shipped template page to seed the home page.

    Prefers the first template group (by DEFAULT_TEMPLATE_GROUPS order) whose
    page exists in this site; falls back to any other local template page so the
    provisioning always produces a home page when templates were synced."""
    for group in DEFAULT_TEMPLATE_GROUPS:
        page = frappe.db.get_value(
            "Builder Page", {"is_template": 1, "template_group": group}, "name"
        )
        if page:
            return page
    return frappe.db.get_value("Builder Page", {"is_template": 1}, "name") or None


def create_homepage(subdomain: str = "", prod: int = 0, template_page: str | None = None) -> dict:
    """Ensure the creator's site has a published home page at the site root.

    Clones a shipped template page into a real, published Builder Page routed to
    "/" (stored as an empty route) and marks it as the home page in Builder
    Settings. Runs on the creator's own site at the end of provision_site.sh via
    `bench --site <site> execute builder.provision.create_homepage`. Idempotent:
    no-op when a home page already exists, so re-provisioning never duplicates.

    Not whitelisted: it is an internal provision hook (bench-mounted, running as
    the site Administrator) rather than an external RPC."""
    existing = frappe.db.get_value(
        "Builder Page", {"route": HOMEPAGE_ROUTE, "published": 1}, "name"
    )
    home_page = frappe.db.get_single_value("Builder Settings", "home_page")
    if existing or home_page:
        return {"ok": True, "created": False, "page": existing, "route": home_page or "/"}

    page_name = template_page or default_template_page()
    if not page_name:
        return {"ok": False, "created": False, "error": "No template page available to seed home page"}

    from builder.api import create_page_from_local_template

    new_page = create_page_from_local_template(page_name)
    frappe.db.set_value(
        "Builder Page",
        new_page,
        {"route": HOMEPAGE_ROUTE, "published": 1, "published_at": frappe.utils.now()},
        update_modified=False,
    )
    frappe.db.set_value("Builder Settings", "Builder Settings", "home_page", HOMEPAGE_ROUTE, update_modified=False)
    frappe.db.commit()
    frappe.clear_cache()
    return {"ok": True, "created": True, "page": new_page, "route": "/", "from_template": page_name}
