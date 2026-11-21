---
name: write-search-brief
description: "Fill one brief from briefs/ for a single page. Fetch competitor pages only after a quote and a yes. The brief check must pass before anyone drafts."
---
# Write a search brief

Write one brief and prove it is complete. Follow `docs/skill-frame.md`.

## Use when

- A topic group has a score and the owner wants a page.
- The page type is compare, roundup, or how-to.

## Steps

1. Copy the matching file from briefs/ into work/briefs/ and keep the page type (`references/type.md`).

2. Fill the fields from the topic note, search.local/plan.md, and Company Context (`references/fields.md`).

3. For each competitor page, quote visibility.research.urls_fetch at 1 credit, quote first, wait for the owner's yes, then fetch (`references/sources.md`).

4. Record each outside fact with that page URL and the date you read it (`references/sources.md`).

5. Run node scripts/brief-check.mjs on the brief and fix it until the script says READY (`references/check.md`).

6. Hand the brief back and do not draft the page in this skill (`references/handback.md`).

## Capabilities

- `knowledge.context.resolve`
- `visibility.research.urls_fetch`

## Stop

- Quote first, wait for the owner's yes, before each fetch.
- Do not write the page here.
- Do not leave a fact without a source and a date.
- A NOT READY brief does not move on.
