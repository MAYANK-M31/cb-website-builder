"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectEditor_vue_1 = __importDefault(require("@/components/ObjectEditor.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var vue_1 = require("vue");
var customAttributesSectionProperties = [
    {
        component: ObjectEditor_vue_1.default,
        getProps: function () {
            return {
                obj: blockController_1.default.getCustomAttributes(),
                allowDynamicValues: true,
            };
        },
        searchKeyWords: "Attributes, CustomAttributes, Custom Attributes, HTML Attributes, Data Attributes",
        events: {
            "update:obj": function (obj) { return blockController_1.default.setCustomAttributes(obj); },
        },
    },
];
exports.default = {
    name: "HTML Attributes",
    properties: customAttributesSectionProperties,
    collapsed: (0, vue_1.computed)(function () {
        return Object.keys(blockController_1.default.getCustomAttributes()).length === 0;
    }),
};
//# sourceMappingURL=CustomAttributesSection.js.map