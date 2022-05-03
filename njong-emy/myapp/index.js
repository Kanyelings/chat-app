const express = require('express');
const app = express(); /*Express initializes app to be a fucntion handler */
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', function (req, res) {
    res.sendFile(__dirname + 'index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
});

server.listen(3000, function () {
    console.log('Listening on *:3000');
})