#!/usr/bin/env python3
"""Fail closed for student-facing Middle School video releases.

Run: python3 tests/test_middle_video_release.py
This test never fetches or plays third-party videos.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
manifest = ROOT / "resources/video-study/video-source-review.json"
data = json.loads(manifest.read_text(encoding="utf-8"))
assert data["release_policy"]["disallow_embeds_without_approval"] is True
entries = data["priority_lessons"]
assert entries, "No video intake entries found"
seen = set()
for entry in entries:
    key = (entry["grade"], entry["subject"], entry["week"], entry["topic"])
    assert key not in seen, f"Duplicate intake: {key}"
    seen.add(key)
    assert entry["grade"] in ("06", "07", "08"), key
    assert 1 <= int(entry["week"]) <= 36, key
    lesson = ROOT / f"grades/grade-{entry['grade']}/subjects/{entry['subject']}/week-{int(entry['week']):02d}.html"
    assert lesson.is_file(), f"Missing destination lesson: {lesson}"
    approved = entry.get("student_release_approved") is True
    if approved:
        for field in ("video_url", "embed_url", "transcript_url"):
            assert isinstance(entry.get(field), str) and entry[field].startswith("https://"), (key, field)
        assert entry.get("source_rights") == "verified", key
        assert entry.get("playback_ad_test") == "passed", key
    else:
        assert not entry.get("embed_url"), f"Unapproved embed supplied for {key}"
print(f"PASS Middle video release manifest: {len(entries)} lessons; no unapproved embeds")
