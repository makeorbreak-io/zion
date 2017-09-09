'use strict';

var dbcon = require('./dbcon.js');
const WebSocket = require('ws');

class User {
    constructor(userId, token, refreshToken, port, scode) {
        this.userId = userId;
        this.token = token;
        this.refreshToken = refreshToken;
        this.port = port;
        this.scode = scode;
        this.webSocket = undefined;
    }

    static load(userId, callback) {
        dbcon.query("SELECT * FROM users WHERE userId = ? LIMIT 1", [userId], function(err, result, fields) {
            if (err) throw err;
            if (result.length == 0) {
                callback(false);
                return;
            }
            var u = new User(result[0].userId, result[0].token, result[0].refreshToken, result[0].port, result[0].scode);
            callback(u);
        });
    }

    static insertNew(token, refreshToken, callback) {
        var u = new User(0, token, refreshToken, 0);
        u.scode = User.generateScode();
        User.getNextPort(function(port) {
            u.port = port;
            //insert into db
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

    static validateSession(scode, callback) {
        dbcon.query("SELECT userId FROM users WHERE scode = ?", [scode], function(err, result, fields) {
            if (err) throw err;
            if (result.length == 0) {
                callback(false);
                return;
            }
            callback(result[0].userId);
        });
    }

    static getToken(userId, callback) {
        dbcon.query("SELECT token FROM users WHERE userId = ?", [userId], function(err, result, fields) {
            if (err) throw err;
            if (result.length == 0) {
                callback(false);
                return;
            }
            callback(result[0].token);
        });
    }

    static generateScode() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    notifyWebSocket(bid) {
        this.webSocket = new WebSocket.Server({ port: this.port });

        this.webSocket.on('connection', function connection(ws) {
            /*ws.on('message', function incoming(message) {
                console.log('received: %s', message);
            });*/
            console.log("WEBSOCKET sending: " + JSON.stringify(bid));
            ws.send(JSON.stringify(bid));
        });
    }
}

module.exports = User;