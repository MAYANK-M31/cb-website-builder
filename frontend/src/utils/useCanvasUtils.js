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
exports.useCanvasUtils = useCanvasUtils;
var tree_1 = require("@/utils/block/tree");
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var helpers_1 = require("@/utils/helpers");
var useCanvasHistory_1 = require("@/utils/useCanvasHistory");
var core_1 = require("@vueuse/core");
var vue_1 = require("vue");
var frappe_ui_1 = require("frappe-ui");
var canvasStore = (0, canvasStore_1.default)();
function useCanvasUtils(canvasProps, canvasContainer, canvas, rootBlock, selectedBlockIds, canvasHistory) {
    var _this = this;
    var isDirty = (0, vue_1.ref)(false);
    var containerBound = (0, vue_1.reactive)((0, core_1.useElementBounding)(canvasContainer));
    var canvasBound = (0, vue_1.reactive)((0, core_1.useElementBounding)(canvas));
    function scrollIntoView(blockToFocus, canvasProps, canvasContainer, canvas) {
        return __awaiter(this, void 0, void 0, function () {
            var container, containerRect, selectedBlock, blockRect, padding, paddingBottom, blockWidth, containerBound, blockHeight, scaleX, scaleY, newScale, scaleDiff, diffTop, diffBottom, diffLeft, diffRight;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // wait for editor to render
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 1:
                        // wait for editor to render
                        _b.sent();
                        if (!selectedBlockIds.value.has(blockToFocus.blockId)) {
                            selectBlock(blockToFocus);
                        }
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 2:
                        _b.sent();
                        // single nextTick is not enough, adding this to ensure the DOM is updated after selection
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 3:
                        // single nextTick is not enough, adding this to ensure the DOM is updated after selection
                        _b.sent();
                        if (!canvasContainer.value ||
                            !canvas.value ||
                            blockToFocus.isRoot() ||
                            !blockToFocus.isVisible() ||
                            ((_a = blockToFocus.getParentBlock()) === null || _a === void 0 ? void 0 : _a.isSVG())) {
                            return [2 /*return*/];
                        }
                        container = canvasContainer.value;
                        containerRect = container.getBoundingClientRect();
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 4:
                        _b.sent();
                        selectedBlock = canvasContainer.value.querySelector(".editor[data-block-id=\"".concat(blockToFocus.blockId, "\"][selected=true]"));
                        if (!selectedBlock) {
                            return [2 /*return*/];
                        }
                        blockRect = (0, vue_1.reactive)((0, core_1.useElementBounding)(selectedBlock));
                        // check if block is in view
                        if (blockRect.top >= containerRect.top &&
                            blockRect.bottom <= containerRect.bottom &&
                            blockRect.left >= containerRect.left &&
                            blockRect.right <= containerRect.right) {
                            return [2 /*return*/];
                        }
                        padding = 80;
                        paddingBottom = 200;
                        blockWidth = blockRect.width + padding * 2;
                        containerBound = container.getBoundingClientRect();
                        blockHeight = blockRect.height + padding + paddingBottom;
                        scaleX = containerBound.width / blockWidth;
                        scaleY = containerBound.height / blockHeight;
                        newScale = Math.min(scaleX, scaleY);
                        scaleDiff = canvasProps.scale - canvasProps.scale * newScale;
                        if (scaleDiff > 0.2) {
                            return [2 /*return*/];
                        }
                        if (!(newScale < 1)) return [3 /*break*/, 7];
                        canvasProps.scale = canvasProps.scale * newScale;
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, (0, vue_1.nextTick)()];
                    case 6:
                        _b.sent();
                        blockRect.update();
                        _b.label = 7;
                    case 7:
                        padding = padding * canvasProps.scale;
                        paddingBottom = paddingBottom * canvasProps.scale;
                        diffTop = containerRect.top - blockRect.top + padding;
                        diffBottom = blockRect.bottom - containerRect.bottom + paddingBottom;
                        diffLeft = containerRect.left - blockRect.left + padding;
                        diffRight = blockRect.right - containerRect.right + padding;
                        if (diffTop > 0) {
                            canvasProps.translateY += diffTop / canvasProps.scale;
                        }
                        else if (diffBottom > 0) {
                            canvasProps.translateY -= diffBottom / canvasProps.scale;
                        }
                        if (diffLeft > 0) {
                            canvasProps.translateX += diffLeft / canvasProps.scale;
                        }
                        else if (diffRight > 0) {
                            canvasProps.translateX -= diffRight / canvasProps.scale;
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function setupHistory() {
        canvasHistory.value = (0, useCanvasHistory_1.useCanvasHistory)(rootBlock, selectedBlockIds);
    }
    var resetZoom = function () {
        canvasProps.scale = 1;
        canvasProps.translateX = 0;
        canvasProps.translateY = 0;
    };
    var clearCanvas = function () {
        rootBlock.value = (0, helpers_1.getRootBlockTemplate)();
    };
    var moveCanvas = function (direction) {
        if (direction === "up") {
            canvasProps.translateY -= 20;
        }
        else if (direction === "down") {
            canvasProps.translateY += 20;
        }
        else if (direction === "right") {
            canvasProps.translateX += 20;
        }
        else if (direction === "left") {
            canvasProps.translateX -= 20;
        }
    };
    var zoomIn = function () {
        canvasProps.scale = Math.min(canvasProps.scale + 0.1, 10);
    };
    var zoomOut = function () {
        canvasProps.scale = Math.max(canvasProps.scale - 0.1, 0.1);
    };
    function toggleMode(mode) {
        if (!canvasContainer.value)
            return;
        var container = canvasContainer.value;
        if (mode === "text") {
            container.style.cursor = "text";
        }
        else if (["container", "image", "repeater"].includes(mode)) {
            container.style.cursor = "crosshair";
        }
        else if (mode === "move") {
            container.style.cursor = "grab";
        }
        else {
            container.style.cursor = "default";
        }
    }
    function setRootBlock(newBlock, resetCanvas, resetHistory) {
        var _a;
        if (resetCanvas === void 0) { resetCanvas = false; }
        if (resetHistory === void 0) { resetHistory = true; }
        if (!resetHistory && ((_a = canvasHistory.value) === null || _a === void 0 ? void 0 : _a.silentSetSource)) {
            // swap the root without recording it or disposing the stack (version preview)
            canvasHistory.value.silentSetSource(newBlock);
        }
        else {
            rootBlock.value = newBlock;
        }
        if (canvasHistory.value && resetHistory) {
            canvasHistory.value.dispose();
            setupHistory();
        }
        if (resetCanvas) {
            (0, vue_1.nextTick)(function () {
                setScaleAndTranslate();
                toggleDirty(false);
            });
        }
    }
    var setScaleAndTranslate = function () { return __awaiter(_this, void 0, void 0, function () {
        var paddingX, paddingY, containerWidth, canvasWidth, scale, diffY;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(document.readyState !== "complete")) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) {
                            window.addEventListener("load", resolve);
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    paddingX = 300;
                    paddingY = 300;
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 3:
                    _a.sent();
                    canvasBound.update();
                    containerWidth = containerBound.width;
                    canvasWidth = canvasBound.width / canvasProps.scale;
                    canvasProps.scale = containerWidth / (canvasWidth + paddingX * 2);
                    canvasProps.translateX = 0;
                    canvasProps.translateY = 0;
                    return [4 /*yield*/, (0, vue_1.nextTick)()];
                case 4:
                    _a.sent();
                    scale = canvasProps.scale;
                    canvasBound.update();
                    diffY = containerBound.top - canvasBound.top + paddingY * scale;
                    if (diffY !== 0) {
                        canvasProps.translateY = diffY / scale;
                    }
                    canvasProps.settingCanvas = false;
                    return [2 /*return*/];
            }
        });
    }); };
    function selectBlock(_block, multiSelect) {
        if (multiSelect === void 0) { multiSelect = false; }
        if (multiSelect) {
            selectedBlockIds.value.add(_block.blockId);
        }
        else {
            selectedBlockIds.value = new Set([_block.blockId]);
        }
    }
    var toggleDirty = function (dirty) {
        if (dirty === void 0) { dirty = null; }
        if (dirty === null) {
            isDirty.value = !isDirty.value;
        }
        else {
            isDirty.value = dirty;
        }
    };
    function getRootBlock() {
        return rootBlock.value;
    }
    function findBlock(blockId, blocks) {
        return (0, tree_1.findBlockInTree)(blockId, blocks !== null && blocks !== void 0 ? blocks : [getRootBlock()]);
    }
    function removeBlock(block, force) {
        var _a;
        if (force === void 0) { force = false; }
        if (block.blockId === "root") {
            frappe_ui_1.toast.warning("Warning", {
                description: "Cannot delete root block",
            });
            return;
        }
        if (block.isChildOfComponentBlock()) {
            block.toggleVisibility(false);
            return;
        }
        var parentBlock = block.parentBlock;
        if (!parentBlock) {
            return;
        }
        var nextSibling = block.getSiblingBlock("next");
        if (((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.activeBreakpoint) === "desktop" || force) {
            parentBlock.removeChild(block);
        }
        else {
            block.toggleVisibility(false);
        }
        (0, vue_1.nextTick)(function () {
            if (parentBlock.children.length) {
                if (nextSibling) {
                    selectBlock(nextSibling);
                }
            }
        });
    }
    function scrollBlockIntoView(blockToFocus) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, scrollIntoView(blockToFocus, canvasProps, canvasContainer, canvas)];
            });
        });
    }
    return {
        moveCanvas: moveCanvas,
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        toggleMode: toggleMode,
        setRootBlock: setRootBlock,
        selectBlock: selectBlock,
        toggleDirty: toggleDirty,
        findBlock: findBlock,
        removeBlock: removeBlock,
        scrollBlockIntoView: scrollBlockIntoView,
        setScaleAndTranslate: setScaleAndTranslate,
        resetZoom: resetZoom,
        clearCanvas: clearCanvas,
        getRootBlock: getRootBlock,
        setupHistory: setupHistory,
        isDirty: isDirty,
    };
}
//# sourceMappingURL=useCanvasUtils.js.map