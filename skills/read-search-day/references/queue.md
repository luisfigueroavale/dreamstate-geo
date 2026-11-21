# Queues

From `search.local/changes.json`, a change is due when today is at least 14, 28, or 56 days after `first_crawled_on`, plus the 3 day lag in `docs/measuring.md`. List the id, the page, and which reading is due. Do not compute the verdict here. That is `read-experiments`.

Page position is not in Dreamstate. Read the Pages CSV the owner saved in `search.local/exports/`. List priority pages whose position is 11 to 20. Those are the refresh queue. If the export is missing, say the page-two queue is not measured. Do not fill it from `visibility.keywords_get`.

From `search.local/plan.md`, list priority URLs that do not appear in the sitemap `urls` list. Check `sitemap.ok` first. `urls` is only the first 200 of up to 5000, so a missing URL is not proof of absence when the sitemap is longer than that list. Do not claim a page is unindexed for any reason the sitemap read did not show.
