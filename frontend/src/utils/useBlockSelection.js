"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBlockSelection = useBlockSelection;
var tree_1 = require("@/utils/block/tree");
var vue_1 = require("vue");
function useBlockSelection(rootBlock) {
    var selectedBlockIds = (0, vue_1.ref)(new Set());
    function findBlock(blockId, blocks) {
        return (0, tree_1.findBlockInTree)(blockId, blocks !== null && blocks !== void 0 ? blocks : [rootBlock.value]);
    }
    var selectedBlocks = (0, vue_1.computed)(function () {
        return Array.from(selectedBlockIds.value)
            .map(function (id) { return findBlock(id); })
            .filter(function (b) { return !!b; });
    });
    var isSelected = function (block) {
        return selectedBlockIds.value.has(block.blockId);
    };
    var selectBlock = function (block, multiSelect) {
        if (multiSelect === void 0) { multiSelect = false; }
        if (multiSelect) {
            selectedBlockIds.value.add(block.blockId);
        }
        else {
            selectedBlockIds.value = new Set([block.blockId]);
        }
    };
    var toggleBlockSelection = function (block) {
        if (selectedBlockIds.value.has(block.blockId)) {
            selectedBlockIds.value.delete(block.blockId);
        }
        else {
            selectBlock(block, true);
        }
    };
    var clearSelection = function () {
        selectedBlockIds.value = new Set();
    };
    var selectBlockRange = function (newSelectedBlock) {
        var _a, _b;
        var lastSelectedBlockId = Array.from(selectedBlockIds.value)[selectedBlockIds.value.size - 1];
        var lastSelectedBlock = findBlock(lastSelectedBlockId);
        var lastSelectedBlockParent = lastSelectedBlock === null || lastSelectedBlock === void 0 ? void 0 : lastSelectedBlock.parentBlock;
        if (!lastSelectedBlock || !lastSelectedBlockParent) {
            newSelectedBlock.selectBlock();
            return;
        }
        var lastSelectedBlockIndex = (_a = lastSelectedBlock.parentBlock) === null || _a === void 0 ? void 0 : _a.children.indexOf(lastSelectedBlock);
        var newSelectedBlockIndex = (_b = newSelectedBlock.parentBlock) === null || _b === void 0 ? void 0 : _b.children.indexOf(newSelectedBlock);
        var newSelectedBlockParent = newSelectedBlock.parentBlock;
        if (lastSelectedBlockIndex === undefined || newSelectedBlockIndex === undefined) {
            return;
        }
        var start = Math.min(lastSelectedBlockIndex, newSelectedBlockIndex);
        var end = Math.max(lastSelectedBlockIndex, newSelectedBlockIndex);
        if (lastSelectedBlockParent === newSelectedBlockParent) {
            var blocks = lastSelectedBlockParent.children.slice(start, end + 1);
            blocks.forEach(function (b) { return selectedBlockIds.value.add(b.blockId); });
        }
    };
    return {
        selectedBlockIds: selectedBlockIds,
        selectedBlocks: selectedBlocks,
        isSelected: isSelected,
        selectBlock: selectBlock,
        toggleBlockSelection: toggleBlockSelection,
        clearSelection: clearSelection,
        selectBlockRange: selectBlockRange,
    };
}
//# sourceMappingURL=useBlockSelection.js.map