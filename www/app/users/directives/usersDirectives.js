'use strict';
angular.module('userModule').directive('userEdit',['$compile',function($compile){
    return {
        restrict: 'A',
        replace: false,
        terminal: true,
        priority: 1000,
        //controller:'edituserController',
        link:function(scope, element, attrs,ctrl) {
            element.attr('template-open','userEdit');
            element.attr('template-type','window');
            element.attr('template-exec','init('+attrs.userEdit+')');
            if (attrs.userEditDo) element.attr('template-do',attrs.userEditDo);
            element.removeAttr('user-edit-do');
            element.removeAttr('user-edit');
            element.attr('template-options','{title:"Edit User",height:600,width:600}');
            $compile(element)(scope);
            //ctrl.init(scope,element,attrs);
        }
    }
}]);
angular.module('userModule').directive('userDelete',['$compile',function($compile){
    return {
        restrict: 'A',
        replace: false,
        terminal: true,
        priority: 1000,
        //controller:'edituserController',
        link:function(scope, element, attrs,ctrl) {
            element.attr('template-open','userDelete');
            element.attr('template-type','window');
            element.attr('template-exec','init('+attrs.userDelete+')');
            element.attr('template-options','{title:false}');
            if (attrs.userDeleteDo) element.attr('template-do',attrs.userDeleteDo);
            element.removeAttr('user-delete-do');
            element.removeAttr('user-delete');
            $compile(element)(scope);
            //ctrl.init(scope,element,attrs);
        }
    }
}]);
angular.module('userModule').directive('userCreate',['$compile',function($compile){
    return {
        restrict: 'A',
        replace: false,
        terminal: true,
        priority: 1000,
        //controller:'edituserController',
        link:function(scope, element, attrs,ctrl) {
            element.attr('template-open','userCreate');
            element.attr('template-type','window');
            element.attr('template-exec','init('+attrs.userCreate+')');
            element.attr('template-options','{title:"Create User",height:600,width:600}');
            if (attrs.userCreateDo) element.attr('template-do',attrs.userCreateDo);
            element.removeAttr('user-create-do');
            element.removeAttr('user-create');
            $compile(element)(scope);
            //ctrl.init(scope,element,attrs);
        }
    }
}]);
angular.module('userModule').directive('userView',['$compile',function($compile){
    return {
        restrict: 'A',
        replace: false,
        terminal: true,
        priority: 1000,
        //controller:'edituserController',
        link:function(scope, element, attrs,ctrl) {
            element.attr('template-open','userView');
            var templateType = 'include';
            if (attrs.templateType) templateType = attrs.templateType;
            element.attr('template-type',templateType);
            element.attr('template-exec','init('+attrs.userView+')');
            element.attr('template-options','{title:"View users",height:500,width:900}');
            if (attrs.userViewDo) element.attr('template-do',attrs.userViewDo);
            element.removeAttr('user-view-do');
            element.removeAttr('user-view');
            $compile(element)(scope);
            //ctrl.init(scope,element,attrs);
        }
    }
}]);