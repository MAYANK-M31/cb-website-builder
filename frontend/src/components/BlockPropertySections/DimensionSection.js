"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DimensionInput_vue_1 = __importDefault(require("@/components/DimensionInput.vue"));
var dimensionSectionProperties = [
    {
        component: DimensionInput_vue_1.default,
        searchKeyWords: "Width",
        getProps: function () {
            return {
                label: "Width",
                property: "width",
            };
        },
    },
    {
        component: DimensionInput_vue_1.default,
        searchKeyWords: "Min, Width, MinWidth, Min Width",
        getProps: function () {
            return {
                label: "Min Width",
                property: "minWidth",
            };
        },
    },
    {
        component: DimensionInput_vue_1.default,
        searchKeyWords: "Max, Width, MaxWidth, Max Width",
        getProps: function () {
            return {
                label: "Max Width",
                property: "maxWidth",
            };
        },
    },
    {
        component: "hr",
        getProps: function () {
            return {
                class: "border-outline-gray-1",
            };
        },
        searchKeyWords: "",
    },
    {
        component: DimensionInput_vue_1.default,
        searchKeyWords: "Height",
        getProps: function () {
            return {
                label: "Height",
                property: "height",
            };
        },
    },
    {
        component: DimensionInput_vue_1.default,
        searchKeyWords: "Min, Height, MinHeight, Min Height",
        getProps: function () {
            return {
                label: "Min Height",
                property: "minHeight",
            };
        },
    },
    {
        component: DimensionInput_vue_1.default,
        searchKeyWords: "Max, Height, MaxHeight, Max Height",
        getProps: function () {
            return {
                label: "Max Height",
                property: "maxHeight",
            };
        },
    },
];
exports.default = {
    name: "Dimension",
    properties: dimensionSectionProperties,
};
//# sourceMappingURL=DimensionSection.js.map