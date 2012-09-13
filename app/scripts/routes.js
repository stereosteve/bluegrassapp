
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

    $routeProvider.when('/about', {
      templateUrl: 'about.html',
    });

    $routeProvider.otherwise({redirectTo: '/home'});
  }]);

