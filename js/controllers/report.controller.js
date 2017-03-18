'use strict';

// 认购明细表
app.controller('ReportSalesDetailCtrl', ['$scope', 'toaster', '$state', '$uibModal', 'Report', function($scope, toaster, $state, $uibModal, Report) {
    $scope.model = {};
    $scope.query = {
        keyword: '',
        page: 1,
        size: 10
    };
    $scope.checked = {};

    $scope.get = function () {
        buildColumnsQuery();
        Report.salesDetailReport($scope.query, $state.current.name)
            .then(function (response) {
                // $scope.model.reportList = response.data.data;
                $scope.model = response.data.data;
            });
    };

    var buildColumnsQuery = function () {
        $scope.query.columns = '';
        for (var property in $scope.checked) {
          if ($scope.checked.hasOwnProperty(property) && $scope.checked[property] === true) {
            if ($scope.query.columns !== '') {
              $scope.query.columns += ',';
            }
            $scope.query.columns += property;
          }
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

    $scope.exportReportBtn = function () {
        buildColumnsQuery();
        Report.salesDetailReportDownload($scope.query, $state.current.name);
    };
}]);

app.controller('ReportCommissionCtrl', ['$scope', 'toaster', '$uibModal', 'Report', 'Product', 'Util', function($scope, toaster, $uibModal, Report, Product, Util) {
    $scope.model = {};
    $scope.query = {};
    $scope.query = {
        page: 1,
        size: 10,
        keyword: ''
    };

    var today = new Date();
    $scope.query.calcDate = Util.getDate(today);

    $scope.get = function () {
        Product.products($scope.query)
            .then(function (response) {
                $scope.model.productList = response.data.data;
            });
    };

    $scope.get();

    $scope.commissionReportSearch = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openViewCommissionReport = function (product) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_reportCommission.html',
        controller: 'ReportCommissionModalCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return {
                productId: product.id,
                calcDate: Util.getDate($scope.query.calcDate)
            };
          }
        }
      });
      modalInstance.result.then();
    };
}]);

app.controller('ReportCommissionModalCtrl', ['$scope', '$uibModalInstance', 'Report', 'item', function($scope, $uibModalInstance, Report, item) {
    $scope.item = item;
    $scope.model = {};

    $scope.query = {};
    angular.copy(item, $scope.query);

    Report.commissionReport($scope.query)
        .then(function(response){
            $scope.model.commissionReportList = response.data.data;
        });

    $scope.exportReportBtn = function () {
        $scope.query.productId = item.productId; // deleted in service
        Report.commissionReportDownload($scope.query);
    };
}]);

app.controller('ReportSubscribeSumCtrl', ['$scope', '$state', 'toaster', '$uibModal', 'Report', function($scope, $state, toaster, $uibModal, Report) {
    $scope.model = {};
    $scope.query = {};
    $scope.query.keyword = '';

    $scope.get = function () {
        Report.subscribeSumReport($scope.query, $state.current.name)
            .then(function (response) {
                $scope.model.subscribeSumList = response.data.data;
            });
    };

    $scope.get();

    $scope.subscribeSumReportSearch = function () {
        $scope.get();
    };

    $scope.exportReportBtn = function () {
        Report.subscribeSumReportDownload($scope.query, $state.current.name);
    };

    $scope.openViewSubscribeReport = function (subscribe, lg) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_reportSubscribeDetail.html',
        controller: 'ReportSubscribeDetailModalCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return subscribe;
          }
        }
      });
      modalInstance.result.then();
    };
}]);

// app.controller('ReportSubscribeDetailCtrl', ['$scope', 'toaster', '$uibModal', 'Report', 'Invest', function($scope, toaster, $uibModal, Report, Invest) {
//     $scope.model = {};
//     $scope.query = {};
//     $scope.query.keyword = '';

//     $scope.get = function () {
//         Invest.productSubscribe($scope.query)
//             .then(function (response) {
//                 $scope.model.productSubscribeList = response.data.data;
//             });
//     };

//     $scope.get();

//     $scope.subscribeDetailReportSearch = function () {
//         $scope.get();
//     };

//     $scope.openViewSubscribeReport = function (subscribe, lg) {
//       var modalInstance = $uibModal.open({
//         templateUrl: 'tpl/modal/modal_reportSubscribeDetail.html',
//         controller: 'ReportSubscribeDetailModalCtrl',
//         size: 'lg',
//         resolve: {
//           item: function () {
//             return subscribe;
//           }
//         }
//       });
//     };
// }]);

