'use strict';


var User = require('./user.js');
const request = require('request'); // "Request" library

class Spotify {
    constructor(token, refreshToken, userId) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId; //does not go into database
    }

    search(q, callback) {
        if (this.q == undefined) {
            this.q = q;
        }
        var authOptions = {
            url: 'https://api.spotify.com/v1/search',
            qs: {
                q: this.q,
                type: "album,track,playlist,artist",
                grant_type: 'authorization_code'
            },
            headers: {
                //'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                'Authorization': 'Bearer ' + this.token
            }
        };
        request.get(authOptions, function(error, response, body) {
            //console.log(JSON.stringify(response));
            if (!error && response.statusCode === 200) {
                callback(response);
            } else {
                Spotify.testToken(response, function() {
                    Spotify.search(q, callback);
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
                        'Authorization': 'Basic ' + (new Buffer(user.client_id + ':' + user.client_secret).toString('base64'))
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