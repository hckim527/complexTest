
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

if(typeof GLD == "undefined" || !GLD) {
	GLD = window.top;
	GLV = GLD.scvar;
}
ngmf.SWING_PATH = "/SWING";
ngmf.SVC_PATH = "/websquare/Service";

ngmf.initNgmvAll = function() {
	// ngmf.js 
	ngmv.isWindowPopup = (function() {
		var rtn = window.top.location.href.indexOf("popup_sub.html") > 0 ? true : false;
		return rtn;
	})();
	if(ngmv.isWindowPopup) { 
		console.log("GLV, GLD 초기화 - window.open");
		GLD = window.top.opener.GLD;
	}
	ngmv.isPopupWorkspace = (function() {
		var rtn = GLD.location.href.indexOf("sub_fv.xml") > 0 ? true : false;
		return rtn;
	})();
	if(ngmv.isPopupWorkspace) { 
		console.log("GLV, GLD 초기화 - 작업영역(팝업)");
		GLD = GLD.opener ;
	} 

	ngmv.mainTop = window.top;
	ngmv._callbackFuncIdx = 0;
	ngmv._callbackFuncObj = {};
	ngmv._popOverObject = {};
	
	iframeShow = false;
	wframeShow = false; 

	/*
	 * Debugging에 사용하는 API로 로그정보
	 */
	ngmv.LOG_LEVEL = 0;  // 0 : all, 100 : debug, 200 : log, trace, 300 : error, 900 : off
	ngmv.LOG_ALL = 0;
	ngmv.LOG_DEBUG = 100;
	ngmv.LOG_LOGS = 200;   // console.log, console.trace
	ngmv.LOG_ERRORS = 300;
	ngmv.LOG_OFF = 400;

	// pubComm.js
	ngmv._overLayer = {};

	//ZAPP_Grid.js
	ngmv.rtnDFlag = "";
	ngmv.rtnDate = "";
	ngmv.objBindDs = "";
	ngmv.grdRow = "";
	ngmv.grdColId = "";
	ngmv.mCnt = "";
	ngmv.gCnt = "";
	ngmv.sortCol = "";

	//ZAPP_Service.js
	ngmv.errorCode = null;
	ngmv.errorMsg = null;
	ngmv.focusLovNext = null;
	ngmv.orgTimer = null;
	ngmv.orgTimerPush = null;
	ngmv.fCloseAccount = null;
	ngmv.fScreenName = "";
	ngmv.apmScreen = null;
	ngmv.sourceObj; // 추가될 DataSet
	ngmv.appendObj; // 추가할 DataSet
	ngmv.comboObj = null;
	ngmv.comboEditableFlag = false;
	ngmv.comboEditableValue = "";
	ngmv.isUseProgress = true;

	// 2009-07-09 Append 김주일차장/ORDER Start
	ngmv.pushAsyncTimeoutCallBack = null;

	//ZNGMXSYS00010.js
	ngmv.dateObj = new Date();
	ngmv.escCnt = 0;
	ngmv.addHead = false;
	ngmv.headRow;
	ngmv.dialogFg = false;
	ngmv.formID; //문제 가능성 있음
	ngmv.popUpInitIconValue = true;
	ngmv.popUporgActivate;
	ngmv.popUporgUnLoad;
	ngmv.rdContents = "";
	ngmv.outflag = false; // 공통 Icon 관련 변수
	ngmv.bLoadFormId = false; //문제 가능성 있음
	ngmv.formHandle = null; //문제 가능성 있음


	/*====================================================================
	= 기능 : Report Designer - Folder Define
	=====================================================================*/
	ngmv.strUrlPort = "";
	ngmv.HomeServer = "";
	ngmv.RDAAT = "AAT/";
	ngmv.RDAFX = "AFX/";
	ngmv.RDAPA = "APA/";
	ngmv.RDASM = "ASM/";
	ngmv.RDCAM = "CAM/";
	ngmv.RDCBA = "CBA/";
	ngmv.RDCCA = "CCA/";
	ngmv.RDCCD = "CCD/";
	ngmv.RDCDS = "CDS/";
	ngmv.RDCIA = "CIA/";
	ngmv.RDCIO = "CIO/";
	ngmv.RDCLM = "CLM/";
	ngmv.RDCOL = "COL/";
	ngmv.RDCOM = "COM/";
	ngmv.RDCSM = "CSM/";
	ngmv.RDCSS = "CSS/";
	ngmv.RDCTI = "CTI/";
	ngmv.RDDAT = "DAT/";
	ngmv.RDDMG = "DMG/";
	ngmv.RDEAI = "EAI/";
	ngmv.RDEDU = "EDU/";
	ngmv.RDEQP = "EQP/";
	ngmv.RDFIN = "FIN/";
	ngmv.RDINB = "INB/";
	ngmv.RDINT = "INT/";
	ngmv.RDINV = "INV/";
	ngmv.RDMBR = "MBR/";
	ngmv.RDMDF = "PSM/";
	ngmv.RDMET = "MET/";
	ngmv.RDMOP = "MOP/";
	ngmv.RDNGM = "NGM/";
	ngmv.RDORD = "ORD/";
	ngmv.RDOUT = "OUT/";
	ngmv.RDPAY = "PAY/";
	ngmv.RDPOS = "POS/";
	ngmv.RDPRD = "PRD/";
	ngmv.RDPRF = "PSM/";
	ngmv.RDPRM = "PRM/";
	ngmv.RDPSC = "PSC/";
	ngmv.RDPSE = "PSE/";
	ngmv.RDPSM = "PSM/";
	ngmv.RDRBP = "RBP/";
	ngmv.RDROM = "ROM/";
	ngmv.RDRPB = "RPB/";
	ngmv.RDSFA = "SFA/";
	ngmv.RDSNC = "PSM/";
	ngmv.RDSPM = "SPM/";
	ngmv.RDSSV = "SSV/";
	ngmv.RDSTR = "STR/";
	ngmv.RDSTS = "STS/";
	ngmv.RDTPM = "TPM/";
	ngmv.RDWIB = "WIB/";
	ngmv.RDWLN = "WLN/";
	ngmv.RDSAR = "SAR/";
	ngmv.RDOSS = "OSS/";
	ngmv.RDHCD = "HCD/";
	
	/*
	 * 엑셀 Non-Wait모드 설정 default값.
	 */
	ngmv.f_fileid = "";
	ngmv.full_file_path = "";
};


