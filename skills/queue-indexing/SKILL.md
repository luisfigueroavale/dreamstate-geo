---
name: queue-indexing
description: "Build a list of new or changed priority pages from the sitemap. The owner clicks Request indexing. The agent does not drive the Google session."
---
# Queue indexing

Make the indexing list and hand it to the owner. Follow `docs/skill-frame.md`.

## Use when

- A pull request merged and the priority pages should be crawled.
- The day report shows priority URLs missing from the sitemap.

## Steps

1. Read visibility.sitemap_get and the priority list in search.local/plan.md (`references/list.md`).

2. Build the list of new or changed priority pages that are missing or newly added (`references/list.md`).

3. Give the owner the links and ask them to click Request indexing, and do not drive the Google session (`references/owner.md`).

4. Mention IndexNow only as an optional follow-up after a separate yes, and do not store a key (`references/indexnow.md`).

5. Record what the owner submitted, and do not claim a page is indexed until a later sitemap read shows it (`references/record.md`).

## Capabilities

- `visibility.sitemap_get`

## Stop

- Do not open the owner's Google account.
- Do not store an IndexNow key in this repo.
- Do not mark a page indexed because the pull request merged.
- This skill is free. It does not spend credits.
