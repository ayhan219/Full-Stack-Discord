const mongoose = require("mongoose");

const ChannelMessageSchema = new mongoose.Schema({
    chatName:{
        type:String,
        required:true
    },
    channelId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Channel"
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    message: { type: String, required: true },
    time:{
        type:String,
        required:true
    },
    isImage:{
        type:Boolean,
        required:true
    },

},{ timestamps: true },


)

module.exports = mongoose.model("ChannelMessage",ChannelMessageSchema);