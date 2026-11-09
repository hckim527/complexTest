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

pubComm._setSwtichSize = function (compId) {
	var switchComp = ngmf.object(compId);
    var showCaseIdx = switchComp.getSelectedIndex();
    var switchCase = switchComp.getChildren()[showCaseIdx];
    var setWidth = $("#"+switchCase.id).outerWidth();
    $("#"+switchComp.id).css("width", setWidth);
};

pubComm._addSwtichSize = function (compId) {
	var switchComp = ngmf.object(compId);
    var showCaseIdx = switchComp.getSelectedIndex();
    var switchCase = switchComp.getChildren()[showCaseIdx];
    var addWidth = $("#"+switchCase.id).outerWidth();
    var flag = true;
    var target = switchComp.parentControl;
    while(flag) {
    	var parentControlTg = target.render.tagName;
    	if (ngmf.toUpper(parentControlTg) == "TABLE") {
    		flag = false;
    		var parentWidth = $("#"+target.id).outerWidth();
    		var setWidth = parentWidth + addWidth;
    		$("#"+target.id).css("width", setWidth);
    	} else {
    		target = target.parentControl;
    	}
    }
    $("#"+switchComp.id).css("width", addWidth);
};

/**
 * showSubGrp 입력된 group의 ID를 show 합니다.
 * @date 2015.12.15
 * @memberOf pubComm
 * @param {String/Object} show :: I :: N ::  :: 정의할 groupID
 * @author 이동규
 * @sync true
 * @useMobile use
 * @example pubComm.showSubGrp("grp_01");
 * @exampleAsIs
 */
pubComm.showSubGrps = function (compId) {
	try {
		var grpComp = ngmf.object(compId);
		if (grpComp.getPluginName && grpComp.getPluginName() == "group")
			grpComp.show();
	} catch(e) {
    	ngmf._error("[pubComm.showSubGrps] Exception :: ", e);
	}
};

/**
 * hideAllSubGrp 입력된 group의 ID의 하위 group들을 모두 hide 처리 합니다.
 * @date 2015.12.15
 * @memberOf pubComm
 * @param {String/Object} compId :: I :: N ::  :: hide처리를 할 상위 groupID
 * @author 이동규
 * @sync true
 * @useMobile use
 * @example pubComm.hideAllSubGrp("grp_01");
 * @exampleAsIs
 */
pubComm.hideAllSubGrp = function(compId) {
	try {
		var grpArr =  ngmf.object(compId).childControlList;
		for (var i = 0 ; i < grpArr.length ; i++) {
			if (grpArr[i].getPluginName && grpArr[i].getPluginName() == "group") {
				grpArr[i].hide();
			}
		}
	} catch(e) {
    	ngmf._error("[pubComm.hideAllSubGrp] Exception :: ", e);
	}
};

/*
pubComm._getInputComperent = function(id) {
	try {
		var tableComp =ngmf.object(id);

		var options = {
			excludPlugin : "body group trigger textbox output calendar image span anchor pageInherit wframe itemTable tabcontrol",
			recursive : true
		};

		var objArr = WebSquare.util.getChildren( tableComp , options );
		var inputArr = new Array();
		for (var i =0; i < objArr.length ; i++ ) {
			if (objArr[i].getPluginName() == "input" || objArr[i].getPluginName() == "select") {
				inputArr.push(objArr[i]);
			}
		}

		return inputArr;
	} catch(e) {
    	ngmf._error("[pubComm.getInputComperent] Exception :: ", e);
	}
};
*/

/**
 * pubComm.tableHeightSet 테이블의 같은 Tr 내부의 TD내부 테이블들의 높이를 자동 설정해주는 API 입니다.
 * @date 2015.12.15
 * @memberOf pubComm
 * @param {String} id :: I :: Y ::   :: 테이블의 같은 Tr 내부의 TD내부 테이블들의 높이를 자동 설정 테이블ID.
 * @author 이동규
 * @sync true
 * @useMobile use
 * @example pubComm.tableHeightSet();
 * @exampleAsIs
 */
pubComm.tableHeightSet = function(id) {
	try {
		var tableComp =$w.comp[id];
		var options = {
			excludPlugin : "group trigger textbox output calendar image span anchor pageInherit wframe itemTable tabcontrol",
			recursive : false
		};
		var objArr = WebSquare.util.getChildren( tableComp , options );

		for (var i = 0 ; i < objArr.length ; i++) {
			var render = objArr[i].render;
			if (render.getElementsByTagName("tr").length > 0) {
				var trTag = render.getElementsByTagName("tr");
				for (var j = 0; j < trTag.length ; j++) {
					var tdTag = trTag[j].children;
					var tdTags = new Array();

					if (tdTag.length > 1) {
						var tdHeigth = [];
						for ( var k = 0 ; k < tdTag.length ; k++) {
							tdTags[k] = new Array();
							if ( tdTag[k].childElementCount == 1 && tdTag[k].children[0].tagName.toUpperCase() === "DIV") {
								tdHeigth.push(tdTag[k].children[0].offsetHeight);
							}
							if ( tdTag[k].childElementCount >  1) {
								var height = 0;
								for (var l = 0 ; l < tdTag[k].childElementCount; l++) {
									var div = tdTag[k].children[l];
									if (div.tagName.toUpperCase() === "DIV") {
										tdTags[k][l] = div;
										if ( l == 0) {
											height += div.offsetHeight;
										} else {
										 	var mT = div.getAttribute("class").split("mt")[1];
										 	if (typeof mT !== "undefined") {
										 		height += WebSquare.util.getNumber(mT);
										 	}
										 	height += div.offsetHeight;
										}
									}
								}
								tdHeigth.push(height);
							}
						}

						var maxHeight = 0;
						for (var h = 0 ; h < tdHeigth.length ; h++) {
							if ( maxHeight < tdHeigth[h]) {
								maxHeight = tdHeigth[h];
							}
						}
						for (var m = 0 ; m < tdHeigth.length ; m++) {
							if (tdHeigth[m] !== maxHeight && tdTag[m].tagName.toUpperCase() === "TD") {
								if (tdTag[m].childElementCount > 1) {
									if (tdTags.length == 0 ) {
										$(tdTag[m].children).css("height",maxHeight);
									} else{
										var restHeight = maxHeight - tdHeigth[m];
										var shareHeight = restHeight / tdTags[m].length;
										for ( var n = 0 ; n < tdTags[m].length; n++) {
											var offsetHeight = tdTags[m][n].offsetHeight;
											$(tdTags[m][n]).css("height", offsetHeight+shareHeight);
										}
									}
								} else {
									$(tdTag[m].children).css("height",maxHeight);
								}
							}
						}
					}
				}
			}
		}
	} catch(e) {
    	ngmf._error("[pubComm.tableHeightSet] Exception :: ", e);
	}
};
 
