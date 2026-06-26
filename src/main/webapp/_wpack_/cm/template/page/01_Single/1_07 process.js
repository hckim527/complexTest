/*amd /cm/template/page/01_Single/1_07 process.xml 5861 4b7dce4174ac83ff6a99c796f32c4271aaef2b46a0934276f48e0a57ec777f92 */
define({declaration:{A:{version:'1.0',encoding:'UTF-8'}},E:[{T:1,N:'html',A:{xmlns:'http://www.w3.org/1999/xhtml','xmlns:ev':'http://www.w3.org/2001/xml-events','xmlns:w2':'http://www.inswave.com/websquare','xmlns:xf':'http://www.w3.org/2002/xforms'},E:[{T:1,N:'head',E:[{T:1,N:'w2:type',E:[{T:3,text:'COMPONENT'}]},{T:1,N:'w2:buildDate'},{T:1,N:'w2:MSA'},{T:1,N:'xf:model',E:[{T:1,N:'w2:dataCollection',A:{baseNode:'map'}},{T:1,N:'w2:workflowCollection'}]},{T:1,N:'w2:layoutInfo'},{T:1,N:'w2:publicInfo',A:{method:''}},{T:1,N:'script',A:{lazy:'false',type:'text/javascript'},E:[{T:4,cdata:function(scopeObj){with(scopeObj){scwin.onpageload = function () {};
scwin.setScreen = function (idx) {
  if (idx == 1) {
    step1.addClass("on");
    step2.removeClass("on");
    step3.removeClass("on");
    step4.removeClass("on");
    step5.removeClass("on");
  } else if (idx == 2) {
    step1.removeClass("on");
    step2.addClass("on");
    step3.removeClass("on");
    step4.removeClass("on");
    step5.removeClass("on");
  } else if (idx == 3) {
    step1.removeClass("on");
    step2.removeClass("on");
    step3.addClass("on");
    step4.removeClass("on");
    step5.removeClass("on");
  } else if (idx == 4) {
    step1.removeClass("on");
    step2.removeClass("on");
    step3.removeClass("on");
    step4.addClass("on");
    step5.removeClass("on");
  } else if (idx == 5) {
    step1.removeClass("on");
    step2.removeClass("on");
    step3.removeClass("on");
    step4.removeClass("on");
    step5.addClass("on");
  }
};

// progress 클릭
scwin.step1_onclick = function (e) {
  scwin.setScreen(1);
};
scwin.step2_onclick = function (e) {
  scwin.setScreen(2);
};
scwin.step3_onclick = function (e) {
  scwin.setScreen(3);
};
scwin.step4_onclick = function (e) {
  scwin.setScreen(4);
};
scwin.step5_onclick = function (e) {
  scwin.setScreen(5);
};
}}}]}]},{T:1,N:'body',A:{'ev:onpageload':'scwin.onpageload'},E:[{T:1,N:'xf:group',A:{class:'sub_contents',id:'',style:''},E:[{T:1,N:'xf:group',A:{class:'pgtbox',id:'',style:''},E:[{T:1,N:'w2:textbox',A:{class:'pgt_tit',id:'',label:'화면타이틀',style:'',tagname:''}},{T:1,N:'xf:group',A:{class:'breadcrumb',id:'',style:''},E:[{T:1,N:'xf:group',A:{id:'',style:'',tagname:'ul'},E:[{T:1,N:'xf:group',A:{class:'home',id:'',style:'',tagname:'li'},E:[{T:1,N:'w2:anchor',A:{id:'',outerDiv:'false',style:''},E:[{T:1,N:'xf:label',E:[{T:4,cdata:'Home'}]}]}]},{T:1,N:'xf:group',A:{id:'',style:'',tagname:'li'},E:[{T:1,N:'w2:anchor',A:{id:'',outerDiv:'false',style:''},E:[{T:1,N:'xf:label',E:[{T:4,cdata:'1Depth Menu'}]}]}]},{T:1,N:'xf:group',A:{id:'',style:'',tagname:'li'},E:[{T:1,N:'w2:anchor',A:{id:'',outerDiv:'false',style:''},E:[{T:1,N:'xf:label',E:[{T:4,cdata:'2Depth Menu'}]}]}]},{T:1,N:'xf:group',A:{id:'',style:'',tagname:'li'},E:[{T:1,N:'w2:span',A:{id:'',label:'3Depth Menu',style:''}}]}]}]},{T:1,N:'xf:trigger',A:{class:'btn_fav',id:'',style:'',type:'button'},E:[{T:1,N:'xf:label'}]}]},{T:1,N:'xf:group',A:{class:'processbar',id:'',style:'',tagname:'ul'},E:[{T:1,N:'xf:group',A:{class:'on','ev:onclick':'scwin.step1_onclick',id:'step1',tagname:'li'},E:[{T:1,N:'w2:span',A:{class:'num',id:'',label:'1',style:''}},{T:1,N:'xf:group',A:{class:'dot_wrap',id:'',style:''},E:[{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}}]},{T:1,N:'w2:textbox',A:{id:'',label:'Step1',style:''}}]},{T:1,N:'xf:group',A:{'ev:onclick':'scwin.step2_onclick',id:'step2',style:'',tagname:'li'},E:[{T:1,N:'w2:span',A:{class:'num',id:'',label:'2',style:''}},{T:1,N:'xf:group',A:{class:'dot_wrap',id:'',style:''},E:[{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}}]},{T:1,N:'w2:textbox',A:{id:'',label:'Step2',style:''}}]},{T:1,N:'xf:group',A:{'ev:onclick':'scwin.step3_onclick',id:'step3',style:'',tagname:'li'},E:[{T:1,N:'w2:span',A:{class:'num',id:'',label:'3',style:''}},{T:1,N:'xf:group',A:{class:'dot_wrap',id:'',style:''},E:[{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}}]},{T:1,N:'w2:textbox',A:{id:'',label:'Step3',style:''}}]},{T:1,N:'xf:group',A:{'ev:onclick':'scwin.step4_onclick',id:'step4',style:'',tagname:'li'},E:[{T:1,N:'w2:span',A:{class:'num',id:'',label:'4',style:''}},{T:1,N:'xf:group',A:{class:'dot_wrap',id:'',style:''},E:[{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot',id:'',label:'',style:''}}]},{T:1,N:'w2:textbox',A:{id:'',label:'Step4',style:''}}]},{T:1,N:'xf:group',A:{'ev:onclick':'scwin.step5_onclick',id:'step5',style:'',tagname:'li'},E:[{T:1,N:'w2:span',A:{class:'num',id:'',label:'5',style:''}},{T:1,N:'xf:group',A:{class:'dot_wrap',id:'',style:''},E:[{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on ',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on ',id:'',label:'',style:''}},{T:1,N:'w2:span',A:{class:'dot on ',id:'',label:'',style:''}}]},{T:1,N:'w2:textbox',A:{id:'',label:'Step5',style:''}}]}]}]}]}]}]})