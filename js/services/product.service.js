'use strict';

  app
    .factory('Product', ['$http', '$uibModal', 'Util', 'urls', function ($http, $uibModal, Util, urls) {

      // var serverRootUrl = "http://demo.iqiaorong.com/images";

      var service = {};

      var setPostData = function (original) {
        var product = {};
        angular.copy(original, product);

        if (product.period) {
          product.period.forEach(function(elem, index){
            product.period[index] = parseInt(elem);
          });
        }

        product.minPurchaseAmount = Util.toRmbFromTT(product.minPurchaseAmount);
        product.amount = Util.toRmbFromTT(product.amount);
        if (product.incomeSetting) {
          product.incomeSetting.forEach(function(setting){
            setting.rates.forEach(function(rate){
              rate.subscribeAmount[0] = Util.toRmbFromTT(rate.subscribeAmount[0]);
              rate.subscribeAmount[1] = Util.toRmbFromTT(rate.subscribeAmount[1]);
            });
          });
        }
        product.loanAmount = Util.toRmbFromTT(product.loanAmount);
        product.recievedCapital = Util.toRmbFromTT(product.recievedCapital);
        product.loanInterest = Util.toRmbFromTT(product.loanInterest);
        product.mortageValue = Util.toRmbFromTT(product.mortageValue);
        product.transferPrice = Util.toRmbFromTT(product.transferPrice);

        return product;
      };

      service.setGetData = function (product) {
        product.minPurchaseAmount = product.minPurchaseAmount && Util.toRmbTT(product.minPurchaseAmount);
        product.amount = product.amount && Util.toRmbTT(product.amount);
        if (product.incomeSetting) {
          product.incomeSetting.forEach(function(setting){
            setting.rates.forEach(function(rate){
              rate.subscribeAmount[0] = rate.subscribeAmount[0] && Util.toRmbTT(rate.subscribeAmount[0]);
              rate.subscribeAmount[1] = rate.subscribeAmount[1] && Util.toRmbTT(rate.subscribeAmount[1]);
            });
          });
        }
        product.loanAmount = product.loanAmount && Util.toRmbTT(product.loanAmount);
        product.recievedCapital = product.recievedCapital && Util.toRmbTT(product.recievedCapital);
        product.loanInterest = product.loanInterest && Util.toRmbTT(product.loanInterest);
        product.mortageValue = product.mortageValue && Util.toRmbTT(product.mortageValue);
        product.transferPrice = product.transferPrice && Util.toRmbTT(product.transferPrice);

        return product;
      };

      service.addProduct = function (prod) {
        var product = setPostData(prod);

        return $http.post('/api/v1/productCrt', product);
      };

      service.products = function (query) {
        if (query.keyword === '') {
            delete query.keyword;
        }
        if (query.status === '' || (query.status === '-1')) {
            delete query.status;
        }
        if ((query.productType === '') || (query.productType === '-1')) {
            delete query.productType;
        }
        if (query.orgnizationType === '' || query.orgnizationType === '-1') {
            delete query.orgnizationType;
        }

        if (!query.startSubscribeTime) {
            delete query.startSubscribeTime;
        } else {
          query.startSubscribeTime = Util.getDate(query.startSubscribeTime);
        }

        if (!query.endSubscribeTime) {
          delete query.endSubscribeTime;
        } else {
          query.endSubscribeTime = Util.getDate(query.endSubscribeTime);
        }

        if (!query.startCreateTime) {
            delete query.startCreateTime;
        } else {
          query.startCreateTime = Util.getDate(query.startCreateTime);
        }

        if (!query.endCreateTime) {
          delete query.endCreateTime;
        } else {
          query.endCreateTime = Util.getDate(query.endCreateTime);
        }

        // query.startSubscribeTime = Util.getDate(query.startSubscribeTime);
        // if (query.startSubscribeTime === '') {  // not in api ??
        //     delete query.startSubscribeTime;
        // }

        // query.endSubscribeTime = Util.getDate(query.endSubscribeTime);
        // if (query.endSubscribeTime === '') { // not in api??
        //     delete query.endSubscribeTime;
        // }

        // query.endCreateTime = Util.getDate(query.endCreateTime);
        // if (query.endCreateTime === "") {
        //   delete query.endCreateTime;
        // }

        // query.startCreateTime = Util.getDate(query.startCreateTime);
        // if (query.startCreateTime === "") {
        //   delete  query.startCreateTime;
        // }

        if (query.debter === '') {
          delete query.debter;
        }
        if (query.regionCategory === '') {
          delete query.regionCategory;
        }

        // if (query.productTypes) {
        //   var count = 0;
        //   query.productTypes.forEach(function(type){
        //     query['productTypes[' + count + ']'] = type;
        //     count++;
        //   });
        //   delete query.productTypes;
        // }
        if (!query.productTypes || query.productTypes === '') {
          delete query.productTypes;
        }

        return $http.get('/api/v1/product', {params: query});
      };

      service.productUpt = function (prod) {
        var product = setPostData(prod);

        return $http.post('/api/v1/productUpt/' + product.id, product);
      };

      service.productOne = function (id) {
        return $http.get('/api/v1/product/' + id);
      };

      service.productDiscussList = function (query) {
        if (query.keyword === '') {
            delete query.keyword;
        }
        if ((query.productType === '')||(query.productType === '-1')) {
          delete query.productType;
        }
        if (query.orgnizationType === ''||query.orgnizationType === '-1') {
          delete query.orgnizationType;
        }
        return $http.get('/api/v1/productDiscuss', {params: query});
      };

      service.productDiscussUpt = function (product) {
        return $http.post('/api/v1/productDiscussUpt/' + product.id, product);
      };

      service.productOpen = function (query) {
        if (query.keyword === '') {
            delete query.keyword;
        }
        if (query.productType === ''|| query.productType === '-1') {
          delete query.productType;
        }
        if (query.orgnizationType === ''|| query.orgnizationType === '-1') {
          delete query.orgnizationType;
        }
        return $http.get('/api/v1/productOpen', {params: query});
      };

      service.productOpenUpt = function (product) {
        var productId = product.id;
        delete product.id;
        return $http.post('/api/v1/productOpenUpt/' + productId, product);
      };

      service.productEstablish = function (query) {
        if(query.keyword === '') {
            delete query.keyword;
        }
        if ((query.productType === '')||(query.productType === '-1')) {
          delete query.productType;
        }
        if (query.orgnizationType === ''||query.orgnizationType === '-1') {
          delete query.orgnizationType;
        }
        return $http.get('/api/v1/productEstablish', {params: query});
      };

      service.networthSetting = function (query) {
        if(query.keyword === ''){
            delete query.keyword;
        }
        if ((query.productType === '')||(query.productType === '-1')) {
          delete query.productType;
        }
        if (query.orgnizationType === ''||query.orgnizationType === '-1') {
          delete query.orgnizationType;
        }
        return $http.get('/api/v1/networthSetting', {params: query});
      };

      service.addNetworth = function (networth) {
        networth.networthDate = Util.getDate(networth.networthDate);
        var id = networth.id;
        delete networth.id;
        return $http.post('/api/v1/networthCrt/' + id, networth);
      };

      service.networthHistory = function (product, query) {
        return $http.get('/api/v1/networthHistory/' + product.id, {params: query});
      };

      service.getPeriodShow = function (array) {
        if (!array) {
          return;
        }

        if(array[0]===0 && array[1]===0){
          return array[2]+'天';
        }
        else{
          if(array[1] !==0 )
            return array[0]+'月+'+array[1]+'月';
          else
            return array[0]+'月';
        }
      };

      service.getProductTypeShow = function (productType) {
        if (productType === 0)
          return '固定类';
        else if (productType === 1)
          return '浮动类';
        else if (productType === 2) {
          return '金融不良资产';
        }
        else
          return '';
      };

      // /product returns statusShow
      service.getStatusShow = function (status) {
        switch (status) {
          case 1: return '待上线';
          case 2: return '募集期';
          case 3: return '待成立';
          case 4: return '存续期';
          case 5: return '展期中';
          case 6: return '已兑付';
          case 7: return '已下线';
          case 11: return '过会失败';
          case 12: return '上线失败';
          case 13: return '成立失败';
          default: return '';
        }
      };

      service.getDistributionTypeShow = function (type) {
        switch (type) {
          case 0: return '到期一次性支付';
          case 1: return '经过季度分配';
          case 2: return '经过半年度分配';
          case 3: return '经过九个月分配';
          case 4: return '经过年度分配';
          case 5: return '自然季度分配';
          case 6: return '自然半年度分配';
          case 7: return '自然年度分配';
          case 8: return '随收随付';
          default: return '';
        }
      };

      service.distributionPlan = function (month, year) {
        var date = new Date();
        var m = date.getMonth();
        var y = date.getFullYear();

        var query = {};
        query.month = month === undefined ? m : month;
        query.month = query.month + 1;  // 1 for 1月
        query.year = year === undefined ? y : year;

        return $http.get('/api/v1/distributePlan', {params: query});
      };

      service.incomeDistribution = function (query) {
        if (query.name === '') {
            delete query.name;
        }
        if (query.status === '' || query.status === '-1') {
            delete query.status;
        }
        if (query.productType === '' || query.productType === '-1') {
          delete query.productType;
        }

        if (!query.startDate) {
            delete query.startDate;
        } else {
          query.startDate = Util.getDate(query.startDate);
        }

        if (!query.endDate) {
          delete query.endDate;
        } else {
          query.endDate = Util.getDate(query.endDate);
        }

        return $http.get('/api/v1/incomeDistributionPeriod', {params: query});
      };

      service.incomeDistributionRecord = function(query) {
        if (query.productId === '') {
            delete query.productId;
        }
        if (query.name === '') {
            delete query.name;
        }
        if (query.status === '' || query.status === '-1') {
            delete query.status;
        }
        if (!query.productTypes || query.productTypes === '') {
          delete query.productTypes;
        }


        if (!query.startEstablishDate) {
            delete query.startEstablishDate;
        } else {
          query.startEstablishDate = Util.getDate(query.startEstablishDate);
        }

        if (!query.endEstablishDate) {
          delete query.endEstablishDate;
        } else {
          query.endEstablishDate = Util.getDate(query.endEstablishDate);
        }

        return $http.get('/api/v1/incomeDistributionRecord', {params: query});
      }

      service.incomeDistributionRecordApproveUpt = function(record) {
        return $http.post('/api/v1/incomeDistributionRecordApproveUpt/' + record.id, record);
      }

      service.incomeDistributionUserList = function (productId) {
        return $http.get('/api/v1/incomeDistributionUserList/' + productId);
      }

      service.incomeDistributionRecordUserList = function (id) {
        return $http.get('/api/v1/incomeDistributionRecordUserList/' + id);
      }

      // service.incomeDistributionCrt = function (distribution) {

      //   // distribution.capitalAmount = Util.toRmbFromTT(distribution.capitalAmount);
      //   // distribution.incomeAmount = Util.toRmbFromTT(distribution.incomeAmount);
      //   // distribution.share = Util.toRmbFromTT(distribution.share);

      //   // return $http.post('/api/v1/incomeDistributionCrt/' + distribution.id, distribution);
      //   // return $http.post('/api/v1/incomeDistributionPeriodCrt', distribution);
      //   return $http.post('/api/v1/incomeDistributionPeriodCrt', {data: distribution});

      //   // var req = {
      //   //  method: 'POST',
      //   //  url: '/api/v1/incomeDistributionPeriodCrt',
      //   //  headers: {
      //   //    'Content-Type': undefined
      //   //  },
      //   //  data: "data=" + JSON.stringify(distribution)
      //   // }

      //   // return $http(req);
      // };
      service.incomeDistributionCrt = function (distribution) {
        return $http.post('/api/v1/incomeDistributionCrt', distribution);
      };

      service.productEstablishDetails = function (product) {
        return $http.get('/api/v1/productEstablish/' + product.id);
      };

      service.productEstablishUpt = function (product) {
        product.establishDate = Util.getDate(product.establishDate);
        // if (product.repayDateList) {
        //   product.repayDateList.forEach(function(repay) {
        //     repay.repayDate = Util.getDate(repay.repayDate);
        //   });
        // }

        return $http.post('/api/v1/productEstablishUpt/' + product.id, product);
      };

      service.productClose = function (product) {
        return $http.post('/api/v1/productCloseUpt/' + product.id);
      };

      service.getImageUrl = function (url) {
        return urls.serverRootUrl + 'images/' + url;
      };

      service.openProductEdit = function (product) {
        if (product.productType === 0) {
          return $uibModal.open({
            templateUrl: 'tpl/modal/modal_fixedEditProduct.html',
            controller: 'FixedEditProductOpenModalCtrl',
            size: 'lg',
            resolve: {
              item: function () {
                return product;
              }
            }
          });
        }
        else if(product.productType === 1) {
          return $uibModal.open({
            templateUrl: 'tpl/modal/modal_floatingEditProduct.html',
            controller: 'FloatingEditProductOpenModalCtrl',
            size: 'lg',
            resolve: {
              item: function () {
                return product;
              }
            }
          });
        }
        else if(product.productType === 2){
          return $uibModal.open({
            templateUrl: 'tpl/modal/modal_badAssetEditProduct.html',
            controller: 'BadAssetEditProductOpenModalCtrl',
            size: 'lg',
            resolve: {
              item: function () {
                return product;
              }
            }
          });
        }
      };


      service.openProductView = function (productType, productId) {
        if (productType === 0) {
          return $uibModal.open({
            templateUrl: 'tpl/modal/modal_fixedProductView.html',
            controller: 'FixedProductViewModalCtrl',
            size: 'lg',
            resolve: {
              id: function () {
                return productId;
              }
            }
          });
        }
        else if(productType === 1) {
          return $uibModal.open({
            templateUrl: 'tpl/modal/modal_floatingProductView.html',
            controller: 'FloatingProductViewModalCtrl',
            size: 'lg',
            resolve: {
              id: function () {
                return productId;
              }
            }
          });
        }
        else if(productType === 2){
          return $uibModal.open({
            templateUrl: 'tpl/modal/modal_badAssetProductView.html',
            controller: 'BadAssetProductViewModalCtrl',
            size: 'lg',
            resolve: {
              id: function () {
                return productId;
              }
            }
          });
        }
      };

      return service;

    }]);
