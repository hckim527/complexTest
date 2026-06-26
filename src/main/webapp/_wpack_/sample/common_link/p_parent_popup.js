/*amd /sample/common_link/p_parent_popup.xml 1844 61b68b07f7ae8d435d55362c21932676e492b8769dd4c4df451ecb3a3deb6851 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  try {
    var parentScope = $p.parent();
    if (parentScope && parentScope.ibx_top) {
      try {
        parentScope.ibx_top.setValue("Example");
      } catch (ex) {}
    }
    var rtn = parentScope && parentScope.scwin && typeof parentScope.scwin.getMainPageInfo === "function" ? parentScope.scwin.getMainPageInfo() : "N/A";
    popup_result.setValue("(팝업) $p.parent() → scwin.getMainPageInfo() : " + rtn);
  } catch (e) {
    try {
      popup_result.setValue("(팝업) onpageload 예외 : " + (e && e.message ? e.message : e));
    } catch (ee) {}
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
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'padding:10px;'},E:[{T:1,N:'w2:textbox',A:{id:'popup_result',label:'팝업 $p.parent() 결과',style:'width:100%; font-size:12px;'}},{T:1,N:'xf:group',A:{style:'margin-top:10px;'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_closeSelf_onclick',id:'btn_closeSelf',label:'닫기',style:''}}]}]}]}]}]})