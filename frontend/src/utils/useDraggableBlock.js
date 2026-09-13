"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDraggableBlock = useDraggableBlock;
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var core_1 = require("@vueuse/core");
var helpers_1 = require("./helpers");
var canvasStore = (0, canvasStore_1.default)();
function useDraggableBlock(block, target, options) {
    var ghostElement = null;
    var handleDragStart = function (e) {
        var _a;
        (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("draggingBlockId", block.blockId);
        ghostElement = target.cloneNode(true);
        ghostElement.id = "ghost";
        ghostElement.style.position = "fixed";
        ghostElement.style.transform = "scale(".concat(options.ghostScale || 1, ")");
        ghostElement.style.pointerEvents = "none";
        ghostElement.style.zIndex = "999999";
        document.body.appendChild(ghostElement);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            var blankImage = new Image();
            blankImage.src =
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1' height='1'></svg>";
            e.dataTransfer.setDragImage(blankImage, e.offsetX, e.offsetY);
        }
        e.stopPropagation();
    };
    var handleDrag = function (e) {
        var target = e.target;
        ghostElement = ghostElement;
        ghostElement.style.left = e.clientX - target.offsetWidth / 2 + "px";
        ghostElement.style.top = e.clientY - target.offsetHeight / 2 + "px";
        e.stopPropagation();
    };
    var handleDrop = function (e) {
        var _a, _b, _c, _d, _e;
        var pauseId = (_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.pause();
        // move block to new container
        if (e.dataTransfer) {
            var draggingBlockId = e.dataTransfer.getData("draggingBlockId");
            var draggingBlock = (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.findBlock(draggingBlockId);
            var nearestElementIndex = (0, helpers_1.findNearestSiblingIndex)(e);
            if (draggingBlock) {
                var newParent = block;
                var oldParent = draggingBlock.getParentBlock();
                if (newParent.blockId === oldParent.blockId) {
                    newParent.moveChild(draggingBlock, nearestElementIndex);
                }
                else if (newParent.canHaveChildren() && newParent.isContainer()) {
                    if (oldParent) {
                        oldParent.removeChild(draggingBlock);
                    }
                    newParent.addChild(draggingBlock, nearestElementIndex);
                    canvasStore.selectBlock(draggingBlock, e);
                }
                e.stopPropagation();
            }
        }
        pauseId && ((_e = (_d = canvasStore.activeCanvas) === null || _d === void 0 ? void 0 : _d.history) === null || _e === void 0 ? void 0 : _e.resume(pauseId, true));
    };
    var handleDragEnd = function (e) {
        if (ghostElement) {
            ghostElement.remove();
        }
        if (e.dataTransfer && e.dataTransfer.getData("draggingBlockId")) {
            e.dataTransfer.dropEffect = "none";
            e.stopPropagation();
        }
    };
    var handleDragEnter = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    var handleDragOver = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    var handleDragLeave = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    (0, core_1.useEventListener)(target, "dragstart", handleDragStart);
    (0, core_1.useEventListener)(target, "drag", handleDrag);
    (0, core_1.useEventListener)(target, "drop", handleDrop);
    (0, core_1.useEventListener)(target, "dragend", handleDragEnd);
    (0, core_1.useEventListener)(target, "dragenter", handleDragEnter);
    (0, core_1.useEventListener)(target, "dragover", handleDragOver);
    (0, core_1.useEventListener)(target, "dragleave", handleDragLeave);
}
//# sourceMappingURL=useDraggableBlock.js.map