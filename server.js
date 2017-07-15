// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongodb=require('mongodb');
var mongo=mongodb.MongoClient;

var url= "mongodb://porock:samu@ds034797.mlab.com:34797/urls";
function rand(){
  return Math.random().toString(36).slice(2, 6);
};

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/new/:url*', function(req,res){
  mongo.connect(url, function(err, db){
    if(err) throw err;
    var data = {
      'original_url': req.params.url+req.params[0],
      'short_url': "https://url-shortener-ik.glitch.me/"+rand()
    }
    
    db.collection('urls').insert(data, function(err, b){
      if(err) throw err;
      res.send(JSON.stringify({'original_url': data.original_url,
                              'short_url': data.short_url}));
      db.close();
    })
  });
});

app.get('/:param', function(req, res){
  mongo.connect(url, function( err, db){
    if(err) throw err;
    db. collection('urls').find({
      short_url: "https://url-shortener-ik.glitch.me/"+req.params.param
    }).toArray(function (err, doc){
      if (err) throw err;
      res.redirect(doc[0].original_url);
      db.close();
    })
  })
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
