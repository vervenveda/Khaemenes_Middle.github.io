# Grade 08 Hardening Validation

Branch: `hardening/archaemenes-grade06`

## Curriculum Inventory

- Weeks: 36
- Subject halls: 9
- Lesson blocks: 1,620
- Weekly plans: 36
- Printable packets: 36
- Weekly assessments: 36
- Midterm: present
- Final exam: present
- Certificate: present
- Teacher / Family Tools: present
- Portfolio / capstone evidence: present
- High school transition plan gate: present
- Attribution: Jennifer Kay Pearl only

The Grade 08 curriculum remains intact. This hardening pass changes identity, delegation, record, verification, certification, and transition authority rather than rewriting the curriculum.

## Unified Authority Model

PASS.

```text
Academy Family Registry
        ↓
NAIB intake / resource direction / delegation
        ↓
Khaemenes Academy
        ↓
Archaemenes · Academy Scholar
        ↓
Grade 08 course context
        ↓
Assessment evidence + adult verification
        ↓
Learner-scoped record
        ↓
Certificate / High School readiness
```

- Family Registry owns learner identity and formal grade placement.
- NAIB delegates to the appropriate platform.
- Khaemenes Academy provides Archaemenes as institutional mentor.
- Archaemenes mentors but does not award mastery or promotion.
- Adult-reviewed evidence determines formal mastery and transition completion.

## Learner Eligibility

PASS.

Formal Grade 08 state requires:

- `stage: middle`
- `grade: grade-08`

No learner, wrong stage, or wrong grade keeps formal Grade 08 records ineligible.

## Student-Facing Record Boundary

PASS.

The Grade 08 learner landing page no longer permits direct editing of learner name, weekly mastery scores, midterm, final, portfolio approval, or transition-plan completion. It displays verified progress and curriculum navigation only.

## Adult Verification Surface

PASS.

`teacher-tools/index.html` uses `assets/grade8-records.js` to record:

- one verified weekly mastery result at a time;
- midterm result;
- final result;
- portfolio / capstone approval;
- high school transition plan completion.

Controls remain disabled until an eligible Grade 08 learner is active.

## Learner-Scoped Records

PASS.

Storage model:

- formal records: `khaemenes_grade8_records_by_learner_v1`
- active learner marker: `khaemenes_grade8_active_learner_v1`
- migration claim: `khaemenes_grade8_legacy_migration_claim_v1`
- historical shared record: `khaemenes_grade8_high_school_readiness_36_aplusplus_v1` — migration input only

The hardened runtime never rewrites the old shared record. A one-time claim prevents one historical snapshot from silently migrating into multiple learners.

## Certification Standard

PASS.

Certificate readiness requires:

- active eligible Grade 08 learner;
- 36/36 weekly mastery results at 80% or above;
- midterm at 80% or above;
- final at 80% or above;
- portfolio / capstone evidence approved;
- high school transition plan reviewed and complete.

This replaces the older weekly-average-only rule.

## Mentor Continuity

PASS.

Archaemenes uses the Middle School `academy-scholar` presentation. The continuity layer prefers NAIB `delegate()` and retains `assignMentor()` only as a transition compatibility seam. No learner or family identifiers are sent in delegation context.

## High School Boundary

PASS.

Grade 08 completion does not automatically change the learner's Academy placement to High School. Certification establishes readiness evidence only; advancement remains a deliberate Academy / family action.

## Remaining Deployment Checks

Before merge to `main`, perform browser/deployment validation for:

1. active Grade 08 learner / no learner / wrong-stage / wrong-grade behavior;
2. NAIB v2 delegation and compatibility fallback;
3. adult verification writes and reload persistence;
4. two-learner record isolation and one-time legacy migration;
5. transition-plan gate behavior;
6. certificate lock/unlock/print behavior;
7. subject-hall, weekly-plan, printable, and assessment links;
8. mobile and print layout;
9. Middle School → High School bridge behavior.

## Status

**Grade 08 is statically hardened and validated on the Middle School review branch. `main` remains unchanged pending deployment validation and merge approval.**
