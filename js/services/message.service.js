'use strict';

  app
    .factory('Message', ['$http', function ($http) {

      var service = {};
      service.latestMessage = undefined;

      service.getEmployeeListForMultiSelect = function () {
        var list = [];

        $http.get('/api/v1/employee').then(function(response){
          var departNameList = [];
          response.data.data.forEach(function(employee){
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

          response.data.data.forEach(function(employee){
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

      service.employeeNotice = function (query) {
        if(query.keyword === ''){
            delete query.keyword;
        }
        if(query.status === '' || query.status === '-1'){
            delete query.status;
        }
        if(query.startTime === ''){
            delete query.startTime;
        }
        if(query.endTime === ''){
            delete query.endTime;
        }
        return $http.get('/api/v1/employeeNotice', {params: query});
      };

      service.messageReceived = function (query) {
        if(query.title ===''){
            delete query.title;
        }
        if(query.userRealName ===''){
            delete query.userRealName;
        }
        if(query.status ==='' || query.status === '-1'){
            delete query.status;
        }
        if(query.startTime ===''){
            delete query.startTime;
        }
        if(query.endTime ===''){
            delete query.endTime;
        }
        return $http.get('/api/v1/messageReceived', {params: query});
      };

      service.messageSent = function (query) {
        return $http.get('/api/v1/messageSent', {params: query});
      };

      service.sendMessage = function (message) {
        return $http.post('/api/v1/sendMessage', message);
      };

      service.markRead = function (message) {
        if (message.status === 1) {
          return;
        }

        return $http.post('/api/v1/updateMessage/' + message.id, { status: 1}).then(function() {
          message.status = 1;
        })
      }

      return service;

    }]);
