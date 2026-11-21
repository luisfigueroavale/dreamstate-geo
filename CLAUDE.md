# Agent contract

This folder is the search desk for one owner. Dreamstate is the system of record for site data, company facts, and the history worth keeping. Files in this repo are the method, the skills, and the blank templates. Codex is the preferred agent. Claude Code follows this same file.

Read [docs/start-here.md](docs/start-here.md), then [brand/AGENTS.md](brand/AGENTS.md), then [audience/AGENTS.md](audience/AGENTS.md). A missing or blank required file under `brand.local/`, `audience.local/`, or `search.local/` means stop and ask. Do not guess.

Company facts come from Company Context through `knowledge.context.resolve`. History that should last goes to Dreamstate Knowledge, in the seat folder `18 Search & AI Answers`. Approvals follow `docs/rules.md` in `luisfigueroavale/dreamstate-gtm-team`. Search rules for this desk are [docs/search-rules.md](docs/search-rules.md).

## Workspace

Call `whoami` before the first Dreamstate read in a session. If more than one workspace is listed, ask which one and stop until the owner names it. The server is the single URL in [.mcp.json](.mcp.json). Do not add a second server. Do not paste a key. Sign in through the browser.

`tools_get` the capability before every `tools_run`. The schema you just fetched wins over this repo. Every id in [docs/tool-map.md](docs/tool-map.md) was unconfirmed at the time this repo was written. If `tools_get` returns not found, stop. Do not invent an id.

## Consent

Nothing publishes a page, merges a pull request, posts, sends a message, drives a Google session, or spends credits without the owner's yes on that item. A paid call is quoted first. Show the quote and wait. Unknown is not zero. Do not invent a fact or a number.

A local draft, a brief, or a pull request that is waiting for review is allowed. Say that nothing has shipped.

## Files

Do not commit `brand.local/`, `audience.local/`, `search.local/`, `.banned-terms.local`, `work/`, or any key or `.env` file. The templates in `brand/`, `audience/`, `search/`, and `briefs/` stay blank.

## Checks

Run `npm run check` and `npm test` before you say a change is done. `npm run check -- --strict` needs `.banned-terms.local` on the machine, one name per line.
