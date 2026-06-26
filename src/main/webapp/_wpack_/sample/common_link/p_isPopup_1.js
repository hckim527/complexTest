/*amd /sample/common_link/p_isPopup_1.xml 2270 8341dadb0f60cc38b56dbe8324930f552fad9ee94799b93b22fbcf7f83d1d306 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  // 팝업 자신의 페이지 스코프에서 호출
  var isPopup1 = $p.isPopup();
  var isPopup2 = $p.isPopup(true);
  var isPopup3 = $p.isPopup(false);
  isPopup_result.setValue("(팝업 페이지) $p.isPopup() : " + isPopup1 + " / $p.isPopup(true) : " + isPopup2 + " / $p.isPopup(false) : " + isPopup3);
};
scwin.wf_inner_onwframeload = function () {
  // 팝업 내부 WFrame 로드 완료 시 자동 실행
  var inner = wf_inner.getObj("$p");
  var r1 = inner.isPopup(); // 현재(WFrame) 만 확인 → false
  var r2 = inner.isPopup(true); // 상위(팝업) 까지 확인 → true
  var r3 = inner.isPopup(false); // 명시 false → false

  inner_result.setValue("(팝업 내부 WFrame) isPopup() : " + r1 + " / isPopup(true) : " + r2 + " / isPopup(false) : " + r3);
};
scwin.btn_closeSelf_onclick = function () {
  $p.closePopup();
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'padding:10px;'},E:[{T:1,N:'w2:textbox',A:{id:'isPopup_result',label:'팝업 페이지 isPopup 결과',style:'width:100%; font-size:12px;'}},{T:1,N:'w2:wframe',A:{id:'wf_inner',src:'/sample/common_link/util_createPopup_1.xml',style:'width:100%; height:80px; border:1px solid #ccc; margin-top:10px;','ev:onwframeload':'scwin.wf_inner_onwframeload'}},{T:1,N:'w2:textbox',A:{id:'inner_result',label:'팝업 내부 WFrame isPopup 결과',style:'width:100%; font-size:12px; margin-top:10px;'}},{T:1,N:'xf:group',A:{style:'margin-top:10px;'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_closeSelf_onclick',id:'btn_closeSelf',label:'닫기',style:''}}]}]}]}]}]})