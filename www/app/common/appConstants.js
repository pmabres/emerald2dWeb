'use strict';
angular.module('appConstantsModule', []);
angular.module('appConstantsModule').constant('backEndConstant', {
    apiServiceBaseUri: 'http://localhost:10211'
});

angular.module('appConstantsModule').constant('routingConstant', {
    defaultRoute: '/auth/login'
});
angular.module('appConstantsModule').constant('defaultValuesConstant', {
    defaultGUID: '00000000-0000-0000-0000-000000000000',
    defaultDate: '01/01/1900 12:00:00 AM',
    emptyItem:'Select an Item'
});
angular.module('appConstantsModule').constant('authConstant', {
    clientId: 'FusionUI',
    clientSecret: 'FusionUISecret',
    cookieName: 'authorizationData',
    permissionCacheCookie: 'permissionCache'
});
angular.module('appConstantsModule').constant('errorCodes', {
    missingRole: '000005',
    noProjects: '000035'
});
angular.module('appConstantsModule').constant('actionTypes', {
    add: 'A',
    update: 'U',
    delete: 'D',
    none: 0
});
angular.module('appConstantsModule').factory('commonLocations', ['$http', 'backEndConstant', '$q', '$location', function ($http, backEndConstant, $q, $location) {
    var _serviceBase = backEndConstant.apiServiceBaseUri;
    var _application_url = function () {return $location.absUrl().substring(0, $location.absUrl().length - $location.path().length);};

    var _getMailConfirmationUrl = function () {
        //return _application_url() + "auth/confirmEmail";
        return "auth/confirmEmail";
    };
    var _getResetPasswordUrl = function () {
        return "auth/resetPassword";
    };
    var _getEventEditUrl = function () {
        return "app/issues/emailLink";
    };
    var commonLocationsService = {};
    commonLocationsService.getMailConfirmationUrl = _getMailConfirmationUrl;
    commonLocationsService.getApplicationUrl = _application_url;
    commonLocationsService.getBackendUrl = _serviceBase;
    commonLocationsService.getResetPasswordUrl = _getResetPasswordUrl;
    commonLocationsService.getEventEditUrl = _getEventEditUrl;
    //equipmentsServiceFactory.equipmentModelTemplate = equipmentModel;
    return commonLocationsService;
}]);

var pdfDensities = [ {id: 3,
    text: "1:4  (0.25\":1\')",
    value: 320},
    {id: 4,
        text: "1:3  (0.33\":1\')",
        value: 240},
    {id: 5,
        text: "1:2  (0.50\":1\')",
        value: 160},
    {id: 7,
        text: "1:1  (1\":1\')",
        value: 80}]

pdfDensities.getVal = function(val,prop){
    for (var i=0;i<this.length;i++){
        if (this[i].value == val)
            return this[i][prop];
    }
}
pdfDensities.getText = function(val){return this.getVal(val,'text')};

var keyBoardKeys = {
    delete:'46',
    backspace:''
};
