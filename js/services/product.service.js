'use strict';

  app
    .factory('Product', ['$http', function ($http) {

      var service = {};

      service.addProduct = function (product) {
        return $http.post('/api/v1/productCrt', product);
      };

      service.productDiscussList = function (query) {
        return $http.get('/api/v1/productDiscuss', {params: query});
      };

      service.productDiscussUpt = function (product) {
        return $http.post('/api/v1/productDiscussUpt/' + product.id, product);
      };

      service.productOpen = function (query) {
        return $http.get('/api/v1/productOpen', {params: query});
      };

      service.productEstablish = function (query) {
        return $http.get('/api/v1/productEstablish', {params: query});
      };

      service.networthSetting = function (query) {
        return $http.get('/api/v1/networthSetting', {params: query});
      };

      service.addNetworth = function (networth) {
        return $http.post('/api/v1/networthCrt', networth);
      };

      service.networthHistory = function (query) {
        return $http.get('/api/v1/networthHistory', {params: query});
      };

      service.getPeriodShow = function (array) {
        if(array[0]===0 && array[1]===0){
          return array[2]+'天';
        }
        else{
          return array[0]+'月+'+array[1]+'月';
        }
      };

      service.getProductTypeShow = function (productType) {
        if(productType===0)
          return '固定类';
        else if(productType===1)
          return '浮动类';
        else
          return '金融不良资产';
      };

      service.distributionPlan = function (month, year) {
        var date = new Date();
        var m = date.getMonth();
        var y = date.getFullYear();

        var query = {};
        query.month = !month ? m : month;
        query.year = !year ? y : year;

        return $http.get('/api/v1/distributePlan', {params: query});
      };

      service.incomeDistribution = function (query) {
        return $http.get('/api/v1/incomeDistribution', {params: query});
      };

      return service;

    }]);
