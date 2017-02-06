'use strict';

/* Filters */
// need load the moment.js to use this filter.
// Return string
angular.module('app')
  .filter('getDate', function() {
    return function(datetime) {
      if (datetime === undefined) {
          return undefined;
        }

        if (typeof datetime !== 'string') {

          // return datetime.toISOString().slice(0, 10);  // Note: this does not consider timezone
          var d = new Date(datetime);
          return moment(d).format('YYYY-MM-DD');
        }
        else {
          if (datetime === '' || !moment(datetime).isValid()) {
            return '';
          }

          return datetime.slice(0, 10);
        }
    }
  });
