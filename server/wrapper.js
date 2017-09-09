'use strict';

var User = require('./classes/user.js');
var Code = require('./classes/code.js');
var Bid = require('./classes/bid.js');

class Wrapper {
    //callback receives new User 
    static receiveCallback(token, refreshToken, callback) {
        User.insertNew(token, refreshToken, callback);
    }

    //calback receives userId
    static validateSession(scode, callback) {
        User.validateSession(scode, callback);
    }

    //callback receives codeId
    static generateCode(userId, callback) {
        Code.generateCode(userId, function(c) {
            callback(c.codeId);
        });
    }

    //callback receives double representing total in euros
    static getDebt(code, callback) {
        Bid.getDebt(code, callback);
    }
}

module.exports = Wrapper;