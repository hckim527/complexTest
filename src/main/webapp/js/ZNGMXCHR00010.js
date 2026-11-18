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
 * Character Set 검사 (String 값이 입력가능인수이에 있는지 검사)
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Object/String} 	chkCharObj  :: I :: N ::  :: 검사대상
 * @param {String} 			validate    :: I :: N ::  :: 유효성체크용 값
 * @param {String} 			strTxt      :: I :: N ::  :: 검사대상 라벨명 
 * @param {Boolean} 		FuncKeyflg  :: I :: N ::  :: FuncKeyflg
 * @param {String} 			strColumnID :: I :: Y ::  :: 그리드컬럼ID
 * @param {string} 			UsrStrAdd   :: I :: Y ::  :: 사용자입력 비교 문자열
 * @param {Boolean} 		noAlert  :: I :: Y ::  :: true=>Alert 창 안뜸
 * @return {Boolean} 		true/false 
 * @author 이진수
 * @update 한글 확장형 체크로직 추가 MSC  :: 성일호 2016-06-01
 * @useMobile use
 * @example ngmf.chkCharValid(edt_custnm, "KSC,ENG,NUM,SPL","고객명"); 
 *                  ngmf.chkCharValid(edt_custnm, "MSC,ENG,NUM,SPL","고객명");
 *                  ngmf.chkCharValid(" 눝", "KSC,ENG,NUM,SPL","고객명"); //오류
 *                  ngmf.chkCharValid(" 눝", "MSC,ENG,NUM,SPL","고객명"); //정상


 *  ○ Characterset 체크 API (ngmf.chkCharValid)
   1. 기본형 인지 Check할때, 
       → ngmf.chkCharValid(edt_custnm, "KSC", "고객명")
   2. 기본형이 아닌 확장형 인지 Check할때
       → ngmf.chkCharValid(edt_custnm, "MSC", "고객명")
   3. 기본형, 확장형 인지 Check할때
       → ngmf.chkCharValid(edt_custnm, "MSC,KSC", "고객명")
   4. 확장형을 포함하지 않는 전체를 Check할때 
       → ngmf.chkCharValid(edt_custnm, "ALL", "고객명")
   5. 확장형을 포함하는 전체를 Check할때 
       → ngmf.chkCharValid(edt_custnm, "@LL", "고객명")
 　 　 

 * @ngmfAPI

*/ 

