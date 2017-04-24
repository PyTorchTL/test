'use strict';

app.controller('UserListCtrl', ['$scope', '$state', 'toaster', '$uibModal', 'Customer', 'Employee', 'Util', function($scope, $state, toaster, $uibModal, Customer, Employee, Util) {
    $scope.model = {};
    $scope.query = {
        name: '',
        customType: '',
        // customRisk: '',
        // customSource: '',
        employeeRealName: '',
        departName: '',
        followUp: '',
        startContactTime: '',
        endContactTime: '',
        page: 1,
        size: 10
      };

    Employee.all()
      .then(function(result) {
        $scope.model.employees = angular.copy(result.employees);
        $scope.model.employees = _.sortBy($scope.model.employees, ['realNamePy']);
        $scope.model.employees.unshift({
          realName: '全部'
        });
      });

    $scope.get = function () {
      Customer.user($scope.query, $state.current.name)
        .then(function (response) {
            $scope.model.user = response.data.data;
            $scope.totalItems = response.data.pageBean.totalCount;
        });
    };

    $scope.get();

    $scope.search = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openUserCrt = function (lg) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_userCrt.html',
        controller: 'UserCrtModalCtrl',
        size:        'lg'
      });

      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '新建成功');
        }
      });
    };

    $scope.openViewUserCrt = function (user) {
      Customer.openCustomerView(user);
    };

    $scope.openChangeUserCrt = function (user, lg) {
      // user.birthday = Util.getDate(user.birthday);

      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_changeUserCrt.html',
        controller: 'ChangeUserCrtModalCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return user;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '修改成功');
        }
      });
    };

    $scope.openUserContactCrt = function (user) {
      var conf = {
        templateUrl: 'tpl/modal/modal_contactCrt.html',
        controller: 'ContactCrtModalCtrl',
        // size: 'lg'
      };
      // if (user) {
        conf.resolve = {
            user: function () {
                return user;
            }
        };
      // }
      var modalInstance = $uibModal.open(conf);

      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '新建成功');
        }
      });
    };

    $scope.openTakeUser = function (user, myId) {
      var r = confirm("确认将该用户纳入囊中吗？");
      if (r === true) {
        Customer.takeUser (user)
         .then(function (response) {
            $scope.get();
            toaster.pop('success', '成功');
          });
       }
    };

    $scope.openAbandonUser = function (user) {
      var r = confirm("确认放弃该用户吗？");
      if (r === true) {
        Customer.abandonUser (user)
         .then(function (response) {
            $scope.get();
            toaster.pop('success', '成功');
          });
       }
    };

    $scope.openViewContacts = function (user) {
      var modalInstance = $uibModal.open({
          templateUrl: 'tpl/modal/modal_viewContacts.html',
          controller: 'ViewContactsModal',
          size: 'lg',
          resolve: {
            item: function () {
              return user.id
            }
          }
        });
      modalInstance.result.then();
    };

    $scope.openDeleteUserCtr = function (user) {
      var r = confirm("确认删除吗？");
      if (r === true) {
        Customer.userDel (user)
         .then(function (response) {
            $scope.get();
            toaster.pop('success', '删除成功');
          });
       }
    };

    $scope.openViewBillReport = function (user, lg) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_reportBill.html',
        controller: 'ReportBillModalCtrl',
        size: 'lg',
        resolve: {
          item: function () {
            return {
                user: user
            };
          }
        }
      });
      modalInstance.result.then();
    };

    $scope.getOperationMenuType = function () {
      var stateName = $state.current.name;
      if ($state.current.name === 'app.customer.list') {
        return 1;
      } else if ($state.current.name === 'app.customer.listpublic') {
        return 2;
      } else {
        return 3;
      }
    };
}]);

app.controller('UserCrtModalCtrl', ['$scope', '$uibModalInstance', 'Customer', 'Util', 'toaster', function($scope, $uibModalInstance, Customer, Util, toaster) {
    $scope.user = {};

    $scope.areaList = [];
    Customer.getAreaList().then(function(response){
      $scope.areaList = response.data.provinces;
    });

    $scope.populateCities = function () {
      var province = _.find($scope.areaList, {"name": $scope.user.province.name});
      $scope.cityList = province.cities || [];
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      if ($scope.user.province) {
        $scope.user.province = $scope.user.province.name;
      }
      if ($scope.user.city) {
        $scope.user.city = $scope.user.city.name;
      }
      // $scope.user.birthday = Util.getDate($scope.user.birthday);

      Customer.userCrt($scope.user)
      .then(function () {
        $uibModalInstance.close(true);
      })
      .catch(function (res) {
        // toaster.pop('error', '新建失败');
        toaster.pop('error', res.data.message);
      });
    };
}]);

