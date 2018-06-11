const moment = require('moment');

var messages = (from,text) => {
    return {
        from,
        text,
        createAt : moment().format('h:mm a')
    }
}

var generateLocationMessage = (from,latitude,longitude) => {
    return {
        from,
        url : `https://www.google.com/maps?q=${latitude},${longitude}`,
        createAt: moment().format('h:mm a') 
    }
}

module.exports = {
    generateMessage:messages,
    generateLocationMessage
};