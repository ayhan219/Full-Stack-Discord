const mongoose = require("mongoose");
const express = require("express");
const {createChannel,getChannel} = require("../controller/ChannelController")
const router = express.Router();



router.post("/createchannel",createChannel)
router.get("/getchannel",getChannel)

module.exports = router;
