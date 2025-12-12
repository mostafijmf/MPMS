import express from 'express';
import { runValidation } from '../validators';
import { isAdmins, isLoggedIn } from '../middlewares/auth';
import { createProjects } from '../controllers/projectsController';
import { validateProjectData } from '../validators/project';

const projectsRouter = express.Router();

projectsRouter.post('/', isLoggedIn, isAdmins, validateProjectData, runValidation, createProjects);

export default projectsRouter;
