import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

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