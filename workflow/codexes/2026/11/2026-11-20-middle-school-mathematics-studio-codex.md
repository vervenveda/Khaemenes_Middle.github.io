# Conversation Codex — Middle School Mathematics Studio

**Codex ID:** MS-MATH-STUDIO-2026-11-20-01
**Date:** 2026-11-20 (America/New_York)
**Kind:** Founder decision record, design contract and implementation blueprint
**Authority:** This codex records the user's approved design and constraints; it is not a substitute for source, accessibility or runtime tests.
**Conversation status:** Curated account of the discussion, **not a verbatim transcript**.
**Daily digest:** [November 20 Middle School Mathematics Workflow Digest](../../../digests/2026/11/2026-11-20-middle-school-mathematics-workflow-digest.md)
**Implementation log:** [Grade 7 36-Week Wiring](../../../logs/2026/11/2026-11-20-grade-07-mathematics-studio-wiring.md)

## 1. The decision that changed the work

**Initial proposal:** Locate the High School mathematics engine, use its nine-step teaching sequence, and pilot Grade 7 Week 1.

**Founder-directed change:** Research how Middle School students learn and how instructional pages should be organized. **Improve the existing Middle School engine** instead of importing/replacing it with the High School engine.

**Decision:** The Middle School lesson experience remains part of the current Grade 6–8 curriculum/question factory/ledger/context/assessment system. Instructional pages can be strengthened with concrete teaching, practice, interactive reasoning and an accessible UI. A new system with overlapping academic authority is prohibited.

**Reasoning:** The already deployed Middle School services and learner progression should be preserved. Separate presentation from scoring, placement, records and assessment authorization.

## 2. Research-to-design interpretation (proposal, not proof of learning outcomes)

The conversation reviewed research and guidance relevant to Middle School:

- Segmentation and signaling: expose one manageable instructional task at a time and reduce visual clutter.
- Worked example → guided work → independent practice: allow students to see, try, apply and explain.
- Retrieval and spaced revisiting: build opportunities to recall earlier skills, correct misconceptions and revisit concepts later.
- Student autonomy with structure: meaningful independent actions and clear next steps, not unbounded exploration.
- Accessible options: typing, drawing, diagrams, touch and narration when supported, with common standards for mathematical understanding.

These are **design principles**. No research was presented establishing that a particular number of accordions, grid cards or minutes is universally optimal. Student learning gains remain unmeasured.

## 3. Approved page identity and visual contract

**Proofed reference:** `grades/grade-07/subjects/mathematics/lesson-01.html`, after the founder reviewed its screenshots and requested refinements.

- Use **one** auto-populating ticker, not separate competing ticker implementations.
- Reuse official VNV/Khaemenes header, with **hamburger-only** header navigation.
- Colorful centered hero: eyebrow `Khaemenes Academy` at **33px**, main `Mathematics Studio` up to **77px**, grade/week/lesson descriptor at **24px**. Avoid old generic grade-title headers.
- Center breadcrumbs beneath the header/hero.
- Use charcoal `#24292d` and substantial light cream `#fff9ed` / `#fffdf7`, with burgundy, teal, navy and gold academic accents. Keep readable contrast.
- **7px corners**, symmetrical buttons/cards, refined compact buttons, accessible touch target sizing (about 44px where possible); avoid bulky padding and invisible text.
- Maximize daily task focus with elegant **single-open accordions**. The standalone Lesson 01 six task names are Remember, Discover, Learn, Your Turn, Apply, Reflect. **A weekly overview's five day sections plus a sixth reflection item are not equivalent instructional content.**
- Symmetrical/even resource grids; approved shelf contains **eight cards (4×2 desktop, 2×4 narrow)**.
- Centered charcoal footer with cream text.
- Official lower-left universal Class Tools and official lower-right **3×2 six-control** ecosystem toolbar must remain separate and non-overlapping.
- Translator belongs **inside** the tools interface, not a floating band above the lesson.
- Suppress the floating 15-minute Breakaway button behind the lower-left Tools control **on the Grade 7 mathematics lesson and week routes**; other Middle School contexts retain the feature.

