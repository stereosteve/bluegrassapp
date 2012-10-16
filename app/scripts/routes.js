
/**
 * Declares pseudo-global PB module
 * Must come first
 *
 * Also declares routes
 */
var PB = angular.module('pickbook', []).
  config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/home', {
      templateUrl: 'home.html',
    });

    $routeProvider.when('/songs', {
      templateUrl: 'songs/index.html',
      controller: 'songListCtrl',
      reloadOnSearch: false,
    });

    $routeProvider.when('/songs/:songId', {
      templateUrl: 'songs/show.html',
      controller: 'songDetailCtrl',
    });

    $routeProvider.when('/favs', {
      templateUrl: 'favs.html',
      controller: 'favsCtrl'
    });

    $routeProvider.when('/about', {
      templateUrl: 'about.html',
    });

    $routeProvider.when('/settings', {
      templateUrl: 'settings.html',
    });

    $routeProvider.otherwise({redirectTo: '/home'});
  }]);


PB.run([function() {
}])
