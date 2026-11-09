/**
 * @target
 */

/**
 *  @type ngmf
 */

/* 공통모듈 정리 -------------------------------------------------------------------------------------------------------------- */
/* 1. Gloval 변수, 객체 ------------------------------------------------------------------------------------------------------- */
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


/* 2. 공통 함수  -------------------------------------------------------------------------------------------------------------- */

/* 2-1 Date업무 --------------------------------------------------------------------------------------------------------------- */

/**
 * 현재 일자를 구하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @return {String} 현재일자의 yyyyMMdd의 8자리 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.today();  // return "20160216"
 * @exampleAsIs Today() // return "20160216"
 */
ngmf.today = function () {
	try{
		var date = new Date();
		var yyyy = date.getFullYear();
		var MM = date.getMonth()+1;
		var dd = date.getDate();
		if ((MM + "").length < 2) {
			MM = "0" + MM;
		}
		if ((dd + "").length < 2) {
			dd = "0" + dd;
		}
		return yyyy + "" + MM + "" + dd;
	} catch (e) {
		ngmf._error("[ngmf.today] Exception :: ", e);
	}
};

/**
 * System으로 부터 현재 설정된 시각을 구하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} format :: I :: Y ::  :: date 형식설정 값.(yyyyMMdd or yyyyMMddHHmmss) [default:yyyyMMddHHmmss]
 * @return {String} format형식에 맞는 현재 date 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.getDate();  // return "20160216105757"
 * @example ngmf.getDate("yyyy-MM-dd"); // return "20160216"
 * @exampleAsIs GetDate();  // return "20160216105947"
 */
ngmf.getDate = function (format) {
	try{
		var dateFormat = format || "yyyyMMddHHmmss";
		var date = WebSquare.date.getCurrentServerDate(dateFormat);
		return date;
	} catch (e) {
		ngmf._error("[ngmf.getDate] Exception :: ", e);
	}
};

/**
 * 입력된 날짜로 부터 요일을 구하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} pYmd   :: I :: N ::  :: date 형식의 날짜 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {String} format :: I :: Y ::  :: 요일 형식 [일 : 0, 월 : 1, 화 :2, ... 토 : 6] (true : 한글 or false : 숫자 ) [default : true]
 * @return {Number} 지정된 offset만큼의 개월이 더해진 입력 날짜.
 * @author 이동규
 * @useMobile use
 * @update 2016.04.29 이동규 함수 리팩토닝[전역변수 처리수정.]
 * @example ngmf.getDay(ngmf.today(););  // return "2"
 * @example ngmf.getDay(ngmf.today();, true);  // return "화요일"
 * @exampleAsIs GetDay(Today()); // return "2"
 */
ngmf.getDay = function (pYmd, format) {
	try{
		var date = -1;
		if (pYmd.length > 8) {
			pYmd = pYmd.substring(0,8);
		}

		if (typeof format !== "undefined" && format !== "" && WebSquare.util.getBoolean(format)) {
			date = WebSquare.date.getDay(pYmd);
		} else {
			var idx = WebSquare.date._getDay(pYmd, true);
			switch(idx) {
				case 0 :  	date = 6; break;
				case 1 :	date = 0; break;
				case 2 : 	date = 1; break;
				case 3 :	date = 2; break;
				case 4 :	date = 3; break;
				case 5 :	date = 4; break;
				case 6 :	date = 5; break;
				default :	date = -1;
			}
		}

		return date;
	} catch (e) {
		ngmf._error("[ngmf.today] Exception :: ", e);
	}
};

/**
 * 입력된 날짜에 offset 으로 지정된 만큼의날짜를 더하는 API입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} pYmd   :: I :: N ::  :: date 형식의 날짜
 * @param {Number} offset :: I :: Y :: 1 :: 더할 날짜 수.
 * @param {String} format :: I :: Y ::  :: 반환할 날짜 포멧 (yyyyMMdd or yyyyMMddHHmmss)
 * @return {String} 지정된 offset만큼의 날짜가 더해진 입력 날짜.
 * @author 이동규
 * @useMobile use
 * @update 2016.04.29 이동규 함수 리팩토닝[전역 변수 선언 및 잘못된 형체크 수정.]
 * @update 2016.06.14 이동규 addDate의 offset이 Number 값이 아닌 경우 "1" 부분을 "0" 으로 수정.
 * @example ngmf.addDateSimple("20160216", 10);  // return "20160226"
 * @example ngmf.addDateSimple(ngmf.getDate(), "", "yyyyMMdd"); // return "20160217"
 * @exampleAsIs alert(AddDate("20160216", "10")); // return "20160226"
 * @exampleAsIs alert(AddDate(getDate())); // return "20160217"
 */
ngmf.addDateSimple = function ( pYmd, offset, format) {
	try{
		var date = "";
		var isDate =  ngmf.isDate(pYmd);
		var addNum = Number(offset);
		if (!isDate) return;
		if ( typeof offset == "undefined" || isNaN(addNum)) {
			addNum = 0;
		}

		var cYmd = pYmd.substring(0, 8);
		var dTime = (pYmd+"").substring(8);

		if (isDate) {
			date = WebSquare.date.dateAdd( cYmd , addNum );
		}

		if (typeof format != "undefined" && format != "yyyyMMdd") {
			date = date + "" + dTime;
		}

		return date;
	} catch (e) {
		ngmf._error("[ngmf.addDateSimple] Exception :: ", e);
	}
};

/**
 * 입력된 날짜에 offset 으로 지정된 만큼의 달을 더하는 API입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} pYmd   :: I :: N ::   :: date 형식의 날짜 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {Number} offset :: I :: Y :: 1 :: 더할 개월 수.
 * @return {String} 지정된 offset만큼의 개월이 더해진 입력 날짜.
 * @author 이동규
 * @useMobile use
 * @upldate 이동규 20160401 
 *         API 오동작 수정 (일수가 마지막일수 일때 월에 따른 일수 재계산)
 * @upldate 이동규 20160616 add 값이 0 일 경우 정상적으로 처리 못한 부분 처리.[UI-2213]
 * @example ngmf.addMonth("20160216");  // return "20160316"
 * @example ngmf.addMonth("20160216", 10);  // return "20161216"
 * @exampleAsIs AddMonth("20160216");  // return "20160316"
 * @exampleAsIs AddMonth("20160216", 10);  // return "20161216"
 */
ngmf.addMonth = function ( pYmd, offset ) {
	try{
		var date = "";
		var isDate =  ngmf.isDate(pYmd);
		if (!isDate) {
			return;
		}
		if ( typeof offset == "undefined" || isNaN(offset)) {
			offset = 0;
		}

		var dY = (pYmd+"").substring(0, 4);
		var dM = (pYmd+"").substring(4, 6);
		var dD = (pYmd+"").substring(6, 8);
		var dTime = (pYmd+"").substring(8);

		dM = (dM * 1) + (offset * 1);

		if (dM > 0 ) {
			dY = (dY*1) + Math.floor(dM / 12);
			dM = dM % 12;
		} else {
			dY = (dY*1) - Math.floor((dM * -1 + 12) / 12);
			dM = dM % 12 + 12;
		}

		if (Number(dD) >= 30) {
			var chkMonth1 = [2];
			var chkMonth2 = [4,6,9,11];

			if (chkMonth1.indexOf(dM) > -1) {
				if(ngmf.isLeafYear(dY+"01"+"01")) {
					dD = "29";
				} else {
					dD = "28";
				}
			} else if (chkMonth2.indexOf(dM) > -1) {
				if (Number(dD) > 30) {
					dD = "30";
				}
			}
		}
		var cDate = new Date(dY, dM-1, dD);
		var cYear = cDate.getFullYear();
		var cMonth = cDate.getMonth() + 1;

		if ((cMonth + "").length < 2) {
			cMonth = "0" + cMonth;
		}

		var cDay = cDate.getDate();
		if ((cDay + "") .length < 2) {
			cDay = "0" + cDay;
		}

		date = cYear + "" + cMonth + "" + cDay + "" + dTime;
		return date;
	} catch (e) {
		ngmf._error("[ngmf.addMonth] Exception :: ", e);
	}
};

/**
 * 입력된 날짜에 offset 으로 지정된 만큼의 년 을 더하는 API입니다.
 * @date 2015-10-22
 * @memberOf ngmf
 * @param {String} pYmd   :: I :: N ::   :: date 형식의 날짜 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {Number} offset :: I :: Y :: 1 :: 더할 년 수.
 * @return {String} 지정된 offset만큼의 년 이 더해진 입력 날짜.
 * @author 이동규
 * @upldate 이동규 20160616 add 값이 0 일 경우 정상적으로 처리 못한 부분 처리.[UI-2213]
 * @useMobile use
 * @example ngmf.addYear("20160216");  // return "20170216"
 * @example ngmf.addYear("20160216", 10);  // return "20260216"
 * @exampleAsIs 신규
 */
ngmf.addYear = function (pYmd, offset) {
	try{
		var date = "";
		var isDate =  ngmf.isDate(pYmd);
		if (!isDate) {
			return;
		}
		if ( typeof offset == "undefined" || isNaN(offset)) {
			offset = 0;
		}

		var dY = (pYmd+"").substring(0, 4);
		var dM = (pYmd+"").substring(4, 6);
		var dD = (pYmd+"").substring(6, 8);
		var dTime = (pYmd+"").substring(8);

		dY = (dY * 1) + (offset * 1);
		var cDate = new Date(dY, dM-1, dD);
		var cYear = cDate.getFullYear();
		var cMonth = cDate.getMonth() + 1;

		if ((cMonth + "").length < 2) {
			cMonth = "0" + cMonth;
		}

		var cDay = cDate.getDate();
		if ((cDay + "") .length < 2) {
			cDay = "0" + cDay;
		}

		date = cYear + "" + cMonth + "" + cDay + "" + dTime;
		return date;
	} catch (e) {
		ngmf._error("[ngmf.addYear] Exception :: ", e);
	}
};

/**
 * yyyyMMdd 일자에서 년/ 월/ 일을 자유롭게 더하고 뺀 결과를 문자열로 반환합니다.
 * @date 2015-10-22
 * @memberOf ngmf
 * @param {String} pYmd  :: I :: N ::  :: date 형식의 날짜 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {Number} pYmd  :: I :: Y ::  :: 더할 년 수.
 * @param {Number} month :: I :: Y ::  :: 더할 월 수.
 * @param {Number} day   :: I :: Y ::  :: 더할 일 수.
 * @return {String} 지정된 offset만큼의 년 이 더해진 입력 날짜.
 * @author 이동규
 * @useMobile use
 * @update 2016.04.29 이동규 함수 리팩토닝[코딩 분기 수정.]
 * @update 2016.09.01 이동규 함수 new Date 객체 선언 수정.
 * @example ngmf.addYmd("20160216", 2); // return "20180216"
 * @example ngmf.addYmd("20160216", 0, 2);  // return "20160416"
 * @example ngmf.addYmd("20160216", 0, 2, 2);  // return "20160218"
 * @example ngmf.addYmd("20160216", 2, 2, 2);  // return "20180418"
 * @exampleAsIs 신규
 */
ngmf.addYmd = function (pYmd, year, month, day) {
	try{
		var date = "";
		var isDate = ngmf.isDate(pYmd);
		if (!isDate) {
			return;
		}

		if ( typeof offset == "undefined" || offset == "") {
			offset = 1;
		}

		var dY = (pYmd+"").substring(0, 4);
		var dM = (pYmd+"").substring(4, 6);
		var dD = (pYmd+"").substring(6, 8);
		var dTime = (pYmd+"").substring(8);

		var sz_ymd;
		year = Number(year);
		month = Number(month);
		day = Number(day);
		if(isNaN(year)) year = 0;
		if(isNaN(month)) month = 0;
		if(isNaN(day)) day = 0;

		var cDate = new Date(dY, dM-1, dD);
		cDate.setFullYear((dY*1) + year);
		cDate.setMonth((dM*1) + month-1);
		cDate.setDate((dD*1) + day);

		sz_ymd = "" + cDate.getFullYear();


		if (((cDate.getMonth() +1) + "").length < 2) {
			sz_ymd += "0" + (cDate.getMonth() + 1);
		} else {
			sz_ymd += (cDate.getMonth() +1);
		}

		if ((cDate.getDate() + "") .length < 2) {
			sz_ymd += "0" + cDate.getDate();
		} else {
			sz_ymd += cDate.getDate();
		}

		date = sz_ymd + dTime;
		return date;
	} catch (e) {
		ngmf._error("[ngmf.addYmd] Exception :: ", e);
	}
};

/**
 * 주어진 Argument를 date 형의 값으로 변환하여 구하는 API입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Number} nYear   :: I :: N ::   :: 4자리 양력 년도.
 * @param {Number} nMonth  :: I :: N ::   :: 2자리 양력 달.
 * @param {Number} nDay    :: I :: N ::   :: 2자리 양력 일.
 * @param {Number} nHour   :: I :: Y :: 0 :: 24시간제 시각.
 * @param {Number} nMinute :: I :: Y :: 0 :: 24시간제 분.
 * @param {Number} nSecond :: I :: Y :: 0 :: 24시간제 초.
 * @param {String} strData :: I :: Y ::   :: 4에서 14자리로 된 yyyyMMddhhmmss [default Value = null]
 * @return {Variant} Date형식의 String 으로 변환된 DateTime 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.dateTime("2016", "02", "16"); // return "20160216000000"
 * @exampleAsIs DateTime(2016, 02, 16); // return "20160216";
 */
ngmf.dateTime = function() {
	try{
		var len = arguments.length;
		var isDate = true;
		if (len > 1) {
		    var year = "";
		    var month = "";
		    var day = "";
		    var hour = "";
		    var minute = "";
		    var second = "";
		    if ( len > 3) {
	            year = arguments[0] + "";
	            month =  arguments[1] + "";
	            day = arguments[2] + "";
	            hour = typeof arguments[3] != "undefined" ? arguments[3] + "" : "0";
	            minute = typeof arguments[4] != "undefined" ? arguments[4] + "" : "0";
	            second = typeof arguments[5] != "undefined" ? arguments[5] + "" : "0";
		    } else {
	            year = arguments[0] + "";
	            month = arguments[1] + "";
	            day = arguments[2] + "";
	            hour = "0";
	            minute = "0";
	            second = "0";
		    }

		    if (month.length < 2)
	    		month = "0" + month;
			if (day.length < 2)
				day = "0" + day;
		   	if (hour.length < 2)
		   		hour = "0" + hour;
			if (minute.length < 2)
				minute = "0" + minute;
			if (second.length < 2)
				second = "0" + second;

			date = year + month + day + hour + minute + second;
		   	isDate = ngmf.isDate(date);
		   	if (len < 4) {
		   		date = year + month + day;
		   	}
		} else {
		    if (typeof arguments[0] == "string") {
		    	date = arguments[0];
	    		var ymd = false;
	    		var yy = date.substring(0, 4);
	    		var MM = date.substring(4, 6);
	    		var dd = date.substring(6, 8);
	    		var hh = date.substring(8, 10);
	    		var mm = date.substring(10, 12);
	    		var ss = date.substring(12);
	    		
	    		if (hh == "" && mm == "" && ss =="") {
	    			ymd = true;
	    		}

	    		if (MM.length < 2)
	    			MM = "01";
	    		if (dd.length < 2)
	    			dd = "01";
	    		if (hh.length < 2)
	    			hh = "00";
	    		if (mm.length < 2)
	    			mm = "00";
	    		if (ss.length < 2)
	    			ss = "00";
	    		date = yy + MM + dd + hh + mm + ss;
		    	isDate = ngmf.isDate(date);
		    	if (ymd) {
		    		date = yy + MM + dd;
		    	}
		    } else {

		    }
		}

		if(!isDate) {
			date = "00000101";
		}
		return date;
	} catch (e) {
		ngmf._error("[ngmf.dateTime] Exception :: ", e);
	}
};

/**
 * 현재 연도 + 달 + 날짜 + 시간 + 분 + 초 + 밀리언초
 * @date 2014. 12. 10.
 * @memberOf ngmf
 * @return {String} 현재 연도 + 달 + 날짜 + 시간 + 분 + 초 + 밀리언초
 * @useMobile use
 * @update 2015.05.04 이동규 서버시간 서버통신 처리 삭제.
 * @example ngmf.extGetHDTime(); // return "20160217111819987"
 * @exampleAsIs 신규
 */
ngmf.extGetHDTime = function() {
	try{
		var date = new Date();
		var ymd = ""; 
		if ( GLV["severTime"])	 ymd = GLV.severTime;
		else ymd = date.format("yyyyMMdd");
		
		var hour = date.getHours().zf(2);
		var minute = date.getMinutes().zf(2);
		var second = date.getSeconds().zf(2);
		var mSecond = date.getMilliseconds().zf(3);

		return ymd + hour + minute + second + mSecond;
	} catch (e) {
		ngmf._error("[ngmf.extGetHDTime] Exception :: ", e);
	}
};

/**
 * fromDate, toDate 를 입력받아 fromDate 가 toDate 보다 큰지를 체크하여 해당 리턴값을 반환합니다.
 * (date형식은 yyyyMMdd or yyyyMMddHHmmss 입니다.)
 * @date 2015-10-22
 * @memberOf ngmf
 * @param {String} fromDate :: I :: N ::       :: 시작일자
 * @param {String} toDate   :: I :: N ::       :: 종료일자
 * @param {Boolean} type    :: I :: Y :: false :: 리턴 타입설정 입니다.(true : 두 날짜중 더 큰 날짜를 받습니다, false : 비교된 체크 값을 받습니다.)
 * @return {String} 9 : 비교 조건 부족, 0 : 오류 , 1 : 정상
 * @author 이동규
 * @useMobile use
 * @example ngmf.compareDate("20101012", "20151010");  // return 1
 * @example	ngmf.compareDate("20101012", "20151010", true);  // return "20151010"
 * @exampleAsIs 신규
 */
ngmf.compareDate = function (fromDate, toDate, type) {
	try{
		var flag = "9";

		if (!ngmf.isDate(fromDate) || !ngmf.isDate(toDate)) {
			return ;
		}
		if ( fromDate != "" && toDate != "") {
			if (fromDate > toDate)
				flag = 0;
			else
				flag = 1;
		}

		if (typeof type !== "undefined" && WebSquare.util.getBoolean(type)) {
			var date = "";
			if (flag == 0) {
				date = fromDate;
			} else if (flag == 1) {
				date = toDate;
			}
			return date;
		} else {
			return flag;
		}
	} catch (e) {
		ngmf._error("[ngmf.compareDate] Exception :: ", e);
	}
};

/**
 * fromDate, toDate 를 입력받아 두 날짜의 차이를 반환합니다.
 * (date형식은 yyyyMMdd or yyyyMMddHHmmss 입니다.)
 * @date 2015-10-22
 * @memberOf ngmf
 * @param {String} fromDate :: I :: N ::  :: 시작일자
 * @param {String} toDate   :: I :: N ::  :: 종료일자
 * @return {Number} 종료일자에서 시작일자의 날짜 차이 수.
 * @author 이동규
 * @useMobile use
 * @example ngmf.diffDate("20101012", "20151010");  // return 1824
 * @exampleAsIs 신규
 */
ngmf.diffDate = function (fromDate, toDate) {
	try{
		if (!ngmf.isDate(fromDate) || !ngmf.isDate(toDate)) {
			return ;
		}
		var diffDate = WebSquare.date.dateDiff(fromDate, toDate);
		return diffDate;
	} catch (e) {
		ngmf._error("[ngmf.diffDate] Exception :: ", e);
	}
};

/**
 * 입력받은 fromDate 월로부터 입력 toDate 월 까지 개월 수를 반환합니다.
 * (date형식은 yyyyMMdd or yyyyMMddHHmmss 입니다.)
 * @date 2015-10-22
 * @memberOf ngmf
 * @param {String} fromDate :: I :: N ::  :: 시작월
 * @param {String} toDate   :: I :: N ::  :: 종료월
 * @return {Number} 종료일자에서 시작일자의 개월 수.
 * @author 이동규
 * @useMobile use
 * @example ngmf.getMonthTerm("20101012", "20151010");  // return 1824
 * @exampleAsIs 신규
 */
ngmf.getMonthTerm = function (fromDate, toDate) {
	try{
		var iMonth = 0;
		var iYear = 0;
		var rMonth = "";

		if (!ngmf.isDate(fromDate) || !ngmf.isDate(toDate)) {
			return ;
		}

		if (parseInt(fromDate) <= parseInt(toDate)) {
			iYear = parseInt(toDate.substr(0, 4)) - parseInt(fromDate.substr(0,4));
			iMonth = parseInt(toDate.substr(4, 2), 10) - parseInt(fromDate.substr(4,2), 10);
			rMonth = (12 * iYear) + iMonth;
		}

		return rMonth;
	} catch (e) {
		ngmf._error("[ngmf.getMonthTerm] Exception :: ", e);
	}
};

/**
 * 현재 시각일자를 Number 형태로 구하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @return {Number} 1970년 1월 1일 자정 부터 현재까지의 시간을 초로 나타낸 숫자.
 * @author 이동규
 * @useMobile use
 * @example ngmf.time();  // return 1455676636
 * @exampleAsIs Time(); // return 1455676660
 */
ngmf.time = function () {
	try{
		var time = new Date();
		return Math.floor((time.getTime()/1000));
	} catch (e) {
		ngmf._error("[ngmf.time] Exception :: ", e);
	}
};

/**
 * 현재 시각일자를 Millisecond 단위까지 Integer 형태로 구하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @return {Number} 1970년 1월 1일 자정 부터 현재까지의 시간을 1/1000초 단위로 나타낸 숫자.
 * @author 이동규
 * @useMobile use
 * @example ngmf.timeM();  // return 1455676703785
 * @exampleAsIs TimeM(); // return 1455676700777
 */
ngmf.timeM = function () {
	try{
		var time = new Date();
		return time.getTime();
	} catch (e) {
		ngmf._error("[ngmf.timeM] Exception :: ", e);
	}
};

/**
 * 양력으로된 날자를 음력으로 바꾸는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} date :: I :: N ::  :: 양력으로된 8자리 날짜.
 * @return {String} 음력으로 변환된 일자.
 * @author 이동규
 * @useMobile use
 * @example ngmf.solar2Lunar(ngmf.today());  // 결과값 : "20160108"
 * @exampleAsIs Solar2Lunar(Today()); // 결과값 : "20160109"
 */
ngmf.solar2Lunar = function (_date) {
	try{
		var result = "";
		var date = _date || (new Date()).format("yyyymmdd");
		date = date.replaceAll("-","").replaceAll(".","").trim();
		var isDate = false;
		var sData = "";
		if (date.length == 8) {
			sData = date+"000000";
			isDate = ngmf.isDate(sData);
		} else if (date.length == 14) {
			sData = date;
			isDate = ngmf.isDate(sData);
		}

		if (isDate) {
			result = WebSquare.date.toLunar(sData);
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.solar2Lunar] Exception :: ", e);
	}
};

/* 2-2 Str업무 ---------------------------------------------------------------------------------------------------------------- */

/**
 * 문자열의 index번째의 한 글자를 얻어오는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @useMobile use
 * @param {String/Number} str   :: I :: N ::  :: String Type의 문자열.
 * @param {Number} index :: I :: N ::  :: index 값.
 * @return {String} char : 반환된 문자.
 * @author 이동규
 * @example ngmf.charAt("20151012" , 0);  // return "2"
 * @exampleAsIs CharAt("20151012" , 0); // return "2"
 */
ngmf.charAt = function (str, index) {
	try{
		var charAtValue = "";
		if (typeof str == "string") {
			charAtValue = str.charAt(index);
		} else if (typeof str == "number") {
			charAtValue = (str + "").charAt(index);
		}
		return charAtValue;
	} catch (e) {
		ngmf._error("[ngmf.charAt] Exception :: ", e);
	}
};

/**
 * 문장의 첫글자의 char code 값을 return 하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: String Type의 문자열.
 * @return {Number} char Code
 * @author 이동규
 * @useMobile use
 * @example ngmf.asc("20151012");  // return 50
 * @exampleAsIs Asc("20151012"); // return 50
 */
ngmf.asc = function ( str ) {
	try{
		str = str + "";
		return str.charCodeAt(0);
	} catch (e) {
		ngmf._error("[ngmf.asc] Exception :: ", e);
	}
};

/**
 * 숫자로 입력된 Char Code 값을 문자로 변환하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Number} keyCode :: I :: N ::  :: Unicode로 Encoding된 char Code 값
 * @return {String} String 형으로 표현된 Char Code 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.chr(98);  // return "b"
 * @exampleAsIs Chr(98); // return "b"
 */
ngmf.chr = function(keyCode){
	try{
		if(Number(keyCode) == 13) {
			return "\n";
		} else {
			return String.fromCharCode(keyCode);
		}
	} catch (e) {
		ngmf._error("[ngmf.chr] Exception :: ", e);
	}
};

/**
 * 첫번째 문자를 소문자로 변환해서 반환한다.
 * @date 2015. 11. 26.
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 문자열
 * @returns {String} 치환된 문자열
 * @author 이동규
 * @useMobile use
 * @example ngmf.firstLowerCase("Ab");  // return "ab"
 * @exampleAsIs 신규
 */
ngmf.firstLowerCase = function(str) {
	try{
		return str.substring(0, 1).toLowerCase() + str.substring(1);
	} catch (e) {
		ngmf._error("[ngmf.firstLowerCase] Exception :: ", e);
	}
};

/**
 * 문자열에 있는 모든 영어를 대문자로 바꾸는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 영문자를 모두 대문자로 바꿀 문자열.
 * @return {String} 영어 대자와 다른 문자로 구성된 문자열
 * @author 이동규
 * @useMobile use
 * @example ngmf.toUpper("abc");  // return "ABC"
 * @exampleAsIs ToUpper("abc"); // return "ABC"
 */
ngmf.toUpper = function (str) {
	try{
		return str.toUpperCase();
	} catch (e) {
		ngmf._error("[ngmf.toUpper] Exception :: ", e);
	}
};

/**
 * 문자열에 있는 모든 영어를 소문자로 바꾸는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 영문자를 모두 소문자로 바꿀 문자열.
 * @return {String} 영어 소문자와 다른 문자로 구성된 문자열
 * @author 이동규
 * @useMobile use
 * @example ngmf.toLower("ABC");  // return "abc"
 * @exampleAsIs ToLower("ABC"); // return "abc"
 */
ngmf.toLower = function (str) {
	try{
		return str.toLowerCase();
	} catch (e) {
		ngmf._error("[ngmf.toLower] Exception :: ", e);
	}
};

/**
 * 입력된 문자열의 좌우측 공백을 제거한 문자열을 구하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 좌우측 공백문자를 제거하려는 문자열
 * @return {String} 입력된 문자열에서 좌우측 공백이 제거된 문자열.
 * @sampleLink scm_svcCallAutoSearch.
 * @author 이동규
 * @useMobile use
 * @example ngmf.trim("   a   ");  // return "a"
 * @exampleAsIs Trim("   a   "); // return "a"
 */
ngmf.trim = function(str) {
	try{
		if (typeof str == "undefined" || str == null) {
			str ="";
		}
		if (typeof str !== "string") {
			str = str + "";
		}
		return str.trim();
	} catch (e) {
		ngmf._error("[ngmf.trim] Exception :: ", e);
	}
};

/**
 * 입력된 문자열의 오른쪽 공백을 제거하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 오른쪽 공백을 제거할 문자열.
 * @return {String} 입력된 문자열에서 오른쪽의 공백문자가 제거된 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.rTrim("  20151012    ");  // return "  20151012"
 * @exampleAsIs RTrim("   20151012   "); // return "  20151012"
 */
ngmf.rTrim = function(str) {
	try{
    	return str.replace(/\s+$/, "");
	} catch (e) {
		ngmf._error("[ngmf.rTrim] Exception :: ", e);
	}
};

/**
 * 입력된 문자열의 왼쪽 공백을 제거하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 입력 문자열.
 * @return {String} 왼쪽공백이 제거된 입력 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.lTrim("    20151012");  // return "20151012"
 * @exampleAsIs LTrim("   20151012   "); // return "20151012   "
 */
ngmf.lTrim = function (str) {
	try{
		return str.replace(/^\s+/, "");
	} catch (e) {
		ngmf._error("[ngmf.lTrim] Exception :: ", e);
	}
};

/**
 * 입력된 문자열의 양쪽에 쌍따옴표를 붙여 Return 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String/Number} str :: I :: N ::  :: 쌍 따옴표를 붙일 문자열.
 * @return {String} 쌍따옴표가 붙여진 문자열.
 * @sampleLink scm_popupMain
 * @author 이동규
 * @useMobile use
 * @example ngmf.quote("20151012");  // return ""20151012""
 * @exampleAsIs Quote("20151012"); // return ""20151012""
 */
ngmf.quote = function (str) {
	try{
		if (typeof str == "string" || typeof str == "number") {
			return "\"" + str + "\"";
		} else {
			return "\"\"";
		}
	} catch (e) {
		ngmf._error("[ngmf.quote] Exception :: ", e);
	}
};

/**
 * 입력된 문자열의 양쪽의 따옴표를 제거하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 쌍으로 존재하는 따옴표를 제거할 문자열.
 * @return {String} 따옴표가 제거된 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.unQuote("\"20151012\"");  // return "20151012"
 * @exampleAsIs UnQuote("\"20151012\""); // return "20151012"
 */
ngmf.unQuote = function (str) {
	try{
		if (typeof str == "string") {
			var pattern = /\"/g;
			return str.replace(pattern, "");
		}
	} catch (e) {
		ngmf._error("[ngmf.unQuote] Exception :: ", e);
	}
};

/**
 * 문자열을 지정한 형태로 Parsing 한 후 배열로 만드는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str           :: I :: N ::       :: Parsing 해야될 문자열.
 * @param {String} delimiter     :: I :: N ::       :: Parsing 할 때 분리의 기준이 되는 문자들의 문자열.
 * @param {Boolean} bNotMultiDim :: I :: Y :: true  :: strDelimiter 에서 복수개의 Delimiter 를 인식할지 여부. TRUE 면 strDelimiter에서 첫번째 글자만을 Delimiter로 인식합니다.
 * @param {Boolean} bCheckQuote  :: I :: Y :: true  :: Quotation 처리를 할지 여부. FALSE 가 되면 bDelQuote는 무시됩니다.
 * @param {Boolean} bDelQuoute   :: I :: Y :: true  :: 쌍따옴표나, 단따옴표를 Parsing 한 후 지울지 여부.
 * @param {String} strEscape     :: I :: Y ::       :: 쌍따옴표 등에서 사용될 예외문자. 문자열의 처음 한글자만을 사용합니다.
 * @param {String} webstyle      :: I :: Y :: false :: WebScript에 사용되는것처럼 strDelimiter의 문자열 전체를 하나의 Delimiter로 적용하여 Split 처리하게 합니다.
 * @return {Array}  delimiter로 분리된 String 배열 
 * @author 이동규
 * @update 2016.07.27 마이플랫폼 Split 기능 복원
 * @useMobile use
 * @example ngmf.split("000_111_222");  // return ["000_111_222"]
 * @example ngmf.split("000_111_222", "_");  // return ["000", "111", "222"]
 * @exampleAsIs split("000_111_222"); // return ["000_111_222"]
 * @exampleAsIs split("000_111_222", "_");  // return ["000", "111", "222"]
 */
ngmf.split = function () {
	var resultAll = new Array();
	try{
		if (arguments.length < 2) {
			resultAll.push(arguments[0]);
			return resultAll;
		}
		if (arguments.length == 2) {
			return arguments[0].split(arguments[1]);
		} 
		var result = null;
		var instr = arguments[0];
		var delimiter = arguments[1];
		var bNotMultiDim = true;
		var bCheckQuote = true;
		var bDelQuoute = true;
		var strEscape =  "";
		var webstyle = false; 
		var strObj = {n:[], q:[]};
		var str = "";

		if (arguments.length > 2) {
			for (var i = 2; i < arguments.length ; i++){
				if(typeof arguments[i] === "string" && ( arguments[i].toLowerCase().trim())=="webstyle") {
					webstyle = true;
				} else {
					if (i==2) bNotMultiDim = WebSquare.util.getBoolean(arguments[i]);
					else if (i==3) bCheckQuote = WebSquare.util.getBoolean(arguments[i]);
					else if (i==4) bDelQuoute = WebSquare.util.getBoolean(arguments[i]);
					else if (i==5) strEscape = arguments[i].substr(0,1);
				}
			}	
		}
		if (strEscape) {
			instr = instr.replaceAll(strEscape,"");
		}
		if (bCheckQuote) {
			strObj = ngmf._quoteSplit(instr,bDelQuoute);
			resultAll = resultAll.concat(strObj["q"]);
		} else {
			strObj["n"]= instr ;
		}
		str = strObj["n"];
		result = new Array();
		if ( webstyle ) {
			result = str.split(delimiter);
			if (result && result.length > 0) {
				 return result;
			} else {
				result.push(instr);
				return result;
			}
		} 
		
		if (bNotMultiDim) {
			delimiter = delimiter.substr(0,1);
			result = str.split(delimiter);
		} else {
			var parseDelim = "";
			var parseStr = "";  
			for (var i =0 ; i < delimiter.length; i++ ) {
				parseDelim = delimiter.substr(i,1);
				if (i ==0) {
					result = str.split(parseDelim);
				} else {
					for (var j = result.length -1; j > -1 ; j-- ) {
						if (result[j].indexOf(parseDelim) > -1 ) {
							parseStr = result[j];
							delete result.splice(j,1);
							result = result.concat(parseStr.split(parseDelim));
						}
					}
				}
			}
		}

		if (result && result.length > 0) {
			for (var k =0;  k < result.length ; k++) {
				if (k==0) resultAll.push(result[k]);
				else  if (result[k] && result[k].trim())  resultAll.push(result[k]);
			}
		}
		if (resultAll.length == 0) resultAll.push(instr);
	} catch (e) {
		ngmf._error("[ngmf.split] Exception :: ", e);
	}
	return resultAll; 
};

ngmf._quoteSplit = function (strObj, bDelqt) {
	var result = {};
	try{
		var delim = "";
		var nonQtStr = strObj;
		var resultQute = new Array();
		var splitArr = null;
		if (strObj.indexOf("\"") > -1) {
			delim = "\"";
			splitArr = strObj.split(delim);
			for (var i = 0; i < splitArr.length; i++) {
				if(splitArr[i] && i%2 == 0 && splitArr[i].trim()) {
					nonQtStr += splitArr[i]; 
				} else if (splitArr[i].trim()) {
					if (bDelqt) {
						resultQute.push( splitArr[i].trim());
					} else {
						resultQute.push(delim + splitArr[i].trim() +delim);
					}
				}
			} 
		}
		if (nonQtStr.indexOf("'") > -1) {
			delim = "'";
			splitArr = nonQtStr.split(delim);
			nonQtStr = "";
			for (var i = 0; i < splitArr.length; i++) {
				if(splitArr[i] && i%2 == 0 && splitArr[i].trim()) {
					nonQtStr += splitArr[i]; 
				} else if (splitArr[i].trim()) {
					if (bDelqt) {
						resultQute.push( splitArr[i].trim());
					} else {
						resultQute.push(delim + splitArr[i].trim() +delim);
					}
				}
			}
		}	
		
		result["n"] = nonQtStr;
		result["q"] = resultQute;
	} catch (e) {
		ngmf._error("[ngmf._quoteSplit] Exception :: ", e);
	}
	return result; 
};


/**
 * 입력된 문자열에서 가운데 부분을 주어진 길이만큼 Return 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} source :: I :: N ::    :: 가운데 부문을 얻어올 원본 문자열.
 * @param {Number} start  :: I :: Y ::    :: 얻어올 첫 글자의 Index.
 * @param {Number} length :: I :: Y :: -1 :: 얻어올 글자수.
 * @return {String} 가운데 부분이 nSize 길이만큼 얻어진 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.mid("abcde");  // return "abcde"
 * @example ngmf.mid("abcde", 2);  // return "cde"
 * @example ngmf.mid("abcde", 2, 2);  // return "cd"
 * @exampleAsIs Mid("abcde");  // return "abcde"
 * @exampleAsIs Mid("abcde", "2");  // return "cde"
 * @exampleAsIs Mid("abcde", "2", "2");  // return "cd"
 */
ngmf.mid = function(source, start, length) {
	try{
    	return ngmf.subStr(source, start, length);
	} catch (e) {
		ngmf._error("[ngmf.mid] Exception :: ", e);
	}
};

/**
 * 입력된 문자열에서 가운데 부분을 주어진 길이만큼 Return 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str    :: I :: N ::    :: 가운데 부문을 얻어올 원본 문자열.
 * @param {Number} nIndex :: I :: Y ::    :: 얻어올 첫 글자의 Index.
 * @param {Number} nSize  :: I :: Y :: -1 :: 얻어올 글자수.
 * @return {String} 지정된 offset만큼의 개월이 더해진 입력 날짜.
 * @author 이동규
 * @useMobile use
 * @example ngmf.subStr("abcde");  // return "abcde"
 * @example ngmf.subStr("abcde", 2);  // return "cde"
 * @example ngmf.subStr("abcde", 2, 2);  // return "cd"
 * @exampleAsIs SubStr("abcde");  // return "abcde"
 * @exampleAsIs SubStr("abcde", "2");  // return "cde"
 * @exampleAsIs SubStr("abcde", "2", "2");  // return "cd"
 */
ngmf.subStr = function (str, nIndex, nSize) {
	try{
		var result = "";
		if (typeof str != "string") {
			str = str.toString();
		}

		if (nIndex > -1 && typeof nSize != "undefined") {
			result = str.substring(nIndex).slice(0, Number(nSize));
		} else if (nIndex > -1) {
			result = str.substring(nIndex);
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.subStr] Exception :: ", e);
	}
};

/**
 * 입력된 문자열의 일부분을 다른 문자열로 치환하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str     :: I :: N ::  :: 원본 문자열.
 * @param {String} find    :: I :: N ::  :: 원본 문자열에서 찾을 문자열.
 * @param {String} convert :: I :: Y ::  :: 새로 바꿀 문자열.
 * @return {String} strOld가 모두 strNew로 대체된 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.replace("yyyymmdd", "mm");  // return "yyyydd"
 * @example ngmf.replace("yyyymmdd", "mm", "MM");  // return "yyyyMMdd"
 * @exampleAsIs Replace("yyyymmdd", "mm");  // return "yyyydd"
 * @exampleAsIs Replace("yyyymmdd", "mm", "MM");  // return "yyyyMMdd"
 */
ngmf.replace = function (str, find, convert) {
	try{
		var result = "";
		convert = convert || "";
		if (typeof str == "string") {
			result = str.replaceAll(find, convert);
		}
		return result;
	} catch (e) {
		ngmf._error("[ngmf.replace] Exception :: ", e);
	}
};

/**
 * Text를 Binary Data로 바꾸는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} value     :: I :: N ::  :: date 형식의 날짜 (yyyyMMdd or yyyyMMddHHmmss)
 * @param {String} nCodePage :: I :: Y ::  :: 코드page
 * @return {String} 변환된 문자열값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.textToBin("abcd");  // return "01100001011000100110001101100100"
 * @exampleAsIs 신규
 */
ngmf.textToBin = function (value, nCodePage) {
	try{
		var result = "";

		for (var i = 0; i < value.length ; i++) {
			var e = value[i].charCodeAt(0);
			var s = "";
			do {
				var a = e%2;
				e = (e-a)/2;
				s = a + s;
			} while (e != 0);
			while(s.length<8) {
				s="0"+s;
			}
			result +=s;
		}
		return result;
	} catch (ex) {
		ngmf._error("[ngmf.textToBin] Exception :: ", ex);
	}
};

/**
 * Binary Data를 Text 로 바꾸는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} value     :: I :: N ::  :: 내용이 Text 형태인 Binary Data.
 * @param {String} nCodePage :: I :: Y ::  :: CodePage
 * @return {String} 변환된 문자열값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.binToText("01100001011000100110001101100100");  // return "abcd"
 * @exampleAsIs 신규
 */
ngmf.binToText = function (value, nCodePage) {
	try{
		var len = value.length / 8;
		var str = "";
		if (value.length%8 == 0) {
			for (var i = 0; i < len ; i++) {
				str += (value.substring((i*8), (i+1)*8) + " ");
			}
			if (str.match(/[10]{8}/g)) {
				var binary = str.match(/([10]{8}|\s+)/g).map(function(fromBinary){
					return String.fromCharCode(parseInt(fromBinary, 2));
				}).join("");
				return binary;
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.binToText] Exception :: ", e);
	}
};

/**
 * 지정된 길이만큼 공백으로 채운 문자열을 Return 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Number} cnt :: I :: N ::  :: 공백문자로 채울 길이.
 * @return {String} 공백문자로 채워진 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.space(10);  // return "          "
 * @exampleAsIs Space(10);  // return "          "
 */
ngmf.space = function (cnt) {
	try{
		var str = "";
		for (var i = 0; i < cnt; i++) {
			str += " ";
		}
		return str;
	} catch (e) {
		ngmf._error("[ngmf.space] Exception :: ", e);
	}
};

/**
 * 문자열에서 주어진 부분 문자열의 위치를 검색하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str       :: I :: N ::   :: 검색하고자 하는 원본 문자열.
 * @param {String} findValue :: I :: N ::   :: 검색할 문자열.
 * @param {String} exceptIdx :: I :: Y :: 0 :: 검색할 때 최초 앞에서부터 건너띌 글자수.
 * @return {Number} 찾아진 문자열의 위치 index.
 * @author 이동규
 * @useMobile use
 * @example ngmf.pos("abcdeaa", "z");  // return -1
 * @example ngmf.pos("abcdeaa", "a", 3);  // return 5
 * @exampleAsIs Pos("abcdeaa", "z"); // return -1
 * @exampleAsIs Pos("abcdeaa", "a", 3); // return 5
 */
ngmf.pos = function (str, findValue, exceptIdx) {
	try{
		var result = -1;
		if (typeof str == "string") {
			if (typeof exceptIdx != "undefined" && exceptIdx != "") {
				str = str.slice(exceptIdx);
				result = str.indexOf(findValue) == -1 ? -1 : str.indexOf(findValue) + exceptIdx;
			} else {
				result = str.indexOf(findValue);
			}
		}

		return  result;
	} catch (e) {
		ngmf._error("[ngmf.pos] Exception :: ", e);
	}
};

/**
 * 문자열에서 주어진 부분 문자열의 위치를 찾는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str     :: I :: N ::   :: 검색하는 대상 문자열.
 * @param {String} pattern :: I :: N ::   :: 검색할 문자열.
 * @param {Number} nOffset :: I :: Y :: 0 :: 검색할 때 최초 앞에서부터 건너띌 글자수.
 * @return {String} 찾아진 문자열의 위치. -1 인 경우 해당 문자열이 없는 경우입니다
 * @author 이동규
 * @useMobile use
 * @example ngmf.indexOf("20151012");  // return -1
 * @example ngmf.indexOf("20151012", "10");  // return 4
 * @exampleAsIs IndexOf("20151012");  // return -1
 * @exampleAsIs IndexOf("20151012", "10");  // return 4
 */
ngmf.indexOf = function (str, pattern, nOffset) {
	try{
		//pos와 동일한 API 입니다.
		return ngmf.pos(str, pattern, nOffset);
	} catch (e) {
		ngmf._error("[ngmf.indexOf] Exception :: ", e);
	}
};

/**
 * 입력된 문자열을 strDelimiter로 자른 결과 중 nIndex 번째 결과값을 구하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str       :: I :: N ::  :: 원본 문자열.
 * @param {String} delimiter :: I :: N ::  :: 자를 문자. 복수개가 가능합니다.
 * @param {Number} nIdx      :: I :: N ::  :: 1을 기준으로 하는 얻어올 Token의 Index
 * @return {String} 지정된 offset만큼의 개월이 더해진 입력 날짜.
 * @author 이동규
 * @useMobile use
 * @example ngmf.nToken("a_b_c", "_" ,2); // return "b"
 * @exampleAsIs NToken("a_b_c", "_", 2); // return "b"
 */
ngmf.nToken = function (str, delimiter, nIdx) {
	try{
		var result;
		if ( typeof str != "string" || str =="") {
			result = null;
		} else if (typeof nIdx == "undefined" || nIdx == 0 || typeof delimiter == "undefined"
					|| delimiter == "") {
			result = "";
		} else if (typeof str == "string") {
			var arr =str.split(delimiter);
			if (arr.length < 1) {
				result = "";
			} else{
				result = arr[nIdx-1];
			}
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.nToken] Exception :: ", e);
	}
};

/**
 * 문자열이 지정된 길이가 되도록 오른쪽을 채우는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 원본 문자열.
 * @param {String} chr :: I :: N ::  :: 오른쪽에 채울 문자. 입력된 문자열의 첫 1글자만을 사용합니다
 * @param {String} num :: I :: N ::  :: 출력될 문자열의 길이.
 * @return {String} 오른쪽이 Padding 된 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.rpad("ab", "?", 4);  // return "ab??"
 * @exampleAsIs RPad("ab", "?", 4);  // return "ab??"
 */
ngmf.rpad = function(str, chr, num) {
	try{
	    if (!str || !chr || str.length >= num) {
	        return str;
	    }

	    var max = num - str.length;
	    for ( var i = 0; i < max; i++) {
	        str = str + chr;
	    }

	    return str;
	} catch (e) {
		ngmf._error("[ngmf.rpad] Exception :: ", e);
	}
};

/**
 * 문자열이 지정된 길이가 되도록 왼쪽을 채우는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 원본 문자열.
 * @param {Number} chr :: I :: N ::  :: 출력될 문자열의 길이.
 * @param {String} num :: I :: N ::  :: 왼쪽에 채울 문자. 입력된 문자열의 첫 1글자만을 사용합니다.
 * @return {String} 지정된 offset만큼의 개월이 더해진 입력 날짜.
 * @author 이동규
 * @useMobile use
 * @example ngmf.lpad("ab", "L", 4);  // return "LLab"
 * @exampleAsIs LPad("ab", "L", 4);  // return "LLab"
 */
ngmf.lpad = function(str, chr,  num) {
	try{
		if (!str || !chr || str.length >= num) {
			return str;
		}

		var max = num - str.length;
		for (var i = 0; i < max; i++) {
			str = chr + str;
		}

		return str;
	} catch (e) {
		ngmf._error("[ngmf.lpad] Exception :: ", e);
	}
};

/**
 * 문자열의 오른쪽 부분을 지정한 길이만큼 Return 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} argument[0] :: I :: N ::   :: 오른쪽 부분을 얻어올 원본 문자열.
 * @param {Number} argument[1] :: I :: Y :: 0 :: 얻어올 크기.
 * @return {String} 오른쪽 부분이 얻어진 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.right("abcde", 3); // return "cde"
 * @exampleAsIs Right("abcde", 3); // return "cde"
 */
ngmf.right = function() {
	try{
		var strString	= arguments[0];
		var nSize		= null;

		if(arguments.length > 1){
			nSize = arguments[1];
		}

		if(nSize == null){
			return strString;
		}else{
			var lastIndex = strString.length;
			var startIndex = lastIndex - nSize;
			return strString.substring(startIndex, lastIndex);
		}
	} catch (e) {
		ngmf._error("[ngmf.right] Exception :: ", e);
	}
};

/**
 * 문자열의 왼쪽 부분을 지정한 길이만큼 Return 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} argument[0] :: I :: N ::   :: 왼쪽 부분을 얻어올 원본 문자열.
 * @param {Number} argument[1] :: I :: Y :: 0 :: 얻어올 크기.
 * @return {String} 왼쪽 부분이 얻어진 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.left("abcde", 3); // return "abc"
 * @exampleAsIs Left("abcde", 3); // return "abc"
 */
ngmf.left = function() {
	try{
		var strString	= arguments[0];
		var nSize		= null;

		if(arguments.length > 1){
			nSize = arguments[1];
		}

		if(nSize == null){
			return strString;
		}else{
			return strString.substring(0, nSize);
		}
	} catch (e) {
		ngmf._error("[ngmf.left] Exception :: ", e);
	}
};

/**
 * 입력값 형태에 따라서 길이 또는 범위를 구하는 Basic API 입니다.
 * (문자열의 길이, 배열의 크기, Binary Data의 크기등을 구합니다)
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Variant} value :: I :: N ::  :: 입력된 값.
 * @return {String} Variant에 해당되는 Type에 따라 구해진 길이 또는 범위.
 * @author 이동규
 * @useMobile use
 * @example ngmf.length("20151012");  // return 8
 * @exampleAsIs Length("20151012");  // return 8
 */
ngmf.length = function (sValue) {
	try{
		return ngmf.bound(sValue);
	} catch (e) {
		ngmf._error("[ngmf.length] Exception :: ", e);
	}
};

/**
 * 입력값 형태에 따라서 길이 또는 범위를 구하는 Basic API 입니다.
 * (문자열의 길이, 배열의 크기, Binary Data의 크기등을 byte 단위로 구합니다)
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {varValue} sValue :: I :: N ::  :: 범위를 구할 값.
 * @return {Number} Variant에 해당되는 Type에 따라 구해진 길이 또는 범위.
 * @author 이동규
 * @update 2016-09-19 성일호 ngmf.lengthbDB 기능 통합
 * @useMobile use
 * @example ngmf.lengthb("가나다");  // return 6
 * @exampleAsIs Lengthb("가나다");  // return 6
 */
ngmf.lengthb = function (sValue) {
	return ngmf.lengthbDB(sValue);
	/*
	var nTotCnt = 0;
	try{
		if (ngmf.isNull(sValue) == "Y") {
			nTotCnt = 0;
		} else {
			var b = new Blob([sValue]);
			nTotCnt =  b.size; 
		} 
	} catch (e) {
		for (var i=0; i<sValue.length; i++) {
			if (escape(sValue.charAt(i)).length > 4) {
				nTotCnt += 2;
			} else {
				nTotCnt += 1;
			}
		}
		ngmf._error("[ngmf.lengthb] Exception :: ", e);
	}
	return nTotCnt;
	*/
};

/**
 * 입력한 componentID에 해당하는 value 값의 길이를 반환합니다.
 * @date 2015-12-03
 * @memberOf ngmf
 * @param {String} compId :: I :: N ::  :: componentID.
 * @return {Number} 입력받은 컴포넌트의 value 값의 길이를 반환합니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.getLength("inpu1");  // return 6
 * @exampleAsIs 신규
 */
ngmf.getLength = function (compId) {
	try{
		var len ;

		if (typeof compId !== "undefined") {
			if (typeof ngmf.object(compId) !== "undefined") {
				len = ngmf.length(ngmf.object(compId).getValue());
			} else {
				ngmf.alert(compId + " 의 컴포넌트는 존재 하지 않습니다.");
			}
		}

		return len;
	} catch (e) {
		ngmf._error("[ngmf.getLength] Exception :: ", e);
	}
};

/**
 * 입력한 데이타셋ID의 마지막 row의 index를 반환합니다.(단 Filter 또는 삭제된 레코드는 제외하고 현재 Display되고 있는 데이타 중
 * 마지막 레코드의 Index입니다. LastRow Property와 같습니다. 실패시 Return 값은 -1 입니다.)
 * @date 2015-12-03
 * @memberOf ngmf
 * @param {String} compId :: I :: N ::  :: componentID.
 * @return {Number} 입력받은 컴포넌트의 lastRow Index 값을 반환합니다. (시작 row 는 0, 실패시 -1 입니다.)
 * @author 이동규
 * @useMobile use
 * @example ngmf.getLastRow("inpu1");
 * @exampleAsIs 신규
 */
ngmf.getLastRow = function (compId) {
	try{
		var rowIdx;

		if (typeof compId !== "undefined") {
			if (typeof ngmf.object(compId) !== "undefined") {
				rowIdx = ngmf.length(ngmf.object(compId).getAllFilteredJSON()) - 1;
			} else {
				ngmf.alert(compId + " 의 컴포넌트는 존재 하지 않습니다.");
				rowIdx = -1;
			}
		}

		return rowIdx;
	} catch (e) {
		ngmf._error("[ngmf.getLastRow] Exception :: ", e);
	}
};

/**
 * 입력된 문자열을 URL에 사용할 수 있는 형태에서 실제 문자열로 Decode 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: URL에 사용가능한 형태로 Encode 된 문자열.
 * @return {String} Decode 된 문자열. Encode 되기 전의 원래 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.urlDecode("http://www.yahoo.co.kr/sample.jsp?name=%ED%99%8D%20%EA%B8%B8%20%EB%8F%99&addr=%EC%84%9C%EC%9A%B8%EC%8B%9C");  // 결과값 : "http://www.yahoo.co.kr/sample.jsp?name=홍 길 동&addr=서울시"
 * @exampleAsIs UrlDecode("http://www.yahoo.co.kr/sample.jsp?name=%ED%99%8D%20%EA%B8%B8%20%EB%8F%99&addr=%EC%84%9C%EC%9A%B8%EC%8B%9C"); // 결과값 : "http://www.yahoo.co.kr/sample.jsp?name=??湲???addr=?쒖슱??"
 */
ngmf.urlDecode = function (str) {
	try{
		return decodeURI(str);
	} catch (e) {
		ngmf._error("[ngmf.urlDecode] Exception :: ", e);
	}
};

/**
 * 입력된 문자열을 URL에 사용할 수 있는 형태로 encode 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: URL을 통해 전송할 문자열.
 * @return {String} URL에 사용가능하도록 Encode 된 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.urlEncode ("http://www.yahoo.co.kr/sample.jsp?name=홍 길 동&addr=서울시");  // 결과값 : "http://www.yahoo.co.kr/sample.jsp?name=%ED%99%8D%20%EA%B8%B8%20%EB%8F%99&addr=%EC%84%9C%EC%9A%B8%EC%8B%9C"
 * @exampleAsIs UrlEncode("http://www.yahoo.co.kr/sample.jsp?name=홍 길 동&addr=서울시"); // 결과값 : "http:%2F%2Fwww.yahoo.co.kr%2Fsample.jsp%3Fname%3D%C8%AB%20%B1%E6%20%B5%BF%26addr%3D%BC%AD%BF%EF%BD%C3"
 */
ngmf.urlEncode = function (str) {
	try{
		return encodeURI(str);
	} catch (e) {
		ngmf._error("[ngmf.urlEncode] Exception :: ", e);
	}
};

/**
 * Variant 값을 문자열로 변환하여 Return 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} sValue    :: I :: N ::  :: 변환 할 값.
 * @param {String} strOption :: I :: Y ::  :: DATE, Currency Type 일경우 설정할수 있는 옵션, 진수의경우 2, 8, 10, 16진수 옵션.
 * @return {String} 지정된 strOption의 mask형식으로 변경된 날짜, 진수의경우 2, 8, 10, 16진수 옵션.
 * @author 이동규
 * @useMobile use
 * @example ngmf.toString("20050606","@@@@/@@/@@");  // return "2005/06/06"
 * @ngmf.toString('5462521111111111','2') "10011011010000010001001001110011001111110010111000111"
 * @update 2016.02.23 default 추가
 * @exampleAsIs ToString("20050606","@@@@/@@/@@"); // return "2005/06/06"
 */
ngmf.toString = function (sValue, strOption) {
	try{
		var result = "";
		var type = (sValue === null) ? "" : ngmf.toUpper(ngmf.type(sValue));

		switch(type) {
			case "STRING" :
				if (typeof strOption != "undefined" && strOption != "") {
					var dateArr = sValue.split("");
					var dateArrIdx = 0;
					var changeDate = [];
					for (var i = 0; i < strOption.length ; i++) {
						if (strOption[i].indexOf("@") > -1) {
							changeDate.push(dateArr[dateArrIdx]);
							dateArrIdx += 1;
						} else {
							changeDate.push(strOption[i]);
						}
					}
					result = changeDate.join("");
				} else {
					result = sValue;
				}
				break;
			case "OBJECT" :
			case "ARRAY" :
				result = ngmf.stringify(sValue);
				break;
			case "INTEGER" :
			case "DECIMAL" :
				if (typeof strOption != "undefined" && strOption != "") {
					var dateArr = (sValue+"").split("");
					var dateArrIdx = 0;
					var changeDate = [];
					for (var i = 0; i < strOption.length ; i++) {
						if (strOption[i].indexOf("@") > -1) {
							changeDate.push(dateArr[dateArrIdx]);
							dateArrIdx += 1;
						} else {
							changeDate.push(strOption[i]);
						}
					}
					result = changeDate.join("");
				} else {
					result = sValue.toString();;
				}
				break;
			case "BOOLEAN" :
				result = WebSquare.util.getBoolean(sValue) ? 1 : 0;
				break;
			case "DATE" :
				if (typeof strOption != "undefined" && strOption != "") {
					var dateArr = sValue.split("");
					var dateArrIdx = 0;
					var changeDate = [];
					for (var i = 0; i < strOption.length ; i++) {
						if (strOption[i].indexOf("@") > -1) {
							changeDate.push(dateArr[dateArrIdx]);
							dateArrIdx += 1;
						} else {
							changeDate.push(strOption[i]);
						}
					}
					result = changeDate.join("");
				} else {
					result = sValue;
				}
				break;
			case "CURRENCY" :
				if (typeof strOption != "undefined" && strOption != "") {

				} else {
					result = sValue;
				}
				break;
			case "BINARY" :
				if (typeof strOption != "undefined" && strOption != "") {
                    result = Number(sValue).toString(strOption);
				} else {
					result = sValue.toString();
				}
				break;
		}
		return result;
	} catch (e) {
		ngmf._error("[ngmf.toString] Exception :: ", e);
	}
};

/**
 * 반각문자로 이루어진 문자열을 전각문자로 바꾸는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} value :: I :: N ::  :: 반각문자 또는 반각문자로 이루어진 문자열.
 * @return {String} 입력된 전각문자로 변환된 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.half2Full("abcde"); // return "a b c d e "
 * @exampleAsIs Half2Full("abcde"); // return "a b c d e "
 */
ngmf.half2Full = function(value) {
	try{
		var halfData = "";
		var arr = value.split("");
		if (arr.length > 1) {
			halfData = [];
			for (var i = 0; i < arr.length; i++) {
				var c = arr[i].charCodeAt(0);
				if (32 <= c && c <= 126) {
					if (c ==32 ) {
						halfData.push(unescape("%uFFFC"));
					} else {
						halfData.push(unescape("%u"+(c+65248).toString(16)));
					}
				}
			}
		} else {
			var c = value.charCodeAt(0);
			if (32 <= c && c <= 126) {
				if (c ==32 ) {
					halfData = unescape("%uFFFC");
				} else {
					halfData = unescape("%u"+(c+65248).toString(16));
				}
			}
		}

		if(halfData.length >1) {
			halfData = halfData.join("");
		}

		return halfData;
	} catch (e) {
		ngmf._error("[ngmf.half2Full] Exception :: ", e);
	}
};

/**
 * 전각문자로 이루어진 문자열을 반각문자로 바꾸는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} value :: I :: N ::  :: 전각문자 또는 전각문자로 이루어진 문자열.
 * @return {String} 반각문자로 변환된 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.full2Half("a b c d e 11");  // return "a b c d e 11"
 * @exampleAsIs full2Half("a b c d e 11");  // return "a b c d e 11"
 */
ngmf.full2Half = function (value) {
	try{
		var byteChar = "";
		var len = value.length;
		for (var i = 0; i < len; i++) {
			var c = value.charCodeAt(i);

			if (c >= 65281 && c <= 65374 && c != 65340) {
				byteChar += String.fromCharCode(c - 65248);
			} else if (c == 8217) {
				byteChar += String.fromCharCode(39);
			} else if (c == 8221) {
				byteChar += String.fromCharCode(34);
			} else if (c == 12288) {
				byteChar += String.fromCharCode(32);
			} else if (c == 65507) {
				byteChar += String.fromCharCode(126);
			} else if (c == 65509) {
				byteChar += String.fromCharCode(92);
			} else {
				byteChar += value.charAt(i);
			}
		}
		return byteChar;
	} catch (e) {
		ngmf._error("[ngmf.full2Half] Exception :: ", e);
	}
};

/* 2-3 Num업무 ---------------------------------------------------------------------------------------------------------------- */
/**
 * 입력된 값을 실수형으로 전환하는 API입니다.
 * @date 2015-12-11
 * @memberOf ngmf
 * @param {String/Number} string :: I :: N ::  :: 변환할 값.
 * @return {Number} 변환된 실수 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.toNumber("123412"); // return 123412
 * @exampleAsIs ToNumber("123412"); // return 123412
 */
ngmf.toNumber = function(number) {
	try{
		var returnValue = "";
		if (typeof number !== "undefined" && (typeof number == "string" || typeof number == "number")){
			returnValue = Number(number);
		}
		return returnValue;
	} catch (e) {
		ngmf._error("[ngmf.toNumber] Exception :: ", e);
	}
};


/**
 * 입력된 실수를 표현법으로 표현하는 API입니다.(소수점 이하의 자릿수 정의)
 * @date 2015-12-11
 * @memberOf ngmf
 * @param {Number/String} number :: I :: N ::  :: 입력된 실수를 표현법으로 표현될 값.
 * @param {Number} index  :: I :: Y :: 0 :: 출력시 소숫점 이하의 자릿수.
 * @return {Number} 입력된 실수를 표현법으로 표현된 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.numFormat("1234.1234"); // return 1,234
 * @example ngmf.numFormat("1234.1234", 3); // return 1,234.123
 * @exampleAsIs NumFormat("1234.1234"); // return 1,234
 * @exampleAsIs NumFormat("1234.1234", 3); // return 1,234.123
 */
ngmf.numFormat = function(number, index) {
	try{
		var returnValue = "";
		if (typeof number !== "undefined") {
			var index = (typeof index == "undefined") ? "" : index;
			if (typeof number == "string") {
				returnValue = Number(number).toFixed(index);
			} else if (typeof number == "number") {
				returnValue = number.toFixed(index);
			}

		}

		if (returnValue.length > 0) {
			var rxSplit = new RegExp('([0-9])([0-9][0-9][0-9][,.])');
			var arrNumber = returnValue.split(".");
			arrNumber[0] += ".";

			do {
				arrNumber[0] = arrNumber[0].replace(rxSplit, '$1,$2');
			} while(rxSplit.test(arrNumber[0]));

			if (arrNumber.length > 1) {
				returnValue = arrNumber.join('');
			} else {
				returnValue = arrNumber[0].split(".")[0];
			}
		}

		return returnValue;
	} catch (e) {
		ngmf._error("[ngmf.numFormat] Exception :: ", e);
	}
};

/**
 * 입력된 값을 실수형으로 전환하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Variant} varValue :: I :: N ::  :: 실수형으로 전환할 값.
 * @return {Number} 실수형으로 변환된 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.toFloat("1234.12"); // return 1234.12
 * @exampleAsIs ToFloat("1234.12"); // return 1234.12
 */
ngmf.toFloat = function(varValue) {
	try{
		return ngmf.parseFloat(varValue);
	} catch (e) {
		ngmf._error("[ngmf.toFloat] Exception :: ", e);
	}
};

/**
 * 입력된 값을 정수형으로 전환하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Variant} varValue :: I :: N ::  :: 정수형으로 전환할 값.
 * @return {Number} 정수형으로 변환된 값.
 * @sampleLink grd_detailView
 * @author 이동규
 * @useMobile use
 * @example ngmf.toInteger("1234");  // return 1234
 * @exampleAsIs ToInteger("1234");  // return 1234
 */
ngmf.toInteger = function(varValue) {
	try{
		return ngmf.parseInt(varValue);
	} catch (e) {
		ngmf._error("[ngmf.toInteger] Exception :: ", e);
	}
};

/**
 * 입력된 값을 실수형으로 전환하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Variant} varValue :: I :: N ::  ::  실수로 전환할 값.
 * @param {String} opt       :: I :: Y ::  ::  opt = "D" 일경우 Date형으로 인지.
 * @return {Number} 실수형으로 변환된 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.parseFloat("1234.12");  // return 1234.12
 * @exampleAsIs ParseFloat("1234.12");  // return 1234.12
 */
ngmf.parseFloat = function (varValue, opt) {
	var result = -1;
	try{
		if (typeof opt != "undefined" && opt == "D") {
			if (ngmf.isDate(varValue)) {
				var date = new Date("0000", Number("01")-1, "01");
				var yyyy = varValue.substring(0,4);
				var MM = varValue.substring(4,6);
				var dd = varValue.substring(6,8);
				var dateObj = new Date(yyyy, Number(MM)-1, dd);
				result = Math.floor(dateObj.getTime() - date.getTime())/1000/60/60/24;
			} else {
				result = parseFloat(varValue);
			}
		} else {
			result = parseFloat(varValue);
		}

		if (isNaN(result)) {
			var isBoolean = WebSquare.util.getBoolean(varValue);
			if (isBoolean) {
				result = 1;
			} else {
				result = 0;
			}
		};
	} catch (e) {
		ngmf._error("[ngmf.parseFloat] Exception :: ", e);
	}
	return result;
};

/**
 * 입력된 값을 정수형으로 전환하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Number/String} varValue :: I :: N ::  :: 정수형으로 전환할 값.
 * @param {String} offset    :: I :: N ::  :: 더할 개월 수.
 * @return {Number} Number 형으로 전환된 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.parseInt("1234"); // return 1234
 * @exampleAsIs ParseInt("1234"); // return 1234
 */
ngmf.parseInt = function (varValue) {
	try{
		var result;
		if (typeof varValue == "string") {
			if (ngmf.isDate(varValue)) {
				var date = new Date("0000", Number("01")-1, "01");
				var yyyy = varValue.substring(0,4);
				var MM = varValue.substring(4,6);
				var dd = varValue.substring(6,8);
				var dateObj = new Date(yyyy, Number(MM)-1, dd);
				result = Math.floor(dateObj.getTime() - date.getTime())/1000/60/60/24;
			} else {
				result = parseInt(varValue);
			}
		} else if (typeof varValue == "number") {
			result = parseInt(varValue);
		}

		if (isNaN(result)) {
			var isBoolean = WebSquare.util.getBoolean(varValue);
			if (isBoolean) {
				result = 1;
			} else {
				result = 0;
			}
		};

		return result;
	} catch (e) {
		ngmf._error("[ngmf.parseInt] Exception :: ", e);
	}
};

/**
 * 실수를 지수표현법으로 표현하는 Basic API 입니다.
 * (유효 자릿수를 설정할 수 있으며, 설정된 유효 자릿수보다 작은 숫자는 반올림됩니다)
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Number} value :: I :: N ::   :: 지수 표현법으로 표현할 숫자.
 * @param {Number} nIdx  :: I :: Y :: 7 :: 표현할 숫자의 유효자릿수. 지수 표현법으로 표현했을 때 소숫점 이하의 자리수를 의미합니다.
 * @return {String} 지정된 offset만큼의 개월이 더해진 입력 날짜.
 * @author 이동규
 * @useMobile use
 * @example ngmf.exponentFormat(100.1234, 4);  // return "1.0012e+2"
 * @exampleAsIs ExponentFormat(100.1234, 4);  // return "1.0012e+2"
 */
ngmf.exponentFormat = function (value, nIdx) {
	try{
		var result;
		nIdx = nIdx || 7;
		if(typeof value == "number"){
			result = value.toExponential(nIdx);
		}
		return result;
	} catch (e) {
		ngmf._error("[ngmf.exponentFormat] Exception :: ", e);
	}
};

/**
 * 입력된 값에서 통화 단위와 자리수 표시를 위한 ',' 를 제거한 값으로 숫자를 Return 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Variant} value :: I :: N ::  :: 입력값.
 * @return {Number} 문자열 입력값. 문자열에서 ',', '$', 'W' 등을 제거한 후 실수형으로 값으로 전환되어 Return 합니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.stripNum("$10,000");  // return 10000
 * @exampleAsIs StripNum("$10,000");  // return 10000
 */
ngmf.stripNum = function (value) {
	try{
		var pattern = /^[$￦＄]|,/g;
		var result = WebSquare.util.getNumber(value.replace( pattern, ""));
		if (isNaN(result)) {
			result = "";
		}
		return result;
	} catch (e) {
		ngmf._error("[ngmf.stripNum] Exception :: ", e);
	}
};




/* 2-4 data업무 --------------------------------------------------------------------------------------------------------------- */

/**
 * Dataset의 Column 정보와 Row 를 모두 삭제하는 API 입니다.
 * (최초 Loading 된 Data도 전부 삭제되므로 복구할 수 없습니다)
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} dataId :: I :: N ::  :: 정보를 모두 삭제할 dataList.
 * @return {Number} Caret의 Index를 반환합니다.
 * @sampleLink scm_svcCallBasic
 * @author 이동규
 * @useMobile use
 * @example ngmf.clear(dataId);
 * @exampleAsIs 신규
 */
ngmf.clear = function (dataId) {
	var rowCnt  = -1;
	try{
		var dataComp = ngmf.object(dataId);
		if (typeof dataComp != "undefined" && dataComp != null && dataComp.initializeType == "dataList") {
			rowCnt = dataComp.getRowCount();
			if (rowCnt > 0) dataComp.removeAll({skipSavingRemovedData : "true"});
			var colCnt = dataComp.getColCnt();
			if (colCnt > 0) {
				for (var i = colCnt -1; i > -1 ; i--) {
					dataComp.removeColumn(i);
				}	
			}
//			for (var i = 0 ; i < colCnt ; i++) {
//				var colId = dataComp.getColumnID(0);
//				dataComp.removeColumn(colId);
//			}
		}
	} catch (e) {
		ngmf._error("[ngmf.clear] Exception :: ", e);
	}
	return rowCnt;
};

/**
 * 지정한 Dataset에서 지정한 Row전체를 복사해 DataSet의 지정한 Row를 변경하는 API 입니다.
 * (Column 명이 서로 다를경우, 복사할 Column이 저장될 Column을 지정할 수 있습니다)
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} targetId   :: I :: N ::  :: 복사할 DataSet Id
 * @param {Number} nToRow     :: I :: N ::  :: Target Dataset의 복사할 Row Index.
 * @param {String} strDataset :: I :: N ::  :: 붙여 넣을 Dataset의 id.
 * @param {Number} nFromRow   :: I :: N ::  :: strDataset에 붙여넣을 Row Index.
 * @param {String} strColInfo :: I :: Y ::  :: 복사할 조건. 생략 가능합니다. 생략시에는 같은 필드명의 값을 복사합니다. (ToColumnID=FromColumnID,ToColumnID1=FromColumnID1 형식으로 입력합니다)
 * @param {String} objDataset :: I :: Y ::  :: Source Dataset object를 지정.
 * @author 이동규
 * @useMobile use
 * @example ngmf.mi_copyRow("dataList1", 2, "dataList2", 3, "dataList1Col1 = dataList2Col3, dataList1Col2 = dataList2Col4");
 * @example ngmf.mi_copyRow("dataList1", 2, "dataList2", 3);
 * @exampleAsIs 신규
 */
ngmf.mi_copyRow = function (targetId, nToRow, strDataset, nFromRow, strColInfo, objDataset) {
	try{
		var targetComp = ngmf.object(targetId);
		var pComp = ngmf.object(strDataset);

		if (typeof targetComp != "undefined" && typeof pComp != "undefined"
			&& targetComp.initializeType == "dataList" && pComp.initializeType == "dataList") {
			if (typeof nToRow == "undefined" || typeof nFromRow == "undefined") return -1;
			var jsonData = targetComp.getRowJSON(nToRow);

			//var rowIdx = pComp.insertRow(nFromRow);
			if (typeof strColInfo !="undefined" && strColInfo != "") {
				strColInfo = ngmf.trim(strColInfo);
				var colInfo = strColInfo.split(",");
				for (var i in colInfo) {
					var arr = colInfo[i].split("=");
					if (arr.length == 2) {
						pComp.setCellData(nFromRow, ngmf.trim(arr[1]), targetComp.getCellData(nToRow, ngmf.trim(arr[0])));
					}
				}
			} else {
				pComp.setRowJSON(nFromRow, jsonData, true);
			}
			return 1;
		}
	} catch (e) {
		ngmf._error("[ngmf.mi_copyRow] Exception :: ", e);
	}
};

/**
 * 복사지정한 Dataset의 Row와 Col의 해당 값을 지정된 Dataset의 Row 와 Col의 값에 붙여넣는 API입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} objDataSet :: I :: N ::  :: 복사할 DataSet Id
 * @param {Number} nToRow     :: I :: N ::  :: objDataSet의 복사할 Row Index.
 * @param {String} nToCol     :: I :: N ::  :: objDataSet의 복사할 Col Index.
 * @param {String} strDataSet :: I :: N ::  :: 붙여 넣을 Dataset의 id.
 * @param {Number} nFromRow   :: I :: N ::  :: strDataSet에 붙여넣을 Row Index.
 * @param {String} nFromCol   :: I :: N ::  :: strDataSet에 붙여넣을 Col Index.
 * @author 이동규
 * @useMobile use
 * @example ngmf.copyColumn("dataList1", 2, "col1", "dataList2", 3, "col2");
 * @exampleAsIs 신규
 */
ngmf.copyColumn = function (objDataSet, nToRow, nToCol, strDataSet, nFromRow, nFromCol) {
	try{
		var objDataSetComp = ngmf.object(objDataSet);
		var strDataSetComp = ngmf.object(strDataSet);

		if (typeof objDataSetComp != "undefined" && typeof strDataSetComp != "undefined"
			&& objDataSetComp.initializeType == "dataList" && strDataSetComp.initializeType == "dataList") {

			var copyData = objDataSetComp.getCellData(nToRow, nToCol);
			strDataSetComp.setCellData(nFromRow, nFromCol, copyData);
		}
	} catch (e) {
		ngmf._error("[ngmf.copyColumn] Exception :: ", e);
	}
};

/** 데이터리스트의 컬럼을 추가합니다.
 * @date 2015.11.25
 * @memberOf ngmf
 * @param {String} dataList :: I :: N ::  :: 데이터셋의 아이디
 * @param {String} columNm  :: I :: N ::  :: 추가할 컬럼의 아이디
 * @param {Object} options  :: I :: N ::  :: 추가할 컬럼의 옵션
 * 				   options.name     : 컬럼의 명,
 * 				   options.dataType : 컬럼의 데이터 타입
 * @return {Number} 컬럼 생성 성공 여부 [1 : 성공, 0 : 실패(데이터리스트가 없읍니다.), 2 : 실패(동일한 컬럼ID가 존재합니다.)]
 * @useMobile use
 * @example ngmf.insertColumn("dataList1", "test1", {"name":"컬럼1", "dataType":"text"});
 * @sampleLink grd_detailView
 * @exampleAsIs 신규
 */
ngmf.insertColumn = function(dataList, columnNm, options) {
	try{
		var returnValue = 2;
		if (typeof dataList !== "undefined") {
			var datacomp = ngmf.object(dataList);
			if (datacomp) {
				var columnList = datacomp.cellIdList;
				if (columnList.indexOf(columnNm) < 0) {
					options = options || {};
					//datacomp.removeColumn(columnNm);
					datacomp.insertColumn(columnNm, options);
					returnValue = 1;
				}
			} else {
				returnValue = 0;
			}
		} else {
			returnValue = 0;
		}
		return returnValue;
	} catch (e) {
		ngmf._error("[ngmf.insertColumn] Exception :: ", e);
	}
};

/** 데이터리스트의 컬럼을 삭제합니다.
 * @date 2015.11.25
 * @memberOf ngmf
 * @param {String} dataList :: I :: N ::  :: 데이터셋의 아이디
 * @param {String} columNm  :: I :: N ::  :: 삭제할 컬럼의 아이디
 * @return {Number} 컬럼 생성 성공 여부 [1 : 성공, 0 : 실패(데이터리스트가 없습니다.), 2 : 실패(삭제할 컬럼ID가 존재하지 않습니다.)]
 * @useMobile use
 * @example ngmf.deleteColumn("test");
 * @exampleAsIs 신규
 */
ngmf.deleteColumn = function(dataList, columnNm) {
	try{
		var returnValue = 2;
		if (typeof dataList !== "undefined") {
			var datacomp = ngmf.object(dataList);
			var columnList = datacomp.cellIdList;

			if (columnList.indexOf(columnNm) > -1) {
				datacomp.removeColumn(columnNm);
				returnValue = 1;
			}
		} else {
			returnValue = 0;
		}

		return returnValue;
	} catch (e) {
		ngmf._error("[ngmf.deleteColumn] Exception :: ", e);
	}
};

/**
 * 조건에 맞는 Dataset의 Record 갯수를 얻어오는 Method 입니다.
 * @date 2015-10-21
 * @memberOf ngmf
 * @param {String} dataSetId :: I :: N ::          :: dataSet의 ID
 * @param {Number} nStartIdx :: I :: Y :: 0        :: Dataset의 갯수를 가져올 기준 Index.
 * @param {Number} nCnt      :: I :: Y :: rowcount :: 얻고자 하는 Record 갯수.
 * @return {Number} Dataset의 Record 갯수
 * @author 이동규
 * @useMobile use
 * @example ngmf.count("dst_msg");
 * @example ngmf.count("dst_msg", 2, 4);
 * @example ngmf.count("dst_msg", 2, 6);
 * @exampleAsIs 신규
 */
ngmf.count = function (dataSetId, nStartIdx, nCnt) {
	try{
		var dataSetComp = ngmf.object(dataSetId);
		var cnt = 0;
		if (typeof dataSetComp != "undefined" && dataSetComp.initializeType == "dataList") {
			if (typeof nStartIdx != "undefined") {
				nStartIdx = isNaN(ngmf.parseInt(nStartIdx)) ? 0 : ngmf.parseInt(nStartIdx);
				nStartIdx = nStartIdx > 0 ? nStartIdx : 0;
			}
			if (typeof nCnt != "undefined") {
				nCnt = isNaN(ngmf.parseInt(nCnt)) ? 0 : ngmf.parseInt(nCnt);
				nCnt = nCnt > 0 ? nCnt : 0;
			}
			cnt = dataSetComp.getRowCount();

			if (typeof nStartIdx != "undefined") {
				if (cnt > nStartIdx) {
					cnt -= nStartIdx;
				} else {
					cnt = 0;
				}
			}

			if (typeof nCnt != "undefined") {
				if (cnt > nCnt) {
					cnt = nCnt;
				}
			}
		}
		return cnt;
	} catch (e) {
		ngmf._error("[ngmf.count] Exception :: ", e);
	}
};

/**
 * 현재 선택된 Cell이 Editable 할 경우에 Edit 모드로 설정해주는 API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} gridId :: I :: N ::      :: 선택할 그리드 Id
 * @param {Boolean} bShow :: I :: Y :: true :: Editable 가능 여부. [True  : Editor를 강제로 표시한다. / False : Editor를 강제로 숨긴다.](default:true)
 * @return {Boolean} 성공여부. 정상적으로 실행되면 True, 실행되지 못하면 False가 Return됩니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.showEditor("grid1", true);
 * @exampleAsIs 신규
 */
ngmf.showEditor = function (gridId, bShow) {
	try{
		var comp = ngmf.object(gridId);

		if (typeof comp != "undefined" && comp.getPluginName() == "gridView") {
			var focusCol = comp.getFocusedColumnIndex();
			var focusRow = comp.getFocusedRowIndex();

			comp.setCellDisabled(focusRow, focusCol, !bShow);
			comp.setCellReadOnly(focusRow, focusCol, !bShow);
		}
	} catch (e) {
		ngmf._error("[ngmf.showEditor] Exception :: ", e);
	}
};

/**
 * Cell의 Focus를 다음 Editable Cell로 자동 이동시키는 API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} gridId :: I :: N ::  :: 선택할 그리드 Id
 * @return {Boolean} 성공여부. 정상적으로 실행되면 True, 실행되지 못하면 False가 Return됩니다.
 * @author 이동규
 * @useMobile use
 * @update  2016.04.21 조지용 이동하고자 하는 셀이 readOnly이면 그 다음 셀로 이동하도록 수정
 * @example ngmf.moveToNextCell("grid1");
 * @exampleAsIs 신규
 */
ngmf.moveToNextCell = function (gridId) {
	try{
		var comp = ngmf.object(gridId);
		var result = 0;

		if (typeof comp != "undefined" && comp.getPluginName() == "gridView") {
			var focusCol = comp.getFocusedColumnIndex();
			var focusRow = comp.getFocusedRowIndex();
			if ( focusRow != -1) {
				if(comp.getColumnCount()-1 == focusCol) {
					focusRow++;
					focusCol = 0;
				} else {
					focusCol++;
				}

				if (comp.getRowCount()-1 >= focusRow) {
					comp.setFocusedCell(focusRow, focusCol, true);
					
					if(comp.getCellReadOnly(focusRow, focusCol)){ //위치한 cell이 읽기 전용인 경우 한단계 더 이동하도록 설정
						result = ngmf.moveToNextCell(gridId);
					} else if(comp.getColumnReadOnly(focusCol) && comp.getCellReadOnly(focusRow, focusCol) == ""){ //위차한 column이 읽기 전용인 경우 한단계 더 이동하도록 설정
						result = ngmf.moveToNextCell(gridId);
					} else {
						result = 1;
					}
				}
			}
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.moveToNextCell] Exception :: ", e);
	}
};

/**
 * Cell의 Focus를 이전 Editable Cell로 자동 이동시키는 API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} gridId :: I :: N ::  :: 선택할 그리드 Id
 * @return {Boolean} 성공여부. 정상적으로 실행되면 True, 실행되지 못하면 False가 Return됩니다.
 * @author 이동규
 * @useMobile use
 * @update  2016.04.21 조지용 이동하고자 하는 셀이 readOnly이면 그 다음 셀로 이동하도록 수정
 * @example ngmf.moveToPrevCell("grid1");
 * @exampleAsIs 신규
 */
ngmf.moveToPrevCell = function (gridId) {
	try{
		var comp = ngmf.object(gridId);
		var result = 0;

		if (typeof comp != "undefined" && comp.getPluginName() == "gridView") {
			var focusCol = comp.getFocusedColumnIndex();
			var focusRow = comp.getFocusedRowIndex();
			
			if ( focusRow != -1) {
				if(focusCol == 0) {
					focusRow--;
					focusCol = comp.getColumnCount()-1;
				} else {
					focusCol--;
				}

				if (focusRow >= 0) {
					comp.setFocusedCell(focusRow, focusCol, true);
					
					if(comp.getCellReadOnly(focusRow, focusCol)){ //위치한 cell이 읽기 전용인 경우 한단계 더 이동하도록 설정
						result = ngmf.moveToPrevCell(gridId);
					} else if(comp.getColumnReadOnly(focusCol) && comp.getCellReadOnly(focusRow, focusCol) == ""){ //위차한 column이 읽기 전용인 경우 한단계 더 이동하도록 설정
						result = ngmf.moveToPrevCell(gridId);
					} else {
						result = 1;
					}
				}
			}
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.moveToPrevCell] Exception :: ", e);
	}
};

/**
 * Dataset에서 요청한 Row 범위에 대해 Column ID의 값에 대한 합계나 Row 별 수식 수행 결과에 대한 합계를 구하는 API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} objDataSet :: I :: N ::          :: 복사할 DataSet Id
 * @param {Number} strColId   :: I :: N ::          :: 합계를 구할 Column ID.
 * @param {String} nStart     :: I :: Y :: 0        :: 합계를 구하고자 하는 시작 Record Index.
 * @param {String} nCnt       :: I :: Y :: rowcount :: 합계를 구할 Row 갯수.
 * @param {Number} strExpr    :: I :: Y ::          :: Row 별로 수행될 수식.
 * @return {Number} var 구해진 합계.
 * @author 이동규
 * @useMobile use
 * @example ngmf.sum("DsSample", "DS_MONEY", 0, 8);
 * @exampleAsIs DsSample.Sum("DS_MONEY", 0, 8);
 */
ngmf.sum = function (objDataSet, strColId, nStart, nCnt, strExpr) {
	var sumData = 0;
	try{
		var dataSetComp = ngmf.object(objDataSet);
		var isDate = false;

		if (typeof dataSetComp != "undefined" && dataSetComp.initializeType == "dataList") {
			if( dataSetComp.getColumnInfo(strColId)["dataType"] == "date") isDate = true;
			nStart = nStart || 0;

			nCnt = nCnt || dataSetComp.getRowCount();

			for (var i = 0 ; i < nCnt  ; i++) {
				var rowIdx = nStart + i;
				if (rowIdx < dataSetComp.getRowCount()) {
					if(isDate) sumData += ngmf.parseFloat(dataSetComp.getCellData(rowIdx, strColId) , "D");
					else sumData += ngmf.parseFloat(dataSetComp.getCellData(rowIdx, strColId));
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.sum] Exception :: ", e);
	};
	return sumData;
};

/**
 * Dataset의 내용을 XML 형식으로 저장해서 문자열로 얻어내는 Method 입니다.
 * @date 2015-10-21
 * @memberOf ngmf
 * @param {String} strId       :: I :: N ::        :: 저장할때 사용할 Dataset ID.
 * @param {String} strSaveType :: I :: Y :: normal :: Save 하고자 하는 레코드 Type.
 *				   A(a, all, All) : Insert, Update, Delete된 모든 레코드를 포함합니다.
 *				   U(u, update, Update) : 변경된 레코드만 포함합니다
 *				   N(n, normal, Normal) : Insert, Update된 레코드를 포함합니다.
 * @param {String} bHeader     :: I :: Y ::        :: Encoding 정보를 비롯한 XML 버전정보를 포함한 Tag가 추가됩니다.
 * @param {String} nEventId    :: I :: Y ::        :: save할때 저장되어질 codepage, 이값이 없을경우엔 startxml의 codepage를 따라감,
 *							  단 utf-8,utf-16일경우에는 system의 default codepage로함 codepage입력시 string이나 codepage 숫자로 입력가능
 * @author 이동규
 * @useMobile use
 * @example ngmf.saveXml("Normal");
 * @exampleAsIs DsSample.SaveXML("Normal","False");
 */
ngmf.saveXml = function (strId, strSaveType, bHeader, nEventId) {
	try{
		var dataSetComp = ngmf.object(strId);
		var strSaveType = strSaveType || "normal";
		var xml = WebSquare.xml.parse("<root></root>").children[0];
		if (typeof dataSetComp != "undefined" && dataSetComp.initializeType == "dataList") {
			switch(strSaveType.toUpperCase()) {
				case "A" :
				case "ALL" :
					xml.appendChild(dataSetComp.getAllXML().childNodes[0]);
					if (WebSquare.util.getBoolean(bHeader)) {

					}
				break;

				case "U" :
				case "UPDATE" :
					xml.appendChild(dataSetComp.getModifiedXML().childNodes[0]);
					if (WebSquare.util.getBoolean(bHeader)) {

					}
				break;

				case "N" :
				case "NORMAL" :
					var arr = new Array();
					arr = arr.concat(dataSetComp.getInsertedIndex());
					arr = arr.concat(dataSetComp.getUpdatedIndex());
					arr = arr.sort(function(a , b) { return (a-b);});
					for (var i = 0 ; i < arr.length; i++) {
						xml.appendChild(dataSetComp.getRowXML(arr[i]).childNodes[0]);
					}

					if (WebSquare.util.getBoolean(bHeader)) {

					}
				break;
			}
		}

		return WebSquare.xml.serialize(xml).replaceAll("><",">\n<");
	} catch (e) {
		ngmf._error("[ngmf.saveXml] Exception :: ", e);
	}
};

/**
 * orgDs를 assignDs의 컬럼 및 로우데이터 및 상태값을 assign한다.
 * @date 2014. 12. 10.
 * @memberOf ngmf
 * @param {Object} pAssignDsObj1 :: I :: N ::  :: copy 대상 데이터셋
 * @param {Object} pAssignDsObj2 :: I :: N ::  :: copy 할 데이터셋
 * @useMobile use
 * @example ngmf.assign(orgDs, copyDs); // return 없음
 * @exampleAsIs ds1Target.Assign(ds1Origin); // return assing성공한 row수
 */
ngmf.assign = function(pAssignDsObj1, pAssignDsObj2){
	try{
		var copiedDs 	= ngmf.object(pAssignDsObj1);
		var copyDs 		= ngmf.object(pAssignDsObj2);

		//컬럼제거
		var copiedDsColArr = copiedDs.cellIdList;

		if(copiedDsColArr.length > 0){
			ngmf.clear(copiedDs);
		}

		var copyDsInfo		= copyDs.getInfo();
		var copyDsJsonData 	= copyDs.getAllJSON();

		for(var i=0; i<copyDs.cellIdList.length; i++){

			var colId = copyDs.cellIdList[i];
			var options = {
			 		"dataType":	eval("copyDsInfo.columnInfo."+colId+".dataType"),
			 		"name":		eval("copyDsInfo.columnInfo."+colId+".name")
			};

			ngmf.insertColumn(
				copiedDs,
				colId,
			 	options
			);
		}
		/*
	 	copiedDs.setJSON( copyDsJsonData , false );

	 	//데이터 삽입: assignDs ==> assignedDs
	 	for(var i=0; i<copyDs.getRowCount(); i++){
	 		var rowStatus 	= copyDs.getRowStatus( i );
	 		var rowIndex 	= copiedDs.insertRow();
	 		copiedDs.setRowJSON( rowIndex , copyDs.getRowJSON( i ) , true );
	 		copiedDs.modifyRowStatus( rowIndex , rowStatus );
	 	}
*/	 	
	 	
		for(var i=0; i<copyDsJsonData.length; i++){
	 		var rowStatus 	= copyDsJsonData[i].rowStatus;
	 		copiedDs.setRowJSON(i, copyDsJsonData[i]);
	 		copiedDs.modifyRowStatus( i , rowStatus );
	 	}
		
		WebSquare.event.fireEvent(copiedDs, 'ondataload');
		
	} catch (e) {
		ngmf._error("[ngmf.assign] Exception :: ", e);
	}
};

/**
 * orgDs를 copyDs의 컬럼 및 로우데이터 복사한다.
 * @date 2014. 12. 10.
 * @memberOf ngmf
 * @param {Object/String} pAssignDsObj1 :: I :: N ::  :: copy 대상 데이터셋
 * @param {Object/String} pAssignDsObj2 :: I :: N ::  :: copy 할 데이터셋
 * @param {boolean} isStatusCopy :: I :: Y :: false :: rowStatus정보 copy여부
 * @return copy 성공 여부. [-1 : copy 실패 , 1 : copy 성공]
 * @update 2016.07.04 성일호 팝업에서 팝업으로 copy 허용
 * @useMobile use
 * @sampleLink grd_paging
 * @example ngmf.copy(copyDs, orgDs); // result copy 성공 여부. [-1 : copy 실패 , 1 : copy 성공]
 * @example ngmf.copy(copyDs, orgDs, true); // result copy 성공 여부. [-1 : copy 실패 , 1 : copy 성공]
 * @exampleAsIs ds1Target.Copy(ds1Origin); // return 복사된 Record 갯수. 복사할 Dataset이 존재하지 않으면 Null을 Return 합니다.
 */
ngmf.copy = function(pAssignDsObj1, pAssignDsObj2, isStatusCopy){
	try{
		if (typeof pAssignDsObj1 === "undefined" || ! pAssignDsObj1){
			ngmf._error("COPY 대상 객체[pAssignDsObj1]가 없습니다.");
			return -1;
		}
		
		if (typeof pAssignDsObj2 === "undefined" || !pAssignDsObj2){
			ngmf._error("COPY 소스 객체[pAssignDsObj2]가 없습니다.");
			return -1;
		}
		
		var copiedObj = null; //최종  객체
		var copiedDs = null; //최종 DS 객체
		
		var copyObj = null; //원본 객체
		var copyDs = null; //원본 DS 객체
		
		var pWin = null; //parent window
		var isParent = false;
		
		//parent객체를 참조해야 하는 경우
		if((typeof pAssignDsObj1 == "string" && pAssignDsObj1.indexOf("parent") > -1) ||
		   (typeof pAssignDsObj2 == "string" && pAssignDsObj2.indexOf("parent") > -1)) {
	
			var parentParam = ngmf.popupParam();
			if (parentParam && parentParam["popupID"] && WebSquare["parentForm"]) {
				pWin = WebSquare.parentForm;
			}
		}
		
		var isWframe = false;
		
		//Ds객체 정보가 id값으로 넘어온 경우
		if(typeof pAssignDsObj1 == "string"){
			var copyParams = pAssignDsObj1.split(".");
		
			//최종객체 찾기 
			if(copyParams.length == 1){ //자기자신인 경우
				copiedObj = ngmf.object(copyParams[0]);
			} else if(copyParams[0] == "parent"){ //부모창을 바라보는 경우
				isParent = true;
				copiedObj = pWin.ngmf.object(copyParams[1]);
				
				for(var i=2; i<copyParams.length; i++){
					copiedObj = copiedObj.getObj(copyParams[i]);
				}
			} else if(copyParams[0] != "parent"){ //부모창을 바라보지 않는 경우(wframe or 다른 popup)
				copiedObj = ngmf.object(copyParams[0]);
				if (typeof copiedObj !="undefined" && copiedObj  ) {
					for(var i=1; i<copyParams.length; i++){
						copiedObj = copiedObj.getObj(copyParams[i]);
					}	
				} else {
					var parentParam = ngmf.popupParam();
					if (parentParam && parentParam["popupID"] && WebSquare["parentObj"]) {
						pWin = WebSquare.parentObj;
					}
					if (typeof pWin.ngmf._getPopupWindow(copyParams[0]) != "undefined"){
						copiedObj = pWin.ngmf._getPopupWindow(copyParams[0])[copyParams[1]];
						if (copiedObj)
							for(var i=2; i<copyParams.length; i++){
								copiedObj = copiedObj.getObj(copyParams[i]);
							}
					}
				} 
			}
			
		} else { //DS객체로 넘어온 경우
			copiedObj = pAssignDsObj1;
		}
			
		//객체를 찾지 못한 경우
		if(typeof copiedObj === "undefined" || copiedObj == null || copiedObj == ""){
			ngmf._error("COPY 대상 객체["+pAssignDsObj1+"]가 없습니다.");
			return -1;
		}
		
		//Ds객체 정보가 id값으로 넘어온 경우
		if(typeof pAssignDsObj2 == "string"){
			var oriParams = pAssignDsObj2.split(".");
		
			//원본객체 찾기 
			if(oriParams.length == 1){ //자기자신인 경우
				copyObj = ngmf.object(oriParams[0]);
			} else if(oriParams[0] == "parent"){ //부모창을 바라보는 경우
				copyObj = pWin.ngmf.object(oriParams[1]);
				
				for(var i=2; i<oriParams.length; i++){
					copyObj = copyObj.getObj(oriParams[i]);
				}
			} else if(oriParams[0] != "parent"){
				copyObj = ngmf.object(oriParams[0]);
				
				if (typeof copyObj !="undefined" && copyObj  ) {
					for(var i=1; i<oriParams.length; i++){
						copyObj = copyObj.getObj(oriParams[i]);
					}
				} else {
					var parentParam = ngmf.popupParam();
					if (parentParam && parentParam["popupID"] && WebSquare["parentObj"]) {
						pWin = WebSquare.parentObj;
					}
					if (typeof pWin.ngmf._getPopupWindow(oriParams[0]) != "undefined"){
						copyObj = pWin.ngmf._getPopupWindow(oriParams[0])[oriParams[1]];
						if (copyObj)
							for(var i=2; i<oriParams.length; i++){
								copyObj = copyObj.getObj(oriParams[i]);
							}
					} 
				} 
			}
		} else { //DS객체로 넘어온 경우
			copyObj = pAssignDsObj2;
		}
		
		if(typeof copyObj === "undefined" || copyObj == null || copyObj == ""){
			ngmf._error("COPY 소스 객체["+pAssignDsObj2+"]가 없습니다.");
			return -1;
		}
		
		//ds객체 
		copiedDs = copiedObj;
		copyDs = copyObj;
		
		//컬럼제거
		if(copiedDs.cellIdList.length > 0){
			ngmf.clear(copiedDs);
		}

		var copyDsInfo	= copyDs.getInfo();
		var jsonData 	= copyDs.getAllJSON();
		var copyDsJsonData = "";

		if(ngmf.isJSON(jsonData)) {
			var jsonDataStr = JSON.stringify(jsonData);
			copyDsJsonData = JSON.parse(jsonDataStr);
		}

		for(var i=0; i<copyDs.cellIdList.length; i++){
			var colId = copyDs.cellIdList[i];
			var options = {	
			 	"dataType": copyDsInfo["columnInfo"][colId]["dataType"] ,
			 	"name":		copyDsInfo["columnInfo"][colId]["name"]
			};
			ngmf.insertColumn( copiedDs, colId, options );
		}
	 	
		//row status정보 copy여부
		if(isStatusCopy){
		 	for(var i=0; i<copyDsJsonData.length; i++){
		 		var rowStatus 	= copyDsJsonData[i].rowStatus;
		 		copiedDs.setRowJSON(i, copyDsJsonData[i]);
		 		copiedDs.modifyRowStatus( i , rowStatus );
		 	}
		 	
		 	if(isParent){
		 		parent.WebSquare.event.fireEvent(copiedDs, 'ondataload');
		 	} else {
		 		WebSquare.event.fireEvent(copiedDs, 'ondataload');
		 	}
		 	
		} else {
			copiedDs.setJSON( copyDsJsonData , false );
		} 
	 	return 0;		
	} catch (e) {
		ngmf._error("[ngmf.copy] Exception :: ", e);
		return -1;
	}
};

/**
 * orgDs를 copyDs의 컬럼 및 필터된 로우데이터만 복사한다. (데이터의 상태값은 R)
 * @date 2014. 12. 10.
 * @memberOf ngmf
 * @param {Object} pAssignDsObj1 :: I :: N ::  :: copy 대상 데이터셋
 * @param {Object} pAssignDsObj2 :: I :: N ::  :: copy 할 데이터셋
 * @useMobile use
 * @update 2016.07.18 성일호 팝업에서 Parent 간에도 복사 가능하도록 수정
 * @example ngmf.copyF(orgDs, copyDs);
 * @exampleAsIs ds2Target.CopyF(ds2Origin); // return 복사된 Record 갯수. 복사할 Dataset이 존재하지 않으면 Null을 Return 합니다.
 */
ngmf.copyF = function(pAssignDsObj1, pAssignDsObj2){
	try{
		if (typeof pAssignDsObj1 === "undefined" || ! pAssignDsObj1){
			ngmf._error("COPY 대상 객체[pAssignDsObj1]가 없습니다.");
			return -1;
		}
		
		if (typeof pAssignDsObj2 === "undefined" || !pAssignDsObj2){
			ngmf._error("COPY 소스 객체[pAssignDsObj2]가 없습니다.");
			return -1;
		}
		
		var copiedObj = null; //최종  객체
		var copiedDs = null; //최종 DS 객체
		
		var copyObj = null; //원본 객체
		var copyDs = null; //원본 DS 객체
		
		var pWin = null; //parent window
		
		//parent객체를 참조해야 하는 경우
		if((typeof pAssignDsObj1 == "string" && pAssignDsObj1.indexOf("parent") > -1) ||
		   (typeof pAssignDsObj2 == "string" && pAssignDsObj2.indexOf("parent") > -1)) {
	
			var parentParam = ngmf.popupParam();
			if (parentParam && parentParam["popupID"] && WebSquare["parentForm"]) {
				pWin = WebSquare.parentForm;
			}
		}
		
		//Ds객체 정보가 id값으로 넘어온 경우
		if(typeof pAssignDsObj1 == "string"){
			var copyParams = pAssignDsObj1.split(".");
		
			//최종객체 찾기 
			if(copyParams.length == 1){ //자기자신인 경우
				copiedObj = ngmf.object(copyParams[0]);
			} else if(copyParams[0] == "parent"){ //부모창을 바라보는 경우
				copiedObj = pWin.ngmf.object(copyParams[1]);
				
				for(var i=2; i<copyParams.length; i++){
					copiedObj = copiedObj.getObj(copyParams[i]);
				}
			} else if(copyParams[0] != "parent"){ //부모창을 바라보지 않는 경우(wframe or 다른 popup)
				copiedObj = ngmf.object(copyParams[0]);
				if (typeof copiedObj !="undefined" && copiedObj  ) {
					for(var i=1; i<copyParams.length; i++){
						copiedObj = copiedObj.getObj(copyParams[i]);
					}	
				} else {
					var parentParam = ngmf.popupParam();
					if (parentParam && parentParam["popupID"] && WebSquare["parentObj"]) {
						pWin = WebSquare.parentObj;
					}
					if (typeof pWin.ngmf._getPopupWindow(copyParams[0]) != "undefined"){
						copiedObj = pWin.ngmf._getPopupWindow(copyParams[0])[copyParams[1]];
						if (copiedObj)
							for(var i=2; i<copyParams.length; i++){
								copiedObj = copiedObj.getObj(copyParams[i]);
							}
					}
				} 
			}
			
		} else { //DS객체로 넘어온 경우
			copiedObj = pAssignDsObj1;
		}
			
		//객체를 찾지 못한 경우
		if(typeof copiedObj === "undefined" || copiedObj == null || copiedObj == ""){
			ngmf._error("COPY 대상 객체["+pAssignDsObj1+"]가 없습니다.");
			return -1;
		}
		
		//Ds객체 정보가 id값으로 넘어온 경우
		if(typeof pAssignDsObj2 == "string"){
			var oriParams = pAssignDsObj2.split(".");
		
			//원본객체 찾기 
			if(oriParams.length == 1){ //자기자신인 경우
				copyObj = ngmf.object(oriParams[0]);
			} else if(oriParams[0] == "parent"){ //부모창을 바라보는 경우
				copyObj = pWin.ngmf.object(oriParams[1]);
				
				for(var i=2; i<oriParams.length; i++){
					copyObj = copyObj.getObj(oriParams[i]);
				}
			} else if(oriParams[0] != "parent"){
				copyObj = ngmf.object(oriParams[0]);
				
				if (typeof copyObj !="undefined" && copyObj  ) {
					for(var i=1; i<oriParams.length; i++){
						copyObj = copyObj.getObj(oriParams[i]);
					}
				} else {
					var parentParam = ngmf.popupParam();
					if (parentParam && parentParam["popupID"] && WebSquare["parentObj"]) {
						pWin = WebSquare.parentObj;
					}
					if (typeof pWin.ngmf._getPopupWindow(oriParams[0]) != "undefined"){
						copyObj = pWin.ngmf._getPopupWindow(oriParams[0])[oriParams[1]];
						if (copyObj)
							for(var i=2; i<oriParams.length; i++){
								copyObj = copyObj.getObj(oriParams[i]);
							}
					} 
				} 
			}
		} else { //DS객체로 넘어온 경우
			copyObj = pAssignDsObj2;
		}
		
		if(typeof copyObj === "undefined" || copyObj == null || copyObj == ""){
			ngmf._error("COPY 소스 객체["+pAssignDsObj2+"]가 없습니다.");
			return -1;
		}
		
		//ds객체 
		copiedDs = copiedObj;
		copyDs = copyObj;
		
		//컬럼제거
		var copiedDsColArr = copiedDs.cellIdList;
		if(copiedDsColArr.length > 0){
			ngmf.clear(copiedDs);
		}

		var copyDsInfo		= copyDs.getInfo();
		var jsonData 	= copyDs.getAllFilteredJSON();
		var copyDsJsonData = "";

		if(ngmf.isJSON(jsonData)) {
			var jsonDataStr = JSON.stringify(jsonData);
			copyDsJsonData = JSON.parse(jsonDataStr);
		}

		for(var i=0; i<copyDs.cellIdList.length; i++){
			var colId = copyDs.cellIdList[i];
			var options = {
			 		"dataType":	copyDsInfo["columnInfo"][colId]["dataType"],
			 		"name":		copyDsInfo["columnInfo"][colId]["name"]
			};
			ngmf.insertColumn( copiedDs, colId, options );
		}
	 	copiedDs.setJSON( copyDsJsonData , false );
	} catch (e) {
		ngmf._error("[ngmf.copyF] Exception :: ", e);
	}
};

/**
 * 데이터(pJsonObj)의 컬럼을 자동으로 만들어주고 데이터(pJsonObj)를 삽입한다.
 * @date 2015-10-01
 * @memberOf ngmf
 * @param {Object} JSON      :: I :: N ::  :: JSON componentId
 * @param {Object} pDataSet  :: I :: N ::  :: DataCollection dataList
 * @param {String} pChkColNm :: I :: N ::  :: 체크박스용으로 추가할 컬럼명
 * @returns 없음
 * @author 이진수
 * @useMobile use
 * @example ngmf.setAutoJSON(output1, GLD.GDS_WINTITLE);
 * @exampleAsIs 신규
 */
ngmf.setAutoJSON = function(pJsonObj, pDataSet, pChkColNm){
	try{
		if(pChkColNm != undefined && pChkColNm != "undefined" && pChkColNm != ""){
			var options = {
					name		: pChkColNm,
					dataType	: "text"
			};
			//pDataSet.insertColumn(pChkColNm, options);
			ngmf.insertColumn(pDataSet, pChkColNm, options);
		}

		var loopJsonObj = null;

		if(WebSquare.util.isArray( pJsonObj ) && pJsonObj.length > 0){
			loopJsonObj = pJsonObj[0];
		}else{
			loopJsonObj = pJsonObj;
		}
		if (loopJsonObj) {
			$.each(loopJsonObj, function(key, value){
				var options = {
					name		: key,
					dataType	:"text"
				};

				//pDataSet.insertColumn(key, options);
				ngmf.insertColumn(pDataSet, key, options); 
			});

			if(WebSquare.util.isArray( pJsonObj )){
				pDataSet.setJSON( pJsonObj , false );
			}else{
				var temp = [];
				temp.push(pJsonObj);
				pDataSet.setJSON( temp , false );
			}
		} else throw new Error("소스 객체가 없습니다.");
	} catch (e) {
		ngmf._error("[ngmf.setAutoJSON] Exception :: ", e);
	}
};

/**
 * Filter된 Record를 포함한 Dataset에서 지정된 조건이 참인 Record를 찾는 Method 입니다.
 * Filter된 후 보이지 않는 데이터까지 검색할 때 사용됩니다.
 * @date 2016-02-18
 * @memberOf ngmf
 * @param {string} dsObj      :: I :: N ::    :: dataList의 ID.
 * @param {string} strCmpExpr :: I :: N ::    :: 검색할 조건식.
 * @param {string} nStart     :: I :: Y :: 0  :: 검색하고자 하는 시작 Record Index. 시작 Index는 0 입니다.
 * @param {string} nEnd       :: I :: Y :: -1 :: 검색하고자 하는 마지막 Record Index.
 * @return {number} 조건식에 맞는 Record Index.
 * 					조건식을 만족하는 Record가 없을 경우에는 -1 을 Return합니다. Row Number 최소값은 0 입니다. 실패시 Return 값은 -1 입니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.searchRowIndexNF(dsObj, "Desc =='test'");  // return [3, 5] (Desc 컬럼에 'test' 값이 존재 하는 경우) 값이 없을 때는 -1을 return
 * @exampleAsIs Edit0.Text = Ds_a.SearchRowNF("DS_COMPANY=\"TOBE\"");
 * @exampleAsIsEdit0.Text = Ds_a.SearchRowNF("DS_COMPANY=\"TOBE\"",0);


 */
ngmf.searchRowIndexNF = function (dsObj, strCmpExpr, nStart, nEnd) {
	return ngmf.searchRow(dsObj, strCmpExpr, nStart, nEnd, "NF", "index");
};

/**
 * 데이터리스트에서 필터 조건에 맞는 row의 index를 반환 합니다. 단,  Filter 된 레코드는 포함하지 않습니다.
 * @date 2016-02-18
 * @memberOf ngmf
 * @param {string} dsObj      :: I :: N ::    :: dataList의 ID.
 * @param {string} strCmpExpr :: I :: N ::    :: 검색할 조건식.
 * @param {string} nStart     :: I :: Y :: 0  :: 검색하고자 하는 시작 Record Index. 시작 Index는 0 입니다.
 * @param {string} nEnd       :: I :: Y :: -1 :: 검색하고자 하는 마지막 Record Index.
 * @return {Obejct} 조건식에 맞는 Index 배열 값.
 * 					조건식을 만족하는 Record가 없을 경우에는 -1 을 Return합니다. Row Number 최소값은 0 입니다. 실패시 Return 값은 -1 입니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.searchRowIndex(dsObj, "Desc =='test'");  // return [3, 5] (Desc 컬럼에 'test' 값이 존재 하는 경우) 값이 없을 때는 -1을 return
 * @exampleAsIs
 */
ngmf.searchRowIndex = function (dsObj, strCmpExpr, nStart, nEnd) {
	return ngmf.searchRow(dsObj, strCmpExpr, nStart, nEnd, undefined, "index");
};

/**
 * Filter된 Record를 포함한 Dataset에서 지정된 조건이 참인 Record의 JSON data를 찾는 Method 입니다.
 * Filter된 후 보이지 않는 데이터까지 검색할 때 사용됩니다.
 * @date 2016-02-18
 * @memberOf ngmf
 * @param {string} dsObj      :: I :: N ::    :: dataList의 ID.
 * @param {string} strCmpExpr :: I :: N ::    :: 검색할 조건식.
 * @param {string} nStart     :: I :: Y :: 0  :: 검색하고자 하는 시작 Record Index. 시작 Index는 0 입니다.
 * @param {string} nEnd       :: I :: Y :: -1 :: 검색하고자 하는 마지막 Record Index.
 * @return {number} 조건식에 맞는 Record Index.
 * 					조건식을 만족하는 Record가 없을 경우에는 -1 을 Return합니다. Row Number 최소값은 0 입니다. 실패시 Return 값은 -1 입니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.searchRowJSONNF(dsObj, "Desc =='test'");  // return [{rowIndex : 3, Desc : "test"},{rowIndex : 5, Desc : "test"}] (Desc 컬럼에 'test' 값이 존재 하는 경우) 값이 없을 때는 -1을 return
 * @exampleAsIs Edit0.Text = Ds_a.SearchRowNF("DS_COMPANY=\"TOBE\"");
	Edit0.Text = Ds_a.SearchRowNF("DS_COMPANY=\"TOBE\"",0);


 */
ngmf.searchRowJSONNF = function (dsObj, strCmpExpr, nStart, nEnd) {
	return ngmf.searchRow(dsObj, strCmpExpr, nStart, nEnd, "NF", "json");
};

/**
 * 데이터리스트에서 필터 조건에 맞는 row의 JSON data를 반환 합니다. 단,  Filter 된 레코드는 포함하지 않습니다.
 * @date 2016-02-18
 * @memberOf ngmf
 * @param {string} dsObj      :: I :: N ::    :: dataList의 ID.
 * @param {string} strCmpExpr :: I :: N ::    :: 검색할 조건식.
 * @param {string} nStart     :: I :: Y :: 0  :: 검색하고자 하는 시작 Record Index. 시작 Index는 0 입니다.
 * @param {string} nEnd       :: I :: Y :: -1 :: 검색하고자 하는 마지막 Record Index.
 * @return {Obejct} 조건식에 맞는 Index 배열 값.
 * 					조건식을 만족하는 Record가 없을 경우에는 -1 을 Return합니다. Row Number 최소값은 0 입니다. 실패시 Return 값은 -1 입니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.searchRowJSON(dsObj, "Desc =='test'");  // return [{rowIndex : 3, Desc : "test"},{rowIndex : 5, Desc : "test"}] (Desc 컬럼에 'test' 값이 존재 하는 경우) 값이 없을 때는 -1을 return
 * @exampleAsIs
 */
ngmf.searchRowJSON = function (dsObj, strCmpExpr, nStart, nEnd) {
	return ngmf.searchRow(dsObj, strCmpExpr, nStart, nEnd, undefined, "json");
};

/**
 * Filter된 Record를 포함한 Dataset에서 지정된 조건이 참인 첫번째 Record를 찾는 Method 입니다.
 * Filter된 후 보이지 않는 데이터까지 검색할 때 사용됩니다.
 * @date 2016-02-18
 * @memberOf ngmf
 * @param {string} dsObj      :: I :: N ::    :: dataList의 ID.
 * @param {string} strCmpExpr :: I :: N ::    :: 검색할 조건식.
 * @param {string} nStart     :: I :: Y :: 0  :: 검색하고자 하는 시작 Record Index. 시작 Index는 0 입니다.
 * @param {string} nEnd       :: I :: Y :: -1 :: 검색하고자 하는 마지막 Record Index.
 * @return {number} 조건식에 맞는 첫번째 Record Index.
 * 					조건식을 만족하는 Record가 없을 경우에는 -1 을 Return합니다. Row Number 최소값은 0 입니다. 실패시 Return 값은 -1 입니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.searchRowNF(dsObj, "Desc =='test'");  // return 3 (Desc 컬럼에 'test' 값이 존재 하는 경우) 값이 없을 때는 -1을 return
 * @exampleAsIs Edit0.Text = Ds_a.SearchRowNF("DS_COMPANY=\"TOBE\"",0);

 */
ngmf.searchRowNF = function (dsObj, strCmpExpr, nStart, nEnd) {
	return ngmf.searchRow(dsObj, strCmpExpr, nStart, nEnd, "NF");
};

/**
 * 데이터리스트에서 필터 조건에 맞는 제일 첫번째 row의 index를 반환 합니다. 단,  Filter 된 레코드는 포함하지 않습니다.
 * @date 2016-02-18
 * @memberOf ngmf
 * @param {string} dsObj      :: I :: N ::    :: dataList의 ID.
 * @param {string} strCmpExpr :: I :: N ::    :: 검색할 조건식.
 * @param {string} nStart     :: I :: Y :: 0  :: 검색하고자 하는 시작 Record Index. 시작 Index는 0 입니다.
 * @param {string} nEnd       :: I :: Y :: -1 :: 검색하고자 하는 마지막 Record Index.
 * @param {string} type       :: I :: Y :: -1 :: 타입(NF)
 * @param {string} dataType   :: I :: Y :: -1 :: 데이터타입 (index, json)
 * @return {number} 조건식에 맞는 첫번째 Record Index.
 * 					조건식을 만족하는 Record가 없을 경우에는 -1 을 Return합니다. Row Number 최소값은 0 입니다. 실패시 Return 값은 -1 입니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.searchRow(dsObj, "Desc =='test'");  // return 3 (Desc 컬럼에 'test' 값이 존재 하는 경우) 값이 없을 때는 -1을 return
 * @exampleAsIs Edit0.Text = Ds_a.SearchRow("DS_COMPANY=\"TOBE\"",0,10);
 */
ngmf.searchRow = function (dsObj, strCmpExpr, nStart, nEnd, type, dataType) {
	try {
		var retVal;
		var dsComp = ngmf.object(dsObj);

		if (typeof dsComp == "undefined") throw "해당 데이터리스트가 없습니다.";
		if (typeof strCmpExpr !="string" || strCmpExpr==null) throw "2번째 인자는 String입니다.";

		var start = typeof nStart !== "undefined" ? Number(nStart) : 0;
		var end = typeof nEnd !== "undefined" ? Number(nEnd) : dsComp.getRowCount();

    	if (start > end ) {
    		throw "nStart 가 nEnd 보다 더 큽니다.";
    	}
		var opts = strCmpExpr;

		var charCheck = /[~!\#$^&*\=+|:;?"<,.>()]/g;
		var checkDataArr = opts.replace(charCheck, " ").split(" ");
		var col_dataArr = [];
		for (var i = 0 ; i < checkDataArr.length ; i++) {
			if (checkDataArr[i].length > 0 && checkDataArr[i] != "") {
				col_dataArr.push(checkDataArr[i]);
			}
		}

		if (col_dataArr.length%2 == 0) {
			for (var i = 0; i < col_dataArr.length/2 ; i++) {
				if (typeof dsComp.getColumnIndex(col_dataArr[i*2]) == "undefined") {
					ngmf._error("필터조건에 해당 컬럼이 존재 하지 않습니다.");
					return -1;
				}
			}
		}

		ngmf.createDataList("dataDummy0001");
		var dumyComp = ngmf.object("dataDummy0001");
		for (var i = 0; i < dsComp.getColumnCount(); i++) {
			var columnInfo = dsComp.getColumnInfo(i);
			ngmf.insertColumn("dataDummy0001", columnInfo.id, {"name": columnInfo.name, "dataType" : columnInfo.dataType});
		}
		ngmf.insertColumn("dataDummy0001", "Dummy_set_row_Idx");

		var getDataObj;
		if (typeof type != "undefined" && type == "NF") {
			getDataObj = dsComp.getAllJSON();
			end = typeof nEnd !== "undefined" ? Number(nEnd) : dsComp.getTotalRow();
		} else {
			getDataObj = dsComp.getAllFilteredJSON();
		}
		for (var i = start; i < getDataObj.length; i++) {
			if (i <= end) {
				var idx = dumyComp.insertRow();
				dumyComp.setRowJSON(idx, getDataObj[i], true);
				dumyComp.setCellData(idx, "Dummy_set_row_Idx", i);
			} else {
				break;
			}
		}
		ngmf.filter("dataDummy0001", opts, true);

		if (dumyComp.getAllFilteredJSON().length < 1) {
			retVal = -1;
		}else if (typeof dataType != "undefined" && dataType == "index") {
			retVal = new Array();
			for (var i = 0 ; i < dumyComp.getAllFilteredJSON().length; i++) {
				var idx = dumyComp.getCellData(i, "Dummy_set_row_Idx");
				retVal.push(idx);
			}
		} else if (typeof dataType != "undefined" && dataType == "json") {
			retVal = new Array();
			for (var i = 0 ; i < dumyComp.getAllFilteredJSON().length; i++) {
				var idx = dumyComp.getCellData(i, "Dummy_set_row_Idx");
				var data = dsComp.getAllJSON()[idx];
				retVal.push(data);
			}
		}else {
			retVal = dumyComp.getCellData(0, "Dummy_set_row_Idx");
		}

		$w.data.remove("dataDummy0001");
		return retVal;

	} catch(e) {
		ngmf._error("[ngmf.searchRow] Exception :: ", e);
		return -1;
	}
};

/**
 * 특정 컴포넌트에 바인된 DataList 정보를 반환한다.
 * @date 2015-11-26
 * @memberOf ngmf
 * @param {String} comObjId :: I :: N :: :: callerObj 컴포넌트 아이디
 * @return {Object} dataCollection정보.
 * @author 이동규
 * @useMobile use
 * @example ngmf.getMessage(msgId);
 * @exampleAsIs
 */
ngmf.getDataCollectionId = function(comObjId) {
	try {
		var comObj = ngmf.object(comObjId);
		if ((typeof comObj !== "undefined") && (typeof comObj.getRef === "function")) {
			var ref = comObj.getRef().trim();
			if (ref !== "") {
				var refArray = ref.substring(5).split(".");
				if ((typeof refArray !== "undefined") && (refArray.length === 2)) {
					var dataObjInfo = {};
					dataObjInfo.dataMapId = refArray[0];
					dataObjInfo.columnId = refArray[1];
					return dataObjInfo;
				} else {
					return null;
				}
			} else if (comObj.getPluginName() == "gridView" && comObj.getDataList() !== "") {
				return comObj.getDataList();
			} else {
				return null;
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getDataCollectionId] Exception :: ", e);
	} finally {
		dataCollection = null;
	}
};

/**
 * 특정 컴포넌트에 바인된 DataList나 DataMap의 컬럼 이름을 반환한다.
 * @date 2015. 11. 26.
 * @memberOf ngmf
 * @param {String} comObjId :: I :: N ::  :: callerObj 컴포넌트 아이디
 * @returns {String} 컬럼명
 * @author 이동규
 * @useMobile use
 * @example ngmf.getColumnName("grd_msg");
 * @exampleAsIs 신규
 */
ngmf.getColumnName = function(comObjId) {
	try {
		var comObj = ngmf.object(comObjId);
		if ((typeof comObj !== "undefined") && (typeof comObj.getRef === "function")) {
			var ref = comObj.getRef().trim();
			if (ref !== "") {
				var refArray = ref.substring(5).split(".");
				var dataCollectionName = refArray[0];
				var columnId = refArray[1];
				if ((typeof refArray !== "undefined") && (refArray.length === 2)) {
					var dataCollection = ngmf.object(dataCollectionName);
					var dataType = dataCollection.getObjectType().toLowerCase();
					if (dataType === "datamap") {
						return dataCollection.getName(columnId);
					} else if (dataType === 'datalist') {
						return dataCollection.getColumnName(columnId);
					}
				} else {
					return "";
				}
			} else {
				return "";
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getColumnName] Exception :: ", e);
	} finally {
		dataCollection = null;
	}
};


/* 2-5 Process업무 ------------------------------------------------------------------------------------------------------------ */

/**
 * 입력된 문자열을 이용해 현재위치에서 해당 Object를 검색하여 Return 하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} strCompId :: I :: N ::  :: 검색하고자 하는 ObjectID.
 * @return {Object} strObjectID에 해당하는 Object Variable 변수.
 * @author 이동규
 * @useMobile use
 * @example ngmf.object(Button.id);
 * @exampleAsIs Object("ds3");
 */
ngmf.object = function(strCompId){
	try{
		var retObj = (Object.prototype.toString.call(strCompId).indexOf("String")>-1) ? WebSquare.util.getComponentById(strCompId):strCompId;
		if (retObj == null) retObj =  undefined; 
		return retObj;
	} catch (e) {
		ngmf._error("[ngmf.object] Exception :: ", e);
	}
	return undefined;
};

/**
 * 입력된 값 또는 수식을 검사해 적당한 값을 Return 하는 API 입니다.
 * (decode는 가변 갯수의 인자를 취하는 API로 2n+1 또는 2n (n>1)개의 인자갯수를 입력 할 수 있습니다)
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} varValue    :: I :: N ::  :: argument[0] - 비교 대상이 되는 값.
 * @param {String} varCase     :: I :: N ::  :: argument[2n] - varValue와 비교될 값.
 * @param {String} varRetValue :: I :: N ::  :: argument[2n+1] - varValue와 varCase 일치 할 경우의 return 값.
 * @param {String} varDefault  :: I :: Y ::  :: argument[2n] - varCase 중에 값이 없는 경우 return 될 값.
 * @return {String} ngmf.decode에 의해서 선택된 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.decode("1", "1", "One", "2", "Two", "Default"); // return One
 * @exampleAsIs Decode("1", "1", "One", "2", "Two", "Default"); // return One
 */
ngmf.decode = function () {
	try{
		var str = arguments[0];
		var len = arguments.length;
		var exception = "";
		var arr = [];
		var matchData = "";

		if ( len % 2 == 0) {
			exception = arguments[len-1];
			for ( var i = 1; i < len -1; i++) arr.push(arguments[i]);
			matchData = exception;
		} else {
			for ( var i = 1; i < len; i++) arr.push(arguments[i]);
		}

		for (var i = 0; i < arr.length/2 ; i++) {
			if (matchData == exception && str == arr[i*2]) {
				matchData = arr[i*2+1];
			}
		}

		return matchData;
	} catch (e) {
		ngmf._error("[ngmf.decode] Exception :: ", e);
	}
};

/**
 * 입력값들 중에 가장 큰 값을 반환하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Object} argument :: I :: N ::  :: 가변적인 갯수의 입력 값.
 * @return {String} 입력된 값들 중 가장 큰 수.
 * @author 이동규
 * @useMobile use
 * @example ngmf.greatest(1, 3, 6, 21, 13, 10);  // return 21
 * @exampleAsIs Greatest(2,3,5,7,9); // return 9
 *
 */
ngmf.greatest = function () {
	try{
		var max = arguments[0];
		for (var i = 1 ; i < arguments.length ; i++) {
			if (max < arguments[i])
				max = arguments[i];
		}

		return max;
	} catch (e) {
		ngmf._error("[ngmf.greatest] Exception :: ", e);
	}
};

/**
 * 입력값 들 중에 가장 작은 값을 되돌리는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Object} argument :: I :: N ::  :: 가변갯수의 입력 값들.
 * @return {String} 입력된 값들 중 가장 작은 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.least("a","b","c","d");  // return "a"
 * @exampleAsIs Least(2,3,5,7,9); //return2
 *
 */
ngmf.least = function () {
	try{
		var min = arguments[0];
		for (var i = 1 ; i < arguments.length ; i++) {
			if (min > arguments[i])
				min = arguments[i];
		}
		return min;
	} catch (e) {
		ngmf._error("[ngmf.least] Exception :: ", e);
	}
};

/**
 * 첫 값의 True/False 를 검사해 그 결과에 따라 두번째 또는 세번째 값을 return 하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Boolean} isBoolean :: I :: N ::  :: return 판단 값.
 * @param {String} returnA    :: I :: N ::  :: 첫번째 값이 true 일떼 반환될 값.
 * @param {String} returnB    :: I :: Y ::  :: 첫번째 값이 false 일떼 반환될 값.
 * @return {String} 판단에 따른 설정 된 값.
 * @author 이동규
 * @useMobile use
 * @example ngmf.iIf(true, "Y", "N");  // return "Y"
 * @exampleAsIs Iif(2-1=1, "True", "False"); // return "Y"
 */
ngmf.iIf = function (isBoolean, returnA, returnB) {
	try{
		var returnA = (typeof returnA != "undefined") ? returnA : "";
		var returnB = (typeof returnB != "undefined") ? returnB : "";
		return isBoolean ? returnA : returnB;
	} catch (e) {
		ngmf._error("[ngmf.iIf] Exception :: ", e);
	}
};

/**
 * 일정한 정수 범위의 난수를 구하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Number} nStart :: I :: Y :: 0 :: Random 결과로 나올 최소값.
 * @param {Number} nEnd   :: I :: Y :: 65535 :: Random 결과로 나올 최대값.
 * @return {String} 지정된 offset만큼의 개월이 더해진 입력 날짜.
 * @author 이동규
 * @useMobile use
 * @example ngmf.random(0, 10);  // return 8
 * @exampleAsIs Random(0, 100); // return 8
 */
ngmf.random = function (nStart, nEnd) {
	try{
		var result;
		nStart = nStart || 0;
		nEnd = nEnd || 65535;
		if (nStart > nEnd ){
			result ="";
		} else if (nStart == nEnd) {
			result = nStart;
		}else {
			var st = Number(nStart);
			var ed = Number(nEnd);
			var cnt = ed - st;
			if (!isNaN(st+ed)) {
				result = Math.round((Math.random() * cnt ) + st );
			}
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.random] Exception :: ", e);
	}
};

/**
 * random한 값을 리턴한다. ( 현재 시간이 홀수 이면 6자리, 짝수는 7자리)
 * @date 2014. 12. 10.
 * @memberOf ngmf
 * @return {String} random값
 * @useMobile use
 * @example ngmf.extGetWinHandle();
 * @exampleAsIs var strOrgFormNm = ngmf_GetFormID();
	var strWHandle = ngmv_FormHandle;
	if(length(trim(strWHandle)) == 0) {
		strWHandle = trim(right(ExtGetWinHandle(this),10));
	}
 */
ngmf.extGetWinHandle = function() {
	try{
		if(ngmv.formHandle == null || ngmf.trim(ngmv.formHandle).length == 0){
			return ngmf.right(String(parseInt(Math.random() * 1000000000)), 9);
		}else{
			return ngmv.formHandle;
		}
		
	} catch (e) {
		ngmf._error("[ngmf.extGetWinHandle] Exception :: ", e);
	}
};

/**
 * 입력값 형태에 따라서 길이 또는 범위를 구하는 Basic API 입니다.
 * 문자열의 길이, 배열의 크기, Binary Data의 크기등을 구합니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Object/String} value :: I :: N ::  :: 입력된 값 또는 컴포넌트id
 * @return {String} value Type에 따라 구해진 길이 또는 범위.
 * @author 이동규
 * @useMobile use
 * @example ngmf.bound("20151012");  // return 8
 * @exampleAsIs Bound( "Text" ) //return 8
 */
ngmf.bound = function (value) {
	try{
		var result = 0;
		if (typeof value == "string") {
			var isBinary;//ngmf.binToText(value);
			if (typeof isBinary != "undefined") {
				result = value.length/8;
			} else {
				result = value.length;
			}
		} else if (Array.isArray(value)) {
			result = value.length;
		} else if (typeof value == "object") {
			var cnt = 0;
			for (var i in value) {
				cnt++;
			}
			result = cnt;
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.bound] Exception :: ", e);
	}
};

/**
 * 시스템의 Mouse Cursor를 모래시계(Wait Cursor)로 설정하거나 해제하는 API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {Boolean} flag :: I :: Y :: false :: Wait Cursor로 설정할지 여부.
 * @author 이동규
 * @update 2016.06.14 이동규 커서 style 이 한번 생성후 삭제 부분 오류 수정.
 * @example ngmf.setWaitCursor(true);
 * @exampleAsIs SetWaitCursor(True);
 * @useMobile useless
 */
ngmf.setWaitCursor = function (flag) {
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.setWaitCursor : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try{
		flag = WebSquare.util.getBoolean(flag) ? true : false;

		if(flag && $('style:contains("html.wait")').length < 1) {
	 		$('<style>').text('html.wait, html.wait *{cursor:wait !important;}').appendTo('head');
			$('html').addClass('wait');
		} else if (!flag){
			if ($('style:contains("html.wait")').length > 0) {
				$('style:contains("html.wait")').remove();
			}
			$('html').removeClass('wait');
		}

		var tagIfram = document.getElementsByTagName("iframe");
		for (var i in tagIfram) {
			var iframe = tagIfram[i];
			var iframeWin = iframe.contentWindow || iframe.contentDocument;

			if(typeof iframeWin != "undefined" && iframeWin.document) {
				if (typeof iframeWin.ngmf !== "undefined")
					iframeWin.ngmf.setWaitCursor(flag);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.setWaitCursor] Exception :: ", e);
	}
};

/**
 * Message를 표현하는 DialogBox를 실행하는 API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {Object} msg     :: I :: N ::  :: Dialog Box에 메세지.
 * @param {Object} func    :: I :: Y ::  :: Dialog 콜백 함수
 * @param {Object} options :: I :: Y ::  :: Dialog Box 설정 옵션.
 *				   options.title {String} : Dialog Box의 title 값.
 *				   options.strArguemnt {String} : alert Box에 콜백 함수의 파라메타(json객체 String형식만 허용.)
 * @sampleLink scm_svcCallBasic
 * @author 이동규
 * @useMobile use
 * @update  2016.02.28 ngmf.alert -> ngmf.layerAlert // (기존)ngmf.alert 의 형식이 layer 사용 부분이 native alert 형식으로
 * 			수정에 따라 ngmf.alert 함수를 재정의 후 (기존)ngmf.alert 함수를 ngmf.layerAlert로 수정합니다.
 * @example ngmf.layerAlert("alert메세지 창", options);
 * @exampleAsIs Alert("Show Message");
 */
ngmf.layerAlert = function (msg, func, options) {
	try{
		var msgOption = {};
		msgOption.msg = msg;
		msgOption.func = func || {};

		if (typeof options !== "undefined") {
			msgOption.title = options.title || "확인창";
			msgOption.btnType = 1;
			msgOption.fullModal = WebSquare.util.getBoolean(options.fullModal) || false;
			msgOption.strArgument = options.strArgument || "";
		} else {
			msgOption.title = "확인창";
			msgOption.btnType = 1;
			msgOption.fullModal = false;
			msgOption.strArgument = "";
		}

		if (ngmf.isNull(GLD["wfm_alertBox"]) == "Y") {
			GLD.ngmf._messageBox("alert", msgOption);	
		} else {
			if (typeof GLD.ngmv.alertItem == "undefined") {
				GLD.ngmv.alertItem = [];
			}
			GLD.ngmv.alertItem.push(msgOption);
		}		
	} catch (e) {
		ngmf._error("[ngmf.layerAlert] Exception :: ", e);
	}
};

/**
 *  사용자로부터 확인/취소 선택을 입력받을수 있는 Dialog 를 실행하는 Form API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {Object} msg     :: I :: N ::  :: Dialog Box에 메세지.
 * @param {Object} func    :: I :: N ::  :: Dialog Box가 닫히면서 실행될 function(val). 
 *				  [버튼타입별 파라메터 val값]
 *				  btnType = 1 => [확인] : ["Y"],
 *				  btnType = 2 => [확인, 취소] : ["Y", "N"],
 *				  btnType = 3 => [예, 아니오, 취소] : ["Y", "N", "C"]
 * @param {Object} options :: I :: Y ::  :: Dialog Box 설정 옵션.
 *				   options.title {Number} : Dialog Box의 title 값.
 *				   options.btnType {Number} : Dialog Box의 btnType [1 : 1개버튼[확인], 2 : 2개 버튼[확인, 취소], 3 : 3개버튼[예,아니오,취소]]
 * @sampleLink grd_detailView
 * @author 이동규
 * @useMobile use
 * @update  2016.02.28 ngmf.confirm -> ngmf.layerConfirm // (기존)ngmf.confirm 의 형식이 layer 사용 부분이 native confirm 형식으로
 * 			수정에 따라 ngmf.confirm 함수를 재정의 후 (기존)ngmf.confirm 함수를 ngmf.layerConfirm로 수정합니다.
 * @update  2016.04.07 ngmf.promise.extMsgBox 함수 추가로 내부 추가 구현 작업.
 * @example 
 * @example ngmf.layerConfirm("테스트 메세지!", function(returnVal) {if(returnVal== "Y" ) {
 * @example										alert(returnVal);
 * @example									} else if(returnVal== "N") {
 * @example										alert(returnVal)
 * @example									} else { 
 * @example										alert(returnVal)
 * @example									}
 * @example	}, {title: "confirm샘플", btnType:2});
 * @exampleAsIs Confirm("Do you want to delete?");
 */	
ngmf.layerConfirm = function (msg, func, options) {
	try{
		var msgOption = {};

		msgOption.msg = msg || "";
		msgOption.func = func || {};

		if (typeof options !== "undefined") {
			msgOption.title = options.title || "확인창";
			msgOption.fullModal = WebSquare.util.getBoolean(options.fullModal) || false;
			msgOption.btnType = options.btnType || 2;
			msgOption.strArgument = options.strArgument || "";
			msgOption.iconType = options.iconType || "";
			msgOption.btnStyle = options.btnStyle || "";
			msgOption.btnPosition = options.btnPosition || "";
		} else {
			msgOption.title = "확인창";
			msgOption.fullModal =false;
			msgOption.strArgument = "";
			msgOption.btnType = 2;
		}

		GLD.ngmf._messageBox("confirm", msgOption);
	} catch (e) {
		ngmf._error("[ngmf.layerConfirm] Exception :: ", e);
	}
};

/**
 * 사용자로부터 확인/취소 선택을 입력받을수 있는 복수의 Dialog 를 실행하는 Form API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {Object} msg     :: I :: N ::  :: Dialog Box에 메세지.
 * @param {Object} func    :: I :: N ::  :: Dialog Box가 닫히면서 실행될 function(val).
 *				  [버튼타입별 파라메터 val값]
 *				  btnType = 1 => [확인] : ["Y"],
 *				  btnType = 2 => [확인, 취소] : ["Y", "N"],
 *				  btnType = 3 => [예, 아니오, 취소] : ["Y", "N", "C"]
 * @param {Object} options :: I :: Y ::  :: Dialog Box 설정 옵션.
 *				   options.title {Number} : Dialog Box의 title 값.
 *				   options.btnType {Number} : Dialog Box의 btnType [1 : 1개버튼[확인], 2 : 2개 버튼[확인, 취소], 3 : 3개버튼[예,아니오,취소]]
 * @author 이동규
 * @useMobile delete
 * @example
 * @example ngmf.multiConfirm("테스트 메세지!", function(returnVal) {if(returnVal== "Y" ) {
 * @example										alert(returnVal);
 * @example									} else if(returnVal== "N") {
 * @example										alert(returnVal)
 * @example									} else {
 * @example										alert(returnVal)
 * @example									}
 * @example	}, {title: "confirm샘플", btnType:2, fullModal : true });
 * @exampleAsIs
 */
ngmf.multiConfirm = function (msg, func, options) {
	try{
		var msgOption = {};

		if (msg.length > 1) {
			msgOption.msg = msg[0] || "";
			if (typeof GLD.ngmv.confirmItem == "undefined") {
				GLD.ngmv.confirmItem = [];
				GLD.ngmv.confirmFunc = func || {};
			}
			msg.splice(0,1);
			for (var i in msg) {
				var mMsgOption = {};
				mMsgOption.msg = msg[i];

				if (typeof options !== "undefined") {
					mMsgOption.title = options.title || "확인창";
					mMsgOption.btnType = options.btnType || 2;
					mMsgOption.strArgument = options.strArgument || "";
				} else {
					mMsgOption.title = "확인창";
					mMsgOption.strArgument = "";
					mMsgOption.btnType = 2;
				}

				GLD.ngmv.confirmItem.push(mMsgOption);
			}
		} else {
			msgOption.msg = msg[0] || "";
			msgOption.func = func || {};
		}

		if (typeof options !== "undefined") {
			msgOption.title = options.title || "확인창";
			msgOption.btnType = options.btnType || 2;
			msgOption.strArgument = options.strArgument || "";
		} else {
			msgOption.title = "확인창";
			msgOption.strArgument = "";
			msgOption.btnType = 2;
		}

		GLD.ngmf._messageBox("confirm", msgOption);
	} catch (e) {
		ngmf._error("[ngmf.confirm] Exception :: ", e);
	}
};

/**
 * @date 2015-12-03
 * @memberOf
 * @author 이동규
 * @useMobile use
 * @update  2016.04.07 ngmf.promise.extMsgBox 함수 추가로 내부 추가 구현 작업.
 */
ngmf._messageBox = function (messageType, msgOption) {
	try{
		var message = msgOption.msg || "";
		var messageType = messageType || "alert";
		var defaultTitle = null;
		var strArgument = "";
		var src = "";
		if (messageType.toLowerCase() == "alert") {
			defaultTitle = "Alert";
			src = ngmf.SWING_PATH+"/lib/comm/messageBox_alert.xml";

		} else if (messageType.toLowerCase() == "confirm") {
			defaultTitle = "Confirm";
			src = ngmf.SWING_PATH+"/lib/comm/messageBox_confirm.xml";
		} else if (messageType.toLowerCase() == "mConfirm") {
			defaultTitle = "MultiConfirm";
			src = ngmf.SWING_PATH+"/lib/comm/messageBox_confirm.xml";
		}

		if (typeof msgOption.strArgument !== "undefined") {
			strArgument = msgOption.strArgument;
		}

		var msgOpt = {
			message : message,
			func : msgOption.func || "",
			title : msgOption.title || defaultTitle,
			btnType : msgOption.btnType || 1,
			strArgument : strArgument,
			iconType : msgOption.iconType || "",
			btnStyle : msgOption.btnStyle || "",
			btnPosition : msgOption.btnPosition || ""
		};

		var options = {
			"msgType" : messageType,
			"src" : src,
			"style" : "position:absolute; top:0; left:0; width: 100%; height:100%; z-index:9001;",
			"msgOpt" : msgOpt
		};
		if (typeof fullModal !== "undefined" && WebSquare.util.getBoolean(fullModal)) {
			var win = opener || parent;
			win.WebSquare.layer.showModal();
			if (messageType == "alert") {
				win.WebSquare.util.dynamicCreate("wfm_alertBox", "wframe", options);
			} else {
				win.WebSquare.util.dynamicCreate("wfm_confirmBox", "wframe", options);
			}

		} else{
			WebSquare.layer.showModal();
			if (messageType == "alert") {
				WebSquare.util.dynamicCreate("wfm_alertBox", "wframe", options);
			} else {
				WebSquare.util.dynamicCreate("wfm_confirmBox", "wframe", options);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._messageBox] Exception :: ", e);
	}
};

/**
 * @date 2015-10-20
 * @memberOf
 * @author 이동규
 * @useMobile use
 */
ngmf._closeMessage = function (messageBoxObj, callBackFnc, rtnObj) {
	try{
		$w.hideModal();
		var parentObj = opener || parent;
		var object = "";
		var funcNm = "";
		var func = "";

		if (typeof ngmf.object(messageBoxObj.id) !== "undefined") {
			ngmf.object(messageBoxObj.id).remove();
		}

		try {
			if (typeof callBackFnc !== "undefined" && typeof callBackFnc == "function") {
				var paramJsonObj = ngmf.jsonParse(rtnObj);
				var paramArr = new Array();
				for (var i in paramJsonObj) {
					paramArr.push(paramJsonObj[i]);
				}

				callBackFnc.apply(this, paramArr);
			}
		} catch(cbE) {
			ngmf._error("[closeMessage] Exception :: 메세지 팝업 화면 콜백 오류발생!",cbE);
		}

		if (GLD.ngmv.alertItem && GLD.ngmv.alertItem.length > 0) {
			GLD.ngmf._messageBox("alert", GLD.ngmv.alertItem[0]);
			GLD.ngmv.alertItem.splice(0,1);
		}

		if (GLD.ngmv.confirmItem && GLD.ngmv.confirmItem.length > 0) {
			if (messageBoxObj.msgOpt.returnType) {

			} else {
				if (typeof GLD.ngmv.confirmReturnValue == "undefined") GLD.ngmv.confirmReturnValue = [];
				var retValue = JSON.parse(rtnObj).returnVal;
				GLD.ngmv.confirmReturnValue.push(retValue);

				if (retValue == "N") {
					GLD.ngmv.confirmItem = [];

					var returnArr = GLD.ngmv.confirmReturnValue;
					GLD.ngmv.confirmReturnValue = [];
					GLD.ngmv.confirmFunc(returnArr);
				} else {
					if (GLD.ngmv.confirmItem && GLD.ngmv.confirmItem.length >0) {
						GLD.ngmf._messageBox("confirm", GLD.ngmv.confirmItem[0]);
						GLD.ngmv.confirmItem.splice(0,1);
					}
				}
			}
		} else if (GLD.ngmv.confirmReturnValue && GLD.ngmv.confirmReturnValue.length > 0) {
			if (typeof GLD.ngmv.confirmReturnValue == "undefined") GLD.ngmv.confirmReturnValue = [];
			var retValue = JSON.parse(rtnObj).returnVal;
			GLD.ngmv.confirmReturnValue.push(retValue);

			var returnArr = GLD.ngmv.confirmReturnValue;
			GLD.ngmv.confirmReturnValue = [];
			GLD.ngmv.confirmFunc(returnArr);
		}


	} catch (e) {
		ngmf._error("[ngmf._closeMessage] Exception :: ", e);
	}
};


/**
 * page에서 주기적으로 Event가 발생되는 Timer를 설정하는 API 입니다
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} nEventId :: I :: N ::  :: Timer 설정 이벤트 키 값.
 * @param {Number} time     :: I :: N ::  :: 적용 타이머.
 * @sampleLink scm_timer
 * @author 이동규
 * @useMobile use
 * @example ngmf.setTimer("oneTime", 10000);
 * @exampleAsIs SetTimer(1,1000);
 */
ngmf.setTimer = function (nEventId, time) {
	try{
		var options = {
    		key : nEventId,
    		delay : time,
    		args :  [nEventId]
    	};

		$w.setInterval( scwin.onTimer , options );

	} catch (e) {
		ngmf._error("[ngmf.setTimer] Exception :: ", e);
	}
};

/**
 * page에 설정된 Timer이벤트를 일치한 nEvenId timer를 삭제하는 API 입니다
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} nEventId :: I :: N ::  :: Timer 삭제 이벤트 키 값.
 * @sampleLink scm_timer
 * @author 이동규
 * @useMobile use
 * @example ngmf.killTimer("oneTime");
 * @exampleAsIs KillTimer(1);
 */
ngmf.killTimer = function (nEventId) {
	try{
		$w.clearInterval( nEventId );
	} catch (e) {
		ngmf._error("[ngmf.killTimer] Exception :: ", e);
	}
};

/**
 * XML, JSON Object 를 serialize/stringfy 한다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {JSON/Object/String} value :: I :: N ::  :: XML, JSON value.
 * @return {String} serialize/stringfy 된 String.
 * @author 이동규
 * @useMobile use
 * @example ngmf.serialize({test: "test"}); //return "{"test":"test"}"
 * @exampleAsIs
 */
ngmf.serialize = function (value) {
	try{
		if (typeof value == "undefined" || !value) {
			return "";
		} 
		
		if (typeof value == "string") {
			return value;
		} else if (ngmf.isJSON(value)) {
			return ngmf.stringify(value);
		} else {
			return value;
		}
	} catch (e) {
		ngmf._error("[ngmf.serialize] Exception :: ", e);
	}
};

/**
 * 현재 화면을 다시 Loading 하는 API 입니다.
 * @date 2015-10-21
 * @memberOf ngmf
 * @param {String} screenNm    :: I :: N ::  :: 화면명
 * @param {String} callBackFnc :: I :: Y ::  :: 리로드 후 실행할 함수
 * @param {Object} rtnObj      :: I :: N ::  :: 리턴오브젝트ID
 * @sampleLink scm_svcCallAutoSearch
 * @author 이동규
 * @useMobile use
 * @update 2016.05.02 이동규 코드 리팩토닝 [중복코드 수정.]
 * @example ngmf.reload();
 * @exampleAsIs Form API.Reload();
 */
ngmf.reload = function (_screenNm, callBackFnc, rtnObj) {
	var screenNm =  "";
	try{
		if (typeof _screenNm == "undefined" || !_screenNm)
			screenNm =  scvar.__screenName;
		else 
			screenNm =  _screenNm;
		
     	if(ngmf.isMobile()){
     		if(ngmf.isPopup()){
     			location.reload();
     		} else {
	     		var iframes = GLD.document.getElementsByClassName("mobileBody");

	            if (typeof screenNm !== "undefined") {
					for ( var i = 0; i < iframes.length; i++) {
					 	var getSrc = iframes[i].src;
					 	if (getSrc.indexOf(screenNm + ".xml") > -1) {
							ifrObj = GLD.ngmf.object(iframes[i].id);
							$('#'+ifrObj.getID()).attr('src',ifrObj.getSrc());
							break;
						}
					}
	     		}else{
	     			for ( var i = 0; i < iframes.length; i++) {
					 	var getSrc = iframes[i].src;	
						for( var j=0; j < GLD.scvar.openWinData.length ; j++ ){
				       		if(iframes[i].src.indexOf(GLD.scvar.openWinData[j].url) > -1 ){
				         		if(GLD.scvar.openWinData[j].activate == "true"){
				         				ifrObj = GLD.ngmf.object(iframes[i].id);
										$('#'+ifrObj.getID()).attr('src',ifrObj.getSrc());
										break;
								}
				       		}
				     	}
					}    	
	     		}
     		}
     	} else {
    		// 2016.08.05 window 관리 통합 
    		var selectWin = ngmf.getWindow(screenNm);
    		if (!selectWin) {
    			ngmf._error(screenNm + "을 찾을수 없습니다.");
    			return;
    		}

			if (typeof callBackFnc !== "undefined" && callBackFnc.indexOf("commonInitForm") > -1) {
				var object = "";
				var funcNm = "";
				var func = "";
				//추후 고민 (reload.callBack)
				if(callBackFnc.indexOf("ngmf") > -1) {
					object = "ngmf";
					funcNm = callBackFnc.split(".")[1];
				} else if (callBackFnc.indexOf("scwin") > -1) {
					object = callBackFnc.split(".")[0];
					funcNm = callBackFnc.split(".")[1];
				} else {
					funcNm = callBackFnc;
				}
	
				if (object == "") {
					func = selectWin[funcNm];
				} else if (typeof selectWin[object] != "undefined") {
					func = selectWin[object][funcNm];
				}
	
				selectWin.ngmf._executeCommonInitForm();
				
				if (typeof func === "function") {
					func();
				}
			} else {
				//TODO. 성능측정을 위해
				/*
				var menuLogMap = {menuId : screenNm, menuINm : screenNm, startTime : new Date() };
				GLV["MENULOG"] = menuLogMap;
				*/
				//TODO. 성능측정을 위해
				//selectWin.location.reload();
				if (selectWin) {
					var formId = selectWin.scvar.__screenName;
					var preFix = "";
					var xml = "xml";
					var url = "";
					if (selectWin.location.hash.indexOf(formId) > -1) {
						var arr = selectWin.location.hash.split("/");
						for (var i = 0; i < arr.length; i++) {
							if (arr[i].indexOf(formId) > -1) {
								preFix  = arr[i-2];
								xml = arr[i-1];
								break;
							}
						}
	
						if (xml != "xml") {
							url = ngmf.SWING_PATH + "/"+ preFix + "/" + xml + "/" + formId +".xml";
						} else {
							url = ngmf.SWING_PATH + "/"+ preFix + "/xml/" + formId + ".xml";
						}
						selectWin.location.reload();
						//selectWin.$w.url(url,{"spa":true});
					} else if (selectWin.location.search.indexOf(formId) > -1) {
						var arr = selectWin.location.search.split("/");
						for (var i = 0; i < arr.length; i++) {
							if (arr[i].indexOf(formId) > -1) {
								preFix  = arr[i-2];
								xml = arr[i-1];
								break;
							}
						}
	
						if (xml != "xml") {
							url = ngmf.SWING_PATH + "/"+ preFix + "/" + xml + "/" + formId +".xml";
						} else {
							url = ngmf.SWING_PATH + "/"+ preFix + "/xml/" + formId + ".xml";
						}
						selectWin.location.reload();
						//selectWin.$w.url(url,{"spa":true});
					}
				}
			} 
		}
	} catch(e) {
		ngmf._error("[ngmf.reload] Exception :: ", e);
	}
};

/**
 * 입력한 URL을 사용하여 Internet Explorer를 실행하는 Form API 입니다.
 * @date 2015-10-21
 * @memberOf ngmf
 * @author 이동규
 * @useMobile use
 * @param {String} strURL :: I :: N ::  :: 화면URL
 * @param {Object} options :: I :: Y ::  :: poup창 파라미터 Object.
 *                 options.title : 팝업창의 제목.
 *                 options.width : 팝업창 넓이
 *                 options.height : 팝업창 높이
 *                 options.scrollbars : 팝업창 스크롤 생성 여부.
 *                 options.resizable : 팝업창 사이즈 수정 허용 여부.
 * @param {String} browserType :: I :: Y ::  :: 화면 실행 할 브라우저 타입 
 *                 [미입력 : 현재 브라우저, "IE" : IE 브라우저 , "DEFAULT" : 기본 설정 브라우저]
 * @example ngmf.execBrowser("http://ops.sktelecom.com:9000/ops/login/login.jsp");
 * @update 2016.05.03 조지용 팝업옵션 파라메터 추가
 * @update 2016.08.03 이동규 browserType 파라메터 추가
 * @update 2016.08.24 성일호 browserType 파라메터 추가(WBrowser 호출 기능 추가)
 * @exampleAsIs  ExecBrowser("http://www.tobesoft.com");
 * */
ngmf.execBrowser = function (strURL, options, browserType) {
	try{
	    if(ngmf.isMobile()) {
		    ngmf.alert("ngmf.execBrowser : 모바일환경에서 지원불가 API 입니다.");
    		return;
	    }		
		
		if (typeof strURL == "undefined" || strURL == "" || strURL == null) {
			return;
		}
		
		var popupOptions = null;
		
		if (typeof options == "string") {
			popupOptions = options;
		} else if (typeof options == "object" && ngmf.isJSON(options)) {
			var jsonDataStr = JSON.stringify(options);
			jsonData = JSON.parse(jsonDataStr);
			
			var jsonKeyArr = Object.keys(jsonData);
			
			for(var i=0; i<jsonKeyArr.length; i++){
				if(i == 0) {
					popupOptions = jsonKeyArr[i] + "=" + jsonData[jsonKeyArr[i]];
				} else {
					popupOptions += ", " + jsonKeyArr[i] + "=" + jsonData[jsonKeyArr[i]];
				}
			}
		}			
		if (typeof browserType != "undefined" && browserType) {
			ngmf.ext.promise.open("gearUtils").then(function(r) {
		        ngmf._log("opened", r);
		        var action = 'executeDefaultBrowser';
		        switch (ngmf.toUpper(browserType)) {
		        	case 'IE':
						action = 'executeInternetExplorer';
		           		break;

		        	case 'WB':
						action = 'executeWBrowser';
		           		break;
		           		
		          	default:
		            	action = 'executeDefaultBrowser';
		           		break;
		        }
		        return ngmf.ext.promise.exec("gearUtils", action, [strURL]);
		    }, function(e) {
		        ngmf._error("open error", e);
				return new Error(e);
		    }).then(function(r) {
		        ngmf._log("exec result : ", r);
		    }, function(e) {
		    	ngmf._error("exec error", e);
		    }); 
		} else {
			window.open(strURL, "", popupOptions);
		}
	} catch (e) {
		ngmf._error("[ngmf.execBrowser] Exception :: ", e);
	}
};

/**
 * 팝업화면의 타이틀을 정의하는 FormAPI 입니다.
 * @date 2015-11-24
 * @memberOf ngmf
 * @author 이동규
 * @useMobile use
 * @param {String} screenNm :: I :: N ::  :: 화면명
 * @param {String} title    :: I :: N ::  :: 화면타이틀
 * @example ngmf.popupTitle(screenNm, title);
 * @exampleAsIs
 */
ngmf.popupTitle = function (screenNm, title) {
	try{
		var titleDom = parent.document.getElementById(screenNm +"_header_title");
		if (ngmf.isNull(titleDom) == "N" ) {
			titleDom.innerText = title;
		}
	} catch (e) {
		ngmf._error("[ngmf.popupTitle] Exception :: ", e);
	}
};

/**
 * 팝업화면의 파라메터를 정의하는 API 입니다.
 * @date 2015-11-24
 * @memberOf ngmf
 * @author 이동규
 * @useMobile use
 * @update 2016.05.09 이동규 팝업화면일 경우 getPopupParam 처리 로직 수정.
 * @param {String} paramId :: I :: N ::  :: 파라메터id
 * @example ngmf.popupParam(paramId);
 * @update 2016.07.01 성일호 WebSquare["parentForm"] 추가 => 팝업을 호출한 FORM Window 객체 할당
 * @exampleAsIs
 */
ngmf.popupParam = function (paramId, openScwin) {
	var returnValue = null;
	try{
		if (ngmf.isPopup()) {
			requires("uiplugin.popup");
			var paramJSON  = ngmf.jsonParse(WebSquare.util.getPopupParam());
			if (typeof paramId !== "undefined" && paramId) {
				returnValue = (typeof paramJSON[paramId] != "undefined") ? paramJSON[paramId] : ""; 
			} else {
				returnValue = paramJSON;
			}
			if (!returnValue)  returnValue = {};
			if (typeof returnValue == "object") {
				returnValue["popupID"] = WebSquare.net.getParameter("popupID");
				returnValue["parentObj"] = opener || parent;
				if (WebSquare["parentObj"] && !WebSquare["parentForm"]) {
					var parentFormId = WebSquare.parentObj.WebSquare.util.getPopup(returnValue["popupID"])["params"];
					if (typeof parentFormId != "undefined" && parentFormId != WebSquare.parentObj.scvar.__screenName) {
						WebSquare["parentForm"] = WebSquare.parentObj.WebSquare.util.getPopupWindow(parentFormId);
					} else {
						WebSquare["parentForm"] = WebSquare["parentObj"];
					} 				
				}
				returnValue["parentForm"] = WebSquare["parentForm"];	
			}
		} else if (typeof openScwin == "object" && typeof openScwin.$w !="undefined" && typeof openScwin.$w.isWFramePopup == "function" && openScwin.$w.isWFramePopup()) {
			requires("uiplugin.popup");
			var paramObj = ngmf.jsonParse(openScwin.$w.getPopupParam());
			var paramJSON = paramObj["argument"];
			paramJSON["callbackFunc"] = paramObj["callbackFunc"];
			paramJSON["parentScreen"] = paramObj["parentScreen"];
			if (typeof paramId !== "undefined" && paramId) {
				returnValue = (typeof paramJSON[paramId] != "undefined") ? paramJSON[paramId] : ""; 
			} else {
				returnValue = paramJSON;
			}
			if (!returnValue)  returnValue = {};
			if (typeof returnValue == "object") {
				returnValue["popupID"] = openScwin.$w.getPopupId();
				returnValue["parentObj"] = window;
				if (returnValue["parentObj"]) {
					var parentFormId = returnValue["parentObj"].WebSquare.util.getPopup(returnValue["popupID"])["params"];
					if (typeof parentFormId != "undefined" && parentFormId != returnValue["parentObj"].scvar.__screenName) {
						returnValue["parentForm"] = returnValue["parentObj"].WebSquare.util.getPopupWindow(parentFormId);
					} else {
						returnValue["parentForm"] = returnValue["parentObj"];
					} 				
				}
			}			
		}
	} catch (e) {
		ngmf._error("[ngmf.popupParam] Exception :: ", e);
	}
	return returnValue;
};

/**
 * 팝업화면의 확인 API.
 * @date 2016-02-24
 * @memberOf ngmf
 * @author 이동규
 * @useMobile use
 * @update 2016.04.01 이동규
 * 		  팝업 확인 getParameter("popupID")로 수정 (내부 엔진 오류 회피)
 * @return {Boolean} 팝업 인지 아닌지 확인 유무 [true/false]
 * @example ngmf.isPopup();
 * @exampleAsIs PopupDiv.IsPopup();
 */
ngmf.isPopup = function(openScwin) {
	try {
		if ($w) {
			var popupId = $w.getParameter("popupID");
			if (typeof popupId == "undefined" || !popupId) {
				 if (typeof openScwin == "object" && typeof openScwin.$w !="undefined" && typeof openScwin.$w.isWFramePopup == "function" && openScwin.$w.isWFramePopup()) return true; 
				 else return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	} catch(e) { 
		ngmf._error("[ngmf.isPopup] Exception :: ", e);
	}
};

/**
 * 입력한 URL을 사용하여 Internet Explorer를 실행하는 Form API 입니다.
 * @date 2015-10-21
 * @memberOf ngmf
 * @param {String} popupId :: I :: N ::  :: 팝업창의 ID
 * @param {String} url     :: I :: N ::  :: 팝업창에서 로드할 화며의 URL
 * @param {Object} options :: I :: Y ::  :: poup창 파라미터 Object.
 *                 options.title : 팝업창의 제목.
 *                 options.type : 팝업형태 ("window" : 윈도우 팝업, "litewindow" :레이어 팝업), 미설정시 기본은 레이어 팝업.
 *                 options.width : 팝업창 넓이
 *                 options.height : 팝업창 높이
 *                 options.top : 팝업창 Position(top)
 *                 options.left : 팝업창 Position(left)
 *                 options.scrollbars : 팝업창 스크롤 생성 여부.
 *                 options.resizable : 팝업창 사이즈 수정 허용 여부.
 *                 options.modal : modal 여부
 *                 options.fullModal : 전체화면 modal 여부
 *                 options.popupParam : 팝업 창에 전달할 파라미터
 *                 options.popupParam.closeCallBackFncName : 팝업 창이 닫힐 때 호출되는 콜백 함수.
 * @param {String} parentScreen :: I :: N ::  :: 부모창 스크린명
 * @param {Boolean} modal       :: I :: Y ::  :: 모달팝업 여부
 * @param {Boolean} allowDup       :: I :: Y ::  :: 팝업 중복 OPEN 허용여부
 * @sampleLink ngmf.openPopup
 * @author 이동규
 * @useMobile use
 * @update 이동규 16.03.09  openPopup width / heigth 기본 값 셋팅이 "400" String Type 으로 설정 되어 있는 부분을 NumberType으로 수정합니다.
 * @updata 이동규 2016.03.22 subWindow 와 팝업이 동일한 formId 화면일 경우 화면의 getWindow에서 subWindow만 찾는 문제점을 수정.
 * @update 이동규 16.03.24
 *		  1. 스튜디오에서 head에 팝업화면의 meta_width / meta_heigth를 지정한 경우, 설정 한 사이에 맞게 팝업화면을 생성하는 부분 추가.
 *	      2. 팝업생성 위치는 무조건 화면 중앙으로 수정.
 * @update 이동규 16.03.29
 *		  1. document.body 의 높이와 너비가 스크롤이 생겼을 경우, modal 처리 Div 크기 px 계산추가.
 *		  2. 팝업 생성 위치 top, left 수정. (현 위치의 top, left 중앙)
 * @update 이동규 2016.04.01 내부 함수 호출 ngmf.openPopup -> ngmf._openPopup 으로 수정.
 * @update 이동규 2016.04.26 zoom에 따른 popup Div 처리 부분 css 수정. position:fixed
 * @update 이동규 2016.05.17 팝업화면 height, width 2px 오차 수정.
 * @update 2016.05.24 이동규 모바일 공통 변경수정.
 * @update 2016.07.01 성일호 parentScreen 사용하지 않도록 수정 
 * @exampleAsIs
 */
 ngmf._openPopup =  function (id, url, options, parentScreen, modal, allowDup, wframeMode) {
	try{
		var parentWindow = null;
		if (ngmf.getFormID().startsWith("main")) {
			parentWindow = window;
		} else if (ngmf.isPopup()) {
			//팝업에서 팝업 열경우  GLV.G_ACTIVE_FORMID 설정
			if (GLV.G_ACTIVE_FORMID != scvar.__screenName ) GLV.G_ACTIVE_FORMID = scvar.__screenName; 
			parentWindow = ngmf.getWindow(WebSquare.parentObj.scvar.__screenName);
		} else if (ngmv.isWindowPopup) {
			parentWindow = window;
		} else {
			parentWindow = ngmf.getWindow(scvar.__screenName);
		}
		
		if ((typeof parentWindow == "undefined" || parentWindow == null)) {
			parentWindow = window;
			if (ngmf.isMobile()) {
				var realParentWindow = parentWindow;
				while(parentWindow.ngmf.isPopup()) {
					parentWindow = parent.window;
					realParentWindow = parentWindow;
				}	
			}
		}
		
		var openStyle = ngmf.jsonParse(options.openStyle);
		var popupRatio = null;
		var initWidth = 400;
		var initHeight = 400;
		var parentBodyWidth = $(parentWindow.document.body).outerWidth();
		var parentBodyHeight = $(parentWindow.document.body).outerHeight();
		var metaUrl = url; //단말기에서 팝업오픈시 절대주소를 사용시 경로를 찾아오지 못함 
		
		if(ngmf.isMobile()){
			initWidth  = (ngmf.getDeviceType() == "T") ? initWidth : parentBodyWidth;
			initHeight = (ngmf.getDeviceType() == "T") ? initHeight : parentBodyHeight;
			metaUrl = GLV.G_MOBILECONNURL + metaUrl;
			metaUrl = ngmf.replace(metaUrl, "/websquare/", "/");
		} 
		
		var width = parseInt(options.width) || initWidth;
		var height = parseInt(options.height) || initHeight;

		var left = parseInt(options.left) || -1;
		var top = parseInt(options.top) || -1;
		var param = ngmf.serialize(options["xml"]) || "";
		
		//var screenId = parentScreen.replace("__popup_formId__", "");
		if (typeof openStyle != "undefined" && openStyle.autoSize) {
			try {
				var metaDoc = WebSquare.xml.load(metaUrl);
				if(metaDoc) {
					var headElem = metaDoc.getElementsByTagName("head");
					if(headElem && headElem.length > 0) {
						var tmpHeight = parseInt(headElem[0].getAttribute("meta_height"),10);
						var tmpWidth = parseInt(headElem[0].getAttribute("meta_width"),10);
						if (!isNaN(tmpHeight) && tmpHeight > 0){
							height = tmpHeight + 45; // 최대 845(크기) +43(title) + 2(간격 위아래 1) = 890
							if(tmpWidth > 1440) {
								popupRatio = { 
									baseWidth : tmpWidth,
									baseHeight : tmpHeight
								};

								tmpHeight = tmpHeight * 1430 / tmpWidth+1;
								tmpWidth = 1430;
								height = tmpHeight + 45;
							} 
							
							if( height > 890 ) {
								if( !popupRatio ) {
									popupRatio = { 
										baseWidth : tmpWidth,
										baseHeight : tmpHeight
									};
								}

								tmpWidth = tmpWidth * 843 / tmpHeight;
								height = 888;
							}

							ngmf._debug("popupHeight changes mata_height("+ tmpHeight + "px).");
						} else {//메타 데이터가 없을 경우.
							if ((height + 45) > 890) {
								height = 888;
							} else {
								height = height + 45;
							}
						}
						if (!isNaN(tmpWidth) && tmpWidth > 0) {
							width = tmpWidth;
							ngmf._debug("popupWidth changes mata_width("+ tmpWidth + "px).");
						}
					}
				}
			} catch(mataE) {
				
			}
		} else {
			if ((height + 45) > 890) {
				height = 888;
			} else {
				height = height + 45;
			}
		}

		if (top == -1) {
			var scrollTop = 0; 
			var fullheight = 0;
			var fltTop = 0;
			if (ngmf.isPopup()) {
				fullheight = $(parentWindow.document.body).outerHeight();
				
				if(ngmf.isMobile()){
					fullheight = Math.min(fullheight, GLV.contHeight);
				}
				fltTop = (fullheight/2 - height/2);
			} else {
				fullheight = $(document.body).outerHeight();
				
				if(ngmf.isMobile()){
					fullheight = Math.min(fullheight, GLV.contHeight);
				}
				fltTop = (fullheight/2 - height/2);
			}
			if (parentWindow.document && $(parentWindow.document.body).scrollTop() > 0 ) {
				scrollTop = $(parentWindow.document.body).scrollTop();
			}			
			top = fltTop + scrollTop;
			
		}
		
		if (left == -1) {
			var fullWidth = 0;
	        var fltLeft = 0;
	        var scrollLeft = 0;
			if(ngmf.isPopup()) {
				fullWidth = $(parentWindow.document.body).outerWidth();
	        	fltLeft = fullWidth/2 - width/2;
			} else {
				fullWidth = $(document.body).outerWidth();
	        	fltLeft = fullWidth/2 - width/2;
			}
			if (parentWindow.document && $(parentWindow.document.body).scrollLeft() > 0 ) {
				scrollLeft = $(parentWindow.document.body).scrollLeft();
			}
	        left = fltLeft + scrollLeft;
		}
		requires("uiplugin.popup");
		var popupOptions = {
			id : id,
			type : options.type || "litewindow",
			width : (width  + 2) +"px",
			height : (height + 2) +"px",
			top : top,
			left : left,
			popupName : options.title || " ",
			//modal : options.modal || false,
			modal : false,
			useIFrame : options.useIFrame || true,
			style : "",
			resizable : true,
			status : false,
			menubar : false,
			scrollbars : options.scrollbars || false,
			closeAction : "ngmf._closeAction", 
			xml : param,
			srcData :"",
			destData : ""
		};
		if (typeof wframeMode != "undefined" && WebSquare.util.getBoolean(wframeMode)) {
			popupOptions["type"] = "window";
			popupOptions["frameMode"] = "wframe";
		}
		 if (ngmf.isMobile()) {
			popupOptions.buttonInfo = {
					"alignment" : "left",
					"buttons" : [
						//{"value" : "btn_related", "clickAction" : "ngmf._popActRelatedMenu"},//연관버튼 //2016.06.27 연관메뉴 화면별 정의하기로 변경 
						{"value" : "btn_quick1", "clickAction" : "ngmf._popActCustRegist"}, //고객인증
						{"value" : "btn_quick2", "clickAction" : "ngmf._popActRefresh"} //리프레쉬
					]};
			popupOptions.top = (popupOptions.top < 0) ? 0 : popupOptions.top;
			popupOptions.left = (popupOptions.left < 0) ? 0 : popupOptions.left;
			popupOptions.height = (ngmf.toInteger(popupOptions.height) > (parentBodyHeight)) ? (parentBodyHeight) : popupOptions.height;    
			popupOptions.width = (ngmf.toInteger(popupOptions.width) > (parentBodyWidth)) ? parentBodyWidth : popupOptions.width;    
		} else if (!popupOptions.id.startsWith("lovPop")) {
			popupOptions.buttonInfo = {
					"alignment" : "left",
					"buttons" : [
						//{"value" : "btn_related", "clickAction" : "ngmf._popActRelatedMenu"},//연관버튼 //2016.06.27 연관메뉴 화면별 정의하기로 변경 
						{"value" : "btn_quick1", "clickAction" : "ngmf._popActCustRegist"}, //고객인증
						{"value" : "btn_quick2", "clickAction" : "ngmf._popActRefresh"}, //리프레쉬
						{"value" : "btn_quick3", "clickAction" : "ngmf._popActHelp"}, //HELP
						{"value" : "btn_quick4", "clickAction" : "ngmf._popActMinimize"} //최소화
					]};
		}
		
		if (GLV.G_POPUPZ_INDEX > 8998) {
			GLV.G_POPUPZ_INDEX = 9000;
		}
		if (typeof parentWindow.WebSquare.uiplugin.popup._zIndex == "undefined") parentWindow.WebSquare.uiplugin.popup._zIndex  = GLV.G_POPUPZ_INDEX;

		if (GLV.G_POPUPZ_INDEX <= parentWindow.WebSquare.uiplugin.popup._zIndex) {
			GLV.G_POPUPZ_INDEX = parentWindow.WebSquare.uiplugin.popup._zIndex + 1;
		} 
		//2016.07.0 성일호 추가 :::: 현재 호출하는 화면 FormID를 팝업객체 전달한다. 동일 id가 있을경우  
		var popupParams = scvar.__screenName || ngmf.getFormID();
		var popupParent = null;
		var popupUrl = url;
		if (typeof options.fullModal !== "undefined" && WebSquare.util.getBoolean(options.fullModal)) {
			//var win = opener || parent;
			//popupParent = win.top;
			//popupParent = GLD; 
			popupParent = window.top;
		} else{
			popupParent = parentWindow;
			if (popupRatio) {
				popupUrl = url+"&popupRatio="+popupRatio.baseHeight+"|"+popupRatio.baseWidth;
			} 
		}
		if (typeof allowDup != "undefined" && allowDup)
			popupOptions["id"] = popupParent.ngmf._getPopupId(popupOptions["id"]);
		else if (popupParent["scvar"] && popupParent["scvar"]["__screenName"] == popupOptions["id"] )
			popupOptions["id"] = popupOptions["id"] + "0";
		
		if(modal) {
			var isDiv = ((popupParent.$("#"+popupOptions.id+"_modal").length > 0) ? true : false);
			if (!isDiv) {
				var modalDiv = popupParent.document.createElement("div");
				modalDiv.setAttribute("id", popupOptions.id+"_modal");
				modalDiv.setAttribute("style", "z-index:"+  GLV.G_POPUPZ_INDEX++ +";width:100%;height:100%;top:0;left:0;position:fixed;background-color: #000; opacity: .34;  filter: alpha(opacity=34);");
				popupParent.document.body.appendChild(modalDiv);
			}
		}
		popupParent.WebSquare.util.openPopup(popupUrl,  popupOptions, popupParams);
		popupParent.WebSquare.uiplugin.popup._zIndex = GLV.G_POPUPZ_INDEX;
		popupParent.ngmf.object(popupOptions.id).setStyle("z-index", GLV.G_POPUPZ_INDEX++);
		
		//wframe이 아닌경우 popupCnt 증가
		if(ngmf.isMobile()){
			if (typeof wframeMode == "undefined" || !WebSquare.util.getBoolean(wframeMode)) {
				GLV.iframePopCnt++;
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._openPopup] Exception :: ", e);
	}
};

/**
 * 팝업 닫기 시, 현재까지 작업 데이터 변환 후 닫기수행
 * @date 2015-10-21
 * @memberOf ngmf
 * @param {String} popupId :: I :: N ::  :: 팝업ID
 * @author 이동규
 * @useMobile use
 * @example ngmf._closeAction(popupId);
 * @update 2016.02.24 getElementsByTagName 오류 수정
 * @update 2016.03.10 이동규 promise.dialog 일 경우 promise.resolve 수행작업.
 * @update 2016.03.30 이동규 
 * 					1. openedWin 구현 ngmf._callbackWindow로 수정.
 * 					2. 내부 lov callBack 호출 수정.
 * @update 2016.04.12 이동규 입력값에 포커스가 들어가있는 경우 blur 처리 후 화면닫기 부분 수정.
 * @update 2016.04.21 이동규 화면을 닫을 경우 reutrn 값이 true 일 경우만 닫도록 재수정( false 혹은 undefined일경우 닫지 않는다.) : 이미애실장
 * @update 2016.05.24 이동규 모바일 공통 변경수정.
 * @update 2016.07.05 성일호 팝업 기능 재정의
 * @update 2016.09.19 이동규 팝업 화면 닫을 때 그리드의 editMode 상태 체크 추가.
 * @exampleAsIs
 */
ngmf._closeAction = function(popupId) {
	var callAction = true;
	try{ 
		var openedPopup = WebSquare.util.getPopup(popupId);
		var openedWin = null;
		var mdiId = null;
		var isIframe = true;
		if (openedPopup && openedPopup["options"]["frameMode"] != "iframe" ) {
			isIframe = false;
			openedWin = window[popupId + "_wframe"]["scope"];
		} else {
			openedWin = WebSquare.util.getPopupWindow(popupId);
		}
		
		var popupWindow = window ;
		if (openedPopup && typeof  openedPopup["__notCloseAction"] != "undefined" &&  openedPopup["__notCloseAction"] ) {
			callAction = false;
		}
		
		function _callActivate ( cWin, pWin ) {
			if (callAction && callAction) cWin.scwin.commonActivate(popupId);
		}

		try {
			// X 버튼 클릭시
			if (callAction &&  typeof openedWin != "undefined" && openedWin ) {
				if (openedWin["ngmv"] && openedWin["ngmv"]["windowID"])
					mdiId = openedWin["ngmv"]["windowID"].substr(1,5);
				//팝업 닫기 시, 현재까지 작업 데이터 변환 후 닫기수행.
				if (isIframe) {
					if(openedWin.document.activeElement) {
						openedWin.document.activeElement.blur();
						//업무화면에 그리드가 존재시 그리드의 editMode 상태를 endEdit로 변경.[UI-2928]
                    	var gridCnt = openedWin.$(".w2grid:wq");
                    	for (var i =0; i < gridCnt.length; i++) {
                    		var grdObj = openedWin.ngmf.object(gridCnt[i].id);
                    		if (grdObj && grdObj.editMode) {
                    			grdObj._endEdit();
                    		}
                    	}
					}  
					// 배치 실행중일 경우 팝업 닫히지 않게...
					if (ngmf._checkFormBatch(popupId)) {
						ngmf._debug("[_closeAction("+popupId+") debug..]   배치 실행중!!!!");
						return false;
					}
					
					if(openedWin["scwin"] && typeof openedWin["scwin"]["commonCloseForm"] == "function") { 
						var closeFlag = openedWin.scwin.commonCloseForm();
						if (typeof closeFlag == "undefined" || closeFlag === false) {
							ngmf._debug("[_closeAction("+popupId+") debug..]   commonCloseForm Not True!!!!");
							return false;
						} 
					}
					
					openedWin.ngmf.resizePopup({},true);
					GLV["G_PRE_FORMID"] = popupId ;
					var popupObj = openedWin.ngmf.popupParam();
					var callBackWindow = null;
					if (openedWin.WebSquare["parentForm"]){
						callBackWindow = openedWin.WebSquare["parentForm"] ; 
						
						if (GLV.G_ACTIVE_FORMID == popupId && callBackWindow["scvar"]) GLV.G_ACTIVE_FORMID = callBackWindow["scvar"]["__screenName"];
						
						if (typeof callBackWindow == "undefined" && ngmf.isMobile()) {
							callBackWindow = window;
						}
						if (callBackWindow) {
							if (callBackWindow["scwin"] &&  typeof callBackWindow["scwin"]["commonActivate"] == "function" ) {
								callBackWindow.scwin.commonActivate(popupId);
							}
							if(popupObj["callbackFunc"] && popupObj["callbackFunc"].startsWith("__ngmf_callback__")) {
								var func = callBackWindow.ngmf._removeCallbackFunc(popupObj.callbackFunc);
								if (func && func.isPromiseCallback) {
									if (func.isLov) {
										if (typeof openedWin["scvar"]["selectLovRtnObj"] != "undefined" && openedWin["scvar"]["selectLovRtnObj"].length > 0) {
											func(openedWin["scvar"]["uniqueKey"], openedWin["scvar"]["selectLovRtnObj"]);
										} else {
											func(openedWin["scvar"]["uniqueKey"], "");	
										}
									} else {
										func("", popupId);
									}
								}
							}
						} 
						
					}
				} else {
					GLV["G_PRE_FORMID"] = popupId ;
					var callBackWindow = null;
					if (openedPopup.params != scvar.__screenName) {
						callBackWindow =  WebSquare.util.getPopupWindow(openedPopup.params);
					} else {
						callBackWindow = popupWindow;
					} 
					var popupObj = JSON.parse(openedPopup.options.xml);
					if (typeof callBackWindow == "undefined" && ngmf.isMobile()) {
						callBackWindow = window;
					}
					if (callBackWindow) {
						if (GLV.G_ACTIVE_FORMID == popupId && callBackWindow["scvar"] ) GLV.G_ACTIVE_FORMID = callBackWindow["scvar"]["__screenName"];
						
						if (callBackWindow["scwin"] &&  typeof callBackWindow["scwin"]["commonActivate"] == "function" ) {
							callBackWindow.scwin.commonActivate(popupId);
						}
						if(popupObj["callbackFunc"] && popupObj["callbackFunc"].startsWith("__ngmf_callback__")) {
							var func = callBackWindow.ngmf._removeCallbackFunc(popupObj.callbackFunc);
							if (func && func.isPromiseCallback) {
								if (func.isLov) {
									if (typeof openedWin["scvar"]["selectLovRtnObj"] != "undefined" && openedWin["scvar"]["selectLovRtnObj"].length > 0) {
										func(openedWin["scvar"]["uniqueKey"], openedWin["scvar"]["selectLovRtnObj"]);
									} else {
										func(openedWin["scvar"]["uniqueKey"], "");	
									}
								} else {
									func("", popupId);
								}
							}
						}
					} 
					
				}
			} 
		} catch (e) {
			ngmf._error("[ngmf._closeAction] Exception :: ", e);
		} 
		
		if (popupWindow.document.getElementById(popupId+"_modal") !== null) {
			popupWindow.$("#"+popupId+"_modal").remove();
		}  

		if ( popupWindow.$(".w2popup_window").length  == 1 &&  popupWindow.$(".w2popup_window")[0].id == popupId) {
			GLV.G_POPUPZ_INDEX = 8000;
			popupWindow.WebSquare.uiplugin.popup._zIndex = -1;
		}
		
		// 모바일일 경우 플러그인 호출 함수
		if( ngmf.isMobile() && typeof GLD.scwin.closePopupViewport == "function"){
			GLD.scwin.closePopupViewport();
		}
		
		if(ngmf.isMobile()){
			if (openedPopup && openedPopup["options"]["frameMode"] == "iframe" ) {
				GLV.iframePopCnt--;
			}
		}
		ngmf._closePopupForce(popupId);
		if (scvar.__screenName.startsWith("main")) {
			ngmf._removeWindowInfo(popupId, true,"main");
		} else {
			if (mdiId) ngmf._removeWindowInfo(popupId, true,mdiId);
			else  ngmf._removeWindowInfo(popupId, true);	
		}
	} catch (e) {
		ngmf._error("[ngmf._closeAction] Exception :: ", e);
	}

	return true;
};

/**
 * 입력한 URL을 사용하여 Internet Explorer를 실행하는 Form API 입니다.
 * @date 2015-10-21
 * @memberOf ngmf
 * @param {String} screenNm     :: I :: N ::  :: 윈도우화면을 생성할 화면명
 * @param {Object} relativeData :: I :: Y ::  :: poup창 파라미터 Object.
 * @param {Object} newWindowObj :: I :: Y ::  :: 생성할 화면id
 * @param {Object} strArg       :: I :: Y ::  :: 파라메터(string, json)
 * @param {String} strFunction       :: I :: Y ::  :: Window 설정 함수명
 * @param {String} openAction       :: I :: Y :: selectWindow :: existWindow : id가 동일한 윈도우가 떠있으면 그 윈도우를 사용하여 다시 표시 / newWindow : 항상 새로운 창을 생성 / selectWindow : id가 동일한 창이 있으면 그 윈도우를 선택 
 * @param {Boolean} _notFocusWin  :: I :: Y :: "" :: true 일경우 화면을 선택하지 않음
 * @author 이동규
 * @useMobile use
 * @update 2016.04.15 이동규 화면 닫기 버튼 클릭시 scwin.commonCloseForm 함수 호출 리턴값이 true 일 경우 만 화면을 닫습니다.
 * @update 2016.04.28 이동규 windowMDI 최대창, 최소화 버튼 수정 [최대창 삭제, 최소화 기능추가]
 * @update 2016.04.29 이동규 코드 리팩토닝 [분기 로직 수정.]
 * @update 2016.05.02 이동규 코드 리팩토닝 [중복코드 수정.]
 * @update 2016.05.09 이동규 코드 리팩토닝 [if문 에러발생 의심부분 수정.]
 * @update 2016.05.11 이동규 북마크 작업추가.
 * @update 2016.06.24 이동규 getWindow 통합작업.
 * @update 2016.07.06 성일호 newWindowObj 있을시 메뉴에서 menuCd로  DATA 찾도록 처리
 * @update 2016.07.20 성일호 strArg, strFunction 처리 ngmf._executeOnLoadCompleted 로 이관 (SPA 환경에서 문제됨)
 * @update 2016.09.19 이동규 closeWindow시 그리드 editMode 체크 로직 추가.
 * @example ngmf.createMDI(jsonObj.screenNm);
 * @exampleAsIs
 */
ngmf.createMDI = function(screenNm, relativeData, newWindowObj, strArg, strFunction, openAction, _notFocusWin) {	
	return ngmv.mainTop.ngmf._createMDI(screenNm, relativeData, newWindowObj, strArg, strFunction, openAction, _notFocusWin) ;
};

ngmf._createMDI = function(screenNm, relativeData, newWindowObj, strArg, strFunction, _openAction, _notFocusWin) {
 	try{
 		var openAction = _openAction||"selectWindow"; 
 		// 성능측정을 위해 개발기만 처리함 if (GLV.G_DEVFG != "L")
 		/*
		if (GLV.G_DEVFG != "L" && typeof GLV.MENULOG =="undefined" && !GLV.MENULOG) {
			GLV.MENULOGLIST = [];
		} 
		*/
		var matchData = null;
		if(typeof newWindowObj !== "undefined" && newWindowObj["menuCd"] && newWindowObj["screenNm"]) {
			var menuCdIdx = [];
			if ( newWindowObj["menuCd"]) menuCdIdx = dlt_MenuList.getMatchedIndex("menuCd", newWindowObj["menuCd"]);
			if (menuCdIdx.length == 0) {
				menuCdIdx = dlt_MenuList.getMatchedIndex("screenNm", newWindowObj["screenNm"]);
			}
			if (menuCdIdx.length > 0) {
				matchData = dlt_MenuList.getRowJSON(menuCdIdx[0]);
			} else {
				matchData = newWindowObj;
				
				//메뉴등록함
				var menuObj = {
					menuCd : newWindowObj.menuCd,
					menuNm : newWindowObj.menuNm,
					pageUrl : newWindowObj.pageUrl,
					screenNm : newWindowObj.screenNm,
					hide : true,
					pageSize : newWindowObj.pageSize
				};
				menuCdIdx = dlt_newMenuList.getMatchedIndex("menuCd", newWindowObj["menuCd"]);
				if (menuCdIdx.length > 0) {
					var idx = menuCdIdx[0]; 
					menuObj["parentMenu"] = dlt_newMenuList.getCellData(idx, "parentMenu"); 
					dlt_newMenuList.setRowJSON(idx, menuObj, true);
				} else {
					var idx = dlt_newMenuList.insertRow();
					menuObj["parentMenu"] = menuObj["menuCd"];
					dlt_newMenuList.setRowJSON(idx, menuObj, true);
				}
			}
		} else{
			matchData = dlt_MenuList.getMatchedJSON( "screenNm" , screenNm , true)[0];
		}
		if (!matchData) {
			ngmf._error("요청하신 메뉴["+screenNm+"]정보를 찾을수 없습니다.");
			return;
		}
		
		//메뉴명 네비개이션 처리
		var resultArr = ngmf.showMenuNavi(matchData, true);
		
		//성능측정을 위해
		/*
		if (GLV.G_DEVFG != "L" ){
			var menuLogMap = {menuId : matchData.screenNm ,menuINm : matchData.menuNm, startTime : new Date() };
			GLV["MENULOG"] = menuLogMap;			
		} 
		*/

//		//연관메뉴 추가기능을 위한..
//		var relativeData = (typeof relativeData !== "undefined") ? relativeData : "";
//		if (relativeData.length > 0) {
//			parent.dsl_relativeBtn.setJSON(relativeData, true);
//		}
		
		if (matchData["pageUrl"] && matchData["pageUrl"].indexOf(".xml") > -1) {
			if (ngmf.isMobile()) {
				//임시화면 생성 <to-do> 추후 메뉴 확인후 재작업이 필요함(이동규)
				var pageUrlArr = matchData.pageUrl.split("/");
				if (pageUrlArr.length > 2) {
					if (pageUrlArr[pageUrlArr.length-1].indexOf(".xml") > -1 && 
						pageUrlArr[pageUrlArr.length-2].indexOf("xml") > -1 &&
						pageUrlArr[pageUrlArr.length-3].indexOf("..") == -1 &&
						pageUrlArr[pageUrlArr.length-3] != "") {

						var preFix = pageUrlArr[pageUrlArr.length-3];
						var screenNm = matchData.screenNm;
						ngmf.newWindow(preFix, screenNm, matchData.menuNm, strArg, strFunction);
					}
				} 
			} else {
				var windowMDI = ngmf.mdiTabs();
	            var winScreenName = matchData.screenNm;
	            /*
	              용도몰라 일단 주석..
	            var pathArr = matchData.pageUrl.split("/");
	            for (var j = 0; j < pathArr.length ; j++) {
	            	if (pathArr[j].indexOf(".xml") > -1) {
	            		screenNm = pathArr[j].split(".xml")[0];
	            	}
	            }
	            screenNm = (typeof screenNm !== "undefined" && screenNm) ? "screenNm='"+screenNm+"'" : "";
	            */
	            
				var htmlStr = [];
	            htmlStr.push("<div id='" + winScreenName + "_" + windowMDI.id +"' class='w2group grpheader'>");
	            htmlStr.push("<div id='" + winScreenName + "_div_" + windowMDI.id +"' class='w2group lta mt5'>");
	            htmlStr.push("<h2 id='" + winScreenName + "_title_" + windowMDI.id +"' class='w2textbox '>"+ matchData.menuNm +"</h2>");
	            htmlStr.push("<ul id='" + winScreenName + "_ul_" + windowMDI.id +"' class='w2group clearfix navi'>");
	        	for (var j = 0; j< resultArr.length; j++) {
	        		var menuObj = dlt_MenuList.getMatchedJSON("menuCd", resultArr[j]);
	        		if (menuObj.length > 0 ) {
	        			var navimenuNm = menuObj[0].menuNm;
	                	htmlStr.push("<li id='" + winScreenName + "_li_"+j+"_" + windowMDI.id +"' class='w2group '><span id='wq_uuid_"+ j +"' class='w2span '>" + navimenuNm +"</span></li>");
	        		}
	            }
	        	htmlStr.push("</ul></div>");
	            htmlStr.push("<div id='div_" + windowMDI.id +"' class='w2group rta mt5'>");


	            //2016.06.27 연관메뉴 화면별 정의하기로 변경
	            //htmlStr.push("<a id='btnRelated" + matchData.menuCd +"' class='w2group rela_link' "+ screenNm +" >Related Links</a>");
	            if (GLV["G_FORMUSEFG"] == "M") {
		            if (GLD.GDS_USERTREE.getMatchedIndex("menu_id", matchData.menuCd).length > 0 ) {
		            	htmlStr.push("<a id='"+ windowMDI.id + winScreenName + "_star' class='w2anchor2 btn_star on' href='javascript:void(null);'></a>");
		            } else {
		            	htmlStr.push("<a id='"+ windowMDI.id + winScreenName + "_star' class='w2anchor2 btn_star' href='javascript:void(null);'></a>");
		            }
	            } 
	            
	            htmlStr.push("<div id='"+ windowMDI.id + "_div_01' class='w2group mdi_btn_box'><a id='"+ windowMDI.id + winScreenName + "_user_ok' class='w2anchor2 btn_user_ok' href='javascript:void(null);'></a></div>");
                htmlStr.push("<div id='"+ windowMDI.id + "_div_02' class='w2group mdi_btn_box'><a id='"+ windowMDI.id + winScreenName + "_refresh' class='w2anchor2 btn_refrash' href='javascript:void(null);'></a></div>");
                if (GLV["G_FORMUSEFG"] == "M") htmlStr.push("<div id='"+ windowMDI.id + "_div_03' class='w2group mdi_btn_box'><a id='"+ windowMDI.id + winScreenName + "_menual' class='w2anchor2 btn_menual' href='javascript:void(null);'></a></div>");
            	htmlStr.push("<div id='"+ windowMDI.id + "_div_04' class='w2group mdi_btn_box'>");
            	htmlStr.push("<a id='"+ windowMDI.id + winScreenName + "_winmin' class='w2anchor2 btn_winmin' href='javascript:void(null);'></a>");
 				//htmlStr.push("<a id='"+ windowMDI.id + winScreenName + "_winmax' class='w2anchor2 btn_winmax' href='javascript:void(null);'></a>");
             	htmlStr.push("<a id='"+ windowMDI.id + winScreenName + "_winclose' class='w2anchor2 btn_winclose' href='javascript:void(null);'></a>");
             	htmlStr.push("</div>");
	            htmlStr.push("</div></div>");
	            htmlStr = htmlStr.join("");
	           
	            //이미 오픈된 윈도우가 있을경우 선택까지 됨...
	            var isWindow = null;
	            if (typeof _notFocusWin != "undefined" && _notFocusWin) {
	            	isWindow = windowMDI.getWindowByWindowId(winScreenName, false);
            	} else {
            		isWindow = windowMDI.getWindow(winScreenName);
            	}
				if (isWindow ) {
					return true;
	            }  else {
	            	if (winScreenName != GLV["G_ACTIVE_FORMID"]) {
	            		GLV["G_PRE_FORMID"] = GLV["G_ACTIVE_FORMID"];
	            		GLV["G_ACTIVE_FORMID"] = winScreenName;
	            	} 
	            	
	            	if (GLV["newWindowArg"] && GLV["newWindowArg"][windowMDI.id  + "_" + winScreenName] && GLV["newWindowArg"][windowMDI.id  + "_" + winScreenName]["strFunction"] == "scwin.form_onLoadCompleted")
	            		delete GLV["newWindowArg"][windowMDI.id  + "_" + winScreenName]["strFunction"];

	            	
	            	windowMDI.createWindow(winScreenName, null, matchData.pageUrl, null , null , openAction , null , null, htmlStr);
	            	if (typeof _notFocusWin != "undefined" && _notFocusWin) {
	            		ngmf._winMininMize(windowMDI, winScreenName);
	            	}
	            	
	            	//scwin.form_onLoadCompleted 두번 호출 막기
	            	/*
	            	 * SPA 환경에서는 scvar 가 Clear 됨
	            	if (typeof strArg !== "undefined" && strArg) {
	                	var createWin = windowMDI.getWindow(winScreenName);
	                	if (createWin && typeof createWin.scvar == "undefined") {
		                	createWin.scvar = {};
	                	}
	                	if (ngmf.isJSON(strArg)) {
	                		for (var ai in strArg) {
	                			createWin.scvar[ai] = strArg[ai];
	                		}
						} else if (ngmf.isString(strArg)){
							var strObj = ngmf._extractData(strArg);
							for (var ai in strObj) {
	                			createWin.scvar[ai] = strObj[ai];
	                		}
						} 
	                } 
	            	 */
	            	
	                $("#"+windowMDI.id + winScreenName + "_winclose").bind("click",  function() {
	                	try {
	                		var screenNm = winScreenName;
		                    if ( ngmf._checkFormBatch (screenNm) ) return false;
	                		$(this)[0].focus();
		                	var windowMDI = ngmf.mdiTabs();
		                    var screenWindow = windowMDI.getWindow(screenNm);
		                    if (screenWindow && screenWindow["scwin"] && typeof screenWindow["scwin"]["commonCloseForm"] !== "undefined") {
		                    	//업무화면에 그리드가 존재시 그리드의 editMode 상태를 endEdit로 변경.[UI-2928]
		                    	var gridCnt = screenWindow.$(".w2grid:wq");
		                    	for (var i =0; i < gridCnt.length; i++) {
		                    		var grdObj = screenWindow.ngmf.object(gridCnt[i].id);
		                    		if (grdObj && grdObj.editMode) {
		                    			grdObj._endEdit();
		                    		}
		                    	}
		                    	var rtn = screenWindow.scwin.commonCloseForm();
		                    	if (rtn) ngmf.closeWindow(screenNm);
		                    } else { 
		                    	ngmf.closeWindow(screenNm);
		                    }
	                	} catch (ex) { 
	                		ngmf._error("[_winclose] Exception :: ", ex);
	                	}
	                });
	                
                	/*
                	 if (GLV["G_FORMUSEFG"] == "M") 
                	$("#"+windowMDI.id + winScreenName + "_star").bind("click", function(){
	                	try { 
	                		var screenNm = winScreenName;
		                    if ( ngmf._checkFormBatch (screenNm) ) return false;
		                    var flag = false;
	                		$(this)[0].focus();
	                		if ($(this).hasClass("on")) {
	                			$(this).removeClass("on");
	                			flag = false;
	                		} else {
	                			$(this).addClass("on");
	                			flag = true;
	                		}  
	                		if (flag){
			                    if (matchData) {
				                    var json = [{
				                    	menuCd : matchData.menuCd,
				                        pageUrl : matchData.pageUrl,
				                        bookmarkNm : matchData.menuNm
				                    }];

				                    dlt_Bookmark.setJSON(json, true);
				                }                		
	                		} else {
	                			var rowIdx = dlt_Bookmark.getMatchedIndex("menuCd", matchData.menuCd, true);
	                			if (rowIdx.length > 0) {
	                				dlt_Bookmark.removeRow(rowIdx[0]);
	                			}
	                		}
	                	} catch (ex) {
	                		ngmf._error("[_star] Exception :: ", ex);
	                	}
	                });*/

	                $("#"+windowMDI.id + winScreenName + "_refresh").bind("click", function() {
	                	try { 
	                		var screenNm = winScreenName;
		                    if ( ngmf._checkFormBatch (screenNm) ) return false;
	                		$(this)[0].focus();
	                		var screenWindow  = ngmf._callbackWindow( screenNm);	                		
		                    if (screenWindow && screenWindow["scwin"] && typeof screenWindow.scwin["commonInitForm"] !== "undefined") {
			                	ngmf.reload(screenNm, "scwin.commonInitForm");
		                    } else {
			                	ngmf.reload(screenNm);
		                    }
	                	} catch (ex) {
	                		ngmf._error("[_refresh] Exception :: ", ex);
	                	}
	                });
	                
	                $("#"+windowMDI.id + winScreenName + "_user_ok").bind("click", function(){ 
                		var screenNm = winScreenName;
	                    if ( ngmf._checkFormBatch (screenNm) ) return false;
	                	$(this)[0].focus();
	                	ngmf._popActCustRegist(this, screenNm);
	                });
	                
	                if (GLV["G_FORMUSEFG"] == "M") 
		                $("#"+windowMDI.id + winScreenName + "_menual").bind("click", function(){ 
	                		var screenNm = winScreenName;
		                    if ( ngmf._checkFormBatch (screenNm) ) return false;
		                	$(this)[0].focus();
		                	ngmf._popActHelp(this, screenNm);
		                });
	                
	                $("#"+windowMDI.id + winScreenName + "_winmin").bind("click", function(){
                		var screenNm = winScreenName;
	                    if ( ngmf._checkFormBatch (screenNm) ) return false;
	                	$(this)[0].focus();
	                	ngmf._winMininMize(ngmf.mdiTabs(), screenNm);
	                });
	            }
		    }
		}
	} catch (e) {
		ngmf._error("[ngmf.createMDI] Exception :: ", e);
	}
};

/**
 * 선택 윈도우화면을 최소화 합니다.
 * @date 2016-04-27
 * @memberOf ngmf
 * @author 이동규
 * @useMobile useless
 */
ngmf._winMininMize = function (mdi, winId) {
	if(ngmf.isMobile()) {
		//ngmf.alert("ngmf._winMininMize : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	var mdiComp = ngmf.object(mdi);
	if (mdiComp) {
		for (var i = 0; i < mdiComp.windowIdx ; i++) {
			if (mdiComp.windows[i].windowId == winId) {
				var winInfoObj = mdiComp.getWinInfoObj(mdiComp.windows[i].id);
				winInfoObj.window.minimize();
				break;
			}
		}
	}
};

/**
 * 윈도우화면을 닫습니다.
 * @date 2015-10-21
 * @memberOf ngmf
 * @sampleLink scm_formClosing
 * @author 이동규
 * @useMobile use
 * @update 16.03.24 이동규 
 *                  팝업화면에서 x 버튼 클릭시 closeAction 오동작에 따른 closeWindow 호출 분기처리.
 * @update 2016.05.02 이동규 코드 리팩토닝 [중복코드 수정.]
 * @update 2016.06.24 이동규 getWindow 통합작업.
 * @param {String} screenNm  :: I :: Y :: currentScreenName :: 스크린명 (default : 현재 함수객체 실행 위치 screenName)
 * @param {Object} newWindow :: I :: Y ::  :: 윈도우 객체
 * @example ngmf.closeWindow();
 */
ngmf.closeWindow = function(screenNm, newWindow) {
	try {  
		if (ngmf.isPopup()) return false;
		if (ngmf.isMobile()) {
			var obj = ngmf.getFormID(true);
			var preFix = obj[0];
			var scrNm = obj[1];
			if(scvar && scvar._openAction !== "replace") {
				parent.scwin.clearOpenWindow(preFix, scrNm);
			}
			ngmf._removeWindowInfo(screenNm);
		} else { 
			var windowMDI = ngmf.mdiTabs();
			var mdiID = windowMDI.getID();
			var screenWindow = null;
			if (typeof screenNm == "undefined" || !screenNm ) {
				screenNm = scvar.__screenName;
				screenWindow = windowMDI.getWindow(screenNm);
			} else {
				screenWindow = windowMDI.getWindow(screenNm);	
			}
			
			if (screenWindow) {
				if (GLD.$("#"+ screenNm+ "_" +mdiID))
					GLD.$("#"+ screenNm+ "_" +mdiID).remove(); 
				if (windowMDI) windowMDI.closeWindow(screenNm);
			} else if (windowMDI) {
				windowMDI.closeWindow(windowMDI.getSelectedIndex());
			}
			ngmf._removeWindowInfo(screenNm, false, mdiID);
			if (GLV["newWindowArg"] && GLV["newWindowArg"][mdiID  + "_" +  screenNm]) {
				delete GLV["newWindowArg"][mdiID  + "_" +  screenNm];
			}
		}
		
		
	} catch(e) {
		ngmf._error("[ngmf.js : ngmf.closeWindow] 에러 ", e);
	}
};

/**
 * 화면 메뉴의 경로를 찾습니다.
 * @date 2015-10-21
 * @memberOf ngmf
 * @author 이진수
 * @useMobile use
 * @update 2016.05.27 이동규 모바일 개발 분기처리.
 * @example ngmf.showMenuNavi();
 * @exampleAsIs
 */
ngmf.showMenuNavi = function() {
	var naviArr =  new Array();
	try{
	    var pJsonObj        = arguments[0];
	    if (typeof pJsonObj != "undefined") {
	    	var isMenuCd        = false;
		    if(arguments.length > 1){
		        isMenuCd = arguments[1];
		    }
		    var menuCd          = pJsonObj.menuCd;
		    var menuNm          = pJsonObj.menuNm;
		    var depth           = pJsonObj.depth || 1;
		    var parentMenu      = pJsonObj.parentMenu || "";
		    //$w.log(menuCd+","+menuNm+","+depth+","+parentMenu);
			if(isMenuCd){
		        naviArr.push(menuCd);
		    }else{
		        naviArr.push(menuNm);
		    }
		    while(parentMenu != ""){
		        var parentMatchData = GLD.dlt_MenuList.getMatchedJSON( "menuCd" , parentMenu , true);

		        if (parentMatchData.length > 0) {
			        if(isMenuCd){
			            naviArr.push(parentMatchData[0].menuCd);
			        }else{
			            naviArr.push(parentMatchData[0].menuNm);
			        }

			        parentMenu = parentMatchData[0].parentMenu;
		        } else {
		        	break;
		        }
		    }

		    naviArr = naviArr.reverse();
	    }
	} catch (e) {
		ngmf._error("[ngmf.showMenuNavi] Exception :: ", e);
	}
    return naviArr;
};

/**
 * 팝업을 닫습니다.
 * @date 2015-10-21
 * @memberOf ngmf
 * @param {String} popupId  :: I :: N ::  :: 팝업ID
 * @param {Object} popupObj :: I :: Y ::  :: 팝업객체
 * @param {Object} rtnObj   :: I :: Y ::  :: 리턴객체
 * @author 이동규
 * @useMobile use
 * @update 2016.03.10 이동규 팝업 콜백 수행 시 파라메터 변경 
 * 					수정전 : callBackFunc(rtnObj) //rtnObj : 팝업에서 넘겨준 데이터.
 * 					수정후 : callBackFunc(rtnObj, popupId) //rtnObj : 팝업에서 넘겨준 데이터, popupId : 팝업화면 아이디
 * @update 2016.06.24 이동규 getWindow 통합작업. 
 * @example ngmf._closePopupSelfWindow(popupId);
 * @exampleAsIs
 */
ngmf._closePopupSelfWindow = function (popupId, popupObj, rtnObj) {
	try{
		requires("uiplugin.popup");
		//팝업에 대한 callBack 함수.
		var callBackFnc = popupObj.callbackFunc;

		var popupCallBack = "";
		var mainCallBack = "";
		var object = "";
		var funcNm = "";
		var func = "";
		if (ngmf.isArray(callBackFnc)) {
		//M = ?? = P (콜백이 2개 존재)
			popupCallBack = callBackFnc[1];
			mainCallBack = callBackFnc[0];
		} else {
		//M = P (콜백이 1개 존재)
			popupCallBack = callBackFnc;
		}

		if(typeof popupCallBack !== "undefined") {
			if(popupCallBack.startsWith("__ngmf_callback__")) {
				func = ngmf._removeCallbackFunc(popupCallBack);
			} else {
				if(popupCallBack.indexOf("ngmf") > -1) {
					object = "ngmf";
					funcNm = popupCallBack.split(".")[1];
				} else if (popupCallBack.indexOf(".") > -1) {
					object = popupCallBack.split(".")[0];
					funcNm = popupCallBack.split(".")[1];
				} else {
					funcNm = popupCallBack;
				}
				if (object == "") {
					func = window[funcNm];
				} else {
					if (typeof window[object] != "undefined")
						func = window[object][funcNm];
				}
			}

			if (typeof func === "function") {
				if (typeof rtnObj !== "undefined") {
					if (mainCallBack !== "") {
						func(rtnObj, popupObj.parentScreen, mainCallBack);
					} else {
						func(rtnObj, popupObj.popupID);
					}
				} else {
					if (mainCallBack !== "") {
						func("", mainCallBack);
					} else {
						func("", popupObj.popupID);
					}
				}
			}
		}

		try {
		 	if( scwin.commonActivate && typeof scwin.commonActivate == "function"){
		 		scwin.commonActivate(popupId);
				if (typeof windowMDI !== "undefined") {
					windowMDI.getWindow(windowMDI.getSelectedWindowId()).WebSquare.callCommonActivate = "Y" ;
				}
		 	}
		} catch (e) {
			ngmf._error("[ngmf._closePopupSelfWindow] Exception :: ", e);
		}

		WebSquare.util.closePopup(popupId);
	} catch (e) {
		ngmf._error("[ngmf._closePopupSelfWindow] Exception :: ", e);
	}
};

ngmf._pushCallbackFunc = function(func) {
	var idx = "__ngmf_callback__" + (new Date()).format( "yyyyMMddHHmmssSSS") + "_" + (++ngmv._callbackFuncIdx);
	try {
		if( func.isPromiseCallback ) {
			idx = "__ngmf_callback__promise__" + (new Date()).format( "yyyyMMddHHmmssSSS" ) + "_" + (++ngmv._callbackFuncIdx);
		}
	} catch(e) {}
	ngmv._callbackFuncObj[idx] = func;
	return idx;
};

ngmf._removeCallbackFunc = function(idx) {
	var func = ngmv._callbackFuncObj[idx];
	delete ngmv._callbackFuncObj[idx];
	return func;
};

/**
 * 팝업화면을 닫는 API 입니다.
 * @date 2015-10-29
 * @memberOf ngmf
 * @param {String} popupId  :: I :: N ::  :: 팝업 ID
 * @param {String} popupObj :: I :: Y ::  :: 팝업 객체
 * @param {String} rtnObj   :: I :: Y ::  :: 리턴 객체
 * @author 이동규
 * @useMobile use
 * @update 2016.03.10 이동규 promise.dialog 일 경우 promise.resolve 수행작업.
 * @update 2016.05.02 이동규 코드 리팩토닝 [중복코드 수정.]
 * @update 2016.05.13 이동규 팝업의 정보객체가 없는경우 부모에서 팝업창을 닫는 로직 수정.
 * @update 2016.05.24 이동규  모바일 공통 변경수정.
 * @update 2016.06.13 이동규 팝업창을 닫을 경우 화면의 팝업창을 숨김처리.
 * @update 2016.07.27 Popup 닫을시 ngmf._closePopupOpener 에서 팝업 객체 강제 삭제 처리로직 추가.
 * @example ngmf.closePopup(popupId, popupObj, rtnObj);
 * @exampleAsIs ClosePopup(RetVar);
 */
ngmf.closePopup = function (popupId, popupObj, rtnObj) {
	try{
		requires("uiplugin.popup");
		var rtnObjType = "";
		var rtnObjString = "";
		if (ngmf._checkFormBatch(popupId)) {
			ngmf._debug("[_closeAction("+popupId+") debug..]   배치 실행중!!!!");
			return false;
		}
		
		if (typeof rtnObj == "undefined") {
			
		} else  if (typeof rtnObj == "object") {
			rtnObjType = "JSON";
			rtnObjString = JSON.stringify(rtnObj);
		} else {
			rtnObjType = "VALUE";
			rtnObjString = rtnObj;
		} 
		
		if (typeof popupObj == "undefined" || !popupObj || ngmf.isMobile()) {
			popupObj = ngmf.popupParam(); 
		}	
		if (typeof popupId == "undefined" || !popupId ) {
			popupId = popupObj["popupID"]; 
		}
 
		var openerWindow = null;
		if (WebSquare["parentObj"]) openerWindow = WebSquare.parentObj;
		else openerWindow = parent;
		
		// 모바일일 경우....
		if ((typeof openerWindow == "undefined"  || openerWindow == null ) && ngmf.isMobile()) {
			openerWindow = parent;
			if (typeof popupObj.parentScreen != "undefined") {
				if (parent.document.getElementById(popupObj.parentScreen) && 
					parent.document.getElementById(popupObj.parentScreen).getElementsByTagName("iframe")[0]) {
					iframeDom = parent.document.getElementById(popupObj.parentScreen).getElementsByTagName("iframe")[0];
					openerWindow = iframeDom.contentWindow || iframeDom.contentDocument;
				}
			}
		} 
		if (typeof openerWindow == "undefined") {
			throw new Error(popupObj.parentScreen + " :: window가 존재하지 않습니다.");
		} else {
			var mdiId = null;
			var callBackFnc = popupObj.callbackFunc;
			var popupCallBack = "";
			var mainCallBack = "";
			var object = "";
			var funcNm = "";
			var func = "";
			if (ngmv && ngmv["windowID"])
				mdiId =  ngmv["windowID"].substr(1,5);
			if (ngmf.isArray(callBackFnc)) {
				//M = ?? = P (콜백이 2개 존재)
				popupCallBack = callBackFnc[1];
				mainCallBack = callBackFnc[0];
			} else {
			//M = P (콜백이 1개 존재)
				popupCallBack = callBackFnc;
			}
			var callBackWindow = popupObj["parentForm"];
			if(typeof popupCallBack !== "undefined") {
				if(popupCallBack.startsWith("__ngmf_callback__")) {
					func = callBackWindow.ngmf._removeCallbackFunc(popupCallBack);
					if (!func)
						func = openerWindow.ngmf._removeCallbackFunc(popupCallBack);
				} else { 
					if(popupCallBack.indexOf("ngmf") > -1) {
						object = "ngmf";
						funcNm = popupCallBack.split(".")[1];
					} else if (popupCallBack.indexOf(".") > -1) {
						object = popupCallBack.split(".")[0];
						funcNm = popupCallBack.split(".")[1];
					} else {
						funcNm = popupCallBack;
					}
					if (object == "") {
						func = callBackWindow[funcNm];
					} else {
						if (typeof callBackWindow[object] != "undefined")
							func = callBackWindow[object][funcNm];
					}
				}
			}
			
			// 모바일일 경우 플러그인 호출 함수
			if( ngmf.isMobile() && typeof GLD.scwin.closePopupViewport == "function"){
				GLD.scwin.closePopupViewport();
			}
			
			if(ngmf.isMobile()){
				var openedPopup = openerWindow.WebSquare.util.getPopup(popupId);
				if (openedPopup && openedPopup["options"]["frameMode"] == "iframe" ) {
					//wframe이 아닌경우 popupCnt 감소
					GLV.iframePopCnt--;
				}			
			}
			
			ngmf.resizePopup({},true);
			openerWindow.WebSquare.util.closePopup(popupId);
			openerWindow.ngmf._closePopupOpener(callBackWindow, func , rtnObjType, rtnObjString, popupId,  mainCallBack ||"", mdiId );
 
		}
	} catch (e) {
		ngmf._error("[ngmf.closePopup] Exception :: ", e);
	}
};

ngmf._closePopupOpener = function (callBackWindow, func, rtnObjType, rtnObjString, popupId,  mainCallBack, mdiId) {
	try {
		var rtnObj = rtnObjString;
		if (rtnObjType) { 
			if ( rtnObjType == "JSON") {
				rtnObj = JSON.parse(rtnObjString);
			}
		}
		GLV["G_PRE_FORMID"] = popupId ; 
		if ( window[popupId]) {
			window[popupId].remove();
			if (document.getElementById(popupId+"_modal") !== null) {
				$("#"+popupId+"_modal").remove();
			}  

			if ( $(".w2popup_window").length  == 0) {
				GLV.G_POPUPZ_INDEX = 8000;
				WebSquare.uiplugin.popup._zIndex = -1;
			}
			ngmf._closePopupForce(popupId);
			if (scvar.__screenName.startsWith("main")) {
				ngmf._removeWindowInfo(popupId, true,"main");
			} else {
				if (mdiId) ngmf._removeWindowInfo(popupId, true,mdiId);
				else  ngmf._removeWindowInfo(popupId, true);	
			} 
			
		}
		if (callBackWindow) {
		 	if( callBackWindow["scwin"]["commonActivate"] && typeof callBackWindow["scwin"]["commonActivate"] == "function"){
		 		callBackWindow["scwin"]["commonActivate"](popupId);
		 	}
			if (typeof func === "function") {
				if (rtnObjType) {
					if (mainCallBack !== "") {
						func(rtnObj, callBackWindow.scvar.__screenName , mainCallBack);
					} else {
						func(rtnObj, popupId);
					}
				} else {
					if (mainCallBack !== "") {
						func("", mainCallBack);
					} else {
						func("", popupId);
					}
				}
			}
			if (GLV.G_ACTIVE_FORMID == popupId && callBackWindow["scvar"]) GLV.G_ACTIVE_FORMID = callBackWindow["scvar"]["__screenName"];
		}
	} catch (e) {
		ngmf._error("[ngmf._closePopupOpener] Exception :: ", e);
	}
};
 
/**
 * 열린 window객체를 가져오는 API 입니다.
 * 파리미터가 없을 경우나 파라미터에 해당되는 윈도우가 없을경우 GLD(전체 메인)를 리턴 * 
 * @date 2015-10-29
 * @memberOf ngmf
 * @param {String} windowId :: I :: N ::  :: 윈도우ID
 * @author 이동규
 * @useMobile use
 * @updata 이동규 2016.03.22 subWindow 와 팝업이 동일한 formId 화면일 경우 화면의 getWindow에서 
 			subWindow만 찾는 문제점을 수정.
 * @update 2016.05.02 이동규 코드 리팩토닝 [중복코드 수정.]
 * @update 2016.05.24 이동규 모바일 공통 정리.
 * @update 2016.06.24 이동규 getWindow 통합작업.
 * @update 2016.08.05 성일호 window 관리 통합
 * @example ngmf.getWindow(windowId);
 * @exampleAsIs ngmf.getWindow(parentScreen);
 */
ngmf.getWindow = function(windowId) {
	try {
		// 2016.08.05 window 관리 통합
		if (ngmv.isWindowPopup) {
			return window.top;
		} else if (ngmf._getAllWindows(windowId, null, "M").length > 0) {
			return ngmf._getAllWindows(windowId, null, "M")[0];
		} else  if (ngmf._getAllWindows(windowId, null, "P").length > 0) {
			return ngmf._getAllWindows(windowId, null, "P")[0];
		} else  if (ngmf._getAllWindows(windowId, null, "PO").length > 0) {
			return ngmf._getAllWindows(windowId, null, "PO")[0];
		} else {
			return GLD;
		}
		/*
		if(ngmf.isMobile()){	
	  		var objForm;
	  		var iframes = document.getElementsByClassName("mobileBody");
            if (iframes.length == 0) {
		       	iframes = parent.document.getElementsByClassName("mobileBody");
		    }

            if (typeof windowId !== "undefined") {
				for ( var i = 4; i < iframes.length; i++) {
					var getSrc = iframes[i].src;
					if (getSrc.indexOf(windowId + ".xml") > -1) {
						ifrObj = parent.ngmf.object(iframes[i].id);
						objForm = ifrObj.getWindow();
						return objForm;
					}	
				}
           	} else {
           		for ( var i = 4; i < iframes.length; i++) {
			 		var getSrc = iframes[i].src;
			 		var gid = document.getElementById(iframes[i].id );
					for( var j=0; j < parent.scvar.openWinData.length ; j++ ){
		       			if(iframes[i].src.indexOf(parent.scvar.openWinData[j].url) > -1 ) {
		         			if(parent.scvar.openWinData[j].activate == "true"){
		         				ifrObj = parent.ngmf.object(iframes[i].id);
								objForm = ifrObj.getWindow();
								return objForm;
							}
			       		}
			     	}
			    } 	
			}
	    } else {
			var windowMDI = ngmf.mdiTabs();
			if (typeof windowMDI !== "undefined") {
				if (typeof windowId !== "undefined") {
					var getWindow = windowMDI.getWindow(windowId);
					if (getWindow == null) {
						var parentwindowId = windowMDI.getSelectedWindowId();
						var selectedWindow = windowMDI.getWindow(parentwindowId);
						if (windowId.startsWith("__popup_formId__")) {
							windowId = windowId.replace("__popup_formId__", "");
						} 
						if (typeof selectedWindow.ngmf.object(windowId) !== "undefined") {
							return selectedWindow;
						}
					} else {
						return windowMDI.getWindow(windowId);
					}
				} else {
					var windowId = windowMDI.getSelectedWindowId();
					return windowMDI.getWindow(windowId);
				}
			}
	 	}
		*/
	} catch(e) {
		return GLD;
	}
};

/**
 * 현재 화면에서 PopupWindow객체를 가져오는 API 입니다.
 * @date 2016-06-14
 * @memberOf ngmf
 * @param {String} popupId :: I :: N ::  :: 팝업ID(팝업화면 screenNm)
 * @author 이동규
 * @update 2016.09.06 성일호 popupId null 일경우 현재 윈도우에서 open한 모든 팝업윈도우 찾기 추가
 * @example ngmf.getPopupWindow(windowId);
 * @example 
 *     //현재 윈도우에서 open한 모든 팝업 찾아서 닫기
 * 		var popWinAll = ngmf.getPopupWindow();
 *      if (popWinAll && popWinAll.length > 0) {
 *      	for (var i =0; i < popWinAll.length; i++) {
 *      		popWinAll[i].ngmf.close();
 *      	}
 *      }
 * @useMobile use
 */
ngmf.getPopupWindow = function(popupId) {
	var returnVal = null;
	try {
		if (typeof popupId !== "undefined" && popupId) {
			// 2016.08.05 window 관리 통합
			var popupWin = ngmf._getAllWindows(popupId, "", "P");
			if (popupWin.length == 0) popupWin = ngmf._getAllWindows(popupId, "", "PO");
			if (popupWin && popupWin.length > 0 && popupWin[0].ngmf.isPopup()) {
				returnVal = popupWin[0];
			} 
		} else {
			var allwinInfoArr = null;
			var infoArr = null;
			var retWindows = new Array();
			//현재 윈도우에서 open한 모든 팝업윈도우 찾기
			allwinInfoArr = ngmf.getWindowInfo(null, ngmf.mdiTabs().id, ngmf.getFormID());
			if (allwinInfoArr.length > 0) {
				for (var i = 0; i < allwinInfoArr.length ; i ++ ) {
					var tgtWin = null;
					infoArr = allwinInfoArr[i].split("|"); 
					if (infoArr.length >3){
						tgtWin = ngmf._getActiveWindow (infoArr [0], infoArr[2],  infoArr[1], infoArr[3]);
					} else if (infoArr.length >2){
						tgtWin = ngmf._getActiveWindow (infoArr [0], infoArr[2],  infoArr[1]);
					} else if (infoArr.length <= 2){
						tgtWin = ngmf._getActiveWindow (infoArr [0]);
					}
					if (tgtWin) retWindows.push(tgtWin);
				}
				if (retWindows.length > 0) return retWindows;
				else return null;
			}  else return returnVal;			
		} 
	} catch(e) {
		ngmf._error("[ngmf.getPopupWindow] Exception :: ", e);
	}
	return returnVal;
};

ngmf._callbackWindow = function(windowId, isPopup) {
	// 2016.08.05 window 관리 통합
	var winc = null;
	if (typeof isPopup != "undefined" && isPopup) {
		winc = ngmf._getAllWindows(windowId, "", "P");
		if (winc.length == 0) winc = ngmf._getAllWindows(windowId, "", "PO");
	} else {
		winc = ngmf._getAllWindows(windowId, "", "M");
		if (winc.length == 0) winc = ngmf._getAllWindows(windowId, "", "P");
		if (winc.length == 0) winc = ngmf._getAllWindows(windowId, "", "PO");
	}	
	if (winc.length > 0)
		return winc[0];
	else return GLD; 
	/*
	
	
	if (ngmf.isMobile()) {
		var selectedWindow = parent;
		if (typeof selectedWindow.ngmf.object(windowId) !== "undefined") {
			var iframeDom = selectedWindow.document.getElementById(windowId).getElementsByTagName("iframe")[0];
			var win = iframeDom.contentWindow || iframeDom.contentDocument;
			if (win) return win;
		} else if (GLD["scwin"]["getSelectedIframe"]) {
			var win = GLD["scwin"].getSelectedIframe();
			if (win) return win;
		}
		return selectedWindow;
	} else {
		try {
			var windowMDI = ngmf.mdiTabs();
			if (typeof windowMDI !== "undefined" && windowMDI) {
				if (typeof windowId !== "undefined" && windowId) {
					if (typeof isPopup != "undefined" && isPopup) {
						var parentWindow = windowMDI.getWindow(windowMDI.getSelectedWindowId());
						if (windowId.startsWith("__popup_formId__")) {
							windowId = windowId.replace("__popup_formId__", "");
						} 
						if (parentWindow && typeof parentWindow.ngmf.object(windowId) !== "undefined") {
							var iframeDom = parentWindow.document.getElementById(windowId).getElementsByTagName("iframe")[0];
							if (iframeDom)
								return iframeDom.contentWindow || iframeDom.contentDocument;
						}
						return null;
					} else { 
						var getWindow = windowMDI.getWindow(windowId);
						if (getWindow == null) {
							var parentwindowId = windowMDI.getSelectedWindowId();
							var selectedWindow = windowMDI.getWindow(parentwindowId);
							if (windowId.startsWith("__popup_formId__")) {
								windowId = windowId.replace("__popup_formId__", "");
							} 
							if (typeof selectedWindow.ngmf.object(windowId) !== "undefined") {
								var iframeDom = selectedWindow.document.getElementById(windowId).getElementsByTagName("iframe")[0];
								return iframeDom.contentWindow || iframeDom.contentDocument;
							}
						} else {
							return windowMDI.getWindow(windowId);
						}
					}
				} else {
					var windowId = windowMDI.getSelectedWindowId();
					return windowMDI.getWindow(windowId);
				}
			}
		} catch(e) {
			if (typeof GLD.ngmf.object(windowId) !== "undefined") {
				var iframeDom = GLD.document.getElementById(windowId).getElementsByTagName("iframe")[0];
				if (iframeDom)
					return iframeDom.contentWindow || iframeDom.contentDocument;
			}
		}
		return GLD;
	}	
	*/
};

/**
 * 메인화면의 프로그램 상태 메세지를 처리하는 API 입니다.
 * @date 2015-10-29
 * @memberOf ngmf
 * @param {String} type :: I :: Y ::   :: 프로그램 상태.
 * @param {String} msg  :: I :: Y :: N :: 상태 메시지.
 * @author 이동규
 * @useMobile useless
 * @update 이동규 2016.03.23 PI 요청 모든 프로그램 상태에 상관 없이 텍스트 색상을 yellow로 통일.
 * @example ngmf.setWindowStatusMsg("N", msg);
 * @exampleAsIs
 * @sampleLink scm_statusMessage
 */
ngmf.setWindowStatusMsg = function (type, msg) {
	try{
		if( ngmf.isMobile()){
			//ngmf.alert("ngmf.setWindowStatusMsg : 모바일환경에서 지원불가 API 입니다.");
			return;
		} else {
			// type : nomal (N) : 정상, warring (W) : 경고, 오류 : error (E)
			msg = (typeof msg !== "undefined") ? msg : "";
			type = (typeof type !== "undefined") ? type : "N";
			GLD.$("#" + GLD.txt_footStatusMsg.id).removeClass("stat_red");
			GLD.$("#" + GLD.txt_footStatusMsg.id).removeClass("stat_yellow");
			GLD.$("#" + GLD.txt_footStatusMsg.id).removeClass("stat_gray");
			if (ngmf.length(msg) * 14 > 274) {
			    var percent = Math.round(msg.length * 14 / 274 * 100);
				
				if (typeof GLD.ngmv.styleSheets == "undefined") {
					var styleTest = document.createElement('style');
					styleTest.type = 'text/css';
					GLD.document.getElementsByTagName("head")[0].appendChild(styleTest);
					GLD.ngmv.styleSheets = GLD.document.styleSheets[document.styleSheets.length-1];
					GLD.ngmv.styleSheets.insertRule(
						'@-webkit-keyframes marquee{ 0% {text-indent:80%} 100% {text-indent:-'+ percent +'%}}',
						 GLD.ngmv.styleSheets.rules.length
					);
				} else {
					//GLD.ngmv.styleSheets.removeRule();
					for (var i in GLD.ngmv.styleSheets.rules) {
						if(GLD.ngmv.styleSheets.rules[i].type == 7) {
							GLD.ngmv.styleSheets.removeRule(i);
						}
					}
					GLD.ngmv.styleSheets.insertRule(
						'@-webkit-keyframes marquee{ 0% {text-indent:80%} 100% {text-indent:-'+ percent +'%}}',
						 GLD.ngmv.styleSheets.rules.length
					);
				}
		       	
		       	if(percent > 100) {
		       		var count = 8 + Math.round(percent*8 / 274);
		       		GLD.$("#txt_footStatusMsg").attr("title", msg);
		       		//GLD.$("#txt_footStatusMsg").css("animation","marquee "+ count +"s linear infinite");
		       	} else{
			    	GLD.$("#txt_footStatusMsg").css("animation","marquee 10s linear infinite");
			    	GLD.$("#txt_footStatusMsg").attr("title", "");
		       	}

			    GLD.$("#txt_footStatusMsg").css("white-space","nowrap");
			    GLD.$("#txt_footStatusMsg").css("overflow","hidden");
			    
			} else {
				GLD.$("#txt_footStatusMsg").css("white-space","");
			    GLD.$("#txt_footStatusMsg").css("overflow","");
			    GLD.$("#txt_footStatusMsg").css("animation","");
			}

			GLD.txt_footStatusMsg.setValue(msg);

			switch (type.toUpperCase()) {
				case "N" :
				case "NOMAL" :
					GLD.$("#" + GLD.txt_footStatusMsg.id).addClass("stat_yellow");
					break;
				case "W" :
				case "WARRING" :
					GLD.$("#" + GLD.txt_footStatusMsg.id).addClass("stat_yellow");
					break;
				case "E" :
				case "ERROR" :
					GLD.$("#" + GLD.txt_footStatusMsg.id).addClass("stat_yellow");
					break;
	
				default :
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.setWindowStatusMsg] Exception :: ", e);
	}
};

/**
 * 데이터 조회 및 저장 등의 사용자 동작에 대한 현재 진행 상태를 표시하는 API 입니다.
 * @date 2015-10-29
 * @memberOf ngmf
 * @param {String} msg :: I :: N ::  :: 상태 메시지.
 * @sampleLink scm_statusMessage
 * @author 이동규
 * @useMobile use
 * @example ngmf.showProcessMsg(msg);
 * @exampleAsIs
 */
ngmf.showProcessMsg = function (msg) {
	try{
		msg = (typeof msg !== "undefined") ? msg : "작업이 진행 중입니다.";
		WebSquare.layer.showProcessMessage(msg);
	} catch (e) {
		ngmf._error("[ngmf.showProcessMsg] Exception :: ", e);
	}
};

/**
 * 데이터 조회 및 저장 등의 사용자 동작에 대한 현재 진행 상태 표시를 없애는 API 입니다.
 * @date 2015-10-29
 * @memberOf ngmf
 * @sampleLink scm_statusMessage
 * @author 이동규
 * @useMobile use
 * @example ngmf.hideProcessMsg(msg);
 */
ngmf.hideProcessMsg = function () {
	try{
		WebSquare.layer.hideProcessMessage();
	} catch (e) {
		ngmf._error("[ngmf.hideProcessMsg] Exception :: ", e);
	}
};

/**
 * 고객 화면 탭을 선택하는 API 입니다.
 * @date 2015-11-01
 * @memberOf ngmf
 * @param {Number} index :: I :: Y :: 0 :: 탭 Index.
 * @author 이동규
 * @example ngmf.selectTab(1);
 * @exampleAsIs
 * @useMobile useless
 */
ngmf.selectTab = function (index) {
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.selectTab : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try{
		var selectedTabIdx = GLD["mainTab"].getSelectedTabIndex();
		index = (typeof index !== "undefined") ? index : 0;

		if (index != selectedTabIdx && !GLD["mainTab"].tabArr[index].disabled) {
			GLD["mainTab"].setSelectedTabIndex(index);
		}
	} catch (e) {
		ngmf._error("[ngmf.selectTab] Exception :: ", e);
	}
};

/**
 * 고객 windowMDI의 window을 순차적으로 선택하는 API 입니다.
 * @date 2015-11-01
 * @memberOf ngmf
 * @param {Boolean} type :: I :: Y :: true :: 마지막 탭일 경우 window 화면 선택 방법 true 인경우 첫번째 탭으로 false인경우 동작하지 않습니다.
 * @author 이동규
 * @example ngmf.windowContentMove();
 * @exampleAsIs
 * @useMobile useless
 */
ngmf.windowContentMove = function (type) {
	if(ngmf.isMobile()) {
		ngmf.alert("ngmf.windowContentMove : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try{
		var windowMDI = ngmf.mdiTabs();

		type = (typeof type !== "undefined" && !WebSquare.util.isBoolean(type)) ? false : true;

		if (typeof windowMDI !== "undefined") {
			var selectedIdx = windowMDI.getSelectedIndex();
			var tabLen = windowMDI.windows.length;
			var windowIdArr = new Array();
			var selectWindowIndex = "";
			for (var i in windowMDI.windows) {
				windowIdArr.push(windowMDI.windows[i].windowId);
			}

			if (type) {
				if (selectedIdx == tabLen-1) {
					selectWindowIndex = 0;
				} else {
					selectWindowIndex = selectedIdx + 1;
				}
			} else {
				if (selectedIdx == tabLen-1) {
					selectWindowIndex = selectedIdx;
				} else {
					selectWindowIndex = selectedIdx + 1;
				}
			}
			windowMDI.getWindowByWindowId(windowIdArr[selectWindowIndex], type);
		}
	} catch (e) {
		ngmf._error("[ngmf.windowContentMove] Exception :: ", e);
	}
};

/**
 * 문자열에 정의된 함수를 실행 합니다.
 * @date 2015-11-03
 * @memberOf ngmf
 * @param {String} callBackFnc :: I :: N ::       ::  함수 명.
 * @param {Object} rtnObj      :: I :: Y ::       :: 파라미터 (변수 또는 변수 배열)
 * @param {Boolean} type       :: I :: Y :: false :: 반환 파라미터 설정.(true : 배열 값들을 각각의 파라메터로 설정. || false : 입력받은 파라메터 그대로 반환.)
 * @param {Boolean} returnFlag :: I :: Y :: false :: 함수실행 동작의 return 값 반환 여부 (true : 함수 호출 결과 return값, false : 함수 실행 여부 반환 [default : false])
 * @author 이동규
 * @useMobile use
 * @update 2016.05.02 이동규 코드 리펙토닝 [로직 내부 변수 선언 오류]
 * @example ngmf.executeFunc("alertFunc", "변수 실행");
 * @exampleAsIs
 */
ngmf.executeFunc = function(callBackFnc, rtnObj, type, returnFlag) {
	try{

		var parentObj = opener || parent;
		var object = "";
		var funcNm = "";
		var func = "";
		var result = false; 

		if (typeof type !== "undefined") {
			type = WebSquare.util.getBoolean(type) || false;
		}

		if(callBackFnc.indexOf("ngmf") > -1) {
			object = "ngmf";
			funcNm = callBackFnc.split(".")[1];
		} else if (callBackFnc.indexOf(".") > -1) {
			object = callBackFnc.split(".")[0];
			funcNm = callBackFnc.split(".")[1];
		} else {
			funcNm = callBackFnc;
		}
		if (typeof callBackFnc !== "undefined") {
			if (object == "") {
				func = parentObj.window[funcNm];
			} else {
				if (typeof parentObj.window[object] !== "undefined")
					func = parentObj.window[object][funcNm];
			}
			if (typeof func === "function") {
				if (typeof rtnObj !== "undefined") {
					var paramJsonObj = "";
					if (!ngmf.isJSON(rtnObj)) {
						paramJsonObj = rtnObj;
					} else {
						paramJsonObj = (ngmf.isNull(ngmf.jsonParse(rtnObj)) == "Y") ? rtnObj : ngmf.jsonParse(rtnObj);
					}

					var paramArr = new Array();
					for (var i in paramJsonObj) {
						paramArr.push(paramJsonObj[i]);
					}

					if (type) {
						funcReturn = func.apply(this, paramArr);
					} else {
						funcReturn = func(paramJsonObj);
					}

					result = true;
				} else {
					funcReturn = func();
					result = true;
				}
			} else {
				if (object == "") {
					func = window[funcNm];
				} else {
					if (typeof window[object] !== "undefined")
						func = window[object][funcNm];
				}
				if (typeof func === "function") {
					if (typeof rtnObj !== "undefined") {
						var paramJsonObj = "";
						if (!ngmf.isJSON(rtnObj)) {
							paramJsonObj = rtnObj;
						} else {
							paramJsonObj = (ngmf.isNull(ngmf.jsonParse(rtnObj)) == "Y") ? rtnObj : ngmf.jsonParse(rtnObj);
						}
						var paramArr = new Array();
						for (var i in paramJsonObj) {
							paramArr.push(paramJsonObj[i]);
						}

						if (type) {
							funcReturn = func.apply(this, paramArr);
						} else {
							funcReturn = func(paramJsonObj);
						}
						result = true;
					} else {
						funcReturn = func();
						result = true;
					}
				} else {
					func = eval(callBackFnc);
					if (typeof func == "function") {
						funcReturn = func();
						result = true;
					}
				}
			}
		}

		if (typeof returnFlag !== "undefined") {
			returnFlag = WebSquare.util.getBoolean(returnFlag) || false;
		}
		if (typeof returnFlag != "undefined" && returnFlag) {
			return funcReturn;
		} else {
			return result;
		}
	} catch (e) {
		ngmf._error("[ngmf.executeFunc] Exception :: ", e);
	}
};

/**
 * 화면의 지정 컴포넌트에 tooltip을 삭제합니다.
 * @date 2016-02-01
 * @memberOf ngmf
 * @param {String} targetId :: I :: N ::  :: tooltip 설정 컴포넌트 Id.
 * @author 이동규
 * @useMobile use
 * @example ngmf.removeTooltip("btn_search");
 * @exampleAsIs
 */
ngmf.removeTooltip = function (targetId) {
	try {
		if(ngmf.isMobile()){
		
		}else{
			var comp = ngmf.object(targetId);
			$("#"+comp.getID()).unbind("mouseenter mouseleave");
 		}
	} catch(e) {
		ngmf._error("[ngmf.removeTooltip] Exception :: ", e);
	}
};

/**
 * 화면의 지정 컴포넌트에 tooltip을 설정합니다.
 * @date 2015-11-10
 * @memberOf ngmf
 * @param {String} targetId :: I :: N ::  :: tooltip 설정 컴포넌트 Id.
 * @param {String} msg      :: I :: N ::  :: tooltip 설정 메세지.
 * @param {String} position :: I :: Y ::  :: tooltip 위치
 * @sampleLink scm_popOverToopTip
 * @author 이동규
 * @useMobile use
 * @update 2016.05.12 이동규 툽팁 위치 설정 오류.
 * @update 2016.06.16 이동규 툴팁 Z-index 재설정.
 * @example ngmf.setTooltip("btn_search", "그리드의 화면의 데이터를 조회합니다.");
 * @exampleAsI
 */
ngmf.setTooltip = function (targetId, msg, position) {
	try{

		if(ngmf.isMobile()){

		}else{
		if (typeof ngmf.object(targetId) === "undefined") {
			return false;
		} else {
			$("#"+targetId).unbind("mouseenter mouseleave");
			//메세지 undefined, null, "" 일 경우 ToolTip 제거만
			
			if (typeof msg == "undefined" || !msg) return true;
			
			$("#"+targetId).hover(
				function() {
					var comp = ngmf.object(this.id);
					var addStyle = "";
					if (ngmf.isNull(document.getElementById("tooltip")) !== "N" ) {
						var tooltipDiv = document.createElement("div");
						tooltipDiv.setAttribute("id", "tooltipDiv");
						tooltipDiv.setAttribute("class", "w2group tip_ov ");
						tooltipDiv.setAttribute("style", "position:absolute; max-width:400px; top:0; left:0; z-index:5200; word-break: break-all;");
						var tooltip = document.createElement("div");
						tooltip.setAttribute("id", "tooltip");
						tooltip.setAttribute("class", "w2textbox");
						tooltip.innerHTML = msg;
						tooltipDiv.appendChild(tooltip);
						document.body.appendChild(tooltipDiv);
					} else {
						var tooltip = document.getElementById("tooltip");
						tooltip.innerHTML = msg;
					}

					var setTop = 0;
					var setLeft = 0;
					var fullViewRatio = 1;
					if (typeof WebSquare.BootLoader.fullViewRatio != "undefined") {
						fullViewRatio = WebSquare.BootLoader.fullViewRatio;
					}
					var type = "";
					var t1 = $("#"+this.id).offset().top/fullViewRatio;
					var t2 = $("#tooltipDiv").outerHeight();
					var l1 = $("#"+this.id).offset().left/fullViewRatio + $("#"+this.id).outerWidth()/2;
					var l2 = $("#tooltipDiv").outerWidth()/2;
					var l3 = $("#"+this.id).offset().top/fullViewRatio + $("#"+this.id).outerHeight()/2;
					var l4 = $("#tooltipDiv").outerHeight()/2;
					var r1 = $("body").outerWidth() - $("#"+this.id).offset().left/fullViewRatio - $("#"+this.id).outerWidth();
					var r2 = $("#tooltipDiv").outerWidth();
					
					if (t1 < t2) {
						if (l3 > l4 && r1 > r2) {
							type = "right";
						} else if (r1 < r2 && l3 > l4) {
							type = "left";
						} else {
							type = "bottom";
						}
					} else {
						if (l3 > l4 && r1 > r2) {
							type = "right";
						} else if (r1 < r2 && l3 > l4) {
							type = "left";
						} else {
							type = "top";
						}
					}

					if (typeof position != "undefined") {
						switch(position.toLowerCase()) {
							case "left" :
								type = "left";
								break;
							case "right" :
								type = "right";
								break;
							case "top" :
								type = "top";
								break;
							case "bottom" :
								type = "bottom";
								break;
						}
					}

					if (type == "left" || type == "right") {
						setTop = $("#"+this.id).offset().top/fullViewRatio - $("#tooltipDiv").outerHeight()/2 + $("#"+this.id).outerHeight()/2;
						if (type == "left") {
							$("#tooltipDiv").addClass("left mr20");
							setLeft = $("#"+this.id).offset().left/fullViewRatio - $("#tooltipDiv").outerWidth() - 20;
						} else {
							$("#tooltipDiv").addClass("right ml20");
							setLeft = $("#"+this.id).offset().left/fullViewRatio + $("#"+this.id).outerWidth() - 20;
						}
					} else if (type == "bottom" || type == "top") {
						setLeft = $("#"+this.id).offset().left/fullViewRatio - $("#tooltipDiv").outerWidth()/2 + $("#"+this.id).outerWidth()/2 - 10;
						if (type == "top") {
							$("#tooltipDiv").addClass("top mb20");
							setTop = $("#"+this.id).offset().top/fullViewRatio - $("#tooltipDiv").outerHeight() - 20;
						} else {
							$("#tooltipDiv").addClass("bottom mt20");
							setTop = $("#"+this.id).offset().top/fullViewRatio + $("#"+this.id).outerHeight();
						}
					} else {
						setLeft = $("#"+this.id).offset().left/fullViewRatio - $("#tooltipDiv").outerWidth()/2 + $("#"+this.id).outerWidth()/2 - 10;
						setTop = $("#"+this.id).offset().top/fullViewRatio + $("#"+this.id).outerHeight();
					}

					$("#tooltipDiv").css({"top" : setTop, "left" : setLeft });
				},
				function() {
					$("#tooltip").remove();
					$("#tooltipDiv").remove();
				}
			);
		}
	  }
	} catch (e) {
		ngmf._error("[ngmf.setTooltip] Exception :: ", e);
	}
};

/**
 * 화면의 지정 컴포넌트에 popOver을 삭제합니다.
 * @date 2016-02-01
 * @memberOf ngmf
 * @param {String} targetId :: I :: N ::  :: popOver 설정된 컴포넌트 Id.
 * @author 이동규
 * @useMobile use
 * @example  ngmf.removePopOver("lovPopoverTest1");
 * @exampleAsIs
 */
ngmf.removePopOver = function (targetId) {
	try {
		var comp = ngmf.object(targetId);
		$("#"+comp.getID()).unbind("mouseenter mouseleave");
	} catch(e) {
		ngmf._error("[ngmf.removePopOver] Exception :: ", e);
	}
};

/**
 * 화면의 지정 컴포넌트에 popOver을 설정합니다.
 * @date 2015-11-11
 * @memberOf ngmf
 * @param {String} targetId  :: I :: N ::         :: popOver 설정 컴포넌트 Id.
 * @param {String} title     :: I :: Y :: popOver :: popOver 설정 title.
 * @param {String} strPrefix :: I :: N ::         :: popOver 내부 프레임 src 경로(URL).
 * @param {String} strFormID :: I :: N ::         :: popOver 내부 프레임 폼ID(URL).
 * @param {String} width     :: I :: Y :: 300px   :: popOver 설정 width.
 * @param {String} height    :: I :: Y :: 300px   :: popOver 설정 height.
 * @param {String} frame     :: I :: Y :: wframe  :: popOver 설정 frmae. [default:wframe]
 * @param {String} position  :: I :: Y ::         :: popOver 설정 position.
 * @sampleLink scm_popOverToopTip
 * @author 이동규
 * @useMobile use
 * @update 2016.04.15 이동규 팝오버 설정 화면이 스크롤이 생겼을 경우 스크롤에 따른 위치 값 조정.
 *                    wframe일때 화면을 초기화하는 black.xml의 src 부분이 락걸리면 현상으로 인해 removeFrame
 *					  함수로 재구현.
 * @update 2016.04.29 이동규 코드 리팩토닝 [분기 로직 수정.]
 * @update 2016.06.08 이동규 코드 재작업(방향 4(상하좌우) * 3(위,가운데,중앙)) [분기 로직 수정.]
 * @example  ngmf.setPopOver("lovPopoverTest1", "상품회선 유형 LOV", "AA3","lovPopover", 500, 300, "wframe");
 * @exampleAsIs
 */
ngmf.setPopOver = function (targetId, title, strPrefix, strFormID, width, height, frame, position) {
	try{
		ngmf._hoverIntent();
		if (typeof ngmf.object(targetId) === "undefined") {
			return false;
		} else {
			if (!strPrefix && !strFormID) return false;
			if (strFormID.lastIndexOf("xml") > -1) strPrefix = strPrefix.replaceAll("xml", "").replaceAll(".", "");
			if (strFormID && !strPrefix) strPrefix = ngmf.getSvcId(strFormID);
			if (strPrefix.lastIndexOf("/xml") > 2) strPrefix = strPrefix.replaceAll("xml", "").replaceAll("/", "");

			frame = "wframe";
			$(function() {
				popOverControl = {
					sensitivity : 3,
					interval : 400,
					timeout : 800,
					over : function() {
						var info = _over();
						_mouseOver(info.id, info.obj);
						
					},

					out : function() {
						//setTimeout(function() {
						var popOverObj = {
							title : (typeof title !== "undefined") ? title :"popOver",
							src : (typeof src !== "undefined") ? src : "",
							width : (typeof width !== "undefined") ? width + "": "300px",
							height : (typeof height !== "undefined") ? height + "" : "300px",
							frame : (typeof frame !== "undefined") ? frame : "wframe",
							options : (typeof options !== "undefined") ? options : ""
						};

						if (popOverObj.width.indexOf("px") < 0) {
							popOverObj.width = popOverObj.width + "px";
						}
						if (popOverObj.height.indexOf("px") < 0) {
							popOverObj.height = popOverObj.height + "px";
						}

						if (popOverObj.frame == "iframe") {
                    		if(!iframeShow) {
                              	iframeShow = false;
                              	ngmf._popOverRemove("iframe");
                            }
                    	} else {
                    		if(!wframeShow) {
                              	wframeShow = false;
								ngmf._popOverRemove("wframe");
                            }
                    	}
		                //} , 300);
					}
				};
				
				if(ngmf.isMobile()) {
					ngmv._popOverObject[targetId] = {};
					$("#"+targetId).on("click", function() {
						if(ngmv._popOverObject[this.id] && ngmv._popOverObject[this.id].show) {
							var popOverObj = ngmv._popOverObject[this.id].popOverObj;

							if (popOverObj.frame == "iframe") {
		                		setTimeout(function() {
		                			if (!ifm_popOverBodyFrame.getUserData("show")) {
			                    		iframeShow = false;
		                				ngmf._popOverRemove("iframe");
		                    		}
		                    	}, 300);
		                	} else {
		                		setTimeout(function() {
		                			if (!wfm_popOverBodyFrame.getUserData("show")) {
			                    		wframeShow = false;
		                				ngmf._popOverRemove("wframe");
		                    		}
		                		}, 300);
		                	}
							
							ngmv._popOverObject[this.id].show = false;
						} else if (ngmv._popOverObject[this.id]) {
							var info = _over();
							_mouseOver(info.id, info.obj);
							ngmv._popOverObject[this.id].show = true;
							ngmv._popOverObject[this.id].popOverObj = info.obj;
						}
					});
				} else {
					$("#"+targetId).hoverIntent(popOverControl);
				}
			});
		}

		function _over () {
			var setTop = 0;
			var setLeft = 0;
			var src = ngmf.SWING_PATH + "/" + strPrefix + "/xml/" + strFormID + ".xml";
			var popOverObj = {
				title : (typeof title !== "undefined") ? title :"popOver",
				src : (typeof src !== "undefined") ? src : "",
				width : (typeof width !== "undefined") ? width + "" : "300px",
				height : (typeof height !== "undefined") ? height + "" : "300px",
				frame : (typeof frame !== "undefined") ? frame : "wframe",
				position : (typeof position !== "undefined") ? position : ""
			};

			if (popOverObj.width.indexOf("px") < 0) {
				popOverObj.width = popOverObj.width + "px";
			}
			if (popOverObj.height.indexOf("px") < 0) {
				popOverObj.height = popOverObj.height + "px";
			}

			//var comp = WebSquare.util.getComponentById(this.id);
			var addStyle = "";

			//팝오버 중복 창 띄움 방지
			var isShow = false;
			if (popOverObj.frame == "iframe") {
				if (ifm_popOverBodyFrame.getStyle("display") == "none"){
					isShow = false;
					if (wfm_popOverBodyFrame.getStyle("display") != "none"){
						ngmf._popOverRemove("wframe");
					}
				} else {
					ngmf._popOverRemove("iframe");
					isShow = true;
				}
			} else {
				if (wfm_popOverBodyFrame.getStyle("display") == "none"){
					isShow = false;
					if (ifm_popOverBodyFrame.getStyle("display") != "none"){
						ngmf._popOverRemove("iframe");
					}
				} else {
					ngmf._popOverRemove("wframe");
					isShow = true;
				}
			}

			//팝오버 화면 디자인.
			if ($("#popOverGrp").length == 0) {
				var popOverGrp = document.createElement("div");
				var popOverGrpId = "";
				if (popOverObj.frame == "iframe") {
					popOverGrp.setAttribute("id", "popOverGrp_i");
					popOverGrpId = "popOverGrp_i";
				} else if (popOverObj.frame == "wframe"){
					popOverGrp.setAttribute("id", "popOverGrp_w");
					popOverGrpId = "popOverGrp_w";
				}

				popOverGrp.setAttribute("class", "w2group pop_ov ");
				popOverGrp.setAttribute("style", "position:absolute; z-index:1000;top:0;left:0;");

				var popOverGrp_header = document.createElement("div");
				popOverGrp_header.setAttribute("id", "popOverGrp_header");
				popOverGrp_header.setAttribute("class", "w2group head");
				var popOverTitle = document.createElement("div");
				popOverTitle.setAttribute("id", "popOverTitle");
				popOverTitle.setAttribute("class", "w2textbox");
				popOverTitle.innerHTML = popOverObj.title;
				popOverGrp_header.appendChild(popOverTitle);

				var popOverGrp_body = document.createElement("div");
				popOverGrp_body.setAttribute("id", "popOverGrp_body");
				popOverGrp_body.setAttribute("style", "width:"+ popOverObj.width +";height:" +popOverObj.height+";");
				popOverGrp_body.setAttribute("class", "w2group body");

				popOverGrp.appendChild(popOverGrp_header);
				popOverGrp.appendChild(popOverGrp_body);
				document.body.appendChild(popOverGrp);
			}

		/*
		 *팝오버 화면 위치 설정.
		 */
			//기본 위치값.
			var bodyWidth   = $("body").width();
			var bodyHeight  = $("body").height();
			var bodyScrollY  = $("body").position().top;
			var bodyScrollX = $("body").position().left;
			var targetWidth = $("#"+targetId).outerWidth();
			var popOverWidth = $("#"+popOverGrpId).outerWidth();
			var targetHeight = $("#"+targetId).outerHeight();
			var popOverHeight = $("#"+popOverGrpId).outerHeight();
			var targetTop = $("#"+targetId).offset().top;
			var targetLeft = $("#"+targetId).offset().left;
			//계산식
			var l1 = targetLeft + targetWidth/2;
			var l2 = popOverWidth/2;
			var nTop = targetTop - popOverHeight/2 + targetHeight/2 + bodyScrollY;
			
			var rightAble = ((targetLeft + targetWidth + popOverWidth + 10) <= bodyWidth) ? true : false;
			var leftAble  = ((targetLeft - 10) > popOverWidth) ? true : false;

			//position 지정 확인.
			//위치 방향 확인 [ top / bottom / left / right]
			if (typeof position !== "undefined") {
				type = position;
			} else {
				if (targetTop > popOverHeight) {
					if (l1 < l2 || (l1 + l2) > bodyWidth) {
						if (rightAble)     type = "right";
						else if (leftAble) type = "left";
						else               type = "nTop";
					} else {
						type = "top";
					}
				} else {
					if (l1 < l2 || (l1 + l2) > bodyWidth) {
						if (rightAble)     type = "right";
						else if (leftAble) type = "left";
						else               type = "nBottom";
					} else {
						type = "bottom";
					}
				}
			}

			//position이 [left / right] 일 경우 상단, 중간, 하단 위치 확인체크.
			if (type == "left" || type == "right") {
				if (nTop < 0) {
					setTop = targetTop - 10; //상단
				} else {
					if ((nTop + popOverHeight + bodyScrollY) < bodyHeight) {
						setTop = targetTop - popOverHeight/2 + targetHeight/2 + bodyScrollY; // 중단
					} else {
						setTop = targetTop - popOverHeight + targetHeight + 10 + bodyScrollY; // 하단
					}
				}

				if (type == "left") {
					$("#"+popOverGrpId).addClass("left");
					setLeft = targetLeft - popOverWidth - bodyScrollX - 10;
				} else {
					$("#"+popOverGrpId).addClass("right");
					setLeft = targetLeft + targetWidth - bodyScrollX + 10;
				}
				if (setLeft < 0 ) setLeft = 10;
				if (setTop < 0 ) setTop = 30;

				$("#"+popOverGrpId).css({left: setLeft, top : setTop});

			} else if (type == "bottom" || type == "top") {
				var screenNm = scvar.__screenName || ngmf.getFormID();
				var screenNmObj = GLD.dlt_MenuList.getMatchedJSON("screenNm" ,screenNm);

				//Top|Bottom 위치 일때, left 위치 정렬(앞 , 중간, 뒤)
				if (typeof screenNm != "undefined" && screenNmObj.length > 0) {
					var pageSize = screenNmObj[0].pageSize;
					if (typeof pageSize != "undefined" && (pageSize == "type2" || pageSize == 1675)) {
						if((targetLeft + popOverWidth/2 + targetWidth/2) > 1675) {
							setLeft = 1640 - popOverWidth; //뒷 정렬
						} else {
							setLeft = targetLeft + targetWidth/2 - popOverWidth/2 - 10; //중간 정렬
						}
					} else {
						if((targetLeft + popOverWidth/2+10) > 1440) {
							var shift = (targetLeft + popOverWidth/2+10) - 1420;
							setLeft = targetLeft - popOverWidth/2 + targetWidth/2 - shift;
						} else {
							setLeft = targetLeft - popOverWidth/2 + targetWidth/2 - 10;
						}
					}
				} else {
					if((targetLeft + popOverWidth/2 + targetWidth/2) > 1440) {
						setLeft = 1420 - popOverWidth; //뒷 정렬
					} else {
						setLeft = targetLeft + targetWidth/2 - popOverWidth/2 - 10; //중간 정렬
					}
				}

				if (type == "top") {
					$("#"+popOverGrpId).addClass("top");
					setTop = targetTop - popOverHeight - bodyScrollY - 10;
				} else {
					$("#"+popOverGrpId).addClass("bottom");
					setTop = targetTop + targetHeight - bodyScrollY + 10;
				}

				if (setLeft < 0 ) setLeft = 10; //앞정렬
				if (setTop < 0 ) setTop = 30;
				$("#"+popOverGrpId).css({left: setLeft, top : setTop});

			} else if (type == "nTop" || type == "nBottom") {
				var L1 = targetLeft + targetWidth + 10; 
				var L2 = popOverWidth;
				var R1 = targetLeft - 10 + L2;
				var R2 = bodyWidth;
				if (L1 > L2) { //오른쪽
					setLeft = L1 - L2;
				} else if (R1 < R2) { // 왼쪽
					setLeft = targetLeft - 10;
				}

				if (type == "nTop") {
					setTop = targetTop - popOverHeight + bodyScrollY - 10;
				} else {
					setTop = targetTop + targetHeight + bodyScrollY + 10;
				}

				if (setLeft < 0 ) setLeft = 10;
				if (setTop < 0 ) setTop = 30;
				$("#"+popOverGrpId).css({left: setLeft, top : setTop});

			} else {
				var screenNm = scvar.__screenName || ngmf.getFormID();
				var screenNmObj = GLD.dlt_MenuList.getMatchedJSON("screenNm" ,screenNm);
				if (typeof screenNm != "undefined" && screenNmObj.length > 0) {
					var pageSize = screenNmObj[0].pageSize;
					if (typeof pageSize != "undefined" && (pageSize == "type2" || pageSize == 1675)) {
						if((targetLeft + popOverWidth/2 + 10) > 1675) {
							setLeft = 1640 - popOverWidth;
						} else {
							setLeft = targetLeft - popOverWidth/2 + targetWidth/2 - 10;
						}
					} else {
						if((targetLeft+popOverWidth/2+10) > 1440) {
							setLeft = 1420 - popOverWidth;
						} else {
							setLeft = targetLeft - popOverWidth/2 + targetWidth/2 - 10;
						}
					}
				}
				setTop = targetTop + targetHeight - bodyScrollY;
				if (setLeft < 0 ) setLeft = 10;
				if (setTop < 0 ) setTop = 30;
				$("#"+popOverGrpId).css({left: setLeft, top : setTop});
			}

			//팝오버 프레임 정의.
			if (popOverObj.frame == "iframe") {
				var iframe = ngmf.object("ifm_popOverBodyFrame");
				if (typeof iframe !== "undefined") {
					iframe.show('');
					var iframeLeft = setLeft + 10;
					var iframeTop = setTop + 10;
					var iframeWidth = $("#popOverGrp_body").outerWidth()-20;
					var iframeHeight = $("#popOverGrp_body").outerHeight()-20;
					$("#ifm_popOverBodyFrame").css({left: iframeLeft, top: iframeTop});
					ifm_popOverBodyFrame.setSize(iframeWidth, iframeHeight);
					iframe.setSrc(popOverObj.src);
					iframeShow = true;
				}
			} else {
				var wframe = ngmf.object("wfm_popOverBodyFrame");
				if (typeof wframe !== "undefined") {
					wframe.show('');

					var wframeLeft = setLeft + 10;
					var wframeTop = setTop + $("#popOverGrp_header").height()+10;
					var wframeWidth = $("#popOverGrp_body").outerWidth()-20;
					var wframeHeight = $("#popOverGrp_body").outerHeight()-20;
					$("#wfm_popOverBodyFrame").css({left: wframeLeft, top: wframeTop, overflow:"auto"});
					wfm_popOverBodyFrame.setSize(wframeWidth, wframeHeight);

					ngmf.setSrc(wframe, popOverObj.src, "") ;
					wframeShow = true;
				}
			}

			return {"id" : popOverGrpId, "obj" : popOverObj};
		};

		function _mouseOver (popOverGrpId, popOverObj) {
			//팝오버 화면 마우스 오버 설정.
			$("#"+popOverGrpId).hover(
                function() {
                	if (popOverObj.frame == "iframe") {
                		ifm_popOverBodyFrame.setUserData("show", false);
                		iframeShow = true;
                		//팝오버 iFrame
                		$("#ifm_popOverBodyFrame").hover(
                			function() {
                				ifm_popOverBodyFrame.setUserData("show", true);
                				iframeShow = true;
                			},
                			function() {
                				iframeShow = false;
                				ngmf._popOverRemove("iframe");
                			}
            			);
                	} else {
                		wfm_popOverBodyFrame.setUserData("show", false);
                		wframeShow = true;
                		$("#wfm_popOverBodyFrame").hover(
                			function() {
                				wfm_popOverBodyFrame.setUserData("show", true);
                				wframeShow = true;
                			},
                			function() {
                				wframeShow = false;
                				ngmf._popOverRemove("wframe");
                			}
            			);
                	}
                },
                function() {
                	if (popOverObj.frame == "iframe") {
                		setTimeout(function() {
                			if (!ifm_popOverBodyFrame.getUserData("show")) {
	                    		iframeShow = false;
                				ngmf._popOverRemove("iframe");
                    		}
                    	}, 300);
                	} else {
                		setTimeout(function() {
                			if (!wfm_popOverBodyFrame.getUserData("show")) {
	                    		wframeShow = false;
                				ngmf._popOverRemove("wframe");
                    		}
                		}, 300);
                	}
                }
            );
		};
	} catch (e) {
		ngmf._error("[ngmf.setPopOver] Exception :: ", e);
	}
};

ngmf._hoverIntent = function() {
	(function($) {
	    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {
	        // default configuration values
	        var cfg = {
	            interval: 100,
	            sensitivity: 6,
	            timeout: 0
	        };

	        if ( typeof handlerIn === "object" ) {
	            cfg = $.extend(cfg, handlerIn );
	        } else if ($.isFunction(handlerOut)) {
	            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
	        } else {
	            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
	        }

	        // instantiate variables
	        // cX, cY = current X and Y position of mouse, updated by mousemove event
	        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
	        var cX, cY, pX, pY;

	        // A private function for getting mouse position
	        var track = function(ev) {
	            cX = ev.pageX;
	            cY = ev.pageY;
	        };

	        // A private function for comparing current and previous mouse position
	        var compare = function(ev,ob) {
	            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
	            // compare mouse positions to see if they've crossed the threshold
	            if ( Math.sqrt( (pX-cX)*(pX-cX) + (pY-cY)*(pY-cY) ) < cfg.sensitivity ) {
	                $(ob).off("mousemove.hoverIntent",track);
	                // set hoverIntent state to true (so mouseOut can be called)
	                ob.hoverIntent_s = true;
	                return cfg.over.apply(ob,[ev]);
	            } else {
	                // set previous coordinates for next time
	                pX = cX; pY = cY;
	                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
	                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
	            }
	        };

	        // A private function for delaying the mouseOut function
	        var delay = function(ev,ob) {
	            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
	            ob.hoverIntent_s = false;
	            return cfg.out.apply(ob,[ev]);
	        };

	        // A private function for handling mouse 'hovering'
	        var handleHover = function(e) {
	            // copy objects to be passed into t (required for event object to be passed in IE)
	            var ev = $.extend({},e);
	            var ob = this;

	            // cancel hoverIntent timer if it exists
	            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

	            // if e.type === "mouseenter"
	            if (e.type === "mouseenter") {
	                // set "previous" X and Y position based on initial entry point
	                pX = ev.pageX; pY = ev.pageY;
	                // update "current" X and Y position based on mousemove
	                $(ob).on("mousemove.hoverIntent",track);
	                // start polling interval (self-calling timeout) to compare mouse coordinates over time
	                if (!ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

	                // else e.type == "mouseleave"
	            } else {
	                // unbind expensive mousemove event
	                $(ob).off("mousemove.hoverIntent",track);
	                // if hoverIntent state is true, then call the mouseOut function after the specified delay
	                if (ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
	            }
	        };

	        // listen for mouseenter and mouseleave
	        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
	    };
	})(jQuery);
};

ngmf._popOverRemove = function(frame){
	try{
		if (frame == "iframe") {
			var popOverGrpId = "popOverGrp_i";
			if (ngmf.object("ifm_popOverBodyFrame")) {
	   			ifm_popOverBodyFrame.setSize(0,0);
	   			ifm_popOverBodyFrame.setSrc(ngmf.SWING_PATH+"/lib/comm/blank.xml");
	   			ifm_popOverBodyFrame.hide("");
	   			$("#"+popOverGrpId).remove();
			}
			// $("#"+popOverGrpId).fadeOut(200, function() {

		 //  	});
		} else {
			var popOverGrpId = "popOverGrp_w";
			if (ngmf.object("wfm_popOverBodyFrame")) {
				wfm_popOverBodyFrame.setSize(0,0);
				//wfm_popOverBodyFrame.setSrc(ngmf.SWING_PATH+"/lib/comm/blank.xml");
				wfm_popOverBodyFrame.finalize();
				wfm_popOverBodyFrame.hide("");
			}
			$("#"+popOverGrpId).remove();
			// $("#"+popOverGrpId).fadeOut(200, function() {

		 //   		}
		 //  	});
		}
	} catch (e) {
		ngmf._error("[ngmf._popOverRemove] Exception :: ", e);
	}
};

/**
 * 링크버튼의 link속성을 제거하는 API 입니다.
 * @date 2016-01-11
 * @memberOf ngmf
 * @param {String} targetId :: I :: N ::  :: 변환할 text컴포넌트 Id.
 * @author 이동규
 * @useMobile use
 * @example ngmf.removeLinkBtn(btn_link);
 * @exampleAsIs
 */
ngmf.removeLinkBtn = function (targetId) {
	try{
		var comp = ngmf.object(targetId);
		if (typeof comp != "undefined" && comp.getPluginName && comp.getPluginName() == "gridView") {
			if ($("#"+comp.id +"cell_linkDiv").length > 0) {
				$("#"+comp.id +"cell_linkDiv").remove();
			}
		} else {
			$("#"+targetId).each(function() {
				var attributes = ngmf._concatHashToString(this.attributes);
		        var replacingStartTag = '<div ' +attributes +'>';
		        var replacingEndTag = '</div>';

		       $(this).replaceWith(replacingStartTag + $(this).html() + replacingEndTag);
		    });

			$("#"+targetId).removeAttr("strPrefix");
			$("#"+targetId).removeAttr("strFormID");
			$("#"+targetId).removeAttr("strInArgument");	
			$("#"+targetId).removeAttr("nWidth");
			$("#"+targetId).removeAttr("nHeight");
			$("#"+targetId).removeAttr("strOpenStyle");
			$("#"+targetId).removeAttr("nLeft");
			$("#"+targetId).removeAttr("nTop");
			$("#"+targetId).removeAttr("callbackFunc");
			$("#"+targetId).removeAttr("screenName");
			$("#"+targetId).removeAttr("linkType");
	        $("#"+targetId).removeAttr("btnName");
	        $("#"+targetId).removeAttr("btnId");
	        $("#"+targetId).removeAttr("formName");
		}

	} catch(e) {
		ngmf._error("[ngmf.removeLinkBtn] Exception :: ", e);
	}
};

/**
 * text컴포넌트를 링크버튼으로 설정하는  API 입니다.
 * @date 2016-01-11
 * @memberOf ngmf
 * @param {String} targetId :: I :: N ::  :: 변환할 text컴포넌트 Id.
 * @param {Object} linkBtnObj :: I :: N ::  :: 다중링크버튼 정의 객체.
 * @sampleLink scm_link
 * @author 이동규
 * @useMobile use
 * @update 2016.04.21 이동규 linkedBtn을 enable 적용시 버튼동작을 하지 않도록 분기처리
 * @example
var vParam = "SearchFormId= \"파라메터1\"" ;
vParam += " SearchFg= \"파라메터2\"";

var links = [{
		linkType: "p", btnId : "multiLinked1", btnName: "테이블팝업",
		strPrefix : "EDU",
		strFormID : "PG-0301_popup",
		strInArgument : "",
		nWidth : "600",
		nHeight : "280",
		strOpenStyle : "",
		nLeft : "",
		nTop : "",
		callbackFunc : "scwin.popupCallBack",
		screenName : ""
	},
    {
		linkType: "w", 
		btnId : "multiLinked2", 
		btnName: "고객상담윈도우", 
		strPrefix : "EDU",
		strFormID : "PG-0301_popup",
		formName : "linked윈도우",
		strInArgument : ""
	 },
     {linkType: "f", btnId : "multiLinked3", btnName: "사용자 지정함수", strInArgument : vParam}];

ngmf.setLinkedBtn("btnId", links[0]);
 * @exampleAsIs
 */
ngmf.setLinkedBtn = function(targetId, linkBtnOption) {
	if (typeof $("#"+targetId) == "undefined") {
		return false;
	}

	$("#"+targetId).each(function() {
        var attributes = ngmf._concatHashToString(this.attributes);
        var replacingStartTag = '<a ' +attributes +'>';
        var replacingEndTag = '</a>';

       $(this).replaceWith(replacingStartTag + $(this).html() + replacingEndTag);
    });

    if (typeof linkBtnOption == "undefined") {
        ngmf.alert("링크버튼 설정 데이터가 없습니다.");
        return false;
    } else {
        var type = linkBtnOption.linkType;
        //var linkUrl = linkBtnOption.linkUrl;
        var btnName = linkBtnOption.btnName;
        var btnId = linkBtnOption.btnId;
        if (type == "p" || type == "P") {
			var strPrefix         = linkBtnOption.strPrefix || "";
			var strFormID         = linkBtnOption.strFormID || "";
			var strInArgument     = linkBtnOption.strInArgument || "";
			var nWidth         	  = linkBtnOption.nWidth || 1100;
			var nHeight           = linkBtnOption.nHeight || 410;
			var strOpenStyle      = linkBtnOption.strOpenStyle || "";
			var nLeft             = linkBtnOption.nLeft || 0;
			var nTop              = linkBtnOption.nTop || 0;
			var callbackFunc      = linkBtnOption.callbackFunc || "";
			var screenName        = linkBtnOption.screenName || "";
			$("#"+targetId).attr("strPrefix", strPrefix);
			$("#"+targetId).attr("strFormID", strFormID);
			$("#"+targetId).attr("strInArgument", strInArgument);
			$("#"+targetId).attr("nWidth", nWidth);
			$("#"+targetId).attr("nHeight", nHeight);
			$("#"+targetId).attr("strOpenStyle", strOpenStyle);
			$("#"+targetId).attr("nLeft", nLeft);
			$("#"+targetId).attr("nTop", nTop);
			$("#"+targetId).attr("callbackFunc", callbackFunc);
			$("#"+targetId).attr("screenName", screenName);
        } else if (type == "f" || type == "F") {
        	var strInArgument     = linkBtnOption.strInArgument || "";
        	$("#"+targetId).attr("strInArgument", strInArgument);
        } else {
        	var strPrefix		= this.getAttribute("strPrefix");
			var strFormID		= this.getAttribute("strFormID");
			var formName		= this.getAttribute("formName");
            var strInArgument	= this.getAttribute("strInArgument");
            $("#"+targetId).attr("strPrefix", strPrefix);
			$("#"+targetId).attr("strFormID", strFormID);
            $("#"+targetId).attr("formName", formName);
			$("#"+targetId).attr("strInArgument", strInArgument);
        }
        $("#"+targetId).attr("linkType", type);
        $("#"+targetId).attr("btnName", btnName);
        $("#"+targetId).attr("btnId", btnId);
    }

	$("#"+targetId).on("click", function(e) {
		var comp = ngmf.object(this.id);
		if (comp && comp.getDisabled()) {
			return;
		} else {
			var linkType = this.getAttribute("linkType");
			if (typeof linkType !== "undefined" && linkType !== "") {
				switch(linkType) {
					case "p" :
			        case "P" : // Popup Open
			        	var btnName 		= this.getAttribute("btnName");
		                var strPrefix		= this.getAttribute("strPrefix");
						var strFormID		= this.getAttribute("strFormID");
						var strInArgument	= this.getAttribute("strInArgument");
						var nWidth			= this.getAttribute("nWidth");
						var nHeight			= this.getAttribute("nHeight");
						var strOpenStyle	= this.getAttribute("strOpenStyle");
						var nLeft			= this.getAttribute("nLeft");
						var nTop			= this.getAttribute("nTop");
						var callbackFunc    = this.getAttribute("callbackFunc");
						var screenName		= this.getAttribute("screenName") != "" ? this.getAttribute("screenName") : undefined;
						ngmf.__dialog(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, callbackFunc, screenName);
		                return true;
		            	break;
			        case "w" :
			        case "W" : //new windowCreate
		            	var strPrefix		= this.getAttribute("strPrefix");
						var strFormID		= this.getAttribute("strFormID");
						var formName		= this.getAttribute("formName");
			            var strInArgument	= this.getAttribute("strInArgument");
	                    ngmf.newWindow(strPrefix, strFormID, formName, strInArgument);
	                    return true;
			        break;
			        case "f" : //사용자 정의
			        case "F" :
			        	var obj = {
			        		btnId : this.getAttribute("id"),
			        		btnName : this.getAttribute("btnName"),
			        		strInArgument : this.getAttribute("strInArgument"),
			        		linkType : this.getAttribute("linkType")
			        	};

			        	if (ngmf.isString(obj.strInArgument)){
							obj.strInArgument = ngmf._extractData(obj.strInArgument);
						}

						/// 프로그램 서비스 데이터 - 팝업 명, 팝업 URL 경로가 필요합니다.
						var func = "";
						if (typeof window.scwin.linkedFunc == "function") {
							func = scwin.linkedFunc;
						} else {
							var windowMDI = ngmf.mdiTabs();
		                    var screenWindow = windowMDI.getWindow(windowMDI.getSelectedWindowId());
							func = screenWindow.scwin.linkedFunc;
						}

						if (typeof func !== "undefined") {
							func(obj);
						}

						e.stopPropagation();
						return true;
			        break;
				}
			}
		}
	});
};

ngmf._concatHashToString = function(hash) {
	try{
	    var emptyStr = "";
	    $.each(hash, function(index) {
	        emptyStr += ' ' + hash[index].name + '="' + hash[index].value + '"';
	    });
	    return emptyStr;
	} catch (e) {
		ngmf._error("[ngmf._concatHashToString] Exception :: ", e);
	}
};

/**
 * text컴포넌트를 멀티링크버튼으로 설정하는 API 입니다.
 * @date 2016-01-11
 * @memberOf ngmf
 * @param {String} targetId :: I :: N ::  :: 변환할 text컴포넌트 Id.
 * @param {Object} linkBtnObj :: I :: N ::  :: 다중링크버튼 정의 객체.
 * @author 이동규
 * @useMobile use
 * @update 2016.04.15 이동규 화면 스크롤이 발생한 경우 멀티링크의 포지션 위치 조정.
 * @update 2016.04.21 이동규 linkedBtn을 enable 적용시 버튼동작을 하지 않도록 분기처리
 * @update 2016.05.30 이동규 [UI-1943]링크 버튼의 위치가 화면의 가장 자리일 경우 포지션 조정.
 * @update 2016.07.06 이동규 [UI-2380]링크 버튼의 "W" 타입의 화면생성에서 파라메터 전달 기능추가.
 * @example
var links = [{
		linkType: "p", btnId : "multiLinked1", btnName: "테이블팝업",
		strPrefix : "EDU",
		strFormID : "PG-0301_popup",
		strInArgument : "",
		nWidth : "600",
		nHeight : "280",
		strOpenStyle : "",
		nLeft : "",
		nTop : "",
		callbackFunc : "scwin.popupCallBack",
		screenName : ""
	 },
	 {
		linkType: "w", 
		btnId : "multiLinked2", 
		btnName: "고객상담윈도우", 
		strPrefix : "EDU",
		strFormID : "PG-0301_popup",
		formName : "linked윈도우",
		strInArgument : ""
	 },
	 {linkType: "f", btnId : "multiLinked3", btnName: "사용자 지정함수"}];
  ngmf.setMultiLinkedBtn("targetId", links);
 * @exampleAsIs
 * @sampleLink scm_link
 */
ngmf.setMultiBtn = function(targetId, linkBtnObj) {
	try {
		var comp = ngmf.object(targetId);
		if (typeof comp == "undefined" && typeof $("#"+targetId) == "undefined") {
			return false;
		} else if (comp.getPluginName() == "trigger") {
			ngmf.setMultiLinkedBtn(targetId, linkBtnObj, "trigger");
		}
	} catch(e) {
		ngmf._error("[ngmf.setMultiBtn] Exception :: ", e);
	}
};

/**
 * text컴포넌트를 멀티링크버튼으로 설정하는 API 입니다.
 * @date 2016-01-11
 * @memberOf ngmf
 * @param {String} targetId :: I :: N ::  :: 변환할 text컴포넌트 Id.
 * @param {Object} linkBtnObj :: I :: N ::  :: 다중링크버튼 정의 객체.
 * @author 이동규
 * @useMobile use
 * @update 2016.04.15 이동규 화면 스크롤이 발생한 경우 멀티링크의 포지션 위치 조정.
 * @update 2016.04.21 이동규 linkedBtn을 enable 적용시 버튼동작을 하지 않도록 분기처리
 * @update 2016.05.30 이동규 [UI-1943]링크 버튼의 위치가 화면의 가장 자리일 경우 포지션 조정.
 * @update 2016.07.06 이동규 [UI-2380]링크 버튼의 "W" 타입의 화면생성에서 파라메터 전달 기능추가.
 * @example
var links = [{
		linkType: "p", btnId : "multiLinked1", btnName: "테이블팝업",
		strPrefix : "EDU",
		strFormID : "PG-0301_popup",
		strInArgument : "",
		nWidth : "600",
		nHeight : "280",
		strOpenStyle : "",
		nLeft : "",
		nTop : "",
		callbackFunc : "scwin.popupCallBack",
		screenName : ""
	 },
	{
		linkType: "w", 
		btnId : "multiLinked2", 
		btnName: "고객상담윈도우", 
		strPrefix : "EDU",
		strFormID : "PG-0301_popup",
		formName : "linked윈도우",
		strInArgument : ""
	},
	{linkType: "f", btnId : "multiLinked3", btnName: "사용자 지정함수"}];

ngmf.setMultiLinkedBtn("targetId", links);
 * @exampleAsIs
 * @sampleLink scm_link
 */
ngmf.setMultiLinkedBtn = function(targetId, linkBtnObj, targetType) {
    var comp = ngmf.object(targetId);
    if (typeof $("#"+targetId) == "undefined") {
		return false;
	} else if (comp) {
		targetType = typeof targetType != "undefined" ? targetType : comp.getPluginName();
	}

	if (targetType != "trigger") {
	    $("#"+targetId).each(function() {
	        var attributes = ngmf._concatHashToString(this.attributes);
	        var replacingStartTag = '<a ' +attributes +'>';
	        var replacingEndTag = '</a>';

	       $(this).replaceWith(replacingStartTag + $(this).html() + replacingEndTag);
	    });
    	$("#"+targetId).attr("w5_linkedbtn", true);
	}

    var option = {
    	targetId : targetId,
        btnId : linkBtnObj.btnId,
        linkObj : linkBtnObj
    };

    _setMultiLink(option);

    $("#"+targetId).on("click", function() {
    	var comp = ngmf.object(this.id);
    	if (comp && comp.getDisabled()) {
    		return;
    	} else { 
	        var flag = $("#"+targetId +"_linkDiv").hasClass("show");
	        if (!flag) {
	      		$(".tgg_nav").each( function(){
		    		$(this).removeClass("show");
		    		$(this).css("display", "none");
		    	});

	            $("#"+targetId +"_linkDiv").addClass('show');
	            $("#"+targetId +"_linkDiv").css("display", "block");
	            $("#"+targetId +"_linkDiv").offset({top:0,left:0});
	            var ofs = $("#"+targetId).offset();
	            
				var top_sum = 0;
				var left_sum = 0;
	            if (WebSquare.BootLoader.fullViewRatio && WebSquare.BootLoader.fullViewRatio > 0) {
	            	left_sum = ofs.left / WebSquare.BootLoader.fullViewRatio;
	            	top_sum = ofs.top / WebSquare.BootLoader.fullViewRatio;

	            } else {
	            	left_sum = ofs.left;
	            	top_sum = ofs.top;
	            }
	            
	            var ofs_H = $("#"+targetId).outerHeight()/2;
	            var wid_sum = $("#"+targetId +"_linkDiv").outerHeight()/2;
	            var bodyWidth = $("body").width();
	            var bodyHeight = $("body").height();
	            var allWidth = left_sum +  $("#"+targetId).outerWidth() + $("#"+targetId +"_linkDiv").outerWidth();
		        var top = top_sum - wid_sum + ofs_H - $("body").position().top;
	            var bottomChk = top_sum + wid_sum + ofs_H;
	            var left = 0;

	            if (top < 0) {
	            	top = top_sum - 5  +"px";
	            	var spanNode = $("#"+targetId +"_linkDiv").children("span");
	            	if (spanNode.length > 0 && !spanNode.hasClass("top")) {
	            		spanNode.addClass("top");
	            	}
	            } else if (bottomChk > bodyHeight ) {
	            	top = top_sum - $("#"+targetId +"_linkDiv").outerHeight() + $("#"+targetId).outerHeight() + 5  +"px";
	            	var spanNode = $("#"+targetId +"_linkDiv").children("span");
	            	if (spanNode.length > 0 && !spanNode.hasClass("bottom")) {
	            		spanNode.addClass("bottom");
	            	}
	            } else {
	            	top = top + "px"
	            }

	            if (allWidth < bodyWidth) {
		            left = left_sum +  $("#"+targetId).outerWidth() +"px";
		            if ( $("#"+targetId +"_linkDiv").hasClass("right")) {
		            	$("#"+targetId +"_linkDiv").removeClass("right");
		            }
	            } else {
	            	left = left_sum - $("#"+targetId +"_linkDiv").outerWidth() -5;
	            	if ( left > 0 ) {
	            		if (!$("#"+targetId +"_linkDiv").hasClass("right")) {
	            			$("#"+targetId +"_linkDiv").addClass("right");
			            }
	            	} else {
	            		left = left_sum +  $("#"+targetId).outerWidth() +"px";
	            	}
	            }

	            $("#"+targetId +"_linkDiv").css("top", top);
	            $("#"+targetId +"_linkDiv").css("left", left);
	            $("#"+targetId +"_linkDiv").css("z-index", 5200);

	            if ($("#tooltipDiv").length > 0 && $("#tooltipDiv").hasClass("right")) {
	            	var l1= left_sum +  $("#"+targetId).outerWidth() + $("#"+targetId +"_linkDiv").outerWidth();
	            	var l2 = $("#tooltipDiv").offset().left;
	            	if (l1 > l2) {
	            		$("#tooltipDiv").css({"left":l1});
	            	}
	            }
	            
	            $("#"+targetId +"_linkDiv").attr("tabindex","0");
	            $("#"+targetId +"_linkDiv").focus();
	            $("#"+targetId +"_linkDiv").hover(
	                function() {

	            	},
	            	function(){
	                	$("#"+targetId +"_linkDiv").fadeOut(400,
	                  		function() {
				               $("#"+targetId +"_linkDiv").removeClass("show");
				               $("#"+targetId +"_linkDiv").css("display", "none");
	                  		}
	              		);
	            	}
	        	);

	        	$("#"+targetId +"_linkDiv").focusout(function() { 
			    	$("#"+targetId +"_linkDiv").fadeOut(200,
			      		function() {
			               $("#"+targetId +"_linkDiv").removeClass("show");
			               $("#"+targetId +"_linkDiv").css("display", "none");
			      		}
			  		);
			    });


	        } else {
	        	if ($("#tooltipDiv").length > 0 && $("#tooltipDiv").hasClass("right")) {
	        		var ofs = $("#"+targetId).offset();
	            	var l1= left_sum +  $("#"+targetId).outerWidth() + $("#"+targetId +"_linkDiv").outerWidth();
	            	var l2 = $("#tooltipDiv").offset().left;
	            	if (l1 < l2) {
	            		var left = l1- $("#"+targetId +"_linkDiv").outerWidth();
	            		$("#tooltipDiv").css({"left":left});
	            	}
	            }
	            $("#"+targetId +"_linkDiv").removeClass('show');
	            $("#"+targetId +"_linkDiv").css("display", "none");
	        }
    	}
    });

    function _setMultiLink(option) {
	    var len = Object.keys(option).length;
	    if (len > 0 && option.targetId !== "" && option.linkObj.length > 0 ) {
	        var targetComp = $w.comp[option.targetId];
	        if (typeof targetComp == "undefined" || targetComp == "") {
	            ngmf.alert("다중링크 설정 대상이 없습니다.");
	            return false;
	        }

	        if (document.getElementById(targetComp.id + "_linkDiv") == null) {
	            var div = document.createElement("div");
	            div.setAttribute("id", targetComp.id + "_linkDiv");
	            div.setAttribute("style", "position: absolute; z-index: 5200; display: none; ");
	            div.setAttribute("class", "w2group tgg_nav");
	            var doc = document.body;//.childNodes[0];
	            doc.appendChild(div);
	        }

	        var htmlStr = [];
	        var links = option.linkObj;
	        if (typeof links == "undefined" || links.length < 0) {
	            ngmf.alert("다중링크 URL이 없습니다.");
	            return false;
	        }

	        for (var i = 0; i < links.length; i++) {
	            var linkType = links[i].linkType;
	            var btnName = links[i].btnName;
	            var btnId = links[i].btnId || (targetComp.id + "_linkedBtn" + i);
	            if (linkType == "p" || linkType == "P") {
					var strPrefix         = links[i].strPrefix || "";
					var strFormID         = links[i].strFormID || "";
					var strInArgument     = links[i].strInArgument || "";
					var nWidth         	  = links[i].nWidth || 1100;
					var nHeight           = links[i].nHeight || 410;
					var strOpenStyle      = links[i].strOpenStyle || "";
					var nLeft             = links[i].nLeft || 0;
					var nTop              = links[i].nTop || 0;
					var callbackFunc      = links[i].callbackFunc || "";
					var screenName        = links[i].screenName || "";

		            htmlStr.push("<a id='" + btnId +"' class='w2group pop_link' strOpenStyle='"+strOpenStyle+"' strPrefix='"+strPrefix+"' strFormID='"+strFormID+"' strInArgument='"+strInArgument+"' nWidth='"+nWidth+"' nHeight='"+nHeight+"' nLeft='"+nLeft+"' nTop='"+nTop+"' callbackFunc='"+callbackFunc+"' screenName='"+screenName+"' btnName='"+btnName+"' linkType='"+linkType+"' >");
	            } else if (linkType == "f" || linkType == "F") {
	            	var strInArgument     = links[i].strInArgument || "";
	            	htmlStr.push("<a id='" + btnId +"' class='w2group pop_link' btnName='"+btnName+"' strInArgument='"+strInArgument+"' linkType='"+linkType+"' >");
	            } else {
	            	var strPrefix         = links[i].strPrefix || "";
					var strFormID         = links[i].strFormID || "";
					var strInArgument     = links[i].strInArgument || "";
					var formName		  = links[i].formName || "";
		            htmlStr.push("<a id='" + btnId +"' class='w2group pop_link' btnName='"+btnName+"' formName='"+formName+"' strFormID='"+strFormID+"' strPrefix='"+strPrefix+"' strInArgument='"+strInArgument+"' linkType='"+linkType+"' >");
	            }

	            htmlStr.push(btnName);
	            htmlStr.push("</a>");
	        }

	        htmlStr.push("<span></span>");
	        htmlStr = htmlStr.join("");
	        document.getElementById(targetComp.id + "_linkDiv").innerHTML = htmlStr;
	        for (var j = 0; j < links.length; j++) {
	        	var btnId = links[j].btnId || (targetComp.id + "_linkedBtn" + j);
	        	$("#"+ btnId).on("click", function(e) {
					var linkType = this.getAttribute("linkType");
					switch (linkType) {
				        case "p" :
				        case "P" : // Popup Open
				        	var btnName 		= this.getAttribute("btnName");
			                var strPrefix		= this.getAttribute("strPrefix");
							var strFormID		= this.getAttribute("strFormID");
							var strInArgument	= this.getAttribute("strInArgument");
							var nWidth			= this.getAttribute("nWidth");
							var nHeight			= this.getAttribute("nHeight");
							var strOpenStyle	= this.getAttribute("strOpenStyle");
							var nLeft			= this.getAttribute("nLeft");
							var nTop			= this.getAttribute("nTop");
							var callbackFunc    = this.getAttribute("callbackFunc");
							var screenName		= this.getAttribute("screenName") != "" ? this.getAttribute("screenName") : undefined;
							ngmf.__dialog(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, callbackFunc, screenName);
			                return true;
			            	break;
				        case "w" :
				        case "W" : //new windowCreate
				            var strPrefix		= this.getAttribute("strPrefix");
							var strFormID		= this.getAttribute("strFormID");
							var formName		= this.getAttribute("formName");
				            var strInArgument	= this.getAttribute("strInArgument");
		                    ngmf.newWindow(strPrefix, strFormID, formName, strInArgument);
		                    return true;
				       		break;
				        case "f" : //사용자 정의
				        case "F" :
				        	var obj = {
				        		btnId : this.getAttribute("id"),
				        		btnName : this.getAttribute("btnName"),
				        		strInArgument : this.getAttribute("strInArgument"),
				        		linkType : this.getAttribute("linkType")
				        	};

				        	if (ngmf.isString(obj.strInArgument)){
								obj.strInArgument = ngmf._extractData(obj.strInArgument);
							}

    						/// 프로그램 서비스 데이터 - 팝업 명, 팝업 URL 결로가 필요합니다.
							var func = "";
							if (typeof window.scwin.linkedFunc == "function") {
								func = scwin.linkedFunc;
							} else {
								var windowMDI = ngmf.mdiTabs();
			                    var screenWindow = windowMDI.getWindow(windowMDI.getSelectedWindowId());
								func = screenWindow.scwin.linkedFunc;
							}

							if (typeof func !== "undefined") {
								func(obj);
							}

    						e.stopPropagation();
    						return true;
				        break;
				    }
				});
	        }
	    } else {
            return false;
	    }
	};
};

/**
 * json 형식의 string 문자열을 JSON Object로 변환해서 반환합니다.
 * @date 2015-10-26
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: JSON 형식의 문자열.
 * @return {Object} JSON 객체.
 * @author 이동규
 * @update 이동규 2016-09-22 JSON.parse 전에 JSON객체인지 확인 후 동작.(오류분기 강화[속도이슈])
 * @useMobile use
 * @example ngmf.jsonParse(str);  // return false
 * @exampleAsIs
 */
ngmf.jsonParse = function (str) {
	try{
		var result = null;
		if (typeof str == "string" && str != "") {
			return JSON.parse(str);
		}
	} catch (e) {
		ngmf._error("[ngmf.jsonParse] Exception :: ", e);
		return null;
	}
};

/**
 * JSON Object를 문자열로 변환해서 반환합니다.
 * @date 2015-10-26
 * @memberOf ngmf
 * @param {Object} jsonObj :: I :: N ::  :: JSON 객체.
 * @return {String} JSON 형식의 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.stringify(jsonObj);  // return false
 * @exampleAsIs
 */
ngmf.stringify = function (jsonObj) {
	try {
		if (typeof jsonObj !== "object") {
			return null;
		}

		if (ngmf.isJSON(jsonObj)) {
			return JSON.stringify(jsonObj);
		} else {
			var arr = [];
			for (var i in jsonObj){
				arr.push(i);
			}
			return arr;
		}

	} catch(e) {
		return null;
	}
};

/**
 * 주어진 인자를 통해 동적으로 Component를 생성합니다.
 * @date 2015-12-02
 * @memberOf ngmf
 * @param {String} strCompId     :: I :: N ::  :: 컴포넌트 ID.
 * @param {String} strCompName   :: I :: N ::  :: 컴포넌트 태그명.
 * @param {Object} strAttrib     :: I :: Y ::  :: 컴포넌트 옵션.
 * @param {String} parent        :: I :: Y ::  :: 컴포넌트 생성 부모 노드 위치.
 * @param {Object} itemSet       :: I :: Y ::  :: 컴포넌트 setItemset 옵션.
 * @param {String} parentFrameId :: I :: Y ::  :: 부모가 될 프레임id
 * @return {Object} Comp 생성된 Component객체.
 * @author 이동규
 * @useMobile use
 * @example ngmf.create("input1", "input", options);  // return false
 * @exampleAsIs Create("Edit","a",'left="100" top="200" width="100" height="25" text="EditBox"');
 */
ngmf.create = function (strCompId, strCompName, strAttrib, parent, itemSet, paarentFrameId) {
	try{
		if (typeof strCompId !== "undefined" && strCompId !== ""
			&& typeof strCompName !== "undefined" && strCompName !== ""
		) {
			if (typeof strAttrib == "undefined") {
				strAttrib = {};
			}
			if (typeof parent == "undefined") {
				parent = "";
			}
			if (typeof itemSet == "undefined") {
				itemSet = "";
			}
			if (typeof paarentFrameId == "undefined") {
				paarentFrameId = "";
			}

			return WebSquare.util.dynamicCreate(strCompId, strCompName, strAttrib, parent, itemSet, paarentFrameId);
		}
	} catch (e) {
		ngmf._error("[ngmf.create] Exception :: ", e);
	}
};

/* 2-6 Vali업무 -------------------------------------------------------------------------------------------------------------- */
/**
 * Infinity 값 여부를 검사하는 Basic API 입니다.
 * @date 2015-12-11
 * @memberOf ngmf
 * @param {Number} number :: I :: N ::  :: Infinity 확인할 값.
 * @return {Boolean} Infinity  확인된 결과. 입력된 실수가 Infinity 값이면 TRUE, 아니면 FALSE를 Return 합니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isInf(number);  // return false
 * @exampleAsIs var PI = 3.1415926535897932384626433832795;
				IsINF( PI / 180.0 );
 */
ngmf.isInf = function (number) {
	try{
		var reuturnValue = false;
		if (typeof number == "number") {
			returnValue = isFinite(number) ? false : true;
		}
		return returnValue;
	} catch (e) {
		ngmf._error("[ngmf.isInf] Exception :: ", e);
	}
};

/**
 * 입력된 Object ID가 존재하는 Object인지 여부를 확인하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} obj :: I :: N ::  :: 확인할 Object id
 * @return {Boolean} 확인할 Object객체의 존재 여부.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isValid("GDS_AUTH");  // return false
 * @exampleAsIs
 * var objObject = Object ( Edit0.Text );
	if( IsValid ( objObject ) )
	{
		objObject.BkColor = "Red";
	}
	else
	{
		Alert ( "찾기 실패" );
	}

 */
ngmf.isValid = function (obj) {
	try{
		var isValid = false;
		
		if (typeof obj == "string") {
			var comp = ngmf.object(obj);
			if (typeof comp != "undefined")	isValid = true;
		}
		
		if (typeof obj == "object") {
			if (typeof obj != "undefined") isValid = true;
		}
		
		return isValid;
	} catch (e) {
		ngmf._error("[ngmf.isValid] Exception :: ", e);
	}
};

/**
 * 입력된 Object가 존재하는 Object 인지 여부를 확인하는 Basic API 입니다.
 * @date 2015-12-21
 * @memberOf ngmf
 * @param {Object} obj :: I :: N ::  :: 정상적으로 존재하는지 여부를 확인할 변수
 * @return {Boolean} 확인할 정상적인 Object라면 TRUE, 아니면 FALSE를 Return 합니다. ngmf.isValid 동일한 API.
 *                   (입력값이 NULL이거나 Object Type이 아닌경우 FALSE를 Return 합니다)
 * @author 이동규
 * @useMobile use
 * @example ngmf.isValidObject(Object);  // return false
 * @exampleAsIs var objObject = Object ( Edit0.Text );
	if( IsValidObject ( objObject ) )
	{
		objObject.BkColor = "Red";
	}
	else
	{
		Alert ( "찾기 실패" );
	}

 */
ngmf.isValidObject = function(obj) {
	try{
		return ngmf.isValid(obj);
	} catch (e) {
		ngmf._error("[ngmf.isValidObject] Exception :: ", e);
	}
};

/**
 * 입력된 값이 Date 형식의 값인지 확인하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String|number} sDate :: I :: N ::  :: date 형식의 값. (yyyyMMdd or yyyyMMddHHmmss)
 * @return {Boolean} Date 형식에 일치하면 true, 아니면 false
 * @author 이동규
 * @useMobile use
 * @update 2016.04.29 이동규 함수 리팩토닝[불분명한 return 값 처리수정.]
 * @example ngmf.isDate("20151012");  // return true
 * @exampleAsIs
 */
ngmf.isDate = function(sDate) {
	var flag = true;
	try{
		if (sDate.length == 8) {
			sDate = sDate+"000000";
		}
		var y1 = parseInt(sDate.substring(0, 4), 10);
		var m1 = parseInt(sDate.substring(4, 6), 10);
		var d1 = parseInt(sDate.substring(6, 8), 10);
		var h1 = parseInt(sDate.substring(8, 10), 10);
		var t1 = parseInt(sDate.substring(10, 12), 10);
		var s1 = parseInt(sDate.substring(12), 10);

		if(isNaN(y1) || isNaN(m1) || isNaN(d1) || isNaN(h1) || isNaN(t1) || isNaN(s1))
			flag = false;

		if (m1 < 1 || m1 >12)
			flag =  false;

		var maxDay = 31;
		if (m1 == 2) {
		    maxDay = ((y1%400==0) || ((y1%4==0)&&(y1%100!=0))) ? 29 : 28;
		} else if ( m1 == 4 || m1 == 6 || m1 == 9 || m1 == 11) {
		    maxDay = 30;
		}

		if (d1 < 1 || d1 >maxDay) {
		    flag = false ;
		}

		if ( h1 + t1 + s1 != "" ){
			if (h1 < 0 || h1 >24) {
				flag = false;
			} else if (h1 == 24) {
				if (t1 > 0)
	        		flag = false;
	        	if (s1 > 0)
	        		flag = false;	
			}
	        if (t1 < 0 || t1 > 59)
	        	flag = false;
	        if (s1 < 0 || s1 > 59)
	        	flag = false;
		}
	} catch (e) {
		ngmf._error("[ngmf.isDate] Exception :: ", e);
		flag = false;
	}
	return flag;
};

/**
 * 입력된 양력의 날짜가 윤년인지 확인합니다.
 * @date 2015-10-22
 * @memberOf ngmf
 * @param {String} pYmd :: I :: N ::  :: 윤달 확인 날짜.
 * @return {boolean} 윤달 유무( true : 윤달)
 * @author 이동규
 * @useMobile use
 * @example ngmf.isLeafYear("20161212");  // return true
 * @exampleAsIs
 */
ngmf.isLeafYear = function (pYmd) {
	try{
		var isLeafYear = false;
		if (!ngmf.isDate(pYmd)) {
			return;
		} else {
			pYmd = pYmd.substr(0, 8);
			var y1 = parseInt( pYmd.substr(0, 4), 10);
			isLeafYear = ((y1 % 400 == 0 ) || ((y1 % 4 == 0) && (y1 % 100 != 0))) ? true : false;
		}
		return isLeafYear;
	} catch (e) {
		ngmf._error("[ngmf.isLeafYear] Exception :: ", e);
	}
};

/**
 * 입력된 값이 공백문자 인지 확인하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 검사할 입력 문자열.
 * @return {boolean} 입력된 값이 공백으로만 이루져 있을 경우 true 반환, 아닌경우 false 반환. 
 * @author 이동규
 * @useMobile use
 * @example ngmf.isSpace("  ");  // return true
 * @exampleAsIs var strText = Radio0.Value;
	if ( strText == "null" )
	{
		strText = Edit0.Text;
	}

	// Check Space
	if ( Length ( strText ) == 1 && IsSpace ( Asc ( strText ) ) == true )
	{
		Alert ( 'A space!' );
	}
	else if ( IsSpace ( strText )  == true )
	{
		Alert ( 'A space!' );
	}
	else
	{
		Alert ( 'Not a space!' );
	}

 */
ngmf.isSpace = function (str) {
	try{
		var pattern = /\s/ ;
		var isSpace = true;
		for (var i = 0; i < str.length; i++) {
			var isFlag = pattern.test(str[i]);
			if (!isFlag) {
				isSpace = false;
				break;
			}
		}
		return isSpace;
	} catch (e) {
		ngmf._error("[ngmf.isSpace] Exception :: ", e);
	}
};

/**
 * 입력된 값이 대문자 Alphabet인지 확인한는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 검사할 입력 문자열.
 * @return {Boolean} 입력된 값이 대문자 Alphabet으로 이루져 있을 경우 true 반환, 아닌경우 false 반환.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isUpper("aAbe");  // return false
 * @exampleAsIs IsUpper("AAA"); // return true
 */
ngmf.isUpper = function (str) {
	try{
		var pattern = /[A-Z]/;
		var isUpper = true;
		for (var i = 0; i < str.length; i++) {
			var isFlag = pattern.test(str[i]);
			if (!isFlag) {
				isUpper = false;
				break;
			}
		}
		return isUpper;
	} catch (e) {
		ngmf._error("[ngmf.isUpper] Exception :: ", e);
	}
};

/**
 * 입력된 값이 소문자 Alpahbet인지 확인하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str :: I :: N ::  :: 검사할 입력 문자열.
 * @return {boolean} 입력된 값이 소문자 Alphabet으로 이루져 있을 경우 true 반환, 아닌경우 false 반환.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isLower("abde");  // return true
 * @exampleAsIs IsLower("abde"); // return true
 */
ngmf.isLower = function (str) {
	try{
		var pattern = /[a-z]/;
		var isLower = true;
		for (var i = 0; i < str.length; i++) {
			var isFlag = pattern.test(str[i]);
			if (!isFlag) {
				isLower = false;
				break;
			}
		}
		return isLower;
	} catch (e) {
		ngmf._error("[ngmf.isLower] Exception :: ", e);
	}
};

/**
 * 입력된 값이 Alphabet 인지 확인하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::       :: Alphabet 여부를 확인할 문장.
 * @param {Boolean} type  :: I :: Y :: false :: 반환 타입 값.
 * @return {String} 확인한 결과. 반환 타이에 따라 1|0 , "Y"|"N"으로 반환합니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isAlpha("aaa");  // return 1
 * @exampleAsIs isAlpha(strEng); // return 1
 */
ngmf.isAlpha = function(sValue, type) {
	try{
		type = WebSquare.util.getBoolean(type || false);
		var trueVal = type ? "Y" : 1;
		var falseVal = type ? "N" : 0;

		var regEx = /[^A-Za-z_]/;
		var sReturnValue = falseVal;

		if (ngmf.isNull(sValue) == "Y") {
			sReturnValue = falseVal;
		} else if (sValue.search(regEx) == -1) {
			sReturnValue = trueVal;
		}

		return sReturnValue;
	} catch (e) {
		ngmf._error("[ngmf.isAlpha] Exception :: ", e);
	}
};

/**
 * 입력된 값이 Alphabet 또는 Number 인지 확인하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::       :: Alphabet 또는 Number 여부를 확인할 Char Code 값.
 * @param {Boolean} type  :: I :: Y :: false :: 반환 타입 값.
 * @return {String} 확인한 결과. 반환 타이에 따라 1|0 , "Y"|"N"으로 반환합니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isAlphaNumber("aaa111"); // return 1
 * @exampleAsIs ngmf_IsAlphaNumber("aaa111"); // return Y
 */
ngmf.isAlphaNumber = function(sValue, type) {
	try{
		type = WebSquare.util.getBoolean(type || false);
		var trueVal = type ? "Y" : 1;
		var falseVal = type ? "N" : 0;

		var regEx = /[^A-Za-z0-9_]/;
		var sReturnValue = falseVal;

		if (ngmf.isNull(sValue) == "Y") {
			sReturnValue = falseVal;
		}else if (sValue.search(regEx) == -1) {
			sReturnValue = trueVal;
		}

		return sReturnValue;
	} catch (e) {
		ngmf._error("[ngmf.isAlphaNumber] Exception :: ", e);
	}
};

/**
 * 입력된 값이 Alphabet 또는 Number 인지 확인하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::  :: Alphabet 또는 Number 여부를 확인할 Char Code 값.
 * @param {Boolean} type  :: I :: Y ::  :: 반환 타입 값.
 * @return {String} 확인한 결과. 반환 타이에 따라 1|0 , "Y"|"N"으로 반환합니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isAlNum("aaa"); // return 1
 * @exampleAsIs IsAlnum("aaa"); // return true

 */
ngmf.isAlNum = function(sValue, type) {
	try{
		return ngmf.isAlphaNumber(sValue, type);
	} catch (e) {
		ngmf._error("[ngmf.isAlNum] Exception :: ", e);
	}
};

/**
 * 입력된 데이터가 null인지 판단하는 API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} sValue :: I :: N ::  :: 판단할 값.
 * @return {String} Null일 경우(null, undefined, "") "Y", 아닌경우 "N" 
 * @sampleLink grd_detailView
 * @author 이동규
 * @useMobile use
 * @example ngmf.isNull();  // return "Y"
 * @exampleAsIs
 */
ngmf.isNull = function(sValue) {
	try{
		var sReturnValue = "N";

		if (ngmf.length(ngmf.toString(sValue)) == 0 )
			sReturnValue = "Y";
		else
			sReturnValue = "N";

		return sReturnValue;
	} catch (e) {
		ngmf._error("[ngmf.isNull] Exception :: ", e);
	}
};

/**
 * 입력된 값이 String 인지 확인하는 API 입니다.
 * @date 2015-10-26
 * @memberOf ngmf
 * @param {Object} str :: I :: N ::  :: String 인지 여부를 확인할 값.
 * @return {Boolean} type이 String 이면 true, 아니면 false.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isString("20151012");  // return true
 * @exampleAsIs
 */
ngmf.isString = function (str) {
	try{
		return WebSquare.util.isString(str);
	} catch (e) {
		ngmf._error("[ngmf.isString] Exception :: ", e);
	}
};

/**
 * 입력된 값이 Number 인지 확인하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String/Number} sValue  :: I :: N ::  :: Number 인지 여부를 확인할 Char Code값.
 * @param {Boolean} type :: I :: Y ::  :: 반환 타입 값.
 * @return {String} 확인한 결과. 반환 타이에 따라 1|0 , "Y"|"N"으로 반환합니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isDigit("20151012");  // return 1
 * @exampleAsIs // 문자열로 확인시.
	Alert( IsDigit( Edit0.Text ) );
	// Charcode값으로 로 확인시.
	Alert( IsDigit( Asc(Edit0.Text) ) );

 */
ngmf.isDigit = function (sValue, type) {
	try{
		type = WebSquare.util.getBoolean(type || false);
		var trueVal = type ? "Y" : 1;
		var falseVal = type ? "N" : 0;

		var regEx = /[^0-9_]/;
		var result = falseVal;

		if (typeof sValue == "string") {
			if (sValue.search(regEx) == -1) {
				result = trueVal;
			}
		} else if (typeof sValue =="number") {
			result = trueVal;
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.isDigit] Exception :: ", e);
	}
};

/**
 * 입력된 정수값이 홀수 인지 판별합니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} num :: I :: N ::  :: 문자열 또는 넘버타입의 값..
 * @return {Boolean} 입력값이 홀수인 경우 true, 짝수인경우 false. 입력값이 홀수, 작수가 아닌경우 입력값 리턴.
 * @author 이동규
 * @useMobile use
 * @example ngmf.isOdd("20151012");  // return false
 * @exampleAsIs
 */
ngmf.isOdd = function (num) {
	try{
		var result = "";
		if (typeof num == "string") {
			result = isNaN(parseInt(num)) ? num : WebSquare.util.isOdd(ngmf.parseInt(num));
		} else {
			result = WebSquare.util.isOdd(num);
		}
		return result;
	} catch (e) {
		ngmf._error("[ngmf.isOdd] Exception :: ", e);
	}
};

/**
 * 입력된 Variable의 형태 이름을 구하는 Basic API 입니다.
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Object} sValue :: I :: N ::  :: Type을 구하려고하는 Variable.
 * @return {String} 입력된 Variable의 Type  이름.
 * @author 이동규
 * @useMobile use
 * @example ngmf.type("20151012");  // return "DATE"
 * @exampleAsIs
 */
ngmf.type = function (sValue) {
	try{
		var type;
		if (typeof sValue == "string") {
	 		var pattern = /^[$￦＄]|,/g;
			if (typeof ngmf.binToText(sValue) != "undefined" && ngmf.binToText(sValue) != "") {
					type = "BINARY";
			} else if (ngmf.isDate(sValue)) {
				type = "DATE";
			} else if (pattern.test(sValue)) {
				type = "CURRENCY";
			} else {
				type = "STRING";
			}
		} else if (typeof sValue == "number") {
			if (sValue % 1 === 0) {
				type = "INTEGER";
			} else {
				type = "DECIMAL";
			}
		} else if (typeof sValue == "object") {
			if (Array.isArray(sValue)) {
				type = "ARRAY";
			} else if (sValue == null) {
				type = null;
			}else {
				type = "object";
			}
		} else if (typeof sValue == "boolean") {
			type = "boolean";
		} else {
			type = "UNKOWN";
		}

		return type;
	} catch (e) {
		ngmf._error("[ngmf.type] Exception :: ", e);
	}
};

/**
 * 현재 PopupDiv의 Script에서 특정 Variable이 존재하는지 여부를 검색하는 API 입니다.
 * (현재 PopupDiv에서 존재하지 않는 경우 상위 Form 또는 Window에서 검색할지 여부를 지정할 수 있습니다)
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} strVarId        :: I :: N ::       :: 찾고자 하는 Variable의 Name.
 * @param {Boolean} bSearchAllFlag :: I :: Y :: false :: 상위 Form 또는 Window에서도 검색할지 여부. TRUE이면 상위 Form 또는 Window에서도 검색합니다.
 * @return {Boolean} 검색결과. 찾으면 TRUE, 아니면 FALSE를 Return 합니다.
 * @author 이동규
 * @update 2016.04.12 이동규 IsExistVar에 대한 컨버전 매핑 방안에 따른 함수 수정.
 * 1) ngmf.isExistVar 함수를 파라미터 존재 여부까지 체크하도록 기능 확대
 * 2) ngmf.isNull 함수의 파라미터 존재 여부 체크 기능은 현재 상태 유지
 * 3) 향후 공식 가이드와 컨버전에서는 파라미터 존재 여부 체크를 위해 ngmf.isExistVar를 사용하는 것을 가이드
 * 4) 단, 기존에 ngmf.isNull 사용도 굳이 수정할 필요는 없음
 * @example ngmf.isExistVar("dataA", true);  // return 1
 * @exampleAsIs var strText = ""; div_SearchPanel1.cob_ObjCd.GetSelText();  // W_20070212_1 ¿ÍÀÌºê·Î µÇµµ·Ï ¼öÁ¤
	var i_Fnd = -1;

	div_SearchPanel1.cob_ObjCd.Index = 1;

	// v20101118_È²°æÈ£ Ãß°¡
	if ( IsExistVar("FA_eqp_cl_cd",true) )
	{
		if( ngmf_IsNull(FA_eqp_cl_cd) == "N" )
		    DS_In.SetColumn(0,"eqp_cl_cd",FA_eqp_cl_cd);
	}

	if ( IsExistVar("FA_eqp_mdl_cd",true) )
	{
		if( length(FA_eqp_mdl_cd) >= 4 && length(FA_eqp_ser_num) >= 7 )		//20100607_´Ü¸»±â ÀÏ·Ã¹øÈ£
		{
			div_SearchPanel1.edt_EqpMdlNm.Text = FA_eqp_mdl_cd;
			div_SearchPanel1_btn_EqpMdlNm_Lov_OnClick();
			div_SearchPanel1.edt_EqpSerNum.Text = FA_eqp_ser_num;
			div_SearchPanel1_btn_Search_OnClick();
		}
		else
			div_SearchPanel1.edt_EqpMdlNm.SetFocus();
	}

	if ( IsExistVar("FA_screenName",true) )
	{
		i_Fnd = DS_curr_6.SearchRow("comm_cd_val_nm = " + quote(FA_screenName) );
		if( i_Fnd >= 0 )
		{
			F_OtherSearchNone();
		}
	}
 */
ngmf.isExistVar = function (strVarId, bSearchAllFlag) {
	try{
		var result = 0;
		var win = window;		
		
		if (typeof strVarId !== "undefined") {
			var scvarObj = Object.keys(scvar);
			if (scvarObj.length > 0 && scvarObj.indexOf(strVarId) > -1) {
				result = 1;
		    } else if (strVarId in window) {
		    	result = 1;
		    } else if (win.ngmf.isPopup()) {
				var parmater = win.ngmf.popupParam().argument;
				if (typeof parmater[strVarId] != "undefined") {
					result = 1;
				}
			}

		    if (result == 0 && bSearchAllFlag) {
		    	var parentWin = "";
		    	var parentStr = "";

				do {
					try{
				    	if(parentWin == "") {
				    		parentWin = win;
				    	}

				    	if (parentWin.ngmf.isPopup()) {
				    		parentWin = parentWin.ngmf.popupParam().parentForm; 
				    	} else if (parentStr == ""){
				    		parentStr = "parent.window";
				    		parentWin = parent.window;
				    	} else {
				    		parentStr = "parent." + parentStr;
				    		parentWin = eval(parentStr);
				    	}

						var scvarObj = Object.keys(parentWin.scvar);
						if (scvarObj.length > 0 && scvarObj.indexOf(strVarId) > -1) {
							result = 1;
							break;
					    } else if (strVarId in parentWin) {
					    	result = 1;
					    	break;
					    } else if (typeof parentWin.ngmf.popupParam().argument[strVarId] != "undefined") {
							result = 1;
							break;
					    } else {
					    	if (parentWin.opener) {
								if (strVarId in parentWin.opener) {
									result = 1;
									break;
								}
							}
					    }
					} catch(e) {

					}
				}  while (GLD.scvar.__screenName != parentWin.scvar.__screenName);

				if (window.opener) {
					var scvarObj = Object.keys(window.opener.scvar);
					if (scvarObj.length > 0 && scvarObj.indexOf(strVarId) > -1) {
						result = 1;
				    } else if (strVarId in window.opener) {
				    	result = 1;
				    }
				}
		    }
		}
		return result;
	} catch (e) {
		ngmf.error("[ngmf.isExistVar] Exception :: ", e);
	}
};

/**
 * 현재 PopupDiv의 Script에서 특정 Function이 존재하는지 여부를 검색하는 API 입니다.
 * (현재 PopupDiv에 존재하지 않는 경우 상위 Form 또는 Window에서 검색할지 여부를 지정할 수 있습니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} strFuncID       :: I :: N ::       :: 검색하고자 하는 Function의 Name.
 * @param {Boolean} bSearchAllFlag :: I :: Y :: false :: 상위 Form 또는 Window에서도 검색할지 여부. TRUE이면 상위 Form 또는 Window에서도 검색합니다.
 * @return {Boolean} 검색결과. 찾으면 TRUE, 아니면 FALSE를 Return 합니다.
 * @author 이동규
 * @useMobile use
 * @update 2016.04.26 이동규 parentWin 가 최상위 GLD 일경우 opner 참조에서 크로스도메인 오류가 발생하는 부분 수정.
 * @example ngmf.isExistFunc("dataA", true);  // return 1
 * @exampleAsIs
 */
ngmf.isExistFunc = function (strFuncID, bSearchAllFlag) {
	try{
		var result = 0;
		var win = window;
		var object = "";
		var funcNm = "";
		if(strFuncID.indexOf("ngmf") > -1) {
			object = "ngmf";
			funcNm = strFuncID.split(".")[1];
		} else if (strFuncID.indexOf(".") > -1) {
			object = strFuncID.split(".")[0];
			funcNm = strFuncID.split(".")[1];
		}
		if (typeof window[object] !== "undefined" && typeof window[object][funcNm] == "function") {
			result = 1;
		} else if (bSearchAllFlag) {
			var parentStr = "parent.window";
			do {
				var parentWin = eval(parentStr);
				if (typeof parentWin[object] != "undefined" && typeof parentWin[object][funcNm] != "undefined") {
					result = 1;
					break;
				} else {
					if (GLD != parentWin && parentWin.opener) {
						if (typeof parentWin.opener[object] != "undefined" && typeof parentWin.opener[object][funcNm] != "undefined") {
							result = 1;
							break;
						}
					} else {
						break;
					}
					parentStr = "parent." + parentStr;
				}
			} while (GLD != parentWin);

			if (window.opener) {
				if (typeof window.opener[object] !="undefined" && typeof window.opener[object][funcNm] != "undefined") {
					result = 1;
				}
			}
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.isExistFunc] Exception :: ", e);
	}
};

/**
 * function 여부를 검사합니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {Object} functionToCheck :: I :: N ::  :: function id
 * @author 이동규
 * @useMobile use
 * @example ngmf.isFunction(functionToCheck) //return true
 * @exampleAsIs
 */
ngmf.isFunction = function (functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

/**
 * JSON Object인지 여부를 검사합니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {Object} json :: I :: N ::  :: JSON Object or String
 * @return {Boolean} JSON 객체 여부 (JSON 객체인 경우 true, 아닌경우 false)
 * @author 이동규
 * @useMobile use
 * @example ngmf.isJSON({test: "test"}); //return true
 * @exampleAsIs
 */
ngmf.isJSON = function (json) {
	try {
		if (jQuery.isPlainObject(json) === false && ngmf.isArray(json) === false) {
			return false;
		}

		if (typeof json === "object") {
			if (JSON.stringify(json)) {
				return true;
			} else {
				return false;
			}
		} else if (typeof json === "string") {
			if (JSON.parse(json)) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	} catch (e) {
		return false;
	}
};

/**
 * 배열 객체인지 여부를 확인한다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {Object} array :: I :: N ::  :: Array Object or String
 * @return {Boolean} Array 배열 판단 여부(Array 객체인 경우 true, 아닌경우 false)
 * @author 이동규
 * @useMobile use
 * @example ngmf.isArray(arrayId); // return true
 * @exampleAsIs
 */
ngmf.isArray = function (array) {
	try{
		if ((typeof array !== "undefined") && (array !== null) && (typeof array == "object")) {
			if (array.constructor.name && array.constructor.name.toLowerCase() == "array")
				return true;
			if (array.constructor && array.constructor == Array)
				return true;
		}
		return false;
	} catch (e) {
		ngmf._error("[ngmf.isArray] Exception :: ", e);
	}
};

/**
 * 화면 브라우저 확인하는 API 입니다.
 * @date 2015-10-29
 * @memberOf ngmf
 * @return {String} 브라우저 명칭 반환 (IE : Internet Explorer, CH : Chrome , FF : Firefox , OP : Opera, SF : Safari)
 * @author 이동규
 * @useMobile use
 * @example ngmf.isBrowser(); //return true
 * @exampleAsIs
 */
ngmf.isBrowser = function () {
	try{
		var browser = "";

		if (WebSquare.util.isIE()) {
			browser = "IE";
		} else if (WebSquare.util.isChrome()) {
			browser = "CH";
		} else if (WebSquare.util.isFF()) {
			browser = "FF";
		} else if (WebSquare.util.isOpera()) {
			browser = "OP";
		} else if (WebSquare.util.isSafari()) {
			browser = "SF";
		}

		return browser;
	} catch (e) {
		ngmf._error("[ngmf.isBrowser] Exception :: ", e);
	}
};

/* 2-7 etc 기타업무 ----------------------------------------------------------------------------------------------------------- */
/**
 * TextArea의 입력 Caret이 위치한 Index를 구하는 API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} compId :: I :: N ::  :: 선택할 TextArea 컴포넌트.
 * @return {Number} Caret의 Index를 반환합니다.
 * @author 이동규
 * @useMobile use
 * @example ngmf.getCaretPos("txa_test");
 * @exampleAsIs
 */
ngmf.getCaretPos = function (compId) {
	try{
		var comp = ngmf.object(compId);

		var result = "";
		if (typeof comp != "undefined" && comp.getPluginName() == "textarea") {
			result =$("#"+comp.id).prop("selectionStart");
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.getCaretPos] Exception :: ", e);
	}
};

/**
 * TextArea에 지정한 위치에 문자열을 삽입하는 API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} compId  :: I :: N ::  :: 선택할 TextArea 컴포넌트.
 * @param {Number} nPos    :: I :: Y ::  :: 삽입될 위치의 Index. 줄에 관계없이 첫글자를 0 으로 시작하는 Index 입니다.
 * @param {String} strText :: I :: Y ::  :: 삽입할 문자열.
 * @author 이동규
 * @useMobile use
 * @example ngmf.insertText("txa_test", 3, "test");
 * @exampleAsIs
 */
ngmf.insertText = function (compId, nPos, strText) {
	try{
		var comp = ngmf.object(compId);

		var result = 0;
		if (typeof comp != "undefined" && comp.getPluginName() == "textarea") {
			var getValue = comp.getValue();

			var preStr = ngmf.subStr(getValue, 0, nPos);
			var lastStr = ngmf.subStr(getValue, nPos);
			var allStr = preStr + strText + lastStr;
			comp.setValue(allStr);
		}
	} catch (e) {
		ngmf._error("[ngmf.insertText] Exception :: ", e);
	}
};

/** 화면의 windowContainer의 window객체를 찾는 API 입니다.
 * @date 2015.11.25
 * @memberOf ngmf
 * @param {String} sceenId :: I :: Y ::  :: 찾을 window의 window 아이디 입니다.
 * @return {Object} 화면에 존재하는 widnows 객체 또는 입력받은 windowId 에 해당하는 window객체.
 * @useMobile use
 * @example var allWindows = ngmf.allWindows();  //화면 windowContainer에 존재하는 모든 window객체를 반환.
 * @example var findWindow = ngmf.allWindows("screenId");  //화면 windowContainer에 windowID가 'screenId'인 window객체를 반환. (존재하지 않을 경우 undefined 입니다.)
 * @exampleAsIs
 if(Global.MainLeft.Visible) {
		if(global.windows.count > 8) {
			var objWin = AllWindows(G_ACTIVE_FORMID);
			if(objWin[0] != null) {

				if(objWin[0].IsExistVar("fmainBodyWindowSize")) {
					if(GDS_PRIVATE_CONFIGURATION.GetColumn(0, "commonframe_visible") == 0)
						objWin[0].fmainBodyWindowSize = "R";
					else
						objWin[0].fmainBodyWindowSize = "";
				}
			}
		}

	} else {
		if(global.windows.count > 8) {
			var objWin = AllWindows(G_ACTIVE_FORMID);
			if(objWin[0] != null) {

				if(objWin[0].IsExistVar("fmainBodyWindowSize")) {
					if(GDS_PRIVATE_CONFIGURATION.GetColumn(0, "commonframe_visible") == 1)
						objWin[0].fmainBodyWindowSize = "F";
					else
						objWin[0].fmainBodyWindowSize = "D";
				}
			}
		}
	}
* @update 2016.05.24 이동규 모바일 공통 정리.
*/
ngmf.allWindows = function(screenId) {
	try{
		if(ngmf.isMobile()) {
	        var iframes = document.getElementsByClassName("mobileBody");
	        if (iframes.length == 0) {
	        	iframes = GLD.document.getElementsByClassName("mobileBody");
	        }
	        if (typeof screenId !== "undefined"){
	        	var returnWindows = null;
				for ( var i = 0; i < iframes.length; i++) {
			 		var getSrc = iframes[i].src;
			 		if (getSrc.indexOf(strFormid + ".xml") > -1) {
						ifrObj = GLD.ngmf.object(iframes[i].id);
						returnWindows = ifrObj.getWindow();
						break;
					}
				}
				return returnWindows;
			} else {
				var returnWindows = new Array()
				for ( var i = 0; i < iframes.length; i++) {
			 		var getSrc = iframes[i].src;
			 		if (!(getSrc.indexOf("about:blank") > -1)) {
						ifrObj = GLD.ngmf.object(iframes[i].id);
						objForm = ifrObj.getWindow();
						returnWindows.push(objForm);
					}
				}	
				return returnWindows;
			}
		} else {
			var returnWindows = "";
			var windowMDI = ngmf.mdiTabs();
			if (typeof screenId !== "undefined" && screenId !== "") {
				returnWindows = undefined;
				for (var i = 0 ; i < windowMDI.windows.length ; i++) {
					if (windowMDI.windows[i].windowId == screenId) {
						returnWindows = windowMDI.windows[i];
						break;
					}
				}
			} else {
				returnWindows = windowMDI.windows;
			}
			return returnWindows;
		}
	} catch (e) {
		ngmf._error("[ngmf.allWindows] Exception :: ", e);
	}
};

/**
 * 테이블의 같은 Tr 내부의 TD내부 테이블들의 높이를 자동 설정해주는 API 입니다.(pubComm.tableHeightSet)
 * pubComm.js 로 이동기존 사용 오류 유지건 (추후 사용 금지)
 * @date 2015-12-21
 * @author 이동규
 * @useMobile use
 * @exampleAsIs
 */
ngmf.tableHeightSet = function() {
	try{
		pubComm.tableHeightSet();
	} catch (e) {
		ngmf._error("[ngmf.tableHeightSet] Exception :: ", e);
	}
};

/**
 * OverLayer 그룹을 설정하는 API 입니다.
 * pubComm.js 로 이동기존 사용 오류 유지건 (추후 사용 금지)
 * @date 2015.12.22
 * @param {Object} btnComp :: I :: N ::  :: OverLayer 속성을 정의할 버튼
 * @param {Object} target  :: I :: N ::  :: OverLayer의 target 그리드Id
 * @param {Number} width   :: I :: Y ::  :: OverLayer 할 width의 크기
 * @param {Number} height  :: I :: Y ::  :: OverLayer 할 height의 크기
 * @param {Boolean} btmoption         :: I :: Y :: false  :: OverLayer UP 시 Bottom 5px 미적용
 * @sampleLink scm_zoomOpen
 * @author 이동규
 * @useMobile use
 * @exampleAsIs
 */
ngmf.setOverLayer = function (btnComp, target, width, height, _btmoption ) {
	try{
		pubComm.setOverLayer(btnComp, target, width, height, _btmoption||false);
	} catch (e) {
		ngmf._error("[ngmf.setOverLayer] Exception :: ", e);
	}
};

/**
 * trigger 컴포넌트의 라벨을 변경하는 API입니다.
 * @date 2015.12.23
 * @param {Object} compId :: I :: N ::  :: Label을 변경할 컴포넌트 객체 또는 컴포넌트 ID
 * @param {Object} label  :: I :: N ::  :: 변경할 Label의 텍스트.
 * @memberOf ngmf
 * @author 이동규
 * @useMobile use
 * @example ngmf.setLabel("btn_trigger1", "수정텍스트");
 * @exampleAsIs
 */
ngmf.setLabel = function (compId, label) {
	try{
		var triggerComp =  ngmf.object(compId);

		if (typeof triggerComp !== "undefined") {
			if (triggerComp.getPluginName() == "trigger") {
				if (triggerComp.getDisabled()) {
					triggerComp.setDisabled(false);
					triggerComp.setLabel(label);
					triggerComp.setDisabled(true);
				} else {
					triggerComp.setLabel(label);
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.setLabel] Exception :: ", e);
	}
};

/* 2-8 단축키 지정업무--------------------------------------------------------------------------------------------------------- */
ngmv.shortcutKey = {};
ngmv.shortcutKey.key = {};
ngmv.shortcutKey.doubleKey = "";
ngmv.shortcutKey.shiftArr = new Array();
ngmv.shortcutKey.ctrlArr = new Array();
ngmv.shortcutKey.altArr = new Array();
ngmv.shortcutKey.altshiftArr = new Array();
ngmv.shortcutKey.ctrlshiftArr = new Array();
ngmv.shortcutKey.ctrlaltArr = new Array();
ngmv.shortcutKey.codeArr = new Array();

/*
ngmv.shortcutKey.ctrlArr["F1"] = "C:btn_Menu";
ngmv.shortcutKey.ctrlArr["F2"] = "F:windowReload";
ngmv.shortcutKey.ctrlArr["TAB"] = "F:windowTabMove";
*/

if (navigator.userAgent.indexOf("W-Browser") > -1) {	
	ngmv.shortcutKey.ctrlArr["num1"] = "F:scwin.shortcut_selectTab1";
	ngmv.shortcutKey.ctrlArr["num2"] = "F:scwin.shortcut_selectTab2";
	ngmv.shortcutKey.ctrlArr["num3"] = "F:scwin.shortcut_selectTab3";
	ngmv.shortcutKey.ctrlArr["TAB"] = "F:scwin.shortcut_moveTab";
	ngmv.shortcutKey.ctrlArr["F6"] = "F:scwin.shortcut_pageRefresh";
	//ngmv.shortcutKey.ctrlshiftArr["F"] = "F:scwin.btn_findPop_onclick"; //통합검색 설정.
}

/**
 * 단축키에 입력된 키보드 이벤트를 확인합니다.
 * @date 2015-10-29
 * @memberOf ngmf
 * @sampleLink scm_shortKey
 * @author 이동규
 * @example ngmf.shortcutEvent();
 * @exampleAsIs
 * @useMobile useless
 */
ngmf.shortcutEvent = function() {
	if(ngmf.isMobile()) {
		//ngmf.alert("ngmf.shortcutEvent : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try{
		//document.onkeydown = ngmf._shortcutOnkeydown;
		//document.onkeyup = ngmf._shortcutOnkeyup;
	} catch (e) {
		ngmf._error("[ngmf.shortcutEvent] Exception :: ", e);
	}
};


ngmf._shortcutOnkeyup = function(e) {
	try{
		e = e || event;
		
		if (false && GLV.G_DEVFG =="L" && e.ctrlKey && e.keyCode == 67) return;//copy
		if (false && GLV.G_DEVFG =="L" && e.ctrlKey && e.keyCode == 86) return;//paste
		if (GLV.G_DEVFG =="L" && e.altKey && e.keyCode == 67) return;//copy
		if (GLV.G_DEVFG =="L" && e.altKey && e.keyCode == 86) return;//paste
		
		var browser = ngmf.isBrowser();
		var complex = ngmf._shortcutOnkeydown(e);
		var eventKey = e.which || e.keyCode;
		var codeKey = (complex) ? (complex + "_" + eventKey) : eventKey;

		if (browser === "FF") {
			if (e.target.tagName !== "TEXTAREA") {
				eventKey = e.key.toUpperCase();
				ngmf._findShortcut(complex, codeKey, eventKey);
			}
		} else {
			if (e.target.tagName !== "TEXTAREA") {
				if (eventKey >= 112 && eventKey <= 123) {
					var F_Number = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];
					eventKey = F_Number[eventKey-112];
				} else if (eventKey == 9) {
					eventKey = "TAB";
				} else {
					eventKey = String.fromCharCode(eventKey).toUpperCase();
				}
				ngmf._findShortcut(complex, codeKey, eventKey);
			}
		}
	} catch (ex) {
		ngmf._error("[ngmf._shortcutOnkeyup] Exception :: ", ex);
	}
};

ngmf._shortcutOnkeydown = function(e) {
	try {
		ngmv.shortcutKey.doubleKey = "";
		e = e || event;
		//단축키 운영단계적용. 
		//copy & paste
		if (false && GLV.G_DEVFG =="L" && e.ctrlKey && e.keyCode == 67) {
			document.oncopy = function(copyE) {
				//GLV["clipboardData"] = window.getSelection().toString();
				if (WebSquare.util.isIEAllVersion()) {
			    	window.clipboardData.clearData(); 
			    } else {    
			     	copyE.clipboardData.clearData();
			    }
		    	copyE.preventDefault();
		    	copyE.stopPropagation();
		    	return false;
		    };
			return "copy";
		} else if(GLV.G_DEVFG =="L" && e.altKey && e.keyCode == 67) {
			GLV["clipboardData"] = window.getSelection().toString();
		} else if (false && GLV.G_DEVFG =="L" && e.ctrlKey && e.keyCode == 86) {
			/*
			if (GLV["clipboardData"]) {
				ngmf.insertAtCursor(e.target.id, GLV["clipboardData"]); 
			}*/
			if (typeof $("#"+e.target.id)[0].onpaste != "function") {
				$("#"+e.target.id)[0].onpaste = function(pasteE) {
				    if (WebSquare.util.isIEAllVersion()) {
						window.clipboardData.clearData(); 
				    } else {    
				    	pasteE.clipboardData.clearData();
				    }
				    pasteE.preventDefault();
				    pasteE.stopPropagation();
				    return false;
				}
			}
			return "paste";
		} else if (GLV.G_DEVFG =="L" && e.altKey && e.keyCode == 86) {
			if (GLV["clipboardData"]) {
				ngmf.insertAtCursor(e.target.id, GLV["clipboardData"]); 
			}
		} else {
			var browser = ngmf.isBrowser();
			var eventKey = e.which || e.keyCode;

			if (e.ctrlKey && e.altKey) {
				ngmv.shortcutKey.doubleKey = "CTRL_ALT";
			} else if (e.ctrlKey && e.shiftKey) {
				ngmv.shortcutKey.doubleKey = "CTRL_SHIFT";
			} else if (e.altKey && e.shiftKey) {
				ngmv.shortcutKey.doubleKey = "ALT_SHIFT";
			} else {
				if (e.shiftKey) {
					ngmv.shortcutKey.doubleKey = "SHIFT";
				} else if (e.ctrlKey) {
					ngmv.shortcutKey.doubleKey = "CTRL";
				} else if (e.altKey) {
					ngmv.shortcutKey.doubleKey = "ALT";
				}
			}
			var complex = ngmv.shortcutKey.doubleKey;
			var codeKey = (complex != "") ? (complex + "_" + eventKey) : eventKey;
			if (browser === "FF") {
				if (e.target.tagName !== "TEXTAREA") {
					eventKey = e.key.toUpperCase();
					ngmf._findShortcut(complex, codeKey, eventKey);
				}
			} else {
				if (e.target.tagName !== "TEXTAREA") {
					if (eventKey >= 112 && eventKey <= 123) {
						var F_Number = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"];
						eventKey = F_Number[eventKey-112];
					} else if (eventKey == 9) {
						eventKey = "TAB";
					} else {
						eventKey = String.fromCharCode(eventKey).toUpperCase();
					}
					ngmf._findShortcut(complex, codeKey, eventKey);
				}
			}
		}
	} catch(ex) {
		ngmf._error("[ngmf._shortcutOnkeydown] Exception :: ", ex);
	}
};


ngmf._findShortcut = function(complex, searchKey, lastKey) {
	try {
		var searchEvent;
		var target;
		var charCode;

		if (complex === "SHIFT") {
			searchEvent = ngmf._shiftKey(lastKey);
		} else if (complex === "CTRL") {
			searchEvent = ngmf._ctrlKey(lastKey);
		} else if (complex === "ALT") {
			searchEvent = ngmf._altKey(lastKey);
		} else if (complex === "CTRL_SHIFT") {
			searchEvent = ngmf._ctrlshiftKey(lastKey);
		} else if (complex === "CTRL_ALT") {
			searchEvent = ngmf._ctrlaltKey(lastKey);
		} else if (complex === "ALT_SHIFT") {
			searchEvent = ngmf._ctrlaltKey(lastKey);
		} else {
			searchEvent = ngmf._singleKey(lastKey);
		}

		if (typeof searchEvent !== "undefined") {
			charCode = searchEvent.charAt(0);
			if (charCode === "F") {
				searchEvent = searchEvent.replace("F:", "");
				funcObj = ngmf._compFunc(searchEvent);
				if (ngmf.isFunction(funcObj)) {
					funcObj();
				}
			} else if (charCode === "C") {
				searchEvent = searchEvent.replace("C:", "");
				target = ngmf._compTarget(searchEvent);
				ngmf._click(target);
			} else if (charCode === "P") {
				searchEvent = searchEvent.replace("P:", "");
				ngmf.createMDI(searchEvent);
			}
		}
	} catch(e) {
		ngmf._error("[ngmf._findShortcut] Exception :: ", e);
	}
};

ngmf._pageUrl = function(pageOption) {
	try{
		var comp = parent.ngmf.object(pageOption.windowId) || ngmf.object(pageOption.windowId);
		var title = pageOption.title;
		var urlSrc = pageOption.src;
		if (typeof comp !== "undefined") {
			ngmf.createMDI(comp.getID());
		}
	} catch (e) {
		ngmf._error("[ngmf._pageUrl] Exception :: ", e);
	}
};

ngmf._click = function(target) {
	try{
		target.trigger("onclick");
	} catch (e) {
		ngmf._error("[ngmf._click] Exception :: ", e);
	}
};

ngmf._compTarget = function(event) {
	try {
		var targetComp = "";
		var parentComp = parent[event];
		var oneselfComp = document.getElementById(event);

		if (typeof parentComp === "undefined" && oneselfComp == null) {
			var windowContainer = [];

			if (WebSquare.util.isIE() && WebSquare.util.browserVersion() < 10) {
				windowContainer = document.querySelectorAll(".w2windowContainer");
			} else {
				windowContainer = document.getElementsByClassName("w2windowContainer");
			}

			if (windowContainer.length > 0) {
				windowContainer = windowContainer[0];
				var wcId = eval(windowContainer.id);
				var iframeSelect = wcId.getSelectedIndex();
				if (iframeSelect > -1) {
					var wcIframId = wcId.getSelectedWindowId();
					var wcIframDom = wcId.getWindow(wcIframId) || wcId.getWindowByWindowId(wcIframId);
					targetComp = wcIframDom[event];
				}
			} else {
				if (!parent.frameElement && ngmf.object(event)) {
					targetComp = eval(event);
				}
			}
		} else if (typeof parentComp !== "undefined" && oneselfComp == null) {
			if (parent.frameElement) {
				targetComp = "";
			} else {
				targetComp = parentComp;
			}
		} else if (typeof parentComp === "undefined" && ngmf.object(event)) {
			targetComp = eval(event);
		} else {
			targetComp = parentComp;
		}

		return targetComp;
	} catch(e) {
		ngmf._error("[ngmf._compTarget] Exception :: ", e);
	}
};

ngmf._shiftKey = function(key) {
	try{
		if (parseInt(key, 10).toString() !== "NaN") {
			key = "num"+key.toUpperCase();
		}

		for (var i in parent.ngmv.shortcutKey.shiftArr) {
			if (key === i) {
				return parent.ngmv.shortcutKey.shiftArr[i];
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._shiftKey] Exception :: ", e);
	}
};

ngmf._ctrlKey = function(key) {
	try{
		if (parseInt(key, 10).toString() !== "NaN") {
			key = "num"+key.toUpperCase();
		}

		for (var i in parent.ngmv.shortcutKey.ctrlArr) {
			if (key === i) {
				return parent.ngmv.shortcutKey.ctrlArr[i];
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._ctrlKey] Exception :: ", e);
	}
};

ngmf._altKey = function(key) {
	try{
		if (parseInt(key, 10).toString() !== "NaN") {
			key = "num"+key.toUpperCase();
		}

		for (var i in parent.ngmv.shortcutKey.altArr) {
			if (key === i) {
				return parent.ngmv.shortcutKey.altArr[i];
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._altKey] Exception :: ", e);
	}
};

ngmf._ctrlshiftKey = function(key) {
	try{
		if (parseInt(key, 10).toString() !== "NaN") {
			key = "num"+key.toUpperCase();
		}

		for (var i in parent.ngmv.shortcutKey.ctrlshiftArr) {
			if (key === i) {
				return parent.ngmv.shortcutKey.ctrlshiftArr[i];
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._ctrlshiftKey] Exception :: ", e);
	}
};

ngmf._ctrlaltKey = function(key) {
	try{
		if (parseInt(key, 10).toString() !== "NaN") {
			key = "num"+key.toUpperCase();
		}

		for (var i in parent.ngmv.shortcutKey.ctrlaltArr) {
			if (key === i) {
				return parent.ngmv.shortcutKey.ctrlaltArr[i];
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._ctrlaltKey] Exception :: ", e);
	}
};

ngmf._altshiftKey = function(key) {
	try{
		if (parseInt(key, 10).toString() !== "NaN") {
			key = "num"+key.toUpperCase();
		}

		for (var i in parent.ngmv.shortcutKey.altshiftArr) {
			if (key === i) {
				return parent.ngmv.shortcutKey.altshiftArr[i];
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._altshiftKey] Exception :: ", e);
	}
};

ngmf._singleKey = function(key) {
	try{
		if (parseInt(key, 10).toString() !== "NaN") {
			key = "num"+key.toUpperCase();
		}

		for (var i in parent.ngmv.shortcutKey.codeArr) {
			if (key === i) {
				return parent.ngmv.shortcutKey.codeArr[i];
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._singleKey] Exception :: ", e);
	}
};

/** 키보드 이벤트에 적용된 키 값을 구합니다.
 * @date 2016-01-26
 * @memberOf ngmf
 * @param  {Object} e :: I :: N ::  :: 키보드 이벤트 객체.
 * @returns {Number} e에 발생된 key값.
 * @author 이동규
 * @example ngmf.getKeyCode(e);
 * @exampleAsIs
 * @useMobile useless
 */
ngmf.getKeyCode = function(e) {
	if(ngmf.isMobile()) {
		//ngmf.alert("ngmf.getKeyCode : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try{
		return e.keyCode || e.which;
	} catch (ex) {
		ngmf._error("[ngmf.getKeyCode] Exception :: ", ex);
	}
};

/**
 * 화면별로 단축키를 설정 API 입니다.
 * @date 2015-11-26
 * @param {Object} object :: I :: N ::  :: 단축키 설정 객체 (여러건의 단축키 일경우 객체 배열.)
 * @memberOf ngmf
 * @sampleLink scm_shortKey
 * @author 이동규
 * @example ngmf.setKeyCode();
 * @exampleAsIs
 * @useMobile useless
 */
ngmf.setKeyCode = function(object) {
	if(ngmf.isMobile()) {
		//ngmf.alert("ngmf.setKeyCode : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try{
		var isArray = (Object.prototype.toString.call(object) === "[object Array]");

		if (isArray) {
			for (var i in object) {
				var keyCode = object[i].key.toUpperCase();
				var target = object[i].target || "";
				var func = object[i].func || "";
				var pageOption = object[i].pageOption || "";
				if (target !== "") {
					if (typeof(ngmf._compTarget(target)) === "object") {
						_keySetting(keyCode, "C:"+target);
					} else {

					}
				} else if (func !== "") {
					if (typeof(ngmf._compFunc(func)) === "function") {
						_keySetting(keyCode, "F:"+func);
					} else {

					}
				} else if (pageOption !== "") {
					if (ngmf._compPage(pageOption)) {
						_keySetting(keyCode, "P:"+pageOption);
					} else {

					}
				}
			}
		} else {

			var keyCode = object.key.toUpperCase();
			var target = object.target || "";
			var func = object.func || "";
			var pageOption = object.pageOption || "";
			if (target !== "") {
				if (typeof(ngmf._compTarget(target)) === "object") {
					_keySetting(keyCode, "C:"+target);
				}
			} else if (func !== "") {
				if (typeof(ngmf._compFunc(func)) === "function") {
					_keySetting(keyCode, "F:"+func);
				}
			} else if (pageOption !== "") {
				if (typeof(ngmf._compPage)) {
					_keySetting(keyCode, "P:"+JSON.stringify(pageOption));
				}
			}
		}

		function _keySetting(keyCode, action) {
			var token = keyCode.split("_");
			if (typeof parent.ngmv.shortcutKey[keyCode] == "undefined") {
				if (token.length > 2) {
					var firstKey = token[0].toUpperCase();
					var secondKey = token[1].toUpperCase();
					var lastKey = token[2].toUpperCase();
					if (parseInt(lastKey, 10).toString() !== "NaN") {
						lastKey = "num"+token[2].toUpperCase();
					}
					if (firstKey == "ALT") {
						parent.ngmv.shortcutKey.key[keyCode] = lastKey;
						parent.ngmv.shortcutKey.altshiftArr.push(lastKey);
						parent.ngmv.shortcutKey.altshiftArr[lastKey] = action;
					} else if (firstKey == "CTRL") {
						if (secondKey == "SHIFT") {
							parent.ngmv.shortcutKey.key[keyCode] = lastKey;
							parent.ngmv.shortcutKey.ctrlshiftArr.push(lastKey);
							parent.ngmv.shortcutKey.ctrlshiftArr[lastKey] = action;
						} else {
							parent.ngmv.shortcutKey.key[keyCode] = lastKey;
							parent.ngmv.shortcutKey.ctrlaltArr.push(lastKey);
							parent.ngmv.shortcutKey.ctrlaltArr[lastKey] = action;
						}
					}
				} else if (token.length == 2) {
					var firstKey = token[0].toUpperCase();
					var lastKey = token[1].toUpperCase();
					if (parseInt(lastKey, 10).toString() !== "NaN") {
						lastKey = "num"+token[1].toUpperCase();
					}
					if (firstKey == "CTRL") {
						parent.ngmv.shortcutKey.key[keyCode] = lastKey;
						parent.ngmv.shortcutKey.ctrlArr.push(lastKey);
						parent.ngmv.shortcutKey.ctrlArr[lastKey] = action;
					} else if (firstKey == "ALT") {
						parent.ngmv.shortcutKey.key[keyCode] = lastKey;
						parent.ngmv.shortcutKey.altArr.push(lastKey);
						parent.ngmv.shortcutKey.altArr[lastKey] = action;
					} else if (firstKey == "SHIFT") {
						parent.ngmv.shortcutKey.key[keyCode] = lastKey;
						parent.ngmv.shortcutKey.shiftArr.push(lastKey);
						parent.ngmv.shortcutKey.shiftArr[lastKey] = action;
					}
				} else {
					var lastKey = token[0].toUpperCase();
					if (parseInt(lastKey, 10).toString() !== "NaN") {
						lastKey = "num"+token[0].toUpperCase();
					}
					parent.ngmv.shortcutKey.key[keyCode] = lastKey;
					parent.ngmv.shortcutKey.codeArr[lastKey] = action;
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.setKeyCode] Exception :: ", e);
	}
};

ngmf._deleteKey = function (keyCode) {
	try{
		if (keyCode.lastIndex("_") > 0) {
			var _idx = keyCode.lastIndex("_");
			var lastKey = keyCode.slice(_idx + 1);
			var complex = keyCode.slice(0, _idx);
			var complexArr = "";
			if (parseInt(lastKey, 10).toString() !== "NaN") {
				lastKey = "num"+lastKey;
			}

			if (complex == "ALT") {
				complexArr = "altArr";
			} else if (complex == "CTRL") {
				complexArr = "ctrlArr";
			} else if (complex == "SHIFT") {
				complexArr = "shiftArr";
			} else if (complex == "ALT_SHIFT") {
				complexArr = "altshiftArr";
			} else if (complex == "CTRL_SHIFT") {
				complexArr = "ctrlshiftArr";
			} else if (complex == "CTRL_ALT") {
				complexArr = "ctrlaltArr";
			}

			var index = ngmv.shortcutKey[complexArr].lastIndex(lastKey);
			ngmv.shortcutKey[complexArr].splice(index, 1);
			delete ngmv.shortcutKey[complexArr][lastKey];
			if (parent.ngmv.shortcutKey.key[keyCode]) {
				delete parent.ngmv.shortcutKey.key[keyCode];
			} else if (ngmv.shortcutKey.key[keyCode]) {
				delete ngmv.shortcutKey.key[keyCode];
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._deleteKey] Exception :: ", e);
	}
};

/**
 * 화면별로 설정된 단축키를 삭제하는 API 입니다.
 * @date 2015-11-26
 * @param {Object} object :: I :: N ::  :: 단축키 설정 객체 (여러건의 단축키 일경우 객체 배열.)
 * @memberOf ngmf
 * @author 이동규
 * @example ngmf.deleteKeyCode();
 * @exampleAsIs
 * @useMobile useless
 */
ngmf.deleteKeyCode = function(object) {
	if(ngmf.isMobile()) {
		//ngmf.alert("ngmf.deleteKeyCode : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	try{
		var isArray = (Object.prototype.toString.call(object) === "[object Array]");
		if (isArray) {
			for (var i in object) {
				var keyCode = object[i].toUpperCase();
				ngmf._deleteKey(keyCode);
			}
		} else {
			var keyCode = object.toUpperCase();
			ngmf._deleteKey(keyCode);
		}
	} catch (e) {
		ngmf._error("[ngmf.deleteKeyCode] Exception :: ", e);
	}
};

ngmf._compFunc = function (funcName) {
	try {
		var object = "";
		var funcNm = "";
		if(funcName.indexOf("ngmf.") > -1) {
			object = "ngmf";
			funcNm = funcName.split(".")[1];
		} else if (funcName.indexOf("scwin.") > -1) {
			object = "scwin";
			funcNm = funcName.split(".")[1];
		} else if (funcName.indexOf(".") > -1) {
			object = funcName.split(".")[0];
			funcNm = funcName.split(".")[1];
		}

		var targetComp = "";
		var parentComp = (typeof parent[object] != "undefined") ? parent[object][funcNm] : "";
		var oneselfComp = (typeof window[object] != "undefined") ? window[object][funcNm] : "";

		if (typeof parentComp == "undefined" && oneselfComp == null) {
			var windowContainer =[];
			if (WebSquare.util.isIE() && WebSquare.util.browserVersion() < 10) {
				windowContainer = document.querySelectorAll(".w2windowContainer");
			} else {
				windowContainer = document.getElementsByClassName("w2windowContainer");
			}

			if (windowContainer.length > 0) {
				windowContainer = windowContainer[0];
				var wcId = eval(windowContainer.id);
				var iframeSelect = wcId.getSelectedIndex();
				if (iframeSelect > -1) {
					var wcIframId = wcId.getSelectedWindowId();
					var wcIframDom = wcId.getWindow(wcIframId) || wcId.getWindowByWindowId(wcIframId);
					if (funcName.lastIndexOf(".") > -1) {
						var cain = funcName.split(".");
						var targetStr = "";
						if (cain.lastIndexOf("ngmf") < 0 && cain.lastIndexOf("scwin") < 0) {
							targetStr += "scwin";
						}
						for (var i = 0; i < cain.length; i++) {
							targetStr += "['"+cain[i]+"']";
						}
						targetComp = eval("wcIframDom"+targetStr);
					} else {
						targetComp = wcIframDom.scwin[funcName];
					}
				}
			} else {
				if(!parent.frameElement) {
					if (funcName.lastIndexOf(".") > -1) {
						var cain = funcName.split(".");
						var targetStr = "";
						if (cain.lastIndexOf("scwin") < 0) {
							targetStr += "scwin";
						}
						for (var i = 0; i < cain.length; i++) {
							targetStr += "['"+cain[i]+"']";
						}
						targetComp = eval("window"+targetStr);
					} else {
						targetComp = window.scwin[funcName];
					}
				}
			}
		} else if (typeof parentComp != "undefined" && oneselfComp == null) {
			if (parent.frameElement) {
				targetComp = "";
			} else {
				targetComp = parentComp;
			}
		} else if (typeof parentComp == "undefined") {
			targetComp = oneselfComp;
		} else {
			targetComp = parentComp;
		}

		return targetComp;
	} catch(e) {
		ngmf._error("[ngmf._compFunc] Exception :: ", e);
	}
};

ngmf._compPage = function(pageOption) {
	try {
		var matchObj = GLD.dlt_MenuList.getMatchedJSON( "screenNm" , pageOption , true);

		if (matchObj.length > 0) {
			matchObj = matchObj[0];
			return true;
		}
	} catch(e) {
		ngmf._error("[ngmf._compPage] Exception :: ", e);
	}
};

/**
 * 데이터셋 동적 생성
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} dsId    :: I :: N ::  :: 데이터셋의 아이디
 * @param {Array} colArr   :: I :: N ::  :: 컬럼정보
 * @param {Array} typeArr  :: I :: N ::  :: 컬럼들의 dataType 정의
 * @param {Object} options :: I :: Y ::  :: dataCollection의 속성[baseNode, repeatNode, saveRemovedData]
 * @return {Object} dataCollection(dataList)
 * @useMobile use
 * @example var dataList = ngmf.createDataList("test", ["col1", "col2", "col3"], ["text", "text", "text"] );
 * @exampleAsIs
 */
ngmf.createDataList = function(dsId, colArr, typeArr, options) {
	try{
		var dsObj = ngmf.object( dsId );
		if(typeof dsObj != "undefined"){
			$w.data.remove(dsId);
		}

		var colInfoJSON = [];
		if(typeof colArr !== "undefined"){

			colInfoJSON = [];

			for(var i=0; i<colArr.length; i++){
				var dataType = "text";

				if(typeof typeArr !== "undefined"){
					dataType = typeArr[i];
				}else{
					dataType = "text";
				}

				var colInfo = {
					"id" 		: colArr[i],
					"dataType" 	: dataType,
					"name" 		: colArr[i]
				};

				colInfoJSON.push(colInfo);
			}
		}

		if (typeof options == "undefined") {
			options = {};
			options.baseNode = "list";
			options.repeatNode = "map";
			options.saveRemovedData = "true";
	 	}


		var dataCollectionJSON = {
			id : dsId,
			type : "dataList",
			option : {
				"baseNode" : options.baseNode || "list",
				"repeatNode" : options.repeatNode || "map",
				"saveRemovedData" : options.saveRemovedData || "true",
			},

			columnInfo : colInfoJSON
		};

		$w.data.create( dataCollectionJSON );

		return ngmf.object(dsId);
	} catch (e) {
		ngmf._error("[ngmf.createDataList] Exception :: ", e);
	}
};

/**
 * 데이터셋 동적 파괴
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} dsId :: I :: N ::  :: 데이터셋의 아이디
 * @return {boolean} true/false
 * @useMobile use
 * @example ngmf.destroyDataList("test"); //return true
 * @exampleAsIs
 */
ngmf.destroyDataList = function(dsId){
	try{
		if(typeof ngmf.object( dsId ) != "undefined"){
			$w.data.remove(dsId);
			return true;
		}else{
			return false;
		}
	} catch (e) {
		ngmf._error("[ngmf.destroyDataList] Exception :: ", e);
	}
};

/* 2-9 유효성검사 처리업무----------------------------------------------------------------------------------------------------- */

/**
 * 그룹안에 포함된 컴포넌트의 입력 값에 대한 유효성을 검사한다.
 * @date 2015. 11. 26.
 * @memberOf ngmf
 * @param {String} grpObjId   :: I :: N ::  :: 그룹 컴포넌트 객체 아이디
 * @param {Object} valInfoArr :: I :: N ::  :: 유효성 검사 옵션 배열
 * <br/>valInfoArr[].id        : 유효성 검사 대상 DataCollection 컬럼 아이디
 * <br/>valInfoArr[].required  : 필수 입력 값 여부
 * <br/>valInfoArr[].minLength : 최소 입력 자리수
 * <br/>valInfoArr[].valFunc   : 사용자 유효성 검사 함수
 * @param {String} tacId      :: I :: Y ::  :: 그룹이 포함된 TabControl 컴포넌트 아이디
 * @param {String} tabId      :: I :: Y ::  :: 그룹이 포함된 TabControl 컴포넌트의 Tab 아이디
 * @returns {Boolean} 유효성 검사 결과
 * @useMobile use
 * @sampleLink scm_validationTableLayout
 * @example
var valInfo1 = [{id: "grpCd", required: true, minLength: 5}, {id: "grpNm", required: true}];

if (ngmf.validateGroup("grp_LoginInfo", valInfo1)) {
	//유효성 검사가 성공했을경우 스크립트.
}
 * @description
 * <br/><※ 필수 입력, 입력 허용 문자, 입력 허용 불가 문자, 최대, 최소 입력 문자수 설정은 컴포넌트의 속성에서 설정한다.
 * <br/>- mandatory : 필수 입력 항목 여부 <br/>- allowChar : 입력 허용 문자
 * <br/>- ignoreChar : 입력 허용 불가 문자 <br/>- maxLength : 최대 입력 문자수
 * <br/>- maxByteLength : 최대 입력 바이트수 <br/>- minLength : 최소 입력 문자수
 * <br/>- minByteLength : 최소 입력 바이트수
 * @exampleAsIs
 */
ngmf.validateGroup = function(grpObjId, valInfoArr, tacId, tabId) {
	var grpObj = ngmf.object(grpObjId);
	var objArr = WebSquare.util.getChildren(grpObj, {
		excludePlugin : "group trigger textbox output calendar image span anchor pageInherit wframe itemTable",
		recursive : true
	});

	var valStatus = {
		isValid : true,
		message : "",
		error : [] // { columnId: "", comObjId: "", columnNam : "", message: "" }
	};

	function _setResult(dataMap, columnId, comObjId, message) {
		var errIdx = valStatus.error.length;
		valStatus.error[errIdx] = {};
		valStatus.error[errIdx].columnId = columnId;
		valStatus.error[errIdx].comObjId = comObjId;
		if (dataMap !==  null) {
			valStatus.error[errIdx].columnName = ngmf.getColumnName(comObjId);
		} else {
			comObj = ngmf.object(valStatus.error[0].comObjId);
			valStatus.error[errIdx].columnName = comObj.getInvalidMessage();
		}
		valStatus.error[errIdx].message = message;
	}

	try {
		for (var objIdx in objArr) {
			var obj = objArr[objIdx];
			var dataObjInfo = ngmf.getDataCollectionId(obj.getID());
			var dataMap = null;
			var columnId = null;
			var value = null;

			if(obj.render !== null && !obj.validate()){
				valStatus.isValid = false;
				return valStatus.isValid;
			}

			if (dataObjInfo !== null) {
				dataMap = ngmf.object(dataObjInfo.dataMapId);
				columnId = dataObjInfo.columnId;
				value = dataMap.getCellData(0, dataObjInfo.columnId);
			} else {
				var tempIdArr = obj.getID().split("_");
				columnId = ngmf.firstLowerCase(tempIdArr[tempIdArr.length-1]);
				value = obj.getValue();
			}

			for (var valIdx in valInfoArr) {
				var valInfo = valInfoArr[valIdx];
				if ((typeof valInfo.id !== "undefined") && (valInfo.id === columnId)) {
					if ((typeof valInfo.required !== "undefined") && (valInfo.required === true) && (value.length === 0)) {
						var name = (ngmf.isNull(dataMap) !== "Y") ? dataMap.getCellInfo(valInfo.id).name : obj.options.name;
						name = (name == "") ?  obj.getID() : name;
						_setResult(dataMap, valInfo.id, obj.getID(), "["+name+"] 은(는) 필수 입력 값입니다.");
					} else if ((typeof valInfo.minLength !== "undefined") && (valInfo.minLength > 0)
							&& (value.length < valInfo.minLength)) {
						_setResult(dataMap, valInfo.id, obj.getID(), obj.getID() + "의 최소 입력데이터 길이는 "+ valInfo.minLength + " 입니다.");
					} else if (typeof valInfo.valFunc === "function") {
						var resultMsg = valInfo.valFunc(value);
						if ((typeof resultMsg !== "undefined") && (resultMsg !== "")) {
							_setResult(dataMap, valInfo.id, obj.getID(), resultMsg);
						}
					}
				}
			}
		}

		if (valStatus.error.length > 0) {
			valStatus.isValid = false;
			valStatus.message = "";

			if ((typeof tacId !== "undefined") && (tacId !== "") && (typeof tabId !== "undefined") && (tabId !== "")) {
				var tacObj = ngmf.object(tacId);
				var tabIndex = tacObj.getTabIndex(tabId);
				tacObj.setSelectedTabIndex(tabIndex);
			}

			for (var i = 0 ; i < valStatus.error.length; i++) {
				valStatus.message += "------------------------- ERROR : "+ (i + 1) +". -------------------------";
				valStatus.message += "\n";
				valStatus.message +=  (valStatus.error[i].comObjId != "") ? "target : " + valStatus.error[i].comObjId + "\n" : "";
				valStatus.message +=  (valStatus.error[i].message != "") ? "message : " + valStatus.error[i].message + "\n" : "";
				if (i == valStatus.error.length -1) {
					valStatus.message += "----------------------------------------------------------------";
				}
			}

			obj = ngmf.stringify(obj);
			var options = {
				title : "유효성검사",
			};
			ngmf.alert(valStatus.message, function(val) {
				ngmf._focus(valStatus.error[0].comObjId);
			}, options);
			ngmf.setWindowStatusMsg("E", "유효성체크 검사에 실패하였습니다.");
		}

		return valStatus.isValid;

	} catch(e) {
		ngmf._error("[ngmf.validateGroup] Exception :: Object Id : " + comObj.getID() + ", Plug-in Name: " + comObj.getPluginName() + ", ", e);
	} finally {
		objArr = null;
	}
};

/**
 * GridView를 통해서 입력된 데이터에 대해서 유효성을 검증한다.
 * @date 2015-11-26
 * @memberOf ngmf
 * @param {String} grdViewObjId :: I :: N ::  :: GridView 객체 아이디
 * @param {Object} valInfoArr :: I :: N ::  :: 데이터 유효성 검증 옵션
 * <br/>valInfoArr[].id        : 유효성 검사 대상 DataCollection 컬럼 아이디
 * <br/>valInfoArr[].required  : 필수 입력 값 여부
 * <br/>valInfoArr[].minLength : 최소 입력 자리수
 * <br/>valInfoArr[].valFunc   : 사용자 유효성 검사 함수
 * @param {String} tacId    :: I :: Y ::  :: GridView가 포함된 TabControl 컴포넌트 아이디
 * @param {String} tabId    :: I :: Y ::  :: GridView가 포함된 TabControl 컴포넌트의 Tab 아이디
 * @returns {Boolean} 유효성검사 결과
 * @useMobile use
 * @sampleLink scm_validationGridView
 * @example
var valInfo = [ {id: "grpCd", required: true, minLength: 5}, {id: "grpNm", required: true} ];

if (ngmf.validateGridView("grd_MenuAuthority", valInfo)) {
	if (confirm("변경된 데이터를 저장하시겠습니까?")) {
		ajaxLib.executeSubmission("WS0201U04");
	}
}
 * @description
 * 입력 허용 문자, 입력 허용 불가 문자, 최대 입력 문자수 설정은 GridView의 Column의 속성에서 설정한다.
 *  - allowChar : 입력 허용 문자
 *  - ignoreChar : 입력 허용 불가 문자
 *  - maxLength : 최대 입력 문자수
 * @exampleAsIs
 */
ngmf.validateGridView = function(grdViewObjId, valInfoArr, tacId, tabId) {

	var gridViewObj = ngmf.object(grdViewObjId);
	if (gridViewObj === null) {
		ngmf._error("Can not find '" + grdViewObjId + "' Object.");
		return false;
	}

	var dataList = ngmf.getGridViewDataList(grdViewObjId);
	if (dataList === null) {
		ngmf._error("Can not find the datalist of '" + grdViewObjId + "' object.");
		return false;
	}

	var valStatus = {
		isValid : true,
		message : "",
		error : [] // { columnId: "", columnName: "", rowIndex: 0, message: "" }
	};

	try {
		var modifiedIdx = dataList.getModifiedIndex();

		for (var dataIdx = 0; dataIdx < modifiedIdx.length; dataIdx++) {
			var modifiedData = dataList.getRowJSON(modifiedIdx[dataIdx]);
			if (modifiedData.rowStatus === "D") {
				continue;
			}
			for (var valIdx in valInfoArr) {
				var valInfo = valInfoArr[valIdx];
				if ((typeof valInfo.id !== "undefined") && (typeof modifiedData[valInfo.id] !== "undefined")) {
					var value =  (typeof modifiedData[valInfo.id] === "string") ? modifiedData[valInfo.id].trim() : modifiedData[valInfo.id] ;
					if ((typeof valInfo.required !== "undefined") && (valInfo.required === true) && (value.length === 0)) {
						var name = (ngmf.isNull(dataList) !== "Y") ? dataList.getCellInfo(valInfo.id).options.name : valInfo.id;
						name = (name == "") ?  valInfo.id : gridViewObj.getHeaderValue(gridViewObj.getHeaderID(gridViewObj.getColumnIndex(valInfo.id)));
						_setResult(modifiedIdx[dataIdx], dataList, grdViewObjId, valInfo.id, "["+ name + "] 은(는) 필수 입력 값입니다.");
					} else if ((typeof valInfo.minLength !== "undefined") && (valInfo.minLength > 0)
							&& (value.length < valInfo.minLength)) {
						_setResult(modifiedIdx[dataIdx], dataList, grdViewObjId, valInfo.id, valInfo.id + "의 최소 입력데이터 길이는 "+ valInfo.minLength + " 입니다.");
					} else if (typeof valInfo.valFunc === "function") {
						var resultMsg = valInfo.valFunc(value, modifiedData);
						if ((typeof resultMsg !== "undefined") && (resultMsg !== "")) {
							_setResult(modifiedIdx[dataIdx], dataList, grdViewObjId, valInfo.id, resultMsg);
						}
					}
				}
			}
		}

		if (valStatus.error.length > 0) {
			valStatus.isValid = false;
			for (var i = 0 ; i < valStatus.error.length; i++) {
				valStatus.message += "------------------------- ERROR : "+ (i + 1) +". -------------------------";
				valStatus.message += "\n";
				valStatus.message += (valStatus.error[i].comObjId != "") ? "그리드뷰ID : " + valStatus.error[i].comObjId + "\n" : "";
				valStatus.message += (valStatus.error[i].columnId != "") ? "컬럼ID : " + valStatus.error[i].columnId + "\n" : "";
				valStatus.message += (valStatus.error[i].message != "") ? "message : " + valStatus.error[i].message + "\n" : "";
				if (i == valStatus.error.length -1) {
					valStatus.message += "----------------------------------------------------------------";
				}
			}

			if ((typeof tacId !== "undefined") && (tacId !== "") && (typeof tabId !== "undefined") && (tabId !== "")) {
				var tacObj = ngmf.object(tacId);
				var tabIndex = tacObj.getTabIndex(tabId);
				tacObj.setSelectedTabIndex(tabIndex);
			}

			var options = {
				title : "유효성검사"
			};

			ngmf.alert(valStatus.message, function(val) {
				ngmf._gridCellfocus(valStatus.error[0].comObjId, valStatus.error[0].rowIndex, valStatus.error[0].columnId);
			}, options);

			ngmf.setWindowStatusMsg("E", "유효성체크 검사에 실패하였습니다.");
		}

		return valStatus.isValid;

		function _setResult(rowIndex, dataList, gridViewObjId, columnId, message) {
			var errIdx = valStatus.error.length;
			valStatus.error[errIdx] = {};
			valStatus.error[errIdx].columnId = columnId;
			valStatus.error[errIdx].comObjId = gridViewObjId;
			valStatus.error[errIdx].columnName = dataList.getColumnName(columnId);
			valStatus.error[errIdx].rowIndex = rowIndex;
			valStatus.error[errIdx].message =  message + " [ Row : " + (rowIndex+1) + "] ";
		}
	} catch(e) {
		ngmf._error("[ngmf.validateGridView] Exception :: ", e);
	} finally {
		modifiedData = null;
		modifiedIdx = null;
		dataList = null;
		gridViewObj = null;
	}
};

/**
 * GridView와 바인딩된 DataList 객체를 반환한다.
 * @date 2014. 12. 10.
 * @memberOf ngmf
 * @param {Object} gridViewObjId :: I :: N ::  :: 그리드뷰 아이디
 * @returns {Object} dataList
 * @useMobile use
 * @exampleAsIs
 */
ngmf.getGridViewDataList = function(gridViewObjId) {
	try{
		var gridViewObj = ngmf.object(gridViewObjId);
		if (typeof gridViewObj === "undefined") {
			ngmf._error("Cant not find GridView(" + gridViewObj + ").");
			return null;
		}
		var dataListId = gridViewObj.getDataList();

		if (dataListId !== "") {
			var dataList = ngmf.object(dataListId);
			if ((typeof dataList === "undefined") || (dataList === null)) {
				ngmf._error("Cant not find DataList(" + dataListId + ").");
				return null;
			} else {
				return dataList;
			}
		} else {
			ngmf._error("The DataList property of " + gridViewObj.getID() + " is not set.");
			return null;
		}
	} catch (e) {
		ngmf._error("[ngmf.getGridViewDataList] Exception :: ", e);
	}
};

ngmf._focus = function(id) {
	try{
		if (typeof ngmf.object(id) !== "undefined") {
			ngmf.object(id).focus();
		} else {
			var windowMDI = ngmf.mdiTabs();
			var selectedWin = windowMDI.getWindow(windowMDI.getSelectedWindowId());
			selectedWin.ngmf.object(id).focus();
		}
	} catch (e) {
		ngmf._error("[ngmf._focus] Exception :: ", e);
	}
};

ngmf._gridCellfocus = function(id, rowIndex, col) {
	try{
		var comp = ngmf.object(id);
		if (typeof comp !== "undefined" && typeof rowIndex !== "undefined") {
			if(typeof col == "undefined") {
				comp.setFocusedCell(rowIndex, col);
			} else {
				var cellInfo = comp.getCellInfo(col);
				var input = comp.getInput(cellInfo);
				comp.setFocusedCell(rowIndex, col);
				input.select();
			}
		} else {
			var windowMDI = ngmf.mdiTabs();
			var selectedWin = windowMDI.getWindow(windowMDI.getSelectedWindowId());

			if(typeof col == "undefined") {
				selectedWin.ngmf.object(id).setFocusedCell(rowIndex, 0);
			} else {
				var cellInfo = selectedWin.ngmf.object(id).getCellInfo(col);
				var input = selectedWin.ngmf.object(id).getInput(cellInfo);
				selectedWin.ngmf.object(id).setFocusedCell(rowIndex, col);
				input.select();
			}
		}
	} catch (e) {
		ngmf._error("[ngmf._gridCellfocus] Exception :: ", e);
	}
};

/** 데이터리스트의 필터링
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String|Object} ds   :: I :: N ::  :: 데이터셋의 아이디 또는 데이터셋object
 * @param {String} pConditions :: I :: N ::  :: 조건
 * @param {String} append      :: I :: Y ::  :: 기존 필터 조건을 새로 정의할지 추가로 정희할지 정하는 옵션("" : AND , true : 새로정의) [defalut : ""]
 * @param {Object} options     :: I :: Y ::  :: link 설정 필터 정의.
 *  	  {String} colId       :: I :: Y ::  :: 핕러 설정 column 아이디.
 *        {String} func        :: I :: Y ::  :: 사용자 지정 function 명.
 *
 * @update 2016.03.21 이동규 ngmf.filter 필터조건 like 기능 추가.[UI-1203]
 * @update 2016.06.16 이동규 ngmf.filter 필터조건 전 sort 적용시 sort 설정 그대로 적용.[UI-2179]
 * @update 2016.09.05 이동규 ngmf.filter 필터조건 전 Multisort 적용시 sort 설정으로만 적용된 오류 수정.[UI-2833]
 * @update 2016.09.19 이동규 ngmf.filter 필터조건에 컬럼간의 데이터 비교 추가 작업.[UI-2902]
 * @update 2016.10.04 이동규 ngmf.filter 필터조건에 데이터가 빈칸이 있을 경우 오류수정.[UI-3064]
 * @useMobile use
 * @sampleLink grd_paging
 * @example
 			(1-1) 일반필터
			var conditions = "comm_cd_id == '공통코드ID'"+
							" && trxcode == '서비스코드'"+
							" && eff_sta_dt <= '데이터1'"+
							" && eff_end_dt >= '데이터2'";

			ngmf.filter(dsList, conditions);

			(1-2) 일반필터 컬럼별 데이터 구분
			dsList 의 컬럼ID ["comm_cd_id", "comm_type_id", "trxcode"]
			var conditions = "comm_cd_id == 'comm_type_id' +
							" && trxcode == '서비스코드'"
			ngmf.filter(dsList, conditions);

			(2) like 필터
			ngmf.filter(dsList, "like", true, {"colId" : "comm_cd_id", "func" : "scwin.likeFunc"})
			// like 필터인 경우 사용자가 직접적으로 함수를 정의하여 ,
			// return을 반환하여야 합니다. (true : 보여줌, false : 숨김)
			scwin.likeFunc = function(cellData) {
				if (cellData.indexOf("조건데이터") > -1) {
					return true;
				} else {
					return false;
				}
			};

 * @exampleAsIs
 */
ngmf.filter = function(ds, pConditions, append, options) {
	try{
		var filterDs = ngmf.object(ds);
		var filterDsId = filterDs.getID();
		if (filterDsId.startsWith("GDS")) {
			filterDsId = "GLD." + filterDsId;
		}
		var conditions = pConditions;
		var cols = conditions.split(/\W+/g);
		var uniqCols = new Array();
		var sortArr = [];

		//필터 컬럼 추출.
		$.each(cols, function(i, el) {
			if(el != "" && uniqCols.indexOf(el) == -1 && typeof filterDs.getColumnIndex(el) != "undefined") {
				uniqCols.push(el);	
			} 
		});
		
		//문자열 길이로 재정렬
		uniqCols.sort(function(a,b) { 
			if (a.length < b.length) return 1;
			if (a.length > b.length) return -1;
			return 0;
		});

		//필터 설정 전 sort 상태 확인.
		if (filterDs && filterDs.sortStatusArr) {
			sortArr = filterDs.sortStatusArr;
		}

		//Like 필터 기능.
		if (ngmf.toUpper(conditions) == "LIKE") {
			if (options && typeof options.colId != "undefined" && typeof options.func != "undefined") {
				if (typeof filterDs.getColumnIndex(options.colId) == "undefined") {
					ngmf.alert("like 사용자지정 필터 컬럼이 존재하지 않습니다.");
				}else if (ngmf.isExistFunc(options.func)) {
					var isAppend = WebSquare.util.getBoolean(append) ? true : false;
					if (isAppend) {
						filterDs.removeColumnFilterAll();
					}
					var func = eval(options.func);
					if (ngmf.isFunction(func)) {
						filterDs.setColumnFilter( {type:'func', colIndex: options.colId, key:func, condition:'and'});
					}
				}
			} else {
				ngmf.alert("like 사용자지정 필터 값이 잘못되었습니다.");
			}
		} 
		//일반필터 기능.
		else {
			var conditionArr = conditions.split(/[&]{2}|[|]{2}/);
			var conditionArr1 = new Array();
			var conditionArr2 = conditions.match(/[&]{2}|[|]{2}/g);
			
			//필터조건 [|| , &&] 구분.
			for(var i=0; i<conditionArr.length; i++){
				if(ngmf.trim(conditionArr[i]) != ""){
					conditionArr1.push(conditionArr[i]);
				}
			}

			//필터조건 정의.
			for (var i = 0; i < conditionArr1.length; i++) {
				var cond = conditionArr1[i];
				//cond = cond.replace(/\s/gi,"");
				var valArr  = [cond];
				var xBy = "";
				if (cond.indexOf("==") > -1) {
					valArr = cond.split("==");
					xBy = "==";
				} else if (cond.indexOf("!=") > -1) {
					valArr = cond.split("!=");
					xBy = "!=";
				} else if (cond.indexOf(">") > -1) {
					valArr = cond.split(">");
					xBy = ">";
				} else if (cond.indexOf("<") > -1) {
					valArr = cond.split("<");
					xBy = "<";
				} else if (cond.indexOf(">=") > -1) {
					valArr = cond.split(">=");
					xBy = ">=";
				} else if (cond.indexOf("<=") > -1) {
					valArr = cond.split("<=");
					xBy = "<=";
				} 

				for (var j = 0 ; j < valArr.length; j++) {
					var chgCnt = -1;
					for (var k = 0; k < uniqCols.length; k++) {
						var deQ = ngmf.trim(valArr[j]);
						if (deQ.indexOf(uniqCols[k]) > -1) {
							valArr[j] = valArr[j].replace(uniqCols[k], "####");
							chgCnt = k;
							break;
						}
					}
					if (chgCnt > -1)
						valArr[j] = valArr[j].replace(/####/g, filterDsId+".getCellData("+filterDsId+".getFilteredRowIndex(rowIdx),'"+ uniqCols[chgCnt] +"')");  
				}

				if (xBy) {
					conditionArr1[i] = valArr[0] + xBy + valArr[1];
				} else {
					conditionArr1[i] = valArr[0];
				}
			}

			var returnConditions = "";
			if(conditionArr2 != null){
				for(var i=0; i<conditionArr1.length; i++){
					if(typeof conditionArr2[i] !== "undefined"){
						if(typeof conditionArr1[i+1] == "undefined" || conditionArr1[i+1] == null || ngmf.trim(conditionArr1[i+1]) == ""){
							returnConditions += conditionArr1[i];
						}else{
							returnConditions += conditionArr1[i] + conditionArr2[i];
						}
					}else{
						returnConditions += conditionArr1[i];
					}
				}
			}else{
				for(var i=0; i<conditionArr1.length; i++){
					returnConditions += conditionArr1[i];
				}
			}

			//필터조건 새로정의 또는 필터 조건추가 여부.
			var isAppend = WebSquare.util.getBoolean(append) ? true : false;
			if (isAppend) {
				filterDs.removeColumnFilterAll();
			}

			//필터 설정.
			filterDs.setColumnFilter({
				type:'func',
				colIndex:0,
				key:
					function(cellData, tmpParam, rowIdx){
						try{
							if(eval(returnConditions)){
								return true;
							} else {
								return false;
							}
						}catch(e){
							ngmf._error("[ngmf.filter.setColumnFilter] Exception returnConditions :: " + returnConditions, e);
							return true;
						}
					},
				condition:'and'
			});
		}

		//정의 필터 이전 sort 재반영.
		if (sortArr.length > 1) {
			var sortIndex = "";
			var sortOrder = "";
			for (var i = 0; i < sortArr.length ; i++) {
				var colId = sortArr[i].colID;
				var sortOrd = sortArr[i].sortOrder;
				if (filterDs.getColumnID(colId) && sortOrd) {
					if (sortIndex == "") {
						sortIndex += colId;
					}  else {
						sortIndex += " " + colId;
					}

					if (sortOrder == "") {
						sortOrder += sortOrd;
					}  else {
						sortOrder += " " + sortOrd;
					}
				}
			}
			filterDs.multisort({"sortIndex" : sortIndex, "sortOrder" : sortOrder});
		} else if (sortArr.length == 1) {
			var sortCol = sortArr[0].colID;
			var sortOrder = sortArr[0].sortOrder; // 1 : 오름차순, -1 : 내림차순
			if (sortOrder == 1) {
				sortOrder = 0;
			} else if (sortOrder == -1) {
				sortOrder = 1;
			} else {
				sortOrder = 2;
			}
			filterDs.sort(sortCol, sortOrder); //0이면 오름차순 1이면 내림차순 2이면 정렬을 취소
		}
	} catch (e) {
		ngmf._error("[ngmf.filter] Exception :: ", e);
	}
};

/**
 * 화면펼침(삭제검토)
 * @date 2015.10.05
 * @memberOf ngmf
 * @param {String} title   :: I :: N ::  :: 디비전 제목
 * @param {Object} options :: I :: N ::  :: jsonObject 옵션
 * @useMobile delete
 * @example ngmf.showLayer("디비젼1", { top: "400px", left: "300px", width:"120px", height:"100px" };
 * @exampleAsIs
 */
ngmf.showLayer = function(title, options){
	try{

	} catch (e) {
		ngmf._error("[ngmf.showLayer] Exception :: ", e);
	}
};

/**
 * 화면에서 생성된 wframe 전체 객체를 반환한다.
 *
 * @date 2016.01.11
 * @memberOf ngmf
 * @param {String} compId :: I :: Y ::  :: wframe 객체 배열
 * @return {Object} wframeObj
 * @author 박상규
 * @useMobile use
 * @since 2015.12.15
 * @example ngmf.getWframes();
 * @exampleAsIs
 */
ngmf.getWframes = function(compId) {
	var wframeObj = [];
	try {
		if ((typeof compId !== "undefined") && (compId !== null)) {
			var target = WebSquare.util.getChildren (compId, {recursive : true});
		} else {
			var target = WebSquare.getBody().getAllChildren();
		}

		for(var idx = 0; idx < target.length; idx++) {
			if (target[idx].getPluginName() === "wframe") {
				wframeObj.push(target[idx]);
			}
		}
	} catch(e) {
		ngmf._error("[ngmf.getWframes] Exception :: ", e);
	}
	return wframeObj;
};

/**
 * 메인 화면과 Wframe의 form_onLoadCompleted() 함수를 실행한다.
 * @date 2015.12.15
 * @memberOf
 * @author 성일호
 * @update 이동규 2016.08.16 서브작업탭 작업에 따른 분기처리 로직.
 * @useMobile use
 * @example ngmf._executeOnLoadCompleted();
 * @exampleAsIs
 */
ngmf._executeOnLoadCompleted = function() {
	//scvar.__screenName 설정을 위해
	var screenName = ngmf._getScreenName();
	
	//Argument 설정  //WebSquare.parentObj.ngmv.windowID
	if (typeof GLV["G_CCATEMP"] == "undefined" || GLV["G_CCATEMP"] !== "Y" ) {
		if (!ngmf.isMobile()  && (GLV["G_FORMUSEFG"] == "S" || GLV.G_DEVFG =="L" ) && !ngmf.isPopup() && ngmf._isForm() != 0 && ngmf._isForm() != -9) {
			ngmf.watermark(ngmf.getGlobalValue("g_Ngms_LogInId"));
		} else if (ngmf.isMobile() && GLV.G_DEVFG =="L" && !ngmf.isPopup() && ngmf._isForm() != 0 && ngmf._isForm() != -9) {
			//TODO 모바일에서 알아서 처리...
			//ngmf.watermark(ngmf.getGlobalValue("g_Ngms_LogInId"));
		}
		ngmf._setOnloadArg(); 
	}
	if (GLV["G_FORMUSEFG"] == "M") {
		if (ngmv.isPopupWorkspace) {//서브작업탭 (sub_fv.xml)
			if ( ngmf._isForm() == 0 ) ngmv["windowID"] = "[main]";
			else if (ngmf.isPopup() && WebSquare["parentObj"]) ngmv["windowID"] =  WebSquare["parentObj"]["ngmv"]["windowID"];
			else if (typeof WebSquare.util.getPopupWindow("subMain") != "undefined") {
				var subWindow = WebSquare.util.getPopupWindow("subMain");
				if (subWindow["G_ACTIVE_MDIID"]) ngmv["windowID"] =  "[" + subWindow["G_ACTIVE_MDIID"] + "]";
			}
			else ngmv["windowID"] = "";
			ngmf.setLogLevel(ngmv.LOG_ALL || 0);
		} else {//메인작업탭(main_fv.xml)
			if ( ngmf._isForm() == 0 ) ngmv["windowID"] = "[main]";
			else if (ngmf.isPopup() && WebSquare["parentObj"]) ngmv["windowID"] =  WebSquare["parentObj"]["ngmv"]["windowID"];
			else if (GLV["G_ACTIVE_MDIID"]) ngmv["windowID"] =  "[" + GLV["G_ACTIVE_MDIID"] + "]";
			else ngmv["windowID"] = "";
			ngmf.setLogLevel(ngmv.LOG_ALL || 0);
		}
	}
	if(ngmf.isPopup() ) {
		try {
			if ($(".cont_wrap") && $(".cont_wrap").length > 0)
				$(".cont_wrap").first().css("min-width", $(".cont_wrap").first().outerWidth() + "px");
		} catch (e) {}
	} 
	try{
		//TODO. 성능 테스트를 위해
		/*
		if (GLV["MENULOG"] && GLV.MENULOG["screenName"] && GLV.MENULOG["screenName"] == screenName) {
			GLV.MENULOG["endTime"] = new Date();
			GLV.MENULOGLIST.push(GLV.MENULOG);
		} 
		var startTime = new Date();
		*/
		ngmv.formHandle = ngmf.extGetWinHandle();
		ngmv.fCloseAccount = "&fCloseAccount=" + GLV["G_SYSTEMFG"];
		/*
		ngmv.strUrlPort = ngmf.getServerUrl("RD");
		// 운영시
		if(ngmv.strUrlPort && ngmv.strUrlPort.length > 1){
			ngmv.HomeServer = ngmv.strUrlPort[0] + ngmf.decode(ngmf.length(ngmv.strUrlPort[1]),0,"",":" + ngmv.strUrlPort[1])+ "/" + ngmv.strUrlPort[2];
			//개발시...
			if (GLV.G_DEVFG != "L") { 
				if (location.toString().indexOf("127.0") > -1) ngmv.HomeServer = "http://172.31.117.23:8060/"+ngmv.strUrlPort[2] ; 
				else ngmv.HomeServer = location.toString().split("websquare")[0] +ngmv.strUrlPort[2] ;
				
			}
		} 
		*/
	} catch (e) {}	
	try{
		//- 상세권한 관리화면(ZNGMSDET10060)에서 호출한 경우 GLD.G_CCATEMP == "Y"
		if (GLV["G_CCATEMP"] == "Y") {
			// 이벤트 처리 
			if (typeof window.parent != "undefined" && window.parent.scvar["_ccaMenuWin"] ) { 
				window.parent.scvar["_ccaMenuFunc"]();
			}			
		} else {
			//2016.03.19 성일호 scvar 초기화 필요시 처리를 위해 초기화 값을 보관함
			if (typeof scvar != "undefined" && !scvar["initscvarStr"] && ngmf._getScvarStr()) scvar["initscvarStr"] = ngmf._getScvarStr();
			if ( (GLV.G_FORMUSEFG == "M" || GLV.G_FORMUSEFG == "S") && ngmv["windowID"]) { 
				ngmf._setWindowInfo(screenName, ngmv["windowID"].substr(1,5));
			} else {
				ngmf._setWindowInfo(screenName);	
			}
			
			//상세권한 제어 호출
			ngmf.globalFormCheck(screenName);
		
			//Wframe form_onLoadCompleted 호출
			ngmf._callFormOnloadCompletedToWframe();

			if ((typeof scwin !== "undefined") && (typeof scwin.form_onLoadCompleted === "function" )) {
				try {
					scwin.form_onLoadCompleted();
				} catch (e) {
					ngmf.error("[scwin.form_onLoadCompleted] Exception :: ", e);
				} 
				if (!scvar["__screenName"]) ngmf._getScreenName();
			} 
			/*
	   		if (GLV && GLV["MENULOG"]) {
	   			var  endTime = new Date();
		   		var menuLogMap = {menuId : GLV["MENULOG"]["menuId"] , menuINm : GLV["MENULOG"]["menuINm"] + " 로딩완료", startTime : startTime , endTime: endTime};
	   			GLV.MENULOGLIST.push(menuLogMap);
				GLV.MENULOG = null;
	   		}
	   		*/
		}
		ngmf.trace ("CALL scwin.form_onLoadCompleted", screenName);
	} catch (e) {
		ngmf._error("[ngmf._executeOnLoadCompleted] Exception :: ", e);
	}
	//초기화 함수 호출
	ngmf._runOnloadInitfunction();
};

/**
 * 기본 동적그리드 생성
 * @date 2015.12.28
 * @memberOf ngmf
 * @param {String / Object} grd :: I :: N ::  :: 그리드 아이디 또는 그리드컴포넌트
 * @param {String} elementStr   :: I :: N ::  :: tag
 * @author 이진수
 * @useMobile use
 * @example ngmf.createGrid(gridView1, gridStr);
 * @exampleAsIs
 */
ngmf.createGrid = function(grd, elementStr){
	try{
		var gv = ngmf.object(grd);
		gv.setGridStyle(WebSquare.xml.parse( elementStr , true ));
	} catch (e) {
		ngmf._error("[ngmf.createGrid] Exception :: ", e);
	}
};

/**
 * dataSet을 이용한 동적그리드 생성
 * @date 2015.12.28
 * @memberOf ngmf
 * @param {String / Object} pGridViewId :: I :: N ::  ::  그리드 아이디 또는 그리드컴포넌트
 * @param {Array} pHeaderColListArr :: I :: N ::  ::  HEADER 컬럼 데이터리스트 배열
 * @param {Array} pBodyColListArr :: I :: N ::  ::  BODY 컬럼 데이터리스트 배열
 * @param {Array} pFooterColListArr :: I :: N ::  ::  FOOTER 컬럼 데이터리스트 배열
 * @param {String} bindingDsId :: I :: N ::  ::  options의 dataList id
 * @sampleLink grd_dynamicCreation
 * @author 이진수
 * @useMobile use
 * @example
var hColDsArr = new Array();

hColDsArr.push(ds_headColList1);
hColDsArr.push(ds_headColList2);

var bColDsArr = new Array();
bColDsArr.push(ds_bodyColList1);
bColDsArr.push(ds_bodyColList2);

var fColDsArr = new Array();
fColDsArr.push(ds_footerColList1);
fColDsArr.push(ds_footerColList2);

ngmf.createGridByDs(gridView1, hColDsArr, bColDsArr, fColDsArr);
 * @exampleAsIs

 */
ngmf.createGridByDs = function(pGridViewId, pHeaderColListArr, pBodyColListArr, pFooterColListArr, bindingDsId){
	try{
		var gridViewObj = ngmf.object(pGridViewId);
		if (typeof gridViewObj != "undefined") {
			var headerColList = pHeaderColListArr || "";
			var bodyColList = pBodyColListArr || "";
			var footColList = pFooterColListArr || "";

			var gridViewId = gridViewObj.getID();
			var gridViewHtmlStr = gridViewObj.getGridStyle();
			var cutIdx = gridViewHtmlStr.search(">");
			gridViewHtmlStr = gridViewHtmlStr.replace(gridViewHtmlStr.substring(cutIdx+1),"");
			
			if (!bindingDsId && typeof ngmf.object(bindingDsId) != "undefined") {
				var bindingDsId = ngmf.object(bindingDsId);
				gridViewHtmlStr = gridViewHtmlStr.replace(gridViewObj.options.dataList, bindingDsId.getID());
			}

			var header = "";
			var body = "";
			var footer = "";

			if (headerColList != "") {
				header = ngmf.makeGrdHeader(headerColList, gridViewId);
			}

			if (bodyColList != "") {
				body = ngmf.makeGrdBody(bodyColList, gridViewId);
			}

			if(footColList != ""){
				footer = ngmf.makeGrdFooter(footColList, gridViewId);
			}
			
			var resultStr = gridViewHtmlStr + header + body + footer + "</w2:gridView>";
			ngmf.createGrid(gridViewObj, resultStr);
		}
	} catch (e) {
		ngmf._error("[ngmf.createGridByDs] Exception :: ", e);
	}
};

/**
 * 기본 동적그리드 헤더 생성(내부함수)
 * @date 2015.12.28
 * @memberOf ngmf
 * @param {Object} dataListArr :: I :: N ::  :: dataList객체
 * @param {String} gridViewId  :: I :: N ::  :: 그리드ID
 * @author 이진수
 * @useMobile use
 * @example body = ngmf.makeGrdBody(pBodyColListArr, gridViewId);
 * @exampleAsIs
 */
ngmf.makeGrdHeader = function(dataListArr, gridViewId) {
	try{
		var headerStrStart 			= '<w2:header id="'+gridViewId+'Header" style="">';
		var headerStrEnd 			= '</w2:header>';
		var resultStr = "";

		for(var h=0; h<dataListArr.length; h++){
			var headerColDs = dataListArr[h];
			var rowStartStr = '<w2:row id="row'+(h+1)+'" style="">';
			var rowEndStr = '</w2:row>';

			for(var i=0; i<headerColDs.getRowCount(); i++){

				var colStartStr = '<w2:column';
				var colEndStr = '></w2:column>';

				for(var j=0; j<headerColDs.cellIdList.length; j++){
					var attrNm = headerColDs.getColumnID( j );
					var attrVal = headerColDs.getCellData(i, j);
					colStartStr = colStartStr + ' ' + attrNm + '="' + WebSquare.xml.encode(attrVal) + '"';
				}

				var colStr = colStartStr + colEndStr;
				rowStartStr = rowStartStr + colStr;

			}

			var rowStr = rowStartStr + rowEndStr;
			resultStr = resultStr + rowStr;
		}

		return headerStrStart + resultStr + headerStrEnd;
	} catch (e) {
		ngmf._error("[ngmf.makeGrdHeader] Exception :: ", e);
	}
};

/**
 * 기본 동적그리드 바디 생성(내부함수)
 * @date 2015.12.28
 * @memberOf ngmf
 * @param {Object} dataListArr :: I :: N ::  :: dataList객체
 * @param {String} gridViewId  :: I :: N ::  :: 그리드ID
 * @author 이진수
 * @useMobile use
 * @example body = ngmf.makeGrdBody(pBodyColListArr, gridViewId);
 * @exampleAsIs
 */
ngmf.makeGrdBody = function(dataListArr, gridViewId) {
	try{
		var bodyStrStart 	= '<w2:gBody id="'+gridViewId+'GBody" style="">';
		var bodyStrEnd 		= '</w2:gBody>';
		var resultStr = "";

		for(var h=0; h<dataListArr.length; h++){
			var bodyColDs = dataListArr[h];
			var rowStartStr = '<w2:row id="row'+(h+1)+'" style="">';
			var rowEndStr = '</w2:row>';

			for(var i=0; i<bodyColDs.getRowCount(); i++){

				var colStartStr = '<w2:column';
				var colEndStr 	= '></w2:column>';

				for(var j=0; j<bodyColDs.cellIdList.length; j++){
					var attrNm = bodyColDs.getColumnID( j );
					var attrVal = bodyColDs.getCellData(i, j);
					colStartStr = colStartStr + ' ' + attrNm + '="' + WebSquare.xml.encode(attrVal) + '"';
				}

				var colStr 	= colStartStr + colEndStr;
				rowStartStr = rowStartStr + colStr;
			}

			var rowStr = rowStartStr + rowEndStr;
			resultStr = resultStr + rowStr;
		}

		return bodyStrStart + resultStr + bodyStrEnd;
	} catch (e) {
		ngmf._error("[ngmf.makeGrdBody] Exception :: ", e);
	}
};

/**
 * 기본 동적그리드 붓터 생성(내부함수)
 * @date 2015.12.28
 * @memberOf ngmf
 * @param {Object} dataListArr :: I :: N ::  :: dataList객체
 * @param {String} gridViewId  :: I :: N ::  :: 그리드ID
 * @author 이진수
 * @useMobile use
 * @example body = ngmf.makeGrdFooter(pBodyColListArr, gridViewId);
 * @exampleAsIs
 */
ngmf.makeGrdFooter = function(dataListArr, gridViewId) {
	try{
		var footerStrStart 	= '<w2:footer id="'+gridViewId+'Footer" style="" class="">';
		var footerStrEnd 	= '</w2:footer>';
		var resultStr = "";

		for(var h=0; h<dataListArr.length; h++){
			var footerColDs = dataListArr[h];
			var rowStartStr = '<w2:row id="row'+(h+1)+'" style="">';
			var rowEndStr = '</w2:row>';

			for(var i=0; i<footerColDs.getRowCount(); i++){

				var colStartStr = '<w2:column';
				var colEndStr 	= '></w2:column>';

				for(var j=0; j<footerColDs.cellIdList.length; j++){
					var attrNm = footerColDs.getColumnID( j );
					var attrVal = footerColDs.getCellData(i, j);
					colStartStr = colStartStr + ' ' + attrNm + '="' + WebSquare.xml.encode(attrVal) + '"';
				}

				var colStr 	= colStartStr + colEndStr;
				rowStartStr = rowStartStr + colStr;
			}

			var rowStr = rowStartStr + rowEndStr;
			resultStr = resultStr + rowStr;
		}

		return footerStrStart + resultStr + footerStrEnd;
	} catch (e) {
		ngmf._error("[ngmf.makeGrdFooter] Exception :: ", e);
	}
};

/**
 * 해당 컴포넌트에 입력한 class를 remove하는 함수.
 * @date 2015.01.07
 * @memberOf ngmf
 * @param {String / Object} compId :: I :: N ::  :: 컴포넌트 명.
 * @param {String} removeClass     :: I :: N ::  :: 삭제할 class명
 * @author 이동규
 * @useMobile use
 * @example ngmf.removeClass("gridView1", "gridStr");
 * @exampleAsIs
 */
ngmf.removeClass = function (compId, removeClass) {
	try {
		var comp = ngmf.object(compId);
		if (typeof comp !== "undefined") {
			var comp_Id;
			if (typeof comp.getID != "undefined") {
				comp_Id = comp.getID();
			} else {
				comp_Id = comp.id;
			}
			if ($("#"+comp_Id).hasClass(removeClass)) {
				$("#"+comp_Id).removeClass(removeClass);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.removeClass] Exception :: ", e);
	}
};
 
 /**
 * wframe 컴포넌트의 src를 선언하는 함수입니다.
 * @date 2015.01.07
 * @memberOf ngmf
 * @param {String / Object} wframeId :: I :: N ::  :: wframe 컴포넌트 명.
 * @param {String} strPrefix         :: I :: Y ::  :: strPrefix Open File Path(Directory)
 * @param {String} strFormID         :: I :: Y ::  :: strFormID Open Form file Name 
 * @author 이동규
 * @useMobile use
 * @example
		ngmf.setSrc("wfm_main", "EDU", "subWframe");
  		ngmf.setSrc("wfm_main", "EDU", "subWframeLong", 800); //form_onloadComplete 호출 지연시
		ngmf.setSrc("wfm_main", "", ""); //초기화시
 * @update 2016.02.23 성일호 wFrame 초기화기능 추가[UI-0666]
 * @update 2016.04.15 이동규 time 파라메터 추가 및 초기값 200 설정.
 * 							 화면 초기화 blank 로직 부분 removeFrame() 으로 수정.
 * @update 2016.04.18 성일호 setSrc 연속호출(main-sub_wframe-sub_sub_wframe) 구조에서 clearTimer 현상 해소[UI-1525]
 * @update 2016.04.26 성일호 form_onLoadCompleted 찾을때 까지 10번까지 확인로직 추가
 * @update 2016.05.02 성일호 Wframe.setMode 적용 및 불필요 로직 삭제, time 파라미터  삭제
 * @exampleAsIs
 */ 

ngmf.setSrc = function (wframeId, strPrefix, strFormID, time) {
	var retVal = false;
	try {
		var setTime = time || 300;
		var loopCnt = 0;
		function _fn_callLoadCompleted(wfmObj) {
			try {
				loopCnt ++;
				var Obj = wfmObj.getObj("scwin");
				if(Obj) {
					ngmf._callFormOnloadCompletedToWframe(wfmObj);
					if (typeof Obj.form_onLoadCompleted == "function") Obj.form_onLoadCompleted();
				} else if (loopCnt < 10) {
					//form_onLoadCompleted 찾을때 까지 10번 루프.... 불안함....
					WebSquare.core.clearTimer("__"+wfmObj.getID() +"_callLoadCompleted__");
					WebSquare.core.setTimer(_fn_callLoadCompleted  , {
						 key: "__"+wfmObj.getID() +"_callLoadCompleted__",
						 caller: this,
						 delay: setTime,
						 args: [wfmObj]
					});				
				};
			} catch (e) {
				ngmf._error("[ngmf.setSrc._callLoadCompleted] Exception :: ", e);
			}
		}
		
		//항목추출시 제외
		if (GLV && GLV.G_CCATEMP == "Y") return false;
		if (typeof wframeId !== "undefined") {
			var src = "";
			var comp = ngmf.object(wframeId);

			if (!comp) {
				return false;
			}
			if ( !strFormID) {
				//wFrame 초기화
				if (!strPrefix) {
					//comp.setSrc("../../lib/comm/blank.xml");
					comp.finalize(); 
					comp.options.src = "";
					return true;
				} else  src = strPrefix ;
			} else {
				//if (strFormID.endsWith(".xml")) {
				//	src = strFormID;
				//} else {
				//	if (!strPrefix) {
				//		strPrefix = ngmf.getSvcId(strFormID);
				//	}
				//	src = ngmf.SWING_PATH + "/" + strPrefix + "/xml/" + strFormID + ".xml";					
				//}
				if (!strPrefix) {
					strPrefix = ngmf.getSvcId(strFormID);
				}
				src = strFormID + ".xml";
			}
			if (src && comp.getPluginName() == "wframe") {
				if ( typeof comp.setMode == "function" ) {
					//mode=sync  추가
					comp.setMode("sync"); 
					retVal = comp.setSrc(src);
					if (retVal) {
						ngmf._callFormOnloadCompletedToWframe(comp);
						var Obj = comp.getObj("scwin");						
						if(Obj && typeof Obj.form_onLoadCompleted == "function") {
							Obj.form_onLoadCompleted();
						} else {
							ngmf._error("Wframe에form_onLoadCompleted API 가 없습니다. ");
						}
					} else ngmf._error("Wframe["+src+"] 호출 실패. ");
				} else {
					retVal = comp.setSrc(src);
					if (retVal) {
						WebSquare.core.clearTimer("__"+comp.getID() +"_callLoadCompleted__");
						WebSquare.core.setTimer(_fn_callLoadCompleted  , {
							 key: "__"+comp.getID() +"_callLoadCompleted__",
							 caller: this,
							 delay: setTime,
							 args: [comp]
						});						
					} else ngmf._error("Wframe["+src+"] 호출 실패. ");
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.setSrc] Exception :: ", e);
	}
	return retVal;
};

/**
 * 컴포넌트를 show선언하는 함수입니다.
 * @date 2015.01.11
 * @memberOf ngmf
 * @param {String / Object} compId :: I :: N ::  :: 컴포넌트 명.
 * @author 이동규
 * @useMobile use
 * @update 16.03.14 이동규 : 화면 디자인시 적용되었던 class = hide 부분이
 *         남아 있게 되어 ngmf.show() 실행 해도 display:none 스타일이 남아 있는 문제 발생.
 *         해당 class hide를 체크 하여 removeClass 하는 코드를 추가.
 * @example ngmf.show("btn_search");
 * @exampleAsIs
 * @wsAPI

컴포넌트를 화면에 보이도록 설정한다.
엔진 내부적으로는 CSS를 display속성과 visibility:show;으로 처리합니다
//display 속성이 "block"이 된다. 
componentId.show();  
//class에 적용된 display 속성 값을 다시 복구. 
componentId.show("");	
 * @ngmfAPI
※ngmf.show()가 표준 API입니다.							
ngmf.show()가 실행하면 해당 컴포넌트의 class에 hide를 hide가 적용되어 있는지 체크 하고 
hide가 적용되어 있다면 removeClass를 실행하여 hide를 삭제합니다. 
 */
 ngmf.show = function (compId) {
	try {
		var comp = ngmf.object(compId);
	
		if ($("#"+comp.getID()).hasClass("hide")) {
			$("#"+comp.getID()).removeClass("hide");
		}

		if (typeof comp !== "undefined") {
			comp.show("");
		}
	} catch (e) {
		ngmf._error("[ngmf.show] Exception :: ", e);
	}
};

/**
 * 컴포넌트를 hide선언하는 함수입니다.
 * @date 2015.01.11
 * @memberOf ngmf
 * @param {String / Object} compId :: I :: N ::  :: 컴포넌트 명.
 * @author 이동규
 * @useMobile use
 * @example ngmf.hide("btn_search");
 * @exampleAsIs
 */
 ngmf.hide = function (compId) {
	try {
		var comp = ngmf.object(compId);
		if (typeof comp !== "undefined") {
			comp.hide();
		}
	} catch (e) {
		ngmf._error("[ngmf.hide] Exception :: ", e);
	}
};

/**
 * TabControl안의 Tab에 컨턴츠를 wframe으로 로딩한 경우 Tab이 첫번째 활성화 되는 시점에서 
 * form_onLoadCompleted 이벤트가 실행하도록 세팅한다.
 * @date 2016.01.07
 * @memberOf ngmf
 * @param {String} tabControlId :: I :: N ::  :: tabControl 객체 아이디
 * @param {String} onchangeEventFuncNm :: I :: N ::  :: Tab안에 Wframe의 form_onLoadCompleted를 수행하고 실행할 함수명 
 * @author 박상규
 * @useMobile use
 * @example ngmf.setOnLoadCompletedEventInTab("tac_Main");
 * @example ngmf.setOnLoadCompletedEventInTab("tac_Main", ngmf.getID(scwin, "scwin") + ".execOnChangeTabAfterLoadCompleted");
 * @exampleAsIs
 * @update 2016.02.29 박상규 tabControl이 onchange 이벤트 발생 시 wframe의 form_onLoadCompleted가 실행된 후에 실행할 함수명을 전달받아서 실행해 주는 기능 추가
 */
ngmf.setOnLoadCompletedEventInTab = function(tabControlId, onchangeEventFuncNm) {
	try {
		// 항목추출시 제외
		if (GLV && GLV.G_CCATEMP == "Y")
			return;
		var tabControl = ngmf.object(tabControlId);
		if (tabControl && typeof tabControl.getTabInfo == "function") {
			var tabInfo = tabControl.getTabInfo();
			tabControl._tabDrawStatus = [];
			for ( var idx = 0; idx < tabInfo.length; idx++) {
				if ((tabInfo[idx].alwaysDraw === false) && (idx !== 0)) {
					tabControl._tabDrawStatus[idx] = false;
				} else {
					tabControl._tabDrawStatus[idx] = true;
				}
			}

			tabControl.bind( "onchange",
				function(tabID, idx, userTabID) {
					if (this._tabDrawStatus[idx] === false) {
						this._tabDrawStatus[idx] = true;
						//상세권한제어 처리
						ngmf.globalFormCheckCallBack();
						ngmf._callFormOnloadCompletedToWframe(tabControl.getFrame(idx));
					}

					if (typeof onchangeEventFuncNm !== "undefined") {
						var funcArr = onchangeEventFuncNm.split(".");
						if (funcArr.length === 1) {
							window[funcArr[1]](idx);
						} else if (funcArr.length === 2) {
							window[funcArr[0]][funcArr[1]](idx);
						}
					}
				});
		} 
	} catch (e) {
		ngmf._error("[ngmf.setOnLoadCompletedEventInTab] Exception :: ", e);
	}
};

/**
 * 해당 컴포넌트에 입력한 class를 add하는 함수.
 * @date 2015.01.12
 * @memberOf ngmf
 * @param {String / Object} compId :: I :: N ::  :: 컴포넌트 명.
 * @param {String} addClass        :: I :: N ::  :: 추가할 class명
 * @author 이동규
 * @useMobile use
 * @example ngmf.addClass("gridView1", "gridStr");
 * @exampleAsIs
 */
ngmf.addClass = function (compId, addClass) {
	try {
		var comp = ngmf.object(compId);
		if (typeof comp !== "undefined") {
			var comp_Id;
			if (typeof comp.getID != "undefined") {
				comp_Id = comp.getID();
			} else {
				comp_Id = comp.id;
			}
			if (!$("#"+comp_Id).hasClass(addClass)) {
				$("#"+comp_Id).addClass(addClass);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.addClass] Exception :: ", e);
	}
};

/**
 * 해당 컴포넌트에 입력한 class를 다른 class로 변경하는 함수.
 * @date 2015.01.12
 * @memberOf ngmf
 * @param {String / Object} compId :: I :: N ::  :: 컴포넌트 명.
 * @param {String} orgClass        :: I :: N ::  :: 변경될 class명
 * @param {String} newClass        :: I :: N ::  :: 변경할 class명
 * @author 이동규
 * @useMobile use
 * @example ngmf.changeClass("gridView1", "gridStr1", "gridStr2"));
 * 단, 변경될 class가 없을경우 병경할 class를 add합니다.
 * @exampleAsIs
 */
ngmf.changeClass = function (compId, orgClass, newClass) {
	try {
		var comp = ngmf.object(compId);
		if (typeof comp !== "undefined") {
			var comp_Id;
			if (typeof comp.getID != "undefined") {
				comp_Id = comp.getID();
			} else {
				comp_Id = comp.id;
			}
			if ($("#"+comp_Id).hasClass(orgClass)) {
				$("#"+comp_Id).removeClass(orgClass);
				$("#"+comp_Id).addClass(newClass);
			} else {
				$("#"+comp_Id).addClass(newClass);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.changeClass] Exception :: ", e);
	}
};

/**
 *  공통용
 * @date 2016.01.13
 * @memberOf ngmf
 * @param {String} syncType		 :: I :: N ::      :: 동기, 비동기 구분
 * @param {String} trxCode		 :: I :: N ::      :: Transaction Code
 * @param {String} screenName	 :: I :: N ::      :: Service 호출 Window ID
 * @param {String} arg			 :: I :: Y ::      :: 처리 Argument
 * @param {String} inData		 :: I :: Y ::      :: Input DataList IDs
 * @param {String} outData		 :: I :: Y ::      :: Output DataList IDs
 * @param {String} callBackFunc	 :: I :: Y ::      :: CallBack Script NAME
 * @param {String} ngmv_MsgFg	 :: I :: Y :: NONE :: Message 처리(자동/설정) : SELP, NONE
 * @param {Boolan} clearDs	     :: I :: Y ::      :: dataSet clear 여부
 * @return 없음
 * @useMobile check
 * @update 2016.07.25 이동규 reqData 멀티Input 설정.
 * @example
 * @exampleAsIs
 */
ngmf.commonMainTransaction = function (syncType, trxCode, _screenName, arg, inData, outData, callBackFunc, ngmv_MsgFg, clearDs ){
	try {
		if(GLV.G_CLOSEFG == "6"){
			return;
		}
		var screenName = ngmf.apmScreenName (_screenName || "ZNGMSMAN00010");
		ngmf.bizTrSettingStop(trxCode);
		ngmv.fScreenName = ngmf.apmScreenName (screenName);
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
		var reqData;
		if (inCnt > 0) {
			reqData = {};
			for ( var i = 0; i < inCnt; i++) {
				if (i > 0) inDataStr += ",";
				inDataStr += inData[i].getID();
				if (inData[i].getRowCount() > 1) {
					reqData["input" + (i + 1)] = inData[i].getAllJSON();
				} else {
					reqData["input" + (i + 1)] = inData[i].getRowJSON(0);
				}
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
				ngmf.setSystemMsg("헤더 정보를 로드하는데 실패 하였습니다.");
			}
			return;
		}

		var strUrl = ngmf.SVC_PATH+"/SVC" + "?" + strSSO + "&rtcode=0&Trx_code=" + trxCode + "&ScreenName=" + screenName + ( ngmv.fCloseAccount || "&fCloseAccount=null");

		if(ngmf.length(ngmv_MsgFg) == 0){
			ngmv_MsgFg = "NONE";
		}
		trxCode = ngmf.trim(trxCode) + "|" + ngmf.trim(callBackFunc) + "|" + ngmf.trim(ngmv_MsgFg) + "|";
		if(ngmv_MsgFg.toUpperCase() != "SELF") {
			ngmf.setSystemMsg("");
		}

		var sDate 		= ngmf.extGetHDTime(); //ExtGetHDTime() ==> 웹스퀘어에서는 현재 구현불가
		var startTime 	= ngmf.trim(ngmf.timeM());
		var nIdx 		= GLV.G_iTrxCurIdx || 0;

		strUrl 			= ngmf.preTrxCall(strUrl);

		trxCode += "|" + nIdx;
		trxCode += "|" + sDate + "&" + screenName + "&" + startTime;
		trxCode += "|" + inDataStr;
		
		
		if (arg)
			strUrl += arg; 

		/************************* 통신하기 시작 *************************/
		//서브미션오브젝트 options
		var submissionObj = {
			"id" : trxCode,
			"ref" : "",
			"target" :"",
			"action" : strUrl, 
			"method" : "post",
			"mediatype" : "application/json",
			"encoding" : "UTF-8",
			"instance" : "",
			"replace" : "",
			"mode" : syncType,
			"processMsg" : "$blank",
			"submitHandler" : function(e) {
				//$w.log("submitHandler는 submit 시작전에 실행됩니다.");
			},			
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
										ds.removeAll({skipSavingRemovedData : "true"});
									}
									ds.setJSON( output , false );
									ds.reform();
								} else {
									//output DATASET DATA Clear
									ds.removeAll({skipSavingRemovedData : "true"});
								}
							} catch (ex) {

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
							screenName, startTime, 0, eval("GLV.__smElapsedTime"+ nIdx),
							eval("GLV.__smGlobalId" + nIdx),inDataStr, "SYNC", callBackFunc
						);
					} else if (syncType == "asynchronous") {
						ngmf.result(trxCode, ngmv.errorCode, ngmv.errorMsg);
					}
				} catch (ex) {
				}
				$w.deleteSubmission(trxCode);
			}, // [end] "submitDoneHandler"
			"submitErrorHandler" : function(e) {
				ngmf._errorHandlingMsg(e);
			} // [end] "submitErrorHandler"
		};

		$w.createSubmission(submissionObj); //서브미션 생성
		$w.executeSubmission(trxCode,reqData);  //서브미션 실행
		/************************* 통신하기 종료 *************************/
	} catch (e) {
		ngmf._error("[ngmf.commonMainTransaction] Exception :: ", e);
	}
};

/**
 * 화면 ID 로 호출 URL 생성
 * @date 2016.01.06.
 * @memberOf ngmf
 * @param {String} formid   :: I :: N ::  :: SCREEN ID  ex :: PG-0450
 * @param {String} moduleId :: I :: N ::  :: module ID ex :: EDU
 * @returns {String}
 * @author 성일호
 * @useMobile use
 * @example ngmf.getMenuUrl("PG-0450");
 * @exampleAsIs
 */
ngmf.getMenuUrl = function (formid, moduleId) {
    try {
		if (!formid) return "";
    	var pageUrl = "";
		if (typeof moduleId == "undefined" || !moduleId) moduleId = ngmf.getSvcId(formid);
		if (formid && ngmf._compPage(formid)) {
			pageUrl = GLD.dlt_MenuList.getMatchedJSON( "screenNm" , formid , true)[0]["pageUrl"];
		} else if(moduleId){
			pageUrl = "../../" + moduleId + "/xml/"+formid+".xml";
		}

		var URL = WebSquare.core.getURL(pageUrl);
		var _locationStr = GLD.location.toString();
		if (_locationStr.indexOf("?")) _locationStr = _locationStr.split("?")[0];
		URL =   _locationStr + "?w2xPath=" + URL + "&w2xHome=" + WebSquare.w2xHome + "&w2xDocumentRoot=" + WebSquare.w2xDocumentRoot;
		return URL;
    } catch(e) {
    	ngmf._error("[ngmf.getMenuUrl] Exception :: ", e);
    }
	return "";
};

/**
 * 화면 항목별 권한설정시 대상 화면(Form) 호출
 * @date 2016.01.06.
 * @memberOf ngmf
 * @param {String} formid       :: I :: N ::  :: SCREEN ID  ex :: PG-0450
 * @param {String} moduleId     :: I :: Y ::  :: 업무구분 ::: EDU , CAM, AAT
 * @param {String} dataSetId    :: I :: Y ::  :: 결과 저장할 DATASET ID
 * @param {Object} viewId       :: I :: Y ::  :: 화면 미리보기용 IFRAME ID 또는 WebSquare 객체
 * @param {String} callBackName :: I :: Y ::  :: CALLBACK 펑션이름
 * @param {Object} gridId       :: I :: Y ::  :: 그리드 객체 또는 그리드 ID
 * @author 성일호
 * @useMobile use
 * @example ngmf.ccaOpenform("PG-0450", "EDU" ,"dst_input"); //return null
 * @exampleAsIs
 */
ngmf.ccaOpenform = function (formid, moduleId, dataSetId, viewId, callBackName, gridId) {
	if (!formid) return;
	try {
		var iFrmId =  viewId || "__menuWinFrm__" ;
		var tgtPath = ngmf.getMenuUrl(formid,moduleId);
		if (GLV && typeof GLV == "object") GLV.G_CCATEMP = "Y";

		var _menuWinFrmchk = false;
		var _menuWin = document.getElementById(iFrmId);
	    if (_menuWin != null ) {
	        _menuWinFrmchk = true;
	    }
	    var _menuWinDiv = null ;

	    if (!_menuWinFrmchk) {
	        _menuWinDiv = document.createElement("div");
	        _menuWinDiv.id = "___menuWinFrm__div";
	        _menuWinDiv.style.width = "100%";
	        _menuWinDiv.style.height = "500px";
	        _menuWinDiv.style.visibility = "hidden";
	        document.body.appendChild(_menuWinDiv);
	        _menuWinDiv.innerHTML = "<iframe frameborder='0' id='"+iFrmId+"' name='"+iFrmId+"' scrolling='auto' style='width:100%; height:500px; display:none;' src='" + tgtPath + "'></iframe>";
	        _menuWin = document.getElementById(iFrmId);
	    } else {
	        _menuWin.src = tgtPath;
	    }
	    
	    if (!scvar["_ccaMenuWin"]) scvar["_ccaMenuWin"] = formid;
	    ngmf._setBatchProgress("항목읽어오기 처리중입니다.");	
	    scvar["_ccaMenuFunc"] = function() {
	    	ngmf.catchComponent(dataSetId, viewId, callBackName, gridId);
	    }; 
	    
	} catch(e) {
		ngmf._error("ngmf.ccaOpenform Exception",e);
	}
};

/**
 * 화면 항목 추출
 * @date 2016.01.06.
 * @memberOf ngmf
 * @param {String} dataSetId    :: I :: N ::                :: 결과 저장할 DATASET ID
 * @param {Object} viewId       :: I :: Y :: __menuWinFrm__ :: 화면 미리보기용 IFRAME ID 또는 WebSquare 객체
 * @param {String} callBackName :: I :: Y ::                :: CALLBACK 펑션이름
 * @param {Object} gridId       :: I :: Y ::                :: 그리드 객체 또는 그리드 ID
 * @author 성일호
 * @useMobile use
 * @update 2016.05.13 이동규 그리드 추가행의 Background표준 수정(#9abffa->#ffe9c4).
 * @example ngmf.ccaOpenform("PG-0450", "/SWING/EDU" ,"dst_input"); //return null
 * @update 2016.02.12 textbox 한글명 추출 로직 변경 (Label 사용)
 * @update 2016.04.28 상세항목 추출시 연관메뉴 항목 추가
 */
ngmf.catchComponent = function  ( dataSetId, viewId, callBackName, gridId) {
	var formId = null;
	var contWrap = null;
	var uUIDPrefix = null;
	var tgtGrid = null;
	if(gridId) {
		tgtGrid = ngmf.object(gridId);
	}
	try {
		if (viewId == null || typeof viewId == "string") {
			var iFrmId =  viewId || "__menuWinFrm__" ;
			var _menuWin = document.getElementById(iFrmId);
				uUIDPrefix = _menuWin.contentWindow.WebSquare.UUIDPrefix || "wq_uuid";
				contWrap =_menuWin.contentWindow.WebSquare.getBody();
				formId = _menuWin.contentWindow.scvar.__screenName;
				try {
					if (_menuWin.contentWindow.document.getElementById("__processModal_XXX") == null) {
						var _gendiv = null;
						_gendiv = document.createElement("div");
						_gendiv.id = "__processModal_XXX";
						_gendiv.className = "w2modal";
						_gendiv.style.zIndex = "10010";
						_gendiv.style.backgroundColor = "#fff";
						_menuWin.contentWindow.document.body.appendChild(_gendiv);
					}
				} catch (e) {
					ngmf._error("[ngmf.catchComponent] Exception :: ", e);
				}
		} else {
			uUIDPrefix = viewId.UUIDPrefix || "wq_uuid";
			contWrap = viewId.getBody();
			formId = scvar.__screenName || ngmf.getFormID();
			try {
				if (viewId.document.getElementById("__processModal_XXX") == null) {
					var _gendiv = null;
					_gendiv = document.createElement("div");
					_gendiv.id = "__processModal_XXX";
					_gendiv.className = "w2modal";
					_gendiv.style.zIndex = "10010";
					_gendiv.style.backgroundColor = "#fff";
					viewId.document.body.appendChild(_gendiv);
				}
			} catch (e) {
			}
		}
	} catch (e) {
		GLV.G_CCATEMP = "N";
		if (scvar["_ccaMenuWin"]) delete scvar["_ccaMenuWin"];
		if (scvar["_ccaMenuFunc"]) delete scvar["_ccaMenuFunc"];
		ngmf._setBatchProgress("");
		ngmf._error("[ngmf.catchComponent] Exception :: ", e);
		return;
	}
	
	
	
	var arrayCompList = [];
	var arrayCnt = -1;
	var notCatchObject = {
			"ifm_popOverBodyFrame" : true,
			"wfm_popOverBodyFrame" : true,
			"wfm_headerContent" : true
	};

	function setCompDataList () {
		if (arrayCnt > -1 ){
			var tmpArr=null , itmTyp="",rowIdx = -1, chkDataIdx = [].constructor , isData = false;
			var targetDataSet = ngmf.object(dataSetId);
			if (targetDataSet) {

				if(typeof targetDataSet.getColumnIndex("scrn_itm_eng_nm") == "undefined") {
					targetDataSet.insertColumn("scrn_itm_eng_nm",{
						'name':		'화면항목(영문)',
						'dataType':	'text'
					});
					if(typeof targetDataSet.getColumnIndex("scrn_itm_han_nm") == "undefined") {
						targetDataSet.insertColumn("scrn_itm_han_nm",{
							'name':		'화면항목(한글)',
							'dataType':	'text'
						});
					}
					if(typeof targetDataSet.getColumnIndex("scrn_itm_typ_cd") == "undefined") {
						targetDataSet.insertColumn("scrn_itm_typ_cd",{
							'name':		'화면항목유형',
							'dataType':	'text'
						});
					}
					if(typeof targetDataSet.getColumnIndex("scrn_itm_auth_aply_cd") == "undefined") {
						targetDataSet.insertColumn("scrn_itm_auth_aply_cd",{
							'name':		'적용방법',
							'dataType':	'text'
						});
					}
					if(typeof targetDataSet.getColumnIndex("usable_yn") == "undefined") {
						targetDataSet.insertColumn("usable_yn",{
							'name':		'사용가능여부',
							'dataType':	'text'
						});
					}
				}
	    		targetDataSet.setEventPause(null,true);
	    		for (var idx =0 ; idx < arrayCompList.length ; idx ++) {
	    			tmpArr = arrayCompList[idx].split(",");
	    			itmTyp = tmpArr[1];
	    			isData = false;
	    		    switch (tmpArr[1])
	    		    {
	    		    	case "anchor":
	    		    	case "trigger": itmTyp = "BTN"; break;
		    		    case "calendar":
		    		    case "inputcalendar": itmTyp = "CAL"; break;
		    		    case "checkbox": itmTyp = "CHK"; break;
		    		    case "checkcombobox":
		    		    case "autocomplete":
		    		    case "selectbox": itmTyp = "COM"; break;
		    			case "switch" :
		    			case "slidehide" :
		    		    case "wframe":
		    		    case "iframe":
		    			case "panels" :
		    			case "case" :
		    			case "repeat" :
		    			case "content" :
		    			case "scrollview" :
		    		    case "group":  itmTyp = "DIV"; break;
		    		    case "gridview": itmTyp = "GRD"; break;
		    		    case "multiselect": itmTyp = "LIS"; break;
		    		    case "radio": itmTyp = "RDO"; break;
		    		    case "image": itmTyp = "SHP"; break;
		    		    case "spinner": itmTyp = "SPN"; break;
		    		    case "textbox": itmTyp = "STA"; break;
		    		    case "secret":
		    		    case "input":
		    		    case "textarea": itmTyp = "EDT"; break;
		    		    case "accordion":
		    		    case "tabcontrol": itmTyp = "TCL"; break;
		    		    case "tabpage":   itmTyp = "TAB"; break;
//		    		    default: itmTyp = "NOT"; break;
	    		    }

	    		    rowIdx = -1;
	    		    chkDataIdx = [];
	    		    chkval = "0";
	    		    isData = false;
	    		    if ( itmTyp != "") {
	    		    	chkDataIdx = targetDataSet.getMatchedIndex("scrn_itm_eng_nm",tmpArr[0],true);
	        		    if (chkDataIdx.length > 0) {
	        		    	isData = true;
	        		    	rowIdx = chkDataIdx[0];
	        		    } else {
	        		    	rowIdx = targetDataSet.insertRow();
	        		    	chkval = "1";
	        		    }
	        		    if (isData) {
	        		    	targetDataSet.setCellData(rowIdx,"scrn_itm_typ_cd", itmTyp);
	        		    } else if (rowIdx > -1 && !isData){
	        		    	targetDataSet.setCellData(rowIdx,"scrn_itm_eng_nm", tmpArr[0]);
	        		    	targetDataSet.setCellData(rowIdx,"scrn_itm_typ_cd", itmTyp);
	        		    	targetDataSet.setCellData(rowIdx,"scrn_itm_han_nm",tmpArr[2] );
        		    		targetDataSet.setCellData(rowIdx,"usable_yn","N");
        		    		if(tgtGrid) tgtGrid.setRowBackgroundColor(rowIdx, "#ffe9c4");
	        		    }
	    		    }
	    		}
	    		
	    		//2016.04.28 연관메뉴 항목 추가 => 보류
	    		/*
	    		var dataCompMain = GLD.ngmf.object("dsl_relativeBtn");
	    		if (formId && dataCompMain) {
	    			var screenBtnArr = dataCompMain.getMatchedJSON("screenNm", formId);
	    			if (screenBtnArr && screenBtnArr.length > 0) {
	    				var screenBtnJson = null;
	    	    		for (var idx =0 ; idx < screenBtnArr.length ; idx ++) {
	    	    			screenBtnJson = screenBtnArr[i];
	    	    		    rowIdx = -1;
    	    		    	chkDataIdx = targetDataSet.getMatchedIndex("scrn_itm_eng_nm",screenBtnJson["btnId"],true);
    	        		    if (chkDataIdx.length > 0) {
    	        		    	continue;
    	        		    } else {
    	        		    	rowIdx = targetDataSet.insertRow(0);
    	        		    	targetDataSet.setCellData(rowIdx,"scrn_itm_eng_nm", screenBtnJson["btnId"]);
    	        		    	targetDataSet.setCellData(rowIdx,"scrn_itm_typ_cd","BTN"); //anchor
    	        		    	targetDataSet.setCellData(rowIdx,"scrn_itm_han_nm",screenBtnJson["btnNm"] );
    	        		    	if (screenBtnJson["hide"]) {
    	        		    		targetDataSet.setCellData(rowIdx,"scrn_itm_auth_aply_cd","HIDDEN");
    	        		    		targetDataSet.setCellData(rowIdx,"usable_yn","Y");
    	        		    	} else {
    	        		    		targetDataSet.setCellData(rowIdx,"usable_yn","N");
    	        		    	}	
            		    		if (tgtGrid) tgtGrid.setRowBackgroundColor(rowIdx, "#9abffa");
    	        		    } 
	    	    		}
	    			}
	    		}
	    		*/

	    		if (callBackName != null) {
	    			if (typeof callBackName === "function") {
	    				callBackName.call();
	    			} else {
	    				if (callBackName.startsWith("scwin.")) {
	    					callBackName = callBackName.replace("scwin.", "");
	    				}
	    				var func = window.scwin[callBackName];
    					if (typeof func === "function") {
    						func.call();
    					}
	    			}
	    		}

			}
			targetDataSet.setEventPause(null,false);
		}

	};

	//END setCompDataList

	function recursiveGroupComp (targetObj) {
		if (targetObj) {
			var chkType , targetObjChildLists;
			var pPluginName = targetObj.getPluginName();
			if (pPluginName == null || pPluginName == "") pPluginName = targetObj._wTagName;
			pPluginName = pPluginName.toLowerCase();
			targetObjChildLists = targetObj.childControlList;

			if (pPluginName== "tabcontrol") {
				for (var idx = 0 ; idx < targetObjChildLists.length; idx ++) {
					try {
						compHName = targetObjChildLists[idx].getID();
	    				if (targetObjChildLists[idx].getUserData("userData1")) compHName = targetObjChildLists[idx].getUserData("userData1") ;
						arrayCompList.push(targetObjChildLists[idx].getID()+",tabpage," +compHName);
						arrayCnt++;
						recursiveGroupComp(targetObjChildLists[idx]);
					} catch(e) {
//						 WebSquare.exception.printStackTrace(e, null , this);
					}
				}
			} else {
				for (var idx = 0 ; idx < targetObjChildLists.length; idx ++) {
					try {
						//권한제어 예외 Component 제거
						if(typeof targetObjChildLists[idx].getID == "undefined") continue;
						if(notCatchObject[targetObjChildLists[idx].getID()]) continue;

						chkType = targetObjChildLists[idx].getPluginName();
						if (chkType == null || chkType == "") chkType = targetObjChildLists[idx]._wTagName;
						chkType = chkType.toLowerCase();
						switch(chkType) {
			    			case "tabcontrol" :
			    			case "group" :
			    			case "switch" :
			    			case "wframe" :
			    			case "accordion" :
			    			case "iframe" :
			    			case "panels" :
			    			case "case" :
			    			case "repeat" :
			    			case "tabcontainer" :
			    			case "content" :
			    			case "slidehide" :
							case "scrollview" :
			    				if (targetObjChildLists[idx].getID().indexOf(uUIDPrefix) == -1) {
			        				compHName = targetObjChildLists[idx].getID();
			        				if (targetObjChildLists[idx].getUserData("userData1")) compHName = targetObjChildLists[idx].getUserData("userData1") ;
			    					arrayCompList.push(targetObjChildLists[idx].getID()+"," + chkType + "," +compHName);
			    					arrayCnt++;
			    				}
			    				recursiveGroupComp(targetObjChildLists[idx]);
			    				break;
			    			case "body" :
			    				recursiveGroupComp(targetObjChildLists[idx]);
			    				break;
			    		    default:

			    				if (targetObjChildLists[idx].getID().indexOf(uUIDPrefix) == -1) {
			        				compHName = targetObjChildLists[idx].getID();
			        				if (targetObjChildLists[idx].getUserData("userData1")) compHName = targetObjChildLists[idx].getUserData("userData1") ;
			        				else if ((chkType =="textbox" || chkType =="trigger") && targetObjChildLists[idx].getLabel().trim() != "") {
			        					compHName = targetObjChildLists[idx].getLabel().trim();
			        					if (compHName.indexOf(":") > -1) compHName = compHName.split(":")[1].trim();
			        				}
			    					arrayCompList.push(targetObjChildLists[idx].getID()+"," + chkType + "," +compHName);
			    					arrayCnt++;
			    				}
			    		     break;
			    		}
					} catch(e) {
						ngmf._error("[ngmf.catchComponent] Exception :: ", e);
					}
				}
			}
		}
	}; //END recursiveGroupComp
	
	if (contWrap) { 
		try {
//			ngmf._debug ("START recursiveGroupComp");
			recursiveGroupComp(contWrap);
			if (arrayCnt >-1 && dataSetId) {
				setCompDataList();
			}
//			ngmf._debug ("END recursiveGroupComp");
		} catch (e) {
			ngmf._error("[ngmf.catchComponent] Exception :: ", e);
		}
	}
	
	if (GLV && typeof GLV == "object") {
		GLV.G_CCATEMP = "N";
		if (scvar["_ccaMenuWin"]) delete scvar["_ccaMenuWin"];
		if (scvar["_ccaMenuFunc"]) delete scvar["_ccaMenuFunc"];
		ngmf._setBatchProgress("");
	}
};


/**
 * form load 시 Control 속성 변경
 * @date 2016.01.06.
 * @memberOf ngmf
 * @param {String} tabObj :: I :: N ::  :: TabControl 객체
 * @param {String} contId :: I :: N ::  :: 찾고자하는 TabPage Content ID
 * @returns {Number} null
 * @author 성일호
 * @useMobile use
 * @example ngmf.getTabIndex2cntId(tabObj, "tabObi_contents_content1_body"); //return null
 * @exampleAsIs
 */
ngmf.getTabIndex2cntId = function(tabObj, contId) {
    var idx = -1 ;
    try {
    	if (tabObj && tabObj.tabArr) {
	        for (var i = 0; i < tabObj.tabArr.length; i++) {
	            if (contId == tabObj.tabArr[i].contentsID + "_body") {
	            	idx = i;
	                break;
	            }
	        }
    	}
    } catch (e) {
//        WebSquare.exception.printStackTrace(e, null , this);
    }
    return idx;
};

/**
 * 상세권한 설정에 따라 Control 속성 변경
 * @date 2016.01.06.
 * @memberOf ngmf
 * @param {String} trxCode   :: I :: Y ::  :: 서비스 코드
 * @param {String} errorCode :: I :: Y ::  :: 에러코드
 * @param {String} errorMsg  :: I :: Y ::  :: 에러메세지
 * @author 성일호
 * @useMobile use
 * @example ngmf.globalFormCheckCallBack(trxCode, errorCode, errorMsg); //return null
 * @update 2016.02.12 링크메뉴 호출 위치 변경
 * @update 2016.02.15 리턴로직 제거
 * @update 2016.04.28 Disable API ngmf.enable로 변경 
 */
ngmf.globalFormCheckCallBack = function(trxCode, errorCode, errorMsg) {
	var tgtDataList =  ngmf.object("ds_CtrlChkComp");
	 if (typeof tgtDataList != "undefined" && tgtDataList) {
		 try{
			 //if (typeof tgtDataList == "string") tgtDataList = ngmf.object(_tgtDataList);
			 if (tgtDataList.initializeType && tgtDataList.initializeType == "dataList") {
				 	if (tgtDataList.getRowCount() >  0 ) {
						var strControl;
						var strType;
						var strAttr;
						var ctrObj;
						var chkObj = null;

						for(var i=(tgtDataList.getRowCount() -1);i>-1;i--) {
							try {
								strControl = tgtDataList.getCellData(i,"scrn_itm_eng_nm").trim();
								strType = tgtDataList.getCellData(i,"scrn_itm_typ_cd").trim();
								strAttr = tgtDataList.getCellData(i,"scrn_itm_auth_aply_cd").trim();
								if (ngmf._controlComponent (strControl,strType, strAttr)) ds_CtrlChkComp.removeRow(i);
							 } catch (e) {
								 ngmf._error("[ngmf.globalFormCheckCallBack] Exception :: ", e);
							 }
						} // END for
						//ngmf.clear(tgtDataList);
				 	}
			 } //
		 } catch (e) {
			 ngmf._error("[ngmf.globalFormCheckCallBack] Exception :: ", e);
		 }
	 }
	 //링크메뉴 호출......
	 // 기능 제공하지 않음 2016.08.05
	 //if (typeof trxCode != "undefined" && trxCode) ngmf.relNlinkMenu("LK");	
};

ngmf._controlComponent = function () {
	try {
		var strControl = arguments[0];
		var strType = arguments[1];
		var strAttr = arguments[2];
		var ctrObj = ngmf.object(strControl);
		if (ctrObj) {
			if (strType == "STA" || strType == "textbox") {
				var chkObj = $("#"+strControl);
				if (chkObj && chkObj.length > 0 ) {
					switch (strAttr) {
						case "DISABL" :
						case "HIDDEN" :
							chkObj.css("display", "none");
							break;
						case "RDONLY" :
							//TODO필요시 구현...
							break;
						default :
							break;
					}
				}
			} else if (strType == "TAB" || strType == "tabpage") {
				var tabIdx = ngmf.getTabIndex2cntId(ctrObj.parentControl, strControl );
				if (tabIdx < 0) return false;
				switch (strAttr) {
					case "DISABL" :
						ctrObj.parentControl.disableTab(tabIdx);
						break;
					case "HIDDEN" :
						ctrObj.parentControl.hideTab(tabIdx);
						break;
					case "RDONLY" :
						ctrObj.setReadOnly(true);
						break;
					default :
						break;
				}

			} else {
				switch (strAttr) {
					case "DISABL" :
						ngmf.enable(ctrObj, false);
						//ctrObj.setDisabled(true);
						break;
					case "HIDDEN" :
						ctrObj.hide();
						break;
					case "RDONLY" :
						if (ctrObj.setReadOnly) {
							ctrObj.setReadOnly(true);
						} else if (ctrObj.setDisabled) {
							ctrObj.setDisabled(true);
						}
						if(strType == "MAE") {
							// MAE일 경우
						} else if(strType == "NMW") {
							// NAMO WEBEDITOR
							//objNm.object(strControl).EditMode = false;
						} else {

						}
						break;
					default :
						break;
				}
			}
			return true;
		}
	} catch (e) {
		 ngmf._error("[ngmf._controlComponent] Exception :: ", e);
	}
	return false;
};
/**
 * form load 시 상세권한 설정에 따라 Control 속성 변경
 * @date 2016.01.06.
 * @memberOf ngmf
 * @param {String} strFm   :: I :: N ::  :: SCREEN ID  ex :: PG-0450
 * @param {String} biz_val :: I :: Y ::  :: Biz-Tr Stop Setting Flag
 * @author 성일호
 * @useMobile use
 * @example ngmf.globalFormCheck("PG-0450"); //return null
 * @exampleAsIs
 */
ngmf.globalFormCheck = function(strFm, biz_val) {
	// 개발인 경우 제외
	if (GLV && GLV.G_DEVFG == "Y")
		return;
	try {
		strFm = ngmf.trim(strFm);
		// null 체크
		if (strFm.length == 0) {
			return;
		}
		// MAIN영역 제외
		if (ngmf.left(strFm, 8) == "ZNGMSMAN") {
			return;
		}

		// 사용자별 상세권한 리스트에 있는 것만 호출
		if (GLD.GDS_DET_FORMLIST.getRowCount() > 0) {
			var tmpFindRow = GLD.GDS_DET_FORMLIST.getMatchedIndex("pgm_id", strFm, true);
			if (!tmpFindRow || tmpFindRow.length == 0 || tmpFindRow[0] < 0) {
				ngmf.clear(GLD.GDS_USER2);
				return;
			}
		}

		if (biz_val && biz_val == "Y") {
			GLV.G_BizCd = "";
			GLV.G_Biz_Start_Time = "";
		} else {
			if (strFm.length == 13) {
				// Biz-TR 폼 온로드 대상인지 체크
				var varTransIdx = GLD.GDS_ZSYS_VR_TRANS.getMatchedIndex( "vr_trans_id", strFm + "_EV00", true);
				if (varTransIdx && varTransIdx.length > 0 && varTransIdx[0] > -1) {
					GLV.G_BizCd = strFm + "_EV00";
					GLV.G_Biz_Start_Time = ngmf.extGetHDTime();
				}
			}
		}

		var TrxCode = "ZNGMSDET10090_TR10"; // Transaction Code
		var ScreenName = "ZNGMSMAN00010"; // 화면이름

		ngmf.clear(GLD.GDS_USER1);
		GLD.GDS_USER1.insertColumn('pgm_id', {
			'name' : 'pgm_id',
			'dataType' : 'text'
		});

		var aRow = GLD.GDS_USER1.insertRow();
		GLD.GDS_USER1.setCellData(aRow, "pgm_id", strFm);
		
		//Global DS [GLD.GDS_USER2]  에서 내부로 변경
		ngmf.createDataList("ds_CtrlChkComp");
		ngmf.commonMainTransaction("asynchronous", TrxCode, ScreenName, "", null, "ds_CtrlChkComp", "ngmf.globalFormCheckCallBack", "SELF", true);

	} catch (e) {
		ngmf._error("[ngmf.globalFormCheck] Exception :: ", e);
	}
};

/**
 * 셀렉트박스(combo)에 value 값을 통해 해당 index 찾는 함수입니다.
 * @date 2016.01.14.
 * @memberOf ngmf
 * @param {String} comboId :: I :: N ::  :: selectBoxID (comboID)
 * @param {String} value   :: I :: N ::  :: index를 검색할 value 값
 * @param {String} type    :: I :: Y ::  :: 동일한 value값이 여러개일 경우 반환 설정 ("" : 첫번째 찾은 index값 반환, all: 전체 index를 배열로 반환)[default : ""]
 * @author 이동규
 * @useMobile use
 * @example ngmf.getComboIndex("comboID", "Y")
 * @exampleAsIs
 */
ngmf.getComboIndex = function (comboId, value, type) {
 	try {
 		if (typeof comboId != "undefined" && typeof ngmf.object(comboId) != "undefined") {
 			var comp = ngmf.object(comboId);
 			var selectItem = comp.getItemArray();
 			var idxArr = new Array();
 			var type = (typeof type !== "undefined") ? type : "";
 			for ( var i = 0 ; i < selectItem.length; i++) {
 				if (value == selectItem[i].value) {
 					idxArr.push(i);
 				}
 			}

 			if (type == "") {
 				return idxArr[0];
 			} else if (type == "all") {
 				return idxArr;
 			}
 		}
 	} catch(e) {
 		ngmf._error("[ngmf.getComboIndex] Exception :: ", e);
 	}
};

/**
 * 입력받은 input 컴포넌트에 입력 값 maxLength 를 반환합니다.
 * @date 2016.01.15.
 * @memberOf ngmf
 * @param {String} comboId :: I :: N ::  :: 컴포넌트 ID
 * @return {Number} 컴포넌트에 설정 된 maxthLength 값
 * @author 이동규
 * @useMobile use
 * @example ngmf.getMaxlength("comboID")
 * @exampleAsIs
 */
ngmf.getMaxLength = function(compId) {
	try {
		if (typeof compId != "undefined" && typeof ngmf.object(compId) != "undefined") {
			var comp = ngmf.object(compId);
			if (typeof comp.getMaxLength == "function") {
				return comp.getMaxLength();
			}
		}
		return -1;
	} catch(e) {
		ngmf._error("[ngmf.getMaxlength] Exception :: ", e);
	}
};

/**
 * 입력받은 input 컴포넌트에 입력 maxLength를 설정합니다.
 * @date 2016.01.15.
 * @memberOf ngmf
 * @param {String} comboId :: I :: N ::  :: selectBoxID (comboID)
 * @param {number} length  :: I :: N ::  :: 동일한 value값이 여러개일 경우 반환 설정 ("" : 첫번째 찾은 index값 반환, all: 전체 index를 배열로 반환)[default : ""]
 * @return {Number} 컴포넌트에 설정 된 maxthLength 값
 * @author 이동규
 * @useMobile use
 * @example ngmf.getComboIndex("comboID", "Y")
 * @exampleAsIs
 */
ngmf.setMaxLength = function(compId, length) {
	try {
		if (typeof compId != "undefined" && typeof ngmf.object(compId) != "undefined") {
			var comp = ngmf.object(compId);
			if (typeof comp.setMaxLength == "function" && Number(length) > -1) {
				comp.setMaxLength(Number(length));
				return comp.getMaxLength();
			}
		}
		return comp.getMaxLength();
	} catch(e) {
		ngmf._error("[ngmf.setMaxLength] Exception :: ", e);
	}
};

/**
 * 가장 최근에 일한 날자를 구하해줌
 * @date 2016-01-18
 * @memberOf ngmf
 * @param {String} inVal :: I :: Y ::  :: yyyyMMdd 형의 날짜
 * @returns {String} yyyyMMdd 형의 날짜
 * @useMobile use
 * @example
 * @description
 * @exampleAsIs WorkDate(20041229);
 */
ngmf.workDate = function (inVal) {
	try {
		if (!inVal) return "";
		var sRtnVal = inVal;

		if(GLD.ngmf.Calendar && GLD.ngmf.Calendar.getPreHoliday)
			sRtnVal = GLD.ngmf.Calendar.getPreHoliday(inVal);

		return sRtnVal;
	} catch (e) {
		ngmf._error("[ngmf.workDate] Exception :: ", e);
	}
};

/**
 * ngmf.currency 입력된 값을 Currency Variant 형으로 전환(삭제검토)
 * 미사용 삭제용 빈함수
 * @date 2016-01-18
 * @memberOf ngmf
 * @param {String} inVal :: I :: N ::  :: 첨부파일 에러코드여부
 * @useMobile delete
 * @example
 * @description
 * @exampleAsIs 	// Maximum value
	strCurrency = "922337203685477.5807";
	var varCurrency = Currency ( strCurrency );
	Alert( strCurrency + "\n" + varCurrency );
	// Minimum value
	strCurrency = "-922337203685477.5807";
	varCurrency = Currency ( strCurrency );
	Alert( strCurrency + "\n" + varCurrency );
	// From Integer
	nCurrency = 100;
	varCurrency = Currency ( nCurrency );
	Alert( nCurrency + "\n" + varCurrency );
	// From Decimal
	dCurrency = -100.00;
	varCurrency = Currency ( dCurrency );
	Alert( dCurrency + "\n" + varCurrency );

 */
ngmf.currency = function (inVal) {
	try {
		var sRtnVal = "";
		//빈 함수
		return sRtnVal;
	} catch (e) {
		ngmf._error("[ngmf.currency] Exception :: ", e);
	}
};

/**
 * ngmf.parseCurrency(삭제검토)
 *  입력된 값을 Currency Variant 형으로 전환
 * 미사용 삭제용 빈함수
 * @date 2016-01-18
 * @memberOf ngmf
 * @param {String} inVal :: I :: N ::  :: 첨부파일 에러코드여부
 * @useMobile delete
 * @example
 * @description
 * @exampleAsIs  var varDate = DateTime ( Calendar0.Value );
	Static0.Text = ToNumber ( ParseCurrency ( varDate ) );

 */
ngmf.parseCurrency = function (inVal) {
	try {
		var sRtnVal = "";
		//빈 함수
		return sRtnVal;
	} catch (e) {
		ngmf._error("[ngmf.parseCurrency] Exception :: ", e);
	}
};

/**
 * ngmf.lunar2Solar
 *  음력으로 된 날짜를 양력으로 
 * @date 2016-01-18
 * @memberOf ngmf
 * @param {String} inVal :: I :: N ::  :: 첨부파일 에러코드여부
 * @useMobile use
 * @example
 * @description
 * @exampleAsIs Lunar2Solar(20041229);
 */
ngmf.lunar2Solar = function (_inVal) {
	try {
		var inVal = _inVal || (new Date()).format("yyyymmdd");
		var dt = inVal.trim().replaceAll("-","").replaceAll(".","");
		var sY = dt.substring(0, 4);
		var sM = dt.substring(4, 6);
		var sD = dt.substring(6, 8);

		var dtL = ngmf.Calendar.lunarCalc(sY, sM, sD, 2, 0);
		return dtL.toString();

	} catch (e) {
		ngmf._error("[ngmf.lunar2Solar] Exception :: ", e);
	} 
};

/**
 * 입력된 값을 DateTime 형으로 전환하는 API 입니다.
 * @date 2016-01-18
 * @memberOf ngmf
 * @param {Integer / String / Object} dateInfo :: I :: N ::  :: 날짜 정보
 * @useMobile use
 * @example
 * @description
 * @exampleAsIs ParseDateTime(732645);
 */
ngmf.parseDateTime = function (dateInfo) {
	try {
		var sRtnVal = "";
		
		
		if(typeof dateInfo == "string" && ngmf.type(dateInfo) == "DATE") { //문자타입인 경우(ex : "20160405")
			sRtnVal = dateInfo;
		} else if(typeof dateInfo == "object") {
			var dateObj = ngmf.object(dateInfo);
			
			sRtnVal = dateObj.getValue();
			
		} else if(typeof dateInfo == "number") { //숫자타입인경우(ex : 732645)
			var date = new Date('0000-01-01'); //0000년 1월 1일시점으로 일수 계산
			
			date.setDate(date.getDate() + ngmf.toInteger(dateInfo));
			
			var yyyy = date.getFullYear();
			var MM = date.getMonth()+1;
			var dd = date.getDate();
			if ((MM + "").length < 2) {
				MM = "0" + MM;
			}
			if ((dd + "").length < 2) {
				dd = "0" + dd;
			}
			sRtnVal = yyyy + "" + MM + "" + dd;
		} 
				
		return sRtnVal;
	} catch (e) {
		ngmf._error("[ngmf.parseDateTime] Exception :: ", e);
	}
};

/**
 * 컴포넌트 사용 가능 여부를 설정하는 함수.
 * @date 2016-01-19
 * @memberOf ngmf
 * @param {String} compId     :: I :: N ::  :: 컴포넌트 ID
 * @param {String} flag       :: I :: Y ::  :: 사용 여부 flag
 * @param {String} allAdative :: I :: Y ::  :: 내부 컴포넌트 전체 적용 여부 flag [default :false]
 * @author 이동규
 * @useMobile use
 * @update 2016.04.14 이동규 그룹 단위의 컴포넌트를 사용 여부를 설정할 시 그룹 내부 컴포넌트의 
 *                    enable 적용 상태를 변경없이 설정하는 기능을 작업.
 * @update 2016.04.21 이동규 enable의 파라메터 flag 가 없는 경우 get개념으로 리턴 처리.
 * @update 2016.05.04 이동규 enable의 파라메터 pAllAdative 추가.
                             pAllAdative가 true 일 경우, enable 적용 컴포넌트의 하위 컴포넌트도 모두 적용됩니다.
 * @update 2016.05.23 이동규 enable 로직 수정.
 * @update 2016.07.06 성일호 comp.getPluginName 함수여부 체크조건 추가, 없는 경우 있음(UDC 등)
 * @example ngmf.enable("comp1", true); //return true;
 * @exampleAsIs
 * @wsAPI 
-컴포넌트.setDiabled(flag)
컴포넌트의 disabled 속성을 설정한다. disabled 속성을 활성화 시키려면 true 비활성화 시키려면 false를 입력합니다.
파라메터 flag 가 없는 경우 false를 반환합니다 
group wframe 등 div형식의 tag가 하위 컴포넌트를 가지고 있을때 하위 모든 컴포넌트도 비활성화 및 활성화합니다.

componentId.setDisabled(true);

 * @ngmfAPI

※ngmf.enable가 표준 API입니다. 				
-컴포넌트 속성중 attribute 속성의 disabled이 적용되지 않는 태그들을 확인하여
disabled class로 디자인을 수정한다, a 태그 경우는 동작을 막습니다.

-setDiabled은 부모 컴포넌트 disalbed 속성과 하위의 컴포넌트의 disabled의 속성이 동일하게 변경되지만
ngmf.enable 경우 부모 컴포넌트 disalbed 속성에 영향없이 하위 컴포넌트는 
각각의 컴포넌트의 disabled 속성이 변경되지 않습니다. 

-즉, 내부컴포넌트가 비활성화된 상태에서 부모컴포넌트의 group, wframe이 
enable(false)로/enable(true)를 순차적으로 호출하여 비활성화되었다가 활성화 되어도 
내부 하위 컴포넌트는 각각의 disabled 속성은 유지하여 비활성화가 유지됩니다. 

-ngmf.enable()이 setDiabled와 동일한 동작을 수행하기를 원한다면 파라메터 pAllAdative를 true로 전달합니다.
pAllAdative를 전달하지 않을 경울 기본값은 false입니다 . 이러한 경우 ngmf.enable()의 
하위 컴포넌트는 각각의 컴포넌트의 disabled 속성은 유지하는 기본동작을 합니다.


setDiabled 경우 하위의 컴포넌트의 disabled의 속성이 부모 컴포넌트 disalbed 속성과 동일하게 변경되지만
ngmf.enable 경우 하위 컴포넌트는 각각의 컴포넌트의 disabled 속성은 유지하고 있습니다.
즉, 부모컴포넌트의 group, wframe 이 enable(false) / enable(true) 을 순차적으로 호출할경우, 내부 하위 컴포넌트는 
각각의 disabled 속성은 유지하고 있습니다. 
 */
ngmf.enable = function (compId, pFlag, pAllAdative) {
 	var resultVal = "";
 	try {
		var comp = ngmf.object(compId);
 		var flag = typeof pFlag != "undefined" ? WebSquare.util.getBoolean(pFlag) : undefined;
 		if (comp && typeof flag == "undefined") {
 			resultVal = !comp.getDisabled();
 		} else if (comp){
 			var isGroup = (typeof comp.getPluginName == "function" && (comp.getPluginName() == "group" || comp.getPluginName() == "wframe")) ? true : false;
 			if (isGroup) {
 				var allAdative = typeof pAllAdative != "undefined" ? WebSquare.util.getBoolean(pAllAdative) : false;
 				var childComp = WebSquare.util.getChildren(comp, {recursive:true, excludePlugin:"group wframe body"});

 				if (allAdative) {
 					comp.setDisabled(!flag);
 					for (var i = 0; i < childComp.length; i++) {
 						var targetComp = childComp[i];
 						if (targetComp._wTagName == "textbox" && $("#"+targetComp.getID()).prop("tagName") == "A") {
 							_NonDisabledComponent(targetComp, flag);
 						}
 					}
 					if (comp["_orgDisabledJson"]) {
 						delete comp["_orgDisabledJson"];
 					}
 				} else {
 					var nonDisabledCompArr = [];

 					if(!comp["_orgDisabledJson"]) {
 						comp["_orgDisabledJson"] = {};	
	 					for (var i = 0; i < childComp.length; i++) {
	 						var targetComp = childComp[i];
	 						if(targetComp.setDisabled && 
	 							targetComp.activeStatus != "stop" && 
	 							typeof targetComp.element != "undefined") {
					    		comp["_orgDisabledJson"][targetComp.getID()] = targetComp.getDisabled();
					    		if (targetComp._wTagName == "textbox" && $("#"+targetComp.getID()).prop("tagName") == "A") {
		 							nonDisabledCompArr.push(targetComp);
		 						}
					    	}
	 					}
 					} else {
 						for(var i = 0; i < childComp.length; i++) {
 							var targetComp = childComp[i];
 							if (targetComp._wTagName == "textbox" && $("#"+targetComp.getID()).prop("tagName") == "A") {
	 							nonDisabledCompArr.push(targetComp);
	 						}
 						}
 					} 

 					comp.setDisabled(!flag);

 					if (!flag) {
 						for (var i = 0 ; i < nonDisabledCompArr.length; i++) {
 							if (!$("#"+nonDisabledCompArr[i].getID()).hasClass("disabled")) $("#"+nonDisabledCompArr[i].getID()).addClass("disabled");
 						}
 					} else {
 						for (var i = 0; i < childComp.length; i++) {
	 						var originalFlag = typeof comp["_orgDisabledJson"][childComp[i].getID()] != "undefined" ? !comp["_orgDisabledJson"][childComp[i].getID()] : flag;
	 						_NonDisabledComponent(childComp[i], originalFlag);
	 					}
	 					delete comp["_orgDisabledJson"];
 					}
 				}
 				resultVal = !comp.getDisabled();
 			} else {
 				resultVal = _NonDisabledComponent(comp, flag);
 			}
 		}

 		function _NonDisabledComponent(comp, flag) {
 			var disabledFlag = !flag;
 			if (comp._wTagName == "textbox" && $("#"+comp.getID()).prop("tagName") == "A") {
	 			if(disabledFlag){
					if (!$("#"+comp.getID()).hasClass("disabled")) $("#"+comp.getID()).addClass("disabled");
				} else {
					if ($("#"+comp.getID()).hasClass("disabled")) $("#"+comp.getID()).removeClass("disabled");
				}
 			}
 			comp.setDisabled(disabledFlag);
 			return !comp.getDisabled();
 		};
 	} catch(e) {
 		ngmf._error("[ngmf.enable] Exception :: ", e);
 	}
 	return resultVal;
 };

 /**
 * div (그룹) 화면을 보여줄지 숨길지 설정하는 함수.
 * @date 2016-01-19
 * @memberOf ngmf
 * @param {String} compId :: I :: N ::  :: grop영역 컴포넌트 ID
 * @param {String} flag   :: I :: Y ::  :: [true/fals] flag.
 * @author 이동규
 * @useMobile use
 * @update 2016.05.11 이동규 visible true 정의시 class hide를 지우는 부분오동작 수정.
 * @example ngmf.visible("comp1", true); //return true;
 * @exampleAsIs Combo.Visible =true
 */
 ngmf.visible = function (compId, flag) {
 	try {
 		if (typeof compId != "undefined" && typeof ngmf.object(compId) != "undefined") {
			var comp = ngmf.object(compId);
			if ((typeof comp.show == "function" && typeof comp.hide == "function")  && typeof flag !== "undefined") {
				var flag = WebSquare.util.getBoolean(flag);
				if (flag) {
					comp.show("");
					if (comp.hasClass("hide")) {
						$("#"+comp.getID()).removeClass("hide");
					}
				} else {
					comp.hide();
				}
				return flag;
			} else {
				var visibility = $("#" + comp.id).css("visibility");
				if(visibility == "visible"){
					if (comp.hasClass("hide")) {
						$("#"+comp.getID()).removeClass("hide");
					}
					return true;
				}else{
					return false;
				}
			}
		}
 	} catch(e) {
 		ngmf._error("[ngmf.visible] Exception :: ", e);
 	}
 };

 /** 처리 일자간 일수 반환
 * @date 2015-10-01
 * @memberOf ngmf
 * @param  {String} fdate :: I :: N ::  :: 시작일자(YYYYMMDD)
 * @param  {String} tdate :: I :: N ::  :: 종료일자(YYYYMMDD)
 * @returns {Number} 계산일수
 * @author 이진수
 * @useMobile use
 * @example ngmf.getCalcDay('20151010', '20151001');
 * @exampleAsIs
 */
ngmf.getCalcDay = function(fdate, tdate) {
	try {
		var rtn_val;
		var iYear = 0;
		var iYear_add = 0;
		var pre_date = 0;
		var nxt_date = 0;
		var pre_y = ngmf.parseInt(fdate.substr(0,4));
		var pre_m = ngmf.parseInt(fdate.substr(4,2));
		var nxt_y = ngmf.parseInt(tdate.substr(0,4));
		var nxt_m = ngmf.parseInt(tdate.substr(4,2));
		var i;

		iYear  = ngmf.parseInt(tdate.substr(0,4)) - ngmf.parseInt(fdate.substr(0,4));

		//  2월이 29인날 1씩 더하기
		var sv_date;
		for(i=ngmf.parseInt(fdate.substr(0,4));i<ngmf.parseInt(tdate.substr(0,4));i++) {
			sv_date = ngmf.getLastDateOfMonth( String(i) + "02" );
			if(sv_date == 29) iYear_add += 1;
		}

		if (pre_m == 1) {
			pre_date = ngmf.parseInt(fdate.substr(6,2));
		} else {
			for (i=1; i<pre_m; i++){
				pre_date += ngmf.getLastDateOfMonth(String(pre_y) + ngmf.lpad(i,"0",2));
			}
			pre_date += ngmf.parseInt(fdate.substr(6,2));
		}

		if (nxt_m == 1) {
			nxt_date = ngmf.parseInt(tdate.substr(6,2));
		} else {
			for (i=1; i<nxt_m; i++){
				nxt_date += ngmf.getLastDateOfMonth(String(nxt_y) + ngmf.lpad(i,"0",2));
			}
			nxt_date += ngmf.parseInt(tdate.substr(6,2));
		}

		rtn_val = ngmf.parseInt(nxt_date) - ngmf.parseInt(pre_date);
		rtn_val += (ngmf.parseInt(iYear) * 365) + iYear_add;

		return rtn_val;
	} catch(e) {
		ngmf._error("[ngmf.getCalcDay] Exception :: ", e);
	}
};

/** YYYYMM의 마지막 일자 계산
 * @date 2015-10-01
 * @memberOf ngmf
 * @param  {String} strYM :: I :: N ::  :: 년월(YYYYMM)
 * @returns {Number} 계산일수
 * @author 이진수
 * @useMobile use
 * @example ngmf.getLastDateOfMonth('201510');
 * @exampleAsIs
 */
ngmf.getLastDateOfMonth = function(strYM){
	try {
		strYM = String(strYM);
		var daysArray = new Array();
	 	var i;   // 배열을 생성한다.

		for (i=1; i <8; i++) {    //1월부터 7월
	   		daysArray[i] = 30 + (i%2);
	 	}

		for (i=8; i<13; i++) {    //8월 부터 12월
	   		daysArray[i] = 31 - (i%2);
	 	}

	 	var sYear = ngmf.parseInt(ngmf.mid(strYM,0, 4)) * 1;
	 	var sMonth = ngmf.parseInt(ngmf.mid(strYM,4, 2)) * 1;

	 	if (((sYear % 4 == 0) && (sYear % 100 != 0)) || (sYear % 400 == 0)) {
	  		daysArray[2] = 29;
		} else {
	  		daysArray[2] = 28;
	 	}

	 	if(sMonth > 13) sMonth = 1;

	 	last_day = daysArray[sMonth];
	 	return last_day;
	} catch(e) {
		ngmf._error("[ngmf.getLastDateOfMonth] Exception :: ", e);
	}
};

/** 해당 컴포넌트에서 해당 데이터가 maxlength로 일경우 포커스를 이동합니다.
 * @date 2016-01-26
 * @memberOf ngmf
 * @param  {Object} e      :: I :: N ::  :: 이벤트 객체.
 * @param  {Object} strObj :: I :: Y ::  :: 지정 컴포넌트로 포커스 이동. (필수 아님)
 * @returns {Number} 이벤트객체.
 * @author 이동규
 * @useMobile use
 * @example ngmf.elementAutoFocus('201510');
 * @exampleAsIs
 */
ngmf.elementAutoFocus = function(e, strObj) {
	try {
		var code = ngmf.keyCode(e);
		if(code!=9){//tab
   			var obj = ngmf.object(e.target.id);
			if(obj.getValue().length == obj.getMaxLength()){
				if(typeof strObj=="undefined"){
    				ngmf.object($(":input[id='"+obj.getID()+"']").nextAll(":enabled").attr("id")).focus();
				}else{
     				ngmf.object(strObj).focus();
				}
			}
		}
	} catch(ex) {
		ngmf._error("[ngmf.elementAutoFocus] Exception :: ", ex);
	} finally {
		return e;
	}
};

/** 해당 컴포넌트에서 이벤트를 동적을 정의합니다.
 * @date 2016-01-26
 * @memberOf ngmf
 * @param  {String} strObj :: I :: N ::  :: 이벤트 대상 컴포넌트 ID
 * @param  {Object} json   :: I :: N ::  :: 이벤트 설정 객체.
 * @sampleLink scm_dynamicEventBinding
 * @author 이동규
 * @useMobile use
 * @example ngmf.elementDynamicEvent(strObj, json);
 * @exampleAsIs
 */
ngmf.elementDynamicEvent = function(strObj, json){
	try {
		var obj = ngmf.object(strObj);
		for(var e in json) {
			obj.bind(e , json[e]);
		}
	} catch(ex) {
		ngmf._error("[ngmf.elementDynamicEvent] Exception :: ", ex);
	}
};

/** 데이터리스트의 현재 rowPosition을 반환합니다.
 * @date 2016-01-27
 * @memberOf ngmf
 * @param  {Object} strObj :: I :: N ::  :: dataList ID
 * @returns {Number} 이벤트객체.
 * @author 이동규
 * @useMobile use
 * @example ngmf.getRowPosition(strObj);
 * @exampleAsIs
 */
 ngmf.getRowPosition = function (strObj) {
 	try {
 		if (typeof ngmf.object(strObj).getRowPosition == "function")
 			return ngmf.object(strObj).getRowPosition();
 		else if (typeof ngmf.object(strObj).getSelectedIndex == "function")
 			return ngmf.object(strObj).getSelectedIndex();
 		else return -1;
 	} catch(e) {
 		ngmf._error("[ngmf.getRowPosition] Exception :: ", e);
 	}
 };

/** 그리드의 데이터를 insertRow 합니다.
 * @date 2016-01-27
 * @memberOf ngmf
 * @param  {String} strObj :: I :: N ::  :: grid Component ID
 * @param  {String} col    :: I :: Y ::  :: grid 체크컬럼의 ID (insert시 자동 체크박스 체크 설정.)
 * @returns {Number} 추가된 row 의 Idx.
 * @sampleLink grd_updatedData
 * @author 이동규
 * @useMobile use
 * @example ngmf.getInsert(strObj);
 * @exampleAsIs DsSample.InsertRow(6);
 */
 ngmf.gridInsertRow = function(strObj, col){
	var row = -1;
	try{
		var obj = ngmf.object(strObj);
		var dataObj = ngmf.object(obj.getDataList());
		var irow = dataObj.insertRow();
		obj.setFocusedCell( irow , 0 , false );
    	if(typeof obj.getColumnIndex( col ) != "undefined"){
     		obj.setCellChecked( irow , col, true );
    	}
    	row = irow;
   	}catch(e){
    	row = -1;
    	ngmf._error("[ngmf.gridInsertRow] Exception :: ", e);
   	}finally{
	    return row;
   	}
 };

 /** 그리드 변경 설정값을 로컬 스코리지에 저장
  * @date 2016-01-25
  * @memberOf ngmf
  * @param  {String} serviceID   :: I :: N ::  :: 서비스구분(T:텔레콤, B:브로드밴드).
  * @param  {String} componentID :: I :: N ::  :: 그리드ID.
  * @param  {String} prop        :: I :: N ::  :: 설정 구분값(columnOrder : 컬럼정렬 , columnWidth : 컬럼 사이즈, tabOrder : 탭 정렬).
  * @param  {String} info        :: I :: N ::  :: info
  * @param  {String} options     :: I :: N ::  :: options
  * @author  김팔수
  * @useMobile use
  * @example ngmf.setLocal('T or B', 'grid', 'columnOrder', grid.getColumnOrder(true));
  * @exampleAsIs 신규
  */
 ngmf.setLocal = function ( serviceID, componentID, prop, info, options  ) {
 	var propObj,
 		pageInfo = ngmf._getPageLocalInfo(serviceID); 

 	options = options || {};

 	if ( !pageInfo.pageObj[componentID] ) {
 		pageInfo.pageObj[componentID] = {};
 	}

 	propObj = pageInfo.pageObj[componentID][prop];

 	if ( propObj && ngmf._isObject(propObj) ) {
 		if ( options.replace ) {
 			pageInfo.pageObj[componentID][prop] = info;
 		} else {
 			ngmf._extendObj( propObj, info );
 		}
 	} else {
 		pageInfo.pageObj[componentID][prop] = info;
 	}

 	WebSquare.localStorage.setItem( pageInfo.pageID, JSON.stringify(pageInfo.pageObj) );
 };

 /** 로컬 스코리지에 변경된 그리드 정보가 있으면 불러온다
  * @date 2016-01-25
  * @memberOf ngmf
  * @param  {String} serviceID   :: I :: N ::  :: 서비스구분(T:텔레콤, B:브로드밴드).
  * @param  {String} componentID :: I :: N ::  :: 그리드ID.
  * @author  김팔수
  * @useMobile use
  * @example ngmf.getLocal('T or B', 'grid');
  * @exampleAsIs
  */
 ngmf.getLocal = function ( serviceID, componentID ) {
 	var pageInfo = ngmf._getPageLocalInfo(serviceID),
 	prop1 = 'columnOrder',
 	prop2 = 'columnWidth',
 	prop3 = 'tabOrder',
 	storedColOrder , storedColWidth, storedTabOrder, comObj, arrComp;

 	arrComp = ngmf.split(componentID, ",");
 	for (var i=0; i < arrComp.length; i++) {

 		comId = ngmf.trim(arrComp[i]);
 		comObj = ngmf.object(comId) ;

 		storedColOrder = pageInfo.pageObj[comId] ? pageInfo.pageObj[comId][prop1] : null;
 		if ( storedColOrder ) {
 			if ( !ngmf.compareArray( comObj.getColumnOrder(true), storedColOrder ) ) {
 				comObj.setColumnOrder(storedColOrder);
 			}
 		}

 		storedColWidth = pageInfo.pageObj[comId] ? pageInfo.pageObj[comId][prop2] : null;
 		if ( storedColWidth ) {
 			Object.keys(storedColWidth).forEach( function(columnID) {
 				comObj.setColumnWidth( columnID, storedColWidth[columnID] );
 	        } );
 		}

 		storedTabOrder = pageInfo.pageObj[comId] ? pageInfo.pageObj[comId][prop3] : null;
 		if ( storedTabOrder ) {
 			if ( !ngmf.compareArray( ngmf.getTabIDList(comObj), storedTabOrder ) ) {
 				comObj.setTabOrder(storedTabOrder);
 			}
 		}

 	}

 };

 /** 탬ID list를 구하는 API
  * @date 2016-01-25
  * @memberOf ngmf
  * @param  {String} comp :: I :: N ::  :: 탭컴포넌트ID
  * @author  김팔수
  * @useMobile use
  * @returns {Object}
  * @example ngmf.getTabIDList( comp );
  * @exampleAsIs
  */
 ngmf.getTabIDList = function( comp ) {
 	var list = comp.getTabInfo();
 	list = list.map( function( tabObj ) {
 		return tabObj.id;
 	} );

 	return list;
 };

 /** 페이지 정보값 셋팅
  * @date 2016-01-25
  * @memberOf ngmf
  * @param  {String} sId :: I :: N ::  :: 서비스구분(T:텔레콤, B:브로드밴드).
  * @author  김팔수
  * @useMobile use
  * @returns {Object}
  * @exampleAsIs
  */
 ngmf._getPageLocalInfo = function (sId) {
 	var w2xPath = WebSquare.w2xPath,
 	idx1 = w2xPath.lastIndexOf('/') + 1,
 	idx2 = w2xPath.lastIndexOf('.xml'),
 	pageID = w2xPath.substring( idx1, idx2 ),
 	pageObj ,
 	sId = (sId) ? sId : "T",
 	pId;

 	pId 	= ngmf.trim(sId+pageID);
 	pageObj = WebSquare.localStorage.getItem(pId);

 	if ( pageObj ) {
 		pageObj = JSON.parse(pageObj);
 	} else {
 		pageObj = {};
 	}

 	return { 'pageID' : pId, 'pageObj' : pageObj };
 };

 ngmf._isObject = function (obj) {
 	var toStringProto = Object.prototype.toString;
 	return toStringProto.call(obj) === '[object Object]';
 };

 ngmf._extendObj = function (obj) {
     var length = arguments.length;
     if ( length < 2 ) {
         return obj;
     }
     for ( var index = 1; index < length; index++ ) {
         var source = arguments[index];
         Object.keys(source).forEach( function(key) {
             obj[key] = source[key];
         } );
     }
 };

 /** Array객체 비교
  * @date 2016-01-25
  * @memberOf ngmf
  * @param  {Object} a1 :: I :: N ::  :: 비교할 array1 id
  * @param  {Object} a1 :: I :: N ::  :: 비교할 array2 id
  * @author  이동규
  * @useMobile use
  * @returns {boolean}
  * @exampleAsIs
  */
 ngmf.compareArray = function ( a1, a2 ) {
 	return ( a1.length === a2.length ) && a1.every( function( d, i ) {
 	    return d === a2[i];
 	} );
 };

 /** 컬럼을 숨기는 기능.
  * @date 2016-01-25
  * @memberOf ngmf
  * @param  {String/Object} componentID :: I :: N ::  :: 그리드id 혹은 그리드 배열 객체
  * @param  {String/Object} colIdx      :: I :: N ::  :: 숨기고자 하는 컬럼id 혹은 컬럼 ID 객체
  * @param  {Object} nFlag       :: I :: Y :: false :: 숨김처리 여부id (true : 숨김 , false : 보임)
  * @author  이동규
  * @update 이동규 2016-09-30 API flag 오동작 수정.
  * @useMobile use
  * @returns {boolean}
  * @exampleAsIs
  */
 ngmf.setColumnHidden = function ( componentID , colIdx, nFlag) {
 	ngmf.setColumHidden.apply(this, arguments);
 }; 
 ngmf.setColumHidden = function ( componentID , colIdx, nFlag) {
 	var arrComp, arrColIdx, colIdx, colIdxObj;
 	var _flag = WebSquare.util.getBoolean(nFlag) ? nFlag : false;
 	arrComp = ngmf.split(componentID, ",");
 	arrColIdx = ngmf.split(colIdx, ",");

 	for (var i=0; i < arrComp.length; i++) {
 		comId = ngmf.trim(arrComp[i]);
 		comObj = ngmf.object(comId) ;
 		if(typeof comObj !== "undefined") {
 		//	hidden 컬럼 수만큼
 			for (var j=0; j < arrColIdx.length; j++) {
 				colIdx = ngmf.trim(arrColIdx[j]);
 				comObj.setColumnVisible( colIdx , !_flag );
 			}
 		}
 	}
 };

  /**
  * 내부함수: 프로그램 ID로 서비스 ID 찾기
  * 연관메뉴 및 링크메뉴 처리
  * @date 2016.01.06.
  * @memberOf
  * @author 성일호
  * @useMobile use
  * @param  {String} menuId :: I :: N ::  :: 메뉴ID
  * @example ngmf.getSvcId(menuId)
  * @exampleAsIs
  */
 ngmf.getSvcId = function (menuId) {
	 try{
		 if (typeof menuId == "undefined" || menuId.length < 8 ) return "";
		 else {
			 if (menuId.startsWith("ZNGM")) {
				 if (menuId.startsWith("ZNGMSMAN")) return "AAT";
				 else return "CCA";
			 } else return ngmf.mid(menuId, 1,3).toUpperCase();
		 }
	 } catch (e) {
		 ngmf._error("[ngmf.getSvcId] Exception :: ", e);
	 }
 };

 /**
  * 내부함수 :  연관메뉴 및 링크메뉴 처리 함수 ngmf.relNlinkMenu 콜백 처리 함수
  * 연관메뉴 및 링크메뉴 처리
  * @date 2016.01.06.
  * @memberOf
  * @author 성일호
  * @useMobile use
  * @param  {String} trxCode   :: I :: N ::  :: 메뉴ID
  * @param  {String} errorCode :: I :: N ::  :: 에러코드
  * @param  {String} errorMsg  :: I :: N ::  :: 에러메세지
  * @example
  * @update 2016.02.11 팝업 옵션변경에 따른 호출 파라메타 수정
  * @update 2016.02.11 MDI 에서도 연관메뉴 설정 가능하도록 변경
  * @update 2016.02.12 멀티링크 호출 방법 변경
  * @update 2016.02.16 링크메뉴명 변경
  * @update 2016.03.25 연관메뉴 조회 조건변경 및 기능 추가 
  */
ngmf.relNlinkMenuCallBack = function(trxCode, errorCode, errorMsg) {
 	 if (typeof ds_pgmRelNlink != "undefined") {
 		 try{
 			 var refType = "LK";

 			 if (ngmv.fparam.startsWith("ZNGMSMAN00010") ) {
 				 refType = "RL";
 				 ngmv.fparam = "";
 			 }
 			 //결과값 확인
 			 if (typeof ds_pgmRelNlink != "undefined" && ds_pgmRelNlink.getRowCount() > 0) {
 				 var typeMap = {
 						"001":"W", //화면
 						"002":"P", //팝업
 						"003":"B", //배치
 						"004":"U",  //URL
 						"005":"F", //Script
 						"006":"S"  //서브화면 (Wframe)
 				 };


 				if ("RL" == refType && GLD.dsl_relativeBtn ) {
 					var dataArr = [];

 	 				for (var i = 0; i < ds_pgmRelNlink.getRowCount() ; i++) { 
 	 					if (typeMap[ds_pgmRelNlink.getCellData(i,"cnnt_pgm_typ_cd")]) {
 	 	 					dataArr.push(ds_pgmRelNlink.getCellData(i,"pgm_id")); //screenNm ,btnId, btnNm, authrity, btnType, btnAction, popupOptions, hide
 	 	 					dataArr.push("rel_" + ds_pgmRelNlink.getCellData(i,"cnnt_pgm_id")); //btnId
 	 	 					dataArr.push(ds_pgmRelNlink.getCellData(i,"pgm_cnnt_menu_nm")); //btnNm
 	 	 					dataArr.push(""); //authrity
 	 	 					dataArr.push(typeMap[ds_pgmRelNlink.getCellData(i,"cnnt_pgm_typ_cd")] || "P"); //btnType P:팝업  W:윈도우   F:링크
 	 	 					dataArr.push(ds_pgmRelNlink.getCellData(i,"cnnt_pgm_id")); //btnAction
 	 	 					dataArr.push(""); //popupOptions
 	 	 					dataArr.push(""); //hide
 	 	 					dataArr.push(ds_pgmRelNlink.getCellData(i,"cnnt_pgm_grp_id")); //hide
 	 					}
 	 				}
 	 				if (dataArr.length > 0) {
 	 					GLD.dsl_relativeBtn.removeAll();
 	 					if (typeof dsl_relativeBtn == "undefined") {
 	 	 					ngmf.createDataList("dumy");
 	 	 					ngmf.copy("dumy", GLD.dsl_relativeBtn);
 	 	 					dumy.setData(dataArr);
 	 	 					ngmf.copy(GLD.dsl_relativeBtn, "dumy");
 	 	 					ngmf.destroyDataList("dumy");
 	 					} else dsl_relativeBtn.setData(dataArr);
 	 				}
 	 			} else {
 	 				var frmId = scvar.__screenName || ngmf.getFormID();
 	 				var itemMap = {};
 	 				var currItem = "";
 	 				for (var i = 0; i < ds_pgmRelNlink.getRowCount() ; i++) {
 	 					currItem = ds_pgmRelNlink.getCellData(i,"scrn_itm_eng_nm");
 	 					if (typeMap[ds_pgmRelNlink.getCellData(i,"cnnt_pgm_typ_cd")]) {
 	 	 					if (!itemMap[currItem]) itemMap[currItem] = [];
 	 	 					itemMap[currItem].push({
 	 	 						linkType: typeMap[ds_pgmRelNlink.getCellData(i,"cnnt_pgm_typ_cd")] || "P",
 	 	 						screenName: ds_pgmRelNlink.getCellData(i,"cnnt_pgm_id"),
 	 	 						btnId: "lkdbtn_" + ds_pgmRelNlink.getCellData(i,"pgm_id") + "_" +ds_pgmRelNlink.getCellData(i,"prt_seq"),
 	 	 						btnName: ds_pgmRelNlink.getCellData(i,"pgm_cnnt_menu_nm"),
 	 	 						strFormID:  ds_pgmRelNlink.getCellData(i,"cnnt_pgm_id") + "_linkedPopup",
 	 	 						url : ds_pgmRelNlink.getCellData(i,"cnnt_pgm_id"),
 	 	 						strPrefix :  ngmf.getSvcId(ds_pgmRelNlink.getCellData(i,"cnnt_pgm_id")),
 	 	 						nWidth : "600",
 	 	 						nHeight : "400",
 	 	 						menuCd : ds_pgmRelNlink.getCellData(i,"cnnt_pgm_id") ,
 	 	 						linkUrl : ngmf.createUrl(ds_pgmRelNlink.getCellData(i,"cnnt_pgm_id")),
 	 	 						strInArgument : ""
 	 	 					});
 	 					}
 	 				} // END for
 	 				var target = null;
 	 				for ( key in itemMap) {
 	 					target = ngmf.object(key);
 	 					//target.render.style.visibility == "hidden" ||
 	 					if (!target || target.render.disabled || target.render.style.visibility == "hidden")  continue;
 	 					else ngmf.setMultiLinkedBtn(key, itemMap[key]);
 	 				}

 	 			}
 				//DATA LIST 제거...
 				ngmf.destroyDataList("ds_pgmRelNlink");
 				if (typeof ds_request != 'undefined') ngmf.destroyDataList("ds_request");
 			 }
 		 } catch (e) {
 			 ngmf._error("[ngmf.relNlinkMenuCallBack] Exception :: ", e);
 		 }
 	 }
 };

 /**
  * ngmf.relNlinkMenu
  * 연관메뉴 및 링크메뉴 처리
  * @date 2016.01.06.
  * @memberOf ngmf
  * @param {String} refType :: I :: N ::  ::   연관 : RL  링크 LK
  * @param {String} ScreenName :: I :: N ::  ::   메뉴 ID
  * @author 성일호
  * @useMobile useless
  * @example ngmf.relNlinkMenu(); //return null
  * @update 2016.02.11 MDI 에서도 연관메뉴 설정 가능하도록 변경
  * @update 2016.03.25 연관메뉴 조회 조건변경 및 기능 추가
  */
 ngmf.relNlinkMenu = function(refType, ScreenName) {
	// 개발인 경우 제외
	if (GLV && GLV.G_DEVFG == "Y")
		return;
	try {
		if(ngmf.isMobile()) {
			//ngmf.alert("ngmf.relNlinkMenu : 모바일환경에서 지원불가 API 입니다.");
			return;
		}
		if (typeof refType == "undefined" || !refType)
			refType = "LK";
		
		if ("LK" == refType && (typeof ScreenName == "undefined" || !ScreenName))
			ScreenName = scvar.__screenName || ngmf.getFormID(); 
		else if ("RL" == refType) ScreenName = "ZNGMSMAN00010";
		
		
		var TrxCode = "ZNGMSCNT10010_TR06"; // Transaction Code 

		var ds_request = ngmf.createDataList("ds_request", [ "pgm_cnnt_typ_cd", "pgm_id" ]);
		ds_request.insertRow();

		ds_request.setCellData(0, "pgm_cnnt_typ_cd", refType);
		if ("LK" === refType) {
			ds_request.setCellData(0, "pgm_id", ScreenName);
		}
		ngmv.fparam = ScreenName;
		ngmf.createDataList("ds_pgmRelNlink", [ "pgm_id", "prt_seq", "cnnt_pgm_id", "pgm_cnnt_menu_nm", "cnnt_pgm_typ_cd", "scrn_itm_eng_nm", "cnnt_pgm_grp_id"]);
		ngmf.commonMainTransaction("asynchronous", TrxCode, ScreenName, "", [ ds_request ], "ds_pgmRelNlink", "ngmf.relNlinkMenuCallBack", "SELF", false);
	} catch (e) {
		ngmf._error("[ngmf.relNlinkMenu] Exception :: ", e);
	}
};


 /**
  * 자신의 현재 부여된 id를 얻는다.
  *
  * @date 2015.10.05
  * @memberOf ngmf
  * @param {Object} pScwin    :: I :: N ::  :: scwin객체
  * @param {String} pID       :: I :: N ::  :: component ID
  * @param {String} parentObj :: I :: Y ::  :: 부모객체
  * @return wframe id
  * @useMobile use
  * @example ngmf.getID(scwin, "inputbox1", "parent");
  * @exampleAsIs Dataset.GetID();
  */
 ngmf.getID = function(pScwin, pID, parentObj){
 	try {
 		if (typeof pID == "object") {
 			if (pID.getID && typeof pID.getID() !== "undefined") {
 				pID = pID.getID();
 			}
 		}

		 if (typeof pScwin.$w === "undefined") {
			 return "";
		 }else{
			 if(typeof parentObj === "undefined"){
				 return pScwin.$w.getRuntimeId(pID);
			 }else{
				 return pScwin.$w.getRuntimeId(pID, parentObj);
			 }
		 }
 	} catch(e) {
		ngmf._error("[ngmf.getID] Exception :: ", e);
 	}
 };

 /**
  * 검색 패턴과 옵션을 지정하여 RegExp 객체를 얻어냅니다.
  *
  * @date 2015.10.05
  * @memberOf ngmf
  * @param {Object} strPattern :: I :: N ::  :: 검색패턴
  * @param {String} strOption  :: I :: Y ::  :: 검색에 적용할 옵션. <BR/>옵션에는 g(Global), i(Ignore Case), m이 있으며 중복사용이 가능합니다.
  * @return {Object} RegExp객체
  * @author 이진수
  * @useMobile use
  * @example ngmf.createRegExp("[\\\\\"/<>\*\?:\|]","g");
  * @exampleAsIs CreateRegExp("[\\\\\"/<>\*\?:\|]","g");

  */
 ngmf.createRegExp = function(strPattern, strOption){
	var option = "";

	if(typeof strOption !== "undefined" && strOption != null){
		option = ngmf.trim(strOption.toLowerCase());
	}

	if(option.length == 0){
		return new RegExp(strPattern);
	}else{
		return new RegExp(strPattern, option);
	}
};

/**
 * 입력된 문자열을 strDelimiter1과 strDelimiter2로 2 번 Parsing 한 2차원 배열을 Return 하는 Basic API 입니다.
 * 첫번째 Delimiter로 파싱할 때에는 예외문자처리, 따옴표처리를 안하고, Delimiter 문자는 제거됩니다.
 * 두번째 Delimiter로 파싱할 때에는 예외문자처리는 안하지만, 따옴표 처리는 하고, Delimiter 문자와, 따옴표는 제거됩니다.
 * @date 2016-02-10
 * @memberOf ngmf
 * @param {String} str           :: I :: N ::  :: Parsing 할 원본 문자열.
 * @param {String} strDelimiter1 :: I :: Y ::  :: 첫번째로 잘라낼 구분 문자열.첫 1글자만 Delimiter로 사용됩니다.
 * @param {String} strDelimiter2 :: I :: Y ::  :: 두번째로 잘라낼 구분 문자열.첫 1글자만 Delimiter로 사용됩니다.
 * @author 조지용
 * @useMobile use
 * @example ngmf.split2("age:30,name:홍길동", ",", ":");
 * @exampleAsIs Split2("age:30,name:홍길동", ",", ":");
 */
ngmf.split2 = function (str, strDelimiter1, strDelimiter2) {
	try{
		var result = str;

		//첫번째 구분자가 있는 경우만 실행
		if(typeof strDelimiter1 != "undefined" && strDelimiter1 != null){
			result = str.split(strDelimiter1);

			if(typeof strDelimiter2 != "undefined" && strDelimiter2 != null){
				for (var i = 0; i < result.length ; i++){
					result[i] = result[i].replaceAll('"', ''); //쌍따옴표 처리
					result[i] = result[i].split(strDelimiter2);
				}
			}
		}
		return result;
	} catch (e) {
		ngmf._error("[ngmf.split2] Exception :: ", e);
	}
};

/**
 * 해당 범위안에서 조건식에 맞는 Record의 갯수를 구하는 Method 입니다.
 * @date 2016-02-10
 * @memberOf ngmf
 * @param {String} arguments[0] :: I :: N ::  :: 검색대상 dataList
 * @param {String} arguments[1] :: I :: N ::  :: 갯수를 구할 Record를 추출하기 위한 조건문.
 * @return 조건에 맞는 레코드 갯수.
 * @author 이동규
 * @useMobile use
 * @update 2016.07.18 성일호 copy => copyF 로 변경
 * @example ngmf.caseCount(dsObj, strCmpExpr);
 * @exampleAsIs Edit0.Text = DsSample.CaseCount("DS_NUM%2==0");
Edit0.Text = DsSample.CaseCount("DS_NUM%2==0",0,5);
 */
ngmf.caseCount = function() {
	var rtn = 0;
	try{
		if(typeof arguments[1] !="string" || arguments[1]==null) {
			throw "2번째 인자는 String입니다.";
		}

		var ds = ngmf.object(arguments[0]);
		var opts = arguments[1];
/*
		var charCheck = /[~!\#$^&*\=+|:;?"<,.>()]/g;
		var checkDataArr = opts.replace(charCheck, " ").split(" ");
		var col_dataArr = [];
		for (var i = 0 ; i < checkDataArr.length ; i++) {
			if (checkDataArr[i].length > 0 && checkDataArr[i] != "") {
				col_dataArr.push(checkDataArr[i]);
			}
		}

		if (col_dataArr.length%2 == 0) {
			for (var i = 0; i < col_dataArr.length/2 ; i++) {
				if (typeof ds.getColumnIndex(col_dataArr[i*2]) == "undefined") {
					console.log("필터조건에 해당 컬럼이 존재 하지 않습니다.");
					return -1;
				}
			}
		}
*/
		ngmf.createDataList("dataDummy0001");
		//20160718
		ngmf.copyF("dataDummy0001", ds);
		ngmf.filter("dataDummy0001", opts, true);
		rtn = dataDummy0001.getRowCount();
		$w.data.remove("dataDummy0001");
		return rtn;

	}catch(e){
		ngmf._error("[ngmf.caseCount] Exception :: ", e);
		return -1;
  	}
};

/**
 * 그리드 컬럼의 소수점 자리수를 초과한지 체크하여 초과하여 입력되지 않도록 한다.
 * @date 2016-02-10
 * @memberOf ngmf
 * @param {String} gridObj     :: I :: N ::  :: gridView id
 * @param {String} colId       :: I :: N ::  :: column id
 * @param {String} decimalSize :: I :: N ::  :: 소수점 자리수
 * @author 조지용
 * @useMobile use
 * @example ngmf.isNumDecimalChk("grd_msg", "msg_eng_ctt", 2);
 * @exampleAsIs 신규
 */
ngmf.isNumDecimalChk = function(gridObj, colId, decimalSize) {
	try{
		var rtnValue = true;
		var gridViewObj = ngmf.object(gridObj);
		var dataType = gridViewObj.getColumnOption(colId, "dataType");

		var e = event || window.event;
		var keyId = (e.which) ? e.which : e.keyCode;

		//소수점 체크용 정규식
		var reg = new RegExp("^\\d*[.]\\d{"+decimalSize+"}$");

		//소수점 체크
		var reg1 = /^\d*[.]\d$/;

		var dom = e.target;
		var value = dom.value;
		var selectedValue = value.substring(dom.selectionStart, dom.selectionEnd);

		if(dataType == "number") {
			if((keyId >= 48 && keyId <= 57) || (keyId >= 96 && keyId <= 105) || (keyId == 190 || keyId == 110)){
				if(reg1.test(value)){
					if(keyId == 46 || keyId == 190 || keyId == 110){
						rtnValue = false;
					}
				}

				if(selectedValue != value && reg.test(value)){
					rtnValue = false;
				}
			}
		}

		e.returnValue = rtnValue;
		return rtnValue;
	} catch (ex) {
		ngmf._error("[ngmf.isNumDecimalChk] Exception :: ", ex);
	}
};

/**
 * 그리드를 갱신한다.
 * @date 2016-02-11
 * @memberOf ngmf
 * @param {String} gridObj      :: I :: N ::  :: gridView id
 * @param {Boolean} refreshAble :: I :: N ::  :: true/false
 * @author 조지용
 * @useMobile use
 * @example ngmf.gridRedraw("grd_msg", true);
 * @exampleAsIs 신규
 */
ngmf.gridRedraw = function(gridObj, refreshAble) {
	try{
		if(typeof gridObj === "undefined" || gridObj == null){
			return;
		}

		var gridViewObj = ngmf.object(gridObj);
		var dslId = gridViewObj.getDataList();

		if(typeof dslId === "undefined" || dslId == null || dslId == ""){
			return;
		}

		var dslObj = ngmf.object(dslId);
		dslObj.setBroadcast(refreshAble); //dsl 갱신여부
		
		if(refreshAble) {
			dslObj.broadcast({
				"linkedDataList" : ["notifyDataChanged"],
				"gridView" : ["notifyDataChanged"],
				"generalComp" : "both"
			});
		}
		
		if(refreshAble){
			gridViewObj.refresh(); //gridView 갱신
		}

	} catch (e) {
		ngmf._error("[ngmf.gridRedraw] Exception :: ", e);
	}
};

/**
 * 트리를 갱신한다.
 * @date 2016-02-11
 * @memberOf ngmf
 * @param {String} treeObj      :: I :: N ::  :: treeView id
 * @param {Boolean} refreshAble :: I :: N ::  :: true/false
 * @author 조지용
 * @useMobile use
 * @example ngmf.treeRedraw("tv_treeView1", true);
 * @exampleAsIs
 */
ngmf.treeRedraw = function(treeObj, refreshAble) {
	try{
		if(typeof treeObj === "undefined" || treeObj == null || treeObj == ""){
			return;
		}

		var treeViewObj = ngmf.object(treeObj);
		var treeDs = treeViewObj.getDataListInfo();

		if(typeof treeDs === "undefined" || treeDs == null || treeDs == ""){
			return;
		}

		var dsObj = ngmf.object(treeDs.id);

		dsObj.setBroadcast(refreshAble); //dsl 갱신여부

		if(refreshAble) {
			dsObj.broadcast({
				"linkedDataList" : ["notifyDataChanged"],
				"treeView" : ["notifyDataChanged"],
				"generalComp" : "both"
			});
		}		
		
		if(refreshAble){
			treeViewObj.refreshItemArr(); //treeView 갱신
		}

	} catch (e) {
		ngmf._error("[ngmf.treeRedraw] Exception :: ", e);
	}
};

/**
 * 트리 노드의 포커스를 변경하는 API입니다.
 * @date 2016-02-11
 * @memberOf ngmf
 * @param {String} treeObj :: I :: N ::  :: treeView id
 * @param {String} value   :: I :: Y ::   :: 노드의 값
 * @param {Number} idx     :: I :: Y :: 0 :: 노드의 인덱스
 * @author 조지용
 * @useMobile use
 * @example ngmf.setFocusedNodePosition("tv_treeView1", "1-1");
 * @example ngmf.setFocusedNodePosition("tv_treeView1", null, 2);
 * @exampleAsIs
 */
ngmf.setFocusedNodePosition = function(treeObj, value, idx) {
	try{
		if(typeof treeObj === "undefined" || treeObj == null || treeObj == ""){
			return;
		}
		
		if(typeof value === "undefined" || value == ""){
			value = null;
		}
		
		if(typeof idx === "undefined" || idx == null || idx == ""){
			idx = 0;
		}
		
		var treeViewObj = ngmf.object(treeObj);
		treeViewObj.selectNode(value, idx);

	} catch (e) {
		ngmf._error("[ngmf.setFocusedNodePosition] Exception :: ", e);
	}
};

/**
 * 데이터셋의 row위치를 설정한다.
 * @date 2016-02-11
 * @memberOf ngmf
 * @param {Object} dsObj :: I :: N ::  :: dataList
 * @param {Number} pos   :: I :: N ::  :: row index
 * @author 이진수
 * @useMobile use
 * @example ngmf.row(GDS_SEARCH, 3);
 * @exampleAsIs
 */
ngmf.row = function(dsObj, pos){
	try {

		if(typeof pos === "undefined"){
			return dsObj.getRowPosition();
		}else{
			dsObj.setRowPosition(pos);
		}

	}catch(e) {
		ngmf._error("[ngmf.row] Exception :: ", e);
	}
};

/**
 * 데이터셋의 해당조건에 맞는 값만 걸러내서 컬럼의 값을 더한다.
 * @date 2016-02-11
 * @memberOf ngmf
 * @param {Object} dsObj   :: I :: N ::  :: dataList
 * @param {String} condStr :: I :: N ::  :: 조건
 * @param {String} colStr  :: I :: N ::  :: dsObj의 Column
 * @author 이진수
 * @useMobile use
 * @example ngmf.caseSum(GDS_SEARCH, "chk_col == '1'", "chk_col");
 * @exampleAsIs Edit0.Text = DsSample.CaseSum("DS_NUM%2==0","DS_MONEY");
Edit0.Text = DsSample.CaseSum("DS_NUM%2==0","DS_MONEY",0,8);
 */
ngmf.caseSum = function(dsObj, condStr, colStr){
	try {
		var retSum = 0;
		var ds = ngmf.object(dsObj);

		if (typeof ds == "undefined") return -1;

		if(typeof condStr !="string" || condStr == null) {
			throw "2번째 인자는 String입니다.";
		}

		if(typeof colStr == "undefined" || colStr == null) {
			throw "3번째 인자는 없습니다.";
		}

		var opts = condStr;
/*
		var charCheck = /[~!\#$^&*\=+|:;?"<,.>()]/g;
		var checkDataArr = opts.replace(charCheck, " ").split(" ");
		var col_dataArr = [];
		for (var i = 0 ; i < checkDataArr.length ; i++) {
			if (checkDataArr[i].length > 0 && checkDataArr[i] != "") {
				col_dataArr.push(checkDataArr[i]);
			}
		}

		if (col_dataArr.length%2 == 0) {
			for (var i = 0; i < col_dataArr.length/2 ; i++) {
				if (typeof ds.getColumnIndex(col_dataArr[i*2]) == "undefined") {
					console.log("필터조건에 해당 컬럼이 존재 하지 않습니다.");
					return "";
				}
			}
		}
*/
		ngmf.createDataList("dataDummy0001");
		ngmf.copy("dataDummy0001", ds);
		ngmf.filter("dataDummy0001", condStr, true);

		var filterdJson = ngmf.object("dataDummy0001").getAllFilteredJSON();

		for(var i=0; i<filterdJson.length; i++){
			var colVal = ngmf.object("dataDummy0001").getCellData(i, colStr);
			retSum = retSum + Number(colVal);
		}

		$w.data.remove("dataDummy0001");
		return retSum;

	}catch(e) {
		ngmf._error("[ngmf.caseSum] Exception :: ", e);
		return "";
	}
};

/**
 * 이벤트를 발생시킨다.
 * @date 2015-11-26
 * @param {Object} compId   :: I :: N ::  :: 컴포넌트ID
 * @param {Object} flag     :: I :: N ::  :: 이벤트 발생여부
 * @param {Object} eventObj :: I :: N ::  :: 이벤트 객체
 * @memberOf ngmf
 * @sampleLink scm_preventEvent
 * @author 이동규
 * @useMobile use
 * @example ngmf.fireEvent(compId, flag, eventObj);
 * @exampleAsIs
 */
ngmf.fireEvent = function (compId, flag, eventObj) {
	try {
		var comp = ngmf.object(compId);
		if (typeof comp == "undefined") return -1;

		if (comp.options.pluginName == "dataList") {
			comp.setBroadcast(flag);

			if(flag) {
				comp.broadcast({
					"linkedDataList" : ["notifyDataChanged"],
					"gridView" : ["notifyDataChanged"],
					"generalComp" : "both"
				});
			}

			comp.setEventPause(null, !flag);
			for (var i in comp.childCompHash) {
				var childComp = ngmf.object(comp.childCompHash[i].id);
				if (typeof childComp != "undefined") {
					childComp.setEventPause(null, !flag);
				}
			}

			for (var i in comp.refCompHash) {
				var refComp = ngmf.object(comp.refCompHash[i].id);
				if (typeof refComp != "undefined") {
					refComp.setEventPause(null, !flag);
				}
			}

			if (flag) {
				WebSquare.event.fireEvent(comp, "ondataload");
			}
		}
	} catch(e) {
		ngmf._error("[ngmf.fireEvent] Exception :: ", e);
	}
};

/**
 * 내부함수: 프로그램 ID로 URL
 * 연관메뉴 및 링크메뉴 처리
 * @date 2016.01.06.
 * @memberOf
 * @author 성일호
 * @useMobile use
 * @param {String} menuId :: I :: N ::  :: 메뉴ID
 * @example
 * @exampleAsIs
 */
ngmf.createUrl = function (menuId) {
	 try{
		return "../../" + ngmf.getSvcId(menuId) + "/xml/" + menuId + ".xml";
	 } catch (e) {
		 ngmf._error("[ ngmf.createUr] Exception :: ", e);
	 }
};

/**
 * 해당 범위안에서 조건에 맞는 Record를 추출한 후, 계산식을 적용해 Record들의 최대값을 구하는 Method 입니다.
 * 연관메뉴 및 링크메뉴 처리
 * @date 2016.02.15.
 * @memberOf ngmf
 * @param {Object} dataListObj :: I :: N ::  :: 기준 데이터리스트 객체
 * @param {String} strCmpExpr  :: I :: N ::  :: String 최대값을 구할 Record를 추출하기 위한 조건문.
 * @param {String} strValExpr  :: I :: N ::  :: String 추출된 레코드에 적용할 계산식.
 * @param {Number} nStart      :: I :: Y ::  :: Integer 최대값을 구할 시작 Record Index. 시작 Index 0입니다.
 * @param {Number} nCnt        :: I :: Y ::  :: Integer 최대값을 구할 레코드 갯수 [Default Value = RowCount].
 * @author 이진수
 * @useMobile use
 * DsSample 테이블.
 * |col1|col2|
 * | 0  |  1 |
 * | 0  |  8 |
 * | 1  |  3 |
 * | 1  |  5 |
 * | 1  |  4 |
 * | 0  |  6 |
 * @example ngmf.caseMax("DsSample", "col1 ==0", "col2") -> return 8
 * @exampleAsIs Edit0.Text = DsSample.CaseMax("col1==0","col2");
 */
ngmf.caseMax = function(dataListObj, strCmpExpr, strValExpr, nStart, nCnt){
	 try{
		var dslObj = dataListObj;

		if(WebSquare.util.isString( dslObj )){
			dslObj = ngmf.object(dataListObj);
		}

		if(dslObj.getRowCount() == 0){
			return;
		}

		var start = 0;
		var end = dslObj.getRowCount() - 1;
		ngmf.createDataList("dataDummy0001");
		ngmf.copy("dataDummy0001", dslObj);

		if(typeof nStart !== "undefined"){
			start = nStart;
		}

		if(typeof nCnt !== "undefined"){
			end = start + nCnt;
		}

		if(start > end){
			ngmf.alert("최대값을 구할 시작 Record Index가 종료 Record Index보다 큽니다.");
			return;
		}

		var rangeJSON = dslObj.getRangeJSON( start, end );

		dataDummy0001.setJSON( rangeJSON , false );
		ngmf.filter("dataDummy0001", strCmpExpr, true);

		var compVal = "";
		
		for(var i=0; i<dataDummy0001.getRowCount(); i++){
			var strVal = dataDummy0001.getCellData(i, strValExpr);
			
			if(isNaN(Number(strVal))){
				if(compVal <= String(strVal)){
					compVal = strVal;
				}
			}else{
				if(Number(compVal) <= Number(strVal)){
					compVal = strVal;
				}
			}
			
			
		}

		$w.data.remove("dataDummy0001");
		return compVal;
	 } catch (e) {
		 ngmf._error("[ ngmf.caseMax ] Exception :: ", e);
	 }
};

/**
 * dialog팝업의 메세지를 표시한다.
 * @date 2016.02.15.ngmf.midb

 * @param {String} msg :: I :: N ::  :: dialog 메세지
 * @author 이동규
 * @useMobile use
 * @example ngmf.setDialogAlertMsg(msg)
 * @exampleAsIs
 */
ngmf.setDialogAlertMsg = function (msg) {
	try {
		if (typeof GLD.ngmv.dialogAlertItem == "undefined") GLD.ngmv.dialogAlertItem = [];
		if (GLD.ngmv.dialogAlertItem.length == 1) {
			ngmf._debug("Warring ::: [ngmf.setDialogAlertMsg] 함수 같은 경우는 콜백 특정 기능이므로 같은 인터페이스(함수) 에서 중복사용이 불가능합니다!!!!");
			if(typeof GLD.ngmv.dialogOpen == "undefined") GLD.ngmv.dialogOpen = "";
			GLD.ngmv.dialogOpen = "false";
		} else if (GLD.ngmv.dialogAlertItem.length == 0) {
			GLD.ngmv.dialogAlertItem.push(msg);
		}
	} catch(e) {
		 ngmf._error("[ ngmf.setDialogAlertMsg ] Exception :: ", e);
	}
};

/**
 * 다수의 dialog팝업을 표시한다.
 * @date 2016.02.15.
 * @memberOf ngmf
 * @param {Array} dialogObjArr :: I :: N ::  :: dialog객체 배열
 * @author 이동규
 * @useMobile use
 * @example ngmf.setMultiDialog(dialogObjArr)
 * @exampleAsIs
 */
ngmf.setMultiDialog = function (dialogObjArr) {
	try {
		if(ngmf.isMobile()) {
			//ngmf.alert("ngmf.setMultiDialog : 모바일환경에서 지원불가 API 입니다.");
			return;
		}
		
		if(typeof GLD.ngmv.mDialogFlag == "undefined") GLD.ngmv.mDialogFlag = "";
		if(typeof GLD.ngmv.mDialog == "undefined") GLD.ngmv.mDialog = [];
		if(typeof GLD.ngmv.mDialogCallBackFunc == "undefined") GLD.ngmv.mDialogCallBackFunc = "";

		if (dialogObjArr.length > 0) {
			var dialogObj = dialogObjArr[0];
			dialogObjArr.splice(0, 1);
			GLD.ngmv.mDialog = dialogObjArr;
			GLD.ngmv.mDialogFlag = "true"; // 추후 삭제 (확인)

			var strPrefix     = dialogObj.strPrefix     || "";
			var strFormID     = dialogObj.strFormID     || "";
			var strInArgument = dialogObj.strInArgument || "";
			var nWidth        = dialogObj.nWidth        || "";
			var nHeight       = dialogObj.nHeight       || "";
			var strOpenStyle  = dialogObj.strOpenStyle  || "";
			var nLeft         = dialogObj.nLeft         || "";
			var nTop          = dialogObj.nTop          || "";

			//var callbackFunc  = dialogObj.callbackFunc  || "";
			GLD.ngmv.mDialogCallBackFunc = dialogObj.callbackFunc  || "";
			var screenName    = dialogObj.screenName    || undefined;

			ngmf.setDialogAlertMsg(dialogObj.alertMsg);
			ngmf.__dialog(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, "ngmf._mDialogCallBack", screenName);
		} else {
			GLD.ngmv.mDialogFlag = "false";
		}
	} catch(e) {
		GLD.ngmv.mDialog = [];
		GLD.ngmv.mDialogFlag = "";

		 ngmf._error("[ ngmf.setMultiDialog ] Exception :: ", e);
	}
};

ngmf._mDialogCallBack = function() {
	try {
		var win = ngmf._callbackWindow(scvar.__screenName || ngmf.getFormID());
		if (win && typeof GLD.ngmv.mDialogCallBackFunc !== "undefined" && GLD.ngmv.mDialogCallBackFunc) {
			var mDialogCallBackFuncs = GLD.ngmv.mDialogCallBackFunc.split(".");
			var funcNm = GLD.ngmv.mDialogCallBackFunc.split(".")[1];
			if (mDialogCallBackFuncs.length > 1 && typeof win[mDialogCallBackFuncs[0]][mDialogCallBackFuncs[1]] == "function"){
				win[mDialogCallBackFuncs[0]][mDialogCallBackFuncs[1]](arguments[0]);
			}

			GLD.ngmv.mDialogCallBackFunc = "";
		}
		if (GLD.ngmv.mDialog && GLD.ngmv.mDialog.length > 0) {
			ngmf.setMultiDialog(GLD.ngmv.mDialog);
		}
	} catch (e) {
		ngmf._error("[ ngmf._mDialogCallBack ] Exception :: ", e);
	}
};

/**
 * 입력된 문자열에서 가운데 부분을 주어진 Byte 만큼 Return 하는 Basic API 입니다.
 * @date 2016.02.19.
 * @memberOf ngmf
 * @param {String} strString :: I :: N ::  :: String 가운데 부문을 얻어올 원본 문자열.
 * @param {Number} nIndex    :: I :: N ::  :: 얻어올 첫 글자의 Index.
 * @param {Number} nSize     :: I :: Y ::  :: Integer 얻어올 글자수.
 * @author 이진수
 * @useMobile use
 * @example
 * @exampleAsIs
 */
ngmf.midb = function(strString,nIndex,nSize){

	if(typeof nSize === "undefined" || nSize == null){
		return strString.substr(nIndex);
	}else{
		var subStrVal = strString.substr(nIndex);
		var returnStr = "";
		var sum = 0;

		for(var i=0; i<subStrVal.length; i++){
			var ch = subStrVal.charAt(i);
			if(escape(ch).length > 4){
				sum += 2;
				if(sum <= nSize){
					returnStr += ch;
				}

			}else{
				sum += 1;
				if(sum <= nSize){
					returnStr += ch;
				}
			}
		}

		return returnStr;
	}

};

/**
 * @date 2016.02.19.
 * @memberOf ngmf
 * @param {String} strString String 가운데 부문을 얻어올 원본 문자열.
 * @param {Number} nIndex 얻어올 첫 글자의 Index.
 * @param {Number} nSize Integer 얻어올 글자수.
 * @author 이진수
 * @useMobile use
 * @example

ngmf.ext_msgBox = function(title, msg, strParam) {
	try {
		var options = {
			title : title || "",
			strArguemnt : strParam || ""
		}

		ngmf.alert(msg, function(ret) {
		}, options);

		return "";
	} catch(ex) {
		ngmf._error("[ ngmf.ext_msgBox ] Exception :: ", e);
	}
};
*/

/**
 * 팝업 화면에서 상위 부모창의 윈도우 또는 컴포넌트를 찾는 API 입니다.
 * @date 2016.02.21.
 * @memberOf ngmf
 * @param {String} winId :: I :: N :: :: parent 화면 ID
 * @param {String} comId :: I :: N :: :: parent 화면 find 객체.
 * @return parent 화면 또는 parent화면 객체 [존재 하지 않는 경우 -1]
 * @author 이동규
 * @useMobile use
 * @example ngmf.findParentObject(winId, comId); //return CompObj;
 */
ngmf.findParentObject = function(winId, comId) {
	try {
		var parentWindow = null;
		if (typeof WebSquare["parentForm"] == "undefined" || !WebSquare["parentForm"]) ngmf.popupParam();
		
		parentWindow = WebSquare["parentForm"];
		if (typeof parentWindow === "undefined" || !parentWindow) return -1;		
		if (typeof winId === "undefined" || !winId) return -1;
		
		if ( parentWindow.scvar.__screenName != winId)
			parentWindow = ngmf.getWindow(winId);
		
		if (typeof parentWindow === "undefined" || !parentWindow) return -1;
		
		var retVal;
		if (typeof comId !== "undefined") {
			retVal = parentWindow.ngmf.object(comId);
		} else {
			retVal = parentWindow;
		}

		if (typeof retVal !== "undefined") {
			return retVal;
		} else {
			return -1;
		}
	} catch(ex) {
		ngmf._error("[ngmf.findParentObject] Exception :: ", ex);
	}
};

/**
 * 기존 Dataset에 새로운 Dataset을 통합하는 Method 입니다.
 * @date 2016.02.23.
 * @memberOf ngmf
 * @param {String/Object} tDs_obj :: I :: N :: :: Dataset Object. (기본 데이터)
 * @param {String/Object} pDs_obj :: I :: N :: :: 통합할 Dataset Object.
 * @return 합쳐진 Dataset의 Record 갯수.
 * @author 이동규
 * @useMobile use
 * @example ngmf.merge(tDs_obj, pDs_obj); //return pDs_obj 의 합쳐진 rowCount.
 */
ngmf.merge = function(tDs_obj, pDs_obj) {
	try {
		var tDs_obj = ngmf.object(tDs_obj);
		var pDs_obj = ngmf.object(pDs_obj);
		var cnt = 0;
		if (typeof tDs_obj == "undefined" || typeof pDs_obj == "undefined") {
			return -1;
		} else {

			var targetColumnList = tDs_obj.cellIdList;
			var pTargetColumnList = pDs_obj.cellIdList;
			var mergeColArr = [];
			for (var i = 0 ; i < pTargetColumnList.length ; i++) {
				if (targetColumnList.indexOf(pTargetColumnList[i]) > -1) {
					mergeColArr.push(pTargetColumnList[i]);
				}
			}

			ngmf.fireEvent(tDs_obj, false);
			for (var i = 0 ; i < pDs_obj.getRowCount(); i++) {
				var insIdx = tDs_obj.insertRow();
				cnt++;
				for (var j = 0 ; j < mergeColArr.length; j++) {
					tDs_obj.setCellData(insIdx, mergeColArr[j], pDs_obj.getCellData(i, mergeColArr[j]));
				}
			}
			ngmf.fireEvent(tDs_obj, true);
		}
		return cnt;
	} catch(ex) {
		ngmf._error("[ngmf.merge] Exception :: ", ex);
	}
};

/**
 * Switch Control안의 각 Case 내 wframe으로 로딩한 경우 Switch가  첫번째 선택  되는 시점에서
 * form_onLoadCompleted 이벤트가 실행하도록 세팅한다.
 * @date 2016.02.24
 * @memberOf ngmf
 * @param {String / Json} swControlId :: I :: N ::  :: swControl 객체 OR 아이디
 * @author 성일호
 * @useMobile use
 * @update 2016.02.24 [UI-0700]switch위의 wFrame 사용시 매우 불편사항 개선요청 처리
 * @example
 *     //Main Form scwin.form_onLoadCompleted 혹은 scwin.commonInitForm 에서 호출해 준다.
 * 		 ngmf.setOnLoadCompletedEventInSwitch(sw_send);
 */
ngmf.setOnLoadCompletedEventInSwitch = function(swControlId) {
	try{
		//항목추출시 제외
		if (GLV && GLV.G_CCATEMP == "Y") return;
		var swControl = ngmf.object(swControlId);
		if (!swControl) return;
		if ( swControl.options.alwaysDraw ) return;
		var wframes = ngmf.getWframes(swControl);
		if (!wframes || wframes.length <= 0) return;

		var ctrCase = swControl.childControlList;
		swControl._drawStatus = [];
		for (var idx = 0; idx < ctrCase.length; idx++) {
			if (idx == swControl.getSelectedIndex() ) swControl._drawStatus[idx] = true;
			else swControl._drawStatus[idx] = false;
		}

		swControl.bind("onselectedindexchange",
			function() {
				var idx = swControl.getSelectedIndex();
				var ctrCase = this.childControlList;
				if (this._drawStatus[idx] === false) {
					this._drawStatus[idx] = true;
					//상세권한제어
					ngmf.globalFormCheckCallBack();
					ngmf._callFormOnloadCompletedToWframe(ctrCase[idx]);
				}
			}
		);
	} catch(e) {
		ngmf._error("[ngmf.setOnLoadCompletedEventInSwitch] Exception :: ", e);
	}
};

//2016.06.27 연관메뉴 화면별 정의하기로 변경  :::: 미사용
ngmf._popActRelatedMenu = function (popObj, menuCd, menuOpen){
	try {  
		var isPopup = false;
		var screenWindow = null;
		var dataCompMain = GLD.ngmf.object("dsl_relativeBtn");
		var windowMDI = ngmf.mdiTabs();
		if (menuCd){
			screenWindow = ngmf._callbackWindow( menuCd); 
		} else if (popObj){ 
			isPopup = true;
			menuCd = popObj.getID();
			screenWindow = ngmf._callbackWindow(menuCd, true);
		}
		if (ngmf._checkFormBatch(menuCd)) return false;
		
		if (menuCd) {
			if ( $("#relaBody"+menuCd).length > 0) {
				if (screenWindow["scvar"]["relativeBtnRefresh"]){
					$("#relaBody"+menuCd).remove();
					screenWindow["scvar"]["relativeBtnRefresh"] = false;
				} else {
					$("#relaBody"+menuCd).addClass('show');
					return;
				}
			}
			
			if (typeof screenWindow["scvar"]["cnnt_pgm_grp_id"] == "undefined") screenWindow["scvar"]["cnnt_pgm_grp_id"] = "0";
			var cnnt_pgm_grp_id = screenWindow["scvar"]["cnnt_pgm_grp_id"] ;
			var dataComp = null;
			var dsCtrlChkComp = null;
			var screenBtnArr = [];
			if (dataCompMain) {
				dataComp = screenWindow.ngmf.object("dsl_relativeBtnMenu");
				if (!dataComp) {
					screenBtnArr = dataCompMain.getMatchedJSON("screenNm", menuCd);
					if (screenBtnArr.length < 1) {
						dataComp = null;
					} else {
						dataComp = screenWindow.ngmf.createDataList("dsl_relativeBtnMenu", [ "screenNm", "btnId", "btnNm", "authrity", "btnType", "btnAction", "popupOptions", "hide", "grpId"]);
						dataComp.setJSON(screenBtnArr);
					} 
				}
			}
			if (dataComp) {
				//상세권한적용 보류
				//dsCtrlChkComp = screenWindow.ngmf.object("ds_CtrlChkComp");
				var node = document.createElement("ul");
				node.setAttribute("id", "relaBody" + menuCd);
				node.setAttribute("class", "w2group lst_rela hide");
				if (isPopup) { 
					document.getElementById(menuCd+ "_header").appendChild(node);
				} else popObj.appendChild(node);
				
				var screenNm = menuCd ;
				if (screenNm) {
					var dataHtml = new Array();
					
					screenBtnArr = dataComp.getMatchedJSON("grpId", cnnt_pgm_grp_id || "0");
					if (screenBtnArr.length < 1) {
						if ($("#relaBody"+menuCd)) $("#relaBody"+menuCd).remove();
					} else {
						var actionInxArr = new Array();
						var btnId = null;
						var btnNm = null;
						var btnType = null;
						var btnAction = null;
						var popupOptions = null;
						var authrity = null;
						var hidden = null;
						var grpId = null;
						var IsCtrlChkComp = false;
						var ctrlChkCompArr = null;
						var disableCompArr = {};
						var disableClass = "";
						for (var i in screenBtnArr) {
							disableClass = "";
							IsCtrlChkComp = false;
							ctrlChkCompArr = null;
							btnId = screenBtnArr[i].btnId;
							btnNm = screenBtnArr[i].btnNm;
							btnType = screenBtnArr[i].btnType;
							btnAction = screenBtnArr[i].btnAction;
							popupOptions = screenBtnArr[i].popupOptions;
							authrity = screenBtnArr[i].authrity;
							hidden = screenBtnArr[i].hide;
							grpId = screenBtnArr[i].grpId;
							//상세권한 제어 추가 2016.04.26 => 보류
							/*
							if (typeof dsCtrlChkComp != "undefined" && dsCtrlChkComp.getRowCount() > 0) {
								ctrlChkCompArr = dsCtrlChkComp.getMatchedJSON("scrn_itm_eng_nm", btnId);
								if (ctrlChkCompArr.length > 0 && ctrlChkCompArr[0].usable_yn.trim() == "Y"  && ctrlChkCompArr[0].scrn_itm_auth_aply_cd.trim() == "DISABL" ) {
									disableCompArr[btnId] = true;
									disableClass = "disabled ";
								} else if (ctrlChkCompArr.length > 0  && ctrlChkCompArr[0].usable_yn.trim() == "Y"  && ctrlChkCompArr[0].scrn_itm_auth_aply_cd == "HIDDEN") isCtrlChkComp = true;
							}
							*/
							if (!authrity && !hidden && !IsCtrlChkComp) {								
								btnAction = (typeof btnAction !== "undefined") ? "btnAction='"+btnAction+"'" : "";
								dataHtml.push("<li id='"+ btnId + "_li_" + i +"' class='w2group'>");
								if ((btnType == "W" || btnType == "P" || btnType == "F") && btnAction !== "") {
									var actionObj = {
										btnId : btnId,
										btnType : btnType,
										btnAction : btnAction,
										popupOptions : popupOptions
									};
									actionInxArr.push(actionObj);
								}
								
								if (isPopup) {
									dataHtml.push("<a id='"+ btnId + "_relativeBtn' ispopup='Y' menucd='" +menuCd+ "' class='w2anchor2 "+disableClass+"' href='javascript:void(null);'>");
								}
								else {
									dataHtml.push("<a id='"+ btnId + "_relativeBtn' ispopup='N' menucd='" +menuCd+ "' class='w2anchor2 "+disableClass+"' href='javascript:void(null);'>");
								}
								dataHtml.push(btnNm);
								dataHtml.push("</a>");
								dataHtml.push("</li>");
							}
						}
						dataHtml = dataHtml.join("");
						node.innerHTML = dataHtml;
						for (var i in actionInxArr) {							
							//Disable 객체일 경우 Click 이벤트 적용하지 않음 2016.01.26
							if(disableCompArr[actionInxArr[i].btnId]) {
								$("#"+ actionInxArr[i].btnId +"_relativeBtn").bind("click", function(e) {
									ngmf._error("사용권한이 없습니다. [Disabled Botton]");
									e.stopPropagation();
								});
								//continue;								
							} else if (actionInxArr[i].btnType.toUpperCase() == "W") {
								$("#"+ actionInxArr[i].btnId +"_relativeBtn").bind("click", function(e) {
									var menuCd = e.target.getAttribute("menucd");									
									var screenWindow = null;
									var windowMDI = ngmf.mdiTabs();
									if ( e.target.getAttribute("ispopup") != "Y") {
										screenWindow = ngmf._callbackWindow( menuCd);
									} else if (popObj){ 
										screenWindow = ngmf._callbackWindow(menuCd, true);
									}
									var btnId = this.id.split("_relativeBtn")[0];
									/// 프로그램 서비스 데이터
									var obj = screenWindow.dsl_relativeBtnMenu.getMatchedJSON("btnId", btnId)[0];
									ngmf.createMDI(obj.btnAction);
									e.stopPropagation();
								});
							} else if (actionInxArr[i].btnType.toUpperCase() == "P") {
								$("#"+ actionInxArr[i].btnId +"_relativeBtn").bind("click", function(e) { 
									var menuCd = e.target.getAttribute("menucd");									
									var screenWindow = null;
									var windowMDI = ngmf.mdiTabs();
									if ( e.target.getAttribute("ispopup") != "Y") {
										screenWindow = ngmf._callbackWindow( menuCd);
									} else if (popObj){ 
										screenWindow = ngmf._callbackWindow(menuCd, true);
									}

									var btnId = this.id.split("_relativeBtn")[0];
									var obj = screenWindow.dsl_relativeBtnMenu.getMatchedJSON("btnId", btnId)[0];
									var vParam = "";
									var options = {};
									if (typeof obj.popupOptions !== "undefined" && obj.popupOptions !== "") {
										options = ngmf.jsonParse(obj.popupOptions);
									} else {
										options.title = "팝업화면"; //프로그램 서비스 데이터에서 스크린명 가져오기.
										options.type = "litewindow";
										options.width = "1100px";
										options.height = "410px";
										options.top = "150px";
									} 
									
									screenWindow.ngmf.promise.dialog(ngmf.getSvcId(obj.btnAction), obj.btnAction, vParam, Number(options.width.replaceAll("px","")) , Number(options.height.replaceAll("px","")) ,"","",Number(options.top.replaceAll("px","")) ,menuCd)
									.then(function(rtnVal) {										
									}); 
									//screenWindow.ngmf._openPopup("relavtivePopup_"+btnId, obj.btnAction+".xml", options, screenWindow.scvar.__screenName,true);
									e.stopPropagation();
								});
							} else if (actionInxArr[i].btnType.toUpperCase() == "F") {
								$("#"+ actionInxArr[i].btnId +"_relativeBtn").bind("click", function(e) {
									var menuCd = e.target.getAttribute("menucd");									
									var screenWindow = null;
									var windowMDI = ngmf.mdiTabs();
									if ( e.target.getAttribute("ispopup") != "Y") {
										screenWindow = ngmf._callbackWindow( menuCd);
									} else if (popObj){ 
										screenWindow = ngmf._callbackWindow(menuCd, true);
									}									
									var btnId = this.id.split("_relativeBtn")[0];
									var obj = screenWindow.dsl_relativeBtnMenu.getMatchedJSON("btnId", btnId)[0];

									if (screenWindow["scwin"] && screenWindow["scwin"]["relativeFunc"])
										screenWindow.scwin.relativeFunc(obj);
									e.stopPropagation();
								});
							}
						}
					}
				} 
	
				$("#relaBody" +menuCd).hover(
					function() {
						 if(menuOpen) menuOpen["isOpen"] = true;
						$("#relaBody"+menuCd).addClass('show');
					},
					function() {
						if(menuOpen) menuOpen["isOpen"] = false;
						$("#relaBody"+menuCd).removeClass('show');
					}
				);
	
				$("#relaBody"+menuCd).addClass('show');
			}
		}
	} catch (ex) {
		ngmf._error("[ngmf._popActRelatedMenu] Exception :: ", ex);
	}
};

ngmf._popActCustRegist = function (popObj, menuID){
	try {   
		var popComp = $("#"+popObj.id +"_header_button_0_value");
		if (popComp && !popComp.hasClass("w2anchor_disabled")) {
			var screenWindow = null;
			var windowMDI = null;
			
			if(!ngmf.isMobile()){
				windowMDI = ngmf.mdiTabs();
			} 
			if (menuID) {
				screenWindow = ngmf._callbackWindow(menuID);
			} else if (popObj){
				menuID = popObj.getID();
				screenWindow = ngmf._callbackWindow(menuID, true);
			}
			if (ngmf._checkFormBatch(menuID)) return false;
			
			if (menuID != "ZNGMSCAP20010" && screenWindow) {
				var vParam = "openerFormId=" + ngmf.quote(menuID) ; 
				screenWindow.ngmf.promise.dialog("CCA", "ZNGMSCAP20010", vParam, 610, 110,"","","","").then(function(rtnVal) {
				}); 
			} 
		}
	} catch (ex) {
		ngmf._error("[_popActCustRegist] Exception :: ", ex);
	} 
}; 

ngmf._popActHelp = function (popObj, menuID){
	try { 
		var popComp = $("#"+popObj.id +"_header_button_2_value");
		if (popComp && !popComp.hasClass("w2anchor_disabled")) {
			var screenWindow = null;
			var windowMDI = null;
			
			if(!ngmf.isMobile()){
				windowMDI = ngmf.mdiTabs();
			} 
			if (menuID) {
				screenWindow = ngmf._callbackWindow(menuID);
			} else if (popObj){
				menuID = popObj.getID();
				screenWindow = ngmf._callbackWindow(menuID, true);
			}

			if (ngmf._checkFormBatch(menuID)) return false;
			
			ngmf.alert("작업중입니다!!");
		}
	} catch (ex) {
		ngmf._error("[_popActHelp] Exception :: ", ex);
	} 
};
ngmf._popActRefresh = function (popObj){
	try {
		var popComp = $("#"+popObj.id +"_header_button_1_value");
		if (popComp && !popComp.hasClass("w2anchor_disabled")) {
			if (ngmf._checkFormBatch(popObj.getID())) return false;
			var popWin = WebSquare.util.getPopupWindow(popObj.getID()); 
			if (popWin["scwin"] && popWin["scwin"]["commonInitForm"]) {
				popWin.ngmf._executeCommonInitForm();
				popWin["scwin"]["commonInitForm"]();
			}
			else popWin.ngmf.reload(popObj.id);
		}
	} catch (e) {
		ngmf._error("[ngmf._popActRefresh] Exception :: ", e);
	}
};
//POPUP Action 기능함수 구현
ngmf._popActMinimize = function(popupObj) {
	try {
		if (popupObj && popupObj.frame && popupObj.frame.getWindow()) {
			var oldTop = $("#"+popupObj.getID()).offset().top;
			var oldLeft = $("#"+popupObj.getID()).offset().left;
			var oldWidth = $("#"+popupObj.getID()).outerWidth();
			var oldHeigt = $("#"+popupObj.getID()).outerHeight();
			var zIndex =  Number($("#"+popupObj.getID()).css("z-index"));
			if (isNaN(zIndex)) zIndex = 9000;

			popupObj.frame.getWindow().ngmf.resizePopup({}, true);
			var wfmAreaOption = {
				"style" : "position:absolute;bottom:1px;right:1px;z-index:9000"
			}
			
			if (true || ngmv._popupToastType == "absolute") {
				var comp = ngmf.create(popupObj.id +"_minPop", "floatingLayer", {"style":"position:absolute; bottom:0px; right:0px;"});
				comp.popupTitle = ngmf.object(popupObj.getID() +"_header_title").textContent;
				ngmf.addClass(comp.getID(), "min_popup");
				comp.setStyle("z-index", zIndex);

				var keyLen = 0;
				var deleteCnt = 0;
				if (typeof ngmv._popupToast == "undefined") {
					ngmv._popupToast = {}
				}
				for (var i in ngmv._popupToast) {
					if (ngmv._popupToast[i].indexOf("_delete_") > -1) {
						deleteCnt++;
					}
				}
				keyLen = Object.keys(ngmv._popupToast).length;
				if (keyLen == deleteCnt) {
					ngmv._popupToast = {};
					keyLen = 0;
				}
				var setBottom = 30 * keyLen +"px";
				ngmv._popupToast[keyLen] = comp.id;

				comp.setStyle("bottom", setBottom);
			} else {
				var wfmComp;
				if (typeof ngmf.object(ngmf.getFormID() + "_" + ngmf.getFormID() + "_area") == "undefined") {
					wfmComp = ngmf.create(ngmf.getFormID() + "_" + ngmf.getFormID() + "_area", "group" , wfmAreaOption);
				} else {
					wfmComp = ngmf.object(ngmf.getFormID() + "_" + ngmf.getFormID() + "_area");
				}
				
				var createDiv = document.createElement("div");
				createDiv.id = popupObj.id +"_minPop_Div";
				
				var parentDiv = document.getElementById(wfmComp.getID());
				var fristChild = parentDiv.firstChild;
				parentDiv.insertBefore(createDiv, fristChild);
				var comp = ngmf.create(popupObj.id +"_minPop", "floatingLayer", {"style":"position:static"}, createDiv);
				comp.popupTitle = ngmf.object(popupObj.getID() +"_header_title").textContent;
				ngmf.addClass(comp.getID(), "min_popup");
				comp.setStyle("z-index", 9000);
			}

			if (ngmf.trim(comp.popupTitle) == "") {
				comp.popupTitle = popupObj.id;
			}

			comp.popupObj = popupObj;
			comp.redrawOption = {
				top : oldTop,
				left : oldLeft, 
				width : oldWidth,
				height : oldHeigt,
				isMove : true
			};

			var htmlArr = [];
			htmlArr.push("<div id='' style='' class='w2group floatingLayer_header'>");
			htmlArr.push("<h3 id='"+comp.getID() +"_miniPopup_title' class='w2floatingLayer_title'>"+comp.popupTitle +"</h3>");
			htmlArr.push("<div type='button' tabindex='0' id='"+comp.getID() +"_miniPopup_btnClose' class='w2floatingLayer_close_button' value='닫기'>");
			htmlArr.push("</div>");
			ngmf.object(comp.getID()).setHeaderHTML(htmlArr.join(""));

			$("#"+ comp.getID() +"_miniPopup_title").bind("click", function() {
				if (true || ngmv._popupToastType == "absolute") {
					var fltComp = ngmf.object(this.id.replace("_miniPopup_title", ""));
					for (var i in ngmv._popupToast) {
						if (ngmv._popupToast[i] == fltComp.getID()) {
							ngmv._popupToast[i] = "_delete_";
						}
					}
					var popupObj = fltComp.popupObj;
					var resizeOptions = fltComp.redrawOption;
					var popupWindow = popupObj.frame.getWindow();
					popupWindow.ngmf.resizePopup(resizeOptions);
					ngmf.object(popupObj.getID() +"_minPop").remove();
				} else {
					var fltComp = ngmf.object(this.id.replace("_miniPopup_title", ""));
					var popupObj = fltComp.popupObj;
					var resizeOptions = fltComp.redrawOption;
					var popupWindow = popupObj.frame.getWindow();
					popupWindow.ngmf.resizePopup(resizeOptions);
					ngmf.object(popupObj.getID() +"_minPop").remove();
				}

			});

			comp.bind("onclose", function() {
				if (true || ngmv._popupToastType == "absolute") {
					for (var i in ngmv._popupToast) {
						if (ngmv._popupToast[i] == this.id) {
							ngmv._popupToast[i] = "_delete_";
						}
					}
					var popupWindow = this.popupObj.frame.getWindow();
					ngmf.object(this.popupObj.id +"_minPop").remove();
					popupWindow.ngmf.close();
				} else {
					var popupWindow = this.popupObj.frame.getWindow();
					ngmf.object(this.popupObj.id +"_minPop").remove();
					popupWindow.ngmf.close();
				}
			});
		}
	} catch(e) {
		ngmf._error("[_popActMinimize] Exception :: ", ex);
	}
};
//POPUP Action 기능함수 구현

/**
 * Tab Control 내 Tab Page 상태 확인용 함수
 * @date 2016.02.24
 * @memberOf ngmf
 * @param {String / Json} tabObj :: I :: N ::  :: TabControl 객체 OR 아이디
 * @param {Number} tabIndex :: I :: N ::  :: 상태 확인할 Tab 인덱스
 * @return {Boolean} Disable 상태
 * @author 성일호
 * @update [UI-0770]tab 에서 tab page별 disable 정보 알아오는 방법
 * @example
 *     ngmf.getTabpageDisabled( tabControl, 0);
 */
ngmf.getTabpageDisabled = function(tabObjId, tabIndex) {
	try{
		//항목추출시 제외
		if (typeof tabIndex == 'undefined' || tabIndex == null) return null;
		var tabObj = ngmf.object(tabObjId);
		if (!tabObj) return null;

		return tabObj.tabArr[ngmf.parseInt(tabIndex)].disabled ;

	} catch(e) {
		ngmf._error("[ngmf.getTabpageDisabled] Exception :: ", e);
	}
	return null;
};

/**
 * Message를 표현하는 DialogBox를 실행하는 API 입니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {Object} msg     :: I :: N ::  :: Dialog Box에 메세지.
 * @param {Object} func    :: I :: Y ::  :: Dialog 콜백 함수
 * @param {Object} options :: I :: Y ::  :: Dialog Box 설정 옵션.
 *				   options.strArguemnt {String} : alert Box에 콜백 함수의 파라메타(json객체 String형식만 허용.)
 * @sampleLink scm_svcCallBasic
 * @author 이동규
 * @useMobile use
 * @example ngmf.alert("alert메세지 창", options);
 * @exampleAsIs Alert("Show Message");
 */
ngmf.alert = function (msg, func, options) {
	try{
		var msg = msg || "";
		var isFuncCallBack = ngmf.isFunction(func) ? true : false;
		var strArg = (options && typeof options.strArgument !== "undefined") ? options.strArgument : undefined;
		
		window.alert(msg);
		if (isFuncCallBack) {
			if (typeof strArg !== "undefined") { 
				var paramArr = [];
				if (ngmf.isJSON(strArg)) {
					func(strArg);
				} else if (ngmf.isString(strArg)){
					var popupParamJSON = ngmf._extractData(strArg);
					func(popupParamJSON);
				}
			} else {
				func();	
			}
		}
		
	} catch (e) {
		ngmf._error("[ngmf.alert] Exception :: ", e);
	}
};


/**
 *  사용자로부터 확인/취소 선택을 입력받을수 있는 Dialog 를 실행하는 Form API 입니다. (native confirm)
 * @date 2016-02-28
 * @memberOf ngmf
 * @param {Object} msg     :: I :: N ::  :: Dialog Box에 메세지.
 * @param {Object} func    :: I :: N ::  :: Dialog Box에 버튼클릭시 호출되는 함수.
 * @sampleLink grd_detailView
 * @author 이동규
 * @useMobile use
 * @example 
 * @example ngmf.confirm("테스트 메세지!", function(returnVal) {if(returnVal== "Y" ) {
 * @example 									alert(returnVal);
 * @example 								} else if(returnVal== "N") {
 * @example 									alert(returnVal)
 * @example 								} else { 
 * @example 									alert(returnVal)
 * @example 								}
 * @example  });
 * @exampleAsIs Confirm("Do you want to delete?");
 */	
ngmf.confirm = function (msg, func) {
	var rtnValue;
	try{
		var msg = msg || "";
		var isFuncCallBack = ngmf.isFunction(func) ? true : false;
		if (isFuncCallBack) {
			rtnValue = window.confirm(msg);
			var retVal = rtnValue ? "Y" : "N";
			func(retVal);
		} else {
			rtnValue = window.confirm(msg);
		}
	} catch (e) {
		ngmf._error("[ngmf.confirm] Exception :: ", e);
	}
	return rtnValue;
};


/**
 * String 문자열을 json객체의 key와 value로 추출하는 내부함수입니다.
 * strArg 파라메터를 추출하는데 사용합니다.
 * @date 2016-03-03
 * @memberOf ngmf
 * @param {Object} strArg  :: I :: N ::  :: strArg 파라메터
 * @author 이동규
 * @useMobile use
 * @example var strArg = "test1 = " + ngmf.quote("data1");
 * @example 	strArg += " test2 = " + ngmf.quote("data2");
 * @example ngmf._extractData(strArg);
 * @example 내부 strArg 는 공백으로 구분 합니다.
 * @exampleAsIs 
 */
ngmf._extractData = function (strArg) {
	try{ 
		var tokenArr = ngmf.trim(strArg).replace(/\'/g,"\"").split("\"");
		var extractObj = {};
		for (var i = 0 ; i < Math.floor(tokenArr.length/2) ; i++) {
			var key = ngmf.replace(ngmf.trim(tokenArr[i*2]), "=");
			key = key.replace(/(^\s*)|(\s*$)/gi,"");
			if(key.indexOf(",") > -1){
				key = key.replaceAll(",","").replace(/(^\s*)|(\s*$)/gi,"");
			}
			var value = ngmf.replace(tokenArr[i*2+1], "\"");
			if(value[value.length -1] == ",") {
				value = value.slice(0, value.length-1);
			}
			extractObj[key] = value;
		}
		return extractObj;
	} catch(e) {
		ngmf._error("[ngmf._extractData] Exception :: ", e);
	}
};

/**
 *  미사용
 * @date 2016. 3. 14.
 * @memberOf 
 * @param {Object} mdi
 * @param {String} screenNm
 * @returns {Object}  
 * @author 성일호
 * @update 2016.06.24 이동규 getWindow 통합작업.
 * @example
 * @since
 * @useMobile useless
 */
ngmf._getWindowToId = function(_mdi, screenNm) {
	// 2016.08.05 window 관리 통합 으로 미사용
	ngmf._error("window 관리 통합 으로 미사용");
	return false;
	/*
	if(ngmf.isMobile()) {
		//ngmf.alert("ngmf._getWindowToId : 모바일환경에서 지원불가 API 입니다.");
		return;
	}

	var s = null;
	try {
		var winId = "";
		var mdi = _mdi;
		if (typeof _mdi == "undefined" || !_mdi) mdi = ngmf.mdiTabs();
		if (!mdi) return null;
		
        for (var i = 0; i < mdi.windows.length; i++) {
            var mdiWin = mdi.windows[i];
            if (screenNm == mdiWin.title) {
                 winId = mdiWin.id;
				 break;
            }
        }
        if (winId) {
    		s = GLD.document.getElementById(winId+"_iframe");
    		if(s) return s.contentWindow;
        }
	} catch (e) {
		ngmf._error("[ngmf._getWindowToId] Exception :: ", e);
	} 
	return null;
	*/
};


/**
 * 현재 화면을 다시 Loading 하는 API. 
 * Loading 처리 :  strFunction 호출 또는 (scwin.form_onLoadCompleted 호출 + scvar 초기화)
 * @date 2016.03.19
 * @memberOf ngmf
 * @param {String} screenNm    :: I :: Y :: ngmf.getFormID()  :: 화면명
 * @param {String/Json} strArg :: I :: Y ::  :: 리로드 후 설정할 초기 변수
 * @param {String} strFunction :: I :: Y ::  :: 리로드 후 실행할 함수명 
 * @param {Boolean} _notFocusWin  :: I :: Y :: "" :: true 일경우 화면을 선택하지 않음
 * @author 성일호
 * @update 2016.06.24 이동규 getWindow 통합작업.
 * @update 2016.07.08 성일호 OnloadComplete 호출 로직 제거
 * @example ngmf._reloadNew();
 * @useMobile useless
 */
ngmf._reloadNew = function (_screenNm, strArg, strFunction, _notFocusWin) {
	if(ngmf.isMobile()) {
		ngmf._error("ngmf._reloadNew : 모바일환경에서 지원불가 API 입니다.");
		return false;
	}

	try{
		var windowMDI =  ngmf.mdiTabs();
		var screenNm = _screenNm || windowMDI.getSelectedWindowId();
		var screenWindow  = null;
		
		var chkWindowInfo =  ngmf._getWindowInfo(screenNm,windowMDI.id);
		
		if (windowMDI && chkWindowInfo.length > 0) {
			if (typeof _notFocusWin != "undefined" && _notFocusWin) screenWindow = windowMDI.getWindowByWindowId(screenNm, false);
			else  screenWindow = windowMDI.getWindow(screenNm);
			
			screenWindow = windowMDI.getWindowByWindowId(screenNm, false);

			//2016.03.19 성일호 scvar 초기화 필요시 처리를 위해 초기화 값을 보관함
			if (typeof strFunction != "undefined" && strFunction && screenWindow.ngmf._getCallBackFunction(strFunction)) {
            	//strArg 설정
				if (typeof strArg != "undefined" && strArg) {
					screenWindow.ngmf._setOnloadArg();
//	           		if (ngmf.isString(strArg))  strArg = ngmf._extractData(strArg);
//	                if (ngmf.isJSON(strArg)) for (var ai in strArg) screenWindow["scvar"][ai] = strArg[ai];
	           	}
				screenWindow.ngmf._runOnloadInitfunction();
			} else {
				//scvar 초기화
				if (screenWindow && screenWindow["scvar"]) {					
					var wobj = screenWindow["scvar"]["$w"];
					var initStr = screenWindow["scvar"]["initscvarStr"];
					if (wobj) screenWindow["scvar"] = {"$w" : wobj};
					if ( initStr && initStr != "{}")  {
						var initScvar = JSON.parse(initStr); 
						for (var ai in initScvar) screenWindow["scvar"][ai] = initScvar[ai];
					}
					if (typeof strArg != "undefined" && strArg) {
						screenWindow.ngmf._setOnloadArg();
						//strArg Key가 호출시 마다 바뀔경우 계속 누적됨
//						if (ngmf.isString(strArg))  strArg = ngmf._extractData(strArg);
//						if (ngmf.isJSON(strArg)) for (var ai in strArg) screenWindow["scvar"][ai] = strArg[ai];
					}
					// 리로드에서는 OnLoadCompleted 호출 안함 2016.07.08
					//screenWindow.ngmf._executeOnLoadCompleted();
				}
			}
			return true;
		} return false; 
	} catch(e) {
		ngmf._error("[ngmf._reloadNew] Exception :: ", e);
	}
	return false;
};

ngmf._getScvarStr = function () {
	var tmpscvar = null;
	try{
		
		 for (var ai in scvar) 
			 if (typeof  ai != "object" && "$w" != ai) {
				 if (tmpscvar == null) tmpscvar = {};
				 tmpscvar[ai] = scvar[ai]; 
			 }
		 if (tmpscvar != null)  return JSON.stringify(tmpscvar);
		 else return null;
	} catch(e) {
		return null;
		ngmf._error("[ngmf._getScvarStr] Exception :: ", e);
	} finally {
		//tmpscvar = null;
	} 
};



/**
 * 메인화면의 ICON클릭시 입력한 URL을 사용하여 POPUP을 오픈하는 API
 * @date 2016-03-24
 * @memberOf ngmf
 * @param {String} popupId :: I :: N ::  :: 팝업창의 ID
 * @param {String} url     :: I :: N ::  :: 팝업창에서 로드할 화며의 URL
 * @param {Object} options :: I :: Y ::  :: poup창 파라미터 Object.
 *                 options.title : 팝업창의 제목.
 *                 options.type : 팝업형태 ("window" : 윈도우 팝업, "litewindow" :레이어 팝업), 미설정시 기본은 레이어 팝업.
 *                 options.width : 팝업창 넓이
 *                 options.height : 팝업창 높이
 *                 options.top : 팝업창 Position(top)
 *                 options.left : 팝업창 Position(left)
 *                 options.scrollbars : 팝업창 스크롤 생성 여부.
 *                 options.resizable : 팝업창 사이즈 수정 허용 여부.
 *                 options.modal : modal 여부
 *                 options.fullModal : 전체화면 modal 여부
 *                 options.popupParam : 팝업 창에 전달할 파라미터
 *                 options.popupParam.closeCallBackFncName : 팝업 창이 닫힐 때 호출되는 콜백 함수.
 * @param {String} parentScreen :: I :: N ::  :: 부모창 스크린명
 * @param {Boolean} modal       :: I :: Y ::  :: 모달팝업 여부
 * @author 조지용
 * @example ngmf._openMainIconPopup("popupId", "EDU/xml/prm_popup1.xml", options);
 * @exampleAsIs
 * @useMobile use
 */
ngmf._openMainIconPopup =  function (id, url, options, parentScreen, modal) {
	try{
		var width = parseInt(options.width) || 400;
		var height = parseInt(options.height) || 400;

		var left = parseInt(options.left) || -1;
		var top = parseInt(options.top) || -1;
		var param = options.xml;
		var screenId = parentScreen.replace("__popup_formId__", "");
		if (typeof param !== "undefined" && param !== "" && typeof param !== "string") {
			param = ngmf.serialize(options.xml);
		} else if (typeof param == "undefined") {
			param = "";
		}

		if (top == -1) {
			var fullheight = $(document.body).outerHeight();
			var fltTop = (fullheight/2 - height/2);
			var popupTop = 0;
			
//			if (typeof window !== "undefined") {
//				popupTop = window.screenTop;
//			}
			top = fltTop + popupTop;
		}
		if (left == -1) {
			var fullWidth = $(document.body).outerWidth();
	        var fltLeft = fullWidth/2 - width/2;
	        var popupleft = 0;
	        
//			if (typeof window !== "undefined") {
//				popupleft = window.screenLeft;
//			}
	        left = fltLeft + popupleft;

		}
		requires("uiplugin.popup");
		var popupOptions = {
			id : id,
			type : options.type || "litewindow",
			width : width  +"px",
			height : (height + 45) +"px",
			top : top,
			left : left,
			popupName : options.title || " ",
			//modal : options.modal || false,
			modal : false,
			useIFrame : options.useIFrame || false,
			style : "",
			resizable : options.resizable || false,
			status : false,
			menubar : false,
			scrollbars : options.scrollbars || false,
			closeAction : "ngmf._closeMainIconPopup",
			xml : param,
			srcData : "",
			destData : "",
		};
		
		//팝업 우측상단 기본버튼
		popupOptions.buttonInfo = {
						"alignment" : "left",
						"buttons" : [
							//{"value" : "btn_related", "clickAction" : "ngmf._popActRelatedMenu"},//연관버튼  //2016.06.27 연관메뉴 화면별 정의하기로 변경 
							{"value" : "btn_quick1", "clickAction" : "ngmf._popActCustRegist"}, //고객인증
							{"value" : "btn_quick2", "clickAction" : "ngmf._popActRefresh"}, //리프레쉬
							{"value" : "btn_quick3", "clickAction" : "ngmf._popActHelp"} //HELP
						]};
		
		if (typeof GLV.G_POPUPZ_INDEX == "undefined") {
			GLV.G_POPUPZ_INDEX = 8000;
		}

		if (GLV.G_POPUPZ_INDEX > 9000) {
			GLV.G_POPUPZ_INDEX = 9000;
		}

		if ( GLV.G_POPUPZ_INDEX <= WebSquare.uiplugin.popup._zIndex) {
			GLV.G_POPUPZ_INDEX = WebSquare.uiplugin.popup._zIndex + 1;
		}

		//modal 팝업 여부
		if(modal) {
			var isDiv = (($("#"+popupOptions.id+"_modal").length > 0) ? true : false);
			if (!isDiv) {
				var modalDiv = document.createElement("div");
				modalDiv.setAttribute("id", popupOptions.id+"_modal");
				modalDiv.setAttribute("style", "z-index:"+  GLV.G_POPUPZ_INDEX++ +";width:100%;height:100%;top:0;left:0;position:absolute;background-color: #000; opacity: .5;  filter: alpha(opacity=50);");
				document.body.appendChild(modalDiv);
			}
		}

		WebSquare.util.openPopup( url, popupOptions, scvar.__screenName || ngmf.getFormID());
		WebSquare.uiplugin.popup._zIndex = GLV.G_POPUPZ_INDEX;
		ngmf.object(id).setStyle("z-index", GLV.G_POPUPZ_INDEX++);
	} catch (e) {
		ngmf._error("[ngmf.openMainPopup] Exception :: ", e);
	}
};

/**
 * 메인화면의 ICON클릭시 오픈한 팝업을 닫기 시, 현재까지 작업 데이터 변환 후 닫기수행하는 API
 * @date 2016-03-23
 * @memberOf ngmf
 * @param {String} popupId :: I :: N ::  :: 팝업ID
 * @author 조지용
 * @example ngmf._closeMainIconPopup(popupId);
 * @exampleAsIs
 * @useMobile use
 */
ngmf._closeMainIconPopup = function(popupId) {
	try{
		//팝업 닫기 시, 현재까지 작업 데이터 변환 후 닫기수행.
		if($(this)[0] && $(this)[0].render && $(this)[0].render.getElementsByTagName("iframe")[0].contentWindow.document.activeElement) {
			$(this)[0].render.getElementsByTagName("iframe")[0].contentWindow.document.activeElement.blur();
		}
		
		var popupWindow = GLD.window;
		var formId = popupWindow.scvar.__screenName;
		var openedWin = WebSquare.util.getPopupWindow(popupId);

		function _fn_callActivate ( cWin, pWin ) {
			if ( pWin.WebSquare && pWin.WebSquare.callCommonActivate){
				if(pWin.WebSquare.callCommonActivate != "Y" ) {
					cWin.scwin.commonActivate(popupId);
				}
				pWin.WebSquare.callCommonActivate = null;
			} else {
				cWin.scwin.commonActivate(popupId);
			}
		}

		try {
			if (openedWin) {
				// X 버튼 클릭시
				if(openedWin.scwin && typeof openedWin.scwin.commonCloseForm == "function") {
					if (openedWin.scwin.commonCloseForm() === false) return false;
				}
				
				var popupObj = openedWin.ngmf.popupParam();
				if (popupObj){
					var callBackWindow = popupObj["parentForm"];
					if (callBackWindow && callBackWindow.scwin && callBackWindow.scwin.commonActivate && typeof callBackWindow.scwin.commonActivate == "function" ) {
						WebSquare.core.setTimer(_fn_callActivate  , {
							 key: "__callActivate__",
							 caller: this,
							 delay: 500,
							 args: [callBackWindow,popupWindow]
						});
					}

					if(callBackWindow && popupObj.callbackFunc && popupObj.callbackFunc.startsWith("__ngmf_callback__")) {
						var func = callBackWindow.ngmf._removeCallbackFunc(popupObj.callbackFunc);
						if (func && func.isPromiseCallback) {
							if (func.isLov) {
								if (typeof openedWin.scvar.selectLovRtnObj != "undefined" &&
									 openedWin.scvar.selectLovRtnObj.length > 0) {
									func(openedWin.scvar.uniqueKey, openedWin.scvar.selectLovRtnObj);
								} else {
									func(openedWin.scvar.uniqueKey, "");	
								}
							} else {
								func("", popupObj.popupID);
							}
						}
						
					}
					
					
				}
			} else if( WebSquare && WebSquare.callCommonActivate ) {
				WebSquare.callCommonActivate = null;
			}
		} catch (e) {
			ngmf._error("[ngmf._closeMainIconPopup] Exception :: ", e);
		}

		//팝업 닫기 및 모달레이어 z-index 변경
		if (document.getElementById(popupId+"_modal") !== null) {
			$("#"+popupId+"_modal").remove();
		} else if (document.getElementById(formId+"_modal") !== null){
			$("#"+formId+"_modal").remove();
		}

		if ( $(".w2popup_window").length  < 2) {
			GLV.G_POPUPZ_INDEX = 8000;
			if(WebSquare.uiplugin.popup){
				WebSquare.uiplugin.popup._zIndex = -1;
			}
		}
		return true;
	} catch (e) {
		ngmf._error("[ngmf._closeMainIconPopup] Exception :: ", e);
	}
};

/**
 * 메인화면의 ICON클릭시 오픈한 팝업을 닫기 시 콜백을 처리하기 위해 실행하는 API 입니다.
 * @date 2016-03-24
 * @memberOf ngmf
 * @param {String} popupId  :: I :: N ::  :: 팝업 ID
 * @param {String} popupObj :: I :: Y ::  :: 팝업 객체
 * @param {String} rtnObj   :: I :: Y ::  :: 리턴 객체
 * @author 조지용
 * @useMobile use
 * @example ngmf.closeMainPopup(popupId, popupObj, rtnObj);
 * @exampleAsIs ClosePopup(RetVar);
 */
ngmf.closeMainPopup = function (popupId, popupObj, rtnObj) {
	try{
		requires("uiplugin.popup");
		
		if (typeof popupObj == "undefined") {
			var popupObjTmp = ngmf.popupParam();
			if(popupObjTmp && typeof popupObjTmp.callbackFunc == "string" && popupObjTmp.callbackFunc.startsWith("__ngmf_callback__promise__")) {
				popupObj = popupObjTmp;
			}
		}
		
		if (typeof popupObj == "undefined") { 
			window.WebSquare.util.closePopup(popupId);
			return;
		} else {
			//팝업을 호출한 부모창의 window.(중요)
			var callBackWindow = top.window;
			if (typeof callBackWindow == "undefined") {
				throw popupObj.parentScreen + " :: widnow 존재하지 않습니다.";
			} else {
				callBackWindow.ngmf._closePopupSelfWindow(popupId, popupObj, rtnObj);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.closeMainPopup] Exception :: ", e);
	}
};

/**
 * 팝업화면을 동적으로 resize 하는 API. (단, 팝업화면 내에서 사용가능)
 * @date 2016.03.19
 * @memberOf ngmf
 * @param {Obejct} options        :: I :: N ::     :: 팝업화면 resize 설정값.
 * 		  {Number} options.width  :: I :: N ::     :: 팝업화면 resize 너비 값.
 * 		  {Number} options.height :: I :: N ::     :: 팝업화면 resize 높이 값.
 * 		  {Number} options.isMove :: I :: Y ::false:: 팝업화면 위치 수정 여부.
 * 		  {Number} options.top    :: I :: Y ::     :: 팝업화면의 위치 수정이 true 일경우 top 위치 실정.
 * 		  {Number} options.left   :: I :: Y ::     :: 팝업화면의 위치 수정이 true 일경우 left 위치 실정.
 * @author 이동규
 * @update 2016.06.13 이동규 팝업창의 hidden 처리 파라메터 추가(closePopup관련 작업.)
 * @update 2016.07.22 성일호 options.isMove 옵션 적용 오류
 * @update 2016.09.09 조지용 ngmf.resizePopup : 모바일인 경우 width, heigth가 모바일의 사이즈를 넘지 않도록 수정
 * @useMobile use
 * @example var options = { width : 400, height : 300, isMove : true, top : 100, left : 100}
 * @example ngmf.resizePopup(options); 
 */
ngmf.resizePopup = function(options, hidden) {
	try {
		var result = 0;
		var hiddenFlag = WebSquare.util.getBoolean(hidden);
		var isPopup = ngmf.isPopup();
		var popParam = null;
		var parentWindow = null;
		if (isPopup) {
			popParam = ngmf.popupParam();
			parentWindow = popParam["parentObj"];
			try {
		   		var popupLayer = parent.WebSquare.util.getPopup(popParam.popupID);
			} catch(domE) {
				ngmf._error("[ngmf.resizePopup] Not popup :: ", e);
			}
	   		var tmpHeight;
	   		var tmpWidth;
	   		var width  = options.width;
	   		var height = options.height;
	   		var isMove = options.isMove;
	   		var top    = (typeof options.top != "undefined" && !isNaN(Number(options.top)) && Number(options.top) > -1 ) ? options.top : -1; 
	   		var left   = (typeof options.left != "undefined" && !isNaN(Number(options.left)) && Number(options.left) > -1 ) ? options.left : -1; 
	   		

	   		if (typeof popupLayer != "undefined" && popupLayer.popupWin && popupLayer.popupWin.getPluginName() == "window") {
	   			if (WebSquare.util.getBoolean(isMove)) {
					var scrollTop = 0;
					var scrollLeft = 0;
	   				if (parent.document && $(parent.document.body).scrollTop() > 0) {
						scrollTop = $(parent.document.body).scrollTop();
					}		
	   				if (parent.document && $(parent.document.body).scrollLeft() > 0) {
						scrollLeft = $(parent.document.body).scrollLeft();
					}	

					if (top < 0) {
						var fullheight = $(parent.document.body).outerHeight();
						var fltTop = (fullheight/2 - height/2);
						var popupTop = 0;
						top = Number(fltTop + popupTop + scrollTop);
					}
					if (left < 0) {
						var fullWidth = $(parent.document.body).outerWidth();
				        var fltLeft = fullWidth/2 - width/2;
				        var popupleft = 0;
				        left = Number(fltLeft + popupleft + scrollLeft);
					}

					if (!isNaN(top) && top > -1 && !isNaN(left) && left > -1) {
						if (hiddenFlag) {
							parent.$("#"+popupLayer.id).css("top", 0);
			   				parent.$("#"+popupLayer.id).css("left", 0);
			   				parent.$("#"+popupLayer.id).css("overflow", "hidden");
						} else {
							parent.$("#"+popupLayer.id).css("top", top);
			   				parent.$("#"+popupLayer.id).css("left", left);
			   				result = 1;
						}
					}
				} 

	   			if (typeof width != "undefined" && width > -1) {
					tmpWidth = Number(width);
					
					if(ngmf.isMobile()){
						tmpWidth = (tmpWidth == 1420) ? $(parent.document.body).outerWidth() - 10 : tmpWidth; 
						tmpWidth = Math.min(tmpWidth, $(parent.document.body).outerWidth());
					}
					
					if (!hiddenFlag)
						ngmf._debug("popupWidth changes mata_height("+ tmpWidth + "px).");
				} else {
					tmpWidth = Number(window.getComputedStyle(parent.$("#"+popupLayer.id)[0]).width.replace("px",""));
					if (!hiddenFlag)
						ngmf._debug("popupWidth changes mata_height("+ tmpWidth + "px).");
				}

	   			if (typeof height != "undefined" && height > -1) {
					tmpHeight = Number(height);
					if (tmpHeight > 890) tmpHeight = 890;
					
					if(ngmf.isMobile()){
						tmpHeight = Math.min(tmpHeight, $(parent.document.body).outerHeight());
					}
					if (!hiddenFlag)
						ngmf._debug("popupHeight changes mata_height("+ tmpHeight + "px).");
				} else {
					tmpHeight = Number(window.getComputedStyle(parent.$("#"+popupLayer.id)[0]).height.replace("px",""));
					if (!hiddenFlag)
						ngmf._debug("popupHeight changes mata_height("+ tmpHeight + "px).");
				}

				if (!isNaN(tmpWidth) && tmpWidth > -1 && !isNaN(tmpHeight) && tmpHeight > -1) {
					if (hiddenFlag) {
						parent.$("#"+popupLayer.id).css("width", 0);
		   				parent.$("#"+popupLayer.id).css("height", 0);
		   				parent.$("#"+popupLayer.id).css("overflow", "hidden");
					} else {
						parent.$("#"+popupLayer.id).css("width", tmpWidth);
		   				parent.$("#"+popupLayer.id).css("height", tmpHeight);
		   				parent.$("#"+popupLayer.id).css("overflow", "hidden");
						result = 1;
					}
				}
				/*
				//if (!WebSquare.util.getBoolean(isMove)) {
				if (WebSquare.util.getBoolean(isMove)) {
					var fullheight = $(parent.document.body).outerHeight();
					var fltTop = (fullheight/2 - tmpHeight/2);
					top = Number(fltTop);

					var fullWidth = $(parent.document.body).outerWidth();
			        var fltLeft = fullWidth/2 - tmpWidth/2;
			        left = Number(fltLeft);

					if (!isNaN(top) && top > -1 && !isNaN(left) && left > -1) {
						if (hiddenFlag) {
							parent.$("#"+popupLayer.id).css("top", 0);
			   				parent.$("#"+popupLayer.id).css("left", 0);
			   				parent.$("#"+popupLayer.id).css("overflow", "hidden");
			   			} else {
			   				parent.$("#"+popupLayer.id).css("top", top);
			   				parent.$("#"+popupLayer.id).css("left", left);
			   				result = 1;
			   			}
					}
				}
				*/
	   		}
		}
		return result;
	} catch(e) {
		ngmf._error("[ngmf.resizePopup] Exception :: ", e);
	}
};

/**
 * 화면별 연관프로그램 그룹ID 변경
 * @date 2016-03-28
 * @memberOf ngmf
 * @param {String} pgmGroupId  :: I :: N ::  :: 연관프로그램 그룹ID
 * @author 성일호
 * @useMobile use
 * @example ngmf.setRelmenuGroupId ("1"); 
 */
ngmf.setRelmenuGroupId = function (pgmGroupId) {
	try{
		if (typeof pgmGroupId == "undefined" || pgmGroupId == null) return;
		scvar["relativeBtnRefresh"] = true;
		scvar["cnnt_pgm_grp_id"] = pgmGroupId; 
	} catch (e) {
		ngmf._error("[ngmf.setRelmenuGroupId] Exception :: ", e);
	}
};

ngmf._getSeletedTab = function() {
	return  ngmf.mdiTabs().getID();
};

/**
 * extMessageBox confime 메세지 박스.
 * @date 2016-03-29
 * @memberOf ngmf
 * @param {Object} obj  :: I :: N ::  :: 객체 this(사용 미확인.)
 * @param {String} msg  :: I :: N ::  :: 메세지
 * @author 이동규
 * @useMobile use
 * @example ngmf.extMessageBox(this, "사용자 메세지"); 
 * @exampleAsIs ngmf_ExtMessageBox(this, "사용자 메세지"); 
 */
 /*
ngmf.extMessageBox = function(obj, msg) {
	try {
		if(ngmf.confirm(msg)) {
			return 1;
		} else {
			return 0;
		}
	} catch(e) {
		ngmf._error("[ngmf.extMessageBox] Exception :: ", e);
	}
};
*/

/**
 * truncate 소수점 자릿수를 자르는 API.
 * @date 2016-03-29
 * @memberOf ngmf
 * @param {Number} num  :: I :: N ::  :: number 데이터.
 * @param {Number} fix  :: I :: N ::  :: 소수점 고정자릿수 (default : 0)
 * @author 이동규
 * @update 2016.07.04 이동규 정수값이 들어올 경우 fixed만큰 소수점 "0" 값을 표기.[pms : 2353]
 * @return {string} 반환 String 값.
 * @useMobile use
 * @example ngmf.truncate(123.456, 2); // return "123.45"
 * @example ngmf.truncate(123.456, 5); // return "123.45600"
 * @exampleAsIs Truncate(123.456, 2); 
 */
ngmf.truncate =function(num, fix) {
	try {
		if(isNaN(Number(num))) {
			return 0;
		} else {
			var fixed = (typeof fix == "undefined") ? 0 : parseInt(fix, 10);
			if (isNaN(fixed)) {
				return 0;
			} else {
				var reg = /^[-|+]?\d+\.?\d*$/;
				if (reg.test(num)) {
					if(typeof num == "number") {
						num = num.toString();
					}
					var intVal = num.split(".")[0];
					var decimal = num.split(".")[1];
					if (typeof decimal != "undefined" && fixed > 0) {
						if (decimal.length > fixed) {
							decimal = decimal.slice(0, fixed);
						} else {
							var len = fixed - decimal.length;
							for (var i = 0; i < len; i++) {
								decimal += "0";
							}
						}
						return intVal + "." + decimal;
					} else if (fixed == 0) {
						return intVal;
					} else if (typeof decimal == "undefined" && fixed > 0 ) {
						var decimal = "";
						for (var i = 0; i < fixed ; i++) {
							decimal += "0";
						}
						return intVal + "." + decimal;
					}
				} else {
					return 0;
				}
			}
		}
	} catch(e) {
		ngmf._error("[ngmf.truncate] Exception :: ", e);
	}		
};

/**
 * 모바일일때 화면 스케일변경 API.
 * @date 2016-03-30
 * @memberOf ngmf
 * @author 김형태
 * @useMobile use
 * @example customScaleThisScreen2(); 
 */
ngmf.customScaleThisScreen2 = function() {
    if( window.location !== window.parent.location ){
	     parent.window._preZoom = parent.window.document.body.zoom;
	     parent.window.document.body.zoom = 1;
	     document.body.style.webkitTransform = 'scale(1)';
	     document.body.style.webkitTransformOrigin = '0 0'; 
	     
	     var minWidth = $("body").css("min-width");
			minWidth = minWidth.replace("px","") - 0;
	     
	         var contentWidth = document.body.scrollWidth; 
	         var windowWidth = 0; 
	     if ( WebSquare.core.browserCheck.android ) {
	      windowWidth = window.innerWidth;
	     } else {
	      windowWidth = parent.window.innerWidth;
	     } 
	     var newScale = windowWidth / contentWidth;
	     document.body.style.webkitTransform = 'scale('+newScale+')';
	    }else{
	     document.body.style.webkitTransformOrigin = '0 0';
	     
	     var minWidth = $("body").css("min-width");
	 		minWidth = minWidth.replace("px","") - 0;
	     
	     var contentWidth = document.body.scrollWidth;
	     contentWidth = contentWidth > minWidth ? contentWidth : minWidth;
	     var windowWidth = window.innerWidth;
	     var newScale = windowWidth / contentWidth;
	     document.body.style.webkitTransform = "scale("+newScale+")"; 
    }
};

/**
 * 모바일일때 화면 스케일변경함수호출 API.
 * @date 2016-03-30
 * @memberOf ngmf
 * @author 김형태
 * @useMobile use
 * @example customScaleThisScreen(); 
 */
ngmf.callMobileScale = function() {
	window.addEventListener('load', function(){
	       document.body.style.height = (document.documentElement.clientHeight + 5) + 'px';
	       window.scrollTo(0, 1);
	   }, false);
	
	setTimeout(customScaleThisScreen,500);
	window.addEventListener('orientationchange',function(){setTimeout(customScaleThisScreen,500);},false);	
};



/* 9. 2016-03-31 신규 API 추가  -------------------------------------------------------------------------------------------------------------- */
/**
 * Component를 담고있는 부모객체를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} targetId :: I :: N ::  :: 대상 컴포넌트 ID
 * @return {Object} Component를 담고있는 부모객체
 * @author 조지용
 * @useMobile use
 * @example ngmf.getForm();
 * @exampleAsIs Division.GetForm();
 */
ngmf.getForm = function(targetId){
	try{
		var targetObj = ngmf.object(targetId);
		var parent = targetObj ? targetObj.parentControl : null;
		return parent;
	} catch (e) {
		ngmf._error("[ngmf.getForm] Exception :: ", e);
	}
};

/**
 * Dataset에서 해당 레코드들의 위치를 바꾸는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @param {Integer} nRow              :: I :: N ::  :: 레코드 위치를 변경할 Record Index
 * @param {Integer} nRow1             :: I :: N ::  :: 레코드 위치를 변경할 Record Index
 * @author 조지용
 * @useMobile use
 * @example ngmf.exChangeRow("dst_msg", 2, 4);
 * @exampleAsIs ds.ExChangeRow(nRow,nRow1);
 */
ngmf.exChangeRow = function(dataSetId, nRow, nRow1){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}

		var first = dataSetObj.getRowJSON(nRow);
		var second = dataSetObj.getRowJSON(nRow1);
		
		var firstRowStatus  = dataSetObj.getRowStatus(nRow);
		var secondRowStatus = dataSetObj.getRowStatus(nRow1)

		//datset이벤트 설정(onloaddata 등)
		dataSetObj.setEventPause(null, true);
		
		dataSetObj.setRowJSON(nRow1,first,true);
		dataSetObj.setRowJSON(nRow,second,true);
		
		//rowStatus 복사
		dataSetObj.modifyRowStatus(nRow1, firstRowStatus);
		dataSetObj.modifyRowStatus(nRow, secondRowStatus);
		
		//datset이벤트 설정(onloaddata 등)
		dataSetObj.setEventPause(null, false);
		
		//datset이벤트 ondataload() 실행
		WebSquare.event.fireEvent(dataSetObj, 'ondataload');
	} catch (e) {
		ngmf._error("[ngmf.exChangeRow] Exception :: ", e);
	}
};

/**
 * Filter된 데이타를 포함한 Dataset의 해당 범위안에서 조건식에 맞는 Record의 개수를 가져오는 API 입니다.(ngmf.caseCountNF와 동일)
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strCmpExpr         :: I :: Y ::          :: Record를 추출하기 위한 조건문
 * @param {Integer / String} nStart   :: I :: Y :: 0        :: 조건식을 적용할 시작 Record Index
 * @param {Integer / String} nCnt     :: I :: Y :: rowCount :: 검색할 Record 갯수
 * @return {Integer} 조건에 맞는 Record 갯수
 * @author 조지용
 * @useMobile use
 * @example ngmf.totalCaseCount("dst_msg", "msg_typ_cd=='E'", 0);
 * @exampleAsIs DsSample.TotalCaseCount("DS_NUM%2==0",0,5);
 */
ngmf.totalCaseCount = function(targetId, strCmpExpr, nStart, nCnt){
	try{
		return ngmf.caseCountNF(targetId, strCmpExpr, nStart, nCnt);
	} catch (e) {
		ngmf._error("[ngmf.totalCaseCount] Exception :: ", e);
	}
};

/**
 * Filter된 데이타를 포함한 Dataset의 해당 범위안에서 조건식에 맞는 Record의 개수를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {Integer} strCmpExpr        :: I :: Y ::          :: Record를 추출하기 위한 조건문
 * @param {Integer / String} nStart   :: I :: Y :: 0        :: 조건식을 적용할 시작 Record Index
 * @param {Integer / String} nCnt     :: I :: Y :: rowCount :: 검색할 Record 갯수
 * @return {Integer} 조건에 맞는 Record 갯수
 * @author 조지용
 * @useMobile use
 * @example ngmf.totalCaseCount("dst_msg", "msg_typ_cd=='E'", 0);
 * @exampleAsIs DsSample.CaseCountNF("DS_NUM%2==0",0,5);
 */
ngmf.caseCountNF = function(dataSetId, strCmpExpr, nStart, nCnt){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var dataArr =[];
 		var rowCount = 0;
 		var retValue = 0;

 		nStart = (typeof nStart === "undefined" || nStart == null || nStart === "") ? 0 : ngmf.toInteger(nStart);
 		nCnt   = (typeof nCnt === "undefined" || nCnt == null || nCnt === "") ? dataSetObj.getTotalRow() : nStart + ngmf.toInteger(nCnt);

 		var list = dataSetObj.cellIdList;
 		for( var i = 0; i < list.length; i++ ){
 			if( strCmpExpr.indexOf( list[i] ) > -1 ) {
 				var data = dataSetObj.getColData( list[i] );
 				for( var j = nStart; j<nCnt; j++ ){
 					var obfuscator_expr = strCmpExpr.replace(list[i], ngmf.quote(data[j]));
 					if( eval(obfuscator_expr) ) {
 						rowCount++;
 					}
 				}
 			}
		}

		return rowCount;
	} catch (e) {
		ngmf._error("[ngmf.caseCountNF] Exception :: ", e);
	}
};

/**
 * Filter된 Record를 포함하는 Dataset의 해당 범위안에서 조건에 맞는 Record를 추출한 후, 계산식을 적용해서 Record들의 합계를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strCmpExpr         :: I :: N ::          :: Record를 추출하기 위한 조건문
 * @param {String} strValExpr         :: I :: N ::          :: 추출된 레코드에 적용할 계산식
 * @param {Integer / String} nStart   :: I :: Y :: 0        :: 합계를 구하고자 하는 시작 Record Index
 * @param {Integer / String} nCnt     :: I :: Y :: rowCount :: 합계를 구할 Record 갯수
 * @return {Integer} 조건에 맞는 Column 값들의 합계
 * @author 조지용
 * @useMobile use
 * @example ngmf.totalCaseSum("dsl_dataList", "col1=='test1'", "col2");
 * @exampleAsIs Ds_a.TotalCaseSum("DS_NUM%2==0","DS_MONEY",0,8);
 */
ngmf.totalCaseSum = function(dataSetId, strCmpExpr, strValExpr, nStart, nCnt){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var dataArr =[];
 		var caseSum = 0;

 		nStart = (typeof nStart === "undefined" || nStart == null || nStart === "") ? 0 : ngmf.toInteger(nStart);
 		nCnt   = (typeof nCnt === "undefined" || nCnt == null || nCnt === "") ? dataSetObj.getTotalRow() : nStart + ngmf.toInteger(nCnt);

 		if( strValExpr.indexOf("expr:") > -1 ) {

 		} else {
 			var colID = (typeof strValExpr == "number") ? dataSetObj.getColumnID(strValExpr) : strValExpr;
	 		var dataValue;
	 		var dataType = dataSetObj.getColumnOption(colID,"dataType");
	 		var list = dataSetObj.cellIdList;

	 		for( var i = 0; i < list.length; i++ ){
	 			if( strCmpExpr.indexOf( list[i] ) > -1 ) {
	 				var data = dataSetObj.getColData( list[i] );
	 				for( var j = nStart; j<nCnt; j++ ){
	 					var obfuscator_expr = strCmpExpr.replace(list[i],ngmf.quote(data[j]));
	 					if( eval(obfuscator_expr) ) {
	 						if( dataType === "bigDecimal" ) {
	 							dataValue = WebSquare.bigDecimal(dataSetObj._getOriginalCellData(i , colID));
	 							(typeof dataValue == "undefined" || dataValue == "") ? dataValue = "0" : dataArr.push(dataValue);
	 						} else {
	 							dataValue = dataSetObj._getOriginalCellData(j , colID);
	 							(typeof dataValue == "undefined" || dataValue == "")  ? dataValue = "0" : dataArr.push(dataValue);
	 						}
	 					}
	 				}
	 			}
 			}

			if( dataType === "bigDecimal") {
				caseSum = "0";
				for( var i in dataArr ){
					caseSum = WebSquare.bigDecimal(caseSum).plus(dataArr[i]);
				}
			} else if( dataArr.length > 0 ) {
				for( var i=0; i<dataArr.length; i++ ){
					caseSum += (dataArr[i]-0);
				}
			}
 		
			return caseSum;
 		}
	} catch (e) {
		ngmf._error("[ngmf.totalCaseSum] Exception :: ", e);
	}
};

/**
 * OrginBuffer의 Record 개수를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @return {Integer} Record의 RowLevel 값
 * @author 조지용
 * @useMobile use
 * @example ngmf.getORgBuffCount("dst_msg");
 * @exampleAsIs Dataset.GetORgBuffCount();
 */
ngmf.getORgBuffCount = function(dataSetId){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var OrgbuffArr = dataSetObj.getModifiedJSON({saveRemovedData:true});
		return OrgbuffArr.length;
	} catch (e) {
		ngmf._error("[ngmf.getORgBuffCount] Exception :: ", e);
	}
};

/**
 * Filter된 레코드를 포함한 Dataset에서 요청한 Record 범위에 대해 Column ID의 값에 대한 합계나 Record 별 수식 수행 결과에 대한 합계를 가져오는 API 입니다.(ngmf.sumNF와 동일)
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID           :: I :: N ::          :: 합계를 구할 Column ID 또는 레코드별로 수행될 수식
 * @param {String} strExpr            :: I :: Y ::          :: 
 * @param {Integer / String} nStart   :: I :: Y :: 0        :: 합계를 구하고자 하는 시작 Record Index
 * @param {Integer / String} nCnt     :: I :: Y :: rowCount :: 합계를 구할 Record 갯수
 * @return {Integer} 구해진 합계
 * @author 조지용
 * @useMobile use
 * @example ngmf.totalSum("dsl_dataList", "col2", "", 0, 8);
 * @exampleAsIs DsSample.SumNF("DS_MONEY",0,8);
 */
ngmf.totalSum = function(dataSetId, strColID, nStart, nCnt){
	try{
		return ngmf.sumNF(dataSetId, strColID, nStart, nCnt);
	} catch (e) {
		ngmf._error("[ngmf.totalSum] Exception :: ", e);
	}
};

/**
 * Dataset에 존재하는 첫번째 Record Index을 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @return {Integer} 현재 DataSet의 첫 번째 Record Index
 * @author 조지용
 * @useMobile use
 * @example ngmf.getFirstRow("dsl_dataList");
 * @exampleAsIs Dataset.GetFirstRow();
 */
ngmf.getFirstRow = function(dataSetId){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		return (typeof dataSetObj.filteredRowIndexArr[0] == "undefined") ?  -1 : dataSetObj.filteredRowIndexArr[0];
	} catch (e) {
		ngmf._error("[ngmf.getFirstRow] Exception :: ", e);
	}
};

/**
 * 해당 범위안에서 조건에 맞는 Record를 추출한 후, 계산식을 적용해 Record들의 최소값을 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strCmpExpr         :: I :: N ::          :: 최소값을 구할 Record를 추출하기 위한 조건문
 * @param {String} strValExpr         :: I :: N ::          :: 추출된 레코드에 적용할 계산식 또는 컬럼ID
 * @param {Integer / String} nStart   :: I :: Y :: 0        :: 최소값을 구할 시작 Record Index
 * @param {Integer / String} nCnt     :: I :: Y :: rowCount :: 최소값을 구할 레코드 갯수
 * @return {Integer / String} 조건에 맞는 Column의 값중 최소값
 * @author 조지용
 * @useMobile use
 * @example ngmf.caseMin("dsl_dataList", "col1=='test2'", "col1", 0, 5);
 * @exampleAsIs DsSample.CaseMin("DS_NUM%2==0","DS_MONEY",5,5);
 */
ngmf.caseMin = function(dataSetId, strCmpExpr, strValExpr, nStart, nCnt){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var dataArr =[];
 		var min = null;
 		var retValue = 0;

 		nStart = (typeof nStart === "undefined" || nStart == null || nStart === "") ? 0 : ngmf.toInteger(nStart);
 		nCnt   = (typeof nCnt === "undefined" || nCnt == null || nCnt === "") ? dataSetObj.getTotalRow() : nStart + ngmf.toInteger(nCnt);

 		if( strValExpr.indexOf("expr:") > -1 ) {

 		} else {
 			var colID = typeof strColId == "number" ? dataSetObj.getColumnID(strValExpr) : strValExpr;
	 		var dataValue;
	 		var dataType = dataSetObj.getColumnOption(colID,"dataType");
	 		var list = dataSetObj.cellIdList;

	 		for( var i = 0; i < list.length; i++ ){
	 			if( strCmpExpr.indexOf( list[i] ) > -1 ) {
	 				var data = dataSetObj.getFilteredColData( list[i] );
	 				for( var j = nStart; j<nCnt; j++ ){
	 					var obfuscator_expr = strCmpExpr.replace(list[i], ngmf.quote(data[j]));
	 					if( eval(obfuscator_expr) ) {
	 						if( dataType === "bigDecimal" ) {
	 							dataValue = WebSquare.bigDecimal(dataSetObj.getCellData(i , colID));
	 							(typeof dataValue == "undefined" || dataValue == "") ? dataValue = "0" : dataArr.push(dataValue);
	 						} else {
	 							dataValue = dataSetObj.getCellData(j , colID);
	 							(typeof dataValue == "undefined" || dataValue == "")  ? dataValue = "0" : dataArr.push(dataValue);
	 						}
	 					}
	 				}
	 			}
 			}

			if( dataType === "bigDecimal" ) {
	 			for(var i in dataArr){
					min = (min == null) ? dataArr[i] : min.compare(dataArr[i],true); 
				}
	 		} else if(dataType === "number"){
	 			for( var i=0; i< dataArr.length ; i++){
					var data = parseFloat(dataArr[i] );
					if( !isNaN(data) ){
						if ( min == null || min > data){
							min = data;
						}
					}
				}
	 		} else {
	 			for( var i=0; i< dataArr.length ; i++){
					var data = dataArr[i];
					if ( min == null || min > data){
						min = data;
					}
				}
	 		}
			
			min = (min == null)? "" : min;
			return min;
 		}
	} catch (e) {
		ngmf._error("[ngmf.caseMin] Exception :: ", e);
	}
};

/**
 * Filter된 Dataset의 해당 Record Index가 Filter 되지 않은 Dataset에서 몇번째 Record Index인지 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @param {Integer} nRow              :: I :: N ::  :: Filter 되어 있는 Dataset의 Record Index
 * @return {Integer} Filter 되지 않은 Dataset의 Record Index
 * @author 조지용
 * @useMobile use
 * @example ngmf.getRowIndexNF("dsl_dataList", 2);
 * @exampleAsIs DsSample.GetRowIndexNF(2);
 */
ngmf.getRowIndexNF = function(dataSetId, nRow){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		return dataSetObj.getOriginalRowIndex(nRow);
	} catch (e) {
		ngmf._error("[ngmf.getRowIndexNF] Exception :: ", e);
	}
};

/**
 * Filter된 데이타를 포함한 Dataset에서 조건에 맞는 Record 갯수를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {Integer / String} nStart    :: I :: Y :: 0        :: Dataset의 개수를 가져올 기준 Index
 * @param {Integer / String} nCnt      :: I :: Y :: rowCount :: 얻고자 하는 Record 갯수
 * @return {Integer} Dataset의 레코드 개수
 * @author 조지용
 * @useMobile use
 * @example ngmf.countNF(dst_msg, 10, 9);
 * @exampleAsIs DsSample.CountNF(0,8);
 */
ngmf.countNF = function(dataSetId, nStart, nCnt){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var totalRow = dataSetObj.getTotalRow();
 		nStart = (typeof nStart === "undefined" || nStart == null || nStart === "") ? 0 : nStart;
 		nCnt   = (typeof nCnt === "undefined" || nCnt == null || nCnt === "") ? (totalRow - nStart) : nCnt;
 		
 		return (totalRow >= nStart + nCnt) ? nCnt : (totalRow -  nStart);
 		
	} catch (e) {
		ngmf._error("[ngmf.countNF] Exception :: ", e);
	}
};

/**
 * Dataset에서 요청한 Record 범위에 대해 Column ID의 값에 대한 최소값이나 레코드별 수식 수행 결과에 대한 최소값을 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID            :: I :: N ::          :: 최소값을 구할 Column ID 또는 Record 별로 수행될 수식
 * @param {Integer / String} nStart    :: I :: Y :: 0        :: 최소값을 구하고자 하는 시작 Record Index
 * @param {Integer / String} nCnt      :: I :: Y :: rowCount :: 최소값을 구할 Record 갯수
 * @return {Integer / String} 구해진 최소값
 * @author 조지용
 * @useMobile use
 * @example ngmf.min('dsl_dataList', "col3");
 * @exampleAsIs DsSample.Min("DS_MONEY",2,6);
 */
ngmf.min = function(dataSetId, strColID, nStart, nCnt){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
 		var min = null;
 		var dataArr = [];
 		
 		nStart = (typeof nStart === "undefined" || nStart == null || nStart === "") ? 0 : ngmf.toInteger(nStart);
 		nCnt   = (typeof nCnt === "undefined" || nCnt == null || nCnt === "") ? dataSetObj.getTotalRow() : nStart + ngmf.toInteger(nCnt);

 		if( strColID.indexOf("expr:") > -1 ){

 		} else {
 			var colID = typeof strColId == "number" ? dataSetObj.getColumnID(strColID) : strColID;
	 		var dataValue;
	 		var dataType = dataSetObj.getColumnOption(colID,"dataType");

	 		for(var i=nStart; i<nCnt; i++){
	 			if ( dataType === "bigDecimal" ) {
	 				dataValue = WebSquare.bigDecimal(dataSetObj.getCellData(i , colID));
	 			} else {
	 				dataValue = dataSetObj.getCellData( i , colID );
					dataValue += "";
	 			}

	 			if (typeof dataValue == "undefined" || dataValue == ""){
					dataValue = "0";
				} else{
					dataArr.push(dataValue);
				}
	 		}

	 		if( dataType === "bigDecimal" ) {
	 			for(var i in dataArr){
					min = (min == null) ? dataArr[i] : min.compare(dataArr[i],true); 
				}
	 		} else if(dataType === "number"){
	 			for( var i=0; i< dataArr.length ; i++){
					var data = parseFloat(dataArr[i] );
					if( !isNaN(data) ){
						if ( min == null || min > data){
							min = data;
						}
					}
				}
	 		} else {
	 			for( var i=0; i< dataArr.length ; i++){
					var data = dataArr[i];
					
					if ( min == null || min > data){
						min	= data;
					}
				}
	 		}

			min = (min == null)? "" : min;
			return min;
 		}
	} catch (e) {
		ngmf._error("[ngmf.min] Exception :: ", e);
	}
};

/**
 * Dataset의 현재 선택된 레코드의 이전 Record Index를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::   :: 대상 DataSet 컴포넌트 ID
 * @return {Integer} 현재 선택된 레코드의 이전 Record Index 
 * @author 조지용
 * @useMobile use
 * @example ngmf.getPrevRow('dst_msg');
 * @exampleAsIs Dataset.GetPrevRow();
 */
ngmf.getPrevRow = function(dataSetId){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var arr = dataSetObj.filteredRowIndexArr;
		var index=0;
		for( var i=0; i<arr.length; i++) {
			if( dataSetObj.rowPosition && arr[i] == dataSetObj.rowPosition ) {
				index = (typeof arr[i-1] == "undefined") ?  arr[i] : arr[i-1];
				return index;
			}
		}
		return index;
	} catch (e) {
		ngmf._error("[ngmf.getPrevRow] Exception :: ", e);
	}
};

/**
 * Filter된 Record를 포함한 Dataset에서 요청한 Record 범위에 대해 Column ID의 값에 대한 최대값이나, Record 별 수식 수행 결과에 대한 최대값을 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID            :: I :: N ::          :: 최대값을 구할 Column ID 또는 Record 별로 수행될 수식
 * @param {Integer / String} nStart    :: I :: Y :: 0        :: 최대값을 구하고자 하는 시작 Record Index
 * @param {Integer / String} nCnt      :: I :: Y :: rowCount :: 최대값을 구할 Record 갯수
 * @return {Integer / String} 구해진 최대값
 * @author 조지용
 * @useMobile use
 * @example ngmf.totalMax('dsl_dataList', 'col4', 0, 5);
 * @exampleAsIs DsSample.TotalMax("DS_MONEY",5,5);
 */
ngmf.totalMax = function(dataSetId, strColID, nStart, nCnt){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
 		var max = null;
 		var dataArr = [];
 		
 		nStart = (typeof nStart === "undefined" || nStart == null || nStart === "") ? 0 : ngmf.toInteger(nStart);
 		nCnt   = (typeof nCnt === "undefined" || nCnt == null || nCnt === "") ? dataSetObj.getTotalRow() : nStart + ngmf.toInteger(nCnt);

 		if( strColID.indexOf("expr:") > -1 ) {

 		} else {
 			var colID = typeof strColId == "number" ? dataSetObj.getColumnID(strColID) : strColID;
	 		var dataValue;
	 		var dataType = dataSetObj.getColumnOption(colID,"dataType");

	 		var jsonData = dataSetObj.getAllJSON();	 		
	 		
	 		for( var i=nStart; i<nCnt; i++ ){
	 			if ( dataType === "bigDecimal" ) {
	 				dataValue = WebSquare.bigDecimal(eval("jsonData[i]." + colID));
	 			} else {
	 				dataValue = eval("jsonData[i]." + colID);
					dataValue += "";
	 			}

	 			if ( typeof dataValue == "undefined" || dataValue == "" ) {
					dataValue = "0";
				} else {
					dataArr.push( dataValue );
				}
	 		}

	 		if( dataType === "bigDecimal" ) {
	 			for(var i in dataArr){
					max = (max == null) ? dataArr[i] : max.compare(dataArr[i]); 
				}
	 		} else if(dataType === "number"){
	 			for( var i = 0; i < dataArr.length; i++ ){
					var data = parseFloat(dataArr[i]);
					if( !isNaN(data) ) {
						if ( max == null || max < data ) {
							max = data;
						}
					}
				}
	 		} else {
	 			for( var i = 0; i < dataArr.length; i++ ){
					var data = dataArr[i];
					
					if ( max == null || max < data){
						max	= data;
					}
				}
	 		}
			
			max = (max == null)? "" : max;
			max = WebSquare.util.setPrecision(max);
			return max;
 		}
 	
	} catch (e) {
		ngmf._error("[ngmf.totalMax] Exception :: ", e);
	}
};

/**
 * Filter된 레코드를 포함한 Dataset에서 요청한 Record 범위에 대해 Column ID의 값에 대한 합계나 Record 별 수식 수행 결과에 대한 합계를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID            :: I :: N ::          :: 합계를 구할 Column ID 또는 Record 별로 수행될 수식
 * @param {Integer / String} nStart    :: I :: Y :: 0        :: 합계를 구하고자 하는 시작 Record Index
 * @param {Integer / String} nCnt      :: I :: Y :: rowCount :: 합계를 구할 Record 갯수
 * @return {Integer} 구해진 합계
 * @author 조지용
 * @useMobile use
 * @example ngmf.sumNF('dsl_dataList', 'col2', 3, 3);
 * @exampleAsIs DsSample.SumNF("DS_MONEY",0,8);
 */
ngmf.sumNF = function(dataSetId, strColID, nStart, nCnt){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
 		var sum = 0;
 		var dataArr = [];
 		var retValue = 0;
 		
 		nStart = (typeof nStart === "undefined" || nStart == null || nStart === "") ? 0 : ngmf.toInteger(nStart);
 		nCnt   = (typeof nCnt === "undefined" || nCnt == null || nCnt === "") ? dataSetObj.getTotalRow() : nStart + ngmf.toInteger(nCnt);

 		if( strColID.indexOf("expr:") > -1 ){

 		} else {
 			var colID = typeof strColId == "number" ? dataSetObj.getColumnID(strColID) : strColID;
	 		var dataValue;
	 		var dataType = dataSetObj.getColumnOption(colID,"dataType");
	 		
	 		var jsonData = dataSetObj.getAllJSON();
			
		 	for(var i=nStart; i<nCnt; i++){
		 		if ( dataType === "bigDecimal" ) {
		 			dataValue = WebSquare.bigDecimal(eval("jsonData[i]." + colID));
			 	} else {
	 				dataValue = eval("jsonData[i]." + colID);
					dataValue += "";
	 			}
	
	 			if (typeof dataValue == "undefined" || dataValue == ""){
					dataValue = "0";
				} else{
					dataArr.push(dataValue);
				}
		 	}			
			
			var dataType = dataSetObj.getColumnOption(colID,"dataType");
			if( dataType === "bigDecimal"){
				sum = "0";
				for(var i in dataArr){
					sum = WebSquare.bigDecimal(sum).plus(dataArr[i]);
				}	
				sum = sum.divide(WebSquare.bigDecimal(dataArr.length));
			}else if(dataArr.length > 0 ){
				for(var i=0;i<dataArr.length;i++){
					sum += (dataArr[i]-0);
				}
			}
			return sum;
 		}
	} catch (e) {
		ngmf._error("[ngmf.sumNF] Exception :: ", e);
	}
};

/**
 * 삭제된 Record들 중에서 지정된 Column의 값을 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::   :: 대상 DataSet 컴포넌트 ID
 * @param {Integer / String} nRow      :: I :: N ::   :: 삭제된 Record List의 Record Index
 * @param {Integer / String} strColID  :: I :: N ::   :: 삭제된 Record List에서 값을 가져올 Column ID
 * @return {Integer} Record의 RowLevel 값
 * @author 조지용
 * @useMobile use
 * @example ngmf.getDelColumn('dst_msg', 5, 'msg_typ_cd');
 * @exampleAsIs DsSample.GetDelColumn(0, "DS_MEMBER");
 */
ngmf.getDelColumn = function(dataSetId, nRow, strColID){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var deleteArr = dataSetObj.getDeletedJSON();
		var colId = dataSetObj.getColumnID(strColID);
		var data = null;
		
		//삭제된 Row의 수안에 포함된 nRow이며, Column이 존재하는 경우만 실행
		if ( nRow >= 0 && deleteArr.length > nRow && colId !== null && colId !== ""){
			data = eval("deleteArr[nRow]." + colId);
		}
		
		return data;
	} catch (e) {
		ngmf._error("[ngmf.getDelColumn] Exception :: ", e);
	}
};

/**
 * Filter된 레코드를 포함하는 Dataset의 해당 범위안에서 조건에 맞는 Record를 추출한 후, 계산식을 적용해 Record들의 최대값을 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strCmpExpr          :: I :: N ::          :: 최대값을 구할 Record를 추출하기 위한 조건문
 * @param {String} strValExpr          :: I :: N ::          :: 추출된 레코드에 적용할 계산식 또는 컬럼 ID
 * @param {Integer / String} nStart    :: I :: Y :: 0        :: 최대값을 구할 시작 Record Index
 * @param {Integer / String} nCnt      :: I :: Y :: rowCount :: 최대값을 구할 레코드 갯수
 * @return {Integer / String} 조건에 맞는 Column 값중 최대값
 * @author 조지용
 * @useMobile use
 * @example ngmf.caseMaxNF("dsl_data1", "col1 == 'test1'", 'col2', 1, 1);
 * @exampleAsIs Ds_a.CaseMaxNF("DS_NUM%2==0","DS_MONEY",5,5);
 */
ngmf.caseMaxNF = function(dataSetId, strCmpExpr, strValExpr, nStart, nCnt){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var dataArr =[];
 		var max = null;
 		var retValue = 0;

 		nStart = (typeof nStart === "undefined" || nStart == null || nStart === "") ? 0 : ngmf.toInteger(nStart);
 		nCnt   = (typeof nCnt === "undefined" || nCnt == null || nCnt === "") ? dataSetObj.getTotalRow() : nStart + ngmf.toInteger(nCnt);

 		if( strValExpr.indexOf("expr:") > -1 ) {

 		} else {
 			var colID = typeof strColId == "number" ? dataSetObj.getColumnID(strValExpr) : strValExpr;
	 		var dataValue;
	 		var dataType = dataSetObj.getColumnOption(colID,"dataType");
	 		var list = dataSetObj.cellIdList;
	 		
	 		var jsonData = dataSetObj.getAllJSON();
			
	 		for( var i = 0; i < list.length; i++ ){
	 			if( strCmpExpr.indexOf( list[i] ) > -1 ) {
	 				var data = dataSetObj.getColData( list[i] );
	 				for( var j = nStart; j<nCnt; j++ ){
	 					var obfuscator_expr = strCmpExpr.replace(list[i], ngmf.quote(data[j]));
	 					if( eval(obfuscator_expr) ) {
	 						if( dataType === "bigDecimal" ) {
	 							dataValue = WebSquare.bigDecimal(eval("jsonData[j]." + colID));
	 							(typeof dataValue == "undefined" || dataValue == "") ? dataValue = "0" : dataArr.push(dataValue);
	 						} else {
	 							dataValue = eval("jsonData[j]." + colID);
	 							(typeof dataValue == "undefined" || dataValue == "")  ? dataValue = "0" : dataArr.push(dataValue);
	 						}
	 					}
	 				}
	 			}
 			}

			if( dataType === "bigDecimal" ) {
	 			for(var i in dataArr){
					max = (max == null) ? dataArr[i] : max.compare(dataArr[i]); 
				}
	 		} else if( dataType === "number" ){
	 			for( var i = 0; i < dataArr.length; i++ ){
					var data = parseFloat(dataArr[i]);
					if( !isNaN(data) ) {
						if ( max == null || max < data ) {
							max = data;
						}
					}
				}
	 		} else {
	 			for( var i = 0; i < dataArr.length; i++ ){
	 				var data = dataArr[i];
					if ( max == null || max < data ) {
						max = data;
					}
				}
	 		}
			
			max = (max == null)? "" : max;
			max = WebSquare.util.setPrecision(max);
			return max;
 		}
	} catch (e) {
		ngmf._error("[ngmf.caseMaxNF] Exception :: ", e);
	}
};

/**
 * 삭제된 Record의 갯수를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::   :: 대상 DataSet 컴포넌트 ID
 * @return {Integer} 삭제된 Record의 갯수
 * @author 조지용
 * @useMobile use
 * @example ngmf.getDelRowCount("dst_msg");
 * @exampleAsIs Dataset.GetDelRowCount();
 */
ngmf.getDelRowCount = function(dataSetId){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var deleteArr = dataSetObj.getDeletedJSON();
		return deleteArr.length;
	} catch (e) {
		ngmf._error("[ngmf.getDelRowCount] Exception :: ", e);
	}
};

/**
 * 지정한 Dataset의 Record의 지정한 Column의 값으로 Dataset의 지정한 Record의 지정한 Column의 값을 변경하는 API 입니다.(검토 필요)
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @param {Integer} nFromRow          :: I :: N ::  :: Record Level 값을 얻어올 Record Index
 * @param {Integer / String} nFromCol :: I :: N ::  :: Record Level 값을 얻어올 Record Index
 * @param {String} strDataset         :: I :: N ::  :: Record Level 값을 얻어올 Record Index
 * @param {Integer} nToRow            :: I :: N ::  :: Record Level 값을 얻어올 Record Index
 * @param {Integer / String} nToCol   :: I :: N ::  :: Record Level 값을 얻어올 Record Index
 * @return {Integer} Record의 RowLevel 값
 * @author 조지용
 * @useMobile use
 * @example ngmf.copyToColumn();
 * @exampleAsIs Dataset1.CopyToColumn(0,"d","Dataset0",0,"a");
 */
ngmf.copyToColumn = function(dataSetId, nFromRow, nFromCol, strDataset, nToRow, nToCol){
	try{
		return ngmf.copyColumn (dataSetId, nFromRow, nFromCol, strDataset, nToRow, nToCol);
	} catch (e) {
		ngmf._error("[ngmf.copyToColumn] Exception :: ", e);
	}
};

/**
 * 동적으로 Form에 존재하는 Component를 파괴하는 Form API 입니다.
 * @date 2016-04-01
 * @memberOf ngmf
 * @param {String / Object} compId :: I :: N ::  :: Form에 존재하는 Component의 ID.
 * @author 이동규
 * @useMobile use
 * @example ngmf.destroy(compId);
 * @exampleAsIs Destroy(compId)
 */
ngmf.destroy = function(compId) {
	try{
		var isDestroy = 0;
		var comp = ngmf.object(compId);
		
		if (typeof comp != "undefined") {
			if (ngmf.isFunction(comp.getOption) && comp.getOption("pluginName") == "dataList") {
				var flag = ngmf.destroyDataList(comp.getID());
				if (flag) {
					isDestroy = 1;
				}
			} else {
				comp.remove();
				isDestroy = 1;
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.destroy] Exception :: ", e);
	}
};

/**
 * 지정한 Dataset의 Record의 지정한 Column의 값으로 Dataset의 지정한 Record의 지정한 Column의 값을 변경하는 API 입니다.(검토 필요)
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @param {Integer} nFromRow          :: I :: N ::  :: Source Dataset의 복사 할 Record Index
 * @param {String} strDataset         :: I :: N ::  :: Target Dataset id string
 * @param {Integer} nToRow            :: I :: N ::  :: Target Dataset의 복사되어 변경 될 Row Index
 * @param {String} strColInfo         :: I :: Y ::  :: 복사할 조건. 생략 가능합니다. 생략시에는 같은 필드명의 값을 복사합니다.
 * @return {Integer} Record의 RowLevel 값
 * @author 조지용
 * @useMobile use
 * @example ngmf.copyToRow();
 * @exampleAsIs Dataset1.CopyToColumn(0,"d","Dataset0",0,"a");
 */
ngmf.copyToRow = function(dataSetId, nFromRow, strDataset, nToRow, strColInfo){
	try{
		var targetComp = ngmf.object(dataSetId);
		var pComp = ngmf.object(strDataset);

		if (typeof targetComp != "undefined" && typeof pComp != "undefined"
			&& targetComp.initializeType == "dataList" && pComp.initializeType == "dataList") {
			if (typeof nToRow == "undefined" || typeof nFromRow == "undefined") return -1;
			var jsonData = targetComp.getRowJSON(nFromRow);

			if (typeof strColInfo !="undefined" && strColInfo != "") {
				strColInfo = ngmf.trim(strColInfo);
				var colInfo = strColInfo.split(",");
				for (var i in colInfo) {
					var arr = colInfo[i].split("=");
					if (arr.length == 2) {
						pComp.setCellData(nToRow, ngmf.trim(arr[0]), targetComp.getCellData(nFromRow, ngmf.trim(arr[1])));
					}
				}
			} else {
				//datset이벤트 설정(onloaddata 등)
				pComp.setEventPause(null, true);
				
				pComp.setRowJSON(nToRow, jsonData, true);
				
				//datset이벤트 설정(onloaddata 등)
				pComp.setEventPause(null, false);
				
				//datset이벤트 ondataload() 실행
				WebSquare.event.fireEvent(pComp, 'oncelldatachange');				
			}
			return 1;
		}
	} catch (e) {
		ngmf._error("[ngmf.copyToRow] Exception :: ", e);
	}
};

/**
 * Dataset에서 해당 레코드를 원하는 위치로 이동하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @param {Integer} nOldRow           :: I :: N ::  :: 이동 할 Record Index
 * @param {Integer} nNewRow           :: I :: N ::  :: 이동 후의 Record Index
 * @author 조지용
 * @useMobile use
 * @example ngmf.moveRow("dst_msg", 3, 5);
 * @exampleAsIs Dataset.MoveRow(3, 5);
 */
ngmf.moveRow = function(dataSetId, nOldRow, nNewRow){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var _realRowIndex1 = nOldRow; 
		var _realRowIndex2 = nNewRow;
		
		var realRowIndex1;
		var realRowIndex2;
		
		var minRowIndex;
		var maxRowIndex;
		
		var len = dataSetObj.oneRowDataLength;
		var temp;
				
		//row indxt check
		if (_realRowIndex1 >= dataSetObj.getRowCount() ){
			return;
			//_realRowIndex1 = dataSetObj.getRowCount() - 1;
		} else if (_realRowIndex2 >= dataSetObj.getRowCount()){
			return;
			//_realRowIndex2 = dataSetObj.getRowCount() - 1;
		}

		if(_realRowIndex1 < 0 || _realRowIndex2 <0){
			return;
		} else {
			if ( _realRowIndex1 - _realRowIndex2 > 0 ){
				//up
				realRowIndex1 = _realRowIndex2;
				realRowIndex2 = _realRowIndex1;
				
				minRowIndex = realRowIndex1;
				maxRowIndex = realRowIndex2;
				
				var maxRowJson = dataSetObj.getRowJSON(maxRowIndex);
				var maxRowStatus = dataSetObj.getRowStatus( maxRowIndex );
				
				for(var i = maxRowIndex; i > minRowIndex ; i--) {
					var tempJson = dataSetObj.getRowJSON(i-1);
					var rowStatus = dataSetObj.getRowStatus( i-1 );
					dataSetObj.setRowJSON(i, tempJson, true);
					dataSetObj._setRowStatus( i , rowStatus );
				}
				
				dataSetObj.setRowJSON(minRowIndex, maxRowJson, true);
				dataSetObj._setRowStatus(minRowIndex, maxRowStatus );
								
			} else {
				//down
				realRowIndex1 = _realRowIndex1;
				realRowIndex2 = _realRowIndex2;
				
				minRowIndex = realRowIndex1;
				maxRowIndex = realRowIndex2;
				
				var minRowJson = dataSetObj.getRowJSON(minRowIndex);
				var minRowStatus = dataSetObj.getRowStatus( minRowIndex );
				
				for(var i = minRowIndex; i < maxRowIndex  ; i++) {
					var tempJson = dataSetObj.getRowJSON(i+1);
					var rowStatus = dataSetObj.getRowStatus( i+1 );
					dataSetObj.setRowJSON(i, tempJson, true);
					dataSetObj._setRowStatus( i , rowStatus );
				}
				
				dataSetObj.setRowJSON(maxRowIndex, minRowJson, true);
				dataSetObj._setRowStatus(maxRowIndex, minRowStatus );
			}
		}
		
		var realRowIndex = nNewRow;
		dataSetObj.broadcast({
			"linkedDataList" : ["notifyRowMoveUp" , [realRowIndex]],
			"gridView" : ["notifyRowMoveUp", [nNewRow]],
			"generalComp" : "both"
		});
		
		//datset이벤트 ondataload() 실행
		WebSquare.event.fireEvent(dataSetObj, 'ondataload');	
	} catch (e) {
		ngmf._error("[ngmf.moveRow] Exception :: ", e);
	}
};

/**
 * Global/Local에 변수가 있는지 여부를 확인하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String} strID     :: I :: N ::  :: 변수가 존재하는지 여부를 확인하고자 하는 변수의 이름
 * @param {String} strTarget :: I :: N ::  :: 찾고자 하는 위치("Global", "Local")
 * @return {Boolean} 변수가 존재하면 true/ 존재하지 않으면 false를 되돌립니다
 * @author 조지용
 * @useMobile use
 * @example ngmf.isExistVariable("dst_msg");
 * @exampleAsIs IsExistVariable("strID", "Global");
 */
ngmf.isExistVariable = function(strID, strTarget){
	try{
		var result = false;
	
		if (typeof strID !== "undefined") {
			if(ngmf.toUpper(strTarget) == "LOCAL"){
				var scvarObj = Object.keys(scvar);
				if (scvarObj.length > 0 && scvarObj.indexOf(strID) > -1) {
					result = true;
			    }
			} else if(ngmf.toUpper(strTarget) == "GLOBAL"){
				var scvarObj = Object.keys(GLV);
				if (scvarObj.length > 0 && scvarObj.indexOf(strID) > -1) {
					result = true;
			    }
			}  
		}
		return result;
	} catch (e) {
		ngmf._error("[ngmf.isExistVariable] Exception :: ", e);
	}
};

/**
 * 특정 레코드가 Select 상태인지 여부를 확인하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @param {Integer} nRow              :: I :: N ::  :: 선택여부를 확인할 Record Index
 * @return {Boolean} 특정 레코드가 선택되었는지의 여부
 * @author 조지용
 * @useMobile use
 * @example ngmf.getSelect(2);
 * @exampleAsIs DsSample.GetSelect(6);
 */
ngmf.getSelect = function(dataSetId, nRow){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var _child = dataSetObj.childCompHash;
		var _focusedArr = [];
		for(var i in _child){
			if ( _child[i].initializeType == "gridView" ) {
				_focusedArr = _focusedArr.concat(_child[i].getAllFocusedIndex());
			}
		}

		for( var j=0; j<_focusedArr.length; j++ ) {
			if( _focusedArr[j].row == nRow ){
				return true;
			}
		}
		return false;
	} catch (e) {
		ngmf._error("[ngmf.getSelect] Exception :: ", e);
	}
};

/**
 * Drag & Drop에 사용하기 위한 Data Object를 생성하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @author 조지용
 * @useMobile use
 * @example ngmf.createDataObject("dst_test");
 */
ngmf.createDataObject = function(dataSetId){
	try{
		return ngmf.createDataList(dataSetId);
	} catch (e) {
		ngmf._error("[ngmf.createDataObject] Exception :: ", e);
	}
};

/**
 * selectBox의 itemTable을 화면에 표시하는 Method 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} selectObj :: I :: N ::  :: 대상 컴포넌트 ID
 * @author 이동규
 * @useMobile use
 */
ngmf.actionDownList = function(selectObj){
	try{
		var comp = ngmf.object(selectObj);
		
		if (comp && comp.getStyle("display") != "none") {
			var compNm = comp.getPluginName();
			if (compNm == "autoComplete" || compNm == "selectbox") {
				if (ngmf.isMobile()) {

				} else {
					comp.click();
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.actionDownList] Exception :: ", e);
	}
};

/**
 * 현재 Focus를 가진 Component를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @return {Object} 현재 Focus를 가진 Component
 * @author 조지용
 * @useMobile use
 * @example ngmf.createDataObject("dst_test");
 */
ngmf.getCurrentComponent = function(){
	try{
		var objInfo = document.activeElement;
		
		if(objInfo !== "undefined" || objInfo != null || objInfo != ""){
			return ngmf.object(objInfo.id);
		}
		 
	} catch (e) {
		ngmf._error("[ngmf.getCurrentComponent] Exception :: ", e);
	}
};

/**
 * 현재 선택영역을 구하는 Method 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} compId :: I :: N ::  :: 대상 컴포넌트 ID
 * @return {Array} Index로 구성된 Array(0 번째 Item은 시작위치, 1 번째 Item은 끝위치를 가집니다)
 * @author 조지용
 * @useMobile use
 */
ngmf.getSel = function(compId){
	try{
		var comp = ngmf.object(compId);
		var result = [];
		
		if (typeof comp != "undefined" && (comp.getPluginName() == "textarea" || comp.getPluginName() == "input")) {
			result[0] =$("#"+comp.id).prop("selectionStart");
			result[1] =$("#"+comp.id).prop("selectionEnd");
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.getSel] Exception :: ", e);
	}
};

/**
 * 최상단에 떠 있는 Form Object를 얻어오는 API입니다.
 * @date 2016-04-12
 * @memberOf ngmf
 * @return {String} 화면 FormID
 * @author 조지용
 * @useMobile use
 * @example ngmf.getTopWindowID();
 */
ngmf.getTopWindowID = function(){
	try{
		var rtnVal;
		
		if(ngmf.isPopup()){
			rtnVal = parent.scvar.__screenName;
		} else {
			rtnVal = scvar.__screenName || ngmf.getFormID();
		}
		
		return rtnVal;
		
	} catch (e) {
		ngmf._error("[ngmf.getTopWindowID] Exception :: ", e);
	}
};

/**
 * 화면별 연관메뉴별 기능 제한(show/hide)
 * @date 2016-04-12
 * @memberOf ngmf
 * @param {String} pgmCompId  :: I :: N ::  :: 연관프로그램 연관메뉴ID
 * @param {Boolean} action  :: I :: N ::  ::  true : SHOW  false : HIDE
 * @author 성일호
 * @useMobile use
 * @example 
 * 		ngmf.setRelmenuCompHide  ("btnSave", true); // btnSave 숨기기
 * 		ngmf.setRelmenuCompHide  ("btnSave",false); // btnSave 보이기
 */
ngmf.setRelmenuCompHide = function (pgmCompId, action) {
	try{
		if (pgmCompId ) {
			var dataCompMain = GLD.ngmf.object("dsl_relativeBtn");
			var dataComp = ngmf.object("dsl_relativeBtnMenu");
			if (dataCompMain && !dataComp) {
				var screenBtnArr = dataCompMain.getMatchedJSON("screenNm", scvar.__screenName || ngmf.getFormID());
				if (screenBtnArr.length < 1) {
					dataComp = null;
				} else {
					dataComp = ngmf.createDataList("dsl_relativeBtnMenu", [ "screenNm", "btnId", "btnNm", "authrity", "btnType", "btnAction", "popupOptions", "hide", "grpId"]);
					dataComp.setJSON(screenBtnArr);
				}
			}
			if (dataComp) {
				var targetIdxs = dataComp.getMatchedIndex("btnId", pgmCompId );
				if (targetIdxs.length > 0) {
					for (var ix = 0; ix <targetIdxs.length ; ix ++ ) {
						if (action) dataComp.setCellData(targetIdxs[	ix], "hide", "1");
						else dataComp.setCellData(targetIdxs[	ix], "hide", "");
					}
					scvar["relativeBtnRefresh"] = true;
				}
			}
		}
		else return;
	} catch (e) {
		ngmf._error("[ngmf.setRelmenuCompHide] Exception :: ", e);
	}
};

/**
 * Dataset이 Update(Delete, Insert, Update)되었는지 여부를 알려주는 Method 입니다 
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @return {Boolean} Dataset의 Update 여부
 * @author 조지용
 * @useMobile use
 * @example ngmf.getUpdate("dst_msg");
 * @exampleAsIs Dataset.GetUpdate();
 */
ngmf.getUpdate = function(dataSetId){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var modifiedArr = dataSetObj.getModifiedData();
		var res =  modifiedArr.length == 0 ? false : true;
		return res;
		
	} catch (e) {
		ngmf._error("[ngmf.getUpdate] Exception :: ", e);
	}
};

/**
 * Dataset에서 요청한 Record 범위에 대해 Column ID의 값에 대한 최대값이나 레코드별 수식 수행 결과에 대한 최대값을 구하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID           :: I :: N ::          :: 최대값을 구할 Column ID
 * @param {Integer / String} nStart   :: I :: Y :: 0        :: 최대값을 구하고자 하는 시작 Record Index
 * @param {Integer / String} nCnt     :: I :: Y :: rowCount :: 최대값을 구할 Record 갯수
 * @return {Integer / String} 구해진 최대값
 * @author 조지용
 * @useMobile use
 * @example ngmf.max(dst_msg, "msg_ctt", 2, 6);
 * @exampleAsIs DsSample.Max("DS_MONEY",2,6);
 */
ngmf.max = function(dataSetId, strColID, nStart, nCnt){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
 		var max = null;
 		var dataArr = [];
 		(typeof nStart === "undefined") ? nStart = 0 : "";
 		(typeof nCnt === "undefined") ? nCnt = dataSetObj.getTotalRow() : "";

 		if( strColID.indexOf("expr:") > -1 ){

 		} else {
 			var colID = typeof strColId == "number" ? dataSetObj.getColumnID(strColID) : strColID;
	 		var dataValue;
	 		var dataType = dataSetObj.getColumnOption(colID,"dataType");

	 		for(var i=nStart; i<=nCnt; i++){
	 			if ( dataType === "bigDecimal" ) {
	 				dataValue = WebSquare.bigDecimal(dataSetObj.getCellData(i , colID));
	 			} else {
	 				dataValue = dataSetObj.getCellData( i , colID );
					dataValue += "";
	 			}

	 			if (typeof dataValue == "undefined" || dataValue == ""){
					dataValue = "0";
				} else{
					dataArr.push(dataValue);
				}
	 		}
			
			if( dataType === "bigDecimal" ) {
	 			for(var i in dataArr){
					max = (max == null) ? dataArr[i] : max.compare(dataArr[i]); 
				}
	 		} else if( dataType === "number" ){
	 			for( var i = 0; i < dataArr.length; i++ ){
					var data = parseFloat(dataArr[i]);
					if( !isNaN(data) ) {
						if ( max == null || max < data ) {
							max = data;
						}
					}
				}
	 		} else {
	 			for( var i = 0; i < dataArr.length; i++ ){
	 				var data = dataArr[i];
					if ( max == null || max < data ) {
						max = data;
					}
				}
	 		}			

			max = (max == null)? "" : max;
			max = WebSquare.util.setPrecision(max);
			return max;
 		}
	} catch (e) {
		ngmf._error("[ngmf.max] Exception :: ", e);
	}
};

/**
 * 현재 Focus가 들어있는 Component의 다음번 TabOrder를 가진 Component를 가져오는 Form API 입니다.
 * @date 2016-04-19
 * @memberOf ngmf
 * @param {String / Object} compId  :: I :: Y ::  :: 대상 컴포넌트 ID
 * @return {Object} 현재 Focus가 들어있는 Component의 다음번 TabOrder를 가진 Component.
 * @author 김응한
 * @useMobile use
 * @example ngmf.getNextComponent("input0");
 */
ngmf.getNextComponent = function(compId) {
	try{
		var curObj = ngmf.object(compId);
		
		if ( typeof curObj == "undefined" || curObj ==  null || curObj === "") {
			return;
		}
		
		var dsObj = ngmf.object(curObj.getNextTabID() );
		
		return dsObj;
	} catch (e) {
		ngmf._error("[ngmf.getNextComponent] Exception :: ", e);
	}
};

/**
 * 현재 Focus가 들어있는 Component의 이전 TabOrder를 가진 Component를 가져오는 Form API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} compId  :: I :: Y ::  :: 대상 컴포넌트 ID
 * @return {Object} 현재 Focus가 들어있는 Component의 이전번 TabOrder를 가진 Component.
 * @author 김응한
 * @useMobile use
 * @example ngmf.getPrevComponent("input0");
 */
ngmf.getPrevComponent = function(compId) {
	try{
		var curObj = ngmf.object(compId);
		
		if ( typeof curObj == "undefined" || curObj ==  null || curObj === "") {
			return;
		}
		
		var dsObj = null;
		
        if (WebSquare.tabOrder[curObj.getID()] != null  && WebSquare.tabOrder[curObj.getID()]["preTabID"] != null ) {
        	dsObj = ngmf.object(WebSquare.tabOrder[curObj.getID()]["preTabID"]);
        }
		
		return dsObj;
	} catch (e) {
		ngmf._error("[ngmf.getPrevComponent] Exception :: ", e);
	}
};

/**
 * SelectRow Method를 통해서 선택된 Record나 Grid의 MultiSelect Property가 True로 설정되어 있을 때 선택된 Record에 대해 선택된 상태를 취소하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId :: I :: N ::  :: 대상 DataSet 컴포넌트 ID
 * @return {Integer} 선택 취소된 Record 갯수
 * @author 조지용
 * @useMobile use
 * @example ngmf.clearSelect("dst_msg");
 * @exampleAsIs Dataset.ClearSelect();
*/
ngmf.clearSelect = function(dataSetId){
	try{
		var rtnValue = 0;
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var _child = dataSetObj.childCompHash;
		var _focusedArr = [];
		
		for(var i in _child){
			if ( _child[i].initializeType == "gridView" ) {
				var grdObj = _child[i];
				var allFocusedInfo = grdObj.getAllFocusedIndex();
				var rowArray = [];
				var preRowIndex = -1;
				var lastIndex = allFocusedInfo[allFocusedInfo.length - 1];
				
				for(var j=0; j<allFocusedInfo.length; j++){
					if(preRowIndex != allFocusedInfo[j].row){
						preRowIndex = allFocusedInfo[j].row;
						rowArray.push(allFocusedInfo[j].row);
						rtnValue++;
					}
				}
			
				//선택된 focus 제거				
				grdObj.removeFocusedCell();
				
			}
		}
		
		return rtnValue;

	} catch (e) {
		ngmf._error("[ngmf.clearSelect] Exception :: ", e);
	}
};

/**
 * relayPage를 통해 외부URL을 호출하기 위한 API 입니다.
 * @date 2016-04-21
 * @memberOf ngmf
 * @param {String} frameId            :: I :: N ::         :: iframeID
 * @param {String} url                :: I :: Y ::         :: 외부 url
 * @param {String / Object} dataSetId :: I :: Y ::         :: dataSetId
 * @param {String} formName           :: I :: Y :: webform :: relayPage내 post submit될 form객체 name
 * @param {String} btnId              :: I :: Y :: btnurl  :: relayPage내 url호출할 이벤트버튼 Id
 * @author 조지용
 * @useMobile check
 * @example ngmf.externalUrlPopup("ifm_external","http://150.2.236.51:7020/ra/rr/PGR106.jsp",  "dm_inbSkpbss");
 */
ngmf.externalUrlPopup = function(frameId, url, dataSetId, formName, btnId){
	try{
		var frameObj = document.getElementById(frameId);
		formName = formName || 'webform';
		btnId = btnId || 'btnurl';
		
		if ( typeof frameObj == "undefined" || frameObj ==  null || frameObj == "") {
			ngmf._error("[ngmf.externalUrlPopup] Exception :: 프레임을 찾을 수 없습니다. ");
			return;
		}
					
		var formObj = frameObj.contentWindow.document.getElementsByName(formName)[0];
		
		if ( typeof formObj == "undefined" || formObj ==  null || formObj == "") {
			ngmf._error("[ngmf.externalUrlPopup] Exception :: 해당 폼을 찾을 수 없습니다. ");
			return;
		}
		
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj != "undefined" && dataSetObj !=  null) {
			for(var i=0; i<formObj.elements.length; i++){
				formObj.elements[i].value = dataSetObj.getCellData(0, formObj.elements[i].name);
			}
		}
		
		//external url popup setting
		if ( typeof url !== "undefined" && url !=  null && url != "") {
			formObj.action = url;
		}
		
		if(typeof formObj.elements[btnId] != "undefined" && formObj.elements[btnId].type == "button"){
			formObj.elements[btnId].click(); //relayPage의 해당 객체명을 동일하게 변경해야 함
		} else {
			formObj.submit();
		}
		
	} catch (e) {
		ngmf._error("[ngmf.externalUrlPopup] Exception :: ", e);
	}
};

/**
 * Form에 편집중인 값이 있는경우 bind된 DataList에 강제로 반영(동기화)을 하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} objComponent :: I :: N ::  :: 대상 Component를 강제로 지정
 * @author 조지용
 * @update 이동규 20160902	bind된 객체가 없는 경우 오류 분기 처리
 * @useMobile use
 * @example ngmf.applyData();
 */
ngmf.applyData = function(objComponent){
	try{
		var compObj = null;
		
		if (!objComponent) {
			compObj = ngmf.getCurrentComponent();
		} else {
			compObj = ngmf.object(objComponent);
		} 
		
		if (compObj && typeof compObj.getDataListInfo == "function") {
			var dataListInfo = compObj.getDataListInfo();
			var dataListObj = (dataListInfo && typeof ngmf.object(dataListInfo.id) != "undefined") ? ngmf.object(dataListInfo.id) : undefined;
			if (typeof dataListObj != "undefined" && dataListInfo.ref) {
				var dataRefArr = dataListInfo.ref.split(".")[1];
				if (typeof dataRefArr != "undefined" && typeof dataListObj.set == "function") {
					dataListObj.set(dataRefArr, compObj.getValue());
				} else if (typeof dataRefArr != "undefined" && typeof dataListObj.setCellData == "function") {
					dataListObj.setCellData(0, dataRefArr, compObj.getValue());
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.applyData] Exception :: ", e);
	}
};

/**
 * MaskEdit Component 의 Font 를 설정하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} arguments[0] :: I :: N ::  :: 컴포넌트ID
 * @param {String} arguments[1]          :: I :: N ::  :: 사용할 Font Face 의 이름(표준 'MalgunGothicWeb','맑은 고딕', sans-serif  변경불가)
 * @param {Integer} arguments[2]         :: I :: N ::  :: 사용할 Font 의 크기(표준 15px 변경불가)
 * @param {String} arguments[3]          :: I :: N ::  :: Font 에 추가적으로 들어갈 스타일의 이름
 * @author 조지용
 * @useMobile use
 * @example ngmf.setFont("ipt_click", "고딕체", 10, "bold", "normal", "underline");
 */
ngmf.setFont = function(){
	try{
		var compObj = ngmf.object(arguments[0]);
		
		if ( typeof compObj == "undefined" || compObj ==  null || compObj == "") {
			return;
		}
		
		if ( typeof arguments[1] != "undefined" && arguments[1] !=  null && arguments[1] != "") {
			compObj.setStyle("font-family", arguments[1]);
		}
		
		if ( typeof arguments[2] != "undefined" && arguments[2] !=  null && arguments[2] != "") {
			compObj.setStyle("font-family", arguments[2] + "px");
		}
		
		for(var i=3; i<arguments.length; i++){
			switch(ngmf.toUpper(arguments[i])){
				case "BOLD" :
				case "NORMAL" :
				case "LIGHTER" :
					compObj.setStyle("font-weight", arguments[i]);
					break;
				case "ITALIC" :
					compObj.setStyle("font-style", arguments[i]);
					break;
				case "LINE-THROUGH" :
				case "OVERLINE" :
				case "UNDERLINE" :
					compObj.setStyle("text-decoration", arguments[i]);
					break;
			}
		}
		
	} catch (e) {
		ngmf._error("[ngmf.setFont] Exception :: ", e);
	}
};

/**
 * LocalStorage 내에 들어있는 Clipboard용 "CF_TEXT, CF_UNICODETEXT, CF_CSV" Data를 Clear 하는 API 입니다.
 * @date 2016.04.30
 * @memberOf ngmf
 * @returns {Boolean} 성공여부 반환.
 * @author 조지용
 * @useMobile use
 * @example ngmf.clearCbLocalStorage();
 * @exampleAsIs Form API.ClearClipboard();
 */
ngmf.clearCbLocalStorage = function () {
	try{
		GLD.ngmv.cf_text = null;
		GLD.ngmv.cf_unicodetext  = null;
		GLD.ngmv.cf_csv = null;
		return true;
	} catch (ex) {
		ngmf._error("[ngmf.clearCbLocalStorage] Exception :: ", ex);
	}
};

/**
 * LocalStorage에 User가 원하는 Clipboard용 "CF_TEXT, CF_UNICODETEXT, CF_CSV" Data를 넣는 API 입니다.
 * @date 2016.04.30
 * @memberOf ngmf
 * @param {String} strFormat :: I :: N ::  :: Clipboard Format 형식을 정의(CF_TEXT, CF_UNICODETEXT, CF_CSV 문자열로 입력합니다.)
 * @param {String / Float} varData :: I :: N ::  :: Clipboard에 담을 내용
 * @returns {Boolean} 성공여부 반환.
 * @author 조지용
 * @useMobile use
 * @update 2016.05.19 조지용 localStorage를 사용하지 않고 GLD에 있는 ngmv를 사용하여 동작되도록 수정 
 * @example ngmf.setCbLocalStorage("CF_TEXT",objData);
 * @exampleAsIs SetClipBoard("CF_TEXT",objData);
 */
ngmf.setCbLocalStorage = function (strFormat, clipboardData) {
	try{
		if(typeof strFormat === "undefined" || strFormat == null || strFormat == ""){
			return;
		}

		switch (ngmf.toUpper(strFormat)) {
			case "CF_TEXT" :
				GLD.ngmv.cf_text = clipboardData;
				break;
			case "CF_UNICODETEXT" :
				GLD.ngmv.cf_unicodetext = clipboardData;
				break;
			case "CF_CSV" :
				GLD.ngmv.cf_csv = clipboardData;
				break;
		}	
		
	} catch (ex) {
		ngmf._error("[ngmf.setCbLocalStorage] Exception :: ", ex);
	}
};

/**
 * LocalStorage에 저장되어 있는 Clipboard용 "CF_TEXT, CF_UNICODETEXT, CF_CSV" Data를 가져오는 API 입니다.
 * @date 2016.04.30
 * @memberOf ngmf
 * @param {String} strFormat :: I :: N ::  :: Clipboard Format 형식을 정의(CF_TEXT, CF_UNICODETEXT, CF_CSV 문자열로 입력합니다.)
 * @returns {String / Float} Clipboard에서 받은 값을 반환.
 * @author 조지용
 * @useMobile use
 * @update 2016.05.19 조지용 localStorage를 사용하지 않고 GLD에 있는 ngmv를 사용하여 동작되도록 수정
 * @example ngmf.getCbLocalStorage("CF_TEXT");
 * @exampleAsIs GetClipBoard("CF_TEXT");
 */
ngmf.getCbLocalStorage = function(strFormat){
	 try{
		if(typeof strFormat === "undefined" || strFormat == null || strFormat == ""){
			return;
		}

		switch (ngmf.toUpper(strFormat)) {
			case "CF_TEXT" :
				return GLD.ngmv.cf_text;
				break;
			case "CF_UNICODETEXT" :
				return GLD.ngmv.cf_unicodetext;
				break;
			case "CF_CSV" :
				return GLD.ngmv.cf_csv;
				break;
		}		
	 } catch (e) {
	  ngmf._error("[ngmf.getCbLocalStorage] Exception :: ", e);
	 }
};

/**
 * 현재 선택된 탭에서 window 반환해주는 내부API 입니다.(사용중지)
 * @date 2016-05-02
 * @memberOf ngmf
 * @author 이동규
 * @useMobile use
 * @update 2016.05.24 이동규 모바일 공통 변경수정.
 * @update 2016.06.13 이동규 팝업창일때 콜백부모가 팝업인지 아닌지 여부체크.
 * @update 2016.06.14 이동규 reload URL 설정 오류 수정. (screeNm 이 없을경우 처리.)
 * @update 2016.06.24 이동규 getWindow 통합작업.
 */
ngmf._displayWindow = function(screenNm, target) {
	try {
		// 2016.08.05 window 관리 통합으로 미사용
		//return false;
		
 		if(ngmf.isMobile()) {
			if (ngmf.isPopup() && typeof screenNm != "undefined") {
				if (target) {
					return window;
				} else {
					return ngmf.popupParam().parentObj;
				}
			} else if (typeof screenNm != "undefined"){
				return ngmf.getFindWindow(screenNm);
			} else {
				return GLD["scwin"].getSelectedIframe();
			}

		} else {
			var windowMDI = ngmf.mdiTabs();
			var windowId = screenNm;

			if (ngmf.isPopup()) {
				if (target) {
					var parentwindowId = windowMDI.getSelectedWindowId();
					var selectedWindow = windowMDI.getWindowByWindowId(parentwindowId);
					if (typeof windowId == "undefined") windowId = scvar.__screenName || ngmf.getFormID();
					var popupWindow = selectedWindow.document.getElementById(windowId);
					if(popupWindow && popupWindow.getElementsByTagName("iframe").length > 0) {
						iframeDom = popupWindow.getElementsByTagName("iframe")[0];
						return iframeDom.contentWindow || iframeDom.contentDocument;
					} else {
						return ngmf.popupParam().parentObj;//부모window
					}
				} else {
					return ngmf.popupParam().parentObj;//부모window
				}
			} else if (typeof screenNm != "undefined") {
				return windowMDI.getWindowByWindowId(windowId);//selected MDI window
			}else {
				var windowId = windowMDI.getSelectedWindowId();
				return windowMDI.getWindow(windowId);
			}
		}
	} catch(e) {
		ngmf._error("[ngmf._displayWindow] Exception :: ", e);
	}
};
/**
 * 팝업창에서 부모함수를 호출하는 API 입니다.
 * @date 2016-05-02
 * @memberOf ngmf
 * @param {String} pScreenNm  :: I :: N ::  :: 부모창의 formId (screenName)
 * @param {String} funcNm  :: I :: N ::  ::  호출할 함수명
 * @param {Object} arguments  :: I :: N ::  ::  호출할 함수의 파라메터들.
 * @author 이동규
 * @useMobile use
 * @example 
 *     // 팝업 화면 Script
 * 		var rtn = ngmf.callParentFunc ("scwin.testFunction", data1, data2, data3); //함수 호출
 *      if (rtn) {
 *      	......
 *      }
 *
 *      // parentScreenId 부모 화면 script
 * 		scwin.testFunction  (data1, data2, data3); // 호출함수
 */
ngmf.callParentFunc = function (funcNm) {
	if (!ngmf.isPopup() || arguments.length == 0) {
		return false;
	} else {
		try {
			var result = null;
			var dataResult = null;
			var displayWindow = ngmf.popupParam()["parentForm"];
			if (displayWindow) {
				var isFunc = displayWindow.ngmf.isExistFunc(funcNm);
				if (isFunc) {
					if (arguments.length > 1) {
						var params = [];
	     				for (var i = 1; i < arguments.length; i++) {
	      					if (typeof arguments[i] != "undefined") {
	       						params.push(arguments[i]);
	      					}
	     				}
	     				var strArgument = ngmf.stringify(params);
	     				
	     				result = displayWindow.ngmf._functionCall(funcNm, strArgument);
					} else {
						result = displayWindow.ngmf._functionCall(funcNm);
					}
				}
			} else {
				return false;
			}
			
			//함수 리턴값 처리
			if (result) {
				dataResult = ngmf.jsonParse(result).returnValue;
			}
		} catch(e) {
			ngmf._error("[ngmf.callParentFunc] Exception :: ", e);
		}
		return dataResult;	 
	}
};

/**
 * MDI화면에서 다른 MDI화면의 함수를 호출하는 API 입니다.
 * @date 2016-05-02
 * @memberOf ngmf
 * @param {String} pScreenNm  :: I :: N ::  :: 부모창의 formId (screenName)
 * @param {String} funcNm  :: I :: N ::  ::  호출할 함수명
 * @param {Object} arguments  :: I :: N ::  ::  호출할 함수의 파라메터들.
 * @author 이동규
 * @useMobile use
 * @example 
 *     // 팝업 화면 Script
 * 		var rtn = ngmf.callMdiFunc ("ScreenId", "scwin.testFunction", data1, data2, data3); //함수 호출
 *      if (rtn) {
 *      	......
 *      }
 *
 *      // ScreenId 화면 script
 * 		scwin.testFunction  (data1, data2, data3); // 호출함수
 */
ngmf.callMdiFunc = function (pScreenNm, funcNm) {
	if (ngmf.isPopup()) {
		return false;
	} else {
		var arr = [];
		for ( var i = 0 ; i < arguments.length ; i++) {
			arr.push(arguments[i]);
		}
		return ngmf._callParentFunc.apply(this, arr);
	}
};

ngmf._callParentFunc = function(pScreenNm, funcNm) {
	var result;
	var dataResult;
	try {
		//함수 호출 확인 및 파라메터.
		// 2016.08.05 window 관리 통합
		//var displayWindow = ngmf._displayWindow(pScreenNm, true);
		var displayWindow = null;
		var winc = ngmf._getAllWindows(pScreenNm,"","M");
		if (winc && winc.length > 0) displayWindow = winc[0];
		else {
			winc = ngmf._getAllWindows(pScreenNm,"","P");
			if (winc && winc.length > 0) displayWindow = winc[0];
		}
		
		if (displayWindow) {
			var isFunc = displayWindow.ngmf.isExistFunc(funcNm);
			if (isFunc) {
				if (arguments.length > 2) {
					var params = [];
     				for (var i = 2; i < arguments.length; i++) {
      					if (typeof arguments[i] != "undefined") {
       						params.push(arguments[i]);
      					}
     				}
     				var strArgument = ngmf.stringify(params);
     				result = displayWindow.ngmf._functionCall(funcNm, strArgument);
				} else {
					result = displayWindow.ngmf._functionCall(funcNm);
				}
			}
		} else {
			return false;
		}

		//함수 리턴값 처리
		if (typeof result != "undefined") {
			dataResult = ngmf.jsonParse(result).returnValue;
		}
	} catch(e) {
		ngmf._error("[ngmf.callParentFunc] Exception :: ", e);
	}
	return dataResult;
};

/**
 * 팝업창에서 부모함수를 호출하는 내부API 입니다.
 * @date 2016-05-02
 * @memberOf ngmf
 * @author 이동규
 * @useMobile use
 */
ngmf._functionCall = function(funcNm, strArgument) {
	var result;
	var flag = false;
	try {
		if (typeof strArgument != "undefined") {
			var param = ngmf.jsonParse(strArgument);
			result = ngmf.executeFunc(funcNm, param, true, true);
		} else {
			result = ngmf.executeFunc(funcNm, null, false, true);
		}
	} catch(e) {
		ngmf._error("[ngmf._functionCall] Exception :: ", e);
	}

	if (typeof result != "undefined") {
		var finalResult = {returnValue : result};
		return ngmf.stringify(finalResult);
	}	
};

/**
 * wFrame을 삭제합니다. 
 * @date 2016-05-02
 * @memberOf ngmf
 * @param  {Object}{String} wframeId  :: I :: N ::  :: 삭제할 wframeId
 * @author 김응한
 * @useMobile use
 * @returns {Boolean} 성공여부 반환.
 * @example 
 * 		for ( var i = 0; i < 5; i++) {
			ngmf.removeWframe("Iphwframe" + i);
		}
 */
 
ngmf.removeWframe = function (wframeId) {
	try {
		if (typeof wframeId !== "undefined") {
			var comp = ngmf.object(wframeId);
			if (!comp) {
				return false;
			}
			if (comp.getPluginName() == "wframe") {
				ngmf.setSrc(comp);
				comp.remove();
				return true;
			}
		}
		return false;
	} catch (e) {
		ngmf._error("[ngmf.removeWframe] Exception :: ", e);
	}
};
			
/**
 * 두개이상의 JSON 을 merge하는 공통함수입니다 
 * @date 2016-05-02
 * @memberOf ngmf
 * @param  {Object}{String} mergeData1  :: I :: N ::  :: merge 대상이 되는 타겟 JSON 
 * @param  {Object}{String} mergeData2  :: I :: N ::  :: 타겟JSON와 merge할 JSON
 * @author 김응한
 * @useMobile use
 * @returns {Object} merge된 JSON
 * @example 
 * 		ngmf.mergeJSON({a:"a"},{b:"b"},{c:"c"})
 */
 			
			
ngmf.mergeJSON = function (mergeData) {
	try{
		var jsonData=[];
		if(typeof arguments === "undefined"||arguments.length<2){
			return;
		}
		for(i=0; i<arguments.length; i++){
			if(typeof ngmf.object(arguments[i])!=="object"&&!ngmf.isJSON(ngmf.object(arguments[i]))){
				return;
			}
			jsonData[i]=ngmf.object(arguments[i])
		}
		mergeData = jsonData[0];
		for(i=1; i<jsonData.length; i++){
			mergeData=$.extend(mergeData,jsonData[i])
		}
	return mergeData;
	}catch(e){
		ngmf._error("[ngmf.mergeJSON] Exception :: ", e);
	}
};


/**
 * 컴포넌트의 left , top 위치를 가져오는 API입니다. 
 * @date 2016-05-02
 * @memberOf ngmf
 * @param  {Object}{String} compId  :: I :: N ::  :: 컴포넌트 ID 
 * @param  {String} position  :: I :: N ::  :: left 또는 top
 * @author 김응한
 * @useMobile use
 * @returns {Number} 컴포넌트의 offset left 또는 top 값  
 * @example 
 * 		var baseLeft = ngmf.getPosition("btn_search","top");
		var baseTop  = ngmf.getPosition("btn_search","left");
	
 */
 ngmf.getPosition = function (compId, position) {	
	try{
		if (typeof compId !== "undefined"&&typeof position !== "undefined"
			&&(position!==ngmf.trim("")&&typeof position==="string")) {

			var comp = ngmf.object(compId);
			if (typeof comp === "undefined") {
				return;
			}else{
				compId=comp.id;
			}
			
			position = ngmf.toUpper(position);		
			
			if(position==="LEFT"){
				return $("#" + $w.getRuntimeId(compId)).offset().left;
			}else if(position==="TOP"){
				return $("#" + $w.getRuntimeId(compId)).offset().top;
			}
		}
		return;
		
	}catch(e){
		ngmf._error("[ngmf.getPosition] Exception :: ", e);
	}
};

/**
 * 화면 (메인, 팝업)화면을 공통으로 닫는 API 입니다.
 * @date 2015-10-29
 * @memberOf ngmf
 * @param {String} rtnObj  :: I :: N ::  :: 팝업화면일 경우 CAllBACK 함수로 넘겨줄 파라메터.
 * @author 이동규
 * @useMobile use
 * @example ngmf.close(rtnObj);
 * @exampleAsIs ClosePopup(RetVar);
 */
ngmf.close = function(rtnObj) {
	try {
		if (ngmf.isPopup()) {
			var popupObj = ngmf.popupParam();
			ngmf.closePopup(popupObj.popupID, popupObj, rtnObj);
		} else {
			ngmf.closeWindow();
		}
	} catch(e) {
		ngmf._error("[ngmf.close] Exception :: ", e);
	}
};
		
/**
 * Filter된 레코드를 포함하는 Dataset의 해당 범위안에서 조건에 맞는 Record를 추출한 후, 계산식을 적용해 Record들의 최대값을 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::   :: 대상 DataSet 컴포넌트 ID
 * @param {Integer} nRow               :: I :: Y :: 0 :: RowType을 얻어올 Record Index
 * @return {String} 지정된 Record의 RowType(C, U, R, D)
 * @author 조지용
 * @useMobile use
 * @example ngmf.getRowTypeNF("grd01", 1);
 * @exampleAsIs DsSample.GetRowTypeNF(0);
 */
ngmf.getRowTypeNF = function(dataSetId, nRow){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}

	 	var jsonData = dataSetObj.getAllJSON();
	 	var rowData = jsonData[nRow];
	 	
	 	if ( typeof rowData == "undefined" || rowData ==  null || rowData === "") {
			return "R";
		}

	 	return rowData.rowStatus;
 		
	} catch (e) {
		ngmf._error("[ngmf.getRowTypeNF] Exception :: ", e);
	}
};	

/**
 * SelectRow Method를 통해서 선택된 Record나 Grid의 MultiSelect Property가  True로 설정되어 있을 때 다중 선택된 Record를 삭제하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::   :: 대상 DataSet 컴포넌트 ID
 * @return {Integer} 삭제된 Record 갯수
 * @author 조지용
 * @useMobile use
 * @example ngmf.deleteSelected("dst_msg");
 * @exampleAsIs Dataset.DeleteSelected();
 */
ngmf.deleteSelected = function(dataSetId){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var focusedArr = [];
		var child = dataSetObj.childCompHash;
		for( var i in child ) {
			if ( child[i].initializeType == "gridView" ) {
				var allFocusedCell = child[i].focusedCell;
				
				for( var j=0; j<allFocusedCell.length; j++ ){
					var rowIndex = allFocusedCell[j]["focusedRowIndex"];
					var rowDuplicate = false;
					
					//중복 rowIndex 제외
					for(var k=0; k < focusedArr.length; k++){
						if(rowIndex == focusedArr[k]){
							rowDuplicate = true;
							break;
						}
					}
					
					if(!rowDuplicate){
						focusedArr.push( rowIndex );
					}
				}
				
				//Grid에서 가장 마지막으로 선택된 레코드 위치가 RowPosition이 됩니다.
				child[i].setFocusedCell(focusedArr[0], 0);				
			}
		}

		dataSetObj.removeRows(focusedArr);
		
		return focusedArr.length;		
	} catch (e) {
		ngmf._error("[ngmf.deleteSelected] Exception :: ", e);
	}
};	

ngmf._setBatchProgress = function(processMsg){
	if (typeof txt_process != "undefined") {
		try {
			if (processMsg) {
				txt_process.setValue(processMsg);
				$("#_floatModal").show();
				grp_batchLoadingBar.show("");
			} else {
				txt_process.setValue("배치작업 중입니다.");
				$("#_floatModal").hide();
				grp_batchLoadingBar.hide();
			} 
		} catch (ex) {
			ngmf._error("[ngmf._setBatchProgress] Exception :: ", ex);
		}
	} 
};


/**
 * MiPlatformX와 MiPlatformMX의 UserNotify Event를 발생 시키는 API 입니다.(TO-BE 미구현)
 * @date 2016-05-17
 * @memberOf ngmf
 * @param {Integer} nNotifyID  :: I :: N ::   :: UserNotify Event의 nNotifyID에 들어갈 값
 * @param {String} strMessage  :: I :: N ::   :: UserNotify Event의 strMsg에 들어갈 값
 * @author 조지용
 * @useMobile check
 * @example ngmf.userNotify(nNotifyID, strMessage);
 * @exampleAsIs UserNotify(1, "Generate Event");
 */
ngmf.userNotify = function(nNotifyID, strMessage){
	try{
		var idx = nNotifyID;
		
		ngmf.alert("userNotify( " +nNotifyID + ", " + strMessage + ") 관련 portal과 협의예정 입니다.");
		return;
		if(idx==99){ //cca
	 		//ngmf._callScript(strMessage);
		}else if(idx==98){ //voc
			//ngmf._CallVoc(Arguement);
			//ngmf._callScript(strMessage);
		}else if(idx==96){ //voc
			//ngmf._CallVoc2(Arguement);
			//ngmf._callScript(strMessage);
		}else if(idx==97){ //com
			//ngmf._CallCom(Arguement);
			//ngmf._callScript(strMessage);
		}else if(idx==8){
			window.close();
		}else if(idx==88){
			top.close();
		}else if(idx==101){
			//ngmf._CallPSM50(Arguement);
			//ngmf._callScript(strMessage);
		}else{
	 		//fn_CallScript(Arguement);
		}
	} catch (e) {
		ngmf._error("[ngmf.userNotify] Exception :: ", e);
	}
};	

/**
 * 지정한 Column의 maxLength를 얻어오는 API입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::   :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID            :: I :: N ::  :: Column Size를 얻어올 Column ID
 * @return {Integer} 지정한 컬럼의 maxLength(해당하는 Column이 없는경우 -1 을 Return 합니다.)
 * @author 조지용
 * @useMobile use
 * @example ngmf.getColSize("dst_msg", "msg_cd");
 */
ngmf.getColSize = function(dataSetId, strColID){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var child = dataSetObj.childCompHash;
		for( var i in child ) {
			if ( child[i].initializeType == "gridView" ) {
				
				var gridObj = child[i];
				var bodyColumnInfo = gridObj.cellInfoHash[strColID];
				
				if ( typeof bodyColumnInfo == "undefined" || bodyColumnInfo ==  null || bodyColumnInfo === "") {
					return -1;
				} 
				
				var rtnVal = bodyColumnInfo.options.maxLength;
				
				if(rtnVal == undefined || rtnVal == "" || rtnVal == null) {
					rtnVal = 0;
				}
				
				return rtnVal;				
			}
		}
		

	} catch (e) {
		ngmf._error("[ngmf.getColSize] Exception :: ", e);
	}
}; 

/**
 * iframe의 body 또는 div객체에 innerHTML로 값을 넣는 API입니다. 
 * @date 2016-05-18
 * @memberOf ngmf
 * @param {String / Object} iframeId   :: I :: N ::  :: 대상 iframe 컴포넌트 ID
 * @param {String} targetId            :: I :: N ::  :: 값을 넣고자 하는 객체ID
 * @param {String} strVal              :: I :: Y ::  :: 넣고자 하는 값
 * @author 조지용
 * @useMobile use
 * @example ngmf.setIframeInnerHTML("ifm_test", "body", strVal);
 */
ngmf.setIframeInnerHTML = function(iframeId, targetId, strVal){
	try{
		var iframeObj = ngmf.object(iframeId);
		
		if ( typeof iframeObj == "undefined" || iframeObj ==  null || iframeObj === "") {
			return;
		}
		
		if ( typeof targetId == "undefined" || targetId ==  null || targetId === "") {
			return;
		}
		
		var targetObj = null;
		
		targetObj = iframeObj.getWindow().document.getElementsByTagName(targetId)[0];
		
		if( typeof targetObj == "undefined" || targetObj ==  null || targetObj === ""){
			targetObj = iframeObj.getWindow().document.getElementById(targetId);
		}
		
		if( typeof targetObj == "undefined" || targetObj ==  null || targetObj === ""){
			return;
		}
		
		targetObj.innerHTML = strVal;
		
		
	} catch (e) {
		ngmf._error("[ngmf.setIframeInnerHTML] Exception :: ", e);
	}
}; 


/**
 * Dataset에서 지정한 Column ID의 Column 값과 입력된 Value의 값이 일치하는 첫번째 레코드 Index를 얻어오는 API입니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID            :: I :: N ::          :: 검색할 Dataset의 Column ID
 * @param {String} strVal              :: I :: N ::          :: 검색할 Dataset의 Column Value
 * @param {Integer} nStartIdx          :: I :: Y :: 0        :: 검색할 시작 레코드 Index
 * @param {Integer} nEndIdx            :: I :: Y :: rowCount :: 검색할 마지막 레코드 Index+1
 * @return {Integer} Dataset의 Column ID와 Column Value에 해당하는 레코드 Index. 만족하는 레코드가 없을 경우 -1 을 Return 합니다.
 * @author 조지용
 * @useMobile use
 * @example ngmf.findRow("dst_msg", "msg_typ_cd", "E");
 * @exampleAsIs DsSample.FindRow("DS_MEMBER","leo");
 */
ngmf.findRow = function(dataSetId, strColID, strVal, nStartIdx, nEndIdx){
	try{
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		var matchedRowArr = dataSetObj.getMatchedIndex(strColID, strVal, true, nStartIdx, nEndIdx);
		
		if(matchedRowArr.length > 0){
			return matchedRowArr[0]; 
		} else {
			return -1;
		}

	} catch (e) {
		ngmf._error("[ngmf.findRow] Exception :: ", e);
	}
}; 

/**
 * Dataset에서 Column ID의 Column값 중 입력된 Value의 값을 포함(앞부분 문자열이 입력된 Value의 값과 일치)하는 첫번째 레코드 Index를 얻어오는 API입니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID            :: I :: N ::          :: 검색할 Dataset의 Column ID
 * @param {String} strVal              :: I :: N ::          :: 검색할 Dataset의 Column Value
 * @param {Integer} nStartIdx          :: I :: Y :: 0        :: 검색할 시작 레코드 Index
 * @param {Integer} nEndIdx            :: I :: Y :: rowCount :: 검색할 마지막 레코드 Index+1
 * @return {Integer} Dataset의 Column ID와 Column Value에 해당하는 레코드 Index. 만족하는 레코드가 없을 경우 -1 을 Return 합니다.
 * @author 조지용
 * @useMobile use
 * @example ngmf.findRowAs("dst_msg", "msg_ctt", "&ITEM");
 * @exampleAsIs DsSample.FindRowAs("DS_MEMBER","L");
 */
ngmf.findRowAs = function(dataSetId, strColID, strVal, nStartIdx, nEndIdx){
	try{
		var rtnVal = -1;
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		if ( typeof strColID == "undefined" || strColID ==  null || strColID === "") {
			return;
		}
		
		if ( typeof strVal == "undefined" || strVal ==  null || strVal === "") {
			return;
		}
		
        var colIdx = dataSetObj.getColumnIndex(strColID);
        
        if ( typeof colIdx == "undefined" || colIdx ==  null || colIdx === "") {
			return;
		}
        
        var colDataArr = dataSetObj.getFilteredColData(colIdx);
        
        if (typeof nStartIdx != "number") {
        	nStartIdx = 0;
        }
        if (typeof nEndIdx != "number") {
        	nEndIdx = colDataArr.length;
        }
        if (nEndIdx > colDataArr.length) {
        	nEndIdx = colDataArr.length;
        }
        for (var i = nStartIdx; i < nEndIdx; i++) {
            if (colDataArr[i].startsWith(strVal)) {
            	rtnVal = i;
            	break;
            } 
        }
        return rtnVal;		

	} catch (e) {
		ngmf._error("[ngmf.findRowAs] Exception :: ", e);
	}
}; 

/**
 * Filter된 데이타를 포함한 Dataset에서 Column ID의 Column 값과 입력된 Value의 값이 일치하는 첫번째 레코드 Index를 얻어오는 API입니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID            :: I :: N ::          :: 검색할 Dataset의 Column ID
 * @param {String} strVal              :: I :: N ::          :: 검색할 Dataset의 Column Value
 * @param {Integer} nStartIdx          :: I :: Y :: 0        :: 검색할 시작 레코드 Index
 * @param {Integer} nEndIdx            :: I :: Y :: rowCount :: 검색할 마지막 레코드 Index+1
 * @return {Integer} Dataset의 Column ID와 Column Value에 해당하는 레코드 Index. 만족하는 레코드가 없을 경우 -1 을 Return 합니다.
 * @author 조지용
 * @useMobile use
 * @example ngmf.findRowNF("dst_msg", "msg_ctt", "&ITEM");
 * @exampleAsIs DsSample.FindRowNF("DS_MEMBER","HongGilDong");
 */
ngmf.findRowNF = function(dataSetId, strColID, strVal, nStartIdx, nEndIdx){
	try{
		var rtnVal = -1;
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return;
		}
		
		if ( typeof strColID == "undefined" || strColID ==  null || strColID === "") {
			return;
		}
		
		if ( typeof strVal == "undefined" || strVal ==  null || strVal === "") {
			return;
		}
		
		var colIdx = dataSetObj.getColumnIndex(strColID);
		
		if ( typeof colIdx == "undefined" || colIdx ==  null || colIdx === "") {
			return;
		}
		
		var colDataArr = dataSetObj.getColData(colIdx);
		
		if (typeof nStartIdx != "number") {
			nStartIdx = 0;
		}
		if (typeof nEndIdx != "number") {
			nEndIdx = colDataArr.length;
		}
		if (nEndIdx > colDataArr.length) {
			nEndIdx = colDataArr.length;
		}
		for (var i = nStartIdx; i < nEndIdx; i++) {
			if (colDataArr[i] == strVal) {
				rtnVal = i;
				break;
			} 
		}
		return rtnVal;		
		
	} catch (e) {
		ngmf._error("[ngmf.findRowNF] Exception :: ", e);
	}
}; 

/**
 * 특정 Column의 값을 검색 후 그 Record에 해당하는 지정된 Column의 값을 가지고 오는 API입니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String / Object} dataSetId  :: I :: N ::          :: 대상 DataSet 컴포넌트 ID
 * @param {String} strColID            :: I :: N ::          :: 검색할 Column ID
 * @param {String} strCmpVal           :: I :: N ::          :: 검색할 Column 값
 * @param {String} strOutputColID      :: I :: N ::          :: 얻어오고자 하는 Column ID
 * @return {Integer / String} 특정 Column의 값을 검색 후 그 Record에 해당하는 지정된 Column 값. 해당 Column이 없을 경우에는 Null을 Return 합니다.
 * @author 조지용
 * @useMobile use
 * @example ngmf.lookup("dst_msg", "msg_typ_cd", "E", "msg_ctt");
 * @exampleAsIs DsSample.Lookup("DS_NUM", 2, "DS_MONEY");
 */
ngmf.lookup = function(dataSetId, strColID, strCmpVal, strOutputColID){
	try{
		var rtnVal = null;
		var dataSetObj = ngmf.object(dataSetId);
		
		if ( typeof dataSetObj == "undefined" || dataSetObj ==  null || dataSetObj === "") {
			return rtnVal;
		}
		
		if ( typeof strColID == "undefined" || strColID ==  null || strColID === "") {
			return rtnVal;
		}
		
		if ( typeof strCmpVal == "undefined" || strCmpVal ==  null || strCmpVal === "") {
			return rtnVal;
		}
		
		var colIdx = dataSetObj.getColumnIndex(strColID);
		
		if ( typeof colIdx == "undefined" || colIdx ==  null || colIdx === "") {
			return rtnVal;
		}
		
		var colDataArr = dataSetObj.getColData(colIdx);
		var nEndIdx = colDataArr.length;
		var rowIdx = -1;
		
		for (var i = 0; i < nEndIdx; i++) {
			if (colDataArr[i] == strCmpVal) {
				rowIdx = i;
				break;
			} 
		}
		
		if(rowIdx < 0){
			return rtnVal;
		} else if(typeof dataSetObj.getColumnIndex(strOutputColID) == "undefined") {
			return rtnVal;
		} else {
			rtnVal = dataSetObj.getAllJSON()[rowIdx][strOutputColID];
		}
		
		return rtnVal;		
		
	} catch (e) {
		ngmf._error("[ngmf.lookup] Exception :: ", e);
	}
}; 


/**
 * 컴포넌트의 선택영역을 설정하는 API입니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String / Object} objId  :: I :: N ::    :: 대상 컴포넌트 ID
 * @param {Integer} nBegin         :: I :: N :: 0  :: 선택영역의 시작위치
 * @param {Integer} nEnd           :: I :: N :: -1 :: 선택영역의 끝위치
 * @author 조지용
 * @useMobile use
 * @example ngmf.setSel("ipt_test", 3, 5);
 * @exampleAsIs TextArea0.SetSel(0, 10);
 */
ngmf.setSel = function(objId, nBegin, nEnd){
	try{
		var obj = ngmf.object(objId);
		
		var targetObj = $("#" + obj.getID())[0];
		
		if ( typeof targetObj == "undefined" || targetObj ==  null || targetObj === "") {
			return;
		}
		
		if(targetObj.tagName == "INPUT" || targetObj.tagName == "TEXTAREA") {
			if ( typeof nBegin == "undefined" || nBegin ==  null || nBegin === "") {
				nBegin = 0;
			}
			
			if ( typeof nEnd == "undefined" || nEnd ==  null || nEnd === "" || nEnd == -1) {
				nEnd = obj.getValue().length;
			}
			
			targetObj.setSelectionRange(nBegin, nEnd);
		}
		
	} catch (e) {
		ngmf._error("[ngmf.setSel] Exception :: ", e);
	}
}; 

/**
 * 지정한 Index 앞에 TabPage를 삽입하는 API입니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String / Object} tabId  :: I :: N ::     :: 대상 tabControl 컴포넌트 ID
 * @param {String} strID           :: I :: N ::     :: 추가할 TabPage의 ID
 * @param {Integer} nIdx           :: I :: N :: -1  :: 추가할 TabPage의 Index(지정된 Index 앞에 삽입되며, Index가 -1이면 맨 뒤에 추가 됩니다)
 * @param {String} strURL          :: I :: N ::     :: 추가할 TabPage에 연결할 Form의 URL
 * @param {String} strText         :: I :: Y ::     :: 추가할 Tab Page의 Title
 * @param {String} strImage        :: I :: Y ::     :: 추가할 Tab Page의 Title Image ID(사용안함)
 * @author 조지용
 * @useMobile use
 * @example ngmf.insertTab("tab_tabControl1", "tabpg00", 0, "../../EDU/xml/grd_crud.xml", "NewPage");
 * @exampleAsIs Tab0.InsertTab("tab2", 2, "Tutorial::SubForm", "tab2", "");
 */
ngmf.insertTab = function(tabId, strID, nIdx, strURL, strText, strImage){
	try{
		var tabObj = ngmf.object(tabId);
		
		if ( typeof tabObj == "undefined" || tabObj ==  null || tabObj === "" || tabObj.getPluginName() != "tabControl") {
			return;
		}
		
		if ( typeof strID == "undefined" || strID ==  null || strID === "") {
			return;
		}
		
		if ( typeof strURL == "undefined" || strURL ==  null || strURL === "") {
			return;
		}
		
		if ( typeof nIdx == "undefined" || nIdx ==  null || nIdx === "") {
			nIdx = tabObj.getTabCount();
		}
		
		var tapOpt = {
			label : strText || " ",
			closable : true,
			addTabIndex : nIdx
		};

		var contOpt = {
			alwaysDraw : true,
			wframe : true,
			src : strURL
		};

		tabObj.addTab(strID, tapOpt, contOpt );
		
	} catch (e) {
		ngmf._error("[ngmf.insertTab] Exception :: ", e);
	}
}; 

/**
 * 화면에 입력된 문자를 watermark를 생성합니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String} str   :: I :: N ::  :: watermark 입력 문자열.
 * @param {String} style :: I :: N ::  :: watermark 문자 스타일.(추후요청시 작업.)
 * @author 이동규
 * @update 이동규 2016-10-05 watermart 이미지 뿌옇게 나오는 화면 img 태그 이미지 src 수정.
 * @useMobile use
 * @examplengmf.watermark("P0XXXXX");
 */
ngmf.watermark = function (str, style) {
	try {
		var generator = function() {
	   		var date = new Date();
	   		var dateStr =  WebSquare.text.fillZero(date.getFullYear(),4) + "-" + 
	                	WebSquare.text.fillZero(date.getMonth()+1,2) + "-" + 
	                	WebSquare.text.fillZero(date.getDate(),2) + " ";
	                //WebSquare.text.fillZero(date.getHours(),2) + ":"
	                //WebSquare.text.fillZero(date.getMinutes(),2) + ":" + WebSquare.text.fillZero(date.getSeconds(),2);
            var watermarkMsg = str + "     " + str + "     " + str + "     " + str + "     " + str + "     ";
            var dateStr = dateStr + "     " + dateStr + "     " + dateStr + "     " + dateStr + "     " + dateStr + "     ";
            var wCanvas = document.getElementById("watermarkCanvas");
            if (!wCanvas) {
            	wCanvas = document.createElement("canvas");
            	wCanvas.id = "watermarkCanvas";
                wCanvas.style.position="fixed";
                wCanvas.style.pointerEvents="none";
                wCanvas.style.top="0px";
                wCanvas.style.left="0px";
                wCanvas.style.right="0px";
                wCanvas.style.bottom="0px";
                wCanvas.style.zIndex = 9999;
                document.body.appendChild(wCanvas);
            }

            wCanvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            wCanvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var ctx = wCanvas.getContext("2d");
            ctx.globalAlpha = 0.05;
            ctx.rotate(Math.PI*5.60/3);
            ctx.fillStyle    = '#000';
            ctx.font         = "120px 'MalgunGothicWeb','맑은 고딕', '나눔 고딕', 'Dotum', 'droid sans fallback', 'AppleGothic', 'sans-serif'";
            ctx.fillText  (watermarkMsg, -340, 200);        //ctx.fillText  ("text", X, Y);
            ctx.fillText  (dateStr,-900, 500);              //ctx.fillText  ("text", X, Y);
            ctx.fillText  (watermarkMsg,-350, 800);         //ctx.fillText  ("text", X, Y);
            ctx.fillText  (dateStr,-550, 1100);             //ctx.fillText  ("text", X, Y);
            ctx.fillText  (watermarkMsg, 300, 1400);        //ctx.fillText  ("text", X, Y);
	  	};
	  	
	  	window.onresize = generator;
	   	if (GLV.cavasId !== str) {
	   		GLV.cavasId = str;
	   		generator();
	   		var cavasComp = document.getElementById("watermarkCanvas");
	   		cavasComp.style.display = "none";
	   		GLV.cavasData = cavasComp.toDataURL();
		}

   		var imgComp = document.getElementById("watermarkImg") || document.createElement("img");	   		
   		if (GLV.cavasData.length > 0 && imgComp) {
   			imgComp.src = GLV.cavasData;
   			imgComp.setAttribute("id", "watermarkImg");
   			imgComp.setAttribute("class", "watermark");
   			document.body.appendChild(imgComp);
   		}
	} catch(e) {
		ngmf._error("[ngmf.watermark] Exception :: ", e);
	}
};



/**
 * Session의 상태를 설정하는 API 입니다.
 * @date 2016-05-31
 * @memberOf ngmf
 * @param {Boolean} bSuccess  :: I :: N :: true :: Session의 초기화 성공 여부
 * @author 조지용
 * @useMobile use
 * @example ngmf.initSession(true);
 * @exampleAsIs InitSession(True);
 */
ngmf.initSession = function(bSuccess){
	try{
		if (GLV && typeof GLV == "object") {
			GLV.G_Init_Session = (bSuccess != false) ? 1 : -1;
		} 
		
	} catch (e) {
		ngmf._error("[ngmf.initSession] Exception :: ", e);
	}
}; 


/**
 * TextArea의 입력 Caret이 위치한 마지막 Index를 구하는 API 입니다.
 * @date 2016-05-30
 * @memberOf ngmf
 * @param {String} compId :: I :: N ::  :: 선택할 TextArea 컴포넌트.
 * @return {Number} Caret의 마지막 Index를 반환합니다.
 * @author 조지용
 * @useMobile use
 * @example ngmf.getCaretEndPos("txa_test");
 * @exampleAsIs
 */
ngmf.getCaretEndPos = function (compId) {
	try{
		var comp = ngmf.object(compId);

		var result = "";
		if (typeof comp != "undefined" && comp.getPluginName() == "textarea") {
			result =$("#"+comp.id).prop("selectionEnd");
		}

		return result;
	} catch (e) {
		ngmf._error("[ngmf.getCaretEndPos] Exception :: ", e);
	}
};

/**
 * 화면에 존재하는 floatingLayer를 지정된 위치에 보여줍니다. (지정된 위치가 없을경우 화면 정중앙에 위치.)
 * @date 2016-05-30
 * @memberOf ngmf
 * @param {String} floatingLayerId :: I :: N ::  :: floatingLayer 문자열 아이디.
 * @param {String} nLeft           :: I :: N ::  :: left Position.
 * @param {String} nTop            :: I :: N ::  :: top Position.
 * @return {String} 정상적으로 셋팅결과 반환 (정상 "1" , 비정상 "")
 * @author 이동규
 * @useMobile use
 * @example ngmf.showFloatingLayer( "flt_testPage", 100, 40);
 */
ngmf.showFloatingLayer = function(floatingLayerId, nLeft, nTop) {
	var result = "";
	try {
		var comp = ngmf.object(floatingLayerId);
		if (comp ) {
			if (comp.getStyle("display") == "none") {
				comp.show("");
			}
			if (comp.getStyle("position") != "absolute") {
				comp.setStyle("position", "absolute");
			}

			var setLeft = (typeof nLeft != "undefined" && !isNaN(nLeft)) ? nLeft : "";
			var setTop = (typeof nTop != "undefined" && !isNaN(nTop)) ? nTop : "";
			var scaleValue = GLD.WebSquare.BootLoader.fullViewRatio;
			if (setLeft == "") {
				var compWidth = $("#" + comp.getID()).width();
				var pageWidth = $("body").outerWidth();
				setLeft = pageWidth/2 - compWidth/2;
			}

			if (setTop == "") {
				var compHeight = $("#" + comp.getID()).height();
				var pageHeight = $("body").outerHeight();
				setTop = pageHeight/2 - compHeight/2;
			}
			comp.setPosition(setLeft, setTop);
			result = "1";
		}
	} catch(e) {
		ngmf._error("[ngmf.showFloatingLayer] Exception :: ", e);
	}
	return result;
};

/**
 * 화면에 존재하는 floatingLayer를 숨깁니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String} floatingLayerId :: I :: N ::  :: floatingLayer 문자열 아이디.
 * @return {String} 정상적으로 셋팅결과 반환 (정상 "1" , 비정상 "")
 * @author 이동규
 * @useMobile use
 * @example ngmf.hideFloatingLayer("flt_testPage");
 */
ngmf.hideFloatingLayer = function(floatingLayerId) {
	var result = "";
	try{ 
		var comp = ngmf.object(floatingLayerId);
		if (comp) {
			if (comp.getStyle("display") != "none") {
				comp.hide();
			}
			result = "1";
		}
	} catch(e) {
		ngmf._error("[ngmf.hideFloatingLayer] Exception :: ", e);
	}
	return result;
};

/**
 *  screenNm으로 포커스 주기(비공개)
 * @date 2016.06.07
 * @memberOf ngmf
 * @param {String} screenNm :: I :: N ::  :: 대상 ScreenNm
 * @param {Object} mdi :: I :: N ::  :: 선택된 MDI 객체
 * @returns {Boolean}  
 * @author 성일호
 * @update 2016.06.24 이동규 getWindow 통합작업.
 * @useMobile use
 */
ngmf._selectWindowToId = function(screenNm,_mdi) {
	try {
		var mdi = _mdi || ngmf.mdiTabs();
		if (!mdi) return false;
        for (var i = 0; i < mdi.windows.length; i++) {
            var mdiWin = mdi.windows[i];
            if (screenNm == mdiWin.title) {            	
            	mdi.setFocus(i);
				return true;
            }
        } 
	} catch (e) {
		ngmf._error("[ngmf._selectWindowToId] Exception :: ", e);
	}
	return false;
};


/**
 *  Wframe commonInitForm 호출 함수
 *  페이지내 TabControl 이나 Switch Control이 있을 경우 활성화된 요소내 Wframe 을 우선 실행한다.
 * @date 2016.06.09
 * @memberOf ngmf 
 * @returns {Boolean}  
 * @author 성일호
 * @useMobile use
 */
ngmf._executeCommonInitForm = function () {
	var wframeObj = [];
	var commonInitForms = [];
	var bRet = false;
	try {
		var target = WebSquare.getBody().getAllChildren();
		var compIdx = -1;
		var scwinObj = null;
		var wframes = null;
		for(var idx = 0; idx < target.length; idx++) {
			if (typeof target[idx].getPluginName == "function" ) {
				compIdx = -1;
				scwinObj = null;
				wframes = [];
				if (ngmf.toLower(target[idx].getPluginName()) === "wframe") {
					var wscwinObj = target[idx].getObj("scwin" );
					if ((typeof wscwinObj != "undefined") && ( typeof wscwinObj.commonInitForm === "function" )) {
						commonInitForms.push(wscwinObj.commonInitForm); 
					}
				} else if (ngmf.toLower(target[idx].getPluginName()) === "tabcontrol") {
					compIdx = target[idx].getSelectedTabIndex();
					wframes = ngmf.getWframes(target[idx].getFrame(compIdx));
					
					for ( var idxWframe = 0; idxWframe < wframes.length; idxWframe++) {
						scwinObj = wframes[idxWframe].getObj("scwin");
						if ((typeof scwinObj !== "undefined") && (typeof scwinObj.commonInitForm === "function")) {
							try {
								scwinObj.commonInitForm();
							} catch (e) {
								ngmf._error("[ngmf._executeCommonInitForm TabControl("+ target[idx].getID() +")] Exception :: ", e);
							}
						}
					}
				} else if (ngmf.toLower(target[idx].getPluginName()) === "switch") {
					compIdx = target[idx].getSelectedIndex(); 
					wframes = ngmf.getWframes( target[idx].childControlList[compIdx] );
	    			
					for (var idxWframe = 0; idxWframe < wframes.length; idxWframe++) {
	    				scwinObj = wframes[idxWframe].getObj("scwin" );
						if ((typeof scwinObj !== "undefined") && ( typeof scwinObj.commonInitForm === "function" )) {
							try {
								scwinObj.commonInitForm();
							} catch (e) {
								ngmf._error("[ngmf._executeCommonInitForm SWITCH("+ target[idx].getID() +")] Exception :: ", e);
							}
						}
					}
				}
			}  
		}
		if (commonInitForms && commonInitForms.length > 0) {
			for (var idx = 0; idx < commonInitForms.length; idx++) {
				try {
					commonInitForms[idx]();
				} catch (e) {
					ngmf._error("[ngmf._executeCommonInitForm WFrame["+ idx +"] Exception :: ", e);
				}
			}
		}
		bRet = true;
	} catch(e) {
		ngmf._error("[ngmf._executeCommonInitForm] Exception :: ", e);
	}
	return bRet;
};

/**
 * 멀티링크 안에있는 링크중 하나를 선택하여 비활성화 ,활성화 시킵니다. 
 * @date 2016-05-30
 * @memberOf ngmf
 * @param {String} multiLinkID :: I :: N ::  :: 멀티링크 버튼 ID 
 * @param {Number} rowIndex    :: I :: N ::  :: 링크의 순서번호 (0번지부터 시작)
 * @param {Boolean} isEnable   :: I :: N ::  :: 비활성화(true),활성화(false)
 * @param {Boolean} allEnable  :: I :: N ::  :: 링크 전체 적용 여부 (true/false) [default:false]
 * @return 없음
 * @author 김응한
 * @useMobile check
 * @example ngmf.enableMultiLinkedBtn("lnk_linkBtn1", 0 , true)
 */
ngmf.enableMultiLinkedBtn = function(multiLinkID, rowIndex, isEnable, allEnable) {
	try {
		var multiLinkedComp = ngmf.object(multiLinkID);
		if (typeof multiLinkedComp == "undefined") {
			return;
		} else {
			var multiLinkDivObj = $("#" + multiLinkedComp.getID() + "_linkDiv"); //멀티링크버튼 ID 
			if (multiLinkDivObj.length > 0) {
				if(typeof isEnable != "boolean"){
					if(WebSquare.util.isNumber( isEnable ) ){
						if(isEnable <= 0){
							isEnable = false;
						}else{
							isEnable = true;
						}
					}else{
						return;
					}
				}
				
				_setEnable = function (target, type, isEnable) {
					if (isEnable) {
						linktype = linktype.replaceAll("_disalbed", "");
						$(targetChild).attr("linktype", linktype);
						$(targetChild).addClass("pop_link");
						$(targetChild).removeClass("disabled");
					} else {
						linktype += "_disalbed";
						$(targetChild).attr("linktype", linktype);
						$(targetChild).removeClass("pop_link");
						$(targetChild).addClass("disabled");
					}
				}

				if (WebSquare.util.getBoolean(allEnable)) {
					var childs = multiLinkDivObj.children(); //멀티링크 내에 있는 링크 
					for (var i = 0; i < childs.length; i++) {
						var targetChild = childs[i]; //링크 위치 
						var linktype = $(targetChild).attr("linktype"); //링크의 linktype 속성값
						if (typeof linktype == "undefined") {
							return;
						}
						_setEnable(targetChild, linktype, isEnable)
					}
				} else {
					if(typeof rowIndex < 0 || !WebSquare.util.isNumber( rowIndex ) ){
						return;
					}

					var childs = multiLinkDivObj.children(); //멀티링크 내에 있는 링크 
					var targetChild = childs[rowIndex]; //링크 위치 
					var linktype = $(targetChild).attr("linktype"); //링크의 linktype 속성값

					if (typeof linktype == "undefined") {
						return;
					}

					_setEnable(targetChild, linktype, isEnable)
				}
			}
		}		
	} catch (e) {
		ngmf._error("[ngmf.enableMultiLinkedBtn] Exception :: ", e);
	}
};

/**
 * 실행 화면이 모바일 환경인지 확인 여부.
 * @date 2016-06-15
 * @memberOf ngmf
 * @return {Boolean} 모바일 환경일 경우 true / 아닌경우 false 반환.
 * @author 이동규
 * @example ngmf.isMobile();
 * @useMobile use
 */
ngmf.isMobile = function () {
	var returnVal = false;
	try {
		returnVal = WebSquare.util.isMobile();
	} catch(e) {
		ngmf._error("[ngmf.isMobile] Exception :: ", e);
	}
	return returnVal;
};

/**
 * 실행 화면이 스마트폰인지 Tablet인지 확인
 * @date 2016-06-20
 * @memberOf ngmf
 * @return {String} 스마트폰일 경우 "S", Tablet일 경우 "T"
 * @author 연보람
 * @example ngmf.getDeviceType();
 * @useMobile use
 */
ngmf.getDeviceType = function () {
	var returnVal = "";
	try {
		if ( WebSquare.core.browserCheck.android ) {
			if( navigator.userAgent.toLowerCase().indexOf( "mobile" ) < 0 ){
				returnVal = "T";
			} else {
				returnVal = "D";
			}
		} else {
			if( navigator.userAgent.toLowerCase().indexOf( "ipad" ) >= 0 ){
				returnVal = "T";
			} else {
				returnVal = "D";
			}
		} 
	} catch(e) {
		ngmf._error("[ngmf.getDeviceType] Exception :: ", e);
	}
	return returnVal;
};

/**
 * window에 postMessage이벤트리스너를 추가하는 API 입니다.
 * @date 2016-06-17
 * @memberOf ngmf
 * @author 조지용
 * @param {String} sendUrl      :: I :: N ::  :: 이벤트 발생을 허용시킬 대상url
 * @param {String} callBackName :: I :: N ::  :: 이벤트 발생시 호출할 함수명(업무화면내에서 정의된 함수만 사용가능)
 * @useMobile use
 * @example ngmf.addMessageEvent("http://ap1.sktelecom.com:8060", "scwin.returnMessage");
 */ 
ngmf.addMessageEvent = function(sendUrl, callBackName) {
	try {	
		if( typeof sendUrl == "undefined" || sendUrl ==  null || sendUrl == "") {
			return;
		}
	
		if( typeof callBackName == "undefined" || callBackName ==  null || callBackName == "") {
			return;
		} else {
			if (callBackName.startsWith("scwin.")) {
				callBackName = callBackName.replace("scwin.", "");
			}
		}
		
		var func = window.scwin[callBackName];
		
		if( typeof func == "undefined" || func ==  null || func == "") {
			return;
		}
		
		window.addEventListener('message', function(e) {
			if(e.origin !== sendUrl) {
				return;
			}
			
			func.call(this, e.data);
		});
	} catch(e) {
		ngmf._error("[ngmf.addMessageEvent] Exception :: ", e);
	}		
};

/**
 * 컴포넌트의 left , top 위치를 변경하는 API입니다. 
 * @date 2016-06-23
 * @memberOf ngmf
 * @param  {Object}{String} compId  :: I :: N ::  :: 컴포넌트 ID 
 * @param  {JSON} position  :: I :: N ::  :: 변경할 left 와 top의 offset 값 
 * @author 김응한
 * @useMobile check
 * @returns {Boolean}  offset값 변경 성공여부
 * @example 
 * 		 ngmf.setPosition(btn_search,{top:80,left:1100}); //top,left 모두 변경
		 ngmf.setPosition(btn_search,{top:80}); // top,left 중 하나만 변경 
	
 */
ngmf.setPosition = function(compId, position) {
	try {

		var comp = ngmf.object(compId);
		if (typeof comp === "undefined") {
			return false;
		} else {
			compId = comp.id;
		}

		if (!ngmf.isJSON(position)) {
			return false;
		}

		var pos = {};
		var flag = false;

		if (position.left && !isNaN(Number(position.left))) {

			pos.left = position.left; //변경할 left 값이 온 경우 
			flag = true;
		}

		if (position.top && !isNaN(Number(position.top))) {

			pos.top = position.top; //변경할 top 값이 온 경우
			flag = true;
		}

		if (!flag) { //left나 top값의 변경이 없는 경우 
			return false;
		} else {
			$("#" + $w.getRuntimeId(compId)).offset(pos);
			return true;

		}

	} catch (e) {
		ngmf._error("[ngmf.setPosition] Exception :: ", e);
	}
};

/**
 * 컴포넌트의 이벤트 keyCode를 가져옵니다. 
 * @date 2016-06-23
 * @memberOf ngmf
 * @param  {Object}{String} compId  :: I :: N ::  :: 컴포넌트 ID 
 * @param  {Object} event  :: I :: N ::  :: 컴포넌트의 이벤트 객체 
 * @author 김응한
 * @useMobile check
 * @returns {Number}  EventKeyCode
 * @example 
 	
 	scwin.btn_save_onclick = function(e) {
		
			var keyCode = ngmf.getEventCode(this, e);
			ngmf._error(typeof e);
	};
 	 
*/
ngmf.getEventKeyCode = function(comp,event){
	try{
		var comp = ngmf.object(comp); 
		if (typeof comp === "undefined") {
			return;
		} 
		return WebSquare.util.getKeyCode(comp, event);
	} catch(e){
		ngmf._error("[ngmf.getEventKeyCode] Exception :: ", e);
	}
};


/**  
 * 객체 내부 Wframe 찾아 form_onLoadCompleted 실행하는 내부 함수
 * @date 2016.06.22
 * @memberOf ngmf
 * @param {String} wFrameObj :: I :: N ::  ::  wFrame 찾을 객체 
 * @return 
*/
ngmf._callFormOnloadCompletedToWframe = function (wFrameObj) {
	try { 
		var wframes = ngmf.getWframes(wFrameObj);
		for ( var idxWframe = 0; idxWframe < wframes.length; idxWframe++) {
			var scwinObj = wframes[idxWframe].getObj("scwin");
			var scvarObj = wframes[idxWframe].getObj("scvar");
			if ((typeof scwinObj !== "undefined") && (typeof scwinObj.form_onLoadCompleted === "function")) {
				try {
					scvarObj["__screenName"] = ngmf.getFormID(scwinObj);
					scwinObj.form_onLoadCompleted();
				} catch (e) {
					ngmf._error("[ngmf._callFormOnloadCompletedToWframe Wframe("+ ngmf.getMyWframeId(scwinObj) +")] Exception :: ", e);
				}
			}
		}	 
	} catch (e) {
		ngmf._error("[ngmf._callFormOnloadCompletedToWframe] Exception :: ", e);
	}
};

//---------------------------------------------------------------------------------------
/**
 * 고객 화면 탭을 선택하거나 현재 선택된 고갭탭의 MDI 화면을 반환하는 API 입니다.
 * @date 2016-06-24
 * @memberOf ngmf
 * @param {Number} index :: I :: Y ::   :: 탭 Index. or ID
 * @author 이동규
 * @return {Object} 현재 선택된 고객탭의 MDI 객체 반환.
 * @update 2016.06.24 이동규 getWindow 통합작업.
 * @update 2016.08.03 성일호 기능확장.
 * @example ngmf.mdiTabs(1); // 2번째 고객탭 선택 [고객탭 0 부터 시작.]
 * @example ngmf.mdiTabs(); // 현재 선택된 고객탭 반환.
 * @exampleAsIs
 * @useMobile useless
 */
ngmf.mdiTabs = function (index) {
	var returnMDI = {id : ""};
	if(ngmf.isMobile() || GLV.G_FORMUSEFG == "D" || GLV.G_FORMUSEFG == "T" || !GLV.G_FORMUSEFG ) {
		ngmf._error("ngmf.mdiTabs ERROR : 모바일환경에서 지원불가 API 입니다.");
		returnMDI["id"] = GLV.G_FORMUSEFG;
		return returnMDI;
 	}
 
 	try{
  		var tabComp;
  		var isMain = true;
 		if (ngmv.isPopupWorkspace) {
 			tabComp = ngmv.mainTop.ngmf.object("subMainTab");
 			isMain = false;
 		} else {
	  		tabComp = GLD["mainTab"];
 		}

  		//GLV.G_FORMUSEFG = GLV.G_FORMUSEFG || "M";//임시코딩.
  		if (typeof tabComp != "undefined" && typeof tabComp.getSelectedTabIndex == "function") {
   			if (typeof index != "undefined") {
   				if (isNaN(index) && index.startsWith("mdi")) {
   					for (var i = 0; i < tabComp.tabArr.length ; i++) {
   						if ( tabComp.tabArr[i]["userTabID"] ==  index) {
   							index = i;
   							break;
   						}
   					}
   				} 
   				if (!isNaN(index))
   					tabComp.setSelectedTabIndex(Number(index)); 
   			}
   			var mdiId = tabComp.getSelectedTabID();
   			if (isMain) {
   				returnMDI = GLD.ngmf.object(mdiId);
   			} else {
   				returnMDI = ngmv.mainTop.ngmf.object(mdiId);
   			}
  		}
	} catch (e) {
		ngmf._error("[ngmf.mdiTabs] Exception :: ", e);
	}
 	return (typeof returnMDI != "undefined" ? returnMDI : {id : ""});
};


/**
 * 	현재 열린 모든 윈도우 (MDI, SDI,POPUP, MOBILE IFRAME )를 찾아주는 API
 * 파라미터가 없을 경우 현재 열린 모든 윈도우 정보를 반환
 *  메인 : 윈도우ID|MDI ID|구분(M)  ex) ZNGMSLIN00020_TEMP|mdi01|M
 *  팝업 : 팝업ID|MDI ID|구분(M)|Parent ID  ex) ZNGMSCAP20010|mdi01|P|ZNGMSLIN00020_TEMP
 * @date 2016-08-18
 * @memberOf ngmf
 * @param {String} windowId :: I :: Y ::   :: 윈도우 ID
 * @param {String} allMDI :: I :: Y ::   ::  allMDI = null 이거나 allMDI =ALL  일경우 전체 MDI에서 검색, 모바일일 경우 GLV.G_FORMUSEFG
 * @param {String} parentId :: I :: Y ::   :: Parent ID :팝업을 찾을 경우 해당 팝업을 오픈한 Parent ID,Parent 가 없을경우   
 * @author 성일호
 * @return {Array} Window 관련 정보를 배열로 반환 Window 관련 정보를 배열로 반환 ex ["ZNGMSCAP20010|mdi01|P|ZNGMSLIN00020_TEMP", "ZNGMSLIN00020_TEMP|mdi01|M"]
 * @example 
 		1. var allWindowInfoArray = ngmf.getWindowInfo(); // 현재열린 모든 윈도우 정보
 		2. var mdi01WindowInfoArray = ngmf.getWindowInfo(null,"mdi01"); //mdi01 에서 열린 모든 윈도우 정보
 		3, var mdi01MainWindowInfoArray = ngmf.getWindowInfo(null,"mdi01", "M"); //mdi01 에서 열린 모든 메인 윈도우 정보, 팝업은 조회되지 않음
 		4, var mdi01PopupWindowInfoArray = ngmf.getWindowInfo(null,"mdi01", "P"); //mdi01 에서 열린 모든 팝업 윈도우 정보, 메인은 조회되지 않음
 		5, var mainWindowInfoArray = ngmf.getWindowInfo(null,"ALL", "M"); //열린 모든 메인 윈도우 정보, 팝업은 조회되지 않음
 		6, var popupWindowInfoArray = ngmf.getWindowInfo(null,"ALL", "P"); //열린 모든 팝업 윈도우 정보, 메인은 조회되지 않음
 		
 * @useMobile use
 */
ngmf.getWindowInfo = function (windowId, allMDI, parentId) {
	return ngmf._getWindowInfo (windowId, allMDI, parentId) ;
}
ngmf._getWindowInfo = function (windowId, allMDI, _parentId) {
	var retWinArr = new Array();
	try {
		var schwindowId = "";
		var chkMdi = "";
		var chkParent = "";
		var chkStart = true;
		if (typeof GLV.allWindows == "undefined") {
			GLV.allWindows = [];
			return retWinArr;
		}
		var parentId = _parentId || "";
		if ( typeof allMDI != "undefined" && allMDI && allMDI !== "ALL") {
			
			if (allMDI.startsWith("main"))  {
				allMDI = "main";
				chkMdi = "|main";
			} else {
				if (GLV.G_FORMUSEFG == "M" || GLV.G_FORMUSEFG == "S")  {
					chkMdi = "|" + ngmf.mdiTabs(allMDI).id 
				} else {
					chkMdi = "|" + GLV.G_FORMUSEFG ;
				}
			}
		}		
		schwindowId = chkMdi;
		
		if (typeof windowId == "undefined" || !windowId)  {
			chkStart = false;
		}
		
		if (typeof parentId != "undefined" && parentId ) {
			if (parentId.length > 1) {
				chkParent = "|P|" +parentId ; 
			} else {
				chkParent = "|" +parentId ;
			}
			schwindowId += chkParent ; 
		}
		var fildWinInfo = null;
		for (var i=0; i< GLV.allWindows.length ; i++) {
			fildWinInfo = null;
			if (chkStart) {
				if(GLV.allWindows[i].startsWith(windowId)) { 
					if (schwindowId) {
						if (GLV.allWindows[i].indexOf(schwindowId ) > -1)  retWinArr.push(GLV.allWindows[i]); 
					}  
					else  retWinArr.push(GLV.allWindows[i]);  
				}
			} else if (GLV.allWindows[i].indexOf(schwindowId) > -1) {
				retWinArr.push(GLV.allWindows[i]);
			}
		}
		if (retWinArr.length > 0 ) retWinArr.sort();
	} catch (e) {
		ngmf._error("[ngmf._getWindowInfo] Exception :: ", e);
	} 
	return retWinArr;
};
ngmf._setWindowInfo = function (windowId, _mdiId) {
	try {
		if (typeof GLV.allWindows == "undefined") {
			GLV.allWindows = [];
		}
		if (!windowId) return false;
		if (windowId.indexOf("main") > -1) return true;
		var mdiID = "";
		if (typeof _mdiId != "undefined" && _mdiId && _mdiId.startsWith("main"))  {
			mdiID = "main"; 
		} else {
			if (GLV.G_FORMUSEFG == "M" || GLV.G_FORMUSEFG == "S") {
				if(ngmv.isPopupWorkspace) {
					mdiID =  (_mdiId ||( ngmv.mainTop["subMainTab"].getSelectedTabID() || GLV["G_ACTIVE_MDIID"]));
				} else {
					mdiID =  (_mdiId ||( ngmv.mainTop["mainTab"].getSelectedTabID() || GLV["G_ACTIVE_MDIID"]));
				}
			}
			else mdiID =  GLV.G_FORMUSEFG;	
		}
		
		if (mdiID && mdiID.startsWith("main"))  {
			mdiID = "main"; 
		}
 
		windowId += "|" + mdiID ;	
		if (ngmf.isPopup()) {
			windowId += "|" + "P" ;
			if (WebSquare["parentForm"]) 
				windowId += "|" +  WebSquare["parentForm"].scvar.__screenName;
			else {
				ngmf.popupParam();
				if (WebSquare["parentForm"]) 
					windowId += "|" +  WebSquare["parentForm"].scvar.__screenName;
				else if (WebSquare["parentObj"])
					windowId += "|" +  WebSquare["parentObj"].scvar.__screenName;
			}
		} else {
			windowId += "|" + "M";
		}
		//리로드시 누적되지 않도록 수정
		for (var i=0; i< GLV.allWindows.length ; i++) {
			if (windowId == GLV.allWindows[i]) {
				return true;
			}
		}
		GLV.allWindows.push(windowId);
		return true;
	} catch (e) {
		ngmf._error("[ngmf._setWindowInfo] Exception :: ", e);
	} 
	return false;
};

ngmf._removeWindowInfo = function (_windowId, isPopup, _mdiId) {
	try {
		var windowId = "";
		var mdiID = "";
		if (typeof GLV.allWindows == "undefined") {
			GLV.allWindows = [];
		}
		if (!_windowId) return false;
		if (windowId.indexOf("main") > -1 || windowId.indexOf("subMain") > -1) return true;
		
		if (typeof _mdiId != "undefined" && _mdiId && _mdiId.startsWith("main"))  {
			mdiID = "main"; 
		} else {
			if (GLV.G_FORMUSEFG == "M" || GLV.G_FORMUSEFG == "S") {
				if(ngmv.isPopupWorkspace) {
					mdiID =  (_mdiId ||( ngmv.mainTop["subMainTab"].getSelectedTabID() || GLV["G_ACTIVE_MDIID"]));
				} else {
					mdiID =  (_mdiId ||( ngmv.mainTop["mainTab"].getSelectedTabID() || GLV["G_ACTIVE_MDIID"]));
				}
			}
			else mdiID =  GLV.G_FORMUSEFG;	
		}
		
		if (mdiID && mdiID.startsWith("main"))  {
			mdiID = "main"; 
		}
		windowId = _windowId + "|" + mdiID ;
		
		if (isPopup ||  ngmf.isPopup()) {
			windowId += "|" + "P";		
		} else {
			windowId += "|" + "M";
		} 

		for (var i=0; i< GLV.allWindows.length ; i++) {
			if (GLV.allWindows[i].startsWith(windowId)) {
				delete GLV.allWindows.splice(i,1);
				return true;
			}
		} 
	} catch (e) { 
		ngmf._error("[ngmf._removeWindowInfo] Exception :: ", e);
	} 
	return false;
};

/**
 * ExpandLayer 그룹을 설정하는 API 입니다.
 * @date 2016.06.27
 * @param {Object} btnComp :: I :: N ::  :: ExpandLayer 속성을 정의할 버튼
 * @param {Object} target  :: I :: N ::  :: ExpandLayer의 target 그리드Id
 * @param {Number} height  :: I :: Y ::  :: ExpandLayer 할 height의 크기
 * @sampleLink scm_expandLayer
 * @author 이동규
 * @useMobile use
 * @exampleAsIs
 */
ngmf.expandLayer = function(btnComp, target, height) {
	try {
		pubComm.expandLayer.apply(this, arguments);
	} catch(e) {
		ngmf._error("[ngmf.expandLayer] Exception :: ", e);
	}
};

/** 
 * 	Window Form ID 처리
 * @date 2015.10.01
 * @param {Object} tgtScwin :: I :: N ::  :: scwin 객체 
 * @memberOf ngmf
 * @return {String} 화면 FormID.
 * @sampleLink scm_popupMain
 * @author 이진수
 * @useMobile use
 * @sync true
 * @example ngmf.getFormID() ; ngmf.getFormID(scwin);
 * @update 2016.07.04 성일호 팝업일 경우 팝업 ID를 찾아 리턴하도록 수정 
 * @update 2016.07.21 성일호 scwin 객체를 이용하여 
 * @sampleLink scm_popupMain
 * @exampleAsIs ngmf_GetFormID()
 */
ngmf.getFormID =  function(tgtScwin){
	try {
		if (typeof tgtScwin != "undefined" && tgtScwin&& ngmf.getMyWframeId(tgtScwin)) { 
			return ngmf.getFileNameToUrl(ngmf.object(ngmf.getMyWframeId(tgtScwin)).getSrc()).replaceAll(".XML","").replaceAll(".xml","") ;
		} else {
			if (ngmf.isPopup() && WebSquare.net.getParameter("popupID")) {
				return WebSquare.net.getParameter("popupID");
			} else {
				var arr = WebSquare.w2xPath.split("/");
				var len = arr.length;
				var fileNm = arr[len - 1];
				
				if(fileNm != null && fileNm != ""){
					return fileNm.replace(".xml","");
				}else{
					return null;
				}	
			}			
		}
	} catch(e) {
		ngmf._error("[ngmf.getFormID] Exception :: ", e);
	}
};  

/*
 * Debugging에 사용하는 API로 로그정보
 */
/**
 * Debugging에 사용하는 API로 로그정보를 출력합니다.
 * @date 2015-10-20
 * @memberOf ngmf
 * @param {String} value :: I :: N ::  :: 로그에 출력할 String
 * @author 이동규
 * @update 16.03.30 이동규 trace 생성시 console.log 함수가 미존재시 분기처리.
 * @example ngmf._error("test1 : log 출력");
 * @exampleAsIs Trace("Compile Error");
 * @update  2016.06.22 성일호 로그 세분화
 */ 
ngmf.setLogLevel = function(level) {
	//ngmf.setLogLevel(ngmv.LOG_LOGS); 
	ngmv.LOG_LEVEL = level;
	if (ngmv.LOG_LOGS >= ngmv.LOG_LEVEL) {
		if (console.trace) {
			ngmf.trace = (function() {
				return Function.prototype.bind.call(console.trace, console, "[TRACE][" + ngmf.getFormID() + "]"+ ngmv["windowID"] +" :");
			})();
			ngmf._trace = (function() {
				return Function.prototype.bind.call(console.trace, console, "[TRACE][공통]"+ ngmv["windowID"] +" :");
			})();
		} else {
			if (console.log) {
				ngmf.trace = (function() {
					return Function.prototype.bind.call(console.log, console, "[TRACE][" + ngmf.getFormID() + "]"+ ngmv["windowID"] +" :");
				})();
				ngmf._trace = (function() {
					return Function.prototype.bind.call(console.log, console, "[TRACE][공통]"+ ngmv["windowID"] +" :");
				})();
			} else {
				ngmf.trace = function(value) {
					try {
						$w.log("trace : " + value);
					} catch (e) {
						ngmf.alert("TraceError: " + e);
					}
				};
			}
		}

		if (console.log) {
			ngmf.log = (function() {
				return Function.prototype.bind.call(console.log, console, "[LOGS][" + ngmf.getFormID() + "]"+ ngmv["windowID"] +" :");
			})();
			ngmf._log = (function() {
				return Function.prototype.bind.call(console.log, console, "[LOGS][공통]"+ ngmv["windowID"] +" :");
			})();
		} else {
			ngmf.log = function(value) {
				try {
					$w.log("log : " + value);
				} catch (e) {
					ngmf.alert("LogError: " + e);
				}
			};
		}
	} else {
		ngmf.trace = function() { };
		ngmf._trace = function() { };
		ngmf.log = function() { };
		ngmf._log = function() { };
	}
	
	if (ngmv.LOG_ERRORS >= ngmv.LOG_LEVEL) {
		if (console.error) {
			ngmf.error = (function() {
				return Function.prototype.bind.call(console.error, console, "[ERROR][" + ngmf.getFormID() + "]"+ ngmv["windowID"] +":");
			})();

			ngmf._error = (function() {
				return Function.prototype.bind.call(console.error, console, "[ERROR][공통]"+ ngmv["windowID"] +" :");
			})();
		} else {
			ngmf.error = function(value) {
				try {
					$w.log("error : " + value);
				} catch (e) {
					ngmf.alert("ErrorError: " + e);
				}
			};
		}
	} else {
		ngmf.error = function() { };
		ngmf._error = function() { };
	}

	if (ngmv.LOG_DEBUG >= ngmv.LOG_LEVEL) {
		if (console.debug) {
			ngmf.debug = (function() {
				return Function.prototype.bind.call(console.debug, console, "[DEBUG][" + ngmf.getFormID() + "]"+ ngmv["windowID"] +" :");
			})();

			ngmf._debug = (function() {
				return Function.prototype.bind.call(console.debug, console, "[DEBUG][공통]"+ ngmv["windowID"] +" :");
			})();

		} else {
			ngmf.debug = function(value) {
				try {
					$w.log("debug : " + value);
				} catch (e) {
					ngmf.alert("DebugError: " + e);
				}
			};
		}
	} else {
		ngmf.debug = function() { };
		ngmf._debug = function() { };
	}
};

ngmf._initPopup = function () {
	var returnValue = true;
	try{ 
		
	} catch (e) {
		ngmf._error("[ngmf._initPopup] Exception :: ", e);
	}
	return returnValue;
};

ngmf._getWindowID = function () {
	if (ngmv && ngmv["windowID"]) return ngmv["windowID"].substr(1,ngmv["windowID"].length-2);
	else if (scvar && scvar["__screenName"]) return scvar["__screenName"];
	else  return ""; 
};
/**
* 팝업중복 확인 후 아이디를 정해준다.
* 
* @date 2016. 7. 4.
* @memberOf 
* @param {String} popupId :: I :: N ::  :: 원하는 팝업 ID
* @returns {String} 중복되지 않은 POPUP ID
* @author 성일호
* @example
* @since
 */
ngmf._getPopupId =  function(popupId){
	try {
		if (typeof popupId == "undefined" || !popupId) return "";
		if (typeof  WebSquare.uiplugin.popup == "undefined")  return "";
		var dupCnt = ngmf._getPopupCnt(popupId) ;
		if (dupCnt > 0) return (popupId + dupCnt);
		else return popupId;
	} catch(e) {
		ngmf._error("[ngmf._getPopupId] Exception :: ", e);
	}
};
ngmf._getPopupCnt =  function(popupId){
	var dupCnt = 0;
	try {
		//메인이나 선행 팝업이 있을경우 
		if ( $("#" +popupId) &&  $("#" +popupId).length > 0 ) {
			dupCnt =  $("#" +popupId).length;
		}
		//동일명 팝업 갯수
		dupCnt += ngmf._getWindowInfo(popupId,null,scvar.__screenName).length;
		//동일명 있으면 2 부터 증가함
		if (dupCnt >0) return (dupCnt + 1) ;
	} catch(e) {
		ngmf._error("[ngmf._getPopupIdCnt] Exception :: ", e);
	}
	return dupCnt;
};

ngmf._getPopupWindow =  function(popupId){ 
	try { 
		if (typeof popupId == "undefined" || !popupId) return undefined;
		if (typeof  WebSquare.uiplugin.popup == "undefined")  return undefined;
		return WebSquare.uiplugin.popup.getPopupWindow(popupId);
	} catch(e) {
		ngmf._error("[ngmf._getPopupWindow] Exception :: ", e);
	}
	return undefined;
}; 

/**
 * 화면 메세지 팝업(보안 및 화면메모) 설정하는 API 입니다.
 * @date 2016.23.
 * @param {Object} pgMemoObj              :: I :: Y ::   :: pageMemo 설정 옵션.
 * @param {String} pgMemoObj.btnId        :: I :: Y ::   :: pageMemo 버튼 ID
 * @param {String} pgMemoObj.show_gb      :: I :: Y ::   :: 보기 구분 (필수 , S : 최초등록,단건처리 , M : 추가등록,다건처리 )
 * @param {String} pgMemoObj.svc_num      :: I :: N ::   :: 서비스번호 ( 고객약속 등록시 필요 , 필수 아님)
 * @param {String} pgMemoObj.svc_mgmt_num :: I :: Y ::   :: 서비스관리번호 ( 고객인증 확인시 필요 , 필수)
 * @param {String} pgMemoObj.op_memo_id   :: I :: Y ::   :: 업무처리메모ID ( 메모 아이디 조회를 위해 필요 , 없으면 신규로 메모등록)
 * @param {String} pgMemoObj.cont_grp_id  :: I :: Y ::   :: 접촉그룹id (접촉이력 등록시 필요 , 필수)
 * @param {String} pgMemoObj.chg_dt       :: I :: Y ::   :: 변경일자 (접촉이력 등록시 필요 , 필수)
 * @param {String} pgMemoObj.cont_hst_cd  :: I :: Y ::   :: 접촉이력구분코드 (접촉이력 등록시 필요 , 필수)
 * @author 이동규
 * @update 2016-08-19 이동규 wframe 내부 메모버튼 사용시 오류 수정.
 * @sync true
 * @useMobile use
 * @example ngmf.pgMemoLayer(btnComp);
 * @exampleAsIs
 */ 
ngmf.pgMemoLayer = function(pgMemoObj) {
	if (typeof pgMemoObj != "undefined") {
		var btnId = typeof pgMemoObj.btnId != "undefined" ? pgMemoObj.btnId : "";
		var show_gb = typeof pgMemoObj.show_gb != "undefined" ? ngmf.toUpper(pgMemoObj.show_gb) : "S";
		var svc_num = typeof pgMemoObj.svc_num != "undefined" ? pgMemoObj.svc_num : "";
		var svc_mgmt_num = typeof pgMemoObj.svc_mgmt_num != "undefined" ? pgMemoObj.svc_mgmt_num : "";
		var op_memo_id = typeof pgMemoObj.op_memo_id != "undefined" ? pgMemoObj.op_memo_id : "";
		var cont_grp_id = typeof pgMemoObj.cont_grp_id != "undefined" ? pgMemoObj.cont_grp_id : "";
		var chg_dt = typeof pgMemoObj.chg_dt != "undefined" ? pgMemoObj.chg_dt : "";
		var cont_hst_cd = typeof pgMemoObj.cont_hst_cd != "undefined" ? pgMemoObj.cont_hst_cd : "";
		var subScwin = typeof pgMemoObj.subScwin != "undefined" ? pgMemoObj.subScwin.$w.getRuntimeId("scwin") : "";

		if (btnId == "" || show_gb == "" || svc_mgmt_num == "") {
			ngmf.alert("업무메뉴 필수 입력값이 정상적으로 입력되지 않았습니다.");
			return;
		} else if (show_gb !== "S" && (cont_grp_id == "" || chg_dt == "" || cont_hst_cd == "")) {
			ngmf.alert("업무메뉴 필수 입력값이 정상적으로 입력되지 않았습니다.");
			return;
		} else {
			var options = {
				"btnId" : btnId,
				"show_gb" : show_gb,
				"svc_num" : svc_num,
				"svc_mgmt_num" : svc_mgmt_num,
				"op_memo_id" : op_memo_id,
				"cont_grp_id" : cont_grp_id,
				"chg_dt" : chg_dt,
				"cont_hst_cd" : cont_hst_cd,
				"subScwin" : subScwin
			};

			if (subScwin != "") {
				var isWframe = ngmf.getMyWframeId(pgMemoObj.subScwin);
				if (isWframe != "") options.myWframeId = ngmf.getMyWframeId(pgMemoObj.subScwin);
			}

			pubComm._pgMemoLayer(btnId, options);
		}
	} 
};

/**
 * 그리드의 inputype이 custom 일때 화면 메세지 팝업(보안 및 화면메모)을 설정하는 API 입니다.
 * @date 2016.23.
 * @param {Object} rowIndex :: I :: Y ::   :: 그리드 Cell의 rowIndex.
 * @param {Object} colIndex :: I :: Y ::   :: 그리드 Cell의 columnIndex
 * @param {Object} pgMemoObj              :: I :: Y ::   :: pageMemo 설정 옵션.
 * @param {String} pgMemoObj.btnId        :: I :: Y ::   :: pageMemo 버튼 ID
 * @param {String} pgMemoObj.show_gb      :: I :: Y ::   :: 보기 구분 (필수 , S : 최초등록,단건처리 , M : 추가등록,다건처리 )
 * @param {String} pgMemoObj.svc_num      :: I :: N ::   :: 서비스번호 ( 고객약속 등록시 필요 , 필수 아님)
 * @param {String} pgMemoObj.svc_mgmt_num :: I :: Y ::   :: 서비스관리번호 ( 고객인증 확인시 필요 , 필수)
 * @param {String} pgMemoObj.op_memo_id   :: I :: Y ::   :: 업무처리메모ID ( 메모 아이디 조회를 위해 필요 , 없으면 신규로 메모등록)
 * @param {String} pgMemoObj.cont_grp_id  :: I :: Y ::   :: 접촉그룹id (접촉이력 등록시 필요 , 필수)
 * @param {String} pgMemoObj.chg_dt       :: I :: Y ::   :: 변경일자 (접촉이력 등록시 필요 , 필수)
 * @param {String} pgMemoObj.cont_hst_cd  :: I :: Y ::   :: 접촉이력구분코드 (접촉이력 등록시 필요 , 필수)
 * @author 이동규
 * @update 2016-08-19 이동규 wframe 내부 메모버튼 사용시 오류 수정.
 * @sync true
 * @useMobile use
 * @example 
 *  //CustomFormatter = "scwin.pgGridMemoLayer" 설정.
 *	scwin.pgGridMemoLayer = function() {
 *		var btnOption = {
 *			btnId : "ID",
 *			show_gb : "M",
 *			svc_num : "svc_num",
 *			svc_mgmt_num : "svc_mgmt_num",
 *			op_memo_id : "memoId"+ rowIndex +"_"+colIndex,
 *			cont_grp_id : "cont_grp_id",
 *			chg_dt : "chg_dt",
 *			cont_hst_cd : "cont_hst_cd"
 *		};
 *		return ngmf.pgGridMemoLayer(rowIndex, colIndex, btnOption);
 *	};
 * @exampleAsIs
 */ 
ngmf.pgGridMemoLayer = function(rowIndex, colIndex, pgMemoObj) {
	if (typeof pgMemoObj != "undefined") {
		var btnId = typeof pgMemoObj.btnId != "undefined" ? pgMemoObj.btnId : "";
		var show_gb = typeof pgMemoObj.show_gb != "undefined" ? ngmf.toUpper(pgMemoObj.show_gb) : "S";
		var svc_num = typeof pgMemoObj.svc_num != "undefined" ? pgMemoObj.svc_num : "";
		var svc_mgmt_num = typeof pgMemoObj.svc_mgmt_num != "undefined" ? pgMemoObj.svc_mgmt_num : "";
		var op_memo_id = typeof pgMemoObj.op_memo_id != "undefined" ? pgMemoObj.op_memo_id : "";
		var cont_grp_id = typeof pgMemoObj.cont_grp_id != "undefined" ? pgMemoObj.cont_grp_id : "";
		var chg_dt = typeof pgMemoObj.chg_dt != "undefined" ? pgMemoObj.chg_dt : "";
		var cont_hst_cd = typeof pgMemoObj.cont_hst_cd != "undefined" ? pgMemoObj.cont_hst_cd : "";
		var rowIndex = (typeof rowIndex != "undefined" && ngmf.isNumber(rowIndex) == "Y") ? rowIndex : "";
		var colIndex = (typeof colIndex != "undefined" && ngmf.isNumber(colIndex) == "Y") ? colIndex : "";
		var subScwin = typeof pgMemoObj.subScwin != "undefined" ? pgMemoObj.subScwin.$w.getRuntimeId("scwin") : "";

		if (btnId === "" || show_gb === "" || svc_mgmt_num === "" || rowIndex === "" || colIndex === "") {
			ngmf.alert("업무메뉴 필수 입력값이 정상적으로 입력되지 않았습니다.");
			return "";
		} else if (show_gb !== "S" && (cont_grp_id === "" || chg_dt === "" || cont_hst_cd === "")) {
			ngmf.alert("업무메뉴 필수 입력값이 정상적으로 입력되지 않았습니다.");
			return "";
		} else {
			var options = {
				"btnId" : btnId + "_" +rowIndex + "_" + colIndex,
				"show_gb" : show_gb,
				"svc_num" : svc_num,
				"svc_mgmt_num" : svc_mgmt_num,
				"op_memo_id" : op_memo_id,
				"cont_grp_id" : cont_grp_id,
				"chg_dt" : chg_dt,
				"cont_hst_cd" : cont_hst_cd,
				"rowIndex" : rowIndex,
				"colIndex" : colIndex,
				"subScwin" : subScwin
			};
			var paramStr = ngmf.stringify(options);
			var htmlStr = "";
			
			if (subScwin != "") {
				var isWframe = ngmf.getMyWframeId(pgMemoObj.subScwin);
				if (isWframe != "") options.myWframeId = ngmf.getMyWframeId(pgMemoObj.subScwin);
			}
			
			if (typeof options != "undefined" && options.op_memo_id !== "") {
				htmlStr = "<input type='button' tabindex='0' id='"+options.btnId+"' class='w2trigger btn_memo_on' onclick='ngmf._pgClickFunction("+paramStr+" )'>";
			} else {
				htmlStr = "<input type='button' tabindex='0' id='"+options.btnId+"' class='w2trigger btn_memo' onclick='ngmf._pgClickFunction("+paramStr+" )'>";
			}
			return htmlStr;
		}
	}
};


ngmf._pgClickFunction = function(pgMemoObj) {
	if (typeof pgMemoObj != "undefined") {
		pubComm._pgMemoLayer(pgMemoObj.btnId, pgMemoObj, "G");
	}
};

/**
 * 화면 편의기능 메세지 (widget) 설정하는 API 입니다.
 * @date 2016.23.
 * @param {String/Object} btnComp :: I :: Y ::   :: 편의기능 설정 버튼 ID
 * @param {String/Object} type :: I :: Y ::   :: 편의기능 설정 Type ["N" : 공지사항, "M" : 메모(default)]
 * @param {String/Object} wgMemoId :: I :: Y ::   :: memo 설정 버튼 ID
 * @author 이동규
 * @sync true
 * @useMobile use
 * @example ngmf.wgMemoLayer(btnComp, "N", "customNotice");
 * @exampleAsIs
 */ 
ngmf.wgMemoLayer = function(btnComp, type, wgMemoId, size) {
	pubComm._wgMemoLayer.apply(this, arguments);
};

/**
 *   문자열을 바이트 단위로 계산 (DB  기준)
 * @date 2016.07.06
 * @memberOf ngmf
 * @param {varValue} sValue :: I :: N ::  :: 대상 값.
 * @return {Number} 길이 (Byte)
 * @author 성일호
 * @useMobile use
 * @example ngmf.lengthb("가나다");  // return 6 
 */
ngmf.lengthbDB = function (sValue) {
	var nTotCnt = 0;
	try{
		if (ngmf.isNull(sValue) == "Y") {
			nTotCnt = 0;
		} else {
			for (var i=0; i<sValue.length; i++) {
				if (escape(sValue.charAt(i)).length > 4) {
					nTotCnt += 2;
				} else {
					nTotCnt += 1;
				}
			}
		} 
	} catch (e) {
		ngmf._error("[ngmf.lengthbDB] Exception :: ", e);
	}
	return nTotCnt;
};

/** 
 * 메인 및 Wframe 에서 ScreenName 가져오기
 * @date 2016.067.06
 * @memberOf ngmf
 * @param {String} tgtScwin :: I :: Y ::  :: 메인 및 Wframe 에서 scwin 객체
 * @param {Boolean} addWframID :: I :: Y ::  :: Wframe이름 추가여부, 추가시 메인 + _ + wframID 로
 * @return {String} 메인 및 Wframe 의 ScreenName ID
 * @sampleLink scm_popupMain
 * @author 성일호
 * @useMobile use
 * @sync true
 * @example ngmf.getScreenName(scwin, true);  
 */
ngmf._getScreenName =  function(tgtScwin, addWframID){
	var screenName = "";
	try {
		if (typeof scvar["__screenName"] || !scvar["__screenName"]) {
			scvar["__screenName"] = ngmf.getFormID();
			if (!scvar["__screenName"]  && GLV["G_ACTIVE_FORMID"]) {
				scvar["__screenName"] = GLV["G_ACTIVE_FORMID"];
			}
		}
		if (scvar["__screenName"]) screenName = scvar["__screenName"];
		if (typeof tgtScwin != "undefined" && tgtScwin && ngmf.getMyWframeId(tgtScwin) ) {
			if (typeof addWframID != "undefined" && addWframID ) {
				screenName+= "_" + ngmf.toUpper(ngmf.object(ngmf.getMyWframeId(tgtScwin)).getSrc()).replaceAll(".XML","") + "::" + ngmf.getMyWframeId(tgtScwin);
			} else screenName += "::" + ngmf.getMyWframeId(tgtScwin); 
		} 
	} catch(e) {
		ngmf._error("[ngmf.getScreenName] Exception :: ", e);
	}
	return screenName;
};

/** 
 *  open POPUP Main 이 닫힐경우 Child 강제 닫기 API
 * @date 2016.07.08
 * @memberOf ngmf
 * @param {String} parentFormID :: I :: N ::  :: 팝업을 호출한 팝업 ID
 * @return  
 * @author 성일호
 * @useMobile use
 * @sync true 
 */
ngmf._closePopupForce =  function(parentFormID){
	var screenName = "";
	try {
		if (typeof WebSquare.uiplugin != "undefined" && typeof WebSquare.uiplugin.popup != "undefined") {
			var popupList = WebSquare.uiplugin.popup["popupList"];
			if (popupList && popupList.length > 0) {
		        for (var i = 0; i < popupList.length; i++) {
		        	var popupObj = popupList[i];
		        	if (parentFormID && popupObj.params  == parentFormID) {
		        		var toasBar = ngmf.object(popupObj.id +"_minPop");
		        		if (toasBar) {
			        		for (var i in ngmv._popupToast) {
								if (ngmv._popupToast[i] == toasBar.getID()) {
									ngmv._popupToast[i] = "_delete_";
								}
							}
			        		toasBar.remove();
		        		}
		        		popupObj.close();
		            }
		        }
			}
		} 
	} catch(e) {
		ngmf._error("[ngmf._closePopupForce] Exception :: ", e);
	}
};

ngmf._getOrgFormID =  function(){
	try {
		var arr = WebSquare.w2xPath.split("/");
		var len = arr.length;
		var fileNm = arr[len - 1];
		
		if(fileNm != null && fileNm != ""){
			return fileNm.replace(".xml","");
		}else{
			return null;
		}	
	} catch(e) {
		ngmf._error("[ngmf._getOrgFormID] Exception :: ", e);
	}
};


/**
 * POPUP 화면에서 Parent Form ID를 가져오는 API
 * POPUP이 아닐경우 parent.ngmf.getFormID()를 리턴함.
 * @date 2016.07.11
 * @memberOf ngmf
 * @return {String} Parent 화면 FormID.
 * @author 성일호
 * @useMobile use
 * @sync true
 * @example ngmf.getParentFormID();
 */
ngmf.getParentFormID =  function(){
	try {
		if (ngmf.isPopup() && WebSquare.net.getParameter("popupID")) {
			if (!WebSquare["parentForm"]){
				ngmf.popupParam();
			}
			return WebSquare["parentForm"].ngmf._getScreenName();
		} else {
			return parent.ngmf._getScreenName();
		}
	} catch(e) {
		ngmf._error("[ngmf.getParentFormID] Exception :: ", e);
	}
};

/**
 * enable된 component의 ID를 구하는 API 입니다.
 * @date 2016-07-11
 * @memberOf ngmf
 * @param {String} sParentID :: I :: N ::  ::  찾을 부모 component(group)
 * @param {Boolean} bEnableFlag  :: I :: N :: true ::  true (enable된 component) / false(disable된 component)
 * @return {Object} enable 또는 disable된 component의 ID(String) Array
 * @author 김성진
 * @example ngmf.getEnabledID("div_searchGrp", true);  // return ["ipt_search01", "cob_search05"]
 */
ngmf.getEnabledID = function(sParentID, bEnableFlag) {
	var rtnArr = new Array();
	 try {
		if (typeof ngmf.object(sParentID) == "undefined")
			return rtnArr;
		if (typeof bEnableFlag == "undefined")
			bEnableFlag = true;

		var objParent = ngmf.object(sParentID);
		var options = {
			recursive : true,
			excludeId : "",
			excludePlugin : "group trigger textbox output calendar image span anchor pageInherit wframe itemTable",
		};

		var objArr = WebSquare.util.getChildren(objParent, options);
		var obj = null;
		var objId = null;
		var bDisabled = false;
		for ( var objIdx in objArr) {
			obj = objArr[objIdx];
			if (typeof obj.getID == "function" && typeof obj.getDisabled == "function") {
				objId = obj.getID();
				bDisabled = obj.getDisabled();
				if (bDisabled == !bEnableFlag) {
					rtnArr.push(objId);
				}	
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getEnabledID] Exception :: " , e);
	}
	return rtnArr;
};
 

/**
 *  현재 페이지 화면명을 리턴함. 
 *  
 * @date 2016.07.11
 * @memberOf ngmf
 * @return {String} 화면 Title Text
 * @author 성일호
 * @useMobile use
 * @sync true
 * @example ngmf.getFormName();
 */
ngmf.getFormName =  function(){
	try {
		var menuId = "";
		var titleObj = null;
		if (ngmf.isPopup()) {
			if (!WebSquare["parentObj"]) ngmf.popupParam();
			titleObj = WebSquare["parentObj"][ngmf._getScreenName()+"_header_title"];			
			//TODO. 모바일 특이 사항 있을 경우 처리
			if (GLV.G_FORMUSEFG == "M") {
			} else {
			}
		} else {
			if (GLV.G_FORMUSEFG == "M") {
				menuId = ngmf._getScreenName();
				titleObj = GLD[menuId +"_title_" + ngmf.mdiTabs().getID()];
			} else {
				//TODO. SDI, 모바일일 경우 로직 추가 필요..
			}
		}
		if (titleObj && titleObj["textContent"]) return ngmf._getSafeFileName( titleObj.textContent ); 
		else return ngmf._getSafeFileName(ngmf._getScreenName());
	} catch(e) {
		ngmf._error("[ngmf.getFormName] Exception :: ", e);
	}
};

ngmf._getSafeFileName =  function(fname){
	try {
		if (fname) return fname.replaceAll("/","_").replaceAll("[","_").replaceAll("]","_").replaceAll("{","_").replaceAll("}","_").replaceAll("*","_").replaceAll("\\","_").replaceAll("?","_").trim();
	} catch(e) {
		ngmf._error("[ngmf._getSafeFileName] Exception :: ", e);
	}
	return fname;
};

/**
 *  정상적인 업무 페이지 인지 확인
 *  메인 페이지 이거나 샘플 페이지 걸러냄
 *  혹은 파일네임 규칙에 맞지 않는 파일 체크 ( 13 자리, 대문자, 끝다섯자리 숫자, 확장자 등)
 * @date 2016.07.12
 * @memberOf ngmf
 * @return {Number} 0 : MAIN , 1: 정상폼,  -1 : 샘플페이지, -9: 잘못된 페이지
 * @author 성일호
 * @useMobile use
 * @sync true
 */
ngmf._isForm =  function(){
	try {
		var orgFoemId = ngmf._getOrgFormID();
		var subIfram = ["ZNGMSRPT00010"];

		if (subIfram.indexOf(orgFoemId) > -1) return -9;
		if (orgFoemId.startsWith("main") ) return 0;
		if (orgFoemId.startsWith("mobile_main") ) return 0; 
		if (orgFoemId.indexOf("_") > -1) return -1;
		if (orgFoemId.length != 13) return -1;
		if (orgFoemId.toUpperCase() != orgFoemId) return -1;
		if (isNaN(orgFoemId.substr(8))) return -1;
		if (orgFoemId.toUpperCase().indexOf(".XML")  == -9 ) return -1;
	} catch(e) {
		ngmf._error("[ngmf._isMain] Exception :: ", e);
	}
	return 1;
};

/**
 * 화면 메세지 팝업(보안 및 화면메모) 버튼 이미지 설정하는 API 입니다.
 * @date 2016.07.13
 * @param {String/Object} btnComp :: I :: Y ::   :: memo 설정 버튼 ID
 * @param {Boolean} flag :: I :: Y ::   :: true (내용이 있는 메모이미지), false (내용이 없는 메모 이미지) [defalt : false]
 * @author 이동규
 * @sync true
 * @useMobile use
 * @example ngmf.pgMemoImage(btnComp, true); //내용 있는 이미지 변경
 * @exampleAsIs
 */ 
ngmf.pgMemoImage = function(btnComp, flag) {
	pubComm._pgMemoImage.apply(this, arguments);
};



/**
 * postMessage를 사용하여 내부frame에 데이터를 보냄
 * @date 2016.07.14
 * @param {String} message :: I :: N ::   :: iframe으로 전달할 메세지 
 * @param {String} url :: I :: N ::   :: iframe의 도메인 주소
 * @param {String} iframeId :: I :: N ::   :: iframe Id
 * @author 김응한
 * @useMobile use
 * @example ngmf.postMessage("message","http://ap1.sktelecom.com:8060","ifrId") //iframe에  "message"를 전달한다
 */ 
ngmf.postMessage = function(message,url,iframeId){
	try{
		if(!window.document.getElementById(iframeId)){
			ngmf._error(iframeId+" undefined");
			return; 
		}
		
		if(typeof message!=="string"){
			ngmf._error("message는 String type이 아닙니다.");
			return;
		}
		
		
		
		var ifrWindow = window.document.getElementById(iframeId).contentWindow;
		ifrWindow.postMessage(message, url);
	}catch(e){
		ngmf._error("[ngmf.postMessage] Exception :: ", e);
	}
	
	
};

/**
 *  formOnload 시 넘겨받은 Argument 가 있을경우 설정해 주는 API  
 * @date 2016.07.20 
 * @author 성일호
 * @useMobile useless
 */ 
ngmf._setOnloadArg = function() {
	try {
		if (ngmf.isPopup()) {
			
		} else if (GLV["newWindowArg"]) {
			var windowMDI = ngmf.mdiTabs();
			if (!windowMDI) return ; 
			
			var argObj = GLV["newWindowArg"][windowMDI.id  + "_" + ngmf._getScreenName()];
			var strArgObj = null;
			if (argObj && argObj["strArg"]) {
				if (ngmf.isString(argObj["strArg"]))  strArgObj = ngmf._extractData(argObj["strArg"]);
				else strArgObj = argObj["strArg"];
				if (ngmf.isJSON(strArgObj)) for (var ai in strArgObj) scvar[ai] = strArgObj[ai];
				delete GLV["newWindowArg"][windowMDI.id  + "_" + ngmf._getScreenName()]["strArg"]
			}
		} 
	} catch (e) {
		ngmf._error("[ngmf._setOnloadArg] Exception :: ", e);
	}
};

/**
 *  formOnload 시 넘겨받은 Init Function이 있늘경우 실행해 주는 API
 * @date 2016.07.20 
 * @author 성일호
 * @useMobile useless
 */ 
ngmf._runOnloadInitfunction = function() {
	try {
		if (GLV["newWindowArg"]) {
			if (ngmf.isPopup()) return;
			var windowMDI = ngmf.mdiTabs();
			if (!windowMDI) return ;
			
			var argObj = GLV["newWindowArg"][windowMDI.id  + "_" + scvar.__screenName]; 
			var initFunction = null; 
			if (argObj && argObj["strFunction"]) {
				initFunction = ngmf._getCallBackFunction(argObj["strFunction"]);
				
				if (initFunction) {
					try {
						initFunction.call();	
					} catch (e) {
						ngmf._error("[ngmf._runOnloadInitfunction Call Function: "+argObj["strFunction"]+"] Exception :: ", e);
					}
				}
			}
			if (argObj) delete GLV["newWindowArg"][windowMDI.id  + "_" +  scvar.__screenName];
		}
		
	} catch (e) {
		ngmf._error("[ngmf._runOnloadInitfunction] Exception :: ", e);
	}
};


 /** grid의 설정값(columnOrder : 컬럼정렬 , columnWidth : 컬럼 사이즈),  tab의 설정값 (tabOrder : 탭 정렬)을 LocalStorage에 저장합니다. 
  * @date 2016-01-25
  * @memberOf ngmf
  * @param  {String} serviceID   :: I :: N ::  :: 서비스구분(T:텔레콤, B:브로드밴드).
  * @param  {String/Array} componentID :: I :: N ::  :: 그리드ID.
  * @author  김응한
  * @useMobile use
  * @example ngmf.setLocalStorage("T", "grid01,grid02,TabControl01");
  * @exampleAsIs 신규
  */
ngmf.setLocalStorage = function(serviceID, compId) {
	try {
		var prop0 = 'columnOrigin';
		var prop1 = 'columnOrder';
		var prop2 = 'columnWidth';
		var prop3 = 'tabOrder';
		var pageInfo = ngmf._getPageLocalInfo(serviceID); //localStorage에서 해당 페이지의 정보가져옴

		
		if(typeof compId==="string"){  
			var compArr = compId.split(",");//compId형식이 "data1,data2" 
		}else if(ngmf.isArray(compId)){
			var compArr = compId; //compId형식이 ["data1","data2"];
		}else{
			return false;
		}

		var compLength = compArr.length;

		for (i = 0; i < compLength; i++) {

			var comp = ngmf.object(compArr[i]);
			if(!comp){
				ngmf._error(compArr[i] +" undefined");
				return;
			}
			var componentID = comp.getID();
			
			if (!pageInfo.pageObj[componentID]) { 
				pageInfo.pageObj[componentID] = {};//페이지에서 컴포넌트의 정보를 저장한적이 없으면 오브젝트 생성 
			}
			

						
			if (comp["_wTagName"]=="gridView") { //그리드뷰일 경우만
				var columnOrigin = comp.tdIdList;
				var columnOrder = comp.getColumnOrder(true); //그리드뷰 컬럼의 순서를 배열로 반환
				var colWidthList = comp.colWidthList; //그리드뷰 컬럼의  가로길이를 배열로 반환
				var columnWidth = {};

				pageInfo.pageObj[componentID][prop0] = columnOrigin;
				pageInfo.pageObj[componentID][prop1] = columnOrder; 

				var colunms = columnOrder.length;

				for ( var j = 0; j < colunms; j++) {
					columnWidth[columnOrder[j]] = colWidthList[j]; //컬럼의 가로길이정보를 가진 오브젝트
				}

				pageInfo.pageObj[componentID][prop2] = columnWidth;

			}else if(comp["_wTagName"]=="tabControl"){//tab일 경우만
				pageInfo.pageObj[componentID][prop3] = ngmf.getTabIDList(comp); //tab순서 배열반환
			}

			WebSquare.localStorage.setItem(pageInfo.pageID, JSON.stringify(pageInfo.pageObj));
		}
	} catch (e) {
		ngmf._error("[ngmf.setLocalStorage] Exception :: ", e);
	}
};


/**
 *  모바일 폼간 DATA 공유를 위한 parameter 를 설정
 * @date 2016. 7. 22.
 * @memberOf 
 * @param {String} strVariable :: I :: N ::   :: Parameter 항목 Item
 * @param {Object} strValue    :: I :: N ::   :: Parameter Item Value
 * @returns {Boolean} 
 * @author 성일호
 * @useMobile use
 * @example
 */
ngmf.setGlobalParam = function(strVariable, strValue){
	var bresult = false;
	try {
		if (!ngmf.isMobile()) return  bresult;
		if (typeof strVariable !== "string" ||  !strVariable) return  bresult;
		if (typeof GLV["mobileGlobalParams"] == "undefined") GLV["mobileGlobalParams"] = {};
		GLV["mobileGlobalParams"][strVariable] = strValue;
		 bresult = true;
	} catch(e) {
		ngmf._error("[ngmf.setGlobalParam] Exception :: ", e);
	}
	return bresult;
}; 

/** 모바일 폼간 DATA 공유 Parameter Item 값
 * @date 2016. 7. 22.
 * @memberOf ngmf
 * @param {String} strVariable :: I :: N ::   :: Parameter 설정 항목 Item
 * @return {Object} Parameter 설정 항목 Item 데이터. 
 * @author 성일호
 * @useMobile use
 * @example 
 */
 ngmf.getGlobalParam = function(strVariable){
	 var retValue = null;
	try {
		if (!ngmf.isMobile()) return  retValue;
		if (typeof strVariable !== "string" ||  !strVariable) return  retValue;
		if (typeof GLV["mobileGlobalParams"] == "undefined") GLV["mobileGlobalParams"] = {};
		retValue = GLV["mobileGlobalParams"][strVariable] ;
	} catch(e) {
		ngmf._error("[ngmf.getGlobalParam] Exception :: ", e);
	}
	return retValue;
}; 

/** 모바일 폼간 DATA 공유 Parameter Item 값
 * @date 2016. 7. 22.
 * @memberOf ngmf
 * @param {String} strVariable :: I :: N ::   :: Parameter 설정 항목 Item
 * @return {Object} Parameter 설정 항목 Item 데이터. 
 * @author 성일호
 * @useMobile use
 * @example 
 */
 ngmf.removeGlobalParam = function(strVariable){
	var bresult = false;
	try {
		if (typeof strVariable == "string" ) {
			bresult = true;
			if (GLV["mobileGlobalParams"][strVariable]) {
				delete  GLV["mobileGlobalParams"][strVariable];
			}
		} else if (typeof GLV["mobileGlobalParams"] != "undefined"){
			delete  GLV["mobileGlobalParams"];
			GLV["mobileGlobalParams"] = {};
			bresult = true;
		}
	} catch(e) {
		ngmf._error("[ngmf.getGlobalParam] Exception :: ", e);
	}
	return bresult;
}; 

/**
 * 그리드뷰의 oncellclick 이벤트에서 각셀의 멀티링크버튼을 설정하는 API 입니다.
 * 해당 API는 그리드의 oncellClick 이벤트 내부에서 설정하여 사용하여야 합니다.
 * @date 2016-07-26
 * @memberOf ngmf
 * @param {String} gridId :: I :: N ::  :: 그리드뷰 컴포넌트 ID.
 * @param {Number} row :: I :: N ::  :: oncellClick 이벤트의 파라메터 Row Index 값.
 * @param {Number} col :: I :: N ::  :: oncellClick 이벤트의 파라메터 Column Index 값.
 * @param {Object} linkBtnObj :: I :: N ::  :: 다중링크버튼 정의 객체.
 * @author 이동규
 * @useMobile use
 * @example
 *	var links = [{
 *			linkType: "p", btnId : "multiLinked1", btnName: "테이블팝업",
 *			strPrefix : "EDU",
 *			strFormID : "PG-0301_popup",
 *			strInArgument : "",
 *			nWidth : "600",
 *			nHeight : "280",
 *			strOpenStyle : "",
 *			nLeft : "",
 *			nTop : "",
 *			callbackFunc : "scwin.popupCallBack",
 *			screenName : ""
 *		 },
 *		{
 *			linkType: "w", 
 *			btnId : "multiLinked2", 
 *			btnName: "고객상담윈도우", 
 *			strPrefix : "EDU",
 *			strFormID : "PG-0301_popup",
 *			formName : "linked윈도우",
 *			strInArgument : ""
 *		},
 *		{linkType: "f", btnId : "multiLinked3", btnName: "사용자 지정함수"}];
 *
 * ngmf.setGridMultiLink("grd_ID", row, col, links);
 * @exampleAsIs
 * @sampleLink 
 */
ngmf.setGridMultiLink = function(gridId, row, col, linkBtnObj) {
	try {
		var grdComp = ngmf.object(gridId);
		if (typeof grdComp != "undefined" && typeof row != "undefined" && typeof col != "undefined") {
			var displayRow = row - grdComp.rowIndex;
			var colCount = grdComp.getColumnCount() || grdComp.getColCnt();
			var cellDom = grdComp.data_td_list[displayRow * colCount + col];
			if (typeof cellDom != "undefined") {
				var option = {
			    	rowIndex : row,
			        colIndex : col,
			        linkObj : linkBtnObj,
			        cellId : gridId,
			        focus : false
			    };
			    
			    var cellMultiLinkDiv = $("#"+option.cellId+"cell_linkDiv");
			    var cellDomDiv = $("#"+cellDom.id);
			    
			    if (cellMultiLinkDiv.length > 0 && cellMultiLinkDiv.hasClass("show")) {
			    	cellMultiLinkDiv.remove();
			    } 
			   
			   	_setGridMultiLink(option);//멀티버튼 Div 생성.
			   

			   	//멀티버튼 위치 설정.
				var cellMultiLinkDiv = $("#"+option.cellId+"cell_linkDiv");
				cellMultiLinkDiv.addClass('show');
		        cellMultiLinkDiv.css("display", "block");
		        cellMultiLinkDiv.offset({top:0,left:0});

	            var ofs = cellDomDiv.offset();
		       	var top_sum = 0;
				var left_sum = 0;
	            if (WebSquare.BootLoader.fullViewRatio && WebSquare.BootLoader.fullViewRatio > 0) {
	            	left_sum = ofs.left / WebSquare.BootLoader.fullViewRatio;
	            	top_sum = ofs.top / WebSquare.BootLoader.fullViewRatio;
	            } else {
	            	left_sum = ofs.left;
	            	top_sum = ofs.top;
	            }
			            
	            var ofs_H = cellDomDiv.outerHeight()/2;
	            var wid_sum = cellMultiLinkDiv.outerHeight()/2;
	            var bodyWidth = $("body").width();
	            var bodyHeight = $("body").height();
	            var allWidth = left_sum +  cellDomDiv.outerWidth() + cellMultiLinkDiv.outerWidth();
		        var top = top_sum - wid_sum + ofs_H - $("body").position().top;
	            var bottomChk = top_sum + wid_sum + ofs_H;
	            var left = 0;

	            if (top < 0) {
	            	top = top_sum - 5  +"px";
	            	var spanNode = cellMultiLinkDiv.children("span");
	            	if (spanNode.length > 0 && !spanNode.hasClass("top")) {
	            		spanNode.addClass("top");
	            	}
	            } else if (bottomChk > bodyHeight ) {
	            	top = top_sum - cellMultiLinkDiv.outerHeight() + cellDomDiv.outerHeight() + 5  +"px";
	            	var spanNode = cellMultiLinkDiv.children("span");
	            	if (spanNode.length > 0 && !spanNode.hasClass("bottom")) {
	            		spanNode.addClass("bottom");
	            	}
	            } else {
	            	top = top + "px"
	            }

	            if (allWidth < bodyWidth) {
		            left = left_sum + cellDomDiv.outerWidth() +"px";
		            if (cellMultiLinkDiv.hasClass("right")) {
		            	cellMultiLinkDiv.removeClass("right");
		            }
	            } else {
	            	left = left_sum - cellMultiLinkDiv.outerWidth() -5;
	            	if (left > 0) {
	            		if (!cellMultiLinkDiv.hasClass("right")) {
	            			cellMultiLinkDiv.addClass("right");
			            }
	            	} else {
	            		left = left_sum + cellDomDiv.outerWidth() +"px";
	            	}
	            }

	           cellMultiLinkDiv.css("top", top);
	           cellMultiLinkDiv.css("left", left);
	           cellMultiLinkDiv.css("z-index", 5200);

	            if ($("#tooltipDiv").length > 0 && $("#tooltipDiv").hasClass("right")) {
	            	var l1 = left_sum + cellDomDiv.outerWidth() + cellMultiLinkDiv.outerWidth();
	            	var l2 = $("#tooltipDiv").offset().left;
	            	if (l1 > l2) {
	            		$("#tooltipDiv").css({"left":l1});
	            	}
	            }
	            
	            //멀티 버튼 기능 설정.
	            cellMultiLinkDiv.attr("tabindex","0");
	            cellMultiLinkDiv.focus();
	            option.focus = true;
	            cellMultiLinkDiv.hover(
	                function() {

	            	},
	            	function(){
	                	$("#"+option.cellId + "cell_linkDiv").fadeOut(200,
	                  		function() {
				            	$("#"+option.cellId + "cell_linkDiv").removeClass("show");
				            	$("#"+option.cellId + "cell_linkDiv").css("display", "none");
				            	option.focus = false;
	                  		}
	              		);
	            	}
	        	);

				cellMultiLinkDiv.focusout(function() { 
	      			if(option.focus) {
		               $("#"+option.cellId + "cell_linkDiv").removeClass("show");
		               $("#"+option.cellId + "cell_linkDiv").css("display", "none");
		               option.focus = false;
	      			} else {
	      				option.focus = true;
	      			}
			      		
			    });
	        } else {
	            $("#"+option.cellId + "cell_linkDiv").removeClass('show');
	            $("#"+option.cellId + "cell_linkDiv").css("display", "none");
	            option.focus = false;
	        }
				
			function _setGridMultiLink(option) {
				var len = Object.keys(option).length;
				if (cellDom && document.getElementById(option.cellId + "cell_linkDiv") == null) {
		            var div = document.createElement("div");
		            div.setAttribute("id", option.cellId + "cell_linkDiv");
		            div.setAttribute("style", "position: absolute; z-index: 5200; display: none; ");
		            div.setAttribute("class", "w2group tgg_nav");
		            var doc = document.body;//.childNodes[0];
		            doc.appendChild(div);
		        }

		        var htmlStr = [];
		        var links = option.linkObj;
		        if (typeof links == "undefined" || links.length < 0) {
		            ngmf.alert("다중링크 URL이 없습니다.");
		            return false;
		        }
		        
		        for (var i = 0; i < links.length; i++) {
		            var linkType = links[i].linkType;
		            var btnName = links[i].btnName;
		            var btnId = links[i].btnId || (cellDom.id + "_linkedBtn" + i);
		            if (linkType == "p" || linkType == "P") {
						var strPrefix         = links[i].strPrefix || "";
						var strFormID         = links[i].strFormID || "";
						var strInArgument     = links[i].strInArgument || "";
						var nWidth         	  = links[i].nWidth || 1100;
						var nHeight           = links[i].nHeight || 410;
						var strOpenStyle      = links[i].strOpenStyle || "";
						var nLeft             = links[i].nLeft || 0;
						var nTop              = links[i].nTop || 0;
						var callbackFunc      = links[i].callbackFunc || "";
						var screenName        = links[i].screenName || "";

			            htmlStr.push("<a id='" + btnId +"' class='w2group pop_link' strOpenStyle='"+strOpenStyle+"' strPrefix='"+strPrefix+"' strFormID='"+strFormID+"' strInArgument='"+strInArgument+"' nWidth='"+nWidth+"' nHeight='"+nHeight+"' nLeft='"+nLeft+"' nTop='"+nTop+"' callbackFunc='"+callbackFunc+"' screenName='"+screenName+"' btnName='"+btnName+"' linkType='"+linkType+"' >");
		            } else if (linkType == "f" || linkType == "F") {
		            	var strInArgument     = links[i].strInArgument || "";
		            	htmlStr.push("<a id='" + btnId +"' class='w2group pop_link' btnName='"+btnName+"' strInArgument='"+strInArgument+"' linkType='"+linkType+"' >");
		            } else {
		            	var strPrefix         = links[i].strPrefix || "";
						var strFormID         = links[i].strFormID || "";
						var strInArgument     = links[i].strInArgument || "";
						var formName		  = links[i].formName || "";
			            htmlStr.push("<a id='" + btnId +"' class='w2group pop_link' btnName='"+btnName+"' formName='"+formName+"' strFormID='"+strFormID+"' strPrefix='"+strPrefix+"' strInArgument='"+strInArgument+"' linkType='"+linkType+"' >");
		            }

		            htmlStr.push(btnName);
		            htmlStr.push("</a>");
		        }

		        htmlStr.push("<span></span>");
		        htmlStr = htmlStr.join("");
		        document.getElementById(option.cellId + "cell_linkDiv").innerHTML = htmlStr;
		        for (var j = 0; j < links.length; j++) {
		        	var btnId = links[j].btnId || (cellDom.id + "_linkedBtn" + j);
		        	$("#"+ btnId).on("click", function(e) {
						var linkType = this.getAttribute("linkType");
						switch (linkType) {
					        case "p" :
					        case "P" : // Popup Open
					        	var btnName 		= this.getAttribute("btnName");
				                var strPrefix		= this.getAttribute("strPrefix");
								var strFormID		= this.getAttribute("strFormID");
								var strInArgument	= this.getAttribute("strInArgument");
								var nWidth			= this.getAttribute("nWidth");
								var nHeight			= this.getAttribute("nHeight");
								var strOpenStyle	= this.getAttribute("strOpenStyle");
								var nLeft			= this.getAttribute("nLeft");
								var nTop			= this.getAttribute("nTop");
								var callbackFunc    = this.getAttribute("callbackFunc");
								var screenName		= this.getAttribute("screenName") != "" ? this.getAttribute("screenName") : undefined;
								ngmf.__dialog(strPrefix, strFormID, strInArgument, nWidth, nHeight, strOpenStyle, nLeft, nTop, callbackFunc, screenName);
				                return true;
				            	break;
					        case "w" :
					        case "W" : //new windowCreate
					            var strPrefix		= this.getAttribute("strPrefix");
								var strFormID		= this.getAttribute("strFormID");
								var formName		= this.getAttribute("formName");
					            var strInArgument	= this.getAttribute("strInArgument");
			                    ngmf.newWindow(strPrefix, strFormID, formName, strInArgument);
			                    return true;
					       		break;
					        case "f" : //사용자 정의
					        case "F" :
					        	var obj = {
					        		btnId : this.getAttribute("id"),
					        		btnName : this.getAttribute("btnName"),
					        		strInArgument : this.getAttribute("strInArgument"),
					        		linkType : this.getAttribute("linkType")
					        	};

					        	if (ngmf.isString(obj.strInArgument)){
									obj.strInArgument = ngmf._extractData(obj.strInArgument);
								}

	    						/// 프로그램 서비스 데이터 - 팝업 명, 팝업 URL 결로가 필요합니다.
								var func = "";
								if (typeof window.scwin.linkedFunc == "function") {
									func = scwin.linkedFunc;
								} else {
									var windowMDI = ngmf.mdiTabs();
				                    var screenWindow = windowMDI.getWindow(windowMDI.getSelectedWindowId());
									func = screenWindow.scwin.linkedFunc;
								}

								if (typeof func !== "undefined") {
									func(obj);
								}

	    						e.stopPropagation();
	    						return true;
					        break;
					    }
					});
		        }
			};
		
			ngmf.object(gridId).bind("onscrolly", function() {
				if ($("#"+this.id + "cell_linkDiv").length > 0 && $("#"+this.id + "cell_linkDiv").hasClass("show")) {
					$("#"+this.id + "cell_linkDiv").removeClass("show");
	                $("#"+this.id + "cell_linkDiv").css("display", "none");
	                option.focus = false;
				}
			});
		}
	} catch(e) {
		ngmf._error("[ngmf.setGridMultiLink] Exception :: ", e);
	}
};


/** grid의 설정값(columnOrder : 컬럼정렬 , columnWidth : 컬럼 사이즈),  tab의 설정값 (tabOrder : 탭 정렬)을 LocalStorage에서 가져와서 설정합니다   
 * @date 2016-01-25
 * @memberOf ngmf
 * @param  {String} serviceID   :: I :: N ::  :: 서비스구분(T:텔레콤, B:브로드밴드).
 * @param  {String/Array} componentID :: I :: N ::  :: 그리드ID.
 * @author  김응한
 * @useMobile use
 * @example ngmf.getLocalStorage("T", "grid01,grid02,TabControl01");
 * @exampleAsIs 신규
 */
ngmf.getLocalStorage = function ( serviceID, compId ) {
	try {	
		var prop0 = 'columnOrigin';
		var prop1 = 'columnOrder';
		var prop2 = 'columnWidth';
		var prop3 = 'tabOrder';
		var pageInfo = ngmf._getPageLocalInfo(serviceID); //localStorage에서 해당 페이지의 정보가져옴
		
		if(typeof compId === "string"){  
			var compArr = compId.split(",");//compId형식이 "data1,data2" 
		}else if(ngmf.isArray(compId)){
			var compArr = compId; //compId형식이 ["data1","data2"];
		}else{
			return false;
		}		

		var compLength = compArr.length;

		for (i = 0; i < compLength; i++) {
			var comp = ngmf.object(compArr[i]);
			if(!comp){
				ngmf._error(compArr[i] +" undefined");
				return;
			}
			var componentID = comp.getID();
			
			if (comp["_wTagName"]=="gridView") { //그리드뷰일 경우만
				if(pageInfo.pageObj[componentID]&&pageInfo.pageObj[componentID][prop0]){
					if(JSON.stringify(pageInfo.pageObj[componentID][prop0]) !== JSON.stringify(comp.tdIdList)){
						continue;
					}
				}
				if(pageInfo.pageObj[componentID]&&pageInfo.pageObj[componentID][prop1]){
					var columnOrder = pageInfo.pageObj[componentID][prop1];
					var colunms = columnOrder.length;
					comp.setColumnOrder(columnOrder);
				}
				
				if(pageInfo.pageObj[componentID]&&pageInfo.pageObj[componentID][prop2]){
					var gridAutofit = "";
					if(comp.options.autoFit !="none"){
						gridAutofit = comp.options.autoFit;
						comp.options.autoFit = "none";
					}

					var widths = pageInfo.pageObj[componentID][prop2]
					for ( var columnID in widths) {
						comp.setColumnWidth( columnID, widths[columnID] );
					}

					comp.options.autoFit = gridAutofit;
				}
			}else if(comp["_wTagName"]=="tabControl"){//tab일 경우만
				if(pageInfo.pageObj[componentID]&&pageInfo.pageObj[componentID][prop3]){
					var tabOrder = pageInfo.pageObj[componentID][prop3]
					comp.setTabOrder(tabOrder);
				}
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getLocalStorage] Exception :: ", e);
	}
};


ngmf._getActiveWindow = function  (winId, type, _mdi, parentWinId) {
	try {
		if (typeof type == "undefined" || !type || type === "M") {
			// MAIN 윈도우만 찾아서....
			if(ngmf.isMobile()){
		  		var iframes = document.getElementsByClassName("mobileBody");
	            if (iframes.length == 0) {
			       	iframes = GLD.document.getElementsByClassName("mobileBody");
			    } 
	            if (typeof winId !== "undefined" && winId) {
					for ( var i = 0; i < iframes.length; i++) {
				  		var objForm = null;
						var getSrc = iframes[i].src;
						if (getSrc.indexOf(winId + ".xml") > -1) {
							ifrObj = GLD.ngmf.object(iframes[i].id);
							objForm = ifrObj.getWindow();
							if (objForm) return objForm; 
						}	
					}
	           	} else {
	           		for ( var i = 0; i < iframes.length; i++) {
				 		var getSrc = iframes[i].src;
				 		var gid = GLD.document.getElementById(iframes[i].id );
						for( var j=0; j < GLD.scvar.openWinData.length ; j++ ){
			       			if(iframes[i].src.indexOf(GLD.scvar.openWinData[j].url) > -1 ) {
			         			if(GLD.scvar.openWinData[j].activate == "true"){
			         				ifrObj = GLD.ngmf.object(iframes[i].id);
									objForm = ifrObj.getWindow();
									if (objForm) return objForm; 
								}
				       		}
				     	}
				    } 	
				}
	            
		    } else if (typeof _mdi != "undefined" && _mdi && _mdi.startsWith("main")) {
				return GLD;
		 	} else {
				var windowMDI = ngmf.mdiTabs(_mdi);
				if (typeof windowMDI !== "undefined") {
					if (typeof winId !== "undefined" && winId) {
						var getWindow = windowMDI.getWindow(winId);
						if (getWindow == null && winId.startsWith("__popup_formId__")) {
							if (winId.startsWith("__popup_formId__")) {
								winId = winId.replace("__popup_formId__", "");
							} 
							var parentwindowId = windowMDI.getSelectedWindowId();
							var selectedWindow = windowMDI.getWindow(parentwindowId);
							if (typeof selectedWindow.ngmf.object(winId) !== "undefined") {
								return selectedWindow;
							}
						} else {
							return getWindow ;
						}
					} else {
						return windowMDI.getWindow(windowMDI.getSelectedWindowId());
					}
				}
				return null;
		 	}
		} else if (type === "P") {
			//팝업을 찾아서....
			if (ngmf.isMobile()) {
				var selectedWindow = parent;
				if (typeof selectedWindow.ngmf.object(winId) !== "undefined") {
					var iframeDom = selectedWindow.document.getElementById(winId).getElementsByTagName("iframe")[0];
					var win = iframeDom.contentWindow || iframeDom.contentDocument;
					if (win) return win; 
				} else if (GLD["scwin"]["getSelectedIframe"]) {
					var win = GLD["scwin"].getSelectedIframe();
					if (win) return win; 
				} 
				return null;
			} else if (_mdi && _mdi.startsWith("main")) {
				var parentWindow = GLD ;
				if (winId.startsWith("__popup_formId__")) {
					winId = winId.replace("__popup_formId__", "");
				}
				if (typeof parentWindow.ngmf.object(winId) !== "undefined") {
					var iframeDom = parentWindow.document.getElementById(winId).getElementsByTagName("iframe")[0];
					if (iframeDom) return (iframeDom.contentWindow || iframeDom.contentDocument );
				}				
				return null;
		 	} else { 
				var windowMDI = ngmf.mdiTabs(_mdi);
				if (typeof windowMDI != "undefined" && windowMDI) {
					//현재 선택된 윈도우에서 찾음
					var parentWindow = windowMDI.getWindow(parentWinId) ;
					if (!parentWindow) parentWindow = windowMDI.getWindow(windowMDI.getSelectedWindowId());
					
					if (!parentWindow) {
						 parentWindow = windowMDI.getWindow(GLV.G_ACTIVE_FORMID);
					} 
					
					if (parentWindow) {
						if (winId.startsWith("__popup_formId__")) {
							winId = winId.replace("__popup_formId__", "");
						}
						if (typeof parentWindow.ngmf.object(winId) !== "undefined") {
							var iframeDom = parentWindow.document.getElementById(winId).getElementsByTagName("iframe")[0];
							if (iframeDom) return (iframeDom.contentWindow || iframeDom.contentDocument );
						}
					} else if (typeof GLD.ngmf.object(winId) !== "undefined") {
						var iframeDom = GLD.document.getElementById(winId).getElementsByTagName("iframe")[0];
						if (iframeDom) return ( iframeDom.contentWindow || iframeDom.contentDocument );
					} 
				} 
			}	
		} 
	} catch (e) {
		ngmf._error("[ngmf._getAllWindows_getActiveWindow] Exception :: ", e);
	}
	return null;
};
// getType : M   P  
ngmf._getAllWindows = function (_windowId, mdiID, _getType) {
	var retWindows = new Array();
	var mdi =  null;
	try {  
		if (typeof mdiID != "undefined" && mdiID) {
			mdi = mdiID ;
		} else if (( typeof mdiID == "undefined" || !mdiID) && !ngmf.isMobile() && (GLV.G_FORMUSEFG == "M" || GLV.G_FORMUSEFG == "S")) {
			mdi = ngmf.mdiTabs().id;
		}
		var allwinInfoArr = null;
		var infoArr = null;
		var windowId = _windowId || GLV.G_ACTIVE_FORMID ;
		if (_getType === "P" ) {
			if (GLV.G_ACTIVE_FORMID != windowId)
				allwinInfoArr = ngmf._getWindowInfo(windowId, mdi, GLV.G_ACTIVE_FORMID);
			else allwinInfoArr = ngmf._getWindowInfo(windowId, mdi, "P");
		} else if (_getType === "PO" ) {
			allwinInfoArr = ngmf._getWindowInfo(windowId, mdi, "P");
			if (allwinInfoArr.length == 0)
				allwinInfoArr = ngmf._getWindowInfo(windowId, "", "P");
		} else {
			allwinInfoArr = ngmf._getWindowInfo(windowId, mdi, "M");
			if (_getType !== "M") {
				var popupArr = ngmf._getWindowInfo(windowId, mdi, "P");
				if (popupArr && popupArr.length > 0) allwinInfoArr = allwinInfoArr.concat(popupArr);
			}
		}
		
		if (allwinInfoArr.length > 0) {
			for (var i = 0; i < allwinInfoArr.length ; i ++ ) {
				var tgtWin = null;
				infoArr = allwinInfoArr[i].split("|"); 
				if (infoArr.length >3){
					tgtWin = ngmf._getActiveWindow (infoArr [0], infoArr[2],  infoArr[1], infoArr[3]);
				} else if (infoArr.length >2){
					tgtWin = ngmf._getActiveWindow (infoArr [0], infoArr[2],  infoArr[1]);
				} else if (infoArr.length <= 2){
					tgtWin = ngmf._getActiveWindow (infoArr [0]);
				}
				if (tgtWin) retWindows.push(tgtWin);
			}
		} 
		
//		if (retWindows.length == 0) retWindows.push(GLD);
	} catch (e) {
		ngmf._error("[ngmf._getAllWindows] Exception :: ", e);
	}
	return retWindows;
};

/** ctiCall 호출시 현재 receive상태의 작업탭을 선택합니다.
 * @date 2016-08-04
 * @memberOf ngmf
 * @author  이동규
 * @useMobile false
 * @example ngmf.ctiCallTab();
 * @exampleAsIs 신규
 */
ngmf.ctiCallTab = function() {
	try {
		ngmv.mainTop.scwin._setCtiSelected();
	} catch(e) {

	}
};

/** 모바일 반응형화면에 따른 화면 호출 URL 변경.
 * @date 2016-08-30
 * @memberOf ngmf
 * @author  이동규
 * @useMobile true
 * @exampleAsIs 신규
 */
ngmf.setDeviceFileUrl = function() {
	try {
		var url = arguments[0];
		var findF = false;
		if (ngmf.isMobile()) { //<TO-DO ngmf.isMobile() 대체
			if (typeof mobileFile == "undefined" || mobileFile == null || mobileFile == "") {
			//if (mobileFile && mobileFile.saveFile && mobileFile.saveFile.length > 0) {
				requires("/SWING/lib/js/mobile_File.js");
			}
			var path = arguments[0];
			var pathArr = path.split("/");
			if (pathArr[pathArr.length -1].indexOf(".xml") > -1 && mobileFile) {
				var fileNm = pathArr[pathArr.length -1].replace(".xml", "");
				for (var i in mobileFile.saveFile) {
					if (mobileFile.saveFile[i].fileNm == fileNm) {
						//<To-Do ngmf.getDeviceType () 체크 분기 처리
						var findFileNm = "";
						if (ngmf.getDeviceType() == "T") {
							//mT
							findFileNm = mobileFile.saveFile[i].mT;

						} else if (ngmf.getDeviceType() == "D") {
							//mP
							findFileNm = mobileFile.saveFile[i].mP;

						} 
						
						if (typeof findFileNm != "undefined") {
							pathArr[pathArr.length -1] = findFileNm + ".xml";
							findF = true;
							break;
						} else if (typeof mobileFile.saveFile[i].mA != "undefined") {
							pathArr[pathArr.length -1] = mobileFile.saveFile[i].mA  + ".xml";
							findF = true;
							break;
						}
					}
				}

				if (findF) {
					var setUrl = pathArr.join("/");

					if (setUrl != "") {
						url = setUrl;
					}
				}
			}
			
			//if (WebSquare.hybridApp && (!GLV.G_MOBILECONNURL && GLV.G_MOBILECONNURL.indexOf("7070") < 0)) {
			if (WebSquare.hybridApp) {
				url = ngmf._getI18NUrl(url);
			}
		}
		return url;
	} catch(e) {
		return arguments[0];
	}
};


/** 모바일에서의 url 처리
 * @date 2016-09-27
 * @memberOf ngmf
 * @author  조지용
 * @useMobile true
 * @exampleAsIs 신규
 */
ngmf._getI18NUrl = function(xPath) {
	//var serverURL = WebSquare.core.getConfiguration("/WebSquare/hybrid/submissionURL");
	var serverURL = "";
	if( xPath.startsWith("../../../") ) {
		if(ngmf.isPopup() || xPath.indexOf(WebSquare.w2xHome) > -1){
			return serverURL + xPath.replace("../../../","/");
		}
		return serverURL+ WebSquare.w2xHome + xPath;
	} else if( xPath.startsWith("../../") ){
		if(ngmf.isPopup() || xPath.indexOf(WebSquare.w2xHome) > -1){
			return serverURL + xPath.replace("../../","/");
		}
		return serverURL+ WebSquare.w2xHome +  xPath;
	} else if( xPath.startsWith("../")){
		if(ngmf.isPopup() || xPath.indexOf(WebSquare.w2xHome) > -1){
			return serverURL + xPath.replace("../","/");
		}
		return serverURL+ WebSquare.w2xHome + xPath;
	} else {
		return serverURL +  xPath;
	}
};

/**  
 * 현화면내 모든 팝업을 닫아주는 API
 * 
 * @date 2016-09-06
 * @memberOf ngmf
 * @param {Boolean} notCloseAction  :: I :: N :: true :: closeAction 수행하지 않음 여부 (false 일경우 closeAction 수행)
 * @author  성일호
 * @useMobile true
 * @example ngmf.closeAllPopup();
 * @exampleAsIs 신규
 */ 
ngmf.closeAllPopup = function(_notCloseAction) {
	try {
		var notCloseAction = true;
		if (typeof _notCloseAction != "undefined") notCloseAction = _notCloseAction;
		if (WebSquare.uiplugin.popup && WebSquare.uiplugin.popup.popupList) {
	        for (var i = 0; i < WebSquare.uiplugin.popup.popupList.length; i++) {
	        	var openedPopup = WebSquare.util.getPopup(WebSquare.uiplugin.popup.popupList[i].popupWin.id); 
	            if (openedPopup) {
	            	openedPopup["__notCloseAction"] = notCloseAction ;
	                WebSquare.uiplugin.popup.popupList[i].popupWin.close();
	            }
	        }
		} 
	} catch(e) {
		ngmf._error("[ngmf.closeAllPopup] Exception :: ", e);
	}
};

ngmf.midb2 = function(strString,nIndex,nSize){ 
    if(typeof nSize === "undefined" || nSize == null){
        return strString.substr(ngmf._getByteIndex(strString,nIndex));
    }else{
        var subStrVal = strString.substr(ngmf._getByteIndex(strString,nIndex));
        var returnStr = "";
        var sum = 0;

        for(var i=0; i<subStrVal.length; i++){
            var ch = subStrVal.charAt(i);
            if(escape(ch).length > 4){
                sum += 2;
                if(sum <= nSize){
                    returnStr += ch;
                }

            }else{
                sum += 1;
                if(sum <= nSize){
                    returnStr += ch;
                }
            }
        }

        return returnStr;
    }

};

ngmf._getByteIndex = function(str, chkIndex) {
    var _dc = 0;
    for (var i = 0; i < str.length; i++) {
        var _de = escape(str.charAt(i));
        if (_de.length == 1) {
            _dc++;
        } else {
            if (_de.indexOf("%u") != -1) {
                _dc += 2;
            } else {
                if (_de.indexOf("%") != -1) {
                    _dc += _de.length / 3;
                }
            }
        }
        if (chkIndex == _dc) return (i+1);
    }
    return chkIndex;
};
 
/**  
 * 현재 선택되어 있는 form 화면의 우측상단의 버튼들을 disabled 설정하는 API입니다.
 * @date 2016-09-29
 * @memberOf ngmf
 * @param {String||Array} setBtnId  :: I :: Y ::  :: 설정대상의 BtnID ["authorize" : 고객인증, "refresh" : 새로고침, "help" :도움말]
 * @param {Boolean} falg  :: I :: N :: true :: enable Flag (true : 사용, false : 미사용)
 * @author  이동규
 * @useMobile false
 * @example ngmf.setFormBtn("refresh", true);  //우측상단 새로고침 버튼 enable = true 설정.
 *          ngmf.setFormBtn(["authorize", "refresh"], false); //우측상단 고객버튼, 새로고침 버튼 enable = false 설정.
 * @exampleAsIs 신규
 */ 
ngmf.setFormBtn = function () {
	try { 
		var setBtnVal = arguments[0];
		var _flag = typeof arguments[1] != "undefined" ? WebSquare.util.getBoolean(arguments[1]) : true;
		var callFormId = ngmf.getFormID();
		var enableWin = ngmf.getWindow(callFormId);
		
		function _formBtnControl(mdiId, formId, name, flag) {
			var btnCom = null;
			switch (name) {
				case "authorize":
					btnCom = GLD.$("#"+mdiId + formId + "_user_ok");
					break;
				case "refresh":
					btnCom = GLD.$("#"+mdiId + formId + "_refresh");
					break;
				case "help":
					btnCom = GLD.$("#"+mdiId + formId + "_menual");
					break;
			}

			if (btnCom) {
				if (flag && btnCom.hasClass("w2anchor_disabled")) {
					btnCom.removeClass("w2anchor_disabled");
				} else if (!flag && !btnCom.hasClass("w2anchor_disabled")){
					btnCom.addClass("w2anchor_disabled");
				}
			}
		}

		function _popformBtnControl(mdiId, formId, name, flag) {
			var btnCom = null;
			var popupParam = ngmf.popupParam();
			var popupOpenWin = popupParam.parentObj;
			if (popupOpenWin) {
				switch (name) {
					case "authorize":
						btnCom = popupOpenWin.$("#" + formId +"_header_button_0_value")
						break;
					case "refresh":
						btnCom = popupOpenWin.$("#" + formId +"_header_button_1_value")
						break;
					case "help":
						btnCom = popupOpenWin.$("#" + formId +"_header_button_2_value")
						break;
				}

				if (btnCom) {
					if (flag && btnCom.hasClass("w2anchor_disabled")) {
						btnCom.removeClass("w2anchor_disabled");
					} else if (!flag && !btnCom.hasClass("w2anchor_disabled")){
						btnCom.addClass("w2anchor_disabled");
					}
				}
			}
		}
		if (setBtnVal && enableWin && enableWin.ngmf) {
			var mdiTabId = ngmf.mdiTabs().id;
            var formId = enableWin.ngmf.getFormID();
			if (ngmf.isArray(setBtnVal)) {
				for (var i =0, len = setBtnVal.length; i < len; i++) {
					if (ngmf.isPopup()) {
						_popformBtnControl(mdiTabId, formId, setBtnVal[i], _flag);
					} else {
						_formBtnControl(mdiTabId, formId, setBtnVal[i], _flag);
					}
				}
			} else {
				if (ngmf.isPopup()) {
					_popformBtnControl(mdiTabId, formId, setBtnVal, _flag);
				} else {
					_formBtnControl(mdiTabId, formId, setBtnVal, _flag);
				}
			}
		}
	} catch(e) {
		 ngmf._error("[ngmf.setFromBtn] Exception :: ", e);
	}
};

/**  
 * 그룹 컴포넌트의 내부 입력컴포넌트들의 값들을 init(초기화) 하는 API입니다.
 * @date 2016-09-29
 * @memberOf ngmf
 * @param {String||Object} comp  :: I :: Y ::  :: 그룹컴포넌트 ID 혹은 객체.
 * @param {options} falg  :: I :: N ::  :: init 설정 옵션 객체.
 * 		   options.excludePlugin  :: I :: N ::  :: init 설정 제외 컴포넌트 객체명.
 * 		   options.excludeId  :: I :: N ::  :: init 설정 제외 컴포넌트 ID.
 * 		   options.fireEvent  :: I :: N ::  :: init 설정 컴포넌트 이벤트 발생 여부.
 * 		   options.recursive  :: I :: N ::  :: init 설정 하위 컴포넌트 포함 여부.
 * @author  이동규
 * @useMobile true
 * @example 
 * var groupOption = {"excludePlugin" : "textArea", recursive" : true}; 
 * ngmf.initGroup("group1", groupOption); 
 * //group1 이라는 그룹 객체의 내부 input 타입 컴포넌트의 값들을 초기화 합니다.
 * //단, init의 groupOption에 따라 그룹 내부 하위 컴포넌트 포함 및 textArea 컴포넌트 제외에 하여 수행합니다.
 * 
 * @exampleAsIs 신규
 */ 
ngmf.initGroup = function(comp, options) {
	try {
		var grpComp = ngmf.object(comp);
		if (grpComp && grpComp.getPluginName && grpComp.getPluginName() === "group") {
			options = options || {};
			options.excludePlugin = options.excludePlugin || "";
			options.excludeId = options.excludeId || "";
			options.fireEvent = options.fireEvent || false;
			options.recursive = options.recursive || false;

			var depth = typeof arguments[2] == "undefined" ? 1 : ngmf.toNumber(arguments[2]);
			if (typeof depth !== "number") depth = 1;
			var inputStack = grpComp.getChildren().slice(0);
			
			while(inputStack.length > 0 && depth > -1) {
				var rtn = __initStack(inputStack, depth, options);
				var childObj = rtn.stack;
				inputStack = [];
				for (var i = 0; i < childObj.length; i++) {
					var cGrpCom = ngmf.object(childObj[i]);
					if (grpComp && grpComp.getPluginName && grpComp.getPluginName() === "group") {
						var arr = childObj[i].getChildren().slice(0);
						for (var j = 0, len = arr.length; j < len; j++) {
							inputStack.push(arr[j]);
						}
					} else {
						inputStack.push(childObj[i]);
					}
				}
				depth = rtn.depth;
			}

			function __initStack (inputStack, depth, options) {
				var stack = inputStack || [];
				var childStack = [];
				while(stack.length > 0) {
					var node = stack.pop();
					if(node.setInitValue && (" "+options.excludePlugin+" ").indexOf(" "+node.options.pluginName+" ") == -1 && (" "+options.excludeId+" ").indexOf(" "+node.id+" ") == -1) {
						node.setInitValue(options);
					}

					if(options.recursive) {
						if (node.childControlList.length > 0) {
							for(var i = 0; i < node.childControlList.length; i++) {
								childStack.push(node.childControlList[i]);
							}
						}
					}
				}
				return {stack : childStack, depth : depth-1}
			};
		}		
	} catch(e) {
		ngmf._error("[ngmf.initGroup] Exception :: ", e);
	}
};