/**
 * OverLayer 그룹을 설정하는 API 입니다.
 * @date 2015.12.22
 * @param {String/Object} btnComp :: I :: Y ::   :: OverLayer 속성을 정의할 버튼
 * @param {String/Object} target  :: I :: Y ::   :: OverLayer의 target 그리드Id
 * @param {Number} width          :: I :: Y ::   :: OverLayer 할 width의 크기
 * @param {Number} height         :: I :: Y ::   :: OverLayer 할 height의 크기
 * @param {Boolean} btmoption         :: I :: Y :: false  :: OverLayer UP 시 Bottom 5px 미적용
 * @author 이동규
 * @update 2016.05.09 이동규 setStyle 의 height 를 조정할 경우 gridView는 setStyle이 아닌 setGridHeight를 적용한다.
 * @update 2016.06.20 이동규 테이블의 class에 따라 (tbl_lo : 1개, tbl_lo1 :2개) td 디자인에 따른 border 계산 오류 수정.
 * @update 2016.09.30 이동규 테이블의 class처리를 switch 구문을 if-else 구문으로 수정.
 * @sync true
 * @useMobile use
 * @example pubComm.setOverLayer(btnComp, target, width, height);
 * @exampleAsIs
 */ 
pubComm.setOverLayer = function (btnComp, target, width, height, btmoption) {
	try {		
		var comp = ngmf.object(btnComp);
		var targetComp = ngmf.object(target);

		if (typeof comp !== "undefined" && typeof targetComp != "undefined") {
			var btnClass = ngmf.trim(comp.getClass());
			var findData =  pubComm._findgrpBoxContent(targetComp);
			var grpboxComp = findData[0];
			var tdComp = findData[1];
			var tdHeight = findData[2];
			var tdWidth = findData[3];
			var trComp = tdComp.parentControl;
			
			if (ngmf.toLower(btnClass).indexOf("btn_exp_d") > -1) {
				var tposStr = pubComm._getTablePosition(tdComp);
				var tdLen = tdComp.render.parentNode.childNodes.length;
				if(Math.round(ngmf.parseFloat(targetComp.getStyleValue("height")))< ngmf.parseFloat(height)) {
					targetComp.setUserData("originalHeight", ngmf.parseFloat(targetComp.getStyleValue("height")));
					if (targetComp.getPluginName() == "gridView") {
						targetComp.setGridHeight(ngmf.parseFloat(height) + "px");
					} else {
						targetComp.setStyle( "height" , ngmf.parseFloat(height) + "px" );
					}
					pubComm._setHeight(grpboxComp, height);
					grpboxComp.setStyle( "position" , "absolute" );
					var borderWidth = tdWidth;
					var borderHeight = tdHeight;
					if(borderWidth) {
						borderWidth = Number(borderWidth.replace("px","")) -2 + "px";
					}
					if(borderHeight) {
						if (tdLen > 1) {
							borderHeight = Number(borderHeight.replace("px","")) - 12 + "px";
						} else {
							borderHeight = Number(borderHeight.replace("px","")) - 2 + "px";
						}
					}
					
					grpboxComp.setStyle( "width" , borderWidth );
					pubComm._setTablePositionUpDown (grpboxComp, tposStr, "0");
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), true);
					tdComp.setStyle("height", borderHeight);
					$("#"+comp.id).removeClass("btn_exp_d");
					$("#"+comp.id).addClass("btn_exp_u_on");
					ngmf.addClass(grpboxComp.getID(), "overlayer_border");
				} else {
					pubComm._setHeight(grpboxComp, targetComp.getUserData("originalHeight"));
					
					if (targetComp.getPluginName() == "gridView") {
						targetComp.setGridHeight(targetComp.getUserData("originalHeight") + "px");
					} else {
						targetComp.setStyle( "height" , targetComp.getUserData("originalHeight") + "px");
					}

					grpboxComp.setStyle( "position" , "" );
					grpboxComp.setStyle( "width" , "" );
					pubComm._setTablePositionUpDown (grpboxComp, tposStr, "");
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), false);
					tdComp.setStyle("height", "");
					$("#"+comp.id).removeClass("btn_exp_u_on");
					$("#"+comp.id).addClass("btn_exp_d");
					ngmf.removeClass(grpboxComp.getID(), "overlayer_border");
				}
			} else if (ngmf.toLower(btnClass).indexOf("btn_exp_u") > -1) {
				var tposStr = pubComm._getTablePosition(tdComp);
				var tdLen = tdComp.render.parentNode.childNodes.length;
				if(Math.round(ngmf.parseFloat(targetComp.getStyleValue("height")))< ngmf.parseFloat(height)) {
					targetComp.setUserData("originalHeight", ngmf.parseFloat(targetComp.getStyleValue("height")));
					if (targetComp.getPluginName() == "gridView") {
						targetComp.setGridHeight(ngmf.parseFloat(height) + "px");
					} else {
						targetComp.setStyle( "height" , ngmf.parseFloat(height) + "px" );
					}
					pubComm._setHeight(grpboxComp, ngmf.parseFloat(height));
					var borderWidth = tdWidth;
					var borderHeight = tdHeight;
					if(borderWidth) {
						borderWidth = Number(borderWidth.replace("px","")) -2 + "px";
					}
					if(borderHeight) {
						if (tdLen > 1) {
							borderHeight = Number(borderHeight.replace("px","")) - 12 + "px";
						} else {
							borderHeight = Number(borderHeight.replace("px","")) - 2 + "px";
						}
					}

					grpboxComp.setStyle( "position" , "absolute" );
					grpboxComp.setStyle( "width" , borderWidth );
					pubComm._setTablePositionUpDown (grpboxComp, tposStr, "0");						
					grpboxComp.setStyle( "bottom" , "0px" ); 
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), true);
					tdComp.setStyle("height", borderHeight);
					$("#"+comp.id).removeClass("btn_exp_u");
					$("#"+comp.id).addClass("btn_exp_d_on");
					ngmf.addClass(grpboxComp.getID(), "overlayer_border");
				} else {
					pubComm._setHeight(grpboxComp, targetComp.getUserData("originalHeight"));

					if (targetComp.getPluginName() == "gridView") {
						targetComp.setGridHeight(targetComp.getUserData("originalHeight") + "px");
					} else {
						targetComp.setStyle( "height" , targetComp.getUserData("originalHeight") + "px");
					}

					grpboxComp.setStyle( "position" , "" );
					grpboxComp.setStyle( "width" , "" );
					pubComm._setTablePositionUpDown (grpboxComp, tposStr, "");
					grpboxComp.setStyle( "bottom" , "" );
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), false);
					tdComp.setStyle("height", "");
					$("#"+comp.id).removeClass("btn_exp_d_on");
					$("#"+comp.id).addClass("btn_exp_u");
					ngmf.removeClass(grpboxComp.getID(), "overlayer_border");
				}
			} else if (ngmf.toLower(btnClass).indexOf("btn_exp_r") > -1) {
				if(Math.round(ngmf.parseFloat(grpboxComp.getStyleValue("width")))< ngmf.parseFloat(width)-2) {
					grpboxComp.setStyle( "width" , ngmf.parseFloat(width-2) + "px" );
					grpboxComp.setStyle( "position" , "absolute" );
					grpboxComp.setStyle( "left" , "0" );
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), true);
					$("#"+comp.id).removeClass("btn_exp_r");
					$("#"+comp.id).addClass("btn_exp_l_on");
					ngmf.addClass(grpboxComp.getID(), "overlayer_border");
				} else {
					grpboxComp.setStyle( "width" , "");
					grpboxComp.setStyle( "position" , "" );
					grpboxComp.setStyle( "left" , "" );
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), false);
					$("#"+comp.id).removeClass("btn_exp_l_on");
					$("#"+comp.id).addClass("btn_exp_r");
					ngmf.removeClass(grpboxComp.getID(), "overlayer_border");
				}
			} else if (ngmf.toLower(btnClass).indexOf("btn_exp_l") > -1) {
				if(Math.round(ngmf.parseFloat(grpboxComp.getStyleValue("width"))) < ngmf.parseFloat(width)-2) {
					grpboxComp.setStyle( "width" , ngmf.parseFloat(width) + "px" );
					grpboxComp.setStyle( "position" , "absolute" );
					grpboxComp.setStyle( "right" , "0" );
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), true);
					$("#"+comp.id).removeClass("btn_exp_l");
					$("#"+comp.id).addClass("btn_exp_r_on");
					ngmf.addClass(grpboxComp.getID(), "overlayer_border");
				} else {
					grpboxComp.setStyle( "width" , "");
					grpboxComp.setStyle( "position" , "" );
					grpboxComp.setStyle( "right" , "" );
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), false);
					$("#"+comp.id).removeClass("btn_exp_r_on");
					$("#"+comp.id).addClass("btn_exp_l");
					ngmf.removeClass(grpboxComp.getID(), "overlayer_border");
				}
			} else if (ngmf.toLower(btnClass).indexOf("btn_fl_open") > -1) {
				var tposStr = pubComm._getTablePosition(tdComp);
				var tdLen = tdComp.render.parentNode.childNodes.length;
				if(Math.round(ngmf.parseFloat(grpboxComp.getStyleValue("width"))) < ngmf.parseFloat(width)-2 ||
					Math.round(ngmf.parseFloat(targetComp.getStyleValue("height"))) < ngmf.parseFloat(height)-2) {
					targetComp.setUserData("originalHeight", ngmf.parseFloat(targetComp.getStyleValue("height")));
					targetComp.setUserData("originalWidth", ngmf.parseFloat(targetComp.getStyleValue("width")));
					if (targetComp.getPluginName() == "gridView") {
						targetComp.setGridHeight(ngmf.parseFloat(height) + "px");
					} else {
						targetComp.setStyle( "height" , ngmf.parseFloat(height)-2 + "px" );
					}
					pubComm._setHeight(grpboxComp, height);
					grpboxComp.setStyle( "position" , "absolute" );
					var borderHeight = tdHeight;
					if(borderHeight) {
						if (tdLen > 1) {
							borderHeight = Number(borderHeight.replace("px","")) - 12 + "px";
						} else {
							borderHeight = Number(borderHeight.replace("px","")) - 2 + "px";
						}
					}
					grpboxComp.setStyle("width", ngmf.parseFloat(width)-2 +"px");
					pubComm._setTablePosition (grpboxComp, tposStr, "0");
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), true);
					tdComp.setStyle("height", borderHeight);
					$("#"+comp.id).removeClass("btn_fl_open");
					$("#"+comp.id).addClass("btn_fl_close_on");
					ngmf.addClass(grpboxComp.getID(), "overlayer_border");
				} else {
					pubComm._setHeight(grpboxComp, targetComp.getUserData("originalHeight"));
					if (targetComp.getPluginName() == "gridView") {
						targetComp.setGridHeight(targetComp.getUserData("originalHeight") + "px");
					} else {
						targetComp.setStyle("height", targetComp.getUserData("originalHeight") + "px");
					}
					
					grpboxComp.setStyle("width", "");
					//grpboxComp.setStyle("width", targetComp.getUserData("originalWidth") +"px");
					grpboxComp.setStyle("width", "");
					grpboxComp.setStyle( "position" , "" );
					pubComm._setTablePosition (grpboxComp, tposStr, ""); 
					pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), false);
					$("#"+comp.id).removeClass("btn_fl_close_on");
					$("#"+comp.id).addClass("btn_fl_open");
					ngmf.removeClass(grpboxComp.getID(), "overlayer_border");
				}
			}
		}
	} catch(e){
		ngmf._error("[pubComm.setOverLayer] Exception :: ", e);
	}
};

