'use strict';
angular.module('lpht.rice').controller('SeedTimeCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toaster', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toaster) {
  //在controller中不要直接使用scope
  var vm = $scope.vm = {};

  vm.search = function() {
    getGridData();
  };

  vm.reset = function() {

  };

  vm.openDetail = function(type, row) {
    var modalInstance = $uibModal.open({
      templateUrl: 'seedTime',
      controller: 'SeedTimeInstanceCtrl',
      size: 'md',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          return row ? row.entity : row;
        }
      }
    });
  };


  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  /*加载表格*/
  vm.grid = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
    enableSelectAll: false, //是否显示全选按钮
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
    exporterCsvFilename: '播种季节.csv', //导出文件名定义
    exporterOlderExcelCompatibility: true, //导出乱码问题
    columnDefs: [
      { field: 'name', displayName: '季节名称' },
      { field: 'remark', displayName: '描述' },
      { field: 'action', displayName: '操作', enableColumnMenu: false, enableHiding: false, enableSorting: false, enableFiltering: false, width: 70, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.vm.openDetail(\'edit\' ,row )" title="修改"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-primary btn-xs m-xxs" ng-click="grid.appScope.vm.openDetail(\'view\',row )" title="查看"><i class="fa fa-file-text"></i></button>' }

    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
    }
  };

  /*获得表格数据事件*/
  function getGridData() {
    $http.get('api/rice/experimentproject.json')
      .success(function(data) {
        vm.grid.data = data;
      }).error(function(ex) {
        toaster.pop('error', ex);
      });
  }

  getGridData();

}]);

/*模态弹出框的新增功能的controller*/
angular.module('lpht.rice').controller('SeedTimeInstanceCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', function($scope, $uibModalInstance, modalType, rowEntity) {
  var vm = $scope.vm = {};
  vm.character = angular.copy(rowEntity);
  vm.modalType = modalType;
  if (modalType === 'add') vm.rowEntity = {};

  vm.ok = function() {
    $uibModalInstance.close();
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
