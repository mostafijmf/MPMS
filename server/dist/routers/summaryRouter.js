"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const summaryController_1 = require("../controllers/summaryController");
const summaryRouter = express_1.default.Router();
summaryRouter.get('/', auth_1.isLoggedIn, summaryController_1.getSummary);
exports.default = summaryRouter;
