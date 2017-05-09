'use strict';

angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

var app=angular.module(ApplicationConfiguration.applicationModuleName)
  // .config(
  //   ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
  //     function($controllerProvider, $compileProvider, $filterProvider, $provide) {

  //       // lazy controller, directive and service
  //       app.controller = $controllerProvider.register;
  //       app.directive = $compileProvider.directive;
  //       app.filter = $filterProvider.register;
  //       app.factory = $provide.factory;
  //       app.service = $provide.service;
  //       app.constant = $provide.constant;
  //       app.value = $provide.value;
  //     }
  //   ])
  .config(['$provide', function($provide) {
    $provide.decorator('$rootScope', ['$delegate', function($delegate) {
      Object.defineProperty($delegate.constructor.prototype, '$bus', {
        get: function() {
          var self = this;
          return {
            subscribe: function() {
              var sub = postal.subscribe.apply(postal, arguments);
              self.$on('$destroy', function() {
                sub.unsubscribe();
              });
              return sub;
            },
            channel: postal.channel.bind(postal),
            publish: postal.publish.bind(postal),
            unsubscribe: postal.unsubscribe.bind(postal)
          };
        },
        enumerable: false
      });

      return $delegate;
    }]);
  }])
  .run(['$q',function($q){
    // We need to tell postal how to get a deferred instance
    postal.configuration.promise.createDeferred = function() {
      return $q.defer();
    };
    // We need to tell postal how to get a "public-facing"/safe promise instance
    postal.configuration.promise.getPromise = function(dfd) {
      return dfd.promise;
    };
  }])
  .config(['$translateProvider', function($translateProvider) {
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    // $translateProvider.useStaticFilesLoader({
    //   prefix: 'l10n/',
    //   suffix: '.js'
    // });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('zh-cn');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }])
  // .config(['i18nConstants', function(i18nConstants) {
  //   i18nConstants.DEFAULT_LANG = 'zh-cn';
  // }])
  .config(['$locationProvider', '$httpProvider', function($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $httpProvider.interceptors.push('authInterceptor');
  }])
  .run(['$rootScope', '$state', '$http', 'Authentication', function($rootScope, $state, $http, Authentication) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      var allowed = false;
      if(toState.data && toState.data.ignoreState){
        allowed=true;
      }
      if (!allowed) {

        if (Authentication.user !== undefined && typeof Authentication.user === 'object' && Authentication.user !==null){
          // console.log(Authentication.user);
        }else{
          event.preventDefault();
          $state.go('access.signin').then(function() {
            storePreviousState(toState, toParams);
          });
        }
      }
      // if (toState.data && toState.data.menuCode) {
      //   var menuCodes = Authentication.user.menuCodes || [];
      //   var allowed = false;
      //   menuCodes.forEach(function(code) {
      //     if (code === toState.data.menuCode) {
      //       allowed = true;
      //       return true;
      //     }
      //   });
      //   if (!allowed) {
      //     event.preventDefault();
      //     if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
      //       $state.go('access.403');
      //     } else {
      //       $state.go('access.signin').then(function() {
      //         storePreviousState(toState, toParams);
      //       });
      //     }
      //   }
      // }
    });

    // Record previous state
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      storePreviousState(fromState, fromParams);
    });

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
    }

  }]);

angular.element(document).ready(function () {
  angular.bootstrap(document,[ApplicationConfiguration.applicationModuleName]);
});
