"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var frappe_ui_1 = require("frappe-ui");
var codeCompletions = (0, frappe_ui_1.createResource)({
    url: "builder.api.get_codemirror_completions",
    method: "GET",
    auto: true,
});
exports.default = codeCompletions;
//# sourceMappingURL=codeCompletions.js.map