# Grade 6 Mathematics — Early official bank answer verification (Weeks 07–13)

Date: 2026-11-21
Decision: Certification HOLD.

## Confirmed precursor
- PR #39 merged; all four checks passed.
- Earlier seeded independent answer oracles cover official Weeks 20–36, with mathematical calculation for their numerical questions and structural checks only for conceptual cases.

## Added coverage
- `tools/validate-grade6-math-early-week-07-13-answers.mjs` independently calculates correct answers from original question prompt text, without copying question-factory expected answer fields.
- 500 deterministic draws for each of Weeks 07–13: 3,500 official six-question sets and 21,000 generated question instances.
- Independent numeric/symbolic checks include signed coordinate plots/reflections and map distances, algebraic expressions and substitution, equations, inequalities and budget rounding, central tendency, rectangle/triangle/composite areas, and rectangular/composite prism volumes.
- Conceptual items receive structural checks and are counted separately.
- New validator is registered in `.github/workflows/middle-math-full-course.yml`.
- This is non-mutating: no changes to student records, verified grades, the question factory, learner identity, assessment gating or cloud accounts.

## Additional early-course verification
- Added `tools/validate-grade6-math-early-week-01-06-answers.mjs`: independently recomputes correct answers for the official shared Grade 6 mathematics generator across Weeks 01–06, 500 seeds each (3,000 six-item bank draws; 18,000 official item instances), including ratio identities, part/whole ratios, rates, percentages, fraction division, number ordering and absolute value.
- Added the second test to the Mathematics Full-Course workflow. Both new test scripts must pass after the latest commit before either is accepted.

## Weeks 14–19 coverage and confirmed curriculum correction
- Added `tools/validate-grade6-math-early-week-14-19-answers.mjs` with 500 independent seeded draws for each official math generator in Weeks 14–19 (3,000 six-item draws; 18,000 item instances). Skills include mass-per-volume, signed thermal changes, average speed, geometry portfolio problems, wave number lines/statistics, and visual ratios and unit rates.
- Confirmed a real official Week 19 answer-key defect in `makeGrade6VisualRatioWeek`: the requested ratio “in simplest terms” was sometimes stored as an unreduced ratio (for example 6:4 rather than 3:2). Replaced the answer formula with the greatest-common-divisor reduction of both base terms. Added the independent correct-answer check to prevent recurrence.
- This changes only the Week 19 official generator’s mathematically keyed answer and its explanation. No changes to mastery gates, enrollment, records or Account Cloud.
- New full-course regression scripts for Weeks 01–19 must all pass on the final PR head before acceptance. Existing 36-week inventory remains preserved.

## Validation and limitations
- Require new PR GitHub Actions to pass; investigate exact CI failures before merging.
- Once the latest PR tests pass, independently calculated numerical/symbolic oracles cover official Weeks 01–36; conceptual answer semantics and teacher-key comprehensiveness remain separately unverified.
- Remaining editorial verification: 661 supplementary teacher problems not independently checked beyond one-per-week samples, conceptual interpretations and holistic assessment quality.
- Live browser/tablet journeys, final graduation simulation, export/cloud restore and measured retention still block full certification.
