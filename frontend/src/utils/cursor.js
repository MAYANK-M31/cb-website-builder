"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDragCursor = clearDragCursor;
exports.getRotatedCursor = getRotatedCursor;
exports.setDragCursor = setDragCursor;
exports.startDrag = startDrag;
// Builds a CSS cursor from an SVG rotated around its hotspot.
function getRotatedCursor(svg, angle, fallback, hotspot) {
    if (hotspot === void 0) { hotspot = 16; }
    var rotatedSvg = svg.replace('<g fill="none" fill-rule="evenodd">', "<g fill=\"none\" fill-rule=\"evenodd\" transform=\"rotate(".concat(angle, " ").concat(hotspot, " ").concat(hotspot, ")\">"));
    // Makes the SVG safe for a quoted data URI.
    var dataUri = rotatedSvg
        .replace(/>\s+</g, "><")
        .trim()
        .replace(/"/g, "'")
        .replace(/%/g, "%25")
        .replace(/#/g, "%23");
    return "url(\"data:image/svg+xml,".concat(dataUri, "\") ").concat(hotspot, " ").concat(hotspot, ", ").concat(fallback);
}
var overlay = null;
// Prevents hovered elements from overriding the cursor during a drag.
function setDragCursor(cursor) {
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.zIndex = "2147483647";
        document.body.appendChild(overlay);
    }
    overlay.style.cursor = cursor;
}
function clearDragCursor() {
    overlay === null || overlay === void 0 ? void 0 : overlay.remove();
    overlay = null;
}
// Runs a mouse drag with the cursor locked for its duration, tearing down its listeners on mouseup
// or Escape.
function startDrag(_a) {
    var cursor = _a.cursor, onMove = _a.onMove, onEnd = _a.onEnd, onCancel = _a.onCancel;
    if (cursor)
        setDragCursor(cursor);
    var mousemove = function (moveEvent) {
        onMove(moveEvent);
        moveEvent.preventDefault();
    };
    var stop = function () {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
        document.removeEventListener("keydown", keydown);
        clearDragCursor();
    };
    var mouseup = function (upEvent) {
        stop();
        onEnd === null || onEnd === void 0 ? void 0 : onEnd(upEvent);
        upEvent.preventDefault();
    };
    // Dropping the mouseup listener keeps the pending release from ending the drag a second time.
    var keydown = function (keyEvent) {
        if (keyEvent.key !== "Escape")
            return;
        keyEvent.preventDefault();
        stop();
        onCancel === null || onCancel === void 0 ? void 0 : onCancel();
        onEnd === null || onEnd === void 0 ? void 0 : onEnd();
    };
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("keydown", keydown);
}
//# sourceMappingURL=cursor.js.map