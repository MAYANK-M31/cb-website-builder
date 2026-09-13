"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AttributePropertyControl_vue_1 = __importDefault(require("@/components/Controls/AttributePropertyControl.vue"));
var ImageUploadInput_vue_1 = __importDefault(require("@/components/ImageUploadInput.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var imageUtils_1 = require("@/utils/imageUtils");
var frappe_ui_1 = require("frappe-ui");
var vue_1 = require("vue");
var imageOptionsSectionProperties = [
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                component: ImageUploadInput_vue_1.default,
                propertyKey: "src",
                label: "Image URL",
                allowDynamicValue: true,
                popoverOffset: 120,
                imageFit: blockController_1.default.getStyle("objectFit"),
                variants: [{ name: "dark", property: "darkSrc", label: "Dark Mode" }],
            };
        },
        events: {
            "update:imageURL": function (val) { return blockController_1.default.setAttribute("src", val); },
            "update:imageFit": function (val) { return blockController_1.default.setStyle("objectFit", val); },
        },
        searchKeyWords: "Image, URL, Src, Fit, ObjectFit, Object Fit, Fill, Contain, Cover, Dark, Mode, Dark Mode, Theme",
        usedStyleProperties: ["object-fit"],
    },
    {
        component: frappe_ui_1.Button,
        getProps: function () {
            return {
                class: "text-base self-end",
            };
        },
        innerText: (0, vue_1.computed)(function () {
            var block = blockController_1.default.getSelectedBlocks()[0];
            var imageUrl = (block === null || block === void 0 ? void 0 : block.getAttribute("src")) || "";
            return (0, imageUtils_1.getOptimizeButtonText)(imageUrl);
        }),
        searchKeyWords: "Image, Local, Copy, Server, Download, Host, Store, Convert, webp, Convert to webp, image, src, url",
        events: {
            click: function () {
                var block = blockController_1.default.getSelectedBlocks()[0];
                var imageUrl = block.getAttribute("src");
                return (0, imageUtils_1.optimizeImage)({
                    imageUrl: imageUrl,
                    onSuccess: function (newUrl) {
                        block.setAttribute("src", newUrl);
                    },
                });
            },
        },
        condition: function () {
            if (!blockController_1.default.isImage()) {
                return false;
            }
            var imageUrl = blockController_1.default.getAttribute("src");
            return (0, imageUtils_1.shouldShowOptimizeButton)(imageUrl);
        },
    },
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                propertyKey: "alt",
                label: "Alt Text",
                allowDynamicValue: true,
                getModelValue: function () { return blockController_1.default.getAttribute("alt") || ""; },
                setModelValue: function (val) { return blockController_1.default.setAttribute("alt", val); },
            };
        },
        searchKeyWords: "Alt, Text, AltText, Alternate Text",
        condition: function () { return blockController_1.default.isImage(); },
    },
];
exports.default = {
    name: "Image Options",
    properties: imageOptionsSectionProperties,
    condition: function () { return blockController_1.default.isImage(); },
};
//# sourceMappingURL=ImageOptionsSection.js.map