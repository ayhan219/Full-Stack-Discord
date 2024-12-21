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
    const findUser = await User.findOne({ email }).populate("friends", "username")
    .populate("pendingFriend", "username");
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
        friends:findUser.friends,
        pendingFriend:findUser.pendingFriend,
        menuChat:findUser.menuChat
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
      friends:findUser.friends,
      pendingFriend:findUser.pendingFriend,
      menuChat:findUser.menuChat
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
    // Hem 'friends' hem de 'pendingFriend' alanlarını populate et
    const user = await User.findById(userId)
      .populate("friends", "username")
      .populate("pendingFriend", "username")
      .populate("menuChat","username")

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
      menuChat:user.menuChat
    });
  } catch (error) {
    return res.status(500).json({ message: "server error", error });
  }
};


const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "logout successfull" });
};



const addFriend = async(req,res)=>{
  const {userId,friendName} = req.body;
  

  console.log(userId,friendName);
  
  if(!userId | !friendName){
    return res.status(400).json({message:"provide all area"})
  }
  try {
    const findUser = await User.findById(userId);
    if(!findUser){
      return res.status(400).json({message:"user not found"})
    }
   
    const findFriend = await User.findOne({username:friendName});
    

    if(findFriend.pendingFriend.includes(findUser._id)){
      return res.status(400).json({message:"request already sended"})
    }
    const friend = {username:findUser.username,_id:findUser._id}
    findFriend.pendingFriend.push(friend);
    
    await findUser.save();
    await findFriend.save();
    
    res.status(200).json(findFriend._id)
  } catch (error) {
    return res.status(500).json(error);
  }
}

const acceptOrDecline = async (req, res) => {
  const { userId, request, friendUserId } = req.body;

  console.log(userId,request,friendUserId);
  

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

      if (!findFriend.friends.includes(userId) && !findUser.friends.includes(friendUserId)) {
        findFriend.friends.push(userId);
        findUser.friends.push(friendUserId);
      } else {
        return res.status(400).json({ message: "Already friends" });
      }
    }

    if (request === "decline") {
      findUser.pendingFriend.pull(friendUserId);
    }

    await findUser.save();
    await findFriend.save();

    return res.status(200).json(findUser);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addToMenuChat = async(req,res)=>{
  const {userId,friendUserId} = req.body;

  if(!userId || !friendUserId){
    return res.status(400).json({message:"provide all area"})
  }
  try {
    const findUser = await User.findById(userId);
    const findFriend = await User.findById(friendUserId);

    if(!findFriend){
      return res.status(400).json({message:"friend not found"})
    }

    if(!findUser){
      return res.status(400).json({message:"user not found"})
    }

    const datasToAdd = {username:findFriend.username,_id:findFriend._id}

    findUser.menuChat.unshift(datasToAdd);
    await findUser.save();

    return res.status(200).json({message:"successfull"})
    

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}




module.exports = {
  signup,
  login,
  getCurrentUser,
  logout,
  addFriend,
  acceptOrDecline,
  addToMenuChat
};
