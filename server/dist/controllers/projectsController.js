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
exports.deleteProjectById = exports.updateProjectById = exports.getProjectById = exports.getAllProjects = exports.createProjects = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Project_1 = __importDefault(require("../models/Project"));
const responseController_1 = require("./responseController");
const cloudinary_media_handler_1 = require("../libs/cloudinary-media-handler");
const Task_1 = __importDefault(require("../models/Task"));
// <!-- Create Projects -->
const createProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const body = req.body;
        const thumbnail = req.file ?
            (yield (0, cloudinary_media_handler_1.uploadMediaToCloudinary)(req.file)).secure_url
            : "";
        const result = yield Project_1.default.create(Object.assign(Object.assign({}, body), { thumbnail, userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id }));
        return (0, responseController_1.successResponse)(res, {
            statusCode: 201,
            message: `Project has been created successfully`,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createProjects = createProjects;
// <!-- Get All Projects -->
const getAllProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const status = req.query.status || '';
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = {
            $or: [
                { title: { $regex: searchRegExp } },
                { client: { $regex: searchRegExp } },
            ]
        };
        if (status)
            filter.status = status;
        if ((user === null || user === void 0 ? void 0 : user.role) === "member") {
            const projectIds = yield Task_1.default.distinct("projectId", {
                assigns: user._id
            });
            filter._id = { $in: projectIds };
        }
        const projects = yield Project_1.default.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);
        const count = yield Project_1.default.countDocuments(filter);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Projects were returned successfully`,
            data: {
                projects: projects,
                pagination: {
                    totalPage: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
                },
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllProjects = getAllProjects;
// <!-- Get Project By ID -->
const getProjectById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const project = yield Project_1.default.findById(id);
        if (!project)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: "Project does not exist" });
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Project was returned successfully`,
            data: project
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getProjectById = getProjectById;
// <!-- Update Project By Id -->
const updateProjectById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const project = yield Project_1.default.findById(id);
        if (!project)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: "Project does not exist" });
        const body = Object.assign({}, req.body);
        // <!-- Handle Thumbnail -->
        if (req.file) {
            body.thumbnail = (yield (0, cloudinary_media_handler_1.uploadMediaToCloudinary)(req.file)).secure_url;
            if (project === null || project === void 0 ? void 0 : project.thumbnail)
                yield (0, cloudinary_media_handler_1.removeMediaFromCloudinary)(project.thumbnail);
        }
        ;
        const result = yield Project_1.default.findByIdAndUpdate(id, body);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Project was updated successfully`,
            data: result
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid project id' });
        }
        ;
        next(error);
    }
});
exports.updateProjectById = updateProjectById;
// <!-- Delete Project By Id -->
const deleteProjectById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield Project_1.default.findByIdAndDelete(id);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Project was deleted successfully`,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid project id' });
        }
        ;
        next(error);
    }
});
exports.deleteProjectById = deleteProjectById;
