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
    static insertNew(codeId, songId, amount, roundId, callback) {
        Code.getUserId(codeId, function(userId) {
            var b = new Bid(0, codeId, codeId, amount, 0, roundId);
            //insert into db
            dbcon.query('INSERT INTO bids SET ?', { codeId: b.codeId, songId: b.songId, amount: b.amount, roundId: b.roundId }, function(err, result) {
                if (err) throw err;
                b.codeId = result.insertId;
                User.load(userId, function(u) {
                    if (u == false) {
                        console.log("user load returned false");
                        return;
                    }
                    u.notifyWebSocket(JSON.stringify(this));
                    callback(b);
                });
            });
        });

    }

    //posts a bid, 
    static bid(codeId, songId, amount, callback) {
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
                        Bid.insertNew(codeId, songId, amount, roundId, callback); //insert bid
                    });
                } else {
                    //if an open round exists -> use
                    roundId = result[0].roundId;
                    Bid.insertNew(codeId, songId, amount, roundId, callback); //insert bid
                }

            });
        });
    }

    //callback receives debt
    static getDebt(codeId, callback) {
        dbcon.query("SELECT amount, roundId FROM bids WHERE codeId = ? ORDER BY roundId, amount DESC", [codeId], function(err, result, fields) {
            if (err) throw err;
            var checkedRounds = [];
            var debt = 0;
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