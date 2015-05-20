/**
 * Created by Pancho on 21/11/2014.
 */
'use strict';
/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version 1.2.3
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.fn.overlaps = function(selector) {
        return this.pushStack(filterOverlaps(this, selector && $(selector)));
    };

    function filterOverlaps(collection1, collection2) {
        var dims1  = getDims(collection1),
            dims2  = !collection2 ? dims1 : getDims(collection2),
            stack  = [],
            index1 = 0,
            index2 = 0,
            length1 = dims1.length,
            length2 = !collection2 ? dims1.length : dims2.length;

        if (!collection2) { collection2 = collection1; }

        for (; index1 < length1; index1++) {
            for (index2 = 0; index2 < length2; index2++) {
                if (collection1[index1] === collection2[index2]) {
                    continue;
                } else if (checkOverlap(dims1[index1], dims2[index2])) {
                    stack.push( (length1 > length2) ?
                        collection1[index1] :
                        collection2[index2]);
                }
            }
        }

        return $.unique(stack);
    }

    function getDims(elems) {
        var dims = [], i = 0, offset, elem;

        while ((elem = elems[i++])) {
            offset = $(elem).offset();
            dims.push([
                offset.top,
                offset.left,
                elem.offsetWidth,
                elem.offsetHeight
            ]);
        }

        return dims;
    }

    function checkOverlap(dims1, dims2) {
        var x1 = dims1[1], y1 = dims1[0],
            w1 = dims1[2], h1 = dims1[3],
            x2 = dims2[1], y2 = dims2[0],
            w2 = dims2[2], h2 = dims2[3];
        return !(y2 + h2 <= y1 || y1 + h1 <= y2 || x2 + w2 <= x1 || x1 + w1 <= x2);
    }

}));
/*
* Created By: Pancho
* Date: 3-December-2014
* Usage: Provide functionality to call functions as strings
* */
var stringAsMethod = function(strVal){
    var fnName = "";
    var fnParams = [];
    if (strVal.indexOf('(') == ""){
        fnName = strVal;
    } else {
        fnName = strVal.substring(0,strVal.indexOf('('));
    }
    strVal = strVal.replaceAt(strVal.indexOf('('),'');
    strVal = strVal.replaceAt(strVal.lastIndexOf(')'),'');
    strVal = strVal.replace(fnName,'');
    var objCount = 0;
    var lastCommaPosition = 0;
    if (strVal){
        for (var i=0;i<strVal.length;i++){
            if (strVal[i] == ',' && objCount == 0){
                fnParams.push(processParam(strVal.substring(lastCommaPosition,i)));
                lastCommaPosition = i+1;
            }
            if (strVal[i] == '{'){
                objCount++;
            }
            if (strVal[i] == '}'){
                objCount--;
            }
        }
        if (lastCommaPosition == 0){
            fnParams.push(processParam(strVal));
        }
        else
        {
            fnParams.push(processParam(strVal.substring(lastCommaPosition,i)));
        }
    }
    var result = {
        name:fnName,
        params:fnParams
    };
    return result;
};
var executeFunction = function(obj,fnName,fnParams){
    return obj[fnName].apply(null,fnParams);
};
var processParam = function(param){
    return isJson(param) || param;
};
var isJson = function(str) {
    try {
        var parsed = JSON.parse(str);
    } catch (e) {
        return false;
    }
    return parsed;
};
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+1);
};
function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

// This object performance will hold anything related to performance debugging
var performance = {
    log:function(msg){
        console.warn("Performance:" + msg);
    },
    getWatch:function(){
        return (function () {
            var root = $(document.getElementsByTagName('body'));
            var watchers = [];

            var f = function (element) {
                if (element.data().hasOwnProperty('$scope')) {
                    angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                        watchers.push(watcher);
                    });
                }
                angular.forEach(element.children(), function (childElement) {
                    f($(childElement));
                });
            };
            f(root);
            return watchers.length;
        })();
    }
};
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

var showSuccessMessage = function(content, time) {
    showMessage(content,'alert-success',time);
};
var showErrorMessage = function(content, time) {
    showMessage(content,'alert-danger',time);
};
var showMessage = function(content, cl, time) {
    if (!cl) cl = 'alert-danger';
    if (!time) time = 1000;
    $('#apimessages').html(
        $('<div/>')
            .addClass('alert')
            .addClass(cl)
            .addClass('role','alert')
            .addClass('alert-fixed-top')
            .addClass('apiMessage')
            .hide()
            .fadeIn('fast')
            .delay(time)
            .fadeOut('fast', function() { $(this).remove(); })
            //.appendTo(elementsList)
            .html(content));

};

var checkGridDblClick = function(event){
    var clicked = false;
    var target= event.target;
    if(event.originalEvent)
    {
        target= event.originalEvent.target;
    }
    if ($(target).closest('tr.ng-scope').length){
        clicked = true;
    }
    return clicked;
};