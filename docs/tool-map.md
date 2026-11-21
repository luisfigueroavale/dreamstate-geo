# Tool map

These contracts were checked live. A freshly fetched schema still wins over this page. Call `tools_get` before `tools_run`. If the fetch says not found, stop. Do not invent an id or a field.

## How a call runs

1. `tools_get` the id.
2. A call that spends credits, or that changes stored data, starts as a dry run when that mode exists. Show the preview and the price, then wait.
3. The live call repeats `quote_hash` when the dry run returned one, sets `max_credits`, and sends a new `idempotency_key`.
4. A free read with no dry run can run live. Say that it was a read.
5. `knowledge.context.resolve` has `smoke_test` and `live`, and no dry run.

## Capability index

| Id | Cost | Inputs | Returns |
|---|---|---|---|
| `whoami` | Free | None. This is a bare MCP tool, not a catalog id. | The workspace list for this sign-in. |
| `knowledge.context.resolve` | 0 credits | Optional `purpose`, `brain_section_keys`, `brain_query_terms`, `brain_claim_limit`. Omit `purpose` when you want company context. | The company context pages you asked for. |
| `visibility.workspace_site_get` | 0 credits | None. | The site configured on the workspace. |
| `visibility.keywords_get` | 0 credits | Optional `days` from 1 to 180. Default is 30. Pass 28 for this desk. | One window, plus the previous window of the same length (`prev_impressions`, `prev_clicks`, `prev_avg_position`), and the top 25 queries. No page rows, no daily series, no URL filter. |
| `visibility.refresh` | 0.8 credits an item, at most 400 items a call | Optional `query_ids`. | A paid refresh of Search Console rows. Quote first, wait for the owner's yes. |
| `visibility.overview` | 0 credits | None. | Headline AI visibility from stored probe runs. A bounded sample. Not Search Console. |
| `visibility.citations` | 0 credits | None. | Citations already stored. This read does not start a collection. |
| `visibility.sitemap_get` | 0 credits | None. | `sitemap.ok`, and `urls` (the first 200, out of up to 5000). |
| `visibility.seo.robots_audit` | 0 credits | Optional `url` on the brand host. | Robots rules and crawler access for that host. |
| `visibility.pagespeed_get` | 0 credits | Optional `strategy`: `mobile` (default) or `desktop`. | Speed figures. `is_stale` is true when a strategy is missing or older than 25 hours. |
| `visibility.html_analysis_get` | 0 credits | None. | A cached analysis of the homepage. |
| `visibility.site_scan` | 0 credits | Optional `url`. Modes: `smoke_test`, `dry_run`, `live`. Live needs an `idempotency_key`. | Refreshes cached site data with real fetches. Not a paid call. Still dry-run it, show the preview, and wait for a yes. Run it only when `pagespeed_get` says `is_stale`. |
| `visibility.tracked_prompts.status` | 0 credits | None. | `state`, `active_prompt_count`, cap 25, `last_probed_at`. No mention rate and no citation rate. |
| `visibility.tracked_prompts.list` | 0 credits | Optional `include_inactive`, `limit` (1 to 100, default 25), `offset`. | The prompt rows. |
| `visibility.prompt_metrics_list` | 0 credits | Optional `limit` (1 to 200) and `cursor`. | `run_count`, `citation_count`, `visibility_pct`, `last_probed_at_by_engine`. If `run_count` and `inconclusive_run_count` are both 0, a `visibility_pct` of 0 means unmeasured. |
| `visibility.probe.latest` | 0 credits | None. | `batch_id`. `batch` is null when there is no batch. |
| `visibility.probe.start` | 148 credits a call | None. Needs a user-bound actor, published brand context, and at least one active tracked prompt. | Starts one batch. Only one batch runs at a time. A 409 `probe_already_running` returns the existing `batch_id`. Up to 20 prompts, 8 variants, ChatGPT only. No engine choice. Dry-run it, show 148 credits, and wait for a yes. |
| `visibility.probe.status` | 0 credits | `batch_id` (UUID), required. | Whether that batch has finished. |
| `visibility.probe.results` | 0 credits | `batch_id` (UUID), required. | Rows from that batch. |
| `visibility.probe.recommendations` | 0 credits | `batch_id` (UUID), required. | Recommendations for that batch. |
| `visibility.research.web_search` | 4 credits a call | `query`, required. Optional `max_results` (1 to 10, default 10), `include_text`, `include_domains`, `category`. | Search results for that query. |
| `visibility.research.urls_fetch` | 2 credits a call, for 1 to 5 URLs | `urls`, required. Optional `max_characters` (500 to 15000, default 8000), `livecrawl`, `include_summary`. | Page text. Batch up to 5 URLs in one call. |

## Bare ids

Bare ids: `whoami`, `search_posts_all`, `get_users_posts`

`whoami` is the MCP tool above. It is not a Dreamstate catalog id.

`search_posts_all` and `get_users_posts` are public X reads on the agent host. They are not Dreamstate ids. `derive-voice-rules` uses them for the owner's own posts. They stay read-only. Do not post, like, follow, or send a direct message through them.

## Page rows from Search Console

`visibility.keywords_get` does not return a row per page. For the page-two queue and for per-page readings, the owner downloads the free Search Console Pages CSV and Queries CSV into `search.local/exports/`. Git ignores that folder. Skills read those files. They do not invent a page row from the keyword call.

When `visibility.keywords_get` comes back with `state` of `not_connected` or `auth_expired`, the metrics are null. Write "not measured". Do not write zero.

## Zero credit calls that still wait

The site scan costs nothing and still waits for a yes, because it fetches pages into the cache. See the index row. It is not a paid id.

## Paid ids

These calls need the sentence "quote first, wait for the owner's yes" in the skill that names them.

- `visibility.research.web_search` at 4 credits a call. The weekly cap is the number in `search.local/plan.md`.
- `visibility.research.urls_fetch` at 2 credits a call, covering 1 to 5 URLs.
- `visibility.refresh` at 0.8 credits an item, at most 400 items a call.
- `visibility.probe.start` at 148 credits a call. Dry-run first, show 148, then wait. After a yes, read `visibility.probe.latest`, then `visibility.probe.status` and `visibility.probe.results` with that `batch_id`.

## What this desk does not call

No send, no post, no delete, and no deploy. Indexing is a list of links for the owner to click. An IndexNow push, if the owner wants one, happens only after a separate yes, and this repo stores no key.
