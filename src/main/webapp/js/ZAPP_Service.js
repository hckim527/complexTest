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
 * @target Dataset을 갱신하기 위한 Service 호출과 관련된 공통함수를 관리하는 js File 입니다. 통신방법으로는 크게
 *         Async(비동기), Sync(동기)로 구분하며 Sync 방식은 Service를 요청하는 경우 통신이 완료 전까지 통신을
 *         수행하는 함수가 종료되지 않으며, Async 방식은 통신 함수가 통신 완료와 관계없이 바로 종료되어 CallBack 함수에서
 *         통신의 완료를 알 수 있는 수단이 됩니다. Async 방식을 사용하면 동시에 여러개의 통신을 사용할 수 있기 때문에 권장되는
 *         방식입니다.
 */ 
/**
 * Transaction 결과 처리
 * 
 * @date 2015.10.01
 * @memberOf ngmf
 * @param {String} trID :: I :: N :: :: Transaction Result 정보 <br/> index[0] TRX
 *            <br/> index[1] CallBack Function <br/> index[2] Message UI 처리여부
 *            "SELF" - UI처리 <br/> index[3] Error인 경우에도 Data받을 경우 Create된 Datset
 *            List <br/> index[4] 로긴 및 로칼 에러 메시지 구성을 위해 Seq 구분 <br/> index[5] 로긴
 *            데이타 <br/> index[6] indataset
 * @param {Array} nErrorCode :: I :: N :: :: 에러코드
 * @param {Array} nErrorMsg :: I :: N :: :: 에러메시지
 * @param {String} dbioId :: I :: Y :: :: callback 함수의 구분자 파라미터
 * @return 
 * @author js.Lee
 * @example ngmf.result(TrxCode, ngmv.errorCode, ngmv.errorMsg);
 * @exampleAsIs Transaction(TrxCode,strUrl,InDataList, OutDataList, arg, "ngmf_Result");
 */
ngmf.result = function(trID, nErrorCode, nErrorMsg, dbioId) {
	try {
		var svcTime = null;
		var logstr;

		var smReqSeq = new Array();
		if (GLV["G_bProcessLogJob"]) {
			smReqSeq = trID.split("|");
			svcTime = GLV["__smElapsedTime" + smReqSeq[4]];
		}

		var arrTrId = trID.split("|");

		// arrTrId[0] : TRX
		// arrTrId[1] : CallBack Function
		// arrTrId[2] : Message UI 처리여부 "SELF" - UI처리
		// arrTrId[3] : Error인 경우에도 Data받을 경우 Create된 Datset List
		// arrTrId[4] : 로긴 및 로칼 에러 메시지 구성을 위해 Seq 구분
		// arrTrId[5] : 로긴 데이타
		// arrTrId[6] : indataset

		// svc combo인 경우 정상 메세지 안보여줌출
		if ((arrTrId[0] == "ZNGMSCOD00010_TR02")
				|| (arrTrId[0] == "ZNGMSCOD00010_TR04")
				|| (arrTrId[0] == "ZNGMSCOD00010_TR12")
				|| (arrTrId[0] == "ZNGMSCOD00010_TR22")) {
			if (Number(nErrorCode[0]) == 0) {
				arrTrId[2] = "SELF";
			}
		}

		/*
		 * MSK 평문전송 제거 PJT - Start
		 * if(ZORDSS0100036.IsExistFunc("ordf_SetTxValue_Async") == true) {
		 * ZORDSS0100036.ordf_SetTxValue_Async(TrID); } SK 평문전송 제거 PJT - End
		 */

		logstr = arrTrId[5].split("&");

		if (ngmf.length(arrTrId[1]) == 0) {
			return;
		} else {

			trID = arrTrId[0];
			var callBackFunction = arrTrId[1];

			ngmf.getArrayTranErrorMsg(nErrorCode, nErrorMsg, arrTrId[2], ngmf.trim(arrTrId[3]), parseInt(arrTrId[4]), arrTrId[0], logstr[0],
					logstr[1], logstr[2], 0, svcTime, GLV["__smGlobalId" + smReqSeq[4]], arrTrId[6], "ASYNC", callBackFunction, dbioId);

		}	
	} catch(e) {
		ngmf._error("[ngmf.result] Exception :: ", e);
	}
};

/**
 * Biz-Tr Setting Stop <br/><참고: APM?> <br/>Proframe과 APM모듈이 연동하여 자동으로 NGM 주
 * 시스템 내의 구간(서시스 수행, 모듈 호출, DBIO 호출 구간)별 timestamp를 관리하여 Application의 성능을 모니터링 한
 * 구간 정보를 수집한다.
 * 
 * @date 2015.10.02
 * @memberOf ngmf
 * @param {String} trxCode :: I :: N :: :: 거래코드
 * @return 없음
 * @author js.Lee
 * @example ngmf.bizTrSettingStop(trxCode);
 * @exampleAsIs ngmf_BizTrSettingStop(TrxCode);
 */
ngmf.bizTrSettingStop = function(trxCode) {
	try {
		/*
		 * 2009.06.05 Biz-Tr Stop trxCode 로직 추가 trxCode : APM 적용대상, 로그인중, GLV.G_Biz_Start_Time is not null
		 */
		// APM적용안하면
		if (GLV.G_bProcessLogJob == false) {
			return;
		}
		// 로그인하지 않았다면
		if (GLV.G_DEVFG != "L") {
			return;
		}

		// GLV.G_Biz_Start_Time 값이 없으면
		if (!GLV["G_Biz_Start_Time"] || GLV.G_Biz_Start_Time.length == 0) {
			return;
		}

		var tmp_row = GLD.GDS_ZSYS_VR_TRANS.getMatchedIndex("vr_trans_id", GLV.G_BizCd, true);

		if (tmp_row.length > 0) {
			var bizTrStopTrNm = GLD.GDS_ZSYS_VR_TRANS.getCellData(tmp_row, "biz_tr_stop_tr_nm");
			var bizTrStopTrNmLen = ngmf.length(bizTrStopTrNm);

			if (bizTrStopTrNmLen == null || bizTrStopTrNmLen == 0) {
				return;
			}

			var tmp_arr = bizTrStopTrNm.split(",");

			for ( var i = 0; i < tmp_arr.length; i++) {
				if (tmp_arr[i] == trxCode) {
					GLV.G_BizCd = "";
					GLV.G_Biz_Start_Time = "";
					return;
				}
			}
		}		
	} catch (e) {
		ngmf._error("[ngmf.bizTrSettingStop] Exception :: ", e);
	} 
};

/**
 * Uscan N개의 image download APM Write
 * @date 2015.10.02
 * @memberOf ngmf
 * @param {String} biz_start_time :: I :: N :: :: image 수신시작시간
 * @param {String} rspn_log_time :: I :: N :: :: image uscan ocx 응답시간
 * @return 없음
 * @author js.Lee
 * @example ngmf.apmUscanLogWrite(20151002160424550, 20151002180424550);
 * @exampleAsIs ngmf_APMUscanLogWrite(biz_start_time,rspn_log_time);
 */
ngmf.apmUscanLogWrite = function(biz_start_time, rspn_log_time) {
	try {
		biz_start_time =  biz_start_time + "";
		rspn_log_time = rspn_log_time + "";

		if (GLV["G_bProcessLogJob"] == false) {
			return;
		}

		if (GLV["G_DEVFG"] != "L") {
			return;
		}

		var bizStartTimeLen = ngmf.length(biz_start_time);
		var rspnLogTimeLen = ngmf.length(rspn_log_time);

		// image수신 수신시작시간
		if (bizStartTimeLen == null || bizStartTimeLen == 0) {
			return;
		}

		// image uscan ocx 응답시간
		if (rspnLogTimeLen == null || rspnLogTimeLen == 0) {
			return;
		}

		var nbizTime;
		var vntrTime1;
		var gapTime = null;
		var tmpRspnLogTime = rspn_log_time.split("|");

		for ( var i = 0; i < tmpRspnLogTime.length; i++) {

			var tmp_ary = tmpRspnLogTime[i].split(",");
			var nLogRow = GLD.GDS_Logging.insertRow();
			var rpadBizStartTime = ngmf.rpad(biz_start_time, " ", 17);

			if (i == 0) {
				GLD.GDS_Logging.setCellData(nLogRow, "trx_time", rpadBizStartTime.substring(0, 17));

				nbizTime = ngmf.convertToSec(biz_start_time);
				vntrTime1 = ngmf.convertToSec(ngmf.rpad(tmp_ary[0], "0", "0"));
				gapTime = (nbizTime - vntrTime1);

			} else {

				var rpadTime = ngmf.rpad(tmp_ary[0], "0", 17);
				var ntime = (ngmf.convertToSec(rpadTime) + gapTime) * 86400.;
				var floorNtime = Math.floor(ntime);
				var sumVarA = ngmf.dateTime(floorNtime / 86400.);
				var subTime = (ntime - floorNtime).toFixed(3);
				var sumVarB = String(subTime * 1000);

				tmp_ary[0] = sumVarA + sumVarB;
				var rPadTmpAry0 = ngmf.rpad(tmp_ary[0], " ", 17);
				GLD.GDS_Logging.setCellData(nLogRow, "trx_time", rPadTmpAry0.substring(0, 17));
			}

			GLD.GDS_Logging.setCellData(nLogRow, "trx_code", "ZNGMPUTM00010_TR09");
			GLD.GDS_Logging.setCellData(nLogRow, "Client_rspn_time", 0);
			GLD.GDS_Logging.setCellData(nLogRow, "ScreenName", "ZAFXSLST70010");
			GLD.GDS_Logging.setCellData(nLogRow, "network_rspn_time", tmp_ary[1]);
			GLD.GDS_Logging.setCellData(nLogRow, "server_rspn_time", 0);
			GLD.GDS_Logging.setCellData(nLogRow, "biz_code", "ZAFXSLST70010_EV02");
			GLD.GDS_Logging.setCellData(nLogRow, "biz_start_time", rpadBizStartTime.substring(0, 17));
			GLD.GDS_Logging.setCellData(nLogRow, "global_id", ngmf.rpad("", " ", 32));
		}
	} catch (e) {
		ngmf._error("[ngmf.apmUscanLogWrite] Exception :: ", e);
	} 
};

/**
 * convertToSec 처리 함수
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String}pushcall strTime :: I :: N :: :: 시간
 * @return 없음
 * @author js.Lee
 * @example ngmf.convertToSec('20151002160424550');
 * @exampleAsIs ngmf_convertToSec(strTime);
 */
ngmf.convertToSec = function(strTime) {
	try { 
		var nYear = Number(ngmf.mid(strTime, 0, 4));
		var nMonth = Number(ngmf.mid(strTime, 4, 2));
		var nDay = Number(ngmf.mid(strTime, 6, 2));
		var nHour = Number(ngmf.mid(strTime, 8, 2));
		var nMinute = Number(ngmf.mid(strTime, 10, 2));
		var nSecond = Number(ngmf.mid(strTime, 12, 2));
		var nMilSec = Number("0." + ngmf.mid(strTime, 14));

		var nDaysOfMonth = new Array();
		nDaysOfMonth.push(31);
		nDaysOfMonth.push(28);
		nDaysOfMonth.push(31);
		nDaysOfMonth.push(30);
		nDaysOfMonth.push(31);
		nDaysOfMonth.push(30);
		nDaysOfMonth.push(31);
		nDaysOfMonth.push(31);
		nDaysOfMonth.push(30);
		nDaysOfMonth.push(31);
		nDaysOfMonth.push(30);
		nDaysOfMonth.push(31);

		var dDate = (nYear * 365) + Math.floor(nYear / 4) - Math.floor(nYear / 100) + Math.floor(nYear / 400);

		if (nYear % 4 == 0 && (nYear % 100 != 0 || nYear % 400 == 0)) {
			nDaysOfMonth[1] = 29;
		}

		for ( var n = 0; n < nMonth - 1; n++) {
			dDate += nDaysOfMonth[n];
		}

		dDate += nDay;

		dDate += (nHour * 3600.0 + nMinute * 60.0 + nSecond + nMilSec) / (86400.);
		return dDate;
	} catch (e) {
		ngmf._error("[ngmf.convertToSec] Exception :: ", e);
	}
	return strTime;
};

/**
 * APM Write
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} trxCode :: I :: N :: :: 거래코드
 * @param {Number} nIdx :: I :: N :: :: Service Index(다중서비스인 경우)
 * @param {String} apmDate :: I :: N :: :: date - 미사용
 * @param {String} screenName :: I :: N :: :: APM처리 - Screen명
 * @param {String} startTime :: I :: N :: :: APM처리 - 서비스 시작시간
 * @param {String} svcTime :: I :: N :: :: APM처리 - 서비스 수행시간
 * @param {String} svcGlobalId :: I :: N :: :: APM처리 - 서비스 GlobalId
 * @return 없음
 * @author js.Lee
 * @example ngmf.apmWrite(TrxCode,nIdx,apmDate,ScreenName,StartTime,SvcTime,SvcGlobalId);
 * @exampleAsIs ngmf_APMWrite(TrxCode,nIdx,apmDate,ScreenName,StartTime,SvcTime,SvcGlobalId);
 */
ngmf.apmWrite = function(trxCode, nIdx, apmDate, screenName, startTime, svcTime, svcGlobalId) {
	try {

		svcTime = ngmf.trim(svcTime);

		if (ngmf.length(svcTime) == 0) {
			return;
		}

		if (Number(nIdx) < 0) {
			return;
		}

		var stxDt = GLD.GDS_OUTHEAD.getCellData(0, "Stx_Dt");
		var stxTm = GLD.GDS_OUTHEAD.getCellData(0, "Stx_Tm");

		var serverTime = stxDt.replaceAll("-", "");
		serverTime += ngmf.left(stxTm.replaceAll(".", ""), 9);

		var nEndTime = ngmf.timeM();
		nEndTime = ngmf.trim(nEndTime);

		if (ngmf.length(trxCode) > 0) {
			var svTrxCode = null;
			var subStrTrxCode = trxCode.substr(1, 17);
			if (ngmf.length(trxCode) > 18) {
				svTrxCode = "?" + subStrTrxCode;
			} else {
				svTrxCode = ngmf.rpad(trxCode, " ", 18);
			}

			var totTime = Number(nEndTime) - Number(startTime);
			var client_rspn_time = 0;

			if (Number(totTime) < Number(svcTime)) {
				svcTime = totTime;
			}

			var network_rspn_time = Number(totTime) - Number(svcTime);

			if (Number(svcTime) < 0) {
				network_rspn_time = 0;
				svcTime = 0;
			}

			GLD.GDS_Logging.setEventPause(null , true);
			var nLogRow = GLD.GDS_Logging.insertRow();
			var rpadApmDate = ngmf.rpad(apmDate, " ", 17);
			var rpadScreenName = ngmf.rpad(screenName, " ", 13);
			var rpadSvcGlobalId = ngmf.rpad(svcGlobalId, " ", 32);

			GLD.GDS_Logging.setCellData(nLogRow, "trx_time", rpadApmDate.substr(0, 17));
			GLD.GDS_Logging.setCellData(nLogRow, "trx_code", svTrxCode);
			GLD.GDS_Logging.setCellData(nLogRow, "screenName", rpadScreenName.substr(0, 13));
			GLD.GDS_Logging.setCellData(nLogRow, "client_rspn_time", client_rspn_time);
			GLD.GDS_Logging.setCellData(nLogRow, "network_rspn_time", Number(network_rspn_time));
			GLD.GDS_Logging.setCellData(nLogRow, "server_rspn_time", Number(svcTime));

			if (ngmf.length(GLV.G_Biz_Start_Time) > 0) {
				var rpadApmDateSubStr = rpadApmDate.substr(0, 17);
				var rpadSvcGlobalIdSubStr = rpadSvcGlobalId.substr(0, 32);

				if (Number(GLV.G_Biz_Start_Time) > Number(rpadApmDateSubStr)) {
					GLD.GDS_Logging.setCellData(nLogRow, "biz_code", ngmf.rpad("", " ", 18));
					GLD.GDS_Logging.setCellData(nLogRow, "biz_start_time", ngmf.rpad("", " ", 17));
					GLD.GDS_Logging.setCellData(nLogRow, "global_id", rpadSvcGlobalIdSubStr);
					return;
				}
			}

			var rpadGBizCd = ngmf.rpad(GLV.G_BizCd, " ", 18);
			var rpadGBizStartTime = String(ngmf.rpad(GLV.G_Biz_Start_Time, " ", 17));
			var rpadGBizCdSubStr = rpadGBizCd.substr(0, 18);
			var rpadGBizStartTimeSubStr = rpadGBizStartTime.substr(0, 17);
			var rpadSvcGlobalIdSubStr = rpadSvcGlobalId.substr(0, 32);

			GLD.GDS_Logging.setCellData(nLogRow, "biz_code", rpadGBizCdSubStr);
			GLD.GDS_Logging.setCellData(nLogRow, "biz_start_time", rpadGBizStartTimeSubStr);
			GLD.GDS_Logging.setCellData(nLogRow, "global_id", rpadSvcGlobalIdSubStr);
			
			GLD.GDS_Logging.setEventPause(null , false);
		}	
	} catch (e) {
		ngmf._error("[ngmf.convertToSec] Exception :: ", e);
	}
};

/**
 * APM Dummy Write
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} dumCode :: I :: N :: :: Dummy Code(화면명_Ev01)
 * @param {String} screenName :: I :: N :: :: 호출 FORM ID
 * @param {String} sTime :: I :: N :: :: date Event 시작 시간(ngmf_GetDateTime(2))
 * @param {String} sTimeM :: I :: N :: :: Event 시작 Timem
 * @return 없음
 * @author js.Lee
 * @example ngmf.apmDummy(dumCode, screenName, sTime, sTimeM);
 * @exampleAsIs ngmf_APMDummy(DumCode,ScreenName,STime,STimeM);
 */
ngmf.apmDummy = function(dumCode, screenName, sTime, sTimeM) {
	try {
		// 2008-11-06 현재 Biz-Tr 구현 방식에 있어서 엔진 수정 및 공통 테이블 관리로 인한 처리 안함 변경
		// 추후에 예외 처리 사용시 사용 가능성이 있어서 일단 함수 수정 후 사용안하게 바로 return

		return;

		// APM Logging
		if (GLV.G_bProcessLogJob == false) {
			return;
		}
		if (ngmf.length(String(sTime)) == 0) {
			return;
		}
		if (ngmf.length(String(sTimeM)) == 0) {
			return;
		}

		screenName = ngmf.apmScreenName(screenName);
		var date = new Date();
		var nETime = ngmf.trim(date.getMilliseconds());
		var client_rspn_time = Number(nETime) - Number(sTimeM);
		var nLogRow = GLD.GDS_Logging.insertRow();

		var rpadSTime = ngmf.rpad(sTime, " ", 17);
		var rpadDumCode = ngmf.rpad(dumCode, " ", 18);
		var rpadScreenName = ngmf.rpad(screenName, " ", 13);
		var rpadGBizCd = ngmf.rpad(GLV.G_BizCd, " ", 18);
		var rpadGBizStartTime = ngmf.rpad(GLV.G_Biz_Start_Time, " ", 17);
		var rpadSvcGlobalId = ngmf.rpad(SvcGlobalId, " ", 32);

		GLD.GDS_Logging.setCellData(nLogRow, "trx_time", rpadSTime.substr(0, 17));
		GLD.GDS_Logging.setCellData(nLogRow, "trx_code", rpadDumCode.substr(0, 18));
		GLD.GDS_Logging.setCellData(nLogRow, "screenName", rpadScreenName.substr(0, 13));
		GLD.GDS_Logging.setCellData(nLogRow, "client_rspn_time", client_rspn_time);
		GLD.GDS_Logging.setCellData(nLogRow, "network_rspn_time", 0);
		GLD.GDS_Logging.setCellData(nLogRow, "server_rspn_time", 0);
		GLD.GDS_Logging.setCellData(nLogRow, "biz_code", rpadGBizCd.substr(0, 18));
		GLD.GDS_Logging.setCellData(nLogRow, "biz_start_time", rpadGBizStartTime.substr(0, 17));
		GLD.GDS_Logging.setCellData(nLogRow, "global_id", rpadSvcGlobalId.substr(0, 32));
	} catch (e) {
		ngmf._error("[ngmf.apmDummy] Exception :: ", e);
	}
};

/**
 * Error Message를 Split 하여 처리
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} argErrCd :: I :: N :: :: Error Code
 * @param {String} argErrMsg :: I :: N :: :: Error Message
 * @param {String} argErrFg :: I :: Y :: :: Message Display 설정(자동/수동-SELF)
 * @param {String} arrErrDs :: I :: Y :: :: TP Error가 발생하더라도 Dataset을 받을 경우
 * @param {Number} nIdx :: I :: Y :: :: APM처리 - Service Index(다중서비스인 경우)
 * @param {String} trxCode :: I :: Y :: :: APM처리 - 거래코드
 * @param {String} sDate :: I :: Y :: :: APM처리 - 일자
 * @param {String} screenName :: I :: Y :: :: APM처리 - Screen명
 * @param {String} startTime :: I :: Y :: :: APM처리 - 서비스 시작시간
 * @param {String} commTime :: I :: Y :: :: APM처리 - 서비스 종료시간
 * @param {String} svcTime :: I :: Y :: :: APM처리 - 서비스 수행시간
 * @param {String} svcGlobalId :: I :: Y :: :: APM처리 - 서비스 GlobalId
 * @param {Object} inData :: I :: Y :: :: 오류보고용 input dataset list
 * @param {String} syncFg :: I :: Y :: :: 동기화플래그
 * @param {String} callbackFuncNm :: I :: Y :: :: 콜백함수명
 * @param {String} dbioId :: I :: Y :: :: DBIO 아이디
 * @return 없음
 * @author js.Lee
 * @example 
 * 		ngmf.getArrayTranErrorMsg(nErrorCode,nErrorMsg,arrTrId[2],trim(arrTrId[3]),parseInt(arrTrId[4]),arrTrId[0],logStr[0],logStr[1],logStr[2],0,svcTime,eval("GLV.__smGlobalId" + smReqSeq[4]),arrTrId[6]);
 * @exampleAsIs GetArrayTranErrorMsg(ErrorCode,ErrorMsg,"SELF");
 * 
 */
ngmf.getArrayTranErrorMsg = function(argErrCd, argErrMsg, argErrFg, arrErrDs,
		nIdx, trxCode, sDate, screenName, startTime, commTime, svcTime,
		svcGlobalId, inData, syncFg, callbackFuncNm, dbioId) {
	try {
		// 2008.06.30 추가 - CCD 업무 종료 프로세스 중 ZNGMSMAN00060 뜨기 전에 공통 서비스 올경우
		var rtCd = GLD.GDS_OUTHEAD.getCellData(0, "Rt_Cd");
		if (rtCd == "9" && GLV.G_Rt_Cd == "0") {
			GLV.G_Rt_Cd = "9";
		}

		// ngmf_SetLockWindow 함수호출하여 image생성시
		// WebSquare.layer.hideModal();

		// **********************************************************
		// ErrorCode[0] :
		// 0 : 정상
		// -1 : TP에서 보내는 Error
		// -2 : WAS에서 보내는 Error
		// -3 : Error이나 split 처리불가 Error 또는 UI Setting Error (-10000이하)
		//
		// ErrorMsg[0] : 팝업으로 처리하는지 StatusBar로 처리한느지 여부 (Multi인 경우 Comma로 구분)
		// 0 : PopUp
		// 1 : StatusBar
		//
		// ErrorCode[1]~[4] : TP 또는 WAS에서 넘어오는 실제 Code (가변적이나 일반적으로1개)
		// ErrorMsg [1]~[4] : TP 또는 WAS에서 넘어오는 실제 Message (가변적이나 일반적으로1개)
		// **********************************************************

		// APM Logging
		if (GLV.G_bProcessLogJob) {
			// Sync인 경우 별도 처리 - ngmf_SyncAPMCallBack
			if (syncFg != "SYNC") {
				ngmf.apmWrite(trxCode, nIdx, sDate, screenName, startTime, svcTime, svcGlobalId);
			}
		}

		if (typeof argErrFg == "undefined" || !argErrFg ) {
			argErrFg = "NONE";
		}

		if(!ngmf.isArray(argErrCd)) {
			var value = argErrCd;
			argErrCd = new Array();
			argErrCd.push(value);
		}

		if(!ngmf.isArray(argErrMsg)) {
			var value = argErrMsg;
			argErrMsg = new Array();
			argErrMsg.push(value);
		}

		ngmv.errorCode = argErrCd;
		ngmv.errorMsg = argErrMsg;

		if (Number(argErrCd[0]) != 0) {

			// ----- TP Error
			if (Number(argErrCd[0]) == -700) {
				ngmv.errorCode[0] = -1;
				// ----- TP Error가 발생하였으나 dataset을 받아야 하는 경우
			} 
			
			if (Number(argErrCd[0]) == 100) {
				if (ngmf.length(ngmf.trim(arrErrDs)) > 0) {

					var arrErrDsList = arrErrDs.split(",");
					var strOriginDs;
					var objOriginDs;

					for ( var i = 0; i < arrErrDsList.length; i++) {
						var tempDs = arrErrDsList[i];
						strOriginDs = tempDs.replace("NGMMIPLAT_", "");

						if (strOriginDs.length > 0) {
							objOriginDs = ngmf.object(strOriginDs);
							ngmf.assign(objOriginDs, tempDs);
						}
					}
				}

				ngmv.errorCode[0] = -1;

				// ----- Network Error (http message or miplatform message
			} else if (Number(argErrCd[0]) < -10000) {
				ngmv.errorCode[0] = -3;
				ngmv.errorCode[1] = -3;
				ngmv.errorMsg[0] = 1;

				if (nIdx == -1) {
					ngmv.errorMsg[1] = argErrMsg[0];
				} else {
					ngmv.errorMsg[1] = GLV.G_arrTrxErrMsg[nIdx];
				}

				var nPos = ngmf.pos(ngmv.errorMsg[1], ":") + 1;
				ngmv.errorMsg[1] = ngmf.mid(ngmv.errorMsg[1], nPos, ngmf.length(ngmv.errorMsg[1]));

				if (argErrFg.toLocaleUpperCase() != "SELF") {
					ngmf.__setErrorMsg(ngmv.errorCode, ngmv.errorMsg, trxCode, inData);
				}

				//  MDI일때 폼상태바에 메세지 보여주기
				if (GLV.G_FORMUSEFG == "M") {
					ngmf.setWindowStatusMsg("E", "[" + trxCode + "]" + ngmv.errorMsg[1]);
				}
				// TODO. SDI 모바일 경우 고려 할 것

				// G_iTrxCurIdx--;
				GLV.G_arrTrxErrMsg[nIdx] = "";
				return;

				// ----- WAS Error
			} else {
				if (GLV.G_FORMUSEFG == "M") {
					var eMsg = "";
					if (ngmv.errorMsg.length > 1)
						eMsg = ngmv.errorMsg[ngmv.errorMsg.length -1].replaceAll("^^rs^^", " ");
					else
						eMsg = ngmv.errorMsg[0].replaceAll("^^rs^^", " ");
					
					ngmf.setWindowStatusMsg("E", "[" + trxCode + "]" + eMsg);
				}
				// TODO. SDI 모바일 경우 고려 할 것

				if (argErrFg.toLocaleUpperCase() == "SYS_SELF") {
					ngmv.errorCode[0] = -500;
					return;
				} else {
					ngmv.errorCode[0] = -2;
				}
			}

		} else {
			ngmv.errorCode[0] = 0;
		}

		// TP Error가 발생하였으나 dataset을 받아야 하는 경우
		if (ngmf.length(ngmf.trim(arrErrDs)) > 0) {
			var arrErrDsList = arrErrDs.split(",");
			for ( var i = 0; i < arrErrDsList.length; i++) {
				ngmf.destroyDataList(arrErrDsList[i]);
			}
		}

		if (nIdx > -1) {
			GLV.G_arrTrxErrMsg[nIdx] = "";
		}

		var callbackFunctionNm = "";
		if (typeof callbackFuncNm !== "undefined" && callbackFuncNm) {
			callbackFunctionNm = callbackFuncNm;
			if (callbackFunctionNm.startsWith("__ngmf_callback__")) {
				callbackFunctionNm = ngmf._removeCallbackFunc(callbackFunctionNm);
			}
		}

		if (ngmf.isFunction(callbackFunctionNm) || ngmf.trim(callbackFunctionNm).length > 0) {
			// 자동메세지 처리
			if (argErrFg != null && argErrFg != "" && argErrFg.toUpperCase() != "SELF") {
				ngmf.__setErrorMsg(ngmv.errorCode, ngmv.errorMsg, trxCode, inData, callbackFunctionNm, dbioId);
			} else {
				ngmf.exeCallBack(callbackFunctionNm, trxCode, ngmv.errorCode, ngmv.errorMsg, dbioId);
			}
		} else { 
			// 자동메세지 처리
			if (argErrFg.toUpperCase() != "SELF") {
				ngmf.__setErrorMsg(ngmv.errorCode, ngmv.errorMsg, trxCode, inData);
			}
		}	
	} catch (e) {
		ngmf._error("[ngmf.getArrayTranErrorMsg] Exception :: ", e);
	}
};

/**
 * 콜백함수를 실행한다.
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} callbackFuncNm :: I :: N :: :: 콜백함수명
 * @param {String} trxCode :: I :: N :: :: tr코드
 * @param {Array} errorCode :: I :: N :: :: 에러코드
 * @param {Array} errorMsg :: I :: N :: :: 에러메시지
 * @param {Array} dbioId :: I :: Y :: :: DBIO ID
 * @return 없음
 * @author js.Lee
 * @example ngmf.exeCallBack(callbackFuncNm, trxCode, ngmv.errorCode, ngmv.errorMsg, dbioId);
 * @exampleAsIs 없음
 */
ngmf.exeCallBack = function(callbackFuncNm, trxCode, errorCode, errorMsg, dbioId) {
	try {
		if (typeof dbioId !== "undefined") {
			if (ngmf.isFunction(callbackFuncNm)) {
				callbackFuncNm(dbioId, errorCode, errorMsg);
			} else {
				eval(callbackFuncNm + "(dbioId, errorCode, errorMsg)");
			}
		} else {
			if (ngmf.isFunction(callbackFuncNm)) {
				callbackFuncNm(trxCode, errorCode, errorMsg);
			} else {
				eval(callbackFuncNm + "(trxCode, errorCode, errorMsg)");
			}
		} 
	} catch (e) {
		ngmf._error("[ngmf.exeCallBack] Exception :: ", e);
	}
};

/**
 * Transcation시 URL에 시컨스 증가로 구분하여 포함처리
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} strUrl :: I :: N :: :: 호출하는 URL
 * @return {String} strUrl
 * @author js.Lee
 * @example ngmf.preTrxCall(strUrl);
 * @exampleAsIs ngmf_PreTrxCall(strUrl);
 */
ngmf.preTrxCall = function(strUrl) {
	try {
		GLV.G_iTrxCurIdx++;

		if (GLV.G_iTrxCurIdx > 9)
			GLV.G_iTrxCurIdx = 1;

		var nIdx = GLV.G_iTrxCurIdx;
		var nPos = strUrl.indexOf("?");
		// alert(strUrl + "::::"+ nPos);
		if (nPos > -1) {
			if (GLV.G_LogLvlChgCd == "2") {
				GLV.G_LogLvlTrCnt++;
				strUrl += "&LogLvlGbn=9";
			} else {
				strUrl += "&LogLvlGbn=";
			}

			strUrl += "&G_BizCd=" + GLV.G_BizCd;
			strUrl += "&G_Biz_Start_Time=" + GLV.G_Biz_Start_Time;
			strUrl += "&__smReqSeq=" + nIdx;
		} else {
			if (GLV.G_LogLvlChgCd == "2") {
				GLV.G_LogLvlTrCnt++;
				strUrl += "?LogLvlGbn=9";
			} else {
				strUrl += "?LogLvlGbn=";
			}
			strUrl += "&G_BizCd=" + GLV.G_BizCd;
			strUrl += "&G_Biz_Start_Time=" + GLV.G_Biz_Start_Time;
			strUrl += "&__smReqSeq=" + nIdx;
		}

		// alert(strUrl);

		// MainLeft(ZNGMSMAN00020.xml)에 설정 표시 지우기: to-be 메인화면과 맞지않음.
		/*
		 * if (Number(GLV.G_LogLvlTrCnt) == 30){ global.MainLeft.st_LogLvlChg.Text =
		 * ""; }
		 */
		if (Number(GLV.G_LogLvlTrCnt) >= 100) {
			GLV.G_LogLvlChgCd = "3";
		}
		/*
		if (scvar["SERVER_LOCATION"] === "SWGS"){
			if (Number(GLV.G_LogLvlTrCnt) >= 100) {
				GLV.G_LogLvlChgCd = "3";
			}
		} else {
			if (Number(GLV.G_LogLvlTrCnt) >= 30) {
				GLV.G_LogLvlChgCd = "3";
			}	
		}
		*/
	} catch (e) {
		ngmf._error("[ngmf.preTrxCall] Exception :: ", e);
	}
	return strUrl;
};

/**
 * Header에 넘기는 ScreenName을 공통에서 일괄처리 
 * - apm ngmf.apmScreenName
 * (미사용)
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} strScreenName :: I :: N :: :: Header에 넘기는 ScreenName을 공통에서 일괄처리 - apm
 * @return {String} strScreenName
 * @author js.Lee
 * @example ngmf.apmScreenName(ScreenName);
 * @exampleAsIs ngmf_APMScreenName(strScreenName);
 */
ngmf.apmScreenName = function(strScreenName) {
	try {
		var orgformId = ngmf._getOrgFormID();
		if (!strScreenName || (orgformId && orgformId.length == 13 && strScreenName && strScreenName.startsWith(orgformId))) return orgformId;
		if (strScreenName && strScreenName.startsWith("main")) return "ZNGMSMAN00010";
	} catch (e) {
		ngmf._error("[ngmf.apmScreenName] Exception :: ", e);
	} 
	return strScreenName;

};

/**
 * 선택된 항목들의 Value 설정 : LOV
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {Array} sColIdList :: I :: N :: :: Column List
 * @param {String} sColDel :: I :: N :: :: Column Delimeter Default
 * @param {String} sRecDel :: I :: N :: :: Delimeter Default ::
 * @param {Object} bindDs :: I :: Y :: :: 바인딩데이터셋
 * @return {String} strCol
 * @author js.Lee
 * @example ngmf.setValue(sColIdList, sColDel, sRecDel, bindDs);
 * @exampleAsIs ngmf_SetValue(sColIdList,sColDel,sRecDel);
 */
