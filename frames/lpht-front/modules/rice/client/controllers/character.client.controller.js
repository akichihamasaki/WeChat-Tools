'use strict';
/**
 * ctrl 性状管理
 * @author cxl
 */
angular.module('lpht.rice').controller('CharacterCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'toasterBusService', 'ngDialog', function($scope, $http, $modal, uiGridConstants, toasterBusService, ngDialog) {

  var sm = $scope.sm = {}; //searchModel
  var gm = $scope.gm = {}; //gridModel
  sm.isCollapsed = true; //是否显示更多
  gm.disableDelete = true; //是否禁用删除按钮
  gm.radioModel = 'sm';
  sm.search = {};
  //sm.search.date = new Date();

  // 加载性状组选项
  var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
  $http.post('/api/baseinfo/charactersGroup/selectCharactersGroup',{}).success(function (data) {
    //console.log(data);
    sm.characterGroup = data;
    toasterBusService.clear(msg);
  })
  .error(function(ex) {
    toasterBusService.clear(msg);
    toasterBusService.publish({ type: 'error', title: ex });
  });

  //加载数据类型
  $http.get('/api/security/helptypecode/typecodes/dataType').success(function (data) {
    //console.log(data);
    sm.dataType = data.dataType;
    toasterBusService.clear(msg);
  })
  .error(function(ex) {
    toasterBusService.clear(msg);
    toasterBusService.publish({ type: 'error', title: ex });
  });

  //加载是否量化
  $http.get('/api/security/helptypecode/typecodes/Y_N').success(function (data) {
    //console.log(data);
    sm.isQuantization = data.Y_N;
    toasterBusService.clear(msg);
  })
  .error(function(ex) {
    toasterBusService.clear(msg);
    toasterBusService.publish({ type: 'error', title: ex });
  });

  //打开新增模态框
  gm.open = function(type) {
    var modalInstance = $modal.open({
      templateUrl: 'characterModal.html',
      controller: 'CharacterModalCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return (type !== 'add'&&selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });

    modalInstance.result.then(function(result) {
      getGrid();
      //console.info(result);
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
        gm.delete();
      }
    });
  };

  //从当前页面的ui-grid中删除选中数据
  var i = 1;
  gm.delete = function() {
    var selectedRows = gm.gridApi.selection.getSelectedRows();
    var row = selectedRows[0];
    //console.log('%o---del---', row);
    var charactersid = { charactersId: row.charactersId };
    $http.post('api/baseinfo/characters/delCharacters', charactersid)
    .success(function(data) {
      toasterBusService.publish({ type: 'success', title: '删除成功！' });
      sm.searchAction();
    })
    .error(function(error) {
      toasterBusService.publish({ type: 'error', title: error });
    });
    gm.disableDelete = true;
  };

  //分页设置
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: '',
    sortName: '',
  };
  //uiGrid参数
  gm.characterGridOptions = {
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
      //{ field: 'charactersCode', displayName: '性状编码', enableColumnMenu: true },
      { field: 'charactersName', displayName: '性状名', enableColumnMenu: true },
      { field: 'groupName', displayName: '性状组', enableColumnMenu: true },
      { field: 'dataType', displayName: '数据类型', enableColumnMenu: true },
      //{ field: 'canCompute', displayName: '是否计算得来', enableColumnMenu: true, cellTooltip: true },
      { field: 'maxValue', displayName: '最大值', enableColumnMenu: true, cellTooltip: true },
      { field: 'minValue', displayName: '最小值', enableColumnMenu: true, cellTooltip: true },
      //{ field: 'idealString', displayName: '理想值', enableColumnMenu: true, cellTooltip: true },
      { field: 'dataPrecision', displayName: '数据精度', enableColumnMenu: true, cellTooltip: true },
      { field: 'unitName', displayName: '数据单位', enableColumnMenu: true, cellTooltip: true },
      //{ field: 'charactersValueRangeList', displayName: '备注', enableColumnMenu: true, cellTooltip: true }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if(sortColumns.length === 0){
          paginationOptions.sortName = '';
          paginationOptions.sort = '';
        }
        else
        {
          paginationOptions.sort = sortColumns[0].sort.direction;
          switch(sortColumns[0].name){
            case 'charactersCode':
              paginationOptions.sortName = 'characters_code';
              break;
            case 'charactersName':
              paginationOptions.sortName = 'characters_name';
              break;
            case 'groupName':
              paginationOptions.sortName = 'group_name';
              break;
            case 'dataType':
              paginationOptions.sortName = 'data_type';
              break;
            case 'maxValue':
              paginationOptions.sortName = 'max_value';
              break;
            case 'minValue':
              paginationOptions.sortName = 'min_value';
              break;
            case 'dataPrecision':
              paginationOptions.sortName = 'data_precision';
              break;
            case 'unitName':
              paginationOptions.sortName = 'unit_name';
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
        // console.info(currentPage);
        // console.info(pageSize);
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        var charactersid = { charactersId:selectedRows[0].charactersId };
        $http.post('api/baseinfo/characters/getCharacters',charactersid)
        .success(function(data) {
          gm.charactersValueRangeList = data.charactersValueRangeList;
          gm.charactersValueEnumList = data.charactersValueEnumList;
          if(data.calculationFormulasList)
            gm.calculationFormulasList = data.calculationFormulasList.join('');
        });
        gm.disableDelete = selectedRows.length > 0 ? false : true;
      });

      gridApi.grid.registerRowsProcessor(function(renderableRows) {
        //console.info(renderableRows);
        return renderableRows;
      });
    }
  };

  //配置uiGrid数据
  function getGrid() {
    var searchData = {};
    searchData = sm.search;
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    var url = 'api/baseinfo/characters/queryCharacters' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize +'&sort' + paginationOptions.sortName + ',' +paginationOptions.sort;
    /*$http.get("http://httpbin.org/delay/3")*/
    $http.post(url, searchData)
      .success(function(data) {
        //console.log(searchData);
        gm.characterGridOptions.data = data.content;
        gm.characterGridOptions.totalItems = data.totalElements;
        toasterBusService.clear(msg);
      })
      .error(function(ex) {
        toasterBusService.clear(msg);
        toasterBusService.publish({ type: 'error', title: ex });
      });
    gm.disableDelete = true;
  }
  getGrid();

  //搜索按钮
  sm.searchAction = function() {
    //console.info(sm.search);
    // vm.sort =  null;
    gm.gridApi.selection.clearSelectedRows();
    getGrid();
    //console.info('%o----search----', sm.search);

  };
  //重置按钮
  sm.reset = function() {
    sm.search = {};
    paginationOptions.pageNumber = 0;
    paginationOptions.pageSize = 20;
    // vm.sort =  null;
    gm.gridApi.selection.clearSelectedRows();
    getGrid();
  };

}]);


