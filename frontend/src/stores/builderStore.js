"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var builderSettings_1 = require("@/data/builderSettings");
var realtimeHandler_1 = __importDefault(require("@/utils/realtimeHandler"));
var core_1 = require("@vueuse/core");
var frappe_ui_1 = require("frappe-ui");
var frappe_1 = require("frappe-ui/frappe");
var pinia_1 = require("pinia");
var capture = (0, frappe_1.useTelemetry)().capture;
var useBuilderStore = (0, pinia_1.defineStore)("builderStore", {
    state: function () { return ({
        activeLayers: null,
        blockContextMenu: null,
        propertyFilter: null,
        mode: "select", // check setEvents in BuilderCanvas for usage
        lastMode: "select",
        autoSave: true,
        showSearchBlock: false,
        builderLayout: {
            rightPanelWidth: 275,
            leftPanelWidth: 250,
            scriptEditorHeight: 300,
            optionsPanelWidth: 57,
        },
        leftPanelActiveTab: "Layers",
        showRightPanel: true,
        showLeftPanel: true,
        showVersionHistory: false,
        showHTMLDialog: false,
        showDataScriptDialog: null,
        realtime: new realtimeHandler_1.default(),
        readOnlyMode: false,
        // site-level maintenance/migration state, not the editor's edit lock
        isSiteInReadOnlyMode: window.is_read_only_mode === "True",
        viewers: [],
        isFCSite: window.is_fc_site === "True" ? true : false,
        activeFolder: (0, core_1.useStorage)("activeFolder", ""),
        activeSection: (0, core_1.useStorage)("activeSection", "all"),
        isDark: (0, core_1.useDark)({
            attribute: "data-theme",
        }),
        canvasDarkMode: (0, core_1.useStorage)("canvasDarkMode", false),
        highlightBlocksWithClientScripts: false,
        showSettingsDialog: false,
        settingsActiveTab: (0, core_1.useStorage)("settingsActiveTab", "page_general"),
        openImageUpload: false,
    }); },
    getters: {
        isAIEnabled: function () {
            var _a;
            return !!((_a = builderSettings_1.builderSettings.doc) === null || _a === void 0 ? void 0 : _a.ai_api_key);
        },
        // folder a newly created page should be filed under based on the active
        // section (Funnel Pages are tagged with a project folder; home/all are not)
        sectionFolder: function () {
            if (this.activeFolder)
                return this.activeFolder;
            if (this.activeSection === "funnel")
                return "Funnel Pages";
            return "";
        },
    },
    actions: {
        toggleReadOnlyMode: function (readonly) {
            if (readonly === void 0) { readonly = null; }
            this.readOnlyMode = readonly !== null && readonly !== void 0 ? readonly : !this.readOnlyMode;
        },
        setHomePage: function (route) {
            return builderSettings_1.builderSettings.setValue
                .submit({
                home_page: route,
            })
                .then(function () {
                capture("builder_homepage_set");
                frappe_ui_1.toast.success("Homepage set successfully");
            });
        },
        unsetHomePage: function () {
            return builderSettings_1.builderSettings.setValue
                .submit({
                home_page: "",
            })
                .then(function () {
                capture("builder_homepage_unset");
                frappe_ui_1.toast.success("This page will no longer be the homepage");
            });
        },
        updateBuilderSettings: function (key, value) {
            var _a;
            return builderSettings_1.builderSettings.setValue
                .submit((_a = {},
                _a[key] = value,
                _a))
                .then(function () {
                builderSettings_1.builderSettings.reload();
            });
        },
        openBuilderSettings: function () {
            window.open("/app/builder-settings", "_blank");
        },
    },
});
exports.default = useBuilderStore;
//# sourceMappingURL=builderStore.js.map