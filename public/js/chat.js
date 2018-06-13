const socket = io();

function scrollToBottom() {
    // Selectors
    var messages = $('#message');
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {
    socket.on('autoReply', (data) => {
        $('#message').append(`
            <div class="message__title">
                <h4>${data.from}</h4>
                <span>${moment().format('h:mm a')}</span>
            </div>
            <div class="message__body">
              <p>${data.text}</p>    
            </div>
        `);
    });
    const params = $.deparam(window.location.search);
    params.room = params.room.toLowerCase();
    
    socket.emit('join', params, (err) => {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {

        }
    })


});

socket.on('disconnect', () => {
    console.log('Disconnected from server html');
});


socket.on('newMessage', (message) => {
    // console.log("Message from server ", message);
    // $('#message').append(`<li>${message.from} ${message.createAt} : ${message.text}</li>`);
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        message
    });

    $('#message').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
    // console.log("Message from server ", message);
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        message
    });

    $('#message').append(html);
    scrollToBottom();

});


socket.on('updateUserList', (users) => {
    var ol = $('<ol></ol>');
    for (const user of users) {
        ol.append($('<li></li>').text(user));
    }
    $('#users').html(ol);
});


$('#message-form').on('submit', (event) => {
    event.preventDefault();
    socket.emit('getMessage', {
        "from": socket.id,
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
