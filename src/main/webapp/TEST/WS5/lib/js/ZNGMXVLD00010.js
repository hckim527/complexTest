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
*  입력값이 (+), (-), 숫자로만 구성되어 있는지 체크한다.
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} sValue :: I :: N ::  :: 입력값
* @returns {String}
* @author 성일호
* @example ngmf.isNumber("+21.02"); //return Y
* @since
* @useMobile use 
*/
ngmf.isNumber = function(sValue) {
	var sReturnValue = "N";
	try {
		if (ngmf.isNull(sValue) == "Y" ) {
			return "N";
		}

		if (typeof sValue == "number" ) {
			return "Y";
		}

		if (sValue.split(".").length > 2) {
			return "N";
		}

		var iBit;
		for (var i=0; i<sValue.length; i++) {
			iBit = sValue.charAt(i);
			if (i==0) {
				if(!isNaN(parseInt(iBit))
					|| (iBit == "-" && sValue.substr(1,1) != ".")
					|| (iBit == "+" && sValue.substr(1,1) != ".")) {
					sReturnValue = "Y";
				} else {
					sReturnValue = "N";
					break;
				}
			} else {
				if(!isNaN(parseInt(iBit)) || (iBit == "." && ngmf.isNull( sValue.substr(i+1,1) )) == "N") {
					sReturnValue = "Y";
				} else {
					sReturnValue = "N";
					break;
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.isNumber] Exception :: ", e);
	}
    return sReturnValue;
};

/**
* 입력값이 숫자로만 구성되어 있는지 체크한다.
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} sValue :: I :: N ::  :: 입력값
* @returns {String} 입력값이 숫자형식이면 "Y", 숫자형식에 맞지 않으면 "N"
* @author 성일호
* @example ngmf.isNumberOnly("12345"); // return Y
* @since
* @useMobile use
*/
ngmf.isNumberOnly = function(sValue) {
	var sReturnValue = "N";
	try {
		var regEx = /[^0-9]/;
	
		if (ngmf.isNull(sValue) == "Y") {
			return sReturnValue;
		}
	
		if (sValue.search(regEx) == -1) {
			sReturnValue = "Y";
		}  else {
			sReturnValue = "N";
		}
	} catch (e) {
		ngmf._error("[ngmf.isValidateTime] Exception :: ", e);
	}	
	return sReturnValue;
};

/**
* 입력값에 특수문자가 포함되어 있는지 여부를 검사한다.
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} sValue :: I :: N ::  :: 입력값
* @returns {String} 특수문자가 있는 경우 "Y", 특수문자가 없는 경우 "N"
* @author 성일호
* @example ngmf.isSpecialChar("abc^%"); return Y
* @since
* @useMobile use
*/
ngmf.isSpecialChar = function(sValue) {
	var sReturnValue = "Y";
	try {	
		var iBit;
		var sStandard = "~!@#$%^&*-+./=_`{|}()\\?<>";
	
		if (ngmf.isNull(sValue) == "Y") {
			sReturnValue = "N";
		}
	
		for ( var i = 0 ; i < sValue.length ; i++ ) {
			iBit = sValue.substr( i, 1);
			if ( sStandard.indexOf(iBit)  == -1 ) {
				sReturnValue = "N";
			} else {
				sReturnValue = "Y";
				break;
			}
		};
	} catch (e) {
		ngmf._error("[ngmf.isValidateTime] Exception :: ", e);
	}
	return sReturnValue;
};

/**
 * 입력값에 특수문자(")가 포함되어 있는지 여부를 검사한다.
 * @date 2016. 03. 02.
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::  :: 입력값
 * @returns {String} 특수문자가 있는 경우 "Y", 특수문자가 없는 경우 "N"
 * @author 조지용
 * @example ngmf.isSpecialCharDQ('테스트 문자는 "def" 입니다.'); // return Y
 * @since
 * @useMobile use
 */
ngmf.isSpecialCharDQ = function(sValue) {
	var sReturnValue = "Y";
	try {	
		var iBit;
		var sStandard = "\"";
		
		if (ngmf.isNull(sValue) == "Y") {
			sReturnValue = "N";
		}
		
		for ( var i = 0 ; i < sValue.length ; i++ ) {
			iBit = sValue.substr( i, 1);
			if ( sStandard.indexOf(iBit)  == -1 ) {
				sReturnValue = "N";
			} else {
				sReturnValue = "Y";
				break;
			}
		};
	} catch (e) {
		ngmf._error("[ngmf.isSpecialCharDQ] Exception :: ", e);
	}
	return sReturnValue;
};

/**
* 입력값이 시간형식에 맞는지 체크한다.
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} sValue :: I :: N ::  ::  6자리 숫자로 된 시간형식
* @returns {String} 시간형식에 맞으면 'Y', 맞지 않으면 'N'
* @author 성일호
* @example ngmf.isValidateTime("235959"); return Y
* @since
* @useMobile use
*/
ngmf.isValidateTime = function(sValue) {
	var sReturnValue = "N";
	try {
		if (ngmf.isNull(sValue) == "Y"  || ngmf.isNumber(sValue) == "N"  || sValue.length != 6 ) {
			return "N";
		}

		var hh = parseInt(sValue.substr(0, 2));
		var mi = parseInt(sValue.substr(2, 2));
		var ss = parseInt(sValue.substr(4, 2));

		if((hh < 0 || hh > 23) || (mi < 0 || mi > 59)  || (ss < 0 || ss > 59)) {
			sReturnValue = "N";
		} else {
			sReturnValue = "Y";
		}		
	} catch (e) {
		ngmf._error("[ngmf.isValidateTime] Exception :: ", e);
	}
	return sReturnValue;
};

/**
* 입력값이 한글만으로 되어 있는지 체크한다.
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} sValue :: I :: N ::  :: 입력값
* @returns {String} 한글만 있는 경우 "Y", 한글 외 존재 하는 경우 "N"
* @author 성일호
* @example ngmf.isKor("성일호"); // return Y
* @since
* @useMobile use
*/
ngmf.isKor = function(word) {
	try {
		var c;
		for (var i = 0; i < word.length; i++) {
			c = word.charAt(i);
			if (!ngmf.isKorean(c) && ngmf.asc(c) != ngmf.asc(" ")) {
				return "N";
			};
		};		
	} catch (e) {
		ngmf._error("[ngmf.isKor] Exception :: ", e);
	}
	return "Y";
};

/**
* 입력값이 한글 문자여부.
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} str :: I :: N ::  :: 입력값
* @returns {Boolean} 한글 true, 한글 이외 false
* @author 성일호
* @example ngmf.isKorean("홍"); // return true
* @since
* @useMobile use
*/
ngmf.isKorean = function(str) {
	try {
		if (str != null && str.length > 0) {
			var locale = 0;
			for (var i = 0; i < str.length; i++) {
				locale = ngmf.getLocale(str.charAt(i));
			};
			if ((locale & ~0x3) == 0) {
				return true;
			};
		};
	} catch (e) {
		ngmf._error("[ngmf.isKorean] Exception :: ", e);
	} 
	return false;
};


/**
* 입력값이 한글음절, 숫자, 영문 대, 영문 소 여부.
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} str :: I :: N ::  :: 입력값
* @returns {Number} 한글음절(1), 한글자모(2), 숫자(4), 특수문자(8), 영문대(16), 영문소(32), 기타(48)
* @author 성일호
* @example ngmf.getLocale("홍"); return 0X1; // 1
* @since
* @useMobile use
*/
ngmf.getLocale = function(str) {
	var locale = 0;
	try {
		if (str.length > 0) {
			var charCode = str.charCodeAt(0);

			if (charCode >= 0XAC00 && charCode <= 0XD7A3) { // 한글음절.[ 44032 ~ 55203 ]
				locale = 0X1; // 1
			} else if ((charCode >= 0X1100 && charCode <= 0X11F9) || (charCode >= 0X3131 && charCode <= 0X318E)) { // 한글자모.[4352 ~ 4601]
				locale = 0X2; // 2
			} else if (charCode >= 0X30 && charCode <= 0X39) { // 숫자.[ 48 ~ 57 ]
				locale = 0X4; // 4
			} else if ((charCode >= 0X20 && charCode <= 0X2F) || (charCode >= 0X3A && charCode <= 0X40)
					|| (charCode >= 0X5B && charCode <= 0X60) || (charCode >= 0X7B && charCode <= 0X7E)) { // 특수문자
				locale = 0X8; // 8
			} else if (charCode >= 0X41 && charCode <= 0X5A) { // 영문 대.[ 65 ~ 90 ]
				locale = 0X10; // 16
			} else if (charCode >= 0X61 && charCode <= 0X7A) { // 영문 소.[ 97 ~ 122 ]
				locale = 0X20; // 32
			} else { // 기타
				locale = 0X30; // 48
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getLocale] Exception :: ", e);
	}
	return locale;
};

/**
* EMail 주소 형식에 맞는지 체크한다
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} sValue :: I :: N ::  :: 입력값
* @returns {String} EMail 형식에 맞으면 Y, 이외의 경우 N
* @author 성일호
* @example ngmf.isEmail("emailTest@email.com")
* @update 2016.02.06 영어 대문자 입력시 N 리턴 되는 문제 수정
* @update 2016.05.19 이동규 함수 내부 구현 수정(정규식표현식 오류)[재수정]
* @since
* @useMobile use
*/
ngmf.isEmail = function(sValue) {
	var retValue = "N";
	try {
		if (ngmf.isNull(sValue) == "Y") {
			return retValue;
		}
		sValue = sValue.toLowerCase();
		var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
		//var regExp = /[a-zA-Z0-9\*\-\_]+[a-zA-Z0-9\.\,\*\-\_]+@[a-zA-Z0-9\*\-]+[a-zA-Z0-9\.\,\*]\.[a-zA-Z0-9\*]+/;
		var chgStr = regExp.exec(sValue);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == sValue.length) {
			retValue = "Y";
		} else {
			retValue = "N";
		}
	} catch (e) {
		ngmf._error("[ngmf.isEmail] Exception :: ", e);
	}
    return retValue;
};

/**
* 주민(법인/사업자/외국인)번호 정합성 체크.
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} sGubun  :: I :: N ::  :: 구분 - (01 : 주민번호, 02 : 법인번호, 03 : 사업자번호 05 : 외국인등록번호)
* @param {String} sValue  :: I :: N ::  :: 주민(법인/사업자/외국인)번호
* @returns {String} 정합성에 부합되면 Y 이외의 경우 N
* @author 성일호
* @example ngmf.isCtzCorpNum("01", "9999999999999"); return Y
* @since
* @useMobile use
*/
ngmf.isCtzCorpNum = function(sGubun,sValue) {
	var rtnVal = "Y";
	try {
		// 초기 입력값 Validation
		if (ngmf.isNull(sGubun) == "Y" || ( sGubun != "01" && sGubun != "02" && sGubun != "03" && sGubun != "05" )) {
			var strMsg = ngmf.getMessage("ZNGMC0073", "&INPUT", "구분값이");
			if (strMsg.length > 0 ) ngmf.alert (strMsg);
			return "N";
		}

		if (ngmf.isNull(sValue) == "Y" ) {
			var strMsg = ngmf.getMessage("ZNGMC0073", "&INPUT", "입력값이");
			if (strMsg.length > 0 ) ngmf.alert (strMsg);
			return "N";
		}

		var regExp;
		if ( sGubun == "01" || sGubun == "02" || sGubun == "05") {
			regExp =  /[0-9]{13}/;
		} else {
			regExp =  /[0-9]{10}/;
		}
		var chgStr = regExp.exec(sValue);
		if (chgStr == null || ngmf.isNull(chgStr[0]) == "Y" || chgStr[0].length != sValue.length) {
			return "N";
		};

		// 주민등록번호 체크 "01"
		if (sGubun == "01") {
			var sJuminChkDgt = [2,3,4,5,6,7,8,9,2,3,4,5];
			var iSum = 0;
			rtnVal = "Y";

			sFNum = sValue.substr(0, 6);
			sLNum = sValue.substr(6);

			for (var ix = 0; ix < 12 ; ix++) {
				iSum += (parseInt(sValue.substr(ix, 1)) * sJuminChkDgt[ix]) ;
			}

			iSum = 11 - (iSum%11);
			iSum = iSum % 10;

			if (iSum != (parseInt(sValue.substr(12, 1)))) {
				rtnVal = "N";
			} else {
				rtnVal = "Y";
			}

			if ( parseInt(sLNum.substr(0, 1)) > 4 )  {
				rtnVal = "N";
			}

			return rtnVal;
		}

		// 법인번호 체크 "02"
		if ( sGubun == "02" )
		{
			var sOfficeChkDgt = [1,2,1,2,1,2,1,2,1,2,1,2];
			var iVal1 = 0;
			var iVal2 = 0;
			var iVal3 = 0;

			for (var ix = 0; ix < 12 ; ix++) {
				iVal1 = parseInt(sValue.substr(ix, 1)) * sOfficeChkDgt[ix] ;

				if (iVal1 >= 10) {
					iVal2 += iVal1 % 10 ;
				} else {
					iVal2 += iVal1 ;
				}
			}

			iVal3 = iVal2 % 10 ;

			if (iVal3 > 0) {
				iVal3 = 10 - iVal3 ;
			} else {
				iVal3 = 0;
			}

			if (sValue.substr(12, 1) != iVal3) {
				rtnVal = "N";
			} else {
				rtnVal = "Y";
			}
		}

		// 사업자등록번호 체크 "03"
		if ( sGubun == "03" ) {
			  sValue = sValue.trim();
			  if (sValue.length != 10) return "N";
			  if(sValue == "") return "N";
			  //아래의 로직에서 888-88-88888이면 무조건 통과되므로, 888-88-88888 이면 오류처리
			  if(sValue == "8888888888") return "N";

			  var sum = 0;
			  var sidliy = -1, sidchk = -1;
			  var getlist =new Array(10);
			  var chkvalue =new Array("1","3","7","1","3","7","1","3","5");

			  for(var i=0; i<10; i++) { getlist[i] = sValue.substring(i, i+1); }

			  for(var i=0; i<9; i++) { sum += getlist[i]*chkvalue[i]; }

			  sum = sum + parseInt((getlist[8]*5)/10, 10);
			  sidliy = sum % 10;
			  sidchk = 0;

			  if(sidliy != 0) { sidchk = 10 - sidliy; }
			  else { sidchk = 0; }
			  if(sidchk != getlist[9]) { return "N"; }
			  return "Y"; 
		}

		// 외국인 번호 체크 "05"
		if ( sGubun == "05" ) {
			var sJuminChkDgt = [2,3,4,5,6,7,8,9,2,3,4,5];
			var iOdd = 0;
			var iSum = 0;

			iOdd = parseInt(sValue.substr(7, 1))*10 + parseInt(sValue.substr(8, 1));
			if (iOdd%2 != 0 ) {
				rtnVal = "N";
			}

			if ( (parseInt(sValue.substr(11, 1)) !=6 )
					&& (parseInt(sValue.substr(11, 1)) !=7 )
					&& (parseInt(sValue.substr(11, 1)) !=8 )
					&& (parseInt(sValue.substr(11, 1)) !=9 ) ) {
				rtnVal = "N";
			}

			for (var ix = 0; ix < 12 ; ix++) {
				iSum += (parseInt(sValue.substr(ix, 1)) * sJuminChkDgt[ix]) ;
			}

			iSum = 11 - (iSum%11);
			if ( iSum >= 10 ) {
				iSum = iSum - 10;
			}

			iSum = iSum + 2;
			if ( iSum >= 10 ) {
				iSum = iSum - 10;
			}

			if (iSum != (parseInt(sValue.substr(12, 1)))) {
				rtnVal = "N";
			} else {
				rtnVal = "Y";
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.isCtzCorpNum] Exception :: ", e);
	}
	return rtnVal;
};


/**
* 주민일련번호로 주민(법인/사업자/외국인)번호 정합성 체크(서비스 호출)
* @date 2015. 10. 14.
* @memberOf ngmf
* @param {String} sGubun  :: I :: N ::  :: 구분 - (01 : 주민번호, 02 : 법인번호, 03 : 사업자번호 05 : 외국인등록번호)
* @param {String} sValue  :: I :: N ::  :: 주민일련번호
* @returns {String} 정합성에 부합되면 Y 이외의 경우 N
* @author 성일호
* @example ngmf.isCtzCorpNumEx("01", "9999999999999"); return Y
* @since
* @useMobile use
*/
ngmf.isCtzCorpNumEx = function(sGubun,sValue) {
	var retValue = "";
	try {
		var ds_in       = "dst_inputParam1";
		var ds_out 	  	= "dst_outputParam1";

		if (ngmf.isNull(sGubun) == "Y" || ngmf.isNull(sValue) == "Y" ) {
			return "";
		}
		var dst_inputParam1 = ngmf.createDataList("dst_inputParam1", ["gubun", "ctz_corp_biz_ser_num"]);
		var dst_outputParam1 = ngmf.createDataList("dst_outputParam1", ["chk_rslt"]);
		dst_inputParam1.insertRow(0);
		dst_inputParam1.setCellData(0, "gubun", sGubun);
		dst_inputParam1.setCellData(0, "ctz_corp_biz_ser_num", sValue);

		ngmf.syncCall("ZNGMSVLD00020_TR01", "SCR_COMMON", "", ds_in, ds_out, "");
		retValue = dst_outputParam1.getCellData(0, "chk_rslt");

		ngmf.destroyDataList("dst_inputParam1");
		ngmf.destroyDataList("dst_outputParam1");
	} catch (e) {
		ngmf._error("[ngmf.isCtzCorpNumEx] Exception :: ", e);
	}
	return retValue;
};

/**
* 주민(법인/사업자/외국인)번호/고객번호로 주민법인 일련번호 조회
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {String}  :: I :: Y ::  :: sCtzNum 주민(법인/사업자/외국인)번호
* @param {String}  :: I :: Y ::  :: sCustNum 고객번호
* @returns {String} 주민법인 일련번호
* @author 성일호
* @example	ngmf.getCtzCorpSerNum("주민번호", "고객번호");
* @since
* @useMobile use
*/
ngmf.getCtzCorpSerNum = function(sCtzNum,sCustNum) {
	var retValue = "";
	try {
		var ds_in = "dst_inputParam1";
		var ds_out = "dst_outputParam1";
		// Data Validation Check
		if (ngmf.isNull(sCtzNum) == "Y" && ngmf.isNull(sCustNum) == "Y" ) {
			return "";
		}
		var dst_inputParam1 = ngmf.createDataList("dst_inputParam1", ["cust_num", "ctz_corp_biz_num"]);
		var dst_outputParam1 = ngmf.createDataList("dst_outputParam1", ["ctz_corp_biz_ser_num"]);
		dst_inputParam1.insertRow(0);
		dst_inputParam1.setCellData(0, "cust_num", sCustNum ||"");
		dst_inputParam1.setCellData(0, "ctz_corp_biz_num", sCtzNum||"");

		ngmf.syncCall("ZNGMSVLD00020_TR02", "SCR_COMMON", "", ds_in, ds_out, "");
		retValue = dst_outputParam1.getCellData(0, "ctz_corp_biz_ser_num");

		ngmf.destroyDataList("dst_inputParam1");
		ngmf.destroyDataList("dst_outputParam1");
	} catch (e) {
		ngmf._error("[ngmf.getCtzCorpSerNum] Exception :: ", e);
	}
	return retValue;
};

/**
* 시간형식을 초형식으로 변환한다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {String} sValue  :: I :: N ::  :: 6자리 숫자로 된 시간형식
* @returns {Number}  초단위의 시간
* @author 성일호
* @example ngmf.timeToSec("235959"); //return 86399
* @since
* @useMobile use
*/
ngmf.timeToSec = function(sValue) {
	var sReturnValue = 0;
	try {
		if (ngmf.isValidateTime(sValue) == "Y") {
			sReturnValue =  parseInt(sValue.substr(0, 2))*3600
			                + parseInt(sValue.substr(2, 2))*60
			                + parseInt(sValue.substr(4, 2));
		}
	} catch (e) {
		ngmf._error("[ngmf.timeToSec] Exception :: ", e);
	}
	return sReturnValue;
};

/**
* 초형식을 시간형식으로 변환한다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {Number} sValue  :: I :: N ::  :: 초단위 시간
* @returns {String}  6자리 숫자로 된 시간형식
* @author 성일호
* @example ngmf.secToTim(86399); //return "235959"
* @since
* @useMobile use
*/
ngmf.secToTime = function(sValue) {
	var sReturnValue = ""	;
	try {
		if (ngmf.isNull(sValue) == "Y" || parseInt(sValue) < 0) {
			sReturnValue = "0";
		} else  {
			var iHH = Math.floor(parseInt(sValue)/3600);

			sReturnValue =  ngmf.lpad(iHH+"", "0", 2)
			              + ngmf.lpad(Math.floor((parseInt(sValue) - iHH*3600)/60)+"", "0", 2)
			              + ngmf.lpad(Math.floor((parseInt(sValue) - iHH*3600)%60)+"", "0", 2) ;
		}
	} catch (e) {
		ngmf._error("[ngmf.secToTime] Exception :: ", e);
	}
	return sReturnValue;
};

/**
* 시작시간과 종료시간의 시간차를 초단위로 구한다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {String} fromT  :: I :: N ::  :: 시작시간으로 6자리의 숫자로 된 내부시간형식
* @param {String} toT  :: I :: N ::  :: 종료시각으로 6자리의 숫자로 된 내부시간형식
* @returns {Number}  초단위의 시간
* @author 성일호
* @example ngmf.secBetweenTime("120000", "130000"); //3600
* @since
* @useMobile use
*/
ngmf.secBetweenTime = function(fromT, toT) {
	var sReturnValue = 0;
	try {
		if (ngmf.isValidateTime(fromT) == "Y" && ngmf.isValidateTime(toT) == "Y") {
			if (fromT <= toT) {
				sReturnValue = Math.floor((ngmf.timeToSec(toT) - ngmf.timeToSec(fromT)));
			};
		};
	} catch (e) {
		ngmf._error("[ngmf.secBetweenTime] Exception :: ", e);
	}
	return sReturnValue;
};

/**
* 시작시간에서 경과시간을 초를 더하거나 빼서 종료시간을 구한다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {String} sValue  :: I :: N ::  :: 6자리의 숫자로 된 내부시간형식
* @param {Number} iLapse :: I :: N ::  :: 초단위 경과시간
* @returns {String} 숫자로 된 내부시간형식
* @author 성일호
* @example ngmf.addSubSec("120000", 3600); //return "130000"
* @update 2016.02.06 입력값이 숫자이면 오류 발생 => 수정
* @since
* @useMobile use
*/
ngmf.addSubSec = function(sValue, iLapse) {
	try {
		var sTmpValue;
		if (ngmf.isNumber(iLapse) == "N") {
			var strMsg = ngmf.getMessage("ZNGMC1065", "&OBJECT", "경과시간이 숫자 형식이 ");
			if (strMsg.length > 0 ) ngmf.alert (strMsg);
			return "";
		};

		if ((ngmf.parseInt(iLapse) > 86399 || ngmf.parseInt(iLapse) < -86399)) {
			var strMsg = ngmf.getMessage("ZNGMC1062", "&OBJECT", "경과시간은 -86399 ~ 86399 사이의 값");
			if (strMsg.length > 0 ) ngmf.alert (strMsg);
			return "";
		}

		if (ngmf.isValidateTime(sValue) == "N") {
			var strMsg = ngmf.getMessage("ZNGMC1065", "&OBJECT", "알맞은 시간 유형이 ");
			if (strMsg.length > 0 ) ngmf.alert (strMsg);
			return "";
		}

		if(ngmf.parseInt(sValue) == 0) {
			sTmpValue = ngmf.parseInt(iLapse);
		} else {
			sTmpValue = ngmf.parseInt(ngmf.timeToSec(sValue)) + ngmf.parseInt(iLapse);
			sTmpValue = sTmpValue + 86400;
		};

		if(sTmpValue > 86399) {
			sTmpValue = sTmpValue - 86400;
		}
		return ngmf.secToTime(sTmpValue);
	} catch (e) {
		ngmf._error("[ngmf.addSubSec] Exception :: ", e);
	}
};

/**
* 입력받은 Number에 Comma를 추가한다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {String} sValue  :: I :: N ::  :: 입력값
* @returns {String} Comma가 포함된 문자
* @author 성일호
* @example ngmf.setComma("123456789"); //return "123,456,789"
* @since
* @useMobile use
*/
ngmf.setComma = function(sValue) {
	try {
		if (ngmf.isNumber(sValue) == "N") {
			return -1+"";
		}

		var reg = /(^[+-]?\d+)(\d{3})/;
		while(reg.test(sValue))
			sValue = sValue.replace(reg, '$1' + ',' + '$2');
	} catch (e) {
		ngmf._error("[ngmf.setComma] Exception :: ", e);
	}
	return sValue;
};

/**
* 우편번호값을 가지고 있는 Object의 값을 두개의 분할 Object의 값으로 나눠준다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {Object} dsName  :: I :: Y ::  :: dataList Object
* @param {String} colName1  :: I :: N ::  :: 우편번호 컬럼명
* @param {String} colName2  :: IO :: N ::  :: 우편번호 분할컬럼1
* @param {String} colName3  :: IO :: N ::  :: 우편번호 분할컬럼2
* @param {Number} dataList  :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @example 1)dataList : ngmf.sepaZipNum(objDataList, "우편번호컬럼", "우편번호컬럼1", "우편번호컬럼2",0)
*          2)Component : ngmf.sepaZipNum("", "우편번호 Component", "우편번호 Component1", "우편번호 Component2")
* @since
* @useMobile use
*/
ngmf.sepaZipNum = function(dsName, colName1, colName2, colName3, rowNum) {
	var retVal = "N";
	try {
		var regexp = /[0-9*]{5,6}/;
		var splitExpr = "";

		var retGetStr = ngmf.getObjectData(dsName, colName1, rowNum).toString();
		if (ngmf.isNull(retGetStr) == "Y") {
			return "N";
		};

		var chgStr = regexp.exec(retGetStr);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == retGetStr.length) {
			if (retGetStr.length == 5) {
				splitExpr     = "3 2";
			} else if (retGetStr.length == 6) {
				splitExpr     = "3 3";
			}
			retVal = ngmf.sepaObject(dsName, colName1, [colName2, colName3], splitExpr, rowNum, "ZIP");
		};
	} catch (e) {
		ngmf._error("[ngmf.sepaZipNum] Exception :: ", e);
	}
	return retVal;
};

/**
* 주민번호값을 가지고 있는 Object의 값을 두개의 분할 Object의 값으로 나눠준다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {Object} dsName  :: I :: Y ::  :: dataList Object
* @param {String} colName1  :: I :: N ::  :: 주민번호 컬럼명
* @param {String} colName2  :: IO :: N ::  :: 주민번호 분할컬럼1
* @param {String} colName3  :: IO :: N ::  :: 주민번호 분할컬럼2
* @param {Number} dataList  :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @example 1)dataList : ngmf.sepaCtzNum(objDataList, "주민번호컬럼", "주민번호컬럼1", "주민번호컬럼2",0)
*          2)Component :ngmf.sepaCtzNum("", "주민번호 Component", "주민번호 Component1", "주민번호 Component2")
* @since
* @useMobile use
*/
ngmf.sepaCtzNum = function(dsName, colName1, colName2, colName3, rowNum) {
	var retVal = "N";
	try {
		var regexp = /[0-9*]{13}/;
		var splitExpr = "";

		var retGetStr = ngmf.getObjectData(dsName, colName1, rowNum).toString();
		if (ngmf.isNull(retGetStr) == "Y") {
			return "N";
		};

		var chgStr = regexp.exec(retGetStr);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == retGetStr.length) {
			splitExpr     = "6 7";
			retVal = ngmf.sepaObject(dsName, colName1, [colName2, colName3], splitExpr, rowNum, "CTZ");
		};
	} catch (e) {
		ngmf._error("[ngmf.sepaCtzNum] Exception :: ", e);
	}
	return retVal;
};

/**
* EMAIL 주소를 가지고 있는 Object의 값을 두개의 분할 Object의 값으로 나눠준다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {Object} dsName  :: I :: Y ::  :: dataList Object
* @param {String} colName1  :: I :: N ::  :: eMail Address
* @param {String} colName2  :: IO :: N ::  :: eMail 계정
* @param {String} colName3  :: IO :: N ::  :: eMail 서버
* @param {Number} dataList  :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @update 2016.05.18 이동규 함수 내부 구현 수정(정규식표현식 오류)
* @update 2016.05.19 이동규 함수 내부 구현 수정(정규식표현식 오류)[재수정]
* @update 2016.05.24 이동규 type 파라메터전달 (email 경우.)
* @example 1)dataList : ngmf.sepaEmail(objDataList, "eMail컬럼", "eMail컬럼1", "eMail컬럼2",0)
*          2)Component : ngmf.sepaEmail("", "eMail Component", "eMail Component1", "eMail Component2")
* @since
* @useMobile use
*/
ngmf.sepaEmail = function(dsName, colName1, colName2, colName3, rowNum) {
	var retVal = "N";
	try {
		//var regexp = /[a-zA-Z0-9_-]+[a-zA-Z0-9_.-]*[@]{1}[a-zA-Z0-9_]+[a-zA-Z0-9_.]*[.]{1}[a-zA-Z]{2,5}$/;
		var regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
		var splitExpr = "";
		var retGetStr = ngmf.getObjectData(dsName, colName1, rowNum, "email");
		if (ngmf.isNull(retGetStr) == "Y") {
			retVal = "N";
		} else {
			var chgStr = regexp.exec(retGetStr);
			if (ngmf.isNull(chgStr) != "Y" && chgStr[0].length == retGetStr.length) {
				eMailAcountCnt = retGetStr.indexOf("@");
				eMailServerCnt = ngmf.length(ngmf.mid(retGetStr, eMailAcountCnt)) -1;
				splitExpr      = eMailAcountCnt + " 1 " + eMailServerCnt;
				retVal = ngmf.sepaObject(dsName, colName1, [colName2, "@", colName3], splitExpr, rowNum, "EMAIL");
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.sepaEmail] Exception :: ", e);
	}
	return retVal;
};

/**
* 사업자번호값을 가지고 있는 Object의 값을 세개의 분할 Object의 값으로 나눠준다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {Object} dsName :: I :: Y ::  :: dataList Object
* @param {String} colName1 :: I :: N ::  :: 사업자번호 컬럼명
* @param {String} colName2  :: IO :: N ::  :: 사업자번호 분할컬럼1
* @param {String} colName3  :: IO :: N ::  :: 사업자번호 분할컬럼2
* @param {String} colName4  :: IO :: N ::  :: 사업자번호 분할컬럼3
* @param {Number} dataList  :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @example 1)dataList : ngmf.sepaBizNum(objDataList, "사업자번호컬럼", "사업자번호컬럼1", "사업자번호컬럼2", "사업자번호컬럼3",0)
*          2)Component : ngmf.sepaBizNum("", "사업자번호 Component", "사업자번호 Component1", "사업자번호 Component2", "사업자번호 Component3")
* @since
* @useMobile use
*/
ngmf.sepaBizNum = function(dsName, colName1, colName2, colName3, colName4, rowNum) {
	var retVal = "N";
	try {
		var regexp = /[0-9*]{10}/;
		var splitExpr = "";

		var retGetStr = ngmf.getObjectData(dsName, colName1, rowNum).toString();
		if (ngmf.isNull(retGetStr) == "Y") {
			return "N";
		};

		var chgStr = regexp.exec(retGetStr);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == retGetStr.length) {
			splitExpr     = "3 2 5";
			retVal = ngmf.sepaObject(dsName, colName1, [colName2, colName3, colName4], splitExpr, rowNum, "BIZ");
		};
	} catch (e) {
		ngmf._error("[ngmf.sepaBizNum] Exception :: ", e);
	}
	return retVal;
};

/**
* 전화번호값을 가지고 있는 Object의 값을 세개의 분할 Object의 값으로 나눠준다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {Object} dsName :: I :: Y ::  :: dataList Object
* @param {String} colName1 :: I :: N ::  :: 전화번호 컬럼명
* @param {String} colName2 :: IO :: N ::  :: 전화번호 분할컬럼1
* @param {String} colName3 :: IO :: N ::  :: 전화번호 분할컬럼2
* @param {String} colName4 :: IO :: N ::  :: 전화번호 분할컬럼3
* @param {Number} dataList :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @example 1)dataList : ngmf.sepaCtzNum(objDataList, "전화번호 컬럼", "전화번호 컬럼1", "전화번호 컬럼2", "전화번호 컬럼3", "G Or S",0)
*          2)Component : ngmf.sepaCtzNum("", "전화번호 Component", "전화번호 Component1", "전화번호 Component2", "전화번호 Component3", "G Or S")
* @since
* @useMobile use
*/
ngmf.sepaPhoneNum = function(dsName, colName1, colName2, colName3, colName4, sFlag, rowNum) {
	var retVal = "N";
	try {
		var regexp;
		var flag;
		if (sFlag.toUpperCase() == 'G') {
			regexp = /[0-9*]{9,12}/;
			flag = 'PHONEG';
		} else if (sFlag.toUpperCase() == 'S') {
			regexp = /[0-9*]{10,11}/;
			flag = 'PHONES';
		} else {
			alert('전화번호 유형을 확인해 주십시요. (일반연락번호[G], 서비스번호[S])');
			return "N";
		}

		var retGetStr = ngmf.getObjectData(dsName, colName1, rowNum).toString();
		if (ngmf.isNull(retGetStr) == "Y") {
			return "N";
		};

		var chgStr = regexp.exec(retGetStr);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == retGetStr.length) {
			var phoneLength = retGetStr.length;
			if (flag == 'PHONEG') {
				if (phoneLength == 9) {
					splitExpr     = "2 3 4";
				} else if (phoneLength == 10) {
					splitExpr     = "2 4 4";
				} else if (phoneLength == 11) {
					splitExpr     = "3 4 4";
				} else {
					splitExpr     = "4 4 4";
				};
			} else {
				splitExpr     = "3 4 4";
			};
			retVal = ngmf.sepaObject(dsName, colName1, [colName2, colName3, colName4], splitExpr, rowNum, flag);
		};
	} catch (e) {
		ngmf._error("[ngmf.sepaPhoneNum] Exception :: ", e);
	}
	return retVal;
};

