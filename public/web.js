document.getElementById('seo').style.display = 'none';

var bgWeb = angular.module('bgWeb', [])

bgWeb.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  var resolve = {
    songs: function($http) {
      return $http.get('/db.json', {cache: true}).then(function(resp) {
        return resp.data
      })
    }
  }

  $routeProvider.when('/', {
    templateUrl: '_home'
  })
  .when('/songs', {
    templateUrl: '_songs',
    controller: 'songs',
    resolve: resolve
  })
  .when('/songs/:id', {
    templateUrl: '_song',
    controller: 'song',
    resolve: resolve
  })

}])

bgWeb.controller('songs', ['$scope','songs', function($scope , songs) {
  $scope.songs = songs
}])

bgWeb.controller('song', ['$scope','songs', function($scope , songs) {
  $scope.songs = songs
  $scope.song = songs[2]
}])

