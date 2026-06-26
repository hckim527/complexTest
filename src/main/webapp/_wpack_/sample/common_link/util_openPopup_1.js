/*amd /sample/common_link/util_openPopup_1.xml 1498 bc3642b745be129628ac25e36d6b7eabc4170c5e139552176fc9f99317c51455 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  // 전달받은 파라미터 표시
  try {
    var paramData = $p.getParameter("paramData");
    if (paramData) {
      tbx_param.setValue("paramData: " + JSON.stringify(paramData));
    }
  } catch (e) {}
};
scwin.btn_close_onclick = function () {
  // 팝업 ID를 지정하여 닫기
  var popupId = $p.getPopupId();
  WebSquare.util.closePopup(popupId);
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'width:100%;padding:10px;',id:'group1'},E:[{T:1,N:'w2:textbox',A:{id:'tbx_title',label:'openPopup 대상 페이지',style:'font-size:16px;font-weight:bold;'}},{T:1,N:'w2:textbox',A:{id:'tbx_param',label:'',style:'margin-top:10px;width:100%;'}},{T:1,N:'w2:button',A:{id:'btn_close',label:'닫기',style:'margin-top:10px;width:80px;height:30px;','ev:onclick':'scwin.btn_close_onclick'}}]}]}]}]})