/**
* 우편번호 값을 가지고 있는 두개의 Object를 합친다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {Object} dsName :: I :: Y ::  :: dataList Object
* @param {String} colName1 :: I :: N ::  :: 우편번호1 컬럼명
* @param {String} colName2 :: I :: N ::  :: 우편번호2 컬럼명
* @param {String} colName3 :: IO :: N ::  :: 우편번호결합컬럼명
* @param {Number} dataList :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @example dataList : ngmf.concatZipNum(objDataList, "우편번호1 컬럼명", "우편번호2 컬럼명", "우편번호결합컬럼명",0)
*          Component : ngmf.concatZipNum("", "우편번호1 Component", "우편번호2 Component", "우편번호결합 Component")
* @since
* @useMobile use
*/
ngmf.concatZipNum = function (dsName, colName1, colName2, colName3, rowNum) {
	var retVal = "N";
	try {
		var regexp = /[0-9*]{5,6}/;
		var retGetStr = ngmf.getObjectData(dsName, colName1, rowNum).toString() + ngmf.getObjectData(dsName, colName2, rowNum).toString();
		if (ngmf.isNull(retGetStr) == "Y") {
			return "N";
		};

		var chgStr = regexp.exec(retGetStr);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == retGetStr.length) {
			retVal = ngmf.concatObject(dsName, [colName1, colName2], colName3, rowNum, "ZIP");
		}
	} catch (e) {
		ngmf._error("[ngmf.concatZipNum] Exception :: ", e);
	}
	return retVal;
};

