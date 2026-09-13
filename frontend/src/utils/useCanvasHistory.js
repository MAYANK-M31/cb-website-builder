"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCanvasHistory = useCanvasHistory;
var helpers_1 = require("@/utils/helpers");
var core_1 = require("@vueuse/core");
var vue_1 = require("vue");
var CAPACITY = 500;
var DEBOUNCE_DELAY = 100;
function useCanvasHistory(source, selectedBlockIds) {
    var undoStack = (0, vue_1.ref)([]);
    var redoStack = (0, vue_1.ref)([]);
    var last = (0, vue_1.ref)(createHistoryRecord());
    var pauseIdSet = new Set();
    // when disabled (e.g. the canvas is read-only) history is
    // fully inert: nothing is recorded and undo/redo are no-ops. Re-enabled by the
    // caller when the canvas returns to edit mode. Distinct from the transient,
    // reference-counted pause()/resume() used during drag/resize.
    var enabled = (0, vue_1.ref)(true);
    function disable() {
        enabled.value = false;
    }
    function enable() {
        enabled.value = true;
    }
    var _a = (0, core_1.pausableFilter)((0, core_1.debounceFilter)(DEBOUNCE_DELAY)), blockWatcherFilter = _a.eventFilter, pauseBlockWatcher = _a.pause, resumeBlockWatcher = _a.resume, isTracking = _a.isActive;
    var _b = (0, core_1.pausableFilter)(), selectionWatherFilter = _b.eventFilter, pauseSelectionWatcher = _b.pause, resumeSelectionWatcher = _b.resume;
    var _c = (0, core_1.watchIgnorable)(source, commit, {
        deep: true,
        eventFilter: blockWatcherFilter,
    }), ignoreBlockUpdates = _c.ignoreUpdates, ignorePrevAsyncBlockUpdates = _c.ignorePrevAsyncUpdates, stopBlockWatcher = _c.stop;
    var _d = (0, core_1.watchIgnorable)(selectedBlockIds, updateSelections, {
        deep: true,
        eventFilter: selectionWatherFilter,
    }), ignoreSelectedBlockUpdates = _d.ignoreUpdates, ignorePrevSelectedBlockUpdates = _d.ignorePrevAsyncUpdates, stopSelectedBlockUpdates = _d.stop;
    function commit() {
        if (!enabled.value)
            return;
        undoStack.value.unshift(last.value);
        last.value = createHistoryRecord();
        if (undoStack.value.length > CAPACITY) {
            undoStack.value.splice(CAPACITY, Number.POSITIVE_INFINITY);
        }
        if (redoStack.value.length) {
            redoStack.value.splice(0, redoStack.value.length);
        }
    }
    function updateSelections() {
        last.value.selectedBlockIds = new Set(selectedBlockIds.value);
    }
    function createHistoryRecord() {
        return {
            block: (0, helpers_1.getBlockString)(source.value),
            selectedBlockIds: selectedBlockIds.value,
        };
    }
    function setSource(value) {
        ignorePrevAsyncBlockUpdates();
        ignoreBlockUpdates(function () {
            source.value = (0, helpers_1.getBlockInstance)(value.block);
        });
        ignorePrevSelectedBlockUpdates();
        ignoreSelectedBlockUpdates(function () {
            selectedBlockIds.value = new Set(value.selectedBlockIds);
        });
        last.value = value;
    }
    // Swap the canvas root without recording it (used for version preview: show a
    // snapshot, then restore the draft). The undo stack and baseline are left intact,
    // so undo/redo keep working on the draft once preview ends.
    function silentSetSource(block) {
        ignorePrevAsyncBlockUpdates();
        ignoreBlockUpdates(function () {
            source.value = block;
        });
    }
    function undo() {
        if (!enabled.value)
            return;
        var state = undoStack.value.shift();
        if (state) {
            redoStack.value.unshift(last.value);
            setSource(state);
        }
    }
    function canUndo() {
        return enabled.value && undoStack.value.length > 0;
    }
    function redo() {
        if (!enabled.value)
            return;
        var state = redoStack.value.shift();
        if (state) {
            undoStack.value.unshift(last.value);
            setSource(state);
        }
    }
    function canRedo() {
        return enabled.value && redoStack.value.length > 0;
    }
    function stop() {
        stopBlockWatcher();
        stopSelectedBlockUpdates();
    }
    var clear = function () {
        undoStack.value.splice(0, undoStack.value.length);
        redoStack.value.splice(0, redoStack.value.length);
    };
    function dispose() {
        stop();
        clear();
    }
    function pause() {
        pauseBlockWatcher();
        pauseSelectionWatcher();
        var pauseId = (0, helpers_1.generateId)();
        pauseIdSet.add(pauseId);
        return pauseId;
    }
    function resumeTracking() {
        resumeBlockWatcher();
        resumeSelectionWatcher();
    }
    function resume(pauseId, commitNow, force) {
        if (pauseId && pauseIdSet.has(pauseId)) {
            pauseIdSet.delete(pauseId);
        }
        else if (!force) {
            return;
        }
        if (pauseIdSet.size && !force) {
            return;
        }
        pauseIdSet.clear();
        resumeTracking();
        if (commitNow)
            commit();
    }
    function batch(callback) {
        var pauseId = pause();
        callback();
        resume(pauseId, true);
    }
    return {
        undo: undo,
        redo: redo,
        pause: pause,
        resume: resume,
        batch: batch,
        canUndo: canUndo,
        canRedo: canRedo,
        dispose: dispose,
        disable: disable,
        enable: enable,
        silentSetSource: silentSetSource,
        undoStack: undoStack,
        redoStack: redoStack,
        isTracking: isTracking,
    };
}
//# sourceMappingURL=useCanvasHistory.js.map