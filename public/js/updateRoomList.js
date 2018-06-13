const socket = io();

socket.on('connect', () => {
    socket.on('roomList', (data) => {
        console.log(data);
    });

});