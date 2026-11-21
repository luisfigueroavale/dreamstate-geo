# Scoreboard

Call `visibility.keywords_get` twice: the latest 28 days, and the 28 days before those. Call `visibility.overview`, `visibility.citations`, and `visibility.sitemap_get` once each. These are free reads.

For each metric in `search.local/targets.json`, write the figure the tool returned, the source id, and the dates. If the tool did not return that figure, write unknown.

Non-brand clicks and impressions drop queries the owner listed as brand in the plan. If that list is empty, say the non-brand totals are not split yet. Do not invent the split.
