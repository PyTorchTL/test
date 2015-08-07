'use strict';

app.controller('ActivityNewCtrl', ['$scope', 'toaster', 'Activity', function($scope, toaster, Activity) {

    $scope.activity = {};

    $scope.onAdd = function () {
      Activity.addActivity($scope.activity)
        .then(function () {
          toaster.pop('success', '创建成功');
        })
        .catch(function () {
          toaster.pop('error', '创建失败');
        });
    };
}]);

app.controller('ActivityFirstReviewCtrl', ['$http', '$scope', 'toaster', '$modal', 'Activity', function($http, $scope, toaster, $modal, Activity) {

  $scope.model = {};
  $scope.query = {};
  $scope.query.keyword = '';
  $scope.query.page = 1;
  $scope.query.size = 10;

  $scope.maxSize = 5;

  $scope.get = function () {
    Activity.firstReviewList($scope.query)
      .then(function (response) {
        $scope.model.firstReviewList = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
      });
  };
  $scope.get();

  $scope.search = function () {
    if ($scope.query.keyword !== '') {
      $scope.query.page = 1;
      $scope.get();
    }
  };

  $scope.pageChanged = function() {
    $scope.get();
  };


  $scope.open = function (activity) {
      var modalInstance = $modal.open({
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
}]);

//弹出对话框--初审对话框
app.controller('ActivityFirstReviewModalCtrl', ['$scope', '$modalInstance', 'item', 'Activity', 'toaster', function($scope, $modalInstance, item, Activity, toaster) {
    $scope.item = item;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      Activity.firstReviewUpt($scope.item)
        .then(function () {
          $modalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };
}]);

app.controller('ActivitySignCtrl', ['$scope', '$modal', 'toaster', 'Activity', function($scope, $modal, toaster, Activity) {

  $scope.model = {};
  $scope.query = {};
  $scope.query.keyword = '';

  $scope.get = function () {
    Activity.signList($scope.query)
      .then(function (response) {
        $scope.model.signList = response.data.data;
        // //DEV: For test only
        // $scope.model.signList[0].mySignStatus = 0;
        // $scope.model.signList[1].mySignStatus = 2;
      });
  };
  $scope.get();

  $scope.search = function () {
    $scope.get();
  };

  //填写会签意见
  $scope.openSign = function (activity) {
      var modalInstance = $modal.open({
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
          toaster.pop('success', '提交成功');
        }
      });
    };
    //查看会签意见
    $scope.openSignResult = function (activity) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_signResult.html',
        controller: 'ActivitySignModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
    };
}]);

app.controller('ActivitySignModalCtrl', ['$scope', '$modalInstance', 'item', 'Activity', 'toaster', function($scope, $modalInstance, item, Activity, toaster) {
    $scope.item = item;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      Activity.signUpt($scope.item)
        .then(function () {
          $modalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };
}]);

app.controller('ActivityFinalReviewCtrl', ['$scope', '$modal', 'toaster', 'Activity', function($scope, $modal, toaster, Activity) {

  $scope.model = {};
  $scope.query = {};
  $scope.query.keyword = '';

  $scope.get = function () {
    Activity.finalReviewList($scope.query)
    .then(function(response){
      $scope.model.finalReviewList = response.data.data;
    });
  };
  $scope.get();

  $scope.search = function () {
    $scope.get();
  };

  $scope.openFinalReview = function (activity) {
      var modalInstance = $modal.open({
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
          toaster.pop('success', '提交成功');
        }
      });
    };
}]);

app.controller('ActivityFinalReviewModalCtrl', ['$http', '$scope', '$modalInstance', 'item', 'Activity', 'toaster', function($http, $scope, $modalInstance, item, Activity, toaster) {
    $scope.item = item;
    $scope.query = {};
    $scope.model = {};

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      Activity.finalReviewUpt($scope.item)
        .then(function () {
          $modalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };

    $http.get('/api/v1/activitySign/'+$scope.item.activityId, {params: $scope.query})
    .then(function (response) {
      $scope.model.signListOne = response.data;
    });
}]);

app.controller('ActivityListCtrl', ['$scope', 'toaster', '$modal', 'Activity', function($scope, toaster, $modal, Activity) {

    $scope.model = {};
    $scope.query = {};
    $scope.query.keyword = '';

    $scope.get = function () {
      Activity.list ($scope.query)
        .then(function (response) {
          $scope.model.activityList = response.data.data;
        });
    };
    $scope.get();

    $scope.search = function () {
      $scope.get();
    };

    $scope.switchTab = function (status) {
      $scope.query.status = status;
      $scope.get();
    };

    $scope.openFailReviewResult = function (activity) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_failFinalreviewResult.html',
        controller: 'ActivityListModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
    };

    $scope.openReviewResult = function (activity) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_finalreviewResult.html',
        controller: 'ActivityListModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
    };

    // TODO: need subscribe data
    $scope.openSubscribeResult = function (activity) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_subscribeResult.html',
        controller: 'ActivitySubscribeResultModalCtrl',
        resolve: {
          item: function () {
            return activity;
          }
        }
      });
    };
}]);