pubComm._findgrpBoxContent = function(_child) {
	var findArr = new Array();
	try {		
		var child = _child;
		var tdHeight = "";
		if(child.getPluginName(""))
		while (!child.hasClass("grpbox")) {
			child = child.parentControl;
		}
		findArr.push(child); //0
		//tdHeight = $("#"+ child.parentControl.id).css("height");
		if ($("#"+ child.parentControl.id).length >0) {
			tdHeight = $("#"+ child.parentControl.id).innerHeight() + 12 + "px";
			findArr.push(child.parentControl); //1
		} else if(child.parentControl && child.parentControl._wTagName == "body") {
			tdHeight = $("#"+ child.parentControl.parentControl.id).innerHeight() + 2 + "px";
			findArr.push(child.parentControl.parentControl); //1
		}
		tdWidth = $("#"+ child.id).css("width");
		findArr.push(tdHeight); //2
		findArr.push(tdWidth); //3
	} catch(ex) {
    	ngmf._error("[pubComm.setOverLayer._findgrpBoxContent] Exception :: ", ex);
	}	
	return findArr;
};

pubComm._getTablePosition = function(tdComp) {	
	var sReturn = "";
	try {
		var trComp = tdComp.parentControl;
		var tblComp = trComp.parentControl;
		var rtot = -1;
		var ctot = -1;
		var rnum = -1;
		var cnum = -1;
		rtot = tblComp.childControlList.length;
		ctot = trComp.childControlList.length;
		for (var i = 0; i < rtot ; i ++) if ( tblComp.childControlList[i].id ==  trComp.id) { rnum = i ;  break;}
		for (var j = 0; j < ctot; j ++) if ( trComp.childControlList[j].id ==  tdComp.id) { cnum = j ;  break;}
		
		if(rnum == 0)  sReturn = "t";
		else if (rnum == rtot-1)  sReturn = "b";
		else sReturn = "m";

		if(cnum == 0)  sReturn += "l";
		else if (cnum == ctot-1)  sReturn += "r";
		else sReturn += "c";

	} catch(ex) {
    	ngmf._error("[pubComm.setOverLayer._getTablePosition] Exception :: ", ex);
	}
	return sReturn ;
};

