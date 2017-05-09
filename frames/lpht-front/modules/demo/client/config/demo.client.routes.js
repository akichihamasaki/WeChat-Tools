'use strict';
/**
 * Config for the router
 */
angular.module('demo')
  .config(
    ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
      function($stateProvider, $urlRouterProvider, JQ_CONFIG) {

        $stateProvider
          .state('app.dashboard-v1', {
            url: '/dashboard-v1',
            templateUrl: 'modules/demo/client/views/app_dashboard_v1.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/demo/client/controllers/chart.client.controller.js']);
                }
              ]
            }
          })
          .state('app.dashboard-v2', {
            url: '/dashboard-v2',
            templateUrl: 'modules/demo/client/views/app_dashboard_v2.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/demo/client/controllers/chart.client.controller.js']);
                }
              ]
            }
          })
          .state('app.ui', {
            url: '/ui',
            template: '<div ui-view class="fade-in-up"></div>'
          })
          .state('app.ui.buttons', {
            url: '/buttons',
            templateUrl: 'modules/demo/client/views/ui_buttons.client.view.html'
          })
          .state('app.ui.icons', {
            url: '/icons',
            templateUrl: 'modules/demo/client/views/ui_icons.client.view.html'
          })
          .state('app.ui.grid', {
            url: '/grid',
            templateUrl: 'modules/demo/client/views/ui_grid.client.view.html'
          })
          .state('app.ui.widgets', {
            url: '/widgets',
            templateUrl: 'modules/demo/client/views/ui_widgets.client.view.html'
          })
          .state('app.ui.bootstrap', {
            url: '/bootstrap',
            templateUrl: 'modules/demo/client/views/ui_bootstrap.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('modules/demo/client/controllers/bootstrap.client.controller.js');
                }
              ]
            }
          })
          .state('app.ui.sortable', {
            url: '/sortable',
            templateUrl: 'modules/demo/client/views/ui_sortable.client.view.html'
          })
          .state('app.ui.scroll', {
            url: '/scroll',
            templateUrl: 'modules/demo/client/views/ui_scroll.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('modules/demo/client/controllers/scroll.client.controller.js');
                }
              ]
            }
          })
          .state('app.ui.portlet', {
            url: '/portlet',
            templateUrl: 'modules/demo/client/views/ui_portlet.client.view.html'
          })
          .state('app.ui.timeline', {
            url: '/timeline',
            templateUrl: 'modules/demo/client/views/ui_timeline.client.view.html'
          })
          .state('app.ui.tree', {
            url: '/tree',
            templateUrl: 'modules/demo/client/views/ui_tree.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('angularBootstrapNavTree').then(
                    function() {
                      return $ocLazyLoad.load('modules/demo/client/controllers/tree.client.controller.js');
                    }
                  );
                }
              ]
            }
          })
          .state('app.ui.toaster', {
            url: '/toaster',
            templateUrl: 'modules/demo/client/views/ui_toaster.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('toaster').then(
                    function() {
                      return $ocLazyLoad.load('modules/demo/client/controllers/toaster.client.controller.js');
                    }
                  );
                }
              ]
            }
          })
          .state('app.ui.jvectormap', {
            url: '/jvectormap',
            templateUrl: 'modules/demo/client/views/ui_jvectormap.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('modules/demo/client/controllers/vectormap.client.controller.js');
                }
              ]
            }
          })
          .state('app.ui.googlemap', {
            url: '/googlemap',
            templateUrl: 'modules/demo/client/views/ui_googlemap.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load([
                    'modules/demo/client/controllers/app/map/load-google-maps.js',
                    'modules/demo/client/controllers/app/map/ui-map.js',
                    'modules/demo/client/controllers/app/map/map.js'
                  ]).then(
                    function() {
                      return window.loadGoogleMaps();
                    }
                  );
                }
              ]
            }
          })
          .state('app.chart', {
            url: '/chart',
            templateUrl: 'modules/demo/client/views/ui_chart.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('modules/demo/client/controllers/chart.client.controller.js');
                }
              ]
            }
          })
          // table
          .state('app.table', {
            url: '/table',
            template: '<div ui-view></div>'
          })
          .state('app.table.static', {
            url: '/static',
            templateUrl: 'modules/demo/client/views/table_static.client.view.html'
          })
          .state('app.table.datatable', {
            url: '/datatable',
            templateUrl: 'modules/demo/client/views/table_datatable.client.view.html'
          })
          .state('app.table.footable', {
            url: '/footable',
            templateUrl: 'modules/demo/client/views/table_footable.client.view.html'
          })
          .state('app.table.uigrid', {
            url: '/uigrid',
            templateUrl: 'modules/demo/client/views/table_uigrid.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/demo/client/controllers/uigrid.client.controller.js']);
                }
              ]
            }
          })
          .state('app.table.editable', {
            url: '/editable',
            templateUrl: 'modules/demo/client/views/table_editable.client.view.html',
            controller: 'XeditableCtrl',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('xeditable').then(
                    function() {
                      return $ocLazyLoad.load('modules/demo/client/controllers/xeditable.client.controller.js');
                    }
                  );
                }
              ]
            }
          })
          .state('app.table.smart', {
            url: '/smart',
            templateUrl: 'modules/demo/client/views/table_smart.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('smart-table').then(
                    function() {
                      return $ocLazyLoad.load('modules/demo/client/controllers/table.client.controller.js');
                    }
                  );
                }
              ]
            }
          })
          // form
          .state('app.form', {
            url: '/form',
            template: '<div ui-view class="fade-in"></div>',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('modules/demo/client/controllers/form.client.controller.js');
                }
              ]
            }
          })
          .state('app.form.components', {
            url: '/components',
            templateUrl: 'modules/demo/client/views/form_components.client.view.html',
            resolve: {
              deps: ['uiLoad', '$ocLazyLoad',
                function(uiLoad, $ocLazyLoad) {
                  return uiLoad.load(JQ_CONFIG.daterangepicker)
                    .then(
                      function() {
                        return uiLoad.load('modules/demo/client/controllers/form.components.client.controller.js');
                      }
                    ).then(
                      function() {
                        return $ocLazyLoad.load('ngBootstrap');
                      }
                    );
                }
              ]
            }
          })
          .state('app.form.elements', {
            url: '/elements',
            templateUrl: 'modules/demo/client/views/form_elements.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('modules/demo/client/controllers/bootstrap.client.controller.js');
                }
              ]
            }
          })
          .state('app.form.validation', {
            url: '/validation',
            templateUrl: 'modules/demo/client/views/form_validation.client.view.html'
          })
          .state('app.form.wizard', {
            url: '/wizard',
            templateUrl: 'modules/demo/client/views/form_wizard.client.view.html'
          })
          .state('app.form.fileupload', {
            url: '/fileupload',
            templateUrl: 'modules/demo/client/views/form_fileupload.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('angularFileUpload').then(
                    function() {
                      return $ocLazyLoad.load('modules/demo/client/controllers/file-upload.client.controller.js');
                    }
                  );
                }
              ]
            }
          })
          .state('app.form.imagecrop', {
            url: '/imagecrop',
            templateUrl: 'modules/demo/client/views/form_imagecrop.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('ngImgCrop').then(
                    function() {
                      return $ocLazyLoad.load('modules/demo/client/controllers/imgcrop.client.controller.js');
                    }
                  );
                }
              ]
            }
          })
          .state('app.form.select', {
            url: '/select',
            templateUrl: 'modules/demo/client/views/form_select.client.view.html',
            controller: 'SelectCtrl',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('ui.select').then(
                    function() {
                      return $ocLazyLoad.load('modules/demo/client/controllers/select.client.controller.js');
                    }
                  );
                }
              ]
            }
          })
          .state('app.form.xeditable', {
            url: '/xeditable',
            templateUrl: 'modules/demo/client/views/form_xeditable.client.view.html',
            controller: 'XeditableCtrl',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('xeditable').then(
                    function() {
                      return $ocLazyLoad.load('modules/demo/client/controllers/xeditable.client.controller.js');
                    }
                  );
                }
              ]
            }
          })
          // pages
          .state('app.page', {
            url: '/page',
            template: '<div ui-view class="fade-in-down"></div>'
          })
          .state('app.page.profile', {
            url: '/profile',
            templateUrl: 'modules/demo/client/views/page_profile.client.view.html'
          })
          .state('app.page.post', {
            url: '/post',
            templateUrl: 'modules/demo/client/views/page_post.client.view.html'
          })
          .state('app.page.search', {
            url: '/search',
            templateUrl: 'modules/demo/client/views/page_search.client.view.html'
          })
          .state('app.page.invoice', {
            url: '/invoice',
            templateUrl: 'modules/demo/client/views/page_invoice.client.view.html'
          })
          .state('app.page.price', {
            url: '/price',
            templateUrl: 'modules/demo/client/views/page_price.client.view.html'
          })
          .state('app.docs', {
            url: '/docs',
            templateUrl: 'modules/demo/client/views/docs.client.view.html'
          })
          // others
          .state('lockme', {
            url: '/lockme',
            templateUrl: 'modules/demo/client/views/page_lockme.client.view.html'
          })
          // fullCalendar
          .state('app.calendar', {
            url: '/calendar',
            templateUrl: 'modules/demo/client/views/app_calendar.client.view.html',
            // use resolve to load other dependences
            resolve: {
              deps: ['$ocLazyLoad','uiLoad',
                function($ocLazyLoad,uiLoad) {
                  return uiLoad.load(
                    JQ_CONFIG.fullcalendar.concat('modules/demo/client/controllers/app/calendar/calendar.js')
                  ).then(
                    function() {
                      return $ocLazyLoad.load('ui.calendar');
                    }
                  );
                }
              ]
            }
          })

          // mail
          .state('app.mail', {
            abstract: true,
            url: '/mail',
            templateUrl: 'modules/demo/client/views/mail.client.view.html',
            // use resolve to load other dependences
            resolve: {
              deps: ['uiLoad',
                function(uiLoad) {
                  return uiLoad.load(['modules/demo/client/filters/fromNow.client.filter.js',
                   'modules/demo/client/controllers/app/mail/mail.js',
                    'modules/demo/client/controllers/app/mail/mail-service.js',
                    JQ_CONFIG.moment
                    ]);
                }
              ]
            }
          })
          .state('app.mail.list', {
            url: '/inbox/{fold}',
            templateUrl: 'modules/demo/client/views/mail.list.client.view.html'
          })
          .state('app.mail.detail', {
            url: '/{mailId:[0-9]{1,4}}',
            templateUrl: 'modules/demo/client/views/mail.detail.client.view.html'
          })
          .state('app.mail.compose', {
            url: '/compose',
            templateUrl: 'modules/demo/client/views/mail.new.client.view.html'
          })
          .state('layout', {
            abstract: true,
            url: '/layout',
            templateUrl: 'modules/demo/client/views/layout.client.view.html'
          })
          .state('layout.fullwidth', {
            url: '/fullwidth',
            views: {
              '': {
                templateUrl: 'modules/demo/client/views/layout_fullwidth.client.view.html'
              },
              'footer': {
                templateUrl: 'modules/demo/client/views/layout_footer_fullwidth.client.view.html'
              }
            },
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/demo/client/controllers/vectormap.client.controller.js']);
                }
              ]
            }
          })
          .state('layout.mobile', {
            url: '/mobile',
            views: {
              '': {
                templateUrl: 'modules/demo/client/views/layout_mobile.client.view.html'
              },
              'footer': {
                templateUrl: 'modules/demo/client/views/layout_footer_mobile.client.view.html'
              }
            }
          })
          .state('layout.app', {
            url: '/app',
            views: {
              '': {
                templateUrl: 'modules/demo/client/views/layout_app.client.view.html'
              },
              'footer': {
                templateUrl: 'modules/demo/client/views/layout_footer_fullwidth.client.view.html'
              }
            },
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['modules/demo/client/controllers/tab.client.controller.js']);
                }
              ]
            }
          })
          .state('apps', {
            abstract: true,
            url: '/apps',
            templateUrl: 'modules/demo/client/views/layout.client.view.html',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load(['modules/users/client/controllers/nav.client.controller.js']);
              }]
            }
          })
          .state('apps.note', {
            url: '/note',
            templateUrl: 'modules/demo/client/views/apps_note.client.view.html',
            resolve: {
              deps: ['uiLoad',
                function(uiLoad) {
                  return uiLoad.load(['modules/demo/client/filters/fromNow.client.filter.js',
                    'modules/demo/client/controllers/app/note/note.js',
                    JQ_CONFIG.moment
                  ]);
                }
              ]
            }
          })
          .state('apps.contact', {
            url: '/contact',
            templateUrl: 'modules/demo/client/views/apps_contact.client.view.html',
            resolve: {
              deps: ['uiLoad',
                function(uiLoad) {
                  return uiLoad.load(['modules/demo/client/controllers/app/contact/contact.js']);
                }
              ]
            }
          })
          // .state('app.weather', {
          //     url: '/weather',
          //     templateUrl: 'modules/demo/client/views/apps_weather.client.view.html',
          //     resolve: {
          //         deps: ['$ocLazyLoad',
          //           function( $ocLazyLoad ){
          //             return $ocLazyLoad.load(
          //                 {
          //                     name: 'angular-skycons',
          //                     files: ['modules/demo/client/controllers/app/weather/skycons.js',
          //                             'modules/demo/client/controllers/app/weather/angular-skycons.js',
          //                             'modules/demo/client/controllers/app/weather/ctrl.js',
          //                             JQ_CONFIG.moment ]
          //                 }
          //             );
          //         }]
          //     }
          // })
          .state('app.todo', {
            url: '/todo',
            templateUrl: 'modules/demo/client/views/apps_todo.client.view.html',
            resolve: {
              deps: ['uiLoad',
                function(uiLoad) {
                  return uiLoad.load(['modules/demo/client/controllers/app/todo/todo.js',
                    JQ_CONFIG.moment
                  ]);
                }
              ]
            }
          })
          .state('app.todo.list', {
            url: '/{fold}'
          });
      }
    ]
  );
