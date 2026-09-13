"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var InlineInput_vue_1 = __importDefault(require("@/components/Controls/InlineInput.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var vue_1 = require("vue");
var dataKeySectionProperties = [
    {
        component: InlineInput_vue_1.default,
        getProps: function () {
            return {
                label: "Key",
                modelValue: blockController_1.default.getDataKey("key"),
            };
        },
        searchKeyWords: "Key, DataKey, Data Key",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.setDataKey("key", val); },
        },
    },
    {
        component: InlineInput_vue_1.default,
        condition: function () { return !blockController_1.default.isRepeater(); },
        getProps: function () {
            return {
                label: "Type",
                modelValue: blockController_1.default.getDataKey("type"),
            };
        },
        searchKeyWords: "Type, DataType, Data Type",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.setDataKey("type", val); },
        },
    },
    {
        component: InlineInput_vue_1.default,
        condition: function () { return !blockController_1.default.isRepeater(); },
        getProps: function () {
            return {
                label: "Property",
                modelValue: blockController_1.default.getDataKey("property"),
            };
        },
        searchKeyWords: "Property, DataProperty, Data Property",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.setDataKey("property", val); },
        },
    },
];
exports.default = {
    name: "Data Key",
    properties: dataKeySectionProperties,
    collapsed: (0, vue_1.computed)(function () {
        return !blockController_1.default.getDataKey("key") && !blockController_1.default.isRepeater();
    }),
};
//# sourceMappingURL=DataKeySection.js.map