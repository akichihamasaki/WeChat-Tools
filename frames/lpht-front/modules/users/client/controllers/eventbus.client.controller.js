'use strict';

angular.module('users').controller('EventBusController', ['$scope', 'toaster',
  function($scope, toaster) {
    var toasterId=0;
    $scope.$bus.subscribe({ channel: 'toaster', topic: 'toaster.request.pop',
      callback: function(data, envelope) {
        // `data` is the data published by the publisher.
        // `envelope` is a wrapper around the data & contains
        // metadata about the message like the channel, topic,
        // timestamp and any other data which might have been
        // added by the sender.
        angular.extend(data, { toasterId: toasterId });
        var loadToaster = toaster.pop(data);
        envelope.reply(null,loadToaster);
      }
    });
    $scope.$bus.subscribe({ channel: 'toaster', topic: 'toaster.pop',
      callback: function(data, envelope) {
        // `data` is the data published by the publisher.
        // `envelope` is a wrapper around the data & contains
        // metadata about the message like the channel, topic,
        // timestamp and any other data which might have been
        // added by the sender.
        angular.extend(data, { toasterId: toasterId });
        var loadToaster = toaster.pop(data);
      }
    });
    $scope.$bus.subscribe({ channel: 'toaster', topic: 'toaster.clear',
      callback: function(data, envelope) {
        // `data` is the data published by the publisher.
        // `envelope` is a wrapper around the data & contains
        // metadata about the message like the channel, topic,
        // timestamp and any other data which might have been
        // added by the sender.
        angular.extend(data, { toasterId: toasterId });
        toaster.clear(data);
      }
    });
  }
]);
