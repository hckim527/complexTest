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
 * Grid 일괄 Check 처리.
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Object} gridView :: I :: N :: :: Component ID[권장] or objGrd gridView Component
 * @param {String} chkCol          :: I :: N :: :: 체크컬럼
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.gridSelChk(GridId, Check Column ID);
 * @exampleAsIs ngmf_GridSelChk(GridId , Check Column ID);
 */
ngmf.gridSelChk = function(grdId, chkCol) {
	try {
		var objGrd = ngmf.object(grdId);
		var objDs = objGrd.getDataList();

		if (objGrd.getReadOnly() == true)
			return;

		var headerInputType = objGrd.headerInfoHash[[ objGrd.getHeaderID(0) ]].options.inputType;

		if (headerInputType == "checkbox") {
			if (objGrd.getHeaderValue(objGrd.getHeaderID(0)) == true) {
				objGrd.setHeaderValue(objGrd.getHeaderID(0), false);
				objGrd.checkAll(0, 0);
			} else {
				objGrd.setHeaderValue(objGrd.getHeaderID(0), true);
				objGrd.checkAll(0, 1);
			}
		} else {
			var fIndex = objDs.getMatchedIndex(chkCol, 0);
			if (fIndex.length == 0) {
				objGrd.checkAll(0, 0);
			} else {
				objGrd.checkAll(0, 1);
			}
		}
	} catch(e) {
		ngmf._error("[ngmf.gridSelChk] Exception :: ", e);
	}
};

/**
 * dataList Check Column Toggle 처리 (공통). 
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {Number} chkVal        :: I :: N :: :: 선택/해제 여부 값
 * @param {String/Object} strDs  :: I :: N :: :: dataList ID
 * @param {String} chkCol        :: I :: N :: :: 체크컬럼
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.setGrdChk(chk_val, objDs, chk_col);
 * @exampleAsIs ngmf_SetGrdChk(chk_val, objDs, chk_col);
 */
ngmf.setGrdChk = function(chkVal, strDs, chkCol) {
	try {
		var objDs = ngmf.object(strDs);
		
		if (typeof objDs == "undefined") return;

		for ( var i = 0; i < objDs.getRowCount(); i++) {
			objDs.setCellData(i, chkCol, chkVal);
		}
	} catch(e) {
		ngmf._error("[ngmf.setGrdChk] Exception :: ", e);
	}
};

/**
 * ngmf.insRow GridView Row Insert (공통).
 * 단, 필터가 설정되어 있는 데이터일 경우 rowIndex를 정상적이지 않을 수 있습니다.
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Object} objDs :: I :: N ::   :: dataList Component ID 또는 objDs dataList Component
 * @param {String} chkCol       :: I :: N ::   :: 체크컬럼
 * @param {String} trueValue    :: I :: Y :: 1 :: "1" 이외의 그리드 checkbox trueValue 설정 시 값(option)
 * @param {String} falseValue   :: I :: Y :: 0 :: "0" 이외의 그리드 checkbox trueValue 설정 시 값(option)
 * @return {Number} 추가된 데이터 리스트의 Row Index.
 * @sampleLink grd_resultSearch
 * @author 이동규
 * @useMobile use
 * @update 2016.03.09. 
 * 		   chkCol이 존재 하지 않는 경우 최하단의 insertRow를 하는 기준이 getRowCount()로 설정 되었는 부분을
 *		   getToltalRow() 기준으로 수정합니다.([UI-0966]drillDown 또는 filter 일 경우 insRow 위치가 이상.) 
 * @update 이동규 2016.09.12 데이터가 필터가 걸려 있을 경우를 고려하여 getRowCount() 필터가 정렬되어 있는 부분을 
 *         데이터 뿐만아니라 전체 데이터의 경우를 고려하도록 수정합니다.
 * @sync true
 * @example ngmf.insRow(objDs, chk_col);
 * @exampleAsIs ngmf_InsRow(objDs, chk_col);
 */
ngmf.insRow = function(dataListID, chkCol, trueValue, falseValue) {
	try {
		var objDs = ngmf.object(dataListID);
		var insertRowIdex;
		if (typeof objDs == "undefined") return;
		
		if (objDs.getRowCount() == 0) {
			// objDs.addRow();
			objDs.insertRow(0);
			return 0;
		}

		if (typeof trueValue == "undefined" || ngmf.isNull(trueValue) == "Y")
			trueValue = "1";
		if (typeof falseValue == "undefined" || ngmf.isNull(falseValue) == "Y")
			falseValue = "0";

		if(typeof objDs.getColumnIndex(chkCol) != "undefined") {
			var chk_RowArr = objDs.getMatchedIndex(chkCol, trueValue, true);
			if(chk_RowArr.length == 1) {
				insertRowIdex = objDs.insertRow(chk_RowArr[0]+1);
			} else {
				insertRowIdex = objDs.insertRow(objDs.getTotalRow());
			}
		} else {
			insertRowIdex = objDs.insertRow(objDs.getTotalRow());
		}
		
		return insertRowIdex;
	} catch(e) {
		ngmf._error("[ngmf.insRow] Exception :: ", e);
	}
};

/**
 * ngmf.delRow Grid Row Delete (공통).
 * 단, 필터가 설정되어 있는 데이터의 는 고려하지 않습니다.
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Object} objDs :: I :: N ::   :: dataList Component
 * @param {String} chkCol       :: I :: N ::   :: 체크컬럼
 * @param {String} trueValue    :: I :: Y :: 1 :: "1" 이외의 그리드 checkbox trueValue 설정 시 값(option)
 * @sampleLink grd_resultSearch
 * @author 이동규
 * @update 이동규 2016.09.12 데이터가 필터가 걸려 있을 경우를 고려하여 getRowCount() 필터가 정렬되어 있는 부분을 
 *         데이터 뿐만아니라 전체 데이터의 경우를 고려하도록 수정합니다.
 * @useMobile use
 * @sync true
 * @example ngmf.delRow(objDs, chk_col);
 * @exampleAsIs ngmf_DelRow(objDs, chk_col);
 */
ngmf.delRow = function(dataListID, chkCol, trueValue) {
	try {
		var objDs = ngmf.object(dataListID);
		var trueValue1 = trueValue;
		var trueValue2 = null;
		if (typeof objDs == "undefined" && typeof objDs.getColumnIndex(chkCol) == "undefined") return;

		if (objDs.getRowCount() == 0) {
			ngmf.alert("처리할 데이타가 없습니다.");
			return;
		}
 
		if (typeof trueValue1 == "undefined" || ngmf.isNull(trueValue1) == "Y") {
			trueValue1 = "1";
			trueValue2 = 1;
		}
		
		if(typeof objDs.getColumnIndex(chkCol) != "undefined") {
			var removeRows = [];
			var chk_RowArr1 = objDs.getMatchedIndex(chkCol, trueValue1, true);
			var chk_RowArr2 = [];
			if (trueValue2 !== null) {
				chk_RowArr2 = objDs.getMatchedIndex(chkCol, trueValue2, true);
			}
			for (var i = 0; i < chk_RowArr1.length; i++) {
				if (objDs.getRowStatus(chk_RowArr1[i]) == "C") {
					removeRows.push(chk_RowArr1[i]);
				}
			}
			for (var i = 0; i < chk_RowArr2.length; i++) {
				if (objDs.getRowStatus(chk_RowArr2[i]) == "C") {
					removeRows.push(chk_RowArr2[i]);
				}
			} 

			var setRemoveRows = [];
			$.each(removeRows, function(i, el) {
				if(setRemoveRows.indexOf(el) == -1) {
					setRemoveRows.push(el);	
				} 
			});

			if (setRemoveRows.length > 0) {
				objDs.removeRows(setRemoveRows);
			}
		}
	} catch(e) {
		ngmf._error("[ngmf.delRow] Exception :: ", e);
	}
};

/**
 * ngmf.copyRow Grid Row Copy (공통).
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Obejct} objDs :: I :: N ::   :: dataList Component
 * @param {String} chkCol       :: I :: N ::   :: 체크컬럼
 * @param {String} falseValue   :: I :: Y :: 0 :: "0" 이외의 그리드 checkbox trueValue 설정 시 값(option)
 * @sampleLink grd_resultSearch
 * @author 이동규
 * @update 이동규 2016.09.12 데이터가 필터가 걸려 있을 경우를 고려하여 getRowCount() 필터가 정렬되어 있는 부분을 
 *         데이터 뿐만아니라 전체 데이터의 경우를 고려하도록 수정합니다.
 * @useMobile use
 * @sync true
 * @example ngmf.copyRow(objDs, chk_col, falseValue);
 * @exampleAsIs ngmf_CopyRow(objDs, chk_col);
 */
ngmf.copyRow = function(dataListID, chkCol, falseValue) {
	try {
		var objDs = ngmf.object(dataListID);

		if (typeof objDs == "undefined" && typeof objDs.getColumnIndex(chkCol) == "undefined") return;

		if (objDs.getRowCount() == 0) {
			ngmf.alert("처리할 데이타가 없습니다.");
			return;
		}
		
		if (typeof falseValue == "undefined" || ngmf.isNull(falseValue) == "Y")
			falseValue = "0";

		var len = objDs.getRowCount();
		var insertArr = [];
		var insertDataObj = [];
		for (var i = 0; i < len; i++) {
			var rowIdx = objDs.getRealRowIndex(i);
			if (objDs.getCellData(rowIdx, chkCol) == true) {
				insertArr.push(rowIdx);
				insertDataObj.push(objDs.getRowJSON(rowIdx));
				//objDs.insertRow(i + 1);
				//objDs.setRowJSON(i + 1, objDs.getRowJSON(i), true);
				//objDs.setCellData(i + 1, chkCol, falseValue);
			}
		}
		var count = 0;
		for (var j = 0 ; j < insertArr.length ; j++) {
			var idx = insertArr[j];
			var dataObj = insertDataObj[j];
			var rowIdex = objDs.insertRow(idx + 1 + count);
			objDs.setRowJSON(rowIdex, dataObj, true);
			objDs.setCellData(rowIdex, chkCol, falseValue);
			count++;

		}
	} catch(e) {
		ngmf._error("[ngmf.copyRow] Exception :: ", e);
	}
};

/**
 * Grid Row Update 시 자동 체크 및 체크 지웠을경우 변경내용 원복 (공통 ).
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Obejct} grdID       :: I :: N ::   :: gridView Component
 * @param {String/Object} dataListID  :: I :: N ::   :: dataList Component
 * @param {Number} nRow               :: I :: N ::   :: dataList RowPosition
 * @param {String/Obejct} strColumnID :: I :: N ::   :: dataList 변경 컬럼
 * @param {String} varOldValue        :: I :: N ::   :: 변경 전 값 (Number, String, Boolean 가능)
 * @param {String} varNewValue        :: I :: N ::   :: 변경 후 값 (Number, String, Boolean 가능)
 * @param {String} chkCol             :: I :: N ::   :: 체크컬럼
 * @param {String} trueValue          :: I :: Y :: 1 :: "1" 이외의 그리드 checkbox trueValue 설정 시 값(option)
 * @param {String} falseValue         :: I :: Y :: 0 :: "0" 이외의 그리드 checkbox trueValue 설정 시 값(option)
 * @sampleLink grd_crud
 * @author 이동규
 * @useMobile use
 * @update 2016.05.13 이동규 그리드 추가행의 Background표준 수정(#9abffa->#ffe9c4).
 * @sync true
 * @example ngmf.updateCheckGrid(grdID, DatasetId, nRow, strColumnID, varOldValue, varNewValue, chk_col);
 * @exampleAsIs ngmf_UpdateCheckGrid(DatasetId,nRow,strColumnID,varOldValue,varNewValue,chk_col);
 */
ngmf.updateCheckGrid = function(grdID, dataListID, nRow, strColumnID, varOldValue, varNewValue, chkCol, trueValue, falseValue) {
	try {
		var objDs = ngmf.object(dataListID);
		var grdID = ngmf.object(grdID); 
		var flag = "";

		if (typeof grdID == "undefined" || typeof objDs == "undefined") {
			flag = false;
		} else {
			flag = true;
//			return;
		}

		if (typeof trueValue == "undefined" || ngmf.isNull(trueValue) == "Y")
			trueValue = "1";
		if (typeof falseValue == "undefined" || ngmf.isNull(falseValue) == "Y")
			falseValue = "0";


		if (objDs.getColumnID(strColumnID) == chkCol) {
			if (((varNewValue == null) || (varNewValue == "") || varNewValue == falseValue)) {
				if (objDs.getRowStatus(nRow) == "U") {
					objDs.undoRow(nRow);
					if (nRow % 2 == 0) {
						if(flag) grdID.setRowBackgroundColor(nRow, "#ffffff");
					} else {
						if(flag) grdID.setRowBackgroundColor(nRow, "#f5f5f5");
					}
				}
			}
			return;
		}

		if (objDs.getRowStatus(nRow) == "U" || objDs.getRowStatus(nRow) == "C") {
			if (((objDs.getCellData(nRow, chkCol) == null)
					|| (objDs.getCellData(nRow, chkCol) == "") 
					|| objDs.getCellData(nRow, chkCol) == falseValue)) {

				objDs.setCellData(nRow, chkCol, trueValue);
			}
		}
		if(flag) grdID.setRowBackgroundColor(nRow, "#ffe9c4");
	} catch(e) {
		ngmf._error("[ngmf.copyRow] Exception :: ", e);
	}
};

/**
 * 그리드 입력 및 수정 후 저장 처리를 정상적으로 수행 한 이후 UnCheck (공통).
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Object} objDs :: I :: N ::   :: dataList Component
 * @param {String} chkCol       :: I :: N ::   :: 체크컬럼
 * @param {String} trueValue    :: I :: Y :: 1 :: "1" 이외의 그리드 checkbox trueValue 설정 시 값(option)
 * @param {String} falseValue   :: I :: Y :: 0 :: "0" 이외의 그리드 checkbox trueValue 설정 시 값(option)
 * @sampleLink ngmf.setUnCheckGrid
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.setUnCheckGrid(DataSetId, chkcolumn, trueValue, falseValue);
 * @exampleAsIs ngmf_SetUnCheckGrid(DataSetId,chkcolumn);
 */
ngmf.setUnCheckGrid = function(dataListID, chkCol, trueValue, falseValue) {
	try {
		// TODO :: Miplatform UpdateControl 대신 reform 메소드를 두번 호출하는것으로 대체하였음.
		// objDs.UpdateControl = false;
		var objDs = ngmf.object(dataListID);

		if (typeof objDs == "undefined" && typeof objDs.getColumnIndex(chkCol) == "undefined") return;

		if (typeof trueValue == "undefined" || ngmf.isNull(trueValue) == "Y")
			trueValue = "1";
		if (typeof falseValue == "undefined" || ngmf.isNull(falseValue) == "Y")
			falseValue = "0";

		objDs.reform();

		objDs.setEventPause("oncelldatachange", true);
		for ( var i = 0; i < objDs.getRowCount(); i++) {
			if (objDs.getCellData(i, chkCol) == trueValue) {
				objDs.setCellData(i, chkCol, falseValue);
			}
		}
		objDs.setEventPause("oncelldatachange", false);

		// objDs.UpdateControl = true;
	} catch(e) {
		ngmf._error("[ngmf.setUnCheckGrid] Exception :: ", e);
	}
};

