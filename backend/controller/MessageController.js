const mongoose = require("mongoose");
const Message = require("../model/Message");



const saveChat = async(req,res)=>{
    const {senderId,receiverId,message} = req.body;
    

    if(!senderId || !receiverId || !message){
        return res.status(400).json({message:"provide all area"})
    }
    try {
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })
        await newMessage.save();
        return res.status(200).json({message:"successfully saved"})
    } catch (error) {
        return res.status(500).json({message:"server error"})
    }
}

module.exports = {
    saveChat
}