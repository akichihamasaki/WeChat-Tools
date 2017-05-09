'use strict';
/**
 * 田间布局controller
 * @author jxk
 */
angular.module('lpht.rice').controller('FieldLayoutCtrl', ['$scope', '$http', '$document', function($scope, $http, $document) {
  var cm = $scope.cm = {}; //configModel
  cm.isCollapsed = true; //是否显示更多
  cm.rowHeight = 50; //默认行高
  cm.colWidth = 50; //默认列宽
  cm.rows = 10; //默认行数
  cm.cols = 10; //默认列数
  var overFlag = false; //拖动开关
  var start_x, start_y, end_x, end_y; //拖动坐标

  /**
   * 生成表格
   */
  cm.getItems = function() {
    cm.items = [];
    for (var i = 0; i < cm.rows; i++) {
      var tr = [];
      for (var j = 0; j < cm.cols; j++) {
        var td = { x: i, y: j, width: cm.colWidth, height: cm.rowHeight, color: 'bg-white', value: '' };
        tr.push(td);
      }
      cm.items.push(tr);
    }
  };

  /**
   * 鼠标按下获取起始坐标 并将其余单元格清空
   */
  cm.mousedown = function(td) {
    overFlag = true;
    for (var i = 0; i < cm.rows; i++) {
      for (var j = 0; j < cm.cols; j++) {
        cm.items[i][j].active = false;
      }
    }
    td.active = true;
    start_x = td.x;
    start_y = td.y;
  };

  /**
   * 对整个document绑定鼠标按上事件，以防止用户将鼠标拖出范围后再触发事件
   */
  /*$document.bind('mouseup', function(e) {
    overFlag = false;
  });*/
  cm.mouseup = function() {
    overFlag = false;
  };
  cm.mouseleave = function() {
    overFlag = false;
  };

  /**
   * 鼠标经过时，根据开关选中单元格
   */
  cm.mouseover = function(td) {
    if (overFlag) {
      end_x = td.x;
      end_y = td.y;
      for (var i = start_x; i <= end_x; i++) {
        for (var j = start_y; j <= end_y; j++) {
          cm.items[i][j].active = true;
        }
      }
    }
  };

  cm.itemArray = [
    { id: 1, name: 'white', color: 'bg-white' },
    { id: 2, name: 'primary', color: 'bg-primary' },
    { id: 3, name: 'info', color: 'bg-info' },
    { id: 4, name: 'success', color: 'bg-success' },
    { id: 5, name: 'warning', color: 'bg-warning' },
    { id: 6, name: 'danger', color: 'bg-danger' }
  ];

  cm.color = cm.itemArray[0];

  /**
   * 设置单元格的颜色
   */
  cm.setColor = function() {
    for (var i = 0; i < cm.rows; i++) {
      for (var j = 0; j < cm.cols; j++) {
        if (cm.items[i][j].active) {
          cm.items[i][j].color = cm.color.color;
        }
      }
    }
  };

  /**
   * 设置单元格的值
   */
  cm.setValue = function() {
    for (var i = 0; i < cm.rows; i++) {
      for (var j = 0; j < cm.cols; j++) {
        if (cm.items[i][j].active) {
          cm.items[i][j].value = cm.value;
        }
      }
    }
  };



  cm.getItems();

}]);
