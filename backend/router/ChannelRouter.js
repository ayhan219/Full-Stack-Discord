const mongoose = require("mongoose");
const express = require("express");
const {createChannel,getChannel,getChannelSingle} = require("../controller/ChannelController")
const router = express.Router();



router.post("/createchannel",createChannel)
router.get("/getchannel",getChannel)
router.get("/getchannelsingle",getChannelSingle)

module.exports = router;