/**
 * 그리드에서 체크 된 로우에 대해 삭제 처리를 정상적으로 수행 한 이후 DataSet삭제
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Object} objDs :: I :: N ::   :: dataList Component
 * @param {String} chkCol       :: I :: N ::   :: 체크컬럼
 * @param {String} trueValue    :: I :: Y :: 1 :: 체크컬럼 trueValue
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.setDelCheckGrid(dataListID, chkCol, trueValue)
 * @exampleAsIs ngmf_SetDelCheckGrid(DataSetId,chkcolumn);
 */
ngmf.setDelCheckGrid = function(dataListID, chkCol, trueValue) {
	// TODO :: UpdateControl
	// objDs.UpdateControl = false;
	try {
		var objDs = ngmf.object(dataListID);

		if (typeof objDs == "undefined" && typeof objDs.getColumnIndex(chkCol) == "undefined") return;

		if (typeof trueValue == "undefined" || ngmf.isNull(trueValue) == "Y")
			trueValue = "1";

		for ( var i = objDs.getRowCount() - 1; i >= 0; i--) {
			if (objDs.getCellData(i, chkCol) == trueValue) {
				objDs.removeRow(i);
			}
		}

		// objDs.UpdateControl = true;
	} catch(e) {
		ngmf._error("[ngmf.setDelCheckGrid] Exception :: ", e);
	}
};

/**
 * 그리드 결과 검색 팝업.
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Obejct} gridID :: I :: N ::    :: 결과 검색 그리드 ID
 * @param {String} strTxt        :: I :: Y :: "" :: Grid Head Text  
 * @param {String} strCol        :: I :: Y :: "" :: Grid Column ID
 * @param {String} strTyp        :: I :: Y :: "" :: Grid Cell Type
 * @param {String} strGbn        :: I :: Y :: "" :: Find 조건 항목("R" : Replace)
 * @param {Object} option        :: I :: Y ::    :: 검색 추가 기능.
 *        {Object} option.blankSearch  :: I :: Y :: false :: 검색 추가 기능으로 빈값을 검색문자 "%" 허용 여부.[default:false (허용하지 않음)]
 *        {Object} option.enterKey     :: I :: Y :: false :: 검색 추가 기능으로 검색데이터 입력후 enter키 입력시 검색 여부. [default:false (허용하지않음)]
 * @author 이동규
 * @useMobile use
 * @sampleLink grd_resultSearch
 * @sync true
 * @example ngmf.resultSearch(objGrd_find, strTxt, strCol, strTyp, strGbn);
 * @exampleAsIs ngmf_resultSearch(objGrd_find, strTxt, strCol, strTyp, strGbn, option);
 */
ngmf.resultSearch = function(gridID, strTxt, strCol, strTyp, strGbn, option) {
	try {
		var objGrd_find = ngmf.object(gridID);

		if (typeof objGrd_find == "undefined") return;

		if (objGrd_find.getPluginName() != "gridView") {
			ngmf.alert('Grid Object가 아닙니다.');
			return;
		}

		if (ngmf.isNull(strCol) == "N") {
			if (strTxt.split(",").length != strCol.split(",").length) {
				ngmf.alert("Head Text와 Column정보가 일치하지 않습니다.!");
				return;
			}
		}

		if (ngmf.isNull(strTyp) == "N") {
			if (strTyp.split(",").length != strCol.split(",").length) {
				ngmf.alert("Column정보와 Cell Type정보가 일치하지 않습니다.!");
				return;
			}
		}

		if (ngmf.isNull(strGbn) == "N") {
			strGbn = "N";
		} else {
			if (strGbn != "R")
				strGbn = "N";
		}
		var options = {};
		if (typeof option != "undefined") {
			options.blankSearch = typeof option.blankSearch != "undefined" ? WebSquare.util.getBoolean(option.blankSearch) : false;
			options.enterKey = typeof option.enterKey != "undefined" ? WebSquare.util.getBoolean(option.enterKey) : false;
		} else {
			options.blankSearch = false;
			options.enterKey = false;
		}

		var paramData = {
			strGrd 		: objGrd_find.getID(),
			strTxt 		: strTxt,
			strCol 		: strCol,
			strTyp 		: strTyp,
			strGbn 		: strGbn,
			blankSearch : options.blankSearch,
			enterKey    : options.enterKey
		};

		var height = 120;

		if (objGrd_find.cellIdList.length > 2) {
			var popupHeight = (objGrd_find.cellIdList.length-2 > 5) ? 5 : objGrd_find.cellIdList.length-2;
			height += (15*popupHeight);
		}
		ngmf.__dialog("AAT", "ZNGMSMAN00120", paramData, 603, height, "", "", "","scwin.resultSearchCallBack");
	} catch(e) {
		ngmf._error("[ngmf.resultSearch] Exception :: ", e);
	}
};

/**
 * 재조회 요건인 경우 저장 후 조회전 처리사항(Row Position을 이전으로 처리키 위함) (공통 ).
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Object} objGrd :: I :: N ::   :: GridView Component
 * @sampleLink scm_svcCallAutoSearch
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.beforeReFind(obj)
 * @exampleAsIs ngmf_BeforeReFind(obj)
 */
ngmf.beforeReFind = function(gridID) {
	try {
		var objGrd = ngmf.object(gridID);
		if (typeof objGrd == "undefined") return;
		
		var nCurRow = objGrd.getFocusedRowIndex();
		ngmv.gridReFindProc = nCurRow;
	} catch(e) {
		ngmf._error("[ngmf.resultSearch] Exception :: ", e);
	}
};

/**
 * 재조회 요건인 경우 저장 후 조회전 처리사항(Row Position을 이전으로 처리키 위함) (공통).
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Object} objDs :: I :: N ::                     :: dataList Component
 * @param {Number} nRow         :: I :: Y :: ngmv.gridReFindProc :: dataList RowPosition
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.afterReFind(obj, nRow);
 * @exampleAsIs ngmf_AfterReFind(obj,nRow);
 */
ngmf.afterReFind = function(gridID, nRow) {
	try {
		var nGridReFindProc;
		var objGrd = ngmf.object(gridID);

		if (typeof objGrd == "undefined") return;

		if (typeof nRow == "number") {
			nRow = nRow + "";
		}

		if (typeof nRow == "undefined" || nRow == null || nRow == "" || nRow.length == 0) {
			nGridReFindProc = ngmv.gridReFindProc;
		} else {
			nGridReFindProc = nRow;
		}

		nPageRow = nGridReFindProc + objGrd.getTotalRow();

		objGrd.setFocusedCell(nGridReFindProc, 1);
	} catch(e) {
		ngmf._error("[ngmf.afterReFind] Exception :: ", e);
	}
};

/**
 * Grid Insert Row중 Check되지 않은 항목은 Delete한다
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {String/Object} objDs :: I :: N :: :: dataList Component
 * @param {String} chkCol       :: I :: N :: :: 체크컬럼
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.deleteUnCheckInsert(DatasetId, chk_col);
 * @exampleAsIs ngmf_DeleteUnCheckInsert(DatasetId,chk_col);
 */
ngmf.deleteUnCheckInsert = function(dataListID, chkCol) {
	try {
		var objDs = ngmf.object(dataListID);

		if (typeof objDs == "undefined" && typeof objDs.getColumnIndex(chkCol) == "undefined") return;

		for ( var i = objDs.getRowCount() - 1; i >= 0; i--) {
			if ((objDs.getRowStatus(i) == "C")
					&& (objDs.getCellData(i, chkCol) == 0)) {
				objDs.removeRow(i);
			}
		}
	} catch(e) {
		ngmf._error("[ngmf.deleteUnCheckInsert] Exception :: ", e);
	}
};

/**
 * ngmf.commonFind(삭제검토)
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {Object} comData    :: I :: N :: :: comData 
 * @param {String} searchData :: I :: N :: :: searchData
 * @author 이동규
 * @useMobile delete
 * @sync true
 * @example 오류 함수 입니다. 사용하지마세요.
 */
ngmf.commonFind = function(comData, searchData) {
	try {
		ngmf.alert('잘못작성된 공통함수입니다. 삭제 예정일 : 2016.01.20\n 수정형식 : ngmf.syncCall(trxCode, scvar.ScreenName, "", inDataList, outDataList, callBackFuncName); \n PG-0603_0604_0605_0606.xml');
		//return ;

		ngmf.clear(comData.inDataList);
		var dataListId = ngmf.object(comData.inDataList);
		for (i in searchData) {
			dataListId.insertColumn(searchData[i].key);
		}
		var RowIndex = dataListId.insertRow(dataListId.getRowCount());
		for (i in searchData) {
			dataListId.setCellData(RowIndex, searchData[i].key, searchData[i].value);
		}

		if (typeof comData.udcName !== "undefined") {
			ngmf.object(comData.udcName.id).asyncCall(comData.trxCode, comData.screenName, "",comData.inDataList, comData.outDataList, comData.callBackFuncName);
		}
	} catch(e) {
		ngmf._error("[ngmf.commonFind] Exception :: ", e);
	}
};

/**
 * ngmf.commonSave(삭제검토)
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {Object} comData    :: I :: N :: :: comData 
 * @author 이동규
 * @useMobile delete
 * @sync true
 * @example 오류 함수 입니다. 사용하지마세요.
 */
ngmf.commonSave = function(comData) {
	try {
		ngmf.alert('잘못작성된 공통함수입니다. 삭제 예정일 : 2016.01.20\n 수정형식 : ngmf.asyncCall(TrxCode,scvar.ScreenName, "", InDataList, OutDataList, callBackFuncName); \n PG-0603_0604_0605_0606.xml');


		if (comData.inDataList !== "") {
			var inDataListArr = comData.inDataList.split(",");
			for (var i = 0; i < inDataListArr.length; i++) {
				var dataListId = ngmf.object(inDataListArr[i].replace(":U", "").trim());
				if (typeof dataListId != "undefined") {
					ngmf.insertColumn(dataListId, "flag", {
						name : "flag",
						dataType : "text"
					});

					for ( var j = 0; j < dataListId.getRowCount(); j++) {
						if (dataListId.getRowStatus(j) == "C") {
							dataListId.setCellData(j, "flag", "I");
						} else if (dataListId.getRowStatus(j) == "U") {
							dataListId.setCellData(j, "flag", "U");
						}
					}
				} else {
					ngmf._error("commSave : inputDataList 가 존재 하지 않습니다.");
				}
			}
		}
		
		var promise = ngmf.promise.asyncCall(comData.trxCode, comData.screenName, "", comData.inDataList, comData.outDataList);
		promise.then(function(rtnObj) {
	        var svcId = rtnObj.svcId;
	        var errorCode = rtnObj.errorCode;
	        var errorMsg = rtnObj.errorMsg;
	        eval(comData.callBackFuncName(svcId, errorCode, errorMsg));
	    });
	} catch(e) {
		ngmf._error("[ngmf.commonSave] Exception :: ", e);
	}
};

/**
 * ngmf.confirmCommonDelete(삭제검토)
 * @date 2015.10.16.
 * @memberOf ngmf
 * @param {Object} comData    :: I :: N :: :: comData 
 * @author 이동규
 * @useMobile delete
 * @sync true
 * @example 오류 함수 입니다. 사용하지마세요.
 */
ngmf.confirmCommonDelete = function(comData) {
	try {
		ngmf.alert('잘못작성된 공통함수입니다. 삭제 예정일 : 2016.01.20\n 수정형식 : ngmf.syncCall(trxCode, scvar.ScreenName, "", inDataList, outDataList, callBackFuncName); \n PG-0603_0604_0605_0606.xml');
		//return ;

		var delDataList = ngmf.object(comData.inDataList);
		var baseDataList = ngmf.object(comData.baseDataList);
		ngmf.clear(delDataList);

		ngmf.insertColumn(delDataList, comData.TargetColumn, {
			name : comData.TargetColumn,
			dataType : "text"
		});

		ngmf.insertColumn(delDataList, "flag", {
			name : comData.TargetColumn,
			dataType : "text"
		});

		for ( var i = 0; i < baseDataList.getRowCount(); i++) {
			if (baseDataList.getCellData(i, comData.CheckColumn) == "1") {
				var rnt = delDataList.insertRow(delDataList.getRowCount());
				delDataList.setCellData(rnt, comData.TargetColumn, baseDataList
						.getCellData(i, comData.TargetColumn));
				delDataList.setCellData(rnt, "flag", "D");
			}
		}

		var promise = ngmf.promise.asyncCall(comData.trxCode, comData.screenName, "", comData.inDataList, comData.outDataList);
		promise.then(function(rtnObj) {
        	var svcId = rtnObj.svcId;
	        var errorCode = rtnObj.errorCode;
	        var errorMsg = rtnObj.errorMsg;
	        eval(comData.callBackFuncName(svcId, errorCode, errorMsg));
	    });
	} catch(e) {
		ngmf._error("[ngmf.confirmCommonDelete] Exception :: ", e);
	}
};

/**
 * grid에 행을 추가하는 API(추가된 행의 배경색자동 설정됩니다. RGB : #ffe9c4)
 * @date 2015.11.23
 * @memberOf ngmf
 * @param {String/Object} dataListId :: I :: N :: :: 데이터 리스트 아이디
 * @param {String/Object} grdId      :: I :: N :: :: 그리드뷰 아이디
 * @return {Number} 추가된 데이터의 rowIndex 값. (행추가 실패시 return -1)
 * @sampleLink grd_crud
 * @author 이정규
 * @useMobile use
 * @update 2016.05.13 이동규 그리드 추가행의 Background표준 수정(#9abffa->#ffe9c4).
 * @sync true
 * @example ngmf.insertRow(dataId, grdId);
 * @exampleAsIs 신규함수.
 */	
ngmf.insertRow = function(dataListId, grdId) {
	try {
		var dataListId = ngmf.object(dataListId);
		var grdId = ngmf.object(grdId);

	  	if (typeof dataListId !== "undefined") {
			var rIndex = dataListId.insertRow();
			if (typeof grdId != "undefined") {
				grdId.setRowBackgroundColor(rIndex, "#ffe9c4");	
			}
			return rIndex;
	  	} else {
	  		return -1;
	  	}
	} catch(e) {
		ngmf._error("[ngmf.insertRow] Exception :: ", e);
	}
};


/**
 * ngmf.deleteRow 추가한 신규행을 삭제하는 API
 * @date 2015.11.23
 * @memberOf ngmf
 * @param {String/Object} dataId :: I :: N ::       :: 데이터 리스트 아이디
 * @param {Array} chkArr         :: I :: N ::       :: 그리드의 체크된 row Index array
 * @param {Boolean} returnType   :: I :: Y :: false :: 반환값 설정 [default :false]
 * @return {Number/Object} delete 설정 반환 값. [false : 삭제 성공시 0, 실패시 -1 반환, true : 성공시 삭제된 row행들의 배열값, 실패시 -1]
 * @sampleLink grd_crud
 * @author 이정규
 * @useMobile use
 * @sync true
 * @example ngmf.deleteRow(dataId, chkArr, returnType);
 * @exampleAsIs 신규함수.
 */
ngmf.deleteRow = function(dataId, chkArr, returnType) {
  	try {
	  	var deleteRowArr = new Array();
	  	var returnType = (typeof returnType !== "undefined") ? WebSquare.util.getBoolean(returnType) : false;

		var dataId = ngmf.object(dataId);

	  	if (typeof dataId !== "undefined") {
			if (chkArr.length == 0) {
				ngmf.alert("삭제할 행을 선택해주세요");
				return -1;
			}
			for ( var i = 0 ;i < chkArr.length; i++) {
				if (dataId.getRowStatus(chkArr[i]) != "C") {
					ngmf.alert("신규로 추가한 행만 삭제할 수 있습니다.");
					return -1;
				}
			}

			dataId.removeRows(chkArr);
			for ( var i = 0 ;i < chkArr.length; i++) {
				deleteRowArr.push(chkArr[i]);
			}

			if (returnType) {
				return deleteRowArr;
			} else {
				return 0;
			}

	  	} else {
	  		return -1;
	  	}
  	} catch(e) {
		ngmf._error("[ngmf.deleteRow] Exception :: ", e);
  	}
 };

