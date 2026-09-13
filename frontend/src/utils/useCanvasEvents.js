"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCanvasEvents = useCanvasEvents;
var builderStore_1 = __importDefault(require("@/stores/builderStore"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var blockTemplate_1 = __importDefault(require("@/utils/blockTemplate"));
var helpers_1 = require("@/utils/helpers");
var core_1 = require("@vueuse/core");
var builderStore = (0, builderStore_1.default)();
var canvasStore = (0, canvasStore_1.default)();
function useCanvasEvents(container, canvasProps, canvasHistory, selectedBlocks, getRootBlock, findBlock) {
    var counter = 0;
    (0, core_1.useEventListener)(container, "mousedown", function (ev) {
        var _a;
        if (builderStore.mode === "move") {
            return;
        }
        var initialX = ev.clientX;
        var initialY = ev.clientY;
        if (builderStore.mode === "select") {
            return;
        }
        else {
            if (builderStore.readOnlyMode)
                return;
            var pauseId_1 = (_a = canvasHistory.value) === null || _a === void 0 ? void 0 : _a.pause();
            ev.stopPropagation();
            var element = document.elementFromPoint(ev.x, ev.y);
            var block = getRootBlock();
            if (element) {
                if (element.dataset.blockId) {
                    block = findBlock(element.dataset.blockId) || block;
                }
            }
            var parentBlock_1 = getRootBlock();
            if (element.dataset.blockId) {
                parentBlock_1 = findBlock(element.dataset.blockId) || parentBlock_1;
                while (parentBlock_1 && !parentBlock_1.canHaveChildren()) {
                    parentBlock_1 = parentBlock_1.getParentBlock() || getRootBlock();
                }
            }
            var child = (0, blockTemplate_1.default)(builderStore.mode);
            var parentElement = document.body.querySelector(".canvas [data-block-id=\"".concat(parentBlock_1.blockId, "\"]"));
            var parentOldPosition_1 = parentBlock_1.getStyle("position");
            if (parentOldPosition_1 === "static" || parentOldPosition_1 === "inherit" || !parentOldPosition_1) {
                parentBlock_1.setBaseStyle("position", "relative");
            }
            var parentElementBounds = parentElement.getBoundingClientRect();
            var x = (ev.x - parentElementBounds.left) / canvasProps.scale;
            var y = (ev.y - parentElementBounds.top) / canvasProps.scale;
            var parentWidth_1 = (0, helpers_1.getNumberFromPx)(getComputedStyle(parentElement).width);
            var parentHeight_1 = (0, helpers_1.getNumberFromPx)(getComputedStyle(parentElement).height);
            var childBlock_1 = parentBlock_1.addChild(child);
            childBlock_1.setBaseStyle("position", "absolute");
            childBlock_1.setBaseStyle("top", (0, helpers_1.addPxToNumber)(y));
            childBlock_1.setBaseStyle("left", (0, helpers_1.addPxToNumber)(x));
            if (builderStore.mode === "container" || builderStore.mode === "repeater") {
                var colors = ["#ededed", "#e2e2e2", "#c7c7c7"];
                childBlock_1.setBaseStyle("backgroundColor", colors[counter % colors.length]);
                counter++;
            }
            var mouseMoveHandler_1 = function (mouseMoveEvent) {
                if (builderStore.mode === "text") {
                    return;
                }
                else {
                    mouseMoveEvent.preventDefault();
                    var width = (mouseMoveEvent.clientX - initialX) / canvasProps.scale;
                    var height = (mouseMoveEvent.clientY - initialY) / canvasProps.scale;
                    width = (0, core_1.clamp)(width, 0, parentWidth_1);
                    height = (0, core_1.clamp)(height, 0, parentHeight_1);
                    var setFullWidth = width === parentWidth_1;
                    childBlock_1.setBaseStyle("width", setFullWidth ? "100%" : (0, helpers_1.addPxToNumber)(width));
                    childBlock_1.setBaseStyle("height", (0, helpers_1.addPxToNumber)(height));
                }
            };
            (0, core_1.useEventListener)(document, "mousemove", mouseMoveHandler_1);
            (0, core_1.useEventListener)(document, "mouseup", function () {
                var _a, _b;
                document.removeEventListener("mousemove", mouseMoveHandler_1);
                parentBlock_1.setBaseStyle("position", parentOldPosition_1 || "static");
                childBlock_1.setBaseStyle("position", "static");
                childBlock_1.setBaseStyle("top", "auto");
                childBlock_1.setBaseStyle("left", "auto");
                var wasImageMode = builderStore.mode === "image";
                setTimeout(function () {
                    builderStore.mode = "select";
                }, 50);
                if (builderStore.mode === "text") {
                    pauseId_1 && ((_a = canvasHistory.value) === null || _a === void 0 ? void 0 : _a.resume(pauseId_1, true));
                    canvasStore.editableBlock = childBlock_1;
                    return;
                }
                if (parentBlock_1.isGrid()) {
                    childBlock_1.setStyle("width", "auto");
                    childBlock_1.setStyle("height", "100%");
                }
                else {
                    if ((0, helpers_1.getNumberFromPx)(childBlock_1.getStyle("width")) < 100) {
                        childBlock_1.setBaseStyle("width", "100%");
                    }
                    if ((0, helpers_1.getNumberFromPx)(childBlock_1.getStyle("height")) < 100) {
                        childBlock_1.setBaseStyle("height", "200px");
                    }
                }
                pauseId_1 && ((_b = canvasHistory.value) === null || _b === void 0 ? void 0 : _b.resume(pauseId_1, true));
                if (wasImageMode) {
                    builderStore.openImageUpload = true;
                }
            }, { once: true });
        }
    });
    (0, core_1.useEventListener)(container, "mousedown", function (ev) {
        if (builderStore.mode === "move") {
            container.value.style.cursor = "grabbing";
            var initialX_1 = ev.clientX;
            var initialY_1 = ev.clientY;
            var initialTranslateX_1 = canvasProps.translateX;
            var initialTranslateY_1 = canvasProps.translateY;
            var mouseMoveHandler_2 = function (mouseMoveEvent) {
                mouseMoveEvent.preventDefault();
                var diffX = (mouseMoveEvent.clientX - initialX_1) / canvasProps.scale;
                var diffY = (mouseMoveEvent.clientY - initialY_1) / canvasProps.scale;
                canvasProps.translateX = initialTranslateX_1 + diffX;
                canvasProps.translateY = initialTranslateY_1 + diffY;
            };
            (0, core_1.useEventListener)(document, "mousemove", mouseMoveHandler_2);
            (0, core_1.useEventListener)(document, "mouseup", function () {
                document.removeEventListener("mousemove", mouseMoveHandler_2);
                container.value.style.cursor = "grab";
            }, { once: true });
            ev.stopPropagation();
            ev.preventDefault();
        }
    });
    (0, core_1.useEventListener)(document, "keydown", function (ev) {
        // make sure reference container is not hidden or not editable
        if (!container.value.offsetParent || (0, helpers_1.isTargetEditable)(ev) || selectedBlocks.value.length !== 1) {
            return;
        }
        var selectedBlock = selectedBlocks.value[0];
        var selectBlock = function (block) {
            // TODO: Use canvas's selectBlock instead of canvasStore's to avoid mixup with other canvas
            if (block)
                canvasStore.selectBlock(block, null, true, true);
            return !!block;
        };
        var selectSibling = function (direction, fallback) {
            selectBlock(selectedBlock.getSiblingBlock(direction)) || fallback();
        };
        var selectParent = function () { return selectBlock(selectedBlock.getParentBlock()); };
        var selectFirstChild = function () { return selectBlock(selectedBlock.children[0]); };
        var selectNextSiblingOrParent = function () {
            var sibling = selectedBlock.getSiblingBlock("next");
            var parentBlock = selectedBlock.getParentBlock();
            while (!sibling && parentBlock) {
                sibling = parentBlock.getSiblingBlock("next");
                parentBlock = parentBlock.getParentBlock();
            }
            selectBlock(sibling);
        };
        var selectLastChildInTree = function (block) {
            var _a;
            var currentBlock = block;
            while ((_a = builderStore.activeLayers) === null || _a === void 0 ? void 0 : _a.isExpandedInTree(currentBlock)) {
                var lastChild = currentBlock.getLastChild();
                if (!lastChild)
                    break;
                currentBlock = lastChild;
            }
            selectBlock(currentBlock);
        };
        var arrowKeyHandlers = {
            ArrowLeft: function () {
                var _a;
                ((_a = builderStore.activeLayers) === null || _a === void 0 ? void 0 : _a.isExpandedInTree(selectedBlock))
                    ? builderStore.activeLayers.toggleExpanded(selectedBlock)
                    : selectSibling("previous", selectParent);
            },
            ArrowRight: function () {
                var _a;
                selectedBlock.hasChildren() && selectedBlock.isVisible()
                    ? ((_a = builderStore.activeLayers) === null || _a === void 0 ? void 0 : _a.toggleExpanded(selectedBlock), selectFirstChild())
                    : selectNextSiblingOrParent();
            },
            ArrowUp: function () {
                var previousSibling = selectedBlock.getSiblingBlock("previous");
                previousSibling ? selectLastChildInTree(previousSibling) : selectParent();
            },
            ArrowDown: function () {
                var _a;
                ((_a = builderStore.activeLayers) === null || _a === void 0 ? void 0 : _a.isExpandedInTree(selectedBlock)) &&
                    selectedBlock.hasChildren() &&
                    selectedBlock.isVisible()
                    ? selectFirstChild()
                    : selectNextSiblingOrParent();
            },
        };
        var handler = arrowKeyHandlers[ev.key];
        if (handler) {
            handler();
            ev.preventDefault();
        }
    });
    (0, core_1.useEventListener)(container, "mouseover", handleMouseOver);
}
function handleMouseOver(e) {
    var _a, _b, _c, _d;
    if (canvasStore.isMarqueeActive)
        return;
    if (!(0, helpers_1.isBlock)(e)) {
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.setHoveredBlock(null);
        return;
    }
    if (builderStore.mode === "move" || ((_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.resizingBlock))
        return;
    var block = (0, helpers_1.getBlock)(e);
    var breakpoint = (0, helpers_1.getBlockInfo)(e).breakpoint;
    (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.setHoveredBlock((block === null || block === void 0 ? void 0 : block.blockId) || null);
    (_d = canvasStore.activeCanvas) === null || _d === void 0 ? void 0 : _d.setHoveredBreakpoint(breakpoint);
    e.stopPropagation();
}
//# sourceMappingURL=useCanvasEvents.js.map