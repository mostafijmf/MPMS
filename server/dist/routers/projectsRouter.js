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
const projectsRouter = express_1.default.Router();
projectsRouter.post('/', auth_1.isLoggedIn, auth_1.isAdmins, project_1.validateProjectData, validators_1.runValidation, projectsController_1.createProjects);
projectsRouter.get('/', auth_1.isLoggedIn, auth_1.isAdmins, projectsController_1.getAllProjects);
projectsRouter.patch('/:id', auth_1.isLoggedIn, auth_1.isAdmins, projectsController_1.updateProjectById);
projectsRouter.delete('/:id', auth_1.isLoggedIn, auth_1.isAdmins, projectsController_1.deleteProjectById);
exports.default = projectsRouter;
