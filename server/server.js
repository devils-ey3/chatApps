const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io')
const publicPath = path.join(__dirname, '../public');
const validation = require('./utils/validation');

const app = express();
const server = http.createServer(app);
const {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');


app.use(express.static(publicPath));

// Make communication between server and client 
var io = socketIO(server);

io.on('connection', (socket) => {
    // console.log("New user connected");

    socket.on('join', (params, callback) => {
        if (!validation.isRealString(params.name) || !validation.isRealString(params.room)) {
            callback('Name and room name are required');
        }
        socket.join(params.room);
        // socket.leave('The Office Fans');

        // io.emit -> io.to('The Office Fans').emit
        // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
        // socket.emit

        socket.emit('autoReply', generateMessage('ADMIN', 'Wellcome to chat'));
        socket.broadcast.to(params.room).emit('autoReply',generateMessage("ADMIN",`User <b>${params.name}</b> has join this room`));

        callback();
    })



    socket.on('disconnect', () => {
        console.log('Disconnected from server node');
    });

    socket.on('getMessage', (message, clearTextBox) => {
        // console.log("Data from client ",message);
        // socket.broadcast.emit('newMessage',message);

        io.emit('newMessage', message);
        clearTextBox();
    });

    socket.on('createLocation', (coords) => {
        // console.log(generateLocationMessage ('admin',coords.latitude,coords.longitude));
        io.emit('newLocationMessage', generateLocationMessage('admin', coords.latitude, coords.longitude));
    })


});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('App listening on port ' + port);
});