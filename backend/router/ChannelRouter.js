const mongoose = require("mongoose");
const express = require("express");
const {createChannel,getChannel,getChannelSingle,createChatRoom,createVoiceRoom,createInvite,joinChannel,addUserToVoiceChannel,deleteUserFromVoiceChannel,deleteChannel} = require("../controller/ChannelController")
const router = express.Router();



router.post("/createchannel",createChannel)
router.get("/getchannel",getChannel)
router.get("/getchannelsingle",getChannelSingle)
router.post("/createchatroom",createChatRoom)
router.post("/createvoiceroom",createVoiceRoom)
router.post("/createinvite",createInvite)
router.get("/join/:token",joinChannel)
router.post("/addusertovoicechannel",addUserToVoiceChannel)
router.delete("/deleteuserfromvoicechannel",deleteUserFromVoiceChannel)
router.delete("/deletechannel",deleteChannel);

module.exports = router;
