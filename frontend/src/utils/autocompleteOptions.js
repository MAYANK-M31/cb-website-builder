"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_OPTIONS = void 0;
exports.filterOptions = filterOptions;
var MAX_OPTIONS = 20;
exports.MAX_OPTIONS = MAX_OPTIONS;
// typing filters to matching options; an exact match (the current selection)
// shows the list windowed around it, with about a third of the window above it
function filterOptions(options, query, limit) {
    if (limit === void 0) { limit = MAX_OPTIONS; }
    var normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery)
        return options.slice(0, limit);
    var selectedIndex = options.findIndex(function (option) { return option.label.toLowerCase() === normalizedQuery; });
    if (selectedIndex === -1) {
        return options.filter(function (option) { return option.label.toLowerCase().includes(normalizedQuery); }).slice(0, limit);
    }
    var maxStart = Math.max(options.length - limit, 0);
    var start = Math.min(Math.max(selectedIndex - Math.floor(limit / 3), 0), maxStart);
    return options.slice(start, start + limit);
}
//# sourceMappingURL=autocompleteOptions.js.map