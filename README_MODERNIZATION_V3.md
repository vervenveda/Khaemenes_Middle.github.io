# Khaemenes Middle School Modernization v3

Replace the root `index.html` in:

`vervenveda/Khaemenes_Middle.github.io`

with the included:

`Khaemenes_Middle.github.io/index.html`

## What changed

- Adopts the same Verve N Veda shell now used across the modernized ecosystem:
  - 36px network ticker
  - 72px light sticky header
  - compact navigation
  - 7px / 11px interface radii
  - breadcrumbs and searchable drawer
- Replaces the old hidden homeroom anchors with the real grade portals:
  - `grades/grade-06/`
  - `grades/grade-07/`
  - `grades/grade-08/`
- Adds direct assessment links for all three grade cards.
- Preserves the useful Daily Basecamp idea from the previous page.
- Adds a clearer Student Start and Family & Educator route without introducing a second identity system.
- Preserves the central Khaemenes family registry bridge with `data-khaemenes-stage="middle"`.
- Adds a deliberate Grade 8 / High School transition.
- Adds optional age-appropriate Career exploration without making Career assessment a Middle School requirement.
- Replaces the manually maintained TOOLS array with the central ecosystem federation:
  `https://vervenveda.com/assessment-engine/mentor/registry/ecosystem-resources.json`
- Dynamic resources must explicitly include one of these audiences before they appear:
  - `middle`
  - `middle-school`
  - `parent`
  - `educator`
- Includes a small safe core fallback if the federation cannot load.
- Preserves a local Middle School resource shelf:
  `khaemenes-middle-resource-favorites-v2`
- Exposes a read-only browser API:
  - `KhaemenesMiddleDirectoryAGI.all()`
  - `KhaemenesMiddleDirectoryAGI.find(term)`
  - `KhaemenesMiddleDirectoryAGI.resolve(name)`
  - `KhaemenesMiddleDirectoryAGI.categories()`
  - `KhaemenesMiddleDirectoryAGI.summary()`
  - `KhaemenesMiddleDirectoryAGI.refresh()`

## No other repository files need to be removed

The three complete grade curricula, assessments, teacher tools, records, README files, and mentor manifest remain untouched.
