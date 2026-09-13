"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetBlock = resetBlock;
exports.findBlockInTree = findBlockInTree;
var helpers_1 = require("@/utils/helpers");
function resetBlock(block, resetChildren, resetOverrides) {
    var _a;
    if (resetChildren === void 0) { resetChildren = true; }
    if (resetOverrides === void 0) { resetOverrides = true; }
    block.blockId = (0, helpers_1.generateId)();
    if (resetOverrides) {
        delete block.innerHTML;
        delete block.element;
        block.baseStyles = {};
        block.mobileStyles = {};
        block.tabletStyles = {};
        block.attributes = {};
        block.customAttributes = {};
        block.classes = [];
        block.dataKey = null;
        block.dynamicValues = [];
        block.props = {};
        block.clientScript = {};
        // @ts-ignore
        delete block.blockClientScript;
    }
    if (resetChildren) {
        (_a = block.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            resetBlock(child, resetChildren, !Boolean(child.extendedFromComponent));
        });
    }
}
function findBlockInTree(blockId, blocks) {
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        if (block.blockId === blockId) {
            return block;
        }
        if (block.children) {
            var found = findBlockInTree(blockId, block.children);
            if (found) {
                return found;
            }
        }
    }
    return null;
}
//# sourceMappingURL=tree.js.map