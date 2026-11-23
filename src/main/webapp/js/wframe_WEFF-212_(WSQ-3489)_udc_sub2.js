(function() {
    if(typeof scwin !== "undefined" && scwin.sgVar != null) { 
        $p.log(scwin.sgVar);
    }
    if(typeof gVar !== "undefined" && gVar != null) {
        $p.log(gVar);
    }
    var str = $p.id + "[externalJS]";
    $p.log(str);
})();

var gVar = "gVar_child_child";