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
exports.useBuilderEvents = useBuilderEvents;
var webComponent_1 = __importDefault(require("@/data/webComponent"));
var webPage_1 = require("@/data/webPage");
var builderStore_1 = __importDefault(require("@/stores/builderStore"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var pageStore_1 = __importDefault(require("@/stores/pageStore"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var blockTemplate_1 = __importDefault(require("@/utils/blockTemplate"));
var builderBlockCopyPaste_1 = require("@/utils/builderBlockCopyPaste");
var helpers_1 = require("@/utils/helpers");
var core_1 = require("@vueuse/core");
var frappe_ui_1 = require("frappe-ui");
var builderStore = (0, builderStore_1.default)();
var canvasStore = (0, canvasStore_1.default)();
var pageStore = (0, pageStore_1.default)();
function useBuilderEvents(pageCanvas, fragmentCanvas, saveAndExitFragmentMode, route, router) {
    var _this = this;
    // to disable page zoom
    (0, core_1.useEventListener)(document, "wheel", function (event) {
        var ctrlKey = event.ctrlKey;
        if (ctrlKey) {
            event.preventDefault();
            return;
        }
    }, { passive: false });
    (0, core_1.useEventListener)(document, "copy", function (e) {
        var _a;
        if ((0, helpers_1.isTargetEditable)(e) || canvasStore.editableBlock)
            return;
        if ((0, helpers_1.isDialogOpen)() && canvasStore.requiresConfirmationForCopyingEntirePage)
            return;
        if ((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString())
            return;
        copySelectedBlocksToClipboard(e);
    });
    (0, core_1.useEventListener)(document, "cut", function (e) {
        var _a, _b, _c;
        if ((0, helpers_1.isTargetEditable)(e) || canvasStore.editableBlock)
            return;
        if (builderStore.readOnlyMode)
            return;
        copySelectedBlocksToClipboard(e);
        if ((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.length) {
            for (var _i = 0, _d = (_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.selectedBlocks; _i < _d.length; _i++) {
                var block = _d[_i];
                (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.removeBlock(block, true);
            }
            clearSelection();
        }
    });
    (0, core_1.useEventListener)(document, "paste", function (e) { return __awaiter(_this, void 0, void 0, function () {
        var clipboardItems, file, text, block, dom, svg, width, height, selectedBlocks, parentBlock, strippedText, styleObj, block;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if ((0, helpers_1.isTargetEditable)(e))
                        return [2 /*return*/];
                    if (builderStore.readOnlyMode)
                        return [2 /*return*/];
                    e.stopPropagation();
                    clipboardItems = Array.from(((_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.items) || []);
                    // paste image from clipboard
                    if (clipboardItems.some(function (item) { return item.type.includes("image"); })) {
                        e.preventDefault();
                        file = (_b = clipboardItems.find(function (item) { return item.type.includes("image"); })) === null || _b === void 0 ? void 0 : _b.getAsFile();
                        if (file) {
                            (0, helpers_1.uploadBuilderAsset)(file).then(function (res) {
                                var _a;
                                var selectedBlocks = blockController_1.default.getSelectedBlocks();
                                var parentBlock = selectedBlocks.length
                                    ? selectedBlocks[0]
                                    : (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.getRootBlock();
                                var imageBlock = null;
                                if (parentBlock.isImage()) {
                                    imageBlock = parentBlock;
                                    imageBlock.setAttribute("src", res.fileURL);
                                }
                                else {
                                    while (parentBlock && !parentBlock.canHaveChildren()) {
                                        parentBlock = parentBlock.getParentBlock();
                                    }
                                    if (parentBlock) {
                                        imageBlock = parentBlock.addChild((0, helpers_1.getBlockCopy)((0, blockTemplate_1.default)("image")));
                                        imageBlock.setAttribute("src", res.fileURL);
                                    }
                                }
                            });
                        }
                        return [2 /*return*/];
                    }
                    text = ((_c = e.clipboardData) === null || _c === void 0 ? void 0 : _c.getData("text/plain")) || "";
                    return [4 /*yield*/, (0, builderBlockCopyPaste_1.pasteBuilderBlocks)(e, window.location.origin)];
                case 1:
                    _d.sent();
                    if (!text) {
                        return [2 /*return*/];
                    }
                    if ((0, helpers_1.isHTMLString)(text)) {
                        e.preventDefault();
                        // paste html
                        if (blockController_1.default.isHTML()) {
                            blockController_1.default.setInnerHTML(text);
                        }
                        else {
                            block = null;
                            block = (0, blockTemplate_1.default)("html");
                            if (text.startsWith("<svg")) {
                                if (text.includes("<image")) {
                                    frappe_ui_1.toast.warning("Warning", {
                                        description: "SVG with inlined image in it is not supported. Please paste it as PNG instead.",
                                    });
                                    return [2 /*return*/];
                                }
                                dom = new DOMParser().parseFromString(text, "text/html");
                                svg = dom.body.querySelector("svg");
                                width = svg.getAttribute("width") || "100";
                                height = svg.getAttribute("height") || "100";
                                if (width && block.baseStyles) {
                                    block.baseStyles.width = (0, helpers_1.addPxToNumber)(parseInt(width));
                                    svg.removeAttribute("width");
                                }
                                if (height && block.baseStyles) {
                                    block.baseStyles.height = (0, helpers_1.addPxToNumber)(parseInt(height));
                                    svg.removeAttribute("height");
                                }
                                text = svg.outerHTML;
                            }
                            block.innerHTML = text;
                            selectedBlocks = blockController_1.default.getSelectedBlocks();
                            parentBlock = selectedBlocks.length ? selectedBlocks[0] : null;
                            while (parentBlock && !parentBlock.canHaveChildren()) {
                                parentBlock = parentBlock.getParentBlock();
                            }
                            if (parentBlock) {
                                parentBlock.addChild(block);
                            }
                            else {
                                canvasStore.pushBlocks([block], false);
                            }
                        }
                        return [2 /*return*/];
                    }
                    // try pasting figma text styles
                    if (text.includes(":") && !canvasStore.editableBlock) {
                        e.preventDefault();
                        strippedText = text.replace(/\/\*.*?\*\//g, "").replace(/\n/g, "");
                        styleObj = strippedText.split(";").reduce(function (acc, curr) {
                            var _a = curr.split(":").map(function (item) { return (item ? item.trim() : ""); }), key = _a[0], value = _a[1];
                            if (blockController_1.default.isText() && !blockController_1.default.isLink()) {
                                if ([
                                    "font-family",
                                    "font-size",
                                    "font-weight",
                                    "line-height",
                                    "letter-spacing",
                                    "text-align",
                                    "text-transform",
                                    "color",
                                ].includes(key)) {
                                    if (key === "font-family") {
                                        acc[key] = (value + "").replace(/['"]+/g, "");
                                        if (String(value).toLowerCase().includes("inter")) {
                                            acc["font-family"] = "";
                                        }
                                    }
                                    else {
                                        acc[key] = value;
                                    }
                                }
                            }
                            else if (["width", "height", "box-shadow", "background", "border-radius"].includes(key)) {
                                acc[key] = value;
                            }
                            return acc;
                        }, {});
                        Object.entries(styleObj).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            blockController_1.default.setStyle(key, value);
                        });
                        return [2 /*return*/];
                    }
                    // if selected block is container, create a new text block inside it and set the text
                    if (blockController_1.default.canHaveChildren() && blockController_1.default.isContainer()) {
                        e.preventDefault();
                        block = (0, blockTemplate_1.default)("text");
                        block.innerHTML = text;
                        blockController_1.default.getSelectedBlocks()[0].addChild(block);
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, frappe_ui_1.useShortcut)([
        {
            key: "\\",
            ctrl: true,
            description: "Toggle panels",
            group: "View",
            handler: function (e) {
                builderStore.showRightPanel = !builderStore.showRightPanel;
                builderStore.showLeftPanel = builderStore.showRightPanel;
            },
        },
        {
            key: "\\",
            ctrl: true,
            shift: true,
            description: "Toggle left panel",
            group: "View",
            handler: function () {
                builderStore.showLeftPanel = !builderStore.showLeftPanel;
            },
        },
        {
            key: "d",
            ctrl: true,
            shift: true,
            description: "Toggle canvas dark mode",
            group: "View",
            handler: function () {
                builderStore.canvasDarkMode = !builderStore.canvasDarkMode;
            },
        },
        {
            key: "s",
            ctrl: true,
            description: "Save page / component",
            group: "General",
            allowInInput: true,
            handler: function (e) {
                if (canvasStore.editingMode === "fragment") {
                    saveAndExitFragmentMode(e);
                    e.stopPropagation();
                }
            },
        },
        {
            key: "p",
            ctrl: true,
            description: "Preview",
            group: "General",
            handler: function () {
                pageStore.savePage();
                router.push({
                    name: "preview",
                    params: {
                        pageId: pageStore.selectedPage,
                    },
                });
            },
        },
        {
            key: "f",
            ctrl: true,
            shift: true,
            description: "Search blocks",
            group: "General",
            handler: function () {
                builderStore.showSearchBlock = true;
            },
        },
        {
            key: "f",
            ctrl: true,
            description: "Focus property search",
            group: "General",
            allowInInput: true,
            handler: function () {
                var _a, _b;
                (_b = (_a = document.querySelector(".properties-search-input")) === null || _a === void 0 ? void 0 : _a.querySelector("input")) === null || _b === void 0 ? void 0 : _b.focus();
            },
        },
        {
            key: "c",
            ctrl: true,
            shift: true,
            description: "Copy block styles",
            group: "Edit",
            handler: function () {
                if (blockController_1.default.isBlockSelected() && !blockController_1.default.multipleBlocksSelected()) {
                    var block = blockController_1.default.getSelectedBlocks()[0];
                    var copiedStyle = (0, core_1.useStorage)("copiedStyle", { blockId: "", style: {} }, sessionStorage);
                    copiedStyle.value = {
                        blockId: block.blockId,
                        style: block.getStylesCopy(),
                    };
                }
            },
        },
        {
            key: "d",
            ctrl: true,
            description: "Duplicate block",
            group: "Edit",
            handler: function () {
                if (builderStore.readOnlyMode)
                    return;
                if (blockController_1.default.isBlockSelected() && !blockController_1.default.multipleBlocksSelected()) {
                    var block = blockController_1.default.getSelectedBlocks()[0];
                    block.duplicateBlock();
                }
            },
        },
        {
            key: "Backspace",
            description: "Delete selected blocks",
            group: "Edit",
            handler: function (e) {
                var _a;
                if (builderStore.readOnlyMode)
                    return;
                if (!blockController_1.default.isBlockSelected())
                    return;
                for (var _i = 0, _b = blockController_1.default.getSelectedBlocks(); _i < _b.length; _i++) {
                    var block = _b[_i];
                    (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.removeBlock(block, e.shiftKey);
                }
                clearSelection();
                e.stopPropagation();
            },
        },
        {
            key: "Delete",
            description: "Delete selected blocks",
            group: "Edit",
            handler: function (e) {
                var _a;
                if (builderStore.readOnlyMode)
                    return;
                if (!blockController_1.default.isBlockSelected())
                    return;
                for (var _i = 0, _b = blockController_1.default.getSelectedBlocks(); _i < _b.length; _i++) {
                    var block = _b[_i];
                    (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.removeBlock(block, e.shiftKey);
                }
                clearSelection();
                e.stopPropagation();
            },
        },
        {
            key: "Escape",
            description: "Exit current mode",
            group: "General",
            condition: function () { return canvasStore.editingMode !== "page"; },
            handler: function (e) {
                canvasStore.exitFragmentMode(e);
            },
            preventDefault: false,
        },
        {
            key: "z",
            ctrl: true,
            description: "Undo",
            group: "Edit",
            handler: function () {
                var _a, _b, _c;
                if ((_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.canUndo) {
                    (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.history.undo();
                }
            },
        },
        {
            key: "z",
            ctrl: true,
            shift: true,
            description: "Redo",
            group: "Edit",
            handler: function () {
                var _a, _b, _c;
                if ((_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.canRedo) {
                    (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.history.redo();
                }
            },
        },
        {
            key: "0",
            ctrl: true,
            description: "Reset canvas zoom",
            group: "Canvas",
            handler: function () {
                var _a, _b;
                if (pageCanvas.value) {
                    (_b = (_a = pageCanvas.value).setCanvasZoom) === null || _b === void 0 ? void 0 : _b.call(_a, 1, "center");
                }
            },
        },
        {
            key: "0",
            ctrl: true,
            shift: true,
            description: "Fit canvas to screen",
            group: "Canvas",
            handler: function () {
                if (pageCanvas.value) {
                    pageCanvas.value.setScaleAndTranslate();
                }
            },
        },
        {
            key: "ArrowRight",
            description: "Pan canvas right",
            group: "Canvas",
            handler: function () {
                if (pageCanvas.value) {
                    pageCanvas.value.moveCanvas("right");
                }
            },
            condition: function () { return !blockController_1.default.isBlockSelected(); },
        },
        {
            key: "ArrowLeft",
            description: "Pan canvas left",
            group: "Canvas",
            handler: function () {
                if (pageCanvas.value) {
                    pageCanvas.value.moveCanvas("left");
                }
            },
            condition: function () { return !blockController_1.default.isBlockSelected(); },
        },
        {
            key: "ArrowUp",
            description: "Pan canvas up",
            group: "Canvas",
            handler: function () {
                if (pageCanvas.value) {
                    pageCanvas.value.moveCanvas("up");
                }
            },
            condition: function () { return !blockController_1.default.isBlockSelected(); },
        },
        {
            key: "ArrowDown",
            description: "Pan canvas down",
            group: "Canvas",
            handler: function () {
                if (pageCanvas.value) {
                    pageCanvas.value.moveCanvas("down");
                }
            },
            condition: function () { return !blockController_1.default.isBlockSelected(); },
        },
        {
            key: "=",
            ctrl: true,
            description: "Zoom in",
            group: "Canvas",
            handler: function () {
                if (pageCanvas.value) {
                    pageCanvas.value.zoomIn();
                }
            },
        },
        {
            key: "-",
            ctrl: true,
            description: "Zoom out",
            group: "Canvas",
            handler: function () {
                if (pageCanvas.value) {
                    pageCanvas.value.zoomOut();
                }
            },
        },
        {
            key: "c",
            description: "Container mode",
            group: "Tools",
            handler: function () {
                if (builderStore.readOnlyMode)
                    return;
                builderStore.mode = "container";
            },
        },
        {
            key: "i",
            description: "Image mode",
            group: "Tools",
            handler: function () {
                if (builderStore.readOnlyMode)
                    return;
                builderStore.mode = "image";
            },
        },
        {
            key: "t",
            description: "Text mode",
            group: "Tools",
            handler: function () {
                if (builderStore.readOnlyMode)
                    return;
                builderStore.mode = "text";
            },
        },
        {
            key: "v",
            description: "Select mode",
            group: "Tools",
            handler: function () {
                builderStore.mode = "select";
            },
        },
        {
            key: "h",
            description: "Move / hand mode",
            group: "Tools",
            handler: function () {
                builderStore.mode = "move";
            },
        },
        {
            key: "l",
            ctrl: true,
            shift: true,
            triggeredOn: "hold",
            description: "Highlight Blocks with Client Scripts",
            group: "View",
            onHold: function () {
                builderStore.highlightBlocksWithClientScripts = true;
            },
            onRelease: function () {
                builderStore.highlightBlocksWithClientScripts = false;
            },
        },
    ]);
    // on tab activation, reload for latest data
    (0, core_1.useEventListener)(document, "visibilitychange", function () {
        var _a, _b;
        if (document.visibilityState === "visible" && !fragmentCanvas.value) {
            if (route.params.pageId && route.params.pageId !== "new") {
                var currentModified_1 = (_a = pageStore.activePage) === null || _a === void 0 ? void 0 : _a.modified;
                webComponent_1.default.reload();
                webPage_1.webPages.fetchOne.submit((_b = pageStore.activePage) === null || _b === void 0 ? void 0 : _b.name).then(function (doc) {
                    var _a;
                    if (currentModified_1 !== ((_a = doc === null || doc === void 0 ? void 0 : doc[0]) === null || _a === void 0 ? void 0 : _a.modified)) {
                        pageStore.setPage(route.params.pageId, false, route.query);
                    }
                });
            }
        }
    });
    // context menu
    (0, core_1.useEventListener)(document, "contextmenu", function (e) { return __awaiter(_this, void 0, void 0, function () {
        var target, blockId, block;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            if ((0, helpers_1.isTargetEditable)(e))
                return [2 /*return*/];
            target = ((_a = e.target) === null || _a === void 0 ? void 0 : _a.closest("[data-block-layer-id]")) ||
                ((_b = e.target) === null || _b === void 0 ? void 0 : _b.closest("[data-block-id]"));
            if (target) {
                blockId = target.dataset.blockLayerId || target.dataset.blockId;
                block = (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.findBlock(blockId);
                if (block) {
                    (_d = canvasStore.activeCanvas) === null || _d === void 0 ? void 0 : _d.selectBlock(block, blockController_1.default.multipleBlocksSelected());
                    (_e = builderStore.blockContextMenu) === null || _e === void 0 ? void 0 : _e.showContextMenu(e, block);
                }
            }
            return [2 /*return*/];
        });
    }); });
}
var clearSelection = function () {
    blockController_1.default.clearSelection();
    canvasStore.editableBlock = null;
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
};
var copySelectedBlocksToClipboard = function (e) {
    var _a;
    if ((0, helpers_1.isTargetEditable)(e))
        return;
    if (((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.length) === 1 &&
        canvasStore.activeCanvas.selectedBlocks[0].isRoot() &&
        canvasStore.requiresConfirmationForCopyingEntirePage) {
        // Handle dialog first and wait for response
        (0, helpers_1.showDialog)({
            title: "Copy entire page?",
            message: "Do you want to copy the entire page including settings and scripts?",
            actions: [
                {
                    label: "No, just blocks",
                    variant: "subtle",
                    onClick: function () {
                        canvasStore.requiresConfirmationForCopyingEntirePage = false;
                        canvasStore.copyEntirePage = false;
                        (0, helpers_1.triggerCopyEvent)();
                    },
                },
                {
                    label: "Yes",
                    variant: "solid",
                    onClick: function () {
                        canvasStore.requiresConfirmationForCopyingEntirePage = false;
                        canvasStore.copyEntirePage = true;
                        (0, helpers_1.triggerCopyEvent)();
                    },
                },
            ],
            size: "md",
        });
    }
    else {
        (0, builderBlockCopyPaste_1.copyBuilderBlocks)(e, window.location.origin, canvasStore.copyEntirePage);
        canvasStore.requiresConfirmationForCopyingEntirePage = true;
        canvasStore.copyEntirePage = false;
    }
};
//# sourceMappingURL=useBuilderEvents.js.map