const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io')
const publicPath = path.join(__dirname, '../public');


const app = express();
const server = http.createServer(app);

app.use(express.static(publicPath));

// Make communication between server and client 
var io = socketIO(server);

io.on('connection', (socket) => {
    // console.log("New user connected");
    socket.emit('autoReply',{
        "from" : "admin",
        "Text" : "Welcome to chat"
    })
    socket.broadcast.emit('autoReply',{
        "message" : "New user coonected",
        "joinAt" : new Date().getTime()
    })

    socket.on('disconnect', () => {
        console.log('Disconnected from server node');
    });

    
    socket.on('getMessage',(data) => {
        console.log("Data from client ",data);
        socket.broadcast.emit('creatMessage',data);
    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('App listening on port ' + port);
});