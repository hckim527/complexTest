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
 * 엑셀 EXPORT
 * @date 2016-02-22
 * @memberOf ngmf
 * @param {String} gridID :: I :: N ::    :: 그리드아이디
 * @param {String} strHidden :: I :: Y ::    :: Hidden필드에 대한 스트링을 입력받음
 * @author 이진수
 * @example ngmf.popupTempletExport(grd_gridView1, "플래그,flag,50");
 * @useMobile useless
 */
ngmf.popupTempletExport = function(gridID, strHidden){
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.popupTempletExport : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	var inputGridName = "";
	
	if(typeof gridID === "undefined"){
		ngmf.alert("첫번째 인자 Grid ID는 필수항목입니다.");
		return;
	}else{
		inputGridName = gridID;
	}
	
	if(typeof strHidden === "undefined"){
		strHidden = "";
	}
	
	var gridObject = ngmf.object(inputGridName);
	
	var isBatchUse 		= false;
	var inBatchPrgId 	= "";
	var inParams 		= "";
	var isWait 			= false;
	var isBatchOnly 	= false;
	var isSkipEnc 		= false;

	scwin.initExcelDownload(
		inputGridName, 	gridObject.getDataList(), 	isBatchUse, 	inBatchPrgId, 	inParams, 
		isWait, 		strHidden, 					isBatchOnly, 	isSkipEnc, 		"0", 	
		false, 			true
	);
};

/**
 * 엑셀 EXPORT
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} inputGridName 	:: I :: N ::       	:: GRID의 스트링값(탭이름이란 DIV이름 포함)::다운로드타입(0,1)::체크값만(CHECK) ex) gridID::1::check
 * @param {String} inDataSet     	:: I :: N ::       	:: 그리드의 bindDataset
 * @param {boolean} isBatchUse   	:: I :: Y :: false 	:: BATCH를 사용하는지 여부(true, false)
 * @param {String} inBatchPrgId  	:: I :: N ::       	:: 입력할 BatchID
 * @param {String} inParams      	:: I :: Y ::       	:: BATCH에 사용할 여러가지 Parameters
 * @param {boolean} isWait       	:: I :: Y :: false 	:: BATCH함수중 WAIT을 쓰는지 안쓰는지에 대한 부분
 * @param {String} strHidden     	:: I :: Y ::       	:: Hidden필드에 대한 스트링을 입력받음
 * @param {boolean} isBatchOnly  	:: I :: Y :: false 	:: 배치만 사용할 수 있도록 만드는 컬럼 생성
 * @param {boolean} isSkipEnc    	:: I :: Y :: false 	:: 암호화 제외여부
 * @param {Array} removeColsArr    	:: I :: Y :: false 	:: 제거 할 컬럼 id
 * @param {String} wfmId    		:: I :: Y ::		:: wframe id
 * @param {Array} dispColsArr    	:: I :: Y ::		:: diplay 할 컬럼 id
 * @param {String} sheetTitle    	:: I :: Y ::		:: 시트명
 * @param {String} fileNm    	:: I :: Y ::		:: DownLoad 파일명			
 * @param {boolean} saveWordWrap    	:: I :: Y :: false:: 셀서식 줄바꿈 활성화여부
 * @author 이진수
 * @example ngmf.popupExcelExport("grd_gridView1", "dst_msg", true, "ZAPABCRT00156_001", "", true, "", false, true);	
 * @useMobile useless
 */
ngmf.popupExcelExport = function(
	inputGridName, 	inDataSet, 		isBatchUse, 	inBatchPrgId, 	inParams, 
	isWait, 		strHidden, 		isBatchOnly, 	isSkipEnc, 		removeColsArr,
	wfmId,			dispColsArr,	sheetTitle,		fileNm , saveWordWrap
){
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.popupExcelExport : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try{
		var wframeID = "";
		var isBatchUse  = (typeof isBatchUse !== "undefined")  ? WebSquare.util.getBoolean(isBatchUse)  : false;
		var isWait      = (typeof isWait !== "undefined")      ? WebSquare.util.getBoolean(isWait)      : false;
		var isBatchOnly = (typeof isBatchOnly !== "undefined") ? WebSquare.util.getBoolean(isBatchOnly) : false;
		var isSkipEnc   = (typeof isSkipEnc !== "undefined")   ? WebSquare.util.getBoolean(isSkipEnc)   : false;
		if(typeof inBatchPrgId 	=== "undefined") 	inBatchPrgId 	= "";
		if(typeof inParams 		=== "undefined")	inParams 		= "";
		if(typeof strHidden 	=== "undefined")	strHidden 		= "";
		if(typeof removeColsArr === "undefined")	removeColsArr 	= new Array();	
		if(typeof dispColsArr 	=== "undefined")	dispColsArr 	= new Array();	
		if(typeof sheetTitle 	=== "undefined")	sheetTitle		= "";
		if(typeof fileNm 	=== "undefined")	fileNm		= "";
		
		if(typeof wfmId !== "undefined" && wfmId != null && ngmf.trim(wfmId).length > 0){
			wframeID = wfmId + "_";
			
			if(inputGridName.indexOf(wfmId) < 0){
				inputGridName = wframeID + inputGridName;
			}
		}
		
		var downType = "0";
		var isCheck = false;
		
		if(inputGridName != null && inputGridName.indexOf("::") > -1){
			
			var splitArr = inputGridName.split("::");
			if(typeof splitArr[1] !== "undefined"){
				inputGridName 	= splitArr[0];
				
				if(ngmf.trim(splitArr[1]).length > 0){
					downType 	= splitArr[1];
				}
				
				if(splitArr.length > 2 && ngmf.trim(splitArr[2]).length > 0){

					if(ngmf.trim(splitArr[2]).toUpperCase() == "C"){
						isCheck = true;
					}
				}
				
			}else{
				downType = "0";
			}
			
		}
		
		if ( (ngmf.length(ngmf.trim(isBatchUse)) == 0) || (isBatchUse == false) ) {

			var grdObj 	= ngmf.object(inputGridName);
			var dsObj	= ngmf.object(inDataSet);

			if(inputGridName == "" || ngmf.isValidObject(grdObj) == false){
				ngmf.alert("GRID Argument가 입력되지 않았습니다.");
				return;
			}else if(inDataSet == "" || ngmf.isValidObject(dsObj) == false){
				ngmf.alert("inDataSet이 입력되지 않았습니다.");
				return;
			}
			
		}
	
		if (ngmf.length(ngmf.trim(strHidden)) > 2) {
			
			var rtn_val = ngmf.hiddenValCheck(strHidden);
			
			if (! rtn_val) {
				ngmf.alert("Hidden Column과 Text의 정보가 틀립니다.!");
				return;			
			}
			
		}else{
		
			strHidden = "";
			
		} 
		
		if(ngmf.length(ngmf.trim(String(isBatchUse))) == 0){
			isBatchUse = false;
		}
	
		
		if(ngmf.length(ngmf.trim(String(isWait))) == 0){
			isWait = false;
		}

		if(isBatchUse == true && ngmf.length(inBatchPrgId) == 0){
			ngmf.alert("배치 실행시 inBatchPrgId가 입력되지 않았습니다.");
			return;
		}

		var splitInParams = new Array();
		
		if(ngmf.trim(inParams).length > 0){
			splitInParams = inParams.split(",");
		}

		if(ngmf.length(splitInParams) != 0){
			if(splitInParams.length > 10){
				ngmf.alert('Batch Parameter는 10개 초과 입력하실 수 없습니다.');
				return;
			}
			
			for(var i=0; i<splitInParams.length; i++){
				if(ngmf.lengthb(splitInParams[i]) > 100){
					ngmf.alert('각각의 Batch Parameter는 100bytes를 넘을 수 없습니다.');
					return;
				}
			}
		}
		
		var defaultFormId = ngmf.getFormID();

		scwin.initExcelDownload(
			inputGridName, 	inDataSet, 	isBatchUse, 	inBatchPrgId, 	inParams, 
			isWait, 		strHidden, 	isBatchOnly, 	isSkipEnc, 		downType, 	
			isCheck,  		false,		removeColsArr,	wframeID,		defaultFormId,
			dispColsArr,	sheetTitle, fileNm, saveWordWrap
		);

	} catch (e) {
		ngmf._error("[ngmf.popupExcelExport] Exception :: " , e);
	}
};

