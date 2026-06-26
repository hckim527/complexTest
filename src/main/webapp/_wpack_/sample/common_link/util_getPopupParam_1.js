/*amd /sample/common_link/util_getPopupParam_1.xml 1329 2920e2e987aee70e20f7ead0053f83a8e8b93ba35905aa25ff50ff1570816bb0 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  let dataStr = WebSquare.util.getPopupParam();
  if (dataStr !== null) {
    getPopupParam_result.setValue("getPopupParam() : " + dataStr);
  } else {
    getPopupParam_result.setValue("getPopupParam() : null (전달된 데이터 없음)");
  }
};
scwin.btn_closeSelf_onclick = function () {
  WebSquare.util.closePopup();
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'w2:textbox',A:{id:'getPopupParam_result',label:'getPopupParam 결과',style:'width:500px; height:100px; font-size:14px;'}},{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_closeSelf_onclick',id:'btn_closeSelf',label:'closePopup',style:'margin-top:10px;'}}]}]}]})