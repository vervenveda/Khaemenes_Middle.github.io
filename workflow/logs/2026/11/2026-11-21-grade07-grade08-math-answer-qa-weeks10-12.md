# Grade 7 and 8 Mathematics — Independent Answer QA, Weeks 10–12

Date: 2026-11-21
Branch: `grade07-08-math-academic-qa-weeks10-12-20261121`
Certification decision: HOLD pending remaining editorial assessment, live learner experiences and cloud/export tests.

## Handoff and findings
- PR #55 merged, with 9/9 checks passing, covering Grade 7 and 8 Weeks 07–09. The independent early-year review had reached 360 of 600 authored items.
- Reviewed all 30 daily mathematics laboratory prompts and their 120 teacher solution entries in Grade 7/8 Weeks 10–12: Grade 7 prism geometry, fair games, statistics; Grade 8 solid-geometry volume, bivariate evidence, probability and conditional risk.
- Found no incorrect numerical or symbolic teacher-key entries in this reviewed block. Added a separate 120-answer expectation table in `tools/validate-grade7-grade8-math-answer-qa-weeks10-12.mjs`, registered in the full-course CI.

## Concrete clarity repairs
1. Grade 7 Week 12: independently restated the eight sorted observations in the lower quartile, upper quartile and IQR prompts, avoiding undefined 'that set' when questions are viewed separately.
2. Grade 8 Week 12: removed a misleading closing-parenthesis structure in two coin-flip prompts, explicitly stated fair coin trials, and clarified that the two fair dice are independent.
3. Grade 8 Week 10: specified equal base and perpendicular height in the cylinder-versus-cone volume comparison, preserving the intended one-third relationship.

These are seven contextual/notation changes. The mathematically correct teacher solutions were retained.

## Test and release boundary
- The new check verifies 120 indexed Grade 7/8 answer values, lesson uniqueness and key counts, accessible response labels, nonpersistent formative practice and the single official 80% mastery authority.
- If GitHub CI passes and the PR merges, full indexed early-year Grade 7/8 answer review reaches **480 of 600** items, leaving 120 items in Weeks 13–15. This is separate from Weeks 16–36 automated 840-item parameter recalculation.
- This evidence is source-level. Educator assessment of broad reasoning/distractors and real tablet/browser/student/parent/account-cloud journeys remain unverified. No grade, assessment, identity or Account Cloud records changed.
