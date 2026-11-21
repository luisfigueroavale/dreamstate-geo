---
name: read-search-day
description: "Write the daily search report from free Dreamstate reads: the targets, changes due for a reading, page-two queries, pages missing from the index, and one AI-answer line."
---
# Read the search day

Write one day report from free reads. Follow `docs/skill-frame.md`.

## Use when

- The weekday rollup needs a search line.
- You are about to plan the week and need a fresh read.
- Setup just finished and this is the first report.

## Steps

1. Read search.local/plan.md and search.local/targets.json, and stop if the plan file is missing (`references/read.md`).

2. Call visibility.keywords_get once with days 28, which also returns the previous window (`references/scoreboard.md`).

3. Call visibility.overview, visibility.citations, and visibility.sitemap_get (`references/scoreboard.md`).

4. Score the six targets, and write unknown where a tool did not return a figure (`references/scoreboard.md`).

5. List changes that are due for a 14, 28, or 56 day reading, and list pages in positions 11 to 20 from the Search Console export (`references/queue.md`).

6. List priority pages that the sitemap read does not contain (`references/queue.md`).

7. Write one AI-answer line from visibility.prompt_metrics_list, and treat a 0 rate as unmeasured when both run counts are 0 (`references/answers.md`).

8. Save the report under work/day/ and hand it back without spending (`references/handback.md`).

## Capabilities

- `visibility.keywords_get`
- `visibility.refresh`
- `visibility.overview`
- `visibility.citations`
- `visibility.sitemap_get`
- `visibility.prompt_metrics_list`
- `visibility.probe.latest`
- `visibility.probe.results`

## Stop

- Do not turn a missing figure into zero. A null keyword metric is "not measured".
- Do not call `visibility.refresh` unless the owner asked. If you do, quote first, wait for the owner's yes.
- Do not start a probe in this skill.
- Do not open a pull request in this skill.
- Brand queries stay in the raw read. Non-brand totals use only the filter the owner wrote in the plan.
