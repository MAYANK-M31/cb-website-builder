"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeImage = exports.getOptimizeButtonText = exports.shouldShowOptimizeButton = void 0;
var frappe_ui_1 = require("frappe-ui");
var frappe_ui_2 = require("frappe-ui");
var isExternalImage = function (imageUrl) {
    return imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
};
var isConvertibleToWebP = function (imageUrl) {
    return [".jpg", ".jpeg", ".png"].some(function (ext) { return imageUrl.toLowerCase().endsWith(ext); });
};
var shouldShowOptimizeButton = function (imageUrl) {
    if (!imageUrl) {
        return false;
    }
    return isExternalImage(imageUrl) || isConvertibleToWebP(imageUrl);
};
exports.shouldShowOptimizeButton = shouldShowOptimizeButton;
var getOptimizeButtonText = function (imageUrl) {
    if (!imageUrl) {
        return "";
    }
    if (isExternalImage(imageUrl)) {
        return "Serve Locally";
    }
    else if (isConvertibleToWebP(imageUrl)) {
        return "Convert to WebP";
    }
    return "";
};
exports.getOptimizeButtonText = getOptimizeButtonText;
var optimizeImage = function (_a) {
    var imageUrl = _a.imageUrl, onSuccess = _a.onSuccess;
    if (!imageUrl) {
        return;
    }
    var convertToWebP = (0, frappe_ui_1.createResource)({
        url: "/api/method/builder.api.convert_to_webp",
        params: {
            image_url: imageUrl,
        },
    });
    var isExternal = isExternalImage(imageUrl);
    return frappe_ui_2.toast.promise(convertToWebP.fetch().then(function (res) {
        onSuccess(res);
    }), {
        loading: isExternal ? "Pulling..." : "Converting...",
        success: function () { return (isExternal ? "Image pulled to local" : "Image converted to WebP"); },
        error: function () { return (isExternal ? "Failed to pull image to local" : "Failed to convert image to WebP"); },
    });
};
exports.optimizeImage = optimizeImage;
//# sourceMappingURL=imageUtils.js.map