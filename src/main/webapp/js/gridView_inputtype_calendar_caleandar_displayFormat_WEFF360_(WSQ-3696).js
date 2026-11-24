if (typeof window.common === "undefined" || window.common === null) {
    window.common = {};
}

common.fstr = (navigator.language.slice(0,2).toLowerCase() === "ko") ? "yyyyMMdd" : "ddMMyyyy";

common.setCalendarFormat = function(type) {
    if (common.fstr.indexOf("yyyy") === 0) {
        switch(type) {
            case "yearMonthDate" :
                return "yyyy.MM.dd";
            break;
            case "yearMonth" :
                return "yyyy.MM";
            break;
        }

    } else {
        switch(type) {
            case "yearMonthDate" :
                return "dd.MM.yyyy";
            break;
            case "yearMonth" :
                return "MM.yyyy";
            break;
        }
    }

}

common.setCalendarFormat2 = function(type) {
    if (common.fstr.indexOf("yyyy") === 0) {
        switch(type) {
            case "yearMonthDate" :
                return "yyyy/MM/dd";
            break;
            case "yearMonth" :
                return "yyyy/MM";
            break;
        }

    } else {
        switch(type) {
            case "yearMonthDate" :
                return "dd/MM/yyyy";
            break;
            case "yearMonth" :
                return "MM/yyyy";
            break;
        }
    }

}