## 4. Pedagogical blueprint: one daily lesson

### Required instructional tasks

1. **Remember:** brief retrieval questions and prior-skill links.
2. **Discover:** a question, visual model or investigation that reveals the new relationship.
3. **Learn:** accurate explanation, worked model, guided attempt, immediate formative feedback and misconception check.
4. **Your Turn:** independent, non-identical problem with typed reasoning, handwriting/sketch or both, and manipulatives where justified.
5. **Apply:** purposeful problem-solving or a game linked to the same lesson objective, requiring reasoning instead of arbitrary points.
6. **Reflect:** summary, self-explanation, what needs review, optional portfolio candidate evidence and an appropriate next step.

The single daily task sequence is the **content blueprint**; not all 180 Grade 7 daily lessons have been deepened into this format yet.

### Authoring acceptance requirements

- Distinct objective and prerequisite for each lesson; no repeated generic prompts as substitutes for actual mathematics.
- Correct worked calculations with units and clear reasoning.
- Scaffolded problem followed by independent transfer problem.
- Meaningful representations (table, graph, number line, diagram, equation) appropriate to the grade/topic.
- Explain *why*, identify a common error, correct it and revisit a prior skill.
- Game/tool suggestions tied to the objective. Games never replace formal evidence.
- Typed mathematics/notes and pointer-based handwriting with undo, clear and PNG export.
- Explicit student export for practice/evidence candidates, not silently attributed cross-device academic history.
- Clear separation of practice, checkpoint evidence, adult-reviewed performance and verified assessment.

## 5. Mathematics grade progression

- **Grade 6:** numeric foundations, ratios and rates, fractions, expressions, equations, area/volume and statistical representations. More explicit scaffolding and concrete worked examples.
- **Grade 7:** proportional reasoning and unit rates, rational arithmetic, equations, probability, scale drawings, geometry, and pre-algebra reasoning. Greater emphasis on multi-step explanation and independent strategy.
- **Grade 8:** linear relationships/functions, systems, exponents, transformations, Pythagorean theorem and Algebra I readiness. More extended proof and multi-representation work.

**Implementation sequencing:** prove Grade 7 instructional quality and presentation first, then consider adapting to 6 and 8 without forcing their curricula into the same difficulty or generic prose.

## 6. Component ownership and boundaries

| Element | Existing owner or file | Studio may do | Studio must not do |
| --- | --- | --- | --- |
| Curriculum | `grades/grade-07/data/course-data.js` and subject-week files | Display and deepen authored lessons | Mutate declared weeks or silently promote students |
| Focus | `assets/khaemenes-middle-focus-map.js` | Use grade/week objective | Invent a new canonical focus authority |
| Questions | `assets/khaemenes-middle-question-factory.js` | Present practice under existing rules | Change protected assessment items |
| Formative checkpoints | `assets/khaemenes-middle-learning-ledger.js` | Preserve and surface checks | Grant mastery or authoritatively sync grades |
| Learner context | `assets/khaemenes-middle-learning-context.js` | Respect learner scope | Mix anonymous or other-student records |
| Formal tests | `assets/khaemenes-middle-assessment-engine.js` | Link to authorized tests | Override the 80% threshold, grades, retakes, history or certificates |
| Visual/tickers | `vnv-ticker-autopopulate.js`, `vnv-header-autopopulate.js` | Mount one of each | Introduce global chrome duplicates |
| Toolbars | `vnv-class-tools-toolbar.js`, `vnv-ecosystem-toolbar.js` | Use canonical tool entry points | Create overlapping competing floating toolbars |
| Translator | `vnv-language.js` | Reposition existing controls inside Class Tools | Duplicate translation engine or send learner answers to online translators |
| Breakaway | `assets/khaemenes-middle-breakaway.js` | Keep optional resource elsewhere | Obscure canonical Class Tools button on mathematics pages |

Formal standards: weekly knowledge assessments open-book, midterm/final closed-book, 80% mastery, verified attempt records and adult-reviewed performance evidence, as described in the repository README. Practice pages do not own those decisions.

## 7. Approved implementation artifacts and chronology