pubComm._setHeight = function(targetObj, height) {
	try {
		//var parentObj = targetObj.parentControl;
		//var parentObj = _findgrpBoxContent(targetObj) ;
		var childObjets = targetObj.getChildren();
		if(childObjets.length > 0) {
			for (var i=0; i < childObjets.length ; i ++) {
				if(typeof childObjets[i].getPluginName == "function"  && childObjets[i].getPluginName()) {
					switch (childObjets[i].getPluginName().toLowerCase()) {
	    			case "group" :
	    					pubComm._setHeight(childObjets[i], height);
						break;
	    			case "switch" :
	    			case "accordion" :
	    			case "tabcontainer" :
	    			case "iframe" :
	    			case "wframe" :
							childObjets[i].setStyle( "height" , ngmf.parseFloat(height) + "px" );
	    					pubComm._setHeight(childObjets[i], height);
						break;
	    			case "gridview" :
							childObjets[i].setStyle( "height" , ngmf.parseFloat(height) + "px" );
						break;
					}
				}
			}
		}
	} catch(ex) {
    	ngmf._error("[pubComm.setOverLayer._setHeight] Exception :: ", ex);
	}
};

pubComm._setTablePositionUpDown = function(grpboxComp, posStr, style) {	
	var sReturn = "";
	try {
		if (!posStr) return;
		if (posStr.indexOf("l") > -1) grpboxComp.setStyle( "left" , style || "" );
		if (posStr.indexOf("r") > -1) grpboxComp.setStyle( "right" , style || "" );
	} catch(ex) {
    	ngmf._error("[pubComm.setOverLayer._setTablePositionUpDown] Exception :: ", ex);
	}
	return sReturn ;
};

pubComm._setTablePosition = function(grpboxComp, posStr, style) {	
	var sReturn = "";
	try {
		if (!posStr) return;
		if (posStr.indexOf("t") > -1) grpboxComp.setStyle( "top" , style || "" );
		if (posStr.indexOf("b") > -1) grpboxComp.setStyle( "bottom" , style || "" );
		if (posStr.indexOf("l") > -1) grpboxComp.setStyle( "left" , style || "" );
		if (posStr.indexOf("r") > -1) grpboxComp.setStyle( "right" , style || "" );
	} catch(ex) {
    	ngmf._error("[pubComm.setOverLayer._setTablePosition] Exception :: ", ex);
	}
	return sReturn ;
};

/**
 * OverLayer Z-index 관리 함수 (내부함수)
 * @date 2016.06.09
 * @param {String/Object} compId    :: I :: Y ::   :: OverLayer 속성을 정의할 버튼ID
 * @param {String/Object} grpCompId :: I :: Y ::   :: OverLayer의 target 그리드Id
 * @param {Boolean} btmoption       :: I :: Y ::   :: OverLayer 설정 Flag
 * @author 이동규
 * @sync true
 */
