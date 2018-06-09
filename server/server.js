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
    socket.on('disconnect', () => {
        console.log('Disconnected from server node');
    });

    socket.emit('creatMessage',{
        "from":"kira@server.com",
        "text" : "kirainhere"
    })

    socket.on('getMessage',(data) => {
        console.log("Data from client ",data); 
    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('App listening on port ' + port);
});