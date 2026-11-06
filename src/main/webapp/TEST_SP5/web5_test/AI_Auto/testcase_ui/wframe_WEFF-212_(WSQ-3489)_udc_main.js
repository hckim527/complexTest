var common = {};
common.popupList = {};
common.viewCollection = function(scopeObj) {
    var url = WebSquare.core.getConfiguration("viewCollectionURL");
    if (!url) {
        url = WebSquare.baseURI + 'message/viewCollection.html';
    }
    var scope_uuid = scopeObj.getFrame().uuid;
    var param = "?scope=" + scope_uuid;
    var sFeatures = "top=120,height=485,left=200,width=650,location=no,menubar=no,resizable=yes,scrollbars=auto";
    common.popupList[scope_uuid] = window.open(url + param, '_blank', sFeatures);
    common.popupList[scope_uuid].addEventListener("load", function(ev) {
        setTimeout(function() { 
            common.popupList[scope_uuid].getCollectionData();
        }, 500);
    });
};

(function() {
    if(typeof scwin !== "undefined" && scwin.sgVar != null) { 
        $p.log(scwin.sgVar);
    }
    if(typeof gVar !== "undefined" && gVar != null) {
        $p.log(gVar);
    }
    var str = $p.id + "#externalJS#";
    $p.log(str);
})();

var gVar = "gVar_main";
