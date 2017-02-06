'use strict';

app.controller('ActivityNewCtrl', ['$scope', 'toaster', 'Activity', function($scope, toaster, Activity) {

    $scope.activity = {};

    $scope.onAdd = function () {
      $scope.activity.numAttendees = parseInt($scope.activity.numAttendees);
      // $scope.activity.startTime = $scope.activity.startTime.toISOString().slice(0, 10);
      // $scope.activity.endTime = $scope.activity.endTime.toISOString().slice(0, 10);
      // var moment =  window.moment;
      // $scope.activity.startTime = moment($scope.activity.startTime).format('YYYY-MM-DD HH:mm:ss');
      // $scope.activity.endTime = moment($scope.activity.endTime).format('YYYY-MM-DD HH:mm:ss');

      Activity.addActivity($scope.activity)
        .then(function () {
          $scope.activity = {};
          toaster.pop('success', '创建成功');
        })
        .catch(function () {
          toaster.pop('error', '创建失败');
        });
    };
}]);

app.controller('ActivityFirstReviewCtrl', ['$http', '$scope', 'toaster', '$uibModal', 'Activity', function($http, $scope, toaster, $uibModal, Activity) {

  $scope.model = {};
  $scope.query = {};
  $scope.query.keyword = '';
  $scope.query.page = 1;
  $scope.query.size = 10;

  $scope.get = function () {
    Activity.firstReviewList($scope.query)
      .then(function (response) {
        $scope.model.firstReviewList = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
      });
  };
  $scope.get();

  $scope.firstReviewSearch = function () {
    $scope.query.page = 1;
    $scope.get();
  };

  $scope.pageChanged = function() {
    $scope.get();
  };

  $scope.open = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_firstreview.html',
        controller: 'ActivityFirstReviewModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '提交成功');
        }
      });
    };

  $scope.openView = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_activityView.html',
        controller: 'ActivityViewModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
      modalInstance.result.then();
    };
}]);

app.controller('ActivityViewModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Activity', 'toaster', function($scope, $uibModalInstance, item, Activity, toaster) {
    $scope.item = item;
}]);

//弹出对话框--初审对话框
app.controller('ActivityFirstReviewModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Activity', 'toaster', function($scope, $uibModalInstance, item, Activity, toaster) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.id = $scope.item.id;

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      Activity.firstReviewUpt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };
}]);

app.controller('ActivitySignCtrl', ['$scope', '$uibModal', 'toaster', 'Activity', function($scope, $uibModal, toaster, Activity) {

  $scope.model = {};
  $scope.query = {};
  $scope.query.keyword = '';
  $scope.query.page = 1;
  $scope.query.size = 10;

  $scope.get = function () {
    Activity.signList($scope.query)
      .then(function (response) {
        $scope.model.signList = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
        // //DEV: For test only
        // $scope.model.signList[0].mySignStatus = 0;
        // $scope.model.signList[1].mySignStatus = 2;
      });
  };
  $scope.get();

  $scope.signSearch = function () {
    $scope.query.page = 1;
    $scope.get();
  };

  $scope.pageChanged = function() {
    $scope.get();
  };

  //填写会签意见
  $scope.openSign = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_sign.html',
        controller: 'ActivitySignModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '提交成功');
        }
      });
    };
    //查看会签意见
    $scope.openSignResult = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_signResult.html',
        controller: 'ActivitySignModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
      modalInstance.result.then();
    };

    $scope.openView = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_activityView.html',
        controller: 'ActivityViewModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
      modalInstance.result.then();
    };
}]);

app.controller('ActivitySignModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Activity', 'toaster', function($scope, $uibModalInstance, item, Activity, toaster) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.id = $scope.item.mySignId;

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      Activity.signUpt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };
}]);

app.controller('ActivityFinalReviewCtrl', ['$scope', '$uibModal', 'toaster', 'Activity', function($scope, $uibModal, toaster, Activity) {

  $scope.model = {};
  $scope.query = {};
  $scope.query.keyword = '';
  $scope.query.page = 1;
  $scope.query.size = 10;

  $scope.get = function () {
    Activity.finalReviewList($scope.query)
      .then(function(response){
        $scope.model.finalReviewList = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
      });
  };
  $scope.get();

  $scope.finalReviewSearch = function () {
    $scope.query.page = 1;
    $scope.get();
  };

  $scope.pageChanged = function() {
    $scope.get();
  };

  $scope.openFinalReview = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_finalreview.html',
        controller: 'ActivityFinalReviewModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '提交成功');
        }
      });
    };

    $scope.openView = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_activityView.html',
        controller: 'ActivityViewModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
      modalInstance.result.then();
    };
}]);

