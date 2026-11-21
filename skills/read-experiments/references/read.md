# Read

Open `search.local/changes.json`. Skip rows that are still `example: true` or that have no `first_crawled_on`.

Call `visibility.keywords_get` and build `work/rows.json` in the shape `scripts/read-changes.mjs` expects: pages, each with `url`, `page_type`, and `days` of `date`, `clicks`, `impressions`, and `position`. Include unchanged pages of the same types so the control group exists. Use only figures the tool returned.
