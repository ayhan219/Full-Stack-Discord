const mongoose = require("mongoose");
const User = require("../model/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const signup = async(req,res)=>{
    const {email,displayName,username,password} = req.body;
    try {
        if(!email && !displayName && !username && !password){
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

}

module.exports ={
    signup,
    login
}