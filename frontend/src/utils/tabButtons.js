"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRETCH_TABS = void 0;
// frappe-ui's TabButtons hugs its content; Builder's segmented controls split the
// width they are given. Reaching into the component's markup is the only way, so it
// lives here rather than in every caller.
exports.STRETCH_TABS = "[&>div]:w-full [&_[data-slot=tab-button]]:flex-1 [&_[data-slot=tab-button]>span]:w-full";
//# sourceMappingURL=tabButtons.js.map