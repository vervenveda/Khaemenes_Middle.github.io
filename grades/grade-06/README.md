# Khaemenes Academy Sixth Grade — Middle School Subject-Based 36 Week A++ Curriculum

**Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**

This is the complete in-house sixth-grade middle school curriculum package for GitHub Pages.

## Included

- 36 weeks
- 9 subject halls
- 5 lesson blocks per subject per week
- 1,620 subject lesson blocks
- 36 weekly plans
- 36 clean centered printable packets
- 36 weekly A++ mastery assessments
- Midyear demonstration / midterm
- Final readiness demonstration / final exam
- Teacher / Family verification tools
- Learner-scoped course records
- Grade 7 readiness portfolio / capstone evidence
- Standards-style internal crosswalk
- No required CDN frameworks, external fonts, or outside curriculum dependencies
- Attribution: Jennifer Kay Pearl only

## Canonical Grade 06 Architecture

```text
Academy Family Registry
        ↓
NAIB intake / resource direction / delegation
        ↓
Khaemenes Academy
        ↓
Archaemenes · Academy Scholar
        ↓
Grade 06 curriculum
        ↓
Assessment evidence + adult verification
        ↓
Learner-scoped Grade 06 record
        ↓
Certificate / Grade 7 readiness
```

Authority boundaries:

- Academy Family Registry owns learner identity and formal grade placement.
- NAIB is the administrative / AI Resources Director and delegates visitors into the appropriate platform.
- Khaemenes Academy provides Archaemenes as its institutional mentor.
- Archaemenes mentors the learner but does not award mastery.
- Grade 06 owns lessons, weekly plans, assessment evidence, records, and certification state.
- Teacher / Family Tools is the adult-facing verification surface.
- Browser-side records are local educational state, not secure authentication or server authorization.

## Learner Eligibility

Formal Grade 06 records require the active Academy learner to resolve to:

- `stage: middle`
- `grade: grade-06`

The Grade 06 portal does not create a second learner identity and does not let a local preference redefine formal grade placement.

## Record Isolation

The hardened continuity layer uses:

- formal records: `khaemenes_grade6_records_by_learner_v1`
- active learner marker: `khaemenes_grade6_active_learner_v1`
- one-time legacy migration claim: `khaemenes_grade6_legacy_migration_claim_v1`

The older shared key:

`khaemenes_grade6_middle_school_36_aplusplus_v1`

is retained only as a read-only migration input. It is not rewritten by the hardened runtime and cannot silently migrate into multiple learners.

## Certification Rule

The hardened certificate requires all of the following:

- active eligible Grade 06 learner;
- **36/36 verified weekly mastery results at 80% or above**;
- midterm at 80% or above;
- final at 80% or above;
- portfolio / capstone evidence approved by an adult reviewer.

This intentionally replaces the earlier weekly-average-only rule.

## Mentor Continuity

Archaemenes appears in Middle School as **Academy Scholar**, a developmental presentation of the same Khaemenes Academy mentor identity used in earlier Academy stages.

NAIB delegates the learner to Khaemenes Academy; NAIB does not become the learner's academic mentor.

## Grade 7 Boundary

Grade 06 certification establishes readiness evidence for the next grade but does not automatically rewrite the learner's formal Academy grade placement. Advancement remains a deliberate Academy / family action.
