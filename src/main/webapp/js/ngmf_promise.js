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

/** Modal(Dialog) 팝업창.
 * @date 2016.02.24
 * @memberOf ngmf
 * @param {String} strPrefix     :: I :: N ::    :: Open File Path(Directory)
 * @param {String} strFormID     :: I :: N ::    :: Open Form file Name
 * @param {Object} strInArgument :: I :: Y :: "" :: Argument (id, value)
 * @param {String} nWidth        :: I :: N ::    :: Popup Form Width
 * @param {String} nHeight       :: I :: N ::    :: Popup Form Height
 * @param {Object} strOpenStyle            :: I :: Y :: "" :: Popup Form Open Style 설정
 *        {Boolean} strOpenStyle.autoSize  :: I :: Y :: true :: Popup Form 에서 지정한 크기로 할지 여부.(default:true)
 *        {Boolean} strOpenStyle.resize    :: I :: Y :: false:: 미사용.
 *        {Boolean} strOpenStyle.scroll    :: I :: Y :: false:: 미사용.
 *        {Number}  strOpenStyle.winLevel  :: I :: Y :: 0    :: 미사용.
 *        {Boolean} strOpenStyle.closeFlag :: I :: Y :: true :: 미사용.
 * @param {String} nLeft         :: I :: Y :: -1 :: Popup Form nX(Left Position)
 * @param {String} nTop          :: I :: Y :: -1 :: Popup Form nY(Top Position)
 * @param {String} screenName    :: I :: Y ::    :: Popup 열기 시 부모 화면 명
 * @return {Object} Promise 객체.
 * @resolveParam {Object} rtnObj 팝업창이 닫히면서 호출되는 CallBack 파라메터
 * @resolveParam {Object} rtnObj.rtnObj  : closePopup호출시 전달된 파라메터
 * @resolveParam {String} rtnObj.popupId : 팝업창 ID
 * @author 이동규
 * @sync false
 * @useMobile use
 * @example var callBackPromise = ngmf.promise.dialog( strPrefix,strFormID, strInArgument , nWidth, nHeight, strOpenStyle, nLeft, nTop, screenName)
 * @example callBackPromise.then( function(rtnObj) {
 * @example		var rtnArguments = rtnObj.rtnObj;  팝업 창에서 넘겨준 데이터
 * @example		var popupId = rtnObj.popupId;  팝업 창에서 넘겨준 데이터
 * @example		//콜백 구현 Script
 * @example });
 */
ngmf.promise.dialog = function(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, screenName, wframeMode) {
	return new Promise(function(resolve, reject) {
		var callbackFunc = function(rtnVal, popupId) {
			resolve({"rtnObj" : rtnVal, "popupId" : popupId});
		};
		callbackFunc.isPromiseCallback = true;
		ngmf.__dialog(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, callbackFunc, screenName, false, wframeMode);
 	});
};

/** 
 * 중복허용 Modal(Dialog) 팝업창
 * @date 2016.07.06
 * @memberOf ngmf
 * @param {String} strPrefix     :: I :: N ::    :: Open File Path(Directory)
 * @param {String} strFormID     :: I :: N ::    :: Open Form file Name
 * @param {Object} strInArgument :: I :: Y :: "" :: Argument (id, value)
 * @param {String} nWidth        :: I :: N ::    :: Popup Form Width
 * @param {String} nHeight       :: I :: N ::    :: Popup Form Height
 * @param {Object} strOpenStyle            :: I :: Y :: "" :: Popup Form Open Style 설정
 *        {Boolean} strOpenStyle.autoSize  :: I :: Y :: true :: Popup Form 에서 지정한 크기로 할지 여부.(default:true)
 *        {Boolean} strOpenStyle.resize    :: I :: Y :: false:: 미사용.
 *        {Boolean} strOpenStyle.scroll    :: I :: Y :: false:: 미사용.
 *        {Number}  strOpenStyle.winLevel  :: I :: Y :: 0    :: 미사용.
 *        {Boolean} strOpenStyle.closeFlag :: I :: Y :: true :: 미사용.
 * @param {String} nLeft         :: I :: Y :: -1 :: Popup Form nX(Left Position)
 * @param {String} nTop          :: I :: Y :: -1 :: Popup Form nY(Top Position)
 * @param {String} screenName    :: I :: Y ::    :: Popup 열기 시 부모 화면 명
 * @return {Object} Promise 객체.
 * @resolveParam {Object} rtnObj 팝업창이 닫히면서 호출되는 CallBack 파라메터
 * @resolveParam {Object} rtnObj.rtnObj  : closePopup호출시 전달된 파라메터
 * @resolveParam {String} rtnObj.popupId : 팝업창 ID
 * @author 이동규
 * @sync false
 * @useMobile use
 * @example var callBackPromise = ngmf.promise.dialog( strPrefix,strFormID, strInArgument , nWidth, nHeight, strOpenStyle, nLeft, nTop, screenName)
 * 					 callBackPromise.then( function(rtnObj) {
 * 						var rtnArguments = rtnObj.rtnObj;  팝업 창에서 넘겨준 데이터
 * 						var popupId = rtnObj.popupId;  팝업 창에서 넘겨준 데이터
 * 						//콜백 구현 Script
 * 					 });
 */
ngmf.promise.dialogDup = function(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, screenName, wframeMode) {
	return new Promise(function(resolve, reject) {
		var callbackFunc = function(rtnVal, popupId) {
			resolve({"rtnObj" : rtnVal, "popupId" : popupId});
		};
		callbackFunc.isPromiseCallback = true;
		ngmf.__dialog(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, callbackFunc, screenName, true, wframeMode);
 	});
};

/** Modalless(Open) Form Open(Popup Form)
 * @date 2016.02.24
 * @memberOf ngmf
 * @param {String} strPrefix     :: I :: N ::    :: Open File Path(Directory)
 * @param {String} strFormID     :: I :: N ::    :: Open Form file Name
 * @param {Object} strInArgument :: I :: Y :: "" :: Argument (id, value)
 * @param {String} nWidth        :: I :: N ::    :: Popup Form Width
 * @param {String} nHeight       :: I :: N ::    :: Popup Form Height
 * @param {String} strOpenStyle  :: I :: Y :: "" :: Popup Form Open Style 설정
 *        {Boolean} strOpenStyle.autoSize  :: I :: Y :: true :: Popup Form 에서 지정한 크기로 할지 여부.(default:true)
 *        {Boolean} strOpenStyle.resize    :: I :: Y :: false:: 미사용.
 *        {Boolean} strOpenStyle.scroll    :: I :: Y :: false:: 미사용.
 *        {Number}  strOpenStyle.winLevel  :: I :: Y :: 0    :: 미사용.
 *        {Boolean} strOpenStyle.closeFlag :: I :: Y :: true :: 미사용.
 * @param {String} nLeft         :: I :: Y :: -1 :: Popup Form nX(Left Position)
 * @param {String} nTop          :: I :: Y :: -1 :: Popup Form nY(Top Position)
 * @param {String} screenName    :: I :: Y ::    :: Popup 열기 시 부모 화면 명
 * @return {Object} Promise 객체.
 * @resolveParam {Object} rtnObj 팝업창이 닫히면서 호출되는 CallBack 파라메터
 * @resolveParam {Object} rtnObj.rtnObj  : closePopup호출시 전달된 파라메터
 * @resolveParam {String} rtnObj.popupId : 팝업창 ID
 * @author 이동규
 * @sync false
 * @useMobile use
 * @example var callBackPromise = ngmf.promise.open( strPrefix,strFormID, strInArgument , nWidth, nHeight, strOpenStyle, nLeft, nTop, screenName)
 * @example callBackPromise.then( function(rtnObj) {
 * @example		var rtnArguments = rtnObj.rtnObj;  팝업 창에서 넘겨준 데이터
 * @example		var popupId = rtnObj.popupId;  팝업 창에서 넘겨준 데이터
 * @example		//콜백 구현 Script
 * @example });
 */
