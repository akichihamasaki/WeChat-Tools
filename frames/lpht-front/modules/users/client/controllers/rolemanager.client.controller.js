'use strict';

angular.module('users').controller('RoleManagerController', ['$scope', '$http', '$uibModal', 'toasterBusService', 'ngDialog', function($scope, $http, $uibModal, toasterBusService, ngDialog) {
  var role = $scope.role = {};
  var addoredit;
  role.roleOpera = true;
  role.roleIsok = false;
  role.roleDisabled = true;
  role.menuSelect = true;

  //初始分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };

  //grid参数
  role.gridOptionsRole = {
    paginationPageSizes: [20, 40, 80, 1000],
    paginationPageSize: 20,
    enableColumnMenu: false, // 是否显示列头部菜单按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowSelection: true, // 行选择是否可用
    noUnselect: true, //默认false,选中后是否可以取消选中
    enableRowHeaderSelection: false,
    multiSelect: false,
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableGridMenu: true, //是否显示grid 菜单
    exporterMenuPdf: false,
    useExternalPagination: true, //是否使用分页按钮
    columnDefs: [
      { name: 'rolename', displayName: '角色名', enableColumnMenu: false, enableSorting: false },
      { name: 'descn', displayName: '描述', enableColumnMenu: false, enableSorting: false }
    ],
    onRegisterApi: function(gridApi) {
      role.gridApi = gridApi;
      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
        getPage();
      });
      //行选中事件
      role.gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        role.roleDisabled = true;
        role.roleOpera = true;
        role.roleIsok = false;
        role.editRoleDisabled = false;
        role.menuSelectDisabled = false;
        role.roleRow = angular.copy(row.entity);
      });
      if (role.gridApi.selection.getSelectedRows().length === 0) {
        role.editRoleDisabled = true;
        role.menuSelectDisabled = true;
      }
    }
  };

  var msg = { type: 'wait', title: '数据加载中...', toastId: toasterBusService.newGuid() };
  toasterBusService.publish(msg);


  function getPage() {
    var url = '/api/security/role/queryRole' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    var param = {};
    param.page = paginationOptions.pageNumber;
    param.size = paginationOptions.pageSize;
    $http.get(url, { params: param })
      .success(function(data) {
        role.gridOptionsRole.data = data.content;
        role.gridOptionsRole.totalItems = data.totalElements;
        toasterBusService.clear(msg);
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }
  getPage();

  //操作按钮
  role.addRole = function() {
    role.roleDisabled = false;
    role.roleOpera = false;
    role.roleIsok = true;
    role.menuSelect = false;
    addoredit = 'add';
    role.roleRow = {};
  };
  role.editRole = function() {
    role.roleDisabled = false;
    role.roleOpera = false;
    role.roleIsok = true;
    role.menuSelect = false;
    addoredit = 'edit';
  };
  role.roleSubmit = function() {
    var params = {};
    role.roleDisabled = true;
    role.roleOpera = true;
    role.roleIsok = false;
    role.menuSelect = true;
    params = role.roleRow;
    $http.post('/api/security/role/saveRole', params)
      .success(function(data) {
        toasterBusService.publish({ type: 'success', title: '提交成功！' });
        getPage();
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  };
  role.deleteRole = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var selectedRows = role.gridApi.selection.getSelectedRows();
        var param = {};
        param.roleid = selectedRows[0].roleid;
        $http.get('api/security/role/deleteRole', { params: param })
          .success(function(data) {
            if (data.retcode) {
              if (data.retcode === 1010) {
                toasterBusService.publish({ type: 'error', title: '角色不存在！' });
              }
            } else {
              toasterBusService.publish({ type: 'success', title: '删除成功！' });
              getPage();
            }
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });
      }
    });
  };
  role.roleCancel = function() {
    role.roleDisabled = true;
    role.roleOpera = true;
    role.roleIsok = false;
    role.menuSelect = true;
  };

  //分配角色弹出框
  role.popEdit = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'roleModalContent.html',
      controller: 'ModalMenuCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        menuData: function() {
          return role.roleRow;
        }
      }
    });
    modalInstance.result.then(function(result) {
      getPage();
    });
  };

}]);




angular.module('users').controller('ModalMenuCtrl', ['$scope', '$uibModalInstance', '$http', '$log', 'uiGridTreeViewConstants', 'menuData', 'toasterBusService', function($scope, $uibModalInstance, $http, $log, uiGridTreeViewConstants, menuData, toasterBusService) {

  //加载grid
  $scope.gridOptionsModal = {
    enableColumnMenu: false, // 是否显示列头部菜单按钮
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowSelection: true, // 行选择是否可用
    enableRowHeaderSelection: true,
    showTreeExpandNoChildren: false,
    isRowSelectable: function(row) {
      if (row.entity.check === true) {
        row.grid.api.selection.selectRow(row.entity);
      }
    },
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //默认false,选中后是否可以取消选中
    columnDefs: [
      { name: 'name', displayName: '菜单名', enableColumnMenu: false, cellTemplate: '<div class=\'wrapper-xs\' ng-bind-html=\"row.entity.name\"></div>' },
      { name: 'code', displayName: '菜单编码', enableColumnMenu: false }
    ],

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
      //行选中事件
      $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        row.entity.check =false;
      });

      $scope.gridApi.core.registerRowsProcessor(function(renderableRows) {
        $scope.gridApi.treeBase.expandAllRows();
        return renderableRows;
      }, 999);
    }
  };

  //加载treeGrid数据
  function getTreeGrid() {
    var msg = { type: 'wait', title: '数据加载中...', toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    $http.get('/api/security/menu/queryMenuTreeGird', { params: { roleid: menuData.roleid } })
      .success(function(data) {
        for (var i = 0; i < data.length; i++) {
          var stringData = '<b>&nbsp;&nbsp;&nbsp;&nbsp;</b>';
          data[i].$$treeLevel = data[i].treeLevel;
          for (var j = 0; j < data[i].treeLevel; j++) {
            stringData = stringData + '<b>&nbsp;&nbsp;&nbsp;&nbsp;</b>';
          }
          data[i].name = stringData + data[i].name;
        }

        $scope.gridOptionsModal.data = data;
        toasterBusService.clear(msg);
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }
  getTreeGrid();

  //提交按钮
  $scope.submit = function() {
    var params = {};
    var menus = [];
    for (var i = 0; i < $scope.gridApi.selection.getSelectedRows().length; i++) {
      menus.push({ menuid: $scope.gridApi.selection.getSelectedRows()[i].menuid });
    }
    params.menus = menus;
    params.roleid = menuData.roleid;
    $log.log(params);
    $http.post('/api/security/role/saveRoleMenu', params)
      .success(function(data) {
        if (data.retcode === 1010) {
          toasterBusService.publish({ type: 'error', title: '角色不存在！' });
        } else {
          toasterBusService.publish({ type: 'success', title: '菜单分配成功！' });
          $uibModalInstance.close();
        }
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  };

  //关闭按钮
  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);
