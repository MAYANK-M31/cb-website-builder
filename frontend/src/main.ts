import { createApp } from "vue";

import { Button, FormControl, FrappeUI } from "frappe-ui";
import { telemetryPlugin } from "frappe-ui/frappe";
import { createPinia } from "pinia";
import "./index.css";
import router from "./router";
import "./setupFrappeUIResource";

import App from "@/App.vue";
import Input from "@/components/Controls/Input.vue";
import { initCreatorbase, frappeSsoLogin } from "@/creatorbase";

initCreatorbase();

// SSO bootstrap: the dashboard embeds the builder with ?creatorbase_token=<jwt>.
// We authenticate against THIS origin (same-origin → cookie is always set) before
// the app mounts, so the router guard never sees a guest session / login screen.
// frappeSsoLogin also re-injects the session cookie same-origin, which is what
// keeps this working when the frame is embedded cross-site and Set-Cookie is
// blocked. Always re-login when a token is present — it is idempotent and
// guarantees a fresh session even if an old (expired) cookie exists.
async function ssoBootstrap() {
	const params = new URLSearchParams(window.location.search);
	const token = params.get("creatorbase_token");
	if (token) {
		await frappeSsoLogin(token);
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
