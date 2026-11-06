
testObj.testFn = function() {
    //alert("asdf");
};

testObj.init = function() {
    //alert("testObj init");
};

testObj.customFormatter = function(data, formattedData, row, col) {
    console.log("testObj.customFormatter:",data, formattedData, row, col);
	localStorage.setItem("log", "testObj.customFormatter");
    return formattedData;
};

testObj.init();