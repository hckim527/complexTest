/*amd /cm/udc/fromToCalendar.xml 7649 47475c2f2372ab60a0e0b3db85fc4687ffccc6b94af08c5c55f56ec133ea4d6d */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',A:{},E:[{T:1,N:'w2:type',A:{palette:'support'},E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:publicInfo',A:{method:'scwin.setInitDate'}},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'},E:[{T:1,N:'w2:aliasDataMap',A:{scope:'',id:'aliasDataMap',userData1:''}}]},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){/**
 * @component
 * @company 
 * @developer user
 * @variableClone true
 * @notSupportBrowser 
 * @version 
 * @htmlRender 
 * @icon 
 * @disableIcon 
 * @width 100%
 * @height 26px
 * @description 
 */

/**
 * @property
 * @name id
 * @category 01.Basic & ETC
 * @type string
 * @option 
 * @default udc_fromToCal
 * @necessary Y
 * @description 메인화면에서 사용할 UDC ID
 */

/**
 * @property
 * @name class
 * @category 01.Basic & ETC
 * @type string
 * @option 
 * @default 
 * @necessary N
 * @description Class ID
 */

/**
 * @property
 * @name style
 * @category 01.Basic & ETC
 * @type string
 * @option 
 * @default 
 * @necessary N
 * @description 메안화면의 style
 */

/**
 * @property
 * @name refStDt
 * @category 03.Data
 * @type string
 * @option 
 * @default 
 * @necessary Y
 * @description bind 할 메인화면의  dataMap 컬럼 ID ( 시작날짜 )
 */

/**
 * @property
 * @name refEdDt
 * @category 03.Data
 * @type string
 * @option 
 * @default 
 * @necessary Y
 * @description bind 할 메인화면의  dataMap 컬럼 ID ( 종료날짜 )
 */

/**
 * @property
 * @name refDataMap
 * @category 03.Data
 * @type string
 * @option 
 * @default 
 * @necessary Y
 * @description bind 할 메인화면의 dataMap  ID (메인화면의 데이타 맵인 경우   예: ../dataMapid )
 */

/**
 * @method
 * @name setInit
 * @description desc
 * @return None|없음.
 * @param 
 * @hidden Y
 * @exception 
 * @sample 
 */
scwin.onpageload = function () {
  scwin.setInit();
  scwin.disFlag = true;
};
scwin.setInit = function () {
  var bindData = $p.getOptions();
  var refDataMap = bindData.refDataMap;
  if (!refDataMap) return;
  aliasDataMap.setScope(refDataMap);
  ipt_from.setRef("data:aliasDataMap." + bindData.refStDt);
  ipt_To.setRef("data:aliasDataMap." + bindData.refEdDt);
  var refStDt = aliasDataMap.get(bindData.refStDt);
  var refEdDt = aliasDataMap.get(bindData.refEdDt);
  scwin.setInitDate(refStDt, refEdDt);
};

/**
 * @method
 * @name setInitDate
 * @description desc
 * @return None|없음
 * @param <String>|fromDate|desc
 * @param <String>|toDate|desc 
 * @hidden N
 * @exception 
 * @sample 
 */
scwin.setInitDate = function (fromDate, toDate) {
  gr_cal.setStyle("display", "none");
  scwin.disFlag = true;
  if (fromDate.length == 8) {
    scwin.setInitFromDate(fromDate);
  }
  if (toDate.length == 8) {
    scwin.setInitToDate(toDate);
  }
  cal_fr.gotoCalendar(fromDate);
  cal_to.gotoCalendar(toDate);
  scwin.disableBeforeDate(fromDate);
  scwin.disableAfterDate(toDate);
};
/**
 * @method
 * @name setInitFromDate
 * @description desc
 * @return None|없음
 * @param <String>|dateStr|desc 
 * @hidden Y
 * @exception 
 * @sample 
 */
scwin.setInitFromDate = function (dateStr) {
  ipt_from.setValue(dateStr);
  //scwin.setMainFromDate(dateStr);
};

/**
 * @method
 * @name setInitToDate
 * @description desc
 * @return None|없음
 * @param <String>|dateStr|desc 
 * @hidden Y
 * @exception 
 * @sample 
 */
