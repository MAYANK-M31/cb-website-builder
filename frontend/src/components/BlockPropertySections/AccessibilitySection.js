"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var InlineInput_vue_1 = __importDefault(require("@/components/Controls/InlineInput.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var vue_1 = require("vue");
var accessibilitySectionProperties = [
    {
        component: InlineInput_vue_1.default,
        getProps: function () {
            return {
                label: "Tag",
                type: "select",
                options: [
                    "aside",
                    "article",
                    "span",
                    "div",
                    "section",
                    "button",
                    "p",
                    "a",
                    "input",
                    "hr",
                    "form",
                    "textarea",
                    "nav",
                    "header",
                    "footer",
                    "label",
                    "select",
                    "option",
                    "blockquote",
                    "cite",
                    "canvas",
                ],
                modelValue: blockController_1.default.getKeyValue("element"),
            };
        },
        searchKeyWords: "Tag, Element, TagName, Tag Name, ElementName, Element Name, header, footer, nav, input, form, textarea, button, p, a, div, span, section, hr, TagType, Tag Type, ElementType, Element Type",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.setKeyValue("element", val); },
        },
        condition: function () { return !blockController_1.default.isRoot(); },
    },
    {
        component: InlineInput_vue_1.default,
        getProps: function () { return ({
            label: "Aria Label",
            modelValue: blockController_1.default.getAttribute("aria-label"),
        }); },
        searchKeyWords: "AriaLabel, Aria Label, Label, Accessibility Label, Aria",
        events: {
            "update:modelValue": function (val) {
                return (val === null || val === void 0 ? void 0 : val.trim())
                    ? blockController_1.default.setAttribute("aria-label", val.trim())
                    : blockController_1.default.removeAttribute("aria-label");
            },
        },
    },
    {
        component: InlineInput_vue_1.default,
        getProps: function () { return ({
            label: "Role",
            type: "select",
            options: [
                "button",
                "alert",
                "link",
                "navigation",
                "banner",
                "main",
                "contentinfo",
                "heading",
                "form",
                "list",
                "table",
                "text",
                "alertdialog",
                "tab",
                "tabpanel",
                "presentation",
                "region",
            ],
            modelValue: blockController_1.default.getAttribute("role"),
        }); },
        searchKeyWords: "Role, Accessibility, AccessibilityRole, Accessibility Role",
        events: {
            "update:modelValue": function (val) {
                blockController_1.default.setAttribute("role", val);
            },
        },
    },
    {
        component: InlineInput_vue_1.default,
        getProps: function () { return ({
            label: "Tab Index",
            type: "number",
            min: -1,
            modelValue: blockController_1.default.getAttribute("tabindex"),
        }); },
        searchKeyWords: "TabIndex, Keyboard Focus, Focus Order, Accessibility",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.setAttribute("tabindex", val); },
        },
    },
];
exports.default = {
    name: "Accessibility",
    properties: accessibilitySectionProperties,
    collapsed: (0, vue_1.computed)(function () {
        return !blockController_1.default.getAttribute("aria-label") &&
            !blockController_1.default.getAttribute("role") &&
            !blockController_1.default.getAttribute("tabindex");
    }),
};
//# sourceMappingURL=AccessibilitySection.js.map