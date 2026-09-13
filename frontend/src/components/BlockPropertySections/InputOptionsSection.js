"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var InlineInput_vue_1 = __importDefault(require("@/components/Controls/InlineInput.vue"));
var OptionToggle_vue_1 = __importDefault(require("@/components/Controls/OptionToggle.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var inputOptionsSectionProperties = [
    {
        component: InlineInput_vue_1.default,
        getProps: function () {
            return {
                label: "Type",
                type: "select",
                options: ["text", "number", "email", "password", "date", "time", "search", "tel", "url", "color", "radio"],
                modelValue: blockController_1.default.getAttribute("type") || "text",
            };
        },
        searchKeyWords: "Input, Type, InputType, Input Type, Text, Number, Email, Password, Date, Time, Search, Tel, Url, Color, Radio, tag",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.setAttribute("type", val); },
        },
    },
    {
        component: InlineInput_vue_1.default,
        getProps: function () {
            return {
                label: "Placeholder",
                modelValue: blockController_1.default.getAttribute("placeholder"),
            };
        },
        searchKeyWords: "Placeholder, Input, PlaceholderText, Placeholder Text, form, input, text, number, email, password, date, time, search, tel, url, color, tag",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.setAttribute("placeholder", val); },
        },
    },
    // Radio button specific properties
    {
        component: InlineInput_vue_1.default,
        getProps: function () {
            return {
                label: "Name",
                modelValue: blockController_1.default.getAttribute("name") || "",
                description: "Group name for this radio button. Radio buttons with the same name are grouped together.",
            };
        },
        searchKeyWords: "Radio, Name, Group, RadioName, Radio Name, Group Name, input, radio button",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.setAttribute("name", val); },
        },
        condition: function () { return blockController_1.default.getAttribute("type") === "radio"; },
    },
    {
        component: InlineInput_vue_1.default,
        getProps: function () {
            return {
                label: "Value",
                modelValue: blockController_1.default.getAttribute("value") || "",
                description: "Value submitted with the form when this radio button is selected.",
            };
        },
        searchKeyWords: "Radio, Value, RadioValue, Radio Value, input, radio button",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.setAttribute("value", val); },
        },
        condition: function () { return blockController_1.default.getAttribute("type") === "radio"; },
    },
    {
        component: OptionToggle_vue_1.default,
        getProps: function () {
            return {
                label: "Checked",
                options: [
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                ],
                modelValue: blockController_1.default.getAttribute("checked") === "" || blockController_1.default.getAttribute("checked") === "checked",
            };
        },
        searchKeyWords: "Checked, Radio, DefaultValue, Default Value, Selected, Initially Checked",
        events: {
            "update:modelValue": function (val) {
                if (val) {
                    blockController_1.default.setAttribute("checked", "checked");
                }
                else {
                    blockController_1.default.removeAttribute("checked");
                }
            },
        },
        condition: function () { return blockController_1.default.getAttribute("type") === "radio"; },
    },
];
exports.default = {
    name: "Input Options",
    properties: inputOptionsSectionProperties,
    condition: function () { return blockController_1.default.isInput(); },
};
//# sourceMappingURL=InputOptionsSection.js.map