/**
* 주민번호 값을 가지고 있는 두개의 Object를 합친다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {Object} dsName :: I :: Y ::  :: dataList Object
* @param {String} colName1 :: I :: N ::  :: 주민번호1 컬럼명
* @param {String} colName2 :: I :: N ::  :: 주민번호2 컬럼명
* @param {String} colName3 :: IO :: N ::  :: 주민번호결합컬럼명
* @param {Number} dataList :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @example dataList : ngmf.concatCtzNum(objDataList, "주민번호1 컬럼명", "주민번호2 컬럼명", "주민번호결합컬럼명",0)
*          Component : ngmf.concatCtzNum("", "주민번호1 Component", "주민번호2 Component", "주민번호결합 Component")
* @since
* @useMobile use
*/
ngmf.concatCtzNum = function(dsName, colName1, colName2, colName3, rowNum) {
	var retVal = "N";
	try {
		var regexp = /[0-9*]{13}/;
		var retGetStr = ngmf.getObjectData(dsName, colName1, rowNum).toString() + ngmf.getObjectData(dsName, colName2, rowNum).toString();
		if (ngmf.isNull(retGetStr) == "Y") {
			return "N";
		};

		var chgStr = regexp.exec(retGetStr);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == retGetStr.length) {
			retVal = ngmf.concatObject(dsName, [colName1, colName2], colName3, rowNum, "CTZ");
		}
	} catch (e) {
		ngmf._error("[ngmf.concatCtzNum] Exception :: ", e);
	}
	return retVal;
};

/**
* Email주소 값을 가지고 있는 두개의 Object를 합친다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {Object} dsName :: I :: Y ::  ::dataList Object
* @param {String} colName1 :: I :: N ::  :: Email1 컬럼명
* @param {String} colName2 :: I :: N ::  :: Email2 컬럼명
* @param {String} colName3 :: IO :: N ::  :: Email결합컬럼명
* @param {Number} dataList :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @update 2016.05.24 이동규 type 파라메터전달 (email 경우.)
* @example dataList : ngmf.concatEmail(objDataList, "Email1 컬럼명", "Email2 컬럼명", "Email결합컬럼명", 0)
*          Component : ngmf.concatEmail("", "Email1 Component", "Email2 Component", "Email결합 Component")
* @since
* @useMobile use
*/
ngmf.concatEmail = function(dsName, colName1, colName2, colName3, rowNum) {
	var retVal = "N";
	try {
		var regexp = /[a-zA-Z0-9\*\-\_]+[a-zA-Z0-9\.\,\*\-\_]+@[a-zA-Z0-9\*\-]+[a-zA-Z0-9\.\,\*]\.[a-zA-Z0-9\*]+/;
		var regexp2 = /[a-zA-Z0-9\*\-\_]+[a-zA-Z0-9\.\,\*\-\_]+@[a-zA-Z0-9\*\-]+[a-zA-Z0-9\.\,\*]\.[a-zA-Z0-9]+[a-zA-Z0-9\.\,\*]\.[a-zA-Z0-9]+/;
		var retGetStr = ngmf.getObjectData(dsName, colName1, rowNum, "email").toString() + "@" +  ngmf.getObjectData(dsName, colName2, rowNum, "email").toString();
		if (ngmf.isNull(retGetStr) == "Y") {
			return "N";
		};

		var chgStr = regexp.exec(retGetStr);
		var chgStr2 = regexp2.exec(retGetStr);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == retGetStr.length) {
			retVal = ngmf.concatObject(dsName, [colName1, "@", colName2], colName3, rowNum, "EMAIL");
		}else if(chgStr2 != null && ngmf.isNull(chgStr2[0]) != "Y" && chgStr2[0].length == retGetStr.length){
			retVal = ngmf.concatObject(dsName, [colName1, "@", colName2], colName3, rowNum, "EMAIL");
		}
	} catch (e) {
		ngmf._error("[ngmf.concatEmail] Exception :: ", e);
	}
	return retVal;
};

/**
* 사업자번호 값을 가지고 있는 세개의 Object를 합친다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {Object} dsName :: I :: Y ::  :: dataList Object
* @param {String} colName1 :: I :: N ::  :: 사업자번호1 컬럼명
* @param {String} colName2 :: I :: N ::  :: 사업자번호2 컬럼명
* @param {String} colName3 :: I :: N ::  :: 사업자번호3 컬럼명
* @param {String} colName4 :: IO :: N ::  :: 사업자번호결합컬럼명
* @param {Number} dataList :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @example dataList : ngmf.concatBizNum(objDataList, "사업자번호1 컬럼명", "사업자번호2 컬럼명", "사업자번호3 컬럼명", "사업자번호결합컬럼명",0)
*          Component : ngmf.concatBizNum("", "사업자번호1 Component", "사업자번호2 Component", "사업자번호2 Component", "사업자번호결합 Component")
* @since
* @useMobile use
*/
ngmf.concatBizNum = function(dsName, colName1, colName2, colName3, colName4, rowNum) {
	var retVal = "N";
	try {
		var regexp = /[0-9*]{10}/;
		var retGetStr =  ngmf.getObjectData(dsName, colName1, rowNum).toString()
		               + ngmf.getObjectData(dsName, colName2, rowNum).toString()
		               + ngmf.getObjectData(dsName, colName3, rowNum).toString();
		if (ngmf.isNull(retGetStr) == "Y") {
			return "N";
		};

		var chgStr = regexp.exec(retGetStr);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == retGetStr.length) {
			retVal = ngmf.concatObject(dsName, [colName1, colName2, colName3], colName4, rowNum, "BIZ");
		}
	} catch (e) {
		ngmf._error("[ngmf.concatBizNum] Exception :: ", e);
	}
	return retVal;
};

/**
* 전화번호 값을 가지고 있는 세개의 Object를 합친다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {Object} dsName :: I :: Y ::  :: dataList Object
* @param {String} colName1 :: I :: N ::  :: 전화번호1 컬럼명
* @param {String} colName2 :: I :: N ::  :: 전화번호2 컬럼명
* @param {String} colName3 :: I :: N ::  :: 전화번호3 컬럼명
* @param {String} colName4 :: IO :: N ::  :: 전화번호결합컬럼명
* @param {String} sFlag    :: I :: N ::  :: 전화번호유형(G:일반연락번호, S:서비스번호)
* @param {Number} dataList :: I :: Y ::  :: Row Index
* @return {String} 정상이면 Y를 반환, 그외는 N
* @author 성일호
* @example dataList : ngmf.concatPhoneNum(objDataList, "전화번호1 컬럼명", "전화번호2 컬럼명", "전화번호3 컬럼명", "전화번호결합컬럼명", "G or S" ,0)
*          Component : ngmf.concatPhoneNum(objDataList, "전화번호1 컬럼명", "전화번호2 컬럼명", "전화번호3 컬럼명", "전화번호결합컬럼명", "G or S", 0)
* @since
* @useMobile use
*/
ngmf.concatPhoneNum = function(dsName, colName1, colName2, colName3, colName4, sFlag, rowNum) {
	var retVal = "N";
	try {
		var regexp;
		var flag;
		if (sFlag.toUpperCase() == 'G') {
			regexp = /[0-9*]{9,12}/;
			flag = 'PHONEG';
		} else if (sFlag.toUpperCase() == 'S') {
			regexp = /[0-9*]{10,11}/;
			flag = 'PHONES';
		} else {
			alert('전화번호 유형을 확인해 주십시요. (일반연락번호[G], 서비스번호[S])');
			return "N";
		}
		var retGetStr =  ngmf.getObjectData(dsName, colName1, rowNum).toString()
		               + ngmf.getObjectData(dsName, colName2, rowNum).toString()
		               + ngmf.getObjectData(dsName, colName3, rowNum).toString();
		if (ngmf.isNull(retGetStr) == "Y") {
			return "N";
		};
	
		var chgStr = regexp.exec(retGetStr);
		if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == retGetStr.length) {
			retVal = ngmf.concatObject(dsName, [colName1, colName2, colName3], colName4, rowNum, flag);
		}
	} catch (e) {
		ngmf._error("[ngmf.concatPhoneNum] Exception :: ", e);
	}
	return retVal;
};

/**
* 기간내 연도정보를 ComboBox에 Item으로 추가한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {Object} objSelectBox :: I :: N ::  :: selectBox Object
* @param {String} fromYear :: I :: N ::  :: 시작년도
* @param {String} toYear :: I :: N ::  :: 종료년도
* @return <Boolean> 정상이면 true를 반환, 그외는 false
* @author 성일호
* @example ngmf.selectYear(objSelectBox, "2010", "2016") //return true
* @since
* @useMobile use
*/
ngmf.selectYear = function(_objSelectBox, fromYear, toYear) {
	try {
		var yearGap = 0;
		var curYear = "";
		var objSelectBox = ngmf.object(_objSelectBox);
		if (!objSelectBox) return false;
		//입력이 없을경우
		if (ngmf.isNull(fromYear) == "Y" && ngmf.isNull(toYear) == "Y") {
			yearGap = 10;
			curYear  = ngmf.mid(ngmf.today(), 0, 4);
			fromYear = parseInt(curYear.substr(0,4)) - 5;
		} else {
			yearGap = parseInt(toYear) - parseInt(fromYear);
			if (yearGap < 0) {
				alert("시작년도가 종료년도보다 나중입니다");
				return false;
			};

			if ((parseInt(toYear) < 1900 || parseInt(toYear) > 2100) && parseInt(toYear) != 0) {
				alert("종료년도의 범위가 너무 큽니다");
				return false;
			};
		};
		objSelectBox.removeAll(false);
		var itemValue = 0;
		for (var i=0; i<=yearGap; i++ ) {
			itemValue = parseInt(fromYear) + i;
			objSelectBox.addItem(itemValue+"", itemValue+"");
		};

		if (ngmf.isNull(toYear) == "Y") {
			objSelectBox.setSelectedIndex(5);
		} else {
			objSelectBox.setSelectedIndex(0);
		};

		return true;
	} catch (e) {
		ngmf._error("[ngmf.selectYear] Exception :: ", e);
	}
	return false;
};

/**
* 특정Component에 대해 입력여부를 체크한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param <Variant> compId :: I :: N ::  :: Component Id or Component Object
* @param {String} compName :: I :: Y ::  :: Component 한글명
* @return {String} 입력값이 존재하면 Y 반환, 그외는 N
* @author 성일호
* @example ngmf.checkMandatory (objComp, "objComp 명칭"); //return Y
* @since
* @useMobile use
*/
ngmf.checkMandatory = function(compId, compName) {
	try { 
		if (typeof compId != "object") {
			objComp = ngmf.object(compId);
		} else {
			objComp = compId;
		}

		if (ngmf.isNull( ngmf.trim(objComp.getValue()) ) == "Y") {
			strMsg = ngmf.getMessage("ZNGMC1015","&ITEM", "["+compName+"]");
			if(ngmf.length(strMsg) > 0) ngmf.alert(strMsg);
			objComp.focus();
			return "N";
		}

		return "Y";
	} catch (e) {
		ngmf._error("[ngmf.checkMandatory] Exception :: ", e);
		return "N";
	}
};

/**
*  복수의 Component에 대해 입력여부를 체크한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param <Array> compList :: I :: N ::  :: [Compnent ID, Component 한글명]
* @param {String} msgOpt :: I :: Y ::  :: 메시지 표시 여부
* @return {String} 정상이면 Y 반환, 그외는 N
* @author 성일호
* @example  ngmf.checkMandatorys ("Compnent ID,Component 한글명", "Y/N")
* @since
* @useMobile use
*/
ngmf.checkMandatorys = function(compList, msgOpt) {
	try{
		var arrComp = ngmf.split(compList, ",");
		var compID = [];
		var compNM = [];
		var objComp;
		var strMsg;
//		arrCompNm = ngmf.split(compNmList, ",");
		if ((arrComp.length % 2) == 1) {
			ngmf.alert("Component ID와 한글명 갯수가 일치하지 않습니다.");
			return "N";
		};

		// 인자값을 Control ID와 명으로 구분한다.
		var arrIndex = 0;
		for (var i=0; i<arrComp.length;  i++) {
			if ( (i%2) == 0 ) {
				compID[arrIndex] = ngmf.trim(arrComp[i]);
			} else {
				compNM[arrIndex] = ngmf.trim(arrComp[i]);
				arrIndex++;
			};
		};

		// Not Null Check 작업 수행
		for (var i=0; i<arrIndex; i++) {
			objComp = ngmf.object( compID[i] );
			if (ngmf.isNull(ngmf.trim(objComp.getValue())) == "Y") {
				if (msgOpt == 'Y') {
					strMsg = ngmf.getMessage("ZNGMC1015","&ITEM", "["+compNM[i]+"]");
					if(ngmf.length(strMsg) > 0) ngmf.alert(strMsg);
					objComp.focus();
				};
				return "N";
			};
		};

		return "Y";
	} catch (e) {
		ngmf._error("[ngmf.checkMandatorys] Exception :: ", e);
		return "N";
	}
};

