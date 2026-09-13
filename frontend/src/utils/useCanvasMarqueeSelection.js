"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCanvasMarqueeSelection = useCanvasMarqueeSelection;
var builderStore_1 = __importDefault(require("@/stores/builderStore"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var vue_1 = require("vue");
var MIN_MARQUEE_DRAG = 5;
// Blocks must overlap the selection by at least this fraction of their area,
// unless fully contained — in which case they are always selected.
var OVERLAP_SELECTION_THRESHOLD = 0.5;
var setsEqual = function (a, b) {
    if (a.size !== b.size)
        return false;
    for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
        var id = a_1[_i];
        if (!b.has(id))
            return false;
    }
    return true;
};
function useCanvasMarqueeSelection(options) {
    var canvasContainer = options.canvasContainer, canvasProps = options.canvasProps, activeBreakpoint = options.activeBreakpoint, selectedBlockIds = options.selectedBlockIds, findBlock = options.findBlock, setActiveBreakpoint = options.setActiveBreakpoint, setHoveredBreakpoint = options.setHoveredBreakpoint;
    var builderStore = (0, builderStore_1.default)();
    var canvasStore = (0, canvasStore_1.default)();
    var suppressNextClick = (0, vue_1.ref)(false);
    var marqueeAdditiveSelection = (0, vue_1.ref)(false);
    var marqueeBreakpoint = (0, vue_1.ref)(null);
    var marqueeInitialSelection = (0, vue_1.ref)(new Set());
    // Cached block rects — snapshotted once when drag starts; blocks don't move during a marquee
    var blockRectCache = [];
    var rafId = null;
    // Tracks which blocks currently have the DOM highlight attribute (no Vue overhead)
    var marqueePreviewIds = new Set();
    var marquee = (0, vue_1.reactive)({
        active: false,
        visible: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
    });
    var marqueeStyle = (0, vue_1.computed)(function () {
        var left = Math.min(marquee.startX, marquee.currentX);
        var top = Math.min(marquee.startY, marquee.currentY);
        var width = Math.abs(marquee.currentX - marquee.startX);
        var height = Math.abs(marquee.currentY - marquee.startY);
        return {
            left: "".concat(left, "px"),
            top: "".concat(top, "px"),
            width: "".concat(width, "px"),
            height: "".concat(height, "px"),
            border: "1px solid rgba(59, 130, 246, 0.85)",
            background: "rgba(59, 130, 246, 0.12)",
        };
    });
    var clearMarqueeDOMHighlights = function () {
        for (var _i = 0, blockRectCache_1 = blockRectCache; _i < blockRectCache_1.length; _i++) {
            var entry = blockRectCache_1[_i];
            entry.el.removeAttribute("data-marquee-selected");
        }
        marqueePreviewIds = new Set();
    };
    var cancelMarqueeOnDrag = function () {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        clearMarqueeDOMHighlights();
        marquee.active = false;
        marquee.visible = false;
        blockRectCache = [];
        canvasStore.isMarqueeActive = false;
        removeWindowListeners();
    };
    var removeWindowListeners = function () {
        window.removeEventListener("mousemove", handleMarqueeMove);
        window.removeEventListener("mouseup", handleMarqueeEnd);
        window.removeEventListener("dragstart", cancelMarqueeOnDrag);
    };
    var handleMarqueeStart = function (ev) {
        if (!shouldStartMarquee(ev)) {
            return;
        }
        // preventDefault only once we're committing to a marquee — calling it
        // unconditionally swallows native caret placement inside editable text blocks
        ev.preventDefault();
        marquee.active = true;
        marquee.visible = false;
        marquee.startX = ev.clientX;
        marquee.startY = ev.clientY;
        marquee.currentX = ev.clientX;
        marquee.currentY = ev.clientY;
        marqueeAdditiveSelection.value = ev.shiftKey || ev.metaKey || ev.ctrlKey;
        marqueeInitialSelection.value = new Set(selectedBlockIds.value);
        marqueeBreakpoint.value = getBreakpointAtPoint(ev.clientX, ev.clientY);
        window.addEventListener("mousemove", handleMarqueeMove);
        window.addEventListener("mouseup", handleMarqueeEnd);
        // Cancel marquee if the browser starts an HTML5 block drag (mouseup won't fire during drag)
        window.addEventListener("dragstart", cancelMarqueeOnDrag);
    };
    var snapshotBlockRects = function () {
        var container = canvasContainer.value;
        if (!container)
            return [];
        var target = marqueeBreakpoint.value || activeBreakpoint.value;
        var elements = container.querySelectorAll(".__builder_component__[data-block-id][data-breakpoint]");
        var result = [];
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var el = elements_1[_i];
            if ((el.dataset.breakpoint || null) !== target)
                continue;
            var blockId = el.dataset.blockId;
            if (!blockId || blockId === "root")
                continue;
            var rect = el.getBoundingClientRect();
            if (!rect.width || !rect.height)
                continue;
            var block = findBlock(blockId);
            if (!block)
                continue;
            // Only select the component root — never select internal children of a component
            if (block.isChildOfComponentBlock())
                continue;
            result.push({ blockId: blockId, rect: rect, area: rect.width * rect.height, block: block, el: el });
        }
        return result;
    };
    // Updates block highlight during drag via DOM attribute — zero Vue reactivity overhead.
    // Vue reactive state is only committed once at drag end.
    var updateMarqueeDOMHighlights = function () {
        var newIds = getMarqueeIntersectingBlockIds();
        for (var _i = 0, blockRectCache_2 = blockRectCache; _i < blockRectCache_2.length; _i++) {
            var entry = blockRectCache_2[_i];
            var hadHighlight = marqueePreviewIds.has(entry.blockId);
            var hasHighlight = newIds.has(entry.blockId);
            if (hadHighlight !== hasHighlight) {
                if (hasHighlight) {
                    entry.el.setAttribute("data-marquee-selected", "");
                }
                else {
                    entry.el.removeAttribute("data-marquee-selected");
                }
            }
        }
        marqueePreviewIds = newIds;
    };
    var handleMarqueeMove = function (ev) {
        if (!marquee.active)
            return;
        // Always capture the latest position — even if a rAF is already pending
        marquee.currentX = ev.clientX;
        marquee.currentY = ev.clientY;
        if (rafId !== null)
            return; // coalesce: only one rAF per frame
        rafId = requestAnimationFrame(function () {
            var _a;
            rafId = null;
            if (!marquee.visible) {
                var dx = Math.abs(marquee.currentX - marquee.startX);
                var dy = Math.abs(marquee.currentY - marquee.startY);
                if (dx >= MIN_MARQUEE_DRAG || dy >= MIN_MARQUEE_DRAG) {
                    marquee.visible = true;
                    // Snapshot rects once — blocks don't move during a marquee drag
                    blockRectCache = snapshotBlockRects();
                    canvasStore.isMarqueeActive = true;
                    (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.setHoveredBlock(null);
                    if (canvasStore.activeCanvas) {
                        canvasStore.activeCanvas.clearSelection();
                    }
                }
            }
            // Drive highlight via DOM only — no Vue reactive updates per frame
            if (marquee.visible)
                updateMarqueeDOMHighlights();
        });
    };
    var handleMarqueeEnd = function () {
        if (!marquee.active)
            return;
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        removeWindowListeners();
        if (marquee.visible) {
            // Remove DOM highlights, then commit selection to Vue reactive state exactly once
            clearMarqueeDOMHighlights();
            applyMarqueeSelection();
            suppressNextClick.value = true;
            // Also prevent useBlockEventHandlers from selecting the block under the cursor
            canvasStore.preventClick = true;
            setTimeout(function () {
                canvasStore.preventClick = false;
            }, 50);
        }
        marquee.active = false;
        marquee.visible = false;
        blockRectCache = [];
        canvasStore.isMarqueeActive = false;
    };
    var shouldStartMarquee = function (ev) {
        if (ev.button !== 0)
            return false;
        if (builderStore.mode !== "select")
            return false;
        if (builderStore.readOnlyMode)
            return false;
        if (canvasStore.isDragging || canvasProps.panning || canvasProps.scaling)
            return false;
        var target = ev.target;
        if (!target)
            return false;
        if (target.closest("input, textarea, select, button, a, [contenteditable='true']")) {
            return false;
        }
        // Pressing on an actual block starts a block drag/selection (see
        // useBlockEventHandlers), not a marquee. The root block (page background)
        // and truly empty canvas still start a marquee.
        var blockEl = target.closest(".__builder_component__");
        if (blockEl && blockEl.dataset.blockId && blockEl.dataset.blockId !== "root") {
            return false;
        }
        return true;
    };
    var getBreakpointAtPoint = function (x, y) {
        var container = canvasContainer.value;
        if (!container) {
            return activeBreakpoint.value;
        }
        var canvases = Array.from(container.querySelectorAll(".canvas[data-breakpoint]"));
        for (var _i = 0, canvases_1 = canvases; _i < canvases_1.length; _i++) {
            var canvasElement = canvases_1[_i];
            var rect = canvasElement.getBoundingClientRect();
            if (!rect.width || !rect.height)
                continue;
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                return canvasElement.dataset.breakpoint || activeBreakpoint.value;
            }
        }
        return activeBreakpoint.value;
    };
    var getMarqueeIntersectingBlockIds = function () {
        if (!blockRectCache.length)
            return new Set();
        var selectionRect = {
            left: Math.min(marquee.startX, marquee.currentX),
            right: Math.max(marquee.startX, marquee.currentX),
            top: Math.min(marquee.startY, marquee.currentY),
            bottom: Math.max(marquee.startY, marquee.currentY),
        };
        var intersectingIds = new Set();
        var fullyContainedIds = new Set();
        // Build a map once so the parent-walk loop is O(1) per lookup
        var blockByIdInCache = new Map();
        for (var _i = 0, blockRectCache_3 = blockRectCache; _i < blockRectCache_3.length; _i++) {
            var entry = blockRectCache_3[_i];
            blockByIdInCache.set(entry.blockId, entry);
            var blockId = entry.blockId, rect = entry.rect, area = entry.area;
            var intersects = !(rect.right < selectionRect.left ||
                rect.left > selectionRect.right ||
                rect.bottom < selectionRect.top ||
                rect.top > selectionRect.bottom);
            if (!intersects)
                continue;
            var fullyContained = rect.left >= selectionRect.left &&
                rect.right <= selectionRect.right &&
                rect.top >= selectionRect.top &&
                rect.bottom <= selectionRect.bottom;
            if (fullyContained) {
                intersectingIds.add(blockId);
                fullyContainedIds.add(blockId);
                continue;
            }
            var iW = Math.min(rect.right, selectionRect.right) - Math.max(rect.left, selectionRect.left);
            var iH = Math.min(rect.bottom, selectionRect.bottom) - Math.max(rect.top, selectionRect.top);
            var overlapRatio = area > 0 ? (Math.max(0, iW) * Math.max(0, iH)) / area : 0;
            if (overlapRatio > OVERLAP_SELECTION_THRESHOLD) {
                intersectingIds.add(blockId);
            }
        }
        var parentOnlyIds = new Set();
        for (var _a = 0, intersectingIds_1 = intersectingIds; _a < intersectingIds_1.length; _a++) {
            var blockId = intersectingIds_1[_a];
            var entry = blockByIdInCache.get(blockId);
            if (!entry)
                continue;
            var parent_1 = entry.block.getParentBlock();
            var hasFullyContainedAncestor = false;
            while (parent_1) {
                if (fullyContainedIds.has(parent_1.blockId)) {
                    hasFullyContainedAncestor = true;
                    break;
                }
                parent_1 = parent_1.getParentBlock();
            }
            if (!hasFullyContainedAncestor)
                parentOnlyIds.add(blockId);
        }
        return parentOnlyIds;
    };
    var applyMarqueeSelection = function () {
        var targetBreakpoint = marqueeBreakpoint.value || activeBreakpoint.value;
        var intersectingIds = getMarqueeIntersectingBlockIds();
        var nextIds = new Set();
        if (marqueeAdditiveSelection.value) {
            for (var _i = 0, _a = marqueeInitialSelection.value; _i < _a.length; _i++) {
                var id = _a[_i];
                nextIds.add(id);
            }
        }
        for (var _b = 0, intersectingIds_2 = intersectingIds; _b < intersectingIds_2.length; _b++) {
            var id = intersectingIds_2[_b];
            nextIds.add(id);
        }
        // Skip reactivity churn when the selection set hasn't actually changed
        if (!setsEqual(selectedBlockIds.value, nextIds)) {
            selectedBlockIds.value = nextIds;
        }
        if (targetBreakpoint) {
            setActiveBreakpoint(targetBreakpoint);
            setHoveredBreakpoint(targetBreakpoint);
        }
    };
    return {
        marquee: marquee,
        marqueeStyle: marqueeStyle,
        suppressNextClick: suppressNextClick,
        handleMarqueeStart: handleMarqueeStart,
        cleanupMarqueeListeners: removeWindowListeners,
    };
}
//# sourceMappingURL=useCanvasMarqueeSelection.js.map