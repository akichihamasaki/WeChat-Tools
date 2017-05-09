'use strict';
/**
 * ctrl 数据录入
 * @author zj
 */
angular.module('lpht.germplasm').controller('DataEnteringCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toaster', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toaster) {
  //在controller中不要直接使用scope
  var cb = $scope.cb = {};
  var cbb = $scope.cbb = {};
  cb.disable = true;
  cb.benginDate = { opened: false };
  cb.endDate = { opened: false };
  cb.benginDateOpen = function() { cb.benginDate.opened = true; };
  cb.endDateOpen = function() { cb.endDate.opened = true; };
  cb.radioModel = 'sm';
  cb.isCollapsed = true; //是否显示更多
  $http.get('api/germplasm/checkType,batchStatus,checkScope,house,area,shelves,cabinet')
    .success(function(data) {
      cb.selectData = data;
      cb.checkType = data.checkType;
      cb.batchStatus = data.batchStatus;
      cb.checkScope = data.checkScope;
      cb.house = data.house;
      cb.area = data.area;
      cb.shelves = data.shelves;
      cb.cabinet = data.cabinet;
    }).error(function(ex) {
      toaster.pop('error', ex);
    });
  cb.search = function() {
    getGridData();
  };

  cb.reset = function() {

  };
  //新增修改查看弹出框
  cb.openDetail = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'checkBatchModal',
      controller: 'CheckBatchModalCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = cb.gridApi.selection.getSelectedRows();
          return (type !== 'add' && selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };
  //数据录入弹出框
  cb.openEntering = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'dataEnteringModal',
      controller: 'DataEnteringModalCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = cb.gridApi.selection.getSelectedRows();
          return selectedRows[0];
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };

  //查看数据录入单
  cb.openDataInfo = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'dataEnteringInfoModal',
      controller: 'DataEnteringInfoModalCtrl',
      size: 'lg',
      backdrop: 'static'
    });
  };
  //打开删除提示框
  cb.deleteDialog = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        console.info(cb.gridApi.selection.getSelectedRows());
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
  cb.checkBatchGrid = {
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
      { field: 'checkNo', displayName: '盘点批次号' },
      { field: 'checkTypeText', displayName: '盘点类型' },
      { field: 'checkScopeText', displayName: '盘点范围' },
      { field: 'batchStatusText', displayName: '状态' },
      { field: 'benginData', displayName: '开始时间' },
      { field: 'endData', displayName: '结束时间' },
      { field: 'createUser', displayName: '创建人' },
      { field: 'batchState', displayName: '盘点说明' }
    ],
    onRegisterApi: function(gridApi) {
      cb.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        cb.disable = selectedRows.length > 0 ? false : true;
        cb.dataEnteringShow = true;
      });
    }
  };
  /*加载下面表格*/
  cb.dataEnteringGrid = {
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
      { field: 'breedName', displayName: '盘点批次号' },
      { field: 'growType', displayName: '单号' },
      { field: 'motherCode', displayName: '录入人' },
      { field: 'fatherCode', displayName: '状态' }
    ],
    onRegisterApi: function(gridApi) {
      cbb.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        cb.disable = selectedRows.length > 0 ? false : true;
      });
    }
  };

  /*获得表格数据事件*/
  function getGridData() {
    $http.get('api/germplasm/checkbatch')
      .success(function(data) {
        cb.checkBatchGrid.data = data;
      }).error(function(ex) {
        toaster.pop('error', ex);
      });
  }

  function getDataEnteringGridData() {
    $http.get('api/germplasm/breedingdata.json')
      .success(function(data) {
        cb.dataEnteringGrid.data = data;
      }).error(function(ex) {
        toaster.pop('error', ex);
      });
  }
  getDataEnteringGridData();
  getGridData();

}]);