//新增、修改、查看弹出框的controller
angular.module('lpht.rice').controller('CharacterModalCtrl', ['$stateParams','$scope','toasterBusService', 'ngDialog', 'modalType', 'rowEntity', '$http', '$uibModalInstance', '$uibModal','parentScope', function($stateParams,$scope,toasterBusService, ngDialog, modalType, rowEntity, $http, $modalInstance, $modal,parentScope) {
  $scope.ps = parentScope;
  var pop = $scope.pop = {};
  pop.rowEntity = {};
  pop.rowEntity.cropType = $stateParams.cropType;//基础数据作物类型
  pop.modalTitle = modalType;

  //获取单位选项
  var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
  $http.post('api/baseinfo/charactersUnit/getCharactersUnitSelectList',{})
  .success(function(data) {
    pop.unit = data;
    toasterBusService.clear(msg);
  })
  .error(function(ex) {
    toasterBusService.clear(msg);
    toasterBusService.publish({ type:'error',title:ex });
  });
  //加载数据精度
  $http.get('/api/security/helptypecode/typecodes/dataPrecision').success(function (data) {
    //console.log(data);
    pop.dataPrecision = data.dataPrecision;
    toasterBusService.clear(msg);
  })
  .error(function(ex) {
    toasterBusService.clear(msg);
    toasterBusService.publish({ type:'error',title:ex });
  });

  //查看时是否可编辑
  pop.formDisabled = false;//查看时不可编辑
  if (modalType === 'view')
    pop.formDisabled = true;
  pop.edit = function() {
    pop.formDisabled = false;
  };

  //新增时必要的赋初值
  if(modalType === 'add') {
    pop.rowEntity.isQuantization = '0';
    pop.rowEntity.dataType = '01';
    pop.rowEntity.charactersValueEnumList = [];
    pop.rowEntity.charactersValueRangeList = [];
    pop.rowEntity.calculationFormulasList = [];
    pop.rowEntity.expressionList = [];
  }
  else
  { //根据性状id，查询该性状详细信息
    var charactersid = { charactersId:rowEntity.charactersId };
    var msg2 = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    $http.post('api/baseinfo/characters/getCharacters',charactersid)
    .success(function(data) {
      toasterBusService.clear(msg2);
      pop.rowEntity = data;
      if(data.calculationFormulasList)
        pop.rowEntity.calculationFormulas = data.calculationFormulasList.join(' ');//公式数组转为string展示
      if(data.expressionList)
        pop.rowEntity.expression = data.expressionList.join(' ');
    })
    .error(function(ex) {
      toasterBusService.clear(msg2);
      toasterBusService.publish({ type:'error',title:ex });
    });
  }

  //添加枚举值
  pop.exitEnum = false;//添加枚举值时，判断是否已经存在该值
  pop.addEnum = addEnum;
  function addEnum(newEnum) {
    pop.exitEnum = false;
    var enumArray = { attributeName: pop.enum.newEnumKey, color: pop.enum.newEnumColor , score: '' };
    angular.forEach(pop.rowEntity.charactersValueEnumList, function(data, index) {
      if (data.attributeName === newEnum.newEnumKey)
        pop.exitEnum = true;
    });
    if(!pop.exitEnum)
    {
      pop.rowEntity.charactersValueEnumList.push(enumArray);
      pop.enum = {};
    }
  }
  //删除枚举值
  pop.delEnum = function(row) {
    angular.forEach(pop.rowEntity.charactersValueEnumList, function(data, index) {
      if (data === row) {
        pop.rowEntity.charactersValueEnumList.splice(index, 1);
      }
    });
  };
  pop.enumChange = function(){
    pop.exitEnum = false;
    angular.forEach(pop.rowEntity.charactersValueEnumList, function(data, index) {
      if (data.attributeName === pop.enum.newEnumKey)
        pop.exitEnum = true;
    });
  };
  //添加数值型的量化行
  pop.addNumRow = function(){
    var numArray = { beginNum: pop.num.low, endNum: pop.num.up, score: pop.num.value };
    pop.rowEntity.charactersValueRangeList.push(numArray);
    pop.num = {};
  };
  //删除数值型的量化行
  pop.delNumRow = function(row){
    angular.forEach(pop.rowEntity.charactersValueRangeList, function(data, index) {
      if (data === row) {
        pop.rowEntity.charactersValueRangeList.splice(index, 1);
      }
    });
  };
  //数据类型改变清空公式
  pop.dataTypeChange=function(){
    pop.rowEntity.calculationFormulas = '';
    pop.rowEntity.expression = '';
    pop.rowEntity.calculationFormulasList = [];
    pop.rowEntity.expressionList = [];
  };
  //保存内容
  pop.save = function() {
    if(pop.rowEntity.isQuantization === '0')
    {
      pop.rowEntity.charactersValueRangeList = [];
    }
    //数据类型不为数值型时，数据单位、精度、最大最小值、量化数组为空
    if(pop.rowEntity.dataType !== '01') {
      pop.rowEntity.unitId = '';
      pop.rowEntity.unitName = '';
      pop.rowEntity.dataPrecision = '';
      pop.rowEntity.minValue = '';
      pop.rowEntity.maxValue = '';
      pop.rowEntity.charactersValueRangeList = [];
    }
    //数据类型不为枚举型时，枚举值量化数组为空
    if(pop.rowEntity.dataType !== '02') {
      pop.rowEntity.charactersValueEnumList = [];
    }

    if(!(pop.rowEntity.dataType === '01' || pop.rowEntity.dataType === '02'))
    {
      pop.rowEntity.isQuantization = '0';
      pop.rowEntity.calculationFormulasList = [];
      pop.rowEntity.expressionList = [];
    }


    //新增时新增数据
    if(modalType === 'add'){
      //console.log(pop.rowEntity);
      $http.post('api/baseinfo/characters/addCharacters', pop.rowEntity)
      .success(function(data) {
        $modalInstance.close(pop.rowEntity);
        toasterBusService.publish({ type: 'success', title: '操作成功！' });
      })
      .error(function(ex) {
        toasterBusService.publish({ type: 'warn', title: ex });
      });
    }
    else{
      //查看或修改时，update数据
      //console.log(pop.rowEntity);
      $http.post('api/baseinfo/characters/updateCharacters', pop.rowEntity)
      .success(function(data) {
        $modalInstance.close(pop.rowEntity);
        //console.log(pop.rowEntity);
        toasterBusService.publish({ type: 'success', title: '操作成功！' });
      })
      .error(function(ex) {
        toasterBusService.publish({ type: 'warn', title: ex });
      });
    }
  };

  //关闭弹窗
  pop.close = function() {
    $modalInstance.dismiss('cancel');
  };

  //打开公式编辑框
  pop.mathEditor = function() {
    var mathEditorView = $modal.open({
      templateUrl: 'mathEditorModal',
      controller: 'MathModalCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          return pop.rowEntity;
        }
      }
    });

    mathEditorView.result.then(function(data) {
      if(data)
      {
        pop.rowEntity.calculationFormulas = data.calculationFormulasList.join(' ');
        pop.rowEntity.calculationFormulasList = data.calculationFormulasList;
        pop.rowEntity.expressionList = data.expressionList;
        pop.rowEntity.expression = data.expressionList.join(' ');
      }
    });
  };

  //打开量化编辑框
  // pop.quantizationEditor = function() {
  //   var quantizationEditorView = $modal.open({
  //     templateUrl: 'quantizationEditorModal',
  //     controller: 'QuantizationEditorCtrl',
  //     size: 'lg',
  //     backdrop: 'static',
  //     resolve: {
  //       valueType: function() {
  //         return pop.rowEntity.type;
  //       },
  //       quantizationValueNum: function() {
  //         return pop.rowEntity.quantizationValueNum;
  //       },
  //       quantizationValueEnum: function() {
  //         return pop.rowEntity.quantizationValueEnum;
  //       }
  //     }
  //   });
  //   quantizationEditorView.result.then(function(data) {
  //     if (pop.rowEntity.type === '数值')
  //       pop.rowEntity.quantizationValueNum = data;
  //     if (pop.rowEntity.type === '枚举')
  //       pop.rowEntity.quantizationValueEnum = data;
  //   });
  // };

}]);

