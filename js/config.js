// config

var app =
angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ])
  // .config(['$translateProvider', function($translateProvider){
  //   // Register a loader for the static files
  //   // So, the module will search missing translation tables under the specified urls.
  //   // Those urls are [prefix][langKey][suffix].
  //   $translateProvider.useStaticFilesLoader({
  //     prefix: 'l10n/',
  //     suffix: '.js'
  //   });
  //   // Tell the module what language to use by default
  //   $translateProvider.preferredLanguage('en');
  //   // Tell the module to store the language in the local storage
  //   $translateProvider.useLocalStorage();
  // }]);
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push(['$q', function ($q) {
         return {
             'request': function (config) {
                if (config.url.indexOf('/api/v1/') === 0) {
                    // config.url = 'http://localhost:1337' + config.url;  // For localhost
                    // config.url = 'http://121.40.72.110/oa' + config.url.slice(7); // For api-mock + API blueprint
                    config.url = 'http://demo.iqiaorong.com/rest' + config.url.slice(7);
                }

                return config || $q.when(config);
             }
         };
        }]);
  }]);
