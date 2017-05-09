'use strict';
/**
 * 试验阶段controller
 * @author jxk
 */
angular.module('lpht.rice').controller('ExperimentStageCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'ngDialog', 'toaster', function($scope, $http, $uibModal, uiGridConstants, ngDialog, toaster) {
  var sm = $scope.sm = {}; //searchModel
  var gm = $scope.gm = {}; //gridModel
  sm.searchData = {}; //查询数据集
  gm.disableDelete = true; //是否禁用删除按钮
  //查询按钮
  sm.search = function() {
    console.info(sm.searchData);
  };
  //重置按钮
  sm.reset = function() {
    sm.searchData = {};
  };
  //uiGrid参数
  gm.gridOptions = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
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
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    //---导出属性---//
    exporterCsvFilename: '试验阶段.csv', //导出文件名定义
    exporterOlderExcelCompatibility: true, //导出乱码兼容性
    exporterMenuPdf: false, //PDF导出隐藏
    //---表列属性---//
    columnDefs: [
      { field: 'name', displayName: '试验阶段名称' },
      { field: 'remark', displayName: '试验阶段描述' },
      { field: 'action', displayName: '操作', enableColumnMenu: false, enableHiding: false, enableSorting: false, width: 60, cellTemplate: '<div class="btn-group"><button type="button" class="btn btn-info btn-sm btn-icon" ng-click="grid.appScope.gm.openModal(\'edit\', row)" title="修改"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-primary btn-sm btn-icon" ng-click="grid.appScope.gm.openModal(\'view\', row)" title="查看"><i class="fa fa-file-text"></i></button></div>' }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

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
  //打开模态框，只有新增,修改和查看，只选中了一条数据的情况下打开
  gm.openModal = function(type, row) {
    var modalInstance = $uibModal.open({
      templateUrl: 'experimentStageModal',
      controller: 'ModalExperimentStageCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          return row ? row.entity : row;
        }
      }
    });

    modalInstance.result.then(function(result) {
      console.info(result);
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
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        console.info(gm.gridApi.selection.getSelectedRows());
        toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
      }
    });
  };




  //加载grid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    $http.get('api/rice/experimentStage.json')
      .success(function(data) {
        gm.gridOptions.data = data;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

}]);
/**
 * 试验阶段新增，修改，查看模态框controller
 * @author jxk
 */
angular.module('lpht.rice').controller('ModalExperimentStageCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', function($scope, $uibModalInstance, modalType, rowEntity) {
  var fm = $scope.fm = {}; //formModel
  fm.rowEntity = angular.copy(rowEntity);
  fm.modalType = modalType;

  fm.ok = function() {
    $uibModalInstance.close(fm.rowEntity);
  };

  fm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
