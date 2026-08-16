# Grade 07 Hardening Validation

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
- Grade 8 readiness portfolio / capstone evidence: present
- Attribution: Jennifer Kay Pearl only

The Grade 07 curriculum remains intact. This hardening pass changes identity, delegation, record, verification, and certification authority rather than rewriting the curriculum.

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
Grade 07 course context
        ↓
Assessment evidence + adult verification
        ↓
Learner-scoped record / certificate
```

- Family Registry owns learner identity and formal grade placement.
- NAIB delegates the learner to the appropriate platform.
- Khaemenes Academy provides Archaemenes as institutional mentor.
- Archaemenes mentors but does not award mastery.
- Grade 07 owns course state.
- Adult-reviewed evidence determines formal mastery.

## Learner Eligibility

PASS.

Formal Grade 07 state requires:

- `stage: middle`
- `grade: grade-07`

No learner, wrong stage, or wrong grade keeps formal Grade 07 records ineligible.

## Student-Facing Record Boundary

PASS.

The learner landing page no longer allows direct editing of learner name, weekly mastery scores, midterm, final, or portfolio approval. It displays verified progress and links to curriculum, printables, certificate status, and adult verification.

## Adult Verification Surface

PASS.

`teacher-tools/index.html` now contains the formal adult verification area controlled by `assets/grade7-records.js`. Controls remain disabled until an eligible Grade 07 learner is active.

## Learner-Scoped Records

PASS.

Storage model:

- formal records: `khaemenes_grade7_records_by_learner_v1`
- active learner marker: `khaemenes_grade7_active_learner_v1`
- migration claim: `khaemenes_grade7_legacy_migration_claim_v1`
- old shared record: `khaemenes_grade7_middle_school_36_aplusplus_v1` — migration input only

The hardened runtime does not rewrite the old shared record. A one-time migration claim prevents a historical shared snapshot from silently migrating into multiple learners.

## Certification Standard

PASS.

Certificate readiness requires:

- active eligible Grade 07 learner;
- 36/36 weekly mastery results at 80% or above;
- midterm at 80% or above;
- final at 80% or above;
- portfolio / capstone evidence approved.

This replaces the prior weekly-average-only rule.

## Mentor Continuity

PASS.

Archaemenes is the Khaemenes Academy mentor using the Middle School `academy-scholar` presentation. The continuity layer prefers NAIB `delegate()` and retains `assignMentor()` only as a compatibility seam. If routing is unavailable, the visible fallback remains Archaemenes rather than creating another mentor identity.

## Grade 8 Boundary

PASS.

Grade 07 completion does not automatically rewrite Academy placement to Grade 08. Advancement remains a deliberate Academy / family action.

## Preserved Systems

- all nine subject halls;
- all 36 weekly plans;
- all 36 printable packets;
- all 36 weekly assessments;
- midterm and final;
- research / capstone expectations;
- Grade 8 readiness portfolio;
- Teacher Tools instructional guides;
- 80% mastery threshold.

## Remaining Deployment Checks

Before merge to `main`, perform browser/deployment validation for:

1. active Grade 07 learner / no learner / wrong-stage / wrong-grade behavior;
2. NAIB v2 delegation and compatibility fallback;
3. adult verification writes and reload persistence;
4. two-learner record isolation and one-time legacy migration;
5. certificate lock/unlock/print behavior;
6. subject-hall, weekly-plan, printable, and assessment links;
7. mobile and print layout.

## Upstream Dependency

The central Academy Family Registry must provide canonical formal grade placement (`grade: grade-07`) in addition to `stage: middle`. Until that upstream contract is deployed, the hardened Grade 07 portal correctly stays locked rather than inventing local grade authority.

## Status

**Grade 07 is architecturally hardened and statically validated on the Middle School review branch. `main` remains unchanged pending deployment validation and merge approval.**
