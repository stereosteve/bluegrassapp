var express = require('express');
var app = express();
var models = require('./lib/models');
var async = require('async');
var md = require("node-markdown").Markdown;

app.use(express.static(__dirname + '/public'));

app.get('/everything.json', function(req, resp) {
  async.parallel([
    models.Artist.find.bind(models.Artist),
    models.Song.find.bind(models.Song)
  ], function(err, found) {
    if (err) throw err;

    var songs = found[1];
    songs.forEach(function(song) {
      song.htmlLyrics = '<p>' + song.lyrics.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />') + '</p>';
    });


    resp.json({
      artists: found[0],
      songs: songs
    });
  });
});

var port = process.env.PORT || 8080;
app.listen(port);
console.log('Listening on port', port);
