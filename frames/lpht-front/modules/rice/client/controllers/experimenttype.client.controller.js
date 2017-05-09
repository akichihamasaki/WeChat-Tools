'use strict';

angular.module('lpht.rice').controller('ExperimentTypeCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'toaster', 'ngDialog', function($scope, $http, $uibModal, uiGridConstants, toaster, ngDialog) {
  var vm = $scope.vm = {};
  vm.dota = 'dota2';
  vm.isCollapsed = true; //是否显示更多
  vm.searchData = {};
  vm.searchData.name = '';
  vm.searchData.date = new Date();
  var paginationOptions;
  //vm.disableEdit = true; //是否禁用修改和查看按钮，根据是否选中了多条数据来判断
  //vm.disableDelete = true; //是否禁用删除按钮，根据是否选中了至少一条数据来判断
  //搜索按钮
  vm.search = function() {
    paginationOptions = {
      pageNumber: 0,
      pageSize: 20,
      sort: null
    };
    vm.gridApi.selection.clearSelectedRows();
    getGrid();
  };
  //重置按钮
  vm.reset = function() {
    vm.searchData = {};
  };

  //ui-grid单元格按钮打开模态框，row代表所在行数据
  vm.openDetail = function(type, row) {
    var modalInstance = $uibModal.open({
      templateUrl: 'experimentTypeModal',
      controller: 'ExperimentTypeModalCtrl',
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
      vm.search();
    });
  };

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
        vm.delete();
      }
    });
  };

  //从当前页面的ui-grid中删除选中数据
  vm.delete = function() {
    var selectedRows = vm.gridApi.selection.getSelectedRows();
    var row = selectedRows[0];
    var testid = { id: row.id };

    $http.get('api/test/delTestType', { params: testid })
      .success(function(data) {
        toaster.pop('success', '删除成功！');
        vm.search();
      })
      .error(function(data) {
        toaster.pop('warn', '操作失败！');
      });
  };

  //分页参数
  paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };

  //uiGrid参数
  vm.gridOptions = {
    enableSelectAll: false,
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
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    exporterMenuPdf: false,//是否导出pdf文件
    exporterCsvFilename:'试验类型.csv',//导出文件名定义
    exporterOlderExcelCompatibility:true,//导出乱码问题
    //---表列属性---//
    columnDefs: [
      { field: 'typename', displayName: '测试类型', enableColumnMenu: true },
      { field: 'remark', displayName: '描述', enableColumnMenu: true, cellTooltip: true },
      { field: 'action', displayName: '操作', enableHiding: false,enableColumnMenu: false, enableSorting: false, enableFiltering: false, width: 80, cellTemplate: '<button type="button" class="btn btn-info btn-xs m-xxs" ng-click="grid.appScope.vm.openDetail(\'edit\',row)" title="修改"><i class="fa fa-pencil"></i></button><button type="button" class="btn btn-primary btn-xs m-xxs" ng-click="grid.appScope.vm.openDetail(\'view\',row)" title="查看"><i class="fa fa-file-text"></i></button>' }
    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });

      gridApi.grid.registerRowsProcessor(function(renderableRows) {
        //console.info(renderableRows);
        return renderableRows;
      });

      //grid行选中事件
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
    // $http.get('api/rice/testtype.json')
    var searchData = {};
    if (vm.searchData.name) searchData.name = vm.searchData.name;
    searchData.page = paginationOptions.pageNumber;
    searchData.size = paginationOptions.pageSize;
    // $http.get('api/test/selectTestType', { params: searchData })
    $http.get('api/rice/experimentType')
      .success(function(data) {
        vm.gridOptions.data = data;
        // vm.gridOptions.data = data.content;
        // vm.gridOptions.totalItems = data.totalElements;
        // if (paginationOptions.pageNumber === 0) vm.gridApi.pagination.seek(1);
      })
      .error(function(data) {
        toaster.pop('warn', '操作失败！');
      });
  }

  getGrid();

}]);

//modal的controller
angular.module('lpht.rice').controller('ExperimentTypeModalCtrl', ['$scope', '$uibModalInstance', 'modalType', 'rowEntity', '$http', 'toaster', function($scope, $uibModalInstance, modalType, rowEntity, $http, toaster) {

  var vm = $scope.vm = {};
  vm.rowEntity = angular.copy(rowEntity);
  vm.modalType = modalType;
  if (modalType === 'add') vm.rowEntity = {};

  vm.ok = function() {
    console.log(vm.rowEntity);
    if (modalType === 'add') {
      $http.post('api/test/insertTestType', vm.rowEntity)
        .success(function(data) {
          $uibModalInstance.close(vm.rowEntity);
          toaster.pop('success', '操作成功！');
        })
        .error(function(data) {
          toaster.pop('warn', '操作失败！');
        });
    } else if (modalType === 'edit') {
      $http.post('api/test/updateTestType', vm.rowEntity)
        .success(function(data) {
          $uibModalInstance.close(vm.rowEntity);
          toaster.pop('success', '操作成功！');
        })
        .error(function(data) {
          toaster.pop('warn', '操作失败!');
        });
    }
  };

  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
