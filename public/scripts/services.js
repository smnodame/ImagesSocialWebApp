angular.module('app')
   .factory('Auth', ['$http', '$localStorage', 'urls', function ($http, $localStorage, urls) {
       function urlBase64Decode(str) {
           var output = str.replace('-', '+').replace('_', '/');
           switch (output.length % 4) {
               case 0:
                   break;
               case 2:
                   output += '==';
                   break;
               case 3:
                   output += '=';
                   break;
               default:
                   throw 'Illegal base64url string!';
           }
           return window.atob(output);
       }

       function getClaimsFromToken() {
           var token = $localStorage.token;
           var user = {};
           if (typeof token !== 'undefined') {
               var encoded = token.split('.')[1];
               user = JSON.parse(urlBase64Decode(encoded));
           }
           return user;
       }

       var tokenClaims = getClaimsFromToken();

       return {
           signup: function (data, success, error) {
               $http.post(urls.BASE + '/signup', data).success(success).error(error)
           },
           signin: function (data, success, error) {
               $http.post(urls.BASE + '/api/signin', data).then(function (res) {
               console.log('work', res)
               success(res.data)
            })
           },
           logout: function (success) {
               tokenClaims = {};
               delete $localStorage.token;
               success();
           },
           getTokenClaims: function () {
               return tokenClaims;
           }
       };
   }
   ]);


angular.module('app')
  .factory('Data', ['$http', 'urls', function ($http, urls) {

      return {
          getRestrictedData: function (success, error) {
              $http.get(urls.BASE + '/api/users').then(function(res){
                  success(res)
              }, function(){
                  error
              })
          },
          getApiData: function (success, error) {
              $http.get(urls.BASE_API + '/api/posts').then(function(res){
                  success(res)
              }, function(){
                  error
              })
          },
          postMessage: function (data, success, error) {
              $http.post(urls.BASE_API + '/api/post', data).then(function(res){
                  success(res)
              }, function(){
                  error
              })
          }
      };
  }
  ]);
