# Khaemenes Academy Middle School English 6–8

**Phase 01 · November 16, 2026**

## Scope

Read-only audit followed by live code improvements in `vervenveda/Khaemenes_Middle.github.io`, default branch `main`.

- Preserve all three Grade 06–08 36-week curricula.
- Leave the Academy randomized formal assessments, official 80% mastery thresholds, and prior learner records unchanged.
- Repair learner-facing adult approval controls in Grade 7 and 8.
- Deepen Language Arts Week 01 in all three grades concurrently.
- Keep five original `<article class="lesson">` elements per subject week so existing curriculum validators and study context remain compatible.

## Adult-only status changes

**Grade 07** `grades/grade-07/assets/app.js`

- Portfolio approval checkbox rendered read-only.
- Student `Save Record` no longer assigns `state.portfolio` from this checkbox.
- Saving reloads latest course record and preserves verified assessment values, metadata, and prior portfolio status.
- No previously saved approval bit is deleted or reclassified as authenticated.

**Grade 08** `grades/grade-08/assets/app.js`

- Same portfolio protection as Grade 7.
- High-school transition approval also rendered read-only; student Save Record cannot set it.
- Grade 08 course record saving preserves verified scores, metadata, and both existing approval flags.

**Certificate route alignment**

`grades/grade-07/assets/certificate.js` and `grades/grade-08/assets/certificate.js` now require an active learner whose registered grade matches the certificate page, mirroring the Grade 06 placement guard.

**Remaining authority caveat:** Browser-local approval flags do not prove the identity or authorization of an educator. An authenticated reviewer process with approval provenance and record custody is required before these flags can be treated as official school approval. The changes above prevent the ordinary student page from authoring new approvals, not a malicious person from directly editing their local browser records.

## English Week 01 common learning blueprint

New shared style: `assets/khaemenes-middle-ela-week01.css`.

| Course | Academy-original reading/source focus | Student product |
|---|---|---|
| Grade 06 | Narrative *The Missing Map Key* and nonfiction *Planning Without Guesswork* | claim-evidence explanations, inference chart, two-source paragraph with revision |
| Grade 07 | *The Riverbend Library Pilot* report and two competing family/student letters | multi-source comparison, qualified argument, fair counterclaim and revision |
| Grade 08 | *Cedar Brook Observation Memo*, persuasive editorial, and independent weather note (all fictional) | source reliability matrix, qualified synthesis, scholarly revision and brief oral defense |

Across all three course weeks:

- Five expandable daily lesson cards, one per weekday
- Monday opens by default; subsequent days can be expanded as needed
- Twenty specific practice tasks (four per day)
- Five teacher/family support notes
- Five described portfolio evidence products
- Explicit non-grading distinction for teacher-reviewed practice
- Existing printables, weekly plan, global shared chrome, language utilities, vocabulary access, and learning ledger remain connected

No learner answer is implicitly saved from these static lesson pages. Students should use the existing printable/portfolio workflow pending a purpose-built middle-school Reading and Writing Studio.

## Validation

Fetched all three committed Week 01 pages back from GitHub and confirmed:

- 5 exact original daily lesson elements each
- 5 expandable lesson panels each
- 20 practice items each
- 5 educator notes and 5 evidence descriptions each
- Academy original source texts present for each grade
- Legacy generic “Name the subject” prompts removed from Week 01
- Existing weekly plan, printable, learner ledger and question factory references preserved
- Grade 07/08 scripts remain syntactically valid after the safeguards

Native Node regression: `tools/validate-middle-english-week01.mjs`.

GitHub Actions workflow: `.github/workflows/middle-curriculum-integrity.yml` now includes the regression command for changes in all three grade folders and the new shared English resources.

**Test-status qualification:** Source-level content checks were reproduced against GitHub. A completed GitHub Actions run, actual browser screen behavior, tablet rotation, and parental authorization integration were not independently confirmed in this audit.

## Next work in synchronized order

1. Repeat the authored five-day depth improvements across Week 02 in Grades 06, 07 and 08.
2. Create one grade-aware reading-catalogue and Reading Headquarters with lawful, original or publicly accessible reading assignments and independent reading log.
3. Expand passage-specific Grade 6–8 ELA assessment pools, verify uniqueness, ensure source validity, and preserve the existing formal score writer.
4. Create a shared middle-school Evidence Studio with increasingly demanding grade-specific activities; preserve teacher-review authority.
5. Add Reading Development and writing revision indicators to Student Progress, without automatically altering grades.
6. Introduce a verified adult reviewer approval contract before attributing permanent educational authority to local flags.

**Copyright:** All original instructional passages in Phase 01 were freshly authored for Khaemenes Academy, with fictional people and situations. Grade 08 source numbers are invented classroom observations and may not be represented as actual environmental measurements or safety statements.

Attribution: **Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**.
