/*globals angular:true _:true*/
//'use strict';


//
// Routes
//
var PICKERS = angular.module('pickers', []).
  config(['$routeProvider', function($routeProvider) {

    $routeProvider.reloadOnSearch = true;

    $routeProvider.when('/home', {templateUrl: 'home.html'});

    $routeProvider.when('/songs', {templateUrl: 'songs/index.html', showSearch: true});
    $routeProvider.when('/songs/:songId', {templateUrl: 'songs/show.html', controller: 'songDetailCtrl', noChrome: true});

    $routeProvider.when('/artists', {templateUrl: 'artists/index.html', showSearch: true});
    $routeProvider.when('/artists/:artistId', {templateUrl: 'artists/show.html', controller: 'artistDetailCtrl'});

    $routeProvider.when('/playlists', {templateUrl: 'playlists/index.html', controller: 'playlistCtrl'});
    $routeProvider.when('/playlists/:id', {templateUrl: 'playlists/show.html', controller: 'playlistDetailCtrl'});

    $routeProvider.otherwise({redirectTo: '/home'});
  }]);




//
// Services
//
PICKERS.factory('db', ['$http', function($http) {
  return $http.get('/everything.json', {cache: true});
}]);


PICKERS.factory('playlists', function() {
  var playlists = [];
  var json = localStorage.getItem('pickerPlaylists');
  if (json)
    playlists = JSON.parse(json);

  playlists.forEach(function(pl) {
    pl.addSong = function(song) {
      if (!pl.songs) pl.songs = [];
      pl.songs.push(song);
      playlists.save();
    };
  });

  playlists.add = function(pl) {
    playlists.push(pl);
    playlists.save();
  };
  playlists.save = function() {
    localStorage.setItem('pickerPlaylists', JSON.stringify(playlists));
    console.log("saved", playlists);
  };
  return playlists;
});




//
// Controllers
//
PICKERS.controller('pickerCtrl', ['$scope','$routeParams','$location','db','playlists',
                          function($scope,  $routeParams,  $location,  db,  playlists) {
  // load data
  db.success(function(data) {
    angular.extend($scope, data);
  });

  // load playlists
  $scope.playlists = playlists;

  // listen to route change
  var onRouteChange = function(ev, route) {
    $scope.showSearch = route.showSearch;
    $scope.noChrome = route.noChrome;
    $scope.letter = $routeParams.letter || 'a';
  };
  $scope.$on('$routeChangeSuccess', onRouteChange);


  $scope.firstLetter = function(obj) {
    if ($scope.searchTerm) return true;
    return obj.name.charAt(0).toLowerCase() == $scope.letter;
  };

  $scope.nextPage = function() {
    var letter = String.fromCharCode($scope.letter.charCodeAt(0) + 1);
    $location.search('letter', letter);
  };

  $scope.prevPage = function() {
    var letter = String.fromCharCode($scope.letter.charCodeAt(0) - 1);
    $location.search('letter', letter);
  };

}]);


PICKERS.controller('playlistCtrl', ['$scope','db','playlists',
                            function($scope,  db,  playlists) {

  $scope.createPlaylist = function() {
    var newPlaylist = $scope.newPlaylist;
    newPlaylist.id = playlists.length;
    playlists.add(newPlaylist);
    $scope.newPlaylist = undefined;
  };
}]);

PICKERS.controller('playlistDetailCtrl', ['$scope','$routeParams','playlists',
                                  function($scope,  $routeParams,  playlists) {
  $scope.playlist = playlists[$routeParams.id];
}]);




PICKERS.controller('songDetailCtrl', ['$scope','$routeParams','db',
                              function($scope,  $routeParams,  db) {

  db.success(function(data) {
    $scope.song = _.find(data.songs, function(song) {
      return song.id == $routeParams.songId;
    });
  });

  $scope.addSongToPlaylist = function(song, playlist) {
    playlist.addSong(song);
    console.log("add song", song, playlist);
  };

}]);


PICKERS.controller('artistDetailCtrl', ['$scope','$routeParams','db',
                              function($scope,  $routeParams,  db) {
  db.success(function(data) {

    $scope.artist = _.find(data.artists, function(artist) {
      return artist.id == $routeParams.artistId;
    });
    $scope.songs = _.select(data.songs, function(song) {
      return song.artist == $scope.artist.name;
    });

  });
}]);





