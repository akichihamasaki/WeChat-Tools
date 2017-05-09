'use strict';
/**
 * ctrl 育种材料
 * @author zj
 */
angular.module('lpht.germplasm').controller('BreedingDataCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toaster', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toaster) {
  //在controller中不要直接使用scope
  var bd = $scope.bd = {};
  bd.disable = true;
  bd.radioModel = 'sm';
  bd.isCollapsed = true; //是否显示更多
  $http.get('api/germplasm/row,seedType,color,assess')
    .success(function(data) {
      console.log('%o-------', data);
      bd.selectData = data;
      bd.row = data.row;
      bd.seedType = data.seedType;
      bd.color = data.color;
      bd.assess = data.assess;
    }).error(function(ex) {
      toaster.pop('error', ex);
    });
  bd.search = function() {
    getGridData();
  };

  bd.reset = function() {

  };
  //新增修改查看弹出框
  bd.openDetail = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'breedingModal',
      controller: 'SeedTimeInstanceCtrl',
      size: 'lg',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = bd.gridApi.selection.getSelectedRows();
          return (type !== 'add' && selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };
  //打开删除提示框
  bd.deleteDialog = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        console.info(bd.gridApi.selection.getSelectedRows());
        toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
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
  bd.breedingGridOptions = {
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
      { field: 'breedName', displayName: '作物', width: 100 },
      { field: 'dataType', displayName: '材料类型', width: 120 },
      { field: 'dataCode', displayName: '材料编号', width: 120 },
      { field: 'breedName', displayName: '材料名称', width: 120 },
      { field: 'motherCode', displayName: '母本名称', width: 120 },
      { field: 'fatherCode', displayName: '父本名称', width: 120 },
      { field: 'tie', displayName: '世代号', width: 120 },
      { field: 'd', displayName: '株号', width: 120 },
      { field: 'd', displayName: '评价结果', width: 120 },
      { field: 'growUseType', displayName: '种质用途分类', width: 120 },
      { field: 'growUseGroup', displayName: '种质用途分组', width: 120 },
      { field: 'growValue', displayName: '种质价值', width: 120 },
      { field: 'growType', displayName: '种质类型', width: 120 },
      { field: 'growAttribute', displayName: '种质属性', width: 120 },
      { field: 'stocks', displayName: '数量', width: 80 },
      { field: 'stocks1', displayName: '单位', width: 80 },
      { field: 'growAttribute', displayName: '存放位置', width: 120 },
      { field: 'stocks', displayName: '年份', width: 80 },
      { field: 'areaCode', displayName: '小区号', width: 120 },
      { field: 'a', displayName: '上级材料编号', width: 120 },
      { field: 'b', displayName: '上级材料名称', width: 120 },
      { field: 'e', displayName: '育种家', width: 120 },
      { field: 'breedMethod', displayName: '育种方法', width: 120 }
    ],
    onRegisterApi: function(gridApi) {
      bd.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        bd.disable = selectedRows.length > 0 ? false : true;
      });
    }
  };

  /*获得表格数据事件*/
  function getGridData() {
    $http.get('api/germplasm/breedingdata.json')
      .success(function(data) {
        bd.breedingGridOptions.data = data;
      }).error(function(ex) {
        toaster.pop('error', ex);
      });
  }

  getGridData();

}]);

/*模态弹出框的新增功能的controller*/
angular.module('lpht.germplasm').controller('SeedTimeInstanceCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'parentScope', function($scope, $uibModalInstance, modalType, rowEntity, parentScope) {
  var bd = $scope.bd = {};
  $scope.ps = parentScope;
  bd.rowEntity = angular.copy(rowEntity);
  bd.formDisabled = false;
  bd.modalType = modalType;
  if (modalType === 'add') bd.rowEntity = {};
  if (modalType === 'view') bd.formDisabled = true;
  bd.ok = function() {
    $uibModalInstance.close();
  };
  bd.edit = function() {
    bd.formDisabled = false;
  };
  bd.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
