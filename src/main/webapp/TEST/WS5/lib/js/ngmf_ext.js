 /* 1. Gloval 변수, 객체 ------------------------------------------------------------------------------------------------------- */
if( typeof ngmf == 'undefined' || ngmf == null ) {
 /**
  * @type ngmf
  * @class ngmf
  */
 var ngmf = {};
}
if (typeof ngmv == 'undefined' || ngmv == null) {
 /**
  * @type ngmv
  * @class ngmv
  */
 var ngmv = {};
}
if (typeof ngmf.ext == 'undefined' || ngmf.ext == null) {
    /**
     * @type ngmf.ext
     * @class ngmf.ext
     */
    ngmf.ext = {};
    /**
     * @type ngmf.ext.push
     * @class ngmf.ext.push
     */
    ngmf.ext.push = {};
    /**
     * @type ngmf.ext.cti
     * @class ngmf.ext.cti
     */
    ngmf.ext.cti = {};
    /**
     * @type ngmf.ext.nice
     * @class ngmf.ext.nice
     */
    ngmf.ext.nice = {};
    /**
     * @type ngmf.ext.promise
     * @class ngmf.ext.promise
     */
    ngmf.ext.promise = {};
}

ngmf.ext.push._module = "PushClient";
//ngmf.ext.push._module = "GearEtcClient";


if(typeof GLD == "undefined") GLD = window.top; 

/**
 * wgear connect() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String} moduleName :: I :: Y ::  ::  연결할 객체 ID
 * @return {Object} 리턴결과 값.
 * @author 김진희
 * @example ngmf.ext.connect();
 * @exampleAsIs 
 */
ngmf.ext.promise.connect = function() {
 return GLD.ngmf.ext.promise._connect.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._connect = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
	
    if(typeof ngmv._wgear =="undefined" ||  !ngmv._wgear ) {
        ngmv._wgear = {};
    }
    if(!ngmv._wgear[wgearMid]) {
        ngmv._wgear[wgearMid] = WGear();
        ngmv._wgear[wgearMid]["openModules"] = {};
    }
    return ngmv._wgear[wgearMid].connect.apply(window, Array.prototype.slice.call(arguments));
};

/**
 * wgear create() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String} moduleName :: I :: Y ::  ::  연결할 객체 ID
 * @return {Promise} 리턴결과 값.
 * @author 김진희
 * @example ngmf.ext.connect();
 * @exampleAsIs 
 */
 ngmf.ext.promise.create = function() {
	 return GLD.ngmf.ext.promise._open.apply(window, Array.prototype.slice.call(arguments));
	// return GLD.ngmf.ext.promise._create.apply(window, Array.prototype.slice.call(arguments));
};

ngmf.ext.promise._create = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
	var callArguments = arguments;
	return new Promise(function(resolve, reject) {  
		var targetObjId = callArguments[0];
		try {
		    if(typeof ngmv._wgear =="undefined" ||  !ngmv._wgear ) {
		        ngmv._wgear = {}; 
		    }
		    if(!ngmv._wgear[wgearMid]) {
		        ngmv._wgear[wgearMid] = WGear();
		        ngmv._wgear[wgearMid]["openModules"] = {};
		    }
		    if(ngmv._wgear[wgearMid]) {
		    	if (ngmv._wgear[wgearMid]["openModules"][targetObjId]) {
		    		resolve(ngmv._wgear[wgearMid]["openModules"][targetObjId]);
		    	} else {
		            ngmv._wgear[wgearMid].open.apply(window, Array.prototype.slice.call(callArguments)).then(function (tagetObj) {
		        		if (tagetObj) ngmv._wgear[wgearMid]["openModules"][targetObjId] = tagetObj;
		        		else ngmv._wgear[wgearMid]["openModules"][targetObjId] = null;
		        		return resolve(tagetObj);
		        	});	
		    	}
		    } else {
		        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + targetObjId+ "]");
		        reject("WGear Initialize Error " + targetObjId);
		    }
		} catch (e) {
			ngmf._error("[ngmf.ext.promise._cerate] Exception :: [" + targetObjId+ "]", e);
			reject("[ngmf.ext.promise._create] Exception :: [" + targetObjId+ "]"+ e.message);
		}
	}); 
};
/**
 * wgear disconnect() 함수
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름 
 * @return {Promise} 리턴결과 값.
 * @author 김진희
 * @example ngmf.ext.disconnect(); 
 * @exampleAsIs 
 */
ngmf.ext.promise.disconnect = function() {
 return GLD.ngmf.ext.promise._disconnect.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._disconnect = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	}
	var callArguments = arguments;
	return new Promise(function(resolve, reject) {  
		try {
		    if(ngmv._wgear[wgearMid]) {
	            ngmv._wgear[wgearMid].disconnect.apply(window, Array.prototype.slice.call(callArguments)).then(function (tagetObj) {	            	
	            	ngmv._wgear[wgearMid] = null;
	        		return resolve(tagetObj);
	        	});	
		    } else {
		        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + wgearMid+ "]");
		        reject("WGear Initialize Error " + wgearMid);
		    }
		} catch (e) {
			ngmf._error("[ngmf.ext.promise._disconnect] Exception :: [" + wgearMid+ "]", e);
			reject("[ngmf.ext.promise._disconnect] Exception :: [" + wgearMid+ "]"+ e.message);
		}
	});
};

/**
 * wgear destroy() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {json} option data :: I :: Y ::  :: 파라메터 설명
 * @return {Object} 리턴결과 값.
 * @author 김진희
 * @example ngmf.ext.distory();
 * @exampleAsIs 
 */
ngmf.ext.promise.destroy = function() {
 return GLD.ngmf.ext.promise._destroy.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._destroy = function() {
	var targetObjId = arguments[0];
	var callArguments = arguments;
	return new Promise(function(resolve, reject) {  
		try {
		    if(ngmv._wgear[targetObjId]) {
	            ngmv._wgear[targetObjId].destroy.apply(window, Array.prototype.slice.call(callArguments)).then(function (tagetObj) {
	        		return resolve(tagetObj);
	        	});	
		    } else {
		        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + targetObjId+ "]");
		        reject("WGear Initialize Error " + targetObjId);
		    }
		} catch (e) {
			ngmf._error("[ngmf.ext.promise._destroy] Exception :: [" + targetObjId+ "]", e);
			reject("[ngmf.ext.promise._destroy] Exception :: [" + targetObjId+ "]"+ e.message);
		}
	}); 
};

/**
 * wgear open() 함수
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @return {function} SuccessCallback function
 * @return {function} FailCallback function
 * @author 김진희
 * @example ngmf.ext.open("alixtk");
 * @exampleAsIs 
 */
ngmf.ext.promise.open = function() { 
 return GLD.ngmf.ext.promise._open.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._open = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
	var callArguments = arguments;
	return new Promise(function(resolve, reject) {  
		var targetObjId = callArguments[0];
		try {
		    if(typeof ngmv._wgear =="undefined" ||  !ngmv._wgear ) {
		        ngmv._wgear = {}; 
		    }
		    if(!ngmv._wgear[wgearMid]) {
		        ngmv._wgear[wgearMid] = WGear();
		        ngmv._wgear[wgearMid]["openModules"] = {};
		    } 
    		
		    if(ngmv._wgear[wgearMid]) {
		    	if (ngmv._wgear[wgearMid]["openModules"][targetObjId]) {
		    		resolve(ngmv._wgear[wgearMid]["openModules"][targetObjId]);
		    	} else {
		            ngmv._wgear[wgearMid].open.apply(window, Array.prototype.slice.call(callArguments))
		            .then(function (tagetObj) {
		        		if (tagetObj) {
		        			ngmv._wgear[wgearMid]["openModules"][targetObjId] = tagetObj;
		        		} else ngmv._wgear[wgearMid]["openModules"][targetObjId] = null;
		        		return resolve(tagetObj);
		        	}).then(undefined, 
		        	function (e) {
		        		ngmf._error("[Wgear.open] Exception :: [" + targetObjId+ "]", e);
		        		resolve(null);
		        	});	
		    	}
		    } else {
		        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + targetObjId+ "]");
		        reject("WGear Initialize Error " + targetObjId);
		    }
		} catch (e) {
			ngmf._error("[ngmf.ext.promise._open] Exception :: [" + targetObjId+ "]", e);
			reject("[ngmf.ext.promise._open] Exception :: [" + targetObjId+ "]"+ e.message);
		}
	}); 
}; 
	
/**
 * wgear close() 함수
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @return {function} SuccessCallback function
 * @return {function} FailCallback function
 * @author 김진희
 * @example ngmf.ext.close("alixtk");
 * @exampleAsIs 
 */
ngmf.ext.promise.close = function() {
 return GLD.ngmf.ext.promise._close.apply(window, Array.prototype.slice.call(arguments));
}; 
ngmf.ext.promise._close = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
	var targetObjId = arguments[0];
	var callArguments = arguments;
	return new Promise(function(resolve, reject) {  
		try {
		    if(ngmv._wgear[wgearMid] && ngmv._wgear[wgearMid]["openModules"][targetObjId]) {
	            ngmv._wgear[wgearMid].close.apply(window, Array.prototype.slice.call(callArguments)).then(function (rmsg) {
	            	//"SUCCESS" == rmsg 
	            	if (ngmv._wgear[wgearMid]["openModules"][targetObjId]) {
	            		ngmv._wgear[wgearMid]["openModules"][targetObjId] = null;
	            		delete ngmv._wgear[wgearMid]["openModules"][targetObjId];
	            	} 
	        		return resolve(rmsg);
	        	});	
		    } else {
            	if (ngmv._wgear[wgearMid]["openModules"][targetObjId]) {
            		ngmv._wgear[wgearMid]["openModules"][targetObjId] = null;
            		delete ngmv._wgear[wgearMid]["openModules"][targetObjId];
            	} 
		    	return resolve("NOT OPENED!!");
		    }
		} catch (e) {
			ngmf._error("[ngmf.ext.promise._close] Exception :: [" + targetObjId+ "]", e);
			reject("[ngmf.ext.promise._close] Exception :: [" + targetObjId+ "]"+ e.message);
		}
	});
};

/**
 * wgear addEventListener() 함수
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String} service :: I :: Y ::  :: 실행할 서비스 이름
 * @param {String} event :: I :: Y ::  :: 서비스에서 실행할 이벤트 명
 * @param {function} handler :: I :: Y ::  :: 이벤트 발생시 실행될 함수이고, parameter는 e로 e.type e.msg로 구성됩니다. 
 * @author 김진희
 * @example var f_a = function (e) {
 * @example     ngmf._debug("f all", e.msg);
 * @example     switch(e.type)
 * @example     {
 * @example         case EVT_AIL_INITSUCCESS:
 * @example         .....
 * @example     }
 * @example }
 * @example wgear.addEventListener("alixtk", "CTIEvent", f_a); 
 * @exampleAsIs 
 */
ngmf.ext.addEventListener = function() {
 return GLD.ngmf.ext._addEventListener.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext._addEventListener = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid]) {
        ngmv._wgear[wgearMid].addEventListener.apply(window, Array.prototype.slice.call(arguments));
        return true;
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + wgearMid+ "]");
        return false;
    }
};

/**
 * wgear removeEventListener() 함수
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String} service :: I :: Y ::  :: 삭제할 서비스 이름
 * @param {String} event :: I :: Y ::  :: 삭제할 이벤트 명
 * @param {function} handler :: I :: Y ::  :: 삭제할 함수 
 * @return {} .
 * @author 김진희
 * @example ngmf.ext.removeEventListener("alixtk", "CTIEvent", f_a);  
 * @exampleAsIs 
 */
ngmf.ext.removeEventListener = function() {
 return GLD.ngmf.ext._removeEventListener.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext._removeEventListener = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid]) {
        ngmv._wgear[wgearMid].removeEventListener.apply(window, Array.prototype.slice.call(arguments));
        return true;
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + wgearMid + "]");
        return false;
    }
};
/**
 * wgear promise() 함수
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @param {String} action 서비스에서 실행할 함수 명
 * @param {array} args 함수를 실행하기 위해 필요한 arguments
 * @exampleAsIs 
 */
ngmf.ext.promise.exec = function() {
  return GLD.ngmf.ext.promise._exec.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._exec = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
	var srcArguments = arguments;
	var targetObjId = arguments[0];
	return new Promise(function(resolve, reject) {  
		try {
		    if(ngmv._wgear[wgearMid] && ngmv._wgear[wgearMid]["openModules"][targetObjId]) {
		        ngmv._wgear[wgearMid].promise.apply(window, Array.prototype.slice.call(srcArguments))
		        .then(function (res) {
		        	resolve(res);
		        },function(err) {
		        	//실패시 처리 로직 ... 
		        	//TODO. 에러 정의시 무한루프 돌지 않도록 아래 조건 수정
		        	if (err == "moduleErr") {
		        		ngmf.ext.promise._close(targetObjId).then(function(ret) {
							ngmf.ext.promise._open(targetObjId).then(function(ret) {
						       	if (ret) 
						       		return ngmf.ext.promise._exec.apply(window, Array.prototype.slice.call(srcArguments)); 
						       	else 
						       	 reject("WGear Initialize Error " + targetObjId);
						    },function (e){
						    	ngmf._error("[ngmf.ext.promise._exec ngmf.ext.promise._open] Exception :: [" + targetObjId+ "]", e);
						    	reject(e);
						    });
					    },function (e){
					    	ngmf._error("[ngmf.ext.promise._exec ngmf.ext.promise._close] Exception :: [" + targetObjId+ "]", e);
					    	reject(e);
					    }); 
		        	} else {
		        		reject(err);	
		        	}
		        });
		    } else {
				ngmf.ext.promise._open(targetObjId).then(function(ret) {
			       	if (ret) 
			       		ngmf.ext.promise._exec.apply(window, Array.prototype.slice.call(srcArguments))
			       		.then(function (res) {resolve(res);}).then(undefined, function (err) {reject(err);} );
			       	else 
			       	 reject("WGear Initialize Error " + targetObjId);
			    }).then(undefined, function (e){
			    	ngmf._error("[ngmf.ext.promise._exec ngmf.ext.promise._open] Exception :: [" + targetObjId+ "]", e);
			    	reject(e);
			    });
		    }
		} catch (e) {
			ngmf._error("[ngmf.ext.promise._exec] Exception :: [" + targetObjId+ "]", e);
			reject(e);
		}
	});
};

