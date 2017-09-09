'use strict';


var User = require('./user.js');
const request = require('request'); // "Request" library

class Spotify {
    constructor(token, refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }

    search(q, callback) {
        var authOptions = {
            url: 'https://api.spotify.com/v1/search',
            qs: {
                q: q,
                type: "album,track,playlist,artist",
                grant_type: 'authorization_code'
            },
            headers: {
                //'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                'Authorization': this.token
            }
        };
        request.get(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(JSON.stringify(response));
                callback(response);
            } else {
                callback([]);
            }
        });
    }
}