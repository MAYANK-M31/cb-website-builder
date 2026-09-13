"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Autocomplete_vue_1 = __importDefault(require("@/components/Controls/Autocomplete.vue"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var pageStore_1 = __importDefault(require("@/stores/pageStore"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var componentController_1 = __importDefault(require("@/utils/componentController"));
var helpers_1 = require("@/utils/helpers");
var vue_1 = require("vue");
var keyOptions = (0, vue_1.computed)(function () {
    var _a, _b, _c, _d, _e;
    var pageStore = (0, pageStore_1.default)();
    var canvasStore = (0, canvasStore_1.default)();
    var result = [];
    var repeatablePageDataKeys = [];
    var repeatableComponentDataKeys = [];
    var pageDataCollectionObject = canvasStore.editingMode == "fragment"
        ? {}
        : (0, helpers_1.getRepeaterScopedData)(blockController_1.default.getFirstSelectedBlock(), pageStore.pageData);
    var componentData = {};
    if (canvasStore.editingMode == "fragment") {
        componentData = componentController_1.default.getComponentDataPreview();
    }
    var componentDataCollectionObject = (0, helpers_1.getRepeaterScopedData)(blockController_1.default.getFirstSelectedBlock(), componentData);
    var isInsideRepeater = (_a = blockController_1.default.getFirstSelectedBlock()) === null || _a === void 0 ? void 0 : _a.isInsideRepeater();
    var repeaterDataKeyComesFrom = (_c = (_b = blockController_1.default
        .getFirstSelectedBlock()) === null || _b === void 0 ? void 0 : _b.getRepeaterParent()) === null || _c === void 0 ? void 0 : _c.getDataKey("comesFrom");
    function processObject(obj, prefix, resultArray) {
        if (prefix === void 0) { prefix = ""; }
        if (resultArray === void 0) { resultArray = []; }
        if (!obj || typeof obj !== "object") {
            return;
        }
        Object.entries(obj).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var path = prefix ? "".concat(prefix, ".").concat(key) : key;
            if (Array.isArray(value)) {
                resultArray.push(path);
            }
            else if (typeof value === "object" && value !== null) {
                processObject(value, path, resultArray);
            }
        });
    }
    processObject(pageDataCollectionObject, "", repeatablePageDataKeys);
    processObject(componentDataCollectionObject, "", repeatableComponentDataKeys);
    var isPropsBasedRepeater = isInsideRepeater && repeaterDataKeyComesFrom == "props";
    var repeatableProps = [];
    var propsOfComponentRoot = (_e = (_d = blockController_1.default.getFirstSelectedBlock()) === null || _d === void 0 ? void 0 : _d.getComponentRoot()) === null || _e === void 0 ? void 0 : _e.getBlockProps();
    if (propsOfComponentRoot && !isPropsBasedRepeater) {
        Object.entries(propsOfComponentRoot).forEach(function (_a) {
            var _b, _c;
            var key = _a[0], value = _a[1];
            if (value.isStandard && (((_b = value.propOptions) === null || _b === void 0 ? void 0 : _b.type) == "array" || ((_c = value.propOptions) === null || _c === void 0 ? void 0 : _c.type) == "object")) {
                repeatableProps.push(key);
            }
        });
    }
    repeatablePageDataKeys.forEach(function (item) {
        result.push({
            label: item,
            value: "".concat(item, "--dataScript"),
            prefix: (0, vue_1.h)("span", { class: "lucide-zap size-3", "aria-hidden": "true" }),
        });
    });
    repeatableComponentDataKeys.forEach(function (item) {
        result.push({
            label: item,
            value: "".concat(item, "--componentData"),
            prefix: (0, vue_1.h)("span", { class: "lucide-zap size-3", "aria-hidden": "true" }),
        });
    });
    repeatableProps.forEach(function (prop) {
        result.push({
            label: prop,
            value: "".concat(prop, "--props"),
            prefix: (0, vue_1.h)("span", { class: "lucide-git-commit size-3", "aria-hidden": "true" }),
        });
    });
    return result;
});
var collectionOptions = [
    {
        component: Autocomplete_vue_1.default,
        getProps: function () {
            return {
                label: "Key",
                modelValue: blockController_1.default.getDataKey("key"),
                placeholder: "Select a collection",
                options: keyOptions.value,
            };
        },
        searchKeyWords: "Collection, Repeater, Dynamic Collection, Dynamic Repeater",
        events: {
            "update:modelValue": function (selectedOption) {
                if (!selectedOption) {
                    blockController_1.default.setDataKey("key", null);
                    return;
                }
                var value = selectedOption.split("--").slice(0, -1).join("--");
                var comesFrom = selectedOption.split("--").slice(-1)[0];
                blockController_1.default.setDataKey("key", value);
                blockController_1.default.setDataKey("comesFrom", comesFrom);
            },
        },
    },
];
exports.default = {
    name: "Collection",
    properties: collectionOptions,
    condition: function () { return blockController_1.default.isRepeater(); },
};
//# sourceMappingURL=CollectionOptionsSection.js.map