/**
 * wgear getValue() 함수
 * @date 2016-08-22
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @param {String} value 서비스에서 가져올 변수 명
 * @exampleAsIs 
 */
ngmf.ext.promise.getValue = function() {
  return GLD.ngmf.ext.promise._getValue.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._getValue = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid]) {
        return ngmv._wgear[wgearMid].getValue.apply(window, Array.prototype.slice.call(arguments));
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + arguments[0] + "]");
        return Promise.reject("WGear Initialize Error " + arguments[0]);
    }
};

/**
 * wgear setValue() 함수
 * @date 2016-08-22
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @param {String} value 서비스에서 가져올 변수 명
 * @param {array} args 변수에 설정할 값
 * @exampleAsIs 
 */
ngmf.ext.promise.setValue = function() {
  return GLD.ngmf.ext.promise._setValue.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._setValue = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid]) {
        return ngmv._wgear[wgearMid].setValue.apply(window, Array.prototype.slice.call(arguments));
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + arguments[0] + "]");
        return Promise.reject("WGear Initialize Error " + arguments[0]);
    }
};


/**
 * wgear addCloseListener() 함수
 * @date 2016-05-30
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @param {function} handler 이벤트 발생시 실행될 함수
 * @author 박성근
 * @example wgear.addCloseListener(service, listener);
 * @exampleAsIs
 */
ngmf.ext.addCloseListener = function() {
 return GLD.ngmf.ext._addCloseListener.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext._addCloseListener = function() { 
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid]) {
    	ngmf._debug("addCloseListener[" + arguments[0] + "] SUCCESS");
        ngmv._wgear[wgearMid].addCloseListener.apply(window, Array.prototype.slice.call(arguments));
        return true;
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + arguments[0] + "]");
        return false;
    }
};

/**
 * wgear removeCloseListener() 함수
 * @date 2016-05-30
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @param {function} handler 삭제할 함수
 * @return {} .
 * @author 박성근
 * @example ngmf.ext.removeCloseListener(service, listener);
 * @exampleAsIs
 */
ngmf.ext.removeCloseListener = function() {
 return GLD.ngmf.ext._removeCloseListener.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext._removeCloseListener = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
	
    if(ngmv._wgear[wgearMid]) {
        ngmv._wgear[wgearMid].removeCloseListener.apply(window, Array.prototype.slice.call(arguments));
        return true;
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + arguments[0] + "]");
        return false;
    }
};

/**
 * wgear sendMessage() 함수
 * @date 2016-07-08
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @param {String} action 서비스에서 실행할 함수 명
 * @param {array} args 함수를 실행하기 위해 필요한 arguments
 * @return {function} SuccessCallback function
 * @return {function} FailCallback function
 * @exampleAsIs
 */
ngmf.ext.promise.sendMessage = function() {
  return GLD.ngmf.ext.promise._sendMessage.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._sendMessage = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid]) {
        return ngmv._wgear[wgearMid].sendMessage.apply(window, Array.prototype.slice.call(arguments));
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + arguments[0] + "]");
        return Promise.reject("WGear Initialize Error " + arguments[0]);
    }
};

/**
 * wgear addMessageHandler() 함수
 * @date 2016-07-08
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @param {function} handler 이벤트 발생시 실행될 함수
 * @author 박성근
 * @example wgear.addMessageHandler(service, listener);
 * @exampleAsIs
 */
ngmf.ext.addMessageHandler = function() {
 return GLD.ngmf.ext._addMessageHandler.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext._addMessageHandler = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid]) {
        return ngmv._wgear[wgearMid].addMessageHandler.apply(window, Array.prototype.slice.call(arguments));
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + arguments[0] + "]");
        throw new Error("WGear Initialize Error");
    }
};

/**
 * wgear removeMessageHandler() 함수
 * @date 2016-07-08
 * @memberOf ngmf
 * @param {String} service 실행할 서비스 이름
 * @param {function} handler 삭제할 함수
 * @return {} .
 * @author 박성근
 * @example ngmf.ext.removeMessageHandler(service, listener);
 * @exampleAsIs
 */
ngmf.ext.removeMessageHandler = function() {
 return GLD.ngmf.ext._removeMessageHandler.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext._removeMessageHandler = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid]) {
        return ngmv._wgear[wgearMid].removeMessageHandler.apply(window, Array.prototype.slice.call(arguments));
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + arguments[0] + "]");
        throw new Error("WGear Initialize Error");
    }
};

/**
 * wgear setBrowserID() 함수
 * @date 2016-07-08
 * @memberOf ngmf
 * @param {String} service 서비스 이름
 * @exampleAsIs 
 */
ngmf.ext.promise.setBrowserID = function() {
  return GLD.ngmf.ext.promise._setBrowserID.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._setBrowserID = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid] && typeof ngmv._wgear[wgearMid].setBrowserID == "function") {
        ngmv._wgear[wgearMid].setBrowserID.apply(window, Array.prototype.slice.call(arguments));
        return true;
    } else {
        //ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + arguments[0] + "]");
        return false;
    }
};

/**
 * wgear getBrowserID() 함수
 * @date 2016-07-08
 * @memberOf ngmf
 * @param {String} service 서비스 이름
 * @exampleAsIs 
 */
ngmf.ext.promise.getBrowserID = function() {
  return GLD.ngmf.ext.promise._getBrowserID.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.promise._getBrowserID = function() {
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	} 
    if(ngmv._wgear[wgearMid]) {
        return ngmv._wgear[wgearMid].getBrowserID.apply(window, Array.prototype.slice.call(arguments));
    } else {
        ngmf._debug("WGear 객체가 초기화되어 있지 않습니다. [" + arguments[0] + "]");
        return Promise.reject("WGear Initialize Error " + arguments[0]);
    }
};

/////////////////////////////////////
///
/// Genesys CTI
///
/////////////////////////////////////
ngmf.ext.promise.ctiInitialize = function() {
    var promise = Promise.resolve();
    if( !cti.connected ) {
        promise = promise.then(function(retVal) {
            return ngmf.ext.promise.connect();
        });
        promise = promise.then(function(retVal) {
            return ngmf.ext.promise.create();
        });
        promise = promise.then(function(retVal) {
            return ngmf.ext.promise.open();
        });
    }
    if( !cti.logined ) {
        promise = promise.then(function(retVal) {
            return ngmf.ext.promise.LoginIF();
        });
    }
    return promise;    
};

 /**
 * wgear WriteLogIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String} logstring 로그 스트링 문자열
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.init();
 * @exampleAsIs 
 */
ngmf.ext.promise.WriteLogIF = function(logstring)   {
    var promise = ngmf.ext.promise.ctiInitialize();
    promise = promise.then(function(retVal) {
        return ngmf.ext.promise.exec("ailxtk", "WriteLogIF", logstring);
    });
    return promise;
};

 /**
 * wgear WriteLogIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {String] strHostName 호스트 이름
 * @param {} lHostPort
 * @param {String} strHostNameBK 백업 호스트 이름
 * @param {} lHostPortBK
 * @param {String} strTHostName T-호스트
 * @param {} lTHostPort  
 * @param {String} strTHostNameBK 백업 T-호스트
 * @param {} lTHostPortBK
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.init();
 * @exampleAsIs 
 */
ngmf.ext.promise.InitToolbar = function(strHostName, lHostPort, strHostNameBK, lHostPortBK,
                                            strTHostName, lTHostPort, strTHostNameBK, lTHostPortBK,
                                            strID, strPassword, strAppName, lPeriod, lTimeOut,strThisAgtBizType)
{
 return ngmf.ext.promise.exec("ailxtk", "InitToolbar", [strHostName, lHostPort, strHostNameBK, lHostPortBK,
                                            strTHostName, lTHostPort, strTHostNameBK, lTHostPortBK,
                                            strID, strPassword, strAppName, lPeriod, lTimeOut,strThisAgtBizType]);
};
/**
 * wgear UnLoadToolbar() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {} .
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.UnLoadToolbar();
 * @exampleAsIs 
 */
ngmf.ext.promise.UnLoadToolbar = function()
{
 return ngmf.ext.promise.exec("ailxtk", "UnLoadToolbar");
};
/**
 * wgear LoginIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {strID, strExt, strPwd, strQueue, blMCCAgent} .
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.UnLoadToolbar();
 * @exampleAsIs 
 */
ngmf.ext.promise.LoginIF = function(strID, strExt, strPwd, strQueue, blMCCAgent)
{
    ngmf._debug("LoginIF : ");
    //ngmf.ext.promise.exec("ailxtk","LoginIF", ["bszAgent", "bszPlace", "bszPassword", "bszQueue", false /*bITIAgent*/]).then(callbackSuccess, callbackFail);
 ngmf._debug("loginIF");
 return ngmf.ext.promise.exec("ailxtk", "LoginIF", [strID, strExt, strPwd, strQueue, blMCCAgent]);

};
/**
 * wgear RELoginIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {regCTIID, strExt, strPwd, strQueue,
            regAuthDN, regAuthPBX, regPayDN, regPayPBX,
            regITAHOST, regITAPORT, regMEDIA, regPLACE, blMCCAgent} .
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.UnLoadToolbar();
 * @exampleAsIs 
 */
ngmf.ext.promise.RELoginIF = function (regCTIID, strExt, strPwd, strQueue,
            regAuthDN, regAuthPBX, regPayDN, regPayPBX,
            regITAHOST, regITAPORT, regMEDIA, regPLACE, blMCCAgent)
{
 return ngmf.ext.promise.exec("ailxtk", "RELoginIF", [regCTIID, strExt, strPwd, strQueue,
                     regAuthDN, regAuthPBX, regPayDN, regPayPBX,
                     regITAHOST, regITAPORT, regMEDIA, regPLACE, blMCCAgent]);
};
/**
 * wgear LogoutIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {} .
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.UnLoadToolbar();
 * @exampleAsIs 
 */
ngmf.ext.promise.LogoutIF = function ()
{
 return ngmf.ext.promise.exec("ailxtk", "LogoutIF"); 
};
/**
 * wgear GetAttachDataIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {strKey} .
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.UnLoadToolbar();
 * @exampleAsIs 
 */
ngmf.ext.promise.GetAttachDataIF = function (strKey)
{
 return ngmf.ext.promise.exec("ailxtk", "GetAttachDataIF" , [strKey]);
};
/**
 * wgear GetAttachDataLineIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {strKey, intLine} .
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.UnLoadToolbar();
 * @exampleAsIs 
 */
ngmf.ext.promise.GetAttachDataLineIF = function (strKey, intLine)
{
 return ngmf.ext.promise.exec("ailxtk", "GetAttachDataLineIF", [strKey, intLine]);
};
/**
 * wgear AttachDataIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {strkey, strValue} .
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.UnLoadToolbar();
 * @exampleAsIs 
 */
ngmf.ext.promise.AttachDataIF = function (strkey, strValue)
{
 return ngmf.ext.promise.exec("ailxtk", "AttachDataIF", [strkey, strValue]);
}; 
/**
 * wgear AttachDataConnIDIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {strkey, strValue, connID} .
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.UnLoadToolbar();
 * @exampleAsIs 
 */
ngmf.ext.promise.AttachDataConnIDIF = function (strkey, strValue, connID)
{
 return ngmf.ext.promise.exec("ailxtk", "AttachDataConnIDIF", [strkey, strValue, connID]);
};
/**
 * wgear AttachDataLineIF() 함수 입니다.
 * @date 2016-03-14
 * @memberOf ngmf
 * @param {strkey, strValue, intLine} .
 * @return {Object} PromiseObj promise 결과 값.
 * @author 김진희
 * @example ngmf.ext.UnLoadToolbar();
 * @exampleAsIs 
 */
ngmf.ext.promise.AttachDataLineIF = function (strkey, strValue, intLine)
{
 return ngmf.ext.promise.exec("ailxtk", "AttachDataLineIF", [strkey, strValue, intLine]);
};
 
 
/////////////////////////////////////
///
/// 신용카드 전자서명
///
/////////////////////////////////////

ngmf.ext.promise.NicePortFind = function ()
{
 return ngmf.ext.promise.exec("NGMCATSIGN", "NicePortFind");
};
ngmf.ext.promise.AttachDataIF = function (fsv_nicesign_data_value)
{
 return ngmf.ext.promise.exec("NGMCATSIGN", "NiceSignDataRead",[fsv_nicesign_data_value]);
};
ngmf.ext.promise.SetBmpFile = function (SignDataBuff, nSignDataBuffLength, FileUrl1, StatusVal)
{
 return ngmf.ext.promise.exec("DecSignData", "SetBmpFile", [SignDataBuff, nSignDataBuffLength, FileUrl1, StatusVal]);
 
};
ngmf.ext.promise.GetPortStatusYU = function ()
{
 return ngmf.ext.promise.exec("NGM_CAT_YU", "GetPortStatus");
};
ngmf.ext.promise.CatPortFindYU= function ()
{
 return ngmf.ext.promise.exec("NGM_CAT_YU", "CatPortFind");
};
ngmf.ext.promise.GetPortStatus = function ()
{
 return ngmf.ext.promise.exec("NGM_CAT", "GetPortStatus");
};
ngmf.ext.promise.CatInit = function ()
{
 return ngmf.ext.promise.exec("NGM_CAT", "CatInit");
};
ngmf.ext.promise.Nice_CardDataRead = function (strKey)
{
 return ngmf.ext.promise.exec("NGM_CAT", "Nice_CardDataRead", [strKey]);
};

/////////////////////////////////////
///
/// Push 설정
///
/////////////////////////////////////

/**
 * Push서버 관리용 객체 생성
 * @date 2016-04-21
 * @memberOf ngmf.ext.push 
 * @return {Promise} 
 * @author 성일호
 * @exampleAsIs 
 */
