if(typeof ngmf == 'undefined' || ngmf == null ) {
	ngmf = {};
	ngmf.promise = {};
	ngmv = {};
	pubComm = {};
	ngmf.ext = {};
	ngmf.ext.push = {};
	ngmf.ext.cti = {};
	ngmf.ext.nice = {};
	ngmf.ext.promise = {};
	ngmf.mobile = {};
	ngmf.mobile.smpf = {};
	ngmf.mobile_ex = {};
}

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|W|hh|mm|ss|SS|S|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "W": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "SS": 
            case "SSS": return d.getMilliseconds().zf(3);
            case "S": return "";
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};


ngmf.Calendar = (function() {

	//오늘 날짜를 가져온다.
	var todayDate = function () { return WebSquare.date.parseDate(ngmf.getSysDate("yyyyMMdd")); };

	// 음력 데이터 (평달 - 작은달 :1, 큰달:2 )
	// (윤달이 있는 달 - 평달이 작고 윤달도 작으면 :3 , 평달이 작고 윤달이 크면 : 4)
	// (윤달이 있는 달 - 평달이 크고 윤달이 작으면 :5, 평달과 윤달이 모두 크면 : 6)
	var lunarMonthTable = [
	           	        [ 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2 ],
	           			[ 2, 1, 2, 5, 2, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2 ], /* 1801 */
	           			[ 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1 ],
	           			[ 2, 3, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 2, 1, 3, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 2, 1, 2, 1, 1, 1, 2, 1, 2, 2, 1 ],
	           			[ 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2 ],
	           			[ 1, 2, 2, 1, 5, 2, 1, 2, 1, 1, 2, 1 ],
	           			[ 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 2 ],
	           			[ 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2 ],
	           			[ 1, 1, 5, 2, 1, 2, 2, 1, 2, 2, 1, 2 ], /* 1811 */
	           			[ 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 5, 2, 1, 1, 1, 2, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 5, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1 ],
	           			[ 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2 ],
	           			[ 1, 2, 1, 5, 2, 2, 1, 2, 2, 1, 2, 1 ],
	           			[ 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2 ],
	           			[ 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2 ], /* 1821 */
	           			[ 2, 1, 5, 1, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 2, 1, 4, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 2, 4, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 1, 2, 3, 2, 1, 2, 2, 1, 2, 2, 2 ],
	           			[ 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2 ], /* 1831 */
	           			[ 1, 2, 1, 2, 1, 1, 2, 1, 5, 2, 2, 2 ],
	           			[ 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 1, 2, 5, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 5, 1, 2, 2, 1, 2, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 4, 1, 1, 2, 1, 2, 1, 2, 2, 1 ], /* 1841 */
	           			[ 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 2, 1, 2, 1, 4, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 5, 2, 1, 2, 2, 1, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 2, 3, 2, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 1, 2, 3, 2, 1, 2, 2 ], /* 1851 */
	           			[ 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 1, 2 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 5, 2, 1, 2, 1, 2 ],
	           			[ 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 5, 2, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 6, 1, 1, 2, 1, 1, 2, 1, 2, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2 ], /* 1861 */
	           			[ 2, 1, 2, 1, 2, 2, 1, 5, 2, 1, 1, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2 ],
	           			[ 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 4, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 2, 3, 2, 1, 1, 2, 1, 2, 2, 1 ],
	           			[ 2, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 2, 1, 2, 1, 2, 1, 1, 5, 2, 1 ],
	           			[ 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1, 2 ], /* 1871 */
	           			[ 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2 ],
	           			[ 1, 1, 2, 1, 2, 4, 2, 1, 2, 2, 1, 2 ],
	           			[ 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 2, 1, 1, 5, 1, 2, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 4, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 5, 2, 2, 1, 2, 1 ], /* 1881 */
	           			[ 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2 ],
	           			[ 2, 1, 1, 2, 3, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 2, 1, 5, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 5, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2 ], /* 1891 */
	           			[ 1, 1, 2, 1, 1, 5, 2, 2, 1, 2, 2, 2 ],
	           			[ 1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 5, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 5, 2, 2, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 5, 2, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1 ], /* 1901 */
	           			[ 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 2, 3, 2, 1, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1 ],
	           			[ 2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 4, 1, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2 ],
	           			[ 1, 5, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 5, 1, 2, 2, 1, 2, 2 ], /* 1911 */
	           			[ 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 5, 1, 2, 1, 2, 1, 1, 2 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 3, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 5, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2 ], /* 1921 */
	           			[ 2, 1, 2, 2, 3, 2, 1, 1, 2, 1, 2, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1 ],
	           			[ 2, 1, 2, 5, 2, 1, 2, 2, 1, 2, 1, 2 ],
	           			[ 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 5, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 2, 1, 1, 5, 1, 2, 1, 2, 2, 1 ],
	           			[ 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1 ], /* 1931 */
	           			[ 2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 1, 6, 1, 2, 1, 2, 1, 1, 2 ],
	           			[ 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2 ],
	           			[ 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 4, 1, 1, 2, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 2, 1, 1, 2, 1, 4, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 1, 2, 2, 4, 1, 1, 2, 1, 2, 1 ], /* 1941 */
	           			[ 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 4, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2 ],
	           			[ 2, 5, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 1, 2, 2, 1, 2, 3, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2 ], /* 1951 */
	           			[ 1, 2, 1, 2, 4, 1, 2, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 2, 1, 4, 1, 1, 2, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 2, 1, 1, 5, 2, 1, 2, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 2, 5, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2 ], /* 1961 */
	           			[ 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 2, 3, 2, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 2 ],
	           			[ 1, 2, 5, 2, 1, 1, 2, 1, 1, 2, 2, 1 ],
	           			[ 2, 2, 1, 2, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 2, 1, 5, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 5, 2, 1, 2, 2, 2, 1, 2 ], /* 1971 */
	           			[ 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 5, 1, 2, 1, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 2, 1, 5, 1, 2, 1, 2 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 1 ],
	           			[ 2, 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 6, 1, 2, 2, 1, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2 ], /* 1981 */
	           			[ 2, 1, 2, 3, 2, 1, 1, 2, 1, 2, 2, 2 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 2, 1, 1, 2, 1, 1, 5, 2, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 1 ],
	           			[ 2, 1, 2, 1, 2, 5, 2, 2, 1, 2, 1, 2 ],
	           			[ 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 1, 5, 1, 2, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2 ], /* 1991 */
	           			[ 1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2 ],
	           			[ 1, 2, 5, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 5, 2, 1, 1, 2 ],
	           			[ 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 1 ],
	           			[ 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 3, 2, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1 ],
	           			[ 2, 2, 1, 5, 2, 1, 1, 2, 1, 2, 1, 2 ], /* 2001 */
	           			[ 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 1, 5, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 2, 1, 5, 2, 2, 1, 2, 2 ],
	           			[ 1, 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 1, 5, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1 ], /* 2011 */
	           			[ 2, 1, 2, 5, 2, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 1, 2, 5, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 2, 1, 2, 1, 4, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2 ],
	           			[ 2, 1, 2, 5, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1 ], /* 2021 */
	           			[ 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 5, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 5, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1 ],
	           			[ 2, 2, 2, 1, 5, 1, 2, 1, 1, 2, 2, 1 ],
	           			[ 2, 2, 1, 2, 2, 1, 1, 2, 1, 1, 2, 2 ],
	           			[ 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 5, 2, 1, 2, 2, 1, 2, 1, 2, 1 ], /* 2031 */
	           			[ 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 5, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 4, 1, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1 ],
	           			[ 2, 2, 1, 2, 5, 2, 1, 2, 1, 2, 1, 1 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2 ], /* 2041 */
	           			[ 1, 5, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 1, 2, 3, 2, 1, 2, 2, 2 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 2, 1, 2, 2, 4, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 1 ],
	           			[ 1, 2, 4, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2, 2 ], /* 2051 */
	           			[ 1, 2, 1, 1, 2, 1, 1, 5, 2, 2, 2, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2 ],
	           			[ 1, 2, 2, 1, 2, 4, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 2, 1, 1, 2, 1 ],
	           			[ 2, 1, 2, 4, 2, 1, 2, 1, 2, 2, 1, 1 ],
	           			[ 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 2, 3, 2, 1, 1, 2, 1, 2, 2, 2, 1 ], /* 2061 */
	           			[ 2, 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1 ],
	           			[ 2, 2, 1, 2, 1, 2, 3, 2, 1, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 5, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2 ],
	           			[ 1, 2, 1, 5, 1, 2, 1, 2, 2, 2, 1, 2 ],
	           			[ 2, 1, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2 ],
	           			[ 2, 1, 2, 1, 2, 1, 1, 5, 2, 1, 2, 2 ], /* 2071 */
	           			[ 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2 ],
	           			[ 2, 1, 2, 2, 1, 2, 1, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 2, 1, 5, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 3, 2, 1, 2, 2, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2 ],
	           			[ 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 2, 1, 5, 2, 1, 1, 2, 1, 2, 1, 2, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2 ], /* 2081 */
	           			[ 1, 2, 2, 2, 1, 2, 3, 2, 1, 1, 2, 2 ],
	           			[ 1, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 6, 1, 2, 2, 1, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2 ],
	           			[ 1, 2, 1, 5, 1, 2, 1, 1, 2, 2, 2, 1 ],
	           			[ 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1 ],
	           			[ 2, 2, 2, 1, 2, 1, 1, 5, 1, 2, 2, 1 ],
	           			[ 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1 ], /* 2091 */
	           			[ 2, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 1 ],
	           			[ 1, 2, 2, 1, 2, 4, 2, 1, 2, 1, 2, 1 ],
	           			[ 2, 1, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2 ],
	           			[ 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1 ],
	           			[ 2, 1, 2, 3, 2, 1, 1, 2, 2, 2, 1, 2 ],
	           			[ 2, 1, 2, 1, 1, 2, 1, 1, 2, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 2, 5, 2, 2, 1, 1, 2, 1, 1, 2, 1, 2 ],
	           			[ 2, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1 ],
	           			[ 2, 2, 1, 2, 2, 1, 5, 2, 1, 1, 2, 1 ] ];


  /**
	* memorialDay
	* 기념일 Class.
	*  매년 반복되는 기념일은 이곳에 입력한다.
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {String} name       :: I :: N ::  :: 기념일 명
	* @param {Number} month      :: I :: N ::  :: 기념일 월정보
	* @param {Number} day        :: I :: N ::  :: 기념일 일정보
	* @param {Number} solarLunar :: I :: N ::  :: 음력/양력 구분(1:양력, 2:음력)
	* @param {Boolean} holiday   :: I :: N ::  :: 공휴일여부(true:공휴일, false:평일)
	* @param {Boolean} type      :: I :: Y ::  :: 기념일구분(true:real time setting)
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/
	function memorialDay(name, month, day, solarLunar, holiday, type) {
		this.name = name;
		this.month = month;
		this.day = day;
		this.solarLunar = solarLunar; /* 1:양력 2:음력  */
		this.holiday = holiday; /* true : 빨간날 false : 안빨간날 */
		this.type = type; /* true : real time setting */
		this.techneer = true;
	}

  /**
	* yearmemorialDay
	* 기념일 Class.
	* 특정 연도의 날짜로만 된 기념일 또는 매년 반복되더라도 날짜가 불규칙하게 바뀌는 기념일은 이곳에 입력한다.
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {String} name       :: I :: N ::  :: 기념일 명
	* @param {Number} year       :: I :: N ::  :: 기념일 년정보
	* @param {Number} month      :: I :: N ::  :: 기념일 월정보
	* @param {Number} day        :: I :: N ::  :: 기념일 일정보
	* @param {Number} solarLunar :: I :: N ::  :: 음력/양력 구분(1:양력, 2:음력)
	* @param {Boolean} holiday   :: I :: N ::  :: 공휴일여부(true:공휴일, false:평일)
	* @param {Boolean} type      :: I :: Y ::  :: 기념일구분(true:real time setting)
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/
	function yearmemorialDay(name, year, month, day, solarLunar, holiday, type) {
		this.name = name;
		this.year = year;
		this.month = month;
		this.day = day;
		this.solarLunar = solarLunar; /* 1:양력 2:음력  */
		this.holiday = holiday; /* true : 빨간날 false : 안빨간날 */
		this.type = type; /* true : real time setting */
		this.techneer = true;
	};

  /**
	* 날짜 클래스
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {String} name      :: I :: N ::  :: 기념일 명
	* @param {Number} year      :: I :: N ::  :: 기념일 년정보
	* @param {Number} month     :: I :: N ::  :: 기념일 월정보
	* @param {Number} day       :: I :: N ::  :: 기념일 일정보
	* @param {Number} leapMonth :: I :: N ::  :: 윤달정보(0:평달, 1:윤달)
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/
	function dateClass(year, month, day, leapMonth) {
		this.year = year;
		this.month = month;
		this.day = day;
		this.leapMonth = leapMonth;
		this.toString = function () {
			if (this.year)
				return this.year + this.month.zf(2)+ this.day.zf(2);
			else return "";
		};
	};


  /**
	*  양력 <-> 음력 변환 함수
	* @param {Number} year      :: I :: N ::  :: 년정보
	* @param {Number} month     :: I :: N ::  :: 월정보
	* @param {Number} day       :: I :: N ::  :: 일정보
	* @param {Number} type      :: I :: N ::  :: 계산타입(1:양력>음력, 2:음력>양력)
	* @param {Number} leapMonth :: I :: N ::  :: 윤달정보(0:평달, 1:윤달)
	* @returns {Object}
	* @author 성일호
	*/
	function lunarCalc(year, month, day, type, leapmonth) {
		var rSdate = new dateClass(year, month, day, leapmonth);
		try {
			var solYear, solMonth, solDay;
			var lunYear, lunMonth, lunDay;
			var lunLeapMonth, lunMonthDay;
			var i, lunIndex;

			var solMonthDay = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

			/* range check */
			if (year < 1800 || year > 2101) {
				return;
			}
			/* 속도 개선을 위해 기준 일자를 여러개로 한다 */
			if (year >= 2080) {
				/* 기준일자 양력 2080년 1월 1일 (음력 2079년 12월 10일) */
				solYear = 2080;
				solMonth = 1;
				solDay = 1;
				lunYear = 2079;
				lunMonth = 12;
				lunDay = 10;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 2080 년 2월 28일 */
				lunMonthDay = 30; /* 2079년 12월 */
			} else if (year >= 2060) {
				/* 기준일자 양력 2060년 1월 1일 (음력 2059년 11월 28일) */
				solYear = 2060;
				solMonth = 1;
				solDay = 1;
				lunYear = 2059;
				lunMonth = 11;
				lunDay = 28;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 2060 년 2월 28일 */
				lunMonthDay = 30; /* 2059년 11월 */
			} else if (year >= 2040) {
				/* 기준일자 양력 2040년 1월 1일 (음력 2039년 11월 17일) */
				solYear = 2040;
				solMonth = 1;
				solDay = 1;
				lunYear = 2039;
				lunMonth = 11;
				lunDay = 17;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 2040 년 2월 28일 */
				lunMonthDay = 29; /* 2039년 11월 */
			} else if (year >= 2020) {
				/* 기준일자 양력 2020년 1월 1일 (음력 2019년 12월 7일) */
				solYear = 2020;
				solMonth = 1;
				solDay = 1;
				lunYear = 2019;
				lunMonth = 12;
				lunDay = 7;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 2020 년 2월 28일 */
				lunMonthDay = 30; /* 2019년 12월 */
			} else if (year >= 2000) {
				/* 기준일자 양력 2000년 1월 1일 (음력 1999년 11월 25일) */
				solYear = 2000;
				solMonth = 1;
				solDay = 1;
				lunYear = 1999;
				lunMonth = 11;
				lunDay = 25;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 2000 년 2월 28일 */
				lunMonthDay = 30; /* 1999년 11월 */
			} else if (year >= 1980) {
				/* 기준일자 양력 1980년 1월 1일 (음력 1979년 11월 14일) */
				solYear = 1980;
				solMonth = 1;
				solDay = 1;
				lunYear = 1979;
				lunMonth = 11;
				lunDay = 14;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 1980 년 2월 28일 */
				lunMonthDay = 30; /* 1979년 11월 */
			} else if (year >= 1960) {
				/* 기준일자 양력 1960년 1월 1일 (음력 1959년 12월 3일) */
				solYear = 1960;
				solMonth = 1;
				solDay = 1;
				lunYear = 1959;
				lunMonth = 12;
				lunDay = 3;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 1960 년 2월 28일 */
				lunMonthDay = 29; /* 1959년 12월 */
			} else if (year >= 1940) {
				/* 기준일자 양력 1940년 1월 1일 (음력 1939년 11월 22일) */
				solYear = 1940;
				solMonth = 1;
				solDay = 1;
				lunYear = 1939;
				lunMonth = 11;
				lunDay = 22;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 1940 년 2월 28일 */
				lunMonthDay = 29; /* 1939년 11월 */
			} else if (year >= 1920) {
				/* 기준일자 양력 1920년 1월 1일 (음력 1919년 11월 11일) */
				solYear = 1920;
				solMonth = 1;
				solDay = 1;
				lunYear = 1919;
				lunMonth = 11;
				lunDay = 11;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 1920 년 2월 28일 */
				lunMonthDay = 30; /* 1919년 11월 */
			} else if (year >= 1900) {
				/* 기준일자 양력 1900년 1월 1일 (음력 1899년 12월 1일) */
				solYear = 1900;
				solMonth = 1;
				solDay = 1;
				lunYear = 1899;
				lunMonth = 12;
				lunDay = 1;
				lunLeapMonth = 0;

				solMonthDay[1] = 28; /* 1900 년 2월 28일 */
				lunMonthDay = 30; /* 1899년 12월 */
			} else if (year >= 1880) {
				/* 기준일자 양력 1880년 1월 1일 (음력 1879년 11월 20일) */
				solYear = 1880;
				solMonth = 1;
				solDay = 1;
				lunYear = 1879;
				lunMonth = 11;
				lunDay = 20;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 1880 년 2월 28일 */
				lunMonthDay = 30; /* 1879년 11월 */
			} else if (year >= 1860) {
				/* 기준일자 양력 1860년 1월 1일 (음력 1859년 12월 9일) */
				solYear = 1860;
				solMonth = 1;
				solDay = 1;
				lunYear = 1859;
				lunMonth = 12;
				lunDay = 9;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 1860 년 2월 28일 */
				lunMonthDay = 30; /* 1859년 12월 */
			} else if (year >= 1840) {
				/* 기준일자 양력 1840년 1월 1일 (음력 1839년 11월 27일) */
				solYear = 1840;
				solMonth = 1;
				solDay = 1;
				lunYear = 1839;
				lunMonth = 11;
				lunDay = 27;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 1840 년 2월 28일 */
				lunMonthDay = 30; /* 1839년 11월 */
			} else if (year >= 1820) {
				/* 기준일자 양력 1820년 1월 1일 (음력 1819년 11월 16일) */
				solYear = 1820;
				solMonth = 1;
				solDay = 1;
				lunYear = 1819;
				lunMonth = 11;
				lunDay = 16;
				lunLeapMonth = 0;

				solMonthDay[1] = 29; /* 1820 년 2월 28일 */
				lunMonthDay = 30; /* 1819년 11월 */
			} else if (year >= 1800) {
				/* 기준일자 양력 1800년 1월 1일 (음력 1799년 12월 7일) */
				solYear = 1800;
				solMonth = 1;
				solDay = 1;
				lunYear = 1799;
				lunMonth = 12;
				lunDay = 7;
				lunLeapMonth = 0;

				solMonthDay[1] = 28; /* 1800 년 2월 28일 */
				lunMonthDay = 30; /* 1799년 12월 */
			}

			lunIndex = lunYear - 1799;

			while (true) {

				if (type == 1 && year == solYear && month == solMonth
						&& day == solDay) {
					rSdate =  new dateClass(lunYear, lunMonth, lunDay, lunLeapMonth);
					break;
				} else if (type == 2 && year == lunYear && month == lunMonth
						&& day == lunDay && leapmonth == lunLeapMonth) {
					rSdate =  new dateClass(solYear, solMonth, solDay, 0);
					break;
				}

				/* add a day of solar calendar */
				if (solMonth == 12 && solDay == 31) {
					solYear++;
					solMonth = 1;
					solDay = 1;

					/* set monthDay of Feb */
					if (solYear % 400 == 0)
						solMonthDay[1] = 29;
					else if (solYear % 100 == 0)
						solMonthDay[1] = 28;
					else if (solYear % 4 == 0)
						solMonthDay[1] = 29;
					else
						solMonthDay[1] = 28;

				} else if (solMonthDay[solMonth - 1] == solDay) {
					solMonth++;
					solDay = 1;
				} else
					solDay++;

				/* add a day of lunar calendar */
				if (lunMonth == 12
						&& ((lunarMonthTable[lunIndex][lunMonth - 1] == 1 && lunDay == 29) || (lunarMonthTable[lunIndex][lunMonth - 1] == 2 && lunDay == 30))) {
					lunYear++;
					lunMonth = 1;
					lunDay = 1;

					if (lunYear > 2101) {
						ngmf._error("lunarCalc Exception :: 입력하신 날 또는 달은 없습니다. 다시 입력하시기 바랍니다.");
						break;
					}

					lunIndex = lunYear - 1799;

					if (lunarMonthTable[lunIndex][lunMonth - 1] == 1)
						lunMonthDay = 29;
					else if (lunarMonthTable[lunIndex][lunMonth - 1] == 2)
						lunMonthDay = 30;
				} else if (lunDay == lunMonthDay) {
					if (lunarMonthTable[lunIndex][lunMonth - 1] >= 3
							&& lunLeapMonth == 0) {
						lunDay = 1;
						lunLeapMonth = 1;
					} else {
						lunMonth++;
						lunDay = 1;
						lunLeapMonth = 0;
					}

					if (lunarMonthTable[lunIndex][lunMonth - 1] == 1)
						lunMonthDay = 29;
					else if (lunarMonthTable[lunIndex][lunMonth - 1] == 2)
						lunMonthDay = 30;
					else if (lunarMonthTable[lunIndex][lunMonth - 1] == 3)
						lunMonthDay = 29;
					else if (lunarMonthTable[lunIndex][lunMonth - 1] == 4
							&& lunLeapMonth == 0)
						lunMonthDay = 29;
					else if (lunarMonthTable[lunIndex][lunMonth - 1] == 4
							&& lunLeapMonth == 1)
						lunMonthDay = 30;
					else if (lunarMonthTable[lunIndex][lunMonth - 1] == 5
							&& lunLeapMonth == 0)
						lunMonthDay = 30;
					else if (lunarMonthTable[lunIndex][lunMonth - 1] == 5
							&& lunLeapMonth == 1)
						lunMonthDay = 29;
					else if (lunarMonthTable[lunIndex][lunMonth - 1] == 6)
						lunMonthDay = 30;
				} else
					lunDay++;
			}
		} catch (e) {
			ngmf._error("[lunar2Solar] Exception :: ", e);
		}
		return rSdate;
	};

  /**
    * 요일 DATA 가져오기
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {Number} year      :: I :: N ::  :: 년정보
	* @param {Number} month     :: I :: N ::  :: 월정보
	* @param {Number} day       :: I :: N ::  :: 일정보
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/
	function getWeekday(year, month, day) {
		var weekday = Array("일", "월", "화", "수", "목", "금", "토");
		var date = new Date(year, month - 1, day);
		if (date)
			return weekday[date.getDay()];
	};

  /**
    * 오늘을 기준으로 지난일수를 반환한다.
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {Number} year      :: I :: N ::  :: 년정보
	* @param {Number} month     :: I :: N ::  :: 월정보
	* @param {Number} day       :: I :: N ::  :: 일정보
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/	
	function getPassDay(year, month, day) {
		var date = new Date(year, month - 1, day);
		var interval = Math.floor((todayDate() - date) / (1000 * 60 * 60 * 24) + 1);
		return interval;
	} ;
	
  /**
    * 오늘을 기준으로 D-day를 반환한다.
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {Number} year      :: I :: N ::  :: 년정보
	* @param {Number} month     :: I :: N ::  :: 월정보
	* @param {Number} day       :: I :: N ::  :: 일정보
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/
	function getDDay(year, month, day) {
		var date = new Date(year, month - 1, day);
		var interval = Math.floor((date - todayDate()) / (1000 * 60 * 60 * 24) + 1);
		return interval;
	};
	
  /**
    * 입력일자 기준으로 차이일수의 일자를 반환한다.
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {Number} year      :: I :: N ::  :: 년정보
	* @param {Number} month     :: I :: N ::  :: 월정보
	* @param {Number} day       :: I :: N ::  :: 일정보
	* @param {Number} interval  :: I :: N ::  :: 차이일수
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/
	function getDateSpecificInterval(year, month, day, interval) {
		var date = new Date(year, month - 1, parseInt(day, 10) + parseInt(interval, 10) - 1);
		return date;
	};
	
  /**
    * 입력일자의 간지정보를 반환한다.
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {Number} year      :: I :: N ::  :: 년정보
	* @param {Number} month     :: I :: N ::  :: 월정보
	* @param {Number} day       :: I :: N ::  :: 일정보
	* @param {Number} interval  :: I :: N ::  :: 차이일수
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/
	function getGanjiD(year, month, day) {
		var Ganji = Array('甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申',
				'癸酉', '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
				'甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳', '甲午',
				'乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯', '甲辰', '乙巳',
				'丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑', '甲寅', '乙卯', '丙辰',
				'丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥');

		var date = new Date(year, month - 1, day);
		// 1701년 1월 14일을 기준일로 한다. 1800년 이후의 오류를 방지하기 위해 1799년 12월 31일 이전으로 기준일을 정한다.
		var basicDate = new Date(1701, 0, 14);
		var interval = Math.floor([ (date - basicDate) / (1000 * 60 * 60 * 24) ] % 60);

		if (date)
			return Ganji[interval];
	};
	
  /**
    * 기념일 여부를 체크한다.
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {String} solarDate     :: I :: N ::  :: 양력일자
	* @param {String} lunarDate     :: I :: N ::  :: 음력일자
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/
	function memorialDayCheck(solarDate, lunarDate) {
		var i; 

		for (i = 0; i < memorialDays.length; i++) {
			if (memorialDays[i].month == solarDate.month
					&& memorialDays[i].day == solarDate.day
					&& memorialDays[i].solarLunar == 1)
				return memorialDays[i];

			// 윤달의 공휴일 처리에 대한 예외처리
			if (lunarDate.leapMonth && lunarDate.month == 4 && lunarDate.day == 8) {
				return null;
			}
			if (lunarDate.leapMonth && lunarDate.month == 8 && lunarDate.day > 13 && lunarDate.day < 17) {
				return null;
			}

			if (memorialDays[i].month == lunarDate.month
					&& memorialDays[i].day == lunarDate.day
					&& memorialDays[i].solarLunar == 2
					&& !memorialDays[i].leapMonth)
				return memorialDays[i];
		}

		return null;
	};
	
  /**
    * 대체공휴일 여부를 체크한다.
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {String} solarDate     :: I :: N ::  :: 양력일자
	* @param {String} lunarDate     :: I :: N ::  :: 음력일자
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	*/
	function yearmemorialDayCheck(solarDate, lunarDate) {
		var i;
		var yearmemorial;

		for (i = 0; i < yearmemorialDays.length; i++) {
			if (yearmemorialDays[i].year == solarDate.year
					&& yearmemorialDays[i].month == solarDate.month
					&& yearmemorialDays[i].day == solarDate.day
					&& yearmemorialDays[i].solarLunar == 1)
				return yearmemorialDays[i];

			if (yearmemorialDays[i].year == lunarDate.year
					&& yearmemorialDays[i].month == lunarDate.month
					&& yearmemorialDays[i].day == lunarDate.day
					&& yearmemorialDays[i].solarLunar == 2
					&& !yearmemorialDays[i].leapMonth)
				return yearmemorialDays[i];
		}

		return null;
	} ;


	//매년 반복되는 기념일
	var memorialDays = Array (
	 new memorialDay("신정", 1, 1, 1, true),
	 new memorialDay("설연휴", 12, 30, 2, true, true),
	 new memorialDay("설날", 1, 1, 2, true),
	 new memorialDay("설연휴", 1, 2, 2, true),
	 new memorialDay("3·1절", 3, 1, 1, true),
	 new memorialDay("석가탄신일", 4, 8, 2, true),
	 new memorialDay("어린이날", 5, 5, 1, true),
	 new memorialDay("현충일", 6, 6, 1, true),
	 new memorialDay("제헌절", 7, 17, 1, true),
	 new memorialDay("광복절", 8, 15, 1, true),
	 new memorialDay("추석연휴", 8, 14, 2, true),
	 new memorialDay("추석", 8, 15, 2, true),
	 new memorialDay("추석연휴", 8, 16, 2, true),
	 new memorialDay("개천절", 10, 3, 1, true),
	 new memorialDay("한글날", 10, 9, 1, true),
	 new memorialDay("성탄절", 12, 25, 1, true)
	);

	var yearmemorialDays = new Array();
	/*
	var yearmemorialDays = Array(
			new yearmemorialDay("대체공휴일", 2016, 2, 10, 1, true),
			new yearmemorialDay("대체공휴일", 2017, 1, 30, 1, true)
	);
	*/
	
	function _lunarCalc(year, month, day, type, leapmonth) {
		var retObj = lunarCalc(year, month, day, type, leapmonth);
		if (retObj) return "" + retObj.year +retObj.month.zf(2) + retObj.day.zf(2);
		else return "" + year + (""+month).zf(2)+ (""+day).zf(2);
	} ;
	/**
	 * checkHoliday
	 * 휴일체크
	 * @param {Object} inDateStr :: "yyyyMMdd" 타입 날짜String 혹은 Date 타입
	 * @usage getPreHoliday('20140201')
	 * @returns{Object}
	 */
	function _checkHoliday (inDate) {
		var targetDate = inDate || new Date();
		try {
			if (typeof targetDate == 'string') targetDate = WebSquare.date.parseDate(targetDate,"yyyyMMdd");
			var wkd = targetDate.getDay();
			if (wkd == 0 || wkd == 6) return targetDate;

			var year = targetDate.getFullYear();
			var month = (targetDate.getMonth() + 1);
			var day = targetDate.getDate();
			var solarDate = new dateClass(year, month, day);
			var lunarDate = lunarCalc(year, month, day, 1);
			if (memorialDayCheck(solarDate, lunarDate) != null) return targetDate;
			if (yearmemorialDayCheck(solarDate, lunarDate) != null) return targetDate;
		} catch (e) {}
		return null;
	};

	/**
	 * getPreHoliday
	 * 휴일체크후 전날짜 리턴
	 * @param {String} inDateStr :: "yyyyMMdd" 타입 날짜String
	 * @usage getPreHoliday('20140201')
	 * @returns{String}
	 */
	function _getPreHoliday (inDateStr) {
		if (inDateStr == null || typeof inDateStr == "undefined") {
			inDateStr = ngmf.getSysDate("yyyyMMdd");
		}

		var rtnDateStr = inDateStr;
		var resultDay = _checkHoliday (inDateStr);
		if (resultDay != null) {
			while (resultDay != null)
			{
				resultDay.setDate(resultDay.getDate() - 1);
				rtnDateStr = resultDay.format("yyyyMMdd");
				resultDay = _checkHoliday (resultDay);
			}
		}
		return rtnDateStr;
	};
	/**
	 * _getDateStr
	*  날짜 가져오기
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {Object} argument
	* @returns {Object}
	* @author 성일호
	* @example
	* @since
	 */
	function _getDateStr(srcDate) {
		var date = srcDate || new Date();
		var year = date.getFullYear();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		var weekday = new Array('일', '월', '화', '수', '목', '금', '토');
		var wkd = date.getDay();
		return  year + "년 " + month + "월 " + day + "일 " + weekday[wkd] + "요일";
	};

	/**
	 * _getLunarDate
	* 음력일자 가져오기
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {Object} argument
	* @returns {String}
	* @author 성일호
	* @example
	* @since
	 */
	function _getLunarDate(srcDate) {
		var date;
		if (srcDate) {
			if (typeof srcDate == 'string') date = WebSquare.date.parseDate(srcDate,"yyyyMMdd");
			else date = srcDate;
		} else date = new Date();
		var year = date.getFullYear();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		return  _lunarCalc(year, month, day, 1);
	};

	/**
	 * getLunarDate
	* 양력일자 가져오기
	* @date 2016. 1. 18.
	* @memberOf ngmf.Calendar
	* @param {Object} argument
	* @returns {String}
	* @author 성일호
	* @example
	* @since
	 */
	function _getSolarDate(srcDate) {
		var date;
		if (srcDate) {
			if (typeof srcDate == 'string') date = WebSquare.date.parseDate(srcDate,"yyyyMMdd");
			else date = srcDate;
		} else date = new Date();
		var year = date.getFullYear();
		var month = (date.getMonth() + 1);
		var day = date.getDate();
		return _lunarCalc(year,month, day, 2, 0);
	} ;

	/**
	 *
	 */
	function _addYearmemorialDays(sTitle, nYear, nMonth, nDay, nType) {
		if (yearmemorialDays) yearmemorialDays.push(new yearmemorialDay(sTitle, nYear, nMonth, nDay, nType, true));
		else yearmemorialDays = Array(
				new yearmemorialDay(sTitle, nYear, nMonth, nDay, nType, true)
		);
	};

	function _addMday(sTitle,holiDay) {
		try {
			var nType = 1,nYear=0, nMonth=0, nDay =0;
			if (holiDay && holiDay.length == 8) {
				nYear = Number(holiDay.substr(0,4));
				nMonth = Number(holiDay.substr(4,2));
				nDay = Number(holiDay.substr(6,2)); 
				_addYearmemorialDays("대체공휴일[" + sTitle + "]", nYear, nMonth, nDay, nType);
			}
		} catch (e) {
			ngmf._error("[ngmf._addMday] Exception :: ", e);
		} 
	};
	
	function _addMemorialDays(sTitle, nMonth, nDay, nType) {
		if (memorialDays) memorialDays.push(new memorialDay(sTitle, nMonth, nDay, nType, true));
		else memorialDays = Array(
				new memorialDay(sTitle, nMonth, nDay, nType, true)
		);
	};

	function _getDateClass(year, month, day, leapMonth) {
		return new dateClass(year, month, day, leapMonth);
	}; 
	
	return {
		_todayDay : todayDate,
		_lunarMonthTable : lunarMonthTable,
		_memorialDay : memorialDay,
		_memorialDays : memorialDays,
		_yearmemorialDay : yearmemorialDay,
		_yearmemorialDays : yearmemorialDays,
		lunarCalc : lunarCalc,
		getDateClass : _getDateClass,
		getLunarDate : _getLunarDate,
		getSolarDate : _getSolarDate,
		getDateStr : _getDateStr,
		getPreHoliday : _getPreHoliday,
		checkHoliday : _checkHoliday,
		addYmemorialDay : _addMday,
		addmemorialDay : _addMemorialDays,
		memorialDayCheck : memorialDayCheck,
		yearmemorialDayCheck : yearmemorialDayCheck,
		getGanjiD : getGanjiD
	}; 
	
})( ngmf.Calendar|| {});