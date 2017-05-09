'use strict';

/**
 * Render the main application page
 */
exports.renderIndex = function(req, res) {//console.log('*****'+req.user);
  var u ;
  if(req.user){
    u=Object.assign({},req.user);
    u['x-auth-token'] = undefined;
  }
  res.render('modules/users/server/views/index', {
    user: u || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function(req, res) {
  res.status(500).render('modules/users/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function(req, res) {

  res.status(404).format({
    'text/html': function() {
      res.render('modules/users/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function() {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function() {
      res.send('Path not found');
    }
  });
};
