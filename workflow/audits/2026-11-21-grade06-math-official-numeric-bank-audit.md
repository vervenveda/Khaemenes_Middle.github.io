# Grade 6 Mathematics — Official randomized question-bank numeric audit

Date: 2026-11-21
Branch: `grade06-math-official-bank-numeric-audit-20261121`
Decision: **CERTIFICATION HOLD** pending full answer review, live browser experience, and Account Cloud durability.

## Previously closed
- PR #36 is merged; its four GitHub checks passed.
- The 33-week sampled supplementary answer audit is part of CI. This was 33/694 supplemental problems, not full editorial certification.

## New independent computation
- Added `tools/validate-grade6-math-official-numeric-answers.mjs`.
- Uses 500 independent seeded draws for each of the official Grade 6 mathematics question generators for Weeks **26, 27, 28, 34, 35, 36**, totaling 3,000 six-question-bank draws.
- Independently recalculates generated numerical expected answers using question text: area/volume/surface area, triangle and prism formulas, mean/median/mode/range, simplified ratios/equivalent ratios, rates, linear equations, signed inequalities and feasible whole-number project quantities.
- Asserts grade, mathematics subject, validated item structure, correct option index, unique skills per bank, and exact calculated answer for each numerical item.
- Conceptual questions receive structural validation but **not an independent semantic truth review**. The script explicitly counts them separately.
- Connected to the existing full-course Mathematics GitHub Actions workflow for every PR/main change touching the script.

## Audit limits
- This initial property-based validator covers six selected weeks of official generated numerical question banks. It does not independently assess Weeks 01–25, 29–33 or all underlying supplemental teacher answer keys.
- Existing mathematical correctness and student learning outcomes must not be inferred from schema-only checks.
- Midterm and final gate tests use synthetic in-memory/local browser stores. Account Cloud encryption, off-device sync, restoration and student identity isolation in real production still require end-to-end evidence.
- Await automated CI results for this new branch; any failure must be investigated, not bypassed.

## Next acceptance
1. Correct any concrete numeric mismatch found by CI.
2. Expand independently calculated quantitative checks to the remaining official Grade 6 week pools.
3. Review all written teacher keys with independent arithmetic/editorial verification.
4. Complete synthetic live desktop/tablet navigation and recovery verification; then decide on certification.
