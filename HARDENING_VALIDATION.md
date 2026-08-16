# Khaemenes Middle School — Hardening Validation

**Branch:** `hardening/archaemenes-grade06`

## Scope

This validation covers:

- Grade 05 → Middle School bridge context;
- advanced Grade 05 preview boundary;
- Middle School root landing page v4;
- Grade 06 hardening;
- Grade 07 hardening;
- Grade 08 hardening;
- learner-scoped records;
- adult verification;
- certification gates;
- Archaemenes continuity;
- NAIB delegation semantics;
- High School transition boundary.

---

## 1. Grade 05 → Grade 08 academic progression

**PASS.**

The progression audit confirms a coherent increase in abstraction, independence, research responsibility, mathematical reasoning, evidence quality, and transition planning from Grade 05 through Grade 08.

See:

`ELEMENTARY_TO_MIDDLE_CONTINUITY_AUDIT.md`

for the detailed strand-by-strand comparison.

---

## 2. Advanced Grade 05 preview

**PASS.**

The Middle School root recognizes the public entry context:

`?entry=grade05-advanced-preview`

This mode is explicitly enrichment / readiness only.

It does not:

- change formal stage;
- change formal grade;
- create Grade 06 records;
- unlock Grade 06 certification;
- promote the learner.

No learner ID or family ID is placed in the URL.

---

## 3. Grade 05 transition-center entry

**PASS.**

The root recognizes:

`?entry=grade05-transition`

This entry explains Grade 06 expectations and sends formal placement management back to the Academy Family Profile.

---

## 4. Middle School root identity boundary

**PASS.**

The root consumes the Academy Family Registry if available but does not create a second learner identity or gradebook.

Formal Middle School context is recognized only when the active learner resolves to:

- `stage: middle`;
- `grade: grade-06`, `grade-07`, or `grade-08`.

If placement is missing or mismatched, the landing page remains a browsing / transition surface rather than inventing authority.

---

## 5. NAIB / Archaemenes boundary

**PASS.**

The root delegates bounded educational context through NAIB when available.

Delegation context includes only educational routing fields such as:

- stage;
- grade;
- age band;
- interests;
- surface;
- intent.

The landing page does not send learner or family identifiers to NAIB.

Khaemenes Academy provides Archaemenes as the institutional mentor.

Middle School presentation:

**Archaemenes · Academy Scholar**

Advanced Grade 05 preview presentation:

**Archaemenes · Young Scholar → Academy Scholar Preview**

The mentor does not grade, certify, or promote.

---

## 6. Grade 06

**PASS — statically hardened.**

Formal eligibility:

- `stage: middle`
- `grade: grade-06`

Certification:

- 36/36 verified weeks ≥80%;
- midterm ≥80%;
- final ≥80%;
- approved portfolio / capstone.

Grade 06 completion does not auto-promote to Grade 07.

---

## 7. Grade 07

**PASS — statically hardened.**

Formal eligibility:

- `stage: middle`
- `grade: grade-07`

Certification:

- 36/36 verified weeks ≥80%;
- midterm ≥80%;
- final ≥80%;
- approved portfolio / capstone.

Grade 07 completion does not auto-promote to Grade 08.

---

## 8. Grade 08

**PASS — statically hardened.**

Formal eligibility:

- `stage: middle`
- `grade: grade-08`

Certification:

- 36/36 verified weeks ≥80%;
- midterm ≥80%;
- final ≥80%;
- approved portfolio / capstone;
- reviewed and completed High School transition plan.

Grade 08 completion does not auto-promote to High School.

---

## 9. Record isolation

**PASS.**

Grades 06–08 use learner-scoped formal record stores.

Historical shared record keys are migration inputs only.

Hardened runtimes do not rewrite the historical shared record, and one-time migration claims protect against one legacy snapshot being silently copied into multiple learners.

---

## 10. Adult verification

**PASS.**

Learner-facing Grade 06–08 pages do not directly edit formal mastery values.

Teacher / Family Tools is the formal browser-side verification surface for:

- weekly mastery;
- midterm;
- final;
- portfolio / capstone;
- Grade 08 transition plan.

---

## 11. Middle School root security structure

**PASS — static source review.**

The v4 root now uses:

- external CSS;
- external JavaScript;
- CSP;
- no-referrer policy;
- restrictive Permissions Policy;
- no iframe / object / worker / media privileges;
- no inline JavaScript handlers;
- no inline style attributes required for functional rendering;
- safe DOM construction for dynamic resource cards.

The root no longer carries the previous large inline CSS / JavaScript bundle.

---

## 12. Resource boundary

**PASS.**

The root resource directory is supplementary only.

It does not award mastery or modify formal grade state.

Resource cards are constructed with DOM APIs and text content rather than injecting untrusted HTML.

---

## 13. Remaining upstream dependency

**OPEN — Academy Family Registry.**

The central Family Registry still needs the planned canonical `stage + grade` upgrade.

Until that is completed, the hardened grade portals correctly fail closed for formal record eligibility.

---

## 14. Remaining browser / deployment validation

The following require an actual deployed browser session and are not claimed as completed by static source inspection:

1. no learner / wrong-stage / wrong-grade root behavior;
2. formal Grade 06 / 07 / 08 routing;
3. Grade 05 advanced-preview entry;
4. Grade 05 transition-center entry;
5. NAIB v2 delegation on the deployed origin;
6. Family Registry script loading under CSP;
7. two-learner record isolation;
8. legacy one-time migration;
9. adult verification save / reload persistence;
10. certificate lock / unlock / print;
11. Grade 08 transition-plan gate;
12. Grade 06–08 curriculum / assessment / printable links;
13. mobile layout;
14. print layout.

---

## Status

**PASS — Grade 05 → Grade 08 continuity and the Middle School v4 landing architecture are statically hardened and aligned on the review branches.**

`main` remains unchanged pending deployment testing and explicit merge approval.

**Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**
