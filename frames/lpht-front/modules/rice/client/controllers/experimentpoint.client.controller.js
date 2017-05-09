'use strict';

/**
 * 试验点主界面controller
 * @author chenxp
 */
angular.module('lpht.rice').controller('ExperimentPointCtrl', ['$filter', '$scope', '$http', '$stateParams', '$uibModal', 'uiGridConstants', 'ngDialog', 'toasterBusService', function($filter, $scope, $http, $stateParams, $uibModal, uiGridConstants, ngDialog, toasterBusService) {
  var sm = $scope.sm = {}; //searchModel
  var gm = $scope.gm = {}; //gridModel
  sm.searchData = {}; //查询数据集
  sm.isCollapsed = true; //是否显示更多
  gm.disableDelete = true; //是否禁用删除按钮
  gm.disableContract = true;
  gm.disableEvaluation = true;
  gm.disableEvent = true;
  gm.radioModel = 'sm'; //ui grid初始大小
  var tm = $scope.tm = {}; //tabModel
  tm.essentialInfo = {};
  tm.financeInfo = {};
  tm.experimentAbilityInfo = {};
  tm.modalType = 'view';
  tm.isDownload = true;

  // //分页设置
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: '',
    sortName: '',
  };

  //加载试验类型、参与试验阶段
  var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
  $http.get('/api/baseinfo/basehelpcode/baseHelpTypecode/1/testtype,teststage').success(function (data) {
    toasterBusService.clear(msg);
    sm.pointType = data.testtype;
    sm.pointStage = data.teststage;
  })
  .error(function(ex) {
    toasterBusService.clear(msg);
    toasterBusService.publish({ type:'error',title:ex });
  });

  //加载试验点性质、合作状态
  $http.get('/api/security/helptypecode/typecodes/pointOwner,cooperationStatus').success(function (data) {
    toasterBusService.clear(msg);
    sm.pointOwner = data.pointOwner;
    sm.cooperationStatus = data.cooperationStatus;
  })
  .error(function(ex) {
    toasterBusService.clear(msg);
    toasterBusService.publish({ type:'error',title:ex });
  });

  //加载调查项目
  $http.post('/api/baseinfo/testItem/getTestItemSelectList', {}).success(function (data) {
    sm.testItem = data;
  })
  .error(function(ex) {
    toasterBusService.publish({ type:'error',title:ex });
  });

  //加载生态区
  $http.post('/api/baseinfo/regions/getRegionsSelectList', {}).success(function (data) {
    sm.regions = data;
  })
  .error(function(ex) {
    toasterBusService.publish({ type:'error',title:ex });
  });

  //打开模态框，只有新增,修改和查看，只选中了一条数据的情况下打开
  gm.openDetail = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'experimentPointModal',
      controller: 'ModalExperimentPointCtrl',
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
      getGrid();
      toasterBusService.publish({ type: 'success', title: '操作成功！' });
    });
  };
  //打开删除提示框
  gm.openDialog = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var selectedRows = gm.gridApi.selection.getSelectedRows();
        var params = {};
        params.pointId = selectedRows[0].pointId;
        $http.post('api/baseinfo/testPointInfo/delTestPointInfo', params)
          .success(function(data) {
            toasterBusService.publish({ type: 'success', title: '删除成功！' });
            getGrid();
          })
          .error(function(ex) {
            toasterBusService.publish({ type:'error',title:ex });
          });
      }
    });
  };

  //uiGrid参数
  gm.gridOptions = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    useExternalSorting: true, //是否使用自定义排序逻辑
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---分页属性---//
    //enablePagination: true, //是否分页,false时页面底部分页按钮无法点击
    enablePaginationControls: true, //使用默认的底部分页,false时页面底部分页按钮不显示
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1, //当前页码
    paginationPageSize: 20, //每页显示个数
    totalItems: 0, //总页数
    //false:本地json
    //true :代理远程服务
    useExternalPagination: true, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'pointName', displayName: '试验点名称', width: 200 },
      { field: 'stageCode', displayName: '参与试验阶段', enableSorting: false, enableColumnMenu: false, width: 200 },
      { field: 'pointOwnerStr', displayName: '试验点性质', width: 200 },
      { field: 'pointTypeStr', displayName: '试验点类型', width: 200 },
      { field: 'itemName', displayName: '调查项目', enableSorting: false, enableColumnMenu: false, width: 200 },
      { field: 'cooperationStatusStr', displayName: '合作状态', width: 200 },
      { field: 'regionsName', displayName: '生态区', width: 200 },
      { field: 'subzone', displayName: '生态亚区', width: 200 },
      { field: 'longitude', displayName: '经度', width: 100 },
      { field: 'latitude', displayName: '纬度', width: 100 },
      { field: 'altitude', displayName: '海拔', width: 100 }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });

      gridApi.grid.registerRowsProcessor(function(renderableRows) {
        return renderableRows;
      });

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length === 0) {
          paginationOptions.sort = '';
          paginationOptions.sortName = '';
        } else {
          paginationOptions.sort = sortColumns[0].sort.direction;
          switch (sortColumns[0].name) {
            case 'pointName':
              paginationOptions.sortName = 'point_name';
              break;
            // case 'stageCode':
            //   paginationOptions.sortName = 'stage_code';
            //   break;
            case 'pointTypeStr':
              paginationOptions.sortName = 'point_type_str';
              break;
            // case 'itemName':
            //   paginationOptions.sortName = 'item_name';
            //   break;
            case 'pointOwnerStr':
              paginationOptions.sortName = 'point_owner_str';
              break;
            case 'cooperationStatusStr':
              paginationOptions.sortName = 'cooperation_status_str';
              break;
            case 'regionsName':
              paginationOptions.sortName = 'regions_name';
              break;
            case 'subzone':
              paginationOptions.sortName = 'subzone';
              break;
            case 'longitude':
              paginationOptions.sortName = 'longitude';
              break;
            case 'latitude':
              paginationOptions.sortName = 'latitude';
              break;
            case 'altitude':
              paginationOptions.sortName = 'altitude';
              break;
            default:
              paginationOptions.sortName = '';
              paginationOptions.sort = '';
              break;
          }
        }
        getGrid();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        gm.disableDelete = selectedRows.length > 0 ? false : true;
        gm.disableContract = selectedRows.length === 1 ? false : true;
        gm.disableEvaluation = selectedRows.length === 1 ? false : true;
        gm.disableEvent = selectedRows.length === 1 ? false : true;
      });
    }
  };

  //配置uiGrid数据
  function getGrid() {
    var searchData = {};
    searchData = sm.searchData;
    searchData.cropType = $stateParams.cropType;
    var msg2 = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    var url = 'api/baseinfo/testPointInfo/queryTestPointInfo' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize + '&sort=' + paginationOptions.sortName + ',' + paginationOptions.sort;
    $http.post(url, searchData)
      .success(function(data) {

        gm.gridOptions.data = data.content;
        gm.gridOptions.totalItems = data.totalElements;
        for (var i = 0; i < data.content.length; i++) {
          if (gm.gridOptions.data[i].pointType === 'TJ001') {
            gm.gridOptions.data[i].itemName = '田间所有试验项目';
          }
        }
        toasterBusService.clear(msg);
      })
      .error(function(ex) {
        toasterBusService.clear(msg);
        toasterBusService.publish({ type: 'error', title: ex });
      });
    gm.disableDelete = true;
  }

  getGrid();

  gm.openGrid = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'experimentOtherModal',
      controller: 'ModalExperimentPointOtherCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return selectedRows.length === 1 ? selectedRows[0] : {};
        }
      }
    });

    modalInstance.result.then(function(result) {
      getGrid();
      toasterBusService.publish({ type: 'success', title: '操作成功！' });
    });
  };

  sm.search = function(){
    gm.gridApi.selection.clearSelectedRows();
    getGrid();
  };

  sm.reset = function(){
    sm.searchData = {};
    paginationOptions.pageNumber = 0;
    paginationOptions.pageSize = 20;
    gm.gridApi.selection.clearSelectedRows();
    getGrid();

  };
}]);

