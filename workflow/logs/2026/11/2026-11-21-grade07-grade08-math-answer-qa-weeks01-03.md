# Grades 7–8 Mathematics — Academic Hardening, Weeks 01–03

Date: 2026-11-21
Branch: `grade07-grade08-math-answer-qa-weeks01-03-20261121`
Decision: Academic final A+++ certification remains **HOLD**.

## Baseline
- PR #52 merged with 11/11 automated checks: Weeks 16–36 curriculum enrichment across Grades 7/8, with 210 new daily mathematics laboratories and 840 parameter-based teacher-key calculation checks.
- Both Grades 7 and 8 now have all 36 mathematics weeks enriched with daily practice; official assessments and 80% mastery authority remain unchanged.

## Forensic content repairs
In Grade 7 Week 01:
1. A prompt asking for **cost per pack** was incorrectly paired with the solution **$6 per item**. Corrected to ask for the item cost, preserving $6 as the correct key.
2. A follow-up requested the cost of **five identical packs** but its **$30** key was correct only for five identical items. Corrected the requested quantity to five items.
3. The prompt asking for units of “9 divided by 1 hour” omitted the physical quantity. Corrected to explicitly state 9 km traveled in one hour so the rate's km/h units are justified.
These are curricular semantics corrections: changing an answer to $90 or an explanation alone would not resolve the mismatch between the sequential examples and the intended cost-per-item progression.

## Regression and scope
- Added `tools/validate-grade7-grade8-math-answer-qa-weeks01-03.mjs` to `.github/workflows/middle-math-full-course.yml`.
- Independently curated and inspected **120** problem-indexed mathematical answer expectations across **30** daily lessons (2 grades × 3 weeks × 5 days × 4 tasks).
- The regression checks exact normalized teacher answer matches, unique prompts per day, four tasks and four corresponding solutions, correct response labels, formative no-auto-save boundary and the single official 80% assessment authority.
- All original student progress, official assessment banks, grades and Account Cloud records left untouched.

## Remaining certification priorities
- Independent editorial verification of the other **480** authored Grade 7/8 Weeks 04–15 practice answers, including mathematical alternatives and context quality.
- Complete pedagogy/variety/misconception and accessibility reviews across the newly templated Weeks 16–36: a parameter-based 840-key test validates arithmetic consistency, not necessarily learning depth.
- Live desktop/tablet lesson journeys, 79%/80% mastery boundary, parent portal and encrypted archive/export durability using synthetic learners.
- CI must pass before merging this pull request.
