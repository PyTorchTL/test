'use strict';

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

  app
    .factory('Util', ['$http', '$q', function ($http, $q) {

      var data = undefined;     //menu授权
      var listing = undefined;  // 配置列表

      var service = {};

      // convert 10k Yuan to Yuan
      service.toRmbFromTT = function (number) {
        return number * 10000;  // TODO: Math.round()?  2345.24 * 10000 -> 234524000.0000006?
      };

      service.toRmbTT = function (number) {
        return Math.round(number/100.0)/100.0;
      };

      // return string
      service.getDate = function (datetime) { // TODO: use getDate filter
        if (datetime === undefined) {
          return undefined;
        }

        if (typeof datetime !== 'string') {
          // return datetime.toISOString().slice(0, 10);  // Note: this does not consider timezone
          var d = new Date(datetime);
          return moment(d).format('YYYY-MM-DD');  // NOTE: this considers timezone
        }
        else {
          if (datetime === '' || !moment(datetime).isValid()) {
            return '';
          }

          return datetime.slice(0, 10);
        }
      };

      service.getCurrentDateTime = function () {
        return moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      };

      // // Check if key is in the array 'data'
      // var checkMenuKey = function (key) {
      //   return data.indexOf(key) >= 0;
      // };

      // var deferred;
      // service.isMenuAuthorized = function (key) {
      //   if (deferred) {
      //     return deferred.promise;
      //   }

      //   deferred = $q.defer();
      //   $http.get('/api/v1/employeeMenuKeys').then(function(response){
      //     data = response.data;
      //     deferred.resolve(checkMenuKey(key));
      //   });

      //   return deferred.promise;
      // };
      service.checkMenuAuthorized = function (scope) {
        $http.get('/api/v1/employeeMenuKeys').then(function(response){
          service.setMenuKeys(response.data, scope);
        });
      };

      service.getMenuKeys = function () {
        return data;
      };

      service.setMenuKeys = function (menuKeys, scope) {
        // data = _.map(menuKeys, function(m) {
        //   return {m: true};
        // });
        data = menuKeys;
        scope.$emit('menu-keys-updated', data);
      };

      var getShowContent = function(sign, keyValue){
        if (keyValue === undefined || keyValue === null) {
          return undefined;
        }

        keyValue = keyValue.toString();
        var options = _.find(listing, {sign: sign}).options;

        var item = _.find(options, {keyValue: keyValue});

        return !item ? undefined : item.name;
      };

      service.getListing = function () {
        $http.get('/api/v1/listing', { params: {
            sign: 'user_marry,user_gender,user_custom_type,user_risk_level,user_source,user_link_type,product_type,orgnization_type,operation_type,distribution_type,mortage_type,operate_status,product_risk_level,lever_rate'
          }})
          .then(function(response){
            listing = response.data;
          });
      };

      service.getShow = function(sign, keyValue) {
        // if (!listing) {
        //   // listing = [];
        //   $http.get('/api/v1/listing', { params: {
        //     sign: 'user_marry,user_gender,user_custom_type,user_risk_level,user_source,user_link_type,product_type,orgnization_type,operation_type,distribution_type,mortage_type,operate_status,product_risk_level,lever_rate'
        //   }})
        //   .then(function(response){
        //     listing = response.data;
        //     return getShowContent(sign, keyValue);
        //   });
        // }
        // else {
        //   return getShowContent(sign, keyValue);
        // }
        return getShowContent(sign, keyValue);
      };

      service.getProductPeriodTypeShow = function (periodOrType) {
        if (_.isArray(periodOrType)) {  // period []
          if(periodOrType[0]===0 && periodOrType[1]===0){
            return '天';
          }
          else{
            return '个月';
          }
        } else {
          switch (periodOrType) {  // periodType
            case 2: return '天';
            case 1:
            default: return '个月';
          }
        }
      };

      service.getLevelShow = function(level) {
        if (level === 1) {
          return '优先级';
        } else if (level === 2) {
          return '劣后级';
        } else {
          return '';
        }
      };

      // e.g., if we remove/delete model.attr in the view, model.attr === null
      //       when model is posted to server, attr is not changed
      //       So we have to manually set model.attr to 0 or '' (remove string will give '' not null)
      service.setRemovedValues = function (model, original) {
        for (var property in original) {
          if (original.hasOwnProperty(property)) {
              if (model[property] === null || model[property] === undefined) {
                if (typeof original[property] === 'number') {
                  model[property] = 0;
                }
              }
          }
        }
      };

      return service;

    }]);
