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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCanvasDropZone = useCanvasDropZone;
var blockTemplateStore_1 = __importDefault(require("@/stores/blockTemplateStore"));
var builderStore_1 = __importDefault(require("@/stores/builderStore"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var componentStore_1 = __importDefault(require("@/stores/componentStore"));
var dropGeometry_1 = require("@/utils/dropGeometry");
var helpers_1 = require("@/utils/helpers");
var core_1 = require("@vueuse/core");
var frappe_1 = require("frappe-ui/frappe");
var blockController_1 = __importDefault(require("./blockController"));
var capture = (0, frappe_1.useTelemetry)().capture;
var builderStore = (0, builderStore_1.default)();
var canvasStore = (0, canvasStore_1.default)();
var componentStore = (0, componentStore_1.default)();
var blockTemplateStore = (0, blockTemplateStore_1.default)();
function useCanvasDropZone(canvasContainer, block, findBlock) {
    var _this = this;
    var isOverDropZone = (0, core_1.useDropZone)(canvasContainer, {
        onDrop: function (files, ev) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (builderStore.readOnlyMode)
                            return [2 /*return*/];
                        canvasStore.isDropping = true;
                        if (!(files && files.length)) return [3 /*break*/, 1];
                        handleFileDrop(files, ev);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, handleBlockDrop(ev)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        canvasStore.isDropping = false;
                        canvasStore.resetDropTarget();
                        return [2 /*return*/];
                }
            });
        }); },
        onOver: function (files, ev) {
            var _a, _b;
            if (builderStore.readOnlyMode)
                return;
            var initialBlock = getInitialParentBlock(ev);
            var shouldReplaceImage = initialBlock === null || initialBlock === void 0 ? void 0 : initialBlock.isImage();
            if (ev.shiftKey || shouldReplaceImage) {
                var parentBlock = shouldReplaceImage ? initialBlock : getBlockToReplace(ev);
                if (parentBlock) {
                    (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.setHoveredBlock(parentBlock.blockId);
                    canvasStore.removeDropPlaceholder();
                    canvasStore.dropTarget.parentBlock = parentBlock;
                    canvasStore.dropTarget.index = 0;
                    canvasStore.dropTarget.x = ev.x;
                    canvasStore.dropTarget.y = ev.y;
                }
            }
            else {
                var _c = findDropTarget(ev), parentBlock = _c.parentBlock, index = _c.index, layoutDirection = _c.layoutDirection;
                if (parentBlock) {
                    (_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.setHoveredBlock(parentBlock.blockId);
                    updateDropTarget(ev, parentBlock, index, layoutDirection);
                }
            }
        },
    }).isOverDropZone;
    var getInitialParentBlock = function (ev) {
        var _a, _b, _c;
        var element = document.elementFromPoint(ev.x, ev.y);
        var targetElement = element.closest(".__builder_component__");
        // set the hoveredBreakpoint from the target element to show placeholder at the correct breakpoint canvas
        var breakpoint = (targetElement === null || targetElement === void 0 ? void 0 : targetElement.dataset.breakpoint) || ((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.activeBreakpoint) || null;
        if (breakpoint !== ((_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.hoveredBreakpoint)) {
            (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.setHoveredBreakpoint(breakpoint);
        }
        var parentBlock = block.value;
        if (targetElement && targetElement.dataset.blockId) {
            parentBlock = findBlock(targetElement.dataset.blockId) || parentBlock;
        }
        return parentBlock;
    };
    var getBlockToReplace = function (ev) {
        var parentBlock = getInitialParentBlock(ev);
        while (parentBlock && parentBlock.isChildOfComponent) {
            parentBlock = parentBlock.getParentBlock();
        }
        return parentBlock;
    };
    var getBlockElement = function (block) {
        var _a, _b;
        var breakpoint = ((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.hoveredBreakpoint) || ((_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.activeBreakpoint);
        return document.querySelector(".__builder_component__[data-block-id=\"".concat(block.blockId, "\"][data-breakpoint=\"").concat(breakpoint, "\"]"));
    };
    var findDropTarget = function (ev) {
        if (canvasStore.dropTarget.x === ev.x && canvasStore.dropTarget.y === ev.y)
            return {};
        var parentBlock = getInitialParentBlock(ev);
        var layoutDirection = "column";
        var index = (parentBlock === null || parentBlock === void 0 ? void 0 : parentBlock.children.length) || 0;
        while (parentBlock && !parentBlock.canHaveChildren()) {
            parentBlock = parentBlock.getParentBlock();
        }
        if (parentBlock) {
            var parentElement = getBlockElement(parentBlock);
            layoutDirection = (0, dropGeometry_1.getLayoutDirection)(window.getComputedStyle(parentElement));
            index = findDropIndex(ev, parentElement, layoutDirection);
        }
        return { parentBlock: parentBlock, index: index, layoutDirection: layoutDirection };
    };
    var findDropIndex = function (ev, parentElement, layoutDirection) {
        var childElements = Array.from(parentElement.querySelectorAll(":scope > .__builder_component__, #placeholder"));
        if (childElements.length === 0)
            return 0;
        var mousePos = layoutDirection === "row" ? ev.clientX : ev.clientY;
        // Get all child positions
        var childPositions = childElements.map(function (child, idx) {
            var rect = child.getBoundingClientRect();
            var midPoint = layoutDirection === "row" ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
            return { midPoint: midPoint, idx: idx };
        });
        // Find the closest child to the mouse position
        var closestIndex = 0;
        var minDistance = Infinity;
        childPositions.forEach(function (_a) {
            var midPoint = _a.midPoint, idx = _a.idx;
            var distance = Math.abs(midPoint - mousePos);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = idx;
            }
        });
        // Determine if we should insert before or after the closest child
        // if mouse is closer to left/top side of the child, insert before, else after
        return mousePos <= childPositions[closestIndex].midPoint ? closestIndex : closestIndex + 1;
    };
    var updateDropTarget = function (ev, parentBlock, index, layoutDirection) {
        var _a;
        var placeholder = canvasStore.dropTarget.placeholder;
        if (!placeholder) {
            // File drops don't trigger dragstart so placeholder is never inserted, insert explicitly if not found
            canvasStore.isDragging = true;
            canvasStore.insertDropPlaceholder();
        }
        if (!parentBlock || !placeholder)
            return;
        var newParent = getBlockElement(parentBlock);
        if (!newParent)
            return;
        if (((_a = canvasStore.dropTarget.parentBlock) === null || _a === void 0 ? void 0 : _a.blockId) === parentBlock.blockId &&
            canvasStore.dropTarget.index === index)
            return;
        placeholder.classList.toggle("vertical-placeholder", layoutDirection === "row");
        placeholder.classList.toggle("horizontal-placeholder", layoutDirection === "column");
        // add the placeholder to the new parent
        // exclude placeholder as its going to move with this update
        var children = Array.from(newParent.children).filter(function (child) { return child.id !== "placeholder"; });
        if (index >= children.length) {
            newParent.appendChild(placeholder);
        }
        else {
            newParent.insertBefore(placeholder, children[index]);
        }
        canvasStore.dropTarget.parentBlock = parentBlock;
        canvasStore.dropTarget.index = index;
        canvasStore.dropTarget.x = ev.x;
        canvasStore.dropTarget.y = ev.y;
    };
    var handleBlockDrop = function (ev) { return __awaiter(_this, void 0, void 0, function () {
        var _a, parentBlock, index, componentName, blockTemplate, component, newBlock, parentParentBlock, newBlock, parentParentBlock, index_1;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = canvasStore.dropTarget, parentBlock = _a.parentBlock, index = _a.index;
                    componentName = (_b = ev.dataTransfer) === null || _b === void 0 ? void 0 : _b.getData("componentName");
                    blockTemplate = (_c = ev.dataTransfer) === null || _c === void 0 ? void 0 : _c.getData("blockTemplate");
                    if (!componentName) return [3 /*break*/, 3];
                    return [4 /*yield*/, componentStore.loadComponent(componentName)];
                case 1:
                    _d.sent();
                    component = componentStore.componentMap.get(componentName);
                    newBlock = (0, helpers_1.getBlockCopy)(component);
                    newBlock.extendFromComponent(componentName);
                    return [4 /*yield*/, componentStore.pinComponentInstance(newBlock, componentName)];
                case 2:
                    _d.sent();
                    // if shift key is pressed, replace parent block with new block
                    if (ev.shiftKey) {
                        if (!parentBlock)
                            return [2 /*return*/];
                        parentParentBlock = parentBlock.getParentBlock();
                        if (!parentParentBlock)
                            return [2 /*return*/];
                        parentParentBlock.replaceChild(parentBlock, newBlock);
                    }
                    else {
                        if (!parentBlock)
                            return [2 /*return*/];
                        parentBlock.addChild(newBlock, index);
                    }
                    ev.stopPropagation();
                    capture("builder_component_used");
                    return [3 /*break*/, 5];
                case 3:
                    if (!blockTemplate) return [3 /*break*/, 5];
                    return [4 /*yield*/, blockTemplateStore.fetchBlockTemplate(blockTemplate)];
                case 4:
                    _d.sent();
                    newBlock = (0, helpers_1.getBlockInstance)(blockTemplateStore.getBlockTemplate(blockTemplate).block, false);
                    // if shift key is pressed, replace parent block with new block
                    if (ev.shiftKey) {
                        parentBlock = getBlockToReplace(ev);
                        if (!parentBlock)
                            return [2 /*return*/];
                        parentParentBlock = parentBlock.getParentBlock();
                        if (!parentParentBlock)
                            return [2 /*return*/];
                        index_1 = parentParentBlock.children.indexOf(parentBlock);
                        parentParentBlock.children.splice(index_1, 1, newBlock);
                    }
                    else {
                        if (!parentBlock)
                            return [2 /*return*/];
                        parentBlock.addChild(newBlock, index);
                    }
                    capture("builder_block_template_used", { template: blockTemplate });
                    _d.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleFileDrop = function (files, ev) {
        var _a = canvasStore.dropTarget, parentBlock = _a.parentBlock, index = _a.index;
        var file = files[0];
        // Handle font files separately
        if (file.name.match(/\.(woff2?|ttf|otf|eot)$/)) {
            handleFontFileDrop(file);
            return;
        }
        (0, helpers_1.uploadBuilderAsset)(file).then(function (fileDoc) {
            if (!parentBlock)
                return;
            if (fileDoc.fileName.match(/\.(mp4|webm|ogg|mov)$/)) {
                if (parentBlock.isVideo()) {
                    parentBlock.setAttribute("src", fileDoc.fileURL);
                }
                else {
                    parentBlock.addChild((0, helpers_1.getVideoBlock)(fileDoc.fileURL), index);
                }
                capture("builder_video_uploaded");
                return;
            }
            if (parentBlock.isImage() && files[0].type.startsWith("image/")) {
                parentBlock.setAttribute("src", fileDoc.fileURL);
                capture("builder_image_uploaded", {
                    type: "image-replace",
                });
            }
            else if (parentBlock.isSVG()) {
                var imageBlock = (0, helpers_1.getImageBlock)(fileDoc.fileURL, fileDoc.fileName);
                var parentParentBlock = parentBlock.getParentBlock();
                parentParentBlock === null || parentParentBlock === void 0 ? void 0 : parentParentBlock.replaceChild(parentBlock, (0, helpers_1.getBlockInstance)(imageBlock));
                capture("builder_image_uploaded", {
                    type: "svg-replace",
                });
            }
            else if (parentBlock.isContainer() && ev.shiftKey) {
                parentBlock.setStyle("background", "url(".concat(fileDoc.fileURL, ")"));
                capture("builder_image_uploaded", {
                    type: "background",
                });
            }
            else {
                parentBlock.addChild((0, helpers_1.getImageBlock)(fileDoc.fileURL, fileDoc.fileName), index);
                capture("builder_image_uploaded", {
                    type: "new-image",
                });
            }
        });
    };
    var handleFontFileDrop = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, helpers_1.uploadUserFont)(file, { confirmBeforeUpload: true })];
                case 1:
                    result = _a.sent();
                    if (result && blockController_1.default.isBlockSelected()) {
                        blockController_1.default.setFontFamily(result.fontName);
                    }
                    if (result === null || result === void 0 ? void 0 : result.uploaded) {
                        capture("builder_font_uploaded");
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return { isOverDropZone: isOverDropZone };
}
//# sourceMappingURL=useCanvasDropZone.js.map