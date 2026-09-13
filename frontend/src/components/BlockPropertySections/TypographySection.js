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
var Autocomplete_vue_1 = __importDefault(require("@/components/Controls/Autocomplete.vue"));
var BasePropertyControl_vue_1 = __importDefault(require("@/components/Controls/BasePropertyControl.vue"));
var FontInput_vue_1 = __importDefault(require("@/components/Controls/FontInput.vue"));
var OptionToggle_vue_1 = __importDefault(require("@/components/Controls/OptionToggle.vue"));
var StylePropertyControl_vue_1 = __importDefault(require("@/components/Controls/StylePropertyControl.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var fontManager_1 = require("@/utils/fontManager");
var unitOptions_1 = require("@/utils/unitOptions");
var setFont = function (font) {
    (0, fontManager_1.setFont)(font, null).then(function () {
        blockController_1.default.setFontFamily(font);
    });
};
var typographySectionProperties = [
    {
        component: BasePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Content",
                propertyKey: "innerHTML",
                controlType: "key",
                // @ts-ignore
                allowDynamicValue: true,
                getModelValue: function () { return blockController_1.default.getText(); },
                setModelValue: function (val) {
                    blockController_1.default.setInnerHTML(val);
                },
            };
        },
        searchKeyWords: "Content, Text, ContentText, Content Text",
        condition: function () {
            return (blockController_1.default.isText() || blockController_1.default.isButton()) && !blockController_1.default.multipleBlocksSelected();
        },
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Family",
                component: FontInput_vue_1.default,
                propertyKey: "fontFamily",
                getModelValue: function () { return blockController_1.default.getFontFamily(); },
                setModelValue: function (val) { return setFont(val); },
            };
        },
        searchKeyWords: "Font, Family, FontFamily",
        condition: function () { return blockController_1.default.isText() || blockController_1.default.isContainer(); },
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Weight",
                propertyKey: "fontWeight",
                component: Autocomplete_vue_1.default,
                // static options were never query-filtered, so ignore the search
                // string; awaiting the list keeps all weights of a preselected
                // font available on first open
                getOptions: function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, (0, fontManager_1.loadFontList)()];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, (0, fontManager_1.getFontWeightOptions)((blockController_1.default.getStyle("fontFamily") || "Inter"))];
                        }
                    });
                }); },
                step: 100,
                min: 100,
                max: 900,
            };
        },
        searchKeyWords: "Font, Weight, FontWeight",
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Size",
                propertyKey: "fontSize",
                enableSlider: true,
                minValue: 1,
                unitOptions: unitOptions_1.BOX_UNIT_OPTIONS,
            };
        },
        searchKeyWords: "Font, Size, FontSize",
        condition: function () { return blockController_1.default.isText() || blockController_1.default.isInput(); },
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Height",
                propertyKey: "lineHeight",
                enableSlider: true,
            };
        },
        searchKeyWords: "Font, Height, LineHeight, Line Height",
        condition: function () { return blockController_1.default.isText(); },
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Letter",
                propertyKey: "letterSpacing",
                enableSlider: true,
            };
        },
        searchKeyWords: "Font, Letter, LetterSpacing, Letter Spacing",
        condition: function () { return blockController_1.default.isText(); },
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Transform",
                propertyKey: "textTransform",
                type: "select",
                options: [
                    {
                        value: "unset",
                        label: "Unset",
                    },
                    {
                        value: "uppercase",
                        label: "Uppercase",
                    },
                    {
                        value: "lowercase",
                        label: "Lowercase",
                    },
                    {
                        value: "capitalize",
                        label: "Capitalize",
                    },
                ],
                setModelValue: function (val) {
                    blockController_1.default.setStyle("textTransform", val === "unset" ? null : val);
                },
            };
        },
        searchKeyWords: "Font, Transform, TextTransform, Text Transform, Capitalize, Uppercase, Lowercase, Unset, None",
        condition: function () { return blockController_1.default.isText(); },
    },
    {
        component: StylePropertyControl_vue_1.default,
        getProps: function () {
            return {
                label: "Align",
                propertyKey: "textAlign",
                component: OptionToggle_vue_1.default,
                options: [
                    {
                        label: "Left",
                        value: "left",
                        icon: "lucide-align-left",
                        hideLabel: true,
                    },
                    {
                        label: "Center",
                        value: "center",
                        icon: "lucide-align-center",
                        hideLabel: true,
                    },
                    {
                        label: "Right",
                        value: "right",
                        icon: "lucide-align-right",
                        hideLabel: true,
                    },
                    {
                        label: "Justify",
                        value: "justify",
                        icon: "lucide-align-justify",
                        hideLabel: true,
                    },
                ],
                defaultValue: "left",
            };
        },
        searchKeyWords: "Font, Align, TextAlign, Text Align, Left, Center, Right, Justify",
        condition: function () { return blockController_1.default.isText(); },
    },
];
exports.default = {
    name: "Typography",
    properties: typographySectionProperties,
    condition: function () { return blockController_1.default.isText() || blockController_1.default.isContainer() || blockController_1.default.isInput(); },
};
//# sourceMappingURL=TypographySection.js.map