/**
 * 데이터를 yyyy-MM-dd로 리턴한다.
 * @date 2015.12.07
 * @memberOf ngmf
 * @param {String} str :: I :: N ::   :: 넘겨질 데이터
 * @return {String} yyyy-MM-dd데이터(6자리인경우에만 yyyy-MM을 리턴)
 * @sampleLink grd_drilldown
 * @author 윤여산
 * @useMobile use
 * @sync true
 * @example ngmf.rtnCalendarDate(val);
 * @exampleAsIs 신규함수.
 */
ngmf.rtnCalendarDate = function(str) {
	try {
		str = str.replace(/[ ]|[-]|[:]|[;]/ig, "");
		var regTxt = /[^0-9]/g;
		var regDate = "";
		var dateForm = "";

		if (str == "" || str == null)
			return "";

		if (str.length < 4)
			return str;

		if (str.length === 6) {
			dateForm = "$1-$2";
			regTxt = /([0-9]{4})([0-9]+)/;
		} else if (str.length === 8) {
			dateForm = "$1-$2-$3";
			regTxt = /([0-9]{4})([0-9]{2})([0-9]+)/;
		} else if (str.length === 10) {
			dateForm = "$1-$2-$3 $4";
			regTxt = /([0-9]{4})([0-9]{2})([0-9]{2})([0-9]+)/;
		} else if (str.length === 12) {
			dateForm = "$1-$2-$3 $4:$5";
			regTxt = /([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]+)/;
		} else if (str.length === 14) {
			dateForm = "$1-$2-$3 $4:$5:$6";
			regTxt = /([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]+)/;
		} else {
			ngmf.alert('데이터의 길이가 올바르지 않습니다.');
		}

		return str.replace(regTxt, dateForm);
	} catch(e) {
		ngmf._error("[ngmf.rtnCalendarDate] Exception :: ", e);
	}
};

/**
 * Grid에서 Drilldown 기능 사용 시 현재 선택된 Row의 부모 Row Index를 반환한다.
 * @date 2015.12.08
 * @memberOf ngmf
 * @param {String/Object} grdID   :: I :: N :: :: Grid의 ID
 * @param {Number} selectedRowIdx :: I :: N :: :: Grid에서 현재 선택된 Row의 Index
 * @return {Number} 현재 선택된 Row의 부모 Row Index
 * @author 박상규
 * @useMobile use
 * @sync true
 * @example var selectedRowIdx = dlt_menu.getRealRowIndex(grd_menu.getFocusedRowIndex());
 * @example var parentRow = ngmf.getParentRowIndex("grd_menu", selectedRowIdx);
 * @exampleAsIs 신규함수.
 */
ngmf.getParentRowIndex = function(grdID, selectedRowIdx) {
	try {
		var grdObj = ngmf.object(grdID);
		if (typeof grdObj == "undefined") return;

		return grdObj.getParentRowIndex(selectedRowIdx);
	} catch(e) {
		ngmf._error("[ngmf.getParentRowIndex] Exception :: ", e);
	}
};

/**
 * 그리드의 체크컬럼에 선택된 데이터들을 반환해줍니다.
 * @date 2016.01.14.
 * @memberOf ngmf
 * @param {String/Obejct} grdID  :: I :: N ::      :: 그리드 ID
 * @param {String} chkCol        :: I :: N ::      :: 체크컬럼의 컬럼ID 값
 * @param {String} type          :: I :: Y :: json :: 반환 데이터 형식 (JSON, DATA, INDEX, XML)[default : json ]
 * @sampleLink grd_crud
 * @return {String/Object} 반환 데이터형식에 맞는 체크 컬럼의 데이터 값.
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.getCheckData("dsl_dataList1", "chk" ,"json");
 * @exampleAsIs 신규함수.
 */
ngmf.getCheckData = function (grdID, chkCol, type) {
 	try {
 		if (typeof grdID != "undefined" && typeof ngmf.object(grdID) != "undefined") {
 			var comp = ngmf.object(grdID);
 			var type = (typeof type !== "undefined") ? type : "json";
 			var resultData = "";
 			if (comp.options.pluginName === "gridView" && comp.getCellInfo(chkCol).options.inputType == "checkbox") {
 				switch(ngmf.toUpper(type)) {
 					case "JSON":
 						resultData = comp.getCheckedJSON(chkCol);
 						break; 
 					case "DATA":
 						resultData = comp.getCheckedData(chkCol);
 						break;
 					case "INDEX":
 						resultData = comp.getCheckedIndex(chkCol);
 						break;
 					case "XML": 
 						resultData = comp.getCheckedXML(chkCol);
 						break;
 					
 				}
 			}
 			return resultData;
 		} else { 
 			ngmf.alert("그리드 ID가 잘못 되었습니다.");
 		}
 	} catch (e) {
 		ngmf._error("[ngmf.getCheckData] Exception :: ", e);
 	}
};

/**
 * Grid Merge, Double Head Check (공통)
 * @date 2016.01.14.
 * @memberOf ngmf
 * @param {String/Object} Grid  :: I :: N :: :: Component
 * @param {Number} nCell        :: I :: N :: :: cellIndex
 * @return 헤더 유무 [true / false]
 * @author 이진수
 * @useMobile use
 * @sync true
 * @example ngmf.getValidHead(obj, nCell);
 * @exampleAsIs ngmf_GetValidHead(obj, nCell);
 */
ngmf.getValidHead = function(objgrd, nCell) {
	try {
		var objgrd      = ngmf.object(objgrd);
		
		if (typeof objgrd == "undefined") return;

		var rtn_val 	= true;
		var headTable 	= objgrd.head_table.getElementsByTagName("th");
		var trTag 		= objgrd.head_table.getElementsByTagName("tr");
		var col_cnt 	= headTable.length;
		
		if (col_cnt <= nCell) {
			ngmf.alert("Column Index가  존재하지 않습니다.!");
			rtn_val = false;
		}else{
			var thTag 	= headTable[nCell];
			var colspan = thTag.getAttribute("colspan");
			
			if(trTag.length > 1){
				ngmf.alert("Head Row가 Single이 아닙니다.!");
					rtn_val = false;
			}
			
			if(colspan != null && Number(colspan) > 1){
				ngmf.alert("Merge된 Column 입니다.");
				rtn_val = false;
			}	
		}

		return rtn_val;
	} catch(e) {
 		ngmf._error("[ngmf.getValidHead] Exception :: ", e);
	}
};

/**
 * Grid Delete Column (공통)
 * @date 2016.01.26.
 * @memberOf ngmf
 * @param {String/Obejct} grd_obj :: I :: N :: :: Grid Component ID
 * @param {String} nCell          :: I :: N :: :: columnIndex (Click Head index)
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.setColumnDel(obj, nCell);
 * @exampleAsIs ngmf_SetColumnDel(obj, nCell);
 */
ngmf.setColumnDel = function(grd_obj, nCell) {
	try {
		var grd_obj = ngmf.object(grd_obj);
		if( typeof grd_obj == "undefined") return;

		if (!ngmf.getValidHead(grd_obj, nCell)) return;
		
		var xmlDoc = WebSquare.xml.parse(grd_obj.getGridStyle(), true);
		var gridDoc = xmlDoc.childNodes[0];
		var headerDoc = WebSquare.xml.findNode(gridDoc, "w2:header");
		if (headerDoc.children.length > 0) {
			for (var i = 0; i < headerDoc.children.length; i++) {
				var headerRowDoc = headerDoc.children[i];
				if (headerRowDoc.children.length > 0) {
					headerRowDoc.removeChild(headerRowDoc.children[nCell]);
				}
			}
		}

		var bodyDoc = WebSquare.xml.findNode(gridDoc, "w2:gBody");
		if (bodyDoc.children.length > 0) {
			for (var i = 0; i < bodyDoc.children.length; i++) {
				var bodyRowDoc = bodyDoc.children[i];
				if (bodyRowDoc.children.length > 0) {
					bodyRowDoc.removeChild(bodyRowDoc.children[nCell]);
				}
			}
		}
		
		grd_obj.setGridStyle(xmlDoc);

	} catch(e) {
		ngmf._error("[ngmf.setColumnDel] Exception :: ", e);
	}
};

/**
 * Grid Insert Column (공통)
 * @date 2016.01.26.
 * @memberOf ngmf
 * @param {String/Object} grd_obj :: I :: N ::    :: Grid Component ID
 * @param {String} nCell          :: I :: N ::    :: Insert Column Head Index
 * @param {String} hText          :: I :: Y :: "" :: Insert Column Head Text
 * @param {String} ColId          :: I :: N ::    :: Insert Column Head ColId
 * @param {String} gWidth         :: I :: Y :: "" :: Insert Column Head Width
 * @param {String} gDisplay       :: I :: Y :: "" :: Insert Column Body Display type
 * @param {String} gAlign         :: I :: Y :: "" :: Insert Column Body Align
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.setColumnIns(obj, nCell, hText, ColId, gWidth, gDisplay, gAlign)
 * @exampleAsIs ngmf_SetColumnIns(obj,nCell, hText, ColId, gWidth, gDisplay, gAlign)
 */
ngmf.setColumnIns = function(grd_obj, nCell, hText, ColId, gWidth, gDisplay, gAlign) {	
	try {
		var grd_obj = ngmf.object(grd_obj);
		if( typeof grd_obj == "undefined") return;

		if (!ngmf.getValidHead(grd_obj, nCell)) return;
		if (ngmf.isNull(grd_obj.getColumnIndex(ColId)) == "N") return;
		var xmlDoc = WebSquare.xml.parse(grd_obj.getGridStyle(), true);
		var gridDoc = xmlDoc.childNodes[0];
		var headerDoc = WebSquare.xml.findNode(gridDoc, "w2:header");
		var bodyDoc = WebSquare.xml.findNode(gridDoc, "w2:gBody");

		if (headerDoc.children.length > 0) {
			for (var i = 0; i < headerDoc.children.length; i++) {
				var headerRowDoc = headerDoc.children[i];
				if (headerRowDoc.children.length > 0) {
					var createHeaderCol = document.createElement("w2:column");
					createHeaderCol.setAttribute("blockSelect", false);
					createHeaderCol.setAttribute("displayMode", "label");
					createHeaderCol.setAttribute("inputType", "text");
					createHeaderCol.setAttribute("style", "height:20px;");
					if (ngmf.isNull(hText) != "Y") {
						createHeaderCol.setAttribute("value", hText);
					}
					if (ngmf.isNull(ColId) != "Y") {
						createHeaderCol.setAttribute("id", "Header_"+ColId);
					}
					if (ngmf.isNull(gWidth) != "Y") {
						createHeaderCol.setAttribute("width", gWidth);
					}

					for (var j = 0; j < headerRowDoc.children.length; j++) {
						if ( j == nCell) {
							headerRowDoc.insertBefore( createHeaderCol, headerRowDoc.children[j]);
						}
					}
				}
			}
		}
		
		if (bodyDoc.children.length > 0) {
			for (var i = 0; i < bodyDoc.children.length; i++) {
				var bodyRowDoc = bodyDoc.children[i];
				if (bodyRowDoc.children.length > 0) {
					var creategBodyCol = document.createElement("w2:column");
					creategBodyCol.setAttribute("blockSelect", false);
					creategBodyCol.setAttribute("displayMode", "label");
					creategBodyCol.setAttribute("inputType", "text");
					creategBodyCol.setAttribute("style", "height:20px;");
					if (ngmf.isNull(ColId) != "Y") {
						creategBodyCol.setAttribute("col_id", ColId);
						creategBodyCol.setAttribute("id", grd_obj.i + "_"+ColId);
					}
					if (ngmf.isNull(gWidth) != "Y") {
						createHeaderCol.setAttribute("width", gWidth);
					}
					for (var j = 0; j < bodyRowDoc.children.length; j++) {
						if ( j == nCell) {
							bodyRowDoc.insertBefore( creategBodyCol, bodyRowDoc.children[j]);
						}
					}
				}
			}
		}
		//동적 documents.node 생성시 websquare엔진 에서 인식 불가.
		var xmlStr = WebSquare.xml.serialize(xmlDoc);
		xmlStr = xmlStr.replaceAll("xmlns=\"http://www.w3.org/1999/xhtml\"", "");
		grd_obj.setGridStyle(WebSquare.xml.parse(xmlStr));
	} catch(e) {
		ngmf._error("[ngmf.setColumnIns] Exception :: ", e);
	}
};

/**
 * Grid Add Column (공통)
 * @date 2016.01.27.
 * @memberOf ngmf
 * @param {String/Obejct} grd_obj  :: I :: N :: :: Grid Component ID
 * @param {String} hText           :: I :: Y :: :: Insert Column Head Text
 * @param {String} ColId           :: I :: N :: :: Insert Column Head ColId
 * @param {String} gWidth          :: I :: Y :: :: Insert Column Head Width
 * @param {String} gDisplay        :: I :: Y :: :: Insert Column Head gDisplay
 * @param {String} gAlign          :: I :: Y :: :: Insert Column Head gAlign
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.ngmf.setColumnAdd(grd_obj, hText, ColId, gWidth);
 * @exampleAsIs ngmf_SetColumnAdd(grd_obj, hText, ColId, gWidth, gDisplay, gAlign)
 */
ngmf.setColumnAdd = function(grd_obj, hText, ColId, gWidth, gDisplay, gAlign){
    try {
		var grd_obj = ngmf.object(grd_obj);
		if (ngmf.isNull(grd_obj.getColumnIndex(ColId)) == "N") return;
		var xmlDoc = WebSquare.xml.parse(grd_obj.getGridStyle(), true);
		var gridDoc = xmlDoc.childNodes[0];
		var headerDoc = WebSquare.xml.findNode(gridDoc, "w2:header");
		var bodyDoc = WebSquare.xml.findNode(gridDoc, "w2:gBody");

		if (headerDoc.children.length > 0) {
			for (var i = 0; i < headerDoc.children.length; i++) {
				var headerRowDoc = headerDoc.children[i];
				if (headerRowDoc.children.length > 0) {
					var createHeaderCol = document.createElement("w2:column");
					createHeaderCol.setAttribute("blockSelect", false);
					createHeaderCol.setAttribute("displayMode", "label");
					createHeaderCol.setAttribute("inputType", "text");
					createHeaderCol.setAttribute("style", "height:20px;");
					if (ngmf.isNull(hText) != "Y") {
						createHeaderCol.setAttribute("value", hText);
					}
					if (ngmf.isNull(ColId) != "Y") {
						createHeaderCol.setAttribute("id", "Header_"+ColId);
					}
					if (ngmf.isNull(gWidth) != "Y") {
						createHeaderCol.setAttribute("width", gWidth);
					}
					
					headerRowDoc.appendChild(createHeaderCol);
				}
			}
		}
		
		if (bodyDoc.children.length > 0) {
			for (var i = 0; i < bodyDoc.children.length; i++) {
				var bodyRowDoc = bodyDoc.children[i];
				if (bodyRowDoc.children.length > 0) {
					var creategBodyCol = document.createElement("w2:column");
					creategBodyCol.setAttribute("blockSelect", false);
					creategBodyCol.setAttribute("displayMode", "label");
					creategBodyCol.setAttribute("inputType", "text");
					creategBodyCol.setAttribute("style", "height:20px;");
					//creategBodyCol.setAttribute("xmlns" ,"");
					if (ngmf.isNull(ColId) != "Y") {
						creategBodyCol.setAttribute("col_id", ColId);
						creategBodyCol.setAttribute("id", grd_obj.i + "_"+ColId);
					}
					if (ngmf.isNull(gWidth) != "Y") {
						createHeaderCol.setAttribute("width", gWidth);
					}
					
					bodyRowDoc.appendChild( creategBodyCol);	
				}
			}
		}
		//동적 documents.node 생성시 websquare엔진 에서 인식 불가.
		var xmlStr = WebSquare.xml.serialize(xmlDoc);
		xmlStr = xmlStr.replaceAll("xmlns=\"http://www.w3.org/1999/xhtml\"", "");
		grd_obj.setGridStyle(WebSquare.xml.parse(xmlStr));
	} catch(e) {
		ngmf._error("[ngmf.setColumnAdd] Exception :: ", e);
	}
};