ngmf.chkCharValid = function(chkCharObj, validate, strTxt, FuncKeyflg, strColumnID, UsrStrAdd, _noAlert) {
	var str_intxt = "";
	var objDs = null;
	var noAlert = _noAlert || false;
	try { 
		var strErr = new Array();
		strErr.push("ngmf.chkCharValid() :: 첫번째 파라미터[검사대상] 오류");
		strErr.push("ngmf.chkCharValid() :: 두번째 파라미터[유효성체크용 값] 오류");
		strErr.push("ngmf.chkCharValid() :: 세번째 파라미터[검사대상 라벨명] 오류");
		strErr.push("ngmf.chkCharValid() :: 네번째 파라미터 오류");
		strErr.push("ngmf.chkCharValid() :: 다섯번째 파라미터 오류");
		strErr.push("ngmf.chkCharValid() :: 여섯번째 파라미터 오류");
		
		//var UsrStrCheck = ngmf.setCharSpecialLarge();
		//chkCharObj = ngmf.object(chkCharObj);
		//아규먼트 확인 (첫번째)
		if (!chkCharObj )
		{
			if (!noAlert) ngmf.alert(strErr[0]);
			return false;
		}	
		// 오브젝트와 스트링 구분
		if ( ngmf.isValidObject(chkCharObj) )
		{	
			// Grid 가 아닌 Edit, TextArea, Combo 
			if (	chkCharObj.getPluginName() == "input" 
				|| 	chkCharObj.getPluginName() == "textarea" 
				|| 	chkCharObj.getPluginName() == "selectbox"){
				
				str_intxt = ngmf.trim(chkCharObj.getValue());
				
			}else if( chkCharObj.getPluginName() == "gridView" ){		// 오브젝트 종류 확인
				
				if( strColumnID.length == 0 ) {
					if (!noAlert) ngmf.alert(strErr[4]);
					return false;
				}			
				
				objDs = ngmf.object(chkCharObj.getDataList());			
				var arrGridCol = strColumnID.split(",");
				for (var i = 0 ; i < arrGridCol.length ; i++ ){
					
					if(typeof objDs.getColumnIndex(arrGridCol[i]) === "undefined"){
						if (!noAlert) ngmf.alert(strErr[4]);
						return false;
					}
				}
				
			}else{
				if (!noAlert) ngmf.alert(strErr[0]);
				return false;		
			}//if (chkCharObj.GetType() == "Edit" ....
			
		}else{
			if (chkCharObj == "" ){
				if (!noAlert) ngmf.alert(strErr[0]);
				return false;
			}else{
				str_intxt = chkCharObj;	
			}
		}	
		
		//아규먼트 확인 (두번째)
		if (validate == null || ngmf.length(validate) < 3){
			if (!noAlert) ngmf.alert(strErr[1]);
			return false;
		}
		
		if (strTxt == null || strTxt == "" ){
			if (!noAlert) ngmf.alert(strErr[2]);
			return false;
		}
			
		if ( !ngmf.isValidObject(FuncKeyflg) ){
			
			if (typeof FuncKeyflg === "boolean") {
				if ( !((FuncKeyflg ==  true) || (FuncKeyflg == false)) ){
					if (!noAlert) ngmf.alert(strErr[3]);
					return false;
				}
			}

			if ( !((typeof FuncKeyflg === "boolean") || (typeof FuncKeyflg === "number") || ( FuncKeyflg == null )) ){
				if (!noAlert) ngmf.alert(strErr[3]);
				return false;
			}
			
		}else{
			if (!noAlert) ngmf.alert(strErr[3]);
			return false;
		}
		
		if(FuncKeyflg != true){
			FuncKeyflg = false;
		}
			
		if( (UsrStrAdd != null) && (typeof UsrStrAdd === "string") ){
			validate += ",USR";
		} else if ( (UsrStrAdd != null) && (typeof UsrStrAdd !== "string") ){
			alert(strErr[5]);
			return false;
		}
		
		// for (i=0; i<length(UsrStrAdd); i++) {
			// single_UsrStr = substr(UsrStrAdd,i,1);
			// if (IndexOf(UsrStrCheck, single_UsrStr) < 0 ){
				// alert(strErr[5]);
				// return false;
			// }	
		// }	
	 
		var rtnFlg = true;
		var strCompare = " ";	
		
		// 검색범위 확인
		var trimValidate = ngmf.trim(validate);
		var strToken = trimValidate.split(",");

		for(var i = 0 ; i < strToken.length ; i++ ){		
			// chr(13) : ENTER처리 , chr(9) : Tab
			switch( (strToken[i]) )
			{
				case "MSC":  //한글(EUC-KR, CP949) 
					strCompare += ngmf.setCharCP949(true);
				break;
			
				case "KSC":  //한글
					strCompare += ngmf.setCharKS5601();
				break;
				
				case "ENG":  //영어
					strCompare += ngmf.setCharAlphabat();
				break;
					
				case "NUM":  //숫자
					strCompare += ngmf.setCharNum();
				break;
				
				case "SPL":  //전체 특수문자
					strCompare += ngmf.setCharSpecialLarge();
				break;
				
				case "SPS":	//부분 특수문자
					strCompare += ngmf.setCharSpecialSmall();
				break;
				
				case "JAP": //일어
					strCompare += ngmf.setCharJapan();
				break;
				
				case "CHI": //한자
					strCompare += ngmf.setCharChina();
				break;
				
				case "USR":
					strCompare += UsrStrAdd;
				break;
				
				case "ALL":
					strCompare =  ngmf.setCharKS5601();
					strCompare += ngmf.setCharAlphabat(); 
					strCompare += ngmf.setCharNum(); 
					strCompare += ngmf.setCharJapan();
					strCompare += ngmf.setCharChina();
					strCompare += ngmf.setCharSpecialLarge();
					//strCompare += ngmf.setCharCP949();
				break;

				case "@LL":
					strCompare =  ngmf.setCharKS5601();
					strCompare += ngmf.setCharAlphabat(); 
					strCompare += ngmf.setCharNum(); 
					strCompare += ngmf.setCharJapan();
					strCompare += ngmf.setCharChina();
					strCompare += ngmf.setCharSpecialLarge();
					strCompare += ngmf.setCharCP949();
				break;
				
				// second parameter 오류 입력시 경고 출력 / false 리턴
				default:
					if (!noAlert) ngmf.alert(strErr[1]);
					return false;
			}
			if (strToken[i] == "ALL") break;
		}

		if (FuncKeyflg){
			strCompare += ngmf.chr(9) + ngmf.chr(13);
		}
		
		if(chkCharObj.getPluginName && chkCharObj.getPluginName() == "gridView" ){
			
			var arrGridCol = strColumnID.split(",");
			var objDsStr = chkCharObj.getDataList();
			var objDS = ngmf.object(objDsStr);
			var nCol;
			
			for (var i=0;i<objDS.getRowCount();i++) {
				if(objDS.getRowStatus( i ) == "R") {
					for (var j=0; j<arrGridCol.length; j++) {
						rtnFlg = ngmf.checkString(objDS.getCellData(i, arrGridCol[j]), strCompare, strTxt, noAlert );
						if(rtnFlg != true) {			
							
							nCol = ngmf.chkCharGridCol(chkCharObj,arrGridCol[j]);
							chkCharObj.setFocusedCell( i , nCol , true );
							
							return false;
							
						} //if
					} //for
				} //if
			} //for
			
			return rtnFlg;
			
		} else {
			return ngmf.checkString( str_intxt, strCompare, strTxt, noAlert );		
		}
	} catch (e) {
		ngmf._error("[ngmf.chkCharValid] Exception :: ", e);
	}
};

