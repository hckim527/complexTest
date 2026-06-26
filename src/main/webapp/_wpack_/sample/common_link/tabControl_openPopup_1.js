/*amd /sample/common_link/tabControl_openPopup_1.xml 1907 dc67b205ee23c664eb59cc0e7a98a1a0a192113d5a95d16d8a5a8516b1f6eb0a */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {};
scwin.getPopupPosition = function () {
  let popupElement = document.querySelector('[id*=target1_contents_content1_body_exam_popup]');
  if (popupElement) {
    // 요소의 크기 및 위치 정보 가져오기
    let rect = popupElement.getBoundingClientRect();
    let wf_body_bottom_tbx_return = document.querySelector('[id*=wf_body_bottom_tbx_return]');
    if (wf_body_bottom_tbx_return) {
      wf_body_bottom_tbx_return.value = "left : " + rect.left;
      wf_body_bottom_tbx_return.value += ", top : " + rect.top;
    }
  } else {
    console.warn(`popupElement not found.`);
    return null; // 요소를 찾지 못했으면 null 반환
  }
};
scwin.btn_openPopup_onclick = function (e) {
  // 팝업 생성 옵션 지정
  var options = {
    id: "exam_popup",
    type: "wframePopup",
    width: "230px",
    height: "250px",
    top: "0px",
    left: "0px",
    popupName: "팝업 예제",
    modal: true,
    dataObject: {}
  };
  $p.openPopup("/sample/common_link/tabControl_link_1.xml", options);
  scwin.getPopupPosition();
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'w2:button',A:{style:'width:100px; height:300px;',id:'btn_openPopup',label:'openPopup','ev:onclick':'scwin.btn_openPopup_onclick'}}]}]}]})