'use strict';

var httpProxy = require('http-proxy'),
  fs = require('fs'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

module.exports = function(app) {
  var users = require('../controllers/users.server.controller');
  //app.route('/api/**').all(users.isAllowed);
  app.route('/rest/security/auth/signin').post(users.signin);
  app.route('/rest/security/auth/signup').get(users.signup);

  // app.route('/api/*').all(function(req,res,next){
  //   console.log('**************************'+req.path);
  // });

  if (config.api.type === 'local') {
    app.route('/api/*').all(function(req, res) {
      fs.access(path.resolve('./api' + req.path),fs.constants.R_OK,function(err){
        if(err){
          res.status(502).send(err).end();
        }else{
          var json = fs.readFileSync(path.resolve('./api' + req.path), 'utf-8');
          res.type('json');
          res.send(json);
        }
      });
      // var json = fs.readFileSync(path.resolve('./api' + req.path), 'utf-8');
      // res.type('json');
      // res.send(json);
      //res.sendStatus(401);
    });
  } else if (config.api.type === 'http') {
    var proxy = httpProxy.createProxyServer({ xfwd: true });
    proxy.on('proxyReq', function(proxyReq, req, res) {//console.log('**************'+JSON.stringify(req.user));
      if (req.isAuthenticated() && req.user['x-auth-token']) {
        proxyReq.setHeader('x-auth-token', req.user['x-auth-token']);
      }
    });
    proxy.on('error',function(err,req,res){
      //console.log('*************'+err);
      res.status(502).send(err).end();
    });
    app.route('/api/*').all(function(req, res, next) {
      // console.log('******' + req.path);
      proxy.web(req, res, { target: config.api.uri });
    });
  }

};
