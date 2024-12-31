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

let servers = {};
let serverRooms = {};


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('userOnline', (userId) => {
        onlineUsers[userId] = socket.id;  
        console.log(`${userId} has connected`);        
    });
    socket.on('createServer', (serverName, userId) => {     
      if (!servers[serverName]) {
          servers[serverName] = { owner: userId, members: [socket.id] }; 
          serverRooms[serverName] = []; 
          console.log(`Server "${serverName}" has been created by ${userId}`);
          socket.emit('serverCreated', `Server "${serverName}" created successfully.`);
      } else {
          socket.emit('serverError', `Server "${serverName}" already exists.`);
      }
  });

  socket.on('sendDataToChannelUsers', (serverName, data) => {
    if (servers[serverName]) {
        servers[serverName].members.forEach(memberSocketId => {
            io.to(memberSocketId).emit('receive_message', {
                senderId: socket.id,  
                data:data
            });
        });
        console.log(`data sent to all members of the server "${serverName}"`);
    } else {
        socket.emit('serverError', `Server "${serverName}" does not exist.`);
    }
});

  socket.on('joinServer', (serverName, userId) => {
    console.log(serverName,userId);
    
    if (servers[serverName]) {

        if (!servers[serverName].members.includes(socket.id)) {
            servers[serverName].members.push(socket.id); 
            console.log(`${userId} has joined the server "${serverName}"`);
            socket.emit('serverJoined', `You have joined the server "${serverName}" successfully.`);
        } else {
            socket.emit('serverError', `You are already a member of "${serverName}".`);
        }
    } else {
        socket.emit('serverError', `Server "${serverName}" does not exist.`);
    }
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

    socket.on('send_message', (newMessage) => {
      const receiverSocketId = onlineUsers[newMessage.receiverId];
      if (receiverSocketId) {
      
        io.to(receiverSocketId).emit('receive_message', newMessage);
        console.log(`Message sent to ${newMessage.receiverId}`);
      } else {
        console.log(`${newMessage.receiverId} is now offline`);
      }
    });

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
});