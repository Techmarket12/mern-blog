import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import UserRouter from './routes/user.route.js';
import AuthRouter from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import connectDB from './db/connectDB.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());



app.use('/api/user', UserRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

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

