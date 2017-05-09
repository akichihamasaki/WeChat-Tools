'use strict';
/**
 * Config for the router
 */
angular.module('lpht.rice')
  .config(
    ['$stateProvider', 'JQ_CONFIG',
      function($stateProvider, JQ_CONFIG) {

        $stateProvider
          //主页
          .state('app.home', {
            url: '/home',
            templateUrl: 'modules/rice/client/views/mainpage.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['toaster']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/rice/client/controllers/mainpage.client.controller.js']);
                    }
                  );
                }
              ]
            }
          })
          .state('app.lpht', {
            abstract: true,
            url: '/lpht',
            template: '<div ui-view class="fade-in-up"></div>',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['ngDialog', 'toaster']);
                }
              ]
            }
          })
          .state('app.lpht.rice', {
            abstract: true,
            url: '/rice',
            template: '<div ui-view class="fade-in-up"></div>'
          })
          //田间布局
          .state('app.lpht.rice.fieldlayout', {
            url: '/fieldlayout',
            templateUrl: 'modules/rice/client/views/fieldlayout.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['ui.select']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/rice/client/controllers/fieldlayout.client.controller.js']);
                    }
                  );
                }
              ]
            }
          })
          //作物亚型
          .state('app.lpht.rice.cropsubtype', {
            url: '/cropsubtype',
            templateUrl: 'modules/rice/client/views/cropsubtype.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/rice/client/controllers/cropsubtype.client.controller.js']);
                }
              ]
            },
            params: {
              cropType: '1'
            }
          })
          //测试项目
          .state('app.lpht.rice.experimentproject', {
            url: '/experimentproject',
            templateUrl: 'modules/rice/client/views/experimentproject.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/rice/client/controllers/experimentproject.client.controller.js']);
                }
              ]
            }
          })
          //数据采集
          .state('app.lpht.rice.datacollection', {
            url: '/datacollection',
            templateUrl: 'modules/rice/client/views/datacollection.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  //ie9
                  /*$window.FileAPI = {
                    jsUrl: 'lib/ng-file-upload/FileAPI.js',
                    flashUrl: 'lib/ng-file-upload/FileAPI.flash.swf'
                  };*/
                  return $ocLazyLoad.load(['ngFileUpload']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/rice/client/controllers/datacollection.client.controller.js']);
                    }
                  );
                }
              ]
            }
          })
          //产季
          .state('app.lpht.rice.productseason', {
            url: '/productseason',
            templateUrl: 'modules/rice/client/views/productseason.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['toaster', 'ngDialog']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/rice/client/controllers/productseason.client.controller.js']);
                    }
                  );
                }
              ]
            }
          })
          //性状
          .state('app.lpht.rice.character', {
            url: '/character',
            templateUrl: 'modules/rice/client/views/character.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['toaster', 'ngDialog']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/rice/client/controllers/character.client.controller.js']);
                    }
                  );
                }
              ]
            },
            params: {
              cropType: '1'
            }
          })
          //性状组
          .state('app.lpht.rice.charactergroup', {
            url: '/charactergroup',
            templateUrl: 'modules/rice/client/views/charactergroup.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['toaster','ngDialog']).then(
                    function(){
                      return $ocLazyLoad.load(['modules/rice/client/controllers/charactergroup.client.controller.js']);
                    }
                  );
                }
              ]
            },
            params: {
              cropType: '1'
            }
          })
          .state('app.lpht.rice.stageandproject', {
            url: '/stageandproject',
            templateUrl: 'modules/rice/client/views/stageandproject.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['toaster', 'ngDialog']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/rice/client/controllers/stageandproject.client.controller.js']);
                    }
                  );
                }
              ]
            }
          })
          //熟期
          .state('app.lpht.rice.cropmaturity', {
            url: '/cropmaturity',
            templateUrl: 'modules/rice/client/views/cropmaturity.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/rice/client/controllers/cropmaturity.client.controller.js']);
                }
              ]
            }
          })
          //试验点
          .state('app.lpht.rice.experimentpoint', {
            url: '/experimentpoint',
            templateUrl: 'modules/rice/client/views/experimentpoint.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('ngFileUpload').then(
                    function() {
                      return $ocLazyLoad.load(['modules/rice/client/controllers/experimentpoint.client.controller.js']);
                    }
                  );
                }
              ]
            },
            params: {
              cropType: '1'
            }
          })
          //实验点类型
          .state('app.lpht.rice.experimenttype', {
            url: '/experimenttype',
            templateUrl: 'modules/rice/client/views/experimenttype.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/rice/client/controllers/experimenttype.client.controller.js']);
                }
              ]
            }
          })
          //性状单位
          .state('app.lpht.rice.charactermanager', {
            url: '/charactermanager',
            templateUrl: 'modules/rice/client/views/charactermanager.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/rice/client/controllers/charactermanager.client.controller.js']);
                }
              ]
            },
            params: {
              cropType: '1'
            }
          })
          //播种季节
          .state('app.lpht.rice.seedtime', {
            url: '/seedtime',
            templateUrl: 'modules/rice/client/views/seedtime.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/rice/client/controllers/seedtime.client.controller.js']);
                }
              ]
            }
          })
          .state('app.lpht.rice.ecotope', {
            url: '/ecotope',
            templateUrl: 'modules/rice/client/views/ecotope.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/rice/client/controllers/ecotope.client.controller.js']);
                }
              ]
            },
            params: {
              cropType: '1'
            }
          })
          .state('app.lpht.rice.characterclassify', {
            url: '/characterclassify',
            templateUrl: 'modules/rice/client/views/characterclassify.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/rice/client/controllers/characterclassify.client.controller.js']);
                }
              ]
            }
          })
          //试验阶段
          .state('app.lpht.rice.experimentstage', {
            url: '/experimentstage',
            templateUrl: 'modules/rice/client/views/experimentstage.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/rice/client/controllers/experimentstage.client.controller.js']);
                }
              ]
            }
          });
      }
    ]
  );
