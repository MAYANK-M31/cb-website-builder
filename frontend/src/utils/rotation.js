"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementRotation = getElementRotation;
exports.getResizePositionDelta = getResizePositionDelta;
exports.getTotalRotation = getTotalRotation;
exports.toLocalDelta = toLocalDelta;
// Sums rotation from this element through the canvas.
function getElementRotation(el) {
    var rotation = 0;
    var current = el;
    while (current && !current.classList.contains("canvas-container")) {
        var rotate = getComputedStyle(current).rotate;
        if (rotate && rotate !== "none") {
            rotation += parseFloat(rotate) || 0;
        }
        current = current.parentElement;
    }
    return rotation;
}
function rotateDelta(x, y, rotationDeg) {
    var rad = (rotationDeg * Math.PI) / 180;
    return {
        x: x * Math.cos(rad) - y * Math.sin(rad),
        y: x * Math.sin(rad) + y * Math.cos(rad),
    };
}
// Converts screen-space movement to the element's local axes.
function toLocalDelta(dx, dy, rotationDeg) {
    return rotateDelta(dx, dy, -rotationDeg);
}
// Uses the reactive block style so computed cursors update with style-panel edits.
function getTotalRotation(target, targetBlock) {
    var ownRotation = parseFloat(String(targetBlock.getStyle("rotate") || 0)) || 0;
    return ownRotation + getElementRotation(target.parentElement);
}
// Keeps the opposite local edge fixed as a center-rotated element changes size.
function getResizePositionDelta(widthMovement, heightMovement, _a, rotationDeg) {
    var horizontal = _a.horizontal, vertical = _a.vertical;
    var centerDelta = { x: widthMovement / 2, y: heightMovement / 2 };
    var oppositeEdgeDelta = {
        x: horizontal === "left" ? centerDelta.x : horizontal === "right" ? -centerDelta.x : 0,
        y: vertical === "top" ? centerDelta.y : vertical === "bottom" ? -centerDelta.y : 0,
    };
    var rotatedEdgeDelta = rotateDelta(oppositeEdgeDelta.x, oppositeEdgeDelta.y, rotationDeg);
    return {
        x: -centerDelta.x - rotatedEdgeDelta.x || 0,
        y: -centerDelta.y - rotatedEdgeDelta.y || 0,
    };
}
//# sourceMappingURL=rotation.js.map