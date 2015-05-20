'use strict';
angular.module('authModule').factory('permissionService', ['$http', '$q', 'localStorageService', 'backEndConstant', 'authConstant', function ($http, $q, localStorageService, backEndConstant, authConstant) {

    var serviceBase = backEndConstant.apiServiceBaseUri;
    var permissionService = {
        permissionList: localStorageService.get(authConstant.permissionCacheCookie) || []
    };

    var _getPermissions = function () {
        var deferred = $q.defer();
        /*var response = {data:[
                        {module:'users',permission:'read'},
                        {module:'users',permission:'edit'}
                        //{module:'users',permission:'add'}
                        ]};
        permissionService.permissionList = response.data;*/
        //deferred.resolve(response);
        $http.get(serviceBase + '/token/permissions').success(function (response) {
            permissionService.permissionList = response.Permissions;
            localStorageService.set(authConstant.permissionCacheCookie, permissionService.permissionList);
            deferred.resolve(response.permissions);
        }).error(function (err, status) {

            deferred.reject(err);
        });
        return deferred.promise;
    };
    var _hasPermission = function(module,permission){
        var hasPermission=false;
        var hasModule=false;

        var list = permissionService.permissionList;
        if (permission){
            var permArray = permission.split(',');
            for (var b=0;b<permArray.length;b++){
                for (var i=0;i<list.length;i++){
                    if (module.toLowerCase() == list[i].Module.toLowerCase()){
                        hasModule = true;
                        if (permArray[b].toLowerCase() == list[i].Permission.toLowerCase()){
                            //console.log("the user has the permission:" + list[i].Permission + " - On module:" + attrs.authorize);
                            hasPermission = true;
                        }
                    }
                }
            }
        }
        else
        {
            for (var c=0;c<list.length;c++){
                if (module.toLowerCase() == list[c].Module.toLowerCase()){
                    hasModule = true;
                    hasPermission = true;
                }
            }
        }
        return hasPermission && hasModule;
    };
    permissionService.getPermissions = _getPermissions;
    permissionService.hasPermission = _hasPermission;
    return permissionService;
}]);
