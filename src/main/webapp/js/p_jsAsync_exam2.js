// $p.jsAsync 테스트용 외부 스크립트 #2
// options.scopeVariable 로 지정한 scvar 변수 접근 가능 여부 확인용
scwin.__jsAsync_order = scwin.__jsAsync_order || [];
scwin.__jsAsync_order.push("exam2");

// scopeVariable 로 지정되면 scvar 가 자동으로 빈 객체로 초기화됨
if (typeof scvar !== "undefined") {
    scvar.jsAsync_module2 = function () {
        return "MODULE2_OK";
    };
    scvar.__jsAsync_exam2_value = "ASYNC_EXAM2_OK";
}

scwin.__jsAsync_exam2_value = "ASYNC_EXAM2_OK";
scwin.__jsAsync_exam2_loaded_at = (new Date()).getTime();

window.__jsAsync_exam2_value = "ASYNC_EXAM2_OK";
