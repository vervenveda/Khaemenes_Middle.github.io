# Grade 7 and Grade 8 Mathematics — Three-week engine curriculum expansion: Weeks 04–06

Date: 2026-11-21
Branch: `grade07-grade08-math-depth-weeks04-06-20261121`
Certification decision: **HOLD** pending independent mathematics editorial review and real browser/learner tests.

## Accepted baseline
- PR #46 merged with 10/10 CI checks. It added Grade 7 and Grade 8 mathematics Weeks 01–03: 30 daily laboratories and 120 authored teacher-keyed independent problems.
- Original grade 07 and 08 repositories each have 36 weekly files, canonical shared Grade 6/7/8 interactive Lesson 01 engine, independently owned Grade 07 weekly studio and Grade 06/08 weekly studio, first-party question factory and nonauthoritative practice. These components must not be duplicated.

## New curriculum depth (Weeks 04–06)
- Added **30** daily mathematics laboratories (2 grades × 3 weeks × 5 days) and **120** original student problems with matching item-indexed teacher solution keys.
- Every added panel: vocabulary in context, solved mathematical model, explicit conceptual misconception, four independent questions, a labeled formative response field, independent verification before revealing solutions, and preserved Academy exam authority.
- Grade 07 Week 04: percentage increase/decrease, discounts/tax, civic sample proportions, reverse-percent problems and evidence limits.
- Grade 07 Week 05: positive and negative rational arithmetic, operations on fractions/decimals, reciprocal division, signed changes and verification.
- Grade 07 Week 06: variables and fixed terms, distribution including negative factors, like terms, equivalent expressions and break-even modeling.
- Grade 08 Week 04: slope/intercept, slope from pairs, misleading graphic axes, intersections and mathematical evidence.
- Grade 08 Week 05: systems using substitution and elimination, no/infinitely many solutions, plan comparisons and two-equation verification.
- Grade 08 Week 06: exponents, powers of ten, normalizing scientific notation, exponent multiplication/division, negative exponents and magnitude.

## Preserved topology
- Only six weekly HTML pages changed; their five original daily articles, Grade 07 weekly studio, Grade 08 shared portal studio, original scripts, canonical translator/header/toolbars and original assessment navigation remain unchanged.
- Formative input explicitly does **not** auto-save, change authoritative scores, set 80% mastery, enroll a learner, update Account Cloud or unlock lessons.
- Added `tools/validate-grade7-grade8-math-foundation-weeks04-06.mjs` and connected it to `.github/workflows/middle-math-full-course.yml`; require latest PR CI success.

## Editorial findings and remaining weaknesses
- Some course catalog card focus labels from the generic curriculum-map cycle differ from the true first-12-week mathematics titles. Week 04 Grade 07 labels 'expressions', while its Week 04 mathematics title is Percent Change and Civic Data; Grade 08 labels 'systems' while Week 04 focuses on slope. **Catalog semantic drift remains open** for a future targeted correction after checking the canonical focus map and all grade-week titles.
- The existing generic objectives/teacher scripts have not been deleted; deep mathematics panels supplement them. Coursewide grade-specific teacher-script revision remains needed.
- The automated regression verifies structure, topical isolation, response safety and 120 key *entries*, but it does not independently recompute every result or prove learning retention. Independent editorial review and distractor semantic audits remain outstanding.
- Browser and tablet orientation, accessibility, student/parent course-to-lesson routing, authorized assessment boundaries, record durability and encrypted Account Cloud recovery remain **HOLD** until tested with synthetic identities.

## Next
Audit final CI, merge with permitted rebase method if passing and conflict-free, then continue in three-week blocks with Grade 7/8 Weeks 07–09 and start independent mathematically recomputed answer-key checks.
