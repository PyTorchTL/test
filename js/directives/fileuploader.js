angular.module('app')
  .directive('fileUploader', function() {
    return {
      restrict: 'E',
      replace: false,
      scope: {
        menuItems: '=',
        onMoveToFolder: '&'
      },

      controller: ['$scope', 'FileUploader', function ($scope, FileUploader) {
        var uploader = $scope.uploader = new FileUploader({
            url: '/api/v1/upfile'
        });

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
            alert("上传失败"+item.status);
        };

      }],

      templateUrl: 'tpl/directives/fileuploader.directive.html'
    };
  });
