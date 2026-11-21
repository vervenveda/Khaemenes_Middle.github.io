# Grade 07 Mathematics Studio · 36-Week Wiring Closeout

**Date:** 2026-11-20
**Type:** curriculum presentation upgrade / repository audit
**Repository:** vervenveda/Khaemenes_Middle.github.io
**Scope:** Grade 07 mathematics Weeks 01–36 only
**Authority:** Non-authoritative lesson presentation. No changes to assessments, learner identity, mastery, grades, midterms, finals, or certificates.

## Work completed

- Introduced shared Grade 7 week-page enhancement at `assets/grade-07-mathematics-studio-v1.js`.
- Connected all 36 existing `grades/grade-07/subjects/mathematics/week-NN.html` pages.
- Preserved each week's five existing daily `article.lesson` elements and the `khaemenes-middle-learning-ledger.js` formative checkpoint service.
- Enhanced daily sections in place with single-open accordions, typed mathematical reasoning, a pointer-based handwriting canvas, undo/clear/PNG export, and an optional eight-card mathematics tool/game shelf.
- Preserved the approved independent `grades/grade-07/subjects/mathematics/lesson-01.html`; Week 01 Monday links to it.
- Added the canonical auto-populating ticker, canonical VNV/Khaemenes header with hamburger and no header action buttons, and lower-left universal class-tools toolbar to the 36 week pages.
- Retained the existing official VNV translator and six-control lower-right ecosystem toolbar.
- Scoped the new enhancement to Grade 07 mathematics week routes only.

## Verification

A fresh read of the complete 36-week source population after the commits confirmed for **each** page:

| Check | Result |
| --- | --- |
| Five original Monday–Friday lesson headings | 36/36 PASS |
| Exactly one shared Grade 07 Mathematics Studio reference | 36/36 PASS |
| Exactly one canonical VNV header script reference | 36/36 PASS |
| Exactly one auto-populating ticker script reference | 36/36 PASS |
| Exactly one lower-left class-tools script reference | 36/36 PASS |
| Exactly one lower-right ecosystem toolbar reference | 36/36 PASS |
| Existing Middle School formative ledger reference | 36/36 PASS |

The shared studio script passed JavaScript syntax compilation with `new Function(source)` before commit. The existing source pages and their assessment destinations were not rewritten.

## Limitations and holds

- The 36 existing week files still contain their original curriculum prose; this wiring upgrades presentation and workspaces, **not** mathematical problem depth, authored examples, or source-curriculum quality. Week 01 Lesson 01 remains the deeper approved teaching prototype.
- No live desktop/tablet/Apple Pencil, accessibility, math game cross-site, print, or offline execution test is claimed.
- The handwritten work and typed notes are offered for explicit user export; there is no automatic verified student-record synchronization.
- The existing formative ledger continues operating under its pre-existing storage and learner-scope contract; this upgrade does not make it the grading authority.
- Official assessment/80% mastery protection remains conceptually segregated; full end-to-end regression should be run before expanding beyond Grade 07.

## Next verification

Test representative Weeks 01, 18, and 36 on desktop and iPad; confirm the canonical chrome, single-open accordion behavior, drawing fidelity after rotation, export files, formative ledger insertion, and verified assessment navigation. Then perform a separate content-depth audit before declaring all 180 lesson blocks instructionally upgraded.

## Follow-up correction: approved design parity

The user reported that the 36-week presentation looked different from the approved standalone Lesson 01. This was accurate: the week-page enhancer used the legacy week title as its hero, omitted the centered mission/progress region, and displayed five day accordions without the six-section visual rhythm.

Correction commit: `735825e2d85e2e16a5ddd4e3babc028a0fb57a4f` in `assets/grade-07-mathematics-studio-v1.js`. Updated the shared weekly presentation to use the approved “Mathematics Studio” hero typography, week/topic descriptor, centered breadcrumbs beneath the hero, centered mission and exploration progress, compact five-day accordions plus a sixth reflection/evidence accordion, with the original eight-card cream resource shelf retained. All thirty-six week files use this shared implementation without further page-file edits.

Verified by reopening the shared JavaScript and Weeks 01/18/36, checking the shared script wiring and successful JavaScript syntax compilation. The standalone `lesson-01.html` SHA was unchanged.

**Visual/live verification HOLD:** No live browser/iPad render pass was performed. Weekly pages remain multi-day course views; their five-day curricula are not interchangeable with the six instructional tasks in the individually authored Lesson 01. Exact content parity requires subsequent day-by-day lesson authoring and should not be represented as completed.
