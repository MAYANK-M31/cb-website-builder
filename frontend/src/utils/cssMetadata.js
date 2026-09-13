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
exports.isValidCSSPropertyName = exports.getCSSValueOptions = exports.getCSSPropertyOptions = exports.getCSSPropertyControl = void 0;
var Autocomplete_vue_1 = __importDefault(require("@/components/Controls/Autocomplete.vue"));
var ColorInput_vue_1 = __importDefault(require("@/components/Controls/ColorInput.vue"));
var RangeInput_vue_1 = __importDefault(require("@/components/Controls/RangeInput.vue"));
var cssPropertyMetadata_json_1 = __importDefault(require("@/data/cssPropertyMetadata.json"));
var autocompleteOptions_1 = require("@/utils/autocompleteOptions");
var unitOptions_1 = require("@/utils/unitOptions");
var MAX_SEARCH_RESULTS = 50;
var metadata = cssPropertyMetadata_json_1.default;
var baselineCSSProperties = Object.keys(metadata).filter(function (property) { return metadata[property].baseline; });
var cssPropertyNamePattern = /^-?[a-z][a-z0-9-]*$/;
var isValidCSSPropertyName = function (property) { return cssPropertyNamePattern.test(property); };
exports.isValidCSSPropertyName = isValidCSSPropertyName;
var getKeywordOptions = function (property) { var _a; return (((_a = metadata[property]) === null || _a === void 0 ? void 0 : _a.keywords) || []).map(function (keyword) { return ({ label: keyword, value: keyword }); }); };
var keywordControl = function (property) { return ({
    component: Autocomplete_vue_1.default,
    options: getKeywordOptions(property),
}); };
// properties whose inferred control is not the one the editor wants
var propertySpecificControls = {
    "z-index": function () { return ({
        component: Autocomplete_vue_1.default,
        options: getKeywordOptions("z-index"),
        enableSlider: true,
        minValue: -100,
    }); },
    opacity: function () { return ({
        component: RangeInput_vue_1.default,
        enableSlider: false,
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 1,
    }); },
    rotate: function () { return ({
        enableSlider: true,
        unitOptions: unitOptions_1.ROTATION_UNIT_OPTIONS,
        minValue: -360,
        maxValue: 360,
        defaultValue: 0,
    }); },
};
var controlsByKind = {
    color: function () { return ({ component: ColorInput_vue_1.default, controlAttrs: { popoverOffset: 120 } }); },
    length: function (property) { return (__assign(__assign({}, keywordControl(property)), { enableSlider: true, unitOptions: property.includes("border") ? unitOptions_1.BORDER_UNIT_OPTIONS : unitOptions_1.DIMENSION_UNIT_OPTIONS })); },
    integer: function (property) { return (__assign(__assign({}, keywordControl(property)), { enableSlider: true })); },
    number: function (property) { return (__assign(__assign({}, keywordControl(property)), { enableSlider: true, unitOptions: unitOptions_1.BOX_UNIT_OPTIONS })); },
    keyword: function (property) { var _a; return (((_a = metadata[property]) === null || _a === void 0 ? void 0 : _a.keywords) ? keywordControl(property) : {}); },
};
var controlCache = new Map();
var buildControl = function (property) {
    var _a;
    var buildSpecificControl = propertySpecificControls[property];
    if (buildSpecificControl)
        return buildSpecificControl();
    var kind = (_a = metadata[property]) === null || _a === void 0 ? void 0 : _a.kind;
    return kind ? controlsByKind[kind](property) : {};
};
var getCSSPropertyControl = function (property) {
    if (!controlCache.has(property)) {
        controlCache.set(property, buildControl(property));
    }
    return controlCache.get(property);
};
exports.getCSSPropertyControl = getCSSPropertyControl;
var normalizeSearchText = function (value) { return value.toLowerCase().replace(/[^a-z0-9]/g, ""); };
var getFuzzySearchScore = function (query, property) {
    var normalizedQuery = query.toLowerCase();
    var compactQuery = normalizeSearchText(query);
    var compactProperty = normalizeSearchText(property);
    if (!compactQuery)
        return 0;
    if (property.includes(normalizedQuery))
        return property.indexOf(normalizedQuery);
    if (compactProperty.includes(compactQuery))
        return 25 + compactProperty.indexOf(compactQuery);
    var score = 100;
    var previousIndex = -1;
    for (var _i = 0, compactQuery_1 = compactQuery; _i < compactQuery_1.length; _i++) {
        var character = compactQuery_1[_i];
        var index = compactProperty.indexOf(character, previousIndex + 1);
        if (index === -1)
            return null;
        var gap = index - previousIndex - 1;
        score += gap * 2;
        previousIndex = index;
    }
    return score + compactProperty.length - compactQuery.length;
};
var getCSSPropertyOptions = function (query, excludedProperties) {
    if (excludedProperties === void 0) { excludedProperties = new Set(); }
    var normalizedQuery = query.trim().toLowerCase();
    var availableProperties = baselineCSSProperties.filter(function (property) { return !excludedProperties.has(property); });
    if (!normalizedQuery) {
        return availableProperties
            .slice(0, MAX_SEARCH_RESULTS)
            .map(function (property) { return ({ label: property, value: property }); });
    }
    return availableProperties
        .map(function (property) { return ({ property: property, score: getFuzzySearchScore(normalizedQuery, property) }); })
        .filter(function (result) { return result.score !== null; })
        .sort(function (a, b) { return a.score - b.score || a.property.localeCompare(b.property); })
        .slice(0, MAX_SEARCH_RESULTS)
        .map(function (_a) {
        var property = _a.property;
        return ({ label: property, value: property });
    });
};
exports.getCSSPropertyOptions = getCSSPropertyOptions;
var getCSSValueOptions = function (property, query) {
    return (0, autocompleteOptions_1.filterOptions)(getKeywordOptions(property), query, MAX_SEARCH_RESULTS);
};
exports.getCSSValueOptions = getCSSValueOptions;
//# sourceMappingURL=cssMetadata.js.map