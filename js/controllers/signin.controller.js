'use strict';

/* Controllers */
  // signin controller
app.controller('SigninController', ['$scope', '$rootScope', '$http', '$state', '$captcha', '$localStorage', 'Util', function($scope, $rootScope, $http, $state, $captcha, $localStorage, Util) {
    $scope.postUser = {};
    $scope.authError = null;
    $scope.enableCaptcha = false;

    $scope.vm = {
      resultado: ''
    };

    function _login() {
      return $http.post('/api/v1/login', {username: $scope.postUser.username, password: $scope.postUser.password})
        .then(function(response) {
          if ( !response.data.user ) {
            $scope.authError = '账号密码错误';
          }else{

            angular.copy(response.data.user, $scope.$parent.user);
            $localStorage.user = {};
            angular.copy(response.data.user, $localStorage.user);

            Util.getListing();
            Util.checkMenuAuthorized($rootScope);

            if (response.data.menuKeys) {
              Util.setMenuKeys(response.data.menuKeys, $scope);
            }
            $state.go('app.home');
          }
        }, function(x) {
          $scope.authError = '账号密码错误';
          $scope.enableCaptcha = true;
        });
    }

    $scope.login = function() {

      $scope.authError = null;

      if ($scope.enableCaptcha) {
        //correct
        if($captcha.checkResult($scope.vm.resultado) === true) {
            _login();
        }
        //error captcha
        else {
            $scope.authError = "验证码错误";
        }
      } else {
        _login();
      }




    };
  }])
;
