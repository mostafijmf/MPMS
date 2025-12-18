"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validators_1 = require("../validators");
const auth_1 = require("../middlewares/auth");
const project_1 = require("../validators/project");
const projectsController_1 = require("../controllers/projectsController");
const multer_1 = require("../middlewares/multer");
const sprintController_1 = require("../controllers/sprintController");
const taskController_1 = require("../controllers/taskController");
const projectsRouter = express_1.default.Router();
// <!-- Projects --> 
projectsRouter.post('/', auth_1.isLoggedIn, auth_1.isAdmins, multer_1.mediaProcessByMulter.single("thumbnail"), project_1.validateProjectData, validators_1.runValidation, projectsController_1.createProjects);
projectsRouter.get('/', auth_1.isLoggedIn, projectsController_1.getAllProjects);
projectsRouter.get('/:id', auth_1.isLoggedIn, projectsController_1.getProjectById);
projectsRouter.patch('/:id', auth_1.isLoggedIn, auth_1.isAdmins, multer_1.mediaProcessByMulter.single("thumbnail"), projectsController_1.updateProjectById);
projectsRouter.delete('/:id', auth_1.isLoggedIn, auth_1.isAdmins, projectsController_1.deleteProjectById);
// <!-- Sprint -->
projectsRouter.post('/:projectId/sprint', auth_1.isLoggedIn, auth_1.isAdmins, project_1.validateSprintData, validators_1.runValidation, sprintController_1.addSprintByProjectId);
projectsRouter.get('/:projectId/sprint', auth_1.isLoggedIn, sprintController_1.getSprintsByProjectId);
projectsRouter.get('/sprint/:sprintId', auth_1.isLoggedIn, sprintController_1.getSprintById);
projectsRouter.patch('/sprint/:sprintId', auth_1.isLoggedIn, auth_1.isAdmins, sprintController_1.updateSprintById);
projectsRouter.delete('/sprint/:sprintId', auth_1.isLoggedIn, auth_1.isAdmins, sprintController_1.deleteSprintById);
// <!-- Task -->
projectsRouter.post('/:projectId/sprint/:sprintId/task', auth_1.isLoggedIn, auth_1.isAdmins, multer_1.mediaProcessByMulter.single("attachments"), project_1.validateTaskData, validators_1.runValidation, taskController_1.addTaskByProjectSprintIds);
projectsRouter.patch('/sprint/task/:taskId', auth_1.isLoggedIn, multer_1.mediaProcessByMulter.single("attachments"), taskController_1.updateTaskById);
projectsRouter.patch('/sprint/task/status/:taskId', auth_1.isLoggedIn, taskController_1.updateTaskStatusById);
projectsRouter.get('/:projectId/sprint/:sprintId/task', auth_1.isLoggedIn, taskController_1.getTaskByProjectSprintIds);
projectsRouter.delete('/sprint/task/:id', auth_1.isLoggedIn, auth_1.isAdmins, taskController_1.deleteTaskById);
exports.default = projectsRouter;
