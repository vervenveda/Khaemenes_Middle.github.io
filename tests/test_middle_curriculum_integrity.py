#!/usr/bin/env python3
"""Read-only Grades 6–8 curriculum link and instructional-shell regression audit.

Run: python3 tests/test_middle_curriculum_integrity.py
Run strict (also fail on generic lessons): python3 tests/test_middle_curriculum_integrity.py --strict
No dependencies, browser account access, or network requests.
"""
import re
import sys
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SUBJECTS = ("language-arts", "mathematics", "science", "social-studies",
            "world-languages", "arts-music", "health-pe-sel", "technology-design",
            "integrated-projects")
STRUCTURAL = []
DEPTH = []
COUNT = 0

def report(bucket, label):
    bucket.append(label)

for grade in ("06", "07", "08"):
    base = ROOT / "grades" / ("grade-" + grade)
    for week in range(1, 37):
        ww = f"{week:02d}"
        plan = base / "weekly-plans" / f"week-{ww}.html"
        printable = base / "printables" / f"week-{ww}-packet.html"
        assessment = base / "assessments" / f"week-{ww}-assessment.html"
        for file in (plan, printable, assessment):
            if not file.is_file():
                report(STRUCTURAL, f"MISSING {file.relative_to(ROOT)}")
        if not plan.is_file():
            continue
        html = plan.read_text(encoding="utf-8")
        hrefs = re.findall(r"""href=['"]\.\./subjects/([^/'"]+)/week-(\d\d)\.html['"]""", html)
        expected = [(subject, ww) for subject in SUBJECTS]
        if hrefs != expected:
            report(STRUCTURAL, f"SUBJECT LINKS grade-{grade}/week-{ww}: found {hrefs!r}")
        # Also reject a mislabeled link: a structurally valid href is not enough.
        rows = re.findall(r"<tr><td>(.*?)</td><td>(.*?)</td><td>(.*?)</td><td><a href=['\"]\.\./subjects/([^/'\"]+)/week-\d\d\.html['\"]>Open</a></td></tr>", html, re.S)
        expected_labels = ("Language Arts", "Mathematics", "Science", "Social Studies",
                           "World Languages", "Arts", "Health", "Technology", "Integrated")
        if len(rows) != 9:
            report(STRUCTURAL, f"SUBJECT ROWS grade-{grade}/week-{ww}: found {len(rows)}")
        else:
            for row, expected_subject, label in zip(rows, SUBJECTS, expected_labels):
                name, focus, objective, slug = row
                if slug != expected_subject or label.lower() not in unescape(name).lower():
                    report(STRUCTURAL, f"MISLABELED SUBJECT grade-{grade}/week-{ww}: {name} -> {slug}")
                if not unescape(focus).strip() or not unescape(objective).strip():
                    report(STRUCTURAL, f"EMPTY SUBJECT DESCRIPTION grade-{grade}/week-{ww}: {slug}")
        for subject in SUBJECTS:
            lesson = base / "subjects" / subject / f"week-{ww}.html"
            if not lesson.is_file():
                report(STRUCTURAL, f"MISSING {lesson.relative_to(ROOT)}")
                continue
            COUNT += 1
            txt = lesson.read_text(encoding="utf-8")
            if txt.count('<article class="lesson">') < 5:
                report(DEPTH, f"INSUFFICIENT DAYS {lesson.relative_to(ROOT)}")
            if "Name the subject:" in txt:
                report(DEPTH, f"GENERIC TEMPLATE {lesson.relative_to(ROOT)}")
        if f"../printables/week-{ww}-packet.html" not in html:
            report(STRUCTURAL, f"PRINT LINK grade-{grade}/week-{ww}")
        if f"../assessments/week-{ww}-assessment.html" not in html:
            report(STRUCTURAL, f"ASSESSMENT LINK grade-{grade}/week-{ww}")
        if printable.is_file() and "window.print()" not in printable.read_text(encoding="utf-8"):
            report(STRUCTURAL, f"PRINT CONTROL grade-{grade}/week-{ww}")
        if assessment.is_file():
            evidence = assessment.read_text(encoding="utf-8")
            if '18/22' not in evidence and grade == "08":
                report(STRUCTURAL, f"ASSESSMENT THRESHOLD grade-{grade}/week-{ww}")
print(f"Audited 108 weekly plans and up to 972 subject-week lessons; inspected {COUNT} lesson files")
print(f"Structural findings: {len(STRUCTURAL)}; instructional-depth findings: {len(DEPTH)}")
for finding in STRUCTURAL + DEPTH:
    print(f"  {finding}")
if STRUCTURAL or ("--strict" in sys.argv and DEPTH):
    sys.exit(1)
print("PASS structural integrity (depth findings are reported separately)")
