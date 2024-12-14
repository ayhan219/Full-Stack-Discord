const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/AuthMiddleware")
const {signup,login,getCurrentUser} = require("../controller/UserController");


router.post("/signup",signup)
router.post("/login",login)
router.get("/getcurrent",AuthMiddleware,getCurrentUser)


module.exports = router;