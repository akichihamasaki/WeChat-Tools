'use strict';
/**
 * ctrl 淘汰清单
 * @author zj
 */
angular.module('lpht.germplasm').controller('ObsoleteListCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toaster', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toaster) {
  //在controller中不要直接使用scope
  var ol = $scope.ol = {};
  ol.disable = true;
  ol.disableMuch = true;
  ol.radioModel = 'sm';
  ol.isCollapsed = true; //是否显示更多
  $http.get('api/germplasm/house,secClass,breedMethod,gpValue,harvestYear,generationNo,deposit')
    .success(function(data) {
      ol.selectData = data;
      ol.house = data.house;
      ol.secClass = data.secClass;
      ol.breedMethod = data.breedMethod;
      ol.gpValue = data.gpValue;
      ol.harvestYear = data.harvestYear;
      ol.generationNo = data.generationNo;
      ol.deposit = data.deposit;
    }).error(function(ex) {
      toaster.pop('error', ex);
    });
  ol.search = function() {
    getGridData();
  };

  ol.reset = function() {

  };
  //新增修改查看弹出框
  ol.openDetail = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'obsoleteListModal',
      controller: 'ObsoleteListModalCtrl',
      size: 'lg',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = ol.gridApi.selection.getSelectedRows();
          return (type !== 'add' && selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };
  //查看历史弹出框
  ol.obsoleteHistory = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'obsoleteHistoryModal',
      controller: 'ObsoleteHistoryModalCtrl',
      size: 'md'
    });
  };
  //打开淘汰提示框
  ol.obsolete = function() {
    ngDialog.open({
      template: '<p>请确认淘汰！</p><div class="text-right"><button type="button" class="btn btn-info btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        console.info(ol.gridApi.selection.getSelectedRows());
        toaster.pop({ type: 'success', title: '剔除成功！', toasterId: 1 });
      }
    });
  };
  //打开剔除提示框
  ol.deleteDialog = function() {
    ngDialog.open({
      template: '<p>确定剔除淘汰项吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        console.info(ol.gridApi.selection.getSelectedRows());
        toaster.pop({ type: 'success', title: '剔除成功！', toasterId: 1 });
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
  ol.breedingGridOptions = {
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
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    columnDefs: [
      { field: 'varietiesName', displayName: '品种名称' },
      { field: 'varietiesCode', displayName: '品种编号' },
      { field: 'femaleNo', displayName: '母本代号' },
      { field: 'maleParent', displayName: '父本代号' },
      { field: 'pedigree', displayName: '系谱' },
      { field: 'inNumber', displayName: '数量' },
      { field: 'unit', displayName: '单位' },
      { field: 'harvestYearText', displayName: '收获年份' },
      { field: 'generationNo', displayName: '世代' },
      { field: 'secClassText', displayName: '二级分类' },
      { field: 'gpValueText', displayName: '材料价值' },
      { field: 'applyTime', displayName: '入库时间' },
      { field: 'insertUser', displayName: '淘汰申请人' },
      { field: 'eliminatedStatus', displayName: '淘汰状态' },
      { field: 'breedMethodText', displayName: '育种方法' },
      { field: 'depositText', displayName: '存放位置' },
      { field: 'applyUser', displayName: '入库人' },

    ],
    onRegisterApi: function(gridApi) {
      ol.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        ol.disable = selectedRows.length === 1 ? false : true;
        ol.disableMuch = selectedRows.length >= 1 ? false : true;
      });
    }
  };

  /*获得表格数据事件*/
  function getGridData() {
    $http.get('api/germplasm/stockquery')
      .success(function(data) {
        ol.breedingGridOptions.data = data;
      }).error(function(ex) {
        toaster.pop('error', ex);
      });
  }

  getGridData();

}]);

/*模态弹出框的新增功能的controller*/
angular.module('lpht.germplasm').controller('ObsoleteListModalCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'parentScope', function($scope, $uibModalInstance, modalType, rowEntity, parentScope) {
  var ol = $scope.ol = {};
  $scope.ps = parentScope;
  ol.rowEntity = angular.copy(rowEntity);
  console.log('%o-------', ol.rowEntity);
  ol.formDisabled = false;
  ol.modalType = modalType;
  if (modalType === 'add') ol.rowEntity = {};
  if (modalType === 'view') ol.formDisabled = true;
  ol.ok = function() {
    $uibModalInstance.close();
  };
  ol.edit = function() {
    ol.formDisabled = false;
  };
  ol.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);


/*查看历史功能的controller*/
angular.module('lpht.germplasm').controller('ObsoleteHistoryModalCtrl', ['$scope', '$uibModalInstance', '$http', function($scope, $uibModalInstance, $http) {
  var ol = $scope.ol = {};

  ol.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  /*加载表格*/
  ol.obsoleteHistoryGrid = {
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
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    columnDefs: [
      { field: 'varietiesName', displayName: '品种名称' },
      { field: 'applyTime', displayName: '确认时间' },
      { field: 'insertUser', displayName: '淘汰确认人' },
      { field: 'eliminatedStatus', displayName: '淘汰状态' }

    ],
    onRegisterApi: function(gridApi) {
      ol.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        ol.disable = selectedRows.length === 1 ? false : true;
        ol.disableMuch = selectedRows.length >= 1 ? false : true;
      });
    }
  };

  /*获得表格数据事件*/
  function getGridData() {
    $http.get('api/germplasm/stockquery')
      .success(function(data) {
        ol.obsoleteHistoryGrid.data = data;
      }).error(function(ex) {

      });
  }

  getGridData();
}]);
