# Middle School Mentor Manifest Repair 02

Date: 2026-08-09

## Result

PASS — replacement `mentor-manifest.json` generated.

## Purpose

The previous Middle School manifest exposed only the school home even though Grades 6–8 and their subject halls are already present in the repository.

Repair 02 changes discovery metadata only. No curriculum files, assessments, weekly plans, records, or teacher tools are moved or rewritten.

## Changes

- Manifest version: 1 → 2
- Resource count: 1 → 31
- 1 Middle School home
- 3 grade curriculum portals
- 27 subject halls
- 9 subject halls per grade

## Grade portals

- Grade 06 · Sixth Grade
- Grade 07 · Seventh Grade
- Grade 08 · Eighth Grade

## Subject halls exposed for every grade

- Language Arts
- Mathematics
- Science
- Social Studies
- Technology & Design
- World Languages
- Health, PE & SEL
- Arts & Music
- Integrated Projects

## Federation design

Week-level pages are intentionally not enumerated in the root Mentor manifest.

Mentor resolves:

Middle School
→ Grade
→ Subject Hall
→ course-owned week / lesson navigation

This keeps the federation catalog compact while making the actual curriculum visible to NAIB/Mentor.

## Generated artifact checks

- JSON parse: PASS
- Manifest version 2: PASS
- Total resources = 31: PASS
- Grade portals = 3: PASS
- Subject halls = 27: PASS
- Nine subject halls per grade: PASS
- Unique resource IDs: PASS
- Unique resource URLs: PASS
- Canonical Middle School base URL on every resource: PASS
- `/apps/` routes: 0
- Week-level URLs in root manifest: 0

## Upload

Replace the repository-root:

`mentor-manifest.json`

with the generated file in this package.

No other Khaemenes Middle School files need to be replaced for Repair 02.
