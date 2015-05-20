'use strict';
var modules = [    
    'ui.router',
    'LocalStorageModule',
    'commonDirectivesModule',
    'appConstantsModule',
    'authModule',
    'mainModule',
    //'userModule',
    'rootModule'
];
angular.module('appModule', modules);
angular.module('appModule').config(function ($httpProvider) {
    $httpProvider.interceptors.push('globalInterceptorService');
    $httpProvider.interceptors.push('authInterceptorService');
});
angular.module('appModule').run(['$state', function ($state) {
}]);