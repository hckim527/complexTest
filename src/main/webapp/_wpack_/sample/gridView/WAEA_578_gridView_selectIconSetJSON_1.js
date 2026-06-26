/*amd /sample/gridView/WAEA_578_gridView_selectIconSetJSON_1.xml 11188 4b14aae88742abea9059b406659fd3782af33ac1ff0b4c0d2e280d3e187ca9e4 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',A:{},E:[{T:1,N:'w2:historyInfo',E:[{T:1,N:'w2:history',A:{}}]},{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){// 테스트 설명, 유효성 값 설정 (Jira WAEA-578)
scwin.tData = {
  "description": "gridView inputType=\"select\" viewType=\"icon\" 일 때 setJSON 오류<br/><a href='https://inswave01.atlassian.net/browse/WAEA-578' target='_blank' style='color:blue;text-decoration:underline;'>WAEA-578</a>",
  "validation": ["DataList.setJSON(getAllJSON()) 을 여러 번 반복 호출해도 viewType=\"icon\" 인 select 컬럼(col1) 셀 내부의 nobr 태그가 셀당 1개로 유지되어야 한다(반복 호출 시 중복 누적되지 않음).", "viewType=\"icon\" 인 select 컬럼은 escape=\"false\"(col1) 와 escape=\"true\"(col2) 모두 setJSON 반복 호출 시 셀당 nobr 태그가 1개로 유지되어야 한다(escape 설정과 무관하게 중복 누적되지 않음).", "setJSON 반복 호출 후에도 각 select 셀의 표시 라벨(a/b/c)과 아이콘이 1개만 정상 렌더링되어야 한다.", "viewType 미지정 대조군 select 컬럼(col3)은 setJSON 반복 호출 시에도 정상 표시되어야 한다.", "setJSON 반복 호출 과정에서 console error 가 발생하지 않아야 한다."]
};

// 옵션 itemset(label/value = a/b/c) 데이터 - 첨부와 동일하게 a,a,b,b,c,c 를 setData
scwin.makeOptionData = function () {
  return ["a", "a", "b", "b", "c", "c"];
};

// 본문 그리드 데이터(10행 x 4컬럼) - 첨부와 동일한 구성으로 평면 배열 생성
scwin.makeGridData = function () {
  var src = ["a", "a", "b", "b", "c", "c"];
  var arr = [];
  for (var i = 0; i < 10; i++) {
    arr.push(src[i % 6]);
    arr.push(src[(i + 1) % 6]);
    arr.push(src[(i + 2) % 6]);
    arr.push(src[(i + 3) % 6]);
  }
  return arr;
};
scwin.onpageload = function () {
  // Global DataList 생성 호출
  $c.gcm.createCommonDatalist($p);

  // comp 초기 생성
  scwin.comp_init();

  // 테스트 설명, 유효성 생성
  wf_body_left.getObj("scwin").createValidation(scwin.tData);
};

// comp 생성 : 첨부(Jira)와 동일한 구성 - 4개 select 컬럼.
//  col1 viewType=icon(escape=false), col2 viewType=icon(escape=true), col3/col4 viewType 미지정(대조군). itemset 은 a/b/c.
scwin.comp_init = async function () {
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
  if (typeof dlt_opt !== 'undefined') {
    $p.data.remove("dlt_opt");
  }

  // 안내 라벨 (target 생성 전 가장 먼저 생성) - 전제/절차는 라벨로만 표기
  await $c.gcm.createLabel($p, 'label="[전제] 그리드 4개 컬럼 모두 inputType=select, displayMode=label 이며 옵션 itemset 은 a/b/c. col1 은 viewType=icon + escape=false, col2 는 viewType=icon + escape=true, col3/col4 는 viewType 미지정(대조군). 본문은 10행.\n[절차] 반복 횟수(par_repeatCount)를 선택하고 setJSON 반복 실행 버튼을 눌러 DataList.setJSON(getAllJSON()) 을 선택한 횟수만큼 반복 호출한다.\n[확인] viewType=icon 셀(col1/col2) 내부의 nobr 태그가 셀당 1개로 유지되는지(반복 호출 시 중복 누적 여부)를 리턴값으로 확인."', '', 'label1');

  // 옵션 itemset DataList 생성 (label/value 2컬럼, a/b/c 3항목)
  var strOpt = '';
  strOpt += '<w2:dataList ' + $c.gcm.getNameSpace($p) + ' id="dlt_opt" baseNode="list" repeatNode="map">';
  strOpt += '<w2:columnInfo>';
  strOpt += '<w2:column id="label" name="label" dataType="text"></w2:column>';
  strOpt += '<w2:column id="value" name="value" dataType="text"></w2:column>';
  strOpt += '</w2:columnInfo>';
  strOpt += '<w2:data use="true"></w2:data>';
  strOpt += '</w2:dataList>';
  $p.data.create(strOpt);
  dlt_opt.setData(scwin.makeOptionData());

  // 본문 바인딩 DataList 생성 (col1~col4 text, 10행)
  var strDlt = '';
  strDlt += '<w2:dataList ' + $c.gcm.getNameSpace($p) + ' id="dlt_grid" baseNode="list" repeatNode="map" saveRemovedData="true">';
  strDlt += '<w2:columnInfo>';
  strDlt += '<w2:column id="col1" name="name1" dataType="text"></w2:column>';
  strDlt += '<w2:column id="col2" name="name2" dataType="text"></w2:column>';
  strDlt += '<w2:column id="col3" name="name3" dataType="text"></w2:column>';
  strDlt += '<w2:column id="col4" name="name4" dataType="text"></w2:column>';
  strDlt += '</w2:columnInfo>';
  strDlt += '<w2:data use="true"></w2:data>';
  strDlt += '</w2:dataList>';
  $p.data.create(strDlt);
  dlt_grid.setData(scwin.makeGridData());

  // Property(공통) - 바인딩만 createCList 로 (그리드 구성은 첨부와 동일하게 직접 작성)
  var cList = $c.gcm.createCList($p, {
    dataList: "data:dlt_grid"
  });
  var grp_comp = $c.gcm.getTestGroup($p);
  var strNameSpace = $c.gcm.getNameSpace($p);

  // 공통 itemset 조각
  var itemset = '<w2:choices><w2:itemset nodeset="data:dlt_opt"><w2:label ref="label"></w2:label><w2:value ref="value"></w2:value></w2:itemset></w2:choices>';

  // target 생성 (첨부와 동일 : 명시적 height 로 렌더, 4개 select 컬럼의 viewType 구성 그대로)
  var strTarget = '';
  strTarget += '<w2:gridView ' + strNameSpace + ' ' + cList + ' id="" checkAllType="false" style="width:500px;height:251px;">';
  strTarget += '<w2:caption style="" id="caption1" value="select viewType=icon setJSON 반복 nobr 중복 테스트 그리드"></w2:caption>';
  strTarget += '<w2:header style="" id="header1"><w2:row style="" id="hrow1">';
  strTarget += '<w2:column width="100" inputType="text" id="h_col1" value="col1 (icon, escape=false)" displayMode="label"></w2:column>';
  strTarget += '<w2:column width="100" inputType="text" id="h_col2" value="col2 (icon, escape=true)" displayMode="label"></w2:column>';
  strTarget += '<w2:column width="100" inputType="text" id="h_col3" value="col3 (대조군)" displayMode="label"></w2:column>';
  strTarget += '<w2:column width="*" inputType="text" id="h_col4" value="col4 (대조군)" displayMode="label"></w2:column>';
  strTarget += '</w2:row></w2:header>';
  strTarget += '<w2:gBody style="" id="gBody1"><w2:row style="" id="brow1">';
  //  (중요) body 컬럼 id 는 dataList 컬럼 id 와 동일해야 셀에 데이터가 바인딩됨
  strTarget += '<w2:column width="100" inputType="select" id="col1" dataList="col1" value="" displayMode="label" viewType="icon" escape="false">' + itemset + '</w2:column>';
  strTarget += '<w2:column width="100" inputType="select" id="col2" dataList="col2" value="" displayMode="label" viewType="icon" escape="true">' + itemset + '</w2:column>';
  strTarget += '<w2:column width="100" inputType="select" id="col3" dataList="col3" value="" displayMode="label" escape="true">' + itemset + '</w2:column>';
  strTarget += '<w2:column width="*" inputType="select" id="col4" dataList="col4" value="" displayMode="label" allOption="" chooseOption="" escape="false">' + itemset + '</w2:column>';
  strTarget += '</w2:row></w2:gBody>';
  strTarget += '</w2:gridView>';
  scwin.target1 = await $p.dynamicCreate("target1", "gridView", strTarget, grp_comp);
};

// [실행] DataList.setJSON(getAllJSON()) 을 선택한 횟수만큼 반복 호출한 뒤,
//  viewType=icon 컬럼(col1/col2)과 대조군(col3) 셀당 nobr 태그 최대 개수를 리턴창에 출력한다.
scwin.btn_setJSON_onclick = function (e) {
  var times = Number(par_repeatCount.getValue()) || 1;
  for (var i = 0; i < times; i++) {
    dlt_grid.setJSON(dlt_grid.getAllJSON());
  }
  setTimeout(function () {
    // 컬럼 인덱스별 모든 행 셀에서 nobr 태그 최대 개수 측정
    var maxNobr = function (colIdx) {
      var max = 0;
      for (var r = 0; r < 10; r++) {
        var td = document.querySelector("td[id*='target1_cell_" + r + "_" + colIdx + "']");
        if (!td) {
          continue;
        }
        var n = td.querySelectorAll("nobr").length;
        if (n > max) {
          max = n;
        }
      }
      return max;
    };
    wf_body_bottom.getObj("scwin").setReturnValue("setJSON " + times + "회 반복 후 셀당 nobr 최대 개수 / col1(icon)=" + maxNobr(0) + ", col2(icon,escape=true)=" + maxNobr(1) + ", col3(대조군)=" + maxNobr(2));
  }, 150);
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{class:'tc_body_main',id:'',style:'display: flex;'},E:[{T:1,N:'xf:group',A:{style:'',id:'body_left',class:'tc_body_left'},E:[{T:1,N:'w2:wframe',A:{id:'wf_body_left',src:'/frame/page/body_left.xml',style:''}}]},{T:1,N:'xf:group',A:{class:'tc_body_right',id:'body_right',style:''},E:[{T:1,N:'w2:wframe',A:{id:'wf_body_top',src:'/frame/page/body_top.xml',style:''}},{T:1,N:'xf:group',A:{id:'grp_condition'}},{T:1,N:'w2:wframe',A:{id:'wf_body_sample',src:'/frame/page/body_sample.xml',style:''}},{T:1,N:'xf:group',A:{id:'grp_parameter'},E:[{T:1,N:'xf:group',A:{class:'tblbox',id:'',style:''},E:[{T:1,N:'xf:group',A:{adaptive:'layout',adaptiveThreshold:'600',class:'w2tb tbl',id:'',style:'',tagname:'table'},E:[{T:1,N:'w2:attributes',E:[{T:1,N:'w2:summary',E:[{T:3,text:'메소드 파라미터'}]}]},{T:1,N:'xf:group',A:{tagname:'colgroup'},E:[{T:1,N:'xf:group',A:{style:'width:150px;',tagname:'col'}},{T:1,N:'xf:group',A:{style:'',tagname:'col'}},{T:1,N:'xf:group',A:{style:'width:150px;',tagname:'col'}},{T:1,N:'xf:group',A:{style:'',tagname:'col'}}]},{T:1,N:'xf:group',A:{style:'',tagname:'tr'},E:[{T:1,N:'xf:group',A:{class:'w2tb_th',style:'',tagname:'th'},E:[{T:1,N:'w2:textbox',A:{class:'',id:'',label:'반복 횟수',ref:'',style:''}}]},{T:1,N:'xf:group',A:{class:'w2tb_td',style:'',tagname:'td'},E:[{T:1,N:'xf:select1',A:{appearance:'minimal',direction:'auto',id:'par_repeatCount',ref:'',selectedIndex:'0',style:'',submenuSize:'auto'},E:[{T:1,N:'xf:choices',E:[{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'1'}]},{T:1,N:'xf:value',E:[{T:3,text:'1'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'3'}]},{T:1,N:'xf:value',E:[{T:3,text:'3'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:3,text:'5'}]},{T:1,N:'xf:value',E:[{T:3,text:'5'}]}]}]}]}]},{T:1,N:'xf:group',A:{class:'w2tb_th',style:'',tagname:'th'}},{T:1,N:'xf:group',A:{class:'w2tb_td',style:'',tagname:'td'}}]}]}]},{T:1,N:'xf:group',A:{style:'display:flex; gap:10px; flex-wrap:wrap;',id:'grp_etc'},E:[{T:1,N:'w2:button',A:{class:'tc_btn_basic','ev:onclick':'scwin.btn_setJSON_onclick',id:'btn_setJSON',label:'setJSON 반복 실행',style:''}}]}]},{T:1,N:'w2:wframe',A:{id:'wf_body_bottom',src:'/frame/page/body_bottom.xml',style:''}}]}]}]}]}]})