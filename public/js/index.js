const socket = io();
socket.on('connect', () => {
    socket.on('autoReply',(data) => {
        $('#message').append(`<li>${data.from} : ${data.text}</li>`);
    })
});

socket.on('disconnect', () => {
    console.log('Disconnected from server html');
});


socket.on('newMessage', (message) => {
    console.log("Message from server ", message);
    $('#message').append(`<li>${message.from} : ${message.text}</li>`);
})

/* 
socket.emit('getMessage', {
    "from": "kira@client.com",
    "text": "kirainhere",
    "creadte" : Date.now()
},() => {
    console.log("Done"); 
})
 */

 $('#message-form').on('submit',(event) => {
     event.preventDefault();
     console.log();

     socket.emit('getMessage',{
         "from": "kira",
         "text" : $('#message-form > input[type="text"]').val(),
         "time" :  new Date().getTime()
         
     },(arguments) => {
        $('#message-form > input[type="text"]').val("");
    })
 });


let locationButton = $('#location');

locationButton.on('click', (arguments) => {
    if (!navigator.geolocation){
        return alert("Geolocation is not supported by browser");
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('createLocation',{
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        });
    },() => {
       alert('Unable to fetch location') 
    })
})