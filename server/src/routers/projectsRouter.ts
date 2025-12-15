import express from 'express';
import { runValidation } from '../validators';
import { isAdmins, isLoggedIn } from '../middlewares/auth';
import { validateProjectData } from '../validators/project';
import { createProjects, getAllProjects, deleteProjectById, updateProjectById } from '../controllers/projectsController';

const projectsRouter = express.Router();

projectsRouter.post('/', isLoggedIn, isAdmins, validateProjectData, runValidation, createProjects);
projectsRouter.get('/', isLoggedIn, isAdmins, getAllProjects);
projectsRouter.patch('/:id', isLoggedIn, isAdmins, updateProjectById);
projectsRouter.delete('/:id', isLoggedIn, isAdmins, deleteProjectById);

export default projectsRouter;
