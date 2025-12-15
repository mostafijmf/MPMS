"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = exports.errorResponse = void 0;
const errorResponse = (res, _a) => {
    var { statusCode = 500, message = 'Internal Server Error' } = _a, others = __rest(_a, ["statusCode", "message"]);
    return res.status(statusCode).json(Object.assign({ success: false, message: message }, others));
};
exports.errorResponse = errorResponse;
const successResponse = (res, { statusCode = 200, message = 'Internal Server Error', data = {} }) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data
    });
};
exports.successResponse = successResponse;