ngmf.ext.push.createDs = function() {
    return GLD.ngmf.ext.push._createDs();
};
ngmf.ext.push._createDs = function() {
    try {
        if (typeof GDS_FEED == "undefined" || !GDS_FEED) {
            var options = {
                    id : "GDS_FEED",
                    type : "dataList",
                    option :    {
                                    "baseNode":         "list", 
                                    "repeatNode":       "map", 
                                    "saveRemovedData":  "true"
                                },
                    columnInfo : [
                    {id : "event" , name : "이벤트구분", type : "text"},
                    {id : "varname" , name : "변수명", type : "text"},
                    {id : "type" , name : "변수타입", type : "text"},
                    {id : "size" , name : "변수길이", type : "text"},
                    {id : "decimal" , name : "decimal여부", type : "text"}
                    ]
                };
            $w.data.create(options);
            GDS_FEED.setData(["BATCH", "eventkey,runtime,screen,rtCode,msglist,filename,screenkor,rdfilename,filetype","S,S,S,S,S,S,S,S,S","31,22,20,6,194,18,100,33,1","0,0,0,0,0,0,0,0,0"
                                          ,"EAI", "eventkey,screen,msglist","S,S,S","31,20,300","0,0,0"
                                          ,"ORD" + ngmf.trim(ngmf.getGlobalValue("g_Ngms_IpAddr")), "eventkey,screen,msglist","S,S,S","31,20,300","0,0,0"
                                          ,"POPUP", "sndclcd,rcvrid,ocallrid,ocallrnm,titlenm,ctxtctt,linkaddr,pgmid,snddt","S,S,S,S,S,S,S,S,S","5,10,10,40,100,1000,150,15,14","0,0,0,0,0,0,0,0,0"
                                          ,"SSO", "sndclcd,rcvrid,ocallrid,ocallrnm,titlenm,ctxtctt,linkaddr,pgmid,snddt","S,S,S,S,S,S,S,S,S","5,10,10,40,100,1000,150,15,14","0,0,0,0,0,0,0,0,0"
                                          ,"CNT", "msgFg,time","S,S","1,6","0,0"
                                          ,"SSL", "msgFg","S","1","0"]);
        } else {
            if (GDS_FEED.getRowCount() != 6 ) {
                GDS_FEED.removeAll();
                GDS_FEED.setData(["BATCH", "eventkey,runtime,screen,rtCode,msglist,filename,screenkor,rdfilename,filetype","S,S,S,S,S,S,S,S,S","31,22,20,6,194,18,100,33,1","0,0,0,0,0,0,0,0,0"
                                              ,"EAI", "eventkey,screen,msglist","S,S,S","31,20,300","0,0,0"
                                              ,"ORD" + ngmf.trim(ngmf.getGlobalValue("g_Ngms_IpAddr")), "eventkey,screen,msglist","S,S,S","31,20,300","0,0,0"
                                              ,"POPUP", "snd_cl_cd,rcvr_id,ocallr_id,ocallr_nm,title_nm,ctxt_ctt,link_addr,pgm_id,snd_dt","S,S,S,S,S,S,S,S,S","5,10,10,40,100,1000,150,15,14","0,0,0,0,0,0,0,0,0"
                                              ,"SSO", "snd_cl_cd,rcvr_id,ocallr_id,ocallr_nm,title_nm,ctxt_ctt,link_addr,pgm_id,snd_dt","S,S,S,S,S,S,S,S,S","5,10,10,40,100,1000,150,15,14","0,0,0,0,0,0,0,0,0"
                                              ,"CNT", "msgFg,time","S,S","1,6","0,0"
                                              ,"SSL", "msgFg","S","1","0"]);
            }
        }
        
        if (typeof GDS_PUSHRCVLIST == "undefined" || !GDS_PUSHRCVLIST) {
            var options = {
                    id : "GDS_PUSHRCVLIST",
                    type : "dataList",
                    option :    {
                                    "baseNode":         "list", 
                                    "repeatNode":       "map", 
                                    "saveRemovedData":  "true"
                                },
                                columnInfo : [
                                                {id : "windowid" , name : "대상화면ID", type : "text"},
                                                {id : "seventkey" , name : "이벤트구분", type : "text"},
                                                {id : "eventname" , name : "이벤트이름", type : "text"},
                                                {id : "eventkey" , name : "이벤트KEY", type : "text"},
                                                {id : "datasetid" , name : "DATASETID", type : "text"},
                                                {id : "addmethod " , name : "반영방법", type : "number"},
                                                {id : "maxrow " , name : "최대행수", type : "number"},
                                                {id : "appendpos" , name : "추가시작위치", type : "number"},
                                                {id : "userdata" , name : "사용자DATA", type : "text"},
                                                {id : "ispopup" , name : "팝업여부", type : "text"},
                                                {id : "wframeid" , name : "wframeID", type : "text"}
                                ]
                };
            $w.data.create(options); 
        } else {
            GDS_PUSHRCVLIST.removeAll();
        } 
        if (typeof GDS_PUSH_POP_PORTAL == "undefined" || !GDS_PUSH_POP_PORTAL) {
            ngmf.createDataList("GDS_PUSH_POP_PORTAL", ["sndclcd","rcvrid","ocallrid","ocallrnm","titlenm","ctxtctt","linkaddr","pgmid","snddt","poptype"]);
            ngmf.createDataList("GDS_PUSH_POP_UKEY", ["sndclcd","rcvrid","ocallrid","ocallrnm","titlenm","ctxtctt","linkaddr","pgmid","snddt","poptype"]);
            ngmf.createDataList("GDS_PUSH_DISCONNECT");
            ngmf.createDataList("GDS_PUSH_SSL_FLAG");
            ngmf.createDataList("GDS_PUSH_BATCH");
            
//          // 이벤트 설정
//          GDS_PUSH_POP_PORTAL.bind("ondataload", function(obj){
//              try { 
//              } catch (e) {
//                  ngmf._error("GDS_PUSH_POP_PORTAL_ondataload ERROR:::::", e);
//              }
//          });
//          GDS_PUSH_DISCONNECT.bind("ondataload", function(info){
//              try { 
//              } catch (e) {
//                  ngmf._error("GDS_PUSH_DISCONNECT_ondataload ERROR:::::", e);
//              }
//          });         
//          GDS_PUSH_SSL_FLAG.bind("ondataload", function(info){
//              try { 
//              } catch (e) {
//                  ngmf._error("GDS_PUSH_SSL_FLAG_ondataload ERROR:::::", e);
//              }
//          });
            GDS_PUSH_POP_UKEY.bind("ondataload", function(rowdata, userData){
                try {
                    if (scvar.alertScwin) scvar.alertScwin.setAlertMsg(); 
                } catch (e) {
                    ngmf._error("GDS_PUSH_POP_UKEY_ ondataload ERROR:::::", e);
                }
            }); 
            GDS_PUSH_BATCH.bind("ondataload", function(){ 
                try {
                    var strForm = ngmf.trim(GDS_PUSH_BATCH.getCellData(0, "screen")); 
                    var strGubun = "BATCH";
                    var strFile;
                    var strFileFg = ngmf.trim(GDS_PUSH_BATCH.getCellData(0, "filetype"));
                    var strRTCode = ngmf.trim(GDS_PUSH_BATCH.getCellData(0, "rtCode"));
                    var strKey = ngmf.trim(GDS_PUSH_BATCH.getCellData(0, "eventkey"));
                    var wframeid = ngmf.trim(GDS_PUSH_BATCH.getCellData(0, "wframeid")) || ""; 
                    var isPopup = ngmf.trim(GDS_PUSH_BATCH.getCellData(0, "ispopup")) || "";  
                    //var strDumm = "0";
                    switch (strFileFg) {
                        case "E":
                            strFile = ngmf.trim(GDS_PUSH_BATCH.getCellData(0, "filename"));
                            //var strDumm2 = ngmf.rpad(strDumm, "0", 33);
                            if (Number(strFile) == 0) {
                                strFile = "";
                            }
                            break;
                        case "C":
                            strFile = ngmf.trim(GDS_PUSH_BATCH.getCellData(0, "rdfilename"));
                            //var strDumm2 = ngmf.rpad(strDumm, "0", 33);
                            //if (strDumm2 == strFile) {
                            if (Number(strFile) == 0) {
                                strFile = "";
                            }
                            break;
                        default:
                            strFile = ngmf.trim(GDS_PUSH_BATCH.getCellData(0, "filename"));
                    }
                    
                    ngmf.ext.push.del("MAINTOP", strKey, strGubun, "GDS_PUSH_BATCH");
                    
                    // 값을 받아 ARGUMENT로 넘긴다.
                    var selectedWindow = null;
                    var selectedWinId = strForm;
                    var arg = "VAL1=" + ngmf.quote(GDS_PUSH_BATCH.getCellData(0, "runtime"));
                    arg += " VAL2=" + ngmf.quote(GDS_PUSH_BATCH.getCellData(0, "screen"));
                    arg += " VAL3=" + ngmf.quote(GDS_PUSH_BATCH.getCellData(0, "msglist"));
                    arg += " VAL4=" + ngmf.quote(GDS_PUSH_BATCH.getCellData(0, "eventkey"));
                    arg += " VAL5=" + ngmf.quote(GDS_PUSH_BATCH.getCellData(0, "screenkor"));
                    arg += " VAL6=" + ngmf.quote(strFile);
                    arg += " VAL8=" + ngmf.quote(strFileFg);
                    if (typeof GDS_PUSH_BATCH.getColumnIndex("UserData") != "undefined") {
                        // userdata "*" screenname "*" batchid
                        var strUserDataList = GDS_PUSH_BATCH.getCellData(0, "UserData");
                        var arrUserData = ngmf.split(strUserDataList, "*", "WebStyle");
                        //arrUserData[0]  : 사용자 DATA
                        //arrUserData[1]  : 실제 호출 FORMID
                        //arrUserData[2]  : BATCHID
                        //arrUserData[3]  : strWHandle
                        
                        //callback함수를 호출한다 arrUserData[1] = formId
                        selectedWinId =  (arrUserData[1] || strForm); 
                        arg += " VAL7=" + ngmf.quote(arrUserData[0]);
                        arg += " VAL9=" + ngmf.quote(arrUserData[2]);
                        
                        selectedWindow = ngmf.ext.push._getTargetFormWindow(ngmf.mdiTabs().id+ "|" + selectedWinId,isPopup);
                        if (selectedWindow && strFileFg != "E") {
                            if (wframeid && selectedWindow[wframeid + "_scwin"]["pushCallBackResult"]) {
                                selectedWindow[wframeid + "_scwin"]["pushCallBackResult"](strFile, strRTCode);
                            } else if (selectedWindow["scwin"]["pushCallBackResult"]) {
                                selectedWindow["scwin"]["pushCallBackResult"](strFile, strRTCode);
                            } else {
                                ngmf._debug("NOT FIND WINDOWS:::" + selectedWinId);
                            }
                        } else {
                            ngmf._debug("strFileFg:::" + strFileFg);
                        }
                    } else {
                        arg += " VAL7=\"\"";
                        arg += " VAL9=\"\""; 
                    }
                    var nWidth = 405;
                    var nHeight = 238;
                    var nLeft = ngmf.toInteger((WebSquare.util.getDocumentSize("width") - nWidth) / 2);
                    var nTop = ngmf.toInteger((WebSquare.util.getDocumentSize("height") - nHeight) / 2);
                    //메인에서 호출 되도록
                    ngmf.mainIconDialog("AAT", "ZNGMSMAN00110", arg, nWidth , nHeight ,"",nLeft ,nTop, "", ngmf.getFormID() );  

                } catch (e) {
                    ngmf._error("GDS_PUSH_BATCH_ondataload ERROR:::::", e);
                }
            });         
        }
        
        return true;
    } catch (e) {
        ngmf._error("ngmf.ext.push._createDs Excecption::", e);
    }
    return false;
};
/**
 * Push서버 초기화
 * @date 2016-04-21
 * @memberOf ngmf.ext.push 
 * @return {Promise} 
 * @author 성일호
 * @example ngmf.ext.push.init();
 * @returns {Promise} push_initId 
 * @exampleAsIs 
 */
ngmf.ext.push.init = function() {
	return new Promise(function(resolve, reject) {   
		try {
	        if (ngmf.ext.push.getInitId() < 0) {
	            var strUrlPort = ngmf.getServerUrl("PUSH");
	            if (strUrlPort && strUrlPort.length > 1) {
	                var szServer = strUrlPort[0].replaceAll("http://","");
	                var nPortNo = Number(strUrlPort[1]);
	                var szUserID = ngmf.getGlobalValue("g_Ngms_UserId");  
	                if (!ngmf.ext.push.isCreated()) {
	                	ngmf.ext.promise.open(ngmf.ext.push._module).then(function(erbCmdMap) { 
		                    ngmf._debug("CALLED!!! :::: ngmf.ext.promise.open szServer=" + szServer + "  erbCmdMap=" , erbCmdMap);
		                    ngmf.ext.push.setConnected(true);
		                    ngmf.ext.push.setCreated(true); 
		                    GLD.ngmf.ext.push._init(szServer, nPortNo, szUserID).then(function(ret){
		                    	if (ret > 0) {
		                    		ngmf.ext.push.pushPopWait ();
		                        }    
	                            resolve(ret);
		                    }).then(undefined, function(e){ 
		                        ngmf._error("ERROR!!! :::: ngmf.ext.promise._init szServer=" + szServer + "  e=" ,e); 
		                        resolve(-1);
		                    });
	                    }).then(undefined, function(e){ 
	                        ngmf._error("ERROR!!! :::: ngmf.ext.promise.open e=" ,e); 
	                        resolve(-1);
	                    });
	                } else {
	                    GLD.ngmf.ext.push._init(szServer, nPortNo, szUserID).then(function(ret){
                            if (ret > 0) {
                                ngmf.ext.push.pushPopWait ();
                            }    
                            resolve(ret);
	                    }).then(undefined, function(e){ 
	                        ngmf._error("ERROR!!! :::: ngmf.ext.promise._init szServer=" + szServer + "  e=" ,e);
	                        resolve(-1);
	                    });
	                }
	            }       
	        } else {
	        	resolve(ngmf.ext.push.getInitId());
	        }  
		} catch (e) {
			ngmf._error("[ngmf.ext.push.init] Exception :: [" + ngmf.ext.push._module+ "]", e);
			resolve(ngmf.ext.push.getInitId());
		}
	}); 
}; 

