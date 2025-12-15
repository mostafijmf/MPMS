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
exports.verifyJWT = exports.createJWT = void 0;
const jose_1 = require("jose");
const secret_1 = require("./secret");
const createJWT = (_a) => __awaiter(void 0, [_a], void 0, function* ({ payload, type, expiresIn }) {
    if (typeof payload !== 'object' || !payload)
        throw new Error('Payload must be a non-empty object');
    if (type === "access" && (typeof secret_1.jwtAccessKey !== 'string' || secret_1.jwtAccessKey === ''))
        throw new Error('Secret key must be a non-empty string');
    if (type === "refresh" && (typeof secret_1.jwtRefreshKey !== 'string' || secret_1.jwtRefreshKey === ''))
        throw new Error('Secret key must be a non-empty string');
    const secretKey = type === "access" ? secret_1.jwtAccessKey : secret_1.jwtRefreshKey;
    try {
        const token = yield new jose_1.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(expiresIn)
            .sign(new TextEncoder().encode(secretKey));
        return token;
    }
    catch (error) {
        console.error('Failed to sign the JWT: ', error);
        throw error;
    }
});
exports.createJWT = createJWT;
const verifyJWT = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        return null;
    const secretKey = type === "access" ? secret_1.jwtAccessKey : secret_1.jwtRefreshKey;
    try {
        const { payload } = yield (0, jose_1.jwtVerify)(token, new TextEncoder().encode(secretKey), {
            algorithms: ['HS256'],
        });
        return payload;
    }
    catch (error) {
        const err = error;
        console.error('Failed to verify the JWT: ', err.message);
        if (err.name === 'JWTExpired' || err.code === 'ERR_JWT_EXPIRED')
            throw new Error("Token has been expired");
        if (err.name === 'JWTInvalid' || err.code === 'ERR_JWT_INVALID')
            throw new Error("Invalid token");
        return null;
    }
});
exports.verifyJWT = verifyJWT;
