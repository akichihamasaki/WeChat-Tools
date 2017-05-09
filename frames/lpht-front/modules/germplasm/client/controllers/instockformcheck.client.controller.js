'use strict';
/**
 * ctrl 入库审核
 * @author cxl
 */
angular.module('lpht.germplasm').controller('InStockFormCheckCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toaster', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toaster) {
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
      { field: 'instockId', displayName: '入库单号' },
      { field: 'instockType', displayName: '入库单类型' },
      { field: 'instockState', displayName: '入库单状态' },
      { field: 'typeNum', displayName: '品种数' },
      { field: 'storage', displayName: '仓库' },
      { field: 'storageRoom', displayName: '库房' },
      // { field: 'storageArea', displayName: '库区',width:100 },
      { field: 'instockApplicator', displayName: '入库申请人' },
      { field: 'instockMgr', displayName: '库管员' },
      { field: 'instockTime', displayName: '入库时间' }
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
        gm.checkState = true;
        if(selectedRows[0])
        {
          if(selectedRows[0].checkState === 'checked')
            gm.checkState = false;
        }
      });
    }
  };

  function getDetailData(){
    $http.get('api/germplasm/instockform')
      .success(function(data) {
        gm.grid.data = data;
      }).error(function(ex) {
        toaster.pop('error', ex);
      });
  }

  getDetailData();

  gm.openViewDetail = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'popInStockFormDetailModal',
      controller: 'popInStockFormDetailCtrl',
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
    modalInstance.result.then(function(result) {
      console.info(result);
    });
  };

  gm.openCheckModal = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'popInStockFormCheckModal',
      controller: 'popInStockFormCheckCtrl',
      size: 'auto',
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
    modalInstance.result.then(function(result) {
      console.info(result);
    });
  };

  gm.openCheckConfirmModal = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'popInStockFormCheckConfirmModal',
      controller: 'popInStockFormCheckConfirmCtrl',
      size: 'auto',
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
    modalInstance.result.then(function(result) {
      console.info(result);
    });
  };
}]);

