---
name: write-search-page
description: "Draft one page from an accepted brief, in the owner's voice, with every outside fact tied to a source and a date. Does not review or merge."
---
# Write a search page

Draft the page from a ready brief. Follow `docs/skill-frame.md`.

## Use when

- The brief check says READY and the owner has accepted the brief.
- This is not the owner's first model page, unless they asked you to draft beside them.

## Steps

1. Read the brief, brand.local/voice.md, and audience.local/ideal-reader.md, and stop if one is missing or blank (`references/read.md`).

2. Read company facts through knowledge.context.resolve and do not paste them into a tracked file (`references/facts.md`).

3. Write the page so the answer is in the first 60 words, and so the sentence that opens each section settles that heading (`references/shape.md`).

4. Attach every outside fact to the source URL and the date in the brief (`references/sources.md`).

5. Pass the draft through docs/ai-tells.md and the banned word list, then run scripts/page-lint.mjs (`references/voice.md`).

6. Hand the draft to a different agent for review and do not open the pull request here (`references/handback.md`).

## Capabilities

- `knowledge.context.resolve`

## Stop

- Do not review your own draft as the final check.
- Do not invent a proof line.
- Do not merge.
- Stop if the brief is not READY.
