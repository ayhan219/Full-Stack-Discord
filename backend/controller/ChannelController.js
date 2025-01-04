const mongoose = require("mongoose");
const User = require("../model/User")
const Channel = require("../model/Channel")
const crypto = require("crypto");



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

        newChannel.channelUsers.unshift(findUser._id);
        findUser.ownChannel.push(newChannel._id);
        findUser.joinedChannel.push(newChannel._id);
        newChannel.admin.push(findUser._id);

        await findUser.save();
        await newChannel.save();

        console.log(newChannel);
        
        return res.status(201).json(newChannel);
        

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
        const reversedChannels = findUser.joinedChannel.reverse();
        return res.status(200).json({
            message: "Channels retrieved successfully",
            channels: reversedChannels
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
        const findChannel = await Channel.findById(channelId).populate('channelUsers', 'username profilePic _id');  // 'username' ve 'profilePic' alanlarını populate et
        if(!findChannel){
            return res.status(400).json({message:"channel not found"})
        }

        console.log(findChannel);
        
        return res.status(200).json(findChannel)
        
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }
}

const createChatRoom = async (req, res) => {
    const { channelId, userId, chatRoomName } = req.body;

    if (!channelId || !userId || !chatRoomName) {
        return res.status(400).json({ message: "Please provide all required fields." });
    }

    try {
        const findChannel = await Channel.findById(channelId);
        const findUser = await User.findById(userId);

        if (!findChannel) {
            return res.status(404).json({ message: "Channel not found." });
        }
        if (!findUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const isUserOwner = findUser.ownChannel.includes(channelId);
        if (!isUserOwner) {
            return res.status(403).json({ message: "Only channel admin can add rooms." });
        }

        

        findChannel.chatChannel.push({
            roomName: chatRoomName,
            messages: [], 
        });

        await findChannel.save();

        res.status(200).json(chatRoomName);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error." });
    }
};


const createVoiceRoom = async(req,res)=>{
    const {channelId,userId,voiceRoomName} = req.body;

    console.log(channelId,userId,voiceRoomName);
    
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
      const newVoiceRoom = {
        voiceRoomName: voiceRoomName,
        voiceUsers: [], 
      };
      findChannel.voiceChannel.push(newVoiceRoom);
      await findChannel.save();
  
      res.status(200).json(newVoiceRoom)
  
    } catch (error) {
      return res.status(500).json(error)
    }
}

const invitations = {};

const createInvite = async(req,res)=>{
    const { channelId } = req.body;

  if (!channelId) {
    return res.status(400).send('Channel ID is required');
  }

  const token = crypto.randomBytes(16).toString('hex');
  invitations[token] = { channelId, expiresAt: Date.now() + 60 * 60 * 1000 }; 

  const inviteLink = `${req.protocol}://${req.get('host')}/join/${channelId}/${token}`;
  res.json({ inviteLink });
}


const joinChannel = async (req, res) => {
    const { token } = req.params;
    const {userId} = req.query;
    console.log("joinchannel worked",userId);
  
    const invite = invitations[token];
  
    if (!invite || invite.expiresAt < Date.now()) {
      return res.status(400).send('Invalid or expired invite');
    }
  
    const channelId = invite.channelId;
    delete invitations[token];
  
    try {
      await addUserToChannel(userId, channelId);
      const channel = await Channel.findById(channelId);
      return res.json(channel);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

  async function addUserToChannel(userId, channelId) {
    try {
      const channel = await Channel.findById(channelId);
      const user = await User.findById(userId);
  
      if (!channel) throw new Error('Channel not found');
      if (!user) throw new Error('User not found');
   
      if (!channel.channelUsers.some(u => u.toString() === user._id)) {
        channel.channelUsers.push(userId);
      }
  
      if (!user.joinedChannel.includes(channelId)) {
        user.joinedChannel.push(channelId);
      }
  
      await channel.save();
      await user.save();
    } catch (error) {
      throw error;
    }
  }
  

  const addUserToVoiceChannel = async (req, res) => {
    const { userId, channelId, voiceRoomName } = req.body;
  
    try {
      const findChannel = await Channel.findById(channelId);
      if (!findChannel) {
        return res.status(404).json({ message: "Channel not found" });
      }
  
      const voiceRoom = findChannel.voiceChannel.find(
        (room) => room.voiceRoomName === voiceRoomName
      );
      if (!voiceRoom) {
        return res.status(404).json({ message: "Voice room not found" });
      }

      const isUserAlreadyInRoom = voiceRoom.voiceUsers.some(
        (user) => user.toString() === userId
      );
      if (isUserAlreadyInRoom) {
        return res.status(400).json({ message: "User is already in the voice channel" });
      }
  
      const updatedChannel = await Channel.findOneAndUpdate(
        {
          _id: channelId,
          "voiceChannel.voiceRoomName": voiceRoomName,
        },
        {
          $push: { "voiceChannel.$.voiceUsers": userId },
        },
        { new: true }
      )
        .populate({
          path: "voiceChannel.voiceUsers",  
          select: "username profilePic _id", 
        })
        .populate({
          path: "voiceChannel", 
        });
  
      if (!updatedChannel) {
        return res.status(404).json({ message: "Voice room not found" });
      }
  

      const updatedVoiceRoom = updatedChannel.voiceChannel.find(
        (room) => room.voiceRoomName === voiceRoomName
      );
  
      const newUser = updatedVoiceRoom.voiceUsers.find(
        (user) => user._id.toString() === userId
      );
  
      if (!newUser) {
        return res.status(404).json({ message: "New user not found" });
      }
  
      return res.status(200).json(newUser);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  const deleteUserFromVoiceChannel = async (req, res) => {
    const { userId, channelId, voiceRoomName } = req.body;
  
    try {
      const findChannel = await Channel.findById(channelId);
      if (!findChannel) {
        return res.status(404).json({ message: "Channel not found" });
      }
  
      const voiceRoom = findChannel.voiceChannel.find(
        (room) => room.voiceRoomName === voiceRoomName
      );
      if (!voiceRoom) {
        return res.status(404).json({ message: "Voice room not found" });
      }
  

      const isUserInRoom = voiceRoom.voiceUsers.some(
        (user) => user.toString() === userId
      );
      if (!isUserInRoom) {
        return res.status(400).json({ message: "User is not in the voice channel" });
      }
  
      const userToRemove = await User.findById(userId).select("username profilePic _id");
  
      if (!userToRemove) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const updatedChannel = await Channel.findOneAndUpdate(
        {
          _id: channelId,
          "voiceChannel.voiceRoomName": voiceRoomName,
        },
        {
          $pull: { "voiceChannel.$.voiceUsers": userId },
        },
        { new: true }
      )
        .populate({
          path: "voiceChannel.voiceUsers",
          select: "username profilePic _id",
        })
        .populate({
          path: "voiceChannel",
        });
  
      if (!updatedChannel) {
        return res.status(404).json({ message: "Voice room not found" });
      }
  
      const updatedVoiceRoom = updatedChannel.voiceChannel.find(
        (room) => room.voiceRoomName === voiceRoomName
      );
  
      const removedUser = updatedVoiceRoom.voiceUsers.find(
        (user) => user._id.toString() === userId
      );
  
      if (!removedUser) {
        return res.status(200).json(userToRemove); 
      } else {
        return res.status(400).json({ message: "Failed to remove user from the voice channel" });
      }
  
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  

module.exports ={
createChannel,
getChannel,
getChannelSingle,
createChatRoom,
createVoiceRoom,
createInvite,
joinChannel,
addUserToVoiceChannel,
deleteUserFromVoiceChannel
}