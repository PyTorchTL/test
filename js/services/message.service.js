'use strict';

  app
    .factory('Message', ['$http', function ($http) {

      var service = {};

      service.getEmployeeListForMultiSelect = function () {
        var list = [];

        $http.get('/api/v1/employee').then(function(response){
          var departNameList = [];
          response.data.forEach(function(employee){
            departNameList.push(employee.departName);
          });
          departNameList = _.uniq(departNameList);

          departNameList.forEach(function(departName, index){
            list.push({
              // id: index,
              name: departName,
              children: []
            });
          });

          response.data.forEach(function(employee){
            _.find(list, {name: employee.departName}).children.push(
              {
                  id: employee.id,
                  name: employee.realName,
                  children: []
              }
            );
          });
        });

        return list;
      };


      return service;

    }]);
