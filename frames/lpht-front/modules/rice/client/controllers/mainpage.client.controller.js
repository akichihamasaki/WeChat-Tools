'use strict';

/**
 * 主页controller
 * @author jxk
 */
angular.module('lpht.rice').controller('MainPageCtrl', ['$scope', '$http', '$uibModal', 'toasterBusService', function($scope, $http, $uibModal, toasterBusService) {
  var pm = $scope.pm = {}; //panelModel

  pm.openModal = function(item) {
    var modalInstance = $uibModal.open({
      templateUrl: 'mainPageModal',
      controller: 'ModalMainPageCtrl',
      size: 'lg',
      backdrop: 'static',
      resolve: {
        itemData: function() {
          return item;
        }
      }
    });

    modalInstance.result.then(function(result) {
      console.info(result);
    });
  };
  /**
   * 获取各面板数据
   */
  $http.post('api/lpht/common/messagepublish/queryMessagePublishByUser', {})
    .success(function(data) {
      pm.noticeData = data.noticeMessageList;
      pm.announceData = data.announceMessageList;
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });
}]);
/**
 * 主页模态框controller
 * @author jxk
 */
angular.module('lpht.rice').controller('ModalMainPageCtrl', ['$scope', '$http', '$uibModalInstance', 'toasterBusService', 'itemData', function($scope, $http, $uibModalInstance, toasterBusService, itemData) {
  var im = $scope.im = {}; //itemModel
  im.attachable = false; //是否显示下载按钮

  if (itemData.readFlag === '0') {
    $http.post('api/lpht/common/messagepublish/addMessageReadLog', { publishId: itemData.publishId })
      .success(function(data) {
        itemData.readFlag = '1';
      })
      .error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }

  $http.post('api/lpht/common/messagepublish/queryMessagePublish', { publishId: itemData.publishId })
    .success(function(data) {
      im.publishData = data;
      if (data.attachId) {
        im.attachable = true;
      }
    })
    .error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });

  im.downloadFile = function() {
    console.info(im.publishData.attachId);
    var url = 'api/common/attachFile/downloadAttachFile' + '?fileId=' + im.publishData.attachId;
    /*$http.post(url)
      .success(function(data) {
        console.info(data);
      })
      .error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });*/
    /*window.open(url);*/
  };

  im.ok = function() {
    $uibModalInstance.close();
  };

  im.cancel = function() {
    $uibModalInstance.dismiss();
  };
}]);
