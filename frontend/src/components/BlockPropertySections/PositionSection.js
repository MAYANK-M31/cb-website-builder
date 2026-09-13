"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BlockPositionHandler_vue_1 = __importDefault(require("@/components/BlockPositionHandler.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var vue_1 = require("vue");
var positionSectionProperties = [
    {
        component: BlockPositionHandler_vue_1.default,
        searchKeyWords: "Position, Top, Right, Bottom, Left, PositionTop, Position Top, PositionRight, Position Right, PositionBottom, Position Bottom, PositionLeft, Position Left, Free, Fixed, Absolute, Relative, Sticky",
        getProps: function () { },
        usedStyleProperties: ["bottom", "left", "position", "right", "top"],
    },
];
exports.default = {
    name: "Position",
    properties: positionSectionProperties,
    condition: function () { return !blockController_1.default.multipleBlocksSelected() && !blockController_1.default.isRoot(); },
    collapsed: (0, vue_1.computed)(function () {
        return (!blockController_1.default.getStyle("top") &&
            !blockController_1.default.getStyle("right") &&
            !blockController_1.default.getStyle("bottom") &&
            !blockController_1.default.getStyle("left"));
    }),
};
//# sourceMappingURL=PositionSection.js.map