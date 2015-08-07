'use strict';

  app
    .factory('Activity', ['$http', function ($http) {

      var service = {};

      service.addActivity = function (activity) {
        return $http.post('/api/v1/activityCrt', activity);
      };

      service.firstReviewList = function (query) {
        if (query.keyword === '') {
          delete query.keyword;
        }

        return $http.get('/api/v1/activityFirstReview', {params: query});
      };

      service.firstReviewUpt = function (firstReviewResult) {
        return $http.post('/api/v1/activityFirstReviewUpt/' + firstReviewResult.id, firstReviewResult);
      };

      service.signList = function (query) {
        return $http.get('/api/v1/activitySign', {params: query});
      };

      service.signUpt = function (signResult) {
        return $http.post('/api/v1/activitySignUpt/' + signResult.id, signResult);
      };

      service.finalReviewList = function (query) {
        return $http.get('/api/v1/activityFinalReview', {params: query});
      };

      service.finalReviewUpt = function (finalReviewResult) {
        return $http.post('/api/v1/activityFinalReviewUpt/' + finalReviewResult.activityId, finalReviewResult);
      };

      service.list = function (query) {
        if (query.keyword === '') {
          delete query.keyword;
        }

        return $http.get('/api/v1/myCreatedActivity', {params: query});
      };

      service.subscribeList = function (query) {
        return $http.get('/api/v1/activitySubscribe', {params: query});
      };

      service.addSubscribe = function (subscribe) {
        return $http.post('/api/v1/activitySubscribeCrt', subscribe);
      };

      service.subscribeFeedbackUpt = function (subscribe) {
        return $http.post('/api/v1/activitySubscribeFeedbackUpt/' + subscribe.id, subscribe);
      };

      return service;

    }]);
