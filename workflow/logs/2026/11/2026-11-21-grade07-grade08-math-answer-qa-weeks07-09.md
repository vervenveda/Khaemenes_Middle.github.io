# Grade 7/8 Mathematics — Academic Hardening Weeks 07–09

Date: 2026-11-21
Branch: `grade07-08-math-academic-qa-weeks07-09-20261121`
Certification: HOLD for final A+++ academic/operational release.

## Baseline
- PR #54 merged with 10/10 CI checks; 120 answer keys independently checked in Weeks 04–06, and percentage/system reasoning prompts clarified.
- Deep source-level curriculum for all 36 weekly pages per grade remains intact.

## Audited instruction and mathematical results
- Grade 7 Week 07: solving equations, inclusive and strict inequalities, negative-multiplier reversals and whole-number constraints.
- Grade 7 Week 08: scaled lengths, areas, perimeter, proportions and design validity.
- Grade 7 Week 09: circumference, π-based area, semicircles, perimeter and design computations.
- Grade 8 Week 07: translations, reflections, rotations, congruence and transformation composition.
- Grade 8 Week 08: dilation about origin, similarity, ratios and length/area/volume scaling.
- Grade 8 Week 09: Pythagorean triples, missing legs, right-triangle claims and coordinate distances.
- Reviewed the 120 four-question and teacher-key pairs in 30 daily lessons and found no incorrectly keyed numerical/symbolic solutions in this block. Added a separately maintained 120-item oracle in `tools/validate-grade7-grade8-math-answer-qa-weeks07-09.mjs` to guard all teacher key entries in CI.

## Clarity fixes
- Grade 8 Week 07: added the actual intermediate reflected point to the follow-up translation question; rewrote the translation-vector request to state both endpoints clearly.
- Grade 8 Week 08: specified **about the origin** in each of four coordinate dilation prompts rather than relying only on the day's heading.
- Correct solutions, original lessons, shared studios, formative response fields and 80% authorized assessment authority preserved.

## Academic progress and limitations
- Full independent indexed mathematical review reaches **360 of 600** new early-year Grade 7/8 Weeks 01–15 problems after this PR passes CI. Remaining 240 in Weeks 10–15 require full indexed review; previous 60 sampled keys do not count as full-block certification.
- Week 16–36 840 new arithmetic solutions have automated operand-based checks. Template-based lesson variety, conceptual model and real-learner retention still require human educational review.
- Tablet and browser, student/parent route, accessibility, 79/80 boundary, report ZIP and Account Cloud durable record/restore evidence not established by this source-based audit.
