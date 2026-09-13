"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReorderable = isReorderable;
exports.startBlockReorder = startBlockReorder;
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var dropGeometry_1 = require("@/utils/dropGeometry");
var DRAG_THRESHOLD = 4; // px before a mousedown becomes a drag
var GHOST_OPACITY = 0.9;
// Absolutely-positioned blocks free-move; component-owned blocks are locked.
function isReorderable(block) {
    return (!block.isRoot() &&
        !block.isMovable() &&
        !block.isChildOfComponent &&
        Boolean(block.getParentBlock()));
}
// Pointer-based on-canvas reorder with zero layout jitter: the canvas DOM is
// never mutated during the drag. On pickup the source is hidden in place and a
// floating ghost follows the cursor; each move only measures the target's
// children (read-only) and repositions a fixed overlay line. The insertion index
// is computed in 2D reading order, so flex rows/columns, wrapped flex and grid
// all share one path. The tree is mutated once, on release, as a single history
// entry.
function startBlockReorder(event, block, breakpoint) {
    var _a, _b, _c, _d, _e, _f, _g;
    var canvasStore = (0, canvasStore_1.default)();
    var findBlock = function (id) { var _a, _b; return (_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.findBlock(id)) !== null && _b !== void 0 ? _b : null; };
    var getScale = function () { var _a, _b; return ((_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.canvasProps) === null || _b === void 0 ? void 0 : _b.scale) || 1; };
    // Measure the elements of the breakpoint the drag actually happens in — the
    // same block renders one element per visible breakpoint (each a separate
    // canvas with different layout), so a hard-coded active breakpoint would
    // measure the wrong layout when dragging on, e.g., the mobile canvas.
    var dragBreakpoint = breakpoint ||
        ((_c = (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.closest) === null || _b === void 0 ? void 0 : _b.call(_a, ".__builder_component__")) === null || _c === void 0 ? void 0 : _c.dataset.breakpoint) ||
        ((_d = canvasStore.activeCanvas) === null || _d === void 0 ? void 0 : _d.activeBreakpoint) ||
        ((_e = canvasStore.activeCanvas) === null || _e === void 0 ? void 0 : _e.hoveredBreakpoint) ||
        "desktop";
    var getContainerEl = function (target) {
        return document.querySelector(".__builder_component__[data-block-id=\"".concat(target.blockId, "\"][data-breakpoint=\"").concat(dragBreakpoint, "\"]"));
    };
    var sourceEl = getContainerEl(block);
    if (!sourceEl)
        return;
    var startX = event.clientX;
    var startY = event.clientY;
    var sourceRect = sourceEl.getBoundingClientRect();
    var grabOffsetX = startX - sourceRect.left;
    var grabOffsetY = startY - sourceRect.top;
    var originalParentId = (_g = (_f = block.getParentBlock()) === null || _f === void 0 ? void 0 : _f.blockId) !== null && _g !== void 0 ? _g : null;
    var started = false;
    var ghost = null;
    var pauseId = null;
    var prevSourceVisibility = "";
    var dropParent = null;
    var dropIndex = null;
    var beginDrag = function () {
        var _a, _b;
        started = true;
        canvasStore.isDragging = true;
        // selecting on grab means point-drag doubles as selection — no need to
        // click-to-select first. preventClick stops the trailing click from
        // toggling the selection back off.
        canvasStore.selectBlock(block, null);
        canvasStore.preventClick = true;
        pauseId = (_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.pause();
        var scale = getScale();
        // clone before hiding the source below
        ghost = document.createElement("div");
        ghost.id = "reorder-ghost";
        var clone = sourceEl.cloneNode(true);
        clone.style.margin = "0";
        ghost.appendChild(clone);
        Object.assign(ghost.style, {
            position: "fixed",
            left: "0",
            top: "0",
            width: "".concat(sourceRect.width / scale, "px"),
            height: "".concat(sourceRect.height / scale, "px"),
            transformOrigin: "top left",
            transform: "translate(".concat(sourceRect.left, "px, ").concat(sourceRect.top, "px) scale(").concat(scale, ")"),
            opacity: String(GHOST_OPACITY),
            pointerEvents: "none",
            zIndex: "999999",
            boxShadow: "0 12px 32px rgba(0,0,0,0.24), 0 2px 6px rgba(0,0,0,0.12)",
            borderRadius: "6px",
            overflow: "hidden",
            willChange: "transform",
        });
        document.body.appendChild(ghost);
        // Hide the source WITHOUT removing it from the flow (visibility, not
        // display) so it keeps its slot. Nothing shifts on pickup — critical for
        // grids, where display:none would renumber every following cell — and since
        // visibility:hidden elements are skipped by elementFromPoint and excluded
        // from measurement, the layout is completely frozen for the whole drag.
        prevSourceVisibility = sourceEl.style.visibility;
        sourceEl.style.visibility = "hidden";
    };
    // Is `candidate` the dragged block itself, or somewhere inside its subtree?
    var isSelfOrInsideDragged = function (candidate) {
        var node = candidate;
        while (node) {
            if (node.blockId === block.blockId)
                return true;
            node = node.getParentBlock();
        }
        return false;
    };
    // Fraction of a container-child's main-axis extent, at EACH end, reserved for
    // "reorder beside me" instead of "nest inside me". Without this you could only
    // reorder past a child container by hitting the hairline gap/edge between
    // siblings — impossible when they're flush. 0.3 → the outer 30% on each side
    // reorders (so ~60% of a flush row is reorderable), the inner 40% nests.
    var EDGE_REORDER_BAND = 0.3;
    // EMPTY child containers default to before/after (you usually want to add a
    // sibling next to an existing child, not drop inside it) — nesting is reserved
    // for a small dead-centre core. Populated containers keep the normal band.
    var EDGE_REORDER_BAND_EMPTY = 0.42;
    // Is the pointer in `childEl`'s outer edge band (NOT its inner core), measured
    // along its parent's layout axis? In the edge band = "reorder beside this
    // container"; in the core = "nest into it".
    var inEdgeBand = function (childEl, parentBlock, clientX, clientY, bandFraction) {
        var parentEl = getContainerEl(parentBlock);
        var dir = parentEl ? (0, dropGeometry_1.getLayoutDirection)(getComputedStyle(parentEl)) : "column";
        var r = childEl.getBoundingClientRect();
        var lo = dir === "row" ? r.left : r.top;
        var hi = dir === "row" ? r.right : r.bottom;
        var pointer = dir === "row" ? clientX : clientY;
        var band = (hi - lo) * bandFraction;
        return pointer < lo + band || pointer > hi - band;
    };
    // Auto-detect intent from whatever is under the cursor, no modifier keys.
    // Decided from the DEEPEST hovered block only (single level — deeper climbing
    // wrongly pops out of tall containers like a grid's lower row):
    //  - a childless leaf → reorder among its siblings (in its parent)
    //  - a container hovered on its INNER CORE → nest inside it
    //  - a container hovered on its outer EDGE BAND → reorder beside it in its parent
    //    (this is what makes a flush row/column of containers reorderable without a
    //    gap to aim at)
    //  - a gap between items → elementFromPoint already returns the parent
    // Returns the resolved block AND its element so the caller doesn't re-query.
    var resolveTargetContainer = function (clientX, clientY) {
        var el = document.elementFromPoint(clientX, clientY);
        var hovered = el === null || el === void 0 ? void 0 : el.closest(".__builder_component__");
        var raw = ((hovered === null || hovered === void 0 ? void 0 : hovered.dataset.blockId) && findBlock(hovered.dataset.blockId)) || null;
        while (raw && isSelfOrInsideDragged(raw))
            raw = raw.getParentBlock();
        if (!raw)
            return null;
        var rawEl = getContainerEl(raw);
        var nonDragged = raw.getChildren().filter(function (c) { return c.blockId !== block.blockId; });
        // Dropping back into the source's OWN parent when the source is its only
        // child is a no-op — so never nest there; fall through to before/after it.
        // This is what lets you drag a deeply-nested block OUT: hovering the (now
        // apparently empty) parent it came from resolves to its grandparent.
        var isEmptySourceParent = raw.blockId === originalParentId && nonDragged.length === 0;
        // Any container that can hold children is a nest target — including one the
        // same size as (or smaller than) the dragged block. The edge band below is
        // what separates nest (dead-centre) from reorder-beside (edges), so no size
        // heuristic is needed; empty containers just get a wider band (mostly
        // before/after, centre nests).
        var canNest = !isEmptySourceParent && raw.canHaveChildren() && !!rawEl;
        // Empty containers use a wider band so they default to before/after.
        var parent = raw.getParentBlock();
        if (canNest && rawEl && parent) {
            var band = nonDragged.length === 0 ? EDGE_REORDER_BAND_EMPTY : EDGE_REORDER_BAND;
            if (inEdgeBand(rawEl, parent, clientX, clientY, band))
                canNest = false;
        }
        var container = canNest ? raw : parent || raw;
        while (container && (!container.canHaveChildren() || isSelfOrInsideDragged(container))) {
            container = container.getParentBlock();
        }
        if (!container)
            return null;
        var parentEl = container === raw ? rawEl : getContainerEl(container);
        if (!parentEl)
            return null;
        return { parent: container, parentEl: parentEl };
    };
    var clearTarget = function () {
        dropParent = null;
        dropIndex = null;
        canvasStore.clearReorderTarget();
    };
    var updateTarget = function (clientX, clientY) {
        var resolved = resolveTargetContainer(clientX, clientY);
        if (!resolved) {
            clearTarget();
            return;
        }
        var parent = resolved.parent, parentEl = resolved.parentEl;
        var style = getComputedStyle(parentEl);
        var direction = (0, dropGeometry_1.getLayoutDirection)(style);
        var pointerMain = direction === "row" ? clientX : clientY;
        var pointerCross = direction === "row" ? clientY : clientX;
        var rects = (0, dropGeometry_1.collectChildRects)(parentEl, direction, sourceEl);
        var lines = (0, dropGeometry_1.clusterLines)(rects);
        var index = (0, dropGeometry_1.computeReadingOrderIndex)(lines, pointerMain, pointerCross);
        var cr = parentEl.getBoundingClientRect();
        dropParent = parent;
        dropIndex = index;
        var t = canvasStore.reorderTarget;
        t.active = true;
        t.isComponentParent = parent.isExtendedFromComponent();
        t.isSameContainer = parent.blockId === originalParentId;
        t.containerRect = { top: cr.top, left: cr.left, width: cr.width, height: cr.height };
        t.line = (0, dropGeometry_1.computeDropIndicator)(lines, index, cr, style, direction, {
            width: sourceRect.width,
            height: sourceRect.height,
        });
    };
    var positionGhost = function (clientX, clientY) {
        if (!ghost)
            return;
        ghost.style.transform = "translate(".concat(clientX - grabOffsetX, "px, ").concat(clientY - grabOffsetY, "px) scale(").concat(getScale(), ")");
    };
    var commit = function () {
        if (dropParent === null || dropIndex === null)
            return;
        var oldParent = block.getParentBlock();
        if (!oldParent)
            return;
        if (dropParent.blockId === oldParent.blockId) {
            // moveChild removes then re-inserts, so dropIndex (position among the
            // non-dragged siblings) maps directly.
            oldParent.moveChild(block, dropIndex);
        }
        else {
            oldParent.removeChild(block);
            dropParent.addChild(block, dropIndex, false);
        }
        canvasStore.selectBlock(block, null);
    };
    var cleanup = function () {
        var _a, _b;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("keydown", onKey);
        if (ghost)
            ghost.remove();
        ghost = null;
        if (started) {
            sourceEl.style.visibility = prevSourceVisibility;
            canvasStore.isDragging = false;
        }
        canvasStore.clearReorderTarget();
        if (pauseId) {
            // Resume WITHOUT committing: the tree mutation in commit() runs in this
            // same mouseup tick, so its deep-watch flush is still pending and the
            // natural (debounced) watcher records exactly one history entry once
            // unpaused. Passing commitNow here would double it. A no-op drag leaves
            // the tree unchanged, so the watcher records nothing.
            (_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.resume(pauseId, false);
            pauseId = null;
        }
    };
    var onMove = function (e) {
        if (!started) {
            if (Math.abs(e.clientX - startX) < DRAG_THRESHOLD && Math.abs(e.clientY - startY) < DRAG_THRESHOLD) {
                return;
            }
            beginDrag();
        }
        e.preventDefault();
        positionGhost(e.clientX, e.clientY);
        updateTarget(e.clientX, e.clientY);
    };
    var onUp = function () {
        if (started && dropParent !== null && dropIndex !== null) {
            commit();
        }
        cleanup();
    };
    var onKey = function (e) {
        if (e.key === "Escape") {
            dropParent = null;
            dropIndex = null;
            cleanup();
        }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("keydown", onKey);
}
//# sourceMappingURL=useBlockReorder.js.map