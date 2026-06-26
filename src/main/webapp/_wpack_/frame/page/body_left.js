/*amd /frame/page/body_left.xml 2450 23e6fa4ee60f36a5dab5660bf5b000f689b4a924a412e1a63bcc5cb894f7eb2a */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',A:{},E:[{T:1,N:'w2:historyInfo',E:[{T:1,N:'w2:history',A:{}},{T:1,N:'w2:history',A:{}}]},{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.createValidation = async function (tData) {
  objVal = tData.validation;
  countVal = objVal.length;

  // description 설정
  body_description.setValue(tData.description);
  let strValadationGroup = '';
  let strValidation = '';
  let strNameSpace = 'xmlns="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:w2="http://www.inswave.com/websquare" xmlns:xf="http://www.w3.org/2002/xforms"';
  if (typeof vgroup1 !== 'undefined') vgroup1.remove();
  strValadationGroup += '<xf:group ' + strNameSpace + ' id="" style=""></xf:group>';
  scwin.vgroup1 = await $p.dynamicCreate("vgroup1", "group", strValadationGroup, grp_left);

  // validation 생성 및 설정
  for (let i = 0; i < countVal; i++) {
    // escape 처리가 필요한 문자(<, >, &, ", ') 포함 여부 판단
    let escapeAttr = /[<>&"']/.test(objVal[i]) ? 'true' : 'false';

    // label은 빈 값으로 생성 후 setLabel API로 설정 (XML 속성 파싱 우회)
    strValidation += '<w2:textbox ' + strNameSpace + ' class="tc_body_left_validation" escape="' + escapeAttr + '" label=""></w2:textbox>';
    scwin['validation' + i] = await $p.dynamicCreate("validation" + i, "textbox", strValidation, vgroup1);
    scwin['validation' + i].setLabel('(' + (i + 1) + ') ' + objVal[i]);
    strValidation = '';
  }
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'',id:'grp_left'},E:[{T:1,N:'w2:textbox',A:{style:'',id:'',label:'■ 테스트 설명',class:'tc_tbx_label_1',escape:'false'}},{T:1,N:'w2:textbox',A:{style:'',id:'body_description',label:'',class:'',escape:'false'}},{T:1,N:'w2:textbox',A:{style:'',id:'',label:'■ 테스트 유효성',class:'tc_tbx_label_1',escape:'false'}}]}]}]}]})