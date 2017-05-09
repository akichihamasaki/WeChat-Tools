'use strict';
/**
 * 信息发布主页面controller
 * @author xr
 */
angular.module('lpht.lpht').controller('MessagePublishCtrl', ['$scope', '$http', '$filter', '$uibModal', 'uiGridConstants', 'toaster', 'ngDialog', function($scope, $http, $filter, $uibModal, uiGridConstants, toaster, ngDialog) {

  var sm = $scope.sm = {}; //searchModel
  var gm = $scope.gm = {}; //gridModel
  sm.searchData = {}; //查询数据集
  //加载信息类型，发布对象类型 的数据字典
  $http.get('api/security/helptypecode/typecodes/infoType,noticeType,publishObjectType')
    .success(function(data) {
      sm.selectData = data; //将数据传递到modal页面，以免重复调用后台
    })
    .error(function(ex) {
      toaster.pop({ type: 'error', title: ex, toasterId: 1 });
    });

  //搜索按钮
  sm.search = function() {
    getGrid();
  };
  //重置按钮
  sm.reset = function() {
    sm.searchData = {};
  };

  //信息类型选择框变化
  sm.changeInfoType = function() {
    sm.searchData.noticeType = '';
  };

  gm.radioModel = 'sm';
  gm.buttonDisable = {};

  //初始化按钮控制变量
  gm.initButtonDisable = function() {
    gm.buttonDisable = { edit: true, view: true, publish: true, cancel: true, delete: true };
  };
  //按钮控制变量赋值
  gm.setButtonDisable = function(selectedRows) {
    var row = selectedRows[0];
    gm.buttonDisable.view = false;
    gm.buttonDisable.delete = false;
    if (row.publishStatus === '01') {
      gm.buttonDisable.edit = false;
      gm.buttonDisable.publish = false;
      gm.buttonDisable.cancel = true;
    } else if (row.publishStatus === '02') {
      gm.buttonDisable.edit = true;
      gm.buttonDisable.publish = true;
      gm.buttonDisable.cancel = false;
    }

  };
  //ui-grid单元格按钮打开模态框，row代表所在行数据
  gm.openModal = function(type, row) {
    var modalInstance = $uibModal.open({
      templateUrl: 'messagepublishModalCtrl',
      controller: 'MessagePublishModalCtrl',
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
        selectData: function() {
          return sm.selectData;
        }
      }
    });

    modalInstance.result.then(function(result) {
      sm.search();
    });
  };

  //ui-grid单元格按钮打开确认框
  gm.openDialog = function(type) {
    var tempTxt = '';
    var title = '';
    var url = '';
    var selectedRows = gm.gridApi.selection.getSelectedRows();
    var row = selectedRows[0];
    var params = angular.copy(row);
    if (type === 'publish') {
      title = '发布';
      url = 'api/lpht/common/messagepublish/updateMessagePublishStatus';
      params.publishStatus = '02';
    } else if (type === 'cancel') {
      title = '撤销';
      url = 'api/lpht/common/messagepublish/updateMessagePublishStatus';
      params.publishStatus = '01';
    } else if (type === 'delete') {
      title = '删除';
      url = 'api/lpht/common/messagepublish/deleteMessagePublish';
    }
    tempTxt = '<p>确定' + title + '吗？</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>';
    ngDialog.open({
      template: tempTxt,
      className: 'ngdialog-theme-default',
      plain: true,
      scope: $scope,
      closeByDocument: false,
      showClose: false
    }).closePromise.then(function(data) {
      if (data.value === 1)
        gm.openDialogConfirm(title, url, params);
    });
  };

  //确认框确认后的操作
  gm.openDialogConfirm = function(title, url, params) {
    $http.post(url, params)
      .success(function(data) {
        toaster.pop('success', title + '成功！');
        sm.search();
      })
      .error(function(data) {
        toaster.pop('warn', title + '失败！');
      });
  };
  //分页参数
  var paginationOptions = {
    pageNumber: 0,
    pageSize: 20,
    sort: '',
    sortName: '',
  };
  //Grid定义
  gm.gridOptions = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableHorizontalScrollbar: 1, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableFiltering: false, //是否筛选
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
    totalItems: 0, //总条数
    useExternalPagination: true, //是否使用子自定义分页逻辑,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'infoTypeCN', displayName: '信息类型', enableColumnMenu: false },
      { field: 'noticeTypeCN', displayName: '通知类型', enableColumnMenu: false },
      { field: 'infoTitle', displayName: '信息标题', cellTooltip: true, enableColumnMenu: false },
      { field: 'infoContent', displayName: '信息内容', cellTooltip: true, enableColumnMenu: false, enableSorting: false },
      { field: 'publishObjectTypeCN', displayName: '发布对象', enableColumnMenu: false },
      { field: 'publishDate', displayName: '发布日期', enableColumnMenu: false },
      { field: 'publishStatusCN', displayName: '发布状态', enableColumnMenu: false }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length === 0) {
          paginationOptions.sortName = '';
          paginationOptions.sort = '';
        } else if (sortColumns.length === 1) {
          paginationOptions.sort = sortColumns[0].sort.direction;
          switch (sortColumns[0].name) {
            case 'infoTypeCN':
              paginationOptions.sortName = 'info_type_cn';
              break;
            case 'noticeTypeCN':
              paginationOptions.sortName = 'notice_type_cn';
              break;
            case 'infoTitle':
              paginationOptions.sortName = 'info_title';
              break;
            case 'publishObjectTypeCN':
              paginationOptions.sortName = 'publish_object_type_cn';
              break;
            case 'publishDate':
              paginationOptions.sortName = 'publish_date';
              break;
            case 'publishStatusCN':
              paginationOptions.sortName = 'publish_status_cn';
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
        paginationOptions.pageNumber = currentPage - 1;
        paginationOptions.pageSize = pageSize;
        getGrid();
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        if (selectedRows.length > 0) {
          gm.setButtonDisable(selectedRows);
        }
      });
    }
  };

  //配置uiGrid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    var url = 'api/lpht/common/messagepublish/selectMessagePublish' + '?page=' + paginationOptions.pageNumber + '&size=' + paginationOptions.pageSize + '&sort=' + paginationOptions.sortName + ',' + paginationOptions.sort;
    var params = angular.copy(sm.searchData);
    params.cropType = '1';
    params.publishDate = $filter('date')(params.publishDate, 'yyyy-MM-dd');
    $http.post(url, params)
      .success(function(data) {
        //console.log(data);
        gm.gridOptions.data = data.content;
        gm.gridOptions.totalItems = data.totalElements;
        gm.initButtonDisable();
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.clear(loadToaster);
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });

  }

  getGrid();

}]);


