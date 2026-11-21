---
name: track-ai-answers
description: "Read the tracked prompt set, report runs and citations with real denominators, and start a ChatGPT probe only after a dry run and a yes. A prompt change starts rates over."
---
# Track AI answers

Report AI answers without inventing a rate. Follow `docs/skill-frame.md`.

## Use when

- The day report needs a fuller AI-answer line.
- The owner wants to change the 25 prompts.
- A quoted probe has a yes and you are reading the results.

## Steps

1. Read visibility.tracked_prompts.status and visibility.tracked_prompts.list (`references/set.md`).

2. Report run_count, citation_count, and visibility_pct from visibility.prompt_metrics_list, for ChatGPT unless a tool names another engine (`references/report.md`).

3. When run_count and inconclusive_run_count are both 0, write unmeasured, and do not treat visibility_pct 0 as a rate (`references/report.md`).

4. Propose set changes in a note, and say that rates start over from that date (`references/revise.md`).

5. Dry-run visibility.probe.start, show 148 credits, quote first, wait for the owner's yes, then read visibility.probe.latest and call status and results with that batch_id (`references/probe.md`).

6. Save the revision note for Knowledge under the seat folder, with no secrets (`references/save.md`).

## Capabilities

- `visibility.tracked_prompts.status`
- `visibility.tracked_prompts.list`
- `visibility.prompt_metrics_list`
- `visibility.probe.start`
- `visibility.probe.latest`
- `visibility.probe.status`
- `visibility.probe.results`
- `visibility.probe.recommendations`
- `visibility.citations`

## Stop

- Always quote first, wait for the owner's yes, before visibility.probe.start.
- The cap is 25 active prompts. Do not propose a 26th without removing one.
- When both run counts are 0, visibility_pct 0 is unmeasured, not a rate.
- Do not compare two different prompt sets as if they were one baseline.