/**
*  국번의 유효숫자값이 3자리 인지 여부를 체크한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} strExpr :: I :: N ::  :: 전화번호
* @returns {String} 국번의 첫번째값이 0이면 Y 반환, 그외는 N
* @author 성일호
* @example ngmf.isModifyPhoneOfficeNumber ("01099999999"); //return N
* @since
* @useMobile use
*/
ngmf.isModifyPhoneOfficeNumber = function(strExpr) {
	// 이 함수를 사용하기 전에 기본 validation check를 수행했다고 가정한다.
	// 국번호의 첫번째 자리값이 '0' 이라면
	try {	
		if (strExpr.substr(strExpr.length-8,1) == "0") {
			return "Y";
		};
	} catch (e) {
		ngmf._error("[ngmf.isModifyPhoneOfficeNumber] Exception :: ", e); 
	}
	return "N";
};

/**
 * dataList의 Column인지 화면의 Component인지 구분한다.
 * @date 2015. 10. 16.
 * @memberOf ngmf
 * @param {Object} objDs :: I :: N ::  :: dataList Component
 * @param {String} ColName :: I :: Y ::  :: 컬럼명
 * @returns {String} dataList의 Column이면 Y, Component이면 N, 이외의 경우 E
 * @author 성일호
 * @example ngmf.isDsColumn (objDs, "컬럼명"); //return Y
 * @update 성일호 2016.02.12  체크조건 및 예외처리 추가
 * @update 성일호 2016.02.15  체크조건 수정
 * @update 2016.05.18 이동규 코딩 함수구현 수정.
 * @update 2016.05.20 이동규 코딩 [AS-IS 동작 차이점 수정.]
 * @useMobile use
 */
ngmf.isDsColumn = function(objDs, ColName) {
	var result = "E";
	try{
		var comp = ngmf.object(objDs);
		if (typeof comp == "undefined") {
			result = "N";
		} else if (comp && comp.initializeType == "dataList" && typeof comp.getColumnInfo(ColName) != "undefined") {
			result = "Y";
		} else if (ngmf.object(ColName)) {
			result = "N";
		} else {
			ngmf.alert('[' + ColName + '] 에 해당하는 Column 또는 Component가 존재하지 않습니다.');
		}
	} catch (e) {
		ngmf._error("[ngmf.isDsColumn] Exception :: ", e);
	}
	return result;
};

/**
* dataList의 rowNum이 정상적인지 Check한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {Object} objDs :: I :: N ::  :: dataList Component
* @param {Number} rowNum :: I :: N ::  :: Row Index
* @return {Number} 정상이면 RowIndex 반환, 이외는 -1
* @author 성일호
* @example ngmf.isRowNumValid (objDs, 1); return 1
* @update 2016.02.06 오류 수정 alert => ngmf.alert,  dsName.getID() => objDs.getID()
* @since
* @useMobile use
*/
ngmf.isRowNumValid = function(objDs, rowNum) {
	var retVal = -1;
	try {

		if (typeof objDs != "object" || objDs.getObjectType() != "dataList") {
			ngmf.alert('dataList가  존재하지 않습니다.');
			return retVal;
		};

		if (objDs.getRowCount() <= 0) {
			ngmf.alert('dataList [' + objDs.getID() + '] 에 Row가 존재하지 않습니다.');
			return retVal;
		};


		if (rowNum == null || typeof rowNum == "undefined") {
			retVal = objDs.getRowPosition();
		} else {
			if (rowNum > objDs.getRowCount()) {
				ngmf.alert('전달받은 rowNum ' + rowNum + '이  dataList [' + objDs.getID() + '] 의 count ' + objDs.getRowCount() + ' 을 넘어섰습니다.');
				retVal = -1;
			} else {
				retVal = rowNum;
			};
		};
	} catch (e) {
		ngmf._error("[ngmf.isRowNumValid] Exception :: ", e);
	}
	return retVal;
};

/**
 * dataList, 또는 Component의 값을 Get.
 * @date 2015. 10. 16.
 * @memberOf ngmf
 * @param {Object} objDs :: I :: Y ::  :: dataList 또는 ""
 * @param {String} ColName :: I :: N ::  :: dataList일 경우 컬럼명, Component일 경우 Component명
 * @param {Number} ColName :: I :: Y ::  :: dataList일 경 Row Index
 * @returns {String} dataList, 또는 Component의 값
 * @author 성일호
 * @example dataList : ngmf.getObjectData(objDs, "컬럼명", 1); //
 *          component : ngmf.getObjectData("", "Component명");
 * @update 성일호 2016.02.12  체크조건 및 예외처리 추가
 * @update 2016.05.18 이동규 함수 내부구현 수정.
 * @update 2016.05.24 이동규 type 파라메터추가 (email 경우 selectbox 처리 분기작업.)
 * @useMobile use
 */
ngmf.getObjectData = function(objDs, ColName, rowNum, type) {
	var retVal = "";
	try{
		var comp = ngmf.object(objDs);
		if (typeof ColName == "undefined") return "" ;
		if (typeof rowNum == "undefined") rowNum = 0;
		if ( ngmf.isDsColumn(objDs, ColName) == 'Y' ) {
			retVal = comp.getCellData(Number(rowNum), ColName);
		} else if (ngmf.isDsColumn(comp, ColName) == 'N') {
			comp = ngmf.object(ColName);
			if (comp && typeof type != "undefined" && type == "email") {
				if (comp.getPluginName && comp.getPluginName() == "selectbox") {
					retVal = comp.getText();
				} else {
					retVal = comp.getValue();
				}
			} else if (comp) {
				retVal = comp.getValue();
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getObjectData] Exception :: ", e);
	}
	return retVal;
};

/**
 * dataList, 또는 Component의 값을 Set.
 * @date 2015. 10. 16.
 * @memberOf ngmf
 * @param {Object} dsName :: I :: Y ::  :: dataList 또는 ""
 * @param {String} ColName :: I :: N ::  :: dataList일 경우 컬럼명, Component일 경우 Component명
 * @param {String} setData :: I :: N ::  :: 설정할 값
 * @param {Number} Row Index :: I :: Y ::  ::ColName dataList일 경
 * @returns {String} Y /N
 * @author 성일호
 * @example dataList : ngmf.setObjectData(objDs, "컬럼명", "C", 1); //
 *          component : ngmf.setObjectData("", "Component명", "C");
 * @update 성일호 2016.02.12  체크조건 및 예외처리 추가
 * @useMobile use
 */
ngmf.setObjectData = function(dsName, ColName, setData, rowNum) {
	try {
		var comp = ngmf.object(dsName);
		if ( ngmf.isDsColumn(comp, ColName) == "Y" ) {
			comp.setCellData(rowNum, ColName, setData);
		} else if (ngmf.isDsColumn(comp, ColName) == "N") {
			comp = ngmf.object(ColName);
			if (comp)
				comp.setValue(setData);
		}
		return "Y";
	} catch (e) {
		ngmf._error("[ngmf.setObjectData] Exception :: ", e);
	}
	return "N";
};

/**
* 전달된값들을 유형에 따라 값을 합친다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {Object} dsName :: I :: Y ::  :: dataList 또는 ""
* @param {Array} arrSrcColName :: I :: N ::  :: 컬럼, Component 명칭의 Array
* @param {String} destColName :: I :: N ::  :: 컬럼, Component 명칭
* @param {Number} Row Index :: I :: Y ::  :: dataList일경우 Row Index
* @param {String} strFlag :: I :: Y ::  :: 유형(ZIP, CTZ, EMAIL, BIZ, PHONEG, PHONES)
* @returns {String} dataList, 또는 Component의 값
* @author 성일호
* @example dataList : ngmf.concatObject(objDs, ["컬럼명1", "컬럼명2"], 컬럼명, 1, "ZIP"); //return Y
*          component : ngmf.concatObject("", ["Component명1", "Component명2"], Component명, 1, "ZIP"); //return Y
* @since
* @useMobile use
*/
ngmf.concatObject = function(dsName, arrSrcColName, destColName, rowNum, strFlag) {
	try {
		var concatData = "";
		var strTemp;
		var curRow;

		for (var i=0; i<arrSrcColName.length; i++) {
			if (strFlag == "EMAIL"  &&  arrSrcColName[i] == "@") {
				concatData += arrSrcColName[i];      // '@'  sign
			} else {
				if (ngmf.isDsColumn(dsName, arrSrcColName[i]) == "N") {
					strTemp = WebSquare.util.getComponentById( arrSrcColName[i] ).getValue();
					if (strFlag == "PHONEG" && i == 0) {
						if (strTemp.length == 2) {
							concatData += "00";
						} else if (strTemp.length == 3) {
							concatData += "0";
						}
					}

					if (strFlag.substr(0,5) == "PHONE" && i == 1) {
						if (strTemp.length == 3) {
							concatData += "0";
						}
					}
					concatData += strTemp;
				} else if (ngmf.isDsColumn(dsName, arrSrcColName[i]) == "Y") {
					strTemp = ngmf.getObjectData(dsName, arrSrcColName[i], rowNum).toString();
					if (strFlag == "PHONEG" && i == 0) {
						if (strTemp.length == 2) {
							concatData += "00";
						} else if (strTemp.length == 3) {
							concatData += "0";
						}
					}

					if (strFlag.substr(0,5) == "PHONE" && i == 1) {
						if (strTemp.length == 3) {
							concatData += "0";
						}
					}
					concatData += strTemp;
				} else {
					return "N";
				};
			};

			if (ngmf.isDsColumn(dsName, destColName) == "N") {
				ngmf.setObjectData(dsName, destColName, concatData);
			} else if (ngmf.isDsColumn(dsName, destColName) == "Y") {
				curRow = ngmf.isRowNumValid(dsName, rowNum);
				if (curRow <  0) return "N";
				ngmf.setObjectData(dsName, destColName, concatData, curRow);
			} else {
				return "N";
			}
		};
	} catch (e) {
		ngmf._error("[ngmf.concatObject] Exception :: ", e);
		return "N";
	}
	return "Y";
};


/**
* 전달된값을 유형에 따라 값을 나눈 후 복수의 datalist와 Component에 값을 설정한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {Object} dsName :: I :: Y ::  :: dataList 또는 ""
* @param {String} srcColName :: I :: N ::  :: 컬럼, Component 명칭
* @param {Array} arrDestColName :: I :: N ::  :: 컬럼, Component 명칭의 Array
* @param {String} splitExpr :: I :: N ::  ::  문자열을 나눌 POSITION (SPACE로 나눔) 
* @param {Number} rowNum :: I :: Y ::  :: dataList일 경 Row Index
* @param {String} strFlag :: I :: Y ::  :: 유형(ZIP, CTZ, EMAIL, BIZ, PHONEG, PHONES)
* @returns {String} dataList, 또는 Component의 값
* @author 성일호
* @example dataList : ngmf.sepaObject(objDs, 컬럼명, ["컬럼명1", "컬럼명2"], "3 3", 1, "ZIP"); //return Y
*          component : ngmf.sepaObject("", Component명, ["Component명1", "Component명2"], "3 3", 1, "ZIP"); //return Y
* @since
* @useMobile use
*/
ngmf.sepaObject = function(dsName, srcColName, arrDestColName, splitExpr, rowNum, strFlag) {
	try {
		var sourceData;
		var strTemp;
		var sIdx=0;

		if (ngmf.isDsColumn(dsName, srcColName)  != 'E') {
			sourceData = ngmf.getObjectData(dsName, srcColName, rowNum).toString();
		} else {
			return "N";
		};

		var arrToken = splitExpr.split(" ");

		for(var i=0; i<arrDestColName.length; i++) {
			//  갯수만큼 자료를 꺼낸다.
			strTemp = sourceData.substr(sIdx, arrToken[i]);

			// 꺼낸것을 object에 setting한다.
			if (strFlag == "EMAIL"  &&  strTemp == "@") {
		   		// '@' sign은 제외해서 분리한다.
		  	} else {
				if (dsName == "" && ngmf.isDsColumn(dsName, arrDestColName[i]) != "E") {
					if (strFlag.substr(0, 5) == "PHONE") {//left 대체
						if (i == 0) {  // 식별번호
							if (strFlag == 'PHONEG') {
								if (sourceData.substr(0, 3)  == "000") {//left 대체
									strTemp = strTemp.substr(2, 2);
								} else if (sourceData.substr(0, 2) == "00") { //left 대체
									strTemp = strTemp.substr(1, 3);
								}
							}
						}
					}
					WebSquare.util.getComponentById( arrDestColName[i] ).setValue(strTemp);
				} else if (ngmf.isDsColumn(dsName, arrDestColName[i]) != "E" &&  ngmf.isRowNumValid(dsName, rowNum) >= 0) {
					// 전화번호일때 식별번호의 유효자리수만 추출한다.  ex) 0002 -> 02,  0010 -> 010
					// 전화번호일때 국번의 유효자리수만 추출한다.      ex) 0382 -> 382, 3342 -> 3342
					if (strFlag.substr(0, 5) == "PHONE") {//left 대체
						if (i == 0) {  // 식별번호
							if (strFlag == 'PHONEG') {
								if (sourceData.substr(0, 3)  == "000") {//left 대체
									strTemp = strTemp.substr(2, 2);
								} else if (sourceData.substr(0, 2) == "00") { //left 대체
									strTemp = strTemp.substr(1, 3);
								}
							}
						}
						if (i == 1) {   // 국번호
							if (ngmf.isModifyPhoneOfficeNumber(sourceData) == "Y") {
								strTemp = strTemp.substr(1,3);
							}
						}
					}

		    		var curRow    = ngmf.isRowNumValid(dsName, rowNum);
		    		ngmf.setObjectData(dsName, arrDestColName[i], strTemp, curRow);
		   		} else {
		    		return "N";
		   		}
		  	}

			  // index를 증가 시킨다.
			  sIdx += parseInt(arrToken[i]);
		}
	} catch (e) {
		ngmf._error("[ngmf.sepaObject] Exception :: ", e);
		return "N";
	}
	return "Y";
};



/**
* 입력값에서 Comma를 제거한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 입력값
* @returns {String} Comma가 제거된 값
* @author 성일호
* @example ngmf.removeComma("123,456"); //return "123456"
* @since
* @useMobile use
*/
ngmf.removeComma = function(inSrcStr) {
	if (ngmf.isNull(inSrcStr) == "Y") {
		return "";
	};
	return ngmf.replace(inSrcStr, ",","");
};

/**
* 입력값에서 Hyphen을 제거한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 입력값
* @returns {String} Hyphen이 제거된 값
* @author 성일호
* @example ngmf.removeHyphen("123-456"); //return "123456"
* @since
* @useMobile use
*/
ngmf.removeHyphen = function(inSrcStr) {
	if (ngmf.isNull(inSrcStr) == "Y") {
		return "";
	};
	return ngmf.replace(inSrcStr, "-","");
};

/**
*  입력값에서 Space를 제거한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 입력값
* @returns {String} Space가 제거된 값
* @author 성일호
* @example ngmf.removeSpace("123 456"); //return "123456"
* @since
* @useMobile use
*/
ngmf.removeSpace = function(inSrcStr) {
	if (ngmf.isNull(inSrcStr) == "Y") {
		return "";
	};
	return ngmf.replace(inSrcStr, " ","");
};

/**
*  우편번호에서 Hyphen을 제거한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 우편번호
* @returns {String} Hyphen이 제거된 우편번호
* @author 성일호
* @example ngmf.removeHyphenZipNum("123-456"); //return "123456"
* @since
* @useMobile use
*/
ngmf.removeHyphenZipNum = function(inSrcStr) {
	var regExp = /[0-9]{3}\-[0-9]{2,3}/;
	var chgStr = regExp.exec(inSrcStr);
	if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == inSrcStr.length) {
		return ngmf.replace(inSrcStr, "-", "");
	};
	return "";
};