ngmf.setValue = function(sColIdList, sColDel, sRecDel, bindDs) {
	var strCol = "";
	try {
		if (ngmf.length(sColIdList) == 0) {
			sColIdList = new Array();
		}

		var nCnt = ngmf.length(sColIdList);
		var chkCnt = bindDs.getMatchedJSON("chk_col", "1", true).length;
		var chkSum = 0;
		var colDel = ",";
		var recDel = "::";

		if (ngmf.length(ngmf.trim(sColDel)) > 0) {
			colDel = sColDel;
		}

		if (ngmf.length(ngmf.trim(sRecDel)) > 0) {
			recDel = sRecDel;
		}

		for ( var i = 0; i < bindDs.getRowCount(); i++) {
			if (bindDs.getCellData(i, "chk_col") == "1") {
				chkSum++;

				for ( var j = 0; j < nCnt; j++) {
					if (j == 0)
						strCol += bindDs.getCellData(i, ngmf.trim(sColIdList[j]));
					else
						strCol += colDel
								+ bindDs.getCellData(i, ngmf.trim(sColIdList[j]));
				}

				if (chkCnt != chkSum)
					strCol += recDel;
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.setValue] Exception :: ", e);
	}
	return strCol;
};

/*
 * LoV(List of Value) 기능 처리 [재확인]
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} callbackID :: I :: N :: :: 콜백분기아이디
 * @param {String} screenId :: I :: N :: :: LOV 호출 Window ID
 * @param {String} arrInputObjList :: I :: N :: :: 검색 조건 Parameter List
 * @param {String} multiYn :: I :: N :: :: Multi Selete Yes(Y)/No(N)
 * @param {String} dspList :: I :: Y :: :: Display Column Count(Max 5)
 * @param {String} lovWidthList :: I :: Y :: :: Display Column Width 설정
 * @param {String} lovAlignList :: I :: Y :: :: Display Column Align 설정
 * @param {String} lovWinTitle :: I :: Y :: :: Window Title 설정
 * @param {String} arrLovTitle :: I :: Y :: :: Gird Head Text 설정
 * @param {String} colDelimeter :: I :: Y :: :: return Column Delimeter설정
 * @param {String} recDelimeter :: I :: Y :: :: return Record Delimeter설정
 * @param {String} strPRDLike :: I :: Y :: :: 상품검색(유사어 검색) LoV 구분
 * @param {String} strPRDWinTitle :: I :: Y :: :: 상품검색(유사어 검색) 일 경우 TITLE
 * @param {String} strPRDGridTitle :: I :: Y :: :: 상품검색(유사어 검색) 일 경우 Gird Head Text 설정
 * @param {String} callbackFunction :: I :: Y :: :: 콜백 함수(입력안하면 scwin.lovCallBack 실행된다.)
 * @param {String} isNothingMsg :: I :: Y :: :: 데이터가 없는 경우 메시지 노출여부
 * @param {String} isNotingPop :: I :: Y :: :: 데이터가 없는 경우 팝업 OPEN여부
 * @return 없음
 * @author js.Lee
 * @example ngmf.promise.lov("aaaa",scvar.screenName+"::"+scvar.myWframeId,
 *          inputObjList, v_MultiYn, v_DspList, <BR/> "100,200", "left,center",
 *          null, null, null, <BR/> null, null, null, null,
 *          "scwin.lovCallBack2", 'N', 'N');
 * @exampleAsIs var rtn = ngmf_Lov(f_ScreenName,inputObjList,ngmv_MultiYn);
 * @sampleLink grd_paging
 */
// LOV 실행
ngmf.lov = function() {
	ngmf.alert("[16.07.15]ngmf.lov 함수는 삭제함수로 ngmf.promise.lov를 사용하시기 바랍니다.");
};

ngmf.__lov = function(callbackID, screenId, arrInputObjList, multiYn, dspList,
		lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter,
		recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle,
		callbackFunction, isNothingMsg, isNotingPop) {
	try{
		if (arrInputObjList.length == 0) {
			arrInputObjList = new Array();
		}
		var isMultiCheck = false;
		var lovColTitle = "";
		var lovColAlign = "";
		var lovColWidth = "";
		var nObjCnt = arrInputObjList.length;
		var TrxCode = "ZNGMSLOV00010_TR01"; // Transaction Code
		var prdWinTitle = "";
		var prdGridTitle = "";

		if (multiYn == "Y") {
			isMultiCheck = true;
		}

		if (typeof arrLovTitle != "undefined" && arrLovTitle != null && arrLovTitle != "") {
			lovColTitle = arrLovTitle.join(",");
		}

		if (lovAlignList != undefined && lovAlignList != "undefined") {
			lovColAlign = lovAlignList;
		}

		if (lovWidthList != undefined && lovWidthList != "undefined") {
			lovColWidth = lovWidthList;
		}

		if (strPRDWinTitle != undefined && strPRDWinTitle != "undefined") {
			prdWinTitle = strPRDWinTitle;
		}

		if (strPRDGridTitle != undefined && strPRDGridTitle != "undefined") {
			prdGridTitle = strPRDGridTitle;
		}

		if (GLV.G_CLOSEFG == "6") {
			return;
		} else {
			ngmf.bizTrSettingStop(TrxCode);
		}

		var wFrameArray = screenId.split("::");
		var wFrameId = "";

		if (wFrameArray.length > 1) {
			wFrameId = wFrameArray[1];
		}

		screenId = ngmf.apmScreenName(wFrameArray[0]);

		var prdLikeStr = "";
		if (strPRDLike == "PRDLIKE") {
			prdLikeStr = strPRDLike;
		}

		if (ngmf.makeHeadSet(TrxCode, screenId) != "OK") {
			return;
		}

		// LOV관련 dataSet Clear
		ngmf.clear(GLD.GDS_LOV);
		ngmf.clear(GLD.GDS_WINTITLE);
		ngmf.clear(GLD.GDS_ITEMSEARCH);
		ngmf.clear(GLD.GDS_SEARCH);
		ngmf.clear(GLD.GDS_OUTHEAD);

		// global dataset : GLD.GDS_LOV 컬럼만들기
		for ( var i = 0; i < nObjCnt; i++) {
			if (i == 0) {
				var options = {
					name : "map_id",
					dataType : "text"
				};
				GLD.GDS_LOV.insertColumn("map_id", options);
			} else {
				var options = {
					'name' : 'iparam' + i,
					'dataType' : 'text'
				};
				GLD.GDS_LOV.insertColumn('iparam' + i, options);
			}

		}

		// global dataset : GLD.GDS_LOV에 한줄 삽입
		var aIdx = GLD.GDS_LOV.insertRow();
		var nColCnt = GLD.GDS_LOV.cellIdList.length;

		// global dataset : GLD.GDS_LOV에 값 설정
		for ( var i = 0; i < nColCnt; i++) {

			if (i == 0) {
				GLD.GDS_LOV.setCellData(aIdx, "map_id", arrInputObjList[i]);
			} else if (i == 1) {
				if ((arrInputObjList[1] == "") || (ngmf.length(arrInputObjList[1]) == 0)) {
					GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, "");
				} else {
					GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, arrInputObjList[i]);
				}
			} else {
				GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, arrInputObjList[i]);
			}
		}

		ngmf._debug("^^ GDS_LOV start to write ===>");
		ngmf._debug(JSON.stringify(GLD.GDS_LOV.getRowJSON(0)));
		ngmf._debug("<=== GDS_LOV finish to write ^^");

		var strUrl = ngmf.SVC_PATH + "/LOV"; // ngmf.servicePort("LOV");
		strUrl += "?mapid=" + arrInputObjList[0];
		strUrl += "&Trx_code=" + TrxCode;
		strUrl += "&ScreenName=" + screenId;
		strUrl += ngmv.fCloseAccount;

		ngmf._debug("[strUrl check1] =============>");
		ngmf._debug(strUrl);
		ngmf._debug("<====================");

		var sDate = ngmf.extGetHDTime(); // ExtGetHDTime() ==> 웹스퀘어에서는 구현불가
		var startTime = ngmf.trim(ngmf.timeM());
		var nIdx = GLV.G_iTrxCurIdx;

		strUrl = ngmf.preTrxCall(strUrl);
		ngmf._debug("[strUrl check2] =============>");
		ngmf._debug(strUrl);
		ngmf._debug("<====================");

		if ($w.getSubmission("Lovselect") != null) {
			$w.deleteSubmission("Lovselect");
		}

		var prcMsg = "작업을 처리중입니다.";

		if (ngmv.isUseProgress == false) {
			prcMsg = "";
		}

		/** **************** 통신하기 시작 ***************** */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : "Lovselect",
			"ref" : "",
			"target" : "",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : "asynchronous",
			"processMsg" : prcMsg,
			"submitDoneHandler" : function(e) {

				var result = e.responseJSON;
				var params = result.params;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					errorCd.push(errorJSON.ErrorCode);
					errorMsg.push(errorJSON.ErrorMsg);
				}

				var output1 = result.output1; // GDS_WINTITLE
				var output2 = result.output2; // GDS_ITEMSEARCH
				var output3 = result.output3; // GDS_SEARCH
				var head = result.HEAD; // GDS_OUTHEAD

				ngmf.setAutoJSON(output1, GLD.GDS_WINTITLE);
				ngmf.setAutoJSON(output2, GLD.GDS_ITEMSEARCH);

				// 조회결과 데이터가 없으면
				if (output3.length == 0) {
					$.each(output2[0], function(key, value, index) {
						var options = {
							name : key,
							dataType : "text"
						};
						GLD.GDS_SEARCH.insertColumn(key + index, options);
					});
				} else {
					ngmf.setAutoJSON(output3, GLD.GDS_SEARCH, "chk_col");
				}

				ngmf.setAutoJSON(head, GLD.GDS_OUTHEAD);

				var wintitle = "";
				if (typeof lovWinTitle === "undefined" || lovWinTitle == null || lovWinTitle == "") {
					wintitle = GLD.GDS_WINTITLE.getCellData(0, "wintitle");
				} else {
					wintitle = lovWinTitle;
				}

				var ngmvRtnCd = GLD.GDS_OUTHEAD.getCellData(0, "Rt_Cd");
				var realMsg = errorMsg[0].split("^^rs^^");

				// 처리결과가 비정상종료인 경우
				if (ngmvRtnCd == "1") {
					ngmf.alert(realMsg[2]);
					return;
				} else {
					var cntSearch = GLD.GDS_SEARCH.getRowCount();
					if (cntSearch == null || cntSearch == "" || cntSearch == 0) {

						var callbackFunc = "";
						if (ngmf.isFunction(callbackFunction)) {
							callbackFunc = callbackFunction;
						} else {
							if (typeof callbackFunction === "undefined"
									|| callbackFunction == null
									|| ngmf.trim(callbackFunction).length == 0) {
								callbackFunc = "scwin.lovCallBack";
							} else {
								callbackFunc = callbackFunction;
							}

							if (wFrameId.length > 0) {
								var orgCallBackFunc = ngmf.trim(callbackFunc);
								callbackFunc = wFrameId + "_" + orgCallBackFunc;
								if (typeof eval(callbackFunc) === "undefined") {
									callbackFunc = orgCallBackFunc;
								}
							}
						}

						if (typeof isNotingPop === "undefined"
								|| isNotingPop == null 
								|| isNotingPop == ""
								|| isNotingPop == "Y") {

							var nothingButAGThang = "";

							if (typeof isNothingMsg === "undefined"
									|| isNothingMsg == null || isNothingMsg == ""
									|| isNothingMsg == "Y") {
								nothingButAGThang = realMsg[2];
							}

							// LOV팝업을 OPEN한다.
							var options = {
								mapId : arrInputObjList[0],
								searchKeyword : arrInputObjList[1],
								displayColIdx : dspList,
								lovTitle : lovColTitle,
								lovAlign : lovColAlign,
								lovWidth : lovColWidth,
								isMulti : isMultiCheck,
								prdLike : prdLikeStr,
								prdWTitle : prdWinTitle,
								prdGTitle : prdGridTitle,
								title : wintitle,
								id : "lovPopup",
								uniqueKey : callbackID,
								nothingMsg : nothingButAGThang
							};
							ngmf.__dialog("lib/comm", "lovPopup", options, 600, 450, "", "", "", callbackFunc);
//							if (GLV.G_FORMUSEFG == "M") {
//								ngmf.__dialog("lib/comm", "lovPopup", options, 600, 450, "", "", "", callbackFunc);
//							} else {
//								ngmf.mainIconDialog("lib/comm", "lovPopup", options, 600, 450, "", "", "", callbackFunc);
//							}
						}

					} else if (cntSearch == 1) {

						var callbackFunc = "";

						if (ngmf.isFunction(callbackFunction)) {

							callbackFunction(callbackID, GLD.GDS_SEARCH.getAllJSON());
						} else {

							if (typeof callbackFunction === "undefined"
									|| callbackFunction == null
									|| ngmf.trim(callbackFunction).length == 0) {
								callbackFunc = "scwin.lovCallBack";
							} else {
								callbackFunc = callbackFunction;
							}

							if (wFrameId.length > 0) {
								var orgCallBackFunc = ngmf.trim(callbackFunc);
								callbackFunc = wFrameId + "_" + orgCallBackFunc;
								if (typeof eval(callbackFunc) === "undefined") {
									callbackFunc = orgCallBackFunc;
								}
							}
							eval(callbackFunc + "(callbackID, GLD.GDS_SEARCH.getAllJSON())");
						}

					} else {
						var callbackFunc = "";

						if (typeof callbackFunction === "undefined"
								|| callbackFunction == null
								|| ngmf.trim(callbackFunction).length == 0) {
							callbackFunc = "scwin.lovCallBack";
						} else {
							callbackFunc = callbackFunction;
						}

						if (!ngmf.isFunction(callbackFunc)) {
							if (wFrameId.length > 0) {
								var orgCallBackFunc = ngmf.trim(callbackFunc);
								callbackFunc = wFrameId + "_" + orgCallBackFunc;
								if (typeof eval(callbackFunc) === "undefined") {
									callbackFunc = orgCallBackFunc;
								}
							}
						}
						// LOV팝업을 OPEN한다.
						var options = {
							mapId : arrInputObjList[0],
							searchKeyword : arrInputObjList[1],
							displayColIdx : dspList,
							lovTitle : lovColTitle,
							lovAlign : lovColAlign,
							lovWidth : lovColWidth,
							isMulti : isMultiCheck,
							prdLike : prdLikeStr,
							prdWTitle : prdWinTitle,
							prdGTitle : prdGridTitle,
							title : wintitle,
							id : "lovPopup",
							uniqueKey : callbackID
						};

						if (GLV.G_FORMUSEFG == "M") {
							ngmf.__dialog("lib/comm", "lovPopup", options, 600, 450, "", "", "", callbackFunc);
						} else {
							ngmf.mainIconDialog("lib/comm", "lovPopup", options, 600, 450, "", "", "", callbackFunc);							
						}
					}
				}

				$w.deleteSubmission("Lovselect");
			},
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			}
		};

		$w.createSubmission(submissionObj);
		$w.executeSubmission("Lovselect");
	} catch (e) {
		ngmf._error("[ngmf.promise.lov] Exception :: ", e);
	}
};

ngmf.__lovW = function(callbackID, screenId, arrInputObjList, multiYn, dspList,
		lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter,
		recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle,
		callbackFunction, isNothingMsg, isNotingPop) {
	try{
		if (arrInputObjList.length == 0) {
			arrInputObjList = new Array();
		}
		var isMultiCheck = false;
		var lovColTitle = "";
		var lovColAlign = "";
		var lovColWidth = "";
		var nObjCnt = arrInputObjList.length;
		var TrxCode = "ZNGMSLOV00010_TR01"; // Transaction Code
		var prdWinTitle = "";
		var prdGridTitle = "";
		var isNullSearchData = false;

		if (multiYn == "Y") {
			isMultiCheck = true;
		}

		if (typeof arrLovTitle != "undefined" && arrLovTitle != null && arrLovTitle != "") {
			lovColTitle = arrLovTitle.join(",");
		}

		if (lovAlignList != undefined && lovAlignList != "undefined") {
			lovColAlign = lovAlignList;
		}

		if (lovWidthList != undefined && lovWidthList != "undefined") {
			lovColWidth = lovWidthList;
		}

		if (strPRDWinTitle != undefined && strPRDWinTitle != "undefined") {
			prdWinTitle = strPRDWinTitle;
		}

		if (strPRDGridTitle != undefined && strPRDGridTitle != "undefined") {
			prdGridTitle = strPRDGridTitle;
		}

		if (GLV.G_CLOSEFG == "6") {
			return;
		} else {
			ngmf.bizTrSettingStop(TrxCode);
		}

		var wFrameArray = screenId.split("::");
		var wFrameId = "";

		if (wFrameArray.length > 1) {
			wFrameId = wFrameArray[1];
		}

		screenId = ngmf.apmScreenName(wFrameArray[0]);

		var prdLikeStr = "";
		if (strPRDLike == "PRDLIKE") {
			prdLikeStr = strPRDLike;
		}

		if (ngmf.makeHeadSet(TrxCode, screenId) != "OK") {
			return;
		}

		// LOV관련 dataSet Clear
		ngmf.clear(GLD.GDS_LOV);
		ngmf.clear(GLD.GDS_WINTITLE);
		ngmf.clear(GLD.GDS_ITEMSEARCH);
		ngmf.clear(GLD.GDS_SEARCH);
		ngmf.clear(GLD.GDS_OUTHEAD);

		// global dataset : GLD.GDS_LOV 컬럼만들기
		for ( var i = 0; i < nObjCnt; i++) {
			if (i == 0) {
				var options = {
					name : "map_id",
					dataType : "text"
				};
				GLD.GDS_LOV.insertColumn("map_id", options);
			} else {
				var options = {
					'name' : 'iparam' + i,
					'dataType' : 'text'
				};
				GLD.GDS_LOV.insertColumn('iparam' + i, options);
			}

		}

		// global dataset : GLD.GDS_LOV에 한줄 삽입
		var aIdx = GLD.GDS_LOV.insertRow();
		var nColCnt = GLD.GDS_LOV.cellIdList.length;

		// global dataset : GLD.GDS_LOV에 값 설정
		for ( var i = 0; i < nColCnt; i++) {

			if (i == 0) {
				GLD.GDS_LOV.setCellData(aIdx, "map_id", arrInputObjList[i]);
			} else if (i == 1) {
				if ((arrInputObjList[1] == "") || (ngmf.length(arrInputObjList[1]) == 0)) {
					isNullSearchData = true;
					GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, "");
				} else {
					GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, arrInputObjList[1]);
				}
			} else {
				GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, arrInputObjList[i]);
			}
		}

		ngmf._debug("^^ GDS_LOV start to write ===>");
		ngmf._debug(JSON.stringify(GLD.GDS_LOV.getRowJSON(0)));
		ngmf._debug("<=== GDS_LOV finish to write ^^");

		var strUrl = ngmf.SVC_PATH + "/LOV"; // ngmf.servicePort("LOV");
		strUrl += "?mapid=" + arrInputObjList[0];
		strUrl += "&Trx_code=" + TrxCode;
		strUrl += "&ScreenName=" + screenId;
		strUrl += ngmv.fCloseAccount;

		ngmf._debug("[strUrl check1] =============>");
		ngmf._debug(strUrl);
		ngmf._debug("<====================");

		var sDate = ngmf.extGetHDTime(); // ExtGetHDTime() ==> 웹스퀘어에서는 구현불가
		var startTime = ngmf.trim(ngmf.timeM());
		var nIdx = GLV.G_iTrxCurIdx;

		strUrl = ngmf.preTrxCall(strUrl);
		ngmf._debug("[strUrl check2] =============>");
		ngmf._debug(strUrl);
		ngmf._debug("<====================");

		if ($w.getSubmission("Lovselect") != null) {
			$w.deleteSubmission("Lovselect");
		}

		var prcMsg = "작업을 처리중입니다.";

		if (ngmv.isUseProgress == false) {
			prcMsg = "";
		}

		/** **************** 통신하기 시작 ***************** */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : "Lovselect",
			"ref" : "",
			"target" : "",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : "asynchronous",
			"processMsg" : prcMsg,
			"submitDoneHandler" : function(e) {

				var result = e.responseJSON;
				var params = result.params;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					errorCd.push(errorJSON.ErrorCode);
					errorMsg.push(errorJSON.ErrorMsg);
				}

				var output1 = result.output1; // GDS_WINTITLE
				var output2 = result.output2; // GDS_ITEMSEARCH
				var output3 = result.output3; // GDS_SEARCH
				var head = result.HEAD; // GDS_OUTHEAD

				ngmf.setAutoJSON(output1, GLD.GDS_WINTITLE);
				ngmf.setAutoJSON(output2, GLD.GDS_ITEMSEARCH);

				// 조회결과 데이터가 없으면
				if (output3.length == 0) {
					$.each(output2[0], function(key, value, index) {
						var options = {
							name : key,
							dataType : "text"
						};
						GLD.GDS_SEARCH.insertColumn(key + index, options);
					});
				} else {
					ngmf.setAutoJSON(output3, GLD.GDS_SEARCH, "chk_col");
				}

				ngmf.setAutoJSON(head, GLD.GDS_OUTHEAD);

				var wintitle = "";
				if (typeof lovWinTitle === "undefined" || lovWinTitle == null || lovWinTitle == "") {
					wintitle = GLD.GDS_WINTITLE.getCellData(0, "wintitle");
				} else {
					wintitle = lovWinTitle;
				}

				var ngmvRtnCd = GLD.GDS_OUTHEAD.getCellData(0, "Rt_Cd");
				var realMsg = errorMsg[0].split("^^rs^^");

				// 처리결과가 비정상종료인 경우
				if (ngmvRtnCd == "1") {
					ngmf.alert(realMsg[2]);
					return;
				} else {
					var cntSearch = GLD.GDS_SEARCH.getRowCount();
					if (cntSearch == null || cntSearch == "" || cntSearch == 0) {

						var callbackFunc = "";
						if (ngmf.isFunction(callbackFunction)) {
							callbackFunc = callbackFunction;
						} else {
							if (typeof callbackFunction === "undefined"
									|| callbackFunction == null
									|| ngmf.trim(callbackFunction).length == 0) {
								callbackFunc = "scwin.lovCallBack";
							} else {
								callbackFunc = callbackFunction;
							}

							if (wFrameId.length > 0) {
								var orgCallBackFunc = ngmf.trim(callbackFunc);
								callbackFunc = wFrameId + "_" + orgCallBackFunc;
								if (typeof eval(callbackFunc) === "undefined") {
									callbackFunc = orgCallBackFunc;
								}
							}
						}

						if (typeof isNotingPop === "undefined"
								|| isNotingPop == null 
								|| isNotingPop == ""
								|| isNotingPop == "Y") {

							var nothingButAGThang = "";

							if (typeof isNothingMsg === "undefined"
									|| isNothingMsg == null || isNothingMsg == ""
									|| isNothingMsg == "Y") {
								nothingButAGThang = realMsg[2];
							}

							// LOV팝업을 OPEN한다.
							var options = {
								mapId : arrInputObjList[0],
								searchKeyword : arrInputObjList[1],
								displayColIdx : dspList,
								lovTitle : lovColTitle,
								lovAlign : lovColAlign,
								lovWidth : lovColWidth,
								isMulti : isMultiCheck,
								prdLike : prdLikeStr,
								prdWTitle : prdWinTitle,
								prdGTitle : prdGridTitle,
								title : wintitle,
								id : "lovPopup",
								uniqueKey : callbackID,
								nothingMsg : nothingButAGThang
							};
							ngmf.__dialog("lib/comm", "lovPopupW", options, 600, 450, "", "", "", callbackFunc, "", "", true); 
						}

					} else if (cntSearch == 1) {

						var callbackFunc = "";

						if (ngmf.isFunction(callbackFunction)) {

							callbackFunction(callbackID, GLD.GDS_SEARCH.getAllJSON());
						} else {

							if (typeof callbackFunction === "undefined"
									|| callbackFunction == null
									|| ngmf.trim(callbackFunction).length == 0) {
								callbackFunc = "scwin.lovCallBack";
							} else {
								callbackFunc = callbackFunction;
							}

							if (wFrameId.length > 0) {
								var orgCallBackFunc = ngmf.trim(callbackFunc);
								callbackFunc = wFrameId + "_" + orgCallBackFunc;
								if (typeof eval(callbackFunc) === "undefined") {
									callbackFunc = orgCallBackFunc;
								}
							}
							eval(callbackFunc + "(callbackID, GLD.GDS_SEARCH.getAllJSON())");
						}

					} else {
						var callbackFunc = "";

						if (typeof callbackFunction === "undefined"
								|| callbackFunction == null
								|| ngmf.trim(callbackFunction).length == 0) {
							callbackFunc = "scwin.lovCallBack";
						} else {
							callbackFunc = callbackFunction;
						}

						if (!ngmf.isFunction(callbackFunc)) {
							if (wFrameId.length > 0) {
								var orgCallBackFunc = ngmf.trim(callbackFunc);
								callbackFunc = wFrameId + "_" + orgCallBackFunc;
								if (typeof eval(callbackFunc) === "undefined") {
									callbackFunc = orgCallBackFunc;
								}
							}
						}
						// LOV팝업을 OPEN한다.
						var options = {
							mapId : arrInputObjList[0],
							searchKeyword : arrInputObjList[1],
							displayColIdx : dspList,
							lovTitle : lovColTitle,
							lovAlign : lovColAlign,
							lovWidth : lovColWidth,
							isMulti : isMultiCheck,
							prdLike : prdLikeStr,
							prdWTitle : prdWinTitle,
							prdGTitle : prdGridTitle,
							title : wintitle,
							id : "lovPopup",
							uniqueKey : callbackID
						};

						ngmf.__dialog("lib/comm", "lovPopupW", options, 600, 450, "", "", "", callbackFunc, "", "", true);
					}
				}

				$w.deleteSubmission("Lovselect");
			},
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			}
		};

		$w.createSubmission(submissionObj);
		$w.executeSubmission("Lovselect");
	} catch (e) {
		ngmf._error("[ngmf.__lovW] Exception :: ", e);
	}
};

/*
 * LoV2(List of Value) 기능 처리 - 상품 유사어 검색 전용
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} callbackID :: I :: N :: :: 콜백분기아이디
 * @param {String} screenId :: I :: N :: :: LOV 호출 Window ID
 * @param {String} arrInputObjList :: I :: N :: :: 검색 조건 Parameter List
 * @param {String} multiYn :: I :: N :: :: Multi Selete Yes(Y)/No(N)
 * @param {String} dspList :: I :: Y :: :: Display Column Count(Max 5)
 * @param {String} lovWidthList :: I :: Y :: :: Display Column Width 설정
 * @param {String} lovAlignList :: I :: Y :: :: Display Column Align 설정
 * @param {String} lovWinTitle :: I :: Y :: :: Window Title 설정
 * @param {String} arrLovTitle :: I :: Y :: :: Gird Head Text 설정
 * @param {String} colDelimeter :: I :: Y :: :: return Column Delimeter설정
 * @param {String} recDelimeter :: I :: Y :: :: return Record Delimeter설정
 * @param {String} strPRDLike :: I :: Y :: :: 상품검색(유사어 검색) LoV 구분
 * @param {String} strPRDWinTitle :: I :: Y :: :: 상품검색(유사어 검색) 일 경우 TITLE
 * @param {String} strPRDGridTitle :: I :: Y :: :: 상품검색(유사어 검색) 일 경우 Gird Head Text 설정
 * @param {String} callbackFunction :: I :: Y :: :: 콜백 함수(입력안하면 scwin.lovCallBack 실행된다.)
 * @param {String} isNothingMsg :: I :: Y :: :: 데이터가 없는 경우 메시지 노출여부
 * @param {String} isNotingPop :: I :: Y :: :: 데이터가 없는 경우 팝업 OPEN여부
 * @return 없음
 * @author js.Lee
 * @example ngmf.promise.lov2( <BR/> "aaaa","ZASMSSTD00900", inputObjList, v_MultiYn,
 *          v_DspList,"100,200", "left,center", <BR/> null, null, null, null,
 *          null, null, null, "scwin.lovCallBack", 'Y', 'N' <BR/> );
 * @exampleAsIs var rtn =
 *              ngmf_Lov2(ScreenName,inputObjList,ngmv_MultiYn,sColSeq,"",WidthList,AlignList,,,ColDelimeter);
 */
ngmf.lov2 = function() {
	ngmf.alert("[16.07.15]ngmf.lov2 함수는 삭제함수로 ngmf.promise.lov2를 사용하시기 바랍니다.");
};

ngmf.__lov2 = function(callbackID, screenId, arrInputObjList, multiYn, dspList,
		lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter,
		recDelimeter, strPRDLike, strPRDWinTitle, strPRDGridTitle,
		callbackFunction, isNothingMsg, isNotingPop) {
	ngmf.__lov(callbackID, screenId, arrInputObjList, multiYn, dspList,
			lovWidthList, lovAlignList, lovWinTitle, arrLovTitle, colDelimeter,
			recDelimeter, "PRDLIKE", strPRDWinTitle, strPRDGridTitle,
			callbackFunction, isNothingMsg, isNotingPop);
};

/**
 * Dataset Append 처리(Sync)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} TrxCode :: I :: N :: :: Transaction Code
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} InData :: I :: N :: :: Input DataList
 * @param {String} OutData :: IO :: N :: :: Output DataList
 * @param {String} CallBackFuncName :: I :: Y :: :: CallBack Script
 * @param {String} DataList :: IO :: N :: :: Append 대상 Dataset
 * @param {String} AddColumnNm :: I :: Y :: :: 추가 Column 정의
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {String} ngmv_AppGridId :: I :: N :: :: Append 후 Grid Row Position 설정 Object(Grid ID)
 * @param {String} Encflag :: I :: Y :: :: NetWork 암복화 여부 - 미사용
 * @param {String} inputstr :: I :: Y :: :: NetWork 암복화시 input column
 * @param {String} outputstr :: IO :: Y :: :: NetWork 암복화시 output column
 * @return 없음
 * @author js.Lee
 * @example ngmf.syncAppend(trxCode,screenName,"",inDataList,outDataList,"scwin.callBack",DataList,strAddColList,"SELF");
 * @exampleAsIs ngmf_syncAppend(Trx_Code, g_ScreenName, "", InDataList,
 *              OutDataList, "", DataList, "", "", "grd_Bld");
 * @sampleLink grd_paging
 */
ngmf.syncAppend = function(TrxCode, ScreenName, arg, InData, OutData,
		CallBackFuncName, DataList, AddColumnNm, ngmv_MsgFg, ngmv_AppGridId,
		Encflag, inputstr, outputstr) {

	ngmf.appendData("synchronous", TrxCode, ScreenName, arg, InData, OutData,
			CallBackFuncName, DataList, AddColumnNm, ngmv_MsgFg,
			ngmv_AppGridId, Encflag, inputstr, outputstr);

};

/*
 * Dataset Append 처리(Async)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} TrxCode :: I :: N :: :: Transaction Code
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} InData :: I :: N :: :: Input DataList
 * @param {String} OutData :: IO :: N :: :: Output DataList
 * @param {String} CallBackFuncName :: I :: Y :: :: CallBack Script
 * @param {String} DataList :: IO :: N :: :: Append 대상 Dataset
 * @param {String} AddColumnNm :: I :: Y :: :: 추가 Column 정의
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {String} ngmv_AppGridId :: I :: N :: :: Append 후 Grid Row Position 설정 Object(Grid ID)
 * @param {String} Encflag NetWork :: I :: Y :: :: 암복화 여부 - 미사용
 * @param {String} inputstr NetWork :: I :: Y :: :: 암복화시 input column
 * @param {String} outputstr NetWork :: IO :: Y :: :: 암복화시 output column
 * @return 없음
 * @author js.Lee
 * @example ngmf.promise.asyncAppend(trxCode,screenName,"",inDataList,outDataList,"scwin.callBack",DataList,strAddColList,"");
 * @exampleAsIs ngmf_AsyncAppend(TrxCode,g_ScreenName,"",InDataList,OutDataList,"f_callback",SvcInfo_DataList,"","","GRD_HST");
 * @sampleLink grd_paging
 */

ngmf.asyncAppend = function() {
	ngmf.alert("[16.07.15]ngmf.asyncAppend 함수는 삭제함수로 ngmf.promise.asyncAppend를 사용하시기 바랍니다.");
};

ngmf.__asyncAppend = function(TrxCode, ScreenName, arg, InData, OutData,
		CallBackFuncName, DataList, AddColumnNm, ngmv_MsgFg, ngmv_AppGridId,
		Encflag, inputstr, outputstr) {
	ngmf.appendData("asynchronous", TrxCode, ScreenName, arg, InData, OutData,
			CallBackFuncName, DataList, AddColumnNm, ngmv_MsgFg,
			ngmv_AppGridId, Encflag, inputstr, outputstr);

};

/**
 * Dataset Append 처리(Async)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} mode :: I :: N :: :: 통신형태(synchronous or asynchronous)
 * @param {String} TrxCode :: I :: N :: :: Transaction Code
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} InData :: I :: N :: :: Input DataList
 * @param {String} OutData :: IO :: N :: :: Output DataList
 * @param {String} CallBackFuncName :: I :: Y :: :: CallBack Script
 * @param {String} DataList :: IO :: N :: :: Append 대상 Dataset
 * @param {String} AddColumnNm :: I :: Y :: :: 추가 Column 정의
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {String} ngmv_AppGridId :: I :: N :: :: Append 후 Grid Row Position 설정 Object(Grid ID)
 * @param {String} Encflag NetWork :: I :: Y :: :: 암복화 여부 - 미사용
 * @param {String} inputstr NetWor :: I :: Y :: :: k 암복화시 input column
 * @param {String} outputstr NetWork :: IO :: Y :: :: 암복화시 output column
 * @return 없음
 * @author js.Lee
 * @example ngmf.appendData(trxCode,screenName,"",inDataList,outDataList,"scwin.callBack",DataList,strAddColList,"");
 * @exampleAsIs ngmf_AsyncAppend(TrxCode,g_ScreenName,"",InDataList,OutDataList,"f_callback",SvcInfo_DataList,"","","GRD_HST");
 */
ngmf.appendData = function(mode, TrxCode, ScreenName, arg, InData, OutData,
		CallBackFuncName, DataList, AddColumnNm, ngmv_MsgFg, ngmv_AppGridId,
		Encflag, inputstr, outputstr) {
	try {

		if (GLV.G_CLOSEFG == "6") {
			return;
		}

		var wFrameArray = ScreenName.split("::");
		var wFrameId = "";

		if (wFrameArray.length > 1) {
			ScreenName = ngmf.apmScreenName(wFrameArray[0]);
			wFrameId = wFrameArray[1];
		} else {
			ScreenName = ngmf.apmScreenName(ScreenName);
		}

		var strSSO = "commonsvc=0";
		var reqDataSetNmArr = InData.split(","); // 요청데이터셋 이름 Array
		var resDataSetNmArr = OutData.split(",");
		var strData = DataList.split(",");

		if (ngmf.trim(wFrameId).length > 0) {

			for ( var i = 0; i < reqDataSetNmArr.length; i++) {

				var orgReqDataSetNm = ngmf.trim(reqDataSetNmArr[i]);
				reqDataSetNmArr[i] = wFrameId + "_" + orgReqDataSetNm;

				if (typeof ngmf.object(reqDataSetNmArr[i]) === "undefined") {
					reqDataSetNmArr[i] = orgReqDataSetNm;
				}
			}

			for ( var i = 0; i < resDataSetNmArr.length; i++) {

				var orgResDataSetNm = ngmf.trim(resDataSetNmArr[i]);
				resDataSetNmArr[i] = wFrameId + "_" + orgResDataSetNm;

				if (typeof ngmf.object(resDataSetNmArr[i]) === "undefined") {
					resDataSetNmArr[i] = orgResDataSetNm;
				}
			}

			for ( var i = 0; i < strData.length; i++) {

				var orgStrData = ngmf.trim(strData[i]);
				strData[i] = wFrameId + "_" + orgStrData;

				if (typeof ngmf.object(strData[i]) === "undefined") {
					strData[i] = orgStrData;
				}
			}

			if (typeof CallBackFuncName !== "undefined") {
				if (CallBackFuncName != null && CallBackFuncName != "" && !ngmf.isFunction(CallBackFuncName)) {
					var callbackVar = ngmf.trim(CallBackFuncName);
					CallBackFuncName = wFrameId + "_" + callbackVar;
					if (typeof eval(CallBackFuncName) === "undefined") {
						CallBackFuncName = callbackVar;
					}
				}
			}

		}

		var dlID1 = ngmf.trim(strData[0]);
		var dlID2 = ngmf.trim(strData[1]);

		/** ****************DataList 존재여부 체크******************* */
		if (typeof ngmf.object(dlID1) === "undefined") {
			ngmf._debug(dlID1 + " 가 존재하지 않습니다.(ngmf.appendData)");
		}

		if (typeof ngmf.object(dlID2) === "undefined") {
			ngmf._debug(dlID2 + " 가 존재하지 않습니다.(ngmf.appendData)");
		}
		/** **************************************************** */

		var ds = ngmf.object(ngmf.trim(strData[0]));
		var appDs = ngmf.object(ngmf.trim(strData[1]));
		var dsInfo = ds.getInfo();

		ngmf.clear(appDs);

		for ( var i = 0; i < ds.cellIdList.length; i++) {

			var colId = ds.cellIdList[i];
			var options = {
				"dataType" :dsInfo.columnInfo[colId]["dataType"],
				"name" :  dsInfo.columnInfo[colId]["name"] 
			};

			ngmf.insertColumn(appDs, colId, options);
		}

		// 추가컬럼 처리
		if (ngmf.length(ngmf.trim(AddColumnNm)) > 0) {

			var result = ngmf.insertColumn(ngmf.trim(strData[1]), ngmf.trim(AddColumnNm), {
				"name" : AddColumnNm,
				"dataType" : "text"
			});

			if (result == 0) {
				ngmf.alert("데이터리스트가 업습니다.");
				return;
			}

		}

		// 통신 요청데이터셋 만들기
		var reqTempArr = new Array();
		for ( var i = 0; i < reqDataSetNmArr.length; i++) {
			var pId = ngmf.trim(reqDataSetNmArr[i]);

			/** ****************DataList 존재여부 체크******************* */
			if (typeof ngmf.object(pId) === "undefined") {
				ngmf._error(pId + " 가 존재하지 않습니다.(ngmf.appendData)");
			}
			/** **************************************************** */

			var pKey = "input" + (i + 1); // ngmf.lpad(""+(i+1),"0",2);
			reqTempArr.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
		}

		// 통신 결과데이터셋 만들기
		var resTempArr = new Array();
		for ( var i = 0; i < resDataSetNmArr.length; i++) {
			var pId = ngmf.trim(resDataSetNmArr[i]);

			/** ****************DataList 존재여부 체크******************* */
			if (typeof ngmf.object(pId) === "undefined") {
				ngmf._error(pId + " 가 존재하지 않습니다.(ngmf.appendData)");
			}
			/** **************************************************** */

			var pKey = "output" + (i + 1);
			resTempArr.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
		}

		// GLD.GDS_INHEAD 설정 실패하면 메시지 출력
		if (ngmf.makeHeadSet(TrxCode, ScreenName) != "OK") {

			if (GLV.G_FORMUSEFG == "M") {
				ngmf.setSystemMsg("헤더 정보를 로드하는데 실패 하였습니다.");
			}

			return;
		}
		var strUrl = "";

		// 암호화여부 : ENCNGM::EncSVC 는 현재 알 수 없음.
		if (Encflag) {
			strUrl = "ENCNGM::EncSVC" + "?" + strSSO + "&rtcode=0" + "&Trx_code=" + TrxCode + "&ScreenName=" + ScreenName + ngmv.fCloseAccount;
			strUrl += "&inputEncGbn=" + inputstr;
			strUrl += "&inputEncGbn=" + outputstr;
		} else {
			strUrl = ngmf.SVC_PATH + "/SVC" + "?" + strSSO + "&rtcode=0" + "&Trx_code=" + TrxCode + "&ScreenName=" + ScreenName + ngmv.fCloseAccount;
		}

		strUrl += arg;

		if (typeof ngmv_MsgFg != "undefined") {
			if (ngmv_MsgFg.toUpperCase() != "SELF") {
				ngmf.setSystemMsg("");
			}
		}

		var Sdate = ngmf.extGetHDTime(); // ExtGetHDTime() ==> 웹스퀘어에서는 현재 구현불가
		var StartTime = ngmf.timeM();
		StartTime = ngmf.trim(StartTime);
		strUrl = ngmf.preTrxCall(strUrl);

		var nIdx = GLV.G_iTrxCurIdx;
		var tmpTrxCode = TrxCode;

		TrxCode += "|" + nIdx;
		TrxCode += "|" + Sdate + "&" + ScreenName + "&" + StartTime;

		if (mode == "asynchronous") {
			TrxCode += "|" + InData;
		}

		var callbackFuncNm = "";
		if (typeof CallBackFuncName !== "undefined" && ngmf.isFunction(CallBackFuncName)) {
			callbackFuncNm = ngmf._pushCallbackFunc(CallBackFuncName);
		} else {
			callbackFuncNm = CallBackFuncName;
		}

		var prcMsg = "작업을 처리중입니다.";

		if (ngmv.isUseProgress == false) {
			prcMsg = "";
		}

		/** *********************** 통신하기 시작 ************************ */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : TrxCode,
			"ref" : 'data:json, [' + reqTempArr.join(",") + ']',
			"target" : 'data:json, [' + resTempArr.join(",") + ']',
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : mode,
			"processMsg" : prcMsg,
			"submitDoneHandler" : function(e) {
				var result = e.responseJSON;
				var params = result.params;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];

					var cd = errorJSON.ErrorCode;
					var msg = errorJSON.ErrorMsg;

					errorCd.push(cd);
					errorMsg.push(msg);

					if (msg.indexOf("^^rs^^") > -1) {
						var msgArr = msg.split("^^rs^^");
						if (cd != msgArr[1]) {
							errorCd.push(msgArr[1]);
						}
					}
				}

				// ngmf._debug(errorCd);
				// ngmf._debug(errorMsg);

				ds.setJSON(appDs.getAllJSON(), true);
				ngmv.errorCode = errorCd;
				ngmv.errorMsg = errorMsg;

				if (mode == "synchronous") {
					ngmf.syncAPMCallBack(tmpTrxCode, ngmv.errorCode, ngmv.errorMsg);
				}

				// 메시지 처리
				ngmf.getArrayTranErrorMsg(ngmv.errorCode, ngmv.errorMsg,
						ngmv_MsgFg, "", nIdx, tmpTrxCode, Sdate, ScreenName,
						StartTime, 0, GLV["__smElapsedTime" + nIdx],
						GLV["__smGlobalId" + nIdx], InData, "SYNC",
						callbackFuncNm);

				$w.deleteSubmission(TrxCode);

			}, // [end] "submitDoneHandler"
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			} // [end] "submitErrorHandler"
		};

		$w.createSubmission(submissionObj); // 서브미션 생성
		$w.executeSubmission(TrxCode); // 서브미션 실행

		/** *********************** 통신하기 끝 ************************ */	
    } catch(e) { 
        ngmf._error("[ngmf.appendData] Exception :: ", e); 
    }
};

