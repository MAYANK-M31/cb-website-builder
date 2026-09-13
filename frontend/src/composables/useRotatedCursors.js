"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRotatedCursors = useRotatedCursors;
var resize_cursor_svg_raw_1 = __importDefault(require("@/assets/resize-cursor.svg?raw"));
var rotation_cursor_svg_raw_1 = __importDefault(require("@/assets/rotation-cursor.svg?raw"));
var cursor_1 = require("@/utils/cursor");
var rotation_1 = require("@/utils/rotation");
var vue_1 = require("vue");
// Cursors for the drag handles of a block, turned to match its *rendered* angle - its own
// rotation plus any rotated ancestors - so a handle always points along the edge it drags.
function useRotatedCursors(getTarget, getBlock) {
    var rotation = (0, vue_1.computed)(function () { return (0, rotation_1.getTotalRotation)(getTarget(), getBlock()); });
    var resizeCursor = function (offset, fallback) {
        return (0, vue_1.computed)(function () { return (0, cursor_1.getRotatedCursor)(resize_cursor_svg_raw_1.default, rotation.value + offset, fallback); });
    };
    return {
        rotation: rotation,
        horizontalCursor: resizeCursor(0, "ew-resize"),
        verticalCursor: resizeCursor(90, "ns-resize"),
        // top-left/bottom-right share one diagonal (nwse), top-right/bottom-left the other (nesw)
        cornerCursorNWSE: resizeCursor(45, "nwse-resize"),
        cornerCursorNESW: resizeCursor(-45, "nesw-resize"),
        rotationCursor: function (baseAngle) {
            return (0, vue_1.computed)(function () { return (0, cursor_1.getRotatedCursor)(rotation_cursor_svg_raw_1.default, rotation.value + baseAngle, "pointer"); });
        },
    };
}
//# sourceMappingURL=useRotatedCursors.js.map