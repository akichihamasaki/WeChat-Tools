'use strict';
/**
 * Config for the router
 */
angular.module('users')
  .config(
    ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
      function($stateProvider, $urlRouterProvider, JQ_CONFIG) {

        $urlRouterProvider
          .otherwise('/access/signin');
        $stateProvider
          .state('access', {
            url: '/access',
            template: '<div ui-view class="fade-in-right-big smooth app-header"></div>'
          })
          .state('access.signin', {
            url: '/signin',
            templateUrl: 'modules/users/client/views/page_signin.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/users/client/controllers/signin.client.controller.js']);
                }
              ]
            },
            data: {
              ignoreState: true
            }
          })
          .state('access.signup', {
            url: '/signup',
            templateUrl: 'modules/users/client/views/page_signup.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/users/client/controllers/signup.client.controller.js']);
                }
              ]
            },
            data: {
              ignoreState: true
            }
          })
          .state('access.404', {
            url: '/404',
            templateUrl: 'modules/users/client/views/page_404.client.view.html',
            data: {
              ignoreState: true
            }
          })
          .state('access.403', {
            url: '/403',
            templateUrl: 'modules/users/client/views/page_403.client.view.html',
            data: {
              ignoreState: true
            }
          })
          .state('access.500', {
            url: '/500',
            templateUrl: 'modules/users/client/views/page_500.client.view.html',
            data: {
              ignoreState: true
            }
          })
          .state('access.502', {
            url: '/502',
            templateUrl: 'modules/users/client/views/page_502.client.view.html',
            data: {
              ignoreState: true
            }
          })
          .state('app', {
            abstract: true,
            url: '/app',
            templateUrl: 'modules/users/client/views/app.client.view.html',
            resolve: {
              deps: ['$$animateJs', '$ocLazyLoad',
                function($$animateJs, $ocLazyLoad,toaster) {
                  return $ocLazyLoad.load(['ui.grid','toaster']).then(
                    function() {
                      return $ocLazyLoad.load([
                        'modules/users/client/controllers/aside.client.controller.js',
                        'modules/users/client/controllers/header.client.controller.js',
                        'modules/users/client/controllers/eventbus.client.controller.js'
                      ]);
                    }
                  );
                }
              ],
              config: ['deps', 'i18nConstants', function(deps, i18nConstants) {
                i18nConstants.DEFAULT_LANG = 'zh-cn';
              }]
            }
          })
          /*.state('app.home', {
            url: '/home',
            templateUrl: 'modules/users/client/views/app_home.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/users/client/controllers/home.client.controller.js']);
                }
              ]
            }
          })*/
          .state('app.security', {
            abstract: true,
            url: '/security',
            template: '<div ui-view class="fade-in-up"></div>',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['ngDialog', 'toaster']);
                }
              ]
            }
          })

        //操作日志
        .state('app.security.operationlog', {
          url: '/operationlog',
          templateUrl: 'modules/users/client/views/operationlog.client.view.html',
          resolve: {
            deps: ['$ocLazyLoad',
                function($ocLazyLoad) {

                  return $ocLazyLoad.load(['modules/users/client/controllers/operationlog.client.controller.js']);

                }
              ]
          }
        })
          //菜单管理
          .state('app.security.menumanager', {
            url: '/menumanager',
            templateUrl: 'modules/users/client/views/menumanager.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('angularBootstrapNavTree').then(function() {
                    return $ocLazyLoad.load(['modules/users/client/controllers/menumanager.client.controller.js']);
                  });
                }
              ]
            }
          })
          //机构人员
          .state('app.security.orgmanager', {
            url: '/orgmanager',
            templateUrl: 'modules/users/client/views/orgmanager.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  // return $ocLazyLoad.load(['angularBootstrapNavTree','ui.grid']).then(function(){
                  return $ocLazyLoad.load(['modules/users/client/controllers/orgmanager.client.controller.js']);

                }
              ]
            }
          })
          //用户管理
          .state('app.security.usermanager', {
            url: '/usermanager',
            templateUrl: 'modules/users/client/views/usermanager.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {

                  return $ocLazyLoad.load(['modules/users/client/controllers/usermanager.client.controller.js']);

                }
              ]
            }
          })
          //角色管理
          .state('app.security.rolemanager', {
            url: '/rolemanager',
            templateUrl: 'modules/users/client/views/rolemanager.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {

                  return $ocLazyLoad.load(['modules/users/client/controllers/rolemanager.client.controller.js']);

                }
              ]
            }
          })
          //数据字典
          .state('app.security.basecode', {
            url: '/basecode',
            templateUrl: 'modules/users/client/views/basecode.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {

                  return $ocLazyLoad.load(['modules/users/client/controllers/basecode.client.controller.js']);

                }
              ]
            }
          })
          //个人信息
          .state('app.userinfo', {
            url: '/userinfo',
            templateUrl: 'modules/users/client/views/userinfo.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad', '$window',
                function($ocLazyLoad, $window) {
                  $window.FileAPI = {
                    jsUrl: 'lib/ng-file-upload/FileAPI.js',
                    flashUrl: 'lib/ng-file-upload/FileAPI.flash.swf'
                  };
                  return $ocLazyLoad.load(['toaster','ngImgCrop','ngDialog','ngFileUpload']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/users/client/controllers/userinfo.client.controller.js']);

                    }
                  );
                }
              ]
            }
          });
      }
    ]
  );
