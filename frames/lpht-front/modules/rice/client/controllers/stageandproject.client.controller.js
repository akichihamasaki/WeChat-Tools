'use strict';
angular.module('lpht.rice').controller('StageAndProjectCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'toaster', 'ngDialog', function($scope, $http, $uibModal, uiGridConstants, toaster, ngDialog) {
  // vm是操作表格所使用到的变量
  var vm = $scope.vm = {};
  vm.radioModel = 'sm'; //ui grid初始大小
  vm.searchData = {};
  //条件查询
  vm.search = function() {
    getGridData();
  };
  // 重置
  vm.reset = function() {
    vm.searchData = {};
  };
  //操作按钮
  vm.openDetail = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'addStageRelat',
      controller: 'addStageRelatCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = vm.gridApi.selection.getSelectedRows();
          return selectedRows.length === 1 ? selectedRows[0] : {};
        }
      }
    });
    modalInstance.result.then(function(result) {
      getGridData();
    });
  };
  //从当前页面的ui-grid中删除选中数据
  vm.delete = function() {
    // var i = 1;
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
        var params = {};
        params.stageCode = selectedRows[0].stageCode;
        $http.post('api/baseinfo/testItem/delTestStageItem', params)
          .success(function(data) {
            toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
            getGridData();
          })
          .error(function(ex) {
            toaster.pop({ type: 'error', title: ex, toasterId: 1 });
          });
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
  // 表格的定义
  vm.grid = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableSorting: true, //是否排序
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
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
      { name: 'stageCodeName', displayName: '测试阶段名称', enableSorting: false },
      { name: 'itemName', displayName: '所含的调查项目', enableSorting: false }
    ],
    onRegisterApi: function(gridApi) {
      vm.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
      });
    }
  };

  // 数据获取
  function getGridData() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    var url = '/api/baseinfo/testItem/queryTestStageItem' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize + '&sort=' + paginationOptions.sortName + ',' + paginationOptions.sort;
    var params = {};
    params = vm.searchData;
    $http.post(url, params)
      .success(function(data) {
        vm.grid.data = data.content;
        vm.grid.totalItems = data.totalElements;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.clear(loadToaster);
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }
  getGridData();

}]);
/*
  添加测试阶段与测试项目关系界面的controller
 */
