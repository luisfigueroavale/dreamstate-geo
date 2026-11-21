# Measuring

Numbers come from a tool. Unknown is not zero. The script that applies this page is `scripts/read-changes.mjs`. The thresholds live in `scripts/reading-rules.json` and are repeated here.

## Windows

Search Console lags about 2 days. Every window ends 3 days before the day you run the reading. The before window and the after window have the same number of days.

Site-wide totals come from one `visibility.keywords_get` call with `days` 28. That call has no page rows. Per-page clicks, impressions, and position come from the owner's Search Console Pages and Queries CSVs in `search.local/exports/`.

Readings happen at 14, 28, and 56 days after the first crawl that follows the change.

- 14 days is early. It can change what you pick next. It is not a final verdict.
- 28 days is a full reading.
- 56 days is the final reading.

A reading is due only when the whole after window sits inside the usable data, the data that ends 3 days back.

## Control group

Each reading also totals the unchanged pages of the same page type. A page is unchanged when it is not in the change list. The script sums clicks and impressions across those pages, then computes one rate. It does not average the rates.

The rate is clicks divided by impressions.

Adjusted rate = (page after rate, minus page before rate) minus (control after rate, minus control before rate).

A site-wide swing shows up in the control. The verdict uses the adjusted rate, so that swing is not credited to one edit.

## Minimum data

Under 100 impressions in the page before window, the page after window, the control before window, or the control after window is `too little data`. No control pages of that type is also `too little data`.

## Verdicts

Thresholds, on the adjusted click rate:

| Adjusted rate | Verdict |
|---|---|
| 0.005 or higher | `better` |
| -0.005 or lower | `worse` |
| between those | `no clear change` |
| under 100 impressions, or no control | `too little data` |

Position is reported as an impression-weighted average. It does not pick the verdict.

## Pause a kind of change

After two full readings of the same kind that are `no clear change` or `worse`, stop queuing that kind until the owner says to try again. A full reading is the 28 day window. A 14 day reading does not count. `too little data` does not count.

## AI answers

Read `visibility.prompt_metrics_list` for `run_count`, `citation_count`, and `visibility_pct`. A probe hits ChatGPT only. Name another engine only when `last_probed_at_by_engine` actually lists it. Do not invent a locale split.

If `run_count` and `inconclusive_run_count` are both 0, a `visibility_pct` of 0 is unmeasured. Do not publish that 0 as a rate. When the prompt list changes, rates start over from that date, and the note says so. The cap on tracked prompts is 25.

## Targets

`search/targets.json` holds six metrics. Each names a source capability, a baseline, a target, and the dates. The blank file leaves the numbers null. Fill `search.local/targets.json` only with figures a tool returned.

| Metric | Source |
|---|---|
| `answer_mention_rate` | `visibility.prompt_metrics_list` |
| `answer_citation_share` | `visibility.citations` |
| `nonbrand_clicks_28d` | `visibility.keywords_get` |
| `nonbrand_impressions_28d` | `visibility.keywords_get` |
| `queries_in_top10` | `visibility.keywords_get` |
| `priority_pages_indexed_pct` | `visibility.sitemap_get` |
