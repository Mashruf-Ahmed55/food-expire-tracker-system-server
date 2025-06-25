import { Router } from 'express';
import {
  signInUser,
  signOutUser,
  signUpUser,
} from '../controllers/user.controller.js';

const userRouter = Router();
// @ts-ignore
userRouter.route('/signup').post(signUpUser);
userRouter.route('/signin').post(signInUser);
// @ts-ignore
userRouter.route('/signout').get(signOutUser);

export default userRouter;
