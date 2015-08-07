'use strict';

  app
    .factory('Employee', ['$http', function ($http) {

      var service = {};

      var data = {
        'employees': []
      };

      service.all = function () {
        $http.get('/api/v1/employee').then(function(response){
          data.employees = response.data;
        });

        return data;
      };

      return service;

    }]);
