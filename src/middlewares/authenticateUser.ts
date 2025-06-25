import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(createHttpError(401, 'Authentication token missing'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded.id || !decoded.email) {
      return next(createHttpError(401, 'Invalid token payload'));
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(createHttpError(401, 'Token expired'));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(createHttpError(401, 'Invalid token'));
    }

    // Generic error fallback
    next(createHttpError(500, 'Authentication failed'));
  }
};

export default authenticateUser;
