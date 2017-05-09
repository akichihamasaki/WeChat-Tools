'use strict';

/**
 * 货位管理主页面controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('GoodsLocationCtrl', ['$scope', '$http', '$stateParams', '$uibModal', 'toasterBusService', 'ngDialog', function($scope, $http, $stateParams, $uibModal, toasterBusService, ngDialog) {
  var dm = $scope.dm = {}; //dataModel
  dm.breadcrumb = []; //导航
  dm.treeData = []; //树结构数据集
  dm.disableTreeAdd = false; //是否禁用树新增按钮
  dm.disableTreeEdit = true; //是否禁用树编辑按钮
  dm.disableTreeDel = true; //是否禁用树删除按钮
  dm.disableGroupAdd = true; //是否禁用按钮组新增按钮
  dm.disableGroupEdit = true; //是否禁用按钮组编辑按钮
  dm.disableGroupDel = true; //是否禁用按钮组删除按钮
  dm.disableTableAdd = true; //是否禁用分配货位按钮
  var treeBranch = {};
  var cabinetItem = {};
  //树节点选中事件
  dm.treeSelect = function(branch) {
    treeBranch = branch;
    dm.disableTreeEdit = false;
    if (branch.type === 'shelves') {
      dm.disableTreeAdd = true;
      dm.disableGroupAdd = false;
      dm.disableGroupEdit = true;
      dm.disableGroupDel = true;
      dm.disableTableAdd = true;
      dm.cabinetIndex = -1;
      dm.locationData = [];
      //点击树中的货架节点后，加载货柜数据
      var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
      toasterBusService.publish(msg);
      $http.post('api/germmanage/warehouseManage/queryWarehouseCabinet', { shelvesId: branch.shelvesId })
        .success(function(data) {
          if (data.retcode) {
            toasterBusService.publish({ type: 'error', title: data.retmsg });
          } else {
            dm.cabinetData = data;
          }
          toasterBusService.clear(msg);
        })
        .error(function(ex) {
          toasterBusService.clear(msg);
          toasterBusService.publish({ type: 'error', title: ex });
        });
    } else {
      dm.disableTreeAdd = false;
      dm.disableGroupAdd = true;
    }
    if (branch.children.length !== 0 || (typeof(branch.hasChildren) !== 'undefined' && branch.hasChildren)) {
      dm.disableTreeDel = true;
    } else {
      dm.disableTreeDel = false;
    }
  };
  //新增仓库，库房，库区，货架模态框
  dm.addModal = function() {
    var templateUrl, controller;
    if (treeBranch.type) {
      switch (treeBranch.type) {
        case 'house':
          templateUrl = 'roomModal';
          controller = 'ModalRoomCtrl';
          break;
        case 'room':
          templateUrl = 'areaModal';
          controller = 'ModalAreaCtrl';
          break;
        case 'area':
          templateUrl = 'shelvesModal';
          controller = 'ModalShelvesCtrl';
          break;
      }
    } else {
      templateUrl = 'houseModal';
      controller = 'ModalHouseCtrl';
    }
    var modalInstance = $uibModal.open({
      templateUrl: templateUrl,
      controller: controller,
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return 'add';
        },
        treeBranch: function() {
          return treeBranch;
        }
      }
    });

    modalInstance.result.then(function(result) {
      console.info(result);
      dm.disableTreeDel = true;
      if (treeBranch.type) {
        switch (treeBranch.type) {
          case 'house':
            treeBranch.children.push({ label: result.roomName, roomName: result.roomName, roomType: result.roomType, remark: result.remark, manager: result.manager, managerName: result.managerName, type: 'room', noLeaf: true });
            break;
          case 'room':
            treeBranch.children.push(result);
            break;
          case 'area':
            treeBranch.children.push(result);
            break;
        }
      } else {
        dm.treeData.push(result);
      }
    });
  };
  //修改仓库，库房，库区，货架模态框
  dm.editModal = function() {
    var templateUrl, controller;
    if (treeBranch.type) {
      switch (treeBranch.type) {
        case 'house':
          templateUrl = 'houseModal';
          controller = 'ModalHouseCtrl';
          break;
        case 'room':
          templateUrl = 'roomModal';
          controller = 'ModalRoomCtrl';
          break;
        case 'area':
          templateUrl = 'areaModal';
          controller = 'ModalAreaCtrl';
          break;
        case 'shelves':
          templateUrl = 'shelvesModal';
          controller = 'ModalShelvesCtrl';
          break;
      }
      var modalInstance = $uibModal.open({
        templateUrl: templateUrl,
        controller: controller,
        size: 'lg',
        backdrop: 'static',
        resolve: {
          modalType: function() {
            return 'edit';
          },
          treeBranch: function() {
            return treeBranch;
          }
        }
      });

      modalInstance.result.then(function(result) {
        console.info(result);
        console.info(treeBranch);
        switch (treeBranch.type) {
          case 'house':
            treeBranch.label = result.houseName;
            treeBranch.houseName = result.houseName;
            treeBranch.address = result.address;
            treeBranch.linkMan = result.linkMan;
            treeBranch.linkManName = result.linkManName;
            treeBranch.tel = result.tel;
            break;
          case 'room':
            treeBranch.label = result.roomName;
            treeBranch.roomName = result.roomName;
            treeBranch.roomType = result.roomType;
            treeBranch.remark = result.remark;
            treeBranch.manager = result.manager;
            treeBranch.managerName = result.managerName;
            break;
          case 'area':
            treeBranch.label = result.areaName;
            treeBranch.areaName = result.areaName;
            treeBranch.remark = result.remark;
            break;
          case 'shelves':
            treeBranch.label = result.shelvesName;
            treeBranch.shelvesName = result.shelvesName;
            treeBranch.remark = result.remark;
            break;
        }
      });
    }
  };
  //删除仓库，库房，库区，货架提示框
  dm.deleteDialog = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        var url = '';
        var params = {};
        switch (treeBranch.type) {
          case 'house':
            break;
          case 'room':
            break;
          case 'area':
            url = 'api/germmanage/warehouseManage/delWarehouseArea';
            params = { areaId: treeBranch.areaId };
            break;
          case 'shelves':
            url = 'api/germmanage/warehouseManage/delWarehouseShelves';
            params = { shelvesId: treeBranch.shelvesId };
            break;
        }
        $http.post(url, params)
          .success(function(data) {
            if (data.retcode) {
              toasterBusService.publish({ type: 'error', title: data.retmsg });
            } else {
              deleteTreeBranch(dm.treeData);
              toasterBusService.publish({ type: 'success', title: '删除成功' });
            }
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });
      }
    });
  };
  //删除树节点
  function deleteTreeBranch(treeData) {
    for (var i = 0; i < treeData.length; i++) {
      if (treeData[i].uid === treeBranch.uid) {
        treeData.splice(i, 1);
        dm.disableTreeEdit = true;
        dm.disableTreeDel = true;
        dm.disableGroupAdd = true;
        treeBranch = {};
        return;
      } else {
        if (treeData[i].children.length > 0) {
          deleteTreeBranch(treeData[i].children);
        }
      }
    }
  }
  //选择货柜
  dm.groupSelect = function(item, index) {
    dm.cabinetIndex = index;
    cabinetItem = item;
    dm.disableGroupEdit = false;
    dm.disableTableAdd = false;
    if (item.hasChildren) {
      dm.disableGroupDel = true;
    } else {
      dm.disableGroupDel = false;
    }
    //点击货柜后，加载货位数据
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    $http.post('api/germmanage/warehouseManage/queryWarehouseLocation', { cabinetId: item.cabinetId })
      .success(function(data) {
        if (data.retcode) {
          toasterBusService.publish({ type: 'error', title: data.retmsg });
        } else {
          dm.locationData = data;
        }
        toasterBusService.clear(msg);
      })
      .error(function(ex) {
        toasterBusService.clear(msg);
        toasterBusService.publish({ type: 'error', title: ex });
      });
  };
  //新增，修改货柜模态框
  dm.openCabinet = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'cabinetModal',
      controller: 'ModalCabinetCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        cabinetItem: function() {
          return type === 'add' ? {} : cabinetItem;
        },
        treeBranch: function() {
          return treeBranch;
        }
      }
    });

    modalInstance.result.then(function(result) {
      if (type === 'add') {
        dm.cabinetData.push(result);
        treeBranch.hasChildren = true; //新增货柜后所属货架不能删除
        dm.disableTreeDel = true; //禁用删除按钮
      } else {
        cabinetItem.cabinetName = result.cabinetName;
        cabinetItem.remark = result.remark;
      }
    });
  };
  //删除货柜
  dm.deleteCabinet = function() {
    ngDialog.open({
      template: '<p>确定删除吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1) {
        $http.post('api/germmanage/warehouseManage/delWarehouseCabinet', { cabinetId: cabinetItem.cabinetId })
          .success(function(data) {
            if (data.retcode) {
              toasterBusService.publish({ type: 'error', title: data.retmsg });
            } else {
              dm.cabinetData.splice(dm.cabinetIndex, 1);
              dm.disableGroupEdit = true;
              dm.disableGroupDel = true;
              dm.disableTableAdd = true;
              dm.cabinetIndex = -1;
              dm.locationData = [];
              toasterBusService.publish({ type: 'success', title: '删除成功' });
            }
          })
          .error(function(ex) {
            toasterBusService.publish({ type: 'error', title: ex });
          });
      }
    });
  };
  //构建表型结构
  function getTableData() {
    dm.locationData = [];
    for (var i = 0; i < dm.rows; i++) {
      var tr = [];
      for (var j = 0; j < dm.cols; j++) {
        var td = { goodsNumber: dm.numbers, goods: [] };
        tr.push(td);
      }
      dm.locationData.push(tr);
    }
  }
  //分配货位
  dm.setLocation = function() {
    var flag = false;
    outerloop: //将外层循环命名以便直接跳出
      for (var i = 0; i < dm.locationData.length; i++) {
        for (var j = 0; j < dm.locationData[i].length; j++) {
          flag = (dm.locationData[i][j].goodsCount > 0);
          if (flag)
            break outerloop;
        }
      }
    if (flag) {
      ngDialog.open({
        template: '<p>货位中有数据尚未清空！</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(0)">关闭</button></div>',
        className: 'ngdialog-theme-default',
        plain: true,
        scope: $scope,
        closeByDocument: false,
        showClose: false
      });
    } else {
      var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
      toasterBusService.publish(msg);
      var params = { cabinetId: cabinetItem.cabinetId, locationRow: dm.rows, locationCol: dm.cols, goodsNumber: dm.numbers };
      $http.post('api/germmanage/warehouseManage/addWarehouseLocation', params)
        .success(function(data) {
          if (data.retcode) {
            toasterBusService.publish({ type: 'error', title: data.retmsg });
          } else {
            dm.locationData = data;
            cabinetItem.hasChildren = true;
            dm.disableGroupDel = true;
            toasterBusService.publish({ type: 'success', title: '分配成功' });
          }
          toasterBusService.clear(msg);
        })
        .error(function(ex) {
          toasterBusService.clear(msg);
          toasterBusService.publish({ type: 'error', title: ex });
        });
    }
  };
  //打开货位模态框
  dm.openLocationModal = function(td) {
    var modalInstance = $uibModal.open({
      templateUrl: 'locationModal',
      controller: 'ModalLocationCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        tdItem: function() {
          return td;
        }
      }
    });

    modalInstance.result.then(function(result) {
      td.goodsNumber = result.goodsNumber;
    });
  };



  //加载仓库，库房，库区，货架数据
  var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
  toasterBusService.publish(msg);
  $http.post('api/germmanage/warehouseManage/queryWarehouseHouse', { cropType: $stateParams.cropType })
    .success(function(data) {
      if (data.retcode) {
        toasterBusService.publish({ type: 'error', title: data.retmsg });
      } else {
        dm.treeData = data;
      }
      toasterBusService.clear(msg);
    })
    .error(function(ex) {
      toasterBusService.clear(msg);
      toasterBusService.publish({ type: 'error', title: ex });
    });

}]);
/**
 * 选择仓库负责人模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalLinkManCtrl', ['$scope', '$http', '$uibModalInstance', 'uiGridConstants', 'toasterBusService', function($scope, $http, $uibModalInstance, uiGridConstants, toasterBusService) {
  var gm = $scope.gm = {}; //gridModel
  gm.searchData = {}; //查询数据集
  //分页排序参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20
  };
  //查询按钮
  gm.search = function() {
    getGrid();
  };
  //重置按钮
  gm.reset = function() {
    gm.searchData = {};
    getGrid();
  };
  //uiGrid参数
  gm.gridOptions = {
    //---基础属性---//
    enableGridMenu: false, //是否显示grid菜单
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: false, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---排序属性---//
    enableSorting: false, //是否排序
    useExternalSorting: false, //是否使用自定义排序逻辑
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
      { field: 'nodeName', displayName: '员工姓名', enableColumnMenu: false },
      { field: 'pathNodeName', displayName: '机构/部门', enableColumnMenu: false }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });
    }
  };

  gm.ok = function() {
    $uibModalInstance.close(gm.gridApi.selection.getSelectedRows());
  };

  gm.cancel = function() {
    $uibModalInstance.dismiss();
  };

  //加载grid数据
  function getGrid() {
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    var url = 'api/common/lphtuser/queryLphtUserByUserIdPage' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    var params = gm.searchData;
    $http.post(url, params)
      .success(function(data) {
        gm.gridOptions.data = data.content;
        gm.gridOptions.totalItems = data.totalElements;
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
 * 选择库房管理员模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalManagerCtrl', ['$scope', '$http', '$uibModalInstance', 'uiGridConstants', 'toasterBusService', function($scope, $http, $uibModalInstance, uiGridConstants, toasterBusService) {
  var gm = $scope.gm = {}; //gridModel
  gm.manager = []; //选中的管理员
  gm.searchData = {}; //查询数据集
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20
  };
  //查询按钮
  gm.search = function() {
    getGrid();
  };
  //重置按钮
  gm.reset = function() {
    gm.searchData = {};
    getGrid();
  };
  //uiGrid参数
  gm.gridOptions = {
    //---基础属性---//
    enableGridMenu: false, //是否显示grid菜单
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: false, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---排序属性---//
    enableSorting: false, //是否排序
    useExternalSorting: false, //是否使用自定义排序逻辑
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
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    isRowSelectable: function(row) {
      for (var i = 0; i < gm.manager.length; i++) {
        if(gm.manager[i].nodeId === row.entity.nodeId){
          gm.gridApi.selection.selectRow(row.entity);
        }
      }
    },
    //---表列属性---//
    columnDefs: [
      { field: 'nodeName', displayName: '员工姓名', enableColumnMenu: false },
      { field: 'pathNodeName', displayName: '机构/部门', enableColumnMenu: false }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.pagination.on.paginationChanged($scope, function(currentPage, pageSize) {
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        if (row.isSelected) {
          var flag = true;
          for (var i = 0; i < gm.manager.length; i++) {
            if (gm.manager[i].nodeId === row.entity.nodeId) {
              flag = false;
              break;
            }
          }
          if (flag) {
            gm.manager.push(row.entity);
          }
        } else {
          for (var j = 0; j < gm.manager.length; j++) {
            if (gm.manager[j].nodeId === row.entity.nodeId) {
              gm.manager.splice(j, 1);
              break;
            }
          }
        }
      });
    }
  };
  //删除选择的管理员
  gm.delManager = function(index) {
    for (var i = 0; i < gm.gridOptions.data.length; i++) {
      if (gm.gridOptions.data[i].nodeId === gm.manager[index].nodeId) {
        gm.gridApi.selection.unSelectRow(gm.gridOptions.data[i]);
        break;
      }
    }
    //gm.manager.splice(index, 1);
  };

  gm.ok = function() {
    $uibModalInstance.close(gm.manager);
  };

  gm.cancel = function() {
    $uibModalInstance.dismiss();
  };

  //加载grid数据
  function getGrid() {
    var msg = { type: 'wait', title: '数据加载中...', timeout: 0, toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    var url = 'api/common/lphtuser/queryLphtUserByUserIdPage' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize;
    var params = gm.searchData;
    $http.post(url, params)
      .success(function(data) {
        gm.gridOptions.data = data.content;
        gm.gridOptions.totalItems = data.totalElements;
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
 * 仓库详细数据模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalHouseCtrl', ['$scope', '$http', '$stateParams', '$uibModal', '$uibModalInstance', 'toasterBusService', 'modalType', 'treeBranch', function($scope, $http, $stateParams, $uibModal, $uibModalInstance, toasterBusService, modalType, treeBranch) {
  var fm = $scope.fm = {}; //formModel
  fm.treeBranch = angular.copy(treeBranch);
  fm.treeBranch.cropType = $stateParams.cropType;
  //打开选中人员模态框
  fm.openModal = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'linkManModal',
      controller: 'ModalLinkManCtrl',
      size: 'md',
      backdrop: 'static'
    });

    modalInstance.result.then(function(result) {
      if (result.length > 0) {
        fm.treeBranch.linkManName = result[0].nodeName;
        fm.treeBranch.linkMan = result[0].nodeId;
        fm.treeBranch.tel = result[0].tel;
      } else {
        fm.treeBranch.linkManName = '';
        fm.treeBranch.linkMan = '';
        fm.treeBranch.tel = '';
      }
    });
  };

  fm.ok = function() {
    var url = '';
    if (modalType === 'add') {
      url = 'api/germmanage/warehouseManage/addWarehouseHouse';
    } else if (modalType === 'edit') {
      url = 'api/germmanage/warehouseManage/updateWarehouseHouse';
    }
    $http.post(url, fm.treeBranch)
      .success(function(data) {
        if (data.retcode) {
          toasterBusService.publish({ type: 'error', title: data.retmsg });
        } else {
          toasterBusService.publish({ type: 'success', title: '提交成功' });
          $uibModalInstance.close(data);
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
/**
 * 库房详细数据模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalRoomCtrl', ['$scope', '$http', '$uibModal', '$uibModalInstance', 'toasterBusService', 'modalType', 'treeBranch', function($scope, $http, $uibModal, $uibModalInstance, toasterBusService, modalType, treeBranch) {
  var fm = $scope.fm = {}; //formModel
  fm.treeBranch = {};
  if (modalType === 'add') {
    fm.treeBranch.houseId = treeBranch.houseId;
  } else if (modalType === 'edit') {
    fm.treeBranch = angular.copy(treeBranch);
  }
  //打开选中人员模态框
  fm.openModal = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'managerModal',
      controller: 'ModalManagerCtrl',
      size: 'md',
      backdrop: 'static'
    });

    modalInstance.result.then(function(result) {
      console.info(result);
      if (result.length > 0) {
        var managerName = [];
        for (var i = 0; i < result.length; i++) {
          managerName.push(result[i].userName);
        }
        fm.treeBranch.managerName = managerName.join(',');
        fm.treeBranch.manager = result;
      } else {
        fm.treeBranch.managerName = '';
        fm.treeBranch.manager = '';
      }
    });
  };

  fm.ok = function() {
    $uibModalInstance.close(fm.treeBranch);
  };

  fm.cancel = function() {
    $uibModalInstance.dismiss();
  };

  //加载库房类型
  $http.get('api/security/helptypecode/typecodes/roomType')
    .success(function(data) {
      fm.roomTypeData = data.roomType;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });

}]);
/**
 * 库区详细数据模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalAreaCtrl', ['$scope', '$http', '$uibModalInstance', 'toasterBusService', 'modalType', 'treeBranch', function($scope, $http, $uibModalInstance, toasterBusService, modalType, treeBranch) {
  var fm = $scope.fm = {}; //formModel
  fm.treeBranch = {};
  if (modalType === 'add') {
    fm.treeBranch.roomId = treeBranch.roomId;
  } else if (modalType === 'edit') {
    fm.treeBranch = angular.copy(treeBranch);
  }

  fm.ok = function() {
    var url = '';
    if (modalType === 'add') {
      url = 'api/germmanage/warehouseManage/addWarehouseArea';
    } else if (modalType === 'edit') {
      url = 'api/germmanage/warehouseManage/updateWarehouseArea';
    }
    $http.post(url, fm.treeBranch)
      .success(function(data) {
        if (data.retcode) {
          toasterBusService.publish({ type: 'error', title: data.retmsg });
        } else {
          toasterBusService.publish({ type: 'success', title: '提交成功' });
          $uibModalInstance.close(data);
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
/**
 * 货架详细数据模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalShelvesCtrl', ['$scope', '$http', '$uibModalInstance', 'toasterBusService', 'modalType', 'treeBranch', function($scope, $http, $uibModalInstance, toasterBusService, modalType, treeBranch) {
  var fm = $scope.fm = {}; //formModel
  fm.treeBranch = {};
  if (modalType === 'add') {
    fm.treeBranch.areaId = treeBranch.areaId;
  } else if (modalType === 'edit') {
    fm.treeBranch = angular.copy(treeBranch);
  }

  fm.ok = function() {
    var url = '';
    if (modalType === 'add') {
      url = 'api/germmanage/warehouseManage/addWarehouseShelves';
    } else if (modalType === 'edit') {
      url = 'api/germmanage/warehouseManage/updateWarehouseShelves';
    }
    $http.post(url, fm.treeBranch)
      .success(function(data) {
        if (data.retcode) {
          toasterBusService.publish({ type: 'error', title: data.retmsg });
        } else {
          toasterBusService.publish({ type: 'success', title: '提交成功' });
          $uibModalInstance.close(data);
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
/**
 * 货柜详细数据模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalCabinetCtrl', ['$scope', '$http', '$uibModalInstance', 'toasterBusService', 'modalType', 'cabinetItem', 'treeBranch', function($scope, $http, $uibModalInstance, toasterBusService, modalType, cabinetItem, treeBranch) {
  var fm = $scope.fm = {}; //formModel
  fm.cabinetItem = angular.copy(cabinetItem);

  fm.ok = function() {
    var url = '';
    if (modalType === 'add') {
      url = 'api/germmanage/warehouseManage/addWarehouseCabinet';
      fm.cabinetItem.shelvesId = treeBranch.shelvesId;
    } else if (modalType === 'edit') {
      url = 'api/germmanage/warehouseManage/updateWarehouseCabinet';
    }
    $http.post(url, fm.cabinetItem)
      .success(function(data) {
        if (data.retcode) {
          toasterBusService.publish({ type: 'error', title: data.retmsg });
        } else {
          toasterBusService.publish({ type: 'success', title: '提交成功' });
          $uibModalInstance.close(data);
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
/**
 * 货位详细数据模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalLocationCtrl', ['$scope', '$http', '$uibModalInstance', 'toasterBusService', 'tdItem', function($scope, $http, $uibModalInstance, toasterBusService, tdItem) {
  var fm = $scope.fm = {}; //formModel

  $http.post('api/germmanage/warehouseManage/getWarehouseLocation', { locationId: tdItem.locationId })
    .success(function(data) {
      if (data.retcode) {
        toasterBusService.publish({ type: 'error', title: data.retmsg });
      } else {
        fm.tdItem = data;
      }
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });

  fm.ok = function() {
    $http.post('api/germmanage/warehouseManage/updateWarehouseLocation', fm.tdItem)
      .success(function(data) {
        if (data.retcode) {
          toasterBusService.publish({ type: 'error', title: data.retmsg });
        } else {
          toasterBusService.publish({ type: 'success', title: '提交成功' });
          $uibModalInstance.close(fm.tdItem);
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
