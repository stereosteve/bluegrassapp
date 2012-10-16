
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
    $location.search('searchTerm', $scope.searchTerm);
  });
  $scope.songSearch = function(obj, i) {
    if (!$scope.searchTerm) return true;
    if ($scope.searchTerm.length < 3) return false;
    return obj.name.indexOf($scope.searchTerm) > -1;
  };
  $scope.searchTerm = $routeParams.searchTerm;

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
    window.scrollTo(0, 1);
  };
  $scope.nextPage = function() {
    $scope.letter = $scope.nextLetter;
    window.scrollTo(0, 1);
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


