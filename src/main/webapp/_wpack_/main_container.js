/*amd /main_container.xml 4692 c4ec8a8a269011245262244254a8392fcc86d714736c82cf6f1ee9208e558a96 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'},E:[{T:1,N:'w2:dataList',A:{baseNode:'list',repeatNode:'map',id:'dlt_sampleList',saveRemovedData:'true'},E:[{T:1,N:'w2:columnInfo',E:[{T:1,N:'w2:column',A:{id:'depth',name:'depth',dataType:'number'}},{T:1,N:'w2:column',A:{id:'label',name:'label',dataType:'text'}},{T:1,N:'w2:column',A:{id:'component',name:'componrnt',dataType:'text'}}]}]}]},{T:1,N:'w2:workflowCollection'},{T:1,N:'xf:submission',A:{id:'sm_getSampleList',action:'/data/test_sample_list.json',method:'post',mediatype:'application/json',ref:'',target:'data:json,dlt_sampleList',encoding:'UTF-8',instance:'',replace:'',errorHandler:'',customHandler:'',mode:'asynchronous',processMsg:'','ev:submit':'','ev:submitdone':'scwin.sm_getSampleList_submitdone','ev:submiterror':'scwin.sm_getSampleList_submiterror',abortTrigger:''}}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.gVar = {
  "sel_tree_label": "",
  "sel_tree_depth": -1,
  "sel_tree_comp": ""
};
let obj_main = $p.main();
let obj_left = obj_main.wfTree.getObj("scwin");

// 테스트 샘플 목록 불러오기
scwin.onpageload = function () {
  $p.executeSubmission("sm_getSampleList");
};
scwin.sm_getSampleList_submitdone = function (e) {
  console.log("샘플 데이터 조회 성공:", "PASS PASS PASS PASS");
  return;
};
scwin.sm_getSampleList_submiterror = function (e) {
  console.log("샘플 데이터 조회 에러:", "FAIL FAIL FAIL FAIL ");
  return;
};

// // 탭 모두 닫기
// scwin.btn_tab_allclose_onclick = async function () {    
//     tac_main.deleteAllTabs();
//     obj_left.setSelectTree(null);
// };

// // 탭 생성
// scwin.createTab = async function() {   
//     tab_lb = scwin.gVar["sel_tree_label"];
//     tab_dt = scwin.gVar["sel_tree_depth"];
//     tab_cp = scwin.gVar["sel_tree_comp"]

//     // xml 파일인 경우만 Tab 생성
//     if(tab_dt == 2) {       
//         await tac_main.addTab(
//             "tacMain_" + tab_lb,
//             {
//                 "label": tab_lb,
//                 "openAction": "select"
//             },
//             {                
//                 "src": "/sample/"+tab_cp+"/"+ tab_lb,
//                 "wframe": true,
//             }
//         );

//         // 생성된 탭 선택 처리
//         await tac_main.setSelectedTabIndex("tacMain_" + tab_lb);
//     }    
// }

scwin.createWindow = async function () {
  let tab_lb = scwin.gVar["sel_tree_label"];
  let tab_dt = scwin.gVar["sel_tree_depth"];
  let tab_cp = scwin.gVar["sel_tree_comp"];

  // xml 파일인 경우만 windowContainer 생성
  if (tab_dt == 2) {
    var option = {
      title: tab_lb,
      src: "/sample/" + tab_cp + "/" + tab_lb,
      windowTitle: tab_lb,
      windowId: tab_lb,
      openAction: "selectWindow"
    };
    mBody_wc1.createWindow(option);
  }
};

// // 왼쪽 메뉴 show, hide 처리
// scwin.ico_toggleMenu_onclick = function (e) {
//     mLeft.toggleClass("col_left");
// };

// // 탭 변경 시 트리 선택 처리
// scwin.tac_main_onchange = function (tabId, index, userTabId) {
//     obj_left.setSelectTree(tac_main.getSelectedTabID());
// };

// // 탭이 모두 닫힌 경우 트리 처리
// scwin.tac_main_ontabclose = function (tabId, index, userTabId) {
//     if (tac_main.getSelectedTabID() == null)
//         obj_left.setSelectTree(null);
// };
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{style:'',id:'gMain',class:'tc_main'},E:[{T:1,N:'xf:group',A:{adaptiveThreshold:'',style:'',id:'mLeft',class:'tc_left'},E:[{T:1,N:'xf:group',A:{style:'',id:''},E:[{T:1,N:'w2:textbox',A:{id:'',label:'테스트 샘플 목록',style:'',class:'tc_tbx_label_1'}}]},{T:1,N:'w2:wframe',A:{src:'/frame/page/left_container.xml',style:'',id:'wfTree'}}]},{T:1,N:'xf:group',A:{style:'',id:'mBody',class:'tc_body'},E:[{T:1,N:'w2:windowContainer',A:{id:'mBody_wc1',style:'width:100%; height:100%; position:relative;',windowMaxNum:'1000'},E:[{T:1,N:'w2:windowToolbar',E:[{T:1,N:'w2:controlIconLayer',E:[{T:1,N:'w2:controlIcon'},{T:1,N:'w2:controlIcon'},{T:1,N:'w2:controlIcon'},{T:1,N:'w2:controlIcon'},{T:1,N:'w2:controlIcon'}]},{T:1,N:'w2:nameLayer'},{T:1,N:'w2:selectedNameLayer'}]}]}]}]}]}]}]})