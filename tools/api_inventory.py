# -*- coding: utf-8 -*-
"""기능 추가 요건 커버리지 표 생성 (CT_05 §2)

엔진 컴포넌트 js 의 API 주석(@property/@method/@event)과 defaultOptions·userEvents 를 읽어
커버리지 엑셀(API목록·관점표·케이스·요약)의 뼈대를 만든다.

사용: python tools/api_inventory.py <엔진 js 경로> <출력 xlsx> [--key WAEA-171] [--tier A|B|C] [--names a,b,c]
  --names : B/C 등급에서 이번 요건의 새 항목만 표에 넣을 때 쓴다(쉼표 구분 API 이름).
"""
import re
import sys
import argparse
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

LIFECYCLE = {"initialize", "toHTML", "setAction", "finalize"}
# 관점 코드 (CT_05 §3)
VIEWS = [
    ("V01", "값별 동작"),
    ("V02", "경계·잘못된 값"),
    ("V03", "동적 변경"),
    ("V04", "조합(@related)"),
    ("V05", "상태(disabled·readOnly·show/hide·크기·style)"),
    ("V06", "접근성·키보드"),
    ("V07", "화면 구성(wframe·popup·scope·zoom)"),
    ("V08", "데이터 바인딩"),
    ("V09", "이벤트(순서·인자·취소)"),
    ("V10", "회귀(미사용 시 이전과 동일)"),
    ("V11", "Studio(속성 편집기·자동완성)"),
]


def tag(block, t):
    m = re.search(r"@" + t + r"[ \t]+([^\n]*)", block)
    return m.group(1).strip() if m else ""


def tags(block, t):
    return [x.strip() for x in re.findall(r"@" + t + r"[ \t]+([^\n]*)", block)]


def parse(src):
    s = open(src, encoding="utf-8").read()
    items = []
    for b in re.findall(r"/\*\*(.*?)\*/", s, re.S):
        kind = next((k for k in ("property", "method", "event") if re.search(r"^\s*\*\s*@" + k + r"\b", b, re.M)), None)
        name = tag(b, "name")
        if not kind or not name:
            continue
        hidden = tag(b, "hidden").upper().startswith("Y")
        if kind == "method" and (name.startswith("_") or name in LIFECYCLE):
            hidden = True
        if hidden:
            continue
        items.append({
            "kind": {"property": "Property", "method": "Method", "event": "Event"}[kind],
            "name": name,
            "default": tag(b, "default"),
            "option": tag(b, "option"),
            "dynamic": tag(b, "dynamic"),
            "params": " / ".join(tags(b, "param")),
            "related": " ".join(re.findall(r"<[^>]*\.([A-Za-z0-9_]+)>", tag(b, "related"))),
            "tagversion": tag(b, "tagversion"),
            "description": tag(b, "description"),
            "doc": "문서",
        })
    # defaultOptions / userEvents 중 주석 없는 항목 = 가이드 누락 후보
    documented = {i["name"] for i in items}
    m = re.search(r"\.defaultOptions\s*=\s*\{(.*?)\n\};", s, re.S)
    if m:
        body = m.group(1)
        ev = re.search(r"userEvents\s*:\s*\[(.*?)\]", body, re.S)
        for e in re.findall(r"\"(on[A-Za-z]+)\"", ev.group(1) if ev else ""):
            if e not in documented:
                items.append({"kind": "Event", "name": e, "default": "", "option": "", "dynamic": "", "params": "",
                              "related": "", "tagversion": "", "description": "", "doc": "미문서(userEvents)"})
        body = re.sub(r"userEvents\s*:\s*\[.*?\],", "", body, flags=re.S)
        for k, v in re.findall(r"^\s*([A-Za-z]\w*)\s*:\s*([^\n]*?),?\s*$", body, re.M):
            if k in documented or k in ("pluginType", "pluginName"):
                continue
            items.append({"kind": "Property", "name": k, "default": v.strip().strip('"'), "option": "", "dynamic": "",
                          "params": "", "related": "", "tagversion": "", "description": "", "doc": "미문서(defaultOptions)"})
    return items


def applicable(it, tier="A"):
    """관점 기본 적용 여부(○). 최종 판단은 설계 단계에서 사람이/에이전트가 고친다."""
    k, v = it["kind"], {}
    num = bool(re.match(r"^-?\d+$", it["default"] or "")) or "Number" in it["params"]
    if k == "Property":
        v["V01"] = True
        v["V02"] = num or bool(it["option"]) or it["default"] == ""
        v["V03"] = it["dynamic"].upper().startswith("Y")
        v["V04"] = bool(it["related"])
        v["V10"] = tier != "A"          # 회귀는 기존 컴포넌트(B/C)만
        v["V11"] = tier != "A" and it["doc"] == "문서"  # A 등급은 공통 행 1칸으로 확인
    elif k == "Method":
        v["V01"] = True
        v["V02"] = bool(it["params"])
        v["V04"] = bool(it["related"])
    else:
        v["V09"] = True
    return v


