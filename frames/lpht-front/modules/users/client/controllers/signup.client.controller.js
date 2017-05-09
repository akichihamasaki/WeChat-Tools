'use strict';

// signup controller
angular.module('users').controller('SignupFormController', ['$scope', '$http', '$state', 'Authentication', function($scope, $http, $state, Authentication) {
  $scope.authentication = Authentication;
  $scope.user = {};
  $scope.authError = null;
  $scope.authentication.user = '';

  $http.get('/rest/security/auth/signup')
    .success(function(response) {
      $state.go('access.signin');
    }).error(function(x) {
      $scope.authError = 'Server Error';
    });

}]);
