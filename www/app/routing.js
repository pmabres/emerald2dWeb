/**
 * Created by Pancho on 26/09/2014.
 */
/* Fusion App Routing Data*/
angular.module('appModule').config(function ($stateProvider,$locationProvider,$urlRouterProvider,routingConstant) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise(routingConstant.defaultRoute);
    $stateProvider.state('main',{
        abstract:true,
        url:'',
        views:{
            'srMain':{
                controller:'mainController',
                templateUrl:'app/main/views/main.html'
            }
        }
    });
    $stateProvider.state('secured',{
        parent:'main',
        //url:'/app',
        abstract:true,
        views:{
            'srApp':{
                templateUrl:'app/main/views/app.html'
            }
        }
    });
    $stateProvider.state('app',{
        parent:'secured',
        url:'/app',
        abstract:true,
        views:{         
            'srContent':{
                templateUrl: 'app/main/views/content.html'
            }
        }
    });
});
/* users routing Data*/

angular.module('authModule').config(function ($stateProvider,$locationProvider,$urlRouterProvider,routingConstant) {
    $stateProvider.state('login',{
        parent:'main',
        url:'/auth/login',
        views:{
            'srContent':{
                controller: 'loginController',
                templateUrl: 'app/index/views/home.html'
            }
        }
    });

    $stateProvider.state('signup',{
        parent:'main',
        url:'/auth/signup/user',
        views:{
            'srContent':{
                controller: 'signupController',
                templateUrl: 'app/auth/views/signup.html'
            }
        }
    });

    $stateProvider.state('forgotPassword',{
        parent:'main',
        url:'/auth/forgotPassword',
        views:{
            'srContent':{
                controller: 'forgotPasswordController',
                templateUrl: 'app/auth/views/forgotPassword.html'
            }
        }
    });
    $stateProvider.state('resetPassword',{
        parent:'main',
        url:'/auth/resetPassword/*id',
        views:{
            'srContent':{
                controller: 'resetPasswordController',
                templateUrl: 'app/auth/views/resetPassword.html'
            }
        }
    });
    $stateProvider.state('confirmEmail',{
        parent:'main',
        url:'/auth/confirmEmail/*id',
        views:{
            'srContent':{
                controller: 'confirmEmailController',
                templateUrl: 'app/auth/views/confirmEmail.html'
            }
        }
    });
    $stateProvider.state('signupSuccess',{
        parent:'main',
        url:'/auth/signupSuccess',
        views:{
            'srContent':{
                controller: 'signupController',
                templateUrl:'app/auth/views/signupSuccess.html'
            }
        }
    });
    $stateProvider.state('clientSignup',{
        parent:'main',
        url:'/auth/signup/client',
        views:{
            'srContent':{
                controller: 'clientSignupController',
                templateUrl: 'app/auth/views/clientSignup.html'
            }
        }
    });
    $stateProvider.state('permissionDenied',{
        parent:'app',
        url:"/auth/denied",
        views:{
            'srAuthContent':{
                controller: "permissionDeniedController",
                templateUrl: "app/auth/views/permissionDenied.html"
            }
        }
    });
});
angular.module('userModule').config(function ($stateProvider,$locationProvider,$urlRouterProvider,routingConstant) {
    //$locationProvider.html5Mode(true);
    $stateProvider.state('users',{
        parent:'app',
        url:'/user',
        views:{
            'srAuthContent':{
                controller: 'userController',
                templateUrl: 'app/users/views/index.html'
            }
        }
    });

    $stateProvider.state('userView',{
        parent:'app',
        url:'/user/view',
        views:{
            'srAuthContent':{
                templateUrl: 'app/users/templates/viewContent.html',
                controller: 'userViewController'
            }
        }
    });
    $stateProvider.state('userEdit',{
        parent:'app',
        url:'/user/edit',
        views:{
            'srAuthContent':{
                templateUrl: 'app/users/templates/editContent.html',
                controller:'userEditController'
            }
        }
    });
    $stateProvider.state('userCreate',{
        parent:'app',
        url:'/user/create',
        views:{
            'srAuthContent':{
                templateUrl: 'app/users/templates/createContent.html',
                controller: 'userCreateController'
            }
        }
    });
    $stateProvider.state('userDelete',{
        parent:'app',
        url:'/user/delete',
        views:{
            'srAuthContent':{
                templateUrl: 'app/users/templates/deleteContent.html',
                controller: 'userDeleteController'
            }
        }
    });
});