/*模态弹出框的新增功能的controller*/
angular.module('lpht.germplasm').controller('CheckBatchModalCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'modalType', 'rowEntity', 'parentScope', function($scope, $uibModalInstance, $uibModal, modalType, rowEntity, parentScope) {
  var cb = $scope.cb = {};
  $scope.ps = parentScope;
  cb.rowEntity = angular.copy(rowEntity);
  cb.formDisabled = false;
  cb.modalType = modalType;
  if (modalType === 'add') cb.rowEntity = {};
  if (modalType === 'view') cb.formDisabled = true;
  cb.checkTypeChange = function(dataSeleted) {
    switch (dataSeleted) {
      case '1':
        cb.houseHide = false;
        cb.areaHide = true;
        cb.shelvesHide = true;
        cb.cabinetHide = true;
        cb.varietiesHide = true;
        break;
      case '2':
        cb.houseHide = false;
        cb.areaHide = false;
        cb.shelvesHide = true;
        cb.cabinetHide = true;
        cb.varietiesHide = true;
        break;
      case '3':
        cb.houseHide = false;
        cb.areaHide = false;
        cb.shelvesHide = false;
        cb.cabinetHide = true;
        cb.varietiesHide = true;
        break;
      case '4':
        cb.houseHide = false;
        cb.areaHide = false;
        cb.shelvesHide = false;
        cb.cabinetHide = false;
        cb.varietiesHide = true;
        break;
      case '6':
        cb.houseHide = true;
        cb.areaHide = true;
        cb.shelvesHide = true;
        cb.cabinetHide = true;
        cb.varietiesHide = false;
        break;
      case null:
        cb.houseHide = false;
        cb.areaHide = false;
        cb.shelvesHide = false;
        cb.cabinetHide = false;
        cb.varietiesHide = false;
        break;
    }
  };
  cb.openCheckModal = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'checkPersonModal',
      controller: 'CheckPersonModalCtrl',
      size: 'md',
      backdrop: 'static'
    });

    modalInstance.result.then(function(result) {
      console.info(result);
      if (result.length > 0) {
        var checkName = [];
        for (var i = 0; i < result.length; i++) {
          checkName.push(result[i].userName);
        }
        cb.rowEntity.checkName = checkName.join(',');
        cb.rowEntity.check = result;
      } else {
        cb.rowEntity.checkName = '';
        cb.rowEntity.check = '';
      }
    });
  };
  cb.openVarietiesModal = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'varietiesModal',
      controller: 'VarietiesModalCtrl',
      size: 'md',
      backdrop: 'static'
    });
    modalInstance.result.then(function(result) {
      console.info(result);
      if (result.length > 0) {
        var varietiesName = [];
        for (var i = 0; i < result.length; i++) {
          varietiesName.push(result[i].varietiesName);
        }
        cb.rowEntity.varietiesName = varietiesName.join(',');
        cb.rowEntity.varieties = result;
      } else {
        cb.rowEntity.varietiesName = '';
        cb.rowEntity.varieties = '';
      }
    });
  };
  cb.selectShelvesModal = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'selectShelvesModal',
      controller: 'SelectShelvesModalCtrl',
      size: 'md',
      backdrop: 'static'
    });

    modalInstance.result.then(function(result) {
      console.info(result);
      if (result.length > 0) {
        var checkName = [];
        for (var i = 0; i < result.length; i++) {
          checkName.push(result[i].userName);
        }
        cb.rowEntity.shelves = checkName.join(',');
        cb.rowEntity.check = result;
      } else {
        cb.rowEntity.shelves = '';
        cb.rowEntity.check = '';
      }
    });
  };
  cb.selectCabinetModal = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'selectCabinetModal',
      controller: 'SelectCabinetModalCtrl',
      size: 'md',
      backdrop: 'static'
    });

    modalInstance.result.then(function(result) {
      console.info(result);
      if (result.length > 0) {
        var checkName = [];
        for (var i = 0; i < result.length; i++) {
          checkName.push(result[i].userName);
        }
        cb.rowEntity.cabinet = checkName.join(',');
        cb.rowEntity.check = result;
      } else {
        cb.rowEntity.cabinet = '';
        cb.rowEntity.check = '';
      }
    });
  };
  cb.selectLocationModal = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'selectLocationModal',
      controller: 'SelectLocationModalCtrl',
      size: 'md',
      backdrop: 'static'
    });

    modalInstance.result.then(function(result) {
      console.info(result);
      if (result.length > 0) {
        var checkName = [];
        for (var i = 0; i < result.length; i++) {
          checkName.push(result[i].userName);
        }
        cb.rowEntity.location = checkName.join(',');
        cb.rowEntity.check = result;
      } else {
        cb.rowEntity.location = '';
        cb.rowEntity.check = '';
      }
    });
  };
  cb.ok = function() {
    $uibModalInstance.close();
  };
  cb.edit = function() {
    cb.formDisabled = false;
  };
  cb.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);


