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

## Validation and limitations
- Require new PR GitHub Actions to pass; investigate exact CI failures before merging.
- Remaining independent property verification: official Weeks 01–06 and 14–19.
- Remaining editorial verification: 661 supplementary teacher problems not independently checked beyond one-per-week samples, conceptual interpretations and holistic assessment quality.
- Live browser/tablet journeys, final graduation simulation, export/cloud restore and measured retention still block full certification.
