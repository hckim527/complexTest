testObj.customFormatter = function(data, formattedData, row, col) {
	localStorage.setItem("log", "testObj.customFormatter");
	return "T:" + formattedData;
};
