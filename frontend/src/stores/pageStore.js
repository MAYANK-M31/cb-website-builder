"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var builderSettings_1 = require("@/data/builderSettings");
var webPage_1 = require("@/data/webPage");
var router_1 = __importDefault(require("@/router"));
var builderStore_1 = __importDefault(require("@/stores/builderStore"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var componentStore_js_1 = __importDefault(require("@/stores/componentStore.js"));
var blockTemplate_1 = __importDefault(require("@/utils/blockTemplate"));
var helpers_1 = require("@/utils/helpers");
var frappe_ui_1 = require("frappe-ui");
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var creatorbase_1 = require("@/creatorbase");
// Serialize all set_value/save calls for the active page so concurrent writes to
// the same document can't trip Frappe's TimestampMismatchError (read-modify-write
// races) and so a debounced field edit always lands before publish.
var pendingSave = Promise.resolve();
var serializeSave = function (task) {
    var next = pendingSave.then(task, task);
    pendingSave = next.catch(function () { return undefined; });
    return next;
};
var usePageStore = (0, pinia_1.defineStore)("pageStore", {
    state: function () { return ({
        routeVariables: {},
        pageData: {},
        pageName: "Home",
        route: "/",
        selectedPage: null,
        pageBlocks: [],
        saveId: null,
        activePage: null,
        activePageScripts: [],
        savingPage: false,
        settingPage: false,
        snapshotsVersion: 0,
    }); },
    actions: {
        setPage: function (pageName_1) {
            return __awaiter(this, arguments, void 0, function (pageName, resetCanvas, routeParams) {
                var page, blocks, canvasStore_2, variables, canvasStore, scriptsResource;
                var _this = this;
                var _a, _b;
                if (resetCanvas === void 0) { resetCanvas = true; }
                if (routeParams === void 0) { routeParams = null; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            this.settingPage = true;
                            if (!pageName) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.fetchActivePage(pageName)];
                        case 1:
                            page = _c.sent();
                            if (!page) {
                                frappe_ui_1.toast.error("Page not found", {
                                    duration: Infinity,
                                });
                                return [2 /*return*/];
                            }
                            this.activePage = page;
                            blocks = JSON.parse(page.draft_blocks || page.blocks || "[]");
                            this.editPage(!resetCanvas);
                            if (!Array.isArray(blocks)) {
                                canvasStore_2 = (0, canvasStore_1.default)();
                                canvasStore_2.pushBlocks([blocks]);
                            }
                            this.pageBlocks = [(0, helpers_1.getBlockInstance)(blocks[0] || (0, blockTemplate_1.default)("body"))];
                            this.pageName = page.page_name;
                            this.route = page.route || "/" + this.pageName.toLowerCase().replace(/ /g, "-");
                            this.selectedPage = page.name;
                            variables = localStorage.getItem("".concat(page.name, ":routeVariables")) || "{}";
                            this.routeVariables = JSON.parse(variables);
                            if (routeParams) {
                                Object.assign(this.routeVariables, routeParams);
                            }
                            return [4 /*yield*/, this.setPageData(this.activePage)];
                        case 2:
                            _c.sent();
                            canvasStore = (0, canvasStore_1.default)();
                            // switching pages always exits any active version preview
                            canvasStore.clearVersionPreview();
                            (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.setRootBlock(this.pageBlocks[0], resetCanvas);
                            if (!((_b = page.client_scripts) === null || _b === void 0 ? void 0 : _b.length)) return [3 /*break*/, 4];
                            scriptsResource = (0, frappe_ui_1.createListResource)({
                                doctype: "Builder Client Script",
                                fields: ["script_type", "name", "script"],
                                filters: [["name", "in", page.client_scripts.map(function (script) { return script.builder_script; })]],
                                auto: true,
                            });
                            return [4 /*yield*/, scriptsResource.list.promise];
                        case 3:
                            _c.sent();
                            this.activePageScripts = scriptsResource.data;
                            return [3 /*break*/, 5];
                        case 4:
                            this.activePageScripts = [];
                            _c.label = 5;
                        case 5:
                            (0, vue_1.nextTick)(function () {
                                var componentStore = (0, componentStore_js_1.default)();
                                var interval = setInterval(function () {
                                    if (!componentStore.fetchingComponent.size) {
                                        _this.settingPage = false;
                                        window.name = "editor-".concat(pageName);
                                        clearInterval(interval);
                                        // detect pinned component instances whose live component drifted
                                        componentStore.refreshComponentUpdates();
                                        // surface any warnings stashed by a just-completed snapshot restore
                                        var restoreWarnings = sessionStorage.getItem("builder:restoreWarnings");
                                        if (restoreWarnings) {
                                            sessionStorage.removeItem("builder:restoreWarnings");
                                            for (var _i = 0, _a = JSON.parse(restoreWarnings); _i < _a.length; _i++) {
                                                var message = _a[_i];
                                                frappe_ui_1.toast.warning(message);
                                            }
                                        }
                                    }
                                }, 50);
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
        setActivePage: function (pageName) {
            return __awaiter(this, void 0, void 0, function () {
                var page;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.selectedPage = pageName;
                            return [4 /*yield*/, this.fetchActivePage(pageName)];
                        case 1:
                            page = _a.sent();
                            if (!page) {
                                return [2 /*return*/];
                            }
                            this.activePage = page;
                            return [2 /*return*/];
                    }
                });
            });
        },
        fetchActivePage: function (pageName) {
            return __awaiter(this, void 0, void 0, function () {
                var webPageResource, e_1, page;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, frappe_ui_1.createDocumentResource)({
                                doctype: "Builder Page",
                                name: pageName,
                                auto: true,
                            })];
                        case 1:
                            webPageResource = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, webPageResource.get.promise];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _a.sent();
                            return [2 /*return*/, null];
                        case 5:
                            page = webPageResource.doc;
                            return [2 /*return*/, page];
                    }
                });
            });
        },
        editPage: function (retainSelection) {
            var _a;
            if (retainSelection === void 0) { retainSelection = false; }
            var canvasStore = (0, canvasStore_1.default)();
            if (!retainSelection) {
                (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.clearSelection();
            }
            canvasStore.editingMode = "page";
        },
        duplicatePage: function (page) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    frappe_ui_1.toast.promise((0, frappe_ui_1.createResource)({
                        url: "builder.api.duplicate_page",
                        method: "POST",
                        params: {
                            page_name: page.name,
                        },
                    }).fetch(), {
                        loading: "Duplicating page",
                        success: function (page) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                // load page and refresh
                                router_1.default.push({ name: "builder", params: { pageId: page.page_name } }).then(function () {
                                    router_1.default.go(0);
                                });
                                return [2 /*return*/, "Page duplicated"];
                            });
                        }); },
                    });
                    return [2 /*return*/];
                });
            });
        },
        deletePage: function (page) { return __awaiter(void 0, void 0, void 0, function () {
            var confirmed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, helpers_1.confirm)("Are you sure you want to delete page: ".concat(page.page_title || page.page_name, "?"))];
                    case 1:
                        confirmed = _a.sent();
                        if (!confirmed) return [3 /*break*/, 3];
                        return [4 /*yield*/, frappe_ui_1.toast.promise(webPage_1.webPages.delete.submit(page.name), {
                                loading: "Deleting page",
                                success: function () {
                                    return "Page deleted";
                                },
                                error: function () {
                                    return "Page deletion failed";
                                },
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); },
        publishPage: function () {
            return __awaiter(this, arguments, void 0, function (openInBrowser) {
                var page;
                var _this = this;
                if (openInBrowser === void 0) { openInBrowser = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            page = this.activePage;
                            if (!page) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.savePage({ route: page.route, page_title: page.page_title })];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.savePage()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, this.waitTillPageIsSaved()];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, webPage_1.webPages.runDocMethod
                                    .submit({
                                    name: this.selectedPage,
                                    method: "publish",
                                    route_variables: this.routeVariables,
                                })
                                    .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, url;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = this;
                                                return [4 /*yield*/, this.fetchActivePage(this.selectedPage)];
                                            case 1:
                                                _a.activePage = _b.sent();
                                                this.snapshotsVersion++;
                                                url = this.publishedWebappUrl();
                                                frappe_ui_1.toast.success("Published successfully", {
                                                    description: "Changes may take a few minutes to reflect on the live site.",
                                                    duration: 8000,
                                                    action: url
                                                        ? {
                                                            label: "Open live page",
                                                            onClick: function () { return window.open(url, "_blank"); },
                                                        }
                                                        : undefined,
                                                });
                                                if (openInBrowser) {
                                                    this.openPageInBrowser(this.activePage);
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        },
        // After publish, surface the live CreatorBase webapp link (requires the
        // dashboard to have handed over auth via postMessage).
        publishedWebappUrl: function () {
            var _a, _b, _c;
            var subdomain = (0, creatorbase_1.getCreatorAuth)().subdomain;
            if (!subdomain)
                return "";
            return (_c = (0, creatorbase_1.getWebappPageUrl)((_b = (_a = this.activePage) === null || _a === void 0 ? void 0 : _a.route) !== null && _b !== void 0 ? _b : this.route, subdomain)) !== null && _c !== void 0 ? _c : "";
        },
        revertChanges: function () {
            return __awaiter(this, void 0, void 0, function () {
                var confirmed;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (0, helpers_1.confirm)("This will revert all changes made to the page since the last publish. Are you sure you want to continue?")];
                        case 1:
                            confirmed = _b.sent();
                            if (!confirmed) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.updateActivePage("draft_blocks", null)];
                        case 2:
                            _b.sent();
                            this.setPage((_a = this.activePage) === null || _a === void 0 ? void 0 : _a.name);
                            _b.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        createManualSnapshot: function (label) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, webPage_1.webPages.runDocMethod.submit({
                                name: this.selectedPage,
                                method: "create_manual_snapshot",
                                label: label || null,
                            })];
                        case 1:
                            res = _a.sent();
                            this.snapshotsVersion++;
                            return [2 /*return*/, res];
                    }
                });
            });
        },
        restoreSnapshot: function (snapshotName) {
            return __awaiter(this, void 0, void 0, function () {
                var res, warnings;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: 
                        // wait out any in-flight autosave so it can't clobber the restored draft
                        return [4 /*yield*/, this.waitTillPageIsSaved()];
                        case 1:
                            // wait out any in-flight autosave so it can't clobber the restored draft
                            _b.sent();
                            return [4 /*yield*/, webPage_1.webPages.runDocMethod.submit({
                                    name: this.selectedPage,
                                    method: "restore_snapshot",
                                    snapshot: snapshotName,
                                })];
                        case 2:
                            res = _b.sent();
                            warnings = (((_a = res === null || res === void 0 ? void 0 : res.message) === null || _a === void 0 ? void 0 : _a.warnings) || []);
                            if (warnings.length) {
                                sessionStorage.setItem("builder:restoreWarnings", JSON.stringify(warnings));
                            }
                            // router.go(0);
                            // Instead of a hard reload, we could are just re-fetching the page document
                            this.setPage(this.selectedPage, false);
                            frappe_ui_1.toast.success("Version restored");
                            return [2 /*return*/];
                    }
                });
            });
        },
        unpublishPage: function (page) {
            return __awaiter(this, void 0, void 0, function () {
                var targetName, targetTitle, confirmed;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            targetName = (page === null || page === void 0 ? void 0 : page.name) || this.selectedPage;
                            targetTitle = (page === null || page === void 0 ? void 0 : page.page_title) || (page === null || page === void 0 ? void 0 : page.page_name) || "this page";
                            return [4 /*yield*/, (0, helpers_1.confirm)("Are you sure you want to unpublish \"".concat(targetTitle, "\"? It will no longer be accessible on the website."))];
                        case 1:
                            confirmed = _a.sent();
                            if (!confirmed) {
                                return [2 /*return*/];
                            }
                            return [2 /*return*/, webPage_1.webPages.setValue
                                    .submit({
                                    name: targetName,
                                    published: false,
                                })
                                    .then(function () {
                                    frappe_ui_1.toast.success("Page unpublished");
                                    if (page) {
                                        page.published = 0;
                                    }
                                    else {
                                        _this.setPage(_this.selectedPage);
                                    }
                                    builderSettings_1.builderSettings.reload();
                                })];
                    }
                });
            });
        },
        updateActivePage: function (key, value) {
            var _this = this;
            if (!this.activePage) {
                return Promise.resolve(null);
            }
            // Optimistically update in-place so reactive bindings stay consistent
            this.activePage[key] = value;
            return serializeSave(function () {
                var _a;
                var _b;
                return webPage_1.webPages.setValue.submit((_a = {
                        name: (_b = _this.activePage) === null || _b === void 0 ? void 0 : _b.name
                    },
                    _a[key] = value,
                    _a));
            });
        },
        savePage: function (extraFields) {
            var _this = this;
            if (extraFields === void 0) { extraFields = {}; }
            var builderStore = (0, builderStore_1.default)();
            if (builderStore.readOnlyMode) {
                // callers may have optimistically set this before invoking savePage
                this.savingPage = false;
                return;
            }
            // Own the saving flag here (not only in the editor watch) so every caller —
            // including direct savePage() calls — keeps waitTillPageIsSaved reliable.
            this.savingPage = true;
            var canvasStore = (0, canvasStore_1.default)();
            var pageData = JSON.stringify(canvasStore
                .getPageBlocks()
                .filter(function (block) { return block !== undefined; })
                .map(function (block) { return (0, helpers_1.getCopyWithoutParent)(block); }));
            var saveId = (0, helpers_1.generateId)();
            // more save requests can be triggered till the first one is completed
            this.saveId = saveId;
            var args = __assign({ name: this.selectedPage, draft_blocks: pageData }, extraFields);
            return serializeSave(function () {
                return webPage_1.webPages.setValue
                    .submit(args)
                    .then(function (page) {
                    if (_this.activePage) {
                        Object.assign(_this.activePage, page);
                    }
                    else {
                        _this.activePage = page;
                    }
                })
                    .catch(function (e) {
                    if ((e === null || e === void 0 ? void 0 : e.exc_type) === "InReadOnlyMode") {
                        builderStore.isSiteInReadOnlyMode = true;
                        return;
                    }
                    throw e;
                })
                    .finally(function () {
                    var _a;
                    if (_this.saveId === saveId) {
                        _this.saveId = null;
                        _this.savingPage = false;
                    }
                    (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.toggleDirty(false);
                });
            });
        },
        setPageData: function (page) {
            var _this = this;
            if (!page || !page.page_data_script) {
                this.pageData = {};
                return;
            }
            return webPage_1.webPages.runDocMethod
                .submit({
                method: "get_page_data",
                name: page.name,
                route_variables: this.routeVariables,
            })
                .then(function (data) {
                _this.pageData = data.message;
            })
                .catch(function (e) {
                var _a;
                var error_message = (_a = e.exc) === null || _a === void 0 ? void 0 : _a.split("\n").slice(-2)[0];
                frappe_ui_1.toast.error("There was an error while fetching page data", {
                    description: error_message,
                });
            });
        },
        setRouteVariable: function (variable, value) {
            this.routeVariables[variable] = value;
            localStorage.setItem("".concat(this.selectedPage, ":routeVariables"), JSON.stringify(this.routeVariables));
            this.setPageData(this.activePage);
        },
        openPageInBrowser: function (page) {
            var _a, _b, _c, _d;
            // Empty/"/" route = homepage. Don't treat it as falsy and fall back to a
            // derived path — reuse the stored route as-is and let the resolvers map
            // "" (or "/") to the site root.
            var route = (_d = (_c = (_a = page === null || page === void 0 ? void 0 : page.route) !== null && _a !== void 0 ? _a : (_b = this.activePage) === null || _b === void 0 ? void 0 : _b.route) !== null && _c !== void 0 ? _c : this.route) !== null && _d !== void 0 ? _d : "/";
            // The builder can run on the creator's subdomain host ({sub}.{domain}:
            // {builderPort}), while the live webapp lives on the WEBAPP_DOMAIN env.
            // Extract the subdomain (auth subdomain, else from the current URL) and
            // let getWebappPageUrl rebuild the public webapp URL — never fall back to
            // window.location.origin (the builder host).
            var subdomain = (0, creatorbase_1.getCreatorAuth)().subdomain;
            var sub = subdomain || (0, creatorbase_1.getCurrentSubdomain)();
            var pageURL = (0, creatorbase_1.getWebappPageUrl)(route, sub) || this.getResolvedPageURL(true, page);
            // getWebappPageUrl returns "" only when no webapp base resolved; a real
            // URL from it always carries a scheme. Anything else is a relative path
            // on the current host.
            var safeUrl = /^https?:\/\//i.test(pageURL) ? pageURL : this.getResolvedPageURL(true, page) || "/";
            // Open in a fresh tab every click (window name "builder-preview" would
            // reuse the same tab).
            window.open(safeUrl, "_blank", "noopener,noreferrer");
        },
        getResolvedPageURL: function (prependSlash, page) {
            var _this = this;
            var _a, _b, _c;
            if (prependSlash === void 0) { prependSlash = true; }
            if (page === void 0) { page = null; }
            var route = (_c = (_a = page === null || page === void 0 ? void 0 : page.route) !== null && _a !== void 0 ? _a : (_b = this.activePage) === null || _b === void 0 ? void 0 : _b.route) !== null && _c !== void 0 ? _c : "";
            if (this.pageData) {
                var routeVariables = (0, helpers_1.getRouteVariables)(route || "");
                routeVariables.forEach(function (variable) {
                    var routeVariableValue = _this.routeVariables[variable];
                    if (routeVariableValue) {
                        if (route === null || route === void 0 ? void 0 : route.includes("<".concat(variable, ">"))) {
                            route = route === null || route === void 0 ? void 0 : route.replace("<".concat(variable, ">"), routeVariableValue);
                        }
                        else if (route === null || route === void 0 ? void 0 : route.includes(":".concat(variable))) {
                            route = route === null || route === void 0 ? void 0 : route.replace(":".concat(variable), routeVariableValue);
                        }
                    }
                });
            }
            var normalizedRoute = (route || "").trim().replace(/^\/+/, "");
            // Empty (or "/") route resolves to the site root.
            return normalizedRoute ? "".concat(prependSlash ? "/" : "").concat(normalizedRoute) : "/";
        },
        waitTillPageIsSaved: function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.savingPage) return [3 /*break*/, 2];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/, new Promise(function (resolve) {
                                var interval = setInterval(function () {
                                    if (!_this.savingPage) {
                                        clearInterval(interval);
                                        resolve(null);
                                    }
                                }, 100);
                            })];
                    }
                });
            });
        },
        isHomePage: function (page) {
            var _a, _b;
            if (page === void 0) { page = null; }
            return ((_a = builderSettings_1.builderSettings.doc) === null || _a === void 0 ? void 0 : _a.home_page) === ((_b = (page || this.activePage)) === null || _b === void 0 ? void 0 : _b.route);
        },
    },
});
exports.default = usePageStore;
//# sourceMappingURL=pageStore.js.map