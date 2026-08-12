"""Compatibility shim for older frappe benches without the pulse telemetry
`boot_config` whitelisted method (added in frappe v15.117).

The builder's frappe-ui telemetry plugin calls
`frappe.utils.telemetry.pulse.client.boot_config` on every boot. On a bench whose
frappe predates that method the RPC 500s with "module has no attribute
boot_config". The plugin degrades gracefully, but the error floods the console
and the network tab. This module defines the missing method (returning
`{"enabled": False}`, the same self-gating the real method uses when telemetry
is off) and registers it with the whitelist machinery so the RPC resolves.

Installed from the `before_request` hook so it runs before any RPC dispatch, on
whatever frappe version is actually deployed."""

import frappe

_installed = False


def ensure_pulse_boot_config():
	"""Idempotently expose boot_config on the pulse client if frappe lacks it."""
	global _installed
	if _installed:
		return
	try:
		from frappe.utils.telemetry.pulse import client
	except Exception:
		return
	if hasattr(client, "boot_config"):
		_installed = True
		return

	@frappe.whitelist(allow_guest=True)
	def boot_config():
		return {"enabled": False}

	client.boot_config = boot_config
	_installed = True
