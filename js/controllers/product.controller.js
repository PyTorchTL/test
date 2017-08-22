'use strict';

app.controller('ProductNewCtrl', ['$scope', '$state', 'Product', function ($scope, $state, Product) {
    $scope.query = {
        keyword: '',
        productTypes: '0,1,2',
        page: 1,
        size: 10
    };
    $scope.model = {};

    $scope.get = function () {
        Product.products($scope.query)
            .then(function (response) {
                $scope.model.productList = response.data.data;
                $scope.totalItems = response.data.pageBean.totalCount;
            });
    };

    $scope.get();

    $scope.productListSearch = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openProductCopy = function (product) {
      // delete product.id;
      var goState;
      switch (product.productType) {
        case 1: goState = 'app.product.newFloating'; break;
        case 2: goState = 'app.product.newBadAsset'; break;
        case 0:
        default: goState = 'app.product.newFixed'; break;
      }

      $state.go(goState, {toCopy: product});
    };

    $scope.openProductView = function (product) {
      var modalInstance = Product.openProductView(product.productType, product.id);
      modalInstance.result.then();
    };

}]);

app.controller('ProductFloatingCrtCtrl', ['$scope', '$stateParams', '$uibModal', 'toaster', 'Product', function($scope, $stateParams, $uibModal, toaster, Product){
    var init = function () {
      if ($stateParams.toCopy) {
        // $scope.product = $stateParams.toCopy;
        Product.productOne($stateParams.toCopy.id)
          .then(function (response) {
            $scope.product = response.data; // Product.setGetData(response.data);
            delete $scope.product.attachment;
            delete $scope.product.recommendMaterial;
            delete $scope.product.disclourse;
            delete $scope.product.id;

            delete $stateParams.toCopy;  // prevent duplicated submit
          });

      } else {
        $scope.product = {};
        $scope.product.productType = 1;
        $scope.product.period = [0,0];
      }

      $scope.isSubmitting = false;
    };

    init();

    $scope.onAdd = function () {
      $scope.isSubmitting = true;

      Product.addProduct($scope.product)
        .then(function () {
          init();
          toaster.pop('success', '添加成功');
        })
        .catch(function (res) {
          $scope.isSubmitting = false;
          // toaster.pop('error', '添加失败');
          toaster.pop('error', res.data.message);
        });
    };

    // $scope.cancel = function () {
    //   $uibModalInstance.dismiss('cancel');
    // };
}]);

app.controller('ProductFixedCrtCtrl', ['$scope', '$stateParams', '$uibModal', 'toaster', 'Product', function($scope, $stateParams, $uibModal, toaster, Product){

    var init = function () {
      // // test Product.checkRateValidatity()
      // var valid = Product.checkRateValidatity([{
      //   subscribeAmount: [10,20]
      // }, {
      //   subscribeAmount: [11, 30]
      // }]);
      // console.log(valid)

      if ($stateParams.toCopy) {
        Product.productOne($stateParams.toCopy.id)
          .then(function (response) {
            $scope.product = response.data; // $scope.product = Product.setGetData(response.data);
            $scope.selectedPeriod = 1;
            delete $scope.product.attachment;
            delete $scope.product.recommendMaterial;
            delete $scope.product.disclourse;
            delete $scope.product.id;

            delete $stateParams.toCopy;  // prevent duplicated submit
          });
      } else {
        $scope.product = {};
        $scope.product.productType = 0;
        $scope.product.period = [0,0];
        $scope.product.incomeSetting = [{
          anualRatePeriod: undefined,
          purchaseAmount: undefined,
          rates: [{
            subscribeAmount: []
            // rate: 0
          }]
        }];
        $scope.selectedPeriod = 1;
      }

      $scope.isSubmitting = false;
    };

    init();

    $scope.$watch('product.amount', function (newAmount) {
      if (!$scope.product || !$scope.product.incomeSetting) { return; }

      $scope.product.incomeSetting.forEach(function(setting){
        var rate = setting.rates[setting.rates.length - 1]; // the last one
          rate.subscribeAmount[1] = newAmount;
        });
      }, true);


    $scope.onAdd = function () {
      $scope.isSubmitting = true;

      var valid = true;
      $scope.product.incomeSetting.forEach(function(setting) {
        if (!Product.checkRateValidatity(setting.rates)) {
          valid = false;
        }
      });
      if (!valid) {
        toaster.pop('error', '阶梯利益设置不正确');
        return;
      }

      Product.addProduct($scope.product)
        .then(function () {
          init();
          toaster.pop('success', '添加成功');
        })
        .catch(function (res) {
          $scope.isSubmitting = false;
          // toaster.pop('error', '添加失败');
          toaster.pop('error', res.data.message);
        });
    };

    $scope.addIncomeSetting = function () {
      $scope.product.incomeSetting.push({
        anualRatePeriod: undefined,
        purchaseAmount: undefined,
        rates: []
      });
    };

    $scope.deleteIncomeSetting = function (setting) {
      $scope.product.incomeSetting.forEach(function(item, index) {
        if (item === setting) {
          $scope.product.incomeSetting.splice(index, 1);
        }
      });
    };

    $scope.addRate = function (setting) {
      setting.rates.push({
        subscribeAmount: []
        // rate: 0
      });
    };

    $scope.deleteRate = function (setting,rate) {
       setting.rates.forEach(function(item, index) {
        if (item === rate) {
          setting.rates.splice(index, 1);
        }
      });
    };

    $scope.onSelectPeriod = function (value) {
      if (value === 1) {
        $scope.product.period = [0,0];
      }
      else {
        $scope.product.period = [0,0,0];
      }
    };
}]);

