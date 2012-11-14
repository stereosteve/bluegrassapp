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
  $scope.alphabet = []
  $scope.letter = 'A'
  for(var i=65; i < 91; i++) {
    $scope.alphabet.push(String.fromCharCode(i))
  }

  $scope.setLetter = function(l) {
    $scope.letter = l
  }
  $scope.letterFilter = function(song) {
    return song.name.charAt(0).toUpperCase() == $scope.letter;
  }
  db.then(function(songs) {
    $scope.songs = songs
  })
}])

bgWeb.controller('song', ['$scope','db','$routeParams', function($scope , db, $routeParams) {
  db.then(function(songs) {
    $scope.song = songs.table[$routeParams.id]
  })
}])

bgWeb.factory('db', ['$http', function($http) {
  return $http.get('/db.json', {cache: true}).then(function(resp) {
    var songs = resp.data
    songs.table = {}
    angular.forEach(songs, function(song) {
      songs.table[song.id] = song
    })
    return songs
  });
}]);
