var mongoose = require('mongoose');

var dbString = process.env.PP_DB || 'mongodb://localhost/pickers';
var db = mongoose.createConnection(dbString);


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to pickers db", dbString);
});

var songSchema = new mongoose.Schema({
  id: String,
  name: String,
  artist: String,
  artistId: String,
  lyrics: String
});

var Song = db.model('Song', songSchema);


var artistSchema = new mongoose.Schema({
  id: String,
  name: String
});

var Artist = db.model('Artist', artistSchema);


module.exports = {
  Song: Song,
  Artist: Artist,
  close: function() {
    console.log("disconnecting mongo ", dbString);
    db.close();
  }
};