pubComm._setzIndexManager = function(compId, grpCompId, type) {
	try {
		var flag = WebSquare.util.getBoolean(type) ? true : false;
		if (typeof ngmf.object(grpCompId) == "undefined") {
			return;
		}
		if (flag) {//추가
			if(Object.keys(ngmv._overLayer).length > 0 ) {
				var overLayerObj = Object.keys(ngmv._overLayer);
				var len = overLayerObj.length;
				var lastZIndex= ngmv._overLayer[overLayerObj[len-1]].zIndex;
				if (lastZIndex + 1 < 4600) {
					
					ngmv._overLayer[compId] = {"grpCompId" : grpCompId , "zIndex" : lastZIndex + 1};

				} else {
					for (var i = 0 ; i < len; i++) {
						var grpComp = ngmf.object(ngmv._overLayer[overLayerObj[i]].grpCompId);
						var zIndex = 4500 + i;
						ngmv._overLayer[overLayerObj[i]].zIndex = zIndex;
						grpComp.setStyle( "z-index" , zIndex);
					}
					ngmv._overLayer[compId] = {"grpCompId" : grpCompId , "zIndex" : 4500 + len};
				}
			} else {
				ngmv._overLayer[compId] = {"grpCompId" : grpCompId , "zIndex" : 4500};
			}

			ngmf.object(grpCompId).setStyle( "z-index" , ngmv._overLayer[compId].zIndex);
		} else {//삭제
			delete ngmv._overLayer[compId];
			ngmf.object(grpCompId).setStyle( "z-index" , "" );
		}

	} catch(e) {
		ngmf._error("[pubComm._setzIndexManager] Exception :: ", e);
	}
};

/**
 * ExpandLayer 그룹을 설정하는 API 입니다.
 * @date 2016.23.
 * @param {String/Object} btnComp :: I :: Y ::   :: OverLayer 속성을 정의할 버튼
 * @param {String/Object} target  :: I :: Y ::   :: OverLayer의 target 그리드Id
 * @param {Number} height         :: I :: Y ::   :: OverLayer 할 height의 크기
 * @author 이동규
 * @sync true
 * @useMobile use
 * @example pubComm.expandLayer(btnComp, target, width, height);
 * @exampleAsIs
 */ 
pubComm.expandLayer = function (btnComp, target, height) {
	try {		
		var comp = ngmf.object(btnComp);
		var targetComp = ngmf.object(target);

		if (typeof comp !== "undefined" && typeof targetComp != "undefined") {
			var findData =  pubComm._findgrpBoxContent(targetComp);
			var grpboxComp = findData[0];
			var tdComp = findData[1];
			var tdHeight = findData[2];
			var tdWidth = findData[3];
			var trComp = tdComp.parentControl;

			var tposStr = pubComm._getTablePosition(tdComp);
			var tdLen = tdComp.render.parentNode.childNodes.length;
			if(Math.round(ngmf.parseFloat(targetComp.getStyleValue("height")))< ngmf.parseFloat(height)) {
				targetComp.setUserData("originalHeight", ngmf.parseFloat(targetComp.getStyleValue("height")));
				if (targetComp.getPluginName() == "gridView") {
					targetComp.setGridHeight(ngmf.parseFloat(height) + "px");
				} else {
					targetComp.setStyle( "height" , ngmf.parseFloat(height) + "px" );
				}
				pubComm._setHeight(grpboxComp, height);
				
				var borderWidth = tdWidth;
				var borderHeight = tdHeight;
				if(borderWidth) {
					borderWidth = Number(borderWidth.replace("px","")) -2 + "px";
				}
				if(borderHeight) {
					if (tdLen > 1) {
						borderHeight = Number(borderHeight.replace("px","")) - 12 + "px";
					} else {
						borderHeight = Number(borderHeight.replace("px","")) - 2 + "px";
					}
				}
				
				//grpboxComp.setStyle( "width" , borderWidth );
				pubComm._setTablePositionUpDown (grpboxComp, tposStr, "0");
				pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), true);
				tdComp.setStyle("height", borderHeight);
				$("#"+comp.id).removeClass("btn_exp_d");
				$("#"+comp.id).addClass("btn_exp_u_on");
				ngmf.addClass(grpboxComp.getID(), "overlayer_border");
				$("body").scrollTop($("#"+comp.id).offset().top - 20);
			} else {
				pubComm._setHeight(grpboxComp, targetComp.getUserData("originalHeight"));
				
				if (targetComp.getPluginName() == "gridView") {
					targetComp.setGridHeight(targetComp.getUserData("originalHeight") + "px");
				} else {
					targetComp.setStyle( "height" , targetComp.getUserData("originalHeight") + "px");
				}

				pubComm._setTablePositionUpDown (grpboxComp, tposStr, "");
//				grpboxComp.setStyle( "left" , "" );
//				grpboxComp.setStyle( "right" , "" );
				pubComm._setzIndexManager(comp.getID(), grpboxComp.getID(), false);
				tdComp.setStyle("height", "");
				$("#"+comp.id).removeClass("btn_exp_u_on");
				$("#"+comp.id).addClass("btn_exp_d");
				
				ngmf.removeClass(grpboxComp.getID(), "overlayer_border");
			}
		}
	} catch(e){
		ngmf._error("[pubComm.setOverLayer] Exception :: ", e);
	}
};

pubComm._pgMemoImage = function(btnComp, flag) {
	try {
		if (typeof ngmf.object(btnComp) != "undefined") {
			var onFlag = WebSquare.util.getBoolean(flag);
			if (onFlag) {
				ngmf.changeClass(btnComp, "btn_memo", "btn_memo_on");
			} else {
				ngmf.changeClass(btnComp, "btn_memo_on", "btn_memo");
			}
		}

	} catch(e) {
		ngmf._error("[pubComm._pgMemoImage] Exception :: ", e);
	}
};

