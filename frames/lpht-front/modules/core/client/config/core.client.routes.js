'use strict';

/**
 * Config for the router
 */
angular.module('core')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
              $rootScope.$state = $state;
              $rootScope.$stateParams = $stateParams;
            }
        ]
    );
