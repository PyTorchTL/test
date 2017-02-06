'use strict';


angular.module('app')
    .run(['Util', function (Util) {

        // Also put in signin.controller.js
        Util.getListing();
    }]);
