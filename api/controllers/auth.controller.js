
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/errorHandler.js";
export const signup = async(req, res, next) => {

   const {username, email, password} = req.body;

   if(!username || !email || !password || username=== "" || email === "" || password === "") {
       next(errorHandler(400, "All fields are required"));
   }

   const hashPassword = bcryptjs.hashSync(password, 10);
   
   const newUser = new User({username, email, password : hashPassword});
   
   try {
       await newUser.save();
    
       res.status(200).json({message: "Signup success"});
   } catch (error) {
    next(error);
        
   }

}