/*amd /cm/gcc/common.xml 75329 82d8129e7d294a1b83aa7cbe799e2c51655e9dfc1060df547c4d5baa702e1d09 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMMON'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:'',exposeType:'all'}},{T:1,N:'script',A:{type:'text/javascript',lazy:'false'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.strNameSpace = 'xmlns="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:w2="http://www.inswave.com/websquare" xmlns:xf="http://www.w3.org/2002/xforms"';
scwin.onpageload = function ($p) {};
scwin.getNameSpace = function ($p) {
  return scwin.strNameSpace;
};

/********************************************************
    Create DataList 
*******************************************************/

scwin.createCommonDatalist = function ($p) {
  scwin.createDataListBoolean($p);
  scwin.createDataRefDataMap($p);
  scwin.createDataRefDataList($p);
  scwin.createDataListRef($p);
  scwin.createDataListOpacity($p);
  scwin.createDataListAutoComplete($p);
  scwin.createDataListCheckComboBox($p);
  scwin.createDataListSelectBox($p);
  scwin.createDataListMultiSelect($p);
  scwin.createDataListGridView($p);
  scwin.createDataListCheckBox($p);
  scwin.createDataListRadio($p);
  scwin.createDataListTreeView($p);
};

// dataList boolean 동적 생성 (생략, true, false)
scwin.createDataListBoolean = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_boolean" saveRemovedData="true">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[true]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[false]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};

// dataList opacity 동적 생성 (생략, 0.0, 0.5, 1.0, 30%, -1, 2)
scwin.createDataListOpacity = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_opacity" saveRemovedData="true">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[0.0]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[0.5]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[1.0]]></label>';
  strTarget += '<value><![CDATA[4]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[30%]]></label>';
  strTarget += '<value><![CDATA[5]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[-1]]></label>';
  strTarget += '<value><![CDATA[6]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[2]]></label>';
  strTarget += '<value><![CDATA[7]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};

// ref 바인드 용 동적 생성 (dataMap)
scwin.createDataRefDataMap = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataMap ' + scwin.strNameSpace + ' baseNode="map" id="gdm_ref">';
  strTarget += '<w2:keyInfo>';
  strTarget += '<w2:key dataType="text" id="key1" name="name1"></w2:key>';
  strTarget += '</w2:keyInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<label><![CDATA[ ]]></label>';
  strTarget += '<key1><![CDATA[dm_data]]></key1>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataMap>';
  $p.data.create(strTarget);
};

// ref 바인드 용 동적 생성 (dataList)
scwin.createDataRefDataList = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_ref">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '<label><![CDATA[dlt_data1]]></label>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '<label><![CDATA[dlt_data2]]></label>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '<label><![CDATA[dlt_data3]]></label>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};

// dataList ref 동적 생성
scwin.createDataListRef = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_ref_list">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[data:gdm_ref.key1]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[data:gdl_ref.label]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[data:invalid.key1]]></label>';
  strTarget += '<value><![CDATA[4]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[invalid:gdm_ref.key1]]></label>';
  strTarget += '<value><![CDATA[5]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};
