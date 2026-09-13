"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBAPP_DOMAIN = void 0;
exports.frappeSsoLogin = frappeSsoLogin;
exports.initCreatorbase = initCreatorbase;
exports.getCreatorAuth = getCreatorAuth;
exports.getCreatorToken = getCreatorToken;
exports.onCreatorAuth = onCreatorAuth;
exports.creatorFetch = creatorFetch;
exports.getWebappBaseUrl = getWebappBaseUrl;
exports.getCurrentSubdomain = getCurrentSubdomain;
exports.getWebappPageUrl = getWebappPageUrl;
exports.fetchCreatorWebsite = fetchCreatorWebsite;
var frappe_ui_1 = require("frappe-ui");
exports.WEBAPP_DOMAIN = ((_a = import.meta.env.VITE_CREATORBASE_WEBAPP_DOMAIN) === null || _a === void 0 ? void 0 : _a.trim()) || "creatorbase.live";
var auth = { accessToken: null, subdomain: null, apiUrl: null, webappUrl: null };
var listeners = new Set();
var TOKEN_KEY = "creatorbase_accessToken";
// Persist the token so a reload can restore the session even when the URL param
// is gone and cross-origin cookies are blocked inside the iframe.
function persistToken(token) {
    if (!token) {
        localStorage.removeItem(TOKEN_KEY);
        applyFrappeAuth(null);
        return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    applyFrappeAuth(token);
}
var MAX_AGE = 60 * 60 * 24 * 30;
// Inject the token as a bearer header on every frappe-ui API request so the
// builder is authenticated even though cookies are blocked in the iframe.
function applyFrappeAuth(token) {
    (0, frappe_ui_1.setConfig)("requestHeaders", function () {
        return token
            ? { Authorization: "Bearer ".concat(token) }
            : {};
    });
}
function currentToken() {
    return auth.accessToken || localStorage.getItem(TOKEN_KEY) || null;
}
// Re-inject the Frappe session that login_via_creatorbase returned. When the
// builder runs in a cross-site iframe the browser blocks the Set-Cookie header
// on the SSO response, so the session would be lost (Guest) and every Frappe
// call would 403. Setting document.cookie from within the iframe is first-party
// to `mayank.localhost` and is NOT blocked, restoring the session.
function reinjectSession(data) {
    if (!data || typeof window === "undefined")
        return;
    if (data.sid)
        document.cookie = "sid=".concat(encodeURIComponent(data.sid), "; path=/; max-age=").concat(MAX_AGE, "; SameSite=Lax");
    if (data.user_id)
        document.cookie = "user_id=".concat(encodeURIComponent(data.user_id), "; path=/; max-age=").concat(MAX_AGE, "; SameSite=Lax");
    if (data.full_name)
        document.cookie = "full_name=".concat(encodeURIComponent(data.full_name), "; path=/; max-age=").concat(MAX_AGE, "; SameSite=Lax");
}
// Frappe enforces CSRF on POSTs from a non-Guest session. The SSO page GET
// already logs the creator in (sso_before_request), so this login POST carries
// an authenticated sid cookie and needs the token — without it Frappe raises
// CSRFTokenError. The token is rendered into the page by _builder.py as
// window.csrf_token; under the vite dev server it stays the literal
// "{{ csrf_token }}" (ignore_csrf is set there), so skip it in that case.
function csrfToken() {
    var t = window.csrf_token;
    if (!t || typeof t !== "string" || t.includes("{{"))
        return null;
    return t;
}
// Log the creator into the Frappe site using their CreatorBase token. This is
// the bearer-token fallback that works even when cookies are blocked: the SSO
// endpoint returns the session, which we re-inject same-origin.
function frappeSsoLogin(token) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, csrf, res, body, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/, { ok: false }];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    headers = { "Content-Type": "application/json" };
                    csrf = csrfToken();
                    if (csrf)
                        headers["X-Frappe-CSRF-Token"] = csrf;
                    return [4 /*yield*/, fetch("/api/method/builder.auth.login_via_creatorbase", {
                            method: "POST",
                            credentials: "include",
                            headers: headers,
                            body: JSON.stringify({ token: token }),
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok) {
                        // Only keep a token the server actually accepted. A rejected or stale
                        // token (e.g. a previous creator's, after dashboard logout) must not
                        // survive in localStorage — otherwise the next reload re-authenticates
                        // with it and lands on a blank/403 page instead of the login screen.
                        if (typeof localStorage !== "undefined") {
                            localStorage.removeItem(TOKEN_KEY);
                        }
                        applyFrappeAuth(null);
                        return [2 /*return*/, { ok: false, error: res.status }];
                    }
                    return [4 /*yield*/, res.json()];
                case 3:
                    body = _a.sent();
                    persistToken(token);
                    reinjectSession((body === null || body === void 0 ? void 0 : body.message) || {});
                    return [2 /*return*/, { ok: true }];
                case 4:
                    e_1 = _a.sent();
                    if (typeof localStorage !== "undefined") {
                        localStorage.removeItem(TOKEN_KEY);
                    }
                    applyFrappeAuth(null);
                    return [2 /*return*/, { ok: false, error: e_1 }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// frappe-ui's file uploads use a raw XMLHttpRequest that only sends the CSRF
// token — no Authorization header — so with cookies blocked they run as Guest
// and get PermissionError. Patch XMLHttpRequest.prototype.open to inject the
// bearer token on same-origin upload requests.
function patchUploadAuth() {
    if (typeof window === "undefined" || window.__creatorbaseUploadPatched)
        return;
    window.__creatorbaseUploadPatched = true;
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        var token = currentToken();
        // open() first so readyState is OPENED, then set the header. Setting a
        // header before open() throws InvalidStateError (no request ever sends).
        var result = originalOpen.call.apply(originalOpen, __spreadArray([this, method, url], rest, false));
        if (token && typeof url === "string" && url.includes("/api/method/")) {
            this.setRequestHeader("Authorization", "Bearer ".concat(token));
        }
        return result;
    };
}
function handleMessage(event) {
    var data = event.data;
    if (data && typeof data === "object" && data.type === "creatorbase:auth") {
        auth = {
            accessToken: typeof data.accessToken === "string" ? data.accessToken : null,
            subdomain: typeof data.subdomain === "string" ? data.subdomain : null,
            apiUrl: typeof data.apiUrl === "string" ? data.apiUrl : null,
            webappUrl: typeof data.webappUrl === "string" ? data.webappUrl : null,
        };
        var token = auth.accessToken;
        persistToken(token);
        if (token)
            frappeSsoLogin(token);
        listeners.forEach(function (l) { return l(auth); });
    }
}
function initCreatorbase() {
    window.addEventListener("message", handleMessage);
    patchUploadAuth();
    // Restore a persisted session on reload (no postMessage yet / cookie blocked):
    // inject the token into frappe-ui and log it into Frappe.
    var stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
        applyFrappeAuth(stored);
        frappeSsoLogin(stored);
    }
    else {
        applyFrappeAuth(null);
    }
}
function getCreatorAuth() {
    return auth;
}
function getCreatorToken() {
    return (auth.accessToken ||
        (typeof localStorage === "undefined" ? "" : (localStorage.getItem(TOKEN_KEY) || "")));
}
function onCreatorAuth(cb) {
    listeners.add(cb);
    if (auth.accessToken || auth.subdomain)
        cb(auth);
    return function () { return listeners.delete(cb); };
}
function getApiBase() {
    if (auth.apiUrl)
        return auth.apiUrl.replace(/\/+$/, "");
    var viteOverride = import.meta.env.VITE_CREATORBASE_API_URL;
    return viteOverride ? viteOverride.replace(/\/+$/, "") : "http://localhost:8000";
}
function creatorFetch(path_1) {
    return __awaiter(this, arguments, void 0, function (path, init, signal) {
        var headers, res;
        if (init === void 0) { init = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = __assign({ "Content-Type": "application/json" }, init.headers);
                    if (auth.accessToken) {
                        headers["Authorization"] = "Bearer ".concat(auth.accessToken);
                    }
                    return [4 /*yield*/, fetch("".concat(getApiBase()).concat(path), __assign(__assign({}, init), { headers: headers, signal: signal }))];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
function getWebappBaseUrl(sub) {
    if (sub === void 0) { sub = auth.subdomain; }
    // The builder may run on a subdomain host ({sub}.{domain}:{builderPort}) while
    // the live webapp lives on the WEBAPP_DOMAIN env host. Derive the webapp URL
    // from the subdomain + WEBAPP_DOMAIN first so the preview opens at the real
    // public site — never the builder host or a bare window.location.origin.
    // The dashboard's PUBLIC_WEBAPP_URL (http://localhost:3000 dev,
    // https://creatorbase.live prod) is only used as a fallback.
    var candidates = [buildSubdomainBaseUrl(sub), auth.webappUrl, import.meta.env.VITE_CREATORBASE_WEBAPP_OVERRIDE];
    for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
        var candidate = candidates_1[_i];
        if (!candidate)
            continue;
        var cleaned = candidate.trim().replace(/\/+$/, "");
        // A scheme-only string like "http:" (or "/") can never be a valid base —
        // skip it instead of letting window.open throw.
        if (/^(https?:\/{0,2}|javascript:)$/i.test(cleaned) || !/^https?:\/\//i.test(cleaned))
            continue;
        return cleaned;
    }
    if (!sub)
        return "";
    return "https://".concat(sub, ".creatorbase.live");
}
// The current host is authoritatively a subdomain host when auth is unavailable
// (e.g. embedded dev): "mayank.localhost:8088" → "mayank". IP-style hosts have no
// subdomain label.
function getCurrentSubdomain() {
    if (typeof window === "undefined")
        return "";
    var parts = window.location.hostname.split(".");
    if (parts.length < 2)
        return "";
    var label = parts[0];
    return /^\d+$/.test(label) ? "" : label;
}
// Normalize the WEBAPP_DOMAIN env to a scheme-less host, tolerating a
// dot-separated port ("{{subdomain}}.localhost.3000" → "{{subdomain}}.localhost:3000").
function normalizeWebappDomain(domain) {
    return domain.trim().replace(/^https?:\/\//i, "");
}
// Build the subdomain-scoped webapp origin from the WEBAPP_DOMAIN env template
// (may carry a "{{subdomain}}" placeholder; a bare domain gets the subdomain
// prepended), using the current page's scheme.
function buildSubdomainBaseUrl(sub) {
    var s = sub === null || sub === void 0 ? void 0 : sub.trim();
    if (!s || typeof window === "undefined")
        return "";
    var domain = normalizeWebappDomain(exports.WEBAPP_DOMAIN);
    if (!domain)
        return "";
    if (domain.includes("{{subdomain}}")) {
        domain = domain.replace("{{subdomain}}", s);
    }
    else if (domain.includes("{subdomain}")) {
        domain = domain.replace("{subdomain}", s);
    }
    else {
        domain = "".concat(s, ".").concat(domain);
    }
    // Tolerate a dot-separated port ("mayank.localhost.3000" → "mayank.localhost:3000").
    domain = domain.replace(/\.(\d{2,5})$/, ":$1");
    var scheme = window.location.protocol === "https:" ? "https" : "http";
    return "".concat(scheme, "://").concat(domain);
}
function getWebappPageUrl(route, sub) {
    var base = getWebappBaseUrl(sub);
    if (!base)
        return "";
    var r = route || "/";
    var normalized = r === "/" || r === "/index" ? "/" : "/".concat(String(r).replace(/^\/+/, ""));
    // The webapp serves pages at real path routes (`/about`), not hash routes —
    // the homepage renders at the bare subdomain URL.
    return normalized === "/" ? base : "".concat(base).concat(normalized);
}
function fetchCreatorWebsite() {
    return __awaiter(this, arguments, void 0, function (sub, signal) {
        var res, _a;
        if (sub === void 0) { sub = auth.subdomain; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!sub)
                        return [2 /*return*/, null];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, creatorFetch("/sales-pages/public/website/".concat(sub), {}, signal)];
                case 2:
                    res = _b.sent();
                    if (!res.ok)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, res.json()];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=index.js.map