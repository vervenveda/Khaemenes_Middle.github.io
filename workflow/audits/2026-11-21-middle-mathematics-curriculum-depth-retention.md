# Khaemenes Middle School Mathematics — Curriculum Depth & Knowledge Retention Audit

Date: 2026-11-21
Repository: vervenveda/Khaemenes_Middle.github.io
Audit baseline: dc827c2b44eb87463f7c2740b2216dca5bfa1149
Mode: read-only source inspection; no learner accounts accessed; no assessment scores altered.

## Scope and evidence

Inventory: 36 mathematics week pages per grade, 108 weekly pages, 540 scheduled daily sections, three standalone Lesson 01 demonstrations, one canonical interaction asset, two weekly studio presentation assets, one question factory, a learning ledger, a formal assessment engine, cumulative print evidence, vocabulary studio, and mathematics game shelf. A sample of Grade 6, 7, and 8 weeks 02, 18, 36 and Grade 8 Week 01 was read in detail. The existing full-course structural validator passed for 108 weeks, 540 daily headings, and 432 generated practice-item candidates. This is a source/structure test, not a browser usability trial or proof of retention.

## Findings

1. **Grade 6 stronger numerical pedagogy in sample.** Grade 6 Week 02 includes worked ratio examples and contextual interpretation. Week 18 includes graph/rate/statistics tasks; Week 36 has summary-statistics and readiness practice. Some later Grade 6 daily sections are very short (Week 36 sample daily blocks about 47–64 words); independent practice quantity and misconception review remain uneven.
2. **Grades 7–8 repeated five-day templates.** Sample weeks 02, 18, 36 use repeated 'Introduce the subject focus, connect the essential question' / 'Mathematics A++ workshop' text. The week's math focus often changes but daily activity wording remains largely generic. A repository tool (tools/audit-middle-lesson-depth.mjs) itself flags generic repeat templates and does not fail CI. Not all five daily sections provide independent solved examples and graded comprehension feedback.
3. **Mathematics depth banks exist but live weekly usage is not established.** assets/khaemenes-grade67-math-depth.js and assets/khaemenes-grade8-math-depth.js contain worked-model / misconception content, but inspected Grade 6–8 mathematics weekly HTML pages do not import them directly; examined shared weekly loader also does not import them. Confirm every bank's execution and topic matching before crediting that content as delivered instruction.
4. **Weekly Mathematics Studio supports practice, not mastery.** Grade 6–8 weekly accordion/studio routes and four-item formative practice UI preserve original instruction and exports. Progress tracks sections opened, not correct independent solutions or comprehension. A wrong practice answer yields generic hints; there is no targeted remediation, delayed retest or formative misconception log in the new practice module.
5. **Vocabulary exists but is primarily cross-curricular / language arts.** Each grade's Weeks 05–36 vocabulary JSON contains 32 weeks × 6 = 192 term entries, with practiceOnly=true, subject='language-arts', status='editorial-draft'. The vocabulary studio points to language-arts weekly lessons. It is not a dedicated mathematics vocabulary map, and mathematical notation-to-language comprehension and delayed recall are not independently assessed.
6. **Formal mastery coverage is asymmetric.** The formal assessment engine specifies 18 Grade 6, 20 Grade 7, and 22 Grade 8 randomized weekly items; 36/40/44 midterm and 45/50/55 final items. Grade 6 weekly exams enforce at least 80% on a separate mathematics strand as well as overall 80%. Grade 7/8 makeBalanced across nine subjects and use overall passing score without a separate mathematics minimum; therefore passing a whole-grade exam does not establish 80% mathematics mastery. Grade 7/8 paper 22-point weekly rubrics and separate long-form cumulative print evidence are different from the generated formal engine tests. Clarify score and transcript roles.
7. **Official records need stronger authority language.** The engine labels browser-local attempts 'verified' and writes learner-scoped localStorage course state. It includes guards for grade, learner, sequence and retakes, but local browser storage is mutable, not administrator-signed or a server/cloud-confirmed academic record. Do not present this alone as independently authenticated transcript evidence.
8. **Game shelf is broad but unmeasured.** The existing studio links calculator, factors, estimation, ratios, fractions, CAD, arcade, inequality-line games. The study shelf does not map games to weekly standards, require evidence of reasoning, record game-specific skills, or conduct delayed transfer checks. External game URL availability and game behavior were not confirmed in this inspection.
9. **Retention is not empirically measured.** Current source includes cumulative exams, weekly practice and optional reflection. No demonstrated schedule linking concept mastery with 1-/7-/21-day delayed retrieval, fresh transfer items, misconception recurrence tracking, or longitudinal mastery-decay indicators. Actual student knowledge retention cannot be inferred from question quantity, CI passing, or page count.

## Five prioritized corrective bubbles

1. **P0 · Grade 7/8 mathematics authority:** Separate mathematical mastery from integrated whole-grade scores; require >=80% mathematics strand with grade/week aligned math tasks, written reasoning and remediation. Preserve historical attempts and don't rewrite past results.
2. **P1 · Daily curriculum density:** Raise Grade 7/8 five-day lessons beyond repeated templates; every day should have distinct concept model, explicit worked example, scaffolded attempt, independent transfer, error diagnosis, and reflection. Review Grade 6 thin weeks.
3. **P1 · Vocabulary comprehension:** Create a mathematics-only concept dictionary with definitions, notation, examples/nonexamples, multilingual supports, matching/sentence/solve checks, and spaced retrieval per week.
4. **P1 · Retention and remediation:** Add prior-week retrieval before new instruction; 1/7/21-day mixed review, error-coded feedback, one unassisted transfer question per concept, and teacher/parent visibility of durable evidence.
5. **P2 · Tool/game accountability:** Audit external URLs and tablet interactions; annotate each tool/game by skill and age band, collect optional exportable explanations, and add a later no-hint transfer check. Game points must never replace formal exam mastery.

## Acceptance criteria before closing

- 108/108 mathematics weeks have unique five-day outcomes, weekly mathematical vocabulary and at least two meaningful worked examples/independent tasks; no generic-only daily block.
- Grade 7/8 academic records show distinct mathematics 80% mastery evidence and preserve pre-upgrade provenance.
- Correct/incorrect practice paths give item-specific explanations, retry without answer contamination, and record learner-scoped *formative* misconception evidence with export.
- Delayed retrieval on 1/7/21-day schedule uses new problem parameters and provides a retention trend distinct from same-day mastery.
- Game destinations tested and each game mapped to skills; grade 6–8 browser/tablet user journey and existing assessment progression regressions pass.
- Browser-local data never described as cloud-verified or independently authenticated without actual account-cloud attestation.

## Audit limitations

Review covered representative weeks and relevant engine sources, not manual mathematical proof-reading of every lesson or a live student session. Some depth modules may be activated by other scripts not covered by inspected paths. External URLs could not be definitively confirmed; no positive runtime availability claim is made. The previously passing CI suites establish static structure, not comprehension, fairness, or achieved learning retention.
