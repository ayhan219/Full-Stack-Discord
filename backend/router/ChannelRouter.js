const mongoose = require("mongoose");
const express = require("express");
const {createChannel,getChannel,getChannelSingle,createChatRoom,createVoiceRoom,createInvite} = require("../controller/ChannelController")
const router = express.Router();



router.post("/createchannel",createChannel)
router.get("/getchannel",getChannel)
router.get("/getchannelsingle",getChannelSingle)
router.post("/createchatroom",createChatRoom)
router.post("/createvoiceroom",createVoiceRoom)
router.post("/createinvite",createInvite)

module.exports = router;