/**
 * Push서버 초기화
 * @date 2016-04-21
 * @memberOf ngmf.ext.push
 * @param {String} szServer :: I :: N ::  :: 접속할 Server의 IP Address 또는 Alias Name
 * @param {Number} nPortNo :: I :: N :: 2002  ::접속할 server의 Port Number
 * @param {String} szUserID :: I :: N ::  :: 사용자 ID ngmf.getGlobalValue("g_Ngms_UserId")
 * @return {Promise} 
 * @author 성일호
 * @example ngmf.ext.push._init("190.190.159.87", 2002, ngmf.getGlobalValue("g_Ngms_UserId")); 
 */
ngmf.ext.push._init = function(szServer, nPortNo, szUserID) {
	var  socketType = 0; // Socket Type (WebSocket : 0 , TCP: 1, Async : 3)
	return new Promise(function(resolve, reject) {   
		try {
		    if (ngmf.ext.push.getInitId() < 0) {
		        return ngmf.ext.push.promise( ngmf.ext.push._module, "erbinit", [szServer , nPortNo || 2002, szUserID , socketType])
		        .then(function(retObj) {
		            if(!isNaN(retObj)) {
		                if (Number(retObj) > 0) {
		                    ngmf.ext.push.setInitId(Number(retObj));
		                    ngmf.ext.push.addEventListener(ngmf.ext.push._module, ngmf.ext.push._msgCallBack);
		                    ngmf.ext.push.addEventListener(ngmf.ext.push._module, ngmf.ext.push._errMsgCallBack);
		                }
		                resolve(ngmf.ext.push.getInitId());
		            } else { 
		                ngmf._error("ngmf.ext.push._init Fail:::", retObj);
		                resolve(-1);
		            }
		        }).then(undefined, function(e) {
		            ngmf._error("ngmf.ext.push._init Fail:::", e);
		            resolve(-1);
		        }); 
		    } else {
		    	resolve(ngmf.ext.push.getInitId());
		    }
		} catch (e) {
			ngmf._error("[ngmf.ext.push._init] Exception :: szServer=" + szServer + "  e=" ,e);
			resolve(-1);
		}
	});
}; 

ngmf.ext.push.createWgear = function() {
    return GLD.ngmf.ext.push._createWgear() ;
};
ngmf.ext.push._createWgear = function() { 
	return new Promise(function(resolve, reject) {   
		try {
	        if (typeof GLD.GDS_FEED == "undefined" || !GLD.GDS_FEED) {
	            ngmf.ext.push.createDs();
	        }
        	ngmf.ext.promise.open(ngmf.ext.push._module).then(function(erbCmdMap) { 
                ngmf.ext.push.setConnected(true);
                ngmf.ext.push.setCreated(true); 
                ngmf.ext.push.init().then(function(initId) { 
                    if(initId > 0) resolve("Y");
                    else resolve("N");
                }).then(undefined, function(e){
                    ngmf._error("ngmf.ext.push.initException:::" ,e);
                    resolve("N");
                }); 

            }).then(undefined, function(e){ 
                ngmf._error("ERROR!!! :::: ngmf.ext.promise.open szServer=" + szServer + "  e=" ,e); 
                resolve("N");
            });
		} catch (e) {
			ngmf._error("[ngmf.ext.promise._createWgear] Exception :: [" + ngmf.ext.push._module+ "]", e);
			resolve("N");
		}
	}); 
}; 

ngmf.ext.push._msgParse = function(eventKey, respData) {
    if (eventKey) {
        var mDs = GLD.GDS_FEED.getMatchedJSON("event", eventKey );
        if (mDs.length > 0) {
            var varnames = mDs[0].varname.split(",");
            var sizes = mDs[0].size.split(",");
            var types = mDs[0].type.split(",");
            var decimals = mDs[0].decimal.split(",");
            var resultJson = {};
            var sindex = 0;
            for (var i = 0; i <varnames.length; i++ ) {
            	if (respData)
            		resultJson[varnames[i]] = ngmf.ext.push._msgParseSub(ngmf.midb2(respData, sindex, Number(sizes[i]) ) ,types[i],decimals[i]);
            	else resultJson[varnames[i]] = " ";
                sindex = sindex + Number(sizes[i]);
            }
            return resultJson;
        } else return null;
    } else return null;
};

ngmf.ext.push._msgParseSub = function(msg, type, decimal) {
    if (msg && typeof type != "undefined" && typeof decimal != "undefined") {
        if (type.toUpperCase() == "S")  return ngmf.trim(msg); 
        else return Number(ngmf.trim(msg));
    } else return "";
};

ngmf.ext.push._getTargetFormWindow = function(windowid, popupFirst) {
    if (windowid ) {
    	var windowids = null;
    	if (windowid.indexOf("|") > -1) windowids = windowid.split("|");
    	else windowids = [ngmf.mdiTabs().id , windowid]; 
        var targetWindow = null;
        var winc = null;
        try {
        	// 2016.08.05 window 관리 통합
        	if (typeof popupFirst != "undefined" && popupFirst) {
        		winc = ngmf._getAllWindows(windowids[1], windowids[0], "P");
        		if (winc.length <= 0) winc = ngmf._getAllWindows(windowids[1], windowids[0], "M"); 
        	} else { 
        		winc = ngmf._getAllWindows(windowids[1], windowids[0], "M");
        		if (winc.length <= 0) winc = ngmf._getAllWindows(windowids[1], windowids[0], "P"); 
        	}
        	if (winc.length <= 0) {
        		winc = ngmf._getAllWindows(windowids[1], windowids[0], "PO");
        	}
        	if (winc.length > 0) targetWindow = winc[0];
        	
        	/*
            if (typeof popupFirst != "undefined" && popupFirst) {
                var parentwindowId = GLD.ngmf.object(windowids[0]).getSelectedWindowId();
                var selectedWindow = GLD.ngmf.object(windowids[0]).getWindowByWindowId(parentwindowId);
                var iframeDom = selectedWindow.document.getElementById(windowids[1]).getElementsByTagName("iframe")[0];
                targetWindow =  iframeDom.contentWindow || iframeDom.contentDocument; 
                if (!targetWindow) targetWindow = ngmf._getWindowToId(GLD.ngmf.object(windowids[0]), windowids[1]);
            } else { 
                targetWindow = ngmf._getWindowToId(GLD.ngmf.object(windowids[0]), windowids[1]);
                if (!targetWindow) {
                    var parentwindowId = GLD.ngmf.object(windowids[0]).getSelectedWindowId();
                    var selectedWindow = GLD.ngmf.object(windowids[0]).getWindowByWindowId(parentwindowId);
                    var iframeDom = selectedWindow.document.getElementById(windowids[1]).getElementsByTagName("iframe")[0];
                    targetWindow =  iframeDom.contentWindow || iframeDom.contentDocument; 
                }
            }
            */
        } catch (e) { 
        } 
        return targetWindow;
    } else return null; 
};


/**
 * Push서버에서 전송되는 전체 공지를 받는 Form을 등록
 * @date 2016-04-21
 * @memberOf ngmf.ext.push
 * @param {String} formId  :: I :: N ::  :: 전체 공지 메시지를 받고자 하는 Form ID
 * @param {String} datasetId  :: I :: N ::  :: 전체 공지 메시지를 받는 Dataset ID 
 * @return {Boolean} 
 * @author 성일호
 * @example  
 */
ngmf.ext.push.addUnsol = function(formId, datasetId) {
    try {
        if (ngmf.ext.push.getInitId() < 0) {
            ngmf.ext.push.init();
            return false;
        } 
        if (GLD.GDS_PUSHRCVLIST) {
            var windowID = ngmf.mdiTabs().id+ "|" + ( formId ||ngmf.getFormID());
            var seventkey = ngmf.extGetWinHandle() + "POPUP";
            var chkIdx = GLD.GDS_PUSHRCVLIST.getMatchedIndex("seventkey", seventkey );
            if ( chkIdx.length == 0 ){
                var rIdx = GLD.GDS_PUSHRCVLIST.insertRow(); 
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "windowid", windowID);
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "seventkey", seventkey);
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "eventname", "COMPOPUP");
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "eventkey", ngmf.getGlobalValue("g_Ngms_UserId"));
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "datasetid", datasetId);
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "addmethod", 1);
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "maxrow", 0);
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "appendpos",0);
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "ispopup",""); //
                 GLD.GDS_PUSHRCVLIST.setCellData(rIdx, "wframeid","");
            }
        }  
        return true;
    } catch (e) {
        ngmf._error("ngmf.ext.push.addUnsol Excecption::", e);
    }
    return false;
};

ngmf.ext.push._erbsetunsolclient = function(formObject ,datasetId) {
    if (ngmf.ext.push.getInitId() > 0)  
        return ngmf.ext.push.promise( ngmf.ext.push._module, "erbsetunsolclient", [ngmf.ext.push.getInitId()]);  
    else return  Promise.resolve().then(function(){return "등록할 서비스가 없습니다.";}); 
};

/**
 * Push서버에서 전송되는 전체 공지를 받는 Form을 등록
 * @date 2016-04-21
 * @memberOf ngmf.ext.push
 * @param {String} formId  :: I :: N ::  :: 전체 공지 메시지를 받고자 하는 Form ID
 * @param {String} datasetId  :: I :: N ::  :: 전체 공지 메시지를 받는 Dataset ID 
 * @return {Boolean} 
 * @author 성일호
 * @example  
 */
ngmf.ext.push.deleteUnsol = function(formId, datasetId) {
    try {
        if (typeof GLD.GDS_PUSHRCVLIST == "undefined" || !GLD.GDS_PUSHRCVLIST) {
            return false;
        }
        if (GLD.GDS_PUSHRCVLIST) {
            var chkIdx = GLD.GDS_PUSHRCVLIST.getMatchedIndex("eventname", "COMPOPUP" );
            if ( chkIdx.length > 0 ){
                for (var i = (chkIdx.length -1) ; i >-1; i-- ) {
                    GLD.GDS_PUSHRCVLIST.removeRow(chkIdx[i]); 
                }
            }
        } 
        return true;
    } catch (e) {
        ngmf._error("ngmf.ext.push.deleteUnsol Excecption::", e);
    }
    return false;
};


/**
 * 메시지를 받기위한 Event Key을 Push Server에 등록합니다
 * @date 2016-04-21
 * @memberOf ngmf.ext.push
 * @param {String} formId  :: I :: N ::  :: 전체 공지 메시지를 받고자 하는 Form ID
 * @param {String} eventName :: I :: N ::  :: Push Server에 넘겨 줄 Event Name
 * @param {String} eventKey  :: I :: N ::  :: Push Server에 넘겨 줄 Event Key 
 * @param {String} datasetId  :: I :: N ::  :: 전체 공지 메시지를 받는 Dataset ID 
 * @param {Number} addMethod  :: I :: Y :: 0 :: 수신한 Push 메시지를 데이터셋에 반영하는 방법 //0:Clear & Add  1:Append  2: Update(미사용)
 * @param {Number} maxRow  :: I :: Y :: 0 :: addMethod = 1 일경우 추가되는 Row 개수를 제한(미사용)
 * @param {Number} appendPos  :: I :: Y :: 0 :: addMethod = 1,2 일경우 추가되는 Row 위치(미사용)
 * @param {String} userData  :: I :: Y :: 0 :: 사용자 DATA
 * @param {String} callType  :: I :: Y :: 0 ::  "1" => POPUP or WFRAME ID
 * @return {Boolean} 
 * @author 성일호
 * @example  
 */
