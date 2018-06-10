let expect = require('expect');
var generateMessage = require('./message');

describe('generate Message',() => {
    it('should generate correct message', () => {
        let from,text;
        from = "kira";
        text = "I am kira";
        var message = generateMessage (from,text);
        expect(message.date).toBeA('number');
        expect(message).toInclude({
            from,
            text
        })
    }) 
})