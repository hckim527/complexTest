/*amd /sample/common_link/p_reinitialize_mid.xml 1389 920968cb171066a82551ba143540f7ff7aa9f9d8ddd023f7dd7d66a2aef2c3e2 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  var count = parseInt(sessionStorage.getItem("p_reinit_mid_count") || "0", 10) + 1;
  sessionStorage.setItem("p_reinit_mid_count", String(count));
  try {
    mid_label.setLabel("wf_mid loadCount : " + count);
  } catch (e) {}
};
scwin.btn_reinit_wframe_onclick = function () {
  $p.reinitialize();
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'padding:5px;'},E:[{T:1,N:'w2:textbox',A:{id:'mid_label',style:'width:100%; font-size:12px;',label:'wf_mid',escape:'false'}},{T:1,N:'xf:group',A:{style:'margin-top:5px;'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_reinit_wframe_onclick',id:'btn_reinit_wframe',label:'reinitialize (wf_mid 내부)',style:''}}]}]}]}]}]})