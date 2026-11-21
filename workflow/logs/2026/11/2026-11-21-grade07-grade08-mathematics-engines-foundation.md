# Grade 7 and Grade 8 Mathematics — Engine foundation and deep curriculum, Weeks 01–03

Date: 2026-11-21
Repository: `vervenveda/Khaemenes_Middle.github.io`
Branch: `grade07-grade08-math-engine-foundation-weeks01-03-20261121`
Status: Source implementation committed; CI and live browser evidence required for release certification.

## Existing topology retained
- Shared grade 06/07/08 standalone interactive Lesson 01 engine: `assets/khaemenes-middle-math-lesson-engine-v1.js`
- Grade 07 weekly presentation studio: `assets/grade-07-mathematics-studio-v1.js`
- Grade 08 weekly studio presentation owner: `assets/khaemenes-middle-math-portal-studio-v1.js`, loaded from the existing learning context
- Existing formative four-question factory: `assets/khaemenes-middle-math-week-practice-v1.js`; official Academy weekly assessments alone authorize grade mastery and progression
- Both grade repositories already include 36 week files, 180 original daily articles each, and their individual course entry indexes

## First three-week foundation built for both grades
- 30 new day-specific **deep-learning laboratories**, each embedded in one existing daily lesson article (5 days × 3 weeks × 2 grades).
- 120 original, grade-appropriate practice questions and 120 teacher-key entries, four per daily laboratory.
- Each integrates vocabulary-in-context instruction, a fully worked mathematical model, explicit misconception prevention, four independently solved challenges, labeled response field, independent self-check, and revealable teacher key.
- **Grade 07**: proportionality/rate tables and zero-intercept tests (Week 01); percentages, percentage changes and evidence comparisons (Week 02); signed rational arithmetic including fractional operations (Week 03).
- **Grade 08**: linear pattern tables, coefficients, intercepts, equations and checks (Week 01); function notation, input/output and linear-versus-nonlinear comparisons (Week 02); slope, intercepts, line equations, signs and model-based predictions (Week 03).
- These deepen, rather than replace, existing generic objective/workshop text and the approved studio owner. No new runtime or competing shell was created.
- Both grades' original shared loaders, top navigation, translator, class tools, four-option formative question factory, official assessment routes and existing export features remain untouched.

## Verification
- Added `tools/validate-grade7-grade8-math-foundation-weeks01-03.mjs`, linked to `.github/workflows/middle-math-full-course.yml`.
- Tests 30 original weekday article placements, 120 distinct practice prompts, 120 answer-key entries, label/textarea pairing, worked-model-before-practice, self-check-before-key, no grade-authoritative writes, existing Grade 7 and 8 presentation script ownership and shared engine script syntax.
- Additional independent mathematical accuracy and formative student-browser testing is still needed; structurally valid keys and page counts do not establish mastery.
- Grade 7/8 Week 04–36 entries have generic pedagogical descriptions and need systematic three-week-block deepening; some mathematics course catalogue focus labels are misaligned with actual weekly titles.

## Grade 6 handoff
- See `workflow/logs/2026/11/2026-11-21-grade06-certification-handoff-grade07-08-math-engine.md`. Grade 6 is not falsely declared finally certified: the 441 remaining supplemental problems, 52 flagged open-response items in audited weeks, real browser/Account Cloud and measured retention evidence remain outstanding.

## Next acceptance
- Confirm latest CI for new PR; fix any real mathematical or structure mistakes.
- Audit live display on tablet in both orientations, keyboard and screen-reader behavior, and navigation between catalog, daily accordion, mathematics studio, formative practice and official assessment without grading side effects.
- Move to Grades 07 and 08 Weeks 04–06 and independently verify teacher solution keys, guidance quality, real problem-solving and knowledge retention. Final Grade 7/8 certification HOLD until coursewide evidence.
