import express from 'express';
import { validateLoginData } from '../validators/auth';
import { runValidation } from '../validators';
import { handleLogin, handleLogout, validateAuthToken } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/login', validateLoginData, runValidation, handleLogin);
authRouter.post('/logout', handleLogout);
authRouter.patch("/validate-auth-token", validateAuthToken);

export default authRouter;
