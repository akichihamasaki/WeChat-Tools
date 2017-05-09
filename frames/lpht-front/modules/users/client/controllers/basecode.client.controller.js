'use strict';

angular.module('users').controller('BaseCodeController', ['$scope', '$http', 'uiGridConstants', 'toasterBusService', 'ngDialog', function($scope, $http, uiGridConstants, toasterBusService, ngDialog) {
  var baseCode = $scope.baseCode = {};
  var addoredit;
  var selectDataMain, selectData;
  baseCode.typeName = '';
  baseCode.name = '';
  //form表单置灰
  baseCode.typeCodeMain = true;
  baseCode.typeCodeMainPK = true;
  baseCode.typeCode = true;
  baseCode.typeCodePK = true;
  baseCode.buttonOpera1 = true;
  baseCode.buttonOpera2 = true;
  baseCode.buttonShow1 = false;
  baseCode.buttonShow2 = false;

  //条件查询
  baseCode.searchMain = function() {
    getPageLeft();
  };
  baseCode.search = function() {
    getPageRight();
  };

  //重置按钮
  baseCode.resetMain = function() {
    baseCode.typeName = '';
  };
  baseCode.reset = function() {
    baseCode.name = '';
  };

  //操作按钮
  baseCode.addType = function() {
    baseCode.typeCodeMain = false;
    baseCode.typeCodeMainPK = false;
    baseCode.buttonOpera1 = false;
    baseCode.buttonShow1 = true;
    addoredit = 'add';
    baseCode.typeCodeInfo = {};
  };
  baseCode.editType = function() {
    baseCode.typeCodeMain = false;
    baseCode.typeCodeMainPK = true;
    baseCode.buttonOpera1 = false;
    baseCode.buttonShow1 = true;
    addoredit = 'edit';
  };
  baseCode.typeSubmit = function() {
    baseCode.typeCodeMain = true;
    baseCode.typeCodeMainPK = true;
    baseCode.buttonOpera1 = true;
    baseCode.buttonShow1 = false;
    var params = {};
    params = baseCode.typeCodeInfo;
    if (addoredit === 'add') {
      $http.post('/api/security/helptypecode/addHelpTypeCodeMain', params)
        .success(function(data) {
          if (data.retcode === 1022) {
            toasterBusService.publish({ type: 'error', title: '编码重复！' });
          }
          baseCode.resetMain();
          getPageLeft();
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    } else {
      $http.post('/api/security/helptypecode/updateHelpTypeCodeMain', params)
        .success(function(data) {
          getPageLeft();
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    }
  };

  baseCode.typeCancel = function() {
    baseCode.typeCodeMain = true;
    baseCode.typeCodeMainPK = true;
    baseCode.buttonShow1 = false;
    baseCode.buttonOpera1 = true;
    baseCode.typeCodeInfo = selectDataMain;
  };

  baseCode.addCode = function() {
    baseCode.typeCode = false;
    baseCode.typeCodePK = false;
    baseCode.buttonOpera2 = false;
    baseCode.buttonShow2 = true;
    $scope.codeInfo = {};
    addoredit = 'add';
  };

  baseCode.editCode = function() {
    baseCode.typeCode = false;
    baseCode.typeCodePK = true;
    baseCode.buttonOpera2 = false;
    baseCode.buttonShow2 = true;
    addoredit = 'edit';

  };

  baseCode.codeSubmit = function() {
    baseCode.typeCode = true;
    baseCode.typeCodePK = true;
    baseCode.buttonOpera2 = true;
    baseCode.buttonShow2 = false;

    var params = {};
    params = $scope.codeInfo;
    params.typeCode = baseCode.typeCodeInfo.typeCode;
    if (addoredit === 'add') {
      $http.post('/api/security/helptypecode/addHelpTypeCode', params)
        .success(function(data) {
          getPageRight();
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    } else {
      $http.post('/api/security/helptypecode/updateHelpTypeCode', params)
        .success(function(data) {
          getPageRight();
        }).error(function(ex) {
          toasterBusService.publish({ type: 'error', title: ex });
        });
    }
  };

  baseCode.codeCancel = function() {
    baseCode.typeCode = true;
    baseCode.typeCodePK = true;
    baseCode.buttonShow2 = false;
    baseCode.buttonOpera2 = true;
    $scope.codeInfo = selectData;
    $scope.codeInfo.code = selectData.id.code;
  };

  baseCode.deleteType = function() {
    var param = {};
    param.typeCode = baseCode.gridApi.selection.getSelectedRows()[0].typeCode;
    ngDialog.open({
      template: '<p>确定删除字典分类吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        $http.get('api/security/helptypecode/deleteHelpTypeCodeMain', { params: param })
          .success(function(data) {
            if (data.retcode) {
              if (data.retcode === 1014) {
                ngDialog.open({
                  template: '<p>该字典分类包含字典，确定一起删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
                  className: 'ngdialog-theme-default',
                  plain: true,
                  scope: $scope,
                  closeByDocument: false,
                  showClose: false
                }).closePromise.then(function(data) {
                  if (data.value === 1) {
                    var param = {};
                    param.typeCode = baseCode.gridApi.selection.getSelectedRows()[0].typeCode;
                    param.includeChild = true;
                    $http.get('api/security/helptypecode/deleteHelpTypeCodeMain', { params: param })
                      .success(function(data) {
                        toasterBusService.publish({ type: 'success', title: '删除成功' });
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
              toasterBusService.publish({ type: 'success', title: '删除成功' });
              getPageLeft();
            }
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });
      }
    });
  };

  baseCode.deleteCode = function() {
    var param = {};
    param.typeCode = baseCode.gridApi.selection.getSelectedRows()[0].typeCode;
    param.code = $scope.gridApi.selection.getSelectedRows()[0].code;
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var selectedRows = $scope.gridApi.selection.getSelectedRows();
        $http.get('api/security/helptypecode/deleteHelpTypeCode', { params: param })
          .success(function(data) {
            toasterBusService.publish({ type: 'success', title: '删除成功' });
            getPageRight();
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });
      }
    });
  };

  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };

  //左边grid定义
  baseCode.gridOptionsLeft = {
    paginationPageSizes: [20, 40, 80, 1000],
    paginationPageSize: 20,
    useExternalPagination: true, //是否使用分页按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowSelection: true, // 行选择是否可用
    enableRowHeaderSelection: false,
    noUnselect: true, //默认false,选中后是否可以取消选中
    multiSelect: false,
    columnDefs: [
      { name: 'typeCode', displayName: '分类编码', enableColumnMenu: false },
      { name: 'typeName', displayName: '分类名称', enableColumnMenu: false }
      // { name: 'orderNo', displayName: '顺序', enableColumnMenu: false },
      // { name: 'remark', displayName: '备注', enableColumnMenu: false }
    ],
    onRegisterApi: function(gridApi) {
      baseCode.gridApi = gridApi;
      //行选中事件
      baseCode.gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        baseCode.typeCodeInfo = angular.copy(row.entity);
        selectDataMain = angular.copy(row.entity);
        getPageInfo();
        baseCode.typeCodeMain = true;
        baseCode.typeCodeMainPK = true;
        baseCode.buttonShow1 = false;
        baseCode.buttonOpera1 = true;
        baseCode.editCodeDisabled = true;
        $scope.codeInfo = null;
        if (baseCode.gridApi.selection.getSelectedRows().length > 0) {
          baseCode.editTypeDisabled = false;
          baseCode.addCodeDisabled = false;
        }
      });
      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
        getPageLeft();
      });

    }
  };
  //右边grid定义
  $scope.gridOptionsRight = {
    paginationPageSizes: [20, 40, 80, 1000],
    paginationPageSize: 20,
    useExternalPagination: true, //是否使用分页按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowSelection: true, // 行选择是否可用
    enableRowHeaderSelection: false,
    noUnselect: true, //默认false,选中后是否可以取消选中
    multiSelect: false,
    columnDefs: [
      { name: 'typeCode', displayName: '分类编码', enableColumnMenu: false },
      { name: 'code', displayName: '编码', enableColumnMenu: false },
      { name: 'message', displayName: '名称', enableColumnMenu: false },
      { name: 'orderNo', displayName: '顺序', enableColumnMenu: false }
      // { name: 'remark', displayName: '备注', enableColumnMenu: false }
    ],
    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
      //行选中事件
      $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        $scope.codeInfo = angular.copy(row.entity);
        selectData = angular.copy(row.entity);
        $scope.codeInfo.code = row.entity.code;
        baseCode.typeCode = true;
        baseCode.typeCodePK = true;
        baseCode.buttonShow2 = false;
        baseCode.buttonOpera2 = true;
        if (baseCode.gridApi.selection.getSelectedRows().length > 0 && $scope.gridApi.selection.getSelectedRows().length > 0) {
          baseCode.editCodeDisabled = false;
        }
      });
      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
        getPageRight();
      });

      if (baseCode.gridApi.selection.getSelectedRows().length === 0) {
        baseCode.editTypeDisabled = true;
        baseCode.addCodeDisabled = true;
      }
      if (baseCode.gridApi.selection.getSelectedRows().length === 0 || $scope.gridApi.selection.getSelectedRows().length === 0) {
        baseCode.editCodeDisabled = true;
      }
    }
  };

  //左grid加载数据
  function getPageLeft() {
    var url = '/api/security/helptypecode/queryHelpTypeCodeMain' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    var param = {};
    param.typeName = baseCode.typeName;
    $http.get(url, { params: param })
      .success(function(data) {
        baseCode.gridOptionsLeft.data = data.content;
        baseCode.gridOptionsLeft.totalItems = data.totalElements;
        if (paginationOptions.pageNumber === 0) baseCode.gridApi.pagination.seek(1);
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });

      });
  }
  getPageLeft();
  //右边grid加载数据
  function getPageRight() {
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    var url = '/api/security/helptypecode/queryHelpTypeCodeByMessage' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    var param = {};
    param.message = baseCode.message;
    $http.get(url, { params: param })
      .success(function(data) {
        $scope.gridOptionsRight.data = data.content;
        $scope.gridOptionsRight.totalItems = data.totalElements;
        if (paginationOptions.pageNumber === 0) $scope.gridApi.pagination.seek(1);
        toasterBusService.clear(msg);
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }
  getPageRight();

  function getPageInfo() {
    var url = '/api/security/helptypecode/queryHelpTypeCodeByTypeCode' + '?page=' + 0 + '&size=' + paginationOptions.pageSize;
    var param = {};
    param.typeCode = baseCode.typeCodeInfo.typeCode;
    $http.get(url, { params: param })
      .success(function(data) {
        $scope.gridOptionsRight.data = data.content;
        $scope.gridOptionsRight.totalItems = data.totalElements;
        if (paginationOptions.pageNumber === 0) $scope.gridApi.pagination.seek(1);
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });

  }

}]);
