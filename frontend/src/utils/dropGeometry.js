"use strict";
// Layout-aware drop geometry shared by the on-canvas reorder engine and the
// panel drop zone. All coordinates are in client (screen) space so callers can
// position fixed overlays directly and mix live getBoundingClientRect values
// with cursor clientX/clientY without worrying about canvas scale/translate.
//
// The reorder engine never mutates the canvas DOM while dragging — it measures
// the (static) children once per pointer move and draws an overlay indicator.
// So everything here is pure geometry: it takes rects + a pointer and returns
// an insertion index / an indicator line, and is fully layout-aware (flex row,
// flex column, wrapped flex, and CSS grid all fall out of the same 2D model).
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLayoutDirection = getLayoutDirection;
exports.collectChildRects = collectChildRects;
exports.clusterLines = clusterLines;
exports.computeReadingOrderIndex = computeReadingOrderIndex;
exports.computeDropIndicator = computeDropIndicator;
var BUILDER_SELECTOR = ".__builder_component__";
function getLayoutDirection(style) {
    var display = style.display;
    if (display === "flex" || display === "inline-flex") {
        return style.flexDirection.includes("row") ? "row" : "column";
    }
    else if (display === "grid" || display === "inline-grid") {
        return style.gridAutoFlow.includes("column") ? "column" : "row";
    }
    // block-level and inline children stack vertically
    return "column";
}
// Snapshot the direct block children of a container along the given axis.
// `excludeEl` (the block currently being dragged) is skipped so its own slot
// doesn't influence the computed index. Returned in DOM order, which — for
// every layout the builder produces — matches visual reading order.
function collectChildRects(parentEl, direction, excludeEl) {
    var children = Array.from(parentEl.querySelectorAll(":scope > ".concat(BUILDER_SELECTOR)));
    var rects = [];
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var el = children_1[_i];
        // Skip only the dragged element itself — not an ancestor that merely
        // contains it, so dragging a nested block out counts the path-child as a
        // sibling drop target.
        if (excludeEl && el === excludeEl)
            continue;
        var rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0)
            continue;
        if (direction === "row") {
            rects.push({
                start: rect.left,
                end: rect.right,
                mid: rect.left + rect.width / 2,
                crossStart: rect.top,
                crossEnd: rect.bottom,
            });
        }
        else {
            rects.push({
                start: rect.top,
                end: rect.bottom,
                mid: rect.top + rect.height / 2,
                crossStart: rect.left,
                crossEnd: rect.right,
            });
        }
    }
    return rects;
}
// Two rects share a visual line when they overlap on the cross axis by more than
// half of the smaller one — robust to ragged item heights in a grid row.
function sameLine(a, b) {
    var overlap = Math.min(a.crossEnd, b.crossEnd) - Math.max(a.crossStart, b.crossStart);
    var minSize = Math.min(a.crossEnd - a.crossStart, b.crossEnd - b.crossStart) || 1;
    return overlap > minSize * 0.5;
}
// Group children into visual lines (grid rows for a row layout, the single
// stacked column for a column/flex layout) in reading order. A one-line result
// means a plain flex row/column; multiple lines means a wrapped flex or a grid.
// Because DOM order is reading order, a new line simply starts whenever the next
// child no longer overlaps the current line's cross band.
function clusterLines(rects) {
    var lines = [];
    var current = [];
    var _loop_1 = function (r) {
        var onCurrent = current.length > 0 && current.some(function (c) { return sameLine(c, r); });
        if (!onCurrent && current.length) {
            lines.push(current);
            current = [];
        }
        current.push(r);
    };
    for (var _i = 0, rects_1 = rects; _i < rects_1.length; _i++) {
        var r = rects_1[_i];
        _loop_1(r);
    }
    if (current.length)
        lines.push(current);
    // order items within each line by their main-axis start (usually already so)
    for (var _a = 0, lines_1 = lines; _a < lines_1.length; _a++) {
        var line = lines_1[_a];
        line.sort(function (a, b) { return a.start - b.start; });
    }
    return lines;
}
function lineBand(line) {
    return {
        start: Math.min.apply(Math, line.map(function (r) { return r.crossStart; })),
        end: Math.max.apply(Math, line.map(function (r) { return r.crossEnd; })),
    };
}
// 2D reading-order insertion index: how many children come before the pointer,
// scanning line-by-line down the cross axis and item-by-item along the main
// axis. Reduces to a simple midpoint scan for a single flex line, and handles
// wrapped flex / grid without any special-casing. Monotonic within a line (the
// index only changes when the pointer crosses an item midpoint or a line
// boundary), so there's no oscillation at the edges.
function computeReadingOrderIndex(lines, pointerMain, pointerCross) {
    var index = 0;
    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
        var line = lines_2[_i];
        var band = lineBand(line);
        if (pointerCross > band.end) {
            // the whole line sits above the pointer → it's entirely before it
            index += line.length;
            continue;
        }
        if (pointerCross < band.start) {
            // this line (and every later one) is below the pointer → stop
            break;
        }
        // pointer is within this line's band → count items to its left
        for (var _a = 0, line_1 = line; _a < line_1.length; _a++) {
            var item = line_1[_a];
            if (pointerMain > item.mid)
                index++;
            else
                break;
        }
        return index;
    }
    return index;
}
// Where to draw the insertion line for a resolved index. Uses the two children
// bracketing the insertion point:
//   - both present and on the same line → centre the line in the gap between
//     them, spanning their shared cross band (the clean flex-row/column look)
//   - only a following child (line start, or the very first slot) → a caret at
//     its leading edge, spanning that cell — reads as "insert before this cell",
//     which is what makes grid drops legible
//   - only a preceding child (very last slot) → a caret at its trailing edge
//   - no children (empty container) → place it where the first child will land,
//     honouring the container's justify-content (main axis) and align-items
//     (cross axis), sized to the dragged block when known
// The caller passes the container's measured rect + computed style so the drag
// hot path doesn't re-measure them. `sourceSize` (the dragged block's screen-px
// box) lets the empty-container indicator match the incoming block's extent.
function computeDropIndicator(lines, index, parentRect, style, direction, sourceSize) {
    var orientation = direction === "row" ? "vertical" : "horizontal";
    var flat = lines.flat();
    var build = function (mainPos, crossStart, crossEnd) {
        var length = Math.max(crossEnd - crossStart, 4);
        return orientation === "vertical"
            ? { orientation: orientation, left: mainPos, top: crossStart, length: length }
            : { orientation: orientation, left: crossStart, top: mainPos, length: length };
    };
    if (flat.length === 0) {
        var padTop = parseFloat(style.paddingTop) || 0;
        var padBottom = parseFloat(style.paddingBottom) || 0;
        var padLeft = parseFloat(style.paddingLeft) || 0;
        var padRight = parseFloat(style.paddingRight) || 0;
        // content-box extents along the main + cross axes
        var mainLo = direction === "row" ? parentRect.left + padLeft : parentRect.top + padTop;
        var mainHi = direction === "row" ? parentRect.right - padRight : parentRect.bottom - padBottom;
        var crossLo = direction === "row" ? parentRect.top + padTop : parentRect.left + padLeft;
        var crossHi = direction === "row" ? parentRect.bottom - padBottom : parentRect.right - padRight;
        // main-axis position of the line ← justify-content
        var justify = style.justifyContent;
        var mainPos = void 0;
        if (justify === "center" || justify === "space-around" || justify === "space-evenly") {
            mainPos = (mainLo + mainHi) / 2;
        }
        else if (justify === "flex-end" || justify === "end" || justify === "right") {
            mainPos = mainHi;
        }
        else {
            mainPos = mainLo;
        }
        // cross-axis span of the line ← align-items (sized to the dragged block)
        var align = style.alignItems;
        var sourceCross = sourceSize ? (direction === "row" ? sourceSize.height : sourceSize.width) : 0;
        var cs = crossLo;
        var ce = crossHi;
        if (sourceCross > 0 && align !== "stretch" && align !== "normal" && align !== "") {
            if (align === "center") {
                var c = (crossLo + crossHi) / 2;
                cs = c - sourceCross / 2;
                ce = c + sourceCross / 2;
            }
            else if (align === "flex-end" || align === "end") {
                cs = crossHi - sourceCross;
                ce = crossHi;
            }
            else {
                cs = crossLo;
                ce = crossLo + sourceCross;
            }
            cs = Math.max(cs, crossLo);
            ce = Math.min(ce, crossHi);
        }
        return build(mainPos, cs, ce);
    }
    var prev = index > 0 ? flat[index - 1] : null;
    var next = index < flat.length ? flat[index] : null;
    if (prev && next && sameLine(prev, next)) {
        var mid = (prev.end + next.start) / 2;
        return build(mid, Math.min(prev.crossStart, next.crossStart), Math.max(prev.crossEnd, next.crossEnd));
    }
    if (next) {
        return build(next.start, next.crossStart, next.crossEnd);
    }
    // prev is guaranteed here (flat.length > 0 and next is null)
    return build(prev.end, prev.crossStart, prev.crossEnd);
}
//# sourceMappingURL=dropGeometry.js.map