ngmf.promise.open = function(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, screenName, wframeMode) {
	return new Promise(function(resolve, reject) {
		var callbackFunc = function(rtnVal, popupId) {
			resolve({"rtnObj" : rtnVal, "popupId" : popupId});
		};
		callbackFunc.isPromiseCallback = true;
		ngmf.__open(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, callbackFunc, screenName, false, wframeMode);
 	});
};
/** 
 * 중복허용 Modalless(Open) 팝업창
 * @date 2016.07.06
 * @memberOf ngmf
 * @param {String} strPrefix     :: I :: N ::    :: Open File Path(Directory)
 * @param {String} strFormID     :: I :: N ::    :: Open Form file Name
 * @param {Object} strInArgument :: I :: Y :: "" :: Argument (id, value)
 * @param {String} nWidth        :: I :: N ::    :: Popup Form Width
 * @param {String} nHeight       :: I :: N ::    :: Popup Form Height
 * @param {String} strOpenStyle  :: I :: Y :: "" :: Popup Form Open Style 설정
 * @param {String} nLeft         :: I :: Y :: -1 :: Popup Form nX(Left Position)
 * @param {String} nTop          :: I :: Y :: -1 :: Popup Form nY(Top Position)
 * @param {String} screenName    :: I :: Y ::    :: Popup 열기 시 부모 화면 명
 * @return {Object} Promise 객체.
 * @resolveParam {Object} rtnObj 팝업창이 닫히면서 호출되는 CallBack 파라메터
 * @resolveParam {Object} rtnObj.rtnObj  : closePopup호출시 전달된 파라메터
 * @resolveParam {String} rtnObj.popupId : 팝업창 ID
 * @author 이동규
 * @sync false
 * @useMobile use
 * @example var callBackPromise = ngmf.promise.open( strPrefix,strFormID, strInArgument , nWidth, nHeight, strOpenStyle, nLeft, nTop, screenName)
 * 					 callBackPromise.then( function(rtnObj) {
 * 						var rtnArguments = rtnObj.rtnObj;  팝업 창에서 넘겨준 데이터
 * 						var popupId = rtnObj.popupId;  팝업 창에서 넘겨준 데이터
 * 						//콜백 구현 Script
 * 					 });
 */
ngmf.promise.openDup = function(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, screenName, wframeMode) {
	return new Promise(function(resolve, reject) {
		var callbackFunc = function(rtnVal, popupId) {
			resolve({"rtnObj" : rtnVal, "popupId" : popupId});
		};
		callbackFunc.isPromiseCallback = true;
		ngmf.__open(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, callbackFunc, screenName, true, wframeMode);
 	});
};

/**알림 Message 처리
 * @date 2016.03.09
 * @memberOf ngmf
 * @param {Object} arrCode :: I :: N ::    :: Open File Path(Directory)
 * @param {Object} arrMsg  :: I :: N ::    :: Open Form file Name
 * @return {Object} Promise 객체.
 * @resolveParam {Object}
 * @author 이동규
 * @sync false
 * @useMobile use
 * @example var callBackPromise = ngmf.promise.setDialogMsg( arrCode, arrMsg);
 * @example callBackPromise.then( function(rtnObj) {
 * @example		//콜백 구현 Script
 * @example });
 */
ngmf.promise.setDialogMsg = function(arrCode, arrMsg) {
	return new Promise(function(resolve, reject) {
		ngmf.__setDialogMsg(arrCode, arrMsg, function(rtnObj) {
			resolve(rtnObj);
		});
 	});
};


/**
 * Combo Service Call
 * @date 2016.02.24
 * @memberOf ngmf
 * @param {String}  ScreenName      :: I :: N ::    :: Service 호출 Window ID
 * @param {Array}   strInputObjList :: I :: N ::    :: Input Dataset List
 * @param {String}  outputList      :: I :: N ::    :: Output Dataset List
 * @param {Array}   comboIdList     :: I :: N ::    :: Combo Object List
 * @param {Array}   filterList      :: I :: Y :: "" :: Data filter 조건 정의
 * @param {Array}   AddRowName      :: I :: Y :: "" :: Data Row 추가 설정
 * @param {Array}   AddRowPos       :: I :: Y :: "" :: 추가 Row Position 설정
 * @param {Array}   SortList        :: I :: Y :: "" :: Sort 항목 정의
 * @param {Array}   SortOrdList     :: I :: Y :: "" :: Sort Type 정의(Asc:A/Desc:D)
 * @param {String}  ngmv_MsgFg      :: I :: Y ::NONE:: Message 처리(자동/설정)
 * @param {String}  newTrxCode      :: I :: Y :: "" :: 새로운 Transaction Code
 * @return {Object} Promise 객체.
 * @author 이동규
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj combo 서비스 처리시 결과 파라메터
 * @resolveParam {String} rtnObj.svcId     : Transaction Code. combo함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.errorCode : 서비스 통신 결과 코드
 * @resolveParam {Object} rtnObj.errorMsg  : 서비스 통신 결과 메시지
 * @example var callBackFunction = ngmf.promise.combo(ScreenName,strInputObjList,outputList, comboIdList, filterList, AddRowName, AddRowPos);
 * @example callBackFunction.then(function(rtnObj) { 
 * @example     var SrvId = rtnObj.svcId;
 * @example     var ErrorCode = rtnObj.errorCode;
 * @example     var ErrorMsg = rtnObj.errorMsg;
 * @example	    
 * @example     if(ErrorCode == 1) {
 * @example		    var strSysMsg = ""
 * @example		    ngmf.promise.setErrorMsg(ErrorMsg,strSysMsg);
 * @example		    return false;  
 * @example	    }
 * @example });
 */
ngmf.promise.combo = function (ScreenName, strInputObjList, outputList, comboIdList, filterList, AddRowName, AddRowPos, SortList, SortOrdList, ngmv_MsgFg, newTrxCode) {
	return new Promise(function(resolve, reject) {
		ngmf.__combo(ScreenName, strInputObjList, outputList, comboIdList, function(svcId, errorCode, errorMsg) {
			resolve({"svcId" : svcId, "errorCode" : errorCode , "errorMsg" : errorMsg});
		}, filterList, AddRowName, AddRowPos, SortList, SortOrdList, ngmv_MsgFg, false, newTrxCode);
	});
};