app.controller('ProductBadassetCrtCtrl', ['$scope', '$stateParams', '$uibModal', 'toaster', 'Product', function($scope, $stateParams, $uibModal, toaster, Product){

    var init = function () {
      if ($stateParams.toCopy) {
        Product.productOne($stateParams.toCopy.id)
          .then(function (response) {
            $scope.product = response.data; // $scope.product = Product.setGetData(response.data);
            delete $scope.product.attachment;
            delete $scope.product.recommendMaterial;
            delete $scope.product.disclourse;
            delete $scope.product.id;

            delete $stateParams.toCopy;  // prevent duplicated submit
          });
      } else {
        $scope.product = {};
        $scope.product.productType = 2;
      }

      $scope.isSubmitting = false;
    };

    init();

    $scope.onAdd = function () {
      $scope.isSubmitting = true;

      Product.addProduct($scope.product)
        .then(function () {
          init();
          toaster.pop('success', '添加成功');
        })
        .catch(function (res) {
          $scope.isSubmitting = false;
          // toaster.pop('error', '添加失败');
          toaster.pop('error', res.data.message);
        });
    };

    // $scope.cancel = function () {
    //   $uibModalInstance.dismiss('cancel');
    // };
}]);

app.controller('ProductDiscussListCtrl', ['$scope', 'toaster', '$uibModal', 'Product', function($scope, toaster, $uibModal, Product) {
    $scope.model = {};
    $scope.query = {
      keyword: '',
      page: 1,
      size: 10,
      productType: '',
      orgnizationType: ''
    };

    $scope.get = function () {
      Product.productDiscussList($scope.query)
      .then(function (response) {
        $scope.model.discussList = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
      });
    };

    $scope.get();

    $scope.discussSearch = function () {
      $scope.query.page = 1;
      $scope.get();
    };

    $scope.pageChanged = function () {
      $scope.get();
    };

    $scope.getPeriodShow = function(period){
      return Product.getPeriodShow(period);
    };

    $scope.getProductTypeShow = function(productType){
      return Product.getProductTypeShow(productType);
    };

    $scope.openDiscuss = function (product) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_productDiscuss.html',
        controller: 'ProductDiscussModalCtrl',
        resolve: {
          item: function () {
            return product;
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

    $scope.openDiscussResult = function (product) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_productDiscussResult.html',
        controller: 'ProductDiscussModalCtrl',
        resolve: {
          item: function () {
            return product;
          }
        }
      });
      modalInstance.result.then();
    };

    $scope.openProductView = function (product) {
      var modalInstance = Product.openProductView(product.productType, product.productId);
      modalInstance.result.then();
    };
}]);

app.controller('FixedProductViewModalCtrl', ['$scope', '$uibModalInstance', 'id', 'Product', 'Util', function($scope, $uibModalInstance, id, Product, Util) {
    $scope.model = {};

    $scope.getShow = function(sign, key) {
      return Util.getShow(sign, key);
    };

    $scope.getPeriodTypeShow = function(period) {
      return Util.getProductPeriodTypeShow(period);
    };

    Product.productOne(id)
      .then(function(response){
        $scope.model.product = response.data;
      });
}]);

app.controller('FloatingProductViewModalCtrl', ['$scope', '$uibModalInstance', 'id', 'Product', 'Util', function($scope, $uibModalInstance, id, Product, Util) {
    $scope.model = {};

    $scope.getImageUrl = function (url) {
      return Product.getImageUrl(url);
    };

    $scope.getShow = function(sign, key) {
      return Util.getShow(sign, key);
    };

    Product.productOne(id)
      .then(function(response){
        $scope.model.product = response.data;
      });
}]);

