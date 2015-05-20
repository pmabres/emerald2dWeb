'use strict';
/*angular.module('authModule').factory('authService', ['$http', '$q', '$window', 'localStorageService', 'backEndConstant','authConstant','commonLocations', function ($http, $q, $window, localStorageService, backEndConstant, authConstant,commonLocations) {

    var serviceBase = backEndConstant.apiServiceBaseUri;
    var authServiceFactory = {};
    var _authentication = angular.copy(authModel);
    var _session = {
        client:{},
        project:{},
        token:{},
        clientProjects:{},
        user:{},
        roles:{}
    };
    var _mapResponse = function(response){
        var auth = {
            access_token:response.access_token,
            token_type:response.token_type,
            expires_in:response.expires_in,
            refresh_token:response.refresh_token,
            client_id:response.client_id,
            userId:response.userId,
            issued:response['.issued'],
            expires:response['.expires'],
            isAuth:true,
            hasRefresh:response.hasRefresh,
            currentClient_id:response.currentClient_id,
            currentProject_id:response.currentProject_id
        };
        return auth;
    };
    var _cleanAuth = function(){
        localStorageService.remove(authConstant.cookieName);
        _setAuth(angular.copy(authModel));
    };
    var _saveRegistration = function (user) {
        _logOut();
        user.Link = commonLocations.getMailConfirmationUrl();
        return $http.post(serviceBase + '/UserAuth/SignUp', user).then(function (response) {
            return response;
        });
    };
    var _clientSaveRegistration = function (client) {
        _logOut();
        //TODO: replace current implementation for new user
        client.userSignup.link = commonLocations.getMailConfirmationUrl();
        return $http.post(serviceBase + '/Client', client).then(function (response) {
            return response;
        });
    };

    var _resendConfirmationEmail = function (sendData){
        sendData.link = commonLocations.getMailConfirmationUrl();
        return $http.post(serviceBase + '/UserAuth/ResendConfirmationEmail', sendData).then(function (response) {
            return response;
        });
    };
    var _getCurrentUser = function (){
        return $http.get(serviceBase + '/token/user').then(function (response) {
            return response;
        });
    };
    var _getLoggedClient = function (){
        return $http.get(serviceBase + '/token/client').then(function (response) {
            return response;
        });
    };
    var _getLoggedProject = function (){
        return $http.get(serviceBase + '/token/project').then(function (response) {
            return response;
        });
    };
    var _userHasAnyPermission = function() {
        return $http.get(serviceBase + '/UserInfo/UserHasAnyPermission').then(function(results) {
                return results;
            },
            function(err){
                console.log('Error getting any permissions');
            });
    };
    var _login = function (loginData) {
        var data = "grant_type=password"
            + "&username=" + loginData.userName
            + "&password=" + loginData.password
            + "&client_id=" + loginData.clientId
            + "&client_secret=" + loginData.clientSecret;
        var deferred = $q.defer();
        _logOut().then(function(){
        });
        _cleanAuth();
        $http.post(serviceBase + '/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
            response.hasRefresh = false;
            _setAuth(_mapResponse(response),true);
            permissionService.getPermissions();
            deferred.resolve(response);
        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;
    };
    var _logOut = function () {
        var deferred = $q.defer();
        var authData = angular.copy(_getAuth());
        if (authData && authData.refresh_token) {
            //localStorageService.remove(authConstant.cookieName);
            //tabService.clearTabs();
            $http.delete(serviceBase + '/token/' + authData.refresh_token, "", {headers:{'Content-Type':'application/json'}}).success(function (response) {
                _cleanAuth();
                deferred.resolve(response);
            }).error(function (err, status) {
                _cleanAuth();
                deferred.resolve(true);
            });
        } else {
            _cleanAuth();
            deferred.resolve();
        }
        localStorageService.remove(authConstant.permissionCacheCookie);
        return deferred.promise;
    };

    var _fillAuthData = function () {
        var auth = localStorageService.get(authConstant.cookieName);
        if (auth && auth.access_token) {
            _setAuth(auth,true);
            _refreshToken(true).then(function(){
                //_setAuth(getAuth(),false,true);
                permissionService.getPermissions();
            });
        }
    };

    var _refreshToken = function (newInstance) {
        var deferred = $q.defer();

        //var authData = localStorageService.get(authConstant.cookieName);
        var authData = _getAuth();
        if (authData) {
            var data = "grant_type=refresh_token&refresh_token=" + authData.refresh_token
                + "&client_id=" + authConstant.clientId
                + "&client_secret=" + authConstant.clientSecret
                + "&selectedClientId=" + authData.currentClient_id
                + "&selectedProjectId=" + authData.currentProject_id;
            if (newInstance) data += "&newInstance=true";
            localStorageService.remove(authConstant.cookieName);
            $http.post(serviceBase + '/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                response.hasRefresh = true;
                response.currentClient_id = authData.currentClient_id;
                response.currentProject_id = authData.currentProject_id;
                _setAuth(_mapResponse(response),true,true);
                permissionService.getPermissions();
                //localStorageService.set(authConstant.cookieName, { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                deferred.resolve(response);
            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });
        }
        return deferred.promise;
    };

    var _resetPassword = function (data) {
        var deferred = $q.defer();
        $http.post(serviceBase + '/UserAuth/ResetPassword', data).success(function (response) {

            deferred.resolve(response);
        }).error(function (err, status) {

            deferred.reject(err);
        });
        return deferred.promise;
    };
    var _forgotPassword = function (email) {
        var deferred = $q.defer();
        var sendData = {
            Email: email,
            Link: commonLocations.getResetPasswordUrl(),
            confirmationLink:commonLocations.getMailConfirmationUrl()
        };

        $http.post(serviceBase + '/UserAuth/ResetPasswordRequest', sendData).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {

            deferred.reject(err);
        });
        return deferred.promise;
    };
    var _confirmEmail = function (data) {
        var deferred = $q.defer();
        $http.post(serviceBase + '/UserAuth/RegisterUserEmailConfirmed', data).success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {

            deferred.reject(err);
        });
        return deferred.promise;
    };
    var _getIsClientRole = function(){
        var deferred = $q.defer();
        $http.get(serviceBase + '/token/IsClientAccessLevel').success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
    var _validateIssueLogIn = function (token) {
        var deferred = $q.defer();
        $http.get(serviceBase + '/token/IssueLogIn/' + token).success(function(response)  {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var _getAuth = function(){
        return _authentication;
    };

    var _getCurrentClient = function(){
        return _session.client;
    };

    var _setCurrentClient = function(data){
        _session.client = data
    };

    var _getCurrentProject = function(){
        return _session.project;
    };

    var _setCurrentProject = function(data){
        _session.project = data
    };
    var _setToken = function(data){
        _session.token = data;
    };
    var _getToken = function(){
        return _session.token;
    };
    var _getSession = function(){
        return _session;
    };
    var _setUser = function(data){
        _session.user = data;
        _session.user.isAccountOwner = (_session.user.UserID == _session.client.AccountOwnerUserID);
    };
    var _getUser = function(){
        return _session.user;
    };
    var _getAssignedClient = function (){
        var deferred = $q.defer();
        $http.get(serviceBase + '/Client').success(function (response) {
            deferred.resolve(response);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
    var _setClientProjects = function(data){
        _session.clientProjects = data;
    };
    var _getClientProjects = function(){
        return _session.clientProjects;
    };
    var _setRoles = function(data){
        _session.roles = data;
    };
    var _getRoles = function(){
        return _session.roles;
    };

    var _checkEmailToken = function (emailToken){
        return $http.post(serviceBase + '/UserAuth/CheckEmailToken/', {IdPasswordResetRequest:emailToken}).then(function (response) {
            return response;
        });
    };

    var _setAuth = function(auth,saveCookie,getUser){
        //Assigning each property separately to not loosing the memory reference.
        _authentication.access_token = auth.access_token;
        _authentication.token_type = auth.token_type;
        _authentication.expires_in = auth.expires_in;
        _authentication.refresh_token = auth.refresh_token;
        _authentication.client_id = auth.client_id;
        _authentication.project_id = auth.project_id;
        _authentication.userId = auth.userId;
        _authentication.issued = auth.issued;
        _authentication.expires = auth.expires;
        _authentication.isAuth = auth.isAuth;
        _authentication.currentClient_id = auth.currentClient_id;
        _authentication.currentProject_id = auth.currentProject_id;

        $window.walkMeUserId = auth.userId;
        _setToken(_authentication);
        if (saveCookie) {
            localStorageService.set(authConstant.cookieName,_authentication);
        }
        if (auth.userId && getUser) {
            $http.get(serviceBase + '/token/user').then(function (results) {
                _setUser(results.data);
            }, function(error){
                console.log('Error calling /token/user into _setAuth on authService');
            });
            if(auth.currentClient_id) {
                projectService.getProjectsByClient(auth.currentClient_id).then(function (results) {
                    _setClientProjects(results.data);
                }, function(error){
                    console.log('Error getting projectService.getProjectByClients on authService');
                });
                $http.get(serviceBase + '/token/client').then(function (result) {
                    _setCurrentClient(result.data);
                }, function(error){
                    console.log('Error calling /token/client into _setAuth on authService');
                });
            }
            else{
                _setCurrentClient("");
            }
            if(auth.currentProject_id) {
                $http.get(serviceBase + '/token/project').then(function (result) {
                    _setCurrentProject(result.data);
                }, function(error){
                    console.log('Error calling /token/project into _setAuth on authService');
                });
            }
            else{
                _setCurrentProject("");
            }
        }
    };

    authServiceFactory.validateIssueLogIn =_validateIssueLogIn;
    authServiceFactory.getAuth = _getAuth;
    authServiceFactory.setAuth = _setAuth;
    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.clientSaveRegistration = _clientSaveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.getCurrentUser = _getCurrentUser;
    //authServiceFactory.currentClient = _currentClient;
    //authServiceFactory.currentProject = _currentProject;
    authServiceFactory.getCurrentClient = _getCurrentClient;
    authServiceFactory.setCurrentClient = _setCurrentClient;
    authServiceFactory.getCurrentProject = _getCurrentProject;
    authServiceFactory.getClientProjects = _getClientProjects;
    authServiceFactory.getSession = _getSession;
    authServiceFactory.getToken = _getToken;
    authServiceFactory.getUser = _getUser;
    authServiceFactory.getRoles = _getRoles;
    authServiceFactory.setRoles = _setRoles;
    authServiceFactory.setCurrentProject = _setCurrentProject;
    authServiceFactory.refreshToken = _refreshToken;
    authServiceFactory.forgotPassword = _forgotPassword;
    authServiceFactory.resetPassword = _resetPassword;
    authServiceFactory.confirmEmail = _confirmEmail;
    authServiceFactory.resendConfirmationEmail = _resendConfirmationEmail;
    authServiceFactory.getAssignedClient = _getAssignedClient;
    authServiceFactory.getLoggedClient = _getLoggedClient;
    authServiceFactory.getLoggedProject = _getLoggedProject;
    authServiceFactory.getIsClientRole = _getIsClientRole;
    authServiceFactory.checkEmailToken = _checkEmailToken;
    authServiceFactory.userHasAnyPermission = _userHasAnyPermission;
    return authServiceFactory;
}]);
*/