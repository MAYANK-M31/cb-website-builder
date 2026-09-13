"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var componentStore_1 = __importDefault(require("@/stores/componentStore"));
var componentInstance_1 = require("@/utils/block/componentInstance");
var tree_1 = require("@/utils/block/tree");
var helpers_1 = require("@/utils/helpers");
var core_1 = require("@vueuse/core");
var vue_1 = require("vue");
var TEXT_ELEMENTS = new Set([
    "span",
    "h1",
    "p",
    "b",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "label",
    "a",
    "cite",
    "li",
    "strong",
    "em",
    "i",
    "blockquote",
]);
var CONTAINER_ELEMENTS = new Set(["section", "div"]);
var HEADER_ELEMENTS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
// editor of the currently editable text block; kept off Block instances to
// avoid Vue reactivity and serialization. Owner tracked by blockId since
// undo/redo swaps instances but keeps ids.
var activeEditor = null;
var activeEditorBlockId = null;
// rawStyles were dropped in favour of baseStyles; older blocks still carry them
var mergeLegacyRawStyles = function (baseStyles, rawStyles) {
    if (!rawStyles)
        return baseStyles;
    Object.entries(rawStyles).forEach(function (_a) {
        var style = _a[0], value = _a[1];
        if (value === null || value === "" || value === undefined)
            return;
        baseStyles[(0, helpers_1.toStyleProperty)(style)] = value;
    });
    return baseStyles;
};
var Block = /** @class */ (function () {
    function Block(options) {
        var _this = this;
        var _a, _b;
        this.dataKey = null;
        this.activeState = null;
        var componentStore = (0, componentStore_1.default)();
        this.element = options.element;
        this.innerHTML = options.innerHTML;
        this.extendedFromComponent = options.extendedFromComponent;
        this.componentVersion = options.componentVersion;
        this.isRepeaterBlock = options.isRepeaterBlock;
        this.isChildOfComponent = options.isChildOfComponent;
        this.referenceBlockId = options.referenceBlockId;
        this.parentBlock = options.parentBlock || null;
        if (this.extendedFromComponent) {
            if (this.componentVersion) {
                // restored/pinned instance: load the frozen version from its snapshot
                componentStore.loadComponentVersion(this.componentVersion, this.extendedFromComponent);
            }
            else {
                componentStore.loadComponent(this.extendedFromComponent);
            }
        }
        else if (this.isChildOfComponent && this.componentVersion) {
            // a pinned instance's child resolves its component from the frozen version too
            componentStore.loadComponentVersion(this.componentVersion, this.isChildOfComponent);
        }
        if (this.isChildOfComponent && !this.componentVersion) {
            var parentBlock = this.getParentBlock();
            while (parentBlock && (parentBlock === null || parentBlock === void 0 ? void 0 : parentBlock.extendedFromComponent) != this.isChildOfComponent) {
                parentBlock = parentBlock === null || parentBlock === void 0 ? void 0 : parentBlock.getParentBlock();
            }
            this.componentVersion = parentBlock === null || parentBlock === void 0 ? void 0 : parentBlock.componentVersion;
        }
        // to keep this property out of block reactivity
        Object.defineProperty(this, "referenceComponent", {
            value: (0, vue_1.computed)(function () {
                if (_this.extendedFromComponent) {
                    if (_this.componentVersion) {
                        // prefer the pinned version; fall back to live if it was pruned
                        return (componentStore.getComponentVersionBlock(_this.componentVersion) ||
                            componentStore.getComponentBlock(_this.extendedFromComponent) ||
                            null);
                    }
                    return componentStore.getComponentBlock(_this.extendedFromComponent) || null;
                }
                else if (_this.isChildOfComponent) {
                    // honor the pinned version (set on restored instance children) before
                    // falling back to the live component
                    var componentBlock = _this.componentVersion
                        ? componentStore.getComponentVersionBlock(_this.componentVersion) ||
                            componentStore.getComponentBlock(_this.isChildOfComponent)
                        : componentStore.getComponentBlock(_this.isChildOfComponent);
                    return (0, tree_1.findBlockInTree)(_this.referenceBlockId, [componentBlock]);
                }
                return null;
            }),
            enumerable: false,
        });
        this.dataKey = options.dataKey || null;
        if (options.innerText) {
            this.innerHTML = options.innerText;
        }
        if (typeof options.visibilityCondition == "string") {
            this.visibilityCondition = {
                key: options.visibilityCondition,
                comesFrom: "dataScript",
            };
        }
        else {
            this.visibilityCondition = options.visibilityCondition;
        }
        this.originalElement = options.originalElement;
        if (!options.blockId || options.blockId === "root") {
            this.blockId = (0, helpers_1.generateId)();
        }
        else {
            this.blockId = options.blockId;
        }
        this.children = (options.children || []).map(function (child) {
            child.parentBlock = _this;
            return (0, helpers_1.getBlockInstance)(child);
        });
        this.baseStyles = (0, vue_1.reactive)(mergeLegacyRawStyles(__assign({}, (options.styles || options.baseStyles || {})), options.rawStyles));
        this.customAttributes = (0, vue_1.reactive)(options.customAttributes || {});
        this.mobileStyles = (0, vue_1.reactive)(options.mobileStyles || {});
        this.tabletStyles = (0, vue_1.reactive)(options.tabletStyles || {});
        this.attributes = (0, vue_1.reactive)(options.attributes || {});
        this.dynamicValues = (0, vue_1.reactive)(options.dynamicValues || []);
        this.props = (0, vue_1.reactive)(options.props || {});
        this.editorConfig = options.editorConfig;
        this.clientScript = (0, vue_1.reactive)((_a = options.clientScript) !== null && _a !== void 0 ? _a : (options.blockClientScript ? { js: options.blockClientScript } : {}));
        this.blockName = options.blockName;
        delete this.attributes.style;
        this.classes = options.classes || [];
        if (this.isRoot()) {
            this.blockId = "root";
            this.draggable = false;
            this.removeStyle("minHeight");
        }
        (0, helpers_1.parseAndSetBackground)(this.baseStyles);
        (0, helpers_1.parseAndSetBackground)(this.mobileStyles);
        (0, helpers_1.parseAndSetBackground)(this.tabletStyles);
        if (this.isImage()) {
            (0, helpers_1.handleBase64Attribute)(this, "src", "image.png");
            (0, helpers_1.handleBase64Attribute)(this, "darkSrc", "image-dark.png");
        }
        var bgImage = this.getStyle("backgroundImage");
        if (bgImage && /^url\(['"]?data:image/.test(bgImage)) {
            var bgImage_1 = this.getStyle("backgroundImage");
            var dataURL = (_b = bgImage_1.match(/url\(['"]?(.*?)['"]?\)/)) === null || _b === void 0 ? void 0 : _b[1];
            var file = (0, helpers_1.dataURLtoFile)(dataURL, "image.png");
            if (file) {
                this.setStyle("backgroundImage", "");
                (0, helpers_1.uploadBuilderAsset)(file, true).then(function (obj) {
                    _this.setStyle("backgroundImage", (0, helpers_1.cssUrl)(obj.fileURL));
                });
            }
        }
    }
    Block.prototype.getStyles = function (breakpoint) {
        if (breakpoint === void 0) { breakpoint = "desktop"; }
        var styleObj = {};
        if (this.isExtendedFromComponent()) {
            styleObj = this.getComponentStyles(breakpoint);
        }
        styleObj = __assign(__assign({}, styleObj), this.baseStyles);
        if (["mobile", "tablet"].includes(breakpoint)) {
            styleObj = __assign(__assign({}, styleObj), this.tabletStyles);
            if (breakpoint === "mobile") {
                styleObj = __assign(__assign({}, styleObj), this.mobileStyles);
            }
        }
        // replace variables with values
        // Object.keys(styleObj).forEach((style) => {
        // 	const value = styleObj[style];
        // 	if (typeof value === "string" && value.startsWith("--")) {
        // 		styleObj[style] = this.getVariableValue(value);
        // 	}
        // });
        return styleObj;
    };
    Block.prototype.getStateStyles = function (state, breakpoint) {
        if (breakpoint === void 0) { breakpoint = "desktop"; }
        var styles = this.getStyles(breakpoint);
        var stateStyles = {};
        Object.keys(styles).forEach(function (style) {
            if (style.startsWith("".concat(state, ":"))) {
                var newStyle = style.replace("".concat(state, ":"), "");
                stateStyles[newStyle] = styles[style];
            }
        });
        return stateStyles;
    };
    Block.prototype.hasOverrides = function (breakpoint) {
        if (breakpoint === "mobile") {
            return Object.keys(this.mobileStyles).length > 0;
        }
        if (breakpoint === "tablet") {
            return Object.keys(this.tabletStyles).length > 0;
        }
        return false;
    };
    Block.prototype.resetOverrides = function (breakpoint) {
        if (breakpoint === "mobile") {
            this.mobileStyles = {};
        }
        if (breakpoint === "tablet") {
            this.tabletStyles = {};
        }
    };
    Block.prototype.getComponentStyles = function (breakpoint) {
        var _a;
        return ((_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.getStyles(breakpoint)) || {};
    };
    Block.prototype.getAttributes = function () {
        var attributes = {};
        if (this.isExtendedFromComponent()) {
            attributes = this.getComponentAttributes();
        }
        attributes = __assign(__assign({}, attributes), this.attributes);
        return attributes;
    };
    Block.prototype.getComponentAttributes = function () {
        var _a;
        return ((_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.attributes) || {};
    };
    Block.prototype.getClasses = function () {
        var classes = [];
        if (this.isExtendedFromComponent()) {
            classes = this.getComponentClasses();
        }
        classes = __spreadArray(__spreadArray([], classes, true), this.classes, true);
        return classes;
    };
    Block.prototype.getComponentClasses = function () {
        var _a;
        return ((_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.classes) || [];
    };
    Block.prototype.getChildren = function () {
        return this.children;
    };
    Block.prototype.hasChildren = function () {
        return this.getChildren().length > 0;
    };
    Block.prototype.getCustomAttributes = function () {
        var _a;
        var customAttributes = {};
        if (this.isExtendedFromComponent()) {
            customAttributes = ((_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.customAttributes) || {};
        }
        customAttributes = __assign(__assign({}, customAttributes), this.customAttributes);
        return customAttributes;
    };
    Block.prototype.getVisibilityCondition = function () {
        var _a, _b;
        var visibilityCondition = this.visibilityCondition;
        if (this.isExtendedFromComponent() && ((_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.visibilityCondition)) {
            visibilityCondition = (_b = this.referenceComponent) === null || _b === void 0 ? void 0 : _b.visibilityCondition;
        }
        return visibilityCondition;
    };
    Block.prototype.getBlockDescription = function () {
        if (this.extendedFromComponent) {
            return this.getComponentBlockDescription() || "";
        }
        if (this.isHTML() && !this.blockName) {
            var innerHTML = this.getInnerHTML() || "";
            var match = innerHTML.match(/<([a-z]+)[^>]*>/);
            if (match) {
                return "".concat(match[1]);
            }
            else {
                return "raw";
            }
        }
        var description = this.blockName || this.originalElement || this.getElement() || "";
        if (this.getTextContent() && !this.blockName) {
            description += " | " + this.getTextContent();
        }
        return description;
    };
    Block.prototype.getComponentBlockDescription = function () {
        var componentStore = (0, componentStore_1.default)();
        return componentStore.getComponentName(this.extendedFromComponent, this.componentVersion);
    };
    Block.prototype.getTextContent = function () {
        return (0, helpers_1.getTextContent)(this.getInnerHTML() || "");
    };
    Block.prototype.isImage = function () {
        return this.getElement() === "img";
    };
    Block.prototype.isVideo = function () {
        var _a;
        return this.getElement() === "video" || ((_a = this.getInnerHTML()) === null || _a === void 0 ? void 0 : _a.startsWith("<video"));
    };
    Block.prototype.isForm = function () {
        return this.getElement() === "form";
    };
    Block.prototype.isButton = function () {
        return this.getElement() === "button";
    };
    Block.prototype.isLink = function () {
        return this.getElement() === "a";
    };
    Block.prototype.isSVG = function () {
        var _a;
        return this.getElement() === "svg" || ((_a = this.getInnerHTML()) === null || _a === void 0 ? void 0 : _a.startsWith("<svg"));
    };
    Block.prototype.isInlineSVG = function () {
        return this.isSVG() && Boolean(this.getInnerHTML());
    };
    Block.prototype.isText = function () {
        return TEXT_ELEMENTS.has(this.getElement());
    };
    Block.prototype.isContainer = function () {
        return CONTAINER_ELEMENTS.has(this.getElement());
    };
    Block.prototype.isHeader = function () {
        return HEADER_ELEMENTS.has(this.getElement());
    };
    Block.prototype.isInput = function () {
        return (this.originalElement === "input" || this.getElement() === "input" || this.getElement() === "textarea");
    };
    Block.prototype.setStyle = function (style, value) {
        var _a, _b;
        var canvasStore = (0, canvasStore_1.default)();
        var styleObj = this.baseStyles;
        style = (0, helpers_1.kebabToCamelCase)(style);
        if (((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.activeBreakpoint) === "mobile") {
            styleObj = this.mobileStyles;
        }
        else if (((_b = canvasStore.activeCanvas) === null || _b === void 0 ? void 0 : _b.activeBreakpoint) === "tablet") {
            styleObj = this.tabletStyles;
        }
        if (value === null || value === "") {
            delete styleObj[style];
            return;
        }
        styleObj[style] = value;
    };
    Block.prototype.setAttribute = function (attribute, value) {
        this.attributes[attribute] = value;
    };
    Block.prototype.removeAttribute = function (attribute) {
        this.setAttribute(attribute, undefined);
    };
    Block.prototype.getAttribute = function (attribute) {
        return this.getAttributes()[attribute];
    };
    Block.prototype.removeStyle = function (style) {
        delete this.baseStyles[style];
        delete this.mobileStyles[style];
        delete this.tabletStyles[style];
    };
    Block.prototype.setBaseStyle = function (style, value) {
        style = (0, helpers_1.kebabToCamelCase)(style);
        this.baseStyles[style] = value;
    };
    Block.prototype.getStyle = function (style, breakpoint, nativeOnly, cascading) {
        var _a;
        if (nativeOnly === void 0) { nativeOnly = false; }
        if (cascading === void 0) { cascading = false; }
        var canvasStore = (0, canvasStore_1.default)();
        var currentBreakpoint = breakpoint || ((_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.activeBreakpoint) || "desktop";
        if (nativeOnly) {
            var styleMap = this.getStyleMapForBreakpoint(currentBreakpoint);
            return styleMap[style];
        }
        if (cascading) {
            return this.getStyleWithCascading(style, currentBreakpoint);
        }
        var styleValue = this.getInheritedStyleValue(style, currentBreakpoint);
        return styleValue !== null && styleValue !== void 0 ? styleValue : this.getComponentStyleFallback(style, currentBreakpoint, nativeOnly, cascading);
    };
    Block.prototype.getStyleMapForBreakpoint = function (breakpoint) {
        var styleMap = {
            mobile: this.mobileStyles,
            tablet: this.tabletStyles,
            desktop: this.baseStyles,
        };
        return styleMap[breakpoint] || this.baseStyles;
    };
    Block.prototype.getStyleWithCascading = function (style, breakpoint) {
        var _a;
        if (this.isExtendedFromComponent()) {
            var componentValue = (_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.getStyle(style, breakpoint, true, false);
            if (componentValue)
                return componentValue;
        }
        var fallbackBreakpoints = {
            mobile: ["tablet", "desktop"],
            tablet: ["desktop"],
        };
        var fallbacks = fallbackBreakpoints[breakpoint] || [];
        for (var _i = 0, fallbacks_1 = fallbacks; _i < fallbacks_1.length; _i++) {
            var fallbackBreakpoint = fallbacks_1[_i];
            var value = this.getStyle(style, fallbackBreakpoint);
            if (value)
                return value;
        }
        return this.getStyle(style, "desktop");
    };
    Block.prototype.getInheritedStyleValue = function (style, breakpoint) {
        switch (breakpoint) {
            case "mobile":
                return this.mobileStyles[style] || this.tabletStyles[style] || this.baseStyles[style];
            case "tablet":
                return this.tabletStyles[style] || this.baseStyles[style];
            default:
                return this.baseStyles[style];
        }
    };
    Block.prototype.getComponentStyleFallback = function (style, breakpoint, nativeOnly, cascading) {
        var _a, _b;
        if (!this.isExtendedFromComponent())
            return undefined;
        return (_b = (_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.getStyle) === null || _b === void 0 ? void 0 : _b.call(_a, style, breakpoint, nativeOnly, cascading);
    };
    Block.prototype.getNativeStyle = function (style) {
        return this.getStyle(style, undefined, true);
    };
    Block.prototype.getIcon = function () {
        var _a;
        if ((_a = this.editorConfig) === null || _a === void 0 ? void 0 : _a.icon) {
            var icon = this.editorConfig.icon;
            return icon.startsWith("lucide-") ? icon : "lucide-".concat(icon);
        }
        // "lucide-toggle-left";
        switch (true) {
            case this.isRoot():
                return "lucide-hash";
            case this.isRepeater():
                return "lucide-database";
            case this.isSVG():
                return "lucide-aperture";
            case this.isHTML():
                return "lucide-code";
            case this.isLink():
                return "lucide-link";
            case this.isText():
                return "lucide-type";
            case this.isVideo():
                return "lucide-film";
            case this.isContainer() && this.isRow():
                return "lucide-columns";
            case this.isContainer() && this.isColumn():
                return "lucide-rows-2";
            case this.isGrid():
                return "lucide-grid-2x2";
            case this.isContainer():
                return "lucide-square";
            case this.isImage():
                return "lucide-image";
            case this.isForm():
                return "lucide-file-text";
            default:
                return "lucide-square";
        }
    };
    Block.prototype.isRoot = function () {
        return this.originalElement === "body";
    };
    Block.prototype.getTag = function () {
        if (this.isButton() || this.isLink()) {
            return "div";
        }
        return this.getElement() || "div";
    };
    Block.prototype.getComponentTag = function () {
        var _a;
        return ((_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.getTag()) || "div";
    };
    Block.prototype.isDiv = function () {
        return this.getElement() === "div";
    };
    Block.prototype.getStylesCopy = function () {
        return {
            baseStyles: Object.assign({}, this.baseStyles),
            mobileStyles: Object.assign({}, this.mobileStyles),
            tabletStyles: Object.assign({}, this.tabletStyles),
        };
    };
    Block.prototype.isMovable = function () {
        return ["absolute", "fixed"].includes(this.getStyle("position"));
    };
    Block.prototype.move = function (direction) {
        if (!this.isMovable()) {
            return;
        }
        var top = (0, helpers_1.getNumberFromPx)(this.getStyle("top")) || 0;
        var left = (0, helpers_1.getNumberFromPx)(this.getStyle("left")) || 0;
        if (direction === "up") {
            top -= 10;
            this.setStyle("top", (0, helpers_1.addPxToNumber)(top));
        }
        else if (direction === "down") {
            top += 10;
            this.setStyle("top", (0, helpers_1.addPxToNumber)(top));
        }
        else if (direction === "left") {
            left -= 10;
            this.setStyle("left", (0, helpers_1.addPxToNumber)(left));
        }
        else if (direction === "right") {
            left += 10;
            this.setStyle("left", (0, helpers_1.addPxToNumber)(left));
        }
    };
    Block.prototype.addChild = function (child, index, select) {
        if (select === void 0) { select = true; }
        if (index === undefined || index === null) {
            index = this.children.length;
        }
        index = (0, core_1.clamp)(index, 0, this.children.length);
        var childBlock = (0, helpers_1.getBlockInstance)(child);
        childBlock.parentBlock = this;
        this.children.splice(index, 0, childBlock);
        if (select) {
            childBlock.selectBlock();
        }
        if (childBlock.isText()) {
            childBlock.makeBlockEditable();
        }
        if (childBlock.getStyle("position")) {
            if (!this.getStyle("position")) {
                this.setStyle("position", "relative");
            }
        }
        return childBlock;
    };
    Block.prototype.removeChild = function (child) {
        var index = this.getChildIndex(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    };
    Block.prototype.replaceChild = function (child, newChild) {
        newChild.parentBlock = this;
        var index = this.getChildIndex(child);
        if (index > -1) {
            // This is not triggering the reactivity even though the child object is reactive
            // this.children.splice(index, 1, newChild);
            this.removeChild(child);
            this.addChild(newChild, index);
        }
    };
    Block.prototype.getChildIndex = function (child) {
        return this.children.findIndex(function (block) { return block.blockId === child.blockId; });
    };
    Block.prototype.addChildAfter = function (child, siblingBlock) {
        var siblingIndex = this.getChildIndex(siblingBlock);
        return this.addChild(child, siblingIndex + 1);
    };
    Block.prototype.getEditorStyles = function () {
        var styles = (0, vue_1.reactive)({});
        if (this.isRoot()) {
            styles.width = "inherit";
            styles.overflowX = "hidden";
        }
        if (this.isImage() && !this.getAttribute("src")) {
            styles.background = "repeating-linear-gradient(45deg, rgba(180, 180, 180, 0.8) 0px, rgba(180, 180, 180, 0.8) 1px, rgba(255, 255, 255, 0.2) 0px, rgba(255, 255, 255, 0.2) 50%)";
            styles.backgroundSize = "16px 16px";
        }
        if (this.isButton() && this.children.length === 0) {
            styles.display = "flex";
            styles.alignItems = "center";
            styles.justifyContent = "center";
        }
        styles.transition = "unset";
        return styles;
    };
    Block.prototype.selectBlock = function () {
        var _this = this;
        var canvasStore = (0, canvasStore_1.default)();
        (0, vue_1.nextTick)(function () {
            canvasStore.selectBlock(_this, null);
        });
    };
    Block.prototype.getParentBlock = function () {
        return this.parentBlock || null;
    };
    Block.prototype.selectParentBlock = function () {
        var parentBlock = this.getParentBlock();
        if (parentBlock) {
            parentBlock.selectBlock();
        }
    };
    Block.prototype.getSiblingBlock = function (direction) {
        var parentBlock = this.getParentBlock();
        var sibling = null;
        if (parentBlock) {
            var index = parentBlock.getChildIndex(this);
            if (direction === "next") {
                sibling = parentBlock.children[index + 1];
            }
            else {
                sibling = parentBlock.children[index - 1];
            }
            if (sibling) {
                return sibling;
            }
        }
        return null;
    };
    Block.prototype.getFirstChild = function () {
        return this.children[0];
    };
    Block.prototype.getLastChild = function () {
        return this.children[this.children.length - 1];
    };
    Block.prototype.selectSiblingBlock = function (direction) {
        var sibling = this.getSiblingBlock(direction);
        if (sibling) {
            sibling.selectBlock();
        }
    };
    Block.prototype.canHaveChildren = function () {
        return !(this.isImage() ||
            this.isSVG() ||
            this.isInput() ||
            this.isVideo() ||
            (this.isText() && !this.isLink()) ||
            this.isHTML() ||
            this.isExtendedFromComponent());
    };
    Block.prototype.updateStyles = function (styles) {
        this.baseStyles = Object.assign({}, this.baseStyles, styles.baseStyles);
        this.mobileStyles = Object.assign({}, this.mobileStyles, styles.mobileStyles);
        this.tabletStyles = Object.assign({}, this.tabletStyles, styles.tabletStyles);
    };
    Block.prototype.getBackgroundColor = function () {
        return this.getStyle("backgroundColor") || "transparent";
    };
    Block.prototype.getFontFamily = function () {
        var editor = this.getEditor();
        if (this.isText() && editor && editor.isFocused) {
            return editor.getAttributes("textStyle").fontFamily;
        }
        return this.getStyle("fontFamily", undefined, true);
    };
    Block.prototype.setFontFamily = function (fontFamily) {
        var editor = this.getEditor();
        if (this.isText() && editor && editor.isFocused) {
            editor.chain().focus().setFontFamily(fontFamily).run();
        }
        else {
            this.setStyle("fontFamily", fontFamily);
        }
    };
    Block.prototype.getTextColor = function () {
        var editor = this.getEditor();
        var color = editor === null || editor === void 0 ? void 0 : editor.getAttributes("textStyle").color;
        if (this.isText() && editor && color && editor.isEditable) {
            return color;
        }
        else {
            return this.getStyle("color");
        }
    };
    Block.prototype.getEditor = function () {
        return this.blockId === activeEditorBlockId ? activeEditor : null;
    };
    Block.prototype.setEditor = function (editor) {
        activeEditor = editor;
        activeEditorBlockId = editor ? this.blockId : null;
    };
    Block.prototype.setTextColor = function (color) {
        var editor = this.getEditor();
        if (this.isText() && editor && editor.isEditable) {
            editor.chain().setColor(color).run();
        }
        else {
            this.setStyle("color", color);
            var innerHTMLDOM = new DOMParser().parseFromString(this.innerHTML || "", "text/html");
            innerHTMLDOM.querySelectorAll("*").forEach(function (el) {
                el.style.color = "";
            });
            this.innerHTML = innerHTMLDOM.body.innerHTML;
        }
    };
    Block.prototype.isHTML = function () {
        return this.originalElement === "__raw_html__";
    };
    Block.prototype.isIframe = function () {
        var _a;
        return (_a = this.innerHTML) === null || _a === void 0 ? void 0 : _a.startsWith("<iframe");
    };
    Block.prototype.makeBlockEditable = function () {
        var _this = this;
        var canvasStore = (0, canvasStore_1.default)();
        this.selectBlock();
        canvasStore.editableBlock = this;
        (0, vue_1.nextTick)(function () {
            var _a;
            (_a = _this.getEditor()) === null || _a === void 0 ? void 0 : _a.commands.focus("all");
        });
    };
    Block.prototype.isExtendedFromComponent = function () {
        return Boolean(this.extendedFromComponent) || Boolean(this.isChildOfComponent);
    };
    Block.prototype.getComponentRoot = function () {
        var block = this;
        var editingMode = (0, canvasStore_1.default)().editingMode;
        if (editingMode == "page") {
            if (!block.isExtendedFromComponent()) {
                return null;
            }
        }
        while (block && block.isExtendedFromComponent()) {
            if (block.extendedFromComponent)
                return block;
            block = block.getParentBlock();
        }
        if (editingMode == "fragment") {
            while (block && !block.isExtendedFromComponent() && block.getParentBlock()) {
                block = block.getParentBlock();
            }
        }
        return block;
    };
    Block.prototype.getPropsRoot = function () {
        var componentRoot = this.getComponentRoot();
        if (componentRoot)
            return componentRoot;
        var block = this;
        while (block) {
            if (Object.keys(block.props || {}).length > 0)
                return block;
            block = block.getParentBlock();
        }
        return null;
    };
    Block.prototype.convertToRepeater = function () {
        this.setBaseStyle("display", "flex");
        this.setBaseStyle("flexDirection", "column");
        this.setBaseStyle("alignItems", "flex-start");
        this.setBaseStyle("justifyContent", "flex-start");
        this.setBaseStyle("flexWrap", "wrap");
        this.setBaseStyle("height", "fit-content");
        this.setBaseStyle("gap", "20px");
        this.isRepeaterBlock = true;
    };
    Block.prototype.moveChild = function (child, index) {
        var childIndex = this.children.findIndex(function (block) { return block.blockId === child.blockId; });
        if (childIndex > -1) {
            this.children.splice(childIndex, 1);
            this.children.splice(index, 0, child);
        }
    };
    Block.prototype.isRepeater = function () {
        return Boolean(this.isRepeaterBlock);
    };
    Block.prototype.getDataKey = function (key) {
        var _a;
        var dataKey = (this.dataKey && this.dataKey[key]) || "";
        if (!dataKey && this.isExtendedFromComponent()) {
            dataKey = ((_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.getDataKey(key)) || "";
        }
        return dataKey;
    };
    Block.prototype.setDataKey = function (key, value) {
        if (!this.dataKey || !this.dataKey[key]) {
            this.dataKey = {
                key: "",
                type: this.isImage() || this.isLink() ? "attribute" : "key",
                property: this.isLink() ? "href" : this.isImage() ? "src" : "innerHTML",
                comesFrom: "dataScript",
            };
        }
        if (!value && key === "key") {
            this.dataKey = {};
        }
        else {
            this.dataKey[key] = value;
        }
    };
    Block.prototype.getInnerHTML = function () {
        var _a;
        var innerHTML = this.innerHTML || "";
        if (!innerHTML && this.isExtendedFromComponent()) {
            innerHTML = ((_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.getInnerHTML()) || "";
        }
        return String(innerHTML);
    };
    Block.prototype.getText = function () {
        var editor = this.getEditor();
        if (editor && editor.isEditable) {
            return editor.getText();
        }
        return this.getTextContent() || "";
    };
    Block.prototype.setInnerHTML = function (innerHTML) {
        this.innerHTML = innerHTML;
    };
    Block.prototype.toggleVisibility = function (show) {
        if (show === void 0) { show = null; }
        if ((this.getStyle("display") === "none" && show !== false) || show === true) {
            this.setStyle("display", this.getStyle("__last_display") || "flex");
            this.setStyle("__last_display", null);
        }
        else {
            this.setStyle("__last_display", this.getStyle("display"));
            this.setStyle("display", "none");
        }
    };
    Block.prototype.isVisible = function (breakpoint) {
        return this.getStyle("display", breakpoint) !== "none";
    };
    Block.prototype.extendFromComponent = function (componentName) {
        var _a, _b;
        this.extendedFromComponent = componentName;
        // @ts-expect-error
        (_b = (_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.effect) === null || _b === void 0 ? void 0 : _b.run();
        var component = this.referenceComponent;
        if (component) {
            (0, componentInstance_1.extendWithComponent)(this, componentName, component.children);
        }
    };
    Block.prototype.isChildOfComponentBlock = function () {
        return Boolean(this.isChildOfComponent);
    };
    Block.prototype.resetWithComponent = function () {
        var _a, _b;
        var component = this.referenceComponent;
        if (component) {
            (0, componentInstance_1.resetWithComponent)(this, this.extendedFromComponent, component.children);
            // TODO: Remove this
            var canvasStore = (0, canvasStore_1.default)();
            (_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.resume(undefined, true, true);
        }
    };
    Block.prototype.syncWithComponent = function () {
        var component = this.referenceComponent;
        if (component) {
            (0, componentInstance_1.syncBlockWithComponent)(this, this, this.extendedFromComponent, component.children);
        }
    };
    Block.prototype.rebuildWithComponent = function (componentId, newComponentChildren, oldComponentChildren) {
        (0, componentInstance_1.rebuildWithComponent)(this, componentId, newComponentChildren, oldComponentChildren);
    };
    Block.prototype.resetChanges = function (resetChildren) {
        if (resetChildren === void 0) { resetChildren = false; }
        (0, tree_1.resetBlock)(this, resetChildren);
    };
    Block.prototype.convertToLink = function () {
        this.elementBeforeConversion = this.element;
        this.element = "a";
    };
    Block.prototype.unsetLink = function () {
        this.removeAttribute("href");
        this.removeAttribute("target");
        if (this.elementBeforeConversion) {
            this.element = this.elementBeforeConversion;
        }
    };
    Block.prototype.getElement = function () {
        var _a;
        if (!this.element && this.isExtendedFromComponent()) {
            return (_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.element;
        }
        return this.element;
    };
    Block.prototype.getUsedComponentNames = function () {
        var componentStore = (0, componentStore_1.default)();
        var componentNames = [];
        if (this.extendedFromComponent) {
            componentNames.push(this.extendedFromComponent);
        }
        if (this.isChildOfComponent) {
            componentNames.push(this.isChildOfComponent);
        }
        this.children.forEach(function (child) {
            componentNames.push.apply(componentNames, child.getUsedComponentNames());
        });
        componentNames.forEach(function (name) {
            componentNames.push.apply(componentNames, componentStore.getComponentBlock(name).getUsedComponentNames());
        });
        return new Set(componentNames);
    };
    Block.prototype.getUsedVariableNames = function () {
        var variableNames = [];
        var varPattern = /var\(--([a-zA-Z0-9_-]+)/g;
        var extractVarsFromValue = function (value) {
            if (!value || typeof value !== "string")
                return;
            var matches = value.matchAll(varPattern);
            for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
                var match = matches_1[_i];
                variableNames.push(match[1]);
            }
        };
        var styleObjects = [this.baseStyles, this.mobileStyles, this.tabletStyles];
        styleObjects.forEach(function (styleObj) {
            if (styleObj) {
                Object.values(styleObj).forEach(extractVarsFromValue);
            }
        });
        if (this.innerHTML) {
            extractVarsFromValue(this.innerHTML);
        }
        this.children.forEach(function (child) {
            variableNames.push.apply(variableNames, child.getUsedVariableNames());
        });
        return new Set(variableNames);
    };
    Block.prototype.isFlex = function () {
        return this.getStyle("display") === "flex";
    };
    Block.prototype.isGrid = function () {
        return this.getStyle("display") === "grid";
    };
    Block.prototype.isRow = function () {
        return this.isFlex() && this.getStyle("flexDirection") === "row";
    };
    Block.prototype.isColumn = function () {
        return this.isFlex() && this.getStyle("flexDirection") === "column";
    };
    Block.prototype.duplicateBlock = function () {
        var _a, _b, _c;
        if (this.isRoot()) {
            return;
        }
        var canvasStore = (0, canvasStore_1.default)();
        var pauseId = (_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.pause();
        var blockCopy = (0, helpers_1.getBlockCopy)(this);
        var parentBlock = this.getParentBlock();
        if (blockCopy.getStyle("position") === "absolute") {
            // shift the block a bit
            var left = (0, helpers_1.getNumberFromPx)(blockCopy.getStyle("left"));
            var top_1 = (0, helpers_1.getNumberFromPx)(blockCopy.getStyle("top"));
            blockCopy.setStyle("left", "".concat(left + 20, "px"));
            blockCopy.setStyle("top", "".concat(top_1 + 20, "px"));
        }
        var child = null;
        if (parentBlock) {
            child = parentBlock.addChildAfter(blockCopy, this);
        }
        else {
            child = (_c = canvasStore.activeCanvas) === null || _c === void 0 ? void 0 : _c.getRootBlock().addChild(blockCopy);
        }
        (0, vue_1.nextTick)(function () {
            var _a, _b;
            if (child) {
                child.selectBlock();
                pauseId && ((_b = (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.history) === null || _b === void 0 ? void 0 : _b.resume(pauseId, true, true));
            }
        });
    };
    Block.prototype.setPadding = function (padding) {
        (0, helpers_1.setBoxSpacing)(this, "padding", padding);
    };
    Block.prototype.getPadding = function (opts) {
        return (0, helpers_1.getBoxSpacing)(this, "padding", opts);
    };
    Block.prototype.setMargin = function (margin) {
        (0, helpers_1.setBoxSpacing)(this, "margin", margin);
    };
    Block.prototype.getMargin = function (opts) {
        return (0, helpers_1.getBoxSpacing)(this, "margin", opts);
    };
    Block.prototype.getDynamicValues = function () {
        var _a;
        var dynamicValues = __spreadArray([], this.dynamicValues, true);
        var dynamicValueProperties = dynamicValues.map(function (v) { return v.property; });
        if (this.isExtendedFromComponent()) {
            var componentDynamicValues = ((_a = this.referenceComponent) === null || _a === void 0 ? void 0 : _a.getDynamicValues()) || [];
            componentDynamicValues.forEach(function (v) {
                if (!dynamicValueProperties.includes(v.property)) {
                    dynamicValues.push(v);
                }
            });
        }
        return dynamicValues;
    };
    Block.prototype.setDynamicValue = function (property, type, key, comesFrom) {
        if (key === void 0) { key = null; }
        if (comesFrom === void 0) { comesFrom = "dataScript"; }
        var existingKey = this.getDynamicKey(property, type);
        if (existingKey) {
            this.dynamicValues = this.dynamicValues.map(function (v) {
                if (v.property === property && v.type === type) {
                    return __assign(__assign({}, v), { key: key || "", comesFrom: comesFrom });
                }
                return v;
            });
        }
        else {
            this.dynamicValues.push({
                property: property,
                type: type,
                key: key || "",
                comesFrom: comesFrom,
            });
        }
    };
    Block.prototype.removeDynamicValue = function (property, type) {
        this.dynamicValues = this.dynamicValues.filter(function (v) { return !(v.property === property && v.type === type); });
    };
    Block.prototype.getDynamicKey = function (property, type) {
        var dynamicValue = this.dynamicValues.find(function (v) { return v.property === property && v.type === type; });
        if (dynamicValue) {
            return dynamicValue.key;
        }
        return null;
    };
    Block.prototype.getRepeaterParent = function () {
        var parent = this.parentBlock;
        while (parent) {
            if (parent.isRepeater()) {
                return parent;
            }
            parent = parent.parentBlock;
        }
        return null;
    };
    Block.prototype.isInsideRepeater = function () {
        return Boolean(this.getRepeaterParent());
    };
    Block.prototype.getBlockProps = function () {
        var _a;
        var propsRoot = this.getPropsRoot();
        if (!propsRoot)
            return __assign({}, (this.props || {}));
        var referenceProps = propsRoot.extendedFromComponent ? ((_a = propsRoot.referenceComponent) === null || _a === void 0 ? void 0 : _a.props) || {} : {};
        return __assign(__assign({}, referenceProps), (propsRoot.props || {}));
    };
    Block.prototype.setBlockProps = function (props) {
        var propsRoot = this.getPropsRoot() || this;
        propsRoot.props = props;
    };
    return Block;
}());
exports.default = Block;
//# sourceMappingURL=block.js.map