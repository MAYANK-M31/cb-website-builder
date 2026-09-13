"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var InlineInput_vue_1 = __importDefault(require("@/components/Controls/InlineInput.vue"));
var VisibilityInput_vue_1 = __importDefault(require("@/components/VisibilityInput.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var setClasses = function (val) {
    var classes = val.split(",").map(function (c) { return c.trim(); });
    blockController_1.default.setClasses(classes);
};
var optionsSectionProperties = [
    {
        component: InlineInput_vue_1.default,
        getProps: function () {
            return {
                label: "Class",
                modelValue: blockController_1.default.getClasses().join(", "),
            };
        },
        searchKeyWords: "Class, ClassName, Class Name",
        events: {
            "update:modelValue": function (val) { return setClasses(val || ""); },
        },
        condition: function () { return !blockController_1.default.multipleBlocksSelected(); },
    },
    {
        component: VisibilityInput_vue_1.default,
        getProps: function () {
            return {
                label: "Condition",
                property: "visibilityCondition",
                getModelValue: function () { return blockController_1.default.getKeyValue("visibilityCondition").key; },
                setModelValue: function (val) {
                    blockController_1.default.setKeyValue("visibilityCondition", val);
                },
                description: "Visibility condition to show/hide the block based on a condition. Pass a boolean variable created in your Data Script.<br><b>Note:</b> This is only evaluated in the preview mode.",
            };
        },
        searchKeyWords: "Condition, Visibility, VisibilityCondition, Visibility Condition, show, hide, display, hideIf, showIf",
        condition: function () { return !blockController_1.default.isRoot(); },
    },
];
exports.default = {
    name: "Options",
    properties: optionsSectionProperties,
};
//# sourceMappingURL=OptionsSection.js.map