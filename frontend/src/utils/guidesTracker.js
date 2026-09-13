"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var core_1 = require("@vueuse/core");
var vue_1 = require("vue");
var canvasStore = (0, canvasStore_1.default)();
var tracks = [
    {
        point: 0,
        strength: 10,
    },
    {
        point: 0.25,
        strength: 2,
    },
    {
        point: 0.5,
        strength: 10,
    },
    {
        point: 0.75,
        strength: 2,
    },
    {
        point: 1,
        strength: 10,
    },
];
function setGuides(target, canvasProps) {
    var threshold = 10;
    // TODO: Remove canvas dependency
    var canvasElement = target.closest(".canvas");
    var canvasBounds = (0, vue_1.reactive)((0, core_1.useElementBounding)(canvasElement));
    var targetBounds = (0, vue_1.reactive)((0, core_1.useElementBounding)(target));
    var parentBounds = (0, vue_1.reactive)((0, core_1.useElementBounding)(target.parentElement));
    var getFinalWidth = function (calculatedWidth) {
        targetBounds.update();
        canvasBounds.update();
        parentBounds.update();
        var scale = canvasProps.scale;
        var targetRight = targetBounds.left + calculatedWidth * scale;
        var finalWidth = calculatedWidth;
        var set = false;
        tracks.forEach(function (track) {
            var canvasRight = canvasBounds.left + canvasBounds.width * track.point;
            var parentRight = parentBounds.left + parentBounds.width * track.point;
            if (Math.abs(targetRight - canvasRight) < track.strength) {
                finalWidth = (canvasRight - targetBounds.left) / scale;
                canvasStore.guides.x = canvasRight;
                set = true;
            }
            else if (Math.abs(targetRight - parentRight) < track.strength) {
                finalWidth = (parentRight - targetBounds.left) / scale;
                canvasStore.guides.x = parentRight;
                set = true;
            }
        });
        if (!set) {
            canvasStore.guides.x = -1;
        }
        return Math.round(finalWidth);
    };
    var getFinalHeight = function (calculatedHeight) {
        targetBounds.update();
        canvasBounds.update();
        parentBounds.update();
        var scale = canvasProps.scale;
        var targetBottom = targetBounds.top + calculatedHeight * scale;
        var finalHeight = calculatedHeight;
        var set = false;
        tracks.forEach(function (track) {
            var canvasBottom = canvasBounds.top + canvasBounds.height * track.point;
            var parentBottom = parentBounds.top + parentBounds.height * track.point;
            if (Math.abs(targetBottom - canvasBottom) < track.strength) {
                finalHeight = (canvasBottom - targetBounds.top) / scale;
                canvasStore.guides.y = canvasBottom;
                set = true;
            }
            else if (Math.abs(targetBottom - parentBottom) < track.strength) {
                finalHeight = (parentBottom - targetBounds.top) / scale;
                canvasStore.guides.y = parentBottom;
                set = true;
            }
        });
        if (!set) {
            canvasStore.guides.y = -1;
        }
        return Math.round(finalHeight);
    };
    var getPositionOffset = function () {
        targetBounds.update();
        canvasBounds.update();
        var scale = canvasProps.scale;
        var leftOffset = 0;
        var rightOffset = 0;
        var canvasHalf = canvasBounds.left + canvasBounds.width / 2;
        if (Math.abs(targetBounds.left - canvasBounds.left) < threshold) {
            leftOffset = (canvasBounds.left - targetBounds.left) / scale;
            canvasStore.guides.x = canvasBounds.left;
        }
        if (Math.abs(targetBounds.left - canvasHalf) < threshold) {
            leftOffset = (canvasHalf - targetBounds.left) / scale;
            canvasStore.guides.x = canvasHalf;
        }
        if (Math.abs(targetBounds.left - canvasBounds.right) < threshold) {
            leftOffset = (canvasBounds.right - targetBounds.left) / scale;
            canvasStore.guides.x = canvasBounds.right;
        }
        if (Math.abs(targetBounds.right - canvasBounds.left) < threshold) {
            rightOffset = (canvasBounds.left - targetBounds.right) / scale;
            canvasStore.guides.x = canvasBounds.left;
        }
        if (Math.abs(targetBounds.right - canvasHalf) < threshold) {
            rightOffset = (canvasHalf - targetBounds.right) / scale;
            canvasStore.guides.x = canvasHalf;
        }
        if (Math.abs(targetBounds.right - canvasBounds.right) < threshold) {
            rightOffset = (canvasBounds.right - targetBounds.right) / scale;
            canvasStore.guides.x = canvasBounds.right;
        }
        if ((leftOffset && rightOffset) || (!leftOffset && !rightOffset)) {
            canvasStore.guides.x = -1;
        }
        return { leftOffset: Math.round(leftOffset), rightOffset: Math.round(rightOffset) };
    };
    var showX = function () {
        canvasStore.guides.x = -1;
        canvasStore.guides.showX = true;
    };
    var showY = function () {
        canvasStore.guides.y = -1;
        canvasStore.guides.showY = true;
    };
    var hideX = function () {
        canvasStore.guides.showX = false;
    };
    var hideY = function () {
        canvasStore.guides.showY = false;
    };
    return {
        getFinalWidth: getFinalWidth,
        getFinalHeight: getFinalHeight,
        showX: showX,
        showY: showY,
        hideX: hideX,
        hideY: hideY,
        getPositionOffset: getPositionOffset,
    };
}
exports.default = setGuides;
//# sourceMappingURL=guidesTracker.js.map