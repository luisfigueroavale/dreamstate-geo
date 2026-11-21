# Search Console

Call `visibility.keywords_get` once, with `days` 28. Keep the top 25 queries, with clicks, impressions, and position. There is no URL on those rows and no second call for the previous window: `prev_impressions`, `prev_clicks`, and `prev_avg_position` are already in the response. Drop queries on the leave-alone list.

If `state` is `not_connected` or `auth_expired`, write "not measured" and stop. Do not write zero.

Pages in positions 11 to 20 come from the Pages CSV in `search.local/exports/`, not from this call. Those pages go to `refresh-ranking-page`, not to a new URL, unless the owner says the page is the wrong type.
