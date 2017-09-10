var Wrapper = require('./wrapper.js');
var User = require('./classes/user.js');
var Code = require('./classes/code.js');
var Spotify = require('./classes/spotify.js');


Wrapper.validateSession(process.argv[2], function(userId) {
    Wrapper.generateCode(userId, function(code) {
        console.log("here's your code: " + code);
    });
});