ngmf.ext.push.add = function(formId, eventName, eventKey, datasetId, addMethod,maxRow,appendPos,userData , callType) {
    //formId ||ngmf.getFormID()
    if (formId != "MAINTOP") {
        if (ngmf.isPopup()) return GLD.ngmf.ext.push._add(ngmf.getFormID(), eventName, eventKey, datasetId, addMethod,maxRow,appendPos,userData , callType || "1" );
        else    return GLD.ngmf.ext.push._add(ngmf.getFormID(), eventName, eventKey, datasetId, addMethod,maxRow,appendPos,userData,callType );
    }   
    else return GLD.ngmf.ext.push._add(formId , eventName, eventKey, datasetId, addMethod,maxRow,appendPos,userData,callType );
};
ngmf.ext.push._add = function(formId, eventName, eventKey, datasetId, addMethod,maxRow,appendPos,userData, callType ) {
    try { 
        var isPopup = "";
        var wFrameId = "";
        if (typeof callType != "undefined") {
            if (callType == "1") isPopup = "1";
            else wFrameId = callType;
        }
        if (ngmf.ext.push.getInitId() < 0 && eventName && eventKey) {
            ngmf.ext.push.init().then(function(ret){ 
                if (ret == "N") {
                    ngmf.alert("[ngmf.ext.push.add] 초기화 실패!! 관리자에게 문의하세요...");
                } else {
                    if (ngmf.ext.push.getInitId() > 0) {
                        if (GDS_PUSHRCVLIST) {
                            var windowID = formId;
                            if (formId != "MAINTOP")
                                windowID = ngmf.mdiTabs().id + "|" + ( formId ||ngmf.getFormID());

                            if (eventKey == "BATCH" || eventKey == "EAI" || eventKey.startsWith("ORD"))
                                eventName = eventName.trim();   
                            var seventkey = eventName + eventKey;
                            var chkIdx = GDS_PUSHRCVLIST.getMatchedIndex("seventkey", seventkey );
                            if ( chkIdx.length == 0 ){
                                 ngmf.ext.push._erbaddregister(eventName,eventKey).then(function(s){
                                        var rIdx = GDS_PUSHRCVLIST.insertRow(); 
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "windowid", windowID);
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "seventkey", seventkey);
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "eventname", eventName);
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "eventkey",eventKey);
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "datasetid", datasetId);
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "addmethod",Number(addMethod || 0));
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "maxrow", 0);
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "appendpos",0);
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "userdata",userData || "");
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "ispopup",isPopup || "");
                                         GDS_PUSHRCVLIST.setCellData(rIdx, "wframeid",wFrameId || "");
                                 }).then(undefined,function(e){
                                     ngmf.ext.push.reinit (formId, eventName, eventKey, datasetId, addMethod,maxRow,appendPos,userData,callType );
                                     ngmf.alert("ngmf.ext.push.add ERROR::::" + e); 
                                 });
                            } else {
                            	var rIdx = chkIdx[0];
                                GDS_PUSHRCVLIST.setCellData(rIdx, "windowid", windowID);
                                GDS_PUSHRCVLIST.setCellData(rIdx, "seventkey", seventkey);
                                GDS_PUSHRCVLIST.setCellData(rIdx, "eventname", eventName);
                                GDS_PUSHRCVLIST.setCellData(rIdx, "eventkey",eventKey);
                                GDS_PUSHRCVLIST.setCellData(rIdx, "datasetid", datasetId);
                                GDS_PUSHRCVLIST.setCellData(rIdx, "addmethod",Number(addMethod || 0));
                                GDS_PUSHRCVLIST.setCellData(rIdx, "maxrow", 0);
                                GDS_PUSHRCVLIST.setCellData(rIdx, "appendpos",0);
                                GDS_PUSHRCVLIST.setCellData(rIdx, "userdata",userData || "");
                                GDS_PUSHRCVLIST.setCellData(rIdx, "ispopup",isPopup || "");
                                GDS_PUSHRCVLIST.setCellData(rIdx, "wframeid",wFrameId || "");
                            }
                        }   
                    }
                }
            });
        } else if (eventName && eventKey) {
            var windowID = formId;
            if (formId != "MAINTOP")
                windowID = ngmf.mdiTabs().id+ "|" + ( formId ||ngmf.getFormID());
            
            if (eventKey == "BATCH" || eventKey == "EAI" || eventKey.startsWith("ORD"))
                eventName = eventName.trim();       
            
            var seventkey = eventName + eventKey;
            var chkIdx = GDS_PUSHRCVLIST.getMatchedIndex("seventkey", seventkey );
            if ( chkIdx.length == 0 ){
                 ngmf.ext.push._erbaddregister(eventName,eventKey).then(function(s){
                        var rIdx = GDS_PUSHRCVLIST.insertRow(); 
                         GDS_PUSHRCVLIST.setCellData(rIdx, "windowid", windowID);
                         GDS_PUSHRCVLIST.setCellData(rIdx, "seventkey", seventkey);
                         GDS_PUSHRCVLIST.setCellData(rIdx, "eventname", eventName);
                         GDS_PUSHRCVLIST.setCellData(rIdx, "eventkey",eventKey);
                         GDS_PUSHRCVLIST.setCellData(rIdx, "datasetid", datasetId);
                         GDS_PUSHRCVLIST.setCellData(rIdx, "addmethod",Number(addMethod || 0));
                         GDS_PUSHRCVLIST.setCellData(rIdx, "maxrow", 0);
                         GDS_PUSHRCVLIST.setCellData(rIdx, "appendpos",0);
                         GDS_PUSHRCVLIST.setCellData(rIdx, "userdata",userData || "");
                         GDS_PUSHRCVLIST.setCellData(rIdx, "ispopup",isPopup || "");
                         GDS_PUSHRCVLIST.setCellData(rIdx, "wframeid",wFrameId || "");
                 }).then(undefined,function(e){
                     ngmf.ext.push.reinit (formId, eventName, eventKey, datasetId, addMethod,maxRow,appendPos,userData ,callType);
                     ngmf.alert("ngmf.ext.push.add ERROR::::" + e);
                 });
            } else {
            	var rIdx = chkIdx[0];
                GDS_PUSHRCVLIST.setCellData(rIdx, "windowid", windowID);
                GDS_PUSHRCVLIST.setCellData(rIdx, "seventkey", seventkey);
                GDS_PUSHRCVLIST.setCellData(rIdx, "eventname", eventName);
                GDS_PUSHRCVLIST.setCellData(rIdx, "eventkey",eventKey);
                GDS_PUSHRCVLIST.setCellData(rIdx, "datasetid", datasetId);
                GDS_PUSHRCVLIST.setCellData(rIdx, "addmethod",Number(addMethod || 0));
                GDS_PUSHRCVLIST.setCellData(rIdx, "maxrow", 0);
                GDS_PUSHRCVLIST.setCellData(rIdx, "appendpos",0);
                GDS_PUSHRCVLIST.setCellData(rIdx, "userdata",userData || "");
                GDS_PUSHRCVLIST.setCellData(rIdx, "ispopup",isPopup || "");
                GDS_PUSHRCVLIST.setCellData(rIdx, "wframeid",wFrameId || "");
            }
        }

        return true;
    } catch (e) {
        ngmf._error("ngmf.ext.push.add Excecption::", e); 
    }
    return false;
};

/**
 *  Event Key을 Push Server에 등록합니다
 * @date 2016-04-21
 * @memberOf ngmf.ext.push 
 * @param {String} eventName :: I :: N ::  :: Push Server에 넘겨 줄 Event Name
 * @param {String} eventKey  :: I :: N ::  :: Push Server에 넘겨 줄 Event Key  
 * @return {Boolean} 
 * @author 성일호
 * @example  
 */

ngmf.ext.push._erbaddregister = function(eventName,eventKey ) {
    var keyCount = 1;
    if (ngmf.ext.push.getInitId() > 0)  
        return ngmf.ext.push.promise( ngmf.ext.push._module, "erbaddregister", [ngmf.ext.push.getInitId(), eventName, eventKey, keyCount, eventKey.length]).then(function(result){
            if (result &&1 == Number(result) ) return result;
            else return Promise.reject(result); 
        });  
    else {
        //ngmf.alert("등록할 서비스가 없습니다.");
        return Promise.reject("등록할 서비스가 없습니다."); 
    }
};

/**
 * Push 서버로부터 해당 Event Key 메시지 수신을 중지 합니다.(등록된 Event를 삭제한다)
 * @date 2016-04-21
 * @memberOf ngmf.ext.push
 * @param {String} formId  :: I :: N ::  :: 전체 공지 메시지를 받고자 하는 Form ID
 * @param {String} eventName :: I :: N ::  :: Push Server에 넘겨 줄 Event Name
 * @param {String} eventKey  :: I :: N ::  :: Push Server에 넘겨 줄 Event Key 
 * @param {String} datasetId  :: I :: N ::  :: 전체 공지 메시지를 받는 Dataset ID 
 * @return {Boolean} 
 * @author 성일호
 * @example  
 */
ngmf.ext.push.del = function(formId, eventName, eventKey, datasetId ) {
    return GLD.ngmf.ext.push._del(formId, eventName, eventKey, datasetId ) ;
};
ngmf.ext.push._del = function(formId, eventName, eventKey, datasetId ) {
    try {  
        if (ngmf.ext.push.getInitId() > 0) {
            if (GDS_PUSHRCVLIST && eventName && eventKey) {
                // 31 Byte 로 맞추기 위해서...
                if (eventKey == "BATCH" || eventKey == "EAI" || eventKey.startsWith("ORD"))
                    eventName = eventName.trim();       
                
                var seventkey = eventName + eventKey;
                var chkIdx = GDS_PUSHRCVLIST.getMatchedIndex("seventkey", seventkey );
                if ( chkIdx.length > 0 ){
                    GDS_PUSHRCVLIST.removeRow(chkIdx[0]);
                     ngmf.ext.push._erbdelregister(eventName,eventKey).then(function(s){
                     }).then(undefined,function(e){
                         ngmf._error("ngmf.ext.push.del ERROR" + e);                      
                     });
                }
            }   
        }
        return true;
    } catch (e) {
        ngmf._error("ngmf.ext.push.del Excecption::", e); 
    }
    return false;
};

ngmf.ext.push._erbdelregister = function(eventName,eventKey ) {
    if (ngmf.ext.push.getInitId() > 0)  
        return ngmf.ext.push.promise( ngmf.ext.push._module, "erbdelregister", [ngmf.ext.push.getInitId(), eventName , eventKey, 1, eventKey.length]);  
    else return  Promise.resolve().then(function(){return "중지할 서비스가 없습니다.";});
    //return Promise.resolve("중지할 서비스가 없습니다."); 
};
 
ngmf.ext.push._erbterm = function() { 
    return ngmf.ext.push.promise( ngmf.ext.push._module, "erbterm", [ngmf.ext.push.getInitId(), 0]);
};

/**
 * Push 서버로부터 메시지 수신을 중지(수신 등록 삭제)합니다.
 * 등록되어 있는 모든 Event를 삭제한다
 * Un Initial => 
 * @date 2016-04-21
 * @memberOf ngmf.ext.push
 * @return {Promise} 
 * @author 성일호
 * @example  
 */
ngmf.ext.push._erbrmregister = function() {
    if (ngmf.ext.push.getInitId() > 0)  { 
        return ngmf.ext.push.promise( ngmf.ext.push._module, "erbrmregister", [ngmf.ext.push.getInitId()]);
    }
    else return  Promise.resolve().then(function(){return "삭제할 서비스가 없습니다.";});
};
 /**
  *   지난 긴급공지 이력을 보여준다.
  * @date 2016-04-26
  * @memberOf ngmf.ext.push 
  * @param {String} rcvr_id  :: I :: N ::  :: 수신자ID   
  * @param {String} ocallr_id  :: I :: N ::  :: 발신자ID 
  * @param {String} ocallr_nm  :: I :: N ::  :: 발신자명 
  * @param {String} title_nm  :: I :: N ::  :: 제목 
  * @param {String} ctxt_ctt  :: I :: N ::  :: 본문 
  * @param {String} link_addr  :: I :: N ::  :: 링크 
  * @param {String} pgm_id  :: I :: N ::  :: 프로그램ID 
  * @param {String} snd_dt  :: I :: N ::  :: 발송시간 
  * @author 성일호
  * @example  
  */
ngmf.ext.push.urgentMsgSet = function(rcvr_id, ocallr_id, ocallr_nm, title_nm, ctxt_ctt, link_addr, pgm_id, snd_dt) {
    return  GLD.ngmf.ext.push._urgentMsgSet(rcvr_id, ocallr_id, ocallr_nm, title_nm, ctxt_ctt, link_addr, pgm_id, snd_dt);
};
ngmf.ext.push._urgentMsgSet = function(rcvr_id, ocallr_id, ocallr_nm, title_nm, ctxt_ctt, link_addr, pgm_id, snd_dt) {
    try { 
        if (GDS_RIGHT_COMMON_LIST && GDS_URGENTMSG ) {
            var nFindRow = GDS_RIGHT_COMMON_LIST.getMatchedIndex("link_url", "AAT::ZNGMSMAN00270");
            var strTime = ngmf.mid(ngmf.getDate(), 8, 4);
            if (nFindRow > -1) {
                var nRow = GDS_URGENTMSG.insertRow(0);
                GDS_URGENTMSG.setCellData(nRow, "toTime", strTime);
                // 긴급메시지가 온시간.
                GDS_URGENTMSG.setCellData(nRow, "rcvr_id", rcvr_id);
                GDS_URGENTMSG.setCellData(nRow, "ocallr_id", ocallr_id);
                GDS_URGENTMSG.setCellData(nRow, "ocallr_nm", ocallr_nm);
                GDS_URGENTMSG.setCellData(nRow, "title_nm", title_nm);
                GDS_URGENTMSG.setCellData(nRow, "ctxt_ctt", ctxt_ctt);
                GDS_URGENTMSG.setCellData(nRow, "link_addr", link_addr);
                GDS_URGENTMSG.setCellData(nRow, "pgm_id", pgm_id);
                GDS_URGENTMSG.setCellData(nRow, "snd_dt", snd_dt);
            }
        }
        
        var strArg = "rcvr_id=" + ngmf.quote(rcvr_id);
        strArg += " ocallr_id=" + ngmf.quote(ocallr_id);
        strArg += " ocallr_nm=" + ngmf.quote(ocallr_nm);
        strArg += " title_nm=" + ngmf.quote(title_nm);
        strArg += " ctxt_ctt=" + ngmf.quote(ctxt_ctt);
        strArg += " link_addr=" + ngmf.quote(link_addr);
        strArg += " pgm_id=" + ngmf.quote(pgm_id);
        strArg += " snd_dt=" + ngmf.quote(snd_dt); 
        
        // 긴급공지 Popup 호출
        ngmf.ext.push.SSOMsgSet(strArg);
 
    } catch (e) {
        ngmf._error("ngmf.ext.push._urgentMsgSet  Excecption::", e);
    }
};

ngmf.ext.push.SSOMsgSet = function(strArg) {
    try { 
        //공지사항은 현재 선택된 MDI에서 Dialog로 오픈 함...
        var selectedWinId = ngmf.mdiTabs().getSelectedWindowId();
        var selectedWindow = ngmf.ext.push._getTargetFormWindow(ngmf.mdiTabs().id+ "|" + selectedWinId);
        
        if (selectedWindow) {
            var nWidth = 480;
            var nHeight = 490;
            var nLeft = ngmf.toInteger((selectedWindow.window.innerWidth||selectedWindow.document.documentElement.clientWidth ) / 2 - nWidth / 2);
            var nTop = ngmf.toInteger((selectedWindow.window.innerHeight||selectedWindow.document.documentElement.clientHeight ) / 2 - nHeight / 2);
        
            selectedWindow.ngmf.promise.dialog("CCA", "ZNGMSMSG12170", strArg, nWidth , nHeight ,"",nLeft ,nTop ,selectedWinId)
            .then(function(rtnVal) {
            });
        }
    } catch (e) {
        ngmf._error("ngmf.ext.push.SSOMsgSet  Excecption::", e);
    }
};
/**
 *   공지 이력을 보여준다.
 * @date 2016-04-26
 * @memberOf ngmf.ext.push 
 * @param {String} rcvr_id  :: I :: N ::  :: 수신자ID   
 * @param {String} ocallr_id  :: I :: N ::  :: 발신자ID 
 * @param {String} ocallr_nm  :: I :: N ::  :: 발신자명 
 * @param {String} title_nm  :: I :: N ::  :: 제목 
 * @param {String} ctxt_ctt  :: I :: N ::  :: 본문 
 * @param {String} link_addr  :: I :: N ::  :: 링크 
 * @param {String} pgm_id  :: I :: N ::  :: 프로그램ID 
 * @param {String} snd_dt  :: I :: N ::  :: 발송시간 
 * @author 성일호
 * @example  
 */
