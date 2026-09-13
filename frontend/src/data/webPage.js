"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webPages = exports.templateGroups = exports.searchablePages = void 0;
var frappe_ui_1 = require("frappe-ui");
var webPages = (0, frappe_ui_1.createListResource)({
    method: "GET",
    doctype: "Builder Page",
    fields: [
        "name",
        "route",
        "page_name",
        "preview",
        "page_title",
        "meta_image",
        "creation",
        "published",
        "dynamic_route",
        "modified_by",
        "modified",
        "is_template",
        "authenticated_access",
        "project_folder",
        "is_standard",
        "owner",
    ],
    filters: {
        is_template: 0,
    },
    cache: "pages",
    pageLength: 50,
});
exports.webPages = webPages;
var templateGroups = (0, frappe_ui_1.createResource)({
    url: "builder.api.get_template_groups",
    cache: "template-groups",
});
exports.templateGroups = templateGroups;
var searchablePages = (0, frappe_ui_1.createListResource)({
    method: "GET",
    doctype: "Builder Page",
    fields: ["name", "route", "page_name", "page_title"],
    filters: {
        is_template: 0,
    },
    cache: "searchable-pages",
    orderBy: "modified desc",
    pageLength: 10,
});
exports.searchablePages = searchablePages;
//# sourceMappingURL=webPage.js.map