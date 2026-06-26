/*amd /cm/udc/codeSelectBoxBasic.xml 3359 2cc3f37fe4848675b1254f5a247dfd4a6b5836c07348c5933566a85b7b0d97e4 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',A:{palette:'support'},E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:publicInfo',A:{method:'scwin.setDataList',component:'dlt_codeList,adlt_dataList,adlt_dataMap'}},{T:1,N:'w2:layoutInfo'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'},E:[{T:1,N:'w2:dataList',A:{baseNode:'list',repeatNode:'map',id:'dlt_codeList',saveRemovedData:'true'},E:[{T:1,N:'w2:columnInfo',E:[{T:1,N:'w2:column',A:{id:'CODE_NM',name:'name1',dataType:'text'}},{T:1,N:'w2:column',A:{id:'COM_CD',name:'name2',dataType:'text'}},{T:1,N:'w2:column',A:{id:'GRP_CD',name:'name3',dataType:'text'}}]}]},{T:1,N:'w2:aliasDataList',A:{scope:'',id:'adlt_dataList'}},{T:1,N:'w2:aliasDataMap',A:{scope:'',id:'adlt_dataMap'}}]}]},{T:1,N:'script',A:{type:'text/javascript',lazy:'false'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){/**
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
 * @default 
 * @necessary N
 * @description desc
 */

/**
 * @property
 * @name class
 * @category 01.Basic & ETC
 * @type string
 * @option 
 * @default 
 * @necessary N
 * @description desc
 */

/**
 * @property
 * @name style
 * @category 01.Basic & ETC
 * @type string
 * @option 
 * @default 
 * @necessary N
 * @description desc
 */

scwin.onpageload = function () {
  scwin.initUdc();
};
scwin.initUdc = function () {
  scwin.dataListInfo = $c.common.getCodeDataListInfo($p);
  var columnInfoJson = {};
  var columnInfoList = [];
  var len = scwin.dataListInfo.FILED_ARR.length;
  for (var j = 0; j < len; j++) {
    columnInfoJson = {
      "id": scwin.dataListInfo.FILED_ARR[j],
      "name": scwin.dataListInfo.FILED_ARR[j],
      "dataType": "text"
    };
    columnInfoList.push(columnInfoJson);
  }
  $c.common.createDataList($p, scwin.dataListInfo.DATALIST, columnInfoList);
  $p.getComponentById("selCodeList").setNodeSet("data:" + scwin.dataListInfo.DATALIST, scwin.dataListInfo.LABEL, scwin.dataListInfo.VALUE);
  var options = $p.getOptions();
  if (options.refDataList) {
    var bindGrid = $p.data.bindPath(options.refDataList);
    adlt_dataList.setScope("../" + bindGrid.collectionId);
    selCodeList.setRef("data:adlt_dataList." + options.refColumn);
  } else if (options.refDataMap) {
    var bindDataMap = $p.data.bindPath(options.refDataMap);
    adlt_dataMap.setScope("../" + bindDataMap.collectionId);
    selCodeList.setRef("data:adlt_dataMap." + options.refColumn);
  }
};
scwin.setDataList = function (jsonData, code) {
  $p.getComponentById(scwin.dataListInfo.DATALIST).setJSON(jsonData);
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:select1',A:{submenuSize:'auto',chooseOptionLabel:'선택',chooseOption:'true',allOption:'',ref:'',appearance:'minimal',disabledClass:'w2selectbox_disabled',disabled:'false',style:'',id:'selCodeList',class:'req',direction:'auto'},E:[{T:1,N:'xf:choices'}]}]}]}]})