const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');
const socketio = require('socket.io');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('Someone connected');
  socket.emit('connection-message', 'Добро пожаловать в Коп Суйлобо!');

  socket.on('send-message', message => {
    senderID = message.senderID;
    senderName = message.senderName;
    receiverID = message.receiverID;
    text = message.text;

    message = {
      'sender-id': senderID,
      'receiver-id': receiverID,
      'text': text
    };

    socket.to(receiverID).emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log("Someone disconnected");
  });
});

dotenv.config();

server.listen(PORT, console.log(`Server running on PORT: ${PORT}`));