app.controller('ReportSubscribeDetailModalCtrl', ['$scope', '$uibModalInstance', 'Report', 'item', 'Util', function($scope, $uibModalInstance, Report, item, Util) {
    $scope.item = item;
    $scope.model = {};

    Report.subscribeReport($scope.item)
        .then(function(response){
            $scope.model.subscribeReportList = response.data.data;
        });

    $scope.exportReportBtn = function () {
        Report.subscribeReportDownload($scope.item);
    };

    // $scope.getPeriodTypeShow = function(period) {
    //   return Util.getProductPeriodTypeShow(period.periodType);
    // };

    $scope.getAnualRatePeriod = function(report) {
        return report.purchaseAnualRatePeriod ? report.purchaseAnualRatePeriod : report.subscribeAnualRatePeriod;
    }

    $scope.getLevelOrRate = function(report) {
        if (report.purchaseAnualRatePeriod) {
            if (report.purchaseRate) {
                return report.purchaseRate;
            } else {
                return Util.getSubscribeLevelShow(report.purchaseLevel);
            }
        } else {
            if (report.subscribeRate) {
                return report.subscribeRate;
            } else {
                return Util.getSubscribeLevelShow(report.subscribeLevel);
            }
        }
    };

}]);

app.controller('ReportBillCtrl', ['$scope', 'toaster', '$uibModal', 'Report', 'Customer', 'Util', function($scope, toaster, $uibModal, Report, Customer, Util) {
    $scope.model = {};
    $scope.query = {
        page: 1,
        size: 10
    };
    // var today = new Date();
    // $scope.query.endDate = Util.getDate(today);

    $scope.get = function () {
        // Customer.user($scope.query)
        //     .then(function (response) {
        //         $scope.model.userList = response.data.data;
        //     });
        Customer.user($scope.query, 'app.customer.listall') // get all users
        .then(function (response) {
            $scope.model.userList = response.data.data;
            $scope.totalItems = response.data.pageBean.totalCount;
        });
    };

    $scope.get();

    $scope.statementReportSearch = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openViewBillReport = function (user, lg) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_reportBill.html',
        controller: 'ReportBillModalCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return {
                user: user,
                // endDate: $scope.query.endDate, // endDate: Util.getDate($scope.query.endDate)
                // status: $scope.query.status
            };
          }
        }
      });
      modalInstance.result.then();
    };
}]);

app.controller('ReportBillModalCtrl', ['$scope', '$uibModalInstance', 'Report', 'item', 'Util', function($scope, $uibModalInstance, Report, item, Util) {
    $scope.item = item;
    $scope.model = {
        totalFixedSubscribeAmount: 0.0,
        totalFixeRedeemAmount: 0.0,
        totalFloatingSubscribeAmount: 0.0,
        totalFloatingTotalAmount: 0.0,
        totalFloatingRedeemShare: 0.0
    };

    // $scope.query = {};
    // angular.copy(item, $scope.query);
    // delete $scope.query.user;
    // // var today = new Date();
    // // $scope.query.endDate = Util.getDate(today);

    $scope.get = function () {
        // $scope.query.userId = item.user.id; // deleted in service.billReport
        Report.billReport(item.user.id)//Report.billReport($scope.query)
            .then(function(response){
                // $scope.model.billReportList = response.data.data;
                $scope.model = response.data;
            });
    };

    $scope.get();

    $scope.exportReportBtn = function () {
        // $scope.query.userId = item.user.id; // deleted in service.billReport

        Report.billReportDownload(item.user.id);//        Report.billReportDownload($scope.query);
    };

    $scope.setBtn = function () {
        $scope.get();
    };

    $scope.getTotalAmount = function (bill) {
        return (bill.share * bill.networth).toFixed(2);
    }

    // $scope.getProfit = function (bill) {
    //     return (bill.share * (bill.networth - 1)).toFixed(2);
    // }

}]);

app.controller('ReportProductIncomeSumCtrl', ['$scope', 'toaster', '$uibModal', 'Report', 'Customer', 'Util', function($scope, toaster, $uibModal, Report, Customer, Util) {

}]);


app.controller('ReportProductAmountSumCtrl', ['$scope', 'toaster', '$uibModal', 'Report', 'Customer', 'Util', function($scope, toaster, $uibModal, Report, Customer, Util) {

}]);
