'use strict';

/**
 * Module dependencies.
 */

var path = require('path'),
  errorHandler = require(path.resolve('./modules/users/server/controllers/errors.server.controller')),
  passport = require('passport'),
  config = require(path.resolve('./config/config')),
  request = require('request');

exports.isAllowed = function(req, res, next) {
  var resources = (req.user) ? req.user.resources : [];
  if (!resources) return next();

  resources.forEach(function(resource) {
    if (req.path === resource.url) {
      if (resource.allowed) {
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
  return next();
};

/*
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err || !user) {
      res. /*status(400).*/ send(info);
    } else {
      user.password = undefined;
      user.salt = undefined;
      req.login(user, function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signup
 */
exports.signup = function(req, res) {//console.log(req.user);
  // For security measurement we remove the roles from the req.body object
  if (config.api.type === 'http' && req.user) {
    var token = req.user['x-auth-token'];
    if (token) {
      var headers = {};
      var values = {
        for  : req.connection.remoteAddress || req.socket.remoteAddress
      };
      ['for'].forEach(function(header) {
        headers['x-forwarded-' + header] =
          (req.headers['x-forwarded-' + header] || '') +
          (req.headers['x-forwarded-' + header] ? ',' : '') +
          values[header];
      });
      headers['x-auth-token'] = token;
      //console.log(headers)
      request({
        url: config.api.uri + '/api/security/auth/signup',
        method: 'get',
        headers: headers
      }, function(error, response, data) {
         //console.log('*********'+error);
      });
    }
  }
  req.logout();
  res.json({});
};
