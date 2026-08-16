# Grade 06 Hardening Validation

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
- Grade 7 readiness portfolio / capstone evidence: present
- Attribution: Jennifer Kay Pearl only

The Grade 06 curriculum remains intact. This hardening pass changes identity, mentor/delegation, record, verification, and certification authority rather than rewriting the curriculum.

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
Grade 06 course context
        ↓
Assessment evidence + adult verification
        ↓
Learner-scoped record / certificate
```

Authority boundaries:

- Family Registry owns learner identity and formal grade placement.
- NAIB is the front-desk administrator / AI Resources Director and delegates the learner to the appropriate platform.
- Khaemenes Academy provides Archaemenes as the institutional mentor.
- Archaemenes mentors but does not award mastery.
- Grade 06 owns course state.
- Adult-reviewed assessment evidence determines formal mastery.

## Learner Eligibility

PASS.

Formal Grade 06 state requires the active Academy learner to resolve to:

- `stage: middle`
- `grade: grade-06`

No active learner, wrong school stage, or wrong grade keeps the Grade 06 record surface ineligible.

## Student-Facing Record Boundary

PASS.

The Grade 06 learner landing page no longer allows direct editing of:

- learner name;
- weekly mastery scores;
- midterm score;
- final score;
- portfolio approval.

The learner page displays verified progress and links to curriculum, printables, certificate status, and the adult verification surface.

## Adult Verification Surface

PASS.

`teacher-tools/index.html` now includes a formal adult-facing verification area controlled by `assets/grade6-records.js`.

It records:

- one verified weekly mastery result at a time;
- midterm result;
- final result;
- portfolio / capstone approval.

Controls remain disabled until an eligible Grade 06 learner is active.

## Learner-Scoped Records

PASS.

`assets/khaemenes-grade6-continuity.js` provides learner-scoped Grade 06 records.

Storage model:

- formal records: `khaemenes_grade6_records_by_learner_v1`
- active learner marker: `khaemenes_grade6_active_learner_v1`
- migration claim: `khaemenes_grade6_legacy_migration_claim_v1`
- old shared record: `khaemenes_grade6_middle_school_36_aplusplus_v1` — migration input only

The hardened runtime never rewrites the old shared record. A one-time claim prevents one historical shared snapshot from silently migrating into multiple learners.

## Certification Standard

PASS.

Certificate readiness now requires:

- active eligible Grade 06 learner;
- 36/36 weekly mastery results at 80% or above;
- midterm at 80% or above;
- final at 80% or above;
- portfolio / capstone evidence approved.

This intentionally replaces the older weekly-average-only rule.

The certificate reads the learner-scoped Grade 06 continuity state rather than the historical shared record.

## Mentor Continuity

PASS.

Archaemenes is the Khaemenes Academy mentor and uses the Middle School `academy-scholar` presentation.

The continuity layer prefers NAIB `delegate()` when available and retains the historical `assignMentor()` seam only for transition compatibility. If the public router is temporarily unavailable, the visible fallback remains Archaemenes rather than creating an alternate local mentor identity.

## Grade 7 Boundary

PASS.

Grade 06 completion and certification do not automatically rewrite the learner's Academy placement to Grade 07. Advancement remains a deliberate Academy / family action.

## Preserved Systems

- all nine subject halls;
- all 36 weekly plans;
- all 36 printable packets;
- all 36 weekly assessments;
- midterm and final;
- research / capstone expectations;
- Grade 7 readiness portfolio;
- Teacher Tools instructional guides;
- 80% mastery threshold.

## Remaining Deployment Checks

Before merge to `main`, perform browser/deployment validation for:

1. active Grade 06 learner / no learner / wrong-stage / wrong-grade behavior;
2. NAIB v2 delegation and compatibility fallback;
3. adult verification writes and reload persistence;
4. two-learner record isolation and one-time legacy migration;
5. certificate lock/unlock/print behavior;
6. subject-hall, weekly-plan, printable, and assessment links;
7. mobile and print layout.

## Status

**Grade 06 is architecturally hardened on `hardening/archaemenes-grade06`. `main` remains unchanged pending validation and merge approval.**
