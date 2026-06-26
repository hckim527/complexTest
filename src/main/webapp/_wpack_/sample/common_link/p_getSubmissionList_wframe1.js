/*amd /sample/common_link/p_getSubmissionList_wframe1.xml 1813 15fc95ab7a9673e5ce45951595ba3662bab979ca99cd3ab8fedef69b915d9834 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'},{T:1,N:'xf:submission',A:{id:'sbm_wf1_1',action:'/data/p_createSubmission_userList.json',method:'post',mediatype:'application/json'}},{T:1,N:'xf:submission',A:{id:'sbm_wf1_2',action:'/data/p_createSubmission_userList.json',method:'get',mediatype:'application/json'}}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.btn_wf1_getList_onclick = function () {
  // WFrame(wf1) 내부에서 호출 - 현재 Scope(wf1) 내 Submission 만 반환
  var subIds = $p.getSubmissionList({
    "returnType": "id"
  });
  var mainScope = $p.main();
  mainScope.wf_body_bottom.getObj("scwin").setReturnValue("── 시나리오 5 : wf1 내부 $p.getSubmissionList({returnType:'id'}) ──");
  mainScope.wf_body_bottom.getObj("scwin").setReturnValue("wf1 Scope Submission ID 목록 : [" + subIds.join(", ") + "] / 길이 : " + subIds.length);
};
}}}]}]},{T:1,N:'body',E:[{T:1,N:'xf:group',A:{style:'padding:5px;'},E:[{T:1,N:'w2:textbox',A:{id:'wf1_label',style:'width:100%; font-size:12px;',label:'wf1 (WFrame 내부 - sbm_wf1_1, sbm_wf1_2 정의)',escape:'false'}},{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_wf1_getList_onclick',id:'btn_wf1_getList',label:'wf1 내부에서 getSubmissionList (현재 Scope)',style:''}}]}]}]}]})