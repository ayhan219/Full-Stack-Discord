const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const cors = require("cors");
const UserRoutes = require("./router/UserRouter");
const ChannelRoutes = require("./router/ChannelRouter")
const cookieParser = require("cookie-parser")
dotenv.config();



app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",UserRoutes);
app.use("/api/channel",ChannelRoutes)


const connectToDB = async()=>{
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to DB");
    
}


app.listen(process.env.PORT,async()=>{
    await connectToDB();
    console.log(`server listening on port ${process.env.PORT}`);
    
})