/**
 * Service Call (Sync)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} TrxCode :: I :: N :: :: Transaction Code
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} InData :: I :: N :: :: Input DataList
 * @param {String} OutData :: IO :: N :: :: Output DataList
 * @param {String} Result :: I :: Y :: :: CallBack Script
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {String} ngmv_ErrProc :: I :: Y :: :: Error 발생 시 Dataset 설정 Check
 * @param {boolean} encflag :: I :: Y :: false :: 암호호여부
 * @param {String} inPutStr :: I :: Y :: :: 입력문자열
 * @param {String} outPutStr :: I :: Y :: :: 출력문자열
 * @param {boolean} isProcessMsg :: I :: Y :: true :: 프로그레스바 작동여부 * 
 * @return 없음
 * @author js.Lee
 * @update 2016.07.06 ngmf.syncCall 일 경우 callBackFunc 무시
 * @example ngmf.syncCall(TrxCode,ScreenName,"",InDataList,OutDataList, "");
 * @exampleAsIs ngmf_SyncCall(TrxCode,ScreenName,"",InDataList,OutDataList, "");
 * @sampleLink grd_detailView
 */
ngmf.syncCall = function(trxCode, screenName, arg, inData, outData,
		callBackFunc, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr, outPutStr, isProcessMsg) {
	ngmf.transaction("synchronous", trxCode, screenName, arg, inData, outData,
			callBackFunc, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr,outPutStr, isProcessMsg);
};

/**
 * Sync CallBACK - APM연동
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {String} TrID :: I :: N :: :: TR아이디
 * @param {Array} ErrorCode :: I :: N :: :: 오류코드
 * @param {Array} ErrorMsg :: I :: N :: :: 오류메시지
 * @return 없음
 * @author js.Lee
 * @example ngmf.syncAPMCallBack('ZORDSS0100036_TR1', -1, '메시지');
 * @exampleAsIs Transaction(TrxCode,strUrl,InDataList, OutDataList, arg, "ngmf_SyncAPMCallBack");
 */
ngmf.syncAPMCallBack = function(TrID, ErrorCode, ErrorMsg) {
	try {
		if (GLV.G_bProcessLogJob) {
			var arrTrId = TrID.split("|");
			// arrTrId[0] : TRX
			// arrTrId[1] : 로긴 및 로칼 에러 메시지 구성을 위해 Seq 구분
			// arrTrId[2] : 로긴 데이타
			var logstr = arrTrId[2].split("&");
			var SvcTime = eval("GLV.__smElapsedTime" + arrTrId[1]);
			ngmf.apmWrite(arrTrId[0], arrTrId[1], logstr[0], logstr[1], logstr[2],
					SvcTime, eval("GLV.__smGlobalId" + arrTrId[1]));
		}
    } catch(e) { 
        ngmf._error("[ngmf.syncAPMCallBack] Exception :: ", e); 
    }
};

/*
 * Service Call (Async)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} trxCode :: I :: N :: :: Transaction Code
 * @param {String} screenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} inData :: I :: N :: :: Input DataList
 * @param {String} outData :: IO :: N :: :: Output DataList
 * @param {String} callBackFunc :: I :: Y :: :: CallBack Script
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {String} ngmv_ErrProc :: I :: Y :: false :: Error 발생 시 Dataset 설정 Check
 * @param {boolean} encflag :: I :: Y :: false :: 암호호여부
 * @param {String} inPutStr :: I :: Y :: :: 입력문자열
 * @param {String} outPutStr :: I :: Y :: :: 출력문자열
 * @param {boolean} isProcessMsg :: I :: Y :: true :: 프로그레스바 작동여부
 * @return 없음
 * @author js.Lee
 * @example ngmf.promise.asyncCall(TrxCode,ScreenName,"",InDataList,OutDataList, "scwin.callback");
 * @exampleAsIs ngmf_AsyncCall(TrxCode,ScreenName,"",InDataList,OutDataList,"CallBack");
 * @sampleLink scm_svcCallBasic
 */
ngmf.asyncCall = function() {
	ngmf.alert("[16.07.15]ngmf.asyncCall 함수는 삭제함수로 ngmf.promise.asyncCall를 사용하시기 바랍니다.");
};
ngmf.__asyncCall = function(trxCode, screenName, arg, inData, outData,
		callBackFunc, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr, outPutStr,
		isProcessMsg) {

	ngmf.transaction("asynchronous", trxCode, screenName, arg, inData, outData,
			callBackFunc, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr,
			outPutStr, isProcessMsg);
};

/**
 * Service Call (Sync) - CoM Module 사용(타모듈)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} TrxCode :: I :: N :: :: Transaction Code
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} InData :: I :: N :: :: Input DataList
 * @param {String} OutData :: IO :: N :: :: Output DataList
 * @param {String} Result :: I :: Y :: :: CallBack Script
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @return 없음
 * @author js.Lee
 * @example ngmf.syncCOMCall(TrxCode,ScreenName,"",InDataList,OutDataList,"","SELF");
 * @exampleAsIs ngmf_SyncComCall(TrxCode,ScreenName,"",InDataList,OutDataList,"","SELF");
 */
ngmf.syncCOMCall = function(TrxCode, ScreenName, arg, InData, OutData, Result, ngmv_MsgFg) {
	try {

		if (GLV.G_CLOSEFG == "6") {
			return;
		}

		ngmf.bizTrSettingStop(TrxCode);

		var wFrameArray = ScreenName.split("::");
		var wFrameId = "";

		if (wFrameArray.length > 1) {
			ScreenName = ngmf.apmScreenName(wFrameArray[0]);
			wFrameId = wFrameArray[1];
		} else {
			ScreenName = ngmf.apmScreenName(ScreenName);
		}

		var InParam = InData.split(",");
		var outParam = OutData.split(",");
		var InCnt = InParam.length;
		var OutCnt = outParam.length;

		var InDataList = new Array();
		var OutDataList = new Array();

		// ref 작성
		for ( var i = 0; i < InCnt; i++) {
			var pId = ngmf.trim(InParam[i]);
			var pKey = "InDS" + i;

			if (wFrameId.length > 0) {
				pId = wFrameId + "_" + pId;
			}

			InDataList.push("{'id':'" + pId + "', 'key':'" + pKey + "'}");
		}

		// target 작성
		for ( var i = 0; i < OutCnt; i++) {
			var pId = ngmf.trim(outParam[i]);
			var pKey = "OutDS" + i;

			if (wFrameId.length > 0) {
				pId = wFrameId + "_" + pId;
			}

			OutDataList.push("{'id':'" + pId + "', 'key':'" + pKey + "'}");
		}

		// action 작성

		var strUrl = "";
		var mJSON = GLD.DataGroup.getMatchedJSON("Prefix", "COM");

		if (mJSON.length > 0) {
			// http://stellentd.sktelecom.com:9091/servlets/
			// AS-IS :
			// ngm.cms.com.ZCOMJSMU00020?LogLvlGbn=&G_BizCd=&G_Biz_Start_Time=&__smReqSeq=1
			// TO-BE :
			// ngm.cms.com.ZCOMJSMU00020?&LogLvlGbn=&G_BizCd=null&G_Biz_Start_Time=null&__smReqSeq=1
			strUrl = mJSON[0].Baseurl;
			strUrl += TrxCode + "?" + arg;
			strUrl = ngmf.preTrxCall(strUrl);
			ngmf.setSystemMsg("");
		}

		var nIdx = GLV.G_iTrxCurIdx;
		var prcMsg = "작업을 처리중입니다.";

		if (ngmv.isUseProgress == false) {
			prcMsg = "";
		}
		/** *********************** 통신하기 시작 ************************ */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : TrxCode,
			"ref" : "data:json, [" + InDataList.join(',') + "]",
			"target" : "data:json, [" + OutDataList.join(',') + "]",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : "synchronous",
			"processMsg" : prcMsg,
			"submitDoneHandler" : function(e) {

				var result = e.responseJSON;
				var params = result.params;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					errorCd.push(errorJSON.ErrorCode);
					errorMsg.push(errorJSON.ErrorMsg);
				}

				ngmv.errorCode = errorCd;
				ngmv.errorMsg = errorMsg;

				ngmf.getArrayTranErrorMsg(ngmv.errorCode, ngmv.errorMsg, ngmv_MsgFg, "", nIdx, "", "", "", "", "", "", "", InData, "SYNC");

				$w.deleteSubmission(TrxCode);

			}, // [end] "submitDoneHandler"
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			} // [end] "submitErrorHandler"
		};

		$w.createSubmission(submissionObj); // 서브미션 생성
		$w.executeSubmission(TrxCode); // 서브미션 실행
		/** *********************** 통신하기 종료 ************************ */	
	} catch(e) { 
	    ngmf._error("[ngmf.syncAPMCallBack] Exception :: ", e); 
	}
};

/**
 * Service Call (Async) - CoM Module 사용(타모듈)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} TrxCode :: I :: N :: :: Transaction Code
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} InData :: I :: N :: :: Input DataList
 * @param {String} OutData :: IO :: N :: :: Output DataList
 * @param {String} Result :: I :: Y :: :: CallBack Script
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @return 없음
 * @author js.Lee
 * @example ngmf.asyncCOMCall(TrxCode, ScreenName, "", InDataList, OutDatalist, "scwin.result");
 * @exampleAsIs ngmf_AsyncCOMCall(TrxCode, gs_ScreenName, "", InDataList, OutDataList, "");
 */
ngmf.asyncCOMCall = function(TrxCode, ScreenName, arg, InData, OutData, Result, ngmv_MsgFg) {
	try {


		if (GLV.G_CLOSEFG == "6") {
			return;
		}

		ngmf.bizTrSettingStop(TrxCode);

		var wFrameArray = ScreenName.split("::");
		var wFrameId = "";

		if (wFrameArray.length > 1) {
			ScreenName = ngmf.apmScreenName(wFrameArray[0]);
			wFrameId = wFrameArray[1];
		} else {
			ScreenName = ngmf.apmScreenName(ScreenName);
		}

		if (wFrameId.length > 0) {
			Result = wFrameId + "_" + Result;
		}

		var InParam = InData.split(",");
		var outParam = OutData.split(",");
		var InCnt = InParam.length;
		var OutCnt = outParam.length;

		var InDataList = new Array();
		var OutDataList = new Array();

		// ref 작성
		for ( var i = 0; i < InCnt; i++) {
			var pId = ngmf.trim(Inparam[i]);
			var pKey = "InDS" + i;

			if (wFrameId.length > 0) {
				pId = wFrameId + "_" + pId;
			}

			InDataList.push("{'id':'" + pId + "', 'key':'" + pKey + "'}");
		}

		// target 작성
		for ( var i = 0; i < OutCnt; i++) {
			var pId = ngmf.trim(Inparam[i]);
			var pKey = "OutDS" + i;

			if (wFrameId.length > 0) {
				pId = wFrameId + "_" + pId;
			}

			OutDataList.push("{'id':'" + pId + "', 'key':'" + pKey + "'}");
		}

		// action 작성
		var strUrl = "";
		var mJSON = GLD.DataGroup.getMatchedJSON("Prefix", "COM");
		if (mJSON.length > 0) {
			// http://stellentd.sktelecom.com:9091/servlets/
			// AS-IS :
			// ngm.cms.com.ZCOMJSMU00020?LogLvlGbn=&G_BizCd=&G_Biz_Start_Time=&__smReqSeq=1
			// TO-BE :
			// ngm.cms.com.ZCOMJSMU00020?&LogLvlGbn=&G_BizCd=null&G_Biz_Start_Time=null&__smReqSeq=1
			strUrl = mJSON[0].Baseurl;
			strUrl += TrxCode + "?" + arg;

		}

		if (ngmf.length(ngmv_MsgFg) == 0) {
			ngmv_MsgFg = "NONE";
		}

		TrxCode = ngmf.trim(TrxCode) + "|" + ngmf.trim(Result) + "|" + ngmf.trim(ngmv_MsgFg);
		ngmf.setSystemMsg("");
		strUrl = ngmf.preTrxCall(strUrl);

		var nIdx = GLV.G_iTrxCurIdx;
		TrxCode += "|";
		TrxCode += "|" + nIdx;
		TrxCode += "|" + "&&";
		TrxCode += "|" + InData;

		var inputStr = "";
		var outputStr = "";

		if (InDataList.length > 0) {
			inputStr = InDataList.join(',');
		}

		if (InDataList.length > 0) {
			outputStr = OutDataList.join(',');
		}

		var prcMsg = "작업을 처리중입니다.";

		if (ngmv.isUseProgress == false) {
			prcMsg = "";
		}

		/** *********************** 통신하기 시작 ************************ */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : TrxCode,
			"ref" : "data:json, [" + inputStr + "]",
			"target" : "data:json, [" + outputStr + "]",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : "asynchronous",
			"processMsg" : prcMsg,
			"submitDoneHandler" : function(e) {

				var result = e.responseJSON;
				var params = result.params;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					errorCd.push(errorJSON.ErrorCode);
					errorMsg.push(errorJSON.ErrorMsg);
				}

				ngmv.errorCode = errorCd;
				ngmv.errorMsg = errorMsg;

				ngmf.result(TrxCode, ngmv.errorCode, ngmv.errorMsg);
				$w.deleteSubmission(TrxCode);

			}, // [end] "submitDoneHandler"
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			} // [end] "submitErrorHandler"
		};

		$w.createSubmission(submissionObj); // 서브미션 생성
		$w.executeSubmission(TrxCode); // 서브미션 실행
		/** *********************** 통신하기 종료 ************************ */
	} catch(e) { 
	    ngmf._error("[ngmf.syncAPMCallBack] Exception :: ", e); 
	}
};

/**
 * Combo Service Call (Sync) - 공통 Table (Max - 10) 영문 data
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} strInputObjList :: I :: N :: :: Input Dataset List
 * @param {String} outputList :: IO :: N :: :: Output Dataset List
 * @param {String} comboIdList :: IO :: Y :: :: Combo Object List
 * @param {String} callBackFunc :: I :: Y :: :: CallBack Script
 * @param {String} filterList :: I :: Y :: :: Data filter 조건 정의
 * @param {String} AddRowName :: I :: Y :: :: Data Row 추가 설정
 * @param {String} AddRowPos :: I :: Y :: :: 추가 Row Position 설정
 * @param {String} SortList :: I :: Y :: :: Sort 항목 정의
 * @param {String} SortOrdList :: I :: Y :: :: Sort Type 정의(Asc:A/Desc:D)
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {Boolean} strSyncFlag :: I :: Y :: true :: Sync(true) [default : true](확정)
 * @param {String} newTrxCode :: I :: Y :: :: 새로운 Transaction Code
 * @return 없음
 * @author js.Lee
 * @example 
 * 			ngmf.comboEng("ZCAMSSCR00010", inputObjList, outList,
 *          comboIDList, <br/> "scwin.comboCallback", filterList,
 *          AddRowNameList, AddRowPosList);
 * @exampleAsIs ngmf_ComboEng(ScreenName,vInput,vOutput, "", "f_AftCombo1");
 */
ngmf.comboEng = function(ScreenName, strInputObjList, outputList, comboIdList,
		callBackFunc, filterList, AddRowName, AddRowPos, SortList, SortOrdList,
		ngmv_MsgFg, strSyncFlag) {
	ngmf.combo(ScreenName, strInputObjList, outputList, comboIdList,
			callBackFunc, filterList, AddRowName, AddRowPos, SortList,
			SortOrdList, ngmv_MsgFg, true, "ZNGMSCOD00010_TR03");
};

ngmf.__comboEng = function(ScreenName, strInputObjList, outputList, comboIdList,
		callBackFunc, filterList, AddRowName, AddRowPos, SortList, SortOrdList,
		ngmv_MsgFg, strSyncFlag) {
	ngmf.__combo(ScreenName, strInputObjList, outputList, comboIdList,
			callBackFunc, filterList, AddRowName, AddRowPos, SortList,
			SortOrdList, ngmv_MsgFg, false, "ZNGMSCOD00010_TR03");
};

/**
 * Combo Service Call (Sync) - 공통 Table (Max - 10)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} strInputObjList :: I :: N :: :: Input Dataset List
 * @param {String} outputList :: IO :: N :: :: Output Dataset List
 * @param {String} comboIdList :: IO :: Y :: :: Combo Object List
 * @param {String} callBackFunc :: I :: Y :: :: CallBack Script
 * @param {String} filterList :: I :: Y :: :: Data filter 조건 정의
 * @param {String} AddRowName :: I :: Y :: :: Data Row 추가 설정
 * @param {String} AddRowPos :: I :: Y :: :: 추가 Row Position 설정
 * @param {String} SortList :: I :: Y :: :: Sort 항목 정의
 * @param {String} SortOrdList :: I :: Y :: :: Sort Type 정의(Asc:A/Desc:D)
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {Boolean} strSyncFlag :: I :: Y :: true :: Sync(true) [default : true](확정)
 * @param {String} newTrxCode :: I :: Y :: :: 새로운 Transaction Code
 * @return 없음
 * @sampleLink scm_svcCallBasic
 * @author js.Lee
 * @example ngmf.combo( <br/> "ZCAMSSCR00010", inputObjList, outList,
 *          comboIDList, <br/> "scwin.comboCallback", filterList,
 *          AddRowNameList, AddRowPosList <br/> );
 * @exampleAsIs ngmf_Combo(ScreenName,vInput,vOutput, "", "f_AftCombo1");
 */
ngmf.combo = function(ScreenName, strInputObjList, outputList, comboIdList,
		callBackFunc, filterList, AddRowName, AddRowPos, SortList, SortOrdList,
		ngmv_MsgFg, strSyncFlag, newTrxCode) {
	var comboType = "1";
	ngmf.comboTransaction(comboType, ScreenName, strInputObjList, outputList,
			comboIdList, callBackFunc, filterList, AddRowName, AddRowPos,
			SortList, SortOrdList, ngmv_MsgFg, true, newTrxCode);
};

ngmf.__combo = function(ScreenName, strInputObjList, outputList, comboIdList,
		callBackFunc, filterList, AddRowName, AddRowPos, SortList, SortOrdList,
		ngmv_MsgFg, strSyncFlag, newTrxCode) {
	var comboType = "1";
	ngmf.comboTransaction(comboType, ScreenName, strInputObjList, outputList,
			comboIdList, callBackFunc, filterList, AddRowName, AddRowPos,
			SortList, SortOrdList, ngmv_MsgFg, false, newTrxCode);
};


/**

/**
 * Combo Service Call (Sync) - 공통 Table (Max - 10)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} strInputObjList :: I :: N :: :: Input Dataset List
 * @param {String} outputList :: IO :: N :: :: Output Dataset List
 * @param {String} comboIdList :: IO :: N :: :: Combo Object List
 * @param {String} callBackFunc :: I :: Y :: :: CallBack Script
 * @param {String} filterList :: I :: Y :: :: Data filter 조건 정의
 * @param {String} AddRowName :: I :: Y :: :: Data Row 추가 설정
 * @param {String} AddRowPos :: I :: Y :: :: 추가 Row Position 설정
 * @param {String} SortList :: I :: Y :: :: Sort 항목 정의
 * @param {String} SortOrdList :: I :: Y :: :: Sort Type 정의(Asc:A/Desc:D)
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {Boolean} strSyncFlag :: I :: Y :: true :: Sync(true) [default : true](확정)
 * @param {String} newTrxCode :: I :: Y :: :: 새로운 Transaction Code
 * @return 없음
 * @author js.Lee
 * @example ngmf.combo2( <br/> "ZCAMSSCR00010", inputObjList, outList,
 *          comboIDList, <br/> "scwin.comboCallback", filterList,
 *          AddRowNameList, AddRowPosList <br/> );
 * @exampleAsIs ngmf_Combo2(ScreenName,vInput,vOutput, "", "f_AftCombo1");
 */
ngmf.combo2 = function(ScreenName, strInputObjList, outputList, comboIdList,
		callBackFunc, filterList, AddRowName, AddRowPos, SortList, SortOrdList,
		ngmv_MsgFg, strSyncFlag, newTrxCode) {
	var comboType = "2";
	ngmf.comboTransaction(comboType, ScreenName, strInputObjList, outputList,
			comboIdList, callBackFunc, filterList, AddRowName, AddRowPos,
			SortList, SortOrdList, ngmv_MsgFg, true, newTrxCode);

};

ngmf.__combo2 = function(ScreenName, strInputObjList, outputList, comboIdList,
		callBackFunc, filterList, AddRowName, AddRowPos, SortList, SortOrdList,
		ngmv_MsgFg, strSyncFlag, newTrxCode) {
	var comboType = "2";
	ngmf.comboTransaction(comboType, ScreenName, strInputObjList, outputList,
			comboIdList, callBackFunc, filterList, AddRowName, AddRowPos,
			SortList, SortOrdList, ngmv_MsgFg, false, newTrxCode);

};

/**
 * Combo Sync CallBACK - APM연동
 * 
 * @date 2015.10.01
 * @memberOf ngmf
 * @param {Array} TrID :: I :: N :: :: Transaction Result 정보
 * @param {Array} nErrorCode :: I :: Y :: :: 에러코드
 * @param {Array} nErrorMsg :: I :: Y :: :: 에러메시지
 * @return 없음
 * @author js.Lee
 * @example ngmf.comboSyncAPMCallBack(TrxCode, ngmv.errorCode, ngmv.errorMsg);
 * @exampleAsIs ngmf_ComboSyncAPMCallBack(TrID,ErrorCode,ErrorMsg);
 */
ngmf.comboSyncAPMCallBack = function(trxCodeArr, ErrorCode, ErrorMsg) {
	try {
		if (GLV.G_bProcessLogJob) {
			var arrTrId = trxCodeArr;
			// arrTrId[0] : txid
			// arrTrId[1] : callback function
			// arrTrId[2] : msg auto
			// arrTrId[3] : outlist
			// arrTrId[4] : inlist
			// arrTrId[5] : filter
			// arrTrId[6] : addcol
			// arrTrId[7] : addcol position
			// arrTrId[8] : sort column
			// arrTrId[9] : addcol position
			// arrTrId[10] : 로긴 및 로칼 에러 메시지 구성을 위해 Seq 구분
			// arrTrId[11] : 로긴 Data
			// arrTrId[12] : LOG용 INPUT
			// arrTrId[13] : SYNC 여부
			// arrTrId[14] : 유효 여부
			var logstr = arrTrId[11].split("&");
			var SvcTime = GLV["__smElapsedTime" + arrTrId[10]];
			ngmf.apmWrite(arrTrId[0], arrTrId[10], logstr[0], logstr[1], logstr[2], SvcTime, GLV["__smGlobalId" + arrTrId[10]]);
		}
	} catch(e) { 
	    ngmf._error("[ngmf.comboSyncAPMCallBack] Exception :: ", e); 
	}
};

/**
 * Combo Sync CallBACK - APM연동
 * 
 * @date 2015.10.01
 * @memberOf ngmf
 * @param {String} TrID :: I :: N :: :: Transaction ID
 * @param {Array} nErrorCode :: I :: N :: :: 에러코드
 * @param {Array} nErrorMsg :: I :: N :: :: 에러메시지
 * @param {Array} trxCodeArr :: I :: N :: :: Transaction Result 정보
 * @return 없음
 * @author js.Lee
 * @example ngmf.resultCombo(TrxCode, ngmv.errorCode, ngmv.errorMsg, trxCodeArr);
 * @exampleAsIs Transaction(TrxCode,strUrl,"HEAD=GDS_INHEAD input1=GDS_INCOMBO",outDataList,"","ngmf_Result_Combo");
 */
ngmf.resultCombo = function(TrID, nErrorCode, nErrorMsg, trxCodeArr) {
	try { 
		var SvcTime = null;
		var logstr = null;

		// trxCodeArr[0] : txid
		// trxCodeArr[1] : callback function
		// trxCodeArr[2] : msg auto
		// trxCodeArr[3] : outlist
		// trxCodeArr[4] : inlist
		// trxCodeArr[5] : filter
		// trxCodeArr[6] : addcol
		// trxCodeArr[7] : addcol position
		// trxCodeArr[8] : sort column
		// trxCodeArr[9] : addcol position
		// trxCodeArr[10] : 로긴 및 로칼 에러 메시지 구성을 위해 Seq 구분
		// trxCodeArr[11] : 로긴 Data
		// trxCodeArr[12] : LOG용 INPUT
		// trxCodeArr[13] : SYNC 여부
		// trxCodeArr[14] : 유효 여부
		// trxCodeArr[15] : WframeId

		var arrTrId = trxCodeArr;
		var wFrameId = "";
		if (arrTrId.length > 15) wFrameId = arrTrId[15];

		if (GLV.G_bProcessLogJob) {
			SvcTime = GLV ["__smElapsedTime" + arrTrId[10]];
		}

		// 02.02
		if (Number(nErrorCode) < -10000) {
			arrTrId[2] = "";
		}

		if (typeof arrTrId[11] !== "undefined") {
			logstr = arrTrId[11].split("&");
		}

		ngmf.getArrayTranErrorMsg(nErrorCode, nErrorMsg, arrTrId[2], "",
				parseInt(arrTrId[10]), arrTrId[0], logstr[0], logstr[1], logstr[2],
				0, SvcTime, GLV["__smGlobalId" + arrTrId[10]], arrTrId[12],
				arrTrId[13]);

		var outList = arrTrId[3].split(",");
		var resInputList = arrTrId[4].split(",");
		var resFilterList = arrTrId[5].split(",");
		var resAddColList = arrTrId[6].split(",");
		var resAddColPosList = arrTrId[7].split(",");
		var resSortList = arrTrId[8].split(",");
		var resSortOrdList = arrTrId[9].split(",");
		var nDataCnt = ngmf.length(outList); // Output Dataset 갯수
		var objNm;
		var i, j;
		var isRow = -1;

		GLD.GDS_COMMONCOMBO.removeColumnFilterAll();

		for (i = 0; i < nDataCnt; i++) { // eff_flag는 output Dataset으로 구성하지 않는다

			objNm = ngmf.object(outList[i]);

			// 2010.05.14 OPMD 프로젝트팀 요청 M 항목 삭제 처리
			if (resInputList[i] == "ZORD_C_SVCCD") {
				var tmp_rtn = null;

				for ( var rowIdx = 0; rowIdx < objNm.getRowCount(); rowIdx++) {

					var commCdId = objNm.getCellData(rowIdx, "comm_cd_id");
					var commCdVal = objNm.getCellData(rowIdx, "comm_cd_val");

					if (commCdId == 'ZORD_C_SVCCD' && commCdVal == 'M') {
						tmp_rtn = rowIdx;
					}
				}

				if (tmp_rtn > -1) {
					objNm.deleteRow(tmp_rtn);
				}
			}

			// --- Combo Cache 처리 ---------------------------------
			// 조회된 공통코드가 존재하면
			if (objNm.getRowCount() > 0) {

				if (ngmf.trim(resInputList[i]).length > 0) {

					// Column 구성 복사
					if (GLD.GDS_COMMONCOMBO.getRowCount() == 0) {
						
						ngmf.copy(GLD.GDS_COMMONCOMBO, objNm);

						ngmf.insertColumn(GLD.GDS_COMMONCOMBO, "trxcode", {
							'name' : "trxcode",
							'dataType' : "text"
						});

						ngmf.insertColumn(GLD.GDS_COMMONCOMBO, "csv_flag", {
							'name' : "csv_flag",
							'dataType' : "text"
						});

						for (j = 0; j < GLD.GDS_COMMONCOMBO.getRowCount(); j++) {
							GLD.GDS_COMMONCOMBO.setCellData(j, "trxcode", arrTrId[0]);
						}
 
						if (typeof arrTrId[14] !== "undefined" && arrTrId[14] == "Y") {

							ngmf.clear(objNm);
							var extGetHDTime = ngmf.extGetHDTime();
							var condition = "comm_cd_id == '" + resInputList[i] + "'" 
									+ " && trxcode == '" + arrTrId[0] + "'"
									+ " && eff_sta_dt <= '" + extGetHDTime + "'"
									+ " && eff_end_dt >= '" + extGetHDTime + "'";
							ngmf.filter(GLD.GDS_COMMONCOMBO, condition);
							var filteredJSON = GLD.GDS_COMMONCOMBO.getAllFilteredJSON();

							if (filteredJSON.length > 0) {
								objNm.setJSON(filteredJSON);
							} else {
								objNm.setJSON(GLD.GDS_COMMONCOMBO.getAllJSON());
							}

							GLD.GDS_COMMONCOMBO.removeColumnFilterAll();
						}
 
					} else {

						var matchedIndexArr = GLD.GDS_COMMONCOMBO.getMatchedIndex("comm_cd_id", resInputList[i], true);
						var matchedIndex = -1;

						for ( var idx = 0; idx < matchedIndexArr.length; idx++) {
							matchedIndex = matchedIndexArr[idx];
							var matchTrxcode = GLD.GDS_COMMONCOMBO.getCellData( matchedIndex, "trxcode");
							if (matchTrxcode == arrTrId[0]) {
								isRow = matchedIndex;
							}
						}						
						
						if ( isRow < 0) {

							for (j = 0; j < objNm.getRowCount(); j++) {
								var insertRow = GLD.GDS_COMMONCOMBO.insertRow();
								GLD.GDS_COMMONCOMBO.setRowJSON(insertRow, objNm.getRowJSON(j), true);
								GLD.GDS_COMMONCOMBO.setCellData(insertRow, "trxcode", arrTrId[0]);
							}

							if (typeof arrTrId[14] !== "undefined" && arrTrId[14] == "Y") {
								ngmf.clear(objNm);
								var extGetHDTime = ngmf.extGetHDTime();
								var condition = "comm_cd_id == '" + resInputList[i] + "'" 
										+ " && trxcode == '" + arrTrId[0] + "'" 
										+ " && eff_sta_dt <= '" + extGetHDTime + "'" 
										+ " && eff_end_dt >= '" + extGetHDTime + "'";
								ngmf.filter(GLD.GDS_COMMONCOMBO, condition);
								var filteredJSON = GLD.GDS_COMMONCOMBO.getAllFilteredJSON();

								$.each(GLD.GDS_COMMONCOMBO.getRowJSON(0), function( key, val) {
									var options = {
										name : key,
										dataType : "text"
									};
									if (key == "prt_seq") options["dataType"] = "number";
									ngmf.insertColumn( objNm, key, options);
								});

								if (filteredJSON.length > 0) {
									objNm.setJSON(filteredJSON);
								} else {
									objNm.setJSON(GLD.GDS_COMMONCOMBO.getAllJSON());
								}
								GLD.GDS_COMMONCOMBO.removeColumnFilterAll();

							}
						}
					}
				}
			}

			// ----------------------------------------------------------
			// filtering
			if (ngmf.length(resFilterList[i]) > 0) {
				if (ngmf.length(resAddColList[i]) > 0) {
					ngmf.filter(objNm, "(" + resFilterList[i] + ") || comm_cd_val == '*'");
				} else {
					ngmf.filter(objNm, resFilterList[i]);
				}
			}

			// Sort
			if (ngmf.length(resSortOrdList[i]) > 0) {
				var sortOrd = resSortOrdList[i].toUpperCase();
				if (sortOrd == "A") {
					objNm.sort(resSortList[i], 0); // 오름차순
				} else if (sortOrd == "D") {
					objNm.sort(resSortList[i], 1); // 내림차순
				}
			}

			// row add (전체/선택등 요청 Row추가)
			if (ngmf.length(resAddColList[i]) > 0) {
				// add position
				if (ngmf.trim(resAddColPosList[i].toUpperCase()) == "F") {
					objNm.insertRow(0);
					objNm.setCellData(0, "comm_cd_val", "*");
					objNm.setCellData(0, "comm_cd_val_nm", resAddColList[i]);
				} else {
					var row = objNm.insertRow();
					objNm.setCellData(row, "comm_cd_val", "*");
					objNm.setCellData(row, "comm_cd_val_nm", resAddColList[i]);
				}
			}
			
		}

		if (ngmf.length(ngmf.trim(arrTrId[1])) == 0) {
			return;
		} else {
			trID = arrTrId[0];
			var callBackFunc = arrTrId[1];
			if (ngmf.isFunction(callBackFunc)) {
				callBackFunc(trID, nErrorCode, nErrorMsg);
			} else if (typeof callBackFunc == "string") {
				if(typeof window[callBackFunc] == "function") window[callBackFunc](trID, nErrorCode, nErrorMsg);
				else eval(callBackFunc + "(trID, nErrorCode, nErrorMsg)");
			} 
		}	
	} catch(e) { 
	    ngmf._error("[ngmf.resultCombo] Exception :: ", e); 
	}
};


