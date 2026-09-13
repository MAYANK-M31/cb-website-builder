"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@vueuse/core");
var vue_1 = require("vue");
function setPanAndZoom(target, panAndZoomAreaElement, props, zoomLimits) {
    if (zoomLimits === void 0) { zoomLimits = { min: 0.1, max: 10 }; }
    var targetBound = (0, vue_1.reactive)((0, core_1.useElementBounding)(target));
    var pointFromCenterX = 0;
    var pointFromCenterY = 0;
    var startX = 0;
    var startY = 0;
    var pinchPointSet = false;
    var wheeling;
    var setZoom = function (scale, pinchPoint) {
        if (pinchPoint === void 0) { pinchPoint = "center"; }
        var clampedScale = Math.min(Math.max(scale, zoomLimits.min), zoomLimits.max);
        var oldScale = props.scale;
        var pinchX;
        var pinchY;
        if (pinchPoint === "center") {
            var areaBound = panAndZoomAreaElement.getBoundingClientRect();
            pinchX = areaBound.left + areaBound.width / 2;
            pinchY = areaBound.top + areaBound.height / 2;
        }
        else {
            pinchX = pinchPoint.x;
            pinchY = pinchPoint.y;
        }
        var middleX = targetBound.left + targetBound.width / 2;
        var middleY = targetBound.top + targetBound.height / 2;
        var pointFromCenterX = (pinchX - middleX) / oldScale;
        var pointFromCenterY = (pinchY - middleY) / oldScale;
        props.scale = clampedScale;
        (0, vue_1.nextTick)(function () {
            // Recalculate the middle after scale change
            var newMiddleX = targetBound.left + targetBound.width / 2;
            var newMiddleY = targetBound.top + targetBound.height / 2;
            // Calculate where the pinch point ended up after scaling
            var pinchLocationX = newMiddleX + pointFromCenterX * clampedScale;
            var pinchLocationY = newMiddleY + pointFromCenterY * clampedScale;
            // Adjust translation to keep the pinch point in place
            var diffX = pinchX - pinchLocationX;
            var diffY = pinchY - pinchLocationY;
            props.translateX += diffX / clampedScale;
            props.translateY += diffY / clampedScale;
        });
    };
    var updatePanAndZoom = function (e) {
        clearTimeout(wheeling);
        if (e.ctrlKey || e.metaKey) {
            props.scaling = true;
            if (!pinchPointSet) {
                // set pinch point before setting new scale value
                var middleX = targetBound.left + targetBound.width / 2;
                var middleY = targetBound.top + targetBound.height / 2;
                pointFromCenterX = (e.clientX - middleX) / props.scale;
                pointFromCenterY = (e.clientY - middleY) / props.scale;
                startX = e.clientX;
                startY = e.clientY;
                pinchPointSet = true;
                var clearPinchPoint = function () {
                    pinchPointSet = false;
                };
                panAndZoomAreaElement.addEventListener("mousemove", clearPinchPoint, { once: true });
            }
            var sensitivity = 0.008;
            function tooMuchScroll() {
                if (e.deltaY > 30 || e.deltaY < -30) {
                    return true;
                }
            }
            if (tooMuchScroll()) {
                // If the user scrolls too much, reduce the sensitivity
                // this mostly happens when the user uses mouse wheel to scroll
                // probably not the best way to handle this, but works for now
                sensitivity = 0.001;
            }
            // Multiplying with scale to make the zooming feel consistent
            var scale_1 = props.scale - e.deltaY * sensitivity * props.scale;
            scale_1 = Math.min(Math.max(scale_1, zoomLimits.min), zoomLimits.max);
            props.scale = scale_1;
            (0, vue_1.nextTick)(function () {
                var middleX = targetBound.left + targetBound.width / 2;
                var middleY = targetBound.top + targetBound.height / 2;
                var pinchLocationX = middleX + pointFromCenterX * scale_1;
                var pinchLocationY = middleY + pointFromCenterY * scale_1;
                var diffX = startX - pinchLocationX;
                var diffY = startY - pinchLocationY;
                props.translateX += diffX / scale_1;
                props.translateY += diffY / scale_1;
            });
        }
        else {
            props.panning = true;
            pinchPointSet = false;
            // Dividing with scale to make the panning feel consistent
            props.translateX -= e.deltaX / props.scale;
            props.translateY -= e.deltaY / props.scale;
        }
        wheeling = setTimeout(function () {
            props.scaling = false;
            props.panning = false;
        }, 200);
    };
    panAndZoomAreaElement.addEventListener("wheel", function (e) {
        e.preventDefault();
        requestAnimationFrame(function () { return updatePanAndZoom(e); });
    }, { passive: false });
    return { setZoom: setZoom };
}
exports.default = setPanAndZoom;
//# sourceMappingURL=panAndZoom.js.map