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
exports.getUserProfileByToken = exports.getUserById = exports.deleteUserById = exports.updateUserById = exports.getAllUsers = exports.createUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const responseController_1 = require("./responseController");
const cloudinary_media_handler_1 = require("../libs/cloudinary-media-handler");
// <!-- Create User -->
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const isEmailExist = yield User_1.default.findOne({ email: body.email });
        if (isEmailExist)
            return (0, responseController_1.errorResponse)(res, {
                statusCode: 409,
                message: 'This email already taken!',
                inputError: {
                    email: `This email already taken!`
                }
            });
        const avatar = req.file ?
            (yield (0, cloudinary_media_handler_1.uploadMediaToCloudinary)(req.file)).secure_url
            : "";
        yield User_1.default.create(Object.assign(Object.assign({}, body), { avatar }));
        return (0, responseController_1.successResponse)(res, {
            statusCode: 201,
            message: `User has been created successfully`,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
// <!-- Get all Users -->
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const role = ((_a = req.query.role) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase()) || '';
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = {
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
            ]
        };
        if (role)
            filter.role = role;
        const users = yield User_1.default.find(filter, { password: 0 })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);
        const count = yield User_1.default.find(filter).countDocuments();
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: 'Users were returned',
            data: {
                users,
                pagination: {
                    totalPage: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
// <!-- Update User By ID -->
const updateUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // if (req?.user?._id !== id)
        //   return errorResponse(res, { statusCode: 403, message: "Unauthorized user can't proceed" });
        const user = yield User_1.default.findById(id, { password: 0 });
        if (!user)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: 'User does not exist' });
        const body = Object.assign({}, req.body);
        // <!-- Handle Avatar -->
        if (req.file) {
            body.avatar = (yield (0, cloudinary_media_handler_1.uploadMediaToCloudinary)(req.file)).secure_url;
            if (user === null || user === void 0 ? void 0 : user.avatar)
                yield (0, cloudinary_media_handler_1.removeMediaFromCloudinary)(user.avatar);
        }
        ;
        const updatedUser = yield User_1.default.findByIdAndUpdate(id, body);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: 'User was updated successfully',
            data: updatedUser,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid user id' });
        }
        ;
        next(error);
    }
});
exports.updateUserById = updateUserById;
// <!-- Delete User By ID -->
const deleteUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield User_1.default.findById(id);
        if (!user)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: 'User does not exist' });
        if (user === null || user === void 0 ? void 0 : user.avatar)
            yield (0, cloudinary_media_handler_1.removeMediaFromCloudinary)(user.avatar);
        yield User_1.default.findByIdAndDelete(id);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: 'User was deleted successfully',
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid user id' });
        }
        ;
        next(error);
    }
});
exports.deleteUserById = deleteUserById;
// <!-- Get User By ID -->
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield User_1.default.findById(id, { password: 0 });
        if (!user)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: 'User does not exist' });
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: 'User was returned successfully',
            data: user,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid user id' });
        }
        ;
        next(error);
    }
});
exports.getUserById = getUserById;
// <!-- Get User By Access Token -->
const getUserProfileByToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = (_a = (yield (req === null || req === void 0 ? void 0 : req.user))) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield User_1.default.findById(id, { password: 0 });
        if (!user)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: 'User does not exist' });
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: 'User was returned successfully',
            data: user,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid user id' });
        }
        ;
        next(error);
    }
});
exports.getUserProfileByToken = getUserProfileByToken;
