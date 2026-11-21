---
name: review-search-page
description: "A second agent lints the page, checks every claim against its source, and returns PASS or FAIL. The writer does not run this skill on their own draft."
---
# Review a search page

Score the page with the gates and the six areas. Follow `docs/skill-frame.md`.

## Use when

- A draft exists and page-lint has been run at least once by the writer.
- You are not the agent that wrote the draft.

## Steps

1. Confirm you are a different agent from the writer, and if you are not, stop and ask for a handoff (`references/separate.md`).

2. Run node scripts/page-lint.mjs and stop on a lint FAIL (`references/lint.md`).

3. Apply the six gates and the six scores in the rubric (`references/rubric.md`).

4. Re-read a source only when the brief is not enough: quote visibility.research.urls_fetch at 1 credit, quote first, wait for the owner's yes (`references/sources.md`).

5. Return PASS or FAIL with the fixes, using the pass line in the rubric (`references/verdict.md`).

6. Do not edit the page in this skill, and hand the verdict back to the writer (`references/handback.md`).

## Capabilities

- `visibility.research.urls_fetch`

## Stop

- Quote first, wait for the owner's yes, before a fetch.
- The writer does not grade their own page.
- A lint FAIL is a FAIL even if the prose sounds fine.
- Do not raise the score to be kind.
