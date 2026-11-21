---
name: find-search-topics
description: "Build a topic shortlist from the owner's own material, then Search Console, then a quoted web search. Group queries that share results and score them for fit."
---
# Find search topics

Find topics the site can honestly win. Follow `docs/skill-frame.md`.

## Use when

- The week plan needs a new page and no brief exists yet.
- The owner asks what to write next.

## Steps

1. Start from the owner's own material by calling knowledge.context.resolve, and from notes already in Knowledge, before you look at a query list (`references/own.md`).

2. Read visibility.keywords_get and keep queries the site already shows (`references/console.md`).

3. Group queries that bring up the same kinds of pages (`references/groups.md`).

4. For a gap the owner wants filled, quote visibility.research.web_search at 2 credits, quote first, wait for the owner's yes, then run it (`references/search.md`).

5. Score each topic for the reader, the offer, and the leave-alone list (`references/score.md`).

6. Write the shortlist under work/topics/ and stop at the weekly cap in search.local/plan.md (`references/cap.md`).

## Capabilities

- `knowledge.context.resolve`
- `visibility.keywords_get`
- `visibility.research.web_search`

## Stop

- Quote first, wait for the owner's yes, before visibility.research.web_search.
- Do not pass the weekly cap in search.local/plan.md.
- Do not brief the page in this skill.
- A query with no fit score does not make the shortlist.
