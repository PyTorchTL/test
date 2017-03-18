'use strict';

app
    .factory('Invest', ['$http', 'Util', function ($http, Util) {

        var service = {};

        // service.setInvestData = function (invest) {
        //     if (invest.incomeSetting) {
        //       invest.incomeSetting.forEach(function(setting){
        //         setting.rates.forEach(function(rate){
        //           rate.subscribeAmount[0] = rate.subscribeAmount[0] && Util.toRmbTT(rate.subscribeAmount[0]);
        //           rate.subscribeAmount[1] = rate.subscribeAmount[1] && Util.toRmbTT(rate.subscribeAmount[1]);
        //         });
        //       });
        //     }
        //     return invest;
        // };

        service.productSubscribe = function (query) {
            if (query.keyword === '') {
                delete query.keyword;
            }
            return $http.get('/api/v1/productSubscribe', {params: query});
        };

        service.productSubscribeCrt = function (invest) {

            var data = {};
            angular.copy(invest, data);

            data.mySubscribeAmount = Util.toRmbFromTT(data.mySubscribeAmount);

            return $http.post('/api/v1/productSubscribeCrt', data);
        };

        service.subscribeRecord = function (query, stateName) {
            query.purchaseStatus = 0;

            var url = '/api/v1/subscribeRecord';

            if (query.keyword === '') {
                delete query.keyword;
            }
            if (query.productType === '' || query.productType === '-1') {
                delete query.productType;
            }
            if (query.employeeRealName === '') {
                delete query.employeeRealName;
            }
            if (query.userRealName === '') {
                delete query.userRealName;
            }
            if (query.endSubscribeTime === '') {
                delete query.endSubscribeTime;
            }
            if (query.startSubscribeTime === '') {
                delete query.startSubscribeTime;
            }

            if (stateName) {
                if (!stateName.endsWith('all')) {
                    url += 'Employee';  // query.all = 1;
                }
            }

            return $http.get(url, {params: query});
        };

        service.cancelSubscribe = function (invest) {
            return $http.post('/api/v1/productSubscribeUpt/' + invest.id, {deleted: true});
        };

        service.productBuyCrt = function (invest) {

            var data = {};
            angular.copy(invest, data);

            data.myPurchaseAmount = Util.toRmbFromTT(data.myPurchaseAmount);

            return $http.post('/api/v1/productBuyCrt', data);
        };

        service.purchaseRecord = function (query, stateName) {
            query.purchaseStatus = 1;

            var url = '/api/v1/subscribeRecord';

            if (query.keyword === '') {
                delete query.keyword;
            }
            if (query.productType === '' || query.productType === '-1') {
                delete query.productType;
            }
            if (query.employeeRealName === '') {
                delete query.employeeRealName;
            }
            if (query.userRealName === '') {
                delete query.userRealName;
            }
            if (query.endPurchaseTime === '') {
                delete query.endPurchaseTime;
            }
            if (query.startPurchaseTime === '') {
                delete query.startPurchaseTime;
            }

            if (stateName) {
                if (!stateName.endsWith('all')) {
                    url += 'Employee'; //query.all = 1;
                }
            }


            return $http.get(url, {params: query});
        };

        service.productPurchaseApprove = function (query) {
            if (query.keyword === '') {
                delete query.keyword;
            }
            if (query.status === '' || query.status === '-1') {
                delete query.status;
            }
            if (query.productType === '' || query.productType === '-1') {
                delete query.productType;
            }
            if (query.employeeRealName === '') {
                delete query.employeeRealName;
            }
            if (query.userRealName === '') {
                delete query.userRealName;
            }
            if (query.endSubscribeTime === '') {
                delete query.endSubscribeTime;
            }
            if (query.startSubscribeTime === '') {
                delete query.startSubscribeTime;
            }
            return $http.get('/api/v1/productPurchaseApprove', {params: query});
        };

        service.productPurchaseApproveUpt = function (invest) {
            return $http.post('/api/v1/productPurchaseApproveUpt/' + invest.id, invest);
        };

        service.redeemList = function (query) {
            if (query.keyword === '') {
                delete query.keyword;
            }
            if (query.userRealName === '') {
                delete query.userRealName;
            }
            return $http.get('/api/v1/productRedeem', {params: query});
        }

        service.productRedeemAdd = function (redeem) {
            var data = {};
            angular.copy(redeem, data);

            if (data.redeemAmount) {
                data.redeemAmount = Util.toRmbFromTT(data.redeemAmount);
            }

            return $http.post('/api/v1/productRedeemCrt', data);
        }

        service.redeemApprove = function (query, statename) {
            if (query.keyword === '') {
                delete query.keyword;
            }
            if (query.userRealName === '') {
                delete query.userRealName;
            }
            if (query.redeemApproveDecision === '-1') {
                query.redeemApproveDecision = '1,2';
            }

            if (statename === 'app.invest.redeemresultlist' ) {
                return $http.get('/api/v1/productRedeemApproveEmployee', {params: query});
            } else if (statename === 'app.invest.redeemresultlistall' || statename === 'app.invest.redeemapprove') {
                return $http.get('/api/v1/productRedeemApprove', {params: query});
            }

        }

        service.productRedeemApproveUpt = function (redeem) {
            return $http.post('/api/v1/productRedeemApproveUpt/' + redeem.id, redeem);
        }

        return service;

    }]);
