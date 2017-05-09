'use strict';
/**
 * ctrl 性状组
 * @author cxl
 */

angular.module('lpht.rice').controller('CharacterGroupCtrl', ['ngDialog','$filter', '$scope', '$http', 'uiGridConstants','$uibModal','toasterBusService',function(ngDialog,$filter, $scope, $http, uiGridConstants,$modal,toasterBusService) {
  //在controller中不要直接使用scope
  var sm = $scope.sm = {};
  var gm = $scope.gm = {};
  sm.search = {};
  gm.disableDelete = true;
  gm.radioModel = 'sm'; //ui grid初始大小

  // 加载性状组选项
  var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
  $http.get('/api/baseinfo/basehelpcode/baseHelpTypecode/1/character').success(function (data) {
    //console.log(data);
    sm.groupType = data.character;
    toasterBusService.clear(msg);
  })
  .error(function(ex) {
    toasterBusService.clear(msg);
    toasterBusService.publish({ type:'error',title:ex });
  });
  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: '',
    sortName: '',
  };
  gm.grid = {
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
      { field: 'groupName', displayName: '组名称' },
      // { field: 'groupCode', displayName: '组编码' },
      { field: 'groupType', displayName: '组分类' },
      { field: 'remark', displayName: '备注' },
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
       // console.info(sortColumns);
        //getGrid();
        if(sortColumns.length === 0){
          paginationOptions.sortName = '';
          paginationOptions.sort = '';
        }
        else
        {
          paginationOptions.sort = sortColumns[0].sort.direction;
          switch(sortColumns[0].name){
            case 'groupName':
              paginationOptions.sortName = 'group_name';
              break;
            case 'groupType':
              paginationOptions.sortName = 'group_type';
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
        getPage();
      });

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getPage();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        gm.disableDelete = selectedRows.length > 0 ? false : true;
      });
      gridApi.grid.registerRowsProcessor(function(renderableRows) {
        //console.info(renderableRows);
        return renderableRows;
      });
    }
  };
  //加载grid的数据
  function getPage() {
    var params = {};
    params= sm.search;
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    var url = 'api/baseinfo/charactersGroup/queryCharactersGroup' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize +'&sort' + paginationOptions.sortName + ',' +paginationOptions.sort;
    $http.post(url, params).success(function (data) {
      //console.log(params);
      toasterBusService.clear(msg);
      gm.grid.data=data.content;
      gm.grid.totalItems = data.totalElements;
    })
    .error(function(ex) {
      //console.log(ex);
      toasterBusService.clear(msg);
      toasterBusService.publish({ type:'error',title:ex });
    });
    gm.disableDelete = true;
  }
  getPage();

  //模糊查询
  sm.prodSearch = function(){
    // vm.sort =  null;
    gm.gridApi.selection.clearSelectedRows();
    getPage();
    //console.info('%o----search----', sm.search);
  };
  //查询重置
  sm.reset = function(){
    sm.search = {};
    paginationOptions.pageNumber = 0;
    paginationOptions.pageSize = 20;
    // vm.sort =  null;
    gm.gridApi.selection.clearSelectedRows();
    getPage();
  };

  //打开模态框，只有新增,修改和查看，只选中了一条数据的情况下打开
  gm.openModal = function(type, row) {
    var modalInstance = $modal.open({
      templateUrl: 'popCharacterGroup.html',
      controller: 'ModalCharacterGroupCtrl',
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
        parentScope: function() {
          return $scope;
        }
      }
    });
    modalInstance.result.then(function(result) {
      getPage();
      //console.info(result);
    });
  };

  // 删除事件
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
    var groupid = { groupId: row.groupId };
    //console.log('%o---del---', groupid);
    $http.post('api/baseinfo/charactersGroup/delCharactersGroup', groupid)
    .success(function(data) {
      toasterBusService.publish({ type:'success',title:'删除成功！' });
      sm.prodSearch();
    })
    .error(function(ex) {
      toasterBusService.publish({ type:'error',title:ex });
    });
    gm.disableDelete = true;
  };
}]);

angular.module('lpht.rice').controller('ModalCharacterGroupCtrl', ['$stateParams','$http', '$scope', '$uibModalInstance', 'modalType', 'rowEntity', 'parentScope', 'toasterBusService', function($stateParams,$http, $scope, $uibModalInstance, modalType, rowEntity, parentScope, toasterBusService) {
  $scope.ps = parentScope;
  var pop = $scope.pop = {}; //弹框controller
  pop.rowEntity = angular.copy(rowEntity);
  pop.rowEntity.cropType = $stateParams.cropType;
  pop.modalTitle = modalType;
  //查看时是否可编辑
  pop.formDisabled = false;
  if (modalType === 'view')
    pop.formDisabled = true;
  $scope.edit = function(){
    pop.formDisabled = false;
  };
  //保存
  $scope.ok = function() {
    if (modalType === 'add') {
      $http.post('api/baseinfo/charactersGroup/addCharactersGroup', pop.rowEntity)
      .success(function(data) {
        $uibModalInstance.close(pop.rowEntity);
        toasterBusService.publish({ type:'success',title:'操作成功！' });
      })
      .error(function(ex) {
        toasterBusService.publish({ type:'error',title:ex });
      });
    } else
    {
      $http.post('api/baseinfo/charactersGroup/updateCharactersGroup', pop.rowEntity)
      .success(function(data) {
        $uibModalInstance.close(pop.rowEntity);
        toasterBusService.publish({ type:'success',title:'操作成功！' });
      })
      .error(function(ex) {
        toasterBusService.publish({ type:'error',title:ex });
      });
    }
  };
  //取消
  $scope.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
