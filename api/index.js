import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import UserRouter from './routes/user.route.js';
import AuthRouter from './routes/auth.route.js';
const app = express();

app.use(express.json());
app.use('/api/user', UserRouter)
app.use('/api/auth', AuthRouter)

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      
    });
    console.log('MongoDB is connected !!');
  } catch (error) {
    console.log(error);
  }
}



app.listen(3000, () => {
  connectDB()
  console.log('Server is running on port 3000 !!');
})

