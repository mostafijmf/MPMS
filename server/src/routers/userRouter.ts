import express from 'express';
import { validateUserData } from '../validators/user';
import { runValidation } from '../validators';
import { isAdmins, isLoggedIn, isOnlyAdmin } from '../middlewares/auth';
import { createUser, getAllUsers, getUserById, getUserProfileByToken, updateUserById, deleteUserById } from '../controllers/userController';
import { mediaProcessByMulter } from '../middlewares/multer';

const userRouter = express.Router();

userRouter.get('/', isLoggedIn, isAdmins, getAllUsers);
userRouter.post('/',
  isLoggedIn,
  isOnlyAdmin,
  mediaProcessByMulter.single("avatar"),
  validateUserData,
  runValidation,
  createUser
);
userRouter.patch('/:id', isLoggedIn, isOnlyAdmin, mediaProcessByMulter.single("avatar"), updateUserById);
userRouter.delete('/:id', isLoggedIn, isOnlyAdmin, deleteUserById);

userRouter.get('/get-profile', isLoggedIn, getUserProfileByToken);
userRouter.get('/:id', isLoggedIn, getUserById);

export default userRouter;
