/*amd /sample/selectbox/WAEA_895_selectbox_dataMapReset_1.xml 9463 65f42f52a54f2864aa9762413c16c2f582ba5d5e5d4b723ba4fa19ae79e5120e */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',A:{},E:[{T:1,N:'w2:historyInfo',E:[{T:1,N:'w2:history',A:{}}]},{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){// 테스트 설명, 유효성 값 설정 (Jira WAEA-895)
scwin.tData = {
  "description": "[JB우리캐피탈] ref로 지정한 dataMap를 reset() 할 경우 selectBox 선택값이 초기화되지 않는 현상<br/><a href='https://inswave01.atlassian.net/browse/WAEA-895' target='_blank' style='color:blue;text-decoration:underline;'>WAEA-895</a>",
  "validation": ["selectBox 에서 항목을 선택한 뒤 ref 로 지정한 dataMap(dataMap1) 을 reset() 하면, ref 바인딩된 selectBox 의 선택값(getValue()) 이 초기값(빈값)으로 초기화되어야 한다.", "동일한 dataMap key(City) 에 ref 로 바인딩된 input 은 reset() 호출 시 초기값(빈값)으로 정상 초기화되어야 한다(대조군).", "reset() 호출 후 dataMap.get(\"City\") 의 값과 selectBox.getValue() 가 서로 일치해야 한다(둘 다 초기 빈값).", "reset() 호출 후 selectBox 에 표시되는 라벨도 초기 미선택 상태(chooseOption 라벨)로 돌아가야 한다.", "selectBox 선택값 설정 후 reset() 을 반복 수행해도 매 회차마다 selectBox 의 선택값이 초기값(빈값)으로 초기화되어야 한다."]
};
scwin.onpageload = function () {
  // Global DataList 생성 호출
  $c.gcm.createCommonDatalist($p);

  // comp 초기 생성
  scwin.comp_init();

  // 테스트 설명, 유효성 생성
  wf_body_left.getObj("scwin").createValidation(scwin.tData);
};

// comp 생성 : 첨부(Jira)와 동일한 구성 - City key 를 가진 dataMap 과 그 key 에 ref 로 바인딩된 selectBox + input.
//  selectBox 항목은 도시 목록(라벨/코드), 초기 City 값은 빈값.
scwin.comp_init = async function () {
  // 기존 라벨/target/data 있으면 삭제
  if (typeof label1 !== 'undefined') {
    label1.remove();
  }
  if (typeof target1 !== 'undefined') {
    target1.remove();
  }
  if (typeof target2 !== 'undefined') {
    target2.remove();
  }
  if (typeof dataMap1 !== 'undefined') {
    $p.data.remove("dataMap1");
  }
  if (typeof dlt_city !== 'undefined') {
    $p.data.remove("dlt_city");
  }
  var ns = $c.gcm.getNameSpace($p);

  // 안내 라벨 (target 생성 전 가장 먼저 생성) - 전제/절차는 라벨로만 표기
  await $c.gcm.createLabel($p, 'label="[전제] dataMap(dataMap1) 의 City key 에 selectBox(도시 목록)와 input 이 모두 ref 로 바인딩되어 있으며, City 초기값은 빈값이다.\n[절차] 도시(par_city)를 고른 뒤 선택값 설정 버튼으로 selectBox 값을 선택하고, 이어서 dataMap.reset() 실행 버튼을 누른다.\n[확인] reset 후 selectBox 의 선택값과 표시 라벨이 초기 미선택 상태로 돌아가는지, 동일 key 에 바인딩된 input 과 비교하여 리턴값으로 확인."', '', 'label1');

  // ref 바인딩 대상 dataMap 생성 (City key, 초기값 빈값)
  var strMap = '';
  strMap += '<w2:dataMap ' + ns + ' id="dataMap1" baseNode="map">';
  strMap += '<w2:keyInfo>';
  strMap += '<w2:key id="City" name="City" dataType="text"></w2:key>';
  strMap += '</w2:keyInfo>';
  strMap += '<w2:data use="true"><City></City></w2:data>';
  strMap += '</w2:dataMap>';
  $p.data.create(strMap);

  // selectBox 항목 DataList 생성 (label/value 2컬럼, 도시 3항목)
  var strCity = '';
  strCity += '<w2:dataList ' + ns + ' id="dlt_city" baseNode="list" repeatNode="map">';
  strCity += '<w2:columnInfo>';
  strCity += '<w2:column id="label" name="label" dataType="text"></w2:column>';
  strCity += '<w2:column id="value" name="value" dataType="text"></w2:column>';
  strCity += '</w2:columnInfo>';
  strCity += '<w2:data use="true"></w2:data>';
  strCity += '</w2:dataList>';
  $p.data.create(strCity);
  dlt_city.setData(["서울", "S", "부산", "B", "인천", "I"]);
  var grp_comp = $c.gcm.getTestGroup($p);

  // 공통 itemset 조각
  var itemset = '<xf:choices><xf:itemset nodeset="data:dlt_city"><xf:label ref="label"></xf:label><xf:value ref="value"></xf:value></xf:itemset></xf:choices>';

  // target1 : ref 로 dataMap1.City 에 바인딩된 selectBox (첨부와 동일 구성)
  var strSel = '';
  strSel += '<xf:select1 ' + ns + ' id="" appearance="minimal" direction="auto" chooseOption="true" chooseOptionLabel="선택" style="width:160px;height:24px;" ref="data:dataMap1.City">';
  strSel += itemset;
  strSel += '</xf:select1>';
  scwin.target1 = await $p.dynamicCreate("target1", "selectbox", strSel, grp_comp);

  // target2 : 동일 key(dataMap1.City) 에 바인딩된 input (대조군)
  var strInp = '';
  strInp += '<xf:input ' + ns + ' id="" style="width:160px;height:24px;margin-left:10px;" ref="data:dataMap1.City"></xf:input>';
  scwin.target2 = await $p.dynamicCreate("target2", "input", strInp, grp_comp);
};

