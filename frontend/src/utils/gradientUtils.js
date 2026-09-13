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
exports.parseGradient = parseGradient;
exports.stringifyGradient = stringifyGradient;
function parseGradient(gradientStr) {
    if (!gradientStr || !gradientStr.includes("gradient"))
        return null;
    var typeMatch = gradientStr.match(/^(linear|radial)-gradient/);
    if (!typeMatch)
        return null;
    var type = (typeMatch[0] + "");
    var content = gradientStr.substring(gradientStr.indexOf("(") + 1, gradientStr.lastIndexOf(")"));
    var parts = tokenizeGradientContent(content);
    var angle = type === "linear-gradient" ? "180deg" : "circle";
    var stopsStartIdx = 0;
    if (parts[0]) {
        var firstPart = parts[0].trim();
        var isAngle = /^(-?\d+(\.\d+)?deg|to\s+(top|bottom|left|right)(\s+(top|bottom|left|right))?)/i.test(firstPart);
        var isRadialConfig = /^(circle|ellipse|at\s+|closest-side|farthest-side|closest-corner|farthest-corner)/i.test(firstPart);
        if (isAngle || isRadialConfig) {
            angle = firstPart;
            stopsStartIdx = 1;
        }
    }
    var stops = [];
    for (var i = stopsStartIdx; i < parts.length; i++) {
        var part = parts[i].trim();
        if (!part)
            continue;
        var stopMatch = part.match(/(.+?)\s+(-?[0-9.]+%|-?[0-9.]+px)?$/);
        if (stopMatch && stopMatch[2]) {
            var color = stopMatch[1].trim();
            var posStr = stopMatch[2].trim();
            var position = 0;
            if (posStr.endsWith("%")) {
                position = parseFloat(posStr);
            }
            else {
                // Fallback for px or other units - simple linear distribution for now
                position = (i - stopsStartIdx) * (100 / (parts.length - stopsStartIdx - 1 || 1));
            }
            stops.push({ color: color, position: position });
        }
        else {
            // Just color or invalid match
            stops.push({
                color: part,
                position: (i - stopsStartIdx) * (100 / (parts.length - stopsStartIdx - 1 || 1)),
            });
        }
    }
    return { type: type, angle: angle, stops: stops };
}
function tokenizeGradientContent(content) {
    var tokens = [];
    var current = "";
    var parenDepth = 0;
    for (var i = 0; i < content.length; i++) {
        var char = content[i];
        if (char === "(")
            parenDepth++;
        if (char === ")")
            parenDepth--;
        if (char === "," && parenDepth === 0) {
            tokens.push(current.trim());
            current = "";
        }
        else {
            current += char;
        }
    }
    if (current)
        tokens.push(current.trim());
    return tokens;
}
function stringifyGradient(gradient) {
    var stopsStr = __spreadArray([], gradient.stops, true).sort(function (a, b) { return a.position - b.position; })
        .map(function (s) { return "".concat(s.color, " ").concat(s.position, "%"); })
        .join(", ");
    return "".concat(gradient.type, "(").concat(gradient.angle, ", ").concat(stopsStr, ")");
}
//# sourceMappingURL=gradientUtils.js.map