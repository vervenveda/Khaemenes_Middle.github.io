# Khaemenes Academy™ — Middle School

> **A Verve N Veda Educational Platform**  
> **Grades 6–8 · 36-week curricula · High-school readiness**

Khaemenes Academy Middle School is the Grades 6–8 bridge between Elementary School and Khaemenes High School. The repository contains complete grade-level curriculum portals rather than placeholder course listings.

## Current Grade Programs

### Grade 6 — Foundation & Discovery

A 36-week middle-school foundation program emphasizing:

- Language Arts & Literacy: textual evidence, informational and literary reading, argument, research, grammar, vocabulary, discussion, media literacy, revision, and publication
- Mathematics: ratios, rates, percent, fraction division, rational numbers, expressions, equations, inequalities, coordinate planes, geometry, surface area, volume, statistics, and modeling
- Science & Engineering: matter, energy, forces, waves, cells, ecosystems, Earth systems, weather/climate, engineering design, models, data, and CER reasoning
- Social Studies & Civics: geography, ancient civilizations, culture, law, economics, trade, migration, primary sources, civic ideas, and informed action
- World Languages & Global Culture
- Arts, Music & Media
- Health, PE & SEL
- Technology, Design & Tools
- Integrated Research Projects

Completion pathway: 36 weekly mastery records, midterm, final, portfolio evidence, and Grade 7 readiness.

### Grade 7 — Connection & Challenge

A 36-week advanced middle-school program emphasizing:

- Language Arts: Grade 7 literary/informational analysis, research, argument, comparative writing, discussion, media literacy, revision, and publication
- Mathematics: proportional relationships, unit rates, percent, rational-number operations, expressions, equations, inequalities, scale drawings, circles, geometry, probability, statistics, and algebra readiness
- Science: cells, body systems, genetics foundations, ecosystems, matter, energy, Earth systems, climate, natural hazards, engineering, data, and CER reasoning
- Social Studies: world geography, medieval and early-modern civilizations, trade networks, empires, Renaissance/Reformation, scientific revolution, civics, economics, human rights, and source analysis
- World Languages & Global Culture
- Arts, Music & Media
- Health, PE & SEL
- Technology, Design & Tools
- Integrated Research Projects

Completion pathway: 36 weekly mastery records, midterm, final, portfolio evidence, and Grade 8 readiness.

### Grade 8 — High School Readiness

A 36-week high-school-readiness program emphasizing:

- Language Arts: strongest evidence, literary and informational analysis, argument evaluation, research, grammar, vocabulary, discussion, media literacy, revision, and publication
- Mathematics: linear relationships, functions, slope/intercept, systems, exponents, scientific notation, transformations, similarity, Pythagorean theorem, volume, bivariate data, and Algebra I readiness
- Science: physical science and chemistry foundations, force/motion, energy, waves, Earth/space systems, geologic time, genetics, ecosystems, engineering, data, and CER reasoning
- Social Studies & Civics: U.S. founding foundations, constitutional principles, rights/responsibilities, expansion, reform, civil conflict, Reconstruction, economics, geography, source analysis, and informed action
- World Languages & Global Culture
- Arts, Music & Media
- Health, PE & SEL
- Technology, Design & Tools
- Integrated High School Readiness Projects

Completion pathway: 36 weekly mastery records, midterm, final, portfolio evidence, high-school transition plan, and high-school readiness certification.

## Grade-Level Architecture

Each grade contains:

```text
grades/grade-0X/
├── index.html
├── data/course-data.js
├── weekly-plans/
├── subjects/
├── printables/
├── assessments/
├── teacher-tools/
├── records/
└── assets/
```

The grade portal is the authoritative entry surface for that grade. Subject halls and weekly plans should remain subordinate to the grade's curriculum data and must not silently change learner placement.

## Academy Learner Continuity

Middle School uses the central Khaemenes Academy Family Registry for active learner identity and exact placement. Grade records use learner-scoped keys when the active Academy learner matches the page's grade:

```text
khaemenes.course:<learnerId>:middle-grade-06
khaemenes.course:<learnerId>:middle-grade-07
khaemenes.course:<learnerId>:middle-grade-08
```

Previewing another grade does not change placement, identity, mastery, or academic records.

Legacy browser-local records are preserved for compatibility, but canonical learner-scoped records take precedence for enrolled Academy learners.

## Mastery Boundary

The standard completion threshold is **80% mastery**. Course pages may record learner-facing evidence, but formal academic authority remains with the course/teacher/Academy process. Mentors may support learning and interpretation; they do not independently alter grades, placement, certificates, or protected records.

## Mentor Architecture

Archaemenes is the institutional educational mentor. Specialist mentors may support domain-specific work. NAIB routes and connects resources but does not mutate learner identity, placement, or mastery.

## Beta Program

Visible interactive/index surfaces participate in the Verve N Veda Beta Program through the shared Beta doorway. Beta feedback is for usability, navigation, curriculum flow, accessibility, printing/mobile behavior, and defect reporting; sensitive student information should not be submitted through public beta feedback.

## Accessibility and Delivery

The repository is designed for responsive use, keyboard navigation, readable typography, printable learning materials, local-first continuity, and progressively stronger Academy account integration. Browser-local state is not secure authentication and should not be treated as cross-device protected storage.

## Current Forensic Hardening Priorities

1. Keep all Grade 6–8 records learner-scoped when an Academy learner is active.
2. Keep certificates bound to the correct learner and exact grade placement.
3. Align every subject-week focus to the grade's intended instructional sequence rather than generic cyclical template rotation.
4. Replace generic weekly assessment descriptors with week-specific evidence wherever assessment rigor requires it.
5. Certify subject → weekly plan → printable → assessment links grade by grade.
6. Preserve the Grade 8 → High School transition without silently promoting or rewriting historical placement.

## Connected Academy Continuum

Preschool / Kinder Garden → Elementary Grades 1–5 → **Middle Grades 6–8** → High School Grades 9–12 → Higher Learning.

## Attribution

**Jennifer Kay Pearl**  
Khaemenes Academy™ · Verve N Veda Educational Network

All rights reserved.