scwin.setInitToDate = function (dateStr) {
  ipt_To.setValue(dateStr);
  //scwin.setMainFromDate(dateStr);
};
scwin.img_Cal_onclick = function (e) {
  if (scwin.disFlag) {
    scwin.disFlag = false;
    gr_cal.setStyle("display", "flex");
    if (ipt_To.getValue() && ipt_To.getValue().length == 8) {
      cal_to.gotoCalendar(ipt_To.getValue());
    } else {
      cal_to.gotoCalendar($p.getCurrentServerDate("yyyyMMdd"));
    }
    if (ipt_from.getValue() && ipt_from.getValue().length == 8) {
      cal_fr.gotoCalendar(ipt_from.getValue());
    } else {
      cal_fr.gotoCalendar($p.getCurrentServerDate("yyyyMMdd"));
    }
  } else {
    scwin.disFlag = true;
    gr_cal.setStyle("display", "none");
  }
};
scwin.cal_fr_ondateselect = function (dateStr, dateObj) {
  if (dateStr > ipt_To.getValue() && ipt_To.getValue() != "") {
    $c.popup.alert($p, "TO DATE 보다 미래일자 입니다.");
    ipt_from.setValue("");
  } else {
    ipt_from.setValue(dateStr);
    if (dateStr) {
      cal_fr.gotoCalendar(dateStr);
    } else {
      cal_fr.gotoCalendar($p.getCurrentServerDate("yyyyMMdd"));
    }
    //cal_to.options.disableBeforeDate = dateStr;
    if (ipt_To.getValue()) {
      scwin.disFlag = true;
      gr_cal.setStyle("display", "none");
    }
  }
  scwin.disableBeforeDate(dateStr);
};
scwin.cal_to_ondateselect = function (dateStr, dateObj) {
  if (dateStr < ipt_from.getValue() && ipt_from.getValue() != "") {
    $c.popup.alert($p, "FROM DATE 보다 과거일자 입니다.");
    ipt_To.setValue("");
  } else {
    ipt_To.setValue(dateStr);
    cal_to.gotoCalendar(dateStr);
    if (dateStr) {
      cal_to.gotoCalendar(dateStr);
    } else {
      cal_to.gotoCalendar($p.getCurrentServerDate("yyyyMMdd"));
    }
    if (ipt_from.getValue()) {
      scwin.disFlag = true;
      gr_cal.setStyle("display", "none");
    }
  }
  scwin.disableAfterDate(dateStr);
};
scwin.disableBeforeDate = function (dateStr) {
  if (dateStr) {
    var date1 = $p.dateAdd(dateStr, 0);
    cal_to.options.disableBeforeDate = date1;
  } else {
    cal_to.options.disableBeforeDate = false;
  }
};
scwin.disableAfterDate = function (dateStr) {
  ;
  if (dateStr) {
    var date1 = $p.dateAdd(dateStr, 0);
    cal_fr.options.disableAfterDate = date1;
  } else {
    cal_fr.options.disableAfterDate = false;
  }
};
scwin.ipt_from_onviewchange = function (info) {
  var val = info.newValue;
  scwin.cal_fr_ondateselect(val);
};
scwin.ipt_To_onviewchange = function (info) {
  var val = info.newValue;
  scwin.cal_to_ondateselect(val);
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload()'},E:[{T:1,N:'xf:group',A:{id:'',style:'',class:'dual_calendar'},E:[{T:1,N:'xf:group',A:{id:''},E:[{T:1,N:'xf:input',A:{ref:'',rightAlign:'false',dataType:'date','ev:onviewchange':'scwin.ipt_from_onviewchange',displayFormat:'yyyy-MM-dd',adjustMaxLength:'false',style:'width:148px;',id:'ipt_from',renderType:''}},{T:1,N:'w2:span',A:{style:'',id:'',label:'~'}},{T:1,N:'xf:input',A:{rightAlign:'false',dataType:'date','ev:onviewchange':'scwin.ipt_To_onviewchange',displayFormat:'yyyy-MM-dd',adjustMaxLength:'false',style:'width:148px;',id:'ipt_To',renderType:''}},{T:1,N:'xf:trigger',A:{anchorWithGroupClass:'',style:'',id:'img_Cal',type:'button',class:'btn_cm btn_calendar','ev:onclick':'scwin.img_Cal_onclick'},E:[{T:1,N:'xf:label',E:[{T:4,cdata:'calendar'}]}]}]},{T:1,N:'xf:group',A:{style:'z-index:2000;display: none;',id:'gr_cal',class:'gr_cal'},E:[{T:1,N:'xf:group',A:{class:'lybox mb0',id:'',style:'width: 550px;'},E:[{T:1,N:'xf:group',A:{adaptiveThreshold:'',class:'ly_column col_5',id:'',style:''},E:[{T:1,N:'w2:calendar',A:{'ev:ondateselect':'scwin.cal_fr_ondateselect',footerDiv:'true',style:'position:relative;',id:'cal_fr'}}]},{T:1,N:'xf:group',A:{class:'ly_column col_5',id:'',style:''},E:[{T:1,N:'w2:calendar',A:{'ev:ondateselect':'scwin.cal_to_ondateselect',footerDiv:'true',style:'position:relative;',id:'cal_to'}}]}]}]}]}]}]}]})