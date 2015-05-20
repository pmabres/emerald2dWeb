'use strict';
angular.module('authModule').controller('signupController', ['$scope', '$state', '$timeout', 'authService','userModel', function ($scope, $state, $timeout, authService,userModel) {
    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.registration = angular.copy(userModel);
    $scope.loading = false;
    $scope.signUp = function () {
        $scope.loading = true;
        authService.saveRegistration($scope.registration).then(function (response) {
//            var sendData = {
//                Username:$scope.registration.LoginID,
//                Email:$scope.registration.Email
//            };
//            authService.sendConfirmation(sendData).then(function (response){
//
//            });
            //startTimer();
            $scope.loading = false;
            $scope.$root.go('signupSuccess');
        },
         function (response) {
             $scope.loading = false;
         });
    };
}]);
