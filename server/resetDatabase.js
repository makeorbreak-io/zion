var Wrapper = require('./wrapper.js');
var User = require('./classes/user.js');
var Code = require('./classes/code.js');
var Spotify = require('./classes/spotify.js');



Wrapper.resetDatabase(function() {
    console.log("DATABASE CLEARED!");
});