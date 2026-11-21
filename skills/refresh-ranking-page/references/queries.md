# Queries

Dreamstate has no per-page Search Console rows. Read the Pages CSV and the Queries CSV in `search.local/exports/`. Keep pages whose position is from 11 to 20, and keep the queries the export ties to that URL.

Write the query, impressions, clicks, and position into the pull request body, with the export filename and the date range on the file.

If the export is missing, or it has no row for this URL, stop. Do not refresh a page from `visibility.keywords_get`. That call cannot filter by URL.
