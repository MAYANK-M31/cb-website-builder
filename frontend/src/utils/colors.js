"use strict";
// Color conversion utilities (hex <-> HSV <-> rgb).
// Extracted from helpers.ts; re-exported there for backwards compatibility.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexToHSV = HexToHSV;
exports.HSVToHex = HSVToHex;
exports.getRGB = getRGB;
function HexToHSV(color) {
    // Remove hash and normalize length
    var hex = color.replace("#", "").trim();
    // Expand short hex (#abc -> #aabbcc)
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map(function (c) { return c + c; })
            .join("");
    }
    // Extract alpha from 8-digit hex (#RRGGBBAA)
    var a = 100;
    if (/^[0-9a-fA-F]{8}$/.test(hex)) {
        a = Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100);
        hex = hex.slice(0, 6);
    }
    // If not valid hex, return black
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
        return { h: 0, s: 0, v: 0, a: 100 };
    }
    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var v = max / 255;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    var h = 0;
    if (d !== 0) {
        if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0);
        }
        else if (max === g) {
            h = (b - r) / d + 2;
        }
        else {
            h = (r - g) / d + 4;
        }
        h *= 60;
    }
    return { h: h, s: s, v: v, a: a };
}
function HSVToHex(h, s, v, a) {
    if (a === void 0) { a = 100; }
    s /= 100;
    v /= 100;
    h /= 360;
    var r = 0, g = 0, b = 0;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            (r = v), (g = t), (b = p);
            break;
        case 1:
            (r = q), (g = v), (b = p);
            break;
        case 2:
            (r = p), (g = v), (b = t);
            break;
        case 3:
            (r = p), (g = q), (b = v);
            break;
        case 4:
            (r = t), (g = p), (b = v);
            break;
        case 5:
            (r = v), (g = p), (b = q);
            break;
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    var hex = "#".concat([r, g, b].map(function (x) { return x.toString(16).padStart(2, "0"); }).join(""));
    var alphaByte = Math.round((a / 100) * 255);
    if (alphaByte < 255) {
        return "".concat(hex).concat(alphaByte.toString(16).padStart(2, "0"));
    }
    return hex;
}
function RGBToHex(rgb) {
    var _a = rgb
        .replace("rgb(", "")
        .replace(")", "")
        .split(",")
        .map(function (x) { return parseInt(x); }), r = _a[0], g = _a[1], b = _a[2];
    return "#".concat([r, g, b].map(function (x) { return x.toString(16).padStart(2, "0"); }).join(""));
}
function getRGB(color) {
    if (!color) {
        return null;
    }
    if (color.startsWith("rgba")) {
        var parts = color
            .replace("rgba(", "")
            .replace(")", "")
            .split(",")
            .map(function (x) { return x.trim(); });
        var _a = parts.map(function (x) { return parseInt(x); }), r = _a[0], g = _a[1], b = _a[2];
        var alphaHex = Math.round(parseFloat(parts[3]) * 255)
            .toString(16)
            .padStart(2, "0");
        return "#".concat([r, g, b].map(function (x) { return x.toString(16).padStart(2, "0"); }).join("")).concat(alphaHex);
    }
    if (color.startsWith("rgb")) {
        return RGBToHex(color);
    }
    else if (!color.startsWith("#") && color.match(/\b[a-fA-F0-9]{3,6}\b/g)) {
        return "#".concat(color);
    }
    return color;
}
//# sourceMappingURL=colors.js.map