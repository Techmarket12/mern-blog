
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
export const signup = async(req, res) => {

   const {username, email, password} = req.body;

   if(!username || !email || !password || username=== "" || email === "" || password === "") {
       return res.status(400).json({error: "All fields are required"});
   }

   const hashPassword = bcryptjs.hashSync(password, 10);
   
   const newUser = new User({username, email, password : hashPassword});
   
   try {
       await newUser.save();
    
       res.status(200).json({message: "Signup success"});
   } catch (error) {
        console.log(error);
        
   }

}