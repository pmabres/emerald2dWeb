/**
 * Created by Pancho on 03/10/2014.
 */
'use strict';
angular.module('authModule').controller('confirmEmailController', ['$scope', '$state', 'authService', 'backEndConstant','$stateParams', function ($scope, $state, authService, backEndConstant,$stateParams) {
    $scope.confirmData = {
        Code:$stateParams.id,
        FirstName:"",
        LastName:"",
        UserName:"",
        Password:"",
        ConfirmPassword:""
    };
    $scope.confirm = false;
    $scope.isEmailTokenValid = false;
    $scope.completeSignUp = function(){
        $scope.startLoader("confirmEmail");
        authService.confirmEmail($scope.confirmData).then(function (response) {
            $scope.confirm = true;
            $scope.resolveLoader("confirmEmail");
            showSuccessMessage("Your account has been confirmed. Now you will be redirected to the login page.",5000);
            window.setTimeout(function(){
                $scope.$root.go('login');
            },4000);
        },
        function (err) {
            $scope.message = console.log(err);
        });
    };
    var init = function() {
        $scope.startLoader("confirmEmail");
        authService.checkEmailToken($stateParams.id).then(function (response){
            $scope.resolveLoader("confirmEmail");
            $scope.isEmailTokenValid = response.data;
        });
    };
    init();
}]);
