'use strict';

// Authentication service for user variables
angular.module('users').service('toasterBusService', ['$rootScope',
  function($rootScope) {
    var channel = $rootScope.$bus.channel('toaster');
    var toashterbus = {
      request: function(msg) {
        return channel.request({ topic: 'toaster.request.pop', data: msg });
      },
      publish: function(msg) {
        return channel.publish({ topic: 'toaster.pop', data: msg });
      },
      clear: function(toster) {
        return channel.publish({ topic: 'toaster.clear', data: toster });
      },
      newGuid: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

    };

    return toashterbus;
  }
]);
