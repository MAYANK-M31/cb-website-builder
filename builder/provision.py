import os
import subprocess

import frappe
import jwt

from builder.auth import CREATORBASE_JWT_SECRET

EXPECTED_PID = "provision"


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


def run_provision(subdomain: str, creator_id: int, prod: int) -> dict:
    flag = "--prod" if prod else "--dev"
    result = subprocess.run(
        [provision_script(), subdomain, str(creator_id), flag],
        capture_output=True,
        text=True,
        timeout=180,
    )
    if result.returncode != 0:
        frappe.log_error(result.stderr[-2000:], "builder.provision_site")
        frappe.throw("Provisioning failed", frappe.ValidationError)

    suffix = "creatorbase.live" if prod else "localhost"
    return {"ok": True, "site": f"{subdomain}.{suffix}", "output": result.stdout.strip()}


@frappe.whitelist(allow_guest=True)
def status(subdomain: str = "", prod: int = 0) -> dict:
    """Whether a site directory exists for the given subdomain."""
    if not authorized():
        frappe.throw("Unauthorized", frappe.PermissionError)
    suffix = "creatorbase.live" if prod else "localhost"
    site = f"{subdomain}.{suffix}"
    return {"exists": os.path.isdir(f"/home/frappe/frappe-bench/sites/{site}"), "site": site}


@frappe.whitelist(allow_guest=True)
def provision_site(subdomain: str = "", creator_id: int | None = None, prod: int = 0) -> dict:
    """Provision/rename a creator's site. Runs provision_site.sh locally inside
    this container, so it can be called cross-container without docker exec."""
    if not authorized():
        frappe.throw("Unauthorized", frappe.PermissionError)
    if not subdomain or creator_id is None:
        frappe.throw("subdomain and creator_id are required", frappe.ValidationError)
    return run_provision(subdomain, creator_id, prod)