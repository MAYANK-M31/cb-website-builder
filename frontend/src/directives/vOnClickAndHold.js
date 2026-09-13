"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vOnClickAndHold = {
    mounted: function (el, binding) {
        var timer;
        el.addEventListener("mousedown", function () {
            timer = setTimeout(function () {
                binding.value();
            }, 300);
            document.addEventListener("mouseup", function () {
                clearTimeout(timer);
            }, { once: true });
        });
    },
};
exports.default = vOnClickAndHold;
//# sourceMappingURL=vOnClickAndHold.js.map