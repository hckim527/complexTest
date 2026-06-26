/*amd /sample/common_link/p_isWFramePopup_1.xml 2730 3773862aa4488118471f054d66de3cc58e7aed59bc1a800372dc14c572acff48 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  // 팝업 자신의 페이지 스코프에서 호출
  // type: 'wframePopup' 으로 열렸으면 true, 'iframePopup' 등으로 열렸으면 false
  var isWFramePopup1 = $p.isWFramePopup();
  var isWFramePopup2 = $p.isWFramePopup(true);
  var isWFramePopup3 = $p.isWFramePopup(false);
  isWFramePopup_result.setValue("(팝업 페이지) $p.isWFramePopup() : " + isWFramePopup1 + " / $p.isWFramePopup(true) : " + isWFramePopup2 + " / $p.isWFramePopup(false) : " + isWFramePopup3);
};
scwin.wf_inner_onwframeload = function () {
  // 팝업 내부 WFrame 로드 완료 시 자동 실행
  // 직접 부모(WFrame 바깥쪽 팝업 페이지)는 wframePopup 이 아니므로 isClosest=false 는 false
  // isClosest=true 이면 최상위까지 거슬러 올라가 wframePopup 여부 확인
  var inner = wf_inner.getObj("$p");
  var r1 = inner.isWFramePopup(); // 현재(WFrame) 직접 부모만 확인 → false
  var r2 = inner.isWFramePopup(true); // 상위(팝업) 까지 확인 → wframePopup 일 때 true
  var r3 = inner.isWFramePopup(false); // 명시 false → false

  inner_result.setValue("(팝업 내부 WFrame) isWFramePopup() : " + r1 + " / isWFramePopup(true) : " + r2 + " / isWFramePopup(false) : " + r3);
};
scwin.btn_closeSelf_onclick = function () {
  $p.closePopup();
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'padding:10px;'},E:[{T:1,N:'w2:textbox',A:{id:'isWFramePopup_result',label:'팝업 페이지 isWFramePopup 결과',style:'width:100%; font-size:12px;'}},{T:1,N:'w2:wframe',A:{id:'wf_inner',src:'/sample/common_link/util_createPopup_1.xml',style:'width:100%; height:80px; border:1px solid #ccc; margin-top:10px;','ev:onwframeload':'scwin.wf_inner_onwframeload'}},{T:1,N:'w2:textbox',A:{id:'inner_result',label:'팝업 내부 WFrame isWFramePopup 결과',style:'width:100%; font-size:12px; margin-top:10px;'}},{T:1,N:'xf:group',A:{style:'margin-top:10px;'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_closeSelf_onclick',id:'btn_closeSelf',label:'닫기',style:''}}]}]}]}]}]})