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
exports.default = customPythonCompletions;
var language_1 = require("@codemirror/language");
var completePropertyAfter = ["PropertyName", ".", "?.", "[", "("];
var dontCompleteIn = [
    "TemplateString",
    "LineComment",
    "BlockComment",
    "VariableDefinition",
    "PropertyDefinition",
];
var BOOST_INDEX = 99;
// Create completion source for custom objects
// Currently only two levels of nesting is supported, eg: frappe.session.user
function customPythonCompletions(context, customCompletions, blockProps) {
    var _a, _b;
    if (blockProps === void 0) { blockProps = {}; }
    var nodeBefore = (0, language_1.syntaxTree)(context.state).resolveInner(context.pos, -1);
    var hasProps = Object.keys(blockProps).length > 0;
    var propCompletions = {
        from: context.pos,
        options: Object.keys(blockProps).map(function (key) {
            return {
                label: key,
                displayLabel: "".concat(key),
                apply: "\"".concat(key, "\""),
                type: "property",
            };
        }),
    };
    if (nodeBefore.name === "(" && ((_a = nodeBefore.parent) === null || _a === void 0 ? void 0 : _a.name) === "ArgList") {
        var callExpression = nodeBefore.parent.parent;
        if ((callExpression === null || callExpression === void 0 ? void 0 : callExpression.name) === "CallExpression") {
            var memberExpr = callExpression.getChild("MemberExpression");
            if (memberExpr) {
                var object = memberExpr.getChild("Expression");
                var property = memberExpr.getChild("PropertyName");
                if ((object === null || object === void 0 ? void 0 : object.name) === "VariableName" && property) {
                    var objectName = context.state.sliceDoc(object.from, object.to);
                    var propertyName = context.state.sliceDoc(property.from, property.to);
                    if (objectName === "props" && propertyName === "get" && hasProps) {
                        return propCompletions;
                    }
                }
            }
        }
    }
    if (completePropertyAfter.includes(nodeBefore.name) && ((_b = nodeBefore.parent) === null || _b === void 0 ? void 0 : _b.name) == "MemberExpression") {
        var object = nodeBefore.parent.getChild("Expression");
        if ((object === null || object === void 0 ? void 0 : object.name) == "VariableName") {
            var from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from;
            var variableName = context.state.sliceDoc(object.from, object.to);
            if (variableName === "props") {
                var isBracket = nodeBefore.name === "[";
                if (!hasProps || !isBracket)
                    return null;
                return propCompletions;
            }
            if (Object.keys(customCompletions).includes(variableName)) {
                return completeProperties(from, customCompletions[variableName]);
            }
        }
        if ((object === null || object === void 0 ? void 0 : object.name) == "MemberExpression") {
            var from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from;
            var prevName = context.state.sliceDoc(object.from, object.to).split(".")[0];
            var variableName = context.state.sliceDoc(object.from, object.to).split(".")[1];
            if (Object.keys(customCompletions).includes(prevName) &&
                variableName in customCompletions[prevName] &&
                typeof customCompletions[prevName][variableName] == "object")
                return completeProperties(from, customCompletions[prevName][variableName]);
        }
    }
    else if (nodeBefore.name == "VariableName") {
        return {
            from: nodeBefore.from,
            options: __spreadArray([
                { label: "data", type: "class", boost: BOOST_INDEX },
                { label: "page", type: "class", boost: BOOST_INDEX }
            ], Object.keys(customCompletions).map(function (item) {
                return { label: item, type: "class" };
            }), true),
            validFor: /^[\w$]*$/,
        };
    }
    else if (context.explicit && !dontCompleteIn.includes(nodeBefore.name)) {
        return {
            from: nodeBefore.from,
            options: __spreadArray([
                { label: "data", type: "class", boost: BOOST_INDEX },
                { label: "page", type: "class", boost: BOOST_INDEX }
            ], Object.keys(customCompletions).map(function (item) {
                return { label: item, type: "class" };
            }), true),
            validFor: /^[\w$]*$/,
        };
    }
    return null;
}
function completeProperties(from, object) {
    var options = [];
    for (var _i = 0, _a = Object.keys(object); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        options.push({
            label: name_1,
            type: object[name_1]["type"] ? object[name_1]["type"] : "variable",
        });
    }
    return {
        from: from,
        options: options,
        validFor: /^[\w$]*$/,
    };
}
//# sourceMappingURL=pythonCustomCompletion.js.map