/**
 * Created by pancho on 13/03/2015.
 */
var buttonsPath = 'app/common/templates/buttons/';
var buttons = {
    default:'defaultButton.html',
    icon:'iconButton.html',
    submit:'submitButton.html'
};
var iconButtons = {
    /*delete:{icon:'k-i-delete',title:'Delete'},
    edit:{icon:'k-i-edit',title:'Edit'},
    export:{icon:'k-i-excel',title:'Export'},
    create:{icon:'k-i-create',title:'Create'},
    clone:{icon:'k-i-clone',title:'Clone'}*/
};
angular.module('commonDirectivesModule').directive('uiButton',['$parse',function ($parse) {
    return {
        scope:true,
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            return  buttonsPath + (buttons[attrs.buttonType] || buttons.default);
        },
        link:function(scope,elem,attrs){
            var text = $parse(attrs.text)(scope) || attrs.text;
            scope.buttonText = text;
            scope.buttonClass = $parse(attrs.buttonClass)(scope) || attrs.buttonClass;
        }
    }
}]);
angular.module('commonDirectivesModule').directive('uiButtonIcon',['$parse',function ($parse) {
    return {
        scope:true,
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            return  buttonsPath +  buttons.icon;
        },
        link:function(scope,elem,attrs){
            scope.buttonText = $parse(attrs.text)(scope) || attrs.text;
            var iconButton = iconButtons[$parse(attrs.icon)(scope) || attrs.icon];
            if (iconButton){
                scope.buttonIcon = iconButton.icon || '';
                scope.buttonClass = attrs.buttonClass;
                scope.buttonTitle = attrs.title || iconButton.title;
            }
        }
    }
}]);
angular.module('commonDirectivesModule').directive('uiButtonSubmit',['$parse',function ($parse) {
    return {
        scope:true,
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            return  buttonsPath + buttons.submit;
        },
        link:function(scope,elem,attrs){
            scope.buttonText = $parse(attrs.text)(scope) || attrs.text;
        }
    }
}]);

angular.module('commonDirectivesModule').directive('columnsManager', ['$parse',function ($parse) {
    //TODO: Clean all the usages on controllers of kendo.ColumnManagement ocurrences
    return {
        templateUrl: 'app/common/templates/buttons/manageColumns.html',
        controller:'columnsManagerController',
        link: function (scope, elem, attrs,ctrl) {
            ctrl.init(scope,elem,attrs);
        }
    }
}]);
angular.module('commonDirectivesModule').directive('loader',['$parse','loadService',function ($parse,loadService) {
    return {
        link:function(scope,elem,attrs){
            var container = attrs.loaderContainer || $(elem);
            scope.$watch(function(){return $(container).length;},function(val){
                if (val){
                    var containerElement = $(container);
                    //if (!container.length) container = $('body');
                    loadService.addLoader(elem, containerElement);
                    //loadService.startLoader(attrs.loader);
                }
            });
        }
    }
}]);
/*
*  All the event directives should start with on
*  for example: on-grid-dblclick,etc.
*
*
* ---- EVENT Directives ----
* */