'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  defaultAssets = require('./config/assets/default'),
  fs = require('fs'),
  path = require('path');

module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    watch: {
      serverViews: {
        files: defaultAssets.server.views,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS),
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: defaultAssets.client.views,
        options: {
          livereload: true
        }
      },
      clientJS: {
        files: _.union(defaultAssets.client.js,defaultAssets.client.controllerjs),
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: defaultAssets.client.css,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      },
      // clientSCSS: {
      //   files: defaultAssets.client.sass,
      //   tasks: ['sass', 'csslint'],
      //   options: {
      //     livereload: true
      //   }
      // },
      clientLESS: {
        files: defaultAssets.client.less,
        tasks: ['less', 'csslint'],
        options: {
          livereload: true
        }
      }

    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true
      }
    },
    jshint: {
      all: {
        src: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS, defaultAssets.client.js,defaultAssets.client.controllerjs),
        options: {
          jshintrc: true,
          node: true,
          mocha: true,
          jasmine: true
        }
      }
    },
    eslint: {
      options: {},
      target: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS, defaultAssets.client.js,defaultAssets.client.controllerjs)
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: defaultAssets.client.css
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['modules/*/client/config/*routes.js'],
        dest: 'public/dist/application.src.js'
      },
      options: {
        livereload: true
      }
    },
    ngAnnotate: {
      production: {
        files: {
          'public/dist/application.js': defaultAssets.client.js
        }
      }
    },
    uglify: {
      production: {
        options: {
          mangle: false
        },
        files: {
          'public/dist/application.min.js': 'app/dist/application.js'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/dist/application.min.css': defaultAssets.client.css
        }
      }
    },
    // sass: {
    //   dist: {
    //     files: [{
    //       expand: true,
    //       src: defaultAssets.client.sass,
    //       ext: '.css',
    //       rename: function (base, src) {
    //         return src.replace('/scss/', '/css/');
    //       }
    //     }]
    //   }
    // },
    less: {
      dist: {
        files: [{
          expand: true,
          src: defaultAssets.client.less,
          ext: '.css',
          rename: function (base, src) {
            return src.replace('/less/', '/css/');
          }
        }]
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    protractor: {
      options: {
        configFile: 'protractor.conf.js',
        noColor: false,
        webdriverManagerUpdate: true
      },
      e2e: {
        options: {
          args: {} // Target-specific arguments
        }
      }
    },
    copy: {
      localConfig: {
        src: 'config/env/local.example.js',
        dest: 'config/env/local.js',
        filter: function () {
          return !fs.existsSync('config/env/local.js');
        }
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);
//  grunt.loadNpmTasks('grunt-protractor-coverage');


  grunt.task.registerTask('server', 'Starting the server', function () {
    // Get the callback
    var done = this.async();

    var path = require('path');
    var app = require(path.resolve('./config/lib/app'));
    var server = app.start(function () {
      done();
    });
  });

  // Lint CSS and JavaScript files.
  grunt.registerTask('lint', [/*'sass',*/ 'less', 'jshint', 'eslint', 'csslint'/*,'concat:dist'*/]);

  // Lint project files and minify them into two production files.
  grunt.registerTask('build', ['env:dev', 'lint', 'ngAnnotate', 'uglify', 'cssmin']);

  // Run the project in development mode
  grunt.registerTask('default', ['env:dev', 'lint', 'concurrent:default']);

  // Run the project in debug mode
  grunt.registerTask('debug', ['env:dev', 'lint', 'concurrent:debug']);

  // Run the project in production mode
  grunt.registerTask('prod', ['build', 'env:prod', 'concurrent:default']);
};
