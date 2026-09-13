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
var builderBlockTemplate_1 = __importDefault(require("@/data/builderBlockTemplate"));
var helpers_1 = require("@/utils/helpers");
var frappe_ui_1 = require("frappe-ui");
var pinia_1 = require("pinia");
var vue_1 = require("vue");
var frappe_ui_2 = require("frappe-ui");
var builderStore_1 = __importDefault(require("./builderStore"));
var canvasStore_1 = __importDefault(require("./canvasStore"));
var useBlockTemplateStore = (0, pinia_1.defineStore)("blockTemplateStore", {
    state: function () { return ({
        blockTemplateMap: new Map(),
        blockTemplateCategoryOptions: [
            "Basic",
            "Structure",
            "Typography",
            "Basic Forms",
            "Form parts",
            "Media",
            "Advanced",
        ],
    }); },
    actions: {
        getBlockTemplate: function (blockTemplateName) {
            return this.blockTemplateMap.get(blockTemplateName);
        },
        editBlockTemplate: function (blockTemplateName) {
            return __awaiter(this, void 0, void 0, function () {
                var blockTemplate, blockTemplateBlock, canvasStore, builderStore;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.fetchBlockTemplate(blockTemplateName)];
                        case 1:
                            _a.sent();
                            blockTemplate = this.getBlockTemplate(blockTemplateName);
                            blockTemplateBlock = this.getBlockTemplateBlock(blockTemplateName);
                            canvasStore = (0, canvasStore_1.default)();
                            builderStore = (0, builderStore_1.default)();
                            canvasStore.editOnCanvas(blockTemplateBlock, "blockTemplate", function (block) {
                                _this.saveBlockTemplate(block, blockTemplateName);
                            }, "Save Template", blockTemplate.template_name);
                            builderStore.leftPanelActiveTab = "Layers";
                            (0, vue_1.nextTick)(function () {
                                var _a;
                                (_a = canvasStore.fragmentData.block) === null || _a === void 0 ? void 0 : _a.selectBlock();
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
        getBlockTemplateBlock: function (blockTemplateName) {
            return (0, helpers_1.getBlockInstance)(this.getBlockTemplate(blockTemplateName).block);
        },
        fetchBlockTemplate: function (blockTemplateName) {
            return __awaiter(this, void 0, void 0, function () {
                var blockTemplate, webBlockTemplate, blockTemplate_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            blockTemplate = this.getBlockTemplate(blockTemplateName);
                            if (!!blockTemplate) return [3 /*break*/, 3];
                            return [4 /*yield*/, (0, frappe_ui_1.createDocumentResource)({
                                    doctype: "Block Template",
                                    name: blockTemplateName,
                                    auto: true,
                                })];
                        case 1:
                            webBlockTemplate = _a.sent();
                            return [4 /*yield*/, webBlockTemplate.get.promise];
                        case 2:
                            _a.sent();
                            blockTemplate_1 = webBlockTemplate.doc;
                            this.blockTemplateMap.set(blockTemplateName, blockTemplate_1);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        saveBlockTemplate: function (block_1, templateName_1) {
            return __awaiter(this, arguments, void 0, function (block, templateName, category, previewImage) {
                var blockString, args;
                if (category === void 0) { category = "Basic"; }
                if (previewImage === void 0) { previewImage = ""; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            blockString = (0, helpers_1.getBlockString)(block);
                            args = {
                                name: templateName,
                                template_name: templateName,
                                block: blockString,
                            };
                            if (!builderBlockTemplate_1.default.getRow(templateName)) return [3 /*break*/, 2];
                            return [4 /*yield*/, builderBlockTemplate_1.default.setValue.submit(args)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            args["category"] = category;
                            args["preview"] = previewImage;
                            return [4 /*yield*/, builderBlockTemplate_1.default.insert.submit(args)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            this.blockTemplateMap.delete(templateName);
                            return [4 /*yield*/, builderBlockTemplate_1.default.reload()];
                        case 5:
                            _a.sent();
                            frappe_ui_2.toast.success("Block template saved!");
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
});
exports.default = useBlockTemplateStore;
//# sourceMappingURL=blockTemplateStore.js.map