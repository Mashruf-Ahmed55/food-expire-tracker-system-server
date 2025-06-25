import { JwtPayload } from 'jsonwebtoken';
import mongoose, { Document } from 'mongoose';

export {};

declare module 'express' {
  export interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}

declare global {
  interface HttpException extends Error {
    status?: number;
    message: string;
  }

  interface IUser extends Document {
    name: string;
    email: string;
    photo_url: string;
    auth_type?: string;
  }

  enum Category {
    'Dairy' = 'Dairy',
    'Meat' = 'Meat',
    'Vegetable' = 'Vegetable',
    'Snack' = 'Snack',
    'Beverage' = 'Beverage',
    'Fruit' = 'Fruit',
  }

  interface IFood extends Document {
    food_image: string;
    food_title: string;
    category: Category;
    quantity: string;
    expiryDate: Date;
    description: string;
    addedDate: Date;
    userEmail: string;
    userId: mongoose.Schema.Types.ObjectId;
    notes?: {
      text: string;
      postedDate: Date;
    }[];
  }

  interface DecodedToken extends JwtPayload {
    id: string;
    email: string;
  }
}
