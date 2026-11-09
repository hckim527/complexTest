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
* ngmf.setRadio
* @date 2015. 10. 23.
* @memberOf ngmf
* @param {Object} objRdo :: I :: N ::  :: Radio Component
* @param {Object} objDs  :: I :: N ::  :: dataList Component
* @param {String} pCode  :: I :: N ::  :: Label Column 명
* @param {String} pVal   :: I :: N ::  :: Value Column 명
* @param {Number} disCnt :: I :: Y ::  :: colSpan(미사용)
* @returns {Boolean} 결과.
* @author P067401
* @useMobile use
* @example ngmf.setRadio(rab_CnslTrnsfYn, dsl_CnslTrnsfYn, "Code", "Value", 2); //return true;
* @since
*/ 
ngmf.setRadio = function(objRdo, objDs , pCode, pVal, disCnt) {
	try {
		var objRdo = ngmf.object(objRdo);
		var objDs = ngmf.object(objDs);

		if (typeof objRdo == "undefined" && typeof objDs == "undefined") return false;
		//pVal : 라벨값, pCode : value값.
		objRdo.setNodeSet( "data:"+objDs.getID() , pVal, pCode);
	
	//TODO :: disCnt로 colspan, rows 등 설정 문제
		return true;
	} catch(e) {
    	ngmf._error("[ngmf.setRadio] Exception :: ", e);
	}
};
