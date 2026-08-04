// CreatorBase integration.
//
// The builder is embedded as an iframe inside the CreatorBase dashboard. The
// dashboard hands over the logged-in creator's session (access token + subdomain)
// over postMessage as `{ type: "creatorbase:auth", accessToken, subdomain }`.
// This module stores that auth and exposes small API helpers the builder's own
// UI logic uses (published-link toast etc.) without a second handshake.
//
// Because cookies are blocked inside the cross-site iframe, every Frappe API
// call is authenticated per-request via `Authorization: Bearer <jwt>` (matched
// by the server-side auth hook). The token lives in localStorage and is injected
// into every frappe-ui request through the `requestHeaders` config.

import { setConfig } from "frappe-ui";

export interface CreatorAuth {
	accessToken: string | null;
	subdomain: string | null;
	apiUrl: string | null;
	webappUrl: string | null;
}

export const WEBAPP_DOMAIN = "creatorbase.live";

let auth: CreatorAuth = { accessToken: null, subdomain: null, apiUrl: null, webappUrl: null };
let listeners = new Set<(auth: CreatorAuth) => void>();

const TOKEN_KEY = "creatorbase_accessToken";

// Persist the token so a reload can restore the session even when the URL param
// is gone and cross-origin cookies are blocked inside the iframe.
function persistToken(token: string | null) {
	if (!token) {
		localStorage.removeItem(TOKEN_KEY);
		applyFrappeAuth(null);
		return;
	}
	localStorage.setItem(TOKEN_KEY, token);
	applyFrappeAuth(token);
}

const MAX_AGE = 60 * 60 * 24 * 30;

// Inject the token as a bearer header on every frappe-ui API request so the
// builder is authenticated even though cookies are blocked in the iframe.
function applyFrappeAuth(token: string | null) {
	setConfig("requestHeaders", () =>
		token
			? { Authorization: `Bearer ${token}` }
			: {},
	);
}

function currentToken(): string | null {
	return auth.accessToken || localStorage.getItem(TOKEN_KEY) || null;
}

