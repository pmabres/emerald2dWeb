/**
 * Created by fmabres on 20/04/2015.
 */
'use strict';
angular.module('appModule').factory('loadService',['$http','$q','$compile','$parse',function($http,$q,$compile,$parse){
    var loaders = [];
    var loaderRequests = [];
    loaderRequests.removeRequest = function(id,type){
        loaderRequests.splice(loaderRequests.getRequestIndex(id,type));
    };
    loaderRequests.getRequest = function(id,type){
        return loaderRequests[loaderRequests.getRequestIndex(id,type)];
    };
    loaderRequests.getRequestIndex = function(id,type){
        for (var i=0;i<loaderRequests.length;i++){

            if ((loaderRequests[i].id == id && !type) || (loaderRequests[i].id == id && type && type == loaderRequests[i].type)) {
                return i;
            }
        }
        return -1;
    };
    loaderRequests.processRequest = function(id,type){
        var index = loaderRequests.getRequestIndex(id,type);
        var request = loaderRequests[index];
        if (index != -1){
            switch (request.type){
                case requestTypes.start:
                    load.startLoader(id);
                    break;

            }
            loaderRequests.splice(loaderRequests[index]);
        }
    };
    var requestTypes = {start:0,resolve:1,reject:2};
    function loaderRequest(id,type,timeout){
        timeout = timeout || 10;
        var request = {id:id,type:type,timeout:timeout};
        var timer = setTimeout(function(){
            loaderRequests.removeRequest(request.id);
        },timeout*1000);
        return request;
    }
    //var loadingHtml = '<div class="loading"></div>';
    var loadingHtml = '<img src="Content/images/LoadingAnimation.gif">';
    var defaultTemplate = '<div class="loading-filler loading-fade"><div class="loading-container"><div class="loading-box">' + loadingHtml + '</div></div>';
    var states = {standby:0,loading:1,resolved:2,rejected:3};
    var loaderAR = function(loader,add){ //add remove method
        if (loader && loader.target.length){
            if (!loader.added && add){
                //$(loader.target[0]).append(loader.template).hide().fadeIn('fast');
                $(loader.target[0]).append(loader.template);
                if (loader.timeout) setTimeout(function(){loaderAR(loader,false)},loader.timeout*1000);
                loader.added = add;
            }
            if (loader.added && !add){
                //loader.template.fadeOut('fast', function() { loader.template.remove(); });
                loader.template.remove();
                loader.added = add;
            }
        }
    };
    var load = {
        addLoader:function(element,target,callback,timeout,template){
            var loader = {};
            //var idx = loaders.length;
            var loaderId = element.attr('loader');
            if (arguments.length == 1){
                loader = arguments[0];
                //loader.index = idx;
            } else {
                if (!loaderId) loaderId = Math.random()*10000;
                if (!timeout) timeout = 30;
                if (!template) template = defaultTemplate;
                if (!target) target = $('body');
                loader = {
                    //index:idx,
                    id:loaderId,
                    element:element,
                    timeout:timeout,
                    template:$(template),
                    target:target,
                    state:states.standby,
                    currentTime:0,
                    added:false,
                    callback:callback
                }
            }
            var existingLoader = load.getLoader(loader.id);
            if (!existingLoader){
                loaders.push(loader);
            } else {
                existingLoader.element = element;
                existingLoader.state = states.standby;
                existingLoader.target = loader.target;

            }
            loaderRequests.processRequest(loader.id,requestTypes.start);
        },
        removeLoader:function(id){
            var index = load.getLoaderIndex(id);
            var loader = loaders[index];
            loaderAR(loader,false);
            loaders.splice(index);
            return loader;
        },
        cleanLoaders:function(){
            for (var i=0;i<loaders.length;i++){
                var loader = loaders[i];
                loaderAR(loader,false);
            }
            loaders = [];
        },
        resolveLoader:function(id,timeout){
            var loader = load.getLoader(id);
            if (load.queueLoader(id,requestTypes.start,timeout)) return;
            if (loader){
                loader.state = states.resolved;
                loaderAR(loader,false);
            }
        },
        rejectLoader:function(id,timeout){
            var loader = load.getLoader(id);
            if (load.queueLoader(id,requestTypes.start,timeout)) return;
            if (loader){
                loader.state = states.rejected;
                loaderAR(loader,false);
            }
        },
        resolveLoaders:function(){
            for (var i=0;i<loaders.length;i++){
                var loader = loaders[i];
                loader.state = states.resolved;
                load.queueLoader(id,requestTypes.start,timeout);
                loaderAR(loader,false);
            }
        },
        rejectLoaders:function(){
            for (var i=0;i<loaders.length;i++){
                var loader = loaders[i];
                loader.state = states.rejected;
                loaderAR(loader,false);
            }
        },
        startLoader:function(id,timeout){
            var loader = load.getLoader(id);
            //This will check if the loader is not available then will queue.
            if (load.queueLoader(id,requestTypes.start,timeout)) return;
            if (loader){
                loader.state = states.loading;
                loaderAR(loader,true);
            }
        },
        queueLoader:function(id,type,timeout){
            var loader = load.getLoader(id);
            // This line checks If the element exists in the dom. If not exists yet, then it
            //$.contains(document, loader.element[0])
            if (!loader || (loader && !$.contains(document, loader.element[0]))) {
                var request = new loaderRequest(id,type,timeout);
                loaderRequests.push(request);
                return true;
            }
        },
        getLoader:function(id){
            return loaders[load.getLoaderIndex(id)];
        },
        getLoaderIndex:function(id){
            for (var i=0;i<loaders.length;i++){
                if (loaders[i].id == id) return i;
            }
        }
    };
    return load;
}]);
