/**
 * Created by Pancho on 28/01/2015.
 */
'use strict';
angular.module('mainModule').directive('tabElement',['tabService','$parse',function(tabService,$parse){
    //TODO: Try to see why this directive is working sometimes for some elements and sometimes don't
    return {
        link:function(scope,elem,attrs){
            var stateName = attrs.tabElement;
            var title = attrs.tabTitle;
            var duplicate = attrs.tabDuplicate || false;
            var refresh = attrs.tabRefresh || false;
            var params = attrs.tabParams || false;
            if (duplicate && duplicate != "false" && attrs.tabOnDuplicate){
                $parse(attrs.tabOnDuplicate)(scope);
            }
            //TODO: check how to pass this function pointer.
            if (attrs.tabOnOpen) $parse(attrs.tabOnOpen)(scope);
            elem.on("click",function(e){
                tabService.addTab(stateName,title,duplicate,refresh,null,null,params);
            });
        }
    }
}]);
angular.module('mainModule').directive('tabbedHolder',['tabService',function(tabService){
    return {
        restrict:'E',
        link:function(scope,elem,attrs){
            tabService.init(scope,elem,attrs);
        }
    }
}]);
angular.module('commonDirectivesModule').directive('openDialog',['$parse',function($parse){
    return {
        link:function(scope,elem,attrs){
            elem.on('click',function(){
            });
        }
    }
}]);
