/*amd /sample/common_link/anchor_P_target_grandchild.xml 5014 7e33ae6764a40a132cfd8f037f1460348f0d6937b3c6d047e320efbb80590661 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',A:{},E:[{T:1,N:'w2:historyInfo',E:[{T:1,N:'w2:history',A:{}},{T:1,N:'w2:history',A:{}}]},{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){// 테스트 설명, 유효성 값 설정
scwin.tData = {
  "description": "[anchor > P > target]<br/>컴포넌트의 링크 기능으로 페이지가 이동되는 방법을 설정합니다.",
  "validation": ["페이지가 이동되는 방법을 문자열로 설정합니다.", "_self 설정 시 현재 창에서 페이지가 이동합니다.", "_blank 설정 시 새 창 또는 새 탭에서 페이지가 이동합니다.", "_parent 설정 시 프레임 구조일때 부모 프레임에서 페이지가 이동합니다.", "_top 설정 시 프레임 구조일때 최상위 프레임에서 페이지가 이동합니다.", "미설정 시 현재 창에서 페이지가 이동합니다.", "href 속성에 의해 페이지가 이동하지 않으면 적용되지 않습니다."]
};
scwin.onpageload = function () {
  // Global DataList 생성 호출
  $c.gcm.createCommonDatalist($p);

  // 테스트 설명, 유효성 생성
  wf_body_left.getObj("scwin").createValidation(scwin.tData);

  // comp 초기 생성
  scwin.comp_init();
};

// comp 생성
scwin.comp_init = async function () {
  // 기존 target 있으면 삭제
  if (typeof target1 !== 'undefined') {
    target1.remove();
  }
  let properties = {
    href: con_href.getText(),
    target: con_target.getText()
  };
  let cList = $c.gcm.createCList($p, properties);

  // comp 생성 함수 호출
  $c.gcm.createBasicAnchor($p, cList, 'ev:onclick="scwin.target1_onclick"');
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{class:'tc_body_main',id:'',style:'display: flex;'},E:[{T:1,N:'xf:group',A:{style:'',id:'body_left',class:'tc_body_left'},E:[{T:1,N:'w2:wframe',A:{id:'wf_body_left',src:'/frame/page/body_left.xml',style:''}}]},{T:1,N:'xf:group',A:{class:'tc_body_right',id:'body_right',style:''},E:[{T:1,N:'w2:wframe',A:{id:'wf_body_top',src:'/frame/page/body_top.xml',style:''}},{T:1,N:'xf:group',A:{id:'grp_condition'},E:[{T:1,N:'xf:group',A:{class:'tblbox',id:'',style:''},E:[{T:1,N:'xf:group',A:{adaptive:'layout',adaptiveThreshold:'600',class:'w2tb tbl',id:'',style:'',tagname:'table'},E:[{T:1,N:'w2:attributes',E:[{T:1,N:'w2:summary'}]},{T:1,N:'xf:group',A:{tagname:'colgroup'},E:[{T:1,N:'xf:group',A:{style:'width:150px;',tagname:'col'}},{T:1,N:'xf:group',A:{style:'',tagname:'col'}},{T:1,N:'xf:group',A:{style:'width:150px;',tagname:'col'}},{T:1,N:'xf:group',A:{style:'',tagname:'col'}}]},{T:1,N:'xf:group',A:{tagname:'tr',style:''},E:[{T:1,N:'xf:group',A:{tagname:'th',style:'',class:'w2tb_th'},E:[{T:1,N:'w2:textbox',A:{ref:'',style:'',userData2:'',id:'',label:'href',class:''}}]},{T:1,N:'xf:group',A:{tagname:'td',style:'',class:'w2tb_td'},E:[{T:1,N:'xf:select1',A:{id:'con_href',chooseOption:'',style:'',submenuSize:'auto',allOption:'',appearance:'minimal',ref:''},E:[{T:1,N:'xf:choices',E:[{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:4,cdata:'websquare.html?w2xPath=/sample/common_link/iframe_link_1.xml'}]},{T:1,N:'xf:value',E:[{T:4,cdata:'1'}]}]}]}]}]},{T:1,N:'xf:group',A:{tagname:'th',class:'w2tb_th '},E:[{T:1,N:'w2:attributes'},{T:1,N:'w2:textbox',A:{ref:'',style:'',userData2:'',id:'',label:'',class:''}},{T:1,N:'w2:textbox',A:{class:'',id:'',label:'',ref:'',style:'',userData2:''}},{T:1,N:'w2:textbox',A:{class:'',id:'',label:'target',ref:'',style:'',userData2:''}}]},{T:1,N:'xf:group',A:{tagname:'td',class:'w2tb_td'},E:[{T:1,N:'w2:attributes'},{T:1,N:'xf:select1',A:{allOption:'',appearance:'minimal',chooseOption:'',id:'con_target',ref:'',style:'',submenuSize:'auto'},E:[{T:1,N:'xf:choices',E:[{T:1,N:'xf:item',E:[{T:1,N:'xf:label'},{T:1,N:'xf:value',E:[{T:4,cdata:'1'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:4,cdata:'_self'}]},{T:1,N:'xf:value',E:[{T:4,cdata:'2'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:4,cdata:'_blank'}]},{T:1,N:'xf:value',E:[{T:4,cdata:'3'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:4,cdata:'_parent'}]},{T:1,N:'xf:value',E:[{T:4,cdata:'4'}]}]},{T:1,N:'xf:item',E:[{T:1,N:'xf:label',E:[{T:4,cdata:'_top'}]},{T:1,N:'xf:value',E:[{T:4,cdata:'5'}]}]}]}]}]}]}]}]}]},{T:1,N:'w2:wframe',A:{id:'wf_body_sample',src:'/frame/page/body_sample.xml',style:''}},{T:1,N:'xf:group',A:{id:'grp_parameter'},E:[{T:1,N:'xf:group',A:{style:'',id:'grp_etc'}}]},{T:1,N:'w2:wframe',A:{id:'wf_body_bottom',src:'/frame/page/body_bottom.xml',style:''}}]}]}]}]}]})