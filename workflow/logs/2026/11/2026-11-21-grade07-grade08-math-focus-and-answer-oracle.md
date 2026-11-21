# Grade 7 and Grade 8 Mathematics — Catalog alignment and independent answer-key sampling

Date: 2026-11-21
Branch: `grade07-08-math-catalog-semantic-repair-20261121`
Certification: HOLD pending the remaining independent teacher-key calculations and operational/learner testing.

## Starting evidence
- PR #49 merged with all 10 checks passing for Weeks 10–12. Its six weekly mathematics lesson pages added 30 deep day-specific laboratories and 120 student questions with four-item teacher keys per day.
- The cumulative Grade 7/8 Weeks 01–12 authored enrichment includes 120 daily laboratories and 480 new student practice questions across both grades (not 480 independent mathematical validations).

## Forensic findings and repairs
- The first 12 week cards on both Grade 07 and Grade 08 mathematics catalogs used a repeated focus-label template which often lagged behind the actual week titles and new mathematics content. For example Grade 7 Week 04 advertised 'expressions' instead of percent change; Grade 8 Week 05 advertised exponents instead of systems of equations.
- Updated **24** focus labels across the two mathematics index pages to align to the substantive subjects now taught. All 36 cards and all 36 week routes per grade preserved. No changes to unrelated course indexes or generic cross-curricular focus map.
- Introduced `tools/validate-grade7-grade8-math-catalog-and-answer-sample.mjs`, registered in `.github/workflows/middle-math-full-course.yml`.
- Regression enforces 24 subject labels and all 72 weekly course links and compares 30 separately derived expected numerical/symbolic answers against the **first question** of each daily mathematics laboratory in Weeks 10–12 for both grades.
- This is an editorial **sample** of the new practice keys, and it does not establish all 480 new answer entries correct. Remaining 450 newly authored key entries require independent math editorial verification, including alternate forms and conceptual validity.
- No student records, Account Cloud identity, official tests, scores, automatic advancement or 80% mastery gates were modified.

## Next work
1. Expand independent mathematical review for the remaining 450 Grade 7/8 enrichment items, separating exact numerical solutions from conceptual/open-text responses.
2. Review teaching progression through Weeks 13–15; many later older lesson pages retain generic cross-curricular language.
3. Full hands-on browser/iPad interaction, accessibility, lesson routing, assessment and export/recovery tests with synthetic learner data before final certification.
4. Require a passing latest GitHub CI run before merging these changes.
