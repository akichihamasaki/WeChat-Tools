'use strict';

angular.module('lpht.rice').controller('EcotopeCtrl', ['$scope', '$http', '$stateParams', '$uibModal', 'uiGridConstants', 'toaster', 'ngDialog', function($scope, $http, $stateParams, $uibModal, uiGridConstants, toaster, ngDialog) {
  var vm = $scope.vm = {};
  vm.isCollapsed = true; //是否显示更多
  vm.searchData = {};
  vm.radioModel = 'sm';
  vm.disableDelete = true; //是否禁用删除按钮，根据是否选中了至少一条数据来判断
  //分页排序参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: '',
    sortName: '',
  };
  //搜索按钮
  vm.search = function() {
    getGrid();
  };
  //重置按钮
  vm.reset = function() {
    vm.searchData = {};
    getGrid();
  };

  vm.openModal = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'ecotopeModal',
      controller: 'EcotopeModalCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = vm.gridApi.selection.getSelectedRows();
          return (type !== 'add' && selectedRows.length === 1) ? selectedRows[0] : {};
        }
      }
    });

    modalInstance.result.then(function() {
      getGrid();
    });
  };

  //打开删除提示框
  vm.deleteDialog = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var selectedRows = vm.gridApi.selection.getSelectedRows();
        $http.post('api/baseinfo/regions/delRegions', { regionId: selectedRows[0].regionId })
          .success(function(data) {
            if (data.retcode) {
              toaster.pop({ type: 'error', title: data.retmsg, toasterId: 1 });
            } else {
              toaster.pop({ type: 'success', title: '删除成功', toasterId: 1 });
              getGrid();
            }
          })
          .error(function(ex) {
            toaster.pop({ type: 'error', title: ex, toasterId: 1 });
          });
      }
    });
  };
  //uiGrid参数
  vm.gridOptions = {
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
    useExternalPagination: true, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'regionsName', displayName: '生态区名称' },
      { field: 'regionsCode', displayName: '生态区编码' },
      { field: 'regionsDist', displayName: '生态区分布' },
      { field: 'regionsDesc', displayName: '生态区描述', cellTooltip: true },
      { field: 'coordinates', displayName: 'GIS地理信息' },
      { field: 'remark', displayName: '备注', cellTooltip: true }
    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length === 0) {
          paginationOptions.sort = '';
          paginationOptions.sortName = '';
        } else {
          paginationOptions.sort = sortColumns[0].sort.direction;
          switch (sortColumns[0].name) {
            case 'regionsName':
              paginationOptions.sortName = 'regions_name';
              break;
            case 'regionsCode':
              paginationOptions.sortName = 'regions_code';
              break;
            case 'regionsDist':
              paginationOptions.sortName = 'regions_dist';
              break;
            case 'regionsDesc':
              paginationOptions.sortName = 'regions_desc';
              break;
            case 'coordinates':
              paginationOptions.sortName = 'coordinates';
              break;
            case 'remark':
              paginationOptions.sortName = 'remark';
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
        vm.disableDelete = selectedRows.length > 0 ? false : true;
      });

    }
  };

  //配置uiGrid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', toasterId: 1 });
    var url = 'api/baseinfo/regions/queryRegions' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize + '&sort=' + paginationOptions.sortName + ',' + paginationOptions.sort;
    var params = vm.searchData;
    params.cropType = $stateParams.cropType;
    $http.post(url, params)
      .success(function(data) {
        vm.gridOptions.data = data.content;
        vm.gridOptions.totalItems = data.totalElements;
        vm.disableDelete = true;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.clear(loadToaster);
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

}]);
angular.module('lpht.rice').controller('EcotopeModalCtrl', ['$http', '$scope', '$stateParams', '$uibModalInstance', 'modalType', 'rowEntity', 'toaster', function($http, $scope, $stateParams, $uibModalInstance, modalType, rowEntity, toaster) {
  var vm = $scope.vm = {};
  vm.rowEntity = angular.copy(rowEntity);
  vm.rowEntity.cropType = $stateParams.cropType;
  vm.modalType = modalType;
  vm.formDisabled = false;

  if (modalType === 'view')
    vm.formDisabled = true;

  vm.edit = function() {
    vm.formDisabled = false;
  };

  vm.ok = function() {
    var url = '';
    if (modalType === 'add') {
      url = 'api/baseinfo/regions/addRegions';
    } else if (modalType === 'edit') {
      url = 'api/baseinfo/regions/updateRegions';
    }
    $http.post(url, vm.rowEntity)
      .success(function(data) {
        if (data.retcode) {
          toaster.pop({ type: 'error', title: data.retmsg, toasterId: 1 });
        } else {
          toaster.pop({ type: 'success', title: '提交成功', toasterId: 1 });
          $uibModalInstance.close();
        }
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
