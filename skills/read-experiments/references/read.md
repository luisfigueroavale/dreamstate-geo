# Read

Open `search.local/changes.json`. Skip rows that are still `example: true` or that have no `first_crawled_on`.

Dreamstate does not return Search Console rows per page. Read the Pages CSV (and the Queries CSV when you need the wording) from `search.local/exports/`. Build `work/rows.json` in the shape `scripts/read-changes.mjs` expects: pages, each with `url`, `page_type`, and `days` of `date`, `clicks`, `impressions`, and `position`.

If the export has a date on each row, use that date. If it is one total for a range, ask the owner for two exports with equal ranges, one before the crawl and one after, and place each total on the first day of its window. Say that in the verdict note. Do not invent days the file does not contain.

Include unchanged pages of the same type so the control group exists. Use only figures the export shows. If the folder is empty, stop and say the reading is not measured.
