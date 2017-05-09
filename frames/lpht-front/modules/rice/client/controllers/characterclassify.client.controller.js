'use strict';

angular.module('lpht.rice').controller('CharacterClassifyCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'toaster', 'ngDialog',function($scope, $http, $uibModal, uiGridConstants, toaster,ngDialog) {
  var vm = $scope.vm = {};
  vm.isCollapsed = true; //是否显示更多
  vm.searchData = {};
  vm.searchData.date = new Date();
  //vm.disableEdit = true; //是否禁用修改和查看按钮，根据是否选中了多条数据来判断
  //vm.disableDelete = true; //是否禁用删除按钮，根据是否选中了至少一条数据来判断
  //搜索按钮
  vm.disableDelete = true;
  vm.radioModel = 'sm';
  vm.search = function() {
    console.info(vm.searchData);
  };
  //重置按钮
  vm.reset = function() {
    vm.searchData = null;
  };

  vm.openModal = function(type,row) {
    var modalInstance = $uibModal.open({
      templateUrl: 'characterClassifyModalCtrl',
      controller: 'CharacterClassifyModalCtrl',
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

    modalInstance.result.then(function(result) {
      console.info(result);
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
        console.info(vm.gridApi.selection.getSelectedRows());
        toaster.pop('success', '删除成功！');
      }
    });
  };

  //从当前页面的ui-grid中删除选中数据
  var i = 1;
  vm.delete = function() {
    var selectedRows = vm.gridApi.selection.getSelectedRows();
    angular.forEach(selectedRows, function(data) {
      vm.gridOptions.data.splice(data.id - i++, 1);
    });
    toaster.pop('success', '删除成功！');
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
    useExternalPagination: false, //是否使用子自定义分页逻辑,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'name', displayName: '性状分类', enableColumnMenu: true },
      { field: 'remark', displayName: '描述', enableColumnMenu: true, cellTooltip: true },
      //{ field: 'action', displayName: '操作', enableHiding: false,enableColumnMenu: false, enableSorting: false, enableFiltering: false, width: 70, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.vm.openModal(\'edit\',row)" title="修改"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-primary btn-xs m-xxs" ng-click="grid.appScope.vm.openModal(\'view\',row)" title="查看"><i class="fa fa-file-text"></i></button>' }
    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;
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
        vm.disableDelete = selectedRows.length > 0 ? false : true;
      });

      gridApi.grid.registerRowsProcessor(function(renderableRows) {
        //console.info(renderableRows);
        return renderableRows;
      });

      /*gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        vm.disableEdit = selectedRows.length == 1 ? false : true;
        vm.disableDelete = selectedRows.length > 0 ? false : true;
      });*/

    }
  };

  //配置uiGrid数据
  function getGrid() {
    /*$http.get("http://httpbin.org/delay/3")*/
    $http.get('api/rice/characterclassify')
      .success(function(data) {
        vm.gridOptions.data = data;
        //vm.gridOptions.totalItems = data.length;
      })
      .error(function(data) {
        console.info(data);
      });
  }

  getGrid();

}]);
angular.module('lpht.rice').controller('CharacterClassifyModalCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', function($scope, $uibModalInstance, modalType, rowEntity) {
  var vm = $scope.vm = {};
  vm.rowEntity = angular.copy(rowEntity);
  vm.modalType = modalType;
  vm.formDisabled = false;

  if (modalType === 'view')
    vm.formDisabled = true;
  // if (modalType === 'add')
  //   vm.rowEntity = null;
  vm.edit = function(){
    vm.formDisabled = false;
  };
  vm.ok = function() {
    $uibModalInstance.close(vm.rowEntity);
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
