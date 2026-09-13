"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBlockEventHandlers = useBlockEventHandlers;
var builderStore_1 = __importDefault(require("@/stores/builderStore"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var blockTemplate_1 = __importDefault(require("@/utils/blockTemplate"));
var helpers_1 = require("@/utils/helpers");
var useBlockReorder_1 = require("@/utils/useBlockReorder");
var core_1 = require("@vueuse/core");
var vue_1 = require("vue");
var builderStore = (0, builderStore_1.default)();
var canvasStore = (0, canvasStore_1.default)();
function useBlockEventHandlers(target) {
    (0, core_1.useEventListener)(target, "mousedown", handleMouseDown);
    (0, core_1.useEventListener)(target, "click", handleClick);
    (0, core_1.useEventListener)(target, "dblclick", handleDoubleClick);
    (0, core_1.useEventListener)(target, "contextmenu", triggerContextMenu);
    // Press-and-drag any block to reorder it in one gesture (no need to select
    // first). The threshold inside startBlockReorder means a plain click still
    // falls through to handleClick for selection.
    function handleMouseDown(e) {
        if (e.button !== 0)
            return;
        if (!(0, helpers_1.isBlock)(e) || isEditable(e))
            return;
        if (builderStore.mode !== "select" || builderStore.readOnlyMode)
            return;
        var block = (0, helpers_1.getBlock)(e);
        if (!block || !(0, useBlockReorder_1.isReorderable)(block))
            return;
        (0, useBlockReorder_1.startBlockReorder)(e, block, (0, helpers_1.getBlockInfo)(e).breakpoint);
    }
    function handleClick(e) {
        if (!(0, helpers_1.isBlock)(e) || isEditable(e))
            return;
        if (canvasStore.preventClick) {
            e.stopPropagation();
            e.preventDefault();
            canvasStore.preventClick = false;
            return;
        }
        selectBlock(e);
        e.stopPropagation();
        e.preventDefault();
    }
    function handleDoubleClick(e) {
        var _a;
        if (!(0, helpers_1.isBlock)(e) || isEditable(e))
            return;
        canvasStore.editableBlock = null;
        var block = (0, helpers_1.getBlock)(e);
        if (!block)
            return;
        if (block.isImage()) {
            (0, vue_1.nextTick)(function () {
                builderStore.openImageUpload = true;
            });
            e.stopPropagation();
            return;
        }
        if (block.isText() || block.isLink() || block.isButton()) {
            canvasStore.editableBlock = block;
            e.stopPropagation();
        }
        // dblclick on container adds text block or selects text block if only one child
        var children = block.getChildren();
        if (block.isHTML()) {
            (_a = document
                .querySelector(".editor[data-block-id=\"".concat(block.blockId, "\"]"))) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new MouseEvent("dblclick", e));
            e.stopPropagation();
        }
        else if (block.isContainer()) {
            if (!children.length) {
                var child = (0, blockTemplate_1.default)("text");
                block.setBaseStyle("alignItems", "center");
                block.setBaseStyle("justifyContent", "center");
                var childBlock = block.addChild(child);
                childBlock.makeBlockEditable();
            }
            else if (children.length === 1 && children[0].isText()) {
                var child = children[0];
                child.makeBlockEditable();
            }
            e.stopPropagation();
        }
    }
    function triggerContextMenu(e) {
        if (!(0, helpers_1.isBlock)(e) || isEditable(e))
            return;
        var block = (0, helpers_1.getBlock)(e);
        var blockId = (0, helpers_1.getBlockInfo)(e).blockId;
        if (block && block.isRoot())
            return;
        e.stopPropagation();
        e.preventDefault();
        selectBlock(e);
        (0, vue_1.nextTick)(function () {
            var _a;
            (_a = document
                .querySelector(".editor[data-block-id=\"".concat(blockId, "\"]"))) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new MouseEvent("contextmenu", e));
        });
    }
}
var isEditable = function (e) {
    var _a, _b;
    var _c = (0, helpers_1.getBlockInfo)(e), blockId = _c.blockId, breakpoint = _c.breakpoint;
    // to ensure it is right block and not on different breakpoint
    return (((_a = canvasStore.editableBlock) === null || _a === void 0 ? void 0 : _a.blockId) === blockId &&
        ((_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.activeBreakpoint) === breakpoint);
};
var selectBlock = function (e) {
    var _a;
    if (isEditable(e) || builderStore.mode !== "select") {
        return;
    }
    var block = (0, helpers_1.getBlock)(e);
    var breakpoint = (0, helpers_1.getBlockInfo)(e).breakpoint;
    if (!block)
        return;
    canvasStore.selectBlock(block, e);
    (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.setActiveBreakpoint(breakpoint);
    if (builderStore.leftPanelActiveTab !== "Code")
        builderStore.leftPanelActiveTab = "Layers";
};
//# sourceMappingURL=useBlockEventHandlers.js.map