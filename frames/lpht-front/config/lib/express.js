'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  express = require('express'),
  morgan = require('morgan'),
  logger = require('./logger'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  redisStore = require('connect-redis')(session),
  favicon = require('serve-favicon'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  httpProxy = require('http-proxy'),
  helmet = require('helmet'),
  flash = require('connect-flash'),
  consolidate = require('consolidate'),
  path = require('path'),
  fs = require('fs'),
  _ = require('lodash');

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function(app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.jsFiles = config.files.client.js;
  app.locals.cssFiles = config.files.client.css;
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;

  // Passing the request url to environment locals
  app.use(function(req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function(app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Initialize favicon middleware
  app.use(favicon(app.locals.favicon));

  // Enable logger (morgan)
  app.use(morgan(logger.getFormat(), logger.getOptions()));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // app.use('/api/security/auth/signin|/api/security/auth/signup',function(req,res,next){
  //   console.log('**************'+req.originalUrl);
  //   next();
  // });

  // Request body parsing middleware should be above methodOverride
  app.use('/:url(rest|modules|lib)/*',bodyParser.urlencoded({
    extended: true
  }));
  app.use('/:url(rest|modules|lib)/*',bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());

};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function(app) {
  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './');
};

/**
 * Configure Express session
 */
module.exports.initSession = function(app) {
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    key: config.sessionKey,
    store: new redisStore(config.redis)
  }));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function(app) {
  config.files.server.configs.forEach(function(configPath) {
    require(path.resolve(configPath))(app);
  });
};

// module.exports.initHttpProxy = function(app) {
//   if (config.api.type === 'local') {
//     app.route('/api/*').all(function(req, res) {
//       var json = fs.readFileSync(path.resolve('.' + req.path), 'utf-8');
//       res.type('json');
//       res.send(json);
//       //res.sendStatus(401);
//     });
//   } else if (config.api.type === 'http') {
//     var proxy = httpProxy.createProxyServer({ xfwd: true });
//     proxy.on('proxyReq', function(proxyReq, req, res) {//console.log('**************'+JSON.stringify(req.user));
//       if (req.isAuthenticated() && req.user['x-auth-token']) {
//         proxyReq.setHeader('x-auth-token', req.user['x-auth-token']);
//       }
//     });
//     app.route('/api/*').all(function(req, res, next) {
//       // console.log('******' + req.path);
//       proxy.web(req, res, { target: config.api.uri });
//     });
//   }

// };

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function(app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  //于设置 X-Frame-Options 头，提供 clickjacking 保护
  app.use(helmet.frameguard());
  //用于设置 X-XSS-Protection，在最新的 Web 浏览器中启用跨站点脚本编制 (XSS) 过滤器。
  app.use(helmet.xssFilter());
  //用于设置 X-Content-Type-Options，以防止攻击者以 MIME 方式嗅探浏览器发出的响应中声明的 content-type
  app.use(helmet.noSniff());
  //用于为 IE8+ 设置 X-Download-Options
  app.use(helmet.ieNoOpen());
  //用于设置 Strict-Transport-Security 头，实施安全的服务器连接 (HTTP over SSL/TLS)。
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function(app) {
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./public')));

  // Globbing static routing
  config.folders.client.forEach(function(staticPath) {
    app.use(staticPath, express.static(path.resolve('./' + staticPath)));
  });

};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function(app) {
  // Globbing policy files
  config.files.server.policies.forEach(function(policyPath) {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function(app) {
  // Globbing routing files
  config.files.server.routes.forEach(function(routePath) {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function(app) {
  app.use(function(err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function(app) {
  // Load the Socket.io configuration
  var server = require('./socket.io')(app);

  // Return server object
  return server;
};

/**
 * Initialize the Express application
 */
module.exports.init = function() {
  // Initialize express app
  var app = express();

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Express session
  this.initSession(app);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // this.initHttpProxy(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  app = this.configureSocketIO(app);

  return app;
};
