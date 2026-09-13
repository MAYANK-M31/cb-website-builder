"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var frappe_ui_1 = require("frappe-ui");
var frappe_1 = require("frappe-ui/frappe");
var pinia_1 = require("pinia");
require("./index.css");
var router_1 = __importDefault(require("./router"));
require("./setupFrappeUIResource");
var App_vue_1 = __importDefault(require("@/App.vue"));
var Input_vue_1 = __importDefault(require("@/components/Controls/Input.vue"));
var creatorbase_1 = require("@/creatorbase");
(0, creatorbase_1.initCreatorbase)();
// SSO bootstrap: the dashboard embeds the builder with ?creatorbase_token=<jwt>.
// We authenticate against THIS origin (same-origin → cookie is always set) before
// the app mounts, so the router guard never sees a guest session / login screen.
// frappeSsoLogin also re-injects the session cookie same-origin, which is what
// keeps this working when the frame is embedded cross-site and Set-Cookie is
// blocked. Always re-login when a token is present — it is idempotent and
// guarantees a fresh session even if an old (expired) cookie exists.
function ssoBootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var params, token, clean;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = new URLSearchParams(window.location.search);
                    token = params.get("creatorbase_token");
                    if (!token) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, creatorbase_1.frappeSsoLogin)(token)];
                case 1:
                    _a.sent();
                    clean = window.location.pathname + window.location.hash;
                    window.history.replaceState({}, "", clean);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, pinia;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ssoBootstrap()];
                case 1:
                    _a.sent();
                    app = (0, vue_1.createApp)(App_vue_1.default);
                    pinia = (0, pinia_1.createPinia)();
                    app.use(router_1.default);
                    app.use(frappe_ui_1.FrappeUI);
                    app.use(pinia);
                    app.use(frappe_1.telemetryPlugin, { app_name: "builder" });
                    window.name = "frappe-builder";
                    app.config.globalProperties.window = window;
                    app.component("Button", frappe_ui_1.Button);
                    app.component("FormControl", frappe_ui_1.FormControl);
                    app.component("BuilderInput", Input_vue_1.default);
                    app.mount("#app");
                    return [2 /*return*/];
            }
        });
    });
}
if (window.is_developer_mode && typeof window.is_developer_mode === "string") {
    window.is_developer_mode =
        window.is_developer_mode === "1" ||
            window.is_developer_mode === "True" ||
            window.is_developer_mode.startsWith("{{");
}
if (window.builder_version && window.builder_version.startsWith("{{")) {
    window.builder_version = "develop";
}
bootstrap();
//# sourceMappingURL=main.js.map