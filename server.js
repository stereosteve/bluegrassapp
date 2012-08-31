var express = require('express');
var app = express();
var models = require('./lib/models');
var async = require('async');


app.configure(function() {
  app.use(express.static(__dirname + '/public'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.locals.startview = function(name) {
    return '<script type="text/ng-template" id="' + name + '.html">';
  };
  app.locals.endview = '</script>';
  app.locals.manifestTag = '';
});

app.configure('production', function() {
  app.locals.manifestTag = 'manifest="/offline.appcache"';
});

app.get('/', function(req, resp) {
  resp.render('layout');
});


app.get('/everything.json', function(req, resp) {

  var respond = function(err, found) {
    if (err) throw err;
    resp.json({
      artists: found[0],
      songs: found[1]
    });
  };

  async.parallel([
    models.Artist.find.bind(models.Artist),
    models.Song.find.bind(models.Song)
  ], respond);

});

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Listening on port', port);
