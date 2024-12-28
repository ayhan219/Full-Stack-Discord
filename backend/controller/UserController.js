const mongoose = require("mongoose");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { email, displayName, username, password } = req.body;
  try {
    if (!email || !displayName || !username || !password) {
      return res.status(400).json({ message: "provide all area" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user exist!" });
    }

    const hashedPW = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      displayName,
      username,
      password: hashedPW,
      profilePic: "/uploads/discorddefault.png",
    });
    await newUser.save();

    return res.status(200).json({ message: "signup successfull!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "provide all area" });
  }
  try {
    const findUser = await User.findOne({ email })
      .populate("friends", "username profilePic")
      .populate("pendingFriend", "username profilePic")
      .populate("menuChat", "username profilePic");
    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }
    const isPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "password doesn't match" });
    }

    const token = jwt.sign(
      {
        userId: findUser._id,
        email: findUser.email,
        displayName: findUser.displayName,
        username: findUser.username,
        friends: findUser.friends,
        pendingFriend: findUser.pendingFriend,
        menuChat: findUser.menuChat,
        profilePic: findUser.profilePic,
        notificationNumber:findUser.notificationNumber
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    return res.status(200).json({
      userId: findUser._id,
      email: findUser.email,
      displayName: findUser.displayName,
      username: findUser.username,
      friends: findUser.friends,
      pendingFriend: findUser.pendingFriend,
      menuChat: findUser.menuChat,
      profilePic: findUser.profilePic,
      notificationNumber:findUser.notificationNumber
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(400).json({ message: "user not found" });
  }

  try {
    const user = await User.findById(userId)
      .populate("friends", "username profilePic")
      .populate("pendingFriend", "username profilePic")
      .populate("menuChat", "username profilePic");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json({
      userId: user._id,
      email: user.email,
      displayName: user.displayName,
      username: user.username,
      friends: user.friends,
      pendingFriend: user.pendingFriend,
      menuChat: user.menuChat,
      profilePic: user.profilePic,
      notificationNumber:user.notificationNumber
    });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "logout successfull" });
};

const addFriend = async (req, res) => {
  const { userId, friendName } = req.body;

  if (!userId | !friendName) {
    return res.status(400).json({ message: "provide all area" });
  }
  try {
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }

    const findFriend = await User.findOne({ username: friendName });

    if (findFriend.pendingFriend.includes(findUser._id)) {
      return res.status(400).json({ message: "request already sended" });
    }
    const friend = {
      username: findUser.username,
      _id: findUser._id,
      profilePic: findUser.profilePic,
    };
    findFriend.pendingFriend.push(friend);

    await findUser.save();
    await findFriend.save();

    res.status(200).json(findFriend._id);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const acceptOrDecline = async (req, res) => {
  const { userId, request, friendUserId } = req.body;

  if (!userId || !request || !friendUserId) {
    return res.status(400).json({ message: "Provide all fields" });
  }

  try {
    const findUser = await User.findById(userId);
    const findFriend = await User.findById(friendUserId);

    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!findFriend) {
      return res.status(400).json({ message: "Friend not found" });
    }

    if (request === "accept") {
      findUser.pendingFriend.pull(friendUserId);

      if (
        !findFriend.friends.includes(userId) &&
        !findUser.friends.includes(friendUserId)
      ) {
        // const datasToAdd = {username:findFriend.username,_id:findFriend._id,profilePic:findFriend.profilePic}
        // const datasToAdd2 = {username:findUser.username,_id:findUser._id,profilePic:findUser.profilePic}
        findFriend.friends.push(findUser._id);

        findUser.friends.push(findFriend._id);
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    }

    if (request === "decline") {
      findUser.pendingFriend.pull(friendUserId);
    }

    await findUser.save();
    await findFriend.save();

    return res
      .status(200)
      .json({
        username: findFriend.username,
        _id: findFriend._id,
        profilePic: findFriend.profilePic,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addToMenuChat = async (req, res) => {
  const { userId, friendUserId } = req.body;

  if (!userId || !friendUserId) {
    return res.status(400).json({ message: "provide all area" });
  }
  try {
    const findUser = await User.findById(userId);
    const findFriend = await User.findById(friendUserId);

    if (!findFriend) {
      return res.status(400).json({ message: "friend not found" });
    }

    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }

    if (findUser.menuChat.includes(friendUserId)) {
      return;
    }

    const datasToAdd = {
      username: findFriend.username,
      _id: findFriend._id,
      profilePic: findFriend.profilePic,
    };

    findUser.menuChat.unshift(datasToAdd);
    await findUser.save();

    return res.status(200).json(datasToAdd);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  const { userId } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: filePath },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile picture updated successfully!",
      profilePic: filePath,
    });
    await user.save();
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

const editUserProfile = async (req, res) => {
  const { userId, editedPartName, newParam } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const validFields = ["displayName", "username", "email"];
    if (!validFields.includes(editedPartName)) {
      return res.status(400).json({ message: "Invalid field name." });
    }

    if (editedPartName === "displayName") {
      findUser.displayName = newParam;
    } else if (editedPartName === "username") {
      const existingUser = await User.findOne({ username: newParam });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: "Username is already taken." });
      }
      findUser.username = newParam;
    } else if (editedPartName === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newParam)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      const existingEmail = await User.findOne({ email: newParam });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res.status(400).json({ message: "Email is already in use." });
      }

      findUser.email = newParam;
    }

    await findUser.save();


    res.status(200).json({ message: "User updated successfully.", user: findUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

const addNotification = async(req,res)=>{
  const {userId} = req.body;

  if(!userId){
    return res.status(400).json({message:"no user id"})
  }
  try {
    const findUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { notificationNumber: 1 } }, 
      { new: true }
    );

    if(!findUser){
      return res.status(404).json({message:"user not found"})
    }

    await findUser.save();
    const updatedUser = await User.findById(userId)

    return res.status(200).json(updatedUser.notificationNumber)
  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
}

const getNotification = async(req,res)=>{
  const {userId} = req.query;

  if(!userId){
    return res.status(400).json({message:"no user id"})
  }

  try {
    const findUser = await User.findById(userId);

    if(!findUser){
      return res.status(404).json({message:"user not found"})
    }
    return res.status(200).json(findUser.notificationNumber)

  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
}

const deleteNotification = async(req,res)=>{
  const {userId} = req.body;

  if(!userId){
    return res.status(400).json({message:"no user id"})
  }
  try {
    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (findUser.notificationNumber <= 0) {
      return res.status(400).json({ message: "Notification number is already zero" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { notificationNumber: -1 } },
      { new: true }
    );

    return res.status(200).json(updatedUser.notificationNumber);
  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
}

const deleteMenuChat = async(req,res)=>{
  const {userId,friendId} = req.body;

  if(!userId || !friendId){
    return res.status(400).json({message:"provide all area"})
  }

  try {
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const filteredMenuChat = findUser.menuChat.filter((item)=>item.toString()!==friendId);
    findUser.menuChat = filteredMenuChat;

    await findUser.save();

    const updatedUser = await User.findById(userId).populate("menuChat", "username profilePic _id");


    res.status(200).json(updatedUser.menuChat)
  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
}

module.exports = {
  signup,
  login,
  getCurrentUser,
  logout,
  addFriend,
  acceptOrDecline,
  addToMenuChat,
  uploadProfilePicture,
  editUserProfile,
  addNotification,
  getNotification,
  deleteNotification,
  deleteMenuChat
};
