import express from 'express';
import { runValidation } from '../validators';
import { isAdmins, isLoggedIn } from '../middlewares/auth';
import { validateProjectData, validateSprintData, validateTaskData } from '../validators/project';
import { createProjects, getAllProjects, deleteProjectById, updateProjectById, getProjectById } from '../controllers/projectsController';
import { mediaProcessByMulter } from '../middlewares/multer';
import { addSprintByProjectId, getSprintsByProjectId, getSprintById, deleteSprintById, updateSprintById } from '../controllers/sprintController';
import { addTaskByProjectSprintIds, deleteTaskById, getTaskByProjectSprintIds, updateTaskById, updateTaskStatusById } from '../controllers/taskController';

const projectsRouter = express.Router();

// <!-- Projects --> 
projectsRouter.post('/',
  isLoggedIn,
  isAdmins,
  mediaProcessByMulter.single("thumbnail"),
  validateProjectData,
  runValidation,
  createProjects
);
projectsRouter.get('/', isLoggedIn, getAllProjects);
projectsRouter.get('/:id', isLoggedIn, getProjectById);
projectsRouter.patch('/:id', isLoggedIn, isAdmins, mediaProcessByMulter.single("thumbnail"), updateProjectById);
projectsRouter.delete('/:id', isLoggedIn, isAdmins, deleteProjectById);

// <!-- Sprint -->
projectsRouter.post('/:projectId/sprint',
  isLoggedIn,
  isAdmins,
  validateSprintData,
  runValidation,
  addSprintByProjectId
);
projectsRouter.get('/:projectId/sprint', isLoggedIn, getSprintsByProjectId);
projectsRouter.get('/sprint/:sprintId', isLoggedIn, getSprintById);
projectsRouter.patch('/sprint/:sprintId', isLoggedIn, isAdmins, updateSprintById);
projectsRouter.delete('/sprint/:sprintId', isLoggedIn, isAdmins, deleteSprintById);

// <!-- Task -->
projectsRouter.post('/:projectId/sprint/:sprintId/task',
  isLoggedIn,
  isAdmins,
  mediaProcessByMulter.single("attachments"),
  validateTaskData,
  runValidation,
  addTaskByProjectSprintIds
);
projectsRouter.patch('/sprint/task/:taskId',
  isLoggedIn,
  mediaProcessByMulter.single("attachments"),
  updateTaskById
);
projectsRouter.patch('/sprint/task/status/:taskId', isLoggedIn, updateTaskStatusById);
projectsRouter.get('/:projectId/sprint/:sprintId/task', isLoggedIn, getTaskByProjectSprintIds);
projectsRouter.delete('/sprint/task/:id', isLoggedIn, isAdmins, deleteTaskById);

export default projectsRouter;
