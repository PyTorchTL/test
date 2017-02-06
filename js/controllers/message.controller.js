'use strict';

app.controller('SendMessageCtrl', ['$scope', 'toaster', 'Employee', 'Message', function ($scope, toaster, Employee, Message) {

  $scope.model = {};
  $scope.message = {};
  // $scope.model.employees = Employee.all();

  $scope.employees = Message.getEmployeeListForMultiSelect();

  var toEmployee = [];

  $scope.onSelectionChanged = function(items) {
    if (items) {
      toEmployee = [];
      for (var i = 0; i < items.length; i++) {
        toEmployee.push(items[i].id);
      }
    }
  };

  $scope.sendMsg = function () {
    if (toEmployee.length < 1) {
      return;
    }
    $scope.message.toEmployee = toEmployee;
    Message.sendMessage($scope.message)
      .then(function (){
        $scope.message = {};
        toaster.pop('success', '发送成功');
      })
      .catch(function(){
        toaster.pop('error', '发送失败');
      });
    };
}]);

app.controller('MessageNotificationCtrl', ['$scope', 'toaster', '$uibModal', 'Message', function($scope, toaster, $uibModal, Message) {
    $scope.model = {};
    $scope.query = {
        keyword: '',
        status: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: 10
    };

    $scope.get = function () {
      Message.employeeNotice($scope.query)
      .then(function (response) {
        $scope.model.employeeNotice = response.data.data;
      });
    };

    $scope.get();

    $scope.search = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openViewNotification = function (message) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_viewNotification.html',
            controller: 'MessageListModalCtrl',
            resolve: {
                item: function () {
                    return message;
                }
            }
        });
        modalInstance.result.then();
    };
}]);

app.controller('MessageListCtrl', ['$scope', 'toaster', '$uibModal', '$state', 'Message', function($scope, toaster, $uibModal, $state, Message) {
    $scope.model = {};
    $scope.search={
        keywordOption: '',
        keywordValue:  ''
    };
    $scope.query = {
        keyword: '',
        from: '',
        status:      '',
        startTime:   '',
        endTime:     '',
        page:        1,
        size:        10
    };
    var type = 1;

    $scope.get = function () {
      if($scope.search.keywordOption === '0'){
        $scope.query.keyword = $scope.search.keywordValue;
        delete $scope.query.from;
      }
      if($scope.search.keywordOption === '1'){
        $scope.query.from = $scope.search.keywordValue;
        delete $scope.query.keyword;
      }

      if (type === 2) {  // sent messages
        Message.messageSent($scope.query)
        .then(function (response) {
          $scope.model.messageSent = response.data.data;
        });
      }
      else {  // received messages
        Message.messageReceived($scope.query)
        .then(function (response) {
          $scope.model.messageReceived = response.data.data;
          $scope.totalItems = response.data.pageBean.totalCount;
        });
      }
    };

    $scope.get();

    $scope.search = function () {
      $scope.query.page = 1;
      $scope.get();
    };

    $scope.pageChanged = function () {
      $scope.get();
    };

    $scope.theFirstEle = function (index) {
      if(index === 0)
        return true;
      else
        return false;
    };

    $scope.switchTab = function (t) {
      type = t;
      $scope.get();
    };


    $scope.goSend = function () {
      $state.go('app.message.send');
    };

     $scope.openViewMsgRec = function (message) {
       var modalInstance = $uibModal.open({
         templateUrl: 'tpl/modal/modal_viewMsgRec.html',
         controller: 'MessageListModalCtrl',
         resolve: {
           item: function () {
             return message;
           }
         }
       });
       modalInstance.result.then();
     };

    $scope.openViewMsgSend = function (message) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_viewMsgSend.html',
            controller: 'MessageListModalCtrl',
            resolve: {
                item: function () {
                    return message;
                }
            }
        });
        modalInstance.result.then();
    };

}]);

 app.controller('MessageListModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Message', 'toaster', function($scope, $uibModalInstance, item, Message, toaster) {
     $scope.item = item;

     $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };

     Message.markRead(item);

     // $scope.theFirstEle = function (index) {
     //     if(index === 0)
     //         return true;
     //     else
     //         return false;
     // };

     //$scope.submit = function () {
     //  Activity.firstReviewUpt($scope.submitData)
     //    .then(function () {
     //      $uibModalInstance.close(true);
     //    })
     //    .catch(function () {
     //      toaster.pop('error', '提交失败');
     //    });
     //};
 }]);