/**
 * Grid Header Click => Sorting 처리 (공통)
 * @date 2016.01.27.
 * @memberOf ngmf
 * @param {String/Object} Gridobj :: I :: N :: ::  Grid Component ID
 * @param {String} nCell          :: I :: N :: ::  Column Index(Click Head index)
 * @author 이동규
 * @useMobile use
 * @update 2016.05.04 이동규 그리드 헤더와 데이터의 columnIndex가 다를 경우 오류 수정.
 * @sync true
 * @example ngmf.setGridSort(Gridobj, nCell);
 * @exampleAsIs ngmf_SetGridSort(Gridobj,nCell, resetCol);
 */
ngmf.setGridSort = function(Gridobj, nCell) {
	try {
		var objGrd = ngmf.object(Gridobj);
		var objBDs = ngmf.object(objGrd.getDataList());

		if (typeof objBDs != "undefined" && typeof objGrd != "undefined") {
			var sortCol = objBDs.getColumnID(nCell);
			var gridViewCol = objGrd.getColumnIndex(sortCol);
			var sortHead = objGrd.getHeaderID(gridViewCol);

			if (typeof sortCol == "undefined" || typeof sortHead == "undefined") return -1;

			if (typeof objBDs.sortStatusInfo != "undefined" && 
					ngmf.isNull(objBDs.sortStatusInfo[sortCol]) != "Y") {
				// - [오름차순 -> 내림차순 -> sort삭제] - ...
				//sortStatus [ -1 : 내림차순, 1 : 오름차순]
				ngmf.setGridShiftSort(objGrd, objBDs, nCell);
			} else {
				ngmf.gridSort(objGrd, objBDs, nCell);
			}
		}
	} catch(e) {
		ngmf._error("[ngmf.setGridSort] Exception :: ", e);
	}
};

/**
 * Grid Header Click => Sorting 처리 (setGridsort 내부함수)
 * @date 2016.01.27.
 * @memberOf 
 * @param {String/Object} Gridobj :: I :: N :: :: Grid Component ID
 * @param {String/Object} dsObj   :: I :: N :: :: dataList Component ID
 * @param {String} nCell          :: I :: N :: :: Column Index(Click Head index)
 * @author 이동규
 * @useMobile use
 * @update 2016.05.04 이동규 그리드 헤더와 데이터의 columnIndex가 다를 경우 오류 수정.
 * @example ngmf.gridSort(objGrd, objBDs, nCell);
 * @exampleAsIs ngmf_GridSort(Gridobj,Dataset,nCell);
 */
ngmf.gridSort = function(Gridobj, dsObj, nCell) {
	try {
		var objGrd = ngmf.object(Gridobj);
		var objBDs = ngmf.object(dsObj);
		var sortCol = objBDs.getColumnID(nCell);
		var gridViewCol = objGrd.getColumnIndex(sortCol);
		var sortHead = objGrd.getHeaderID(gridViewCol);
		if (typeof sortCol == "undefined" || typeof sortHead == "undefined") return -1;

		objBDs.sort(sortCol, 0);
		objGrd.setHeaderSortImage(sortHead, 1);
	} catch (e) {
		ngmf._error("[ngmf.gridSort] Exception :: ", e);
	}
};

/**
 * Grid Header Click => Sorting 처리 (setGridsort 내부함수)
 * @date 2016.01.27.
 * @memberOf 
 * @param {String/Object} Gridobj :: I :: N :: :: Grid Component ID
 * @param {String/Object} dsObj   :: I :: N :: :: dataList Component ID
 * @param {String} nCell          :: I :: N :: :: Column Index(Click Head index)
 * @author 이동규
 * @useMobile use
 * @update 2016.05.04 이동규 그리드 헤더와 데이터의 columnIndex가 다를 경우 오류 수정.
 * @example ngmf.setGridShiftSort(objGrd, objBDs, nCell);
 * @exampleAsIs ngmf_SetGridShiftSort(obj, Dataset ,nCell);
 */
ngmf.setGridShiftSort = function(Gridobj, dsObj, nCell) {
	try {
		var objGrd = ngmf.object(Gridobj);
		var objBDs = ngmf.object(dsObj);
		var sortCol = objBDs.getColumnID(nCell);
		var gridViewCol = objGrd.getColumnIndex(sortCol);
		var sortHead = objGrd.getHeaderID(gridViewCol);

		if (typeof sortCol == "undefined" || typeof sortHead == "undefined") return -1;

		var sortStatus = objBDs.sortStatusInfo[sortCol].sortOrder;
		if (sortStatus > 0) {
			objBDs.sort(sortCol, 1);
			objGrd.setHeaderSortImage(sortHead, 2);
		} else {
			objBDs.sort(sortCol, 2);
			objGrd.setHeaderSortImage(sortHead, 0);
		}
	} catch (e) {
		ngmf._error("[ngmf.setGridShiftSort] Exception :: ", e);
	}
};

/**
 * Grid Sort 기준 column 설정 반환.
 * @date 2016.01.27.
 * @memberOf ngmf
 * @param {String/Object} Gridobj :: I :: N :: :: Grid Component ID
 * @return {String} Grid의 sort된 columnID.
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.getSortColumn(objGrdgetCol);
 * @exampleAsIs ngmf_getSortColumn(objGrdgetCol);
 */
ngmf.getSortColumn = function(objGrdgetCol){
	try {
		var objGrd = ngmf.object(objGrdgetCol);
		var objBDs = ngmf.object(objGrd.getDataList());
		var rtnCol = "";

		if (typeof objBDs != "undefined" && typeof objGrd != "undefined") {
			if (typeof objBDs.sortStatusInfo != "undefined") {
				var multiSort = (ngmf.length(objBDs.sortStatusInfo) > 1) ? true : false;
				if (multiSort) {
					rtnCol = new Array();
					for (var i in objBDs.sortStatusInfo) {
						rtnCol.push(objBDs.sortStatusInfo[i].colID);
					}
				} else {
					for (var i in objBDs.sortStatusInfo) {
						rtnCol = objBDs.sortStatusInfo[i].colID;
					}
				}
			}
		}
		return rtnCol;
	} catch(e) {
		ngmf._error("[ngmf.getSortColumn] Exception :: ", e);
	}
};

/**
 * Grid Selected Head Clear All (공통)
 * @date 2016.01.27.
 * @memberOf ngmf
 * @param {String/Object} obj :: I :: N :: :: Grid Component ID
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.ngmf.setHeadClearAll(Gridobj, nCell);
 * @exampleAsIs ngmf_SetHeadClearAll(obj);
 */
ngmf.setHeadClearAll = function(obj) {	
	try {
		var objBDs = ngmf.object(ngmf.object(obj).getDataList());
		if (typeof objBDs != "undefined") {
			objBDs.removeColumnFilterAll();
			objBDs.clearSort();
			objBDs.clearFilter();
			objBDs.clearSortFilter();
		}
	} catch(e) {
		ngmf._error("[ngmf.setHeadClearAll] Exception :: ", e);
	}
};

/**
 * Grid 특정 셀의 editor 상태일 때 값을 입력합니다. 
 * (단, 해당 API는 그리드의 셀의 EDIT 상태의 Event[oncellclick, oncelldClick 등.] 에서 사용하는 API입니다.)
 * @date 2016.01.27.
 * @memberOf ngmf
 * @param {String/Object} grdObj :: I :: N :: :: Grid Component ID
 * @param {String} row           :: I :: N :: :: Grid row 값
 * @param {String} col           :: I :: N :: :: Grid col 값
 * @param {String} value         :: I :: N :: :: Grid value 값
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.setGridCellData(grdObj, row, col, value);
 * @exampleAsIs 신규함수.
 */
ngmf.setGridCellData = function (grdObj, row, col, value) {
	try {
		var grdComp = ngmf.object(grdObj);
		var inputComp = ngmf.object(grdComp.getCellInfo(col).mainGridId + grdComp.getCellInfo(col).colID);
		if (inputComp.getPluginName() == "input") {
			inputComp.setValue(value);
		}
		grdComp.setFocusedCell(row,0);
	} catch(e) {
		ngmf._error("[ngmf.setGridCellData] Exception :: ", e);
	}
};

/**
 * 수정된 데이터나 수정된 데이터중 체크된 데이터만 추출하는 API입니다.
 * A데이터 리스트에서 수정/추가된 데이터중 체크된 데이터만 B쪽으로 복사 합니다.
 * 체크컬럼이 없을경우에는 수정/추가된 모든 데이터가 옮겨집니다.
 * @date 2016.02.01.
 * @memberOf ngmf
 * @param {String/Object} objData1  :: I :: N :: :: 수정/추가된 데이터 중 체크된 데이터 를 확인하는 dataList.
 * @param {String} colChk           :: I :: N :: :: objData1의 체크 컬럼명.
 * @param {String/Object} objData2  :: I :: N :: :: 추출한 데이터를 붙여넣을 데이터 리스트.
 * @param {String} colStatus        :: I :: N :: :: 행의 상태 컬럼 ID.
 * @return {String} 행의 상태 값
 * @sampleLink grd_updatedData
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.copyUpdateChkData(objData1, colChk, objData2, colStatus);
 * @example 샘플 참조 : 7000. 자료실 및 가이드/7400.프로그램/0000.기술지원/05.샘플파일/grid_update.xml
 * @exampleAsIs 신규함수.
 */
ngmf.copyUpdateChkData = function(objData1, colChk, objData2, colStatus) {
	var jsonArray = [];
	try{
	    objData1 = ngmf.object(objData1);
	    objData2 = ngmf.object(objData2);
	    colChk = colChk||"";
	    colStatus = colStatus||"";
    
    	if(colChk.length>0){
    		jsonArray = objData1.getMatchedJSON(colChk,"1").concat(objData1.getMatchedJSON(colChk, 1));//배열 합치기
    	}else{
    	 	jsonArray = objData1.getModifiedJSON();//체크박스 없을시 수정데이터
    	}
    
    	if(colStatus.length<=0) {
     		colStatus = "_col1";
     		ngmf.insertColumn(objData2, colStatus);
		}
    
    	var jsons = jsonArray.filter(function(j,n){ 
     		j[colStatus] = j["rowStatus"];
     		return j["rowStatus"]!="R";
		});
 
    	objData2.setJSON(jsons,false);
    	objData2.modifyMatchedStatus( colStatus , "C" , "C" );
    	objData2.modifyMatchedStatus( colStatus , "U" , "U" );
    
    } catch(e) {
    	ngmf._error("[ngmf.copyUpdateChkData] Exception :: ", e);
    } finally {
    	return jsons;
    }
};

/**
 * 지정한 Dataset을 기존 Dataset에 추가하는 Method 입니다. 기존 Dataset의 마지막 레코드 다음에 추가됩니다.
 * @date 2016.02.09
 * @memberOf ngmf
 * @param {String/Object} dsObj     :: I :: N :: :: 기존 dataSet ID.
 * @param {String/Object} copyDsObj :: I :: N :: :: Append 할 Dataset ID.
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.appendDataSet(dsObj, copyDsObj);
 * @exampleAsIs dsObj.appendDataSet(copyDsObj); 
 */
ngmf.appendDataSet = function (dsObj, copyDsObj) {
	try {
		var ogDs = ngmf.object(dsObj);
		var cpDs = ngmf.object(copyDsObj);
		if (typeof ogDs == "undefined" || typeof cpDs == "undefined") return; 

		var cpData = cpDs.getAllJSON();

		ogDs.setJSON(cpData, true);

	} catch(e) {
    	ngmf._error("[ngmf.appendDataSet] Exception :: ", e);
	}
};

/**
 * Filter된 Record를 포함한 Dataset에서 전체 Record 갯수를 구하는 Method 입니다.
 * @date 2016.02.09
 * @memberOf ngmf
 * @param {String/Object} dsObj  :: I :: N :: :: 기존 dataSet ID.
 * @return {Number} dataList의 recod 갯수.
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.getRowCountNF( dsObj )
 * @exampleAsIs dsObj.getRowCountNF()
 */
ngmf.getRowCountNF = function (dsObj) {
	try {
		var dsComp = ngmf.object(dsObj);
		if (typeof dsComp == "undefined") return;
		return dsComp.getTotalRow();

	} catch(e) {
    	ngmf._error("[ngmf.getRowCountNF] Exception :: ", e);
	}
};

/**
 * Filter된 레코드를 포함한 Dataset에서 지정한 레코드 Index와 Column ID에 해당하는 값을 가지고 오는 Method 입니다.
 * @date 2016.02.09
 * @memberOf ngmf
 * @param {String/Object} dsObj    :: I :: N :: :: 기존 dataSet ID.
 * @param {Number} nRow            :: I :: N :: :: 값을 얻어올 Record Index.
 * @param {String/Number} strColID :: I :: N :: :: 값을 얻어올 Column Index 또는 column ID
 * @return {String/Object} 지정한 레코드 위치와 Column ID에 해당하는 값. 해당하는 값이 없을 경우에는 Null을 Return 합니다.
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.getRowCountNF(dsObj, rowIdx, columnID);
 * @exampleAsIs dsObj.getRowCountNF(rowIdx, columnID);
 */
ngmf.getColumnNF = function (dsObj, rowIdx, columnID) {
	try {
		var dsComp = ngmf.object(dsObj);
		if (typeof dsComp == "undefined") return null;
		var dataAllJSON = dsComp.getAllJSON();
		if (typeof dataAllJSON[rowIdx] == "undefined") return null;
		var retVal = dataAllJSON[rowIdx][columnID];
		if(typeof retVal == "undefined") return null;
		return retVal;
	} catch(e) {
    	ngmf._error("[ngmf.getColumnNF] Exception :: ", e);
	}
};

/**
 * Filter된 레코드를 포함한 Dataset에서 지정된 레코드 Index와 Column ID에 해당하는 값을 변경하는 Method 입니다.
 * @date 2016.02.09
 * @memberOf ngmf
 * @param {String/Object} dsObj    :: I :: N :: :: 기존 dataSet ID.
 * @param {Number} nRow            :: I :: N :: :: 변경할 Record Index.
 * @param {String/Number} strColID :: I :: N :: :: 변경할 Column Index 또는 Column Id
 * @param {String} value           :: I :: N :: :: 변경할 값.
 * @return {Boolean} 성공여부. [설정 성공 : true, 실패 : false]
 * @author 이동규
 * @useMobile use
 * @sync true
 * @example ngmf.setColumnNF(dsObj, rowIdx, columnID, value);
 * @exampleAsIs dsObj.setColumnNF(rowIdx, columnID, value);
 */
