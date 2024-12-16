const mongoose = require("mongoose");


const ChannelSchema = new mongoose.Schema({
    channelName:{
        type:String,
        required:true
    },
    chatChannel:[
        {
            type:String,
            default:null
        }
    ],
    voiceChannel:[
        {
            type:String,
            default:null
        }
    ],
    channelUsers:[
        {
            type:String,
            default:null
        }
    ]
})

module.exports = mongoose.model("Channel",ChannelSchema);