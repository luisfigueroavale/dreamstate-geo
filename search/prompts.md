# Tracked prompts

Status: blank

The filled copy is `search.local/prompts.md`. Do not put the live prompt set in this file.

The workspace cap is 25 active prompts. `track-ai-answers` reads the set. It does not silently replace it.

## How a prompt gets in

- It is a question a buyer actually asks, in the buyer's words.
- The owner can point at a page that should be the citation.
- It is not a brand-only slogan unless the owner asked for a brand check.

## How a prompt leaves

Write the old prompt, the new prompt, and the date in the local file. When the list changes, rates start over from that date. Do not compare a new set with the old set and call the difference a win.

## What a report must show

`run_count`, `citation_count`, and `visibility_pct` from `visibility.prompt_metrics_list`. A probe hits ChatGPT only. Name another engine only when the tool lists it. If `run_count` and `inconclusive_run_count` are both 0, a `visibility_pct` of 0 is unmeasured, not a real zero.
