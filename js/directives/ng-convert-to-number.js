// Let select support integer ng-model
// https://code.angularjs.org/1.4.7/docs/api/ng/directive/select
// Binding select to a non-string value via ngModel parsing / formatting

'use strict';

app
.directive('convertToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(val) {
        return parseInt(val, 10);
      });
      ngModel.$formatters.push(function(val) {
        return '' + val;
      });
    }
  };
});
