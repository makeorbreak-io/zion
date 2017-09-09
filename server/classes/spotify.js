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
        this.playlistId = undefined; //does not go into database
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

    getUserId(callback) {
        var t_token = this.token;
        console.log("getuser: " + t_token);
        var authOptions = {
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + t_token
            }
        };
        request.get(authOptions, function(error, response, body) {
            var b = JSON.parse(body);
            if (!error && response.statusCode === 200) {
                console.log("USERID: " + b.id);
                callback(b.id);
            } else {
                callback(false);
            }
        });
    }
    createPlayList(callback) {
        var t_token = this.token;
        console.log(t_token);
        if (this.playlistId != undefined) {
            callback(this.playlistId);
            return;
        }
        var name = "jukibify";
        this.getUserId(function(spotify_user_id) {
            var authOptions = {
                url: 'https://api.spotify.com/v1/users/' + spotify_user_id + '/playlists',
                body: JSON.stringify({
                    name: name
                }),
                headers: {
                    'Authorization': 'Bearer ' + t_token,
                    'Content-Type': 'application/json'
                }
            };
            request.post(authOptions, function(error, response, body) {
                var b = JSON.parse(body);
                console.log("request playlist id: " + b.id);
                if (!error && response.statusCode === 201) {
                    callback(b.id); //playlistId
                } else {
                    callback(false);
                }
            });
        });
    }
    addTracksToPlaylist(playListId, songs, callback) {
        var t_token = this.token;
        this.getUserId(function(spotify_user_id) {
            var authOptions = {
                url: 'https://api.spotify.com/v1/users/' + spotify_user_id + '/playlists/' + playListId + '/tracks',
                body: {
                    uris: JSON.stringify(songs)
                },
                headers: {
                    'Authorization': 'Bearer ' + t_token,
                    'Content-Type': 'application/json'
                }
            };
            request.post(authOptions, function(error, response, body) {
                console.log(response);
                if (!error && response.statusCode === 201) {
                    callback(true); //playlistId
                } else {
                    callback(false);
                }
            });
        });
    }

    static testToken(response, callback) {
        if (response.statusCode == "401") { //token expired -> get new
            console.log("refreshToken!!!!!!!!!!!!");
            User.load(this.userId, function(user) {
                var authOptions = {
                    url: 'https://accounts.spotify.com/api/token',
                    body: {
                        grant_type: "refresh_token",
                        refresh_token: user.refreshToken
                    },
                    headers: {
                        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                    }
                };
                request.get(authOptions, function(error, response, body) {
                    var b = JSON.parse(body);
                    //console.log(JSON.stringify(response));
                    if (!error) {
                        User.update(user.userId, b.access_token);
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