COMMON_ROWS = [
    ("공통", "컴포넌트 상태", ["V05"]),
    ("공통", "접근성·키보드", ["V06"]),
    ("공통", "화면 구성", ["V07"]),
    ("공통", "데이터 바인딩", ["V08"]),
    ("공통", "이벤트 순서", ["V09"]),
    ("공통", "dynamicCreate·remove", ["V03"]),
    ("공통", "Studio", ["V11"]),
]


def write(items, out, key, tier, comp):
    wb = openpyxl.Workbook()
    hfont, hfill = Font(bold=True, color="FFFFFF"), PatternFill("solid", fgColor="305496")
    gray = PatternFill("solid", fgColor="F2F2F2")
    warn = PatternFill("solid", fgColor="FFF2CC")

    def head(ws, cols, widths):
        ws.append(cols)
        for i, w in enumerate(widths, 1):
            c = ws.cell(1, i); c.font, c.fill = hfont, hfill
            ws.column_dimensions[get_column_letter(i)].width = w
        ws.freeze_panes = "B2"

    ws = wb.active; ws.title = "요약"
    ws.append([f"{key} 기능 추가 커버리지 ({comp})"]); ws["A1"].font = Font(bold=True, size=13)
    ws.append(["등급", tier])
    for kind in ("Property", "Method", "Event"):
        n = sum(1 for i in items if i["kind"] == kind)
        u = sum(1 for i in items if i["kind"] == kind and i["doc"] != "문서")
        ws.append([kind, n, f"미문서 {u}"])
    ws.append(["대상 칸", "=COUNTIF(관점표!C2:M500,\"○\")+COUNTIF(관점표!C2:M500,\"C*\")"])
    ws.append(["케이스 있는 칸", "=COUNTIF(관점표!C2:M500,\"C*\")"])
    ws.append(["커버리지", "=IFERROR(B7/B6,0)"]); ws["B8"].number_format = "0%"
    ws.append(["케이스 수", "=COUNTA(케이스!A2:A2000)"])
    ws.append(["판정", "PASS", "=COUNTIF(케이스!H2:H2000,\"PASS\")", "FAIL", "=COUNTIF(케이스!H2:H2000,\"FAIL\")",
               "관찰", "=COUNTIF(케이스!H2:H2000,\"관찰\")"])
    ws.column_dimensions["A"].width = 16

    ws = wb.create_sheet("API목록")
    head(ws, ["구분", "이름", "문서", "기본값", "옵션", "dynamic", "파라미터", "@related", "tagversion", "설명"],
         [10, 26, 20, 16, 30, 8, 50, 30, 10, 70])
    for it in items:
        ws.append([it["kind"], it["name"], it["doc"], it["default"], it["option"], it["dynamic"], it["params"],
                   it["related"], it["tagversion"], it["description"]])
        if it["doc"] != "문서":
            for c in ws[ws.max_row]: c.fill = warn

    ws = wb.create_sheet("관점표")
    head(ws, ["구분", "이름"] + [f"{c} {n}" for c, n in VIEWS], [10, 26] + [12] * len(VIEWS))
    for it in items:
        v = applicable(it, tier)
        ws.append([it["kind"], it["name"]] + ["○" if v.get(c) else "-" for c, _ in VIEWS])
    for kind, name, vs in COMMON_ROWS:
        ws.append([kind, name] + ["○" if c in vs else "-" for c, _ in VIEWS])
    for row in ws.iter_rows(min_row=2):
        for c in row[2:]:
            c.alignment = Alignment(horizontal="center")
            if c.value == "-": c.fill = gray
    ws.cell(ws.max_row + 2, 1, "범례: ○=대상(케이스 없음) / C01,C02..=케이스 번호 / -=해당 없음 / 사유=제외 사유")

    ws = wb.create_sheet("케이스")
    head(ws, ["No", "API", "관점", "케이스", "입력·조작", "기대", "실제", "판정", "샘플", "자동화", "비고"],
         [7, 22, 8, 40, 40, 30, 30, 8, 34, 8, 40])
    wb.save(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("out")
    ap.add_argument("--key", default=""); ap.add_argument("--tier", default="A")
    ap.add_argument("--names", default="")
    a = ap.parse_args()
    items = parse(a.src)
    if a.names:
        keep = {n.strip() for n in a.names.split(",") if n.strip()}
        items = [i for i in items if i["name"] in keep]
    comp = re.sub(r"\.js$", "", a.src.replace("\\", "/").split("/")[-1])
    write(items, a.out, a.key, a.tier, comp)
    for kind in ("Property", "Method", "Event"):
        sel = [i for i in items if i["kind"] == kind]
        print(kind, len(sel), "미문서", sum(1 for i in sel if i["doc"] != "문서"))


if __name__ == "__main__":
    main()
