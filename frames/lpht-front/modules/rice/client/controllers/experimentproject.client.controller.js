'use strict';
/**
 * 试验项目Ctrl
 * @author   zj
 */
angular.module('lpht.rice').controller('ExperimentProjectCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'ngDialog', 'toaster', function($scope, $http, $uibModal, uiGridConstants, ngDialog, toaster) {
  var ep = $scope.ep = {};
  ep.isCollapsed = true; //是否显示更多
  ep.radioModel = 'sm'; //ui grid初始大小
  ep.isCollapsed = true;
  ep.searchData = {};
  //下拉框加载
  // $http.get('api/rice/experimentClass,experimentStage,characterName,operators,characterGroup,experimentTypes,isYesNo')
  $http.get('api/baseinfo/basehelpcode/baseHelpTypecode/1/teststage,testtype,testclass')
    .success(function(data) {
      ep.selectData = data;
      ep.experimentTypes = data.testclass;
      ep.experimentStage = data.teststage;
      ep.experimentClass = data.testtype;
    })
    .error(function(ex) {
      toaster.pop({ type: 'error', title: ex, toasterId: 1 });
    });

  //搜索按钮
  ep.search = function() {
    getGrid();
  };
  //重置按钮
  ep.reset = function() {
    ep.searchData = {};
  };
  //打开模态框
  ep.openDetail = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'epModal',
      controller: 'ModalExperimentProjectCtrl',
      size: 'auto',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = ep.gridApi.selection.getSelectedRows();
          return selectedRows.length === 1 ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
    modalInstance.result.then(function(result) {
      getGrid();
    });
  };

  //从当前页面的ui-grid中删除选中数据
  ep.delete = function() {
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
        var selectedRows = ep.gridApi.selection.getSelectedRows();
        var params = {};
        params.itemId = selectedRows[0].itemId;
        $http.post('api/baseinfo/testItem/delTestItem', params)
          .success(function(data) {
            toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
            getGrid();
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
  //uiGrid参数
  ep.gridOptions = {
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
    useExternalPagination: true, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    useExternalSorting: true, //是否使用自定义排序逻辑
    //---选择属性---//
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'itemName', displayName: '调查项目名称', enableSorting: false },
      { field: 'itemClass', displayName: '调查项目分类' },
      { field: 'testYear', displayName: '创建年份' },
      { field: 'testStageItemRangeStr', displayName: '应用的试验阶段', enableSorting: false },
      // { field: 'surveyTime', displayName: '调查次数' },
      { field: 'pointType', displayName: '应用试验点类型' },
      { field: 'coverCharactersStr', displayName: '有照片的性状', enableSorting: false }
      // { field: 'isRepeat', displayName: '调查轮数' },
      // { field: 'isGather', displayName: '每轮样本数' },
      // { field: 'remark', displayName: '描述', cellTooltip: true }
    ],
    onRegisterApi: function(gridApi) {
      ep.gridApi = gridApi;


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
            case 'itemName':
              paginationOptions.sortName = 'item_name';
              break;
            case 'itemClass':
              paginationOptions.sortName = 'item_class';
              break;
            case 'testYear':
              paginationOptions.sortName = 'test_year';
              break;
            case 'pointType':
              paginationOptions.sortName = 'point_type';
              break;
            default:
              paginationOptions.sortName = '';
              paginationOptions.sort = '';
              break;
          }
        }
        getGrid();
      });
      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });
    }
  };

  //配置uiGrid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', toasterId: 1 });
    var url = '/api/baseinfo/testItem/queryTestItem' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize + '&sort=' + paginationOptions.sortName + ',' + paginationOptions.sort;
    var params = {};
    params = ep.searchData;
    // $http.get('api/rice/experimentproject')
    $http.post(url, params)
      .success(function(data) {
        ep.gridOptions.data = data.content;
        ep.gridOptions.totalItems = data.totalElements;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

}]);

/*
  新增修改弹出框Ctrl
 */
