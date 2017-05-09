'use strict';

angular.module('users').controller('UserManagerController', ['$scope', '$http', '$uibModal', '$log', 'uiGridConstants', 'toasterBusService', function($scope, $http, $uibModal, $log, uiGridConstants, toasterBusService) {
  var user = $scope.user = {};
  var addoredit, getRoles;
  var paginationOptions;
  user.nodeName = '';
  user.userName = '';

  user.userOpera = true;
  user.userNameDisabled = true;
  user.empNameDisabled = true;
  user.addDisabled = true;
  //条件查询
  user.search = function() {
    paginationOptions = {
      pageNumber: 0,
      pageSize: 20,
      sort: null
    };
    getPage();
  };
  //重置
  user.reset = function() {
    user.nodeName = '';
    user.userName = '';

  };

  //分页
  paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  //定义grid
  user.gridOptionsUser = {
    paginationPageSizes: [20, 40, 80, 1000],
    paginationPageSize: 20,
    useExternalPagination: true,
    useExternalSorting: true,
    enableColumnMenu: false, // 是否显示列头部菜单按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowSelection: true, // 行选择是否可用
    noUnselect: true, //默认false,选中后是否可以取消选中
    enableRowHeaderSelection: false,
    multiSelect: false,
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableGridMenu: true, //是否显示grid 菜单
    exporterMenuPdf: false,

    columnDefs: [
      { name: 'employee.nodename', displayName: '姓名', enableColumnMenu: false, enableSorting: false },
      { name: 'username', displayName: '用户名', enableColumnMenu: false, enableSorting: false },
      { name: 'statusStr', displayName: '状态', enableColumnMenu: false, enableSorting: false }
    ],
    onRegisterApi: function(gridApi) {
      user.gridApi = gridApi;
      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
        getPage();
      });
      //行选中事件
      user.gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        user.userNameDisabled = true;
        user.userOpera = true;
        user.userIsok = false;
        user.login = row.entity;
        user.empName = row.entity.employee.nodename;
        if (user.gridApi.selection.getSelectedRows().length > 0) {
          user.OperaDisabled = false;
        }
        if (!user.login.username) {
          user.addDisabled = false;
          user.roleDisabled = true;
        } else {
          user.addDisabled = true;
          user.roleDisabled = false;
        }
      });
      if (user.gridApi.selection.getSelectedRows().length === 0) {
        user.OperaDisabled = true;
      }

    }
  };

  var msg = { type: 'wait', title: '数据加载中...', toastId: toasterBusService.newGuid() };
  toasterBusService.publish(msg);

  //grid加载数据
  function getPage() {
    var url = '/api/security/user/queryUser' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    var param = {};
    param.nodeName = user.nodeName;
    param.userName = user.userName;
    $http.get(url, { params: param })
      .success(function(data) {
        for (var i = 0; i < data.content.length; i++) {
          if (data.content[i]) {
            if (data.content[i].status === '1') {
              data.content[i].statusStr = '启用';
            } else if (data.content[i].status === '0') {
              data.content[i].statusStr = '禁用';
            }
          }
        }
        user.gridOptionsUser.data = data.content;
        user.gridOptionsUser.totalItems = data.totalElements;
        if (paginationOptions.pageNumber === 0) user.gridApi.pagination.seek(1);
        toasterBusService.clear(msg);
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }
  getPage();


  user.userAdd = function() {
    user.userNameDisabled = false;
    user.userOpera = false;
    user.userIsok = true;
    user.login = {};
    addoredit = 'add';
  };
  user.userEdit = function() {
    user.userNameDisabled = true;
    user.userOpera = false;
    user.userIsok = true;
    user.password = '';
    addoredit = 'edit';
  };
  //禁用按钮
  user.userBan = function() {
    var params = {};
    params = user.login;
    params.status = '0';
    $http.post('/api/security/user/updateUserStatus', params)
      .success(function(data) {
        getPage();
        toasterBusService.publish({ type: 'success', title: '禁用成功！' });
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  };
  //启用按钮
  user.userOpen = function() {
    var params = {};
    params = user.login;
    params.status = '1';
    $http.post('/api/security/user/updateUserStatus', params)
      .success(function(data) {
        getPage();
        toasterBusService.publish({ type: 'success', title: '启用成功！' });
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  };
  //保存按钮
  user.userSubmit = function() {
    user.userNameDisabled = true;
    user.userOpera = true;
    user.userIsok = false;
    var params = {};
    var employee = {};
    params = user.login;
    params.status = '1';
    employee.nodeid = user.gridApi.selection.getSelectedRows()[0].employee.nodeid;
    params.employee = employee;
    if (addoredit === 'add') {
      $http.post('/api/security/user/saveUser', params)
        .success(function(data) {
          getPage();
          toasterBusService.publish({ type: 'success', title: '用户新增成功！' });
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    } else {
      $http.post('/api/security/user/updateUserPassword', params)
        .success(function(data) {
          if (data.retcode) {
            if (data.retcode === 1010) {
              toasterBusService.publish({ type: 'error', title: '用户不存在！' });
            }
          } else {
            toasterBusService.publish({ type: 'success', title: '重置成功！' });
            getPage();
          }

        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    }
  };
  user.userCancel = function() {
    user.userNameDisabled = true;
    user.userOpera = true;
    user.userIsok = false;
  };

  //弹出框
  user.popRole = function() {
    // var roleData = selectData;
    var modalInstance = $uibModal.open({
      templateUrl: 'userModalContent',
      controller: 'ModalRoleCtrl',
      size: 'lg',
      resolve: {
        roleData: function() {
          return user.gridApi.selection.getSelectedRows()[0];
        }
      }
    });
    modalInstance.result.then(function(result) {
      getPage();
      user.roleDisabled = true;
    });

  };
}]);

angular.module('users').controller('ModalRoleCtrl', ['$scope', '$uibModalInstance', '$http', '$log', 'roleData', 'toasterBusService', function($scope, $uibModalInstance, $http, $log, roleData, toasterBusService) {
  $scope.selectData = angular.copy(roleData);

  //grid参数
  $scope.gridOptionsModal = {
    enableColumnMenu: false, // 是否显示列头部菜单按钮
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowSelection: true, // 行选择是否可用
    noUnselect: false, //默认false,选中后是否可以取消选中
    multiSelect: true,
    isRowSelectable: function(row) {
      if (row.entity.check === true) {
        row.grid.api.selection.selectRow(row.entity);
      }
    },
    columnDefs: [
      { name: 'rolename', displayName: '角色名', enableColumnMenu: false },
      { name: 'descn', displayName: '描述', enableColumnMenu: false }
    ],

    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
      //行选中事件
      $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        row.entity.check = false;
      });
    }
  };

  function getPage() {
    var url = '/api/security/role/queryAllRoleByUserid';
    var param = {};
    param.userid = $scope.selectData.userid;
    $http.get(url, { params: param })
      .success(function(data) {
        $scope.gridOptionsModal.data = data;
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }
  getPage();


  $scope.submit = function() {
    var params = {};
    var roles = [];
    for (var i = 0; i < $scope.gridApi.selection.getSelectedRows().length; i++) {
      roles.push({ roleid: $scope.gridApi.selection.getSelectedRows()[i].roleid });
    }
    params.roles = roles;
    params.userid = $scope.selectData.userid;
    $http.post('/api/security/user/saveUserRole', params)
      .success(function(data) {

      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });

    $uibModalInstance.close();
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
