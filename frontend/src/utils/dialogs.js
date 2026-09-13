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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptCreateFolder = promptCreateFolder;
exports.promptCreateComponent = promptCreateComponent;
exports.promptSelectFolder = promptSelectFolder;
var useDashboardState_1 = require("@/composables/useDashboardState");
var builderProjectFolder_1 = __importDefault(require("@/data/builderProjectFolder"));
var webComponent_1 = __importDefault(require("@/data/webComponent"));
var webPage_1 = require("@/data/webPage");
var builderStore_1 = __importDefault(require("@/stores/builderStore"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var componentStore_1 = __importDefault(require("@/stores/componentStore"));
var pageStore_1 = __importDefault(require("@/stores/pageStore"));
var helpers_1 = require("@/utils/helpers");
var frappe_ui_1 = require("frappe-ui");
// Imperative dialogs that replace single-purpose modal components. Each opens
// a frappe-ui prompt that auto-closes once `onConfirm` resolves; throwing from
// onConfirm surfaces the error inline and keeps the dialog open.
function promptCreateFolder() {
    var _this = this;
    frappe_ui_1.dialog.prompt({
        title: "Create New Folder",
        size: "sm",
        confirmLabel: "Create Folder",
        fields: [{ name: "folder_name", label: "Folder Name", required: true }],
        onConfirm: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var values = _b.values;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, builderProjectFolder_1.default.insert.submit({ folder_name: values.folder_name })];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); },
    });
}
function promptCreateComponent(block) {
    var _this = this;
    var componentStore = (0, componentStore_1.default)();
    var canvasStore = (0, canvasStore_1.default)();
    var pageStore = (0, pageStore_1.default)();
    frappe_ui_1.dialog.prompt({
        title: "New Component",
        size: "sm",
        confirmLabel: "Save",
        fields: [
            {
                name: "componentName",
                label: "Component Name",
                required: true,
                defaultValue: block.blockName || "",
            },
            { name: "isGlobalComponent", type: "checkbox", label: "Global Component" },
        ],
        onConfirm: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var blockCopy, componentData, updatedBlock;
            var _c;
            var values = _b.values;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        blockCopy = (0, helpers_1.getBlockCopy)(block, true);
                        blockCopy.removeStyle("left");
                        blockCopy.removeStyle("top");
                        blockCopy.removeStyle("position");
                        return [4 /*yield*/, webComponent_1.default.insert.submit({
                                block: (0, helpers_1.getBlockString)(blockCopy),
                                component_name: values.componentName,
                                for_web_page: values.isGlobalComponent ? null : pageStore.selectedPage,
                            })];
                    case 1:
                        componentData = (_d.sent());
                        componentStore.setComponentMap(componentData);
                        updatedBlock = (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.findBlock(block.blockId);
                        updatedBlock === null || updatedBlock === void 0 ? void 0 : updatedBlock.extendFromComponent(componentData.name);
                        if (!updatedBlock) return [3 /*break*/, 3];
                        return [4 /*yield*/, componentStore.pinComponentInstance(updatedBlock, componentData.name)];
                    case 2:
                        _d.sent();
                        pageStore.savePage();
                        _d.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); },
    });
}
function promptSelectFolder() {
    var _this = this;
    var _a = (0, useDashboardState_1.useDashboardState)(), selectedPages = _a.selectedPages, selectionMode = _a.selectionMode;
    var builderStore = (0, builderStore_1.default)();
    var options = __spreadArray([
        { label: "Home", value: "" }
    ], (builderProjectFolder_1.default.data || []).map(function (p) { return ({
        label: p.folder_name,
        value: p.folder_name,
    }); }), true);
    frappe_ui_1.dialog.prompt({
        title: "Select Folder",
        size: "sm",
        fields: [
            {
                name: "folder",
                type: "select",
                label: "Folder",
                defaultValue: builderStore.activeFolder || "",
                options: options,
            },
        ],
        onConfirm: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
            var folder, _loop_1, _i, _c, pageName;
            var _d;
            var values = _b.values;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        folder = values.folder;
                        if (folder === builderStore.activeFolder)
                            return [2 /*return*/];
                        return [4 /*yield*/, (0, frappe_ui_1.createResource)({
                                method: "POST",
                                url: "builder.api.update_page_folder",
                            }).submit({
                                pages: Array.from(selectedPages.value),
                                folder_name: folder,
                            })];
                    case 1:
                        _e.sent();
                        _loop_1 = function (pageName) {
                            var page = (_d = webPage_1.webPages.data) === null || _d === void 0 ? void 0 : _d.find(function (p) { return p.name === pageName; });
                            if (page)
                                page.project_folder = folder;
                        };
                        for (_i = 0, _c = selectedPages.value; _i < _c.length; _i++) {
                            pageName = _c[_i];
                            _loop_1(pageName);
                        }
                        selectedPages.value.clear();
                        selectionMode.value = false;
                        builderStore.activeFolder = folder;
                        return [2 /*return*/];
                }
            });
        }); },
    });
}
//# sourceMappingURL=dialogs.js.map