app.controller('ActivityFinalReviewModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Activity', 'toaster', function($scope, $uibModalInstance, item, Activity, toaster) {
    $scope.item = item;
    $scope.query = {};
    $scope.model = {};
    $scope.submitData = {};
    $scope.submitData.id = $scope.item.id;
   // $scope.submitData.activityId = $scope.item.activityId;

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      Activity.finalReviewUpt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };

    Activity.signListOne($scope.item, $scope.query)
      .then(function (response) {
        $scope.model.signListOne = response.data.data;
      });
}]);

app.controller('ActivityListCtrl', ['$scope', 'toaster', '$uibModal', 'Activity', function($scope, toaster, $uibModal, Activity) {

    $scope.model = {};
    $scope.query = {};
    $scope.query.keyword = '';
    $scope.query.page = 1;
    $scope.query.size = 10;
    // $scope.query.status = 1;

    $scope.get = function () {
      Activity.list ($scope.query)
        .then(function (response) {
          $scope.model.activityList = response.data.data;
          $scope.totalItems = response.data.pageBean.totalCount;
        });
    };
    $scope.get();

    $scope.listSearch = function () {
      $scope.query.page = 1;
      $scope.get();
    };

    $scope.switchTab = function (status) {
      $scope.query.page = 1;
      $scope.query.status = status;
      $scope.get();
    };

    $scope.pageChanged = function() {
      $scope.get();
    };

    $scope.endActivity = function (activity) {
      var r = confirm("确认结束活动？")
      if (r === true) {
        Activity.endActivity (activity)
         .then(function (response) {
            $scope.get();
            toaster.pop('success', '成功结束活动');
          });
       }
    };

    $scope.openChangeActivity = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_changeActivity.html',
        controller: 'ChangeActivityModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '修改成功');
        }
      });
    };

    $scope.openDeleteActivity = function (activity) {
      var delTrue = confirm ("确认删除活动？");
      if (delTrue === true) {
        Activity.activityDel(activity)
          .then(function(response){
            $scope.get();
            toaster.pop('success', '删除活动成功');
          })
          .catch(function(){
            toaster.pop('error', '删除活动失败');
          });
      }
    };

    $scope.openAddSubscribe = function (subscribe) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_addSubscribe.html',
        controller: 'ActivitySubscribeModalCtrl',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '提交成功');
        }
      });
    };

    $scope.openFailReviewResult = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_failFinalreviewResult.html',
        controller: 'ActivityListModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
      modalInstance.result.then();
    };

    $scope.openReviewResult = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_finalreviewResult.html',
        controller: 'ActivityListModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
      modalInstance.result.then();
    };

    // TODO: need subscribe data
    $scope.openSubscribeResult = function (activity) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_subscribeResult.html',
        controller: 'ActivitySubscribeResultModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
      modalInstance.result.then();
    };
}]);

app.controller('ActivityListModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Activity', 'toaster', function($scope, $uibModalInstance, item, Activity, toaster) {
    $scope.item = item;
    $scope.query = {};
    $scope.model = {};

    $scope.show = function () {
      if($scope.item.status===0){
        return 1;//初审进行中
      }
      else if($scope.item.status===6){
        return 2;//初审失败
      }
      //初审通过
      else{
        if($scope.item.status >= 5) {
          if($scope.item.status !== 7) {
            return 3; //终审通过
          }
          else{
            return 4; //终审失败
          }
        }
        else{
          return 5; //终审不显示
        }
        // if($scope.item.status>=5 && $scope.item.status!==7){
        //   return 3;//终审通过
        // }
        // else if($scope.item.status>=5 && $scope.item.status===7){
        //   return 4;//终审失败
        // }
        // else{
        //   return 5;//终审不显示
        // }
      }
    };

    Activity.signListOne($scope.item, $scope.query)
      .then(function (response) {
        $scope.model.activitySignListOne = response.data.data;
      });

}]);

app.controller('ChangeActivityModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Activity', function($scope, $uibModalInstance, toaster, item, Activity) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.id = item.id;
    $scope.submitData.name = item.name;
    $scope.submitData.content = item.content;
    $scope.submitData.startTime = item.startTime;
    $scope.submitData.endTime = item.endTime;
    $scope.submitData.numAttendees = item.numAttendees;
    $scope.submitData.attendees = item.attendees;
    $scope.query = {};

    $scope.submit = function () {
      Activity.activityUpt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '修改失败');
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);

