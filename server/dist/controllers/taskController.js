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
exports.deleteTaskById = exports.getTaskByProjectSprintIds = exports.updateTaskStatusById = exports.updateTaskById = exports.addTaskByProjectSprintIds = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_media_handler_1 = require("../libs/cloudinary-media-handler");
const Task_1 = __importDefault(require("../models/Task"));
const responseController_1 = require("./responseController");
// <!-- Add Task By Project & Sprint IDs -->
const addTaskByProjectSprintIds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const projectId = req.params.projectId;
        const sprintId = req.params.sprintId;
        const attachments = req.file ?
            (yield (0, cloudinary_media_handler_1.uploadMediaToCloudinary)(req.file)).secure_url
            : "";
        const body = Object.assign(Object.assign({}, req.body), { projectId, sprintId });
        if (attachments)
            body.attachments = {
                filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
                url: attachments,
                size: (_b = req.file) === null || _b === void 0 ? void 0 : _b.size
            };
        const result = yield Task_1.default.create(body);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 201,
            message: `Task has been added successfully`,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addTaskByProjectSprintIds = addTaskByProjectSprintIds;
// <!-- Update Task By Id -->
const updateTaskById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const id = req.params.taskId;
        const task = yield Task_1.default.findById(id);
        if (!task)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: "Task does not exist" });
        const body = Object.assign({}, req.body);
        // <!-- Handle Attachments -->
        if (req.file) {
            const attachments = (yield (0, cloudinary_media_handler_1.uploadMediaToCloudinary)(req.file)).secure_url;
            body.attachments = [{
                    filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
                    url: attachments,
                    size: (_b = req.file) === null || _b === void 0 ? void 0 : _b.size
                }];
            if ((task === null || task === void 0 ? void 0 : task.attachments) && ((_c = task === null || task === void 0 ? void 0 : task.attachments) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                yield Promise.all((_d = task === null || task === void 0 ? void 0 : task.attachments) === null || _d === void 0 ? void 0 : _d.map((file) => (0, cloudinary_media_handler_1.removeMediaFromCloudinary)(file === null || file === void 0 ? void 0 : file.url)));
            }
        }
        ;
        const result = yield Task_1.default.findByIdAndUpdate(id, body, { new: true });
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Task has been updated successfully`,
            data: result
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid task id' });
        }
        ;
        next(error);
    }
});
exports.updateTaskById = updateTaskById;
// <!-- Update Task Status By Id -->
const updateTaskStatusById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.taskId;
        const status = req.body.status;
        const task = yield Task_1.default.findById(id);
        if (!task)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: "Task does not exist" });
        if (!status)
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: "Status is required" });
        const result = yield Task_1.default.findByIdAndUpdate(id, { status });
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Task status updated successfully`,
            data: result
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid task id' });
        }
        ;
        next(error);
    }
});
exports.updateTaskStatusById = updateTaskStatusById;
// <!-- Get Tasks By Project & Sprint IDs -->
const getTaskByProjectSprintIds = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.projectId;
        const sprintId = req.params.sprintId;
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = { projectId, sprintId };
        if (search)
            filter.title = { $regex: searchRegExp };
        const sprints = yield Task_1.default.find(filter)
            .populate("assigns", "_id name email avatar role department skills createdAt")
            // .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);
        const count = yield Task_1.default.countDocuments(filter);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Tasks were returned successfully`,
            data: {
                tasks: sprints,
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
exports.getTaskByProjectSprintIds = getTaskByProjectSprintIds;
// <!-- Delete Task By Id -->
const deleteTaskById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const id = req.params.id;
        const task = yield Task_1.default.findById(id);
        if (!task)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: "Task does not exist" });
        if ((task === null || task === void 0 ? void 0 : task.attachments) && ((_a = task === null || task === void 0 ? void 0 : task.attachments) === null || _a === void 0 ? void 0 : _a.length) > 0)
            (_b = task === null || task === void 0 ? void 0 : task.attachments) === null || _b === void 0 ? void 0 : _b.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, cloudinary_media_handler_1.removeMediaFromCloudinary)(file === null || file === void 0 ? void 0 : file.url); }));
        yield Task_1.default.findByIdAndDelete(id);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Task has been deleted successfully`,
            data: null
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid task id' });
        }
        ;
        next(error);
    }
});
exports.deleteTaskById = deleteTaskById;