angular.module('lpht.rice').controller('addStageRelatCtrl', ['$scope', '$http', '$uibModalInstance', 'toaster', 'modalType', 'rowEntity', '$uibModal', function($scope, $http, $uibModalInstance, toaster, modalType, rowEntity, $uibModal) {
  var vm = $scope.vm = {};
  vm.submitData = [];
  vm.projectInclude = [];
  vm.projectCharacter = [];
  vm.projectIncludeBranch = [];
  vm.prepose = [];
  vm.formDisabled = false;
  vm.rowEntity = angular.copy(rowEntity);

  //修改或者查看查询请求
  if (modalType === 'add') {
    vm.maintainDisabled = true;
  } else {
    vm.stageSelectedTable = vm.rowEntity.stageCode;
    vm.stageDisabled = true;
    var params = {};
    params.stageCode = vm.rowEntity.stageCode;
    $http.post('api/baseinfo/testItem/getTestStageItem', params)
      .success(function(data) {
        var preposeTerm = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].itemClass === 'TC001' || data[i].itemClass === 'dus') {
            preposeTerm.push(data[i]);
          } else {
            vm.projectCharacter.push(data[i]);
          }
        }
        for (var j = 0; j < preposeTerm.length; j++) {
          var array = preposeTerm.slice(0);
          array.splice(j, 1);
          preposeTerm[j].prepose = array;
        }
        for (var k = 0; k < preposeTerm.length; k++) {
          if (preposeTerm[k].isTrunk === '1') {
            vm.projectInclude.push(preposeTerm[k]);
          } else {
            vm.projectIncludeBranch.push(preposeTerm[k]);
          }
        }

      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }
  //数据字典请求（是/否）
  $http.get('api/security/helptypecode/typecodes/Y_N')
    .success(function(data) {
      vm.Y_N = data.Y_N;
    })
    .error(function(ex) {
      toaster.pop({ type: 'error', title: ex, toasterId: 1 });
    });

  if (modalType === 'view')
    vm.formDisabled = true;

  vm.edit = function() {
    vm.formDisabled = false;
  };

  //是否主线根据下拉框上移下移
  vm.istrunk = function(data) {
    if (data.isTrunk === '0') {
      vm.projectIncludeBranch.push(data);
      for (var i = 0; i < vm.projectInclude.length; i++) {
        if (vm.projectInclude[i].itemId === data.itemId) {
          vm.projectInclude.splice(i, 1);
        }
      }
    }
  };
  vm.notrunk = function(data) {
    if (data.isTrunk === '1') {
      vm.projectInclude.push(data);
      for (var i = 0; i < vm.projectIncludeBranch.length; i++) {
        if (vm.projectIncludeBranch[i].itemId === data.itemId) {
          vm.projectIncludeBranch.splice(i, 1);
        }
      }
    }
  };

  //提交按钮
  vm.ok = function() {
    for (var i = 0; i < vm.projectInclude.length; i++) {
      vm.submitData.push(vm.projectInclude[i]);
    }
    for (var j = 0; j < vm.projectIncludeBranch.length; j++) {
      vm.submitData.push(vm.projectIncludeBranch[j]);
    }
    for (var o = 0; o < vm.projectCharacter.length; o++) {
      vm.submitData.push(vm.projectCharacter[o]);
    }
    var projectInclude = [];
    for (var k = 0; k < vm.submitData.length; k++) {
      projectInclude.push({
        itemId: vm.submitData[k].itemId,
        itemName: vm.submitData[k].itemName,
        preCondition: vm.submitData[k].preCondition,
        stageCode: vm.submitData[k].stageCode,
        stageCodeName: vm.submitData[k].stageCodeName,
        viewCol: vm.submitData[k].viewCol,
        isTrunk: vm.submitData[k].isTrunk,
        viewRow: k + 1
      });
    }
    var params = projectInclude;
    if (modalType === 'add') {
      $http.post('api/baseinfo/testItem/addTestStageItem', params)
        .success(function(data) {
          if (data.retcode === 1024) {
            toaster.pop({ type: 'error', title: '测试阶段已存在！', toasterId: 1 });
          } else {
            toaster.pop({ type: 'success', title: '新增成功！', toasterId: 1 });
            $uibModalInstance.close();
          }
        })
        .error(function(ex) {
          toaster.pop({ type: 'error', title: ex, toasterId: 1 });
        });
    } else {
      $http.post('api/baseinfo/testItem/updateTestStageItem', params)
        .success(function(data) {
          toaster.pop({ type: 'success', title: '修改成功！', toasterId: 1 });
          $uibModalInstance.close();
        })
        .error(function(ex) {
          toaster.pop({ type: 'error', title: ex, toasterId: 1 });
        });
    }
  };
  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };
  // 顺序维护
  vm.fieldUpward = function(index) {
    angular.forEach(vm.projectInclude, function(data, i) {
      if (index === i) {
        vm.projectInclude.splice(i, 1, vm.projectInclude[i - 1]);
        vm.projectInclude.splice(i - 1, 1, data);
      }

    });
  };
  vm.fieldDownward = function(index) {
    angular.forEach(vm.projectInclude, function(data, i) {
      if (index === i) {
        vm.projectInclude.splice(i, 1, vm.projectInclude[i + 1]);
        vm.projectInclude.splice(i + 1, 1, data);
      }

    });
  };
  // vm.CharacterUpward = function(index) {
  //   angular.forEach(vm.projectCharacter, function(data, i) {
  //     if (index === i) {
  //       vm.projectCharacter.splice(i, 1, vm.projectCharacter[i - 1]);
  //       vm.projectCharacter.splice(i - 1, 1, data);
  //     }

  //   });
  // };
  // vm.CharacterDownward = function(index) {
  //   angular.forEach(vm.projectCharacter, function(data, i) {
  //     if (index === i) {
  //       vm.projectCharacter.splice(i, 1, vm.projectCharacter[i + 1]);
  //       vm.projectCharacter.splice(i + 1, 1, data);
  //     }

  //   });
  // };
  // 获得下拉框的数据
  $http.get('api/baseinfo/basehelpcode/baseHelpTypecode/1/teststage')
    .success(function(data) {
      vm.experimentStage = data.teststage;
    })
    .error(function(ex) {
      toaster.pop({ type: 'error', title: ex, toasterId: 1 });
    });

  //选择调查项目
  vm.maintain = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'relationModal',
      controller: 'relationModalCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          return vm.stageSelectedTable;
        },
        getSelectData: function() {
          var getSelectData = [];
          for (var i = 0; i < vm.projectInclude.length; i++) {
            getSelectData.push(vm.projectInclude[i]);
          }
          for (var j = 0; j < vm.projectIncludeBranch.length; j++) {
            getSelectData.push(vm.projectIncludeBranch[j]);
          }
          for (var o = 0; o < vm.projectCharacter.length; o++) {
            getSelectData.push(vm.projectCharacter[o]);
          }
          return getSelectData.length > 0 ? getSelectData : [];
        }
      }
    });
    modalInstance.result.then(function(result) {
      vm.projectInclude = [];
      vm.projectIncludeBranch = [];
      vm.projectCharacter = [];
      var preposeTerm = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i].itemClass === 'TC001' || result[i].itemClass === 'dus') {
          preposeTerm.push(result[i]);
        } else {
          vm.projectCharacter.push(result[i]);
        }
      }
      for (var j = 0; j < preposeTerm.length; j++) {
        var array = preposeTerm.slice(0);
        array.splice(j, 1);
        preposeTerm[j].prepose = array;
      }
      for (var k = 0; k < preposeTerm.length; k++) {
        if (preposeTerm[k].isTrunk === '1') {
          vm.projectInclude.push(preposeTerm[k]);
        } else {
          vm.projectIncludeBranch.push(preposeTerm[k]);
        }
      }

    });

  };

  //获得测试阶段选择框选择的数据
  vm.getStageTable = function() {
    if (vm.stageSelectedTable !== null) {
      vm.maintainDisabled = false;
    } else {
      vm.maintainDisabled = true;
    }
  };


}]);

