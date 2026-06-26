/*amd /sample/common_link/p_getPopupUrl_1.xml 1206 6663fb00dae48dc746255ad24db4598ff594167b0938fc0fe9fb73b251d95e8e */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  var popupUrl = $p.getPopupUrl();
  getPopupUrl_result.setValue("getPopupUrl() : " + popupUrl);
};
scwin.btn_closeSelf_onclick = function () {
  $p.closePopup();
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'padding:10px;'},E:[{T:1,N:'w2:textbox',A:{id:'getPopupUrl_result',label:'getPopupUrl 결과',style:'width:100%; font-size:12px;'}},{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_closeSelf_onclick',id:'btn_closeSelf',label:'닫기',style:'margin-top:10px; width:80px;'}}]}]}]}]})