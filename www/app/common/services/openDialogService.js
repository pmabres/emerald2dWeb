/**
 * Created by Pancho on 01/12/2014.
 */
'use strict';
angular.module('appModule').factory('openDialogService',['$http','$q','$compile','$parse',function($http,$q,$compile,$parse){
    var svc = {
        windowNextId:1,
        createWindow:function(parameters){
            var deferred = $q.defer();
            var scope = parameters.scope;
            var options = parameters.options;
            var content = parameters.content;
            var controller = "";
            var init = "";
            var windowName = "kendoWindow";
            if (parameters.controller){
                controller = ' ng-controller="' + parameters.controller + '"';
            }
            if (parameters.init){
                init = ' ng-init="' + parameters.init + '"';
            }
            if (options && options.name) windowName = "kendo"+options.name;
            if (!options) {
                options = {};
                //options.width = "400px";
                //options.title = "Please Confirm";
                options.modal = true;
                options.visible = false;
            }
            if (options){
                if (angular.isUndefined(options.modal)) options.modal = true;
                if (angular.isUndefined(options.visible)) options.visible = false;
            }
            //var optionsHtml = JSON.stringify(options);
            //kendo-window="' + windowName + '" k-options="' + optionsHtml + '"
            var html =  '<div id="kendoWindow' + svc.windowNextId + '"><div ' + controller + init + ' width:100%">' + content + '</div></div>';
            $('body').append(html);
            var windowDiv = $('#kendoWindow' + svc.windowNextId);
            windowDiv.kendoWindow(options);
            svc.windowNextId++;
            var el = $compile(windowDiv)(scope);
            var dialog = windowDiv.data(windowName);
            scope[windowName] = dialog;
            dialog.bind("close",function(e){
                //TODO: FIND A MORE ELEGANT WAY TO CALL THE RESULTSET OF A WINDOW
                if (parameters.onClose) parameters.onClose(scope[windowName].result,scope,e);
                if (options.modal){
                    deferred.resolve(scope[windowName].result);
                }
                el.parent().remove();
            });
            dialog.bind("open",function(e){
                if (parameters.onOpen) parameters.onOpen(scope,e);
                //if (parameters.onOpen) $parse(parameters.onOpen)(scope);
            });
            dialog.bind("activate",function(e){
                if (parameters.onLoad) parameters.onLoad(scope,e);
                //if (parameters.onOpen) $parse(parameters.onOpen)(scope);
            });
            dialog.center();
            dialog.open();
            if (options.modal){
                return deferred.promise;
            }
        },
        showWindow:function(parameters){
            var deferred = $q.defer();
            if (parameters.contentUrl){
                $http.get(parameters.contentUrl).success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    parameters.content = data;
                    var result = svc.createWindow(parameters);
                    if (result.then){
                        result.then(function(r){
                           deferred.resolve(r);
                        });
                    }
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.

                });
                return deferred.promise;
            }

            if (parameters.content)
            {
                return svc.createWindow(parameters);
            }
        }
    };
    return svc;
}]);