### Initial delivery
- `grades/grade-07/subjects/mathematics/lesson-01.html` — interactive standalone Grade 7 Week 01 Lesson 01 with six task accordions, worked examples, typed reasoning, drawing, four-question ratio practice, eight resource cards.
- `grades/grade-07/subjects/mathematics/week-01.html` — existing Monday block now links to standalone Lesson 01.
- Subsequent centered breadcrumb and canonical right-side toolbar update.

### 36-week wiring
- `assets/grade-07-mathematics-studio-v1.js` — same enhancement applied to all `week-01.html` through `week-36.html`.
- Each of 36 source week pages retains five original day blocks and formative ledger reference. Shared script syntax was checked.
- Original five-day content **not rewritten into** fully developed six-task daily lessons.

### Founder feedback and corrections
- Founder: weekly rollout visually different from proofed Lesson 01. Shared presentation updated to restore Mathematics Studio hero, centered mission/progress, centered breadcrumbs and six-section *weekly view* rhythm.
- Founder: translator incorrectly visible at top, and timer behind Tools button.
- Source traced: public `vnv-language.js` and fixed `#khaemenesBreakawayButton` created by `assets/khaemenes-middle-breakaway.js`.
- `assets/grade-07-math-translator-tools-v1.js` created to relocate the existing translator controls into Class Tools for scoped Grade 7 mathematics routes.
- `assets/khaemenes-middle-breakaway.js` updated to avoid floating Breakaway launcher on those routes.

## 8. Source-verification and test gates

### Source-confirmed
- All 36 mathematics subject-week HTML files retain five original Monday–Friday headings.
- All 36 have one shared mathematics studio script, one canonical header, one auto ticker, one lower-left class toolbar, one lower-right ecosystem toolbar and the existing learning ledger reference.
- Shared script and translator/Breakaway modifications passed JavaScript syntax checks.
- Existing standalone Lesson 01 was not replaced by the shared weekly enhancer.

### HOLD: runtime confirmation required
- No verified live post-correction desktop screenshot comparison across all pages.
- No verified real iPad/Apple Pencil handwriting and rotation test.
- No confirmed translation control mounting, hidden strip, keyboard interaction or translation completion inside the tools panel.
- No verified Breakaway overlap screenshot after suppression.
- No confirmed end-to-end student account/Account Cloud sync or protected mastery journey.

### Definition of done for one daily lesson
The lesson must be genuinely authored (not merely wired), visually match the approved Lesson 01 reference, open from the expected grade/week route, keep the learner's work visible while active, pass typed/handwritten practice on desktop and iPad, preserve canonical toolbars and translator behavior, avoid duplicate controls, support explicit export, and leave existing assessment authority and learner records intact.

## 9. Prohibited regressions and operational safeguards

1. Do not overwrite the founder-approved standalone Lesson 01 with the legacy weekly wrapper.
2. Do not treat a source-link wiring check as evidence that 180 distinct daily lessons are fully authored or that student learning improved.
3. Do not put two tickers or multiple headers on a lesson.
4. Do not add top translator strips or floating timer controls that collide with Class Tools.
5. Do not alter `vervenveda` gateway merely to fix a Middle School lesson page.
6. Do not replace the existing school engine with High School adapters.
7. Do not change or migrate academic records, grading authority, student IDs, family data or protected tests during UI upgrades.
8. Do not represent browser-local formative activity as confirmed secure cross-device cloud sync.
9. Do not record private learner data or credentials in public GitHub workflow files.
10. After every important decision or completed test, update the workflow digest, this codex if necessary, the dated log, and workflow index.

## 10. Next session instruction

**Start at the proofed Grade 7 Lesson 01.** Compare to the Week 01 shared view. Confirm translator in Class Tools and no Breakaway overlap. Verify actual devices. Then deepen the daily mathematics curriculum one lesson at a time, starting with Week 01's remaining daily lessons. Track each as `proposed`, `committed`, `source-verified`, `runtime-verified`, or `hold`. Preserve independent records of approvals and tested evidence.

**Owner / attribution:** Khaemenes Academy · Verve N Veda · Jennifer Kay Pearl