app.controller('ChangeUserCrtModalCtrl', ['$scope', '$uibModalInstance', 'Customer', 'item', 'toaster', 'Util', function($scope, $uibModalInstance, Customer, item, toaster, Util) {
    $scope.user = {};
    angular.copy(item, $scope.user);

    $scope.areaList = [];
    Customer.getAreaList().then(function(response){
      $scope.areaList = response.data.provinces;
      $scope.user.province = _.find($scope.areaList, {"name": $scope.user.province});
      $scope.populateCities();
      $scope.user.city = _.find($scope.cityList, {"name": $scope.user.city});
    });

    $scope.populateCities = function () {
      var province;
      if ($scope.user.province) {
        province = _.find($scope.areaList, {"name": $scope.user.province.name});
      }

      if (province) {
        $scope.cityList = province.cities || [];
      }
      else {
        $scope.cityList = [];
      }
    };


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      if ($scope.user.province) {
        $scope.user.province = $scope.user.province.name;
      }
      if ($scope.user.city) {
        $scope.user.city = $scope.user.city.name;
      }
      // $scope.user.birthday = Util.getDate($scope.user.birthday);

      Customer.userUpt($scope.user)
      .then(function () {
        $uibModalInstance.close(true);
      })
      .catch(function (res) {
        // toaster.pop('error', '新建失败');
        toaster.pop('error', res.data.message);
      });
    };
}]);

app.controller('ViewUserCrtModalCtrl', ['$scope', '$uibModalInstance', 'Customer', 'item', 'toaster', function($scope, $uibModalInstance, Customer, item, toaster) {
    $scope.item = item;

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);


app.controller('ViewContactsModal', ['$scope', '$state', 'toaster', '$uibModal', 'item', 'Customer', function($scope, $state, toaster, $uibModal, item, Customer) {
    $scope.model = {};
    $scope.query = {
      userId: item,
      page: 1,
      size: 10
    };

    $scope.get = function(){
    Customer.userContact($scope.query, $state.current.name)
      .then(function (response) {
        $scope.model.userContact = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
      });
    };

    $scope.get();

    $scope.pageChanged = function(){
        $scope.get();
    };
}]);

app.controller('UserContactsCtrl', ['$scope', '$state', 'toaster', '$uibModal', 'Customer', 'Employee', function($scope, $state, toaster, $uibModal, Customer, Employee) {
    $scope.model = {};
    $scope.query = {
      name: '',
      employeeRealName: '',
      startTime: '',
      endTime: '',
      nextStartTime: '',
      nextEndTime: '',
      page: 1,
      size: 10
    };

    // $scope.model.employees = Employee.all().employees;
    Employee.all()
      .then(function(result) {
        $scope.model.employees = angular.copy(result.employees);
        $scope.model.employees = _.sortBy($scope.model.employees, ['realNamePy']);
        $scope.model.employees.unshift({
          realName: '全部'
        });
      });

    $scope.get = function(){
    Customer.userContact($scope.query, $state.current.name)
      .then(function (response) {
        $scope.model.userContact = response.data.data;
        $scope.totalItems = response.data.pageBean.totalCount;
      });
    };

    $scope.get();

    $scope.search = function(){
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function(){
        $scope.get();
    };

    $scope.openUserCrt = function (lg) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_userCrt.html',
        controller: 'UserCrtModalCtrl',
        size:        lg
      });

      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '新建成功');
        }
      });
    };

    $scope.openUserContactCrt = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_contactCrt.html',
        controller: 'ContactCrtModalCtrl'
      });

      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '新建成功');
        }
      });
    };

    $scope.openViewContactCrt = function (user) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_viewContactCrt.html',
            controller: 'ViewContactCrtModalCtrl',
            size: 'lg',
            resolve: {
                item: function () {
                    return user;
                }
            }
        });
        modalInstance.result.then();

        // modalInstance.result.then(function (result) {
        //     if (result === true) {
        //         toaster.pop('success', '新建成功');
        //     }
        // });
    };

    $scope.openChangeContactCrt = function (user) {
        var modalInstance = $uibModal.open({
            templateUrl: 'tpl/modal/modal_changeContactCrt.html',
            controller: 'ChangeContactCrtModalCtrl',
            resolve: {
                item: function () {
                    return user;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (result === true) {
              $scope.get();
              toaster.pop('success', '新建成功');
            }
        });
    };

    $scope.openDeleteContactCtr = function (user) {
        var r = confirm("确认删除吗？");
        if (r === true) {
            Customer.userContactDel(user)
                .then(function (response) {
                    $scope.get();
                    toaster.pop('success', '删除成功');
                });
        }
    };

    $scope.getOperationMenuType = function () {
      var stateName = $state.current.name;
      if ($state.current.name === 'app.customer.contact') {
        return 1;
      } else { // 'app.customer.contactall' || 'app.customer.contactteam'
        return 2;
      }
    };
}]);

