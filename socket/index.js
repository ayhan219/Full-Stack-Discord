const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // İzin verilen domain
    methods: ['GET', 'POST'],
  }
});


let onlineUsers = {}; // Aktif kullanıcıları tutmak için bir obje

// Socket.IO bağlantısı
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    // Kullanıcı aktif olduğunda kaydetmek
    socket.on('userOnline', (userId) => {
        onlineUsers[userId] = socket.id;  // userId'yi socket.id ile eşleştir
        console.log(`${userId} aktif oldu`);        
    });

    socket.on('friendRequest', (senderId, receiverId) => {
      if (onlineUsers[receiverId]) {
        io.to(onlineUsers[receiverId]).emit('friendRequestNotification', senderId);
        console.log(`Aktif kullanıcıya bildirim gönderildi: ${receiverId}`);
      } else {
        console.log(`${receiverId} şu anda çevrimdışı, bildirim önümüzdeki bağlantısında görünecek.`);
      }
    });

    socket.on("sendAcceptOrDecNotificationToUser",(senderId,receiverId)=>{
      if(onlineUsers[receiverId]){
        console.log(senderId,receiverId);
      io.to(onlineUsers[receiverId]).emit("sendReceiverIdToUser",receiverId);
      console.log(`notification sended to ${receiverId}`);
      }
      else{
        console.log(`${receiverId} now is offline`);
      }
      
    })

    // Kullanıcı bağlantıyı kestiğinde
    socket.on('disconnect', () => {
        // Bağlantıyı kesen kullanıcıyı aktif listeden sil
        for (let userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                console.log(`${userId} çıkış yaptı`);
                break;
            }
        }
    });
});

// Diğer API endpoint'leriniz burada olacak

server.listen(3001, () => {
    console.log('Sunucu 3001 portunda çalışıyor');
});