/**
 * Combo2 Service Call
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} ScreenName     :: I :: N ::    :: Service 호출 Window ID
 * @param {Array} strInputObjList :: I :: N ::    :: Input Dataset List
 * @param {String} outputList     :: I :: N ::    :: Output Dataset List
 * @param {Array} comboIdList     :: I :: N ::    :: Combo Object List
 * @param {Array} filterList      :: I :: Y :: "" :: Data filter 조건 정의
 * @param {Array} AddRowName      :: I :: Y :: "" :: Data Row 추가 설정
 * @param {Array} AddRowPos       :: I :: Y :: "" :: 추가 Row Position 설정
 * @param {Array} SortList        :: I :: Y :: "" :: Sort 항목 정의
 * @param {Array} SortOrdList     :: I :: Y :: "" :: Sort Type 정의(Asc:A/Desc:D)
 * @param {String} ngmv_MsgFg     :: I :: Y ::NONE:: Message 처리(자동/설정)
 * @param {String}  newTrxCode    :: I :: Y :: "" :: 새로운 Transaction Code
 * @return {Object} Promise 객체.
 * @author 이동규
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj combo2 서비스 처리시 결과 파라메터
 * @resolveParam {String} rtnObj.svcId     : Transaction Code. combo2함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.errorCode : 서비스 통신 결과 코드
 * @resolveParam {Object} rtnObj.errorMsg  : 서비스 통신 결과 메시지 
 * @example var callBackFunction = ngmf.promise.combo2(ScreenName,strInputObjList,outputList,comboIdList,filterList,AddRowName, AddRowPos);
 * @example callBackFunction.then(function(rtnObj) { 
 * @example     var SrvId = rtnObj.svcId;
 * @example     var ErrorCode = rtnObj.errorCode;
 * @example     var ErrorMsg = rtnObj.errorMsg;
 * @example	    
 * @example     if(ErrorCode == 1) {
 * @example		    var strSysMsg = ""
 * @example		    ngmf.promise.setErrorMsg(ErrorMsg,strSysMsg);
 * @example		    return false;  
 * @example	    }
 * @example });
 */
ngmf.promise.combo2 = function (ScreenName, strInputObjList, outputList, comboIdList, filterList, AddRowName, AddRowPos, SortList, SortOrdList, ngmv_MsgFg, newTrxCode) {
	return new Promise(function(resolve, reject) {
		ngmf.__combo2(ScreenName, strInputObjList, outputList, comboIdList, function(svcId, errorCode, errorMsg) {
			resolve({"svcId" : svcId, "errorCode" : errorCode , "errorMsg" : errorMsg});
		}, filterList, AddRowName, AddRowPos, SortList, SortOrdList, ngmv_MsgFg, false, newTrxCode);
	});
};

 /**
 * ComboEng Service Call 영문 data
 * @date 2016.02.24
 * @memberOf ngmf
 * @param {String}  ScreenName      :: I :: N ::    :: Service 호출 Window ID
 * @param {Array}   strInputObjList :: I :: N ::    :: Input Dataset List
 * @param {String}  outputList      :: I :: N ::    :: Output Dataset List
 * @param {Array}   comboIdList     :: I :: N ::    :: Combo Object List
 * @param {Array}   filterList      :: I :: Y :: "" :: Data filter 조건 정의
 * @param {Array}   AddRowName      :: I :: Y :: "" :: Data Row 추가 설정
 * @param {Array}   AddRowPos       :: I :: Y :: "" :: 추가 Row Position 설정
 * @param {Array}   SortList        :: I :: Y :: "" :: Sort 항목 정의
 * @param {Array}   SortOrdList     :: I :: Y :: "" :: Sort Type 정의(Asc:A/Desc:D)
 * @param {String}  ngmv_MsgFg      :: I :: Y ::NONE:: Message 처리(자동/설정)
 * @param {String}  newTrxCode      :: I :: Y :: "" :: 새로운 Transaction Code
 * @return {Object} Promise 객체.
 * @author 이동규
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj comboEng 서비스 처리시 결과 파라메터
 * @resolveParam {String} rtnObj.svcId     : Transaction Code. comboEng함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.errorCode : 서비스 통신 결과 코드
 * @resolveParam {Object} rtnObj.errorMsg  : 서비스 통신 결과 메시지 
 * @example var callBackFunction = ngmf.promise.comboEng(ScreenName,strInputObjList,outputList, comboIdList, filterList, AddRowName, AddRowPos);
 * @example callBackFunction.then(function(rtnObj) { 
 * @example     var SrvId = rtnObj.svcId;
 * @example     var ErrorCode = rtnObj.errorMsg;
 * @example     var ErrorMsg = rtnObj.errorMsg;
 * @example	    
 * @example     if(ErrorCode == 1) {
 * @example		    var strSysMsg = ""
 * @example		    ngmf.promise.setErrorMsg(ErrorMsg,strSysMsg);
 * @example		    return false;  
 * @example	    }
 * @example });
 */
ngmf.promise.comboEng = function (ScreenName, strInputObjList, outputList, comboIdList, filterList, AddRowName, AddRowPos, SortList, SortOrdList, ngmv_MsgFg) {
	return new Promise(function(resolve, reject) {
		ngmf.__comboEng(ScreenName, strInputObjList, outputList, comboIdList, function(svcId, errorCode, errorMsg) {
			resolve({"svcId" : svcId, "errorCode" : errorCode , "errorMsg" : errorMsg});
		}, filterList, AddRowName, AddRowPos, SortList, SortOrdList, ngmv_MsgFg, false);
	});
};

/**
 * svcCombo Service Call
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} ScreenName      :: I :: N ::    :: Service 호출 Window ID
 * @param {String} strInputObjList :: I :: N ::    :: Input Dataset List
 * @param {Array} outputList       :: I :: N ::    :: Output Dataset List
 * @param {String} ngmv_MsgFg      :: I :: Y ::NONE:: Message 처리(자동/설정)
 * @param {String} strDB           :: I :: Y ::    :: DB 구분
 * @param {String} dbioId          :: I :: Y ::    :: DB 구분ID
 * @return {Object} Promise 객체.
 * @author 이동규
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj svcCombo 서비스 처리시 결과 파라메터
 * @resolveParam {String} rtnObj.svcId     : Transaction Code. svcCombo함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.errorCode : 서비스 통신 결과 코드
 * @resolveParam {Object} rtnObj.errorMsg  : 서비스 통신 결과 메시지 
 * @example var callBackPromise = ngmf.promise.svcCombo(ScreenName, strInputObjList, outputList, ngmv_MsgFg, strSyncFg, strDB, dbioId);
 * @example callBackPromise.then(function(rtnObj) { 
 * @example     var SrvId = rtnObj.svcId;
 * @example     var ErrorCode = rtnObj.errorCode;
 * @example     var ErrorMsg = rtnObj.errorMsg;
 * @example	    
 * @example     if(ErrorCode == 1) {
 * @example		    var strSysMsg = ""
 * @example		    ngmf.promise.setErrorMsg(ErrorMsg,strSysMsg);
 * @example		    return false;  
 * @example	    }
 * @example });
 */
