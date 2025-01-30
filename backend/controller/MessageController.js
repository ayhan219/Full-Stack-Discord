const mongoose = require("mongoose");
const Message = require("../model/Message");
const User = require("../model/User")



const saveChat = async(req,res)=>{
    const {senderId,receiverId,message,time,isImage} = req.body;
    
    

    if(!senderId || !receiverId || !message || !time){
        return res.status(400).json({message:"provide all area"})
    }
    try {
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            time,
            isImage
        })

        

        const findUser = await User.findById(senderId);
        if(!findUser){
            return res.status(400).json({message:"user not found"})
        }
        
        findUser.menuChat = findUser.menuChat.filter(chat => chat.toString() !== receiverId);
        findUser.menuChat.unshift(receiverId);

         
      
        await findUser.save();
        await newMessage.save();
        const user = await User.findById(senderId)
  .populate({
    path: "menuChat",
    select: "username profilePic _id", 
  });

const menuChat = user?.menuChat;
        
        return res.status(200).json(menuChat)
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }
}

const getMessages = async (req, res) => {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
        return res.status(400).json({ message: "Provide all required fields" });
    }

    try {
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 }); 

        if (messages.length === 0) {
            return res.status(404).json({ message: "No messages found" });
        }

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    saveChat,
    getMessages
}