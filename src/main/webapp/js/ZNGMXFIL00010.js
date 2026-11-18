if(typeof ngmf == 'undefined' || ngmf == null ) {
	ngmf = {};
	ngmf.promise = {};
	ngmv = {};
	pubComm = {};
	ngmf.ext = {};
	ngmf.ext.push = {};
	ngmf.ext.cti = {};
	ngmf.ext.nice = {};
	ngmf.ext.promise = {};
	ngmf.mobile = {};
	ngmf.mobile.smpf = {};
	ngmf.mobile_ex = {};
}
/**
 * 클립보드 DATA 삭제
 * @date 2016.02.06
 * @memberOf ngmf
 * @param {String / Json} targetObj :: I :: N ::  :: 복사 대상 객체 또는 ID
 * @returns
 * @author 성일호
 * @useMobile use
 * @example ngmf.clearClipboard(dvAddr);
 */
ngmf.clearClipboard = function (targetObj) {
	try{
		if (typeof targetObj == "undefined") return ;
		if (typeof targetObj == "string") targetObj = ngmf.object(targetObj);
		if (typeof scvar["_clipboadData_" + targetObj.getID()] != "undefined")  scvar["_clipboadData_" + targetObj.getID()]  = "";
	} catch (ex) {
		ngmf._error("[ngmf.setClipboard] Exception :: ", ex);
	}
};

/**
 * 클립보드로 원하는 DATA 설정
 * Ctrl - C  KeyDown 이벤트에서만 사용가능
 * @date 2016.02.06  [완료(공통) 성일호]
 * @memberOf ngmf
 * @param {String / Json} targetObj :: I :: N ::  :: 복사 대상 객체 또는 ID
 * @param {String} clipboardData :: I :: N ::  :: 클립보드저장 DATA
 * @returns
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile use
 * @example
 * 		//그리드뷰에서 ngmf.setClipboard 사용방법
		scwin.gvAddr_oneditkeydown = function(info) {
			try {
				var hopeColIndex = gvAddr.getColumnIndex("zip_code");
				if (hopeColIndex == info.colIndex) {
					var e = window.event;
				 	if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)) {
				 		ngmf.setClipboard(gvAddr,  ds_addr.getCellData( info.rowIndex , info.colIndex ));
				 	}
				}
			} catch (e) {
				ngmf._error("scwin.gvAddr_oneditkeydown ERROR:::::", e);
			}
		};

		//TextArea 에서  ngmf.setClipboard 사용방법
		scwin.resultBox_onkeydown = function(e) {
			try {
			 	if (e.keyCode == 67 && (e.ctrlKey || e.metaKey)) {
			 		ngmf._debug("resultBox_onkeydown SetData:::::" + this.getValue());
			 		ngmf.setClipboard(resultBox, this.getValue());
			 	}
			} catch (e) {
				ngmf._error("scwin.resultBox_onkeydown ERROR:::::", e);
			}
		};
 */
ngmf.setClipboard = function (targetObj, clipboardData) {
	try{
		if (typeof targetObj == "undefined" || ngmf.isNull(clipboardData) == "Y") return ;
		if (typeof targetObj == "string") targetObj = ngmf.object(targetObj);
		if (typeof scvar["_clipboadData_" + targetObj.getID()] == "undefined") {
			scvar["_clipboadData_" +targetObj.getID()] = clipboardData;
			//clipData
			targetObj.bind("oncopy", function(e) {
				var clipData = scvar["_clipboadData_" +targetObj.getID()];
				ngmf._debug("[ngmf.setClipboard] trace CALL  oncopy::clipData= "  + clipData);
				try{
					if (clipData){
						if ( WebSquare.util.isIEAllVersion() ) {
							window.clipboardData.clearData();
							window.clipboardData.setData("Text", clipData);
						} else {
							e.preventDefault();
							e.clipboardData.clearData();
							e.clipboardData.setData("text/plain", clipData);
						}
						scvar["_clipboadData_" +targetObj.getID()] = "";
					}
				} catch (ex) {
					ngmf._error("[ngmf.setClipboard.oncopy] Exception :: ", ex);
				}
			});
		} else scvar["_clipboadData_" +targetObj.getID()] = clipboardData;

	} catch (ex) {
		ngmf._error("[ngmf.setClipboard] Exception :: ", ex);
	}
};


/**
* 커서위치에 Text 추가하기
* @date 2016. 1. 25.
* @memberOf ngmf
* @param {String} areaId :: I :: N ::  :: 대상객체 ID
* @param {String} text :: I :: N ::  :: 추가할 내용
* @returns
* @author 성일호
* @useMobile use
* @example
* @since
 */
ngmf.insertAtCursor = function (areaId, text) {
	ngmf._insertAtPos(areaId, null, text);
};
ngmf._insertAtPos = function (areaId,_strPos, text) {
	var txtarea = null;
	try {
		txtarea = document.getElementById(areaId);
		if (!txtarea) return;
		var strPos = 0;
		var strPosEnd = 0;
		var scrollPos = txtarea.scrollTop;
		var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? "etc" : (document.selection ? "ie" : false));
		
		if (typeof _strPos == "undefined" || _strPos == null) {
			if (br == "ie") {
				txtarea.focus();
				var range = document.selection.createRange();
				range.moveStart('character', -txtarea.value.length);
				strPos = range.text.length;
				strPosEnd = strPos;
			} else if (br == "etc") {
				strPos = txtarea.selectionStart;
				strPosEnd = txtarea.selectionEnd;
			}
							
		} else strPos = _strPos;

		var front = (txtarea.value).substr(0, strPos);
		var back = (txtarea.value).substr(strPosEnd);
		txtarea.value = front + text + back;
		strPosEnd = strPos + text.length;
		if (br == "ie") {
			txtarea.focus();
			var range = document.selection.createRange();
			range.moveStart('character', -txtarea.value.length);
//			range.moveStart('character', strPos);
//			range.moveEnd('character', strPosEnd);
			range.select();
		} else if (br == "etc") {
//			txtarea.selectionStart = strPos;
//			txtarea.selectionEnd = strPosEnd;
			txtarea.focus();
		}
		txtarea.scrollTop = scrollPos;

	} catch (ex) {
		ngmf._error("[ngmf._insertAtPos] Exception :: ", ex);
	} finally {
		txtarea = null;
	}
};
/**
 * 쿠키값 추가하기
 * @date 2016. 1. 25.
 * @memberOf ngmf
 * @param {String} cName :: I :: Y ::  :: 쿠키이름
 * @param {String} cValue :: I :: Y ::  :: 쿠키값
 * @param {Number} expireDays :: I :: Y ::  :: 적용일자
 * @param {String} path :: I :: Y ::  :: 적용 Path default = /
 * @returns
 * @author 성일호
 * @example
 * @since
 * @useMobile use
 */
ngmf._setCookie = function (cName, cValue, _expireDays, _path) {
	try {
		var cookieValue = escape(cValue);
		if(typeof _expireDays != 'undefined') {
			var expireDate =  new Date();
			expireDate.setDate(expireDate.getDate() + _expireDays);
			cookieValue +=  ";expires=" + expireDate.toGMTString();
		}
		if(typeof _path != 'undefined') {
			cookieValue +=  ";path=" + _path;
		} else cookieValue;

		document.cookie =  cName + "=" + cookieValue;
	} catch (e) {
		ngmf._error("[ngmf._setCookie] Exception :: ", e);
	}
};

/**
 * 쿠키값 삭제하기
 * @date 2016. 1. 25.
 * @memberOf ngmf
 * @param {String} cName :: I :: Y ::  :: 쿠키이름
 * @returns
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf._delCookie = function (cName) {
	try {
		var expireDate = new Date(0);
		document.cookie =  cName + "=deleted;expires=" + expireDate.toGMTString() +";path=/";
	} catch (e) {
		ngmf._error("[ngmf._delCookie] Exception :: ", e);
	}
};

/**
 * 쿠키값 구하기
 * @date 2016. 1. 25.
 * @memberOf ngmf
 * @param {String} cName :: I :: Y ::  :: 쿠키이름
 * @returns {String} 쿠키값
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf._getCookie =  function (cName) {
	var cData = "";
	try {
		var cValue = document.cookie;
		var cStart = cValue.indexOf(cName + "=");
		if (cStart > -1) {
			cStart += ngmf.length(cName + "=");
			var cEnd = cValue.indexOf(";", cStart);
			if (cEnd == -1) cEnd = cValue.length;
			cData = unescape(cValue.substring(cStart, cEnd));
		}
	} catch (e) {
		ngmf._error("[ngmf._getCookie] Exception :: ", e);
	}
	return cData;
};

/**
 * 파일 송수신 결과 처리(Cookie)
 * 작업중
 * @date 2016. 1. 26.
 * @memberOf ngmf
 * @param {Object} argument :: I :: Y ::  :: 파일사이즈
 * @returns {Array}
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */
ngmf._parseCookie = function(file_size) {
	// 결과쿠키체크방법
	// var checkPtn = new RegExp("FileParam=(FAIL|SUCC)::","i");
	// if( "FileParam=SUCCASD"search(checkPtn) >= 0 ) return true; else return
	// false;
	var resultArr =[ "N", "NOT COOKIE VALUE", 0 ];
	try {
		if (typeof file_size != "undefined")
			resultArr[2] = file_size;
		var sSMSESSION = ngmf._getCookie("SMSESSION");
		if (sSMSESSION && sSMSESSION != "") {
			GLV.SMSESSION = sSMSESSION;
		}
		var sFileParam = ngmf._getCookie("FileParam");
		if (sFileParam && sFileParam != "" && sFileParam.indexOf("::") > -1) {
			resultArr[0] = ngmf.left(sFileParam, 4);
			if (resultArr[0] == "SUCC") resultArr[0] = "Y";
			else resultArr[0] = "N";
			resultArr[1] = ngmf.right(sFileParam, ngmf.length(sFileParam) - 6);
			// 결과 쿠키삭제
			ngmf._delCookie("FileParam");
		}
	} catch (e) {
		ngmf._error("[ngmf._parseCookie] Exception :: ", e);
	}
	return resultArr;
};

/**
 * 파일다운로드모듈 
 * @date 2016. 1. 22.
 * @memberOf ngmf
 * @param {String} file_url :: I :: N ::  :: localUrl
 * @param {String} str_cookie :: I :: N ::  :: 사용자 ID
 * @param {String} str_size :: I :: N ::  :: File Size
 * @param {Object} paramMap :: I :: N ::  :: 기타 매개값
 * @param {String / Json} callBackFunc  :: I :: Y ::  :: 결과 처리용 CAllBACK 함수
 * @param {String / Json} progressFunc  :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @returns {Array}  Result/Message/file Size
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.newFileRead = function (file_url, str_cookie, file_size, paramMap, callBackFunc, progressFunc){
	ngmf.promise._fileRead (file_url, str_cookie, file_size, paramMap, progressFuncc)
	   .then( function (retObj) { 
				if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj.rtn_arr ,retObj["paramMap"]);
			}) 
		.then( undefined, function (retObj) { 
			if (typeof callBackFunc != "undefined" && callBackFunc) {
				if (retObj["rtn_arr"])
					ngmf._getCallBackFunction(callBackFunc)(retObj.rtn_arr ,retObj["paramMap"]);
				else ngmf._getCallBackFunction(callBackFunc)(retObj);
			}
		});
	return ["Y"];
};

/**
 * 파일업로드 모듈
 * @date 2016. 1. 22.
 * @memberOf ngmf
 * @param {Object} fileObj :: I :: N ::  :: 업로드할 파일 객체
 * @param {Object} paramMap :: I :: N ::  :: (parameter)
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 업로드 결과 확인용 CALLBACK FUNCTION
 * @param {String / Json} progressFunc :: I :: Y ::  :: 업로드 프로그래스 처리용 CALLBACK FUNCTION
 * @param {Boolean} chkAcl :: I :: Y ::  :: 암호화 해제여부
 * @returns {Array}  Result/Message/file Size
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.newFileWrite = function (fileObj, paramMap, callBackFunc, progressFunc, chkAcl){
	ngmf.promise._fileWrite (fileObj, paramMap, progressFunc,chkAcl)
	   .then( function (retObj) { 
				if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj.rtn_arr ,retObj["paramMap"]);
			}) 
		.then( undefined, function (retObj) { 
			if (typeof callBackFunc != "undefined" && callBackFunc) {
				if (retObj["rtn_arr"])
					ngmf._getCallBackFunction(callBackFunc)(retObj.rtn_arr ,retObj["paramMap"]);
				else ngmf._getCallBackFunction(callBackFunc)(retObj);
			}
		});
	return ["Y"];
};
 
 
/**
 * 멀티 업로드 파일 필터 적용
 * @date 2016. 1. 22.
 * @memberOf
 * @param {Object} muId :: I :: N ::  :: 멀티업로드 파일 upload Component ID
 * @returns {Boolean}
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.clearMudFilter =  function (muId) {
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.clearMudFilter : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	if (!muId) return false;
	var mud_target = ngmf.object(muId);
	try{
		if (typeof mud_target =="object") {
			if(mud_target.filter && mud_target.filter != "") {
				var filterArr = mud_target.filter.split("|");
				var filterStrs = "", filterStr = "";
				for (var i = 0; i < filterArr.length ; i++ ) {
					filterStr =  filterArr[i].substr(filterArr[i].indexOf(":")+1);
					if (filterStr == "*.*") return true;
					filterStrs += filterStr;
				}
				var fileArr = mud_target.getFileInfos();
				var errMsg = "";
				for ( var i = 0, loopCnt = fileArr.length; i < loopCnt; i++) {
					var info = fileArr[i];
					if( filterStrs.indexOf(ngmf.chkMimeType(info.name)) == -1 ) {
						mud_target.removeFile(info.name);
						errMsg += "," + info.name;
					}
				}
				if(errMsg != "") {
					errMsg = errMsg.substr(1);
					errMsg = "파일[" + errMsg +"]는 허용된 파일이 아닙니다.";
					ngmf.alert(errMsg);
					return false;
				}
			}
			//"이미지파일:*.png;*.jpg;*.gif;*.bmp|문서파일:*.docx;*.doc;*.ppt;*.pptx;*.pdf|모든 파일:*.*"  mud_target.filter
		}
	} catch (e){ngmf._error("ngmf.clearMudFilter ", e);}
	return true;
};

/**
 * 멀티업로드 DATA SET 구성
 * @date 2016. 1. 22.
 * @memberOf ngmf
 * @param {Object} dsId :: I :: N ::  :: DATA SET ID
 * @param {Object} muId  :: I :: N ::  :: 멀티업로드ID
 * @returns
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.multiUplodDsSet = function ( dsId, muId ) {
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.multiUplodDsSet : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	var mud_target = ngmf.object(muId || "fileM");
	try{
		//&& ngmf.clearMudFilter(muId || "fileM")
		if (typeof mud_target =="object" ) {
			var ds_file = ngmf.object(dsId || "ds_file");
			if (!ds_file) return;
			var fileArr = mud_target.getFileInfos();
			if (fileArr && fileArr.length > 0) {
				try{
//					if (typeof chkbtn_fileDel == 'object' && chkbtn_fileDel != null) {
//						chkbtn_fileDel.setDisabled(false);
//					}
//					if (typeof chkbtn_callUpload == 'object' && chkbtn_callUpload != null) {
//						chkbtn_callUpload.setDisabled(false);
//					}
				} catch (e) {ngmf._error("[ngmf.multiUplodDsSet] Exception :: ", e);}

				var dsDatas = [];
				ds_file.removeAll();
				for ( var i = 0, loopCnt = fileArr.length; i < loopCnt; i++) {
					var info = fileArr[i];
					dsDatas.push("0"); // checkbox
					dsDatas.push(info.name); // 파일명
					dsDatas.push(info.size); // 크기
					dsDatas.push("0"); //삭제여부
					dsDatas.push(""); // 결과
					dsDatas.push(""); // storedFileName
					dsDatas.push(""); // fileSequence
					dsDatas.push("i"); // fileSequence
				}
				ds_file.setData(dsDatas);
			}
		}
	} catch (e){ngmf._error("[ngmf.multiUplodDsSet] Exception :: ", e);}
};

/**
 *  파일Size Formatter
 * @date 2016. 1. 22.
 * @memberOf ngmf
 * @param {Object} bytes :: I :: N ::  :: 파일크기
 * @returns {Object}
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.formatFileSize = function (bytes) {
	if(! bytes)  return "";
	try {
		if (typeof bytes !== 'number') {
			bytes = Number(bytes);
		}
		if (bytes >= 1000000000) {
			return (bytes / 1000000000).toFixed(2) + ' GB';
		}
		if (bytes >= 1000000) {
			return (bytes / 1000000).toFixed(2) + ' MB';
		}
		return (bytes / 1000).toFixed(2) + ' KB';
	} catch (e) {
		ngmf._error("[ngmf.formatFileSize] Exception :: ", e);
	}
};

/**
 * file 객체 정보 추출
 * @date 2016. 1. 22.
 * @memberOf ngmf
 * @param {Object} fileObj :: I :: N ::  :: 대상 파일 upload Component
 * @returns {Object}
 * @author 성일호
 * @example ngmf.getFileInfo(document.getElementById("file0").files[0])
 * @since
 * @useMobile useless
 */
ngmf.getFileInfo = function (fileObj) {
	var retMap = {file : "", size:0, type:"", mdate:"", mime : ""};
	try {
		if (!fileObj) throw "선택된 파일 객체가 없습니다.";
		if (typeof fileObj == "string") {
			fileObj = ngmf.object(fileObj);
		}
		if (fileObj) {
			if (typeof  fileObj.getPluginName != "undefined" && fileObj.getPluginName().toLowerCase() == "upload" ) {
				fileObj = document.getElementById(fileObj.getID()+ "_fakeinput").files[0];
			} else if (typeof  fileObj.type != "undefined" && fileObj.type == "file" ) {
				fileObj = fileObj.files[0];
			}
		} else throw "선택된 파일 객체가 없습니다.";
		
		if (!fileObj ) {
			throw "선택된 파일 객체가 없습니다.";
		}
		
		if (fileObj) {
	 		retMap.file = fileObj.name;
			retMap.mime = ngmf.chkMimeType(fileObj.name);
			retMap.size = Number(fileObj.size);
 			retMap.type = fileObj.type||"";
			var date = fileObj.lastModifiedDate;
			retMap.mdate = ('' + date.getFullYear() )+ ('0'+ (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2)+ ('0' + date.getHours()).slice(-2)+ ('0' + date.getMinutes()).slice(-2) +  ('0' + date.getSeconds()).slice(-2);
		}
	} catch (e) {
		ngmf._error("[ngmf.getFileInfo] Exception :: ", e);
	}
	return retMap;
};

/**
 * 파일업로드시에 파일의 개수를 체크한다.
 * @date 2015. 10. 23.
 * @memberOf ngmf
 * @param {Number} sValue :: I :: N ::  :: 파일의 개수
 * @param {Number} eFlag :: I :: Y ::  :: 경고메세지 출력 안함
 * @returns {String} 초과 : "Y", 초과아님 : "N", 비정상 : ""
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.checkFileNum = function(sValue, eFlag) {
	// 변수선언
	var sRtnVal = "N";
	try {
		// number type 처리
		if (ngmf.isNull(sValue) == "Y") {
			return "";
		}
		if (typeof sValue == "string") {
			sValue = ngmf.parseInt(sValue);
		}
		if ( sValue > 20) {
			if (eFlag) {
				sRtnVal = "Y";
			} else {
				sRtnVal = "Y";
				var strMsg = ngmf.getMessage("ZNGMC0058", "", "");
				if (strMsg && strMsg.length > 0) ngmf.alert(strMsg);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.checkFileNum] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 파일업로드시에 중복된 파일 이름을 CHECK 한다.
 * @date 2015. 10. 23.
 * @memberOf ngmf
 * @param {String} inFilename :: I :: N ::  :: 입력된 파일 이름
 * @param {Object} ds_file :: I :: N ::  :: File Dataset
 * @returns {Array} 중복 : "Y", 변경 : "U",중복아님 : "N", 비정상 : ""
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.checkDuplicateFilename = function(inFilename, ds_file) {
	// 변수선언
	var sRtnVal = [ "N" ];
	try {
		if (ngmf.isNull(inFilename) == "Y" || !ngmf.isValid(ds_file)) {
			sRtnVal[0] = "N";
		} else {
			if ( ds_file.getMatchedIndex("file", inFilename).length > 0) sRtnVal[0] = "Y";
//			for ( var jx = 0; jx < ds_file.getRowCount(); jx++) {				
//				if (inFilename == ngmf.getFileName(ds_file.getCellData(jx, "file"))) {
//					if (ds_file.getCellData(jx, "trxCode") == "i'") sRtnVal[0] = "U";
//					else  sRtnVal[0] = "Y";
//					break;
//				}
//			}
		}
	} catch (e) {
		ngmf._error("[ngmf.checkDuplicateFilename] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 파일그리드의 툴팁을 파일명으로 설정
 * @date 2015. 10. 23.
 * @memberOf ngmf
 * @param {Object} ds_file :: I :: N ::  :: 파일 데이터리스트 Object
 * @param {Number} nRow :: I :: Y ::  :: Row Position
 * @param {Object} objState :: I :: N ::  :: Gridview Object
 * @returns {Object}
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.showGridToolTipText = function(ds_file, nRow, objState) {
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.showGridToolTipText : 모바일환경에서 지원불가 API 입니다.");
		return;
	}
	if (ngmf.isValid(objState)) {
		objState.options.tooltipDisplay = true;
		objState.options.tooltipShowAlways = true;
		objState.options.tooltipFormatter = "ngmf.fileTooltip";
	}
};

/**
 *  파일 그리드의 툴팁 Formatter 함수
 * @date 2015. 10. 23.
 * @memberOf ngmf
 * @param {Number} rowIndex :: I :: Y ::  :: 행번호
 * @param {Number} colIndex :: I :: Y ::  :: 열번호
 * @param {String} label :: I :: Y ::  :: 미사용
 * @returns {String} 툴팁TEXT
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.fileTooltip = function(rowIndex, colIndex, label, ds_file) {
	try {
		if (ngmf.isValid(ds_file))
			return ds_file.getCellData(rowIndex, "file");
		else return "";
	} catch (e) {
		ngmf._error("[ngmf.fileTooltip] Exception :: ", e);
	}
};

/**
 *  파일업로드시에 전체 파일 사이즈를 체크한다.
 * @date 2015. 10. 23.
 * @memberOf ngmf
 * @param {Object}  ds_file :: I :: N ::  :: 파일 데이터리스트 Object
 * @param {Boolean}  eFlag :: I :: Y ::  :: true 메시지코드 return,  false alert창 표시
 * @returns {Array} ["Y(업로드불가)/N(업로드가능)", Msg ID]
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.getFileUploadMaxTotalSize = function(ds_file, eFlag, _maxSize, _minSize) {
	// 변수선언
	var iSum;
	var sRtnVal = ["N"];
	var auth_id = ["XR00000460"];
	try {
		var maxSize = _maxSize || ngmf.parseInt(ngmf.getCodeName("ZNGM_P_FILUP", "MAX_SIZE", "Y"));
		var minSize = -1;
		if (typeof _minSize == "undefined") minSize = ngmf.parseInt(ngmf.getCodeName("ZNGM_P_FILUP", "MIN_SIZE", "Y"));
		else  minSize = _minSize;
		
		if (ngmf.isValid(ds_file)) {
			iSum = ngmf.sum(ngmf.object(ds_file), "size");

			// maxsize 이상인지 체크를 한다. - 업로드 불가
			if (iSum > maxSize) {
				if (eFlag) {
					sRtnVal[0] = "Y";
					sRtnVal[1] = "ZNGMC0060";
				} else {
					sRtnVal[0] = "Y";
					var strMsg = ngmf.getMessage("ZNGMC0060", "", "");
					if (strMsg && strMsg.length > 0)
						ngmf.alert(strMsg);
				}
			} else {
				if (iSum > minSize) { // minsize초과
					if (ngmf.existAuthID(auth_id) == false) {
						if (eFlag) {
							sRtnVal[0] = "Y";
							sRtnVal[1] = "ZNGMC0060";
						} else {
							sRtnVal[0] = "Y";
							var strMsg = ngmf.getMessage("ZNGMC0060", "", "");
							if (strMsg && strMsg.length > 0)
								ngmf.alert(strMsg);
						}
					} else {
						var sdate = ngmf.getDateTime("2");
						// "2" = "YYYYMMDDHHMISS"
						var stime = sdate.substr(8, 6);
						var impsbl_sta_tm = ngmf.getCodeName("ZNGM_P_FILUP", "IMPSBL_STA_TM", "Y");
						var impsbl_end_tm = ngmf.getCodeName("ZNGM_P_FILUP", "IMPSBL_END_TM", "Y");
						if (stime >= impsbl_sta_tm && stime <= impsbl_end_tm) {
							if (eFlag) {
								sRtnVal[0] = "Y";
								sRtnVal[1] = "ZNGMC0075";
								// 대용량 파일 업로드 가능 시간이 아닙니다.
							} else {
								sRtnVal[0] = "Y";
								var strMsg = ngmf.getMessage("ZNGMC0075", "", "");
								if (strMsg && strMsg.length > 0)
									ngmf.alert(strMsg);
							}
						}
					}
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getFileUploadMaxTotalSize] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 *  파일이 실행파일인지 체크한다.
 * @date 2015. 10. 23.
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::  :: 파일명
 * @returns {String} 존재 : "Y" , 없음 : "N" , 에러 : ""
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.checkExeFile = function(sValue) {
	// 변수선언
	var sRtnVal = "N";
	try {
		if (ngmf.isNull(sValue) == "Y") {
			return "";
		}
		var sLowerVal = ngmf.toLower(sValue);
		if (sLowerVal.indexOf(".exe") > 0 || sLowerVal.indexOf(".com") > 0 || sLowerVal.indexOf(".bat") > 0) {
			sRtnVal = "Y";
		}
	} catch (e) {
		ngmf._error("[ngmf.checkExeFile] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 업로드할 파일의 MIME TYPE 을 체크한다.
 * @date 2015. 10. 23.
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::  :: 파일명
 * @returns {String} 정상 : 파일 확장자, 실패 : "", 에러 : ""
 * @author 성일호
 * @example
 * @since
 * @useMobile use
 */
ngmf.chkMimeType = function(sValue) {
	// 변수선언
	var sRtnVal = "";
	// 파일의 확장자를 추려낸다.
	try {
		if (ngmf.isNull(sValue) == "Y") {
			return "";
		}
		var sMime = ngmf.split(sValue, ".");
		if (sMime.length >1)
			sRtnVal = sMime[sMime.length - 1]; 
	} catch (e) {
		ngmf._error("[ngmf.chkMimeType] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 파일path와 파일size를 결합한 파일명 생성
 * [미사용]
 * @date 2015. 11. 17.
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::  :: 파일path
 * @param {String} sSize :: I :: N ::  :: 파일SIZE
 * @returns {Object} 파일명
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.makeFileName = function(sValue, sSize) {
	// 변수선언
	var sRtnVal = "";
	try {
		if (ngmf.isNull(sValue) == "Y" || ngmf.isNull(sSize) == "Y") {
			sRtnVal = "N";
		} else {
			sRtnVal = sValue + " (" + sSize + ") ";
		}
	} catch (e) {
		ngmf._error("[ngmf.makeFileName] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 파일 path에서 파일 이름 추출.
 * @date 2015. 11. 17.
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::  :: 파일 Full Name
 * @returns {String} 파일명
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.getFileName = function(sValue) {
	// 변수선언
	var sRtnVal = sValue ;
	try {
		// 파일 path 에서 파일 이름을 뽑아낸다.
		if (ngmf.isNull(sValue) == "Y") {
			sRtnVal = "";
		} else if ( sValue.indexOf("\\") > -1) {
			var sFilename = ngmf.split(sValue, "\\", "webstyle");
			sRtnVal = sFilename[sFilename.length - 1];
		} else if ( sValue.indexOf("//") > -1) {
			var sFilename = ngmf.split(sValue, "//", "webstyle");
			sRtnVal = sFilename[sFilename.length - 1];
		}  else if ( sValue.indexOf("/") > -1) {
			var sFilename = ngmf.split(sValue, "/", "webstyle");
			sRtnVal = sFilename[sFilename.length - 1];
		}
	} catch (e) {
		ngmf._error("[ngmf.getFileName] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 업로드 파일에 대한 유효일자 조회
 * @date 2015. 11. 17.
 * @memberOf ngmf
 * @param {String} expDate :: I :: N ::  :: 입력일자
 * @returns {Array} 입력일자 3년후 일자
 * @author 성일호
 * @example
 * @since
 * @useMobile use
 */
ngmf.checkExpireDate = function(expDate) {
	// 변수선언
	var rtnVal = new Array();
	try {
		var curDate = ngmf.getDateTime("2");
		//expDate = expDate + "";
		if (ngmf.isNull(expDate) == "Y") {
			rtnVal[0] = "";
		} else {
			if (expDate == 0 || expDate == "0" || expDate == "Y00") {
				rtnVal[0] = "Y";
				rtnVal[1] = "99991231";
			} else if (expDate == 1 || expDate == "1") {
				rtnVal[0] = "Y";
				rtnVal[1] = ngmf.addDateSimple(curDate.substr(0, 8), 1095); // 3년을 더한다.
			} else {
				var addExpDay = ngmf.getCodeName("ZNGM_P_FILEXPDT", expDate, "Y");
				rtnVal[0] = "Y";
				rtnVal[1] = ngmf.addDateSimple(curDate.substr(0, 8), addExpDay);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.checkExpireDate] Exception :: ", e);
	}
	return rtnVal;
};

/**
 *  파일 리스트 조회
 * @date 2015. 11. 17.
 * @memberOf ngmf
 * @param {String} atfil_id :: I :: N ::  :: 조회 파일ID
 * @param {String / Json} ds_file :: I :: N ::  :: 결과 저장할 데이터 SET
 * @param {Number} eFlag :: I :: Y ::  :: 메시지 팝업 여부
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 업로드 결과 확인용 CALLBACK FUNCTION
 * @returns {Object} [결과(Y,N), 메시지코드]
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @example  var chkValArr = ngmf.getFileList(inpAtfilIdM.getValue(), ds_fileDown, 1);
				if (chkValArr[0] == "Y") {
					ngmf.alert("파일이 존재 합니다..");
					// 확인 후 처리 프로세서 진행

				} else {
					ngmf.alert(ngmf.getMessage(chkValArr[1]));
				}
				CASE 2:::::
				var chkValArr = ngmf.getFileList(inpAtfilIdM.getValue(), ds_file, 1);
				if (chkValArr[0] == "Y") {
					if (ds_file.getRowCount() > 0) {
						inpAtfilNm.setValue( ds_file.getCellData( chkValArr[1] , "file" ));
						file0Size.setValue( ds_file.getCellData( chkValArr[1] , "size" ));
						file0savePath.setValue( ds_file.getCellData(  chkValArr[1] , "savePathNm" ));
					}
				} else {
					ngmf.alert(ngmf.getMessage(chkValArr[1]));
				}
 * @since
 * @useMobile useless
 */
ngmf.getFileList = function(atfil_id, _ds_file, eFlag, callBackFunc) {
	// 변수선언
	var sRtnVal = new Array();
	try {
		var TrxCode = "ZNGMSFIL13210_TR01"; // Transaction Code
		var ScreenName = ngmf._getScreenName() || "ZNGMSFIL13210"; // 화면명
		var OutDataList = "GLD.GDS_OUTDUMMY"; // Output Datasets
		
		var ds_file = null;
		var _callBackFunc = ngmf._getCallBackFunction(callBackFunc);

		// 입력값 체크 
		if (ngmf.isNull(atfil_id) == "Y" || Number(atfil_id) == 0) {
			if (eFlag) {
				sRtnVal[0] = "N";
				sRtnVal[1] = "ZNGMC0062";
			} else {
				sRtnVal = "N";
				ngmf.alert( ngmf.getMessage("ZNGMC0062"));	
			}
		} else { 
			
			ngmf.clear(GLD.GDS_INDUMMY1);

			GLD.GDS_INDUMMY1.insertColumn("atfil_id" ,{name:"atfil_id" , dataType:	"text"});
			GLD.GDS_INDUMMY1.insertColumn("atfil_ser_num" ,{name:"atfil_ser_num" , dataType:	"text"});
			GLD.GDS_INDUMMY1.insertColumn("rec_cnt" ,{name:"rec_cnt" , dataType:	"text"});

			GLD.GDS_INDUMMY1.insertRow(0);
			GLD.GDS_INDUMMY1.setCellData(0, "atfil_id", atfil_id);
			GLD.GDS_INDUMMY1.setCellData(0, "atfil_ser_num", "0");
			GLD.GDS_INDUMMY1.setCellData(0, "rec_cnt", "2");
			
			GLD.GDS_OUTDUMMY.removeAll();

			// 파일 다운로드 온라인 서비스 프로그램 호출
			ngmf._fileSyncTransaction(TrxCode, ScreenName, "", GLD.GDS_INDUMMY, OutDataList , "");
			try {
				//통신성공인 경우
				if(Number(ngmv.errorCode[0]) == 0){
					sRtnVal[0] = "Y";
					var sSerRtn = GLD.GDS_OUTDUMMY.getCellData(0,"rtn") + ""; 
					
					if (GLD.GDS_OUTDUMMY.getRowCount() > 0 && sSerRtn && sSerRtn== "1") {
						var nRow = 0;
						if(_ds_file) ds_file = ngmf.object(_ds_file);
						if(ds_file) {
							ds_file.reform(); // ds_file.removeAll();
							for ( var ix = 0; ix < GLD.GDS_OUTDUMMY.getRowCount(); ix++) {
								if (GLD.GDS_OUTDUMMY .getCellData(ix, "atfil_id")) {
									nRow = ds_file.insertRow(ds_file.getRowCount());
									ds_file.setCellData(nRow, "atfilId", GLD.GDS_OUTDUMMY.getCellData(ix, "atfil_id"));
									ds_file.setCellData(nRow, "atfilSerNum", GLD.GDS_OUTDUMMY.getCellData(ix, "atfil_ser_num"));
									ds_file.setCellData(nRow, "file", GLD.GDS_OUTDUMMY.getCellData( ix, "atfil_nm"));
									ds_file.setCellData(nRow, "size", GLD.GDS_OUTDUMMY.getCellData( ix, "atfil_size"));
									ds_file.setCellData(nRow, "savePathNm", GLD.GDS_OUTDUMMY .getCellData(ix, "save_path_nm"));
									ds_file.setCellData(nRow, "trxCode", "u");	
								}
							}
						}
						if (eFlag) {
							sRtnVal[0] = "Y";
							sRtnVal[1] = nRow ;

						} else {
							sRtnVal = "Y";
						}
					} else {
						if (eFlag) {
							sRtnVal[0] = "N";
							sRtnVal[1] = "ZNGMC0063";
						} else {
							sRtnVal = "N";
							var strMsg = ngmf.getMessage("ZNGMC0063", "", "");
							if (strMsg && strMsg.length > 0) ngmf.alert(strMsg);
						}
					}
				} else {
					if (eFlag) {
						sRtnVal[0] = "N";
					} else {
						sRtnVal = "N";
					}
				}
			} catch(e) {
				if (eFlag) {
					sRtnVal[0] = "N";
					sRtnVal[1] = "ZNGMC0063";
				} else {
					sRtnVal = "N";
					var strMsg = ngmf.getMessage("ZNGMC0063", "", "");
					if (strMsg && strMsg.length > 0) ngmf.alert(strMsg);
				}
				ngmf._error("[ngmf.getFileList] fileSyncTransaction Exception :: ", e);
			}
		}
		if (_callBackFunc) _callBackFunc(sRtnVal);
	} catch (e) {
		ngmf._error("[ngmf.getFileList] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 단일 파일에 대한 파일 삭제 서비스 호출
 * @date 2015. 11. 17.
 * @memberOf ngmf
 * @param {String} aftilId :: I :: N ::  :: 대상파일ID
 * @param {Number} eFlag :: I :: Y ::  :: 메시지 팝업 여부
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 업로드 결과 확인용 CALLBACK FUNCTION
 * @returns {String / Array} [결과(Y,N), 메시지코드]
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @example var chkValArr = ngmf.deleteSingleFile(inpAtfilIdM.getValue(), 1);
				if (chkValArr[0] == "Y") {
					ngmf.alert("삭제 성공..");
					// 후 처리 프로세서 진행

				} else {
					ngmf.alert(ngmf.getMessage(chkValArr[1]));
				}
 * @since
 * @useMobile useless
 */
ngmf.deleteSingleFile = function(aftilId, eFlag, callBackFunc) {
	// 변수선언
	var sRtnVal = ["Y"];
	if (!eFlag) sRtnVal = "Y";
		ngmf.promise._deleteSingleFile (aftilId, eFlag)
		   .then( function (retObj) {
					sRtnVal = retObj;
					if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
				}) 
			.then( undefined, function (retObj) {
				sRtnVal = retObj;
				if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
			});
	return sRtnVal;
};

/**
 * 다중 파일에 대한 파일 업로드 시 Validation 체크
 * @date 2015. 11. 17.
 * @memberOf ngmf
 * @param {Object} ds_file :: I :: N ::  :: 파일 Datalist
 * @returns {Array}
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @example
 * @since
 * @useMobile useless
 */
ngmf.checkUploadMultiFile = function(ds_file) {
	var sRtn = new Array();
	var sChk, sTrxcode, sDel;
	sRtn[0] = "Y";
	try {
		if (!ngmf.isValid(ds_file)|| ds_file.getRowCount() == 0) {
			sRtn[0] = "N";
			sRtn[1] = "ZNGMC0062";
		} else {
			for ( var ix = 0; ix < ds_file.getRowCount(); ix++) {
				sTrxcode = ds_file.getCellData(ix, "trxCode");
				sChk = ngmf.toNumber(ds_file.getCellData(ix, "chk") || "0");
				sDel = ngmf.toNumber(ds_file.getCellData(ix, "del") || "0");

				//sChkCount = ds_file.FindRow("chk", "1");

				if (sChk == 1 && sDel == 1 && sTrxcode == "i") {
					sRtn[0] = "N";
					sRtn[1] = "ZNGMC0066";
					break;
					// 처음 등록한 파일은 삭제를 할 수 없다.
				} else if (sChk == 1 && sDel == 0 && sTrxcode == "u") {
					sRtn[0] = "N";
					sRtn[1] = "ZNGMC0067";
					break;
					// 이미 등록한 파일은 다시 등록할 수 없다.
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.checkUploadMultiFile] Exception :: ", e);
	}
	return sRtn;
};

/**
 * 단일 파일 다운로드(사용중지)
 * @date 2016.02.29
 * @memberOf ngmf
 * @param {String} atfilId :: I :: N ::  :: 파일 대상파일ID
 * @param {String} localUrl :: I :: N ::  :: 파일 저장할 파일명
 * @param {Boolean} eFlag :: I :: Y ::  :: 0 : 메시지 popup
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 결과 처리용 CAllBACK 함수
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @returns
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @example var chkValArr = ngmf.__downloadSingleFile( inpAtfilId.getValue(), inpAtfilSerNum.getValue(), 1,  function(retArr) {
					if (retArr[0] == "Y") {
						ngmf.alert("DOWNLOAD 성공");
						// 다운로드 완료 후 처리 프로세서 진행

					} else {
						ngmf.alert("DOWNLOAD 실패 :::::" + retArr[1]);
					}
				});
				if (chkValArr[0] != "SUCC") {
					ngmf.alert(ngmf.getMessage(chkValArr[1]));
				}
 * @useMobile useless
 */
ngmf.__downloadSingleFile = function(atfilId, localUrl, eFlag, callBackFunc, progressFunc) {
	// 변수선언
	ngmf.promise.downloadSingleFile (atfilId, localUrl, eFlag, progressFunc)
   .then( function (retObj) {
		if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
	}) 
	.then( undefined, function (retObj) {
		if (retObj["message"]) {
			if (eFlag){
				if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(["N", retObj["message"]]);
			} else if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)("N"); 
		} else if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
	});
};


/*
 * 다중 파일 다운로드(사용중지))
 * @date 2016.02.29
 * @memberOf ngmf
 * @param {String / Json} ds_file :: I :: N ::  :: 파일 Datalist
 * @param {Boolean} eFlag :: I :: Y ::  :: 0 : 메시지 popup
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 결과 처리용 CAllBACK 함수
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @returns
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @update 2016.02.02  예제 추가 및 일부 오류 수정
 * @example
 * 			try {
				var chkValArr = ngmf.__downloadMultiFile( ds_fileDown, 1,  function(retArr) {
					if (retArr[0] == "Y") {
						ngmf.alert("DOWNLOAD 성공");
						// 다운로드 완료 후 처리 프로세서 진행

					} else {
						ngmf.alert("DOWNLOAD 실패 :::::" + retArr[1]);
					}
				});
				if (chkValArr[0] != "Y") {
					ngmf.alert(ngmf.getMessage(chkValArr[1]));
				}
			} catch (e) {
				ngmf._error("scwin.btnDownFileM_onclick ERROR:::::", e);
			}
 * @useMobile useless
 */
ngmf.__downloadMultiFile = function(ds_file, eFlag, callBackFunc, progressFunc) {
	ngmf.promise.downloadMultiFile(ds_file, eFlag, progressFunc)
	.then( function (retObj) {
			if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
	}) 
	.then( undefined, function (retObj) {
		if (retObj["message"]) {
			if (eFlag){
				if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(["N", retObj["message"]]);
			} else if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)("N"); 
		} else if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
	});
}; 

/**
 * 다중 파일 다운로드(Batch 파일, 미사용)
 * @date 2016.02.29
 * @memberOf ngmf
 * @param {String / Json} ds_file :: I :: N ::  :: 파일 Datalist
 * @param {String} l_FilePath :: I :: N ::  :: 파일경로(미사용)
 * @param {String} l_FileName :: I :: N ::  :: 파일이름 
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 결과 처리용 CAllBACK 함수
 * @returns {Array} ["Y/N","메세지"]
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */
ngmf.__batDownloadMultiFile = function(ds_file, l_FilePath, l_FileName, callBackFunc) {
	// 변수선언
	ngmf.promise.batDownloadMultiFile(ds_file, l_FilePath, l_FileName)
	.then( function (retObj) {
			if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
	}) 
	.then( undefined, function (retObj) {
		if (retObj["message"]) {
			if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(["N", retObj["message"]]); 
		} else if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
	});
};

/**
 * SINGLE 파일 파일 업로드
 * @date 2016.02.29
 * @memberOf ngmf
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판, 1 : 암호화 게시판
 * @param {String / Json} uploadCompId :: I :: N :: "file0" :: 파일 컴포넌트 ID 또는 객체
 * @param {String} expDate :: I :: N ::  :: 유효일자 '0' : 영구, '1' : 3년
 * @param {Boolean} eFlag :: I :: Y ::  :: 1 : 메시지 팝업(X)
 * @param {String} screenNM :: I :: Y ::  :: 화면명 (input 으로 사용)
 * @param {String} atfilTitleNm :: I :: Y ::  :: Title (input 으로 사용)
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 결과 처리용 CAllBACK 함수
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @param {Boolean} chkAcl :: I :: Y ::  :: 암호화 해제여부
 * @param {String} remoteUrl :: I :: Y ::  :: 파일업로드 서블릿 호출 url(현재 접속 url 정보)-모바일인 경우만 사용
 * @returns
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless
 * @update 2012.02.02  프로그래스 함수 추가
 * @update 2012.02.25  Promise 호출로 변경
 * @example 
         // 필수 : 초기화  scwin.form_onLoadCompleted 내에 아래함수 반드시 실행
         // ngmf.setSingleFileComp("file0", btnFile0, tmpName) :  "file0" = file upload 컴포넌트 ID,  btnFile0 = 업로드 버튼 객체,  tmpName = 업로드전 선택된 파일명 보여줄 INPUT BOX    					 
		ngmf.promise.encUploadSingleFile(enc, file0, "1", 1, ngmf._getScreenName(), null, chk_Acl.getValue())
		.then( function (retObj) {
			if (retObj[0] == "Y") {
				// TODO. 저장 후 처리 프로세서 진행							
				if (retObj["result"][1]) {
					inpAtfilId.setValue(retArr[1]);
					scwin.btnSearchFile0_onclick();							
				}
				ngmf.alert("UPLOAD 성공");
			} else {
				ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
			}
		}) 
		.then( undefined, function (retObj) {
			if (retObj["message"]) {
				ngmf.alert("UPLOAD 실패 :::::" + retObj["message"] );
			} else ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
		});
 */
ngmf.__encUploadSingleFile = function(enc, uploadCompId, expDate, eFlag, screenNM, atfilTitleNm, callBackFunc, progressFunc, chkAcl, remoteUrl) {
	ngmf.promise.encUploadSingleFile(enc, uploadCompId, expDate, eFlag, screenNM, atfilTitleNm, progressFunc, chkAcl, remoteUrl)
   .then( function (retObj) {
			if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
	}) 
	.then( undefined, function (retObj) {
		if (retObj["message"]) {
			if (eFlag){
				if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(["N", retObj["message"]]);
			} else if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)("N"); 
		} else if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
	});		
}; 

//내부함수 일치하는 파일명 인덱스 리턴
ngmf._getTargetFileIndex = function(fileList, fileName) {
	try {
		if (!fileList)
			return -1;
		for ( var i = 0; i < fileList.length; i++)
			if (fileList[i].name == fileName)
				return i;
	} catch (e) {
		ngmf._error("[ngmf.getTargetFile] Exception :: ", e); 
	}
	return -1;
};


//내부함수 file 객체 초기화
ngmf._clearFileObjInfo = function(fileObj) {
	try { 
		if (fileObj  && typeof fileObj == "object" && fileObj.type == "file") {
			fileObj.value = "";
			if (WebSquare.util.isIE() ) {
					fileObj.type="radio";
					fileObj.type="file";
			} else {
				$("#"+fileObj.id).val('');
			}
		}
	} catch (ex) {
		ngmf._error("[ngmf._clearFileObjInfo] Exception :: ", ex);
	}
};

/**
 *그리드 파일 업로드 컴포넌트 초기화
 * @date 2016. 04. 04.
 * @memberOf  ngmf
 * @param {String / Json} gridObj :: I :: N ::  :: 대상 그리드 객체 또는 ID
 * @returns {Boolean}
 * @author 성일호
 * @useMobile useless
 * @example ngmf.clearUploadSingleFile("file0");
 * @since
 */
ngmf.clearUploadGridFile = function(gridObj) {
	try {
		if(ngmf.isMobile()){
			ngmf.alert("ngmf.clearUploadGridFile : 모바일환경에서 지원불가 API 입니다.");
			return;
		}
		
		var uploadCompId = "";
		if (typeof gridObj != "undefined" ){
			if ( typeof gridObj == "object")
				uploadCompId = gridObj.getID();
			else uploadCompId = gridObj;
			ngmf._clearFileObjInfo (document.getElementById("gvf_" + uploadCompId + "_fakeinput"));
		}
	} catch (ex) {
		ngmf._error("[ngmf.clearUploadGridFile] Exception :: ", ex);
	}
};

/**
 * 단일 파일 업로드 컴포넌트 초기화
 * @date 2016. 03. 15.
 * @memberOf  ngmf
 * @param {String / Json} uploadComp :: I :: N ::  :: 파일UPLOAD 객체 또는 ID
 * @returns {Boolean}
 * @author 성일호
 * @useMobile useless
 * @example ngmf.clearUploadSingleFile("file0");
 * @since
 */
ngmf.clearUploadSingleFile = function(uploadComp) {
	return ngmf._clearUploadSingleFile(uploadComp) ;
};
/**
 * 멀티 파일 업로드 컴포넌트 초기화
 * @date 2016. 03. 15.
 * @memberOf  ngmf
 * @param {String / Json} uploadComp :: I :: N ::  :: 파일UPLOAD 객체 또는 ID
 * @param {String / Json} ds_file :: I :: N ::  :: 파일 DataList 객체 또는 ID
 * @returns {Boolean}
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless
 * @example ngmf.clearUploadMultiFile("fileM", "ds_file");
 * @since
 */
ngmf.clearUploadMultiFile = function(uploadComp, ds_file) {
	return ngmf._clearUploadMultiFile(uploadComp, ds_file) ;
};

/**
 * 단일 파일 업로드 초기화(내부함수)
 * @date 2016. 03. 15.
 * @memberOf  ngmf
 * @param {String / Json} uploadComp :: I :: N ::  :: 파일UPLOAD 객체 또는 ID
 * @returns {Boolean}
 * @author 성일호
 * @useMobile useless
 * @example ngmf._clearUploadSingleFile("file0");
 * @since
 */
ngmf._clearUploadSingleFile = function(uploadComp) {
	//파일 upload Component 초기화
	try{
		if(ngmf.isMobile()){
			ngmf.alert("ngmf.clearUploadGridFile : 모바일환경에서 지원불가 API 입니다.");
			return;
		}
		var uploadCompId = "";
		if (typeof uploadCompId != "undefined" ){
			if ( typeof uploadComp == "object")
				uploadCompId = uploadComp.getID();
			else uploadCompId = uploadComp;
			ngmf._clearFileObjInfo (document.getElementById(uploadCompId + "_fakeinput"));
		}
	} catch (ex) {
		ngmf._error("[ngmf._clearUploadSingleFile] Exception :: ", ex);
		return false;
	}
	return true;
};

/**
 * 멀티 파일 업로드 초기화(내부함수)
 * @date 2016. 03. 15.
 * @memberOf  ngmf
 * @param {String / Json} uploadComp :: I :: N ::  :: 파일UPLOAD 객체 또는 ID
 * @param {String / Json} ds_file :: I :: N ::  :: 파일 DataList 객체 또는 ID
 * @returns {Boolean}
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless
 * @example ngmf._clearUploadMultiFile("fileM", "ds_file");
 * @since
 */
ngmf._clearUploadMultiFile = function(uploadComp, ds_file) {
//WebSquare.util.isIE() && WebSquare.util.browserVersion()
	try {
		if(ngmf.isMobile()){
			ngmf.alert("ngmf.clearUploadGridFile : 모바일환경에서 지원불가 API 입니다.");
			return;
		}
		if (typeof uploadComp != "undefined" ){
			var uploadCompId = "";
			if ( typeof uploadComp == "object")
				uploadCompId = uploadComp.getID();
			else uploadCompId = uploadComp;

			var fileListId = uploadCompId + "_files";

			//CALLBACK 처리 관련 변수 초기화
			if (typeof scvar != "undefined"){
				scvar["multiUploadErrIndexArr"] = new Array();
				scvar["multiUploadCnt"] = -1;
				scvar["mimeTypeMap"] = {};
				if (typeof scvar[fileListId] != "undefined") {
					if (scvar[fileListId] && scvar[fileListId].length > 0) {
						for(var i = 0; i < scvar[fileListId].length; i++){
							delete scvar[fileListId].splice(i,1);
						}
					}
					delete scvar[fileListId];
				}	
			}
			//파일 upload Component 초기화
			ngmf._clearFileObjInfo (document.getElementById(uploadCompId + "_fakeinput"));

			// DATASET 초기화
			if (ds_file && ngmf.object(ds_file)) {
				ngmf.object(ds_file).removeAll();
			}
		}
	} catch (ex) {
		ngmf._error("[ngmf._clearUploadMultiFile] Exception :: ", ex);
		return false;
	}
	return true;
};

/**
 * 멀티 업로드 결과 취합 로직
 * @date 2016. 2. 2.
 * @memberOf ngmf
 * @param {Number} runCnt :: I :: N ::  :: 처리횟수
 * @param {Number} realCnt :: I :: N ::  :: 전체갯수
 * @param {Object} ds_file :: I :: N ::  :: 파일리스트 DATASET
 * @param {Array} fileList :: I :: N ::  :: 파일리스트 객체
 * @param {Object} paramMap :: I :: N ::  :: 매개변수객체
 * @returns
 * @author 성일호
 * @useMobile useless
 * @update 2016.02.02 체크로직 오류 수정
 * @example
 * @since
 */
ngmf.checkResultUploadMultiFile = function(runCnt, realCnt, ds_file, fileList, paramMap) {
	var multiCheckTimer = null;
	var minCount = realCnt - runCnt;
	try {
		function checkUploadMulti() {
			try {
				var checkCount = scvar.multiUploadCnt || -1;
				if (checkCount == minCount) {
					//한번더 돌림
					scvar.multiUploadCnt --;
				} else if (checkCount < minCount) {
					//메세지 중지
					WebSquare.layer.hideProcessMessage();

					window.clearInterval(multiCheckTimer);
					var sRtnVal = new Array();
					var callBackFunc = ngmf._getCallBackFunction(paramMap["callBackFunc"]);
					var errIndexArr = scvar.multiUploadErrIndexArr;
					var errCode = 0;
					if(minCount > 0) {
						//전송 준비단계 오류건일경우
						sRtnVal[0] = "N";

					} else if (errIndexArr.length > 0) {
						//전송 콜백에서 확인된 에러일경우
						sRtnVal[0] = "N";
						sRtnVal[1] = JSON.parse(JSON.stringify(errIndexArr.length));
					} else {
						// 결과 전송 처리 로직 삽입
						var TrxCode = "ZNGMSFIL13110_TR01";
						var ScreenName = ngmf._getScreenName() || "ZNGMSFIL13110";
						var OutDataList = "GLD.GDS_OUTDUMMY";  //
						var chkIdx = ds_file.getMatchedIndex("chk", "1");
						if (chkIdx || chkIdx.length > 0) {
							ngmf.clear(GLD.GDS_INDUMMY1);
							GLD.GDS_INDUMMY1.insertColumn("atfil_id", { name:	"atfil_id" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("atfil_title_nm", { name:	"atfil_title_nm" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("screen_nm", { name:	"screen_nm" , dataType:	"text" });

							GLD.GDS_INDUMMY1.insertRow();
							GLD.GDS_INDUMMY1.setCellData(0, "atfil_id", ds_file.getCellData(chkIdx[0], "atfilId"));
							GLD.GDS_INDUMMY1.setCellData(0, "atfil_ser_num", "");
							GLD.GDS_INDUMMY1.setCellData(0, "atfil_title_nm", "");
							GLD.GDS_INDUMMY1.setCellData(0, "trx_cd", ds_file.getCellData(chkIdx[0], "trxCode"));
							GLD.GDS_INDUMMY1.setCellData(0, "screen_nm", paramMap["screenNM"]||ngmf._getScreenName());

							ngmf.clear(GLD.GDS_INDUMMY2);
							GLD.GDS_INDUMMY2.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("expir_dt", { name:	"expir_dt" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("atfil_nm", { name:	"atfil_nm" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("save_path_nm", { name:	"save_path_nm" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("atfil_size", { name:	"atfil_size" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("mime_type_info", { name:	"mime_type_info" , dataType:	"text" });

							var insertArr = [];
							for (var ix = 0; ix < chkIdx.length; ix++) {
								if (ds_file.getCellData(chkIdx[ix], "savePathNm")) {
									if (ds_file.getCellData(chkIdx[ix], "trxCode") == "u" && ngmf.toNumber(ds_file.getCellData(chkIdx[ix], "del") || "0")  == 1 )
										insertArr.push("d");
									else insertArr.push(ds_file.getCellData(chkIdx[ix], "trxCode"));

									insertArr.push(ds_file.getCellData(chkIdx[ix], "atfilSerNum"));
									insertArr.push(paramMap["chkExpDate"]);
									insertArr.push(ds_file.getCellData(chkIdx[ix], "file"));
									insertArr.push(ds_file.getCellData(chkIdx[ix], "savePathNm"));
									insertArr.push(ds_file.getCellData(chkIdx[ix], "size"));
									insertArr.push(scvar.mimeTypeMap[chkIdx[ix]]);
								}
							} //END for
							GLD.GDS_INDUMMY2.insertData(insertArr);

							ngmf.clear(GLD.GDS_OUTDUMMY);

							// 파일 업로드 온라인 서비스 프로그램을 호출
							ngmf._fileSyncTransaction(TrxCode, ScreenName, "", [GLD.GDS_INDUMMY1,GLD.GDS_INDUMMY2], OutDataList, "");
							// 파일 업로드 온라인 서비스 에러 체크
							if (errCode > 0 ) sRtnVal[1] = scvar.multiUploadErrIndexArr;
							if(Number(ngmv.errorCode[0]) == 0){
								sRtnVal[0] = "Y";
								sRtnVal[1] = GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id");
							} else {
								sRtnVal[0] = "";
							}

						}
					}

					//정상 완료시...
					if (typeof callBackFunc != "undefined") {
						callBackFunc(sRtnVal,-1);
					} else {
						ngmf._clearUploadMultiFile (paramMap["uploadCompId"]);
					} 
					ngmf._debug("UploadMultiFile End!!!!");
				}
			} catch (e){
				WebSquare.layer.hideProcessMessage();
				//오류 발생시 종료함
				window.clearInterval(multiCheckTimer);
				ngmf._error("[ngmf.checkResultUploadMultiFile] Exception :: ", e);
			}
		}
		multiCheckTimer = window.setInterval(checkUploadMulti, 1000);
	} catch (e) {
		WebSquare.layer.hideProcessMessage();
		if (multiCheckTimer) window.clearInterval(multiCheckTimer);
		ngmf._error("[ngmf.checkResultUploadMultiFile] Exception :: ", e);
	}
};

/**
 * 암호화된 다중 파일 파일 업로드
 * @date 2015. 11. 17.
 * @memberOf ngmf
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판, 1 : 암호화 게시판
 * @param {String / Json} fileListId :: I :: N ::  :: upload 파일 컴포넌트 또는 file 배열 ID
 * @param {String / Json} ds_file :: I :: N ::  :: 업로드 대상 Data Set
 * @param {String} expDate :: I :: N ::  :: 유효일자 '0' : 영구, '1' : 3년
 * @param {String} eFlag :: I :: Y ::  :: 1 : 메시지 팝업(X)
 * @param {String} screenNM :: I :: Y ::  :: 화면명 (input 으로 사용)
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 결과 처리용 CAllBACK 함수
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @param {Boolean} chkAcl :: I :: Y ::  :: 암호화 해제여부
 * @returns
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless
 * @update 2016.02.02  filelist 찾는 로직 오류수정
 * @example 
   			// 필수 : 초기화  scwin.form_onLoadCompleted 내에 아래함수 반드시 실행
			// ngmf.setMultiFileComp("fileM", ds_file, btnSearchMFile,1,"",true); :  "fileM" = file upload 컴포넌트 ID,  ds_file = 업로드 대상파일 관리 DATASET, btnSearchMFile = 업로드 버튼 객체
			
				ngmf.__encUploadMultiFile(0, fileM, ds_file, "1", 1, "" , function(retArr) {
					if (retArr[0] == "Y") {
						ngmf.alert("UPLOAD 성공");
						// 저장 후 처리 프로세서 진행

					} else {
						ngmf.alert("UPLOAD 실패 :::::" + retArr[1]);
					}
				});
 */
ngmf.__encUploadMultiFile = function(enc, _fileListId, ds_file, expDate, eFlag, screenNM, callBackFunc, progressFunc,chkAcl) {
	// 변수선언
	var sRtnVal = ["Y"];
	if (!eFlag) sRtnVal = "Y";
		ngmf.promise.encUploadMultiFile (enc, _fileListId, ds_file, expDate, eFlag, screenNM, progressFunc,chkAcl)
		   	.then( function (retObj) {
				if (retObj["result"])  {
					sRtnVal = retObj["result"];
					if (!eFlag) sRtnVal = retObj["result"][0];
				} else sRtnVal = retObj;
				if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(sRtnVal);
				 
			}) 
			.then( undefined, function (retObj) {
				if (retObj["result"])  {
					sRtnVal = retObj["result"];
					if (!eFlag) sRtnVal = retObj["result"][0];
				} else sRtnVal = retObj;
				if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(sRtnVal);
			}); 
};

/**
 * URL 에서 파일이름 추출
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {Object} url :: I :: N ::  :: 소스 URL
 * @returns {String}  파일이름
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */
ngmf.getFileNameToUrl = function(url) {
	if (!url || url == '')
		return "";
	return ((url.indexOf("/") < 0) ? "" : url.substring(url.lastIndexOf("/") + 1, url.length));
};

/**
 * 다운로드 받은 파일에 대해서 미리보기를 한다
 * 구현불가
* @date 2016. 1. 21.
* @memberOf ngmf
* @param {String} atfilId :: I :: N ::  :: 다운받을 파일 경로 http://
* @param {String} filename :: I :: Y ::  :: 저장할 파일 이름(디렉토리는 지원하지 않음)
* @param {Boolean} eFlag :: I :: Y ::  :: 에러코드여부
* @returns {Object}
* @author 성일호
* @example
* @since
 */
ngmf.previewFile = function(atfilId, filename, eFlag) {
	// 변수선언
	var sRtnVa  ;
	try { 
	} catch (e) {
		ngmf._error("[ngmf.previewFile ] Exception :: ", e);
	}
	return sRtnVal;
};


/**
 * (유동개수) 다운로드 받은 파일에 대해서 미리보기를 한다.
 * 구현불가
* @date 2016. 1. 21.
* @memberOf ngmf
* @param {Object} ds_file :: I :: N ::  :: 파일 Datase
* @param {Number} nRow  :: I :: Y ::  :: 대상 행번호
* @param {Boolean} eFlag  :: I :: Y ::  :: 에러코드여부
* @returns {Object}
* @author 성일호
* @example
* @since
 */
ngmf.previewMultiFile = function( ds_file, nRow, eFlag) {
	// 변수선언
	var sRtnVal  ;
	if (eFlag) {
		sRtnVal = new Array();
		sRtnVal[0] = "Y";
		sRtnVal[1] = "완료되었습니다.";
	} else {
		sRtnVal[0] = "Y";
	}
	try {
//		var localUrl = "C:\\WINDOWS\\Temp\\";
//		var filename = ds_file.getCellData(nRow, "file");
//		var filesize = ds_file.getCellData(nRow, "size");
//		var filepath = ds_file.getCellData(nRow, "savePathNm");
//
//		// 파일 ID 입력값 체크.
//		if (ngmf.isValid(ds_file) || ds_file.getRowCount() == 0 || ngmf.isNull(nRow) == "Y" || ngmf.isNull(filepath) == "Y") {
//			if (eFlag) {
//				sRtnVal		= new Array();
//				sRtnVal[0] 	= "N";
//				sRtnVal[1] 	= "ZNGMC0072";
//			} else {
//				sRtnVal = "N" ;
//				var strMsg = ngmf.getMessage("ZNGMC0072", "", "");
//				if (strMsg && strMsg.length > 0 ) ngmf.alert (strMsg);
//			}
//		} else {
//			localUrl = localUrl + filename;
//			//  파일 다운로드 서비스 호출
//			var rtnVal = ngmf.newFileRead (localUrl, filepath, filesize);
//			//  파일 서비스 에러 체크
//			if (rtnVal[0] == "FAIL") {
//				if (eFlag) {
//					sRtnVal = new Array();
//					sRtnVal[0] = "N";
//					sRtnVal[1] = rtnVal[1];
//				} else {
//					sRtnVal = "N";
//					var strMsg = rtnVal[1];
//					if (strMsg && strMsg.length > 0)
//						ngmf.alert(strMsg);
//				}
//			} else if (rtnVal[0] == "SUCC") {
//				// ExecShell(localUrl);
//				// 2005-11-23 추가로직 (에러메세지 출력)
//				if (eFlag) {
//					sRtnVal = new Array();
//					sRtnVal[0] = "Y";
//					sRtnVal[1] = "완료되었습니다.";
//				} else {
//					sRtnVal[0] = "Y";
//				}
//				// 20060523 파일 미리보기 종료된 후, 파일 삭제를 위한 타이머 처리
//				// global.MainTitle.File0.FileName = localUrl;
//				// ngmf.deleteLocalFile();
//			}
//		}
	} catch (e) {
		ngmf._error("[ngmf.previewMultiFile ] Exception :: ", e);
	}
	return sRtnVal;
};


//내부함수(file accept )
ngmf._getTypeConvert = function(type) {
	if (!type)
		return "";
	try {
		type = ngmf.replace(type, ".", "");
		switch (type) {
		case "xls":
			return "application/vnd.ms-excel";
			break;
		case "xlsx":
			return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
			break;
		case "txt":
			return "text/plain";
			break;
		case "png":
		case "jpg":
		case "gif":
		case "bmp":
			return "image/*";
			break;
		case "html":
		case "htm":
			return "text/html";
			break;
		case "avi":
		case "mpg":
		case "mpeg":
		case "mp4":
			return "video/*";
		case "mp3":
		case "wav":
			return "sudio/*";
			break;
		case "xml":
			return "text/xml";
			break;
		case "*":
			return "*.*";
			break;
		default:
			return "." + type;
			break;
		}
	} catch (e) {
		ngmf._error("[ngmf._getTypeConvert ] Exception :: ", e);
	}
};

//내부함수 Type 다중 설정시
ngmf._getAcceptTypeSet = function(type) {
	if (!type)
		return "";
	try {
		var types = type.split(",");
		var typeArr = [];
		for ( var i = 0; i < types.length; i++) {
			typeArr.push(ngmf._getTypeConvert(ngmf.trim(types[i])));
		}
		if (typeArr.length > 0) {
			typeArr = ngmf._getUniqueArray(typeArr);
			return typeArr.join(",");
		}
	} catch (e) {
		ngmf._error("[ngmf._getAcceptTypeSet ] Exception :: ", e);
	}
};
//내부함수 배열 유니크 처리..
ngmf._getUniqueArray = function(arr) {
	try {
		if (arr) {
			if (typeof arr.reduce == "function") {
				return arr.reduce(function(p, c) {
					if (p.indexOf(c) < 0)
						p.push(c);
					return p;
				}, []);
			} else {
				var retarr = [];
				for ( var i = 0; i < arr.length; i++) {
					if (!ngmf._isin(arr[i], retarr)) {
						retarr.push(arr[i]);
					}
				}
				return retarr;
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._getUniqueArray ] Exception :: ", e);
	}
};
//
ngmf._isin = function(n, a) {
	for ( var i = 0; i < a.length; i++) {
		if (a[i] == n) {
			var b = true;
			return b;
		} else {
			var c = false;
			return c;
		}
	}
};

/**
 * 업로드할 파일을 선택 후 업로드 가능 파일인지 확인 한다.
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {Boolean} eFlag :: I :: Y ::  :: 에러코드여부
 * @param {String} _fileType :: I :: Y ::  :: 저장할 파일 형식
 * @param {String / Json} uploadCompId :: I :: N :: "file0" :: 업로드 컴퍼넌트 ID
 * @returns {Object} 결과 정상 : 파일주소 리턴함 실패 : "N" 에러 : ""
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless
 * @example 
			// 필수 : 초기화  scwin.form_onLoadCompleted 내에 아래함수 반드시 실행
			// ngmf.setSingleFileComp("file0", btnFile0, tmpName) :  "file0" = file upload 컴포넌트 ID,  btnFile0 = 업로드 버튼 객체,  tmpName = 업로드전 선택된 파일명 보여줄 INPUT BOX 
             var chkValArr = ngmf.openSingleFileRead(1, null, file0);
				if (chkValArr[0] == "Y") {
					ngmf.__encUploadSingleFile("0", file0, "1", 1, "" , "", function(retArr) {
						if (retArr[0] == "Y") {
							ngmf.alert("UPLOAD 성공");
							// 저장 후 처리 프로세서 진행

						} else {
							ngmf.alert("UPLOAD 실패 :::::" + retArr[1]);
						}
					});
				} else {
					ngmf.alert(ngmf.getMessage(chkValArr[1]));
				}
 * @since
 */
ngmf.openSingleFileRead = function( eFlag, _fileType, _uploadComp) {
	// 변수선언
	var sRtnVal = "N";
	try { 
		var fileObj = _uploadComp;
		
		if (typeof _uploadComp != "object" ) fileObj = ngmf.object(_uploadComp);

		if (!fileObj ) {
			if (eFlag) {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = "ZNGMC0065";
			} else {
				ngmf.alert(ngmf.getMessage("ZNGMC0065"));
			}
			return sRtnVal;
		}
		var filepath = "", fileElem = null;
			
		if (typeof fileObj.getPluginName == "function" && fileObj.getPluginName() == "upload") {
			// 파일로컬주소를 가져옴
			filepath = fileObj.getValue(); 
			fileObj = document.getElementById(fileObj.getID()+"_fakeinput");
			if (fileObj.files.length > 0)
				fileElem = fileObj.files[0];
			if (_fileType && _fileType.length > 0 ) {
				fileObj.accept =  ngmf._getAcceptTypeSet(_fileType);
			}
			if (fileObj.multiple)  fileObj.multiple = false; 
			
		} else {
			fileElem = fileObj;
		}
		
		var auth_id = ["XR00000460"]; 

		if (!fileObj || ! fileElem){
			if (eFlag) {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = "ZNGMC0065";
			} else {
				ngmf.alert(ngmf.getMessage("ZNGMC0065"));
			}
			return sRtnVal;
		}
		var chkSize, chkFile, filename;

		// 파일이름을 가져옴
		filename =  fileElem.name;
		// 파일확장자 체크
		chkFile = ngmf.checkExeFile(filename);
		// 파일사이즈 체크
		chkSize = fileElem.size ;

		var maxSize = ngmf.toInteger(ngmf.getCodeName("ZNGM_P_FILUP", "MAX_SIZE", "Y"));
		var minSize = ngmf.toInteger(ngmf.getCodeName("ZNGM_P_FILUP", "MIN_SIZE", "Y"));


		if (chkFile == "Y" || chkSize > maxSize) {
			// maxsize 이상인지 체크를 한다. - 업로드 불가
			if (eFlag) {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = "ZNGMC0057";
			} else {
				sRtnVal = "N";
				var strMsg = ngmf.getMessage("ZNGMC0057", "", "");
				if (strMsg && strMsg.length > 0)
					ngmf.alert(strMsg);
			}
		} else if (chkSize > minSize && chkSize <= maxSize) {
			//20M 초과 200M 이하 권한 체크
			//업로드 권한이 있는지 확인
			var authYN = ngmf.existAuthID(auth_id);
			if (authYN == false) {
				if (eFlag) {
					sRtnVal = new Array();
					sRtnVal[0] = "N";
					sRtnVal[1] = "ZNGMC0057";
				} else {
					sRtnVal = "N";
					ngmf.alert(ngmf.getMessage("ZNGMC0057", "", "") || "실행파일이거나 업로드 용량을 초과했습니다.");
				}
			} else {
				//  "2" = "YYYYMMDDHHMISS"
				var sdate = ngmf.getDateTime("2");
				var stime = substr(sdate, 8, 6);
				var impsbl_sta_tm = ngmf.getCodeName("ZNGM_P_FILUP", "IMPSBL_STA_TM", "Y");
				var impsbl_end_tm = ngmf.getCodeName("ZNGM_P_FILUP", "IMPSBL_END_TM", "Y");

				if (stime >= impsbl_sta_tm && stime <= impsbl_end_tm) {
					if (eFlag) {
						sRtnVal = new Array();
						sRtnVal[0] = "N";
						sRtnVal[1] = "ZNGMC0075";
						//대용량 파일 업로드 가능 시간이 아닙니다.
					} else {
						sRtnVal = "N";
						ngmf.alert(ngmf.getMessage("ZNGMC0075", "", "") || "대용량 파일 업로드 가능 시간이 아닙니다.");
					}
				} else {
					if (eFlag) {
						sRtnVal = new Array();
						sRtnVal[0] = "Y";
						sRtnVal[1] = filepath;
					} else {
						sRtnVal = filepath;
					}
				}
			}
		} else {
			if (eFlag) {
				sRtnVal = new Array();
				sRtnVal[0] = "Y";
				sRtnVal[1] = filepath;
			} else {
				sRtnVal = filepath;
			}
		}

	} catch (e) {
		ngmf._error("[ngmf.openSingleFileRead ] Exception :: ", e);
	}
	return sRtnVal;
};

// ngmf._addMultiFileSet (event.files, fileList , ds_file );
ngmf._addMultiFileSet = function(files, fileList, ds_file) {
	try {
		if(!fileList || !ds_file) return;
		if (files && files.length > 0) {
			var rowIdx = -1, mtcIdxArr;
			for ( var i = 0; i < files.length; i++) {
				mtcIdxArr = ds_file.getMatchedIndex("file", files[i].name);
				if (mtcIdxArr.length == 0) {
					rowIdx = ds_file.insertRow();
					ds_file.setCellData(rowIdx, "chk", "1");
					ds_file.setCellData(rowIdx, "file", files[i].name);
					ds_file.setCellData(rowIdx, "size", files[i].size);
					ds_file.setCellData(rowIdx, "del", "0");
					ds_file.setCellData(rowIdx, "trxCode", "i");
					fileList.push(files[i]);
				} 
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._addMultiFileSet] Exception :: ", e);
	}
};

//내부함수...
ngmf._addEventElem = function (element, eventName, eventFn, isCapture) {
	try {
		if (typeof window.addEventListener == "function"){
			try  { 
				element.removeEventListener(eventName);
			} catch (e) {
				try  { 
				element.removeEventListener(eventName, eventFn);
				} catch (e) { }
			}
			element.addEventListener(eventName, eventFn, isCapture );
		} else if (typeof window.attachEvent  == "function"){
			element.attachEvent("on" + eventName, eventFn);
		} else {
			element["on" + eventName] = eventFn;
		}
	} catch (e) {
		ngmf._error("[ngmf._addEventElem] Exception :: ", e);
	}
};


// 내부함수 :: 이벤트 존재여부 확인
ngmf._checkEventName = function (compObj, _eventName) {
	try {
		if (!compObj) return false;
	    for (var i = compObj.userEventList.length - 1; i >= 0; i--) {
	        if (_eventName === compObj.userEventList[i].name) {
	            return true;
	        }
	    }
	    if (typeof compObj.systemEventList[_eventName] === "object") {
	         return true;
	    }
	} catch (e) {
		ngmf._error("[ngmf._checkEventName ] Exception :: ", e);
	}
    return false;
};

ngmf._createUploadComp = function (compId) {
	try {
		if(ngmf.isMobile()){
			//ngmf.alert("ngmf._createUploadComp : 모바일환경에서 지원불가 API 입니다.");
			return;
		}
		
		if ( typeof ngmf.object(compId) == "undefined")  {
			ngmf.create(compId,"upload",{style : "display:none;"});
			return true;
		} else return false;

	} catch (e) {
		ngmf._error("[ngmf._createUploadComp ] Exception :: ", e);
	}
	return false;
};

/**
 *  단일 업로드 컴퍼넌트 초기화
 * @date 2016. 1. 27.
 * @memberOf ngmf
 * @param {String / Json} uploadComp :: I :: N ::  :: 업로드 컴퍼넌트
 * @param {String / Json} buttonComp :: I :: Y ::  :: 업로드 버튼 컴퍼넌트
 * @param {String / Json} viewInputComp :: I :: Y ::  :: 업로드 버튼 컴퍼넌트
 * @param {Boolean} eFlag :: I :: Y ::  :: 에러메세지 호출 여부
 * @param {String} fileType  :: I :: Y ::  :: 제어할 파일 형식 콤마(,)로 멑티적용 가능
 * @param {String/Json} chaneAfterEvent :: I :: Y :: 0 :: 파일 선택 후 이벤트 호출 chaneAfterEvent(file객체)
 * @returns {Object} 결과
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless 
 * @example ngmf.setSingleFileComp(file0, btnSingle ,inputFileName, 0, "xlsx,docx,zip");
 * @since
 */
ngmf.setSingleFileComp = function(_uploadComp, _buttonComp, _viewInputComp, eFlag, _fileType, _chaneAfterEvent) {
	if(ngmf.isMobile()){
		ngmf.alert("ngmf.setSingleFileComp : 모바일환경에서 지원불가 API 입니다.");
		return;
	}
	
	// 변수선언
	var sRtnVal = "N";
	try {
		var chaneAfterEvent = null;
		if (typeof _chaneAfterEvent != "undefined" && _chaneAfterEvent) chaneAfterEvent = ngmf._getCallBackFunction(_chaneAfterEvent);
		if (typeof _uploadComp == "undefined" || !_uploadComp) _uploadComp = "file0";
		var uploadComp = null;
		uploadComp = ngmf.object(_uploadComp); 

		if (!uploadComp || uploadComp.getPluginName() != "upload") {
			if (!ngmf._createUploadComp(_uploadComp)) {
				if (eFlag) {
					sRtnVal = new Array();
					sRtnVal[0] = "N";
					sRtnVal[1] = "ZNGMC0065";
				} else {
					ngmf.alert(ngmf.getMessage("ZNGMC0065"));
				}
				return sRtnVal;
			} else {
				//파일 upload 객체가 없을경우 생성함...
				uploadComp = ngmf.object(_uploadComp);
			}
		}
		var fileObj = document.getElementById(uploadComp.getID() + "_fakeinput");

		if (!fileObj) {
			if (eFlag) {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = "ZNGMC0065";
			} else {
				ngmf.alert(ngmf.getMessage("ZNGMC0065"));
			}
			return sRtnVal;
		}

		if (fileObj.multiple)
			fileObj.multiple = false;

		if (_buttonComp) {
			if (typeof _buttonComp == "string") _buttonComp = ngmf.object(_buttonComp);
			if (!ngmf._checkEventName(_buttonComp, "onclick"))
				_buttonComp.bind("onclick", function(obj) {
					try {
						if(document.getElementById(uploadComp.getID() + "_fakeinput"))
							document.getElementById(uploadComp.getID() + "_fakeinput").click();
					} catch (e) {
						ngmf._error("onclick ERROR:::::", e);
					}
				});
		}
		
		if ( chaneAfterEvent ) {
			ngmf._addEventElem(fileObj, "change", function (event) {
				chaneAfterEvent(event.target, uploadComp);
			}, true);
		}
		
		if (_viewInputComp) {
			if (typeof _viewInputComp == "string") _viewInputComp = ngmf.object(_viewInputComp);
			if (!ngmf._checkEventName(uploadComp, "onInputValueChange")) {
				uploadComp.bind("onInputValueChange", function(fName) {  
					if(fName) _viewInputComp.setValue(fName.substr(fName.lastIndexOf("\\")+1));
					else  _viewInputComp.setValue("");
				});
			}	
		}
		var fileType = ngmf.trim(_fileType);

		if (fileType.length > 0) {
			fileObj.accept = ngmf._getAcceptTypeSet(fileType);
		} else {
			fileObj.accept = "*.*";
		}
		if (eFlag) {
			sRtnVal = new Array();
			sRtnVal[0] = "Y";
			sRtnVal[1] = "";
		} else {
			sRtnVal = "Y";
		}
	} catch (e) {
		ngmf._error("[ngmf.setSingleFileComp ] Exception :: ", e);
	}
	return sRtnVal;
};

/**
*  멀티 업로드 컴퍼넌트 구성
*  멀티 업로드 구현시 반드시 onLoadComplete 에서 호출해 줄것...
* @date 2016. 1. 27.
* @memberOf  ngmf
* @param {String / Json} uploadComp :: I :: N :: "fileM" :: 업로드 컴퍼넌트
* @param {String / Json} ds_file :: I :: N ::  :: 파일 META 정보를 관리할  DATALIST OR ID
* @param {String / Json} buttonComp :: I :: N ::  :: 업로드 버튼 컴퍼넌트
* @param {Boolean} eFlag :: I :: Y ::  :: 에러메세지 호출 여부
* @param {String} fileType :: I :: Y ::  :: 파일 형식 제어 (jpg,bmp,png,doc,docx,pdf,zip)
* @param {Boolean} autoApply :: I :: Y :: 0 :: 파일 선택시 파일 META 정보관리 DATALIST에 정보 자동 반영 여부
* @param {String/Json} chaneAfterEvent :: I :: Y :: 0 :: 파일 선택 후 이벤트 호출 chaneAfterEvent(file객체)
* @returns {Object}
* @sampleLink ATFIL_SAMPLE
* @author 성일호
* @useMobile useless
* @example ngmf.setMultiFileComp("fileM", "dsl_fileM", "btn_multiupload", 0,"", 1);
* @since
 */
ngmf.setMultiFileComp = function(_uploadComp, _ds_file, _buttonComp, eFlag, _fileType, autoApply, _chaneAfterEvent) {
	if(ngmf.isMobile()){
		ngmf.alert("ngmf.setMultiFileComp : 모바일환경에서 지원불가 API 입니다.");
		return;
	}
	
	// 변수선언
	var sRtnVal = "N";
	var _uploadCompId = "";
	try {
		var chaneAfterEvent = null;
		if (typeof _chaneAfterEvent != "undefined" && _chaneAfterEvent) chaneAfterEvent = ngmf._getCallBackFunction(_chaneAfterEvent);
		if (typeof _uploadComp == "undefined" || !_uploadComp) _uploadComp = "fileM";
		
		if (typeof _ds_file == "undefined" || !_ds_file) {
			if (eFlag) {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = "ZNGMC1139";
			} else {
				ngmf.alert(ngmf.getMessage("ZNGMC1139"));
				// 저장처리할 데이터가 없습니다.
			}
			return sRtnVal;
		}
		
		var ds_file = ngmf.object(_ds_file);
		if (!ds_file) {
			ngmf.createDataList( _ds_file
					, [ "chk","file","size","del","atfilId","atfilSerNum","savePathNm","trxCode" ]
					, [ "text","text","number","text","text","text","text","text"]);
			ds_file = ngmf.object(_ds_file);
		}  else {
			if(typeof ds_file.getColumnIndex("file") == "undefined") {
				ds_file.insertColumn("file",{
					'name':		'file',
					'dataType':	'text'
				});
			}
			if(typeof ds_file.getColumnIndex("size") == "undefined") {
				ds_file.insertColumn("size",{
					'name':		'size',
					'dataType':	'number'
				});
			}
			if(typeof ds_file.getColumnIndex("del") == "undefined") {
				ds_file.insertColumn("del",{
					'name':		'del',
					'dataType':	'text'
				});
			}
			if(typeof ds_file.getColumnIndex("atfilId") == "undefined") {
				ds_file.insertColumn("atfilId",{
					'name':		'atfilId',
					'dataType':	'text'
				});
			}
			if(typeof ds_file.getColumnIndex("savePathNm") == "undefined") {
				ds_file.insertColumn("savePathNm",{
					'name':		'savePathNm',
					'dataType':	'text'
				});
			} 
			if(typeof ds_file.getColumnIndex("trxCode") == "undefined") {
				ds_file.insertColumn("trxCode",{
					'name':		'trxCode',
					'dataType':	'text'
				});
			}  
			if(typeof ds_file.getColumnIndex("chk") == "undefined") {
				ds_file.insertColumn("chk",{
					'name':		'chk',
					'dataType':	'text'
				});
			} 
		} 
		
		var uploadComp = ngmf.object(_uploadComp);

		if (!uploadComp || uploadComp.getPluginName() != "upload") {
			if (!ngmf._createUploadComp(_uploadComp)) {
				if (eFlag) {
					sRtnVal = new Array();
					sRtnVal[0] = "N";
					sRtnVal[1] = "ZNGMC0065";
				} else {
					ngmf.alert(ngmf.getMessage("ZNGMC0065"));
				}
				return sRtnVal;
			} else {
				//파일 upload 객체가 없을경우 생성함...
				uploadComp = ngmf.object(_uploadComp);
			}
		}
		 
		var fileObj = document.getElementById(uploadComp.getID() + "_fakeinput");

		if (!fileObj) {
			if (eFlag) {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = "ZNGMC0065";
			} else {
				ngmf.alert(ngmf.getMessage("ZNGMC0065"));
			}
			return sRtnVal;
		}
		
		if (typeof  scvar[uploadComp.getID() + "_files"] == 'undefined') {
			scvar[uploadComp.getID() + "_files"] = new Array();
		}
		
		if (_buttonComp) {
			if (typeof _buttonComp == "string") _buttonComp = ngmf.object(_buttonComp);
			//.unbind("onclick")
			if (!ngmf._checkEventName(_buttonComp, "onclick"))
				_buttonComp.bind("onclick", function(e) {
					if (document.getElementById(uploadComp.getID()+ "_fakeinput"))
						document.getElementById(uploadComp.getID() + "_fakeinput").click();
				});
		}
		
		
		if (chaneAfterEvent) { 
			ngmf._addEventElem(fileObj, "change", function (event) {
				chaneAfterEvent(event.target, uploadComp);
			}, true);				
		} else if (typeof autoApply != "undefined" && autoApply) {
			ngmf._addEventElem(fileObj, "change", function (event) {
				ngmf.openMultiFileRead(ds_file, eFlag, uploadComp, true) ; 
			}, true);				
		}
		
		//2016.09.02 파일 dataList 에서 대상 삭제시 file 객체도 삭제
		if (!ngmf._checkEventName(ds_file, "onremoverow")) {
			//G_DS.getColumnIndex("file");]
			ds_file.addEvent("onremoverow", function(e){
				var delObj = e.removedDataObj;
				if (!delObj) return;
				var fnameIndex = ds_file.getColumnIndex("file");
				for (var obj in delObj ) {
					ngmf._removeFileObjArr (scvar[uploadComp.getID() + "_files"] ,delObj[obj][fnameIndex]);
				}
			});
		}
		
		var fileType = ngmf.trim(_fileType);
		if (fileType.length > 0) {
			fileObj.accept = ngmf._getAcceptTypeSet(fileType);
		} else fileObj.accept = "*.*";
		
		if (typeof !fileObj["multiple"] != "undefined" && !fileObj["multiple"])
			fileObj.multiple = true;

		if (eFlag) {
			sRtnVal = new Array();
			sRtnVal[0] = "Y";
			sRtnVal[1] = "";
		} else {
			sRtnVal = "Y";
		}
	} catch (e) {
		ngmf._error("[ngmf.setMultiFileComp ] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 업로드 할 다중 파일을 선택한다.
 * @date 2016-01-18
 * @memberOf ngmf
 * @param {String / Json} ds_file :: I :: N ::  :: 파일 Dataset
 * @param {Boolean} eFlag :: I :: Y ::  :: 파일 에러코드여부
 * @param {String / Json} uploadComp :: I :: N :: "fileM" :: 업로드 컴퍼넌트
 * @returns {String / Array} 에러여부 : Y, N
 * @sampleLink ATFIL_SAMPLE
 * @useMobile useless
 * @example 
  			// 필수 : 초기화  scwin.form_onLoadCompleted 내에 아래함수 반드시 실행
			// ngmf.setMultiFileComp("fileM", ds_file, btnSearchMFile,1,"",true); :  "fileM" = file upload 컴포넌트 ID,  ds_file = 업로드 대상파일 관리 DATASET, btnSearchMFile = 업로드 버튼 객체          			
 			   var chkValArr = ngmf.openMultiFileRead(ds_file, 1, fileM);
				if (chkValArr[0] == "Y") {
					ngmf.__encUploadMultiFile("0", fileM, ds_file, "1", 1, "" , function(retArr) {
						if (retArr[0] == "Y") {
							ngmf.alert("MULTI UPLOAD 성공");
							// 저장 후 처리 프로세서 진행

						} else {
							ngmf.alert("MULTI UPLOAD 실패 :::::" + retArr[1]);
						}
					});
				} else {
					ngmf.alert(ngmf.getMessage(chkValArr[1]));
				} 
 */
ngmf.openMultiFileRead = function(ds_file, eFlag, _uploadComp, notCheck) {  
	var sRtnVal  = new Array();
	try {
		if (typeof _uploadComp == "undefined" || !_uploadComp) _uploadComp = "fileM";
		var startIdx = -1, endIdx = -1;
		var fileName, filesize, chkFileExe, chkFilename;
		var chkFilenum, fileList, fileObj;
		if (eFlag) { 
			sRtnVal[0] = "Y";
		} else {
			sRtnVal = "Y";
		}

		var uploadComp = null;
		if (typeof _uploadComp == "string") {
			uploadComp = ngmf.object(_uploadComp);
		} else uploadComp = _uploadComp;

		if (!uploadComp || uploadComp.getPluginName() != "upload") {
			if (eFlag) {
				sRtnVal[0] = "N";
				sRtnVal[1] = "ZNGMC0065";
			} else {
				ngmf.alert(ngmf.getMessage("ZNGMC0065"));
			}
			return sRtnVal;
		}
		//초기화가 안되어 있을 경우
		if (typeof scvar[uploadComp.getID() + "_files"] == "undefined"){
			scvar[uploadComp.getID() + "_files"] = new Array();
//			ngmf.setMultiFileComp(uploadComp, ds_file, null, 1 );
//			if (eFlag) {
//				sRtnVal[0] = "N";
//				sRtnVal[1] = "ZNGMC0065";
//			} else {
//				ngmf.alert(ngmf.getMessage("ZNGMC0065"));
//			}
//			return sRtnVal; 
		}
			
		ds_file = ngmf.object(ds_file);
		
		fileList = scvar[uploadComp.getID() + "_files"];
		fileObj = document.getElementById(uploadComp.getID() + "_fakeinput");
		
		if (typeof notCheck != "undefined" && notCheck) {
			if (fileObj) {
				// 파일을 Dataset 에 등록
				var insIdx = -1;
				for (var ix = 0; ix < fileObj.files.length; ix++) {
					// 파일리스트에서 파일 이름을 가져온다.
					fileName = fileObj.files[ix].name;
					// 파일 확장자 검사
					chkFileExe = ngmf.checkExeFile(fileName);
					// 파일 이름 중복검사
					chkFilename = ngmf.checkDuplicateFilename(fileName, ds_file);

					if (chkFileExe == "N" && chkFilename[0] == "N") {
						filesize = fileObj.files[ix].size;
						if ( chkFilename[0] == "N") {
							insIdx = ds_file.insertRow();
							ds_file.setCellData(insIdx, "chk", "1");
							ds_file.setCellData(insIdx, "file", fileName);
							ds_file.setCellData(insIdx, "size", filesize);
							ds_file.setCellData(insIdx, "del", "0");
							ds_file.setCellData(insIdx, "trxCode", "i");
						} else if ( chkFilename[0] == "U") {
							ds_file.setCellData(chkFilename[1], "chk", "1");
							ds_file.setCellData(chkFilename[1], "file", fileName);
							ds_file.setCellData(chkFilename[1], "size", filesize);
							ds_file.setCellData(chkFilename[1], "del", "0");
							ds_file.setCellData(chkFilename[1], "trxCode", "u");
						}
						if (ngmf._removeFileObjArr(fileList, fileName))
							fileList.push(fileObj.files[ix]);
						
						endIdx++;						
					} else {
						//파일 upload Component 초기화
						ngmf._clearFileObjInfo(fileObj);
						if (eFlag) {
							sRtnVal = new Array();
							sRtnVal[0] = "N";
							sRtnVal[1] = "ZNGMC0068";
						} else {
							sRtnVal = "N";
							ngmf.alert(ngmf.getMessage("ZNGMC0068"));
						}
						return sRtnVal;
					}
				}
				//파일 upload Component 초기화
				ngmf._clearFileObjInfo(fileObj);
			}
		} else {
			var sRtnVal2 = new Array();			
			var maxSize = ngmf.parseInt(ngmf.getCodeName("ZNGM_P_FILUP", "MAX_SIZE", "Y"));
			var minSize = ngmf.parseInt(ngmf.getCodeName("ZNGM_P_FILUP", "MIN_SIZE", "Y"));
			
			if (fileObj) {  
				// ds_file 시작점 지정 (Append 시 필요)
				startIdx = endIdx = ds_file.getRowCount();
				// 전체 파일의 개수를 체크한다.
				chkFilenum = ngmf.checkFileNum( (startIdx + fileObj.files.length), eFlag);
				if (chkFilenum == "N") {
					// 파일을 Dataset 에 등록
					var insIdx = -1;
					for (var ix = 0; ix < fileObj.files.length; ix++) {
						// 파일리스트에서 파일 이름을 가져온다.
						fileName = fileObj.files[ix].name;
						// 파일 확장자 검사
						chkFileExe = ngmf.checkExeFile(fileName);
						// 파일 이름 중복검사
						chkFilename = ngmf.checkDuplicateFilename(fileName, ds_file);

						if (chkFileExe == "N" && chkFilename[0] == "N") {
							filesize = fileObj.files[ix].size;

							if ( chkFilename[0] == "N") {
								insIdx = ds_file.insertRow();
								ds_file.setCellData(insIdx, "chk", "1");
								ds_file.setCellData(insIdx, "file", fileName);
								ds_file.setCellData(insIdx, "size", filesize);
								ds_file.setCellData(insIdx, "del", "0");
								ds_file.setCellData(insIdx, "trxCode", "i");
							} else if ( chkFilename[0] == "U") {
								ds_file.setCellData(chkFilename[1], "chk", "1");
								ds_file.setCellData(chkFilename[1], "file", fileName);
								ds_file.setCellData(chkFilename[1], "size", filesize);
								ds_file.setCellData(chkFilename[1], "del", "0");
								ds_file.setCellData(chkFilename[1], "trxCode", "u");
							}
							
							// 전체 파일 사이즈를 체크
							sRtnVal2 = ngmf.getFileUploadMaxTotalSize(ds_file, eFlag, maxSize, minSize);

							if (sRtnVal2[0] == "Y") {
								if (eFlag) {
									sRtnVal = new Array();
									sRtnVal[0] = "N";
									sRtnVal[1] = sRtnVal2[1];
								} else {
									sRtnVal = "N";
								}
								//DATASET 되돌리기
								if ( chkFilename[0] == "N") ds_file.removeRow(insIdx , {noEvent:true});
								else ds_file.undoRow(chkFilename[1]);
								//파일 upload Component 초기화
								ngmf._clearFileObjInfo (fileObj);
								
								return sRtnVal;
							} else {
								fileList.push(fileObj.files[ix]);
								endIdx++;
							}							
						} else {
							//파일 upload Component 초기화
							ngmf._clearFileObjInfo(fileObj);
							if (eFlag) {
								sRtnVal = new Array();
								sRtnVal[0] = "N";
								sRtnVal[1] = "ZNGMC0068";
							} else {
								sRtnVal = "N";
								ngmf.alert(ngmf.getMessage("ZNGMC0068"));
							}
							return sRtnVal;
						}
					} 
					//파일 upload Component 초기화
					ngmf._clearFileObjInfo (fileObj);

				} else {
					// 2005-11-23 추가로직 (에러메세지 출력)
					if (eFlag) {
						sRtnVal = new Array();
						sRtnVal[0] = "N";
						sRtnVal[1] = "ZNGMC0058";
					} else {
						sRtnVal = "N";
						ngmf.alert(ngmf.getMessage("ZNGMC0058"));
					}
				}				
			}
			
			// 전체 파일 사이즈를 체크
			sRtnVal2 = ngmf.getFileUploadMaxTotalSize(ds_file, eFlag, maxSize, minSize);
			if (sRtnVal2[0] == "Y") {
				if (eFlag) {
					sRtnVal = new Array();
					sRtnVal[0] = "N";
					sRtnVal[1] = sRtnVal2[1];
				} else {
					sRtnVal = "N";
				}
				//마지막 파일을 지운다.
				ngmf._removeFileObjArr(fileList, ds_file.getCellData(ds_file.getRowCount()-1, "file"));
				ds_file.removeRow(ds_file.getRowCount()-1 , {noEvent:true});
				
				return sRtnVal;
			}
			
			// 파일 검사
			var iIdx = ngmf._getCheckedIndex(ds_file);
			var ix = -1;
			for (var i=0; i < iIdx.length; i++) {
				ix = iIdx[i];
				if ( Number(ds_file.getCellData(ix, "del")) != 1 &&   ngmf._getTargetFileIndex(fileList, ds_file.getCellData(ix, "file")) == -1) { 
					if (eFlag) {
						sRtnVal = new Array();
						sRtnVal[0] = "N";
						sRtnVal[1] = "파일[" +ds_file.getCellData(ix, "file") + "]를 선택하셔야 합니다."; 
					} else {
						sRtnVal = "N";
						ngmf._error("파일[" +ds_file.getCellData(ix, "file") + "]를 선택하셔야 합니다.");
					}
					//ds_file.removeRow(ix , {noEvent:true});
					ds_file.removeRow(ix);
					return sRtnVal;
				}
			}
			
		}
	} catch (e) {
		ngmf._error("[ngmf.openMultiFileRead] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 다운로드 파일의 저장 장소를 선택한다.
 * 불필요...삭제예정
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {String} atfil_nm  :: I :: N ::  :: 저장할 파일 이름(디렉토리는 지원하지 않음)
 * @returns {Object}
 * @author 성일호
 * @example
 * @since
 */
ngmf.openSingleFileSave = function(atfil_nm) {
	// 변수선언
	var localUrl = atfil_nm || "";
	try {

//		// FileDialog 설정
//		global.MainTitle.FileDialog0.Type = "SAVE";
//		// 저장파일 이름 설정
//		global.MainTitle.FileDialog0.FileName = atfil_nm;
//
//		// FileDialog 에러 체크 (2005-11-22 추가항목)
//		if (!global.MainTitle.FileDialog0.open()) {
//			return;
//		} else {
//			localUrl = global.MainTitle.FileDialog0.FilePath + "\\"
//					+ global.MainTitle.FileDialog0.FileName;
//		}
	} catch (e) {
		ngmf._error("[ngmf.openSingleFileSave ] Exception :: ", e);
	}
	return localUrl;
};

/**
 *  파일업로드시에 파일 사이즈를 체크한다.
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {Object} fileObj :: I :: N ::  :: 파일 upload Component
 * @returns {Object}
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */
ngmf.getFileSize = function(fileObj) {
	// 변수선언
	var sRtnVal = 0;
	try {
		if (!fileObj) {
			sRtnVal = 0;
		} else if ( fileObj.length > 0) {
			for ( var i = 0; i < fileObj.length; i++) {
				sRtnVal += fileObj[i].size;
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getFileSize ] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 *  실제 사용가능한 하는 파일 갯수를 구함.
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {Object} fileObj :: I :: N ::  :: 파일 객체 DATA SET
 * @returns {Object}
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */
ngmf.getRealFileCount = function(ds_file) {
	// 변수선언
	var sRtnVal = 0;
	try {
		if (typeof ds_file == "undefined" || !ds_file) {
			sRtnVal = 0;
		} else{
			var chkIdx = ngmf._getCheckedIndex(ds_file);
			for ( var i = 0; i < chkIdx.length; i++)  if (  ngmf.toNumber(ds_file.getCellData(chkIdx[i], "del") || "0") != 1 ) sRtnVal ++;
		}
	} catch (e) {
		ngmf._error("[ngmf.getRealFileCount ] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 *  파일 미리보기 종료된 후, 파일 삭제
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::  :: 파일의 위치
 * @returns {Object}
 * @author 성일호
 * @example
 * @since
 */
ngmf.deleteLocalFile = function(sValue) {
	// 변수선언
	var sRtnVal = 0;
	try {
		//	    rtnVal = global.MainTitle.File0.Delete();
		//	    if ( rtnVal != 1 ) {
		//	        ngmf.excelTimerSet();
		//	    }
	} catch (e) {
		ngmf._error("[ngmf.deleteLocalFile ] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 *  파일 미리보기 종료된 후, 파일 삭제를 위한 타이머 처리
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @returns
 * @author 성일호
 * @example
 * @since
 */
ngmf.excelTimerSet = function() {
	// 변수선언
	var sRtnVal = 0;
	try {
		// timer로 체크
		//		if ( this.OnTimer != "ngmf.excelTimer" ) {
		//			ngmv.orgTimer = this.OnTimer;
		//			this.OnTimer = "ngmf.excelTimer";
		//		}
		//		setTimer(777,1000);
	} catch (e) {
		ngmf._error("[ngmf.excelTimerSet ] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 파일 미리보기 종료된 후, 파일 삭제를 위한 타이머 처리
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {String} obj :: I :: N ::  :: 대상 객체
 * @param {String} nEventID :: I :: N ::  :: 타이머 관리 ID
 * @returns
 * @author 성일호
 * @example
 * @since
 */
ngmf.excelTimer = function(obj, nEventID) {
	// 변수선언
	var sRtnVal = 0;
	try {
		//		if ( nEventID == 777 ) {
		//			killtimer(nEventID);
		//			ngmf.deleteLocalFile();
		//		}
		//
		//		if ( ( length(ngmv.orgTimer) > 0 ) && ( ngmv.orgTimer != "ngmf.onTimer" ) ) {
		//				this.OnTimer = ngmv.orgTimer;
		//		}
	} catch (e) {
		ngmf._error("[ngmf.excelTimer ] Exception :: ", e);
	}
	return sRtnVal;
};

/**
 * 다중 파일을 다운로드할때 동일 파일 이름 체크
 * 다운로드시 파일 다이얼로그에서 자동 처리 됨 (불필요)
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {String} localUrl :: I :: N ::  :: 저장할 파일 로컬주소
 * @param {String} filename :: I :: Y ::  :: 파일 이름
 * @param {Boolean} isFirst :: I :: Y ::  :: 동일 파일명 덮어쓰기 여부
 * @returns {Object}
 * @author 성일호
 * @example
 * @since
 */
ngmf.checkDownloadMultiFile = function(localUrl, filename, isFirst) {
	// 변수선언
	var sRtnVal = "Y";
	try {
//		var chgFilename, idx, jx, kx, rtnFilename, chkFilename, chkExistFile, rtnFilename2;
//
//		/*20060517*/
//		if (isFirst == 1) {
//			sRtnVal = filename;
//			return sRtnVal;
//		}
//
//		// 실제 파일이 있는지 체크
//		chkFilename = localUrl + "\\" + filename;
//		chkExistFile = global.MainTitle.File0.IsExistFile(chkFilename);
//
//		// Default setting (filename)
//		sRtnVal = filename;
//		ix = 0;
//
//		if (ngmf.isNull(chkFilename) == "Y" || ngmf.isNull(filename) == "Y") {
//			sRtnVal = "";
//		} else if (chkExistFile == 1) {
//			chgFilename = Split(filename, ".");
//			idx = ngmf.length(chgFilename);
//			kx = 0;
//
//			for (jx = 0; jx < idx - 1; jx++) {
//				if (jx > 0 && idx > 2) {
//					rtnFilename = rtnFilename + "." + chgFilename[jx];
//				} else {
//					rtnFilename = rtnFilename + chgFilename[jx];
//				}
//			}
//
//			while (1) {
//				rtnFilename2 = rtnFilename + "(" + kx + ")."
//						+ chgFilename[idx - 1];
//				chkFilename = localUrl + "\\" + rtnFilename2;
//				chkExistFile = global.MainTitle.File0.IsExistFile(chkFilename);
//				if (chkExistFile != 1) {
//					sRtnVal = rtnFilename2;
//					break;
//				}
//				kx++;
//			}
//			/*---------------------------------------------------------------------*/
//		}
	} catch (e) {
		ngmf._error("[ngmf.checkDownloadMultiFiler] Exception :: ", e);
	}
	return sRtnVal;
};


/**
 * 암호화, 비암호화 게시판 업로드 권한 체크(암호화 모듈 도입후 재정의)
 * @date 2016. 1. 19.
 * @memberOf ngmf
 * @param {String} file_url :: I :: N ::  :: File 경로(전체경로명+파일명)
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판 1 : 암호화 게시판
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 결과 처리용 CAllBACK 함수
 * @returns {String} 결과  Y(업로드 가능), N(업로드 불가능)
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */
ngmf.singleFileAclCheck = function (fileObj, enc, callBackFunc) {
	ngmf.promise._singleFileAclCheck(fileObj, enc)
	.then(function (sRtnVal) {
		if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(sRtnVal);
	})
	.then(undefined, function(e){
		ngmf._error("[ngmf.singleFileAclCheck] Exception :: ", e);
		if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)("N");
	});
}; 
/**
 * 암호화, 비암호화 게시판 업로드 권한 체크(암호화 모듈 도입후 재정의)
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {Array} fileList :: I :: N ::  :: 파일 객체 배열
 * @param {Boolean} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판 1 : 암호화 게시판
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 결과 처리용 CAllBACK 함수
 * @returns {String} Y(업로드 가능), N(업로드 불가능)
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */
ngmf.multiFileAclCheck = function(fileList, enc, callBackFunc) {
	ngmf.promise._multiFileAclCheck(fileList, enc)
	.then(function (sRtnVal) {
		if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(sRtnVal);
	})
	.then(undefined, function(e){
		ngmf._error("[ngmf.multiFileAclCheck] Exception :: ", e);
		if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)("N");
	});		
 }; 
 
/**
 * 전자서명관리화면 요청
 * @date 2016. 1. 21.
 * @memberOf ngmf
 * @param {String} comm_cd_id :: I :: N ::  :: 업무구분(mid)
 * @param {String} file_del_yn :: I :: N ::  :: 파일삭제여부
 * @param {String / Json} dst_sign_out :: I :: N ::  :: 대상 데이터셋
 * @param {String} callBackFunc :: I :: Y ::  :: callBackFuncion 이름
 * @returns {Boolean}
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */
ngmf.callElecSign = function(comm_cd_id, file_del_yn, dst_sign_out, callBackFunc) {
	// 변수선언
	var sRtnVal = true; 
		ngmf.promise._callElecSign (comm_cd_id, file_del_yn, dst_sign_out)
		   .then( function (retObj) {
					sRtnVal = retObj;
					if (callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
				}) 
			.then( undefined, function (retObj) {
				sRtnVal = retObj;
				if (callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj);
			});
	return sRtnVal;
};

/**
 * 그리드 내 파일정보와 실제 파일 리스트 정보를 맞춘다.
 * @date 2015. 02. 22.
 * @memberOf  ngmf
 * @param {String / Json} gridObj :: I :: N ::  :: 파일정보 보여줄 그리드 객체 또는 ID
 * @returns {Boolean}
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_GRIDSAMPLE
 * @example ngmf.resetGridMultiFile("gridView");
 * @since
 */
ngmf.resetGridMultiFile = function(_gridObj) {
	if(ngmf.isMobile()){
		ngmf.alert("ngmf.resetGridMultiFile : 모바일환경에서 지원불가 API 입니다.");
		return;
	}
	
	// 변수선언
	var sRtnVal = false;
	try {
		if (typeof _gridObj == "undefined" || !_gridObj) {
			//ngmf.alert("대상 그리드객체가 없습니다.");
			return sRtnVal;
		}
		var gridObj = null;
		gridObj = ngmf.object(_gridObj);
		if (typeof gridObj == "undefined" || !gridObj) {
			//ngmf.alert("대상 그리드객체가 없습니다.");
			return sRtnVal;
		}
		gridViewId = gridObj.getID();
		
		if ( gridObj.getRowCount() == 0) {
			scvar["gvf_" + gridViewId + "_R"] = -1;
			scvar["gvf_" + gridViewId + "_C"] = -1;
			if (window["dsfile_"+ gridViewId]) {
				window["dsfile_"+ gridViewId].removeAll();
				for(var j = (scvar["flist_" + gridViewId ].length-1); j > -1; j--){
					delete  scvar["flist_" + gridViewId ].splice(j,1);
				}				
			}
			sRtnVal = true;
		} else {
			var realMap = {}; 
			for (var k=0; k < gridObj.getRowCount(); k++ ) {
				if ( gridObj.getRowStatus(k) != "R" && gridObj.getRowStatus(k) != "D" ) {
					for (var cidx in scvar["gvf_" + gridViewId +"_CM"]) {
						if (gridObj.getCellData(k, Number(cidx) ) != "" && isNaN(gridObj.getCellData(k,Number(cidx)))) realMap[gridObj.getCellData(k,Number(cidx))] = true; 
					}					
				}
			}//  scvar["gvf_grd_gdsPlanDtlList_CM"]
 
			for(var j = (scvar["flist_" + gridViewId ].length-1); j > -1; j--){
				if (!realMap[scvar["flist_" + gridViewId ][j].name]) {
					window["dsfile_"+ gridViewId].removeRow(j);
					delete  scvar["flist_" + gridViewId ].splice(j,1);
				}
			}
			sRtnVal = true;
		}			
		 
	} catch (ex) {
		return false;
		ngmf._error("[ngmf.resetGridMultiFile ] Exception :: ", ex);
	}
	return sRtnVal;
};

/**
 * 그리드 멀티 파일 업로드 초기화
 * @date 2015. 02. 22.
 * @memberOf  ngmf
 * @param {String / Json} gridObj :: I :: N ::  :: 파일정보 보여줄 그리드 객체 또는 ID
 * @param {Array} columnObjArray :: I :: N ::  :: 파일선택 정보 보여줄 Column ID 리스트
 * @returns {Boolean}
 * @sampleLink ATFIL_GRIDSAMPLE
 * @author 성일호
 * @useMobile useless
 * @example ngmf.setGridMultiFileInit("gridView",  ["fileCol1","fileCol1"]);
 * @since
 */
ngmf.setGridMultiFileInit = function(_gridObj, columnObjArray) {
	if(ngmf.isMobile()){
		ngmf.alert("ngmf.setGridMultiFileInit : 모바일환경에서 지원불가 API 입니다.");
		return;
	}
	
	// 변수선언
	var sRtnVal = false;
	try {
		var gridViewId = "";
		if (typeof _gridObj == "undefined" || !_gridObj) {
			ngmf.alert("대상 그리드객체가 없습니다.");
			return sRtnVal;
		}
		if (typeof columnObjArray == "undefined" || columnObjArray.length == 0) {
			ngmf.alert("대상 칼럼정보가 없습니다.");
			return sRtnVal;
		}
		var gridObj = null;
		gridObj = ngmf.object(_gridObj);
		if (typeof gridObj == "undefined" || !gridObj) {
			ngmf.alert("대상 그리드객체가 없습니다.");
			return sRtnVal;
		}

		gridViewId = gridObj.getID();
		//그리드 체크
		//1. 컬럼 체크
		scvar["gvf_" + gridViewId +"_CM"] = {};
		for (var i = 0; i < columnObjArray.length ; i++) {
			//textImage
			if(typeof gridObj.getColumnOption(columnObjArray[i],"inputType") == "undefined" || gridObj.getColumnOption(columnObjArray[i],"inputType") != "textImage" ) {
				ngmf.alert("Column [" + columnObjArray[i] +"]의 inputType은 textImage 만 가능합니다.");
				return sRtnVal;
			}
			scvar["gvf_" + gridViewId +"_CM"][gridObj.getColumnIndex(columnObjArray[i]) + ""] = columnObjArray[i];
		}
		//2. 전역변수 초기화
		scvar["gvf_" + gridViewId + "_R"] = -1;
		scvar["gvf_" + gridViewId + "_C"] = -1;

		
		if (! window["dsfile_"+ gridViewId]) {
			//3. 필수 Component 생성
			if (! ngmf.object("gvf_" + gridViewId)) {
				ngmf.create("gvf_" + gridViewId, "upload" ,{style : "display:none;"});
			}
			ngmf.createDataList("dsfile_"+ gridViewId
					, [ "chk","file","size","del","atfilId","atfilSerNum","savePathNm","trxCode" ]
					, [ "text","text","number","text","text","text","text","text"]);
			
			scvar["flist_" + gridViewId ] = new Array();
		} else {
			ngmf._clearFileObjInfo (document.getElementById("gvf_" + gridViewId + "_fakeinput"));
			for(var i =  scvar["flist_" + gridViewId ].length-1; i > -1; i--){
				window["dsfile_"+ gridViewId].removeRow(i);
				delete scvar["flist_" + gridViewId ].splice(i,1);
			}
		} 
		sRtnVal = true;
	} catch (ex) {
		ngmf._error("[ngmf.setGridMultiFileInit ] Exception :: ", ex);
	}
	return sRtnVal;
};

/**
 * 그리드 멀티 업로드 컴퍼넌트 구성
 * 멀티 업로드 구현시 반드시 onLoadComplete 에서 호출해 줄것...
 * @date 2015. 02. 22.
 * @memberOf  ngmf
 * @param {String / Json} gridObj :: I :: N ::  :: 파일정보 보여줄 그리드 객체 또는 ID
 * @param {Array} columnObjArray :: I :: N ::  :: 파일선택 정보 보여줄 Column ID 리스트
 * @param {String/Json} chaneAfterEvent :: I :: Y :: 0 :: 파일 선택 후 이벤트 호출 chaneAfterEvent(file객체, rowId, colId, grid)
 * @returns {Boolean}
 * @sampleLink ATFIL_GRIDSAMPLE
 * @author 성일호
 * @useMobile useless
 * @example ngmf.setGridMultiFileComp("gridView",  ["fileCol1","fileCol1"]);
 * @since
 */
ngmf.setGridMultiFileComp = function(_gridObj, columnObjArray, _chaneAfterEvent) {
	if(ngmf.isMobile()){
		ngmf.alert("ngmf.setGridMultiFileComp : 모바일환경에서 지원불가 API 입니다.");
		return;
	}
	
	// 변수선언
	var sRtnVal = false;
	try { 
		var chaneAfterEvent = null;
		if (typeof _chaneAfterEvent != "undefined" && _chaneAfterEvent) chaneAfterEvent = ngmf._getCallBackFunction(_chaneAfterEvent);
		var gridViewId = "";
		var gridObj = null;
		gridObj = ngmf.object(_gridObj);
		if (typeof gridObj == "undefined" || !gridObj) {
			ngmf.alert("대상 그리드객체가 없습니다.");
			return sRtnVal;
		}
		gridViewId = gridObj.getID();
		if (window["dsfile_"+ gridViewId]) {
			return ngmf.setGridMultiFileInit(_gridObj, columnObjArray);
		} else {
			if ( !ngmf.setGridMultiFileInit(_gridObj, columnObjArray)) return false;
			//4. 이벤트 설정
			gridObj.bind("ontextimageclick", function(ridx, colidx){
				try {
					if (scvar["gvf_" + gridViewId +"_CM"][colidx + ""]) {
						scvar["gvf_" + gridViewId + "_R"] = ridx;
						scvar["gvf_" + gridViewId + "_C"] = colidx;
							if(document.getElementById("gvf_" + gridViewId + "_fakeinput"))
								document.getElementById("gvf_" + gridViewId + "_fakeinput").click();
					}
				} catch (e) {
					ngmf._error(gridViewId + " ontextimageclick ERROR:::::", e);
				}
			});
			if (chaneAfterEvent) {
				ngmf._addEventElem(document.getElementById("gvf_" + gridViewId + "_fakeinput"),"change", function(e) {
					chaneAfterEvent(e.target,scvar["gvf_" + gridViewId + "_R"], scvar["gvf_" + gridViewId + "_C"], gridObj);
				});
			} else  {
				ngmf._addEventElem(document.getElementById("gvf_" + gridViewId + "_fakeinput"),"change", function(e) {
					try { 
						if(gridObj && gridObj.dataList) {
							//중복파일 확인
							var chkIdxs = window["dsfile_"+ gridViewId].getMatchedIndex("file", e.target.files[0].name);
							var isReset = false;
							if (chkIdxs.length <= 0) { 
								if( gridObj.getRowStatus(scvar["gvf_" + gridViewId + "_R"]) != "R" && gridObj.getRowStatus(scvar["gvf_" + gridViewId + "_R"]) != "D" &&  gridObj.getCellData(scvar["gvf_" + gridViewId + "_R"], scvar["gvf_" + gridViewId + "_C"])  != "") isReset = true;
								
								var insIdx = window["dsfile_"+ gridViewId].insertRow();
								window["dsfile_"+ gridViewId].setCellData(insIdx, "chk", "1");
								window["dsfile_"+ gridViewId].setCellData(insIdx, "file", e.target.files[0].name);
								window["dsfile_"+ gridViewId].setCellData(insIdx, "size", e.target.files[0].size);
								window["dsfile_"+ gridViewId].setCellData(insIdx, "del", "0");
								window["dsfile_"+ gridViewId].setCellData(insIdx, "trxCode", "i");
								scvar["flist_" + gridViewId ].push(e.target.files[0]);
								
								gridObj.dataList.setCellData(scvar["gvf_" + gridViewId + "_R"], scvar["gvf_" + gridViewId + "_C"], e.target.files[0].name);
								if (isReset) ngmf.resetGridMultiFile(gridObj);
							} else {
								//이미 선택된 파일 버림
								ngmf.alert("이미선택된 파일입니다.");
							}
						} else ngmf._error(gridViewId + " file comp. change ERROR::::: NOT gridObj" );
					} catch (ex) {
						ngmf._error(gridViewId + " file comp. change ERROR:::::" , ex);
					}
				});
			}
		}
		sRtnVal = true;
	} catch (ex) {
		ngmf._error("[ngmf.setGridMultiFileComp ] Exception :: ", ex);
	}
	return sRtnVal;
};
/**
 * ERROR 메세지 가져오기
 * @date 2015.02 26.
 * @memberOf ngmf
 * @param {String} arguments :: I :: N ::  :: 조회대상 ERROR CODE 또는 메세지
 * @returns {String}
 * @sampleLink ATFIL_GRIDSAMPLE
 * @author 성일호
 * @useMobile useless
 * @example ngmf.getErrMessage(retArr[1])
 */
ngmf.getErrMessage = function (){
	try{
		if (!arguments) return "";
		if(typeof arguments[0] != "string") { 
			return ngmf.toString(arguments[0]);
		}
		if (arguments[0].startsWith("Z")) {
			var retstr = "";
			switch(arguments.length) {
				case 1:
					retstr = ngmf.getMessage(arguments[0]);
				break;
				case 2:
					retstr = ngmf.getMessage(arguments[0],arguments[1]);
				break;
				case 3:
					retstr = ngmf.getMessage(arguments[0],arguments[1],arguments[2]);
				break;
				case 4:
					retstr = ngmf.getMessage(arguments[0],arguments[1],arguments[2],arguments[3]);
				break;
				default:
					retstr = ngmf.getMessage(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
				break;
			}
			return retstr;
		} else return arguments[0]; 

	}catch(e){
		ngmf._error("[ngmf.getErrMessage] Exception :: ", e); 
  	}
};

/**
 *  파일다운로드 (Promise)
 * @date 2016.02.25
 * @memberOf ngmf
 * @param {String} fileName :: I :: N ::  :: 다운로드될 파일이름
 * @param {String} str_cookie :: I :: N ::  :: 다운로드 파일 서버 경로
 * @param {Object} paramMap :: I :: Y ::  :: 기타 매개값
 * @param {String / Json} progressFunc  :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @returns {Object}  Promise
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */
ngmf.promise._fileRead = function (fileName, str_cookie, paramMap,  progressFunc){
	return new Promise(function(resolve, reject) {
		var rtn_arr = new Array();
		try {
			if (ngmf.length(str_cookie) <1) {
				throw  "파일경로가 없습니다.";
			}
			if (ngmf.length(fileName) <1) {
				throw  "파일이름이 없습니다.";
			}

			var strPort = ngmf.getServerUrl("FILE");
			var blobURL = strPort[0]
					+ ngmf.decode(ngmf.length(strPort[1]), 0, "", ":" + strPort[1])
					+ "/" + strPort[2];

			blobURL = blobURL + "NGMFileDownload?fCloseAccount=0";

			//TODO 테스트를 위해.... 
			if(ngmf.isMobile()) {
				var serverUrl = GLV.G_MOBILECONNURL;
				blobURL = serverUrl + "/NGMDecFileDownload?fCloseAccount=0";		
			} else {
				var L = location.toString();
				if (L.indexOf("websquare.html") > -1)
					blobURL = location.toString().split("?")[0].replace("websquare.html","NGMFileDownload") + "?fCloseAccount=0";
				else if (L.indexOf("popup.html") > -1)
					blobURL = location.toString().split("?")[0].replace("popup.html","NGMFileDownload") + "?fCloseAccount=0";
				
			} 
			var cookie_info = escape(str_cookie) + "||";
			 if ( ngmf.getGlobalValue("g_Ngms_IpAddr") == "") cookie_info += "127.0.0.1||";
			 else cookie_info += ngmf.getGlobalValue("g_Ngms_IpAddr") + "||";
			cookie_info += ngmf.getGlobalValue("g_Ngms_UserId") + "||";
			cookie_info += ngmf.getGlobalValue("g_Ngms_LogInId") + "||";
			cookie_info += ngmf.getGlobalValue("g_Ngms_OrgId") + "||";
			if(ngmf.isMobile()) {
				//TODO. 파일 뷰어 모듈 호출 할것
				rtn_arr[0] = "Y";
				rtn_arr[1] = cookie_info;
				resolve({"result" : rtn_arr, "paramMap" : paramMap });
				ngmf.alert("URL:" + blobURL + "\nParam::" + cookie_info);
			} else {
				ngmf._setCookie("FileParam", cookie_info);
				//파일 다운 처리
				var xHr = null, _progressFunc= null ;
				if(typeof progressFunc != 'undefined') {
					_progressFunc = ngmf._getCallBackFunction(progressFunc);
				}

				//For IE >= 10 , Chrome .. etc...
				if (typeof window.navigator.msSaveBlob == "function" || WebSquare.core.getXMLHTTPObject() ) {
					xHr = WebSquare.core.getXMLHTTPObject();
						//프로그레스 처리
						if(_progressFunc) {
							xHr.onprogress = function(_progress) {
								try {
									if (xHr.status != 200){
										_progressFunc(xHr.status*(-1),paramMap);
									} else {
										if (_progress.total == 0) _progressFunc(100, paramMap);
										else  _progressFunc( Math.floor( 100 * _progress.loaded /_progress.total ), paramMap);
									}
								} catch(ex) {
									ngmf._error("[ngmf.promise._fileRead onprogress] Exception :: ", ex);
								}
							};
						}

						xHr.onerror = function(_progress) {
							rtn_arr[1] = "SERVER ERROR status::"+ xHr.status +"  readyState::"+ xHr.readyState;
							ngmf._error("[ngmf.promise._fileRead  xHr.onerror] xHr.readyState :: " + xHr.readyState + " ERROR:" + _progress );
		 					//오류처리
							resolve({"result" : rtn_arr, "paramMap" : paramMap });
						};

						//결과 처리
						xHr.onreadystatechange = function(rqPgrsEv) {
							if (xHr.readyState == xHr.DONE ){
								var issaveok = false;
								var result_arr = rtn_arr;

								try {  
									if ( xHr.status == 200 && xHr.response && xHr.response.size > 0 ){
										if (typeof window.navigator.msSaveBlob == "function") {
											//IE 파일저장...
											window.navigator.msSaveBlob(xHr.response, fileName || 'UnKnownFile.core');
										} else {
											//기타 파일저장...
											var save = document.createElement('a');
											save.href = URL.createObjectURL(xHr.response) ;
											save.target = '_blank';
											save.download = fileName || 'UnKnownFile.core';

											var event = document.createEvent('Event');
											event.initEvent('click', true, true);
											save.dispatchEvent(event);
											(window.URL || window.webkitURL).revokeObjectURL(save.href);
										}
										issaveok = true;
									} else {
										result_arr[0] = "N"; 
										result_arr[1] = "파일을 찾을 수 없습니다.["+ xHr.status+"]";
									}
									try {
										var sFileParam = xHr.getResponseHeader("X-File-Name");
										if (sFileParam) {
											result_arr[0] = ngmf.left(sFileParam, 4);
											if ( result_arr[0] == "SUCC") result_arr[0] = "Y";
											else result_arr[0] = "N";
											result_arr[1] = ngmf.right(sFileParam, ngmf.length(sFileParam) - 6);
										} else {
											if (issaveok)  result_arr[0] = "Y";
										}
									} catch (e) {
										if (issaveok)  result_arr[0] = "Y";
									}
									//완료처리
									if (issaveok) resolve({"result" : result_arr, "paramMap" : paramMap });
									else resolve({"result" : result_arr, "paramMap" : paramMap });
								} catch(ex) {
									result_arr[0] = "N";
									result_arr[1] = ex.message;
									ngmf._error("[ngmf.newFileRead ] Exception :: ", ex);
									//오류처리
									resolve({"result" : result_arr, "paramMap" : paramMap });
								} finally {
									if (xHr) {
										xHr.abort();
										xHr = null;
									}
								}
							} 
						};
						xHr.open ("GET", blobURL, true); // true : Async  false : Sync
						xHr.setRequestHeader("X-File-Name",cookie_info );
						xHr.withCredentials = true;  // For CORS
						xHr.responseType = "blob";
						xHr.send();
 				} else {
 					//오류처리
 					rtn_arr[0] = "N";
 					rtn_arr[1] = "지원하지 않는 브라우저 입니다.";
 					resolve({"result" : rtn_arr, "paramMap" : paramMap });
				}
			}	
		} catch(e) {
			rtn_arr[0] = "N";
			if (e["message"]) rtn_arr[1] = e.message; else rtn_arr[1] = e ;
			ngmf._error("[ngmf.promise._fileRead] Exception :: ", e);
			//오류처리
			resolve({"result" : rtn_arr, "paramMap" : paramMap });
		}
	});
};

/**
 * 파일업로드 (Promise)
 * @date 2016.02.25
 * @memberOf ngmf
 * @param {Object} fileObj :: I :: N ::  :: 업로드할 파일 객체
 * @param {Object} paramMap :: I :: N ::  :: UPLOAD 시 필요한 파라미터
 * @param {String / Json} progressFunc :: I :: Y ::  :: 업로드 프로그래스 처리용 CALLBACK FUNCTION
 * @param {String} chkacl :: I :: Y ::  ::  01=게시판 암호화, 1X=Batch import
 * @param {String} remoteUrl :: I :: Y ::  :: 파일업로드 서블릿 호출 url(현재 접속 url 정보)-모바일인 경우만 사용
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile use
 * @example
 */
ngmf.promise._fileWrite = function (fileObj, paramMap, progressFunc, chkAcl, remoteUrl){
	return new Promise(function(resolve, reject) {
		var rtn_arr = new Array(), file_size = -1;
		try {
			rtn_arr[0] = "N";
			if (!fileObj) throw "선택된 파일 객체가 없습니다.";
			if (typeof fileObj == "string") {
				fileObj = ngmf.object(fileObj);
			}
			if (fileObj) {
				if (typeof  fileObj.getPluginName != "undefined" && fileObj.getPluginName().toLowerCase() == "upload" ) {
					fileObj = document.getElementById(fileObj.getID()+ "_fakeinput").files[0];
				} else if (typeof  fileObj.type != "undefined" && fileObj.type == "file" ) {
					fileObj = fileObj.files[0];
				}
			} else throw "선택된 파일 객체가 없습니다.";
			
			if (!fileObj ) {
				throw "선택된 파일 객체가 없습니다.";
			}
			if (typeof paramMap == 'undefined' || ngmf.length(paramMap["userId"]) < 1) {
				throw "사용자 정보가 없습니다.";
			}
			var _progressFunc = null;
			if(typeof progressFunc != 'undefined') {
				_progressFunc = ngmf._getCallBackFunction(progressFunc);
			}
			var cookieval = paramMap["userId"] ;
			
			if (typeof chkAcl != "undefined" && chkAcl) cookieval +=  "||" + escape(fileObj.name);
				
			rtn_arr[1] = "UnKnown ERROR!!";
			rtn_arr[2] = file_size = fileObj.size;
			var uploadSvlt = "NGMFileUpload";
			
			if (typeof chkAcl !=  "undefined" && chkAcl) {
				uploadSvlt = "NGMUploadAclCheck";
			} 
			
			var sendok = false;
			var strPort = ngmf.getServerUrl("FILE");
			var strServer = strPort[0]
					+ ngmf.decode(ngmf.length(strPort[1]), 0, "", ":" + strPort[1])
					+ "/" + strPort[2];

			remote_url = strServer + uploadSvlt + "?fCloseAccount=0";
			ngmf._setCookie("FileParam", cookieval);

			//TODO 테스트를 위해.... 삭제필요
			if(ngmf.isMobile()) {
				var serverUrl = GLV.G_MOBILECONNURL;
				
				if ( typeof remoteUrl != "undefined" && remoteUrl !=  null && remoteUrl != "") {
					serverUrl = remoteUrl;
				}
				
				remote_url = serverUrl + "/" + uploadSvlt + "?fCloseAccount=0";
			} else {
				var L = location.toString();			
				if (L.indexOf("websquare.html") > -1)
					remote_url = location.toString().split("?")[0].replace("websquare.html",uploadSvlt) + "?fCloseAccount=0";
				else if (L.indexOf("popup.html") > -1)
					remote_url = location.toString().split("?")[0].replace("popup.html",uploadSvlt) + "?fCloseAccount=0";	
			}

			//파일 업로드 처리
			var xHr = WebSquare.core.getXMLHTTPObject() ;
			if (xHr) {
				//프로그래스 처리...
				if (_progressFunc) {
					xHr.upload.onprogress = function(_progress) {
						try {
							if (_progress.total == 0) _progressFunc(100, paramMap);
							else  _progressFunc( Math.floor( 100 * _progress.loaded /_progress.total ), paramMap);
						} catch(ex) {
							ngmf._error("[ngmf.promise._fileWrite xHr.upload.onprogress] Exception :: ", ex);
						}
					};
				}

				//전송오류 처리...
				xHr.upload.onerror = function(_progress) {
					rtn_arr[0] = "N";
					rtn_arr[1] = "SERVER ERROR status::"+ xHr.status + "  readyState::"+ xHr.readyState;
					ngmf._error("[ngmf.promise._fileWrite xHr.upload.onerror] xHr.readyState :: " + xHr.readyState + " ERROR:" + _progress );
 					//오류처리
					reject({"result" : rtn_arr, "paramMap" : paramMap });
					return;
				};
				xHr.onerror = function(_progress) {
					rtn_arr[0] = "N";
					rtn_arr[1] = "SERVER ERROR status::"+ xHr.status +"  readyState::"+ xHr.readyState;
					ngmf._error("[ngmf.promise._fileWrite xHr.upload.onerror] xHr.readyState :: " + xHr.readyState + " ERROR:" + _progress );
 					//오류처리
					reject({"result" : rtn_arr, "paramMap" : paramMap });
					return;
				};

				//FILEUPLOAD 결과 확인...
				xHr.onreadystatechange = function(rqPgrsEv) {
					if (xHr.readyState == xHr.DONE ){
						var result_arr = new Array();;
						result_arr[0] = "N";
						result_arr[2] = file_size;
						try {
							if ( xHr.status == 200 ){
								if ( xHr.response ) {
									// 결과 파싱~~~~
									var sFileParam = xHr.response;
									if (sFileParam && sFileParam != "" && sFileParam.indexOf("::") > -1) {
										result_arr[0] = ngmf.left(sFileParam, 4);
										result_arr[1] = ngmf.right(sFileParam, ngmf.length(sFileParam) - 6);
										if ((result_arr[0] == "SUCC" || result_arr[0] == "Y") && result_arr[1]) {
											result_arr[0] = "Y";
											//저장 후처리....
											if(paramMap) {
												if (paramMap["ds_file"] && typeof paramMap["rowIdx"] != "undefined" && paramMap["rowIdx"] > -1) {
													paramMap["ds_file"].setCellData( paramMap["rowIdx"],"savePathNm", result_arr[1] );
												}
											}
										} else {
											result_arr[0] = "N"; 
										}
									}

								} else {
									result_arr[0] = "N";
									result_arr[1] = "UPLOAD 실패 : 결과 없음";
								}
							} else {
								result_arr[1] = "SERVER ERROR status::" + xHr.status;
							}

						} catch(ex) {
							result_arr[1] = ex.message;
							ngmf._error("[ngmf.promise._fileWrite xHr.onreadystatechange ] Exception :: ", ex);
						} finally {
							if (xHr) {
								xHr.abort();
								xHr = null;
							}
						}
						//완료처리
						if (result_arr[0] == "Y")
							resolve({"result" : result_arr, "paramMap" : paramMap });
						else {
							reject(result_arr[1]); 
						}
							//resolve({"result" : result_arr, "paramMap" : paramMap });
					}
				};
				if(ngmf.isMobile()) {
					var oFReader = new window.FileReader();
					oFReader.onload = function (evt) {
						xHr.open ("POST", remote_url , true); // false : sync , true : async
						xHr.withCredentials = true; // For CORS 
						xHr.setRequestHeader("X-File-Name",cookieval);
						if (typeof chkAcl != "undefined" && chkAcl)
							xHr.setRequestHeader("EncType",chkAcl);
						
						xHr.send(evt.target.result); 
					};
					oFReader.onerror = function (e) {
						reject(e); 
					};
					oFReader.readAsArrayBuffer(fileObj);
					sendok = true;
				} else { 
					xHr.open ("POST", remote_url , true); // false : sync , true : async
					xHr.withCredentials = true; // For CORS 
					xHr.setRequestHeader("X-File-Name",cookieval);
					if (typeof chkAcl != "undefined" && chkAcl)
						xHr.setRequestHeader("EncType",chkAcl); 
					xHr.send(fileObj); 
					sendok = true;
				} 
			} else {
				throw new Error("지원하지 않는 브라우저 입니다!!!!!");
			}
			//결과 리턴
			if (!sendok) {
				throw new Error("UPLOAD CALL FAIL!!!!!");
			}
		} catch (e) {
			rtn_arr[0] = "N";
			if (e["message"]) rtn_arr[1] = e.message; else rtn_arr[1] = e ;
			ngmf._error("[ngmf.promise._fileWrite] Exception :: ", e);
			//오류처리
			reject(rtn_arr[1]); 
		}
	});
};

/**
 * 단일 파일 다운로드(promise)
 * @date 2016.02.25
 * @memberOf ngmf
 * @param {String} atfilId :: I :: N ::  :: 파일 대상파일ID
 * @param {String} localUrl :: I :: N ::  :: 파일 저장할 파일명
 * @param {Boolean} eFlag :: I :: Y ::  :: 0 : 메시지 popup
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile useless
 * @example
				ngmf.promise.downloadSingleFile(inpAtfilId.getValue(), null, 1, null)
				.then( function (retObj) {
					if (retObj[0] == "Y") {
						// TODO. 저장 후 처리 프로세서 진행
						ngmf.alert("DOWNLOAD 성공");
					} else {
						ngmf.alert("DOWNLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
					}
				}) 
				.then( undefined, function (retObj) {
					if (retObj["message"]) {
						ngmf.alert("DOWNLOAD 실패 :::::" + retObj["message"] );
					} else ngmf.alert("DOWNLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
				});
 */
ngmf.promise.downloadSingleFile = function(atfilId, localUrl, eFlag, progressFunc) {
	return new Promise(function(resolve, reject) {
		var sRtnVal = new Array();
		try{
			// 입력값 체크
			if (ngmf.isNull(atfilId) == "Y") {
				throw new Error(ngmf.getMessage("ZNGMC0062"));
			} 
			var sSerVal = ngmf.getFileList(atfilId, null, 1);
			var filesize = null;
			var filepath = null;
			var fileName = null;
			if (sSerVal[0] == "Y") {
				filesize = GLD.GDS_OUTDUMMY.getCellData(0, "atfil_size");
				filepath = ngmf.urlDecode(GLD.GDS_OUTDUMMY.getCellData(0, "save_path_nm"));
				fileName = localUrl || ngmf._getDownloadFileName(GLD.GDS_OUTDUMMY.getCellData(0, "atfil_nm"), filepath);
			}

			if (ngmf.isNull(filepath) == "Y" || ngmf.isNull(filesize) == "Y") {
				throw new Error(ngmf.getMessage("ZNGMC0065"));
			} else {
				// 파일 다운로드 서비스 호출
				ngmf.promise._fileRead(fileName, filepath, null , progressFunc).then( function (retObj) {
					//{"result" : rtn_arr, "paramMap" : paramMap }
					// 파일 서비스 에러 체크
					if (retObj.result[0] == "N") {
						if (eFlag) {
							sRtnVal = new Array();
							sRtnVal[0] = "N";
							sRtnVal[1] = retObj.result[1];
						} else {
							sRtnVal = "N";
							var strMsg = retObj.result[1];
							if (strMsg && strMsg.length > 0)
								ngmf.alert(strMsg);
						}
					} else if (retObj.result[0] == "Y") {
						if (eFlag) {
							sRtnVal = new Array();
							sRtnVal[0] = "Y";
							sRtnVal[1] = "완료되었습니다.";
						} else {
							sRtnVal = "Y";
						}
					}
					resolve(sRtnVal); 
				});
			}
		} catch (e) {
			ngmf._error("[ngmf.promise.downloadSingleFile ] Exception :: ", e);
			if (!eFlag) sRtnVal = "N";
			else {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = e["message"] || e;
			}
			resolve(sRtnVal); 
		} 
	});  
};

/**
 * 다중 파일 다운로드(Promise)
 * @date 2015. 11. 17.
 * @memberOf ngmf
 * @param {String / Json} ds_file :: I :: N ::  :: 파일 Datalist
 * @param {Boolean} eFlag :: I :: Y ::  :: 0 : 메시지 popup
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile useless
 * @example * 
 * 	  ngmf.promise.downloadMultiFile(dsl_down, 1).then(
 *      function(retObj) {
 *      //resolve 처리
 *      	if (retObj[0] == "Y") {
 *      		//처리성공
 *      	} else {
 *      		ngmf.alert("멀티 파일 다운로드 실패::" + ngmf.getErrMessage(retObj[1]) );
 *      	}
 *      },function(retObj) {
 *       //reject 처리
 *      	ngmf.alert("멀티 파일다운로드 실패::" + ngmf.getErrMessage(retObj[1]) );
 *      });
 */
ngmf.promise.downloadMultiFile = function(_ds_file, eFlag, progressFunc) {
	return new Promise(function(resolve, reject) {
		var sRtnVal = new Array();
		try{
			
			var chkCnt;
			var ds_file = ngmf.object(_ds_file);

			if (typeof ds_file != "object" || ds_file.getObjectType() != "dataList") {
				throw new Error(ngmf.getMessage("ZNGMC0062"));
			} else {
				// 다운로드 선택을 체크
				var aPos = ngmf._getCheckedIndex(ds_file);
				chkCnt = aPos.length;
				if (chkCnt == 0) {
					throw new Error(ngmf.getMessage("ZNGMC0065"));
				}   
				// 선택된 파일이 있을 경우
				var promiseArr = new Array();
				if(ngmf.isMobile() && aPos.length > 1) { 
					throw new Error("모바일은 한개의 파일만 선택 가능합니다..");
				}
				for ( var i = 0; i < aPos.length ; i++) { 
					var ix = aPos[i];
					var savePathNm = ds_file.getCellData(ix, "savePathNm");
					var filename = ngmf._getDownloadFileName(ds_file.getCellData(ix, "file"));
					
					promiseArr.push(ngmf.promise._fileRead(filename, savePathNm, {rowIdx:ix, ds_file:ds_file} , progressFunc));
					
				} // Loop 종료

				if (promiseArr.length > 0) {
					Promise.all(promiseArr)
					.then( function(retObjArr) {  
						//전체 성공시만 이쪽으로 빠짐
							// [{"result" : rtn_arr, "paramMap" : paramMap} , {"result" : rtn_arr, "paramMap" : paramMap} , ... ]						
							// 결과 전송 처리 로직 삽입
						if (eFlag) {
							sRtnVal = new Array();
							sRtnVal[0] = "Y";
							sRtnVal[1] = "ZNGMC0071";;
						} else {
							sRtnVal = "Y";
						}
						resolve(sRtnVal);
					})
					.then(undefined, function(retObj) {
						//한건이라도 실패 발생하면....
						if (retObj["result"]) { 
							if (eFlag) {
								sRtnVal = new Array();
								sRtnVal[0] = "N";
								sRtnVal[1] = retObj["result"][1];
							} else {
								sRtnVal = "N";
								var strMsg = retObj["result"][1];
								if (strMsg && strMsg.length > 0) ngmf.alert(strMsg);
							}
						} else { 
							if (eFlag) {
								sRtnVal = new Array();
								sRtnVal[0] = "N";
								sRtnVal[1] = retObj.mesage;
							} else {
								sRtnVal = "N";
								ngmf.alert(retObj.mesage);
							}
						} 
						//확실히 하기위해
						resolve(sRtnVal);
					});
				}  else {				
					throw new Error(ngmf.getMessage("ZNGMC0065"));
				}
			} // IF 종료
		} catch (e) {
			ngmf._error("[ngmf.promise.downloadMultiFile ] Exception :: ", e);
			if (!eFlag) sRtnVal = "N";
			else {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = e["message"] || e;
			}
			resolve(sRtnVal); 
		} 
	});
}; 

/**
 * SINGLE 파일 업로드 (Promise)
 * @date 2016.02.25
 * @memberOf ngmf
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판, 1 : 암호화 게시판
 * @param {String / Json} uploadCompId :: I :: N ::  :: 파일 컴포넌트
 * @param {String} expDate :: I :: N ::  :: 유효일자 '0' : 영구, '1' : 3년
 * @param {Boolean} eFlag :: I :: Y ::  :: 1 : 메시지 팝업(X)
 * @param {String} screenNM :: I :: Y ::  :: 화면명 (input 으로 사용)
 * @param {String} atfilTitleNm :: I :: Y ::  :: Title (input 으로 사용)
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @param {Boolean} chkAcl :: I :: Y ::  :: 암호화 해제여부
 * @param {String} remoteUrl :: I :: Y ::  :: 파일업로드 서블릿 호출 url(현재 접속 url 정보)-모바일인 경우만 사용
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile use
 * @example
			ngmf.promise.encUploadSingleFile(enc, file0, "1", 1, ngmf._getScreenName(), null, null, chk_Acl.getValue())
			.then( function (retObj) { 
				if (retObj[0] == "Y") {
					// TODO. 저장 후 처리 프로세서 진행							
					if (retObj[1]) {
						inpAtfilId.setValue(retObj[1]);
						scwin.btnSearchFile0_onclick();							
					}
					ngmf.alert("UPLOAD 성공");
				} else {
					ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
				}
			}) 
			.then( undefined, function (retObj) {
				if (retObj["message"]) {
					ngmf.alert("UPLOAD 실패 :::::" + retObj["message"] );
				} else ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
			});
			
			ngmf.promise.encUploadSingleFile(1, BlobObj, "1", 1, ngmf.getFormID(), "sample.xls")
			.then( function (retObj) {
				if (retObj[0] == "Y") {
					ngmf.alert("UPLOAD 성공");
				} else {
					ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
				}
			}) 
			.then( undefined, function (retObj) {
				if (retObj["message"]) {
					ngmf.alert("UPLOAD 실패 :::::" + retObj["message"] );
				} else ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
			});
 */
ngmf.promise.encUploadSingleFile = function(_enc, uploadCompId, expDate, eFlag, screenNM, atfilTitleNm, progressFunc, chkAcl, remoteUrl) {
	return new Promise(function(resolve, reject) {
		var sRtnVal = new Array();
		try{
			var uploadComp = null;
			var fileObj = null;
			var enc = Number(_enc);
			if (isNaN(enc)) enc = 1;
			
			//00: 게시판, 비암호화 되어 저장
			//01 : 게시판, 암호화 되어 저장
			//1x: 배치인 경우 무조건 암호화 되어 저장 
			
			if (typeof chkAcl == "undefined" || chkAcl == null) {
				if (enc ==1) chkAcl = "01";
				if (enc ==2) chkAcl = "10";
			} 
			if (typeof uploadCompId != "object" )
				uploadComp = ngmf.object(uploadCompId);
			else uploadComp = uploadCompId;
			if(uploadComp){
				if (typeof uploadComp.getPluginName == "undefined"){
					fileObj = uploadComp;
				} else if (uploadComp.getPluginName() == "upload") {
					fileObj = document.getElementById(uploadComp.getID()+"_fakeinput").files[0];
				}
			}
			if (!fileObj) {
				throw new Error(ngmf.getMessage("ZNGMC0065"));
			}
			ngmf.promise._encUploadSingleFileNew(enc, fileObj, expDate, eFlag, screenNM, atfilTitleNm, progressFunc, chkAcl, remoteUrl).then( function(retVal) {
				resolve(retVal); 
			}) ;
		} catch (e) {
			ngmf._error("[ngmf.promise.encUploadSingleFile ] Exception :: ", e);
			if (!eFlag) sRtnVal = "N";
			else {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = e["message"] || e;
			}
			resolve(sRtnVal); 
		} 
	});
};
ngmf._getSavePathFname = function (path) {
	try {
		if (path) path.substr(path.lastIndexOf("/")+1);
	} catch(ex) {
		ngmf._error("[ngmf._getSavePathFname] Exception :: ", ex);
	}
};
/**
 * 암호화된 다중 파일 파일 업로드(Promise)
 * @date 2016.02.25
 * @memberOf ngmf
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판, 1 : 암호화 게시판
 * @param {String / Json} fileListId :: I :: N ::  :: upload 파일 컴포넌트 또는 file 배열 ID
 * @param {String / Json} ds_file :: I :: N ::  :: 업로드 대상 Data Set
 * @param {String} expDate :: I :: N ::  :: 유효일자 '0' : 영구, '1' : 3년
 * @param {String} eFlag :: I :: Y ::  :: 1 : 메시지 팝업(X)
 * @param {String} screenNM :: I :: Y ::  :: 화면명 (input 으로 사용)
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @param {Boolean} chkAcl :: I :: Y ::  :: 암호화 해제여부
 * @param {Boolean} notSetDs :: I :: Y :: false :: 결과를 DATA SET 에 저장하지 않음
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile useless
 * @example
			ngmf.promise.encUploadMultiFile (0, fileM, ds_file,  "1", 1, ngmf._getScreenName() )
		   .then( function (retObj) { 
				if (retObj[0] == "Y") {
					// TODO. 저장 후 처리 프로세서 진행
					if (retObj[1]) {
						inpAtfilIdM.setValue(retObj[1]);
						scwin.btnSearchFileM_onclick();							
					} 
				} else {
					ngmf.alert("MULTIUPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
				}
			}) 
			.then( undefined, function (retObj) {
				if (retObj["message"]) {
					ngmf.alert("MULTIUPLOAD 실패 :::::" + retObj["message"] );
				} else ngmf.alert("MULTIUPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
			});
 */
ngmf.promise.encUploadMultiFile = function(_enc, _fileListId, ds_file, expDate, eFlag, screenNM, progressFunc, chkAcl, notSetDs) {
	return new Promise(function(resolve, reject) {
		var sRtnVal = new Array();
		try{
			var sChk = new Array();
			var chkExpDate = new Array();
			var realCnt = -1 ;
			var userId = ngmf.getGlobalValue("g_Ngms_UserId");
			var fileListId = null, fileList= null ;
			
			var enc = 0;
			if (!isNaN(Number(_enc))) enc = Number(_enc);
			
			if (typeof chkAcl == "undefined" || chkAcl == null) {
				chkAcl = "01";
			} 
			
			var uploadComp = null;
			if (typeof _fileListId == "string") {
				uploadComp = ngmf.object(_fileListId);
				fileListId = uploadComp.getID() + "_files";
			} else if ( ngmf.isArray(_fileListId)) {
				fileList = _fileListId;
			}  else {
				uploadComp = _fileListId;
				fileListId = uploadComp.getID() + "_files";
			}
			if (fileListId) {
				fileList = scvar[fileListId];
			}
			if (!fileList) {
				throw new Error(ngmf.getMessage("ZNGMC0065"));
			}
			ds_file = ngmf.object(ds_file);
			// 유효일자 조회
			chkExpDate = ngmf.checkExpireDate(expDate);
			// 선택된 파일이 없을 때는 서비스를 호출하지 않는다.
			var iIdx = ngmf._getCheckedIndex(ds_file);
			if (iIdx.length == 0) {
				throw new Error("선택된 파일이 없습니다.");
			}
	 
			// 입력값 초기 설정값 검사
			sChk = ngmf.checkUploadMultiFile(ds_file); 
			// 최초 데이터 정합성 검토
			if (ngmf.isNull(sChk[0]) == "Y" || ngmf.isNull(expDate) == "Y") {
				throw new Error(ngmf.getMessage("ZNGMC0062"));
			} else if (sChk[0] == "N") {
				throw new Error(sChk[1]);
			} else if (sChk[0] == "Y" && chkExpDate[0] == "Y") {
				
				//2016.09.02 선택된 파일만 확인 하도록 수정
				var chkFileList  = new Array();
				for ( var i = 0; i < iIdx.length ; i++) {
					var ix = iIdx[i];
					var filename = ngmf.getFileName(ds_file.getCellData(ix, "file"));
					if (fileList[ngmf._getTargetFileIndex(fileList, filename)]) chkFileList.push(fileList[ngmf._getTargetFileIndex(fileList, filename)]);
				}
				ngmf.promise._multiFileAclCheck(chkFileList, enc)
				.then(function (rtnVal) {
					 if ( rtnVal == "N" ) {
							sRtnVal[0] = "N";
							sRtnVal[1] = "권한이 맞지 않는 파일이 있습니다"; 
							if (!eFlag)  sRtnVal = "N";
							resolve(sRtnVal);
							return sRtnVal;
					 }

					// 멀티 처리를 위한 초기화
					var chkDel;
					realCnt = ngmf.getRealFileCount(ds_file);
					
					scvar.mimeTypeMap = {};
					var promiseArr = new Array();
					for ( var i = 0; i < iIdx.length ; i++) {
						var ix = iIdx[i];
						var filename = ngmf.getFileName(ds_file.getCellData(ix, "file"));
						var mimeType = ngmf.chkMimeType(filename);
						var trxCode = ds_file.getCellData(ix, "trxCode") || "i";

						if (0 == enc || 2 == enc  ) { // 비암호화 게시판의 경우, 서버에서 파일 암호화하지 않음 
							mimeType = "NON" + mimeType;
							if (0 == enc) chkAcl = "00";
							else chkAcl = "10";
						}
	 
						scvar.mimeTypeMap[ix] = mimeType;
						var paramMap = {
								userId : userId,
								filename : filename,
								mimeType : mimeType,
								screenNM : screenNM,
								ds_file : ds_file,
								rowIdx : ix
							};

						chkDel =  ngmf.toNumber(ds_file.getCellData(ix, "del") || "0") ;

					    if (trxCode == "u" && (chkDel == 1 || chkDel == "1")) { // DELETE 일때
							paramMap["trxCode"] = "d";
					    	trxCode = "d";
						}
						// DELETE 를 제외한 INSERT/UPDATE 는 파일을 업로드
						if (trxCode != "d") {
							if (ngmf._getTargetFileIndex(fileList, filename) > -1){
								promiseArr.push(ngmf.promise._fileWrite(fileList[ngmf._getTargetFileIndex(fileList, filename)], paramMap , progressFunc, chkAcl));
							} else { 
								ds_file.removeRow(ix , {noEvent:true});
								sRtnVal[0] = "N";
								sRtnVal[1] = "파일 [" + filename+ "]를 선택하세요."; 
								if (!eFlag)  sRtnVal = "N";
								resolve(sRtnVal);
								return sRtnVal;
							}
						}
					} // loop 종료

					if (promiseArr.length > 0) {
						WebSquare.layer.showProcessMessage(ngmf.getMessage("ZCOMC0018","&OBJECT","멀티파일 파일업로드","&PROC","총 "+realCnt+"건","&ACTION","업로드"));
						Promise.all(promiseArr)
						.then( function(retObjArr) {
							WebSquare.layer.hideProcessMessage();
							//전체 성공시만 이쪽으로 빠짐
								// [{"result" : rtn_arr, "paramMap" : paramMap} , {"result" : rtn_arr, "paramMap" : paramMap} , ... ]						
								// 결과 전송 처리 로직 삽입
								var TrxCode = "ZNGMSFIL13110_TR01";
								var ScreenName = ngmf._getScreenName() || "ZNGMSFIL13110";
								var OutDataList = "GLD.GDS_OUTDUMMY";  //
								if (iIdx || iIdx.length > 0) {
									ngmf.clear(GLD.GDS_INDUMMY1);
									GLD.GDS_INDUMMY1.insertColumn("atfil_id", { name:	"atfil_id" , dataType:	"text" });
									GLD.GDS_INDUMMY1.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
									GLD.GDS_INDUMMY1.insertColumn("atfil_title_nm", { name:	"atfil_title_nm" , dataType:	"text" });
									GLD.GDS_INDUMMY1.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
									GLD.GDS_INDUMMY1.insertColumn("screen_nm", { name:	"screen_nm" , dataType:	"text" });

									GLD.GDS_INDUMMY1.insertRow();
									GLD.GDS_INDUMMY1.setCellData(0, "atfil_id", ds_file.getCellData(0, "atfilId"));
									GLD.GDS_INDUMMY1.setCellData(0, "atfil_ser_num", "");
									GLD.GDS_INDUMMY1.setCellData(0, "atfil_title_nm", "");
									if (ds_file.getCellData(0, "atfilId")) 
										GLD.GDS_INDUMMY1.setCellData(0, "trx_cd", "u");
									else 
										GLD.GDS_INDUMMY1.setCellData(0, "trx_cd", "i");
									GLD.GDS_INDUMMY1.setCellData(0, "screen_nm", screenNM||ngmf._getScreenName());

									
									ngmf.clear(GLD.GDS_INDUMMY2);
									GLD.GDS_INDUMMY2.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
									GLD.GDS_INDUMMY2.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
									GLD.GDS_INDUMMY2.insertColumn("expir_dt", { name:	"expir_dt" , dataType:	"text" });
									GLD.GDS_INDUMMY2.insertColumn("atfil_nm", { name:	"atfil_nm" , dataType:	"text" });
									GLD.GDS_INDUMMY2.insertColumn("save_path_nm", { name:	"save_path_nm" , dataType:	"text" });
									GLD.GDS_INDUMMY2.insertColumn("atfil_size", { name:	"atfil_size" , dataType:	"text" });
									GLD.GDS_INDUMMY2.insertColumn("mime_type_info", { name:	"mime_type_info" , dataType:	"text" });
									
									var insIdx = -1;
									for (var ix = 0; ix < iIdx.length; ix++) {
										if (ds_file.getCellData(iIdx[ix], "savePathNm")) {
											insIdx = GLD.GDS_INDUMMY2.insertRow();
											if (ds_file.getCellData(iIdx[ix], "trxCode") == "u" && Number(ds_file.getCellData(iIdx[ix], "del"))  == 1 )
												GLD.GDS_INDUMMY2.setCellData(insIdx, "trx_cd", "d");
											else {
												if (ds_file.getCellData(0, "atfilId"))  GLD.GDS_INDUMMY2.setCellData(insIdx, "trx_cd", "u");
												else GLD.GDS_INDUMMY2.setCellData(insIdx, "trx_cd", ds_file.getCellData(iIdx[ix], "trxCode"));
											}

											GLD.GDS_INDUMMY2.setCellData(insIdx, "atfil_ser_num", ds_file.getCellData(iIdx[ix], "atfilSerNum"));
											GLD.GDS_INDUMMY2.setCellData(insIdx, "expir_dt", chkExpDate[1]);
											GLD.GDS_INDUMMY2.setCellData(insIdx, "atfil_nm", ds_file.getCellData(iIdx[ix], "file"));
											GLD.GDS_INDUMMY2.setCellData(insIdx, "save_path_nm", ds_file.getCellData(iIdx[ix], "savePathNm"));
											GLD.GDS_INDUMMY2.setCellData(insIdx, "atfil_size", ds_file.getCellData(iIdx[ix], "size"));
											GLD.GDS_INDUMMY2.setCellData(insIdx, "mime_type_info", scvar.mimeTypeMap[iIdx[ix]]);									
										}
									} //END for
									
									ngmf.clear(GLD.GDS_OUTDUMMY);
									
									// 파일 업로드 온라인 서비스 프로그램을 호출
									ngmf._fileSyncTransaction(TrxCode, ScreenName, "", [GLD.GDS_INDUMMY1,GLD.GDS_INDUMMY2], OutDataList, ""); 
									// 파일 업로드 온라인 서비스 에러 체크
									if(Number(ngmv.errorCode[0]) == 0){  
										if (typeof notSetDs == "undefined" || !notSetDs) {
											//if (GDS_OUTDUMMY.getCellData(0, "save_path_nm")) ds_file.setCellData(iIdx[0] , "savePathNm",  GLD.GDS_OUTDUMMY.getCellData(0, "save_path_nm") );
											for (var ix = 0; ix < iIdx.length; ix++) {
												ds_file.setCellData(iIdx[ix] , "atfilId",  GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id") );
												ds_file.setCellData(iIdx[ix] , "trxCode",  "u" );
												ds_file.setCellData(iIdx[ix] , "chk",  "0" );
											} //END for
											
											for (var i = (fileList.length-1) ; i >-1; i--) delete fileList.splice(i,1);	
										}
										
										sRtnVal[0] = "Y";
										sRtnVal[1] = GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id");
										sRtnVal[2] = ngmf.getGlobalValue("g_Ngms_UserId");
										if (!eFlag) sRtnVal =  "Y" ;
									} else {
										sRtnVal[0] = "N";
										sRtnVal[1] = "업로드 실패";
										if (!eFlag) sRtnVal =  "N" ;
									}
								}
								resolve(sRtnVal);
								return sRtnVal;
						})
						.then(undefined, function(e) {
							//한건이라도 실패 발생하면....
							WebSquare.layer.hideProcessMessage(); 
							sRtnVal[0] = "N";
							sRtnVal[1] = e["message"] || e ;
							if (!eFlag) sRtnVal =  "N" ;
							resolve(sRtnVal);
							return sRtnVal;
						});
					} else {
						if (iIdx || iIdx.length > 0) {
							var TrxCode = "ZNGMSFIL13110_TR01";
							var ScreenName = ngmf._getScreenName() || "ZNGMSFIL13110";
							var OutDataList = "GLD.GDS_OUTDUMMY";  //
							
							ngmf.clear(GLD.GDS_INDUMMY1);
							GLD.GDS_INDUMMY1.insertColumn("atfil_id", { name:	"atfil_id" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("atfil_title_nm", { name:	"atfil_title_nm" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("screen_nm", { name:	"screen_nm" , dataType:	"text" });

							GLD.GDS_INDUMMY1.insertRow();
							GLD.GDS_INDUMMY1.setCellData(0, "atfil_id", ds_file.getCellData(0, "atfilId"));
							GLD.GDS_INDUMMY1.setCellData(0, "atfil_ser_num", "");
							GLD.GDS_INDUMMY1.setCellData(0, "atfil_title_nm", "");
							GLD.GDS_INDUMMY1.setCellData(0, "trx_cd", ds_file.getCellData(0, "trxCode"));
							GLD.GDS_INDUMMY1.setCellData(0, "screen_nm", screenNM||ngmf._getScreenName());

							
							ngmf.clear(GLD.GDS_INDUMMY2);
							GLD.GDS_INDUMMY2.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("expir_dt", { name:	"expir_dt" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("atfil_nm", { name:	"atfil_nm" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("save_path_nm", { name:	"save_path_nm" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("atfil_size", { name:	"atfil_size" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("mime_type_info", { name:	"mime_type_info" , dataType:	"text" });
							
							var insIdx = -1;
							for (var ix = 0; ix < iIdx.length; ix++) {
								if (ds_file.getCellData(iIdx[ix], "savePathNm")) {
									insIdx = GLD.GDS_INDUMMY2.insertRow();;
									if (ds_file.getCellData(iIdx[ix], "trxCode") == "u" && ngmf.toNumber(ds_file.getCellData(iIdx[ix], "del") || "0")  == 1 )
										GLD.GDS_INDUMMY2.setCellData(insIdx, "trx_cd", "d"); 
									else GLD.GDS_INDUMMY2.setCellData(insIdx, "trx_cd", ds_file.getCellData(iIdx[ix], "trxCode"));								
								
									GLD.GDS_INDUMMY2.setCellData(insIdx, "atfil_ser_num", ds_file.getCellData(iIdx[ix], "atfilSerNum"));
									GLD.GDS_INDUMMY2.setCellData(insIdx, "expir_dt", chkExpDate[1]);
									GLD.GDS_INDUMMY2.setCellData(insIdx, "atfil_nm", ds_file.getCellData(iIdx[ix], "file"));
									GLD.GDS_INDUMMY2.setCellData(insIdx, "save_path_nm", ds_file.getCellData(iIdx[ix], "savePathNm"));
									GLD.GDS_INDUMMY2.setCellData(insIdx, "atfil_size", ds_file.getCellData(iIdx[ix], "size"));
									GLD.GDS_INDUMMY2.setCellData(insIdx, "mime_type_info", scvar.mimeTypeMap[iIdx[ix]]);									
								}
							} //END for
							
							ngmf.clear(GLD.GDS_OUTDUMMY);
							
							// 파일 업로드 온라인 서비스 프로그램을 호출
							ngmf._fileSyncTransaction(TrxCode, ScreenName, "", [GLD.GDS_INDUMMY1,GLD.GDS_INDUMMY2], OutDataList, ""); 
							// 파일 업로드 온라인 서비스 에러 체크
							if(Number(ngmv.errorCode[0]) == 0){  
								ds_file.setCellData(0 , "savePathNm",  GLD.GDS_OUTDUMMY.getCellData(0, "save_path_nm") );
								for(var j=0; j< ds_file.getRowCount(); j++) {
									ds_file.setCellData(j , "atfilId",  GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id") );
								} //END fo

								sRtnVal[0] = "Y";
								sRtnVal[1] = GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id");
								sRtnVal[2] = ngmf.getGlobalValue("g_Ngms_UserId");
								if (!eFlag) sRtnVal =  "Y" ;
							} else {
								sRtnVal[0] = "N";
								sRtnVal[1] = "업로드 실패";
								if (!eFlag) sRtnVal =  "N" ;
							}
							resolve(sRtnVal);
							return sRtnVal; 
						} else {
							resolve(sRtnVal);
							return sRtnVal ;
						}
					}
				})
				.then(undefined, function(e){
					ngmf._error("[ngmf.promise.encUploadMultiFile] Exception :: ", e);
					sRtnVal[0] = "N";
					sRtnVal[1] = e["message"] || e ;
					if (!eFlag) sRtnVal = "N";
					resolve(sRtnVal);
					return sRtnVal; 
				});		
			} 
		} catch (e) {
			ngmf._error("[ngmf.promise.encUploadMultiFile ] Exception :: ", e);
			if (!eFlag) sRtnVal = "N";
			else {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = e["message"] || e;
			}
			resolve(sRtnVal); 
		} 
	});
};

/**
 * 단일 파일에 대한 파일 삭제 서비스 호출(Promise)
 * @date 2016.02.25
 * @memberOf ngmf
 * @param {String} aftilId :: I :: N ::  :: 대상파일ID
 * @param {Number} eFlag :: I :: Y ::  :: 메시지 팝업 여부
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile useless
 * @example
 * 	     ngmf.promise.deleteSingleFile(inpAtfilIdM.getValue(), 1).then( function(retObj) {
 *      	if (retObj[0] == "Y") {
 *      		ngmf.alert("파일 삭제 성공");
 *      	} else {
 *      		ngmf.alert("파일 삭제 실패::" + ngmf.getErrMessage(retObj[1]) );
	 *      	}
 *      });
 *	
 */
 
ngmf.promise._deleteSingleFile = function(aftilId, eFlag) {
	return new Promise(function(resolve, reject) {
		var sRtnVal = new Array();
		try{
			var TrxCode = "ZNGMSFIL13110_TR01"; // Transaction Code
			var ScreenName =  ngmf._getScreenName() || "ZNGMSFIL13210"; // 화면명
			var OutDataList = "GLD.GDS_OUTDUMMY"; // Output Datasets
			// 입력값을 체크
			if (ngmf.isNull(aftilId) == "Y") {
				throw new Error(ngmf.getMessage("ZNGMC0062"));
			} else {

				ngmf.clear(GLD.GDS_INDUMMY1);

				GLD.GDS_INDUMMY1.insertColumn("atfil_id" ,{name:"atfil_id" , dataType:	"text"});
				GLD.GDS_INDUMMY1.insertColumn("atfil_ser_num" ,{name:"atfil_ser_num" , dataType:	"text"});
				GLD.GDS_INDUMMY1.insertColumn("atfil_title_nm" ,{name:"atfil_title_nm" , dataType:	"text"});
				GLD.GDS_INDUMMY1.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
				GLD.GDS_INDUMMY1.insertColumn("screen_nm", { name:	"screen_nm" , dataType:	"text" });

				GLD.GDS_INDUMMY1.insertRow(0);
				GLD.GDS_INDUMMY1.setCellData(0, "atfil_id", aftilId);
				GLD.GDS_INDUMMY1.setCellData(0, "atfil_ser_num", "");
				GLD.GDS_INDUMMY1.setCellData(0, "atfil_title_nm", "");
				GLD.GDS_INDUMMY1.setCellData(0, "trx_cd", "u");
				GLD.GDS_INDUMMY1.setCellData(0, "screen_nm", ScreenName);

				ngmf.clear(GLD.GDS_INDUMMY2);
				GLD.GDS_INDUMMY2.insertColumn("trx_cd" ,{name:"trx_cd" , dataType:	"text"});
				GLD.GDS_INDUMMY2.insertColumn("atfil_ser_num" ,{name:"atfil_ser_num" , dataType:	"text"});
				GLD.GDS_INDUMMY2.insertColumn("expir_dt" ,{name:"expir_dt" , dataType:	"text"});
				GLD.GDS_INDUMMY2.insertColumn("atfil_nm" ,{name:"atfil_nm" , dataType:	"text"});
				GLD.GDS_INDUMMY2.insertColumn("save_path_nm" ,{name:"save_path_nm" , dataType:	"text"});
				GLD.GDS_INDUMMY2.insertColumn("atfil_size" ,{name:"atfil_size" , dataType:	"text"});
				GLD.GDS_INDUMMY2.insertColumn("mime_type_info" ,{name:"mime_type_info" , dataType:	"text"});

				GLD.GDS_INDUMMY2.insertRow(0);
				GLD.GDS_INDUMMY2.setCellData(0, "trx_cd", "d");
				GLD.GDS_INDUMMY2.setCellData(0, "atfil_ser_num", 0);
				GLD.GDS_INDUMMY2.setCellData(0, "expir_dt", "");
				GLD.GDS_INDUMMY2.setCellData(0, "atfil_nm", "");
				GLD.GDS_INDUMMY2.setCellData(0, "save_path_nm", "");
				GLD.GDS_INDUMMY2.setCellData(0, "atfil_size", "");
				GLD.GDS_INDUMMY2.setCellData(0, "mime_type_info", "");


				ngmf.clear(GLD.GDS_OUTDUMMY);

				// 파일 업로드 온라인 서비스 프로그램을 호출
				ngmf._fileSyncTransaction(TrxCode, ScreenName, "", [GLD.GDS_INDUMMY1,GLD.GDS_INDUMMY2], OutDataList, "");

				// 파일 업로드 온라인 서비스 에러 체크
				if(Number(ngmv.errorCode[0]) == 0){
					sRtnVal[0] = "Y";
					if (eFlag) {
						sRtnVal[1] = "ZNGMC0070";
					}
				} else {
					sRtnVal  = "N";
				}
				resolve(sRtnVal); 
			}
		} catch (e) {
			ngmf._error("[ngmf.promise._deleteSingleFile ] Exception :: ", e);
			if (!eFlag) sRtnVal = "N";
			else {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = e["message"] || e;
			}
			resolve(sRtnVal); 
		} 
	}); 
};


/**
 * 전자서명관리화면 요청(Promise)
 * @date 2016.02.25
 * @memberOf ngmf
 * @param {String} comm_cd_id :: I :: N ::  :: 업무구분(mid)
 * @param {String} file_del_yn :: I :: N ::  :: 파일삭제여부
 * @param {String / Json} dst_sign_out :: I :: N ::  :: 대상 데이터셋
 * @returns {Object} Promise
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless
 * @example
 * 	     ngmf.promise._callElecSign("RSA", "Y", dst_sign_out).then( function(bret) {
 *      	if (bret) {
 *      		//처리성공
 *      		//dst_sign_out 를 이용한 후 처리 진행
 *      	} else {
 *      		ngmf.alert("전자서명 처리 실패");
 *      	}
 *      });
 *
 */
ngmf.promise._callElecSign = function(comm_cd_id, file_del_yn, dst_sign_out) {
	return new Promise(function(resolve, reject) {
		try{
			var strPrefix = "CCA";
			var strFormid = "ZNGMSSGN00010"; // 전자서명관리화면
			var Scrname = ngmf._getScreenName();

			var vParam = "comm_cd_id=" + ngmf.quote(comm_cd_id) ;
			vParam += " file_del_yn="    + ngmf.quote(file_del_yn) ;
			vParam += " Scrname="    + ngmf.quote(Scrname) ;

			dst_sign_out = ngmf.object(dst_sign_out);

			if (dst_sign_out){
				sRtnVal = ngmf.promise.dialog(strPrefix, strFormid, vParam, 420, 330, "", null, null, Scrname)
				.then( function (rtn_ary) {
					ngmf.clear(dst_sign_out);
					dst_sign_out.insertColumn("sign_cl_cd", {name: "sign_cl_cd",dataType: "text"});
					dst_sign_out.insertColumn("atfil_id", {name: "atfil_id",dataType: "text"});
					dst_sign_out.insertColumn("upload_rslt_yn", {name: "upload_rslt_yn",dataType: "text"});
					dst_sign_out.insertColumn("upload_rslt_cd", {name: "upload_rslt_cd",dataType: "text"});
					dst_sign_out.insertColumn("file_save_path_nm", {name: "file_save_path_nm",dataType: "text"});

					var idx = dst_sign_out.insertRow();
					dsl_output.setCellData(idx ,"sign_cl_cd",rtn_ary[0]);
					dsl_output.setCellData(idx ,"atfil_id",rtn_ary[1]);
					dsl_output.setCellData(idx ,"upload_rslt_yn",rtn_ary[2]);
					dsl_output.setCellData(idx ,"upload_rslt_cd",rtn_ary[3]);
					dsl_output.setCellData(idx ,"file_save_path_nm",rtn_ary[4]);
					if (rtn_ary[1] != "Y") resolve(false); 
					else resolve(true); 
				});
			} else {
				throw new Error("dst_sign_out 을 찾을수 없습니다.");
			}
		} catch (e) {
			ngmf._error("[ngmf.promise._callElecSign ] Exception :: ", e);
			resolve(false); 
		} 
	});
}; 

/**
 * 그리드 다중 파일 파일 업로드(promise)
 * @date 2015. 02. 22.
 * @memberOf ngmf
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판, 1 : 암호화 게시판, 2 : 비암호화 파일만 , 3: 암호화 파일만  
 * @param {String / Json} gridObj :: I :: N ::  :: 파일정보 보여줄 그리드 객체 또는 ID
 * @param {String} expDate :: I :: N ::  :: 유효일자 '0' : 영구, '1' : 3년
 * @param {Boolean} eFlag :: I :: Y ::  :: 0 : 메시지 popup
 * @param {String} screenNM :: I :: Y ::  :: 화면명 (input 으로 사용)
 * @param {Boolean} chkAcl :: I :: Y ::  :: 암호화 해제여부
 * @returns {Object} Promise : {result:[], dsfile: ds_file}
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_GRIDSAMPLE
 * @example
			ngmf.promise.encUploadGridFile (0, grd_gdsPlanDtlList, "1", 1, ngmf._getScreenName() )
		   .then( function (retObj) { 
		   		var retArr = retObj["result"], ds_file = retObj["dsfile"];
				if (retArr[0] == "Y") {  
					//3.파일 업로드 성공시 그리드 업로드 호출
					//var fileNamearr = getColData("file");
					var fileNameMap = {};
					for (var i = 0; i < ds_file.getRowCount(); i++) {
						fileNameMap[ds_file.getCellData(i,"file")] = ds_file.getCellData(i,"atfilId"); 
					} 
					//["img_atfil_id","atfil_id"] 열에 대해...파일 이름을 atfil_id 로 변경하여 저장한다고 가정할경우
					var img_atfil_id ="", atfil_id = "";
					for (var i = 0; i < grd_gdsPlanDtlList._dataList.getRowCount(); i++) {
						 img_atfil_id = grd_gdsPlanDtlList.getCellData(i, "img_atfil_id");
						 atfil_id = grd_gdsPlanDtlList.getCellData(i, "atfil_id");
						if ( img_atfil_id != "" && fileNameMap[img_atfil_id]) grd_gdsPlanDtlList.dataList.setCellData( i, "img_atfil_id", fileNameMap[img_atfil_id] );
						if ( atfil_id != "" && fileNameMap[atfil_id])  grd_gdsPlanDtlList.dataList.setCellData( i, "atfil_id", fileNameMap[atfil_id] );
					}
					
					//4. 그리드 업로드 호출
					ngmf.alert("CALL scwin.saveGridView()");
					//scwin.saveGridView();
					
					// TODO. 저장 후 처리 프로세서 진행
					//ngmf.setGridMultiFileInit(grd_gdsPlanDtlList, ["img_atfil_id","atfil_id"]);
				} else {
					ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retArr[1]) );
				}
			}) 
			.then( undefined, function (retObj) {
				if (retObj["result"])  {
					ngmf.alert("MULTIUPLOAD  실패 =" + ngmf.getErrMessage(retObj["result"][1]));
				} else ngmf.alert("MULTIUPLOAD 실패 =", e);
			});
 */
ngmf.promise.encUploadGridFile = function(_enc, _gridObj, expDate, eFlag, screenNM, chkAcl) {
	return new Promise(function(resolve, reject) { 
		var sRtnVal = new Array();
		var ds_file = null;
		var ScreenName = "";
			try {
				var sChk = new Array();
				var chkExpDate = new Array(); 
				var userId = ngmf.getGlobalValue("g_Ngms_UserId");
				var enc = 0;
				if ( ngmf.isNumber(_enc) == "Y" )  enc = _enc;
				else if (_enc && _enc != "0") enc = 1; 
				
				if (typeof chkAcl == "undefined" || chkAcl == null) {
					if (enc == 1 || enc == 3) chkAcl = "01";
				}
				
				if (typeof _gridObj == "undefined" || !_gridObj) {
					throw "대상 그리드객체가 없습니다."; 
				}
				var gridObj = ngmf.object(_gridObj);
				if (typeof gridObj == "undefined" || !gridObj) {
					throw "대상 그리드객체가 없습니다.";
				}
				gridViewId = gridObj.getID();
				ngmf.resetGridMultiFile(gridObj);
				
				if (scvar["flist_" + gridViewId ] && scvar["flist_" + gridViewId ].length > 0) {
					ScreenName = screenNM || ngmf.gtFormID();
					chkExpDate = ngmf.checkExpireDate(expDate);
					
					ds_file = window["dsfile_"+ gridViewId];
					
					// 입력값 초기 설정값 검사
					sChk = ngmf.checkUploadMultiFile(ds_file);
		 
					// 최초 데이터 정합성 검토
					if (ngmf.isNull(sChk[0]) == "Y" || ngmf.isNull(expDate) == "Y") {
						sRtnVal[0] = "N";
						sRtnVal[1] = "ZNGMC0062";
						if (!eFlag)  ngmf.alert(ngmf.getMessage(sRtnVal[1]));
						throw "ZNGMC0062"; 
					} else if (sChk[0] == "N") {
						sRtnVal[0] = "N";
						sRtnVal[1] = sChk[1];
						if (!eFlag)  ngmf.alert(ngmf.getMessage(sRtnVal[1]));
						throw "ZNGMC0062";  
					} else if (sChk[0] == "Y" && chkExpDate[0] == "Y") {
						//권한 체크 시작
						var aclPromiseArr = new Array();
						var markDel = false;
						for ( var ix = 0; ix < ds_file.getRowCount() ; ix++) {  
							aclPromiseArr.push( ngmf.promise.extFileAclCheckProc(scvar["flist_" + gridViewId ][ix])); 
						}
						if (aclPromiseArr.length > 0) {
							Promise.all(aclPromiseArr)
							.then( function( retObjArr ) {  
								var rtnVal = null; 
								for (var i = 0 ; i < retObjArr.length; i++) {
									rtnVal = retObjArr[i];
									markDel = false;
									if (rtnVal == 1) {
										//암호화 파일일 경우
										if (enc == 0)  {
											sRtnVal = null;
											throw ngmf.getMessage("ZNGMC1161", "&ITEM", "보안문서는 업로드 할 수 없습니다.");
										}
										else if (enc == 2) markDel = true; 
									} else if (rtnVal == 2) {
										if (enc == 3) markDel = true; 
									} else {
										markDel = true;
									} 
									if(markDel) {
										ds_file.setCellData(ix, "del", "1");
									}
								} 
								
								// 멀티 처리를 위한 초기화
								var chkDel;
								realCnt = ngmf.getRealFileCount(ds_file);
								WebSquare.layer.showProcessMessage(ngmf.getMessage("ZCOMC0018","&OBJECT","그리드 파일업로드","&PROC","총 "+realCnt+"건","&ACTION","업로드"));

								scvar["mimeTypeMap"] = {};
								
								var promiseArr = [];
								for ( var ix = 0; ix < ds_file.getRowCount() ; ix++) {  
									
									var filename = ngmf.getFileName(ds_file.getCellData(ix, "file"));
									var mimeType = ngmf.chkMimeType(filename);
									var trxCode = ds_file.getCellData(ix, "trxCode") || "i";

									if (0 == enc || "0" == enc || (chkAcl && chkAcl.startsWith("1")) ) { // 비암호화 게시판의 경우, 서버에서 파일 암호화하지 않음
										mimeType = "NON" + mimeType;
									}
									scvar.mimeTypeMap[ix] = mimeType;
									var paramMap = {
											userId : userId,
											filename : filename,
											mimeType : mimeType,
											screenNM : ScreenName,
											ds_file : ds_file,
											rowIdx : ix
										};

									chkDel =  ngmf.toNumber(ds_file.getCellData(ix, "del") || "0") ;

								    if (trxCode == "u" && (chkDel == 1 || chkDel == "1")) { // DELETE 일때
										paramMap["trxCode"] = "d";
								    	trxCode = "d";
									}
									// DELETE 를 제외한 INSERT/UPDATE 는 파일을 업로드
									if (trxCode != "d") {
										promiseArr.push(ngmf.promise._fileWrite(scvar["flist_" + gridViewId ][ix], paramMap, null, chkAcl));
									}
								} // loop 종료
								
								if (promiseArr.length > 0) {
									Promise.all(promiseArr)
									.then( function(retObjArr) {  
										//전체 성공시만 이쪽으로 빠짐
										WebSquare.layer.hideProcessMessage();
										var retObj = null;  
										var rtnatfilids = new Array(); 
										for (var i = 0 ; i < retObjArr.length; i++) {
											retObj = retObjArr[i];
											if ( retObj.result && retObj.result[0] == "Y") {
												var ix = retObj.paramMap["rowIdx"];
												
												ngmf.clear(GLD.GDS_INDUMMY1);
												GLD.GDS_INDUMMY1.insertColumn("atfil_id", { name:	"atfil_id" , dataType:	"text" });
												GLD.GDS_INDUMMY1.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
												GLD.GDS_INDUMMY1.insertColumn("atfil_title_nm", { name:	"atfil_title_nm" , dataType:	"text" });
												GLD.GDS_INDUMMY1.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
												GLD.GDS_INDUMMY1.insertColumn("screen_nm", { name:	"screen_nm" , dataType:	"text" });

												GLD.GDS_INDUMMY1.insertRow();
												GLD.GDS_INDUMMY1.setCellData(0, "atfil_id", "");
												GLD.GDS_INDUMMY1.setCellData(0, "atfil_ser_num", "");
												GLD.GDS_INDUMMY1.setCellData(0, "atfil_title_nm", "");
												GLD.GDS_INDUMMY1.setCellData(0, "trx_cd","i");
												GLD.GDS_INDUMMY1.setCellData(0, "screen_nm", retObj.paramMap["screenNM"]);

												
												ngmf.clear(GLD.GDS_INDUMMY2);
												GLD.GDS_INDUMMY2.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
												GLD.GDS_INDUMMY2.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
												GLD.GDS_INDUMMY2.insertColumn("expir_dt", { name:	"expir_dt" , dataType:	"text" });
												GLD.GDS_INDUMMY2.insertColumn("atfil_nm", { name:	"atfil_nm" , dataType:	"text" });
												GLD.GDS_INDUMMY2.insertColumn("save_path_nm", { name:	"save_path_nm" , dataType:	"text" });
												GLD.GDS_INDUMMY2.insertColumn("atfil_size", { name:	"atfil_size" , dataType:	"text" });
												GLD.GDS_INDUMMY2.insertColumn("mime_type_info", { name:	"mime_type_info" , dataType:	"text" });
												
												GLD.GDS_INDUMMY2.insertRow();
												GLD.GDS_INDUMMY2.setCellData(0, "trx_cd", "i" );
												GLD.GDS_INDUMMY2.setCellData(0, "atfil_ser_num", ds_file.getCellData(ix, "atfilSerNum"));
												GLD.GDS_INDUMMY2.setCellData(0, "expir_dt", chkExpDate[1]);
												GLD.GDS_INDUMMY2.setCellData(0, "atfil_nm", retObj.paramMap["filename"]);
												GLD.GDS_INDUMMY2.setCellData(0, "save_path_nm", retObj.result[1]);
												GLD.GDS_INDUMMY2.setCellData(0, "atfil_size", retObj.result[2]);
												GLD.GDS_INDUMMY2.setCellData(0, "mime_type_info", retObj.paramMap["mimeType"]);
												
												ngmf.clear(GLD.GDS_OUTDUMMY); 
												// 파일 업로드 온라인 서비스 프로그램을 호출
												ngmf._fileSyncTransaction("ZNGMSFIL13110_TR01", ScreenName, "", [GLD.GDS_INDUMMY1,GLD.GDS_INDUMMY2],  "GLD.GDS_OUTDUMMY" , "");  
												// 파일 업로드 온라인 서비스 에러 체크
												if(Number(ngmv.errorCode[0]) == 0){  
													ds_file.setCellData(ix , "savePathNm",  GLD.GDS_OUTDUMMY.getCellData(0, "save_path_nm") );
													ds_file.setCellData(ix , "atfilId",  GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id") );
													rtnatfilids.push(GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id")); 										
												} else {
													sRtnVal[0] = "N";
													if (!eFlag) sRtnVal =  "N" ;
													resolve({"result":sRtnVal , "dsfile" : ds_file}); 
													return;
												} 
											} else {
												//한건이라도 실패 발생하면....
												sRtnVal[0] = "N";
												if (!eFlag) sRtnVal =  "N" ;
												resolve({"result":sRtnVal , "dsfile" : ds_file}); 
												return;
											}
										}
										if (eFlag){
											sRtnVal[0] = "Y";
											sRtnVal[1] = rtnatfilids.join(",");
										} else  {
											ngmf.alert(ngmf.getMessage("ZNGMC0065"));
											sRtnVal = "Y";
										}
										resolve ({"result":sRtnVal , "dsfile" : ds_file}); 
									})
									.then(undefined, function(retObj) {
										WebSquare.layer.hideProcessMessage(); 
										sRtnVal = null;
										if (e["message"])
											throw "암호화 파일 확인 오류::" + e.message;
										else throw "암호화 파일 확인 오류::" + e ; 
									});
								} else {
									sRtnVal[0] = "N";
									sRtnVal[1] = "ZNGMC0065";
									if (!eFlag)  {
										ngmf.alert(ngmf.getMessage("ZNGMC0065"));
										sRtnVal = "N";
									}
									resolve({"result":sRtnVal , "dsfile" : ds_file});
								}	 
							})
							.then(undefined, function(e) {
								WebSquare.layer.hideProcessMessage(); 
								sRtnVal = null;
								if (e["message"])
									throw "암호화 파일 확인 오류" + e.message;
								else throw "암호화 파일 확인 오류" ;
							});
						} 
					} 
				} else {
					sRtnVal[0] = "N";
					sRtnVal[1] = "ZNGMC0065";
					if (!eFlag)  {
						ngmf.alert(ngmf.getMessage("ZNGMC0065"));
						sRtnVal = "N";
					}
					resolve({"result":sRtnVal , "dsfile" : ds_file});  
				}
			} catch (e) {
				WebSquare.layer.hideProcessMessage();
				ngmf._error("[ngmf.promise.encUploadGridFile ] Exception :: ", e);
				if (!eFlag) sRtnVal = "N";
				else {
					sRtnVal = new Array();
					sRtnVal[0] = "N";
					sRtnVal[1] = e["message"] || e;
				}
				resolve({"result":sRtnVal , "dsfile" : ds_file}); 
			} 
	}); 
};



/**
 * 그리드 다중 파일 파일 업로드
 * @date 2015. 02. 22.
 * @memberOf ngmf
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판, 1 : 암호화 게시판
 * @param {String / Json} gridObj :: I :: N ::  :: 파일정보 보여줄 그리드 객체 또는 ID
 * @param {String} expDate :: I :: N ::  :: 유효일자 '0' : 영구, '1' : 3년
 * @param {Boolean} eFlag :: I :: Y ::  :: 0 : 메시지 popup
 * @param {String} screenNM :: I :: Y ::  :: 화면명 (input 으로 사용)
 * @param {String / Json} callBackFunc :: I :: Y ::  :: 결과 처리용 CAllBACK 함수
 * @returns 
 * @sampleLink ATFIL_GRIDSAMPLE
 * @author 성일호
 * @useMobile useless
 * @example 
 *   		ngmf.encUploadGridFile(0, grdView, "1", "" , function(retArr, ds_file) {
					if (retArr[0] == "Y") {  

						var fileNameMap = {};
						for (var i = 0; i < ds_file.getRowCount(); i++) {
							fileNameMap[ds_file.getCellData(i,"file")] = ds_file.getCellData(i,"atfilId"); 
						} 
						//["img_atfil_id","atfil_id"] 열에 대해...파일 이름을 atfil_id 로 변경하여 저장한다고 가정할경우
						var img_atfil_id ="", atfil_id = "";
						for (var i = 0; i < grd_gdsPlanDtlList._dataList.getRowCount(); i++) {
							 img_atfil_id = grd_gdsPlanDtlList.getCellData(i, "img_atfil_id");
							 atfil_id = grd_gdsPlanDtlList.getCellData(i, "atfil_id");
							if ( img_atfil_id != "" && fileNameMap[img_atfil_id]) grd_gdsPlanDtlList.dataList.setCellData( i, "img_atfil_id", fileNameMap[img_atfil_id] );
							if ( atfil_id != "" && fileNameMap[atfil_id])  grd_gdsPlanDtlList.dataList.setCellData( i, "atfil_id", fileNameMap[atfil_id] );
						}
 				
					} else {
						ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retArr[1]) );
					}
			});
 */
ngmf.encUploadGridFile = function(enc, _gridObj, expDate, eFlag, screenNM, callBackFunc) {
	if(ngmf.isMobile()){
		ngmf.alert("ngmf.encUploadGridFile : 모바일환경에서 지원불가 API 입니다.");
		return;
	}
	
	ngmf.promise.encUploadGridFile(enc, _gridObj, expDate, eFlag, screenNM)
   .then( function (retObj) {
			if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj["result"],retObj["dsfile"]);
	}) 
	.then( undefined, function (retObj) {
		if (retObj["message"]) {
			if (eFlag){
				if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(["N", retObj["message"]]);
			} else if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)("N"); 
		} else if (typeof callBackFunc != "undefined" && callBackFunc) ngmf._getCallBackFunction(callBackFunc)(retObj["result"],retObj["dsfile"]);
	});		
};

/**
 * 다중 파일 다운로드_Batch 파일(promise)
 * @date 2015.02.29.
 * @memberOf ngmf
 * @param {String / Json} ds_file :: I :: N ::  :: 파일 Datalist
 * @param {String} l_FilePath :: I :: Y ::  :: 파일경로(미사용)
 * @param {String} l_FileName :: I :: Y ::  :: 파일이름
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile useless
 * @example
	ngmf.promise.batDownloadMultiFile(ds_file,null,"testbatch.csv")
   .then( function (retObj) {
		if (retObj[0]== "Y") {
			// retObj[1] =>  csv 파싱로직 추가 필요...
			
		} else { ngmf.alert("다중 파일 다운로드_Batch 파일 오류:::" + retObj[1]);}
	}) 
	.then( undefined, function (retObj) {
		if (retObj["message"]) {
			ngmf.alert("다중 파일 다운로드_Batch 파일 오류:::" + retObj["message"]);
		} else ngmf.alert("다중 파일 다운로드_Batch 파일 오류:::" + retObj[1]);
	});	
 * @since
 */
ngmf.promise.batDownloadMultiFile = function(_ds_file, l_FilePath, l_FileName, getTextFlag) {
	return new Promise(function(resolve, reject) {
		var sRtnVal = new Array();
		try{
			var savePathNm;
			var filename;
			var ds_file = ngmf.object(_ds_file);
			if (typeof ds_file != "object" || ds_file.getObjectType() != "dataList") {
				throw new Error(ngmf.getMessage("ZNGMC0062"));
			} else {
				// 선택된 파일이 있을 경우 
				var promiseArr = [];
				if (typeof l_FileName != "undefined" && ngmf.chkMimeType(l_FileName) == "") l_FileName = l_FileName + ".csv";
				for ( var ix = 0; ix < ds_file.getRowCount(); ix++) { 
					savePathNm = ds_file.getCellData(ix, "savePathNm");
					filename = ngmf._getBatFileName(( l_FileName || ds_file.getCellData(ix, "file")), ix);
					//filename = ngmf._getDownloadFileName(( l_FileName || ds_file.getCellData(ix, "file")), savePathNm); 
					if (typeof getTextFlag != "undefined" && getTextFlag)
						promiseArr.push(ngmf.promise._fileReadMem(savePathNm, 2));
					else
						promiseArr.push(ngmf.promise._fileRead(filename,savePathNm, {rowIdx:ix, ds_file:ds_file})); 
				}
				
				if (promiseArr.length > 0) {
					Promise.all(promiseArr)
					.then( function(retObjArr) {  
						//전체 성공시만 이쪽으로 빠짐
							// [{"result" : rtn_arr, "paramMap" : paramMap} , {"result" : rtn_arr, "paramMap" : paramMap} , ... ]						
							// 결과 전송 처리 로직 삽입
						var retStr = "";
						try {
							for (var ix = 0; ix <retObjArr.length ; ix ++ ) {
								if (retObjArr[ix]["result"][0] == "N") {
										sRtnVal = new Array();
										sRtnVal[0] = "N";
										sRtnVal[1] = retObjArr["result"][1] ;
									return sRtnVal;
								} else {
									retStr += retObjArr[ix]["result"][1] ;
								}	
							}						
						} catch (e) {}

						sRtnVal = new Array();
						sRtnVal[0] = "Y";
						sRtnVal[1] = retStr;
						
						resolve(sRtnVal); 
					})
					.then(undefined, function(retObj) {
						//한건이라도 실패 발생하면....
						if (retObj["result"]) { 
								sRtnVal = new Array();
								sRtnVal[0] = "N";
								sRtnVal[1] = retObj["result"][1];
						} else { 
								sRtnVal = new Array();
								sRtnVal[0] = "N";
								sRtnVal[1] = retObj.mesage;
						} 
						resolve(sRtnVal); 
					});
				}  else {				
						throw new Error(ngmf.getMessage("ZNGMC0065"));
				}
			}
		} catch (e) {
			ngmf._error("[ngmf.promise.batDownloadMultiFile ] Exception :: ", e);
			sRtnVal[0] = "N";
			sRtnVal[1] = e["message"] || e;
			resolve(sRtnVal); 
		} 
	}); 
};

ngmf._getBatFileName = function (fileName, idx) {
	try {
		if (!fileName) return "err.csv";
		if (typeof idx == "undefined" || idx == 0) return fileName;
		var i = idx || -1;
		if (i < 0) i = 1;
		else i++;
		var fNameArr = fileName.split(".");
		return fNameArr[0] + "" + i + "." + ( fNameArr[1] || "csv" );
		
	} catch (e) {
		ngmf._error("ngmf._getBatFileName ERROR",e);
		return "err.csv";
	}
};
/**
 * 이미지 업로드전 프리뷰 처리
 * @date 2016.03.02
 * @memberOf ngmf
 * @param {String} PreviewDivId :: I :: N ::  :: 프리뷰 보여줄 DIV 객체 ID
 * @param {String} objectId :: I :: N ::  :: 대상객체 (파일업로드 객체 or 그리드객체) ID
 * @param {String} fileName :: I :: Y ::  :: 파일 이름 (객체가 그리드일경우 필수)
 * @returns
 * @author 성일호
 * @useMobile useless
 * @example ngmf.preViewImage("imagePreview","imageUpload"); or ngmf.preViewImage("imagePreview","grd_upload","imageFile.jpg");
 */
ngmf.preViewImage = function (PreviewDivId, objectId, fileName) {
	try {
		if (typeof PreviewDivId == "undefined" || !PreviewDivId || !ngmf.object(objectId)) return;
		if (typeof PreviewDivId == "object") PreviewDivId = PreviewDivId.getID();
		
		var target = objectId;
		if (typeof objectId == "string") target = ngmf.object(objectId); 
		
		if (typeof fileName == "undefined" || !fileName) {
			if (typeof target.getPluginName == "function" && target.getPluginName() == "upload") {
					if (document.getElementById(target.getID()+"_fakeinput").files.length > 0) ngmf._preViewImage(PreviewDivId, [document.getElementById(target.getID()+"_fakeinput").files[0] ] , document.getElementById(target.getID()+"_fakeinput").files[0].name);	
			} else {
				ngmf._loadImageFile(PreviewDivId, target );
			} 
		} else {
			if (typeof target.getPluginName == "function") {
				if (target.getPluginName() == "gridView") {
					if ( !scvar["flist_" + ngmf.object(gridObjId).getID() ]) return;
					ngmf._preViewImage(PreviewDivId, scvar["flist_" + ngmf.object(gridObjId).getID() ], fileName);	
				} else if (target.getPluginName() == "upload") {
					if ( scvar[target.getID() + "_files"] && scvar[target.getID() + "_files"].length > 0) ngmf._preViewImage(PreviewDivId, scvar[target.getID() + "_files"], fileName);
					else if (document.getElementById(target.getID()+"_fakeinput").files.length > 0) ngmf._preViewImage(PreviewDivId, document.getElementById(target.getID()+"_fakeinput").files , document.getElementById(target.getID()+"_fakeinput").files[0].name);
				}					
			} else {
				ngmf._loadImageFile(PreviewDivId, target );
			}
		}
	} catch (ex) {
		ngmf._error("[ngmf.preViewImageGrid] Exception :: ", ex);
	}
}; 


/**
 * 이미지 업로드전 프리뷰 처리
 * @date 2016.03.02
 * @memberOf ngmf
 * @param {String} PreviewDivId :: I :: N ::  :: 프리뷰 보여줄 DIV 객체 ID
 * @param {Array} fileList :: I :: N ::  :: 파일 객체 Array
 * @param {String} fileName :: I :: N ::  :: 파일 이름
 * @returns
 * @author 성일호
 * @useMobile useless
 * @example ngmf._preViewImage("imagePreview","imageInput")
 */
ngmf._preViewImage = function (PreviewDivId, fileList, fileName) {
	try {
		if (typeof PreviewDivId != "string" || !ngmf.isArray(fileList) || typeof fileName == "undefined"  || !fileName) return;
		var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
		for (var i = 0 ; i < fileList.length ; i++) {
			if (fileList[i].name == fileName) {
				if (!rFilter.test(fileList[i].type)) {
					return;
				} else {
					ngmf._loadImageFile(PreviewDivId,fileList[i]);
				}
				break;
			}
		}
	} catch (ex) {
		ngmf._error("[ngmf._preViewImage] Exception :: ", ex);
	}
};

/**
 * 이미지 업로드전 프리뷰 처리
 * @date 2016.03.02
 * @memberOf ngmf
 * @param {String} PreviewDivId :: I :: N ::  :: 프리뷰 보여줄 DIV 객체 ID
 * @param {String} fileUpId :: I :: N ::  :: 파일 upload Component ID
 * @returns
 * @author 성일호
 * @useMobile useless
 * @example ngmf._loadImageFile("imagePreview","imageInput")
 *  CSS 정의
 * <style type="text/css">
 * #imagePreview { width: 160px; height: 120px; float: right; filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale); }
 * </style>
 * <div id="imagePreview"></div> <input id="imageInput" type="file" name="myPhoto" onchange="ngmf.loadImageFile('imagePreview', this.files[0]);" />
 * @since
 */
ngmf._loadImageFile = function (PreviewDivId, fileObj) {
	try {
		var imagePreviewStr = PreviewDivId || "imagePreview";

		if (typeof window.FileReader == "function") {
			var previewDiv = null, oPreviewImg = null, oFReader = new window.FileReader(), rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
			if (!fileObj) {
				ngmf.alert(ngmf.getMessage("ZNGMC0065")|| "선택된 파일이 없습니다.");
				return;
			}
			if (!rFilter.test(fileObj.type)) {
				ngmf.alert(ngmf.getMessage("ZNGMC0008", "&ITEM","파일")|| "유효하지않은 파일입니다. 확인하십시오.");
				return;
			}
			previewDiv = document.getElementById(imagePreviewStr);
			if (!previewDiv) {
				ngmf.alert("이미지를 표현할 DIV 객체가 없습니다.");
				return;
			}
			oPreviewImg = document.getElementById(imagePreviewStr + "IMG");
			
			ngmf.promise.extFileAclCheckProc(fileObj).then(function(ret){
				if (ret ==1) {
					ngmf._error("암호화된 파일입니다.");
					if (!oPreviewImg) {
						oPreviewImg.src = "";
						oPreviewImg.title= "";
					}
				} else {
					
					oFReader.onload = function(oFREvent) {
						var isSetSize = false;
						if (!previewDiv.clientWidth) isSetSize = true;
						if (!oPreviewImg) {
							oPreviewImg = new Image();
							oPreviewImg.id = imagePreviewStr + "IMG";
							if (!isSetSize) {
								oPreviewImg.style.width = previewDiv.clientWidth + "px";
								oPreviewImg.style.height = previewDiv.clientHeight + "px";	
							} 
							previewDiv.appendChild(oPreviewImg);
						} else if (!isSetSize && previewDiv.clientWidth != oPreviewImg.width) {
							oPreviewImg.style.width = previewDiv.clientWidth + "px";
							oPreviewImg.style.height = previewDiv.clientHeight + "px";	
						} 
						oPreviewImg.src = oFREvent.target.result;
 					};
					oFReader.readAsDataURL(fileObj);
				}
			}); 
		} else if (WebSquare.util.isIE()) {
			// navigator.appName === "Microsoft Internet Explorer"
			//document.getElementById(imagePreviewStr).filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = fileObj.value;
		}
	} catch (ex) {
		ngmf._error("[ngmf._loadImageFile] Exception :: ", ex);
	}
};

/**
 * 파일다운로드 후 텍스트리턴 (내부함수)
 * @date 2016.03.09
 * @memberOf ngmf
 * @param {String} str_cookie :: I :: N ::  :: 파일저장경로
 * @param {Boolean} downType :: I :: Y ::  ::  1:BLOB 으로, 2:BAT용 
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile useless
 * @example 
 * 				ngmf.promise._fileReadMem(filepath)
				   .then( function (retObj) { 
					   		if (retObj["result"] && retObj["result"][0]=="Y")  ngmf.alert("성공::" + retObj["result"][1]);
					   		else if (retObj["result"])  ngmf.alert("실패::" + retObj["result"][1]);
					   		else ngmf.alert("실패::"+ retObj);
						}) 
					.then( undefined, function (e) { 
						if ( e["message"]) 
						 	ngmf.alert("실패::"+ e.message);
						else	
							ngmf.alert("실패::"+ e);
					}); 
 */
ngmf.promise._fileReadMem = function (str_cookie, downType){
	return new Promise(function(resolve, reject) {
		var rtn_arr = new Array();
		try {
			var isBlob = false;
			var isBatch = false;
			var isImage = false;
			
			rtn_arr[0] = "N";
			if (ngmf.length(str_cookie) <1) {
				throw  "파일경로가 없습니다.";
			} 
			if (typeof downType != "undefined" && downType) {
				if (1 == downType) isBlob = true;
				if (2 == downType) isBatch = true;
				if (3 == downType) isImage = true;
			}
			var strPort = ngmf.getServerUrl("FILE");
			var blobURL = strPort[0]
					+ ngmf.decode(ngmf.length(strPort[1]), 0, "", ":" + strPort[1])
					+ "/" + strPort[2];

			//blobURL = blobURL + "NGMFileDownload?fCloseAccount=0";

			var svrletName = "NGMFileDownload";
			if(isBatch) svrletName = "NGMUtf8FileDownload";
			//else if(isImage) svrletName = "NGMFileDownload";
			else if(isImage) svrletName = "NGMImageFileDownload";
			//TODO 테스트를 위해.... 삭제필요
			if(ngmf.isMobile()) {
				var serverUrl = GLV.G_MOBILECONNURL;
				
				blobURL = serverUrl + "/" + svrletName + "?fCloseAccount=0";
			} else {
				var L = location.toString();
				if (L.indexOf("websquare.html") > -1)
					blobURL = location.toString().split("?")[0].replace("websquare.html",svrletName) + "?fCloseAccount=0";
				else if (L.indexOf("popup.html") > -1)
					blobURL = location.toString().split("?")[0].replace("popup.html",svrletName) + "?fCloseAccount=0";
			}

			var cookie_info = escape(str_cookie) + "||";
			cookie_info += ngmf.getGlobalValue("g_Ngms_IpAddr") + "||";
			cookie_info += ngmf.getGlobalValue("g_Ngms_UserId") + "||";
			cookie_info += ngmf.getGlobalValue("g_Ngms_LogInId") + "||";
			cookie_info += ngmf.getGlobalValue("g_Ngms_OrgId") + "||";
			ngmf._setCookie("FileParam", cookie_info);

			//파일 다운 처리
			var xHr = null ; 
			//For IE >= 10 , Chrome .. etc...
			if (typeof window.navigator.msSaveBlob == "function" || window.XMLHttpRequest ) {
				xHr = WebSquare.core.getXMLHTTPObject();
 
				xHr.onerror = function(_progress) {
					rtn_arr[1] = "SERVER ERROR status::"+ xHr.statusText +"  readyState::"+ xHr.readyState;
					ngmf._error("[ngmf.promise._fileReadMem  xHr.onerror] xHr.readyState :: " + xHr.readyState + " ERROR:" + _progress );
 					//오류처리
					resolve({"result" : rtn_arr});
				};

				//결과 처리
				xHr.onreadystatechange = function(rqPgrsEv) {
					if (xHr.readyState == xHr.DONE ){
						var issaveok = false;
						var result_arr = rtn_arr;
						try { 
							if ( xHr.status == 200 ){
								if (isBlob || isImage) {
									result_arr[1] = xHr.response;
								} else  result_arr[1] = xHr.responseText;
								issaveok = true;
							}  
							try {
								var sFileParam = xHr.getResponseHeader("X-File-Name");
								if (sFileParam) {
									result_arr[0] = ngmf.left(sFileParam, 4);
									if ( result_arr[0] == "SUCC") result_arr[0] = "Y";
									else { 
										result_arr[0] = "N";
										result_arr[1] = ngmf.right(sFileParam, ngmf.length(sFileParam) - 6);
									}										
								} else  if (issaveok)  result_arr[0] = "Y"; 
								
							} catch (e) {
								if (issaveok)  result_arr[0] = "Y";
							}
							//완료처리
							if (issaveok) resolve({"result" : result_arr });
							else resolve({"result" : result_arr });
						} catch(ex) {
							result_arr[0] = "N";
							result_arr[1] = ex.message;
							ngmf._error("[ngmf.fileReadMem ] Exception :: ", ex); 
							resolve({"result" : result_arr});
						} finally {
							if (xHr) {
								xHr.abort();
								xHr = null;
							}
						}
					}
				}; 
				xHr.open ("GET", blobURL, true); // true : Async  false : Sync 
				xHr.setRequestHeader("X-File-Name",cookie_info);
				xHr.withCredentials = true;  // For CORS 
				if (isBlob || isImage) xHr.responseType = "blob";
				
				xHr.send(null);
			} else {
				//오류처리
				rtn_arr[0] = "N";
				rtn_arr[1] = "지원하지 않는 브라우저 입니다.";
				resolve({"result" : rtn_arr});
			}
		} catch(e) {
			rtn_arr[0] = "N";
			if (e["message"]) rtn_arr[1] = e.message; else rtn_arr[1] = e ;
			ngmf._error("[ngmf.promise._fileReadMem] Exception :: ", e);
			//오류처리
			resolve({"result" : rtn_arr });
		}
	});
};


/**
 * 파일업로드 (Promise)
 * @date 2016.02.25
 * @memberOf ngmf
 * @param {String} textMsg :: I :: N ::  :: 업로드할 TEXT 
 * @param {Object} userId :: I :: N ::  :: 업로드 사용자 ID
 * @param {Boolean} isUtf8 :: I :: Y ::  ::  
 * @param {String} chkacl :: I :: Y ::  ::  01= 암호화 게시판, 1X=Batch import
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile useless
 * @example
 */
ngmf.promise._fileWriteText = function (textMsg, userId, isUtf8, chkAcl){
	return new Promise(function(resolve, reject) {
		var rtn_arr = new Array(), file_size = -1;
		try {
			rtn_arr[0] = "N";
			if (!textMsg) {
				throw "저장할 TEXT 내용이 없습니다.";
			}
			if (typeof userId == 'undefined' || ngmf.length(userId) < 1) {
				throw "사용자 정보가 없습니다.";
			} 
			rtn_arr[1] = "UnKnown ERROR!!";
			rtn_arr[2] = file_size = textMsg.length;

			var sendok = false;
			var strPort = ngmf.getServerUrl("FILE");
			var strServer = strPort[0]
					+ ngmf.decode(ngmf.length(strPort[1]), 0, "", ":" + strPort[1])
					+ "/" + strPort[2];
			
			var cookieval = userId ;
			if (typeof chkAcl != "undefined" && chkAcl) cookieval +=  "||CLOB.txt"; 

			var svrletName = "NGMFileUpload";
			if(typeof isUtf8 != "undefined" && isUtf8) svrletName = "NGMUtf8FileUpload";
			
			remote_url = strServer + svrletName + "?fCloseAccount=0";

			ngmf._setCookie("FileParam", cookieval);

			//TODO 테스트를 위해.... 삭제필요
			if(ngmf.isMobile()) {
				var serverUrl = GLV.G_MOBILECONNURL;
				
				remote_url = serverUrl + "/" + svrletName + "?fCloseAccount=0";				
			} else {
				var L = location.toString();
				if (L.indexOf("websquare.html") > -1)
					remote_url = location.toString().split("?")[0].replace("websquare.html",svrletName) + "?fCloseAccount=0";
				else if (L.indexOf("popup.html") > -1)
					remote_url = location.toString().split("?")[0].replace("popup.html",svrletName) + "?fCloseAccount=0";				
			}

			//파일 업로드 처리
			var xHr = null ;

			if (window.XMLHttpRequest ) {
				xHr = WebSquare.core.getXMLHTTPObject();
				if (xHr) {
					//전송오류 처리...
					xHr.upload.onerror = function(_progress) {
						rtn_arr[0] = "N";
						rtn_arr[1] = "SERVER ERROR status::"+ xHr.status + "  readyState::"+ xHr.readyState;
						ngmf._error("[ngmf.promise._fileWriteText xHr.upload.onerror] xHr.readyState :: " + xHr.readyState + " ERROR:" + _progress );
	 					//오류처리
						resolve({"result" : rtn_arr});
					};
					xHr.onerror = function(_progress) {
						rtn_arr[0] = "N";
						rtn_arr[1] = "SERVER ERROR status::"+ xHr.status +"  readyState::"+ xHr.readyState;
						ngmf._error("[ngmf.promise._fileWriteText xHr.upload.onerror] xHr.readyState :: " + xHr.readyState + " ERROR:" + _progress );
	 					//오류처리
						resolve({"result" : rtn_arr});
					};

					//FILEUPLOAD 결과 확인...
					xHr.onreadystatechange = function(rqPgrsEv) {
						if (xHr.readyState == xHr.DONE ){
							var result_arr = new Array();;
							result_arr[0] = "N";
							result_arr[2] = file_size;
							try {
								if ( xHr.status == 200 ){
									if ( xHr.response ) {
										// 결과 파싱~~~~
										var sFileParam = xHr.response;
										if (sFileParam && sFileParam != "" && sFileParam.indexOf("::") > -1) {
											result_arr[0] = ngmf.left(sFileParam, 4);
											result_arr[1] = ngmf.right(sFileParam, ngmf.length(sFileParam) - 6);
											if (result_arr[0] == "SUCC" || result_arr[0] == "Y") {
												result_arr[0] = "Y"; 
											} else {
												result_arr[0] = "N";
											}
										}

									} else {
										result_arr[0] = "N";
										result_arr[1] = "UPLOAD 실패 : 결과 없음";
									}
								} else {
									result_arr[1] = "SERVER ERROR status::" + xHr.status;
								}

							} catch(ex) {
								result_arr[1] = ex.message;
								ngmf._error("[ngmf.promise._fileWriteText xHr.onreadystatechange ] Exception :: ", ex);
							} finally {
								if (xHr) {
									xHr.abort();
									xHr = null;
								}
							}
							//완료처리
							if (result_arr[0] == "Y")
								resolve({"result" : result_arr});
							else
								resolve({"result" : result_arr});
						}
					};
					xHr.open ("POST", remote_url , true); // false : sync , true : async
					xHr.withCredentials = true; // For CORS
					xHr.setRequestHeader("X-File-Name", cookieval);
					if (typeof chkAcl != "undefined" && chkAcl)
						xHr.setRequestHeader("EncType",chkAcl);
					
					xHr.send( new Blob([textMsg],{type:"text/plain"}));
					sendok = true;
					
				} else {
					sendok = true;
 					//오류처리
 					rtn_arr[0] = "N";
 					rtn_arr[1] = "지원하지 않는 브라우저 입니다.";
 					//오류처리
 					resolve({"result" : rtn_arr});
				}
			}

			//결과 리턴
			if (!sendok) {
				throw Error("UPLOAD CALL FAIL!!!!!");
			}
		} catch (e) {
			rtn_arr[0] = "N";
			if (e["message"]) rtn_arr[1] = e.message; else rtn_arr[1] = e ;
			ngmf._error("[ngmf.promise._fileWriteText] Exception :: ", e);
			//오류처리
			resolve({"result" : rtn_arr});
		}
	});
};


/** CLOB 처리를 위한 File UpLoad
 * @date 2016.03.10
 * @memberOf ngmf 
 * @param {String} lsFileText :: I :: N ::   ::	CLOB Data
 * @param {String} strModule :: I :: Y ::   ::	current driver://SKT// + Moudle명 [미사용]
 * @param {String} strFile 	:: I :: Y :: UpTempStr.txt  ::	upload할 file name - default : UpTempStr.txt [미사용]
 * @param {String} nexpDate	:: I :: N ::   ::	유효일자 추가 ('0' : 영구, '1' :  3년)
 * @param {Boolean} bSizeChkFg :: I :: Y :: 5120  ::	SIZE를 체크할지 여부 (DEFAULT : 5120)
 * @param {Boolean} bLockFg	:: I :: N ::   ::	보안처리 여부  TRUE/FALSE
 * @param {String} fileName  :: I :: Y ::  :: 파일이름 
 * @return {String} "" or  FileID 
 * @author 성일호 
 * @useMobile use
 */
ngmf.promise._clobFileUp = function(lsFileText, nexpDate, bSizeChkFg, bLockFg, _fileName){
	return new Promise(function(resolve, reject) {
		try {
			/*
			if (GLV.G_FORMUSEFG != "M") {
				ngmf.setWindowStatusMsg("E","단독화면에서는 실행하실 수 없습니다.\n메인영역과 함께 작업하세요.");
				throw "단독화면에서는 실행하실 수 없습니다.\n메인영역과 함께 작업하세요.";
			}
			*/
			// 입력값 체크
			if (ngmf.isNull(lsFileText) == "Y") {			
				ngmf.setWindowStatusMsg("E",ngmf.getMessage("ZNGMC0062"));
				throw ngmf.getMessage("ZNGMC0062"); 
			} 
			 
			var fileName = _fileName || "UpTempStr.txt";
			
			// 유효일자 산출 ('0' : 영구, '1' :  3년) 
			if(nexpDate != 0 && nexpDate != "0") {
				nexpDate = 1;
			} else {
				nexpDate = 0;
			} 
			
			var chkExpDate  = ngmf.checkExpireDate(nexpDate);
			if ( chkExpDate[0] != "Y"){
				throw ngmf.getMessage("유효일자 산출실패");
			}
			
			if(bSizeChkFg) {
				if (ngmf.lengthb(lsFileText) <= 4000) {
					throw "contents";
				}
			}	
			var chkacl = "";
		    //비암호화 게시판 또는 Batch Import의 경우, 서버에서 파일 암호화하지 않음
			var mimeType = ngmf.chkMimeType(fileName);
			if ( 2 == bLockFg ||  "2" == bLockFg) { 
				chkacl = "11";
			}  
			
			if (0 == bLockFg || 2 == bLockFg || "0" == bLockFg || "2" == bLockFg) { 
				mimeType =  "NON" + mimeType ;
			}  
			
			ngmf.promise._fileWriteText(lsFileText, ngmf.getGlobalValue("g_Ngms_UserId"), true ,chkacl)
				.then( function (retObj) { 
					   		if (retObj["result"] && retObj["result"][0]=="Y") { 
								// 결과 전송 처리 로직 삽입
								var TrxCode = "ZNGMSFIL13110_TR01";
								var ScreenName = ngmf._getScreenName() || "ZNGMSFIL13110";
								var OutDataList = "GLD.GDS_OUTDUMMY";  //
				
								ngmf.clear(GLD.GDS_INDUMMY1);
								GLD.GDS_INDUMMY1.insertColumn("atfil_id", { name:	"atfil_id" , dataType:	"text" });
								GLD.GDS_INDUMMY1.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
								GLD.GDS_INDUMMY1.insertColumn("atfil_title_nm", { name:	"atfil_title_nm" , dataType:	"text" });
								GLD.GDS_INDUMMY1.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
								GLD.GDS_INDUMMY1.insertColumn("screen_nm", { name:	"screen_nm" , dataType:	"text" });
				
								GLD.GDS_INDUMMY1.insertRow();
								GLD.GDS_INDUMMY1.setCellData(0, "atfil_id", "");
								GLD.GDS_INDUMMY1.setCellData(0, "atfil_ser_num", "");
								GLD.GDS_INDUMMY1.setCellData(0, "atfil_title_nm", "");
								GLD.GDS_INDUMMY1.setCellData(0, "trx_cd", "i");
								GLD.GDS_INDUMMY1.setCellData(0, "screen_nm", ScreenName);
				
								ngmf.clear(GLD.GDS_INDUMMY2);
								GLD.GDS_INDUMMY2.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
								GLD.GDS_INDUMMY2.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
								GLD.GDS_INDUMMY2.insertColumn("expir_dt", { name:	"expir_dt" , dataType:	"text" });
								GLD.GDS_INDUMMY2.insertColumn("atfil_nm", { name:	"atfil_nm" , dataType:	"text" });
								GLD.GDS_INDUMMY2.insertColumn("save_path_nm", { name:	"save_path_nm" , dataType:	"text" });
								GLD.GDS_INDUMMY2.insertColumn("atfil_size", { name:	"atfil_size" , dataType:	"text" });
								GLD.GDS_INDUMMY2.insertColumn("mime_type_info", { name:	"mime_type_info" , dataType:	"text" });
				
								GLD.GDS_INDUMMY2.insertRow();
								GLD.GDS_INDUMMY2.setCellData(0, "trx_cd", "i");
								GLD.GDS_INDUMMY2.setCellData(0, "atfil_ser_num", "");
								GLD.GDS_INDUMMY2.setCellData(0, "expir_dt", chkExpDate[1]);
								GLD.GDS_INDUMMY2.setCellData(0, "atfil_nm", fileName );
								GLD.GDS_INDUMMY2.setCellData(0, "save_path_nm",retObj["result"][1]);
								GLD.GDS_INDUMMY2.setCellData(0, "atfil_size", retObj["result"][2]);
								GLD.GDS_INDUMMY2.setCellData(0, "mime_type_info", mimeType);
				
				
								ngmf.clear(GLD.GDS_OUTDUMMY);
								// 파일 업로드 온라인 서비스 프로그램을 호출
								ngmf._fileSyncTransaction(TrxCode, ScreenName, "", [GLD.GDS_INDUMMY1,GLD.GDS_INDUMMY2], OutDataList, ""); 
								// 파일 업로드 온라인 서비스 에러 체크 
								if(Number(ngmv.errorCode[0]) == 0){
									resolve(GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id"));
								} else {
									resolve("");
								} 
					   		} else if (retObj["result"])  {
					   			ngmf._error("[ngmf.promise.clobFileUp ngmf.promise._fileWriteText] Exception :: " + retObj["result"][1]);
					   			resolve(""); 
					   		} else resolve("");
				}) 
				.then( undefined, function (e) { 
					ngmf._error("[ngmf.promise.clobFileUp ngmf.promise._fileWriteText] Exception :: ", e);
					resolve("");
				}); 
		} catch (e) {
			ngmf._error("[ngmf.promise.clobFileUp] Exception :: ", e);
			resolve(""); 
		}
	}); 
}; 

/** CLOB 처리를 위한 File에 대한 DownLoad (Promise)
 * @date 2016.03.10
 * @memberOf ngmf 
 * @param {String} atfilId :: I :: N ::   ::	File ID
 * @return {Object} Promise
 * @author 성일호
 * @useMobile use
 * @example 	
 * 	ngmf.promise._clobFileDown("73783447")
		.then( function(retMsg) {
			//성공시 처리
			ngmf.alert("성공::" + retMsg);
		})
		.then(undefined, function(e) {
			//실패시 처리
			ngmf.alert("실패::", e);
		}); 
 */
ngmf.promise._clobFileDown = function(atfilId){
	return new Promise(function(resolve, reject) {
		try {
			/*
			if (GLV.G_FORMUSEFG != "M") {
				ngmf.setWindowStatusMsg("E","단독화면에서는 실행하실 수 없습니다.\n메인영역과 함께 작업하세요.");
				throw "단독화면에서는 실행하실 수 없습니다.\n메인영역과 함께 작업하세요.";
			}
			*/
			// 입력값 체크
			if (ngmf.isNull(atfilId) == "Y") {			
				ngmf.setWindowStatusMsg("E",ngmf.getMessage("ZNGMC0062"));
				throw ngmf.getMessage("ZNGMC0062"); 
			} 
			var sSerVal = ngmf.getFileList(atfilId, null, 1);
			var filesize = null;
			var filepath = null;
			var fileName = null;
			if (sSerVal[0] == "Y") {
				filesize = GLD.GDS_OUTDUMMY.getCellData(0, "atfil_size");
				filepath = ngmf.urlDecode(GLD.GDS_OUTDUMMY.getCellData(0, "save_path_nm"));
				fileName = ngmf._getDownloadFileName(GLD.GDS_OUTDUMMY.getCellData(0, "atfil_nm"), filepath);
			} 
			if (ngmf.isNull(filepath) == "Y" || ngmf.isNull(filesize) == "Y") {	 
				throw ngmf.getMessage("ZNGMC0065");
/*			} else if (!ngmf._getCheckMimeTypeText(fileName)) { 
				throw "[" +fileName+"]는 지원 가능 파일이 아닙니다.";
				*/
			}else {
				ngmf.promise._fileReadMem(filepath, 2)
				   .then( function (retObj) { 
					   		if (retObj["result"] && retObj["result"][0]=="Y")  { 
					   			resolve(retObj["result"][1]);
					   		}
					   		else reject("");
						}) 
					.then( undefined, function (retObj) { 
						ngmf._error("[ngmf.promise._clobFileDown] Exception :: ", retObj);
						reject("");
					}); 
			}
		} catch (e) {
			if (e["message"]) {
				ngmf.setWindowStatusMsg("E", e.message);	
			} else {
				ngmf.setWindowStatusMsg("E", e);
			}
			ngmf._error("[ngmf.promise._clobFileDown] Exception :: ", e);
			reject(""); 
		}
	});
};


//비공개 내부함수
ngmf._fileSyncTransaction = function( trxCode, screenName, arg, inData, outData, callBackFunc){
	try {
		if(GLV.G_CLOSEFG == "6"){
			ngmv.errorCode =  [-6];
			if (typeof callBackFunc != "undefined"&& callBackFunc)
				ngmf._getCallBackFunction(callBackFunc)(e.message);
			return;
		} else {
			if (typeof callBackFunc != "undefined" && callBackFunc){
				ngmf.promise._commonMainTransaction ("synchronous", trxCode, screenName, arg, inData, outData, "", "NONE", true)
				.then( function(retMsg) {
					  ngmf._getCallBackFunction(callBackFunc)(retMsg);
				})
				.then(undefined, function(e) { 
						if (typeof e.message != "undefined")
							ngmf._getCallBackFunction(callBackFunc)(e.message);
						else
							ngmf._getCallBackFunction(callBackFunc)(e); 
				});			
			} else {
				ngmf.commonMainTransaction ("synchronous", trxCode, screenName, arg, inData, outData, "","NONE", true);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._fileSyncTransaction] Exception :: ", e);
	}
};

ngmf.promise._commonMainTransaction = function (syncType, trxCode, _screenName, arg, inData, outData, callBackFunc, ngmv_MsgFg, clearDs ){
	return new Promise(function(resolve, reject) {
		var reqData = null;
		try {
			if(GLV.G_CLOSEFG == "6"){
				return;
			}
			var screenName = ngmf.apmScreenName(_screenName || ngmf._getScreenName());
			ngmf.bizTrSettingStop(trxCode);
			ngmv.fScreenName = screenName ;
			var strSSO	 = "commonsvc=0";

			var outParam = null;
			var inDataStr = "";
			var inCnt = 0 ;
			var outCnt = 0 ;
			var strErrDsList 	= "";

			// reqData 만들기 직접 DS 객체만 받는다
			if (typeof inData != "undefined" && inData) {
				inCnt = inData.length;
			}
			if (inCnt > 0) {
				reqData = {};
				for ( var i = 0; i < inCnt; i++) {
					if (i > 0) inDataStr += ",";
					inDataStr += inData[i].getID();
					reqData["input" + (i + 1)] = inData[i].getRowJSON(0);
				}
			}

			//target 만들기
			if (ngmf.trim(outData) == "") {
				outParam = new Array();
			} else {
				outParam = outData.split(",");
			}
			outCnt = outParam.length;

			var resTempArr = new Array();
			for(var i=0; i<outCnt; i++)	{
				var pId 	= ngmf.trim(outParam[i]);
				var pKey 	= "output"+(i+1);
				resTempArr.push('{"id":"'+pId+'", "key":"'+pKey+'"}');
			}

			if(ngmf.makeHeadSet(trxCode, screenName) != "OK") {
				if(GLV.G_FORMUSEFG == "M") {
					ngmf.setWindowStatusMsg("E","헤더 정보를 로드하는데 실패 하였습니다.");
				}
				throw Error("헤더 정보를 로드하는데 실패 하였습니다.");
			}

			var strUrl = ngmf.SVC_PATH+"/SVC" + "?" + strSSO + "&rtcode=0&Trx_code=" + trxCode + "&ScreenName=" + screenName + ngmv.fCloseAccount;

			if(ngmf.length(ngmv_MsgFg) == 0){
				ngmv_MsgFg = "NONE";
			}
			trxCode = ngmf.trim(trxCode) + "|" + ngmf.trim(callBackFunc) + "|" + ngmf.trim(ngmv_MsgFg) + "|";
			if(ngmv_MsgFg.toUpperCase() != "SELF") {
				ngmf.setWindowStatusMsg("E","");
			}

			var sDate 		= ngmf.extGetHDTime(); //ExtGetHDTime() ==> 웹스퀘어에서는 현재 구현불가
			var startTime 	= ngmf.trim(ngmf.timeM());
			var nIdx 		= GLV.G_iTrxCurIdx;

			strUrl 			= ngmf.preTrxCall(strUrl);

			trxCode += "|" + nIdx;
			trxCode += "|" + sDate + "&" + screenName + "&" + startTime;
			trxCode += "|" + inDataStr;

			if (arg)
				strUrl += arg;

			if($w.getSubmission( trxCode ) != null){
				$w.deleteSubmission(trxCode);
			} 
			/************************* 통신하기 시작 *************************/
			//서브미션오브젝트 options
			var submissionObj = {
				"id" : trxCode,
				"ref" : "",
				"target" :"",
				"action" : strUrl,
				"isAuth" : "Y",
				"method" : "post",
				"mediatype" : 	"application/json",
				"encoding" : "UTF-8",
				"instance" : "",
				"replace" : "",
				"mode" : syncType,
				"processMsg" : "$blank",
				"submitDoneHandler" : function(e) {
					var result 	 	= e.responseJSON;
					var params		= result.params;
					var errorCd		= new Array(); //result.params.ErrorCode;
					var errorMsg 	= new Array(); //result.params.ErrorMsg;
					var orgTrxCode 	= trxCode.split("|");
					try {
						for(var i=0; i<params.length; i++){
							var errorJSON = params[i];
							errorCd.push(errorJSON.ErrorCode);
							errorMsg.push(errorJSON.ErrorMsg);
						}

						//통신성공인 경우
						if(Number(errorCd[0]) == 0){

							var jsonRow, id, key, ds, output;
							for(var i=0; i<resTempArr.length; i++){
								try {
									if (resTempArr[i] == "") continue;

									jsonRow = JSON.parse(resTempArr[i]);
									id 	= jsonRow.id;
									key = jsonRow.key;
									ds	= null;
									output = result[key];
									if(output == undefined || output == "undefined" || output == null || output.length <= 0){
										if (result[(key -1)]) output = result[(key -1)];
										else continue;
									}

									if (id.startsWith("GLD.")) ds = GLD[id.replace("GLD.","")];
									else ds = ngmf.object(id);

									if (!ds) continue;

									//동적으로 컬럼을 만들어준다.
									if(output.length > 0){
										if (clearDs){
											ngmf.clear(ds);
											$.each(output[0], function(mapKey, mapValue, mapIdx){
												ds.insertColumn(mapKey, {
													name:		mapKey,
													dataType:	"text"
												});
											});
										} else {
											ds.removeAll();
										}
										ds.setJSON( output , false );
										ds.reform();
									}
								} catch (ex) {
									ngmf._error("[ngmf.promise._commonMainTransaction submitDoneHandler] Exception :: ", ex); 
								}
							}

						} 
						ngmv.errorCode 	= errorCd;
						ngmv.errorMsg 	= errorMsg; 
						if (syncType == "synchronous") {
							ngmf.syncAPMCallBack(trxCode, ngmv.errorCode, ngmv.errorMsg);
							ngmf.getArrayTranErrorMsg(
								ngmv.errorCode, ngmv.errorMsg,
								ngmv_MsgFg, strErrDsList, nIdx, orgTrxCode[0], sDate,
								screenName, startTime, 0, GLV["__smElapsedTime" + nIdx], GLV["__smGlobalId" + nIdx],inDataStr, "SYNC", callBackFunc
							);
						} else if (syncType == "asynchronous") {
							ngmf.result(trxCode, ngmv.errorCode, ngmv.errorMsg);
						}
						resolve("Y");
					} catch (ex) {
						ngmf._error("[ngmf.promise._commonMainTransaction executeSubmission] Exception :: ", ex);
						ngmv.errorCode 	= -999;
						ngmv.errorMsg 	= e.message;
						resolve("N");
					}
				}, // [end] "submitDoneHandler"
				"submitErrorHandler" : function(e) {
					ngmv.errorCode 	= -999;
					ngmv.errorMsg 	= e.message;
					resolve("N");
					ngmf._errorHandlingMsg(e);
				} // [end] "submitErrorHandler"
			};

			$w.createSubmission(submissionObj); //서브미션 생성
			$w.executeSubmission(trxCode,reqData);  //서브미션 실행
			/************************* 통신하기 종료 *************************/
		} catch (e) {
			ngmf._error("[ngmf.promise._commonMainTransaction] Exception :: ", e);
			ngmv.errorCode 	= -999;
			ngmv.errorMsg 	= e.message;
			resolve("N");
		}
	});
}; 
 
ngmf._saveTextAsFile = function (textMsg, localUrl) {
	var retMsg = false;
	try {
		if (typeof textMsg == "undefined" || typeof localUrl == "undefined" || !textMsg || !localUrl) return retMsg;
		var textBlob = new Blob([textMsg],{type:"text/plain"});
		//var fileNameToSave = document.getElementById("file0").value;
		if (typeof window.navigator.msSaveBlob == "function") {
			//IE 파일저장...
			window.navigator.msSaveBlob(textBlob, localUrl);
		} else {
			var downloadLink = document.createElement("a");
			downloadLink.download = localUrl;
			downloadLink.innerHTML = "Download File"; 
			downloadLink.href = window.URL.createObjectURL(textBlob);
			downloadLink.onclick = function(event){ document.body.removeChild(event.target);};
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink); 
			downloadLink.click();
		}
		retMsg = true;
	} catch (ex) {
		ngmf._error("[ngmf._saveTextAsFile] Exception :: ", ex);
	}
	return retMsg;
};

/**
 * 암호화, 비암호화 게시판 업로드 권한 체크(암호화 모듈 도입후 재정의)
 * @date 2016.3.18
 * @memberOf ngmf
 * @param {String} file_url :: I :: N ::  :: File 경로(전체경로명+파일명)
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판 1 : 암호화 게시판
 * @returns {String} 결과  Y(업로드 가능), N(업로드 불가능)
 * @author 성일호
 * @useMobile use
 * @example
 * @since
 */ 
ngmf.promise._singleFileAclCheck = function(fileObj, enc) {
	return new Promise( function(resolve, reject) {
		try {
			if (!fileObj) throw "변환 대상 파일이 없습니다."; 
			if (typeof fileObj == "string") {
				fileObj = ngmf.object(fileObj);
			}
			//if (typeof fileObj["type"] == "undefined") resolve("Y");
			if (fileObj) {
				if (typeof  fileObj.getPluginName != "undefined" && fileObj.getPluginName().toLowerCase() == "upload" ) {
					fileObj = document.getElementById(fileObj.getID()+ "_fakeinput").files[0];
				} else if (typeof  fileObj.type != "undefined" && fileObj.type == "file" ) {
					fileObj = fileObj.files[0];
				} 
				if (fileObj) {
					return ngmf.promise.extFileAclCheckProc(fileObj)
					.then(function(rtnVal) {
						if (enc == 0 || enc == 1) {
							//보안모듈 설치여부 확인은 건너뜀
							if (rtnVal == 0) {
								if (enc == 0) {
									// 보안문서를 업로드 할 수 없습니다. 보안문서를 암호화 해제한 후 시도하시기 바랍니다.
									ngmf.alert(ngmf.getMessage("ZNGMC1161", "&ITEM", "보안문서를 업로드 할 수 없습니다."));
								} else {
									// SKT 보안문서를 업로드(IMPORT) 할 권한이 없습니다. (암호화게시판)
									ngmf.alert(ngmf.getMessage("ZNGMC1160", "", ""));
								}
								resolve("N");
							}
							if (enc == 0 && rtnVal == 1) {
								// 보안문서를 업로드 할 수 없습니다. 보안문서를 암호화 해제한 후 시도하시기 바랍니다.
								ngmf.alert(ngmf.getMessage("ZNGMC1161", "&ITEM", "보안문서를 업로드 할 수 없습니다."));
								resolve("N");
							}
							if (rtnVal == 2) {
								// 2인 경우, 복호화처리 생략을 위해 추가
								resolve("Y");
							}
							resolve("Y");
						} else if (enc == 2) {
							resolve("Y");
						} else {
							resolve("N");
						}
					})
					.then(undefined, function(e) {
						ngmf._error("[ngmf.promise.singleFileAclCheck] Exception :: ", e);
						resolve ("N");
					}); 
				} else throw "지원가능 파일이 아니거나 파일이 없습니다.";
			} else throw "변환 대상 파일이 없습니다.";
			
		} catch (e) {
			ngmf._error("[ngmf.promise.singleFileAclCheck] Exception :: ", e);
			resolve("N"); 
		}
	});
};

/**
 * 암호화, 비암호화 게시판 업로드 권한 체크(암호화 모듈 도입후 재정의)
 * @date 2016.3.18
 * @memberOf ngmf
 * @param {Array} fileList :: I :: N ::  :: 파일 객체 배열
 * @param {Boolean} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판 1 : 암호화 게시판
 * @returns {String} Y(업로드 가능), N(업로드 불가능)
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 */ 
ngmf.promise._multiFileAclCheck = function(fileList, enc) {
	return new Promise(function(resolve, reject) {
		try {
			if (!fileList || fileList.length < 0) {
				resolve("N"); 
			}
			var promiseArr = new Array();
			for (var ix = 0; ix < fileList.length ; ix++) {
				promiseArr.push(ngmf.promise.extFileAclCheckProc(fileList[ix]));
			}
			if (promiseArr.length > 0) {
				Promise.all(promiseArr)
				.then( function( retObjArr ) {  
					var rtnVal = null;
					var rsltVal = "Y";
					for (var i = 0 ; i < retObjArr.length; i++) {
						rtnVal = retObjArr[i];
						if (enc == 0 || enc == 1) {
							//보안모듈 설치여부 확인은 건너뜀
							if (rtnVal == 0) {
								if (enc == 0) {
									// 보안문서를 업로드 할 수 없습니다. 보안문서를 암호화 해제한 후 시도하시기 바랍니다.
									ngmf.alert(ngmf.getMessage("ZNGMC1161", "&ITEM", "보안문서를 업로드 할 수 없습니다."));
								} else {
									// SKT 보안문서를 업로드(IMPORT) 할 권한이 없습니다. (암호화게시판)
									ngmf.alert(ngmf.getMessage("ZNGMC1160", "", ""));
								}
								resolve("N");
							}
							if (enc == 0 && rtnVal == 1) {
								// 보안문서를 업로드 할 수 없습니다. 보안문서를 암호화 해제한 후 시도하시기 바랍니다.
								ngmf.alert(ngmf.getMessage("ZNGMC1161", "&ITEM", "보안문서를 업로드 할 수 없습니다."));
								resolve("N");
							}
						} else if (enc == 2) {
							resolve("S");
						} else {
							resolve("N");
						}
					}
					resolve(rsltVal);
				})
				.then(undefined, function(e) {
					ngmf._error("[ngmf.promise.multiFileAclCheck] Exception :: ", e);
					resolve ("N");
				});
			} else {
				resolve("Y");
			} 	  
		} catch (e) {
			ngmf._error("[ngmf.promise.multiFileAclCheck] Exception :: ", e);
			resolve("N"); 
		}
	});
};
 
 
/**
 * 이미지 다운로드 후 미리보기
 * @date 2016.03.22
 * @memberOf ngmf
 * @param {String} atfilId :: I :: N ::  :: 파일 ID
 * @param {String} PreviewDivId :: I :: N ::  :: 프리뷰 보여줄 DIV 객체 ID
 * @returns {String} Y,N 
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_SAMPLE
 * @example  ngmf.previewFileImage("73783395","imagePreview");
 */
ngmf.previewFileImage = function (atfilId, previewDivId) {
	ngmf.promise.previewFileImage(atfilId,previewDivId)
	   .then( function (retObj) { 
		   		if (!retObj ||  retObj != "Y")  ngmf.alert("File Down 실패::");
			}) 
		.then( undefined, function (e) { 
			if ( e["message"]) 
			 	ngmf.alert("File Down 실패::" + e["message"]);
			else	
				ngmf.alert("File Down 실패::" + e[1]);
		}); 
};



/**
 *  Batch 파일 다운로드 (Promise)
 * @date 2016.03.29.
 * @memberOf ngmf
 * @param {String} atfilId :: I :: N ::  :: 파일 ID
 * @param {Boolean} eFlag :: I :: Y ::  :: 0 : 메시지 popup 
 * @returns {Object} Promise : String
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_SAMPLE
 * @example
	ngmf.promise.batDownloadFile("73784871", 1)
   .then( function (retObj) {
		if (retObj[0]== "Y") {
			// retObj[1] =>  csv 파싱로직 추가 필요...
			
		} else { ngmf.alert("Batch 파일 다운로드 오류:::" + retObj[1]);}
	}) 
	.then( undefined, function (retObj) {
		if (retObj["message"]) {
			ngmf.alert("Batch 파일 다운로드 오류:::" + retObj["message"]);
		} else ngmf.alert("Batch 파일 다운로드 오류:::" + retObj[1]);
	});	
 * @since
 */
ngmf.promise.batDownloadFile = function(atfilId, eFlag) {
	return new Promise(function(resolve, reject) {
		try {
			if (ngmf.isNull(atfilId) == "Y") { 
				throw ngmf.getMessage("ZNGMC0072");
			} 
			var sSerVal = ngmf.getFileList(atfilId, null, 1);
			var filesize = null;
			var filepath = null;
			var fileName = null;
			if (sSerVal[0] == "Y") {
				filesize = GLD.GDS_OUTDUMMY.getCellData(0, "atfil_size");
				filepath = ngmf.urlDecode(GLD.GDS_OUTDUMMY.getCellData(0, "save_path_nm"));
				fileName = ngmf._getDownloadFileName(GLD.GDS_OUTDUMMY.getCellData(0, "atfil_nm"), filepath); 
			} else {
				ngmf.setWindowStatusMsg("E",ngmf.getMessage("ZNGMC0065"));
				throw ngmf.getMessage("ZNGMC0065");
			}
			if (ngmf.isNull(filepath) == "Y" || ngmf.isNull(filesize) == "Y") {	
				ngmf.setWindowStatusMsg("E",ngmf.getMessage("ZNGMC0065"));
				throw ngmf.getMessage("ZNGMC0065");
			} else {
				ngmf.promise._fileReadMem(filepath, 2)
				   .then( function (retObj) { 
					   		resolve(retObj["result"]);
						}) 
					.then( undefined, function (e) {
						var sRtnVal = new Array();
						ngmf.setWindowStatusMsg("E","[batDownloadFile : ngmf.promise._fileReadMem] 실패["+fileName+"] :: " +  e.message);
						if (eFlag) { 
							sRtnVal[0] = "N";
							sRtnVal[1] = e.message || e[1];
						} else {
							sRtnVal = "N";
						} 
						resolve(sRtnVal);
					}); 
			}
		} catch (e) {
			var sRtnVal = "N";
			if (eFlag) { 
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = e.message;
			}
			ngmf._error("[ngmf.promise.batDownloadFile] Exception :: ", e);
			resolve (sRtnVal);
		} 
	});
};
 

/**
 * 이미지 다운로드 후 미리보기
 * @date 2016.03.22
 * @memberOf ngmf
 * @param {String} atfilId :: I :: N ::  :: 파일 ID
 * @param {String} PreviewDivId :: I :: N ::  :: 프리뷰 보여줄 DIV 객체 ID
 * @param {Number} eFlag :: I :: Y ::  :: 결과 메세지 출력방법 1 : array, 2: string
 * @returns {Promise} : Array/String 
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_SAMPLE
 * @example 
 * 				ngmf.promise.previewFileImage("73783395","imagePreview")
				   .then( function (retObj) { 
					   		if (retObj && retObj =="Y")  ngmf.alert("성공::");
					   		else ngmf.alert("실패::"+ retObj);
						}) 
					.then( undefined, function (e) { 
						if ( e["message"]) 
						 	ngmf.alert("실패::" + e["message"]);
						else	
							ngmf.alert("실패:: " + e[1]);
					}); 
 */
ngmf.promise.previewFileImage = function (atfilId, previewDivId,  eFlag) {
	return new Promise(function(resolve, reject) {
		try {
			if (ngmf.isNull(atfilId) == "Y") { 
				throw ngmf.getMessage("ZNGMC0072");
			}
			
			var previewDiv = document.getElementById(previewDivId);
		   	var oPreviewImg = null;
			if (!previewDiv) {
				throw "이미지를 표현할 DIV 객체가 없습니다."; 
			}
			
			if (!ngmf.object(previewDivId))  {
				throw "Preview 대상 객체가 없습니다.";
			} 
			var sSerVal = ngmf.getFileList(atfilId, null, 1);
			var filesize = null;
			var filepath = null;
			var fileName = null;
			if (sSerVal[0] == "Y") {
				filesize = GLD.GDS_OUTDUMMY.getCellData(0, "atfil_size");
				filepath = ngmf.urlDecode(GLD.GDS_OUTDUMMY.getCellData(0, "save_path_nm"));
				fileName = ngmf.urlDecode(GLD.GDS_OUTDUMMY.getCellData(0, "atfil_nm"));
			} else {
				ngmf.setWindowStatusMsg("E",ngmf.getMessage("ZNGMC0065"));
				throw ngmf.getMessage("ZNGMC0065");
			}
			if (ngmf.isNull(filepath) == "Y" || ngmf.isNull(filesize) == "Y") {	
				ngmf.setWindowStatusMsg("E",ngmf.getMessage("ZNGMC0065"));
				throw ngmf.getMessage("ZNGMC0065");
			} else if (!ngmf._getCheckMimeType(fileName)) {	
				ngmf.setWindowStatusMsg("E","FileName=" + fileName);
				throw "지원하지 않는 파일입니다.";
			} else {
				ngmf.promise._fileReadMem(filepath, 3)
				   .then( function (retObj) { 
						var sRtnVal = new Array();
					   		if (retObj["result"] && retObj["result"][0]=="Y") {
					   			var isSetSize = false;
					   			if (!previewDiv.clientWidth) {
					   				isSetSize = true;
					   			}
								oPreviewImg = document.getElementById(previewDivId + "IMG");
								if (!oPreviewImg) {
									oPreviewImg = new Image();
									oPreviewImg.id = previewDivId + "IMG";
									if (!isSetSize) {
										oPreviewImg.style.width = previewDiv.clientWidth + "px";
										oPreviewImg.style.height = previewDiv.clientHeight + "px";	
									}
									previewDiv.appendChild(oPreviewImg);
								} else if (!isSetSize && previewDiv.clientWidth != oPreviewImg.width) {
									oPreviewImg.style.width = previewDiv.clientWidth + "px";
									oPreviewImg.style.height = previewDiv.clientHeight + "px";	
								}		
								oPreviewImg.title = fileName;
								ngmf.promise._previewSetSrc(retObj["result"][1],oPreviewImg.id)
								.then(function(ret){
									if (eFlag) { 
										sRtnVal = ret ; 
									} else {
										sRtnVal = ret[0];
									} 
									resolve(sRtnVal);
								})
								.then(undefined,function(e) {
									ngmf.setWindowStatusMsg("E","[ngmf.promise._previewFileImage] 실패["+fileName+"] :: "+ (e.message || e));
									if (eFlag) { 
										sRtnVal[0] = "N";
										sRtnVal[1] = e.message || e;
									} else {
										sRtnVal = "N";
									} 
									resolve(sRtnVal);
								}); 
					   		}
					   		else {
					   			ngmf.setWindowStatusMsg("E","[ngmf.promise._previewFileImage] 실패["+fileName+"] :: " + retObj["result"][1]);
								if (eFlag) { 
									sRtnVal[0] = "N";
									sRtnVal[1] =  retObj["result"][1];
								} else {
									sRtnVal = "N";
								} 
								resolve(sRtnVal);
					   		}
						}) 
					.then( undefined, function (e) {
						ngmf.setWindowStatusMsg("E","[ngmf.promise._previewFileImage] 실패["+fileName+"] :: " +  e.message);
						if (eFlag) { 
							sRtnVal[0] = "N";
							sRtnVal[1] = e.message;
						} else {
							sRtnVal = "N";
						} 
						resolve(sRtnVal);
					}); 
			}
		} catch (e) {
			var sRtnVal = "N";
			if (eFlag) { 
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = e["message"] || e;
			}
			ngmf._error("[ngmf.promise.previewFileImage] Exception :: ", e);
			resolve (sRtnVal);
		} 
	});
};

/**
 * 이미지 다운로드 후 미리보기-Multi Image 파일
 * @date 2016.03.22
 * @memberOf ngmf
 * @param {String} ds_file :: I :: N ::  :: Multi-File Data Set
 * @param {Number} nRow :: I :: N ::  :: 대상 행 Index
 * @param {String} PreviewDivId :: I :: N ::  :: 프리뷰 보여줄 DIV 객체 ID
 * @param {Number} eFlag :: I :: Y ::  :: 결과 메세지 출력방법 1 : array, 2: string
 * @returns {Promise} : Array/String 
 * @author 성일호
 * @useMobile useless
 * @example ngmf.promise.previewMultiFileImage(ds_file,1,"imagePreview",1)
 */
ngmf.promise.previewMultiFileImage = function (_ds_file, _nRow, previewDivId, eFlag) { 
	return new Promise(function(resolve, reject) {
		try {
			var ds_file = ngmf.object(_ds_file);
			if (!ds_file) { 
				throw ngmf.getMessage("ZNGMC0072");
			}
			if (typeof _nRow == "undefined" || _nRow == null) { 
				throw ngmf.getMessage("ZNGMC0072");
			}
			var nRow = Number(_nRow);
			if (ds_file.getRowCount() <= nRow)   throw ngmf.getMessage("ZNGMC0072");
			
			var previewDiv = document.getElementById(previewDivId);
			if (!previewDiv) {
				throw "이미지를 표현할 DIV 객체가 없습니다."; 
			} 
			
			var filesize = ds_file.getCellData(nRow, "size"); // atfil_size
			var filepath = ds_file.getCellData(nRow, "savePathNm"); //, save_path_nm
			var fileName = ds_file.getCellData(nRow, "file"); //atfil_nm

			if (ngmf.isNull(filepath) == "Y" || ngmf.isNull(filesize) == "Y") {	
				ngmf.setWindowStatusMsg("E",ngmf.getMessage("ZNGMC0065"));
				throw ngmf.getMessage("ZNGMC0065");
			} else if (!ngmf._getCheckMimeType(fileName)) {	
				ngmf.setWindowStatusMsg("E","FileName=" + fileName);
				throw "지원하지 않는 파일입니다.";
			} else {
				ngmf.promise._fileReadMem(filepath, 3)
				   .then( function (retObj) { 
						var sRtnVal = new Array();
					   	var oPreviewImg = null;
					   		if (retObj["result"] && retObj["result"][0]=="Y") { 
								oPreviewImg = document.getElementById(previewDivId + "IMG");
								if (!oPreviewImg) {
									oPreviewImg = new Image();
									oPreviewImg.id = previewDivId + "IMG";
									if (previewDiv.clientWidth) {
										oPreviewImg.style.width = previewDiv.clientWidth + "px";
										oPreviewImg.style.height = previewDiv.clientHeight + "px";	
									}
									previewDiv.appendChild(oPreviewImg);
								} else if (previewDiv.clientWidth && previewDiv.clientWidth > 0 && previewDiv.clientWidth != oPreviewImg.width) {
									oPreviewImg.style.width = previewDiv.clientWidth + "px";
									oPreviewImg.style.height = previewDiv.clientHeight + "px";	
								}
								oPreviewImg.title = fileName;
								ngmf.promise._previewSetSrc(retObj["result"][1],oPreviewImg.id)
								.then(function(ret){
									if (eFlag) { 
										sRtnVal = ret ; 
									} else {
										sRtnVal = ret[0];
									}
									resolve(sRtnVal); 
								})
								.then(undefined,function(e) {
									ngmf.setWindowStatusMsg("E","[ngmf.promise._previewSetSrc] 실패["+fileName+"] :: " + (e.message || e));
									if (eFlag) { 
										sRtnVal[0] = "N";
										sRtnVal[1] = e.message || e;
									} else {
										sRtnVal = "N";
									} 
									resolve(sRtnVal);
								}); 
					   		}
					   		else {
					   			ngmf.setWindowStatusMsg("E","[ngmf.promise._previewSetSrc] 실패["+fileName+"] :: " + retObj["result"][1]);
								if (eFlag) { 
									sRtnVal[0] = "N";
									sRtnVal[1] = e.message;
								} else {
									sRtnVal = "N";
								} 
								resolve(sRtnVal);
					   		}
						}) 
					.then( undefined, function (e) {
						ngmf.setWindowStatusMsg("E","[ngmf.promise._fileReadMem] 실패["+fileName+"] :: " +  e.message);
						if (eFlag) { 
							sRtnVal[0] = "N";
							sRtnVal[1] = e.message;
						} else {
							sRtnVal = "N";
						} 
						resolve(sRtnVal);
					}); 
			}
		} catch (e) {
			var sRtnVal = "N";
			if (eFlag) { 
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = e["message"] || e;
			}
			ngmf._error("[ngmf.promise.previewMultiFileImage] Exception :: ", e);
			resolve (sRtnVal);
		} 
	});
};
 

ngmf.promise._previewSetSrc = function (blobData, imageId) {
	return new Promise(function(resolve, reject) {
		
		var  oFReader =  new window.FileReader();
		oFReader.onerror = function (e) {
			reject(["N", ""]);
		};
		oFReader.onload = function(oFREvent) {
			var onloadPreviewImg = document.getElementById(imageId);  
			onloadPreviewImg.src = oFREvent.target.result; 						
			blobData = null;
			resolve(["Y", {width:(onloadPreviewImg.naturalWidth || onloadPreviewImg.width) , height:(onloadPreviewImg.naturalHeight  || onloadPreviewImg.height)}]);
		};
		oFReader.readAsDataURL(blobData);
	});
};

ngmf._getCheckMimeType = function(fileName) {
	try { 
		var type = ngmf.chkMimeType(fileName);
		if (!type) return false;
		switch (type.toLowerCase()) { 
		case "png":
		case "jpg":
		case "gif":
		case "bmp":
			return true;
			break;
		}
	} catch (e) {
		ngmf._error("[ngmf._getCheckMimeType ] Exception :: ", e);
	}
	return false;
}; 

ngmf._getCheckMimeTypeText = function(fileName) {
	try { 
		if (fileName.toUpperCase().indexOf("CLOB") > -1) return true;
		
		var type = ngmf.chkMimeType(fileName);
		if (!type) return false;
		switch (type.toLowerCase()) { 
		case "txt":
		case "csv":
		case "xml":
			return true;
			break;
		}
	} catch (e) {
		ngmf._error("[ngmf._getCheckMimeTypeText ] Exception :: ", e);
	}
	return false;
}; 

/**
 * 단일 파일에 대한 파일 삭제 서비스 호출(Promise)
 * @date 2016.03.24
 * @memberOf ngmf
 * @param {String} aftilId :: I :: N ::  :: 대상파일ID
 * @param {Number} eFlag :: I :: Y ::  :: 메시지 팝업 여부 
 * @returns Promise : {String / Array} [결과(Y,N), 메시지코드]
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_SAMPLE
 * @example  
     ngmf.promise.deleteSingleFile(inpAtfilIdM.getValue(), 1)
     .then( function(retObj) {
       	if (retObj[0] == "Y") {
       		ngmf.alert("파일 삭제 성공");
       	} else {
       		ngmf.alert("파일 삭제 실패::" + ngmf.getErrMessage(retObj[1]) );
       	}
       })
	 .then(undefined, function(e) { 
		if ( e["message"]) 
		 	ngmf.alert("실패::" + e["message"]);
		else	
			ngmf.alert("실패:: " + e[1]);
	});  
 */
ngmf.promise.deleteSingleFile=  function (aftilId, eFlag) {
	return ngmf.promise._deleteSingleFile (aftilId, eFlag);
};

/** 
 * CLOB 처리를 위한 File에 대한 DownLoad(Promise)
 * @date 2016.03.24
 * @memberOf ngmf 
 * @param {String} atfilId :: I :: N ::   ::	File ID
 * @param {String} strModule :: I :: Y ::   ::	current driver://SKT// + Moudle명 [미사용]
 * @param {String} strFile :: I :: Y :: DownTempStr.txt  ::	down할 file name - default : DownTempStr.txt [미사용]
 * @return Promise : {String} fileText 
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_SAMPLE
 * @example 
			ngmf.promise.clobFileDown("73783447")
			.then( function(retMsg) {
				//clobText.setValue( retMsg );
				ngmf.alert("ClobFile내용=" + retMsg);
			})
			.then(undefined, function(e) {
				if ( e["message"]) 
				 	ngmf.alert("실패::" + e["message"]);
				else	
					ngmf.alert("실패:: " + e[1]);
			});
 */
ngmf.promise.clobFileDown = function(atfilId, strModule, strFile){
	return ngmf.promise._clobFileDown(atfilId);
};

/** 
 * CLOB 처리를 위한 File UpLoad(Promise)
 * @date 2016.03.24
 * @memberOf ngmf 
 * @param {String} lsFileText :: I :: N ::   ::	CLOB Data
 * @param {String} strModule :: I :: Y ::   ::	current driver://SKT// + Moudle명 [미사용]
 * @param {String} strFile 	:: I :: Y ::   ::	upload할 file name - default : UpTempStr.txt 
 * @param {String} nexpDate	:: I :: N ::   ::	유효일자 추가 ('0' : 영구, '1' :  3년)
 * @param {Boolean} bSizeChkFg :: I :: Y :: 5120  ::	SIZE를 체크할지 여부 (DEFAULT : 5120)
 * @param {Boolean} bLockFg	:: I :: N ::   ::	보안처리 여부  TRUE/FALSE 
 * @return Promise : {String} Locla File ID
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless
 * @example 
		 	ngmf.promise.clobFileUp("가나다라마바사아....",null, "aaa.csv", "1", false, 0)
			.then( function(fileId) {
				//clobFileId.setValue( fileId );
				ngmf.alert("FileID=" + fileId);
			})
			.then(undefined, function(e) { 
				if ( e["message"]) 
				 	ngmf.alert("실패::" + e["message"]);
				else	
					ngmf.alert("실패:: " + e[1]);
			});
 */ 
ngmf.promise.clobFileUp = function(lsFileText, strModule, strFile, nexpDate, bSizeChkFg, bLockFg){
	return ngmf.promise._clobFileUp(lsFileText, nexpDate, bSizeChkFg, bLockFg, strFile);
};

/**
 * 전자서명관리화면 요청(Primise)
 * @date 2016.03.24
 * @memberOf ngmf
 * @param {String} comm_cd_id :: I :: N ::  :: 업무구분(mid)
 * @param {String} file_del_yn :: I :: N ::  :: 파일삭제여부
 * @param {String / Json} dst_sign_out :: I :: N ::  :: 대상 데이터셋 
 * @returns Primise : {Boolean} true/false
 * @sampleLink ATFIL_SAMPLE
 * @author 성일호
 * @useMobile useless
 * @example
		ngmf.promise.callElecSign ("CLM", "N", dst_sign_out)
		   .then( function (retObj) {
		   			if(retObj) ngmf.alert("처리완료");
		   			else  ngmf.alert("처리실패");
				}) 
			.then( undefined, function (retObj) {
		   			else  ngmf.alert("처리실패");
			});
 */
ngmf.promise.callElecSign = function(comm_cd_id, file_del_yn, dst_sign_out) {
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.promise.callElecSign : 모바일환경에서 지원불가 API 입니다.");
		return Promise.resolve();
	}

	return ngmf.promise._callElecSign (comm_cd_id, file_del_yn, dst_sign_out); 
};

/**
 *  파일다운로드 (Promise)
 * @date 2016.03.29
 * @memberOf ngmf
 * @param {String} fileName :: I :: N ::  :: 다운로드될 파일이름
 * @param {String} str_cookie :: I :: N ::  :: 다운로드 파일 서버 경로
 * @param {Object} paramMap :: I :: Y ::  :: 기타 매개값
 * @param {String / Json} progressFunc  :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @returns {Object}  Promise
 * @author 성일호
 * @useMobile useless
 * @example
 * @since
 * @useMobile useless
 */
ngmf.promise.fileRead = function (fileName, str_cookie,  progressFunc){
	return ngmf.promise._fileRead(file_url, str_cookie, {},  progressFunc);
}; 


/**
 * 파일업로드 (Promise)
 * @date 2016.03.29
 * @memberOf ngmf
 * @param {Object} fileObj :: I :: N ::  :: 업로드할 파일 객체
 * @param {String} str_param :: I :: N ::  :: UPLOAD 시 필요한 파라미터(사용자 ID)
 * @param {String / Json} progressFunc :: I :: Y ::  :: 업로드 프로그래스 처리용 CALLBACK FUNCTION
 * @param {String} chkacl :: I :: Y ::  ::  01=게시판 암호화, 1X=Batch import
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile useless
 * @example
 * @useMobile useless
 */
ngmf.promise.fileWrite = function ( fileObj, str_param, progressFunc){
	return ngmf.promise._fileWrite (fileObj, {userId : str_param || ngmf.getGlobalValue("g_Ngms_UserId")}, progressFunc);
};


/**
 * 파일 암호화 여부 확인(Promise)
 * @date 2016.03.31
 * @memberOf ngmf
 * @param {Object} fileObj :: I :: N ::  :: 업로드할 파일 객체
 * @returns {Promise/Number} 1 = 암호화된 파일 , 2 = 비암호화 파일, 0 =  암호화 확인 불가(권한등) 
 * @author 성일호
 * @useMobile use
 * @example
			return ngmf.promise.extFileAclCheckProc(fileObj)
			.then(function(rtnVal) {
				if (enc == 0 || enc == 1) {
					//보안모듈 설치여부 확인은 건너뜀
					if (rtnVal == 0) {
						if (enc == 0) {
							// 보안문서를 업로드 할 수 없습니다. 보안문서를 암호화 해제한 후 시도하시기 바랍니다.
							ngmf.alert(ngmf.getMessage("ZNGMC1161", "&ITEM", "보안문서를 업로드 할 수 없습니다."));
						} else {
							// SKT 보안문서를 업로드(IMPORT) 할 권한이 없습니다. (암호화게시판)
							ngmf.alert(ngmf.getMessage("ZNGMC1160", "", ""));
						}
						resolve("N");
					}
					if (enc == 0 && rtnVal == 1) {
						// 보안문서를 업로드 할 수 없습니다. 보안문서를 암호화 해제한 후 시도하시기 바랍니다.
						ngmf.alert(ngmf.getMessage("ZNGMC1161", "&ITEM", "보안문서를 업로드 할 수 없습니다."));
						resolve("N");
					}
					if (rtnVal == 2) {
						// 2인 경우, 복호화처리 생략을 위해 추가
						resolve("S");
					}
					resolve("Y");
				} else if (enc == 2) {
					resolve("Y");
				} else {
					resolve("N");
				}
			})
			.then(undefined, function(e) {
				ngmf._error("[ngmf.promise.singleFileAclCheck] Exception :: ", e);
				resolve ("N");
			});
 */
ngmf.promise.extFileAclCheckProc = function(fileObj){
	return new Promise(function(resolve, reject) {
		try {
			if(typeof fileObj == "undefined" || !fileObj) throw "대상 파일이 없습니다.";
			if (typeof window.FileReader == "function") {
				var oFReader = new window.FileReader();
				oFReader.onload = function(oFREvent) {
					if (oFREvent.target.result.startsWith("SCDSA00")) resolve(1);
					else resolve(2); 
				};
				oFReader.readAsBinaryString(fileObj.slice(0,7));
			} else throw new Error("미지원 브라우저 입니다.");
		} catch (e) {
			ngmf._error("[ngmf.promise.extFileAclCheckProc ] Exception :: ", e);
			if(ngmf.isMobile()) {
				resolve(2);
			} else  resolve(0);
		}
	});
};

/**
 * 단일업로드 선택파일 찾기
 * @date 2016.03.31
 * @memberOf ngmf
 * @param {String / Json} uploadComp :: I :: N ::  ::  파일 UPLOAD 객체
 * @returns {Object} 선택된 파일 Object
 * @author 성일호
 * @useMobile useless
 * @example 
 */
ngmf.getSingleFileObj = function (uploadComp){
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.getSingleFileObj : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try {
		if (uploadComp) {
			var uploadCompId = "";
			if (typeof uploadComp == "string") {
				uploadCompId = uploadComp;
				uploadComp = ngmf.object(uploadCompId);
			} else uploadCompId = uploadComp.getID();
			if (uploadComp.getValue()) return document.getElementById(uploadCompId + "_fakeinput").files[0];
		}
	} catch (e) {
		ngmf._error("[ngmf.getSingleFileObj] Exception :: ", e); 
	}
	return null;
};


/**
 * 멀티업로드 선택파일 찾기
 * @date 2016.03.31
 * @memberOf ngmf
 * @param {String / Json} uploadComp :: I :: N ::  ::  파일 UPLOAD 객체 ID
 * @param {String} fileName :: I :: N ::  :: 선택된 파일 이름
 * @returns {Object} 선택된 파일 Object
 * @author 성일호
 * @useMobile useless
 * @example 
 */
ngmf.getMultiFileObj = function (uploadComp, fileName){

	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.getMultiFileObj : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try {
		if (uploadComp &&  fileName) {
			var uploadCompId = "";
			if (typeof uploadComp == "string") uploadCompId = uploadComp;
			else uploadCompId = uploadComp.getID();
			
			var fileList = scvar[uploadCompId + "_files"];
			if (fileList && fileList.length > 0) {
				for (var i=0; i < fileList.length; i++) {
					if ( fileList[i].name ==  fileName) return fileList[i];
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getMultiFileObj ] Exception :: ", e); 
	}
	return null;
};

/**
 * 멀티업로드 선택된 파일 삭제
 * @date 2016.03.31
 * @memberOf ngmf
 * @param {String / Json} uploadComp :: I :: N ::  :: 파일 UPLOAD 객체 ID
 * @param {String / Json} ds_file :: I :: N ::  :: 파일정보관리 DATA LIST
 * @param {String} fileName :: I :: N ::  :: 선택된 파일 이름
 * @returns {Object} 선택된 파일 Object
 * @author 성일호
 * @useMobile useless
 * @example 
 */
ngmf.removeMultiFileObj = function (uploadComp, _ds_file,  fileName){
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.removeMultiFileObj : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try {
		if (uploadComp &&  fileName) {
			var uploadCompId = "";
			if (typeof uploadComp == "string") uploadCompId = uploadComp;
			else uploadCompId = uploadComp.getID(); 
			var ds_file = ngmf.object(_ds_file);			
			var fileList = scvar[uploadCompId + "_files"];
			if (ds_file && fileList) {
				var mIndex = ds_file.getMatchedIndex("file",fileName);
				if (mIndex.length > 0) {
					ds_file.removeRow(mIndex[0], {noEvent:true});
					ngmf._removeFileObjArr(fileList, fileName);
				}				
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.removeMultiFileObj] Exception :: ", e);
		return false;
	}
	return true;
};

ngmf._removeFileObjArr = function (fileList,  fileName){ 
	try {
		if (fileList && fileList.length > 0) {
			for (var i=0; i < fileList.length; i++) {
				if ( fileList[i].name ==  fileName) {
					delete fileList.splice(i,1);
					return true;
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._removeFileObjArr] Exception :: ", e);
		return false;
	}
	return true;
};

/**
 * 그리드 업로드 선택된 파일 정보 조회
 * @date 2016.03.31
 * @memberOf ngmf
 * @param {String / Json} gridObj :: I :: N ::  :: 파일정보 보여줄 그리드 객체 또는 ID
 * @param {String} fileName :: I :: N ::  :: 선택된 파일 이름
 * @returns {Object} 파일관리 DataSet JSON ROW { atfilId: "" ,atfilSerNum: "" ,chk: "1" ,del: "0" ,file: "Desert.jpg" ,rowStatus: "C" ,savePathNm: "" ,size: 845941 ,trxCode: "i" }
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_GRIDSAMPLE
 * @example 
 */
ngmf.getGridFileInfo = function (gridObj, fileName){
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.getGridFileInfo : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try {
		if (gridObj &&  fileName) {
			var gridObjId = gridObj;
			if (typeof gridObj != "string") gridObjId = gridObj.getID();
			var ds_file = ngmf.object("dsfile_" + gridObjId);
			var mIndex = ds_file.getMatchedIndex("file",fileName);
			if (mIndex.length > 0) return ds_file.getRowJSON(mIndex[0]); 
		}
	} catch (e) {
		ngmf._error("[ngmf.getGridFileInfo ] Exception :: ", e); 
	}
	return null;
};

/**
 * 그리드 업로드 선택된 파일 찾기
 * @date 2016.03.31
 * @memberOf ngmf
 * @param {String / Json} gridObj :: I :: N ::  :: 파일정보 보여줄 그리드 객체 또는 ID
 * @param {String} fileName :: I :: N ::  :: 선택된 파일 이름
 * @returns {Object} 선택된 파일 Object
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_GRIDSAMPLE
 * @example 
 */
ngmf.getGridFileObj = function (gridObj, fileName){

	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.getGridFileObj : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try {
		if (gridObj &&  fileName) {
			var gridViewId = "";
			if (typeof gridObj == "string") gridViewId = gridObj;
			else gridViewId = gridObj.getID();
			
			var ds_file = ngmf.object("dsfile_" + gridViewId);
			var mIndex = ds_file.getMatchedIndex("file",fileName);
			if (mIndex.length > 0) return scvar["flist_"+gridViewId][mIndex[0]]; 
		}
	} catch (e) {
		ngmf._error("[ngmf.getGridFileObj ] Exception :: ", e); 
	}
	return null;
};
/**
 * 그리드 업로드 선택된 파일 삭제
 * @date 2016.03.31
 * @memberOf ngmf
 * @param {String / Json} gridObj :: I :: N ::  :: 파일정보 보여줄 그리드 객체 또는 ID
 * @param {String} fileName :: I :: N ::  :: 선택된 파일 이름
 * @returns {Object} 선택된 파일 Object
 * @author 성일호
 * @useMobile useless
 * @sampleLink ATFIL_GRIDSAMPLE
 * @example 
 */
ngmf.removeGridFileObj = function (gridObj, fileName){
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.removeGridFileObj : 모바일환경에서 지원불가 API 입니다.");
		return ;
	}

	try {
		if (gridObj &&  fileName) {
			var gridViewId = "";
			if (typeof gridObj == "string") gridViewId = gridObj;
			else gridViewId = gridObj.getID();
			
			var ds_file = ngmf.object("dsfile_" + gridViewId);
			var mIndex = ds_file.getMatchedIndex("file",fileName);
			if (mIndex.length > 0) {
				ds_file.removeRow(mIndex[0], {noEvent:true});
				scvar["flist_"+gridViewId].splice(mIndex[0],1);
				
				ngmf._clearFileObjInfo (document.getElementById("gvf_" + gridViewId + "_fakeinput"));
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.removeGridFileObj ] Exception :: ", e);
		return false;
	}
	return true;
};


/**
* 그리드 내 선택된 파일을 삭제한다.
* @date 2016.03.31
* @memberOf  ngmf
* @param {String / Json} gridObj :: I :: N ::  :: 파일정보 보여줄 그리드 객체 또는 ID
* @param {Number} rowIdx :: I :: N ::  :: 삭제대상 그리드의 행번호
* @param {String} colId :: I :: N ::  :: 삭제대상 그리드의 열 ID
* @returns {Boolean}
* @author 성일호
* @useMobile useless
* @example ngmf.removeGridMultiFile("gridView",0, "fileCol1");
* @since
 */
ngmf.removeGridMultiFile = function(_gridObj, rowIdx, colId) {

	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.removeGridMultiFile : 모바일환경에서 지원불가 API 입니다.");
		return ;
	}

	// 변수선언
	var sRtnVal = false;
	try {
		if (typeof _gridObj == "undefined" || !_gridObj) {
			ngmf.alert("대상 그리드객체가 없습니다.");
			return sRtnVal;
		}

		if (typeof rowIdx == "undefined" || typeof rowIdx != "number" ) {
			ngmf.alert("대상 행번호가 없습니다.");
			return sRtnVal;
		}

		if (typeof colId == "undefined"  || typeof rowIdx == "number" ) {
			ngmf.alert("대상 칼럼정보가 없습니다.");
			return sRtnVal;
		}

		var gridObj = null;
		gridObj = ngmf.object(_gridObj);
		if (typeof gridObj == "undefined" || !gridObj) {
			ngmf.alert("대상 그리드객체가 없습니다.");
			return sRtnVal;
		}
		
		gridViewId = gridObj.getID();
		var fileName = gridObj.getCellData(rowIdx, colId) ;
		if (fileName && gridObj.getRowStatus(rowIdx) != "R" && gridObj.getRowStatus(rowIdx) != "D" && scvar["flist_" + gridViewId ] && scvar["flist_" + gridViewId ].length > 0) {
			var ds_file = ngmf.object("dsfile_" + gridViewId);
			var mIndex = ds_file.getMatchedIndex("file",fileName);
			if (mIndex.length > 0) {
				ds_file.removeRow(mIndex[0]);
				scvar["flist_"+gridViewId].splice(mIndex[0],1);
				gridObj.dataList.setEventPause("oncelldatachange,onbeforecelldatachange", true);
				gridObj.dataList.setCellData(rowIdx, colId, "");
				gridObj.dataList.setEventPause("oncelldatachange,onbeforecelldatachange", false);	
				ngmf._clearFileObjInfo (document.getElementById("gvf_" + gridViewId + "_fakeinput"));
				sRtnVal = true;
			}
		}
	} catch (ex) {
		ngmf._error("[ngmf.removeGridMultiFile ] Exception :: ", ex);
		return false;
	}
	return sRtnVal;
};

/**
 * SINGLE 파일 업로드New (Promise)
 * @date 2016.03.31
 * @memberOf ngmf
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판, 1 : 암호화 게시판
 * @param {Object} fileObj :: I :: N ::  :: 파일 객체
 * @param {String} expDate :: I :: N ::  :: 유효일자 '0' : 영구, '1' : 3년
 * @param {Boolean} eFlag :: I :: Y ::  :: 1 : 메시지 팝업(X)
 * @param {String} screenNM :: I :: Y ::  :: 화면명 (input 으로 사용)
 * @param {String} atfilTitleNm :: I :: Y ::  :: Title (input 으로 사용)
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @param {Boolean} chkAcl :: I :: Y ::  :: 암호화 해제여부
 * @param {String} remoteUrl :: I :: Y ::  :: 파일업로드 서블릿 호출 url(현재 접속 url 정보)-모바일인 경우만 사용
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile use
 * @example
			ngmf.promise._encUploadSingleFileNew(enc, file0, "1", 1, ngmf._getScreenName())
			.then( function (retObj) { 
				if (retObj[0] == "Y") {
					// TODO. 저장 후 처리 프로세서 진행							
					if (retObj[1]) {
						inpAtfilId.setValue(retObj[1]);
						scwin.btnSearchFile0_onclick();							
					}
					ngmf.alert("UPLOAD 성공");
				} else {
					ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
				}
			}) 
			.then( undefined, function (retObj) {
				if (retObj["message"]) {
					ngmf.alert("UPLOAD 실패 :::::" + retObj["message"] );
				} else ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
			});
 */
ngmf.promise._encUploadSingleFileNew = function(_enc, fileObj, expDate, eFlag, screenNM, atfilTitleNm, progressFunc, chkAcl, remoteUrl) {
	return new Promise(function(resolve, reject) { 
		var sRtnVal = new Array();
		var throwMsg = "";
		try {
			var enc = 0;
			if (!isNaN(Number(_enc))) enc = Number(_enc);
			
			//if ( ngmf.isNumber(_enc) == "Y" )  enc = _enc;
			//else if (_enc && _enc != "0") enc = 1;
			
			//00: 게시판, 비암호화 되어 저장
			//01 : 게시판, 암호화 되어 저장

			if (typeof chkAcl == "undefined" || chkAcl == null) {
				if (enc) chkAcl = "01";
			} 

			if (!fileObj) {
				throwMsg = "ZNGMC0065";  
				if (!eFlag) {
					throwMsg =  "N" ;
					ngmf.alert(ngmf.getMessage("ZNGMC0065"));
				}
				throw throwMsg;
			} else {
				if (typeof fileObj["name"] == "undefined" ) {
					fileObj["name"] = atfilTitleNm; 
				}
				if (typeof fileObj["size"] != "undefined" ) {
					fileObj["length"] = fileObj["size"]; 
				}
			}
			
			if (typeof fileObj["name"] == "undefined" || !fileObj["name"]) throw new Error("파일네임이 없습니다.");

			var chkExpDate = new Array();
			var mimeType;

			var paramMap = {
				filename : "",
				mimeType : "",
				chkExpDate : "",
				atfilTitleNm : atfilTitleNm||fileObj.name ,
				screenNM : screenNM || ngmf._getScreenName(),
				progressFunc : progressFunc
			};
			// 유효일자 산출
			chkExpDate  = ngmf.checkExpireDate(expDate);
			if ( ngmf.isNull(expDate) == "Y" ||  chkExpDate[0] != "Y"){
				throwMsg = "유효일자 산출실패";
				if (!eFlag) {
					throwMsg =  "N" ;
					ngmf.alert("유효일자 산출실패");
				}
				throw new Error(throwMsg); 
			}

			paramMap["chkExpDate"] = chkExpDate[1] ;
			paramMap["filename"] = fileObj.name;
			paramMap["userId"] = ngmf.getGlobalValue("g_Ngms_UserId");
			//if (!atfilTitleNm) paramMap["filename"] = fileObj.name;
			//--------------------------------------------------------------//
			// 파일권한체크
			
			ngmf.promise._singleFileAclCheck(fileObj, enc)
			.then(function (rtnVal) {
			    if (rtnVal == "N") {
					sRtnVal[0] = "N";
					sRtnVal[1] = "파일권한 오류";
					if (!eFlag) {
						sRtnVal =  "N" ;
					}
					resolve(sRtnVal);
				}
			    //비암호화 게시판 또는 Batch Import의 경우, 서버에서 파일 암호화하지 않음
				mimeType = ngmf.chkMimeType(paramMap["filename"]);
				if (0 == enc || 2 == enc) {
					mimeType = "NON" + mimeType ;
					if (enc == 0) chkAcl = "00"; 
					else if (enc == 2) chkAcl = "10";
				}
				
				paramMap["mimeType"] = mimeType;
				//--------------------------------------------------------------//

		 	    // 파일 업로드 호출
				ngmf.promise._fileWrite(fileObj, paramMap,progressFunc,chkAcl, remoteUrl)
					.then(function(retObj) {
						//{"result" : rtn_arr, "paramMap" : paramMap}
						if ( retObj.result && retObj.result[0] == "Y") {
							// 결과 전송 처리 로직 삽입
							var TrxCode = "ZNGMSFIL13110_TR01";
							var ScreenName = ngmf._getScreenName() || "ZNGMSFIL13110";
							var OutDataList = "GLD.GDS_OUTDUMMY";  //
							var mimeType =  retObj.paramMap["mimeType"];
							var fileName = retObj.paramMap["filename"] ; 
							if (chkAcl == "10") {
								mimeType = "NONcsv";
								fileName = fileName.replaceAll(".xlsx",".csv").replaceAll(".xls",".csv");
							}
			
							ngmf.clear(GLD.GDS_INDUMMY1);
							GLD.GDS_INDUMMY1.insertColumn("atfil_id", { name:	"atfil_id" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("atfil_title_nm", { name:	"atfil_title_nm" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
							GLD.GDS_INDUMMY1.insertColumn("screen_nm", { name:	"screen_nm" , dataType:	"text" });
			
							GLD.GDS_INDUMMY1.insertRow();
							GLD.GDS_INDUMMY1.setCellData(0, "atfil_id", "");
							GLD.GDS_INDUMMY1.setCellData(0, "atfil_ser_num", "");
							GLD.GDS_INDUMMY1.setCellData(0, "atfil_title_nm", atfilTitleNm || "");
							GLD.GDS_INDUMMY1.setCellData(0, "trx_cd", "i");
							GLD.GDS_INDUMMY1.setCellData(0, "screen_nm", screenNM||ngmf._getScreenName());
			
							ngmf.clear(GLD.GDS_INDUMMY2);
							GLD.GDS_INDUMMY2.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("expir_dt", { name:	"expir_dt" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("atfil_nm", { name:	"atfil_nm" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("save_path_nm", { name:	"save_path_nm" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("atfil_size", { name:	"atfil_size" , dataType:	"text" });
							GLD.GDS_INDUMMY2.insertColumn("mime_type_info", { name:	"mime_type_info" , dataType:	"text" });
			
							GLD.GDS_INDUMMY2.insertRow();
							GLD.GDS_INDUMMY2.setCellData(0, "trx_cd", "i");
							GLD.GDS_INDUMMY2.setCellData(0, "atfil_ser_num", "");
							GLD.GDS_INDUMMY2.setCellData(0, "expir_dt", retObj.paramMap["chkExpDate"]);
							GLD.GDS_INDUMMY2.setCellData(0, "atfil_nm", fileName );
							GLD.GDS_INDUMMY2.setCellData(0, "save_path_nm",retObj.result[1]);
							GLD.GDS_INDUMMY2.setCellData(0, "atfil_size", retObj.result[2]);
							GLD.GDS_INDUMMY2.setCellData(0, "mime_type_info", mimeType);
			
							ngmf.clear(GLD.GDS_OUTDUMMY);
							// 파일 업로드 온라인 서비스 프로그램을 호출
							ngmf._fileSyncTransaction(TrxCode, ScreenName, "", [GLD.GDS_INDUMMY1,GLD.GDS_INDUMMY2], OutDataList, ""); 
							// 파일 업로드 온라인 서비스 에러 체크
							if(Number(ngmv.errorCode[0]) == 0){
								sRtnVal[0] = "Y";
								sRtnVal[1] = GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id");
								sRtnVal[2] = ngmf.getGlobalValue("g_Ngms_UserId");
								if (!eFlag) sRtnVal =  GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id") ;
							} else {
								sRtnVal[0] = "N";
								if (!eFlag) sRtnVal =  "N" ;
							}
						} else {
							sRtnVal[0] = "N";
							if (!eFlag) sRtnVal =  "N" ;
						}
						WebSquare.layer.hideProcessMessage();
						resolve(sRtnVal);  
					})
					.then(undefined, function(err) {
						WebSquare.layer.hideProcessMessage();
						if (err && err["result"])
							resolve(err.result);
						else {
							resolve(["N", err["message"] || err]); 
						}
					});		    
			})
			.then(undefined, function(e){
				sRtnVal[0] = "N";
				sRtnVal[1] =  e["message"] || e;
				if (!eFlag) {
					sRtnVal =  "N" ;
				}
				ngmf._error("[_encUploadSingleFileNew : ngmf.singleFileAclCheck] Exception :: ", e);
				resolve(sRtnVal);  
			}); 
		} catch (e) {
			if (eFlag) {
				sRtnVal[0] = "N";
				sRtnVal[1] =  e["message"] || e;
			} else 
				sRtnVal =  "N" ; 
			ngmf._error("[ngmf.promise._encUploadSingleFileNew ] Exception :: ", e);
			resolve(sRtnVal);
		}
	}); 
};
ngmf._getCheckedIndex = function(ds) {
	return ds.getMatchedIndex("chk","1").concat(ds.getMatchedIndex("chk",1));
};

/**
* CSV DATA 를 ARRAY 로 변환
* @date 2016.04.07
* @memberOf  ngmf
* @param {String} csvText :: I :: N ::  :: CSV DATA
* @param {Boolean} isHead :: I :: Y ::  :: HEAD TEXT 존재여부
* @param {Boolean} allArray :: I :: Y ::  :: 1배열 (Default 이중배열)
* @param {Boolean} callTrim :: I :: Y ::  :: DATA trim 여부
* @param {Object} option :: I :: Y ::  :: csv 파일 처리 옵션 {delimiter : "@", quotes : false, newline : "\r\n", dynamicTyping: true}
* @returns {Object} {head:[], data:[]}
* @author 성일호
* @useMobile useless
* @example ngmf.getCsvToArray("1열,2열\n1,2\n3,4",true, true);
* @since
 */
ngmf.getCsvToArray = function(csvText, isHead, allArray, callTrim, option) {
	// 변수선언
	var sRtnVal = null;
	try {
		var istrim = false;
		if (typeof callTrim != "undefined" && callTrim) istrim = true;
		if (typeof csvText == "undefined" || !csvText) { 
			return sRtnVal;
		}
		var allArr = null;
		if (typeof option === "object" && option) {
			allArr = Papa.parse(csvText, option).data;
		} else {
			allArr = Papa.parse(csvText).data;	
		}
		
		var headLength = 0;
		var dataStartIdx = 0;
		if (allArr && allArr.length > 0) {
			sRtnVal = {};
			if (isHead) {
				sRtnVal["head"] = allArr[0]; 
				dataStartIdx = 1;
			} else {
				var headArray = [];
				for (var i = 0 ; i < allArr[0].length; i++ )  headArray.push((i+1) +"열");
				sRtnVal["head"] = headArray; 
			}
			
			headLength = sRtnVal["head"].length;
			
			if (istrim) {
				sRtnVal["data"] = new Array();
				for (var i = dataStartIdx; i < allArr.length; i++) {
					if (allArr[i].length == headLength) {
						for (var j = 0; j < headLength; j++) {
							if (allArray)  sRtnVal["data"].push(ngmf.trim(allArr[i][j])); // = sRtnVal["data"].concat(allArr[i]);
							else allArr[i][j] = ngmf.trim(allArr[i][j]);
						}
						if (!allArray) sRtnVal["data"].push(allArr[i]); 
					} 	
				}
				
				for (var k = 0; k < headLength; k++) {
					sRtnVal["head"][k] = ngmf.trim(sRtnVal["head"][k]); 
				}
			} else {
				if (allArray) {
					sRtnVal["data"] = new Array();
					for (var i = dataStartIdx; i < allArr.length; i++) {
						if (allArr[i].length == headLength) 
							sRtnVal["data"] = sRtnVal["data"].concat(allArr[i]);
					}
				} else {
					if (isHead) {
						allArr.splice(0,1);
					}
					sRtnVal["data"] = allArr;
				}
			} 
		}
	} catch (ex) {
		ngmf._error("[ngmf.getCsvToArray ] Exception :: ", ex);
		return false;
	}
	return sRtnVal;
};

/**
* CSV DATA를 DATA LIST로 변환
* @date 2016.04.07
* @memberOf  ngmf
* @param {String} csvText :: I :: N ::  :: CSV DATA
* @param {String} dstName :: I :: N ::  :: DataList 이름
* @param {Boolean} isHead :: I :: Y ::  :: HEAD TEXT 존재여부
* @param {Array} columnArr :: I :: Y ::  :: 데이터를 셋팅할 컬럼의 id가 담긴 배열 
* @param {Boolean} callTrim :: I :: Y ::  :: DATA trim 여부
* @param {Boolean} lastRowDel :: I :: Y :: false :: 마지막 행 삭제 여부
* @param {Object} option :: I :: Y ::  :: csv 파일 처리 옵션 {delimiter : "@", quotes : false, newline : "\r\n", dynamicTyping: true}
* @returns {Object} {head:[], data:[]}
* @author 성일호
* @useMobile useless
* @example ngmf.getCsvToDataList("1열,2열\n1,2\n3,4","ds_test", true);
* @since
 */
ngmf.getCsvToDataList = function(csvText, dstName, isHead, columnArr, callTrim, lastRowDel, option) {
	// 변수선언
	var sRtnVal = null;
	try {
		if (!csvText || !dstName) { 
			return sRtnVal;
		}
		var dataArrayObj = ngmf.getCsvToArray(csvText, isHead, true, callTrim , option);
		sRtnVal = ngmf.object(dstName) ;
		
		if (!sRtnVal && dataArrayObj && dataArrayObj["head"]) {
			var colInfoJSON= [];
			for(var i=0; i<dataArrayObj["head"].length; i++){
				colInfoJSON.push({
					"id" 		: "COL" + (i+1),
					"dataType" 	: "text",
					"name" 		: dataArrayObj["head"][i]
				});
			} 
			$w.data.create( {
				id : dstName,
				type : "dataList",
				option : {
					"baseNode" :  "list",
					"repeatNode" : "map",
					"saveRemovedData" : "true"
				},
				columnInfo : colInfoJSON
			});			
			sRtnVal = ngmf.object(dstName) ;
		}
		
		if (sRtnVal && dataArrayObj["data"] && dataArrayObj["data"].length > 0) {
			var headCnt = dataArrayObj["head"].length;
			if (typeof columnArr != "undefined" && columnArr) headCnt = columnArr.length;
				
			if (WebSquare.util.isInteger (dataArrayObj["data"].length/headCnt)) {
				if (typeof columnArr != "undefined" && columnArr)
					sRtnVal.setData(dataArrayObj["data"], false, columnArr);
				else sRtnVal.setData(dataArrayObj["data"]);
				
				if (typeof lastRowDel != "undefined" && lastRowDel && sRtnVal.getRowCount() > 0) {
					sRtnVal.removeRow(sRtnVal.getRowCount() -1);
				}
			} else {
				ngmf.alert("DATA/COLUMN :" +(dataArrayObj["data"].length/headCnt) );
			} 
		} 
	} catch (ex) {
		ngmf._error("[ngmf.getCsvToDataList ] Exception :: ", ex);
		return false;
	}
	return sRtnVal;
};

/**
* CSV DATA를 DATA LIST로 변환[batch 전용]
* @date 2016.04.07
* @memberOf  ngmf
* @param {String} csvText :: I :: N ::  :: CSV DATA
* @param {String} dstName :: I :: N ::  :: DataList 이름
* @param {Boolean} isHead :: I :: Y ::  :: HEAD TEXT 존재여부
* @param {Array} columnArr :: I :: Y ::  :: 데이터를 셋팅할 컬럼의 id가 담긴 배열 
* @param {Boolean} callTrim :: I :: Y ::  :: DATA trim 여부
* @param {Boolean} lastRowDel :: I :: Y :: false :: 마지막 행 삭제 여부
* @param {Object} option :: I :: Y ::  :: csv 파일 처리 옵션 {delimiter : "@", quotes : false, newline : "\r\n", dynamicTyping: true}
* @returns {Object} {head:[], data:[]}
* @author 성일호
* @useMobile useless
* @example ngmf.getCsvToDataList2("1열,2열\n1,2\n3,4","ds_test", true);
* @since
 */
ngmf.getCsvToDataList2 = function(csvText, dstName, isHead, columnArr, callTrim, lastRowDel, option) {
	// 변수선언
	var sRtnVal = null;
	try {
		if (!csvText || !dstName) { 
			return sRtnVal;
		}
		var dataArrayObj = ngmf.getCsvToArray(csvText, isHead, true,callTrim, option);
		sRtnVal = ngmf.object(dstName) ;
		
		if (!sRtnVal && dataArrayObj && dataArrayObj["head"]) {
			var colInfoJSON= [];
			for(var i=0; i<dataArrayObj["head"].length; i++){
				colInfoJSON.push({
					"id" 		: "COL" + (i+1),
					"dataType" 	: "text",
					"name" 		: dataArrayObj["head"][i]
				});
			} 
			$w.data.create( {
				id : dstName,
				type : "dataList",
				option : {
					"baseNode" :  "list",
					"repeatNode" : "map",
					"saveRemovedData" : "true"
				},
				columnInfo : colInfoJSON
			});			
			sRtnVal = ngmf.object(dstName) ;
		}
		
		if (sRtnVal && dataArrayObj["data"] && dataArrayObj["data"].length > 0) {
			var headCnt = dataArrayObj["head"].length;
			var dsColumnCnt =  sRtnVal.getColumnCount();
			if (typeof columnArr != "undefined" && columnArr) headCnt = columnArr.length;
				
			if (!WebSquare.util.isInteger(dataArrayObj["data"].length/headCnt)) {
				if (headCnt > dsColumnCnt) {
					ngmf.alert("DATA/COLUMN :" +(dataArrayObj["data"].length/headCnt) );
					return sRtnVal;
				} else if (dsColumnCnt > headCnt ) {
					dataArrayObj["data"] = new Array();
					var gabCnt  = dsColumnCnt - headCnt;
					var dataArrayObjRow = ngmf.getCsvToArray(csvText, isHead,false, callTrim);
					for (var i = 0; i < dataArrayObjRow["data"].length; i++) {
						for (var j =0; j < gabCnt; j++) dataArrayObjRow["data"][i].push("");
						dataArrayObj["data"] = dataArrayObj["data"].concat(dataArrayObjRow["data"][i]);
					}					
				} else {
					var lostCnt  = (ngmf.toInteger(dataArrayObj["data"].length/dsColumnCnt) +1)*dsColumnCnt - dataArrayObj["data"].length;
					for (var i =0; i < lostCnt; i++) dataArrayObj["data"].push("");
				} 
			}
			if (typeof columnArr != "undefined" && columnArr)
				sRtnVal.setData(dataArrayObj["data"], false, columnArr);
			else sRtnVal.setData(dataArrayObj["data"]);
			
			if (typeof lastRowDel != "undefined" && lastRowDel && sRtnVal.getRowCount() > 0) {
				sRtnVal.removeRow(sRtnVal.getRowCount() -1);
			}
			
		} 
		
	} catch (ex) {
		ngmf._error("[ngmf.getCsvToDataList2 ] Exception :: ", ex); 
	}
	return sRtnVal;
};

/**
* DATA LIST를 CSV DATA로 변환
* @date 2016.04.07
* @memberOf  ngmf
* @param {String} dstName :: I :: N ::  :: DataList 이름
* @param {Boolean} isHead :: I :: Y ::  :: HEAD TEXT 존재여부
* @returns {Object} {head:[], data:[]}
* @author 성일호
* @useMobile useless
* @since
 */
ngmf.getDataListToCsv = function(dstName, isHead) {
	// 변수선언
	var sRtnVal = null;
	try {
		dstName = ngmf.object(dstName);
		if (!dstName) { 
			return sRtnVal;
		}
		var csvArray = [];
		if (isHead) {
			var rowArray = [];
            for (var col = 0; col < dstName.getColumnCount(); col++) {
            	rowArray.push(dstName.getColumnName(col));
            }
            csvArray.push(rowArray);
		}
        for (var row = 0; row < dstName.getRowCount(); row++) {
            var rowArray = [];
            for (var col = 0; col < dstName.getColumnCount(); col++) {
            	rowArray.push(dstName.getCellData(row, col));
            }
            csvArray.push(rowArray);
        }
        sRtnVal = Papa.unparse(csvArray);
	} catch (ex) {
		ngmf._error("[ngmf.getDataListToCsv ] Exception :: ", ex);
		return false;
	}
	return sRtnVal;
};

/** 
 * DATALIST를 CSV 형태로 서버로 UPLOAD
 * @date 2016.04.07
 * @memberOf ngmf 
 * @param {String/Json} dstName :: I :: N ::   ::	DATA LIST or ID 
 * @param {String} strFile 	:: I :: Y ::   ::	upload할 file name - default : dsListSample.csv  
 * @param {Boolean} isHead :: I :: Y ::   ::	HEAD 포함 여부
 * @return Promise : {String}  File ID
 * @author 성일호
 * @useMobile useless
 * @example 
		 	ngmf.promise.dataLIstFileUp("ds_test", "aaa.csv", true)
			.then( function(fileId) {
				//clobFileId.setValue( fileId );
				ngmf.alert("FileID=" + fileId);
			})
			.then(undefined, function(e) { 
				if ( e["message"]) 
				 	ngmf.alert("실패::" + e["message"]);
				else	
					ngmf.alert("실패:: " + e[1]);
			});
 */ 
ngmf.promise.dataLIstFileUp = function(dstName, strFile, isHead){
	return ngmf.promise._clobFileUp(ngmf.getDataListToCsv(dstName, isHead), "1", false, false, strFile||"dsListSample.csv");
};


/** 
 * DATALIST를 CSV 형태로 LOCAL DOWNLOAD(UTF-8) 로 저장됨(비공개)
 * @date 2016.04.07
 * @memberOf ngmf 
 * @param {String/Json} dstName :: I :: N ::   ::	DATA LIST or ID 
 * @param {String} fileName 	:: I :: Y ::   ::	Download file name - default : dsListSample.csv  
 * @param {Boolean} isHead :: I :: Y ::   ::	HEAD 포함 여부
 * @return Promise : {String}  File ID
 * @author 성일호
 * @useMobile useless
 * @example 
 	ngmf.promise._dataLIstFileDown("ds_file", "aaa.csv", true)
	.then( function(retObj) {
		//clobFileId.setValue( fileId );
		if(retObj[0] == "N") ngmf.alert(retObj[1]);
	}) ;
 */ 
ngmf.promise._dataLIstFileDown = function(dstName, _fileName, isHead){
	return new Promise(function(resolve, reject) {
		var rtn_arr = new Array();
		try {
			dstName = ngmf.object(dstName);
			if (!dstName) { 
				throw  "DATA LIST가 없습니다..";
			}
			fileName = _fileName || "dsListSample.csv"; 

			var csvData = "\uFEFF" + ngmf.getDataListToCsv(dstName, isHead);
			if (csvData) {
				var blobData = new Blob([csvData],{type:"text/csv;charset=utf-8;"}); 
				
				if (typeof window.navigator.msSaveBlob == "function") {
					//IE 파일저장...
					window.navigator.msSaveBlob(blobData, fileName || 'UnKnownFile.core');
				} else {
					//기타 파일저장...
					var save = document.createElement('a');
					save.href = URL.createObjectURL(blobData) ;
					save.target = '_blank';
					save.download = fileName || 'dsListSample.csv';

					var event = document.createEvent('Event');
					event.initEvent('click', true, true);
					save.dispatchEvent(event);
					(window.URL || window.webkitURL).revokeObjectURL(save.href);
				}
				rtn_arr[0] = "Y";
				rtn_arr[1] = "저장처리가 완료되었습니다.";
				resolve(rtn_arr);
			} else throw  "DATA LIST가 없습니다..";
		} catch(e) {
			rtn_arr[0] = "N";
			if (e["message"]) rtn_arr[1] = e.message; else rtn_arr[1] = e ;
			ngmf._error("[ngmf.promise._dataLIstFileDown] Exception :: ", e);
			//오류처리
			resolve(rtn_arr);
		}
	});
};
 
/** 
 * LOCAL 파일을 읽어 Text로 제공 (비공개)
 * @date 2016.04.07
 * @memberOf ngmf 
 * @param {Object} fileObj :: I :: N ::   ::	CSV File or UploadComp or inputBox 
 * @param {String} encType :: I :: Y :: euc-kr ::	 엔코딩 타입.  euc-kr , utf-8
 * @return Promise : {String}  File ID
 * @author 성일호
 * @useMobile useless
 * @example 
 	ngmf.promise._getLocalFileToText("file0")
	.then( function(retObj) {
		if(retObj[0] == "Y") { 
		
		} else ngmf.alert(retObj[1]);
	}) ;
 */ 
ngmf.promise._getLocalFileToText = function(fileObj, encType){
	return new Promise(function(resolve, reject) {
		var rtn_arr = new Array();
		try {				
			rtn_arr[0] = "Y";
			rtn_arr[1] = "저장처리가 완료되었습니다.";
			if (!fileObj) throw "변환 대상 파일이 없습니다."; 
			if (typeof fileObj == "string") {
				fileObj = ngmf.object(fileObj);
			}
			if (fileObj) {
				if (typeof  fileObj.getPluginName != "undefined" && fileObj.getPluginName().toLowerCase() == "upload" ) {
					fileObj = document.getElementById(fileObj.getID()+ "_fakeinput").files[0];
				} else if (typeof  fileObj.type != "undefined" && fileObj.type == "file" ) {
					fileObj = fileObj.files[0];
				} 
				/*
				if (typeof fileObj.name != "undefined" && !ngmf._getCheckMimeTypeText(fileObj.name) ) throw "지원가능 파일이 아닙니다.";
				*/
				
				if (typeof window.FileReader == "function") {
					var oFReader = new window.FileReader();
					oFReader.onerror= function(evt) {
						rtn_arr[0] = "N";
						rtn_arr[1] = evt.target.error.name;
						ngmf._error("[ngmf.promise._getLocalFileToText] Exception :: ", evt.target.error);
						//오류처리
						resolve(rtn_arr);
					};
					oFReader.onload = function(oFREvent) {
						rtn_arr[1] = oFREvent.target.result ;
						resolve(rtn_arr);
					};
					if (encType)
						oFReader.readAsText(fileObj,encType);
					else
						oFReader.readAsText(fileObj,"euc-kr");
				} else throw "미지원 브라우저 입니다.";
			} else throw "변환 대상 파일이 없습니다.";
		} catch(e) {
			rtn_arr[0] = "N";
			if (e["message"]) rtn_arr[1] = e.message; else rtn_arr[1] = e ;
			ngmf._error("[ngmf.promise._getLocalFileToText] Exception :: ", e);
			//오류처리
			resolve(rtn_arr);
		}
	});
}; 

/**
 * 프리뷰 이미지 초기화
 * @date 2016.04.29
 * @memberOf ngmf
 * @param {String} PreviewDivId :: I :: N ::  :: 프리뷰 보여줄 DIV 객체 OR ID 
 * @param {String} fileObj :: I :: N ::  :: 초기화 할 파일객체 OR  ID
 * @returns
 * @author 성일호
 * @useMobile useless
 * @example ngmf.preViewImageInit("imagePreview", "file0");
 */
ngmf.preViewImageInit = function (PreviewDiv, fileObj) {
	try {
		if(ngmf.isMobile()) {
			ngmf.alert("ngmf.setWaitCursor : 모바일환경에서 지원불가 API 입니다.");
			return;
		}
		
		if (typeof PreviewDiv == "undefined" || !PreviewDiv ) return; 
		var target = ngmf.object(PreviewDiv);
		var PreviewDivId = target.getID();
		var oPreviewImg =  $("#"+PreviewDivId+"IMG"); //document.getElementById(PreviewDivId+"IMG");
		if (oPreviewImg) {
			oPreviewImg.remove();
		}
		var uploadComp = fileObj;
		if (typeof fileObj != "object") {
			uploadComp = ngmf.object(fileObj);
		}
		if (fileObj) {
			if (uploadComp  &&  uploadComp.getPluginName() == "upload") {
				uploadComp.reset();
				ngmf._clearFileObjInfo(document.getElementById(uploadComp.getID() + "_fakeinput"));
			}
		}
	} catch (ex) {
		ngmf._error("[ngmf.preViewImageInit] Exception :: ", ex);
	}
}; 

/**
 * 파일객체를 dataURI 로 변경
 * @date 2016.05.16
 * @memberOf ngmf
 * @param {Object} fileObj :: I :: N ::  :: 파일(upload) 객체 또는 ID
 * @returns
 * @author 성일호
 * @useMobile useless
 * @example ngmf.promise._file2dataURI(fileObj).then(function(uriStr){ if(uriStr) ngmf.alert(uriStr.length);})
 */
ngmf.promise._file2dataURI = function (fileObj) {
	return new Promise(function(resolve, reject) {
		var retString = "";
		try {
			if (!fileObj) throw "변환 대상 파일이 없습니다."; 
			if (typeof fileObj == "string") {
				fileObj = ngmf.object(fileObj);
			}
			if (fileObj) {
				if (typeof  fileObj.getPluginName != "undefined" && fileObj.getPluginName().toLowerCase() == "upload" ) {
					fileObj = document.getElementById(fileObj.getID()+ "_fakeinput").files[0];
				} else if (typeof  fileObj.type != "undefined" && fileObj.type == "file" ) {
					fileObj = fileObj.files[0];
				} 
				if (fileObj) {
					if (typeof window.FileReader == "function") {
						var oFReader = new window.FileReader();
						oFReader.onerror= function(evt) {
							ngmf._error("[ngmf.promise._file2dataURI] Exception :: ", evt.target.error);
							//오류처리
							resolve("");
						};
						oFReader.onload = function(oFREvent) {
							resolve(oFREvent.target.result);
						};
						oFReader.readAsDataURL(fileObj);
					} else throw "미지원 브라우저 입니다.";
				} else throw "지원가능 파일이 아니거나 파일이 없습니다.";
			} else throw "변환 대상 파일이 없습니다.";
		} catch(e) { 
			ngmf._error("[ngmf.promise._file2dataURI] Exception :: ", e);
			//오류처리
			resolve(retString);
		}
	});
};

/**
 * dataURI 객체를 Blob 객체로 변환...
 * @date 2016.05.16
 * @memberOf ngmf
 * @param {Object} dataURI :: I :: N ::  ::  dataURI 객체
 * @returns
 * @author 성일호
 * @useMobile useless
 * @example ngmf._dataURI2Blob(dataURI)
 */
ngmf._dataURI2Blob = function(dataURI) {
	var byteString = null;
	try {
		if (dataURI) {
			var dataURIArr = dataURI.split(',');
			if (dataURIArr) {
				if (dataURIArr[0].indexOf("base64") >= 0)
					byteString = atob(dataURIArr[1]);
				else 
					byteString = unescape(dataURIArr[1]);
				var mimeString = dataURIArr[0].split(":")[1].split(";")[0];
				var ia = new Uint8Array(byteString.length);
				for (var i = 0; i < byteString.length; i++) {
					ia[i] = byteString.charCodeAt(i);
				}
				return new Blob([ia],{type :mimeString});
			} else return byteString;
		}		
	} catch (ex) {
		ngmf._error("[ngmf._dataURI2Blob] Exception :: ", ex);
	} 
	return byteString;
} ;


ngmf._getDownloadFileName = function(atfilnm, savepathnm, dftExt) {
	var retString = "";
	try {
		if (atfilnm) {
			 if (atfilnm.indexOf(".") > -1)  retString = atfilnm;
			 else if (savepathnm && savepathnm.indexOf(".") > -1) retString = atfilnm + "." + ngmf.chkMimeType(savepathnm);
			 else retString = atfilnm + "." + (dftExt || "csv");
		} else if (savepathnm)	 {
			retString = ngmf.getFileName(savepathnm);
		}
	} catch (ex) {
		ngmf._error("[ngmf._getDownloadFileName] Exception :: ", ex);
	} 
	return retString;
} ;


/**
 * 서버 파일을 삭제한다(비공개)
 * @date 2016.05.20
 * @memberOf ngmf
 * @param {Object} aftilId :: I :: N ::  ::  대상 파일 ID
 * @returns
 * @author 성일호
 * @useMobile useless
 * @example ngmf.promise._deleteServerFile(dataURI)
 */
ngmf.promise._deleteServerFile = function(aftilId) {
	return new Promise(function(resolve, reject) {
		var sRtnVal = new Array();
		try{
			if (typeof aftilId =="undefined" || !aftilId) throw Error("삭제할 파일 정보가 없습니다.");
			var ds_file = ngmf.createDataList("ds_file", ["atfilId","atfilSerNum","file","size","savePathNm","trxCode"]);
			var sSerVal = ngmf.getFileList(aftilId, ds_file, 1); 
			if (sSerVal[0] != "Y") throw Error(sSerVal[1]);
			
			if (ds_file && ds_file.getRowCount() > 0) {
				var TrxCode = "ZNGMSFIL13110_TR01";
				var ScreenName = ngmf._getScreenName() || "ZNGMSFIL13110";
				var OutDataList = "GLD.GDS_OUTDUMMY";  // 
				
				ngmf.clear(GLD.GDS_INDUMMY1);
				GLD.GDS_INDUMMY1.insertColumn("atfil_id", { name:	"atfil_id" , dataType:	"text" });
				GLD.GDS_INDUMMY1.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
				GLD.GDS_INDUMMY1.insertColumn("atfil_title_nm", { name:	"atfil_title_nm" , dataType:	"text" });
				GLD.GDS_INDUMMY1.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
				GLD.GDS_INDUMMY1.insertColumn("screen_nm", { name:	"screen_nm" , dataType:	"text" });

				GLD.GDS_INDUMMY1.insertRow();
				GLD.GDS_INDUMMY1.setCellData(0, "atfil_id", ds_file.getCellData(0, "atfilId"));
				GLD.GDS_INDUMMY1.setCellData(0, "atfil_ser_num", "");
				GLD.GDS_INDUMMY1.setCellData(0, "atfil_title_nm", "");
				GLD.GDS_INDUMMY1.setCellData(0, "trx_cd", "u");
				GLD.GDS_INDUMMY1.setCellData(0, "screen_nm", ScreenName);

				
				ngmf.clear(GLD.GDS_INDUMMY2);
				GLD.GDS_INDUMMY2.insertColumn("trx_cd", { name:	"trx_cd" , dataType:	"text" });
				GLD.GDS_INDUMMY2.insertColumn("atfil_ser_num", { name:	"atfil_ser_num" , dataType:	"text" });
				GLD.GDS_INDUMMY2.insertColumn("expir_dt", { name:	"expir_dt" , dataType:	"text" });
				GLD.GDS_INDUMMY2.insertColumn("atfil_nm", { name:	"atfil_nm" , dataType:	"text" });
				GLD.GDS_INDUMMY2.insertColumn("save_path_nm", { name:	"save_path_nm" , dataType:	"text" });
				GLD.GDS_INDUMMY2.insertColumn("atfil_size", { name:	"atfil_size" , dataType:	"text" });
				GLD.GDS_INDUMMY2.insertColumn("mime_type_info", { name:	"mime_type_info" , dataType:	"text" });
				
				var insIdx = -1;
				for (var ix = 0; ix < ds_file.getRowCount(); ix++) {
					if (ds_file.getCellData(ix, "savePathNm")) {
						insIdx = GLD.GDS_INDUMMY2.insertRow();;
						GLD.GDS_INDUMMY2.setCellData(insIdx, "trx_cd", "d");				
						GLD.GDS_INDUMMY2.setCellData(insIdx, "atfil_ser_num", ds_file.getCellData(ix, "atfilSerNum"));
						GLD.GDS_INDUMMY2.setCellData(insIdx, "expir_dt", "");
						GLD.GDS_INDUMMY2.setCellData(insIdx, "atfil_nm", "");
						GLD.GDS_INDUMMY2.setCellData(insIdx, "save_path_nm", "");
						GLD.GDS_INDUMMY2.setCellData(insIdx, "atfil_size", "");
						GLD.GDS_INDUMMY2.setCellData(insIdx, "mime_type_info", "");								
					}
				} //END for
				
				ngmf.clear(GLD.GDS_OUTDUMMY);
				
				// 파일 업로드 온라인 서비스 프로그램을 호출
				ngmf._fileSyncTransaction(TrxCode, ScreenName, "", [GLD.GDS_INDUMMY1,GLD.GDS_INDUMMY2], OutDataList, ""); 
				// 파일 업로드 온라인 서비스 에러 체크
				if(Number(ngmv.errorCode[0]) == 0){
					sRtnVal[0] = "Y";
					sRtnVal[1] = ngmf.getMessage("ZNGMC0070");
				} else {
					sRtnVal[0] = "N";
					sRtnVal[1] = "파일 삭제 실패"; 
				}
				resolve (sRtnVal );
	 
			} else throw Error("삭제할 파일 정보를 찾을 수 없습니다.");
		} catch (e) {
			ngmf._error("[ngmf.promise._deleteServerFile ] Exception :: ", e);
			sRtnVal[0] = "N";
			sRtnVal[1] = e["message"] || e;
			resolve(sRtnVal); 
		} 
	}); 
};

/**
 * 이미지 파일 객체에서 사이즈를 추출 후 사이즈 객체로 반환
 * @date 2016.05.26
 * @memberOf ngmf
 * @param {Object} fileObj :: I :: N ::  :: 파일(upload) 객체 또는 ID
 * @returns {Promise} Object {width: 100, height:100 }
 * @author 성일호
 * @useMobile useless
 * @example 
		ngmf.promise.getImageSize(file0)
		.then( function(imgSize){ 
			if(imgSize) ngmf.alert("file0.width=" + imgSize.width + "\nfile0.height=" + imgSize.height);
			else ngmf.alert("이미지가 아니거나 파일이 없습니다.");
		});
 */
ngmf.promise.getImageSize = function (fileObj) {
	return new Promise(function(resolve, reject) {
		try {
			if (!fileObj) throw "변환 대상 파일이 없습니다."; 
			if (typeof fileObj == "string") {
				fileObj = ngmf.object(fileObj);
			}
			if (typeof  fileObj.getPluginName != "undefined" && fileObj.getPluginName().toLowerCase() == "group" ) {
				fileObj = ngmf.object(fileObj.getID() + "IMG");
			}
			if (fileObj) {
				if (typeof  fileObj.getPluginName != "undefined" && fileObj.getPluginName().toLowerCase() == "group"  || typeof  fileObj.src == "string" ) {
					var img = new Image();
					img.onerror= function(evt) {
						ngmf._error("[ngmf.promise._getImageObj] img.onerror Exception :: ", evt.type);
						//오류처리
						resolve(null);
					};									
					img.onload = function(e) {
						var imgSize = {};
						if(typeof  this.naturalWidth != "undefuned" && this.naturalWidth) {
							imgSize["width"] = this.naturalWidth;
							imgSize["height"] = this.naturalHeight;
						} else {
							imgSize["width"] = this.width;
							imgSize["height"] = this.height;										
						}
						resolve(imgSize);
						delete img;
						img = null; 
					};
					img.src = fileObj.src;
				} else {
					if (typeof  fileObj.getPluginName != "undefined" && fileObj.getPluginName().toLowerCase() == "upload" ) {
						fileObj = document.getElementById(fileObj.getID()+ "_fakeinput").files[0];
					} else if (typeof  fileObj.type != "undefined" && fileObj.type == "file" ) {
						fileObj = fileObj.files[0];
					}
					if (fileObj) {
						if (typeof window.FileReader == "function") {
							var oFReader = new window.FileReader();
							oFReader.onerror= function(evt) { 
								ngmf._error("[ngmf.promise._getImageObj] oFReader.onerror Exception :: ");
								//오류처리
								resolve(null);
							};						
							oFReader.onload = function(oFREvent) { 
								var dataURI = oFREvent.target.result;
								//var dataURIArr = dataURI.split(',');
								var dataURIArr = ["data:image"];
								if (dataURIArr[0].startsWith("data:image")) {	
									var img = new Image();
									img.onerror= function(evt) {
										ngmf._error("[ngmf.promise._getImageObj] img.onerror Exception :: ", evt.type);
										//오류처리
										resolve(null);
									};									
									img.onload = function(e) {
										var imgSize = {};
										if(typeof  this.naturalWidth != "undefuned" && this.naturalWidth) {
											imgSize["width"] = this.naturalWidth;
											imgSize["height"] = this.naturalHeight;
										} else {
											imgSize["width"] = this.width;
											imgSize["height"] = this.height;										
										}
										resolve(imgSize);
										delete img;
										img = null;
										oFReader = null;
									};
									img.src = oFREvent.target.result;
								} else {
									ngmf._error("[ngmf.promise._getImageObj] Exception :: 이미지 파일이 아닙니다.");
									//오류처리
									resolve(null);
									oFReader = null;
								}
							};
							oFReader.readAsDataURL(fileObj);
						} else throw "미지원 브라우저 입니다.";
					} else throw "지원가능 파일이 아니거나 파일이 없습니다.";					
				} 
			} else throw "변환 대상 파일이 없습니다.";
		} catch(e) { 
			ngmf._error("[ngmf.promise.getImageSize] Exception :: ", e);
			//오류처리
			resolve(null);
		}
	});
};


/**
 *  Batch 파일 다운로드 후 DataList 로 반환
 *  오류처리는 예제참조
 * @date 2016.05.26
 * @memberOf ngmf
 * @param {String} atfilId :: I :: N ::  :: 파일 ID
 * @param {String} dstName :: I :: N ::  :: DataList 이름
 * @param {Boolean} isHead :: I :: Y :: false :: HEAD TEXT 존재여부
 * @param {Array} columnArr :: I :: Y ::  :: 데이터를 셋팅할 컬럼의 id가 담긴 배열 
 * @param {Boolean} callTrim :: I :: Y :: false :: DATA trim 여부(공백 문자 제거  필요시 true)
 * @param {Boolean} forceSetData :: I :: Y :: false :: DATA 가 작을경우 강제 맞춤 여부
 * @param {Boolean} lastRowDel :: I :: Y :: false :: 마지막 행 삭제 여부
* @param {Object} csvoptions :: I :: Y ::  :: csv 파일 처리 옵션 {delimiter : "@", quotes : false, newline : "\r\n", dynamicTyping: true}
 * @returns {Promise} 생성된 DataList 객체
 * @author 성일호 
 * @useMobile useless
 * @example
   //신규생성시
	ngmf.promise.batDownloadDs("73793643", "ds_downcsv", false)
   .then( function (downDs) {
	   ngmf.alert("성공:::" + downDs.getRowCount() + " 건[" + downDs.id + "]");
	}) 
	.then( undefined, function (e) {
		ngmf.alert("Batch 파일 다운로드 오류:::" + e);
	});	
	
	//기존 DataSet 사용 시
	ngmf.promise.batDownloadDs("73793643", "ds_downcsv", false, ["COL1", "COL2", "COL3", "COL4", "COL5", "COL6", "COL7", "COL8", "COL9", "COL10", "COL11", "COL12", "COL13"])
   .then( function (downDs) {
	   ngmf.alert("성공:::" + downDs.getRowCount() + " 건[" + downDs.id + "]");
	}) 
	.then( undefined, function (e) {
		ngmf.alert("Batch 파일 다운로드 오류:::" + e);
	});

	//마지막 행 삭제 시
	ngmf.promise.batDownloadDs("73810272","ds_test",false,null,true,false,true)
   .then( function (downDs) {
	   ngmf.alert("성공:::" + downDs.getRowCount() + " 건[" + downDs.id + "]");
	}) 
	.then( undefined, function (e) {
		ngmf.alert("Batch 파일 다운로드 오류:::" + e);
	});	
 */
ngmf.promise.batDownloadDs = function(atfilId, dstName, isHead, columnArr, callTrim,  forceSetData, lastRowDel, csvoptions) {
	return new Promise(function(resolve, reject) {
		try {
			if (ngmf.isNull(atfilId) == "Y") { 
				throw Error(ngmf.getMessage("ZNGMC0072"));
			} 
			var sSerVal = ngmf.getFileList(atfilId, null, 1);
			var filesize = null;
			var filepath = null;
			var fileName = null;
			if (sSerVal[0] == "Y") {
				filesize = GLD.GDS_OUTDUMMY.getCellData(0, "atfil_size");
				filepath = ngmf.urlDecode(GLD.GDS_OUTDUMMY.getCellData(0, "save_path_nm"));
				fileName = ngmf._getDownloadFileName(GLD.GDS_OUTDUMMY.getCellData(0, "atfil_nm"), filepath); 
			} else {
				throw Error(ngmf.getMessage("ZNGMC0065"));
			}
			if (ngmf.isNull(filepath) == "Y" || ngmf.isNull(filesize) == "Y") {	 
				throw Error(ngmf.getMessage("ZNGMC0065"));
			} else {
				ngmf.promise._fileReadMem(filepath, 2)
				   .then( function (retObj) { 
							if (retObj["result"] && retObj["result"][0]=="Y") {
								if (typeof forceSetData != "undefined" && forceSetData) resolve( ngmf.getCsvToDataList2(retObj["result"][1], dstName, isHead, columnArr, callTrim, lastRowDel,csvoptions));
								else resolve( ngmf.getCsvToDataList (retObj["result"][1], dstName, isHead, columnArr, callTrim, lastRowDel, csvoptions));
							} else {
								reject(retObj["result"][1]);
							}
						}) 
					.then( undefined, function (e) { 
						ngmf._error("[batDownloadFile : ngmf.promise._fileReadMem] 실패["+fileName+"] :: " ,e); 
						reject(e.message || e);
					}); 
			}
		} catch (e) { 
			ngmf._error("[ngmf.promise.batDownloadFile] Exception :: ", e);
			reject (e.message);
		} 
	});
};



/**
 * 데이터셋을 CSV 파일 형태로 업로드하고 배치를 호출하여 CSV 파일을 임시 적재 테이블에 업로드 함
 * @date 2016.06.21
 * @memberOf ngmf
 * @param {Array} dataArr :: I :: N ::  :: 데이터셋을 담고있는 배열 
 * @param {String} wframeId :: I :: Y ::  :: wframe 내부에서 함수호출시 해당 wframe의 아이디
 * @param {Boolean} isHead :: I :: Y :: true :: dataSetId와 컬럼아이디 포함 여부 (미포함시 false) 
 * @returns 없음
 * @author 김응한
 * @useMobile check
 * @example 

1. wframe이 아닌 일반메인화면에서  호출시 

 데이터 리스트를 배열에 담아서 함수에 전달 (단건,다건 동일)

 ex)
 var dataArr = ["dataList1"",dataList2","dataList3"]
  ngmf.csvPushCall(dataArr);

2.wframe 내부에서 호출시 
데이터 리스트를 배열에 담아서 함수에 전달 
wframe에 있는 데이터리스트는 ngmf.getID()함수에 감싼 후 배열에 담아서 인자로 전달 
두번째 인자로 ngmf.getMyWframeId(scwin) 을 전달 
  
ex)
  var dataList =[ngmf.getID(scwin,"dataList1"),ngmf.getID(scwin,"dataList2")ngmf.getID(scwin,"dataList3")];
  ngmf.csvPushCall(dataList,ngmf.getMyWframeId(scwin));



3.콜백함수 
scwin.pushCallBackResult = function(){
	
	...
}


 */
ngmf.csvPushCall = function(dataArr,wframeId,isHead) {	
	try{
		if (WebSquare.util.isMobile()) {
			ngmf.alert("ngmf.getDataListToCsv : 모바일환경에서 지원불가 API 입니다.");
			return;
		}
		
		if(!ngmf.isArray(dataArr)){
			ngmf._error("dataArr"+"은 ArrayType이 아님");
			return;
		}

		var params = dataArr.length;
		
		if (params == 0) {
			ngmf._error("파라메터 없음");
			return;
		}

		var head = isHead;
	
		if ( typeof head != "boolean") {
			head = true;
		} 
		for ( var i = 0; i < params; i++) {
			if (!ngmf.object(dataArr[i])) {
				ngmf._error("undefiend :: " + dataArr[i] + "(" + [ i ] + ")");
				return;
			}
	
		}
	
		for ( var i = 0; i < params; i++) {
			var dataList = ngmf.object(dataArr[i]);
			if (dataList.initializeType != "dataList") {
				ngmf._error(dataList.id + " :: is not dataList");
				return;
			}
		}
	
		var csvMerge = new Array();
	
		csvMerge = ngmf._getDstCsv(dataArr[0], head);
	
		for ( var i = 1; i < params; i++) {
			csv = ngmf._getDstCsv(dataArr[i], head);
			csvMerge = csvMerge.concat(csv);
		}
	
		var csv = ngmf._jsonToCsvString(csvMerge);
		//ngmf._debug(csv);
	
		var promise = ngmf.promise.clobFileUp(csv, null, "UpTempStr.csv", "1", false, 0);
	
		promise.then(
				function(fileId) {
					// TODO. 저장 후 처리 프로세서 진행
					var fileInform = ngmf._getSavePathNm(fileId);
					
					var screemNm = ngmf._getScreenName();
					
					if(wframeId!="undefined"){//wframe 내부에서 호출시 
						screemNm = screemNm+ "::" +wframeId;
						
					}
					ngmf._debug("ClobUpload 성공 file Id=[" + fileId + "]"); 
					ngmf._debug("filesavePath :: " + fileInform);
	
				/*	ngmf.createDataList("dst_BatchCall", [ "bat_name", "parm1", "parm2"], [ "text","text", "text"]);*/
					if (typeof dst_BatchCall == "undefined")
						ngmf.createDataList("dst_BatchCall", [ "bat_name", "parm1"],[ "text","text"]);
					else dst_BatchCall.removeAll();
					
					dst_BatchCall.insertRow();
					dst_BatchCall.setCellData(0, "bat_name", "ZNGMBS0800060_001.sh");
					dst_BatchCall.setCellData(0, "parm1", fileInform);
					var InDataList = "dst_BatchCall";
					ngmf.dspRn("dst_BatchCall");
					ngmf.batch("ZNGMSBAT00010_TR01", screemNm, "", InDataList, "","", "WAIT");
							
				}).then(undefined, function(e) {
			// 기타 오류 발생시 메세지 처리
			if (typeof e["message"] != "undefined")
				ngmf.alert("ERROR=" + e.message);
			else
				ngmf.alert("ERROR=" + e[1]);
		});
	}catch(e){
		ngmf._error("[ngmf.csvPushCall] Exception :: ", e);
	}

};
// 데이터리스트를 csv 형식의 바꾼 후 배열로 반환
ngmf._getDstCsv = function(dstName, isHead) {
	// 변수선언
	var sRtnVal = null;
	try {
		dstName = ngmf.object(dstName);
		if (!dstName) {
			return sRtnVal;
		}
		var sDstName = dstName.id;
		var csvArray = [];
		var maxCol = 99;
		if (isHead) {
			var rowArray = [];
			rowArray.push(sDstName);
			for ( var col = 0; col < maxCol; col++) {
				var colNm = dstName.getColumnID(col) == undefined ? "" : '' + dstName.getColumnID(col) + '';
				rowArray.push(colNm);
			}
			csvArray.push(rowArray);
		}
		for ( var row = 0; row < dstName.getRowCount(); row++) {
			var rowArray = [];
			rowArray.push(sDstName);
			for ( var col = 0; col < maxCol; col++) {
				var colDt = dstName.getCellData(row, col) == undefined ? ""
						: '' + dstName.getCellData(row, col) + '';
				rowArray.push(colDt);
			}
			csvArray.push(rowArray);
		}
		sRtnVal = csvArray;// Papa.unparse(csvArray);
	} catch (e) {
		ngmf._error("[ngmf._getDstCsv ] Exception :: ", e);
		return false;
	}
	return sRtnVal;
};

// 배열을 string 타입의 csv형식으로 변환
ngmf._jsonToCsvString = function(data) {
	try {
		var csv = null;
		csv = data.map(function(d) {
			return JSON.stringify(d);
		}).join('\n').replace(/(^\[)|(\]$)/mg, '');
		return csv;
	}catch (e) {
		ngmf._error("[ngmf._jsonToCsvString ] Exception :: ", e);
		return false;
	} 
};

ngmf._getSavePathNm = function(fileId) {
	try {
		if (ngmf.isNull(fileId) == "Y")
			return;
		var fileinfo = null;
		if (typeof Ds_File == "undefined")
			ngmf.createDataList("Ds_File", [ "chk", "file", "size", "del",
				"atfilId", "atfilSerNum", "savePathNm", "trxCode" ], [ "text",
				"text", "text", "text", "text", "text", "text", "text" ]);
		else  Ds_File.removeAll();
		var chkValArr = ngmf.getFileList(fileId, Ds_File, 1);
		if (chkValArr[0] == "Y") {
			if (Ds_File.getRowCount() > 0) {
				fileinfo =  Ds_File.getCellData(chkValArr[1],"savePathNm");
			}
			Ds_File.removeAll();
		} else {
			ngmf.alert(ngmf.getErrMessage(chkValArr[1]));
		}
		return fileinfo;
	} catch (e) {
		ngmf._error("[ngmf._getSavePathNm ] Exception :: ", e);
		return "";
	}
};


/** 
 * TEXT String 을 로컬 파일로 저장(비공개)
 * @date 2016.06.23
 * @memberOf ngmf 
 * @param {String} str :: I :: N ::   ::	DATA LIST or ID 
 * @param {String} fileName 	:: I :: Y :: noname.xml ::	저장할 파일명 
 * @return {Array} ["Y or N","오류내용"]
 * @author 성일호 
 * @example 
 			var retArr =  ngmf._saveTextToFile("<root></root>","sample.xml");
 			if (retArr[0] == "N") ngm.alert("오류:::::" + retArr[1]);
 			else  ngmf.alert("저장성공");
 */ 
ngmf._saveTextToFile = function(str, _fileName){ 
	var rtn_arr = new Array();
	try {
		var fileName = _fileName || "noname.xml"; 
		//var saveData = "\uFEFF" + str;
		var saveData = str;
		if (str) {
			var blobData = new Blob([saveData],{type:"text/xml;charset=utf-8;"}); 
			
			if (typeof window.navigator.msSaveBlob == "function") {
				//IE 파일저장...
				window.navigator.msSaveBlob(blobData, fileName);
			} else {
				//기타 파일저장...
				var save = document.createElement('a');
				save.href = URL.createObjectURL(blobData) ;
				save.target = '_blank';
				save.download = fileName ;

				var event = document.createEvent('Event');
				event.initEvent('click', true, true);
				save.dispatchEvent(event);
				(window.URL || window.webkitURL).revokeObjectURL(save.href);
			}
			rtn_arr[0] = "Y";
			rtn_arr[1] = "저장처리가 완료되었습니다."; 
		} else throw  new Error("저장할 내용이 없습니다.");
	} catch(e) {
		rtn_arr[0] = "N";
		if (e["message"]) rtn_arr[1] = e.message; else rtn_arr[1] = e ;
		ngmf._error("[ngmf.promise._saveTextToFile] Exception :: ", e);
	}
	return rtn_arr;
};

/**
 * CallBackFunction을 찾아주는 API 
 * @date 2016-06-29
 * @memberOf ngmf
 * @param {String} callBackFunc :: I :: N ::  :: callBackFunc 이름 
 * @author 성일호
 * @update 재정리
 */ 
ngmf._getCallBackFunction = function ( callBackFunc ) {
	var _callBackFunc = null ;
	try{
		if(typeof callBackFunc != 'undefined' ) {
			if(typeof  callBackFunc == "string") {
				if( callBackFunc.startsWith("scwin")) { 
					_callBackFunc = window["scwin"][ callBackFunc.replace("scwin.","")];
				} else if( callBackFunc.indexOf(".") > -1) {
					var callBackFuncArr = callBackFunc.split(".");
					if (window[callBackFuncArr[0]] && window[callBackFuncArr[0]][ callBackFuncArr[1]] ) {
						_callBackFunc = window[callBackFuncArr[0]][ callBackFuncArr[1]];
					} 
				} else _callBackFunc = window[ callBackFunc];
			} else {
				_callBackFunc =  callBackFunc;
			}
		}
	} catch(e) {
		ngmf._error("[ngmf._getCallBackFunction] Exception :: ", e);
	}
	return _callBackFunc;
};


/**
 *  URL 파일 업로드 (Promise)
 * @date 2016.10.05
 * @memberOf ngmf
 * @param {Number} enc :: I :: N ::  :: 암호화여부 - 0 : 비암호화 게시판, 1 : 암호화 게시판
 * @param {String / Json} url :: I :: N ::  :: pdf Download URL
 * @param {String} expDate :: I :: N ::  :: 유효일자 '0' : 영구, '1' : 3년
 * @param {Boolean} eFlag :: I :: N ::  :: 1 :  
 * @param {String} screenNM :: I :: N ::  :: 화면명 (input 으로 사용)
 * @param {String} atfilTitleNm :: I :: N ::  :: 파일명 (필수)
 * @param {String / Json} progressFunc :: I :: Y ::  :: 프로그래스 처리용 CAllBACK 함수
 * @param {Boolean} chkAcl :: I :: Y ::  :: 암호화 해제여부 00: 게시판, 비암호화 되어 저장 01 : 게시판, 암호화 되어 저장 10: 배치인 경우 무조건 암호화 되어 저장
 * @param {String} remoteUrl :: I :: Y ::  :: 파일업로드 서블릿 호출 url(현재 접속 url 정보)-모바일인 경우만 사용
 * @returns {Object} Promise
 * @author 성일호
 * @useMobile use
 * @example
       	    var enc = 1; // 0=비암호화파일(암호화 파일 업로드 불가)   1=암호화 파일(비암호화 파일도 업로드 가능)
       	    var url = "http://172.31.117.23:8101/RDServer/download?filename=2016/10/06/ZNGMSRPT00010_161006.pdf";
       	    var chkAcl = "01"; //00: 게시판, 비암호화 되어 저장 01 : 게시판, 암호화 되어 저장 10: 배치인 경우 무조건 암호화 되어 저장 
			ngmf.promise.urlUploadFile(enc, url, "1", 1, ngmf._getScreenName(), "sample.pdf", null,chkAcl )
			.then( function (retObj) {
				ngmf.debug("retObj ==" , retObj); 
				if (retObj[0] == "Y") {
					// TODO. 저장 후 처리 프로세서 진행	 
					ngmf.alert("UPLOAD 성공 fileID=" + retObj[1]); 
				} else {
					ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
				}
			}) 
			.then( undefined, function (retObj) {
				if (retObj["message"]) {
					ngmf.alert("UPLOAD 실패 :::::" + retObj["message"] );
				} else ngmf.alert("UPLOAD 실패 :::::" + ngmf.getErrMessage(retObj[1]));
			}); 
 */
ngmf.promise.urlUploadFile = function(_enc, url, expDate, eFlag, screenNM, atfilTitleNm, progressFunc, chkAcl, remoteUrl) {
	return new Promise(function(resolve, reject) {
		var sRtnVal = new Array();
		var fileObj = null;
		try{
			var enc = Number(_enc);
			if (isNaN(enc)) enc = 1;
			sRtnVal[0] = "N";
			var xHr = WebSquare.core.getXMLHTTPObject();
			
			xHr.onerror = function(_progress) {
				sRtnVal[1] = "SERVER ERROR status::"+ xHr.status +"  readyState::"+ xHr.readyState;
				ngmf._error("[ngmf.promise.urlUploadFile  xHr.onerror] xHr.readyState :: " + xHr.readyState + " ERROR:" + _progress );
					//오류처리
				resolve(sRtnVal);
			};

			//결과 처리
			xHr.onreadystatechange = function(rqPgrsEv) {
				if (xHr.readyState == xHr.DONE ){
					var result_arr = sRtnVal;
					try {  
						if ( xHr.status == 200 && xHr.response && xHr.response.size > 0 ){
							fileObj = xHr.response;
							fileObj["name"] = atfilTitleNm || "noname.pdf";
							ngmf.promise._encUploadSingleFileNew(enc, fileObj, expDate, eFlag, screenNM, fileObj["name"], progressFunc, chkAcl, remoteUrl).then( function(retVal) {
								resolve(retVal); 
							});	 
						} else {
							result_arr[0] = "N"; 
							result_arr[1] = "파일을 찾을 수 없습니다.["+ xHr.status+"]";
							resolve(result_arr);
						} 
					} catch(ex) {
						result_arr[0] = "N";
						result_arr[1] = ex["message"];
						ngmf._error("[ngmf.urlUploadFile ] Exception :: ", ex);
						//오류처리
						resolve(result_arr);
					} finally {
						if (xHr) {
							xHr.abort();
							xHr = null;
						}
					}
				} 
			};
			xHr.open ("GET", url, true); // true : Async  false : Sync 
			xHr.withCredentials = true;  // For CORS
			xHr.responseType = "blob";
			xHr.send();  ;

		} catch (e) {
			ngmf._error("[ngmf.promise.urlUploadFile ] Exception :: ", e);
			if (!eFlag) sRtnVal = "N";
			else {
				sRtnVal = new Array();
				sRtnVal[0] = "N";
				sRtnVal[1] = e["message"] || e;
			}
			resolve(sRtnVal); 
		} 
	});
};
ngmf.downloadMultiFile = function() {
	ngmf.alert("[16.07.15]ngmf.downloadMultiFile 함수는 삭제함수로 ngmf.promise.downloadMultiFile를 사용하시기 바랍니다.");
};

ngmf.downloadSingleFile = function() {
	ngmf.alert("[16.07.15]ngmf.downloadSingleFile 함수는 삭제함수로 ngmf.promise.downloadSingleFile 를 사용하시기 바랍니다.");
};

ngmf.encUploadMultiFile = function() {
	ngmf.alert("[16.07.15]ngmf.encUploadMultiFile 함수는 삭제함수로 ngmf.promise.encUploadMultiFile 를 사용하시기 바랍니다.");
};

ngmf.encUploadSingleFile = function() {
	ngmf.alert("[16.07.15]ngmf.encUploadSingleFile 함수는 삭제함수로 ngmf.promise.encUploadSingleFile 를 사용하시기 바랍니다.");
};

ngmf.batDownloadMultiFile = function() {
	ngmf.alert("[16.07.15]ngmf.batDownloadMultiFile 함수는 삭제함수로 ngmf.promise.batDownloadMultiFile 를 사용하시기 바랍니다.");
};

ngmf.popupExcelImport = function() {
	ngmf.alert("[16.07.15]ngmf.popupExcelImport 함수는 삭제함수로 ngmf.promise.popupExcelImport 를 사용하시기 바랍니다.");
};
 