const express = require("express");
const router = express.Router();

const {saveChat} = require("../controller/MessageController");


router.post("/savechat",saveChat);

module.exports = router;