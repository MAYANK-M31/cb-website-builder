"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builderSettings = void 0;
var frappe_ui_1 = require("frappe-ui");
(0, frappe_ui_1.setConfig)("resourceFetcher", frappe_ui_1.frappeRequest);
var builderSettings = (0, frappe_ui_1.createDocumentResource)({
    doctype: "Builder Settings",
    name: "Builder Settings",
});
exports.builderSettings = builderSettings;
//# sourceMappingURL=builderSettings.js.map