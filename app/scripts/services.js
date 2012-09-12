//
// Services
//


PB.factory('db', ['$http', function($http) {
  return $http.get('/everything.json', {cache: true}).then(function(resp) {
    var data = resp.data;
    data.songs.forEach(function(song) {
      song.haystack = [song.name, song.artist].join(' ').toLowerCase();
    });
    return data;
  });
}]);


PB.factory('playlists', function() {
  var playlists = [];
  var json = localStorage.getItem('pickerPlaylists');
  if (json) playlists = JSON.parse(json);

  var wrapPlaylist = function(pl) {
    pl.addSong = function(song) {
      if (!pl.songs) pl.songs = [];
      pl.songs.push(song);
      playlists.save();
    };
  };
  playlists.forEach(wrapPlaylist);

  playlists.add = function(pl) {
    wrapPlaylist(pl);
    playlists.push(pl);
    playlists.save();
  };
  playlists.save = function() {
    localStorage.setItem('pickerPlaylists', JSON.stringify(playlists));
    console.log("saved", playlists);
  };
  return playlists;
});



