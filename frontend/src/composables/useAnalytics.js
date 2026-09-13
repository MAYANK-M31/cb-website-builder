"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnalytics = useAnalytics;
var websiteSettings_1 = require("@/data/websiteSettings");
var helpers_1 = require("@/utils/helpers");
var core_1 = require("@vueuse/core");
var frappe_ui_1 = require("frappe-ui");
var vue_1 = require("vue");
function useAnalytics(_a) {
    var apiUrl = _a.apiUrl, ctrApiUrl = _a.ctrApiUrl, _b = _a.initialRange, initialRange = _b === void 0 ? "last_30_days" : _b, _c = _a.initialInterval, initialInterval = _c === void 0 ? "" : _c, _d = _a.initialRoute, initialRoute = _d === void 0 ? "" : _d, _e = _a.initialRouteFilterType, initialRouteFilterType = _e === void 0 ? "wildcard" : _e, routePersistKey = _a.routePersistKey, _f = _a.extraParams, extraParams = _f === void 0 ? {} : _f, onSuccess = _a.onSuccess;
    // undefined while settings load, so callers can avoid flashing the "tracking disabled" notice prematurely
    var trackingEnabled = (0, vue_1.computed)(function () {
        return websiteSettings_1.websiteSettings.doc ? Boolean(websiteSettings_1.websiteSettings.doc.enable_view_tracking) : undefined;
    });
    // range/customDateRange are page-independent, so they share one key across page & global analytics.
    // route is intrinsic to the page in page analytics, so it only persists when a caller (global) opts in.
    var range = (0, core_1.useStorage)("builderAnalyticsRange", initialRange);
    var interval = (0, vue_1.ref)(initialInterval);
    var route = routePersistKey ? (0, core_1.useStorage)(routePersistKey, initialRoute) : (0, vue_1.ref)(initialRoute);
    var routeFilterType = (0, vue_1.ref)(initialRouteFilterType);
    var customDateRange = (0, core_1.useStorage)("builderAnalyticsCustomDateRange", "");
    var analyticsData = (0, vue_1.ref)({
        total_unique_views: 0,
        total_views: 0,
        data: [],
        top_pages: [],
        top_referrers: [],
    });
    var themeColors = {
        textColor: "var(--ink-gray-5)",
        axisLineColor: "var(--ink-gray-4)",
        gridLineColor: "var(--outline-gray-1)",
        backgroundColor: "transparent",
        tooltipBg: "var(--surface-base)",
        tooltipBorder: "var(--outline-gray-1)",
        tooltipText: "var(--ink-gray-7)",
    };
    var getAxisStyle = function () { return ({
        axisLine: { lineStyle: { color: themeColors.axisLineColor } },
        axisTick: { lineStyle: { color: themeColors.axisLineColor } },
        axisLabel: { color: themeColors.textColor },
        splitLine: { lineStyle: { color: themeColors.gridLineColor } },
    }); };
    var chartConfig = (0, vue_1.computed)(function () { return ({
        data: analyticsData.value.data,
        title: "",
        xAxis: {
            key: "interval",
            type: "category",
        },
        yAxis: {
            title: "Timeline",
        },
        y2Axis: {
            title: "Total Views",
        },
        series: [
            {
                name: "total_page_views",
                type: "area",
                axis: "y2",
            },
            {
                name: "unique_page_views",
                type: "area",
                axis: "y2",
            },
        ],
        echartOptions: {
            backgroundColor: themeColors.backgroundColor,
            textStyle: { color: themeColors.textColor },
            grid: { borderColor: themeColors.gridLineColor },
            xAxis: getAxisStyle(),
            yAxis: [getAxisStyle(), getAxisStyle()],
            tooltip: {
                backgroundColor: themeColors.tooltipBg,
                borderColor: themeColors.tooltipBorder,
                textStyle: { color: themeColors.tooltipText },
            },
            legend: { textStyle: { color: themeColors.textColor } },
        },
    }); });
    var chartConfigWithEvents = (0, vue_1.computed)(function () { return (__assign(__assign({}, chartConfig.value), { events: {
            click: function (params) {
                if (interval.value !== "hourly") {
                    drillDown({ interval: params.name });
                }
            },
        } })); });
    var processedAnalyticsData = (0, vue_1.computed)(function () {
        var _a, _b;
        return {
            top_referrers: (_a = analyticsData.value.top_referrers) === null || _a === void 0 ? void 0 : _a.map(function (referrer) { return (__assign(__assign({}, referrer), { count: (0, helpers_1.shortenNumber)(referrer.count) })); }),
            top_pages: (_b = analyticsData.value.top_pages) === null || _b === void 0 ? void 0 : _b.map(function (page) { return (__assign(__assign({}, page), { view_count: (0, helpers_1.shortenNumber)(page.view_count) })); }),
        };
    });
    var onPageRowClick = function (row) {
        window.open("/".concat(row.route), "_blank");
    };
    var formatDateToString = function (date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, "0");
        var day = String(date.getDate()).padStart(2, "0");
        return "".concat(year, "-").concat(month, "-").concat(day);
    };
    var getDateRangeFromPreset = function (preset) {
        var toDate = new Date();
        var fromDate = new Date();
        switch (preset) {
            case "today":
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);
                break;
            case "this_week":
                var dayOfWeek = toDate.getDay();
                fromDate.setDate(toDate.getDate() - dayOfWeek);
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);
                break;
            case "last_7_days":
                fromDate.setDate(toDate.getDate() - 7);
                break;
            case "last_30_days":
                fromDate.setDate(toDate.getDate() - 30);
                break;
            case "last_90_days":
                fromDate.setDate(toDate.getDate() - 90);
                break;
            case "last_180_days":
                fromDate.setDate(toDate.getDate() - 180);
                break;
            case "this_year":
                fromDate.setFullYear(toDate.getFullYear(), 0, 1);
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);
                break;
            default:
                // Default to last 30 days
                fromDate.setDate(toDate.getDate() - 30);
        }
        return {
            from_date: formatDateToString(fromDate),
            to_date: formatDateToString(toDate),
        };
    };
    var getDefaultInterval = function (preset, customRange) {
        if (customRange) {
            return getIntervalFromDateRange(customRange.from_date, customRange.to_date);
        }
        var intervalMap = {
            today: "hourly",
            this_week: "daily",
            last_7_days: "daily",
            last_30_days: "daily",
            last_90_days: "weekly",
            last_180_days: "weekly",
            this_year: "monthly",
        };
        return intervalMap[preset] || "daily";
    };
    var getIntervalFromDateRange = function (fromDate, toDate) {
        var from = new Date(fromDate);
        var to = new Date(toDate);
        var diffInMs = to.getTime() - from.getTime();
        var diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        if (diffInDays <= 1) {
            return "hourly";
        }
        else if (diffInDays <= 31) {
            return "daily";
        }
        else {
            return "monthly";
        }
    };
    var getDefaultDateRange = function () {
        return getDateRangeFromPreset("last_30_days");
    };
    var setCustomDateRange = function (fromDate, toDate) {
        customDateRange.value = "".concat(fromDate, ",").concat(toDate);
        range.value = "custom";
    };
    var drillDown = function (dataPoint) {
        var _a, _b;
        var currentInterval = interval.value ||
            getIntervalFromDateRange(range.value === "custom" && customDateRange.value
                ? ((_a = parseCustomDateRange(customDateRange.value)) === null || _a === void 0 ? void 0 : _a.from_date) || ""
                : getDateRangeFromPreset(range.value).from_date, range.value === "custom" && customDateRange.value
                ? ((_b = parseCustomDateRange(customDateRange.value)) === null || _b === void 0 ? void 0 : _b.to_date) || ""
                : getDateRangeFromPreset(range.value).to_date);
        var clickedDate = new Date(dataPoint.interval);
        var newFromDate;
        var newToDate;
        var newInterval;
        if (currentInterval === "monthly") {
            var firstDayOfMonth = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), 1);
            var lastDayOfMonth = new Date(clickedDate.getFullYear(), clickedDate.getMonth() + 1, 0);
            newFromDate = formatDateToString(firstDayOfMonth);
            newToDate = formatDateToString(lastDayOfMonth);
            newInterval = "daily";
        }
        else if (currentInterval === "daily") {
            var exactDate = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate());
            newFromDate = formatDateToString(exactDate);
            newToDate = formatDateToString(exactDate);
            newInterval = "hourly";
        }
        else {
            return;
        }
        setCustomDateRange(newFromDate, newToDate);
        interval.value = newInterval;
    };
    var parseCustomDateRange = function (dateRangeString) {
        if (!dateRangeString || !dateRangeString.includes(",")) {
            return null;
        }
        var _a = dateRangeString.split(","), from_date = _a[0], to_date = _a[1];
        return { from_date: from_date.trim(), to_date: to_date.trim() };
    };
    var getFormattedRoute = function () {
        if (!route.value)
            return "";
        return route.value;
    };
    var getParams = function () {
        var params = __assign({}, extraParams);
        var dateRange;
        if (range.value === "custom" && customDateRange.value) {
            var parsedRange = parseCustomDateRange(customDateRange.value);
            if (parsedRange) {
                dateRange = parsedRange;
            }
            else {
                dateRange = getDefaultDateRange();
            }
        }
        else {
            dateRange = getDateRangeFromPreset(range.value);
        }
        params.from_date = dateRange.from_date;
        params.to_date = dateRange.to_date;
        if (range.value === "custom" && customDateRange.value) {
            params.interval = getIntervalFromDateRange(dateRange.from_date, dateRange.to_date);
        }
        else {
            params.interval = getDefaultInterval(range.value, dateRange);
        }
        if (interval.value) {
            params.interval = interval.value;
        }
        var formattedRoute = getFormattedRoute();
        if (formattedRoute) {
            params.route = formattedRoute;
            params.route_filter_type = routeFilterType.value;
        }
        return params;
    };
    var analytics = (0, frappe_ui_1.createResource)({
        method: "POST",
        url: apiUrl,
        params: getParams(),
        auto: true,
        onSuccess: function (res) {
            analyticsData.value = res;
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(res);
        },
    });
    var ctrData = (0, vue_1.ref)({
        total_views: 0,
        total_clicks: 0,
        ctr: 0,
        elements: [],
    });
    var ctr = ctrApiUrl
        ? (0, frappe_ui_1.createResource)({
            method: "POST",
            url: ctrApiUrl,
            params: getParams(),
            auto: true,
            onSuccess: function (res) {
                ctrData.value = res;
            },
        })
        : null;
    var debouncedSubmit = (0, frappe_ui_1.debounce)(function () {
        analytics.submit(getParams());
        ctr === null || ctr === void 0 ? void 0 : ctr.submit(getParams());
    }, 100);
    (0, vue_1.watch)([range, interval, route, routeFilterType, customDateRange], function (newValues, oldValues) {
        if (newValues[0] !== (oldValues === null || oldValues === void 0 ? void 0 : oldValues[0]) && newValues[0] !== "custom") {
            interval.value = "";
        }
        debouncedSubmit();
    }, { deep: true });
    return {
        range: range,
        interval: interval,
        route: route,
        customDateRange: customDateRange,
        trackingEnabled: trackingEnabled,
        analyticsData: analyticsData,
        chartConfigWithEvents: chartConfigWithEvents,
        processedAnalyticsData: processedAnalyticsData,
        analytics: analytics,
        ctr: ctr,
        ctrData: ctrData,
        onPageRowClick: onPageRowClick,
    };
}
//# sourceMappingURL=useAnalytics.js.map