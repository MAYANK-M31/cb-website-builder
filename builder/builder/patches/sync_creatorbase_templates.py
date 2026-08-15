import frappe


def execute():
	"""Sync builder template group fixtures (e.g. new Elevate group) into this site.

	Runs on every site during `bench migrate`, so a newly shipped template group
	reaches sites that were provisioned before the group existed on disk. The
	sync is idempotent and mirrors what install.py.after_migrate already runs for
	fresh installs."""
	from builder.template_sync import sync_builder_templates

	try:
		sync_builder_templates()
	except Exception:
		frappe.log_error(title="Failed to sync builder templates during migrate")