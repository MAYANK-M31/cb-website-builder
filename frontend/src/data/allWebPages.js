"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allWebPages = void 0;
var frappe_ui_1 = require("frappe-ui");
var allWebPages = (0, frappe_ui_1.createListResource)({
    method: "GET",
    doctype: "Builder Page",
    fields: ["name", "route"],
    filters: {
        is_template: 0,
        published: 1,
        authenticated_access: 0,
        dynamic_route: 0,
    },
    cache: "all_pages",
    pageLength: 100,
    auto: true,
});
exports.allWebPages = allWebPages;
//# sourceMappingURL=allWebPages.js.map