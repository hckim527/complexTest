// $p.jsAsync 테스트용 외부 스크립트 #3
// 로드 순서 / noCache / wpack 검증 공용 스크립트
scwin.__jsAsync_order = scwin.__jsAsync_order || [];
scwin.__jsAsync_order.push("exam3");

scwin.__jsAsync_exam3_loadCount = (scwin.__jsAsync_exam3_loadCount || 0) + 1;
scwin.__jsAsync_exam3_value = "ASYNC_EXAM3_OK";

// window 카운터 (noCache 검증)
window.__jsAsync_exam3_loadCount = (window.__jsAsync_exam3_loadCount || 0) + 1;
window.__jsAsync_exam3_value = "ASYNC_EXAM3_OK";
