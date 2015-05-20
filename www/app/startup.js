var files = [
    [{usersModule:'users/users'},
    {appConstantsModule:'common/appConstants'},
    {authModule:'auth/auth'},
    {mainModule:'main/main'}],
    //Now we load appModule.
    [{appModule:'app'}],
    // Everything else that depends on appModule will be loaded here.
    /*Directives*/
    [{commonDirectives:'common/directives/commonDirectives'},
    {UIDirectives:'common/directives/UIDirectives'},
    {errorApiDirective:'common/directives/errorApi'},
    {authDirectives:'auth/directives/authDirectives'},
    {mainDirectives:'main/directives/mainDirectives'},     
    {usersDirectives:'users/directives/usersDirectives'},     
    {validationDirectives:'common/directives/validationDirectives'},
    {authInterceptor:'auth/services/authInterceptorService'},
    {globalInterceptor:'common/services/globalInterceptorService'},     
    /* Services */
    {authService:'auth/services/authService'},
    {httpBufferService:'auth/services/httpBufferService'},
    {usersService:'users/services/usersService'},                   
    {openDialogService:'common/services/openDialogService'},
    {mainService:'main/services/mainService'},
    {loadService:'common/services/loadService'},
    /* Controllers */
    {mainController:'main/controllers/mainController'},
    {loginController:'auth/controllers/loginController'},
    {signupController:'auth/controllers/signupController'},
    {usersController:'users/controllers/usersController'},
    {forgotPasswordController:'auth/controllers/forgotPasswordController'},
    {resetPasswordController:'auth/controllers/resetPasswordController'},
    {confirmEmailController:'auth/controllers/confirmEmailController'},
    {rootController:'common/controllers/rootController'}],
    //Finally we load the routing script so angular has already created all the necessary controllers
    [{routing:'routing'}]
];
var paths = {};
var fileOrder = [];
angular.forEach(files, function(v1, k1) { 
    angular.forEach(v1,function(v2,k2){               
        for (var k in v1[k2]){            
            paths[k] = v1[k2][k];
            fileOrder.push(k);    
        }
    });  
});
require.config({paths: paths, waitSeconds: 30});
/*Load every module that will be used in the application*/
var req = function (val) {
    require([fileOrder[val]], function () {
        val++;
        if (val < fileOrder.length) {
            req(val);
        }
        if (val == fileOrder.length) {
            Start();
        }

    });
};
req(0);
function Start () {
    //Initialize appModule, Extra functionality can be added here.
    angular.bootstrap(document, ['appModule']);
}
