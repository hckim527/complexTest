(function() {
    var promiseObj = WebSquare.BootLoader.requireAsync("engine.wUnit");
    promiseObj.then(function(resolve, reject) {
        return WebSquare.startApplication();
    }).then(function(resolve, reject) {
        // to do
    })
})();
