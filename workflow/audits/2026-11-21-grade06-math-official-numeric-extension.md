# Grade 06 Mathematics — Expanded official numeric answer audit

Date: 2026-11-21
Repository: `vervenveda/Khaemenes_Middle.github.io`
Branch: `grade06-math-official-numeric-extension-20261121`
Certification outcome: **HOLD pending remaining editorial and operational evidence**.

## Prior audit accepted
- PR #37 merged; all four associated checks succeeded.
- `tools/validate-grade6-math-official-numeric-answers.mjs` independently recomputes selected generated mathematical answers for Weeks 26, 27, 28, 34, 35, and 36, for 500 seeded draws each.

## Added numerical verification
- Added independent question-prompt recomputation for six further Grade 6 mathematics generators: **Weeks 20, 21, 22, 29, 30, and 31**.
- 500 deterministic seeds per week; six questions per draw; 3,000 additional bank draws and 18,000 question instances.
- Calculated skills: fractions as percents, percentage of whole and change, comparisons of fractions, unit-fraction division, signed temperature/rational-number changes and distances, interpretation of signed data and fractional speaking turns.
- Conceptual items whose correctness cannot be reduced to a numerical oracle are separately counted as structurally valid only.
- Validator checks official answer choice index and unique skill coverage and compares the independent numeric result against the actual keyed answer.
- CI wiring added to `.github/workflows/middle-math-full-course.yml`.
- No student state, verified scores, exam bank contents, Account Cloud records, or 80% mastery logic changed.

## Status/remaining work
- Do not claim the new extension has passed until new PR validation returns success; correct independently identified errors rather than accepting faulty answer keys.
- Numerical oracle is scoped to selected weeks, not the entire mathematics question factory; conceptual item semantic correctness and 661 unsampled supplemental answers still require independent review.
- Full browser/tablet student journey, end-of-year gate and certificate validation, encrypted cloud archive/recovery, accessibility and measured 1/7/21-day retention still require operational tests.
