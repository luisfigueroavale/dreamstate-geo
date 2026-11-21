# Tool map

This build did not call `tools_get`. Every id below is unconfirmed. Costs are the ones named in the build plan. A live workspace may differ. The fetched schema wins over this page. Do not invent a parameter list from this file.

Inputs: unconfirmed. Read the schema from `tools_get` before a call, and use that schema.

## How a call runs

1. `tools_get` the id.
2. If the call spends credits or has an outward effect, use a dry run when that mode exists, show the quote, and wait.
3. The live call repeats `quote_hash`, sets `max_credits`, and sends a new `idempotency_key`.
4. A free read that does not support a dry run runs live. Say that it was a read.
5. If `tools_get` returns not found, stop. Do not invent a replacement id.

## Capability index

| Id | Plan cost | Consent |
|---|---|---|
| `whoami` | Free | Read. Confirms the workspace. |
| `knowledge.context.resolve` | Free | Read Company Context. Do not paste the pages into a tracked file. |
| `visibility.workspace_site_get` | Free | Read. Confirms the site on the workspace. |
| `visibility.keywords_get` | Free | Read Search Console queries, clicks, impressions, and position. |
| `visibility.overview` | Free | Read the overview numbers for the day report. |
| `visibility.citations` | Free | Read pages AI answers cite. |
| `visibility.sitemap_get` | Free | Read the sitemap the workspace already has. |
| `visibility.seo.robots_audit` | Free | Read robots rules and AI crawler access. |
| `visibility.pagespeed_get` | Free | Read page speed. |
| `visibility.html_analysis_get` | Free | Read homepage HTML and structured data. |
| `visibility.tracked_prompts.status` | Free | Read how many tracked prompts are active, and the last run. |
| `visibility.tracked_prompts.list` | Free | Read the prompt set. |
| `visibility.probe.status` | Free | Read whether a probe finished. |
| `visibility.probe.results` | Free | Read mentions and citations from a probe that already ran. |
| `visibility.research.web_search` | 2 credits | Paid. Quote first, wait for the owner's yes. |
| `visibility.research.urls_fetch` | 1 credit a page | Paid. Quote first, wait for the owner's yes. |
| `visibility.site_scan` | Quoted | Paid. Only when the cache is stale, and only after a yes. |
| `visibility.probe.start` | Quoted each time | Paid. Starts a probe. Quote first, wait for the owner's yes. |

Bare ids: `whoami`, `search_posts_all`, `get_users_posts`

`search_posts_all` and `get_users_posts` are public X reads the agent host already has. They are read-only. `derive-voice-rules` uses them for the owner's own posts. Do not post, like, follow, or send a direct message through them. Cost in the plan: free.

## Paid ids

These calls need the sentence "quote first, wait for the owner's yes" in the skill that names them.

- `visibility.research.web_search` at 2 credits a search. Weekly cap is the number in `search.local/plan.md`.
- `visibility.research.urls_fetch` at 1 credit a page.
- `visibility.site_scan` quoted, and only when the cache is stale.
- `visibility.probe.start` quoted each time. Then read `visibility.probe.status` and `visibility.probe.results`.

## What this desk does not call

No send, no post, no delete, and no deploy. Indexing is a list of links for the owner to click. An IndexNow push, if the owner wants one, happens only after a separate yes, and this repo stores no key.
