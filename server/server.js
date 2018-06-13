const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io')
const publicPath = path.join(__dirname, '../public');

const validation = require('./utils/validation');
const {Users} = require('./utils/users');
var users = new Users();

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
    // socket.emit('roomList',{ hello: 'world' });
    
    socket.on('join', (params, callback) => {
        if (!validation.isRealString(params.name) || !validation.isRealString(params.room)) {
            return callback('Name and room name are required');
        }
        if (users.getUserList(params.room).includes(params.name)){
            return callback('User is exits in the room');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));

        // socket.leave('The Office Fans');

        // io.emit -> io.to('The Office Fans').emit
        // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
        // socket.emit

        socket.emit('autoReply', generateMessage('ADMIN', 'Wellcome to chat'));
        socket.broadcast.to(params.room).emit('autoReply',generateMessage("ADMIN",`User ${params.name} has join this room`));

        callback();
    })



    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('autoReply',generateMessage("ADMIN",`User ${user.name} has left this room`));
        }
    });

    socket.on('getMessage', (message, clearTextBox) => {
        // console.log("Data from client ",message);
        // socket.broadcast.emit('newMessage',message);
        const user = users.getUser(message.from);

        msg = {
            from : user.name,
            createAt : message.createAt,
            text : message.text
        }

        io.to(user.room).emit('newMessage', msg);
        clearTextBox();
    });


    socket.on('createLocation', (coords) => {
        // console.log(generateLocationMessage ('admin',coords.latitude,coords.longitude));
        const user = users.getUser(socket.id);
        io.to(user.room).emit('newLocationMessage', generateLocationMessage('admin', coords.latitude, coords.longitude));
    })

//    console.log(findRooms());
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('App listening on port ' + port);
});

function findRooms() {
    var availableRooms = [];
    var rooms = io.sockets.adapter.rooms;
    if (rooms) {
        for (var room in rooms) {
            if (!rooms[room].hasOwnProperty(room)) {
                availableRooms.push(room);
            }
        }
    }
    return availableRooms;
}