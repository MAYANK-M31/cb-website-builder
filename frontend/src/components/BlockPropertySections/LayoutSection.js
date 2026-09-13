"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var BlockFlexLayoutHandler_vue_1 = __importDefault(require("@/components/BlockFlexLayoutHandler.vue"));
var BlockGridLayoutHandler_vue_1 = __importDefault(require("@/components/BlockGridLayoutHandler.vue"));
var OptionToggle_vue_1 = __importDefault(require("@/components/Controls/OptionToggle.vue"));
var blockController_1 = __importDefault(require("@/utils/blockController"));
var StylePropertyControl_vue_1 = __importDefault(require("../Controls/StylePropertyControl.vue"));
var layoutSectionProperties = [
    {
        component: StylePropertyControl_vue_1.default,
        condition: function () { return !blockController_1.default.isText(); },
        getProps: function () {
            return {
                propertyKey: "display",
                component: OptionToggle_vue_1.default,
                label: "Type",
                enableStates: false,
                options: [
                    {
                        label: "Stack",
                        value: "flex",
                    },
                    {
                        label: "Grid",
                        value: "grid",
                    },
                ],
            };
        },
        searchKeyWords: "Layout, Display, Flex, Grid, Flexbox, Flex Box, FlexBox",
        events: {
            "update:modelValue": function (val) {
                blockController_1.default.setStyle("display", val);
                if (val === "grid") {
                    if (!blockController_1.default.getStyle("gridTemplateColumns")) {
                        blockController_1.default.setStyle("gridTemplateColumns", "repeat(2, minmax(200px, 1fr))");
                    }
                    if (!blockController_1.default.getStyle("gap")) {
                        blockController_1.default.setStyle("gap", "10px");
                    }
                    if (blockController_1.default.getStyle("height")) {
                        if (blockController_1.default.getSelectedBlocks()[0].hasChildren()) {
                            blockController_1.default.setStyle("height", null);
                        }
                    }
                }
            },
        },
    },
    {
        component: BlockGridLayoutHandler_vue_1.default,
        condition: function () { var _a; return blockController_1.default.isGrid() || Boolean((_a = blockController_1.default.getParentBlock()) === null || _a === void 0 ? void 0 : _a.isGrid()); },
        getProps: function () { },
        usedStyleProperties: [
            "column-gap",
            "gap",
            "grid-auto-columns",
            "grid-auto-flow",
            "grid-auto-rows",
            "grid-column",
            "grid-column-end",
            "grid-column-start",
            "grid-row",
            "grid-row-end",
            "grid-row-start",
            "grid-template",
            "grid-template-areas",
            "grid-template-columns",
            "grid-template-rows",
            "justify-items",
            "place-content",
            "place-items",
            "place-self",
            "row-gap",
        ],
        searchKeyWords: "Layout, Grid, GridTemplate, Grid Template, GridGap, Grid Gap, GridRow, Grid Row, GridColumn, Grid Column",
    },
    {
        component: BlockFlexLayoutHandler_vue_1.default,
        condition: function () { var _a; return blockController_1.default.isFlex() || Boolean((_a = blockController_1.default.getParentBlock()) === null || _a === void 0 ? void 0 : _a.isFlex()); },
        getProps: function () { },
        usedStyleProperties: [
            "align-content",
            "align-items",
            "align-self",
            "flex",
            "flex-basis",
            "flex-direction",
            "flex-flow",
            "flex-grow",
            "flex-shrink",
            "flex-wrap",
            "gap",
            "justify-content",
            "justify-self",
            "order",
        ],
        searchKeyWords: "Layout, Flex, Flexbox, Flex Box, FlexBox, Justify, Space Between, Flex Grow, Flex Shrink, Flex Basis, Align Items, Align Content, Align Self, Flex Direction, Flex Wrap, Flex Flow, Flex Grow, Flex Shrink, Flex Basis, Gap, Order",
    },
];
exports.default = {
    name: "Layout",
    properties: layoutSectionProperties,
    condition: function () { return !blockController_1.default.multipleBlocksSelected() && !blockController_1.default.isHTML(); },
};
//# sourceMappingURL=LayoutSection.js.map