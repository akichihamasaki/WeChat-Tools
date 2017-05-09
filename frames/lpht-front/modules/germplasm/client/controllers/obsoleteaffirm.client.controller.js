'use strict';
/**
 * ctrl 淘汰清单
 * @author zj
 */
angular.module('lpht.germplasm').controller('ObsoleteAffirmCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toaster', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toaster) {
  //在controller中不要直接使用scope
  var oa = $scope.oa = {};
  oa.disable = true;
  oa.radioModel = 'sm';
  oa.isCollapsed = true; //是否显示更多
  $http.get('api/germplasm/house,secClass,breedMethod,gpValue,harvestYear,generationNo,deposit')
    .success(function(data) {
      oa.selectData = data;
      oa.house = data.house;
      oa.secClass = data.secClass;
      oa.breedMethod = data.breedMethod;
      oa.gpValue = data.gpValue;
      oa.harvestYear = data.harvestYear;
      oa.generationNo = data.generationNo;
      oa.deposit = data.deposit;
    }).error(function(ex) {
      toaster.pop('error', ex);
    });
  oa.search = function() {
    getGridData();
  };

  oa.reset = function() {

  };
  //新增修改查看弹出框
  oa.openDetail = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'obsoleteAffirmModal',
      controller: 'ObsoleteAffirmModalCtrl',
      size: 'lg',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = oa.gridApi.selection.getSelectedRows();
          return (type !== 'add' && selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };
  //打开删除提示框
  oa.deleteDialog = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        console.info(oa.gridApi.selection.getSelectedRows());
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
  oa.breedingGridOptions = {
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
      { field: 'depositText', displayName: '存放位置' },
      { field: 'inNumber', displayName: '数量' },
      { field: 'unit', displayName: '单位' },
      { field: 'harvestYearText', displayName: '收获年份' },
      { field: 'generationNo', displayName: '世代' },
      { field: 'secClassText', displayName: '二级分类' },
      { field: 'breedMethodText', displayName: '育种方法' },
      { field: 'gpValueText', displayName: '材料价值' },
      { field: 'applyUser', displayName: '入库人' },
      { field: 'applyTime', displayName: '入库时间' },
      { field: 'insertUser', displayName: '淘汰申请人' },
      { field: 'eliminatedStatus', displayName: '淘汰状态' }
    ],
    onRegisterApi: function(gridApi) {
      oa.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        oa.disable = selectedRows.length === 1 ? false : true;
      });
    }
  };

  /*获得表格数据事件*/
  function getGridData() {
    $http.get('api/germplasm/stockquery')
      .success(function(data) {
        oa.breedingGridOptions.data = data;
      }).error(function(ex) {
        toaster.pop('error', ex);
      });
  }

  getGridData();

}]);

/*模态弹出框的新增功能的controller*/
angular.module('lpht.germplasm').controller('ObsoleteAffirmModalCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'parentScope', function($scope, $uibModalInstance, modalType, rowEntity, parentScope) {
  var oa = $scope.oa = {};
  $scope.ps = parentScope;
  oa.rowEntity = angular.copy(rowEntity);
  console.log('%o-------',oa.rowEntity);
  oa.formDisabled = false;
  oa.modalType = modalType;
  if (modalType === 'add') oa.rowEntity = {};
  if (modalType === 'view') oa.formDisabled = true;
  oa.ok = function() {
    $uibModalInstance.close();
  };
  oa.edit = function() {
    oa.formDisabled = false;
  };
  oa.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
