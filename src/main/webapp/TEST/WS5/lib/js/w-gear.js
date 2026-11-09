/*
2016.09.09
- It has fixed that close event listener doesn't work.

2016.08.22
- getValue, setValue APIs are added to get / set property value.

2016.07.04
 - API renamed : get/setScreenUID -> get/setBrowserUID

2016.06.21
 - setScreenUID ans getScreenUID API is added to communicate between browsers.
 - rename : getUUID -> getWGearUID
*/

function WGear( cfg ) {
    var ws = null;
    var config = {
        uuid : null,
        //url : "ws://wgear.io",
        url : "ws://127.0.0.1",
        port : 3101,  // port number
        dummyMode : false, // dummy mode
        autoCreate : false, // mode automatically to create W-Gear.dll after connected.
        keepAliveTimeout : 0 // wait a set time (secs) after disconnected.
    };
    var callback_list = {};
    var callback_list_idx = 0;
    var listener_list = {};
    var closed_listener_list = [];
    var response_func_list = [];
	
    var is_created = false;
    var opened_modules = ["WGearRoot"];
    
    function initialize()
    {
        callback_list = {};
        callback_list_idx = 0;
        listener_list = {};
        //closed_listener_list = [];
        response_func_list = [];
        
        is_created = false;
        opened_modules = ["WGearRoot"];
    };

    function isConnected() {
        if(ws && ws.readyState == WebSocket.OPEN)
            return true;
        else
            return false;
    };
    
    function isCreated() {
        if(isConnected() && is_created)
            return true;
        else
            return false;
    };
    
    function isOpened(service)
    {
        if(opened_modules.indexOf(service) >= 0)
            return true;
        else
            return false;
    };

    if(typeof cfg == 'string') {
        config.uuid = cfg;
    } else {
        if(cfg){
            if(typeof cfg.url != 'undefined') {
                config.url = cfg.url;
            }
            if(typeof cfg.mode != 'undefined') {
                config.mode = cfg.mode;
            }
            if(typeof cfg.port != 'undefined') {
                config.port = cfg.port;
            }
            if(typeof cfg.dummyMode != 'undefined') {
                config.dummyMode = cfg.dummyMode;
            }
            if(typeof cfg.autoCreate != 'undefined') {
                config.autoCreate = cfg.autoCreate;
            }
            if(typeof cfg.keepAliveTimeout != 'undefined') {
                config.keepAliveTimeout = cfg.keepAliveTimeout;
            }
            if(typeof cfg.uuid != 'undefined') {
                config.uuid = cfg.uuid;
            }
        }
    };

    function doInit (msg) {
        switch (msg.action) {
            case 'info':
                setUUID(msg.data.uuid);
                sendData( JSON.stringify({type : 'config', action :'info', data : config }) );
                break;
        }
    };

    function setUUID (uuid) {
        if(config.uuid) {
            return false;
        }
        config.uuid = uuid;
        ngmf._debug('config :', config);
        return true;
    };

    var getWGearUID = function() {
        return config.uuid;
    };

    var connect = function() {
        return new Promise(function(resolve, reject) {
            if(ws == null || ws.readyState == WebSocket.CLOSED) {
                ws = new WebSocket(config.url + ":"+config.port);
                ws.onopen = function( evt ) {
                    ngmf._debug('Connection is opened');
                    //resolve();
                };

                ws.onmessage = function ( msg ) {
                    ngmf._debug('onmessage', msg);
                    var data = JSON.parse(msg.data);
                    switch(data.type) {
                        case 'function':
                        case 'GetProperty':
                        case 'SetProperty':
                            executCallback( data );
                            break;
                        case 'listener':
                            executeListener( data );
                            break;
                        case 'config':
                            doInit( data );
                            resolve();
                            break;
                    }
                };

                ws.onclose = function () {
                    initialize();
                    ngmf._debug('Connection is closed');
                    if(closed_listener_list) {
                        for(var i = 0; i < closed_listener_list.length; i++) {
                            try {
                                closed_listener_list[i]();
                            } catch(ee) {
                                ngmf._error("Error::",ee ); 
                            }
                        }
                    }
                };

                ws.onerror = function (err) {
                    ngmf._error('Error : ', err);
                    initialize();
                    reject();
                };
            } else {
                ngmf._debug('Connection is already opened');
                resolve();
            }
        });
    };

    var disconnect = function() {
        return new Promise(function(resolve, reject) {
            if(ws && ws.readyState == WebSocket.OPEN) {
                ws.onclose = function () {
                    ngmf._debug('Connection is closed by user');
                    /*
                    if(closed_listener_list) {
                        for(var i = 0; i < closed_listener_list.length; i++) {
                            try {
                                closed_listener_list[i]();
                            } catch(ee) {
                                ngmf._error("Error::",ee );
                            }
                        }
                    }
                    */
                    initialize();
                    resolve();
                };

                ws.onerror = function (err) {
                    ngmf._error('Error : ', err.data);
                    initialize();
                    reject();
                };
                ws.close();
            } else {
                ngmf._debug('Connection is already closed');
                resolve();
            }
        });
    };

    function sendData(msg) {
        if(ws && ws.readyState == WebSocket.OPEN) {
            ws.send(msg);
        } else {
            ngmf._debug('The connection status is closed.');
        }
    };

    function executCallback (msg){
        // msg format
        //{
        //  service:msg.service,
        //  action:msg.action,
        //  args:msg.args,
        //  options:msg.options,
        //  error:error,
        //  result:result
        //}
        if(!callback_list[msg.service]) {
            ngmf._debug('The callback(service) does not exist.', msg.service);
            return;
        }
        if(!callback_list[msg.service][msg.action]) {
            ngmf._debug('The callback(action) does not exist.', msg.action);
            return;
        }
        if(!callback_list[msg.service][msg.action][msg.options.cl_uid]) {
            ngmf._debug('The callback(cl_uid) does not exist.', msg.options.cl_uid);
            return;
        }
        if(callback_list[msg.service][msg.action][msg.options.cl_uid].fail && msg.error) {
            callback_list[msg.service][msg.action][msg.options.cl_uid].fail(msg.error);
        } else if(callback_list[msg.service][msg.action][msg.options.cl_uid].success){
            callback_list[msg.service][msg.action][msg.options.cl_uid].success(msg.result);
        }
        callback_list[msg.service][msg.action][msg.options.cl_uid] = null;
    };

    var exec = function (success, fail, type, service, action, args, options) {
        args = args || [];
        options = options || {};
        // set callback list.
        options.cl_uid = callback_list_idx.toString();
        callback_list_idx++;
        if(success || fail) {
            if(!callback_list[service]) {
                callback_list[service] = {};
            }
            if(!callback_list[service][action]) {
                callback_list[service][action] = {};
            }
            callback_list[service][action][options.cl_uid] = {"success" : success, "fail" : fail};
        }

        var msg = {
            type : type,
            service : service,
            action : action,
            args : args,
            options : options
        };
        sendData( JSON.stringify(msg) );
    };

    var promise = function (service, action, args, options) {
        switch(service) {
            case "CreateWGear":
            case "DestroyWGear":
                return _promise('function', service, action, args, options);
        }
        
        switch(action) {
            case "LoadLibrary":
            case "FreeLibrary":
                return _promise('function', service, action, args, options);
        }

        if(isOpened(service) == true) {
            return _promise('function', service, action, args, options);
        }
        else {
            return Promise.reject(service + " is not opened.");
        }
    };
    
    function _promise(type, service, action, args, options) {
        return new Promise(function(resolve, reject) {
            exec(function(result) {resolve(result);}, function(error) {reject(error);}, type, service, action, args, options);
        });
    };

    var getValue = function (service, value, options) {
        if(isOpened(service) == true) {
            return _promise('GetProperty', service, value, [], options);
        }
        else {
            return Promise.reject(service + " is not opened.");
        }
    };

    var setValue = function (service, value, args, options) {
        if(isOpened(service) == true) {
            return _promise('SetProperty', service, value, args, options);
        }
        else {
            return Promise.reject(service + " is not opened.");
        }
    };

    var open = function (service, options) {
        if(isCreated() == false) {
            options = options || {};
            //options.single_mode = true;
            return create(service, options)
            .then(function(r) {
                return _open(service, options);
            }, function(e) {
                return Promise.reject(e);
            });
        }
        else {
            return _open(service, options);
        }
    };
    
    function _open(service, options) {
        return promise(service, "LoadLibrary", [], options)
        .then(function (r) {
            opened_modules.push(service);
            return Promise.resolve(r);
        }, function (e) {
            return Promise.reject(e);
        });
    };

    var close = function (service, options) {
        return promise(service, "FreeLibrary", [], options)
        .then(function (r) {
            for(var i = 0; i < opened_modules.length; i++) {
                if(opened_modules[i] === service){
                    opened_modules.splice(i, 1);
                }
            }
            return Promise.resolve(r);
        }, function (e) {
            for(var i = 0; i < opened_modules.length; i++) {
                if(opened_modules[i] === service){
                    opened_modules.splice(i, 1);
                }
            }
            return Promise.reject(e);
        });
    };

    var create = function (service, options) {
        if(isConnected() == false) {
            return connect()
            .then( function (r) {
                return _create(service, options);
            }, function (e) {
                return Promise.reject(e);
            });
        }
        else {
            return _create(service, options);
        }
    };
    
    function _create(service, options) {
        service = service || "";
        options = options || {};
        options.uuid = getWGearUID();
        options.dummyMode = config.dummyMode;
        if(typeof options.single_mode == 'undefined') {
            options.single_mode = false;
        }
        if(options.single_mode == true) {
            options.module_name = service;
        }
        return promise("CreateWGear", "", [], options)
        .then(function (r) {
            addEventListener("WGearRoot", "onResponseMessage", onResponseMessage);
            is_created = true;
            return Promise.resolve(r);
        }, function (e) {
            is_created = false;
            return Promise.reject(e);
        });
    };

    var destroy = function (options) {
        return promise("DestroyWGear", "", [], options)
        .then(function (r) {
            is_created = false;
            opened_modules = ["WGearRoot"];
            return Promise.resolve(r);
        }, function (e) {
            is_created = false;
            opened_modules = ["WGearRoot"];
            return Promise.reject(e);
        });
    };

    function executeListener (msg) {
        if(msg.error) {
            ngmf._error("Error : ", msg.error);
            return;
        }
        if(!msg.result) {
            ngmf._debug("event is null.");
            return;
        }
        if(!listener_list[msg.service]) {
            ngmf._debug("The listener(service) does not exist.", msg.service);
            return;
        }
        if(!listener_list[msg.service][msg.action]) {
            ngmf._debug("The listener(action) does not exist.", msg.action);
            return;
        }
        var listeners = listener_list[msg.service][msg.action];
        if(listeners) {
            for(var i = 0; i < listeners.length; i++) {
                try {
                    listeners[i](msg.result);
                } catch(ee) {
                    ngmf._error("Error::",ee ); 
                }
            }
        }
    };

    var addEventListener = function (service, event, listener) {
        if(isOpened(service) == true) {
            _addEventListener(service, event, listener);
        }
        else {
            ngmf._debug(service, " is not opened." );
        }
    };
    
    function _addEventListener(service, event, listener) {
        if(!listener_list[service]) {
            listener_list[service] = {};
        }
        if(typeof event == 'function') {
            listener = event;
            event = "all_events";
        }
        event = event || "all_events";
        if(!listener_list[service][event]) {
            listener_list[service][event] = [];
        }

        listener_list[service][event].push(listener);
        if(listener_list[service][event].length == 1) {
            var msg = {
                type : 'listener',
                service : service,
                action : event,
                event : {
                            action : 'add'
                        },
                options : {},
            };
            ngmf._debug(msg);
            sendData(JSON.stringify(msg));
        }
        ngmf._debug(listener_list);
    };

    var removeEventListener = function (service, event, listener) {
        if(isOpened(service) == true) {
            _removeEventListener(service, event, listener);
        }
        else {
            _removeEventListener(service);
            ngmf._debug(service, " is not opened." );
        }
    };
    
    function _removeEventListener(service, event, listener) {
    	if(typeof event == 'function'){
    		listener = event;
    		event = null;
    	}
        service = service || null;
        event = event || null;
        listener = listener || null;
        if(service && listener_list[service]) {
            if(event) {
                if(listener_list[service][event]) {
                    if(listener) { // service, event, listener => remove the listener
                        for(var i = 0; i < listener_list[service][event].length; i++) {
                            if(listener_list[service][event][i] === listener) {
                                listener_list[service][event].splice(i, 1);
                                if(listener_list[service][event].length == 0) {
                                    var msg = {
                                        type : 'listener',
                                        service : service,
                                        action : event,
                                        event : {
                                                    action : 'remove',
                                                    count : '1'
                                                },
                                        options : {}
                                    };
                                    sendData(JSON.stringify(msg));
                                }
                                break;
                            }
                        }
                    } else { // service, event, null => remove all listeners in [service][event]
                        if(listener_list[service][event].length > 0) {
                            listener_list[service][event] = [];
                            var msg = {
                                type : 'listener',
                                service : service,
                                action : event,
                                event : {
                                            action : 'remove',
                                            count : 'all_events'
                                        },
                                options : {}
                            };
                            sendData(JSON.stringify(msg));
                        }
                    }
                } else {
                    // do nothing
                    // listener_list does not have the event.
                }
            } else { // service, null, null => remove listeners in [service]
                if(Object.keys(listener_list[service]).length > 0) {
                    listener_list[service] = {};
                    var msg = {
                        type : 'listener',
                        service : service,
                        action : 'all_actions',
                        event : {
                                    action : 'remove',
                                    count : 'all_events'
                                },
                        options : {}
                    };
                    sendData(JSON.stringify(msg));
                }
            }
        } else { // null, null, null => remove all listeners.
            if(Object.keys(listener_list).length > 0) {
                listener_list = {};
                var msg = {
                    type : 'listener',
                    service : 'all_services',
                    action : 'all_actions',
                    event : {
                                action : 'remove',
                                count : 'all_events'
                            },
                    options : {}
                };
                sendData(JSON.stringify(msg));
            }
        }
        ngmf._debug(listener_list);
    };

    var addCloseListener = function(service, listener) {
        if(typeof listener == 'function') {
            closed_listener_list.push(listener);
        }
    };

    var removeCloseListener = function(service, listener) {
        listener = listener || null;
        if(listener == null) {
            closed_listener_list = [];
            return ;
        }

        if(closed_listener_list) {
            for(var i = 0; i < closed_listener_list.length; i++) {
                if(closed_listener_list[i] === listener){
                    closed_listener_list.splice(i, 1);
                }
            }
        }
    };
    
    var sendMessage = function(service, fromID, toID, msg, options) {
        return promise("WGearRoot", "send", ["Request", fromID, toID, msg], options);
    };
    
    function onResponseMessage (data) {
        //ngmf._debug('onResponseMessage : ', data);
        if(Array.isArray(data) == false){
            return;
        }
        if(data.length < 3) {
            return;
        }
        if(data[0] == "Request") {
            var result = "SUCCESS";
            if(response_func_list) {
                if(response_func_list.length == 0) {
                    result = "SUCCESS ( Do nothing. )";
                } else {
                    var shifted_data = data.slice(0);
                    shifted_data.shift(); // remove Request
                    shifted_data.pop(); // remove cl_uid
                    for(var i = 0; i < response_func_list.length; i++) {
                        try {
                            response_func_list[i](shifted_data);
                        } catch(ee) {
                            ngmf._error("Error::",ee ); 
                            result = "ERROR : " + ee;
                            break;
                        }
                    }
                }
            } else {
                result = "FAILED : Not initialized.";
            }

            promise("WGearRoot", "send", ["Response", data[2], data[1], result, data[4]])
            .then(function (r) {
                //ngmf._debug('ResponseMessage (resolve) : ', r);
            }, function (e) {
                //ngmf._debug('ResponseMessage (reject) : ', e);
            });
        }
    };

    var addMessageHandler = function(service, handler) {
        if(typeof handler == 'function') {
            response_func_list.push(handler);
        }
    };

    var removeMessageHandler = function(service, handler) {
        handler = handler || null;
        if(handler == null) {
            response_func_list = [];
            return ;
        }
        else if(typeof handler == 'function') {
            for(var i = 0; i < response_func_list.length; i++) {
                if(response_func_list[i] === handler) {
                    response_func_list.splice(i, 1);
                }
            }
        }
    };

    var setBrowserID = function(service, id, options) {
        return promise("WGearRoot", "setBrowserID", [id], options);
    };

    var getBrowserID = function(service, options) {
        return promise("WGearRoot", "getBrowserID", [], options);
    };

    return {
        connect : connect,
        disconnect : disconnect,
        exec : exec,
        promise : promise,
        getValue : getValue,
        setValue : setValue,
        open : open,
        close : close,
        create : create,
        destroy : destroy,
        addEventListener : addEventListener,
        removeEventListener : removeEventListener,
        addCloseListener : addCloseListener,
        removeCloseListener : removeCloseListener,
        sendMessage : sendMessage,
        addMessageHandler : addMessageHandler,
        removeMessageHandler : removeMessageHandler,
        setBrowserID : setBrowserID,
        getBrowserID : getBrowserID,
        getWGearUID : getWGearUID
    };
}