// 入库确认controller
angular.module('lpht.germplasm').controller('popInStockFormCheckConfirmCtrl', ['$scope', '$uibModalInstance','$http','$uibModal', 'rowEntity', 'parentScope', function($scope, $uibModalInstance,$http,$uibModal, rowEntity, parentScope) {
  var cc = $scope.cc = {};
  $scope.ps = parentScope;
  cc.rowEntity = angular.copy(rowEntity);
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  cc.checkgrid = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
    enableSelectAll: true, //是否显示全选按钮
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
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    onRegisterApi: function(gridApi) {
      cc.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        // cc.updateLocationAble = selectedRows.length > 0 ? false : true;
      });
    }
  };

  if(cc.rowEntity.instockType === '稳定材料'){
    cc.checkgrid.columnDefs = [
      { field: 'entityCode',displayName: '单内编号', width: 100 },
      { field: 'entityCode',displayName: '货号', width: 100 },
      { field: 'breedCode', displayName: '材料编码',width:150 },
      { field: 'breedName', displayName: '材料名称',width:150 },
      { field: 'motherCode', displayName: '母本名称',width:100 },
      { field: 'fatherCode', displayName: '父本名称',width:100 },
      { field: 'harvestLocation', displayName: '收获地点',width:100 },
      { field: 'harvestTime', displayName: '收获年份', width: 100 },
      { field: 'areaCode', displayName: '小区号', width: 100 },
      { field: 'unit', displayName: '单位', width: 100 },
      { field: 'count', displayName: '申请数量',width:100 },
      { field: 'count', displayName: '入库数量', width: 100 },
      { field: 'storageLocation', displayName: '存放位置',width:180 },
      { field: 'action', displayName: '操作', enableHiding: false, enableColumnMenu: false, enableSorting: false, enableFiltering: false,width:100, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.cc.openChangeLocation(row)">修改存放位置</button>' }
    ];
  }
  if(cc.rowEntity.instockType === '中间材料'){

    cc.checkgrid.columnDefs = [
      { field: 'entityCode',displayName: '单内编号', width: 100 },
      { field: 'entityCode',displayName: '货号', width: 100 },
      { field: 'breedCode', displayName: '材料编码',width:100 },
      { field: 'breedName', displayName: '材料名称',width:100 },
      { field: 'motherCode', displayName: '母本名称',width:100 },
      { field: 'fatherCode', displayName: '父本名称',width:100 },
      { field: 'entityCode', displayName: '世代号',width:100 },
      { field: 'entityCode', displayName: '株号',width:100 },
      { field: 'harvestLocation', displayName: '收获地点',width:100 },
      { field: 'harvestTime', displayName: '收获年份', width: 100 },
      { field: 'areaCode', displayName: '小区号', width: 100 },
      { field: 'unit', displayName: '单位', width: 60 },
      { field: 'count', displayName: '申请数量',width:100 },
      { field: 'count', displayName: '入库数量', width: 100 },
      { field: 'storageLocation', displayName: '存放位置',width:180 },
      { field: 'action', displayName: '操作', enableHiding: false, enableColumnMenu: false, enableSorting: false, enableFiltering: false,width:100, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.cc.openChangeLocation(row)">修改存放位置</button>' }
    ];
  }
  if(cc.rowEntity.instockType === '品种组合'){
    cc.checkgrid.columnDefs = [
      { field: 'entityCode',displayName: '单内编号', width: 100 },
      { field: 'entityCode',displayName: '货号', width: 100 },
      { field: 'breedCode', displayName: '品种编码',width:100 },
      { field: 'breedName', displayName: '品种名称',width:100 },
      { field: 'motherCode', displayName: '母本名称',width:100 },
      { field: 'fatherCode', displayName: '父本名称',width:100 },
      { field: 'harvestLocation', displayName: '收获地点',width:100 },
      { field: 'harvestTime', displayName: '收获年份', width: 100 },
      { field: 'areaCode', displayName: '小区号', width: 100 },
      { field: 'unit', displayName: '单位', width: 60 },
      { field: 'count', displayName: '申请数量',width:100 },
      { field: 'count', displayName: '入库数量', width: 100 },
      { field: 'storageLocation', displayName: '存放位置',width:180 },
      { field: 'action', displayName: '操作', enableHiding: false, enableColumnMenu: false, enableSorting: false, enableFiltering: false,width:100, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.cc.openChangeLocation(row)">修改存放位置</button>' }
    ];
  }

  function getDetailData(){
    $http.get('api/germplasm/instockformdetail')
      .success(function(data) {
        if(cc.rowEntity.instockType === '稳定材料'){
          cc.checkgrid.data = data.content1;
        }
        if(cc.rowEntity.instockType === '中间材料'){
          cc.checkgrid.data = data.content2;
        }
        if(cc.rowEntity.instockType === '品种组合'){
          cc.checkgrid.data = data.content3;
        }
      }).error(function(ex) {
        //toaster.pop('error', ex);
      });
  }
  getDetailData();
  cc.openChangeLocation = function(row){
    var modalInstance = $uibModal.open({
      templateUrl: 'popInStockFormChangeLocationModal',
      controller: 'popInStockFormChangeLocationCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          return row.entity ? row.entity : {} ;
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
    modalInstance.result.then(function(result) {
      console.info(result);
    });
  };
  cc.ok = function(){
    $uibModalInstance.dismiss(cc.rowEntity);
  };
  cc.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
}]);


// 入库审核弹框controller
angular.module('lpht.germplasm').controller('popInStockFormCheckCtrl', ['$scope','$uibModal', '$uibModalInstance','$http', 'rowEntity', 'parentScope', function($scope,$uibModal, $uibModalInstance,$http, rowEntity, parentScope) {
  var pop = $scope.pop = {};
  $scope.ps = parentScope;
  pop.rowEntity = angular.copy(rowEntity);

  function getDetailData(){
    $http.get('api/germplasm/instockformdetail')
      .success(function(data) {
        if(pop.rowEntity.instockType === '稳定材料'){
          pop.wdshow = true;
          pop.rowEntity.wd = data.content1;
        }
        if(pop.rowEntity.instockType === '中间材料'){
          pop.zjshow = true;
          pop.rowEntity.zj = data.content2;
        }
        if(pop.rowEntity.instockType === '品种组合'){
          pop.pzzhshow = true;
          pop.rowEntity.pzzh = data.content3;
        }
      }).error(function(ex) {
        //toaster.pop('error', ex);
      });
  }
  getDetailData();
  pop.openChangeLocation = function(row){
    var modalInstance = $uibModal.open({
      templateUrl: 'popInStockFormChangeLocationModal',
      controller: 'popInStockFormChangeLocationCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          return row.entity;
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
    modalInstance.result.then(function(result) {
      console.info(result);
    });
  };

  pop.eidtRow = function(row){
    row.editable = !row.editable;
  };
  pop.ok = function(){
    $uibModalInstance.dismiss();
  };
  pop.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };

}]);
// 修改存放位置controller
angular.module('lpht.germplasm').controller('popInStockFormChangeLocationCtrl', ['$scope', '$uibModalInstance','$http', 'rowEntity', 'parentScope', function($scope, $uibModalInstance,$http, rowEntity, parentScope) {
  var cl = $scope.cl = {};
  $scope.ps = parentScope;
  cl.rowEntity = angular.copy(rowEntity);
  cl.ok = function(){
    $uibModalInstance.dismiss(cl.rowEntity);
  };
  cl.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
}]);

// 查看入库明细弹框controller
angular.module('lpht.germplasm').controller('popInStockFormDetailCtrl', ['$scope', '$uibModalInstance','$http', 'rowEntity', 'parentScope', function($scope, $uibModalInstance,$http, rowEntity, parentScope) {
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
  if(dm.rowEntity.instockType === '稳定材料'||dm.rowEntity.instockType === '中间材料'){
    dm.detailgrid.columnDefs = [
      { field: 'breedName', displayName: '货号',width:120 },
      { field: 'breedCode', displayName: '材料编码',width:120 },
      { field: 'harvestLocation', displayName: '产地',width:100 },
      { field: 'harvestTime', displayName: '收获年份',width:100 },
      { field: 'areaCode', displayName: '小区号',width:100 },
      { field: 'unit', displayName: '入库单位',width:100 },
      { field: 'count', displayName: '申请数量',width:100 },
      { field: 'count', displayName: '入库数量', width: 100 },
      { field: 'storageLocation', displayName: '存放位置',width:180 }
    ];
  }
  if(dm.rowEntity.instockType === '品种组合'){
    dm.detailgrid.columnDefs = [
      { field: 'breedName', displayName: '货号',width:120 },
      { field: 'breedCode', displayName: '品种编号',width:120 },

      { field: 'harvestLocation', displayName: '产地',width:100 },
      { field: 'harvestTime', displayName: '收获年份',width:100 },
      { field: 'areaCode', displayName: '小区号',width:100 },
      { field: 'unit', displayName: '入库单位',width:100 },
      { field: 'count', displayName: '申请数量',width:100 },
      { field: 'count', displayName: '入库数量', width: 100 },
      { field: 'storageLocation', displayName: '存放位置',width:180 }
    ];
  }

  function getDetailData(){
    $http.get('api/germplasm/instockformdetail')
      .success(function(data) {
        if(dm.rowEntity.instockType === '稳定材料'){
          dm.detailgrid.data = data.content1;
        }
        if(dm.rowEntity.instockType === '中间材料'){
          dm.detailgrid.data = data.content2;
        }
        if(dm.rowEntity.instockType === '品种组合'){
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
