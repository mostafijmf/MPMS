"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../validators/user");
const validators_1 = require("../validators");
const auth_1 = require("../middlewares/auth");
const userController_1 = require("../controllers/userController");
const multer_1 = require("../middlewares/multer");
const userRouter = express_1.default.Router();
userRouter.get('/', auth_1.isLoggedIn, auth_1.isAdmins, userController_1.getAllUsers);
userRouter.post('/', auth_1.isLoggedIn, auth_1.isOnlyAdmin, multer_1.mediaProcessByMulter.single("avatar"), user_1.validateUserData, validators_1.runValidation, userController_1.createUser);
userRouter.patch('/:id', auth_1.isLoggedIn, auth_1.isOnlyAdmin, multer_1.mediaProcessByMulter.single("avatar"), userController_1.updateUserById);
userRouter.delete('/:id', auth_1.isLoggedIn, auth_1.isOnlyAdmin, userController_1.deleteUserById);
userRouter.get('/get-profile', auth_1.isLoggedIn, userController_1.getUserProfileByToken);
userRouter.get('/:id', auth_1.isLoggedIn, userController_1.getUserById);
exports.default = userRouter;
