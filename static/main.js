const socket = io();
console.log('ll');
socket.on('connection', () => {
    console.log('connected');
});