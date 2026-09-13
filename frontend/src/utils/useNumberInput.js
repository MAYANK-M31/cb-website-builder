"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNumberInput = useNumberInput;
var vue_1 = require("vue");
var helpers_1 = require("@/utils/helpers");
function useNumberInput(_a) {
    var getValue = _a.getValue, setValue = _a.setValue, getAttrs = _a.getAttrs;
    var hasNumber = (0, vue_1.computed)(function () {
        var _a;
        var value = String((_a = getValue()) !== null && _a !== void 0 ? _a : "").trim();
        return /^-?\d/.test(value);
    });
    var incrementValue = function () {
        var _a;
        var _b = (0, helpers_1.extractNumberAndUnit)(String(getValue() || "")), number = _b.number, unit = _b.unit;
        var attrs = (_a = getAttrs === null || getAttrs === void 0 ? void 0 : getAttrs()) !== null && _a !== void 0 ? _a : {};
        var step = attrs.step ? parseFloat(String(attrs.step)) : 1;
        var max = attrs.max !== undefined ? parseFloat(String(attrs.max)) : Infinity;
        var currentNum = parseFloat(number) || 0;
        var newNum = Math.min(max, parseFloat((currentNum + step).toFixed(10)));
        setValue(newNum + unit);
    };
    var decrementValue = function () {
        var _a;
        var _b = (0, helpers_1.extractNumberAndUnit)(String(getValue() || "")), number = _b.number, unit = _b.unit;
        var attrs = (_a = getAttrs === null || getAttrs === void 0 ? void 0 : getAttrs()) !== null && _a !== void 0 ? _a : {};
        var step = attrs.step ? parseFloat(String(attrs.step)) : 1;
        var min = attrs.min !== undefined ? parseFloat(String(attrs.min)) : -Infinity;
        var currentNum = parseFloat(number) || 0;
        var newNum = Math.max(min, parseFloat((currentNum - step).toFixed(10)));
        setValue(newNum + unit);
    };
    return { hasNumber: hasNumber, incrementValue: incrementValue, decrementValue: decrementValue };
}
//# sourceMappingURL=useNumberInput.js.map