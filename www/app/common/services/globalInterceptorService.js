/**
 * Created by Pancho on 23/09/2014.
 * This file will intercept request and response from $http
 * to be able to create a general workflow.
 */
'use strict';
angular.module('appModule').factory('globalInterceptorService', ['$q', '$injector','$location', 'localStorageService', function ($q, $injector,$location, localStorageService) {

    var globalInterceptorServiceFactory = {};

    var _request = function (config) {
        //config.timeout = 10000;
        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401 || rejection.status === 404 || rejection.status === 0) {
        }
        return $q.reject(rejection);
    }

    globalInterceptorServiceFactory.request = _request;
    globalInterceptorServiceFactory.responseError = _responseError;

    return globalInterceptorServiceFactory;
}]);