/*数据录入模态弹出框controller*/
angular.module('lpht.germplasm').controller('DataEnteringModalCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'modalType', 'rowEntity', 'parentScope', 'uiGridConstants', '$http', function($scope, $uibModalInstance, $uibModal, modalType, rowEntity, parentScope, uiGridConstants, $http) {
  var cb = $scope.cb = {};
  $scope.ps = parentScope;
  cb.rowEntity = angular.copy(rowEntity);
  cb.entering = {};
  cb.formDisabled = false;
  if (modalType === 'verify') cb.formDisabled = true;
  cb.modalType = modalType;
  cb.ok = function() {
    $uibModalInstance.close();
  };
  cb.print = function() {
    alert('打印接口，预留');
  };
  cb.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

  function getEnteringGridData() {
    $http.get('api/germplasm/dataentering')
      .success(function(data) {
        cb.enteringTable = data;
      }).error(function(ex) {
        // toaster.pop('error', ex);
      });
  }
  getEnteringGridData();

  cb.selectDeposit = function(i) {
    var modalInstance = $uibModal.open({
      templateUrl: 'selectDepositModal',
      controller: 'SelectDepositModalCtrl',
      size: 'md',
      backdrop: 'static'
    });

    modalInstance.result.then(function(result) {
      console.info(result);
      if (result.length > 0) {
        var checkName = [];
        for (var i = 0; i < result.length; i++) {
          checkName.push(result[i].userName);
        }
        cb.rowEntity.location = checkName.join(',');
        cb.rowEntity.check = result;
      } else {
        cb.rowEntity.location = '';
        cb.rowEntity.check = '';
      }
    });

  };
  cb.deleteData = function(index) {
    cb.enteringTable.splice(index, 1);
  };
  cb.addData = function() {

    var enteringNext = {
      varietiesCode: 1,
      depositText: '库区3-货架3-货柜3-货位3',
      matterial: 60,
      unit: 1,
      inNumber: 50
    };
    cb.enteringTable.push(enteringNext);
  };
}]);


/*选择品种弹出框controller*/
angular.module('lpht.germplasm').controller('VarietiesModalCtrl', ['$scope', '$uibModalInstance', 'uiGridConstants', '$http', function($scope, $uibModalInstance, uiGridConstants, $http) {
  var cb = $scope.cb = {};
  cb.check = [];
  cb.ok = function() {
    $uibModalInstance.close();
  };
  cb.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  /*加载表格*/
  cb.varietiesGrid = {
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
      { field: 'varietiesCode', displayName: '品种编号' },
      { field: 'varietiesName', displayName: '品种名称' },
      { field: 'depositText', displayName: '存放位置' },
      { field: 'matterial', displayName: '库存数量' },
      { field: 'inNumber', displayName: '实盘数量' }
    ],
    onRegisterApi: function(gridApi) {
      cb.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        if (row.isSelected) {
          var flag = true;
          for (var i = 0; i < cb.check.length; i++) {
            if (cb.check[i].$$hashKey === row.entity.$$hashKey) {
              flag = false;
              break;
            }
          }
          if (flag) {
            cb.check.push(row.entity);
          }
        } else {
          for (var j = 0; j < cb.check.length; j++) {
            if (cb.check[j].$$hashKey === row.entity.$$hashKey) {
              cb.check.splice(j, 1);
              break;
            }
          }
        }
      });
    }
  };
  cb.delManager = function(index) {
    for (var i = 0; i < cb.varietiesGrid.data.length; i++) {
      if (cb.varietiesGrid.data[i].$$hashKey === cb.check[index].$$hashKey) {
        cb.gridApi.selection.unSelectRow(cb.varietiesGrid.data[i]);
        break;
      }
    }
  };

  function getVarietiesGridData() {
    $http.get('api/germplasm/dataentering')
      .success(function(data) {
        cb.varietiesGrid.data = data;
      }).error(function(ex) {
        // toaster.pop('error', ex);
      });
  }
  getVarietiesGridData();

}]);


