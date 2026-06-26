// $p.js 테스트용 외부 스크립트 #3 (scriptCache 중복 로드 방지 확인용)
// 로드될 때마다 카운터를 1 증가시킴 → 중복 로드 여부 확인 가능
window.__js_exam3_loadCount = (window.__js_exam3_loadCount || 0) + 1;

window.__js_load_order = window.__js_load_order || [];
window.__js_load_order.push("exam3#" + window.__js_exam3_loadCount);

window.__js_exam3_value = "EXAM3_OK";
