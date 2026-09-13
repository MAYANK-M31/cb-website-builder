"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highlightSource = highlightSource;
exports.highlightTarget = highlightTarget;
var METACHARS = /[()[\].*+?^$|]/g;
var BACKREFS = /\\\d+/g;
var escapeHtml = function (value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
function highlightSource(value) {
    return escapeHtml(value).replace(METACHARS, function (m) { return "<span class=\"text-ink-amber-6\">".concat(m, "</span>"); });
}
function highlightTarget(value) {
    return escapeHtml(value).replace(BACKREFS, function (m) { return "<span class=\"text-ink-blue-8\">".concat(m, "</span>"); });
}
//# sourceMappingURL=redirectSyntax.js.map