//信息发布的一级modal
angular.module('lpht.lpht').controller('MessagePublishModalCtrl', ['$uibModal', '$scope', '$uibModalInstance', 'uiGridConstants', 'Upload', 'modalType', 'rowEntity', 'selectData', '$http', 'toaster', function($uibModal, $scope, $uibModalInstance, uiGridConstants, Upload, modalType, rowEntity, selectData, $http, toaster) {

  var mm = $scope.mm = {}; //模态框model
  var gm = $scope.gm = {}; //gridModel

  //mm.rowEntity = angular.copy(rowEntity);
  mm.rowEntity = {};
  mm.rowEntity.publishId = rowEntity.publishId;
  mm.rowEntity.publishObjectList = [];

  mm.modalType = modalType;
  mm.selectData = selectData;
  mm.formDisabled = false;
  mm.editDisabled = false;
  mm.showFlag = false;

  if (mm.modalType === 'view') {
    mm.formDisabled = true;
    mm.editDisabled = true;
  }
  // mm.pushType = [
  //   { id: 1, type: '短信' },
  //   { id: 2, type: '邮件' },
  //   { id: 3, type: 'APP推送通知' }
  // ];
  //
  //信息类型选择框变化
  mm.changeInfoType = function() {
    mm.rowEntity.noticeType = '';
  };

  mm.changeShowFlag = function() {
    if (mm.rowEntity.publishObjectType === '02') {
      mm.showFlag = true;
    } else {
      mm.showFlag = false;
    }
  };

  mm.getAttachName = function() {
    mm.rowEntity.attachName = mm.rowEntity.file.name;
  };

  mm.edit = function() {
    mm.formDisabled = false;
    mm.modalType = 'edit';
    setEditModalGridOptions();
    gm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
  };

  mm.ok = function() {
    mm.rowEntity.cropType = '1';
    mm.rowEntity.publishObjectList = [];
    if (mm.rowEntity.publishObjectType === '02') {
      var selectedRows = gm.gridApi.selection.getSelectedRows();
      for (var i = 0; i < selectedRows.length; i++) {
        var publishObject = {};
        publishObject.publishId = '';
        publishObject.publishObjectId = selectedRows[i].roleId;
        mm.rowEntity.publishObjectList.push(publishObject);
      }
    }

    mm.rowEntity.attachFile = mm.rowEntity.file;
    mm.rowEntity.file = undefined;

    if (mm.modalType === 'add') {
      Upload.upload({
        url: 'api/lpht/common/messagepublish/addMessagePublish',
        data: mm.rowEntity,
        objectKey: '.k',
        arrayKey: '[i]'
      })
      .then(function(resp){
        toaster.pop({ type: 'success', title: '新增成功！', toasterId: 1 });
        $uibModalInstance.close(mm.rowEntity);
      },
      function(error){
        toaster.pop({ type: 'error', title: '新增失败！', toasterId: 1 });
      });
    } else if (mm.modalType === 'edit') {
      Upload.upload({
        url: 'api/lpht/common/messagepublish/updateMessagePublish',
        data: mm.rowEntity,
        objectKey: '.k',
        arrayKey: '[i]'
      })
      .then(function(resp){
        toaster.pop({ type: 'success', title: '修改成功！', toasterId: 1 });
        $uibModalInstance.close(mm.rowEntity);
      },
      function(error){
        toaster.pop({ type: 'error', title: '修改失败！', toasterId: 1 });
      });
    }
  };

  mm.cancel = function() {
    $uibModalInstance.dismiss();
  };

  //Grid定义
  gm.gridOptions = {
    //---基础属性---//
    enableGridMenu: false, //是否显示grid菜单
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableFiltering: false, //是否筛选
    enableColumnMenu: false, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---排序属性---//
    enableSorting: true, //是否排序
    useExternalSorting: false, //是否使用自定义排序逻辑
    //---分页属性---//
    enablePagination: false, //是否分页,false时页面底部分页按钮无法点击
    enablePaginationControls: false, //使用默认的底部分页,false时页面底部分页按钮不显示
    paginationPageSizes: [20, 40, 80, 1000],
    paginationCurrentPage: 1, //当前页码
    paginationPageSize: 20, //每页显示个数
    totalItems: 0, //总条数
    useExternalPagination: false, //是否使用子自定义分页逻辑,false时使用前端页面的分页逻辑,true时使用paginationChanged事件来设置数据和总数据条数
    //---选择属性---//
    enableSelectAll: true, //是否显示全选按钮
    enableFullRowSelection: false, //是否点击行任意位置后选中
    enableRowHeaderSelection: true, //是否显示选中checkbox框
    multiSelect: true, //是否可以选择多个
    noUnselect: false, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'name', displayName: '角色名', enableColumnMenu: false },
      { field: 'descn', displayName: '描述', cellTooltip: true, enableColumnMenu: false }
    ],
    isRowSelectable: function(row) {
      if (mm.modalType === 'add') {
        return true;
      } else if (mm.modalType === 'edit') {
        if (row.entity.selectFlag === '1')
          gm.gridApi.selection.selectRow(row.entity);
        return true;
      } else if (mm.modalType === 'view') {
        if (row.entity.selectFlag === '1') {
          gm.gridApi.selection.selectRow(row.entity);
          return true;
        } else {
          return false;
        }
      }
    },
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {

      });

    }
  };

  if (mm.modalType === 'view') {
    setViewModalGridOptions();
  } else {
    setEditModalGridOptions();
  }

  function setViewModalGridOptions() {
    gm.gridOptions.enableSelectAll = false;
    gm.gridOptions.noUnselect = true;
  }

  function setEditModalGridOptions() {
    gm.gridOptions.enableSelectAll = true;
    gm.gridOptions.noUnselect = false;
  }
  //配置uiGrid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    var url = 'api/security/role/queryAllRole';
    $http.get(url)
      .success(function(data) {
        //编辑查看时查询后台完整数据
        if (mm.modalType !== 'add') {
          getMessagePublish(data);
        } else
          gm.gridOptions.data = data;

        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.clear(loadToaster);
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

  //获取信息发布完整数据
  function getMessagePublish(gridData) {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    var url = 'api/lpht/common/messagepublish/queryMessagePublish';
    $http.post(url, mm.rowEntity)
      .success(function(data) {
        //console.log(data);
        mm.rowEntity = data;
        if (mm.modalType === 'view' && mm.rowEntity.publishStatus === '01') {
          mm.editDisabled = false;
        }
        if (mm.rowEntity.publishObjectType === '02') {
          mm.showFlag = true;
        }
        console.log(mm);
        var publishObjectList = mm.rowEntity.publishObjectList;
        var rows = gridData;
        publishObjectList.forEach(function(publishObject) {
          for (var i = 0; i < rows.length; i++) {
            if (publishObject.publishObjectId === rows[i].roleId) {
              rows[i].selectFlag = '1';
              break;
            }
          }
        });
        gm.gridOptions.data = gridData;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.clear(loadToaster);
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

}]);