ngmf.promise.svcCombo = function(ScreenName, strInputObjList, outputList, ngmv_MsgFg, strDB, dbioId) {
	return new Promise(function(resolve, reject) {
		ngmf.__svcCombo(ScreenName, strInputObjList, outputList, function(svcId, errorCode, errorMsg) {
			resolve({"svcId" : svcId, "errorCode" : errorCode , "errorMsg" : errorMsg});
		}, ngmv_MsgFg, false, strDB, dbioId);
	});
};

/**
 * LoV(List of Value) 팝업화면.
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} callbackID       :: I :: N ::   :: 콜백분기아이디
 * @param {String} screenId         :: I :: N ::   :: LOV 호출 Window ID
 * @param {String} arrInputObjList  :: I :: N ::   :: 검색 조건 Parameter List
 * @param {String} multiYn          :: I :: Y :: N :: Multi Selete Yes(Y)/No(N)
 * @param {String} dspList          :: I :: Y ::   :: Display Column Count(Max 5)
 * @param {String} lovWidthList     :: I :: Y ::600:: Display Column Width 설정
 * @param {String} lovAlignList     :: I :: Y ::437:: Display Column Align 설정
 * @param {String} lovWinTitle      :: I :: Y ::   :: Window Title 설정
 * @param {String} arrLovTitle      :: I :: Y ::   :: Gird Head Text 설정
 * @param {String} colDelimeter     :: I :: Y ::   :: return Column Delimeter설정
 * @param {String} recDelimeter     :: I :: Y ::   :: return Record Delimeter설정
 * @param {String} strPRDLike       :: I :: Y ::   :: 상품검색(유사어 검색) LoV 구분
 * @param {String} strPRDWinTitle   :: I :: Y ::   :: 상품검색(유사어 검색) 일 경우 TITLE
 * @param {String} strPRDGridTitle  :: I :: Y ::   :: 상품검색(유사어 검색) 일 경우 Gird Head Text 설정
 * @param {String} isNothingMsg     :: I :: Y ::   :: 데이터가 없는 경우 메시지 노출여부
 * @param {String} isNotingPop      :: I :: Y ::   :: 데이터가 없는 경우 팝업 OPEN여부
 * @return {Object} Promise 객체.
 * @author 이동규
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj lov 서비스 팝업화면 처리 전달 파라메터
 * @resolveParam {String} rtnObj.componentId : 콜백분기아이디. LoV함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.rtnObj      : LoV 팝업 선택 데이터
 * @example var promise = ngmf.promise.lov(callbackID, screenId,arrInputObjList,multiYn,dspList, lovWidthList, lovAlignList, lovWinTitle,
 * @example			arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle, isNothingMsg, isNotingPop);
 * @example promise.then(function(pRtn) { 
 * @example                  var rtn = pRtn.rtnObj;
 * @example                  var componentId = pRtn.componentId;
 * @example				     if(ngmf.length(rtn) ==0) {
 * @example                     dst_AprvReqTyp.SetColumn(0,"aprv_typ_id","");	
 * @example                     dst_AprvReqTyp.SetColumn(0,"aprv_typ_nm","");
 * @example 			     } else {
 * @example   
 * @example                  }
 * @example              }
 * @example );
 */
ngmf.promise.lov = function(callbackID, screenId, arrInputObjList, multiYn, dspList, lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle, isNothingMsg, isNotingPop)  {
	return new Promise(function(resolve, reject) {
		var callbackFunc = function(componentId, rtnObj) {
			resolve({"componentId" : componentId, "rtnObj" : rtnObj});
		};
		callbackFunc.isPromiseCallback = true;
		callbackFunc.isLov = true;
		ngmf.__lovW(callbackID, screenId, arrInputObjList, multiYn, dspList, lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle,callbackFunc, isNothingMsg, isNotingPop);
		
//		if(ngmf.isMobile()) {
//			ngmf.__lovW(callbackID, screenId, arrInputObjList, multiYn, dspList, lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle,callbackFunc, isNothingMsg, isNotingPop);
//		} else {
//			ngmf.__lov(callbackID, screenId, arrInputObjList, multiYn, dspList, lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle,callbackFunc, isNothingMsg, isNotingPop);
//		}
		
	});
};

/**
 * LoV2(List of Value) 기능 처리 - 상품 유사어 검색 전용
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} callbackID       :: I :: N :: :: 콜백분기아이디
 * @param {String} screenId         :: I :: N :: :: LOV 호출 Window ID
 * @param {String} arrInputObjList  :: I :: N :: :: 검색 조건 Parameter List
 * @param {String} multiYn          :: I :: N :: :: Multi Selete Yes(Y)/No(N)
 * @param {String} dspList          :: I :: Y :: :: Display Column Count(Max 5)
 * @param {String} lovWidthList     :: I :: Y :: :: Display Column Width 설정
 * @param {String} lovAlignList     :: I :: Y :: :: Display Column Align 설정
 * @param {String} lovWinTitle      :: I :: Y :: :: Window Title 설정
 * @param {String} arrLovTitle      :: I :: Y :: :: Gird Head Text 설정
 * @param {String} colDelimeter     :: I :: Y :: :: return Column Delimeter설정
 * @param {String} recDelimeter     :: I :: Y :: :: return Record Delimeter설정
 * @param {String} strPRDLike       :: I :: Y :: :: 상품검색(유사어 검색) LoV 구분
 * @param {String} strPRDWinTitle   :: I :: Y :: :: 상품검색(유사어 검색) 일 경우 TITLE
 * @param {String} strPRDGridTitle  :: I :: Y :: :: 상품검색(유사어 검색) 일 경우 Gird Head Text 설정
 * @param {String} isNothingMsg     :: I :: Y :: :: 데이터가 없는 경우 메시지 노출여부
 * @param {String} isNotingPop      :: I :: Y :: :: 데이터가 없는 경우 팝업 OPEN여부
 * @author 이동규
 * @useMobile use
 * @resolveParam {Object} rtnObj lov 서비스 팝업화면 처리 전달 파라메터
 * @resolveParam {String} rtnObj.componentId : 콜백분기아이디. LoV함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.rtnObj      : LoV 팝업 선택 데이터
 * @example var promise = ngmf.promise.lov2(callbackID, screenId,arrInputObjList,multiYn,dspList, lovWidthList, lovAlignList, lovWinTitle,
 * @example			arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle, isNothingMsg, isNotingPop);
 * @example promise.then(function(pRtn) { 
 * @example                  var rtn = pRtn.rtnObj;
 * @example                  var componentId = pRtn.componentId;
 * @example				     if(ngmf.length(rtn) ==0) {
 * @example                     dst_AprvReqTyp.SetColumn(0,"aprv_typ_id","");	
 * @example                     dst_AprvReqTyp.SetColumn(0,"aprv_typ_nm","");
 * @example 			     } else {
 * @example   
 * @example                  }
 * @example              }
 * @example );
 */