//公式编辑器的controller
angular.module('lpht.rice').controller('MathModalCtrl', ['$scope', '$uibModalInstance', '$http', 'rowEntity','toasterBusService', function($scope, $modalInstance, $http, rowEntity,toasterBusService) {
  var math = $scope.math = {};
  var expressionArray = rowEntity.expressionList;
  var calculationFormulasArray = rowEntity.calculationFormulasList;
  //math.expression = rowEntity.expression.join('');
  math.calculationFormulas = rowEntity.calculationFormulasList.join(' ');

  //查询所有的性状组
  var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
  $http.post('/api/baseinfo/charactersGroup/selectCharactersGroup',{})
  .success(function (data) {
    //console.log(data);
    toasterBusService.clear(msg);
    math.characterGroup = data;
  })
  .error(function(ex) {
    //console.log(data);
    toasterBusService.clear(msg);
    toasterBusService.publish({ type:'error',title:ex });
    //toaster.pop({ type: 'error', title: ex, toasterId: 1 });
  });


  //参数查询
  function getParams(groupid,charactersName){
    var searchData = { groupId:groupid,charactersName:charactersName };
    $http.post('/api/baseinfo/characters/queryCharactersByGroupId',searchData)
      .success(function (data) {
        //console.log(data);
        toasterBusService.clear(msg);
        math.characterComponent = data;
      })
      .error(function(ex) {
        toasterBusService.clear(msg);
        toasterBusService.publish({ type:'error',title:ex });
      });
  }
  getParams('','');//查出所有性状

  //重置查询参数
  math.resetParams = function(){
    math.group = '';
    math.searchParam = '';
    getParams('','');
  };

  //根据性状组id,查询属于该组的所有性状
  math.selGroup = function(group){
    if(group){
      getParams(group.groupId,math.searchParam);
    }
    else{
      getParams('',math.searchParam);
    }
  };

  //双击选择参数
  math.dblSelParam = function(obj){
    calculationFormulasArray.push('['+obj.charactersName+']');
    math.calculationFormulas = calculationFormulasArray.join(' ');
    expressionArray.push('['+obj.charactersCode+']');
  };

  //计算器键盘
  math.showParam = function(param) {
    calculationFormulasArray.push(param);
    expressionArray.push(param);
    math.calculationFormulas = calculationFormulasArray.join(' ');
  };
  //撤销
  math.backShowParam = function() {
    expressionArray.pop();
    calculationFormulasArray.pop();
    math.calculationFormulas = calculationFormulasArray.join(' ');
  };
  //重置
  math.clearExpression = function() {
    calculationFormulasArray = [];
    expressionArray = [];
    math.calculationFormulas = '';
  };

  //模糊查询参数
  math.search = function(group){
    if(group)
      getParams(group.groupId,math.searchParam);
    else getParams('',math.searchParam);
  };

  //保存
  math.save = function() {
    var mathExpression = { expressionList:expressionArray,calculationFormulasList:calculationFormulasArray };
    $modalInstance.close(mathExpression);
  };
  //取消
  math.cancel = function() {
    $modalInstance.dismiss();
  };
}]);

