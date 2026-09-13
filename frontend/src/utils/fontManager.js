"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fontListItems = void 0;
exports.loadFontList = loadFontList;
exports.setFont = setFont;
exports.setFontFromHTML = setFontFromHTML;
exports.getFontWeightOptions = getFontWeightOptions;
var userFonts_1 = __importDefault(require("@/data/userFonts"));
var useBuilderToken_1 = require("@/utils/useBuilderToken");
var vue_1 = require("vue");
var WEIGHT_LABELS = {
    "100": "Thin",
    "200": "Extra Light",
    "300": "Light",
    "400": "Regular",
    "500": "Medium",
    "600": "Semi Bold",
    "700": "Bold",
    "800": "Extra Bold",
    "900": "Black",
};
var GF_CSS = "https://fonts.googleapis.com/css2";
var fontCache = new Map();
// the Google Fonts catalog is ~110KB, so it stays out of the main bundle
// and loads on first use (font pickers read the reactive ref)
var fontListItems = (0, vue_1.shallowRef)([]);
exports.fontListItems = fontListItems;
var fontListPromise = null;
function loadFontList() {
    if (!fontListPromise) {
        fontListPromise = Promise.resolve().then(function () { return __importStar(require("@/utils/fontList.json")); }).then(function (m) {
            fontListItems.value = m.default.items;
            return fontListItems.value;
        });
    }
    return fontListPromise;
}
function loadCustomFont(font, url) {
    return new FontFace(font, "url(\"".concat(url, "\")"))
        .load()
        .then(function (face) {
        document.fonts.add(face);
        return font;
    })
        .catch(function () {
        console.warn("Failed to load custom font: ".concat(font));
        return font;
    });
}
function loadGoogleFont(font, weight) {
    return new Promise(function (resolve) {
        var attempt = function (withWeight) {
            var familyParam = withWeight
                ? "".concat(encodeURIComponent(font), ":wght@").concat(weight)
                : encodeURIComponent(font);
            var link = document.createElement("link");
            link.id = "gf-".concat(font.replace(/\s+/g, "-")).concat(withWeight ? "-".concat(weight) : "");
            link.rel = "stylesheet";
            link.crossOrigin = "anonymous";
            link.href = "".concat(GF_CSS, "?family=").concat(familyParam, "&display=swap");
            link.addEventListener("load", function () { return resolve(font); }, { once: true });
            link.addEventListener("error", function () {
                link.remove();
                if (withWeight) {
                    // Single-weight faces (Italiana, Young Serif, Caprasimo…) 400 on ANY
                    // wght@ request — the css2 API rejects weights a family doesn't carry.
                    // Retry the family default; the browser synthesises the bold.
                    attempt(false);
                    return;
                }
                console.warn("Failed to load font: ".concat(font));
                resolve(font);
            }, { once: true });
            document.head.appendChild(link);
        };
        attempt(!!weight);
    });
}
// A Font design token (fontFamily: var(--id)) stands in for its family, so every
// caller can work with the family without knowing whether a style is tokenized.
function resolveFontToken(font) {
    if (!font.includes("var("))
        return font;
    var resolveVariableValue = (0, useBuilderToken_1.useBuilderToken)().resolveVariableValue;
    var resolved = resolveVariableValue(font);
    return resolved === font ? "" : resolved; // unknown token: no family to work with
}
function setFont(font, weight) {
    if (!font)
        return Promise.resolve("");
    if (font.includes("var(")) {
        var resolved = resolveFontToken(font);
        if (!resolved)
            return Promise.resolve(font);
        font = resolved;
    }
    var cacheKey = weight ? "".concat(font, ":").concat(weight) : font;
    if (fontCache.has(cacheKey))
        return fontCache.get(cacheKey);
    // userFont list resource may not have loaded yet (e.g. a page rendered right
    // after navigation); fall back to treating it as a Google font until it does.
    var customFont = (userFonts_1.default.data || []).find(function (f) { return f.font_name === font; });
    var promise = customFont ? loadCustomFont(font, customFont.font_file) : loadGoogleFont(font, weight);
    fontCache.set(cacheKey, promise);
    return promise;
}
function setFontFromHTML(html) {
    var _a;
    var matches = (_a = html.match(/font-family:\s*([^;"]+)[";]/g)) !== null && _a !== void 0 ? _a : [];
    matches
        .map(function (m) { return m.replace(/font-family:\s*([^;"]+)[";]/, "$1").trim(); })
        .filter(Boolean)
        .forEach(function (font) { return setFont(font); });
}
function getFontWeightOptions(font) {
    loadFontList();
    var family = font ? resolveFontToken(font) : font;
    var fontObj = family && fontListItems.value.find(function (f) { return f.family === family; });
    if (!fontObj)
        return [{ value: "400", label: "Regular" }];
    return fontObj.variants
        .filter(function (v) { return !v.includes("italic"); })
        .map(function (v) {
        var _a;
        var value = (v === "regular" ? "400" : v);
        return { value: value, label: (_a = WEIGHT_LABELS[value]) !== null && _a !== void 0 ? _a : v };
    });
}
//# sourceMappingURL=fontManager.js.map