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
    $scope.noChrome = route.noChrome;
  };
  $scope.$on('$routeChangeSuccess', onRouteChange);


  // query stuffs
  $scope.songQuery = {
    limit: 50,
    offset: 0,
  };

  function refresh() {
    var songs = $scope.songs;
    if (!songs || songs.length < 1) return;

    var query = $scope.songQuery;

    // firstLetter
    if (query.firstLetter) {
      query.firstLetter = query.firstLetter.toLowerCase();
      songs = _.select(songs, function(song) {
        return song.name.charAt(0).toLowerCase() == query.firstLetter;
      });
    }

    // searchTerm
    if (query.searchTerm) {
      query.searchTerm = query.searchTerm.toLowerCase();
      songs = _.select(songs, function(song) {
        var searchIn = [song.name, song.artist].join(' ');
        return searchIn.toLowerCase().indexOf(query.searchTerm) > -1;
      });
    }

    // limit + offset
    if (songs.length < query.offset) query.offset = Math.max(0, songs.length - query.limit);
    $scope.songList = songs.slice(query.offset, query.offset + query.limit);
  }



  // re-filter song list (pagination, sort, search, etc)
  $scope.$watch('songs', refresh);
  $scope.$watch('songQuery.searchTerm', refresh);
  $scope.$watch('songQuery.offset', refresh);

  $scope.nextPage = function() {
    $scope.songQuery.offset += $scope.songQuery.limit;
    window.scroll(0,0);
  };
  $scope.prevPage = function() {
    $scope.songQuery.offset -= $scope.songQuery.limit;
    window.scroll(0,0);
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





