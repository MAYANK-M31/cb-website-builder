"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BasePropertyControl_vue_1 = __importDefault(require("@/components/Controls/BasePropertyControl.vue"));
var InlineInput_vue_1 = __importDefault(require("@/components/Controls/InlineInput.vue"));
var OptionToggle_vue_1 = __importDefault(require("@/components/Controls/OptionToggle.vue"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var getEditorConfig = function () {
    var _a;
    return ((_a = blockController_1.default.getFirstSelectedBlock()) === null || _a === void 0 ? void 0 : _a.editorConfig) || {};
};
var setEditorConfig = function (patch) {
    var block = blockController_1.default.getFirstSelectedBlock();
    if (!block)
        return;
    block.editorConfig = __assign(__assign({}, block.editorConfig), patch);
};
var editorConfigSectionProperties = [
    {
        component: InlineInput_vue_1.default,
        getProps: function () { return ({
            label: "Layer Icon",
            modelValue: getEditorConfig().icon || "",
            placeholder: "e.g. play-circle",
        }); },
        events: {
            "update:modelValue": function (val) { return setEditorConfig({ icon: val || undefined }); },
        },
        searchKeyWords: "Editor, Config, Icon, Layer Icon, EditorConfig",
    },
    {
        component: BasePropertyControl_vue_1.default,
        getProps: function () { return ({
            propertyKey: "showChildrenInEditor",
            label: "Show Children",
            component: OptionToggle_vue_1.default,
            enableStates: false,
            options: [
                { label: "Show", value: true },
                { label: "Hide", value: false },
            ],
            getModelValue: function () {
                var val = getEditorConfig().showChildrenInEditor;
                return val === false ? false : true;
            },
            setModelValue: function (val) { return setEditorConfig({ showChildrenInEditor: val }); },
        }); },
        searchKeyWords: "Editor, Config, Show Children, showChildrenInEditor, Layers, EditorConfig",
    },
];
exports.default = {
    name: "Editor Config",
    properties: editorConfigSectionProperties,
    collapsed: true,
    condition: function () {
        var canvasStore = (0, canvasStore_1.default)();
        return (!blockController_1.default.multipleBlocksSelected() &&
            canvasStore.editingMode === "fragment" &&
            window.is_developer_mode);
    },
};
//# sourceMappingURL=EditorConfigSection.js.map