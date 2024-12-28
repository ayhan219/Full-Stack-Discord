const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/AuthMiddleware")
const upload = require("../middleware/MulterMiddleware")
const {signup,login,getCurrentUser,logout,addFriend,acceptOrDecline,addToMenuChat,uploadProfilePicture,editUserProfile,addNotification,getNotification,deleteNotification} = require("../controller/UserController");


router.post("/signup",signup)
router.post("/login",login)
router.get("/getcurrent",AuthMiddleware,getCurrentUser)
router.delete("/logout",logout)
router.post("/addfriend",addFriend)
router.post("/acceptordeclinefriend",acceptOrDecline)
router.post("/addtomenuchat",addToMenuChat)
router.post("/upload-profile", upload.single("profilePic"), uploadProfilePicture);
router.post("/edituserprofile",editUserProfile)
router.post("/addnotification",addNotification)
router.post("/deletenotification",deleteNotification)
router.get("/getnotification",getNotification)



module.exports = router;