app.controller('ActivityListModalCtrl', ['$http', '$scope', '$modalInstance', 'item', 'Activity', 'toaster', function($http, $scope, $modalInstance, item, Activity, toaster) {
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
        if($scope.item.status>=5 && $scope.item.status!=7){
          return 3;//终审通过
        }
        else if($scope.item.status>=5 && $scope.item.status===7){
          return 4;//终审失败
        }
        else{
          return 5;//终审不显示
        }
      }
    };

    $http.get('/api/v1/activitySign/'+$scope.item.activityId, {params: $scope.query})
    .then(function (response) {
      $scope.model.activitySignListOne = response.data;
    });
}]);


app.controller('ActivitySubscribeCtrl', ['$scope', '$modal', 'toaster', 'Activity', function($scope, $modal, toaster, Activity) {
    $scope.model = {};

    Activity.subscribeList()
    .then(function (response) {
      $scope.model.subscribeList = response.data.data;
    });

    $scope.openAddSubscribe = function (subscribe) {
      var modalInstance = $modal.open({
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
          toaster.pop('success', '提交成功');
        }
      });
    };

    $scope.openSubscribeResult = function (subscribe) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_subscribeResult.html',
        controller: 'ActivitySubscribeResultModalCtrl',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
    };
}]);

app.controller('ActivitySubscribeModalCtrl', ['$scope', '$modalInstance', 'toaster', 'item', 'Activity', function($scope, $modalInstance, toaster, item, Activity) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.userId = '';
    $scope.submitData.numEntourage = '';
    $scope.submitData.finalReviewDecision = '';

    $scope.submit = function () {
      Activity.addSubscribe($scope.submitData)
        .then(function () {
          $modalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);

app.controller('ActivitySubscribeResultModalCtrl', ['$scope', '$modalInstance', 'toaster', 'item', 'Activity', function($scope, $modalInstance, toaster, item, Activity) {
    $scope.item = item;
}]);

app.controller('ActivityFeedbackCtrl', ['$http', '$scope', '$modal', 'Activity', 'toaster', function($http, $scope, $modal, Activity, toaster) {

    $scope.model = {};
    $scope.query = {};
    $scope.query.feedbackStatus = 1;
    $scope.query.keyword = '';

    $scope.get = function () {
      Activity.subscribeList($scope.query)
      .then(function (response) {
        $scope.model.subscribeList = response.data.data;
        //DEV: for test only
        $scope.model.subscribeList[0].feedbackStatus = 0;
      });
    };
    $scope.get();

    $scope.search = function () {
      $scope.get();
    };

    $scope.openAddFeedback = function (subscribe) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_addFeedback.html',
        controller: 'ActivityFeedbackModalCtrl',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
      modalInstance.result.then(function (result) {
        if (result === true) {
          toaster.pop('success', '提交成功');
        }
      });
    };

    $scope.openFeedbackResult = function (subscribe) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_feedbackResult.html',
        controller: 'ActivityFeedbackResultModalCtrl',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
    };
}]);

app.controller('ActivityFeedbackModalCtrl', ['$scope', '$modalInstance', 'toaster', 'item', 'Activity', function($scope, $modalInstance, toaster, item, Activity) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.attendStatus = '';
    $scope.submitData.feedbackNumEntourage = '';
    $scope.submitData.feedbackRemark = '';

    $scope.submit = function () {
      Activity.subscribeFeedbackUpt($scope.submitData)
        .then(function () {
          $modalInstance.close(true);
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);

app.controller('ActivityFeedbackResultModalCtrl', ['$scope', '$modalInstance', 'toaster', 'item', 'Activity', function($scope, $modalInstance, toaster, item, Activity) {
    $scope.item = item;
}]);
