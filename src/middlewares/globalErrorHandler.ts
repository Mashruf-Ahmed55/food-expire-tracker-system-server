import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    const stack = err.stack || '';
    console.error(
      `[${req.method}] >> StatusCode:: ${status}, Message:: ${message}`
    );
    res.status(status).json({
      status: status,
      success: false,
      message,
      stack: process.env.NODE_ENV === 'development' && stack,
    });
  } catch (error) {
    next(error);
  }
};
