const socket = io();
socket.on('connect', () => {

});

socket.on('disconnect', () => {
    console.log('Disconnected from server html');
});


socket.on('creatMessage', (data) => {
    console.log("Message from server ", data);
})


socket.emit('getMessage', {
    "from": "kira@client.com",
    "text": "kirainhere",
    "creadte" : Date.now()
})