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

      socket.on("sendChannelUsers",({allUser,senderId})=>{
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


    socket.on('sendDataToChannelVoiceUsers', (data) => {
        const { serverName, voiceRoom } = data;
  
        const uniqueServerName = serverNamesWithUUID[serverName]; 
  
        if (!servers[uniqueServerName].voiceRoom) {
          servers[uniqueServerName].voiceRoom = []; 
      }
      if (!servers[uniqueServerName].voiceRoom.includes(voiceRoom)) {
          servers[uniqueServerName].voiceRoom.push(voiceRoom);
          console.log(`Voice room "${voiceRoom}" added to the server "${uniqueServerName}"`);
      } else {
          console.log(`Voice room "${voiceRoom}" already exists in server "${uniqueServerName}"`);
      }
  
        if (servers[uniqueServerName]) {
            const ownerUserId = servers[uniqueServerName].owner;
            servers[uniqueServerName].members.forEach(memberUserId => {
                if (memberUserId !== ownerUserId) {
                    const memberSocketId = onlineUsers[memberUserId];
                    if (memberSocketId) {
                        io.to(memberSocketId).emit('dataToServerVoice',voiceRoom);
                    }
                }
            });
            console.log(`Data sent to all members of the server "${uniqueServerName}" except the owner`);
        } else {
            socket.emit('serverError', `Server "${uniqueServerName}" does not exist.`);
        }
      });

   
    socket.on('joinServer', (data) => {  
        const {serverName,userId,profilePic,username} = data
        
      const uniqueServerName = serverNamesWithUUID[serverName];
        
      if (servers[uniqueServerName]) {
          if (!servers[uniqueServerName].members.includes(userId)) {
              servers[uniqueServerName].members.push(userId);
              servers[uniqueServerName].members.map((user)=>{
                const data = {
                    username,
                    _id:userId,
                    profilePic
                }
                io.to(onlineUsers[user]).emit("userJoinedChannel",(data))
              })
              saveDataToFile();
              console.log(`${userId} has joined the server "${uniqueServerName}"`);
              socket.emit('serverJoined', `You have joined the server "${uniqueServerName}" successfully.`);
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

    socket.on('send_message', (data) => {
        const {newMessage,profilePic} = data;
        
      const receiverSocketId = onlineUsers[newMessage.receiverId];
      if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', newMessage);
          io.to(receiverSocketId).emit('messageNotification', ({senderId:newMessage.senderId,profilePic:profilePic}));
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

    socket.on("joinVoiceRoom", (data) => {
        const { serverName, roomName, userId } = data;
        const uniqueServerName = serverNamesWithUUID[serverName];
    
        if (!uniqueServerName || !servers[uniqueServerName]) {
            console.log(`Server "${serverName}" not found.`);
            socket.emit("serverError", `Server "${serverName}" not found.`);
            return;
        }
    
        const voiceRooms = servers[uniqueServerName]?.voiceRoom || [];
        const voiceRoom = voiceRooms.find((room) => room.voiceRoomName === roomName);
    
        if (voiceRoom) {
            if (!voiceRoom.voiceUsers) {
                voiceRoom.voiceUsers = [];
            }
    
            if (!voiceRoom.voiceUsers.includes(userId)) {
                voiceRoom.voiceUsers.push(userId);
                console.log(`User ${userId} joined voice room "${roomName}" in server "${uniqueServerName}"`);
                saveDataToFile(); 
            } 
        } else {
            console.log(`Voice room "${roomName}" not found in server "${uniqueServerName}"`);
            socket.emit("serverError", `Voice room "${roomName}" not found.`);
        }
    });
    

    socket.on("sendVoiceJoinedUser",(data)=>{
        const {serverName,username,profilePic,_id,roomName} = data;
        const uniqueServerName = serverNamesWithUUID[serverName];
        if (!uniqueServerName || !servers[uniqueServerName]) {
            console.log(`Server "${serverName}" not found.`);
            socket.emit("serverError", `Server "${serverName}" not found.`);
            return;
        }

        const findServerUsers = servers[uniqueServerName].members;
        findServerUsers.forEach((memberUserId)=>{
            const memberSocketId = onlineUsers[memberUserId];
            if (memberSocketId && memberUserId !== _id && memberSocketId !== socket.id) {
                io.to(memberSocketId).emit("userJoinedVoiceRoom", {
                  username,
                  profilePic,
                  _id,
                  roomName,
                });
              }
        })
    })

    socket.on("sendVoiceLeftUser",(data)=>{
        const {serverName,username,profilePic,_id,roomName} = data;
        const uniqueServerName = serverNamesWithUUID[serverName];

        if (!uniqueServerName || !servers[uniqueServerName]) {
            console.log(`Server "${serverName}" not found.`);
            socket.emit("serverError", `Server "${serverName}" not found.`);
            return;
        }
        const findServerUsers = servers[uniqueServerName].members;
        findServerUsers.forEach((memberUserId)=>{
            const memberSocketId = onlineUsers[memberUserId];
            if (memberSocketId && memberUserId !== _id && memberSocketId !== socket.id) {
                io.to(memberSocketId).emit("userLeftVoiceRoom", {
                  _id,
                  roomName,
                });
              }
        })
    })

    socket.on("leaveVoiceRoom", (data) => {
        const { serverName, roomName, userId } = data;
        const uniqueServerName = serverNamesWithUUID[serverName];
    
        if (!uniqueServerName || !servers[uniqueServerName]) {
            console.log(`Server "${serverName}" not found.`);
            socket.emit("serverError", `Server "${serverName}" not found.`);
            return;
        }
        const voiceRooms = servers[uniqueServerName]?.voiceRoom || [];
    
        const voiceRoom = voiceRooms.find((room) => room.voiceRoomName === roomName);
    
        if (voiceRoom) {
            if (!voiceRoom.voiceUsers) {
                voiceRoom.voiceUsers = [];
            }
            if (voiceRoom.voiceUsers.includes(userId)) {
                voiceRoom.voiceUsers = voiceRoom.voiceUsers.filter((id) => id !== userId);
                console.log(`User ${userId} left voice room "${roomName}" in server "${uniqueServerName}"`);
                saveDataToFile(); 
                voiceRoom.voiceUsers.forEach((memberUserId) => {
                    const memberSocketId = onlineUsers[memberUserId];
                    if (memberSocketId) {
                        io.to(memberSocketId).emit("userLeftVoiceRoom", { roomName, userId });
                    }
                });
            } else {
                console.log(`User ${userId} is not in voice room "${roomName}"`);
            }
        } else {
            console.log(`Voice room "${roomName}" not found in server "${uniqueServerName}"`);
            socket.emit("serverError", `Voice room "${roomName}" not found.`);
        }
    });

    socket.on("userChangedRoom",(data)=>{
        const {serverName,roomName,_id} = data;

        const uniqueServerName = serverNamesWithUUID[serverName];

        if (!uniqueServerName || !servers[uniqueServerName]) {
            console.log(`Server "${serverName}" not found.`);
            socket.emit("serverError", `Server "${serverName}" not found.`);
            return;
        }

        servers[uniqueServerName].members.forEach((memberUserId)=>{
            const memberSocketId = onlineUsers[memberUserId];
            if (memberSocketId && memberSocketId!==socket.id) {
                console.log("sending users");
                io.to(memberSocketId).emit("sendUserChangedRoom",{_id,roomName});
            }
        })
    })
    socket.on("userDisconnected",({userIds,senderId})=>{
        
        userIds.forEach((user)=>{
            if(onlineUsers[user._id]){             
                io.to(onlineUsers[user._id]).emit("userThatDisconnected",(senderId))
            }
        })
    })

    socket.on("toggleCamera",({userIdCameraToSend,senderId,isCameraOn})=>{
        console.log(userIdCameraToSend);
        
        userIdCameraToSend.forEach((id)=>{
            io.to(onlineUsers[id]).emit("cameraToggled",({senderId,isCameraOn}))
        })
    })

    socket.on("userKickedFromChannel",(data)=>{
        const {channelId,kickUserId,channelName} = data;
        const uniqueServerName = serverNamesWithUUID[channelName];
        const updatedChannelUsers=servers[uniqueServerName].members.filter((item)=>item!==kickUserId);
        servers[uniqueServerName].members =updatedChannelUsers
        saveDataToFile();
        io.to(onlineUsers[kickUserId]).emit("kickedFromChannel",(channelId))
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