angular.module('lpht.rice').controller('ModalExperimentProjectCtrl', ['$scope', '$http', '$uibModalInstance', 'modalType', 'rowEntity', 'uiGridConstants', 'toaster', 'ngDialog', 'parentScope', '$uibModal', function($scope, $http, $uibModalInstance, modalType, rowEntity, uiGridConstants, toaster, ngDialog, parentScope, $uibModal) {
  var ep = $scope.ep = {};
  var epv = $scope.epv = {};
  $scope.ps = parentScope;
  ep.teststage = angular.copy($scope.ps.ep.selectData.teststage);
  ep.disabledVeto = true;
  ep.formDisabled = false;
  ep.modalType = modalType;
  ep.vetoTableDisabled = true;
  ep.vetoAddData = {};
  ep.coverCharacters = [];
  ep.prepose = [];
  if (modalType === 'add') {
    ep.rowEntity = null;
  } else {
    //修改或者查看请求页面数据
    var paramId = {};
    paramId.itemId = angular.copy(rowEntity.itemId);
    $http.post('api/baseinfo/testItem/getTestItem', paramId)
      .success(function(data) {
        ep.rowEntity = data;
        for (var k = 0; k < data.coverCharactersList.length; k++) {
          var item = data.coverCharactersList.slice(0);
          item.splice(k, 1);
          data.coverCharactersList[k].prepose = item;
        }
        ep.coverCharacters = data.coverCharactersList;
        ep.vetoGrid.data = data.votedList;
        for (var j = 0; j < ep.teststage.length; j++) {
          for (var i = 0; i < data.testStageItemRangeList.length; i++) {
            if (data.testStageItemRangeList[i].stageCode === ep.teststage[j].typecode) {
              ep.teststage[j].isActive = true;
            }
          }
        }
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }
  if (modalType === 'view')
    ep.formDisabled = true;

  //数据字典请求（是/否）
  $http.get('api/security/helptypecode/typecodes/Y_N,result')
    .success(function(data) {
      ep.Y_N = data.Y_N;
      ep.result = data.result;
    })
    .error(function(ex) {
      toaster.pop({ type: 'error', title: ex, toasterId: 1 });
    });

  // 顺序维护
  ep.fieldUpward = function(index) {
    angular.forEach(ep.coverCharacters, function(data, i) {
      if (index === i) {
        ep.coverCharacters.splice(i, 1, ep.coverCharacters[i - 1]);
        ep.coverCharacters.splice(i - 1, 1, data);
      }

    });
  };
  ep.fieldDownward = function(index) {
    angular.forEach(ep.coverCharacters, function(data, i) {
      if (index === i) {
        ep.coverCharacters.splice(i, 1, ep.coverCharacters[i + 1]);
        ep.coverCharacters.splice(i + 1, 1, data);
      }

    });
  };

  //新增修改查看
  ep.editCharacter = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'CharacterModal',
      controller: 'ModalCharacterCtrl',
      size: 'md',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = ep.coverCharacters;
          return selectedRows.length > 0 ? selectedRows : [];
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
    modalInstance.result.then(function(result) {
      for (var i = 0; i < result.length; i++) {
        var item = [];
        for (var j = 0; j < result.length; j++) {
          if (result[i].$$hashKey !== result[j].$$hashKey) {
            item.push(result[j]);
          }
        }
        result[i].prepose = item;
      }
      ep.coverCharacters = result;
    });
  };

  ep.editVeto = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'VetoModal',
      controller: 'ModalVetoCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        coverCharacters: function() {
          return ep.coverCharacters.length > 0 ? ep.coverCharacters : {};
        },
        rowEntity: function() {
          var selectedRows = epv.gridApi.selection.getSelectedRows();
          return selectedRows.length === 1 ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
    modalInstance.result.then(function(result) {
      if (type === 'add') {
        ep.vetoGrid.data.push(result);
      } else {
        ep.vetoGrid.data.splice(0, 1, result);
      }

    });
  };
  ep.deleteVeto = function() {
    var i = 1;
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var selectedRows = epv.gridApi.selection.getSelectedRows();
        angular.forEach(selectedRows, function(data, index) {
          ep.vetoGrid.data.splice(index, 1);
        });
        toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
      }
    });
  };
  ep.deleteCharacter = function(index) {
    ep.coverCharacters.splice(index, 1);
    toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
  };
  ep.ok = function() {
    var params = {};
    var selectActive = angular.element('.list-group-item');
    var array = [];
    var coverCharactersList = [];
    var votedList = [];
    for (var k = 0; k < ep.coverCharacters.length; k++) {
      coverCharactersList.push({
        charactersName: ep.coverCharacters[k].charactersName,
        charactersId: ep.coverCharacters[k].charactersId,
        dataType: ep.coverCharacters[k].dataType,
        dataTypeCode: ep.coverCharacters[k].dataTypeCode,
        dataTypeStr: ep.coverCharacters[k].dataTypeStr,
        hasPhoto: ep.coverCharacters[k].hasPhoto,
        isMany: ep.coverCharacters[k].isMany,
        isMust: ep.coverCharacters[k].isMust,
        itemId: ep.coverCharacters[k].itemId,
        preCondition: ep.coverCharacters[k].preCondition,
        onceResult: ep.coverCharacters[k].onceResult,
        endResult: ep.coverCharacters[k].endResult,
        checkRound: ep.coverCharacters[k].checkRound,
        sampleNum: ep.coverCharacters[k].sampleNum,
        unitName: ep.coverCharacters[k].unitName,
        unitId: ep.coverCharacters[k].unitId,
        isEnd: ep.coverCharacters[k].isEnd
      });
    }
    params = angular.copy(ep.rowEntity);
    params.coverCharactersList = coverCharactersList;
    for (var l = 0; l < ep.vetoGrid.data.length; l++) {
      votedList.push({
        charactersId: ep.vetoGrid.data[l].charactersId,
        charactersName: ep.vetoGrid.data[l].charactersName,
        compareValue: ep.vetoGrid.data[l].compareValue,
        dataType: ep.vetoGrid.data[l].dataType,
        dataTypeStr: ep.vetoGrid.data[l].dataTypeStr,
        itemId: ep.vetoGrid.data[l].itemId,
        operator: ep.vetoGrid.data[l].operator,
        operatorStr: ep.vetoGrid.data[l].operatorStr,
        remark: ep.vetoGrid.data[l].remark,
        unitId: ep.vetoGrid.data[l].unitId,
        unitName: ep.vetoGrid.data[l].unitName,
        votedId: ep.vetoGrid.data[l].votedId
      });
    }
    params.votedList = votedList;
    params.testStageItemRangeList = [];
    params.cropType = '1';
    for (var i = 0; i < selectActive.length; i++) {
      var selectedRows = angular.element('.list-group-item').eq(i);
      if (selectedRows.hasClass('active')) {
        array.push(selectedRows.scope().$index);
      }
    }
    for (var x = 0; x < array.length; x++) {
      for (var j = 0; j < ep.teststage.length; j++) {
        if (array[x] === j) {
          params.testStageItemRangeList.push(ep.teststage[j]);
        }
      }
    }
    if (modalType === 'add') {
      $http.post('api/baseinfo/testItem/addTestItem', params)
        .success(function(data) {
          toaster.pop({ type: 'success', title: '新增成功！', toasterId: 1 });
          $uibModalInstance.close();
        })
        .error(function(ex) {
          toaster.pop({ type: 'error', title: ex, toasterId: 1 });
        });
    } else {
      $http.post('api/baseinfo/testItem/updateTestItem', params)
        .success(function(data) {
          toaster.pop({ type: 'success', title: '修改成功！', toasterId: 1 });
          $uibModalInstance.close();
        })
        .error(function(ex) {
          toaster.pop({ type: 'error', title: ex, toasterId: 1 });
        });
    }
  };
  ep.edit = function() {
    ep.formDisabled = false;
  };

  ep.cancel = function() {
    $uibModalInstance.dismiss();
  };

  ep.vetoGrid = {
    enablePagination: true,
    enablePaginationControls: true,
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1,
    paginationPageSize: 20,
    enableRowHeaderSelection: false,
    enableGridMenu: false,
    exporterMenuPdf: false,
    multiSelect: false,
    noUnselect: true, //是否不能取消选中
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 0, //grid垂直滚动条是否显示, 0-不显示  1-显示

    columnDefs: [
      { field: 'charactersName', displayName: '性状名称' },
      { field: 'operatorStr', displayName: '关系运算符' },
      { field: 'compareValue', displayName: '参数值' },
      { field: 'dataType', displayName: '数据类型' },
      { field: 'unitName', displayName: '参数值单位' },
      { field: 'remark', displayName: '描述' }
    ],
    onRegisterApi: function(gridApi) {
      epv.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        ep.disabledVeto = selectedRows.length === 1 ? false : true;
      });

    }

  };

}]);
/**
 * 选择性状Ctrl
 */
