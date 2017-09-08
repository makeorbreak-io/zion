'use strict';

var dbcon = require('./dbcon.js');

class User {
    constructor(userId, token, refreshToken, port, scode) {
        this.userId = userId;
        this.token = token;
        this.refreshToken = refreshToken;
        this.port = port;
        this.scode = scode;
    }

    static insertNew(token, refreshToken, callback) {
        var u = new User(0, token, refreshToken, 0);
        u.scode = User.generateCode();
        //insert into db
        u.port = User.getNextPort(function(port) {
            u.port = port;
            dbcon.query('INSERT INTO users SET ?', { token: u.token, refreshToken: u.refreshToken, port: u.port, scode: u.scode }, function(err, result) {
                if (err) throw err;
                u.userId = result.insertId;
                callback(u);
            });

        });
    }

    static getNextPort(callback) {
        dbcon.query("SELECT MAX(port) as port FROM users", function(err, result, fields) {
            if (err) throw err;
            var port = result[0].port;
            if (port < 8000) {
                port = 8001;
            }
            callback(port + 1);
        });
    }

    static generateCode() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    static validateSession(scode, callback) {
        dbcon.query("SELECT userId FROM users WHERE scode = ?", [scode], function(err, result, fields) {
            if (err) throw err;
            console.log(result);
            if (result.length == 0) {
                callback(false);
                return;
            }
            callback(result[0].userId);
        });
    }
}

module.exports = User;