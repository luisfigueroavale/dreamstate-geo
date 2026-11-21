---
name: track-ai-answers
description: "Read the tracked prompt set, report runs and citations with real denominators, and start a probe only after a quote and a yes. A prompt change starts a new baseline."
---
# Track AI answers

Report AI answers without inventing a rate. Follow `docs/skill-frame.md`.

## Use when

- The day report needs a fuller AI-answer line.
- The owner wants to change the 25 prompts.
- A quoted probe has a yes and you are reading the results.

## Steps

1. Read visibility.tracked_prompts.status and visibility.tracked_prompts.list (`references/set.md`).

2. Report completed runs, mentions, citations, and the percentage, per engine and per locale (`references/report.md`).

3. When completed runs are zero, write unavailable, and do not write 0% (`references/report.md`).

4. Propose set changes in a note, and say that a revision starts a new baseline (`references/revise.md`).

5. Run a probe only after you quote visibility.probe.start and wait for the owner's yes, then read visibility.probe.status and visibility.probe.results (`references/probe.md`).

6. Save the revision note for Knowledge under the seat folder, with no secrets (`references/save.md`).

## Capabilities

- `visibility.tracked_prompts.status`
- `visibility.tracked_prompts.list`
- `visibility.probe.start`
- `visibility.probe.status`
- `visibility.probe.results`
- `visibility.citations`

## Stop

- Always quote first, wait for the owner's yes, before visibility.probe.start.
- The cap is 25 active prompts. Do not propose a 26th without removing one.
- Zero runs is unavailable, not 0%.
- Do not compare two different prompt sets as if they were one baseline.
