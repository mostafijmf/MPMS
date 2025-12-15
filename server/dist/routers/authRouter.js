"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../validators/auth");
const validators_1 = require("../validators");
const authController_1 = require("../controllers/authController");
const authRouter = express_1.default.Router();
authRouter.post('/login', auth_1.validateLoginData, validators_1.runValidation, authController_1.handleLogin);
authRouter.post('/logout', authController_1.handleLogout);
authRouter.patch("/validate-auth-token", authController_1.validateAuthToken);
exports.default = authRouter;