/**
 * Hidden 정보 Matching 유효성체크
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} strH :: I :: N ::    :: 히든 컬럼정보
 * @return {boolean} 유효성 true/false
 * @author 이진수
 * @example ngmf.hiddenValCheck(str);
 * @useMobile useless
 */
ngmf.hiddenValCheck = function(strH){
	if(ngmf.isMobile()) {
		//ngmf.alert("ngmf.hiddenValCheck : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	var rVal = true;
	var arrVal = strH.split("|");
	var arrLen = ngmf.length(arrVal);
	
	for (var i=0; i<Number(arrLen); i++){
		if (ngmf.length(arrVal[i].split(",")) != 3){
			rVal = false;
			break;
		} 
	}
	
	return rVal;
};	

/**
 * 엑셀 IMPORT
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} inputGridName :: I :: N ::    :: 그리드명
 * @param {String} strHidden     :: I :: N ::    :: Hidden필드에 대한 스트링을 입력받음(text1|column1|width1,text2|column2|width2)
 * @param {String} strCallback   :: I :: Y ::    :: 업로드후 콜백함수
 * @param {String} wfmId  		 :: I :: Y ::    :: wframe ID
 * @param {boolean/Array} isShowHidden :: I :: Y :: true :: 컬럼이 hidden = true인 속성 노출여부 
 * @param {Object} _etcOption :: I :: Y :: false :: 업로드시 추가 옵션 / 임포트 할 csv 또는 엑셀 파일에 Header 가 없을 경우만 [ true ] 로 입력,다른 옵션과 같이 사용시 { "header":"0" } 로 사용  
 * @author 이진수
 * @example ngmf.promise.popupExcelImport("gridID", "", "strCallback");
 * @useMobile useless
 */
ngmf.__popupExcelImport = function(inputGridName,strHidden,strCallback, wfmId, isShowHidden, _etcOption) {
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf._popupExcelImport : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	var strPrefix = "lib/comm";
	var strFormID = "excel_upload";
	var upType = "0";
	var isAuto = false;
	var wframeID = "";
	var etcOption = {};
	if (typeof _etcOption != undefined) {
		if (typeof _etcOption === "boolean") {
			etcOption["noHeaderFlag"] = _etcOption;
		} else {
			etcOption = _etcOption;
		}
	}
	
	if(inputGridName.indexOf("::") > -1){
		var splitArr = inputGridName.split("::");
		inputGridName 	= splitArr[0];
		
		if(typeof splitArr[1] !== "undefined"){
			upType 		= splitArr[1];
		}else{
			upType 		= "0";
		}
		
		if(typeof splitArr[2] !== "undefined"){
			if(ngmf.toUpper(splitArr[2]) == "A"){
				isAuto 	= true;
			}
		}
	}
	
	if(typeof wfmId !== "undefined" && wfmId != null && ngmf.trim(wfmId).length > 0){
		wframeID = wfmId + "_";
		
		if(inputGridName.indexOf(wfmId) < 0){
			inputGridName = wframeID + inputGridName;
		}
	}
	
	var grdObj = ngmf.object(inputGridName);
	
	if(inputGridName == "" || ngmf.isValidObject(grdObj) == false){
		ngmf.alert("GRID Argument가 입력되지 않았습니다.");
		return;
	}
	
	if(typeof strHidden === "undefined"){
		strHidden = "";
	}
	
	if (ngmf.length(ngmf.trim(strHidden)) > 2) {
		var rtn_val = ngmf.hiddenValCheck(strHidden);
		if (! rtn_val) {
			ngmf.alert("Hidden Column과 Text의 정보가 틀립니다.!");
			return;			
		}
	}
	  
	if(typeof strCallback == "undefined"){
		strCallback = "";
	}
	
	if(typeof isShowHidden === "undefined"){
		isShowHidden = true;
	}
	
	scwin.initExcelUpoload(inputGridName, strHidden, strCallback, upType, isAuto, wframeID, isShowHidden, etcOption);
	
	/*
	var options = {
		title :	"엑셀업로드",
		id: "excel_upload",
		gridID : inputGridName,
		hiddenColStr : strHidden,
		type : upType,
		auto : isAuto
	};
	
	// Excel Import를 설정할 팝업창을 띄움	
	ngmf.__dialog(strPrefix, strFormID, options, 1000, 600,"", "", "", strCallback);
	*/
};

/**
 * previewImportExcelFile(타모듈)
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} inLayoutDataListId :: I :: N ::    :: 그리드 레이이웃용 데이터리스트
 * @author 이진수
 * @example ngmf.previewImportExcelFile(inLayoutDataListId);
 * @useMobile useless
 */
ngmf.previewImportExcelFile = function (inLayoutDataListId){
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.previewImportExcelFile : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	if(typeof inLayoutDataListId === "undefined" || inLayoutDataListId == null || ngmf.trim(inLayoutDataListId).length == 0){
		ngmf.alert("GridView를 생성하기 위한 Layout용 DataList가 입력되지 않았습니다.");
		return;
	}else{
		scwin.initExcelPreview("previewImportExcelFile", inLayoutDataListId);
	}
};

/**
 * batchImportExcel(타모듈)
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} inLayoutDataListId :: I :: N ::    :: 그리드 레이이웃용 데이터리스트
 * @param {String} inBatchPrgId  :: I :: N ::    :: 배치 id
 * @param {String} inParams      :: I :: Y :: ""  :: 파라메터
 * @param {String} inScreenName  :: I :: N ::    :: 화면명
 * @param {Boolen} isWait        :: I :: Y :: false  :: progress 표씨 여부
 * @param {Boolen} isExeValidFunc:: I :: Y ::  false  :: 엑셀파일업로드 버튼 클릭한 경우 검증 함수 사용여부, true ==> 개발자 정의 함수 scvar.preBatchImportExcel 호출
 * @param {String} wfmId  		 :: I :: Y ::  ""  :: wframe ID
 * @param {Objet} _options  		 :: I :: Y ::  {isHead : true} :: 엑셀업로드 옵션  true/false  OR  { isHead : true, "delim" : ",", "hidden" : "0", "fillHidden" : "0", "skipSpace" : "0" }
 * @author 이진수
 * @example 
 * 			ngmf.batchImportExcel(inLayoutDataListId, inBatchPrgId, inParams, inScreenName, isWait);
 * 			ngmf.batchImportExcel("DS_XLS_FORMAT", "ZSPMBAPP00030_001", str_InParm, "ZSPMSAPP00010", true, null, null,  false);
 * 			엑셀업로드 옵션  true/false  OR  { isHead : true, "delim" : ",", "hidden" : "0", "fillHidden" : "0", "skipSpace" : "0" }
 * @useMobile useless
 */
ngmf.batchImportExcel = function (inLayoutDataListId, inBatchPrgId, inParams, inScreenName, isWait, isExeValidFunc, wfmID, _options){
	var options = null;
	if (typeof _options == "undefined" || _options == null) options = { isHead : true };
	else if (typeof _options == "boolean") options = { isHead : _options };
	else if (typeof _options == "object") options = _options;
	
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.batchImportExcel : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	if(typeof inLayoutDataListId === "undefined" || inLayoutDataListId == null || ngmf.trim(inLayoutDataListId).length == 0){
		inLayoutDataListId = "";
	}else if(typeof inBatchPrgId === "undefined" || inBatchPrgId == null || ngmf.trim(inBatchPrgId).length == 0){
		ngmf.alert("배치프로그램ID를 입력해주십시오.");
		return;
	}else if(typeof inParams === "undefined" || inParams == null || ngmf.trim(inParams).length == 0){
		inParams = "";
	}else if(typeof inScreenName === "undefined" || inScreenName == null || ngmf.trim(inScreenName).length == 0){
		ngmf.alert("스크린이름을 입력해주십시오.");
		return;
	}else if(typeof isWait === "undefined" || isWait == null || ngmf.trim(isWait).length == 0){
		isWait = false;
	}else if(typeof isExeValidFunc === "undefined" || isExeValidFunc == null || ngmf.trim(isExeValidFunc).length == 0){
		isExeValidFunc = false;
	}else if(typeof wfmID === "undefined" || wfmID == null || ngmf.trim(wfmID).length == 0){
		wfmID = "";
	}
	
	scwin.initExcelPreview("batchImportExcel", inLayoutDataListId, inBatchPrgId, inParams, inScreenName, isWait, isExeValidFunc, wfmID, options);
};

/**
 * batchImportExcelDirect(타모듈)
 * @date 2016-06-09
 * @memberOf ngmf
 * @param {String} uploadCompId :: I :: N ::    :: Upload Component ID
 * @param {String} inBatchPrgId  :: I :: N ::    :: 배치 id
 * @param {String} inParams      :: I :: N ::    :: 파라메터
 * @param {String} inScreenName  :: I :: N ::    :: 화면명
 * @param {Boolen} isWait        :: I :: N ::    :: progress여부
 * @param {String} wfmId  		 :: I :: Y ::    :: wframe ID
 * @author 이진수
 * @example ngmf.batchImportExcelDirect(uploadCompId, inBatchPrgId, inParams, inScreenName, isWait);
 * @useMobile useless
 */
ngmf.batchImportExcelDirect = function(uploadCompId, inBatchPrgId, inParams, inScreenName, isWait, wfmID){
	
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.batchImportExcel : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	if(typeof uploadCompId === "undefined" || uploadCompId == null || ngmf.trim(uploadCompId).length == 0){
		ngmf.alert("파일객체아이디를 입력해주십시오.");
		return;
	}else if(typeof inBatchPrgId === "undefined" || inBatchPrgId == null || ngmf.trim(inBatchPrgId).length == 0){
		ngmf.alert("배치프로그램ID를 입력해주십시오.");
		return;
	}else if(typeof inParams === "undefined" || inParams == null || ngmf.trim(inParams).length == 0){
		inParams = "";
	}else if(typeof inScreenName === "undefined" || inScreenName == null || ngmf.trim(inScreenName).length == 0){
		ngmf.alert("스크린이름을 입력해주십시오.");
		return;
	}else if(typeof isWait === "undefined" || isWait == null || ngmf.trim(isWait).length == 0){
		isWait = false;
	}else if(typeof isExeValidFunc === "undefined" || isExeValidFunc == null || ngmf.trim(isExeValidFunc).length == 0){
		isExeValidFunc = false;
	}else if(typeof wfmID === "undefined" || wfmID == null || ngmf.trim(wfmID).length == 0){
		wfmID = "";
	}

	var csv_file_name	= uploadCompId;
	var shell_nm		= "";
	var atfil_id		= "";
	var save_path_nm	= "";
	
	// 파일권한체크
	var singleFileAclCheckPromise = ngmf.promise._singleFileAclCheck(csv_file_name, 1);
	singleFileAclCheckPromise.then(function(result){

		if(result != "Y"){
			return;
		}else{
			
			//쉘이름 세팅하는 부분
			shell_nm = inBatchPrgId + ".sh";
			ngmf._debug("==> shell_nm:" + shell_nm);
			ngmf._debug("==> csv_file_name:" + csv_file_name);
			
			//파일 업로드 하는 부분 
			var encUploadSingleFilePromise = ngmf.promise.encUploadSingleFile(2, csv_file_name, "1", true);
			encUploadSingleFilePromise.then( function (result) { 
				
				ngmf._debug(result);
				
				if (result[0] != "Y") {							
					ngmf.alert("파일 업로드가 정상적이지 않습니다.");
					return;
				} else {
					
					atfil_id 		= GLD.GDS_OUTDUMMY.getCellData(0, "atfil_id");
					save_path_nm 	= GLD.GDS_OUTDUMMY.getCellData(0, "save_path_nm");
					
					ngmf._debug("==> atfil_id:"+atfil_id);
					ngmf._debug("==> save_path_nm:"+save_path_nm);
					
					var TrxCode     	= "ZNGMSBAT00010_TR01";	//Transaction Code
					var ScreenName		= inScreenName;			//스크린 이름이 없으면 배치 프로그램이 실행안됨(주의)
					
					if(wfmID != ""){
						ScreenName = ScreenName+"::"+wfmID;
					}
					
					var InDataList  	= "ds_dummy";			//Input Datasets						
					var OutDataList 	= "";					//Output Datasets	
					var splitInParams 	= new Array();
	
					if(ngmf.trim(inParams).length > 0){
						splitInParams = inParams.split(",");
					}
	
					ngmf._debug("======splitInParams=======");
					ngmf._debug(splitInParams);
					ngmf._debug(splitInParams.length);
					ngmf._debug("==========================");
					
					if(ngmf.length(splitInParams) != 0){
						if(splitInParams.length > 9){
							ngmf.alert('Batch Parameter는 9개 이상 입력하실 수 없습니다.');
							return;
						}
						
						for(var i=0; i<splitInParams.length; i++){
							if(ngmf.lengthb(splitInParams[i]) > 100){
								ngmf.alert('각각의 Batch Parameter는 100bytes를 넘을 수 없습니다.');
								return;
							}
						}
					}
				
					var dsDummyRow = scwin.setDsDummy();
					ds_dummy.setCellData(dsDummyRow, "bat_name",	shell_nm);
					ds_dummy.setCellData(dsDummyRow, "parm0",		atfil_id);
					ds_dummy.setCellData(dsDummyRow, "file_type", 	"E");
					
					ngmf._debug("=======ds_dummy=======");
					ngmf._debug(ds_dummy.getAllJSON());
					ngmf._debug("=====================");
					
					var tmpParamCnt = "";
					
					// 20051125일 추가된 부분 
					// parm0는 atfil_id를 사용하기 때문에 parm1~parm9까지 사용가능 
					for(var i=1; i<10; i++){		  
						if(ngmf.length(splitInParams[i-1]) != 0){
						  	tmpParamCnt = "parm"+i;		  
							ds_dummy.setCellData(dsDummyRow, tmpParamCnt, splitInParams[i-1]);
						}
					}
	
					// ngmf_SyncCall과 동일한 형태이나 마지막 Argument에 따라 처리가 달라진다
					// "WAIT" : 화면대기 기타 : PopUp
					if(isWait){
						ngmf.batch(TrxCode, ScreenName, inParams, InDataList, OutDataList, "", "WAIT");			
					}
					else{
						ngmf.batch(TrxCode, ScreenName, inParams, InDataList, OutDataList, "", "");			
					}
					
				}
			});
			
		}

	});
}; 

/**
 *  엑셀 Non-Wait모드 완료시 다운로드 자동으로 해주는 함수
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} f_fileid       :: I :: N ::    :: 다운로드 받을 수 있는 파일ID
 * @param {String} full_file_path :: I :: N ::    :: 로컬에 저장할 파일이름
 * @author 이진수
 * @useMobile useless
 * @example ngmf.nonWaitDownloadFile(f_fileid, full_file_path);
 */
ngmf.nonWaitDownloadFile = function (f_fileid, full_file_path){
	try {
		if(ngmf.isMobile()) {
			//ngmf.alert("ngmf.nonWaitDownloadFile : 모바일환경에서 지원불가 API 입니다.");
			return;
		}
		
		ngmv.f_fileid = f_fileid;
		ngmv.full_file_path = full_file_path;
		//ngmf.excelSetTimer();
		ngmf.callBackNonWait(f_fileid, full_file_path);
	} catch(e) {
		ngmf._error("[ngmf.nonWaitDownloadFile] Exception :: ", e);
	}
};

/**
 *  엑셀 다운로드 함수
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} f_fileid       :: I :: N ::    :: 다운로드 받을 수 있는 파일ID
 * @param {String} full_file_path :: I :: N ::    :: 로컬에 저장할 파일이름
 * @author 이진수
 * @useMobile check
 * @example ngmf.CallBackNonWait(f_fileid, full_file_path);
 */
ngmf.callBackNonWait = function (f_fileid, full_file_path){
	try {
		var csvFilePath 	= full_file_path;
		if (full_file_path) {
			if (ngmf.chkMimeType(full_file_path) != "")
				csvFilePath 		= ngmf.subStr(csvFilePath, 0, ngmf.length(csvFilePath) - 3) + "csv";
			else csvFilePath = csvFilePath + ".csv";
		} else {
			ngmf.alert("저장할 파일이름이 없습니다.");
			return;
		}

		if (typeof Ds_File == "undefined") ngmf.createDataList("Ds_File", ["chk", "file", "size", "del", "progress", "atfilId", "atfilSerNum", "savePathNm", "trxCode"],  ["nunmber", "text", "nunmber", "nunmber", "text", "text", "text", "text", "text"] );		
		else Ds_File.removeAll();
		
		ngmf.getFileList(f_fileid, "Ds_File");
		for (var  ix = 0; ix < Ds_File.getRowCount(); ix++ ) {
			Ds_File.setCellData( ix, "chk", 1 );
			Ds_File.setCellData( ix, "del", 0 );
		}
		if(Ds_File.getRowCount() == 0){
			ngmf.alert("다운로드 받을 파일이 없습니다.");
			return;
		}else{
			ngmf.promise.batDownloadMultiFile(Ds_File, null, csvFilePath).then(function(rtnVal){
				if ( rtnVal[0] == "Y"){
					ngmf.alert(ngmf.getMessage("ZNGMC1062", "&OBJECT", "File 저장 성공"));
					//ExecShell(execFirstFileNm);
					//var file_url = rtnVal[1];
					//if ( file_url.length() > 0 ) ExecShell(file_url);
				}else{
					ngmf.alert(ngmf.getMessage("ZNGMC1062", "&OBJECT", "File 저장 실패"));
				}
			});
		}
	} catch(e) {
		ngmf._error("[ngmf.callBackNonWait] Exception :: ", e);
	}
};

/**
 * excelSetTimer(미사용)
 * @date 2016-02-16
 * @memberOf ngmf
 * @author 이진수
 * @useMobile check
 * @example ngmf.excelSetTimer();
 */
ngmf.excelSetTimer = function (){
	try {
		var options = {
	    		key : 88,
	    		delay : 100,
	    		args :  [88]
	    };
		WebSquare.util.setInterval(ngmf.excelOnTimer , options );	 
	} catch(e) {
		ngmf._error("[ngmf.excelSetTimer] Exception :: ", e);
	}
};

/**
 * excelOnTimer(미사용)
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {Object} nEventID :: I :: N ::    :: 이벤트ID
 * @author 이진수
 * @useMobile check
 * @example ngmf.excelOnTimer(nEventID);
 */
ngmf.excelOnTimer = function (nEventID){
	try {
		WebSquare.util.clearInterval(88); 
		ngmf.callBackNonWait(ngmv.f_fileid, ngmv.full_file_path); 
	} catch(e) {
		ngmf._error("[ngmf.excelOnTimer] Exception :: ", e);
	}
};

/**
 * ondemandExcelExport(타모듈)
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} inputGridName   :: I :: N ::    :: inputGridName
 * @param {String} inDataSet       :: I :: N ::    :: inDataSet
 * @param {Boolean} isBatchUse     :: I :: Y ::    :: isBatchUse
 * @param {String} inScrnId        :: I :: Y ::    :: inScrnId
 * @param {String} inOndmndSeq     :: I :: Y ::    :: inOndmndSeq
 * @param {String} inParamDataset  :: I :: Y ::    :: inParamDataset
 * @param {Boolean} isWait         :: I :: Y ::    :: isWait
 * @param {String} strHidden       :: I :: Y ::    :: strHidden
 * @param {Boolean} isBatchOnly    :: I :: Y ::    :: isBatchOnly
 * @param {Boolean} isSkipEnc      :: I :: Y ::    :: isSkipEnc
 * @param {String} wfmID      	   :: I :: Y ::    :: wfmID
 * @author 이진수
 * @useMobile check
 * @example ngmf.ondemandExcelExport(inputGridName, inDataSet, isBatchUse, inScrnId, inOndmndSeq, inParamDataset, isWait, strHidden, isBatchOnly, isSkipEnc);
 */
ngmf.ondemandExcelExport = function (
		inputGridName, 		inDataSet, 	isBatchUse, 	inScrnId, 		inOndmndSeq, 
		inParamDataset, 	isWait, 	strHidden, 		isBatchOnly, 	isSkipEnc,
		wfmID
){
	var wframeID 		= "";
	var active_Formid 	= GLV.G_ACTIVE_FORMID;
	var isBatchUse  = (typeof isBatchUse !== "undefined")  ? WebSquare.util.getBoolean(isBatchUse)  : false;
	var isBatchOnly = (typeof isBatchOnly !== "undefined") ? WebSquare.util.getBoolean(isBatchOnly) : false;
	var isSkipEnc   = (typeof isSkipEnc !== "undefined")   ? WebSquare.util.getBoolean(isSkipEnc)   : false;
	
	if(typeof inputGridName 	=== "undefined") 	inputGridName 	= "";
	if(typeof inDataSet 		=== "undefined") 	inDataSet 		= "";
	if(typeof inScrnId 			=== "undefined") 	inScrnId 		= "";
	if(typeof inOndmndSeq 		=== "undefined") 	inOndmndSeq 	= -1;
	if(typeof inParamDataset 	=== "undefined") 	inParamDataset 	= "";
	if(typeof isWait 			=== "undefined") 	isWait 			= null;
	if(typeof strHidden 		=== "undefined") 	strHidden 		= "";
	
	if(typeof wfmId !== "undefined" && wfmId != null && ngmf.trim(wfmId).length > 0){
		wframeID = wfmId + "_";
		
		if(inputGridName.indexOf(wfmId) < 0){
			inputGridName = wframeID + inputGridName;
		}
	}

	if ( (ngmf.length(ngmf.trim(isBatchUse)) == 0) || (isBatchUse == false) ){

		if(ngmf.isValidObject(inputGridName) == false){	// [U.Key2.0] 2011-06-24, MiPlatform Upgrade
			ngmf.alert("GRID Argument가 입력되지 않았습니다.");
			return;
		}else if(ngmf.isValidObject(inDataSet) == false){ // [U.Key2.0] 2011-06-24, MiPlatform Upgrade
			ngmf.alert("inDataSet이 입력되지 않았습니다.");
			return;
		}
	}
	
	if(ngmf.length(ngmf.trim(strHidden)) > 2){
		var rtn_val = ngmf.hiddenValCheck(strHidden);
		
		if(!rtn_val){
			ngmf.alert("Hidden Column과 Text의 정보가 틀립니다.!");
			return;			
		}
	} 
	
	if(isBatchUse == 0){
		isBatchUse = false;
	}
	
	if(isWait == 0){
		isWait = false;
	}
		
	if(isBatchUse){
		if (ngmf.length(ngmf.trim(inScrnId)) == 0){
			ngmf.alert("배치 실행시 inScrnId가 입력되지 않았습니다.");
			return;
		}else if (inOndmndSeq < 0){
			ngmf.alert("배치 실행시 inOndmndSeq가 입력되지 않았습니다.");
			return;
		}else if(!ngmf.isValidObject(inParamDataset)){
			ngmf.alert("배치 실행시 inParamDataset이 입력되지 않았습니다.");
			return;
		}
	}

	var paramDs = ngmf.object(inParamDataset);

	if(paramDs.getRowCount() > 0){
		if(paramDs.cellIdList.length > 200){
			ngmf.alert('Batch Parameter는 200개 초과 입력하실 수 없습니다.');
			return;
		}
		
		for(var i=0; i<paramDs.cellIdList.length; i++){
			if(ngmf.lengthb(paramDs.getCellData(0, paramDs.getColumnID(i))) > 100){
				ngmf.alert('각각의 Batch Parameter는 100bytes를 넘을 수 없습니다.');
				return;
			}
		}
	}
	
	/*****************************************************
	  PI요청으로 2005년 12월 10일 추가한 부분 
	  파일이름을 가져오는 부분 - 시작 
	 *****************************************************/		
	var svFormId = ngmf.getFormID();
	/*****************************************************
	  파일이름을 가져오는 부분 - 종료 
	 *****************************************************/

	// Excel Export를 설정할 팝업창을 띄움 
	scwin.initOndemandBatch(
		inputGridName, 	inDataSet, 		isBatchUse, strHidden, 	inScrnId, 
		inOndmndSeq, 	inParamDataset,	isWait, 	isBatchOnly, "", 
		svFormId, 		active_Formid, 	isSkipEnc,	wframeID
	);

};

/**
 * batch_2(타모듈)
 * @date 2016-02-16
 * @memberOf ngmf
 * @param {String} TrxCode            :: I :: N ::    :: TrxCode
 * @param {String} ScreenName         :: I :: N ::    :: ScreenName
 * @param {String} arg                :: I :: Y ::    :: arg
 * @param {String} InData             :: I :: Y ::    :: InData
 * @param {String} OutData            :: I :: Y ::    :: OutData
 * @param {String} Result             :: I :: Y ::    :: Result
 * @param {String} BatchFg            :: I :: Y ::    :: BatchFg
 * @param {String} ngmv_MsgFg         :: I :: Y ::    :: ngmv_MsgFg
 * @param {String} ngmv_UserData      :: I :: Y ::    :: ngmv_UserData
 * @param {String} rpt_file_nm        :: I :: Y ::    :: rpt_file_nm
 * @param {String} trans_nm           :: I :: Y ::    :: trans_nm
 * @param {String} rpt_brws_cond_info :: I :: Y ::    :: rpt_brws_cond_info
 * @param {String} auto_rt_aply_yn    :: I :: Y ::    :: auto_rt_aply_yn
 * @param {String} scrn_rt            :: I :: Y ::    :: scrn_rt
 * @author 이진수
 * @useMobile check
 * @example ngmf.batch_2(TrxCode,ScreenName,arg,InData,OutData,Result,BatchFg,ngmv_MsgFg,ngmv_UserData,rpt_file_nm,trans_nm,rpt_brws_cond_info,auto_rt_aply_yn,scrn_rt);
 */
ngmf.batch_2 = function (TrxCode,ScreenName,arg,InData,OutData,Result,BatchFg,ngmv_MsgFg,ngmv_UserData,rpt_file_nm,trans_nm,rpt_brws_cond_info,auto_rt_aply_yn,scrn_rt){
	//ngmf.batch 완 기능 일치 함,
	return ngmf.batch (TrxCode, ScreenName, arg, InData, OutData, Result,BatchFg,ngmv_MsgFg,ngmv_UserData,rpt_file_nm,trans_nm,rpt_brws_cond_info,auto_rt_aply_yn,scrn_rt);
};


ngmf._saveCSV = function(pGridNm, pFileNm, pType){
	if(ngmf.isMobile()) {
		//ngmf.alert("ngmf._saveCSV : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	//삭제컬럼 설정
	var removeColumns = "";
	var grdObj 			= ngmf.object(pGridNm);
	var firstColID 		= grdObj.getColumnID( 0 );
	var firstColType 	= grdObj.getColumnType( 0 );
	
	if(firstColType == "checkbox"){
		removeColumns = "" + grdObj.getColumnIndex( firstColID );
	}

	/*===================================================================================================================
		saveCSV
	=====================================================================================================================
	options.fileName 		<String:N> 	[default: csvfile.csv] 	엑셀파일 선택 대화상자가 나타날 때 기본으로 지정 될 파일 이름 
	options.type 			<String:N> 	[default: 1, 0] 		Grid 저장 형태 (0이면 데이터 형태,1이면 표시 방식) 
	options.delim 			<String:N> 	[default: ';'] 			CSV 파일에서 데이터를 구분할 구분자 
	options.removeColumns 	<String:N> 	[default: 없음] 			저장 하지 않을 columns index, 여러컬럼인 경우 콤마(,)로 구분해서 정의 한다. 
	options.header 			<String:N> 	[default: 1, 0] 		Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장) 
	options.hidden 			<Number:N> 	[defalut: 0, 1] 		Grid의 숨겨진 Column에 대한 저장 여부(0이면 저장 하지 않음,1이면 저장) 
	options.checkButton 	<String:N> 	[default: 1, 0] 		Grid의 Control(Check, Radio, Button) Column에 대해 히든 여부
																(0이면 control Coliumn히든,1이면 보여줌) 
	options.saveList 		<Array:N> 	[default: 없음] 			hidden에 관계없이 최우선순위로 저장할 column id들의 array 
	options.spanAll			<String> 	"true/false";
	*/

	var options = {};
	options.fileName 		= 	pFileNm;
	options.type 			= 	pType;
	options.delim 			= 	",";
	options.removeColumns 	= 	removeColumns;
	options.header 			= 	"1";
	options.hidden 			= 	"0";	
	options.checkButton		= 	"1";
	options.spanAll			=   "true";

	// '붙지 않음
	options.aposPrefixOnNum =   "0";
	//options.aposPrefixOnNum =   "1";
	options.removeQuotation =   "0";
	options.ignoreSpan 		=   "1";
	grdObj.saveCSV( options );
};

ngmf._saveExcel = function(pGridNm, pFileNm, pType, pSheetTitle, footerValue, saveWordWrap){
	if(ngmf.isMobile()) {
		//ngmf.alert("ngmf._saveExcel : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	//삭제컬럼 설정
	var removeColumns 	= "";
	var grdObj 			= ngmf.object(pGridNm);
	var firstColType 	= grdObj.getColumnType( 0 );
	var defaultColCnt		= grdObj.defaultColCnt;
	var hiddenArray		= grdObj.hiddenList;
	var hiddenResult	= new Array();
	var isIncludeFooter = false;
	
	if(typeof footerValue === "undefined"){
		isIncludeFooter = false;
	}else{
		if(footerValue == "1"){
			isIncludeFooter = true;
		}else{
			isIncludeFooter = false;
		}
	}
	
	for(var i=defaultColCnt; i<hiddenArray.length; i++){
		
		if(i == defaultColCnt){
			if(firstColType == "checkbox"){
				hiddenResult.push(0); 
			} else if(hiddenArray[i]){
				hiddenResult.push(0);
			}
		}else{
			if(hiddenArray[i]){
				hiddenResult.push(i-defaultColCnt);
			}
		}
	}
	
	if(hiddenArray.length > 0){
		removeColumns = hiddenResult.join(",");
	}else{
		removeColumns = "";
	}

	/*===================================================================================================================
		advancedExcelDownload
	=====================================================================================================================
	options Object Y JSON형태로 저장된 그리드의 엑셀 다운로드 옵션

	property type description 
	
	options.fileName <String:Y> [defalut: excel.xls] 다운로드하려는 파일의 이름으로 필수 입력 값이다. 
	options.sheetName <String:N> [defalut: sheet] excel의 sheet의 이름 
	options.type <String:N> [defalut: 0] type이 0인 경우 실제 데이터 1인 경우 눈에 보이는 데이터를  2이면 들어가 있는 data 그대로(filter무시 expression 타입의 셀은 나오지 않음) 
	options.removeColumns <String:N> [defalut: 없음]	다운로드시 excel에서 삭제하려는 열의 번호(여러 개일 경우 ,로 구분) 
	options.removeHeaderRows <String:N> [defalut: 없음]	다운로드시 excel에서 삭제하려는 Header의 row index(여러 개일 경우 ,로 구분) 
	options.foldColumns <String:N> [defalut: 없음] 다운로드시 excel에서 fold하려는 열의 번호(여러 개일 경우 ,로 구분) 
	options.startRowIndex <Number:N> [defalut: 0] excel파일에서 그리드의 데이터가 시작되는 행의 번호(헤더 포함) 
	options.startColumnIndex <Number:N> [defalut: 0] excel파일에서 그리드의 데이터가 시작되는 열의 번호(헤더 포함) 
	options.headerColor <String:N> [defalut: #33CCCC] excel파일에서 그리드의 header부분의 색 
	options.headerFontName <String:N> [defalut: 없음] excel파일에서 그리드의 header부분의 font name 
	options.headerFontSize <String:N> [defalut: 10] excel파일에서 그리드의 header부분의 font size 
	options.headerFontColor <String:N> [defalut: 없음] excel파일에서 그리드의 header부분의 font색 
	options.bodyColor <String:N> [defalut: #FFFFFF] excel파일에서 그리드의 body부분의 색 
	options.bodyFontName <String:N> [defalut: 없음] excel파일에서 그리드의 body부분의 font name 
	options.bodyFontSize <String:N> [defalut: 10] excel파일에서 그리드의 body부분의 font size 
	options.bodyFontColor <String:N> [defalut: 없음] excel파일에서 그리드의 body부분의 font색 
	options.subTotalColor <String:N> [defalut: #CCFFCC] excel파일에서 그리드의 subtotal부분의 색 
	options.subTotalFontName <String:N> [defalut: 없음] excel파일에서 그리드의 subtotal부분의 font name 
	options.subTotalFontSize <String:N> [defalut: 10] excel파일에서 그리드의 subtotal부분의 font size 
	options.subTotalFontColor <String:N> [defalut: 없음] excel파일에서 그리드의 subtotal부분의 font색 
	options.footerColor <String:N> [defalut: #008000] excel파일에서 그리드의 footer부분의 색 
	options.footerFontName <String:N> [defalut: 없음] excel파일에서 그리드의 footer부분의 font name 
	options.footerFontSize <String:N> [defalut: 10] excel파일에서 그리드의 footer부분의 font size 
	options.footerFontColor <String:N> [defalut: 없음] excel파일에서 그리드의 footer부분의 font색 
	options.showProcess <Boolean:N> [defalut: true] 다운로드 시 프로세스 창을 보여줄지 여부 
	options.massStorage <Boolean:N> [defalut: true] 대용량 다운로드 여부 (default는 true 이 옵션을 true로 하고 showConfirm을 false로 한 경우에 IE에서 신뢰할만한 사이트를 체크하는 옵션이 뜬다.) 
	options.showConfirm <Boolean:N> [defalut: false] 다운로드 확인창을 띄울지 여부(옵션을 킨 경우 advancedExcelDownload를 호출후 사용자가 window의 버튼을 한번더 클릭해야 한다. massStorage는 자동으로 true가 된다) 
	options.dataProvider <String:N> [defalut: 없음] 대량데이터 처리 및 사용자 데이터를 가공할 수 있는 Provider Package 
	options.providerRequestXml <String:N> [defalut: 없음] Provider 내부에서 사용할 XML 문자열 
	options.userDataXml <String:N> [defalut: 없음] 사용자가 서버모듈 개발 시 필요한 데이터를 전송 할 수 있는 변수 
	options.bodyWordwrap <Boolean:N> [defalut: false] 다운로드시 바디의 줄 바꿈 기능 
	options.useEuroLocale <String:N> [defalut: false] 다운로드시 유로화 처리 기능(,와 .이 반대인 경우처리) 
	options.useHeader <String:N> [defalut: true] 다운로드시 Header를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력) 
	options.useSubTotal <String:N> [defalut: false] 다운로드시 SubTotal을 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력), expression을 지정한 경우 avg,sum,min,max,targetColValue,숫자를 지원 함. 
	options.useFooter <String:N> [defalut: true] 다운로드시 Footer를 출력 할지 여부( "true"인경우 출력, "false"인경우 미출력) 
	options.separator <String:N> [defalut: ,] 다운로드시 서버로 데이터 전송할때, 데이터를 구분짓는 구분자, default는 comma(,) 
	options.subTotalScale <Number:N> [defalut: -1] 다운로드시 subTotal 평균계산시 소수점 자리수를 지정 
	options.subTotalRoundingMode <String:N> [defalut: 없음] 다운로드시 subTotal 평균계산시 Round를 지정 한다. ("CEILING","FLOOR","HALF_UP") 
	options.useStyle <String:N> [defalut: false] 다운로드시 css를 제외한, style을 excel에도 적용할 지 여부 (배경색,폰트) 
	options.freezePane <String:N> [defalut: ""] 틀고정을 위한 좌표값 및 좌표값의 오픈셋 ( ex) freezePane="3,4" X축 3, Y축 4에서 틀고정, freezePane="0,1,0,5" X축 0, Y축 1에서 X축으로 0, Y축으로 5로 틀공정  ) 
	options.autoSizeColumn <String:N> [defalut: false] 너비자동맞춤 설정 유무 
	options.displayGridlines <String:N> [defalut: false] 엑셀 전체 셀의 눈금선 제거 유무 
	options.colMerge <String:N> [defalut: false] colMerge된 컬럼을 Merge해서 출력 할 지 여부 
	options.useDataFormat <String:N> [defalut: 없음] 그리드 dataType이 text인 경우, 엑셀의 표시형식 '텍스트' 출력 유무( "true"인 경우 표시형식 텍스트, "false"인 경우 표시형식 일반 출력) 
	options.printSet <Object:N> JSON형태로 저장된 Excel Print관련 설정 
	options.printSet.fitToPage <String:N> [defalut: false] 엑셀 프린터 출력시 쪽맞춤 사용 유무 
	options.printSet.landScape <String:N> [defalut: false] 엑셀 프린터 출력시 가로 방향 출력 유무 
	options.printSet.fitWidth <String:N> [defalut: 1] 엑셀 프린터 출력시 용지너비 
	options.printSet.fitHeight <String:N> [defalut: 1] 엑셀 프린터 출력시 용지높이 
	options.printSet.scale <String:N> [defalut: 100] 엑셀 프린터 출력시 확대/축소 배율, scale을 사용할 경우 fitToPage는 false로 설정 해야 한다. 
	options.printSet.pageSize <String:N> [defalut: A4] 엑셀 프린터 출력시 인쇄용지 설정 ( ex) "A3", "A4", "A5", "B4" ) 
	 
	infoArr Object N 그리드에 대한 내용을 추가로 다른 셀에 표현하는 경우 사용하는 배열
	
	property type description 
	infoArr.rowIndex <Number:N> 내용을 표시할 행번호 
	infoArr.colIndex <Number:N> 내용을 표시할 열번호 
	infoArr.rowSpan <Number:N> 병합할 행의 수 
	infoArr.colSpan <Number:N> 병합할 열의 수 
	infoArr.text <String:N> 표시할 내용 
	infoArr.textAlign <String:N> 표시할 내용의 정렬 방법 (left, center, right) 
	infoArr.fontSize <String:N> font size 설정 ( ex) "20px" ) 
	infoArr.fontName <String:N> font name 설정 
	infoArr.color <String:N> font color 설정 ( ex) "red" ) 
	infoArr.fontWeight <String:N> font weight 설정 ( ex) "bold" ) 
	infoArr.drawBorder <String:N> cell의 border 지정 ( ex) true ) 
	infoArr.wordWrap <String:N> cell의 줄 바꿈 기능 ( ex) "true" ) 
	infoArr.bgColor <String:N> cell의 배경 color 설정 ( ex) "red" ) 
	 

	*/
	
	
	var sheetName = "";
	
	if(pSheetTitle == ""){
		if(pFileNm.indexOf(".") > -1){
			var splitTmpArr = pFileNm.split(".");
			sheetName = splitTmpArr[0];
		}
	}else{
		sheetName = pSheetTitle;
	}
	
	
	var options = {};
	options.fileName 		= pFileNm;
	if(sheetName.length > 0) options.sheetName = sheetName;	
	options.type 			= pType;
	options.removeColumns 	= removeColumns;

	if(isIncludeFooter){
		options.useFooter = "true";
	}else{
		options.useFooter = "false";
	}
	
	if (typeof saveWordWrap != "undefined" && saveWordWrap)
		options.bodyWordwrap = "true";
	
	// useSubTotal 보이도록 2016.08.04 추가
	options.useSubTotal = "true";
	
	//2016.09.12 추가
	options.useDataFormat = "true";
	
	grdObj.advancedExcelDownload( options , [] );

};
