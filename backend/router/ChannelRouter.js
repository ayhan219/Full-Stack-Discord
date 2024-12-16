const mongoose = require("mongoose");
const express = require("express");
const {createChannel,getChannel,getChannelSingle,createChatChannel} = require("../controller/ChannelController")
const router = express.Router();



router.post("/createchannel",createChannel)
router.get("/getchannel",getChannel)
router.get("/getchannelsingle",getChannelSingle)
router.post("/createchatchannel",createChatChannel)

module.exports = router;
