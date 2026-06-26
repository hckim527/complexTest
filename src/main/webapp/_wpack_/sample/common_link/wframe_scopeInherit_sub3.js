/*amd /sample/common_link/wframe_scopeInherit_sub3.xml 2131 3ffc84cdc9976a7cd205aade4ff7d778ae65d11f31f57b321b0ab12903d09137 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  scwin.btn_getWframe_onclick();
  scwin.btn_getComponent_onclick();
};
scwin.btn_getWframe_onclick = function (e) {
  let wf_body_bottom_tbx_return = document.querySelector('[id*=wf_body_bottom_tbx_return]');
  try {
    wf_body_bottom_tbx_return.value += "$p.main().wf1_input1.id : " + $p.main().wf1_input1.id + "\n";
  } catch {
    wf_body_bottom_tbx_return.value += "$p.main().wf1_input1 접근 불가\n";
  }
  try {
    wf_body_bottom_tbx_return.value += "$p.main().wf2_input1.id : " + $p.main().wf2_input1.id + "\n";
  } catch {
    wf_body_bottom_tbx_return.value += "$p.main().wf2_input1 접근 불가\n";
  }
};
scwin.btn_getComponent_onclick = function (e) {
  let wf_body_bottom_tbx_return = document.querySelector('[id*=wf_body_bottom_tbx_return]');
  try {
    wf_body_bottom_tbx_return.value += "wf1_input2.id : " + wf1_input2.id + "\n";
  } catch {
    wf_body_bottom_tbx_return.value += "wf1_input2 직접 접근 불가\n";
  }
  try {
    wf_body_bottom_tbx_return.value += "wf2_input2.id : " + wf2_input2.id + "\n";
  } catch {
    wf_body_bottom_tbx_return.value += "wf2_input2 직접 접근 불가\n";
  }
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'w2:button',A:{style:'width:128px;height:37px;',id:'btn_getWframe',label:'$p.main()','ev:onclick':'scwin.btn_getWframe_onclick'}},{T:1,N:'w2:button',A:{id:'btn_getComponent',label:'component',style:'width:128px;height:37px;','ev:onclick':'scwin.btn_getComponent_onclick'}}]}]}]})