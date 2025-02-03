const express = require("express");
const router = express.Router();

const {saveChat,getMessages,saveChannelMessage, getChannelMessages} = require("../controller/MessageController");


router.post("/savechat",saveChat);
router.get("/getmessages",getMessages)
router.post("/savechannelmessage",saveChannelMessage)
router.get("/getchannelmessages",getChannelMessages)

module.exports = router;