app.controller('ContactCrtModalCtrl', ['$scope', '$uibModalInstance', 'Customer', 'toaster', 'Util', 'user', function($scope, $uibModalInstance, Customer, toaster, Util, user) {
    $scope.contact = {};
    $scope.query = {};
    $scope.model = {};
    $scope.model.selectedCustomer = undefined; //[];

    //defaults
    $scope.contact.contractDate = Util.getCurrentDateTime();
    $scope.contact.contractType = 1;
    $scope.contact.followUp = 1;

    //typeahead-dropdown config
    // $scope.ex1config = { modelLabel: "id", optionLabel: "realName" };

    // Customer.user($scope.query)   // TODO: do not get user list each time opening this modal
    Customer.allUser()  // TODO: get only my users, not all users
      .then(function(response){
        $scope.model.userList = response.data.data;
        if (user) {
          $scope.model.selectedCustomer = _.find($scope.model.userList, {id: user.id});
        }
      });

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      // var user = _.find($scope.model.userList, {id: parseInt($scope.contact.userId,10)});
      if ($scope.model.selectedCustomer &&
          $scope.model.selectedCustomer.realName &&
          $scope.model.selectedCustomer.realName !== '') {
        $scope.contact.userId = $scope.model.selectedCustomer.id;
      } else {
        toaster.pop('info', '请选择客户');
        return;
      }

      if ($scope.contact.warnSms || $scope.contact.warnEmail || $scope.contact.warnOther) {
        $scope.contact.warnFlg = 1;
      } else {
        $scope.contact.warnFlg = 0;
      }

      if ($scope.contact.warnDate) { // 如果设置下次联系时间
        $scope.contact.status = 2;
      } else {
        $scope.contact.status = 1;
      }

      // $scope.contact.employeeId = user.employeeId;  // server will assign current user?
      Customer.userContactCrt($scope.contact)
      .then(function () {
        $uibModalInstance.close(true);
      })
      .catch(function (res) {
        // toaster.pop('error', '新建失败');
        toaster.pop('error', res.data.message);
      });
    };
}]);

app.controller('ViewContactCrtModalCtrl', ['$scope', '$uibModalInstance', 'Customer', 'item', 'toaster', function($scope, $uibModalInstance, Customer, item, toaster) {
    $scope.item = item;
}]);

