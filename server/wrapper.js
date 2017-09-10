'use strict';

var dbcon = require('./classes/dbcon.js');
var User = require('./classes/user.js');
var Code = require('./classes/code.js');
var Bid = require('./classes/bid.js');
var Spotify = require('./classes/spotify.js');

class Wrapper {
    //callback receives new User 
    static receiveCallback(token, refreshToken, callback) {
        User.insertNew(token, refreshToken, callback);
    }

    //calback receives userId
    static validateSession(scode, callback) {
        User.validateSession(scode, callback);
    }

    //callback receives code
    static generateCode(userId, callback) {
        Code.generateCode(userId, function(c) {
            callback(c.code);
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
            User.getToken(userId, function(t) {
                var s = new Spotify(t.token, t.refreshToken);
                s.search(query, 1, callback, userId);
            });
        });
    }

    //return a bid
    static bid(codeId, songId, amount, title, artist, callback) {
        Bid.bid(codeId, songId, amount, title, artist, callback);
    }

    //callback receives a list of Bids
    static getBids(codeId, callback) {
        Bid.getBids(codeId, callback);
    }

    //returns playlist id
    static createPlayList(codeId, callback) {
        Code.getUserId(codeId, function(userId) {
            User.getToken(userId, function(t) {
                console.log("t is: " + JSON.stringify(t));
                var s = new Spotify(t.token, t.refreshToken);
                s.createPlayList(callback);
            });
        });
    }

    //addTracksToPlay
    static addTracksToPlaylist(codeId, playListId, songs, callback) {
        Code.getUserId(codeId, function(userId) {
            User.getToken(userId, function(t) {
                var s = new Spotify(t.token, t.refreshToken);
                s.addTracksToPlaylist(playListId, songs, callback);
            });
        });
    }

    //callback receives timestamp for the end of the current round
    static getRoundTime(port, callback) {
        dbcon.query("SELECT end FROM rounds WHERE userId = (SELECT userId FROM users WHERE port = ?) AND start < NOW() AND NOW() < end LIMIT 1", [port], function(err, result, fields) {
            if (err) throw err;
            if (result.length == 0) {
                callback(-1);
                return;
            }
            var end = (new Date(Date.parse(result[0].end)).getTime() / 1000);
            callback(end);
        });
    }

    static finishRound(roundId) {
        //getBest song
        dbcon.query("SELECT songId FROM bids WHERE roundId = ? ORDER BY bidId DESC LIMIT 1", [roundId], function(err, result, fields) {
            if (err) throw err;
            if (result.length == 0) {
                return;
            }

            var songId = result[0].songId;
            console.log("finish-> query best song->" + songId);
            dbcon.query("SELECT userId FROM rounds WHERE roundId = ? LIMIT 1", [roundId], function(err, result, fields) {
                if (err) throw err;
                if (result.length == 0) {
                    return;
                }
                var userId = result[0].userId;
                User.load(userId, function(u) {
                    console.log("finish-> user load->" + u.userId);
                    var s = new Spotify(u.token, u.refreshToken, u.userId);
                    s.addTracksToPlaylist(u.playlist, songId, function(res) {
                        console.log("finish->track added: " + res);
                        if (res) {
                            s.disableShuffle(function() {
                                console.log("shuffle disabled");
                            });
                        }
                    });
                });
            });

        });
        //add to playlist

        //disable shuffle


    }


    static resetDatabase(callback) {
        var queries = [
            "TRUNCATE table users",
            "TRUNCATE table bids",
            "TRUNCATE table rounds",
            "TRUNCATE table codes",

            "ALTER TABLE users AUTO_INCREMENT = 1",
            "ALTER TABLE bids AUTO_INCREMENT = 1",
            "ALTER TABLE rounds AUTO_INCREMENT = 1",
            "ALTER TABLE codes AUTO_INCREMENT = 1"
        ];
        queries.forEach(function(element) {
            dbcon.query(element);
        }, this);
        callback();
    }
}

module.exports = Wrapper;