/**
 * Created by mschwarz on 06/04/2015.
 */
'use strict';
angular.module('rootModule', ['constantsModule', 'LocalStorageModule']);
angular.module('rootModule').controller('rootController', ['$scope', 'defaultValuesConstant','authService','tabService','navigation','openDialogService','$q','$state','loadService', function ($scope,defaults,authService,tabService,navigation,openDialogService,$q,$state,loadService) {
    $scope.$root.session = authService.getSession();
    $scope.$root.sysDate = new Date();
//TODO: Add custom actions to the addtab directive and function
    $scope.$root.addTab = function(stateName,title,duplicate,refresh,onDuplicate,onOpen,params){
        tabService.addTab(stateName,title,duplicate,refresh,onDuplicate,onOpen,params);
    };
    $scope.$root.removeTab = function(e){
        if (e.currentTarget) e = e.currentTarget;
        tabService.removeTab(e);
    };
    $scope.$root.removeAllTabs = function(){
        tabService.clearTabs();
    };
    $scope.$root.removeTabsExceptSelf = function(e){
        if (e){
            if (e.currentTarget) e = e.currentTarget;
            tabService.removeTabsExceptSelf(e);
        }
    };
    $scope.$root.go = function(stateName,params,options){
        return navigation.go(stateName,params,options);
    };
    $scope.$root.getUrl = function(stateName){
        return navigation.getUrl(stateName);
    };
    $scope.$root.getState = function(stateName){
        return navigation.getState(stateName);
    };
    $scope.$root.openWindow = function(parameters){
        //TODO: Develop a way to call dynamic windows
        if (arguments.length > 1) {
            var params = {};
            params.scope = arguments[0];
            if (arguments[1].indexOf('<') != -1){
                params.content =  arguments[1];
            } else if (arguments[1].indexOf('.html') != -1) {
                params.contentUrl = arguments[1];
            }
            params.controller = arguments[2];
            params.init = arguments[3];
            parameters = params;
        }
        return openDialogService.showWindow(parameters);
    };
    $scope.$root.getSelectedGridItem = function(scope,grd){
        var grid = grd;
        if (!grid){
            $scope.$root.openWindow({options:{title:false,modal:true,visible:false},content:'<div>A grid is not present to retrieve data</div>',scope:scope});
            return false;
        }
        var selectedRow = grid.select();
        var dataItem = grid.dataItem(selectedRow);
        if (selectedRow.length > 0) {
            return dataItem;
        }
        else {
            $scope.$root.openWindow({options:{title:false,modal:true,visible:false},contentUrl:'app/common/templates/windows/selectRow.html',scope:scope});
            //width:"400px"
            //height:"110px"
            //kendo-window="selectRow"
        }
    };
    $scope.$root.showConfirmation = function(scope,message,title){
        var deferred = $q.defer();
        var onClose = function(e){
            deferred.resolve(false);
        };
        scope.acceptMessage = function(s,e){
            deferred.resolve(true);
            scope.$root.closeParentWindow(s,e);
        };
        scope.cancelMessage = function(s,e){
            deferred.resolve(false);
            scope.$root.closeParentWindow(s,e);
        };
        var accept = '<ui-button ng-click="acceptMessage(this,$event)" text="Accept"></ui-button>';
        var cancel = '<ui-button ng-click="cancelMessage(this,$event)" text="Cancel"></ui-button>';
        var html = '<div>'+message+'</div><br>'+accept+cancel;
        $scope.$root.openWindow({scope:scope,content:html,options:{title:title},onClose:onClose});
        return deferred.promise;
    };
    $scope.$root.showYesNoConfirmation = function(scope,message,title){
        var deferred = $q.defer();
        var onClose = function(e){
            deferred.resolve(false);
        };
        scope.acceptMessage = function(s,e){
            deferred.resolve(true);
            scope.$root.closeParentWindow(s,e);
        };
        scope.cancelMessage = function(s,e){
            deferred.resolve(false);
            scope.$root.closeParentWindow(s,e);
        };
        $scope.$root.openWindow({options:{title:false,modal:true,visible:false},contentUrl:'app/common/templates/windows/deleteConfirm.html',scope:scope,onClose:onClose});
        return deferred.promise;
    };
    $scope.$root.getParentWindow = function(scope,event){
        if (event && event.currentTarget){
            event = event.currentTarget;
        }
        var wnd = $(event).closest(".k-window-content");
        if (wnd && wnd.length > 0 ){
            return wnd.data('kendoWindow');
        }
    };
    $scope.$root.closeParentWindow = function(scope,event,result){
        var wnd = $scope.$root.getParentWindow(scope,event);
        if (wnd) {
            wnd.result = result;
            wnd.close();
        }
    };
    $scope.$root.showMessage = function(message,className,timeout){
        showMessage(message,className,timeout);
    };
    $scope.$root.showSuccessMessage = function(message,timeout){
        showSuccessMessage (message,timeout);
    };
    $scope.$root.showErrorMessage= function(message,timeout){
        showErrorMessage(message,timeout);
    };
    $scope.$root.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

    });
    $scope.$root.cleanLoaders = function(){
        loadService.cleanLoaders();
    };
    $scope.$root.resolveLoader = function(id){
        loadService.resolveLoader(id);
    };
    $scope.$root.rejectLoader = function(id){
        loadService.rejectLoader(id);
    };
    $scope.$root.resolveLoaders = function(){
        loadService.resolveLoaders();
    };
    $scope.$root.rejectLoaders= function(){
        loadService.rejectLoaders();
    };
    $scope.$root.startLoader = function (id){
        loadService.startLoader(id);
    };
    $scope.$root.containsRole = function (list, roleID, projectID) {
        var found = false;
        var listIndex = 0;

        while (!found && listIndex < list.length) {
            var listItem = list[listIndex];

            if (listItem &&
                listItem.Role && listItem.Role.RoleID == roleID &&
                (!projectID || (listItem.Project && listItem.ProjectID == projectID))) {
                found = listItem.Role;
            }

            listIndex++;
        }

        return found;
    };
}]);