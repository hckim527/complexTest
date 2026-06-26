/*amd /sample/common_link/p_parent_sub_scoped.xml 1612 adfbf74cfea02b926d91ddc7584e181253652bec25f866e940381c79a5496323 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.btn_parent_sub_onclick = function () {
  try {
    var parentScope = $p.parent();
    var midRtn = parentScope && parentScope.scwin && typeof parentScope.scwin.getMidPageInfo === "function" ? parentScope.scwin.getMidPageInfo() : "N/A";
    $p.main().wf_body_bottom.getObj("scwin").setReturnValue("wf_sub_scoped $p.parent() → scwin.getMidPageInfo() : " + midRtn);
  } catch (e) {
    try {
      $p.main().wf_body_bottom.getObj("scwin").setReturnValue("wf_sub_scoped $p.parent() 예외 : " + (e && e.message ? e.message : e));
    } catch (ee) {}
  }
};
}}}]}]},{T:1,N:'body',E:[{T:1,N:'xf:group',A:{style:'padding:5px;'},E:[{T:1,N:'w2:textbox',A:{id:'sub_label',style:'width:100%; font-size:12px;',label:'wf_sub_scoped (scope=\'true\' WFrame)',escape:'false'}},{T:1,N:'xf:group',A:{style:'margin-top:5px;'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_parent_sub_onclick',id:'btn_parent_sub',label:'$p.parent() 호출 (wf_mid Scope 기대)',style:''}}]}]}]}]}]})