ngmf.resultComboOld = function(TrID, nErrorCode, nErrorMsg, trxCodeArr) {
	try { 
		var SvcTime = null;
		var logstr = null;

		// arrTrId[0] : txid
		// arrTrId[1] : callback function
		// arrTrId[2] : msg auto
		// arrTrId[3] : outlist
		// arrTrId[4] : inlist
		// arrTrId[5] : filter
		// arrTrId[6] : addcol
		// arrTrId[7] : addcol position
		// arrTrId[8] : sort column
		// arrTrId[9] : addcol position
		// arrTrId[10] : 로긴 및 로칼 에러 메시지 구성을 위해 Seq 구분
		// arrTrId[11] : 로긴 Data
		// arrTrId[12] : LOG용 INPUT
		// arrTrId[13] : SYNC 여부
		// arrTrId[14] : 유효 여부

		var arrTrId = trxCodeArr;

		if (GLV.G_bProcessLogJob) {
			SvcTime = GLV ["__smElapsedTime" + arrTrId[10]];
		}

		// 02.02
		if (Number(nErrorCode) < -10000) {
			arrTrId[2] = "";
		}

		if (typeof arrTrId[11] !== "undefined") {
			logstr = arrTrId[11].split("&");
		}

		ngmf.getArrayTranErrorMsg(nErrorCode, nErrorMsg, arrTrId[2], "",
				parseInt(arrTrId[10]), arrTrId[0], logstr[0], logstr[1], logstr[2],
				0, SvcTime, GLV["__smGlobalId" + arrTrId[10]], arrTrId[12],
				arrTrId[13]);

		var outList = arrTrId[3].split(",");
		var resInputList = arrTrId[4].split(",");
		var resFilterList = arrTrId[5].split(",");
		var resAddColList = arrTrId[6].split(",");
		var resAddColPosList = arrTrId[7].split(",");
		var resSortList = arrTrId[8].split(",");
		var resSortOrdList = arrTrId[9].split(",");
		var nDataCnt = ngmf.length(outList); // Output Dataset 갯수
		var objNm;
		var i, j;
		var isRow = null;

		GLD.GDS_COMMONCOMBO.removeColumnFilterAll();

		for (i = 0; i < nDataCnt; i++) { // eff_flag는 output Dataset으로 구성하지 않는다

			objNm = ngmf.object(outList[i]);

			// 2010.05.14 OPMD 프로젝트팀 요청 M 항목 삭제 처리
			if (resInputList[i] == "ZORD_C_SVCCD") {
				var tmp_rtn = null;

				for ( var rowIdx = 0; rowIdx < objNm.getRowCount(); rowIdx++) {

					var commCdId = objNm.getCellData(rowIdx, "comm_cd_id");
					var commCdVal = objNm.getCellData(rowIdx, "comm_cd_val");

					if (commCdId == 'ZORD_C_SVCCD' && commCdVal == 'M') {
						tmp_rtn = rowIdx;
					}
				}

				if (tmp_rtn > -1) {
					objNm.deleteRow(tmp_rtn);
				}
			}

			// --- Combo Cache 처리 ---------------------------------
			// 조회된 공통코드가 존재하면
			if (objNm.getRowCount() > 0) {

				if (ngmf.trim(resInputList[i]).length > 0) {

					// Column 구성 복사
					if (GLD.GDS_COMMONCOMBO.getRowCount() == 0) {
						ngmf.copy(GLD.GDS_COMMONCOMBO, objNm);

						ngmf.insertColumn(GLD.GDS_COMMONCOMBO, "trxcode", {
							'name' : "trxcode",
							'dataType' : "text"
						});

						ngmf.insertColumn(GLD.GDS_COMMONCOMBO, "csv_flag", {
							'name' : "csv_flag",
							'dataType' : "text"
						});

						for (j = 0; j < GLD.GDS_COMMONCOMBO.getRowCount(); j++) {
							GLD.GDS_COMMONCOMBO.setCellData(j, "trxcode", arrTrId[0]);
						}

						if (typeof arrTrId[14] !== "undefined" && arrTrId[14] == "Y") {

							ngmf.clear(objNm);
							var extGetHDTime = ngmf.extGetHDTime();
							var condition = "comm_cd_id == '" + resInputList[i]
									+ "'" + " && trxcode == '" + arrTrId[0] + "'"
									+ " && eff_sta_dt <= '" + extGetHDTime + "'"
									+ " && eff_end_dt >= '" + extGetHDTime + "'";
							ngmf.filter(GLD.GDS_COMMONCOMBO, condition);
							var filteredJSON = GLD.GDS_COMMONCOMBO.getAllFilteredJSON();
							/*	
							$.each(GLD.GDS_COMMONCOMBO.getRowJSON(0), function(key, val) {
								ngmf.insertColumn(GLD.GDS_COMMONCOMBO, key, {
									'name' : "trxcode",
									'dataType' : "text"
								});

							});
							*/
							if (filteredJSON.length > 0) {
								objNm.setJSON(filteredJSON);
							} else {

								objNm.setJSON(GLD.GDS_COMMONCOMBO.getAllJSON());
							}

							GLD.GDS_COMMONCOMBO.removeColumnFilterAll();
						}

					} else {

						// searchRow
						for (j = 0; j < GLD.GDS_COMMONCOMBO.getRowCount(); j++) {
							var commCdId = GLD.GDS_COMMONCOMBO.getCellData(j, "comm_cd_id");
							var trxcode = GLD.GDS_COMMONCOMBO.getCellData(j, "trxcode");

							if (resInputList[i] == commCdId && arrTrId[0] == trxcode) {
								isRow = j;
								j = GLD.GDS_COMMONCOMBO.getRowCount();
							}
						}

						if (isRow == null || isRow < 0) {

							for (j = 0; j < objNm.getRowCount(); j++) {
								var insertRow = GLD.GDS_COMMONCOMBO.insertRow();
								GLD.GDS_COMMONCOMBO.setRowJSON(insertRow, objNm.getRowJSON(j), true);
								GLD.GDS_COMMONCOMBO.setCellData(insertRow, "trxcode", arrTrId[0]);
							}

							if (typeof arrTrId[14] !== "undefined" && arrTrId[14] == "Y") {
								ngmf.clear(objNm);
								var extGetHDTime = ngmf.extGetHDTime();
								var condition = "comm_cd_id == '" + resInputList[i]
										+ "'" + " && trxcode == '" + arrTrId[0]
										+ "'" + " && eff_sta_dt <= '"
										+ extGetHDTime + "'"
										+ " && eff_end_dt >= '" + extGetHDTime
										+ "'";
								ngmf.filter(GLD.GDS_COMMONCOMBO, condition);
								var filteredJSON = GLD.GDS_COMMONCOMBO.getAllFilteredJSON();

								$.each(GLD.GDS_COMMONCOMBO.getRowJSON(0), function( key, val) {
									var options = {
										name : key,
										dataType : "text"
									};
									if (key == "prt_seq") options["dataType"] = "number";
									ngmf.insertColumn( objNm, key, options);
								});

								if (filteredJSON.length > 0) {
									objNm.setJSON(filteredJSON);
								} else {
									objNm.setJSON(GLD.GDS_COMMONCOMBO.getAllJSON());
								}

								GLD.GDS_COMMONCOMBO.removeColumnFilterAll();

							}
						}
					}
				}
			}

			// ----------------------------------------------------------

			// row add (전체/선택등 요청 Row추가)
			if (ngmf.length(resAddColList[i]) > 0) {
				// add position
				if (ngmf.trim(resAddColPosList[i].toUpperCase()) == "F") {
					objNm.insertRow(0);
					objNm.setCellData(0, "comm_cd_val", "*");
					objNm.setCellData(0, "comm_cd_val_nm", resAddColList[i]);
				} else {
					var row = objNm.insertRow();
					objNm.setCellData(row, "comm_cd_val", "*");
					objNm.setCellData(row, "comm_cd_val_nm", resAddColList[i]);
				}
			}

			// filtering
			if (ngmf.length(resFilterList[i]) > 0) {
				if (ngmf.length(resAddColList[i]) > 0) {
					ngmf.filter(objNm, "(" + resFilterList[i] + ") || comm_cd_val == '*'");
				} else {
					ngmf.filter(objNm, resFilterList[i]);
				}
			}

			// Sort
			if (ngmf.length(resSortOrdList[i]) > 0) {

				var sortOrd = resSortOrdList[i].toUpperCase();

				if (sortOrd == "A") {
					objNm.sort(resSortList[i], 0); // 오름차순
				} else if (sortOrd == "D") {
					objNm.sort(resSortList[i], 1); // 내림차순
				}
			}
		}

		if (ngmf.length(ngmf.trim(arrTrId[1])) == 0) {
			return;
		} else {
			trID = arrTrId[0];
			var callBackFunction = arrTrId[1];
			if (ngmf.isFunction(callBackFunction)) {
				callBackFunction(trID, nErrorCode, nErrorMsg);
			} else {
				eval(callBackFunction + "(trID, nErrorCode, nErrorMsg)");
			}

			/*
			 * if(callBackFunction.indexOf("scwin.") > -1){ callBackFunction =
			 * callBackFunction.replace("scwin.", ""); }
			 * 
			 * var func = window[ngmf.trim(callBackFunction)]; alert(func); if( func !=
			 * undefined && func != "undefined" && func != null && func != ""){ if
			 * (typeof func === "function") { func(trID, nErrorCode, nErrorMsg); }
			 * else { func = eval(func); if (typeof func === "function") {
			 * func(trID, nErrorCode, nErrorMsg); } } }
			 */
		}	
	} catch(e) { 
	    ngmf._error("[ngmf.resultCombo] Exception :: ", e); 
	}
};
/**
 * multi Combo 처리전 dataset check, Combo Object - Code, Data Column 정의
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} resComboIdList :: I :: N :: :: Combo와 InnerDataset List
 * @param {String} wframeId :: I :: Y :: :: wfram 아이디
 * @return 없음
 * @author js.Lee
 * @example ngmf.combo2DSCheck(comboIdList);
 * @exampleAsIs ngmf_Combo2DSCheck(comboIdList);
 */
ngmf.combo2DSCheck = function(resComboIdList, wframeId) {
	try {
		if (typeof wframeId === "undefined") {
			wframeId = "";
		}

		// Combo List COMBO:DS 형식으로 넘어올 경우
		var cbListCnt = resComboIdList.length;
		var strCbList = new Array();
		var objNm = null;

		for ( var i = 0; i < cbListCnt; i++) {

			// Array List에 data가 있는 경우
			if (ngmf.length(resComboIdList[i]) > 0) {

				// COMBO:DS 형식으로 넘어올 경우
				strCbList = resComboIdList[i].split(":");

				if (strCbList.length == 2) {
					var strCbId = strCbList[0]; // selectBox component
					var strDSId = strCbList[1]; // innerDataset

					if (wframeId.length > 0) {
						if (strCbId.indexOf(wframeId) < 0) {
							strCbId = wframeId + "_" + strCbId;
						}

						if (strDSId.indexOf(wframeId) < 0) {
							strDSId = wframeId + "_" + strDSId;
						}
					}

					if (typeof WebSquare.util.getComponentById(strDSId) === "undefined") {
						var colInfoJSON = [ {
							"id" : "comm_cd_val",
							"dataType" : "String",
							"name" : "코드"
						}, {
							"id" : "comm_cd_val_nm",
							"dataType" : "String",
							"name" : "코드명"
						} ];

						var dataCollectionJSON = {
							id : strDSId,
							type : "dataList",
							option : {
								"baseNode" : "list",
								"repeatNode" : "map",
								"saveRemovedData" : "true",
							},
							columnInfo : colInfoJSON
						};

						$w.data.create(dataCollectionJSON);
					}

					if (strCbId.indexOf(".") > 0) {
						var splitStrArr = strCbId.split(".");
						var gridId = splitStrArr[0];
						var colId = splitStrArr[1];
						var grid = ngmf.object(gridId);
						grid.setColumnNodeSet(colId, "data:" + strDSId, "comm_cd_val_nm", "comm_cd_val");
					} else {
						// --- dataset setting ------------------------
						objNm = ngmf.object(strCbId);
						objNm.setNodeSet('data:' + strDSId, 'comm_cd_val_nm', 'comm_cd_val');
					}

				}
				// ngmf._error(objNm.getID());
				// ngmf._error(objNm.getDataListInfo());
			}
		}	
	} catch(e) { 
	    ngmf._error("[ngmf.combo2DSCheck] Exception :: ", e); 
	}
};


/**
 * Dataset을 선언하지 않고 Define하여 생성
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} strInputObjList :: I :: N :: :: Input Dataset List
 * @param {Array} outputList :: I :: N :: :: Output Dataset List
 * @param {String} callBackFunc :: I :: Y :: :: CallBack Script
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {String} strSyncFg :: I :: Y :: :: Sync(true) / Async(false)
 * @param {String} strDB :: I :: Y :: :: DB 구분
 * @param {String} dbioId :: I :: Y :: :: DBIO ID
 * @return 없음
 * @author js.Lee
 * @update 2016.05.04 이동규 result.outData -> result[outData] 수정.
 * @update 2016.07.22 성일호 리턴 결과 상관 없이 out Ds DATA 초기화 시킴.
 * @example ngmf.svcCombo(ScreenName, inputObjList, outputList, callBackFunc);
 * @exampleAsIs ngmf_SVCCombo("ZNGMSMAN00180", inputObjList, outList, "CallBack_SVCCombo");
 * @sampleLink grd_paging
 */
ngmf.svcCombo = function(ScreenName, strInputObjList, outputList, callBackFunc, ngmv_MsgFg, strSyncFg, strDB, dbioId) {
	return ngmf._svcCombo(ScreenName, strInputObjList, outputList, callBackFunc, ngmv_MsgFg, true, strDB, dbioId);
};

ngmf.__svcCombo = function(ScreenName, strInputObjList, outputList, callBackFunc, ngmv_MsgFg, strSyncFg, strDB, dbioId) {
	return ngmf._svcCombo(ScreenName, strInputObjList, outputList, callBackFunc, ngmv_MsgFg, false, strDB, dbioId);
};

ngmf._svcCombo = function(ScreenName, strInputObjList, outputList, callBackFunc, ngmv_MsgFg, strSyncFg, strDB, dbioId) {
	try {
		if (strSyncFg == undefined || strSyncFg == "undefined") {
			strSyncFg = true;
		}
		if (GLV.G_CLOSEFG == "6") {
			return;
		}

		var wFrameArray = ScreenName.split("::");
		var wFrameId = "";

		if (wFrameArray.length > 1) {
			ScreenName = ngmf.apmScreenName(wFrameArray[0]);
			wFrameId = wFrameArray[1];
		} else {
			ScreenName = ngmf.apmScreenName(ScreenName);
		}

		var outList = outputList.split(",");

		if (ngmf.trim(wFrameId).length > 0) {

			for ( var i = 0; i < outList.length; i++) {

				var orgOutList = ngmf.trim(outList[i]);
				outList[i] = wFrameId + "_" + orgOutList;

				if (typeof ngmf.object(outList[i]) === "undefined") {
					outList[i] = orgOutList;
				}
			}

			if (typeof callBackFunc !== "undefined") {

				if (ngmf.isFunction(callBackFunc)) {
					callBackFunc = ngmf._pushCallbackFunc(callBackFunc);
				} else {
					if (callBackFunc != null && callBackFunc != "") {

						var callbackVar = ngmf.trim(callBackFunc);
						callBackFunc = wFrameId + "_" + callbackVar;

						if (typeof eval(callBackFunc) === "undefined") {
							callBackFunc = callbackVar;
						}
					}
				}

			}

		}

		/** ****************DataList 존재여부 체크******************* */

		for ( var i = 0; i < outList.length; i++) {
			var dlID = ngmf.trim(outList[i]);
			if (typeof ngmf.object(dlID) === "undefined") {
				ngmf._error(dlID + " 가 존재하지 않습니다.(ngmf.svcCombo)");
			}
		}

		var nObjCnt = strInputObjList.length; // 조회조건수
		var nDataCnt = outList.length; // Output Dataset 갯수
		var outDataList = new Array();
		var TrxCode = "ZNGMSCOD00010_TR02"; // Transaction Code

		if (strDB == "NGMA") { // 통계
			TrxCode = "ZNGMSCOD00010_TR22";
		} else if (strDB == "NGMC") { // 해지
			TrxCode = "ZNGMSCOD00010_TR12";
		} else if (strDB == "NGMPS") {
			TrxCode = "ZNGMSDBS00040_TR01";
		}

		ngmf.bizTrSettingStop(TrxCode);

		// NGM Header를 생성한다.
		if (ngmf.makeHeadSet(TrxCode, ScreenName) != "OK") {
			if (GLV.G_FORMUSEFG == "M") {
				ngmf.setSystemMsg("헤더 정보를 로드하는데 실패 하였습니다.");
			}
			return;
		}

		ngmf.clear(GLD.GDS_INCOMBO);

		// InDatasets의 Parameter의 Column을 생성한다.
		for ( var i = 0; i < nObjCnt; i++) {
			if (i == 0) {
				GLD.GDS_INCOMBO.insertColumn("map_id", {
					'name' : 'map_id',
					'dataType' : 'text'
				});
			} else {
				var iparm = "iparam" + i;
				GLD.GDS_INCOMBO.insertColumn(iparm, {
					'name' : iparm,
					'dataType' : 'text'
				});
			}
		}

		var aRow = GLD.GDS_INCOMBO.insertRow();
		var nColCnt = GLD.GDS_INCOMBO.cellIdList.length;

		// InDatasets의 Parameter의 Column의 값을 생성한다.
		for ( var i = 0; i < nColCnt; i++) {
			if (i == 0) {
				GLD.GDS_INCOMBO.setCellData(aRow, "map_id", strInputObjList[i]);
			} else {
				GLD.GDS_INCOMBO.setCellData(aRow, "iparam" + i, strInputObjList[i]);
			}
		}

		// OutDatasets을 생성한다.
		for ( var i = 0; i < nDataCnt; i++) {
			var outStr = ngmf.trim(outList[i]);
			var pId = outStr;
			var pKey = "output" + (i + 1);
			outDataList.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
		}

		var strSSO = "commonsvc=0";
		var strUrl; /* ngmf.servicePort("SVC") */
		var tmpTrxCode = TrxCode;
		strUrl = ngmf.SVC_PATH + "/SVC" + "?" + strSSO + "&rtcode=0" + "&map_id="
				+ strInputObjList[0] + "&Trx_code=" + tmpTrxCode + "&ScreenName="
				+ ScreenName + ngmv.fCloseAccount;

		if (ngmf.length(ngmv_MsgFg) == 0) {
			ngmv_MsgFg = "NONE";
		}

		// 오류보고용 INPUT LIST
		var strInlist = null;
		for ( var i = 0; i < nObjCnt; i++) {
			if (i > 0) {
				strInlist += ',';
			}
			strInlist += strInputObjList[i];
		}

		var nIdx;
		var Sdate = ngmf.extGetHDTime(); // ExtGetHDTime() ==> 웹스퀘어에서는 구현불가
		var StartTime;

		StartTime = ngmf.timeM();
		StartTime = ngmf.trim(StartTime);
		strUrl = ngmf.preTrxCall(strUrl);
		nIdx = GLV.G_iTrxCurIdx;
		var mode = "synchronous";

		if (ngmf.isFunction(callBackFunc)) {
			callBackFunc = ngmf._pushCallbackFunc(callBackFunc);
		}

		if (strSyncFg) {
			TrxCode += "|" + nIdx;
			TrxCode += "|" + Sdate + "&" + ScreenName + "&" + StartTime;
			mode = "synchronous";

		} else {
			TrxCode = ngmf.trim(TrxCode) + "|" + ngmf.trim(callBackFunc) + "|"
					+ ngmf.trim(ngmv_MsgFg);
			TrxCode += "|";
			TrxCode += "|" + nIdx;
			TrxCode += "|" + Sdate + "&" + ScreenName + "&" + StartTime;
			TrxCode += "|" + "SVCCOMBO:" + strInlist;
			mode = "asynchronous";

			/* ngmf_Result */
		}

		if ($w.getSubmission(tmpTrxCode) != null) {
			$w.deleteSubmission(tmpTrxCode);
		}

		var prcMsg = "작업을 처리중입니다.";

		if (ngmv.isUseProgress == false) {
			prcMsg = "";
		}

		/** *********************** 통신하기 시작 ************************ */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : tmpTrxCode,
			"ref" : "",
			"target" : "",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : mode,
			"processMsg" : prcMsg,
			"submitDoneHandler" : function(e) {

				var orgTrxCode = TrxCode.split("|");
				var result = e.responseJSON;
				var params = result.params;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					errorCd.push(errorJSON.ErrorCode);
					errorMsg.push(errorJSON.ErrorMsg);
				}

				ngmv.errorCode = errorCd;
				ngmv.errorMsg = errorMsg;

				// 통신성공이면...
				if (Number(errorCd[0]) > -1) {

					// 컬럼자동 생성
					for ( var i = 0; i < outDataList.length; i++) {

						var jsonRow = JSON.parse(outDataList[i]);
						var id = jsonRow.id;
						var key = jsonRow.key;
						var ds = ngmf.object(id);
						var output = result[key];
						
						if (output == undefined || output == "undefined" || output == null || output == "") {
							//data 없을경우 초기화 시킴
							if (ds) ds.removeAll();
							continue;
						}

						// 동적으로 컬럼을 만들어준다.
						if (output.length > 0) {
							ngmf.clear(ds);
							$.each(output[0], function(mapKey, mapValue, mapIdx) {
								var options = {
									name : mapKey,
									dataType : "text"
								};
								ds.insertColumn(mapKey, options);
							});
							ds.setJSON(output, false);
						}
					}
				}

				if (mode == "synchronous") {
					if (!ngmf.isFunction(callBackFunc)) {
						callBackFunc = ngmf.trim(callBackFunc);
					}
					ngmf.getArrayTranErrorMsg(ngmv.errorCode, ngmv.errorMsg,
							ngmv_MsgFg, "", nIdx, orgTrxCode[0], Sdate, ScreenName,
							StartTime, 0, GLV["__smElapsedTime" + nIdx],
							GLV["__smGlobalId" + nIdx] , "SVCCOMBO:" + strInlist, "SYNC", callBackFunc, dbioId);
				} else if (mode == "asynchronous") {
					ngmf.result(TrxCode, ngmv.errorCode, ngmv.errorMsg, dbioId);
				}
				$w.deleteSubmission(tmpTrxCode);
			}, // [end] "submitDoneHandler"
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			} // [end] "submitErrorHandler"
		};
		$w.createSubmission(submissionObj); // 서브미션 생성
		$w.executeSubmission(tmpTrxCode); // 서브미션 실행
		/** *********************** 통신하기 종료 ************************ */	
	} catch(e) { 
	    ngmf._error("[ngmf.svcCombo] Exception :: ", e); 
	}
};

/**
 * 전문 송신을 위한 공통 Header 생성(NGM Header)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} TrxCode :: I :: N :: :: Transaction Code
 * @param {String} ScreenName :: I :: N :: :: Window ID
 * @return {String} 성공(OK) / 실패(NO)
 * @author js.Lee
 * @example if(ngmf.makeHeadSet("ZNGMSCOD00010_TR12", "화면아이디") != "OK") return;
 * @exampleAsIs if(ngmf_MakeHeadSet(TrxCode,ScreenName) != "OK") return;
 */
ngmf.makeHeadSet = function(TrxCode, ScreenName) {
	var rtnCd = "NO";
	try {
		var altMsg = "";
		if (TrxCode == "") {
			altMsg = "트랜잭션 코드가 없습니다.";
			rtnCd = "NO";
		} else {
			altMsg = "";
			rtnCd = "OK";
		}

		if (rtnCd == "OK") {

			if (GLD.GDS_INHEAD.getRowCount() != 1) {
				GLD.GDS_INHEAD.removeAll({skipSavingRemovedData : "true"});
				GLD.GDS_INHEAD.insertRow();
			}

			GLD.GDS_INHEAD.setCellData(0, "Trx_Code", TrxCode);

			for ( var i = 0; i < GLD.GDS_GLOBALVARIABLE.getRowCount(); i++) {
				var ReqVariable = GLD.GDS_GLOBALVARIABLE.getCellData(i, "ReqVariable");
				var ReqVariableValue = GLD.GDS_GLOBALVARIABLE.getCellData(i, "ReqVariableValue");

				if (ReqVariable == "g_Ngms_UserId")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_UserId", ReqVariableValue);
				else if (ReqVariable == "g_Ngms_LogInId")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_LogInId", ReqVariableValue);
				else if (ReqVariable == "g_Ngms_EmpNum")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_EmpNum", ReqVariableValue);
				else if (ReqVariable == "g_Ngms_OrgId")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_OrgId", ReqVariableValue);
				else if (ReqVariable == "g_Ngms_HrOrgCd")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_HrOrgCd", ReqVariableValue);
				else if (ReqVariable == "g_Ngms_PostOrgCd")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_PostOrgCd",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_PostSaleOrgCd")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_PostSaleOrgCd",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_SupSaleOrgCd")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_SupSaleOrgCd",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_IpAddr")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_IpAddr", ReqVariableValue);
				else if (ReqVariable == "g_Ngms_BrTypCd")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_BrTypCd", ReqVariableValue);
				else if (ReqVariable == "g_Ngms_AuthId")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_AuthId", ReqVariableValue);
				else if (ReqVariable == "g_Ngms_ConnOrgId")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_ConnOrgId",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_ConnOrgCd")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_ConnOrgCd",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_ConnSaleOrgId")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_ConnSaleOrgId",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_ConnSaleOrgCd")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_ConnSaleOrgCd",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_AuthTypPermCd")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_AuthTypPermCd",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_PostSaleOrgId")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_PostSaleOrgId",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_SupSaleOrgId")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_SupSaleOrgId",ReqVariableValue);
				else if (ReqVariable == "g_Ngms_StStop")
					GLD.GDS_INHEAD.setCellData(0, "St_Stop", ReqVariableValue);
				else if (ReqVariable == "g_Ngms_CoClCd")
					GLD.GDS_INHEAD.setCellData(0, "Ngms_CoClCd", ReqVariableValue);
			} 
			 
			//GLD.GDS_INHEAD.setCellData(0, "Handle_Id", ngmf.trim(ngmf.right(ngmf.extGetWinHandle(),10)) );
			GLD.GDS_INHEAD.setCellData(0, "Handle_Id", ngmf.rpad(ngmf.trim(ngmf.extGetWinHandle()), " ", 9) + " "  );
			GLD.GDS_INHEAD.setCellData(0, "Screen_Name", ngmf.left(ScreenName, 13));
			GLD.GDS_INHEAD.setCellData(0, "Msg_Cnt", "0");

			ngmf._setHeaderNewLogInfoCoumn(TrxCode);

		} else {
			ngmf.alert(altMsg);
		}	
	} catch(e) { 
	    ngmf._error("[ngmf.makeHeadSet] Exception :: ", e); 
	}
	return rtnCd;
};

ngmf._setHeaderNewLogInfoCoumn = function(trxCode) {
	try {
		// Device 구분(PC/mobile)
		if (ngmf.isMobile()) {
			if (GLV.G_FORMUSEFG	== "T")
				GLD.GDS_INHEAD.setCellData(0, "Term_Type", "1"); // 1: Tablet 
			else GLD.GDS_INHEAD.setCellData(0, "Term_Type", "2"); // 2: Smart Phone
		} else {
			GLD.GDS_INHEAD.setCellData(0, "Term_Type", "0"); // PC
		} 

		var formID = ngmf.apmScreenName(ngmf.getFormID());
		var parentID = ngmf.apmScreenName(parent.ngmf.getFormID());
		
		if(location.host.indexOf("127.0.0.1") > -1){
			ngmf._debug("=========== ngmf.makeHeadSet ===========");
			ngmf._debug("isPopup: " + ngmf.isPopup());
		}
		
		// 팝업인가요?
		if (ngmf.isPopup(formID)) {
			GLD.GDS_INHEAD.setCellData(0, "Screen_Call_Trace", parentID+ "-" + formID + "-" + trxCode);
		} else {
			if(formID == parentID){
				GLD.GDS_INHEAD.setCellData(0, "Screen_Call_Trace", "Top-Top("+parentID+")-" + trxCode);
			}else{
				GLD.GDS_INHEAD.setCellData(0, "Screen_Call_Trace", "Top-" + formID+ "-" + trxCode);
			}
		}
		
		if(location.host.indexOf("127.0.0.1") > -1){
			ngmf._debug("Term_Type: " + GLD.GDS_INHEAD.getCellData(0, "Term_Type"));
			ngmf._debug("Screen_Call_Trace: " + GLD.GDS_INHEAD.getCellData(0, "Screen_Call_Trace"));
			ngmf._debug("========================================");
		}
		
	} catch (e) {
		ngmf._error("[ngmf._setHeaderNewLogInfoCoumn] Exception :: ", e);
	}
};

/**
 * Dataset을 File로 생성
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {String} inList :: I :: N :: :: Dataset List
 * @return 없음
 * @author js.Lee
 * @example ngmf.dataSetSave("ZNGMSCOD00010_TR01,ZNGMSCOD00010_TR02");
 * @exampleAsIs ngmf_DataSetSave("DS_INPUTPARAM","ZAATSIMS00070_TR03");
 */
ngmf.dataSetSave = function(inList) {
	try {
		var strUrlBase = ngmf.SVC_PATH
				+ "/default_service?service=get_service_detail&category=swing&target=";
		var inListArr = inList.split(",");

		for ( var i = 0; i < inListArr.length; i++) {

			var strUrl = strUrlBase + ngmf.trim(inListArr[i]);
			if ($w.getSubmission("Dump") != null) {
				$w.deleteSubmission("Dump");
			}

			/** *********************** 통신하기 시작 ************************ */
			// 서브미션오브젝트 options
			var submissionObj = {
				"id" : "Dump",
				"ref" : "",
				"target" : "",
				"action" : strUrl,
				"method" : "post",
				"mediatype" : "application/json",
				"encoding" : "UTF-8",
				"instance" : "",
				"replace" : "",
				"mode" : "synchronous",
				"processMsg" : "작업을 처리중입니다.",
				"submitDoneHandler" : function(e) {

					var result = e.responseJSON;
					var returnCode = result.returnCode;
					var desc = result.data.desc;
					var errorMessage = result.errorMessage;

					if (Number(returnCode) == 1) {
						// ngmf._debug("\n"+desc+"\n");
						ngmf.setWindowStatusMsg("N", errorMessage);

						var dataCollectionJSON = result.data.datacollections.datacollection;

						for ( var i = 0; i < dataCollectionJSON.length; i++) {

							var json = dataCollectionJSON[i];
							var dataListStart = '<w2:dataList id="' + json.id + '" baseNode="list" saveRemovedData="true" repeatNode="map">';
							var dataListEnd = '</w2:dataList>';
							var columnInfoStart = '<w2:columnInfo>';
							var columnInfoEnd = '</w2:columnInfo>';
							var colArr = new Array();
							var columns = json.columns.column;

							for ( var j = 0; j < columns.length; j++) {
								var column = columns[j];
								var colInfo = '<w2:column id="' + column.id + '" name="' + column.id + '" dataType="' + column.type + '"></w2:column>';
								colArr.push(colInfo);
							}

							var retStr = dataListStart + "\n" + columnInfoStart + "\n";
							for ( var j = 0; j < colArr.length; j++) {
								retStr += colArr[j] + "\n";
							}

							retStr += columnInfoEnd + "\n" + dataListEnd;
							// ngmf._debug("==> "+json.io+"\n" + retStr);
						}

					} else {
						ngmf.alert(errorMessage);
					}

					$w.deleteSubmission("Dump");

				}, // [end] "submitDoneHandler"
				"submitErrorHandler" : function(e) {
					ngmf._errorHandlingMsg(e);
				} // [end] "submitErrorHandler"
			};

			$w.createSubmission(submissionObj); // 서브미션 생성
			$w.executeSubmission("Dump"); // 서브미션 실행
			/** *********************** 통신하기 종료 ************************ */
		}	
	} catch (e) {
		ngmf._error("[ngmf.dataSetSave] Exception :: ", e);
	}
};

/**
 * Service Port 설정
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {String} CallName :: I :: N :: :: Application Group
 * @return {String} URL
 * @author js.Lee
 * @example var strUrl = ngmf.servicePort("AP1");
 * @exampleAsIs var strUrl = ngmf_ServicePort("layout");
 */
ngmf.servicePort = function(CallName) {
	var strUrl = "";
	try {
		var gNgmsWorkGrp = ngmf.getGlobalValue("g_Ngms_WorkGrp").toUpperCase();
		var matchIdx = GLD.DataGroup.getMatchedIndex("Prefix", gNgmsWorkGrp, true);

		// Action Url 생성
		strUrl = GLD.DataGroup.getCellData(matchIdx[0], "Baseurl") + "Websquare/Service/" + CallName;

		// SSL사용여부
		if (ngmf.sslFlagstatus()) {
			strUrl = strUrl.replace("http:", "https:");
		}
	} catch (e) {
		ngmf._error("[ngmf.servicePort] Exception :: ", e);
	}
	return strUrl;
};

/**
 * Service Port 설정
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {String} CallName :: I :: N :: :: Application Group
 * @return {String} URL
 * @author js.Lee
 * @example var sPort = ngmf.serviceRealPort(ngmf.getGlobalValue("g_Ngms_WorkGrp"));
 * @exampleAsIs var sPort = ngmf_ServiceRealPort(toUpper(ngmf_GetGlobalValue("g_Ngms_WorkGrp")));
 */
ngmf.serviceRealPort = function(CallName) {
	var strUrl = "";
	try {
		var gNgmsWorkGrp = ngmf.getGlobalValue("g_Ngms_WorkGrp");
		switch (gNgmsWorkGrp.toUpperCase()) {
		case "AP1":
			strUrl = "8101";
			break;
		case "AP2":
			strUrl = "8201";
			break;
		case "AP3":
			strUrl = "8301";
			break;
		case "APC":
			strUrl = "8701";
			break;
		case "CCA":
			strUrl = "8401";
			break;
		case "FRM":
			strUrl = "8501";
			break;
		case "TST":
			strUrl = "8601";
			break;
		case "QTP":
			strUrl = "8601";
			break;
		case "EDU":
			strUrl = "8801";
			break;
		case "CST":
			strUrl = "8901";
			break;
		case "CCAM":
			strUrl = "9401";
			break;
		case "STR":
			strUrl = "none";
			break;
		default:
			strUrl = "8060";
			break;
		}
	} catch (e) {
		ngmf._error("[ngmf.serviceRealPort] Exception :: ", e);
	}
	return strUrl;
};

/**
 * File 생성 (Write)(타모듈)
 * 
 * @date 2016.03.15
 * @memberOf ngmf
 * @param {String} fileObj :: I :: N :: :: 업로드 파일 upload Component
 * @param {Object} str_param :: I :: N :: g_Ngms_UserId :: (parameter) userId
 * @param {String} callBackFunc :: I :: Y :: :: 업로드 결과 확인용 CALLBACK FUNCTION
 * @param {String} progressFunc :: I :: Y :: :: 업로드 프로그래스 처리용 CALLBACK FUNCTION
 * @param {Boolean} chkAcl :: I :: Y :: :: 암호화 해제여부
 * @return {Array} rtn_arr[Result, Message, file Size]
 * @author 성일호
 * @example  
 * 			ngmf.fileWrite(fileObj, "id00001", function(rtn_arr) { 
 * 				if (rtn_arr[0] == "Y") { //이후 프로세서 처리 }
 *          	else { ngmf.alert(ngmf.getErrMessage(rtn_arr[1])); } 
 *          });
 * @exampleAsIs var rtnArr = ngmf_FileWrite(fileUrl, userId);
 */
ngmf.fileWrite = function(fileObj, str_param, callBackFunc, progressFunc, chkAcl) {
	ngmf.promise._fileWrite(fileObj, {
		userId : str_param || ngmf.getGlobalValue("g_Ngms_UserId")
	}, progressFunc, chkAcl).then(
			function(retObj) {
				if (typeof callBackFunc != "undefined" && callBackFunc)
					ngmf._getCallBackFunction(callBackFunc)(retObj.rtn_arr,
							retObj["paramMap"]);
			}).then(
			undefined,
			function(retObj) {
				if (typeof callBackFunc != "undefined" && callBackFunc) {
					if (retObj["rtn_arr"])
						ngmf._getCallBackFunction(callBackFunc)(retObj.rtn_arr,
								retObj["paramMap"]);
					else
						ngmf._getCallBackFunction(callBackFunc)(retObj);
				}
			});
};

/**
 * File Read(타모듈)
 * 
 * @date 2016.03.15
 * @memberOf ngmf
 * @param {String} file_url :: I :: N :: :: file Path
 * @param {String} str_cookie :: I :: N :: :: Parameter (Cookie)
 * @param {String} str_size :: I :: N :: :: 파일사이즈
 * @param {Object} callBackFunc :: I :: Y :: :: 결과 처리용 CAllBACK 함수
 * @param {Object} progressFunc :: I :: Y :: :: 프로그래스 처리용 CAllBACK 함수
 * @return {Array} rtn_arr[Result, Message, file Size]
 * @author 성일호
 * @example 
 * 		ngmf.fileRead(localUrl, filepath, filesize, function(rtn_arr) { 
 * 			if (rtn_arr[0] == "Y") { //이후 프로세서 처리 } else {
 *          ngmf.alert(ngmf.getErrMessage(rtn_arr[1])); } 
 *      });
 * @exampleAsIs var rtnArr = ngmf_FileRead(localUrl, filepath, filesize);
 */
ngmf.fileRead = function(file_url, str_cookie, str_size, callBackFunc, progressFunc) {
	ngmf.promise._fileRead(file_url, str_cookie, file_size, undefined,
			progressFuncc).then(
			function(retObj) {
				if (typeof callBackFunc != "undefined" && callBackFunc)
					ngmf._getCallBackFunction(callBackFunc)(retObj.rtn_arr,
							retObj["paramMap"]);
			}).then(
			undefined,
			function(retObj) {
				if (typeof callBackFunc != "undefined" && callBackFunc) {
					if (retObj["rtn_arr"])
						ngmf._getCallBackFunction(callBackFunc)(retObj.rtn_arr,
								retObj["paramMap"]);
					else
						ngmf._getCallBackFunction(callBackFunc)(retObj);
				}
			});
};

/**
 * Batch 실행(타모듈)
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {String} TrxCode :: I :: N :: :: Transaction Code
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} InData :: I :: N :: :: Input Dataset
 * @param {String} OutData :: I :: N :: :: Output Dataset
 * @param {String} callBackFunc :: I :: Y :: :: CallBack Script
 * @param {String} BatchFg :: I :: Y :: :: Batch 실행 Status 설정 "WAIT"
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {String} ngmv_UserData :: I :: Y :: :: 함수 정의
 * @param {String} rpt_file_nm :: I :: Y :: :: report open시 파일명(배치조회에서 공통화면에서 사용하기 위함)
 * @param {String} trans_nm :: I :: Y :: :: report open시 서비스명(배치조회에서 공통화면에서 사용하기 위함)
 * @param {String} rpt_brws_cond_info :: I :: Y :: :: report open시 조건(배치조회에서 공통화면에서 사용하기 위함)
 * @param {String} auto_rt_aply_yn :: I :: Y :: :: report open시 adjust(배치조회에서 공통화면에서 사용하기 위함)
 * @param {String} scrn_rt :: I :: Y :: :: report open시 ratio(배치조회에서 공통화면에서 사용하기 위함)
 * @return 없음
 * @author js.Lee
 * @example ngmf.batch(TrxCode,ScreenName,"","DS_INPUT",OutDataList,"","WAIT");
		//on demand 배치 호출 후 처리가 완료되면 호출 페이지에서 무조건 scwin.pushCallBackResult api를 찾습니다.
		//scwin.pushCallBackResult 가 있으면 자동으로 호출이 됩니다. 호출시 첫번째 파라미터에 처리 완료된 파일의 id 가 리턴.
		// scwin.pushCallBackResult 샘플 
		scwin.pushCallBackResult = function (strFile, strRtCode) {
			try {
			    if ( strRtCode == "RC_ERR") {
					// 오류처리   &PROC 실행 오류입니다.
					ngmf.alert(ngmf_GetMessage("ZNGMC1060","&PROC","OnDemand 배치"));
					return false; 
				} else {
					// 처리 결과 다루기 샘플..
					//1. 처리 결과를 TEXT로 받기
					var csvData = "";
					ngmf.promise.clobFileDown(strFile)
					.then( function(retMsg) {
						csvData = retMsg; 
						// 처리 API 호출....
					}) ;
					
					//2. 처리 결과를 DataList로 받기
					ngmf.promise.batDownloadDs(strFile, "ds_downcsv", false)
				   .then( function (downDs) {
					   //
					   if (downDs.getRowCount()  > 0) {
						   // 대상 DATA LIST 가 ds_target 일 경우
						   var appendData = false;  //data 를 추가할 경우 true로
						   ds_target.setJSON( downDs.getAllJSON() , appendData);
					   }
					   if (downDs) {
						   //임시 dataList 제거
						   ngmf.destroyDataList(downDs);
					   }
					}) ;	
					
				}
		    } catch(e) { 
		        ngmf.error("[scwin.pushCallBackResult] Exception :: ", e); 
		    }		
		    return true;
		};
 * @exampleAsIs ngmf_Batch(TrxCode, ScreenName, "", InDataList, OutDataList, "", "");
 */
