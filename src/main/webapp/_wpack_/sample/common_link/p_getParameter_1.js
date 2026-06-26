/*amd /sample/common_link/p_getParameter_1.xml 1800 859e3bae870569efa7d930f3df9336cf0b86fd42022d73da8acc8d07536c176b */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  // popupID 파라미터로 전달된 dataObject.name 확인
  var paramNames = ["rowObj", "tmpData", "exam_param"];
  var results = [];
  for (var i = 0; i < paramNames.length; i++) {
    var val = $p.getParameter(paramNames[i]);
    if (val !== "" && val !== null && val !== undefined) {
      var typeStr = typeof val;
      var valStr = typeStr === "object" ? JSON.stringify(val) : String(val);
      results.push("getParameter('" + paramNames[i] + "') : " + valStr + " (typeof: " + typeStr + ")");
    }
  }
  if (results.length > 0) {
    getParameter_result.setValue(results.join("\n"));
  } else {
    getParameter_result.setValue("전달된 dataObject 파라미터 없음");
  }
};
scwin.btn_closeSelf_onclick = function () {
  $p.closePopup();
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'padding:10px;'},E:[{T:1,N:'w2:textbox',A:{id:'getParameter_result',label:'getParameter 결과',style:'width:100%; font-size:12px;'}},{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_closeSelf_onclick',id:'btn_closeSelf',label:'닫기',style:'margin-top:10px; width:80px;'}}]}]}]}]})