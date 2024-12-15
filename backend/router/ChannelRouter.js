const mongoose = require("mongoose");
const express = require("express");
const {createChannel} = require("../controller/ChannelController")
const router = express.Router();



router.post("/createchannel",createChannel)

module.exports = router;
