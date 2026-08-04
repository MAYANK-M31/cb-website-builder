// CreatorBase integration.
//
// The builder is embedded as an iframe inside the CreatorBase dashboard. The
// dashboard hands over the logged-in creator's session (access token + subdomain)
// over postMessage as `{ type: "creatorbase:auth", accessToken, subdomain }`.
// This module stores that auth and exposes small API helpers the builder's own
// UI logic uses (published-link toast etc.) without a second handshake.

export interface CreatorAuth {
	accessToken: string | null;
	subdomain: string | null;
	apiUrl: string | null;
	webappUrl: string | null;
}

export const WEBAPP_DOMAIN = "creatorbase.live";

let auth: CreatorAuth = { accessToken: null, subdomain: null, apiUrl: null, webappUrl: null };
let listeners = new Set<(auth: CreatorAuth) => void>();

function handleMessage(event: MessageEvent) {
	const data = event.data;
	if (data && typeof data === "object" && data.type === "creatorbase:auth") {
		auth = {
			accessToken: typeof data.accessToken === "string" ? data.accessToken : null,
			subdomain: typeof data.subdomain === "string" ? data.subdomain : null,
			apiUrl: typeof data.apiUrl === "string" ? data.apiUrl : null,
			webappUrl: typeof data.webappUrl === "string" ? data.webappUrl : null,
		};
		listeners.forEach((l) => l(auth));
	}
}

export function initCreatorbase() {
	window.addEventListener("message", handleMessage);
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