/**
 * 그리드의 컬럼의 값을 가져온다. 
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {Object} obj      :: I :: N ::  :: 그리드오브젝트
 * @param {String} strColID :: I :: N ::  :: 그리드의 컬럼아이디
 * @return {Number} +숫자/-숫자
 * @author 이진수
 * @useMobile use
 * @example ngmf.chkCharGridCol(chkCharObj,arrGridCol[j]);
 */
ngmf.chkCharGridCol = function(obj,strColID) {
	return obj.getColumnIndex(strColID);
};

/**
 * 단순 str_intxt 값이 검색대상(strCompare)에 없으면 Alert으로 경고
 * @date 2015-10-12
 * @memberOf ngmf
 * @param {String} str_intxt  :: I :: N ::  :: 대상텍스트
 * @param {String} strCompare :: I :: N ::  :: 비교텍스트
 * @param {String} strTxt     :: I :: N ::  :: 검색대상 라벨명
 * @param {Boolean} noAlert     :: I :: Y ::  :: Alert 창 뜨지않게
 * @return {boolean} true/false
 * @author 이진수
 * @useMobile use
 * @example ngmf.checkString( str_intxt, strCompare, strTxt, noAlert);
 */
ngmf.checkString = function( str_intxt, strCompare, strTxt, _noAlert){
	var rtnFlg = true;
	var noAlert = _noAlert || false;
	try {
		var single_char;
		var rtnVal = "";
		
		for (var i=0; i<ngmf.length(str_intxt); i++) {
			single_char = str_intxt.substr(i,1);
			if (strCompare.indexOf(single_char) < 0) {
				
				// 오류 문자 중복 체크 
				if (rtnVal.indexOf(single_char) < 0 ){
					if ( ngmf.asc(single_char) == 13 ){
						if (rtnVal.indexOf("EnterKey") < 0 ){
							rtnVal += " EnterKey ";
						}
					}else if(ngmf.asc(single_char) == 9){
						if (rtnVal.indexOf("TabKey") < 0 ){
							rtnVal += " TabKey ";
						}
					}else{
						 rtnVal += single_char;
					}
				}
				
				rtnFlg = false;
				break;
			}
		}
		
		if (!rtnFlg){
			if (!noAlert) ngmf.alert( strTxt + " : " + "[" + rtnVal + "]" + "\n오류 문자입니다. 수정해 주세요." );
		}
	} catch (e) {
		ngmf._error("[ngmf.checkString] Exception :: ", e);
	}	
	return rtnFlg;
};

/**
 * KS5601 Compare Character Set.
 * @date 2015-10-12
 * @memberOf ngmf
 * @author 이진수
 * @update 2016.04.29 이동규 함수 리팩토닝[데이터참조 수정.]
 * @return {String} KS5601 Compare Character Set문자열
 * @update 메인(GLR.xml)에서 가져오도록 수정 : 성일호 2016-06-01
 * @useMobile use 
 * @example ngmf.setCharKS5601();
 */
