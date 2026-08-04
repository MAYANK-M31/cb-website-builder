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


def _do_login(token: str) -> dict:
	"""Validate a CreatorBase JWT and establish a session for this site.

	Returns a dict with the resolved identity. Raises AuthenticationError on any
	invalid/mismatched token so callers can treat failure as a hard rejection.
	"""
	payload = _decode_token(token)
	if not payload:
		frappe.throw("Invalid or expired token", frappe.AuthenticationError)

	email = (payload.get("email") or "").strip().lower()
	if not email:
		frappe.throw("Token missing email", frappe.AuthenticationError)

	# Host-match isolation: resolve the creator's own subdomain from CreatorBase
	# using THEIR token (source of truth), then require it to match the request
	# Host's subdomain. A creator can only ever log into their own site.
	site_sub = _resolve_site_subdomain()
	api_url = os.environ.get("CREATORBASE_API_URL", "").rstrip("/")
	api_token = os.environ.get("CREATORBASE_API_TOKEN", "")

	token_subdomain = None
	api_reachable = False
	if site_sub and api_url and token:
		try:
			resp = requests.get(
				f"{api_url}/user",
				headers={"Authorization": f"Bearer {token}"},
				timeout=20,
			)
			api_reachable = True
			if resp.ok:
				token_subdomain = (resp.json().get("subDomain") or "").strip().lower()
		except Exception:
			api_reachable = False

	if api_reachable:
		if not token_subdomain:
			frappe.throw("Account has no storefront subdomain", frappe.AuthenticationError)
		if token_subdomain != site_sub:
			frappe.throw("Account does not belong to this storefront", frappe.AuthenticationError)
	# Only when CreatorBase is unreachable do we fall back to host match alone
	# (dev resilience) — still scoped to this site's host.

	user = _get_or_create_user(email, payload.get("name") or payload.get("email"))

	# SSO login: establish a session for this site as the creator's email without
	# a shared password (CreatorBase owns identity/credentials).
	frappe.local.login_manager.user = user
	frappe.local.login_manager.post_login()
	frappe.db.commit()

	return {"ok": True, "subdomain": site_sub, "email": email}


def sso_before_request():
	"""Server-side SSO for the embedded builder.

	When the builder page is requested with `?creatorbase_token=`, log the creator
	in BEFORE the page/API responds so the very first client call is already
	authenticated. This avoids the client-side race that otherwise surfaces a
	"you do not have permission" alert inside the dashboard iframe.
	"""
	try:
		token = frappe.local.form_dict.get("creatorbase_token") or ""
		if not token:
			return
		if frappe.session.user != "Guest":
			return  # already authenticated
		_do_login(token)
	except Exception as e:
		frappe.log_error(f"creatorbase before-request SSO failed: {e}", "creatorbase.auth")


@frappe.whitelist(allow_guest=True)
def login_via_creatorbase(token: str):
	"""SSO: validate a CreatorBase JWT and log the creator into THIS site."""
	result = _do_login(token)
	frappe.response["message"] = "Logged In"
	frappe.response["home_page"] = "/builder"
	return result
