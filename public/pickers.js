/*globals angular:true*/
'use strict';


var PICKERS = angular.module('pickers', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'home.html'});
    $routeProvider.when('/songs', {templateUrl: 'songIndex.html', controller: 'songIndexCtrl'});
    $routeProvider.when('/songs/:songId', {templateUrl: 'songDetail.html', controller: 'songDetailCtrl'});
    $routeProvider.when('/artists', {templateUrl: 'artistIndex.html', controller: 'artistIndexCtrl'});
    $routeProvider.when('/artists/:artistId', {templateUrl: 'artistDetail.html', controller: 'artistDetailCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);

PICKERS.controller('songIndexCtrl', ['$scope', function($scope) {
  $scope.songs = [];
  for(var i = 0; i < 100; i++) {
    $scope.songs.push({
      id: i,
      name: 'Song ' + i
    });
  }
}]);

PICKERS.controller('songDetailCtrl', ['$scope', function($scope) {
  $scope.song = {
    name: 'Song detail time'
  };
}]);

PICKERS.controller('artistIndexCtrl', ['$scope', function($scope) {
  $scope.artists = [];
  for(var i = 0; i < 100; i++) {
    $scope.artists.push({
      id: i,
      name: 'Artist ' + i
    });
  }
}]);

PICKERS.controller('artistDetailCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.artist = {
    id: $routeParams.artistId,
    name: "bill monroe"
  };
}]);
