'use strict';
/**
 * ctrl 出库审核
 * @author cxl
 */
angular.module('lpht.germplasm').controller('OutStockCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toaster', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toaster) {
  var sm = $scope.sm = {};
  var gm = $scope.gm = {};
  sm.isCollapsed = true; //是否显示更多
  gm.radioModel = 'sm';
  gm.disableDelete = true;

  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  gm.grid = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
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
    useExternalSorting: true, //是否使用自定义排序逻辑
    //---选择属性---//
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    columnDefs: [
      { field: 'outstockId', displayName: '出库单号' },
      { field: 'outstockType', displayName: '出库单类型' },
      { field: 'outstockState', displayName: '出库单状态' },
      { field: 'typeNum', displayName: '品种数' },
      { field: 'storage', displayName: '仓库' },
      { field: 'storageRoom', displayName: '库房' },
      // { field: 'storageArea', displayName: '库区' },
      { field: 'outstockApplicator', displayName: '出库申请人' },
      { field: 'outstockMgr', displayName: '库管员' },
      { field: 'outstockTime', displayName: '出库时间' }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        gm.disableDelete = selectedRows.length > 0 ? false : true;
      });
    }
  };

  function getDetailData(){
    $http.get('api/germplasm/outstockform')
      .success(function(data) {
        gm.grid.data = data;
      }).error(function(ex) {
        toaster.pop('error', ex);
      });
  }

  getDetailData();

  gm.openPrintModal = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'outStockPrintModal',
      controller: 'outStockPrintCtrl',
      size: 'auto',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return selectedRows[0];
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };
  gm.openCheckView = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'popOutStockFormCheckViewModal',
      controller: 'popOutStockFormCheckViewCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return (selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };
  gm.openViewDetail = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'popOutStockFormDetailModal',
      controller: 'popOutStockFormDetailCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return selectedRows[0];
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };

  gm.openCheckModal = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'outStockCheckModal',
      controller: 'outStockCheckCtrl',
      size: 'auto',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return selectedRows[0];
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };

}]);
//查看审核意见controller
angular.module('lpht.germplasm').controller('popOutStockFormCheckViewCtrl', ['$scope', '$uibModalInstance','$http', 'rowEntity', 'parentScope', function($scope, $uibModalInstance,$http, rowEntity, parentScope) {
  var cv = $scope.cv = {};
  $scope.ps = parentScope;
  cv.rowEntity = angular.copy(rowEntity);
  cv.close = function(){
    $uibModalInstance.dismiss('cancel');
  };
}]);
// 查看打印出库弹框controller
angular.module('lpht.germplasm').controller('outStockPrintCtrl', ['$scope', '$uibModalInstance','$http', 'rowEntity', 'parentScope', function($scope, $uibModalInstance,$http, rowEntity, parentScope) {
  var pt = $scope.pt = {};
  $scope.ps = parentScope;
  pt.rowEntity = angular.copy(rowEntity);
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  pt.outStockDetailGrid = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
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
    useExternalSorting: true, //是否使用自定义排序逻辑
    //---选择属性---//
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    onRegisterApi: function(gridApi) {
      pt.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {

      });
    }
  };

  if(pt.rowEntity.outstockType === '稳定材料'||pt.rowEntity.outstockType === '中间材料'){
    pt.outStockDetailGrid.columnDefs = [
      { field: 'breedCode', displayName: '材料编码' },
      { field: 'breedName', displayName: '货号' },
      { field: 'harvestLocation', displayName: '产地' },
      { field: 'harvestTime', displayName: '收获年份' },
      { field: 'areaCode', displayName: '小区号' },
      { field: 'unit', displayName: '出库单位' },
      { field: 'outStockCount', displayName: '出库数量' },
      { field: 'storageCount', displayName: '库存数量' },
      { field: 'minStorage', displayName: '最小库存' },
       { field: 'storageLocation', displayName: '存放位置' }
    ];
  }
  if(pt.rowEntity.outstockType === '品种组合'){
    pt.outStockDetailGrid.columnDefs = [
      { field: 'breedCode', displayName: '品种编号' },
      { field: 'breedName', displayName: '货号' },
      { field: 'harvestLocation', displayName: '产地' },
      { field: 'harvestTime', displayName: '收获年份' },
      { field: 'areaCode', displayName: '小区号' },
      { field: 'unit', displayName: '出库单位' },
      { field: 'outStockCount', displayName: '出库数量' },
      { field: 'storageCount', displayName: '库存数量' },
      { field: 'minStorage', displayName: '最小库存' },
      { field: 'storageLocation', displayName: '存放位置' }
    ];
  }

  function getDetailData(){
    $http.get('api/germplasm/outstockformdetail')
      .success(function(data) {
        if(pt.rowEntity.outstockType === '稳定材料')
          pt.outStockDetailGrid.data = data.content1;
        if(pt.rowEntity.outstockType === '中间材料')
          pt.outStockDetailGrid.data = data.content2;
        if(pt.rowEntity.outstockType === '品种组合')
          pt.outStockDetailGrid.data = data.content3;
      }).error(function(ex) {
        //toaster.pop('error', ex);
      });
  }

  getDetailData();
  pt.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };

}]);