/*查看数据录入单详情的controller*/
angular.module('lpht.germplasm').controller('DataEnteringInfoModalCtrl', ['$scope', '$uibModalInstance', '$http', function($scope, $uibModalInstance, $http) {
  var cb = $scope.cb = {};

  cb.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  /*加载表格*/
  cb.dataInfoGrid = {
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
      { field: 'varietiesName', displayName: '品种编号' },
      { field: 'applyTime', displayName: '存放位置' },
      { field: 'insertUser', displayName: '库存数量' },
      { field: 'eliminatedStatus', displayName: '单位' },
      { field: 'a', displayName: '实盘数量' },
      { field: 'b', displayName: '盈亏' }
    ],
    onRegisterApi: function(gridApi) {
      cb.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
      });
    }
  };

  /*获得表格数据事件*/
  function getGridData() {
    $http.get('api/germplasm/stockquery')
      .success(function(data) {
        cb.dataInfoGrid.data = data;
      }).error(function(ex) {

      });
  }

  getGridData();
}]);


/**
 * 选择货架弹出框
 */
angular.module('lpht.germplasm').controller('SelectShelvesModalCtrl', ['$scope', '$http', '$uibModalInstance', 'uiGridConstants', 'toaster', function($scope, $http, $uibModalInstance, uiGridConstants, toaster) {
  var cb = $scope.cb = {}; //gridModel
  cb.check = []; //选中的管理员
  //uiGrid参数
  cb.gridOptions = {
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
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'userName', displayName: '员工姓名' },
      { field: 'orgName', displayName: '所属机构' }
    ],
    onRegisterApi: function(gridApi) {
      cb.gridApi = gridApi;

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
        if (row.isSelected) {
          var flag = true;
          for (var i = 0; i < cb.check.length; i++) {
            if (cb.check[i].$$hashKey === row.entity.$$hashKey) {
              flag = false;
              break;
            }
          }
          if (flag) {
            cb.check.push(row.entity);
          }
        } else {
          for (var j = 0; j < cb.check.length; j++) {
            if (cb.check[j].$$hashKey === row.entity.$$hashKey) {
              cb.check.splice(j, 1);
              break;
            }
          }
        }
      });
    }
  };
  //删除选择的管理员
  cb.delManager = function(index) {
    for (var i = 0; i < cb.gridOptions.data.length; i++) {
      if (cb.gridOptions.data[i].$$hashKey === cb.check[index].$$hashKey) {
        cb.gridApi.selection.unSelectRow(cb.gridOptions.data[i]);
        break;
      }
    }
  };

  cb.ok = function() {
    $uibModalInstance.close(cb.check);
  };

  cb.cancel = function() {
    $uibModalInstance.dismiss();
  };

  //加载grid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    $http.get('api/germplasm/manager')
      .success(function(data) {
        cb.gridOptions.data = data;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

}]);

/**
 * 选择货柜弹出框
 */
angular.module('lpht.germplasm').controller('SelectCabinetModalCtrl', ['$scope', '$http', '$uibModalInstance', 'uiGridConstants', 'toaster', function($scope, $http, $uibModalInstance, uiGridConstants, toaster) {
  var cb = $scope.cb = {}; //gridModel
  cb.check = []; //选中的管理员
  //uiGrid参数
  cb.gridOptions = {
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
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'userName', displayName: '员工姓名' },
      { field: 'orgName', displayName: '所属机构' }
    ],
    onRegisterApi: function(gridApi) {
      cb.gridApi = gridApi;

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
        if (row.isSelected) {
          var flag = true;
          for (var i = 0; i < cb.check.length; i++) {
            if (cb.check[i].$$hashKey === row.entity.$$hashKey) {
              flag = false;
              break;
            }
          }
          if (flag) {
            cb.check.push(row.entity);
          }
        } else {
          for (var j = 0; j < cb.check.length; j++) {
            if (cb.check[j].$$hashKey === row.entity.$$hashKey) {
              cb.check.splice(j, 1);
              break;
            }
          }
        }
      });
    }
  };
  //删除选择的管理员
  cb.delManager = function(index) {
    for (var i = 0; i < cb.gridOptions.data.length; i++) {
      if (cb.gridOptions.data[i].$$hashKey === cb.check[index].$$hashKey) {
        cb.gridApi.selection.unSelectRow(cb.gridOptions.data[i]);
        break;
      }
    }
  };

  cb.ok = function() {
    $uibModalInstance.close(cb.check);
  };

  cb.cancel = function() {
    $uibModalInstance.dismiss();
  };

  //加载grid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    $http.get('api/germplasm/manager')
      .success(function(data) {
        cb.gridOptions.data = data;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

}]);