/*====================================================================
= 기능 : Namo Default Info(server, port)
=====================================================================*/ 
//ngmv.strNamoUrlPort = ngmf.getServerUrl("NAMO");
//ngmv.namoHomeServer = ngmv.strNamoUrlPort[0] + ngmf.decode(ngmf.length(ngmv.strNamoUrlPort[1]),0,"",":" + ngmv.strNamoUrlPort[1])+ "/" + ngmv.strNamoUrlPort[2];
/*=====================================================================*/

//ZAPP_Calendar.js
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|W|hh|mm|ss|SS|S|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "W": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "SS": 
            case "SSS": return d.getMilliseconds().zf(3);
            case "S": return "";
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

/* 빈함수 작업 -------------------------------------------------------------*/
G_EXCUTE_FORMLOAD_SET = function (){};

//기본 로그 설정
if (console.trace) {
	ngmf.trace = (function() {
		return Function.prototype.bind.call(console.trace, console, "[TRACE][] :");
	})();
	ngmf._trace = (function() {
		return Function.prototype.bind.call(console.trace, console, "[TRACE][공통] :");
	})();
} else {
	if (console.log) {
		ngmf.trace = (function() {
			return Function.prototype.bind.call(console.log, console, "[TRACE][] :");
		})();
		ngmf._trace = (function() {
			return Function.prototype.bind.call(console.log, console, "[TRACE][공통] :");
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
		return Function.prototype.bind.call(console.log, console, "[LOGS][] :");
	})();
	ngmf._log = (function() {
		return Function.prototype.bind.call(console.log, console, "[LOGS][공통] :");
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
 

if (console.error) {
	ngmf.error = (function() {
		return Function.prototype.bind.call(console.error, console, "[ERROR][]:");
	})();

	ngmf._error = (function() {
		return Function.prototype.bind.call(console.error, console, "[ERROR][공통] :");
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

if (console.debug) {
	ngmf.debug = (function() {
		return Function.prototype.bind.call(console.debug, console, "[DEBUG][] :");
	})();

	ngmf._debug = (function() {
		return Function.prototype.bind.call(console.debug, console, "[DEBUG][공통] :");
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
 