ngmf.setColumnNF = function (dsObj, rowIdx, columnID, value) {
	try {
		var dsComp = ngmf.object(dsObj);
		if (typeof dsComp == "undefined") return false;
		
		var setOption = {
			"realRowIndex" : rowIdx,
			"colID" : columnID,
			"value" : value
		};

		dsComp.setCellData(setOption);
		return true;
	} catch(e) {
    	ngmf._error("[ngmf.setColumnNF] Exception :: ", e);
	}
};

/**
 * column Id로 cell Index를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {String} strBand         :: I :: N ::  :: 얻고자 하는 Cell의 영역 'Head'/'Body'/'Summ'를 지정합니다
 * @param {String} strColID        :: I :: N ::  :: 삭제된 Record List에서 값을 가져올 Column ID
 * @return {Integer} cell Index
 * @author 조지용
 * @useMobile use
 * @example ngmf.getBindCellIndex("grd_msg", "Body", "msg_id");
 * @exampleAsIs grd_strd_info_nat.GetBindCellIndex("body", "unlaw_rom_cl_strd_cd") 
 */
ngmf.getBindCellIndex = function(gridId, strBand, strColID){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
		return gridObj.getColumnIndex(strColID);
	} catch (e) {
		ngmf._error("[ngmf.getBindCellIndex] Exception :: ", e);
	}
};

/**
 * 현재 선택된 Cell의 EditType을 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @return {String} cell의 EditType(text, select, combo, date 등)
 * @author 조지용
 * @useMobile use
 * @example ngmf.getCurEditType('grd_msg');
 * @exampleAsIs grd_ChnlRejtList.GetCurEditType();
 */
ngmf.getCurEditType = function(gridId){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
		var returnValue;
 		var col = gridObj.getFocusedColumnIndex();
 		var row = gridObj.getFocusedRowIndex();

 		returnValue = gridObj.getCellOption(row,col,"inputType");
 		
 		/*
		if(returnValue == "text"){
			var dataType = this.getCellOption(row,col,"dataType");
			
			if(dataType == "text" ){
				returnValue = "normal";
			} else if ( dataType == "number") {
				returnValue = "number";
			} else if ( dataType == "date" ) {
				returnValue = "date";
			} else {
				returnValue = "text";
			}
		}
		*/
 		
 		return returnValue;
	} catch (e) {
		ngmf._error("[ngmf.getCurEditType] Exception :: ", e);
	}
};

/**
 * Grid의 Contents에서 정의한 Head/Body/Summary 영역의 Cell 갯수를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {String} strBand         :: I :: N ::  :: 얻고자 하는 Cell의 영역 'Head'/'Body'/'Summ'를 지정합니다
 * @return {Integer} 지정한 영역의 Cell 갯수
 * @author 조지용
 * @useMobile use
 * @example ngmf.getCellCount("grd_msg", "Head");
 * @exampleAsIs Grid0.GetCellCount("Head");
 */
ngmf.getCellCount = function(gridId, strBand){
	try{
		var gridObj = ngmf.object(gridId);
		var rtnVal = null;
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
		if( ngmf.toUpper(strBand) == "HEAD" ) { //헤더인 경우
			rtnVal = gridObj.getHeaderValueList().length;
		} else if( ngmf.toUpper(strBand) == "SUMM" ) { //서머리인 경우
			rtnVal = (gridObj.getFooterTable()) ? gridObj.getFooterHtmlInfo().rowArr[0].length : 0;
		} else if( ngmf.toUpper(strBand) == "BODY" ) { //body인 경우
			rtnVal = gridObj.getColCnt(); //Grid에서 영역별로 한 Row를 이루고 있는 Cell의 갯수
		}
		
		return rtnVal;
	} catch (e) {
		ngmf._error("[ngmf.getCellCount] Exception :: ", e);
	}
};

/**
 * Treeview 항목의 자식의 갯수를 구하는 Method입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} treeObj :: I :: N ::  :: 대상 treeView 컴포넌트 ID
 * @param {Number / String} row     :: I :: N ::  :: 자식의 갯수를 구하려고하는 항목의 Dataset의 Row 또는 계층구조상 Path
 * @author 이동규 
 * @useMobile use
 */
ngmf.childCount = function(treeObj, row){
	try{
		var treeObj = ngmf.object(treeObj);
		var rowIndex;
		
		if(treeObj && treeObj.getPluginName() == "treeview") {
			
			if(typeof row == "number"){
				rowIndex = row;
			} else if(typeof row == "string"){
				rowIndex = ngmf.getItemRow(treeObj, row);
			}
			
			var findNode = treeObj.findNodeByIndex(rowIndex);
			
			if (findNode && findNode.childNodes.length > -1) {
				return findNode.childNodes.length;
			} else {
				return -1;
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.childCount] Exception :: ", e);
	}
}; 

/**
 * TreeView의 항목에서 계층구조상 부모가 되는 항목의 Row를 구하는 Method입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} treeObj :: I :: N ::  :: 대상 treeView 컴포넌트 ID
 * @param {Number / String} row     :: I :: N ::  :: 부모를 구할 항목의 Dataset의 Row. 또는 Path
 * @author 이동규
 * @useMobile use
 * @return {Number} 부모 항목의 Dataset의 Row.
 */
ngmf.getParentRow = function(treeObj, row) {
	try{
		var treeObj = ngmf.object(treeObj);
		var rowIndex;
		
		if(treeObj && treeObj.getPluginName() == "treeview") {
			
			if(typeof row == "number"){
				rowIndex = row;
			} else if(typeof row == "string"){
				rowIndex = ngmf.getItemRow(treeObj, row);
			}
						
			var findNode = treeObj.findNodeByIndex(rowIndex);
			
			if (findNode && ngmf.isNull(findNode.parentNode) == "N" && ngmf.isNull(findNode.parentNode.value) == "N") {
				return findNode.parentNode.index;
			} else {
				return -1;
			}
			
		}
	} catch (e) {
		ngmf._error("[ngmf.getParentRow] Exception :: ", e);
	}
};

/**
 * 지정한 Cell의 출력 영역 정보를 얻어오는 Method입니다.
 * @date 2016-04-05
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {Number} row             :: I :: N ::  :: 얻고자 하는 Cell의 Row Index. [0 이상 : Body 영역의 Row. -1 : Head 영역. -2 : Summ(Summary) 영역.]
 * @param {Number} col             :: I :: N ::  :: 얻고자 하는 Cell의 Index.
 * @return {Array} array 형태로 값을 Return 합니다. //array[0] : Left, array[1] : Top, array[2] : Right, array[3] : Bottom 
 * @author 이동규
 * @useMobile use
 * @example ngmf.getCellRect("grd_msg", row, col);
 * @exampleAsIs grd_msg.getCellRect(row, col);
 */
ngmf.getCellRect = function(gridObj, row, col) {
	try {
		var gridObj = ngmf.object(gridObj);
		
		if (typeof gridObj != "undefined" && typeof row != "undefined" && typeof col != "undefined") {
			if (row > -1) {
				var gridTd = $("#"+gridObj.getID() + "_cell_"+row+"_"+col);
				if (gridTd) {
					if (gridObj.getCellOption(row,col,"rowSpan") > 1) {
						return -1;
					}
					
					var left = parseInt(gridTd.offset().left, 10);
					var top =  parseInt(gridTd.offset().top, 10);
					var width = parseInt(window.getComputedStyle(gridTd[0], null).width.replace("px",""), 10);
					var height = parseInt(window.getComputedStyle(gridTd[0], null).height.replace("px",""), 10);
					var right = left + width;
					var bottom = top + height;
					
					return [left, top, right, bottom];
				}
			} else if (row == -1) {
				var gridHeaderTd = $("#"+gridObj.getID() + "_" + gridObj.getHeaderID(col));
				
				if (gridHeaderTd) {
					if( gridHeaderTd.attr("rowSpan") > 1) {
						return -1;
					}
					
					var left = parseInt(gridHeaderTd.offset().left, 10);
					var top =  parseInt(gridHeaderTd.offset().top, 10);
					var width = parseInt(window.getComputedStyle(gridHeaderTd[0], null).width.replace("px",""), 10);
					var height = parseInt(window.getComputedStyle(gridHeaderTd[0], null).height.replace("px",""), 10);
					var right = left + width;
					var bottom = top + height;
					
					return [left, top, right, bottom];
				}
			} else if (row == -2) {
				//<to-be> 확인후 작업예정.
			}
		} else {
			return -1;
		}
	} catch(e) {
		ngmf._error("[ngmf.getCellRect] Exception :: ", e);
	}
};

/**
 * nMilisec 시간 동안 해당 Cell을 깜박이게 보이도록 배경색과 글자색을 설정하는 Method 입니다.
 * @date 2016-04-06
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {Number} row             :: I :: N ::  :: 설정할 Cell의 Row Index.
 * @param {Number} col             :: I :: N ::  :: 설정할 Cell의 Column Index.
 * @param {String} bkColor         :: I :: N ::  :: 배경색의 값 또는 이름.
 * @param {String} textColor       :: I :: N ::  :: 글자색의 값 또는 이름.
 * @param {Number} nMilisec        :: I :: N ::  :: Milli Second 단위의 시간간격. 0 이상의 값을 입력해야 합니다.
 * @return {Array} array 형태로 값을 Return 합니다. //array[0] : Left, array[1] : Top, array[2] : Right, array[3] : Bottom 
 * @author 이동규
 * @useMobile use
 * @example ngmf.setBlinkColor(grd_msg, 2, 3, 'blue', 'white', 1000);
 * @exampleAsIs grd_msg.setBlinkColor(row, col, bkColor, textColor, nMilisec)
 */
ngmf.setBlinkColor = function(gridObj, row, col, bkColor, textColor, nMilisec) {
	try{
		var gridObj = ngmf.object(gridObj);
		
		if(gridObj) {
			var gridCellTd = $("#"+ gridObj.getID()+"_cell_"+row+"_"+col);
			
			if(gridCellTd) {
				var oldBackColor = $("#"+gridCellTd.attr("id")).parent().css("background-color");
				
				if(oldBackColor.startsWith("rgb")) {
					oldBackColor = ngmf._rgb2Hex(oldBackColor);
				}
				
				var oldColor = $("#"+gridCellTd.attr("id")).css("color");
				
				if(oldColor.startsWith("rgb")) {
					oldColor = ngmf._rgb2Hex(oldColor);
				}
				
				var nMilisec = typeof nMilisec == "undefined" ? 0 : nMilisec;
				gridCellTd.css("background-color", bkColor);
				gridCellTd.css("color", textColor);

				var setBlinkObj = { id : gridCellTd.attr("id"),
						            oldColor : oldColor,
						            oldBackColor : oldBackColor,
						            gridCellTd : gridCellTd
						          }
				
				setTimeout(function(){
					ngmf._blinkDelete(setBlinkObj);
				}, nMilisec);
			}
		}
	} catch (e) {
		ngmf._error("[ngmf.setBlinkColor] Exception :: ", e);
	}
};

/**
 * setBlinkColor 내부함수.
 * @date 2016-04-06
 * @memberOf ngmf
 * @author 이동규
 * @useMobile use
 */
ngmf._blinkDelete = function(obj) {
 obj.gridCellTd.css("color", obj.oldColor);
 obj.gridCellTd.css("background-color", obj.oldBackColor);
};

/**
 * setBlinkColor 내부함수.
 * @date 2016-04-06
 * @memberOf ngmf
 * @author 이동규
 */
ngmf._rgb2Hex = function(rgb) {
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
   ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
   ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
   ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : ";"
};

/**
 * TreeView의 항목에대해 자식이 되는 항목의 Dataset의 row를 구하는 Method입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} treeObj :: I :: N ::  :: 대상 treeView 컴포넌트 ID
 * @param {Number / String} row     :: I :: N ::  :: 자식 항목을 구할 항목의 Dataset의 Row. 또는 Path
 * @param {Number}          nIdx    :: I :: N ::  :: 자식 항목의 Index.(Default Value = 0 )
 * @author 이동규
 * @useMobile use
 * @return {Number} 부모 항목의 Dataset의 Row.
 */
ngmf.getChildRow = function(treeObj, row, nIdx){
	try{
		var rtnVal;
		var treeObj = ngmf.object(treeObj);
		var nIdx = typeof nIdx == "undefined" ? 0 : parseInt(nIdx, 10);
		var rowIndex;
		
		if (isNaN(nIdx)) return rtnVal;
		if(treeObj && treeObj.getPluginName() == "treeview") {
			
			if(typeof row == "number"){
				rowIndex = row;
			} else if(typeof row == "string"){
				rowIndex = ngmf.getItemRow(treeObj, row);
			}
			
			var findNode = treeObj.findNodeByIndex(rowIndex);
			
			if (findNode && findNode.childNodes.length > 0 ) {
				var childeNode = findNode.childNodes[nIdx];
				if (childeNode && childeNode.index > -1) {
					rtnVal = childeNode.index;
				}
			} else if(ngmf.isNull(findNode) == "Y") {
				rtnVal = null;
			} else {
				rtnVal = -1;
			}
		}
		
		return rtnVal;
	} catch (e) {
		ngmf._error("[ngmf.getChildRow] Exception :: ", e);
	}
};

/**
 * TreeView의 항목이 Root 항목인지 여부를 구하는 Method입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} treeObj :: I :: N ::  :: 대상 treeView 컴포넌트 ID
 * @param {Number / String} row     :: I :: N ::  :: Roow 구분할 항목의 Dataset의 Row. 또는 Path
 * @author 이동규
 * @useMobile use
 * @return {Boolean} Root 항목인지 여부 Root항목이면 true, 아니면 false를 Return합니다.
 */
ngmf.isRoot = function(treeObj, row){
	try{
		var comp = ngmf.object(treeObj);
		
		if (comp) {
			
			var parentNode = null;
			var rowIndex;
			
			if(comp && comp.getPluginName() == "treeview") {
				
				if(typeof row == "number"){
					rowIndex = row;
				} else if(typeof row == "string"){
					rowIndex = ngmf.getItemRow(comp, row);
				}
				
				if(rowIndex > -1){
					//rowIndex = rowIndex+1; //as-is와 to-be에서의 treeview의 rowIndex시작점(as-is : 0, to-be : 1)이 차이가 있어서 1을 추가해줌
				}
				
				var findNode = comp.findNodeByIndex(rowIndex);
				
				if (findNode && ngmf.isNull(findNode.parentNode) == "N") {
					parentNode = findNode.parentNode.index;
					//parentNode = findNode.parentNode.index-1; //as-is와 to-be에서의 treeview의 rowIndex시작점(as-is : 0, to-be : 1)이 차이가 있어서 1을 제거해줌
				} else if (ngmf.isNull(findNode) || (findNode && ngmf.isNull(findNode.parentNode) == "Y")) {
					parentNode = null;
				} else {	
					parentNode = -1;
				}
			}
			
			
			if (parentNode == 0 || parentNode == -1) {
				return true;
			} else if (ngmf.isNull(parentNode) == "Y") {
				return null;
			} else {
				return false;
			}
		}
		
		return null;
	} catch (e) {
		ngmf._error("[ngmf.isRoot] Exception :: ", e);
	}
}; 

/**
 * TreeView 항목의 계층 구조상 Path로 부터, Treeview 항목의 Dataset Row를 구하는 Method입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {String} Path            :: I :: N ::  :: TreeView 항목의 계층 구조상 Path
 * @author 이동규
 * @useMobile use
 * @return {String} TreeView항목의 계층구조상 검색 row.
 */
ngmf.getItemRow = function(treeObj, path){
	try{
		var comp = ngmf.object(treeObj);
		var findIdx = -1;
		
		if (comp && typeof path != "undefined") {
			var pathArr = path.split(".");
			var colDepth = comp.tree.dataPath.depth;
			var findData = comp.getAllXML().getElementsByTagName(colDepth);
			var parentIdx = 0;
			
			//Path단계
			for (var i = 0; i < pathArr.length; i++) {
				var searchLvl = i+1; //찾고자 하는 level
				var searchLvlCnt = parseInt(pathArr[i], 10); //찾고자 하는 level의 수(위치값)
				
				//노드의 level 값으로 찾기
				for (var j = parentIdx+1 ; j <= findData.length ; j++) {
					var depthValue = parseInt(findData[j-1].childNodes[0].nodeValue, 10);
					
					//찾고자 하는 level 정보와 일치하는 경우
					if(searchLvl == depthValue){
						searchLvlCnt--;
					}
					
					//찾고자 하는 레벨의 자식노드가 아닌 상위노드로 가게 되는 경우 자식노드에는 없기 때문에 -1 리턴
					if(searchLvl > depthValue){
						return findIdx;
					}
					//찾고자 하는 level의 수(위치값)를 다 찾은 경우 다음 path단계로 넘어감
					if(searchLvlCnt < 0){
						parentIdx = j; 
						
						//마지막 path인 경우
						if(i == pathArr.length -1){
							findIdx = j;
						}
						
						break;
					}
				}	
			}
			
			return findIdx;
		}
	} catch (e) {
		ngmf._error("[ngmf.getItemRow] Exception :: ", e);
	}
};

/**
 * Grid에서 Multi로 영역을 선택했을 경우 선택된 영역의 마지막 Row Index를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @return {Integer} 선택된 영역의 마지막 Row Index
 * @author 조지용
 * @useMobile use
 * @example ngmf.getAreaEndRow('grd_msg');
 * @exampleAsIs Grid.GetAreaEndRow();
 */
ngmf.getAreaEndRow = function(gridId){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
		var rowInfo = gridObj.getAllFocusedIndex();
		var max = null;
		for( var i = 0; i < rowInfo.length; i++ ){
			var row = parseFloat(rowInfo[i].row);
			if( !isNaN(row) ) {
				if ( max == null || max < row ) {
					max = row;
				}
			}
		}
		return max;
	} catch (e) {
		ngmf._error("[ngmf.getAreaEndRow] Exception :: ", e);
	}
};

