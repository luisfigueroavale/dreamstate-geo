# Queues

From `search.local/changes.json`, a change is due when today is at least 14, 28, or 56 days after `first_crawled_on`, plus the 3 day lag in `docs/measuring.md`. List the id, the page, and which reading is due. Do not compute the verdict here. That is `read-experiments`.

From the keyword read, list queries for priority pages whose position is 11 to 20. Those are the refresh queue.

From `search.local/plan.md`, list priority URLs that do not appear in the sitemap read. Those are the indexing list. Do not claim a page is unindexed for any reason the sitemap read did not show.
