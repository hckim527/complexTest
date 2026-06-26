/*amd /sample/common_link/p_top_popup.xml 2083 27f2d2ce6813a71e3236dfe1abb3ad7d1d3c8972658f1976fa4c9b9c772a9e57 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.getPopupTopInfo = function () {
  return "팝업 최상위 scwin.getPopupTopInfo() 호출 성공";
};
scwin.onpageload = function () {
  try {
    var topScope = $p.top();
    var topType = typeof topScope;
    var isWindow = topScope === window;
    var hasScwin = topScope && typeof topScope.scwin !== "undefined";
    var sameScwin = hasScwin && topScope.scwin === scwin;
    var rtn = hasScwin && typeof topScope.scwin.getPopupTopInfo === "function" ? topScope.scwin.getPopupTopInfo() : "N/A";
    popup_result.setValue("(팝업) $p.top() 타입 : " + topType + " / === window : " + isWindow + " / .scwin 존재 : " + hasScwin + " / .scwin === 현재 scwin : " + sameScwin + " / .scwin.getPopupTopInfo() : " + rtn);
  } catch (e) {
    popup_result.setValue("(팝업) onpageload 예외 : " + (e && e.message ? e.message : e));
  }
};
scwin.btn_closeSelf_onclick = function () {
  try {
    $p.closePopup();
  } catch (e) {}
  // browserPopup 은 별도 Window 이므로 window.close() 로 닫음
  try {
    window.close();
  } catch (e) {}
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'padding:10px;'},E:[{T:1,N:'w2:textbox',A:{id:'popup_result',label:'팝업 $p.top() 결과',style:'width:100%; font-size:12px;'}},{T:1,N:'xf:group',A:{style:'margin-top:10px;'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_closeSelf_onclick',id:'btn_closeSelf',label:'닫기',style:''}}]}]}]}]}]})