/*
合同、考评、事件controller
@author chenxp
*/
angular.module('lpht.rice').controller('ModalExperimentPointOtherCtrl', ['$scope','Upload', '$http', '$uibModal', '$uibModalInstance', 'ngDialog', 'modalType', 'rowEntity', 'toasterBusService', function($scope,Upload, $http, $uibModal, $uibModalInstance, ngDialog, modalType, rowEntity, toasterBusService) {
  var gm = $scope.gm = {};
  var ht = $scope.ht = {}; // 合同
  var kp = $scope.kp = {}; // 考评
  var sj = $scope.sj = {}; // 事件
  ht.disableDelete = true; //是否禁用删除按钮
  kp.disableDelete = true; //是否禁用删除按钮
  sj.disableDelete = true; //是否禁用删除按钮
  gm.buttonType = modalType;
  var paramId = {};
  paramId.pointId = rowEntity.pointId;

  gm.openContract = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'contractModal',
      controller: 'ModalContractCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        businessId: function() {
          return paramId.pointId;
        },
        rowEntity: function() {
          var selectedRows = ht.gridApi.selection.getSelectedRows();
          return selectedRows.length === 1 ? selectedRows[0] : {};
        },
        pointId: function(){
          return paramId;
        }
      }
    });
    modalInstance.result.then(function(result) {
      getContractData();
      toasterBusService.publish({ type: 'success', title: '操作成功！' });
    });
  };

  gm.openEvaluation = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'evaluationModal',
      controller: 'ModalEvaluationCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = kp.gridApi.selection.getSelectedRows();
          return selectedRows.length === 1 ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        },
        pointId: function(){
          return paramId;
        }
      }
    });
    modalInstance.result.then(function(result) {
      getEvaluationData();
      toasterBusService.publish({ type: 'success', title: '操作成功！' });
    });
  };

  gm.openEvent = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'eventModal',
      controller: 'ModalEventCtrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = sj.gridApi.selection.getSelectedRows();
          return selectedRows.length === 1 ? selectedRows[0] : {};
        },
        pointId: function(){
          return paramId;
        }
      }
    });

    modalInstance.result.then(function(result) {
      getEventData();
      toasterBusService.publish({ type: 'success', title: '操作成功！' });
    });
  };

  //打开删除提示框
  gm.openDialog = function(type) {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        if (type === 'contract')
        {
          var htselectedRows = ht.gridApi.selection.getSelectedRows()[0];
          var htparam = { agreementId:htselectedRows.agreementId };
          $http.post('api/baseinfo/agreementFile/delAgreementFile',htparam)
          .success(function(data) {
            getContractData();
            toasterBusService.publish({ type: 'success', title: '删除成功！' });
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });

        }
        else if (type === 'evaluation')
        {
          var kpselectedRows = kp.gridApi.selection.getSelectedRows()[0];
          var kpparam = { appraisalId:kpselectedRows.appraisalId };
          $http.post('api/baseinfo/appraisalRecord/delAppraisalRecord',kpparam)
          .success(function(data) {
            getEvaluationData();
            toasterBusService.publish({ type: 'success', title: '删除成功！' });
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });

        }
        else if (type === 'event')
        {
          var sjselectedRows = sj.gridApi.selection.getSelectedRows()[0];
          var sjparam = { eventId:sjselectedRows.eventId };
          $http.post('api/baseinfo/eventRecord/delEventRecord',sjparam)
          .success(function(data) {
            getEventData();
            toasterBusService.publish({ type: 'success', title: '删除成功！' });
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });

        }
      }
    });
  };

  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: '',
    sortName: '',
  };
  //合同grid
  gm.contract = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: false, //是否排序
    useExternalSorting: false, //是否使用自定义排序逻辑
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---分页属性---//
    //enablePagination: true, //是否分页,false时页面底部分页按钮无法点击
    enablePaginationControls: true, //使用默认的底部分页,false时页面底部分页按钮不显示
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1, //当前页码
    paginationPageSize: 20, //每页显示个数
    totalItems: 0, //总页数
    //false:本地json
    //true :代理远程服务
    useExternalPagination: true, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'fileName', displayName: '合同名称' },
      { field: 'uploadTime', displayName: '上传时间' },
      { field: 'uploadUser', displayName: '上传人' },
      { field: 'remarks', displayName: '描述' }
    ],
    onRegisterApi: function(gridApi) {
      ht.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getContractData();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        ht.disableDelete = selectedRows.length > 0 ? false : true;
      });

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
      });
    }
  };

  //考评grid
  gm.evaluation = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: false, //是否排序
    useExternalSorting: true, //是否使用自定义排序逻辑
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---分页属性---//
    // enablePagination: true, //是否分页,false时页面底部分页按钮无法点击
    enablePaginationControls: true, //使用默认的底部分页,false时页面底部分页按钮不显示
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1, //当前页码
    paginationPageSize: 20, //每页显示个数
    totalItems: 0, //总页数
    //false:本地json
    //true :代理远程服务
    useExternalPagination: true, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'appraisalCycle', displayName: '考评年月' },
      { field: 'appraisalResult', displayName: '考评结果' },
      { field: 'fileName', displayName: '附件' },
      { field: 'appraisalRemark', displayName: '考评说明' }      //{ field: 'action', displayName: '操作', enableHiding: false, enableColumnMenu: false, enableSorting: false, enableFiltering: false, width: 70, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.gm.openEvaluation(\'edit\', row)" title="修改"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-primary btn-xs m-xxs" ng-click="grid.appScope.gm.openEvaluation(\'view\', row)" title="查看"><i class="fa fa-file-text"></i></button>' }
    ],
    onRegisterApi: function(gridApi) {
      kp.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getEvaluationData();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        kp.disableDelete = selectedRows.length > 0 ? false : true;
      });

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
      });
    }
  };

  //事件grid
  gm.event = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: false, //是否排序
    useExternalSorting: true, //是否使用自定义排序逻辑
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---分页属性---//
    //enablePagination: true, //是否分页,false时页面底部分页按钮无法点击
    enablePaginationControls: true, //使用默认的底部分页,false时页面底部分页按钮不显示
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1, //当前页码
    paginationPageSize: 20, //每页显示个数
    totalItems: 0, //总页数
    //false:本地json
    //true :代理远程服务
    useExternalPagination: true, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'eventTitle', displayName: '事件标题' },
      { field: 'eventContent', displayName: '事件内容' },
      { field: 'recorder', displayName: '记录人' },
      { field: 'recordTime', displayName: '记录时间' }
    ],
    onRegisterApi: function(gridApi) {
      sj.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getEventData();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        sj.disableDelete = selectedRows.length > 0 ? false : true;
      });

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
      });
    }
  };

  function getContractData(){
    var param = { businessId:paramId.pointId };
    var msg3 = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    var url = 'api/baseinfo/agreementFile/queryAgreementFileByBusinessId' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    $http.post(url, param)
    .success(function(data) {
      toasterBusService.clear(msg3);
      gm.contract.data = data.content;
      gm.contract.totalItems = data.totalElements;
    })
    .error(function(ex) {
      toasterBusService.clear(msg3);
      toasterBusService.publish({ type:'error',title:ex });
    });
    ht.disableDelete = true;
  }

  function getEvaluationData(){
    var msg4 = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    var url = 'api/baseinfo/appraisalRecord/getAppraisalRecordByPointId' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    $http.post(url, paramId)
    .success(function(data) {
      toasterBusService.clear(msg4);
      gm.evaluation.data = data.content;
      gm.evaluation.totalItems = data.totalElements;
    })
    .error(function(ex) {
      toasterBusService.clear(msg4);
      toasterBusService.publish({ type: 'error', title: ex });
    });
    kp.disableDelete = true;
  }
  //加载事件数据
  function getEventData(){
    var url = 'api/baseinfo/eventRecord/queryEventRecordByPointId' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    var msg5 = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    $http.post(url, paramId)
    .success(function(data) {
      toasterBusService.clear(msg5);
      gm.event.data = data.content;
      gm.event.totalItems = data.totalElements;
    })
    .error(function(ex) {
      toasterBusService.clear(msg5);
      toasterBusService.publish({ type:'error',title:ex });
    });
    sj.disableDelete = true;
  }

  if (gm.buttonType === 'contract') {
    getContractData();
  } else if (gm.buttonType === 'evaluation') {
    getEvaluationData();
  } else if (gm.buttonType === 'event') {
    getEventData();
  }

  gm.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);
