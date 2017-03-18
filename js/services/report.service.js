'use strict';

app
    .factory('Report', ['$http', 'urls', '$window', 'Util', function ($http, urls, $window, Util) {

        var service = {};

        var setQuerySalesDetailReport = function (query) {

          if (query.keyword === '') {
            delete query.keyword;
          }
          if (query.status === '' || query.status == -1) {  // Note: not -1, but '-1'
            delete query.status;
          }
          if ((query.productType === '') || (query.productType === '-1')) {  // Note: not -1, but '-1'
            delete query.productType;
          }
          if (query.employeeId === '') {
            delete query.employeeId;
          }
          if (query.purchaseStartTime === '') {
            delete query.purchaseStartTime;
          }
          if (query.purchaseEndTime === '') {
            delete query.purchaseEndTime;
          }
          if (query.columns === '') {
            delete query.columns;
          }

          return query;
        };

        function serializeData( data ) {
            // If this is not an object, defer to native stringification.
            if ( ! angular.isObject( data ) ) {
                return( ( data == null ) ? "" : data.toString() );
            }

            var buffer = [];

            // Serialize each key in the object.
            for ( var name in data ) {
                if ( ! data.hasOwnProperty( name ) ) {
                    continue;
                }

                var value = data[ name ];

                buffer.push(
                    encodeURIComponent( name ) + "=" + encodeURIComponent( ( value == null ) ? "" : value )
                );
            }

            // Serialize the buffer and clean it up for transportation.
            var source = buffer.join( "&" ).replace( /%20/g, "+" );
            return( source );
        }

        function download (url, query) {
          // var hiddenElement = document.createElement('a');
          var querystring = serializeData(query);
          var url = urls.apiRootURL + '/' + url;
          if (querystring !== '') {
              url = url + '?' + querystring;
          }
          // // hiddenElement.href = 'data:attachment/csv,' + encodeURI(url);
          // // hiddenElement.href = 'data:attachment/xls,' + encodeURI(url);
          // hiddenElement.href = encodeURI(url);
          // hiddenElement.target = '_blank';
          // // hiddenElement.download = 'myFile.csv';
          // hiddenElement.click();

          // $http.get('/api/v1/' + url).then(function(res){
          //   if (window.navigator.msSaveOrOpenBlob) {
          //    var blob = new Blob([decodeURIComponent(encodeURI(res.data))], {
          //      type: "application/vnd.ms-excel;charset=utf-8;"
          //    });
          //    navigator.msSaveBlob(blob, 'filename.xls');
          //  } else {
          //    var a = document.createElement('a');
          //    a.href = 'data:attachment/xls;charset=utf-8,' + encodeURI(res.data);
          //    a.target = '_blank';
          //    a.download = 'filename.xls';
          //    document.body.appendChild(a);
          //    a.click();
          //  }
          // })
          //
          $window.open(url);

        }

        service.salesDetailReport = function (query, stateName) {
            query = setQuerySalesDetailReport(query);

            if (stateName && stateName.endsWith('depart')) {
              return $http.get('/api/v1/salesDetailDepartReport', {params: query});
            } else if (stateName && stateName.endsWith('all')) {
              return $http.get('/api/v1/salesDetailDepartAll', {params: query});
            } else {
              return $http.get('/api/v1/salesDetailReport', {params: query});
            }
        };

        service.salesDetailReportDownload = function (query, stateName) {
          query = setQuerySalesDetailReport(query);
          // return $http.get('/api/v1/salesDetailReportDown', {params: query});
          if (stateName && stateName.endsWith('depart')) {
            download('salesDetailReportDepartDown', query);
          } else if (stateName && stateName.endsWith('all')) {
            download('salesDetailDepartAllDown', query);
          } else {
            download('salesDetailReportDown', query);
          }
        };

        service.commissionReport = function (query) {
          var productId = query.productId;
          delete query.productId;
          return $http.get('/api/v1/commissionReport/' + productId, {params: query});
        };

        service.commissionReportDownload = function (query) {
          var productId = query.productId;
          delete query.productId;
          // return $http.get('/api/v1/commissionReportDown/' + productId, {params: query});
          download('commissionReportDown/' + productId, query);
        };

        var setQuerySubscribeSumReport = function (query) {

            if (query.keyword === '') {
              delete query.keyword;
            }
            if ((query.productType === '') || (query.productType === '-1')) {
              delete query.productType;
            }
            if (query.purchaseStartTime === '') {
              delete query.startDate;
            }
            if (query.purchaseEndTime === '') {
              delete query.endDate;
            }

            return query;
        };

        service.subscribeSumReport = function (query, stateName) {
            query = setQuerySubscribeSumReport(query);
            if (stateName && stateName.endsWith('depart')) {
              return $http.get('/api/v1/subscribeSumReportDepart', {params: query});
            } else {
              return $http.get('/api/v1/subscribeSumReport', {params: query});
            }

        };

        service.subscribeSumReportDownload = function (query, stateName) {
          query = setQuerySubscribeSumReport(query);
          // return $http.get('/api/v1/subscribeSumReportDown', {params: query});
          if (stateName && stateName.endsWith('depart')) {
            download('subscribeSumReportDepartDown/', query);
          } else {
            download('subscribeSumReportDown/', query);
          }
        };

        // types is array, e.g., [1], [1,2]
        service.subscribeReport = function (product, types) {
          var url = '/api/v1/subscribeReport/' + product.id;  // NOTE: shoud be product.id
          if (types !== undefined) {
            url += '?type=' + types.join(',');
          }
          return $http.get(url);
        };

        service.subscribeReportDownload = function (product) {
          // return $http.get('/api/v1/subscribeReportDown/' + subscribe.id);
          download('subscribeReportDown/' + product.id, {});
        };

        // service.billReport = function (query) {
        //   var userId = query.userId;
        //   delete query.userId;
        //   if (!query.endDate) {
        //     delete query.endDate;
        //   } else {
        //     query.endDate = Util.getDate(query.endDate);
        //   }
        //   return $http.get('/api/v1/billReport/' + userId, {params: query});
        // };
        service.billReport = function (userId) {
          return $http.get('/api/v1/billReport/' + userId);
        };

        // service.billReportDownload = function (query) {
        //   var userId = query.userId;
        //   delete query.userId;
        //   if (!query.endDate) {
        //     delete query.endDate;
        //   } else {
        //     query.endDate = Util.getDate(query.endDate);
        //   }
        //   download('billReportDown/' + userId, query);
        // };
        service.billReportDownload = function (userId) {
          download('billReportDown/' + userId);
        };



        return service;

    }]);
