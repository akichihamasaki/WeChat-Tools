'use strict';
/**
 * ctrl 入库申请单
 * @author cxl
 */
angular.module('lpht.germplasm').controller('InStockFormCtrl', ['$filter', '$scope', '$http', 'uiGridConstants', '$uibModal', 'ngDialog', 'toaster', function($filter, $scope, $http, uiGridConstants, $uibModal, ngDialog, toaster) {
  //在controller中不要直接使用scope
  var sm = $scope.sm = {};
  var gm = $scope.gm = {};
  sm.search = {};
  sm.isCollapsed = true; //是否显示更多
  gm.radioModel = 'sm';
  gm.disableDelete = true;

  //新增修改查看弹出框
  gm.openInstockModal = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'popInStockFormModal',
      controller: 'PopInStockFormCtrl',
      size: 'auto',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return (!type.match(/add/) && selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
    modalInstance.result.then(function(result) {
      getGridData();
      //console.info(result);
    });
  };

  //查看审核意见
  gm.openCheckView = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'popInStockFormCheckViewModal',
      controller: 'popInStockFormCheckViewCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return (selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
  };

  //打开查看入库详情
  gm.openViewDetail = function(){
    var modalInstance = $uibModal.open({
      templateUrl: 'popInStockFormDetailModal',
      controller: 'popInStockFormDetailCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return (selectedRows.length === 1) ? selectedRows[0] : {};
        },
        parentScope: function() {
          return $scope;
        }
      }
    });
    // modalInstance.result.then(function(result) {
    //   getGridData();
    //   console.info(result);
    // });
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
  gm.delete = function() {
    // var selectedRows = gm.gridApi.selection.getSelectedRows();
    // var row = selectedRows[0];
    // console.log('%o---del---', row);
    // var charactersid = { charactersId: row.charactersId };
    // var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', toasterId: 1 });
    // $http.post('api/baseinfo/characters/delCharacters', charactersid)
    // .success(function(data) {
    //   toaster.pop({ type: 'success', title: '删除成功！', toasterId: 1 });
    //   sm.searchAction();
    // })
    // .error(function(data) {
    //   toaster.pop({ type: 'warn', title: '删除失败！', toasterId: 1 });
    // });
  };

  //分页属性
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  /*表格属性*/
  gm.grid = {
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
    useExternalPagination: false, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    useExternalSorting: true, //是否使用自定义排序逻辑
    //---选择属性---//
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    columnDefs: [
      { field: 'instockId', displayName: '入库单号' },
      { field: 'instockType', displayName: '入库单类型' },
      { field: 'instockState', displayName: '入库单状态' },
      { field: 'typeNum', displayName: '品种数' },
      { field: 'storage', displayName: '仓库' },
      { field: 'storageRoom', displayName: '库房' },
      // { field: 'storageArea', displayName: '库区',width:100 },
      { field: 'instockApplicator', displayName: '入库申请人' },
      { field: 'instockMgr', displayName: '库管员' },
      { field: 'instockTime', displayName: '入库时间' }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
        getGridData();
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        gm.disableDelete = selectedRows.length > 0 ? false : true;
      });
    }
  };

  /*获得表格数据事件*/
  function getGridData() {
    $http.get('api/germplasm/instockform')
      .success(function(data) {
        gm.grid.data = data;
      }).error(function(ex) {
        toaster.pop('error', ex);
      });
  }
  getGridData();

  //模糊查询
  sm.search = function() {
    getGridData();
  };

  //重置查询
  sm.reset = function() {
    sm.search = {};
    getGridData();
  };
}]);


//查看审核意见controller
angular.module('lpht.germplasm').controller('popInStockFormCheckViewCtrl', ['$scope', '$uibModalInstance','$http', 'rowEntity', 'parentScope', function($scope, $uibModalInstance,$http, rowEntity, parentScope) {
  $scope.ps = parentScope;
  var cv = $scope.cv = {};
  cv.rowEntity = angular.copy(rowEntity);
  cv.close = function(){
    $uibModalInstance.dismiss('cancel');
  };
}]);


