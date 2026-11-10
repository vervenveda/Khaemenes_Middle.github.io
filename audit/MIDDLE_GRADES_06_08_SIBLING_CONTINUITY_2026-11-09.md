# Middle School Grades 6–8 — Sibling Context and Continuity Hardening
**Audit:** November 9, 2026  
**Branch:** `hardening/middle-sibling-continuity-2026-11-09`  
**State:** Review only; no production deployment or learner-record migration.

## Verified frontend topology
The Middle repository has Grade 06, 07, and 08 landing/record pages under `grades/grade-XX/index.html`. The attempted canonical `student-profile/index.html` paths, both shared and per-grade, returned 404. These grade landing pages are not interchangeable with a dedicated student profile. Parents currently reach the grade landing pages from the Family Portal.

All grades consume `assets/khaemenes-grade-continuity.js`, which distinguishes `ready`, `placement-mismatch`, and `no-active-learner`, with distinct learner-scoped course storage and quarantined legacy grade-wide records.

## Findings and review-branch repairs
1. **Grade 7 stale learner data:** `grades/grade-07/assets/app.js` refreshed only when the scope changed during `pageshow`. It now refreshes on page show, focus, storage, family changes, assessment updates, and continuity updates, reloading the newly selected learner's state.
2. **Grade 8 stale learner data:** The same improvement was applied to `grades/grade-08/assets/app.js`. Both listen for active learner, registry, and scoped course-key storage changes.
3. **Grade 7 deletion ambiguity:** Clear Records previously accepted a failed `CONT.clearState` attempt or fell back to a grade-wide legacy delete. It now requires `ready` and an unchanged loaded scope, then requires explicit success from the scoped clear operation before reporting success.
4. **Grade 8 deletion ambiguity:** Applied the same fail-closed clearing guard. No legacy fallback deletion is used.
5. **Grades 6–8 Continuation routes:** `middleGradeContinue` previously took a browser-wide learner ID directly from localStorage. All three now use the grade-continuity service's `ready` identity only and restrict continuation destinations to `https://vervenveda.com`; otherwise links return to the same grade's learning navigator.

## Regression coverage
`tests/middle-sibling-continuity.test.cjs` contains synthetic/source assertions for Grades 7/8 refresh events, scoped deletion, stable write scope, Grade 6 parity, legacy isolation, and all three grade-continuation button identity/URL conditions.

## Verification performed
- Parsed the changed Grade 06–08 HTML inline scripts, Grade 07–08 app JS, and the regression test source with an isolated JavaScript compiler: **all PASS**.
- The Node test runner and actual browser multi-sibling/cross-tab tests have **not** been executed, and no records were read from a real family browser.

## Important boundaries
- Browser-local `getLearner()` and the family registry are not STOS authenticated authority; `ready` is a placement/identity consistency check, not proof of guardian permission.
- This work does not implement true parent-only read-only mode inside academic course or assessment pages. A destination must enforce parent permissions on its actual record write/API boundary once T03 is commissioned.
- Dedicated Middle School student-profile topology remains unresolved. Grade landing pages are existing routes, not verified equivalence to a full student-profile experience.
- T01/T03, production systems, original learner records, and the old unscoped legacy keys remain untouched.

## Next safe handoff
Audit High School Grades 9–12 for matching current learner, stale course cards, editing permission checks, and complete parent return navigation; keep changes on review branches and test before merge.
