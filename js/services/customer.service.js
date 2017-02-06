
'use strict';

app
    .factory('Customer', ['$http', '$uibModal', 'Util', function ($http, $uibModal, Util) {

      var service = {};

      service.user = function (query, stateName) {
        if (query.name === '') {
            delete query.name;
        }
        if (query.customType === ''||query.customType === '-1') {
            delete query.customType;
        }
        // if (query.customRisk === ''||query.customRisk === '-1') {
        //     delete query.customRisk;
        // }
        // if (query.customSource === ''||query.customSource === '-1') {
        //     delete query.customSource;
        // }
        if (query.employeeRealName === '' || query.employeeRealName === '全部') {
            delete query.employeeRealName;
        }
        if (query.departName === '') {
            delete query.departName;
        }
        if (query.followUp === ''||query.followUp === '-1') {
            delete query.followUp;
        }
        if (query.phone === '') {
            delete query.phone;
        }

        if (query.buyRecord === '') {
          delete query.buyRecord;
        }

        if (!query.startContactTime) {
          delete query.startContactTime;
        } else {
          query.startContactTime = Util.getDate(query.startContactTime);
        }


        if (!query.endContactTime) {
          delete query.endContactTime;
        } else {
          query.endContactTime = Util.getDate(query.endContactTime);
        }

        if (stateName) {
          if (stateName.endsWith('birthday')) {
            query.startBirthday = Util.getDate(new Date());
            query.endBirthday = Util.getDate(moment().add(1,'weeks'));
            query.sort = 'birthday';
          } else if (stateName.endsWith('overdue')) {
            query.endNextContactTime = Util.getDate(moment().subtract(1,'days'));
            query.sort = 'nextContactTime';
          }


          var startDateKey, endDateKey;
          if (stateName.indexOf('app.customer.contacted') >= 0)  {
            startDateKey = 'startContactTime';
            endDateKey = 'endContactTime';
          } else if (stateName.indexOf('app.customer.tocontact') >= 0)  {
            startDateKey = 'startNextContactTime';
            endDateKey = 'endNextContactTime';
          } else if (stateName.indexOf('app.customer.list') >= 0)  { // list, listteam, listall
            startDateKey = 'startAddDate';
            endDateKey = 'endAddDate';
          }

          if (stateName.endsWith('today')) {
            query[startDateKey] = Util.getDate(new Date());
            query[endDateKey] = Util.getDate(new Date());
          } else if (stateName.endsWith('week')) {
            query[startDateKey] = Util.getDate(moment().startOf('week'));
            query[endDateKey] = Util.getDate(moment().endOf('week'));
          } else if (stateName.endsWith('month')) {
            query[startDateKey] = Util.getDate(moment().startOf('month'));
            query[endDateKey] = Util.getDate(moment().endOf('month'));
          }

          if (stateName === 'app.customer.listpublic') {
            return $http.get('/api/v1/userPublic', {params: query});
          } else if (stateName.indexOf('team') >= 0) {
            return $http.get('/api/v1/userTeam', {params: query});
          } else if (stateName.indexOf('all') >= 0 || stateName.indexOf('app.customer.assign') >= 0) {
            return $http.get('/api/v1/userAll', {params: query});
          } else { // stateName.indexOf('app.customer.list') >= 0
            return $http.get('/api/v1/user', {params: query});
          }
        } else {
          return $http.get('/api/v1/user', {params: query});
        }

      };

      service.allUser = function () {
        var query = {page: -1};
        return $http.get('/api/v1/user', {params: query});
      };

      service.userCrt = function (user) {
        return $http.post('/api/v1/userCrt', user);
      };

      service.userUpt = function (user) {
        if (user.verified) {
          delete user.name;
          delete user.identityId;
          delete user.verified;
        };
        return $http.post('/api/v1/userUpt/' + user.id, user);
      };

      service.userDel = function (user) {
        return $http.post('/api/v1/userUpt/'+ user.id, {deleted: true});
      };

      service.takeUser = function (user) {
        return service.changeEmployee(user, 0); // 0: 理财师为当前用户
      };

      service.abandonUser = function (user) {
        // var postUser = {};
        // angular.copy(user, postUser);
        // postUser.employeeId = null;
        // return service.changeEmployee(postUser);
        return service.changeEmployee(user, -1); // -1: 转为公海用户
      };

      service.userContact = function (query, stateName) {
        if (query.name === '') {
            delete query.name;
        }
        if (query.employeeRealName === '') {
            delete query.employeeRealName;
        }
        if (query.startTime === '') {
            delete query.startTime;
        }
        if (query.endTime === '') {
            delete query.endTime;
        }
        if (query.nextStartTime === '') {
            delete query.nextStartTime;
        }
        if (query.nextEndTime === '') {
            delete query.nextEndTime;
        }

        if (stateName) {
          if (stateName.indexOf('all') >= 0) {
           return $http.get('/api/v1/userContactAll', {params: query});
          } else if (stateName.indexOf('team') >= 0) {
           return $http.get('/api/v1/userContactTeam', {params: query});
          } else {
           return $http.get('/api/v1/userContact', {params: query});
          }
        } else {
          return $http.get('/api/v1/userContact', {params: query});
        }
      };

      service.userContactCrt = function (user) {
        return $http.post('/api/v1/userContactCrt', user);
      };

      service.userContactUpt = function (user) {
        return $http.post('/api/v1/userContactUpt/' + user.id, user);
      };

      service.userContactDel = function (user) {
        return $http.post('/api/v1/userContactUpt/'+ user.id, {deleted: true});
      };

      service.getAreaList = function () {
        return $http.get('api/area');
      };

      service.openCustomerView = function (user) {
        user.birthday = Util.getDate(user.birthday);

        var modalInstance = $uibModal.open({
          templateUrl: 'tpl/modal/modal_viewUserCrt.html',
          controller: 'ViewUserCrtModalCtrl',
          size: 'lg',
          resolve: {
            item: function () {
              return user;
            }
          }
        });
        modalInstance.result.then();

        // modalInstance.result.then(function (result) {
        //   if (result === true) {
        //     toaster.pop('success', '新建成功');
        //   }
        // });
      };

      service.changeEmployee = function (user, employeeId) {
        var employee = employeeId !== undefined ? employeeId : user.employeeId;
        return $http.post('/api/v1/userEmployeeUpt/' + user.id, {employeeId: employee});
      };

      return service;

    }]);
