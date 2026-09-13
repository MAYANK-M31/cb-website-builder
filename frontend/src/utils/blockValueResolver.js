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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockValueResolver = void 0;
var helpers_1 = require("@/utils/helpers");
var BlockValueResolver = /** @class */ (function () {
    function BlockValueResolver(context) {
        this.context = context;
    }
    Object.defineProperty(BlockValueResolver.prototype, "block", {
        get: function () {
            return this.context.block();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BlockValueResolver.prototype, "hasValues", {
        get: function () {
            return Boolean(this.context.data() ||
                this.context.defaultProps() ||
                Object.keys(this.block.getBlockProps()).length ||
                Object.keys(this.context.componentData() || {}).length);
        },
        enumerable: false,
        configurable: true
    });
    BlockValueResolver.prototype.getDataValue = function (path) {
        return (0, helpers_1.getDataForKey)(this.context.data() || {}, path);
    };
    BlockValueResolver.prototype.getComponentDataValue = function (path) {
        return (0, helpers_1.getDataForKey)(this.context.componentData() || {}, path);
    };
    BlockValueResolver.prototype.getPropValue = function (name, block) {
        var _this = this;
        if (block === void 0) { block = this.block; }
        return (0, helpers_1.getPropValue)(name, block, function (path) { return _this.getDataValue(path); }, this.context.defaultProps(), function (path) { return _this.getComponentDataValue(path); });
    };
    BlockValueResolver.prototype.getResolvedProps = function () {
        var _this = this;
        var defaultProps = Object.fromEntries(Object.entries(this.context.defaultProps() || {}).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, value.value];
        }));
        var blockProps = Object.fromEntries(Object.keys(this.block.getBlockProps()).map(function (key) { return [key, _this.getPropValue(key)]; }));
        var parentProps = Object.fromEntries(Object.entries((0, helpers_1.getParentProps)(this.block)).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [
                key,
                _this.getPropValue(key, value.block),
            ];
        }));
        return __assign(__assign(__assign({}, parentProps), blockProps), defaultProps);
    };
    BlockValueResolver.prototype.resolve = function (dataKey) {
        if (!dataKey.key)
            return undefined;
        if (dataKey.comesFrom === "props") {
            return this.getPropValue(dataKey.key);
        }
        if (dataKey.comesFrom === "componentData") {
            return this.getComponentDataValue(dataKey.key);
        }
        return this.getDataValue(dataKey.key);
    };
    BlockValueResolver.prototype.applyDynamicValues = function (type, values) {
        var _this = this;
        var _a;
        if (!this.hasValues)
            return values;
        var dataKey = this.getPrimaryDataKey();
        if (dataKey.type === type && dataKey.property) {
            values[dataKey.property] = (_a = this.resolve(dataKey)) !== null && _a !== void 0 ? _a : values[dataKey.property];
        }
        this.block
            .getDynamicValues()
            .filter(function (value) { return value.type === type && value.property; })
            .forEach(function (value) {
            var _a;
            values[value.property] = (_a = _this.resolve(value)) !== null && _a !== void 0 ? _a : values[value.property];
        });
        return values;
    };
    BlockValueResolver.prototype.isHiddenByVisibilityCondition = function () {
        var condition = this.block.getVisibilityCondition();
        if (!(condition === null || condition === void 0 ? void 0 : condition.key))
            return false;
        return !Boolean(this.resolve(condition));
    };
    BlockValueResolver.prototype.getPrimaryDataKey = function () {
        var property = this.block.getDataKey("property");
        var type = this.block.getDataKey("type") || (property === "innerHTML" ? "key" : undefined);
        return {
            key: this.block.getDataKey("key"),
            type: type,
            comesFrom: (this.block.getDataKey("comesFrom") || "dataScript"),
            property: property,
        };
    };
    return BlockValueResolver;
}());
exports.BlockValueResolver = BlockValueResolver;
//# sourceMappingURL=blockValueResolver.js.map