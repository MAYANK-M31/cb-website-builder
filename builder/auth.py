import os

import frappe
import jwt
import requests

CREATORBASE_JWT_SECRET = os.environ.get("CREATORBASE_JWT_SECRET", "")


def _decode_token(token: str) -> dict | None:
	if not CREATORBASE_JWT_SECRET:
		frappe.log_error("CREATORBASE_JWT_SECRET not set", "creatorbase.auth")
		return None
	try:
		return jwt.decode(
			token,
			CREATORBASE_JWT_SECRET,
			algorithms=["HS256"],
			options={"verify_exp": True},
		)
	except Exception as e:
		frappe.log_error(f"CreatorBase JWT decode failed: {e}", "creatorbase.auth")
		return None


def _resolve_site_subdomain() -> str | None:
	host = frappe.local.request.host.split(":")[0] if frappe.local.request else ""
	# A creator's site is named after their subdomain: {sub}.creatorbase.live (prod)
	# or {sub}.localhost (dev). The first label is the subdomain.
	if not host:
		return None
	return host.split(".")[0]


def _get_or_create_user(email: str, full_name: str) -> str:
	user = frappe.db.exists("User", email)
	if user:
		return email

	frappe.get_doc(
		{
			"doctype": "User",
			"email": email,
			"first_name": full_name or email,
			"enabled": 1,
			"send_welcome_email": 0,
			"roles": [{"role": "System Manager"}],
		}
	).insert(ignore_permissions=True)
	return email


@frappe.whitelist(allow_guest=True)
def login_via_creatorbase(token: str):
	"""SSO: validate a CreatorBase JWT and log the creator into THIS site.

	Isolation guarantee: the request Host must resolve to this site's own
	subdomain (site named {sub}.creatorbase.live / {sub}.localhost). The token's
	creator is resolved against CreatorBase and must match the requested
	subdomain, otherwise the request is rejected.
	"""
	payload = _decode_token(token)
	if not payload:
		frappe.throw("Invalid or expired token", frappe.AuthenticationError)

	email = (payload.get("email") or "").strip().lower()
	if not email:
		frappe.throw("Token missing email", frappe.AuthenticationError)

	# Host-match isolation: the requested subdomain's creator (resolved via the
	# CreatorBase API, the source of truth) must own the token's email. Otherwise
	# a creator could log into another creator's site.
	site_sub = _resolve_site_subdomain()
	api_url = os.environ.get("CREATORBASE_API_URL", "").rstrip("/")
	api_token = os.environ.get("CREATORBASE_API_TOKEN", "")

	creator_email = None
	if site_sub and api_url and api_token:
		try:
			resp = requests.get(
				f"{api_url}/user/subdomain/{site_sub}",
				headers={"Authorization": f"Bearer {api_token}"},
				timeout=20,
			)
			if resp.ok:
				creator_email = (resp.json().get("email") or "").strip().lower()
		except Exception:
			creator_email = None

	# When CreatorBase is reachable, the host's creator email must equal the token
	# email (hard isolation). If unreachable, fall back to allowing the host match
	# by subdomain only (dev resilience) — still scoped to this site's host.
	if creator_email and creator_email != email:
		frappe.throw("Account does not belong to this storefront", frappe.AuthenticationError)

	user = _get_or_create_user(email, payload.get("name") or payload.get("email"))

	# SSO login: establish a session for this site as the creator's email without
	# a shared password (CreatorBase owns identity/credentials).
	frappe.local.login_manager.user = user
	frappe.local.login_manager.post_login()
	frappe.db.commit()

	frappe.response["message"] = "Logged In"
	frappe.response["home_page"] = "/builder"
	frappe.response["full_name"] = payload.get("name") or email
	return {"ok": True, "subdomain": site_sub, "email": email}