scwin.createDataListAutoComplete = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_autocomplete" saveRemovedData="true">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[autocomplete_item1]]></label>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[autocomplete_item2]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[autocomplete_item3]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};
scwin.createDataListCheckComboBox = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_checkcombobox" saveRemovedData="true">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[checkcombobox1]]></label>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[checkcombobox2]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[checkcombobox3]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};
scwin.createDataListCheckBox = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_checkbox" saveRemovedData="true">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[checkbox1]]></label>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[checkbox2]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[checkbox3]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};
scwin.createDataListSelectBox = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_selectbox" saveRemovedData="true">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[selectbox_item1]]></label>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[selectbox_item2]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[selectbox_item3]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};
scwin.createDataListMultiSelect = function ($p) {
  // 기존 gdl_multiselect 가 있으면 제거 후 재생성 (idempotent)
  if (typeof gdl_multiselect !== 'undefined') {
    $p.data.remove("gdl_multiselect");
  }
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_multiselect" saveRemovedData="true">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[multiselect1]]></label>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[multiselect2]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[multiselect3]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};
scwin.createDataListGridView = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList baseNode="list" repeatNode="map" id="gdl_gridview" saveRemovedData="true">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="column1" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="column2" name="name2" dataType="text"></w2:column>';
  strTarget += '<w2:column id="column3" name="name3" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<column1><![CDATA[가]]></column1>';
  strTarget += '<column2><![CDATA[나]]></column2>';
  strTarget += '<column3><![CDATA[다]]></column3>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<column1><![CDATA[라]]></column1>';
  strTarget += '<column2><![CDATA[마]]></column2>';
  strTarget += '<column3><![CDATA[바]]></column3>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<column1><![CDATA[사]]></column1>';
  strTarget += '<column2><![CDATA[아]]></column2>';
  strTarget += '<column3><![CDATA[자]]></column3>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};
scwin.createDataListRadio = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' baseNode="list" repeatNode="map" id="gdl_radio" saveRemovedData="true">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="label" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="value" name="name2" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[radio_item1]]></label>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[radio_item2]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<label><![CDATA[radio_item3]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};
scwin.createDataListTreeView = function ($p) {
  let strTarget = '';
  strTarget += '<w2:dataList baseNode="list" id="gdl_treeview" repeatNode="map" saveRemovedData="true" style="">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column dataType="text" id="depth" name="name1"></w2:column>';
  strTarget += '<w2:column dataType="text" id="label" name="name2"></w2:column>';
  strTarget += '<w2:column dataType="text" id="value" name="name3"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[1]]></depth>';
  strTarget += '<label><![CDATA[1]]></label>';
  strTarget += '<value><![CDATA[1]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[2]]></depth>';
  strTarget += '<label><![CDATA[1-1]]></label>';
  strTarget += '<value><![CDATA[2]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[1]]></depth>';
  strTarget += '<label><![CDATA[2]]></label>';
  strTarget += '<value><![CDATA[3]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[2]]></depth>';
  strTarget += '<label><![CDATA[2-1]]></label>';
  strTarget += '<value><![CDATA[4]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[2]]></depth>';
  strTarget += '<label><![CDATA[2-2]]></label>';
  strTarget += '<value><![CDATA[5]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[1]]></depth>';
  strTarget += '<label><![CDATA[3]]></label>';
  strTarget += '<value><![CDATA[6]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[2]]></depth>';
  strTarget += '<label><![CDATA[3-1]]></label>';
  strTarget += '<value><![CDATA[7]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[3]]></depth>';
  strTarget += '<label><![CDATA[3-1-1]]></label>';
  strTarget += '<value><![CDATA[8]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[3]]></depth>';
  strTarget += '<label><![CDATA[3-1-2]]></label>';
  strTarget += '<value><![CDATA[9]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[2]]></depth>';
  strTarget += '<label><![CDATA[3-2]]></label>';
  strTarget += '<value><![CDATA[10]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<depth><![CDATA[1]]></depth>';
  strTarget += '<label><![CDATA[4]]></label>';
  strTarget += '<value><![CDATA[11]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';
  $p.data.create(strTarget);
};

/********************************************************
    Create Component 
*******************************************************/

scwin.getTestGroup = function ($p, cParent = '') {
  if (cParent == '') return document.querySelector('.tc_group_basic');
  return cParent;
};
scwin.createBasicGroup = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);

  // comp 생성
  let strTarget = '';
  let strButton = '';
  let strInput = '';
  let strGroup = '';

  // 조건, 이벤트 설정
  strTarget += '<xf:group ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:400px; height:300px; background-color:var(--ws-green-500);"></xf:group>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, 'group', strTarget, grp_comp);
  strInput += '<xf:input ' + scwin.strNameSpace + ' id="" style="width:144px; height:21px; " initValue="input"></xf:input>';

  // child 생성
  scwin.input1 = await $p.dynamicCreate('input1', 'input', strInput, scwin[cID]);
  strGroup += '<xf:group ' + scwin.strNameSpace + ' style="width:150px; height:100px; background-color:var(--ws-orange-100);" text="group"></xf:group>';
  scwin.group1 = await $p.dynamicCreate('group1', 'group', strGroup, scwin[cID]);
  strButton += '<w2:button ' + scwin.strNameSpace + ' style="width:80px; height:23px;" label="button"></w2:button>';
  scwin.button1 = await $p.dynamicCreate('button1', 'button', strButton, scwin[cID]);
};
scwin.createBasicButton = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:button ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:150px; height:50px;" label="button"></w2:button>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "button", strTarget, grp_comp);
};
scwin.createBasicInput = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:input ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' initValue="input" style="width:200px; height:30px;"></xf:input>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, 'input', strTarget, grp_comp);
};
scwin.createEmptyInput = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:input ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + '></xf:input>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, 'input', strTarget, grp_comp);
};
scwin.createBasicAccordion = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:accordion ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:200px; height:300px;">';
  strTarget += '<w2:panels style="" id="panels1" class="">';
  strTarget += '<w2:panelTitle style="" id="panelTitle1" label="1"></w2:panelTitle>';
  strTarget += '<w2:panelContent style="" id="panelContent1">';
  strTarget += '<w2:button style="width:80px; height:23px; " id="" label="panel1"></w2:button>';
  strTarget += '</w2:panelContent>';
  strTarget += '</w2:panels>';
  strTarget += '<w2:panels style="" id="panels2" class="">';
  strTarget += '<w2:panelTitle style="" id="panelTitle2" label="2"></w2:panelTitle>';
  strTarget += '<w2:panelContent style="" id="panelContent2">';
  strTarget += '<w2:button style="width:80px; height:23px; " id="" label="panel2"></w2:button>';
  strTarget += '</w2:panelContent>';
  strTarget += '</w2:panels>';
  strTarget += '<w2:panels style="" id="panels3" class="">';
  strTarget += '<w2:panelTitle style="" id="panelTitle3" label="3"></w2:panelTitle>';
  strTarget += '<w2:panelContent style="" id="panelContent3">';
  strTarget += '<w2:button style="width:80px; height:23px; " id="" label="panel3"></w2:button>';
  strTarget += '</w2:panelContent>';
  strTarget += '</w2:panels>';
  strTarget += '</w2:accordion>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "accordion", strTarget, grp_comp);
};
scwin.createBasicAnchor = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:anchor ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:200px; height:50px; background-color:var(--ws-gray-300);">';
  strTarget += '<xf:label><![CDATA[Insert Text]]></xf:label>';
  strTarget += '</w2:anchor>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "anchor", strTarget, grp_comp);
};
scwin.createBasicAutoComplete = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:autoComplete ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:200px; height:30px;">';
  strTarget += '<w2:choices>';
  strTarget += '<w2:itemset nodeset="data:gdl_autocomplete">';
  strTarget += '<w2:label ref="label"></w2:label>';
  strTarget += '<w2:value ref="value"></w2:value>';
  strTarget += '</w2:itemset>';
  strTarget += '</w2:choices>';
  strTarget += '</w2:autoComplete>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "autoComplete", strTarget, grp_comp);
};
scwin.createBasicCalendar = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:calendar ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="" style="width:280px; height:300px; "></w2:calendar>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "calendar", strTarget, grp_comp);
  scwin[cID].gotoCalendar("20251111");
};
scwin.createBasicCheckBox = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:select ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' selectedindex="-1" appearance="full" style="background-color:var(--ws-gray-300);">';
  strTarget += '<xf:choices>';
  strTarget += '<xf:itemset nodeset="data:gdl_checkbox">';
  strTarget += '<xf:label ref="label"></xf:label>';
  strTarget += '<xf:value ref="value"></xf:value>';
  strTarget += '</xf:itemset>';
  strTarget += '</xf:choices>';
  strTarget += '</xf:select>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "checkbox", strTarget, grp_comp);
};
scwin.createBasicCheckComboBox = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:checkcombobox ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:200px; height:30px;">';
  strTarget += '<xf:choices>';
  strTarget += '<xf:itemset nodeset="data:gdl_checkcombobox">';
  strTarget += '<xf:label ref="label"></xf:label>';
  strTarget += '<xf:value ref="value"></xf:value>';
  strTarget += '</xf:itemset>';
  strTarget += '</xf:choices>';
  strTarget += '</xf:checkcombobox>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "checkcombobox", strTarget, grp_comp);
};
scwin.createBasicDataList = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="' + cID + '" baseNode="list" repeatNode="map">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="col1" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="col2" name="name2" dataType="text"></w2:column>';
  strTarget += '<w2:column id="col3" name="name3" dataType="text"></w2:column>';
  strTarget += '<w2:column id="col4" name="name4" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<col1><![CDATA[col1_1]]></col1>';
  strTarget += '<col2><![CDATA[col2_1]]></col2>';
  strTarget += '<col3><![CDATA[col3_1]]></col3>';
  strTarget += '<col4><![CDATA[col4_1]]></col4>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<col1><![CDATA[col1_2]]></col1>';
  strTarget += '<col2><![CDATA[col2_2]]></col2>';
  strTarget += '<col3><![CDATA[col3_2]]></col3>';
  strTarget += '<col4><![CDATA[col4_2]]></col4>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<col1><![CDATA[col1_3]]></col1>';
  strTarget += '<col2><![CDATA[col2_3]]></col2>';
  strTarget += '<col3><![CDATA[col3_3]]></col3>';
  strTarget += '<col4><![CDATA[col4_3]]></col4>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<col1><![CDATA[col1_4]]></col1>';
  strTarget += '<col2><![CDATA[col2_4]]></col2>';
  strTarget += '<col3><![CDATA[col3_4]]></col3>';
  strTarget += '<col4><![CDATA[col4_4]]></col4>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';

  // target 생성
  $p.data.create(strTarget);
  let arrResult = $p.data.getAllDataCollection("object");
  scwin[cID] = arrResult[arrResult.length - 1];
};

