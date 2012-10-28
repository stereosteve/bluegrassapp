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

  $scope.letter = 'a'


  $scope.rootFilter = function(obj, i) {
    if ($scope.onlyFavs) {
      return favs.contains(obj.id)
    }
    else if ($scope.searchTerm) {
      if ($scope.searchTerm.length < 3) return false;
      return obj.name.toLowerCase().indexOf($scope.searchTerm) > -1;
    }
    else {
      return obj.name.charAt(0).toLowerCase() == $scope.letter;
    }
  }

  $scope.updateSearch = function(term) {
    if (term)
      searchTerm = $scope.searchTerm = term.toLowerCase();
    else
      searchTerm = $scope.searchTerm = undefined
  }



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
  $scope.toggleFavs = function() {
    $scope.onlyFavs = !$scope.onlyFavs
  }





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


}]);









//
// Services
//




PB.factory('db', ['$http', function($http) {
  return $http.get('/everything.json', {cache: true}).then(function(resp) {
    return resp.data
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