pubComm._pgMemoLayer = function (btnComp, pgMemoObj, target) {
	try {
		if (typeof pgMemoObj.myWframeId != "undefined") {
			btnComp = pgMemoObj.myWframeId + "_" + btnComp;
		}

		var fltComp = ngmf.object("flt_pgMemoLayer"); 
		if (ngmf.isNull(fltComp) == "Y" || typeof fltComp == "undefined") {
			ngmf._createMemoLayer(btnComp, false, null, pgMemoObj, target);
		} else {
			if (typeof fltComp.op_memo_id != "undefined" && fltComp.btnId != btnComp) {
				if (fltComp.getStyle("display") == "none") {
					fltComp.show("");
				}
				
				fltComp.btnId = btnComp;
				fltComp.show_gb = pgMemoObj.show_gb;
				fltComp.svc_num = pgMemoObj.svc_num;
				fltComp.svc_mgmt_num = pgMemoObj.svc_mgmt_num;
				fltComp.op_memo_id = pgMemoObj.op_memo_id;
				fltComp.cont_grp_id = pgMemoObj.cont_grp_id;
				fltComp.chg_dt = pgMemoObj.chg_dt;
				fltComp.cont_hst_cd = pgMemoObj.cont_hst_cd;
				if (pgMemoObj.subScwin != "") {
					fltComp.subScwin = pgMemoObj.subScwin;
				} else if (pgMemoObj.subScwin == "") {
					fltComp.subScwin = "scwin"
				}
				if (target === "G") {
					fltComp.rowIndex = pgMemoObj.rowIndex;
					fltComp.colIndex = pgMemoObj.colIndex;
				}
				if (typeof pgMemoObj.show_gb != "undefined" && ngmf.toUpper(pgMemoObj.show_gb) == "M") {
					if (typeof ngmf.object(fltComp.getID() +"_btn_allMemo") != "undefined") {
						$("#"+fltComp.getID() +"_btn_allMemo").css("display","inline-block");
					}
				} else {
					if (typeof ngmf.object(fltComp.getID() +"_btn_allMemo") != "undefined") {
						$("#"+fltComp.getID() +"_btn_allMemo").css("display","none");
					}
					if (typeof ngmf.object(fltComp.getID() +"_btn_detailMemo") != "undefined") {
						$("#"+fltComp.getID() +"_btn_detailMemo").css("display","none");
					}
				}
				wfm_pgMemoLayer.btnId = fltComp.btnId;
				wfm_pgMemoLayer.show_gb = fltComp.show_gb;
				wfm_pgMemoLayer.svc_num = fltComp.svc_num;
				wfm_pgMemoLayer.svc_mgmt_num = fltComp.svc_mgmt_num;
				wfm_pgMemoLayer.op_memo_id = fltComp.op_memo_id;
				wfm_pgMemoLayer.cont_grp_id = fltComp.cont_grp_id;
				wfm_pgMemoLayer.chg_dt = fltComp.chg_dt;
				wfm_pgMemoLayer.cont_hst_cd = fltComp.cont_hst_cd;
				if (typeof fltComp.subScwin != "undefined") {
					wfm_pgMemoLayer.subScwin = fltComp.subScwin;
				}
				if (target === "G") {
					wfm_pgMemoLayer.rowIndex = fltComp.rowIndex;
					wfm_pgMemoLayer.colIndex = fltComp.colIndex;
				}
				
				if (typeof wfm_pgMemoLayer_scwin != "undefined" && 
					 typeof wfm_pgMemoLayer_scwin.set_memo_id == "function") {
					wfm_pgMemoLayer_scwin.set_memo_id(pgMemoObj);
				}

				var btnComp = ngmf.object(btnComp);
				var btnId = typeof btnComp.getID == "undefined" ?  btnComp.id : btnComp.getID();
				var btnOffset = $("#"+btnId).offset();
				var left = $("#"+btnId).offset().left - $("#"+fltComp.getID()).outerWidth();
				var top =  $("#"+btnId).offset().top - $("#"+fltComp.getID()).outerHeight() + $("#"+btnId).outerHeight();

				if (left < 0 ) {
					left = $("#"+btnId).offset().left + $("#"+btnId).outerWidth() + 10;
				} else {
					left -= 10;
				}
				if (top < 0 ) {
					top = $("#"+btnId).offset().top  - $("#"+btnId).outerHeight()/2;
					top = top > 0 ? top : 10;
				}

				fltComp.setStyle("left", left +"px");
				fltComp.setStyle("top", top +"px");

			} else {
				if (fltComp.getStyle("display") == "block") {
					fltComp.hide();
				} else {
					fltComp.show("");
				}
			}
		}
	} catch(e) {
		ngmf._error("[pubComm.pgMemoLayer] Exception :: ", e);
	}
};

pubComm._wgMemoLayer = function (btnComp, type, wgMemoId, size) {
	try {
		//type : "N" 위젯 (공지사항)
		//type : "M" 위젯 (메모)
		if (typeof GLD.wgMemoObject == "undefined") GLD.wgMemoObject = {};

		var fltComp = GLD.ngmf.object(wgMemoId); 
		if (ngmf.isNull(fltComp) == "Y" || typeof fltComp == "undefined") {
			var data = $("#"+btnComp).offset();
			var len = Object.keys(GLD.wgMemoObject).length;
			var type = typeof type == "undefined" ? "N" : ngmf.toUpper(type);
			var options = {
				left : data.left || 0,
				top : data.top || 0
			};

			if( typeof wgMemoId == "undefined" || wgMemoId == "") {
				var idLen = 0;
				for (var i in GLD.wgMemoObject) {
					if (GLD.wgMemoObject[0].indexOf("flt_wgMemoLayer__") > -1) {
						idLen++;
					}
				}
				options.id = "flt_wgMemoLayer__" + idLen;
				GLD.wgMemoObject[len] = options.id;
			} else {
				options.id = wgMemoId;
				GLD.wgMemoObject[len] = options.id;
			}

			GLD.ngmf._createMemoLayer(options , true, type);
		} else {
			if ( fltComp.getStyle("display") == "block") {
				 fltComp.hide();
			} else {
				 fltComp.show("");
			}
		}
	} catch(e) {
		ngmf._error("[pubComm.wgMemoLayer] Exception :: ", e);
	}
};

