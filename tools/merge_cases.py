# -*- coding: utf-8 -*-
"""cases_*.jsonl 을 커버리지 엑셀(케이스·관점표 시트)에 합친다 (CT_05 §4·§6)

사용: python tools/merge_cases.py <KEY 폴더> [<커버리지 xlsx>]
  - 폴더의 cases_*.jsonl 을 모두 읽어 케이스 시트를 다시 쓰고(번호순),
    관점표에서 api·views 가 맞는 칸의 ○ 를 케이스 번호로 바꾼다.
  - 관점표에 없는 api(공통 행 포함 이름 불일치)는 '공통' 행 중 같은 관점 칸에 붙인다.
"""
import re
import sys
import glob
import json
import os
import openpyxl
from openpyxl.styles import PatternFill, Alignment

FILL = {"PASS": "E2EFDA", "FAIL": "F8CBAD", "관찰": "FFF2CC"}


def main():
    folder = sys.argv[1]
    xlsx = sys.argv[2] if len(sys.argv) > 2 else glob.glob(os.path.join(folder, "*_커버리지.xlsx"))[0]
    cases = []
    for f in sorted(glob.glob(os.path.join(folder, "cases_*.jsonl"))):
        for line in open(f, encoding="utf-8"):
            line = line.strip()
            if line:
                cases.append(json.loads(line))
    cases.sort(key=lambda c: c.get("no", ""))

    wb = openpyxl.load_workbook(xlsx)
    ws = wb["케이스"]
    ws.delete_rows(2, ws.max_row)
    for c in cases:
        ws.append([c.get("no"), c.get("api"), c.get("views"), c.get("case"), c.get("input"), c.get("expected"),
                   c.get("actual"), c.get("verdict"), c.get("sample"), c.get("auto"), c.get("note")])
        color = FILL.get(c.get("verdict"))
        if color:
            ws.cell(ws.max_row, 8).fill = PatternFill("solid", fgColor=color)
        for cell in ws[ws.max_row]:
            cell.alignment = Alignment(wrap_text=True, vertical="top")

    mv = wb["관점표"]
    vcol = {mv.cell(1, j).value.split()[0]: j for j in range(3, mv.max_column + 1) if mv.cell(1, j).value}
    rows = {}
    for i in range(2, mv.max_row + 1):
        name = mv.cell(i, 2).value
        if name:
            rows.setdefault(name, i)
    common = [i for i in range(2, mv.max_row + 1) if mv.cell(i, 1).value == "공통"]
    # 다시 합칠 때를 위해 케이스 번호 칸은 ○ 로 되돌린 뒤 채운다
    for i in range(2, mv.max_row + 1):
        for j in vcol.values():
            v = mv.cell(i, j).value
            if isinstance(v, str) and re.match(r"^[A-Z]\d", v):
                mv.cell(i, j).value = "○"
    miss = 0
    for c in cases:
        # "useSearch·useKeyboard", "open(options.zIndex)", "searchScope=all", "escape(미문서)" → 이름만
        apis = [re.split(r"[(=\s]", a.strip())[0] for a in re.split(r"[,/·]", str(c.get("api", ""))) if a.strip()]
        for v in [x.strip() for x in str(c.get("views", "")).split(",") if x.strip()]:
            j = vcol.get(v)
            if not j:
                continue
            targets = [rows[a] for a in apis if a in rows] or [i for i in common if mv.cell(i, j).value != "-"][:1]
            if not targets:
                miss += 1
            for i in targets:
                cur = mv.cell(i, j).value
                mv.cell(i, j).value = c["no"] if cur in ("○", "-", None) else (cur + "," + c["no"] if c["no"] not in cur else cur)
    wb.save(xlsx)
    n = len(cases)
    by = {k: sum(1 for c in cases if c.get("verdict") == k) for k in ("PASS", "FAIL", "관찰")}
    tgt = sum(1 for i in range(2, mv.max_row + 1) for j in vcol.values()
              if isinstance(mv.cell(i, j).value, str) and (mv.cell(i, j).value == "○" or re.match(r"^[A-Z]\d", mv.cell(i, j).value)))
    done = sum(1 for i in range(2, mv.max_row + 1) for j in vcol.values()
               if isinstance(mv.cell(i, j).value, str) and re.match(r"^[A-Z]\d", mv.cell(i, j).value))
    print(f"케이스 {n} {by} / 관점표 {done}/{tgt} 칸 = {done * 100 // max(tgt, 1)}% / 매핑 못한 칸 {miss}")


if __name__ == "__main__":
    main()
