/*amd /sample/common_link/p_getPopupWindowList_sub.xml 1119 368f3964f240ec954c437f173019651b66240a0d728d093bf5bb426b1716b019 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:'openPopupInWFrame'}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.openPopupInWFrame = function () {
  $p.openPopup("/sample/common_link/util_createPopup_1.xml", {
    id: "popup_wframe",
    type: "iframePopup",
    width: "300px",
    height: "200px",
    top: "150px",
    left: "300px",
    popupName: "popup_wframe (WFrame 내부)",
    modal: false
  });
};
}}}]}]},{T:1,N:'body',E:[{T:1,N:'xf:group',A:{style:'padding:10px;'},E:[{T:1,N:'w2:textbox',A:{id:'',label:'WFrame 내부 페이지 (wf_sub scope)',style:'font-size:12px;'}}]}]}]}]})