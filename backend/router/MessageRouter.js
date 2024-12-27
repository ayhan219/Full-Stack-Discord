const express = require("express");
const router = express.Router();

const {saveChat,getMessages} = require("../controller/MessageController");


router.post("/savechat",saveChat);
router.get("/getmessages",getMessages)

module.exports = router;