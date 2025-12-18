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
exports.getSummary = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const Task_1 = __importDefault(require("../models/Task"));
const User_1 = __importDefault(require("../models/User"));
const responseController_1 = require("./responseController");
// <!-- Get All Summary -->
const getSummary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const role = req.user.role;
        if (role === "member") {
            const filter = { assigns: userId };
            const myTasks = yield Task_1.default.find(filter)
                .sort({ dueDate: 1 })
                .populate("projectId", "title")
                .populate("sprintId", "title");
            const completedTasks = yield Task_1.default.countDocuments(Object.assign(Object.assign({}, filter), { status: "done" }));
            const inProgressTasks = yield Task_1.default.countDocuments(Object.assign(Object.assign({}, filter), { status: "in_progress" }));
            const overdueTasks = yield Task_1.default.countDocuments(Object.assign(Object.assign({}, filter), { status: "done", dueDate: { $lt: new Date() } }));
            const projectIds = [
                ...new Set(myTasks.map((t) => { var _a, _b; return (_b = (_a = t.projectId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString(); })),
            ];
            const projects = yield Project_1.default.find({
                _id: { $in: projectIds },
            }).select("title status");
            return (0, responseController_1.successResponse)(res, {
                statusCode: 200,
                message: `Summary were returned successfully`,
                data: {
                    role: "member",
                    stats: {
                        myTasks: myTasks.length,
                        inProgressTasks,
                        completedTasks,
                        overdueTasks,
                    },
                    myTasks,
                    projects,
                }
            });
        }
        else {
            // <!-- Projects -->
            const totalProjects = yield Project_1.default.countDocuments();
            const activeProjects = yield Project_1.default.countDocuments({ status: "active" });
            // <!-- Tasks -->
            const totalTasks = yield Task_1.default.countDocuments();
            const completedTasks = yield Task_1.default.countDocuments({ status: "done" });
            // <!-- Project Progress -->
            const projects = yield Project_1.default.find({ status: "active" }).lean();
            const projectIds = projects.map((p) => p._id);
            const tasks = yield Task_1.default.find({ projectId: { $in: projectIds } });
            const projectProgress = projects.map((project) => {
                const projectTasks = tasks.filter((t) => t.projectId.toString() === project._id.toString());
                const done = projectTasks.filter((t) => t.status === "done").length;
                const total = projectTasks.length;
                return {
                    _id: project._id,
                    title: project.title,
                    progress: total ? Math.round((done / total) * 100) : 0,
                };
            });
            // Team workload
            const users = yield User_1.default.find({ role: "member" }).select("name");
            const workload = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                const userTasks = yield Task_1.default.find({ assigns: user._id });
                return {
                    user: user.name,
                    total: userTasks.length,
                    inProgress: userTasks.filter((t) => t.status === "in_progress").length,
                    overdue: userTasks.filter((t) => t.dueDate && t.dueDate < new Date() && t.status !== "done").length,
                };
            })));
            return (0, responseController_1.successResponse)(res, {
                statusCode: 200,
                message: `Summary were returned successfully`,
                data: {
                    role,
                    stats: {
                        totalProjects,
                        activeProjects,
                        totalTasks,
                        completedTasks,
                    },
                    activeProjects: projectProgress,
                    teamWorkload: workload,
                }
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getSummary = getSummary;
