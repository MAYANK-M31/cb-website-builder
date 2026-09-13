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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDomains = useDomains;
var frappe_ui_1 = require("frappe-ui");
var vue_1 = require("vue");
var frappe_ui_2 = require("frappe-ui");
var API = "builder.domain";
function getErrorMessage(e) {
    var msg = Array.isArray(e === null || e === void 0 ? void 0 : e.messages) && e.messages[0];
    if (msg && typeof msg === "string")
        return msg.replace(/<[^>]*>/g, "").trim();
    return (e === null || e === void 0 ? void 0 : e.message) || "Something went wrong";
}
function useDomains() {
    var domains = (0, vue_1.ref)([]);
    var serverIP = (0, vue_1.ref)(null);
    var loading = (0, vue_1.ref)(false);
    function fetchServerIP() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = serverIP;
                        return [4 /*yield*/, (0, frappe_ui_1.createResource)({ url: "".concat(API, ".get_server_ip") }).submit()];
                    case 1:
                        _a.value = (_c.sent());
                        return [3 /*break*/, 3];
                    case 2:
                        _b = _c.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function fetchDomains() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        loading.value = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = domains;
                        return [4 /*yield*/, (0, frappe_ui_1.createResource)({ url: "".concat(API, ".get_domains") }).submit()];
                    case 2:
                        _a.value = (_b.sent());
                        return [3 /*break*/, 5];
                    case 3:
                        e_1 = _b.sent();
                        frappe_ui_2.toast.error(getErrorMessage(e_1));
                        return [3 /*break*/, 5];
                    case 4:
                        loading.value = false;
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function checkDNS(domain) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_2, msg, error;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, frappe_ui_1.createResource)({ url: "".concat(API, ".check_dns") }).submit({ domain: domain })];
                    case 1:
                        result = (_b.sent());
                        return [2 /*return*/, { matched: (_a = result === null || result === void 0 ? void 0 : result.matched) !== null && _a !== void 0 ? _a : false, error: "" }];
                    case 2:
                        e_2 = _b.sent();
                        msg = Array.isArray(e_2 === null || e_2 === void 0 ? void 0 : e_2.messages) && e_2.messages[0];
                        error = (msg && typeof msg === "string" ? msg : e_2 === null || e_2 === void 0 ? void 0 : e_2.message) || "Something went wrong";
                        return [2 /*return*/, { matched: false, error: error }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    function addDomain(domain) {
        return __awaiter(this, void 0, void 0, function () {
            var id, _a, matched, error, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = frappe_ui_2.toast.loading("Verifying DNS for ".concat(domain, "\u2026"));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, checkDNS(domain)];
                    case 2:
                        _a = _b.sent(), matched = _a.matched, error = _a.error;
                        if (!matched) {
                            frappe_ui_2.toast.error("Domain verification failed", { id: id });
                            return [2 /*return*/, {
                                    ok: false,
                                    error: error || "DNS not yet propagated. Make sure the record is set correctly and try again.",
                                }];
                        }
                        frappe_ui_2.toast.loading("Adding ".concat(domain, "\u2026"), { id: id });
                        return [4 /*yield*/, (0, frappe_ui_1.createResource)({ url: "".concat(API, ".add_domain") }).submit({ domain: domain })];
                    case 3:
                        _b.sent();
                        frappe_ui_2.toast.success("".concat(domain, " added successfully"), { id: id });
                        return [4 /*yield*/, fetchDomains()];
                    case 4:
                        _b.sent();
                        return [2 /*return*/, { ok: true }];
                    case 5:
                        e_3 = _b.sent();
                        frappe_ui_2.toast.error(getErrorMessage(e_3), { id: id });
                        return [2 /*return*/, { ok: false }];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    function removeDomain(domain) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, callAPI("remove_domain", domain, "".concat(domain, " removed"), "Removing ".concat(domain, "\u2026"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function retryDomain(domain) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, callAPI("retry_add_domain", domain, "Retrying ".concat(domain), "Retrying ".concat(domain, "\u2026"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function setHostName(domain) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, callAPI("set_host_name", domain, "".concat(domain, " set as primary"), "Updating primary domain\u2026")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function setRedirect(domain) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, callAPI("set_redirect", domain, "Redirect enabled for ".concat(domain), "Enabling redirect\u2026")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function unsetRedirect(domain) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, callAPI("unset_redirect", domain, "Redirect disabled for ".concat(domain), "Disabling redirect\u2026")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function callAPI(method, domain, successMsg, loadingMsg) {
        return __awaiter(this, void 0, void 0, function () {
            var id, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = loadingMsg ? frappe_ui_2.toast.loading(loadingMsg) : undefined;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, frappe_ui_1.createResource)({ url: "".concat(API, ".").concat(method) }).submit({ domain: domain })];
                    case 2:
                        _a.sent();
                        frappe_ui_2.toast.success(successMsg, { id: id });
                        return [4 /*yield*/, fetchDomains()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_4 = _a.sent();
                        frappe_ui_2.toast.error(getErrorMessage(e_4), { id: id });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    return {
        domains: domains,
        serverIP: serverIP,
        loading: loading,
        fetchDomains: fetchDomains,
        fetchServerIP: fetchServerIP,
        addDomain: addDomain,
        removeDomain: removeDomain,
        retryDomain: retryDomain,
        setHostName: setHostName,
        setRedirect: setRedirect,
        unsetRedirect: unsetRedirect,
    };
}
//# sourceMappingURL=domains.js.map