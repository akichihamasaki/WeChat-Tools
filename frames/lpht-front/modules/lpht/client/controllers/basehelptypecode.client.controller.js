'use strict';

angular.module('lpht.rice').controller('BaseHelpTypecodeCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'toaster', 'ngDialog', function($scope, $http, $uibModal, uiGridConstants, toaster, ngDialog) {
  var vm = $scope.vm = {};
  vm.isCollapsed = true; //是否显示更多
  vm.radioModel = 'sm';
  vm.searchData = {};
  //vm.disableEdit = true; //是否禁用修改和查看按钮，根据是否选中了多条数据来判断
  //vm.disableDelete = true; //是否禁用删除按钮，根据是否选中了至少一条数据来判断
  //搜索按钮
  vm.search = function() {
    getGrid();
  };
  //重置按钮
  vm.reset = function() {
    vm.searchData = {};
  };

  //查询系统数据字典(单个)  多个用typecodes/多个参数用，间隔
  $http.get('api/security/helptypecode/typecode/basecode')
    // $http.get('api/common/basehelpcode/baseHelpTypecode/1/01')
    .success(function(data) {
      vm.basecodetype = data;
      // vm.gridOptions.data = data;
      //vm.gridOptions.totalItems = data.length;
    })
    .error(function(data) {});

  vm.openModal = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'baseHelpTypecodeModal',
      controller: 'BaseHelpTypecodeModalCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = vm.gridApi.selection.getSelectedRows();
          return selectedRows.length === 1 ? selectedRows[0] : null;
        },
        selectionData: function() {
          return vm.basecodetype;
        }
      }
    });

    modalInstance.result.then(function(result) {
      getGrid();
    });
  };

  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null,
    sortName: null,
  };
  //打开删除提示框
  vm.deleteDialog = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        vm.delete();
      }
    });
  };

  //从当前页面的ui-grid中删除选中数据
  var i = 1;
  vm.delete = function() {
    var selectedRows = vm.gridApi.selection.getSelectedRows();
    var params = {};
    params.id = selectedRows[0].typecodeId;
    $http.get('api/baseinfo/basehelpcode/deleteBaseHelpTypecode', { params: params })
      .success(function(data) {
        getGrid();
        toaster.pop('success', '删除成功！');
      })
      .error(function(data) {
        toaster.pop({ type: 'error', title: '操作异常！', toasterId: 1 });
      });

  };
  //uiGrid参数
  vm.gridOptions = {
    enableSelectAll: false,
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    //---分页属性---//
    enablePagination: true, //是否分页,false时页面底部分页按钮无法点击
    enablePaginationControls: true, //使用默认的底部分页,false时页面底部分页按钮不显示
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1, //当前页码
    paginationPageSize: 20, //每页显示个数
    totalItems: 0, //总页数
    //false:本地json
    //true :代理远程服务
    useExternalPagination: true, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    useExternalSorting: true, //是否使用自定义排序逻辑
    //---选择属性---//
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选
    //---表列属性---//
    columnDefs: [
      { field: 'typeName', displayName: '类型', enableColumnMenu: false },
      { field: 'typecodeName', displayName: '名称', enableColumnMenu: false },
      { field: 'typecodeDesc', displayName: '描述', enableColumnMenu: false, cellTooltip: true }
    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });
      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length === 0) {
          paginationOptions.sort = null;
        } else if (sortColumns.length === 1) {
          paginationOptions.sort = sortColumns[0].sort.direction;
          switch (sortColumns[0].name) {
            case 'typeName':
              paginationOptions.sortName = 'type';
              break;
            case 'typecodeName':
              paginationOptions.sortName = 'typecode_name';
              break;
            case 'typecodeDesc':
              paginationOptions.sortName = 'typecode_desc';
              break;
          }
          getGrid();
        }
      });
      gridApi.grid.registerRowsProcessor(function(renderableRows) {
        //console.info(renderableRows);
        return renderableRows;
      });

      /*gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        vm.disableEdit = selectedRows.length == 1 ? false : true;
        vm.disableDelete = selectedRows.length > 0 ? false : true;
      });*/

    }
  };

  //配置uiGrid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', toasterId: 1 });
    var params = {};
    params = vm.searchData;
    var url = '/api/baseinfo/basehelpcode/selectBaseHelpTypecode' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize + '&sort=' + paginationOptions.sortName + ',' + paginationOptions.sort;
    $http.post(url, params)
      .success(function(data) {

        vm.gridOptions.data = data.content;
        toaster.clear(loadToaster);
        vm.gridOptions.totalItems = data.totalElements;
      })
      .error(function(data) {
        toaster.pop({ type: 'error', title: '操作异常！', toasterId: 1 });
      });
  }

  getGrid();

}]);
angular.module('lpht.rice').controller('BaseHelpTypecodeModalCtrl', ['$http', '$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'selectionData', 'toaster', function($http, $scope, $uibModalInstance, modalType, rowEntity, selectionData, toaster) {
  var vm = $scope.vm = {};
  var url = '';
  vm.basecodetype = selectionData;
  vm.rowEntity = angular.copy(rowEntity);
  vm.modalType = modalType;
  vm.formDisabled = false;
  if (modalType === 'add') {
    vm.rowEntity = null;
    url = 'api/baseinfo/basehelpcode/addBaseHelpTypecode';
  } else {
    url = 'api/baseinfo/basehelpcode/updateBaseHelpTypecode';
  }
  if (modalType === 'view')
    vm.formDisabled = true;

  vm.ok = function() {
    vm.rowEntity.cropType = '1'; //作物标识
    $http.post(url, vm.rowEntity)
      .success(function(data) {
        if (data.retcode === 1022) {
          toaster.pop({ type: 'error', title: '编码已存在！', toasterId: 1 });
        } else {
          toaster.pop({ type: 'success', title: '操作成功！', toasterId: 1 });
          $uibModalInstance.close();
        }

      })
      .error(function(data) {
        toaster.pop({ type: 'error', title: '操作失败！', toasterId: 1 });
      });

  };
  vm.edit = function() {
    vm.formDisabled = false;
  };
  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
