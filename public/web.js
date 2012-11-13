//document.getElementById('seo').style.display = 'none';


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
    name: '_songs'
  })
  .when('/songs/:id', {
    templateUrl: '_song',
    controller: 'song'
  })

}])

bgWeb.run(['$rootScope', function($rootScope) {
  $rootScope.$on('$routeChangeSuccess', function(scope, current, last) {
    console.log("RUTE", current)
  })
}])

bgWeb.controller('webCtrl', ['$scope','db', function($scope , db) {
  $scope.doit = function() {
  }
  $scope.currentSong = 'yermom'
  $scope.showSong = function(song) {
    console.log(song)
    $scope.currentSong = song
  }
  db.then(function(songs) {
    $scope.songs = songs
    $scope.song = songs[2]
  })
}])

bgWeb.controller('song', ['$scope','db','$routeParams', function($scope , db, $routeParams) {
  db.then(function(songs) {
    $scope.song = songs[$routeParams.id]
  })
}])

bgWeb.factory('db', ['$http', function($http) {
  return $http.get('/db.json', {cache: true}).then(function(resp) {
    return resp.data
  });
}]);
