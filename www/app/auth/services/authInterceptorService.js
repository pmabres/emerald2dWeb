'use strict';
angular.module('authModule').factory('authInterceptorService', ['$q', '$injector', 'localStorageService', 'authConstant', 'httpBufferService', 'errorCodes', function ($q, $injector, localStorageService, authConstant, httpBuffer, errorCodes) {
    var authInterceptorServiceFactory = {};
    var _request = function (config) {
        config.headers = config.headers || {};
        if (!(config.url.indexOf('token') != -1 && config.method == 'POST')) {
            var authService = $injector.get('authService');
            //var authData = localStorageService.get(authConstant.cookieName);
            var authData = authService.getAuth();
            if (authData && authData.access_token) {
                config.headers.Authorization = authData.token_type + ' ' + authData.access_token;
            }
        }


        return config;
    };
    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var navigation = $injector.get('navigation');
            var authService = $injector.get('authService');
            var state = $injector.get('$state');
            var http = $injector.get('$http');
            var defer = $q.defer();

            //Set a value in the authService if the condition for redirected after the login is true. Null in other case.
            authService.pathToRedirect = getPathToRedirect();

            // Hide error toasts for conditions handled gracefully by the UI
            if (rejection.data && (rejection.data.ErrorCode == errorCodes.missingRole ||
                rejection.data.ErrorCode == errorCodes.noProjects)) {
                rejection.data.ItCouldBeShown = false;
                return $q.reject(rejection);
            }
            var authData = authService.getAuth();
            //TODO: Fix this messy if
            if (rejection.config.url.indexOf('token/') != -1 && rejection.config.method == 'DELETE') {
                return $q.reject(rejection);
            }
            httpBuffer.append(rejection.config, defer);
            if (httpBuffer.getItems().length > 1) {
                return defer.promise;
            }

            if (authData) {
                return authService.refreshToken().then(function (response) {
                        if (response.access_token) {
                            httpBuffer.retryAll();
                            return defer.promise;
                            /*return http(rejection.config).then(function(response) {
                             // we have a successful response - resolve it using deferred
                             return response;
                             });*/
                        }
                    },
                    function (err) {
                        console.log("logout");
                        httpBuffer.clean();
                        authService.logOut();
                        navigation.go('login', null, {reload: true});
                        return $q.reject(rejection);
                    });
            }
            httpBuffer.clean();
            authService.logOut();
            navigation.go('login', null, {reload: true});
        }
        return $q.reject(rejection);
    };

    var getPathToRedirect = function () {
        var location = $injector.get('$location');
        if (location != null) {
            var url = location.$$url;
            //TODO: review the logic to set the state and url, in this case, is for the emailLink redirect after the login
            if (url.indexOf('emailLink') >= 0 )
            {
                var authService = $injector.get('authService');
                var state = 'issuesEmailLinkItem';
                var arrUrl=location.path().split("/");
                var token = arrUrl[arrUrl.length-1] || "Unknown";
                var params = {'token': token};
                return {'state': state, 'params': params};
            }
        }
        return null;
    };

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);
