'use strict';

/**
 * 作物熟期controller
 * @author chenxp
 */
angular.module('app').controller('CropMaturityCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'ngDialog', 'toaster', function($scope, $http, $uibModal, uiGridConstants, ngDialog, toaster) {
  var vm = $scope.vm = {};
  vm.isCollapsed = true; //是否显示更多
  vm.searchData = {};
  vm.disableDelete = true; //是否禁用删除按钮
  //搜索按钮
  vm.search = function() {
    console.info(vm.searchData);
  };
  //重置按钮
  vm.reset = function() {
    vm.searchData = {};
  };
  //打开新增模态框，只有修改和查看，只选中了一条数据的情况下打开
  vm.open = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'cropMaturityModal',
      controller: 'ModalCropMaturityCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = vm.gridApi.selection.getSelectedRows();
          return selectedRows.length === 1 ? selectedRows[0] : null;
        }
      }
    });

    modalInstance.result.then(function(result) {
      vm.gridOptions.data.unshift(result);
    });
  };
  //ui-grid单元格按钮打开模态框，row代表所在行数据
  vm.openDetail = function(row, type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'cropMaturityModal',
      controller: 'ModalCropMaturityCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          return row.entity;
        }
      }
    });

    modalInstance.result.then(function(result) {
      console.info(result);
    });
  };
  //打开删除提示框
  vm.openDialog = function() {
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
    angular.forEach(selectedRows, function(data) {
      vm.gridOptions.data.splice(data.id - i++, 1);
    });

    toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
  };
  //uiGrid参数
  vm.gridOptions = {
    //---基础属性---//
    enableSelectAll: false,
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    //---分页属性---//
    enablePagination: true, //是否分页,false时页面底部分页按钮无法点击
    enablePaginationControls: true, //使用默认的底部分页,false时页面底部分页按钮不显示
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1, //当前页码
    paginationPageSize: 20, //每页显示个数
    totalItems: 0, //总页数
    //false:本地json
    //true :代理远程服务
    useExternalPagination: false, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    exporterMenuPdf: false, //是否导出pdf文件
    exporterCsvFilename: '熟期.csv', //导出文件名定义
    exporterOlderExcelCompatibility: true, //导出乱码问题
    //---表列属性---//
    columnDefs: [
      { field: 'name', displayName: '熟期名称' },
      { field: 'remarks', displayName: '描述', cellTooltip: true },
      { field: 'action', displayName: '操作', enableHiding: false, enableColumnMenu: false, enableSorting: false, enableFiltering: false, width: 80, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.vm.openDetail(row, \'edit\')" title="修改"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-primary btn-xs m-xxs" ng-click="grid.appScope.vm.openDetail(row, \'view\')" title="查看"><i class="fa fa-file-text"></i></button>' }
    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        console.info(currentPage);
        console.info(pageSize);
      });

      gridApi.grid.registerRowsProcessor(function(renderableRows) {
        return renderableRows;
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        vm.disableDelete = selectedRows.length > 0 ? false : true;
      });
    }
  };

  //配置uiGrid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', toasterId: 1 });
    $http.get('api/rice/cropMaturity.json')
      .success(function(data) {
        vm.gridOptions.data = data;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

}]);

/**
 * 作物熟期新增、修改、查看模态框controller
 * @author chenxp
 */
angular.module('app').controller('ModalCropMaturityCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'toaster', function($scope, $uibModalInstance, modalType, rowEntity, toaster) {
  var vm = $scope.vm = {};
  vm.rowEntity = angular.copy(rowEntity);
  vm.modalType = modalType;
  if (modalType === 'add')
    vm.rowEntity = {};

  vm.ok = function() {
    $uibModalInstance.close(vm.rowEntity);
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
