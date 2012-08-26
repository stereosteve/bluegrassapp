var express = require('express');
var app = express();
var models = require('./lib/models');
var async = require('async');

app.use(express.static(__dirname + '/public'));

app.get('/everything.json', function(req, resp) {
  async.parallel([
    models.Artist.find.bind(models.Artist),
    models.Song.find.bind(models.Song)
  ], function(err, found) {
    if (err) throw err;
    resp.json({
      artists: found[0],
      songs: found[1]
    });
  });
});


app.listen(3000);
console.log('Listening on port 3000');