// 查看入库明细弹框controller
angular.module('lpht.germplasm').controller('popInStockFormDetailCtrl', ['$scope', '$uibModalInstance','$http', 'rowEntity', 'parentScope', function($scope, $uibModalInstance,$http, rowEntity, parentScope) {
  var dm = $scope.dm = {};
  $scope.ps = parentScope;
  dm.rowEntity = angular.copy(rowEntity);

  //分页属性
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: null
  };
  //表格属性
  dm.detailgrid = {
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
    useExternalPagination: false, //是否使用分页按钮,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    useExternalSorting: true, //是否使用自定义排序逻辑
    //---选择属性---//
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    onRegisterApi: function(gridApi) {
      dm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
        paginationOptions.pageNumber = newPage - 1;
        paginationOptions.pageSize = pageSize;
      });
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {

      });
    }
  };
  if(dm.rowEntity.instockType === '稳定材料'||dm.rowEntity.instockType === '中间材料'){
    dm.detailgrid.columnDefs = [
      { field: 'breedCode', displayName: '材料编码',width:120 },
      { field: 'breedName', displayName: '货号',width:120 },
      { field: 'harvestLocation', displayName: '产地',width:100 },
      { field: 'harvestTime', displayName: '收获年份',width:100 },
      { field: 'areaCode', displayName: '小区号',width:100 },
      { field: 'unit', displayName: '入库单位',width:100 },
      { field: 'count', displayName: '申请数量',width:100 },
      { field: 'count', displayName: '入库数量', width: 100 },
      //{ field: 'storageLocation', displayName: '存放位置',width:180 }
    ];
  }
  if(dm.rowEntity.instockType === '品种组合'){
    dm.detailgrid.columnDefs = [
      { field: 'breedCode', displayName: '品种编号',width:120 },
      { field: 'breedName', displayName: '货号',width:120 },
      { field: 'harvestLocation', displayName: '产地',width:100 },
      { field: 'harvestTime', displayName: '收获年份',width:100 },
      { field: 'areaCode', displayName: '小区号',width:100 },
      { field: 'unit', displayName: '入库单位',width:100 },
      { field: 'count', displayName: '申请数量',width:100 },
      { field: 'count', displayName: '入库数量', width: 100 },
      //{ field: 'storageLocation', displayName: '存放位置',width:180 }
    ];
  }
  //获取表格数据
  function getDetailData(){
    $http.get('api/germplasm/instockformdetail')
    .success(function(data) {
      if(dm.rowEntity.instockType === '稳定材料'){
        dm.detailgrid.data = data.content1;
      }
      if(dm.rowEntity.instockType === '中间材料'){
        dm.detailgrid.data = data.content2;
      }
      if(dm.rowEntity.instockType === '品种组合'){
        dm.detailgrid.data = data.content3;
      }
    }).error(function(ex) {
      //toaster.pop('error', ex);
    });
  }
  getDetailData();

  //取消操作
  dm.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
}]);


