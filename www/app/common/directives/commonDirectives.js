/**
 * Created by Pancho on 03/02/2015.
 */
'use strict';
angular.module('commonDirectivesModule', ['constantsModule', 'LocalStorageModule']);
angular.module('commonDirectivesModule').directive('templateOpen',['$parse','$compile',function($parse,$compile){
    return {
        restrict: 'A',
        replace: false,
        terminal: true,
        priority: 1000,
        link:function(scope,element,attrs){
            //Types of templates
            // window: opens up a new window
            // url: opens up content in the view
            if (scope && scope.$root){
                var state = scope.$root.getState(attrs.templateOpen);

                if (!attrs.templateType) attrs.templateType = "window";
                var ifAction;
                switch (attrs.templateType){
                    case "window":
                        //element.attr('ng-init','init('+ execParams  +')' + execFunc);
                        var options = "";
                        if (attrs.templateOptions){
                            options = ",options:"+attrs.templateOptions;
                        }
                        var events = "";
                        var init = "";
                        if (attrs.templateExec) init = ",init:\"" + attrs.templateExec  + "\"";
                        var obj = "{scope:this,contentUrl:'"+ state.url +"',controller:'" + state.controller + "' "  + init + " " + events +  " " + options + "}";
                        //element.attr('if-action', "openWindow(this,'" + state.url + "','" + state.controller + "')");
                        ifAction = "openWindow(" + obj + ")";
                        break;
                    case "url":
                        ifAction = "go('" + attrs.templateOpen + "')";
                        break;
                    case "include":
                        element.attr('ng-include','');
                        element.attr('src',"'" + state.url + "'");
                        element.attr('ng-controller',state.controller);
                        if (attrs.templateExec){
                            element.attr('ng-init',attrs.templateExec);
                        }
                }
                //if (attrs.templateIf){
                //    var result = $parse(attrs.templateIf)(scope); //,{$event:event}
                //    //Helds an async result;
                //    if (result.then){
                //        result.then(function(r){
                //            element.attr('if-action',ifAction);
                //            $compile(element)(scope);
                //        });
                //    } else if (result === true) {
                //        element.attr('if-action',ifAction);
                //        $compile(element)(scope);
                //    }
                //}
                //else {
                if (ifAction){
                    var ifAdd = "";
                    if (attrs.templateIf) ifAdd = attrs.templateIf + ";";
                    element.attr('if-action',ifAdd+ifAction);
                }
                //}
                if (!attrs.hasOwnProperty('templateOn')) attrs.templateOn = "click";
                element.attr('if-on', attrs.templateOn);
                if (attrs.templateDo) element.attr('if-do', attrs.templateDo);
                if (attrs.templateElseDo) element.attr('else-do', attrs.templateElseDo);
                element.removeAttr('template-on');
                element.removeAttr('template-do');
                element.removeAttr('template-else-do');
                element.removeAttr('template-open');
                element.removeAttr('template-type');
                $compile(element)(scope);
            }

        }
    }
}]);
angular.module('commonDirectivesModule').directive('staticData',['$parse',function($parse){
    return {
        link:function(scope,element,attrs){
            scope.$watch(function(){return $parse(attrs.staticData)(scope);},function(val){scope.data = val;});
            //scope.$watch(function(){return scope.data},function(val){return console.log(val);});
        }
    }
}]);
angular.module('commonDirectivesModule').directive('service',['$injector','$parse',function($injector,$parse){
    return {
        link:function(scope,element,attrs){
            var fn = 'getData()';
            if (attrs.serviceMethod) fn = attrs.serviceMethod;
            var service = $injector.get(attrs.service);
            scope.data = {};
            var setData = function(response){
                if (response){
                    if (response.then) {
                        response.then(function(result){
                            if (result && result.data){
                                scope.data = result.data;
                            }
                        });
                    } else {
                        scope.data = response.data || response;
                    }
                }
            };
            //TODO: Fix this directive and also DropDown directive to be more cleaner.
            attrs.$observe('watchMethod',function(val) {
                //var response = $parse(fn)(service);
                if (val) {
                    var objFn = stringAsMethod(fn);
                    var response = executeFunction(service, objFn.name, [val]);
                    setData(response);
                }
            });
            var objFn = stringAsMethod(fn);
            var response = executeFunction(service,objFn.name,objFn.params);
            //var response = $parse(fn)(service);
            setData(response);

        }
    }
}]);
angular.module('commonDirectivesModule').directive('showMessage',[function(){
    return {
        link:function(scope,elem,attrs){
            var type="alert-success";
            var time=attrs.messageTime||1000;
            switch (attrs.messageType){
                case 'a':
                    type = "alert-danger";
                    break;
                case 'e':
                    type = "alert-danger";
                    break;
                case 's':
                    type = "alert-success";
                    break;

            };
            elem.on('click',function(){
                showMessage(attrs.showMessage,type,time);
            })
        }
    }
}]);
angular.module('commonDirectivesModule').directive('ifAction',['$parse','$compile',function($parse,$compile){
    return {
        link:function(scope,elem,attrs){
            var doAction = function(actions,index,r){
                func(actions,index);
                var perform = r?attrs.ifDo:attrs.elseDo;
                if (perform && index >= actions.length){
                    var params = stringAsMethod(perform).params;
                    var response = {};
                    console.log(params);
                    response[params[0]] = r;
                    $parse(perform)(scope,response);
                }
            };
            var func = function(actions,index){
                if (!actions || index >= actions.length) return;
                var result = $parse(actions[index])(scope); //,{$event:event}
                index++;
                //Helds an async result;
                if (result && result.then){
                    result.then(function(r){
                        doAction(actions,index,r);
                    });
                }
                if (result && !result.then){
                    doAction(actions,index,result);
                }
                //if (!result) console.error("The function called produced an invalid result, maybe it doesn't exists on scope. Function:" + actions[index]);
            };
            var actions = attrs.ifAction.split(";");
            var index = 0;
            if (attrs.ifOn){
                elem.on(attrs.ifOn,function(event) {
                    //TODO: Temporary workaround for overlapping elements, try to fix this this is not so critical
                    event.stopPropagation();
                    //TODO: patch for grid double click, find a more elegant way to do this.
                    if (attrs.ifOn == "dblclick" && attrs.hasOwnProperty('kendoGrid')){
                        if (checkGridDblClick(event)) func(actions,index);
                    } else {
                        func(actions,index);
                    }
                });
            } else {
                func(actions,index);
            }
        }
    }
}]);

