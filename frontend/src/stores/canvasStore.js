"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var snapshot_1 = require("@/data/snapshot");
var helpers_1 = require("@/utils/helpers");
var frappe_ui_1 = require("frappe-ui");
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var PREVIEW_TOAST_ID = "version-preview-readonly";
var useCanvasStore = (0, pinia_1.defineStore)("canvasStore", {
    state: function () { return ({
        activeCanvas: null,
        requiresConfirmationForCopyingEntirePage: true,
        copyEntirePage: false,
        layerDraggingOverBlock: null,
        preventClick: false,
        isMarqueeActive: false,
        guides: {
            showX: false,
            showY: false,
            x: 0,
            y: 0,
        },
        isDragging: false,
        isDropping: false,
        dropTarget: {
            x: null,
            y: null,
            placeholder: null,
            parentBlock: null,
            index: null,
        },
        // On-canvas block reordering (pointer-based). Separate from dropTarget
        // (panel → canvas drops). The overlay DropIndicator reads this; nothing here
        // touches the canvas DOM, so the layout stays frozen during a drag.
        reorderTarget: {
            active: false,
            // insertion line geometry, screen px
            line: null,
            containerRect: null,
            isComponentParent: false,
            // dropping into the block's own container (reorder) vs a different one
            isSameContainer: false,
        },
        editableBlock: null,
        editingContentType: "html", // TODO: Remove js and css
        editingMode: "page",
        settingPage: false,
        showEditorDialog: false,
        fragmentData: {
            block: null,
            fragmentType: null,
            saveAction: null,
            saveActionLabel: null,
            fragmentName: null,
            fragmentId: null,
            showUsageCount: false,
        },
        versionPreviewBlock: null,
        previewSnapshotName: null,
        draftRootBackup: null,
    }); },
    actions: {
        // Preview a snapshot on the live page canvas itself so pan/zoom stay in place.
        // Setting versionPreviewBlock flips the canvas to read-only (PageBuilder.vue
        // watcher), which hibernates history — so swapping the root in/out never touches
        // the draft's content or undo stack. We just stash the draft root to restore it.
        previewVersion: function (snapshotName) {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, snapshot_1.getVersionedDoc)(snapshotName)];
                        case 1:
                            doc = _a.sent();
                            this.previewVersionBlocks(((doc === null || doc === void 0 ? void 0 : doc.draft_blocks) || (doc === null || doc === void 0 ? void 0 : doc.blocks)), snapshotName);
                            return [2 /*return*/];
                    }
                });
            });
        },
        // preview raw blocks JSON under a preview key (e.g. the live published version)
        previewVersionBlocks: function (blocksJSON, previewName) {
            var _a;
            var blocks = JSON.parse(blocksJSON || "[]");
            if (!blocks[0] || !this.activeCanvas)
                return;
            var previewRoot = (0, helpers_1.getBlockInstance)(blocks[0]);
            if (!this.versionPreviewBlock) {
                this.draftRootBackup = (_a = this.activeCanvas.getRootBlock()) !== null && _a !== void 0 ? _a : null;
            }
            this.activeCanvas.setRootBlock(previewRoot, false, false);
            this.versionPreviewBlock = previewRoot;
            this.previewSnapshotName = previewName;
            frappe_ui_1.toast.info("Read-only preview · Use <b>Restore</b> to load this version.", {
                id: PREVIEW_TOAST_ID,
                duration: Infinity,
                dismissible: false,
                closeButton: false,
                position: "bottom-center",
            });
        },
        clearVersionPreview: function () {
            if (this.versionPreviewBlock && this.draftRootBackup && this.activeCanvas) {
                this.activeCanvas.setRootBlock(this.draftRootBackup, false, false);
            }
            this.draftRootBackup = null;
            this.versionPreviewBlock = null;
            this.previewSnapshotName = null;
            frappe_ui_1.toast.dismiss(PREVIEW_TOAST_ID);
        },
        clearBlocks: function () {
            var _a;
            (_a = this.activeCanvas) === null || _a === void 0 ? void 0 : _a.clearCanvas();
        },
        pushBlocks: function (blocks, resetHistory) {
            var _a, _b;
            if (resetHistory === void 0) { resetHistory = true; }
            var parent = (_a = this.activeCanvas) === null || _a === void 0 ? void 0 : _a.getRootBlock();
            var firstBlock = (0, helpers_1.getBlockInstance)(blocks[0]);
            if (this.editingMode === "page" && firstBlock.isRoot() && ((_b = this.activeCanvas) === null || _b === void 0 ? void 0 : _b.block)) {
                this.activeCanvas.setRootBlock(firstBlock, false, resetHistory);
            }
            else {
                for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
                    var block = blocks_1[_i];
                    parent === null || parent === void 0 ? void 0 : parent.addChild(block);
                }
            }
        },
        getRootBlock: function () {
            var _a;
            return (_a = this.activeCanvas) === null || _a === void 0 ? void 0 : _a.getRootBlock();
        },
        getPageBlocks: function () {
            var _a;
            return [(_a = this.activeCanvas) === null || _a === void 0 ? void 0 : _a.getRootBlock()];
        },
        selectBlock: function (block, e, scrollLayerIntoView, scrollBlockIntoView) {
            var _a, _b, _c, _d;
            if (scrollLayerIntoView === void 0) { scrollLayerIntoView = true; }
            if (scrollBlockIntoView === void 0) { scrollBlockIntoView = false; }
            if (this.settingPage) {
                return;
            }
            if (e && e.shiftKey) {
                (_a = this.activeCanvas) === null || _a === void 0 ? void 0 : _a.selectBlockRange(block);
            }
            else if (e && e.metaKey) {
                (_b = this.activeCanvas) === null || _b === void 0 ? void 0 : _b.toggleBlockSelection(block);
            }
            else {
                (_c = this.activeCanvas) === null || _c === void 0 ? void 0 : _c.selectBlock(block);
            }
            if (scrollLayerIntoView) {
                var align_1 = scrollLayerIntoView === true ? "center" : scrollLayerIntoView;
                (0, vue_1.nextTick)(function () {
                    var _a;
                    (_a = document
                        .querySelector("[data-block-layer-id=\"".concat(block.blockId, "\"] .scroll-into-view-anchor"))) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "instant", block: align_1, inline: "center" });
                });
            }
            this.editableBlock = null;
            if (scrollBlockIntoView) {
                (_d = this.activeCanvas) === null || _d === void 0 ? void 0 : _d.scrollBlockIntoView(block);
            }
        },
        editHTML: function (block) {
            var _this = this;
            this.editableBlock = block;
            this.editingContentType = "html";
            (0, vue_1.nextTick)(function () {
                _this.showEditorDialog = true;
            });
        },
        editOnCanvas: function (block, fragmentType, saveAction, saveActionLabel, fragmentName, fragmentId, showUsageCount) {
            if (saveActionLabel === void 0) { saveActionLabel = "Save"; }
            var blockCopy = (0, helpers_1.getBlockCopy)(block, true);
            this.fragmentData = {
                block: blockCopy,
                fragmentType: fragmentType,
                saveAction: saveAction,
                saveActionLabel: saveActionLabel,
                fragmentName: fragmentName || block.getBlockDescription(),
                fragmentId: fragmentId || block.blockId,
                showUsageCount: showUsageCount || false,
            };
            this.editingMode = "fragment";
        },
        exitFragmentMode: function (e) {
            return __awaiter(this, void 0, void 0, function () {
                var exit;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (this.editingMode === "page") {
                                return [2 /*return*/];
                            }
                            e === null || e === void 0 ? void 0 : e.preventDefault();
                            if (!((_a = this.activeCanvas) === null || _a === void 0 ? void 0 : _a.isDirty)) return [3 /*break*/, 2];
                            return [4 /*yield*/, (0, helpers_1.confirm)("Are you sure you want to exit without saving?")];
                        case 1:
                            exit = _c.sent();
                            if (!exit) {
                                return [2 /*return*/];
                            }
                            _c.label = 2;
                        case 2:
                            (_b = this.activeCanvas) === null || _b === void 0 ? void 0 : _b.clearSelection();
                            this.editingMode = "page";
                            // reset fragmentData
                            this.fragmentData = {
                                block: null,
                                fragmentType: null,
                                saveAction: null,
                                saveActionLabel: null,
                                fragmentName: null,
                                fragmentId: null,
                                showUsageCount: false,
                            };
                            return [2 /*return*/];
                    }
                });
            });
        },
        // Drag and drop handling
        handleDragStart: function (ev) {
            var _a;
            if (ev.target && ev.dataTransfer) {
                this.isDragging = true;
                var ghostScale = (_a = this.activeCanvas) === null || _a === void 0 ? void 0 : _a.canvasProps.scale;
                // Clone the entire draggable element
                var dragElement = ev.target;
                if (!dragElement)
                    return;
                var ghostDiv_1 = document.createElement("div");
                var ghostElement = dragElement.cloneNode(true);
                ghostDiv_1.appendChild(ghostElement);
                ghostDiv_1.id = "ghost";
                ghostDiv_1.style.position = "fixed";
                ghostDiv_1.style.transform = "scale(".concat(ghostScale || 1, ")");
                ghostDiv_1.style.pointerEvents = "none";
                ghostDiv_1.style.zIndex = "99999";
                // Append the ghostDiv to the DOM
                document.body.appendChild(ghostDiv_1);
                // Wait for the next frame to ensure the ghostDiv is rendered
                requestAnimationFrame(function () {
                    var _a;
                    (_a = ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.setDragImage(ghostDiv_1, 0, 0);
                    // Clean up the ghostDiv after a short delay
                    setTimeout(function () {
                        document.body.removeChild(ghostDiv_1);
                    }, 0);
                });
                this.insertDropPlaceholder();
            }
        },
        handleDragEnd: function () {
            // check flag to avoid race condition with async onDrop
            if (!this.isDropping) {
                this.resetDropTarget();
            }
        },
        resetDropTarget: function () {
            this.removeDropPlaceholder();
            this.dropTarget = {
                x: null,
                y: null,
                placeholder: null,
                parentBlock: null,
                index: null,
            };
            this.isDragging = false;
            this.isDropping = false;
        },
        insertDropPlaceholder: function () {
            // append placeholder component to the dom directly
            // to avoid re-rendering the whole canvas
            if (this.dropTarget.placeholder)
                return;
            var element = document.createElement("div");
            element.id = "placeholder";
            var root = document.querySelector(".__builder_component__[data-block-id='root']");
            if (root) {
                this.dropTarget.placeholder = root.appendChild(element);
            }
            return this.dropTarget.placeholder;
        },
        removeDropPlaceholder: function () {
            var placeholder = document.getElementById("placeholder");
            if (placeholder) {
                placeholder.remove();
            }
        },
        clearReorderTarget: function () {
            this.reorderTarget = {
                active: false,
                line: null,
                containerRect: null,
                isComponentParent: false,
                isSameContainer: false,
            };
        },
    },
});
exports.default = useCanvasStore;
//# sourceMappingURL=canvasStore.js.map