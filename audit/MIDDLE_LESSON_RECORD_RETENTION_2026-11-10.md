# Middle School Lesson → Checkpoint → Assessment Retention Audit
Date: November 10, 2026
Scope: Grades 06–08 shared lesson and assessment engines. Review branch only.

## End-to-end source trace
1. A weekly lesson such as `grades/grade-07/weekly-plans/week-01.html` loads `assets/khaemenes-middle-learning-ledger.js`. It creates randomized formative questions and an optional written reflection.
2. Formative checkpoint results are not formal mastery. The ledger writes practice evidence into `khaemenes_middle_learning_ledger_v1`, a browser-local map keyed by learner ID. The `khaemenes-middle-learning-context.js` mentor summary reads that ledger.
3. Formal assessment pages such as `grades/grade-07/assessments/week-01-assessment.html` load `assets/khaemenes-middle-assessment-engine.js`. Its attempts are stored under `khaemenes.middle.assessment.attempts:<learnerId>:grade-<grade>`.
4. Formal scores and score metadata are separately written under `khaemenes.course:<learnerId>:middle-grade-<grade>`. The grade-level course dashboard and continuation publisher use this course state to report verified progress and the next lesson step.
5. All these are local browser stores today. The continuation snapshot is a navigation summary, not the authoritative full attempted-question history.

## Repairs staged
**Formative lesson evidence**
- Require active family and exact learner-family membership before learner-scoped evidence is read or written.
- Bind a practice attempt to the learner selected when the practice begins. Do not save it as another learner's evidence if selection changes during work.
- Preview practice may still be completed, but is not persisted as authenticated learner evidence.
- Require storage write read-back and confirmation of the generated record ID before reporting a successful save.
- Idempotently ignore an already-recorded attempt ID to prevent a repeated save from duplicating that attempt.

**Formal assessments**
- Require active family membership and learner match before accessing formal assessment state.
- Validate attempt snapshot grade, kind, week and learner before recording a formal score.
- Confirm attempt-history write by reading back the attempt ID.
- Add `latestRetention()` as a read-only diagnostic: `no-attempt`, `preview`, `review-needed` (attempt history exists without matching latest score metadata), or `linked`.
- **Never** automatically transform an orphaned attempt into mastery or delete it. The separate attempt + course-score writes are still not an atomic backend transaction.

## Validation
- Both edited scripts passed JavaScript syntax checks.
- Isolated synthetic runtime tests executed with in-memory browser storage: legitimate checkpoint retained once, duplicate ignored, mismatched sibling rejected, other-family context rejected; formal diagnostic classified no attempt / partial score link / linked score correctly.
- Repeatable Node tests authored: `tests/middle-lesson-record-retention.test.cjs`. Full Node test runner and actual browser interaction tests have **not** been executed.
- No real learner records or lesson outputs were read, exported, deleted or migrated.

## Remaining retention risks
1. The formative ledger is still **one origin-wide JSON object**, so concurrent browser-tab read/modify/write operations can lose entries. Grade-level localStorage is not a secure, durable, cross-device learning ledger.
2. Formal attempt append + course score write remain **two independent browser storage operations**. `review-needed` is a detection-only state, not a recovery receipt.
3. A failed save must leave the learner able to retry without awarding mastery; browser UI and storage-failure acceptance tests remain.
4. Historic grade-wide browser records and older question attempt banks require separate identity-provenance inventories. Do not auto-claim or delete them.
5. Progress from the existing Grade 06–08 lesson system has not been tested for full T03 restoration or second-device continuity. STOS T03 must eventually provide authenticated identity, idempotent atomic record+audit+receipt, restoration and independent-device verification.

## Recommended next audit order
- Middle School: complete live browser synthetic checks for all three grades, including storage-quota failure, tab switching, and lesson refresh.
- High School: inspect Algebra I and English 9 per-lesson completion and Monte Carlo attempt retention (do not infer from dashboard snapshots).
- Kindergarten/Elementary: inspect lesson completion gates, per-week quizzes and grade-scoped family data.
- Foreign Languages: inspect French 101 unit quiz attempts, 80% unlock rules and first-device to second-device continuity.
- Once T03 commissioned, unify frontend lesson evidence contracts **without silently changing authored mastery rules**.
