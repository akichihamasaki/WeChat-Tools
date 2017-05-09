'use strict';

angular.module('users').controller('orgManagerController', ['$scope', '$http', '$log', 'uiGridTreeViewConstants', 'toasterBusService', 'ngDialog', function($scope, $http, $log, uiGridTreeViewConstants, toasterBusService, ngDialog) {
  var org = $scope.org = {};
  var addoredit;
  var rowData = {};
  org.orgOpera = true;
  org.employeeOpera = true;
  org.orgType = true;
  org.nodeTypeValue = '01';
  //form表单置灰
  org.orgDisabled = true;
  org.employeeDisabled = true;

  //下拉框数据字典http请求
  $http.get('api/security/helptypecode/typecodes/Y_N,nodetype,sex')
    .success(function(data) {
      org.Y_N = data.Y_N;
      org.nodetype = data.nodetype;
      org.sex = data.sex;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });

  //分页参数初始化
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  //左边grid初始化
  org.gridOptionsOrg = {
    multiSelect: false,
    showTreeExpandNoChildren: false,
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false,
    noUnselect: true, //默认false,选中后是否可以取消选中
    enableGridMenu: true, //是否显示grid 菜单
    exporterMenuPdf: false,
    columnDefs: [
      { name: 'name', displayName: '名称', enableColumnMenu: false, enableSorting: false, cellTemplate: '<div class=\'wrapper-xs\' ng-bind-html=\"row.entity.name\"></div>' },
      { name: 'nodecode', displayName: '编码', enableColumnMenu: false, enableSorting: false }
    ],
    onRegisterApi: function(gridApi) {
      org.gridApi = gridApi;
      org.gridApi.treeBase.on.rowExpanded($scope, function(row) {

      });
      org.gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        rowData = angular.copy(row.entity);
        org.nodeTypeValue = row.entity.nodeType;
        org.orgType = true;
        if (org.gridApi.selection.getSelectedRows().length > 0) {
          org.editOrgDisabled = false;
          org.addEmployeeDisabled = false;
        }
        org.orgDisabled = true;
        org.buttonShow1 = false;
        org.orgOpera = true;
        org.editEmployeeDisabled = true;
        org.employee = null;
        getPageRight();
        getPageLeftInfo(row.entity.nodeid);
      });
    }
  };


  //右边grid定义
  org.gridOptionsEmployee = {
    paginationPageSizes: [20, 40, 80, 1000],
    paginationPageSize: 20,
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowSelection: true, // 行选择是否可用
    enableRowHeaderSelection: false,
    noUnselect: true, //默认false,选中后是否可以取消选中
    enableGridMenu: true, //是否显示grid 菜单
    exporterMenuPdf: false,
    multiSelect: false,
    columnDefs: [
      { name: 'nodename', displayName: '姓名', enableColumnMenu: false, enableSorting: false },
      { name: 'cardid', displayName: '身份证', enableColumnMenu: false, enableSorting: false },
      { name: 'empphn', displayName: '联系电话', enableColumnMenu: false, enableSorting: false }
    ],
    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;

      //行选中事件
      $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        org.employeeDisabled = true;
        if (org.gridApi.selection.getSelectedRows().length > 0 && $scope.gridApi.selection.getSelectedRows().length > 0) {
          org.editEmployeeDisabled = false;
        }
        getPageLeftInfo(row.entity.nodeid);
      });
      if (org.gridApi.selection.getSelectedRows().length === 0) {
        org.editOrgDisabled = true;
        org.addEmployeeDisabled = true;
      }
      if (org.gridApi.selection.getSelectedRows().length === 0 && $scope.gridApi.selection.getSelectedRows().length === 0) {
        org.editEmployeeDisabled = true;
      }
    }
  };

  getPageLeft();
  //左边grid加载数据
  function getPageLeft() {
    $http.get('/api/security/organization/queryOrganization')
      .success(function(data) {
        for (var i = 0; i < data.length; i++) {
          var stringData = '<b>&nbsp;&nbsp;&nbsp;&nbsp;</b>';
          data[i].$$treeLevel = data[i].treeLevel;
          for (var j = 0; j < data[i].treeLevel; j++) {
            stringData = stringData + '<b>&nbsp;&nbsp;&nbsp;&nbsp;</b>';
          }
          data[i].name = stringData + data[i].nodename;
        }
        org.gridOptionsOrg.data = data;
      }).error(function(ex) {

      });
  }



  //右边grid加载数据
  function getPageRight() {
    var msg = { type: 'wait', title: '数据加载中...', toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    var url = '/api/security/organization/queryEmployee' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    var param = {};
    param.nodeid = rowData.nodeid;
    $http.get(url, { params: param })
      .success(function(data) {
        org.gridOptionsEmployee.data = data.content;
        org.gridOptionsEmployee.totalItems = data.totalElements;
        toasterBusService.clear(msg);
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }
  getPageRight();


  function getPageLeftInfo(nodeId) {
    var param = { nodeid: nodeId };
    $http.get('/api/security/organization/getOrganization', { params: param })
      .success(function(data) {
        if (data.nodetype === '01') {
          org.orgEntity = data;
          org.nodeTypeValue = data.nodetype;
        } else if (data.nodetype === '02') {
          org.branchEntity = data;
          org.nodeTypeValue = data.nodetype;
        } else {
          org.employee = data;
        }
      }).error(function(ex) {

      });
  }
  //操作按钮
  org.addOrg = function() {
    org.orgDisabled = false;
    org.orgOpera = false;
    org.buttonShow1 = true;
    org.orgEntity = {};
    addoredit = 'add';
    if (org.nodeTypeValue === '01') {
      org.orgType = false;
    } else if (org.nodeTypeValue === '02') {
      org.orgType = true;
    }
  };
  org.addBranch = function() {
    org.orgDisabled = false;
    org.orgOpera = false;
    org.buttonShow1 = true;
    org.branchEntity = {};
    addoredit = 'add';
    if (org.nodeTypeValue === '01') {
      org.orgType = false;
    } else if (org.nodeTypeValue === '02') {
      org.orgType = true;
    }
  };
  org.addEmployee = function() {
    org.employeeDisabled = false;
    org.employeeOpera = false;
    org.buttonShow2 = true;
    org.employee = {};
  };
  org.editOrg = function() {
    org.orgDisabled = false;
    org.orgOpera = false;
    org.buttonShow1 = true;
    addoredit = 'edit';
    org.orgType = true;

  };
  org.editBranch = function() {
    org.orgDisabled = false;
    org.orgOpera = false;
    org.buttonShow1 = true;
    addoredit = 'edit';
    if (org.nodeTypeValue === '01') {
      org.orgType = false;
    } else if (org.nodeTypeValue === '02') {
      org.orgType = true;
    }
  };
  org.editEmployee = function() {
    org.employeeDisabled = false;
    org.employeeOpera = false;
    org.buttonShow2 = true;
  };
  org.deleteOrg = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var selectedRows = org.gridApi.selection.getSelectedRows()[0];
        var param = {};
        param.nodeid = selectedRows.nodeid;
        $http.get('api/security/organization/deleteOrganization', { params: param })
          .success(function(data) {
            if (data.retcode) {
              if (data.retcode === 1014) {
                ngDialog.open({
                  template: '<p>该机构包含子集，你确定一起删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
                  className: 'ngdialog-theme-default',
                  plain: true,
                  scope: $scope,
                  closeByDocument: false,
                  showClose: false
                }).closePromise.then(function(data) {
                  if (data.value === 1) {
                    var param = {};
                    param.nodeid = org.gridApi.selection.getSelectedRows()[0].nodeid;
                    param.includeChild = true;
                    $http.get('api/security/organization/deleteOrganization', { params: param })
                      .success(function(data) {
                        toasterBusService.publish({ type: 'success', title: '删除成功!' });
                        getPageLeft();
                        getPageRight();
                      })
                      .error(function(ex) {
                        toasterBusService.publish({ type: 'error', title: ex });
                      });
                  }
                });
              }
            } else {
              toasterBusService.publish({ type: 'success', title: '删除成功！' });
              getPageLeft();
            }
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });
      }
    });
  };
  org.deleteBranch = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var selectedRows = org.gridApi.selection.getSelectedRows()[0];
        var param = {};
        param.nodeid = selectedRows.nodeid;
        $http.get('api/security/organization/deleteOrganization', { params: param })
          .success(function(data) {
            if (data.retcode) {
              if (data.retcode === 1014) {
                ngDialog.open({
                  template: '<p>该部门包含子集，你确定一起删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
                  className: 'ngdialog-theme-default',
                  plain: true,
                  scope: $scope,
                  closeByDocument: false,
                  showClose: false
                }).closePromise.then(function(data) {
                  if (data.value === 1) {
                    var param = {};
                    param.nodeid = org.gridApi.selection.getSelectedRows()[0].nodeid;
                    param.includeChild = true;
                    $http.get('api/security/organization/deleteOrganization', { params: param })
                      .success(function(data) {
                        toasterBusService.publish({ type: 'success', title: '删除成功!' });
                        getPageLeft();
                        getPageRight();
                      })
                      .error(function(ex) {
                        toasterBusService.publish({ type: 'error', title: ex });
                      });
                  }
                });
              }
            } else {
              toasterBusService.publish({ type: 'success', title: '删除成功！' });
              getPageLeft();
            }
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });
      }
    });
  };
  org.deleteEmployee = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var selectedRows = $scope.gridApi.selection.getSelectedRows()[0];
        var param = {};
        param.nodeid = selectedRows.nodeid;
        $http.get('api/security/organization/deleteOrganization', { params: param })
          .success(function(data) {
            toasterBusService.publish({ type: 'success', title: '删除成功！' });
            getPageRight();
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });
      }
    });
  };
  org.orgSubmit = function() {
    org.orgDisabled = true;
    org.buttonShow1 = false;
    org.orgOpera = true;
    var params = {};
    params = org.orgEntity;
    params.status = '1';
    if (addoredit === 'add') {
      params.parentid = rowData.nodeid;
      $http.post('/api/security/organization/saveBranch', params)
        .success(function(data) {
          toasterBusService.publish({ type: 'success', title: '新增成功！' });
          getPageLeft();
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    } else if (addoredit === 'edit') {
      $http.post('/api/security/organization/saveBranch', params)
        .success(function(data) {
          toasterBusService.publish({ type: 'success', title: '修改成功！' });
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    }
  };

  org.BranchSubmit = function() {
    org.orgDisabled = true;
    org.buttonShow1 = false;
    org.orgOpera = true;
    var params = {};
    params = org.branchEntity;
    params.status = '1';
    if (addoredit === 'add') {
      params.parentid = rowData.nodeid;
      $http.post('/api/security/organization/saveDepartment', params)
        .success(function(data) {
          toasterBusService.publish({ type: 'success', title: '新增成功！' });
          getPageLeft();
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    } else if (addoredit === 'edit') {
      $http.post('/api/security/organization/saveDepartment', params)
        .success(function(data) {
          toasterBusService.publish({ type: 'success', title: '修改成功！' });
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    }

  };
  org.orgCancel = function() {
    org.orgDisabled = true;
    org.buttonShow1 = false;
    org.orgOpera = true;
    org.orgType = true;
    org.orgEntity = org.gridApi.selection.getSelectedRows()[0];
  };
  org.BranchCancel = function() {
    org.orgDisabled = true;
    org.buttonShow1 = false;
    org.orgOpera = true;
    org.orgType = true;
    org.branchEntity = org.gridApi.selection.getSelectedRows()[0];
  };
  org.employeeSubmit = function() {
    org.employeeDisabled = true;
    org.buttonShow2 = false;
    org.employeeOpera = true;
    var params = {};
    params = org.employee;
    params.parentid = rowData.nodeid;
    params.status = '1';
    $http.post('/api/security/organization/saveEmployee', params)
      .success(function(data) {
        getPageRight();
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  };
  org.employeeCancel = function() {
    org.employeeDisabled = true;
    org.buttonShow2 = false;
    org.employeeOpera = true;
    org.employee = $scope.gridApi.selection.getSelectedRows()[0];
  };


}]);
