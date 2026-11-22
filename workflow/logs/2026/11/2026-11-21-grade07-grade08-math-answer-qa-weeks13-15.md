# Grade 7/8 Mathematics — Weeks 13–15 Independent Academic Answer QA

Date: 2026-11-21
Branch: `grade07-08-math-academic-qa-weeks13-15-20261121`
Decision: Math-answer source certification for 600 early-year practice items contingent on this PR's CI; final A+++ learner/operational certification HOLD.

## Verified handoff
- PR #56 merged after all 10 GitHub checks passed: Grade 7/8 mathematics Weeks 10–12, 120 question-indexed teacher solutions and seven context/notation repairs.
- Prior merged PRs #53–#55 cover the other 360 Grade 7/8 Week 01–09 answer expectations. After PR #56, 480 of the 600 newly authored Week 01–15 items had independent indexed checks.

## Weeks 13–15 academic audit
- **30** daily mathematics labs, **120** independently curated item-indexed answer expectations.
- Grade 7: expressions, terms, equivalence and contextual models (Week 13); inequalities, domain restrictions and quantitative evidence (Week 14); scale diagrams, area factors, measurements and source consistency (Week 15).
- Grade 8: simultaneous equations, model comparisons and verification (Week 13); percentages, scientific notation and quantitative headlines (Week 14); coordinate transformations, similarity and congruence (Week 15).
- All original numeric/symbolic answers in this block agree with the independently maintained expected answer table in `tools/validate-grade7-grade8-math-answer-qa-weeks13-15.mjs`; no numerical answer change needed.

## Repairs for independently readable tasks
- Grade 7 Week 13: define x as number of boxes explicitly rather than an unbound variable.
- Grade 7 Week 15: state the two rectangle dimensions independently in the follow-up area prompt.
- Grade 8 Week 13: repeat the actual system in six 'find y' follow-up exercises so each question identifies the right equations.
- Grade 8 Week 15: clarify origin-centered dilation and repeat the reflected intermediate point when composing transformations.
- No assessment results, learning engines, grade authority or Account Cloud records changed.

## Acceptance and limitations
- Registered the 120-item mathematical expectation validator in `.github/workflows/middle-math-full-course.yml` with all earlier QA checks retained.
- Once CI passes, **600 of 600 early-year new practice items** have full independent indexed numerical/symbolic review. Weeks 16–36 already have **840** source-parameter based recalculations. This proves the particular answer-key expectations checked against mathematical models, not the complete curriculum's conceptual breadth, rich solutions, distractor validity, retention or student mastery.
- Real iPad/desktop, keyboard and screen reader, 79%/80% official grading, encrypted cloud archive/ZIP export and recovery all remain unverified by these source tests.
