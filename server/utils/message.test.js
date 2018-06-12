let expect = require('expect');
const {generateMessage,generateLocationMessage} = require('./message');

describe('generate Message',() => {
    it('should generate correct message', () => {
        let from,text;
        from = "kira";
        text = "I am kira";
        var message = generateMessage (from,text);
        expect(message.createAt).toBeA('string');
        expect(message).toInclude({
            from,
            text
        })
    }) 
});


describe('generate location',() => {
    it('should generate location and link', () => {
        let from,url,date,latitude,longitude;
        latitude = 23.770622200000002;
        longitude = 90.3979445;
        from = "admin";

        var location = generateLocationMessage(from,latitude,longitude);
        expect(location.createAt).toBeA('string');
        expect(location).toInclude({
            from,
            url: `https://www.google.com/maps?q=${latitude},${longitude}`
        })

    }) 
})