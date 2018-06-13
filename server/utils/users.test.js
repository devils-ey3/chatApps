let expect = require('expect');
const users = require('./users');

describe('User', () => {
    var seedUser;
    seedUser = new users.Users();
    beforeEach(() => {
        seedUser.users = [{
            id: "1",
            name: "Mike",
            room: "Nothing gonna change"
        }, {
            id: "2",
            name: "Kill",
            room: " gonna change"
        }, {
            id: "3",
            name: "You",
            room: "node"
        }, {
            id: "4",
            name: "Boss",
            room: "node"
        }]

    })

    it('User should created', () => {
        var user;
        user = {
            id: "123",
            name: "abid",
            room: "Devils-ey3"
        }
        var obj = new users.Users();
        expect(obj.addUser(user.id, user.name, user.room)).toInclude(user);

    })

    it('should reutrn names for node course', () => {
        var userList = seedUser.getUserList('node');
        expect(userList).toEqual([ 'You', 'Boss' ] );
    })

    it('should remove a user', () => {
        let userID = '4';
        var user = seedUser.removeUser(userID);
        expect(user.id).toBe(userID);

    });

    
    it('should not remove a user', () => {
        let userID = '10020';
        var user = seedUser.removeUser(userID);
        expect(user).toNotExist();
    });

    it('should find user', () => {
        let userID = '2';
        var user = seedUser.getUser(userID);
        expect(user.id).toBe(userID);
    });

    it('should not a user', () => {
        let userID = '9';
        var user = seedUser.getUser(userID);
        expect(user).toNotExist(); // undefined

    });



})