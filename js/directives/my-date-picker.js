'use strict';

app
    .directive('myDatePicker', function () {
        return{
            restrict:'E',
            templateUrl:'tpl/directives/my-date-picker.html',
            scope:{
                date: '='
            },
            controller: ['$scope', 'uibDateParser', 'Util', function ($scope, uibDateParser, Util) {

               $scope.today = function() {
                  $scope.dt = new Date();
                };
                $scope.today();

                $scope.clear = function () {
                  $scope.dt = null;
                };

                // Disable weekend selection
                $scope.disabled = function(date, mode) {
                  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
                };

                $scope.toggleMin = function() {
                  $scope.minDate = $scope.minDate ? null : new Date();
                };
                $scope.toggleMin();

                $scope.open = function($event) {
                  $event.preventDefault();
                  $event.stopPropagation();

                  $scope.opened = true;
                };

                $scope.dateOptions = {
                  formatYear: 'yy',
                  startingDay: 1,
                  class: 'datepicker'
                };

                $scope.initDate = new Date(); //new Date('2016-15-20');
                // $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
                $scope.formats = ['yyyy-MM-dd'];
                $scope.format = $scope.formats[0];

                if ($scope.date && $scope.date !== '') {
                  $scope.date = Util.getDate($scope.date); // for server returned string like "2016-06-14 00:00:00"
                  $scope.date = uibDateParser.parse($scope.date, $scope.format, new Date());
                }


            }]
        }
    });