ngmf.setCharKS5601 = function() {
	var retStr = GLV.ksc_hangul || ""; 
	return  retStr + " ";
};

/**
 * Number Compare Character Set
 * @date 2015-10-12
 * @memberOf ngmf
 * @author 이진수
 * @update 2016.04.29 이동규 함수 리팩토닝[불필요한 코딩 삭제.]
 * @return {String} Number Compare Character Set 문자열
 * @useMobile use
 * @example ngmf.setCharNum();
 */
ngmf.setCharNum = function() {
	var strFixNum = "1234567890"; 		
	return strFixNum;
};

/**
 * Alphabat Compare Character Set
 * @date 2015-10-12
 * @memberOf ngmf
 * @author 이진수
 * @update 2016.04.29 이동규 함수 리팩토닝[데이터참조 수정.]
 * @return {String} Alphabat Compare Character Set 문자열
 * @useMobile use
 * @example ngmf.setCharAlphabat();
 */
ngmf.setCharAlphabat = function() {
	var strFixAlphabat = new Array();
	strFixAlphabat.push("abcdefghijklmnopqrstuvwxyz");
	strFixAlphabat.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
	return strFixAlphabat.join("");
};

/**
 * Special Character Compare Character Set (Large)
 * @date 2015-10-12
 * @memberOf ngmf
 * @author 이진수
 * @update 2016.04.29 이동규 함수 리팩토닝[불필요한 코딩 삭제.]
 * @return {String} Special Character Compare Character Set (Large) 문자열
 * @useMobile use
 * @example ngmf.setCharSpecialLarge();
 */
ngmf.setCharSpecialLarge = function() {
	var strFixSpecial = "!@#$%^&*()-_+=\\{}[]~`:;\"\'<>,.?/|";		
	return strFixSpecial;
};

/**
 * Special Character Compare Character Set (Small)
 * @date 2015-10-12
 * @memberOf ngmf
 * @return {String} Special Character Compare Character Set 문자열
 * @author 이진수
 * @update 2016.04.29 이동규 함수 리팩토닝[불필요한 코딩 삭제.]
 * @useMobile use
 * @example ngmf.setCharSpecialSmall();
 */
ngmf.setCharSpecialSmall = function() {
	var strFixSpecial = " \`~&*\()_|:\"\',/.";
	return strFixSpecial;
};

/**
 * JAPANESS Character Compare Character Set
 * @date 2015-10-12
 * @memberOf ngmf
 * @author 이진수
 * @update 2016.04.29 이동규 함수 리팩토닝[데이터참조 수정.]
 * @return {String} JAPANESS Character Compare Character Set 문자열
 * @useMobile use
 * @example ngmf.setCharJapan();
 */
ngmf.setCharJapan = function() { 
	var strFixSpecial = new Array();	
	strFixSpecial.push("ぁあぃいぅうぇえぉおかがきぎく");
	strFixSpecial.push("ぐけげこごさざしじすずせぜそぞた");
	strFixSpecial.push("だちぢっつづてでとどなにぬねのは");
	strFixSpecial.push("ばぱひびぴふぶぷへべぺほぼぽまみ");
	strFixSpecial.push("むめもゃやゅゆょよらりるれろゎわ");
	strFixSpecial.push("ゐゑをん");
	strFixSpecial.push("ァアィイゥウェエォオカガキギク");
	strFixSpecial.push("グケゲコゴサザシジスズセゼソゾタ");
	strFixSpecial.push("ダチヂッツヅテデトドナニヌネノハ");
	strFixSpecial.push("バパヒビピフブプヘベペホボポマミ");
	strFixSpecial.push("ムメモャヤュユョヨラリルレロヮワ");
	strFixSpecial.push("ヰヱヲンヴヵヶ");
	return strFixSpecial.join("");
};

/**
 * Chinese Character Compare Character Set
 * @date 2015-10-12
 * @memberOf ngmf
 * @author 이진수
 * @update 2016.04.29 이동규 함수 리팩토닝[데이터참조 수정]
 * @return {String} Chinese Character Compare Character Set 문자열
 * @update 메인(GLR.xml)에서 가져오도록 수정 : 성일호 2016-06-01 
 * @useMobile use
 * @example ngmf.setCharChina();
 */
ngmf.setCharChina = function() {
	var retStr = GLV.cp_hanja || ""; 
	return  retStr; 
};

