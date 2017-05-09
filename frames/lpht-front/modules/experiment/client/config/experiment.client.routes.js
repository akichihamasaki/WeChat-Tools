'use strict';
/**
 * Config for the router
 */
angular.module('lpht.experiment')
  .config(
    ['$stateProvider', 'JQ_CONFIG',
      function($stateProvider, JQ_CONFIG) {
        $stateProvider
          //试验管理
          .state('app.lpht.experiment', {
            abstract: true,
            url: '/experiment',
            template: '<div ui-view class="fade-in-up"></div>'
          });
      }
    ]
  );
