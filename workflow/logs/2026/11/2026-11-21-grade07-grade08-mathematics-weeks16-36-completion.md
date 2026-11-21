# Grade 7 & 8 Mathematics — Remaining Week 16–36 Completion and Certification Audit

Date: 2026-11-21
Repository: `vervenveda/Khaemenes_Middle.github.io`
Branch: `grade07-08-math-complete-weeks16-36-20261121`
Curriculum state: 36 weekly mathematics pages per grade; source-level deep lesson enrichment authored for all weeks.
A+++ final academic/operational certification: **HOLD**.

## Verified baseline before this build
- PRs #46–#51 merged. Grade 7 and 8 Mathematics each had Weeks 01–15 enhanced (75 daily laboratories per grade), plus an existing 36-week generic mathematics scaffold, Grade 7 and Grade 8 approved studio presentation owners and shared formative question factory.
- PR #51 closed with all 11 checks passing and its 30 first-item answer expectations checked independently.

## Whole remaining-course development
- All Grade 07 and Grade 08 mathematics weekly pages from **Week 16 through Week 36** now include five new mathematically focused daily labs inserted into their **existing** five article sections: **42** week pages × 5 = **210** instructional labs.
- **840** additional four-item problems and **840** teacher-key answer entries authored, with typed operand attributes intended for independent algebraic and numerical recomputation.
- Added a clear math-specific title for all 42 weekly pages, replacing unrelated generic schoolwide titles (poetry, biology, social studies and so forth) without changing underlying shared cross-curricular materials or the page URL.
- Corrected each Grade 7 / 8 Mathematics catalog card for Weeks 16–36, preserving 36 course weeks and all existing week routes in each catalog.
- Grade 7 sequence: circle geometry; prism area/volume; statistics and probability; ratios; percentages; signed rational operations; algebraic expressions; inequalities; scaled geometry; then cumulative geometry, modeling, probability and grade-8-readiness.
- Grade 8 sequence: similarity; Pythagorean theorem; bivariate data; linear models; functions; slope; systems; scientific notation; transformations; then applied review and high-school-readiness.
- Every lab includes vocabulary, an explicit reasoning model and misconception, four individual question-and-solution entries, a labeled response field, self-check, and a teacher key disclosure. The five weekday pedagogical stages progress from concept work to guided precision, investigation, critique, and cumulative transfer.
- New lesson fields explicitly are **formative only and not automatically saved**. Authorized Academy assessments alone may record grade evidence and unlock lessons.

## Evidence and regression
- Added `tools/validate-grade7-grade8-math-weeks16-36-completion.mjs`, registered in `.github/workflows/middle-math-full-course.yml`. It verifies each of 42 week pages has five new labs and keyed prompts, matches the 42 corrected catalog titles and all 42 original course URLs, verifies form label association and nonauthoritative grading boundary, and recalculates each of **840** answer strings using numeric parameters and an answer-type arithmetic oracle.
- The 840 checks are deterministic, parameter-based arithmetic/geometry validations, **not** human review of all wording, conceptual misconceptions, alternate valid solutions or real student learning.
- Full-course structural maths test and existing PR CI must pass on this branch **before merge**. Do not interpret a source-level test as browser or tablet verification.

## Remaining hold points
1. Grade 7/8 Weeks 01–15: 600 earlier added problems with only a 60-problem independently documented sample across Weeks 10–15; remaining 540 previous responses require comprehensive separate verification. Note these counts refer to newly authored enrichment, not all official test banks.
2. The newly completed Week 16–36 lessons were built from reusable, topic-specific problem templates and require educator/editorial review for breadth, independent problem variety, scientific context, pedagogy and high-quality model explanations. Automated correctness cannot certify A+++ depth.
3. Live desktop/tablet (portrait/landscape) navigation, screen reader, translator, tools, handwriting/export, authenticated student/parent journey, 79/80 mastery boundary, grade recording, account cloud archive and encrypted recovery remain unverified.
4. No changes to Account Cloud state, actual student records, official grade authority, examination pools or 80% progress rules.

## Next
- Review any CI defects, repair answer generator/calculator mismatches, merge with the repo-approved linear/rebase method only after green.
- Run a separate independent editorial question-quality audit, prioritizing Grade 7/8 Weeks 16–36 and complete numerical review Weeks 01–15. Continue live learner/parent regression and security testing with synthetic records.
