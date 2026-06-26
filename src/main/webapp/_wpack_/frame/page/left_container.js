/*amd /frame/page/left_container.xml 3822 27d127e89c5637497d7e8d806cf9ce4c70cbd1bf1ae4de24951a515130e8f1c6 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',A:{},E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'},E:[{T:1,N:'w2:aliasDataList',A:{studioSrc:'/test_mainContainer.xml',scope:'../dlt_sampleList',id:'adl_sampleList'}}]},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){let selRowLabel = "";
scwin.onpageload = function () {};

// 트리 항목 선택 처리
scwin.setSelectTree = function (tabId) {
  if (tabId != null && tabId != "") {
    const modTabId = tabId.replace(/^tacMain_/, '');
    trv_1.findNodeByValue(modTabId, true);
    selRowLabel = modTabId;
  } else {
    trv_1.deselectNode();
  }
};

// 부모 컴포넌트 찾기
scwin.findComponent = function (tree_lb) {
  arrList = adl_sampleList.getMatchedData("label", tree_lb);
  return arrList;
};

// 트리 항목 클릭 처리
scwin.trv_1_onlabelclick = function (value, node, index) {
  obj_main = $p.main();
  obj_main.scwin.gVar["sel_tree_label"] = node.label;
  obj_main.scwin.gVar["sel_tree_depth"] = node.depth;
  arrList = scwin.findComponent(node.label);
  strComp = arrList[0][2];
  obj_main.scwin.gVar["sel_tree_comp"] = strComp;

  // 메인의 탭 생성 함수 호출    
  // obj_main.scwin.createTab();
  obj_main.scwin.createWindow();
  scwin.setSelectTree(node.label);
};

// 검색 처리
scwin.ico_search_onclick = function (e) {
  adl_sampleList.clearFilter();
  let keyword = ibx_keyword.getValue();
  const filters = [{
    colIndex: "depth",
    key: 1,
    exactMatch: true,
    condition: "and"
  }, {
    colIndex: "label",
    key: keyword,
    exactMatch: false,
    condition: "or"
  }];
  filters.forEach(filterOptions => {
    filterOptions.type = "row";
    adl_sampleList.setColumnFilter(filterOptions);
  });
  trv_1.deselectNode();
  scwin.setSelectTree(selRowLabel);
};

// 새로고침 처리
scwin.ico_refresh_onclick = function (e) {
  adl_sampleList.clearFilter();
  ibx_keyword.setValue("");
  scwin.setSelectTree(selRowLabel);
};

// 엔터키 검색 처리
scwin.ibx_keyword_onkeydown = function (e) {
  if (e.keyCode == 13) {
    scwin.ico_search_onclick();
  }
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'',id:'grp_search',class:'tc_sample_search'},E:[{T:1,N:'xf:input',A:{id:'ibx_keyword',style:'','ev:onkeydown':'scwin.ibx_keyword_onkeydown',class:'tc_search_keyword'}},{T:1,N:'xf:image',A:{src:'/cm/images/base/ico_search.svg',style:'',id:'ico_search','ev:onclick':'scwin.ico_search_onclick',class:'tc_search_button'}},{T:1,N:'xf:image',A:{src:'/cm/images/base/ico_refresh.svg',style:'',id:'ico_refresh','ev:onclick':'scwin.ico_refresh_onclick',class:'tc_refresh_button'}}]},{T:1,N:'w2:treeview',A:{checkAllChildNodes:'true',class:'tc_tree_view',dataType:'listed',hierarchy:'true',id:'trv_1',lineShow:'',showCheckbox:'true',showTreeDepth:'',style:'',toggleEvent:'onclick',useDrag:'true','ev:onlabelclick':'scwin.trv_1_onlabelclick'},E:[{T:1,N:'w2:itemset',A:{nodeset:'data:adl_sampleList'},E:[{T:1,N:'w2:label',A:{ref:'label'}},{T:1,N:'w2:value',A:{ref:'label'}},{T:1,N:'w2:depth',A:{ref:'depth'}},{T:1,N:'w2:folder',A:{ref:''}},{T:1,N:'w2:checkbox',A:{ref:''}},{T:1,N:'w2:checkboxDisabled',A:{ref:''}},{T:1,N:'w2:image',A:{ref:''}},{T:1,N:'w2:iconImage',A:{ref:''}},{T:1,N:'w2:selectedImage',A:{ref:''}},{T:1,N:'w2:expandedImage',A:{ref:''}},{T:1,N:'w2:leafImage',A:{ref:''}}]}]}]}]}]})