angular.module('lpht.rice').controller('ModalCharacterCtrl', ['$scope', '$http', '$uibModalInstance', 'modalType', 'rowEntity', 'uiGridConstants', 'toaster', 'ngDialog', 'parentScope', function($scope, $http, $uibModalInstance, modalType, rowEntity, uiGridConstants, toaster, ngDialog, parentScope) {
  var ep = $scope.ep = {};
  var epl = $scope.epl = {};
  var epr = $scope.epr = {};
  ep.turnRight = true;
  ep.turnLeft = true;
  ep.rowEntity = angular.copy(rowEntity);
  $scope.ps = parentScope;
  ep.modalType = modalType;

  //形状组下拉框请求数据
  getCharacterGroup();

  function getCharacterGroup() {
    var params = {};
    $http.post('/api/baseinfo/charactersGroup/selectCharactersGroup', params)
      .success(function(data) {
        ep.characterGroup = data;
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }
  ep.search = function() {
    getLeftCharacterGrid();
  };
  ep.reset = function() {
    ep.rowEntity.group = '';
  };
  ep.ok = function() {
    $uibModalInstance.close(ep.rightCharacterGrid.data);
  };
  ep.edit = function() {
    ep.formDisabled = false;
  };
  ep.cancel = function() {
    $uibModalInstance.dismiss();
  };

  //左移右移操作按钮按钮
  ep.turnRightAll = function() {
    for (var i = 0; i < ep.LeftCharacterGrid.data.length; i++) {
      ep.rightCharacterGrid.data.push(ep.LeftCharacterGrid.data[i]);
    }
    ep.LeftCharacterGrid.data.splice(0, ep.LeftCharacterGrid.data.length);
  };
  ep.turnRightSelect = function() {
    var selectedRows = epl.gridApi.selection.getSelectedRows();
    angular.forEach(ep.LeftCharacterGrid.data, function(data, index) {
      if (ep.LeftCharacterGrid.data[index] === selectedRows[0]) {
        ep.LeftCharacterGrid.data.splice(index, 1);
        ep.rightCharacterGrid.data.push(selectedRows[0]);
      }
    });
    ep.turnRight = true;
  };
  ep.turnLeftSelect = function() {
    var selectedRows = epr.gridApi.selection.getSelectedRows();
    angular.forEach(ep.rightCharacterGrid.data, function(data, index) {
      if (ep.rightCharacterGrid.data[index] === selectedRows[0]) {
        ep.rightCharacterGrid.data.splice(index, 1);
        ep.LeftCharacterGrid.data.push(selectedRows[0]);
      }
    });
    ep.turnLeft = true;
  };
  ep.turnLeftAll = function() {
    for (var i = 0; i < ep.rightCharacterGrid.data.length; i++) {
      ep.LeftCharacterGrid.data.push(ep.rightCharacterGrid.data[i]);
    }
    ep.rightCharacterGrid.data.splice(0, ep.rightCharacterGrid.data.length);
  };

  ep.LeftCharacterGrid = {
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
      { field: 'charactersName', displayName: '性状名称', enableColumnMenu: true }
    ],
    onRegisterApi: function(gridApi) {
      epl.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = epl.gridApi.selection.getSelectedRows();
        ep.turnRight = selectedRows.length === 1 ? false : true;
      });

    }
  };

  ep.rightCharacterGrid = {
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
      { field: 'charactersName', displayName: '性状名称', enableColumnMenu: true }
    ],
    onRegisterApi: function(gridApi) {
      epr.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = epr.gridApi.selection.getSelectedRows();
        ep.turnLeft = selectedRows.length === 1 ? false : true;
      });

    }

  };

  //左边grig数据
  function getLeftCharacterGrid() {
    // $http.get('api/rice/experimentCharacter')
    var params = {};
    params.groupId = ep.rowEntity.group;
    $http.post('/api/baseinfo/characters/getCharactersSelectList', params)
      .success(function(data) {
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < ep.rightCharacterGrid.data.length; j++) {
            if (data[i].charactersName === ep.rightCharacterGrid.data[j].charactersName) {
              data.splice(i, 1);
            }
          }
        }
        ep.LeftCharacterGrid.data = data;
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }
  //右边grig数据
  function getRightCharacterGrid() {
    ep.rightCharacterGrid.data = ep.rowEntity;
  }
  getLeftCharacterGrid();
  getRightCharacterGrid();

}]);

