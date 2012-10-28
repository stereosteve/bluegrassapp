var PB = angular.module('pickbook', [])




PB.controller('rootCtrl', ['$scope','db','favs',
                   function($scope , db , favs) {


  $scope.rootView = 'songs/index'

  var goto = $scope.goto = function(view) {
    $scope.rootView = view
  }

  $scope.$watch('rootView', function(view) {
    if (!view) return;
    $scope.showMenu = false;
    window.scrollTo(0,1)
  })



  $scope.toggleMenu = function() {
    $scope.showMenu = !$scope.showMenu
  };





  /**
   * Songs
   */

  // load data
  db.then(function(data) {
    angular.extend($scope, data);
  });



  // Search

  $scope.songSearch = function(obj, i) {
    if (!$scope.searchTerm) return true;
    if ($scope.searchTerm.length < 3) return false;
    return obj.name.toLowerCase().indexOf($scope.searchTerm) > -1;
  };

  $scope.updateSearch = function(term) {
    if (term)
      $scope.searchTerm = term.toLowerCase();
    else
      delete $scope.searchTerm
  }




  // First Letter

  $scope.letter = 'a';

  $scope.firstLetter = function(obj) {
    if ($scope.searchTerm) return true;
    return obj.name.charAt(0).toLowerCase() == $scope.letter;
  };

  $scope.$watch('letter', function(letter) {
    if (!letter) return;
    $scope.prevLetter = String.fromCharCode($scope.letter.charCodeAt(0) - 1);
    $scope.nextLetter = String.fromCharCode($scope.letter.charCodeAt(0) + 1);
  });

  $scope.prevPage = function() {
    $scope.letter = $scope.prevLetter;
    window.scrollTo(0, 1);
  };
  $scope.nextPage = function() {
    $scope.letter = $scope.nextLetter;
    window.scrollTo(0, 1);
  };





  // Song Detail

  $scope.showSong = function(song) {
    $scope.song = song
    goto('songs/show')
  }

  $scope.simpleFormat = function(text) {
    return '<p>' + $scope.song.lyrics.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />') + '</p>';
  }




  /**
   * Favs
   */

  $scope.favs = favs;

  $scope.filterFavs = function(obj) {
    return favs.contains(obj.id)
  }

}]);









//
// Services
//




PB.factory('db', ['$http', '$q', function($http, $q) {
  var deferred = $q.defer()
  var data = localStorage.getItem('pickbook-data')


  if (data) {
    data = JSON.parse(data)
    deferred.resolve(data)
  }
  else {
    $http.get('/everything.json', {cache: true}).then(function(resp) {
      localStorage.setItem('pickbook-data', JSON.stringify(resp.data))
      deferred.resolve(resp.data)
    });
  }

  return deferred.promise;
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
