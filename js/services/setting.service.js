'use strict';

app
    .factory('Setting', ['$http', function ($http) {

        var service = {};

        service.employeeUpt = function (setting) {
            return $http.post('/api/v1/employeeUpt', setting);
        };

        service.profile = function () {
            return $http.get('/api/v1/profile');
        };

        return service;

    }]);