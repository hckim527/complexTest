/*amd /sample/common_link/p_parent_mid.xml 2063 d83128c412b90956d34861ec2872049647a5ac18495fd9976eb06814412b2f5b */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){// wf_mid 내부 전용 함수 (scope='true' 자식에서 parent 로 호출되는지 식별용)
scwin.getMidPageInfo = function () {
  return "wf_mid scwin.getMidPageInfo() 호출 성공";
};
scwin.btn_parent_mid_onclick = function () {
  try {
    var parentScope = $p.parent();
    if (parentScope && parentScope.ibx_top) {
      parentScope.ibx_top.setValue("Example");
    }
    var rtn = parentScope && parentScope.scwin && typeof parentScope.scwin.getMainPageInfo === "function" ? parentScope.scwin.getMainPageInfo() : "N/A";
    $p.parent().wf_body_bottom.getObj("scwin").setReturnValue("wf_mid $p.parent() → scwin.getMainPageInfo() : " + rtn);
  } catch (e) {
    try {
      $p.parent().wf_body_bottom.getObj("scwin").setReturnValue("wf_mid $p.parent() 예외 : " + (e && e.message ? e.message : e));
    } catch (ee) {}
  }
};
}}}]}]},{T:1,N:'body',E:[{T:1,N:'xf:group',A:{style:'padding:5px;'},E:[{T:1,N:'w2:textbox',A:{id:'mid_label',style:'width:100%; font-size:12px;',label:'wf_mid (scope 미설정 WFrame)',escape:'false'}},{T:1,N:'xf:group',A:{style:'margin-top:5px;'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_parent_mid_onclick',id:'btn_parent_mid',label:'$p.parent() 호출 (메인 Scope 기대)',style:''}}]},{T:1,N:'w2:wframe',A:{id:'wf_sub_scoped',src:'/sample/common_link/p_parent_sub_scoped.xml',scope:'true',style:'width:100%; height:90px; border:1px dashed #888; margin-top:5px;'}}]}]}]}]})