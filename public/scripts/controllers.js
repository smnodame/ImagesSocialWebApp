angular.module('app')
    .controller('HomeController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth', 'Data', '$http', 'urls',
        function ($rootScope, $scope, $location, $localStorage, Auth, Data, $http, urls) {
            Data.getApiData(function(res) {
                $scope.posts = res.data
            })
        }])
    .controller('SigninController', ['$scope', 'Auth', '$location', '$localStorage', function($scope, Auth, $location, $localStorage) {
        $scope.signin = function () {
            var formData = {
                name: $scope.name,
                password: $scope.password
            };

            Auth.signin(formData, successAuth, function () {
                $rootScope.error = 'Invalid credentials.';
            })
        };

        function successAuth(res) {
            $localStorage.token = res.token;
            window.location = "/";
        }
       }])
       .controller('SignupController', ['$scope', 'Auth', '$location', '$localStorage', function($scope, Auth, $location, $localStorage) {
           $scope.signup = function () {
               var formData = {
                   email: $scope.email,
                   password: $scope.password
               };

               Auth.signup(formData, successAuth, function () {
                   $rootScope.error = 'Failed to signup';
               })
           }

           function successAuth(res) {
               $localStorage.token = res.token;
               window.location = "/";
           }
       }])
   .controller('RestrictedController', ['$rootScope', '$scope', 'Data', function ($rootScope, $scope, Data) {
       Data.getRestrictedData(function (res) {
           $scope.data = res.data;
           console.log(res.data)
       }, function () {
           $rootScope.error = 'Failed to fetch restricted content.';
       })
   }])
   .directive('headBar', [
       '$http', '$localStorage', 'Auth',
       function ($http, $localStorage, Auth) {
           return {
               scope: {
               },
               restrict: 'E',
               templateUrl: 'partials/head-bar/head-bar.html',
               link($scope, $element, $attrs) {
                   $scope.token = $localStorage.token;

                    $scope.authuser = Auth.getTokenClaims();
                    console.log('tokenClaims', $scope.authuser)

                   $scope.logout = function () {
                       Auth.logout(function () {
                           window.location = "/"
                       });
                   };
               }
           }
       }
   ])
   .directive('postMessenger', ['Data', '$http', 'urls',
       function (Data, $http, urls) {
           return {
               restrict: 'E',
               templateUrl: 'partials/post-writing-box/post-writing-box.html',
               link($scope, $element, $attrs) {
                   $scope.messageDetail = {}
                   $scope.postMessageClick = function() {
                       if ($scope.image) {
                           Object.assign($scope.messageDetail, {
                               image: $scope.image.base64
                           })
                       }
                       Data.postMessage($scope.messageDetail, function(res) {
                           $scope.messageDetail = null
                           $scope.image = null
                           $scope.posts = res.data
                           console.log('Post saved successfully')
                       })
                   }
               }
           }
       }
   ])
   .directive('messengerDetails', ['Data', '$http', 'urls',
       function (Data, $http, urls) {
           return {
               scope: {
                   post: "="
               },
               restrict: 'E',
               templateUrl: 'partials/messenger-box/messenger-box.html',
               link($scope, $element, $attrs) {

               }
           }
       }
   ])
   .directive('likeButton', ['Data', '$http', 'urls', 'Auth',
       function (Data, $http, urls, Auth) {
           return {
               scope: {
                   like: "=",
                   postId: "="
               },
               restrict: 'E',
               templateUrl: 'partials/like-button/like-button.html',
               link($scope, $element, $attrs) {
                   $scope.userId = Auth.getTokenClaims()._doc._id
                   $scope.likeClicked = function() {
                        var data = {
                            userId: $scope.userId,
                        }
                        $http.put(urls.BASE_API + '/api/like/'+$scope.postId, data).then(function(res){
                           console.log(' Liked ', $scope.postId)
                           $scope.like = res.data.like
                        }, function(){
                           error
                        })
                   }
               }
           }
       }
   ])
