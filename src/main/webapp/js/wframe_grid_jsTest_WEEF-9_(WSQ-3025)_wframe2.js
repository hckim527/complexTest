scwin.scopeId = scwin.$w.getFrameId();

//case1
scwin.trigger9_onclick = function(e) {
    WebSquare.ModelUtil.removeInstanceNode("root/ui/vector1", undefined, scwin.scopeId);
    var doc = WebSquare.xml.parse("<vector1/>");
   
    WebSquare.ModelUtil.setInstanceNode({"doc":doc,"xpath":"root/ui","mode":"append", "scopeId" : scwin.scopeId});

    WebSquare.ModelUtil.copyChildrenNodes({"srcXPath":"root/response/vector4","destXPath":"root/ui/vector1","mode":"replaceAll", "scopeId" : scwin.scopeId});
};


//case2
scwin.trigger11_onclick = function(e) {
    WebSquare.ModelUtil.removeInstanceNode("root/ui/vector1", undefined, scwin.scopeId );

    var doc = WebSquare.xml.parse("<vector1/>");

    WebSquare.ModelUtil.setInstanceNode({"doc":doc,"xpath":"root/ui","mode":"append", "scopeId" : scwin.scopeId});

    var doc = WebSquare.xml.parse("<vector1_row/>");
    WebSquare.ModelUtil.setInstanceNode({"doc":doc,"xpath":"root/ui/vector1","mode":"append", "scopeId" : scwin.scopeId});
    
    WebSquare.ModelUtil.copyChildrenNodes({"srcXPath":"root/response/vector4/vector1_row[1]","destXPath":"root/ui/vector1/vector1_row[1]","mode":"replaceAll", "scopeId" : scwin.scopeId});
};
