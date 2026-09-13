"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var RealTimeHandler = /** @class */ (function () {
    function RealTimeHandler() {
        this.open_docs = new Set();
        this.socket = (0, vue_1.getCurrentInstance)().appContext.config.globalProperties.$socket;
        this.subscribing = false;
    }
    RealTimeHandler.prototype.on = function (event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    };
    RealTimeHandler.prototype.off = function (event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    };
    RealTimeHandler.prototype.emit = function (event) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.socket).emit.apply(_a, __spreadArray([event], args, false));
    };
    RealTimeHandler.prototype.doctype_subscribe = function (doctype) {
        var _this = this;
        if (this.subscribing) {
            return;
        }
        this.subscribing = true;
        this.emit("doctype_subscribe", doctype);
        setTimeout(function () {
            _this.subscribing = false;
        }, 1000);
    };
    RealTimeHandler.prototype.doctype_unsubscribe = function (doctype) {
        this.emit("doctype_unsubscribe", doctype);
    };
    RealTimeHandler.prototype.doc_subscribe = function (doctype, docname) {
        var _this = this;
        if (this.subscribing) {
            return;
        }
        if (this.open_docs.has("".concat(doctype, ":").concat(docname))) {
            return;
        }
        this.subscribing = true;
        // throttle to 1 per sec
        setTimeout(function () {
            _this.subscribing = false;
        }, 1000);
        this.emit("doc_subscribe", doctype, docname);
        this.open_docs.add("".concat(doctype, ":").concat(docname));
    };
    RealTimeHandler.prototype.doc_unsubscribe = function (doctype, docname) {
        this.emit("doc_unsubscribe", doctype, docname);
        return this.open_docs.delete("".concat(doctype, ":").concat(docname));
    };
    RealTimeHandler.prototype.doc_open = function (doctype, docname) {
        this.emit("doc_open", doctype, docname);
    };
    RealTimeHandler.prototype.doc_close = function (doctype, docname) {
        this.emit("doc_close", doctype, docname);
    };
    RealTimeHandler.prototype.publish = function (event, message) {
        if (this.socket) {
            this.emit(event, message);
        }
    };
    return RealTimeHandler;
}());
exports.default = RealTimeHandler;
//# sourceMappingURL=realtimeHandler.js.map