import { createApp } from "vue";

import { Button, FormControl, FrappeUI } from "frappe-ui";
import { telemetryPlugin } from "frappe-ui/frappe";
import { createPinia } from "pinia";
import "./index.css";
import router from "./router";
import "./setupFrappeUIResource";

import App from "@/App.vue";
import Input from "@/components/Controls/Input.vue";
import { initCreatorbase } from "@/creatorbase";

initCreatorbase();

// SSO bootstrap: the dashboard embeds the builder with ?creatorbase_token=<jwt>.
// We authenticate against THIS origin (same-origin → cookie is always set) before
// the app mounts, so the router guard never sees a guest session / login screen.
// Always re-login when a token is present — it is idempotent and guarantees a
// fresh session even if an old (expired) cookie exists.
async function ssoBootstrap() {
	const params = new URLSearchParams(window.location.search);
	const token = params.get("creatorbase_token");
	if (token) {
		try {
			await fetch("/api/method/builder.auth.login_via_creatorbase", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token }),
			});
		} catch (e) {
			console.warn("[builder] SSO bootstrap failed", e);
		}
		// Remove the token from the URL so it isn't left in history/referrer.
		const clean = window.location.pathname + window.location.hash;
		window.history.replaceState({}, "", clean);
	}
}

async function bootstrap() {
	await ssoBootstrap();

	const app = createApp(App);
	const pinia = createPinia();

	app.use(router);
	app.use(FrappeUI);
	app.use(pinia);
	app.use(telemetryPlugin, { app_name: "builder" });

	window.name = "frappe-builder";
	app.config.globalProperties.window = window;

	app.component("Button", Button);
	app.component("FormControl", FormControl);
	app.component("BuilderInput", Input);

	app.mount("#app");
}

declare global {
	interface Window {
		is_developer_mode?: boolean;
		builder_version: string;
	}
}

if (window.is_developer_mode && typeof window.is_developer_mode === "string") {
	window.is_developer_mode =
		window.is_developer_mode === "1" ||
		window.is_developer_mode === "True" ||
		(window.is_developer_mode as string).startsWith("{{");
}

if (window.builder_version && window.builder_version.startsWith("{{")) {
	window.builder_version = "develop";
}

bootstrap();
