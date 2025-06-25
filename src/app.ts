import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import foodRouter from './routes/food.route.js';
import userRouter from './routes/user.route.js';

const app: Application = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://food-expire-tracker-system55.netlify.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/foods', foodRouter);

// Error Handler Middleware
app.use(globalErrorHandler);

export default app;
