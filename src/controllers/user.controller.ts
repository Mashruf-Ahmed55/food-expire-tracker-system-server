import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, photo_url, auth_type } = req.body;

    // 1. Validate required fields
    if (!name || !email || !photo_url || !auth_type) {
      throw createHttpError(400, 'Missing required fields');
    }
    const existingUser = await User.findOne({ email }).lean();

    // 2. Check if user exists - improved query
    if (existingUser) {
      const token = jwt.sign(
        { id: existingUser._id, email: existingUser.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      return res.status(201).json({
        success: true,
        message: 'User already exists',
        data: {
          token,
          user: {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            photo_url: existingUser.photo_url,
            auth_type: existingUser.auth_type,
          },
        },
      });
    }

    // 3. Create new user
    const newUser = await User.create({
      name,
      email,
      photo_url,
      auth_type,
    });

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    // 5. Send response
    res.status(201).json({
      success: true,
      message: 'User signed up successfully',
      data: {
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          photo_url: newUser.photo_url,
          auth_type: newUser.auth_type,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const signInUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // 1. Validate required fields
    if (!email) {
      throw createHttpError(400, 'Missing required fields');
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signOutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      expires: new Date(0),
      path: '/',
    });
    return res.status(200).json({
      success: true,
      message: 'User signed out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { signInUser, signOutUser, signUpUser };
