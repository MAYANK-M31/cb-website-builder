"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SpacingControl_vue_1 = __importDefault(require("@/components/SpacingControl.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var spacingSectionProperties = [
    {
        component: SpacingControl_vue_1.default,
        searchKeyWords: "Margin, Top, MarginTop, Margin Top",
        getProps: function () { return ({ type: "margin" }); },
        usedStyleProperties: ["margin", "margin-bottom", "margin-left", "margin-right", "margin-top"],
        condition: function () { return !blockController_1.default.isRoot(); },
    },
    {
        component: SpacingControl_vue_1.default,
        searchKeyWords: "Padding, Top, PaddingTop, Padding Top",
        getProps: function () { return ({ type: "padding" }); },
        usedStyleProperties: ["padding", "padding-bottom", "padding-left", "padding-right", "padding-top"],
    },
];
exports.default = {
    name: "Spacing",
    properties: spacingSectionProperties,
};
//# sourceMappingURL=SpacingSection.js.map