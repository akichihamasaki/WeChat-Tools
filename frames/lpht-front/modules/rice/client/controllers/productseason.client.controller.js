'use strict';
/**
 * ctrl 产季管理
 * @author cxl
 */
angular.module('lpht.rice').controller('ProductSeasonCtrl', ['ngDialog','$filter', '$scope', '$http', 'uiGridConstants','$uibModal','toaster',function(ngDialog,$filter, $scope, $http, uiGridConstants,$modal,toaster) {
  //在controller中不要直接使用scope
  //var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', toasterId: 1 });
  var sm = $scope.sm = {};
  var gm = $scope.gm = {};
  sm.isCollapsed = true; //是否显示更多
  sm.search = {};

  gm.disableDelete = true;
  gm.radioModel = 'sm';

  var getPage;
  // vm.moreDetail = moreDetail;
  // vm.grid = $scope.gridOptionsSimple;

  gm.grid = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---排序属性---//
    enableSorting: true, //是否排序
    useExternalSorting: true, //是否使用自定义排序逻辑
    //---分页属性---//
    enablePagination: true, //是否分页,false时页面底部分页按钮无法点击
    enablePaginationControls: true, //使用默认的底部分页,false时页面底部分页按钮不显示
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1, //当前页码
    paginationPageSize: 20, //每页显示个数
    totalItems: 0, //总页数
    //false:本地json
    //true :代理远程服务
    useExternalPagination: false, //是否使用子自定义分页逻辑,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中


    columnDefs: [
      // { field: 'productId', displayName: '产季ID', enableColumnMenu: false },
      { field: 'productName', displayName: '产季名称' },
      { field: 'productIntro', displayName: '描述' },
      //{ field: 'action', displayName: '操作', enableColumnMenu: false,enableHiding: false, enableSorting: false, enableFiltering: false, width: 80, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.gm.openModal(\'edit\', row)" title="修改"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-primary btn-xs m-xxs" ng-click="grid.appScope.gm.openModal(\'view\', row)" title="查看"><i class="fa fa-file-text"></i></button>' }

    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        console.info(sortColumns);
        //getGrid();
      });

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        console.info(currentPage);
        console.info(pageSize);
        //getGrid();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        gm.disableDelete = selectedRows.length > 0 ? false : true;
      });
    }
  };
  //加载grid的数据
  getPage = function() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    /*$http.get("http://httpbin.org/delay/3")*/
    $http.get('api/rice/productseason')
      .success(function(data) {
        gm.grid.data=data;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });

  };
  getPage();

  sm.prodSearch = function(){
    getPage();
    console.log('查询');
  };
  sm.reset = function(){
    sm.search = {};
    getPage();
  };

  //打开模态框，只有新增,修改和查看，只选中了一条数据的情况下打开
  gm.openModal = function(type, row) {
    var modalInstance = $modal.open({
      templateUrl: 'popProductseason.html',
      controller: 'ModalProductseasoCtrl',
      size: 'lg',
      backdrop: 'static',
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
      console.info(result);
    });
  };

  // 删除事件
  gm.deleteDialog = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        console.info(gm.gridApi.selection.getSelectedRows());
        toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
      }
    });
  };


}]);

angular.module('lpht.rice').controller('ModalProductseasoCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'parentScope', function($scope, $uibModalInstance, modalType, rowEntity, parentScope) {
  var pop = $scope.pop = {}; //formModel
  pop.rowEntity = angular.copy(rowEntity);
  pop.modalTitle = modalType;
  pop.formDisabled = false;

  if (modalType === 'view')
    pop.formDisabled = true;

  $scope.ok = function() {
    $uibModalInstance.close(pop.rowEntity);
  };

  $scope.edit = function(){
    pop.formDisabled = false;
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
