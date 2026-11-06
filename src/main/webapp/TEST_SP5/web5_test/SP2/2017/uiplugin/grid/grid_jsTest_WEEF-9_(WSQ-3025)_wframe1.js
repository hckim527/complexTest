scwin.test = function() {
    var scopeId = scwin.$w.getFrameId();

    WebSquare.ModelUtil.setInstanceValue({
        xpath : "response/vector2_wframe/data[2]/col2",
        value : "test_test",
        scopeId : scopeId
    });
    textbox1.setValue(scwin.$w.getFrameId());
}