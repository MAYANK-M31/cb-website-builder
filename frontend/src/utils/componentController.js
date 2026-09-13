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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var useLatestRequest_1 = require("@/composables/useLatestRequest");
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var componentStore_1 = __importDefault(require("@/stores/componentStore"));
var frappe_ui_1 = require("frappe-ui");
var vue_1 = require("vue");
var helpers_1 = require("./helpers");
var runLatestRequest = (0, useLatestRequest_1.useLatestRequest)().run;
var EMPTY_DRAFT = {
    component_name: "",
    component_data_script: "",
    component_data_preview: {},
};
var canvasStore = (0, canvasStore_1.default)();
var componentStore = (0, componentStore_1.default)();
var currentComponentId = (0, vue_1.computed)(function () { var _a; return canvasStore.fragmentData.fragmentType === "component" ? (_a = canvasStore.fragmentData.fragmentId) !== null && _a !== void 0 ? _a : "" : ""; });
var componentDocDraft = (0, vue_1.reactive)(__assign({}, EMPTY_DRAFT));
function markCanvasDirty(dirty) {
    var _a;
    if (dirty === void 0) { dirty = true; }
    (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.toggleDirty(dirty);
}
function cloneComponentDocFields(doc, preview) {
    var _a;
    if (preview === void 0) { preview = {}; }
    return {
        component_data_script: (_a = doc.component_data_script) !== null && _a !== void 0 ? _a : "",
        component_data_preview: (0, helpers_1.parseJSONWithFallback)(preview, {}),
    };
}
function getOriginalDoc() {
    var componentId = currentComponentId.value;
    if (!componentId)
        return null;
    return componentStore.getComponent(componentId);
}
function loadDraftFromOriginal() {
    var _a, _b, _c, _d;
    var original = getOriginalDoc();
    if (!original) {
        Object.assign(componentDocDraft, EMPTY_DRAFT);
        return;
    }
    var componentId = currentComponentId.value;
    var preview = (_d = (_a = componentStore.componentData[componentId]) === null || _a === void 0 ? void 0 : _a[(_c = (_b = canvasStore.fragmentData.block) === null || _b === void 0 ? void 0 : _b.blockId) !== null && _c !== void 0 ? _c : ""]) !== null && _d !== void 0 ? _d : {};
    Object.assign(componentDocDraft, cloneComponentDocFields(original, preview));
}
var componentDataPreview = (0, vue_1.computed)(function () {
    var _a;
    if (!currentComponentId.value)
        return {};
    return (_a = componentDocDraft.component_data_preview) !== null && _a !== void 0 ? _a : {};
});
var componentProps = (0, vue_1.computed)(function () {
    var _a, _b;
    if (!currentComponentId.value)
        return {};
    return (_b = (_a = canvasStore.fragmentData.block) === null || _a === void 0 ? void 0 : _a.props) !== null && _b !== void 0 ? _b : {};
});
var componentDataScript = (0, vue_1.computed)(function () {
    var _a;
    if (!currentComponentId.value)
        return "";
    return (_a = componentDocDraft.component_data_script) !== null && _a !== void 0 ? _a : "";
});
var componentController = {
    currentComponentId: currentComponentId,
    componentDataPreview: componentDataPreview,
    componentProps: componentProps,
    componentDataScript: componentDataScript,
    getComponentDataScript: function () { return componentDataScript.value; },
    setComponentDataScript: function (script) {
        if (!currentComponentId.value)
            return;
        componentDocDraft.component_data_script = script;
        markCanvasDirty(true);
    },
    getComponentDataPreview: function () { return componentDataPreview.value; },
    resetComponentDoc: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loadDraftFromOriginal();
                    return [4 /*yield*/, componentController.setComponentDataPreview()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    applyComponentDoc: function () {
        componentStore.setComponentDraft(currentComponentId.value, componentDocDraft);
    },
    setComponentDataPreview: function () { return __awaiter(void 0, void 0, void 0, function () {
        var componentId, props, script, requestKey, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    componentId = currentComponentId.value;
                    if (!componentId)
                        return [2 /*return*/];
                    props = Object.entries(componentProps.value).reduce(function (acc, _a) {
                        var _b, _c, _d;
                        var key = _a[0], value = _a[1];
                        acc[key] = (_b = value.value) !== null && _b !== void 0 ? _b : (_d = (_c = value.propOptions) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.defaultValue;
                        return acc;
                    }, {});
                    script = (_a = componentDocDraft.component_data_script) !== null && _a !== void 0 ? _a : "";
                    requestKey = "".concat(componentId, "::preview");
                    return [4 /*yield*/, runLatestRequest(requestKey, function () {
                            return (0, frappe_ui_1.createResource)({
                                url: "builder.api.get_component_data",
                                method: "POST",
                                auto: false,
                            })
                                .submit({
                                component_name: componentId,
                                props: JSON.stringify(props),
                                script: script,
                            })
                                .then(function (data) { return data !== null && data !== void 0 ? data : {}; })
                                .catch(function (e) {
                                console.error("Failed to execute component data script:", e.message);
                                return {};
                            });
                        })];
                case 1:
                    result = _b.sent();
                    if (result.stale || componentId !== currentComponentId.value)
                        return [2 /*return*/];
                    componentDocDraft.component_data_preview = result.value;
                    return [2 /*return*/];
            }
        });
    }); },
};
(0, vue_1.watch)(currentComponentId, function (componentId, oldComponentId) {
    if (componentId) {
        loadDraftFromOriginal();
    }
    else {
        Object.assign(componentDocDraft, EMPTY_DRAFT);
    }
    if (oldComponentId) {
        componentStore.deleteComponentDraft(oldComponentId);
    }
}, { immediate: true });
(0, vue_1.watch)([currentComponentId, componentProps, componentDataScript, function () { return canvasStore.editingMode; }], function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (canvasStore.editingMode != "fragment")
                    return [2 /*return*/];
                if (!currentComponentId.value) return [3 /*break*/, 2];
                return [4 /*yield*/, componentController.setComponentDataPreview()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); }, { deep: true, immediate: true });
(0, vue_1.watch)([currentComponentId, function () { return canvasStore.editingMode; }], function () {
    if (canvasStore.editingMode != "fragment")
        return;
    markCanvasDirty(false);
}, { immediate: true });
exports.default = componentController;
//# sourceMappingURL=componentController.js.map