/**
 * Created by Pancho on 16/10/2014.
 */
'use strict';
//This service is not used yet, but we'll keep if it comes handy in the future.
angular.module('authModule').factory('httpBufferService', ['$injector', function($injector) {
    /** Holds all the requests, so they can be re-requested in future. */
    var buffer = [];
    var doAction=false;
    /** Service initialized later because of circular dependency problem. */
    var $http;

    function retryHttpRequest(config, deferred) {
        function successCallback(response) {
            deferred.resolve(response);
        }
        function errorCallback(response) {
            deferred.reject(response);
        }
        $http = $http || $injector.get('$http');
        $http(config).then(successCallback, errorCallback);
    }
    var bufferData = {
        getItems:function (){
            return buffer;
        },
            /**
             * Appends HTTP request configuration object with deferred response attached to buffer.
             */
        append: function(config, deferred) {
            buffer.push({
                config: config,
                deferred: deferred
            });
        },

        /**
         * Abandon or reject (if reason provided) all the buffered requests.
         */
        rejectAll: function(reason) {
            if (reason) {
                for (var i = 0; i < buffer.length; ++i) {
                    buffer[i].deferred.reject(reason);
                }
            }
            buffer = [];
        },
        clean:function(){
            buffer = [];
            doAction = false;
        },
        /**
         * Retries all the buffered requests clears the buffer.
         */
        retryAll: function() {
            if (!doAction){
                doAction = true;
                for (var i = 0; i < buffer.length; ++i) {
                    retryHttpRequest(buffer[i].config, buffer[i].deferred);
                }
                bufferData.clean();
            }

        }
    };
    return bufferData;
}]);
