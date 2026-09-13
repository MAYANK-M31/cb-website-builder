"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var StylePropertyControl_vue_1 = __importDefault(require("@/components/Controls/StylePropertyControl.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var transitionSectionProperties = [
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Speed",
                propertyKey: "transitionDuration",
                type: "select",
                enableStates: false,
                options: [
                    { value: null, label: "None" },
                    { value: "150ms", label: "Fast" },
                    { value: "300ms", label: "Normal" },
                    { value: "500ms", label: "Slow" },
                    { value: "1000ms", label: "Very Slow" },
                ],
                setModelValue: function (val) {
                    if (val === "None") {
                        val = null;
                    }
                    blockController_1.default.setStyle("transitionDuration", val);
                    if (val) {
                        if (!blockController_1.default.getStyle("transitionTimingFunction")) {
                            blockController_1.default.setStyle("transitionTimingFunction", "ease");
                        }
                        if (!blockController_1.default.getStyle("transitionProperty")) {
                            blockController_1.default.setStyle("transitionProperty", "all");
                        }
                    }
                    else {
                        blockController_1.default.setStyle("transitionTimingFunction", null);
                        blockController_1.default.setStyle("transitionProperty", null);
                    }
                },
            };
        },
        searchKeyWords: "Transition, Duration, Speed, Animation Time",
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Timing",
                propertyKey: "transitionTimingFunction",
                type: "select",
                enableStates: false,
                options: [
                    { value: "ease", label: "Smooth" },
                    { value: "linear", label: "Linear" },
                    { value: "ease-in", label: "Ease In" },
                    { value: "ease-out", label: "Ease Out" },
                    { value: "ease-in-out", label: "Ease In Out" },
                ],
            };
        },
        searchKeyWords: "Transition, Timing, Easing, Animation Style",
        condition: function () { return blockController_1.default.getStyle("transitionDuration"); },
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Properties",
                propertyKey: "transitionProperty",
                type: "select",
                enableStates: false,
                options: [
                    { value: "all", label: "All Properties" },
                    { value: "transform", label: "Transform Only" },
                    { value: "opacity", label: "Opacity Only" },
                    { value: "background", label: "Background Only" },
                    { value: "colors", label: "Colors Only" },
                ],
            };
        },
        searchKeyWords: "Transition, Properties, What to Animate",
        condition: function () { return blockController_1.default.getStyle("transitionDuration"); },
    },
];
exports.default = {
    name: "Transition",
    properties: transitionSectionProperties,
    collapsed: true,
    condition: function () { return !blockController_1.default.multipleBlocksSelected(); },
};
//# sourceMappingURL=TransitionSection.js.map