ngmf.promise.lov2 = function(callbackID, screenId, arrInputObjList, multiYn, dspList, lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle, isNothingMsg, isNotingPop)  {
	return new Promise(function(resolve, reject) {
		var callbackFunc = function(componentId, rtnObj) {
			resolve({"componentId" : componentId, "rtnObj" : rtnObj});
		};
		callbackFunc.isPromiseCallback = true;
		callbackFunc.isLov = true;
		ngmf.__lov(callbackID, screenId, arrInputObjList, multiYn, dspList, lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter, recDelimeter, "PRDLIKE", strPRDWinTitle, strPRDGridTitle, callbackFunc, isNothingMsg, isNotingPop);
	});
};

/**
 * 스마트폰전용 LoV(List of Value) 팝업화면을 오픈하는 API입니다.
 * @date 2016.09.29
 * @memberOf ngmf
 * @param {String} callbackID       :: I :: N ::   :: 콜백분기아이디
 * @param {String} screenId         :: I :: N ::   :: LOV 호출 Window ID
 * @param {String} arrInputObjList  :: I :: N ::   :: 검색 조건 Parameter List
 * @param {String} multiYn          :: I :: Y :: N :: Multi Selete Yes(Y)/No(N)
 * @param {String} dspList          :: I :: Y ::   :: Display Column Count(Max 5)
 * @param {String} lovWidthList     :: I :: Y ::600:: Display Column Width 설정
 * @param {String} lovAlignList     :: I :: Y ::437:: Display Column Align 설정
 * @param {String} lovWinTitle      :: I :: Y ::   :: Window Title 설정
 * @param {String} arrLovTitle      :: I :: Y ::   :: Gird Head Text 설정
 * @param {String} colDelimeter     :: I :: Y ::   :: return Column Delimeter설정
 * @param {String} recDelimeter     :: I :: Y ::   :: return Record Delimeter설정
 * @param {String} strPRDLike       :: I :: Y ::   :: 상품검색(유사어 검색) LoV 구분
 * @param {String} strPRDWinTitle   :: I :: Y ::   :: 상품검색(유사어 검색) 일 경우 TITLE
 * @param {String} strPRDGridTitle  :: I :: Y ::   :: 상품검색(유사어 검색) 일 경우 Gird Head Text 설정
 * @param {String} isNothingMsg     :: I :: Y ::   :: 데이터가 없는 경우 메시지 노출여부
 * @param {String} isNotingPop      :: I :: Y ::   :: 데이터가 없는 경우 팝업 OPEN여부
 * @return {Object} Promise 객체.
 * @author 조지용
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj lov 서비스 팝업화면 처리 전달 파라메터
 * @resolveParam {String} rtnObj.componentId : 콜백분기아이디. LoV함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.rtnObj      : LoV 팝업 선택 데이터
 * @example var promise = ngmf.promise.mobileLov(callbackID, screenId,arrInputObjList,multiYn,dspList, lovWidthList, lovAlignList, lovWinTitle,
 * @example			arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle, isNothingMsg, isNotingPop);
 * @example promise.then(function(pRtn) { 
 * @example                  scwin.callBackLov(pRtn);
 * @example              }
 * @example );
 */
ngmf.promise.mobileLov = function(callbackID, screenId, arrInputObjList, multiYn, dspList, lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle, isNothingMsg, isNotingPop)  {
	return new Promise(function(resolve, reject) {
		var callbackFunc = function(componentId, rtnObj) {
			resolve({"componentId" : componentId, "rtnObj" : rtnObj});
		};
		callbackFunc.isPromiseCallback = true;
		callbackFunc.isLov = true;
		ngmf.mobile.__lovW(callbackID, screenId, arrInputObjList, multiYn, dspList, lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter, recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle,callbackFunc, isNothingMsg, isNotingPop);		
	});
};

/**
 * AsyncAppend Service Call.
 * @date 2016.02.24
 * @memberOf ngmf
 * @param {String} TrxCode          :: I :: N ::    :: Transaction Code
 * @param {String} ScreenName       :: I :: N ::    :: Service 호출 Window ID
 * @param {String} arg              :: I :: Y ::    :: 처리 Argument
 * @param {String} InData           :: I :: Y ::    :: Input DataList
 * @param {String} OutData          :: I :: Y ::    :: Output DataList
 * @param {String} DataList         :: I :: Y ::    :: Append 대상 Dataset
 * @param {String} AddColumnNm      :: I :: Y ::    :: 추가 Column 정의
 * @param {String} ngmv_MsgFg       :: I :: Y ::NONE:: Message 처리(자동/설정)
 * @param {String} ngmv_AppGridId   :: I :: Y ::    :: Append 후 Grid Row Position 설정 Object(Grid ID)
 * @param {String} Encflag          :: I :: Y ::    :: NetWork 암복화 여부 - 미사용
 * @param {String} inputstr         :: I :: Y ::    :: NetWork 암복화시 input column
 * @param {String} outputstr        :: I :: Y ::    :: NetWork 암복화시 output column
 * @return {Object} Promise 객체.
 * @author 이동규
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj asyncAppend 서비스 처리시 결과 파라메터
 * @resolveParam {String} rtnObj.svcId     : Transaction Code. asyncAppend함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.errorCode : 서비스 통신 결과 코드
 * @resolveParam {Object} rtnObj.errorMsg  : 서비스 통신 결과 메시지  
 * @example var callBackPrimose = ngmf.promise.asyncAppend(TrxCode, ScreenName, arg, InData, OutData, DataList, AddColumnNm, ngmv_MsgFg, ngmv_AppGridId, Encflag, inputstr, outputstr);
 * @example callBackPrimose.then( function(rtnObj) {
 * @example     var SrvId = rtnObj.svcId;
 * @example     var ErrorCode = rtnObj.errorCode;
 * @example     var ErrorMsg = rtnObj.errorMsg;
 * @example	    
 * @example     if(ErrorCode == 1) {
 * @example		    var strSysMsg = ""
 * @example		    ngmf.promise.setErrorMsg(ErrorMsg,strSysMsg);
 * @example		    return false;  
 * @example	    }
 * @example });
 */
ngmf.promise.asyncAppend = function(TrxCode, ScreenName, arg, InData, OutData, DataList, AddColumnNm, ngmv_MsgFg, ngmv_AppGridId, Encflag, inputstr, outputstr) {
	return new Promise(function(resolve, reject) {
		ngmf.__asyncAppend(TrxCode, ScreenName, arg, InData, OutData, function(svcId, errorCode, errorMsg) {
			resolve({"svcId" : svcId, "errorCode" : errorCode , "errorMsg" : errorMsg});
		}, DataList, AddColumnNm, ngmv_MsgFg, ngmv_AppGridId, Encflag, inputstr, outputstr);
	});
};

