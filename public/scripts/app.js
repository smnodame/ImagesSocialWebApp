angular.module('app', [
   'ngStorage',
   'ngRoute',
   'angular-loading-bar',
   'ngMaterial',
   'ngMessages',
   'material.svgAssetsCache',
   'naif.base64',
])
   .constant('urls', {
       BASE: 'http://localhost:8080',
       BASE_API: 'http://localhost:8080'
   })
   .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
       $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
         return {
             'request': function (config) {
                 config.headers = config.headers || {};
                 if ($localStorage.token) {
                     config.headers['x-access-token'] = $localStorage.token;
                 }
                 return config;
             },
             'responseError': function (response) {
                 if (response.status === 401 || response.status === 403) {
                     $location.path('/signin');
                 }
                 return $q.reject(response);
             }
         };
       }]);

       $routeProvider.
           when('/', {
               templateUrl: 'partials/home.html',
               controller: 'HomeController'
           }).
           when('/signin', {
               templateUrl: 'partials/signin.html',
               controller: 'SigninController'
           }).
           when('/signup', {
               templateUrl: 'partials/signup.html',
               controller: 'SignupController'
           }).
           when('/restricted', {
               templateUrl: 'partials/restricted.html',
               controller: 'RestrictedController'
           }).
           otherwise({
               redirectTo: '/'
           });
}]);
