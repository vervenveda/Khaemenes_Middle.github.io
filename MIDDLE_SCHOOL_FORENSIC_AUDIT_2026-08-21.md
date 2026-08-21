# Khaemenes Middle School — Forensic Curriculum Audit

Date: 2026-08-21

## Executive Status

The repository has a strong structural foundation: three complete 36-week grade programs, nine subject halls per grade, weekly plans, printable packets, weekly assessments, midterms, finals, teacher tools, learner records, and completion certificates.

The highest-risk defects were not missing curriculum files. They were **record-authority and curriculum-alignment defects**:

1. learner-scoped course records existed, but the shared continuity adapter still wrote the browser-wide legacy key even when a canonical learner was active;
2. Grade 6–8 certificate runtimes read only the browser-wide legacy key instead of the active learner-scoped record;
3. subject-week focus labels were generated from repeating subject focus rotations and do not always align with the actual week title/theme;
4. weekly assessments are structurally complete but often use generic domain evidence descriptors rather than the exact instructional focus of the week;
5. the root README described many current courses/features as future offerings and contained stale attribution.

Items 1, 2, and 5 were repaired during this audit. Items 3 and 4 require the next curriculum-quality pass.

## Grade-Level Curriculum Map

### Grade 6 — Foundation & Discovery

Academic role: transition into middle-school independence and core Grade 6 mastery.

Primary strands:
- ELA textual evidence, reading/writing/research foundations
- ratios, rates, percent, fraction division, rational numbers, expressions/equations, geometry, statistics
- integrated physical/life/Earth science foundations
- geography and ancient civilizations
- world language/culture
- arts/media
- health/PE/SEL
- technology/design
- integrated research and portfolio work

Progression target: Grade 7 readiness.

### Grade 7 — Connection & Challenge

Academic role: greater independence, proportional/algebraic reasoning, stronger source analysis, and longer research/project work.

Primary strands:
- literary/informational analysis, argument, comparative writing, research
- proportional relationships, rational-number operations, equations/inequalities, scale, circles, probability/statistics
- life/Earth/physical science systems with stronger evidence reasoning
- medieval/early-modern world history, trade, Renaissance/Reformation, scientific revolution
- continued world language/culture, arts/media, health/SEL, technology, integrated research

Progression target: Grade 8 readiness.

### Grade 8 — High School Readiness

Academic role: culminate middle school and prepare for Grade 9 coursework.

Primary strands:
- strongest evidence, argument evaluation, synthesis, research, publication
- linear relationships, functions, slope/intercept, systems, exponents/scientific notation, transformations, similarity, Pythagorean theorem, bivariate data
- culminating middle-school physical/life/Earth-space science
- U.S. founding/constitutional principles, reform/conflict/Reconstruction foundations, economics/civics
- continued world language/culture, arts/media, health/SEL, technology/AI readiness, integrated capstone

Progression target: High School readiness without automatic promotion or historical placement mutation.

## Structural Inventory

Verified repository-level architecture:
- root Middle School portal
- Grade 06 portal
- Grade 07 portal
- Grade 08 portal
- shared grade continuity adapter
- shared mentor adapter
- shared Beta doorway
- automated Beta index/link coverage workflows

Verified grade-level architecture includes:
- 36 weekly plans
- 9 subject halls
- 36 printable packets
- 36 weekly assessments
- midterm
- final
- teacher tools
- completion certificate
- learner record controls

## Critical Repair 1 — Learner-Scoped Record Authority

Previous behavior:
- exact-grade learner-scoped keys existed;
- but every `writeState()` also wrote the old browser-wide legacy key;
- a placement-mismatched learner could still read/write the browser-wide legacy state;
- `clearState()` could remove the legacy state even when the active learner belonged to another grade.

Risk:
- cross-learner or cross-grade record contamination on a shared browser;
- legacy state could become an unintended authority after canonical learner identity was introduced.