angular.module('commonDirectivesModule').directive('iconAutoComplete', ['$injector', '$location', '$state', '$parse', 'defaultValuesConstant', function ($injector, $location, $state, $parse, defaultValuesConstant) {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            return ('app/common/templates/kendo/iconAutoComplete.html')
        },
        link: function (scope, element, attrs) {
            var catalogClientService = $injector.get('catalogClientService');
            catalogClientService.getAllIcons().then(function(response){
                scope.iconsList = [];
                scope.selectedSVG = null;
                scope.iconsList = response;
                scope.iconModel = '';

                scope.drawIcons = function(){
                    for (var i = 0; i < scope.iconsList.length; i++) {
                        var currentSvg = scope.iconsList[i].SVGData;
                        var currentId = scope.iconsList[i].IconGlyphID;
                        $('.'+currentId).html(currentSvg);
                        var aCompleteIcon = $('div.'+ currentId);
                        aCompleteIcon.css("background-color", scope.selectedColor);
                    }
                };
                scope.$watch(function() {
                    return $parse(attrs.iconColor)(scope);}, function(val) {
                    if (val){
                        scope.selectedColor = '#'+val.substring(3);
                    }
                });
                scope.$watch(function() {
                    return $parse(attrs.iconText)(scope);}, function(value) {
                    scope.selectedText = value;
                        scope.drawingIcon(scope.selectedSVG, scope.selectedText);
                });
                scope.$watch(function() {
                    return $parse(attrs.iconSelected)(scope);}, function(value) {
                    if (value){
                        scope.selectedIcon = value;
                    }
                });

                scope.$watch(function() {
                    return catalogClientService.getCurrentIconGlyphId()}, function(val) {
                    scope.selectedIcon = val;
                    catalogClientService.setCurrentIconGlyphId(scope.selectedIcon);
                    for (var i = 0; i < scope.iconsList.length; i++) {
                        if (scope.iconsList[i].IconGlyphID == scope.selectedIcon) {
                            scope.selectedSVG = scope.iconsList[i].SVGData;
                            scope.iconModel = scope.iconsList[i].IconGlyphID;
                            scope.drawingIcon(scope.selectedSVG, scope.selectedText);
                        }
                    }
                });

                scope.$watch(function() {
                    return scope.selectedIcon}, function(val) {
                        scope.selectedIcon = val;
                        catalogClientService.setCurrentIconGlyphId(scope.selectedIcon);
                        if(scope.selectedIcon!= defaultValuesConstant.defaultGUID) {
                            for (var i = 0; i < scope.iconsList.length; i++) {
                                if (scope.iconsList[i].IconGlyphID == scope.selectedIcon) {
                                    scope.selectedSVG = scope.iconsList[i].SVGData;
                                    scope.iconModel = scope.iconsList[i].IconGlyphID;
                                    i = scope.iconsList.length;
                                    scope.drawingIcon(scope.selectedSVG, scope.selectedText);
                                }
                            }
                        }
                        else {
                            scope.drawingIcon(" ", " ");
                        }
                });
                scope.$watch(function () {
                    return scope.selectedColor;
                }, function (value) {
                    if (value){
                        var element = angular.element('#iconId');
                        for (var i = 0; i < scope.iconsList.length; i++) {
                            var currentSvg = scope.iconsList[i].SVGData;
                            var currentId = scope.iconsList[i].IconGlyphID;
                            var svg = $('.'+currentId);
                            if (svg)
                                svg.css("background-color", scope.selectedColor);
                        }
                        scope.drawingIcon(scope.selectedSVG, scope.selectedText);
                    }
                });
            });
            scope.onSelect = function(e){
                scope.selectedIcon = e.iconModel;
            }
        }
    };
}]);

