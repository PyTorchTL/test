'use strict';

app.controller('ProductFloatingCrtCtrl', ['$scope', '$modal', 'toaster', 'Product', function($scope, $modal, toaster, Product){
    $scope.products = {};

    $scope.onAdd = function () {
      Product.addProduct($scope.products)
        .then(function () {
          toaster.pop('success', '添加成功');
        })
        .catch(function () {
          toaster.pop('error', '添加失败');
        });
    };

    // $scope.cancel = function () {
    //   $modalInstance.dismiss('cancel');
    // };
}]);

app.controller('ProductFixedCrtCtrl', ['$scope', '$modal', 'toaster', 'Product', function($scope, $modal, toaster, Product){
    $scope.products = {};

    $scope.onAdd = function () {
      Product.addProduct($scope.products)
        .then(function () {
          toaster.pop('success', '添加成功');
        })
        .catch(function () {
          toaster.pop('error', '添加失败');
        });
    };

    // $scope.cancel = function () {
    //   $modalInstance.dismiss('cancel');
    // };
}]);

app.controller('ProductBadassetCrtCtrl', ['$scope', '$modal', 'toaster', 'Product', function($scope, $modal, toaster, Product){
    $scope.products = {};

    $scope.onAdd = function () {
      Product.addProduct($scope.products)
        .then(function () {
          toaster.pop('success', '添加成功');
        })
        .catch(function () {
          toaster.pop('error', '添加失败');
        });
    };

    // $scope.cancel = function () {
    //   $modalInstance.dismiss('cancel');
    // };
}]);

app.controller('ProductDiscussListCtrl', ['$scope', 'toaster', '$modal', 'Product', function($scope, toaster, $modal, Product) {
    $scope.model = {};
    $scope.query = {
      name: '',
      productType: '',
      orgnizationType: ''
    };

    $scope.get = function () {
      Product.productDiscussList($scope.query)
      .then(function (response) {
        $scope.model.discussList = response.data;
      });
    };

    $scope.get();

    $scope.search = function () {
      if($scope.query.name !== '' || $scope.query.productType !== '' || $scope.query.orgnizationType !== '') {
        $scope.get();
      }
    };

    $scope.getPeriodShow = function(period){
      return Product.getPeriodShow(period);
    };

    $scope.getProductTypeShow = function(productType){
      return Product.getProductTypeShow(productType);
    };

    $scope.openDiscuss = function (product) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_productDiscuss.html',
        controller: 'ProductDiscussModalCtrl',
        resolve: {
          item: function () {
            return product;
          }
        }
      });
    };

    $scope.openDiscussResult = function (product) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_productDiscussResult.html',
        controller: 'ProductDiscussModalCtrl',
        resolve: {
          item: function () {
            return product;
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

app.controller('ProductDiscussModalCtrl', ['$scope', '$modalInstance', 'toaster', 'item', 'Product', function($scope, $modalInstance, toaster, item, Product) {
    $scope.item = item;

    $scope.submit = function () {
      Product.productDiscussUpt($scope.item)
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

app.controller('ProductOpenCtrl', ['$scope', '$modal', 'Product', function($scope, $modal, Product){
    $scope.query = {};
    $scope.model = {};

    Product.productOpen($scope.query)
    .then(function (response) {
      $scope.model.openList = response.data;
    });

    $scope.getPeriodShow = function (period) {
      return Product.getPeriodShow(period);
    };

    $scope.getProductType = function(productType){
      return Product.getProductTypeShow(productType);
    };
}]);

app.controller('ProductEstablishCtrl', ['$scope', '$modal', 'Product', function($scope, $modal, Product){
    $scope.query = {};
    $scope.model = {};

    Product.productEstablish($scope.query)
    .then(function (response) {
      $scope.model.establishList = response.data;
    });
}]);

app.controller('ProductNetworthSettingCtrl', ['$scope', '$modal', 'Product', function($scope, $modal, Product){
  $scope.query = {};
  $scope.model = {};

  Product.networthSetting($scope.query)
  .then(function(response){
    $scope.model.networthSettingList = response.data;
  });

  $scope.addNetworth = function (networth) {
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal/modal_productAddNetworth.html',
        controller: 'ProductAddNetworthModalCtrl',
        resolve: {
          item: function () {
            return networth;
          }
        }
      });
    };

  $scope.networthHistory = function (networth) {
    var modalInstance = $modal.open({
      templateUrl: 'tpl/modal/modal_productNetworthHistory.html',
      controller: 'ProductNetworthHistoryModalCtrl',
      resolve: {
        item: function(){
          return networth;
        }
      }
    });
  };
}]);

app.controller('ProductAddNetworthModalCtrl', ['$scope', '$modalInstance', 'toaster', 'item', 'Product', function($scope, $modalInstance, toaster, item, Product) {
    $scope.item = item;
    $scope.newNetworth = {};
    $scope.newNetworth.networth = 0;

    $scope.onAdd = function () {
      Product.addNetworth($scope.newNetworth)
        .then(function () {
          toaster.pop('success', '保存成功');
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
}]);

app.controller('ProductNetworthHistoryModalCtrl', ['$scope', '$modalInstance', 'toaster', 'item', 'Product', function($scope, $modalInstance, toaster, item, Product) {
    $scope.item = item;

    $scope.onAdd = function () {
      Product.networthHistory($scope.item)
        .then(function () {
          toaster.pop('success', '保存成功');
        })
        .catch(function () {
          toaster.pop('error', '提交失败');
        });
    };

//     $scope.cancel = function () {
//       $modalInstance.dismiss('cancel');
//     };
 }]);

app.controller('ProductDistributionCtrl', ['$scope', 'toaster', 'Product', function($scope, toaster, Product) {

  $scope.model = {};
  $scope.model.productType = 0; // default：固定类

  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();  // TODO: 1为1月
  var y = date.getFullYear();

  $scope.events = [];
  $scope.init = function () {
    Product.distributionPlan(m).then(function(response){
      $scope.events.splice(0, $scope.events.length); // clean $scope.events
      response.data.forEach(function(e){
        $scope.events.push({
          title: e.toDistributeNumber + "/" + e.totalNumber + "个待分配",
          start: new Date(e.date)
        });
      });

    });
  };

  $scope.init();

  $scope.onEventClick = function (calEvent) {
    var query = {
      date: calEvent.start.format('YYYY-MM-DD'),
      productType: $scope.model.productType
    };

    Product.incomeDistribution(query).then(function(response) {
      $scope.model.incomeDistributionList = [];
      $scope.model.incomeDistributionList = response.data;
    });
  };

  /* config object */
  $scope.uiConfig = {
    calendar:{
      height: 450,
      editable: true,
      header:{
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      eventClick: $scope.onEventClick
      // dayClick: $scope.alertOnEventClick,
      // eventDrop: $scope.alertOnDrop,
      // eventResize: $scope.alertOnResize,
      // eventMouseover: $scope.alertOnMouseOver
    }
  };

  $scope.today = function(calendar) {
    $('.calendar').fullCalendar('today');
    $scope.init();
  };

  $scope.eventSources = [$scope.events];

  $scope.model.incomeDistributionList = [];



}]);
