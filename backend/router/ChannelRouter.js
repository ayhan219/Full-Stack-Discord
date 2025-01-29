const mongoose = require("mongoose");
const express = require("express");
const {createChannel,getChannel,getChannelSingle,createChatRoom,createVoiceRoom,createInvite,joinChannel,addUserToVoiceChannel,deleteUserFromVoiceChannel,deleteChannel,uploadChannelPhoto,kickUser} = require("../controller/ChannelController")
const router = express.Router();
const upload = require("../middleware/MulterMiddleware")



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
router.post("/uploadchannelphoto",upload.single("channelPic"),uploadChannelPhoto)
router.post("/kickuser",kickUser)

module.exports = router;