/**
 * Grid에서 Multi로 영역을 선택했을 경우 선택된 영역의 마지막 Column Index를 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @return {Integer} 선택 영역의 마지막 Column Index
 * @author 조지용
 * @useMobile use
 * @example ngmf.getAreaEndCol('grd_msg');
 * @exampleAsIs Grid.GetAreaEndCol();
 */
ngmf.getAreaEndCol = function(gridId){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}

		var rowInfo = gridObj.getAllFocusedIndex();
		var max = null;
		for( var i = 0; i < rowInfo.length; i++ ){
			var col = parseFloat(rowInfo[i].col);
			if( !isNaN(col) ) {
				if ( max == null || max < col ) {
					max = col;
				}
			}
		}
		return max;
	} catch (e) {
		ngmf._error("[ngmf.getAreaEndCol] Exception :: ", e);
	}
};

/**
 * 해당 영역의 지정한 Cell의 Property에 값을 설정하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId    :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {String} strBand            :: I :: N ::  :: 설정하고자 하는 Cell의 영역 'Head'/'Body'/'Summ'를 지정합니다
 * @param {Integer} nCellIdx          :: I :: N ::  :: 설정하고자 하는 Cell의 Index.
 * @param {String} strPropID          :: I :: N ::  :: 설정하고자 하는 Cell의 Property 명
 * @param {Integer / String} varValue :: I :: N ::  :: 설정할 Property 값
 * @author 조지용
 * @useMobile use
 * @example 
 * @exampleAsIs Grid0.setCellProp("summary",2,"BkColor","Yellow");
 */
ngmf.setCellProp = function(gridId, strBand, nCellIdx, strPropID, varValue ){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var type = strBand.toLowerCase();
 		var options = {};

 		options.cellInx = nCellIdx;
 		options.propName = strPropID.toLowerCase();
 		options.propValue = varValue;

		switch( type ) {
			case "head" : ngmf._setHeaderCellProp(gridId, options); break;
			case "body" : ngmf._setBodyCellProp(gridId, options); break;
			case "summ" : ngmf._setFooterCellProp(gridId, options); break; 
			default : break;
		}
	} catch (e) {
		ngmf._error("[ngmf.setCellProp] Exception :: ", e);
	}
};

/**
 * 해당 영역의 지정한 Cell의 Property에 값을 설정하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId    :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {String} strBand            :: I :: N ::  :: 얻고자 하는 Cell의 영역 'Head'/'Body'/'Summ'를 지정합니다
 * @param {Integer} nCellIdx          :: I :: N ::  :: 얻고자 하는 Cell의 Index
 * @param {String} strPropID          :: I :: N ::  :: 얻고자 하는 Cell의 Property 명
 * @return {Integer / String} 해당 Cell의 Property 값
 * @author 조지용
 * @useMobile use
 * @example ngmf.getCellProp(grd_msg, "body", 0, "colId");
 * @exampleAsIs Grid0.GetCellProp("summary",2,"BkColor2","Yellow");
 */
ngmf.getCellProp = function(gridId, strBand, nCellIdx, strPropID){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
		var strBand = ngmf.toUpper(strBand);
 		//var options = {};
 		//options.cellInx = nCellIdx;
 		strPropID = ngmf.toUpper(strPropID);

		switch( strBand ) {
			//case "head" : return ngmf._getHeaderCellProp(gridId, options); break;
			//case "body" : return ngmf._getBodyCellProp(gridId, options); break;
			//case "summ" : return ngmf._getFooterCellProp(gridId, options); break;
		
			case "HEAD" : return ngmf._getHeaderInfo(gridId, strBand, nCellIdx, strPropID); break;
			case "BODY" : return ngmf._getBodyInfo(gridId, strBand, nCellIdx, strPropID); break;
			case "SUMM" : break; 
			default : break;
		}
	} catch (e) {
		ngmf._error("[ngmf.getCellProp] Exception :: ", e);
	}
};

/**
 * Grid에 설정된 Column의 Property 값을 가져오는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {Integer} nColIdx        :: I :: N ::  :: 얻고자 하는 Column의 Index.
 * @param {String} strPropID       :: I :: N ::  :: 얻고자 하는 Column의 Property 명
 * @return {Integer / String} 해당 Column의 Property 값
 * @author 조지용
 * @useMobile use
 * @update 2016.05.20 조지용 setColProp와 대응되는 값을 가져오도록 수정
 * @example ngmf.getColProp("grd_msg", 1, "width");
 * @exampleAsIs Grid0.GetColProp(1,"Fix");
 */
ngmf.getColProp = function(gridId, nColIdx, strPropId){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var colID = gridObj.getColumnID(nColIdx);
 		var prop = strPropId;
 		var res;
 		prop = prop.toLowerCase();
 		switch( prop ){
 			case "style" : 
 				res = gridObj.getFixedColumnLastIndex() >= (nColIdx+1) ? "Fix" : "Null";
 				return res;
 				break;
 			case "fix" : 
 				res = gridObj.getFixedColumnLastIndex() >= (nColIdx+1) ? true : false;
 				return res;
 				break;
 			case "width" : 
 				var propValue = gridObj.getColumnWidth(nColIdx);
 				propValue = propValue-0;
 				return propValue;
 				break;
 			default : break;
 		}
	} catch (e) {
		ngmf._error("[ngmf.getColProp] Exception :: ", e);
	}
};

/**
 * 내부함수-그리드 Header의 cell Property값 반환 
 * @date 2016-04-30
 * @memberOf ngmf
 * @author 조지용
 * @useMobile use
 */
ngmf._getHeaderCellProp = function(gridId, options){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var Index = options.cellInx*1;
 		var length = gridObj.getHeaderValueList().length;
 		if( Index > length ){
 			return 
 		}
 		var headerId = gridObj.getHeaderID( Index );
 		switch( options.propName ){
 			case "colid" : return headerId; return; 
 			case "text" : return gridObj.getHeaderValue( headerId ); break;
 			case "align" : return gridObj.getHeaderCellStyleValue( headerId, "text-align" ); break;
 			case "bkcolor" : return gridObj.getHeaderCellStyleValue( headerId, "background-color" ); break;
 			case "bkcolor2" : return gridObj.getHeaderCellStyleValue( headerId, "background-color" ); break;
 			case "color" : return gridObj.getHeaderCellStyleValue( headerId, "color" ); break;
 			case "font" : return gridObj.getHeaderCellStyleValue( headerId, "font" ); break;
 			default : break;
 			
 		}
	} catch (e) {
		ngmf._error("[ngmf._getHeaderCellProp] Exception :: ", e);
	}
};

/**
 * 내부함수-그리드 Body의 cell Property값 반환 
 * @date 2016-04-30
 * @memberOf ngmf
 * @author 조지용
 * @useMobile use
 */
ngmf._getBodyCellProp = function(gridId, options){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var colcnt = gridObj.getColCnt();
 		var cellInx = options.cellInx*1;
 		var row = Math.floor(cellInx / colcnt);
 		var col = cellInx % colcnt;
 		var colId = gridObj.getColumnID(col);

 		switch( options.propName ){
 			case "colid" : return gridObj.getColumnID( col ); break;
 			case "text" : return gridObj._dataList.getCellData(row,colId); break;
 			case "align" : return gridObj.getCellStyleValue( row, col, "text-align" ); break;
 			case "bkcolor" : return gridObj.getCellStyleValue( row, col, "background-color" ); break;
 			case "bkcolor2" : return gridObj.getCellStyleValue( row, col, "background-color" ); break;
 			case "color" : return gridObj.getCellStyleValue( row, col, "color" ); break;
 			case "font" : return gridObj.getCellStyleValue( row, col, "font" ); break;
 			default : break;
 		}
	} catch (e) {
		ngmf._error("[ngmf._getBodyCellProp] Exception :: ", e);
	}
};

/**
 * 내부함수-그리드 Summury의 cell Property값 반환 
 * @date 2016-04-30
 * @memberOf ngmf
 * @author 조지용
 * @useMobile use
 */
ngmf._getFooterCellProp = function(gridId, options){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var colcnt = gridObj.getColCnt();
 		var cellInx = options.cellInx*1;
 		var col = cellInx % colcnt;
 		var footerId = ngmf.__getFooterID(gridId, col);

 		switch( options.propName ){
 			case "colid" : return footerId; break;
 			case "text" : return gridObj.getFooterData(footerId); break;
 			case "align" : return gridObj.getFooterStyle( footerId, "text-align" ); break;
 			case "bkcolor" : return gridObj.getFooterStyle( footerId, "background-color" ); break;
 			case "bkcolor2" : return gridObj.getFooterStyle( footerId, "background-color" ); break;
 			case "color" : return gridObj.getFooterStyle( footerId, "color" ); break;
 			case "font" : return gridObj.getFooterStyle( footerId, "font" ); break;
 			default : break;
 		}
	} catch (e) {
		ngmf._error("[ngmf._getFooterCellProp] Exception :: ", e);
	}
};

/**
 * 내부함수-그리드 Summury의 cell Property값 반환 
 * @date 2016-04-30
 * @memberOf ngmf
 * @author 조지용
 * @useMobile use
 */
ngmf.__getFooterID = function(gridId, footerId){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var footerTable = gridObj.getElementById(gridObj.id+"_foot_table" );
		var footerTds = footerTable.getElementsByTagName("td");
		if(typeof footerId == "number"){
			var footerIdx = footerId + gridObj.defaultColCnt;
			footerTd = footerTds[footerIdx];
			footerId = footerTd.getAttribute("footer_id");
			return footerId;
		}
	} catch (e) {
		ngmf._error("[ngmf.__getFooterID] Exception :: ", e);
	}
};

/**
 * 내부함수-그리드 Header의 cell Property값 셋팅 
 * @date 2016-04-30
 * @memberOf ngmf
 * @author 조지용
 * @useMobile use
 */
ngmf._setHeaderCellProp = function(gridId, options){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var index = options.cellInx*1;
 		var headerId = gridObj.getHeaderID(index);
 		var value = options.propValue;
 		
 		switch( options.propName ){
 			case "text" : gridObj.setHeaderValue( headerId, value ); break;
 			case "align" : gridObj.setHeaderStyle( headerId, "text-align", value ); break;
 			case "bkcolor" : gridObj.setHeaderStyle( headerId,"background", ngmf._getColorCode(value) ); break;
 			case "bkcolor2" : gridObj.setHeaderStyle( headerId,"background", ngmf._getColorCode(value) ); break;
 			case "color" : gridObj.setHeaderStyle( headerId, "color", ngmf._getColorCode(value) ); break;
 			case "font" : gridObj.setHeaderStyle( headerId, "font", value ); break;
 			default : break;
 		}
	} catch (e) {
		ngmf._error("[ngmf._setHeaderCellProp] Exception :: ", e);
	}
};

/**
 * 내부함수-그리드 Body의 cell Property값 셋팅 
 * @date 2016-04-30
 * @memberOf ngmf
 * @author 조지용
 * @useMobile use
 */
ngmf._setBodyCellProp = function(gridId, options){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var cellInx = options.cellInx;
 		var colcnt = gridObj.getColCnt();

 		var rowInx = Math.floor( cellInx / colcnt ); 
 		var colInx = cellInx % colcnt;	
 		var value = options.propValue;

 		switch( options.propName ){
 			case "align" :
 				var rowCount = gridObj.getRowCount();
 				
 				for(var i=0; i<rowCount; i++){
 					gridObj.setCellStyle( i, colInx, "text-align", value );
 				}
 				break;
 				
 			case "bkcolor" :
 				var rowCount = gridObj.getRowCount();
 				
 				for(var i=0; i<rowCount; i++){
 					gridObj.setCellBackgroundColor( i, colInx, ngmf._getColorCode(value) );
 				}
 				break;
 				
 			case "bkcolor2" : break;
 			case "color" : 
 				var rowCount = gridObj.getRowCount();
 				
 				for(var i=0; i<rowCount; i++){
 					gridObj.setCellColor( i, colInx, ngmf._getColorCode(value) );
 				}
 				break;
 			case "mask" : gridObj.setDisplayFormat(colInx, value ); break;
 				
 			case "font" : gridObj.setCellStyle( rowInx, colInx, "font", value); break;
 			case "combodataset" : gridObj.setColumnNodeSet( colInx, "data:" + options.propValue, "value", "id"); break;
 			default : break;
 		}
	} catch (e) {
		ngmf._error("[ngmf._setBodyCellProp] Exception :: ", e);
	}
};

/**
 * 내부함수-그리드 Summury의 cell Property값 셋팅
 * @date 2016-04-30
 * @memberOf ngmf
 * @author 조지용
 * @useMobile use
 */
ngmf._setFooterCellProp = function(gridId, options){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var colcnt = gridObj.getColCnt();
 		var col = (options.cellInx*1) % colcnt;
 		var footerId = ngmf.__getFooterID(gridId, col);
 		var value = options.propValue;

 		switch( options.propName ){
 			case "colid" : break;
 			case "text" : gridObj.setFooterData( footerId, value ); break;
 			case "align" : gridObj.setFooterStyle( footerId, "text-align", value ); break;
 			case "bkcolor" : gridObj.setFooterStyle( footerId, "background-color", ngmf._getColorCode(value) ); break;
 			case "bkcolor2" : gridObj.setFooterStyle( footerId, "background-color", ngmf._getColorCode(value) ); break;
 			case "color" : gridObj.setFooterStyle( footerId, "color", ngmf._getColorCode(value) ); break;
 			case "font" : gridObj.setFooterStyle( footerId, "font", value ); break;
 			default : break;
 		}
	} catch (e) {
		ngmf._error("[ngmf._getFooterCellProp] Exception :: ", e);
	}
};

