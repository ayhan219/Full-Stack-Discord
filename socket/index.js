const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ['GET', 'POST'],
  }
});


let onlineUsers = {}; 


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Kullanıcı aktif olduğunda kaydetmek
    socket.on('userOnline', (userId) => {
        onlineUsers[userId] = socket.id;  
        console.log(`${userId} has connected`);        
    });

    socket.on('friendRequest', (senderId, receiverId,username,profilePic) => {
      if (onlineUsers[receiverId]) {
        io.to(onlineUsers[receiverId]).emit('friendRequestNotification', senderId,username,profilePic);
      } else {
        console.log(`${receiverId} has offline. The notification will send after connected`);
      }
    });

    socket.on("sendAcceptOrDecNotificationToUser",(senderId,receiverId,selectedValue,username,profilePic)=>{
      
      if(onlineUsers[receiverId]){
      io.to(onlineUsers[receiverId]).emit("sendReceiverIdToUser",senderId,selectedValue,username,profilePic);
      console.log(`notification sended to ${receiverId}`);
      }
      else{
        console.log(`${receiverId} now is offline`);
      }
      
    })

    socket.on("send_message",(newMessage)=>{
      if(onlineUsers[newMessage.receiverId]){
        io.to(onlineUsers[newMessage.receiverId]).emit("receive_message",newMessage);
        console.log(`message sended to ${newMessage.receiverId}`);
      }
      else{
        console.log(`${receiverId} now is offline`);
      }
      
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

// Diğer API endpoint'leriniz burada olacak

server.listen(3001, () => {
    console.log('running on port 3001');
});
