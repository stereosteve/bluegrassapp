
/**
 * Songs
 */

PB.controller('songListCtrl', ['$scope','$routeParams','$location','db','playlists',
                       function($scope,  $routeParams,  $location,  db,  playlists) {
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


PB.controller('songDetailCtrl', ['$scope','$routeParams','db',
                         function($scope,  $routeParams,  db) {

  db.then(function(data) {
    $scope.song = _.find(data.songs, function(song) {
      return song.id == $routeParams.songId;
    });
    if ($scope.song && $scope.song.lyrics) {
      $scope.htmlLyrics = '<p>' + $scope.song.lyrics.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />') + '</p>';
    }
  });

  $scope.addSongToPlaylist = function(song, playlist) {
    playlist.addSong(song);
    console.log("add song", song, playlist);
  };

}]);


/**
 * Playlists
 */

PB.controller('favsCtrl', ['$scope','db','playlists',
                   function($scope,  db,  playlists) {

  // load data
  db.then(function(data) {
    $scope.favs = data.songs.slice(0,4);
  });

}]);


