const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = './serverData.json';
const fs = require('fs').promises;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ['GET', 'POST'],
  }
});

let onlineUsers = {};
let servers = {};   
let serverNamesWithUUID = {}; 



async function loadDataFromFile() {
    try {
        await fs.access(path); // Check if the file exists
        const data = await fs.readFile(path, 'utf-8');
        const parsedData = JSON.parse(data);
        servers = parsedData.servers || {};
        serverNamesWithUUID = parsedData.serverNamesWithUUID || {};
        console.log('Data loaded from file');
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('File not found, creating a new one.');
            await fs.writeFile(path, JSON.stringify({ onlineUsers: {}, servers: {}, serverNamesWithUUID: {} }, null, 2), 'utf-8');
        } else {
            console.error('Error reading file:', err);
        }
    }
}

  async function saveDataToFile() {
    const data = {
      servers,
      serverNamesWithUUID
    };
  
    try {
      await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf-8');
      console.log('Data saved to file');
    } catch (err) {
      console.error('Error saving data:', err);
    }
  }


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

 
    socket.on('userOnline', (userId) => {
        onlineUsers[userId] = socket.id;  
  
               
    });

    socket.on("getOnlineUser", ({userIds,senderId}) => {
      
        const onlineFriendsFromSocket = [];
        
                
       userIds.forEach((user)=>{
        if(onlineUsers[user._id]){
            const data ={
                _id:user._id,
                username:user.username,
                profilePic:user.profilePic
            }
            io.to(onlineUsers[user._id]).emit("ImOnline",(senderId))
            onlineFriendsFromSocket.push(data);
        }
        else{
            console.log(`${user?._id} is not online`);
        }
       })
         io.to(socket.id).emit("onlineFriends",onlineFriendsFromSocket)
      });

      socket.on("sendChannelUsers",(data)=>{
        
        const {allUser,senderId} = data;
        
       const onlineChannelUserFromSocket = []
       
       allUser.forEach((user)=>{
        if(onlineUsers[user._id]){
            const data ={
                _id:user._id,
                username:user.username,
                profilePic:user.profilePic
            }
           io.to(onlineUsers[user._id]).emit("onlineChannelUsers",(senderId))
           onlineChannelUserFromSocket.push(data);
            
        }
       })
       
       io.to(socket.id).emit("onlineAllChannelUsers",(onlineChannelUserFromSocket))

      })

    
    socket.on('sendDataToChannelUsers', (data) => {
        const {channelId,chatRoom,channelUsers} = data;
        channelUsers.forEach((item)=>{
            if(onlineUsers[item._id] && onlineUsers[item._id] !== socket.id){
                io.to(onlineUsers[item._id]).emit("chatChannelInfo",({channelId,chatRoom}))
            }
        })
    });


    socket.on('sendDataToChannelVoiceUsers', (data) => {
        const {channelId,voiceRoomName,channelUsers} = data;
        channelUsers.forEach((item)=>{
            if(onlineUsers[item._id] && onlineUsers[item._id] !== socket.id){
                io.to(onlineUsers[item._id]).emit("chatVoiceInfo",({channelId,voiceRoomName}))
            }
        })
      });

   
    socket.on('joinServer', (data) => {  
        const {channelId,channelUsers,userData} =data;
        channelUsers.forEach((item)=>{
            if(onlineUsers[item._id] && onlineUsers[item._id] !== socket.id){
                io.to(onlineUsers[item._id]).emit("userJoinedChannel",({channelId,userData}))
                io.to(onlineUsers[item._id]).emit("addToAllUser",({userData}));
            }
        })
        
        
      
    });


    socket.on('friendRequest', (senderId, receiverId, username, profilePic) => {
      if (onlineUsers[receiverId]) {
          io.to(onlineUsers[receiverId]).emit('friendRequestNotification', senderId, username, profilePic);
      } else {
          console.log(`${receiverId} is offline. The notification will be sent after they reconnect.`);
      }
    });

    socket.on("sendAcceptOrDecNotificationToUser", (senderId, receiverId, selectedValue, username, profilePic) => {
      if (onlineUsers[receiverId]) {
          io.to(onlineUsers[receiverId]).emit("sendReceiverIdToUser", senderId, selectedValue, username, profilePic);
          console.log(`Notification sent to ${receiverId}`);
      } else {
          console.log(`${receiverId} is offline.`);
      }
    });

    socket.on('send_message', (data) => {
        const {newMessage,profilePic} = data;
        
      const receiverSocketId = onlineUsers[newMessage.receiverId];
      if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', newMessage);
          io.to(receiverSocketId).emit('messageNotification', ({senderId:newMessage.senderId,profilePic:profilePic}));
      } 
    });

    socket.on("sendMessageToChat", (data) => {
        console.log(data);
        
        const {channelUsers,channelId,chatName, senderId,time, username, profilePic, message,isImage} = data
        channelUsers.forEach((item)=>{
            if(onlineUsers[item._id]){
                io.to(onlineUsers[item._id]).emit("sendMessageToChatArea",({channelId,chatName,senderId,username,profilePic,message,isImage,time}))
            }
        })
    });

   

    socket.on("sendVoiceJoinedUser",(data)=>{
        const {channelUsers,channelId,roomName,username,profilePic,_id} = data;
        channelUsers.forEach((user)=>{
            if(onlineUsers[user._id] && onlineUsers[user._id]!==socket.id){
                io.to(onlineUsers[user._id]).emit("userJoinedVoiceRoom",({channelId,roomName,username,profilePic,_id}))
            }
        })

    })

    socket.on("sendVoiceLeftUser",(data)=>{
       const {channelUsers,channelId,roomName,username,profilePic,_id} = data;
       channelUsers.forEach((user)=>{
        if(onlineUsers[user._id] && onlineUsers[user._id]!==socket.id){
            io.to(onlineUsers[user._id]).emit("userLeftVoiceRoom",({channelId,roomName,username,profilePic,_id}))
        }
    })
    })

  

    socket.on("userChangedRoom",(data)=>{
        const {channelUsers,channelId,roomName,_id} = data;
        channelUsers.forEach((user)=>{
            if(onlineUsers[user._id] && onlineUsers[user._id]!==socket.id){
                io.to(onlineUsers[user._id]).emit("sendUserChangedRoom",({channelId,roomName,_id}))
            }
        })
    })
    socket.on("userDisconnected",({allUser,senderId})=>{
        allUser.forEach((user)=>{
            if(onlineUsers[user._id]){             
                io.to(onlineUsers[user._id]).emit("userThatDisconnected",(senderId))
            }
        })
    })

    socket.on("userKickedFromChannel",(data)=>{
        
        const {channelId,kickUserId,channelUsers} = data;
        io.to(onlineUsers[kickUserId]).emit("kickedFromChannel",({channelId}))
    })

    socket.on("userLeftChannel",(data)=>{
        const {channelId,channelUsers,userId} = data;
        channelUsers.forEach((user)=>{
            if(onlineUsers[user._id]){             
                io.to(onlineUsers[user._id]).emit("userLeftChannel",(userId,channelId))
            }
        })
        
    })

    socket.on('disconnect', () => {
        for (let userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                console.log(`${userId} has disconnected`);
                break;
            }
        }
    });
});

server.listen(3001, () => {
    console.log('running on port 3001');
    loadDataFromFile();
});
