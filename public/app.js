var PB = angular.module('pickbook', [])




PB.controller('rootCtrl', ['$scope','$window','db','favs',
                   function($scope , $window , db , favs) {



  // Modes


  $scope.letter = 'a'

  var lastMode

  var setMode = $scope.setMode = function(mode) {
    lastMode = $scope.mode
    $scope.mode = mode
    if (mode === 'songDetail')
      $scope.modeView = 'songDetail'
    else
      $scope.modeView = 'songList'
    $window.scrollTo(0, 1);
  }
  $scope.lastMode = function() {
    setMode(lastMode)
  }


  $scope.modeFilter = function(obj, i) {
    if ($scope.mode === 'favs') {
      return favs.contains(obj.id)
    }
    else if ($scope.mode === 'search') {
      if (!$scope.searchTerm || $scope.searchTerm.length < 3) return false;
      return obj.name.toLowerCase().indexOf($scope.searchTerm) > -1;
    }
    else {
      return obj.name.charAt(0).toLowerCase() == $scope.letter;
    }
  }

  $scope.updateSearch = function(term) {
    if (term)
      $scope.searchTerm = term.toLowerCase();
    else
      $scope.searchTerm = undefined
  }



  $scope.$watch('letter', function(letter) {
    if (!letter) return;
    $scope.prevLetter = String.fromCharCode($scope.letter.charCodeAt(0) - 1);
    $scope.nextLetter = String.fromCharCode($scope.letter.charCodeAt(0) + 1);
    if ($scope.prevLetter < 'a') $scope.prevLetter = 'z'
    if ($scope.nextLetter > 'z') $scope.nextLetter = 'a'
  });

  $scope.prevPage = function() {
    $scope.letter = $scope.prevLetter;
    $window.scrollTo(0, 1);
  };
  $scope.nextPage = function() {
    $scope.letter = $scope.nextLetter;
    $window.scrollTo(0, 1);
  };








  // Song Detail

  $scope.showSong = function(song) {
    $scope.song = song
    setMode('songDetail')
  }

  $scope.toggleWrap = function() {
    $scope.noWrap = !$scope.noWrap
  }

  $scope.simpleFormat = function(text) {
    return '<p>' + $scope.song.lyrics.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />') + '</p>';
  }




  /**
   * Favs
   */

  $scope.favs = favs;



  // load data

  $scope.mode = 'loading'
  setMode('loading')

  db.then(function(data) {
    angular.extend($scope, data);
    setMode('list')
  });


}]);









//
// Services
//




PB.factory('db', ['$http', function($http) {
  return $http.get('/database.json', {cache: true}).then(function(resp) {
    return resp.data
  });
}]);



PB.factory('favs', function() {
  var _favs = [];

  var load = function() {
    var json = localStorage.getItem('_favs');
    if (json) _favs = JSON.parse(json);
  }
  load();

  var save = function() {
    localStorage.setItem('_favs', JSON.stringify(_favs));
  }

  return {

    list: function() {
      return _favs;
    },

    contains: function(songId) {
      return _favs.indexOf(songId) > -1;
    },

    add: function(songId) {
      _favs.push(songId);
      save();
    },

    remove: function(songId) {
      var index = _favs.indexOf(songId);
      if (index > -1) {
        _favs.splice(index, 1);
        save();
      }
    },

  }


});


PB.directive('ngTap', function() {
  return function(scope, element, attrs) {
    var tapping;
    tapping = false;
    element.bind('touchstart', function(e) {
      element.addClass('active');
      tapping = true;
    });
    element.bind('touchmove', function(e) {
      element.removeClass('active');
      tapping = false;
    });
    element.bind('touchend', function(e) {
      element.removeClass('active');
      if (tapping) {
        scope.$apply(attrs.ngTap, element);
      }
    });
  };
});
