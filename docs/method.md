# Method

The desk has one method. Write one page yourself. Brief the rest. Check with a second pass. Ship as a pull request. Measure the change against pages you did not touch.

## 1. Learn the voice first

`derive-voice-rules` reads the owner's own posts and writes rules into `brand.local/voice.md`. The handle and the profile URL stay in that local file. A page written before this step is a guess.

## 2. Read the site before you pick a topic

`read-search-day` pulls Search Console, citations, the sitemap, and the tracked prompts. Those reads are free. The topic list starts from the owner's own material in Knowledge, then from queries the site already earns, then from a paid search only after a quote and a yes.

## 3. Write one page yourself

The first page is the model. You write it. The agent can brief it, and it can lint it, and it does not replace your draft. Later pages copy the shape, not a stock voice.

## 4. Brief the rest

One brief per page, from [briefs/](../briefs/). `write-search-brief` fills it. `scripts/brief-check.mjs` must say READY before anyone drafts the page. Every outside fact has the source page and the date it was read.

## 5. Check with a second agent

`review-search-page` is not the writer. It runs `scripts/page-lint.mjs`, then the rubric in that skill. PASS means no gate failed, the score is 24 of 30 or higher, and no area is below 3.

## 6. Ship as a pull request

A new page, a refresh, or a health fix lands as a pull request on the site repo. Merge waits for a yes. Nothing in this repo deploys the site.

## 7. Measure

`read-experiments` compares equal windows before and after the change, ending 3 days back, and subtracts the same windows for unchanged pages of the same type. Readings land at 14, 28, and 56 days after the first crawl. The rules are in [measuring.md](measuring.md).
