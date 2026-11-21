# Grade 06 Mathematics — Independent coordinate, algebra and inequality answer audit

Date: 2026-11-21
Branch: `grade06-math-official-coordinate-algebra-audit-20261121`
Certification decision: **HOLD** — mathematical subsets and static safeguards do not prove complete educational or operational outcomes.

## Previous evidence
- PR #38 merged, with all four checks passing. Its independent test oracle now covers randomized Week 20–22 and Week 29–31 numerical answers; previous property-based tests cover Weeks 26–28 and 34–36.
- A separate first editorial sample covers 33 of the 694 supplemental teacher responses.

## Added in this audit increment
- New source-independent numerical and symbolic checker: `tools/validate-grade6-math-coordinate-algebra-answers.mjs`.
- For official Weeks **23, 24, 25, 32 and 33**, check 500 seeded six-question assessment draws per week (2,500 draws, up to 15,000 official question instances).
- Recompute coordinate quadrant/distance/reflection answers, coefficient expressions, evaluation, distribution, like terms, one-variable equations and signed/strict/inclusive inequalities from the presented question, not from the factory's stored correct-answer field.
- Preserve four-option schema, authoritative correct option index, mathematics subject and six distinct skills per generated draw.
- Conceptual and personal-data interpretation questions are counted separately; numerical/symbolic tests cannot establish their semantic correctness.
- Add the validator to `.github/workflows/middle-math-full-course.yml`; require a successful GitHub Actions result on the PR before reporting a PASS.

## Boundaries
- No modification of official question factory, 80% gate, student/parent identities, progress, score storage, gradebook or Account Cloud.
- This extends official numerical bank coverage to **17 weekly generators**, but does not independently verify Weeks 01–19 or every supplementary teacher key.
- Full desktop/tablet browser and accessibility checks, synthetic end-to-end final completion and cloud restoration, and learning retention measurement remain outstanding.

## Follow-through
- Investigate any CI failure with exact failing question/prompt; fix incorrect test assumptions without masking genuine wrong answers.
- Continue independent quantitative and conceptual editorial review across Weeks 01–19 and all 694 supplemental problems.