ngmf.batch = function(TrxCode, ScreenName, arg, InData, OutData, callBackFunc,
		BatchFg, ngmv_MsgFg, ngmv_UserData, rpt_file_nm, trans_nm,
		rpt_brws_cond_info, auto_rt_aply_yn, scrn_rt) {

	try {
		if (GLV.G_CLOSEFG == "6") return;
		ngmf.bizTrSettingStop(TrxCode);
		var wFrameArray = ScreenName.split("::");
		var wFrameId = "";

		if (wFrameArray.length > 1) {
			ScreenName = wFrameArray[0];
			wFrameId = wFrameArray[1];
		}

		var InParam = InData.split(",");
		var OutParam = OutData.split(",");

		var InCnt = 0;
		if (InData.length > 0) InCnt = InParam.length;

		var OutCnt = 0;
		if (OutData.length > 0) OutCnt = OutParam.length;

		// OnDemand Batch인 경우 조회용 column추가
		if (TrxCode == "ZNGMSBAT00010_TR01") {
			var inputDS = InParam[0];
			if (wFrameId.length > 0) {
				if (inputDS.length > 0) {
					if(typeof ngmf.object(wFrameId + "_" + inputDS) !== "undefined"){
						inputDS = wFrameId + "_" + inputDS;
					}
				}
			}
			var objBatchInDS = ngmf.object(inputDS);
			// rpt_file_nm column이 존재하지 않는다면 컬럼을 만들어준다.
			if (typeof objBatchInDS.getColumnIndex("rpt_file_nm") === "undefined" || objBatchInDS.getColumnIndex("rpt_file_nm") == null) {

				objBatchInDS.insertColumn("rpt_file_nm", {
					"name" : "rpt_file_nm",
					"dataType" : 'text'
				});

				objBatchInDS.insertColumn("trans_nm", {
					"name" : "trans_nm",
					"dataType" : 'text'
				});

				objBatchInDS.insertColumn("rpt_brws_cond_info", {
					"name" : "rpt_brws_cond_info",
					"dataType" : 'text'
				});

				objBatchInDS.insertColumn("auto_rt_aply_yn", {
					"name" : "auto_rt_aply_yn",
					"dataType" : 'text'
				});

				objBatchInDS.insertColumn("scrn_rt", {
					"name" : "scrn_rt",
					"dataType" : 'text'
				});

			}

			// if report file is alive
			if (typeof rpt_file_nm !== "undefined") {
				if (rpt_file_nm.length > 0) {
					rpt_file_nm = rpt_file_nm.replace(ngmv.HomeServer, "");
				}
			}

			if (objBatchInDS.getRowCount() == 0) {
				objBatchInDS.insertRow();
			}

			objBatchInDS.setCellData(0, "rpt_file_nm", rpt_file_nm);
			objBatchInDS.setCellData(0, "trans_nm", trans_nm);
			objBatchInDS.setCellData(0, "rpt_brws_cond_info",rpt_brws_cond_info);
			objBatchInDS.setCellData(0, "auto_rt_aply_yn", auto_rt_aply_yn);
			objBatchInDS.setCellData(0, "scrn_rt", scrn_rt);
		}

		// wframe 아이디가 존재하는 경우
		if (wFrameId.length > 0) {
			for ( var i = 0; i < InCnt; i++) {
				var orgInparam = ngmf.trim(InParam[i]);
				InParam[i] = wFrameId + "_" + orgInparam;

				if (typeof ngmf.object(InParam[i]) === "undefined") {
					InParam[i] = orgInparam;
				}
			}

			for ( var i = 0; i < OutCnt; i++) {
				var orgOutparam = ngmf.trim(Outparam[i]);
				Outparam[i] = wFrameId + "_" + orgOutparam;

				if (typeof ngmf.object(Outparam[i]) === "undefined") {
					Outparam[i] = orgOutparam;
				}
			}

			if (typeof callBackFunc !== "undefined") {
				if (ngmf.isFunction(callBackFunc)) {
					callBackFunc = ngmf._pushCallbackFunc(callBackFunc);
				} else {
					if (callBackFunc != null && callBackFunc != "") {

						var orgCallBackFunc = ngmf.trim(callBackFunc);
						callBackFunc = wFrameId + "_" + orgCallBackFunc;

						if (typeof eval(callBackFunc) === "undefined") {
							callBackFunc = orgCallBackFunc;
						}
					}
				}
			}
		} else {
			if (typeof callBackFunc !== "undefined") {
				if (ngmf.isFunction(callBackFunc)) {
					callBackFunc = ngmf._pushCallbackFunc(callBackFunc);
				}
			}
		}

		if (ngmf.length(ngmf.trim(ScreenName)) != 13) {
			ScreenName = ngmf.getFormID();
		}

		if (ngmf.makeHeadSet(TrxCode, ScreenName) != "OK") {
			if (GLV.G_FORMUSEFG == "M") {
				ngmf.setSystemMsg("헤더 정보를 로드하는데 실패 하였습니다.");
			}
			return;
		}

		var strOrgFormNm = ngmf.getFormID();
		var strWHandle = ngmf.extGetWinHandle();
		
		// Handle : 10byte IP:22Byte
		strWHandle = ngmf.rpad(ngmf.trim(strWHandle), " ", 9) + " " ;

		GLD.GDS_INHEAD.setCellData(0, "Handle_Id", strWHandle);
		var strIPAddr = ngmf.getGlobalValue("g_Ngms_IpAddr");
		if (strIPAddr == null) strIPAddr = "";

		strIPAddr = ngmf.rpad(strIPAddr, " ", 22);
		GLD.GDS_INHEAD.setCellData(0, "Ngms_IpAddr", strIPAddr);

		var strKey = ngmf.mid(strWHandle, 0, 9) + strIPAddr; // "p064912";
		var strGubun = "BATCH";

		// 0529 batchid 넘김
		var strBatchID = null;

		// ERP연동
		if (typeof ngmv_UserData !== "undefined" && ngmv_UserData == "ERP") {
			strBatchID = "";
		} else {
			var firstInParam = ngmf.object(InParam[0]);
			strBatchID = firstInParam.getCellData(0, "bat_name");
		}

		if (typeof ngmv_UserData === "undefined")
			ngmv_UserData = "";

		// ngmv_UserData : 사용자가 넘긴값
		// strOrgFormNm : FORMID
		// strBatchID : BATCH ID
		// strWHandle : WINDOW HANDLE
		ngmv_UserData = ngmv_UserData + "*" + strOrgFormNm + "*" + strBatchID + "*" + strWHandle;

		ngmf._debug("=========== push wait.... =====================");
		ngmf._debug("Key:" + strKey);
		ngmf._debug("ngmv_UserData:" + ngmv_UserData);

		if (typeof BatchFg === "undefined") {
			BatchFg = "";
		}

		if (GLV.G_FORMUSEFG == "M") {
			if (BatchFg.toUpperCase() == "WAIT") {

				// prograssbar 실행
				scwin.setBatchProgress(true);

				// --- PUSH 대기 실행
				// -----------------------------------------------
				if (!ngmf.isValid("XDS_PUSH_BATCH_WAIT")) {

					ngmf._debug("[알림] 다음 메세지는 무시하십시오==>Variable을 찾는데 실패 하였습니다.XDS_PUSH_BATCH_WAIT");
					ngmf.createDataList("XDS_PUSH_BATCH_WAIT");
					XDS_PUSH_BATCH_WAIT.bind(
						"ondataload",
						function() {
							ngmf._debug("===> Welcome To The XDS_PUSH_BATCH_WAIT ondataload!!!!");
							ngmf.xdsPushBatchWaitOnLoadCompleted(XDS_PUSH_BATCH_WAIT, null,null, 0, ScreenName, wFrameId);
						}
					);

				} else {
					XDS_PUSH_BATCH_WAIT.removeAll();
				}

				ngmf.ext.push.add(ScreenName, strKey, strGubun,"XDS_PUSH_BATCH_WAIT", 0, 0, 0, ngmv_UserData);

			} else {

				ngmf.ext.push.pushWait(strKey, ngmv_UserData, wFrameId);
			}
		} else {
			ngmf.alert("MDI에서만 실행 가능합니다.");
			return;
		}

		// batch event add -----
		if (typeof ngmv_MsgFg === "undefined") {
			ngmv_MsgFg = "NONE";
		} else {
			if (ngmf.length(ngmv_MsgFg) == 0) {
				ngmv_MsgFg = "NONE";
			}
		}

		var tmpTrxCode = TrxCode;
		var strSSO = "commonsvc=0";
		var strUrl = ngmf.SVC_PATH + "/SVC" + "?" + strSSO + "&rtcode=0"
				+ "&Trx_code=" + TrxCode + "&ScreenName=" + ScreenName
				+ ngmv.fCloseAccount;

		TrxCode = ngmf.trim(TrxCode) + "|" + ngmf.trim(callBackFunc) + "|"
				+ ngmf.trim(ngmv_MsgFg);

		var Sdate = ngmf.extGetHDTime();
		var StartTime = ngmf.timeM();
		StartTime = ngmf.trim(StartTime);
		strUrl = ngmf.preTrxCall(strUrl);
		strUrl += arg + "&_useLayout=true";

		var nIdx = GLV.G_iTrxCurIdx;

		// SSL사용여부
		if (ngmf.sslFlagstatus()) {
			strUrl = strUrl.replace("http:", "https:");
		}

		// ref 만들기
		var InDataList = new Array();
		var reqDataListStr = "";

		for ( var i = 0; i < InCnt; i++) {
			var pId = ngmf.trim(InParam[i]);
			var pKey = "input" + (i + 1);

			if (pId.indexOf(":U") > -1 || pId.indexOf(":u") > -1) {
				pId = pId.replace(":U", "");
				pId = pId.replace(":u", "");
				InDataList.push('{"id":"' + pId + '", "action":"modified", "key":"' + pKey + '"}');
			} else {
				InDataList.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
			}
		}

		if (InDataList.length > 0) {
			reqDataListStr = "data:json, [" + InDataList.join(',') + "]";
		}

		// target 만들기
		var OutDataList = new Array();

		for ( var i = 0; i < OutCnt; i++) {
			var pId = ngmf.trim(OutParam[i]);
			var pKey = "output" + (i + 1);
			OutDataList.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
		}

		// Submission Object 존재하면 삭제
		if ($w.getSubmission(TrxCode) != null) {
			$w.deleteSubmission(TrxCode);
		}

		/** *********************** 통신하기 시작 ************************ */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : TrxCode,
			"ref" : reqDataListStr,
			"target" : "",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : "synchronous",
			"processMsg" : "",
			"submitHandler" : function(e) {
				//ngmf._debug("submitHandler는 submit 시작전에 실행됩니다.");
			},
			"submitDoneHandler" : function(e) {

				var result = e.responseJSON;
				var params = result.params;
				var dataInfo = result.dataInfo;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					var cd = errorJSON.ErrorCode;
					var msg = errorJSON.ErrorMsg;

					errorCd.push(cd);
					errorMsg.push(msg);

					if (msg.indexOf("^^rs^^") > -1) {
						var msgArr = msg.split("^^rs^^");
						if (cd != msgArr[1]) {
							errorCd.push(msgArr[1]);
						}
					}

				}

				// Global 오류정보 변수에 assign
				ngmv.errorCode = errorCd;
				ngmv.errorMsg = errorMsg;

				// 통신성공인 경우
				if (Number(errorCd[0]) == 0) {

					for ( var i = 0; i < OutDataList.length; i++) {

						var jsonRow = JSON.parse(OutDataList[i]);
						var id = jsonRow.id;
						var key = jsonRow.key;
						var dsArr = new Array();
						var ds = null;

						if (id.indexOf(":") > -1) {
							dsArr = id.split(":");
							id = dsArr[0];
							ds = ngmf.object(id);

							if (dsArr[1].toUpperCase() == "C") {
								ngmf.clear(ds);
							}
						} else {
							ds = ngmf.object(id);
						}

						var output = eval("result." + key);

						for ( var j = 0; j < dataInfo.length; j++) {
							if (dataInfo[j].id == key) {
								for ( var jj = 0; jj < dataInfo[j].columns.column.length; jj++) {
									var id = dataInfo[j].columns.column[jj].id;
									var type = dataInfo[j].columns.column[jj].type;
									var options = {
										name : id,
										dataType : type
									};

									ngmf.insertColumn(ds, id, options);
								}

							}
						}

						if (typeof output === "undefined" || output == null) {
							ds.setJSON([], false);
						} else {
							ds.setJSON(output, false);
						}

						ds.reform();

					}

				} else {
					// Push Transaction Error발생 시 원복
					if (BatchFg.toUpperCase() == "WAIT") {
						scwin.setBatchProgress(false);
						ngmf.ext.push.del(ScreenName, strKey, strGubun,'XDS_PUSH_BATCH_WAIT');

					} else {
						ngmf.ext.push.pushDelete(strKey);
					}
				}

				ngmf.getArrayTranErrorMsg(ngmv.errorCode, ngmv.errorMsg,
						ngmv_MsgFg, "", nIdx, tmpTrxCode, Sdate, ScreenName,
						StartTime, 0, GLV["__smElapsedTime" + nIdx] ,
						GLV["__smGlobalId" + nIdx], InData, "",
						callBackFunc);

				$w.deleteSubmission(TrxCode);

			}, // [end] "submitDoneHandler"
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			} // [end] "submitErrorHandler"
		};

		$w.createSubmission(submissionObj); // 서브미션 생성.
		$w.executeSubmission(TrxCode); // 서브미션 실행
		/** *********************** 통신하기 종료 ************************ */
	} catch (e) {
		// prograssbar 실행종료
		scwin.setBatchProgress(false);
		ngmf._error("[ngmf.batch] Exception :: ", e);
		throw e;
	}
};

/**
 * Batch 실행 후 PUSH Return(타모듈)
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {Object} obj :: I :: N :: :: Object Code
 * @param {Array} nErrorCode :: I :: N :: :: Error Code
 * @param {Array} strErrorMsg :: I :: N :: :: Error Message
 * @param {String} nReason :: I :: N :: :: Dataset Loading 원인 표시
 * @param {String} wframeID :: I :: N :: :: wframe ID           
 * @return 없음
 * @author js.Lee
 * @example ngmf.xdsPushBatchWaitOnLoadCompleted(obj, nErrorCode, strErrorMsg, nReason);
 * @exampleAsIs Create("Dataset","XDS_PUSH_BATCH_WAIT",'OnLoadCompleted="ngmf_XDS_PUSH_BATCH_WAIT_OnLoadCompleted"');
 */
ngmf.xdsPushBatchWaitOnLoadCompleted = function(obj, nErrorCode, strErrorMsg,nReason, screenName, wframeID) {
	try {
		ngmf._debug("===> Welcome To The ngmf.xdsPushBatchWaitOnLoadCompleted!!!!");
		var strFile;
		var strForm = ngmf.trim(XDS_PUSH_BATCH_WAIT.getCellData(0, "screen"));
		var strRtCode = ngmf.trim(XDS_PUSH_BATCH_WAIT.getCellData(0, "rtCode"));
		var strGubun = "BATCH";
		var strKey = ngmf.rpad(XDS_PUSH_BATCH_WAIT.getCellData(0, "eventkey"),' ', 31);
		var strFileFg = ngmf.trim(XDS_PUSH_BATCH_WAIT.getCellData(0, "filetype"));
		var strUserDataList = ngmf.trim(XDS_PUSH_BATCH_WAIT.getCellData(0,"UserData"));

		// arrUserData[0] : 사용자가 넘긴값
		// arrUserData[1] : FORMID
		// arrUserData[2] : BATCH ID
		// arrUserData[3] : WINDOW HANDLE
		var arrUserData = strUserDataList.split("*");

		ngmf._debug("---ngmf_batch --- push callback-----------------------");
		ngmf._debug("[key]" + strKey);
		ngmf._debug("[strFileFg]" + strFileFg);
		ngmf._debug("[strUserDataList]" + strUserDataList);

		var strDumm = "0";
		switch (strFileFg) {

		case "E":
			// 18자리
			strFile = ngmf.trim(XDS_PUSH_BATCH_WAIT.getCellData(0, "filename"));
			var strDumm2 = ngmf.rpad(strDumm, "0", 18);
			if (strFile == strDumm2) {
				strFile = "";
			}
			break;

		case "C":
			// 33자리
			strFile = ngmf.trim(XDS_PUSH_BATCH_WAIT.getCellData(0, "rdfilename"));
			var strDumm2 = ngmf.rpad(strDumm, "0", 33);
			if (strFile == strDumm2) {
				strFile = "";
			}
			break;

		default:
			strFile = ngmf.trim(XDS_PUSH_BATCH_WAIT.getCellData(0, "filename"));
			var strDumm2 = ngmf.rpad(strDumm, "0", 18);
			if (strFile == strDumm2) {
				strFile = "";
			}
			break;
		}

		ngmf.ext.push.del(screenName, strKey, strGubun, 'XDS_PUSH_BATCH_WAIT');

		if(scvar.F_OndmndExecEndYn){
			if (ngmf.isExistFunc("scwin._pushCallBackResult")) {
				scwin._pushCallBackResult(strFile, strRtCode);
			}
		}else{
			// 03.20 file check 안함 - 이기항 대리님.
			if(wframeID != ""){
				var realFuncNm = wframeID+"_scwin.pushCallBackResult";
				if (ngmf.isExistFunc(realFuncNm)) {
					eval(realFuncNm+"(strFile, strRtCode)");
				}else{
					if (ngmf.isExistFunc("scwin.pushCallBackResult")) {
						scwin.pushCallBackResult(strFile, strRtCode);
					}
				}
			}else{
				if (ngmf.isExistFunc("scwin.pushCallBackResult")) {
					scwin.pushCallBackResult(strFile, strRtCode);
				}
			}
			
		}

		scwin.setBatchProgress(false);

	} catch (e) {
		scwin.setBatchProgress(false);
		ngmf._error("[ngmf.xdsPushBatchWaitOnLoadCompleted] Exception :: ", e);
	}

};

/**
 * Push 대기 Job실행(타모듈)
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {String} TrxCode :: I :: N :: :: Transaction Code
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} InData :: I :: N :: :: Input Dataset
 * @param {String} OutData :: I :: N :: :: Output Dataset
 * @param {String} callBackFunc :: I :: Y :: :: CallBack Script
 * @param {String} intWaitTime :: I :: N :: :: Wait Time 설정
 * @param {String} ngmv_UserData :: I :: N :: :: 함수 정의
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {Boolean} ngmv_ImageViewFg :: I :: Y :: :: 이미지 처리 여부 true/false default : true
 * @param {Boolean} strLockFg :: I :: Y :: :: ngmv_ImageViewFg가 false인 경우 화면을 Lock해야하는 경우(미사용)
 * @param {Boolean} bNotCloseWin :: I :: Y :: false :: 실행이 완료될때까지 화면LOCK , 팝업호출일 경우 Parent화면까지 Lock
 * @return 없음
 * @author js.Lee
 * @update 2016.06.26 성일호 bNotCloseWin 파라미터 추가 (pushSyncCall 2 대응) 
 * @example ngmf.pushSyncCall(TrxCode,ScreenName,"" ,InDataList,OutDataList,"",0.35 ,sCode, "" , "");
 * @exampleAsIs ngmf_PushSyncCall(TrxCode,ScreenName,"" ,InDataList,OutDataList,"",0.35 ,sCode, "" , "");
 */
ngmf.pushSyncCall = function(TrxCode, ScreenName, arg, InData, OutData, callBackFunc, intWaitTime, ngmv_UserData, ngmv_MsgFg, ngmv_ImageViewFg, strLockFg, bNotCloseWin) {
	try {
		if (typeof intWaitTime === "undefined") {
			intWaitTime = 0;
		}

		if (typeof ngmv_UserData === "undefined") {
			ngmv_UserData = "";
		}

		if (typeof ngmv_MsgFg === "undefined") {
			ngmv_MsgFg = "";
		}

		if (typeof ngmv_ImageViewFg === "undefined") {
			ngmv_ImageViewFg = false;
		}

		if (typeof strLockFg === "undefined") {
			strLockFg = false;
		}

		if (typeof bNotCloseWin === "undefined") {
			bNotCloseWin = false;
		}

		if (GLV.G_CLOSEFG == "6")
			return;
		ngmf.bizTrSettingStop(TrxCode);

		var wFrameArray = ScreenName.split("::");
		var wFrameId = "";

		if (wFrameArray.length > 1) {
			ScreenName = wFrameArray[0];
			wFrameId = wFrameArray[1];
		}

		var strSSO = "commonsvc=0";
		var InParam = InData.split(",");
		var OutParam = OutData.split(",");
		var strCallBackFunc = "";

		var InCnt = 0;
		if (InData.length > 0)
			InCnt = InParam.length;

		var OutCnt = 0;
		if (OutData.length > 0)
			OutCnt = OutParam.length;
		if (ngmv_ImageViewFg != false)
			ngmv_ImageViewFg = true;

		// wframe 아이디가 존재하는 경우 처리
		if (wFrameId.length > 0) {
			for ( var i = 0; i < InCnt; i++) {
				var orgInparam = ngmf.trim(InParam[i]);
				InParam[i] = wFrameId + "_" + orgInparam;

				if (typeof ngmf.object(InParam[i]) === "undefined") {
					InParam[i] = orgInparam;
				}
			}

			for ( var i = 0; i < OutCnt; i++) {
				var orgOutparam = ngmf.trim(OutParam[i]);
				OutParam[i] = wFrameId + "_" + orgOutparam;

				if (typeof ngmf.object(OutParam[i]) === "undefined") {
					OutParam[i] = orgOutparam;
				}
			}

			if (typeof callBackFunc !== "undefined") {
				if (ngmf.isFunction(callBackFunc)) {
					strCallBackFunc = ngmf._pushCallbackFunc(callBackFunc);
				} else {
					if (callBackFunc != null && callBackFunc != "") {

						var orgCallBackFunc = ngmf.trim(callBackFunc);
						strCallBackFunc = wFrameId + "_" + orgCallBackFunc;

						if (typeof eval(strCallBackFunc) === "undefined") {
							strCallBackFunc = orgCallBackFunc;
						}
					}
				}
			}
		} else {
			if (typeof callBackFunc !== "undefined") {
				if (ngmf.isFunction(callBackFunc)) {
					strCallBackFunc = ngmf._pushCallbackFunc(callBackFunc);
				}
			}
		}

		if (ngmf.length(ngmf.trim(ScreenName)) != 13) {
			ScreenName = ngmf.getFormID();
		}

		if (ngmf.makeHeadSet(TrxCode, ScreenName) != "OK") {

			if (GLV.G_FORMUSEFG == "M") {
				ngmf.setSystemMsg("헤더 정보를 로드하는데 실패 하였습니다.");
			}

			return;
		}

		var strOrgFormNm = ngmf.getFormID();
		var strWHandle = ngmf.extGetWinHandle(); 
 
		// Handle : 10byte IP:22Byte
		strWHandle = ngmf.rpad(ngmf.trim(strWHandle), " ", 9) + " " ;
		GLD.GDS_INHEAD.setCellData(0, "Handle_Id", strWHandle);

		var strIPAddr = ngmf.getGlobalValue("g_Ngms_IpAddr");
		strIPAddr = ngmf.rpad(strIPAddr, " ", 22);
		GLD.GDS_INHEAD.setCellData(0, "Ngms_IpAddr", strIPAddr);

		// Parameter's ScreenName != Real formID ===> Real formid use!!!
		var arrCallBackFunc = ngmv_UserData.split("|");
		var strCallBackFunc = "";

		if (ngmv_UserData.length > 0 && arrCallBackFunc.length > 1) {
			strCallBackFunc = arrCallBackFunc[1]; // callback
		}

		var TrID = TrxCode;

		/*
		 * ngmv_UserData : 거래코드|CALLBACK함수명 strOrgFormNm : 화면명 ngmv_MsgFg : 메세지
		 * 처리 여부 - 서비스 & PUSH메세지 동일하게 처리 strWHandle : WINDOW HANDLE
		 */
		ngmv_UserData = ngmv_UserData + "*" + strOrgFormNm + "*" + "*" + strWHandle;

		var strGubun = "EAI";
		var strKey = ngmf.mid(strWHandle, 0, 9) + strIPAddr;
		ngmv["eaiEventKey"] = strKey;
		ngmf._debug("PUSH KEY:" + strKey);
		ngmf._debug("PUSH ngmv_UserData:" + ngmv_UserData);

		if (GLV.G_FORMUSEFG == "M") {

			// prograssbar 실행
			scwin.setBatchProgress(true);

			// --- PUSH 대기 실행 -----------------------------------------------
			if (!ngmf.isValid("XDS_EAIPUSH_WAIT")) {
				ngmf._debug("[알림] 다음 메세지는 무시하십시오==>Variable을 찾는데 실패 하였습니다");
				ngmf.createDataList("XDS_EAIPUSH_WAIT");

				XDS_EAIPUSH_WAIT.bind("ondataload", function(e) {
					ngmf.xdsEaiPushWaitOnLoadCompleted(XDS_EAIPUSH_WAIT, null, null, 0, ScreenName);
				});

			} else {
				XDS_EAIPUSH_WAIT.removeAll();
			}
			ngmf.ext.push.add(ScreenName, strKey, strGubun, "XDS_EAIPUSH_WAIT",0, 0, 0, ngmv_UserData);
			ngmf.pushJobSetTimer(intWaitTime,ScreenName, strKey, strGubun,'XDS_EAIPUSH_WAIT');
		} else {
			ngmf.alert("MDI에서 실행 가능합니다.");
			return;
		}

		// batch event add -----
		if (ngmv_MsgFg == null || ngmf.length(ngmv_MsgFg) == 0) {
			ngmv_MsgFg = "NONE";
		}

		var strUrl = ngmf.SVC_PATH + "/SVC" + "?" + strSSO + "&rtcode=0"
				+ "&Trx_code=" + TrxCode 
				+ "&ScreenName=" + ScreenName
				+ ngmv.fCloseAccount;
		var tmpTrxCode = TrxCode;
		TrxCode = ngmf.trim(TrxCode) + "|" + ngmf.trim(strCallBackFunc) + "|" + ngmf.trim(ngmv_MsgFg);

		var Sdate = ngmf.extGetHDTime();
		var StartTime = ngmf.timeM();

		StartTime = ngmf.trim(StartTime);
		strUrl = ngmf.preTrxCall(strUrl);
		strUrl += arg + "&_useLayout=true";

		var nIdx = GLV.G_iTrxCurIdx;

		// SSL사용여부
		if (ngmf.sslFlagstatus()) {
			strUrl = strUrl.replace("http:", "https:");
		}

		// ref 만들기
		var InDataList = new Array();
		var reqDataListStr = "";

		for ( var i = 0; i < InCnt; i++) {
			var pId = ngmf.trim(InParam[i]);
			var pKey = "input" + (i + 1);

			if (pId.indexOf(":U") > -1 || pId.indexOf(":u") > -1) {
				pId = pId.replace(":U", "");
				pId = pId.replace(":u", "");
				InDataList.push('{"id":"' + pId + '", "action":"modified", "key":"' + pKey + '"}');
			} else {
				InDataList.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
			}
		}

		if (InDataList.length > 0) {
			reqDataListStr = "data:json, [" + InDataList.join(',') + "]";
		}

		// target 만들기
		var OutDataList = new Array();

		for ( var i = 0; i < OutCnt; i++) {
			var pId = ngmf.trim(OutParam[i]);
			var pKey = "output" + (i + 1);
			OutDataList.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
		}

		// Submission Object 존재하면 삭제
		if ($w.getSubmission(TrxCode) != null) {
			$w.deleteSubmission(TrxCode);
		}
		/** *********************** 통신하기 시작 ************************ */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : TrxCode,
			"ref" : reqDataListStr,
			"target" : "",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : "synchronous",
			"processMsg" : "",
			"submitHandler" : function(e) {
				//ngmf._debug("submitHandler는 submit 시작전에 실행됩니다.");
			},
			"submitDoneHandler" : function(e) {

				var result = e.responseJSON;
				var params = result.params;
				var dataInfo = result.dataInfo;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					var cd = errorJSON.ErrorCode;
					var msg = errorJSON.ErrorMsg;

					errorCd.push(cd);
					errorMsg.push(msg);

					if (msg.indexOf("^^rs^^") > -1) {
						var msgArr = msg.split("^^rs^^");
						if (cd != msgArr[1]) {
							errorCd.push(msgArr[1]);
						}
					}

				}

				// Global 오류정보 변수에 assign
				ngmv.errorCode = errorCd;
				ngmv.errorMsg = errorMsg;

				// 통신성공인 경우
				if (Number(errorCd[0]) == 0) {
					//ngmf.ext.push.add(ScreenName, strKey, strGubun, "XDS_EAIPUSH_WAIT",0, 0, 0, ngmv_UserData);
					for ( var i = 0; i < OutDataList.length; i++) {
						var jsonRow = JSON.parse(OutDataList[i]);
						var id = jsonRow.id;
						var key = jsonRow.key;
						var dsArr = new Array();
						var ds = null;

						if (id.indexOf(":") > -1) {
							dsArr = id.split(":");
							id = dsArr[0];
							ds = ngmf.object(id);

							if (dsArr[1].toUpperCase() == "C") {
								ngmf.clear(ds);
							}
						} else {
							ds = ngmf.object(id);
						}

						var output = result[key];

						for ( var j = 0; j < dataInfo.length; j++) {
							if (dataInfo[j].id == key) {
								for ( var jj = 0; jj < dataInfo[j].columns.column.length; jj++) {
									var id = dataInfo[j].columns.column[jj].id;
									var type = dataInfo[j].columns.column[jj].type;
									var options = {
										name : id,
										dataType : type
									};

									ngmf.insertColumn(ds, id, options);
								}
							}
						}

						if (typeof output === "undefined" || output == null) {
							ds.setJSON([], false);
						} else {
							ds.setJSON(output, false);
						}

						ds.reform();

					}

				} else {
					scwin.setBatchProgress(false);
					WebSquare.util.clearInterval(410);
					ngmf._error("ngmf.pushSyncCall Transaction Error...");

					ngmf.ext.push.del(ScreenName, strKey, strGubun,'XDS_EAIPUSH_WAIT');
					//2016.06.26 성일호 추가
					if (bNotCloseWin) {
						ngmf._setFormBatch(false);
					} 
				}

				ngmf.getArrayTranErrorMsg(
					ngmv.errorCode, ngmv.errorMsg, ngmv_MsgFg, "", nIdx, 
					tmpTrxCode, Sdate, ScreenName, StartTime, 0, 
					GLV["__smElapsedTime" + nIdx], GLV["__smGlobalId" + nIdx], InData, "", ""
				);

				$w.deleteSubmission(TrxCode);

			}, // [end] "submitDoneHandler"
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);					
				//2016.06.26 성일호 추가
				if (bNotCloseWin) {
					ngmf._setFormBatch(false);
				} 
			} // [end] "submitErrorHandler"
		}; 
		
		$w.createSubmission(submissionObj); // 서브미션 생성
		$w.executeSubmission(TrxCode); // 서브미션 실행
		/** *********************** 통신하기 종료 ************************ */
	} catch (e) {
		scwin.setBatchProgress(false);
		ngmf._error("[ngmf.pushSyncCall] Exception :: ", e);
		throw e;
	}
};

/**
 * Push Transaction 실행 후 PUSH Return
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {Object} obj :: I :: N :: :: 대상 Object
 * @param {String} nErrorCode :: I :: N :: :: Error Code
 * @param {String} nErrorMsg :: I :: N :: :: Error Message
 * @param {String} nReason :: I :: N :: :: nReason
 * @return 없음
 * @author js.Lee
 * @example ngmf.xdsEaiPushWaitOnLoadCompleted(obj, nErrorCode, strErrorMsg, nReason);
 * @exampleAsIs Create("Dataset","XDS_EAIPUSH_WAIT",'OnLoadCompleted="ngmf_XDS_EAIPUSH_WAIT_OnLoadCompleted"');
 */
ngmf.xdsEaiPushWaitOnLoadCompleted = function(obj, nErrorCode, strErrorMsg,nReason, screenName) {
	try {
		ngmf._debug("===> Welcome To The ngmf.xdsEaiPushWaitOnLoadCompleted!!!!");
		
		// kill timmer
		WebSquare.util.clearInterval(410);

		// CallBack Return값 처리 - 임시
		var strForm = ngmf.trim(XDS_EAIPUSH_WAIT.getCellData(0, "screen"));
		var strGubun = "EAI";

		var strKey = ngmf.rpad(XDS_EAIPUSH_WAIT.getCellData(0, "eventkey"),' ', 31);
		var strFile = ngmf.trim(XDS_EAIPUSH_WAIT.getCellData(0, "filename"));
		var strMsg = ngmf.trim(XDS_EAIPUSH_WAIT.getCellData(0, "msglist"));
		var strUserDataList = ngmf.trim(XDS_EAIPUSH_WAIT.getCellData(0,"UserData"));
		var wframeid = ngmf.trim(XDS_EAIPUSH_WAIT.getCellData(0,"wframeid"));
		var arrUserData = strUserDataList.split("*");

		ngmf._debug("=== EAI Push CallBack==========================================>");
		ngmf._debug("[strKey]" + strKey);
		ngmf._debug("[strFile]" + strFile);
		ngmf._debug("[strMsg]" + strMsg);
		ngmf._debug("[strUserDataList]" + strUserDataList);

		// -----------------------------------------------------------------
		// 현재 서비스메세지포멧과 동일하게 넘어옴 ex) 0|ZNGMXEEEX|안녕
		// 03/09 CODE안넘어옴 ex) 0|안녕
		// 05/09 ReturnCode추가 ex) 0|잘가|RC_ERR 또는 RC_NRM 김주일 과장님 요청
		// 07/25 msg,code순서변경 ex) 0|RC_ERR|시끄러 이상주 과장님 요청
		// -----------------------------------------------------------------
		strMsg = strMsg.replace("T_S", "0");
		strMsg = strMsg.replace("T_D", "1");
		var arrMsg = strMsg.split("|");
		var nRTCode = 0;

		strMsg = arrMsg[0] + ngmf.chr(30) + "ZZZZN0000" + ngmf.chr(30) + arrMsg[2] + ngmf.chr(30);
		if (arrMsg.length == 3) {
			if (ngmf.trim(arrMsg[1]) == "RC_ERR") {
				nRTCode = -700;
			}
		}

		// 메세지 처리
		ngmf.setSystemMsg("");
		ngmf.getArrayTranErrorMsg(nRTCode, strMsg, "", "", -1);

		ngmf.ext.push.del(screenName, strKey, strGubun, 'XDS_EAIPUSH_WAIT');
		
		//2016.06.26 성일호 추가
		ngmf._setFormBatch(false); 
		scwin.setBatchProgress(false);
		
		// "serviceID|callback"
		var arrFunc = arrUserData[0].split("|");
		if (arrFunc.length != 2)
			return;
		if (arrFunc[0].length == 0)
			return;
		if (wframeid && arrFunc[1].startsWith("scwin")) arrFunc[1] = wframeid + "_" + arrFunc[1];
		
		if (ngmf._getCallBackFunction(arrFunc[1])) {
			ngmf._getCallBackFunction(arrFunc[1])(arrFunc[0], ngmv.errorCode,	ngmv.errorMsg); 
		}


	} catch (e) {
		scwin.setBatchProgress(false);
		ngmf._error("[ngmf.xdsEaiPushWaitOnLoadCompleted] Exception :: ", e);
		throw e;
	}
};

/**
 * Push Transaction(ngmf_PushSyncCall) 수행 시 TimeOut Check(타모듈)
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {Object} intTime :: I :: N :: :: TimeOut 시간
 * @return 없음
 * @author js.Lee
 * @example ngmf.pushJobSetTimer(intTime);.
 * @exampleAsIs ngmf_PushJobSetTimer(intWaitTime);
 */
ngmf.pushJobSetTimer = function(intTime, ScreenName, strKey, strGubun, dsID) {
	try {
		if (Number(intTime) == 0) {
			intTime = 30;
		} else {
			intTime = Number(intTime) * 60000;
		}

		var thisWin = ngmf.getWindow(ngmf.getFormID());
		ngmf._debug("ngmf.pushJobSetTimer intTime: "+intTime);
		
		WebSquare.util.setInterval(function() {
			ngmf.pushJobOnTimer(thisWin, 410, ScreenName, strKey, strGubun, dsID);	
		}, {
			"key" : 410,
			"delay" : intTime
		});
		
	} catch (e) {
		ngmf._error("[ngmf.pushJobSetTimer] Exception :: ", e);
	}
};

/**
 * Push Transaction(ngmf_PushSyncCall) 수행 시 TimeOut Check(타모듈)
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {Object} obj :: I :: N :: :: 대상 Object
 * @param {Object} nEventID :: I :: N :: :: 이벤트아이디
 * @return 없음
 * @author js.Lee
 * @example ngmf.pushJobOnTimer (intTime, nEventID);
 * @exampleAsIs this.OnTimer = "ngmf_PushJobOnTimer";
 */
