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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthToken = exports.handleLogout = exports.handleLogin = void 0;
const bcryptjs_1 = require("bcryptjs");
const User_1 = __importDefault(require("../models/User"));
const responseController_1 = require("./responseController");
const handleJWT_1 = require("../libs/handleJWT");
const ONE_HOUR = 1000 * 60 * 60;
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
const handleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, isRemember: keep_login } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return (0, responseController_1.errorResponse)(res, {
                statusCode: 404,
                message: 'Incorrect email address.',
                inputError: {
                    email: `Incorrect email address.`
                }
            });
        const passMatch = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!passMatch)
            return (0, responseController_1.errorResponse)(res, {
                statusCode: 401,
                message: 'Incorrect password',
                inputError: {
                    password: `Incorrect password`
                }
            });
        const expiredIn = keep_login ? ONE_WEEK : ONE_HOUR;
        const accessToken = yield (0, handleJWT_1.createJWT)({
            type: "access",
            expiresIn: `1h`,
            payload: {
                _id: user._id.toString(),
                role: user.role,
                name: user.name,
                email: user.email,
            }
        });
        const refreshToken = yield (0, handleJWT_1.createJWT)({
            type: "refresh",
            expiresIn: `${expiredIn / 1000}sec`,
            payload: {
                _id: user._id.toString(),
                role: user.role,
                name: user.name,
                email: user.email,
            }
        });
        res.cookie('accessToken', accessToken, {
            maxAge: ONE_HOUR,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: expiredIn,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `User logged-in successfully`,
            data: {},
        });
    }
    catch (error) {
        next(error);
    }
});
exports.handleLogin = handleLogin;
const handleLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `User logged-out successfully`,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.handleLogout = handleLogout;
const validateAuthToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // console.log("cookies: ",req.cookies);
        // console.log(req.headers.authorization);
        const token = req.cookies.refreshToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ,")[1].split("=")[1]);
        // const accessToken = token![0].split("=")[1];
        // const refreshToken = token![1].split("=")[1];
        const decoded = yield (0, handleJWT_1.verifyJWT)(token, "refresh");
        if (!decoded)
            return (0, responseController_1.errorResponse)(res, {
                statusCode: 401,
                message: 'Session timeout. Please login again',
            });
        const newAccessToken = yield (0, handleJWT_1.createJWT)({
            type: "access",
            expiresIn: `1h`,
            payload: {
                _id: decoded === null || decoded === void 0 ? void 0 : decoded._id,
                role: decoded === null || decoded === void 0 ? void 0 : decoded.role,
                name: decoded === null || decoded === void 0 ? void 0 : decoded.name,
            }
        });
        res.cookie('accessToken', newAccessToken, {
            maxAge: ONE_HOUR,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: "New access token is generated",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.validateAuthToken = validateAuthToken;
