# How a week moves

There is one routine already, the weekday 08:00 rollup run by the Outbound Lead. This desk does not add a second routine. The search line rides that rollup.

## The day

`read-search-day` is a free read. It writes a short report: the six targets, changes that are due for a reading, queries in positions 11 to 20, priority pages missing from the index, and one line on AI answers. The rollup carries clicks, impressions, the AI-answer rate, changes due for reading, and any quoted paid step that is still waiting for a yes.

## The week

`plan-search-week` picks at most four pieces of work.

1. Refreshes of pages that sit in positions 11 to 20.
2. One new page, briefed and checked.
3. One health fix from `check-site-health`.
4. One outreach batch, drafts only.

Each piece is a Chief of Staff packet with four fields: Goal, Inputs, Skill, Guardrails. The Chief of Staff runs the packet in Codex, one git worktree per task, under the local growth folder on the owner's Mac. Site edits land as a pull request on the site repo. Merge and deploy wait for a yes.

## What does not move on its own

A paid search, a page fetch, a Search Console refresh, and an answer probe stay as quotes until you say yes to that quote. A site scan costs 0 credits and still waits, because it fetches pages into the cache. A draft pitch is not a sent email. A pull request is not a merge.
