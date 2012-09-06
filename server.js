var express = require('express');
var app = express();
var models = require('./lib/models');
var async = require('async');

var info = require('./package.json');

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

//app.get('/', function(req, resp) {
  //resp.render('layout', {version: info.version});
//});


app.get('/everything.json', function(req, resp) {

  models.Song.find(function(err, songs) {
    if (err) throw err;
    resp.json({songs: songs});
  });

});

var port = process.env.PORT || 3333;
app.listen(port);
console.log('Listening on port', port);
