/**
 *  Make sure it is the first file in all .js files in this folder
 *  Otherwise concat will give error, because module 'app' is used before its created
 *  So can not name app.constant.js
 */

'use strict';


angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.utils',
    'ui.load',
    'ui.jq',
    'oc.lazyLoad',
    // 'pascalprecht.translate',
    'toaster',
    'angularFileUpload',
    'ui.bootstrap.datetimepicker',
    'udpCaptcha',
    'apg.typeaheadDropdown',
    'ngLocale'
]);
