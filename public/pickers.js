/*globals angular:true Faker:true*/
//'use strict';


var PICKERS = angular.module('pickers', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'home.html'});
    $routeProvider.when('/songs', {templateUrl: 'songIndex.html', controller: 'frameCtrl'});
    $routeProvider.when('/songs/:songId', {templateUrl: 'songDetail.html', controller: 'songDetailCtrl'});
    $routeProvider.when('/artists', {templateUrl: 'artistIndex.html', controller: 'frameCtrl'});
    $routeProvider.when('/artists/:artistId', {templateUrl: 'artistDetail.html', controller: 'artistDetailCtrl'});
    $routeProvider.when('/playlists', {templateUrl: 'playlistIndex.html', controller: 'playlistCtrl'});
    $routeProvider.when('/playlists/:id', {templateUrl: 'playlistDetail.html'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);



PICKERS.controller('playlistCtrl', ['$scope','db',
                            function($scope,  db) {

  var pl = localStorage.getItem('pickerPlaylists');
  if (pl)
    $scope.playlists = JSON.parse(pl);
  else
    $scope.playlists = [];

  $scope.createPlaylist = function() {
    $scope.newPlaylist.id = $scope.playlists.length;
    $scope.playlists.push($scope.newPlaylist);
    $scope.newPlaylist = undefined;
    localStorage.setItem('pickerPlaylists', JSON.stringify($scope.playlists));
  };

}]);



PICKERS.controller('frameCtrl', ['$scope','db',
                         function($scope,  db) {

  db.success(function(data) {
    angular.extend($scope, data);
  });


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


PICKERS.factory('db', ['$http', function($http) {
  return $http.get('/everything.json', {cache: true});
}]);