Repair:
- shared continuity adapter upgraded to v1.2.0;
- exact placement writes only to `khaemenes.course:<learnerId>:middle-grade-0X`;
- placement mismatch is fail-closed for reads/writes/clears;
- no-active-learner mode may still use legacy state for backward compatibility;
- one-time legacy migration into a matching learner-scoped record is preserved.

## Critical Repair 2 — Grade 6–8 Certificates

Previous behavior:
- certificate runtimes read only the global legacy keys;
- they did not load Family Registry or grade continuity;
- a certificate could therefore represent the wrong learner on a shared browser.

Repair:
- Grade 6, 7, and 8 certificate pages now load the central Academy Family Registry and exact-grade continuity context;
- certificate runtimes prefer learner-scoped records;
- placement mismatch locks the certificate rather than issuing another learner's record;
- canonical nickname is used when placement matches;
- Student ID is displayed when available;
- legacy no-active-learner mode remains visible as a local compatibility record and explicitly prompts binding to Academy identity.

## Major Curriculum Quality Finding — Subject Week Misalignment

The subject halls are structurally complete, but their weekly focus labels often follow a repeating subject focus cycle rather than the week-specific curriculum sequence.

Examples:
- Grade 6 Mathematics Week 02 is titled “Evidence, Annotation, and Ratios,” but the Mathematics subject index labels the focus “percent.”
- Grade 7 Mathematics Week 03 is titled “Unit Rates, Slope Foundations, and Informational Text,” but the subject focus is “rational-number operations.”
- Grade 8 Mathematics Week 02 is titled “Strongest Evidence and Linear Relationships,” but the Mathematics focus is “functions,” with similar one-step/rotation drift across later weeks.

This is not a broken-link defect. It is a **curriculum coherence defect**. The grade-wide week theme and the subject-specific instructional target need a deliberate crosswalk.

Required repair model:

```text
Grade curriculum week
    ↓
week-specific subject objective
    ↓
subject lesson pages
    ↓
printable evidence task
    ↓
weekly assessment evidence
```

Each week should state what that subject actually teaches that week, not simply rotate through a small list of subject strands.

## Assessment Finding

Weekly assessments are complete and use a demanding evidence-based rubric, but many prompts are generic across weeks. For example, a Grade 6 weekly assessment asks broadly whether the learner can solve Grade 6 computation using ratios/rates/percent/rational numbers/equations/geometry/statistics rather than assessing the exact Week 01 mathematics target.

Recommended repair:
- preserve the 11-domain / 22-point structure where desired;
- make each domain prompt week-specific;
- keep 80% mastery as the course gate;
- do not let mentor/model confidence alter grades;
- teacher/Academy review remains authoritative.

## Documentation Finding

The prior root README was stale:
- multiple already-built programs were described as future offerings;
- repository structure did not match current implementation;
- attribution contained an outdated additional name.

The README was replaced with a current Grades 6–8 curriculum map and canonical Academy continuity rules.

## Next Repair Sequence

1. Build a canonical subject-by-week curriculum crosswalk for Grade 6.
2. Correct Grade 6 subject landing focus labels and weekly subject pages from that crosswalk.
3. Align Grade 6 weekly assessment prompts to the corrected weekly subject targets.
4. Validate printable packets against those targets.
5. Repeat for Grade 7.
6. Repeat for Grade 8.
7. Audit midterm/final item coverage against the resulting scope and sequence.
8. Audit Teacher Tools and reports against exact learner identity and grade-level curriculum.
9. Run a full link/path and Beta-button coverage certification.
10. Perform browser/runtime/mobile/print testing separately; source audit alone is not runtime certification.

## Current Rating

- Repository structure: GREEN
- Grade-level separation: GREEN
- Grade-root learner placement: GREEN
- Learner-scoped course records: GREEN after repair
- Certificate learner binding: GREEN after repair
- Subject-to-week curricular coherence: YELLOW / repair required
- Weekly assessment specificity: YELLOW / repair required
- Grade 8 → High School progression semantics: GREEN at source level
- Runtime/browser validation: UNVERIFIED

The next substantive curriculum task is Grade 6 subject-by-week crosswalk repair before declaring the grade fully curriculum-certified.
