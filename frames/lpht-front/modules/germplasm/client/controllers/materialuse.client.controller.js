'use strict';

/**
 * 材料分组主页面controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('MaterialUseCtrl', ['$scope', '$http', '$stateParams', '$uibModal', 'uiGridConstants', 'ngDialog', 'toasterBusService', function($scope, $http, $stateParams, $uibModal, uiGridConstants, ngDialog, toasterBusService) {
  var sm = $scope.sm = {}; //searchModel
  var gm = $scope.gm = {}; //gridModel
  sm.searchData = {}; //查询数据集
  gm.disableDelete = true; //是否禁用删除按钮
  gm.radioModel = 'sm'; //ui grid初始大小
  //分页排序参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: '',
    sortName: '',
  };
  //uiGrid参数
  gm.gridOptions = {
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
    useExternalPagination: true, //是否使用子自定义分页逻辑,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'groupName', displayName: '材料分组名称' },
      { field: 'useTypeStr', displayName: '种质用途分类' },
      { field: 'groupYear', displayName: '材料分组年份' },
      { field: 'remark', displayName: '描述', cellTooltip: true }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length === 0) {
          paginationOptions.sort = '';
          paginationOptions.sortName = '';
        } else {
          paginationOptions.sort = sortColumns[0].sort.direction;
          switch (sortColumns[0].name) {
            case 'groupName':
              paginationOptions.sortName = 'group_name';
              break;
            case 'useTypeStr':
              paginationOptions.sortName = 'use_type_str';
              break;
            case 'groupYear':
              paginationOptions.sortName = 'group_year';
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
        gm.disableDelete = selectedRows.length > 0 ? false : true;
      });
    }
  };
  //查询按钮
  sm.search = function() {
    getGrid();
  };
  //重置按钮
  sm.reset = function() {
    sm.searchData = {};
    getGrid();
  };
  //打开模态框，只有新增,修改和查看，只选中了一条数据的情况下打开
  gm.openModal = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'materialUseModal',
      controller: 'ModalMaterialUseCtrl',
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
        useTypeData: function() {
          return sm.useTypeData;
        }
      }
    });

    modalInstance.result.then(function(result) {
      getGrid();
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
        var selectedRows = gm.gridApi.selection.getSelectedRows();
        $http.post('api/germmanage/useGroup/deleteUseGroup', { groupId: selectedRows[0].groupId })
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



  //加载种质用途分类下拉框数据
  $http.get('api/security/helptypecode/typecodes/useType')
    .success(function(data) {
      sm.useTypeData = data.useType;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });
  //加载grid数据
  function getGrid() {
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    var url = 'api/germmanage/useGroup/queryUseGroup' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize + '&sort=' + paginationOptions.sortName + ',' + paginationOptions.sort;
    var params = sm.searchData;
    params.cropType = $stateParams.cropType;
    $http.post(url, params)
      .success(function(data) {
        gm.gridOptions.data = data.content;
        gm.gridOptions.totalItems = data.totalElements;
        gm.disableDelete = true;
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
 * 材料用途新增，修改，查看模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalMaterialUseCtrl', ['$http', '$scope', '$uibModalInstance', '$stateParams', 'modalType', 'rowEntity', 'useTypeData', 'toasterBusService', function($http, $scope, $uibModalInstance, $stateParams, modalType, rowEntity, useTypeData, toasterBusService) {
  var fm = $scope.fm = {}; //formModel
  fm.rowEntity = angular.copy(rowEntity);
  fm.rowEntity.cropType = $stateParams.cropType;
  fm.modalType = modalType;
  fm.formDisabled = false;
  fm.useTypeData = useTypeData;

  if (modalType === 'view')
    fm.formDisabled = true;

  fm.edit = function() {
    fm.formDisabled = false;
  };

  fm.ok = function() {
    var url = '';
    if (modalType === 'add') {
      url = 'api/germmanage/useGroup/addUseGroup';
    } else if (modalType === 'edit') {
      url = 'api/germmanage/useGroup/updateUseGroup';
    }
    $http.post(url, fm.rowEntity)
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

  fm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
