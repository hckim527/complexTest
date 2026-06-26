/*amd /sample/common_link/wframe_setSrc_1.xml 1221 da37363ffd1b0439cf3b91bb04b9c7ee9457c0210ff5b78ec9d48ac9aeb41c29 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {
  // scwin.btn_getDataObject_onclick();
};
scwin.btn_getDataObject_onclick = async function (e) {
  let wf_body_bottom_tbx_return = document.querySelector('[id*=wf_body_bottom_tbx_return]');
  let rcvData = $p.getParameter("wframeData");
  let data = JSON.stringify(rcvData);
  wf_body_bottom_tbx_return.value += "dataObject : " + data + "\n";
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'w2:button',A:{style:'width:140px;height:100px;',id:'btn_getDataObject',label:'dataObject 확인','ev:onclick':'scwin.btn_getDataObject_onclick'}}]}]}]})