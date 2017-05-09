'use strict';

/**
 * 繁种警戒提醒主页面controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('BreedingRemindTimeCtrl', ['$scope', '$http', '$uibModal', 'uiGridConstants', 'toaster', function($scope, $http, $uibModal, uiGridConstants, toaster) {
  var gm = $scope.gm = {}; //gridModel
  gm.disableDelete = true; //是否禁用删除按钮
  //uiGrid参数
  gm.gridOptions = {
    //---基础属性---//
    enableGridMenu: true, //是否显示grid菜单
    enableFiltering: false, //是否筛选
    enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    enableVerticalScrollbar: 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    enableColumnMenu: true, //是否显示列菜单
    enablePinning: false, //是否固定列
    //---排序属性---//
    enableSorting: true, //是否排序
    //---选择属性---//
    enableSelectAll: false, //是否显示全选按钮
    enableFullRowSelection: true, //是否点击行任意位置后选中
    enableRowHeaderSelection: false, //是否显示选中checkbox框
    multiSelect: false, //是否可以选择多个
    noUnselect: true, //是否不能取消选中
    //---表列属性---//
    columnDefs: [
      { field: 'cropTypeStr', displayName: '作物名称' },
      { field: 'roomTypeStr', displayName: '库房类型' },
      { field: 'signType', displayName: '关系运算符' },
      { field: 'remindNumber', displayName: '繁种警戒时间（月）' },
      { field: 'remark', displayName: '描述', cellTooltip: true }
    ],
    onRegisterApi: function(gridApi) {
      gm.gridApi = gridApi;

      gridApi.selection.on.rowSelectionChanged($scope, function(row, event) {
        var selectedRows = gridApi.selection.getSelectedRows();
        gm.disableDelete = selectedRows.length > 0 ? false : true;
      });
    }
  };
  //打开模态框，只有修改和查看，只选中了一条数据的情况下打开
  gm.openModal = function(type) {
    var modalInstance = $uibModal.open({
      templateUrl: 'breedingRemindTimeModal',
      controller: 'ModalBreedingRemindTimeCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        modalType: function() {
          return type;
        },
        rowEntity: function() {
          var selectedRows = gm.gridApi.selection.getSelectedRows();
          return (type !== 'add' && selectedRows.length === 1) ? selectedRows[0] : {};
        }
      }
    });

    modalInstance.result.then(function(result) {
      getGrid();
    });
  };


  //加载grid数据
  function getGrid() {
    var loadToaster = toaster.pop({ type: 'wait', title: '数据加载中...', timeout: 0, toasterId: 1 });
    $http.post('api/germmanage/breedingRemindTime/queryBreedingRemindTime', {})
      .success(function(data) {
        gm.gridOptions.data = data.content;
        gm.disableDelete = true;
        toaster.clear(loadToaster);
      })
      .error(function(ex) {
        toaster.clear(loadToaster);
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  }

  getGrid();

}]);
/**
 * 繁种警戒提醒修改，查看模态框controller
 * @author jxk
 */
angular.module('lpht.germplasm').controller('ModalBreedingRemindTimeCtrl', ['$scope', '$http', '$uibModalInstance', 'toaster', 'modalType', 'rowEntity', function($scope, $http, $uibModalInstance, toaster, modalType, rowEntity) {
  var fm = $scope.fm = {}; //formModel
  fm.rowEntity = angular.copy(rowEntity);
  fm.modalType = modalType;
  fm.formDisabled = false;

  if (modalType === 'view')
    fm.formDisabled = true;

  fm.edit = function() {
    fm.formDisabled = false;
  };

  fm.ok = function() {
    //保存数据
    var params = { remindId: fm.rowEntity.remindId, remindNumber: fm.rowEntity.remindNumber, remark: fm.rowEntity.remark };
    $http.post('api/germmanage/breedingRemindTime/updateBreedingRemindTime', params)
      .success(function(data) {
        if (data.retcode) {
          toaster.pop({ type: 'error', title: data.retmsg, toasterId: 1 });
        } else {
          toaster.pop({ type: 'success', title: '提交成功', toasterId: 1 });
          $uibModalInstance.close();
        }
      })
      .error(function(ex) {
        toaster.pop({ type: 'error', title: ex, toasterId: 1 });
      });
  };

  fm.cancel = function() {
    $uibModalInstance.dismiss();
  };

}]);
