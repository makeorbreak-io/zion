const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const router = express.Router();

const app = express();

router.use(function(req, res, next){
  console.log("passei por aqui");
  next();
});


app.use(express.static(__dirname + '/public'))
   .use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/* Session-related endpoints */

router.route('/callback')
  .get(function(req, res){
    if(!req.query.code){
      res.status(400);
      res.json({'error': 'No code in request params'});
    }

    if(!req.query.state){
      res.status(400);
      res.json({'error': 'No state in request params'});
    }

    let code = req.query.code;

    //TODO: Get tokens from spotify api

  });

router.route('/validatesession')
  .post(function(req, res){
    if(!req.body.code){
      res.status(400);
      res.json({'error': 'No code in request body'});
    }

    //console.log(req.body);

    let code = req.body.code;

    //TODO: Validate in DB

    res.status(200);
    res.json({'sessionId': 'UnDeR CoNsTrUcTiOn', 'code': code});

  });

router.route('/clientcode')
  .get(function(req, res){
    if(!req.query.sessId){
      res.status(400);
      res.json({'error': 'No session ID in request params'});
    }

    let sessId = req.query.sessId;

    //TODO: Generate a unique, not in use code

    res.status(200);
    res.json({'code': 'UnDeR CoNsTrUcTiOn', 'sessId': sessId});

  });

router.route('/debt')
  .get(function(req, res){
    if(!req.query.code){
      res.status(400);
      res.json({'error': 'No code in request params'});
    }

    let code = res.query.code;

    //TODO: get client's debt from DB

    res.status(200);
    res.json({'code': code, 'debt': 'UnDeR CoNsTrUcTiOn'});
  });

/* Client-related endpoints */

router.route('/validatecode')
  .get(function(req, res){
    if(!req.query.code){
      res.status(400);
      res.json({'error': 'No code in request params'});
    }

    let code = res.query.code;

    //TODO: get client's codeId from DB

    res.status(200);
    res.json({'codeId': 'UnDeR CoNsTrUcTiOn'});
  });

router.route('/search')
  .get(function(req, res){
    if(!req.query.query){
      res.status(400);
      res.json({'error': 'No search query in request params'});
    }

    if(!req.query.id){
      res.status(400);
      res.json({'error': 'No codeId in request params'});
    }

    let searchQuery = req.query.query;
    let id = req.query.id;

    //TODO: Search for songs with spotify api

    res.status(200);
    res.json({results: []})

  });

reouter.route('/bid')
  .post(function(req, res){
    if(!req.body.cid){
      res.status(400);
      res.json({'error': 'No codeId in request params'});
    }

    if(!req.body.sid){
      res.status(400);
      res.json({'error': 'No songId in request params'});
    }

    if(!req.body.amount){
      res.status(400);
      res.json({'error': 'No amount in request params'});
    }

    let cid = request.body.cid;
    let sid = request.body.sid;
    let amount = request.body.amount;

    //TODO: Place bid in DB

    res.status(200)
  });


router.route('/test')
  .get(function(req, res){
    res.status(418);
    res.json({'ola': 'biba'});

});

app.use('/', router);
console.log("ready");
app.listen(8888);
