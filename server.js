var express = require('express')
  , http = require('http')
  , path = require('path')
  , info = require('./package.json')
  , _ = require('underscore')

var app = express();

//
// Config
//
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.locals.info = info
});
app.configure('development', function(){
  app.locals.manifest = ''
  //app.locals.manifest = 'manifest="/offline.appcache"'
  app.use(express.errorHandler());
});
app.configure('production', function() {
  app.locals.manifest = 'manifest="/offline.appcache"'
})

app.locals.startPartial = function(name) {
  return '<script type="text/ng-template" id="' + name + '">'
}
app.locals.endPartial = function() {
  return '</script>'
}


//
// Mobile app
//
app.get('/', function(req, resp) {
  /*
  var v = req.query.v
  if (v !== info.version) resp.redirect('/?v=' + info.version)
  else resp.render('index.ejs')
  */
  resp.render('index.ejs')
});
app.get('/offline.appcache', function(req, resp) {
  resp.set('Content-Type', 'text/cache-manifest');
  resp.render('offline.ejs')
});


//
// Web App
//
var songDb;
var sortedSongs;

app.get('/db.json', function(req, resp) {
  resp.json(sortedSongs)
})
app.get('/api/song/:id', function(req, resp) {
  resp.json(songDb[req.params.id])
})

app.get('/songs', function(req, resp) {
  resp.render('web/song_index', {songs: sortedSongs})
})
app.get('/songs/:id', function(req, resp) {
  resp.render('web/song_detail', {songs: sortedSongs, song: songDb[req.params.id]})
})

var ingest = require('./ingest')
ingest(function(data) {
  songDb = data
  sortedSongs =
    _.chain(songDb)
      .values()
      .sortBy(function(s) { return s.name })
      .value()
})


http.createServer(app).listen(app.get('port'), function(){
  console.log("Bluegrass mobile server on port " + app.get('port'));
});
