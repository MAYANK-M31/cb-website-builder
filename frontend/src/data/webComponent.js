"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frappe_ui_1 = require("frappe-ui");
var webComponent = (0, frappe_ui_1.createListResource)({
    method: "GET",
    doctype: "Builder Component",
    fields: ["component_name", "name", "for_web_page", "component_id"],
    orderBy: "modified desc",
    cache: "builderComponents",
    start: 0,
    pageLength: 100,
});
exports.default = webComponent;
//# sourceMappingURL=webComponent.js.map