'use strict';


var User = require('./user.js');
const request = require('request'); // "Request" library

const client_id = "ef3393f29a2d47eaa662d0e913abcef5";
const client_secret = "05438ca3a01845f59ce0f3bafdfd1f48";

class Spotify {
    constructor(token, refreshToken, userId) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId; //does not go into database
    }

    search(q, attempt, callback, userId) {
        console.log("attempt: " + attempt);
        attempt = parseInt(attempt);
        if (attempt > 3) {
            callback([]);
            return;
        }
        if (this.q == undefined) {
            this.q = q;
        }
        this.userId = userId; //does not go into database
        var spot = this;
        var authOptions = {
            url: 'https://api.spotify.com/v1/search',
            qs: {
                q: this.q,
                type: "album,track,playlist,artist",
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Bearer ' + this.token
            }
        };
        request.get(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                callback(response);
            } else {
                Spotify.testToken(response, function() {
                    spot.search(q, parseInt(parseInt(attempt) + 1), callback);
                });
            }
        });
    }

    static testToken(response, callback) {
        if (response.statusCode == "401") { //token expired -> get new
            console.log("refreshToken!!!!!!!!!!!!");
            User.load(this.userId, function(user) {
                var authOptions = {
                    url: 'https://accounts.spotify.com/api/token',
                    form: {
                        grant_type: "refresh_token",
                        refresh_token: user.refreshToken
                    },
                    headers: {
                        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                    }
                };
                request.get(authOptions, function(error, response, body) {
                    //console.log(JSON.stringify(response));
                    if (!error && response.statusCode === 200) {
                        User.update(user.userId, response.access_token);
                        callback();
                    } else {
                        callback([]);
                    }
                });
            });
        } else {
            callback([]);
        }
    }
}
module.exports = Spotify;