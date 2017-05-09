'use strict';

angular.module('users').controller('AsideController', ['$scope', '$state', '$http', 'Authentication',
  function($scope, $state, $http, Authentication) {
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.menu = [];
    $http.get('/api/security/auth/getmenus')
      .success(function(response) {
        $scope.menu = response;
      })
      .error(function(response) {
        console.log(response);
      });
    // console.log('********************************');
  }
]);
