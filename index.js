const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.send("SERVER IS RUNNING!");
});

io.on('connection', (socket) => {
    chatID = socket.handshake.query.chatID;
    socket.join(chatID);

    console.log('connected!');

    // Leave chat if disconnected
    socket.on('disconnect', () => {
        socket.leave(chatID);
    });

    // Send message to an user
    socket.on('sendMessage', message => {
        receiverChatID = message.chatID;
        senderChatID = message.senderChatID;
        content = message.content;
        
        // Send message to a room
        socket.in(receiverChatID).emit('receiveMessage', {
            'content': content,
            'senderChatID': senderChatID,
            'receiverChatID': receiverChatID
        });
    });
    
});

server.listen(process.env.PORT || 3000);