/*模态弹出框新增、修改功能的controller*/
angular.module('lpht.germplasm').controller('PopInStockFormCtrl', ['$scope','$http','$uibModalInstance', 'modalType', 'rowEntity', 'parentScope', function($scope,$http, $uibModalInstance, modalType, rowEntity, parentScope) {
  var pop = $scope.pop = {};
  $scope.ps = parentScope;
  pop.rowEntity = angular.copy(rowEntity);
  pop.formDisabled = false;
  pop.modalType = modalType;
  //判断那种材料入库、和修改
  switch(modalType){
    case 'wdadd'://稳定材料入库
      pop.rowEntity = {};
      pop.rowEntity.instockType = '稳定材料';
      pop.rowEntity.firstClassify = '育种材料';
      pop.rowEntity.secondClassify = '稳定材料';
      pop.rowEntity.wd = [];
      pop.wdshow = true;
      break;

    case 'zjadd'://中间材料入库
      pop.rowEntity = {};
      pop.rowEntity.instockType = '中间材料';
      pop.rowEntity.firstClassify = '育种材料';
      pop.rowEntity.secondClassify = '中间材料';
      pop.rowEntity.zj = [];
      pop.zjshow = true;
      break;

    case 'pzzhadd'://品种组合入库
      pop.rowEntity = {};
      pop.rowEntity.instockType = '品种组合';
      pop.rowEntity.pzzh = [];
      pop.pzzhshow = true;
      break;

    default://修改
      $http.get('api/germplasm/instockformdetail')
      .success(function(data) {
        if(pop.rowEntity.instockType === '稳定材料'){
          pop.rowEntity.wd = data.content1;
          pop.wdshow = true;
        }
        if(pop.rowEntity.instockType === '中间材料'){
          pop.rowEntity.zj = data.content2;
          pop.zjshow = true;
        }
        if(pop.rowEntity.instockType === '品种组合'){
          pop.rowEntity.pzzh = data.content3;
          pop.pzzhshow = true;
        }
        pop.rowEntity.instockTime = new Date(pop.rowEntity.instockTime);
      }).error(function(ex) {
        //toaster.pop('error', ex);
      });
      break;
  }

  if (modalType === 'view') pop.formDisabled = true;

  pop.edit = function() {
    pop.formDisabled = false;
  };

  // //输入框焦点转移
  // pop.nextfocus = function($event){
  //   if($event.keyCode === 13  || $event.keyCode === 39){
  //     $event.target.parentNode.nextElementSibling.childNodes[1].focus();
  //   }
  //   if($event.keyCode === 37){
  //     $event.target.parentNode.previousElementSibling.childNodes[1].focus();
  //   }
  // };

  // pop.firstfocus = function($event){
  //   if($event.keyCode === 13 || $event.keyCode === 39){
  //     $event.target.parentNode.parentNode.childNodes[3].childNodes[1].focus();
  //   }
  // };

  //添加行
  pop.addRow = function(){
    if(modalType === 'wdadd' || pop.rowEntity.instockType === '稳定材料'){
      var wdnewRow = {
        breedCode : pop.wd.breedCode,
        breedName : pop.wd.breedName,
        motherCode : pop.wd.motherCode,
        fatherCode : pop.wd.fatherCode,
        harvestTime : pop.wd.harvestTime,
        areaCode : pop.wd.areaCode,
        harvestLocation : pop.wd.harvestLocation,
        count : pop.wd.count,
        unit : pop.wd.unit,
        row : pop.wd.row,
        color : pop.wd.color,
        seedType : pop.wd.seedType,
        assess : pop.wd.assess,
        editable : false//后台不存在，不保存
      };
      pop.rowEntity.wd.push(wdnewRow);
    }
    if(modalType === 'zjadd' || pop.rowEntity.instockType === '中间材料'){
      var zjnewRow = {
        breedCode : pop.zj.breedCode,
        breedName : pop.zj.breedName,
        motherCode : pop.zj.motherCode,
        fatherCode : pop.zj.fatherCode,
        harvestTime : pop.zj.harvestTime,
        areaCode : pop.zj.areaCode,
        harvestLocation : pop.zj.harvestLocation,
        count : pop.zj.count,
        unit : pop.zj.unit,
        generationNum :pop.zj.generationNum,
        plantNum : pop.zj.plantNum,
        suiNum : pop.zjsuiNum,
        row : pop.zj.row,
        color : pop.zj.color,
        seedType : pop.zj.seedType,
        assess : pop.zj.assess,
        editable : false//后台不存在，不保存
      };
      pop.rowEntity.zj.push(zjnewRow);

    }
    if(modalType === 'pzzhadd' || pop.rowEntity.instockType === '品种组合'){
      var pzzhnewRow = {
        experimentstage : pop.pzzh.experimentstage,
        breedCode : pop.pzzh.breedCode,
        breedName : pop.pzzh.breedName,
        motherCode : pop.pzzh.motherCode,
        fatherCode : pop.pzzh.fatherCode,
        harvestTime : pop.pzzh.harvestTime,
        areaCode : pop.pzzh.areaCode,
        harvestLocation : pop.pzzh.harvestLocation,
        count : pop.pzzh.count,
        unit : pop.pzzh.unit,
        row : pop.pzzh.row,
        color : pop.pzzh.color,
        seedType : pop.pzzh.seedType,
        assess : pop.pzzh.assess,
        editable : false//后台不存在，不保存
      };
      pop.rowEntity.pzzh.push(pzzhnewRow);
    }
  };
  //删除行
  pop.delRow = function(row){
    if(modalType === 'wdadd' || pop.rowEntity.instockType === '稳定材料'){
      angular.forEach(pop.rowEntity.wd,function(data,index){
        if(data === row){
          pop.rowEntity.wd.splice(index,1);
        }
      });
    }
    if(modalType === 'zjadd' || pop.rowEntity.instockType === '中间材料'){
      angular.forEach(pop.rowEntity.zj,function(data,index){
        if(data === row){
          pop.rowEntity.zj.splice(index,1);
        }
      });
    }
    if(modalType === 'pzzhadd' || pop.rowEntity.instockType === '品种组合'){
      angular.forEach(pop.rowEntity.pzzh,function(data,index){
        if(data === row){
          pop.rowEntity.pzzh.splice(index,1);
        }
      });
    }
  };
  //编辑行
  pop.eidtRow = function(row){
    row.editable = !row.editable;
  };
  //保存
  pop.ok = function() {
    $uibModalInstance.close(pop.rowEntity);
  };
  //取消
  pop.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };
}]);