ngmf._createMemoLayer = function(obj, wiget, type, pgMemoObj, target) {
	try {
		var btnComp = ngmf.object(obj);
		var fltComp;

		if (wiget) {
			var zIndex = 8000;
			var options = {
				"style" : "position:absolute; z-index:"+ zIndex +";"
			};

			var fltComp = ngmf.create(obj.id, "floatingLayer", options);
			var btnOffset = btnComp;
			
			var htmlArr =[];
			var parentContent = $("#"+fltComp.getID()+"_contents")[0];
			var wfmComp = ngmf.create("wfm_wgMemoLayer"+"_"+fltComp.getID(), "wframe", {scope : "true"}, parentContent);
			
			fltComp.wfmLayer = "wfm_wgMemoLayer_"+fltComp.getID();
			fltComp.classType = type;
			fltComp.layerStatus = "default";
			if (type == "N") {
				ngmf.addClass(fltComp, "wg_floating_layer title4 maximum");
				htmlArr.push("<div id='' style='' class='w2group floatingLayer_header title4'>");
				htmlArr.push("<a id='' class='w2textbox '>공지사항</a>");
				htmlArr.push("<input type='button' tabindex='0' id='"+fltComp.getID() +"_btn_layerToastbar' class='w2trigger btn_minimum' value='토스트바'>");
				htmlArr.push("<input type='button' tabindex='0' id='"+fltComp.getID() +"_btn_layerClose' class='w2trigger btn_close' value='닫기'>");
				htmlArr.push("</div>");
				ngmf.setSrc(wfmComp.getID(), "AAT", "widget_notice_popup_inner");
			} else {
				ngmf.addClass(fltComp, "wg_floating_layer title3 default");
				htmlArr.push("<div id='' style='' class='w2group floatingLayer_header title3'>");
				htmlArr.push("<a id='"+fltComp.getID() +"_txt_layerToastbar' class='w2textbox '>메모</a>");
				htmlArr.push("<input type='button' tabindex='0' id='"+fltComp.getID() +"_btn_layerToastbar' class='w2trigger btn_minimum' value='토스트바'>");
				htmlArr.push("<input type='button' tabindex='0' id='"+fltComp.getID() +"_btn_layerMaxToastbar' class='w2trigger btn_resize' value='알림창'>");
				htmlArr.push("<input type='button' tabindex='0' id='"+fltComp.getID() +"_btn_layerClose' class='w2trigger btn_close' value='닫기'>");
				htmlArr.push("</div>");
				ngmf.setSrc(wfmComp.getID(), "AAT", "widget_memo_popup_inner");
			}
			ngmf.object(obj.id).setHeaderHTML(htmlArr.join(""));

			var left = btnOffset.left - $("#"+fltComp.getID()).outerWidth();
			var top =  btnOffset.top - $("#"+fltComp.getID()).outerHeight();

			if (left < 0) left = 0;
			if (top < 0) top = 0;

			fltComp.setStyle("left", 0 +"px");
			fltComp.setStyle("top", 0 +"px");

			if (fltComp.classType == "M") {
				$("#"+ fltComp.getID() +"_btn_layerMaxToastbar").bind("click", function() {
					if (this.className.indexOf("btn_resize") > -1) {
						fltComp.layerStatus = "minimum";
						ngmf.changeClass(fltComp.getID(), "default", "minimum");
						$("#"+this.id).removeClass("btn_resize");
						$("#"+this.id).addClass("btn_maximum");
						fltComp.setStyle("position", "static");
						document.getElementById("grp_toastArea").appendChild(document.getElementById(fltComp.getID()));
					} else if (this.className.indexOf("btn_maximum") > -1) {
						fltComp.layerStatus = "default";
						ngmf.changeClass(fltComp.getID(), "minimum", "default");
						$("#"+this.id).removeClass("btn_maximum");
						$("#"+this.id).addClass("btn_resize");
						fltComp.setStyle("position", "absolute");
						document.body.appendChild(document.getElementById(fltComp.getID()));
					}
				});
			}

			$("#"+ fltComp.getID() +"_btn_layerClose").bind("click", function() {
				for (var i in GLD.wgMemoObject) {
					if (GLD.wgMemoObject[i].indexOf(fltComp.getID()) > -1) {
						GLD.wgMemoObject[i] = GLD.wgMemoObject[i] + "_delete";
					}
				}
				ngmf.object(fltComp.wfmLayer).remove();
				fltComp.remove();
			});

			$("#"+ fltComp.getID() +"_btn_layerToastbar").bind("click", function() {
				if (fltComp.layerStatus == "minimum") {
					ngmf.addClass(fltComp.getID(), "min_toast");
				} else {
					fltComp.hide();
					var parentDiv = $(".toast_wrap")[0];
					var comp = ngmf.create(fltComp.getID() +"_miniToastbar", "group", {}, parentDiv);
					var titleValue;
					if (fltComp.classType == "N") {
						ngmf.addClass(comp.getID(), "toast_bar notice");
						titleValue = "공지사항";
					} else {
						ngmf.addClass(comp.getID(), "toast_bar memo");
						titleValue = "메모";
					}

					var textAnchor = ngmf.create(fltComp.getID() +"_miniToastbar_title", "anchor", {"outerDiv": false}, comp.render);
					textAnchor.parentId = fltComp.getID();
					textAnchor.setValue(titleValue);
					
					var closeBtn = ngmf.create(fltComp.getID() +"_miniToastbar_closeBtn", "trigger", {}, comp.render);
					closeBtn.parentId = fltComp.getID();
					ngmf.addClass(closeBtn.getID(), "btn_close");
					
					closeBtn.bind("onclick", function() {
						for (var i in GLD.wgMemoObject) {
							if (GLD.wgMemoObject[i].indexOf(fltComp.getID()) > -1) {
								GLD.wgMemoObject[i] = GLD.wgMemoObject[i] + "_delete";
							}
						}
						ngmf.object(fltComp.wfmLayer).remove();
						fltComp.remove();
						ngmf.object(this.parentId+"_miniToastbar").remove();
						ngmf.object(this.parentId+"_miniToastbar_title").remove();
						ngmf.object(this.parentId+"_miniToastbar_closeBtn").remove();
					});
			
					textAnchor.bind("onclick", function() {
						fltComp.show("");
						ngmf.object(this.parentId+"_miniToastbar_closeBtn").remove();
						ngmf.object(this.parentId+"_miniToastbar").remove();
						ngmf.object(this.parentId+"_miniToastbar_title").remove();
					});
				}
			});

			$("#"+fltComp.getID()+"_txt_layerToastbar").bind("click", function() {
				ngmf.removeClass(fltComp.getID(), "min_toast");
			});
		} else {
			var zIndex = 8000;
			var options = {
				"style" : "position:absolute; z-index:"+ zIndex +"; width:240px;"
			};

			fltComp = ngmf.create("flt_pgMemoLayer", "floatingLayer", options);
			fltComp.btnId = typeof btnComp.getID == "undefined" ?  btnComp.id : btnComp.getID();
			fltComp.show_gb = pgMemoObj.show_gb;
			fltComp.svc_num = pgMemoObj.svc_num;
			fltComp.svc_mgmt_num = pgMemoObj.svc_mgmt_num;
			fltComp.op_memo_id = pgMemoObj.op_memo_id;
			fltComp.cont_grp_id = pgMemoObj.cont_grp_id;
			fltComp.chg_dt = pgMemoObj.chg_dt;
			fltComp.cont_hst_cd = pgMemoObj.cont_hst_cd;
			if (pgMemoObj.subScwin != "") {
				fltComp.subScwin = pgMemoObj.subScwin;
			} else if (pgMemoObj.subScwin == "") {
				fltComp.subScwin = "scwin"
			}
			if (target === "G") {
				fltComp.rowIndex = pgMemoObj.rowIndex;
				fltComp.colIndex = pgMemoObj.colIndex;
			}
			ngmf.addClass(fltComp, "wmemo");
			
			var btnOffset = $("#"+fltComp.btnId).offset();
			var left = $("#"+fltComp.btnId).offset().left - $("#"+fltComp.getID()).outerWidth();
			var top =  $("#"+fltComp.btnId).offset().top - $("#"+fltComp.getID()).outerHeight() + $("#"+fltComp.btnId).outerHeight();

			if (left < 0 ) {
				left = $("#"+fltComp.btnId).offset().left + $("#"+fltComp.btnId).outerWidth() + 10;
			} else {
				left -= 10;
			}
			if (top < 0 ) {
				top = $("#"+fltComp.btnId).offset().top  - $("#"+fltComp.btnId).outerHeight()/2;
				top = top > 0 ? top : 10;
			}

			fltComp.setStyle("left",  left +"px");
			fltComp.setStyle("top", top +"px");	

			var htmlArr = [];
			htmlArr.push("");
			htmlArr.push("<div id='' class='w2group header'>");
			htmlArr.push("<div class='w2group left'>");
			if (pgMemoObj.show_gb == "M") {
				htmlArr.push("<a id='"+ fltComp.getID() +"_btn_allMemo' class='w2anchor2 title1' href='javascript:void(null);'>전체보기</a>");
			} else {
				htmlArr.push("<a id='"+ fltComp.getID() +"_btn_allMemo' style='display:none;' class='w2anchor2 title1' href='javascript:void(null);'>전체보기</a>");
			}
			htmlArr.push("<a id='"+ fltComp.getID() +"_btn_detailMemo' style='display:none;' class='w2anchor2 title2' href='javascript:void(null);'>작성하기</a>");
			htmlArr.push("</div>");
			htmlArr.push("<div class='w2group right'>");
			htmlArr.push("<a id='' class='w2anchor2 key_button' href='javascript:void(null);'></a>");
			htmlArr.push("<div class='w2group bar'></div>");
			htmlArr.push("<a id='"+ fltComp.getID() +"_btn_layerClose' class='w2anchor2 close_button' href='javascript:void(null);'></a>");
			htmlArr.push("</div>");
			htmlArr.push("</div>");
			ngmf.object("flt_pgMemoLayer").setHeaderHTML(htmlArr.join(""));

			var parentContent = $("#"+fltComp.getID()+"_contents")[0];
			var wfmComp = ngmf.create("wfm_pgMemoLayer", "wframe", {scope : "true"}, parentContent);
			ngmf.setSrc(wfmComp.getID(), "CCA", "ZNGMSMEM00010");
			wfm_pgMemoLayer_ancCreateView.show("");
			$("#"+ fltComp.getID() +"_btn_layerClose").bind("click", function() {
				ngmf.object("wfm_pgMemoLayer").remove();
				fltComp.remove();
			});

			$("#"+ fltComp.getID() +"_btn_allMemo").bind("click", function() {
				$("#"+ fltComp.getID() +"_btn_allMemo").css("display", "none");
				$("#"+ fltComp.getID() +"_btn_detailMemo").css("display", "inline-block");
				//ngmf.setSrc("wfm_pgMemoLayer", "AAT", "workMemo_list");
				wfm_pgMemoLayer_ancCreateView.hide("");
				wfm_pgMemoLayer_ancListView.show("");
			});

			$("#"+ fltComp.getID() +"_btn_detailMemo").bind("click", function() {
				$("#"+ fltComp.getID() +"_btn_detailMemo").css("display", "none");
				$("#"+ fltComp.getID() +"_btn_allMemo").css("display", "inline-block");
				//ngmf.setSrc("wfm_pgMemoLayer", "AAT", "workMemo_write");
				wfm_pgMemoLayer_ancCreateView.show("");
				wfm_pgMemoLayer_ancListView.hide("");
			});

			wfm_pgMemoLayer.btnId = fltComp.btnId;
			wfm_pgMemoLayer.show_gb = fltComp.show_gb;
			wfm_pgMemoLayer.svc_num = fltComp.svc_num;
			wfm_pgMemoLayer.svc_mgmt_num = fltComp.svc_mgmt_num;
			wfm_pgMemoLayer.op_memo_id = fltComp.op_memo_id;
			wfm_pgMemoLayer.cont_grp_id = fltComp.cont_grp_id;
			wfm_pgMemoLayer.chg_dt = fltComp.chg_dt;
			wfm_pgMemoLayer.cont_hst_cd = fltComp.cont_hst_cd;
			if (typeof fltComp.subScwin != "undefined") {
				wfm_pgMemoLayer.subScwin = fltComp.subScwin;
			}
			if (target === "G") {
				wfm_pgMemoLayer.rowIndex = fltComp.rowIndex;
				wfm_pgMemoLayer.colIndex = fltComp.colIndex;
			}
			
			if (typeof wfm_pgMemoLayer_scwin != "undefined" && 
				typeof wfm_pgMemoLayer_scwin.set_memo_id == "function") {
				wfm_pgMemoLayer_scwin.set_memo_id(pgMemoObj);			
			}
		}
	} catch(e) {
		ngmf._error("[pubComm._createMemoLayer] Exception :: ", e);
	}
};
