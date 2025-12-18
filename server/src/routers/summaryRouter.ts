import express from 'express';
import { runValidation } from '../validators';
import { isAdmins, isLoggedIn } from '../middlewares/auth';
import { getSummary } from '../controllers/summaryController';

const summaryRouter = express.Router();

summaryRouter.get('/', isLoggedIn, getSummary);

export default summaryRouter;
