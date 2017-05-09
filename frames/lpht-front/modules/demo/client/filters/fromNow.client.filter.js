'use strict';

/* Filters */
// need load the moment.js to use this filter.
angular.module('demo')
  .filter('fromNow', function() {
    return function(date) {
      return window.moment(date).fromNow();
    };
  });
