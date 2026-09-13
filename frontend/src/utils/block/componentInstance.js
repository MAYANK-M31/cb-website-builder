"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendWithComponent = extendWithComponent;
exports.resetWithComponent = resetWithComponent;
exports.syncBlockWithComponent = syncBlockWithComponent;
exports.rebuildWithComponent = rebuildWithComponent;
var tree_1 = require("@/utils/block/tree");
var helpers_1 = require("@/utils/helpers");
var vue_1 = require("vue");
function extendWithComponent(block, extendedFromComponent, componentChildren, resetOverrides) {
    var _a;
    if (resetOverrides === void 0) { resetOverrides = true; }
    (0, tree_1.resetBlock)(block, false, resetOverrides);
    (_a = block.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child, index) {
        child.isChildOfComponent = extendedFromComponent;
        var componentChild = componentChildren[index];
        if (child.extendedFromComponent) {
            var component = child.referenceComponent;
            child.referenceBlockId = componentChild.blockId;
            extendWithComponent(child, child.extendedFromComponent, component.children, false);
        }
        else if (componentChild) {
            child.referenceBlockId = componentChild.blockId;
            extendWithComponent(child, extendedFromComponent, componentChild.children, resetOverrides);
        }
    });
}
function resetWithComponent(block, extendedWithComponent, componentChildren, resetOverrides) {
    var _a;
    if (resetOverrides === void 0) { resetOverrides = true; }
    block = (0, vue_1.toRaw)(block);
    (0, tree_1.resetBlock)(block, true, resetOverrides);
    (_a = block.children) === null || _a === void 0 ? void 0 : _a.splice(0, block.children.length);
    componentChildren.forEach(function (componentChild) {
        var blockComponent = (0, helpers_1.getBlockCopy)(componentChild);
        blockComponent.isChildOfComponent = extendedWithComponent;
        blockComponent.referenceBlockId = componentChild.blockId;
        if (!blockComponent.extendedFromComponent) {
            blockComponent.componentVersion = block.componentVersion;
        }
        var childBlock = block.addChild(blockComponent, null, false);
        if (componentChild.extendedFromComponent) {
            var component = childBlock.referenceComponent;
            resetWithComponent(childBlock, componentChild.extendedFromComponent, component.children, false);
        }
        else {
            resetWithComponent(childBlock, extendedWithComponent, componentChild.children, resetOverrides);
        }
    });
}
function syncBlockWithComponent(parentBlock, block, componentName, componentChildren) {
    componentChildren.forEach(function (componentChild, index) {
        var blockExists = findComponentBlock(componentChild.blockId, parentBlock.children);
        if (!blockExists) {
            var blockComponent = (0, helpers_1.getBlockCopy)(componentChild);
            blockComponent.isChildOfComponent = componentName;
            blockComponent.referenceBlockId = componentChild.blockId;
            (0, tree_1.resetBlock)(blockComponent);
            resetWithComponent(blockComponent, componentName, componentChild.children);
            block.addChild(blockComponent, index, false);
        }
    });
    block.children.forEach(function (child) {
        var componentChild = componentChildren.find(function (c) { return c.blockId === child.referenceBlockId; });
        if (componentChild) {
            syncBlockWithComponent(parentBlock, child, componentName, componentChild.children);
        }
    });
}
function rebuildWithComponent(block, componentId, componentChildren, oldComponentChildren) {
    rebuildComponentChildren(block, componentId, componentChildren, indexChildrenByRefId(block.children), indexChildrenByBlockId(oldComponentChildren));
}
function rebuildComponentChildren(block, componentId, componentChildren, oldChildrenByRefId, oldComponentChildrenByBlockId) {
    // Component subtrees mirror the new version exactly; only overrides matched by reference ID survive.
    block = (0, vue_1.toRaw)(block);
    block.children.splice(0, block.children.length);
    componentChildren.forEach(function (componentChild) {
        var fresh = (0, helpers_1.getBlockCopy)(componentChild);
        fresh.isChildOfComponent = componentId;
        fresh.referenceBlockId = componentChild.blockId;
        if (!fresh.extendedFromComponent) {
            fresh.componentVersion = block.componentVersion;
        }
        var matched = oldChildrenByRefId.get(componentChild.blockId);
        var oldComponentChild = oldComponentChildrenByBlockId.get(componentChild.blockId);
        if (matched && oldComponentChild && !fresh.extendedFromComponent) {
            copyUserOverrides(matched, fresh, oldComponentChild);
        }
        var childBlock = block.addChild(fresh, null, false);
        if (componentChild.extendedFromComponent) {
            var nestedComponent = childBlock.referenceComponent;
            if (nestedComponent) {
                resetWithComponent(childBlock, componentChild.extendedFromComponent, nestedComponent.children, false);
            }
        }
        else {
            rebuildComponentChildren(childBlock, componentId, componentChild.children, indexChildrenByRefId(matched === null || matched === void 0 ? void 0 : matched.children), indexChildrenByBlockId(oldComponentChild === null || oldComponentChild === void 0 ? void 0 : oldComponentChild.children));
        }
    });
}
function copyUserOverrides(src, dst, oldComponentChild) {
    mergeOverrideMap(src.baseStyles, oldComponentChild.baseStyles, dst.baseStyles);
    mergeOverrideMap(src.mobileStyles, oldComponentChild.mobileStyles, dst.mobileStyles);
    mergeOverrideMap(src.tabletStyles, oldComponentChild.tabletStyles, dst.tabletStyles);
    mergeOverrideMap(src.attributes, oldComponentChild.attributes, dst.attributes);
    mergeOverrideMap(src.customAttributes, oldComponentChild.customAttributes, dst.customAttributes);
    dst.props = mergeOverrideProps(src.props, oldComponentChild.props, dst.props || {});
    if (src.classes) {
        dst.classes = __spreadArray(__spreadArray([], (dst.classes || []), true), (0, helpers_1.diffArray)(src.classes, oldComponentChild.classes), true);
    }
    if (src.dynamicValues) {
        dst.dynamicValues = __spreadArray(__spreadArray([], (dst.dynamicValues || []), true), (0, helpers_1.diffArray)(src.dynamicValues, oldComponentChild.dynamicValues), true);
    }
    if (src.innerHTML !== undefined && !(0, helpers_1.deepEqual)(src.innerHTML, oldComponentChild.innerHTML)) {
        dst.innerHTML = src.innerHTML;
    }
    if (src.dataKey && !(0, helpers_1.deepEqual)(src.dataKey, oldComponentChild.dataKey)) {
        dst.dataKey = src.dataKey;
    }
    if (src.visibilityCondition && !(0, helpers_1.deepEqual)(src.visibilityCondition, oldComponentChild.visibilityCondition)) {
        dst.visibilityCondition = src.visibilityCondition;
    }
}
function mergeOverrideMap(src, oldComp, dst) {
    for (var _i = 0, _a = Object.keys(src || {}); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!(0, helpers_1.deepEqual)(src === null || src === void 0 ? void 0 : src[key], oldComp === null || oldComp === void 0 ? void 0 : oldComp[key])) {
            dst[key] = src === null || src === void 0 ? void 0 : src[key];
        }
    }
}
function mergeOverrideProps(src, oldComp, dstProps) {
    // The new component's prop schema decides which override keys remain valid.
    var result = {};
    for (var _i = 0, _a = Object.keys(dstProps); _i < _a.length; _i++) {
        var key = _a[_i];
        if (src && key in src && !(0, helpers_1.deepEqual)(src[key], oldComp === null || oldComp === void 0 ? void 0 : oldComp[key])) {
            result[key] = src[key];
        }
        else {
            result[key] = dstProps[key];
        }
    }
    return result;
}
function indexChildrenByRefId(children) {
    var map = new Map();
    (children || []).forEach(function (child) {
        if (child.referenceBlockId) {
            map.set(child.referenceBlockId, child);
        }
    });
    return map;
}
function indexChildrenByBlockId(children) {
    var map = new Map();
    (children || []).forEach(function (child) {
        if (child.blockId) {
            map.set(child.blockId, child);
        }
    });
    return map;
}
function findComponentBlock(blockId, blocks) {
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        if (block.referenceBlockId === blockId) {
            return block;
        }
        if (block.children) {
            var found = findComponentBlock(blockId, block.children);
            if (found) {
                return found;
            }
        }
    }
    return null;
}
//# sourceMappingURL=componentInstance.js.map