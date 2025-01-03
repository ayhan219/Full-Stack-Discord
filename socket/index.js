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
        onlineUsers = parsedData.onlineUsers || {};
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
        onlineUsers,
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
        console.log(`${userId} is now online with socket ID ${socket.id}`);
        saveDataToFile();        
    });

   
    socket.on('createServer', (serverName, userId) => {
      if (serverNamesWithUUID[serverName]) {
          socket.emit('serverError', `Server "${serverName}" already exists.`);
      } else {
          const uniqueServerName = `${serverName}-${uuidv4()}`;
          servers[uniqueServerName] = { owner: userId, members: [userId] }; 
          serverNamesWithUUID[serverName] = uniqueServerName; 
          saveDataToFile();
          console.log(`Server "${uniqueServerName}" has been created by ${userId}`);
          socket.emit('serverCreated', `Server "${uniqueServerName}" created successfully.`);
      }
    });

    
    socket.on('sendDataToChannelUsers', (data) => {
      const { serverName, chatRoom } = data;
      console.log(serverName, chatRoom);

      const uniqueServerName = serverNamesWithUUID[serverName]; 

      if (!servers[uniqueServerName].chatRooms) {
        servers[uniqueServerName].chatRooms = []; 
    }
   
    

    if (!servers[uniqueServerName].chatRooms.includes(chatRoom)) {
        servers[uniqueServerName].chatRooms.push(chatRoom);
        console.log(`Chat room "${chatRoom}" added to the server "${uniqueServerName}"`);
    } else {
        console.log(`Chat room "${chatRoom}" already exists in server "${uniqueServerName}"`);
    }
    console.log(servers);

      if (servers[uniqueServerName]) {
          const ownerUserId = servers[uniqueServerName].owner;
          servers[uniqueServerName].members.forEach(memberUserId => {
              if (memberUserId !== ownerUserId) {
                  const memberSocketId = onlineUsers[memberUserId];
                  if (memberSocketId) {
                      io.to(memberSocketId).emit('dataToServer', {
                          roomName: chatRoom,
                          messages: [],
                      });
                  }
              }
          });
          console.log(`Data sent to all members of the server "${uniqueServerName}" except the owner`);
      } else {
          socket.emit('serverError', `Server "${uniqueServerName}" does not exist.`);
      }
    });

   
    socket.on('joinServer', (serverName, userId) => {
      const uniqueServerName = serverNamesWithUUID[serverName];  
      console.log(serverName, userId);

      if (servers[uniqueServerName]) {
          if (!servers[uniqueServerName].members.includes(userId)) {
              servers[uniqueServerName].members.push(userId);
              saveDataToFile();
              console.log(`${userId} has joined the server "${uniqueServerName}"`);
              socket.emit('serverJoined', `You have joined the server "${uniqueServerName}" successfully.`);
          } else {
              socket.emit('serverError', `You are already a member of "${uniqueServerName}".`);
          }
      } else {
          socket.emit('serverError', `Server "${uniqueServerName}" does not exist.`);
      }
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

    socket.on('send_message', (newMessage) => {
      const receiverSocketId = onlineUsers[newMessage.receiverId];
      if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', newMessage);
          console.log(`Message sent to ${newMessage.receiverId}`);
      } else {
          console.log(`${newMessage.receiverId} is offline.`);
      }
    });

    socket.on("sendMessageToChat", (serverName, channelName, userId, username, profilePic, message) => {
        console.log("Message received:", serverName, channelName, userId, message);
    
        const uniqueServerName = serverNamesWithUUID[serverName]; 
    
        if (servers[uniqueServerName]) {
            servers[uniqueServerName].members.forEach((memberUserId) => {
                const memberSocketId = onlineUsers[memberUserId]; 
                console.log("Member Socket ID:", memberSocketId);
    
                console.log(memberSocketId);
                
                if (memberSocketId) {
                    io.to(memberSocketId).emit("sendMessageToChatArea", {
                        serverName,
                        channelName,
                        userId,
                        username,
                        profilePic,
                        message,
                        time: new Date().toISOString(),
                    });
                }
            });
    
            console.log(`Message sent to channel "${channelName}" in server "${uniqueServerName}"`);
        } else {
            socket.emit("serverError", `Server "${uniqueServerName}" does not exist.`);
        }
    });

    socket.on('disconnect', () => {
        for (let userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                saveDataToFile();
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