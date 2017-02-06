'use strict';

app.controller('SettingProfileCtrl', ['$scope', 'toaster', '$uibModal', 'Setting', function($scope, toaster, $uibModal, Setting) {
    $scope.model = {};
    $scope.setting = {};
    $scope.setting.id = '';

    Setting.profile($scope.setting)
        .then(function (response) {
            $scope.model.settingprofile = response.data;
            $scope.setting.id = $scope.model.settingprofile.id;
            $scope.setting.email = $scope.model.settingprofile.email;
            $scope.setting.phone = $scope.model.settingprofile.phone;
        });

    $scope.onAdd = function () {
        Setting.employeeUpt($scope.setting)
            .then(function () {
              toaster.pop('success', '提交成功');
            })
            .catch(function () {
              toaster.pop('error', '提交失败');
            });
    };
}]);

app.controller('SettingPasswordCtrl', ['$scope', 'toaster', '$uibModal', 'Setting', function($scope, toaster, $uibModal, Setting) {
    $scope.model = {};
    $scope.setting = {};
    $scope.setting.id = '';

    Setting.profile($scope.setting)
        .then(function (response) {
            $scope.model.settingprofile = response.data;
            $scope.setting.id = $scope.model.settingprofile.id;
        });

    $scope.onAdd = function () {
        if ($scope.setting.newPassword !== $scope.setting.newPasswordRepeat) {
            toaster.pop('error', '两次输入的新密码不一致');
            return;
        }

        Setting.employeeUpt($scope.setting)
            .then(function () {
                $scope.setting.oldPassword = '';
                $scope.setting.newPassword = '';
                $scope.setting.newPasswordRepeat = '';

              toaster.pop('success', '重设密码成功');
            })
            .catch(function () {
              toaster.pop('error', '重设密码失败');
            });
    };
}]);
