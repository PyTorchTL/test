'use strict';

// convert Yuan to 10k (Ten Thousand) Yuan
angular.module('app')
  .filter('rmbTT', ['Util', function(Util) {
    return function(number) {
      if (number === undefined) {
        return;
      }
      else {
        return Util.toRmbTT(number);
      }
    };
  }]);
