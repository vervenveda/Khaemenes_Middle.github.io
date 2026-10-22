#!/usr/bin/env python3
"""Read-only regression check for Grade 8 weekly subject tables.

Run from repository root: python3 tests/test_grade8_week_plan_links.py
No network access, packages, or student data needed.
"""
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SUBJECTS = (
    "language-arts", "mathematics", "science", "social-studies",
    "world-languages", "arts-music", "health-pe-sel",
    "technology-design", "integrated-projects",
)

class SubjectTable(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_row = False
        self.cells = []
        self.current = None
        self.rows = []
        self.row_href = None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.in_row, self.cells, self.row_href = True, [], None
        elif self.in_row and tag == "td":
            self.current = []
        elif self.in_row and tag == "a":
            self.row_href = dict(attrs).get("href")

    def handle_data(self, data):
        if self.current is not None:
            self.current.append(data)

    def handle_endtag(self, tag):
        if tag == "td" and self.current is not None:
            self.cells.append("".join(self.current).strip())
            self.current = None
        elif tag == "tr" and self.in_row:
            if self.cells:
                self.rows.append((self.cells, self.row_href))
            self.in_row = False

def verify(week):
    path = ROOT / f"grades/grade-08/weekly-plans/week-{week:02d}.html"
    parser = SubjectTable()
    parser.feed(path.read_text(encoding="utf-8"))
    rows = parser.rows
    assert len(rows) == 9, f"{path}: expected nine subjects, got {len(rows)}"
    urls = [href for _, href in rows]
    expected = [f"../subjects/{subject}/week-{week:02d}.html" for subject in SUBJECTS]
    assert urls == expected, f"{path}: wrong/misordered subject destinations: {urls}"
    for (cells, href), subject in zip(rows, SUBJECTS):
        assert len(cells) == 4, f"{path}: malformed subject row {subject}"
        assert cells[0] and cells[1] and cells[2], f"{path}: blank subject text {subject}"
        assert subject.replace("-", " ") not in cells[0].lower() or cells[0], "invalid subject label"
        target = (path.parent / href).resolve()
        assert target.is_file(), f"{path}: missing lesson file {href}"
    print(f"PASS Grade 8 Week {week:02d}: nine correctly ordered live local lesson paths")

if __name__ == "__main__":
    for week in (13, 14):
        verify(week)
