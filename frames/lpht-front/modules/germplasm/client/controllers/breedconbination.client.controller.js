'use strict';
/**
 * ctrl 初级试验
 * @author cxl
 */
angular.module('lpht.germplasm').controller('BreedConbinationCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toaster', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toaster) {
  //在controller中不要直接使用scope
  var sm = $scope.sm = {};
  var gm = $scope.gm = {};
  sm.search = {};

  sm.isCollapsed = true; //是否显示更多
  gm.radioModel = 'sm';
  gm.disableDelete = true;
  sm.search = function() {
    getGridData();
  };

  sm.reset = function() {
    sm.search = {};
    getGridData();
  };
  //新增修改查看弹出框
  gm.openModal = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'popBreedConbinationModal',
      controller: 'popBreedConbinationCtrl',
      size: 'lg',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return (type !== 'add' && selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
    modalInstance.result.then(function(result) {
      getGridData();
      //console.info(result);
    });
  };
  //打开删除提示框
  gm.deleteDialog = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    })
    .closePromise.then(function(data) {
      if (data.value === 1) {
        console.info(gm.gridApi.selection.getSelectedRows());
        toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
      }
    });
  };

  // //查看性状弹出框
  // gm.viewCharacterModal = function(){
  //   var modalInstance = $uibModal.open({
  //     templateUrl: 'popBreedConbinationModal',
  //     controller: 'popBreedConbinationCtrl',
  //     size: 'lg',
  //     resolve: {
  //       modalType: function() {
  //         return type;
  //       },
  //       rowEntity: function() {
  //         var selectedRows = gm.gridApi.selection.getSelectedRows();
  //         return (selectedRows.length === 1) ? selectedRows[0] : {};
  //       },
  //       parentScope: function() {
  //         return $scope;
  //       }
  //     }
  //   });
  //   modalInstance.result.then(function(result) {
  //     getGridData();
  //     //console.info(result);
  //   });
  // };

   //打开加入淘汰清单提示框
  gm.addToObsoleted = function() {
    ngDialog.open({
      template: '<p>确定加入淘汰清单吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    })
    .closePromise.then(function(data) {
      if (data.value === 1) {
        console.info(gm.gridApi.selection.getSelectedRows());
        toaster.pop({ type: 'success', title: '加入淘汰清单成功！', toasterId: 1 });
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
      { field: 'breedCode', displayName: '作物',width:100 },
      { field: 'breedCode', displayName: '品种编码',width:100 },
      { field: 'breedName', displayName: '品种名称',width:100 },
      { field: 'motherCode', displayName: '母本代号',width:100 },
      { field: 'fatherCode', displayName: '父本代号',width:100 },
      { field: 'experimentstage', displayName: '试验阶段',width:100 },
      { field: 'experimentstage', displayName: '试验结果',width:100 },
      { field: 'growType', displayName: '品种类别',width:100 },
      { field: 'growUseType', displayName: '种质用途分类',width:150 },
      { field: 'growUseGroup', displayName: '种质用途分组',width:150 },
      { field: 'count', displayName: '数量',width:100 },
      { field: 'unit', displayName: '单位',width:100 },
      { field: 'experimentstage', displayName: '存放位置',width:100 },
      { field: 'combineYear', displayName: '组合年度',width:100 },
      { field: 'matureYear', displayName: '育成年度',width:100 },
      { field: 'checkYear', displayName: '审定年度',width:100 },
      { field: 'selectedOrg', displayName: '选育单位',width:200 },
      { field: 'experimentstage', displayName: '育种家',width:100 }

      // { field: 'tie', displayName: '系谱',width:120 },
      // { field: 'row', displayName: '穗行数',width:100 },
      // { field: 'color', displayName: '轴色',width:100 },
      // { field: 'seedType', displayName: '籽粒类型',width:100 },
      // { field: 'assess', displayName: '田间综合评价',width:150 },
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

  /*获得表格数据事件*/
  function getGridData() {
    $http.get('api/germplasm/breedconbination')
    .success(function(data) {
      gm.grid.data = data;
    }).error(function(ex) {
      toaster.pop('error', ex);
    });
  }
  getGridData();

}]);

/*模态弹出框的新增功能的controller*/
angular.module('lpht.germplasm').controller('popBreedConbinationCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'parentScope', function($scope, $uibModalInstance, modalType, rowEntity, parentScope) {
  var pop = $scope.pop = {};
  $scope.ps = parentScope;
  pop.rowEntity = angular.copy(rowEntity);
  pop.formDisabled = false;
  pop.modalType = modalType;
  if (modalType === 'add') pop.rowEntity = {};
  if (modalType === 'view') pop.formDisabled = true;
  pop.ok = function() {
    $uibModalInstance.close(pop.rowEntity);
  };
  pop.edit = function() {
    pop.formDisabled = false;
  };
  pop.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
