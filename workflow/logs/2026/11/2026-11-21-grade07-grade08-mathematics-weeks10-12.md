# Grade 7 and Grade 8 Mathematics — Curriculum expansion Weeks 10–12

Date: 2026-11-21
Branch: `grade07-grade08-math-depth-weeks10-12-20261121`
Release: source changes committed, GitHub Actions pending
Certification: HOLD pending complete mathematical editorial review, live-browser journeys and learning evidence

## Confirmed handoff
- PR #48 covering both grades' Weeks 07–09 is merged with all 10 latest reported CI checks successful.
- Grades 07 and 08 each retain 36 mathematics weekly pages, original five-day article structure, the established Grade 07 weekly presentation studio and Grade 08 shared math portal studio, plus the shared Lesson 01 interactive engine.
- Existing official assessments alone control academic scores, the 80% mastery gate and advancement.

## New Week 10–12 curriculum
- **30** daily mathematics laboratories (3 weeks × 5 days × 2 grades), **120** original practice questions and **120** corresponding answer-key entries, inside the six existing mathematics week pages.
- **Grade 7 Week 10:** rectangular and triangular-prism volume, surface area, lidless boxes, capacity versus material, non-overlapping composite volume.
- **Grade 7 Week 11:** theoretical and experimental probability, independent compound events, expected value, fairness and uncertainty of sample frequencies.
- **Grade 7 Week 12:** mean/median/mode, spread and range, quartiles/IQR, sample versus population, bias and evidence-based comparisons.
- **Grade 8 Week 10:** cylinder, cone and sphere volume; surface area distinction; cubic/area scaling and engineering assumptions.
- **Grade 8 Week 11:** bivariate points, linear trend equations, meaning of slope/intercept, residuals, association versus causation, prediction limitations.
- **Grade 8 Week 12:** theoretical/compound and conditional probability, empirical risk, complements and expected value.
- Each laboratory includes vocabulary in context, a fully worked mathematical model, a misconception checkpoint, four independent questions, a labeled formative response field, an independent self-check, and a four-item teacher key.
- Corrected a confusing Grade 7 Monday probability example to state all three even faces on a fair die directly.

## Engineering guardrails
- Original five daily articles in each file and existing Grade 7/8 mathematics studio owners retained. No competing JavaScript engine, grading authority, external dependency, student record write or Account Cloud storage.
- Added `tools/validate-grade7-grade8-math-foundation-weeks10-12.mjs`, wired to `.github/workflows/middle-math-full-course.yml`, to check panel counts, four distinct prompts/day, teacher answers, accessible response labels, worked-model-before-practice, response before key, script count and nonauthoritative mastery boundaries.
- The automated regression establishes **structural correctness**, not an independent calculation of all 120 answer keys. Such independent editorial recomputation remains outstanding.
- Real-browser/tablet render, accessibility tests, assessment 79/80 mastery boundary, persisted progress, exports and parent/Account Cloud recovery remain unverified.

## Follow-up
- Require all latest pull-request GitHub Actions to pass before merge.
- Next build: Week 13–15 of both grades; audit existing Grade 7/8 course-index focus-title drift separately.
- Add independent numerical/key semantic checking for all Grade 7/8 deep mathematics panels before claiming academic A+++ certification.
