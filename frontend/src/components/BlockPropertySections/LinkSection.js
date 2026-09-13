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
var AttributePropertyControl_vue_1 = __importDefault(require("@/components/Controls/AttributePropertyControl.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var frappe_ui_1 = require("frappe-ui");
var vue_1 = require("vue");
var linkSectionProperties = [
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Link To",
                propertyKey: "href",
                allowDynamicValue: true,
                getModelValue: function () { return blockController_1.default.getAttribute("href"); },
                setModelValue: function (val) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(val && !blockController_1.default.isLink())) return [3 /*break*/, 2];
                                return [4 /*yield*/, blockController_1.default.convertToLink()];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (!val && blockController_1.default.isLink()) {
                                    blockController_1.default.unsetLink();
                                }
                                else {
                                    blockController_1.default.setAttribute("href", val);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); },
            };
        },
        searchKeyWords: "Link, Href, URL",
        events: {
            setDynamicValue: function () {
                if (!blockController_1.default.isLink()) {
                    blockController_1.default.convertToLink();
                }
            },
            clearDynamicValue: function () {
                if (blockController_1.default.isLink() && !blockController_1.default.getAttribute("href")) {
                    blockController_1.default.unsetLink();
                }
            },
        },
    },
    {
        component: AttributePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Opens in",
                type: "select",
                propertyKey: "target",
                allowDynamicValue: false,
                getModelValue: function () { return blockController_1.default.getAttribute("target") || "_self"; },
                setModelValue: function (val) {
                    if (val === "_self") {
                        blockController_1.default.removeAttribute("target");
                    }
                    else {
                        blockController_1.default.setAttribute("target", val);
                    }
                },
                options: [
                    {
                        value: "_self",
                        label: "Same Tab",
                    },
                    {
                        value: "_blank",
                        label: "New Tab",
                    },
                ],
            };
        },
        searchKeyWords: "Link, Target, Opens in, OpensIn, Opens In, New Tab",
        condition: function () { return blockController_1.default.getAttribute("href"); },
    },
    {
        component: frappe_ui_1.Switch,
        getProps: function () {
            return {
                label: "Track Clicks",
                size: "sm",
                class: "[&_label]:text-xs [&_label]:text-ink-gray-6 [&_label]:font-normal",
                modelValue: blockController_1.default.isClickTrackingEnabled(),
            };
        },
        searchKeyWords: "Track, Clicks, Tracking, Analytics, CTR, Click Tracking",
        events: {
            "update:modelValue": function (val) { return blockController_1.default.toggleClickTracking(val); },
        },
    },
];
exports.default = {
    name: "Link",
    properties: linkSectionProperties,
    collapsed: (0, vue_1.computed)(function () { return !blockController_1.default.isLink(); }),
    condition: function () {
        var _a;
        return !blockController_1.default.multipleBlocksSelected() &&
            !((_a = blockController_1.default.getSelectedBlocks()[0].parentBlock) === null || _a === void 0 ? void 0 : _a.isLink()) &&
            !(blockController_1.default.isHTML() && !blockController_1.default.isSVG());
    },
};
//# sourceMappingURL=LinkSection.js.map