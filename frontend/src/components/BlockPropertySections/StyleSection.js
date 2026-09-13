"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BackgroundHandler_vue_1 = __importDefault(require("@/components/BackgroundHandler.vue"));
var ColorInput_vue_1 = __importDefault(require("@/components/Controls/ColorInput.vue"));
var StylePropertyControl_vue_1 = __importDefault(require("@/components/Controls/StylePropertyControl.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var unitOptions_1 = require("@/utils/unitOptions");
var RangeInput_vue_1 = __importDefault(require("../Controls/RangeInput.vue"));
var ShadowHandler_vue_1 = __importDefault(require("@/components/ShadowHandler.vue"));
var BorderRadiusControl_vue_1 = __importDefault(require("@/components/BorderRadiusControl.vue"));
var BorderControl_vue_1 = __importDefault(require("@/components/BorderControl.vue"));
var overflowOptions = [
    {
        label: "Unset",
        value: "unset",
    },
    {
        label: "Auto",
        value: "auto",
    },
    {
        label: "Visible",
        value: "visible",
    },
    {
        label: "Hidden",
        value: "hidden",
    },
    {
        label: "Scroll",
        value: "scroll",
    },
];
var styleSectionProperties = [
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Opacity",
                propertyKey: "opacity",
                enableSlider: false,
                component: RangeInput_vue_1.default,
                getModelValue: function () {
                    return blockController_1.default.getStyle("opacity") || 1;
                },
                min: 0,
                max: 1,
                step: 0.01,
                default: 1,
            };
        },
        condition: function () { return !blockController_1.default.multipleBlocksSelected() && !blockController_1.default.isRoot(); },
    },
    {
        component: BackgroundHandler_vue_1.default,
        getProps: function () { },
        usedStyleProperties: [
            "background",
            "background-attachment",
            "background-blend-mode",
            "background-clip",
            "background-color",
            "background-image",
            "background-origin",
            "background-position",
            "background-repeat",
            "background-size",
        ],
        searchKeyWords: "Background, BackgroundImage, Background Image, Background Position, Background Repeat, Background Size, BG, BGImage, BG Image, BGPosition, BG Position, BGRepeat, BG Repeat, BGSize, BG Size",
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                propertyKey: "color",
                component: ColorInput_vue_1.default,
                label: "Text Color",
                popoverOffset: 120,
            };
        },
        searchKeyWords: "Text, Color, TextColor, Text Color",
    },
    {
        component: BorderControl_vue_1.default,
        getProps: function () {
            return {};
        },
        usedStyleProperties: ["border", "border-color", "border-style", "border-width"],
        searchKeyWords: "Border, Color, Width, Style, BorderColor, BorderWidth, BorderStyle",
    },
    {
        component: ShadowHandler_vue_1.default,
        getProps: function () { },
        usedStyleProperties: ["box-shadow"],
        searchKeyWords: "Shadow, BoxShadow, Box Shadow",
    },
    {
        component: BorderRadiusControl_vue_1.default,
        getProps: function () { },
        usedStyleProperties: [
            "border-bottom-left-radius",
            "border-bottom-right-radius",
            "border-radius",
            "border-top-left-radius",
            "border-top-right-radius",
        ],
        searchKeyWords: "Border, Radius, BorderRadius, Border Radius",
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Z-Index",
                propertyKey: "zIndex",
            };
        },
        searchKeyWords: "Z, Index, ZIndex, Z Index, Z-index, Z-Index",
        condition: function () {
            return !blockController_1.default.multipleBlocksSelected() &&
                !blockController_1.default.isRoot() &&
                blockController_1.default.getStyle("position") !== "static";
        },
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Overflow X",
                type: "select",
                propertyKey: "overflowX",
                options: overflowOptions,
                setModelValue: function (val) {
                    if (val === "unset") {
                        val = null;
                    }
                    blockController_1.default.setStyle("overflowX", val);
                },
            };
        },
        searchKeyWords: "Overflow, X, OverflowX, Overflow X, Auto, Visible, Hide, Scroll, horizontal scroll, horizontalScroll",
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Overflow Y",
                propertyKey: "overflowY",
                type: "select",
                options: overflowOptions,
                setModelValue: function (val) {
                    if (val === "unset") {
                        val = null;
                    }
                    blockController_1.default.setStyle("overflowY", val);
                },
            };
        },
        searchKeyWords: "Overflow, Y, OverflowY, Overflow Y, Auto, Visible, Hide, Scroll, vertical scroll, verticalScroll",
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Cursor",
                propertyKey: "cursor",
                type: "select",
                options: [
                    { value: null, label: "Default" },
                    { value: "pointer", label: "Pointer" },
                    { value: "move", label: "Move" },
                    { value: "text", label: "Text" },
                    { value: "crosshair", label: "Crosshair" },
                    { value: "not-allowed", label: "Not Allowed" },
                ],
            };
        },
        searchKeyWords: "Cursor, Pointer, Move, Text, Crosshair, NotAllowed, Not Allowed",
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Rotation",
                propertyKey: "rotate",
                enableSlider: true,
                unitOptions: unitOptions_1.ROTATION_UNIT_OPTIONS,
                minValue: -360,
                maxValue: 360,
                defaultValue: 0,
            };
        },
        searchKeyWords: "Rotation, Rotate, Angle, Degrees",
        condition: function () { return !blockController_1.default.multipleBlocksSelected() && !blockController_1.default.isRoot(); },
    },
];
exports.default = {
    name: "Style",
    properties: styleSectionProperties,
};
//# sourceMappingURL=StyleSection.js.map