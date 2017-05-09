'use strict';
/**
 * 个人信息
 * @author zj
 */
angular.module('users').controller('UserInfoController', ['$scope', '$http', '$stateParams', '$log', 'toasterBusService', 'ngDialog', function($scope, $http, $stateParams, $log, toasterBusService, ngDialog) {
  var ui = $scope.ui = {};
  ui.contentShow = false;
  ui.myImage = '';
  ui.myCroppedImage = '';
  ui.submitDisabled = true;
  //头像上传
  ui.handleFileSelect = function() {
    var msg = { type: 'wait', title: '数据加载中...', toastId: toasterBusService.newGuid() };
    toasterBusService.publish(msg);
    if (ui.files) {
      var file = ui.files;
      if (file.size > 20480000) {
        return ngDialog.open({
          template: '<p>头像图片大小超过2000KB</p><div class="text-right"><button type="button" class="btn btn-danger btn-sm m-r-sm" ng-click="closeThisDialog(1)">确定</button><button type="button" class="btn btn-default btn-sm m-r-sm" ng-click="closeThisDialog(0)">取消</button></div>',
          className: 'ngdialog-theme-default',
          plain: true,
          scope: $scope,
          closeByDocument: false,
          showClose: false
        });
      }
      var reader = new FileReader();
      reader.onload = function(evt) {
        $scope.$apply(function($scope) {

          ui.myImage = evt.target.result;
          toasterBusService.clear(msg);
        });
      };
      reader.readAsDataURL(file);
      ui.submitDisabled = false;
    }
  };

  ui.headSubmit = function() {
    var params = ui.myCroppedImage;
    $http.post('/api/security/user/saveIcon', params)
      .success(function(data) {
        getImg();
        toasterBusService.publish({ type: 'success', title: '修改成功！' });
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  };

  ui.headCancel = function() {
    ui.myImage = '';
  };

  // 初始信息查询(下面一个http为本地JSON)
  $http.get('/api/security/user/getCurrentUser')
    // $http.get('/api/rice/userInfo')
    .success(function(data) {
      ui.user = data;
      // ui.user = data[0];
      ui.selectData = angular.copy(data);
    }).error(function(ex) {
      toasterBusService.publish({ type: 'error', title: ex });
    });
  //初始头像(下面一个http为本地JSON)
  function getImg() {
    $http.get('/api/security/user/getIcon')
      // $http.get('/api/rice/img')
      .success(function(data) {
        ui.headImg = data.fileName;
        // ui.headImg = data[0].img;
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  }
  getImg();

  ui.submit = function() {
    var params = {};
    params = ui.user.employee;
    $http.post('/api/security/organization/saveCurrentEmployee', params)
      .success(function(data) {
        toasterBusService.publish({ type: 'success', title: '修改成功！' });
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });

  };
  ui.cancel = function() {
    ui.user = ui.selectData;
    toasterBusService.publish({ type: 'success', title: '重置成功！' });
  };

  ui.pwSubmit = function() {
    if (ui.pw.password !== ui.pw.passwordVerify) {
      ui.pwShow = true;
    }
    var params = {};
    params.creator = ui.pw.creator;
    params.password = ui.pw.password;

    $http.post('/api/security/user/updatePassword', params)
      .success(function(data) {
        if (data.retcode) {
          if (data.retcode === 1003) {
            toasterBusService.publish({ type: 'error', title: '修改失败，原始密码不正确!' });
          }
        } else {
          toasterBusService.publish({ type: 'success', title: '修改成功！' });
        }
      }).error(function(ex) {
        toasterBusService.publish({ type: 'error', title: ex });
      });
  };

}]);
