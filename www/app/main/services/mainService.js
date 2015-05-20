/**
 * Created by Pancho on 06/02/2015.
 */
'use strict';
angular.module('mainModule').factory('navigation', ['$http', 'backEndConstant','$q','$state', '$compile', function ($http, backEndConstant,$q, $state, $compile) {
    var _navObj = {};
    _navObj.getUrl = function(stateName){
        var state = $state.get(stateName);
        var stateUrl;
        if (state && state.views){
            for (var a in state.views){
                //if (a != 'fsContent'){
                //    console.warn('The called State: "' + stateName + '" is not under fsContent view, maybe you\'re trying to transition to a tabbed state');
                //}
                //else {
                stateUrl = state.views[a].templateUrl;
                break;
                //}
            }
            if (!stateUrl) console.error('There is no valid URL for this state:' + stateName);
            return stateUrl;
        } else {
            console.error('State: ' + stateName + ' Is not a valid state. Please confirm that is in your routing.js file');
        }
    };
    _navObj.getState = function(stateName){
        var state = $state.get(stateName);
        var stateObj = {url:'',controller:''};
        if (state && state.views){
            for (var a in state.views){
                //if (a != 'fsContent'){
                //    console.warn('The called State: "' + stateName + '" is not under fsContent view, maybe you\'re trying to transition to a tabbed state');
                //}
                //else {
                stateObj.url = state.views[a].templateUrl;
                stateObj.controller = state.views[a].controller;
                break;
                //}
            }
            if (!stateObj.url) console.error('There is no valid URL for this state:' + stateName);
            return stateObj;
        } else {
            console.error('State: ' + stateName + ' Is not a valid state. Please confirm that is in your routing.js file');
        }
    };
    _navObj.go = function(stateName,params,options){
        var state = $state.get(stateName);
        if (state && state.views){
            $state.go(stateName,params,options);
        } else {
            console.error('State: ' + stateName + ' Is not a valid state. Please confirm that is in your routing.js file');
        }
    };
    return _navObj;
}]);
angular.module('mainModule').factory('tabService', ['$http', 'backEndConstant','$q','$state', '$compile', function ($http, backEndConstant,$q, $state, $compile) {
    var serviceBase = backEndConstant.apiServiceBaseUri;
    var _scope;
    var _tabHolder;
    var _elem;
    var _attrs;
    var self = this;
    var _init = function(elem,attrs,scope){

    };
    var _setTabHolder = function(elem) {
        _tabHolder = elem.kendoTabStrip().data("kendoTabStrip");
        _tabHolder.options.animation.open.effects = "";
    };
    var _init = function(scope,elem,attrs){
        _attrs = attrs;
        _elem = elem;
        _scope = scope;
        _setTabHolder(elem);
        //_scope.$root.$on('addTab',function(event,stateName,title,duplicates){
        //    self.addTab(stateName,title,duplicates);
        //});

    };
    var _clearTabs = function(){
        var tabs = _tabHolder.items();
        for (var t=tabs.length-1;t>=0;t--){
            _tabHolder.remove(t);
        }
    };
    var _removeTabsExceptSelf = function(e){
        var tabs = _tabHolder.items();
        //console.log($(e).closest("li").find('k-item'));
        var tab = $(e).closest(".k-item");
        if (tab.length == 0){
            tab = $("li[aria-controls='"+$(e).closest("div[role='tabpanel']").attr('id')+"']") ;
        }
        if (tab.length > 0){
            for (var t=tabs.length-1;t>=0;t--){
                if ($(tabs[t]).find('div').attr('id').trim().toLowerCase() != tab.find('div').attr('id').trim().toLowerCase())
                    _tabHolder.remove($(tabs[t]));
            }

        }

    };
    var _removeTab = function(e){
        //var tabStrip = $('#tabHolder').data('kendoTabStrip');
        //console.log($(e).closest("li").find('k-item'));
        var tab = $(e).closest(".k-item");
        if (tab.length == 0){
            tab = $("li[aria-controls='"+$(e).closest("div[role='tabpanel']").attr('id')+"']") ;
        }
        _tabHolder.remove(tab);
        if (_tabHolder.contentElements.length)
            _tabHolder.select(_tabHolder.contentElements.length-1);
    };
    var _addTab = function(stateName,title,duplicates,refresh,tabOnDuplicate,tabOnOpen,params){
        var states = $state.get();
        var tabs = _tabHolder.items();
        var content = "";
        var exists = false;
        duplicates = duplicates || duplicates == "true";
        refresh = refresh || refresh == "true";
        if (!title) title = stateName;
        var counter = 1;
        for (var t=tabs.length-1;t>=0;t--){
            //TODO: Check what to do with this conditional once duplicates tabs are allowed
            //if ($(tabs[t]).find('div').attr('id').trim().toLowerCase().indexOf('tab'+ stateName.toLowerCase()) == 0){
            if ($(tabs[t]).find('div').attr('id').trim().toLowerCase() == 'tab'+ stateName.toLowerCase()){
                if (!duplicates){
                    console.warn("This tab already exists");
                    exists = true;
                }
                counter += parseInt($(tabs[t]).find('div').attr('id').trim().toLowerCase().replace('tab'+ stateName.toLowerCase(),"").trim());
                break;
            }
        }
        for (var i=0;i<states.length;i++){
            if (states[i].name == stateName){
                for (var a in states[i].views){
                    //content+='<div ui-view="'+a+'"></div>';
                    var init = "";
                    var tmpParams = [];
                    if (arguments.length > 7){
                        for (var arg=6;arg<arguments.length;arg++){
                            tmpParams.push(arguments[arg]);
                        }
                        params = tmpParams;
                    }
                    if (params){
                        if (params.constructor === Array){
                            params = params.join(',');
                        }
                        params = "'" + params.replace(/'/g,"").replace(/,/g,"','") + "'";
                        init = 'ng-init="setParams('+ params +')"';
                    }
                    content+='<div ng-controller="' + states[i].views[a].controller + '" '+init+' ng-include="\'' + states[i].views[a].templateUrl + '\'"></div>';
                    //content+='<div ui-view="'+a+'"></div>';
                }
                break;
            }
        }
        if (!content) throw "Error adding the tab. State not found or Views property not present";
        if (refresh && _tabHolder.contentElement(t) && (!duplicates) && t!=-1){
            var compile = $(_tabHolder.contentElement(t)).html(content);
            $compile(compile)(_scope);
        }
        if (!duplicates) {
            if (t!=-1) _tabHolder.select(t);
            counter = "";
        }
        if (!exists){
            if (tabs.length >= 5){
                showErrorMessage('You can\'t add more than 5 tabs');
                return;
            }
            var tab = _tabHolder.append({
                text:'<div id="' + 'tab'+ stateName + counter + '">'+title + counter +'    <span class="tabClose" ng-click="removeTab($event)"></span></span></div>',
                content:content,
                encoded:false
            });
            //$compile(tab.element)(_scope);
            $compile(tab.contentElements[tab.contentElements.length-1])(_scope);
            $compile(tab.tabGroup[0].children[tab.contentElements.length-1])(_scope);
            tab.select(tab.contentElements.length-1);
            //_scope.$root.go(stateName);
            if (tabOnOpen) tabOnOpen();
        }else {
            if (tabOnDuplicate) tabOnDuplicate();
        }
    };
    var tabService = {};
    tabService.init = _init;
    tabService.addTab = _addTab;
    tabService.removeTab = _removeTab;
    tabService.clearTabs = _clearTabs;
    tabService.removeTabsExceptSelf = _removeTabsExceptSelf;
    return tabService;
}]);


