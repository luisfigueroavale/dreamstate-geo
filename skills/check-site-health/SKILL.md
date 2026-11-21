---
name: check-site-health
description: "Report robots and AI crawler access, the sitemap, page speed, and homepage HTML and structured data as separate checks. A full scan is quoted and only runs when the cache is stale."
---
# Check site health

Read site health one check at a time. Follow `docs/skill-frame.md`.

## Use when

- The week plan needs a health fix.
- Setup wants a first look at crawler access.

## Steps

1. Call visibility.seo.robots_audit and report AI crawler access on its own line (`references/robots.md`).

2. Call visibility.sitemap_get and report sitemap coverage on its own line (`references/sitemap.md`).

3. Call visibility.pagespeed_get and report speed on its own line (`references/speed.md`).

4. Call visibility.html_analysis_get and report HTML and structured data on its own line (`references/html.md`).

5. Call visibility.site_scan only when the cache is stale, and only after you quote first, wait for the owner's yes (`references/scan.md`).

6. Write one finding per check under work/health/ and do not bundle them into a single pass or fail (`references/report.md`).

## Capabilities

- `visibility.seo.robots_audit`
- `visibility.sitemap_get`
- `visibility.pagespeed_get`
- `visibility.html_analysis_get`
- `visibility.site_scan`

## Stop

- Always quote first, wait for the owner's yes, before visibility.site_scan.
- A free read does not become a scan.
- Do not hide one failing check inside a green summary.
- Do not change the site in this skill. A fix is a separate packet.