/**
 * TreeView의 항목이 Leaf 항목인지 여부를 구하는 API입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} treeObj :: I :: N ::  :: 대상 treeView 컴포넌트 ID
 * @param {Number / String}     row :: I :: N ::  :: Roow 구분할 항목의 Dataset의 Row. 또는 Path
 * @author 조지용
 * @useMobile use
 * @return {Boolean} Leaf 항목인지 여부
 */
ngmf.isLeaf = function(treeObj, row){
	try{
		var comp = ngmf.object(treeObj);
		
		if (comp) {
			var childNode = ngmf.getChildRow(comp, row);
			
			if (childNode == -1) {
				return true;
			} else if (ngmf.isNull(childNode) == "Y") {
				return null;
			} else {
				return false;
			}
		}
		
		return null;
	} catch (e) {
		ngmf._error("[ngmf.isLeaf] Exception :: ", e);
	}
}; 

/**
 * getCellProc() 처리를 위한 HEAD관련 함수
 **/		
ngmf._getHeaderInfo = function(grdId, strBand, nCellIdx, strPropID) {
	var rtnVal = null;
	var grdObj = ngmf.object(grdId);
	var colId = grdObj.getHeaderID(nCellIdx);
	
	if(colId == undefined || colId == "" || colId == null) {
		return;
	}
	
	var headerCellInfo = grdObj.getHeaderDIV(colId);
	
	//속성별 return값 셋팅
	switch(strPropID) {
		case "ROW" :
		case "COL" :
			var headerInfo = grdObj.getHeaderHtmlInfo();
	
			for(var i=0; i<headerInfo.rowArr.length; i++){
				var rowInfo = headerInfo.rowArr[i];
				
				for(var j=0; j<rowInfo.length; j++){
					if(rowInfo[j].col_id == colId){
						if(strPropID == "ROW"){
							return i;
						} else if(strPropID == "COL") {
							return rowInfo[j].colIndex;
						}
					}
				}
			}
			
			break;
		case "COLSPAN" :
		case "ROWSPAN" :
			rtnVal = headerCellInfo.getAttribute(strPropID);
			if(rtnVal == undefined || rtnVal == "" || rtnVal == null) rtnVal = "1";
			return rtnVal;
			break;
		case "TEXT" :
		case "VALUE" :
			return headerCellInfo.getAttribute("value");
			break;
		case "DISPLAY" :
		case "INPUTTYPE" :
			return headerCellInfo.getAttribute("inputtype");
			break;
		case "COLID" :
		case "COL_ID" :
			return headerCellInfo.getAttribute("col_id");
			break;
		default :
			return headerCellInfo.getAttribute(strPropID);
			break;
			
	}
	
	return rtnVal;
};

/**
 * getCellProc() 처리를 위한 BODY관련 함수
 **/
ngmf._getBodyInfo = function(grdId, strBand, nCellIdx, strPropID) {
	var rtnVal = null;
	var grdObj = ngmf.object(grdId);
	var colId = grdObj.getColumnID(nCellIdx);
	
	if(colId == undefined || colId == "" || colId == null) {
		return;
	}
	
	var bodyColumnInfo = grdObj.cellInfoHash[colId];
	
	//속성별 return값 셋팅
	switch(strPropID) {
		case "COL" :
			return grdObj.getColumnIndex(colId);					
			break;
		case "COLID" :
			return colId;
			break;
		case "DISPLAY" :
		case "INPUTTYPE" :
		case "EDIT" :
			return bodyColumnInfo.options.inputType;
			break;
		case "LIMIT" :
		case "MAXLENGTH" :
			rtnVal = bodyColumnInfo.options.maxLength;
			if(rtnVal == undefined || rtnVal == "" || rtnVal == null) rtnVal = "0";
			return rtnVal;
			break;
		case "EXPANDIMAGE" :
		case "IMAGESRC" :
			return bodyColumnInfo.options.imageSrc; 
	}
	
	return rtnVal;
};


/**
 * treeView contextMenu 생성하는 API 입니다.
 * @date 2016-05-10
 * @memberOf ngmf
 * @param {String} leftPosition :: I :: N ::  :: show시 위치할 left 좌표값.
 * @param {String} topPosition :: I :: N ::  :: show시 위치할 top 좌표값.
 * @param {String} menuDivId :: I :: N ::  :: 동적 생성할 menu div Id.
 * @param {Object} objContextMenu :: I :: N ::  :: contextMenu 정의 객체.
 * @author 김성진
 * @useMobile use
 * @update 2016.05.10 김성진 최초작성.
 * @example
 var objContextMenu = [{menuTitle : "동일레벨", menuId : "equalsNodeLevel"}
					,{menuTitle : "자식레벨", menuId : "childNodeLevel"}
					];
 ngmf.treeContextMenu(leftPosition, topPosition, menuDivId, objContextMenu);
 
 scwin.contextMenuFunc = function(obj) {}; // 업무화면에 삽입(메뉴클릭시 호출됨)
 * @exampleAsIs
 * @sampleLink sui_treeViewEditing
 */
ngmf.treeContextMenu = function(nLeftPosition, nTopPosition, sContextMenuId, objContextMenu) {
	if (typeof nLeftPosition == "undefined" || typeof nTopPosition == "undefined") {
		return false;
	}
 
	// 메뉴 영역 생성
	_setContextMenu(objContextMenu);
	
	var flag = $("#"+sContextMenuId +"_contextMenuDiv").hasClass("show");
	if (!flag) {
		$(".stree_menu").each( function(){
			$(this).removeClass("show");
			$(this).css("display", "none");
		});
  
		var ofs_H = $("#"+sContextMenuId +"_contextMenuDiv").outerHeight()/2;
		var left = nLeftPosition + 30 +"px";
		var top = nTopPosition - ofs_H +"px";
		
		$("#"+sContextMenuId +"_contextMenuDiv").addClass('show');
		$("#"+sContextMenuId +"_contextMenuDiv").css("display", "block");
		$("#"+sContextMenuId +"_contextMenuDiv").css("top", top);
		$("#"+sContextMenuId +"_contextMenuDiv").css("left", left);
		$("#"+sContextMenuId +"_contextMenuDiv").hover(
				function() {
    
				},
				function(){
					$("#"+sContextMenuId +"_contextMenuDiv").fadeOut(400, function() {
						$("#"+sContextMenuId +"_contextMenuDiv").removeClass("show");
						$("#"+sContextMenuId +"_contextMenuDiv").css("display", "none");
					});
				}
		);
	}
 
 
	function _setContextMenu(option) {
		if (typeof option == "undefined" || option.length < 0) {
			ngmf.alert("컨텍스트 메뉴목록이 정의되어 있지 않습니다.");
			return false;
		}
  
		if (option.length > 0 ) {
			if (document.getElementById(sContextMenuId + "_contextMenuDiv") == null) {
				var div = document.createElement("div");
				div.setAttribute("id", sContextMenuId + "_contextMenuDiv");
				div.setAttribute("style", "position: absolute; display: none; ");
				div.setAttribute("class", "w2group stree_menu");
				var doc = document.body;//.childNodes[0];
				doc.appendChild(div);
			}
   
			$("#"+sContextMenuId +"_contextMenuDiv").removeClass("show");
			$("#"+sContextMenuId +"_contextMenuDiv").css("display", "none");
			var htmlStr = [];
			var links = option;
			for (var i = 0; i < links.length; i++) {
				var menuTitle = links[i].menuTitle;
				var menuId = links[i].menuId || (sContextMenuId + "_menuBtn" + i);
    
				htmlStr.push("<a id='" + menuId +"' menuTitle='"+menuTitle+"' >");
				htmlStr.push(menuTitle);
				htmlStr.push("</a>");
			}
  
			htmlStr.push("<span></span>");
			htmlStr = htmlStr.join("");
			document.getElementById(sContextMenuId + "_contextMenuDiv").innerHTML = htmlStr;
			for (var j = 0; j < links.length; j++) {
				var menuId = links[j].menuId || (sContextMenuId + "_menuBtn" + j);
				$("#"+ menuId).on("click", function(e) {
					var obj = {
							menuId : this.getAttribute("id"),
							menuTitle : this.getAttribute("menuTitle")
					};
					if (ngmf.isString(obj.argument)){
						obj.argument = ngmf._extractData(obj.argument);
					}
    
					// 프로그램 서비스 데이터 - 팝업 명, 팝업 URL 결로가 필요합니다.

					// 메뉴 클릭시 호출되는 함수
					var func = "";
					if (typeof window.scwin.contextMenuFunc == "function") {
						func = scwin.contextMenuFunc;
					}
     
					if (typeof func !== "undefined") {
						func(obj);
					}
  
					e.stopPropagation();
     
					// 메뉴 클릭시 사라지게
					$("#"+sContextMenuId +"_contextMenuDiv").fadeOut(400, function() {
						$("#"+sContextMenuId +"_contextMenuDiv").removeClass("show");
						$("#"+sContextMenuId +"_contextMenuDiv").css("display", "none");
					});
					
					return true;
				});
			}
		} else {
			return false;
		}
	};
};

/**
 * 특정 레코드가 Select 상태가 되도록 설정하는 API입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId :: I :: N ::      :: 대상 gridView 컴포넌트 ID
 * @param {Integer} nRow           :: I :: N ::      :: 선택할 레코드 Index
 * @param {Boolean} bCheck         :: I :: Y :: true :: 선택 여부
 * @return {Boolean} SelectRow Method를 수행하기 전에 상태
 * @author 조지용
 * @useMobile use
 * @example ngmf.selectRow("grd_msg", 3, true);
 */
ngmf.selectRow = function(gridId, nRow, bCheck){
	try{
		var gridObj = ngmf.object(gridId);
		var rtnVal = false;
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
		if (typeof bCheck == "undefined") {
			bCheck = true;
		}
		
		for(var i=0; i<gridObj.focusedCell.length; i++){
			if(gridObj.focusedCell[i].focusedRowIndex == nRow){
				rtnVal = true;
			}
		}
		
		if(bCheck == true && !rtnVal){
			var focusInfo = {};
			focusInfo.focusedRowIndex = nRow;
			focusInfo.focusedRealRowIndex= gridObj.getRealRowIndex(nRow);
			focusInfo.focusedColIndex= 0;
			
			var focusedObj = ngmf.object(gridObj.getID() + "_cell_" + nRow + "_0");
			focusInfo.focusedTd = focusedObj;
			gridObj.focusedCell.push(focusInfo);
			
			gridObj.applyFocusedCellIn(focusedObj, true);
		} else if(bCheck == false && rtnVal) {
			for(var i=0; i<gridObj.focusedCell.length; i++){
				if(gridObj.focusedCell[i].focusedRowIndex == nRow){
					gridObj._applyFocusedCellOut(gridObj.focusedCell[i]);
					gridObj.focusedCell.splice(i, 1);
				}
			}
		}
		
		return rtnVal;
	} catch (e) {
		ngmf._error("[ngmf.selectRow] Exception :: ", e);
	}
}; 

/**
 * Column의 Property 값을 설정하는 API 입니다.
 * @date 2016-04-30
 * @memberOf ngmf
 * @param {String / Object} gridId    :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {Integer} nColIdx           :: I :: N ::  :: 얻고자 하는 Column의 Index.
 * @param {String} strPropID          :: I :: N ::  :: 얻고자 하는 Column의 Property 명
 * @param {Integer / String} strValue :: I :: N ::  :: Column Property 설정값
 * @author 조지용
 * @useMobile use
 * @example ngmf.setColProp("grd_msg", 1, "width", "100");
 * @exampleAsIs Grid0.SetColProp(1,"Width",50);
 */
ngmf.setColProp = function(gridId, nColIdx, strPropId, strValue){
	try{
		var gridObj = ngmf.object(gridId);
		
		if ( typeof gridObj == "undefined" || gridObj ==  null || gridObj === "") {
			return;
		}
		
 		var colID = gridObj.getColumnID(nColIdx);
 		var prop = strPropId;
 		var res;
 		prop = prop.toLowerCase();
 		switch( prop ){
 			case "style" : 
 				strValue = strValue.toLowerCase();
 				
 				if(strValue == "fix"){
	 				if(gridObj.getFixedColumnLastIndex() < nColIdx+1){
	 					gridObj.setFixedColumn(nColIdx+1);
	 				}
 				} else if(strValue == "null"){
 					if(gridObj.getFixedColumnLastIndex() == nColIdx+1){
 						gridObj.setFixedColumn(nColIdx);
	 				}
 				} 				
 				break;
 			case "fix" : 
 				if(strValue){
	 				if(gridObj.getFixedColumnLastIndex() < nColIdx+1){
	 					gridObj.setFixedColumn(nColIdx+1);
	 				}
 				} else if(!strValue){
 					if(gridObj.getFixedColumnLastIndex() == nColIdx+1){
 						gridObj.setFixedColumn(nColIdx);
	 				}
 				} 				
 				break;
 			case "width" : 
 				gridObj.setColumnWidth(colID, strValue);
 				break;
 			default : break;
 		}
 		
 		ngmf.gridRedraw(gridId, true);
 		
	} catch (e) {
		ngmf._error("[ngmf.setColProp] Exception :: ", e);
	}
};

/**
 * TreeView항목의 Dataset Row로 부터, TreeView항목의 계층구조상 Path를 구하는 API입니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String / Object} treeObj :: I :: N ::  :: 대상 treeView 컴포넌트 ID
 * @param {Integer} nRow            :: I :: N ::  :: TreeView항목의 Dataset Row
 * @return {String} TreeView항목의 계층구조상 Path
 * @author 조지용
 * @useMobile use
 * @example ngmf.getItemPath(tv_treeView1, 3)
 * @exampleAsIs GetItemPath(nRow);
 */
ngmf.getItemPath = function(treeId, nRow){
	try{
		var comp = ngmf.object(treeId);

		if ( typeof comp == "undefined" || comp ==  null || comp === "") {
			return;
		}
		
		if(comp.getPluginName() != "treeview") {
			return;
		}
		
		var dsInfo = comp.getDataListInfo();
		
		if ( typeof dsInfo == "undefined" || dsInfo ==  null || dsInfo === "") {
			return;
		}

		var dsObj = ngmf.object(dsInfo.id);
		
		//path를 만들기 위한 row정보
		var pathArr = [];
		var pathRow = nRow;

		while(true) {
			if(pathRow >= 0) {
				pathArr.splice(0, 0, pathRow);
			} else {
				break;
			}
			
			if(ngmf.isRoot(comp, pathRow)){
				break;
			} else {
				pathRow = ngmf.getParentRow(comp, pathRow);
			}
		}
		
		
		var rtnVal = [];
		var colDepth = comp.tree.dataPath.depth;
		var nStartRow = 0;
		
		//path 생성
		for(var i=0; i<pathArr.length; i++) {
			var pathRow = pathArr[i];
			var colDepthVal = dsObj.getCellData(pathRow-1, colDepth);
			
			var matchArr = dsObj.getMatchedIndex(colDepth, colDepthVal, true, nStartRow, pathRow);
			nStartRow = pathArr[i];
			
			for(var j=0; j<matchArr.length; j++){
				if(matchArr[j] == pathRow-1) {
					rtnVal.push(j);
					break;
				}
			}
		}
		return rtnVal.join(".");
		
	} catch (e) {
		ngmf._error("[ngmf.getItemPath] Exception :: ", e);
	}
};

