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
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var blockTemplate_1 = __importDefault(require("./blockTemplate"));
var canvasStore = (0, canvasStore_1.default)();
var blockController = {
    clearSelection: function () {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.clearSelection();
    },
    getFirstSelectedBlock: function () {
        var _a;
        return (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks[0];
    },
    getSelectedBlocks: function () {
        var _a;
        return ((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks) || [];
    },
    isRoot: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isRoot();
    },
    isFlex: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isFlex();
    },
    isGrid: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isGrid();
    },
    setStyle: function (style, value) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            block.setStyle(style, value);
        });
    },
    setBaseStyle: function (style, value) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            block.setBaseStyle(style, value);
        });
    },
    getStyle: function (style, nativeOnly, cascading) {
        var _a;
        var styleValue = "__initial__";
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            if (styleValue === "__initial__") {
                styleValue = block.getStyle(style, undefined, nativeOnly, cascading);
            }
            else if (styleValue !== block.getStyle(style, undefined, nativeOnly, cascading)) {
                styleValue = "Mixed";
            }
        });
        return styleValue;
    },
    getNativeStyle: function (style) {
        var _a;
        var styleValue = "__initial__";
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            if (styleValue === "__initial__") {
                styleValue = block.getStyle(style, undefined, true);
            }
            else if (styleValue !== block.getStyle(style, undefined, true)) {
                styleValue = "Mixed";
            }
        });
        return styleValue;
    },
    getCascadingStyle: function (style) {
        var _a;
        var styleValue = "__initial__";
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            if (styleValue === "__initial__") {
                styleValue = block.getStyle(style, undefined, false, true);
            }
            else if (styleValue !== block.getStyle(style, undefined, false, true)) {
                styleValue = "Mixed";
            }
        });
        return styleValue;
    },
    isBlockSelected: function () {
        var _a, _b;
        return ((_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.length) !== null && _b !== void 0 ? _b : 0) > 0;
    },
    multipleBlocksSelected: function () {
        var _a, _b;
        return ((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks) && ((_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.selectedBlocks.length) > 1;
    },
    isText: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isText();
    },
    isContainer: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isContainer();
    },
    isImage: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isImage();
    },
    isVideo: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isVideo();
    },
    isButton: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isButton();
    },
    isLink: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isLink();
    },
    isInput: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isInput();
    },
    getAttribute: function (attribute) {
        var _a;
        var attributeValue = "__initial__";
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            if (attributeValue === "__initial__") {
                attributeValue = block.getAttribute(attribute);
            }
            else if (attributeValue !== block.getAttribute(attribute)) {
                attributeValue = "Mixed";
            }
        });
        return attributeValue;
    },
    setAttribute: function (attribute, value) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            block.setAttribute(attribute, value);
        });
    },
    removeAttribute: function (attribute) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            block.removeAttribute(attribute);
        });
    },
    getKeyValue: function (key) {
        var _a, _b;
        if (key !== "visibilityCondition") {
            var keyValue_1 = "__initial__";
            (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
                var _a, _b;
                var blockKey = (_a = block[key]) !== null && _a !== void 0 ? _a : (_b = block.referenceComponent) === null || _b === void 0 ? void 0 : _b[key];
                if (keyValue_1 === "__initial__") {
                    keyValue_1 = blockKey;
                }
                else if (keyValue_1 !== blockKey) {
                    keyValue_1 = "Mixed";
                }
            });
            return keyValue_1;
        }
        else {
            // TODO: handle it better
            var key_1 = "__initial__";
            var comesFrom_1 = undefined;
            (_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.selectedBlocks.forEach(function (block) {
                var condition = block.getVisibilityCondition();
                if (key_1 === "__initial__") {
                    if (condition) {
                        key_1 = condition.key;
                        comesFrom_1 = condition.comesFrom;
                    }
                    else {
                        key_1 = undefined;
                        comesFrom_1 = undefined;
                    }
                }
                else if ((condition === null || condition === void 0 ? void 0 : condition.comesFrom) !== comesFrom_1 || (condition === null || condition === void 0 ? void 0 : condition.key) !== key_1) {
                    key_1 = "Mixed";
                    comesFrom_1 = undefined;
                }
            });
            return { key: key_1, comesFrom: comesFrom_1 };
        }
    },
    setKeyValue: function (key, value) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            if (key === "element" && block.blockName === "container") {
                // reset blockName since it will not be a container anymore
                delete block.blockName;
            }
            block[key] = value;
        });
    },
    getClasses: function () {
        var classes = [];
        if (blockController.isBlockSelected()) {
            classes = blockController.getFirstSelectedBlock().getClasses() || [];
        }
        return classes;
    },
    setClasses: function (classes) {
        var _a;
        var block = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks[0];
        if (!block)
            return;
        block.classes = classes;
    },
    getCustomAttributes: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().getCustomAttributes();
    },
    setCustomAttributes: function (customAttributes) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            Object.keys(block.customAttributes).forEach(function (key) {
                if (!(key in customAttributes)) {
                    delete block.customAttributes[key];
                    block.removeDynamicValue(key, "attribute");
                }
            });
            Object.assign(block.customAttributes, customAttributes);
        });
    },
    isClickTrackingEnabled: function () {
        var _a;
        return Boolean((_a = blockController.getCustomAttributes()) === null || _a === void 0 ? void 0 : _a["data-track"]);
    },
    toggleClickTracking: function (enabled) {
        var _a;
        // Store a marker only; the live blockId is stamped onto data-track at render time.
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            if (enabled) {
                block.customAttributes["data-track"] = "true";
            }
            else {
                delete block.customAttributes["data-track"];
                block.removeDynamicValue("data-track", "attribute");
            }
        });
    },
    getParentBlock: function () {
        var _a, _b;
        return (_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks[0]) === null || _b === void 0 ? void 0 : _b.getParentBlock();
    },
    setTextColor: function (color) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            block.setTextColor(color);
        });
    },
    getTextColor: function () {
        var _a;
        var color = "__initial__";
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            if (color === "__initial__") {
                color = block.getTextColor();
            }
            else if (color !== block.getTextColor()) {
                color = "Mixed";
            }
        });
        return color;
    },
    setFontFamily: function (value) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            block.setFontFamily(value);
        });
    },
    getFontFamily: function () {
        var _a;
        var fontFamily = "__initial__";
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            if (fontFamily === "__initial__") {
                fontFamily = block.getFontFamily();
            }
            else if (fontFamily !== block.getFontFamily()) {
                fontFamily = "Mixed";
            }
        });
        return fontFamily;
    },
    isHTML: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isHTML();
    },
    isSVG: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isSVG();
    },
    getInnerHTML: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().getInnerHTML();
    },
    getText: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().getText();
    },
    setInnerHTML: function (value) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            block.setInnerHTML(value);
        });
    },
    getTextContent: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().getTextContent();
    },
    setDataKey: function (key, value) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            block.setDataKey(key, value);
        });
    },
    getDataKey: function (key) {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().getDataKey(key);
    },
    isRepeater: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().isRepeater();
    },
    getPadding: function (opts) {
        var padding = "__initial__";
        blockController.getSelectedBlocks().forEach(function (block) {
            var val = block.getPadding(opts);
            if (padding === "__initial__") {
                padding = val;
            }
            else if (padding !== val) {
                padding = "Mixed";
            }
        });
        return padding;
    },
    setPadding: function (value) {
        blockController.getSelectedBlocks().forEach(function (block) {
            block.setPadding(value);
        });
    },
    getMargin: function (opts) {
        var margin = "__initial__";
        blockController.getSelectedBlocks().forEach(function (block) {
            var val = block.getMargin(opts);
            if (margin === "__initial__") {
                margin = val;
            }
            else if (margin !== val) {
                margin = "Mixed";
            }
        });
        return margin;
    },
    setMargin: function (value) {
        blockController.getSelectedBlocks().forEach(function (block) {
            block.setMargin(value);
        });
    },
    toggleAttribute: function (attribute) {
        var _a;
        (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectedBlocks.forEach(function (block) {
            if (block.getAttribute(attribute) !== undefined) {
                block.removeAttribute(attribute);
            }
            else {
                block.setAttribute(attribute, "");
            }
        });
    },
    canHaveChildren: function () {
        return blockController.isBlockSelected() && blockController.getFirstSelectedBlock().canHaveChildren();
    },
    convertToLink: function () { return __awaiter(void 0, void 0, void 0, function () {
        var blocks, _i, blocks_1, block, parentBlock, newBlockObj, newBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blocks = blockController.getSelectedBlocks();
                    _i = 0, blocks_1 = blocks;
                    _a.label = 1;
                case 1:
                    if (!(_i < blocks_1.length)) return [3 /*break*/, 6];
                    block = blocks_1[_i];
                    if (!(block.isSVG() || block.isImage())) return [3 /*break*/, 3];
                    parentBlock = block.getParentBlock();
                    if (!parentBlock)
                        return [3 /*break*/, 5];
                    newBlockObj = (0, blockTemplate_1.default)("fit-container");
                    newBlock = parentBlock.addChild(newBlockObj, parentBlock.getChildIndex(block));
                    newBlock.addChild(block);
                    parentBlock.removeChild(block);
                    return [4 /*yield*/, newBlock.convertToLink()];
                case 2:
                    _a.sent();
                    newBlock.selectBlock();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, block.convertToLink()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    }); },
    unsetLink: function () {
        blockController.getSelectedBlocks().forEach(function (block) {
            block.unsetLink();
        });
    },
    getBlockProps: function () {
        var _a;
        return (_a = blockController.getFirstSelectedBlock()) === null || _a === void 0 ? void 0 : _a.getBlockProps();
    },
    setBlockProp: function (key, value) {
        var _a;
        var allProps = blockController.getBlockProps();
        if (!allProps)
            return;
        var updatedProps = __assign(__assign({}, allProps), (_a = {}, _a[key] = __assign(__assign({}, allProps[key]), value), _a));
        blockController.setBlockProps(updatedProps);
    },
    setBlockProps: function (props) {
        var block = blockController.getFirstSelectedBlock();
        if (!block)
            return;
        block.setBlockProps(props);
    },
};
exports.default = blockController;
//# sourceMappingURL=blockController.js.map