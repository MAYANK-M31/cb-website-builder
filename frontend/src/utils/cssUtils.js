"use strict";
// CSS value parsing / normalization helpers (px, spacing shorthand, background).
// Extracted from helpers.ts; re-exported there for backwards compatibility.
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAndSetBackground = void 0;
exports.addPxToNumber = addPxToNumber;
exports.collapseBoxShorthand = collapseBoxShorthand;
exports.expandBoxShorthand = expandBoxShorthand;
exports.extractNumberAndUnit = extractNumberAndUnit;
exports.getBoxSpacing = getBoxSpacing;
exports.getNumberFromPx = getNumberFromPx;
exports.normalizeValueWithUnits = normalizeValueWithUnits;
exports.removeDefaultUnit = removeDefaultUnit;
exports.setBoxSpacing = setBoxSpacing;
exports.shortenNumber = shortenNumber;
var numericValuePattern = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/i;
function getNumberFromPx(px) {
    if (!px) {
        return 0;
    }
    if (typeof px === "number") {
        return px;
    }
    var number = Number(px.replace("px", ""));
    if (isNaN(number)) {
        return 0;
    }
    return number;
}
function addPxToNumber(number, round) {
    if (round === void 0) { round = true; }
    number = round ? Math.round(number) : number;
    return "".concat(number, "px");
}
// Based on WebKit and Gecko parsing implementations
function parseBackground(cssText) {
    if (!cssText || typeof cssText !== "string") {
        return {};
    }
    // Tokenize the input preserving quoted strings and functions
    function tokenize(input) {
        var tokens = [];
        var current = "";
        var parenDepth = 0;
        var inQuote = null;
        for (var i_1 = 0; i_1 < input.length; i_1++) {
            var char = input[i_1];
            if (inQuote) {
                current += char;
                if (char === inQuote && input[i_1 - 1] !== "\\") {
                    inQuote = null;
                }
                continue;
            }
            if (char === '"' || char === "'") {
                current += char;
                inQuote = char;
                continue;
            }
            if (char === "(") {
                parenDepth++;
                current += char;
                continue;
            }
            if (char === ")") {
                parenDepth--;
                current += char;
                continue;
            }
            if (parenDepth > 0) {
                current += char;
                continue;
            }
            if (char === " " || char === "\t" || char === "\n") {
                if (current) {
                    tokens.push(current);
                    current = "";
                }
                continue;
            }
            current += char;
        }
        if (current) {
            tokens.push(current);
        }
        return tokens;
    }
    // Parse color value
    function isColor(value) {
        return (/^(#|rgb|hsl|[a-z]+$)/.test(value) &&
            !["center", "top", "bottom", "left", "right", "fixed", "local", "scroll", "contain", "repeat"].includes(value));
    }
    // Parse position values
    function isPosition(value) {
        return /^(center|top|bottom|left|right|[-\d.]+(%|px|em|rem|vh|vw)?)$/.test(value);
    }
    // Parse size values
    function isSize(value) {
        return /^(cover|contain|auto|[-\d.]+(%|px|em|rem|vh|vw)?)$/.test(value);
    }
    var result = {};
    var tokens = tokenize(cssText.trim());
    var i = 0;
    while (i < tokens.length) {
        var token = tokens[i];
        // Handle url() and gradients
        if (token.startsWith("url(") || token.includes("gradient")) {
            result.image = token;
            i++;
            continue;
        }
        // Handle color
        if (isColor(token)) {
            result.color = token;
            i++;
            continue;
        }
        // Handle position and size
        if (isPosition(token)) {
            var position = [token];
            // Check for second position value
            if (i + 1 < tokens.length && isPosition(tokens[i + 1])) {
                position.push(tokens[i + 1]);
                i++;
            }
            result.position = position.join(" ");
            // Check for size after '/'
            if (i + 2 < tokens.length && tokens[i + 1] === "/" && isSize(tokens[i + 2])) {
                var size = [tokens[i + 2]];
                if (i + 3 < tokens.length && isSize(tokens[i + 3])) {
                    size.push(tokens[i + 3]);
                    i++;
                }
                result.size = size.join(" ");
                i += 2;
            }
            i++;
            continue;
        }
        // Handle repeat
        if (/^(no-repeat|repeat(-[xy])?|round|space)$/.test(token)) {
            result.repeat = token;
            i++;
            continue;
        }
        // Handle attachment
        if (/^(fixed|local|scroll)$/.test(token)) {
            result.attachment = token;
            i++;
            continue;
        }
        // Handle origin/clip
        if (/^(border|padding|content)-box$/.test(token)) {
            if (!result.origin) {
                result.origin = token;
            }
            else {
                result.clip = token;
            }
            i++;
            continue;
        }
        i++;
    }
    return result;
}
var parseAndSetBackground = function (styles) {
    if (styles.background) {
        var _a = parseBackground(styles.background), color = _a.color, image = _a.image, position = _a.position, size = _a.size, repeat = _a.repeat;
        delete styles.background;
        if (color)
            styles.backgroundColor = color;
        if (image)
            styles.backgroundImage = image;
        if (position)
            styles.backgroundPosition = position;
        if (size)
            styles.backgroundSize = size;
        if (repeat)
            styles.backgroundRepeat = repeat;
    }
};
exports.parseAndSetBackground = parseAndSetBackground;
function shortenNumber(num) {
    if (num < 1000)
        return num.toString();
    var units = ["", "k", "M", "B", "T"];
    var order = Math.floor(Math.log10(num) / 3);
    var unitname = units[order];
    var shortNum = num / Math.pow(1000, order);
    return shortNum % 1 === 0 ? shortNum.toFixed(0) + unitname : shortNum.toFixed(1) + unitname;
}
function setBoxSpacing(block, type, value) {
    var props = [type, "".concat(type, "Top"), "".concat(type, "Right"), "".concat(type, "Bottom"), "".concat(type, "Left")];
    props.forEach(function (prop) { return block.setStyle(prop, null); });
    var shorthand = value.trim();
    if (shorthand)
        block.setStyle(type, shorthand);
}
function getBoxSpacing(block, type, opts) {
    var _a, _b, _c, _d, _e, _f;
    var nativeOnly = (_a = opts === null || opts === void 0 ? void 0 : opts.nativeOnly) !== null && _a !== void 0 ? _a : false;
    var cascading = (_b = opts === null || opts === void 0 ? void 0 : opts.cascading) !== null && _b !== void 0 ? _b : false;
    var baseValue = block.getStyle(type, undefined, nativeOnly, cascading);
    var base = String(baseValue !== null && baseValue !== void 0 ? baseValue : (nativeOnly && !cascading ? "" : "unset"));
    var baseParts = expandBoxShorthand(base, base);
    var top = (_c = block.getStyle("".concat(type, "Top"), undefined, nativeOnly, cascading)) !== null && _c !== void 0 ? _c : baseParts[0];
    var right = (_d = block.getStyle("".concat(type, "Right"), undefined, nativeOnly, cascading)) !== null && _d !== void 0 ? _d : baseParts[1];
    var bottom = (_e = block.getStyle("".concat(type, "Bottom"), undefined, nativeOnly, cascading)) !== null && _e !== void 0 ? _e : baseParts[2];
    var left = (_f = block.getStyle("".concat(type, "Left"), undefined, nativeOnly, cascading)) !== null && _f !== void 0 ? _f : baseParts[3];
    var sTop = String(top);
    var sRight = String(right);
    var sBottom = String(bottom);
    var sLeft = String(left);
    if (sTop === baseParts[0] && sRight === baseParts[1] && sBottom === baseParts[2] && sLeft === baseParts[3]) {
        return base;
    }
    // A side left unset while others are set falls back to an empty base; treat it as 0
    // so the reconstructed shorthand stays well-formed and expands to the right corners.
    var fill = function (value) { return value || "0px"; };
    return collapseBoxShorthand([fill(sTop), fill(sRight), fill(sBottom), fill(sLeft)]);
}
/**
 * Extracts the numeric value and unit from a CSS value string
 * @param value - CSS value string (e.g., "10px", "1.5em", "20")
 * @returns Object containing the number and unit parts
 */
function extractNumberAndUnit(value) {
    var match = value.match(/([0-9.]+)([a-z%]*)/) || ["", "0", ""];
    return { number: match[1], unit: match[2] };
}
/**
 * Adds a unit to a number if it doesn't already have one
 * @param numberStr - String containing a number with or without a unit
 * @param unit - Default unit to add if none exists
 * @returns String with unit attached
 */
function addUnitToNumber(numberStr, unit) {
    var match = numberStr.match(numericValuePattern);
    if (match) {
        var number = match[1], existingUnit = match[2];
        return existingUnit ? numberStr : number + unit;
    }
    return numberStr;
}
/**
 * Removes the default unit from numeric values for display in controls.
 * Other units remain visible.
 */
function removeDefaultUnit(value, defaultUnit) {
    return value
        .split(/(\s+)/)
        .map(function (part) {
        var match = part.match(numericValuePattern);
        return (match === null || match === void 0 ? void 0 : match[2].toLowerCase()) === defaultUnit.toLowerCase() ? match[1] : part;
    })
        .join("");
}
/**
 * Splits a CSS value list on whitespace, ignoring whitespace inside
 * parentheses so functional values like `calc(10px + 5%)` stay intact.
 */
function splitCssValueList(value) {
    var parts = [];
    var current = "";
    var depth = 0;
    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
        var char = value_1[_i];
        if (char === "(")
            depth++;
        if (char === ")")
            depth--;
        if (/\s/.test(char) && depth === 0) {
            if (current)
                parts.push(current);
            current = "";
        }
        else {
            current += char;
        }
    }
    if (current)
        parts.push(current);
    return parts;
}
/**
 * Expands a CSS box shorthand (margin, padding, border-radius) into its four
 * component values following the standard 1/2/3/4-value rules.
 * @param value - Shorthand value string
 * @param fallback - Value used for every side when the shorthand is empty
 * @returns Array of exactly four side values
 */