// [선택값 설정] par_city 에서 고른 도시 코드를 selectBox 에 설정한다. (reset 전 선택 상태 만들기)
scwin.btn_setValue_onclick = function (e) {
  var v = par_city.getValue();
  target1.setValue(v);
  wf_body_bottom.getObj("scwin").setReturnValue("선택값 설정 후 / selectBox.getValue()=[" + target1.getValue() + "], selectBox 표시라벨=[" + target1.getText() + "], input.getValue()=[" + target2.getValue() + "], dataMap City=[" + dataMap1.get("City") + "]");
};

// [dataMap.reset() 실행] ref 로 지정한 dataMap 을 reset() 한 뒤 selectBox/input/dataMap 값을 출력한다.
scwin.btn_reset_onclick = function (e) {
  dataMap1.reset();
  wf_body_bottom.getObj("scwin").setReturnValue("dataMap.reset() 후 / selectBox.getValue()=[" + target1.getValue() + "], selectBox 표시라벨=[" + target1.getText() + "], input.getValue()=[" + target2.getValue() + "], dataMap City=[" + dataMap1.get("City") + "]");
};

// [setValue→reset 반복] 선택값 설정과 reset 을 3회 반복하며 매 회차 selectBox 선택값을 수집해 출력한다.
scwin.btn_repeat_onclick = function (e) {
  var v = par_city.getValue();
  var results = [];
  for (var i = 0; i < 3; i++) {
    target1.setValue(v);
    dataMap1.reset();
    results.push("[" + target1.getValue() + "]");
  }
  wf_body_bottom.getObj("scwin").setReturnValue("setValue→reset 3회 반복 후 각 회차 selectBox.getValue()=" + results.join(", ") + " (모두 빈값이어야 정상)");
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{class:'tc_body_main',id:'',style:'display: flex;'},E:[{T:1,N:'xf:group',A:{style:'',id:'body_left',class:'tc_body_left'},E:[{T:1,N:'w2:wframe',A:{id:'wf_body_left',src:'/frame/page/body_left.xml',style:''}}]},{T:1,N:'xf:group',A:{class:'tc_body_right',id:'body_right',style:''},E:[{T:1,N:'w2:wframe',A:{id:'wf_body_top',src:'/frame/page/body_top.xml',style:''}},{T:1,N:'xf:group',A:{id:'grp_condition'}},{T:1,N:'w2:wframe',A:{id:'wf_body_sample',src:'/frame/page/body_sample.xml',style:''}},{T:1,N:'xf:group',A:{id:'grp_parameter'},E:[{T:1,N:'xf:group',A:{class:'tblbox',id:'',style:''},E:[{T:1,N:'xf:group',A:{adaptive:'layout',adaptiveThreshold:'600',class:'w2tb tbl',id:'',style:'',tagname:'table'},E:[{T:1,N:'w2:attributes',E:[{T:1,N:'w2:summary',E:[{T:3,text:'메소드 파라미터'}]}]},{T:1,N:'xf:group',A:{tagname:'colgroup'},E:[{T:1,N:'xf:group',A:{style:'width:150px;',tagname:'col'}},{T:1,N:'xf:group',A:{style:'',tagname:'col'}},{T:1,N:'xf:group',A:{style:'width:150px;',tagname:'col'}},{T:1,N:'xf:group',A:{style:'',tagname:'col'}}]},{T:1,N:'xf:group',A:{style:'',tagname:'tr'},E:[{T:1,N:'xf:group',A:{class:'w2tb_th',style:'',tagname:'th'},E:[{T:1,N:'w2:textbox',A:{class:'',id:'',label:'선택할 도시',ref:'',style:''}}]},{T:1,N:'xf:group',A:{class:'w2tb_td',style:'',tagname:'td'},E:[{T:1,N:'xf:select1',A:{appearance:'minimal',direction:'auto',id:'par_city',ref:'',selectedIndex:'0',style:'',submenuSize:'auto'},E:[{T:1,N:'xf:choices',E:[{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'서울'}]},{T:1,N:'xf:value',E:[{T:3,text:'S'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'부산'}]},{T:1,N:'xf:value',E:[{T:3,text:'B'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'인천'}]},{T:1,N:'xf:value',E:[{T:3,text:'I'}]}]}]}]}]},{T:1,N:'xf:group',A:{class:'w2tb_th',style:'',tagname:'th'}},{T:1,N:'xf:group',A:{class:'w2tb_td',style:'',tagname:'td'}}]}]}]},{T:1,N:'xf:group',A:{style:'display:flex; gap:10px; flex-wrap:wrap;',id:'grp_etc'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_setValue_onclick',id:'btn_setValue',label:'선택값 설정',style:''}},{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_reset_onclick',id:'btn_reset',label:'dataMap.reset() 실행',style:''}},{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_repeat_onclick',id:'btn_repeat',label:'setValue→reset 반복',style:''}}]}]},{T:1,N:'w2:wframe',A:{id:'wf_body_bottom',src:'/frame/page/body_bottom.xml',style:''}}]}]}]}]}]})