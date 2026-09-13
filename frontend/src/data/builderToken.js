"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frappe_ui_1 = require("frappe-ui");
var builderTokens = (0, frappe_ui_1.createListResource)({
    method: "GET",
    doctype: "Builder Token",
    fields: ["name", "token_name", "value", "type", "is_standard", "dark_value", "group"],
    cache: "builderTokens",
    start: 0,
    pageLength: 500,
    auto: true,
    orderBy: "creation desc",
});
exports.default = builderTokens;
//# sourceMappingURL=builderToken.js.map