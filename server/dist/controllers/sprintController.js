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
exports.deleteSprintById = exports.updateSprintById = exports.getSprintById = exports.getSprintsByProjectId = exports.addSprintByProjectId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Sprint_1 = __importDefault(require("../models/Sprint"));
const responseController_1 = require("./responseController");
const Task_1 = __importDefault(require("../models/Task"));
// <!-- Add Sprint By Project ID -->
const addSprintByProjectId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const projectId = req.params.projectId;
        const body = req.body;
        const result = yield Sprint_1.default.create(Object.assign(Object.assign({}, body), { projectId: projectId, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
        return (0, responseController_1.successResponse)(res, {
            statusCode: 201,
            message: `Sprint has been added successfully`,
            data: result
        });
    }
    catch (error) {
        next(error);
    }
});
exports.addSprintByProjectId = addSprintByProjectId;
// <!-- Get Sprints By Project ID -->
const getSprintsByProjectId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.projectId;
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchRegExp = new RegExp('.*' + search + '.*', 'i');
        const filter = { projectId: projectId, };
        if (search)
            filter.title = { $regex: searchRegExp };
        const sprints = yield Sprint_1.default.find(filter)
            .sort({ sprintNumber: 1 })
            .limit(limit)
            .skip((page - 1) * limit);
        const count = yield Sprint_1.default.countDocuments(filter);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Sprints were returned successfully`,
            data: {
                sprints: sprints,
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
exports.getSprintsByProjectId = getSprintsByProjectId;
// <!-- Get Sprint By ID -->
const getSprintById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sprintId = req.params.sprintId;
        const sprint = yield Sprint_1.default.findById(sprintId);
        if (!sprint)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: "Sprint does not exist" });
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Sprint was returned successfully`,
            data: sprint
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid sprint id' });
        }
        ;
        next(error);
    }
});
exports.getSprintById = getSprintById;
// <!-- Update Sprint By ID -->
const updateSprintById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sprintId = req.params.sprintId;
        const sprint = yield Sprint_1.default.findById(sprintId);
        if (!sprint)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: "Sprint does not exist" });
        const result = yield Sprint_1.default.findByIdAndUpdate(sprintId, req.body);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Sprint has been updated successfully`,
            data: result
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid sprint id' });
        }
        ;
        next(error);
    }
});
exports.updateSprintById = updateSprintById;
// <!-- Delete Sprint By ID -->
const deleteSprintById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sprintId = req.params.sprintId;
        const sprint = yield Sprint_1.default.findById(sprintId);
        if (!sprint)
            return (0, responseController_1.errorResponse)(res, { statusCode: 404, message: "Sprint does not exist" });
        yield Task_1.default.deleteMany({ sprintId });
        yield Sprint_1.default.findByIdAndDelete(sprintId);
        return (0, responseController_1.successResponse)(res, {
            statusCode: 200,
            message: `Sprint was deleted successfully`,
        });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error) {
            return (0, responseController_1.errorResponse)(res, { statusCode: 400, message: 'Invalid sprint id' });
        }
        ;
        next(error);
    }
});
exports.deleteSprintById = deleteSprintById;
