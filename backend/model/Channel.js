const mongoose = require("mongoose");


const ChannelSchema = new mongoose.Schema({
    channelName:{
        type:String,
        required:true
    },
    admin:[
        {
            type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        }
    ],
    chatChannel: [
        {
            roomName: {
                type: String, 
                required: true,
            },
            messages: [
                {
                    sender: {
                        type: String, 
                        required: true,
                    },
                    content: {
                        type: String, 
                        required: true,
                    },
                    timestamp: {
                        type: Date, 
                        default: Date.now,
                    },
                },
            ],
        },
       
    ],
    voiceChannel:[
        {
            voiceRoomName:{
                type:String,
                default:null
            },
            voiceUsers:[
                {
                    type:String,
                    default:null
                    
                }
            ]
                    
                    
        }
    ],
    channelUsers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default:null
        }
    ]
})

module.exports = mongoose.model("Channel",ChannelSchema);