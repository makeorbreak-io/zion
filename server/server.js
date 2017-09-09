'use strict';

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const Wrapper = require('./wrapper.js');

const router = express.Router();

const client_id = "ef3393f29a2d47eaa662d0e913abcef5";
const client_secret = "05438ca3a01845f59ce0f3bafdfd1f48";
let redirect_uri = "http://138.68.143.160:8000/callback"; //TEM QUE SE MUDAR AO DESPOIS

const app = express();

router.use(function(req, res, next) {
    console.log("passei por aqui");
    next();
});


app.use(express.static(__dirname + '/public'))
    .use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.route('/login')
    .get(function(req, res) {
        var state = generateRandomString(16);
        res.cookie(stateKey, state);

        // your application requests authorization
        var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private user-read-playback-state user-modify-playback-state user-read-currently-playing';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            }));
    });

var stateKey = 'spotify_auth_state';

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


/* Session-related endpoints */

router.route('/callback')
    .get(function(req, res) {
        if (!req.query.code) {
            res.status(400);
            res.json({ 'error': 'No code in request params' });
        }

        if (!req.query.state) {
            res.status(400);
            res.json({ 'error': 'No state in request params' });
        }

        let code = req.query.code;

        console.log("CODE CRL: " + req.query.code);

        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                Wrapper.receiveCallback(access_token, refresh_token, function(user) {
                    res.redirect('/#' +
                        querystring.stringify({
                            sessioncode: user.scode
                        }));
                });
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });

    });

router.route('/validatesession')
    .post(function(req, res) {
        if (!req.body.code) {
            res.status(400);
            res.json({ 'error': 'No code in request body' });
        }

        let code = req.body.code;

        var sessionId;

        Wrapper.validateSession(code, function(id) {
            console.log("ID:" + id);

            if (id) {
                res.status(200);
                res.json({ 'sessionId': id, 'code': code });
            } else {
                res.status(400);
                res.json({ 'error': 'No session found with this code', 'code': code });
            }
        });

    });

router.route('/clientcode')
    .get(function(req, res) {
        if (!req.query.sessId) {
            res.status(400);
            res.json({ 'error': 'No session ID in request params' });
        }

        let sessId = req.query.sessId;

        Wrapper.generateCode(sessId, function(newCode) {
            console.log("Code " + newCode);

            if (newCode) {
                res.status(200);
                res.json({ 'code': newCode, 'sessId': sessId });
            } else {
                res.status(400);
                res.json({ 'error': 'No session found with this sessionId', 'sessId': sessId });
            }

        });
    });

router.route('/debt')
    .get(function(req, res) {
        if (!req.query.code) {
            res.status(400);
            res.json({ 'error': 'No code in request params' });
        }

        let code = req.query.code;

        Wrapper.getDebt(code, function(debt) {
            if (!isNaN(debt)) {
                res.status(200);
                res.json({ 'code': code, 'debt': debt });
            } else {
                res.status(400);
                res.json({ 'error': 'Error processing client\'s debt', 'code': code });
            }
        })
    });

/* Client-related endpoints */

router.route('/validatecode')
    .get(function(req, res) {
        if (!req.query.code) {
            res.status(400);
            res.json({ 'error': 'No code in request params' });
        }

        let code = req.query.code;

        Wrapper.validateCode(code, function(codeId) {
            if (codeId) {
                res.status(200);
                res.json({ 'codeId': codeId, 'code': code });
            } else {
                res.status(400);
                res.json({ 'error': 'The code provided is unavailable', 'code': code });
            }
        })
    });

router.route('/search')
    .get(function(req, res) {
        if (!req.query.query) {
            res.status(400);
            res.json({ 'error': 'No search query in request params' });
            return;
        }

        if (!req.query.id) {
            res.status(400);
            res.json({ 'error': 'No codeId in request params' });
            return;
        }
        console.log("searching...");

        let searchQuery = req.query.query;
        let id = req.query.id;

        Wrapper.search(searchQuery, id, function(results) {
            if (results) {
                res.status(200);
                res.json({ 'results': results, 'query': searchQuery });
            } else {
                res.status(400);
                res.json({ 'error': 'There was an error searching for songs' });
            }
        });

    });

router.route('/bid')
    .post(function(req, res) {
        if (!req.body.cid) {
            res.status(400);
            res.json({ 'error': 'No codeId in request params' });
        }

        if (!req.body.sid) {
            res.status(400);
            res.json({ 'error': 'No songId in request params' });
        }

        if (!req.body.amount) {
            res.status(400);
            res.json({ 'error': 'No amount in request params' });
        }

        let cid = req.body.cid;
        let sid = req.body.sid;
        let amount = req.body.amount;

        Wrapper.bid(cid, sid, amount, function(result) {
            if (result) {
                res.status(200);
                res.json({});
            } else {
                res.status(400);
                res.json({});
            }
        });
    })

.get(function(req, res) {
    if (!req.query.cid) {
        res.status(400);
        res.json({ 'error': 'No codeId in request params' });
    }

    let cid = req.query.cid;

    Wrapper.getBids(cid, function(bids) {
        if (bids != null) {
            res.status(200);
            res.json({ 'bids': bids });

        } else {
            res.status(400);
            res.json({ 'error': 'Error retireving bids for current round' });
        }
    });
});


router.route('/test')
    .get(function(req, res) {
        res.status(418);
        res.json({ 'ola': 'biba' });

    });

app.use('/', router);
console.log("ready");
app.listen(8000);
