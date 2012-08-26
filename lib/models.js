var mongoose = require('mongoose'),
    db = mongoose.createConnection('localhost', 'pickers');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to pickers db");
});

var songSchema = new mongoose.Schema({
  name: String,
  artist: String,
  lyrics: String
});

var Song = db.model('Song', songSchema);


var artistSchema = new mongoose.Schema({
  name: String
});

var Artist = db.model('Artist', artistSchema);


module.exports = {
  Song: Song,
  Artist: Artist
};