app.controller('BadAssetProductViewModalCtrl', ['$scope', '$uibModalInstance', 'id', 'Product', 'Util', function($scope, $uibModalInstance, id, Product, Util) {
    $scope.model = {};

    $scope.getImageUrl = function (url) {
      return Product.getImageUrl(url);
    };

    $scope.getShow = function(sign, key) {
      return Util.getShow(sign, key);
    };

    Product.productOne(id)
      .then(function(response){
        $scope.model.product = response.data;
      });
}]);

app.controller('ProductDiscussModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Product', 'Util', function($scope, $uibModalInstance, toaster, item, Product, Util) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.id = item.id;

    var menuKeys = Util.getMenuKeys();
    $scope.isAdmin = menuKeys ? menuKeys.indexOf('ROLE_ADMIN') >= 0 : false;

    $scope.submit = function () {
      Product.productDiscussUpt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function (res) {
          // toaster.pop('error', '提交失败');
          toaster.pop('error', res.data.message);
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);

app.controller('ProductOpenCtrl', ['$scope', '$uibModal', 'toaster', 'Product', function($scope, $uibModal, toaster, Product){
    $scope.model = {};
    $scope.query = {
      keyword: '',
      page: 1,
      size: 10,
      productType: '',
      orgnizationType: ''
    };

    $scope.get = function (){
      Product.productOpen($scope.query)
      .then(function (response) {
        $scope.model.openList = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
      });
    };

    $scope.get();

    $scope.openSearch = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.getPeriodShow = function (period) {
      return Product.getPeriodShow(period);
    };

    $scope.getProductType = function(productType){
      return Product.getProductTypeShow(productType);
    };

    $scope.openProductEdit = function (product) {
      var modalInstance = Product.openProductEdit(product);
      modalInstance.result.then(function (result) {
          if (result === true) {
            $scope.get();
            toaster.pop('success', '提交成功');
          }
        });
    };

    $scope.openProductOpen = function (product) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_productOpen.html',
        controller: 'ProductOpenModalCtrl',
        resolve: {
          item: function () {
            return product;
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

    $scope.openProductOpenResult = function (product) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_productOpenResult.html',
        controller: 'ProductOpenModalCtrl',
        resolve: {
          item: function () {
            return product;
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

    $scope.openProductView = function (product) {
      var modalInstance = Product.openProductView(product.productType, product.id);
      modalInstance.result.then();
    };
}]);

app.controller('FixedEditProductOpenModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Product', 'Util', function($scope, $uibModalInstance, toaster, item, Product, Util) {
    $scope.item = item;
    $scope.product = {};
    $scope.isSubmitting = false;

    var original = {};
    Product.productOne($scope.item.id)
      .then(function (response) {
        $scope.product = response.data; // $scope.product = Product.setGetData(response.data);
        $scope.selectedPeriod = 1;
        angular.copy($scope.product, original);
      });

    $scope.submit = function () {
      $scope.isSubmitting = true;

      Util.setRemovedValues($scope.product, original);

      var valid = true;
      $scope.product.incomeSetting.forEach(function(setting) {
        if (!Product.checkRateValidatity(setting.rates)) {
          valid = false;
        }
      });
      if (!valid) {
        toaster.pop('error', '阶梯利益设置不正确');
        return;
      }

      Product.productUpt($scope.product)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function (res) {
          $scope.isSubmitting = false;
          // toaster.pop('error', '提交失败');
          toaster.pop('error', res.data.message);
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.addIncomeSetting = function () {
      $scope.product.incomeSetting.push({
        anualRatePeriod: undefined,
        purchaseAmount: undefined,
        rates: []
      });
    };

    $scope.deleteIncomeSetting = function (setting) {
      $scope.product.incomeSetting.forEach(function(item, index) {
        if (item === setting) {
          $scope.product.incomeSetting.splice(index, 1);
        }
      });
    };

    $scope.addRate = function (setting) {
      setting.rates.push({
        subscribeAmount: []
        // rate: 0
      });
    };

    $scope.deleteRate = function (setting,rate) {
       setting.rates.forEach(function(item, index) {
        if (item === rate) {
          setting.rates.splice(index, 1);
        }
      });
    };

    $scope.onSelectPeriod = function (value) {
      if (value === 1) {
        $scope.product.period = [0,0];
      }
      else {
        $scope.product.period = [0,0,0];
      }
    };

    $scope.isPartialEditable = function () {
      return Product.isPartialEditable($scope.product);
    }
}]);

app.controller('FloatingEditProductOpenModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Product', 'Util', function($scope, $uibModalInstance, toaster, item, Product, Util) {
    $scope.item = item;
    // $scope.submitData = {};
    // $scope.submitData.id = item.id;
    $scope.product = {};
    $scope.isSubmitting = false;

    var original = {};
    Product.productOne($scope.item.id)
      .then(function (response) {
        $scope.product = response.data; // $scope.product = Product.setGetData(response.data);
        angular.copy($scope.product, original);
      });

    $scope.submit = function () {
      $scope.isSubmitting = true;

      Util.setRemovedValues($scope.product, original);
      Product.productUpt($scope.product)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function (res) {
          $scope.isSubmitting = false;
          // toaster.pop('error', '提交失败');
          toaster.pop('error', res.data.message);
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.isPartialEditable = function () {
      return Product.isPartialEditable($scope.product);
    }
}]);

app.controller('BadAssetEditProductOpenModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Product', 'Util', function($scope, $uibModalInstance, toaster, item, Product, Util) {
    $scope.item = item;
    $scope.product = {};
    $scope.isSubmitting = false;

    var original = {};
    Product.productOne($scope.item.id)
      .then(function (response) {
        $scope.product = response.data; // $scope.product = Product.setGetData(response.data);
        angular.copy($scope.product, original);
      });

    $scope.submit = function () {
      $scope.isSubmitting = true;

      Util.setRemovedValues($scope.product, original);
      Product.productUpt($scope.product)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function (res) {
          $scope.isSubmitting = false;
          // toaster.pop('error', '提交失败');
          toaster.pop('error', res.data.message);
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.isPartialEditable = function () {
      return Product.isPartialEditable($scope.product);
    }
}]);


app.controller('ProductOpenModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Product', function($scope, $uibModalInstance, toaster, item, Product) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData.id = item.id;

    $scope.submit = function () {
      Product.productOpenUpt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function (res) {
          // toaster.pop('error', '提交失败');
          toaster.pop('error', res.data.message);
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);

app.controller('ProductEstablishCtrl', ['$scope', '$uibModal', 'toaster', 'Product', function($scope, $uibModal, toaster, Product){
    $scope.query = {
      keyword: '',
      page: 1,
      size: 10,
      productType: '',
      orgnizationType: ''
    };
    $scope.model = {};

    $scope.get = function () {
      Product.productEstablish($scope.query)
      .then(function (response) {
        $scope.model.establishList = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
      });
    };

    $scope.get();

    $scope.establishSearch = function () {
      $scope.query.page = 1;
      $scope.get();
    };

    $scope.switchTab = function (productType) {
      $scope.query.page = 1;
      $scope.query.productType = productType;
      $scope.get();
    };

    $scope.pageChanged = function () {
      $scope.get();
    };

    $scope.getPeriodShow = function (period) {
      return Product.getPeriodShow(period);
    };

    $scope.openProductEstablish = function (product, lg) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_productEstablish.html',
        controller: 'ProductEstablishModalCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return product;
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

    $scope.openProductEdit = function (product) {
      var modalInstance = Product.openProductEdit(product);
      modalInstance.result.then(function (result) {
          if (result === true) {
            $scope.get();
            toaster.pop('success', '提交成功');
          }
        });
    };

    $scope.openProductView = function (product) {
      var modalInstance = Product.openProductView(product.productType, product.id);
      modalInstance.result.then();
    };
}]);

app.controller('ProductEstablishModalCtrl', ['$scope', '$uibModalInstance', 'item', 'toaster', 'Util', 'Product', 'Report', function($scope, $uibModalInstance,item, toaster, Util, Product, Report) {

  $scope.product = item;
  $scope.model = {};
  $scope.submitData = {};
  $scope.submitData.id = item.id;
  var today = new Date();
  $scope.submitData.establishDate = Util.getDate(today);

  Report.subscribeReport($scope.product)
    .then(function (response) {
      $scope.model.subscribeReportList = response.data.data;
    });

  $scope.getPeriodShow = function (period) {
    return Product.getPeriodShow(period);
  };

  $scope.getPeriodTypeShow = function (period) {
    return Util.getProductPeriodTypeShow(period);
  };

  $scope.getSubscribeLevelShow = function (level) {
    return Util.getSubscribeLevelShow(level);
  }

  $scope.submit = function () {
    Product.productEstablishUpt($scope.submitData)
      .then(function () {
        $uibModalInstance.close(true);
      })
      .catch(function (res) {
        // toaster.pop('error', '提交失败');
        toaster.pop('error', res.data.message);
      });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);


// app.controller('FixedProductEstablishModalCtrl', ['$scope', '$uibModalInstance', 'item', 'toaster', 'Util', 'Product', function($scope, $uibModalInstance,item, toaster, Util, Product) {
//     $scope.item = item;
//     $scope.submitData = {};
//     $scope.submitData.id = item.id;
//     var today = new Date();
//     $scope.submitData.establishDate = Util.getDate(today);

//     Product.productEstablishDetails($scope.item)
//       .then(function (response) {
//         $scope.product = response.data;
//         $scope.submitData.repayDateList = $scope.product.repayDateList;
//         // for(var i=0; i<$scope.product.repayDateList.length; i++){
//         //   $scope.submitData.repayDateList[i].repayId = $scope.product.repayDateList[i].repayId;
//         //   $scope.submitData.repayDateList[i].repayDate = $scope.product.repayDateList[i].repayDate;
//         // }
//       });

//     $scope.getPeriodShow = function (period) {
//       return Product.getPeriodShow(period);
//     };

//     $scope.getPeriodTypeShow = function (period) {
//       return Util.getProductPeriodTypeShow(period);
//     };

//     $scope.submit = function () {
//       Product.productEstablishUpt($scope.submitData)
//         .then(function () {
//           $uibModalInstance.close(true);
//         })
//         .catch(function (res) {
//           // toaster.pop('error', '提交失败');
//           toaster.pop('error', res.data.message);
//         });
//     };

//     $scope.cancel = function () {
//       $uibModalInstance.dismiss('cancel');
//     };

//     $scope.addRepayDate = function () {
//       $scope.submitData.repayDateList.push({typeShow: '收益'});
//     };

//     $scope.deleteRepayDate = function (index) {
//       $scope.submitData.repayDateList.splice(index,1);
//     };
// }]);

// app.controller('FloatingProductEstablishModalCtrl', ['$scope', '$uibModalInstance', 'item', 'toaster', 'Util', 'Product', function($scope, $uibModalInstance,item, toastr, Util, Product) {
//     $scope.item = item;
//     $scope.submitData = {};
//     $scope.submitData.id = item.id;
//     var today = new Date();
//     $scope.submitData.establishDate = Util.getDate(today);

//     Product.productEstablishDetails($scope.item)
//       .then(function (response) {
//         $scope.product = response.data;
//         $scope.submitData.repayDateList = $scope.product.repayDateList;
//         // for(var i=0; i<$scope.product.repayDateList.length; i++){
//         //   $scope.submitData.repayDateList[i].repayId = $scope.product.repayDateList[i].repayId;
//         //   $scope.submitData.repayDateList[i].repayDate = $scope.product.repayDateList[i].repayDate;
//         // }
//       });

//     $scope.getPeriodShow = function (period) {
//       return Product.getPeriodShow(period);
//     };

//     $scope.submit = function () {
//       Product.productEstablishUpt($scope.submitData)
//         .then(function () {
//           $uibModalInstance.close(true);
//         })
//         .catch(function (res) {
//           // toaster.pop('error', '提交失败');
//           toaster.pop('error', res.data.message);
//         });
//     };

//     $scope.cancel = function () {
//       $uibModalInstance.dismiss('cancel');
//     };

//     $scope.addRepayDate = function () {
//       $scope.submitData.repayDateList.push({typeShow: '收益'});
//     };

//     $scope.deleteRepayDate = function (index) {
//       $scope.submitData.repayDateList.splice(index,1);
//     };
// }]);

app.controller('ProductNetworthSettingCtrl', ['$scope', '$uibModal', 'toaster', 'Product', function($scope, $uibModal, toaster, Product){
  $scope.query = {
    keyword: '',
    page: 1,
    size: 10,
    productType: '',
    orgnizationType: ''
  };
  $scope.model = {};

  $scope.get = function () {
    Product.networthSetting($scope.query)
    .then(function(response){
      $scope.model.networthSettingList = response.data.data;
      $scope.totalItems = response.data.pageBean.totalCount;
    });
  };

  $scope.get();

  $scope.networthSettingSearch = function () {
    $scope.query.page = 1;
    $scope.get();
  };

  $scope.pageChanged = function () {
    $scope.get();
  };

  $scope.addNetworth = function (networth) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_productAddNetworth.html',
        controller: 'ProductAddNetworthModalCtrl',
        resolve: {
          item: function () {
            return networth;
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

  $scope.networthHistory = function (networth) {
    var modalInstance = $uibModal.open({
      templateUrl: 'tpl/modal/modal_productNetworthHistory.html',
      controller: 'ProductNetworthHistoryModalCtrl',
      resolve: {
        item: function(){
          return networth;
        }
      }
    });
    modalInstance.result.then();
  };
}]);

app.controller('ProductAddNetworthModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Product', 'Util', function($scope, $uibModalInstance, toaster, item, Product, Util) {
    $scope.item = item;
    $scope.newNetworth = {};
    $scope.newNetworth.id = item.id;
    $scope.newNetworth.networth = 0;
    $scope.newNetworth.adjustedNetworth = 0;
    $scope.totalAmount = 0;
    var today = new Date();
    $scope.newNetworth.networthDate = Util.getDate(today);


    $scope.onAdd = function () {
      Product.addNetworth($scope.newNetworth)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function (res) {
          // toaster.pop('error', '提交失败');
          toaster.pop('error', res.data.message);
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.totalAmountChanged = function () {
      $scope.newNetworth.networth = $scope.totalAmount / ($scope.item.share * 1.0);
    };

    $scope.networthChanged = function () {
      $scope.totalAmount = $scope.newNetworth.networth * $scope.item.share;
    };
}]);

app.controller('ProductNetworthHistoryModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Product', function($scope, $uibModalInstance, toaster, item, Product) {
    $scope.item = item;
    $scope.query = {
      page: 1,
      size: 10
    };
    $scope.model = {};

    $scope.get = function () {
      Product.networthHistory($scope.item, $scope.query)
        .then(function (response) {
          $scope.model.productNetworthHistoryListOne = response.data.data;
          $scope.totalItems = response.data.pageBean.totalCount;
        });
    };

    $scope.get();

    $scope.pageChanged = function () {
        $scope.get();
    };
 }]);

app.controller('ProductDistributionCtrl', ['$scope', 'toaster', 'Product', '$uibModal', 'Util', function($scope, toaster, Product, $uibModal, Util) {
  $scope.query = {
        keyword: '',
        status: '',
        productTypes: '0,1',
        startEstablishDate: '',
        endEstablishDate: '',
        page: 1,
        size: 10
    };
  $scope.model = {};

  $scope.get = function() {
    if ($scope.query.status === -1) {
        delete $scope.query.status;
      }

      Product.products($scope.query)
          .then(function (response) {
              $scope.model.productList = response.data.data;
              $scope.totalItems = response.data.pageBean.totalCount;

          });
  };

  $scope.get();

  $scope.productListSearch = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

  $scope.openIncomeDistributionCrt = function (product) {
    var modalInstance = $uibModal.open({
      templateUrl: 'tpl/modal/modal_incomeDistributionCrt.html',
      controller: 'IncomeDistributionCrtModalCtrl',
      size: 'lg',
      resolve: {
        item: function () {
          return product;
        }
      }
    });

    modalInstance.result.then(function (result) {
      if (result === true) {
        $scope.get();
        toaster.pop('success', '分配成功');
      }
    });
  };

  // $scope.openIncomeDistributionView = function (distribution) {

  //   var modalInstance = $uibModal.open({
  //     // templateUrl: 'tpl/modal/modal_incomeDistributionView.html',
  //     // controller: 'IncomeDistributionViewModalCtrl',
  //     resolve: {
  //       item: function () {
  //         return distribution;
  //       }
  //     }
  //   });
  // };

  // $scope.getDitributionDate = function (distribution) {
  //   return distribution.distributeTime ? distribution.distributeTime : distribution.date;
  // };

  $scope.getPeriodShow = function (period) {
    return Product.getPeriodShow(period);
  };

  $scope.getDistributionTypeShow = function (type) {
    return Product.getDistributionTypeShow(type);
  };

}]);

app.controller('IncomeDistributionCrtModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Util', 'Product', 'Report', 'toaster', function($scope, $uibModalInstance, item, Util, Product, Report, toaster) {
    // $scope.distribution = item;
    $scope.product = item;
    $scope.model = {};

    var today = new Date();
    $scope.submitData = {
      distributeDate: Util.getDate(today),
      data: []
    }

    // $scope.model.totalPurchaseAmount = 0;
    $scope.model.totalToDistributeIncomeAmount = 0;
    $scope.model.totalToDistributeCapitalAmount = 0;

    // Product.incomeDistributionUserList(item.id).then(function(response) {
    //   $scope.model.incomeDistributionUserList = response.data;

    //   // 计算总的认购金额
    //   $scope.model.incomeDistributionUserList.forEach(function(user) {
    //     $scope.model.totalPurchaseAmount += user.purchaseAmount;
    //     user.captialAmount = Util.toRmbTT(user.distributeCaptialAmount);
    //     user.incomeAmount = 0; // TODO
    //   });

    //   // 不能修改总的兑付本金，只修改兑付收益
    //   $scope.$watch('model.totalToDistributeIncomeAmount', function(value) {
    //     if (typeof value === 'number') {
    //       redistributeIncome(value);
    //     }
    //   });

    // Product.incomeDistributionUserList(item.id).then(function(response) {
    //   $scope.model.incomeDistributionUserList = response.data;
    // });
    Report.subscribeReport(item, [2]).then(function(response) {
      $scope.model.purchaseRecords = response.data.data;
    });

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }

    $scope.submit = function () {
      $scope.submitData.data = [];
      $scope.submitData.distributeDate = Util.getDate($scope.submitData.distributeDate);
      $scope.model.purchaseRecords.forEach(function(user) {
        var values = {};
        values.id = user.id;
        values.captialAmount = user.captialAmount; //Util.toRmbFromTT(user.captialAmount);
        values.share = user.share;
        values.incomeAmount = user.incomeAmount;
        $scope.submitData.data.push(values);
      });

      Product.incomeDistributionCrt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function (res) {
          // toaster.pop('error', '分配失败');
          toaster.pop('error', res.data.message);
        });
    };

    // function redistributeIncome(totalToDistributeIncomeAmount) {
    //   $scope.model.incomeDistributionUserList.forEach(function(user) {
    //     if (typeof totalToDistributeIncomeAmount === 'number') {
    //       user.incomeAmount = user.purchaseAmount / $scope.model.totalPurchaseAmount * totalToDistributeIncomeAmount;
    //     }
    //   });
    // }


    $scope.getTotalToDistributeAmount = function() {
      var total = 0;
      $scope.model.purchaseRecords.forEach(function(user) {
        if ($scope.product.productType === 0) {
          total += user.captialAmount;
        } else {
          total += user.share;
        }
      });

      total = Math.round(total*1000000.0)/1000000.0; // total;
      return isNaN(total) ? '' : total;
    }

    $scope.getTotalToDistributeIncomeAmount = function() {
      var total = 0;
      $scope.model.purchaseRecords.forEach(function(user) {
        total += user.incomeAmount;
      });

      total = Math.round(total*100.0)/100.0; // total;
      return isNaN(total) ? '' : total;
    }

}]);

// app.controller('IncomeDistributionViewModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Util', 'Product', 'toaster', function($scope, $uibModalInstance, item, Util, Product, toaster) {

//   // same as ReportSubscribeDetailModalCtrl 预约认购汇总表's modal
//   //
//     $scope.item = item;
//     $scope.model = {};

//     Report.subscribeReport($scope.item)
//         .then(function(response){
//             $scope.model.subscribeReportList = response.data.data;
//         });

//     $scope.exportReportBtn = function () {
//         Report.subscribeReportDownload($scope.item);
//     };

//     $scope.getPeriodTypeShow = function(period) {
//       return Util.getProductPeriodTypeShow(period.periodType);
//     };

// }]);

// app.controller('FixedIncomeDistributionCrtModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Product', 'toaster', function($scope, $uibModalInstance, item, Product, toaster) {
//     $scope.item = item;
//     $scope.submitData = {};
//     $scope.submitData.id = $scope.item.id;

//     $scope.cancel = function () {
//       $uibModalInstance.dismiss('cancel');
//     };

//     $scope.submit = function () {
//       Product.incomeDistributionCrt($scope.submitData)
//         .then(function () {
//           $uibModalInstance.close(true);
//         })
//         .catch(function () {
//           toaster.pop('error', '创建失败');
//         });
//     };
// }]);

// app.controller('FloatingIncomeDistributionCrtModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Product', 'toaster', function($scope, $uibModalInstance, item, Product, toaster) {
//     $scope.item = item;
//     $scope.submitData = {};
//     $scope.submitData.id = $scope.item.id;
//     $scope.submitData.share = $scope.item.share;

//     $scope.cancel = function () {
//       $uibModalInstance.dismiss('cancel');
//     };

//     $scope.submit = function () {
//       Product.incomeDistributionCrt($scope.submitData)
//         .then(function () {
//           $uibModalInstance.close(true);
//         })
//         .catch(function () {
//           toaster.pop('error', '创建失败');
//         });
//     };
// }]);



app.controller('ProductDistributeRecordCtrl', ['$scope', '$stateParams', 'toaster', '$uibModal', 'Product', 'Util', function($scope, $stateParams, toaster, $uibModal, Product, Util) {
    // 收益分配审核页面
    $scope.approve = $stateParams.approve ? true : false;

    $scope.model = {};
    $scope.query = {
        name: '',
        productType: '',
        startEstablishDate: '',
        endEstablishDate: '',
        page: 1,
        size: 10
    };
    $scope.query.status = $scope.approve ? 0 : 1;

    $scope.get = function () {
        Product.incomeDistributionRecord($scope.query)
            .then(function (response) {
                $scope.model.incomeDistributionRecord = response.data.data;
                $scope.totalItems = response.data.pageBean.totalCount;
            });
    };

    $scope.get();

    $scope.getProductTypeShow = function (record) {
      return Product.getProductTypeShow(record.productType);
    };

    $scope.search = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openIncomeDistributionRecordDetail = function (record) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_incomeDistributionUserList.html',
            controller: 'IncomeDistributionUserListModalCtrl',
            resolve: {
                item: function () {
                    return record;
                },
                approve: function () {
                  return $scope.approve;
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


app.controller('IncomeDistributionUserListModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'approve', 'Product', 'Util', function($scope, $uibModalInstance, toaster, item, approve, Product, Util) {
    // 收益分配审核对话框
    $scope.approve = approve;
    $scope.model = {};

    $scope.record = item;
    $scope.submitData = { id: item.id };

    Product.incomeDistributionRecordUserList(item.id).then(function(response) {
      $scope.model.incomeDistributionUserList = response.data;
    });

    $scope.submit = function () {
      Product.incomeDistributionRecordApproveUpt($scope.submitData)
        .then(function () {
          $uibModalInstance.close(true);
        })
        .catch(function (res) {
          toaster.pop('error', res.data.message);
        });
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }
}]);

app.controller('ProductListCtrl', ['$scope', '$uibModal', 'Product', 'toaster', function ($scope, $uibModal, Product, toaster) {
    $scope.query = {
        keyword: '',
        status: '',
        productTypes: '0,1',
        orgnizationType: '',
        startCreateTime: '',
        endCreateTime: '',
        page: 1,
        size: 10
    };
    $scope.model = {};

    $scope.get = function () {
      if ($scope.query.status === -1) {
        delete $scope.query.status;
      }

      Product.products($scope.query)
          .then(function (response) {
              $scope.model.productList = response.data.data;
              $scope.totalItems = response.data.pageBean.totalCount;

          });
    };

    $scope.get();

    $scope.productListSearch = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.switchTab = function (status) {
        $scope.query.status = status;
        $scope.get();
    };

    $scope.openProductEdit = function (product) {
      var modalInstance = Product.openProductEdit(product);
      modalInstance.result.then(function (result) {
          if (result === true) {
            $scope.get();
            toaster.pop('success', '提交成功');
          }
        });
    };

    $scope.openProductView = function (product) {
      var modalInstance = Product.openProductView(product.productType, product.id);
      modalInstance.result.then();
    };

    $scope.getStatus = function (product) {
      if (product.statusShow) {
        return product.statusShow;
      } else {
        return Product.getStatusShow(product.status);
      }
    };

}]);

app.controller('ProductBadAssetListCtrl', ['$scope', '$uibModal', 'toaster', 'Product', function ($scope, $uibModal, toaster, Product) {
    $scope.query = {
        productType: 2,
        keyword: '',
        debter: '',
        startCreateTime: '',
        endCreateTime: '',
        page: 1,
        size: 10
    };
    $scope.model = {};

    $scope.get = function () {
        Product.products($scope.query)
            .then(function (response) {
                $scope.model.productList = response.data.data;
                $scope.totalItems = response.data.pageBean.totalCount;

            });
    };

    $scope.get();

    $scope.productListSearch = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };


    $scope.openProductClose = function (product) {
      var delTrue = confirm ("确认下线？");
      if (delTrue === true) {
        Product.productClose(product)
          .then(function(response){
            $scope.get();
            toaster.pop('success', '产品下线活动');
          })
          .catch(function (res) {
          // toaster.pop('error', '产品下线失败');
            toaster.pop('error', res.data.message);
          });
      }
    };

    $scope.openProductEdit = function (product) {
      var modalInstance = Product.openProductEdit(product);
      modalInstance.result.then(function (result) {
          if (result === true) {
            $scope.get();
            toaster.pop('success', '提交成功');
          }
        });
    };

    $scope.openProductView = function (product) {
        var modalInstance = Product.openProductView(product.productType, product.id);
        modalInstance.result.then();
    };

}]);

app.controller('ProductBadAssetSubscribeListModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Invest', function($scope, $uibModalInstance, toaster, item, Invest) {
    // $scope.item = item;
    // $scope.submitData = {};

}]);