/**
* 주민번호에서 Hyphen을 제거한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 주민번호
* @returns {String} Hyphen이 제거된 주민번호
* @author 성일호
* @example ngmf.removeHyphenCtzNum("123456-7990123"); //return "1234567990123"
* @since
* @useMobile use
*/
ngmf.removeHyphenCtzNum = function(inSrcStr) {
	var regExp = /[0-9]{6}\-[0-9]{7}/;
	var chgStr = regExp.exec(inSrcStr);
	if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == inSrcStr.length) {
		return ngmf.replace(inSrcStr, "-", "");
	};
	return "";
};

/**
* 사업자번호에서 Hyphen을 제거한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 사업자번호
* @returns {String} Hyphen이 제거된 사업자번호
* @author 성일호
* @example ngmf.removeHyphenBizNum("123-45-67890"); //return "1234567890"
* @since
* @useMobile use
*/
ngmf.removeHyphenBizNum = function(inSrcStr) {
	var regExp = /[0-9]{3}\-[0-9]{2}\-[0-9]{5}/;
	var chgStr = regExp.exec(inSrcStr);
	if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == inSrcStr.length) {
		return ngmf.replace(inSrcStr, "-", "");
	};
	return "";
};

/**
*  전화번호에서 Hyphen을 제거한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 전화번호
* @returns {String} Hyphen이 제거된 전화번호
* @author 성일호
* @example ngmf.removeHyphenZipNum("010-1234-5678"); //return "01012345678"
* @since
* @useMobile use
*/
ngmf.removeHyphenPhoneNum = function(inSrcStr) {
	var regExp = /[0-9]{2,3}\-[0-9]{3,4}\-[0-9]{4}/;
	var chgStr = regExp.exec(inSrcStr);
	if (chgStr != null && ngmf.isNull(chgStr[0]) != "Y" && chgStr[0].length == inSrcStr.length) {
		return ngmf.replace(inSrcStr, "-", "");
	};
	return "";
};

/**
* 우편번호에서 Hyphen을 추가한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 우편번호
* @returns {String} Hyphen이 추가된 우편번호
* @author 성일호
* @example ngmf.appendHyphenZipNum("123456"); //return "123-456"
* @since
* @useMobile use
*/
ngmf.appendHyphenZipNum = function(inSrcStr) {
	var inSrcStr = (typeof inSrcStr == "number") ? inSrcStr+"" : inSrcStr;
	if (ngmf.isNull(inSrcStr) == "Y" || (inSrcStr.length != 5 && inSrcStr.length != 6)) {
		return "";
	};
	var retZip = "";
	if (inSrcStr.length == 5) {
		retZip = inSrcStr;
	} else {
		retZip = ngmf.appendHyphen(inSrcStr, "3 3");
	};
	return retZip;
};

/**
* 주민번호에서 Hyphen을 추가한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 주민번호
* @returns {String} Hyphen이 추가된 주민번호
* @author 성일호
* @example ngmf.appendHyphenCtzNum("1234567990123"); //return "123456-7990123"
* @since
* @useMobile use
*/
ngmf.appendHyphenCtzNum = function(inSrcStr) {
	if (ngmf.isNull(inSrcStr) == "Y" || inSrcStr.length != 13) {
		return "";
	};
	return ngmf.appendHyphen(inSrcStr, "6 7");
};

/**
* 사업자번호에서 Hyphen을 추가한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: 사업자번호
* @returns {String} Hyphen이 제거된 추가된
* @author 성일호
* @example ngmf.appendHyphenBizNum("1234567890"); //return "123-45-67890"
* @since
* @useMobile use
*/
ngmf.appendHyphenBizNum = function(inSrcStr) {
	if (ngmf.isNull(inSrcStr) == "Y" || inSrcStr.length != 10) {
		return "";
	};
	return ngmf.appendHyphen(inSrcStr, "3 2 5");
};

/**
* 전화번호를 입력받아 Hyphen을 추가하여 반환한다.
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inSrcStr :: I :: N ::  :: Hyphen이 없는 전화번호
* @returns {String} Hyphen이 추가된 전화번호
* @author 성일호
* @example ngmf.appendHyphenPhoneNum("01012345678"); //return "010-1234-5678"
* @since
* @useMobile use
*/
ngmf.appendHyphenPhoneNum = function(pi_phone_num) {
	if (ngmf.isNull(pi_phone_num) == "Y" || pi_phone_num.trim().length == 0) {
		return "";
	}
	if (pi_phone_num.trim().length > 12 || pi_phone_num.trim().length < 8 ) {
		return "";
	}
	return ngmf.setHyphenPhonNum( pi_phone_num );
};

/**
* 문자열에서 특정부분을 반환한다..
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} inStr :: I :: N ::  :: 문자열
* @param {Number} startIndex :: I :: N ::  :: 시작Index
* @param {Number} strLen :: I :: N ::  :: 길이
* @returns {String} 문자열의 시작인덱스에서부터 원하는 길이만큼 반환한다
* @author 성일호
* @example ngmf.dbSubStr ("0109999999", 1, 1);	//return "0"
* @update 2016.02.06  0 부터 시작할경우 문제 해결
* @since
* @useMobile use
*/
ngmf.dbSubStr = function(inStr, startIndex, strLen) {
	try {
		if (startIndex <= 0) startIndex = 1;
		return inStr.substr(startIndex - 1, strLen);
	} catch (e) {
		ngmf._error("[ngmf.dbSubStr] Exception :: ", e);
	}
	return  inStr;
};

/**
* 문자열에서 하이픈을 추가하여 반환한다..
* @date 2015. 10. 16.
* @memberOf ngmf
* @param {String} strNumber :: I :: N ::  ::	하이픈이 없는 문자열
* @param {Number} tokenNum :: I :: N ::  ::	문자열에 하이픈을 추가해야할 POSITION (SPACE로 나눔)
* @returns {String} 문자열의 시작인덱스에서부터 원하는 길이만큼 반환한다
* @author 성일호
* @example ngmf.appendHyphen("123456, "3 3");;	//return "123-456"
* @since
* @useMobile use
*/
ngmf.appendHyphen = function(strNumber,tokenNum) {
	var retValue = "";
	try {
		var index     = 0;
		if (ngmf.isNull(strNumber) == "Y" || ngmf.isNull(tokenNum) == "Y") {
			return retValue;
		}
		var arrToken = tokenNum.split(" ");

		for(var i = 0; i < arrToken.length; i++) {

			if (i==0) {
				retValue += strNumber.substr(0, parseInt(arrToken[i]));
				retValue += "-";
				index += parseInt(arrToken[i]);
			} else {

				if (i==(arrToken.length-1)) {
					retValue += strNumber.substr(index, parseInt(arrToken[i]));
					index += parseInt(arrToken[i]);
				} else {
					if (i==1) {
						retValue += strNumber.substr(parseInt(arrToken[i-1]), parseInt(arrToken[i]));
						retValue += "-";
						index += parseInt(arrToken[i]);
					} else {
						retValue += strNumber.substr(index, parseInt(arrToken[i]));
						retValue += "-";
						index += parseInt(arrToken[i]);
					}
				};
			}
		}	
	} catch (e) {
		ngmf._error("[ngmf.appendHyphen] Exception :: ", e);
	}
	return retValue;
};