// Re-inject the Frappe session that login_via_creatorbase returned. When the
// builder runs in a cross-site iframe the browser blocks the Set-Cookie header
// on the SSO response, so the session would be lost (Guest) and every Frappe
// call would 403. Setting document.cookie from within the iframe is first-party
// to `mayank.localhost` and is NOT blocked, restoring the session.
function reinjectSession(data: { sid?: string; user_id?: string; full_name?: string }) {
	if (!data || typeof window === "undefined") return;
	if (data.sid) document.cookie = `sid=${encodeURIComponent(data.sid)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
	if (data.user_id) document.cookie = `user_id=${encodeURIComponent(data.user_id)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
	if (data.full_name) document.cookie = `full_name=${encodeURIComponent(data.full_name)}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

export interface SsoResult {
	ok: boolean;
	error?: unknown;
}

// Log the creator into the Frappe site using their CreatorBase token. This is
// the bearer-token fallback that works even when cookies are blocked: the SSO
// endpoint returns the session, which we re-inject same-origin.
export async function frappeSsoLogin(token: string): Promise<SsoResult> {
	if (!token) return { ok: false };
	persistToken(token);
	try {
		const res = await fetch("/api/method/builder.auth.login_via_creatorbase", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token }),
		});
		if (!res.ok) return { ok: false, error: res.status };
		const body = await res.json();
		reinjectSession(body?.message || {});
		return { ok: true };
	} catch (e) {
		return { ok: false, error: e };
	}
}

// frappe-ui's file uploads use a raw XMLHttpRequest that only sends the CSRF
// token — no Authorization header — so with cookies blocked they run as Guest
// and get PermissionError. Patch XMLHttpRequest.prototype.open to inject the
// bearer token on same-origin upload requests.
function patchUploadAuth() {
	if (typeof window === "undefined" || (window as any).__creatorbaseUploadPatched) return;
	(window as any).__creatorbaseUploadPatched = true;
	const originalOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function (
		this: XMLHttpRequest,
		method: string,
		url: string | URL,
		...rest: unknown[]
	) {
		const token = currentToken();
		// open() first so readyState is OPENED, then set the header. Setting a
		// header before open() throws InvalidStateError (no request ever sends).
		const result = originalOpen.call(this, method as any, url as any, ...rest);
		if (token && typeof url === "string" && url.includes("/api/method/")) {
			this.setRequestHeader("Authorization", `Bearer ${token}`);
		}
		return result;
	};
}

function handleMessage(event: MessageEvent) {
	const data = event.data;
	if (data && typeof data === "object" && data.type === "creatorbase:auth") {
		auth = {
			accessToken: typeof data.accessToken === "string" ? data.accessToken : null,
			subdomain: typeof data.subdomain === "string" ? data.subdomain : null,
			apiUrl: typeof data.apiUrl === "string" ? data.apiUrl : null,
			webappUrl: typeof data.webappUrl === "string" ? data.webappUrl : null,
		};
		const token = auth.accessToken;
		persistToken(token);
		if (token) frappeSsoLogin(token);
		listeners.forEach((l) => l(auth));
	}
}

export function initCreatorbase() {
	window.addEventListener("message", handleMessage);
	patchUploadAuth();
	// Restore a persisted session on reload (no postMessage yet / cookie blocked):
	// inject the token into frappe-ui and log it into Frappe.
	const stored = localStorage.getItem(TOKEN_KEY);
	if (stored) {
		applyFrappeAuth(stored);
		frappeSsoLogin(stored);
	} else {
		applyFrappeAuth(null);
	}
}

export function getCreatorAuth(): CreatorAuth {
	return auth;
}

export function onCreatorAuth(cb: (auth: CreatorAuth) => void) {
	listeners.add(cb);
	if (auth.accessToken || auth.subdomain) cb(auth);
	return () => listeners.delete(cb);
}

function getApiBase(): string {
	if (auth.apiUrl) return auth.apiUrl.replace(/\/+$/, "");
	const viteOverride = import.meta.env.VITE_CREATORBASE_API_URL as string | undefined;
	return viteOverride ? viteOverride.replace(/\/+$/, "") : "http://localhost:8000";
}

export async function creatorFetch(path: string, init: RequestInit = {}, signal?: AbortSignal) {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(init.headers as Record<string, string>),
	};
	if (auth.accessToken) {
		headers["Authorization"] = `Bearer ${auth.accessToken}`;
	}
	const res = await fetch(`${getApiBase()}${path}`, { ...init, headers, signal });
	return res;
}

export function getWebappBaseUrl(sub: string | null = auth.subdomain): string {
	// The dashboard passes its PUBLIC_WEBAPP_URL (e.g. http://localhost:3000 in
	// dev, or https://{sub}.creatorbase.live in prod) — prefer it directly.
	if (auth.webappUrl) return auth.webappUrl.replace(/\/+$/, "");
	if (!sub) return "";
	const override = import.meta.env.VITE_CREATORBASE_WEBAPP_OVERRIDE as string | undefined;
	if (override) return override.replace(/\/+$/, "");
	return `https://${sub}.${WEBAPP_DOMAIN}`;
}

export function getWebappPageUrl(route: string | null | undefined, sub?: string | null): string {
	const base = getWebappBaseUrl(sub);
	if (!base) return "";
	const r = route || "/";
	const normalized = r === "/" || r === "/index" ? "/" : `/${String(r).replace(/^\/+/, "")}`;
	// The webapp resolves a specific page via hash routing (`#/about`), while the
	// homepage renders at the bare subdomain URL.
	return normalized === "/" ? base : `${base}#${normalized}`;
}

export async function fetchCreatorWebsite(sub: string | null = auth.subdomain, signal?: AbortSignal) {
	if (!sub) return null;
	try {
		const res = await creatorFetch(`/sales-pages/public/website/${sub}`, {}, signal);
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}