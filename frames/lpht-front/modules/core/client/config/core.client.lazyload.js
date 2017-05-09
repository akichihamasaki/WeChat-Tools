  'use strict';
// lazyload config

  angular.module('core')
    /**
   * jQuery plugin config use ui-jq directive , config the js and css files that required
   * key: function name of the jQuery plugin
   * value: array of the css js file located
   */
  .constant('JQ_CONFIG', {
    easyPieChart:   ['lib/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js'],
    sparkline:      ['framework/jquery.sparkline/dist/jquery.sparkline.retina.js'],
    plot:           ['lib/flot/jquery.flot.js',
                     'lib/flot/jquery.flot.pie.js',
                     'lib/flot/jquery.flot.resize.js',
                     'lib/flot.tooltip/js/jquery.flot.tooltip.js',
                     'lib/flot.orderbars/js/jquery.flot.orderBars.js',
                     'lib/flot-spline/js/jquery.flot.spline.js'],
    moment:         ['lib/moment/moment.js'],
    screenfull:     ['lib/screenfull/dist/screenfull.min.js'],
    slimScroll:     ['lib/jquery-slimscroll/jquery.slimscroll.min.js'],
    sortable:       ['lib/html5sortable/jquery.sortable.js'],
    nestable:       ['lib/nestable/jquery.nestable.js',
                     'lib/nestable/jquery.nestable.css'],
    filestyle:      ['lib/bootstrap-filestyle/src/bootstrap-filestyle.js'],
    slider:         ['lib/bootstrap-slider/bootstrap-slider.js',
                     'lib/bootstrap-slider/bootstrap-slider.css'],
    chosen:         ['lib/chosen/chosen.jquery.js',
                     'lib/bootstrap-chosen/bootstrap-chosen.css'],
    TouchSpin:      ['lib/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js',
                     'lib/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],
    wysiwyg:        ['lib/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                     'lib/bootstrap-wysiwyg/external/jquery.hotkeys.js'],
    dataTable:      ['lib/datatables/media/js/jquery.dataTables.min.js',
                     'lib/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.js',
                     'lib/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.css'],
    vectorMap:      ['lib/bower-jvectormap/jquery-jvectormap-1.2.2.min.js',
                     'lib/bower-jvectormap/jquery-jvectormap-world-mill-en.js',
                     'lib/bower-jvectormap/jquery-jvectormap-us-aea-en.js',
                     'lib/bower-jvectormap/jquery-jvectormap-1.2.2.css'],
    footable:       ['lib/footable/dist/footable.all.min.js',
                     'lib/footable/css/footable.core.css'],
    fullcalendar:   ['lib/moment/moment.js',
                     'lib/fullcalendar/dist/fullcalendar.min.js',
                     'lib/fullcalendar/dist/fullcalendar.min.css',
                     'framework/fullcalendar/dist/fullcalendar.theme.css',
                     'lib/fullcalendar/dist/lang-all.js'],
    daterangepicker:['lib/moment/moment.js',
                     'lib/bootstrap-daterangepicker/daterangepicker.js',
                     'lib/bootstrap-daterangepicker/daterangepicker-bs3.css'],
    tagsinput:      ['lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
                     'lib/bootstrap-tagsinput/dist/bootstrap-tagsinput.css']
  })
  // oclazyload config
  .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    // We configure ocLazyLoad to use the lib script.js as the async loader
    $ocLazyLoadProvider.config({
      debug:  true,
      events: true,
      serie:  true,
      modules: [
        {
          name: 'ui.grid',
          files: [
            'lib/angular-ui-grid/ui-grid.js',
            'lib/angular-ui-grid/ui-grid.css'
          ]
        },
        {
          name: 'ui.select',
          files: [
            'lib/angular-ui-select/dist/select.min.js',
            'lib/angular-ui-select/dist/select.min.css'
          ]
        },
        {
          name:'angularFileUpload',
          files: [
            'lib/angular-file-upload/dist/angular-file-upload.min.js'
          ]
        },
        {
          name:'ui.calendar',
          files: ['lib/angular-ui-calendar/src/calendar.js']
        },
        {
          name: 'ngImgCrop',
          files: [
            'lib/ng-img-crop/compile/minified/ng-img-crop.js',
            'lib/ng-img-crop/compile/minified/ng-img-crop.css'
          ]
        },
        {
          name: 'angularBootstrapNavTree',
          files: [
            'lib/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
            'framework/angular-bootstrap-nav-tree/dist/abn_tree_ext_directive.js',
            'lib/angular-bootstrap-nav-tree/dist/abn_tree.css'
          ]
        },
        {
          name: 'toaster',
          files: [
            'lib/angularjs-toaster/toaster.js',
            'lib/angularjs-toaster/toaster.css'
          ]
        },
        {
          name: 'angular-bootstrap',
          files: [
            'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
          ]
        },
        // {
        //     name: 'textAngular',
        //     files: [
        //         'lib/textAngular/dist/textAngular-sanitize.min.js',
        //         'lib/textAngular/dist/textAngular.min.js'
        //     ]
        // },
        // {
        //     name: 'vr.directives.slider',
        //     files: [
        //         'lib/venturocket-angular-slider/build/angular-slider.min.js',
        //         'lib/venturocket-angular-slider/build/angular-slider.css'
        //     ]
        // },
        // {
        //     name: 'com.2fdevs.videogular',
        //     files: [
        //         'lib/videogular/videogular.min.js'
        //     ]
        // },
        // {
        //     name: 'com.2fdevs.videogular.plugins.controls',
        //     files: [
        //         'lib/videogular-controls/controls.min.js'
        //     ]
        // },
        // {
        //     name: 'com.2fdevs.videogular.plugins.buffering',
        //     files: [
        //         'lib/videogular-buffering/buffering.min.js'
        //     ]
        // },
        // {
        //     name: 'com.2fdevs.videogular.plugins.overlayplay',
        //     files: [
        //         'lib/videogular-overlay-play/overlay-play.min.js'
        //     ]
        // },
        // {
        //     name: 'com.2fdevs.videogular.plugins.poster',
        //     files: [
        //         'lib/videogular-poster/poster.min.js'
        //     ]
        // },
        // {
        //     name: 'com.2fdevs.videogular.plugins.imaads',
        //     files: [
        //         'lib/videogular-ima-ads/ima-ads.min.js'
        //     ]
        // },
        {
          name: 'xeditable',
          files: [
            'lib/angular-xeditable/dist/js/xeditable.min.js',
            'lib/angular-xeditable/dist/css/xeditable.css'
          ]
        },
        {
          name: 'smart-table',
          files: [
            'lib/angular-smart-table/dist/smart-table.min.js'
          ]
        },
        {
          name: 'ngDialog',
          files: [
            'lib/ng-dialog/js/ngDialog.js',
            'lib/ng-dialog/css/ngDialog.css',
            'lib/ng-dialog/css/ngDialog-theme-default.css'
          ]
        },
        {
          name: 'easyPieChart',
          files: ['lib/jquery.easy-pie-chart/dist/angular.easypiechart.min.js']
        },
        {
          name: 'ngFileUpload',
          files: [
            'lib/ng-file-upload/ng-file-upload-shim.js',
            'lib/ng-file-upload/ng-file-upload.js'
          ]
        }
      ]
    });
  }])
;

