'use strict';

app
    .directive('myDatetimePicker', function () {
        return {
            restrict:'E',
            templateUrl:'tpl/directives/my-datetime-picker.html',
            scope:{
                date: '=',
                dropdownId: '='
            },
            controller: ['$scope', function ($scope) {
                $scope.onTimeSet = function (newDate, oldDate) {
                    // var moment =  window.moment;
                    // moment.locale('zh-cn');
                    $scope.date = moment(newDate).format('YYYY-MM-DD HH:mm:ss');
                };
            }]
        };
    });
