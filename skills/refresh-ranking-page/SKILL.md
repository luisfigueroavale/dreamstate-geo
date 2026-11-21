---
name: refresh-ranking-page
description: "Add or rewrite one section on a page that ranks in positions 11 to 20. Ship as a pull request. Merge waits for a yes."
---
# Refresh a ranking page

Refresh one page that is close to page one. Follow `docs/skill-frame.md`.

## Use when

- The day report lists queries for this URL in positions 11 to 20.
- The page type is still right for those queries.

## Steps

1. Read visibility.keywords_get for the page and keep queries whose position is 11 to 20 (`references/queries.md`).

2. Add or rewrite one section that answers those queries, and leave the rest of the page alone (`references/section.md`).

3. Keep every new fact sourced, and run scripts/page-lint.mjs (`references/check.md`).

4. Open a pull request on the site repo, and say that merge waits for a yes (`references/pr.md`).

5. Record the change in search.local/changes.json with the ship date left blank until merge (`references/record.md`).

## Capabilities

- `visibility.keywords_get`

## Stop

- Do not rewrite the whole page when one section will do.
- Do not merge.
- Do not record a ship date before the merge.
- Skip queries on the leave-alone list.
