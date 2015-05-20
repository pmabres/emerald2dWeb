/**
 * Created by Pancho on 03/10/2014.
 */
'use strict';
angular.module('authModule').controller('forgotPasswordController', ['$scope', '$location', 'authService', 'backEndConstant','loginModel', function ($scope, $location, authService, backEndConstant,loginModel) {
    $scope.reset = {
        email: ""
    };
    $scope.confirm = false;
    $scope.loading = false;
    $scope.requestReset = function () {
        $scope.loading = true;
        $scope.startLoader("forgotPassword");
        authService.forgotPassword($scope.reset.email).then(function (response) {
                $scope.loading = false;
                $scope.confirm = true;
                $scope.resolveLoader("forgotPassword");
            },
            function (err) {
                $scope.rejectLoader("forgotPassword");
                $scope.message = console.log(err);
                $scope.loading = false;
            });
    };
}]);
