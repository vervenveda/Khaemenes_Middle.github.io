# Middle School Workflow Digest — November 20, 2026

**Repository:** `vervenveda/Khaemenes_Middle.github.io`
**Record type:** Daily workflow digest
**Scope:** Grade 6–8 curriculum review, Grade 7 mathematics pilot and 36-week rollout, learner-facing presentation corrections
**Status:** GitHub source changes committed; runtime desktop/iPad validation HOLD
**Companion codex:** [2026-11-20 Mathematics Studio decision & implementation codex](../../../codexes/2026/11/2026-11-20-middle-school-mathematics-studio-codex.md)
**Detailed implementation evidence:** [Grade 07 Mathematics Studio wiring log](../../../logs/2026/11/2026-11-20-grade-07-mathematics-studio-wiring.md)

## Executive digest

The project moved from a proposal to import the High School mathematics engine toward **upgrading the existing Middle School system**. The founder approved a focused, interactive Mathematics Studio with a cream-and-charcoal academic design, colorful hero, one-task-at-a-time accordions, touch/Apple Pencil handwriting, typing, formative practice, and a symmetric math resources shelf. Grade 7 Week 01 Lesson 01 became the visual and instructional reference. The shared weekly presentation was then wired to all 36 Grade 7 mathematics subject-week pages while retaining all 180 existing Monday–Friday blocks and their formative checkpoint integrations.

The founder identified two rollout regressions: the weekly presentation did not look like the approved Lesson 01, and translator controls plus a 15-minute Breakaway launcher intruded into the page and Class Tools area. Corrections were committed. **Visual appearance and touch functionality have not yet been verified live after those corrections.**

## Key decisions — authoritative for this workstream

1. **Upgrade, do not replace:** retain the Middle School question factory, focus map, learning ledger, learner context, verified assessment authority, and grade progression. Do not copy the High School mathematics engine into Middle School.
2. **Approved visual reference:** `grades/grade-07/subjects/mathematics/lesson-01.html` is the reference for subsequent authoring and design parity. Favor the proofed cream background, charcoal legible text and elegant compact controls.
3. **Canonical ecosystem components:** use exactly one auto-populating VNV ticker; official VNV/Khaemenes header with hamburger only; the shared lower-left Class Tools and lower-right six-control 3×2 ecosystem toolbar. Do not invent parallel replacements.
4. **Hero and layout:** Khaemenes Academy eyebrow 33px, Mathematics Studio title max 77px, descriptor 24px; colorful hero, centered breadcrumbs, cream/light lesson backgrounds, even resource grids, 7px corners, centered charcoal footer; touch targets should remain accessible.
5. **Learning interaction:** a focused accordion structure that keeps unrelated tasks collapsed; enable typed explanations plus pointer/stylus/finger handwriting; immediate practice feedback, worked examples, mathematical reasoning and student-initiated export. No claim of handwriting recognition or automatic grading.
6. **Eight-card resource shelf:** maintain symmetric tools/games layout, including calculator, Factor Structure Lab, Estimate Defender, Ratio Atelier, Fraction Forge, OHMIC CAD, game library and a relevant number-line resource. Match resource difficulty to lessons rather than using games as mastery evidence.
7. **Translator positioning:** use the existing VNV translator engine; locate its controls inside Class Tools, not as a visible band above the lesson.
8. **Breakaway overlap:** do not place a floating 15-minute Breakaway control beneath/behind the lower-left Tools button on Grade 7 mathematics pages. Preserve Breakaway elsewhere.
9. **Academic protection:** formal 80% mastery, weekly assessments, midterm/final rules, grades, certificates, learner identity and placement are unchanged. Written and drawing work is practice/portfolio candidate evidence, **not** authoritative academic record synchronization.
10. **Sequence:** complete and test Grade 7 presentation first, deepen mathematics content *day by day*, then consider Grades 6 and 8 with appropriate grade-specific depth. No automatic blanket replacement of 180 lesson contents.

## Activity register

| Workstream | Actual result | Evidence / remaining hold |
| --- | --- | --- |
| Grades 6–8 mathematics curriculum survey | Grade 6 Week 1 showed concrete calculations and answer support; Grade 7 and Grade 8 samples contained relatively generic five-day prose | Findings were sample-based, **not** a complete lesson-by-lesson content audit |
| Research-based learning design | Reviewed segmentation, worked examples, retrieval, feedback, student autonomy and accessible representation; selected task-focused accordions | Research-informed design, not a measured achievement result |
| Grade 7 standalone Lesson 01 | Published `grades/grade-07/subjects/mathematics/lesson-01.html` with six instructional tasks and interactive workspace | Source/syntax checks passed; no live iPad Pencil certification |
| Week 01 link | Monday Week 01 links to standalone Lesson 01 | Link committed |
| Shared Grade 7 week studio | Published `assets/grade-07-mathematics-studio-v1.js`; wired all 36 subject-week pages | Source review: all 36 have five existing day headings and one studio/header/auto-ticker/class-tools/ecosystem script reference plus existing formative ledger |
| Design parity correction | Shared studio now uses Mathematics Studio hero, mission/progress, centered breadcrumbs and a sixth reflection accordion | Source and JavaScript syntax checked; browser render HOLD |
| Translator control placement | `assets/grade-07-math-translator-tools-v1.js` moves the existing `#vnv-language-switch` into Class Tools and adds a Language panel entry | Source/syntax checked; behavior on real device HOLD |
| Timer overlap correction | `assets/khaemenes-middle-breakaway.js` skips its fixed bottom-left Breakaway launcher on Grade 7 math routes | Source/syntax checked; on-screen overlap retest HOLD |
| Workflow recording | Existing dated wiring log and workflow index updated | Linked through this digest and companion codex |

