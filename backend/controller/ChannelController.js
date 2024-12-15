const mongoose = require("mongoose");
const User = require("../model/User")
const Channel = require("../model/Channel")



const createChannel = async(req,res)=>{
    const {userId,channelName} = req.body;

    if(!userId){
        return res.status(200).json({message:"user not authenticated"})
    }
    try {

        const findUser = await User.findById(userId);

        if(!findUser){
            return res.status(400).json({message:"user not found"})
        }
        
        const newChannel = new Channel({
            channelName:channelName
        })
        findUser.ownChannel.push(newChannel._id);
        findUser.joinedChannel.push(newChannel._id);
        await findUser.save();
        await newChannel.save();

        return res.status(201).json({
            message: "Channel created successfully",
            channel: newChannel,
          });

    } catch (error) {
        return res.status(500).json({message:"server error"})
    }
}

const getChannel = async(req,res)=>{
    const {userId} = req.query;

    if(!userId){
        return res.status(400).json({message:"no user id"})
    }
    try {
        const findUser = await User.findById(userId).populate({
            path: "joinedChannel",
            select: "_id channelName", 
          });
        if(!findUser){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json({
            message: "Channels retrieved successfully",
            channels: findUser.joinedChannel,
          });
        
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }
}

module.exports ={
createChannel,
getChannel
}