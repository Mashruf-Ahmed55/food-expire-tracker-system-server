import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import Food from '../models/food.model.js';
import { parseDateToISOString } from '../utils/index.js';

const createFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const {
      food_image,
      food_title,
      category,
      quantity,
      expiryDate,
      description,
    } = req.body;

    // Check if all required fields are present
    if (
      !food_image ||
      !food_title ||
      !category ||
      !quantity ||
      !expiryDate ||
      !description
    ) {
      throw new Error('Missing required fields');
    }

    const expireDataParse = parseDateToISOString(expiryDate);
    // Create a new food item
    const newFood = await Food.create({
      food_image,
      food_title,
      category,
      quantity,
      expiryDate: expireDataParse,
      description,
      addedDate: new Date().toISOString(),
      userEmail: user?.email,
      userId: user?.id,
    });

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: newFood,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFoods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const skip = (page - 1) * limit;
    const today = new Date();

    const filter: any = {};

    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filter by exact expiry date
    if (req.query.expiryFoodDate) {
      filter.expiryDate = new Date(req.query.expiryFoodDate as string);
    } else if (req.query.expired === 'true') {
      filter.expiryDate = { $lt: today };
    } else if (req.query.nearlyExpired === 'true') {
      const fiveDaysLater = new Date();
      fiveDaysLater.setDate(today.getDate() + 5);
      filter.expiryDate = { $gte: today, $lte: fiveDaysLater };
    }
    if (req.query.search) {
      const search = (req.query.search as string).replace(
        /[-[\]{}()*+?.,\\^$|#\s]/g,
        '\\$&'
      );

      filter.food_title = { $regex: search, $options: 'i' };
    }

    const foods = await Food.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ expiryDate: -1 })
      .lean();

    const totalItems = await Food.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Foods fetched successfully',
      resultsCount: foods.length,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: page * limit < totalItems,
        hasPreviousPage: page > 1,
      },
      data: foods,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId);
    res.status(200).json({
      success: true,
      message: 'Food fetched successfully',
      data: food,
    });
  } catch (error) {
    next(error);
  }
};

const updateFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { foodId } = req.params;

    const exitFood = await Food.findById(foodId);
    if (!exitFood) {
      throw createHttpError(400, 'Food not found');
    }

    const updatedFood = await Food.findByIdAndUpdate(foodId, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: 'Food updated successfully',
      data: updatedFood,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { foodId } = req.params;
    const deletedFood = await Food.findByIdAndDelete(foodId);
    res.status(200).json({
      success: true,
      message: 'Food deleted successfully',
      data: deletedFood,
    });
  } catch (error) {
    next(error);
  }
};

const addNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { foodId } = req.params;
    const { text } = req.body;
    const food = await Food.findById(foodId);

    if (food?.userId.toString() !== user?.id) {
      return next(createHttpError(403, 'Cannot add note to this food'));
    }
    const note = await Food.findByIdAndUpdate(
      foodId,
      { $push: { notes: { text, postedDate: new Date().toISOString() } } },
      { new: true }
    );
    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

const myFoodItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const foods = await Food.find({ userId: user?.id });
    res.status(200).json({
      success: true,
      message: 'My food items fetched successfully',
      data: foods,
    });
  } catch (error) {
    next(error);
  }
};

export {
  addNote,
  createFood,
  deleteFood,
  getAllFoods,
  getSingleFood,
  myFoodItems,
  updateFood,
};
