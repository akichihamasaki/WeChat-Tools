'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function($q, $injector) {
    return {
      responseError: function(rejection) {
        if (rejection.config && !rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('access.signup');
              break;
            case 403:
              $injector.get('$state').transitionTo('access.403');
              break;
            case 500:
              $injector.get('$state').transitionTo('access.500');
              break;
            case 502:
              $injector.get('$state').transitionTo('access.502');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);
