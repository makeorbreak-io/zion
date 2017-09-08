'use strict';

var dbcon = require('./dbcon.js');

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
            callback(b);
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