/**
 * 试验点新增、修改、查看模态框controller
 * @author chenxp
 */
angular.module('lpht.rice').controller('ModalExperimentPointCtrl', ['$filter','Upload', '$scope', '$http', '$stateParams', '$uibModal', '$uibModalInstance', 'modalType', 'rowEntity', 'parentScope', 'toasterBusService', function($filter,Upload, $scope, $http, $stateParams, $uibModal, $uibModalInstance, modalType, rowEntity, parentScope, toasterBusService) {
  $scope.ps = parentScope;
  var vm = $scope.vm = {};//基本信息
  var ci = $scope.ci = {};//公司信息
  var st = $scope.st = {};//参与试验阶段
  vm.modalType = modalType;
  vm.formDisabled = false;
  vm.rowEntity = angular.copy(rowEntity);
  vm.abilityInfo = {};//参与试验阶段
  vm.isOk = true;//参与试验阶段list是否存在
  ci.pointStage = parentScope.sm.pointStage;
  //查看时不可编辑
  if (modalType === 'view') {
    vm.formDisabled = true;
  }
  // 查看后，点击编辑
  vm.edit = function() {
    vm.formDisabled = false;
  };

  // 新增时必设字段
  if (modalType === 'add') {
    vm.isOk = false;
    st.testPointStageList = [];
  }
  else//edit时试验点能力数据加载
  {
    vm.isOk = true;
    var paramId = {};
    var msg1 = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    paramId.pointId = rowEntity.pointId;
    $http.post('api/baseinfo/testPointInfo/getTestPointInfo', paramId)
      .success(function(data) {
        toasterBusService.clear(msg1);
        vm.rowEntity = data;
        if (data.pointType === 'TJ001') {
          vm.rowEntity.testItem = '田间所有试验项目';
        }
        else
        {
          vm.rowEntity.testItem = data.itemName;
        }
        if(data.personInfo)
        {
          ci.pfInfo = data.personInfo;
          ci.pfInfo.legalPersons = data.personInfo.name;
          vm.personFilesName = data.personInfo.personFileName;
        }
        if(data.financialInfo)
        {
          ci.pfInfo = data.financialInfo;
          if (data.financialInfo.leasesBegin) {
            ci.pfInfo.leasesBegin = new Date(data.financialInfo.leasesBegin);
          }
          if (data.financialInfo.leasesEnd) {
            ci.pfInfo.leasesEnd = new Date(data.financialInfo.leasesEnd);
          }
          vm.bizFilesName = data.financialInfo.yyzzFileName;
          vm.staffFilesName = data.financialInfo.ryzzFileName;
          vm.legalFilesName = data.financialInfo.legalFileName;
        }
        if(data.pointOwner === 'ZJ')
          data.companyType = '';
        st.testPointStageList = data.testPointStageList;
        if(st.testPointStageList && st.testPointStageList.length>0){
          for(var i=0;i<st.testPointStageList.length;i++){
            for(var j=0;j<ci.pointStage.length;j++){
              if(ci.pointStage[j].typecode === st.testPointStageList[i].stageCode){
                ci.pointStage.splice(j,1);
                break;
              }
            }
          }
        }
      })
      .error(function(ex) {
        toasterBusService.clear(msg1);
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }
  //试验点性质改变
  vm.pointOwnerChange = function(){
    ci.pfInfo = {};
    vm.rowEntity.companyType = '';
    vm.bizFilesName = '';
    vm.staffFilesName = '';
    vm.legalFilesName = '';
    vm.personFilesName = '';
    if(vm.rowEntity.pointOwner === 'ZJ'){
      vm.rowEntity.cooperationStatus = 'HZJX';
    }
    else vm.rowEntity.cooperationStatus = '';
  };
  // 公司类型改变
  vm.companyTypeChange = function(){
    ci.pfInfo = {};
    vm.bizFilesName = '';
    vm.staffFilesName = '';
    vm.legalFilesName = '';
    vm.personFilesName = '';
  };
  // 土壤具有代表性
  $http.get('api/security/helptypecode/typecodes/Y_N')
    .success(function(data) {
      vm.Y_N = data.Y_N;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });
  //加载公司类型下拉框数据
  $http.get('/api/security/helptypecode/typecodes/companyType')
    .success(function(data) {
      vm.companyType = data.companyType;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });

  // 营业执照文件选择事件
  vm.getBizFilesName = function() {
    if (vm.bizFiles && vm.bizFiles.length > 0) {
      var files = [];
      for (var i = 0; i < vm.bizFiles.length; i++) {
        files.push(vm.bizFiles[i].name);
      }
      vm.bizFilesName = files.join(',');
    }
  };
  // 人员资质文件选择事件
  vm.getStaffFilesName = function() {
    if (vm.staffFiles && vm.staffFiles.length > 0) {
      var files = [];
      for (var i = 0; i < vm.staffFiles.length; i++) {
        files.push(vm.staffFiles[i].name);
      }
      vm.staffFilesName = files.join(',');
    }
  };
  // 法人身份证文件选择事件
  vm.getLegalFilesName = function() {
    if (vm.legalFiles && vm.legalFiles.length > 0) {
      var files = [];
      for (var i = 0; i < vm.legalFiles.length; i++) {
        files.push(vm.legalFiles[i].name);
      }
      vm.legalFilesName = files.join(',');
    }
  };
  // 个人身份证文件选择事件
  vm.getPersonFilesName = function() {
    if (vm.personFiles && vm.personFiles.length > 0) {
      var files = [];
      for (var i = 0; i < vm.personFiles.length; i++) {
        files.push(vm.personFiles[i].name);
      }
      vm.personFilesName = files.join(',');
    }
  };
  // 试验点类型改变事件
  vm.changeExperimentType = function() {
    if (vm.rowEntity.pointType === 'TJ001') {
      vm.rowEntity.testItem = '所有田间试验项目';
    } else {
      vm.rowEntity.testItem = '';
    }
  };

  //试验项目选择弹框
  vm.openExperimentProjectModal = function() {
    var selectedRows = [];

    if(vm.rowEntity.itemId) {
      var itemIdArr = vm.rowEntity.itemId.split(',');
      var itemNameArr = vm.rowEntity.testItem.split(',');
      for (var i = 0; i < itemIdArr.length; i++) {
        var params = {};
        params.itemName = itemNameArr[i];
        params.itemId = itemIdArr[i];
        selectedRows.push(params);
      }
    }

    var modalInstance = $uibModal.open({
      templateUrl: 'experimentProjectModal',
      controller: 'ModalExperimentProjectCtrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          return selectedRows;
        },
        parentScope: function() {
          return $scope;
        }
      }
    });

    modalInstance.result.then(function(result) {
      var itemName = [];
      var itemId = [];
      if (result && result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          itemName.push(result[i].itemName);
          itemId.push(result[i].itemId);
        }
      }
      vm.rowEntity.testItem = itemName.join(',');
      vm.rowEntity.itemId = itemId.join(',');
    });
  };

  //省、市、县级联
  //加载省
  $http.get('/api/common/address/province').success(function (data) {
    vm.province = data;
    vm.provinceCode = vm.rowEntity.province;//省数据回显
    vm.provinceChange(vm.rowEntity.province);//加载市
  })
  .error(function(ex) {
    toasterBusService.publish({ type: 'error', title: ex });
  });

  vm.provinceChange = function(province) {
    var provinceCode = '';
    if (province) {
      provinceCode = province;
    } else {
      provinceCode = vm.provinceCode;
    }
    if (provinceCode) {
      getCity(provinceCode);
    } else {
      vm.cityCode = '';
      vm.city = [];
      vm.countyCode = '';
      vm.county = [];
    }
  };

  //加载市
  function getCity (provinceCode) {
    $http.get('/api/common/address/city/' + provinceCode).success(function (data) {
      vm.city = data;
      if (vm.cityCode || vm.cityCode === '') {
        vm.cityCode = '';
        vm.countyCode = '';
        vm.county = [];
      } else {
        vm.cityCode = vm.rowEntity.city;//市回显
        vm.cityChange(vm.rowEntity.city);//加载县数据
      }
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });
  }

  vm.cityChange = function(city) {
    var cityCode = '';
    if (city) {
      cityCode = city;
    } else {
      cityCode = vm.cityCode;
    }
    if (cityCode) {
      getCounty(cityCode);
    } else {
      vm.countyCode = '';
      vm.county = [];
    }
  };

  //加载县
  function getCounty (cityCode) {
    $http.get('/api/common/address/area/' + cityCode).success(function (data) {
      vm.county = data;
      if (vm.countyCode || vm.countyCode === '' || vm.cityCode === '') {
        vm.countyCode = '';
      } else {
        vm.countyCode = vm.rowEntity.county;
      }
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });
  }

  // 亩换算成平方米
  var count = 666.67;
  vm.muToSquareMeter = function() {
    vm.abilityInfo.acreage = vm.abilityInfo.ability2 * count;
    vm.abilityInfo.acreage = Number(vm.abilityInfo.acreage.toFixed(2));
  };
  // 平方米换算成亩
  vm.squareMeterToMu = function() {
    vm.abilityInfo.ability2 = vm.abilityInfo.acreage / count;
    vm.abilityInfo.ability2 = Number(vm.abilityInfo.ability2.toFixed(2));
  };

  // 保存试验点能力
  vm.saveAbilityInfo = function() {
    var newAbilityInfo = {
      stageCodeName:vm.abilityInfo.stageCode.typecodeName,
      stageCode:vm.abilityInfo.stageCode.typecode,
      ability1:vm.abilityInfo.ability1,
      ability2:vm.abilityInfo.ability2,
      acreage:vm.abilityInfo.acreage
    };
    st.testPointStageList.push(newAbilityInfo);
    for(var j=0;j<ci.pointStage.length;j++){
      if(ci.pointStage[j].typecode === newAbilityInfo.stageCode){
        ci.pointStage.splice(j,1);
        break;
      }
    }
    vm.abilityInfo = {};//清空参与试验阶段添加字段
    isOk();
  };

  vm.resetAbilityInfo = function() {
    vm.abilityInfo = {};
  };

  //删除参与试验阶段行
  vm.removeAbility = function(item) {
    angular.forEach(st.testPointStageList, function(data, index) {
      if (data === item) {
        st.testPointStageList.splice(index, 1);
      }
    });
    ci.pointStage.push({ typecode:item.stageCode,typecodeName:item.stageCodeName });
    isOk();
  };

  function isOk() {
    if (st.testPointStageList.length > 0) {
      vm.isOk = true;
    } else {
      vm.isOk = false;
    }
  }

  // 关闭弹窗
  vm.ok = function() {
    var params = {
      cropType:$stateParams.cropType,
      pointName:vm.rowEntity.pointName,
      pointOwner:vm.rowEntity.pointOwner,
      longitude:vm.rowEntity.longitude,
      latitude:vm.rowEntity.latitude,
      altitude:vm.rowEntity.altitude,
      regionsId:vm.rowEntity.regionsId,
      area:vm.rowEntity.area,
      length:vm.rowEntity.length,
      width:vm.rowEntity.width,
      soilTexture:vm.rowEntity.soilTexture,
      typical:vm.rowEntity.typical,
      irrigationDrainage:vm.rowEntity.irrigationDrainage,
      fertility:vm.rowEntity.fertility,
      effAccTemperature:vm.rowEntity.effAccTemperature,
      contact:vm.rowEntity.contact,
      tel:vm.rowEntity.tel,
      email:vm.rowEntity.email,
      province:vm.provinceCode,
      city:vm.cityCode,
      county:vm.countyCode,
      address:vm.rowEntity.address,
      remark1:vm.rowEntity.remark1,
      remark2:vm.rowEntity.remark2,
      evaluate:vm.rowEntity.evaluate,
      companyType:vm.rowEntity.companyType,
      pointType:vm.rowEntity.pointType,
      appraiseArea:vm.rowEntity.appraiseArea,
      cooperationStatus:vm.rowEntity.cooperationStatus,
      subzone:vm.rowEntity.subzone,
      itemId:vm.rowEntity.itemId,
      testPointStageList:st.testPointStageList
    };
    if(vm.rowEntity.companyType === '03') {
      ci.pfInfo.name = ci.pfInfo.legalPersons;
      params.personInfo = ci.pfInfo;
      params.personMultipartFileList = vm.personFiles;
      params.financialInfo = {};
    }
    if(vm.rowEntity.companyType === '01'||vm.rowEntity.companyType === '02')
    {
      ci.pfInfo.leasesBegin = $filter('date')(ci.pfInfo.leasesBegin, 'yyyy-MM-dd');
      ci.pfInfo.leasesEnd = $filter('date')(ci.pfInfo.leasesEnd, 'yyyy-MM-dd');
      params.financialInfo = ci.pfInfo;
      params.yyzzMultipartFileList = vm.bizFiles;
      params.ryzzMultipartFileList = vm.staffFiles;
      params.legalMultipartFileList = vm.legalFiles;
      params.personInfo = {};
    }
    if(vm.rowEntity.pointOwner === 'ZJ'){
      params.personInfo = {};
      params.financialInfo = {};
      params.companyType = '';
    }
    if(modalType === 'add'){
      Upload.upload({
        url: 'api/baseinfo/testPointInfo/addTestPointInfo',
        data: params,
        objectKey: '.k',
        arrayKey: '[i]'
      })
      .then(function(resp){
        if(resp.status === 200)
          $uibModalInstance.close(params);
      },
      function(ex){
        toasterBusService.publish({ type: 'error', title: ex });
      });
    }
    else
    {
      params.pointId = vm.rowEntity.pointId;
      Upload.upload({
        url: 'api/baseinfo/testPointInfo/updateTestPointInfo',
        data: params,
        objectKey: '.k',
        arrayKey: '[i]'
      })
      .then(function(resp){
        if(resp.status === 200)
          $uibModalInstance.close(params);
      },
      function(ex){
        toasterBusService.publish({ type: 'error', title: ex });
      });
    }
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);

/**
 *  选择调查项目Ctrl
 */
angular.module('lpht.rice').controller('ModalExperimentProjectCtrl', ['$scope', '$http', '$uibModalInstance', 'toasterBusService', 'rowEntity', 'parentScope', function($scope, $http, $uibModalInstance, toasterBusService, rowEntity, parentScope) {
  var vm = $scope.vm = {};
  vm.rowEntity = angular.copy(rowEntity);
  $scope.ps = parentScope;
  vm.rightAll = true;
  vm.leftAll = true;
  vm.rightSelect = true;
  vm.leftSelect = true;

  vm.LeftTestItemGrid = {
    enablePagination: true,
    enablePaginationControls: true,
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1,
    paginationPageSize: 20,
    enableRowHeaderSelection: false,
    enableGridMenu: false,
    exporterMenuPdf: false,
    enableFiltering: true, //是否筛选
    multiSelect: false,

    columnDefs: [
      { field: 'itemName', displayName: '试验项目', enableColumnMenu: true }
    ],
    onRegisterApi: function(gridApi) {
      vm.leftGridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        vm.rightSelect = selectedRows.length === 1 ? false : true;
      });
    }
  };

  vm.rightTestItemGrid = {
    enablePagination: true,
    enablePaginationControls: true,
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1,
    paginationPageSize: 20,
    enableRowHeaderSelection: false,
    enableGridMenu: false,
    exporterMenuPdf: false,
    enableFiltering: true, //是否筛选
    multiSelect: false,

    columnDefs: [
      { field: 'itemName', displayName: '试验项目', enableColumnMenu: true }
    ],
    onRegisterApi: function(gridApi) {
      vm.rightGridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        vm.leftSelect = selectedRows.length === 1 ? false : true;
      });
    }
  };

  function isClick() {
    if (vm.LeftTestItemGrid.data < 1) {
      vm.rightAll = true;
    } else {
      vm.rightAll = false;
    }
    if (vm.rightTestItemGrid.data < 1) {
      vm.leftAll = true;
    } else {
      vm.leftAll = false;
    }
  }

  vm.turnRightAll = function() {
    for (var i = 0; i < vm.LeftTestItemGrid.data.length; i++) {
      vm.rightTestItemGrid.data.push(vm.LeftTestItemGrid.data[i]);
    }
    vm.LeftTestItemGrid.data.splice(0, vm.LeftTestItemGrid.data.length);
    vm.rightSelect = true;
    isClick();
  };

  vm.turnRightSelect = function() {
    var selectedRows = vm.leftGridApi.selection.getSelectedRows();
    angular.forEach(vm.LeftTestItemGrid.data, function(data,index) {
      if(vm.LeftTestItemGrid.data[index] === selectedRows[0]){
        vm.LeftTestItemGrid.data.splice(index, 1);
        vm.rightTestItemGrid.data.push(selectedRows[0]);
      }
    });
    isClick();
    vm.rightSelect = true;
  };
  vm.turnLeftSelect = function() {
    var selectedRows = vm.rightGridApi.selection.getSelectedRows();
    angular.forEach(vm.rightTestItemGrid.data, function(data,index) {
      if(vm.rightTestItemGrid.data[index] === selectedRows[0]){
        vm.rightTestItemGrid.data.splice(index, 1);
        vm.LeftTestItemGrid.data.push(selectedRows[0]);
      }
    });
    isClick();
    vm.leftSelect = true;
  };
  vm.turnLeftAll = function() {
    for (var i = 0; i < vm.rightTestItemGrid.data.length; i++) {
      vm.LeftTestItemGrid.data.push(vm.rightTestItemGrid.data[i]);
    }
    vm.rightTestItemGrid.data.splice(0, vm.rightTestItemGrid.data.length);
    vm.leftSelect = true;
    isClick();
  };

  function delSameGridData(temp){
    var leftdata = vm.LeftTestItemGrid.data;
    for(var j=0;j<vm.rowEntity.length;j++){
      for(var i=0;i<leftdata.length;i++){
        if(temp[leftdata[i].itemName]){
          leftdata.splice(i,1);
          break;
        }
      }
    }
  }
  //加载调查项目备选数据
  function getLeftTestItemGrid(params) {
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    $http.post('/api/baseinfo/testItem/getTestItemSelectList', params)
      .success(function(datas) {
        toasterBusService.clear(msg);
        vm.LeftTestItemGrid.data = datas;
        if(vm.rowEntity && vm.rowEntity.length>0){
          var temp = [];
          angular.forEach(vm.rowEntity,function(data1){
            temp[data1.itemName] = true;
          });
          delSameGridData(temp);
        }
        isClick();
      })
      .error(function(ex) {
        toasterBusService.clear(msg);
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }

  //加载调查项目已选数据
  function getRightTestItemGrid() {
    vm.rightTestItemGrid.data = vm.rowEntity;
    isClick();
  }

  var param = { pointType : 'TX001' };
  getLeftTestItemGrid(param);
  getRightTestItemGrid();

  vm.itemNameSearch = function() {
    var params = {};
    params.pointType = 'TX001';
    params.itemName = vm.testItemName;
    getLeftTestItemGrid(params);
  };

  vm.itemNameReset = function() {
    vm.testItemName = '';
    getLeftTestItemGrid(param);
  };

  vm.ok = function() {
    $uibModalInstance.close(vm.rightTestItemGrid.data);
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);
/**
 * 合同新增、修改模态框ctrl
 * @author chenxp
 */
angular.module('lpht.rice').controller('ModalContractCtrl', ['$scope', '$http', '$uibModalInstance','businessId', 'modalType', 'rowEntity', 'Upload', 'toasterBusService','pointId', function($scope, $http, $uibModalInstance,businessId, modalType, rowEntity, Upload, toasterBusService,pointId) {
  var ht = $scope.ht = {};
  ht.formDisabled = false;
  ht.modalType = modalType;

  if (modalType === 'view') {
    ht.formDisabled = true;
  }

  ht.edit = function() {
    ht.formDisabled = false;
  };

  if (modalType === 'add') {
    ht.rowEntity = {};
    ht.rowEntity.multipartFileList = [];
    ht.files = [];
  }
  else
  {
    ht.rowEntity = angular.copy(rowEntity);
    ht.files = [];
    ht.rowEntity.multipartFileList = [];
  }

  ht.uploadFile = function(file) {
    ht.rowEntity.multipartFileList[0] = ht.files[ht.files.length-1];
    ht.rowEntity.fileName = ht.files[ht.files.length-1].name;
  };

  ht.ok = function() {
    if(modalType === 'add'){
      Upload.upload({
        url: 'api/baseinfo/agreementFile/addAgreementFile',
        data:
        {
          multipartFileList : ht.rowEntity.multipartFileList,
          businessId : pointId.pointId,
          remarks : ht.rowEntity.remarks
        }
      })
      .then(function(resp){
        if(resp.status === 200)
          $uibModalInstance.close(ht.rowEntity);
      },
      function(ex){
        toasterBusService.publish({ type:'error',title:ex });
      });
    }
    else
    {
      Upload.upload({
        url: 'api/baseinfo/agreementFile/updateAgreementFile',
        data:
        {
          multipartFileList : ht.rowEntity.multipartFileList,
          businessId : pointId.pointId,
          remarks : ht.rowEntity.remarks,
          agreementId: ht.rowEntity.agreementId
        }
      })
      .then(function(resp){
        if(resp.status === 200)
          $uibModalInstance.close(ht.rowEntity);
      },
      function(ex){
        toasterBusService.publish({ type:'error',title:ex });
      });
    }
  };

  ht.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);

/**
 * 考评新增、修改、查看模态框ctrl
 * @author chenxp
 */
angular.module('lpht.rice').controller('ModalEvaluationCtrl', ['$scope', '$http', '$uibModalInstance', 'modalType', 'rowEntity', 'Upload', 'toasterBusService', 'parentScope','pointId', function($scope, $http, $uibModalInstance, modalType, rowEntity, Upload, toasterBusService, parentScope,pointId) {
  var kp = $scope.kp = {};
  $scope.ps = parentScope;
  kp.modalType = modalType;
  kp.formDisabled = false;

  //考评年月下拉框数据加载
  $http.get('api/security/helptypecode/typecodes/appraisalCycle')
  .success(function(data) {
    kp.evaluationMonth = data.appraisalCycle;
  })
  .error(function(ex) {
    toasterBusService.publish({ type:'error',title:ex });
  });
  //考评结果下拉框数据加载
  $http.get('api/security/helptypecode/typecodes/appraisalResult')
  .success(function(data) {
    kp.evaluationResult = data.appraisalResult;
  })
  .error(function(ex) {
    toasterBusService.publish({ type:'error',title:ex });
  });

  if (modalType === 'view') {
    kp.formDisabled = true;
  }

  kp.edit = function() {
    kp.formDisabled = false;
  };

  if (modalType === 'add') {
    kp.rowEntity = {};
    kp.files = [];
    kp.rowEntity.multipartFileList = [];
  } else
  {
    kp.rowEntity = angular.copy(rowEntity);
    kp.files = [];
    kp.rowEntity.appraisalCycle = kp.rowEntity.appraisalCycleStr;
    kp.rowEntity.appraisalResult = kp.rowEntity.appraisalResultStr;
    kp.rowEntity.multipartFileList = [];
  }

  kp.uploadFile = function(file) {
    kp.rowEntity.fileName = kp.files[kp.files.length-1].name;
    kp.rowEntity.multipartFileList[0] = kp.files[kp.files.length-1];
  };

  kp.ok = function() {
    if(modalType === 'add'){
      Upload.upload({
        url: 'api/baseinfo/appraisalRecord/addAppraisalRecord',
        data:
        {
          multipartFileList : kp.rowEntity.multipartFileList,
          appraisalCycle : kp.rowEntity.appraisalCycle,
          appraisalResult : kp.rowEntity.appraisalResult,
          appraisalRemark : kp.rowEntity.appraisalRemark,
          pointId : pointId.pointId

        }
      })
      .then(function(resp){
        if(resp.status === 200)
          $uibModalInstance.close(kp.rowEntity);
      },
      function(ex){
        toasterBusService.publish({ type:'error',title:ex });
      });
    }
    else
    {
      Upload.upload({
        url: 'api/baseinfo/appraisalRecord/updateAppraisalRecord',
        data:
        {
          multipartFileList : kp.rowEntity.multipartFileList,
          appraisalCycle : kp.rowEntity.appraisalCycle,
          appraisalResult : kp.rowEntity.appraisalResult,
          appraisalRemark : kp.rowEntity.appraisalRemark,
          pointId : pointId.pointId,
          agreementId : kp.rowEntity.agreementId,
          appraisalId: kp.rowEntity.appraisalId
        }
      })
      .then(function(resp){
        if(resp.status === 200)
          $uibModalInstance.close(kp.rowEntity);
      },
      function(ex){
        toasterBusService.publish({ type:'error',title:ex });
      });
    }
  };

  kp.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);

/**
 * 事件新增、修改、查看模态框ctrl
 * @author chenxp
 */
angular.module('lpht.rice').controller('ModalEventCtrl', ['$filter', '$scope', '$http', '$uibModalInstance', 'modalType', 'rowEntity', 'toasterBusService','pointId', function($filter, $scope, $http, $uibModalInstance, modalType, rowEntity, toasterBusService, pointId) {

  var sj = $scope.sj = {};
  sj.rowEntity = angular.copy(rowEntity);
  sj.modalType = modalType;
  sj.formDisabled = false;

  if (modalType === 'view') {
    sj.formDisabled = true;
  }

  sj.edit = function() {
    sj.formDisabled = false;
  };

  if (modalType === 'add')
    sj.rowEntity = {};

  sj.ok = function() {
    sj.rowEntity.pointId = pointId.pointId;
    if(modalType === 'add'){
      $http.post('api/baseinfo/eventRecord/addEventRecord',sj.rowEntity)
      .success(function(data) {
        $uibModalInstance.close(sj.rowEntity);
      })
      .error(function(ex) {
        toasterBusService.publish({ type:'error',title:ex });
      });
    }
    else
    {
      $http.post('api/baseinfo/eventRecord/updateEventRecord',sj.rowEntity)
      .success(function(data) {
        $uibModalInstance.close(sj.rowEntity);
      })
      .error(function(ex) {
        toasterBusService.publish({ type:'error',title:ex });
      });
    }
    $uibModalInstance.close(sj.rowEntity);
  };

  sj.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);

/**
 * 文件上传模态框ctrl
 * @author chenxp
 */
angular.module('lpht.rice').controller('ModalFileUploadCtrl', ['$scope', '$http', '$uibModalInstance', 'toasterBusService', 'FileUploader', function($scope, $http, $uibModalInstance, toasterBusService, FileUploader) {
  var fm = $scope.fm = {}; //fileuploadmodal
  fm.uploader = new FileUploader();

  fm.upload = function() {
    $uibModalInstance.close(fm.FormData);
  };

  fm.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);
