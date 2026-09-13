"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSiteReadOnlyNotice = useSiteReadOnlyNotice;
var builderStore_1 = __importDefault(require("@/stores/builderStore"));
var pageStore_1 = __importDefault(require("@/stores/pageStore"));
var frappe_ui_1 = require("frappe-ui");
var vue_1 = require("vue");
var TOAST_ID = "site-read-only-mode";
var POLL_INTERVAL = 10 * 1000;
function useSiteReadOnlyNotice() {
    var builderStore = (0, builderStore_1.default)();
    var pageStore = (0, pageStore_1.default)();
    var poll = null;
    function showNotice() {
        frappe_ui_1.toast.warning("Site is in read-only mode", {
            id: TOAST_ID,
            duration: Infinity,
            description: "Editing is disabled while the site is being updated. Please try again in a few minutes.",
        });
    }
    function checkIfSiteIsWritable() {
        (0, frappe_ui_1.frappeRequest)({ url: "builder.api.is_site_read_only" })
            .then(function (readOnly) { return (builderStore.isSiteInReadOnlyMode = Boolean(readOnly)); })
            .catch(function () { });
    }
    function startPolling() {
        poll !== null && poll !== void 0 ? poll : (poll = window.setInterval(checkIfSiteIsWritable, POLL_INTERVAL));
    }
    function stopPolling() {
        if (poll)
            clearInterval(poll);
        poll = null;
    }
    function onSiteBackOnline() {
        stopPolling();
        frappe_ui_1.toast.dismiss(TOAST_ID);
        frappe_ui_1.toast.success("Site is back online", { description: "You can continue editing." });
        if (pageStore.selectedPage)
            (0, vue_1.nextTick)(function () { return pageStore.savePage(); });
    }
    // on mount so the immediate toast fires after the ToastProvider exists
    (0, vue_1.onMounted)(function () {
        (0, vue_1.watch)(function () { return builderStore.isSiteInReadOnlyMode; }, function (readOnly, wasReadOnly) {
            if (readOnly) {
                showNotice();
                startPolling();
            }
            else if (wasReadOnly) {
                onSiteBackOnline();
            }
        }, { immediate: true });
    });
}
//# sourceMappingURL=useSiteReadOnlyNotice.js.map