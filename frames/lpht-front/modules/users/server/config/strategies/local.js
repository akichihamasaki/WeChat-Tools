'use strict';

/**
 * Module dependencies
 */

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  fs = require('fs'),
  path = require('path'),
  request = require('request');

module.exports = function(config) {
  passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true },
    function(req,username, password, done) {
      if (config.api.type === 'local') {
        var json = fs.readFileSync(path.resolve('./api/rest/security/auth/signin'), 'utf-8');
        var user=JSON.parse(json);
        return done(null,user);
      } else if (config.api.type === 'http') {
        var headers={};
        var values = {
          for  : req.connection.remoteAddress || req.socket.remoteAddress
        };
        ['for'].forEach(function(header) {
          headers['x-forwarded-' + header] =
            (req.headers['x-forwarded-' + header] || '') +
            (req.headers['x-forwarded-' + header] ? ',' : '') +
            values[header];
        });
        //headers['x-forwarded-host'] = req.headers['host'];
        request({
          url: config.api.uri + '/api/security/auth/signin',
          method: 'post',
          json: true,
          headers:headers,
          body: { 'username': username, 'password': password }
        }, function(error, response, data) {
          if (error) {
            return done(error);
          } else {
            if (!data.retcode) {
              var user = data;
              user['x-auth-token'] = response.headers['x-auth-token'];
              return done(null, user);
            } else {
              return done(null, false, data);
            }
          }
        });
      }
    }
  ));
};
