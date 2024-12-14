const mongoose = require("mongoose");
const User = require("../model/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const signup = async(req,res)=>{
    const {email,displayName,username,password} = req.body;
    try {
        if(!email || !displayName || !username || !password){
            return res.status(400).json({message:"provide all area"})
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"user exist!"})
        }

        const hashedPW = await bcrypt.hash(password,10);
        
        const newUser = new User({
            email,
            displayName,
            username,
            password:hashedPW
        })
        await newUser.save();

        return res.status(200).json({message:"signup successfull!"})
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

}


const login = async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"provide all area"})
    }
    try {
        
        const findUser = await User.findOne({email});
        if(!findUser){
            return res.status(400).json({message:"user not found"})
        }
        const isPasswordMatch = await bcrypt.compare(password,findUser.password);
        if(!isPasswordMatch){
            return res.status(400).json({message:"password doesn't match"})
        }

        const token = jwt.sign({
            email: findUser.email,
            displayName:findUser.displayName,
            username: findUser.username,
        },
        process.env.JWT_SECRET,{
            expiresIn:"1h"
        }
    );
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        maxAge:3600000
    })
    
    return res.status(200).json({
        message: "Login successful",
      });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }

}

const getCurrentUser = async(req,res)=>{
    const user = req.user;
    
    try {
      if(!user){
        return res.status(400).json({ message: "user not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "server error", error });
    }
  
  }

module.exports ={
    signup,
    login,
    getCurrentUser,
}