# Scoreboard

Call `visibility.keywords_get` once, with `days` set to 28. That single response is the current 28 days plus the previous 28 days (`prev_impressions`, `prev_clicks`, `prev_avg_position`) and the top 25 queries. Do not call it a second time. It has no page rows, no daily series, and no URL filter.

Also call `visibility.overview`, `visibility.citations`, and `visibility.sitemap_get` once each. These reads cost 0 credits. `visibility.overview` is AI visibility from stored probes, not Search Console.

If `state` is `not_connected` or `auth_expired`, the keyword metrics are null. Write "not measured". Do not write zero.

`visibility.refresh` is separate. It costs 0.8 credits an item, up to 400 items a call, and takes optional `query_ids`. Do not call it unless the owner asked. Quote first, wait for the owner's yes.

For each metric in `search.local/targets.json`, write the figure the tool returned, the source id, and the dates. If the tool did not return that figure, write unknown.

Non-brand clicks and impressions drop queries the owner listed as brand in the plan. The keyword call only has the top 25 queries, so say when the split is limited to those. If the brand list is empty, say the non-brand totals are not split yet. Do not invent the split.
