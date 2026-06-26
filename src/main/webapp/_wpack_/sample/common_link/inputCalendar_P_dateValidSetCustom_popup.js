/*amd /sample/common_link/inputCalendar_P_dateValidSetCustom_popup.xml 1501 20f26ff53a29adf3c2bc596fc4a6f28f5c4cbb62926c6ea40e92ef0a548042ca */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',A:{},E:[{T:1,N:'w2:historyInfo',E:[{T:1,N:'w2:history',A:{}},{T:1,N:'w2:history',A:{}}]},{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'},E:[{T:1,N:'w2:dataMap',A:{baseNode:'map',id:'dm_ref',style:''},E:[{T:1,N:'w2:keyInfo',E:[{T:1,N:'w2:key',A:{dataType:'text',id:'key1',name:'name1'}}]},{T:1,N:'w2:data',A:{use:'true'},E:[{T:1,N:'label',E:[{T:4,cdata:' '}]},{T:1,N:'key1',E:[{T:4,cdata:'dm_data'}]}]}]}]},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){// popup.xml 정의
scwin.onpageload = function () {
  // onpageunload에서는 이미 parameter가 전부 제거되어 있는 상태이므로 onpageload에서 미리 저장해둔다.
  scwin.callerId = $p.getParameter("callerId");
  scwin.onpageunload();
};
scwin.onpageunload = function () {
  let comp = $p.getComponentById(scwin.callerId);
  if (comp && typeof comp.setValueCancel === "function") {
    comp.setValueCancel(); // 이전 입력값 복원
  }
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'}}]}]})