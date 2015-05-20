/**
 * Created by Pancho on 08/10/2014.
 */
'use strict';
//TODO: put every angular component in a propper file.
var elementsList = $();
angular.module('commonDirectivesModule').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('errorApiInterceptorService');
}]);

angular.module('commonDirectivesModule').directive('apiMessages',function(){
    return {
        link: function(scope, element) {
            elementsList.push($(element));
        }
    };
});
// The service that will intercept webapi calls
angular.module('commonDirectivesModule').factory('errorApiInterceptorService',['$q', function($q) {
    var errorApiService = {};

    var _response = function (response) {
        //if (response.config.method.toUpperCase() != 'GET')
            //showMessage('Success', 'alert-success', 700);
        return response;
    };

    var _responseError = function (rejection) {
        var message="";
        if (rejection.status == 0) {
            message = "Could not connect to the Backend Service.";
        }
        else
        {
            if (rejection.data.error_description) {
                message = rejection.data.error_description;
            }
            else
            {
                if (rejection.data.ItCouldBeShown)
                    message = rejection.data.ErrorMessage + ('<br>' + (rejection.data.Description));
            }
        }
        //TODO: Fix this messy if
        if (rejection.config.url.indexOf('token/') != -1 && rejection.config.method == 'DELETE') {
            message = "";
        }
        if (message)
            showErrorMessage(message ,3000);
        return $q.reject(rejection);
    };

    errorApiService.response = _response;
    errorApiService.responseError = _responseError;
    return errorApiService;
}]);

