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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createStartingState = void 0;
var autocomplete_1 = require("@codemirror/autocomplete");
var commands_1 = require("@codemirror/commands");
var language_1 = require("@codemirror/language");
var search_1 = require("@codemirror/search");
var state_1 = require("@codemirror/state");
var view_1 = require("@codemirror/view");
var codemirror_1 = require("codemirror");
var jsGlobalCompletion_1 = __importDefault(require("./jsGlobalCompletion"));
var pythonCustomCompletion_1 = __importDefault(require("./pythonCustomCompletion"));
var vue_1 = require("vue");
var CustomSearchPanel_vue_1 = __importDefault(require("@/components/Controls/CodeMirror/CustomSearchPanel.vue"));
var codemirror_indentation_markers_1 = require("@replit/codemirror-indentation-markers");
var createStartingState = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var updateEmitter, blurListener, basicSetup, extensions, _c, _d, javascript, javascriptLanguage, _e, python, pythonLanguage, html, css, json, startState;
    var props = _b.props, _f = _b.extraExtensions, extraExtensions = _f === void 0 ? [] : _f, // to add extra extensions without recreating state (eg: linting)
    pythonCompletions = _b.pythonCompletions, onSaveCallback = _b.onSaveCallback, onChangeCallback = _b.onChangeCallback, onBlurCallback = _b.onBlurCallback, _g = _b.initialValue, initialValue = _g === void 0 ? "" : _g, // to override initial value without recreating state (eg: when resetting)
    mode = _b.mode, blockProps = _b.blockProps;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                updateEmitter = codemirror_1.EditorView.updateListener.of(function (update) {
                    if (update.docChanged)
                        onChangeCallback();
                });
                blurListener = onBlurCallback
                    ? codemirror_1.EditorView.domEventHandlers({
                        blur: function (event, view) {
                            onBlurCallback(view.state.doc.toString());
                            return false; // Don't prevent default
                        },
                    })
                    : [];
                basicSetup = (function () { return [
                    props.showLineNumbers ? (0, view_1.lineNumbers)() : [],
                    props.showLineNumbers ? codemirror_1.EditorView.lineWrapping : [],
                    props.readonly ? (0, view_1.highlightActiveLineGutter)() : [],
                    (0, view_1.highlightSpecialChars)(),
                    (0, commands_1.history)(),
                    (0, language_1.foldGutter)(),
                    (0, view_1.drawSelection)(),
                    (0, view_1.dropCursor)(),
                    state_1.EditorState.allowMultipleSelections.of(true),
                    (0, language_1.indentOnInput)(),
                    (0, language_1.syntaxHighlighting)(language_1.defaultHighlightStyle, { fallback: true }),
                    (0, language_1.bracketMatching)(),
                    (0, autocomplete_1.closeBrackets)(),
                    (0, autocomplete_1.autocompletion)({
                        activateOnTyping: true,
                    }),
                    (0, view_1.rectangularSelection)(),
                    (0, view_1.crosshairCursor)(),
                    (0, view_1.highlightActiveLine)(),
                    (0, search_1.highlightSelectionMatches)(),
                    view_1.keymap.of(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], autocomplete_1.closeBracketsKeymap, true), commands_1.defaultKeymap, true), search_1.searchKeymap, true), commands_1.historyKeymap, true), language_1.foldKeymap, true), autocomplete_1.completionKeymap, true)),
                ]; })();
                extensions = __spreadArray(__spreadArray([
                    basicSetup,
                    state_1.EditorState.readOnly.of(props.readonly),
                    // EditorView.editable.of(!props.readonly), // removes cursor but also disables search // TODO: use https://codemirror.net/docs/ref/#search.openSearchPanel
                    updateEmitter,
                    blurListener
                ], extraExtensions, true), [
                    view_1.keymap.of([
                        {
                            key: "Tab",
                            run: commands_1.indentMore,
                            shift: commands_1.indentLess,
                        },
                    ]),
                    codemirror_1.EditorView.domEventHandlers({
                        // to avoid interfering with builder clipboard events
                        cut: function (event, view) {
                            event.stopPropagation();
                        },
                        copy: function (event, view) {
                            event.stopPropagation();
                        },
                        paste: function (event, view) {
                            event.stopPropagation();
                        },
                    }),
                    (0, search_1.search)({
                        createPanel: function (view) {
                            var dom = document.createElement("div");
                            dom.classList.add("@container");
                            var app = (0, vue_1.createApp)(CustomSearchPanel_vue_1.default);
                            app.provide("view", view);
                            app.provide("enableReplace", !props.readonly);
                            app.mount(dom);
                            return {
                                dom: dom,
                                top: true,
                            };
                        },
                    }),
                    (0, codemirror_indentation_markers_1.indentationMarkers)(),
                ], false);
                if (props.allowSave || !props.readOnly) {
                    extensions.push(view_1.keymap.of([
                        {
                            key: "Ctrl-s",
                            mac: "Cmd-s",
                            run: function () {
                                onSaveCallback();
                                return true;
                            },
                            stopPropagation: true,
                        },
                    ]));
                }
                _c = props.type;
                switch (_c) {
                    case "JavaScript": return [3 /*break*/, 1];
                    case "Python": return [3 /*break*/, 3];
                    case "HTML": return [3 /*break*/, 5];
                    case "CSS": return [3 /*break*/, 7];
                    case "JSON": return [3 /*break*/, 9];
                }
                return [3 /*break*/, 11];
            case 1: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("@codemirror/lang-javascript")); })];
            case 2:
                _d = _h.sent(), javascript = _d.javascript, javascriptLanguage = _d.javascriptLanguage;
                extensions.push(javascript(), javascriptLanguage.data.of({
                    autocomplete: function (context) {
                        return (0, jsGlobalCompletion_1.default)(context, __assign({}, (mode == "block" ? __assign({}, blockProps) : {})));
                    },
                }));
                return [3 /*break*/, 11];
            case 3: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("@codemirror/lang-python")); })];
            case 4:
                _e = _h.sent(), python = _e.python, pythonLanguage = _e.pythonLanguage;
                extensions.push(python(), pythonLanguage.data.of({
                    autocomplete: function (context) { return (0, pythonCustomCompletion_1.default)(context, pythonCompletions); },
                }));
                return [3 /*break*/, 11];
            case 5: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("@codemirror/lang-html")); })];
            case 6:
                html = (_h.sent()).html;
                extensions.push(html());
                return [3 /*break*/, 11];
            case 7: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("@codemirror/lang-css")); })];
            case 8:
                css = (_h.sent()).css;
                extensions.push(css());
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("@codemirror/lang-json")); })];
            case 10:
                json = (_h.sent()).json;
                extensions.push(json());
                return [3 /*break*/, 11];
            case 11:
                startState = state_1.EditorState.create({
                    doc: props.initialValue || initialValue || "",
                    extensions: extensions,
                });
                return [2 /*return*/, { startState: startState }];
        }
    });
}); };
exports.createStartingState = createStartingState;
//# sourceMappingURL=createCodeMirrorState.js.map