"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frappe_ui_1 = require("frappe-ui");
var builderProjectFolder = (0, frappe_ui_1.createListResource)({
    method: "GET",
    doctype: "Builder Project Folder",
    fields: ["folder_name", "is_standard"],
    orderBy: "folder_name",
    cache: "builderProjectFolder",
    start: 0,
    pageLength: 100,
    auto: true,
});
exports.default = builderProjectFolder;
//# sourceMappingURL=builderProjectFolder.js.map