/*
  选择调查项目Ctrl
 */
angular.module('lpht.rice').controller('relationModalCtrl', ['$scope', '$http', '$uibModalInstance', 'rowEntity', 'toaster', 'getSelectData', function($scope, $http, $uibModalInstance, rowEntity, toaster, getSelectData) {
  var vm = $scope.vm = {};
  var vml = $scope.vml = {};
  var vmr = $scope.vmr = {};
  vm.turnRight = true;
  vm.turnLeft = true;
  vm.getSelectData = angular.copy(getSelectData);

  vm.leftProjectGrid = {
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
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示

    columnDefs: [
      { field: 'itemName', displayName: '调查项目', enableColumnMenu: true },
      { field: 'itemClassStr', displayName: '调查项目分类', enableColumnMenu: true }
    ],
    onRegisterApi: function(gridApi) {
      vml.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        if (selectedRows.length === 1) vm.turnRight = false;
      });

    }

  };
  vm.rightProjectGrid = {
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
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示

    columnDefs: [
      { field: 'itemName', displayName: '测试阶段包含的调查项目', enableColumnMenu: true },
      { field: 'itemClassStr', displayName: '调查项目分类', enableColumnMenu: true }
    ],
    onRegisterApi: function(gridApi) {
      vmr.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        if (selectedRows.length === 1) vm.turnLeft = false;
      });

    }

  };

  vm.getItemRight = function() {
    var allLength = vm.itemsAll.length;
    for (var i = 0; i < vm.leftProjectGrid.data.length; i++) {
      for (var h = 0; h < allLength; h++) {
        if (vm.itemsAll[h].projectName === vm.leftProjectGrid.data[i].projectName) {
          vm.itemsAll.splice(h, 1);
          allLength -= allLength;
          break;
        }
      }
    }
    vm.rightProjectGrid.data = vm.itemsAll;
  };

  vm.turnRightAll = function() {
    for (var i = 0; i < vm.leftProjectGrid.data.length; i++) {
      vm.rightProjectGrid.data.push(vm.leftProjectGrid.data[i]);
    }
    vm.leftProjectGrid.data.splice(0, vm.leftProjectGrid.data.length);
  };

  vm.turnRightSelect = function() {
    var selectedRows = vml.gridApi.selection.getSelectedRows();
    angular.forEach(vm.leftProjectGrid.data, function(data, index) {
      if (vm.leftProjectGrid.data[index] === selectedRows[0]) {
        vm.leftProjectGrid.data.splice(index, 1);
        vm.rightProjectGrid.data.push(selectedRows[0]);
      }
    });
    vm.turnRight = true;
  };
  vm.turnLeftSelect = function() {
    var selectedRows = vmr.gridApi.selection.getSelectedRows();
    angular.forEach(vm.rightProjectGrid.data, function(data, index) {
      if (vm.rightProjectGrid.data[index] === selectedRows[0]) {
        vm.rightProjectGrid.data.splice(index, 1);
        vm.leftProjectGrid.data.push(selectedRows[0]);
      }
    });
    vm.turnLeft = true;
  };
  vm.turnLeftAll = function() {
    for (var i = 0; i < vm.rightProjectGrid.data.length; i++) {
      vm.leftProjectGrid.data.push(vm.rightProjectGrid.data[i]);
    }
    vm.rightProjectGrid.data.splice(0, vm.rightProjectGrid.data.length);
  };

  // 获取左边调查项目的数据
  function getLeftGrid() {
    var params = {};
    params.typecode = rowEntity;
    $http.post('api/baseinfo/testItem/getTestItemStageAndProject', params)
      .success(function(data) {
        var array = angular.copy(data);
        vm.rightProjectGrid.data = vm.getSelectData;
        if (data.length === vm.getSelectData.length) {
          vm.leftProjectGrid.data = [];
        } else {
          var dataLength = data.length;
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < vm.getSelectData.length; j++) {
              if (data[i].itemId === vm.getSelectData[j].itemId) {
                data.splice(i, 1);
                i--;
                break;
              }
            }
          }
          vm.leftProjectGrid.data = data;
        }
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }
  //获取右边的数据
  // function getRightGrid() {
  //   vm.rightProjectGrid.data = vm.getSelectData;
  // }
  getLeftGrid();
  // getRightGrid();

  vm.ok = function() {
    for (var i = 0; i < vm.rightProjectGrid.data.length; i++) {
      vm.rightProjectGrid.data[i].isTrunk = '1';
    }
    $uibModalInstance.close(vm.rightProjectGrid.data);
  };
  vm.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);
