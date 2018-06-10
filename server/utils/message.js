var messages = (from,text) => {
    return {
        from,
        text,
        date : new Date().getDate()
    }
}

module.exports = messages;