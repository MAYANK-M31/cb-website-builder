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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MoreStylesPanel_vue_1 = __importDefault(require("@/components/MoreStylesPanel.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var stylePropertiesWithControls_1 = require("@/utils/stylePropertiesWithControls");
var vue_1 = require("vue");
var moreStylesSectionProperties = [
    {
        component: MoreStylesPanel_vue_1.default,
        searchKeyWords: "More, Styles, CSS, Property, Properties, Advanced",
    },
];
exports.default = {
    name: "More Styles",
    properties: moreStylesSectionProperties,
    collapsed: (0, vue_1.computed)(function () {
        var block = blockController_1.default.getFirstSelectedBlock();
        if (!block)
            return true;
        var styles = __assign(__assign(__assign({}, block.baseStyles), block.tabletStyles), block.mobileStyles);
        return (0, stylePropertiesWithControls_1.getStylePropertiesWithoutControls)(styles).size === 0;
    }),
    condition: function () { return blockController_1.default.getSelectedBlocks().length === 1; }
};
//# sourceMappingURL=MoreStylesSection.js.map