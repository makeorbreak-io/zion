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
let redirect_uri = "http://localhost:8888/callback"; //TEM QUE SE MUDAR AO DESPOIS

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
  .get(function(req, res){
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';
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

            Wrapper.receiveToken(access_token, refresh_token, function(user){
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

        let code = res.query.code;

        //TODO: get client's debt from DB

        res.status(200);
        res.json({ 'code': code, 'debt': 'UnDeR CoNsTrUcTiOn' });
    });

/* Client-related endpoints */

router.route('/validatecode')
    .get(function(req, res) {
        if (!req.query.code) {
            res.status(400);
            res.json({ 'error': 'No code in request params' });
        }

        let code = res.query.code;

        //TODO: get client's codeId from DB

        res.status(200);
        res.json({ 'codeId': 'UnDeR CoNsTrUcTiOn' });
    });

router.route('/search')
    .get(function(req, res) {
        if (!req.query.query) {
            res.status(400);
            res.json({ 'error': 'No search query in request params' });
        }

        if (!req.query.id) {
            res.status(400);
            res.json({ 'error': 'No codeId in request params' });
        }

        let searchQuery = req.query.query;
        let id = req.query.id;

        //TODO: Search for songs with spotify api

        res.status(200);
        res.json({ results: [] })

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

        let cid = request.body.cid;
        let sid = request.body.sid;
        let amount = request.body.amount;

        //TODO: Place bid in DB

        res.status(200)
    });


router.route('/test')
    .get(function(req, res) {
        res.status(418);
        res.json({ 'ola': 'biba' });

    });

app.use('/', router);
console.log("ready");
app.listen(8888);
