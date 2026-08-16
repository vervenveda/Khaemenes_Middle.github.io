# Khaemenes Academy — Middle School

**Grades 06–08 · Verve N Veda Educational Network**

Khaemenes Middle School is the connected Academy campus between Elementary and High School. It contains complete Grade 06, 07, and 08 curricula, learner-scoped formal records, adult verification, certification, advanced Grade 05 preview access, Archaemenes mentor continuity, and a deliberate High School transition boundary.

---

## Current Campus

### Grade 06 — Foundation & Discovery

- 36 weeks
- 9 subject halls
- 1,620 lesson blocks
- 36 weekly assessments
- midterm
- final
- portfolio / capstone
- Grade 07 readiness
- learner-scoped formal record
- adult verification

Major strands include disciplinary literacy, ratios/rates, rational numbers, expressions/equations, systems science, world geography / ancient civilizations, World Languages & Global Culture, technology, and integrated research.

### Grade 07 — Connection & Challenge

- 36 weeks
- 9 subject halls
- 1,620 lesson blocks
- 36 weekly assessments
- midterm
- final
- portfolio / capstone
- Grade 08 readiness
- learner-scoped formal record
- adult verification

Major strands include proportional reasoning, algebra readiness, source credibility, deeper research, genetics and systems, medieval / early-modern world history, privacy/bias/design thinking, and larger independent projects.

### Grade 08 — Leadership & High School Readiness

- 36 weeks
- 9 subject halls
- 1,620 lesson blocks
- 36 weekly assessments
- midterm
- final
- portfolio / capstone
- High School transition-plan gate
- learner-scoped formal record
- adult verification

Major strands include Algebra I readiness, functions, systems, strongest textual evidence, research synthesis, culminating Middle School science, civics, technology / AI / data ethics, capstone defense, and High School transition planning.

---

## Unified Academy Architecture

```text
Academy Family Registry
        ↓
NAIB intake / resource direction / delegation
        ↓
Khaemenes Academy
        ↓
Archaemenes · Academy Scholar
        ↓
Grade 06 / 07 / 08 course context
        ↓
Assessment evidence
        ↓
Adult verification
        ↓
Learner-scoped formal record
        ↓
Certificate / readiness evidence
```

Authority boundaries:

- **Academy Family Registry** owns learner identity and formal school / grade placement.
- **NAIB** receives, interprets, delegates, and connects. It does not become the learner's academic mentor.
- **Khaemenes Academy** provides Archaemenes as its institutional mentor.
- **Archaemenes** mentors but does not grade, certify, or promote.
- **Grade portals** own their course-specific educational state.
- **Adult-reviewed evidence** determines formal mastery.
- **Promotion** is deliberate and never performed silently by a local course page.

---

## Formal Grade Eligibility

The hardened grade portals require canonical Academy placement:

```text
Grade 06 → stage: middle + grade: grade-06
Grade 07 → stage: middle + grade: grade-07
Grade 08 → stage: middle + grade: grade-08
```

A missing or mismatched placement keeps formal records unavailable rather than inventing a grade locally.

---

## Middle School Certification Standard

Grades 06 and 07 require:

- 36/36 verified weekly mastery results at 80% or above;
- midterm at 80% or above;
- final at 80% or above;
- approved portfolio / capstone evidence.

Grade 08 requires the same gates plus:

- reviewed and completed High School transition plan.

The older average-only certification rule has been retired.

---

## Learner-Scoped Records

Grades 06–08 now keep formal course records by Academy learner rather than in one shared browser record.

Historical shared localStorage keys remain migration inputs only. Hardened runtimes do not rewrite those legacy records, and one-time migration claims prevent a historical shared snapshot from silently migrating into multiple learners.

---

## Adult Verification

Learner-facing grade portals no longer allow direct editing of formal:

- weekly mastery scores;
- midterm results;
- final results;
- portfolio approval;
- Grade 08 transition-plan approval.

Teacher / Family Tools is the formal browser-side verification surface for reviewed educational evidence.

Browser records are educational state, not secure server authentication or authorization.

---

