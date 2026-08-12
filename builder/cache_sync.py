# Copyright (c) 2026, CreatorBase and contributors
# For license information, please see license.txt

import os
from collections.abc import Iterable

import frappe
import requests

PURGE_URL_TMPL = "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache"
PURGE_BATCH_SIZE = 30
PUBLIC_DOMAIN = "creatorbase.live"


def get_site_subdomain() -> str | None:
	"""First label of the current request host, e.g. `mayank` from
	`mayank.builder.gateway.creatorbase.live`. Background jobs have no request,
	so callers should capture and pass the site explicitly at enqueue time."""
	host = ""
	request = getattr(frappe.local, "request", None)
	if request:
		host = request.host.split(":")[0]
	labels = host.split(".")
	if not host or len(labels) < 2:
		return None
	return labels[0]


def build_purge_origin(site: str, host: str = "") -> str | None:
	"""Public origin the edge cache keys on (`https://{site}.creatorbase.live`).

	Prefer the real request host over VITE_CREATORBASE_WEBAPP_DOMAIN: the compose
	container loads the dev env file (a localhost template), which would silently
	fail prod purges. Local hosts have no CDN, so return None."""
	if host and PUBLIC_DOMAIN in host and "localhost" not in host:
		return f"https://{site}.{PUBLIC_DOMAIN}"
	template = os.environ.get("VITE_CREATORBASE_WEBAPP_DOMAIN", "")
	if not template:
		return None
	origin = template.replace("{{subdomain}}", site).replace("{subdomain}", site)
	if "localhost" in origin:
		return None
	return f"https://{origin}" if not origin.startswith("http") else origin


def build_page_urls(routes: Iterable[str], origin: str) -> list[str]:
	urls: set[str] = set()
	for route in routes or []:
		path = (route or "").strip()
		if not path or path == "/":
			urls.add(origin)
			urls.add(f"{origin}/")
			continue
		path = path if path.startswith("/") else f"/{path}"
		urls.add(f"{origin}{path}")
		urls.add(f"{origin}{path}/")
	return sorted(urls)


def purge_page_urls(routes: Iterable[str], site: str, origin: str | None = None) -> None:
	"""Delete the given page routes for a site from the Cloudflare edge cache.
	Configured via CLOUDFLARE_API_TOKEN (Zone->Cache Purge) and CLOUDFLARE_ZONE_ID."""
	origin = origin or build_purge_origin(site)
	if not origin:
		frappe.log_error(f"Edge-cache purge skipped: no public origin for site={site}", "builder.cache_sync")
		return
	urls = build_page_urls(routes, origin)
	if not urls:
		return
	token = os.environ.get("CLOUDFLARE_API_TOKEN", "")
	zone_id = os.environ.get("CLOUDFLARE_ZONE_ID", "")
	if not token or not zone_id:
		frappe.log_error(
			"Edge-cache purge skipped: CLOUDFLARE_API_TOKEN/CLOUDFLARE_ZONE_ID not set in container env",
			"builder.cache_sync",
		)
		return
	endpoint = PURGE_URL_TMPL.format(zone_id=zone_id)
	for i in range(0, len(urls), PURGE_BATCH_SIZE):
		batch = urls[i : i + PURGE_BATCH_SIZE]
		resp = requests.post(
			endpoint,
			headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
			json={"files": batch},
			timeout=30,
		)
		if not resp.ok:
			frappe.log_error(
				f"Edge-cache purge failed {resp.status_code}: {resp.text[:500]}", "builder.cache_sync"
			)


def enqueue_purge(routes: Iterable[str], site: str | None = None) -> None:
	"""Queue an edge-cache purge after the current transaction commits. The site and
	public origin are captured here because background jobs lose `frappe.local.request`."""
	site = site or get_site_subdomain()
	routes = [route for route in routes or [] if route]
	if not site or not routes:
		return
	host = ""
	request = getattr(frappe.local, "request", None)
	if request:
		host = request.host.split(":")[0]
	origin = build_purge_origin(site, host)
	if not origin:
		frappe.log_error(
			f"Edge-cache purge skipped: no public origin for site={site} host={host}",
			"builder.cache_sync",
		)
		return
	frappe.enqueue(
		"builder.cache_sync.purge_page_urls",
		routes=routes,
		site=site,
		origin=origin,
		queue="short",
		enqueue_after_commit=True,
	)