/**
* 일반전화번호 형식을 하이픈이 추가된 번호로 반환한다.
* @date 2015. 10. 19.
* @memberOf ngmf
* @param {String} gnrlPhonNum :: I :: Y ::  :: 일반전화번호
* @param {String} compGnrlPhonNum1 :: I :: Y ::  :: 일반전화번호1 OUTPUT COMPONENT 명
* @param {String} compGnrlPhonNum2 :: I :: Y ::  :: 일반전화번호2 OUTPUT COMPONENT 명
* @param {String} compGnrlPhonNum3 :: I :: Y ::  :: 일반전화번호3 OUTPUT COMPONENT 명
* @param {String} compFullGnrlPhonNum :: IO :: Y ::  :: Full 일반전화번호 OUTPUT COMPONENT 명
* @param {String} compHyphenGnrlPhonNum :: IO :: Y ::  :: Hyphen 일반전화번호 OUTPUT COMPONENT 명
* @param {String} compOutResult :: IO :: Y ::  :: 결과 OUTPUT COMPONENT 명
* @returns {String} 하이픈이 추가된 번호
* @sampleLink ATFIL_SAMPLE
* @author 성일호
* @update 2016.02.04 하이픈 포매터 변경
* @update 2016.02.17 하이픈 포매터 변경
* @example ngmf.setGnrlPhone ("0299999999", "COMP1", "COMP2", "COMP3", "COMP4", "COMP5", "RESULTCOMP"); //return "Y"
* @exampleAsIs ngmf_SetGnrlPhone("0299999999", "EDIT0", "EDIT1", "EDIT2", "EDIT3", "EDIT4", "EDIT5");
* @since
* @useMobile use
*/
ngmf.setGnrlPhone = function(gnrlPhonNum,
							compGnrlPhonNum1, compGnrlPhonNum2, compGnrlPhonNum3,
							compFullGnrlPhonNum,
							compHyphenGnrlPhonNum,
							compOutResult ) {
	var hyphenPhonNum = "";
	try {
		var objGnrlPhonNum1 = ngmf.object( compGnrlPhonNum1 );
		var objGnrlPhonNum2 = ngmf.object( compGnrlPhonNum2 );
		var objGnrlPhonNum3 = ngmf.object( compGnrlPhonNum3 );
		var objFullGnrlPhonNum   = ngmf.object( compFullGnrlPhonNum );
		var objHyphenGnrlPhonNum = ngmf.object( compHyphenGnrlPhonNum );
		var objOutResult         = ngmf.object( compOutResult );

		var sPhonNum1 = "";
		var sPhonNum2 = "";
		var sPhonNum3 = "";
		if (typeof objGnrlPhonNum1 != "undefined") sPhonNum1 = ngmf.trim(objGnrlPhonNum1.getValue());
		if (typeof objGnrlPhonNum2 != "undefined") sPhonNum2 = ngmf.trim(objGnrlPhonNum2.getValue());
		if (typeof objGnrlPhonNum3 != "undefined") sPhonNum3 = ngmf.trim(objGnrlPhonNum3.getValue());

		if ( ngmf.isNull(ngmf.trim(gnrlPhonNum)) == "Y") {
			if ( sPhonNum1.length>0 && sPhonNum2.length>0 && sPhonNum3.length>0 ) {
				gnrlPhonNum =  sPhonNum1+ sPhonNum2+ sPhonNum3;
			} else {
				if (typeof objFullGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
				if (typeof objOutResult != "undefined") objOutResult.setValue("N");
				return "";
			}
		} else {
			gnrlPhonNum = ngmf.trim(gnrlPhonNum);
		}

		if (gnrlPhonNum.length == 12 && ngmf.dbSubStr(gnrlPhonNum, 0, 4) == "0000") {
			gnrlPhonNum = ngmf.dbSubStr(gnrlPhonNum, 5, 8);
		}

		if (gnrlPhonNum.length < 9) {
			//15XX-XXXX 번호 처리
			if (gnrlPhonNum.length == 8 && ngmf.dbSubStr(gnrlPhonNum, 0, 2) == "15" ) {
				if (typeof objGnrlPhonNum1 != "undefined") objGnrlPhonNum1.setValue("0000");
				if (typeof objGnrlPhonNum2 != "undefined") objGnrlPhonNum2.setValue(ngmf.dbSubStr(gnrlPhonNum, 0, 4));
				if (typeof objGnrlPhonNum3 != "undefined") objGnrlPhonNum3.setValue(ngmf.dbSubStr(gnrlPhonNum, 5, 4));
				if (typeof objFullGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue("0000" + ngmf.dbSubStr(gnrlPhonNum, 0, 4) + ngmf.dbSubStr(gnrlPhonNum, 5, 4));
				if (typeof objHyphenGnrlPhonNum != "undefined") objHyphenGnrlPhonNum.setValue(ngmf.dbSubStr(gnrlPhonNum, 0, 4) + "-" + ngmf.dbSubStr(gnrlPhonNum, 5, 4));
				if (typeof objOutResult != "undefined") objOutResult.setValue("Y");

				return ngmf.dbSubStr(gnrlPhonNum, 0, 4) + "-" + ngmf.dbSubStr(gnrlPhonNum, 5, 4);
			}
			if (typeof objHyphenGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
		}

		//050번호 처리
		//11자리 : 050 -> 0050
		//11자리 이외 : '0502', '0504, '0505', '0506'이 아닌 경우,오류
	    if (gnrlPhonNum.length == 11) {	//11자리 전화번호 : 050
			if ( ngmf.dbSubStr(gnrlPhonNum, 0, 3) == "050" ) {
				gnrlPhonNum = "0"+gnrlPhonNum;
			}
		} else {
			if ( ngmf.dbSubStr(gnrlPhonNum, 0, 3) == "050" ) {
				if (ngmf.dbSubStr(gnrlPhonNum, 0, 4) != "0502"
					 && ngmf.dbSubStr(gnrlPhonNum, 0, 4) != "0504"
				     && ngmf.dbSubStr(gnrlPhonNum, 0, 4) != "0505"
					 && ngmf.dbSubStr(gnrlPhonNum, 0, 4) != "0505") {
					if (typeof objHyphenGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
					if (typeof objOutResult != "undefined") objOutResult.setValue("N");

					return "";
				}
			}
		}

	    //Hyphen Add
	    ngmv.phonNum1 = "";
	    ngmv.phonNum2 = "";
	    ngmv.phonNum3 = "";
	    var gnrlYn = "Y";
	    hyphenPhonNum= ngmf.setHyphenPhonNum(gnrlPhonNum, gnrlYn);

	    if (ngmf.isNull(hyphenPhonNum) == "Y") {
	    	if (typeof objHyphenGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
	    }
	    //2자리 국번 error처리
	    if (ngmv.phonNum2.length < 3) {
	    	if (typeof objHyphenGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
	    }


	    //FULL 일반전화번호 설정
	    var dbPhonNum = ngmf.lpad(ngmv.phonNum1, "0", 4) + ngmf.lpad(ngmv.phonNum2, "0", 4) + ngmv.phonNum3;
	    if (typeof objGnrlPhonNum1 != "undefined") objGnrlPhonNum1.setValue(ngmv.phonNum1);
	    if (typeof objGnrlPhonNum2 != "undefined") objGnrlPhonNum2.setValue(ngmv.phonNum2);
	    if (typeof objGnrlPhonNum3 != "undefined") objGnrlPhonNum3.setValue(ngmv.phonNum3);
	    if (typeof objFullGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(dbPhonNum);
	    if (typeof objHyphenGnrlPhonNum != "undefined") objHyphenGnrlPhonNum.setValue(hyphenPhonNum);
	    if (typeof objOutResult != "undefined") objOutResult.setValue("Y");
	} catch(e) {
		ngmf._error("[ngmf.setGnrlPhone] Exception :: ", e);
	}

	return hyphenPhonNum;
};

/**
 * 일반전화번호 형식을 하이픈이 추가된 번호로 반환한다.
 * @date 2015. 10. 15.
 * @memberOf ngmf
 * @param {String} gnrlPhonNum :: I :: Y ::  :: 일반전화번호
 * @param {String} compGnrlPhonNum1 :: I :: Y ::  :: 일반전화번호1 OUTPUT COMPONENT 명
 * @param {String} compGnrlPhonNum2 :: I :: Y ::  :: 일반전화번호2 OUTPUT COMPONENT 명
 * @param {String} compGnrlPhonNum3 :: I :: Y ::  :: 일반전화번호3 OUTPUT COMPONENT 명
 * @param {String} compFullGnrlPhonNum :: I :: Y ::  :: 일반전화번호 OUTPUT COMPONENT 명
 * @param {String} compHyphenGnrlPhonNum :: I :: Y ::  :: Hyphen 일반전화번호 OUTPUT COMPONENT 명
 * @param {String} compOutResult  :: I :: Y ::  ::결과 OUTPUT COMPONENT 명
 * @return {String} 정상이면 "Y" 이외는 "N"
 * @author 성일호
 * @example ngmf.db_SetGnrlPhone ("0299999999", "COMPONENT1", "COMPONENT2", "COMPONENT3", "COMPONENT4", "COMPONENT5", "RESULTCOMP")
 * @exampleAsIs ngmf_db_SetGnrlPhone("0299999999", "EDIT0", "EDIT1", "EDIT2", "EDIT3", "EDIT4", "EDIT5")
 * @since
 * @useMobile use
 */
ngmf.db_SetGnrlPhone = function(gnrlPhonNum,
								compGnrlPhonNum1, compGnrlPhonNum2, compGnrlPhonNum3,
								compFullGnrlPhonNum,
								compHyphenGnrlPhonNum,
								compOutResult ) {
	var hyphenPhonNum = "";
	try {
		var objGnrlPhonNum1 = ngmf.object( compGnrlPhonNum1 );
		var objGnrlPhonNum2 = ngmf.object( compGnrlPhonNum2 );
		var objGnrlPhonNum3 = ngmf.object( compGnrlPhonNum3 );
		var objFullGnrlPhonNum = ngmf.object( compFullGnrlPhonNum );
		var objHyphenGnrlPhonNum = ngmf.object( compHyphenGnrlPhonNum );
		var objOutResult = ngmf.object( compOutResult );

		var sPhonNum1 = "";
		var sPhonNum2 = "";
		var sPhonNum3 = "";
		if (typeof objGnrlPhonNum1 != "undefined") sPhonNum1 = ngmf.trim(objGnrlPhonNum1.getValue());
		if (typeof objGnrlPhonNum2 != "undefined") sPhonNum2 = ngmf.trim(objGnrlPhonNum2.getValue());
		if (typeof objGnrlPhonNum3 != "undefined") sPhonNum3 = ngmf.trim(objGnrlPhonNum3.getValue());

		if (gnrlPhonNum.trim().length == 0) {
			if ( sPhonNum1.length>0 && sPhonNum2.length>0 && sPhonNum3.length>0 ) {
				gnrlPhonNum =  sPhonNum1+ sPhonNum2+ sPhonNum3;
			} else {
				if (typeof objFullGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
				if (typeof objOutResult != "undefined") objOutResult.setValue("N");
				return "";
			}
		} else {
			gnrlPhonNum = ngmf.trim(gnrlPhonNum);
		}

		if (gnrlPhonNum.length == 12 && ngmf.dbSubStr(gnrlPhonNum, 0, 4) == "0000") {
			gnrlPhonNum = ngmf.dbSubStr(gnrlPhonNum, 5, 8);
		}

		if (gnrlPhonNum.length < 9) {
			if (typeof objFullGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
		}

	    //Hyphen Add
	    ngmv.phonNum1 = "";
	    ngmv.phonNum2 = "";
	    ngmv.phonNum3 = "";
	    var gnrlYn = "Y";
	    hyphenPhonNum= ngmf.setHyphenPhonNum(gnrlPhonNum, gnrlYn);
	    if (ngmf.isNull(hyphenPhonNum) == "Y") {
	    	if (typeof objFullGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
	    }
	    //2자리 국번 error처리
	    if (ngmv.phonNum2.length < 3) {
	    	if (typeof objFullGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
	    	if (typeof objOutResult != "undefined") objOutResult.setValue("N");
	    }

	    //FULL 일반전화번호 설정
	    var tmpNum = ngmf.lpad(ngmv.phonNum1, "0", 4) + ngmf.lpad(ngmv.phonNum2, "0", 4) + ngmv.phonNum3;
	    if ( ngmf.length(ngmf.trim(tmpNum)) > 0 )	 {
			if ( ngmf.isNumber(tmpNum) == "N" ) {
				if (typeof objFullGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(gnrlPhonNum);
				if (typeof objOutResult != "undefined") objOutResult.setValue("N");
				return "";
			}
	    }

	    if (typeof objGnrlPhonNum1 != "undefined") objGnrlPhonNum1.setValue(ngmv.phonNum1);
	    if (typeof objGnrlPhonNum2 != "undefined") objGnrlPhonNum2.setValue(ngmv.phonNum2);
	    if (typeof objGnrlPhonNum3 != "undefined") objGnrlPhonNum3.setValue(ngmv.phonNum3);
	    if (typeof objFullGnrlPhonNum != "undefined") objFullGnrlPhonNum.setValue(tmpNum);
	    if (typeof objHyphenGnrlPhonNum != "undefined") objHyphenGnrlPhonNum.setValue(hyphenPhonNum);
	    if (typeof objOutResult != "undefined") objOutResult.setValue("Y");
	} catch(e) {
		ngmf._error("[ngmf.db_SetGnrlPhone] Exception :: ", e);
	}

	return hyphenPhonNum;
};


/**
* 일반전화번호 형식을 DB형태의 12자리로 0을 채워서 반환한다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {String} phonNum :: I :: N ::  :: 일반전화번호
* @return {String} DB형태전화번호(12자리)
* @sampleLink ATFIL_SAMPLE
* @author 성일호
* @example ngmf.getGnrlPhone("029999999"); //return "000209999999"
* @update 2016.02.04 하이픈 포매터 변경
* @update 2016.02.12 오류수정
* @update 2016.02.17 하이픈 포매터 원복
* @since
* @useMobile use
*/
ngmf.getGnrlPhone = function(phonNum) {
	try {
		if (ngmf.isNull(ngmf.trim(phonNum)) == "Y") {
			return phonNum;
		}

		if  ((phonNum.length > 12)
				|| (phonNum.length < 8)
				|| (ngmf.isNumberOnly(phonNum) == "N")) {
			return phonNum;
		}


		//Hyphen Add
	    ngmv.phonNum1 = "";
	    ngmv.phonNum2 = "";
	    ngmv.phonNum3 = "";
	    var hyphenPhonNum= ngmf.setHyphenPhonNum(phonNum);
	    if (ngmf.isNull(hyphenPhonNum) == "Y") {
			return phonNum;
	    }
	    //var phonNumArr = hyphenPhonNum.split("-");

	    //FULL 일반전화번호 설정
	    if (ngmv.phonNum1.length < 4) {
	    	ngmv.phonNum1 = ngmf.lpad(ngmv.phonNum1 , "0", 4);
	    }
	    if (ngmv.phonNum2.length < 4) {
	    	ngmv.phonNum2 = ngmf.lpad(ngmv.phonNum2, "0", 4);
	    }
	    return ngmv.phonNum1 + ngmv.phonNum2 + ngmv.phonNum3;
	} catch(e) {
		ngmf._error("[ngmf.getGnrlPhone] Exception :: ", e);
	}
	return "";
};;

/**
 *  Hyphen이 없는 전화번호에 Hyphen을 추가하여 반환한다.
 * @date 2015. 10. 19.
 * @memberOf ngmf
 * @param {String} phonNum :: I :: N ::  :: 전화번호
 * @param {String} gnrlYn :: I :: Y ::  :: 일반전화번호 여부("08" 체크여부)
 * @returns {String} 하이픈이 추가된 번호
 * @author 성일호
 * @example ngmf.setHyphenPhonNum ("0299999999", "N"); //return "02-9999-9999"
 * @update 2012.02.12 불필요한 변수 삭제
 * @since
 * @useMobile use
 */
ngmf.setHyphenPhonNum = function (phonNum, gnrlYn ) {
	try {
		var endFg = "N";
		var chrIdx = 0;
		var curVal = "";
		var befVal = "";
		var chrCnt = 0;
		var tmpNum = "";
		var lRepeat = 0;
		var resVal = "N";

		var phonNum1 = "";
		var phonNum2 = "";
		var phonNum3 = "";
		var conNum   = "";

		//1. 최초 '0' Index Search
		while (endFg == 'N') {
			chrIdx++;
			curVal = ngmf.dbSubStr(phonNum,chrIdx,1);
			if (parseInt(curVal) > 0 || chrCnt++ == 4) {
				endFg = 'Y';
			} else {
		    	befVal = curVal;
		    }
		}
		if (chrIdx == 0 || chrIdx > 4) {
			return "";
		}

		conNum = befVal + curVal;
		//2. 첫번째 자리부터 0 이 아닌 숫자가 나올경우 첫번째자리부터 잘라오기 위함.
		if ( chrIdx-1 < 1) {
			chrIdx = 2;
		}

		//3. 전화번호 1,2,3
		while (resVal == "N" && (6-chrIdx-lRepeat) > 0) {
			tmpNum= ngmf.dbSubStr(phonNum, chrIdx-1, 6-chrIdx-lRepeat);
			resVal=ngmf.searchLocalPhonenum( tmpNum, "ZNGM_C_ANBC0" ); //입력된 전화번호, 비교결과
			if (resVal=="Y") {
		         phonNum1=ngmf.dbSubStr(phonNum, chrIdx-1, 6-chrIdx-lRepeat);
		         phonNum2=ngmf.dbSubStr(phonNum, 5-lRepeat, phonNum.length-4-4+lRepeat );
		         phonNum3=ngmf.dbSubStr(phonNum, phonNum.length-3, 4);
		    }
			lRepeat++;
		}

		if (phonNum2.substr(0, 1) == "0") {
			if (  gnrlYn == "Y" && phonNum2.length > 3 ) {
				phonNum2 = phonNum2.substr(1, phonNum2.length);
			} else  {
				phonNum2 = phonNum2.substr(1, phonNum2.length);
			}
		}

		//4.전화번호2 체크
		endFg = 'N';
		chrIdx = 0;
		while (endFg == 'N') {
			chrIdx++;
			curVal = ngmf.dbSubStr(phonNum2,chrIdx,1);
			if (curVal == "*" || parseInt(curVal) > 0 || chrCnt++ == 4 ) {
				endFg = 'Y';
			}
		}
		tmpNum = ngmf.dbSubStr(phonNum2, chrIdx, phonNum2.length-(chrIdx-1));
		if (tmpNum.length < 2) {
			return "";
		}

		if ( gnrlYn == "Y") {
			if ( ngmf.dbSubStr(phonNum2, chrIdx,phonNum2.length-(chrIdx-1)).length < 2 ) {
				if(conNum != "08") return "";
			}
		}

		if (phonNum3.length != 4) {
			return "";
		}

		ngmv.phonNum1 = phonNum1;
		ngmv.phonNum2 = phonNum2;
		ngmv.phonNum3 = phonNum3;
		return phonNum1 + "-" + phonNum2 + "-" + phonNum3;
	} catch(e) {
		ngmf._error("[ngmf.setHyphenPhonNum] Exception :: ", e);
	}
	return "";
};

/**
* 식별번호가 유효한지 여부를 체크한다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {String} key_num :: I :: N ::  :: 입력값
* @param {String} commCdId :: I :: N ::  :: 식별번호구분코드( 식별번호구분코드 :: 무선(ZORD_C_DNDCD), 일반전화식별코드(유/무선)(ZNGM_C_ANBC0)
* @returns {String} 식별번호가 유효한 경우 Y, 이외인 경우 N
* @author 성일호
* @example ngmf.searchLocalPhonenum("02", "ZNGM_C_ANBC0") //return "Y"
* @example search_local_phonenum( "02" ) //return "Y"
* @since
* @useMobile use
*/
ngmf.searchLocalPhonenum = function( key_num , commCdId) {
	 //  공통코드에는 0707번호가 등록되어 있지만 전화번호 API에서는
	 //  0707번호는 없는것으로 처리하기 위해 하드코딩으로 0707은 제외시킨다.
	 //  070과 0707을 구분지을 명백한 룰이 없으나 기존에 070으로 처리를 해왔기때문
	try {
		if( key_num == "0707" ) return "N";

	 	var matchedArr = GLD.GDS_COMMONCOMBO.getMatchedIndex( "comm_cd_id" , commCdId , true);
	 	if (matchedArr.length == 0) {
	 		var dst_outLocalPhoneNum = ngmf.createDataList("dst_outLocalPhoneNum", ["comm_cd_id", "comm_cd_val", "comm_cd_val_nm"]);
	 		var ScreenName = ngmf.getFormID();
			var strInputObjList = new Array();
			strInputObjList[0] = commCdId;
			strInputObjList[10] = "Y";
			var outputList = "dst_outLocalPhoneNum";

			ngmf.combo(ScreenName,strInputObjList,outputList, "", "", "", "", "", "", "", "SELF", true);
			var arrIdx = dst_outLocalPhoneNum.getMatchedIndex("comm_cd_val", key_num);
			ngmf.destroyDataList("dst_outLocalPhoneNum");

			if (arrIdx.length == 0) {
				return "N";
			}
	 	} else {
	 		for(var i = 0; i < matchedArr.length ; i++) {
	 			if ( GLD.GDS_COMMONCOMBO.getCellData(matchedArr[i],"comm_cd_val") ==  key_num) return "Y";
	 		}
	 		return "N";
	 		/*
			//식별번호가 유효한지 공통데이터셋에서 체크하는 부분
			GLD.GDS_COMMONCOMBO.removeColumnFilterAll();
			GLD.GDS_COMMONCOMBO.setColumnFilter({type:'row', colIndex:'comm_cd_id', key: commCdId, condition:'and'});
			GLD.GDS_COMMONCOMBO.setColumnFilter({type:'row', colIndex:'comm_cd_val', key: key_num, condition:'and'});
			var chkCnt = GLD.GDS_COMMONCOMBO.getRowCount();
			//var chkCnt = GDS_COMMONCOMBO.filteredRowIndexArr.length;
			GLD.GDS_COMMONCOMBO.removeColumnFilterAll();
			if(chkCnt <= 0) {
				return "N";
			} else if(chkCnt > 0) return "Y";
			*/
	 	}
		return "Y";
	} catch(e) {
		ngmf._error("[ngmf.searchLocalPhonenum] Exception :: ", e);
		return "N";
	}
};

/**
 * 유선서비스일경우 Hyphen이 추가된번호로 반환한다.
 * 이외의 경우 입력받은 번호를 반환한다.
 * @date 2015. 10. 15.
 * @memberOf ngmf
 * @param {String} phonNum :: I :: Y ::  :: 서비스번호
 * @param {String} compphonNum1 :: IO :: Y ::  :: 서비스번호1 OUTPUT COMPONENT 명
 * @param {String} compphonNum2 :: IO :: Y ::  :: 서비스번호2 OUTPUT COMPONENT 명
 * @param {String} compphonNum3 :: IO :: Y ::  :: 서비스번호3 OUTPUT COMPONENT 명
 * @param {String} compFullphonNum :: O :: Y ::  :: 전체 서비스번호 OUTPUT COMPONENT 명
 * @param {String} compHyphenphonNum :: O :: Y ::  :: Hyphen 서비스번호 OUTPUT COMPONENT 명
 * @param {String} compOutResult :: O :: Y ::  :: 결과 OUTPUT COMPONENT 명
 * @param {String} svcCd :: I :: Y ::  :: 서비스구분코드
 * @return {String} 하이픈된 전화번호
 * @author 성일호
 * @example ngmf.setphone_ex ("07099999999", "COMP1", "COMP2", "COMP3", "COMP4", "COMP5",  "RESULTCOMP", "" ) //return 070-9999-9999
 * @update 성일호 2016.02.04  example 외 주석수정  ZNGMXVLD00010.js L:2184 compphonNum31 is not defined오류  L:2189  L:2194  gnrlPhonNum is not defined(…)  수정
 * @update 성일호 2016.02.12  단순 처리시 오류 COMP1
 * @since
 * @useMobile use
 */
ngmf.setphone_ex = function(phonNum,compphonNum1, compphonNum2, compphonNum3, compFullphonNum, compHyphenphonNum, compOutResult, svcCd) {
	var retStr = "";
	try {
		var sPhonNum1 = "";
		var sPhonNum2 = "";
		var sPhonNum3 = "";

		if (ngmf.isNull(ngmf.trim(phonNum)) == "Y" && typeof compphonNum1 != "undefined") {
			if (ngmf.object(compphonNum1)) sPhonNum1 = ngmf.trim(ngmf.object(compphonNum1).getValue());
			if (ngmf.object(compphonNum2)) sPhonNum2 = ngmf.trim(ngmf.object(compphonNum2).getValue());
			if (ngmf.object(compphonNum3)) sPhonNum3 = ngmf.trim(ngmf.object(compphonNum3).getValue());

			if ( ngmf.isNull(sPhonNum1) =="N" && ngmf.isNull(sPhonNum2) =="N" && ngmf.isNull(sPhonNum3) =="N" ) {
				phonNum =  sPhonNum1+ sPhonNum2+ sPhonNum3;
			} else {
				if (ngmf.object(compFullphonNum)) ngmf.object(compFullphonNum).setValue(phonNum);
				if (ngmf.object(compOutResult)) ngmf.object(compOutResult).setValue("N");
				return retStr;
			}
		} else {
			phonNum = phonNum.trim();
		}
		if (!phonNum) return retStr;
		if (svcCd == "P" && ngmf.length(phonNum) != 12) {
			retStr = phonNum;
		} else if ( svcCd == "I" || svcCd == "T" || svcCd == "N" || svcCd == "B" || svcCd == "E" || svcCd == "S") {
			retStr = phonNum;
		} else {
			retStr = ngmf.setGnrlPhone(phonNum, compphonNum1, compphonNum2, compphonNum3, compFullphonNum, compHyphenphonNum, compOutResult);
		}

		if (ngmf.isNull(ngmf.trim(retStr)) == "Y") {
			retStr = phonNum;
		}
	} catch(e) {
		ngmf._error("[ngmf.setphone_ex] Exception :: ", e);
	}
	return retStr;
};

/**
* 서비스전화번호 형식을 Component에 설정해서 반환한다.
* @date 2015. 10. 19.
* @memberOf ngmf
* @param {String} phonNum :: I :: Y ::  :: 서비스번호
* @param {String} compphonNum1 :: I :: Y ::  :: 서비스번호1 component 명
* @param {String} compphonNum2 :: I :: Y ::  :: 서비스번호2 component 명
* @param {String} compphonNum3 :: I :: Y ::  :: 서비스번호3 component명
* @param {String} compFullphonNum :: IO :: Y ::  :: FULL 서비스번호  component명
* @param {String} compHyphenphonNum :: IO :: Y ::  :: 하이픈 서비스번호 component명
* @param {String} compOutResult :: IO :: Y ::  :: 처리결과 component명
* @returns {String} 하이픈이 추가된 서비스번호
* @sampleLink ATFIL_SAMPLE
* @author 성일호
* @example ngmf.setSvcPhon("", "compphonNum1", "compphonNum2", "compphonNum3",  "compFullphonNum", ""compHyphenphonNum","compOutResult")
* @example ngmf_SetSvcPhone("", "EDIT0", "EDIT1", "EDIT2", "EDIT3", "EDIT4", "EDIT5");
* @since
* @useMobile use
*/
ngmf.setSvcPhone = function(phonNum, compphonNum1, compphonNum2, compphonNum3, compFullphonNum, compHyphenphonNum, compOutResult) {
	var dbYn = "N";
	return  ngmf.setCompSvcPhone(phonNum, compphonNum1, compphonNum2, compphonNum3, compFullphonNum, compHyphenphonNum, compOutResult, dbYn);
};

/**
* 서비스전화번호 형식을 하이픈이 추가된 번호로 반환한다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {String} phonNum :: I :: Y ::  :: 서비스전화번호
* @param {String} compphonNum1 :: I :: Y ::  :: 서비스전화번호1 OUTPUT COMPONENT 명
* @param {String} compphonNum2 :: I :: Y ::  :: 서비스전화번호2 OUTPUT COMPONENT 명
* @param {String} compphonNum3 :: I :: Y ::  :: 서비스전화번호3 OUTPUT COMPONENT 명
* @param {String} compFullphonNum :: IO :: Y ::  :: 서비스전화번호 OUTPUT COMPONENT 명
* @param {String} compHyphenphonNum :: IO :: Y ::  :: Hyphen 서비스전화번호 OUTPUT COMPONENT 명
* @param {String} compOutResult 결과 :: IO :: Y ::  :: OUTPUT COMPONENT 명 : 정상이면 "Y" 이외는 "N"
* @return {String}  하이픈된 전화번호
* @sampleLink ATFIL_SAMPLE
* @author 성일호
* @example ngmf.db_SetSvcPhone("01099999999", "COMPONENT1", "COMPONENT2", "COMPONENT3", "COMPONENT4", "COMPONENT5","COMPOutResult")
* @exampleAsIs ngmf_db_SetSvcPhone("", "EDIT0", "EDIT1", "EDIT2", "EDIT3", "EDIT4", "EDIT5");
* @update 성일호 2016.02.04  example 외 주석수정
* @since
* @useMobile use
*/
ngmf.db_SetSvcPhone = function(phonNum, compphonNum1, compphonNum2, compphonNum3, compFullphonNum, compHyphenphonNum, compOutResult ) {
	var dbYn = "Y";
	return  ngmf.setCompSvcPhone(phonNum, compphonNum1, compphonNum2, compphonNum3, compFullphonNum, compHyphenphonNum, compOutResult, dbYn);
};

/**
 * 서비스전화번호 형식을 하이픈이 추가된 번호로 반환한다. (NGM3.0 추가)
 * @date 2015. 10. 15.
 * @memberOf ngmf
 * @param {String} phonNum :: I :: Y ::  :: 서비스전화번호
 * @param {String} compphonNum1 :: I :: Y ::  :: 서비스전화번호1 OUTPUT COMPONENT 명
 * @param {String} compphonNum2 :: I :: Y ::  :: 서비스전화번호2 OUTPUT COMPONENT 명
 * @param {String} compphonNum2 :: I :: Y ::  :: 서비스전화번호3 OUTPUT COMPONENT 명
 * @param {String} compFullphonNum :: IO :: Y ::  :: 서비스전화번호 OUTPUT COMPONENT 명
 * @param {String} compHyphenphonNum :: IO :: Y ::  :: Hyphen 서비스전화번호 OUTPUT COMPONENT
 * @param {String} compOutResult :: IO :: Y ::  :: 결과 OUTPUT COMPONENT 명 : 정상이면 "Y" 이외는 "N"
 * @param {String} dbYn :: I :: Y ::  :: 숫자로만 구성되어있는지 체크 여부
 * @return {String} 하이픈된 전화번호
 * @author 성일호
 * @example ngmf.setCompSvcPhone ("01099999999", "COMPONENT1", "COMPONENT2", "COMPONENT3", "COMPONENT4", "COMPONENT5", "COMPOutResult",  "Y")
 * @update 성일호 2016.02.04  example 외 주석수정
 * @since
 * @useMobile use
 */
ngmf.setCompSvcPhone = function(phonNum, compphonNum1, compphonNum2, compphonNum3, compFullphonNum, compHyphenphonNum, compOutResult, dbYn) {
	try {
		var objphonNum1      = ngmf.object( compphonNum1 );
		var objphonNum2      = ngmf.object( compphonNum2 );
		var objphonNum3      = ngmf.object( compphonNum3 );
		var objFullphonNum   = ngmf.object( compFullphonNum );
		var objHyphenphonNum = ngmf.object( compHyphenphonNum );
		var objOutResult     = ngmf.object( compOutResult );
	
		var sPhonNum1 = "";
		var sPhonNum2 = "";
		var sPhonNum3 = "";
		if (typeof objphonNum1 != "undefined") sPhonNum1 = ngmf.trim(objphonNum1.getValue());
		if (typeof objphonNum2 != "undefined") sPhonNum2 = ngmf.trim(objphonNum2.getValue());
		if (typeof objphonNum3 != "undefined") sPhonNum3 = ngmf.trim(objphonNum3.getValue());
	
		var endFg = "N";
		var chrIdx = 0;
		var curVal = "";
		var befVal = "";
		var chrCnt = 0;
		var tmpNum = "";
	
		var l_phone_num1 = "";
		var l_phone_num2 = "";
		var l_phone_num3 = "";
		var conNum   = "";
	
		if ( ngmf.isNull(ngmf.trim(phonNum)) == "Y") {
			if ( sPhonNum1.length>0 && sPhonNum2.length>0 && sPhonNum3.length>0 ) {
				phonNum =  sPhonNum1+ sPhonNum2+ sPhonNum3;
			} else {
				if (typeof objFullphonNum != "undefined") objFullphonNum.setValue(phonNum);
				if (typeof objOutResult != "undefined") objOutResult.setValue("N");
				return "";
			}
		} else {
			phonNum = ngmf.trim(phonNum);
		}
	
		if (phonNum.length < 10 || phonNum.length > 11 ) {
			if (typeof objFullphonNum != "undefined") objFullphonNum.setValue(phonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
		}
	
	
		//1. 최초 '0' Index Search
		while (endFg == 'N') {
			chrIdx++;
			curVal = ngmf.dbSubStr(phonNum,chrIdx,1);
			if (parseInt(curVal) > 0 || chrCnt++ == 4) {
				endFg = 'Y';
			} else {
		    	befVal = curVal;
		    }
		}
	
		if (chrIdx == 0 || chrIdx > 4) {
			if (typeof objFullphonNum != "undefined") objFullphonNum.setValue(phonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
		}
	
		conNum = befVal + curVal;
	
	
	    if (conNum == "01") {
	        if(ngmf.dbSubStr(phonNum, chrIdx+1, 1) == "3") {
	            l_phone_num1 = ngmf.dbSubStr(phonNum, chrIdx-1, 4);
	            l_phone_num2 = ngmf.dbSubStr(phonNum, chrIdx+3, phonNum.length-((chrIdx+2)+4));
	            l_phone_num3 = ngmf.dbSubStr(phonNum, ((chrIdx+2)+l_phone_num2.length+1 ),4);
	        } else {
	            l_phone_num1 = ngmf.dbSubStr(phonNum, chrIdx-1, 3);
	            l_phone_num2 = ngmf.dbSubStr(phonNum, chrIdx+2, phonNum.length - ((chrIdx+1) + 4));
	            l_phone_num3 = ngmf.dbSubStr(phonNum,((chrIdx+1) + l_phone_num2.length+1 ),4);
	        }
	    } else {
	        l_phone_num1 = ngmf.dbSubStr(phonNum, 1, 3);
	        l_phone_num2 = ngmf.dbSubStr(phonNum, 4, phonNum.length - (l_phone_num1.length + 4));
	        l_phone_num3 = ngmf.dbSubStr(phonNum, l_phone_num1.length + l_phone_num2.length + 1, 4);
	    }
	
		if(l_phone_num2.substr(0, 1) == "0") {
			l_phone_num2 = l_phone_num2.substr(1, l_phone_num2.length);
		}
	
		var retSearch = ngmf.searchLocalPhonenum(ngmf.trim(l_phone_num1), "ZORD_C_DNDCD");
		if (retSearch == "N") {
			if (typeof objFullphonNum != "undefined") objFullphonNum.setValue(phonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
		}
	
		endFg = 'N';
		chrIdx = 0;
		while (endFg == 'N') {
			chrIdx++;
			curVal = ngmf.dbSubStr(l_phone_num2,chrIdx,1);
			if (curVal == "*" || parseInt(curVal) > 0 || chrCnt++ == 4 ) {
				endFg = 'Y';
			}
		}
	
		tmpNum = ngmf.dbSubStr(l_phone_num2, chrIdx, l_phone_num2.length-(chrIdx-1));
		if (tmpNum.length < 3) {
			if (typeof objFullphonNum != "undefined") objFullphonNum.setValue(phonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
		}
	
		if (l_phone_num3.length != 4) {
			if (typeof objFullphonNum != "undefined") objFullphonNum.setValue(phonNum);
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
		}
	
		if (dbYn == "Y") {
			tmpNum = l_phone_num1 + l_phone_num2 + l_phone_num3;
		    if ( tmpNum.trim().length > 0 )	 {
				if ( ngmf.isNumber(tmpNum) == "N" ) {
					if (typeof objFullphonNum != "undefined") objFullphonNum.setValue(phonNum);
					if (typeof objOutResult != "undefined") objOutResult.setValue("N");
					return "";
				}
		    }
		}
	
		if (typeof objphonNum1 != "undefined") objphonNum1.setValue(l_phone_num1);
		if (typeof objphonNum2 != "undefined") objphonNum2.setValue(l_phone_num2);
		if (typeof objphonNum3 != "undefined") objphonNum3.setValue(l_phone_num3);
		var hyphenPhonNum = l_phone_num1 + "-" + l_phone_num2 + "-" + l_phone_num3;
		if (typeof objHyphenphonNum != "undefined") objHyphenphonNum.setValue(hyphenPhonNum);
	
		switch(l_phone_num2.length) {
			case 2:
				l_phone_num2 = "00"+l_phone_num2;
				break;
			case 3:
				l_phone_num2 = "0"+l_phone_num2;
				break;
			default:
				break;
		}
		if (typeof objFullphonNum != "undefined") objFullphonNum.setValue(l_phone_num1 + l_phone_num2 + l_phone_num3);
		if (typeof objOutResult != "undefined") objOutResult.setValue("Y");
		return hyphenPhonNum;
	} catch (ex) {
		ngmf._error("[ngmf.setCompSvcPhone] Exception :: ", ex);
	}	
	return phonNum;
};


/**
 * CAS번호 형식을 하이픈이 추가된 번호로 반환한다.
 * @date 2015-10-02
 * @memberOf ngmf
 * @param {String} casNum :: I :: Y ::  :: 11자리 CAS번호
 * @param {String} compCasNum1 :: I :: Y ::  ::CAS번호1 OUTPUT COMPONENT 명
 * @param {String} compCasNum2 :: I :: Y ::  ::CAS번호2 OUTPUT COMPONENT 명
 * @param {String} compCasNum3 :: I :: Y ::  ::CAS번호3 OUTPUT COMPONENT 명
 * @param {String} compHyphenCasNum :: IO :: Y ::  ::Hyphen CAS번호 OUTPUT COMPONENT 명
 * @param {String} compOutResult :: IO :: Y ::  ::결과 OUTPUT COMPONENT 명
 * @return {String} 정상이면 "Y" 이외는 "N"
 * @example ngmf.setCasPhone ("12345678901", "COMPONENT1", "COMPONENT2", "COMPONENT3", "COMPONENT4", "COMPONENT5")
 * @exampleAsIs ngmf_SetCasPhone("12345678901", "EDIT0", "EDIT1", "EDIT2", "EDIT3", "EDIT4")
 * @useMobile use
 */

ngmf.setCasPhone = function(casNum ,compCasNum1, compCasNum2, compCasNum3 ,compHyphenCasNum ,compOutResult) {
	try {	
		var objCasNum1  = ngmf.object( compCasNum1 );
		var objCasNum2  = ngmf.object( compCasNum2 );
		var objCasNum3  = ngmf.object( compCasNum3 );
		var objHyphenCasNum = ngmf.object( compHyphenCasNum );
		var objOutResult    = ngmf.object( compOutResult );

		var sPhonNum1 = "";
		var sPhonNum2 = "";
		var sPhonNum3 = "";

		if (typeof objCasNum1 != "undefined") sPhonNum1 = ngmf.trim(objCasNum1.getValue());
		if (typeof objCasNum2 != "undefined") sPhonNum2 = ngmf.trim(objCasNum2.getValue());
		if (typeof objCasNum3 != "undefined") sPhonNum3 = ngmf.trim(objCasNum3.getValue());

		if (ngmf.isNull(casNum) == "Y") {
			if (sPhonNum1.length > 0  && sPhonNum2.length > 0  && sPhonNum3.length > 0) {
				casNum = sPhonNum1 + sPhonNum2 + sPhonNum3;
			} else {
				if (typeof objOutResult != "undefined") objOutResult.setValue("N");
				return "";
			}
		} else {
			casNum = ngmf.trim(casNum);
		}

		if(casNum.length == 11)  {

			if (typeof objCasNum1 != "undefined") objCasNum1.setValue( ngmf.dbSubStr(casNum, 0, 3) );
			if (typeof objCasNum2 != "undefined") objCasNum2.setValue( ngmf.dbSubStr(casNum, 4, 3) );
			if (typeof objCasNum3 != "undefined") objCasNum3.setValue( ngmf.dbSubStr(casNum, 7, 5) );
			if (typeof objHyphenCasNum != "undefined") {
				objHyphenCasNum.setValue( ngmf.dbSubStr(casNum, 0, 3) + "-" +
										  ngmf.dbSubStr(casNum, 4, 3) + "-" +
										  ngmf.dbSubStr(casNum, 7, 5)  );
			}
			if (typeof objOutResult != "undefined") objOutResult.setValue("Y");
		} else {
			if (typeof objOutResult != "undefined") objOutResult.setValue("N");
			return "";
		}
		return "Y";
	} catch (ex) {
		ngmf._error("[ngmf.setCasPhone] Exception :: casNum", ex);
	} 
	return "N";
};


/**
* 시스템의 날짜를 반환한다.
* @date 2015. 10. 15.
* @memberOf ngmf
* @return {String} 시스템의 날짜
* @author 성일호
* @example ngmf.getSysDate(); //return "2015-10-15"
* @since
* @useMobile use
*/
ngmf.getSysDate = function(){ 
	//기존 서비스호출(SysDate Action) 에서  WebSquare.date.getCurrentServerDate 변경
	//TODO :: MDI 오픈 시 PT 서버 시간 가져와서 셋팅 후 HDTimer(WinAPI)를 이용 서비스 호출 횟수 줄이는것은 추후 방안 수립
	// UKEY (G_FORMUSEFG <> "M") , ExtGetHDTime
	return WebSquare.date.getCurrentServerDate( "yyyy-MM-dd" );
};


/**
* MDI 오픈시 PT 서버 시간 가져와서 셋팅 후 HDTimer(WinAPI)를 이용 로직으로 구현된 날짜 및 시간을 가져온다.
* 구분값 4,5 기존 PT 서버에서 가져오는 방식으로 추가
* @date 2015. 10. 15.
* @memberOf ngmf
* @param {String} sGubun :: I :: N ::  :: 구분값
* -  "1" = "YYYY-MM-DD" 형식 
* -  "2" = "YYYYMMDDHHMISS" 
* -  "3" = "YYYYMMDDHHMISSUUUUUU"
* -  "4" = "YYYYMMDDHHMISS" 
* -  "5" = "YYYYMMDDHHMISSUUUUUU"
* @return {String} 정상이면 일자 이외는 ""
* @author 성일호
* @example ngmf.getDateTime("1"); //return "2015-10-15"
* @since
* @useMobile use
*/
ngmf.getDateTime = function(sGubun) {
	if ( ngmf.isNull(sGubun) == "Y" )	return "";
	//기존 서비스호출(SysDate Action) 에서  WebSquare.date.getCurrentServerDate 변경
	//TODO :: MDI 오픈 시 PT 서버 시간 가져와서 셋팅 후 HDTimer(WinAPI)를 이용 서비스 호출 횟수 줄이는것은 추후 방안 수립
	//UKEY (G_FORMUSEFG <> "M") , ExtGetHDTime

	var igubun = parseInt(sGubun);
	if (igubun <= 3) {
		var date = new Date();
		if (igubun == 1) retValue = date.format("yyyy-MM-dd");
		if (igubun == 2) retValue = date.format("yyyyMMddHHmmss");
		if (igubun == 3) retValue = date.format( "yyyyMMddHHmmssSSS" ) + "000";
	} else {
		if (igubun == 4) retValue = WebSquare.date.getCurrentServerDate( "yyyyMMddHHmmss" );
		if (igubun == 5) retValue = WebSquare.date.getCurrentServerDate( "yyyyMMddHHmmssSSS" ) + "000"; 
	} 
	return retValue;
};

/**
 * 전화번호 포맷터  정합성 체크하지 않음
 * @date 2016. 2. 4.
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  ::포맷 대상  전화번호
 * @return {String}
 * @author 성일호
 * @example  var hPhone = ngmf.setHyphenPhonFomatter("12345678901");
 * @update 성일호 2016.02.12 * 문자 처리 되도록 수정
 * @useMobile use
 */
ngmf.setHyphenPhonFomatter = function (_str) {
	var str = "";
	try {
		str = _str.replace(new RegExp("-", "g"), "");
		//var RegNotNum = /[^0-9]/g;
		var RegPhonNum = "";
		var DataForm = "";

		if (str == "" || str == null)
			return "";
		// delete not number
		//str = str.replace(RegNotNum, '');

		if (str.length < 4)
			return str;

		if (str.length > 3 && str.length < 7) {
			DataForm = "$1-$2";
			RegPhonNum = /([0-9*]{3})([0-9*]+)/;
		} else if (str.length == 7) {
			DataForm = "$1-$2";
			RegPhonNum = /([0-9*]{3})([0-9*]{4})/;
		} else if (str.length == 8) {
			DataForm = "$1-$2";
			RegPhonNum = /([0-9*]{4})([0-9*]{4})/;
		} else if (str.length == 9) {
			DataForm = "$1-$2-$3";
			RegPhonNum = /([0-9]{2})([0-9*]{3})([0-9*]+)/;
		} else if (str.length == 10) {
			if (str.substring(0, 2) == "02") {
				DataForm = "$1-$2-$3";
				RegPhonNum = /([0-9]{2})([0-9*]{4})([0-9*]+)/;
			} else {
				DataForm = "$1-$2-$3";
				RegPhonNum = /([0-9]{3})([0-9*]{3})([0-9*]+)/;
			}
		} else if (str.length == 11) {
			DataForm = "$1-$2-$3";
			RegPhonNum = /([0-9]{3})([0-9*]{4})([0-9*]+)/;
		} else if (str.length == 12) {
			DataForm = "$1-$2-$3";
			RegPhonNum = /([0-9]{4})([0-9*]{4})([0-9*]+)/;
		}
		return str.replace(RegPhonNum, DataForm);
	} catch(e) {
		ngmf._error("[ngmf.setHyphenPhonFomatter] Exception :: ", e);
	}
	return "";
};

/**
 * 일반전화번호 형식을 세팅해서 반환한다.[최초반영]
 * @date 2016. 02. 06.
 * @memberOf ngmf
 * @param {String} pi_phone_num :: I :: Y ::  :: 하이픈이 없는 전화번호 (Grid에서 사용가능, 단 express은 불가)
 * @param {String} comp_po_phone_num1 :: I :: Y ::  :: 서비스번호1 OUTPUT COMPONENT 명
 * @param {String} comp_po_phone_num2 :: I :: Y ::  :: 서비스번호2 OUTPUT COMPONENT 명
 * @param {String} comp_po_phone_num3 :: I :: Y ::  :: 서비스번호3 OUTPUT COMPONENT 명
 * @param {String} comp_po_phone_num4 :: IO :: Y ::  :: 전체 서비스번호 OUTPUT COMPONENT 명
 * @param {String} comp_po_phone_num5 :: IO :: Y ::  :: Hyphen 서비스번호 OUTPUT COMPONENT 명
 * @param {String} comp_po_phone_num6 :: IO :: Y ::  :: 결과 OUTPUT COMPONENT 명
 * @param {String} svc_cd :: I :: Y ::  :: 서비스구분코드
 * @returns {String} 하이픈이 추가된 문자열가 반환된다.  단, 결과값이 없는 경우, 입력값을 그대로 반환한다.
 * @author 성일호
 * @example ngmf.setGnrlPhone_ex("0299998888", "inp_phone_no1", "inp_phone_no2", "inp_phone_no3", "inp_phone_no", "inp_phone_no_hp","resultTxt", "" );
 * @exampleAsIs ngmf_SetGnrlPhone_ex("01027049032",  "EDIT0", "EDIT1", "EDIT2", "EDIT3", "EDIT4", "EDIT5", "EDIT6"); 
 * @since
 * @useMobile use
 */
ngmf.setGnrlPhone_ex = function (pi_phone_num, comp_po_phone_num1, comp_po_phone_num2, comp_po_phone_num3, comp_po_phone_num4, comp_po_phone_num5, comp_po_phone_num6, svc_cd) {
	var ret_str = "";
	try {
		if (ngmf.length(ngmf.trim(pi_phone_num)) == 0) {
			if (ngmf.length(ngmf.trim(ngmf.object(comp_po_phone_num1).value)) > 0
					&& ngmf.length(ngmf.trim(ngmf.Object(comp_po_phone_num2).value)) > 0
					&& ngmf.length(ngmf.trim(ngmf.Object(comp_po_phone_num3).value)) > 0) {
				pi_phone_num = ngmf.trim(ngmf.Object(comp_po_phone_num1).value)
						+ ngmf.trim(ngmf.Object(comp_po_phone_num2).value)
						+ ngmf.trim(ngmf.Object(comp_po_phone_num3).value);
			} else {
				ngmf.object(comp_po_phone_num4).value = pi_phone_num;
				ngmf.object(comp_po_phone_num6).value = "N";
				return "";
			}
		} else {
			pi_phone_num = ngmf.trim(pi_phone_num);
		}

		// 서비스코드가 P인 경우 자리수를 체크해서 ngmf_setGnrlPhone함수 호출
		if ((svc_cd == "P") && (ngmf.length(pi_phone_num) != 12)) {
			ret_str = pi_phone_num;
		} else if ((svc_cd == "I") || // 초고속 인터넷
		(svc_cd == "T") || // TV
		(svc_cd == "N") || // 비 회선
		(svc_cd == "B") || // 기업 데이터
		(svc_cd == "E") || // 기업 IDC
		(svc_cd == "S")) // 기업 솔루션
		{
			ret_str = pi_phone_num;
		} else {
			// 일반전화번호 형식으로 셋팅하는 함수 호출
			ret_str = ngmf.setGnrlPhone(pi_phone_num, comp_po_phone_num1,
					comp_po_phone_num2, comp_po_phone_num3, comp_po_phone_num4,
					comp_po_phone_num5, comp_po_phone_num6);
		}

		// 함수 호출 결과 오류인 경우, 입력값을 결과값이 셋팅
		if (ngmf.length(ngmf.trim(ret_str)) == 0)
			ret_str = pi_phone_num;

	} catch (e) {
		ngmf._error("[ngmf.setGnrlPhone_ex] Exception :: ", e);
	}
	return ret_str;
};


/**
 * 메모 내용에 고객정보가 있는지 체크한다. 
 * @date 2016. 2. 4.
 * @memberOf ngmf
 * @param {String} vMemo :: I :: N ::  :: 메모
 * @return {Boolean}
 * @author 김응한
 * @example  ngmf.memoValidate("010-1234-1114");
 * @useMobile use
 
 */
ngmf.memoValidate = function(vMemo) {
	var rtnVal = true;
	var patternList = Array();
	if (ngmf.isNull(vMemo) == 'Y') {
		return rtnVal;
	}
	patternList[0] = "[0-9*][ ~-][0-9]{3,4}[ ~-][0-9]{4}"; // 전화번호 확인
	patternList[1] = "[0-9]{6}[1-8][0-9]{6}"; // 주민번호/외국인등록번호 확인 1
	patternList[2] = "[0-9]{6}[ ~-][1-8][0-9]{6}"; // 주민번호/외국인등록번호 확인 2
	patternList[3] = "[1-9][0-9]{5}[1-2][0-9]{6}"; // 법인번호 확인 1
	patternList[4] = "[1-9][0-9]{5}[ ~-][1-2][0-9]{6}"; // 법인번호 확인 2
	patternList[5] = "[1-9]{3}[1-9]{2}[0-9]{5}"; // 사업자 번호 1
	patternList[6] = "[1-9]{3}[ ~-][1-9]{2}[ ~-][0-9]{5}"; // 사업자 번호 2
	patternList[7] = "[0-9]{2}[0-9]{6}[0-9]{2}"; // 운전면허번호 확인 1
	patternList[8] = "[0-9]{2}[ -~][0-9]{6}[ -~][0-9]{2}"; // 운전면허번호 확인 2
	patternList[9] = "[a-zA-Z]{1}[0-9]{8}"; // 여권번호 확인 1
	patternList[10] = "[a-zA-Z]{2}[0-9]{7}"; // 여권번호 확인 2
	patternList[11] = "[a-zA-Z]{2}[ ~-][0-9]{7}"; // 여권번호 확인 3
	patternList[12] = "[34569][0-9]{3}[0-9]{4}[0-9]{4}[0-9]{4}"; // 신용카드번호 확인
	// 1
	patternList[13] = "[34569][0-9]{3}[ -~][0-9]{4}[ -~][0-9]{4}[ -~][0-9]{4}"; // 신용카드번호
	// 확인 2
	patternList[14] = "[0-9]{14}"; // 계좌번호

	for ( var i = 0; i < ngmf.length(patternList); i++) {
		var regexp = ngmf.createRegExp(patternList[i], "gi");
		if (regexp.test(vMemo)) {
			var strMsg = ngmf.getMessage("ZORDC8063", "&INPUT", ngmf.toString(i));
			if (ngmf.length(strMsg) > 0)
				ngmf.alert(strMsg);
			rtnVal = false;
			break;
		}
	}

	return rtnVal;
};
/**
 * SHA1 암호화 API
 * @date 2016.06.07
 * @memberOf ngmf
 * @param {String} inStr :: I :: N ::  :: 암호화할 문자열
 * @param {String} scKey :: I :: Y ::  :: Secret Key
 * @param {Boolean} isUpper :: I :: Y ::  :: 대문자로 변환여부
 * @return {String}
 * @author 성일호
 * @useMobile use
 * @example  
	   var dStr = ngmf.getSHA1Digest("1234567");
 */
ngmf.getSHA1Digest = function(inStr, scKey, isUpper) {
	var rtnVal = "";
	try {
		if (!inStr) throw Error(rtnVal);
		if (GLD["CryptoJS"]) {
			var C =  GLD["CryptoJS"];
			if (typeof scKey != "undefined" && scKey) rtnVal = C.HmacSHA1(inStr,scKey).toString(); 
			else rtnVal = C.SHA1(inStr).toString();			
			if (typeof isUpper != "undefined" && isUpper) rtnVal = rtnVal.toUpperCase();
		} else {
			rtnVal = inStr;
		}
	} catch (e) { 
		ngmf._error("[ngmf.promise.getSHA1Digest] Exception :: ", e);
	} 
	return rtnVal;
};
/**
 * SHA1 암호화 API(Promise)
 * @date 2016.06.07
 * @memberOf ngmf
 * @param {String} inStr :: I :: N ::  :: 암호화할 문자열
 * @param {String} scKey :: I :: Y ::  :: Secret Key
 * @param {Boolean} isUpper :: I :: Y ::  :: 대문자로 변환여부
 * @return {String}
 * @author 성일호
 * @useMobile use
 * @example  
	   ngmf.promise.getSHA1Digest("1234567")
		.then( function(dStr) {
			ngmf._debug(dStr);
		});
 */
ngmf.promise.getSHA1Digest = function(inStr, scKey, isUpper) {
	return new Promise(function(resolve, reject) {
		var rtnVal = "";
		try {
			if (!inStr) throw Error(rtnVal);
			
			if (GLD["CryptoJS"]) {
				var C =  GLD["CryptoJS"];
				if (typeof scKey != "undefined" && scKey) rtnVal = C.HmacSHA1(inStr,scKey).toString(); 
				else rtnVal = C.SHA1(inStr).toString();			
				if (typeof isUpper != "undefined" && isUpper) rtnVal = rtnVal.toUpperCase();
				resolve(rtnVal);
			} else {
				WebSquare.util.js("/SWING/lib/js/hmac-sha1.js", function() {
					var C =  CryptoJS;
					if (typeof scKey != "undefined" && scKey) rtnVal = C.HmacSHA1(inStr,scKey).toString(); 
					else rtnVal = C.SHA1(inStr).toString();			
					if (typeof isUpper != "undefined" && isUpper) rtnVal = rtnVal.toUpperCase();
					resolve(rtnVal);
			 	}); 
			}
 
		} catch (e) { 
			ngmf._error("[ngmf.promise.getSHA1Digest] Exception :: ", e);
			resolve (inStr);
		} 
	}); 
};