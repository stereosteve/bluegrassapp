
PB.controller('mainCtrl', ['$scope','$routeParams','$location','db','playlists',
                   function($scope,  $routeParams,  $location,  db,  playlists) {
  // load data
  db.then(function(data) {
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


  $scope.$watch('searchTerm', function(searchTerm) {
    if (!searchTerm) return;
    $scope.searchTerm = searchTerm.toLowerCase();
  });
  $scope.songSearch = function(obj, i) {
    if (!$scope.searchTerm) return true;
    if ($scope.searchTerm.length < 3) return false;
    return obj.haystack.indexOf($scope.searchTerm) > -1;
  };



  $scope.firstLetter = function(obj) {
    if ($scope.searchTerm) return true;
    return obj.name.charAt(0).toLowerCase() == $scope.letter;
  };

  $scope.$watch('letter', function(letter) {
    if (!letter) return;
    $location.search('letter', letter);
    $scope.prevLetter = String.fromCharCode($scope.letter.charCodeAt(0) - 1);
    if ($scope.letter == 'a') $scope.prevLetter = 'z';
    $scope.nextLetter = String.fromCharCode($scope.letter.charCodeAt(0) + 1);
    if ($scope.letter == 'z') $scope.prevLetter = 'a';
  });

  $scope.prevPage = function() {
    $scope.letter = $scope.prevLetter;
  };

  $scope.nextPage = function() {
    $scope.letter = $scope.nextLetter;
  };

  $scope.letter = $routeParams.letter || 'a';

}]);


PB.controller('playlistCtrl', ['$scope','db','playlists',
                            function($scope,  db,  playlists) {

  $scope.createPlaylist = function() {
    var newPlaylist = $scope.newPlaylist;
    newPlaylist.id = playlists.length;
    playlists.add(newPlaylist);
    $scope.newPlaylist = undefined;
  };
}]);

PB.controller('playlistDetailCtrl', ['$scope','$routeParams','playlists',
                                  function($scope,  $routeParams,  playlists) {
  $scope.playlist = playlists[$routeParams.id];
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


