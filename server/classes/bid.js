'use strict';

var dbcon = require('./dbcon.js');
var Code = require('./code.js');

class Bid {
    constructor(bidId, codeId, songId, amount, timestamp, roundId) {
        this.bidId = bidId;
        this.codeId = codeId;
        this.songId = songId;
        this.amount = amount;
        this.timestamp = timestamp;
        this.roundId = roundId;
    }

    static insertNew(codeId, songId, amount, roundId, callback) {
        var b = new Bid(0, codeId, codeId, amount, 0, roundId);
        //insert into db
        dbcon.query('INSERT INTO bids SET ?', { codeId: b.codeId, songId: b.songId, amount: b.amount }, function(err, result) {
            if (err) throw err;
            b.codeId = result.insertId;
            //TODO: callback for websocket
            callback(b);
        });
    }

    //posts a bid, 
    static bid(codeId, songId, amount, callback) {
        //try to get an open round
        Code.getUserId(codeId, function(userId) {
            dbcon.query("SELECT roundId FROM rounds WHERE userID = ? AND start < NOW() AND NOW() < end LIMIT 1", [userId], function(err, result, fields) {
                if (err) throw err;
                var roundId;
                if (result.length == 0) {
                    //if not, create a new round, setting the end timeout
                    dbcon.query('INSERT INTO rounds SET userId = ?, end = CURRENT_TIMESTAMP + INTERVAL 5 SECOND', [userId], function(err, result) {
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

}

module.exports = Bid;