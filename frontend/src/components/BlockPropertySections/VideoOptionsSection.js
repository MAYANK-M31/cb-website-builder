"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AttributePropertyControl_vue_1 = __importDefault(require("@/components/Controls/AttributePropertyControl.vue"));
var InlineInput_vue_1 = __importDefault(require("@/components/Controls/InlineInput.vue"));
var OptionToggle_vue_1 = __importDefault(require("@/components/Controls/OptionToggle.vue"));
var ImageUploadInput_vue_1 = __importDefault(require("@/components/ImageUploadInput.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var videoOptionsSectionProperties = [
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                component: InlineInput_vue_1.default,
                propertyKey: "src",
                label: "Video URL",
                allowDynamicValue: true,
                dynamicValueFilterOptions: {
                    excludeOwnProps: true,
                },
            };
        },
        searchKeyWords: "Source, URL, Link, Video URL, Video Link",
    },
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                component: ImageUploadInput_vue_1.default,
                propertyKey: "poster",
                label: "Poster",
            };
        },
        searchKeyWords: "Poster, Image, Thumbnail, Preview",
    },
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                component: OptionToggle_vue_1.default,
                propertyKey: "controls",
                label: "Controls",
                options: [
                    { label: "Show", value: "true" },
                    { label: "Hide", value: "false" },
                ],
                getModelValue: function () { return (blockController_1.default.getAttribute("controls") === "" ? "true" : "false"); },
                setModelValue: function () { return blockController_1.default.toggleAttribute("controls"); },
            };
        },
        searchKeyWords: "Controls, volume, play, pause, stop, mute, unmute, fullscreen, full screen",
    },
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                component: OptionToggle_vue_1.default,
                propertyKey: "autoplay",
                label: "Autoplay",
                options: [
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" },
                ],
                getModelValue: function () { return (blockController_1.default.getAttribute("autoplay") === "" ? "true" : "false"); },
                setModelValue: function () { return blockController_1.default.toggleAttribute("autoplay"); },
            };
        },
        searchKeyWords: "Autoplay, Auto Play",
    },
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                component: OptionToggle_vue_1.default,
                propertyKey: "muted",
                label: "Muted",
                options: [
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" },
                ],
                getModelValue: function () { return (blockController_1.default.getAttribute("muted") === "" ? "true" : "false"); },
                setModelValue: function () { return blockController_1.default.toggleAttribute("muted"); },
            };
        },
        searchKeyWords: "Muted",
    },
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                component: OptionToggle_vue_1.default,
                propertyKey: "loop",
                label: "Loop",
                options: [
                    { label: "Yes", value: "true" },
                    { label: "No", value: "false" },
                ],
                getModelValue: function () { return (blockController_1.default.getAttribute("loop") === "" ? "true" : "false"); },
                setModelValue: function () { return blockController_1.default.toggleAttribute("loop"); },
            };
        },
        searchKeyWords: "Loop",
    },
];
exports.default = {
    name: "Video Options",
    properties: videoOptionsSectionProperties,
    condition: function () { return blockController_1.default.isVideo(); },
};
//# sourceMappingURL=VideoOptionsSection.js.map