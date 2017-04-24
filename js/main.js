'use strict';

/* Controllers */

angular.module('app')
  // .controller('AppCtrl', ['$scope', '$http', '$translate', '$localStorage', '$window', '$state', 'Util',
  //   function(              $scope,   $http,   $translate,   $localStorage,   $window ,  $state,   Util) {
  .controller('AppCtrl', ['$scope', '$rootScope', '$http', '$localStorage', '$window', 'toaster', '$timeout', '$state', 'Message', 'Util',
    function(              $scope,   $rootScope,   $http,   $localStorage,   $window ,  toaster,   $timeout,   $state,   Message,   Util) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: '般若财富', //'Angulr',
        version: '0.1.0', // '2.0.1',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // // angular translate
      // $scope.lang = { isopen: false };
      // $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      // $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      // $scope.setLang = function(langKey, $event) {
      //   // set the current lang
      //   $scope.selectLang = $scope.langs[langKey];
      //   // You can change the language during runtime
      //   $translate.use(langKey);
      //   $scope.lang.isopen = !$scope.lang.isopen;
      // };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }


      // for pagination
      $scope.maxSize = 5;

      if ($localStorage.user) {
        $scope.currentUser = $localStorage.user;
      } else {
        $scope.currentUser = { username: ''};
      }


      $scope.logout = function () {
        $http.post('/api/v1/logout')
          .then(function() {
              $state.go('access.signin');
          });
      };


      // Theming
      $scope.app.settings.navbarHeaderColor='bg-info dker';
      $scope.app.settings.navbarCollapseColor='bg-info dk';
      $scope.app.settings.asideColor='bg-dark';

      $scope.isMenuAuthorized = {
        'app.home': false,
        'app.product': false,
        'app.product.new': false,
        'app.product.discuss': false,
        'app.product.open': false,
        'app.product.establish': false,
        'app.product.networth': false,
        'app.product.distribution': false,
        'app.product.list': false,
        'app.product.badassetlist': false,
        'app.product.distributionapprove': false,
        'app.product.distributionrecord': false,
        'app.invest': false,
        'app.invest.subscribelist': false,
        'app.invest.subscriberecord': false,
        'app.invest.purchaserecord': false,
        'app.invest.purchaseapprove': false,
        'app.invest.redeemlist': false,
        'app.invest.redeemapprove': false,
        'app.invest.redeemresultlist': false,
        'app.invest.redeemresultlistall': false,
        'app.invest.subscribelistall': false,
        'app.invest.purchaserecordall': false,
        'app.customer': false,
        'app.customer.list': false,
        'app.customer.contact': false,
        'app.customer.listteam': false,
        'app.customer.contactteam': false,
        'app.customer.listall': false,
        'app.customer.listpublic': false,
        'app.customer.contactall': false,
        'app.customer.assign': false,
        'app.customer.import':false,
        'app.activity': false,
        'app.activity.new': false,
        'app.activity.firstreview': false,
        'app.activity.sign': false,
        'app.activity.finalreview': false,
        'app.activity.list': false,
        'app.activity.subscribe': false,
        'app.activity.feedback': false,
        'app.message': false,
        'app.message.notification': false,
        'app.message.list': false,
        'app.message.send': false,
        'app.report': false,
        'app.report.mydestribution': false,
        'app.report.sale': false,
        'app.report.sale.depart': false,
        'app.report.sale.all': false,
        'app.report.commission': false,
        'app.report.subscribe': false,
        'app.report.subscribe.depart': false,
        'app.report.subscribedetail': false,
        'app.report.statement': false,
        'app.report.productincomesum': false,
        'app.report.productamountsum': false,
        'app.setting': false,
        'app.setting.profile': false,
        'app.setting.password': false
      };

      var checkMenuAuthorized = function () {
        Util.checkMenuAuthorized($scope);
      };

      checkMenuAuthorized();

      $rootScope.$on('menu-keys-updated', function (event, data) {
        _.forEach($scope.isMenuAuthorized, function(n, key) {
          if (data.indexOf(key) > -1) {
            $scope.isMenuAuthorized[key] = true;
          }
          else {
            $scope.isMenuAuthorized[key] = false;
          }
        });

      });

      // $scope.isMenuAuthorized = function (key) {
      //   return true;
      //   // return Util.isMenuAuthorized(key);
      //   // return Util.isMenuAuthorized(key)
      //   //         .then(function(result){
      //   //           return result;
      //   //         });
      // };


      // $scope.settings = {
      //   'apiRootUrl': 'http://demo.iqiaorong.com/rest',
      //   // 'apiRootURL': 'http://121.40.72.110/oa',
      //   'serverRootUrl': 'http://demo.iqiaorong.com/'
      // };
      //

      function getMessage() {
        var query = {
            keyword: '',
            from: '',
            status:      '',
            startTime:   '',
            endTime:     '',
            page:        1,
            size:        10
        };

        Message.messageReceived(query)
          .then(function (response) {
            if (response && response.data.data.length > 0) {
              var message = response.data.data[0];
              if (!Message.latestMessage) {
                Message.latestMessage = message;
              } else if (Message.latestMessage.id !== message.id) {
                Message.latestMessage = message;
                toaster.pop('success', '收到新消息');
              }
            }

            $timeout(getMessage, 15000);
          })
          .catch(function() {
            $timeout(getMessage, 15000);
          })
      }

      getMessage();

      moment.locale('zh-cn');

  }]);
