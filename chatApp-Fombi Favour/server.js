var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)
app.get('/chat', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) =>{
    console.log("User Online");

    socket.on("codeboard-message", (msg) =>{
        console.log("Message received : " + msg);
        socket.broadcast.emit("codeboard-message-broadcasted", msg);
    })
})

var server_port = process.env.PORT || 3000
http.listen(server_port);
