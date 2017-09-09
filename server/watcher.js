'use strict';

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

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
            wss.on('connection', function connection(ws) {
                ws.on('message', function incoming(message) {
                    console.log('received on port ' + port + ': %s', message);
                });
                ws.send(message);
                sockets.port = ws;
            });
        } else {
            sockets.port.send(message);
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