const express = require("express");
const router = express.Router();

const {saveChat,getMessages,createInvite} = require("../controller/MessageController");


router.post("/savechat",saveChat);
router.get("/getmessages",getMessages)
router.post("/createinvite",createInvite)

module.exports = router;