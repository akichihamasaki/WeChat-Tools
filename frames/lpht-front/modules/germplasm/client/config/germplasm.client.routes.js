'use strict';
/**
 * Config for the router
 */
angular.module('lpht.germplasm')
  .config(
    ['$stateProvider', 'JQ_CONFIG',
      function($stateProvider, JQ_CONFIG) {
        $stateProvider
          //种质资源
          .state('app.lpht.germplasm', {
            abstract: true,
            url: '/germplasm',
            template: '<div ui-view class="fade-in-up"></div>'
          })
          //货位管理
          .state('app.lpht.germplasm.goodslocation', {
            url: '/goodslocation',
            templateUrl: 'modules/germplasm/client/views/goodslocation.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['angularBootstrapNavTree']).then(
                    function() {
                      return $ocLazyLoad.load(['modules/germplasm/client/controllers/goodslocation.client.controller.js']);
                    }
                  );
                }
              ]
            },
            params: {
              cropType: '1'
            }
          })
          //品种组合
          .state('app.lpht.germplasm.breedconbination', {
            url: '/breedconbination',
            templateUrl: 'modules/germplasm/client/views/breedconbination.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/breedconbination.client.controller.js']);
                }
              ]
            }
          })
          //入库申请
          .state('app.lpht.germplasm.instockform', {
            url: '/instockform',
            templateUrl: 'modules/germplasm/client/views/instockform.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/instockform.client.controller.js']);
                }
              ]
            }
          })
          //入库单审核
          .state('app.lpht.germplasm.instockformcheck', {
            url: '/instockformcheck',
            templateUrl: 'modules/germplasm/client/views/instockformcheck.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/instockformcheck.client.controller.js']);
                }
              ]
            }
          })
          //出库申请
          .state('app.lpht.germplasm.outstockform', {
            url: '/outstockform',
            templateUrl: 'modules/germplasm/client/views/outstockform.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/outstockform.client.controller.js']);
                }
              ]
            }
          })
          //出库单审核
          .state('app.lpht.germplasm.outstockformcheck', {
            url: '/outstockformcheck',
            templateUrl: 'modules/germplasm/client/views/outstockformcheck.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/outstockformcheck.client.controller.js']);
                }
              ]
            }
          })
          //出库
          .state('app.lpht.germplasm.outstock', {
            url: '/outstock',
            templateUrl: 'modules/germplasm/client/views/outstock.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('ngFileUpload').then(
                    function() {
                      return $ocLazyLoad.load(['modules/germplasm/client/controllers/outstock.client.controller.js']);
                    }
                  );
                }
              ]
            }
          })
          //育种材料
          .state('app.lpht.germplasm.breedingdata', {
            url: '/breedingdata',
            templateUrl: 'modules/germplasm/client/views/breedingdata.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/breedingdata.client.controller.js']);
                }
              ]
            }
          })
          //繁种警戒数量提醒
          .state('app.lpht.germplasm.breedingremind', {
            url: '/breedingremind',
            templateUrl: 'modules/germplasm/client/views/breedingremind.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/breedingremind.client.controller.js']);
                }
              ]
            }
          })
          //繁种警戒时间提醒
          .state('app.lpht.germplasm.breedingremindtime', {
            url: '/breedingremindtime',
            templateUrl: 'modules/germplasm/client/views/breedingremindtime.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/breedingremindtime.client.controller.js']);
                }
              ]
            }
          })
          //材料分组
          .state('app.lpht.germplasm.materialuse', {
            url: '/materialuse',
            templateUrl: 'modules/germplasm/client/views/materialuse.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/materialuse.client.controller.js']);
                }
              ]
            },
            params: {
              cropType: '1'
            }
          })
          //库存查询
          .state('app.lpht.germplasm.stockquery', {
            url: '/stockquery',
            templateUrl: 'modules/germplasm/client/views/stockquery.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/stockquery.client.controller.js']);
                }
              ]
            }
          })
           //淘汰清单
          .state('app.lpht.germplasm.obsoletelist', {
            url: '/obsoletelist',
            templateUrl: 'modules/germplasm/client/views/obsoletelist.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/obsoletelist.client.controller.js']);
                }
              ]
            }
          })
          //淘汰确认
          .state('app.lpht.germplasm.obsoleteaffirm', {
            url: '/obsoleteaffirm',
            templateUrl: 'modules/germplasm/client/views/obsoleteaffirm.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/obsoleteaffirm.client.controller.js']);
                }
              ]
            }
          })
          //盘点
          .state('app.lpht.germplasm.checkbatch', {
            url: '/checkbatch',
            templateUrl: 'modules/germplasm/client/views/checkbatch.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/checkbatch.client.controller.js']);
                }
              ]
            }
          })
          //数据录入
          .state('app.lpht.germplasm.dataentering', {
            url: '/dataentering',
            templateUrl: 'modules/germplasm/client/views/dataentering.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/dataentering.client.controller.js']);
                }
              ]
            }
          })
          //数据审核
          .state('app.lpht.germplasm.dataverify', {
            url: '/dataverify',
            templateUrl: 'modules/germplasm/client/views/dataverify.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/germplasm/client/controllers/dataverify.client.controller.js']);
                }
              ]
            }
          });
      }
    ]
  );