## Grade 05 → Middle School Bridge

The Middle School landing page now recognizes that advanced learning access and formal grade placement are different concepts.

An Elementary learner may remain formally:

```text
stage: elementary
grade: grade-05
```

while exploring selected Grade 06 curriculum for challenge and readiness.

### Advanced Grade 06 Preview

Preview mode is intended for:

- advanced Grade 05 scholars;
- transition planning;
- diagnostic challenge;
- family-guided enrichment.

Preview mode does **not**:

- rewrite the learner's stage;
- rewrite Grade 05 to Grade 06;
- create Grade 06 formal mastery records;
- unlock Grade 06 certification;
- bypass Academy / family promotion.

Recommended preview strands include:

- ratios, rates, percent, rational numbers, expressions, and equations;
- formal citation and argument analysis;
- Middle School CER and systems science;
- World Languages & Global Culture;
- research notebook / source-management systems;
- executive-function routines for a nine-subject Middle School schedule.

See `ELEMENTARY_TO_MIDDLE_CONTINUITY_AUDIT.md` for the full Grade 05–08 progression audit.

---

## Grade 05 → Grade 08 Progression

The audited progression is coherent:

```text
Grade 05
Upper Elementary mastery + research + capstone
        ↓
Grade 06
Middle School foundation + new abstraction + world languages
        ↓
Grade 07
Deeper connections + algebra readiness + larger independent inquiry
        ↓
Grade 08
Algebra I readiness + synthesis + leadership + High School transition
```

Each transition increases abstraction, independence, evidence quality, and project responsibility without resetting learner identity.

---

## Middle School Landing Page v4

The hardened root landing page now provides:

- formal Grade 06 / 07 / 08 learner recognition when canonical placement is available;
- advanced Grade 05 preview entry;
- Grade 05 transition-center entry;
- Archaemenes Academy Scholar continuity;
- direct Grade 06–08 curriculum doors;
- Elementary-to-Middle readiness explanation;
- connected educational resources;
- Grade 08 → High School transition explanation;
- strict CSP / no-referrer / permissions policy;
- externalized CSS and JavaScript;
- no root gradebook or competing learner identity.

The root portal is a campus navigator and continuity surface, not a formal gradebook.

---

## Resource Network

The Middle School landing page exposes selected connected resources for:

- Academy support;
- research;
- music;
- educational games / practice;
- writing / coding / project tools;
- media literacy;
- public research discovery;
- High School transition.

Course mastery remains owned by the formal grade course, not by the resource directory.

---

## Current Hardening Branch

Repository:

`vervenveda/Khaemenes_Middle.github.io`

Working branch:

`hardening/archaemenes-grade06`

The branch contains the unified hardening work for:

- Grade 06;
- Grade 07;
- Grade 08;
- Grade 05 → Middle School continuity audit;
- Middle School root landing page v4.

`main` remains unchanged until explicit merge approval.

---

## Remaining Upstream Dependency

The central Academy Family Registry still needs its planned canonical `stage + grade` upgrade.

Target examples:

```json
{
  "stage": "middle",
  "grade": "grade-06"
}
```

Until that upstream repair is complete, hardened grade portals correctly fail closed for formal records rather than assigning themselves a grade.

---

## Remaining Browser / Deployment Validation

Before merge, test on the deployed origin:

1. no active learner;
2. formal Grade 05 learner;
3. Grade 05 advanced-preview entry;
4. Grade 05 transition-center entry;
5. formal Grade 06 learner;
6. formal Grade 07 learner;
7. formal Grade 08 learner;
8. wrong-stage / wrong-grade behavior;
9. two-learner record isolation;
10. one-time legacy migration;
11. Teacher / Family verification persistence;
12. certificate lock / unlock / print;
13. Grade 08 transition-plan gate;
14. mobile layout;
15. print layout;
16. CSP behavior and external Academy script loading.

---

## Core Continuity Principle

> **One learner identity. One Academy relationship. Multiple courses, resources, and developmental stages.**

Advanced learners may receive greater challenge without sacrificing the integrity of formal placement.

**Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**
