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



PB.factory('favs', function() {
  var _favs = [];

  var load = function() {
    var json = localStorage.getItem('_favs');
    if (json) _favs = JSON.parse(json);
  }
  load();

  var save = function() {
    localStorage.setItem('_favs', JSON.stringify(_favs));
  }

  return {

    list: function() {
      return _favs;
    },

    contains: function(songId) {
      return _favs.indexOf(songId) > -1;
    },

    add: function(songId) {
      _favs.push(songId);
      save();
    },

    remove: function(songId) {
      var index = _favs.indexOf(songId);
      if (index > -1) {
        _favs.splice(index, 1);
        save();
      }
    },

  }


});


PB.factory('hammer', ['$location', function($location) {
  var el = document.getElementById('hammer')
  var hammer = new Hammer(el)

  hammer.ondoubletap = function(ev) {
    alert('hammer: doubletap')
  }
  hammer.onhold = function(ev) {
    alert('hammer: holding')
  }

  return hammer;
}]);


