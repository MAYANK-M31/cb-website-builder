"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frappe_ui_1 = require("frappe-ui");
var routeRedirects = (0, frappe_ui_1.createListResource)({
    method: "GET",
    doctype: "Website Route Redirect",
    parent: "Website Settings",
    fields: ["source", "target", "redirect_http_status", "forward_query_parameters", "name"],
    orderBy: "idx desc",
    cache: "routeRedirects",
    start: 0,
    pageLength: 100,
});
exports.default = routeRedirects;
//# sourceMappingURL=routeRedirects.js.map