/**
 * Created by Pancho on 31/12/2014.
 */
'use strict';
angular.module('authModule').directive('authorize', ['$injector', '$parse', '$state', function ($injector, $parse, $state) {
    return {
        link: function (scope, elem, attrs) {
            var service = $injector.get('permissionService');
            scope.$watch(function(){return service.permissionList},function(list){
                if (list) {
                    var actions =
                            {"Hide":function(val){
                                $(elem).hide();
                            },
                            "Show":function(val){
                                $(elem).show();
                            },
                            "Delete":function(val){
                                    elem.remove();
                            },
                            "Custom":function(f){
                                    var execute = $parse(f);
                                    execute(scope);
                            },
                            "Enable":function(val){
                                    elem.prop("disabled", false);
                            },
                            "Disable":function(val){
                                    elem.prop("disabled", true);
                            },
                            "Redirect":function(val){
                                    scope.$root.go(val);
                            }};
                    var option;
                    if (service.hasPermission(attrs.authorize, attrs.permission)) {
                        option = "auth";
                    } else {
                        option = "unauth";
                    }

                    for (var a in actions) {
                        var action = false;
                        var doAction = false;
                        if (attrs.hasOwnProperty(option+a)) {
                            action = attrs[option+a];
                            doAction = true;
                        }
                        if (doAction) {
                            // perform a custom action;
                            actions[a](action);
                        }
                    }
                }
            });
        }
    }
}]);

angular.module('authModule').directive('login', ['$injector', '$location', '$state', 'authService', 'loginModel', 'localStorageService', 'authConstant', 'profileUserService', function ($injector, $location, $state, authService, loginModel, localStorageService, authConstant, profileUserService) {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            return ('app/auth/views/login.html')
        },
        link: function (scope, element, attrs) {
            var authService = $injector.get('authService');
            var tabService = $injector.get('tabService');
            var projectService = $injector.get('projectService');
            scope.loginData = angular.copy(loginModel);
            scope.message = "";
            var _base_url = function () { return $location.absUrl().substring(0, $location.absUrl().length - $location.path().length - 2); };


            scope.img_url = _base_url();
            scope.login = function () {
                scope.startLoader('login');
                authService.login(scope.loginData).then(function (response) {
                    var authD = authService.getAuth();
                    authService.getLoggedClient().then(function(resClient) {
                        authService.getLoggedProject().then(function(resProject) {
                            authService.userHasAnyPermission().then(function(resultHasAnyPermission) {
                                if (resClient && resClient.data!='null' && resClient.data.ClientID != 'null') {
                                    authD.currentClient_id = resClient.data.ClientID;
                                    if (resProject && resProject.data != 'null' && resProject.data.ProjectID != 'null') {
                                        authD.currentProject_id = resProject.data.ProjectID;
                                    }
                                    else {
                                        authD.currentProject_id = '';
                                    }
                                }
                                else {
                                    authD.currentClient_id = '';
                                    authD.currentProject_id = '';
                                }
                                authService.setAuth(authD, true, true);
                                scope.resolveLoader('login');
                                if(authService.pathToRedirect!=null && authService.pathToRedirect!=""){
                                    scope.$root.go(authService.pathToRedirect.state, authService.pathToRedirect.params);
                                    authService.pathToRedirect=null;
                                    return;
                                }
                                if (authD.currentProject_id) {
                                    scope.$root.go('drawings');
                                    return;
                                }
                                if (resultHasAnyPermission && resultHasAnyPermission.data && resultHasAnyPermission.data.length == 0) {
                                    scope.$root.go('profileUser');
                                    return;
                                }
                                scope.$root.go('project');
                            });
                        });
                    });
                },
                function (err) {
                    scope.rejectLoader('login');
                    scope.message = err;
                });
            };
        }
    };
}]);
