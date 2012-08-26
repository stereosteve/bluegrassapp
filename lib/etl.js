var spider = require('./spider'),
    async = require('async'),
    models = require('./models');

var killTimer;
function stayAlive() {
  clearTimeout(killTimer);
  killTimer = setTimeout(models.close, 2000);
}

spider.on('song', function(s) {
  stayAlive();
  var song = new models.Song(s);
  song.save(function(err) {
    if (err) throw err;
  });

  var artist = {
    id: song.artistId,
    name: song.artist
  };
  models.Artist.findOneAndUpdate(artist, artist, {upsert: true}, function(err, artist) {
    //if (err) throw err;
  });
});

async.parallel([
    models.Song.collection.drop.bind(models.Song.collection),
    models.Artist.collection.drop.bind(models.Artist.collection)
], spider.jimAndJesse);
