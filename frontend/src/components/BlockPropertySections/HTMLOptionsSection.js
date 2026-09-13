"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CodeEditor_vue_1 = __importDefault(require("@/components/Controls/CodeEditor.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var canvasStore_1 = __importDefault(require("../../stores/canvasStore"));
var BasePropertyControl_vue_1 = __importDefault(require("../Controls/BasePropertyControl.vue"));
var HTMLOptionsSectionProperties = [
    {
        component: BasePropertyControl_vue_1.default,
        getProps: function () {
            return {
                component: CodeEditor_vue_1.default,
                type: "HTML",
                label: "HTML",
                autofocus: false,
                height: "60px",
                controlType: "key",
                propertyKey: "innerHTML",
                labelPlacement: "top",
                getModelValue: function () { return blockController_1.default.getInnerHTML() || ""; },
                setModelValue: function (val) { return blockController_1.default.setInnerHTML(val); },
                allowDynamicValue: true,
                actionButton: {
                    label: "Expand",
                    icon: "lucide-maximize-2",
                    handler: function () {
                        (0, canvasStore_1.default)().editHTML(blockController_1.default.getSelectedBlocks()[0]);
                    },
                },
            };
        },
        searchKeyWords: "HTML, InnerHTML, Inner HTML",
        condition: function () {
            return blockController_1.default.isHTML() || (blockController_1.default.getInnerHTML() && !blockController_1.default.isText());
        },
    },
];
exports.default = {
    name: "HTML Options",
    properties: HTMLOptionsSectionProperties,
    condition: function () { return blockController_1.default.isHTML() || (blockController_1.default.getInnerHTML() && !blockController_1.default.isText()); },
};
//# sourceMappingURL=HTMLOptionsSection.js.map