/**
 * AsyncCall Service Call.
 * @date 2016.02.24
 * @memberOf ngmf
 * @param {String} trxCode       :: I :: N ::       :: Transaction Code
 * @param {String} screenName    :: I :: N ::       :: Service 호출 Window ID
 * @param {String} arg           :: I :: N ::       :: 처리 Argument
 * @param {String} inData        :: I :: N ::       :: Input DataList
 * @param {String} outData       :: I :: N ::       :: Output DataList
 * @param {String} ngmv_MsgFg    :: I :: Y :: NONE  :: Message 처리(자동/설정)
 * @param {String} ngmv_ErrProc  :: I :: Y ::       :: Error 발생 시 Dataset 설정 Check
 * @param {boolean} encflag      :: I :: Y :: false :: 암호호여부
 * @param {String} inPutStr      :: I :: Y ::       :: 입력문자열
 * @param {String} outPutStr     :: I :: Y ::       :: 출력문자열
 * @param {boolean} isProcessMsg :: I :: Y :: true  :: 프로그레스바 작동여부
 * @return {Object} Promise 객체.
 * @author 이동규
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj asyncAppend 서비스 처리시 결과 파라메터
 * @resolveParam {String} rtnObj.svcId     : Transaction Code. asyncCall함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.errorCode : 서비스 통신 결과 코드
 * @resolveParam {Object} rtnObj.errorMsg  : 서비스 통신 결과 메시지  
 * @example var promise = ngmf.promise.asyncCall(trxCode, screenName, arg, inData, outData, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr, outPutStr, isProcessMsg);
 * @example promise.then( function(rtnObj) {
 * @example     var SrvId = rtnObj.svcId;
 * @example     var ErrorCode = rtnObj.errorCode;
 * @example     var ErrorMsg = rtnObj.errorMsg;
 * @example	    
 * @example     if(ErrorCode == 1) {
 * @example		    var strSysMsg = ""
 * @example		    ngmf.promise.setErrorMsg(ErrorMsg,strSysMsg);
 * @example		    return false;  
 * @example	    }
 * @example });
 */
ngmf.promise.asyncCall = function(trxCode, screenName, arg, inData, outData, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr, outPutStr, isProcessMsg) {
	return new Promise(function(resolve, reject) {
		ngmf.__asyncCall(trxCode, screenName, arg, inData, outData, function(svcId, errorCode, errorMsg) {
			resolve({"svcId" : svcId, "errorCode" : errorCode , "errorMsg" : errorMsg});
		}, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr, outPutStr, isProcessMsg);
	});
};

/**
 * Transaction Service Call (내부함수: 개발자사용금지) 
 * @date 2016.02.24
 * @memberOf ngmf
 * @param {String} trxCode       :: I :: N ::     ::  Transaction Code
 * @param {String} screenName    :: I :: N ::     ::  Service 호출 Window ID
 * @param {String} arg           :: I :: Y ::     ::  처리 Argument
 * @param {String} inData        :: I :: N ::     ::  Input DataList
 * @param {String} outData       :: I :: N ::     ::  Output DataList
 * @param {String} ngmv_MsgFg    :: I :: Y ::     ::  Message 처리(자동/설정)
 * @param {String} ngmv_ErrProc  :: I :: Y ::     ::  Error 발생 시 Dataset 설정 Check
 * @param {boolean} encflag      :: I :: Y ::false:: 암호호여부
 * @param {String} inPutStr      :: I :: Y ::     :: 입력문자열
 * @param {String} outPutStr     :: I :: Y ::     :: 출력문자열
 * @param {boolean} isProcessMsg :: I :: Y ::true :: 프로그레스바 작동여부 
 * @return {Object} Promise 객체.
 * @author 이동규
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj transaction 서비스 처리시 결과 파라메터
 * @resolveParam {String} rtnObj.svcId     : Transaction Code. transaction함수의 첫번째 파라메타를 전달함
 * @resolveParam {Object} rtnObj.errorCode : 서비스 통신 결과 코드
 * @resolveParam {Object} rtnObj.errorMsg  : 서비스 통신 결과 메시지   
 * @example var promise = ngmf.promise.transaction(trxCode, screenName, arg, inData, outData,
 * @example 											ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr, outPutStr, isProcessMsg);
 * @example promise.then(function(rtnObj) {
 * @example     var SrvId = rtnObj.svcId;
 * @example     var ErrorCode = rtnObj.errorCode;
 * @example     var ErrorMsg = rtnObj.errorMsg;
 * @example	    
 * @example     if(ErrorCode == 1) {
 * @example		    var strSysMsg = ""
 * @example		    ngmf.promise.setErrorMsg(ErrorMsg,strSysMsg);
 * @example		    return false;  
 * @example	    }
 * @example });
 */
ngmf.promise.transaction = function(trxCode, screenName, arg, inData, outData, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr, outPutStr, isProcessMsg) {
	return new Promise(function(resolve, reject) {
		ngmf.transaction("asynchronous", trxCode, screenName, arg, inData,
		outData, function(svcId, errorCode, errorMsg) {
			resolve({"svcId" : svcId, "errorCode" : errorCode , "errorMsg" : errorMsg});
		}, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr,	
		outPutStr, isProcessMsg);
	});
};

/** 알림 Message 처리
 * @date 2016.02.24
 * @memberOf ngmf
 * @param arrCode   :: I :: N ::    :: Array 처리 Error Code
 * @param arrMsg    :: I :: N ::    :: Array 처리 Error Message
 * @param strTRX    :: I :: N ::    :: 거래코드 - 오류보고
 * @param strDSList :: I :: Y ::    :: input dataset list- 오류보고
 * @param dbioId    :: I :: Y :: "" :: dbIO ID
 * @return {Object} Promise 객체.
 * @author 이동규
 * @sync false
 * @useMobile use
 * @resolveParam {Object} rtnObj setErrorMsg 서비스 처리시 결과 파라메터
 * @resolveParam {String} rtnObj.svcId     : Transaction Code. 
 * @resolveParam {Object} rtnObj.errorCode : 서비스 통신 결과 코드
 * @resolveParam {Object} rtnObj.errorMsg  : 서비스 통신 결과 메시지    
 * @example var promise = ngmf.promise.setErrorMsg(arrCode, arrMsg, strTRX, strDSList, dbioId);
 * @example promise.then( function (rtnObj) {
 * @example     var SrvId = rtnObj.svcId;
 * @example     var ErrorCode = rtnObj.errorCode;
 * @example     var ErrorMsg = rtnObj.errorMsg;
 * @example });
 */
ngmf.promise.setErrorMsg = function(arrCode, arrMsg, strTRX, strDSList, dbioId) {
	return new Promise(function(resolve, reject) {
		ngmf.__setErrorMsg(arrCode, arrMsg, strTRX, strDSList, function(svcId, errorCode, errorMsg) {
			resolve({"svcId" : svcId, "errorCode" : errorCode , "errorMsg" : errorMsg});
		}, dbioId);
	});
};

