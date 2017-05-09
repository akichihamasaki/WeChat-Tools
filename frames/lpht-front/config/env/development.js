'use strict';

var defaultEnvConfig = require('./default');

module.exports = {
  redis: {
    host:'172.16.17.220',
    port:6379
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      // directoryPath: process.cwd(),
      // fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  port: process.env.PORT || 8000,

  api: {
    //local:本地json
    //http :代理远程服务 target为服务器地址
    type: 'local',
    uri: 'http://127.0.0.1:8080'
  },
  livereload: true
};
