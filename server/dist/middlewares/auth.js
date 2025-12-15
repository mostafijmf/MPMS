"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmins = exports.isOnlyAdmin = exports.isLoggedIn = void 0;
const responseController_1 = require("../controllers/responseController");
const handleJWT_1 = require("../libs/handleJWT");
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.accessToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split("=")[1]);
        if (!token || token === "undefined")
            return (0, responseController_1.errorResponse)(res, {
                statusCode: 401,
                message: 'Unauthorized access. Please login again',
            });
        const decoded = yield (0, handleJWT_1.verifyJWT)(token, 'access');
        if (!decoded)
            return (0, responseController_1.errorResponse)(res, {
                statusCode: 401,
                message: 'Invalid access token. Please login again',
            });
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(error);
    }
});
exports.isLoggedIn = isLoggedIn;
const isOnlyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield req.user;
        if (user.role !== "admin")
            return (0, responseController_1.errorResponse)(res, {
                statusCode: 403,
                message: "You do not have permission to access this route.",
            });
        next();
    }
    catch (error) {
        return next(error);
    }
});
exports.isOnlyAdmin = isOnlyAdmin;
const isAdmins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield req.user;
        if (!(user.role === "admin" || user.role === "manager"))
            return (0, responseController_1.errorResponse)(res, {
                statusCode: 403,
                message: "You do not have permission to access this route.",
            });
        next();
    }
    catch (error) {
        return next(error);
    }
});
exports.isAdmins = isAdmins;
