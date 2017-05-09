'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  express = require('./express'),
  path = require('path'),
  chalk = require('chalk');


module.exports.init = function init(callback) {
  var app = express.init();
  if (callback) callback(app, config);

};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function(app, config) {

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function() {
      // Create server URL
      var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;
      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
      console.log(chalk.green('Port:\t\t\t\t' + config.port));
      console.log(chalk.green('Redis:\t\t\t\t' + config.redis.host+':'+config.redis.port));
      if (process.env.NODE_ENV === 'secure') {
        console.log(chalk.green('HTTPs:\t\t\t\ton'));
      }
      console.log(chalk.green('App version:     ' + config.jldp.version));
      if (config.jldp['jldp-version'])
        console.log(chalk.green('JLDP version: ' + config.jldp['jldp-version']));
      console.log('--');

      if (callback) callback(app, config);
    });

  });

};
