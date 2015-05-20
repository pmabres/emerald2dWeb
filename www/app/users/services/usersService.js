'use strict';
angular.module('userModule').factory('userService', ['$http', 'backEndConstant', '$q', 'userModel', 'commonLocations', function ($http, backEndConstant, $q, userModel, commonLocations) {
    var serviceBase = backEndConstant.apiServiceBaseUri;
    var _users = [];

    var _getUsers = function () {
        return $http.get(serviceBase + '/UserInfo/All').then(function (results) {
            _users = results.data;
            return results;
        });
    };
    var _getUsersCombo = function () {
        return $http.get(serviceBase + '/UserInfo/AllEnabled').then(function (results) {
            _users = results.data;
            var empty = angular.copy(userModel);
            empty.FullName = "Please select a user";
            _users.unshift(empty);

            return results;
        });
    };
    var _editUser = function (user) {
        return $http.put(serviceBase + '/UserInfo', user).then(function (results) {
            return results;
        });
    };
    var _editUserUpdateRoles = function (user) {
        return $http.put(serviceBase + '/UserInfo/UpdateRoles', user).then(function (results) {
            return results;
        });
    };
    var _createUser = function (user) {
        user.Link = commonLocations.getMailConfirmationUrl();
        return $http.post(serviceBase + '/UserAuth/SignUpByAdmin', user).then(function (results) {
            return results;
        });
    };
    var _getUserDetail = function (id) {
        return $http.get(serviceBase + '/UserInfo/' + id).then(function (results) {
            return results;
        });
    };
    var _deleteUser = function (user) {
        return $http.delete(serviceBase + '/UserInfo', {headers: {'Content-Type': 'application/json'}, data: user}).then(function (results) {
            return results;
        });
    };
    var _findUser = function (id) {
        for (var user in _users) {
            if (_users[user].UserID == id) {
                return _users[user];
            }
        }
    };
    var _checkUserAvailability = function (user) {
        return $http.post(serviceBase + '/UserAuth/RegisterUserSearch', user).then(function (results) {
            return results.data;
        });
    };
    var userServiceFactory = {};
    userServiceFactory.users = _users;
    userServiceFactory.getUsers = _getUsers;
    userServiceFactory.getUsersCombo = _getUsersCombo;
    userServiceFactory.editUser = _editUser;
    userServiceFactory.editUserUpdateRoles = _editUserUpdateRoles;
    userServiceFactory.createUser = _createUser;
    userServiceFactory.deleteUser = _deleteUser;
    userServiceFactory.getUserDetail = _getUserDetail;
    userServiceFactory.findUser = _findUser;
    userServiceFactory.checkUserAvailability = _checkUserAvailability;
    userServiceFactory.userModelTemplate = userModel;
    return userServiceFactory;
}]);
