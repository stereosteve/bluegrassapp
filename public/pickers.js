/*globals angular:true Faker:true*/
//'use strict';


var PICKERS = angular.module('pickers', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'home.html'});
    $routeProvider.when('/songs', {templateUrl: 'songIndex.html', controller: 'songIndexCtrl'});
    $routeProvider.when('/songs/:songId', {templateUrl: 'songDetail.html', controller: 'songDetailCtrl'});
    $routeProvider.when('/artists', {templateUrl: 'artistIndex.html', controller: 'artistIndexCtrl'});
    $routeProvider.when('/artists/:artistId', {templateUrl: 'artistDetail.html', controller: 'artistDetailCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);



PICKERS.controller('songIndexCtrl', ['$scope', 'fixtures', function($scope, fixtures) {
  $scope.songs = fixtures.songs;
}]);

PICKERS.controller('songDetailCtrl', ['$scope', '$routeParams', 'fixtures', function($scope, $routeParams, fixtures) {
  $scope.song = fixtures.songs[$routeParams.songId];
}]);

PICKERS.controller('artistIndexCtrl', ['$scope', 'fixtures', function($scope, fixtures) {
  $scope.artists = fixtures.artists;
}]);

PICKERS.controller('artistDetailCtrl', ['$scope', '$routeParams', 'fixtures', function($scope, $routeParams, fixtures) {
  $scope.artist = fixtures.artists[$routeParams.artistId];
  $scope.songs = _.select(fixtures.songs, function(song) {
    return song.artistId == $routeParams.artistId;
  });
}]);



PICKERS.factory('fixtures', function() {

  var artists = [];
  var songs = [];

  for(var i = 0; i < 20; i++) {
    artist = {
      id: i,
      name: Faker.Name.findName()
    };
    artists.push(artist);

    for(var j = 0; j < 5; j++) {
      songs.push({
        id: j,
        artistId: artist.id,
        artistName: artist.name,
        name: Faker.Company.companyName(),
        lyrics: Faker.Lorem.paragraphs(3)
      });
    }

  }



  return {
    artists: artists,
    songs: songs
  };

});

PICKERS.run(['fixtures', function() {}]);