// 出库弹框controller
angular.module('lpht.germplasm').controller('outStockCheckCtrl', ['$scope', 'Upload', '$uibModalInstance','$http', 'rowEntity', 'parentScope', function($scope, Upload , $uibModalInstance,$http, rowEntity, parentScope) {
  var out = $scope.out = {};
  $scope.ps = parentScope;
  out.rowEntity = angular.copy(rowEntity);
  out.file = {};
  // var paginationOptions = {
  //   pageNumber: 0,
  //   pageSize: 20,
  //   sort: null
  // };
  // out.outStockDetailGrid = {
  //   //---基础属性---//
  //   enableGridMenu: true, //是否显示grid菜单
  //   enableSorting: true, //是否排序
  //   enableFiltering: false, //是否筛选
  //   enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
  //   enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
  //   enableColumnMenu: true, //是否显示列菜单
  //   enablePinning: false, //是否固定列
  //   enableSelectAll: false, //是否显示全选按钮
  //   //---分页属性---//
  //   enablePagination: true, //是否分页,false时页面底部分页按钮无法点击
  //   enablePaginationControls: true, //使用默认的底部分页,false时页面底部分页按钮不显示
  //   paginationPageSizes: [20, 40, 80, 1000],
  //   paginationCurrentPage: 1, //当前页码
  //   paginationPageSize: 20, //每页显示个数
  //   totalItems: 0, //总页数
  //   //false:本地json
  //   //true :代理远程服务
  //   useExternalPagination: false, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
  //   useExternalSorting: true, //是否使用自定义排序逻辑
  //   //---选择属性---//
  //   enableFullRowSelection: true, //是否点击行任意位置后选中
  //   enableRowHeaderSelection: false, //是否显示选中checkbox框
  //   multiSelect: false, //是否可以选择多个
  //   noUnselect: true, //是否不能取消选中
  //   onRegisterApi: function(gridApi) {
  //     out.gridApi = gridApi;

  //     gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
  //       paginationOptions.pageNumber = newPage - 1;
  //       paginationOptions.pageSize = pageSize;
  //     });
  //     gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {

  //     });
  //   }
  // };
  // if(out.rowEntity.outstockType === '稳定材料'){
  //   out.outStockDetailGrid.columnDefs = [
  //     { field: 'breedCode', displayName: '材料编码',width:120 },
  //     { field: 'breedName', displayName: '材料名称',width:120 },
  //     { field: 'harvestTime', displayName: '母本名称',width:100 },
  //     { field: 'areaCode', displayName: '父本名称',width:100 },
  //     { field: 'unit', displayName: '出库单位',width:100 },
  //     { field: 'outStockCount', displayName: '出库数量',width:100 },
  //     { field: 'storageCount', displayName: '库存数量',width:100 },
  //     { field: 'minStorage', displayName: '最小库存',width:100 },
  //   ];
  // }
  // if(out.rowEntity.outstockType === '中间材料'){
  //   out.outStockDetailGrid.columnDefs = [
  //     { field: 'breedCode', displayName: '材料编码',width:120 },
  //     { field: 'breedName', displayName: '材料名称',width:120 },
  //     { field: 'harvestTime', displayName: '母本名称',width:100 },
  //     { field: 'areaCode', displayName: '父本名称',width:100 },
  //     { field: 'generationNum', displayName: '世代号',width:120 },
  //     { field: 'plantNum', displayName: '株号',width:100 },
  //     { field: 'unit', displayName: '出库单位',width:100 },
  //     { field: 'outStockCount', displayName: '出库数量',width:100 },
  //     { field: 'storageCount', displayName: '库存数量',width:100 },
  //     { field: 'minStorage', displayName: '最小库存',width:100 }
  //     //{ field: 'storageLocation', displayName: '存放位置',width:180 }
  //   ];
  // }
  // if(out.rowEntity.outstockType === '品种组合'){
  //   out.outStockDetailGrid.columnDefs = [
  //     { field: 'breedCode', displayName: '品种编号',width:120 },
  //     { field: 'breedName', displayName: '品种名称',width:120 },
  //     { field: 'harvestTime', displayName: '母本名称',width:100 },
  //     { field: 'areaCode', displayName: '父本名称',width:100 },
  //     { field: 'unit', displayName: '出库单位',width:100 },
  //     { field: 'outStockCount', displayName: '出库数量',width:100 },
  //     { field: 'storageCount', displayName: '库存数量',width:100 },
  //     { field: 'minStorage', displayName: '最小库存',width:100 }
  //     //{ field: 'storageLocation', displayName: '存放位置',width:180 }
  //   ];
  // }
  function getDetailData(){
    $http.get('api/germplasm/outstockformdetail')
      .success(function(data) {
        if(out.rowEntity.outstockType === '稳定材料')
        {
          out.wdshow = true;
          out.rowEntity.wd = data.content1;
        }
        if(out.rowEntity.outstockType === '中间材料')
        {
          out.zjshow = true;
          out.rowEntity.zj = data.content2;
        }
        if(out.rowEntity.outstockType === '品种组合')
        {
          out.pzzhshow = true;
          out.rowEntity.pzzh = data.content3;
        }
      }).error(function(ex) {
        //toaster.pop('error', ex);
      });
  }

  getDetailData();
  out.eidtRow = function(row){
    row.editable = !row.editable;
  };
  out.ok = function(){
    $uibModalInstance.dismiss(out.rowEntity);
  };
  out.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };

  out.uploadFile = function(file) {
    console.log(file);
    console.log('%o----', out.file);
    var index = out.file.length - 1;
    out.rowEntity.contractName = out.file[index].name;
  };

}]);


