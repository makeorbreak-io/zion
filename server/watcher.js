'use strict';

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

var Wrapper = require('./wrapper.js');

const app = express();

app.get("/", function(req, res) {
    if (!req.query.port) {
        res.status(400);
        res.json({ 'error': 'No port in request parameters' });
        return;
    }
    if (!req.query.message) {
        res.status(400);
        res.json({ 'error': 'No message in request parameters' });
        return;
    }

    newWebSocket(req.query.port, req.query.message);
    res.status(200);
    res.json({ 'port': req.query.port });
});

app.listen(7999);

var sockets = {};

//Websockets
function newWebSocket(port, message) {
    portInUse(port, function(inUse) {
        if (!inUse) {
            const WebSocket = require('ws');

            const wss = new WebSocket.Server({ port: port });

            // Broadcast to all.
            wss.broadcast = function broadcast(data) {
                wss.clients.forEach(function each(client) {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(data);
                    }
                });
            };

            wss.on('connection', function connection(ws) {
                if (sockets.port == undefined) {
                    sockets.port = { wss: wss, resend: [message] };
                } else {
                    sockets.port.resend.push(message);
                }
                ws.on('message', function incoming(message) {
                    console.log('received on port ' + port + ': %s', message);
                    if (message == "getTime") {
                        Wrapper.getRoundTime(port, function(end) {
                            wss.broadcast(JSON.stringify({ type: "time", data: end }));
                        });
                    }
                });

                sockets.port.resend.forEach(function(element) {
                    sockets.port.wss.broadcast(message);
                }, this);

            });

            if (sockets.port == undefined) {
                sockets.port = { wss: wss, resend: [message] };
            } else {
                sockets.port.wss = wss;
            }
        } else {
            if (sockets.port == undefined) {
                console.log("Websocket is undefined");
                sockets.port = { wss: undefined, resend: [message] };
                return;
            }
            try {
                sockets.port.wss.broadcast(message);
            } catch (error) {
                console.log("No clients listening on port");
                sockets.port.resend.push(message);
            }
        }
    });
}


//check if port in use
var net = require('net');

var portInUse = function(port, callback) {
    var server = net.createServer(function(socket) {
        socket.write('Echo server\r\n');
        socket.pipe(socket);
    });

    server.listen(port, '127.0.0.1');
    server.on('error', function(e) {
        callback(true);
    });
    server.on('listening', function(e) {
        server.close();
        callback(false);
    });
};