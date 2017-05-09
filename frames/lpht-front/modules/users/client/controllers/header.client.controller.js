'use strict';

angular.module('users').controller('HeaderController', ['$scope', '$state', '$http', 'Authentication',
  function($scope, $state, $http, Authentication) {
    var vm = $scope.vm = {};
    $scope.$state = $state;
    $scope.authentication = Authentication;

    //消息通知json（小铃铛）
    // $http.get('api/rice/inform,notice,task')
    //   .success(function(data) {
    //     vm.inform = data.inform;
    //   })
    //   .error(function(data) {

    //   });
  }
]);
