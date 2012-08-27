/*globals angular:true _:true*/
//'use strict';


//
// Routes
//
var PICKERS = angular.module('pickers', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'home.html'});

    $routeProvider.when('/songs', {templateUrl: 'songIndex.html', showSearch: true});
    $routeProvider.when('/songs/:songId', {templateUrl: 'songDetail.html', controller: 'songDetailCtrl'});

    $routeProvider.when('/artists', {templateUrl: 'artistIndex.html', showSearch: true});
    $routeProvider.when('/artists/:artistId', {templateUrl: 'artistDetail.html', controller: 'artistDetailCtrl'});

    $routeProvider.when('/playlists', {templateUrl: 'playlistIndex.html', controller: 'playlistCtrl'});
    $routeProvider.when('/playlists/:id', {templateUrl: 'playlistDetail.html'});

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

  playlists.add = function(pl) {
    playlists.push(pl);
    localStorage.setItem('pickerPlaylists', JSON.stringify(playlists));
  };
  return playlists;
});




//
// Controllers
//
PICKERS.controller('pickerCtrl', ['$scope','$route','db','playlists',
                          function($scope,  $route,  db,  playlists) {
  // load data
  db.success(function(data) {
    angular.extend($scope, data);
  });

  // load playlists
  $scope.playlists = playlists;

  // listen to route change
  var onRouteChange = function(ev, route) {
    $scope.showSearch = route.showSearch;
  };
  $scope.$on('$routeChangeSuccess', onRouteChange);


  // re-filter song list (pagination, sort, search, etc)
  $scope.$watch('songs', function(songs) {
    if (!songs || songs.length < 1) return;
    $scope.songList = $scope.songs;
  });

  $scope.$watch('searchTerm', function(searchTerm) {
    if (!searchTerm) return;
    searchTerm = searchTerm.toLowerCase();
    console.log("searchTermm", searchTerm);
    $scope.songList = _.select($scope.songs, function(song) {
      var searchIn = '' + song.name + song.artist;
      return searchIn.toLowerCase().indexOf(searchTerm) > -1;
    });
  });

  // compute pagination
  $scope.setLetter = function(letter) {
    $scope.currentLetter = letter;
    $scope.songList = _.select($scope.songs, function(song) {
      return song.name.charAt(0).toLowerCase() == letter;
    });

    var charCode = letter.charCodeAt(0);
    if (letter != 'a') $scope.prevLetter = String.fromCharCode(charCode - 1);
    if (letter != 'z') $scope.nextLetter = String.fromCharCode(charCode + 1);

  };
  $scope.setLetter('a');

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




PICKERS.controller('songDetailCtrl', ['$scope','$routeParams','db',
                              function($scope,  $routeParams,  db) {

  db.success(function(data) {
    $scope.song = _.find(data.songs, function(song) {
      return song.id == $routeParams.songId;
    });
  });

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





