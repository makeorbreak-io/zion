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

    //callback receives double representing total debt in euros
    static getDebt(codeId, callback) {
        Bid.getDebt(codeId, callback);
    }

    //callback receives codeId
    static validateCode(code, callback) {
        Code.validateCode(code, callback);
    }

    //callback receives a list of songs
    static search(query, codeId, callback) {
        Code.getUserId(codeId, function(userId) {
            User.getToken(userId, function(token) {
                var songs = [];

                //TODO: spotify search

                callback(songs);
            });
        });
    }

    //return a bid
    static bid(codeId, songId, amount, callback) {
        Bid.bid(codeId, songId, amount, callback);
    }

    //callback receives a list of Bids
    static getBids(codeId, callback) {
        Bid.getBids(codeId, callback);
    }
}

module.exports = Wrapper;