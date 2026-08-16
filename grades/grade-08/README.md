# Khaemenes Academy Eighth Grade — A++ High School Readiness Curriculum

**Jennifer Kay Pearl · Khaemenes Academy · Verve N Veda**

This is the complete in-house eighth-grade high school readiness curriculum package.

## Included

- 36 weeks
- 9 subject halls
- 5 lesson blocks per subject per week
- 1,620 subject lesson blocks
- 36 weekly plans
- 36 printable packets
- 36 weekly A++ high school readiness assessments
- Midyear demonstration / midterm
- Final high school entrance demonstration / final exam
- Teacher / Family verification tools
- Learner-scoped course records
- Portfolio / capstone evidence
- High school transition plan gate
- Standards-style internal crosswalk
- Attribution: Jennifer Kay Pearl only

## Canonical Grade 08 Architecture

```text
Academy Family Registry
        ↓
NAIB intake / resource direction / delegation
        ↓
Khaemenes Academy
        ↓
Archaemenes · Academy Scholar
        ↓
Grade 08 curriculum
        ↓
Assessment evidence + adult verification
        ↓
Learner-scoped Grade 08 record
        ↓
Certificate / High School readiness
```

Authority boundaries:

- Academy Family Registry owns learner identity and formal placement.
- NAIB delegates visitors into the appropriate platform.
- Khaemenes Academy provides Archaemenes as its institutional mentor.
- Archaemenes mentors but does not award mastery or promotion.
- Grade 08 owns lessons, assessment evidence, records, and certification state.
- Teacher / Family Tools is the adult-facing verification surface.

## Learner Eligibility

Formal Grade 08 records require:

- `stage: middle`
- `grade: grade-08`

The Grade 08 portal does not create a competing learner identity or allow local preferences to redefine placement.

## Record Isolation

The hardened continuity layer uses:

- formal records: `khaemenes_grade8_records_by_learner_v1`
- active learner marker: `khaemenes_grade8_active_learner_v1`
- one-time migration claim: `khaemenes_grade8_legacy_migration_claim_v1`

The older shared key `khaemenes_grade8_high_school_readiness_36_aplusplus_v1` is read-only migration input and is not rewritten by the hardened runtime.

## Certification Rule

Certificate readiness requires all of the following:

- active eligible Grade 08 learner;
- **36/36 verified weekly mastery results at 80% or above**;
- midterm at 80% or above;
- final at 80% or above;
- portfolio / capstone evidence approved;
- high school transition plan reviewed and complete.

This replaces the older weekly-average-only rule.

## Mentor Continuity

Archaemenes appears in Middle School as **Academy Scholar**. NAIB delegates the learner to Khaemenes Academy; NAIB does not become the academic mentor.

## High School Boundary

Grade 08 certification establishes high-school readiness evidence but does **not** automatically rewrite the learner's formal Academy placement into High School. Advancement remains a deliberate Academy / family action.
