# complexTest 에이전트 오케스트레이션 가이드

> **목적**: Jira 등록 현상의 재현에 그치지 않고, **현상 외 추가 검증이 필요한 부분을 발굴·테스트 케이스화하여 테스트 커버리지를 높인다.** (상세: `CT_01_생성.md` 상단 목적)
> **1 에이전트 = 1 샘플의 생성 → 검증 → 보강을 완료 후 종료한다.**
> **실제 규칙은 각 단계의 원본 MD(`CT_01`~`CT_04`)를 직접 읽어 따른다.**

---

## 1. 에이전트 입력

메인으로부터 받는 정보는 **Jira 이슈 키 1개**(예: `WAEA-946`) 뿐이다. 그 외 정보는 모두 에이전트가 키를 기반으로 **직접 조회·결정**한다.

| 항목 | 도출 방법 |
|------|----------|
| 결함 제목 / 상태 / `[QA]` 여부 | `getJiraIssue(키)` 로 조회. `[QA]` 프리픽스면 대상 외 → 메인에 보고 후 중단 |
| 첨부 id / 첨부 XML | `getJiraIssue(키, fields:["attachment"])` → API 토큰 basic-auth 다운로드 (`reference_jira_attachment_api_token`) |
| 컴포넌트/폴더명 | 결함 제목·첨부 구성에서 도출 (예: 제목이 "gridView ..." → `gridView`) |
| 출력 경로 | `complexTest/src/main/webapp/sample/{컴포넌트}/` |
| 구조 레퍼런스 | `unitTest/src/main/webapp/sample/gridView/gridView_M_setColumnIoFormat_1.xml` (구조만 참고) |

---

## 2. 실행 흐름

### Step 1: 규칙 파일 읽기
- `complexTest/CT_01_생성.md` — 생성 규칙
- `complexTest/CT_02_검증.md` / `complexTest/CT_03_보강.md` — 검증/보강 규칙

### Step 2: 이슈 조회·첨부 다운로드
1. 전달받은 키로 `getJiraIssue` 를 호출해 제목·상태·`[QA]` 여부를 확인한다. `[QA]` 건이면 대상 외이므로 메인에 보고 후 중단한다.
2. `getJiraIssue` 의 `fields:["attachment"]` 로 첨부 id 를 조회하고, API 토큰 basic-auth 로 첨부 XML 을 다운로드한다(`reference_jira_attachment_api_token`). **다운로드 위치는 `workspace/_jira_attachments/{KEY}/` (webapp 밖 — Studio 컴파일/서빙 대상에서 제외; 절대 `complexTest/src/main/webapp/` 안에 두지 말 것).** 제목/첨부에서 컴포넌트(폴더명)를 도출한다.

### Step 3: 생성 (`CT_01_생성.md` 규칙 적용)
1. **첨부 샘플의 컴포넌트를 그대로 사용**하여 setColumnIoFormat 패턴(아래 §3 스켈레톤, 5영역)으로 작성한다.
2. `description` = Jira 결함 제목 원문, `validation` = 결함 수정 후 회귀 검증 케이스.
3. 화면 표시 정보·코드 주석에 엔진 js 파일명·라인·내부 메서드명 금지.
4. 파일명 `WAEA_{번호}_{컴포넌트}_{기능}_1.xml` 로 출력 경로에 저장.

### Step 4: 검증 (`CT_02_검증.md` 규칙 적용)
1. `validate_xml` (필수).
2. MCP playwright 로 페이지를 띄워 렌더/핸들러 동작/console error 0 을 확인.

### Step 5: 보강 (`CT_03_보강.md` 규칙 적용)
- 회귀 validation 누락 보강(상세 규칙은 CT_03 참조).

### Step 6: 반환
- **결과**: DONE / FAIL
- **생성된 파일 경로**, Jira 이슈 번호
- validation 항목 수 / MCP 검증 결과
- FAIL 시: 실패 사유 및 진행 상태

---

