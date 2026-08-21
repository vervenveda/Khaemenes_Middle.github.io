# Khaemenes Middle School Electives

This directory contains the shared Middle School elective hall for Grades 06–08.

## Visible course surfaces

- `index.html` — elective hub
- `advanced-studio-art/index.html`
- `art-history/index.html`
- `home-gardening/index.html`
- `cursive-writing/index.html`

Each course page reads its source curriculum JSON from this directory and renders the 13-week course map in the browser.

## Student Profile pinning

Elective pages use `../../assets/khaemenes-middle-course-pins.js` (or the equivalent relative path) and the central Academy Family Registry. Pinned classes are stored under the existing learner-scoped `khaemenes_course_pins_v1` structure consumed by the Khaemenes Academy Student Portal.

Pinning is a convenience shortcut only. It does not change learner identity, grade placement, formal enrollment, mastery, assessment results, certificates, or teacher/Academy authority.

## Beta Program

Every visible elective `index.html` includes the canonical `/assets/vnv-beta-link.js` doorway. The repository-wide Beta index coverage workflow continues to audit public index surfaces.
