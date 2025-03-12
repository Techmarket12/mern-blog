
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import errorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
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

export const signin = async(req, res, next) => {

    const { email, password } = req.body;

    if(!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await User.findOne({email});
        if(!validUser) {
            next(errorHandler(401, "Invalid email or password"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if(validPassword) {
            next(errorHandler(401, "Invalid email or password"));
        }

        const token = jwt.sign( {id: validUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        
        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json(validUser)
    } catch (error) {
        next(error);
    }
}