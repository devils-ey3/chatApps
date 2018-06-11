const socket = io();
socket.on('connect', () => {
    socket.on('autoReply', (data) => {
        $('#message').append(`<li>${data.from} ${moment().format('h:mm a')} : ${data.text}</li>`);
    })
});

socket.on('disconnect', () => {
    console.log('Disconnected from server html');
});


socket.on('newMessage', (message) => {
    // console.log("Message from server ", message);
    $('#message').append(`<li>${message.from} ${message.createAt} : ${message.text}</li>`);
});

socket.on('newLocationMessage', (message) => {
    // console.log("Message from server ", message);
    $('#message').append(`<li>${message.from} ${message.createAt} : <a href=${message.url} target="_blank">Location</a> </li>`);
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

$('#message-form').on('submit', (event) => {
    event.preventDefault();
    console.log();

    socket.emit('getMessage', {
        "from": "kira",
        "text": $('#message-form > input[type="text"]').val(),
        "createAt": moment().format('h:mm a')

    }, (arguments) => {
        $('#message-form > input[type="text"]').val("");
    })

});


let locationButton = $('#location');
locationButton.on('click', (arguments) => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by browser");
    }

    locationButton.attr('disabled', 'disabled').text('Sending location.....');
    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Send Geolocation');
        socket.emit('createLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    }, () => {
        locationButton.removeAttr('disabled').text('Send Geolocation');
        alert('Unable to fetch location');
    })
})