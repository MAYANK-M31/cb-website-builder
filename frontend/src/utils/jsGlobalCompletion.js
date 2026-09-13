"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jsCompletionsFromGlobalScope;
var language_1 = require("@codemirror/language");
var BOOST_INDEX = 99;
function getAllProperties(obj) {
    var props = new Set();
    var current = obj;
    while (current && current !== Object.prototype) {
        // Get all properties from current level
        Object.getOwnPropertyNames(current).forEach(function (prop) {
            props.add(prop);
        });
        // Move up the prototype chain
        current = Object.getPrototypeOf(current);
    }
    return Array.from(props);
}
// Usage
var allDocumentProps = getAllProperties(document);
var completePropertyAfter = ["PropertyName", ".", "?.", "["];
var dontCompleteIn = [
    "TemplateString",
    "LineComment",
    "BlockComment",
    "VariableDefinition",
    "PropertyDefinition",
];
function jsCompletionsFromGlobalScope(context, blockProps) {
    var _a;
    if (blockProps === void 0) { blockProps = {}; }
    var nodeBefore = (0, language_1.syntaxTree)(context.state).resolveInner(context.pos, -1);
    var hasProps = Object.keys(blockProps).length > 0;
    if (completePropertyAfter.includes(nodeBefore.name) && ((_a = nodeBefore.parent) === null || _a === void 0 ? void 0 : _a.name) == "MemberExpression") {
        var object = nodeBefore.parent.getChild("Expression");
        if ((object === null || object === void 0 ? void 0 : object.name) == "this") {
            return completeProperties(nodeBefore.from, document.body);
        }
        if ((object === null || object === void 0 ? void 0 : object.name) == "VariableName") {
            var from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from;
            var variableName = context.state.sliceDoc(object.from, object.to);
            if (variableName === "props") {
                if (!hasProps)
                    return null;
                var isBracket_1 = nodeBefore.name === "[";
                return {
                    from: context.pos,
                    options: Object.keys(blockProps).map(function (key) {
                        if (isBracket_1) {
                            return {
                                label: key,
                                displayLabel: "".concat(key),
                                apply: "\"".concat(key, "\""),
                                type: "property",
                            };
                        }
                        return { label: key, type: "property" };
                    }),
                };
            }
            if (typeof window[variableName] == "object")
                return completeProperties(from, window[variableName]);
        }
    }
    else if (nodeBefore.name == "VariableName") {
        var extraKeys = __spreadArray([], (hasProps ? ["props"] : []), true);
        return completeProperties(nodeBefore.from, window, extraKeys);
    }
    else if (context.explicit && !dontCompleteIn.includes(nodeBefore.name)) {
        var extraKeys = __spreadArray([], (hasProps ? ["props"] : []), true);
        return completeProperties(context.pos, window, extraKeys);
    }
    return null;
}
function completeProperties(from, object, extraKeys) {
    var options = [];
    for (var _i = 0, _a = getAllProperties(object); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        options.push({
            label: name_1,
            type: typeof object[name_1] == "function" ? "function" : "variable",
        });
    }
    if (extraKeys) {
        for (var _b = 0, extraKeys_1 = extraKeys; _b < extraKeys_1.length; _b++) {
            var key = extraKeys_1[_b];
            options.push({
                label: key,
                type: "variable",
                boost: BOOST_INDEX,
            });
        }
    }
    return {
        from: from,
        options: options,
        validFor: /^[\w$]*$/,
    };
}
//# sourceMappingURL=jsGlobalCompletion.js.map