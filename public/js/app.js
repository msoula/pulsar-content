angular.module('app', [])

    .controller('AppCtrl', ['$scope', '$http', '$location',
        function($scope, $http, $location) {
            'use strict';
            function updateFiles() {
                console.log($location.path());
                var frag = $location.path().split('/');
                $scope.files = $scope.FILES;
                $scope.progress = $scope.files.__thumbs;
                delete $scope.files.__thumbs;
                for(var i = 0; i < frag.length; i++) {
                    if(frag[i] === '') {
                        continue;
                    }
                    $scope.files = $scope.files[frag[i]];
                    if(!$scope.files) {
                        $location.path('');
                        break;
                    }
                    else {
                        $scope.files = $scope.files.files;
                    }
                }
            }

            $http.get('files.json')
                .then(function(res) {
                          $scope.FILES = res.data;
                          updateFiles();
                      });

            $scope.$on('$locationChangeStart', function() {
                if(!$scope.FILES) {
                    return;
                }
                updateFiles();
            });

            $scope.open = function(e, f) {
                console.log("open");

                if(f.isDir) {
                    $location.path($location.path() + f.name + '/');
                    e.preventDefault();
                    return false;
                }
            };
        }])

    .directive('thumb', ['$timeout', function($timeout) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                data: '='
            },
            link: function(scope) {
                scope.video = scope.data.mime && scope.data.mime.indexOf('video') !== -1;
                scope.audio = scope.data.mime && scope.data.mime.indexOf('audio') !== -1;
                scope.link = scope.data.path;
                if(scope.video || scope.audio) {
                    scope.link = "player.html#/?data=" + encodeURIComponent(JSON.stringify(scope.data));
				}
				scope.isFolder = scope.data.img.indexOf('folder.svg') !== -1;
				scope.img = (scope.isFolder || scope.data.img.indexOf('file.svg') !== -1) ? '' : scope.data.img;
            },
            template: '<a href="{{link}}">' +
            '<div class="inner">' +
            '<div class="img">' +
            '<img ng-if="img" ng-src="{{img}}">' +
            '<svg class="file-icon" ng-if="isFolder" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fit=""><g fill="#E6E6E6"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></g></svg>' +
            '<svg class="file-icon" ng-if="!img && !isFolder" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fit=""><g fill="#E6E6E6"><path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path><text font-size="6" x="9" y="19" fill="#FAB562">{{data.ext}}</text></g></svg>' +
            '<svg class="video-icon" ng-if="(video || audio) && !isFolder" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" fit=""><g fill="#000000" fill-opacity="0.4" stroke="#b7aeae" stroke-opacity="0.4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"></path></g></svg>' +
            '</div>' +
            '<h3>{{data.name}}</h3>' +
            '</a>' +
            '</div>'
        };
    }])

    .controller('PlayerCtrl', ['$scope', '$location',
        function($scope, $location) {
            'use strict';

            var data = JSON.parse($location.search().data);
            console.log(data);

            $scope.video = data.mime.indexOf('video/') === 0;
            $scope.audio = data.mime.indexOf('audio/') === 0;
            if($scope.video || $scope.audio) {
                $scope.params = data.src;
            }
            console.log(data);
        }]);
