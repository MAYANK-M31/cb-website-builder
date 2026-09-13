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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffArray = exports.deepEqual = exports.shortenNumber = exports.setBoxSpacing = exports.removeDefaultUnit = exports.parseAndSetBackground = exports.normalizeValueWithUnits = exports.mapToObject = exports.HSVToHex = exports.HexToHSV = exports.extractComponentId = exports.getStandardPropValue = exports.getRGB = exports.getPropValue = exports.getParentProps = exports.getNumberFromPx = exports.getDefaultPropsList = exports.getDataArray = exports.getBoxSpacing = exports.extractNumberAndUnit = exports.detachBlockFromComponent = exports.cssUrl = exports.addPxToNumber = void 0;
exports.alert = alert;
exports.confirm = confirm;
exports.copyToClipboard = copyToClipboard;
exports.dataURLtoFile = dataURLtoFile;
exports.findNearestSiblingIndex = findNearestSiblingIndex;
exports.generateId = generateId;
exports.getBlock = getBlock;
exports.getBlockCopy = getBlockCopy;
exports.getBlockInfo = getBlockInfo;
exports.getBlockInstance = getBlockInstance;
exports.getBlockObject = getBlockObjectCopy;
exports.getBlockString = getBlockString;
exports.getCopyWithoutParent = getCopyWithoutParent;
exports.getDataForKey = getDataForKey;
exports.getImageBlock = getImageBlock;
exports.getPageUsageMessage = getPageUsageMessage;
exports.getRepeaterScopedData = getRepeaterScopedData;
exports.getRootBlockTemplate = getRootBlockTemplate;
exports.getRouteVariables = getRouteVariables;
exports.getTextContent = getTextContent;
exports.getVideoBlock = getVideoBlock;
exports.handleBase64Attribute = handleBase64Attribute;
exports.isBlock = isBlock;
exports.isCtrlOrCmd = isCtrlOrCmd;
exports.isDialogOpen = isDialogOpen;
exports.isHTMLString = isHTMLString;
exports.isInteractiveControl = isInteractiveControl;
exports.isJSONString = isJSONString;
exports.isTargetEditable = isTargetEditable;
exports.kebabToCamelCase = kebabToCamelCase;
exports.normalizeCSSPropertyName = normalizeCSSPropertyName;
exports.openInDesk = openInDesk;
exports.replaceMapKey = replaceMapKey;
exports.showDialog = showDialog;
exports.stripStatePrefix = stripStatePrefix;
exports.toCSSProperty = toCSSProperty;
exports.toKebabCase = toKebabCase;
exports.toStyleProperty = toStyleProperty;
exports.toTitleCase = toTitleCase;
exports.triggerCopyEvent = triggerCopyEvent;
exports.uploadBuilderAsset = uploadBuilderAsset;
exports.uploadUserFont = uploadUserFont;
exports.parseJSONWithFallback = parseJSONWithFallback;
var block_1 = __importDefault(require("@/block"));
var canvasStore_1 = __importDefault(require("@/stores/canvasStore"));
var blockTemplate_1 = __importDefault(require("@/utils/blockTemplate"));
var frappe_ui_1 = require("frappe-ui");
var vue_1 = require("vue");
var colors_1 = require("./colors");
Object.defineProperty(exports, "getRGB", { enumerable: true, get: function () { return colors_1.getRGB; } });
Object.defineProperty(exports, "HexToHSV", { enumerable: true, get: function () { return colors_1.HexToHSV; } });
Object.defineProperty(exports, "HSVToHex", { enumerable: true, get: function () { return colors_1.HSVToHex; } });
var cssUtils_1 = require("./cssUtils");
Object.defineProperty(exports, "addPxToNumber", { enumerable: true, get: function () { return cssUtils_1.addPxToNumber; } });
Object.defineProperty(exports, "extractNumberAndUnit", { enumerable: true, get: function () { return cssUtils_1.extractNumberAndUnit; } });
Object.defineProperty(exports, "getBoxSpacing", { enumerable: true, get: function () { return cssUtils_1.getBoxSpacing; } });
Object.defineProperty(exports, "getNumberFromPx", { enumerable: true, get: function () { return cssUtils_1.getNumberFromPx; } });
Object.defineProperty(exports, "normalizeValueWithUnits", { enumerable: true, get: function () { return cssUtils_1.normalizeValueWithUnits; } });
Object.defineProperty(exports, "parseAndSetBackground", { enumerable: true, get: function () { return cssUtils_1.parseAndSetBackground; } });
Object.defineProperty(exports, "removeDefaultUnit", { enumerable: true, get: function () { return cssUtils_1.removeDefaultUnit; } });
Object.defineProperty(exports, "setBoxSpacing", { enumerable: true, get: function () { return cssUtils_1.setBoxSpacing; } });
Object.defineProperty(exports, "shortenNumber", { enumerable: true, get: function () { return cssUtils_1.shortenNumber; } });
function toTitleCase(str) {
    return str.replace(/[_-]/g, " ").replace(/\b\w/g, function (l) { return l.toUpperCase(); });
}
function confirm(message_1) {
    return __awaiter(this, arguments, void 0, function (message, title) {
        if (title === void 0) { title = "Confirm"; }
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    showDialog({
                        title: title,
                        message: message,
                        icon: {
                            name: "alert-circle",
                            appearance: "warning",
                        },
                        actions: [
                            {
                                label: "Cancel",
                                variant: "subtle",
                                onClick: function () { return resolve(false); },
                            },
                            {
                                label: "Confirm",
                                theme: "red",
                                onClick: function () { return resolve(true); },
                            },
                        ],
                    });
                })];
        });
    });
}
function alert(message_1) {
    return __awaiter(this, arguments, void 0, function (message, title) {
        if (title === void 0) { title = "Alert"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, showDialog({
                        title: title,
                        message: message,
                        actions: [{ label: "Ok", variant: "solid", onClick: function () { } }],
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
function getTextContent(html) {
    if (!html || !isHTMLString(html)) {
        return html || "";
    }
    var tmp = document.createElement("div");
    tmp.innerHTML = html || "";
    var textContent = tmp.textContent || tmp.innerText || "";
    tmp.remove();
    return textContent;
}
function isHTMLString(str) {
    return /<[a-z][\s\S]*>/i.test(str);
}
function copyToClipboard(text, e, copyFormat) {
    var _a;
    if (copyFormat === void 0) { copyFormat = "text/plain"; }
    if (typeof text !== "string") {
        text = JSON.stringify(text);
    }
    (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.setData(copyFormat, text);
}
function findNearestSiblingIndex(e) {
    var nearestElementIndex = 0;
    var minDistance = Number.MAX_VALUE;
    var parent = e.target;
    var elements = Array.from(parent.children);
    elements.forEach(function (element, index) {
        var rect = element.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;
        var distance = Math.sqrt(Math.pow(centerX - e.clientX, 2) + Math.pow(centerY - e.clientY, 2));
        if (distance < minDistance) {
            minDistance = distance;
            nearestElementIndex = index;
            var positionBitmask = element.compareDocumentPosition(e.target);
            // sourcery skip: possible-incorrect-bitwise-operator
            if (positionBitmask & Node.DOCUMENT_POSITION_PRECEDING) {
                // before
            }
            else {
                nearestElementIndex += 1;
            }
        }
    });
    return nearestElementIndex;
}
// converts border-color to borderColor
function kebabToCamelCase(str) {
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .toLowerCase()
        .replace(/\s+/g, "-");
}
function normalizeCSSPropertyName(property) {
    return (property || "").trim().toLowerCase();
}
var INTERACTIVE_CONTROL_SELECTOR = "input, textarea, select, button, a, [role='button'], [contenteditable='true'], .form-input, [class~='group/autocomplete']";
// used to let control widgets keep their own click/contextmenu behaviour
function isInteractiveControl(target) {
    if (!(target instanceof HTMLElement))
        return false;
    return Boolean(target.closest(INTERACTIVE_CONTROL_SELECTOR));
}
// splits an optional state prefix (hover:color) from the property name
function splitStylePrefix(style) {
    var separatorIndex = style.indexOf(":");
    if (separatorIndex === -1)
        return { prefix: "", property: style };
    return { prefix: style.slice(0, separatorIndex + 1), property: style.slice(separatorIndex + 1) };
}
// hover:border-color -> hover:borderColor
function toStyleProperty(cssProperty) {
    var _a = splitStylePrefix(cssProperty), prefix = _a.prefix, property = _a.property;
    return "".concat(prefix).concat(kebabToCamelCase(property));
}
// hover:borderColor -> hover:border-color
function toCSSProperty(style) {
    var _a = splitStylePrefix(style), prefix = _a.prefix, property = _a.property;
    return "".concat(prefix).concat(toKebabCase(property));
}
function stripStatePrefix(style) {
    return splitStylePrefix(style).property;
}
function isJSONString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
function isTargetEditable(e) {
    var target = e.target;
    var isEditable = target.isContentEditable;
    var isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
    return isEditable || isInput;
}
function getDataForKey(datum, key) {
    var data = Object.assign({}, datum);
    var value = key
        .split(".")
        .reduce(function (d, key) { return (d && typeof d === "object" ? d[key] : null); }, data);
    return value;
}
function replaceMapKey(map, oldKey, newKey) {
    var newMap = new Map();
    map.forEach(function (value, key) {
        if (key === oldKey) {
            newMap.set(newKey, value);
        }
        else {
            newMap.set(key, value);
        }
    });
    return newMap;
}
var mapToObject = function (map) { return Object.fromEntries(map.entries()); };
exports.mapToObject = mapToObject;
function getBlockInstance(options, retainId) {
    if (retainId === void 0) { retainId = true; }
    if (typeof options === "string") {
        options = JSON.parse(options);
    }
    if (!retainId) {
        var deleteBlockId_1 = function (block) {
            delete block.blockId;
            for (var _i = 0, _a = block.children || []; _i < _a.length; _i++) {
                var child = _a[_i];
                deleteBlockId_1(child);
            }
        };
        deleteBlockId_1(options);
    }
    return (0, vue_1.reactive)(new block_1.default(options));
}
function getBlockCopy(block, retainId) {
    if (retainId === void 0) { retainId = false; }
    var b = getBlockObjectCopy(block);
    return getBlockInstance(b, retainId);
}
function isCtrlOrCmd(e) {
    return e.ctrlKey || e.metaKey;
}
var detachBlockFromComponent = function (block, componentId) {
    if (!componentId) {
        componentId = block.extendedFromComponent;
    }
    var blockCopy = getBlockCopy(block, true);
    if (block.extendedFromComponent && block.extendedFromComponent != componentId) {
        return blockCopy;
    }
    var component = block.referenceComponent;
    blockCopy.element = block === null || block === void 0 ? void 0 : block.getElement();
    blockCopy.attributes = block.getAttributes();
    blockCopy.classes = block.getClasses();
    blockCopy.baseStyles = (component === null || component === void 0 ? void 0 : component.baseStyles)
        ? __assign(__assign({}, component.baseStyles), block.baseStyles) : block.baseStyles;
    blockCopy.mobileStyles = (component === null || component === void 0 ? void 0 : component.mobileStyles)
        ? __assign(__assign({}, component.mobileStyles), block.mobileStyles) : block.mobileStyles;
    blockCopy.tabletStyles = (component === null || component === void 0 ? void 0 : component.tabletStyles)
        ? __assign(__assign({}, component.tabletStyles), block.tabletStyles) : block.tabletStyles;
    blockCopy.customAttributes = (component === null || component === void 0 ? void 0 : component.customAttributes)
        ? __assign(__assign({}, component.customAttributes), block.customAttributes) : block.customAttributes;
    blockCopy.isRepeaterBlock = (component === null || component === void 0 ? void 0 : component.isRepeaterBlock) || block.isRepeaterBlock;
    blockCopy.visibilityCondition = (component === null || component === void 0 ? void 0 : component.visibilityCondition) || block.visibilityCondition;
    blockCopy.innerHTML = block.innerHTML || (component === null || component === void 0 ? void 0 : component.innerHTML);
    blockCopy.props = Object.fromEntries(Object.entries(block.getBlockProps()).map(function (_a) {
        var _b, _c, _d;
        var key = _a[0], prop = _a[1];
        var propCopy = __assign({}, prop); // creating copy to avoid mutating original prop
        if (propCopy.isStandard) {
            var value = propCopy.value || ((_c = (_b = propCopy.propOptions) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.defaultValue);
            if (!["string", "select"].includes((_d = propCopy.propOptions) === null || _d === void 0 ? void 0 : _d.type)) {
                propCopy.value = JSON.stringify(value);
            }
            else {
                propCopy.value = value;
            }
            propCopy.isStandard = false;
            propCopy.propOptions = undefined;
        }
        return [key, propCopy];
    }));
    delete blockCopy.extendedFromComponent;
    delete blockCopy.componentVersion;
    delete blockCopy.isChildOfComponent;
    delete blockCopy.referenceBlockId;
    blockCopy.children = blockCopy.children.map(function (block) { return detachBlockFromComponent(block, componentId); });
    return getBlockInstance(blockCopy);
};
exports.detachBlockFromComponent = detachBlockFromComponent;
function getBlockString(block) {
    return JSON.stringify(getCopyWithoutParent(block));
}
function getBlockObjectCopy(block) {
    return JSON.parse(getBlockString(block));
}
function getCopyWithoutParent(block) {
    var _a;
    var blockCopy = __assign({}, (0, vue_1.toRaw)(block));
    blockCopy.children = (_a = blockCopy.children) === null || _a === void 0 ? void 0 : _a.map(function (child) { return getCopyWithoutParent(child); });
    delete blockCopy.parentBlock;
    delete blockCopy.referenceComponent;
    if (!blockCopy.extendedFromComponent) {
        delete blockCopy.componentVersion;
    }
    return removeEmptyBlockValues(blockCopy);
}
function isEmptyValue(value) {
    if (value === null || value === "") {
        return true;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (value && typeof value === "object") {
        return Object.keys(value).length === 0;
    }
    return false;
}
var diffArray = function (src, oldComp) {
    var oldJson = new Set((oldComp || []).map(function (item) { return JSON.stringify(item); }));
    return (src || []).filter(function (item) { return !oldJson.has(JSON.stringify(item)); });
};
exports.diffArray = diffArray;
var deepEqual = function (a, b) { return JSON.stringify(a) === JSON.stringify(b); };
exports.deepEqual = deepEqual;
function removeEmptyBlockValues(block) {
    if (block.clientScript) {
        block.clientScript = __assign({}, block.clientScript);
        for (var _i = 0, _a = Object.keys(block.clientScript); _i < _a.length; _i++) {
            var key = _a[_i];
            if (isEmptyValue(block.clientScript[key])) {
                delete block.clientScript[key];
            }
        }
    }
    for (var _b = 0, _c = Object.keys(block); _b < _c.length; _b++) {
        var key = _c[_b];
        if (isEmptyValue(block[key])) {
            delete block[key];
        }
    }
    return block;
}
function getRouteVariables(route) {
    var variables = [];
    route.split("/").map(function (part) {
        if (part.startsWith(":") && part.length > 1) {
            variables.push(part.slice(1));
        }
        if (part.startsWith("<") && part.length > 1) {
            variables.push(part.slice(1, -1));
        }
    });
    return variables;
}
function uploadBuilderAsset(file_1) {
    return __awaiter(this, arguments, void 0, function (file, silent) {
        var uploader, fileDoc, upload;
        if (silent === void 0) { silent = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uploader = new frappe_ui_1.FileUploadHandler();
                    fileDoc = {
                        file_url: "",
                        file_name: "",
                    };
                    upload = uploader.upload(file, {
                        private: false,
                        folder: "Home/Builder Uploads",
                        upload_endpoint: "/api/method/builder.api.upload_builder_asset",
                    });
                    return [4 /*yield*/, new Promise(function (resolve) {
                            if (silent) {
                                upload.then(function (data) {
                                    fileDoc.file_name = data.file_name;
                                    fileDoc.file_url = data.file_url;
                                    resolve(fileDoc);
                                });
                                return;
                            }
                            frappe_ui_1.toast.promise(upload, {
                                loading: "Uploading...",
                                success: function (data) {
                                    fileDoc.file_name = data.file_name;
                                    fileDoc.file_url = data.file_url;
                                    resolve(fileDoc);
                                    return "Uploaded";
                                },
                                error: function () { return "Failed to upload"; },
                                duration: 500,
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, {
                            fileURL: fileDoc.file_url,
                            fileName: fileDoc.file_name,
                        }];
            }
        });
    });
}
function dataURLtoFile(dataurl, filename) {
    try {
        var arr = dataurl.split(",");
        var mimeMatch = arr[0].match(/:(.*?)(;|,)/);
        var mime_1 = mimeMatch ? mimeMatch[1] : "";
        var isBase64 = arr[0].includes(";base64");
        var dataString = arr.slice(1).join(",");
        var u8arr = void 0;
        if (isBase64) {
            var bstr = atob(dataString);
            var n = bstr.length;
            u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
        }
        else {
            var decoded = decodeURIComponent(dataString);
            var n = decoded.length;
            u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = decoded.charCodeAt(n);
            }
        }
        return new File([u8arr], filename, { type: mime_1 });
    }
    catch (error) {
        console.error("Failed to convert dataURL ".concat(dataurl.substring(0, 50), "... to file."), error);
        return null;
    }
}
function handleBase64Attribute(block, attrName, fileName) {
    var attrValue = block.getAttribute(attrName);
    if (attrValue === null || attrValue === void 0 ? void 0 : attrValue.startsWith("data:image")) {
        var file = dataURLtoFile(attrValue, fileName);
        if (file) {
            block.setAttribute(attrName, "");
            uploadBuilderAsset(file, true).then(function (obj) {
                block.setAttribute(attrName, obj.fileURL);
            });
        }
    }
}
// Lazily loads the wawoff2 wasm runtime (sets window.Module) and decompresses
// a woff2 buffer to raw font bytes; non-woff2 buffers are returned unchanged.
function decompressFontIfWoff2(arrayBuffer, isWoff2) {
    return __awaiter(this, void 0, void 0, function () {
        var loadScript, path, init_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isWoff2)
                        return [2 /*return*/, arrayBuffer];
                    if (!!window.Module) return [3 /*break*/, 2];
                    loadScript = function (src) {
                        return new Promise(function (onload) {
                            return document.documentElement.append(Object.assign(document.createElement("script"), { src: src, onload: onload }));
                        });
                    };
                    path = "https://unpkg.com/wawoff2@2.0.1/build/decompress_binding.js";
                    init_1 = new Promise(function (done) { return (window.Module = { onRuntimeInitialized: done }); });
                    return [4 /*yield*/, loadScript(path).then(function () { return init_1; })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, Uint8Array.from(window.Module.decompress(arrayBuffer)).buffer];
            }
        });
    });
}
function getFontNameFromFile(file) {
    return __awaiter(this, void 0, void 0, function () {
        var arrayBuffer, buffer, opentype;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, file.arrayBuffer()];
                case 1:
                    arrayBuffer = _a.sent();
                    return [4 /*yield*/, decompressFontIfWoff2(arrayBuffer, file.name.endsWith(".woff2"))];
                case 2:
                    buffer = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("opentype.js")); })];
                case 3:
                    opentype = _a.sent();
                    return [2 /*return*/, opentype.parse(buffer).names.fullName.en];
            }
        });
    });
}
function uploadUserFont(file_1) {
    return __awaiter(this, arguments, void 0, function (file, options) {
        var userFont, fontName, existingFont, confirmed, uploadPromise;
        var _this = this;
        var _a;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("@/data/userFonts")); })];
                case 1:
                    userFont = (_b.sent()).default;
                    return [4 /*yield*/, getFontNameFromFile(file)];
                case 2:
                    fontName = _b.sent();
                    existingFont = (_a = userFont.data) === null || _a === void 0 ? void 0 : _a.find(function (f) { return f.font_name === fontName; });
                    if (existingFont) {
                        frappe_ui_1.toast.info("Font \"".concat(fontName, "\" already exists in the project"));
                        return [2 /*return*/, { uploaded: false, fontName: fontName, alreadyExists: true }];
                    }
                    if (!options.confirmBeforeUpload) return [3 /*break*/, 4];
                    return [4 /*yield*/, confirm("Do you want to upload the font \"".concat(fontName, "\"?"), "Upload Font")];
                case 3:
                    confirmed = _b.sent();
                    if (!confirmed) {
                        return [2 /*return*/, null];
                    }
                    _b.label = 4;
                case 4:
                    uploadPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                        var fileUploadHandler, uploadedFile, fontFace, loadedFont, e_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    fileUploadHandler = new frappe_ui_1.FileUploadHandler();
                                    return [4 /*yield*/, fileUploadHandler.upload(file, {
                                            private: false,
                                            folder: "Home/Builder Uploads/Fonts",
                                        })];
                                case 1:
                                    uploadedFile = _b.sent();
                                    fontFace = new FontFace(fontName, "url(\"".concat(uploadedFile.file_url, "\")"));
                                    return [4 /*yield*/, fontFace.load()];
                                case 2:
                                    loadedFont = _b.sent();
                                    document.fonts.add(loadedFont);
                                    _b.label = 3;
                                case 3:
                                    _b.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, userFont.insert.submit({
                                            font_name: fontName,
                                            font_file: uploadedFile.file_url,
                                        })];
                                case 4:
                                    _b.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    e_1 = _b.sent();
                                    if (!((_a = e_1 === null || e_1 === void 0 ? void 0 : e_1.message) === null || _a === void 0 ? void 0 : _a.includes("DuplicateEntryError"))) {
                                        throw e_1;
                                    }
                                    return [3 /*break*/, 6];
                                case 6: return [4 /*yield*/, userFont.fetch()];
                                case 7:
                                    _b.sent();
                                    return [2 /*return*/, { uploaded: true, fontName: fontName }];
                            }
                        });
                    }); })();
                    frappe_ui_1.toast.promise(uploadPromise, {
                        loading: "Uploading font...",
                        success: "Font \"".concat(fontName, "\" uploaded successfully"),
                        error: "Failed to upload font",
                    });
                    return [2 /*return*/, uploadPromise];
            }
        });
    });
}
function generateId() {
    return Math.random().toString(36).slice(2, 11);
}
function isBlock(e) {
    return ((e.target instanceof HTMLElement || e.target instanceof SVGElement) &&
        e.target.closest(".__builder_component__"));
}
function getBlockInfo(e) {
    var _a;
    var target = (_a = e.target) === null || _a === void 0 ? void 0 : _a.closest(".__builder_component__");
    return target.dataset;
}
function getBlock(e) {
    var _a;
    var canvasStore = (0, canvasStore_1.default)();
    var blockInfo = getBlockInfo(e);
    return (_a = canvasStore.activeCanvas) === null || _a === void 0 ? void 0 : _a.findBlock(blockInfo.blockId);
}
function getRootBlockTemplate() {
    return getBlockInstance((0, blockTemplate_1.default)("body"));
}
function getImageBlock(imageSrc, imageAlt) {
    if (imageAlt === void 0) { imageAlt = ""; }
    var imageBlock = (0, blockTemplate_1.default)("image");
    if (!imageBlock.attributes) {
        imageBlock.attributes = {};
    }
    imageBlock.attributes.src = imageSrc;
    return imageBlock;
}
function getVideoBlock(videoSrc) {
    var videoBlock = (0, blockTemplate_1.default)("video");
    if (!videoBlock.attributes) {
        videoBlock.attributes = {};
    }
    videoBlock.attributes.src = videoSrc;
    return videoBlock;
}
function openInDesk(page) {
    window.open("/app/builder-page/".concat(page.page_name), "_blank");
}
// quote the URL so that file names with spaces or special characters stay valid CSS
var cssUrl = function (url) { return "url(\"".concat(url.replace(/"/g, '\\"'), "\")"); };
exports.cssUrl = cssUrl;
function showDialog(options) {
    var _this = this;
    var appearanceToTheme = { warning: "yellow", info: "blue", danger: "red", success: "green" };
    return new Promise(function (resolve) {
        var _a;
        frappe_ui_1.dialog.confirm(__assign({ title: options.title || "", message: options.message, size: options.size || "md", actions: (options.actions || []).map(function (action) {
                var _a, _b;
                return ({
                    label: action.label,
                    variant: (_a = action.variant) !== null && _a !== void 0 ? _a : "subtle",
                    theme: (_b = action.theme) !== null && _b !== void 0 ? _b : "gray",
                    onClick: function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var close = _b.close;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!action.onClick) return [3 /*break*/, 2];
                                    return [4 /*yield*/, action.onClick()];
                                case 1:
                                    _c.sent();
                                    _c.label = 2;
                                case 2:
                                    close();
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); },
                });
            }), onCancel: function () { return resolve(); } }, (options.icon
            ? { icon: options.icon.name, theme: appearanceToTheme[(_a = options.icon.appearance) !== null && _a !== void 0 ? _a : "info"] }
            : {})));
    });
}
function getCollectionKeys(block, type) {
    if (type === void 0) { type = "dataScript"; }
    // traverse up the block to get list of dataKeys set
    var repeaterBlock = block.getRepeaterParent();
    var keys = [];
    if (repeaterBlock) {
        var collectionKey = repeaterBlock.getDataKey("key");
        var comesFrom = repeaterBlock.getDataKey("comesFrom");
        if (collectionKey && comesFrom == type) {
            keys.push(collectionKey);
        }
        var parentKeys = getCollectionKeys(repeaterBlock, type);
        if (parentKeys.length > 0) {
            keys.unshift.apply(keys, parentKeys);
        }
    }
    return keys;
}
// Drill into data for blocks inside repeaters (uses the first item of each collection)
function getRepeaterScopedData(block, data, type) {
    if (type === void 0) { type = "dataScript"; }
    var collectionObject = data || {};
    if (block === null || block === void 0 ? void 0 : block.isInsideRepeater()) {
        var keys = getCollectionKeys(block, type);
        collectionObject = keys.reduce(function (acc, key) {
            var data = getDataForKey(acc, key);
            return Array.isArray(data) && data.length > 0 ? data[0] : data;
        }, collectionObject);
    }
    return collectionObject || {};
}
function triggerCopyEvent() {
    document.execCommand("copy");
}
var getParentProps = function (baseBlock, baseProps) {
    if (baseProps === void 0) { baseProps = {}; }
    var parentBlock = baseBlock.getParentBlock();
    if (parentBlock) {
        var parentProps_1 = {};
        Object.entries(parentBlock.getBlockProps())
            .filter(function (_a) {
            var _ = _a[0], propDetails = _a[1];
            return propDetails.isPassedDown;
        })
            .forEach(function (_a) {
            var propName = _a[0], propDetails = _a[1];
            parentProps_1[propName] = __assign(__assign({}, propDetails), { block: parentBlock });
        });
        var combinedProps = __assign(__assign({}, parentProps_1), baseProps);
        return getParentProps(parentBlock, combinedProps);
    }
    else {
        return baseProps;
    }
};
exports.getParentProps = getParentProps;
var getDefaultPropsList = function (block) {
    var _a;
    var isCurrentBlockInRepeater = block === null || block === void 0 ? void 0 : block.isInsideRepeater();
    var repeaterRoot = isCurrentBlockInRepeater ? block === null || block === void 0 ? void 0 : block.getRepeaterParent() : null;
    if (repeaterRoot) {
        var key = repeaterRoot.getDataKey("key");
        var comesFrom = repeaterRoot.getDataKey("comesFrom");
        if (key && comesFrom === "props") {
            var propsRoot = repeaterRoot.getPropsRoot();
            if (!propsRoot)
                return {};
            var parsedValue = (_a = getStandardPropValue(key, propsRoot)) === null || _a === void 0 ? void 0 : _a.value;
            if (!parsedValue)
                return {};
            if (Array.isArray(parsedValue)) {
                return {
                    item: {
                        value: parsedValue[0],
                        isStandard: false,
                        isDynamic: true,
                        comesFrom: "props",
                        isPassedDown: true,
                    },
                };
            }
            else if (typeof parsedValue === "object") {
                return {
                    key: {
                        value: Object.keys(parsedValue)[0],
                        isStandard: false,
                        isDynamic: true,
                        comesFrom: "props",
                        isPassedDown: true,
                    },
                    value: {
                        value: parsedValue[Object.keys(parsedValue)[0]],
                        isStandard: false,
                        isDynamic: true,
                        comesFrom: "props",
                        isPassedDown: true,
                    },
                };
            }
        }
    }
    return {};
};
exports.getDefaultPropsList = getDefaultPropsList;
var PARSEABLE_STANDARD_TYPES = ["number", "boolean", "object", "array"];
// TODO: re-visit all props related functions as block props are now replaced with component props
var getPropValue = function (propName, block, getDataScriptValue, defaultProps, getComponentScopedDataValue) {
    var _a, _b;
    if (getDataScriptValue === void 0) { getDataScriptValue = function () { return undefined; }; }
    if (getComponentScopedDataValue === void 0) { getComponentScopedDataValue = function () { return undefined; }; }
    // Check default props first
    if ((defaultProps === null || defaultProps === void 0 ? void 0 : defaultProps[propName]) !== undefined) {
        return defaultProps[propName].value;
    }
    var parentProps = null;
    // Find matching prop from block or parent
    var blockProps = block.getBlockProps();
    var matchingProp = (_a = blockProps[propName]) !== null && _a !== void 0 ? _a : (parentProps = getParentProps(block))[propName];
    if (!matchingProp) {
        return undefined;
    }
    // Handle dynamic props
    if (matchingProp.isDynamic) {
        if (matchingProp.comesFrom === "props" && matchingProp.value) {
            if ((defaultProps === null || defaultProps === void 0 ? void 0 : defaultProps[matchingProp.value]) !== undefined) {
                return defaultProps[matchingProp.value].value;
            }
            if (parentProps === null) {
                parentProps = getParentProps(block);
            }
            var newMatchingProp = parentProps[matchingProp.value];
            if (!(newMatchingProp === null || newMatchingProp === void 0 ? void 0 : newMatchingProp.block))
                return undefined;
            return getPropValue(matchingProp.value, newMatchingProp.block, getDataScriptValue, defaultProps, getComponentScopedDataValue);
        }
        if (matchingProp.comesFrom === "dataScript" && matchingProp.value) {
            return getDataScriptValue(matchingProp.value);
        }
        if (matchingProp.comesFrom === "componentData" && matchingProp.value) {
            return getComponentScopedDataValue(matchingProp.value);
        }
        // Fallback to default props
        if (matchingProp.value && (defaultProps === null || defaultProps === void 0 ? void 0 : defaultProps[matchingProp.value]) !== undefined) {
            return defaultProps[matchingProp.value].value;
        }
        return undefined;
    }
    // Handle standard props
    if (matchingProp.isStandard && matchingProp.propOptions) {
        var _c = matchingProp.propOptions, type = _c.type, options = _c.options;
        var defaultValue = (_b = options === null || options === void 0 ? void 0 : options.defaultValue) !== null && _b !== void 0 ? _b : null;
        if (PARSEABLE_STANDARD_TYPES.includes(type)) {
            if (matchingProp.value) {
                return JSON.parse(matchingProp.value);
            }
            else {
                if (typeof defaultValue === "string") {
                    return JSON.parse(defaultValue);
                }
                return defaultValue;
            }
        }
        return matchingProp.value || defaultValue;
    }
    return matchingProp.value;
};
exports.getPropValue = getPropValue;
var getStandardPropValue = function (propName, componentRoot) {
    var _a, _b, _c, _d, _e, _f, _g;
    var propsOfComponentRoot = componentRoot.getBlockProps();
    if (propsOfComponentRoot) {
        for (var _i = 0, _h = Object.entries(propsOfComponentRoot); _i < _h.length; _i++) {
            var _j = _h[_i], name_1 = _j[0], value = _j[1];
            if (propName === name_1 && value.isStandard) {
                if (PARSEABLE_STANDARD_TYPES.includes(((_a = value.propOptions) === null || _a === void 0 ? void 0 : _a.type) || "string")) {
                    var parsedValue = value.value
                        ? JSON.parse(value.value)
                        : ((_c = (_b = value.propOptions) === null || _b === void 0 ? void 0 : _b.options) === null || _c === void 0 ? void 0 : _c.defaultValue) || null;
                    return {
                        value: parsedValue,
                        options: ((_d = value.propOptions) === null || _d === void 0 ? void 0 : _d.options) || {},
                    };
                }
                else {
                    return {
                        value: value.value || ((_f = (_e = value.propOptions) === null || _e === void 0 ? void 0 : _e.options) === null || _f === void 0 ? void 0 : _f.defaultValue) || null,
                        options: ((_g = value.propOptions) === null || _g === void 0 ? void 0 : _g.options) || {},
                    };
                }
            }
        }
        return undefined;
    }
    else {
        return undefined;
    }
};
exports.getStandardPropValue = getStandardPropValue;
var extractComponentId = function (block) {
    var _a = (0, canvasStore_1.default)(), editingMode = _a.editingMode, fragmentData = _a.fragmentData;
    var componentId = block.extendedFromComponent || null;
    if (!componentId) {
        // in fragment mode the component root does not have extendedFromComponent
        if (editingMode == "fragment" && !block.getParentBlock())
            componentId = fragmentData.fragmentId;
    }
    return componentId;
};
exports.extractComponentId = extractComponentId;
var getDataArray = function (collectionObject) {
    var result = [];
    var collectionObjectCopy = __assign({}, collectionObject);
    function processObject(obj, prefix) {
        if (prefix === void 0) { prefix = ""; }
        Object.entries(obj).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var path = prefix ? "".concat(prefix, ".").concat(key) : key;
            if (value === null) {
                result.push(path);
            }
            else if (typeof value === "object" && !Array.isArray(value)) {
                processObject(value, path);
            }
            else if (["string", "number", "boolean"].includes(typeof value)) {
                result.push(path);
            }
        });
    }
    processObject(collectionObjectCopy);
    return result;
};
exports.getDataArray = getDataArray;
function isDialogOpen() {
    return !!document.querySelector("[role='dialog']");
}
function getPageUsageMessage(count) {
    if (!count) {
        return "not used in any pages";
    }
    return count === 1 ? "used in 1 page" : "used in ".concat(count, " pages");
}
function parseJSONWithFallback(value, fallback) {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return fallback;
        }
    }
    return value;
}
//# sourceMappingURL=helpers.js.map