// ref 바인드 용 동적 생성 (dataMap)
scwin.createBasicDataMap = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:dataMap ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="' + cID + '" baseNode="map">';
  strTarget += '<w2:keyInfo>';
  strTarget += '<w2:key dataType="text" id="key1" name="name1"></w2:key>';
  strTarget += '<w2:key dataType="text" id="key2" name="name2"></w2:key>';
  strTarget += '<w2:key dataType="text" id="key3" name="name3"></w2:key>';
  strTarget += '<w2:key dataType="text" id="key4" name="name4"></w2:key>';
  strTarget += '</w2:keyInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<key1><![CDATA[dm_data1]]></key1>';
  strTarget += '<key2><![CDATA[dm_data2]]></key2>';
  strTarget += '<key3><![CDATA[dm_data3]]></key3>';
  strTarget += '<key4><![CDATA[dm_data4]]></key4>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataMap>';
  $p.data.create(strTarget);
};
scwin.createDynamicDataList = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '', cRowCount = 4) {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="' + cID + '" baseNode="list" repeatNode="map">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column id="col1" name="name1" dataType="text"></w2:column>';
  strTarget += '<w2:column id="col2" name="name2" dataType="text"></w2:column>';
  strTarget += '<w2:column id="col3" name="name3" dataType="text"></w2:column>';
  strTarget += '<w2:column id="col4" name="name4" dataType="text"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';

  // target 생성
  $p.data.create(strTarget);
  let arrResult = $p.data.getAllDataCollection("object");
  scwin[cID] = arrResult[arrResult.length - 1];
  let jsonData = [];
  for (let i = 1; i <= cRowCount; i++) {
    jsonData.push({
      "col1": "col1_" + i,
      "col2": "col2_" + i,
      "col3": "col3_" + i,
      "col4": "col4_" + i
    });
  }
  scwin[cID].setJSON(jsonData, false);
};
scwin.createBasicDatePicker = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:datePicker ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:300px; height:200px; position:relative; " id=""></w2:datePicker>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "datePicker", strTarget, grp_comp);
  scwin[cID].setValue("20250101");
};
scwin.createBasicEditor = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:editor ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:500px; height:300px; " id=""></w2:editor>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "editor", strTarget, grp_comp);
};
scwin.createBasicFlipToggle = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:fliptoggle ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:80px; height:30px; position:relative; " id="">';
  strTarget += '<w2:on label="On" value="On"></w2:on>';
  strTarget += '<w2:off label="Off" value="Off"></w2:off>';
  strTarget += '</w2:fliptoggle>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "fliptoggle", strTarget, grp_comp);
};
scwin.createBasicFusionChart = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:fusionchart ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' seriesType="simple" drawType="javascript" runflashAt="IE6,IE7,IE8" chartType="Column2D"	style="width:300px; height:200px;" id="" ref="data:dlt_cData" labelNode="label" valueNode="value" seriesNode="series"></w2:fusionchart>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "fusionchart", strTarget, grp_comp);
};
scwin.createBasicFwBulletChart = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:fwBulletChart ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' chartType="vbullet" style="width:200px; height:300px;" id="" ref="data:dlt_cData" valueNode="value" targetNode="target"></w2:fwBulletChart>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "fwBulletChart", strTarget, grp_comp);
};
scwin.createBasicFwFunnelChart = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:fwFunnelChart ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' seriesType="simple" style="width:500px; height:300px; " id="" ref="data:dlt_cData" labelNode="label" valueNode="value"></w2:fwFunnelChart>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "fwFunnelChart", strTarget, grp_comp);
};
scwin.createBasicFwGanttChart = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:fwGanttChart ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' quarterNames="1분기,2분기,3분기,4분기" style="width:500px; height:300px; " id="" timeBase="date" monthNames="1월,2월,3월,4월,5월,6월,7월,8월,9월,10월,11월,12월" dateformat="yyyyMMdd" ref="data:dlt_cData" taskNode="tasks" taskIdNode="taskid" startDateNode="startTime" endDateNode="endTime" processNode="process">';
  strTarget += '</w2:fwGanttChart>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "fwGanttChart", strTarget, grp_comp);
};
scwin.createBasicFwGaugeChart = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:fwGaugeChart ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' chartType="angulargauge" style="width:500px; height:300px; " id="" ref="data:dlt_cData" valueNode="value"></w2:fwGaugeChart>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "fwGaugeChart", strTarget, grp_comp);
};
scwin.createBasicFwPyramidChart = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:fwPyramidChart ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' seriesType="simple" style="width:500px; height:300px; " id="" ref="data:dlt_cData" labelNode="label" valueNode="value"></w2:fwPyramidChart>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "fwPyramidChart", strTarget, grp_comp);
};
scwin.createBasicFwRealTimeChart = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:fwRealtimeChart ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' timeformat="HH:mm:ss" chartType="realtimearea" style="width:500px; height:300px; " id="" ref="data:dlt_cData" labelNode="label" valueNode="value" seriesNode="series"></w2:fwRealtimeChart>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "fwRealtimeChart", strTarget, grp_comp);
};
scwin.createBasicFwSparkChart = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:fwSparkChart ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' seriesType="simple" chartType="sparkline" style="width:500px; height:300px; " id="" ref="data:dlt_cData" labelNode="label" valueNode="value"></w2:fwSparkChart>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "fwSparkChart", strTarget, grp_comp);
};
scwin.createBasicGenerator = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:generator ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:300px;height:200px;">';
  strTarget += '<xf:group style="height:50px;background-color:var(--ws-green-100);" id="">';
  strTarget += '<w2:button style="width:80px; height:23px; " id="" label="button"></w2:button>';
  strTarget += '</xf:group>';
  strTarget += '</w2:generator>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "generator", strTarget, grp_comp);
  for (var i = 0; i < 3; i++) {
    scwin[cID].insertChild();
  }
};
scwin.createBasicIframe = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:iframe ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:500px; height:300px;" id=""></w2:iframe>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "iframe", strTarget, grp_comp);
};
scwin.createBasicImage = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:image ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' src="/img/png.png"></xf:image>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "image", strTarget, grp_comp);
};
scwin.createBasicInputCalendar = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:inputCalendar ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="" style="width:150px; height:23px;"></w2:inputCalendar>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "inputCalendar", strTarget, grp_comp);
  scwin[cID].setValue("20251111");
};
scwin.createEmptyInputCalendar = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:inputCalendar ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + '></w2:inputCalendar>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "inputCalendar", strTarget, grp_comp);
  scwin[cID].setValue("");
};
scwin.createOrginalDataList = async function ($p, cList = '', eHandler = '', cID = 'gdl_org', cParent = '') {
  if (cID === '') cID = 'gdl_org';
  let strTarget = '';
  strTarget += '<w2:dataList ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="' + cID + '" baseNode="list" repeatNode="map" style="">';
  strTarget += '<w2:columnInfo>';
  strTarget += '<w2:column dataType="text" id="cat1" name="category1"></w2:column>';
  strTarget += '<w2:column dataType="text" id="cat2" name="category2"></w2:column>';
  strTarget += '<w2:column dataType="text" id="label" name="display"></w2:column>';
  strTarget += '<w2:column dataType="text" id="value" name="code"></w2:column>';
  strTarget += '</w2:columnInfo>';
  strTarget += '<w2:data use="true">';
  strTarget += '<w2:row>';
  strTarget += '<cat1><![CDATA[A]]></cat1>';
  strTarget += '<cat2><![CDATA[A1]]></cat2>';
  strTarget += '<label><![CDATA[A-A1-1]]></label>';
  strTarget += '<value><![CDATA[AA11]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<cat1><![CDATA[A]]></cat1>';
  strTarget += '<cat2><![CDATA[A1]]></cat2>';
  strTarget += '<label><![CDATA[A-A1-2]]></label>';
  strTarget += '<value><![CDATA[AA12]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<cat1><![CDATA[A]]></cat1>';
  strTarget += '<cat2><![CDATA[A2]]></cat2>';
  strTarget += '<label><![CDATA[A-A2-1]]></label>';
  strTarget += '<value><![CDATA[AA21]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<cat1><![CDATA[A]]></cat1>';
  strTarget += '<cat2><![CDATA[A2]]></cat2>';
  strTarget += '<label><![CDATA[A-A2-2]]></label>';
  strTarget += '<value><![CDATA[AA22]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<cat1><![CDATA[B]]></cat1>';
  strTarget += '<cat2><![CDATA[B1]]></cat2>';
  strTarget += '<label><![CDATA[B-B1-1]]></label>';
  strTarget += '<value><![CDATA[BB11]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<cat1><![CDATA[B]]></cat1>';
  strTarget += '<cat2><![CDATA[B1]]></cat2>';
  strTarget += '<label><![CDATA[B-B1-2]]></label>';
  strTarget += '<value><![CDATA[BB12]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<cat1><![CDATA[B]]></cat1>';
  strTarget += '<cat2><![CDATA[B2]]></cat2>';
  strTarget += '<label><![CDATA[B-B2-1]]></label>';
  strTarget += '<value><![CDATA[BB21]]></value>';
  strTarget += '</w2:row>';
  strTarget += '<w2:row>';
  strTarget += '<cat1><![CDATA[B]]></cat1>';
  strTarget += '<cat2><![CDATA[B2]]></cat2>';
  strTarget += '<label><![CDATA[B-B2-2]]></label>';
  strTarget += '<value><![CDATA[BB22]]></value>';
  strTarget += '</w2:row>';
  strTarget += '</w2:data>';
  strTarget += '</w2:dataList>';

  // target 생성
  $p.data.create(strTarget);
  let arrResult = $p.data.getAllDataCollection("object");
  scwin[cID] = arrResult[arrResult.length - 1];
};
scwin.createBasicLinkedDataList = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let strTarget = '';
  strTarget += '<w2:linkedDataList ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="' + cID + '" bind="gdl_org">';
  strTarget += '<w2:condition type="filter"><![CDATA[cat1==ref("data:gdl_org.cat1")]]></w2:condition>';
  strTarget += '<w2:condition type="sort"><![CDATA[]]></w2:condition>';
  strTarget += '</w2:linkedDataList>';

  // target 생성
  $p.data.create(strTarget);
  let arrResult = $p.data.getAllDataCollection("object");
  scwin[cID] = arrResult[arrResult.length - 1];
};
scwin.createOriginalGridView = async function ($p, cList = '', eHandler = '', cID = 'gridView1', cParent = '') {
  if (cID === '') cID = 'gridView1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:gridView ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' autoFit="allColumn" checkAllType="false" dataList="data:gdl_org" rowStatusVisible="true" sortable="true" style="width:500px; height:200px;" focusMode="row" syncRowPositionOption="style">';
  strTarget += '<w2:caption style="" id="caption1" value="this is a grid caption."></w2:caption>';
  strTarget += '<w2:header style="" id="header1">';
  strTarget += '<w2:row style="" id="row1">';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column4" value="cat1"></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column3" value="cat2" useFilter=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column2" value="label"></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column1" value="value"></w2:column>';
  strTarget += '</w2:row>';
  strTarget += '</w2:header>';
  strTarget += '<w2:gBody style="" id="gBody1">';
  strTarget += '<w2:row style="" id="row2">';
  strTarget += '<w2:column width="70" style="" inputType="text" id="cat1" value=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="cat2" value=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="label" value=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="value" value=""></w2:column>';
  strTarget += '</w2:row>';
  strTarget += '</w2:gBody>';
  strTarget += '</w2:gridView>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "gridView", strTarget, grp_comp);

  // org DataList 선택
  scwin["gdl_org"].setRowPosition(0);
};
scwin.createLinkedGridView = async function ($p, cList = '', eHandler = '', cID = 'gridView2', cParent = '') {
  if (cID === '') cID = 'gridView2';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:gridView ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' autoFit="allColumn" checkAllType="false" dataList="data:target1" rowStatusVisible="true" sortable="true" style="width:500px; height:200px;" focusMode="row" syncRowPositionOption="style">';
  strTarget += '<w2:caption style="" id="caption1" value="this is a grid caption."></w2:caption>';
  strTarget += '<w2:header style="" id="header1">';
  strTarget += '<w2:row style="" id="row1">';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column4" value="cat1"></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column3" value="cat2"></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column2" value="label"></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column1" value="value"></w2:column>';
  strTarget += '</w2:row>';
  strTarget += '</w2:header>';
  strTarget += '<w2:gBody style="" id="gBody1">';
  strTarget += '<w2:row style="" id="row2">';
  strTarget += '<w2:column width="70" style="" inputType="text" id="cat1" value=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="cat2" value=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="label" value=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="value" value=""></w2:column>';
  strTarget += '</w2:row>';
  strTarget += '</w2:gBody>';
  strTarget += '</w2:gridView>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "gridView", strTarget, grp_comp);
};
scwin.createBasicMapChart = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:mapchart ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:300px; height:300px;"></w2:mapchart>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "mapchart", strTarget, grp_comp);
};
scwin.createBasicMultiSelect = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:select ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="" appearance="minimal" style="width:150px;">';
  strTarget += '<xf:choices>';
  strTarget += '<xf:itemset nodeset="data:gdl_multiselect">';
  strTarget += '<xf:label ref="label"></xf:label>';
  strTarget += '<xf:value ref="value"></xf:value>';
  strTarget += '</xf:itemset>';
  strTarget += '</xf:choices>';
  strTarget += '</xf:select>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "multiselect", strTarget, grp_comp);
};
scwin.createBasicMultiUpload = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:multiupload ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' mode="html5_transparent" style="width:150px; height:50px;background-color: silver;" id="" uploadButton="">';
  strTarget += '</w2:multiupload>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "multiupload", strTarget, grp_comp);
};
scwin.createBasicOutput = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:output ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="" label="output" style="width:200px;height:50px;background-color:var(--ws-gray-300);"></xf:output>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "output", strTarget, grp_comp);
};
scwin.createBasicPageControl = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:pageControl ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:150px; height:30px; " id=""></w2:pageControl>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "pageControl", strTarget, grp_comp);
};
scwin.createBasicPageList = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:pageList ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' pageSize="10" displayButtonType="display" id="" displayFormat="#" style="width:350px; height:21px; "></w2:pageList>';

  // pageList target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "pageList", strTarget, grp_comp);

  // 전체 페이지 수 설정(페이지 표시용). gridView 연동/데이터 페이징이 필요한 샘플은 샘플에서 직접 gridView 를 생성·연동한다.
  scwin[cID].setCount(10);

  // 생성된 pageList 반환 -> 래퍼가 scwin.target1 로 캡처(커스텀 id 등 대응)
  return scwin[cID];
};
scwin.createBasicPivot = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:pivot ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' dataList="dlt_pData" contextMenuGetter="getContext" style="width:600px;height:600px;margin-top:10px;margin-left:10px;margin-right:10px;" showZero="true" rows="col4,col5,col8" bodyTextAlign="right" totalTextAlign="right" cols="col6,col7" vals="col3" excludeHiddenList="" aggregatorName="Sum" useNumberFormat="true" digitsAfterDecimal="2" showGrandTotal="true" valuesAxis="row" class="mt35" ev:onRefresh="" ev:oncellclick="cellClick">';
  strTarget += '<w2:fieldInfo>';
  strTarget += '<w2:field id="col1" name="row" sortOrder="" ></w2:field>';
  strTarget += '<w2:field id="col2" name="total_bill" sortOrder="" ></w2:field>';
  strTarget += '<w2:field id="col3" name="tip" sortOrder="" ></w2:field>';
  strTarget += '<w2:field id="col4" name="sex" sortOrder="" ></w2:field>';
  strTarget += '<w2:field id="col5" name="smoker" sortOrder="" ></w2:field>';
  strTarget += '<w2:field id="col6" name="day" sortOrder="" ></w2:field>';
  strTarget += '<w2:field id="col7" name="time" sortOrder="" ></w2:field>';
  strTarget += '<w2:field id="col8" name="size" sortOrder="" ></w2:field>';
  strTarget += '</w2:fieldInfo>';
  strTarget += '</w2:pivot>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "pivot", strTarget, grp_comp);
};
scwin.createBasicProgressBar = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:progressbar ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' duration="1000" min="0" max="100" valueType="percent" step="10" progressClass="type2" style="width:200px; height:23px; " id="progressbar1">';
  strTarget += '</w2:progressbar>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "progressbar", strTarget, grp_comp);
  scwin[cID].set(70);
};
scwin.createBasicRadio = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:select1 ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' selectedIndex="-1" appearance="full" style="width:150px;background-color:var(--ws-gray-300);">';
  strTarget += '<xf:choices>';
  strTarget += '<xf:itemset nodeset="data:gdl_radio">';
  strTarget += '<xf:label ref="label"></xf:label>';
  strTarget += '<xf:value ref="value"></xf:value>';
  strTarget += '</xf:itemset>';
  strTarget += '</xf:choices>';
  strTarget += '</xf:select1>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "radio", strTarget, grp_comp);
};
scwin.createBasicRoundRectangle = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:roundRectangle ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' borderWidth="1" style="width:100px; height:100px; position:relative;background-color: silver;" id="" arcsize="15"></w2:roundRectangle>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "roundRectangle", strTarget, grp_comp);
};
scwin.createBasicScheduleCalendar = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:scheduleCalendar ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' selectable="" id="" style="width:500px; height:300px; " idColumn="" headerTitle="" ioFormat="yyyyMMdd" lang="" dayMaxEvents="true" editable="" headerRightBtn="" titleColumn="" startColumn="" dataList="" headerLeftBtn="">';
  strTarget += '</w2:scheduleCalendar>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "scheduleCalendar", strTarget, grp_comp);
};
scwin.createBasicSearchBox = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:searchbox ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:200px; height:30px;"></w2:searchbox>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "searchbox", strTarget, grp_comp);

  // scwin[cID].setValue("searchbox");

  scwin[cID].setValue("searchbox");
};
scwin.createEmptySearchBox = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:searchbox ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + '></w2:searchbox>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "searchbox", strTarget, grp_comp);
};
scwin.createBasicSelectBox = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:select1 ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:200px; height:30px;">';
  strTarget += '<xf:choices>';
  strTarget += '<xf:itemset nodeset="data:gdl_selectbox">';
  strTarget += '<xf:label ref="label"></xf:label>';
  strTarget += '<xf:value ref="value"></xf:value>';
  strTarget += '</xf:itemset>';
  strTarget += '</xf:choices>';
  strTarget += '</xf:select1>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "selectbox", strTarget, grp_comp);
};
scwin.createBasicSlideHide = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);

  // 1) slideHide 컨테이너 생성 (자식 없이)
  //    dynamicCreate 는 parseChild 설정 OFF 환경에서 inline 자식을 재생성(Target 재생성) 하지 못함.
  //    → 자식(토글 바 + 텍스트)은 아래에서 slideHideMain(.main) DOM 안에 개별 생성한다.
  let strTarget = '';
  strTarget += '<w2:slideHide ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' firstStatus="slide" hideEvent="" moveSize="" showSize="15" slideDirection="left" slideEvent="" style="position:relative;width:95px;height:182px;">';
  strTarget += '</w2:slideHide>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "slideHide", strTarget, grp_comp);

  // 2) slideHideMain(.main) 안에 자식 개별 생성 (부모로 .main DOM 전달 → slideHideMain 내부 배치)
  let mainEl = scwin[cID].main;
  let strBar = '<xf:group ' + scwin.strNameSpace + ' class="" ev:onclick="fn_slideHide" id="" style="position:absolute;left:0px;height:100%;width: 15px;background-color: #bbb;"></xf:group>';
  await $p.dynamicCreate('', 'group', strBar, mainEl);
  let strTxt1 = '<w2:textbox ' + scwin.strNameSpace + ' id="" label="Favorite" style="padding:10px 4px;margin-left:15px;color:#bbb;font-weight:bold;background-color:#fff;border-bottom:4px double #ccc;"></w2:textbox>';
  await $p.dynamicCreate('', 'textbox', strTxt1, mainEl);
  let strTxt2 = '<w2:textbox ' + scwin.strNameSpace + ' id="" label="- Fruits" style="padding:6px 4px;margin-left:15px;color:#bbb;font-weight:bold;background-color:#fff;"></w2:textbox>';
  await $p.dynamicCreate('', 'textbox', strTxt2, mainEl);
  let strTxt3 = '<w2:textbox ' + scwin.strNameSpace + ' id="" label="- Fish" style="padding:6px 4px;margin-left:15px;color:#bbb;font-weight:bold;background-color:#fff;"></w2:textbox>';
  await $p.dynamicCreate('', 'textbox', strTxt3, mainEl);
  fn_slideHide = function (e) {
    // 컴포넌트의 실제 slide 상태(isOpen)로 토글 판단.
    // (기존 setUserData/getUserData('edu_flag') 방식은 클릭 경로에서 상태가 desync 되어 1회만 동작함)
    if (scwin.target1.isOpen($p)) {
      scwin.target1.startHide($p);
    } else {
      scwin.target1.startSlide($p);
    }
  };
};
scwin.createBasicSlider = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:slider ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:200px; height:30px; position:relative; " id=""></w2:slider>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "slider", strTarget, grp_comp);
};
scwin.createBasicSpan = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:span ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' label="Insert Text" style="height:23px;background-color:var(--ws-gray-300);"></w2:span>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "span", strTarget, grp_comp);
};
scwin.createEmptySpan = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:span ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + '></w2:span>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "span", strTarget, grp_comp);
};
scwin.createBasicSpinner = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:spinner ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' skin="type1" buttonSize="30" inputReadOnly="false" id=""></w2:spinner>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "spinner", strTarget, grp_comp);
};
scwin.createBasicSwitch = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  let strCase1 = '';
  let strCase2 = '';
  strTarget += '<xf:switch ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="position: relative ;width: 200px;height: 200px;">';
  strTarget += '<xf:case style="position:absolute;top:2px;left:2px;width:196px;height:196px;" id="case1">';
  strTarget += '<w2:button style="width:80px; height:23px; " id="case1_button1" label="case1"></w2:button>';
  strTarget += '</xf:case>';
  strTarget += '<xf:case style="position:absolute;top:2px;left:2px;width:196px;height:196px;" id="case2">';
  strTarget += '<xf:input id="case2_input1" style="width:144px; height:21px; " initValue="case2"></xf:input>';
  strTarget += '</xf:case>';
  strTarget += '</xf:switch>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "switch", strTarget, grp_comp);
  strCase1 += '<w2:button ' + scwin.strNameSpace + ' style="height:23px;" id="case1" label="setSelectedIndex(0)" ev:onclick="scwin.btn_case1_onclick"></w2:button>';
  scwin.btn_case1 = await $p.dynamicCreate("btn_case1", "button", strCase1, grp_comp);
  strCase2 += '<w2:button ' + scwin.strNameSpace + ' style="height:23px;" id="case2" label="setSelectedIndex(1)" ev:onclick="scwin.btn_case2_onclick"></w2:button>';
  scwin.btn_case2 = await $p.dynamicCreate("btn_case2", "button", strCase2, grp_comp);
};
scwin.createBasicTabControl = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:tabControl ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="" alwaysDraw="false" style="width:500px;height:200px;">';
  strTarget += '<w2:tabs disabled="false" style="height:40px;" id="tabs1" label="Tabs1"></w2:tabs>';
  strTarget += '<w2:tabs disabled="false" style="height:40px" id="tabs2" label="Tabs2"></w2:tabs>';
  strTarget += '<w2:tabs disabled="false" style="height:40px" id="tabs3" label="Tabs3"></w2:tabs>';
  strTarget += '<w2:content alwaysDraw="false" style="height:160px;" id="content1">';
  strTarget += '<w2:button style="width:80px; width:130px; height:50px;" id="content1_child" label="content1_child"></w2:button>';
  strTarget += '</w2:content>';
  strTarget += '<w2:content alwaysDraw="false" style="height:160px" id="content2">';
  strTarget += '<xf:input id="content2_child" style="width:144px; height:21px; " initValue="content2_child"></xf:input>';
  strTarget += '</w2:content>';
  strTarget += '<w2:content alwaysDraw="false" style="height:160px" id="content3">';
  strTarget += '<w2:textbox id="content3_child" label="content3_child" style="width:200px; height:50px; background-color:var(--ws-gray-300);"></w2:textbox>';
  strTarget += '</w2:content>';
  strTarget += '</w2:tabControl>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "tabControl", strTarget, grp_comp);
};
scwin.createBasicTextArea = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:textarea ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="" style="width:300px; height:100px; "></xf:textarea>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "textarea", strTarget, grp_comp);
  scwin[cID].setValue("textarea\nline1\nline2");
};
scwin.createBasicTextBox = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:textbox ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="" label="textbox" style="width:200px; height:50px; background-color:var(--ws-gray-300);"></w2:textbox>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "textbox", strTarget, grp_comp);
};
scwin.createEmptyTextBox = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:textbox ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + '></w2:textbox>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "textbox", strTarget, grp_comp);
};
scwin.createBasicTreeView = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:treeview ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' id="" dataType="listed" tooltipGroupClass="false" style="width:200px; height:308px;">';
  strTarget += '<w2:itemset nodeset="data:gdl_treeview">';
  strTarget += '<w2:label ref="label"></w2:label>';
  strTarget += '<w2:value ref="value"></w2:value>';
  strTarget += '<w2:depth ref="depth"></w2:depth>';
  strTarget += '<w2:folder ref=""></w2:folder>';
  strTarget += '<w2:checkbox ref=""></w2:checkbox>';
  strTarget += '<w2:checkboxDisabled ref=""></w2:checkboxDisabled>';
  strTarget += '<w2:image ref=""></w2:image>';
  strTarget += '<w2:iconImage ref=""></w2:iconImage>';
  strTarget += '<w2:selectedImage ref=""></w2:selectedImage>';
  strTarget += '<w2:expandedImage ref=""></w2:expandedImage>';
  strTarget += '<w2:leafImage ref=""></w2:leafImage>';
  strTarget += '</w2:itemset>';
  strTarget += '</w2:treeview>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "treeview", strTarget, grp_comp);
};
scwin.createBasicTrigger = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:trigger ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' type="button" id="" style="width:150px; height:50px;">';
  strTarget += '<xf:label><![CDATA[trigger]]></xf:label>';
  strTarget += '</xf:trigger>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "trigger", strTarget, grp_comp);
};
scwin.createEmptyTrigger = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<xf:trigger ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + '>';
  strTarget += '<xf:label><![CDATA[trigger]]></xf:label>';
  strTarget += '</xf:trigger>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "trigger", strTarget, grp_comp);
};
scwin.createBasicUpload = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:upload ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' imageStyle="position:absolute;vertical-align:middle;word-wrap:break-word" inputStyle="vertical-align:middle;word-wrap:break-word" style="width:250px;" id="">';
  strTarget += '</w2:upload>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "upload", strTarget, grp_comp);
};
scwin.createBasicWframe = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:wframe ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:500px; height:300px; background-color:silver;" id="" src="/sample/common_link/wframe_link_1.xml"></w2:wframe>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "wframe", strTarget, grp_comp);
};
scwin.createBasicWidgetContainer = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:widgetContainer ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' mode="" style="width:300px;height:200px;" id="widgetContainer1" cols=""></w2:widgetContainer>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "widgetContainer", strTarget, grp_comp);
};
scwin.createBasicWindowContainer = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:windowContainer ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="width:500px; height:300px; position:relative;">';
  strTarget += '<w2:windowToolbar>';
  strTarget += '<w2:controlIconLayer>';
  strTarget += '<w2:controlIcon></w2:controlIcon>';
  strTarget += '<w2:controlIcon></w2:controlIcon>';
  strTarget += '<w2:controlIcon></w2:controlIcon>';
  strTarget += '<w2:controlIcon></w2:controlIcon>';
  strTarget += '<w2:controlIcon></w2:controlIcon>';
  strTarget += '</w2:controlIconLayer>';
  strTarget += '<w2:nameLayer></w2:nameLayer>';
  strTarget += '<w2:selectedNameLayer></w2:selectedNameLayer>';
  strTarget += '</w2:windowToolbar>';
  strTarget += '</w2:windowContainer>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "windowContainer", strTarget, grp_comp);
};
scwin.createBasicGridView = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);
  let strTarget = '';
  strTarget += '<w2:gridView ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' checkAllType="false" id="" style="width:500px;height:300px;">';
  strTarget += '<w2:caption style="" id="caption1" value="this is a grid caption."></w2:caption>';
  strTarget += '<w2:header style="" id="header1">';
  strTarget += '<w2:row style="" id="row1">';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column1" value="name1"></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column2" value="name2"></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column3" value="name3"></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="column4" value="name4"></w2:column>';
  strTarget += '</w2:row>';
  strTarget += '</w2:header>';
  strTarget += '<w2:gBody style="" id="gBody1">';
  strTarget += '<w2:row style="" id="row2">';
  strTarget += '<w2:column width="70" style="" inputType="text" id="col1" value=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="col2" value=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="col3" value=""></w2:column>';
  strTarget += '<w2:column width="70" style="" inputType="text" id="col4" value=""></w2:column>';
  strTarget += '</w2:row>';
  strTarget += '</w2:gBody>';
  strTarget += '</w2:gridView>';

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "gridView", strTarget, grp_comp);
};
scwin.createLabel = async function ($p, cList = '', eHandler = '', cID = 'target1', cParent = '') {
  if (cID === '') cID = 'target1';
  let grp_comp = scwin.getTestGroup($p, cParent);

  // cList 에서 label="..." 텍스트를 추출해 setLabel 로 주입(XML 속성 파싱 우회)하여
  //  escape 대상 문자(< > & " ')를 안전하게 표시한다. (createValidation 과 동일 방식)
  //  - cList 가 label 속성만일 때 적용. label 미포함/추가 속성 동반 시 기존 동작 유지.
  let labelText = null;
  let labelMatch = cList.match(/^\s*label\s*=\s*"([\s\S]*)"\s*$/);
  if (labelMatch !== null) labelText = labelMatch[1];
  let strTarget = '';
  if (labelText !== null) {
    // 라벨에 줄바꿈(\n) 포함 시 : 특수문자를 엔티티로 escape 후 \n 을 줄바꿈 태그로 변환하여 escape=false 로 렌더(줄바꿈 적용)
    //  - 미포함 시 : 기존 방식(특수문자 포함 여부로 escape 속성 결정)
    //  - 이 스크립트는 CDATA 가 아니므로 특수문자(< > & ")는 String.fromCharCode 로 생성해 엔티티 인코딩을 피한다.
    let escapeAttr;
    if (labelText.indexOf('\n') !== -1) {
      let amp = String.fromCharCode(38),
        lt = String.fromCharCode(60),
        gt = String.fromCharCode(62),
        quot = String.fromCharCode(34),
        apos = String.fromCharCode(39);
      labelText = labelText.split(amp).join(amp + 'amp;').split(lt).join(amp + 'lt;').split(gt).join(amp + 'gt;').split(quot).join(amp + 'quot;').split(apos).join(amp + '#39;').split('\n').join(lt + 'br/' + gt);
      escapeAttr = 'false';
    } else {
      escapeAttr = /[<>&"']/.test(labelText) ? 'true' : 'false';
    }
    strTarget += '<w2:textbox ' + scwin.strNameSpace + ' ' + eHandler + ' escape="' + escapeAttr + '" label="" style="margin:5px;"></w2:textbox>';
  } else {
    strTarget += '<w2:textbox ' + scwin.strNameSpace + ' ' + cList + ' ' + eHandler + ' style="margin:5px;"></w2:textbox>';
  }

  // target 생성
  scwin[cID] = await $p.dynamicCreate(cID, "textbox", strTarget, grp_comp);

  // 추출한 라벨 텍스트를 setLabel 로 설정 (escape 속성에 따라 안전하게 렌더)
  //  - Target 재생성 등으로 동일 cID 컴포넌트가 이미 존재하면 dynamicCreate 가 undefined 를 반환하므로
  //    (기존 라벨은 그대로 유지) setLabel 크래시를 방지하기 위해 생성 성공 여부를 확인한다.
  if (labelText !== null && scwin[cID]) scwin[cID].setLabel(labelText);
};
scwin.createCList = function ($p, properties) {
  return Object.entries(properties).filter(([key, value]) => value !== "") // 빈 문자열 제외
  .map(([key, value]) => `${key}="${value}"`) // key="value" 형태로 변환
  .join(' '); // 공백으로 각 property 연결
};
scwin.createEList = function ($p, arrEvents, cID = 'target1') {
  if (arrEvents.length > 0) {
    let eventsString = '';
    for (var i = 0; i < arrEvents.length; i++) {
      // eventsString += `ev:${arrEvents[i]}="scwin.target1_${arrEvents[i]}" `
      eventsString += `ev:${arrEvents[i]}="scwin.${cID}_${arrEvents[i]}" `;
    }
    return eventsString;
  } else return '';
};
scwin.getTooltipInfo = function ($p, wf_body_bottom) {
  let objTooltip = document.querySelector('.w2balloonTip_label');
  let objTooltip_display = document.querySelector('.w2balloonTip');

  // tooltip 확인
  if (objTooltip) {
    wf_body_bottom.getObj("scwin").setReturnValue("tooltip textContent : " + objTooltip.textContent);
    wf_body_bottom.getObj("scwin").setReturnValue("tooltip display : " + objTooltip_display.style.display);
  }
  let objTooltipDisplay = $('[class*="_tooltip"]');

  // tooltipDisplay 확인
  if (objTooltipDisplay.length != 0) {
    wf_body_bottom.getObj("scwin").setReturnValue("tooltipDisplay textContent : " + objTooltipDisplay[0].textContent);
    wf_body_bottom.getObj("scwin").setReturnValue("tooltipDisplay display : " + objTooltipDisplay[0].style.display);
  }
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'}}]}]})