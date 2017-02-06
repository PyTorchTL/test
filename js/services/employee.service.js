'use strict';

  app
    .factory('Employee', ['$http', '$q', function ($http, $q) {

      var service = {};

      var data = {
        'employees': []
      };

      service.all = function () {
        if (data.employees.length === 0) {
          return $http.get('/api/v1/employee?page=-1').then(function(response){
            response.data.data.forEach(function(employee){
              data.employees.push(employee);
            });

            return data;
          });
        } else {
          return $q.when(data);
        }
      };

      return service;

    }]);
