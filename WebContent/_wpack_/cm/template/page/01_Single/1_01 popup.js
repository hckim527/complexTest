/*amd /cm/template/page/01_Single/1_01 popup.xml 2782 c559f17d26afffe1bee42e7ab95cf8173f53593cfabf90c1699d2721d272b11f */
define({declaration:{A:{version:'1.0',encoding:'UTF-8',standalone:'no'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'},E:[{T:1,N:'w2:dataList',A:{baseNode:'list',id:'dataList1',repeatNode:'map',saveRemovedData:'true',style:''},E:[{T:1,N:'w2:columnInfo',E:[{T:1,N:'w2:column',A:{dataType:'text',id:'col1',name:'name1'}},{T:1,N:'w2:column',A:{dataType:'text',id:'col2',name:'name2'}},{T:1,N:'w2:column',A:{dataType:'text',id:'col3',name:'name3'}},{T:1,N:'w2:column',A:{dataType:'text',id:'col4',name:'name4'}},{T:1,N:'w2:column',A:{dataType:'text',id:'col5',name:'name5'}},{T:1,N:'w2:column',A:{dataType:'text',id:'col6',name:'name6'}},{T:1,N:'w2:column',A:{dataType:'text',id:'col7',name:'name7'}},{T:1,N:'w2:column',A:{dataType:'text',id:'col8',name:'name8'}},{T:1,N:'w2:column',A:{dataType:'text',id:'col9',name:'name9'}},{T:1,N:'w2:column',A:{dataType:'text',id:'col10',name:'name10'}}]},{T:1,N:'w2:data',A:{use:'true'},E:[{T:1,N:'w2:row'},{T:1,N:'w2:row'},{T:1,N:'w2:row'},{T:1,N:'w2:row'},{T:1,N:'w2:row'},{T:1,N:'w2:row'},{T:1,N:'w2:row'},{T:1,N:'w2:row'},{T:1,N:'w2:row'},{T:1,N:'w2:row'}]}]}]},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{type:'text/javascript',lazy:'false'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {};
scwin.openPopup_onclick = function (e) {
  requires("uiplugin.popup");
  var winWid = $(window).width();
  var winHei = $(window).height();
  var popWid = 1000;
  var popHei = 580;
  var sumLeft = (winWid - popWid) / 2;
  var sumTop = (winHei - popHei) / 2;
  var opts = {
    "id": "popup_window_wframe",
    "type": "litewindow",
    "width": popWid + "px",
    "height": popHei + "px",
    "top": sumTop,
    "left": sumLeft,
    "popupName": "팝업타이틀",
    "modal": true,
    "useIFrame": false,
    "title": "focusTest",
    "useATagBtn": true,
    "frameMode": "wframe"
  };
  $p.openPopup("/cm/template/page/02_Multi/2_01 search_grid.xml", opts);
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{id:'',style:'',class:'sub_contents'},E:[{T:1,N:'xf:group',A:{class:'titbox',id:'',style:''},E:[{T:1,N:'w2:textbox',A:{class:'',id:'',label:'팝업',style:'',tagname:'h3'}},{T:1,N:'xf:group',A:{id:'',class:'rt'},E:[{T:1,N:'xf:trigger',A:{'ev:onclick':'scwin.openPopup_onclick',style:'',id:'',type:'button',class:'btn_cm '},E:[{T:1,N:'xf:label',E:[{T:4,cdata:'팝업'}]}]}]}]}]}]}]}]})