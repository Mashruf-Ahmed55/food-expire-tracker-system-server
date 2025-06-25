import { Router } from 'express';
import {
  addNote,
  createFood,
  deleteFood,
  getAllFoods,
  getSingleFood,
  myFoodItems,
  updateFood,
} from '../controllers/food.controller.js';
import authenticateUser from '../middlewares/authenticateUser.js';

const foodRouter = Router();
// @ts-ignore
foodRouter.route('/create-food').post(authenticateUser, createFood);
// @ts-ignore
foodRouter.route('/add-note/:foodId').patch(authenticateUser, addNote);
// @ts-ignore
foodRouter.route('/delete-food/:foodId').delete(authenticateUser, deleteFood);
// @ts-ignore
foodRouter.route('/update-food/:foodId').put(authenticateUser, updateFood);
// @ts-ignore
foodRouter.route('/get-all-foods').get(getAllFoods);
// @ts-ignore
foodRouter.route('/get-single-food/:foodId').get(getSingleFood);

foodRouter.route('/my-food-items').get(authenticateUser, myFoodItems);

export default foodRouter;
