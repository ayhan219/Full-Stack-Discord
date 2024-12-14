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
        unique:true
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    ownChannel: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel" 
        }
    ],
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

});

module.exports = mongoose.model("User",UserSchema)