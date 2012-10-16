//
// Services
//

PB.directive('pbBody', ['$rootScope', function($rootScope) {
  return {
    link: function postLink(scope, el, attrs) {
      $rootScope.$on('$routeChangeSuccess', function(ev, route, three) {
        if (route.$route.templateUrl === 'home.html')
          el.addClass('home')
        else
          el.removeClass('home')
      })
    }
  };
}]);

PB.factory('db', ['$http', '$q', function($http, $q) {
  var deferred = $q.defer()
  var data = localStorage.getItem('pickbook-data')


  if (data) {
    data = JSON.parse(data)
    deferred.resolve(data)
  }
  else {
    $http.get('/everything.json', {cache: true}).then(function(resp) {
      localStorage.setItem('pickbook-data', JSON.stringify(resp.data))
      deferred.resolve(resp.data)
    });
  }

  return deferred.promise;
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


