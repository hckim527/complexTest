$w.log("scopeTest_wframe2.js");

scwin.onpageload2 = function() {
    var msg = "onpageload2 : " + scwin.$w.getFrameId();
    $w.log(msg);
    console.log(msg);

}
    