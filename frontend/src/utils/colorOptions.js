"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorVariableOptions = getColorVariableOptions;
var autocompleteOptions_1 = require("@/utils/autocompleteOptions");
var useBuilderToken_1 = require("@/utils/useBuilderToken");
var vue_1 = require("vue");
function getColorVariableOptions(query, variables, resolveVariableValue, isDark, onEdit) {
    // strip var(--...) syntax, keep the rest of the query as typed
    var processedQuery = query
        .replace(/^\s*(var\()?\s*(--)?/, "")
        .replace(/\)\s*$/, "")
        .trim();
    // a colour literal is the current value, not a token search: it can never match a
    // token name, and filtering by it would leave nothing to pick from
    if (/^(#|rgba?\(|hsla?\()/i.test(processedQuery))
        processedQuery = "";
    var colorTokens = variables.filter(function (builderToken) { return (0, useBuilderToken_1.tokenType)(builderToken) === "Color"; });
    var searchableLabel = function (builderToken) {
        return "".concat(builderToken.token_name || "", " ").concat(builderToken.group || "");
    };
    // the group name is searchable along with the token name
    var searchableOptions = colorTokens
        .map(function (builderToken) { return ({
        label: searchableLabel(builderToken),
        variable: builderToken,
    }); })
        // alphabetical, so the options around a match are related ones
        .sort(function (a, b) { return (a.variable.token_name || "").localeCompare(b.variable.token_name || ""); });
    // the query is the current selection when it is the var() value or the
    // token's display name (what ColorInput shows on focus): use its full
    // label so filterOptions windows the list around it
    var normalizedQuery = processedQuery.toLowerCase();
    var selectedToken = colorTokens.find(function (t) { return query.trim() === "var(--".concat(t.name, ")") || (t.token_name || "").toLowerCase() === normalizedQuery; });
    if (selectedToken)
        processedQuery = searchableLabel(selectedToken);
    return (0, autocompleteOptions_1.filterOptions)(searchableOptions, processedQuery).map(function (_a) {
        var builderToken = _a.variable;
        var varName = "var(--".concat(builderToken.name, ")");
        var resolvedLightColor = resolveVariableValue(varName);
        var resolvedDarkColor = resolveVariableValue(varName, true);
        return {
            label: "".concat(builderToken.token_name || ""),
            value: varName,
            prefix: (0, vue_1.shallowRef)((0, vue_1.defineComponent)({
                setup: function () {
                    return function () {
                        return (0, vue_1.h)("div", {
                            class: "h-4 w-4 rounded shadow-sm border border-outline-gray-1 flex-shrink-0",
                            style: { background: isDark ? resolvedDarkColor : resolvedLightColor },
                        });
                    };
                },
            })),
            suffix: !builderToken.is_standard && onEdit
                ? (0, vue_1.shallowRef)((0, vue_1.defineComponent)({
                    setup: function () {
                        return function () {
                            return (0, vue_1.h)("Button", {
                                class: "hidden group-hover:inline-block",
                                onClick: function (e) {
                                    onEdit(builderToken);
                                },
                            }, "Edit");
                        };
                    },
                }))
                : undefined,
        };
    });
}
//# sourceMappingURL=colorOptions.js.map