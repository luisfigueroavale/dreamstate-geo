# Dreamstate GEO

**Agent skills that help your site show up on Google and get named when an AI answer is written, run on Dreamstate.**

GEO means generative engine optimization. It is SEO for AI answers. An answer engine searches the web, then quotes a short passage from a page. The pages it quotes are indexed, answer the question in the first lines, answer again under every heading, and back each fact with a source. The plain map is [docs/start-here.md](docs/start-here.md).

Codex is the preferred agent. Claude Code uses the same [AGENTS.md](AGENTS.md).

## Who it is for

A founder or a small team that already uses Dreamstate and wants search and AI-answer work run from a folder. A person approves every page that goes live and every message that goes out. You do not need a separate keyword account, a rank tracker, or a Google service account. Search Console, tracked prompts, crawl checks, and page fetches come through Dreamstate.

## What the agent will not do

It will not publish a page, merge, post, send, request anything in your Google account, or spend credits without your yes on that item. It will not invent a fact or a number. Unknown stays unknown. The rules are in [AGENTS.md](AGENTS.md) and [docs/search-rules.md](docs/search-rules.md).

## The first 30 minutes

1. Install the Dreamstate plugin if it is not installed: `npx @trydreamstate/cli install`. Sign in in the browser. Do not paste a key. The server URL is in [.mcp.json](.mcp.json).
2. Open this folder in Codex or Claude Code and run `set-up-search-desk`. It calls `whoami` and confirms the workspace. If you have more than one workspace, name the one this folder should use.
3. Copy and fill the local brand and reader files. The agent stops if a required file is missing or still says `Status: blank`.

   ```sh
   mkdir -p brand.local/assets audience.local
   cp brand/identity.md brand/voice.md brand/style.md brand/tokens.css brand.local/
   cp brand/assets/README.md brand.local/assets/README.md
   cp audience/ideal-reader.md audience.local/ideal-reader.md
   ```

4. Give your X handle and LinkedIn profile URL. `derive-voice-rules` learns your voice from your own posts and writes neither value into a tracked file.
5. Copy the search templates and fill the plan with the agent: `cp -r search search.local`. Company facts stay in Company Context. The plan only points at them.
6. The agent reads Search Console totals, tracked prompts, and site health from Dreamstate. Those reads are free. For page-level rows, download the free Search Console Pages and Queries CSVs into `search.local/exports/`. The agent writes your first day report under `work/`.
7. It briefs your first comparison page. You write that first page yourself. It becomes the model for the rest.
8. From this folder, run `npm install` and `npm run check`.
9. Stop. Nothing has shipped.

## How a day moves

`read-search-day` writes a short report: the six targets, changes due for a reading, queries in positions 11 to 20, priority pages missing from the sitemap, and one AI-answer line. That line rides the weekday 08:00 rollup. This desk does not add a second routine.

## How a week moves

`plan-search-week` picks at most four pieces: refreshes first, then one new page, one health fix, and one outreach batch. Each piece is a Chief of Staff packet (Goal, Inputs, Skill, Guardrails) run in its own git worktree. Site edits land as a pull request. Merge waits for a yes. The longer version is [docs/how-a-week-moves.md](docs/how-a-week-moves.md). The method is [docs/method.md](docs/method.md).

## Skills

| Skill | Step | What it does | What it costs |
|---|---|---|---|
| `set-up-search-desk` | Setup | Confirms the workspace, copies templates, runs voice setup, writes the first report | Free |
| `derive-voice-rules` | Setup | Learns voice rules from your own posts | Free |
| `read-search-day` | Daily read | Targets, due readings, page-two queue, index gaps, AI-answer line | Free |
| `plan-search-week` | Plan | Up to four packets for the week | Free |
| `find-search-topics` | Research | Topics from your material, then Search Console, then a quoted search | 4 credits a search call, quoted first, cap in the plan |
| `write-search-brief` | Brief | One brief, checked by `brief-check.mjs` | 2 credits a fetch call (up to 5 URLs), quoted first |
| `write-search-page` | Write | Drafts the page in your voice | Free |
| `review-search-page` | Check | A second agent lints, scores, and returns PASS or FAIL | 2 credits a fetch call only if a source must be re-read, quoted |
| `refresh-ranking-page` | Refresh | One new section for queries in positions 11 to 20, as a pull request | Free |
| `check-site-health` | Health | Robots, sitemap, speed, and HTML, each on its own line | Free. A scan costs 0 credits, refreshes the cache, and waits for a yes |
| `queue-indexing` | Index | A list of links. You click Request indexing | Free |
| `track-ai-answers` | Measure | The 25 prompts, with real denominators. A probe is ChatGPT only | 148 credits a probe, dry-run first |
| `read-experiments` | Learn | Verdicts with a control group. Pauses a kind after two flat or worse full readings | Free |
| `prepare-link-outreach` | Links | One pitch and one follow-up per target. Drafts only | 2 credits a fetch call (up to 5 URLs), quoted |

The index is [skills/README.md](skills/README.md). Costs, inputs, and consent for every id are in [docs/tool-map.md](docs/tool-map.md). A freshly fetched schema still wins over that page.

## Map

| Path | What it is |
|---|---|
| [AGENTS.md](AGENTS.md) | Rules for Codex and Claude Code |
| [docs/](docs/start-here.md) | Method, measuring, rules, the tool map |
| [skills/](skills/README.md) | One skill per job |
| [search/](search/README.md) | Blank plan, targets, and the example change |
| [briefs/](briefs/compare.md) | Compare, roundup, and how-to templates |
| [scripts/](scripts/check.mjs) | Repo check, page lint, brief check, experiment reader |
| [examples/sample-site/](examples/sample-site/README.md) | A fictional company, marked fictional |
| [brand/](brand/AGENTS.md) | Blank templates. Your copy is `brand.local/` |
| [audience/](audience/AGENTS.md) | Blank reader template. Your copy is `audience.local/` |

## Names you never want in the repo

Put them in `.banned-terms.local`, one name per line. Blank lines and lines that start with `#` are ignored. Git does not track the file. `npm run check` scans tracked text for those names when the file is present. A git worktree has no copy of the file, so the check reads the main checkout's copy instead. When neither exists it prints `BANNED-TERM SCAN SKIPPED` and continues. `npm run check -- --strict` fails in that case.

## Part of the Dreamstate GTM team

This repo is the search desk. The seats and the rollup live next door.

| Repo | What it is |
|---|---|
| [dreamstate-gtm-team](https://github.com/luisfigueroavale/dreamstate-gtm-team) | Seats, rules, and the 08:00 rollup |
| [dreamstate-linkedin-funnel](https://github.com/luisfigueroavale/dreamstate-linkedin-funnel) | Content desk, and the voice skill this repo copies |
| [dreamstate-design](https://github.com/luisfigueroavale/dreamstate-design) | Graphics, and the check workflow this repo follows |
| [dreamstate-plugins](https://github.com/luisfigueroavale/dreamstate-plugins) | Install path and the Dreamstate MCP server |
| [dreamstate-launch-videos](https://github.com/luisfigueroavale/dreamstate-launch-videos) | The public launch video library |

## License

[MIT](LICENSE). Copyright (c) 2026 Luis Vale.
