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

        newChannel.channelUsers.push(findUser.username);
        findUser.ownChannel.push(newChannel._id);
        findUser.joinedChannel.push(newChannel._id);

        await findUser.save();
        await newChannel.save();

        return res.status(201).json({
            message: "Channel created successfully",
            channel: newChannel,
          });

    } catch (error) {
        console.log();
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

const getChannelSingle = async(req,res)=>{
    const {channelId} = req.query;

    if(!channelId){
        return res.status(400).json({message:"no channel id"})
    }
    try {
        const findChannel = await Channel.findById(channelId);
        if(!findChannel){
            return res.status(400).json({message:"channel not found"})
        }

        return res.status(200).json(findChannel)
        
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }
}

const createChatRoom = async(req,res)=>{
const {channelId,userId,chatRoomName} = req.body;

  if(!channelId | !userId){
    return res.status(400).json({message:"provide all area"})
  }

  try {
    const findChannel = await Channel.findById(channelId);
    const findUser = await User.findById(userId);

    if(!findChannel){
        return res.status(400).json({message:"channel not found"})
    }
    if(!findUser){
        return res.status(400).json({message:"user not found"})
    }

    const isUserOwner = findUser.ownChannel.includes(channelId);
    if(!isUserOwner){
        return res.status(400).json({message:"only channel admin can add channel"})
    }
    findChannel.chatChannel.push(chatRoomName);
    await findChannel.save();

    res.status(200).json({message:"room created"})

  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
}

const createVoiceRoom = async(req,res)=>{

}

module.exports ={
createChannel,
getChannel,
getChannelSingle,
createChatRoom,
createVoiceRoom
}