app.controller('ActivitySubscribeCtrl', ['$scope', '$uibModal', 'toaster', 'Activity', function($scope, $uibModal, toaster, Activity) {
    $scope.model = {};
    $scope.query = {};
    $scope.query.keyword = '';
    $scope.query.page = 1;
    $scope.query.size = 10;

    $scope.get = function () {
      Activity.subscribeList($scope.query)
        .then(function (response) {
          $scope.model.subscribeList = response.data.data;
          $scope.totalItems = response.data.pageBean.totalCount;
        });
    };
    $scope.get();

    $scope.subscribeSearch = function () {
      $scope.query.page = 1;
      $scope.get();
    };

    $scope.pageChanged = function() {
      $scope.get();
    };

    $scope.openAddSubscribe = function (subscribe) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_addSubscribe.html',
        controller: 'ActivitySubscribeModalCtrl',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '提交成功');
        }
      });
    };

    $scope.openSubscribeResult = function (subscribe) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_subscribeResult.html',
        controller: 'ActivitySubscribeResultModalCtrl',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
      modalInstance.result.then();
    };
}]);

app.controller('ActivitySubscribeModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Customer', 'Activity', function($scope, $uibModalInstance, toaster, item, Customer, Activity) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.activityId = $scope.item.id;
    $scope.query = {};
    $scope.model = {};

    Customer.allUser()
      .then(function (response){
        $scope.model.customer = response.data.data;
      });

    $scope.submit = function () {
      Activity.addSubscribe($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);

app.controller('ActivitySubscribeResultModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Activity', function($scope, $uibModalInstance, toaster, item, Activity) {
    $scope.item = item;
    $scope.query = {};
    $scope.model = {};

    Activity.subscribeForList($scope.item, $scope.query)
      .then(function(response){
        $scope.model.subscribeForList = response.data.data;
      });
}]);

app.controller('ActivityFeedbackCtrl', ['$scope', '$uibModal', 'Activity', 'toaster', function($scope, $uibModal, Activity, toaster) {

    $scope.model = {};
    $scope.query = {};
    $scope.query.feedbackStatus = 1;
    $scope.query.keyword = '';
    $scope.query.page = 1;
    $scope.query.size = 10;

    $scope.get = function () {
      Activity.feedbackList($scope.query)
      .then(function (response) {
        $scope.model.feedbackList = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
        //DEV: for test only
        // $scope.model.subscribeList[0].feedbackStatus = 0;
      });
    };
    $scope.get();

    $scope.feedbackSearch = function () {
      $scope.query.page = 1;
      $scope.get();
    };

    $scope.pageChanged = function() {
      $scope.get();
    };

    $scope.openDeleteButton = function (subscribe) {
      var delTrue = confirm("确定要删除吗？");
      if (delTrue === true) {
        Activity.activitySubscribeDel(subscribe)
          .then(function(response){
            $scope.get();
            toaster.pop('success', '删除成功');
          })
          .catch(function(){
            toaster.pop('error', '删除失败');
          });
      }
    };

    $scope.openAddFeedback = function (subscribe) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_addFeedback.html',
        controller: 'AddActivityFeedbackModalCtrl',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '提交成功');
        }
      });
    };

    $scope.openEditFeedback = function (subscribe) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_editFeedback.html',
        controller: 'EditActivityFeedbackModalCtrl',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '修改成功');
        }
      });
    };

    $scope.openFeedbackResult = function (subscribe) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_feedbackResult.html',
        controller: 'ActivityFeedbackResultModalCtrl',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
      modalInstance.result.then();
    };
}]);

app.controller('AddActivityFeedbackModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Activity', function($scope, $uibModalInstance, toaster, item, Activity) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.id = $scope.item.id;

    $scope.submit = function () {
      Activity.subscribeFeedbackUpt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);

app.controller('EditActivityFeedbackModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Activity', function($scope, $uibModalInstance, toaster, item, Activity) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.id = $scope.item.id;
    $scope.submitData.attendStatus = item.attendStatus;
    $scope.submitData.feedbackNumEntourage = item.feedbackNumEntourage;
    $scope.submitData.feedbackRemark = item.feedbackRemark;

    $scope.submit = function () {
      Activity.subscribeFeedbackUpt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '修改失败');
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);

app.controller('ActivityFeedbackResultModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Activity', function($scope, $uibModalInstance, toaster, item, Activity) {
    $scope.item = item;
}]);