/**
 * 选择货位弹出框
 */
angular.module('lpht.germplasm').controller('SelectLocationModalCtrl', ['$scope', '$http', '$uibModalInstance', 'uiGridConstants', 'toaster', function($scope, $http, $uibModalInstance, uiGridConstants, toaster) {
  var cb = $scope.cb = {}; //gridModel
  cb.check = []; //选中的管理员
  //uiGrid参数
  cb.gridOptions = {
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
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'userName', displayName: '员工姓名' },
      { field: 'orgName', displayName: '所属机构' }
    ],
    onRegisterApi: function(gridApi) {
      cb.gridApi = gridApi;

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
        if (row.isSelected) {
          var flag = true;
          for (var i = 0; i < cb.check.length; i++) {
            if (cb.check[i].$$hashKey === row.entity.$$hashKey) {
              flag = false;
              break;
            }
          }
          if (flag) {
            cb.check.push(row.entity);
          }
        } else {
          for (var j = 0; j < cb.check.length; j++) {
            if (cb.check[j].$$hashKey === row.entity.$$hashKey) {
              cb.check.splice(j, 1);
              break;
            }
          }
        }
      });
    }
  };
  //删除选择的管理员
  cb.delManager = function(index) {
    for (var i = 0; i < cb.gridOptions.data.length; i++) {
      if (cb.gridOptions.data[i].$$hashKey === cb.check[index].$$hashKey) {
        cb.gridApi.selection.unSelectRow(cb.gridOptions.data[i]);
        break;
      }
    }
  };

  cb.ok = function() {
    $uibModalInstance.close(cb.check);
  };

  cb.cancel = function() {
    $uibModalInstance.dismiss();
  };

  //加载grid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    $http.get('api/germplasm/manager')
      .success(function(data) {
        cb.gridOptions.data = data;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

}]);



/**
 * 选择存放位置弹出框
 */
angular.module('lpht.germplasm').controller('SelectDepositModalCtrl', ['$scope', '$http', '$uibModalInstance', 'uiGridConstants', 'toaster', function($scope, $http, $uibModalInstance, uiGridConstants, toaster) {
  var cb = $scope.cb = {}; //gridModel
  cb.check = []; //选中的管理员
  //uiGrid参数
  cb.gridOptions = {
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
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'userName', displayName: '存放位置' }
    ],
    onRegisterApi: function(gridApi) {
      cb.gridApi = gridApi;

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
        if (row.isSelected) {
          var flag = true;
          for (var i = 0; i < cb.check.length; i++) {
            if (cb.check[i].$$hashKey === row.entity.$$hashKey) {
              flag = false;
              break;
            }
          }
          if (flag) {
            cb.check.push(row.entity);
          }
        } else {
          for (var j = 0; j < cb.check.length; j++) {
            if (cb.check[j].$$hashKey === row.entity.$$hashKey) {
              cb.check.splice(j, 1);
              break;
            }
          }
        }
      });
    }
  };
  //删除选择的管理员
  cb.delManager = function(index) {
    for (var i = 0; i < cb.gridOptions.data.length; i++) {
      if (cb.gridOptions.data[i].$$hashKey === cb.check[index].$$hashKey) {
        cb.gridApi.selection.unSelectRow(cb.gridOptions.data[i]);
        break;
      }
    }
  };

  cb.ok = function() {
    $uibModalInstance.close(cb.check);
  };

  cb.cancel = function() {
    $uibModalInstance.dismiss();
  };

  //加载grid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    $http.get('api/germplasm/manager')
      .success(function(data) {
        cb.gridOptions.data = data;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

}]);
