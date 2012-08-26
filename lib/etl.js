var spider = require('./spider'),
    async = require('async'),
    models = require('./models');


spider.on('song', function(s) {
  var song = new models.Song(s);
  song.save(function(err) {
    if (err) throw err;
  });

  var artist = {
    name: song.artist
  };
  models.Artist.findOneAndUpdate(artist, artist, {upsert: true}, function(err, artist) {
    //if (err) throw err;
    console.log("ART", artist);
  });
});

async.parallel([
    models.Song.collection.drop.bind(models.Song.collection),
    models.Artist.collection.drop.bind(models.Artist.collection)
], spider.jimAndJesse);
