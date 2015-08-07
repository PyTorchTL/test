'use strict';

app.controller('SendMessageCtrl', ['$scope', 'toaster', 'Employee', 'Message', function ($scope, toaster, Employee, Message) {

  $scope.model = {};
  // $scope.model.employees = Employee.all();

  $scope.employees = Message.getEmployeeListForMultiSelect();

  var toEmployee = [];

  $scope.onSelectionChanged = function(items) {
    if (items) {
      toEmployee = [];
      for (var i = 0; i < items.length; i++) {
        toEmployee.push(items[i].id);
      }
    }
  };


}]);
