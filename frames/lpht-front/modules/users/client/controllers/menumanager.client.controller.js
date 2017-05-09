'use strict';

angular.module('users').controller('menuManagerController', ['$scope', '$http', 'toasterBusService', 'ngDialog', function($scope, $http, toasterBusService, ngDialog) {

  var menu = $scope.menu = {};
  var tree, addoredit;

  //初始化按钮显隐及可用
  menu.menuDisabled = true;
  menu.menuOpera = true;
  menu.doingAsync = true;
  if (!menu.menuData) {
    menu.menuEditDisabled = true;
  }
  //tree点击事件
  menu.treeHandler = function(branch) {
    menu.menuData = branch;
    menu.menuSelectRow = angular.copy(branch);
    menu.menuEditDisabled = false;
    menu.menuDisabled = true;
    menu.menuOpera = true;

  };

  menu.treeData = [];
  menu.treeControl = tree = {};

  var msg = { type: 'wait', title: '数据加载中...', toastId: toasterBusService.newGuid() };
  toasterBusService.publish(msg);
  getTree();
  //tree数据加载
  function getTree() {
    $http.get('api/security/menu/queryAllBaseMenuTree')
      .success(function(menus) {
        if (menus && menus.length > 0) {
          menus[0].expanded = true;
        }
        var stack = [];
        stack = stack.concat(menus);
        while (stack.length > 0) {
          var m = stack.pop();
          if (m.config) {
            m.label = '<i class= "' + m.config + '"> </i>' + m.name;
          } else {
            m.label = m.name;
          }
          if (m.children.length > 0) {
            stack = stack.concat(m.children);
          }
        }
        menu.treeData = menus;
        menu.doingAsync = false;
        toasterBusService.clear(msg);
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }
  //操作按钮
  menu.menuAdd = function() {
    menu.menuDisabled = false;
    menu.menuOpera = false;
    menu.menuData = {};
    addoredit = 'add';
  };
  menu.menuEdit = function() {
    menu.menuDisabled = false;
    menu.menuOpera = false;
    addoredit = 'edit';
  };
  menu.menuDelete = function() {
    ngDialog.open({
      template: '<p>确定删除菜单吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var param = {};
        param.menuid = menu.menuSelectRow.menuid;
        $http.get('api/security/menu/deleteBaseMenu', { params: param })
          .success(function(data) {
            if (data.retcode) {
              if (data.retcode === 1010) {
                toasterBusService.publish({ type: 'error', title: '菜单不存在！' });
              } else if (data.retcode === 1014) {
                ngDialog.open({
                  template: '<p>该菜单包含子集，你确定一起删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
                  className: 'ngdialog-theme-default',
                  plain: true,
                  scope: $scope,
                  closeByDocument: false,
                  showClose: false
                }).closePromise.then(function(data) {
                  if (data.value === 1) {
                    var param = {};
                    param.menuid = menu.menuSelectRow.menuid;
                    param.includeChild = true;
                    $http.get('api/security/menu/deleteBaseMenu', { params: param })
                      .success(function(data) {
                        toasterBusService.publish({ type: 'success', title: '删除成功' });
                        getTree();
                      })
                      .error(function(ex) {
                        toasterBusService.publish({ type: 'error', title: ex });
                      });
                  }
                });
              }
            } else {
              toasterBusService.publish({ type: 'success', title: '删除成功' });
              getTree();
            }
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });
      }
    });
  };
  menu.menuSubmit = function() {
    menu.menuDisabled = true;
    menu.menuOpera = true;
    var params = {};
    params = menu.menuData;
    if (addoredit === 'add') {
      if (menu.menuSelectRow) {
        params.parentid = menu.menuSelectRow.menuid;
      } else {
        params.parentid = '';
      }
      $http.post('api/security/menu/addBaseMenu', params)
        .success(function(data) {
          if (data.retcode) {
            if (data.retcode === 1012) {
              toasterBusService.publish({ type: 'error', title: '菜单编码重复！' });
            }
          } else {
            params.menuid = data.menuid;
            var b;
            b = tree.get_selected_branch();
            if (params.config) {
              params.label = '<i class= "' + params.config + '"> </i>' + menu.menuData.name;
            } else {
              params.label = menu.menuData.name;
            }
            tree.add_branch(b, params);
            toasterBusService.publish({ type: 'success', title: '新增成功！' });
          }
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    } else {
      $http.post('/api/security/menu/updateBaseMenu', params)
        .success(function(data) {
          if (data.retcode) {
            if (data.retcode === 1010) {
              toasterBusService.publish({ type: 'error', title: '菜单不存在！' });
            } else if (data.retcode === 1012) {
              toasterBusService.publish({ type: 'error', title: '菜单编码重复！' });
            }
          } else {
            if (params.config) {
              menu.menuData.label = '<i class= "' + params.config + '"> </i>' + menu.menuData.name;
              toasterBusService.publish({ type: 'success', title: '修改成功！' });
            } else {
              menu.menuData.label = menu.menuData.name;
              toasterBusService.publish({ type: 'success', title: '修改成功！' });
            }
          }
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    }
  };

  menu.menuCancel = function() {
    menu.menuDisabled = true;
    menu.menuOpera = true;
    menu.menuData = menu.menuSelectRow;
  };


}]);
