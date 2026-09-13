"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeClientScriptRestricted = executeClientScriptRestricted;
exports.executeClientScriptUnrestricted = executeClientScriptUnrestricted;
var builderSettings_1 = require("@/data/builderSettings");
function createEvents(defaultTarget) {
    return {
        dispatch: function (name, data, target) {
            if (target === void 0) { target = defaultTarget; }
            target.dispatchEvent(new CustomEvent(name, { detail: data }));
        },
        listen: function (name, callback, target) {
            if (target === void 0) { target = defaultTarget; }
            var handler = function (event) { return callback(event.detail, event); };
            target.addEventListener(name, handler);
            return function () { return target.removeEventListener(name, handler); };
        },
    };
}
function createScriptFunction(userScript) {
    return new Function("context", "with (context) {\n\t\t\treturn (async function(component_data, props) { ".concat(userScript, " })\n\t\t\t\t.call(thisRef, component_data, props);\n\t\t}"));
}
function executeClientScriptUnrestricted(thisElement, userScript, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.componentData, componentData = _c === void 0 ? {} : _c, _d = _b.props, props = _d === void 0 ? {} : _d;
    if (!thisElement || !userScript.trim())
        return function () { };
    try {
        var fn = createScriptFunction(userScript);
        var cleanup_1 = fn({
            component_data: componentData,
            document: document,
            events: createEvents(document),
            props: props,
            thisRef: thisElement,
        });
        if (typeof cleanup_1 !== "function")
            return function () { };
        return function () {
            try {
                cleanup_1.call(thisElement);
            }
            catch (error) {
                console.error("Error cleaning up user script (unrestricted):", error);
            }
        };
    }
    catch (error) {
        console.error("Error in user script (unrestricted):", error);
        return function () { };
    }
}
/**
 * Executes a user script with the canvas exposed as document and proxies DOM values
 * to restrict common escape hatches into the broader editor document.
 */
function executeClientScriptRestricted(thisElement, sandboxRoot, userScript, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.componentData, componentData = _c === void 0 ? {} : _c, _d = _b.props, props = _d === void 0 ? {} : _d;
    if (!thisElement || !sandboxRoot || !userScript.trim())
        return function () { };
    var cache = new WeakMap();
    var rawValues = new WeakMap();
    var eventListeners = [];
    var BLOCKED_GET = new Set([
        "ownerDocument",
        "document",
        "defaultView",
        "window",
        "globalThis",
        "parentElement",
        "parentNode",
        "innerHTML",
        "outerHTML",
    ]);
    var BLOCKED_SET = new Set(["innerHTML", "outerHTML"]);
    function wrap(value) {
        if (value === null || typeof value !== "object")
            return value;
        if (cache.has(value))
            return cache.get(value);
        var proxy = new Proxy(value, handler);
        cache.set(value, proxy);
        rawValues.set(proxy, value);
        return proxy;
    }
    function unwrap(value) {
        return value !== null && typeof value === "object" ? rawValues.get(value) || value : value;
    }
    var handler = {
        get: function (target, prop) {
            if (typeof prop === "string" && BLOCKED_GET.has(prop))
                return undefined;
            // Always pass `target` (not the proxy) as the receiver so that native DOM
            // getters (e.g. tagName, nodeType, children) run with the correct `this`.
            // Passing the Proxy as receiver causes "Illegal invocation" in those cases.
            var val = Reflect.get(target, prop, target);
            // Wrap DOM returns
            if (val instanceof Node)
                return wrap(val);
            if (val instanceof NamedNodeMap || val instanceof DOMTokenList || val instanceof CSSStyleDeclaration)
                return wrap(val);
            if (val instanceof NodeList || val instanceof HTMLCollection) {
                return Array.from(val, wrap);
            }
            // Wrap functions (methods)
            if (typeof val === "function") {
                if (prop === "addEventListener" || prop === "removeEventListener") {
                    return function (type, listener, options) {
                        var _a;
                        if (((_a = builderSettings_1.builderSettings.doc) === null || _a === void 0 ? void 0 : _a.restrict_click_handlers) && (type === "click" || type === "dblclick")) {
                            throw new Error("Blocked: cannot add/remove ".concat(type, " event listeners"));
                        }
                        var realListener = unwrap(listener);
                        var result = val.call(target, type, realListener, options);
                        if (prop === "addEventListener") {
                            eventListeners.push({ target: target, type: type, listener: realListener, options: options });
                        }
                        return result;
                    };
                }
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var realArgs = args.map(unwrap);
                    // Do not allow inserting nodes outside the sandbox
                    for (var _a = 0, realArgs_1 = realArgs; _a < realArgs_1.length; _a++) {
                        var a = realArgs_1[_a];
                        if (a instanceof Node && !sandboxRoot.contains(a)) {
                            throw new Error("Blocked: external node insertion");
                        }
                    }
                    var result = val.apply(target, realArgs);
                    return wrap(result);
                };
            }
            return val; // primitive allowed
        },
        set: function (target, prop, value) {
            if (typeof prop === "string" && BLOCKED_SET.has(prop)) {
                throw new Error("Blocked: cannot set ".concat(String(prop)));
            }
            // Allow normal DOM props like src, value, className, id, etc.
            try {
                return Reflect.set(target, prop, unwrap(value), target);
            }
            catch (_a) {
                return false;
            }
        },
    };
    var proxiedRoot = wrap(sandboxRoot);
    var proxiedThis = wrap(thisElement);
    var context = {
        document: proxiedRoot,
        events: createEvents(proxiedRoot),
        thisRef: proxiedThis,
        props: props,
        component_data: componentData,
        // Escape hatches blocked
        window: undefined,
        globalThis: undefined,
        eval: undefined,
        Function: undefined,
        setTimeout: undefined,
        setInterval: undefined,
    };
    try {
        var fn = createScriptFunction(userScript);
        var userCleanup_1 = fn(context);
        return function () {
            eventListeners.forEach(function (_a) {
                var target = _a.target, type = _a.type, listener = _a.listener, options = _a.options;
                target.removeEventListener(type, listener, options);
            });
            if (typeof userCleanup_1 === "function") {
                try {
                    userCleanup_1.call(proxiedThis);
                }
                catch (error) {
                    console.error("Error cleaning up user script (restricted):", error);
                }
            }
        };
    }
    catch (error) {
        console.error("Error in user script (restricted):", error);
        return function () {
            eventListeners.forEach(function (_a) {
                var target = _a.target, type = _a.type, listener = _a.listener, options = _a.options;
                target.removeEventListener(type, listener, options);
            });
        };
    }
}
//# sourceMappingURL=scriptSandbox.js.map