/*amd /sample/gridView/WAEA_937_gridView_autoComplete_1.xml 11508 9b6bfe578bf47c21fd5cdffcf42eba547404d1fc9561fe01af94cc6f00d60639 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',A:{},E:[{T:1,N:'w2:historyInfo',E:[{T:1,N:'w2:history',A:{}}]},{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){// 테스트 설명, 유효성 값 설정 (Jira WAEA-937)
scwin.tData = {
  "description": "[메리츠화재] gridView inputType=\"autoComplete\" 값 선택 시 스크롤 위치가 초기화 안되는 현상<br/><a href='https://inswave01.atlassian.net/browse/WAEA-937' target='_blank' style='color:blue;text-decoration:underline;'>WAEA-937</a>",
  "validation": ["1행 autoComplete 드롭다운에서 리스트 하단(20번)까지 스크롤하여 선택한 뒤 2행 autoComplete 를 editmode 진입하면, 드롭다운 리스트가 첫 항목(1번)이 보이도록 스크롤 위치가 초기화되어 표시되어야 한다.", "키보드 방향키로 리스트 하단 항목까지 이동하여 선택한 후 다른 행의 autoComplete 를 열 때에도 리스트 스크롤이 초기화되어야 한다.", "listModeOnFocus=\"showAll\" 로 editmode 진입 시 현재 선택값(또는 첫 항목)으로 포커스가 정상 이동해야 한다(WAEA-819 부가 현상).", "대조군인 select 컬럼(col2)에서는 동일한 리스트 스크롤 미초기화 현상이 발생하지 않아야 한다.", "autoComplete / select 에서 선택한 값이 해당 Cell 과 바인딩 DataList 에 올바르게 반영되어야 한다."]
};

// autoComplete / select 컬럼이 참조할 옵션 itemset 데이터를 개수만큼 생성 (label=value=1..count)
scwin.makeComboItems = function (count) {
  let arr = [];
  for (let i = 1; i <= count; i++) {
    arr.push({
      "label": i + "",
      "value": i + ""
    });
  }
  return arr;
};

// 본문 그리드 2행(빈 값) - 행 선택/이동이 가능하도록 2행 이상 유지
scwin.makeGridRows = function () {
  return [{
    "col1": "",
    "col2": ""
  }, {
    "col1": "",
    "col2": ""
  }];
};
scwin.onpageload = function () {
  // Global DataList 생성 호출
  $c.gcm.createCommonDatalist($p);

  // comp 초기 생성
  scwin.comp_init();

  // 테스트 설명, 유효성 생성
  wf_body_left.getObj("scwin").createValidation(scwin.tData);
};

// comp 생성 : 첨부(Jira) 와 동일한 구성 - col1 autoComplete(listModeOnFocus) / col2 select, itemset 1..N.
//  Target 재생성 조건(con_listModeOnFocus / con_comboCount)을 읽어 반영한다.
scwin.comp_init = async function () {
  // Target 재생성 조건 읽기 (초기 미설정 시 기본값)
  let listMode = con_listModeOnFocus.getValue() || "showAll";
  let comboCnt = Number(con_comboCount.getValue()) || 20;

  // 기존 라벨/target/dataList 있으면 삭제
  if (typeof label1 !== 'undefined') {
    label1.remove();
  }
  if (typeof target1 !== 'undefined') {
    target1.remove();
  }
  if (typeof dlt_grid !== 'undefined') {
    $p.data.remove("dlt_grid");
  }
  if (typeof dlt_combo !== 'undefined') {
    $p.data.remove("dlt_combo");
  }

  // 안내 라벨 (target 생성 전 가장 먼저 생성) - 전제/절차는 라벨로만 표기
  await $c.gcm.createLabel($p, 'label="[전제] 그리드 col1 은 inputType=\'autoComplete\' + listModeOnFocus=\'' + listMode + '\' 이며, 옵션은 1~' + comboCnt + '번이라 드롭다운 리스트에 세로 스크롤이 발생한다. col2 는 동일 itemset 의 select(대조군). 본문은 2행(빈 값).\n[절차] (1) 1행 autoComplete 셀을 더블클릭하여 드롭다운을 열고 리스트를 아래로 스크롤해 ' + comboCnt + '번(맨 아래) 항목을 선택 (2) 2행 autoComplete 셀을 더블클릭하여 드롭다운을 다시 진입 (3) 드롭다운 리스트가 첫 항목(1번)으로 초기화되어 보이는지(셀 더블클릭 시 출력되는 리스트 scrollTop 값)를 확인."', '', 'label1');

  // autoComplete / select 옵션 itemset DataList 생성 (label/value = 1..comboCnt)
  let strCombo = '';
  strCombo += '<w2:dataList ' + $c.gcm.getNameSpace($p) + ' id="dlt_combo" baseNode="list" repeatNode="map">';
  strCombo += '<w2:columnInfo>';
  strCombo += '<w2:column id="label" name="label" dataType="text"></w2:column>';
  strCombo += '<w2:column id="value" name="value" dataType="text"></w2:column>';
  strCombo += '</w2:columnInfo>';
  strCombo += '<w2:data use="true"></w2:data>';
  strCombo += '</w2:dataList>';
  $p.data.create(strCombo);
  dlt_combo.setJSON(scwin.makeComboItems(comboCnt), false);

  // 본문 바인딩 DataList 생성 (col1/col2 text, 2행 빈 값)
  let strDlt = '';
  strDlt += '<w2:dataList ' + $c.gcm.getNameSpace($p) + ' id="dlt_grid" baseNode="list" repeatNode="map">';
  strDlt += '<w2:columnInfo>';
  strDlt += '<w2:column id="col1" name="autoComplete" dataType="text"></w2:column>';
  strDlt += '<w2:column id="col2" name="select" dataType="text"></w2:column>';
  strDlt += '</w2:columnInfo>';
  strDlt += '<w2:data use="true"></w2:data>';
  strDlt += '</w2:dataList>';
  $p.data.create(strDlt);
  dlt_grid.setJSON(scwin.makeGridRows(), false);

  // Property(공통) 설정 - 바인딩만 createCList 로 (그리드 구성은 첨부와 동일하게 직접 작성)
  let cList = $c.gcm.createCList($p, {
    dataList: "data:dlt_grid"
  });
  let grp_comp = $c.gcm.getTestGroup($p);
  let strNameSpace = $c.gcm.getNameSpace($p);

  // 공통 itemset 조각 (autoComplete / select 컬럼 공용)
  let itemset = '<w2:choices><w2:itemset nodeset="data:dlt_combo"><w2:label ref="label"></w2:label><w2:value ref="value"></w2:value></w2:itemset></w2:choices>';

  // target 생성 (첨부와 동일 : 명시적 height 로 렌더, col1 autoComplete / col2 select)
  let strTarget = '';
  strTarget += '<w2:gridView ' + strNameSpace + ' ' + cList + ' id="" checkAllType="false" style="width:500px;height:250px;" rowNumVisible="false" rowStatusVisible="false" ev:oncelldblclick="scwin.target1_oncelldblclick">';
  strTarget += '<w2:caption style="" id="caption1" value="autoComplete 드롭다운 리스트 스크롤 초기화 테스트 그리드"></w2:caption>';
  strTarget += '<w2:header style="" id="header1"><w2:row style="" id="hrow1">';
  strTarget += '<w2:column width="200" inputType="text" id="h_col1" value="autoComplete (listModeOnFocus)"></w2:column>';
  strTarget += '<w2:column width="*" inputType="text" id="h_col2" value="select (대조군)"></w2:column>';
  strTarget += '</w2:row></w2:header>';
  strTarget += '<w2:gBody style="" id="gBody1"><w2:row style="" id="brow1">';
  //  (중요) body 컬럼 id 는 dataList 컬럼 id 와 동일해야 셀에 데이터가 바인딩됨
  strTarget += '<w2:column width="200" inputType="autoComplete" id="col1" dataList="col1" displayMode="label" listModeOnFocus="' + listMode + '">' + itemset + '</w2:column>';
  strTarget += '<w2:column width="*" inputType="select" id="col2" dataList="col2">' + itemset + '</w2:column>';
  strTarget += '</w2:row></w2:gBody>';
  strTarget += '</w2:gridView>';
  scwin.target1 = await $p.dynamicCreate("target1", "gridView", strTarget, grp_comp);
};

// [실행] 데이터 초기화 : 본문 2행을 빈 값으로 리셋하여 재현을 반복할 수 있게 한다. (리턴 출력 없음)
scwin.btn_resetData_onclick = function (e) {
  dlt_grid.setJSON(scwin.makeGridRows(), false);
};

// [이벤트] autoComplete 셀 더블클릭(editmode 진입) 시, 열린 드롭다운 옵션 리스트의 scrollTop 값만 리턴창에 출력한다.
//  - 드롭다운은 더블클릭 직후 비동기로 열리므로 짧은 지연 후 측정한다.
//  - 현재 열린 autoComplete(.w2autoComplete_open)의 리스트 스크롤 컨테이너(id = 루트id + "_itemTable")의 scrollTop 을 읽는다.
scwin.target1_oncelldblclick = function (rowIndex, columnIndex, columnId) {
  // autoComplete 컬럼(col1)만 드롭다운 리스트 스크롤 측정 대상 (select 대조군 제외)
  if (columnId !== "col1") {
    return;
  }
  setTimeout(function () {
    let openRoot = document.querySelector(".w2autoComplete_open");
    if (!openRoot) {
      return;
    }
    let itemTable = document.getElementById(openRoot.id + "_itemTable");
    if (!itemTable) {
      return;
    }
    wf_body_bottom.getObj("scwin").setReturnValue("row=" + (rowIndex + 1) + " scrollTop=" + itemTable.scrollTop);
  }, 200);
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{class:'tc_body_main',id:'',style:'display: flex;'},E:[{T:1,N:'xf:group',A:{style:'',id:'body_left',class:'tc_body_left'},E:[{T:1,N:'w2:wframe',A:{id:'wf_body_left',src:'/frame/page/body_left.xml',style:''}}]},{T:1,N:'xf:group',A:{class:'tc_body_right',id:'body_right',style:''},E:[{T:1,N:'w2:wframe',A:{id:'wf_body_top',src:'/frame/page/body_top.xml',style:''}},{T:1,N:'xf:group',A:{id:'grp_condition'},E:[{T:1,N:'xf:group',A:{class:'tblbox',id:'',style:''},E:[{T:1,N:'xf:group',A:{adaptive:'layout',adaptiveThreshold:'600',class:'w2tb tbl',id:'',style:'',tagname:'table'},E:[{T:1,N:'w2:attributes',E:[{T:1,N:'w2:summary',E:[{T:3,text:'Target 재생성 조건'}]}]},{T:1,N:'xf:group',A:{tagname:'colgroup'},E:[{T:1,N:'xf:group',A:{style:'width:170px;',tagname:'col'}},{T:1,N:'xf:group',A:{style:'',tagname:'col'}},{T:1,N:'xf:group',A:{style:'width:150px;',tagname:'col'}},{T:1,N:'xf:group',A:{style:'',tagname:'col'}}]},{T:1,N:'xf:group',A:{style:'',tagname:'tr'},E:[{T:1,N:'xf:group',A:{class:'w2tb_th',style:'',tagname:'th'},E:[{T:1,N:'w2:textbox',A:{class:'',id:'',label:'listModeOnFocus',ref:'',style:''}}]},{T:1,N:'xf:group',A:{class:'w2tb_td',style:'',tagname:'td'},E:[{T:1,N:'xf:select1',A:{appearance:'minimal',direction:'auto',id:'con_listModeOnFocus',ref:'',selectedIndex:'0',style:'',submenuSize:'auto'},E:[{T:1,N:'xf:choices',E:[{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'showAll'}]},{T:1,N:'xf:value',E:[{T:3,text:'showAll'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'showMatched'}]},{T:1,N:'xf:value',E:[{T:3,text:'showMatched'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'hide'}]},{T:1,N:'xf:value',E:[{T:3,text:'hide'}]}]}]}]}]},{T:1,N:'xf:group',A:{class:'w2tb_th',style:'',tagname:'th'},E:[{T:1,N:'w2:textbox',A:{class:'',id:'',label:'옵션 개수 (comboCount)',ref:'',style:''}}]},{T:1,N:'xf:group',A:{class:'w2tb_td',tagname:'td'},E:[{T:1,N:'xf:select1',A:{appearance:'minimal',direction:'auto',id:'con_comboCount',ref:'',selectedIndex:'0',style:'',submenuSize:'auto'},E:[{T:1,N:'xf:choices',E:[{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'20'}]},{T:1,N:'xf:value',E:[{T:3,text:'20'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'10'}]},{T:1,N:'xf:value',E:[{T:3,text:'10'}]}]}]}]}]}]}]}]}]},{T:1,N:'w2:wframe',A:{id:'wf_body_sample',src:'/frame/page/body_sample.xml',style:''}},{T:1,N:'xf:group',A:{id:'grp_parameter'},E:[{T:1,N:'xf:group',A:{style:'display:flex; gap:10px; flex-wrap:wrap;',id:'grp_etc'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_resetData_onclick',id:'btn_resetData',label:'데이터 초기화',style:''}}]}]},{T:1,N:'w2:wframe',A:{id:'wf_body_bottom',src:'/frame/page/body_bottom.xml',style:''}}]}]}]}]}]})