angular.module('commonDirectivesModule').directive('iconDrawing', ['$injector', '$location', '$state', '$parse', function ($injector, $location, $state, $parse) {
    return {
        replace: true,
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            return ('app/common/templates/kendo/iconDrawingArea.html')
        },
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return scope.selectedColor;
            }, function (value) {
                if (scope.selectedSVG){
                    scope.drawingIcon(scope.selectedSVG, scope.selectedText);
                }
            });
            scope.drawingIcon = function(currentSVG, text){
                if(currentSVG && currentSVG.length > 0){
                    if(text || text==''){
                        var iconArea =  $('div#renderIconArea');
                        iconArea.css("background-color", scope.selectedColor);
                        iconArea.html(currentSVG);
                        var svgIconChild = $('div#renderIconArea > svg:first-child');
                        svgIconChild.attr("id", 'iconDraw'+scope.selectedIcon);
                        var svgIcon = document.getElementById('iconDraw'+scope.selectedIcon);
                        if (svgIcon){
                            var textElement = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                            textElement.setAttribute("x","37");
                            textElement.setAttribute("y","40");
                            textElement.setAttribute("font-size","16");
                            textElement.setAttribute("font-family","arial");
                            textElement.setAttribute("style","text-anchor: middle");
                            textElement.textContent = '';
                            textElement.textContent = text;
                            svgIconChild.append(textElement);
                        }
                    }
                    else {
                        var iconArea =  $('div#renderIconArea');
                        iconArea.css("background-color", scope.selectedColor);
                        iconArea.html(currentSVG);
                    }
                }
            }
        }
    }
}]);

angular.module('commonDirectivesModule').directive('clickButtonOnce', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.bind('click', function () {
                $timeout(function () {
                    element.attr('disabled', true);
                }, 0);
                $timeout(function () {
                    element.attr('disabled', false);
                }, 2500);
            });
        }
    };
});

// Directive created to add the keyboard event on grids, it needs the Grid's Id in order to get the Grid and bind the keyboardEvent on it.
// The deleteKeyboard function has to be defined on the controller which the corresponding behavior for each case.
angular.module('commonDirectivesModule').directive('deleteKeyboard', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var grid = attrs.id;
            if (grid) {
                scope.$watch( function() {
                    return $('#'+grid).data("kendoGrid");
                },function(val) {
                    if (val && scope.deleteKeyboard) {
                        val.table.off("keydown", scope.deleteKeyboard);
                        val.table.on("keydown", scope.deleteKeyboard);
                    }
                });
            }
        }
    };
});

