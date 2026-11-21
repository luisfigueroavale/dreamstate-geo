# Scan

`visibility.site_scan` costs 0 credits. It still changes the cache: it refreshes stored site data with real fetches. Optional input: `url`. Modes are `smoke_test`, `dry_run`, and `live`. A live call needs an `idempotency_key`.

Run it only when `visibility.pagespeed_get` reports `is_stale` (a strategy is missing, or the saved strategy is older than 25 hours). Dry-run it, show the preview, and wait for the owner's yes. Do not call it paid, and do not start it in the same breath as the free reads.