## 3. 샘플 XML 기본 구조 (스켈레톤)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:w2="http://www.inswave.com/websquare"
	xmlns:xf="http://www.w3.org/2002/xforms">
	<head meta_screenName="[{컴포넌트}] {기능}" meta_author="InswaveSystems" meta_type="메인">
		<w2:historyInfo>
			<w2:history meta_no="01" meta_desc="최초작성" meta_date="{YYYYMMDD}" meta_user="InswaveSystems"></w2:history>
		</w2:historyInfo>
		<w2:type>COMPONENT</w2:type>
		<w2:buildDate />
		<w2:MSA />
		<xf:model>
			<w2:dataCollection baseNode="map"></w2:dataCollection>
			<w2:workflowCollection />
		</xf:model>
		<w2:layoutInfo />
		<w2:publicInfo method="" />
		<script lazy="false" type="text/javascript"><![CDATA[// 테스트 설명, 유효성 값 설정
scwin.tData = {
    "description" : "{Jira 결함 제목 원문}<br/><a href='https://inswave01.atlassian.net/browse/{KEY}' target='_blank' style='color:blue;text-decoration:underline;'>{KEY}</a>",
    "validation" : [
        "{결함 수정 후 회귀 검증 케이스 1}",
        "{회귀 검증 케이스 2}",
    ]
}

scwin.onpageload = function () {
    $c.gcm.createCommonDatalist();
    scwin.comp_init();
    wf_body_left.getObj("scwin").createValidation(scwin.tData);
};

scwin.comp_init = async function () {
    // 첨부 샘플의 컴포넌트를 그대로 dynamicCreate
}

scwin.btn_{기능}_onclick = function (e) {
    // 재현/검증 로직 + 결과 출력
    wf_body_bottom.getObj("scwin").setReturnValue("결과값");
};]]></script>
	</head>
	<body ev:onpageload="scwin.onpageload">
		<xf:group class="tc_body_main" id="" style="display: flex;">
			<xf:group style="" id="body_left" class="tc_body_left">
				<w2:wframe id="wf_body_left" src="/frame/page/body_left.xml" style=""></w2:wframe>
			</xf:group>
			<xf:group class="tc_body_right" id="body_right" style="">
				<w2:wframe id="wf_body_top" src="/frame/page/body_top.xml" style=""></w2:wframe>
				<xf:group id="grp_condition">
					<!-- con_ 컨트롤 (Target 재생성 조건) -->
				</xf:group>
				<w2:wframe id="wf_body_sample" src="/frame/page/body_sample.xml" style=""></w2:wframe>
				<xf:group id="grp_parameter">
					<!-- par_ 컨트롤 (메소드 파라미터) -->
					<xf:group style="" id="grp_etc">
						<!-- 실행 버튼 -->
					</xf:group>
				</xf:group>
				<w2:wframe id="wf_body_bottom" src="/frame/page/body_bottom.xml" style=""></w2:wframe>
			</xf:group>
		</xf:group>
	</body>
</html>
```

---

## 4. 에이전트 병렬 실행

- **1 에이전트 = 1 샘플**: 여러 샘플을 하나의 에이전트에 묶지 않는다.
- 배치 생성 시 **최대 3개 에이전트를 병렬**로 실행하고, 완료되면 다음 3개를 진행하는 라운드 방식으로 운영한다.
- 각 에이전트는 독립적으로 생성 → 검증 → 보강을 완료한다.
- 에이전트 프롬프트에 반드시 포함: **Jira 이슈 키**(예: `WAEA-946`) 와 "작업 시작 시 `CT_01`/`CT_02`/`CT_03`/`CT_04` 와 본 가이드를 읽고 규칙을 따를 것" 지시. 제목·첨부·컴포넌트/폴더명·출력 경로는 에이전트가 키로 직접 조회·도출한다(§1).

---

## 5. 에러 처리

- 첨부 다운로드 실패 → 에러 로그와 함께 FAIL 반환(첨부 없이 임의 구성 금지).
- `validate_xml` 실패 → 수정 후 재검증, 반복 실패 시 FAIL.
