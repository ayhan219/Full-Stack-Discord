const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/AuthMiddleware")
const {signup,login,getCurrentUser,logout,getFriends} = require("../controller/UserController");


router.post("/signup",signup)
router.post("/login",login)
router.get("/getcurrent",AuthMiddleware,getCurrentUser)
router.delete("/logout",logout)
router.get("/getfriends",getFriends)



module.exports = router;