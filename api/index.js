import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import UserRouter from './routes/user.route.js';
import AuthRouter from './routes/auth.route.js';
import connectDB from './db/connectDB.js';

import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(cookieParser());



app.use('/api/user', UserRouter);
app.use('/api/auth', AuthRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  res.status(statusCode).json({
    success:false,
    statusCode,
    message
  })
} )




app.listen(3000, () => {
  connectDB()
  console.log('Server is running on port 3000 !!');
})

