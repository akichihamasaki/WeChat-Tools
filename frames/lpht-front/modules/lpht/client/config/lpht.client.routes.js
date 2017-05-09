'use strict';
/**
 * Config for the router
 */
angular.module('lpht.lpht')
  .config(
    ['$stateProvider', 'JQ_CONFIG',
      function($stateProvider, JQ_CONFIG) {

        $stateProvider
          .state('app.lpht.lpht', {
            abstract: true,
            url: '/lpht',
            template: '<div ui-view class="fade-in-up"></div>'
          })
          .state('app.lpht.lpht.messagepublish', {
            url: '/messagepublish',
            templateUrl: 'modules/lpht/client/views/messagepublish.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['ngFileUpload']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/lpht/client/controllers/messagepublish.client.controller.js']);
                    }
                  );
                }
              ]
            }
          })
          .state('app.lpht.lpht.basehelptypecode', {
            url: '/basehelptypecode',
            templateUrl: 'modules/lpht/client/views/basehelptypecode.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['ui.select']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/lpht/client/controllers/basehelptypecode.client.controller.js']);
                    }
                  );
                }
              ]
            }
          });
      }
    ]
  );
