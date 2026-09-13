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
exports.tokenType = exports.defaultBuilderToken = void 0;
exports.useBuilderToken = useBuilderToken;
var builderToken_1 = __importDefault(require("@/data/builderToken"));
var vue_1 = require("vue");
exports.defaultBuilderToken = {
    token_name: "",
    value: "#000000",
    type: "Color",
    dark_value: undefined,
    group: undefined,
};
// legacy rows can carry a blank or lower-cased type; everything reads it through here
var tokenType = function (token) {
    var type = (token.type || "Color").toLowerCase();
    if (type === "font")
        return "Font";
    if (type === "dimension")
        return "Dimension";
    return "Color";
};
exports.tokenType = tokenType;
var instance = null;
function builderTokenComposable() {
    var _this = this;
    var cssVariables = (0, vue_1.computed)(function () {
        return (builderToken_1.default.data || []).reduce(function (obj, builderToken) {
            if (!builderToken.name || !builderToken.value)
                return obj;
            obj["--".concat(builderToken.name)] = builderToken.value;
            return obj;
        }, {});
    });
    var darkCssVariables = (0, vue_1.computed)(function () {
        return (builderToken_1.default.data || []).reduce(function (obj, builderToken) {
            if (!builderToken.name || !builderToken.dark_value)
                return obj;
            obj["--".concat(builderToken.name)] = builderToken.dark_value;
            return obj;
        }, {});
    });
    // extracts the variable key (e.g. "--uuid") from values like "var(--uuid)" or "--uuid"
    var extractVariableKey = function (value) {
        if (!value || value.startsWith("#")) {
            return null;
        }
        var variableName = value;
        if (variableName.startsWith("var(--")) {
            var match = variableName.match(/^var\(\s*(--[^) ,]+)/);
            variableName = match ? match[1] : variableName;
        }
        else if (!variableName.startsWith("--")) {
            return null;
        }
        return variableName;
    };
    var resolveVariableValue = function (value, isDarkMode) {
        var _a, _b;
        if (isDarkMode === void 0) { isDarkMode = false; }
        var key = extractVariableKey(value);
        if (!key) {
            return value;
        }
        var variables = isDarkMode ? darkCssVariables.value : cssVariables.value;
        return (_b = (_a = variables[key]) !== null && _a !== void 0 ? _a : cssVariables.value[key]) !== null && _b !== void 0 ? _b : value;
    };
    var getVariableName = function (value) {
        var key = extractVariableKey(value);
        if (!key) {
            return null;
        }
        var name = key.slice(2);
        var variable = (builderToken_1.default.data || []).find(function (builderToken) { return builderToken.name === name; });
        return (variable === null || variable === void 0 ? void 0 : variable.token_name) || null;
    };
    var createVariable = function (builderToken) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!builderToken.token_name || !builderToken.value) {
                        throw new Error("Variable name and value are required");
                    }
                    return [4 /*yield*/, builderToken_1.default.insert.submit(__assign(__assign({}, exports.defaultBuilderToken), builderToken))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    var updateVariable = function (builderToken) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!builderToken.name || !builderToken.token_name || !builderToken.value) {
                        throw new Error("Variable name, id and value are required");
                    }
                    return [4 /*yield*/, builderToken_1.default.setValue.submit(builderToken)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
    var deleteVariable = function (name) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!name) {
                        throw new Error("Variable name is required");
                    }
                    return [4 /*yield*/, builderToken_1.default.delete.submit(name)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var fontTokens = (0, vue_1.computed)(function () {
        return (builderToken_1.default.data || []).filter(function (t) { return (0, exports.tokenType)(t) === "Font" && t.value; });
    });
    return {
        cssVariables: cssVariables,
        darkCssVariables: darkCssVariables,
        fontTokens: fontTokens,
        resolveVariableValue: resolveVariableValue,
        getVariableName: getVariableName,
        createVariable: createVariable,
        updateVariable: updateVariable,
        deleteVariable: deleteVariable,
        variables: (0, vue_1.computed)({
            get: function () { return builderToken_1.default.data || []; },
            set: function (value) {
                builderToken_1.default.data = value;
            },
        }),
    };
}
function useBuilderToken() {
    if (instance)
        return instance;
    instance = builderTokenComposable();
    return instance;
}
//# sourceMappingURL=useBuilderToken.js.map