var express = require('express')
  , http = require('http')
  , path = require('path')
  , info = require('./package.json')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.locals.info = info
});


app.configure('development', function(){
  //app.locals.manifest = 'manifest="/offline.appcache"'
  app.locals.manifest = ''
  app.use(express.errorHandler());
});
app.configure('production', function() {
  app.locals.manifest = 'manifest="/offline.appcache"'
})

app.get('/', function(req, resp) {
  resp.render('index')
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Bluegrass mobile server on port " + app.get('port'));
});
