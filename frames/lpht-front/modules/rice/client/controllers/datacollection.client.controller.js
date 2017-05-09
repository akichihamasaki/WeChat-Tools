'use strict';

/**
 * 数据采集主页面controller
 * @author jxk
 */
angular.module('lpht.rice').controller('DataCollectionCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'ngDialog', 'toasterBusService', function($scope, $http, $uibModal, uiGridConstants, ngDialog, toasterBusService) {
  var sm = $scope.sm = {}; //searchModel
  var gm = $scope.gm = {}; //gridModel
  var fm = $scope.fm = {}; //flowModel
  sm.searchData = {}; //查询数据集
  sm.isCollapsed = true; //是否显示更多
  gm.disableDelete = true; //是否禁用删除按钮
  gm.radioModel = 'sm'; //ui grid初始大小
  //查询按钮
  sm.search = function() {
    console.info(sm.searchData);
  };
  //重置按钮
  sm.reset = function() {
    sm.searchData = {};
  };
  //打开模态框，只有新增,修改和查看，只选中了一条数据的情况下打开
  gm.openModal = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'dataCollectionModal',
      controller: 'ModalDataCollectionCtrl',
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
        selectData: function() {
          return sm.selectData;
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
        toasterBusService.publish({ type: 'success', title: '删除成功！' });
      }
    });
  };
  //导出数据
  gm.export = function() {
    gm.gridApi.exporter.csvExport('all', 'all');
  };
  /**
   * 打开受灾报告模态框
   * @return {[type]} [description]
   */
  gm.openReport = function() {
    var reportInstance = $uibModal.open({
      templateUrl: 'dataCollectionReportModal',
      controller: 'ModalDataCollectionReportCtrl',
      size: 'lg',
      backdrop: 'static'
    });

    reportInstance.result.then(function(result) {
      console.info(result);
    });
  };
  //uiGrid参数
  gm.gridOptions = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
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
    //---表列属性---//
    columnDefs: [
      { field: 'name', displayName: '品种名称', width: 100, pinnedLeft: true },
      { field: 'combination', displayName: '亲本组合', width: 100 },
      { field: 'no', displayName: '品种编码', width: 100 },
      { field: 'categoryText', displayName: '品种类别', width: 100 },
      { field: 'groupText', displayName: '试验组别', cellTooltip: true, width: 200 },
      { field: 'yearText', displayName: '试验年份', width: 100 },
      { field: 'typeText', displayName: '试验类型', width: 100 },
      { field: 'expert', displayName: '育种家', width: 100 },
      { field: 'org', displayName: '育种者', width: 300 },
      { field: 'person', displayName: '联系人', width: 100 },
      { field: 'phone', displayName: '联系电话', width: 100 },
      { field: 'address', displayName: '地址', cellTooltip: true, width: 300 }
      /*{ field: 'action', displayName: '操作', enableColumnMenu: false, enableSorting: false, enableFiltering: false, width: 50, cellTemplate: '<div class=\'wrapper-xs\'><a class=\'glyphicon glyphicon-edit text-info m-r-xs\' title=\'修改\'></a><a class=\'glyphicon glyphicon-list-alt text-primary\' title=\'查看\'></a></div>' }*/
      /*{ field: 'action', displayName: '操作', enableColumnMenu: false, enableHiding: false, enableSorting: false, width: 80, pinnedRight: true, cellTemplate: '<div class="btn-group"><button type="button" class="btn btn-info btn-sm btn-icon" ng-click="grid.appScope.gm.openModal(\'edit\', row)" title="修改"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-primary btn-sm btn-icon" ng-click="grid.appScope.gm.openModal(\'view\', row)" title="查看"><i class="fa fa-file-text"></i></button></div>' }*/
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
  //打开流程模块配置界面
  fm.openFlow = function(item) {
    var flowInstance = $uibModal.open({
      templateUrl: 'dataCollectionFlowModal',
      controller: 'ModalDataCollectionFlowCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        flowItem: function() {
          return item;
        }
      }
    });

    flowInstance.result.then(function(result) {
      console.info(result);
    });
  };




  //加载试验组别，试验年份，试验类型，品种类别下拉框数据
  $http.get('api/rice/experimentGroups,experimentYears,experimentTypes,varietyCategory')
    .success(function(data) {
      sm.selectData = data; //将数据传递到modal页面，以免重复调用后台
      sm.experimentGroups = data.experimentGroups;
      sm.experimentYears = data.experimentYears;
      sm.experimentTypes = data.experimentTypes;
      sm.varietyCategory = data.varietyCategory;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });
  //加载田间试验,特性试验流程数据
  $http.get('api/rice/fieldExperiment,featureExperiment')
    .success(function(data) {
      fm.fieldFlow = data.fieldExperiment;
      fm.featureFlow = data.featureExperiment;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });

  //加载grid数据
  function getGrid() {
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    $http.get('api/rice/dataCollection.json')
      .success(function(data) {
        gm.gridOptions.data = data;
        toasterBusService.clear(msg);
      })
      .error(function(ex) {
        toasterBusService.clear(msg);
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }

  getGrid();

}]);
/**
 * 数据采集新增，修改，查看模态框controller
 * @author jxk
 */
angular.module('lpht.rice').controller('ModalDataCollectionCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'selectData', function($scope, $uibModalInstance, modalType, rowEntity, selectData) {
  var fm = $scope.fm = {}; //formModel
  fm.rowEntity = angular.copy(rowEntity);
  fm.modalType = modalType;
  fm.formDisabled = false;
  fm.selectData = selectData;

  if (modalType === 'view')
    fm.formDisabled = true;

  fm.edit = function() {
    fm.formDisabled = false;
  };

  fm.ok = function() {
    $uibModalInstance.close(fm.rowEntity);
  };

  fm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
/**
 * 数据采集受灾报告模态框controller
 * @author jxk
 */
angular.module('lpht.rice').controller('ModalDataCollectionReportCtrl', ['$scope', '$uibModalInstance', 'Upload', function($scope, $uibModalInstance, Upload) {
  var rm = $scope.rm = {}; //reportModel

  /**
   * 删除预览照片
   * @param  {int} index 照片数组的索引
   * @return {[type]}       [description]
   */
  rm.delete = function(index) {
    rm.files.splice(index, 1);
  };
  /**
   * 上传所有照片
   * @return {[type]} [description]
   */
  rm.upload = function() {
    Upload.upload({
      url: 'api/demo/upload',
      data: { file: rm.files }
    });
  };

  rm.ok = function() {
    $uibModalInstance.close(rm.formData);
  };

  rm.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);
/**
 * 数据采集流程监控模态框controller
 * @author jxk
 */
angular.module('lpht.rice').controller('ModalDataCollectionFlowCtrl', ['$scope', '$http', '$uibModalInstance', 'toasterBusService', 'flowItem', function($scope, $http, $uibModalInstance, toasterBusService, flowItem) {
  var fm = $scope.fm = {}; //flowModel
  fm.flowItem = flowItem;

  $http.get('api/rice/flowData')
    .success(function(data) {
      console.info(data[1]);
      fm.formItem = data[flowItem.id];
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });

  fm.ok = function() {
    $uibModalInstance.close(fm.formItem);
  };

  fm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
