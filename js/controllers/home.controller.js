'use strict';

app.controller('HomeCtrl',['$scope','$uibModal','Message','Product',function($scope,$uibModal,Message,Product){
    $scope.model = {};
    $scope.queryMessage = { size: 5 };
    $scope.queryNotice = { size: 5 };
    $scope.queryProduct = {};

    $scope.getMessage = function(){
        Message.messageReceived($scope.queryMessage)
        .then(function(response){
                $scope.model.homeMessage = response.data.data;
                $scope.totalItemsMessage = response.data.pageBean.totalCount;
            });
    };

    $scope.getMessage();

    $scope.pageChangedMessage = function() {
        $scope.getMessage();
    };

    $scope.getNotice = function(){
        Message.employeeNotice($scope.queryNotice)
            .then(function(response){
                $scope.model.homeNotice = response.data.data;
                $scope.totalItemsNotice = response.data.pageBean.totalCount;
            });
    };

    $scope.getNotice();

    $scope.pageChangedNotice = function() {
        $scope.getNotice();
    };

    $scope.queryProduct = {
        productTypes: '0,1',
        status: 2,
        hasDepart: 1,
        size: 10,
        page: 1
    };

    $scope.getProduct = function(){
        Product.products($scope.queryProduct).then(function(response){
            $scope.model.products = [];
            // $scope.model.products = _.flatten($scope.model.products);
            _.forEach(response.data.data, function (product) {
                $scope.model.products.push(product);
                if (product.childrenDepartArray) {
                    $scope.model.products = $scope.model.products.concat(product.childrenDepartArray);
                }
            })
            $scope.totalItemsProduct = response.data.pageBean.totalCount;
        });
    };
    $scope.getProduct();
    $scope.pageChangedProduct = function() {
        $scope.getProduct();
    };


    $scope.openViewMsgRec = function (message) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_viewMsgRec.html',
            controller: 'MessageModalCtrl',
            resolve: {
                item: function () {
                    return message;
                }
            }
        });
        modalInstance.result.then();
    };

    $scope.openViewNotification = function (notice) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_viewNotification.html',
            controller: 'MessageModalCtrl',
            resolve: {
                item: function () {
                    return notice;
                }
            }
        });
        modalInstance.result.then();
    };
}]);

app.controller('MessageModalCtrl', ['$scope', '$uibModalInstance', 'item', 'Message', 'toaster', function($scope, $uibModalInstance, item, Message, toaster) {
    $scope.item = item;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    Message.markRead(item);

    //$scope.submit = function () {
    //  Activity.firstReviewUpt($scope.submitData)
    //    .then(function () {
    //      $uibModalInstance.close(true);
    //    })
    //    .catch(function () {
    //      toaster.pop('error', 'Ã·Ωª ß∞‹');
    //    });
    //};
}]);
