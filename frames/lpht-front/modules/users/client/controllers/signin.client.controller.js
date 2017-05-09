'use strict';

/* Controllers */
// signin controller
angular.module('users').controller('SigninFormController', ['$scope', '$http', '$state', '$location', 'Authentication', function($scope, $http, $state, $location, Authentication) {
  $scope.authentication = Authentication;
  // If user is signed in then redirect back home
  if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
    //$location.path('/');
    $state.go('app.home');
  }

  $scope.user = {};
  $scope.authError = null;
  $scope.isSubmit = false;
  $scope.login = function() {
    $scope.authError = null;
    $scope.isSubmit = true;
    // Try to login
    $http.post('/rest/security/auth/signin', { username: $scope.user.username, password: $scope.user.password })
      .success(function(response) {
        var retcode = response.retcode;
        if (retcode) {
          if (retcode === 1000 || retcode === 1001) {
            $scope.authError = '用户名或密码错误';
          } else {
            $scope.authError = response.retmsg;
          }
          //'Email or Password not right';
        } else {
          $scope.authentication.user = response;
          //$state.go('app.home');
          $state.go($state.previous.state.name || 'app.home', $state.previous.params);
        }
        $scope.isSubmit = false;
      }).error(function(response) {
        var retcode = response.retcode;
        if (retcode) {
          if (retcode === 1000 || retcode === 1001) {
            $scope.authError = '用户名或密码错误';
          } else {
            $scope.authError = response.retmsg;
          }
          //'Email or Password not right';
        } else {
          $scope.authError = '服务端异常，请稍后.' + response;
        }
        $scope.isSubmit = false;
      });
  };
}]);
