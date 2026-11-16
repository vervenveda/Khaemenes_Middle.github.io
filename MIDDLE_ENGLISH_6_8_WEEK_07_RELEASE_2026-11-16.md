# Khaemenes Academy — Middle School English 6–8 · Week 07

**Release date:** 2026-11-16  
**Repository:** `vervenveda/Khaemenes_Middle.github.io`  
**Branch:** `main`  
**Status:** Three English Week 07 lesson pages committed and fetched back for source-level verification. Native regression run in GitHub Actions, deployment timing, and real-device/browser acceptance remain unconfirmed.

## Synchronized three-grade instructional upgrade

| Grade | Existing course Week 07 theme | New Academy-original source material and literacy progression | Student writing artifact |
|---|---|---|---|
| Grade 06 | **Coordinate Planes and Geography** | *The Map With Two Norths*, *Where Is “Above”?*, *The Garden Delivery Note*, *Directions Without Guessing*, *The Shortcut Nobody Checked*. Study precise ordered-pair descriptions, spatial prepositions, reference points, map/text agreement and responsible source limits | 170–230-word fictional coordinate route guide with labeled text map, tested instructions, map evidence and revisions |
| Grade 07 | **Equations and Inequalities** | *The Puzzle Club's Missing Step*, *At Least Is Not More Than*, *Solving Without Skipping*, *Precision Is Part of the Evidence*, *The Poster That Changed the Rules*. Read and compare explanation quality; teach complete sentences, grammar conventions, condition boundaries, procedural transitions and responsible paraphrase | 220–300-word sourced informational guide with grammar checks, equation/inequality evidence, fair counterpoint and revision |
| Grade 08 | **Transformations and Congruence** | *The Triangle That Moved*, *Same Shape, Different Claim*, *Every Move Preserves Everything*, *What Counts as a Proof?*, *The Reviewer's Challenges*. Contrast translation, reflection, and dilation; analyze why rigid motion preserves congruence, distinguish similarity, use counterexamples and precise proof grammar | 300–400-word high-school-readiness explanatory argument and 90-second oral defense with source matrix, counterexample and revisions |

All named school groups, maps, cases and characters are Academy-original, fictional instructional resources. Classroom coordinates and examples are not public travel routes or verified external research.

## Shared five-day instructional contract

All three English Week 07 pages retain the original `<article class="lesson">` structure and present:

- Five daily reading-and-writing workshops: Monday through Friday, Monday expanded
- Four specific student exercises per day (20 per grade)
- An explicit learning target and worked example for each day
- Five distinct student portfolio products and five educator/family coaching sections per grade
- Original readings or challenges that require evidence, source attribution, and revision
- Shared centered VNV/KA styling in `assets/khaemenes-middle-ela-week01.css`
- No new side navigation, external dependencies, duplicate score writer or invented student-data store

Grade 07–08 weekly plans reference grammar and conventions, so grammatical precision, sentence structure, proof vocabulary and conditional wording are woven into the evidence lessons rather than displaced by mathematical exercises.

## Example truthfulness and crosswalk checks

**Grade 06:** On a fictional north-up grid, the library (2,3) is three units east and one north of the school (-1,2). A movement from (-2,1) to (1,1) is exactly three grid units east. Neither description verifies a real-world path, travel distance or safe route.

**Grade 07:** `x + 5 = 13` has `x = 8` when five is subtracted from both sides. `2x + 3 = 11` has `x = 4`. “At least four” means `d ≥ 4`, whereas “more than four” means `d > 4`; the words cannot be silently interchanged.

**Grade 08:** The original triangle A(0,0), B(2,0), C(0,1) translates under vector (2,-1) to A′(2,-1), B′(4,-1), C′(2,0). Reflection over the y-axis produces B″(-2,0). Rigid motions preserve corresponding lengths; dilation with scale factor two multiplies each nonzero length by two and creates a similar but non-congruent nondegenerate triangle.

## Preserved authority and records

This release did **not** change the existing:

- Full 36-week Grade 06/07/08 course JSON datasets
- Previously authored Weeks 01–06 English lessons
- Week 07 printables, weekly plans, or official assessment pages
- Question Factory, Focus Map, Learning Ledger and Learning Context scripts
- Official 80% assessment/mastery/retake rules, score writers or unlocking
- Existing learner/family records, prior assessment attempts, parent reviewer approval or placement controls
- Shared site header, footer, translation and official ecosystem toolbar references

Teacher-reviewed writing, peer feedback and oral defenses remain **developmental evidence only**. These HTML lesson pages do not automatically save essays, transfer formative rubric scores to gradebooks, or confer Academy mastery. Student work should be preserved through the existing approved journal, printable or portfolio pathway.

## Regression and evidence of verification

New native Node regression:

`node tools/validate-middle-english-week07.mjs`

Updated GitHub Actions workflow:

`.github/workflows/middle-curriculum-integrity.yml`

The workflow now registers the Week 07 regression alongside Weeks 01–06 and existing repository-level curriculum integrity checks.

Fetched all three committed Week 07 HTML files, weekly plans, course JSON, printable packets, formal assessment pages, regression file and workflow. **Source verification passed** for:

- Original Grade 06–08 title and weekly learning progression
- Five lesson elements, five expandable panels, 20 student exercises, five educator notes and five portfolio evidence descriptions in each grade
- Original Academy instructional texts and grade-appropriate writing target lengths
- Correct fictional location, equation, inequality, translation, reflection and dilation examples
- Existing course structure, navigation links, assessment pages and shared learning scripts
- Explicit non-grading boundary and the original official 80% passing threshold
- Source label markup in the Grade 8 instructional text
- Regression file presence and CI registration for Weeks 01–07

**Verification limitations:** The above are source-level checks against GitHub content, not a claim that the registered Node test has passed in a GitHub Actions runner. A full browser acceptance pass on desktop, tablet portrait/landscape, and phone remains pending.

## Next synchronized milestone

Continue **English Week 08 across Grades 06, 07 and 08 together**, preserving their respective topic/essential question and the five-day instructional method. A future independent upgrade can establish a single grade-aware Reading Headquarters and a learner-scoped Reading-to-Writing Evidence Studio without introducing a competing academic gradebook.

**Attribution:** Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda.
