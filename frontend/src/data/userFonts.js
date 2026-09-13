"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frappe_ui_1 = require("frappe-ui");
var userFont = (0, frappe_ui_1.createListResource)({
    method: "GET",
    doctype: "User Font",
    fields: ["font_name", "font_file"],
    cache: "userFonts",
    start: 0,
    pageLength: 50,
    auto: true,
});
exports.default = userFont;
//# sourceMappingURL=userFonts.js.map