ngmf.ext.push.emergencePopup = function(rcvr_id, ocallr_id, ocallr_nm, title_nm, ctxt_ctt, link_addr, pgm_id, snd_dt) {
    return  GLD.ngmf.ext.push._emergencePopup(rcvr_id, ocallr_id, ocallr_nm, title_nm, ctxt_ctt, link_addr, pgm_id, snd_dt);
};
ngmf.ext.push._emergencePopup = function(rcvr_id, ocallr_id, ocallr_nm, title_nm, ctxt_ctt, link_addr, pgm_id, snd_dt) {
    try { 
        //공지사항은 현재 선택된 MDI에서 Dialog로 오픈 함...
        var selectedWinId = ngmf.mdiTabs().getSelectedWindowId();
        var selectedWindow = ngmf.ext.push._getTargetFormWindow(ngmf.mdiTabs().id + "|" + selectedWinId);       
        if (selectedWindow) {
            var nWidth = 330;
            var nHeight = 334;
            var nLeft = ngmf.toInteger((selectedWindow.window.innerWidth||selectedWindow.document.documentElement.clientWidth ) / 2 - nWidth / 2);
            var nTop = ngmf.toInteger((selectedWindow.window.innerHeight||selectedWindow.document.documentElement.clientHeight ) / 2 - nHeight / 2);
            
            // 공통화면에 공지 이력을 쌓는다.
            if (GDS_PUSH_POP_UKEY && pgm_id ) {
                if (pgm_id == "OSSUX401") {
                    //GDS_ALERTLIST.removeAll();
                    //St_msg.Text =  title_nm;
                } 
                var nRow = GDS_PUSH_POP_UKEY.insertRow(0);
                GDS_PUSH_POP_UKEY.setCellData(nRow, "rcvrid", rcvr_id);
                GDS_PUSH_POP_UKEY.setCellData(nRow, "ocallrid", ocallr_id);
                GDS_PUSH_POP_UKEY.setCellData(nRow, "ocallrnm", ocallr_nm);
                GDS_PUSH_POP_UKEY.setCellData(nRow, "titlenm", title_nm);
                GDS_PUSH_POP_UKEY.setCellData(nRow, "ctxtctt", ctxt_ctt);
                GDS_PUSH_POP_UKEY.setCellData(nRow, "linkaddr", link_addr);
                GDS_PUSH_POP_UKEY.setCellData(nRow, "pgmid", pgm_id);
                GDS_PUSH_POP_UKEY.setCellData(nRow, "snddt", snd_dt);
                GDS_PUSH_POP_UKEY.setCellData(nRow, "poptype", "POPUP");
                WebSquare.event.fireEvent(GDS_PUSH_POP_UKEY, "ondataload" ,nRow);
            }
            
            if (GDS_PUSH_POP_UKEY && GDS_PUSH_POP_UKEY.getRowCount() > 0) {
                var strArg = "rcvr_id=" + ngmf.quote(GDS_PUSH_POP_UKEY.getCellData(0, "rcvrid"));
                strArg += " ocallr_id=" + ngmf.quote(GDS_PUSH_POP_UKEY.getCellData(0, "ocallrid"));
                strArg += " ocallr_nm=" + ngmf.quote(GDS_PUSH_POP_UKEY.getCellData(0, "ocallrnm"));
                strArg += " title_nm=" + ngmf.quote(GDS_PUSH_POP_UKEY.getCellData(0, "titlenm"));
                strArg += " ctxt_ctt=" + ngmf.quote(GDS_PUSH_POP_UKEY.getCellData(0, "ctxtctt"));
                strArg += " link_addr=" + ngmf.quote(GDS_PUSH_POP_UKEY.getCellData(0, "linkaddr"));
                strArg += " pgm_id=" + ngmf.quote(GDS_PUSH_POP_UKEY.getCellData(0, "pgmid"));
                strArg += " snd_dt=" + ngmf.quote(GDS_PUSH_POP_UKEY.getCellData(0, "snddt")); 
                
                selectedWindow.ngmf.promise.dialog("CCA", "ZNGMSMSG12160", strArg, nWidth , nHeight ,"",nLeft ,nTop ,selectedWinId)
                .then(function(rtnVal) {
                    GDS_PUSH_POP_UKEY.removeRow(0);
                });
            }
        }
    } catch (e) {
        ngmf._error("ngmf.ext.push._emergencePopup  Excecption::", e);
    } 
};

ngmf.ext.push.pushPopWait = function() {
    return GLD.ngmf.ext.push._pushPopWait();
};
ngmf.ext.push._pushPopWait = function() {
    try {   
        var strGubun = "";
        var strKey = "";
        
        // 긴급공지 
        strGubun = "SSO";
        strKey = ngmf.getGlobalValue("g_Ngms_UserId");
        ngmf.ext.push._add ("MAINTOP" , strGubun, strKey, "GDS_PUSH_POP_PORTAL", 0, 0, 0, "");

        // 메세지발송
        strGubun = "POPUP";
        ngmf.ext.push._add ("MAINTOP" , strGubun, strKey, "GDS_PUSH_POP_UKEY", 1, 0, 0, "");
        
        /* -------- 상위영업조직 ID 접속통제---------------------------- */
        strGubun = "CNT";        
        ngmf.ext.push._add ("MAINTOP" , strGubun, strKey, "GDS_PUSH_DISCONNECT", 0, 0, 0, "");
        
        /* -------- 실시간 SSL FLAG 변경(U.Key 접속된 전체 사용자) ---------------------------- */
        strGubun = "SSL";
        strKey = "1234567";
        ngmf.ext.push._add ("MAINTOP" , strGubun, strKey, "GDS_PUSH_SSL_FLAG", 0, 0, 0, "");
    } catch (e) {
        ngmf._error("ngmf.ext.push._pushPopWait  Excecption::", e);
    }
};

ngmf.ext.push.pushPopDelete = function(bType) {
    return GLD.ngmf.ext.push._pushPopDelete(bType);
};
ngmf.ext.push._pushPopDelete = function(_bType) {
    try {   
        var strGubun = "";
        var strKey = "";
        var bType = _bType || false;
        // 긴급공지 
        strGubun = "SSO";
        strKey = ngmf.getGlobalValue("g_Ngms_UserId");
        if (bType)
        	ngmf.ext.push._del("MAINTOP" , strGubun, strKey, "GDS_PUSH_POP_PORTAL");
        else
        	ngmf.ext.push._del("MAINTOP" , strGubun, strKey, "GDS_PUSH_POP_PORTAL");
        
        
        // 메세지발송
        strGubun = "POPUP";
        ngmf.ext.push._del("MAINTOP" , strGubun, strKey, "GDS_PUSH_POP_UKEY");
        
        /* -------- 상위영업조직 ID 접속통제---------------------------- */
        strGubun = "CNT";       
        ngmf.ext.push._del("MAINTOP" , strGubun, strKey, "GDS_PUSH_DISCONNECT");
        
        /* -------- 실시간 SSL FLAG 변경(U.Key 접속된 전체 사용자) ---------------------------- */
        strGubun = "SSL";
        strKey = "1234567";
        ngmf.ext.push._del("MAINTOP" , strGubun, strKey, "GDS_PUSH_SSL_FLAG");
    } catch (e) {
        ngmf._error("ngmf.ext.push._pushPopDelete  Excecption::", e);
    }
};
/**
 * LocalIp를 설정한다.
 * @date 2016-04-28
 * @memberOf ngmf.ext.push
 * @author 성일호
 * @example  ngmf.ext.push.setIP();  //create() 이후 사용할 것
 */
ngmf.ext.push.setIP = function() {
    try {
    	return ngmf.ext.promise.getIPAddress().then(function(ipaddrArr){
            if (ipaddrArr.length > 0) {
                for(var i =0; i < ipaddrArr.length ; i++) {
                    if (ipaddrArr[i] && ipaddrArr[i].length > 6 && !ipaddrArr[i].startsWith("127")) {
                        ngmf._debug("SET LOCAL IP::", ipaddrArr[i]);
                        ngmf.setGlobalValue("g_Ngms_IpAddr",ipaddrArr[i]);
                        return true;
                    }
                } 
                return true;
            } else {
                ngmf.setGlobalValue("g_Ngms_IpAddr","127.0.0.1");
                ngmf._error("ngmf.ext.push.setIP  Excecption:: IP를 찾을수 없습니다.");
                return false;
            }
    	}); 
    } catch (e) {
        ngmf._error("ngmf.ext.push.setIP  Excecption::", e);
        return Promise.resolve(false);
    } 
};  

/**
 * Push Wgear 객체를 반환
 * @date 2016.04.29
 * @memberOf ngmf 
 * @return {WGear} .
 * @author 성일호
 * @example ngmf.ext.push.wgear();
 * @exampleAsIs 
 */
ngmf.ext.push.wgear = function() { 
 return GLD.ngmf.ext.push._wgear.apply(window);
};
ngmf.ext.push._wgear = function() { 
    if(typeof ngmv._wgear == "undefined" ||  !ngmv._wgear ) {
        ngmv._wgear = {};
    }
    if(ngmv._wgear[ngmf.ext.push._module]) {
        return ngmv._wgear[ngmf.ext.push._module];
    } else  {
        return null;
    }
};

ngmf.ext.push.isCreated = function() { 
     return GLD.ngmf.ext.push._isCreated.apply(window);
};
ngmf.ext.push._isCreated = function() { 
    if(typeof ngmv._pushCreated == "undefined" ) {
        ngmv._pushCreated = false;
    } else if (ngmv._pushCreated && !ngmf.ext.push.wgear()) { 
        ngmv._pushCreated = false;
    }
    return ngmv._pushCreated;
};

