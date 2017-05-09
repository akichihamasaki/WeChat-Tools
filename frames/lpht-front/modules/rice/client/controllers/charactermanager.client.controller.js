'use strict';
angular.module('lpht.rice').controller('UiGridDemoCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toasterBusService', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toasterBusService) {
  //在controller中不要直接使用scope
  var vm = $scope.vm = {};
  vm.radioModel = 'sm';
  vm.searchData = {};
  vm.disableDelete = true;

  vm.openDetail = function(type, row) {
    var modalInstance = $uibModal.open({
      templateUrl: 'addCharacter',
      controller: 'addCharacterInstanceCtrl',
      size: 'lg',
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
    modalInstance.result.then(function(result) {
      getGridData();
      //console.info(result);
    });
  };

  vm.delectCharacter = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        vm.delete();
      }
    });
  };
  //从当前页面的ui-grid中删除选中数据
  var i = 1;
  vm.delete = function() {
    var selectedRows = vm.gridApi.selection.getSelectedRows();
    var row = selectedRows[0];
    //console.log('%o---del---', row);
    var unitid = { unitId: row.unitId };

    $http.post('api/baseinfo/charactersUnit/delCharactersUnit',unitid)
      .success(function(data) {
        toasterBusService.publish({ type: 'success', title: '删除成功！' });
        getGridData();
      })
      .error(function(data) {
        toasterBusService.publish({ type: 'warn', title: '删除失败！' });
      });
  };


  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: '',
    sortName: '',
  };
  /*加载表格*/
  vm.grid = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---排序属性---//
    enableSorting: true, //是否排序
    useExternalSorting: false, //是否使用自定义排序逻辑
    //---分页属性---//
    //enablePagination: true, //是否分页,false时页面底部分页按钮无法点击
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

    columnDefs: [
      { field: 'unitName', displayName: '单位名称' },
      { field: 'shorthand', displayName: '单位简写' },
      // { field: 'remark', displayName: '备注' },
      //{ field: 'action', displayName: '操作', enableColumnMenu: false, enableHiding: false, enableSorting: false, enableFiltering: false, width: 70, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.vm.openDetail(\'edit\' ,row )" title="修改"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-primary btn-xs m-xxs" ng-click="grid.appScope.vm.openDetail(\'view\',row )" title="查看"><i class="fa fa-file-text"></i></button>' }

    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if(sortColumns.length === 0){
          paginationOptions.sortName = '';
          paginationOptions.sort = '';
        }
        else
        {
          paginationOptions.sort = sortColumns[0].sort.direction;
          switch(sortColumns[0].name){
            case 'unitName':
              paginationOptions.sortName = 'unit_name';
              break;
            case 'shorthand':
              paginationOptions.sortName = 'shorthand';
              break;
            default:
              paginationOptions.sortName = '';
              paginationOptions.sort = '';
              break;
          }
        }
        getGridData();
      });

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getGridData();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        vm.disableDelete = selectedRows.length > 0 ? false : true;
      });
    }
  };

  /*获得表格数据事件*/
  function getGridData() {
    var params = {};
    params= vm.searchData;
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    var url = 'api/baseinfo/charactersUnit/queryCharactersUnit' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize +'&sort' + paginationOptions.sortName + ',' +paginationOptions.sort;
    $http.post(url,params)
    .success(function(data) {
      toasterBusService.clear(msg);
      vm.grid.data = data.content;

      vm.grid.totalItems = data.totalElements;
    })
    .error(function(ex) {
      toasterBusService.clear(msg);
      toasterBusService.publish({ type:'error',title:ex });
    });
    vm.disableDelete = true;
  }
  getGridData();

  //模糊查询按钮
  vm.search = function() {
    // vm.sort =  null;
    vm.gridApi.selection.clearSelectedRows();
    getGridData();
  };
  //重置按钮
  vm.reset = function() {
    vm.searchData = {};
    paginationOptions.pageNumber = 0;
    paginationOptions.pageSize = 20;
    // vm.sort =  null;
    vm.gridApi.selection.clearSelectedRows();
    getGridData();
  };

}]);

/*模态弹出框的新增功能的controller*/
angular.module('lpht.rice').controller('addCharacterInstanceCtrl', ['$stateParams','$http', '$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'toasterBusService', function($stateParams,$http, $scope, $uibModalInstance, modalType, rowEntity, toasterBusService) {
  var vm = $scope.vm = {};
  vm.character = angular.copy(rowEntity);
  vm.character.cropType = $stateParams.cropType;
  vm.modalType = modalType;
  vm.formDisabled = false;
  if (modalType === 'view')
    vm.formDisabled = true;
  //if (modalType === 'add') vm.rowEntity = {};
  vm.edit = function(){
    vm.formDisabled = false;
  };
  vm.ok = function() {
    if (modalType === 'add') {
      // vm.rowEntity.serviceType = '1';
      //console.log(vm.character);
      $http.post('api/baseinfo/charactersUnit/addCharactersUnit', vm.character)
      .success(function(data) {
        $uibModalInstance.close(vm.character);
        toasterBusService.publish({ type: 'success', title: '操作成功！' });

      })
      .error(function(ex) {
        toasterBusService.publish({ type:'error',title:ex });

      });
    }
    else
    {
      // vm.rowEntity.serviceType = '1';
      //console.log(vm.character);
      $http.post('api/baseinfo/charactersUnit/updateCharactersUnit', vm.character)
      .success(function(data) {
        $uibModalInstance.close(vm.character);
        toasterBusService.publish({ type:'success',title:'操作成功！' });
      })
      .error(function(ex) {
        toasterBusService.publish({ type:'error',title:ex });
      });
    }
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