/**
 * 一次否决项弹出框Ctrl
 */
angular.module('lpht.rice').controller('ModalVetoCtrl', ['$scope', '$http', '$uibModalInstance', 'modalType', 'rowEntity', 'uiGridConstants', 'toaster', 'ngDialog', 'parentScope', 'coverCharacters', function($scope, $http, $uibModalInstance, modalType, rowEntity, uiGridConstants, toaster, ngDialog, parentScope, coverCharacters) {
  var ep = $scope.ep = {};
  ep.rowEntity = angular.copy(rowEntity);
  if (modalType === 'add')
    ep.rowEntity = {};
  ep.vetoAddData = ep.rowEntity;
  ep.inputShow = false;
  ep.selectShow = false;
  ep.dateShow = false;
  //关系运算符请求
  $http.get('api/security/helptypecode/typecodes/operator')
    .success(function(data) {
      ep.operator = data.operator;
      for (var i = 0; i < ep.operator.length; i++) {
        if (ep.operator[i].code === ep.rowEntity.operator) {
          ep.vetoAddData.operator = ep.operator[i];
        }
      }
    })
    .error(function(ex) {
      toaster.pop({ type: 'error', title: ex, toasterId: 1 });
    });
  // ep.vetoAddData.characterName = {};
  // ep.vetoAddData.characterName.dataType = ep.rowEntity.dataType;
  // ep.vetoAddData.characterName.unitName = ep.rowEntity.unitName;
  // ep.vetoAddData.characterName.charactersName = ep.rowEntity.charactersName;
  // ep.vetoAddData.characterName.charactersId = ep.rowEntity.charactersId;
  $scope.ps = parentScope;
  ep.modalType = modalType;
  ep.charactersName = coverCharacters;
  for (var i = 0; i < ep.charactersName.length; i++) {
    if (ep.charactersName[i].charactersId === ep.rowEntity.charactersId) {
      ep.vetoAddData.characterName = ep.charactersName[i];
    }
  }

  ep.selectValue = function() {
    if (ep.vetoAddData.characterName) {
      switch (ep.vetoAddData.characterName.dataType) {
        case '枚举型':
          ep.selectShow = true;
          ep.inputShow = false;
          ep.dateShow = false;
          break;
        case '日期型':
          ep.dateShow = true;
          ep.selectShow = false;
          ep.inputShow = false;
          break;
        case '':
          ep.inputShow = true;
          ep.dateShow = false;
          ep.selectShow = false;
          break;
        default:
          ep.inputShow = true;
          ep.dateShow = false;
          ep.selectShow = false;
          break;
      }
    } else {
      ep.inputShow = false;
      ep.dateShow = false;
      ep.selectShow = false;
    }
  };
  ep.ok = function() {
    var params = {};
    params = angular.copy(ep.vetoAddData);
    params.charactersName = ep.vetoAddData.characterName.charactersName;
    params.charactersId = ep.vetoAddData.characterName.charactersId;
    params.dataType = ep.vetoAddData.characterName.dataType;
    params.dataTypeCode = ep.vetoAddData.characterName.dataTypeCode;
    params.unitId = ep.vetoAddData.characterName.unitId;
    params.unitName = ep.vetoAddData.characterName.unitName;
    params.operator = ep.vetoAddData.operator.code;
    params.operatorStr = ep.vetoAddData.operator.message;

    $uibModalInstance.close(params);
  };
  ep.edit = function() {
    ep.formDisabled = false;
  };
  ep.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);
