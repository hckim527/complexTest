/*amd /sample/common_link/wframe_processMsgFrame_1.xml 2083 307e35857169e0557364ad3c29087ff8675b439286c5be4db613cafe85db84fb */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'},{T:1,N:'xf:submission',A:{id:'sm_getData',action:'/data/tabControl_P_processMsgFrame_1.json',method:'post',mediatype:'application/json',ref:'',target:'data:json,dlt_reqData',encoding:'UTF-8',instance:'',replace:'',errorHandler:'',customHandler:'',mode:'asynchronous',processMsg:'process 메시지 입니다.','ev:submit':'','ev:submitdone':'scwin.sm_getData_submitdone','ev:submiterror':'scwin.sm_getData_submiterror',abortTrigger:''}}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {};
scwin.getProcessMsgPosition = function () {
  let processMsgElement = document.querySelector('[id*=target1_wq_processMsgComp]');
  let wf_body_bottom_tbx_return = document.querySelector('[id*=wf_body_bottom_tbx_return]');
  if (processMsgElement) {
    // 요소의 크기 및 위치 정보 가져오기
    let rect = processMsgElement.getBoundingClientRect();
    if (wf_body_bottom_tbx_return) {
      wf_body_bottom_tbx_return.value = "left : " + rect.left;
      wf_body_bottom_tbx_return.value += ", top : " + rect.top;
    }
  } else {
    if (wf_body_bottom_tbx_return) {
      wf_body_bottom_tbx_return.value += "processMsgElement not found.";
    }
  }
};
scwin.btn_smReq_onclick = async function (e) {
  await $p.executeSubmission("sm_getData");
  scwin.getProcessMsgPosition();
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'w2:button',A:{style:'width:100px;height:50px;',id:'btn_smReq',label:'통신요청','ev:onclick':'scwin.btn_smReq_onclick'}}]}]}]})