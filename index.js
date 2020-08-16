const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.send("SERVER IS RUNNING!");
});

io.on('connection', (socket) => {
    socket.send('Yay!');
    console.log('connected!');
});

server.listen(process.env.PORT || 3000);