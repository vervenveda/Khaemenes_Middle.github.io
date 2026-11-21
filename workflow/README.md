# Workflow · Development and Conversation Journal

This root-level directory tracks dated **audits, tests, repairs, upgrades, decisions, and miscellaneous Codex work**.

- `README.md`: filing rules
- `INDEX.md`: chronological log register
- `templates/SESSION_LOG_TEMPLATE.md`: session template
- `logs/YYYY/MM/YYYY-MM-DD-topic.md`: date-specific records (add when real activity occurs)
- `digests/YYYY/MM/YYYY-MM-DD-topic-workflow-digest.md`: session/day executive summaries of decisions, changes and holds
- `codexes/YYYY/MM/YYYY-MM-DD-topic-codex.md`: curated, non-verbatim records of important conversations, approved designs and reusable implementation blueprints

Every entry must distinguish verified evidence, proposed changes, committed changes and unverified holds. Include specific affected files, SHAs, test commands and outcomes. A conversation summary is not a verbatim transcript. Do not include learner data, personal records, keys, credentials, or unredacted exports. Maintain original grades, assessment history, authority boundaries and the 80% mastery rule where relevant. Documenting a repair is not proof of implementation. Append links to INDEX.md after each session.

## Workflow digest and conversation codex rules

Use the existing workflow journal rather than creating a separate approval or audit authority. A **digest** is a chronological summary of what was discussed, decided, implemented and verified on a given date. A **conversation codex** captures durable founder-approved decisions, a visual/design blueprint, file/ownership boundaries, forbidden regressions, test gates and next-session context. Never call either one a verbatim transcript unless an actual transcript is provided and authorized.

Create a new dated digest/codex when substantial new work occurs, cross-reference the applicable dated implementation logs, and register them in `INDEX.md`. Differentiate **proposed**, **user-approved**, **committed**, **source-verified**, **runtime-verified** and **HOLD**. Treat approval and source inspection as distinct from live test success. Preserve learner privacy, coursework and academic authority. Do not store private student identifiers, account credentials or sensitive exports in public files.
