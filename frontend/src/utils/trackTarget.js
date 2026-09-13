"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@vueuse/core");
var vue_1 = require("vue");
var rotation_1 = require("./rotation");
var helpers_1 = require("./helpers");
// All tracked targets share one MutationObserver on the canvas container. It is
// created when the first target registers and disconnected once the last one is
// removed, so it survives individual BlockEditor remounts (a component-scoped
// observer would die with whichever editor happened to create it) without leaking
// stale updaters across the session.
var updateList = new Set();
var observer = null;
function startObserver(container) {
    observer = new MutationObserver(function () {
        (0, vue_1.nextTick)(function () { return updateList.forEach(function (fn) { return fn(); }); });
    });
    observer.observe(container, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ["style", "class"],
        characterData: true,
    });
}
function trackTarget(target, host, canvasProps) {
    var targetBounds = (0, vue_1.reactive)((0, core_1.useElementBounding)(target));
    var container = target.closest(".canvas-container");
    updateList.add(targetBounds.update);
    if (container && !observer) {
        startObserver(container);
    }
    (0, vue_1.watch)(canvasProps, function () { return (0, vue_1.nextTick)(targetBounds.update); }, { deep: true });
    // `targetBounds` is the axis-aligned box enclosing the rotated element, so it can't be
    // used directly for a rotated element: rotate the host around the same center instead,
    // sized to the target's own (unrotated) box, so it overlaps the element exactly.
    (0, vue_1.watchEffect)(function () {
        var angle = (0, rotation_1.getElementRotation)(target);
        if (angle) {
            var scale = canvasProps.scale;
            var width = target.offsetWidth * scale;
            var height = target.offsetHeight * scale;
            var centerX = targetBounds.left + targetBounds.width / 2;
            var centerY = targetBounds.top + targetBounds.height / 2;
            host.style.rotate = "".concat(angle, "deg");
            host.style.width = (0, helpers_1.addPxToNumber)(width, false);
            host.style.height = (0, helpers_1.addPxToNumber)(height, false);
            host.style.left = (0, helpers_1.addPxToNumber)(centerX - width / 2, false);
            host.style.top = (0, helpers_1.addPxToNumber)(centerY - height / 2, false);
        }
        else {
            host.style.rotate = "";
            host.style.width = (0, helpers_1.addPxToNumber)(targetBounds.width, false);
            host.style.height = (0, helpers_1.addPxToNumber)(targetBounds.height, false);
            host.style.top = (0, helpers_1.addPxToNumber)(targetBounds.top, false);
            host.style.left = (0, helpers_1.addPxToNumber)(targetBounds.left, false);
        }
    });
    (0, vue_1.onScopeDispose)(function () {
        updateList.delete(targetBounds.update);
        if (updateList.size === 0 && observer) {
            observer.disconnect();
            observer = null;
        }
    });
    return targetBounds.update;
}
exports.default = trackTarget;
//# sourceMappingURL=trackTarget.js.map