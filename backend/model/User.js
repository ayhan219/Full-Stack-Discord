const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    displayName:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic: { type: String, default: "" },
    ownChannel: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
            default:null 
        }
    ],
    joinedChannel:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
            default:null  
        }
    ],
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null
        }
    ],
    pendingFriend:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null
        }
    ],
    menuChat:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null 
        }
    ],
    notificationNumber:{
        type:Number,
        default:0

    }

});

module.exports = mongoose.model("User",UserSchema)