/**
 * Chinese Character Compare Character Set[한글]
 * @date 2015-10-12
 * @memberOf ngmf
 * @author 이진수
 * @update 2016.04.29 이동규 함수 리팩토닝[데이터참조 수정]
 * @return {String} Chinese Character Compare Character Set 문자열
 * @update 메인(GLR.xml)에서 가져오도록 수정 : 성일호 2016-06-01 
 * @useMobile use
 * @example ngmf.setCharChina();
 */
ngmf.setCharChinaHan = function() {
	var retStr = GLV.cp_hangul || ""; 
	return  retStr;
}; 

/**
 * Chinese Character Compare Character Set[CP949]
 * @date 2015-10-12
 * @memberOf ngmf
 * @param  {Boolean} mscOnly   :: I :: N :: false :: ksc가 포함되지 않은 msc만 반환하는경우 true
 * @author 이진수
 * @update 2016.04.29 이동규 함수 리팩토닝[데이터참조 수정]
 * @return {String} Chinese Character Compare Character Set 문자열
 * @update 메인(GLR.xml)에서 가져오도록 수정 : 성일호 2016-06-01 
 * @useMobile use
 * @example ngmf.setCharChina();
            ngmf.setCharChina(true); //ksc 제외 
  */
ngmf.setCharCP949 = function(mscOnly) {
	var msc = false;
	var retStr = "";
	if(mscOnly !=="undefined"){
		msc = mscOnly;
	}
	if(msc == true){
		retStr = GLV.cp_mscArr.join("");
	}else{
		retStr = GLV.cp_hanall || ""; 
	}
		
		return  " " + retStr; 
};

	

/** 
 *  한자를 입력받아 한자(4,888자)에 해당하는 한글을 찾아줌 
 *  
 * @date 2016-06-01
 * @memberOf ngmf
 * @param {Object/String} 	chkCharObj  :: I :: Y ::  :: 검사대상
 * @param {String} inStr  :: I :: Y ::  :: 대상 한자 또는 툴팁 설정 여부
 * @param {Boolean} openToolTip  :: I :: Y ::  :: 툴팁 보여주기
 * @return {String} 
 * @author 성일호
 * @useMobile use
 * @example 
 	1. 두번째 파라미터에 정의된 한자를 한글로 변환해서 반환하는 예제 
	ngmf.getHanjaToHangul("", "成一鎬" );  // "成一鎬" -> "성일호"

	2. 첫번째 파라미터에 정의된 컴포넌트의 값을 읽어서 한자를 한글로 변환해서 Tooltip으로 표시 (컴포넌트에 Mouse Over 시 한자가 표시됨)
	ngmf.getHanjaToHangul("resultTxt",true ); // resultTxt 컴포넌트에 Mouse Over 이벤트 발생 시 Tooltip 방식으로 한자가 표시됨
	
	3. 첫번째 파라미터에 정의된 컴포넌트의 값을 읽어서 한자를 한글로 변환해서 Tooltip으로 표시 (API가 실행되면 자동으로 컴포넌트의 한자가 표시됨)
	ngmf.getHanjaToHangul("resultTxt",true, true ); // resultTxt 컴포넌트에 Mouse Over를 하지 않아도 자동으로 Tooltip 방식으로 한자가 표시됨 
	 */
