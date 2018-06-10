const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io')
const publicPath = path.join(__dirname, '../public');


const app = express();
const server = http.createServer(app);
const generateMessage = require('./utils/message');


app.use(express.static(publicPath));

// Make communication between server and client 
var io = socketIO(server);

io.on('connection', (socket) => {
    // console.log("New user connected");
    socket.emit('autoReply',generateMessage('admin','Wellcome to chat'));
    socket.broadcast.emit('autoReply',generateMessage('admin','New user join'));

    socket.on('disconnect', () => {
        console.log('Disconnected from server node');
    });

    socket.on('getMessage',(message,clearTextBox) => {
        // console.log("Data from client ",message);
        // socket.broadcast.emit('newMessage',message);
        io.emit('newMessage',message);
        clearTextBox();
    });

    socket.on('createLocation',(coords) => {
        io.emit('newMessage',generateMessage('admin',`${coords.latitude} , ${coords.longitude}`))
    })

});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('App listening on port ' + port);
});