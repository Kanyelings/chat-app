const WebSocketServer = require('ws');
const wss = new WebSocketServer.Server({port: 8000});

wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

wss.on("connection", socket => {
    socket.id = wss.getUniqueID();
    let id =  socket.id;

    console.log("the web socket srerver is running at port 8000");
    socket.send(socket.id);
    console.log(`new client connected with id: ${socket.id}`);

    socket.on("message", data =>{
        let incommingMessage = JSON.parse(data)[1];
        let clientId = JSON.parse(data)[0];
        console.log(`Client with id '${clientId}' sent message '${incommingMessage}'`);	
        wss.clients.forEach(client =>{
            if (client.id != clientId){
                client.send(JSON.stringify([incommingMessage, client.id]));
            }
        })
    });
    socket.on("close", () => {
        console.log(`client with id '${socket.id}' connection closed normally`);
    });
    socket.onerror = function(){
        console.log("an error occured while trying ti close connection");
    };
});