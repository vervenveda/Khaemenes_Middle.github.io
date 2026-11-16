# Khaemenes Academy — Middle School English Grades 06–08 · Week 04

**Release date:** November 16, 2026  
**Repository:** `vervenveda/Khaemenes_Middle.github.io`  
**Branch:** `main`  
**Status:** All three Week 04 English lessons committed. Source structure and numerical examples rechecked against GitHub; CI run outcome and live browser acceptance remain separately unconfirmed.

## Three-grade instructional progression

| Grade | Existing Week 04 course title | New original sources and skill progression | Writing challenge |
| --- | --- | --- | --- |
| 06 | Percent, Proportion, and Civic Decisions | *The Library Hours Question*; *A Different Survey*; *Every Student Wants More Hours*; *Numbers Need Context*; *60% of Everyone?*. Claim/evidence identification, denominator context, survey interpretation, source-versus-opinion comparison and responsible civic explanation | 160–220-word evidence-based recommendation with careful percentages, citations, counterconsideration and revision |
| 07 | Percent Change and Civic Data | *The Reading Corner Follow-Up*; *Two Ways to Describe Change*; *The Pilot Settled Everything*; *Keep Studying Access*; *Did Everyone Change Their Mind?*. Argument analysis, voluntary-sample limits, percentage points versus relative percent change, rhetoric and fair counterargument | 210–290-word sourced and qualified civic argument with percent-change reasoning and revisions |
| 08 | Slope, Intercept, and Argument Claims | *Two Community Notice Plans*; *A Fair Time Comparison*; *Faster Means Fairer*; *Start Strong, Decide Now*; *What Would Count as Success?*. Claim evaluation, slope/intercept, model assumptions, numerical counterexamples, competing editorials and oral defense | 280–380-word multi-source argument, counterclaim, substantive revision and a 90-second evidence defense |

All people, institutions, responses, distribution figures and proposed decisions in these lessons are **fictional, Academy-original instructional material**. The values do not describe actual public-opinion results, community programs, financial rules or public policies. The examples illustrate critical reading and writing, not a position students must endorse.

## Consistent five-day experience

Each English Week 04 page preserves precisely five `<article class="lesson">` elements, each with:

1. An independently authored reading/argument task and learning target.
2. An expandable instructional workshop with a worked example.
3. Four explicit student-practice activities.
4. A specified piece of portfolio evidence.
5. Teacher/family facilitation guidance.

Monday is open by default; other days are collapsible. The existing centered Academy layout continues to use `assets/khaemenes-middle-ela-week01.css` shared by Weeks 01–04. There is no new side navigation, CDN, separate grading engine or learner-data store.

Totals across the three grades: **15 fully authored daily lessons, 60 practice activities, 15 guided portfolio evidence products, and 15 educator guidance panels**.

## Mathematical interpretation and claim accuracy

Grade 06 uses a hypothetical library survey with 30 of 50 responses favoring more hours: 60% **of respondents**. A separate fictional group of 40 has 10 favoring a different reading-club question: 25% **of those respondents**. The questions and samples must not be mixed.

Grade 07 contrasts 40/80 = 50% and 54/90 = 60% across two separate voluntary response groups. The reported share differs by **10 percentage points**; relative to the original 50% share, the change in that rate is **20%**. Neither figure proves the pilot caused opinion changes in the population. A separate rise from 40 to 50 sign-ups is a 25% increase in a count, not a percentage-point change.

Grade 08 uses hypothetical outreach distribution projections `A(w)=12+6w` and `B(w)=24+3w`. At Week 0 the modeled counts are 12 and 24; Week 2: 24 and 30; Week 4: 36 each; Week 6: 48 and 42. The model's numerical crossing does not establish which plan truly informs people or is fairer.

## Safeguards and preserved architecture

No changes were made to:

- The Academy's 36-week course JSON for any of the three grades.
- Grades 06–08 official assessment pages, randomized Question Factory, score writers, or the formal 80% mastery/unlock rule.
- Student, family, reviewer or certification records and approval controls.
- Existing weekly-plan pages, printable packets or teacher tools.
- Grade 06–08 Weeks 01–03 lesson pages.
- The four common Middle School learning scripts, header/chrome, translator or official ecosystem toolbar references.

The new lesson pages do **not** silently save students' essay responses; students should preserve their written drafts through the existing Academy journal/portfolio/printable pathway. Writing feedback and 20-point sample rubrics are for **developmental review only**, never automatic course grades or verified mastery.

## Validation and continuous integration

**Source checks performed against the committed repository:**

- All three grade-level Week 04 pages present; original titles and essential questions retained.
- Five lesson cards and five expandable workshops each, with Monday expanded.
- Twenty practice activities, five educator notes and five portfolio descriptions for each grade.
- Original reading sets present, no generic "Name the subject" scaffold.
- Accurate and scoped percentages, percentage points, modeled slopes, intercepts and fictional source labels.
- Week 04 printable and weekly-plan links preserved, their target files verified in GitHub.
- Existing Week 04 assessment files remain available and linked from the weekly plans.
- Original Focus Map, Question Factory, Learning Ledger and Learning Context references intact.
- Official no-automatic-grade and 80% mastery boundaries retained.
- Course JSON still declares 36 weeks in every grade.

**New regression:** `node tools/validate-middle-english-week04.mjs`

**CI registration:** `.github/workflows/middle-curriculum-integrity.yml` now runs Week 01, 02, 03 and 04 English regression scripts alongside the repository's existing structural checks.

The Week 04 source tests and numerical assertions were independently checked using the fetched GitHub content. **A completed Node test run inside GitHub Actions and real browser/tablet behavior were not independently confirmed during this change.**

## Next synchronized milestone

Week 05 across all three English courses, preserving the canonical weekly themes and maintaining grade-appropriate progression. A later cross-week cleanup can rename the shared `week01` stylesheet to a canonical English lesson stylesheet, with surgical updates and tests. A shared Reading Headquarters and non-grading Evidence Studio remain future planned features; these Week 04 static lessons do not pretend they are already installed.

**Attribution:** Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda.
