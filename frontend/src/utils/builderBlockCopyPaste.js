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
exports.copyBuilderBlocks = copyBuilderBlocks;
exports.pasteBuilderBlocks = pasteBuilderBlocks;
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var componentStore_1 = __importDefault(require("@/stores/componentStore"));
var pageStore_1 = __importDefault(require("@/stores/pageStore"));
var builderToken_1 = __importDefault(require("@/data/builderToken"));
var helpers_1 = require("@/utils/helpers");
var frappe_ui_1 = require("frappe-ui");
var vue_1 = require("vue");
var webPage_1 = require("../data/webPage");
function copyBuilderBlocks(e, currentSiteURL, copyEntirePage) {
    var _a, _b, _c, _d, _e, _f;
    if (copyEntirePage === void 0) { copyEntirePage = false; }
    var canvasStore = (0, canvasStore_1.default)();
    var componentStore = (0, componentStore_1.default)();
    var pageStore = (0, pageStore_1.default)();
    if (!((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.length) && !copyEntirePage)
        return;
    e.preventDefault();
    var blocks = (copyEntirePage
        ? [(_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.getRootBlock()]
        : (_d = (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.selectedBlocks) !== null && _d !== void 0 ? _d : []);
    var componentDocuments = [];
    var variableNames = new Set();
    var blocksToCopy = blocks.map(function (block) {
        // Collect all used components
        var components = block.getUsedComponentNames();
        for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
            var componentName = components_1[_i];
            var component = componentStore.getComponent(componentName);
            if (component) {
                componentDocuments.push(component);
            }
        }
        var variables = block.getUsedVariableNames();
        for (var _a = 0, variables_1 = variables; _a < variables_1.length; _a++) {
            var variableName = variables_1[_a];
            variableNames.add(variableName);
        }
        // Handle component children and create copy
        var blockCopy = null;
        if (!Boolean(block.extendedFromComponent) && block.isChildOfComponent) {
            blockCopy = (0, helpers_1.detachBlockFromComponent)(block, null);
        }
        else {
            blockCopy = (0, helpers_1.getCopyWithoutParent)(block);
        }
        return blockCopy;
    });
    var variableDocuments = [];
    var _loop_1 = function (variableName) {
        var variable = (_e = builderToken_1.default.data) === null || _e === void 0 ? void 0 : _e.find(function (v) { return v.name === variableName; });
        if (variable) {
            // variable_name keeps the clipboard readable by sites on the pre-rename schema
            variableDocuments.push(__assign(__assign({}, variable), { variable_name: variable.token_name }));
        }
    };
    for (var _i = 0, variableNames_1 = variableNames; _i < variableNames_1.length; _i++) {
        var variableName = variableNames_1[_i];
        _loop_1(variableName);
    }
    var dataToCopy = {
        blocks: blocksToCopy,
        components: componentDocuments,
        variables: variableDocuments,
        sourceURL: currentSiteURL,
    };
    if (copyEntirePage) {
        var currentPage = pageStore.activePage;
        dataToCopy.pageDoc = {
            page_name: currentPage.page_name,
            route: currentPage.route,
            dynamic_route: currentPage.dynamic_route,
            page_data_script: currentPage.page_data_script,
            head_html: currentPage.head_html,
            body_html: currentPage.body_html,
            page_title: currentPage.page_title,
            meta_description: currentPage.meta_description,
            meta_image: currentPage.meta_image,
            authenticated_access: currentPage.authenticated_access,
            disable_indexing: currentPage.disable_indexing,
            favicon: currentPage.favicon,
            client_scripts: ((_f = currentPage.client_scripts) === null || _f === void 0 ? void 0 : _f.map(function (script) {
                return {
                    builder_script: script.builder_script,
                    idx: script.idx,
                };
            })) || [],
        };
        dataToCopy.pageScripts = pageStore.activePageScripts;
    }
    (0, helpers_1.copyToClipboard)(dataToCopy, e, "builder-copied-blocks");
    copyEntirePage && frappe_ui_1.toast.success("Page Copied");
}
function pasteBuilderBlocks(e, currentSiteURL) {
    return __awaiter(this, void 0, void 0, function () {
        var data, clipboardData, crossSitePaste;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    data = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.getData("builder-copied-blocks");
                    if (!data || !(0, helpers_1.isJSONString)(data))
                        return [2 /*return*/];
                    clipboardData = JSON.parse(data);
                    crossSitePaste = Boolean(clipboardData.sourceURL && clipboardData.sourceURL !== currentSiteURL);
                    if (!clipboardData.pageDoc) return [3 /*break*/, 2];
                    return [4 /*yield*/, handlePagePaste(clipboardData, crossSitePaste, currentSiteURL)];
                case 1:
                    _e.sent();
                    return [3 /*break*/, 7];
                case 2:
                    if (!(clipboardData.components.length || ((_b = clipboardData.variables) === null || _b === void 0 ? void 0 : _b.length))) return [3 /*break*/, 5];
                    frappe_ui_1.toast.loading("Pasting...", {
                        id: "paste-blocks",
                    });
                    return [4 /*yield*/, handleComponents(clipboardData, crossSitePaste)];
                case 3:
                    _e.sent();
                    if (!((_c = clipboardData.variables) === null || _c === void 0 ? void 0 : _c.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, handleVariables(clipboardData, crossSitePaste)];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5: return [4 /*yield*/, insertBlocks(clipboardData.blocks)];
                case 6:
                    _e.sent();
                    (clipboardData.components.length || ((_d = clipboardData.variables) === null || _d === void 0 ? void 0 : _d.length)) &&
                        frappe_ui_1.toast.success("Done", {
                            id: "paste-blocks",
                        });
                    _e.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function handlePagePaste(clipboardData_1, crossSitePaste_1) {
    return __awaiter(this, arguments, void 0, function (clipboardData, crossSitePaste, currentURL) {
        var canvasStore, pageStore;
        if (currentURL === void 0) { currentURL = undefined; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvasStore = (0, canvasStore_1.default)();
                    pageStore = (0, pageStore_1.default)();
                    return [4 /*yield*/, (0, helpers_1.showDialog)({
                            title: "Pasting a page!",
                            message: "You are about to paste a page with settings and scripts. Do you want to update the current page or create a new one?",
                            actions: [
                                {
                                    label: "Create New Page",
                                    variant: "solid",
                                    onClick: function () {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var newPage;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        frappe_ui_1.toast.loading("Pasting...", { id: "paste-page" });
                                                        return [4 /*yield*/, handleComponents(clipboardData, crossSitePaste)];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, handlePageScripts(clipboardData, currentURL || "")];
                                                    case 2:
                                                        _a.sent();
                                                        if (clipboardData.pageDoc) {
                                                            clipboardData.pageDoc.blocks = clipboardData.blocks.map(function (block) { return (0, helpers_1.getCopyWithoutParent)(block); });
                                                        }
                                                        return [4 /*yield*/, webPage_1.webPages.insert.submit(clipboardData.pageDoc)];
                                                    case 3:
                                                        newPage = _a.sent();
                                                        window.location.href = "/builder/page/".concat(encodeURIComponent(newPage.name));
                                                        return [4 /*yield*/, pageStore.setPage(newPage.name)];
                                                    case 4:
                                                        _a.sent();
                                                        frappe_ui_1.toast.success("Done", { id: "paste-page" });
                                                        return [2 /*return*/];
                                                }
                                            });
                                        });
                                    },
                                },
                                {
                                    label: "Update Current Page",
                                    variant: "subtle",
                                    onClick: function () {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var currentPage;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        frappe_ui_1.toast.loading("Pasting...", { id: "paste-page" });
                                                        return [4 /*yield*/, handleComponents(clipboardData, crossSitePaste)];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, handlePageScripts(clipboardData, currentURL || "")];
                                                    case 2:
                                                        _a.sent();
                                                        currentPage = pageStore.activePage;
                                                        return [4 /*yield*/, webPage_1.webPages.setValue.submit(__assign(__assign({}, clipboardData.pageDoc), { name: currentPage.name }))];
                                                    case 3:
                                                        _a.sent();
                                                        return [4 /*yield*/, pageStore.setPage(currentPage.name)];
                                                    case 4:
                                                        _a.sent();
                                                        (0, vue_1.nextTick)(function () {
                                                            canvasStore.pushBlocks(clipboardData.blocks, false);
                                                            pageStore.savePage();
                                                        });
                                                        frappe_ui_1.toast.success("Done", { id: "paste-page" });
                                                        return [2 /*return*/];
                                                }
                                            });
                                        });
                                    },
                                },
                            ],
                            size: "md",
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// clipboards copied from a site on the pre-rename schema carry variable_name
function normalizeLegacyToken(variable) {
    if (!variable.token_name && variable.variable_name) {
        variable.token_name = variable.variable_name;
    }
    delete variable.variable_name;
    return variable;
}
function handleVariables(clipboardData, crossSitePaste) {
    return __awaiter(this, void 0, void 0, function () {
        var idMap, _loop_2, _i, _a, variable;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    idMap = new Map();
                    _loop_2 = function (variable) {
                        var originalName, twin, newName, error_1, existing, error_2;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    if (!crossSitePaste) return [3 /*break*/, 5];
                                    originalName = variable.name;
                                    twin = (_b = builderToken_1.default.data) === null || _b === void 0 ? void 0 : _b.find(function (v) {
                                        return v.token_name === variable.token_name && v.value === variable.value && v.type === variable.type;
                                    });
                                    newName = twin === null || twin === void 0 ? void 0 : twin.name;
                                    if (!!newName) return [3 /*break*/, 4];
                                    _g.label = 1;
                                case 1:
                                    _g.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, builderToken_1.default.insert.submit(variable)];
                                case 2:
                                    newName = (_c = (_g.sent())) === null || _c === void 0 ? void 0 : _c.name;
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _g.sent();
                                    console.error("Error inserting token:", error_1);
                                    return [3 /*break*/, 4];
                                case 4:
                                    if (newName && newName !== originalName) {
                                        idMap.set(originalName, newName);
                                    }
                                    return [3 /*break*/, 9];
                                case 5:
                                    existing = (_d = builderToken_1.default.data) === null || _d === void 0 ? void 0 : _d.find(function (v) { return v.name === variable.name; });
                                    if (!!existing) return [3 /*break*/, 9];
                                    _g.label = 6;
                                case 6:
                                    _g.trys.push([6, 8, , 9]);
                                    return [4 /*yield*/, builderToken_1.default.insert.submit(variable)];
                                case 7:
                                    _g.sent();
                                    return [3 /*break*/, 9];
                                case 8:
                                    error_2 = _g.sent();
                                    if (((_e = error_2 === null || error_2 === void 0 ? void 0 : error_2.response) === null || _e === void 0 ? void 0 : _e.status) !== 409) {
                                        console.error("Error inserting variable:", error_2);
                                    }
                                    return [3 /*break*/, 9];
                                case 9: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = (clipboardData.variables || []).map(normalizeLegacyToken);
                    _f.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    variable = _a[_i];
                    return [5 /*yield**/, _loop_2(variable)];
                case 2:
                    _f.sent();
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (crossSitePaste && idMap.size) {
                        clipboardData.blocks.forEach(function (block) { return rewriteVariableRefsInBlock(block, idMap); });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function rewriteVariableRefsInBlock(block, idMap) {
    var _a;
    if (!idMap.size)
        return;
    var pattern = new RegExp("var\\(--(".concat(Array.from(idMap.keys())
        .map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); })
        .join("|"), ")(?=[,\\s)])"), "g");
    var rewrite = function (value) {
        if (typeof value !== "string" || !value.includes("var(--"))
            return value;
        return value.replace(pattern, function (_match, name) { return "var(--".concat(idMap.get(name)); });
    };
    var rewriteObj = function (obj) {
        if (!obj)
            return;
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            obj[key] = rewrite(obj[key]);
        }
    };
    rewriteObj(block.baseStyles);
    rewriteObj(block.mobileStyles);
    rewriteObj(block.tabletStyles);
    rewriteObj(block.attributes);
    if (block.innerHTML)
        block.innerHTML = rewrite(block.innerHTML);
    (_a = block.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) { return rewriteVariableRefsInBlock(child, idMap); });
}
function handleComponents(clipboardData, crossSitePaste) {
    return __awaiter(this, void 0, void 0, function () {
        var componentStore, componentIdMap, blocks, _i, _a, component, originalId, newId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    componentStore = (0, componentStore_1.default)();
                    componentIdMap = new Map();
                    blocks = clipboardData.blocks;
                    _i = 0, _a = clipboardData.components;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    component = _a[_i];
                    delete component.for_web_page;
                    if (!crossSitePaste) return [3 /*break*/, 3];
                    originalId = component.name;
                    newId = generateHash(originalId, clipboardData.sourceURL || "");
                    componentIdMap.set(originalId, newId);
                    component.name = newId;
                    component.component_id = newId;
                    return [4 /*yield*/, componentStore.createComponent(component, true)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, componentStore.createComponent(component, false)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    if (crossSitePaste) {
                        blocks.map(function (block) {
                            updateBlockComponentReferences(block, componentIdMap);
                            var blockCopy = (0, helpers_1.getBlockInstance)(block);
                            updateURLsInBlock(blockCopy, clipboardData.sourceURL);
                            return blockCopy;
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function insertBlocks(blocks) {
    return __awaiter(this, void 0, void 0, function () {
        var canvasStore, parentBlock_1;
        var _a;
        return __generator(this, function (_b) {
            canvasStore = (0, canvasStore_1.default)();
            if (((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.length) && blocks[0].blockId !== "root") {
                parentBlock_1 = canvasStore.activeCanvas.selectedBlocks[0];
                while (parentBlock_1 && !parentBlock_1.canHaveChildren()) {
                    parentBlock_1 = parentBlock_1.getParentBlock();
                }
                blocks.forEach(function (block) { return parentBlock_1.addChild((0, helpers_1.getBlockCopy)(block), null, true); });
            }
            else {
                canvasStore.pushBlocks(blocks.map(function (block) { return (0, helpers_1.getBlockCopy)(block); }), false);
            }
            return [2 /*return*/];
        });
    });
}
function handlePageScripts(clipboardData, currentSiteURL) {
    return __awaiter(this, void 0, void 0, function () {
        var pageScriptIdMap, _loop_3, _i, _a, script;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!clipboardData.pageDoc || !clipboardData.sourceURL || clipboardData.sourceURL === currentSiteURL) {
                        return [2 /*return*/];
                    }
                    pageScriptIdMap = new Map();
                    _loop_3 = function (script) {
                        var newScriptId, scriptDoc, clientScriptResource, error_3, clientScript;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    newScriptId = generateHash(script.name, clipboardData.sourceURL, true);
                                    pageScriptIdMap.set(script.name, newScriptId);
                                    scriptDoc = __assign(__assign({}, script), { name: newScriptId });
                                    clientScriptResource = (0, frappe_ui_1.createListResource)({
                                        doctype: "Builder Client Script",
                                    });
                                    _e.label = 1;
                                case 1:
                                    _e.trys.push([1, 3, , 7]);
                                    return [4 /*yield*/, clientScriptResource.insert.submit(scriptDoc)];
                                case 2:
                                    _e.sent();
                                    return [3 /*break*/, 7];
                                case 3:
                                    error_3 = _e.sent();
                                    if (!(((_b = error_3 === null || error_3 === void 0 ? void 0 : error_3.response) === null || _b === void 0 ? void 0 : _b.status) === 409)) return [3 /*break*/, 5];
                                    // If script already exists, update it
                                    return [4 /*yield*/, clientScriptResource.setValue.submit(scriptDoc)];
                                case 4:
                                    // If script already exists, update it
                                    _e.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    console.error("Error inserting client script:", error_3);
                                    _e.label = 6;
                                case 6: return [3 /*break*/, 7];
                                case 7:
                                    clientScript = (_c = clipboardData.pageDoc.client_scripts) === null || _c === void 0 ? void 0 : _c.find(function (s) { return s.builder_script === script.name; });
                                    if (clientScript) {
                                        clientScript.builder_script = newScriptId;
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = clipboardData.pageScripts || [];
                    _d.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    script = _a[_i];
                    return [5 /*yield**/, _loop_3(script)];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateBlockComponentReferences(block, componentIdMap) {
    var _a;
    if (!componentIdMap.size)
        return;
    if (block.extendedFromComponent && componentIdMap.has(block.extendedFromComponent)) {
        block.extendedFromComponent = componentIdMap.get(block.extendedFromComponent);
    }
    if (block.isChildOfComponent && componentIdMap.has(block.isChildOfComponent)) {
        block.isChildOfComponent = componentIdMap.get(block.isChildOfComponent);
    }
    (_a = block.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) { return updateBlockComponentReferences(child, componentIdMap); });
}
function updateURLsInBlock(block, currentSiteURL) {
    // Update image and video sources to absolute URLs
    if (block.isImage() || block.isVideo()) {
        var src = block.getAttribute("src");
        if (src && typeof src === "string" && src.startsWith("/")) {
            block.setAttribute("src", "".concat(currentSiteURL).concat(src));
        }
        if (block.isImage()) {
            var darkSrc = block.getAttribute("darkSrc");
            if (darkSrc && typeof darkSrc === "string" && darkSrc.startsWith("/")) {
                block.setAttribute("darkSrc", "".concat(currentSiteURL).concat(darkSrc));
            }
        }
    }
    // Update background image URLs
    if (block) {
        var bgSrc = block.getStyle("backgroundImage");
        if (bgSrc && typeof bgSrc === "string" && bgSrc.startsWith("url(")) {
            var urlMatch = bgSrc.match(/url\(["']?([^"']+)["']?\)/);
            if (urlMatch && urlMatch[1] && urlMatch[1].startsWith("/")) {
                block.setStyle("backgroundImage", "url(".concat(currentSiteURL).concat(urlMatch[1], ")"));
            }
        }
    }
    // Update href attributes for links
    // if (block.isLink()) {
    // 	const href = block.getAttribute("href");
    // 	if (href && typeof href === "string" && !href.startsWith("http") && !href.startsWith("#")) {
    // 		block.setAttribute("href", `${currentSiteURL}${href}`);
    // 	}
    // }
    // Recursively process children
    block.children.forEach(function (child) { return updateURLsInBlock(child, currentSiteURL); });
}
function generateHash(initialId, siteURL, appendHash) {
    if (appendHash === void 0) { appendHash = false; }
    if (!appendHash) {
        // Original behavior: Generate a deterministic hash with the same length as initialId
        var str = "".concat(initialId, "_").concat(siteURL);
        var hash = 5381;
        for (var i = 0; i < str.length; i++) {
            hash = (hash << 5) + hash + str.charCodeAt(i); // djb2 hash
        }
        var hashStr = Math.abs(hash).toString(36);
        var targetLength = initialId.length;
        return hashStr.repeat(Math.ceil(targetLength / hashStr.length)).slice(0, targetLength);
    }
    else {
        // New behavior: Retain initialId and append a short hash
        var str = "".concat(initialId, "_").concat(siteURL);
        var hash = 5381;
        for (var i = 0; i < str.length; i++) {
            hash = (hash << 5) + hash + str.charCodeAt(i);
        }
        var shortHash = Math.abs(hash).toString(36).slice(0, 8);
        return "".concat(initialId, "_").concat(shortHash);
    }
}
//# sourceMappingURL=builderBlockCopyPaste.js.map