/**
 * 엑셀 IMPORT promise용
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} inputGridName :: I :: N ::    :: 그리드명
 * @param {String} strHidden     :: I :: N ::    :: Hidden필드에 대한 스트링을 입력받음(text1|column1|width1,text2|column2|width2)
 * @param {String} wfmId  		 :: I :: Y ::    :: wframe ID
 * @param {boolean} isShowHidden :: I :: Y :: true :: 컬럼이 hidden = true인 속성 노출여부
 * @param {Object} _etcOption :: I :: Y :: false :: 업로드시 추가 옵션 / 임포트 할 csv 또는 엑셀 파일에 Header 가 없을 경우만 [ true ] 로 입력,다른 옵션과 같이 사용시 { "header":"0" } 로 사용
 * @return {Object} Promise 객체.
 * @example var promise = ngmf.promise.popupExcelImport("gridID", "");
 * @example promise.then(function(rtnObj) {
 * @example     alert(rtnObj);
 * @example	})
 * @resolveParam {String} rtnObj GridView ID
 * @sync false
 * @useMobile use
 * @author 이진수
 */
ngmf.promise.popupExcelImport = function(inputGridName,strHidden, wfmId, isShow, _etcOption) {
	return new Promise(function(resolve, reject) {
		ngmf.__popupExcelImport(inputGridName,strHidden, function(gridId) {
			resolve(gridId);
		}, wfmId, isShow, _etcOption);
	});
};

/**
 *  사용자로부터 확인/취소 선택을 입력받을수 있는 Dialog 를 실행하는 Form API 입니다.
 * @date 2016-03-24
 * @memberOf ngmf
 * @param {Object} msg     :: I :: N ::  :: Dialog Box에 메세지. 
 * @param {Object} options :: I :: Y ::  :: Dialog Box 설정 옵션.
 *				   options.title {Number} : Dialog Box의 title 값.
 *				   options.btnType {Number} : Dialog Box의 btnType [1 : 1개버튼[확인], 2 : 2개 버튼[확인, 취소], 3 : 3개버튼[예,아니오,취소]]
 * @sampleLink 
 * @author 이동규
 * @useMobile use
 * @example ngmf.promise.layerConfirm("테스트 메세지!", {title: "confirm샘플", btnType:2});
 *				  [버튼타입별 파라메터 val값]
 *				  btnType = 1 => [확인] : ["Y"],
 *				  btnType = 2 => [확인, 취소] : ["Y", "N"],
 *				  btnType = 3 => [예, 아니오, 취소] : ["Y", "N", "C"]
 * @exampleAsIs Confirm("Do you want to delete?");
 */	
ngmf.promise.layerConfirm = function(msg, options) {
	return new Promise(function(resolve, reject) {
		ngmf.layerConfirm(msg, function(ret) {
			resolve(ret);
		}, options);
	});
};

/**
 * Message를 표현하는 DialogBox를 실행하는 API 입니다.
 * @date 2016-03-24
 * @memberOf ngmf
 * @param {Object} msg     :: I :: N ::  :: Dialog Box에 메세지.
 * @param {Object} options :: I :: Y ::  :: Dialog Box 설정 옵션.
 *				   options.title {String} : Dialog Box의 title 값.
 * @sampleLink 
 * @author 이동규
 * @useMobile use
 * @example ngmf.promise.layerAlert("alert메세지 창", options);
 * @exampleAsIs Alert("Show Message");
 */
ngmf.promise.layerAlert = function(msg, options) {
	return new Promise(function(resolve, reject) {
		ngmf.layerAlert(msg, function(ret) {
			resolve(ret);
		}, options);
 	});
};

/**
 * extMessageBox confime 메세지 박스.
 * @date 2016-03-29
 * @memberOf ngmf
 * @param {Object} obj  :: I :: N ::  :: 객체 this(사용 미확인.)
 * @param {String} msg  :: I :: N ::  :: 메세지
 * @author 이동규
 * @example ngmf.promise.extMessageBox(this, "사용자 메세지"); 
 * @exampleAsIs ngmf_ExtMessageBox(this, "사용자 메세지"); 
 */
ngmf.promise.extMessageBox = function(obj, msg) {
	return new Promise(function(resolve, reject) {
		ngmf.layerConfirm(msg, function(ret) {
			if (ret == "Y") {
				ret = 0;
			} else if (ret == "N") {
				ret = 1;
			} else if (ret == "C") {
				ret = 2;
			}
			resolve(ret);
		}, {btnType:3})
	});
};

/**
 * ext_MsgBox 메세지 박스.
 * @date 2016-04-06
 * @memberOf ngmf
 * @param {Object} title    :: I :: N ::  :: 메세지박스 타이틀.
 * @param {String} msg      :: I :: N ::  :: 메세지
 * @param {String} strStyle :: I :: N ::  :: 메세지박스의 아이콘/버튼형태/버튼포커스 설정 스타일.
 * @author 이동규
 * @useMobile use
 * @example ngmf.promise.extMessageBox(title, msg, "MB_ICONINFORMATION|MB_YESNO|MB_DEFBUTTON1"); 
 * @example strStyle 설정 (아이콘형태|버튼형태|버튼포지션)
 * @example 1. 아이콘형태 (4가지 종류)
 * @example    (파란 느낌표) MB_ICONINFORMATION 또는 MB_ICONASTERIST
 * @example    (빨간 X)      MB_ICONSTOP 또는 MB_ICONHAND 
 * @example    (물음표) MB_ICONQUESTION
 * @example    (노란 삼각형 느낌표) MB_ICONEXCLAMATION 
 * @example 2. 버튼형태 (6가지 종류)
 * @example    (중단 / 다시시도 / 무시) MB_ABORTRETRYIGNORE
 * @example    (확인) MB_OK
 * @example    (확인 / 취소) MB_OKCANCEL
 * @example    (다시시도 / 취소) MB_RETRYCANCEL
 * @example    (예 / 아니오) MB_YESNO
 * @example    (예 / 아니오 / 취소) MB_YESNOCANCEL
 * @example 3. 버튼포지션 (3가지 종류.)
 * @example    (첫번째 버튼) MB_DEFBUTTON1
 * @example    (두번째 버튼) MB_DEFBUTTON2
 * @example	   (세번째 버튼) MB_DEFBUTTON3	
 * @example 4. 버튼선택에 따른 return Data
 * @example    확인 (1) , 취소 (2), 중단(3), 다시시도(4), 무시(5), 예(6), 아니오(7)
 * @exampleAsIs ngmf_ExtMessageBox(title, msg, "MB_ICONINFORMATION|MB_YESNO|MB_DEFBUTTON1"); 
 */
