'use strict';

angular.module('users').controller('operationLogController', ['$filter', '$scope', '$http', 'uiGridConstants', 'toaster', function($filter, $scope, $http, uiGridConstants, toaster) {
  //在controller中不要直接使用scope
  var vm = $scope.vm = {};
  var pagination, getPage;
  var paginationOptions;
  vm.startDate = { opened: false };
  vm.endDate = { opened: false };
  vm.startDateOpen = function() { vm.startDate.opened = true; };
  vm.endDateOpen = function() { vm.endDate.opened = true; };
  vm.search = searchGrid;
  vm.reset = resetForm;
  vm.startDateValue = new Date();
  vm.endDateValue = new Date();


  //时间选择器配置
  vm.minStartDate = 0; //开始时间的最小时间
  vm.maxStartDate = vm.endDateValue; //开始时间的最大可选时间
  vm.minEndDate = vm.startDateValue; //结束时间的最小可选时间要大于开始时间的设定值
  vm.maxEndDate = vm.endDateValue; //结束时间的最大可选择时间不超过结束时间的设定值
  $scope.startDateOptions = {
    maxDate: vm.endDateValue
  };
  $scope.endDateOptions = {
    minDate: vm.startDateValue,
    maxDate: new Date()
  };



  $scope.$watch('vm.startDateValue', function(newValue, oldValue) {
    $scope.endDateOptions.minDate = newValue;
  });
  $scope.$watch('vm.endDateValue', function(newValue, oldValue) {
    $scope.startDateOptions.maxDate = newValue;
  });

  function isDisabled(obj) {
    var date = obj.date,
      mode = obj.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  function searchGrid() {
    paginationOptions = {
      pageNumber: 0,
      pageSize: 20,
      sort: null
    };
    getPage();
  }

  function resetForm() {
    vm.startDateValue = '';
    vm.endDateValue = '';
  }


  //分页参数
  paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: 'asc',
    sortName: 'aaa',
  };

  vm.grid = {
    enableGridMenu: true, //是否显示grid菜单
    enableColumnMenu: true, //是否显示列菜单
    paginationPageSizes: [20, 40, 80, 1000],
    paginationPageSize: 20,
    useExternalPagination: true, //是否使用分页按钮
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableSorting: true, //是否需要排序  可以在grid属性中维护也可在col属性中添加
    useExternalSorting: true, //是否使用自定义排序逻辑
    columnDefs: [
      { name: 'logDate', displayName: '记录日期', width: 130 },
      { name: 'logTime', displayName: '记录时间', width: 120 },
      { name: 'opType', displayName: '操作', enableColumnMenu: false, enableSorting: false },
      { name: 'opCode', displayName: '操作类型', enableColumnMenu: false, enableSorting: false },
      { name: 'organization.nodename', displayName: '操作人', enableColumnMenu: false, enableSorting: false },
      { name: 'opIP', displayName: 'IP地址', width: 100, enableColumnMenu: false, enableSorting: false },
      { name: 'opDesc', displayName: '描述', enableColumnMenu: false, enableSorting: false }
    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length === 0) {
          paginationOptions.sort = null;
        } else if (sortColumns.length === 1) {

          paginationOptions.sort = sortColumns[0].sort.direction;
          paginationOptions.sortName = sortColumns[0].name;
          getPage();
        }

      });
      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
        getPage();
      });

    }
  };

  getPage = function() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', toasterId: 1 });
    var params = {};
    params.startDate = $filter('date')(vm.startDateValue, 'yyyy-MM-dd');
    params.endDate = $filter('date')(vm.endDateValue, 'yyyy-MM-dd');
    var url = '/api/security/logs/queryBaseLogs' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    $http.post(url, params)
      .success(function(data) {
        vm.grid.data = data.content;
        vm.grid.totalItems = data.totalElements;
        if (paginationOptions.pageNumber === 0) vm.gridApi.pagination.seek(1);
        toaster.clear(loadToaster);
      }).error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  };

  getPage();

}]);
