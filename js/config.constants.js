'use strict';


angular.module('app')
    .constant('urls', {
      // serverRootUrl: "http://demo.iqiaorong.com",
      // // for report.service.js. It does not use $http hence can not automatically replace /api/v1 with api root
      // apiRootURL: 'http://demo.iqiaorong.com/rest',// 'http://panna.iqiaorong.com/rest/upfile',
      // filesRootUrl: "http://demo.iqiaorong.com/staff/files/",
      // downloadRootURL: 'http://demo.iqiaorong.com/rest/download?path=',
      // uploadURL: 'http://demo.iqiaorong.com/rest/upfile',

      // serverRootUrl: "http://panna.iqiaorong.com",
      // apiRootURL: 'http://panna.iqiaorong.com/rest',
      // filesRootUrl: "http://panna.iqiaorong.com/staff/files/",
      // downloadRootURL: 'http://panna.iqiaorong.com/rest/download?path=',
      // uploadURL: 'http://panna.iqiaorong.com/rest/upfile',


      // demo.hua3d.com
      // serverRootUrl: "http://120.26.42.214/",
      // apiRootURL: 'http://120.26.42.214/rest',
      // filesRootUrl: "http://120.26.42.214/staff/files/",
      // downloadRootURL: 'http://120.26.42.214/rest/download?path=',
      // uploadURL: 'http://120.26.42.214/rest/upfile',
      // loginURL: '/staff/angular/src/#/access/signin'

      // www.hua3d.com
      serverRootUrl: "http://120.26.215.45",
      apiRootURL: 'http://120.26.215.45/rest',
      filesRootUrl: "http://120.26.215.45/staff/files/",
      downloadRootURL: 'http://120.26.215.45/rest/download?path=',
      uploadURL: 'http://120.26.215.45/rest/upfile',
      loginURL: '/staff/#/access/signin'

    });
