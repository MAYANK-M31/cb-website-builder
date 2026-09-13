"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frappe_ui_1 = require("frappe-ui");
var builderBlockTemplate = (0, frappe_ui_1.createListResource)({
    method: "GET",
    doctype: "Block Template",
    fields: ["template_name", "category", "preview", "name", "preview_width", "preview_height", "sort_order"],
    orderBy: "sort_order asc",
    cache: "blockTemplates",
    start: 0,
    pageLength: 100,
});
exports.default = builderBlockTemplate;
//# sourceMappingURL=builderBlockTemplate.js.map