
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
      showSearch: true
    });
    $routeProvider.when('/songs/:songId', {
      templateUrl: 'songs/show.html',
      controller: 'songDetailCtrl',
      noChrome: true
    });

    $routeProvider.when('/playlists', {
      templateUrl: 'playlists/index.html',
      controller: 'playlistCtrl'
    });
    $routeProvider.when('/playlists/:id', {
      templateUrl: 'playlists/show.html',
      controller: 'playlistDetailCtrl'
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


PB.factory('playlists', function() {
  var playlists = [];
  var json = localStorage.getItem('pickerPlaylists');
  if (json) playlists = JSON.parse(json);

  var wrapPlaylist = function(pl) {
    pl.addSong = function(song) {
      if (!pl.songs) pl.songs = [];
      pl.songs.push(song);
      playlists.save();
    };
  };
  playlists.forEach(wrapPlaylist);

  playlists.add = function(pl) {
    wrapPlaylist(pl);
    playlists.push(pl);
    playlists.save();
  };
  playlists.save = function() {
    localStorage.setItem('pickerPlaylists', JSON.stringify(playlists));
    console.log("saved", playlists);
  };
  return playlists;
});




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


