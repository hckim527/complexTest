// $p.jsAsync 테스트용 외부 스크립트 #1
// 페이지 Scope(scwin) 직접 접근 가능 여부 확인용
// 로드/실행 순서 확인을 위해 scwin.__jsAsync_order 배열에도 push
scwin.__jsAsync_order = scwin.__jsAsync_order || [];
scwin.__jsAsync_order.push("exam1");

scwin.__jsAsync_exam1_loaded_at = (new Date()).getTime();
scwin.__jsAsync_exam1_value = "ASYNC_EXAM1_OK";

scwin.jsAsync_module1 = function () {
    return "MODULE1_OK";
};

// window 에도 동일 값 기록 (전역/페이지 Scope 비교용)
window.__jsAsync_exam1_value = "ASYNC_EXAM1_OK";
window.__jsAsync_exam1_loadCount = (window.__jsAsync_exam1_loadCount || 0) + 1;
