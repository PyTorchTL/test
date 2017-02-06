'use strict';

  app
    .factory('Activity', ['$http', function ($http) {

      var service = {};

      service.addActivity = function (activity) {
        return $http.post('/api/v1/activityCrt', activity);
      };

      service.activityUpt = function (activity) {
        return $http.post('/api/v1/activityUpt/' + activity.id, activity);
      };

      service.activityDel = function (activity) {
        return $http.post('/api/v1/activityUpt/' + activity.id, {deleted: true});
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
        if(query.keyword === ''){
          delete query.keyword;
        }
        return $http.get('/api/v1/activitySign', {params: query});
      };

      service.signListOne = function (activity, query) {
        return $http.get('/api/v1/activitySign/' + activity.id, {params: query})
      };

      service.signUpt = function (signResult) {
        return $http.post('/api/v1/activitySignUpt/' + signResult.id, signResult);
      };

      service.finalReviewList = function (query) {
        if(query.keyword === ''){
          delete query.keyword;
        }
        return $http.get('/api/v1/activityFinalReview', {params: query});
      };

      service.finalReviewUpt = function (finalReviewResult) {
        return $http.post('/api/v1/activityFinalReviewUpt/' + finalReviewResult.id, finalReviewResult);
      };

      service.list = function (query) {
        if (query.keyword === '') {
          delete query.keyword;
        }

        return $http.get('/api/v1/myCreatedActivity', {params: query});
      };

      service.endActivity = function (activity) {
        return $http.get('/api/v1/endActivity/' + activity.id);
      };

      service.subscribeList = function (query) {
        if (query.keyword === '') {
          delete query.keyword;
        }
        return $http.get('/api/v1/activitySubscribe', {params: query});
      };

      service.subscribeForList = function (activity, query) {
        return $http.get('/api/v1/activitySubscribe/' + activity.activityId, {params: query});
      };

      service.addSubscribe = function (subscribe) {
        return $http.post('/api/v1/activitySubscribeCrt', subscribe);
      };

      service.activitySubscribeDel = function (subscribe) {
        return $http.post('/api/v1/activitySubscribeUpt/' + subscribe.id, {deleted:true});
      };

      service.feedbackList = function (query) {
        if(query.keyword === ''){
          delete query.keyword;
        }
        if(query.feedbackStatus === ''){
          delete query.feedbackStatus;
        }
        return $http.get('/api/v1/activitySubscribe', {params: query});
      };

      service.subscribeFeedbackUpt = function (subscribe) {
        return $http.post('/api/v1/activitySubscribeFeedbackCrt/' + subscribe.id, subscribe);
      };

      return service;

    }]);