// 查看入库明细弹框controller
angular.module('lpht.germplasm').controller('popOutStockFormDetailCtrl', ['$scope', '$uibModalInstance','$http', 'rowEntity', 'parentScope', function($scope, $uibModalInstance,$http, rowEntity, parentScope) {
  var dm = $scope.dm = {};
  $scope.ps = parentScope;
  dm.rowEntity = angular.copy(rowEntity);
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  dm.detailgrid = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
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
    useExternalSorting: true, //是否使用自定义排序逻辑
    //---选择属性---//
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    onRegisterApi: function(gridApi) {
      dm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {

      });
    }
  };
  if(dm.rowEntity.outstockType === '稳定材料'||dm.rowEntity.outstockType === '中间材料'){
    dm.detailgrid.columnDefs = [
      { field: 'breedCode', displayName: '材料编码',width:120 },
      { field: 'breedName', displayName: '货号',width:120 },
      { field: 'harvestLocation', displayName: '产地',width:100 },
      { field: 'harvestTime', displayName: '收获年份',width:100 },
      { field: 'areaCode', displayName: '小区号',width:100 },
      { field: 'unit', displayName: '出库单位',width:100 },
      { field: 'outStockCount', displayName: '出库数量',width:100 },
      { field: 'storageCount', displayName: '库存数量',width:100 },
      { field: 'minStorage', displayName: '最小库存',width:100 },
       { field: 'storageLocation', displayName: '存放位置',width:180 }
    ];
  }
  if(dm.rowEntity.outstockType === '品种组合'){
    dm.detailgrid.columnDefs = [
      { field: 'breedCode', displayName: '品种编号',width:120 },
      { field: 'breedName', displayName: '货号',width:120 },
      { field: 'harvestLocation', displayName: '产地',width:100 },
      { field: 'harvestTime', displayName: '收获年份',width:100 },
      { field: 'areaCode', displayName: '小区号',width:100 },
      { field: 'unit', displayName: '出库单位',width:100 },
      { field: 'outStockCount', displayName: '出库数量',width:100 },
      { field: 'storageCount', displayName: '库存数量',width:100 },
      { field: 'minStorage', displayName: '最小库存',width:100 },
      { field: 'storageLocation', displayName: '存放位置',width:180 }
    ];
  }
  function getDetailData(){
    $http.get('api/germplasm/outstockformdetail')
      .success(function(data) {
        if(dm.rowEntity.outstockType === '稳定材料'){
          dm.detailgrid.data = data.content1;
        }
        if(dm.rowEntity.outstockType === '中间材料'){
          dm.detailgrid.data = data.content2;
        }
        if(dm.rowEntity.outstockType === '品种组合'){
          dm.detailgrid.data = data.content3;
        }
      }).error(function(ex) {
        //toaster.pop('error', ex);
      });
  }

  getDetailData();
  dm.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };

}]);
