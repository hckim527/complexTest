// $p.js 테스트용 외부 스크립트 #1
// 전역 Scope 에서 실행되는지, 인자 순서대로 순차 실행되는지 확인하기 위한 로그를 누적함
window.__js_load_order = window.__js_load_order || [];
window.__js_load_order.push("exam1");

window.__js_exam1_loaded_at = (new Date()).getTime();
window.__js_exam1_value = "EXAM1_OK";
