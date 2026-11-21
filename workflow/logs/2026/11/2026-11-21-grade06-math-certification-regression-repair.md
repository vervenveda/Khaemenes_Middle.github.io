# Grade 6 Mathematics — Certification regression and navigation repair

Date: 2026-11-21
PR: #35
Branch: `grade06-math-certification-validator-fix-20261121`

## Problem found
PR #34 merged successfully with three green PR checks and one failing new `Middle Mathematics Full-Course Validation` job. Earlier curriculum validators passed; the new `validate-grade6-math-supplemental-certification.mjs` check failed.

## Root-cause investigation
1. The added check initially recognized only the phrase "80% mastery", whereas canonical Week 05–07 and Week 11–16 practice sections use "80% progression gate". Updated regex to recognize both without changing mastery rules or scores.
2. The deeper source audit located a **real navigation gap**: Week 04, 05, 06 Mathematics lesson pages contained the general `weekly-assessments.html` route but lacked a direct link to their own `week-NN-assessment.html`. The underlying corresponding assessments already exist. Added direct `Verified Weekly Examination` anchors to the existing action bar on each of these three pages.
3. Read-only repository review counted 694 existing supplemental problems across Weeks 04–36, with 165 correctly placed practice sections. No additional problems or grading engine changes were needed.
4. Three existing synthetic checks for midterm 79/80 gates, certificate denial/eligibility, and end-of-year source contracts were added to the Middle Learning Engine Regression workflow. Existing learner persistence mock-storage testing remains in place.

## Boundaries
- No learner scores, account records, cloud data or exam question banks were edited.
- The direct exam links invoke existing official examination pages; they do not bypass mastery checks.
- Account Cloud cross-device durability, independently reviewed teacher-key correctness, actual desktop/tablet rendering, and student retention outcomes are still not certified.

## Acceptance
- Require PR #35 green CI including the supplemental certification validator and new synthetic assessment/certificate checks.
- Reinspect live navigation for Week 04–06, and confirm anonymous/enrolled learner authority remains isolated.
- Do not issue final A+++ certification until remaining academic, browser, and cloud blockers are resolved.
