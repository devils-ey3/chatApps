let expect = require('expect');
const validation = require('./validation');

describe('Login in room',() => {
    it('it should return in room', () => {
        let username,roomname;
        username = "doasdpsa";
        roomname = "I am kira";
        var message = validation.isRealString(username) && validation.isRealString(roomname);
        expect(message).toBe(true);
        
    }) 
});


