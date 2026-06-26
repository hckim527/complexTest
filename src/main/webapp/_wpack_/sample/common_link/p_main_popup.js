/*amd /sample/common_link/p_main_popup.xml 2101 66b89761c25272c5ac08433055d32933353e224bae8b0aa6e55c6224700e17ea */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.getPopupMainInfo = function () {
  return "팝업 최상위 scwin.getPopupMainInfo() 호출 성공";
};
scwin.onpageload = function () {
  try {
    var mainScope = $p.main();
    var mainType = typeof mainScope;
    var isWindow = mainScope === window;
    var hasScwin = mainScope && typeof mainScope.scwin !== "undefined";
    var sameScwin = hasScwin && mainScope.scwin === scwin;
    var rtn = hasScwin && typeof mainScope.scwin.getPopupMainInfo === "function" ? mainScope.scwin.getPopupMainInfo() : "N/A";
    popup_result.setValue("(팝업) $p.main() 타입 : " + mainType + " / === window : " + isWindow + " / .scwin 존재 : " + hasScwin + " / .scwin === 현재 scwin : " + sameScwin + " / .scwin.getPopupMainInfo() : " + rtn);
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
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'padding:10px;'},E:[{T:1,N:'w2:textbox',A:{id:'popup_result',label:'팝업 $p.main() 결과',style:'width:100%; font-size:12px;'}},{T:1,N:'xf:group',A:{style:'margin-top:10px;'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_closeSelf_onclick',id:'btn_closeSelf',label:'닫기',style:''}}]}]}]}]}]})