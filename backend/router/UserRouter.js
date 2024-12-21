const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/AuthMiddleware")
const {signup,login,getCurrentUser,logout,addFriend,acceptOrDecline,addToMenuChat} = require("../controller/UserController");


router.post("/signup",signup)
router.post("/login",login)
router.get("/getcurrent",AuthMiddleware,getCurrentUser)
router.delete("/logout",logout)
router.post("/addfriend",addFriend)
router.post("/acceptordeclinefriend",acceptOrDecline)
router.post("/addtomenuchat",addToMenuChat)



module.exports = router;