
/**
 * Declares pseudo-global PB module
 * Must come first
 *
 * Also declares routes
 */
var PB = angular.module('pickbook', []).
  config(['$routeProvider', function($routeProvider) {

    $routeProvider.reloadOnSearch = true;

    $routeProvider.when('/home', {
      templateUrl: 'home.html'
    });

    $routeProvider.when('/songs', {
      templateUrl: 'songs/index.html',
      controller: 'songListCtrl',
    });

    $routeProvider.when('/songs/:songId', {
      templateUrl: 'songs/show.html',
      controller: 'songDetailCtrl',
    });

    $routeProvider.when('/favs', {
      templateUrl: 'favs.html',
      controller: 'favsCtrl'
    });

    $routeProvider.when('/about', {
      templateUrl: 'about.html',
    });

    $routeProvider.when('/settings', {
      templateUrl: 'settings.html',
    });

    $routeProvider.otherwise({redirectTo: '/home'});
  }]);

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




/**
 * Songs
 */

PB.controller('songListCtrl', ['$scope','$routeParams','$location','db','favs',
                       function($scope,  $routeParams,  $location,  db,  favs) {
  // load data
  db.then(function(data) {
    angular.extend($scope, data);
  });

  // Song Search
  $scope.$watch('searchTerm', function(searchTerm) {
    if (!searchTerm) return;
    $scope.searchTerm = searchTerm.toLowerCase();
  });
  $scope.songSearch = function(obj, i) {
    if (!$scope.searchTerm) return true;
    if ($scope.searchTerm.length < 3) return false;
    return obj.haystack.indexOf($scope.searchTerm) > -1;
  };

  // Letter pages
  $scope.firstLetter = function(obj) {
    if ($scope.searchTerm) return true;
    return obj.name.charAt(0).toLowerCase() == $scope.letter;
  };
  $scope.$watch('letter', function(letter) {
    if (!letter) return;
    $location.search('letter', letter);
    $scope.prevLetter = String.fromCharCode($scope.letter.charCodeAt(0) - 1);
    $scope.nextLetter = String.fromCharCode($scope.letter.charCodeAt(0) + 1);
  });
  $scope.prevPage = function() {
    $scope.letter = $scope.prevLetter;
  };
  $scope.nextPage = function() {
    $scope.letter = $scope.nextLetter;
  };
  $scope.letter = $routeParams.letter || 'a';

}]);


PB.controller('songDetailCtrl', ['$scope','$routeParams','db','favs',
                         function($scope,  $routeParams,  db , favs) {

  db.then(function(data) {
    $scope.song = _.find(data.songs, function(song) {
      return song.id == $routeParams.songId;
    });
    if ($scope.song && $scope.song.lyrics) {
      $scope.htmlLyrics = '<p>' + $scope.song.lyrics.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />') + '</p>';
    }
  });

  $scope.favs = favs;

}]);


/**
 * Playlists
 */

PB.controller('favsCtrl', ['$scope','db','favs',
                   function($scope,  db,  favs) {

  // load data
  db.then(function(data) {
    var songIds = favs.list();
    $scope.songIds = songIds;
    $scope.favSongs = _.select(data.songs, function(song) {
      return songIds.indexOf(song.id) > -1;
    });
  });

}]);