function expandBoxShorthand(value, fallback) {
    if (fallback === void 0) { fallback = "0"; }
    var parts = splitCssValueList(String(value !== null && value !== void 0 ? value : "").trim());
    if (!parts.length)
        return Array(4).fill(fallback);
    if (parts.length === 1)
        return Array(4).fill(parts[0]);
    if (parts.length === 2)
        return [parts[0], parts[1], parts[0], parts[1]];
    if (parts.length === 3)
        return [parts[0], parts[1], parts[2], parts[1]];
    return parts.slice(0, 4);
}
/**
 * Collapses four side values into the shortest shorthand that expands back to them.
 * @param parts - Four side values, in the order expandBoxShorthand returns
 * @returns Shorthand value string
 */
function collapseBoxShorthand(parts) {
    var _a = parts.map(function (part) { return String(part !== null && part !== void 0 ? part : ""); }), top = _a[0], right = _a[1], bottom = _a[2], left = _a[3];
    if (top === right && top === bottom && top === left)
        return top;
    if (top === bottom && right === left)
        return "".concat(top, " ").concat(right);
    if (right === left)
        return "".concat(top, " ").concat(right, " ").concat(bottom);
    return [top, right, bottom, left].join(" ");
}
/**
 * Normalizes CSS values by adding the default unit where missing.
 * Handles both single and whitespace-separated numeric values.
 * @param value - CSS value string
 * @param defaultUnit - Unit to add to unitless numbers
 * @returns Normalized value string with units added
 */
function normalizeValueWithUnits(value, defaultUnit) {
    if (!defaultUnit)
        return value;
    return value
        .split(/(\s+)/)
        .map(function (part) { return addUnitToNumber(part, defaultUnit); })
        .join("");
}
//# sourceMappingURL=cssUtils.js.map