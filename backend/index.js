const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const cors = require("cors");
const UserRoutes = require("./router/UserRouter");
const ChannelRoutes = require("./router/ChannelRouter")
const MessageRoutes = require("./router/MessageRouter")
const cookieParser = require("cookie-parser")
const path = require("path");

const { AccessToken } = require("livekit-server-sdk");
dotenv.config();



app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth",UserRoutes);
app.use("/api/channel",ChannelRoutes)
app.use("/api/message",MessageRoutes)


const createToken = async (roomName,username) => {
    console.log("createToken çalıştı");
  
    const roomCall = `${roomName}`;
    const participantName = username;
  
    const at = new AccessToken(
      "APIqbEWDGcADnYn", // API Key
      "HSukfX16x5NECKfxxGlGDFiT6b7dvDClzSPXZAzoAb9", // Secret Key
      {
        identity: participantName,
        ttl: "10m", // Token 10 dakika sonra süresi dolacak
      }
    );
  
    at.addGrant({ roomJoin: true, room: roomCall });
    return await at.toJwt();
  };
  
  // **Yeni /getToken endpointi**
  app.get("/getToken", async (req, res) => {
    const {roomName,username} = req.query;
    try {
      const token = await createToken(roomName,username);
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Token oluşturulamadı" });
    }
  });
  


const connectToDB = async()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to DB");
    
}


app.listen(process.env.PORT,async()=>{
    await connectToDB();
    console.log(`server listening on port ${process.env.PORT}`);
    
})