## Reusable source map

- Approved standalone lesson: `grades/grade-07/subjects/mathematics/lesson-01.html`
- Shared week presentation: `assets/grade-07-mathematics-studio-v1.js`
- Translator placement: `assets/grade-07-math-translator-tools-v1.js`
- Breakaway script: `assets/khaemenes-middle-breakaway.js`
- Week pages: `grades/grade-07/subjects/mathematics/week-01.html` … `week-36.html`
- Canonical Grade 7 curriculum: `grades/grade-07/data/course-data.js`
- Existing Middle School services: `assets/khaemenes-middle-focus-map.js`, `assets/khaemenes-middle-question-factory.js`, `assets/khaemenes-middle-learning-ledger.js`, `assets/khaemenes-middle-learning-context.js`, `assets/khaemenes-middle-assessment-engine.js`
- Public VNV scripts: `https://vervenveda.com/assets/vnv-ticker-autopopulate.js`, `vnv-header-autopopulate.js`, `vnv-class-tools-toolbar.js`, `vnv-ecosystem-toolbar.js`, `vnv-language.js`
- Mathematics directory: `https://vervenveda.com/ecosystem/learning-tools/mathematics.json` (reported inventory: 83 math games and 370 lesson placements at inspection time)

## Decisions vs. evidence: status distinctions

- **Approved:** cream-and-charcoal design, page hierarchy, accordion focus, symmetric eight-card resources, right/left toolbars, translator inside tools, no timer overlap.
- **Committed:** independent Lesson 01; shared presentation file; 36 weekly references; later presentation, translator and Breakaway corrections.
- **Source-verified:** required references and five original day blocks across the 36 week pages; JavaScript syntax checks on changed scripts.
- **Not established:** browser screenshots of the post-repair layout; translator open/close behavior after actual mount; Apple Pencil capture during iPad rotation; persistent or cloud-backed work; proof that every weekly lesson contains the same depth as standalone Lesson 01; end-to-end assessment regression.

## Next-session checklist (priority order)

1. Visually compare standalone Lesson 01 with Week 01, Week 18 and Week 36 on desktop: exact hero proportions, centered breadcrumbs, content width, cream palette, slim accessible buttons, eight-card shelf, only one ticker, one header.
2. Verify translator appears **inside** the lower-left Class Tools on the standalone and weekly pages, with no orphan translator strip; verify Language dropdown, translation actions and keyboard use.
3. Verify no floating Breakaway control appears behind Class Tools; confirm lower-right canonical six-control toolbar remains visible.
4. Test on iPad portrait/landscape with finger and Apple Pencil: accordion open/close, drawing, undo, PNG export and document scrolling; test typed work and JSON export.
5. Verify the existing formative ledger adds its four-question checkpoints without duplicate boxes or altering mastery. Verify official assessments still navigate correctly and remain the sole grading authority.
6. After UI regression passes, author genuinely distinct Grade 7 mathematics lessons one day at a time using the approved standalone instructional structure and subject-specific calculations, representations, worked examples, error analysis, and spaced retrieval.
7. Extend the codex with screenshot references and observed results; update the workflow digest and `workflow/INDEX.md` as work actually passes.

## Conversation codex protocol

Preserve important founder decisions as **dated, curated, non-verbatim conversation codexes** under `workflow/codexes/YYYY/MM/`. Codexes must include: decision, rationale and origin, approved reference, files affected, tests and holds, prohibited regressions, next action, and related digest/log links. They must distinguish user-approved instructions from assistant proposals and source-verified facts. Never store sensitive learner records, identifiers, tokens, private conversations, passwords or unredacted account exports.

**Attribution:** Khaemenes Academy · Verve N Veda · Jennifer Kay Pearl

## Approved mathematics HTML reference — exact source archive

- **Proofed layout (authoritative):** [`Grade 7 Mathematics Studio — Lesson 01`](../../../grades/grade-07/subjects/mathematics/lesson-01.html) (live path: `grades/grade-07/subjects/mathematics/lesson-01.html`).
- **Exact HTML snapshot preserved with this digest:** [`grade-07-approved-lesson-01.html`](../../../engines/mathematics/grade-07-approved-lesson-01.html).
- **Preservation rule:** the archived HTML is an unchanged copy of the proofed Lesson 01 at the time of this entry, not a replacement for the live page. Replicate its layout for Grades 6–8 while authoring grade-specific content. Keep formal assessment and learner records separate. The archived file's site-root and relative asset links may require the original live route to function correctly; this is a source reference, not a second deployed learning route.


## Workflow engine directory organization

The approved Mathematics Studio HTML reference now lives in [`workflow/engines/mathematics/`](../../../engines/mathematics/README.md), with distinct future subject-engine folders for [Science](../../../engines/science/README.md), [Social Studies](../../../engines/social-studies/README.md), and [Language Arts](../../../engines/language-arts/README.md). The original live lesson remains untouched. Reserved engines are not implemented yet.


## Mathematics Studio three-grade portal wiring

- Grade 06/07/08 subject portals: 36 Studio links each, 108 source-wired week destinations total.
- Grade 07 Studio link uses the existing enhanced week page; the exact proofed standalone `lesson-01.html` is preserved unchanged.
- Grade 06 and 08 Studio links open isolated study views (`studio.html?week=NN`) that fetch the existing weekly HTML on the same origin and apply a shared presentation engine. Original weekly routes remain accessible.
- **Hold:** Week-level interfaces do not yet reproduce every section of the exact proofed six-stage daily Lesson 01. Curriculum hardening, source exercise audits, live rendering, tablet verification and assessment end-to-end tests are still pending. Formal grading and learner records untouched.