app.controller('ChangeContactCrtModalCtrl',['$scope', '$uibModalInstance', 'Customer', 'item', 'toaster', function($scope, $uibModalInstance, Customer, item, toaster){
    $scope.item = item;
    $scope.submitData = {};
    // $scope.submitData.id = $scope.item.id;
    // // $scope.submitData.employeeId = $scope.item.employeeId;
    // $scope.submitData.contractType = $scope.item.contractType;
    // $scope.submitData.contractDate = $scope.item.contractDate;
    // $scope.submitData.content = $scope.item.content;
    // $scope.submitData.status = $scope.item.status;
    // $scope.submitData.warnFlg = $scope.item.warnFlg;
    // $scope.submitData.warnMsg = $scope.item.warnMsg;
    // $scope.submitData.warnSms = $scope.item.warnSms;
    // $scope.submitData.warnEmail = $scope.item.warnEmail;
    // $scope.submitData.warnOther = $scope.item.warnOther;
    // $scope.submitData.warnDate = $scope.item.warnDate;
    angular.copy($scope.item, $scope.submitData);

    $scope.cancel = function(){
        $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {
      if ($scope.submitData.warnSms || $scope.submitData.warnEmail || $scope.submitData.warnOther) {
        $scope.submitData.warnFlg = 1;
      } else {
        $scope.submitData.warnFlg = 0;
      }

      if ($scope.submitData.warnDate) { // 如果设置下次联系时间
        $scope.submitData.status = 2;
      } else {
        $scope.submitData.status = 1;
      }

        Customer.userContactUpt($scope.submitData)
            .then(function () {
                $uibModalInstance.close(true);
            })
            .catch(function (res) {
              // toaster.pop('error', '更改失败');
              toaster.pop('error', res.data.message);
            });
    };
}]);


app.controller('UserAssignCtrl', ['$scope', 'toaster', '$uibModal', '$state', 'Customer', function($scope, toaster, $uibModal, $state, Customer) {
    $scope.model = {};
    $scope.query = {
        name: '',
        customType: '',
        customRisk: '',
        customSource: '',
        employeeRealName: '',
        page: 1,
        size: 10
      };

    $scope.get = function () {
      Customer.user($scope.query, $state.current.name)
        .then(function (response) {
            $scope.model.user = response.data.data;
            $scope.totalItems = response.data.pageBean.totalCount;
        });
    };

    $scope.get();

    $scope.search = function () {
        $scope.query.page = 1;
        $scope.get();
    };

    $scope.pageChanged = function () {
        $scope.get();
    };

    $scope.openViewUser = function (user) {
      Customer.openCustomerView(user);
    };

    $scope.openChangeEmployee = function (user) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/modal/modal_changeUserEmployee.html',
        controller: 'ChangeUserEmployeeModalCtrl',
        resolve: {
          item: function () {
            return user;
          }
        }
      });

      modalInstance.result.then(function (result) {
        if (result === true) {
          $scope.get();
          toaster.pop('success', '修改成功');
        }
      });
    };


}]);


app.controller('ChangeUserEmployeeModalCtrl', ['$scope', '$uibModalInstance', 'Customer', 'Employee', 'item', 'toaster', function($scope, $uibModalInstance, Customer, Employee, item, toaster) {
    $scope.user = {};
    angular.copy(item, $scope.user);

    $scope.item = item;
    $scope.model = {};
    // $scope.model.employees = Employee.all().employees;
    Employee.all()
      .then(function(result) {
        $scope.model.employees = angular.copy(result.employees);
        $scope.model.employees = _.sortBy($scope.model.employees, ['realNamePy']);
      });


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.submit = function () {

      Customer.changeEmployee($scope.user)
      .then(function () {
        $uibModalInstance.close(true);
      })
      .catch(function (res) {
        // toaster.pop('error', '更改失败');
        toaster.pop('error', res.data.message);
      });
    };
}]);


app.controller('UserImportCtrl', ['$scope', 'toaster', '$uibModal', '$state', '$window', 'urls', 'Customer', 'FileUploader', function($scope, toaster, $uibModal, $state, $window, urls, Customer, FileUploader) {
    var uploadUrl = urls.apiRootURL + '/userImport';
    var uploader = $scope.uploader = new FileUploader({
        url: uploadUrl,
        removeAfterUpload: true // want to remove file from <input>, but this does not work; solution: click upload and click cancel in file browser
    });

    $scope.model = {};

    // for testing
    // $scope.model.fails = [
    //   {line: 2, error: 1},
    //   {line: 5, error: 2}
    // ];

    $scope.download = function() {
      $window.open(urls.filesRootUrl + '客户导入模板.xls');
    }

    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        $scope.model.users = response.users || [];
        $scope.model.fails = response.fails || [];

        if ($scope.model.fails.length === 0 ) {
          toaster.pop('success', '导入成功');
        } else {
          if ($scope.model.users.length === 0) {
            toaster.pop('error', '导入失败');
          } else {
            toaster.pop('error', '部分客户导入失败');
          }
        }
    };

    uploader.onErrorItem = function(fileItem, response, status, headers) {
        toaster.pop('error', '导入失败');
    };

    $scope.getErrorMessage = function(errorCode) {
      if (errorCode === 1) {
        return '手机号码已存在';
      } else { // 2
        return '身份证号码已存在';
      }
    }


}]);
