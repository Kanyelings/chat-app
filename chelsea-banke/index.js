let send = document.getElementById("send-button");
let close = document.getElementById("stop-button");
let stat = document.getElementById("status-label");
let message = document.getElementById("message-input");

if (window.WebSocket){
    console.log("browser supports websocket protocol")
    let socket = new WebSocket("ws://localhost:8000");

    let firstMessage = true;
    socket.addEventListener("open", function(){
        console.log("Connected")
        stat.innerHTML = `Connected...`;
    })

    socket.onmessage = function(event){
        if (firstMessage){
            socket.id = event.data;
            document.getElementById("client-id").innerHTML = `id: ${socket.id}`
        }
        else{
            // stat.innerHTML = event.data;
            let incommingMessage = JSON.parse(event.data)[0];
            let senderId = JSON.parse(event.data)[1];

            let elem = document.createElement("div");
            elem.classList.add("carrier");
            elem.innerHTML = `<div class="recieved">${incommingMessage}</div>`;
            document.getElementById("chat").append(elem);
            document.getElementById("chat").scrollTop =  document.getElementById("chat").scrollHeight;
            document.getElementById("client-id").innerHTML = `new message from ${senderId}`
        }
        firstMessage = false;
    }
    socket.onclose = function(event){
        if(event.wasClean){
            stat.innerHTML = `Connection closed normally`;
        }
    }
    send.addEventListener("click", function(){
        if (socket.readyState == WebSocket.OPEN){
            socket.send(JSON.stringify([socket.id, message.value]));
            document.getElementById("client-id").innerHTML = `message sent`
            let elem = document.createElement("div");
            elem.classList.add("carrier");
            elem.innerHTML = `<div class="sent">${message.value}</div>`;
            console.log(elem.firstChild.offsetHeight);
            document.getElementById("chat").append(elem);
            document.getElementById("chat").scrollTop =  document.getElementById("chat").scrollHeight;

            message.value="";
        }
        else{
            stat.innerHTML = `Sorry, could not transmit message. make sure connection is open`;
        }
    })
    close.addEventListener("click", function(){
        if (socket.readyState == WebSocket.OPEN){
            socket.close();
            stat.innerHTML = `connection closed`;     
        }
    })
} 
else{
    console.log("browser does not support websocket protocol")
}