ngmf.promise.extMsgBox = function(title, msg, strStyle) {
	try{
		var strStyle = typeof strStyle == "undefined" ? "" : strStyle;
		if (strStyle !== "") {
			var styleArr = strStyle.split("|");
			if (styleArr.length > 0) {
				var iconType = ngmf.trim(styleArr[0]);
				var btnStyle = ngmf.trim(styleArr[1]);
				var btnPosition = ngmf.trim(styleArr[2]);
			}
		}
	} catch(e) {
		ngmf._error("[ngmf.promise.extMsgBox] Exception :: ", e);
	}
	return new Promise(function(resolve, reject) {
		ngmf.layerConfirm(msg, function(ret) {
			if(btnStyle == "MB_ABORTRETRYIGNORE") {
				if (ret == "Y") {
					return resolve(3); //중단
				} else if (ret == "N") {
					return resolve(4); // 다시시도
				} else if (ret == "C") {
					return resolve(5); // 무시
				}
			} else if (btnStyle == "MB_OK") {
				return resolve(1) //확인
			} else if (btnStyle == "MB_OKCANCEL") {
				if (ret == "Y") {
					return resolve(1) //확인
				} else if (ret == "N") {
					return resolve(2) //취소
				}
			} else if (btnStyle == "MB_RETRYCANCEL") {
				if (ret == "Y") {
					return resolve(4) //다시시도
				} else if (ret == "N") {
					return resolve(2) //취소
				}
			} else if (btnStyle == "MB_YESNO") {
				if (ret == "Y") {
					return resolve(6) //예
				} else if (ret == "N") {
					return resolve(7) //아니오
				}
			} else if (btnStyle == "MB_YESNOCANCEL") {
				if (ret == "Y") {
					return resolve(6) //예
				} else if (ret == "N") {
					return resolve(7) //아니오
				} else if (ret == "C") {
					return resolve(2) //취소
				}
			}
		}, {title : title, iconType : iconType, btnStyle : btnStyle, btnPosition :btnPosition});
	});
};


/**
 * 조회 서비스의 전체 데이터 수를 가져오는 서비스호출입니다.
 * @date 2016-09-01
 * @memberOf ngmf
 * @param {Object} mapId  :: I :: N ::  :: 조회 서비스 MapID
 * @param {Object} iParamArr  :: I :: N ::  :: 조회 서비스 iParma 정보
 * @param {String} dParamArr  :: I :: N ::  :: 조회 서비스 dParma 정보
 * @param {String} inputCompId  :: I :: Y ::  :: 전체건수 서비스 정상 호출시 전체건수의 수를 셋팅할 컴포넌트
 * @author 이동규
 * @example ngmf.promise.extMessageBox(this, "사용자 메세지"); 
 * @exampleAsIs ngmf_ExtMessageBox(this, "사용자 메세지"); 
 */
ngmf.promise.asyncTotalCnt = function(mapId, iParamArr, dParamArr, inputCompId) {
	return new Promise(function(resolve, reject) {
		ngmf.__asyncTotalCnt(mapId, iParamArr, dParamArr, inputCompId, function(totalCnt, isTimeout) {
			resolve({"totalCnt" : totalCnt, "isTimeout" : isTimeout});
		});
	});
};

ngmf.__asyncTotalCnt = function(mapId, iParamArr, dParamArr, inputCompId, callbackFunc) {
	var trxCode = "ZAATSTOT00010_TR01";
	var mapId = mapId || "";
	if (mapId == "") {
		return;
	}
	var screenId = ngmf.getFormID();
	var iParam = iParamArr || "";
	var dParam = dParamArr || "";
	var callbackFuncNm = ngmf._pushCallbackFunc(callbackFunc);

	if (ngmf.makeHeadSet(trxCode, screenId) != "OK") {
		return;
	}

	if (mapId !== "") {
		var strUrl = ngmf.SVC_PATH + "/SVC"; // ngmf.servicePort("LOV");
		strUrl += "?map_id=" + mapId;
		strUrl += "&Trx_code=" + trxCode;
		strUrl += "&ScreenName=" + screenId;
		strUrl += ngmv.fCloseAccount;
		var submissionObj = {
			"id" : trxCode+"_"+mapId,
			"ref" : "",
			"target" : "",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : "asynchronous",
			"processMsg" : false,
			"submitDoneHandler" : function(e) {
				var result = e.responseJSON;
				var params = result.params;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;
				var output1 = result.output1.length > 0 ? result.output1[0] : "";

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					errorCd.push(errorJSON.ErrorCode);
					errorMsg.push(errorJSON.ErrorMsg);
				}

				var outPutKey = Object.keys(output1);
				var totalCnt = 0;
				var isTimeout = false;
				if(outPutKey.length > 0) {
					totalCnt = output1[outPutKey[0]];
				}

				if(errorCd[0] == "0" && typeof this.inputId != "undefined" && output1 != "") {
					var inputComp = ngmf.object(this.inputId);
					if (!isNaN(Number(totalCnt)) && inputComp && typeof inputComp.setValue == "function") {
						inputComp.setValue(totalCnt);
					}
				} 

				var msg = errorMsg[0].split("^^rs^^")[2] || "";
				if (msg.indexOf("APTIMEOUT") > -1) {
					isTimeout = true;
					ngmf.setWindowStatusMsg("N", "전체건수 조회시 Timeout이 발생하였습니다.");
				} else if (msg != "") {
					ngmf.setWindowStatusMsg("N", msg);
				}

				if(typeof this.callbackFuncNm != "undefined") {
					var func = ngmf._removeCallbackFunc(this.callbackFuncNm);
					func(totalCnt, isTimeout);
				}
			}
		};
		$w.createSubmission(submissionObj); // 서브미션 생성.
		var sub = WebSquare.ModelUtil.getSubmission(trxCode+"_"+mapId);
		sub.callbackFuncNm = callbackFuncNm;
		var inputDataObj = {};
		inputDataObj.map_id = mapId;
		
		for(var i = 0; i < iParam.length; i++) {
			inputDataObj["iparam"+(i+1)] = iParam[i];
		}

		for(var i = 0; i < dParam.length; i++) {
			inputDataObj["dparam"+(i+1)] = dParam[i];
		}

		if (inputCompId && typeof ngmf.object(inputCompId) != "undefined") {
			sub.inputId = ngmf.object(inputCompId).getID();
		}

		sub.requestData = {input1 : inputDataObj};
		$w.executeSubmission(trxCode+"_"+mapId);
	}
};

/**
 *  AES 암호화 처리
 * @date 2016-10-06
 * @memberOf ngmf
 * @param {String} sEnc  :: I :: N ::  :: 암호화할 문자열(String)
 * @return 암호화된 String
 * @author 성일호
 * @example 
		var sEnc  = "TEST";
		ngmf.promise.aesEncrypt(sEnc)
		.then(function(retStr) {
		  if (retStr) ngmf.debug(sEnc + "==>" + retStr);
		}); 
		 
 * @exampleAsIs  ngmf_AESEncrypt("TEST");
 */
ngmf.promise.aesEncrypt = function(sEnc){ 
	if(ngmf.isMobile()) {
		ngmf._error("ngmf.promise.aesEncrypt : 모바일환경에서 지원불가 API 입니다.");
		return Promise.resolve("");
	} else { 
		return ngmf.ext.promise.exec("htiaes","encrypt",sEnc)
		.then(function(retStr) {
			return retStr;
		 }, function(e) {
			 ngmf._error(" ERROR :: ngmf.promise.aesEncrypt = ", e);
			 return sEnc; 
		 });
	}
}; 