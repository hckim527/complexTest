/*amd /sample/common_link/wframe_resize_1.xml 1219 73d843a08cbb791e3717df6ed9bf38a509f4a3397fec49d9d4a9d78ceda1b0af */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {};
scwin.onresize = function () {
  let wf_body_bottom_tbx_return = document.querySelector('[id*=wf_body_bottom_tbx_return]');
  if (wf_body_bottom_tbx_return) {
    wf_body_bottom_tbx_return.value += "=====link_body_onresize=====";
  }
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload','ev:onresize':'scwin.onresize'},E:[{T:1,N:'xf:group',A:{style:'width:200px;height:150px;',id:''},E:[{T:1,N:'xf:input',A:{id:'input1',style:'width:144px; height:21px; ',initValue:'wfrme_input'}},{T:1,N:'w2:button',A:{style:'',id:'button1',label:'wframe_button'}}]}]}]}]})