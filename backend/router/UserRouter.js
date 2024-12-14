const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {signup} = require("../controller/UserController");


router.post("/signup",signup)


module.exports = router;