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
var useLatestRequest_1 = require("@/composables/useLatestRequest");
var snapshot_1 = require("@/data/snapshot");
var webPage_1 = require("@/data/webPage");
var webComponent_1 = __importDefault(require("@/data/webComponent"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var pageStore_1 = __importDefault(require("@/stores/pageStore"));
var blockTemplate_1 = __importDefault(require("@/utils/blockTemplate"));
var helpers_1 = require("@/utils/helpers");
var frappe_ui_1 = require("frappe-ui");
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var runLatestRequest = (0, useLatestRequest_1.useLatestRequest)().run;
// key used to track a pinned (component, version) pair
var pinKey = function (componentId, version) { return "".concat(componentId, "::").concat(version); };
// visit a block and all its descendants
var walkBlocks = function (block, visitor) {
    if (!block)
        return;
    visitor(block);
    (block.children || []).forEach(function (child) { return walkBlocks(child, visitor); });
};
// set the component version on every block belonging to `componentId` (instance root + materialized
// children) in a subtree. When `onlyPinned` is true, only blocks that already have a componentVersion
// are touched (used for re-pin); otherwise all matching blocks are pinned (used for fresh instances).
var setSubtreeComponentVersion = function (block, componentId, version, onlyPinned) {
    if (onlyPinned === void 0) { onlyPinned = false; }
    return walkBlocks(block, function (b) {
        if ((b.extendedFromComponent === componentId || b.isChildOfComponent === componentId) &&
            (!onlyPinned || b.componentVersion)) {
            b.componentVersion = version;
        }
    });
};
var useComponentStore = (0, pinia_1.defineStore)("componentStore", {
    state: function () { return ({
        components: [],
        componentMap: new Map(),
        componentDocMap: new Map(),
        componentDraftMap: new Map(),
        fetchingComponent: new Set(),
        selectedComponent: null,
        // frozen component versions, keyed by the version snapshot name (the pin)
        componentVersionMap: new Map(),
        fetchingComponentVersion: new Set(),
        // `${componentId}::${version}` for pinned instances whose live component changed
        outdatedPins: new Set(),
        // bumped on re-pin to force pinned `referenceComponent` computeds to recompute
        // (their closure captures the pre-reactive block, so a changed componentVersion
        // alone doesn't invalidate them — see getComponentVersionBlock)
        versionBump: 0,
        componentData: {},
    }); },
    actions: {
        editComponent: function (block, componentName) {
            return __awaiter(this, void 0, void 0, function () {
                var component, componentBlock, canvasStore;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(block === null || block === void 0 ? void 0 : block.isExtendedFromComponent()) && !componentName) {
                                return [2 /*return*/];
                            }
                            componentName =
                                componentName || (block === null || block === void 0 ? void 0 : block.extendedFromComponent) || (block === null || block === void 0 ? void 0 : block.isChildOfComponent);
                            return [4 /*yield*/, this.loadComponent(componentName)];
                        case 1:
                            _a.sent();
                            component = this.getComponent(componentName);
                            componentBlock = this.getComponentBlock(componentName);
                            canvasStore = (0, canvasStore_1.default)();
                            canvasStore.editOnCanvas(componentBlock, "component", function (block) { return _this.saveComponent(block, componentName); }, "Save Component", component.component_name, component.name, true);
                            return [2 /*return*/];
                    }
                });
            });
        },
        saveComponent: function (block, componentName) {
            var _this = this;
            var pageStore = (0, pageStore_1.default)();
            var doc = this.getComponentDraft(componentName);
            if (!doc) {
                frappe_ui_1.toast.error("Failed to save component", {
                    description: "Component draft is unavailable.",
                });
                throw new Error("Missing draft for component ".concat(componentName));
            }
            return webComponent_1.default.setValue
                .submit({
                name: componentName,
                block: (0, helpers_1.getBlockObject)(block),
                component_data_script: (doc === null || doc === void 0 ? void 0 : doc.component_data_script) || "",
            })
                .then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.setComponentMap(data);
                    frappe_ui_1.toast.success("Component saved!", {
                        duration: 5000,
                        action: {
                            label: "Sync in all pages",
                            onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                var componentResource;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            componentResource = (0, frappe_ui_1.createResource)({
                                                url: "builder.api.sync_component",
                                                method: "POST",
                                                params: {
                                                    component_id: data.name,
                                                },
                                                auto: true,
                                            });
                                            return [4 /*yield*/, frappe_ui_1.toast.promise(componentResource.promise, {
                                                    loading: "Syncing component in all the pages...",
                                                    success: function () {
                                                        pageStore.fetchActivePage().then(function () {
                                                            var _a;
                                                            pageStore.setPage((_a = pageStore.activePage) === null || _a === void 0 ? void 0 : _a.name);
                                                        });
                                                        return "Component synced in all the pages!";
                                                    },
                                                    error: function () { return "Error syncing component in all the pages!"; },
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                        },
                    });
                    return [2 /*return*/];
                });
            }); })
                .catch(function (error) {
                frappe_ui_1.toast.error("Failed to save component");
                throw error;
            });
        },
        isComponentUsed: function (componentName) {
            var _a, _b;
            // TODO: Refactor or reduce complexity
            var checkComponent = function (block) {
                if (block.extendedFromComponent === componentName) {
                    return true;
                }
                if (block.children) {
                    for (var _i = 0, _a = block.children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        if (checkComponent(child)) {
                            return true;
                        }
                    }
                }
                return false;
            };
            var canvasStore = (0, canvasStore_1.default)();
            for (var _i = 0, _c = ((_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.getRootBlock()) === null || _b === void 0 ? void 0 : _b.children) || []; _i < _c.length; _i++) {
                var block = _c[_i];
                if (checkComponent(block)) {
                    return true;
                }
            }
            return false;
        },
        getComponentBlock: function (componentName) {
            return (this.componentMap.get(componentName) ||
                (0, helpers_1.getBlockInstance)((0, blockTemplate_1.default)("empty-component")));
        },
        loadComponent: function (componentName) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (!this.componentMap.has(componentName) && !this.fetchingComponent.has(componentName)) {
                        this.fetchingComponent.add(componentName);
                        return [2 /*return*/, this.fetchComponent(componentName)
                                .then(function (componentDoc) {
                                _this.setComponentMap(componentDoc);
                            })
                                .catch(function () {
                                var missingComponentDoc = {
                                    name: componentName,
                                    block: JSON.stringify((0, blockTemplate_1.default)("missing-component")),
                                    creation: "",
                                    modified: "",
                                    owner: "Administrator",
                                    modified_by: "Administrator",
                                };
                                _this.setComponentMap(missingComponentDoc);
                            })
                                .finally(function () {
                                _this.fetchingComponent.delete(componentName);
                            })];
                    }
                    return [2 /*return*/];
                });
            });
        },
        setComponentMap: function (componentDoc) {
            this.componentDocMap.set(componentDoc.name, componentDoc);
            this.componentMap.set(componentDoc.name, (0, vue_1.markRaw)((0, helpers_1.getBlockInstance)(componentDoc.block)));
        },
        setComponentDraft: function (name, componentDoc) {
            this.componentDraftMap.set(name, componentDoc);
        },
        fetchComponent: function (componentName) {
            return __awaiter(this, void 0, void 0, function () {
                var webComponentDoc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, frappe_ui_1.createDocumentResource)({
                                doctype: "Builder Component",
                                name: componentName,
                                auto: true,
                            })];
                        case 1:
                            webComponentDoc = _a.sent();
                            return [4 /*yield*/, webComponentDoc.get.promise];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, webComponentDoc.doc];
                    }
                });
            });
        },
        getComponentVersionBlock: function (versionName) {
            // touch versionBump so a re-pin (which changes a block's componentVersion to a
            // brand-new key this computed never read) still invalidates the computed
            this.versionBump;
            var doc = this.componentVersionMap.get(versionName);
            return doc ? (0, vue_1.markRaw)((0, helpers_1.getBlockInstance)(doc.block)) : null;
        },
        getComponentVersionDoc: function (versionName) {
            var _a;
            this.versionBump;
            return (_a = this.componentVersionMap.get(versionName)) !== null && _a !== void 0 ? _a : null;
        },
        loadComponentVersion: function (versionName, componentId) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, versionedDoc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.componentVersionMap.has(versionName) || this.fetchingComponentVersion.has(versionName)) {
                                return [2 /*return*/];
                            }
                            this.fetchingComponentVersion.add(versionName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, , 6, 7]);
                            return [4 /*yield*/, (0, snapshot_1.getVersionedDoc)(versionName)];
                        case 2:
                            doc = _a.sent();
                            if (!(doc === null || doc === void 0 ? void 0 : doc.block)) return [3 /*break*/, 3];
                            versionedDoc = __assign({}, doc);
                            this.componentVersionMap.set(versionName, versionedDoc);
                            return [3 /*break*/, 5];
                        case 3: 
                        // pruned/missing version — show the live component instead
                        return [4 /*yield*/, this.loadComponent(componentId)];
                        case 4:
                            // pruned/missing version — show the live component instead
                            _a.sent();
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            this.fetchingComponentVersion.delete(versionName);
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        },
        // collect the pinned (component, version) pairs in the current canvas
        getPinnedComponents: function () {
            var _a;
            var pins = new Map();
            walkBlocks((_a = (0, canvasStore_1.default)().activeCanvas) === null || _a === void 0 ? void 0 : _a.getRootBlock(), function (block) {
                if (block.extendedFromComponent && block.componentVersion) {
                    pins.set(pinKey(block.extendedFromComponent, block.componentVersion), {
                        component_id: block.extendedFromComponent,
                        version: block.componentVersion,
                    });
                }
            });
            return Array.from(pins.values());
        },
        // ask the server which pinned instances have a newer live component
        refreshComponentUpdates: function () {
            return __awaiter(this, void 0, void 0, function () {
                var pageStore, pins, res, outdated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pageStore = (0, pageStore_1.default)();
                            pins = this.getPinnedComponents();
                            if (!pageStore.selectedPage || !pins.length) {
                                this.outdatedPins = new Set();
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, webPage_1.webPages.runDocMethod.submit({
                                    name: pageStore.selectedPage,
                                    method: "get_outdated_component_pins",
                                    // stringify so the array survives the doc-method param encoding intact
                                    pins: JSON.stringify(pins),
                                })];
                        case 1:
                            res = _a.sent();
                            outdated = ((res === null || res === void 0 ? void 0 : res.message) || []);
                            this.outdatedPins = new Set(outdated.map(function (p) { return pinKey(p.component_id, p.version); }));
                            // load the live component docs so the roll-up panel can show friendly names
                            outdated.forEach(function (p) { return _this.loadComponent(p.component_id); });
                            return [2 /*return*/];
                    }
                });
            });
        },
        isPinOutdated: function (componentId, version) {
            if (!componentId || !version)
                return false;
            return this.outdatedPins.has(pinKey(componentId, version));
        },
        // mint the component's latest version and pin a freshly-used instance to it
        pinComponentInstance: function (block, componentName) {
            return __awaiter(this, void 0, void 0, function () {
                var pageStore, res, version;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            pageStore = (0, pageStore_1.default)();
                            if (!pageStore.selectedPage)
                                return [2 /*return*/];
                            return [4 /*yield*/, webPage_1.webPages.runDocMethod.submit({
                                    name: pageStore.selectedPage,
                                    method: "get_current_component_version",
                                    component_id: componentName,
                                })];
                        case 1:
                            res = _b.sent();
                            version = ((_a = res === null || res === void 0 ? void 0 : res.message) !== null && _a !== void 0 ? _a : res);
                            if (!version)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.loadComponentVersion(version, componentName)];
                        case 2:
                            _b.sent();
                            setSubtreeComponentVersion(block, componentName, version);
                            this.versionBump++;
                            return [2 /*return*/];
                    }
                });
            });
        },
        // mint the component's latest version, apply the given re-pin, and persist
        repinToLatest: function (componentId_1, repin_1) {
            return __awaiter(this, arguments, void 0, function (componentId, repin, refresh) {
                var pageStore, res, newVersion, newComponentBlock;
                var _a, _b;
                if (refresh === void 0) { refresh = true; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            pageStore = (0, pageStore_1.default)();
                            return [4 /*yield*/, webPage_1.webPages.runDocMethod.submit({
                                    name: pageStore.selectedPage,
                                    method: "get_current_component_version",
                                    component_id: componentId,
                                })];
                        case 1:
                            res = _c.sent();
                            newVersion = ((_a = res === null || res === void 0 ? void 0 : res.message) !== null && _a !== void 0 ? _a : res);
                            if (!newVersion)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.loadComponentVersion(newVersion, componentId)];
                        case 2:
                            _c.sent();
                            newComponentBlock = this.getComponentVersionBlock(newVersion);
                            if (!newComponentBlock)
                                return [2 /*return*/];
                            return [4 /*yield*/, repin(newVersion, newComponentBlock)];
                        case 3:
                            _c.sent();
                            this.versionBump++;
                            (_b = (0, canvasStore_1.default)().activeCanvas) === null || _b === void 0 ? void 0 : _b.toggleDirty(true);
                            pageStore.savePage();
                            if (!refresh) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.refreshComponentUpdates()];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        },
        // re-pin an instance to the latest version and rebuild its subtree from the new version,
        // preserving user overrides on matched children via three-way diff against the old version
        rebuildInstance: function (block, componentId, newVersion, newComponentBlock) {
            return __awaiter(this, void 0, void 0, function () {
                var oldVersion, oldComponentBlock;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            oldVersion = block.componentVersion;
                            oldComponentBlock = null;
                            if (!oldVersion) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.loadComponentVersion(oldVersion, componentId)];
                        case 1:
                            _a.sent();
                            oldComponentBlock = this.getComponentVersionBlock(oldVersion);
                            _a.label = 2;
                        case 2:
                            if (!oldComponentBlock) {
                                oldComponentBlock = this.getComponentBlock(componentId);
                            }
                            block.componentVersion = newVersion;
                            block.rebuildWithComponent(componentId, newComponentBlock.children, (oldComponentBlock === null || oldComponentBlock === void 0 ? void 0 : oldComponentBlock.children) || []);
                            return [2 /*return*/];
                    }
                });
            });
        },
        // re-pin a single instance (and its materialized children) to the latest version
        updatePinnedComponent: function (block) {
            var _this = this;
            var componentId = block.extendedFromComponent;
            if (!componentId)
                return;
            return this.repinToLatest(componentId, function (newVersion, newComponentBlock) {
                return _this.rebuildInstance(block, componentId, newVersion, newComponentBlock);
            });
        },
        // re-pin every instance of a component on the page to the latest version
        updateComponentInstances: function (componentId, refresh) {
            var _this = this;
            if (refresh === void 0) { refresh = true; }
            return this.repinToLatest(componentId, function (newVersion, newComponentBlock) { return __awaiter(_this, void 0, void 0, function () {
                var roots, _i, roots_1, root;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            roots = [];
                            walkBlocks((_a = (0, canvasStore_1.default)().activeCanvas) === null || _a === void 0 ? void 0 : _a.getRootBlock(), function (b) {
                                if (b.extendedFromComponent === componentId && b.componentVersion) {
                                    roots.push(b);
                                }
                            });
                            _i = 0, roots_1 = roots;
                            _b.label = 1;
                        case 1:
                            if (!(_i < roots_1.length)) return [3 /*break*/, 4];
                            root = roots_1[_i];
                            return [4 /*yield*/, this.rebuildInstance(root, componentId, newVersion, newComponentBlock)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }, refresh);
        },
        // first instance block of a component on the current page (for canvas highlight on hover)
        getComponentInstanceBlock: function (componentId) {
            var _a;
            var instance = null;
            walkBlocks((_a = (0, canvasStore_1.default)().activeCanvas) === null || _a === void 0 ? void 0 : _a.getRootBlock(), function (block) {
                if (!instance && block.extendedFromComponent === componentId) {
                    instance = block;
                }
            });
            return instance;
        },
        // summary of outdated pinned components on the page (for the roll-up panel)
        getOutdatedComponentList: function () {
            var _this = this;
            var _a;
            var counts = new Map();
            walkBlocks((_a = (0, canvasStore_1.default)().activeCanvas) === null || _a === void 0 ? void 0 : _a.getRootBlock(), function (block) {
                if (_this.isPinOutdated(block.extendedFromComponent, block.componentVersion)) {
                    counts.set(block.extendedFromComponent, (counts.get(block.extendedFromComponent) || 0) + 1);
                }
            });
            return Array.from(counts.entries()).map(function (_a) {
                var component_id = _a[0], count = _a[1];
                return ({
                    component_id: component_id,
                    component_name: _this.getComponentName(component_id),
                    count: count,
                });
            });
        },
        updateAllOutdatedComponents: function () {
            return __awaiter(this, void 0, void 0, function () {
                var items, _i, items_1, item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            items = this.getOutdatedComponentList();
                            _i = 0, items_1 = items;
                            _a.label = 1;
                        case 1:
                            if (!(_i < items_1.length)) return [3 /*break*/, 4];
                            item = items_1[_i];
                            return [4 /*yield*/, this.updateComponentInstances(item.component_id, false)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [4 /*yield*/, this.refreshComponentUpdates()];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        getComponent: function (componentName) {
            return this.componentDocMap.get(componentName);
        },
        getComponentDraft: function (componentName) {
            return this.componentDraftMap.get(componentName);
        },
        createComponent: function (obj, updateExisting) {
            var _this = this;
            if (updateExisting === void 0) { updateExisting = false; }
            var component = this.getComponent(obj.name);
            if (component) {
                var existingComponent = component.block;
                var newComponent = obj.block;
                if (updateExisting && existingComponent !== newComponent) {
                    return webComponent_1.default.setValue.submit({
                        name: obj.name,
                        block: obj.block,
                    });
                }
                else {
                    console.warn("Skipping component update", obj.name);
                    return;
                }
            }
            return webComponent_1.default.insert
                .submit(obj)
                .then(function () {
                _this.setComponentMap(obj);
            })
                .catch(function (e) {
                var _a;
                if (((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status) === 409) {
                    if (updateExisting) {
                        return webComponent_1.default.setValue.submit({
                            name: obj.name,
                            block: obj.block,
                        });
                    }
                }
            });
        },
        getComponentName: function (componentId, componentVersion) {
            var componentObj = this.componentDocMap.get(componentId);
            if (!componentObj && componentVersion) {
                componentObj = this.componentVersionMap.get(componentVersion);
            }
            if (!componentObj) {
                return componentId;
            }
            return componentObj.component_name;
        },
        deleteComponent: function (component) {
            return __awaiter(this, void 0, void 0, function () {
                var confirmed;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isComponentUsed(component.name)) return [3 /*break*/, 1];
                            (0, helpers_1.alert)("Component is used in current page. You cannot delete it.");
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, (0, helpers_1.confirm)("Are you sure you want to delete component: ".concat(component.component_name, "?"))];
                        case 2:
                            confirmed = _a.sent();
                            if (confirmed) {
                                webComponent_1.default.delete.submit(component.name).then(function () {
                                    _this.componentMap.delete(component.name);
                                });
                            }
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        deleteComponentDraft: function (componentName) {
            this.componentDraftMap.delete(componentName);
        },
        getComponentInstanceData: function (componentId, blockId) {
            var _a, _b;
            var instanceKey = blockId;
            return (_b = (_a = this.componentData[componentId]) === null || _a === void 0 ? void 0 : _a[instanceKey]) !== null && _b !== void 0 ? _b : {};
        },
        setComponentData: function (componentId_1) {
            return __awaiter(this, arguments, void 0, function (componentId, props, blockId, componentVersion) {
                var instanceKey, requestKey, versionedDoc, script, result;
                var _a;
                if (props === void 0) { props = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            instanceKey = blockId;
                            requestKey = "".concat(componentId, "::").concat(instanceKey);
                            versionedDoc = componentVersion
                                ? this.getComponentVersionDoc(componentVersion)
                                : this.getComponent(componentId);
                            script = (_a = versionedDoc === null || versionedDoc === void 0 ? void 0 : versionedDoc.component_data_script) !== null && _a !== void 0 ? _a : undefined;
                            return [4 /*yield*/, runLatestRequest(requestKey, function () {
                                    return (0, frappe_ui_1.createResource)({
                                        url: "builder.api.get_component_data",
                                        method: "POST",
                                        auto: false,
                                    })
                                        .submit({
                                        component_name: componentId,
                                        props: JSON.stringify(props),
                                        script: script,
                                    })
                                        .then(function (data) { return data !== null && data !== void 0 ? data : {}; })
                                        .catch(function (e) {
                                        console.error("Failed to fetch component data:", e.message);
                                        return {};
                                    });
                                })];
                        case 1:
                            result = _b.sent();
                            if (result.stale) {
                                return [2 /*return*/];
                            }
                            if (!this.componentData[componentId]) {
                                this.componentData[componentId] = {};
                            }
                            this.componentData[componentId][instanceKey] = result.value;
                            return [2 /*return*/];
                    }
                });
            });
        },
        deleteComponentData: function (componentId, blockId) {
            return __awaiter(this, void 0, void 0, function () {
                var instanceKey;
                return __generator(this, function (_a) {
                    instanceKey = blockId;
                    if (!this.componentData[componentId])
                        return [2 /*return*/];
                    this.componentData[componentId][instanceKey] = {};
                    return [2 /*return*/];
                });
            });
        },
    },
});
exports.default = useComponentStore;
//# sourceMappingURL=componentStore.js.map