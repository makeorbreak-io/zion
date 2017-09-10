'use strict';

var dbcon = require('./dbcon.js');
var Code = require('./code.js');
var User = require('./user.js');

class Bid {
    constructor(bidId, codeId, songId, amount, timestamp, roundId) {
        this.bidId = bidId;
        this.codeId = codeId;
        this.songId = songId;
        this.amount = amount;
        this.timestamp = timestamp;
        this.roundId = roundId;
    }

    //userId is optional
    static insertNew(codeId, songId, amount, roundId, title, artist, callback) {
        Code.getUserId(codeId, function(userId) {
            var b = new Bid(0, codeId, songId, amount, 0, roundId);
            //insert into db
            dbcon.query('INSERT INTO bids SET ?', { codeId: b.codeId, songId: b.songId, amount: b.amount, roundId: b.roundId }, function(err, result) {
                if (err) throw err;
                b.bidId = result.insertId;
                User.load(userId, function(u) {
                    if (u == false) {
                        console.log("user load returned false");
                        return;
                    }
                    b.title = title;
                    b.artist = artist;
                    u.notifyWebSocket(JSON.stringify({ action: "bid", data: b, type: "bid" }));
                    callback(b);
                });
            });
        });

    }

    static getBestBid(roundId, callback) {
        dbcon.query("SELECT * FROM bids WHERE roundId = ? ORDER BY bidId DESC LIMIT 1", [roundId], function(err, result, fields) {
            if (err) throw err;
            var roundId;
            if (result.length == 0) {
                callback(false);
            } else {
                callback(new Bid(result[0].bidId, result[0].codeId, result[0].songId, result[0].amount, result[0].roundId));
            }

        });
    }

    //posts a bid, 
    static bid(codeId, songId, amount, title, artist, callback) {
        //try to get an open round
        Code.getUserId(codeId, function(userId) {
            dbcon.query("SELECT roundId FROM rounds WHERE userId = ? AND start < NOW() AND NOW() < end LIMIT 1", [userId], function(err, result, fields) {
                if (err) throw err;
                var roundId;
                if (result.length == 0) {
                    //if not, create a new round, setting the end timeout
                    dbcon.query('INSERT INTO rounds SET userId = ?, end = CURRENT_TIMESTAMP + INTERVAL 120 SECOND', [userId], function(err, result) {
                        if (err) throw err;
                        roundId = result.insertId;
                        Bid.insertNew(codeId, songId, amount, roundId, title, artist, callback); //insert bid

                        dbcon.query("SELECT end FROM rounds WHERE roundId = ? LIMIT 1", [roundId], function(err, result, fields) {
                            if (err) throw err;
                            if (result.length == 0) {
                                callback(false);
                                return;
                            }
                            User.load(userId, function(u) {
                                //tell the websocket manager to take control of the time for this round
                                var end = (new Date(Date.parse(result[0].end)).getTime() / 1000);
                                u.notifyWebSocket(JSON.stringify({ action: "round", type: "round", data: { roundId: roundId, end: end } }));
                            });
                        });

                    });

                } else {
                    //if an open round exists -> use
                    roundId = result[0].roundId;
                    Bid.insertNew(codeId, songId, amount, roundId, title, artist, callback); //insert bid
                }

            });
        });
    }

    //callback receives debt
    static getDebt(code, callback) {
        dbcon.query("SELECT amount, roundId FROM bids WHERE codeId = (SELECT codeId FROM codes WHERE code = ?) ORDER BY roundId, amount DESC", [code], function(err, result, fields) {
            if (err) throw err;
            var checkedRounds = [];
            let debt = 0;
            result.forEach(function(element) {
                if (checkedRounds.indexOf(element.roundId) == -1) {
                    debt += element.amount;
                    checkedRounds.push(element.roundId);
                }
            }, this);
            callback(debt);
        });
    }

    static getBids(codeId, callback) {
        Code.getUserId(codeId, function(userId) {
            console.log(codeId);
            dbcon.query("SELECT * FROM bids WHERE roundId = (SELECT roundId FROM rounds WHERE userId = ? AND start < NOW() AND NOW() < end LIMIT 1) ORDER BY amount DESC", [userId], function(err, result, fields) {
                if (err) throw err;
                var roundId;
                if (result.length == 0) {
                    callback(false);
                    return;
                }
                var bids = result.map(function(e) {
                    return new Bid(e.bidId, e.codeId, e.songId, e.amount, e.timestamp, e.roundId);
                });
                callback(bids);
            });
        });
    }
}

module.exports = Bid;