ngmf.getHanjaToHangul = function (chkCharObj, _inStr, openToolTip) {
	var retStr = "";
	try {
		var inStr = _inStr;
		var isHanja = false;
		chkCharObj = ngmf.object(chkCharObj);
		if (chkCharObj) inStr = chkCharObj.getValue() ;
		if (typeof inStr != "undefined" && inStr) {
			inStr = inStr.trim();
			var hgIdx = -1;
			for (var i = 0; i < inStr.length; i++) {
				hgIdx = GLV.cp_hanja.indexOf(inStr.charAt(i));
				if (hgIdx == -1) retStr += inStr.charAt(i);
				else {
					isHanja = true;
					retStr += GLV.cp_hangul.charAt(hgIdx); 
				}
			}
			if (chkCharObj && _inStr && isHanja) {
				WebSquare.getBody().setToolTip(chkCharObj.render, retStr);
				if(openToolTip) WebSquare.getBody().showToolTip(null, chkCharObj.render, retStr);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getHanjaToHangul] Exception :: ", e);
	}
	return  retStr; 
};


/**
 *  Character Set 검사 (String 값이 입력가능 한지 검사)
 *  경고창 뜨지 않음
 *  
 * @date 2016-06-03
 * @memberOf ngmf
 * @param {Object/String} 	chkCharObj  :: I :: N ::  :: 검사대상
 * @param {String} 			validate    :: I :: N ::  :: 유효성체크용 값
 * @param {String} 			strTxt      :: I :: N ::  :: 검사대상 라벨명 
 * @param {Boolean} 		FuncKeyflg  :: I :: N ::  :: FuncKeyflg
 * @param {String} 			strColumnID :: I :: Y ::  :: 그리드컬럼ID
 * @param {string} 			UsrStrAdd   :: I :: Y ::  :: 사용자입력 비교 문자열 
 * @return {Boolean} 		true/false 
 * @author 성일호
 * @useMobile use
 * @example ngmf.chkCharValidOnly(resultTxt, "KSC,CHI,NUM,SPL","고객명", false); 
 *                  ngmf.chkCharValidOnly("resultTxt", "MSC,ENG,NUM,SPL","고객명", false);
 */
ngmf.chkCharValidOnly = function(chkCharObj, validate, strTxt, FuncKeyflg, strColumnID, UsrStrAdd) {
	return ngmf.chkCharValid(chkCharObj, validate, strTxt, FuncKeyflg, strColumnID, UsrStrAdd,  true); 
};


/** 
 *  MSC한글를 입력받아 KSC한글로 변환합니다. 

 	확장형 → 기본형 변환 API (ngmf.getMscToKscHangul)
    1. 확장형이 입력된 경우, 기본형으로 변환합니다.
    2. 확장형 외 값이 입력된 경우, 입력한 값을 유지합니다.
        예) input : "이눝A" -----> output : "이눋A" 
 *  
 * @date 2016-06-01
 * @memberOf ngmf
 * @param {Object/String} 	chkCharObj  :: I :: Y ::  :: 검사대상
 * @param {String} inStr  :: I :: Y ::  :: 대상 한자 또는 툴팁 설정 여부
 * @param {Boolean} openToolTip  :: I :: Y ::  :: 툴팁 보여주기
 * @return {String} 
 * @author 김응한
 * @useMobile use
 * @example 
 	1. 두번째 파라미터에 정의된 MSC한글을 KSC한글로 변환해서 반환하는 예제 
	ngmf.getMscToKscHangul("", "꺹꺺꺻" );  // "꺹꺺꺻" -> "깻깹깻"

	2. 첫번째 파라미터에 정의된 컴포넌트의 값을 읽어서 MSC한글을 KSC한글로 변환해서 Tooltip으로 표시 (컴포넌트에 Mouse Over 시 KSC한글이 표시됨)
	ngmf.getMscToKscHangul("resultTxt",true ); // resultTxt 컴포넌트에 Mouse Over 이벤트 발생 시 Tooltip 방식으로 가 표시됨
	
	3. 첫번째 파라미터에 정의된 컴포넌트의 값을 읽어서 MSC한글을 KSC한글로 변환해서 Tooltip으로 표시 (API가 실행되면 자동으로 컴포넌트의 KSC한글이 표시됨)
	ngmf.getMscToKscHangul("resultTxt",true, true ); // resultTxt 컴포넌트에 Mouse Over를 하지 않아도 자동으로 Tooltip 방식으로 KSC한글이 표시됨 


	 */
ngmf.getMscToKscHangul = function (chkCharObj, _inStr, openToolTip) {
	var retStr = "";
	try {
		var inStr = _inStr;
		var isKsc = false;
		chkCharObj = ngmf.object(chkCharObj);
		if (chkCharObj) inStr = chkCharObj.getValue() ;
		if (typeof inStr != "undefined" && inStr) {
			inStr = inStr.trim();
			var hgIdx = -1;
			for (var i = 0; i < inStr.length; i++) {
				hgIdx = GLV.cp_msc.indexOf(inStr.charAt(i));
				if (hgIdx == -1) retStr += inStr.charAt(i);
				else {
					isMsc = true;
					retStr += GLV.cp_ksc.charAt(hgIdx); 
				}
			}
			if (chkCharObj && _inStr && isMsc) {
				WebSquare.getBody().setToolTip(chkCharObj.render, retStr);
				if(openToolTip) WebSquare.getBody().showToolTip(null, chkCharObj.render, retStr);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.getMscToKscHangul] Exception :: ", e);
	}
	return  retStr; 
};