ngmf.ext.push.setCreated = function() { 
     return GLD.ngmf.ext.push._setCreated.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.push._setCreated = function() { 
   if(typeof ngmv._pushCreated == "undefined" ) {
    ngmv._pushCreated = false;
   }
   ngmv._pushCreated = arguments[0] ;
};

ngmf.ext.push.isConnected = function() { 
     return GLD.ngmf.ext.push._isConnected.apply(window);
};
ngmf.ext.push._isConnected = function() { 
   if(typeof ngmv._pushConnected == "undefined" ) {
	   ngmv._pushConnected = false;
   } else if (ngmv._pushConnected && !ngmf.ext.push.wgear()) { 
	   ngmv._pushConnected = false;
	   ngmf.ext.push._setCreated(false);
   }
   return ngmv._pushConnected;
};

ngmf.ext.push.setConnected = function() { 
     return GLD.ngmf.ext.push._setConnected.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.push._setConnected = function() { 
  if(typeof ngmv._pushConnected == "undefined" ) {
    ngmv._pushConnected = false;
  }
  ngmv._pushConnected = arguments[0];
}; 

ngmf.ext.push.getInitId = function() { 
     return GLD.ngmf.ext.push._getInitId.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.push._getInitId = function() { 
  if(typeof ngmv._pushInitId == "undefined" ) {
      ngmv._pushInitId = -1;
  }
  return ngmv._pushInitId ;
};

ngmf.ext.push.setInitId = function() { 
     return GLD.ngmf.ext.push._setInitId.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.push._setInitId = function() { 
  if(typeof ngmv._pushInitId == "undefined" ) {
      ngmv._pushInitId = -1;
  }
  ngmv._pushInitId = Number(arguments[0] || -1);
};
 

ngmf.ext.push.addEventListener = function() { 
     return GLD.ngmf.ext.push._addEventListener.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.push._addEventListener= function() { 
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	}
    if(ngmv._wgear[wgearMid]) {
         ngmv._wgear[wgearMid].addEventListener.apply(window, Array.prototype.slice.call(arguments));
         return true;
    } else {
        ngmf._error("WGear 객체가 초기화되어 있지 않습니다. [_addEventListener]");
        return false;
    }
};


ngmf.ext.push.removeEventListener = function() { 
     return GLD.ngmf.ext.push._removeEventListener.apply(window, Array.prototype.slice.call(arguments));
};
ngmf.ext.push._removeEventListener= function() { 
	var wgearMid = ngmf.ext.push._module;
	if (arguments[0] != ngmf.ext.push._module) {
		//wgearMid = "GearEtcClient" ;
	}
    if(ngmv._wgear[wgearMid]) {
        ngmv._wgear[wgearMid].removeEventListener.apply(window, Array.prototype.slice.call(arguments));
        return true;
    } else {
        ngmf._error("WGear 객체가 초기화되어 있지 않습니다. [_removeEventListener]");
        return false;
    }
};

/**
 * Push Wgear promise() 함수 입니다.
 * @date 2016.04.29
 * @memberOf ngmf
 * @param {Arguments} moduleName :: I :: Y ::  ::  연결할 객체 ID
 * @return {Promise} 리턴결과 값.
 * @author 성일호
 * @example ngmf.ext.connect("PushClient");
 * @exampleAsIs 
 */
ngmf.ext.push.promise = function() {
	return GLD.ngmf.ext.promise._exec.apply(window, Array.prototype.slice.call(arguments));
};

/**
 * Push서버 종료
 * @date 2016-04-21
 * @memberOf ngmf.ext.push
 * @return {Promise} 
 * @author 성일호
 * @example ngmf.ext.push.term(); 
 */
ngmf.ext.push.term = function() {
    return  GLD.ngmf.ext.push._term(); 
} ;

ngmf.ext.push._term = function() {
    try {
        if (ngmf.ext.push.getInitId() > 0) {
                ngmf.ext.push.removeEventListener(ngmf.ext.push._module);
                return ngmf.ext.push._erbrmregister().then(function(ret){
                    return ngmf.ext.push._erbterm().then(function(ret){
                        ngmf.ext.push.setInitId(-1);                        
                        //close
                        return ngmf.ext.promise.close(ngmf.ext.push._module).then(function(ret){
                            ngmf._debug("ngmf.ext.push.term ::::  close("+ngmf.ext.push._module+")", ret);
                            //destroy
                            ngmf.ext.push.setCreated(false);
                            return ngmf.ext.promise.destroy(ngmf.ext.push._module).then(function(ret){
                                ngmf._debug("ngmf.ext.push.term ::::  destroy("+ngmf.ext.push._module+")", ret); 
                                return ngmf.ext.promise.disconnect(ngmf.ext.push._module).then(function(ret){
                                    ngmf._debug("ngmf.ext.push.term ::::  disconnect("+ngmf.ext.push._module+")", ret);
                                    ngmf.ext.push.setConnected(false); 
                                    if(ngmv._wgear[ngmf.ext.push._module]) {
                                        ngmv._wgear[ngmf.ext.push._module] = null;
                                    } 
                                    GLD.GDS_PUSHRCVLIST.removeAll();
                                    return "Y";
                                }); 
                                
                            }).then(undefined, function(e){
                                ngmf._error("ngmf.ext.push.term ::::  destroy Error ("+ngmf.ext.push._module+") ERROR=", e);
                                return ngmf.ext.promise.disconnect(ngmf.ext.push._module).then(function(ret){
                                    ngmf._debug("ngmf.ext.push.term ::::  disconnect("+ngmf.ext.push._module+")", ret);
                                    ngmf.ext.push.setConnected(false); 
                                    if(ngmv._wgear[ngmf.ext.push._module]) {
                                        ngmv._wgear[ngmf.ext.push._module] = null;
                                    } 
                                    GLD.GDS_PUSHRCVLIST.removeAll();
                                    return "Y";
                                }); 
                            }); 
                            
                        });
                        
                    });
                }); 
        } else if (ngmf.ext.push.isCreated()){
            ngmf.ext.push.setCreated(false);
            ngmf.ext.push.setConnected(false);
            //disconnect
            return ngmf.ext.promise.disconnect(ngmf.ext.push._module).then(function(ret){
                if(ngmv._wgear[ngmf.ext.push._module]) {
                    ngmv._wgear[ngmf.ext.push._module] = null;
                } 
                ngmf._debug("ngmf.ext.push.term ::::  disconnect("+ngmf.ext.push._module+")", ret);
                GLD.GDS_PUSHRCVLIST.removeAll();
                return "Y";
            }); 
        } else {            
            ngmf.ext.push.setCreated(false);
            ngmf.ext.push.setConnected(false);
            if(ngmv._wgear[ngmf.ext.push._module]) {
                ngmv._wgear[ngmf.ext.push._module] = null;
            }
            GLD.GDS_PUSHRCVLIST.removeAll();
            return  Promise.resolve().then(function(){return "N";});  
        }
    } catch(e) {
        ngmf._error("ngmf.ext.push._term  Excecption::", e);
        return Promise.reject("Push서버 종료중 오류 발생."); 
    } 
};
 

/**
 * NoWait 배치 푸시 추가
 * @date 2016-04-29
 * @memberOf ngmf.ext.push 
 * @param {String} strKey  :: I :: N ::  :: Push Server에 넘겨 줄 Event Key 
 * @param {String} userData  :: I :: Y :: 0 :: 사용자 DATA 
 * @param {String} wFrameId  :: I :: Y :: 0 :: 사용자 DATA 
 * @author 성일호
 * @example  
 */
ngmf.ext.push.pushWait = function(strKey, strUserData, wFrameId) {
    return GLD.ngmf.ext.push._pushWait(strKey, strUserData, wFrameId);
};
ngmf.ext.push._pushWait = function(strKey, strUserData, wFrameId) {
    ngmf._debug("CALL pushWait::::" + strKey); 
    ngmf.ext.push._add("MAINTOP", strKey, "BATCH", "GDS_PUSH_BATCH", 0, 0, 0, strUserData,wFrameId);
};

/**
 * NoWait 배치 푸시 삭제 
 * @date 2016-04-29
 * @memberOf ngmf.ext.push 
 * @param {String} strKey  :: I :: N ::  :: Push Server에 넘겨 줄 Event Key 
 * @author 성일호
 * @example  
 */
ngmf.ext.push.pushDelete = function(strKey) {
    return GLD.ngmf.ext.push._pushDelete(strKey);
};
ngmf.ext.push._pushDelete = function(strKey) {
    ngmf.ext.push._del("MAINTOP", strKey, "BATCH", "GDS_PUSH_BATCH");
}; 

/**
 * PC IP 를 배열로 가져 온다.(Promise)
 * @date 2016-05-19
 * @memberOf ngmf.ext.promise
 * @author 성일호
 * @return {Promise}  {Array} IP배열
 * @exampleAsIs ext_GetIPAddress()
 * @example 
        ngmf.ext.promise.getIPAddress().then(function(ipaddrArr){ 
            if (ipaddrArr.length > 0) {
                for(var i =0; i < ipaddrArr.length ; i++) {
                    if (ipaddrArr[i] && ipaddrArr[i].length > 6 && !ipaddrArr[i].startsWith("127")) {
                        ngmf._debug("SET LOCAL IP::", ipaddrArr[i]);
                        ngmf.setGlobalValue("g_Ngms_IpAddr",ipaddrArr[i]);
                        break;
                    }
                }
            } else {
                ngmf._error("LOCAL IP를 찾을 수 없습니다.");
            }
        });
        
 */
ngmf.ext.promise.getIPAddress = function() {
    return new Promise(function(resolve, reject) {
        var ipaddrArr = new Array();
        try {
			ngmf.ext.promise.open("gearUtils").then(function(r) { 
		        return ngmf.ext.promise.exec("gearUtils", "getIPAddress", []);
		    }, function(e) {
		        ngmf._error("open error", e);
				return new Error(e);
		    }).then(function(ret) {
                if (ret) { 
                    $.each(ret, function(key, value){
                        if(value) ipaddrArr = ipaddrArr.concat(value); 
                    });
                }
                resolve (ipaddrArr);
		    }, function(e) {
		    	resolve(ipaddrArr);
		    	ngmf._error("exec error", e);
		    });  
        } catch(e) { 
            ngmf._error("[ngmf.ext.push.getIPAddress] Exception :: ", e);
            //오류처리
            resolve(ipaddrArr);
        }
    }); 
};
 
/**
 *  Wgear 비정상 종료시 이벤트 처리
 * @date 2016-09-08
 * @memberOf ngmf.ext
 * @author 성일호
 * @example  
 */
ngmf.ext._checkClose = function() {
    try {
    	ngmf.ext.removeCloseListener(ngmf.ext.push._module, ngmf.ext._checkClose);
    	ngmf.ext.push.setInitId(-1);
    	ngmf.ext.push.setConnected(false);
    	ngmf.ext.push.setCreated(false); 
    	if (ngmv._wgear && ngmv._wgear[ngmf.ext.push._module]) {
    		ngmv._wgear = {}; 
    		GDS_PUSHRCVLIST.removeAll();
    	}; 
		GLV.G_wgearLoaded = false;
		if (typeof btn_wgear_status != "undefined" ) ngmf.ext._changeGearStatus("btn_wgear_error");
    } catch(e) { 
        ngmf._error("[ngmf.ext._checkClose] Exception :: ", e); 
    } 
};

/**
 *  PUSH 상태 이미지 표시 변경 API
 * @date 2016-09-08
 * @memberOf ngmf.ext
 * @param {String} newClass  :: I :: N ::  ::  상태 class 명 (btn_wgear_normal / btn_wgear_error / btn_wgear_ready)
 * @author 성일호
 * @example  
 */
ngmf.ext._changeGearStatus = function (newClass) {
	try {
		var comp_Id = "btn_wgear_status";
		var comp = ngmf.object(comp_Id);
		if (typeof comp !== "undefined" && comp) {
			if ($("#"+comp_Id).hasClass("btn_wgear_normal")) {
				$("#"+comp_Id).removeClass("btn_wgear_normal");
			} 
			if ($("#"+comp_Id).hasClass("btn_wgear_error")) {
				$("#"+comp_Id).removeClass("btn_wgear_error");
			} 
			if ($("#"+comp_Id).hasClass("btn_wgear_ready")) {
				$("#"+comp_Id).removeClass("btn_wgear_ready");
			} 
			$("#"+comp_Id).addClass(newClass);
		}
	} catch (e) {
		ngmf._error("[ngmf.ext._changeGearStatus] Exception :: ", e);
	}
};


ngmf.ext._createTest = function( ) {
    try {
    	if (typeof startTime == "undefined") startTime = new Date();
    	var wgearMid = arguments[0]; 

        if(typeof ngmv._wgear =="undefined" ||  !ngmv._wgear ) {
            ngmv._wgear = {};
        }
        if(!ngmv._wgear[wgearMid]) {        
        	ngmv._wgear[wgearMid] = WGear();
        	ngmv._wgear[wgearMid]["openModules"] = {};
            ngmf._debug("ngmf.ext._createTest Create:::" ,new Date() - startTime);
        }
        return ngmf.ext.promise.connect(wgearMid).then(function(config) {                  
        	ngmf._debug("ngmf.ext._createTest connect:::" ,new Date() - startTime);
            return ngmf.ext.promise.open(wgearMid).then(function(erbCmdMap) {              
            	ngmf._debug("ngmf.ext._createTest open:::" ,new Date() - startTime); 
            	ngmf.ext.promise.exec("gearUtils", "getIPAddress", []).then(function(ret){
            		var ipaddrArr = new Array();
                    if (ret) { 
                        $.each(ret, function(key, value){
                            if(value) ipaddrArr = ipaddrArr.concat(value); 
                        });
                        ngmf._debug(" getIPAddress:::" +(new Date() - startTime) ,ipaddrArr);
                        return "Y";
                    } else {
                        ngmf._error("ngmf.ext.push.setIP  Excecption:: IP를 찾을수 없습니다.");
                        return "N";
                    } 
            	});
                return "Y";
            }).then(undefined, function(e){ 
                ngmf._error("ERROR!!! :::: ngmf.ext.promise.open " + wgearMid + "  e=" ,e); 
                return "N";
            });
        }).then(undefined, function(e) {                    
            ngmf._error("CALLED!!! :::: ngmf.ext.promise.connect " + wgearMid + "  e=" , e);
            return "N";
        }); 
    } catch (e) {
        ngmf._error("ngmf.ext._createTest Exception:::" ,e);
        return Promise.resolve().then(function(){ return "N"; });       
    }
};


/**
 * Push서버 재연결
 * @date 2016-04-21
 * @memberOf ngmf.ext.push 
 * @author 성일호
 * @example 
 *  ngmf.ext.push._reConnect().then(function(ret) {
 *      
 * }); 
 */
ngmf.ext.push._reConnect = function(statusData, _tryCount) {   
	try {
		var tryCount = 0;
		var maxTryCount = 9;
		var nMilisec = 10000;
		if (typeof _tryCount != "undefined") tryCount = Number(_tryCount);
        var strUrlPort = ngmf.getServerUrl("PUSH");
        var szServer = strUrlPort[0].replaceAll("http://","");
        var nPortNo = Number(strUrlPort[1]);
        var szUserID = ngmf.getGlobalValue("g_Ngms_UserId");
        var socketType = 0; // Socket Type (WebSocket : 0 , TCP: 1, Async : 3)
        tryCount ++;
        if (tryCount == 3 || tryCount == 6) nMilisec = 30000;
        ngmf.ext.push.promise( ngmf.ext.push._module, "erbinit", [szServer , nPortNo , szUserID , socketType])
        .then(function(retObj) {
        	var callRetry = false;
            if(!isNaN(retObj)) {
                if (Number(retObj) > 0) {
                	ngmf.ext.push._cleanReg();
                    ngmf.ext.push.setInitId(Number(retObj));
                    ngmf.ext.push.pushPopWait ();
                    return ngmf.ext.push.getInitId();
                } else  callRetry = true;
            } else  callRetry = true;
             
            if (callRetry &&  tryCount < maxTryCount) {
				setTimeout(function(){
					ngmf.ext.push._reConnect(statusData, tryCount);
				}, nMilisec); 
            } else {
            	ngmf.ext.push._destroy();
            	ngmf.alert("PUSH 서버와 연결이 끊어졌습니다. 확인후 재접속 하세요... ");
            } 
            return -1;
        }).then(undefined, function(e) {
            ngmf._error("ngmf.ext.push._init Fail:::", e);
            if (tryCount < maxTryCount) {
				setTimeout(function(){
					ngmf.ext.push._reConnect(statusData, tryCount);
				}, nMilisec); 
            } else {
            	ngmf.ext.push._destroy();
            	ngmf.alert("PUSH 서버와 연결이 끊어졌습니다. 확인후 재접속 하세요... ");
            }
            return -1;
        }); 
	} catch (e) {
		ngmf._error("[ngmf.ext.push._reConnect] Exception :: [" + ngmf.ext.push._module+ "]", e);
	} 
}; 

ngmf.ext.push._destroy = function() {   
	try {
		ngmf.ext.push._cleanReg();
		if (ngmf.ext.push.getInitId() > -1) ngmf.ext.push.setInitId(-1);
		if ( ngmf.ext.push.isConnected() ) { 
			ngmf.ext.push.setConnected(false);
			ngmf.ext.push.setCreated(false);
		}
    	if (ngmv._wgear[ngmf.ext.push._module]["openModules"]) { 
    		var openModules = ngmv._wgear[ngmf.ext.push._module]["openModules"];
    		if (openModules.hasOwnProperty(ngmf.ext.push._module)) {
    			delete ngmv._wgear[ngmf.ext.push._module]["openModules"][ngmf.ext.push._module];
    		}
    	} 
    	ngmf.ext._changeGearStatus("btn_wgear_ready");
    	scvar.G_wgearLoaded = false;
	} catch (e) {
		ngmf._error("[ngmf.ext.push._destroy] Exception :: [" + ngmf.ext.push._module+ "]", e);
	} 
}; 

ngmf.ext.push._cleanReg = function() {   
	try {
		var initId = ngmf.ext.push.getInitId();
        var eventName = "";
        var eventKey = "";
		if (ngmf.ext._checkWgear() > 1 ) {
			ngmf.ext.push._pushPopDelete();
			if (GDS_PUSHRCVLIST.getRowCount() > 0) {
				for (var rowIdx = GDS_PUSHRCVLIST.getRowCount() -1 ; rowIdx >= 0 ; rowIdx--) {
					var rowJson = ngmf.ext.push._msgParse(eventKey, false);
					var mDs = GDS_PUSHRCVLIST.getRowJSON(rowIdx);
					eventName = mDs["eventname"];
					eventKey = mDs["eventkey"];
					if (eventKey == "BATCH" || eventKey == "EAI" || eventKey.startsWith("ORD")) {
		                //rowJson = [rowJson];
		            	var wframeid = "";
		                var windowid = null;
		                var datasetid = null;
		                var addmethod =  0;
		                var dataset = null;
		                var targetWinObj = null;
		                var userdata = "";
		                var isPopup = ""; 
		                var appendpos =  0;
		                
	                    windowid = mDs.windowid;
	                    datasetid = mDs.datasetid;
	                    isPopup = mDs.ispopup;
	                    wframeid = mDs.wframeid;
	                    addmethod =  Number(mDs.addmethod || 0);  //0:Clear & Add  1:Append  2: Update
	                    dataset = null;
	                    if (datasetid) {
	                        try { 
	                            if (windowid== "MAINTOP")
	                                dataset = ngmf.object(datasetid);               
	                            else  {
	                                targetWinObj = ngmf.ext.push._getTargetFormWindow(windowid,isPopup);
	                                if (targetWinObj)
	                                    dataset = targetWinObj.ngmf.object(datasetid);
	                                else {
	                                    ngmf._error("ngmf.ext.push._msgCallBack Excecption:: targetWinObj 를 찾을수 없습니다......");
	                                }
	                            }
	                        } catch (e) { 
	                            ngmf._error("ngmf.ext.push._msgCallBack [datasetid] Excecption::", e);
	                        }
	                    }
	                    userdata =  mDs.userdata || "";                  
//		                  maxrow =  mDs.maxrow || 0;  //addmethod = 1 일경우 추가되는 Row 개수를 제한(미사용)
	                    appendpos =  Number(mDs.appendpos || 0);  //addmethod = 1,2 일경우 추가되는 Row 위치

	                    try {
	                        if (dataset){
                                rowJson["UserData"] = userdata;
                                rowJson["wframeid"] = wframeid;
                                rowJson["screen"] = mDs["windowid"];
                                rowJson["eventkey"] = eventName;
                                rowJson["filename"] = "";
                                rowJson["msglist"] = "0|RC_ERR|PUSH 서버 DISCONNECTION!!";
	                        	if (eventKey == "EAI"){
                                    rowJson["rtCode"] = "";
                                    rowJson["filetype"] = "";
	                        	}
                                if (addmethod) {
                                    ngmf.insertColumn(dataset, "UserData",  {name: "UserData", dataType : "text"});
                                    if (addmethod > 1)
                                        dataset.setRowJSON(appendpos,rowJson,true);
                                    else
                                        dataset.setRowJSON(appendpos,rowJson,false);
                                    
                                    WebSquare.event.fireEvent(dataset, "ondataload" );
                                } else  {
                                    //ngmf.insertColumn = function(dataList, columnNm, options) {
                                    ngmf.clear(dataset);                                
                                    $.each(rowJson, function(key, val) {
                                        var options = {
                                            name : key,
                                            dataType : ngmf.isNumber(val) ? "number":"text"
                                        };
                                        ngmf.insertColumn(dataset, key, options);
                                    });                             
                                    dataset.setRowJSON(0,rowJson,false);
                                    
                                    WebSquare.event.fireEvent(dataset, "ondataload");
                                }
	                        } else {
	                            //dataset
	                            ngmf._error("ngmf.ext.push._msgCallBack Excecption:: dataset 을 찾을수 없습니다.:::", "windowid=" + windowid + " datasetid" + datasetid);
	                        }
	                    } catch (e) {
	                        ngmf._error("ngmf.ext.push._msgCallBack Excecption::", e); 
	                    }
					}
					GDS_PUSHRCVLIST.removeRow(rowIdx);
				}
			} 
		}
	} catch (e) {
		ngmf._error("[ngmf.ext.push._reCreate] Exception :: [" + ngmf.ext.push._module+ "]", e);
	} 
}; 

ngmf.ext.push._msgCallBack = function(params) { 
    ngmf._debug('ngmf.ext.push._msgCallBack  params:::: ', params);   
    if (params && params.length > 2) {
        //debugger;
        var eventName = params[0].trim();
        var eventKey = params[1].trim();
        var respData = params[2];
        var isEvent = false;
        
        var mDs = [];
        
        if (eventName == "POPUP" || eventName == "SSO" || eventName == "CNT" || eventName == "SSL") {
            mDs = GLD.GDS_PUSHRCVLIST.getMatchedJSON("eventname", eventName );
            eventKey = eventName;
        } else {
            eventName =  eventName.trim(); 
            eventKey =  eventKey.trim();
            isEvent = true;
            mDs = GLD.GDS_PUSHRCVLIST.getMatchedJSON("seventkey", eventName + eventKey );
        }
        
        if (mDs.length > 0) {
            var rowJson = ngmf.ext.push._msgParse(eventKey, respData);
            
            if (!rowJson) {
            	//PUSH 메세지 분석 실패시 푸시삭제
            	if (isEvent)  ngmf.ext.push.del(mDs[i].windowid, eventName, eventKey, mDs[i].datasetid); 
                return;
            }
            if (eventKey == "SSO") { 
                if (typeof GDS_PUSH_POP_PORTAL != "undefined") {
                    rowJson["poptype"] = "SSO";
                    GDS_PUSH_POP_PORTAL.setRowJSON(0,rowJson,false);
                    if (typeof scvar.alertScwin != "undefined") scvar.alertScwin.setAlertMsg();
                }
                //ngmf.ext.push.urgentMsgSet(rowJson.rcvrid, rowJson.ocallrid, rowJson.ocallrnm, rowJson.titlenm, rowJson.ctxtctt, rowJson.linkaddr, rowJson.pgmid, rowJson.snddt);             
            } else if (eventKey == "POPUP") { 
                if (typeof GDS_PUSH_POP_UKEY != "undefined") {
                    rowJson["poptype"] = "POPUP";
                    GDS_PUSH_POP_UKEY.setRowJSON(0,rowJson,false);
                    if (typeof scvar.alertScwin != "undefined") scvar.alertScwin.setAlertMsg();
                } 
                //ngmf.ext.push.emergencePopup(rowJson.rcvrid, rowJson.ocallrid, rowJson.ocallrnm, rowJson.titlenm, rowJson.ctxtctt, rowJson.linkaddr, rowJson.pgmid, rowJson.snddt);
            } else if (eventKey == "CNT" || eventKey == "SSL") {
                var strMsgFg = rowJson["msgFg"];
                var strMsg = "";
                switch(strMsgFg) {
                    case "R" :          
                    case "K" :  
                                // R : 전산차단 : ccd 손춘수과장님/조윤정대리님
                                // K : 영업시간에 따른 전산차단
                                if(strMsgFg == "R") {
                                    strMsg = ngmf.getMessage("ZNGMC1173","&INPUT",ngmf.midb2(respData,1,ngmf.lengthb(respData)-1));
                                } else {
                                    strMsg = ngmf.getMessage("ZNGMC1162");
                                    
                                    // 접속 통제 KillLog_Process(); 
                                    var TrxCode = "ZNGMSCNT10010_TR04";
                                    //Transaction Code
                                    var ScreenName = "ZNGMSMAN00040";
                                    //화면이름
                                    var InDataList = "";
                                    //Input Datasets                        
                                    var OutDataList = "";
                                    //Output Datasets   
                                    ngmf.syncCall(TrxCode, ScreenName, "", InDataList, OutDataList, "", "SELF");
                                }
                                GLV.G_CLOSEFG = "2";
                                if (strMsg) ngmf.alert(strMsg);
                                break;
                    case "W" :
                                // W : 영업시간에 따른 전산차단 경고 메시지: ccd 조윤정대리님
                                var strTime = ngmf.midb2(respData,1,6);
                                strTime = ngmf.mid(strTime,0,2) + "시" + ngmf.mid(strTime,2,2) + "분에";
                                //&INPUT 영업시간 종료로 인하여 차단될 예정입니다.
                                strMsg = ngmf.getMessage("ZNGMC1158","&INPUT",strTime);
                                
                                ngmf.alert(strMsg);
                                break;;
                    case "Y" :
                        //--- SSL 실시간 FLAG 변경
                        GLV.G_TRX_SSL_FLAG_VAL = "Y";
                        break;;
                    case "N" :
                        //--- SSL 실시간 FLAG 변경
                        GLV.G_TRX_SSL_FLAG_VAL = "N";
                        break;      
                    default :
                }
                
            } else {
                //rowJson = [rowJson];
            	var wframeid = "";
                var windowid = null;
                var datasetid = null;
                var addmethod =  0;
                var dataset = null;
                var targetWinObj = null;
                var userdata = "";
                var isPopup = "";
//              var maxrow =  0;
                var appendpos =  0;
                
                for (var i = 0; i <mDs.length; i++ ) {
                    windowid = mDs[i].windowid;
                    datasetid = mDs[i].datasetid;
                    isPopup = mDs[i].ispopup;
                    wframeid = mDs[i].wframeid;
                    addmethod =  Number(mDs[i].addmethod || 0);  //0:Clear & Add  1:Append  2: Update
                    dataset = null;
                    if (datasetid) {
                        try { 
                            if (windowid== "MAINTOP")
                                dataset = ngmf.object(datasetid);               
                            else  {
                                targetWinObj = ngmf.ext.push._getTargetFormWindow(windowid,isPopup);
                                if (targetWinObj)
                                    dataset = targetWinObj.ngmf.object(datasetid);
                                else {
                                    ngmf._error("ngmf.ext.push._msgCallBack Excecption:: targetWinObj 를 찾을수 없습니다......");
                                }
                            }
                        } catch (e) { 
                            ngmf._error("ngmf.ext.push._msgCallBack [datasetid] Excecption::", e);
                        }
                    }
                    userdata =  mDs[i].userdata || "";                  
//                  maxrow =  mDs[i].maxrow || 0;  //addmethod = 1 일경우 추가되는 Row 개수를 제한(미사용)
                    appendpos =  Number(mDs[i].appendpos || 0);  //addmethod = 1,2 일경우 추가되는 Row 위치

                    try {
                        if (dataset){
                                if (addmethod) {
                                    ngmf.insertColumn(dataset, "UserData",  {name: "UserData", dataType : "text"});
                                    rowJson["UserData"] = userdata;
                                    rowJson["wframeid"] = wframeid;
                                    if (addmethod > 1)
                                        dataset.setRowJSON(appendpos,rowJson,true);
                                    else
                                        dataset.setRowJSON(appendpos,rowJson,false);
                                    
                                    WebSquare.event.fireEvent(dataset, "ondataload" );
                                } else  {
                                    //ngmf.insertColumn = function(dataList, columnNm, options) {
                                    rowJson["UserData"] = userdata;
                                    rowJson["wframeid"] = wframeid;
                                    ngmf.clear(dataset);                                
                                    $.each(rowJson, function(key, val) {
                                        var options = {
                                            name : key,
                                            dataType : ngmf.isNumber(val) ? "number":"text"
                                        };
                                        ngmf.insertColumn(dataset, key, options);
                                    });                             
                                    dataset.setRowJSON(0,rowJson,false);
                                    
                                    WebSquare.event.fireEvent(dataset, "ondataload");
                                }
                        } else {
                            //dataset
                            ngmf._error("ngmf.ext.push._msgCallBack Excecption:: dataset 을 찾을수 없습니다.:::", "windowid=" + windowid + " datasetid" + datasetid);
                            //푸시 삭제  
                            ngmf.ext.push.del(windowid, eventName, eventKey, datasetid);
                        }
                    } catch (e) {
                        ngmf._error("ngmf.ext.push._msgCallBack Excecption::", e); 
                        //푸시 삭제  
                        ngmf.ext.push.del(windowid, eventName, eventKey, datasetid);
                    }
                } //END for 
            }// END if (eventKey ...
        }       
    }
}; 

//disconnect 발생시 재접속 처리.... 
ngmf.ext.push._errMsgCallBack = function(params) {
	 try {	
	    if (params && params.length > 2) {
	        var eventName = params[0].trim();
	        var eventKey = params[1].trim();
	        var respData = params[2]; 
	        //EventName  : 'NETWORK' EventKey : 'STATUS'  Data : 'NETCLOSE', 'ECTERMINATE', 'ECCLOSE'
				if (eventName == "NETWORK" && eventKey =="STATUS") {
					ngmf._debug("ngmf.ext.push._errMsgCallBack::: " , params);
					switch(respData) {
					    case "NETCLOSE" :
					    	//--- Network이 종료되었습니다. 
					    case "ECTERMINATE" :
					    	//--- Network 연결은 유지되었지만 EventC와의 접속이 단절되었습니다. 
					    case "ECCLOSE" :
					    	//--- Network 연결은 유지이고 EventC가 비정상입니다.
						setTimeout(function(){
							ngmf.ext.push._reConnect(respData);
						}, 10000);
			            break;
					    default :
		            }
	        }       
	    }
	 } catch (e) {
	     ngmf._error("ngmf.ext.push._errMsgCallBack Excecption::", e); 
	 }
};
// 
ngmf.ext._MessageHandler = function(dataArray) {
	ngmf._debug("ngmf.ext._MessageHandler::: " , dataArray);
	try {
	    if (dataArray && dataArray.length > 2) { 
	    	var fromBrowser = dataArray[0];
	    	var toBrowser = dataArray[1];
	    	var dataObject = dataArray[2];
	    	if (dataObject) {
	    		//if (dataObject["Func"])
	    		ngmf.newWindow(dataObject["Fprefix"],dataObject["Formid"],dataObject["FormName"],dataObject["strArg"],dataObject["strFunction"],dataObject["strMenufg"],null, dataObject["pageSize"], dataObject["notFocusWin"]);
	    		//ngmf.newWindow(Fprefix,Formid,FormName,strArg,strFunction,strMenufg,strTopMenu, pageSize, _notFocusWin);
	    	}
	    }
	} catch (e) {
		ngmf._error("ngmf.ext.push._MessageHandler Excecption::", e); 
	}
}; 

//
ngmf.ext._checkWgear = function() {
	var nRet = -1;
	try { 
	    if(typeof ngmv._wgear == "object" && ngmv._wgear.hasOwnProperty(ngmf.ext.push._module)) {
	    	nRet ++;
	    	if (ngmv._wgear[ngmf.ext.push._module]["openModules"]) {
	    		nRet ++;
	    		var openModules = ngmv._wgear[ngmf.ext.push._module]["openModules"];
	    		if (openModules.hasOwnProperty(ngmf.ext.push._module) && openModules[ngmf.ext.push._module] != null) {
	    			nRet ++;
	    		}
	    	} 
	    } 
	} catch (e) {
		ngmf._error("ngmf.ext.push._checkWgear Excecption::", e); 
	}
	return nRet;
}; 