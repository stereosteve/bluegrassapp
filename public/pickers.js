/*globals angular:true _:true*/
//'use strict';


//
// Routes
//
var PICKERS = angular.module('pickers', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'home.html'});

    $routeProvider.when('/songs', {templateUrl: 'songs/index.html', showSearch: true});
    $routeProvider.when('/songs/:songId', {templateUrl: 'songs/show.html', controller: 'songDetailCtrl', noChrome: true});

    $routeProvider.when('/artists', {templateUrl: 'artists/index.html', showSearch: true});
    $routeProvider.when('/artists/:artistId', {templateUrl: 'artists/show.html', controller: 'artistDetailCtrl'});

    $routeProvider.when('/playlists', {templateUrl: 'playlists/index.html', controller: 'playlistCtrl'});
    $routeProvider.when('/playlists/:id', {templateUrl: 'playlists/show.html'});

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
PICKERS.controller('pickerCtrl', ['$scope','$routeParams','db','playlists',
                          function($scope,  $routeParams,  db,  playlists) {
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
  };
  $scope.$on('$routeChangeSuccess', onRouteChange);

  $scope.letter = $routeParams.letter || 'a';
  $scope.firstLetter = function(obj) {
    if ($scope.searchTerm) return true;
    return obj.name.charAt(0).toLowerCase() == $scope.letter;
  };

  $scope.nextPage = function() {
    $scope.letter = String.fromCharCode($scope.letter.charCodeAt(0) + 1);
    window.scrollTo(0,0);
  };

  $scope.prevPage = function() {
    $scope.letter = String.fromCharCode($scope.letter.charCodeAt(0) - 1);
    window.scrollTo(0,0);
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





