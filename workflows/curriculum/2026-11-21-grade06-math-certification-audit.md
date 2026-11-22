# Grade 6 Mathematics — Certification Gate Audit
Date: 2026-11-21
Status: **HOLD — curriculum extension committed in separate PRs, formal mastery not certified**
Source: `vervenveda/Khaemenes_Middle.github.io`, default `main`
Audit mode: repository source inspection only; no student data accessed or modified.

## Evidence observed
1. `assets/khaemenes-middle-assessment-engine.js` has a first-party formal assessment engine with 80% mastery threshold and candidate pools. Its week/midterm/final routing, question generation and answer scoring exist in source.
2. Grade 6 weekly exams request 18 questions, including exactly 6 aligned mathematics and 12 other-subject questions. Midterm requests 36 questions: 18 mathematics (one per Week 1–18) and 18 other-subject questions. Final requests 45 questions: 18 mathematics and 27 other-subject questions, with one mathematics item per pair of weeks.
3. Grade 6 scoring uses `rawScore=Math.round(correct/qs.length*100)`, `mathScore=Math.round(mathCorrect/mathResponses.length*100)`; if mathScore <80, it caps the recorded progression score at 79. Both strands must pass.
4. Gate definitions check the preceding week's saved numeric score, all Weeks 01–18 before midterm, midterm before Week 19+, and all 36 weeks plus midterm before final.
5. Submit handler checks that all questions are answered, same learner remains selected, gate remains open and duplicate form submission is blocked. It requires attempt history storage to succeed before calling formal score writer.
6. `assets/khaemenes-middle-question-factory.js` exports Grade 6 week-specific generators through Week 36 and `makeGrade6MidtermMath`; this confirms symbol presence, not generated answer correctness.
7. `grades/grade-06/assessments/midterm.html` labels the examination closed-book, and `week-18-assessment.html` distinguishes paper performance rubric from the randomized knowledge examination.

## Five certification bubbles — priority order

### B1 CRITICAL: course record is client-writable, not authoritative verification
`state()` loads `khaemenes.course:<learnerId>:middle-grade-06` from browser localStorage; `saveState()` writes the same. `gate()` authorizes progression from those numeric fields. Browser users, extensions, or a same-origin script may alter these values without the assessment engine. `verifiedBy` is an ordinary local string, not a signature. **Do not classify this as trusted Account Cloud–verified mastery.** A fail-closed, server/native-authorized provenance/validation layer is required before certification. Preserve existing local evidence for later provenance reconciliation; do not silently erase or upgrade it.

### B2 HIGH: browser-held identity and history can be edited
`learner()` trusts localStorage active ID and localStorage family registry. The engine checks identity continuity within an attempt, but the binding is not cryptographically authenticated. Attempt snapshots in localStorage are also user-editable, despite the exported `attemptSnapshotsImmutable:true` descriptor. Student identity and attempts must be verified against an approved account-record authority; until then mark evidence as locally recorded, not tamper-evident.

### B3 HIGH: randomized bank validity and full coverage untested
Questions are generated client-side. Symbol presence and source-count assertions are not equivalent to testing all 36 weeks, every seed family, duplicate answer options, distractors, mathematical equivalence, and rationale correctness. Need deterministic seed regression and content fixtures. Final coverage alternates between members of each two-week pair across attempts, not every week in one 45-item exam.

### B4 MEDIUM: documentation versus runtime verification and closed-book conditions
The HTML describes closed-book cumulative exams, but code-level UI instructions cannot prevent external reference use. No invigilated or hardware-enforced closed-book mechanism was verified. Distinguish an expected exam condition from a technical guarantee. Browser/tablet, keyboard/screen-reader, failed persistence, intermittent network and interrupted submission tests are pending.

### B5 MEDIUM: approved exports and parent/account-cloud provenance unresolved
The engine dispatches a client-side `khaemenes-middle-assessment-recorded` event and stores a local course state. No end-to-end cloud transfer, export manifest, family-vault provenance or parent review approval has been demonstrated by this source inspection. Audit the authorized transport and reconciliation flow before advertising complete account-cloud sync.

## No destructive changes
- No assessment code or grade records changed.
- No bypass of the 80% gate introduced.
- Existing learner records must be preserved and labeled pending provenance certification, not deleted or automatically trusted.
- Curriculum PRs remain independent of this audit.

## Validation matrix before certification
- Verify 36 weekly math generators yield 6 validated items each across deterministic seeds; 12 nonmath likewise.
- Midterm: exactly 18 math topics with one per Week 1–18 and 18 nonmath; complete 36 questions; math and overall thresholds.
- Final: 18 math (week-pair sampling) and 27 nonmath; full 45 questions.
- Boundary tests: 14/18 fails and 15/18 passes overall; 4/6 fails and 5/6 passes math; 14/18 fails and 15/18 passes midterm math; 35/45 passes overall while math <80 must fail.
- No prior-week progression, no midterm without 18 mastered weekly records, no Week 19+ without verified midterm, no final without all weekly records.
- Confirm attempt replay prevention and resumed/interrupted submission behavior across session changes.
- Use two synthetic learner identities to prove no cross-learner record promotion; never use live child data in tests.
- Test account-cloud provenance, approvals, exports and safe read-only fallback without writing unverified 'verified' scores.

## Disposition
**HOLD** for formal academic certification. Existing mathematical curriculum enhancements may continue independently. The next engineering work must establish a trusted, fail-closed assessment authority and provenance-backed learner record before claiming verified mastery or full account-cloud synchronization.
