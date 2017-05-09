'use strict';

module.exports = {
  app: {
    title: 'Jldp Web',
    description: 'Jldp Web',
    keywords: 'Jldp Web'
  },
  port: process.env.PORT || 80,
  host: process.env.HOST || '0.0.0.0',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 1 hours
    maxAge: 1 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'JLDP',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'jldpsessionid',
  // sessionCollection: 'sessions',
  logo: 'modules/users/client/img/logo.png',
  favicon: 'modules/users/client/img/favicon.ico',
  // Lusca config
  csrf: {
    csrf: false,
    csp: { /* Content Security Policy object */
      //policy:{'default-src': '\'self\'','img-src': '*','font-src':'*'}
    },
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  }
};