//量化等级编辑器的controller
// angular.module('lpht.rice').controller('QuantizationEditorCtrl', ['$scope', '$uibModalInstance', 'valueType', 'quantizationValueNum', 'quantizationValueEnum', function($scope, $modalInstance, valueType, quantizationValueNum, quantizationValueEnum) {
//   $scope.type = valueType; //数值类型为数字或枚举
//   var mm = $scope.mm = {};

//   mm.numValue = [];
//   if (quantizationValueNum && quantizationValueNum.length !== 0)
//     mm.numValue = angular.copy(quantizationValueNum);

//   mm.addNumRow = function() {
//     mm.numValue.push({ low: mm.num.low, up: mm.num.up, value: mm.num.value });
//     mm.num = {};
//   };

//   mm.delNumRow = function(row) {
//     angular.forEach(mm.numValue, function(data, index) {
//       if (data === row) {
//         mm.numValue.splice(index, 1);
//       }
//     });
//   };

//   // mm.enumValue = [{ enumKey:'',value:'' }];
//   if (quantizationValueEnum && quantizationValueEnum.length !== 0)
//     mm.enumValue = angular.copy(quantizationValueEnum);
//   else mm.enumValue = [{ enumKey: '', value: '' }];

//   //保存量化内容
//   $scope.save = function() {
//     if ($scope.type === '数值')
//       $modalInstance.close(mm.numValue);
//     if ($scope.type === '枚举')
//       $modalInstance.close(mm.enumValue);
//   };
//   //关闭量化编辑器
//   $scope.cancel = function() {
//     $modalInstance.dismiss('cancel');
//   };

// }]);
