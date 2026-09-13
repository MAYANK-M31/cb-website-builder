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
var blockController_1 = __importDefault(require("@/utils/blockController"));
var ArrayInput_vue_1 = __importDefault(require("../ArrayInput.vue"));
var BasePropertyControl_vue_1 = __importDefault(require("../Controls/BasePropertyControl.vue"));
var ColorInput_vue_1 = __importDefault(require("../Controls/ColorInput.vue"));
var OptionToggle_vue_1 = __importDefault(require("../Controls/OptionToggle.vue"));
var ImageUploadInput_vue_1 = __importDefault(require("../ImageUploadInput.vue"));
var ObjectInput_vue_1 = __importDefault(require("../ObjectInput.vue"));
var canvasStore_js_1 = __importDefault(require("@/stores/canvasStore.js"));
var componentMap = {
    array: ArrayInput_vue_1.default,
    object: ObjectInput_vue_1.default,
};
var getPropsMap = function (propName, propDetails) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var type = ((_a = propDetails.propOptions) === null || _a === void 0 ? void 0 : _a.type) || "string";
    var map = {};
    switch (type) {
        case "boolean":
            map = {
                component: OptionToggle_vue_1.default,
                options: [
                    { label: ((_c = (_b = propDetails.propOptions) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.trueLabel) || "True", value: true },
                    { label: ((_e = (_d = propDetails.propOptions) === null || _d === void 0 ? void 0 : _d.options) === null || _e === void 0 ? void 0 : _e.falseLabel) || "False", value: false },
                ],
            };
            break;
        case "select":
            map = {
                type: "select",
                options: ((_h = (_g = (_f = propDetails.propOptions) === null || _f === void 0 ? void 0 : _f.options) === null || _g === void 0 ? void 0 : _g.options) === null || _h === void 0 ? void 0 : _h.map(function (item) { return ({
                    label: item,
                    value: item,
                }); })) || [],
            };
            break;
        case "image":
            map = {
                component: ImageUploadInput_vue_1.default,
                imageURL: blockController_1.default.getBlockProps()[propName].value,
                imageFit: ((_k = (_j = propDetails.propOptions) === null || _j === void 0 ? void 0 : _j.options) === null || _k === void 0 ? void 0 : _k.imageFit) ||
                    ((_m = (_l = propDetails.propOptions) === null || _l === void 0 ? void 0 : _l.options) === null || _m === void 0 ? void 0 : _m.defaultImageFit),
            };
            break;
        case "color":
            map = {
                component: ColorInput_vue_1.default,
            };
            break;
    }
    map = __assign({ label: propDetails.label || propName, enableStates: false, allowDynamicValue: true, dynamicValueFilterOptions: {
            excludeOwnProps: true,
        }, getDynamicValue: function () {
            if (propDetails.isDynamic) {
                return {
                    key: propDetails.value,
                    comesFrom: propDetails.comesFrom,
                };
            }
        }, setDynamicValue: function (key, comesFrom) {
            blockController_1.default.setBlockProp(propName, {
                value: key || "",
                isDynamic: !!key,
                comesFrom: key ? comesFrom : null,
            });
        }, setModelValue: function (value) {
            if (value === "")
                value = null;
            blockController_1.default.setBlockProp(propName, { value: value });
        }, getModelValue: function () {
            var _a;
            var value = (_a = blockController_1.default.getFirstSelectedBlock().getBlockProps()[propName]) === null || _a === void 0 ? void 0 : _a.value;
            return value;
        }, getPlaceholder: function () {
            var _a, _b;
            return ((_b = (_a = propDetails.propOptions) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.defaultValue) || null;
        }, defaultValue: type == "boolean"
            ? ((_p = (_o = propDetails.propOptions) === null || _o === void 0 ? void 0 : _o.options) === null || _p === void 0 ? void 0 : _p.defaultValue) == "true"
            : (_r = (_q = propDetails.propOptions) === null || _q === void 0 ? void 0 : _q.options) === null || _r === void 0 ? void 0 : _r.defaultValue }, map);
    return map;
};
var getEventsMap = function (propName, propDetails) {
    var _a;
    var events = {};
    var type = ((_a = propDetails.propOptions) === null || _a === void 0 ? void 0 : _a.type) || "string";
    switch (type) {
        case "image":
            events = {
                "update:imageURL": function (val) { return blockController_1.default.setBlockProp(propName, { value: val }); },
                "update:imageFit": function (val) {
                    var _a;
                    return blockController_1.default.setBlockProp(propName, {
                        propOptions: { options: __assign(__assign({}, (_a = propDetails.propOptions) === null || _a === void 0 ? void 0 : _a.options), { imageFit: val }) },
                    });
                },
            };
            break;
    }
    return events;
};
var getStandardProps = function (allProps) {
    var standardProps = {};
    for (var _i = 0, _a = Object.entries(allProps || {}); _i < _a.length; _i++) {
        var _b = _a[_i], propKey = _b[0], propDetails = _b[1];
        if (propDetails.isStandard) {
            standardProps[propKey] = propDetails;
        }
    }
    return standardProps;
};
var getStandardPropsInputSection = function () {
    var _a;
    var standardProps = getStandardProps(blockController_1.default.getBlockProps());
    var sections = [];
    var _loop_1 = function (propKey, propDetails) {
        var propType = (_a = propDetails.propOptions) === null || _a === void 0 ? void 0 : _a.type;
        var component = (propType === "array" || propType === "object" ? componentMap[propType] : undefined) ||
            BasePropertyControl_vue_1.default;
        var getProps = function () {
            var props = getPropsMap(propKey, propDetails);
            return props;
        };
        var events = getEventsMap(propKey, propDetails);
        sections.push({
            component: component,
            getProps: getProps,
            events: events,
            searchKeyWords: [propKey, propDetails.label].join(", "),
        });
    };
    for (var _i = 0, _b = Object.entries(standardProps); _i < _b.length; _i++) {
        var _c = _b[_i], propKey = _c[0], propDetails = _c[1];
        _loop_1(propKey, propDetails);
    }
    return sections;
};
exports.default = {
    name: "Block Options",
    properties: getStandardPropsInputSection,
    collapsed: false,
    condition: function () {
        return (0, canvasStore_js_1.default)().editingMode != "fragment" &&
            Object.keys(getStandardProps(blockController_1.default.getBlockProps())).length > 0;
    },
};
//# sourceMappingURL=StandardPropsInputSection.js.map