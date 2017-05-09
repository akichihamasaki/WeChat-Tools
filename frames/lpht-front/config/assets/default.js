'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/animate.css/animate.css',
        'public/lib/font-awesome/css/font-awesome.css',
        'public/lib/simple-line-icons/css/simple-line-icons.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-cookies/angular-cookies.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-touch/angular-touch.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/ngstorage/ngStorage.min.js',
        'public/lib/angular-ui-load/ui-load.js',
        'public/lib/angular-ui-jq/ui-jq.js',
        'public/lib/angular-ui-scroll/dist/ui-scroll.js',
        'public/lib/angular-ui-scroll/dist/ui-scroll-jqlite.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/framework/angular-bootstrap/angular-locale_zh-cn.js',
        'public/lib/oclazyload/dist/ocLazyLoad.min.js',
        'public/lib/angular-translate/angular-translate.min.js',
        'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'public/lib/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
        'public/lib/angular-translate-storage-local/angular-translate-storage-local.min.js',
        'public/lib/lodash/dist/lodash.min.js',
        'public/lib/postal.js/lib/postal.min.js',
        'public/lib/postal.request-response/lib/postal.request-response.min.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/core/client/*.js',
      'modules/core/client/**/*.js',
      'modules/*/client/*.js',
      'modules/*/client/config/*.js',
      'modules/*/client/directives/*.js',
      'modules/*/client/filters/*.js',
      'modules/*/client/services/*.js'
    ],
    controllerjs:[
      'modules/*/client/controllers/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }

};
