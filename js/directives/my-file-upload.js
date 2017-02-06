'use strict';

// Now put in constants
//
// var serverRootUrl = "http://demo.iqiaorong.com/images";
// var serverURL = 'http://demo.iqiaorong.com/rest/upfile';

// var serverRootUrl = "http://licai.panna-wealth.com/images";
// var serverURL = 'http://licai.panna-wealth.com/rest/upfile';

// var serverRootUrl = "http://img.iqiaorong.com";
// var serverRootUrl = "http://panna.iqiaorong.com/rest/download?path=";
// var serverURL = 'http://panna.iqiaorong.com/rest/upfile';

app
    .directive('myFileUpload', ['toaster', 'urls', function (toaster, urls) {
        return {
            restrict:'E',
            templateUrl:'tpl/directives/my-file-upload.html',
            scope:{
                files: '='
            },
            controller: ['$scope', 'FileUploader', function ($scope, FileUploader) {

                $scope.downloadRootURL = urls.downloadRootURL;

                var uploader = $scope.uploader = new FileUploader({
                    // url: 'http://121.40.72.110/oa/upfile'
                    url: urls.uploadURL
                });

                // FILTERS
                uploader.filters.push({
                    name: 'customFilter',
                    fn: function(item /*{File|FileLikeObject}*/, options) {
                        return this.queue.length < 10 && !_.includes($scope.files, item.name);  // TODO
                    }
                });

                $scope.remove = function (file) {
                    $scope.files.forEach(function (item, index) {
                        if (item === file) {
                            $scope.files.splice(index, 1);
                        }
                    });
                };

                // CALLBACKS
                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    toaster.pop('success', '上传成功');
                    if (!$scope.files) {
                        $scope.files = [];
                    }
                    $scope.files.push(response);  //{filename, url}
                    // Note: filename === fileItem.file.name
                };
                uploader.onErrorItem = function(fileItem, response, status, headers) {
                    toaster.pop('error', '上传失败');
                };
                // uploader.onCompleteItem = function(fileItem, response, status, headers) {

                // };
                // uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                //     console.info('onWhenAddingFileFailed', item, filter, options);
                //     alert("上传失败"+item.status);
                // };
                // uploader.onAfterAddingFile = function(fileItem) {
                //     console.info('onAfterAddingFile', fileItem);
                // };
                // uploader.onAfterAddingAll = function(addedFileItems) {
                //     console.info('onAfterAddingAll', addedFileItems);
                // };
                // uploader.onBeforeUploadItem = function(item) {
                //     console.info('onBeforeUploadItem', item);
                // };
                // uploader.onProgressItem = function(fileItem, progress) {
                //     console.info('onProgressItem', fileItem, progress);
                // };
                // uploader.onProgressAll = function(progress) {
                //     console.info('onProgressAll', progress);
                // };
                // uploader.onCancelItem = function(fileItem, response, status, headers) {
                //     console.info('onCancelItem', fileItem, response, status, headers);
                // };
                // uploader.onCompleteAll = function() {
                //     console.info('onCompleteAll');
                // };
            }]
        };
    }])

    .directive('myFileViewer', ['toaster', 'urls', function (toaster, urls) {
        return {
            restrict:'E',
            templateUrl:'tpl/directives/my-file-viewer.html',
            scope:{
                files: '='
            },
            controller: ['$scope', 'FileUploader', function ($scope, FileUploader) {

                $scope.downloadRootURL = urls.downloadRootURL;

                var uploader = $scope.uploader = new FileUploader({
                    // url: 'http://121.40.72.110/oa/upfile'
                    url: urls.uploadURL
                });
            }]
        };
    }])

    .directive('myImgUpload', ['toaster', 'urls', function (toaster, urls) {

        return {
            restrict:'E',
            templateUrl: 'tpl/directives/my-img-upload.html',
            scope:{
                ngModel: "="
                // canvasId: '='
            },
            require: 'ngModel',
            controller: ['$scope', 'FileUploader', function ($scope, FileUploader) {
                var uploader = $scope.uploader = new FileUploader({
                    // url: 'http://121.40.72.110/oa/upfile',
                    url: urls.uploadURL,
                    autoUpload: true
                    // queueLimit: 1  // only 1 file, can not re-upload
                });


                uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item /*{File|FileLikeObject}*/, options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });

                // CALLBACKS
                uploader.onSuccessItem = function(fileItem, response, status, headers) {
                    toaster.pop('success', '上传成功');
                    $scope.ngModel = response.url;
                };
                uploader.onErrorItem = function(fileItem, response, status, headers) {
                    toaster.pop('error', '上传失败');
                };
            }],
            link: function (scope, ele, attr, ngModel) {
                ngModel.$render = function() {
                    if (!ngModel.$viewValue) {
                        var canvas = ele.find('canvas');
                        canvas.attr({ width: 100, height: 100 });
                        return;
                    }
                    var canvas = ele.find('canvas');
                    var cxt = canvas[0].getContext('2d');
                    scope.img  = new Image ();
                    scope.img.src = urls.downloadRootURL + ngModel.$viewValue;
                    scope.img.onerror = function () {
                       //  img.src="";//  "12.jpg";
                       // img.onload = function () {
                       //     canvas.attr({ width: 100, height: 100 });
                       //     cxt.drawImage(this,0,0,100,100);
                       // }
                       canvas.attr({ width: 100, height: 100 });

                    };
                    scope.img.onload = function () {
                        canvas.attr({ width: 100, height: 100 });
                        cxt.drawImage(this,0,0,100,100);
                        var link = ele.find('a');
                        link.attr({href: scope.img.src});
                    };
                };

            }
        };
    }])

    .directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas></canvas>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var cxt = canvas[0].getContext('2d');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);


                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }


                //preImage("../css/12.jpg",function(){
                //    canvas.attr({ width: 100, height: 100 });
                //    cxt.drawImage(this,0,0,100,100);
                //});
                //
                //
                //function preImage(url,callback){
                //    var img = new Image();
                //    img.src = url;
                //
                //    if (img.complete) {
                //        callback.call(img);
                //        return;
                //    }
                //
                //    img.onload = function () {
                //        callback.call(img);
                //    };
                //}

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    cxt.drawImage(this, 0, 0, width, height);
                }
            }
        };
    }]);