ngmf.pushJobOnTimer = function(obj, nEventID, ScreenName, strKey, strGubun, dsID) {
	try {
		WebSquare.util.clearInterval(nEventID);
		if (nEventID != 410) {
			return;
		}
		// 05/26 김주일 과장님 요청
		// zpayf_PushCallTimeout ==> scwin.zpayfPushCallTimeout
		if (ngmf.isExistFunc("scwin.zpayfPushCallTimeout")) {
			scwin.zpayfPushCallTimeout();
		} else {
			ngmf.alert("작업 요청시간을 초과하였습니다.");
			scwin.setBatchProgress(false);
		}
		
		if(arguments.length > 1){
			ngmf.ext.push.del(ScreenName, strKey, strGubun, dsID);
		}
	} catch (e) {
		WebSquare.util.clearInterval(nEventID);
		ngmf._error("[ngmf.pushJobOnTimer] Exception :: ", e);
	}
};

/**
 * LoV 작업 설정(Timer 설정)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {Object} Obj :: I :: N :: :: LoV 설정 Object
 * @return 없음
 * @sampleLink grd_paging
 * @author js.Lee
 * @example ngmf.lovSetFocus(inputbox1);
 * @exampleAsIs ngmf_LovSetFocus(DIV_search.EDT_EQP_SER_NUM);
 */
ngmf.lovSetFocus = function(Obj) {
	if (ngmv.orgTimer != "ngmf.onTimer") {
		ngmv.orgTimer = "ngmf.onTimer";
	}

	ngmv.focusLovNext = Obj;
	WebSquare.util.setInterval(function() {
		ngmf.onTimer(Obj, 100);
	}, {
		'key' : 100,
		'delay' : 100
	});
};

/**
 * LoV 작업 설정(Timer 설정)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {Object} Obj :: I :: N :: :: LoV설정 Object
 * @param {String} flag :: I :: N :: :: true/false
 * @param {String} strValue :: I :: Y :: :: 설정문자열
 * @return 없음
 * @author js.Lee
 * @example ngmf.comboEditableSet(select1,true,"승인");
 * @exampleAsIs ngmf_ComboEditableSet(DIV_DetailView.COB_EmailAddr,true,"");
 */
ngmf.comboEditableSet = function(Obj, flag, strValue) {

	if (ngmv.orgTimer == "ngmf.onTimer") {
		ngmv.comboObj = Obj;
		ngmv.comboEditableFlag = flag;
		ngmv.comboEditableValue = strValue;
	}

	WebSquare.util.setInterval(function() {
		ngmf.onTimer(Obj, 200);
	}, {
		'key' : 200,
		'delay' : 100
	});

};

/**
 * Timer Event 설정
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {Object} obj :: I :: N :: :: Timer 설정 Object
 * @param {String} nEventID :: I :: N :: :: nEventID Event 생성
 * @return 없음
 * @author js.Lee
 * @example ngmf.onTimer(input1, 100);
 * @exampleAsIs this.OnTimer = "ngmf_OnTimer";
 */
ngmf.onTimer = function(obj, nEventID) {
	try {
		// ----- LoV Focus처리
		if (nEventID == 100) {
			WebSquare.util.clearInterval(nEventID, false);

			if (ngmv.focusLovNext != null) {
				ngmv.focusLovNext.focus();
			}
			ngmv.focusLovNext = null;
			// ----- Email 처리 Combo Editable 변경
		} else if (nEventID == 200) {
			WebSquare.util.clearInterval(nEventID, false);
			if (ngmv.comboObj != null) {
				// 활성화
				if (ngmv.comboEditableFlag) {
					ngmv.comboObj.setDisabled(false);

					if (ngmv.comboEditableValue.length > 0) {
						ngmv.comboObj.setText(ngmv.comboEditableValue, false);
					} else {
						ngmv.comboObj.setText("", false);
					}

					ngmv.comboObj.focus();

				} else {
					ngmv.comboObj.setDisabled(true);
				}

			}

			ngmv.comboObj = null;
			ngmv.comboEditableFlag = false;
			ngmv.comboEditableValue = "";
		}

		// WebSquare는 onTimer 이벤트가 없음
		/*
		 * if ( ( ngmf.length(ngmv.orgTimer) > 0 ) && ( ngmv.orgTimer !=
		 * "ngmf.onTimer" ) ) { WebSquare는 onTimer 이벤트가 없음 this.OnTimer =
		 * ngmv.orgTimer; }
		 */
	} catch (e) {
		WebSquare.util.clearInterval(nEventID, false);
		ngmf._error("[ngmf.onTimer] Exception :: ", e);
	}
};

/**
 * AsyncCall인 경우 화면차단 할 경우
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @return 없음
 * @author js.Lee
 * @example ngmf.setLockWindow();
 * @exampleAsIs ngmf_SetLockWindow();
 */
ngmf.setLockWindow = function() {
	WebSquare.layer.showModal();
};

/**
 * Arch(분리)DB를 조회할것인지를 Check (DB용량 효율화 관련 추가사항)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {Array} strPageArray :: I :: N :: :: strPageArray[0] 한페이지에 보여질 Row count
 *            </br> strPageArray[1] UI Append Count </br> strPageArray[2]
 *            시작rownum </br> strPageArray[3] 종료rownum </br> strPageArray[4]
 *            분리DB(Arch) 조회여부 </br> strPageArray[5] COREDB 조회종료여부3
 * @param {String} callback :: I :: N :: :: 콜백함수
 * @return 없음
 * @author js.Lee
 * @example ngmf.chkArchDB(strPageArray, callback);
 * @exampleAsIs ngmf_ChkArchDB(strPageArray);
 */
ngmf.chkArchDB = function(strPageArray, callback) {
	try {
		if (typeof strPageArray === "undefined" || strPageArray == null || strPageArray.length == 0) {
			strPageArray = new Array();
		}

		var row_cnt = Number(strPageArray[0]);
		var append_cnt = Number(strPageArray[1]);
		var start_point = Number(strPageArray[2]);
		var end_point = Number(strPageArray[3]);
		var arch_yn = strPageArray[4];
		var core_end = strPageArray[5];

		if ((append_cnt == row_cnt) && (core_end != "Y")) {
			arch_yn = "N";

			strPageArray[2] = start_point;
			strPageArray[3] = end_point;
			strPageArray[4] = arch_yn;
			strPageArray[5] = core_end;

			eval(callback + "(strPageArray)");

		} else if ((append_cnt < row_cnt) && (core_end != "Y")) {

			ngmf.confirm("과거자료를 조회 하시겠습니까?", function(returnVal) {
				if (returnVal == "Y") {
					start_point = 1;
					end_point = row_cnt;
					arch_yn = "Y";
					core_end = "Y";
				} else if (returnVal == "N") {
					start_point = 1;
					end_point = row_cnt;
					arch_yn = "N";
					core_end = "Y";
				}

				eval(callback + "(strPageArray)");
			});

		} else {
			if (start_point == 1) {

				ngmf.confirm("과거자료를 조회 하시겠습니까?", function(returnVal) {
					if (returnVal == "Y") {
						arch_yn = "Y";
						strPageArray[4] = arch_yn;
					} else if (returnVal == "N") {
						arch_yn = "N";
						strPageArray[4] = arch_yn;
					}

					eval(callback + "(strPageArray)");
				});

			} else {
				arch_yn = "Y";
				strPageArray[2] = start_point;
				strPageArray[3] = end_point;
				strPageArray[4] = arch_yn;
				strPageArray[5] = core_end;

				eval(callback + "(strPageArray)");
			}
		}		
	} catch (e) {
		ngmf._error("[ngmf.chkArchDB] Exception :: ", e);
	}
};

/**
 * DB Count(Core, 분리) 기능 처리
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} ScreenName :: I :: N :: :: 호출 Window ID
 * @param {Array} strInputObjList :: I :: N :: :: 검색 조건 Parameter List
 * @return {String} strRtn 반환문자열
 * @author js.Lee
 * @example F_Svc_Mgmt_Num = ngmf.getCoreCnt( ScreenName, inputObjList );
 * @exampleAsIs F_Svc_Mgmt_Num = ToNumber(ngmf_GetCoreCnt( ScreenName, inputObjList ));
 */
ngmf.getCoreCnt = function(ScreenName, strInputObjList) {
	try {
		if (GLD.G_CLOSEFG == "6") {
			return;
		}

		var strRtn = "";
		var strArg = "";
		var nObjCnt = strInputObjList.length;
		var TrxCode = "ZNGMSDBS00020_TR01"; // Transaction Code

		ngmf.bizTrSettingStop(TrxCode);
		ScreenName = ngmf.apmScreenName(ScreenName);

		if (ngmf.makeHeadSet(TrxCode, ScreenName) != "OK") {
			return;
		}

		ngmf.clear(GLD.GDS_LOV);

		for ( var i = 0; i < nObjCnt; i++) {
			if (i == 0) {
				GLD.GDS_LOV.insertColumn("map_id", {
					'name' : "map_id",
					'dataType' : 'text'
				});
			} else {
				GLD.GDS_LOV.insertColumn("iparam" + i, {
					'name' : "iparam" + i,
					'dataType' : 'text'
				});
			}
		}

		var aIdx = GLD.GDS_LOV.insertRow();
		var nColCnt = GLD.GDS_LOV.cellIdList.length;

		for ( var i = 0; i < nColCnt; i++) {
			if (i == 0) {
				GLD.GDS_LOV.setCellData(aIdx, "map_id", strInputObjList[i]);
			} else if (i == 1) {
				if ((strInputObjList[1] == "")
						|| (ngmf.length(strInputObjList[1]) == 0)) {
					GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, "");
				} else
					GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, strInputObjList[i]);
			} else {
				GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, strInputObjList[i]);
			}
		}

		var strUrl = ngmf.SVC_PATH + "/LOV" + "?mapid=" + strInputObjList[0];
		strUrl += "&Trx_code=" + TrxCode + "&ScreenName=" + ScreenName;
		strUrl += ngmv.fCloseAccount;

		var Sdate = ngmf.extGetHDTime();
		var StartTime = ngmf.timeM();
		var nIdx = GLV.G_iTrxCurIdx;

		StartTime = ngmf.trim(StartTime);
		strUrl = ngmf.preTrxCall(strUrl);

		if ($w.getSubmission("Getcorecnt") != null) {
			$w.deleteSubmission("Getcorecnt");
		}

		var prcMsg = "작업을 처리중입니다.";

		if (ngmv.isUseProgress == false) {
			prcMsg = "";
		}
		/** *********************** 통신하기 시작 ************************ */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : "Getcorecnt",
			"ref" : "",
			"target" : "",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : "synchronous",
			"processMsg" : prcMsg,
			"submitDoneHandler" : function(e) {

				var result = e.responseJSON;
				var params = result.params;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					errorCd.push(errorJSON.ErrorCode);
					errorMsg.push(errorJSON.ErrorMsg);
				}

				ngmv.errorCode = errorCd;
				ngmv.errorMsg = errorMsg;

				ngmf.getArrayTranErrorMsg(ngmv.errorCode, ngmv.errorMsg, "SELF",
						"", nIdx, TrxCode, Sdate, ScreenName, StartTime, 0,
						GLV["__smElapsedTime" + nIdx], GLV["__smGlobalId"+ nIdx]);

				var ngmv_RtnCd = GLD.GDS_OUTHEAD.getCellData(0, "Rt_Cd");

				// 처리결과가 비정상종료인 경우
				if (ngmv_RtnCd == "1") {
					ngmf.__setErrorMsg(ngmv.errorCode, ngmv.errorMsg, "ZNGMSDBS00020_TR01", "");
					strRtn = "";
				} else {
					strRtn = GLD.GDS_SEARCH.getCellData(0, "oparam1");
				}

				$w.deleteSubmission("Getcorecnt");

			}, // [end] "submitDoneHandler"
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			} // [end] "submitErrorHandler"
		};

		$w.createSubmission(submissionObj); // 서브미션 생성
		$w.executeSubmission("Getcorecnt"); // 서브미션 실행

		return strRtn;
		/** *********************** 통신하기 종료 ************************ */
		
	} catch (e) {
		ngmf._error("[ngmf.getCoreCnt] Exception :: ", e);
	}

};

/**
 * DB Count(Core, 분리) 기능 처리
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} ScreenName :: I :: N :: :: 호출 Window ID
 * @param {Array} strInputObjList :: I :: N :: :: 검색 조건 Parameter List
 * @return {String} strRtn 반환문자열
 * @author js.Lee
 * @example tot_cnt_arch = ngmf.getArchCnt( ScreenName, inputObjList );
 * @exampleAsIs tot_cnt_arch = ToNumber(ngmf_GetArchCnt( ScreenName, inputObjList ));
 */
ngmf.getArchCnt = function(ScreenName, strInputObjList) {
	try {
		if (GLD.G_CLOSEFG == "6") {
			return;
		}

		var strRtn = "";
		var strArg = "";
		var nObjCnt = strInputObjList.length;
		var TrxCode = "ZNGMSDBS00030_TR01"; // Transaction Code

		ngmf.bizTrSettingStop(TrxCode);
		ScreenName = ngmf.apmScreenName(ScreenName);

		if (ngmf.makeHeadSet(TrxCode, ScreenName) != "OK") {
			return;
		}

		ngmf.clear(GLD.GDS_LOV);

		for ( var i = 0; i < nObjCnt; i++) {
			if (i == 0) {
				GLD.GDS_LOV.insertColumn("map_id", {
					'name' : "map_id",
					'dataType' : 'text'
				});
			} else {
				GLD.GDS_LOV.insertColumn("iparam" + i, {
					'name' : "iparam" + i,
					'dataType' : 'text'
				});
			}
		}

		var aIdx = GLD.GDS_LOV.insertRow();
		var nColCnt = GLD.GDS_LOV.cellIdList.length;

		for ( var i = 0; i < nColCnt; i++) {
			if (i == 0) {
				GLD.GDS_LOV.setCellData(aIdx, "map_id", strInputObjList[i]);
			} else if (i == 1) {
				if ((strInputObjList[1] == "")
						|| (ngmf.length(strInputObjList[1]) == 0)) {
					GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, "");
				} else
					GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, strInputObjList[i]);
			} else {
				GLD.GDS_LOV.setCellData(aIdx, "iparam" + i, strInputObjList[i]);
			}
		}

		var strUrl = ngmf.SVC_PATH + "/LOV" + "?mapid=" + strInputObjList[0];
		strUrl += "&Trx_code=" + TrxCode + "&ScreenName=" + ScreenName;
		strUrl += ngmv.fCloseAccount;

		var Sdate = ngmf.extGetHDTime();
		var StartTime = ngmf.timeM();
		var nIdx = GLV.G_iTrxCurIdx;

		StartTime = ngmf.trim(StartTime);
		strUrl = ngmf.preTrxCall(strUrl);

		if ($w.getSubmission("GetArchCnt") != null) {
			$w.deleteSubmission("GetArchCnt");
		}

		var prcMsg = "작업을 처리중입니다.";

		if (ngmv.isUseProgress == false) {
			prcMsg = "";
		}
		/** *********************** 통신하기 시작 ************************ */
		// 서브미션오브젝트 options
		var submissionObj = {
			"id" : "GetArchCnt",
			"ref" : "",
			"target" : "",
			"action" : strUrl,
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : "synchronous",
			"processMsg" : prcMsg,
			"submitDoneHandler" : function(e) {

				var result = e.responseJSON;
				var params = result.params;
				var errorCd = new Array(); // result.params.ErrorCode;
				var errorMsg = new Array(); // result.params.ErrorMsg;

				for ( var i = 0; i < params.length; i++) {
					var errorJSON = params[i];
					errorCd.push(errorJSON.ErrorCode);
					errorMsg.push(errorJSON.ErrorMsg);
				}

				ngmv.errorCode = errorCd;
				ngmv.errorMsg = errorMsg;

				ngmf.getArrayTranErrorMsg(ngmv.errorCode, ngmv.errorMsg, "SELF",
						"", nIdx, TrxCode, Sdate, ScreenName, StartTime, 0,
						GLV["__smElapsedTime" + nIdx],GLV["__smGlobalId" + nIdx]);

				var ngmv_RtnCd = GLD.GDS_OUTHEAD.getCellData(0, "Rt_Cd");

				// 처리결과가 비정상종료인 경우
				if (ngmv_RtnCd == "1") {
					ngmf.__setErrorMsg(ngmv.errorCode, ngmv.errorMsg,	"ZNGMSDBS00030_TR01", "");
					strRtn = "";
				} else {
					strRtn = GLD.GDS_SEARCH.getCellData(0, "oparam1");
				}

				$w.deleteSubmission("GetArchCnt");

			}, // [end] "submitDoneHandler"
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			} // [end] "submitErrorHandler"
		};

		$w.createSubmission(submissionObj); // 서브미션 생성
		$w.executeSubmission("GetArchCnt"); // 서브미션 실행

		return strRtn;
		/** *********************** 통신하기 종료 ************************ */	
	} catch (e) {
		ngmf._error("[ngmf.getArchCnt] Exception :: ", e);
	}
};

/**
 * Push 비동기 결과 수신 (서비스에서 EAI호출 후 사용)(타모듈)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} TrxCode :: I :: N :: :: Transaction 코드
 * @param {Number} intWaitTime :: I :: N :: :: Wait Time 설정
 * @param {Number} CallCnt :: I :: N :: :: Error Message
 * @param {String} TimeoutCallBack :: I :: N :: :: Timeout CallBack Script
 * @return 없음
 * @author js.Lee
 * @example ngmf.pushAsyncWait(TrxCode, "f_PushCallBack_00011", F_TimeOut, "f_PushCallTimeout_00011");
 * @exampleAsIs ngmf_PushAsyncWait(TrxCode, "f_PushCallBack", F_TimeOut, "f_PushCallTimeout");
 */
ngmf.pushAsyncWait = function(TrxCode, CallBackFunc, intWaitTime, TimeoutCallBack) {

	try {
		ngmf._debug("ngmf_PushAsyncWait in...");
		ngmf._debug("TrxCode        =" + TrxCode);
		ngmf._debug("CallBackFunc   =" + CallBackFunc);
		ngmf._debug("intWaitTime    =" + intWaitTime);
		ngmf._debug("TimeoutCallBack=" + TimeoutCallBack);

		if (GLV.G_CLOSEFG == "6") return;

		var strOrgFormNm = ngmf.getFormID();
		var strWHandle = ngmf.extGetWinHandle();

		// Handle set : 10byte
		strWHandle = ngmf.rpad(ngmf.trim(strWHandle), " ", 9) + " ";
		GLD.GDS_INHEAD.setCellData(0, "Handle_Id", strWHandle);

		// IP set :22Byte
		var strIPAddr = ngmf.getGlobalValue("g_Ngms_IpAddr");
		strIPAddr = ngmf.rpad(strIPAddr, " ", 22);
		GLD.GDS_INHEAD.setCellData(0, "Ngms_IpAddr", strIPAddr);

		var ngmv_UserData = TrxCode + "*" + CallBackFunc + "*" + strOrgFormNm + "*" + strWHandle;
		// TrxCode : TR code
		// CallBackFunc : CALLBACK함수명
		// strOrgFormNm : 화면명
		// strWHandle : WINDOW HANDLE

		var strKey = ngmf.mid(strWHandle, 0, 9) + strIPAddr;
		ngmf._debug("PUSH KEY:" + strKey);
		ngmf._debug("PUSH ngmv_UserData:" + ngmv_UserData);

		var strGubun = "ORD" + ngmf.trim(ngmf.getGlobalValue("g_Ngms_IpAddr"));

		if (GLV.G_FORMUSEFG == "M") {
			// --- PUSH 대기 실행 -----------------------------------------------
			if (ngmf.isValid("XDS_EAIPUSH_ASYNC_WAIT")) {
				XDS_EAIPUSH_ASYNC_WAIT.removeAll();
			} else {
				ngmf._debug("[알림] 다음 메세지는 무시하십시오==>Variable을 찾는데 실패 하였습니다");
				ngmf.createDataList("XDS_EAIPUSH_ASYNC_WAIT");

				XDS_EAIPUSH_ASYNC_WAIT.bind("ondataload", function(e) {
					ngmf.xdsEaiPushASyncWaitOnLoadCompleted(XDS_EAIPUSH_ASYNC_WAIT, ngmv.errorCode,ngmv.errorMsg, 0);
				});
			}

			ngmf.ext.push.add(strOrgFormNm, strKey, strGubun,"XDS_EAIPUSH_ASYNC_WAIT", 0, 0, 0, ngmv_UserData);
			ngmf._debug(XDS_EAIPUSH_ASYNC_WAIT.getAllXML());
			// ------------------------------------------------------------------

		} else {
			ngmf.alert("MDI에서 실행 가능합니다.");
			return;
		}

		ngmv.pushAsyncTimeoutCallBack = TimeoutCallBack;
		ngmf.pushAsyncJobSetTimer(intWaitTime);
	} catch (e) {
		// prograssbar 실행종료
		scwin.setBatchProgress(false);
		ngmf._error("[ngmf.pushAsyncWait] Exception :: ", e);
		throw e;
	}

};

/**
 * Push Transaction 실행 후 PUSH Return
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {Object} obj :: I :: N :: :: 대상 Object
 * @param {String} nErrorCode :: I :: N :: :: Error Code
 * @param {String} nErrorMsg :: I :: N :: :: Error Message
 * @param {String} nReason :: I :: N :: :: Dataset Loading 원인 표시
 * @return 없음
 * @author js.Lee
 * @example ngmf.xdsEaiPushASyncWaitOnLoadCompleted(obj, nErrorCode, strErrorMsg, nReason);
 * @exampleAsIs Create("Dataset","XDS_EAIPUSH_ASYNC_WAIT",'OnLoadCompleted="ngmf_XDS_EAI_PUSH_ASYNC_WAIT_OnLoadCompleted"');
 */
ngmf.xdsEaiPushASyncWaitOnLoadCompleted = function(obj, nErrorCode, strErrorMsg, nReason) {
	try {
		WebSquare.util.clearInterval(420);
		ngmf._debug("===> Welcome To The ngmf.xdsEaiPushASyncWaitOnLoadCompleted!!!!");
		//ngmf._debug(XDS_EAIPUSH_ASYNC_WAIT.getAllXML());

		// CallBack Return값 처리 - 임시
		var strForm = ngmf.trim(XDS_EAIPUSH_ASYNC_WAIT.getCellData(0, "screen"));
		var strKey = ngmf.rpad(XDS_EAIPUSH_ASYNC_WAIT.getCellData(0, "eventkey"), ' ', 31);
		var strFile = ngmf.trim(XDS_EAIPUSH_ASYNC_WAIT.getCellData(0,"filename"));
		var strMsg = ngmf.trim(XDS_EAIPUSH_ASYNC_WAIT.getCellData(0, "msglist"));
		var strUserDataList = ngmf.trim(XDS_EAIPUSH_ASYNC_WAIT.getCellData(0,"UserData"));

		// arrUserData[0] : TR code
		// arrUserData[1] : CALLBACK함수명
		// arrUserData[2] : 화면명
		// arrUserData[3] : WINDOW HANDLE
		var arrUserData = strUserDataList.split("*");

		ngmf._debug("=== EAI Push Async CallBack==========================================>");
		ngmf._debug("[strKey]" + strKey);
		ngmf._debug("[strFile]" + strFile);
		ngmf._debug("[strMsg]" + strMsg);
		ngmf._debug("[strUserDataList]" + strUserDataList);

		if (ngmf.isExistFunc(arrUserData[1])) {
			var outdata = strMsg.split("|");
			eval(arrUserData[1] + "(outdata)");
		}

	} catch (e) {
		// prograssbar 실행종료
		scwin.setBatchProgress(false);
		ngmf._error("[ngmf.xdsEaiPushASyncWaitOnLoadCompleted] Exception :: ", e);
		throw e;
	}
};

/**
 * Push 비동기 수신작업(ngmf_PushAsyncWait) 수행 시 TimeOut Check(타모듈)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {Number} intTime :: I :: N :: :: TimeOut 시간
 * @return 없음
 * @author js.Lee
 * @example ngmf.pushAsyncJobSetTimer(100000) ;
 * @exampleAsIs ngmf_PushAsyncJobSetTimer(intWaitTime);
 */
ngmf.pushAsyncJobSetTimer = function(intTime) {
	ngmf._debug("ngmf_PushAsyncJobSetTimer in..");

	if (typeof intTime == "undefined" || !intTime || Number(intTime) == 0) {
		intTime = 10;
	}

	intTime = Number(intTime) * 1000;
	var thisWin = ngmf.getWindow(ngmf.getFormID());

	WebSquare.util.setInterval(function() {
		ngmf.pushAsyncOnTimer(thisWin, 420);
	}, {
		"key" : 420,
		"delay" : intTime
	});
};

/**
 * Push 비동기 수신작업(ngmf_PushAsyncWait) 수행 시 TimeOut Check(타모듈)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {Obeject} obj :: I :: N :: :: 대상 Object
 * @param {Number} nEventID :: I :: N :: :: 이벤트아이디
 * @param {Number} delayTime :: I :: N :: :: 연기시간
 * @return 없음
 * @author js.Lee
 * @example ngmf.pushAsyncOnTimer(obj, 200, 1000) ;
 * @exampleAsIs this.OnTimer = "ngmf_PushAsyncOnTimer";
 */
ngmf.pushAsyncOnTimer = function(obj, nEventID) {
	ngmf._debug("ngmf_PushAsyncOnTimer in...");

	if (nEventID != 420) return;

	WebSquare.util.clearInterval(nEventID);

	ngmf._debug(XDS_EAIPUSH_ASYNC_WAIT.getAllData());
	ngmf._debug("ngmv.pushAsyncTimeoutCallBack="+ ngmv.pushAsyncTimeoutCallBack);

	if (ngmf.isExistFunc(ngmv.pushAsyncTimeoutCallBack)) {
		eval(ngmv.pushAsyncTimeoutCallBack + "(obj,nEventID)");
	} else {
		ngmf.alert("작업 요청시간을 초과하였습니다. Timeout callback함수를 지정해 주세요.");
	}

	ngmf.pushAsyncInit();
};

/**
 * Push 비동기 작업초기화(타모듈)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @return 없음
 * @author js.Lee
 * @example ngmf.pushAsyncInit();
 * @exampleAsIs ngmf_PushAsyncInit();
 */
ngmf.pushAsyncInit = function() {
	ngmf._debug("ngmf.pushAsyncInit in...");
	var strWHandle = ngmf.trim(ngmf.extGetWinHandle());

	// Handle set : 10byte
	strWHandle = ngmf.rpad(ngmf.trim(strWHandle), " ", 9) + " " ;
	GLD.GDS_INHEAD.setCellData(0, "Handle_Id", strWHandle);

	// IP set :22Byte
	var strIPAddr = ngmf.getGlobalValue("g_Ngms_IpAddr");
	strIPAddr = ngmf.rpad(strIPAddr, " ", 22);
	GLD.GDS_INHEAD.setCellData(0, "Ngms_IpAddr", strIPAddr);

	var strKey = ngmf.mid(strWHandle, 0, 9) + strIPAddr;

	ngmf._debug("strKey=[" + strKey + "]");

	var strGubun = "ORD" + ngmf.trim(ngmf.getGlobalValue("g_Ngms_IpAddr"));

	// kill timmer
	WebSquare.util.clearInterval(420);
	ngmf.ext.push.del(ngmf.getFormID(), strKey, strGubun, "XDS_EAIPUSH_ASYNC_WAIT");

	ngmv.pushAsyncTimeoutCallBack = null;
};
// 2009-07-09 Append 김주일차장/ORDER End

/**
 * SSL Flag 상태 체크 함수(타모듈)
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @return {boolean} SSL 적용 : TRUE , SSL 미적용 : FALSE
 * @author js.Lee
 * @example ngmf.sslFlagstatus();
 * @exampleAsIs if (ngmf_ssl_flag_status()) {}
 */
