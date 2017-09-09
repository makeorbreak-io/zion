'use strict';

var dbcon = require('./dbcon.js');

class Bid {
    constructor(bidId, codeId, songId, amount, timestamp, roundID) {
        this.bidId = bidId;
        this.codeId = codeId;
        this.songId = songId;
        this.amount = amount;
        this.timestamp = timestamp;
        this.roundID = roundID;
    }

    static insertNew(codeId, songId, amount, roundId, callback) {
        var b = new Bid(0, codeId, codeId, amount, 0, roundId);
        //insert into db
        dbcon.query('INSERT INTO bids SET ?', { codeId: b.codeId, songId: b.songId, amount: b.amount }, function(err, result) {
            if (err) throw err;
            b.codeId = result.insertId;
            callback(b);
        });
    }

    static getDebt(codeId, callback) {
        dbcon.query("SELECT amount, roundId FROM bids WHERE codeId = ?", [codeId], function(err, result, fields) {
            if (err) throw err;
            result.forEach(function(element) {

            }, this);
        });
    }

}

module.exports = Bid;