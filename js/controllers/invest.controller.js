'use strict';

app.controller('InvestSubscribeListCtrl', ['$scope', 'toaster', '$uibModal', 'Invest', 'Util', function($scope, toaster, $uibModal, Invest, Util) {
    $scope.model = {};
    $scope.query = {};
    $scope.query.keyword = '';
    $scope.query.page = 1;
    $scope.query.size = 10;

    $scope.get = function () {
      Invest.productSubscribe($scope.query)
      .then(function (response) {
        $scope.model.productSubscribeList = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
      });
    };

    $scope.get();

    $scope.getPeriodTypeShow = function (subscribe) {
      return Util.getProductPeriodTypeShow(subscribe.periodType);
    };

    $scope.investSubscribeSearch = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openSubscribe = function (invest) {
      switch (invest.productType) {
        case 0 : $scope.openFixedSubscribe(invest); break;
        case 1 : $scope.openFloatingSubscribe(invest); break;
        case 2 : $scope.openBadAssetSubscribe(invest); break;
        default: break;
      }
    };

    $scope.openFixedSubscribe = function (invest) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_addFixedInvestSubscribe.html',
        controller: 'InvestFixedSubscribeListModalCtrl',
        resolve: {
          item: function () {
            return invest;
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

    $scope.openFloatingSubscribe = function (invest) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_addFloatingInvestSubscribe.html',
        controller: 'InvestFloatingSubscribeListModalCtrl',
        resolve: {
          item: function () {
            return invest;
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

    $scope.openBadAssetSubscribe = function (invest) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_addBadAssetInvestSubscribe.html',
        controller: 'InvestBadAssetSubscribeListModalCtrl',
        resolve: {
          item: function () {
            return invest;
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

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }
}]);

app.controller('InvestFixedSubscribeListModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Customer', 'Util', 'Invest', function($scope, $uibModalInstance, toaster, item, Customer, Util, Invest) {
    $scope.item = item;
    $scope.submitData = {
      userId: '',
      mySubscribeAmount: '',
      productId: item.id
    };
    // var today = new Date();
    $scope.submitData.subscribeTime = Util.getCurrentDateTime(); //Util.getDate(today);
    $scope.model = {};
    $scope.model.selectedCustomer = undefined;//[];

    //typeahead-dropdown config
    // $scope.ex1config = { modelLabel: "id", optionLabel: "realName" };

    Customer.allUser()
      .then(function (response){
        $scope.model.customer = response.data.data;
        // $scope.model.customer = [
        //   {id: 2, realName: '中文'},
        //   {id: 3, realName: '王中四'},
        //   {id: 25, realName: 'abc'},
        //   {id: 23, realName: '张三'},
        //   {id: 213, realName: '张文中'}
        // ];
      });

    // $scope.getPeriodTypeShow = function (item) {
    //   return Util.getProductPeriodTypeShow(item.periodType);
    // };

    $scope.getAnualRateShow = function (anualRate) {
      var show = anualRate.anualRatePeriod + Util.getProductPeriodTypeShow(item.periodType);
      // if (anualRate.rates && anualRate.rates.length === 1) {
      //   show = show + ' ' + '年化收益' + anualRate.rates[0].rate + '%';
      // }
      if (anualRate.rates) {
        if (anualRate.rates.length === 1) {
          show = show + ' ' + '年化收益' + anualRate.rates[0].rate + '%';
        } else {
          for (var i = 0; i < anualRate.rates.length; i ++) {
            var rate = anualRate.rates[i];
            show = show + ' ' + Util.toRmbTT(rate.subscribeAmount[0]) + '-' + Util.toRmbTT(rate.subscribeAmount[1]) + '万(' + rate.rate + '%)';
          }
        }
      }

      return show;
    }

    $scope.submit = function () {
      // TODO: angular.element('#ex1').val() is always ''?
      if ($scope.model.selectedCustomer &&
          $scope.model.selectedCustomer.realName &&
          $scope.model.selectedCustomer.realName !== '') {
        $scope.submitData.userId = $scope.model.selectedCustomer.id;
      } else {
        toaster.pop('info', '请选择客户');
        return;
      }

      Invest.productSubscribeCrt($scope.submitData)
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

app.controller('InvestFloatingSubscribeListModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Customer', 'Util', 'Invest', function($scope, $uibModalInstance, toaster, item, Customer, Util, Invest) {
    $scope.item = item;
    $scope.submitData = {
      userId: '',
      mySubscribeAmount: '',
      subscribeLevel: '',
      productId: item.id
    };
    // var today = new Date();
    $scope.submitData.subscribeTime = Util.getCurrentDateTime(); //Util.getDate(today);
    $scope.model = {};
    $scope.model.selectedCustomer = undefined;//[];

    //typeahead-dropdown config
    // $scope.ex1config = { modelLabel: "id", optionLabel: "realName" };

    Customer.allUser()
      .then(function (response){
        $scope.model.customer = response.data.data;
      });

    $scope.submit = function () {
      if (item.leverageRatio === 0) {
        delete $scope.submitData.subscribeLevel;
      }

      if ($scope.model.selectedCustomer &&
          $scope.model.selectedCustomer.realName &&
          $scope.model.selectedCustomer.realName !== '') {
        $scope.submitData.userId = $scope.model.selectedCustomer.id;
      } else {
        toaster.pop('info', '请选择客户');
        return;
      }

      Invest.productSubscribeCrt($scope.submitData)
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

app.controller('InvestBadAssetSubscribeListModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Customer', 'Invest', function($scope, $uibModalInstance, toaster, item, Customer, Invest) {
    $scope.item = item;
    $scope.submitData = {
      userId: '',
      productId: item.id
    };
    $scope.model = {};
    $scope.model.selectedCustomer = undefined;//[];

    //typeahead-dropdown config
    // $scope.ex1config = { modelLabel: "id", optionLabel: "realName" };

    Customer.allUser()
      .then(function (response){
        $scope.model.customer = response.data.data;
      });

    $scope.submit = function () {
      if ($scope.model.selectedCustomer &&
          $scope.model.selectedCustomer.realName &&
          $scope.model.selectedCustomer.realName !== '') {
        $scope.submitData.userId = $scope.model.selectedCustomer.id;
      } else {
        toaster.pop('info', '请选择客户');
        return;
      }

      Invest.productSubscribeCrt($scope.submitData)
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

app.controller('InvestSubscribeRecordCtrl', ['$scope', '$state', 'toaster', '$uibModal', 'Invest', 'Util', function($scope, $state, toaster, $uibModal, Invest, Util) {
    $scope.model = {};
    $scope.query = {
        keyword: '',
        status: '',
        productType: '',
        employeeRealName: '',
        userRealName: '',
        startSubscribeTime: '',
        endSubscribeTime: '',
        page: 1,
        size: 10
    };

    $scope.get = function () {
        Invest.subscribeRecord($scope.query, $state.current.name)
            .then(function (response) {
                $scope.model.subscribeRecord = response.data.data;
                $scope.totalItems = response.data.pageBean.totalCount;
                //$scope.model.subscribeRecord[0].productType = 1;
            });
    };

    $scope.get();

    $scope.getPeriodTypeShow = function (invest) {
      return Util.getProductPeriodTypeShow(invest.periodType);
    };

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }

    $scope.search = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openFixedPurchase = function (invest) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_fixedPurchase.html',
        controller: 'FixedPurchaseModalCtrl',
        resolve: {
          item: function () {
            return invest;
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

    $scope.openFloatingPurchase = function (invest) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_floatingPurchase.html',
        controller: 'FloatingPurchaseModalCtrl',
        resolve: {
          item: function () {
            return invest;
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

    $scope.cancelSubscribe = function (invest) {
      var delTrue = confirm ("确认取消预约？");
      if (delTrue === true) {
        Invest.cancelSubscribe(invest)
          .then(function(response){
            $scope.get();
            toaster.pop('success', '取消预约成功');
          })
          .catch(function (res) {
             // toaster.pop('error', '取消预约失败');
            toaster.pop('error', res.data.message);
          });
      }
    };

    $scope.getSubscribeLevelShow = function(level) {
      return Util.getSubscribeLevelShow(level);
    };

}]);

app.controller('FixedPurchaseModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Invest', 'Util', function($scope, $uibModalInstance, toaster, item, Invest, Util) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData = {
      id: $scope.item.id,
      myPurchaseAmount: '',
      ratesId: '',
      purchaseTime: Util.getCurrentDateTime(),  //item.subscribeTime,
      // proof: ''
      proof: []
    };
    $scope.submitData.myPurchaseAmount = Util.toRmbTT(item.mySubscribeAmount);
    // console.log($scope.submitData.myPurchaseAmount)
    // console.log(item.mySubscribeAmount)
    // console.log(Math.round($scope.submitData.myPurchaseAmount * 10000))  // Note: $scope.submitData.myPurchaseAmount * 10000 may give 1294.000006
    // console.log($scope.submitData.myPurchaseAmount * 10000 <= item.mySubscribeAmount)
    if (item.identityId) {
      $scope.submitData.identityId = item.identityId;
    };

    $scope.getPeriodTypeShow = function (item) {
      return Util.getProductPeriodTypeShow(item.periodType);
    };

    $scope.submit = function () {
      // if ($scope.submitData.proofArray.length > 0) {
      //   $scope.submitData.proof = $scope.submitData.proofArray[0].url;
      // }

      Invest.productBuyCrt($scope.submitData)
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

app.controller('FloatingPurchaseModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Invest', 'Util', function($scope, $uibModalInstance, toaster, item, Invest, Util) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData = {
      id: $scope.item.id,
      myPurchaseAmount: '',
      purchaseTime: Util.getCurrentDateTime(),  //item.subscribeTime,
      // proof: ''
      proof: []
    };
    $scope.submitData.myPurchaseAmount = Util.toRmbTT(item.mySubscribeAmount);
    if (item.identityId) {
      $scope.submitData.identityId = item.identityId;
    };

    $scope.submit = function () {
      // if ($scope.submitData.proofArray.length > 0) {
      //   $scope.submitData.proof = $scope.submitData.proofArray[0].url;
      // }

      Invest.productBuyCrt($scope.submitData)
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

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }
}]);

app.controller('InvestPurchaseRecordCtrl', ['$scope', '$state', 'toaster', '$uibModal', 'Invest', 'Util', function($scope, $state, toaster, $uibModal, Invest, Util) {
    $scope.model = {};
    $scope.query = {
        keyword: '',
        status: '',
        productType: '',
        employeeRealName: '',
        userRealName: '',
        startSubscribeTime: '',
        endSubscribeTime: '',
        page: 1,
        size: 10
    };

    $scope.get = function () {
        Invest.purchaseRecord($scope.query, $state.current.name)
            .then(function (response) {
                $scope.model.purchaseRecord = response.data.data;
                $scope.totalItems = response.data.pageBean.totalCount;
            });
    };

    $scope.get();

    $scope.getPeriodTypeShow = function (purchaseRecord) {
      return Util.getProductPeriodTypeShow(purchaseRecord.periodType);
    };

    $scope.search = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openPurchaseRecordView = function (purchaseRecord) {
      if (purchaseRecord.productType === 0) {
        var modalInstance = $uibModal.open({
          templateUrl: 'tpl/modal/modal_fixedPurchaseRecordView.html',
          controller: 'InvestPurchaseRecordViewModelCtrl',
          resolve: {
            item: function () {
              return purchaseRecord;
            }
          }
        });

        modalInstance.result.then();
      } else if (purchaseRecord.productType === 1) {
        var modalInstance = $uibModal.open({
          templateUrl: 'tpl/modal/modal_floatingPurchaseRecordView.html',
          controller: 'InvestPurchaseRecordViewModelCtrl',
          resolve: {
            item: function () {
              return purchaseRecord;
            }
          }
        });
        modalInstance.result.then();
      }

    };

    $scope.getPurchasePeriod = function (purchaseRecord) {
      if (purchaseRecord.incomeSetting && purchaseRecord.incomeSetting.anualRatePeriod) {
        return purchaseRecord.incomeSetting.anualRatePeriod + $scope.getPeriodTypeShow(purchaseRecord);
      } else if (purchaseRecord.period && purchaseRecord.period[0]) {
        return purchaseRecord.period[0] + '月';
      } else {
        return '';
      }
    }


    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }
}]);

app.controller('InvestPurchaseRecordViewModelCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Util', function($scope, $uibModalInstance, toaster, item, Util) {
    $scope.item = item;

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }
}]);

app.controller('InvestPurchaseApproveCtrl', ['$scope', 'toaster', '$uibModal', 'Invest', 'Util', function($scope, toaster, $uibModal, Invest, Util) {
    $scope.model = {};
    $scope.query = {
        keyword: '',
        status: '',
        employeeRealName: '',
        productType: '',
        userRealName: '',
        startSubscribeTime: '',
        endSubscribeTime: '',
        page: 1,
        size: 10
    };

    $scope.get = function () {
        Invest.productPurchaseApprove($scope.query)
            .then(function (response) {
                $scope.model.productPurchaseApprove = response.data.data;
                //$scope.model.productPurchaseApprove[0].productType = 1; //for test
                $scope.totalItems = response.data.pageBean.totalCount;
            });
    };

    $scope.get();

    $scope.getPeriodTypeShow = function (purchaseRecord) {
      return Util.getProductPeriodTypeShow(purchaseRecord.periodType);
    };

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }

    $scope.search = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openFixedPurchaseApprove = function (invest) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_fixedPurchaseApprove.html',
            controller: 'FixedPurchaseApproveModalCtrl',
            resolve: {
                item: function () {
                    return invest;
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

    $scope.openFloatingPurchaseApprove = function (invest) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_floatingPurchaseApprove.html',
        controller: 'FloatingPurchaseApproveModalCtrl',
        resolve: {
          item: function () {
            return invest;
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

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }
}]);

app.controller('FixedPurchaseApproveModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Invest', 'Util', function($scope, $uibModalInstance, toaster, item, Invest, Util) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData = {
      purchaseApproveDecision: '',
      proof: item.proof,
      id: item.id
    };

    $scope.getPeriodTypeShow = function (item) {
      return Util.getProductPeriodTypeShow(item.periodType);
    };

    $scope.submit = function () {
      Invest.productPurchaseApproveUpt($scope.submitData)
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
}]);

app.controller('FloatingPurchaseApproveModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Invest', 'Util', function($scope, $uibModalInstance, toaster, item, Invest, Util) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData = {
      purchaseApproveDecision: '',
      proof: item.proof,
      id: item.id
    };

    $scope.submit = function () {
      Invest.productPurchaseApproveUpt($scope.submitData)
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


app.controller('InvestRedeemListCtrl', ['$scope', 'toaster', '$uibModal', 'Invest', 'Util', function($scope, toaster, $uibModal, Invest, Util) {
    $scope.model = {};
    $scope.query = {
        keyword: '',
        userRealName: '',
        page: 1,
        size: 10
    };

    $scope.get = function () {
        Invest.redeemList($scope.query)
            .then(function (response) {
                $scope.model.purchaseRecordList = response.data.data;
                $scope.totalItems = response.data.pageBean.totalCount;
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

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }

    $scope.openFixedRedeemAdd = function (record) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_fixedRedeemAdd.html',
            controller: 'FixedRedeemAddModalCtrl',
            resolve: {
                item: function () {
                    return record;
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

    $scope.openFloatingRedeemAdd = function (record) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_floatingRedeemAdd.html',
        controller: 'FloatingRedeemAddModalCtrl',
        resolve: {
          item: function () {
            return record;
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


    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }

}]);

app.controller('FixedRedeemAddModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Invest', 'Util', function($scope, $uibModalInstance, toaster, item, Invest, Util) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData = {
      id: $scope.item.id
    };
    $scope.submitData.redeemAmount = Util.toRmbTT(item.purchaseAmount);
    var today = new Date();
    $scope.submitData.redeemTime = Util.getDate(today);

    $scope.submit = function () {
      $scope.submitData.redeemTime = Util.getDate($scope.submitData.redeemTime);
      Invest.productRedeemAdd($scope.submitData)
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

app.controller('FloatingRedeemAddModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Invest', 'Util', function($scope, $uibModalInstance, toaster, item, Invest, Util) {
    $scope.item = item;
    $scope.submitData = {};
    $scope.submitData = {
      id: $scope.item.id
    };
    $scope.submitData.redeemShare = item.share; // Util.toRmbTT(item.purchaseAmount);
    var today = new Date();
    $scope.submitData.redeemTime = Util.getDate(today);

    $scope.submit = function () {
      $scope.submitData.redeemTime = Util.getDate($scope.submitData.redeemTime);
      Invest.productRedeemAdd($scope.submitData)
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

app.controller('InvestRedeemApproveCtrl', ['$scope', '$state', 'toaster', '$uibModal', 'Invest', 'Util', function($scope, $state, toaster, $uibModal, Invest, Util) {
    $scope.model = {};
    $scope.query = {
        keyword: '',
        userRealName: '',
        page: 1,
        size: 10
    };

    $scope.get = function () {
        Invest.redeemApprove($scope.query, $state.current.name)
            .then(function (response) {
                $scope.model.redeemList = response.data.data;
                $scope.totalItems = response.data.pageBean.totalCount;
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

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }

    $scope.openFixedRedeemApprove = function (redeem) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_fixedRedeemApprove.html',
            controller: 'FixedRedeemApproveModalCtrl',
            resolve: {
                item: function () {
                    return redeem;
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

    $scope.openFloatingRedeemApprove = function (redeem) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_floatingRedeemApprove.html',
        controller: 'FloatingRedeemApproveModalCtrl',
        resolve: {
          item: function () {
            return redeem;
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


    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }
}]);

app.controller('FixedRedeemApproveModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Invest', 'Util', function($scope, $uibModalInstance, toaster, item, Invest, Util) {
    $scope.item = item;
    $scope.submitData = {};
    // var today = new Date();
    $scope.submitData = {
      redeemApproveDecision: '',
      // redeemTime: Util.getDate(today),
      id: item.id
    };

    $scope.submit = function () {
      Invest.productRedeemApproveUpt($scope.submitData)
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

app.controller('FloatingRedeemApproveModalCtrl', ['$scope', '$uibModalInstance', 'toaster', 'item', 'Util', 'Invest', function($scope, $uibModalInstance, toaster, item, Util, Invest) {
    $scope.item = item;
    $scope.submitData = {};
    // var today = new Date();
    $scope.submitData = {
      redeemApproveDecision: '',
      // redeemTime: Util.getDate(today),
      id: item.id
    };

    $scope.submit = function () {
      Invest.productRedeemApproveUpt($scope.submitData)
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

app.controller('InvestRedeemResultListCtrl', ['$scope', '$state', 'toaster', 'Invest', 'Util', function($scope, $state, toaster, Invest, Util) {
  $scope.model = {};
    $scope.query = {
        keyword: '',
        userRealName: '',
        page: 1,
        size: 10,
        redeemApproveDecision: '-1'
    };

    $scope.get = function () {
        Invest.redeemApprove($scope.query, $state.current.name)
            .then(function (response) {
                $scope.model.redeemList = response.data.data;
                $scope.totalItems = response.data.pageBean.totalCount;
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

    $scope.getSubscribeLevelShow = function (level) {
      return Util.getSubscribeLevelShow(level);
    }

    $scope.getRedeemApproveResult = function(redeem) {
      if (redeem.redeemApproveDecision === 0) {
        return '未审核';
      } else if (redeem.redeemApproveDecision === 1) {
        return '审核通过';
      } else if (redeem.redeemApproveDecision === 2) {
        return '审核未通过';
      }
    }

}]);