ngmf.sslFlagstatus = function() {
	if (GLV["G_TRX_SSL_FLAG_VAL"] == "Y") {
		if (GLV["G_TRX_SSL_FLAG_ORGTYP_VAL"] == "Y") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
	return false;
};

/**
 * Service Call (내부함수: 개발자사용금지)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} syncType :: I :: N :: :: 동기, 비동기
 * @param {String} trxCode :: I :: N :: :: Transaction Code
 * @param {String} screenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} arg :: I :: Y :: :: 처리 Argument
 * @param {String} inData :: I :: N :: :: Input DataList
 * @param {String} outData :: I :: N :: :: Output DataList
 * @param {String} callBackFunc :: I :: Y :: :: CallBack Script
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {String} ngmv_ErrProc :: I :: Y :: :: Error 발생 시 Dataset 설정 Check
 * @param {boolean} encflag :: I :: Y :: false :: 암호호여부
 * @param {String} inPutStr :: I :: Y :: :: 입력문자열
 * @param {String} outPutStr :: I :: Y :: :: 출력문자열
 * @param {boolean} isProcessMsg :: I :: Y :: true :: 프로그레스바 작동여부
 * @return 없음
 * @author js.Lee
 * @example ngmf.transaction("synchronous", trxCode, screenName, arg, inData, outData, callBackFunc, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr, outPutStr, isProcessMsg);
 * @exampleAsIs 없음
 */
ngmf.transaction = function(syncType, trxCode, screenName, arg, inData,
		outData, callBackFunc, ngmv_MsgFg, ngmv_ErrProc, encflag, inPutStr,
		outPutStr, isProcessMsg) {

	if (GLV.G_CLOSEFG == "6") {
		return;
	}
	if (typeof screenName == "undefined" || !screenName) screenName = ngmf.apmScreenName();
	ngmf.bizTrSettingStop(trxCode);

	var wFrameArray = screenName.split("::");
	var wFrameId = "";

	if (wFrameArray.length > 1) {
		screenName = ngmf.apmScreenName(wFrameArray[0]);
		wFrameId = wFrameArray[1];
	} else {
		screenName = ngmf.apmScreenName(screenName);
	}

	/* MSK 평문전송 제거 PJT - Start */
	ngmv.fScreenName = screenName;
	/* MSK 평문전송 제거 PJT - End */
	screenName = ngmf.apmScreenName(screenName);

	if (ngmv.fScreenName != screenName) {
		screenName = ngmv.fScreenName;
	}

	var strSSO = "commonsvc=0";
	var inParam = null;
	var outParam = null;

	if (ngmf.trim(inData) == "") {
		inParam = new Array();
	} else {
		inParam = inData.split(",");
	}

	if (ngmf.trim(outData) == "") {
		outParam = new Array();
	} else {
		outParam = outData.split(",");
	}

	if (ngmf.trim(wFrameId).length > 0) {

		for ( var i = 0; i < inParam.length; i++) {
			var orgInparam = ngmf.trim(inParam[i]);
			inParam[i] = wFrameId + "_" + orgInparam;

			if (typeof ngmf.object(inParam[i]) === "undefined") {
				inParam[i] = orgInparam;
			}
		}

		for ( var i = 0; i < outParam.length; i++) {
			var orgOutParam = ngmf.trim(outParam[i]);
			outParam[i] = wFrameId + "_" + orgOutParam;

			if (typeof ngmf.object(outParam[i]) === "undefined") {
				outParam[i] = orgOutParam;
			}
		}

		if (typeof callBackFunc !== "undefined") {
			if (ngmf.isFunction(callBackFunc)) {
				callBackFunc = ngmf._pushCallbackFunc(callBackFunc);
			} else {
				if (callBackFunc != null && callBackFunc != "") {

					var orgCallBackFunc = ngmf.trim(callBackFunc);
					callBackFunc = wFrameId + "_" + orgCallBackFunc;

					if (typeof eval(callBackFunc) === "undefined") {
						callBackFunc = orgCallBackFunc;
					}
				}
			}
		}
	}

	/** ****************DataList 존재여부 체크******************* */

	for ( var i = 0; i < inParam.length; i++) {
		var dlID = ngmf.trim(inParam[i]);

		if (dlID.indexOf(":") > -1) {
			var tmpArr = dlID.split(":");
			dlID = tmpArr[0];
		}

		if (typeof ngmf.object(dlID) === "undefined") {
			ngmf._error(dlID + " 가 존재하지 않습니다.(ngmf.transaction)");
		}
	}

	/** ****************DataList 존재여부 체크******************* */

	for ( var i = 0; i < outParam.length; i++) {
		var dlID = ngmf.trim(outParam[i]);

		if (dlID.indexOf(":") > -1) {
			var tmpArr = dlID.split(":");
			dlID = tmpArr[0];
		}

		if (typeof ngmf.object(dlID) === "undefined") {
			ngmf._error(dlID + " 가 존재하지 않습니다.(ngmf.transaction)");
		}
	}

	var inCnt = inParam.length;
	var outCnt = outParam.length;
	var strNewDs = "";
	var strErrDsList = "";
	var errProc = ngmv_ErrProc || "";
	var encflag = encflag || false;
	var inPutStr = inPutStr || "";
	var outPutStr = outPutStr || "";

	// ref 만들기
	var reqTempArr = new Array();
	for ( var i = 0; i < inCnt; i++) {

		var pId = ngmf.trim(inParam[i]);
		var pKey = "input" + (i + 1);// ngmf.lpad(""+(i+1),"0",2);

		if (pId.indexOf(":U") > -1 || pId.indexOf(":u") > -1) {
			pId = pId.replace(":U", "");
			pId = pId.replace(":u", "");
			reqTempArr.push('{"id":"' + pId + '", "action":"modified", "key":"' + pKey + '"}');
		} else {
			reqTempArr.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
		}

		// Error인 경우에도 Data받을 건지에 대한 처리
		if (errProc.toUpperCase() == "ERR_RCV") {
			var upperInparam = ngmf.trim(inParam[i].toUpperCase().replace(":U", ""));
			strNewDs = "NGMMIPLAT_" + upperInparam;

			if (typeof ngmf.object(strNewDs) === "undefined") {

				var options = {
					id : strNewDs,
					type : "dataList",
					option : {
						"baseNode" : "list",
						"repeatNode" : "map",
						"saveRemovedData" : "true"
					},
					columnInfo : []
				};

				$w.data.create(options);

			} else {
				ngmf.clear(strNewDs);
			}

			ngmf.assign(strNewDs, inParam[i]);

			if (i == 0) {
				strErrDsList = strNewDs;
			} else {
				strErrDsList += "," + strNewDs;
			}
		}

		if (encflag) {
			if (inPutStr.indexOf(inParam[i]) >= 0) {
				var tempStr = "input" + (i + 1);// "input"+ngmf.lpad((i+1),"0",2);
				inPutStr = inPutStr.replace(inParam[i], tempStr);
			}
		}
	}

	// target 만들기
	var resTempArr = new Array();
	for ( var i = 0; i < outCnt; i++) {
		var pId = ngmf.trim(outParam[i]);
		var pKey = "output" + (i + 1);
		resTempArr.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
	}

	if (ngmf.makeHeadSet(trxCode, screenName) != "OK") {

		if (GLV.G_FORMUSEFG == "M") {
			ngmf.setSystemMsg("헤더 정보를 로드하는데 실패 하였습니다.");
		}

		return;
	}

	var strFg = null;

	if (errProc.toUpperCase() == "ERR_RCV") {
		strFg = 1;
	} else {
		strFg = 0;
	}

	var strUrl = null;

	if (encflag) {
		strUrl = "ENCNGM::EncSVC" + "?" + strSSO + "&rtcode=" + strFg
				+ "&Trx_code=" + trxCode + "&ScreenName=" + screenName
				+ ngmv.fCloseAccount;
	} else {
		strUrl = ngmf.SVC_PATH + "/SVC" + "?" + strSSO + "&rtcode=" + strFg
				+ "&Trx_code=" + trxCode + "&ScreenName=" + screenName
				+ ngmv.fCloseAccount;
	}

	if (ngmf.length(ngmv_MsgFg) == 0) {
		ngmv_MsgFg = "NONE";
	}

	// function object이면 String으로 변환
	if (ngmf.isFunction(callBackFunc)) {
		callBackFunc = ngmf._pushCallbackFunc(callBackFunc);
	}

	if (syncType == "asynchronous") {

		trxCode = ngmf.trim(trxCode) + "|" + ngmf.trim(callBackFunc) + "|" + ngmf.trim(ngmv_MsgFg);

		if (errProc.toUpperCase() == "ERR_RCV" && ngmf.length(strErrDsList) > 0) {
			trxCode += "|" + strErrDsList;
		} else {
			trxCode += "|";
		}
	}

	if (ngmv_MsgFg.toUpperCase() != "SELF" && !trxCode.startsWith("ZNGMSLOG00010_TR01")) {
		ngmf.setSystemMsg("");
	}

	var sDate = ngmf.extGetHDTime(); // ExtGetHDTime() ==> 웹스퀘어에서는 현재 구현불가
	var startTime = ngmf.timeM();
	startTime = ngmf.trim(startTime);
	strUrl = ngmf.preTrxCall(strUrl);
	var nIdx = GLV.G_iTrxCurIdx;

	trxCode += "|" + nIdx;
	trxCode += "|" + sDate + "&" + screenName + "&" + startTime;
	trxCode += "|" + inData;

	if (encflag) {
		arg += "&inputEncGbn=" + inPutStr;
		arg += "&outputEncGbn=" + outPutStr;
	}

	strUrl += arg + "&_useLayout=true";
	// ngmf._error("request log=" + strUrl);

	if ($w.getSubmission(trxCode) != null) {
		$w.deleteSubmission(trxCode);
	}

	var processMsg = "작업을 처리중입니다.";

	if (typeof isProcessMsg !== "undefined") {

		if (isProcessMsg == false) {
			processMsg = "";
		} else {
			if (ngmv.isUseProgress == false) {
				processMsg = "";
			}
		}

	} else {
		if (ngmv.isUseProgress == false) {
			processMsg = "";
		}
	}

	var requestDataListStr = "";

	if (reqTempArr.length > 0) {
		requestDataListStr = "data:json, [" + reqTempArr.join(',') + "]";
	}

	/** *********************** 통신하기 시작 ************************ */
	// 서브미션오브젝트 options
	var submissionObj = {
		"id" : trxCode,
		"ref" : requestDataListStr,
		"target" : "",
		"action" : strUrl,
		"method" : "post",
		"mediatype" : "application/json",
		"encoding" : "UTF-8",
		"instance" : "",
		"replace" : "",
		"mode" : syncType,
		"processMsg" : processMsg,
		"submitHandler" : function(e) {
			//ngmf._debug("submitHandler는 submit 시작전에 실행됩니다.");
		},
		"submitDoneHandler" : function(e) {
			var result = e.responseJSON;
			var params = result.params;
			var dataInfo = result.dataInfo;
			var errorCd = new Array(); // result.params.ErrorCode;
			var errorMsg = new Array(); // result.params.ErrorMsg;
			var orgTrxCode = trxCode.split("|");

			for ( var i = 0; i < params.length; i++) {
				var errorJSON = params[i];

				var cd = errorJSON.ErrorCode;
				var msg = errorJSON.ErrorMsg;

				errorCd.push(cd);
				errorMsg.push(msg);

				if (msg.indexOf("^^rs^^") > -1) {
					var msgArr = msg.split("^^rs^^");
					if (cd != msgArr[1]) {
						errorCd.push(msgArr[1]);
					}
				}

			}

			// 통신성공인 경우
			if (Number(errorCd[0]) == 0 || ngmv_ErrProc == "ERR_RCV") {

				for ( var i = 0; i < resTempArr.length; i++) {

					var jsonRow = JSON.parse(resTempArr[i]);
					var id = jsonRow.id;
					var key = jsonRow.key;
					var dsArr = new Array();
					var ds = null;

					if (id.indexOf(":") > -1) {

						dsArr = id.split(":");
						id = dsArr[0];
						ds = ngmf.object(id);

						if (dsArr[1].toUpperCase() == "C") {
							ngmf.clear(ds);
						}

					} else {
						ds = ngmf.object(id);
					}

					var output = result[key];

					for ( var j = 0; j < dataInfo.length; j++) {
						if (dataInfo[j].id == key) {
							for ( var jj = 0; jj < dataInfo[j].columns.column.length; jj++) {
								var id = dataInfo[j].columns.column[jj].id;
								var type = dataInfo[j].columns.column[jj].type;
								var options = {
									name : id,
									dataType : type
								};

								ngmf.insertColumn(ds, id, options);
							}

						}
					}

					if (typeof output === "undefined" || output == null) {
						ds.setJSON([], false);
					} else {
						ds.setJSON(output, false);
					}

					ds.reform();

				}

			}

			ngmv.errorCode = errorCd;
			ngmv.errorMsg = errorMsg;

			if (syncType == "synchronous") {
				ngmf.syncAPMCallBack(trxCode, ngmv.errorCode, ngmv.errorMsg);
				ngmf.getArrayTranErrorMsg(ngmv.errorCode, ngmv.errorMsg,
						ngmv_MsgFg, strErrDsList, nIdx, orgTrxCode[0], sDate,
						screenName, startTime, 0, GLV["__smElapsedTime" + nIdx], GLV["__smGlobalId" + nIdx],
						inData, "SYNC", callBackFunc);
			} else if (syncType == "asynchronous") {
				ngmf.result(trxCode, ngmv.errorCode, ngmv.errorMsg);
			}

			$w.deleteSubmission(trxCode);

		}, // [end] "submitDoneHandler"
		"submitErrorHandler" : function(e) {
			ngmf._errorHandlingMsg(e);
		} // [end] "submitErrorHandler"
	};

	$w.createSubmission(submissionObj); // 서브미션 생성
	$w.executeSubmission(trxCode); // 서브미션 실행
	/** *********************** 통신하기 종료 ************************ */
};

/**
 * 공통통신 전처리
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {Object} submissionObj :: I :: N :: :: 서브미션
 * @return 없음
 * @author js.Lee
 * @example ngmf.presubmit(submissionObj);
 * @exampleAsIs 없음
 */
ngmf.presubmit = function(submissionObj) {
	try {
		var reqData = null;
		if (typeof submissionObj.requestData != "undefined" && submissionObj.requestData) {
			reqData = submissionObj.requestData;
		} else {
			reqData = ngmf.jsonParse(WebSquare.ModelUtil.getRefToReqData(submissionObj));
		}
		if (reqData == null)
			reqData = {};

		reqData.HEAD = GLD.GDS_INHEAD.getRowJSON(0);

		var submissionObjID = submissionObj.id;

		// 콤보조회인 경우
		if (submissionObjID.indexOf("ZNGMSCOD00010_TR02") > -1
				|| submissionObjID.indexOf("ZNGMSCOD00010_TR22") > -1
				|| submissionObjID.indexOf("ZNGMSCOD00010_TR12") > -1
				|| submissionObjID.indexOf("ZNGMSDBS00040_TR01") > -1
				|| submissionObjID.indexOf("ZNGMSCOD00010_TR01") > -1
				|| submissionObjID.indexOf("ZNGMSCOD00010_TR03") > -1) {
			// ngmf.combo() 등등 함수에서 GLD.GDS_INCOMBO가 파라미터로 이용된다.
			reqData.input1 = GLD.GDS_INCOMBO.getRowJSON(0);
		}

		// LOV
		if (submissionObjID.indexOf("Lovselect") > -1) {
			reqData.input1 = GLD.GDS_LOV.getRowJSON(0);
		}

		if (submissionObjID.indexOf("Getcorecnt") > -1
				|| submissionObjID.indexOf("GetArchCnt") > -1) {
			reqData.input1 = GLD.GDS_LOV.getRowJSON(0);
		}

		// UPLOAD ZNGMSFIL13110_TR01
		if (submissionObjID.indexOf("ZNGMSFIL13110_TR01") > -1
				|| submissionObjID.indexOf("ZNGMSFIL13710_TR31") > -1) {
			reqData.input1 = GLD.GDS_INDUMMY1.getRowJSON(0);
			reqData.input2 = GLD.GDS_INDUMMY2.getAllJSON();
		}

		// 성일호 추가 FileList ZNGMSFIL13480_TR01
		if (submissionObjID.indexOf("ZNGMSFIL13210_TR01") > -1
				|| submissionObjID.indexOf("ZNGMSFIL13480_TR01") > -1
				|| submissionObjID.indexOf("ZNGMSFIL13710_TR01") > -1) {

			if (GLD.GDS_INDUMMY1.getRowCount() > 0) {
				reqData.input1 = GLD.GDS_INDUMMY1.getRowJSON(0);
			}
		}

		// 상세권한별 화면항목조회인 경우
		if (submissionObjID.indexOf("ZNGMSDET10090_TR10") > -1) {
			// ngmf.combo() 등등 함수에서 GLD.GDS_INCOMBO가 파라미터로 이용된다.
			if (GLD.GDS_USER1.getRowCount()==1) {
				reqData.input1 = GLD.GDS_USER1.getRowJSON(0);
			} else {
				reqData.input1 = GLD.GDS_USER1.getAllJSON();
			}
		}

		// 미사용 프로그램 화면 리스트 체크
		if (submissionObjID.indexOf("ZNGMSAAT00020_TR01") > -1) {
			// ngmf.combo() 등등 함수에서 GLD.GDS_INCOMBO가 파라미터로 이용된다.
			if (GLD.GDS_USELESS_FORM_PERMIT_IN.getRowCount() == 1) {
				reqData.input1 = GLD.GDS_USELESS_FORM_PERMIT_IN.getRowJSON(0);
			} else {
				reqData.input1 = GLD.GDS_USELESS_FORM_PERMIT_IN.getAllJSON();
			} 
		}

		submissionObj.setRequestData(reqData);
	} catch (e) {
		ngmf._error("[ngmf.presubmit] Exception :: ", e);
		throw e;
	}
};

/**
 * 공통통신 후처리
 * 
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {Object} submitResultObj :: I :: N :: :: 서브미션결과Object
 * @param {Object} subMissionObj :: I :: N :: :: 서브미션Object
 * @return 없음
 * @author js.Lee
 * @update 2016.09.19 성일호 resultHeader 파싱로직추가
 * @example ngmf.callbackSubmit(submitResultObj, subMissionObj);
 * @exampleAsIs 없음
 */
ngmf.callbackSubmit = function(submitResultObj, subMissionObj) {
	var submissionObjID = subMissionObj.id;
	var result = submitResultObj["responseJSON"];
	var resultHeader = submitResultObj["responseHeadersJSON"];  
	// 공통출력헤드 설정
	if (typeof result.HEAD != "undefined" && result.HEAD) {
		ngmf.clear(GLD.GDS_OUTHEAD);
		var outHead = result.HEAD[0];

		$.each(outHead, function(key, value, index) {
			var options = {
				name : key,
				dataType : "text"
			};
			GLD.GDS_OUTHEAD.insertColumn(key, options);
		});

		GLD.GDS_OUTHEAD.setJSON(result.HEAD, false);
	}
	if (typeof resultHeader != "undefined" && resultHeader && resultHeader.length > 1) {
		resultHeader = JSON.parse(resultHeader);
		if(resultHeader["Rt_Cd"])
			GLD.GDS_OUTHEAD.setCellData(0,"Rt_Cd", resultHeader["Rt_Cd"]);	
	}
	if (submissionObjID.indexOf("Getcorecnt") > -1
			|| submissionObjID.indexOf("GetArchCnt") > -1) {
		GLD.GDS_SEARCH.setJSON(result.output1, false);
	}

	// 화면 상세권한 서비스
	if (submissionObjID.indexOf("ZNGMSDET10090_TR10") > -1) {
		GLD.GDS_USER2.setJSON(result.output1, false);
	}

	// 상세권한별 화면항목조회인 경우
	if (submissionObjID.indexOf("ZNGMSAAT00020_TR01") > -1) {
		GLD.GDS_USER2.setJSON(result.output1, false);
	}

	// 상세권한별 화면항목조회인 경우
	if (submissionObjID.indexOf("ZNGMSFIL13110_TR01") > -1) {
		GLD.GDS_OUTDUMMY.setJSON(result.output1, false);
	}

	// request data Clear
	subMissionObj.setRequestData(null);
};

/**
 * 에러 핸들링
 * 
 * @date 2016.07.26
 * @memberOf ngmf
 * @param {Object} e :: I :: N :: :: 결과Object
 * @return 없음
 * @author 성일호
 * @update  2016.07.26 성일호 SSO 반영을 위해 에러 핸들러 재구성
 * @example ngmf._errorHandlingMsg(e);
 * @exampleAsIs 없음
 */
ngmf._errorHandlingMsg = function(e) {
	try { 
		var errTxt = "";
		var errorNum = Number(e.responseStatusCode);
		if (errorNum == 400) {
			errTxt = ("클라이언트의 요청이 잘못된 구문으로 구성되었습니다.");
		} else if (errorNum == 401) {
			errTxt = ("접근이 허용되지 않습니다.");
		} else if (errorNum == 404) {
			errTxt = ("지정된 URL을 처리하기 위한 자원이 존재하지 않습니다.");
		} else if (errorNum == 405) {
			errTxt = ("요청된 메소드는 허용되지 않습니다.");
		} else if (errorNum == 500) {
			errTxt = ("서버 내부에 에러가 있습니다.");
		} else if (errorNum == 503) {
			errTxt = ("서버가 일시적으로 서비스를 제공할 수 없습니다.");
		} else if ( 200 < errorNum < 400){
			var obfuscator_submissionObj = WebSquare.ModelUtil.getSubmission(e.id);
				/*
				errorType: "resource-error"
				id: "ZNGMSCOD00070_TR01|scwin.mainCallBack|SELF||5|20160726171220101&ZNGMSMAN00010&1469520740101|GDS_INDUMMY2"
				requestBody: "{"input1":[{"msg_type":"","rowStatus":"C"},{"msg_type":"","rowStatus":"C"},{"msg_type":"C","rowStatus":"C"}],"HEAD":{"Trx_Code":"ZNGMSCOD00070_TR01","Ngms_UserId":"1000762324","Ngms_LogInId":"1109561","Ngms_EmpNum":"1109561","Ngms_OrgId":"1000238168","Ngms_HrOrgCd":"3801","Ngms_PostOrgCd":"A038010000","Ngms_PostSaleOrgCd":"A038010000","Ngms_SupSaleOrgCd":"A030360000","Ngms_IpAddr":"150.20.102.104","Ngms_BrTypCd":"300","Ngms_AuthId":"","Ngms_ConnOrgId":"1000238168","Ngms_ConnOrgCd":"A038010000","Ngms_ConnSaleOrgId":"1000238168","Ngms_ConnSaleOrgCd":"A038010000","Ngms_AuthTypPermCd":"EQ","Ngms_PostSaleOrgId":"1000238168","Ngms_SupSaleOrgId":"A030360000","Term_Type":"0","St_Stop":"0","St_Trace":"","Stx_Dt":"","Stx_Tm":"","Etx_Dt":"","Etx_Tm":"","Rt_Cd":"","Screen_Name":"ZNGMSMAN00010","Msg_Cnt":"0","Handle_Id":"761557226 ","Ngms_Filler1":"","Ngms_CoClCd":"T","Screen_Call_Trace":"Top-Top(ZNGMSMAN00010)-ZNGMSCOD00070_TR01","rowStatus":"C"}}"
				resourceUri: "/websquare/Service/SVCERR?commonsvc=0&rtcode=0&Trx_code=ZNGMSCOD00070_TR01&ScreenName=ZNGMSMAN00010&fCloseAccount=0&LogLvlGbn=&G_BizCd=null&G_Biz_Start_Time=null&__smReqSeq=6"
				responseBody: " "
				responseHeaders: "<header><name>Date</name><value>Tue, 26 Jul 2016 08</value><name>Server</name><value>Apache/2.4.17 (Win32) OpenSSL/1.0.2d</value><name>Connection</name><value>Keep-Alive</value><name>Keep-Alive</name><value>timeout=5, max=100</value><name>Content-Length</name><value>1674</value><name>Content-Type</name><value>text/html;charset=utf-8</value></header>"
				responseReasonPhrase: "Not Found"
				responseStatusCode: 404
				 */
			return;
		}

		ngmf.alert(errTxt + "(" + e.responseStatusCode + ")");

	} catch (e) {
		ngmf._error("[ngmf._errorHandlingMsg] Exception :: ", e);
	}
};

/**
 * Combo Service Call (Sync) - 공통 Table (Max - 10)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} comboType :: I :: N :: :: "1" ngmf.combo1(), "2" ngmf.combo2()
 * @param {String} ScreenName :: I :: N :: :: Service 호출 Window ID
 * @param {String} strInputObjList :: I :: N :: :: Input Dataset List
 * @param {String} outputList :: IO :: N :: :: Output Dataset List
 * @param {String} comboIdList :: IO :: Y :: :: Combo Object List
 * @param {String} callBackFunc :: I :: Y :: :: CallBack Script
 * @param {String} filterList :: I :: Y :: :: Data filter 조건 정의
 * @param {String} AddRowName :: I :: Y :: :: Data Row 추가 설정
 * @param {String} AddRowPos :: I :: Y :: :: 추가 Row Position 설정
 * @param {String} SortList :: I :: Y :: :: Sort 항목 정의
 * @param {String} SortOrdList :: I :: Y :: :: Sort Type 정의(Asc:A/Desc:D)
 * @param {String} ngmv_MsgFg :: I :: Y :: :: Message 처리(자동/설정)
 * @param {Boolean} strSyncFlag :: I :: Y :: :: Sync(true)/Async(false)
 * @param {String} newTrxCode :: I :: Y :: :: 새로운 Transaction Code
 * @return 없음
 * @author js.Lee
 * @update 2016.05.04 이동규 result.outData -> result[outData] 수정.
 * @example ngmf.comboTransaction("2", ScreenName, strInputObjList, outputList,
 *          <br/> comboIdList, callBackFunc, filterList, AddRowName, AddRowPos,
 *          <br/> SortList, SortOrdList, ngmv_MsgFg, strSyncFlag, newTrxCode);
 * @exampleAsIs 없음
 */
ngmf.comboTransaction = function(comboType, ScreenName, strInputObjList,
		outputList, comboIdList, callBackFunc, filterList, AddRowName,
		AddRowPos, SortList, SortOrdList, ngmv_MsgFg, strSyncFlag, newTrxCode) {
	if (typeof comboIdList == "undefined"  || !comboIdList ) {
		comboIdList = new Array();
	}

	if (typeof filterList == "undefined" || !filterList ) {
		filterList = new Array();
	}

	if (typeof AddRowName == "undefined" || !AddRowName ) {
		AddRowName = new Array();
	}

	if (typeof AddRowPos == "undefined" || !AddRowPos ) {
		AddRowPos = new Array();
	}

	if (typeof SortList == "undefined" || !SortList ) {
		SortList = new Array();
	}

	if (typeof SortOrdList == "undefined" || !SortOrdList ) {
		SortOrdList = new Array();
	}

	if (GLV.G_CLOSEFG == "6") {
		return;
	}

	var wFrameArray = ScreenName.split("::");
	var wFrameId = "";

	if (wFrameArray.length > 1) {
		ScreenName = ngmf.apmScreenName(wFrameArray[0]);
		wFrameId = ngmf.trim(wFrameArray[1]);
	} else {
		ScreenName = ngmf.apmScreenName(ScreenName);
	}

	var outList = outputList.split(",");
	if (wFrameId) {

		for ( var i = 0; i < outList.length; i++) {

			var orgOutList = ngmf.trim(outList[i]);
			outList[i] = wFrameId + "_" + orgOutList;

			if (typeof ngmf.object(outList[i]) === "undefined") {
				outList[i] = orgOutList;
			}
		}

		for ( var i = 0; i < comboIdList.length; i++) {

			var orgComboIdList = ngmf.trim(comboIdList[i]);
			comboIdList[i] = wFrameId + "_" + orgComboIdList;

			if (typeof ngmf.object(comboIdList[i]) === "undefined") {
				comboIdList[i] = orgComboIdList;
			}
		}

		if (typeof callBackFunc !== "undefined" && callBackFunc &&  !ngmf.isFunction(callBackFunc)) {
			var orgCallBackFunc = ngmf.trim(callBackFunc);
			callBackFunc = wFrameId + "_" + orgCallBackFunc;

			if (typeof  eval(callBackFunc) === "undefined") {
				callBackFunc = orgCallBackFunc;
			}
		}

	}

	/** ****************DataList 존재여부 체크******************* */

	for ( var i = 0; i < outList.length; i++) {
		var dlID = ngmf.trim(outList[i]);
		if (typeof ngmf.object(dlID) === "undefined") {
			ngmf._error(dlID + " 가 존재하지 않습니다.(ngmf.comboTransaction)");
		}
	}

	/** ****************DataList 존재여부 체크******************* */

	var nObjCnt = strInputObjList.length; // 조회조건수
	var nDataCnt = outList.length; // Output Dataset 갯수
	var outDataList = new Array();
	var TrxCode = "ZNGMSCOD00010_TR01"; // Transaction Code

	if (newTrxCode != undefined && newTrxCode != "undefined") {
		if (newTrxCode.length == 18) {
			TrxCode = newTrxCode;
		}
	}

	ngmf.bizTrSettingStop(TrxCode);

	// NGM Header를 생성한다.`
	if (ngmf.makeHeadSet(TrxCode, ScreenName) != "OK") {
		if (GLV.G_FORMUSEFG == "M") {
			ngmf.setSystemMsg("헤더 정보를 로드하는데 실패 하였습니다.");
		}
		return;
	}

	// ----------------------------------------------------------------------------------------
	// Dataset미선언시 처리
	// ----------------------------------------------------------------------------------------
	if (comboType == "2") {
		ngmf.combo2DSCheck(comboIdList, wFrameId);
	}

	// ----------------------------------------------------------------------------------------
	// Combo Cache 처리를 위한 부분
	// ----------------------------------------------------------------------------------------
	var nflag = null; // 조회조건 flag
	var isRow = -1;
	var objDs = null; 

	if (typeof strInputObjList[10] === "undefined" || !strInputObjList[10]) {
		nflag = "N";
	} else {
		nflag = strInputObjList[10];
	}

	strInputObjList[10] = "";

	for ( var i = 0; i < nDataCnt; i++) {
		isRow = -1;
		if (ngmf.length(ngmf.trim(strInputObjList[i])) > 0) {

			GLD.GDS_COMMONCOMBO.removeColumnFilterAll();

			var matchedIndexArr = GLD.GDS_COMMONCOMBO.getMatchedIndex("comm_cd_id", ngmf.trim(strInputObjList[i]), true);
			var matchedIndex = null;

			for ( var idx = 0; idx < matchedIndexArr.length; idx++) {
				matchedIndex = matchedIndexArr[idx];
				var matchTrxcode = GLD.GDS_COMMONCOMBO.getCellData( matchedIndex, "trxcode");
				if (matchTrxcode == TrxCode) {
					isRow = matchedIndex;
					break;
				}
			}

			// 공통에 있는경우
			if (isRow >= 0) { 
				var isValid = false;
				objDs = ngmf.object(ngmf.trim(outList[i]));

				if (typeof objDs == "undefined" || !objDs) {
					isValid = false;
				} else {
					isValid = true;
				}

				// 정상적인 dataset이면..
				if (isValid) {

					//
					//objDs.removeColumnFilterAll();
					// 데이터셋 데이터 전부삭제
					objDs.removeAll({skipSavingRemovedData : "true"});
					//ngmf.clear(objDs);

					// GLD.GDS_COMMONCOMBO의 컬럼Array
					var colList = GLD.GDS_COMMONCOMBO.cellIdList;

					// objDs에 GLD.GDS_COMMONCOMBO의 컬럼과 동일하게 만들기
					for ( var idx = 0; idx < colList.length; idx++) {
						var options = {
							'name' : colList[idx],
							'dataType' : 'text'
						};
						if (colList[idx] == "prt_seq") options["dataType"] = "number";
						ngmf.insertColumn( objDs,colList[idx], options);
					}

					var extGetHdTime = ngmf.extGetHDTime();
					var fCommCdId = strInputObjList[i];
					var fTrxcode = TrxCode;
					var fEffStaDt = extGetHdTime.substr(0, 8);
					var fEffEndDt = extGetHdTime.substr(0, 8);

					/*
					 * GLD.GDS_COMMONCOMBO의 comm_cd_id, trxcode, eff_sta_dt,
					 * eff_end_dt 컬럼의 값에 따라서 objDs에 data를 추가한다.
					 */
					var objDsArray = new Array();
					
					for ( var rowIndex = 0; rowIndex < matchedIndexArr.length; rowIndex++) {
						var rowData = GLD.GDS_COMMONCOMBO.getRowJSON(matchedIndexArr[rowIndex]);

						if (ngmf.trim(nflag.toUpperCase()) == "Y") {

							if (rowData.comm_cd_id == fCommCdId
									&& rowData.trxcode == fTrxcode
									&& rowData.eff_sta_dt <= fEffStaDt
									&& rowData.eff_end_dt >= fEffEndDt) {
								//var insertRow = objDs.insertRow();
								//objDs.setRowJSON(insertRow, rowData, true);
								objDsArray.push(rowData);
							}
						} else {
							if (rowData.comm_cd_id == fCommCdId && rowData.trxcode == fTrxcode) {
								//var insertRow = objDs.insertRow();
								//objDs.setRowJSON(insertRow, rowData, true);
								objDsArray.push(rowData);
							}
						}
					}
					if (objDsArray.length > 0) objDs.setJSON(objDsArray);
					
					
					// filtering
					if (filterList[i] && ngmf.length(filterList[i]) > 0) {
						if (ngmf.length(AddRowName[i]) > 0) {
							ngmf.filter(objDs, "(" + filterList[i] + ") || comm_cd_val == '*'");
						} else {
							ngmf.filter(objDs, filterList[i]);
						}
					}
					
					// Sort					
					var sortCol = ngmf.trim(SortList[i]);
					if (sortCol && ngmf.length(sortCol) > 0) {
						var sortOrd = ngmf.trim(SortOrdList[i]);
						if (sortOrd.toUpperCase() == "A") {
							objDs.sort(sortCol, 0); // 오름차순
						} else if (sortOrd.toUpperCase() == "D") {
							objDs.sort(sortCol, 1); // 내림차순
						}
					}
					
					// row add (전체/선택등 요청 Row추가)
					var addRowNm = ngmf.trim(AddRowName[i]);
					if (addRowNm && ngmf.length(addRowNm) > 0) {
						var addRowPos = ngmf.trim(AddRowPos[i]);
						// add position
						if (addRowPos.toUpperCase() == "F") {
							objDs.insertRow(0);
							objDs.setCellData(0, "comm_cd_val", "*");
							objDs.setCellData(0, "comm_cd_val_nm", addRowNm);
						} else {
							var row = objDs.insertRow();
							objDs.setCellData(row, "comm_cd_val", "*");
							objDs.setCellData(row, "comm_cd_val_nm", addRowNm);
						}

					}
					
					// temp list clear
					filterList[i] = "";
					strInputObjList[i] = "";
					outList[i] = "";
					AddRowName[i] = "";
					AddRowPos[i] = "";
				}
			}
		}
	}
	// ----------------------------------------------------------------------------------------

	strInputObjList[10] = nflag;
	// outlist가 하나도 없으면 return한다

	var nChkCnt = 0;
	for ( var i = 0; i < nDataCnt; i++) {
		if (ngmf.length(ngmf.trim(outList[i])) > 0) {
			nChkCnt += 1;
			break;
		}
	}

	if (nChkCnt == 0) {
		//var ExprCall = null;
		var xErrorCode = 0;
		var xErrorMsg = "";

		ngmv.errorCode = new Array();
		ngmv.errorMsg = new Array();
		ngmv.errorCode.push(xErrorCode);
		ngmv.errorMsg.push(xErrorMsg);

		ngmf.getArrayTranErrorMsg(ngmv.errorCode, ngmv.errorMsg, "SELF", "", -1);

		if (ngmf.isFunction(callBackFunc)) {
			callBackFunc(TrxCode, ngmv.errorCode, ngmv.errorMsg);
		} else if (typeof callBackFunc == "string") {
			if(typeof window[callBackFunc] == "function") window[callBackFunc](TrxCode, ngmv.errorCode, ngmv.errorMsg);
			else eval(callBackFunc + "(TrxCode, ngmv.errorCode, ngmv.errorMsg)");
		} 
		return;
	}

	// InDatasets의 Parameter의 Column을 생성한다.
	ngmf.clear(GLD.GDS_INCOMBO);

	nChkCnt = 0;
	for ( var i = 0; i < nObjCnt; i++) {

		if (ngmf.length(ngmf.trim(outList[i])) > 0) {
			if (i <= 9) {
				var colNm1 = "iparam" + (nChkCnt + 1);
				var colNm2 = "cparam" + (nChkCnt + 1);
				var options = {
					'name' : colNm1,
					'dataType' : 'text'
				};

				GLD.GDS_INCOMBO.insertColumn(colNm1, options);

				options = {
					'name' : colNm2,
					'dataType' : 'text'
				};

				GLD.GDS_INCOMBO.insertColumn(colNm2, options);
			}

			nChkCnt += 1;
		}
	}

	var options = {
		'name' : 'eff_flag',
		'dataType' : 'text'
	};

	GLD.GDS_INCOMBO.insertColumn("eff_flag", options);

	// InDatasets의 Parameter의 Column의 값을 생성한다.
	var iRow = GLD.GDS_INCOMBO.insertRow();
	nChkCnt = 0;
	for ( var i = 0; i < nObjCnt; i++) {
		if (ngmf.length(ngmf.trim(outList[i])) > 0) {
			GLD.GDS_INCOMBO.setCellData(iRow, "iparam" + (nChkCnt + 1), strInputObjList[i]);
			GLD.GDS_INCOMBO.setCellData(iRow, "cparam" + (nChkCnt + 1), comboIdList[i]);
			nChkCnt += 1;
		}
	}
	GLD.GDS_INCOMBO.setCellData(iRow, "eff_flag", nflag);

	// OutDatasets을 생성한다.
	// eff_flag는 output Dataset으로 구성하지 않는다
	for ( var i = 0; i < nDataCnt; i++) {
		var outStr = ngmf.trim(outList[i]);
		if (ngmf.length(outStr) > 0) {
			var pId = outStr;
			var pKey = strInputObjList[i];
			outDataList.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
		}
	}

	// ngmf.servicePort("COMBO")
	var strUrl = ngmf.SVC_PATH + "/COMBO" + "?Trx_code=" + TrxCode + "&ScreenName=" + ScreenName + ngmv.fCloseAccount;
	var svOutList = "";
	var svInList = "";
	var svFilterList = "";
	var svAddColList = "";
	var svAddColPosList = "";
	var svSortList = "";
	var svSortOrdList = "";

	// Cache/Filter/AddColumn을 위해 변수에 List를 넣고
	nChkCnt = 0;
	for ( var i = 0; i < nDataCnt; i++) {
		if (ngmf.length(ngmf.trim(outList[i])) > 0) {

			if (nChkCnt == 0) {
				svOutList = ngmf.trim(outList[i]);
				svInList = ngmf.trim(strInputObjList[i]);

				svFilterList = ngmf.trim(filterList[i]);
				svAddColList = ngmf.trim(AddRowName[i]);
				svAddColPosList = ngmf.trim(AddRowPos[i]);
				svSortList = ngmf.trim(SortList[i]);
				svSortOrdList = ngmf.trim(SortOrdList[i]);

			} else {
				svOutList += "," + ngmf.trim(outList[i]);
				svInList += "," + ngmf.trim(strInputObjList[i]);

				svFilterList += "," + ngmf.trim(filterList[i]);
				svAddColList += "," + ngmf.trim(AddRowName[i]);
				svAddColPosList += "," + ngmf.trim(AddRowPos[i]);
				svSortList += "," + ngmf.trim(SortList[i]);
				svSortOrdList += "," + ngmf.trim(SortOrdList[i]);
			}
			nChkCnt += 1;
		}
	}

	if (ngmf.length(ngmv_MsgFg) == 0) {
		ngmv_MsgFg = "NONE";
	}

	var trxCodeArr = new Array();
	trxCodeArr.push(TrxCode); //trxCodeArr[0]
	trxCodeArr.push(callBackFunc); //trxCodeArr[1]
	trxCodeArr.push(ngmv_MsgFg); //trxCodeArr[2]
	trxCodeArr.push(svOutList); //trxCodeArr[3]
	trxCodeArr.push(svInList); //trxCodeArr[4]
	trxCodeArr.push(svFilterList); //trxCodeArr[5]
	trxCodeArr.push(svAddColList); //trxCodeArr[6]
	trxCodeArr.push(svAddColPosList); //trxCodeArr[7]
	trxCodeArr.push(svSortList); //trxCodeArr[8]
	trxCodeArr.push(svSortOrdList); //trxCodeArr[9]

	var Sdate = ngmf.extGetHDTime();

	// 웹스퀘어에서는 구현불가
	var StartTime = ngmf.timeM();
	StartTime = ngmf.trim(StartTime);
	strUrl = ngmf.preTrxCall(strUrl);
	strUrl = strUrl + "&_useLayout=true";

	var nIdx = GLV.G_iTrxCurIdx || -1;
	var submissionId = TrxCode + Sdate + "&" + ScreenName + "&" + StartTime;

	trxCodeArr.push(nIdx ); //trxCodeArr[10]
	trxCodeArr.push(Sdate + "&" + ScreenName + "&" + StartTime); //trxCodeArr[11]
	trxCodeArr.push("COMBO:" + svInList); //trxCodeArr[12]

	var submissionMode = "synchronous";

	if (typeof strSyncFlag === "undefined") {
		strSyncFlag = true;
	}

	if (strSyncFlag) {
		trxCodeArr.push("SYNC"); //trxCodeArr[13]
		submissionMode = "synchronous";
	} else {
		trxCodeArr.push("ASYNC"); //trxCodeArr[13]
		submissionMode = "asynchronous";
	}

	trxCodeArr.push(ngmf.trim(nflag.toUpperCase())); //trxCodeArr[14]
	trxCodeArr.push(wFrameId); //trxCodeArr[15]
	/** *********************** 통신하기 시작 ************************ */

	var prcMsg = "작업을 처리중입니다.";
	if (ngmv.isUseProgress == false) {
		prcMsg = "";
	}
	
	// 서브미션오브젝트 options
	var submissionObj = {
		"id" : submissionId,
		"ref" : "",
		"target" : "",
		"action" : strUrl,
		"method" : "post",
		"mediatype" : "application/json",
		"encoding" : "UTF-8",
		"instance" : "",
		"replace" : "",
		"mode" : submissionMode,
		"processMsg" : prcMsg,
		"submitHandler" : function(e) {
			//ngmf._debug("submitHandler는 submit 시작전에 실행됩니다.");
		},
		"submitDoneHandler" : function(e) {
			var result = e.responseJSON;
			var dataInfo = result.dataInfo;
			var params = result.params;
			var errorCd = new Array(); // result.params.ErrorCode;
			var errorMsg = new Array(); // result.params.ErrorMsg;

			for ( var i = 0; i < params.length; i++) {
				var errorJSON = params[i];
				errorCd.push(errorJSON.ErrorCode);
				errorMsg.push(errorJSON.ErrorMsg);
			}

			ngmv.errorCode = errorCd;
			ngmv.errorMsg = errorMsg;

			for ( var i = 0; i < outDataList.length; i++) {

				var outDataJSON = JSON.parse(outDataList[i]);
				var outputId = outDataJSON.id;
				var outputKey = outDataJSON.key;
				var outputDs = ngmf.object(outputId);
				var resOutput = result[outputKey];

				if (outputId.indexOf(":") > -1) {

					dsArr = outputId.split(":");
					outputId = dsArr[0];
					outputDs = ngmf.object(outputId);

					if (dsArr[1].toUpperCase() == "C") {
						ngmf.clear(outputDs);
					}

				} else {
					outputDs = ngmf.object(outputId);
				}

				for ( var j = 0; j < dataInfo.length; j++) {

					if (dataInfo[j].id == outputKey) {
						for ( var jj = 0; jj < dataInfo[j].columns.column.length; jj++) {
							var id = dataInfo[j].columns.column[jj].id;
							var type = dataInfo[j].columns.column[jj].type;
							var options = {
								name : id,
								dataType : type
							};
							ngmf.insertColumn(outputDs, id, options);
						}
					}
				}

				if (typeof resOutput === "undefined" || resOutput == null) {
					outputDs.setJSON([], false);
				} else {
					outputDs.setJSON(resOutput, false);
				}
				// ngmf._debug(outputDs.getAllJSON());
			}

			ngmf.comboSyncAPMCallBack(trxCodeArr, ngmv.errorCode, ngmv.errorMsg);
			ngmf.resultCombo(TrxCode, ngmv.errorCode, ngmv.errorMsg, trxCodeArr);
			$w.deleteSubmission(submissionId);

		}, // [end] "submitDoneHandler"
		"submitErrorHandler" : function(e) {
			ngmf._errorHandlingMsg(e);
		} // [end] "submitErrorHandler"

	};

	$w.createSubmission(submissionObj); // 서브미션 생성
	$w.executeSubmission(submissionId); // 서브미션 실행

	/** *********************** 통신하기 종료 ************************ */

};


ngmf.comboTransactionOld = function(comboType, ScreenName, strInputObjList,
		outputList, comboIdList, callBackFunc, filterList, AddRowName,
		AddRowPos, SortList, SortOrdList, ngmv_MsgFg, strSyncFlag, newTrxCode) {

	if (comboIdList == undefined || comboIdList == undefined || comboIdList == null) {
		comboIdList = new Array();
	}

	if (filterList == undefined || filterList == undefined || filterList == null) {
		filterList = new Array();
	}

	if (AddRowName == undefined || AddRowName == undefined || AddRowName == null) {
		AddRowName = new Array();
	}

	if (AddRowPos == undefined || AddRowPos == undefined || AddRowPos == null) {
		AddRowPos = new Array();
	}

	if (SortList == undefined || SortList == undefined || SortList == null) {
		SortList = new Array();
	}

	if (SortOrdList == undefined || SortOrdList == undefined || SortOrdList == null) {
		SortOrdList = new Array();
	}

	if (GLV.G_CLOSEFG == "6") {
		return;
	}

	var wFrameArray = ScreenName.split("::");
	var wFrameId = "";

	if (wFrameArray.length > 1) {
		ScreenName = ngmf.apmScreenName(wFrameArray[0]);
		wFrameId = wFrameArray[1];
	} else {
		ScreenName = ngmf.apmScreenName(ScreenName);
	}

	var outList = outputList.split(",");
	if (ngmf.trim(wFrameId).length > 0) {

		for ( var i = 0; i < outList.length; i++) {

			var orgOutList = ngmf.trim(outList[i]);
			outList[i] = wFrameId + "_" + orgOutList;

			if (typeof ngmf.object(outList[i]) === "undefined") {
				outList[i] = orgOutList;
			}
		}

		for ( var i = 0; i < comboIdList.length; i++) {

			var orgComboIdList = ngmf.trim(comboIdList[i]);
			comboIdList[i] = wFrameId + "_" + orgComboIdList;

			if (typeof ngmf.object(comboIdList[i]) === "undefined") {
				comboIdList[i] = orgComboIdList;
			}
		}

		if (typeof callBackFunc !== "undefined") {
			if (callBackFunc != null && callBackFunc != ""
					&& !ngmf.isFunction(callBackFunc)) {

				var orgCallBackFunc = ngmf.trim(callBackFunc);
				callBackFunc = wFrameId + "_" + orgCallBackFunc;

				if (typeof eval(callBackFunc) === "undefined") {
					callBackFunc = orgCallBackFunc;
				}
			}
		}

	}

	/** ****************DataList 존재여부 체크******************* */

	for ( var i = 0; i < outList.length; i++) {
		var dlID = ngmf.trim(outList[i]);
		if (typeof ngmf.object(dlID) === "undefined") {
			ngmf._error(dlID + " 가 존재하지 않습니다.(ngmf.comboTransaction)");
		}
	}

	/** ****************DataList 존재여부 체크******************* */

	var nObjCnt = strInputObjList.length; // 조회조건수
	var nDataCnt = outList.length; // Output Dataset 갯수
	var outDataList = new Array();
	var TrxCode = "ZNGMSCOD00010_TR01"; // Transaction Code

	if (newTrxCode != undefined && newTrxCode != "undefined") {
		if (newTrxCode.length == 18) {
			TrxCode = newTrxCode;
		}
	}

	ngmf.bizTrSettingStop(TrxCode);

	// NGM Header를 생성한다.`
	if (ngmf.makeHeadSet(TrxCode, ScreenName) != "OK") {

		if (GLV.G_FORMUSEFG == "M") {
			ngmf.setSystemMsg("헤더 정보를 로드하는데 실패 하였습니다.");
		}

		return;
	}

	// ----------------------------------------------------------------------------------------
	// Dataset미선언시 처리
	// ----------------------------------------------------------------------------------------
	if (comboType == "2") {
		ngmf.combo2DSCheck(comboIdList, wFrameId);
	}

	// ----------------------------------------------------------------------------------------
	// Combo Cache 처리를 위한 부분
	// ----------------------------------------------------------------------------------------
	var nflag = null; // 조회조건 flag
	var isRow = null;
	var objDs = null;

	if (typeof strInputObjList[10] === "undefined") {
		nflag = "N";
	} else {
		nflag = strInputObjList[10];
	}

	strInputObjList[10] = "";

	for ( var i = 0; i < nDataCnt; i++) {

		if (ngmf.length(ngmf.trim(strInputObjList[i])) > 0) {

			GLD.GDS_COMMONCOMBO.removeColumnFilterAll();

			var matchedIndexArr = GLD.GDS_COMMONCOMBO.getMatchedIndex(
					"comm_cd_id", ngmf.trim(strInputObjList[i]), true);
			var matchedIndex = null;

			for ( var idx = 0; idx < matchedIndexArr.length; idx++) {
				matchedIndex = matchedIndexArr[idx];
				var matchTrxcode = GLD.GDS_COMMONCOMBO.getCellData(
						matchedIndex, "trxcode");
				if (matchTrxcode == TrxCode) {
					isRow = matchedIndex;
				}
			}

			// 공통에 있는경우
			if (isRow >= 0) {

				var isValid = null;
				objDs = ngmf.object(ngmf.trim(outList[i]));

				if (isValid == undefined || isValid == "undefined") {
					isValid = false;
				} else {
					isValid = true;
				}

				// 정상적인 dataset이면..
				if (isValid) {

					// 데이터셋 데이터 전부삭제
					objDs.removeAll({skipSavingRemovedData : "true"});

					// GLD.GDS_COMMONCOMBO의 컬럼Array
					var colList = GLD.GDS_COMMONCOMBO.cellIdList;

					// objDs에 GLD.GDS_COMMONCOMBO의 컬럼과 동일하게 만들기
					for ( var idx = 0; idx < colList.length; idx++) {
						var options = {
							'name' : colList[idx],
							'dataType' : 'text'
						};
						if (colList[idx] == "prt_seq") options["dataType"] = "number";
						ngmf.insertColumn( objDs,colList[idx], options);
					}

					var extGetHdTime = ngmf.extGetHDTime();
					var fCommCdId = strInputObjList[i];
					var fTrxcode = TrxCode;
					var fEffStaDt = extGetHdTime.substr(0, 8);
					var fEffEndDt = extGetHdTime.substr(0, 8);

					/*
					 * GLD.GDS_COMMONCOMBO의 comm_cd_id, trxcode, eff_sta_dt,
					 * eff_end_dt 컬럼의 값에 따라서 objDs에 data를 추가한다.
					 */
					for ( var rowIndex = 0; rowIndex < GLD.GDS_COMMONCOMBO
							.getRowCount(); rowIndex++) {
						var rowData = GLD.GDS_COMMONCOMBO.getRowJSON(rowIndex);

						if (ngmf.trim(nflag.toUpperCase()) == "Y") {

							if (rowData.comm_cd_id == fCommCdId
									&& rowData.trxcode == fTrxcode
									&& rowData.eff_sta_dt <= fEffStaDt
									&& rowData.eff_end_dt >= fEffEndDt) {
								var insertRow = objDs.insertRow();
								objDs.setRowJSON(insertRow, rowData);
							}

						} else {

							if (rowData.comm_cd_id == fCommCdId && rowData.trxcode == fTrxcode) {
								var insertRow = objDs.insertRow();
								objDs.setRowJSON(rowData);
							}

						}
					}

					var sortCol = ngmf.trim(SortList[i]);

					// Sort
					if (ngmf.length(sortCol) > 0) {

						var sortOrd = ngmf.trim(SortOrdList[i]);

						if (sortOrd.toUpperCase() == "A") {
							objDs.sort(sortCol, 0); // 오름차순
						} else if (sortOrd.toUpperCase() == "D") {
							objDs.sort(sortCol, 1); // 내림차순
						}
					}

					var addRowNm = ngmf.trim(AddRowName[i]);

					// row add (전체/선택등 요청 Row추가)
					if (ngmf.length(addRowNm) > 0) {
						var addRowPos = ngmf.trim(AddRowPos[i]);

						// add position
						if (addRowPos.toUpperCase() == "F") {
							objDs.setCellData(0, "comm_cd_val", "*");
							objDs.setCellData(0, "comm_cd_val_nm", addRowNm);
						} else {
							var row = objDs.insertRow();
							objDs.setCellData(row, "comm_cd_val", "*");
							objDs.setCellData(row, "comm_cd_val_nm", addRowNm);
						}

					}

					// filtering
					if (ngmf.length(FilterList[i]) > 0) {
						if (ngmf.length(AddRowName[i]) > 0) {
							ngmf.filter(objNm, "(" + FilterList[i] + ") || comm_cd_val == '*'");
						} else {
							ngmf.filter(objNm, FilterList[i]);
						}
					}

					// temp list clear
					filterList[i] = "";
					strInputObjList[i] = "";
					outList[i] = "";
					AddRowName[i] = "";
					AddRowPos[i] = "";
				}
			}
		}
	}
	// ----------------------------------------------------------------------------------------

	strInputObjList[10] = nflag;
	// outlist가 하나도 없으면 return한다

	var nChkCnt = 0;
	for ( var i = 0; i < nDataCnt; i++) {
		if (ngmf.length(ngmf.trim(outList[i])) > 0) {
			nChkCnt += 1;
			break;
		}
	}

	if (nChkCnt == 0) {
		//var ExprCall = null;
		var xErrorCode = 0;
		var xErrorMsg = "";

		ngmv.errorCode = new Array();
		ngmv.errorMsg = new Array();
		ngmv.errorCode.push(xErrorCode);
		ngmv.errorMsg.push(xErrorMsg);

		ngmf.getArrayTranErrorMsg(ngmv.errorCode, ngmv.errorMsg, "SELF", "", -1);

		if (ngmf.isFunction(callBackFunc)) {
			callbackFunc(TrxCode, ngmv.errorCode, ngmv.errorMsg);
		} else {
			scwin[callBackFunc](TrxCode, ngmv.errorCode, ngmv.errorMsg);
			//ExprCall = callBackFunc + '(TrxCode, ngmv.errorCode, ngmv.errorMsg)';
			//eval('scwin.' + ExprCall);
			return;
		}

	}

	// InDatasets의 Parameter의 Column을 생성한다.
	ngmf.clear(GLD.GDS_INCOMBO);

	nChkCnt = 0;
	for ( var i = 0; i < nObjCnt; i++) {

		if (ngmf.length(ngmf.trim(outList[i])) > 0) {
			if (i <= 9) {
				var colNm1 = "iparam" + (nChkCnt + 1);
				var colNm2 = "cparam" + (nChkCnt + 1);
				var options = {
					'name' : colNm1,
					'dataType' : 'text'
				};

				GLD.GDS_INCOMBO.insertColumn(colNm1, options);

				options = {
					'name' : colNm2,
					'dataType' : 'text'
				};

				GLD.GDS_INCOMBO.insertColumn(colNm2, options);
			}

			nChkCnt += 1;
		}
	}

	var options = {
		'name' : 'eff_flag',
		'dataType' : 'text'
	};

	GLD.GDS_INCOMBO.insertColumn("eff_flag", options);

	// InDatasets의 Parameter의 Column의 값을 생성한다.
	var iRow = GLD.GDS_INCOMBO.insertRow();
	nChkCnt = 0;
	for ( var i = 0; i < nObjCnt; i++) {
		if (ngmf.length(ngmf.trim(outList[i])) > 0) {
			GLD.GDS_INCOMBO.setCellData(iRow, "iparam" + (nChkCnt + 1), strInputObjList[i]);
			GLD.GDS_INCOMBO.setCellData(iRow, "cparam" + (nChkCnt + 1), comboIdList[i]);
			nChkCnt += 1;
		}
	}
	GLD.GDS_INCOMBO.setCellData(iRow, "eff_flag", nflag);

	// OutDatasets을 생성한다.
	// eff_flag는 output Dataset으로 구성하지 않는다
	for ( var i = 0; i < nDataCnt; i++) {
		var outStr = ngmf.trim(outList[i]);
		if (ngmf.length(outStr) > 0) {
			var pId = outStr;
			var pKey = strInputObjList[i];
			outDataList.push('{"id":"' + pId + '", "key":"' + pKey + '"}');
		}
	}

	// ngmf.servicePort("COMBO")
	var strUrl = ngmf.SVC_PATH + "/COMBO" + "?Trx_code=" + TrxCode + "&ScreenName=" + ScreenName + ngmv.fCloseAccount;
	var svOutList = "";
	var svInList = "";
	var svFilterList = "";
	var svAddColList = "";
	var svAddColPosList = "";
	var svSortList = "";
	var svSortOrdList = "";

	// Cache/Filter/AddColumn을 위해 변수에 List를 넣고
	nChkCnt = 0;
	for ( var i = 0; i < nDataCnt; i++) {
		if (ngmf.length(ngmf.trim(outList[i])) > 0) {

			if (nChkCnt == 0) {
				svOutList = ngmf.trim(outList[i]);
				svInList = ngmf.trim(strInputObjList[i]);

				svFilterList = ngmf.trim(filterList[i]);
				svAddColList = ngmf.trim(AddRowName[i]);
				svAddColPosList = ngmf.trim(AddRowPos[i]);
				svSortList = ngmf.trim(SortList[i]);
				svSortOrdList = ngmf.trim(SortOrdList[i]);

			} else {
				svOutList += "," + ngmf.trim(outList[i]);
				svInList += "," + ngmf.trim(strInputObjList[i]);

				svFilterList += "," + ngmf.trim(filterList[i]);
				svAddColList += "," + ngmf.trim(AddRowName[i]);
				svAddColPosList += "," + ngmf.trim(AddRowPos[i]);
				svSortList += "," + ngmf.trim(SortList[i]);
				svSortOrdList += "," + ngmf.trim(SortOrdList[i]);
			}
			nChkCnt += 1;
		}
	}

	if (ngmf.length(ngmv_MsgFg) == 0) {
		ngmv_MsgFg = "NONE";
	}

	var trxCodeArr = new Array();
	trxCodeArr.push(TrxCode);
	trxCodeArr.push(callBackFunc);
	trxCodeArr.push(ngmv_MsgFg);
	trxCodeArr.push(svOutList);
	trxCodeArr.push(svInList);
	trxCodeArr.push(svFilterList);
	trxCodeArr.push(svAddColList);
	trxCodeArr.push(svAddColPosList);
	trxCodeArr.push(svSortList);
	trxCodeArr.push(svSortOrdList);
	/*
	 * TrxCode = ngmf.trim(TrxCode); TrxCode += "\t" + ngmf.trim(callBackFunc);
	 * TrxCode += "\t" + ngmf.trim(ngmv_MsgFg); TrxCode += "\t" +
	 * ngmf.trim(svOutList); TrxCode += "\t" + ngmf.trim(svInList); TrxCode +=
	 * "\t" + ngmf.trim(svFilterList); TrxCode += "\t" +
	 * ngmf.trim(svAddColList); TrxCode += "\t" + ngmf.trim(svAddColPosList);
	 * TrxCode += "\t" + ngmf.trim(svSortList); TrxCode += "\t" +
	 * ngmf.trim(svSortOrdList);
	 */

	var Sdate = ngmf.extGetHDTime();

	// 웹스퀘어에서는 구현불가
	var StartTime = ngmf.timeM();
	StartTime = ngmf.trim(StartTime);
	strUrl = ngmf.preTrxCall(strUrl);
	strUrl = strUrl + "&_useLayout=true";

	var nIdx = GLV.G_iTrxCurIdx;
	var submissionId = TrxCode + Sdate + "&" + ScreenName + "&" + StartTime;

	trxCodeArr.push(nIdx);
	trxCodeArr.push(Sdate + "&" + ScreenName + "&" + StartTime);
	trxCodeArr.push("COMBO:" + svInList);

	/*
	 * TrxCode += "\t" + nIdx; TrxCode += "\t" + Sdate + "&" + ScreenName + "&" +
	 * StartTime; TrxCode += "\t" + "COMBO:" + svInList; TrxCode += "\t";
	 */
	var submissionMode = "synchronous";

	if (typeof strSyncFlag === "undefined") {
		strSyncFlag = true;
	}

	if (strSyncFlag) {
		trxCodeArr.push("SYNC");
		trxCodeArr.push(ngmf.trim(nflag.toUpperCase()));
		// TrxCode += "SYNC";
		// TrxCode += "\t" + ngmf.trim(nflag.toUpperCase());
		submissionMode = "synchronous";
	} else {
		// TrxCode += "\t" + ngmf.trim(nflag.toUpperCase());
		trxCodeArr.push(ngmf.trim(nflag.toUpperCase()));
		submissionMode = "asynchronous";
	}
	/** *********************** 통신하기 시작 ************************ */

	var prcMsg = "작업을 처리중입니다.";
	if (ngmv.isUseProgress == false) {
		prcMsg = "";
	}

	// 서브미션오브젝트 options
	var submissionObj = {
		"id" : submissionId,
		"ref" : "",
		"target" : "",
		"action" : strUrl,
		"method" : "post",
		"mediatype" : "application/json",
		"encoding" : "UTF-8",
		"instance" : "",
		"replace" : "",
		"mode" : submissionMode,
		"processMsg" : prcMsg,
		"submitHandler" : function(e) {
			//ngmf._debug("submitHandler는 submit 시작전에 실행됩니다.");
		},
		"submitDoneHandler" : function(e) {
			var result = e.responseJSON;
			var dataInfo = result.dataInfo;
			var params = result.params;
			var errorCd = new Array(); // result.params.ErrorCode;
			var errorMsg = new Array(); // result.params.ErrorMsg;

			for ( var i = 0; i < params.length; i++) {
				var errorJSON = params[i];
				errorCd.push(errorJSON.ErrorCode);
				errorMsg.push(errorJSON.ErrorMsg);
			}

			ngmv.errorCode = errorCd;
			ngmv.errorMsg = errorMsg;

			for ( var i = 0; i < outDataList.length; i++) {

				var outDataJSON = JSON.parse(outDataList[i]);
				var outputId = outDataJSON.id;
				var outputKey = outDataJSON.key;
				var outputDs = ngmf.object(outputId);
				var resOutput = result[outputKey];

				if (outputId.indexOf(":") > -1) {

					dsArr = outputId.split(":");
					outputId = dsArr[0];
					outputDs = ngmf.object(outputId);

					if (dsArr[1].toUpperCase() == "C") {
						ngmf.clear(outputDs);
					}

				} else {
					outputDs = ngmf.object(outputId);
				}

				for ( var j = 0; j < dataInfo.length; j++) {

					if (dataInfo[j].id == outputKey) {
						for ( var jj = 0; jj < dataInfo[j].columns.column.length; jj++) {
							var id = dataInfo[j].columns.column[jj].id;
							var type = dataInfo[j].columns.column[jj].type;
							var options = {
								name : id,
								dataType : type
							};

							ngmf.insertColumn(outputDs, id, options);
						}

					}
				}

				if (typeof resOutput === "undefined" || resOutput == null) {
					outputDs.setJSON([], false);
				} else {
					outputDs.setJSON(resOutput, false);
				}

				// ngmf._debug(outputDs.getAllJSON());

			}

			ngmf.comboSyncAPMCallBack(trxCodeArr, ngmv.errorCode, ngmv.errorMsg);
			ngmf.resultCombo(TrxCode, ngmv.errorCode, ngmv.errorMsg, trxCodeArr);
			
			$w.deleteSubmission(submissionId);

		}, // [end] "submitDoneHandler"
		"submitErrorHandler" : function(e) {
			ngmf._errorHandlingMsg(e);
		} // [end] "submitErrorHandler"

	};

	$w.createSubmission(submissionObj); // 서브미션 생성
	$w.executeSubmission(submissionId); // 서브미션 실행

	/** *********************** 통신하기 종료 ************************ */

};
/**
 * 자신의 wframe id를 얻는다.
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {Object} pScwin :: I :: N :: :: scwin객체
 * @return wframe id
 * @author js.Lee
 * @example ngmf.getMyWframeId(scwin);
 * @exampleAsIs 없음
 */
ngmf.getMyWframeId = function(pScwin) {
	var wID = "";
	try {
		if (pScwin && typeof pScwin.$w != "undefined") {
			wID = pScwin.$w.getRuntimeId("scwin");
			wID = wID.replace("_scwin", "");
			if (wID == "scwin") wID = "";
			return wID;
		}
	} catch (e) {
		 ngmf._error("[ngmf.getMyWframeId] Exception :: ", e);
	}
	return wID;
};

/**
 * CallBack Script (Async)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} TrID :: I :: N :: :: Serivce Call ID
 * @param {Array} nErrorCode :: I :: N :: :: 에러코드
 * @param {Array} nErrorMsg :: I :: N :: :: 에러메시지
 * @return 없음
 * @author js.Lee
 * @example 없음
 * @exampleAsIs Transaction(TrxCode,strUrl,InDataList, OutDataList, arg, "ngmf_Result_AsyncAppend");
 */
ngmf.resultAsyncAppend = function(TrID, nErrorCode, nErrorMsg) {

};

/**
 * 통신 처리메시지 출력 여부 설정 (ngmf.promise.lov, ngmf.promise.appendData, ngmf.syncCOMCall,
 * ngmf.asyncCOMCall, ngmf.svcCombo ngmf.getCoreCnt, ngmf.getArchCnt,
 * ngmf.transaction,ngmf.comboTransaction)
 * 
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {Boolean} pBool :: I :: N :: :: 사용여부
 * @return 없음
 * @author js.Lee
 * @example ngmf.setUseProgressMsg(false);
 */
ngmf.setUseProgressMsg = function(pBool) {
	ngmv.isUseProgress = pBool;
};

ngmf._excuteZNGMSLOG00010 = function(pErrorCd, pErrorMsg, strTRX){
	try {  
		if(typeof pErrorMsg === "undefined" || pErrorMsg == null || pErrorMsg == "") return;
		if(typeof strTRX === "undefined" || strTRX == null || strTRX == "") return;
		
		var strMsgList 	= new Array();
		var strGlobalID = "";
		var currWinID 	= ngmf.getFormID();
		var strMsg		= "";

		for(var i=0; i<pErrorMsg.length; i++){
			
			var splitTempArr = new Array();
			if(pErrorMsg[i].indexOf("^^rs^^") > -1){
				splitTempArr = pErrorMsg[i].split("^^rs^^");
			}else{
				splitTempArr = pErrorMsg[i].split("\\");
			}
			
			var msgCd 		= splitTempArr[1];
			var msgStr 		= splitTempArr[2];
			var msgMoreStr 	= "";
			var arrangeMsg 	= "["+msgCd+"] "+ngmf.trim(msgStr);
			
			if(splitTempArr.length > 3){
				msgMoreStr 	= splitTempArr[3];
				
				if(ngmf.trim(msgMoreStr).length > 0){
					strGlobalID = msgMoreStr.substring(1,33);
					arrangeMsg += " More:"+msgMoreStr;
				}else{
					strGlobalID = "undefined globalID";
				} 
			}
			
			strMsgList.push(arrangeMsg);
			
		}
		
		if(strMsgList.length > 0) strMsg = strMsgList.join("");

		if(typeof DST_LOG00010_TR01 === "undefined"){
			ngmf.createDataList("DST_LOG00010_TR01");
			ngmf.insertColumn("DST_LOG00010_TR01", "glob_id", 			{"name": "glob_id", "dataType" : "text"});
			ngmf.insertColumn("DST_LOG00010_TR01", "pgm_id", 			{"name": "pgm_id", "dataType" : "text"});
			ngmf.insertColumn("DST_LOG00010_TR01", "online_svc_id", 	{"name": "online_svc_id", "dataType" : "text"});
			ngmf.insertColumn("DST_LOG00010_TR01", "atfil_id", 			{"name": "atfil_id", "dataType" : "text"});
			ngmf.insertColumn("DST_LOG00010_TR01", "err_msg_occr_ctt", 	{"name": "err_msg_occr_ctt", "dataType" : "text"});
			ngmf.insertColumn("DST_LOG00010_TR01", "user_ins_data_ctt", {"name": "user_ins_data_ctt", "dataType" : "text"});
		}else{
			DST_LOG00010_TR01.removeAll();				
		}
		
		DST_LOG00010_TR01.insertRow();
		DST_LOG00010_TR01.setCellData(0, "atfil_id",			0);
		DST_LOG00010_TR01.setCellData(0, "err_msg_occr_ctt",	strMsg);
		DST_LOG00010_TR01.setCellData(0, "glob_id",				strGlobalID);
		DST_LOG00010_TR01.setCellData(0, "online_svc_id",		strTRX);				
		DST_LOG00010_TR01.setCellData(0, "pgm_id",				currWinID);
		DST_LOG00010_TR01.setCellData(0, "user_ins_data_ctt",	"");
		
		//진행 메시지 사용 안함.
		ngmf.syncCall(
			"ZNGMSLOG00010_TR01", currWinID, "", "DST_LOG00010_TR01", "", 
			"", "", "", "", "", 
			"", false
		);
		ngmf._debug(strTRX);
		ngmf._debug(pErrorCd);
		ngmf._debug(pErrorMsg);
		ngmv.errorCode = pErrorCd;
		ngmv.errorMsg  = pErrorMsg;	
    } catch(e) { 
        ngmf._error("[ngmf._excuteZNGMSLOG00010] Exception :: ", e);
    }
};
/*
 * 빈함수 ---------------------------- ngmf.XDS_PUSH_BATCH_WAIT_OnLoadCompleted =
 * function(obj, nErrorCode,strErrorMsg, nReason) { };
 * ngmf.XDS_EAIPUSH_WAIT_OnLoadCompleted = function(obj, nErrorCode,
 * strErrorMsg,nReason) { };
 */
 

/**
*  JSP 호출등 임의의 URL 호출 처리를 위한 API
*
* @date 2016.06.10
* @memberOf ngmf 
* @param {String} trxCode :: I :: N :: :: Transaction Code
* @param {String} strUrl :: I :: N :: :: 호출 URL
* @param {String} inData :: I :: Y :: :: Input DataList
* @param {String} outData :: I :: Y :: :: Output DataList
* @param {String} arg :: I :: Y :: :: 처리 Argument
* @param {String} callBackFunc :: I :: Y :: :: CallBack Function
* @param {String} syncType :: I :: Y :: asynchronous :: 동기(synchronous), 비동기(asynchronous) 
* @param {boolean} isProcessMsg :: I :: Y :: false :: 프로그레스바 작동여부
* @param {Object} reqAjaxOptions :: I :: Y ::  :: 기타 옵션 제어
* @param {Object} WframScwin :: I :: Y ::  :: Wframe 사용시 필수, scwin 객체
* @return 없음
* @update 2016.07.06 성일호 cies.jsp 호출 기능 보강
* @author 성일호
* @example
  
 	        // OUT DATALIST 를 받아 처리할 경우
			ngmf.jspTransaction("LOGINCHECK", "/websquare/ngm_UserChk.jsp", "", "DS_USERCHK",{ssoFG:"NO"}
 			,function(trxCode, errorCdArr,errorMsgArr) { 
 				 if (DS_USERCHK && DS_USERCHK.getRowCount() > 0) ngmf.alert("성공");
 			});
 			// 직접 결과를 받아서 처리할 경우				
			ngmf.jspTransaction("LOGINCHECK", "/websquare/ngm_UserChk.jsp", "", "","FUNC=getImgBindList"
 			,function(trxCode, result) {
 				 if (Number(result[0]) == 0) {
 				  	ngmf.tracet("성공:: 이후로직 처리 하세요..");
 				 }
 			});

 			// 기타 옵션 제어 기본값 및 응용
			ngmf.jspTransaction("LOGINCHECK", "/websquare/ngm_UserChk.jsp", "", "",{ssoFG:"YES"}
 			,function(trxCode, result) {
 				 if (Number(result[0]) == 0) ngmf.alert("성공");
 			}, false, {   processMsg:""
 							,method:"get"
 							,waitTime:600000
 							,syncType: "asynchronous"
 							,requestHeader : {HTTP_SMUSER:"123456"}}); 	


		    // 외부 연동 JSP 호출시 샘플
		   if (typeof dst_code_input == "undefined") {
		    	ngmf.createDataList("dst_code_input", ["type"]);
		   } else {
		    	dst_code_input.removeAll();   
		   }
		   dst_code_input.setCellData(dst_code_input.insertRow(), "type","MSK_CLOSE_GBN");
		   
		   if (typeof dst_code_output == "undefined") {
		      	ngmf.createDataList("dst_code_output", ["type","code","value"]); 
		   } else {
		      	dst_code_output.removeAll(); 
		   }
		   ngmf.jspTransaction("type_code", "http://127.0.0.1:8100/websquare/cies.jsp", "dst_code_input", "dst_code_output","FUNC=type_code" ,null, false, { method:"post", syncType: "synchronous"}, scwin);
		   var yn = dst_code_output.getCellData(0,"value");
		   if(yn && yn == 'Y'){
		      	//여기성공시 로직 반영
		    } else {
		     	//여기 실패시 로직 반영
		      	ngmf.error("통신오류",ngmv["errorMsg"]);
		    }
*/
ngmf.jspTransaction = function( trxCode, strUrl, inData, outData, arg, callBackFunc, isProcessMsg, reqAjaxOptions, WframScwin) {
	try {
		var isParam = false;
		var reqDataObj = {};
		var reqData = "";
		var action = strUrl || "";
		var isArg = false;
		var wFramdId = null;
		
		if (typeof WframScwin != "undefined" && WframScwin && ngmf.getMyWframeId(WframScwin)) wFramdId = ngmf.getMyWframeId(WframScwin);
		
		var callbackParam = trxCode ; 
		
		var processMsg = "";
		var method = "get";
		var requestHeader =  {};
		var waitTime =  600000; // 600초
		var mode = "asynchronous";
		
		if (typeof reqAjaxOptions != "undefined" && reqAjaxOptions) {
			processMsg = reqAjaxOptions.processMsg || "";
			method = (reqAjaxOptions.method || "get").toLowerCase();
			requestHeader = reqAjaxOptions.requestHeader || {};
			waitTime = reqAjaxOptions.timeout || 600000; // 600초
			mode = reqAjaxOptions.syncType || "asynchronous"; 
		}
		
		// 파라미터를 먼저 json 형태로 변환함 
		if (typeof arg != "undefined" && arg) {
      		if (ngmf.isString(arg))  {
      			if (arg.indexOf("\"") > -1 || arg.indexOf("'") > -1 ) {
      				arg = ngmf._extractData(arg);
      			} else {
      				action = ngmf._getParamUrl (action, arg);
      			}
      		}
      		if (ngmf.isJSON(arg)) {
      			isParam = true;
      			reqDataObj = arg;
      			isArg = true;
      		} 
      	}
		
		if (isProcessMsg) WebSquare.layer.showProcessMessage("처리중입니다.");
		
		if (typeof inData != "undefined" && inData) {
			var datasetList = new Array();
			if (typeof inData == "string") {
				var inDataList = inData.split(",");
				for (var dataidx in inDataList) {
					if (inDataList[dataidx].startsWith("GLD")) {
						datasetList.push(GLD[inDataList[dataidx].replaceAll("GLD.","")]);
					} else if (wFramdId) {
						datasetList.push(ngmf.object(wFramdId + "_" +inDataList[dataidx]));
					} else {
						//wFramdId
						datasetList.push(ngmf.object(inDataList[dataidx]));
					}
				}
					 
			} else if (ngmf.isArray(inData) ) {
				datasetList = inData;
			}  else datasetList.push(inData);
			
			var idx = 1;
			var tmpReq = {};
			for ( var datasetIdx in datasetList) {
				if (datasetList.hasOwnProperty(datasetIdx) && datasetList[datasetIdx].getRowCount() > 0) {
					isParam = true;
					tmpReq["input" +idx] = datasetList[datasetIdx].getAllJSON();
					idx ++;
				}
			}
			if (isParam) {
				if (isArg)  action = ngmf._getParamUrl (action, reqDataObj);
				reqDataObj = {};
				ngmf.makeHeadSet(trxCode, ngmf.getFormID());
				reqDataObj = tmpReq;
				reqDataObj["HEAD"] = GLD.GDS_INHEAD.getRowJSON(0);
				method = "post";
			}
		}
		if (isParam) {
			if (method == "post") {
				reqData = JSON.stringify(reqDataObj);
			} else {
				reqData = "";
				action = ngmf._getParamUrl (action, reqDataObj);
			}
		}
		var AjaxCallptions = {
				timeout : waitTime,
				action : action,
				mode : mode,
				mediatype : "application/json",
				method : method,
				requestData : reqData,
				requestHeader : requestHeader,
				processMsg : processMsg,
				withCredentials : true,
				success : function( respObj) {
					try {
						var result = null;
						if (typeof respObj["responseJSON"] != "undefined")  result = respObj.responseJSON;
						else  result = JSON.parse(ngmf.trim(respObj.responseText));
						
						var params = result["params"];
						var dataInfo = result["dataInfo"];
						var errorCd = new Array(); // result.params.ErrorCode;
						var errorMsg = new Array(); // result.params.ErrorMsg; 
						for ( var i = 0; i < params.length; i++) {
							var errorJSON = params[i];
							errorCd.push(errorJSON["ErrorCode"]);
							errorMsg.push(errorJSON["ErrorMsg"]);

							if (errorJSON["ErrorMsg"] && errorJSON.ErrorMsg.indexOf("^^rs^^") > -1) {
								var msgArr = msg.split("^^rs^^");
								if (errorJSON["ErrorCode"] != msgArr[1]) {
									errorCd.push(msgArr[1]);
								}
							}
						}
						ngmv["errorCode"] = errorCd;
						ngmv["errorMsg"] = errorMsg;
						
						// 통신성공인 경우
						if (Number(errorCd[0]) == 0) {
							if (typeof outData != "undefined" && outData) {
								var datasetList = new Array();
								if (typeof outData == "string") {
									var outDataList = outData.split(",");
									for (var dataidx in outDataList){
										if (typeof ngmf.object(outDataList[dataidx]) == "undefined") datasetList.push( ngmf.createDataList(outDataList[dataidx]));
										else datasetList.push(ngmf.object(outDataList[dataidx]));
									}
										
								} else if (ngmf.isArray(outData) ) {
									datasetList = inData;
								}  else datasetList.push(outData);
								 
								for ( var idx = 1 ; idx <= datasetList.length ; idx ++) {
									var dataset = datasetList[idx-1];
									var outdataName = "output" + idx;
									if (dataInfo) {
										for ( var j = 0; j < dataInfo.length; j++) {
											if (dataInfo[j].id == outdataName) {
												//dataset 
												for ( var jj = 0; jj < dataInfo[j].columns.column.length; jj++) {
													var id = dataInfo[j].columns.column[jj].id;
													var type = dataInfo[j].columns.column[jj].type;
													var options = {
														name : id,
														dataType : type
													};
													ngmf.insertColumn(dataset, id, options);
												}
											}
										}
									}

									if (result[dataset.id]) outdataName = dataset.id;
									if (result[outdataName] && result[outdataName].length > 0) { 
										if (dataset.cellIdList.length == 0){
											$.each(result[outdataName][0], function(mapKey, mapValue, mapIdx){
												ngmf.insertColumn(dataset, mapKey, {
													name:		mapKey,
													dataType:	"text"
												}); 
											}); 
										}
										dataset.setJSON(result[outdataName], false);
									} 
									//dataset.reform();
									ngmv.errorCode = errorCd;
									ngmv.errorMsg = errorMsg;
								} 
							} else {
								ngmv.errorCode = errorCd;
								ngmv.errorMsg = errorMsg; 
							} 
						}

						if (typeof callBackFunc != "undefined" && callBackFunc) {
							ngmf._getCallBackFunction(callBackFunc)(callbackParam, result );
						}
					} catch (ex) {						
						ngmf._error("[ngmf.jspTransaction-ajax Success] Exception :: ", ex); 
						if (typeof callBackFunc != "undefined" && callBackFunc) {
							ngmf._getCallBackFunction(callBackFunc)(callbackParam, e);
						}
					}
					if (isProcessMsg) WebSquare.layer.hideProcessMessage();
				},
				error : function(e) {
					if (isProcessMsg) WebSquare.layer.hideProcessMessage();
					ngmf._errorHandlingMsg(e);
					if (typeof callBackFunc != "undefined" && callBackFunc) {
						ngmf._getCallBackFunction(callBackFunc)(callbackParam, e);
					}
				}
			}; 
		WebSquare.net.ajax(AjaxCallptions);
	} catch (ex) { 
		if (isProcessMsg) WebSquare.layer.hideProcessMessage();
		ngmf._error("[ngmf.jspTransaction] Exception :: ", ex);  
	}  
}; 

ngmf._getParamUrl = function( url, paramObj) {
	var retStr = ""; 
	try  {
		if (url.lastIndexOf("&") > 0) {
			url = url.substr(0,url.length -1 );
		}
		retStr = url;
		var paramObjStr = "";
		if (ngmf.isString(paramObj)) {
			paramObjStr = "&" + paramObj;
		} else if (typeof paramObj != "undefined" && paramObj) {
			for (param in paramObj) {
				if (typeof paramObj[param] == "object" )
					paramObjStr += "&" + param + "=" + WebSquare.text.URLEncoder(JSON.stringify(paramObj[param]));
				else paramObjStr += "&" + param + "=" + WebSquare.text.URLEncoder(paramObj[param]);
			}
		}
		
		if (paramObjStr){
			if (url.indexOf("?") > -1) {
				retStr = url + paramObjStr;
			} else {
				retStr = url + "?" + paramObjStr.substr(1);
			}
		}
	} catch(ex) {
		ngmf._error("[ngmf._getParamUrl] Exception :: ", ex);  
	}
	return retStr;
}; 

ngmf._setFormBatch = function (_bStatus) {
	try {
		if (GLV.G_FORMUSEFG != "M") return ;
		var bStatus = false;		
		if(typeof _bStatus != "undefined" ) bStatus = _bStatus;
		var targetId = ngmf.getFormID();
		
		var mainTabId = GLD["mainTab"].getSelectedTabID(); 
		
		if (ngmf.object(targetId) && bStatus) ngmf.enable(targetId, false);
		else if (ngmf.object(targetId) && GLD.ngmv["fmainBodyBatch"][mainTabId + "|" + targetId])  ngmf.enable(targetId, true);
			 
		if (ngmf.isPopup()) {
			GLD.ngmv["fmainBodyBatch"][mainTabId + "|" + WebSquare.parentObj.ngmf.getFormID()]  = bStatus;
		}
		GLD.ngmv["fmainBodyBatch"][mainTabId + "|" + targetId]  = bStatus;
		
	} catch(ex) {
		ngmf._error("[ngmf._setFormBatch] Exception :: ", ex);  
	}
}; 

ngmf._checkFormBatch = function (_formObjId) {
	var bCheck = false;
	try {
		if (GLV.G_FORMUSEFG != "M") return false;
		var formObjId = _formObjId;
		var mainTabId = GLD["mainTab"].getSelectedTabID();
		if (typeof _formObjId == "undefined" || !_formObjId) {
			formObjId =  ngmf.mdiTabs().getSelectedWindowId(); 
		} 
		if ( GLD.ngmv["fmainBodyBatch"][mainTabId + "|" + formObjId]) bCheck = true;  
	} catch(ex) {
		ngmf._error("[ngmf._checkFormBatch] Exception :: ", ex);  
	}
	return bCheck;
}; 


ngmf.callUscanUrl = function (iFrmId, tgtUrl) {
	if (!iFrmId) return;
	try {
		var _uscanWinFrmchk = false;
		var _uscanWin = document.getElementById(iFrmId);
	    if (_uscanWin != null ) {
	        _uscanWinFrmchk = true;
	    }
	    var _uscanWinDiv = null ;

	    if (!_uscanWinFrmchk) {
	        _uscanWinDiv = document.createElement("div");
	        _uscanWinDiv.id = "___uscanWinFrm__div";
	        _uscanWinDiv.style.width = "100%";
	        _uscanWinDiv.style.height = "500px";
	        _uscanWinDiv.style.visibility = "hidden";
	        document.body.appendChild(_uscanWinDiv);
	        _uscanWinDiv.innerHTML = "<iframe frameborder='0' id='"+iFrmId+"' name='"+iFrmId+"' scrolling='auto' style='width:100%; height:500px; display:none;' src='" + tgtUrl + "'></iframe>";
	        _uscanWin = document.getElementById(iFrmId);
	    } else {
	        _uscanWin.src = tgtUrl;
	    }
	    scvar["uscanIFrmId"] = iFrmId;
	} catch(e) {
		ngmf._error("ngmf.callUscanUrl Exception",e);
	}
};
