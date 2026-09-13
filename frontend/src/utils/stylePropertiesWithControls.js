"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStylePropertyWithControls = exports.getStylePropertiesWithoutControls = exports.getStylePropertiesWithControls = void 0;
var BlockPropertySections_1 = require("@/components/BlockPropertySections");
var cssMetadata_1 = require("@/utils/cssMetadata");
var helpers_1 = require("@/utils/helpers");
var getSectionProperties = function (section) {
    return typeof section.properties === "function" ? section.properties() : section.properties;
};
var addSectionProperties = function (section, properties) {
    getSectionProperties(section).forEach(function (property) {
        var _a, _b;
        (_a = property.usedStyleProperties) === null || _a === void 0 ? void 0 : _a.forEach(function (styleProperty) { return properties.add(styleProperty); });
        // descriptors may read block state that is unavailable here; usedStyleProperties covers those
        var props;
        try {
            props = (_b = property.getProps) === null || _b === void 0 ? void 0 : _b.call(property);
        }
        catch (_c) {
            return;
        }
        var propertyKey = (props === null || props === void 0 ? void 0 : props.propertyKey) || (props === null || props === void 0 ? void 0 : props.property);
        if (typeof propertyKey === "string")
            properties.add((0, helpers_1.toCSSProperty)(propertyKey));
    });
};
var cachedStyleProperties = null;
// properties owned by a dedicated Builder control, so More Styles must not offer them
var getStylePropertiesWithControls = function () {
    if (!cachedStyleProperties) {
        cachedStyleProperties = new Set();
        BlockPropertySections_1.sections.forEach(function (section) { return addSectionProperties(section, cachedStyleProperties); });
    }
    return cachedStyleProperties;
};
exports.getStylePropertiesWithControls = getStylePropertiesWithControls;
var isStylePropertyWithControls = function (property) { return getStylePropertiesWithControls().has(property); };
exports.isStylePropertyWithControls = isStylePropertyWithControls;
// properties on a block that only More Styles can edit
var getStylePropertiesWithoutControls = function (styleMap) {
    var properties = new Set();
    Object.keys(styleMap).forEach(function (style) {
        var property = (0, helpers_1.stripStatePrefix)((0, helpers_1.toCSSProperty)(style));
        if (!isStylePropertyWithControls(property) && (0, cssMetadata_1.isValidCSSPropertyName)(property))
            properties.add(property);
    });
    return properties;
};
exports.getStylePropertiesWithoutControls = getStylePropertiesWithoutControls;
//# sourceMappingURL=stylePropertiesWithControls.js.map