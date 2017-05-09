'use strict';

/**
 * 作物亚型主页面controller
 * @author jxk
 */
angular.module('lpht.rice').controller('CropSubtypeCtrl', ['$scope', '$http', '$stateParams', '$uibModal', 'uiGridConstants', 'ngDialog', 'toasterBusService', function($scope, $http, $stateParams, $uibModal, uiGridConstants, ngDialog, toasterBusService) {
  var vm = $scope.vm = {};
  vm.searchData = {}; //查询数据集
  vm.isCollapsed = true; //是否显示更多
  vm.disableDelete = true; //是否禁用删除按钮，根据是否选中了至少一条数据来判断
  vm.radioModel = 'sm'; //ui grid初始大小
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
  //ui-grid单元格按钮打开模态框，row代表所在行数据
  vm.openDetail = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'cropSubtypeModal',
      controller: 'ModalCropSubtypeCtrl',
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
  vm.openDialog = function() {
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
        $http.post('api/baseinfo/cropSubtypes/delCropSubtypes', { subtypesId: selectedRows[0].subtypesId })
          .success(function(data) {
            if (data.retcode) {
              toasterBusService.publish({ type: 'error', title: data.retmsg });
            } else {
              toasterBusService.publish({ type: 'success', title: '删除成功' });
              getGrid();
            }
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
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
      { field: 'subtypesName', displayName: '亚型名称' },
      { field: 'subtypesCode', displayName: '亚型编码' },
      { field: 'serviceTypeStr', displayName: '作物业务类型' },
      { field: 'remark', displayName: '备注', cellTooltip: true }
    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length === 0) {
          paginationOptions.sort = '';
          paginationOptions.sortName = '';
        } else {
          paginationOptions.sort = sortColumns[0].sort.direction;
          switch (sortColumns[0].name) {
            case 'subtypesName':
              paginationOptions.sortName = 'subtypes_name';
              break;
            case 'subtypesCode':
              paginationOptions.sortName = 'subtypes_code';
              break;
            case 'serviceTypeStr':
              paginationOptions.sortName = 'service_type_str';
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

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        vm.disableDelete = selectedRows.length > 0 ? false : true;
      });

    }
  };



  //加载作物业务类型
  $http.get('api/security/helptypecode/typecodes/serviceType')
    .success(function(data) {
      vm.serviceTypeData = data.serviceType;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });
  //配置uiGrid数据
  function getGrid() {
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    var url = 'api/baseinfo/cropSubtypes/queryCropSubtypes' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize + '&sort=' + paginationOptions.sortName + ',' + paginationOptions.sort;
    var params = vm.searchData;
    params.cropType = $stateParams.cropType;
    $http.post(url, params)
      .success(function(data) {
        vm.gridOptions.data = data.content;
        vm.gridOptions.totalItems = data.totalElements;
        vm.disableDelete = true;
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
 * 作物亚型新增，修改，查看模态框controller
 * @author jxk
 */
angular.module('app').controller('ModalCropSubtypeCtrl', ['$http', '$scope', '$stateParams', '$uibModalInstance', 'modalType', 'rowEntity', 'toasterBusService', function($http, $scope, $stateParams, $uibModalInstance, modalType, rowEntity, toasterBusService) {
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
      url = 'api/baseinfo/cropSubtypes/addCropSubtypes';
    } else if (modalType === 'edit') {
      url = 'api/baseinfo/cropSubtypes/updateCropSubtypes';
    }
    $http.post(url, vm.rowEntity)
      .success(function(data) {
        if (data.retcode) {
          toasterBusService.publish({ type: 'error', title: data.retmsg });
        } else {
          toasterBusService.publish({ type: 'success', title: '提交成功' });
          $uibModalInstance.close();
        }
      })
      .error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };


  //加载作物业务类型
  $http.get('api/security/helptypecode/typecodes/serviceType')
    .success(function(data) {
      vm.serviceTypeData = data.serviceType;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });

}]);