/**
 * TreeView의 한개의 항목에 대해서 펼침상태를 변경하는 API입니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String / Object} treeObj :: I :: N ::      :: 대상 treeView 컴포넌트 ID
 * @param {Number / String} nRow    :: I :: N ::      :: 펼침상태를 변경할 항목의 인덱스(1부터 시작). 또는 Path
 * @param {Boolean} bExpand         :: I :: N :: true :: 펼칠지 여부
 * @author 조지용
 * @useMobile use
 * @example ngmf.expandItem("tv_treeview", 2, true);
 * @exampleAsIs ExpandItem(2,true);
 */
ngmf.expandItem = function(treeId, nRow, bExpand){
	try{
		var comp = ngmf.object(treeId);
		
		if ( typeof comp == "undefined" || comp ==  null || comp === "") {
			return;
		}
		
		if(comp.getPluginName() != "treeview") {
			return;
		}
		
		if (typeof bExpand == "undefined") {
			bExpand = true;
		}
		
		var rowIndex = -1;
		if(typeof nRow == "number"){
			rowIndex = nRow;
		} else if(typeof row == "string"){
			rowIndex = ngmf.getItemRow(comp, nRow);
		}
			
		comp.spanNode(rowIndex, bExpand);
		
	} catch (e) {
		ngmf._error("[ngmf.expandItem] Exception :: ", e);
	}
};

//miplatform colorCode return
ngmf._getColorCode = function(str){
	if( str.indexOf("#") == 0 ) {
		return str;
	}

 	var codeList = {
		user0 : "#e1e1e1",
		user1 : "#b3b3b3",
		user2 : "#f9f9f9",
		user3 : "#9a9a9a",
		user4 : "#c8c8c8",
		user5 : "#ffffff",
		user6 : "#adadad",
		user7 : "#bdbdbd",
		user8 : "#efefef",
		user9 : "#d9d9d9",
		user10 : "#586884",
		user11 : "#f0f0f0",
		user12 : "#d9e5fc",
		SCROLLBAR : "#d4d0c8",
		BACKGROUND : "#008081",
		ACTIVECAPTION : "#004be3",
		INACTIVECAPTION : "#7693df",
		MENU : "#ffffff",
		WINDOW : "#ffffff",
		WINDOWFRAME : "#000000",
		MENUTEXT : "#000000",
		WINDOWTEXT : "#000000",
		CAPTIONTEXT : "#ffffff",
		ACTIVEBORDER : "#d4d0c8",
		INACTIVEBORDER : "#d4d0c8",
		APPWORKSPACE : "#808080",
		HIGHLIGHT : "#2366c5",
		HIGHLIGHTTEXT : "#ffffff",
		BTNFACE : "#ece9d8",
		BTNSHADOW : "#aca899",
		GRAYTEXT : "#aca899",
		BTNTEXT : "#000000",
		INACTIVECAPTIONTEXT : "#d7e3f8",
		BTNHIGHLIGHT : "#ffffff",
		DKSHADOW : "#716f64",
		LIGHT3D : "#f1efe2",
		INFOTEXT : "#000000",
		INFOBK : "#ffffe1",
		aliceblue : "#eff8ff",
		antiquewhite : "#fbebd7",
		aqua : "#00ffff",
		aquamarine : "#75ffd6",
		azure : "#efffff",
		beige : "#f5f6dc",
		bisque : "#ffe5c4",
		black : "#000000",
		blanchedalmond : "#ffeccd",
		blue : "#0000ff",
		blueviolet : "#8908e1",
		brown : "#a92725",
		burlywood : "#e0b986",
		cadetblue : "#5a9ea1",
		chartreuse : "#79ff1f",
		chocolate : "#d66915",
		coral : "#ff7e4b",
		cornflower : "#5c92ed",
		cornsilk : "#fff9dc",
		crimson : "#e10236",
		cyan : "#00ffff",
		darkblue : "#00008b",
		darkcyan : "#008b8c",
		darkgoldenrod : "#bb8704",
		darkgray : "#a9a9a9",
		darkgreen : "#006607",
		darkkhaki : "#beb86b",
		darkmagenta : "#8d008a",
		darkolivegreen : "#556c30",
		darkorange : "#ff8c00",
		darkorchid : "#9a20cb",
		darkred : "#8e0000",
		darksalmon : "#ed9678",
		darkseagreen : "#8dbd8c",
		darkslateblue : "#46398b",
		darkslategray : "#2d4f4f",
		darkturquoise : "#00cfd2",
		darkviolet : "#9400d2",
		deeppink : "#ff0090",
		deepskyblue : "#00bdff",
		dimgray : "#696969",
		dodgerblue : "#008cff",
		firebrick : "#b61e1a",
		floralwhite : "#fffaf0",
		forestgreen : "#168d26",
		fuchia : "#ff00fd",
		gainsboro : "#dcdcdc",
		ghostwhite : "#f8f8ff",
		gold : "#ffd900",
		goldenrod : "#dda61d",
		gray : "#808080",
		green : "#00820c",
		greenyellow : "#abff38",
		honeydew : "#effff0",
		hotpink : "#ff64b2",
		indianred : "#d15a59",
		indigo : "#4b0082",
		ivory : "#fffff0",
		khaki : "#f2e88c",
		lavender : "#e6e5fa",
		lavenderblush : "#fff0f5",
		lawngreen : "#76ff1f",
		lemonchiffon : "#fffbcd",
		lightblue : "#aad8e6",
		lightcoral : "#f47f7e",
		lightcyan : "#deffff",
		lightgoldenrodyellow : "#fbfbd2",
		lightgreen : "#8cf092",
		lightgrey : "#d3d3d3",
		lightpink : "#ffb5c0",
		lightsalmon : "#ffa078",
		lightseagreen : "#00b3ab",
		lightskyblue : "#80cdfa",
		lightslategray : "#768899",
		lightsteelblue : "#aec3de",
		lightyellow : "#ffffe0",
		lime : "#00ff22",
		limegreen : "#1ed039",
		linen : "#fbf0e6",
		magenta : "#ff00fd",
		maroon : "#830000",
		mediumaquamarine : "#5eceab",
		mediumblue : "#0000cd",
		mediumorchid : "#bc4cd2",
		mediumpurple : "#926bda",
		mediumseagreen : "#30b573",
		mediumslateblue : "#7861ee",
		mediumspringgreen : "#00fd9d",
		mediumturquoise : "#35d2cd",
		mediumvioletred : "#cb0083",
		midnightblue : "#131070",
		mintcream : "#f5fffa",
		mistyrose : "#ffe4e1",
		moccasin : "#ffe5b5",
		navajowhite : "#ffdfad",
		navy : "#000080",
		oldlace : "#fef5e6",
		olive : "#818203",
		olivedrab : "#6a9026",
		orange : "#ffa600",
		orangered : "#ff4200",
		orchid : "#dc6ad5",
		palegoldenrod : "#efe9aa",
		palegreen : "#93fe9a",
		paleturquoise : "#abeeef",
		palevioletred : "#de6e91",
		papayawhip : "#fff0d5",
		peachpuff : "#ffdab9",
		peru : "#d0863c",
		pink : "#ffbfca",
		plum : "#df9ddc",
		powderblue : "#ade0e6",
		purple : "#82007f",
		red : "#ff0000",
		rosybrown : "#be8f8e",
		royalblue : "#3663e1",
		saddlebrown : "#8e450d",
		salmon : "#fe7f6f",
		sandybrown : "#f8a55e",
		seagreen : "#258c58",
		seashell : "#fff5ee",
		sienna : "#a3522a",
		silver : "#c0c0c0",
		skyblue : "#81ceeb",
		slateblue : "#6754cd",
		slategray : "#6f8090",
		snow : "#fffafa",
		springgreen : "#00ff83",
		steelblue : "#3e81b4",
		tan : "#d4b58c",
		teal : "#008081",
		thistle : "#d9bed8",
		tomato : "#ff6141",
		turquoise : "#24e1d1",
		violet : "#f07ced",
		wheat : "#f7dfb3",
		white : "#ffffff",
		whitesmoke : "#f5f5f5",
		yellow : "#ffff0d",
		yellowgreen : "#99d037"
	}

	var colorCode = codeList[str] || "#ffffff";
 	return colorCode;
 };

 /**
 * 그리드의 해당셀의 ViewType 모양을 변경하는 함수.
 * 그리드 셀이 편집중인 상태가 아닐때 기본 형태로 보여질지, 아니면 icon을 표시하는 형태로 보여지질 결정하는 타입 
 * @date 2016-05-31
 * @memberOf ngmf
 * @param {String / Object} gridId  :: I :: N ::  :: 대상 gridView 컴포넌트 ID
 * @param {Integer} rowIndex        :: I :: N ::  :: 설정 Row의 Index.
 * @param {String / Integer} column :: I :: N ::  :: 설정 Column의 Index 또는 ColumnId.
 * @param {Boolean} type             :: I :: N ::  :: 설정 ViewType 설정 (초기값 : false) [true : "icon", false : "default"]
 * @return {String} 설정 성공 여부. (성공 : "1" , 실패 "")
 * @author 이동규
 * @useMobile use
 * @example ngmf.setCellViewType("grd_test1", 0, 0, true);
 */
ngmf.setCellViewType = function (gridId, rowIndex, column, type) {
	var result = "";
	try {
		var comp = ngmf.object(gridId);
		if (comp) {
			var gridCnt = comp.getRowCount();
			var colId = comp.getColumnID(column);
			if (gridCnt > rowIndex && colId) {
				var viewType = (typeof type != "undefined") ? WebSquare.util.getBoolean(type) : comp.getCellOption(0,0, "viewType");
				if (viewType != "default" && viewType != "" && viewType) {
					viewType = "icon";
				} else {
					viewType = "default";
				}
				
				if (viewType != comp.getCellOption(rowIndex, column, "viewType")) {
					comp.setCellOption(rowIndex, column, "viewType", viewType);
				}
				result = "1";
			}
		}
	} catch(e) {
		ngmf._error("[ngmf._getFooterCellProp] Exception :: ", e);
	}
	return result;
};


/**
 * 그리드의 scroll위치를 셋팅하는 API입니다.
 * @date 2016-05-24
 * @memberOf ngmf
 * @param {String / Object} gridId  :: I :: N ::   :: 대상 gridView 컴포넌트 ID
 * @param {Number} nRow             :: I :: Y :: 0 :: 그리드 row 포지션(시작값 0)
 * @author 조지용
 * @update 2016.07.21 성일호 그리드 Height 값 가져오는 로직 및 기본값 적용
 * @useMobile use
 * @example ngmf.setGridScrollTop("grd_msg", 10);
 */
ngmf.setGridScrollTop = function(gridId, nRow){
	try{
		var grdObj = ngmf.object(gridId);
		
		if ( typeof grdObj == "undefined" || grdObj ==  null || grdObj === "") {
			return;
		}
		
		if ( typeof nRow == "undefined" || nRow ==  null || nRow === "") {
			nRow = 0;
		}
		
		if(grdObj.getRowCount() > 0) {
			//Height 강제 적용된 경우 적용값 읽어 옴
			var gridTd = $("#" + grdObj.getID() + "_cell_0_0");
			var columnStyle = gridTd[0].getAttribute("style");
			var styles = ngmf.split2(columnStyle, ";", ":");
			var height = 0;
			for(var i=0; i<styles.length; i++) {
				var style = styles[i];
				if(style[0] != null && ngmf.toUpper(style[0]).trim() == "HEIGHT") {
					height = parseInt(style[1].replace("px",""), 10);
					break;
				}
			}
			
			if(height > 0) {
				grdObj.setScrollTop(nRow * height);
			} else  grdObj.setScrollTop(nRow * grdObj.getCellSize(0,0,"height") ); // 기본 defaultCellHeight  적용.
		}
	} catch (e) {
		ngmf._error("[ngmf.setGridScrollTop] Exception :: ", e);
	}
};

/**
 * TreeView의 전체 Item과 Bind되는 Dataset의 ID를 설정 하거나, 설정된 Dataset의 ID를 확인하는 API 입니다.
 * @date 2016-06-29
 * @memberOf ngmf
 * @param {String / Object} treeView   :: I :: N ::   :: 대상 treeView 컴포넌트 ID
 * @param {String / Object} dataList   :: I :: N ::   :: DataSet의 dataList 컴포넌트 ID
 * @param {Object}          bindOption :: I :: Y ::   :: treeView bind Column 정의 옵션.[default : treeView 설정값]
 *          bindOption.depth    :: I :: Y ::   :: treeView 의 bind Dataset의 depth column 설정.
 *          bindOption.label    :: I :: Y ::   :: treeView 의 bind Dataset의 label column 설정.
 *          bindOption.value    :: I :: Y ::   :: treeView 의 bind Dataset의 value column 설정.
 *          bindOption.checkbox :: I :: Y ::   :: treeView 의 bind Dataset의 checkbox column 설정.
 * @author 이동규
 * @useMobile use
 * @example var bindOption = {depth : "depthCol", value : "valueCol", label : "labelCol", checkbox:"checkboxCol"};
 * @example ngmf.bindDataSet("trv_treeview", "dsl_dataList", bindOption);
 * @exampleAsIs trv_treeview.BindDataSet = dsl_dataList;
 */
ngmf.bindDataSet = function(comp, dataList, bindOptions) {
	try {
		var comp = ngmf.object(comp);
		var dataComp = ngmf.object(dataList);

		if (typeof comp != "undefined" && comp.getPluginName) {
			if (typeof dataComp != "undefined" && dataComp.getInitializeType() == "dataList") {
				ngmf._bindDataSet(comp, dataComp, comp.getPluginName(), false, bindOptions);
			} else {
				return ngmf._bindDataSet(comp, "", comp.getPluginName(), true);
			}
		}
	} catch(e) {
		ngmf._error("[ngmf.bindDataSet] Exception :: ", e);
	}
};

ngmf._bindDataSet = function(treeview, datalist, pluginName, get, bindOptions) {
	try {
		switch(pluginName) {
			case "treeview" :
				if (get) {
					var dataInfo = treeview.getDataListInfo();
					if (dataInfo && typeof dataInfo.id != "undefined") {
						var getDataList = ngmf.object(dataInfo.id);
						return getDataList.getID();
					}
				} else {
					if (typeof bindOptions != "undefined") {
						treeview.setNodeSet("data:" + datalist.getID(), bindOptions);
					} else {
						var oldBindDataInfo = treeview.getDataListInfo();
						var setbindData = {};
						if (oldBindDataInfo) {
							setbindData.label = oldBindDataInfo.label;
		        			setbindData.value = oldBindDataInfo.value;
						}

						if (treeview.tree && treeview.tree.xpath && typeof treeview.tree.xpath.depth != "undefined") {
							setbindData.depth = treeview.tree.xpath.depth.split("/@")[0];
						}
						if (treeview.tree && treeview.tree.checkbox && typeof treeview.tree.checkbox.xpath != "undefined") {
							setbindData.checkbox = treeview.tree.checkbox.xpath.split("/@")[0];
						}
						treeview.setNodeSet("data:" + datalist.getID(), setbindData);					
					}
				}
			break;
			case "gridview" :
			break;
		}
	} catch(e) {
		ngmf._error("[ngmf.bindDataSet] Exception :: ", e);
	}
};