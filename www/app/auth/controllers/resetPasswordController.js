/**
 * Created by Pancho on 03/10/2014.
 */
'use strict';
angular.module('authModule').controller('resetPasswordController', ['$scope', '$state', '$timeout','authService', 'backEndConstant','$stateParams', function ($scope, $state,$timeout, authService, backEndConstant,$stateParams) {
    $scope.resetData = {
        Password:"",
        ConfirmPassword:"",
        Code:$stateParams.id
    };
    $scope.confirm = false;
    $scope.loading = false;
    $scope.isEmailTokenValid = false;
    $scope.resetPassword = function () {
        $scope.loading = true;
        $scope.startLoader("resetPassword");
        authService.resetPassword($scope.resetData).then(function (response) {
                $scope.confirm = true;
                $scope.loading = false;
                $scope.resolveLoader("resetPassword");
                startTimer();
            },
            function (err) {
                $scope.rejectLoader("resetPassword");
                $scope.message = err;
                $scope.loading = false;
            });
    };
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $scope.$root.go('login');
        }, 2000);
    }
    var init = function() {
        $scope.startLoader("resetPassword");
        authService.checkEmailToken($stateParams.id).then(function (response) {
            $scope.resolveLoader("resetPassword");
            $scope.isEmailTokenValid = response.data;
        });
    };
    init();
}]);
