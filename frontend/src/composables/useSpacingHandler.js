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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
exports.useSpacingHandler = useSpacingHandler;
var cssUtils_1 = require("@/utils/cssUtils");
var cursor_1 = require("@/utils/cursor");
var helpers_1 = require("@/utils/helpers");
var rotation_1 = require("@/utils/rotation");
var core_1 = require("@vueuse/core");
var vue_1 = require("vue");
var Position;
(function (Position) {
    Position["Top"] = "top";
    Position["Right"] = "right";
    Position["Bottom"] = "bottom";
    Position["Left"] = "left";
})(Position || (exports.Position = Position = {}));
// `outward` is the sign of a drag pointing away from the block along the side's axis.
var sides = (_a = {},
    _a[Position.Top] = { axis: "y", outward: -1, styleSuffix: "Top", index: 0 },
    _a[Position.Right] = { axis: "x", outward: 1, styleSuffix: "Right", index: 1 },
    _a[Position.Bottom] = { axis: "y", outward: 1, styleSuffix: "Bottom", index: 2 },
    _a[Position.Left] = { axis: "x", outward: -1, styleSuffix: "Left", index: 3 },
    _a);
var verticalSides = [Position.Top, Position.Bottom];
var horizontalSides = [Position.Left, Position.Right];
var allSides = __spreadArray(__spreadArray([], verticalSides, true), horizontalSides, true);
// Shared state and drag behaviour for the Margin and Padding handlers. The per-side
// positioning and value display differ and stay in each component.
function useSpacingHandler(getTargetBlock, getBreakpoint) {
    var canvasProps = (0, vue_1.inject)("canvasProps");
    var updating = (0, vue_1.ref)(false);
    var blockStyles = (0, vue_1.computed)(function () {
        var breakpoint = getBreakpoint();
        var styles = __assign({}, getTargetBlock().baseStyles);
        if (breakpoint === "mobile" || breakpoint === "tablet") {
            styles = __assign(__assign({}, styles), getTargetBlock().mobileStyles);
        }
        if (breakpoint === "tablet") {
            styles = __assign(__assign({}, styles), getTargetBlock().tabletStyles);
        }
        return styles;
    });
    var handleBorderWidth = (0, vue_1.computed)(function () { return "".concat((0, core_1.clamp)(1 * canvasProps.scale, 1, 2), "px"); });
    // Long-edge handles (top/bottom) are wide and short; side handles (left/right)
    // are tall and narrow. The dimensions are identical for margin and padding;
    // only the offsets (set per-component) differ.
    var longHandleSize = (0, vue_1.computed)(function () { return ({
        width: (0, core_1.clamp)(16 * canvasProps.scale, 8, 32),
        height: (0, core_1.clamp)(4 * canvasProps.scale, 2, 8),
    }); });
    var sideHandleSize = (0, vue_1.computed)(function () { return ({
        width: (0, core_1.clamp)(4 * canvasProps.scale, 2, 8),
        height: (0, core_1.clamp)(16 * canvasProps.scale, 8, 32),
    }); });
    var styleKey = function (property, side) {
        return "".concat(property).concat(sides[side].styleSuffix);
    };
    // Side-specific spacing styles are legacy data. Read them for display/editing,
    // then collapse every update back into the single shorthand style.
    var getSpacingParts = function (property) {
        var _a;
        var styles = blockStyles.value;
        var parts = (0, cssUtils_1.expandBoxShorthand)((_a = styles[property]) !== null && _a !== void 0 ? _a : "", "0px");
        allSides.forEach(function (side) {
            var sideValue = styles[styleKey(property, side)];
            if (sideValue)
                parts[sides[side].index] = String(sideValue);
        });
        return parts;
    };
    var getSpacingValue = function (property, side) {
        return getSpacingParts(property)[sides[side].index];
    };
    var setSpacingShorthand = function (property, updatedSides, value) {
        var block = getTargetBlock();
        var parts = getSpacingParts(property);
        updatedSides.forEach(function (updatedSide) {
            parts[sides[updatedSide].index] = "".concat(value, "px");
        });
        block.setStyle("".concat(property, "Top"), null);
        block.setStyle("".concat(property, "Right"), null);
        block.setStyle("".concat(property, "Bottom"), null);
        block.setStyle("".concat(property, "Left"), null);
        block.setStyle(property, (0, cssUtils_1.collapseBoxShorthand)(parts));
    };
    // Shift spreads the value to all four sides, alt to both sides of the dragged axis.
    var sidesToUpdate = function (event, side) {
        if (event.shiftKey)
            return allSides;
        if (event.altKey)
            return sides[side].axis === "y" ? verticalSides : horizontalSides;
        return [side];
    };
    var startSpacingDrag = function (event, side, _a) {
        var property = _a.property, fallback = _a.fallback, getRotation = _a.getRotation, onUpdate = _a.onUpdate;
        var _b = sides[side], axis = _b.axis, outward = _b.outward;
        // the handles sit on the block's edge, so dragging outward grows a margin but shrinks a padding
        var sign = property === "margin" ? outward : -outward;
        var startValue = (0, helpers_1.getNumberFromPx)(getSpacingValue(property, side)) || fallback;
        var startPoint = { x: event.clientX, y: event.clientY };
        event.preventDefault();
        updating.value = true;
        (0, cursor_1.startDrag)({
            cursor: window.getComputedStyle(event.target).cursor,
            onMove: function (moveEvent) {
                onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate();
                var delta = (0, rotation_1.toLocalDelta)(moveEvent.clientX - startPoint.x, moveEvent.clientY - startPoint.y, getRotation());
                var value = Math.round(Math.max(startValue + sign * delta[axis], 0));
                setSpacingShorthand(property, sidesToUpdate(moveEvent, side), value);
            },
            onEnd: function () {
                updating.value = false;
            },
        });
    };
    return {
        canvasProps: canvasProps,
        updating: updating,
        blockStyles: blockStyles,
        handleBorderWidth: handleBorderWidth,
        longHandleSize: longHandleSize,
        sideHandleSize: sideHandleSize,
        getSpacingValue: getSpacingValue,
        startSpacingDrag: startSpacingDrag,
    };
}
//# sourceMappingURL=useSpacingHandler.js.map