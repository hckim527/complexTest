/*amd /frame/page/body_bottom.xml 1578 6175e00cdd999927d2f385c3bfa7e4f7997b61852c3152d1cead8fab4a299e86 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',A:{},E:[{T:1,N:'w2:historyInfo',E:[{T:1,N:'w2:history',A:{}},{T:1,N:'w2:history',A:{}}]},{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){// 리턴 값 초기화 
scwin.btn_clear_onclick = function (e) {
  tbx_return.setValue("");
};

// 리턴 값 설정
scwin.setReturnValue = function (strValue) {
  tbx_return.setValue(tbx_return.getValue() + strValue);
  tbx_return.setValue(tbx_return.getValue() + "\n");
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{class:'',id:'grp_bottom',style:''},E:[{T:1,N:'w2:textbox',A:{class:'tc_tbx_label_1',escape:'false',id:'',label:'■ 리턴 값 확인',style:''}},{T:1,N:'xf:group',A:{id:'',style:'display: flex;justify-content: flex-end'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_clear_onclick',id:'btn_clear',label:'clear',style:''}}]},{T:1,N:'xf:textarea',A:{style:'border: 1px solid var(--ws-gray-400);border-radius: 8px;width: 100%;height: 120px;',id:'tbx_return',class:'tc_tbx_result_1'}}]}]}]}]})