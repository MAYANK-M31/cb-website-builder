"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDashboardState = useDashboardState;
var core_1 = require("@vueuse/core");
var vue_1 = require("vue");
var searchFilter = (0, vue_1.ref)("");
var selectionMode = (0, vue_1.ref)(false);
var selectedPages = (0, vue_1.ref)(new Set());
var treeExpanded = (0, vue_1.ref)(true);
var showTemplatesDialog = (0, vue_1.ref)(false);
// remembers the template group the picker was last drilled into ("" = gallery)
var lastTemplateGroup = (0, core_1.useStorage)("lastTemplateGroup", "");
// active category filter in the template gallery ("" = All)
var templateCategoryFilter = (0, core_1.useStorage)("templateCategoryFilter", "");
var displayType = (0, core_1.useStorage)("displayType", "grid");
var typeFilter = (0, core_1.useStorage)("typeFilter", "");
var orderBy = (0, core_1.useStorage)("orderBy", "creation");
var expandTreeFn = (0, vue_1.ref)(null);
var collapseTreeFn = (0, vue_1.ref)(null);
function useDashboardState() {
    return {
        searchFilter: searchFilter,
        selectionMode: selectionMode,
        selectedPages: selectedPages,
        treeExpanded: treeExpanded,
        showTemplatesDialog: showTemplatesDialog,
        lastTemplateGroup: lastTemplateGroup,
        templateCategoryFilter: templateCategoryFilter,
        displayType: displayType,
        typeFilter: typeFilter,
        orderBy: orderBy,
        expandTreeFn: expandTreeFn,
        collapseTreeFn: collapseTreeFn,
    };
}
//# sourceMappingURL=useDashboardState.js.map